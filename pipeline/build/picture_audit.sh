#!/usr/bin/env bash
# Picture audit for one composition (production guide, sections 7 and 9): renders a low-res
# frame sequence with the overflow check on, then reports
#   - OVERFLOW: text sticking out of its card / phone in 6+ frames (FL_OVERFLOW logs, kit.tsx)
#   - STATIC:   2 s or more of an unchanged picture while the voice speaks (static_audit.py)
# Usage (repo root): pipeline/build/picture_audit.sh <CompositionId> <TIMELINE export> [y0:y1] [video slug]
#   e.g. pipeline/build/picture_audit.sh Phase01Master MASTER_TIMELINE
#        pipeline/build/picture_audit.sh Phase01Shorts SHORT_TIMELINE 0.17:0.62
set -euo pipefail
ID=$1; TL=$2; CROP=${3:-0:1}
WORK=/tmp/picture-audit-$ID   # no dot in the path: Remotion rejects it for image sequences
SLUG=${4:-phase-01-who-controls-your-phone}  # the video folder under apps/remotion/videos/
rm -rf "$WORK"; mkdir -p "$WORK"
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH:-$HOME/.cache/ms-playwright/wsl-libs/usr/lib/x86_64-linux-gnu}
npx remotion render "$ID" "$WORK/seq" --sequence --image-format=jpeg --scale=0.25 --muted \
  --props='{"overflowCheck":true}' --log=verbose > "$WORK/render.log" 2>&1
cat > apps/remotion/.audit-tl.ts <<TS
import { writeFileSync } from "node:fs";
import { $TL as t } from "./videos/$SLUG/timeline";
writeFileSync(process.argv[2]!, JSON.stringify(t));
TS
npx tsx apps/remotion/.audit-tl.ts "$WORK/tl.json"; rm -f apps/remotion/.audit-tl.ts
echo "== OVERFLOW ($ID)"
{ grep -o 'FL_OVERFLOW [0-9]* [a-z]* [0-9]*px "[^"]*"' "$WORK/render.log" || true; } | python3 -c '
import re, sys, collections
seen = collections.defaultdict(list)
for line in sys.stdin:
    f, box, px, text = re.match(r"FL_OVERFLOW (\d+) (\S+) (\d+)px \"(.*)\"", line).groups()
    seen[(box, text)].append((int(f), int(px) * 4))
bad = [(k, v) for k, v in seen.items() if len(set(f for f, _ in v)) >= 6]
for (box, text), v in sorted(bad, key=lambda kv: kv[1][0][0]):
    fs = sorted(set(f for f, _ in v))
    print(f"  {fs[0]/30:6.1f}s  {len(fs):4d} frames  up to {max(p for _, p in v)}px out of its {box}: {text}")
print(f"  {len(bad)} overflowing text(s)")'
echo "== STATIC ($ID)"
UV=${UV:-uv}  # a uv binary; set UV=/path/to/uv when it is not on PATH
"$UV" run --python 3.12 --with numpy --with pillow python pipeline/build/static_audit.py "$WORK/seq" "$WORK/tl.json" "$CROP"
