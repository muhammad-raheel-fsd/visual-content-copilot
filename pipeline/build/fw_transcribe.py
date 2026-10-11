# Word-level transcription with faster-whisper (medium model, CPU). Usage:
#   uv run --python 3.12 --with faster-whisper python pipeline/build/fw_transcribe.py <16k mono wav> <out.json> ur
# (whisper.cpp needs a C++ toolchain this machine lacks; faster-whisper ships wheels.)
import json, sys, wave
import numpy as np
from faster_whisper import WhisperModel
wav, out, lang = sys.argv[1], sys.argv[2], sys.argv[3]
prompt = open(sys.argv[4]).read() if len(sys.argv) > 4 else None
model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=12)
w = wave.open(wav)
audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
# temperature 0 only: the fallback temperatures can loop for many minutes on a hard stretch
# (phase 02's spoken binary digits did); a stuck window now just moves on.
segments, info = model.transcribe(audio, language=None if lang == "auto" else lang, word_timestamps=True,
                                  vad_filter=False, beam_size=5, initial_prompt=prompt,
                                  condition_on_previous_text=False, temperature=0.0,
                                  compression_ratio_threshold=None, log_prob_threshold=None)
res = {"language": info.language, "duration": info.duration, "segments": []}
for s in segments:
    res["segments"].append({"start": s.start, "end": s.end, "text": s.text,
                            "words": [{"start": w.start, "end": w.end, "word": w.word, "p": w.probability} for w in s.words]})
    print(f"[{s.start:7.2f} {s.end:7.2f}] {s.text}", flush=True)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
