/**
 * Downloads a curated set of Kenney CC0 music loops into public/music/.
 *
 * All tracks are Creative Commons Zero (public domain): commercial use OK,
 * no attribution required, no restrictions. Original source:
 *   https://kenney.nl/assets/music-loops
 * Mirrored on gamesounds.xyz with stable direct URLs.
 *
 * Usage: `npm run fetch:music`
 *
 * Idempotent: skips files already present. Delete a file locally to re-download.
 */
import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/shared/*.mjs → sibling under library/, so ../../music
const OUT_DIR = join(HERE, "..", "..", "music");

const BASE = "https://gamesounds.xyz/Kenney%27s%20Sound%20Pack/Music%20Loops/Loops/";

// Curated set: pick tracks that fit educational content, rename to mood-based
// filenames so beats/composition code doesn't depend on original titles.
const TRACKS = [
  { name: "chill-lofi.ogg",        source: "Night%20at%20the%20Beach.ogg",   mood: "chill, mellow — default background bed" },
  { name: "ukulele-tacky.ogg",     source: "Cheerful%20Annoyance.ogg",       mood: "classic 2015-era tutorial ukulele vibe" },
  { name: "upbeat-farm.ogg",       source: "Farm%20Frolics.ogg",             mood: "upbeat, positive, energetic explainers" },
  { name: "chip-8bit.ogg",         source: "Alpha%20Dance.ogg",              mood: "retro chiptune / nostalgic segments" },
  { name: "cinematic-warm.ogg",    source: "Infinite%20Descent.ogg",         mood: "cinematic, longer intros/outros" },
  { name: "ambient-focus.ogg",     source: "Flowing%20Rocks.ogg",            mood: "slow deep-focus (algorithm walkthroughs)" },
  { name: "quirky-mission.ogg",    source: "Mission%20Plausible.ogg",        mood: "quirky, mysterious, project-reveal feel" },
  { name: "spaced-out.ogg",        source: "Space%20Cadet.ogg",              mood: "spacey, futuristic, ML/AI topics" },
  { name: "sad-slow.ogg",          source: "Sad%20Descent.ogg",              mood: "slower, reflective, 'here's why this hurts' moments" },
  { name: "polka-fast.ogg",        source: "Polka%20Train.ogg",              mood: "very fast, comedic, montage segments" },
];

mkdirSync(OUT_DIR, { recursive: true });

let downloaded = 0;
let skipped = 0;
let failed = 0;

for (const track of TRACKS) {
  const outPath = join(OUT_DIR, track.name);
  if (existsSync(outPath)) {
    process.stdout.write(`  skip   ${track.name} (already present)\n`);
    skipped++;
    continue;
  }
  const url = BASE + track.source;
  try {
    const res = await fetch(url);
    if (!res.ok || !res.body) {
      process.stderr.write(`  FAIL   ${track.name} (HTTP ${res.status})\n`);
      failed++;
      continue;
    }
    await pipeline(res.body, createWriteStream(outPath));
    const size = (await Bun_or_Node_size(outPath));
    process.stdout.write(`  ✓  ${track.name.padEnd(24)} ${size}  — ${track.mood}\n`);
    downloaded++;
  } catch (err) {
    process.stderr.write(`  FAIL   ${track.name} (${err.message})\n`);
    failed++;
  }
}

process.stdout.write(
  `\n${downloaded} downloaded, ${skipped} skipped, ${failed} failed.\n` +
    `\nLicense: Creative Commons Zero (CC0). Commercial use OK, no attribution required.\n` +
    `Original source: https://kenney.nl/assets/music-loops\n`,
);

if (failed > 0) process.exit(1);

async function Bun_or_Node_size(path) {
  const { statSync } = await import("node:fs");
  const bytes = statSync(path).size;
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}
