"""
Import the memes and meme sounds used by the faceless series into library/ (Remotion's
public dir), each one trimmed to its punchline and loudness-equalised first (production guide,
section 3: every sound is equalised before it is mixed).

The full collection Muhammad supplied stays in videos/source-clips/meme-and-sound-assets/
(gitignored, 835 MB: the Remotion bundle copies all of library/ on every render, so only the
files a video uses live there). Add an entry to ASSETS and re-run to import another one.

Run from the repo root: python3 pipeline/build/import-meme-assets.py
"""
import array
import math
import os
import subprocess
import sys
import wave

SRC = "videos/source-clips/meme-and-sound-assets"
FF = "node_modules/.pnpm/@remotion+compositor-linux-x64-gnu@4.0.527/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = dict(os.environ, LD_LIBRARY_PATH=FF)
TMP = ".whisper/_import.wav"

# Equalised loudness: the RMS of the voiced part (10 ms frames above -45 dBFS).
MEME_RMS = -18.0  # memes and meme sounds: under the voice (baked at about -10.5 LUFS)
BED_LUFS = -20  # a background bed, if one is ever imported (kind "bed"); none is used now

# (output under library/, source file, trim start s, trim end s or None, kind)
# Letterbox bars baked into a clip are cropped off (CROP, fractions of the height, top and
# bottom), so every meme shows as the raw picture with no black frame.
ASSETS = [
    ("memes/hawa-nikal-gayi.mp4", "Bas hawa nikal gayi meme template__ nayak interview meme.mp4", 0.0, None, "video"),
    ("memes/maza-aayega-bhidu.mp4", "Abhi Maza Aayega Na Bhidu.mp4", 1.25, None, "video"),
    ("memes/aaiye-dekhte-hain.mp4", "Aaiye_Dekhte_Hai_Maza_Aayega_Meme_Template_Video_Download.mp4", 0.0, 2.0, "video"),
    ("memes/shabash-beta.mp4", "Shabash Beta Bahut Badhiya Meme Template _ Kaleen Bhaiya.mp4", 0.0, None, "video"),
    ("memes/goku-ultra-instinct.mp4", "goku_ultra_instinct.gif", 0.0, None, "gif"),
    ("memes/kuch-gadbad-daya.mp4", "CID  Kuchh To Gadbad Hai Daya.mp4", 0.9, 3.0, "video"),
    ("sfx/meme-fah.wav", "johnnybacon156-fah-469417.mp3", 0.0, None, "sound"),
    ("sfx/meme-raja-ji-shaktiyan.wav", "Raja_Ji_Apni_Shaktiyo_Ka_Pura_Istemaal_Kar_Rahe_Ho_-_CarryMinati_Meme_Template_720p.mp4", 1.6, 6.35, "sound"),
    ("memes/carry-subscribe-karo.mp4", "19 meme by grow edit.mp4", 0.0, 7.65, "video"),
    # phase 02: Jim Carrey typing at full speed (played muted, our type.wav carries the sound)
    ("memes/typing-fast.mp4", "15 Meme By Grow Edit.mp4", 0.6, 3.1, "video"),
    # phase 02: the shocked "ah?" face, for "kabhi socha hai"
    ("memes/kya-socha.mp4", "10 meme by grow edit.mp4", 0.0, 2.3, "video"),
]


CROP = {
    "memes/hawa-nikal-gayi.mp4": (0.125, 0.125),
    "memes/shabash-beta.mp4": (0.086, 0.084),
}


def ff(*args: str) -> None:
    subprocess.run([f"{FF}/ffmpeg", "-y", "-loglevel", "error", *args], env=ENV, check=True)


def voiced_rms_and_peak(path: str, start: float, end: float | None) -> tuple[float, float]:
    trim = ["-ss", str(start)] + (["-t", str(end - start)] if end else [])
    ff(*trim, "-i", path, "-ac", "1", "-ar", "48000", "-sample_fmt", "s16", TMP)
    w = wave.open(TMP)
    pcm = array.array("h", w.readframes(w.getnframes()))
    hop = 480
    frames = [pcm[i:i + hop] for i in range(0, len(pcm) - hop, hop)]
    rms = [math.sqrt(sum(x * x for x in f) / hop) / 32768 for f in frames]
    loud = [r for r in rms if r > 10 ** (-45 / 20)] or rms
    voiced = 20 * math.log10(math.sqrt(sum(r * r for r in loud) / len(loud)) + 1e-12)
    peak = 20 * math.log10(max(abs(x) for x in pcm) / 32768 + 1e-12)
    return voiced, peak


# optional: only the outputs named on the command line (e.g. memes/kya-socha.mp4)
ONLY = set(sys.argv[1:])

for out, src, start, end, kind in ASSETS:
    if ONLY and out not in ONLY:
        continue
    path = os.path.join(SRC, src)
    dest = os.path.join("library", out)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    trim = ["-ss", str(start)] + (["-t", str(end - start)] if end else [])
    if kind == "gif":
        # silent clip; the GIF loops twice so the meme can hold for its whole cue
        ff("-stream_loop", "1", "-i", path, "-vf", "scale=-2:480,format=yuv420p", "-r", "30", "-c:v", "libx264", "-crf", "20", "-an", dest)
        print(f"{out}: silent video")
        continue
    if kind == "bed":
        ff("-i", path, "-af", f"loudnorm=I={BED_LUFS}:TP=-2:LRA=11", "-ar", "48000", "-c:a", "libmp3lame", "-b:a", "192k", dest)
        print(f"{out}: {BED_LUFS} LUFS")
        continue
    rms, peak = voiced_rms_and_peak(path, start, end)
    gain = min(MEME_RMS - rms, -1.0 - peak)  # never push a peak over -1 dBFS
    if kind == "sound":
        ff(*trim, "-i", path, "-af", f"volume={gain:.2f}dB", "-ac", "1", "-ar", "48000", dest)
    else:
        top, bottom = CROP.get(out, (0.0, 0.0))
        crop = f"crop=iw:trunc(ih*{1 - top - bottom:.4f}/2)*2:0:trunc(ih*{top:.4f}/2)*2," if top or bottom else ""
        ff(*trim, "-i", path, "-vf", f"{crop}scale=-2:720,format=yuv420p", "-r", "30", "-af", f"volume={gain:.2f}dB",
           "-c:v", "libx264", "-crf", "20", "-preset", "fast", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", dest)
    print(f"{out}: voiced {rms:.1f} dBFS, peak {peak:.1f} -> gain {gain:+.1f} dB")

os.remove(TMP)
