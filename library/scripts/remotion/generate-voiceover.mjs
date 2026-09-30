import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { createWriteStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/remotion/*.mjs → repo root is ../../..
const REPO_ROOT = join(HERE, "..", "..", "..");
const CONTENT_DIR = join(REPO_ROOT, "content", "scripts");
const OUT_ROOT = join(HERE, "..", "..", "voiceover");

const VOICE = process.env.VOICE || "en-US-AriaNeural";
const RATE = process.env.RATE || "medium";

const args = process.argv.slice(2);
const topics = args.length > 0 ? args : ["event-loop"];

function extractVoiceoverLines(scriptMarkdown) {
  const beats = [];
  const parts = scriptMarkdown.split(/^### Beat (\d+)/m);
  // parts: [preamble, num, body, num, body, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const beatNum = parseInt(parts[i], 10);
    const body = parts[i + 1] || "";
    const voMatch = body.match(/\*\*Voiceover\*\*[^:]*:\s*"([^"]+)"/);
    if (voMatch) {
      beats.push({ num: beatNum, line: voMatch[1] });
    }
  }
  return beats;
}

function synthesizeToFile(tts, text, outPath, options) {
  return new Promise((resolve, reject) => {
    const stream = tts.toStream(text, options).audioStream;
    const out = createWriteStream(outPath);
    stream.on("data", (chunk) => out.write(chunk));
    stream.on("close", () => {
      out.end();
      out.on("finish", () => resolve());
      out.on("error", reject);
    });
    stream.on("error", reject);
  });
}

async function synthesizeTopic(topic) {
  const scriptPath = join(CONTENT_DIR, `${topic}.md`);
  if (!existsSync(scriptPath)) {
    process.stderr.write(`error: no script at ${scriptPath}\n`);
    return;
  }
  const script = readFileSync(scriptPath, "utf8");
  const beats = extractVoiceoverLines(script);
  if (beats.length === 0) {
    process.stderr.write(`error: no voiceover lines found in ${scriptPath}\n`);
    return;
  }
  const outDir = join(OUT_ROOT, topic);
  mkdirSync(outDir, { recursive: true });

  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const beat of beats) {
    const outPath = join(outDir, `beat-${beat.num}.mp3`);
    await synthesizeToFile(tts, beat.line, outPath, { rate: RATE });
    process.stdout.write(`beat ${beat.num}: "${beat.line}"\n  → ${outPath}\n`);
  }
}

for (const topic of topics) {
  await synthesizeTopic(topic);
}
