/**
 * Transcribe an audio or video file with whisper.cpp (local, free, offline).
 *
 * Usage:
 *   node scripts/transcribe.mjs <input> [--language ur] [--translate] [--model medium]
 *
 * Examples:
 *   node scripts/transcribe.mjs recordings/event-loop.mp4
 *   node scripts/transcribe.mjs recordings/event-loop.mp4 --language ur --translate
 *
 * Output: transcripts/<basename>.json  with word-level timestamps and full text.
 *
 * First run: this script downloads whisper.cpp + the requested model (~150MB for base,
 * ~500MB for small, ~1.5GB for medium, ~3GB for large-v3). Models cache under
 * ~/.cache/whisper-cpp/.
 *
 * Requires: @remotion/install-whisper-cpp (install with `pnpm add @remotion/install-whisper-cpp`).
 * If not installed yet, this script prints the install command and exits.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/shared/*.mjs → repo root is ../../..
const REPO_ROOT = join(HERE, "..", "..", "..");
const TRANSCRIPT_DIR = join(REPO_ROOT, "content", "transcripts");
const WHISPER_DIR = join(REPO_ROOT, ".whisper");

async function loadWhisper() {
  try {
    return await import("@remotion/install-whisper-cpp");
  } catch {
    process.stderr.write(
      "@remotion/install-whisper-cpp is not installed.\n" +
        "Install it with: pnpm add @remotion/install-whisper-cpp\n" +
        "Then re-run this script.\n",
    );
    process.exit(1);
  }
}

function parseArgs(argv) {
  const args = { input: null, language: "auto", translate: false, model: "small" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--language") args.language = argv[++i];
    else if (a === "--translate") args.translate = true;
    else if (a === "--model") args.model = argv[++i];
    else if (!args.input) args.input = a;
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.input) {
  process.stderr.write(
    "usage: node scripts/transcribe.mjs <input.mp4|mp3|wav> [--language ur] [--translate] [--model small|medium|large-v3]\n",
  );
  process.exit(1);
}
if (!existsSync(args.input)) {
  process.stderr.write(`input not found: ${args.input}\n`);
  process.exit(1);
}

mkdirSync(TRANSCRIPT_DIR, { recursive: true });
mkdirSync(WHISPER_DIR, { recursive: true });

const whisper = await loadWhisper();

process.stdout.write(`installing whisper.cpp + model=${args.model} (cached in ${WHISPER_DIR})...\n`);
await whisper.installWhisperCpp({ to: WHISPER_DIR, version: "1.7.6" });
await whisper.downloadWhisperModel({ folder: WHISPER_DIR, model: args.model });

// whisper.cpp needs 16kHz mono WAV. Convert via ffmpeg first.
const inputBase = basename(args.input, extname(args.input));
const wavPath = join(WHISPER_DIR, `${inputBase}.wav`);
const { execSync } = await import("node:child_process");
process.stdout.write("converting to 16kHz mono WAV...\n");
execSync(
  `ffmpeg -y -i "${args.input}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}"`,
  { stdio: "inherit" },
);

process.stdout.write(
  `transcribing (language=${args.language}, translate=${args.translate})...\n`,
);
const result = await whisper.transcribe({
  inputPath: wavPath,
  whisperPath: WHISPER_DIR,
  model: args.model,
  language: args.language,
  translateToEnglish: args.translate,
  tokenLevelTimestamps: true,
});

const outPath = join(TRANSCRIPT_DIR, `${inputBase}.json`);
writeFileSync(outPath, JSON.stringify(result, null, 2));
process.stdout.write(`\n✓ wrote ${outPath}\n`);

// Also emit a plain text version for easy reading.
const textPath = join(TRANSCRIPT_DIR, `${inputBase}.txt`);
const fullText = (result.transcription ?? [])
  .map((seg) => seg.text ?? "")
  .join(" ")
  .trim();
writeFileSync(textPath, fullText + "\n");
process.stdout.write(`✓ wrote ${textPath}\n`);
