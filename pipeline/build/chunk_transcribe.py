"""
Repeat check (production guide, section 3): transcribe every KEPT chunk of the cleaned voice on
its own and print it next to its line id. Whisper on the full recording merges a retake with
its first take into one sentence (one word stretched over the repeat), so a repeated phrase can
hide in the full transcript; on short chunks it shows up. Read the output for any phrase said
twice inside a line, cut the first take in the alignment script, and run this again.

Usage (repo root):
  uv run --python 3.12 --with faster-whisper python pipeline/build/chunk_transcribe.py \
      videos/transcripts/phase-NN-lines.json .whisper/phase-NN.wav videos/transcripts/phase-NN-chunks-ur.json
"""
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel
lines = json.load(open(sys.argv[1]))
# optional 4th argument: resume from this line id (the earlier lines were already checked)
if len(sys.argv) > 4:
    ids = list(lines)
    lines = {k: lines[k] for k in ids[ids.index(sys.argv[4]):]}
w = wave.open(sys.argv[2]); sr = w.getframerate()
audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=12)
out = []
for lid, spec in lines.items():
    for s, e in spec["chunks"]:
        clip = audio[int(s * sr):int(e * sr)]
        clip = np.concatenate([np.zeros(int(0.3 * sr), np.float32), clip, np.zeros(int(0.3 * sr), np.float32)])
        # temperature 0 only + no repeated 3-grams: a clip Whisper cannot read must not loop for minutes
        segs, _ = model.transcribe(clip, language="ur", beam_size=5, condition_on_previous_text=False, vad_filter=False,
                                   word_timestamps=True, temperature=0.0, no_repeat_ngram_size=3, max_new_tokens=120)
        words = [(round(x.start - 0.3 + s, 2), x.word.strip()) for sg in segs for x in sg.words]
        out.append({"line": lid, "chunk": [s, e], "words": words})
        print(lid, f"{s:.2f}-{e:.2f}", " ".join(x[1] for x in words), flush=True)
json.dump(out, open(sys.argv[3], "w"), ensure_ascii=False, indent=1)
