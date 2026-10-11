"""
Bake the cleaned voice into one WAV per transcript line (production guide, section 3).

Usage (repo root):
  python3 pipeline/build/render_voice_lines.py <lines.json> <voice.wav> <out dir under library/> <out .ts>
  e.g. python3 pipeline/build/render_voice_lines.py videos/transcripts/phase-01-lines.json \
         library/voiceover/phase-01/voice.wav library/voiceover/phase-01/lines \
         apps/remotion/videos/phase-01-who-controls-your-phone/voice-lines.ts

--verbatim (the default from phase 02 on; Muhammad, 2026-10-11: "never edit my words"): no line
files at all. Every line points into the untouched voice.wav at its "span" (from the alignment
script) and Remotion plays the recording as-is, split only where a meme pause is inserted.
Nothing inside the recording is cut, faded or re-timed. <out dir> is ignored in this mode.

Why files instead of trimming in Remotion (old, non-verbatim mode): Remotion applies trimBefore / trimAfter as a plain
timeline offset that ignores playbackRate, so a line at 1.1x played at 1.0x and lost the end of
its last word. Here every cut, fade and speed change is done once, offline, exactly:
  - each kept piece gets a 15 ms fade in and an 80 ms fade out (no clicks, no hard stops);
  - pieces of one line are joined with 0.12 s of silence;
  - the line's speed is applied with ffmpeg atempo (pitch stays natural).
Remotion then only plays each line file from its start.
"""
import array
import json
import math
import os
import subprocess
import sys
import wave

VERBATIM = "--verbatim" in sys.argv
args = [a for a in sys.argv[1:] if a != "--verbatim"]
lines_path, voice_path, out_dir, ts_path = args[:4]
FFMPEG_DIR = "node_modules/.pnpm/@remotion+compositor-linux-x64-gnu@4.0.527/node_modules/@remotion/compositor-linux-x64-gnu"
IN_LINE_GAP = 0.12
FADE_IN, FADE_OUT = 0.015, 0.08

spec = json.load(open(lines_path))
w = wave.open(voice_path)
sr, ch, width = w.getframerate(), w.getnchannels(), w.getsampwidth()
assert ch == 1 and width == 2, "expects mono 16-bit (voice.wav from the normalise step)"
pcm = array.array("h", w.readframes(w.getnframes()))
os.makedirs(out_dir, exist_ok=True)
public_dir = "library/"
assert out_dir.startswith(public_dir), "line files must live under library/ (Remotion's public dir)"


def faded(samples):
    out = array.array("h", samples)
    n_in, n_out = int(FADE_IN * sr), int(FADE_OUT * sr)
    for i in range(min(n_in, len(out))):
        out[i] = int(out[i] * (0.5 - 0.5 * math.cos(math.pi * i / n_in)))
    for i in range(min(n_out, len(out))):
        k = len(out) - 1 - i
        out[k] = int(out[k] * (0.5 - 0.5 * math.cos(math.pi * i / n_out)))
    return out


def write_wav(path, samples):
    with wave.open(path, "wb") as o:
        o.setnchannels(1)
        o.setsampwidth(2)
        o.setframerate(sr)
        o.writeframes(samples.tobytes())


entries = []
if VERBATIM:
    assert voice_path.startswith(public_dir), "voice.wav must live under library/"
    for lid, line in spec.items():
        lo, hi = line["span"]
        words = [(word, round(max(0.0, a - lo), 3), round(min(hi, b) - lo, 3)) for word, a, b in line["words"]]
        src = line.get("file", voice_path)  # a pickup line plays its own untouched file
        assert src.startswith(public_dir), "audio must live under library/"
        entries.append((lid, " ".join(wd for wd, _, _ in words), src[len(public_dir):], round(hi - lo, 4), words, lo))
else:
    for lid, line in spec.items():
        rate = float(line.get("rate", 1.0))
        joined = array.array("h")
        offsets = []  # (source start, source end, offset in the joined file) per chunk, seconds
        for s, e in line["chunks"]:
            if joined:
                joined.extend([0] * int(IN_LINE_GAP * sr))
            offsets.append((s, e, len(joined) / sr))
            joined.extend(faded(pcm[int(s * sr): int(e * sr)]))
        raw = os.path.join(out_dir, f"{lid}.raw.wav")
        final = os.path.join(out_dir, f"{lid}.wav")
        write_wav(raw, joined)
        if abs(rate - 1.0) > 1e-3:
            subprocess.run(
                [f"{FFMPEG_DIR}/ffmpeg", "-v", "error", "-y", "-i", raw, "-af", f"atempo={rate}", "-ar", str(sr), "-ac", "1", "-c:a", "pcm_s16le", final],
                check=True,
                env={**os.environ, "LD_LIBRARY_PATH": FFMPEG_DIR},
            )
            os.remove(raw)
        else:
            os.replace(raw, final)
        with wave.open(final) as f:
            duration = f.getnframes() / f.getframerate()

        def to_file(t):
            for s, e, off in offsets:
                if s - 0.05 <= t <= e + 0.05:
                    return round((off + min(max(t, s), e) - s) / rate, 3)
            nearest = min(offsets, key=lambda o: min(abs(t - o[0]), abs(t - o[1])))
            s, e, off = nearest
            return round((off + min(max(t, s), e) - s) / rate, 3)

        words = [(word, to_file(a), to_file(b)) for word, a, b in line["words"]]
        entries.append((lid, " ".join(wd for wd, _, _ in words), final[len(public_dir):], round(duration, 3), words, None))

q = lambda s: json.dumps(s, ensure_ascii=False)
out = [
    "/**",
    " * GENERATED by pipeline/build/render_voice_lines.py. " + ("VERBATIM: every line is an untouched stretch" if VERBATIM else "The cleaned voice, one WAV per line"),
    " * " + ("of the recording (sourceFrom..+duration); nothing is cut, faded or re-timed." if VERBATIM else "(retakes, fillers and pauses removed, fades and speed baked in)."),
    " * Text = what was actually said. Do not edit by hand: change the alignment script and regenerate.",
    " */",
    'import type { VoiceLine } from "../../components/faceless/voice";',
    "",
    "export const VOICE_LINES: readonly VoiceLine[] = [",
]
for lid, text, file, duration, words, source_from in entries:
    out += [
        "  {",
        f"    id: {q(lid)},",
        f"    text: {q(text)},",
        f"    file: {q(file)},",
        *([f"    sourceFrom: {source_from},"] if source_from is not None else []),
        f"    duration: {duration},",
        "    words: [",
    ]
    out += [f"      {{ w: {q(wd)}, t0: {a}, t1: {b} }}," for wd, a, b in words]
    out += ["    ],", "  },"]
out.append("];")
open(ts_path, "w").write("\n".join(out) + "\n")
print(f"{len(entries)} lines" + (" (verbatim, no files)" if VERBATIM else f" files in {out_dir}") + f", total {sum(e[3] for e in entries):.1f}s -> {ts_path}")
