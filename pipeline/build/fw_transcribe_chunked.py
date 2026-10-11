"""
Word-level transcription in short pieces (production guide, section 3, step 2), for recordings
where Whisper loops on one stretch (phase 02's spoken binary digits stalled the whole-file run for
10+ minutes). The speech regions (vad.py) are grouped into pieces of at most ~20 s, cut at pauses,
and each piece is transcribed alone with a token cap and no repeated 3-grams, so a hard stretch
costs seconds, not minutes. Output: the same JSON shape as fw_transcribe.py.

Usage (repo root):
  uv run --python 3.12 --with faster-whisper python pipeline/build/fw_transcribe_chunked.py \\
      .whisper/phase-NN.wav videos/transcripts/phase-NN-vad.json videos/transcripts/phase-NN-ur.json ur
"""
import json
import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

wav_path, vad_path, out_path, lang = sys.argv[1:5]
w = wave.open(wav_path)
sr = w.getframerate()
audio = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
regions = json.load(open(vad_path))["segments"]

pieces, cur = [], None
for s, e in regions:
    if cur and e - cur[0] <= 20 and s - cur[1] < 1.5:
        cur[1] = e
    else:
        if cur:
            pieces.append(cur)
        cur = [s, e]
if cur:
    pieces.append(cur)

model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=12)
res = {"language": lang, "duration": len(audio) / sr, "segments": []}
for s, e in pieces:
    a, b = max(0, int((s - 0.25) * sr)), min(len(audio), int((e + 0.25) * sr))
    segs, _ = model.transcribe(audio[a:b], language=lang, beam_size=5, word_timestamps=True,
                               condition_on_previous_text=False, vad_filter=False, temperature=0.0,
                               no_repeat_ngram_size=3, max_new_tokens=160)
    off = a / sr
    for sg in segs:
        words = [{"start": round(x.start + off, 3), "end": round(x.end + off, 3), "word": x.word, "p": x.probability} for x in sg.words]
        res["segments"].append({"start": round(sg.start + off, 3), "end": round(sg.end + off, 3), "text": sg.text, "words": words})
        print(f"[{sg.start + off:7.2f} {sg.end + off:7.2f}] {sg.text}", flush=True)
json.dump(res, open(out_path, "w"), ensure_ascii=False, indent=1)
