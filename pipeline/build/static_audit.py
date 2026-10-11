"""
Dead-air audit for the picture (production guide, section 7): flags every stretch of 2 s or
more where NOTHING on screen changes while the voice is speaking, with the words being said.
Every flagged stretch needs an animation on its words.

Usage (repo root), for composition <Id> and its timeline export <TIMELINE> in timeline.ts:
  1. npx remotion render <Id> /tmp/seq --sequence --image-format=jpeg --scale=0.15 --muted
     (the output folder path must contain no dot)
  2. dump the timeline: a 3-line tsx script that writes JSON.stringify(<TIMELINE>) to tl.json
  3. uv run --python 3.12 --with numpy --with pillow python pipeline/build/static_audit.py /tmp/seq tl.json [y0:y1]
     y0:y1 (fractions of the height) limits the check to the stage, e.g. 0.17:0.62 for a Short,
     whose bottom strip always moves.
"""
import json, os, re, sys
import numpy as np
from PIL import Image
S = sys.argv[1]
files = sorted(os.listdir(S), key=lambda f: int(re.findall(r"\d+", f)[-1]))
y0, y1 = (float(v) for v in sys.argv[3].split(":")) if len(sys.argv) > 3 else (0.0, 1.0)
prev = None; diffs = []
for f in files:
    a = np.asarray(Image.open(os.path.join(S, f)).convert("L"), dtype=np.int16)
    a = a[int(a.shape[0] * y0):int(a.shape[0] * y1)]
    diffs.append(0 if prev is None else float(np.mean(np.abs(a - prev) > 6)))
    prev = a
# timeline words (frame -> line/word) from a JSON dump
tl = json.load(open(sys.argv[2]))
def said(f0, f1):
    ws = [w for w in tl["words"] if w["from"] < f1 and w["to"] > f0]
    out = {}
    for w in ws: out.setdefault(w["lineId"], []).append(w["w"])
    return "; ".join(f"{k}: {' '.join(v)}" for k, v in out.items())
run = 0
for i, d in enumerate(diffs + [1]):
    if d < 0.0005: run += 1
    else:
        if run >= 60:
            f0, f1 = i - run, i
            text = said(f0, f1)
            if text: print(f"{f0/30:6.1f}-{f1/30:6.1f}s ({run/30:.1f}s static) | {text}")
        run = 0
