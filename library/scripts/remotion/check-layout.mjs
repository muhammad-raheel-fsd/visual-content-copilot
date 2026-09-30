/**
 * Layout overlap validator.
 *
 * Walks every multi-line preset in `src/components/theme.ts` LAYOUT.* and
 * reports any pair of rects within the same preset that overlap, or any rect
 * that extends outside the 1920x1080 canvas.
 *
 * Exit 1 on issues. Run: `npm run check:layout`
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/remotion/*.mjs → repo root is ../../..
const THEME_PATH = join(HERE, "..", "..", "..", "apps", "remotion", "components", "theme.ts");
const CANVAS = { w: 1920, h: 1080 };
// Reserved for Muhammad's OBS webcam overlay in the bottom-right corner.
// No rect may extend past x = CANVAS.w - SAFE_ZONE_RIGHT.
const SAFE_ZONE_RIGHT = 192;
const CONTENT_MAX_X = CANVAS.w - SAFE_ZONE_RIGHT;

const source = readFileSync(THEME_PATH, "utf8");
const layoutMatch = source.match(/export const LAYOUT = \{([\s\S]*?)\n\} as const;/);
if (!layoutMatch) {
  process.stderr.write("Could not find LAYOUT block in theme.ts\n");
  process.exit(1);
}

// Line-based parser that respects nested braces.
const lines = layoutMatch[1].split("\n");
const presets = {};
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  const start = line.match(/^ {2}([a-zA-Z_][\w]*):\s*\{\s*$/);
  if (!start) {
    i++;
    continue;
  }
  const name = start[1];
  let depth = 1;
  const bodyLines = [];
  let j = i + 1;
  while (j < lines.length && depth > 0) {
    const l = lines[j];
    for (const ch of l) {
      if (ch === "{") depth++;
      if (ch === "}") depth--;
      if (depth === 0) break;
    }
    if (depth > 0) bodyLines.push(l);
    j++;
  }
  const rects = {};
  const rectRe =
    /^\s+([a-zA-Z_][\w]*):\s*\{\s*x:\s*(-?\d+),\s*y:\s*(-?\d+),\s*w:\s*(\d+),\s*h:\s*(\d+)\s*\}/;
  for (const bl of bodyLines) {
    const m = bl.match(rectRe);
    if (m) rects[m[1]] = { x: +m[2], y: +m[3], w: +m[4], h: +m[5] };
  }
  if (Object.keys(rects).length > 0) {
    presets[name] = rects;
  }
  i = j;
}

function overlap(a, b) {
  return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y);
}
function outOfBounds(r) {
  return r.x < 0 || r.y < 0 || r.x + r.w > CANVAS.w || r.y + r.h > CANVAS.h;
}
function violatesSafeZone(r) {
  return r.x + r.w > CONTENT_MAX_X;
}

let errors = 0;
let checked = 0;

if (Object.keys(presets).length === 0) {
  process.stdout.write("No presets with rect children found. Nothing to validate.\n");
  process.exit(0);
}

for (const [presetName, rects] of Object.entries(presets)) {
  const names = Object.keys(rects);
  process.stdout.write(`\n[${presetName}] ${names.length} rect(s)\n`);
  for (const name of names) {
    const r = rects[name];
    if (outOfBounds(r)) {
      process.stdout.write(
        `  BOUNDS   ${name} (${r.x},${r.y} ${r.w}x${r.h}) extends outside ${CANVAS.w}x${CANVAS.h}\n`,
      );
      errors++;
    }
    if (violatesSafeZone(r)) {
      process.stdout.write(
        `  SAFEZONE ${name} extends to x=${r.x + r.w}, past CONTENT_MAX_X=${CONTENT_MAX_X} (OBS webcam zone)\n`,
      );
      errors++;
    }
  }
  for (let ii = 0; ii < names.length; ii++) {
    for (let jj = ii + 1; jj < names.length; jj++) {
      checked++;
      const a = rects[names[ii]];
      const b = rects[names[jj]];
      if (overlap(a, b)) {
        process.stdout.write(
          `  OVERLAP ${names[ii]} (${a.x},${a.y} ${a.w}x${a.h}) ↔ ${names[jj]} (${b.x},${b.y} ${b.w}x${b.h})\n`,
        );
        errors++;
      } else {
        process.stdout.write(`  ok      ${names[ii]} ↔ ${names[jj]}\n`);
      }
    }
  }
}

process.stdout.write(`\n${checked} pair(s) checked, ${errors} issue(s).\n`);
process.exit(errors > 0 ? 1 : 0);
