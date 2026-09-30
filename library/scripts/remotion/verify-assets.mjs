/**
 * Verify that every asset referenced by a beat .tsx file exists on disk.
 *
 * Scans apps/remotion/videos/** /*.tsx for `staticFile("...")` calls, resolves each
 * path against library/, warns on missing files. Prevents render-time errors from
 * missing SFX, voiceover, illustrations, diagrams.
 *
 * Usage: npm run check:assets
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/remotion/*.mjs → repo root is ../../..
const REPO_ROOT = join(HERE, "..", "..", "..");
const SRC = join(REPO_ROOT, "apps", "remotion");
const PUBLIC = join(REPO_ROOT, "library");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(SRC);
const references = new Map(); // asset path → [source file, ...]

const staticFileRe = /staticFile\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
const voiceoverRe = /VoiceoverAudio[^/]*topic=["']([^"']+)["'][^/]*beat=\{(\d+)\}/g;
const sfxCueRe = /SfxCue[^/]*file=["']([^"']+)["']/g;

const record = (rel, file) => {
  // Skip references that are template-string interpolations (e.g. ${topic})
  // — those live in the shared components, not concrete asset references.
  if (rel.includes("${")) return;
  if (!references.has(rel)) references.set(rel, []);
  references.get(rel).push(file);
};

for (const file of files) {
  const src = readFileSync(file, "utf8");

  let m;
  staticFileRe.lastIndex = 0;
  while ((m = staticFileRe.exec(src)) !== null) record(m[1], file);

  voiceoverRe.lastIndex = 0;
  while ((m = voiceoverRe.exec(src)) !== null) {
    record(`voiceover/${m[1]}/beat-${m[2]}.mp3`, file);
  }

  sfxCueRe.lastIndex = 0;
  while ((m = sfxCueRe.exec(src)) !== null) record(`sfx/${m[1]}`, file);
}

if (references.size === 0) {
  process.stdout.write("no asset references found — nothing to check\n");
  process.exit(0);
}

let missing = 0;
let ok = 0;
for (const [rel, sources] of [...references.entries()].sort()) {
  const full = join(PUBLIC, rel);
  if (existsSync(full)) {
    process.stdout.write(`OK   ${rel}\n`);
    ok++;
  } else {
    process.stdout.write(`MISS ${rel}\n`);
    for (const src of new Set(sources)) {
      process.stdout.write(`       referenced by ${src.replace(REPO_ROOT, "")}\n`);
    }
    missing++;
  }
}

process.stdout.write(`\n${ok} OK, ${missing} missing.\n`);
process.exit(missing > 0 ? 1 : 0);
