import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/excalidraw/*.mjs → diagrams sibling under library/, so ../../diagrams
const DIAGRAMS_DIR = join(HERE, "..", "..", "diagrams");
const SOURCE_DIR = join(DIAGRAMS_DIR, "source");

const SOURCE_EXTS = [".excalidraw", ".tldraw"];

if (!existsSync(SOURCE_DIR)) {
  process.stdout.write("no library/diagrams/source directory — nothing to check\n");
  process.exit(0);
}

const sourceFiles = readdirSync(SOURCE_DIR).filter((f) => SOURCE_EXTS.includes(extname(f)));

if (sourceFiles.length === 0) {
  process.stdout.write("no diagram source files — nothing to check\n");
  process.exit(0);
}

let missing = 0;
for (const source of sourceFiles) {
  const name = basename(source, extname(source));
  const svgPath = join(DIAGRAMS_DIR, `${name}.svg`);
  if (existsSync(svgPath)) {
    process.stdout.write(`OK   ${source} → ${name}.svg\n`);
  } else {
    process.stdout.write(
      `MISS ${source} → ${name}.svg (export from Excalidraw/tldraw UI: Export image → SVG)\n`,
    );
    missing++;
  }
}

if (missing > 0) {
  process.stderr.write(`\n${missing} diagram(s) missing SVG export.\n`);
  process.exit(1);
}
process.stdout.write(`\n${sourceFiles.length} diagram(s) OK.\n`);
