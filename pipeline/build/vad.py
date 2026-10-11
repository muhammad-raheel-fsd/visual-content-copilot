# Energy-based speech regions (stdlib only). Usage: vad.py <16k mono wav> <out.json>
import array, json, math, sys, wave
w = wave.open(sys.argv[1]); sr = w.getframerate(); data = array.array("h", w.readframes(w.getnframes()))
hop = sr // 100  # 10 ms
rms = []
for i in range(0, len(data) - hop, hop):
    chunk = data[i:i + hop]
    rms.append(math.sqrt(sum(x * x for x in chunk) / hop) + 1e-9)
db = [20 * math.log10(r / 32768) for r in rms]
srt = sorted(db); floor = srt[int(len(srt) * 0.10)]; peak = srt[int(len(srt) * 0.98)]
thr = max(floor + 12, peak - 38)
voiced = [d > thr for d in db]
# close gaps shorter than 120 ms, drop blips shorter than 80 ms
segs = []; start = None
for i, v in enumerate(voiced + [False]):
    if v and start is None: start = i
    if not v and start is not None: segs.append([start, i]); start = None
merged = []
for s in segs:
    if merged and s[0] - merged[-1][1] < 12: merged[-1][1] = s[1]
    else: merged.append(s)
merged = [s for s in merged if s[1] - s[0] >= 8]
out = {"floor_db": floor, "peak_db": peak, "threshold_db": thr, "segments": [[a / 100, b / 100] for a, b in merged]}
json.dump(out, open(sys.argv[2], "w"))
total = sum(b - a for a, b in out["segments"])
print(f"floor {floor:.1f} dB, peak {peak:.1f} dB, thr {thr:.1f} dB, {len(merged)} regions, speech {total:.1f}s of {len(db)/100:.1f}s")
gaps = [round(merged[i+1][0]/100 - merged[i][1]/100, 2) for i in range(len(merged)-1)]
print("longest gaps:", sorted(gaps)[-12:])
