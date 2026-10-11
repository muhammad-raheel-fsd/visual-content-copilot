"""
Voice finishing (production guide, section 3): ONE fast pass, never a loudness boost.

Muhammad sets the loudness himself before he sends the recording, so the output keeps the input's
loudness (LUFS) and only polishes it:
  1. EQ for a cleaner, "premium" voice: high-pass at 80 Hz (rumble, desk thumps), -2.5 dB at
     300 Hz (boxy room), +2.5 dB at 3.5 kHz (presence, clear consonants), +2 dB shelf above
     10 kHz (air);
  2. a gentle compressor (3:1 above 6 dB under the speech level) so loud and soft syllables sit
     together, and an expander that turns room tone between words down;
  3. makeup back to the input loudness, and a smooth lookahead limiter keeping every sample under
     -1.5 dBFS (the raw recording clips).
Remotion's ffmpeg has no EQ, compressor or limiter, hence numpy / scipy.

Usage (repo root):
  uv run --python 3.12 --with numpy --with scipy python pipeline/build/voice_master.py <recording> <out voice.wav>
"""
import os
import re
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

FF = "node_modules/.pnpm/@remotion+compositor-linux-x64-gnu@4.0.527/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = dict(os.environ, LD_LIBRARY_PATH=FF)
CEILING = 10 ** (-1.5 / 20)
SR = 48000


def ff(*args: str) -> str:
    return subprocess.run([f"{FF}/ffmpeg", "-hide_banner", "-nostats", "-y", *args], env=ENV, capture_output=True, text=True, check=True).stderr


def lufs(path: str) -> float:
    out = ff("-i", path, "-af", "loudnorm=print_format=summary", "-f", "null", "-")
    return float(re.search(r"Input Integrated:\s+(-?[\d.]+)", out).group(1))


def box(x: np.ndarray, n: int) -> np.ndarray:
    """centred moving average of length n"""
    c = np.cumsum(np.concatenate([np.zeros(1), x]))
    half = n // 2
    idx = np.arange(len(x))
    lo = np.clip(idx - half, 0, len(x))
    hi = np.clip(idx - half + n, 0, len(x))
    return (c[hi] - c[lo]) / np.maximum(1, hi - lo)


def running_min(x: np.ndarray, n: int) -> np.ndarray:
    """centred running minimum of length n (van Herk / Gil-Werman)"""
    half = n // 2
    pad = np.concatenate([np.full(half, 1.0), x, np.full(n, 1.0)])
    m = -(-len(pad) // n) * n
    pad = np.concatenate([pad, np.full(m - len(pad), 1.0)]).reshape(-1, n)
    pre = np.minimum.accumulate(pad, axis=1).ravel()
    suf = np.minimum.accumulate(pad[:, ::-1], axis=1)[:, ::-1].ravel()
    i = np.arange(len(x))
    return np.minimum(suf[i], pre[i + n - 1])


def biquad(kind: str, f0: float, gain_db: float = 0.0, q: float = 0.707) -> tuple[np.ndarray, np.ndarray]:
    """RBJ audio-EQ-cookbook biquad coefficients"""
    a_ = 10 ** (gain_db / 40)
    w0 = 2 * np.pi * f0 / SR
    alpha = np.sin(w0) / (2 * q)
    c = np.cos(w0)
    if kind == "highpass":
        b = [(1 + c) / 2, -(1 + c), (1 + c) / 2]
        a = [1 + alpha, -2 * c, 1 - alpha]
    elif kind == "peak":
        b = [1 + alpha * a_, -2 * c, 1 - alpha * a_]
        a = [1 + alpha / a_, -2 * c, 1 - alpha / a_]
    else:  # highshelf
        sq = 2 * np.sqrt(a_) * alpha
        b = [a_ * ((a_ + 1) + (a_ - 1) * c + sq), -2 * a_ * ((a_ - 1) + (a_ + 1) * c), a_ * ((a_ + 1) + (a_ - 1) * c - sq)]
        a = [(a_ + 1) - (a_ - 1) * c + sq, 2 * ((a_ - 1) - (a_ + 1) * c), (a_ + 1) - (a_ - 1) * c - sq]
    return np.array(b) / a[0], np.array(a) / a[0]


EQ = [("highpass", 80, 0.0, 0.707), ("peak", 300, -2.5, 1.0), ("peak", 3500, 2.5, 1.0), ("highshelf", 10000, 2.0, 0.707)]


def equalize(x: np.ndarray) -> np.ndarray:
    for kind, f0, g, q in EQ:
        b, a = biquad(kind, f0, g, q)
        x = lfilter(b, a, x)
    return x


def compress(x: np.ndarray, threshold_db: float, ratio: float = 3.0) -> np.ndarray:
    """gentle RMS compressor + expander (30 ms envelope, 20 ms smoothing): evens out syllables"""
    env = np.sqrt(box(x * x, int(0.03 * SR))) + 1e-9
    env_db = 20 * np.log10(env)
    over = np.maximum(0.0, env_db - threshold_db)
    # 30 dB under the threshold (room tone between words): turn down 1:2, so makeup does not lift hiss
    under = np.minimum(0.0, env_db - (threshold_db - 30.0))
    g_db = box(-over * (1 - 1 / ratio) + under, int(0.02 * SR))
    return x * 10 ** (g_db / 20)


def limit(x: np.ndarray, gain: float) -> np.ndarray:
    y = x * gain
    need = np.minimum(1.0, CEILING / np.maximum(np.abs(y), 1e-9))
    w1, w2 = int(0.003 * SR), int(0.015 * SR)
    g = box(box(running_min(need, w1 + w2 + 2), w1), w2)  # smooth, and never above `need`
    return y * g


def write(path: str, y: np.ndarray) -> None:
    o = wave.open(path, "wb")
    o.setnchannels(1)
    o.setsampwidth(2)
    o.setframerate(SR)
    o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes())
    o.close()


def main(src: str, dst: str) -> None:
    tmp = dst + ".tmp.wav"
    ff("-i", src, "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", tmp)
    target = lufs(tmp)  # keep Muhammad's loudness
    w = wave.open(tmp)
    raw = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    # speech level: the median of the loud 30 ms windows
    env_db = 20 * np.log10(np.sqrt(box(raw * raw, int(0.03 * SR))) + 1e-9)
    speech_db = float(np.median(env_db[env_db > env_db.max() - 40]))
    x = compress(equalize(raw), threshold_db=speech_db - 6.0)
    probe = dst + ".probe.wav"
    write(probe, x)
    y = limit(x, 10 ** ((target - lufs(probe)) / 20))
    write(dst, y)
    print(f"input {target:.1f} LUFS -> {lufs(dst):.1f} LUFS, peak {20 * np.log10(np.abs(y).max()):.1f} dBFS")
    os.remove(probe)
    os.remove(tmp)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
