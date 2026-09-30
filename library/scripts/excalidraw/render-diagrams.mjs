/**
 * Renders every `.excalidraw` JSON source file under library/diagrams/source/
 * to a matching `.svg` in library/diagrams/, using headless Chromium (Puppeteer)
 * + Excalidraw's own `exportToSvg`.
 *
 * Usage:  npm run render:diagrams
 *
 * Requires internet on first run of each session (loads Excalidraw from esm.sh).
 * Chromium comes bundled with puppeteer's cache at ~/.cache/puppeteer.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/excalidraw/*.mjs → diagrams sibling under library/, so ../../diagrams
const SOURCE_DIR = join(HERE, "..", "..", "diagrams", "source");
const OUT_DIR = join(HERE, "..", "..", "diagrams");

if (!existsSync(SOURCE_DIR)) {
  process.stdout.write("no library/diagrams/source directory — nothing to render\n");
  process.exit(0);
}

const sourceFiles = readdirSync(SOURCE_DIR).filter((f) => extname(f) === ".excalidraw");
if (sourceFiles.length === 0) {
  process.stdout.write("no .excalidraw source files — nothing to render\n");
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });

const EXCALIDRAW_VERSION = "0.18.1";
const HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<div id="ready" style="display:none">not-yet</div>
<script type="module">
  try {
    const { exportToSvg } = await import("https://esm.sh/@excalidraw/excalidraw@${EXCALIDRAW_VERSION}");
    window.__renderExcalidraw = async (data) => {
      const svg = await exportToSvg({
        elements: data.elements ?? [],
        appState: {
          ...(data.appState ?? {}),
          exportBackground: false,
          exportEmbedScene: false,
        },
        files: data.files ?? null,
        exportPadding: 24,
      });
      // Serialize the returned SVGElement to string
      return new XMLSerializer().serializeToString(svg);
    };
    document.getElementById("ready").textContent = "ok";
  } catch (err) {
    document.getElementById("ready").textContent = "error: " + err.message;
  }
</script>
</body>
</html>`;

process.stdout.write("launching headless Chromium…\n");
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") process.stderr.write(`browser: ${msg.text()}\n`);
  });
  await page.setContent(HTML, { waitUntil: "networkidle0" });

  // Wait for the ESM import to finish (up to 60s).
  await page.waitForFunction(
    () => document.getElementById("ready")?.textContent && document.getElementById("ready").textContent !== "not-yet",
    { timeout: 60_000 },
  );
  const status = await page.$eval("#ready", (el) => el.textContent);
  if (status !== "ok") {
    process.stderr.write(`Failed to load Excalidraw: ${status}\n`);
    await browser.close();
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;
  for (const source of sourceFiles) {
    const name = basename(source, ".excalidraw");
    const raw = readFileSync(join(SOURCE_DIR, source), "utf8");
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      process.stderr.write(`${source}: invalid JSON — ${e.message}\n`);
      failed++;
      continue;
    }
    try {
      const svg = await page.evaluate(async (d) => window.__renderExcalidraw(d), data);
      const outPath = join(OUT_DIR, `${name}.svg`);
      writeFileSync(outPath, svg);
      process.stdout.write(`✓ ${name}.svg\n`);
      ok++;
    } catch (e) {
      process.stderr.write(`${source}: render failed — ${e.message}\n`);
      failed++;
    }
  }

  process.stdout.write(`\n${ok} rendered, ${failed} failed.\n`);
} finally {
  await browser.close();
}
