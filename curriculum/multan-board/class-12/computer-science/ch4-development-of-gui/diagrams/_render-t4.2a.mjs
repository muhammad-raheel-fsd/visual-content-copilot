import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import puppeteer from "puppeteer";

const SRC = "/home/janab/learnings/bytemotion/curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/diagrams/source/t4.2a-student-dept-tables.excalidraw";
const OUT = "/home/janab/learnings/bytemotion/curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/diagrams/rendered/t4.2a-student-dept-tables.svg";

mkdirSync(dirname(OUT), { recursive: true });

const EXCALIDRAW_VERSION = "0.18.1";
const HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head><body>
<div id="ready" style="display:none">not-yet</div>
<script type="module">
  try {
    const { exportToSvg } = await import("https://esm.sh/@excalidraw/excalidraw@${EXCALIDRAW_VERSION}");
    window.__renderExcalidraw = async (data) => {
      const svg = await exportToSvg({
        elements: data.elements ?? [],
        appState: { ...(data.appState ?? {}), exportBackground: false, exportEmbedScene: false },
        files: data.files ?? null,
        exportPadding: 24,
      });
      return new XMLSerializer().serializeToString(svg);
    };
    document.getElementById("ready").textContent = "ok";
  } catch (err) {
    document.getElementById("ready").textContent = "error: " + err.message;
  }
</script></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  page.on("console", (msg) => { if (msg.type() === "error") process.stderr.write(`browser: ${msg.text()}\n`); });
  await page.setContent(HTML, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () => document.getElementById("ready")?.textContent && document.getElementById("ready").textContent !== "not-yet",
    { timeout: 60_000 },
  );
  const status = await page.$eval("#ready", (el) => el.textContent);
  if (status !== "ok") { console.error("load fail:", status); process.exit(1); }

  const raw = readFileSync(SRC, "utf8");
  const data = JSON.parse(raw);
  const svg = await page.evaluate(async (d) => window.__renderExcalidraw(d), data);
  writeFileSync(OUT, svg);
  console.log("rendered -> " + OUT);
} finally {
  await browser.close();
}
