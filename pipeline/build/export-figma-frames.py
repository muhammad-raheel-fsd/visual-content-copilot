"""
Export full-size PNG frames of a rendered phase into figma-assets/frames/phase-NN/, for
thumbnails, posts and carousels in Figma (production guide, section 9).

For every beat of the master it takes the moment just before the beat's last line ends (the
scene is fully built, no meme on screen), plus the key moments of the YouTube Short. Frames are
read from the rendered videos in output/phase-NN/, so render first.

Usage (repo root): python3 pipeline/build/export-figma-frames.py 01 phase-01-who-controls-your-phone
"""
import json
import os
import subprocess
import sys

phase, slug = sys.argv[1], sys.argv[2]
FF = "node_modules/.pnpm/@remotion+compositor-linux-x64-gnu@4.0.527/node_modules/@remotion/compositor-linux-x64-gnu"
ENV = dict(os.environ, LD_LIBRARY_PATH=FF)
OUT = f"figma-assets/frames/phase-{phase}"
HELPER = "apps/remotion/.figma-frames-tmp.ts"

# the timelines come from the video's own timeline.ts (exact frames, no guessing)
open(HELPER, "w").write(
    f'import {{ MASTER_TIMELINE as m, SHORT_TIMELINE as s }} from "./videos/{slug}/timeline";\n'
    "console.log(JSON.stringify({ m: m.lines, s: s.lines, fps: 30 }));\n"
)
try:
    data = json.loads(subprocess.run(["npx", "tsx", HELPER], capture_output=True, text=True, check=True).stdout)
finally:
    os.remove(HELPER)

shots = []
beats: dict[str, str] = {}
for lid in data["m"]:
    beats[lid.split(".")[0]] = lid  # the last line of each beat
for beat, lid in sorted(beats.items(), key=lambda kv: int(kv[0])):
    shots.append((f"master/beat-{int(beat):02d}.png", f"output/phase-{phase}/phase-{phase}-master.mp4", data["m"][lid]["to"] - 10))
for lid in data["s"]:
    shots.append((f"short/line-{lid.replace('.', '-')}.png", f"output/phase-{phase}/phase-{phase}-shorts.mp4", data["s"][lid]["to"] - 6))

for name, video, frame in shots:
    dest = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    subprocess.run(
        [f"{FF}/ffmpeg", "-y", "-loglevel", "error", "-ss", f"{frame / data['fps']:.3f}", "-i", video, "-frames:v", "1", dest],
        env=ENV,
        check=True,
    )
print(f"{len(shots)} frames -> {OUT}")
