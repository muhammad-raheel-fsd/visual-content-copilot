/**
 * Export the faceless series' design assets to figma-assets/ for Figma (thumbnails, posts).
 *
 * Usage (repo root): node pipeline/build/export-figma-assets.mjs
 *
 * Everything is read from the code the videos use, so Figma never drifts from the videos:
 *   - colours        apps/remotion/components/faceless/theme.ts (FL)
 *   - grid pattern   apps/remotion/components/faceless/kit.tsx (GRID, StageFrame inset)
 *   - Iconify icons  apps/remotion/components/faceless/icons.ts (offline SVG data)
 *   - lucide icons   every `from "lucide-react"` import under the faceless kit and the
 *                    pipeline videos (apps/remotion/videos/phase-*)
 *   - brand          the Conceptoscope wordmark and lens mark, the MR avatar (BRAND in theme.ts)
 * Scene frames come from pipeline/build/export-figma-frames.py (figma-assets/frames/).
 * Re-run after adding icons or changing the theme. Do not edit figma-assets/ by hand.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const lucide = require("lucide-react");

const OUT = "figma-assets";
const KIT = "apps/remotion/components/faceless";
// only the folders this script owns are rebuilt; frames/ (export-figma-frames.py) is kept
for (const dir of ["icons", "patterns", "theme", "brand"]) rmSync(join(OUT, dir), { recursive: true, force: true });
for (const dir of ["icons/lucide", "icons/logos", "icons/mdi", "patterns", "theme", "brand"]) {
  mkdirSync(join(OUT, dir), { recursive: true });
}

// ---- colours (FL in theme.ts)
const themeSrc = readFileSync(join(KIT, "theme.ts"), "utf8");
const flBlock = themeSrc.match(/export const FL = \{([\s\S]*?)\} as const;/)[1];
const colors = Object.fromEntries([...flBlock.matchAll(/(\w+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const font = themeSrc.match(/@remotion\/google-fonts\/(\w+)/)[1];

// ---- grid (GRID + StageFrame inset in kit.tsx)
const kitSrc = readFileSync(join(KIT, "kit.tsx"), "utf8");
const gridLine = kitSrc.match(/export const GRID = \{([^}]*)\}/)[1];
const grid = Object.fromEntries(
  [...gridLine.matchAll(/(\w+):\s*("([^"]+)"|(\d+))/g)].map((m) => [m[1], m[3] ?? Number(m[4])])
);
const inset = Number(kitSrc.match(/inset = (\d+)/)[1]);

const gridSvg = (w, h, opts = {}) => {
  const lines = [];
  for (let x = 0; x <= w; x += grid.minor) {
    const major = x % grid.major === 0;
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${major ? grid.majorColor : grid.minorColor}" stroke-width="1"/>`);
  }
  for (let y = 0; y <= h; y += grid.minor) {
    const major = y % grid.major === 0;
    lines.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${major ? grid.majorColor : grid.minorColor}" stroke-width="1"/>`);
  }
  const body = `<rect width="${w}" height="${h}" fill="${colors.bg}"/>${lines.join("")}`;
  if (!opts.frame) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
  }
  // master stage: darker surround + rounded grid canvas inset from the edges
  const iw = w - 2 * inset;
  const ih = h - 2 * inset;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs><clipPath id="stage"><rect x="${inset}" y="${inset}" width="${iw}" height="${ih}" rx="28"/></clipPath></defs>` +
    `<rect width="${w}" height="${h}" fill="#010409"/>` +
    `<g clip-path="url(#stage)">${body}</g>` +
    `<rect x="${inset + 1}" y="${inset + 1}" width="${iw - 2}" height="${ih - 2}" rx="28" fill="none" stroke="${colors.panelBorder}" stroke-width="2"/></svg>\n`
  );
};

const patterns = [
  ["grid-tile-200.svg", 200, 200],
  ["grid-1920x1080.svg", 1920, 1080],
  ["grid-1080x1920.svg", 1080, 1920],
  ["grid-1080x1350.svg", 1080, 1350],
  ["grid-1280x720-thumbnail.svg", 1280, 720],
];
for (const [name, w, h] of patterns) writeFileSync(join(OUT, "patterns", name), gridSvg(w, h));
writeFileSync(join(OUT, "patterns", "canvas-frame-1920x1080.svg"), gridSvg(1920, 1080, { frame: true }));

// ---- Iconify icons (icons.ts)
const iconsSrc = readFileSync(join(KIT, "icons.ts"), "utf8");
let iconify = 0;
for (const m of iconsSrc.matchAll(/"(logos|mdi):([\w-]+)": \{ width: (\d+), height: (\d+), body: ("(?:[^"\\]|\\.)*") \}/g)) {
  const [, set, name, w, h, bodyJson] = m;
  const body = JSON.parse(bodyJson).replaceAll("currentColor", colors.text);
  writeFileSync(
    join(OUT, "icons", set, `${name}.svg`),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`
  );
  iconify++;
}

// ---- lucide icons used by the faceless videos
const sources = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) sources.push(p);
  }
};
walk(KIT);
for (const entry of readdirSync("apps/remotion/videos")) {
  if (entry.startsWith("phase-")) walk(join("apps/remotion/videos", entry));
}
const used = new Set();
for (const file of sources) {
  for (const m of readFileSync(file, "utf8").matchAll(/import \{([^}]+)\} from "lucide-react"/g)) {
    for (const name of m[1].split(",").map((n) => n.trim()).filter(Boolean)) used.add(name);
  }
}
const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
for (const name of [...used].sort()) {
  const Comp = lucide[name];
  if (!Comp) throw new Error(`lucide-react has no ${name}`);
  const svg = renderToStaticMarkup(React.createElement(Comp, { size: 96, color: colors.text, strokeWidth: 2 }));
  writeFileSync(join(OUT, "icons", "lucide", `${kebab(name)}.svg`), svg + "\n");
}

// ---- theme tokens + palette sheet
const tokens = {
  $description: "Faceless series theme (GitHub dark). Source: apps/remotion/components/faceless/theme.ts",
  color: Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, { $type: "color", $value: v }])),
  font: {
    display: { $type: "fontFamily", $value: font, weights: [400, 600, 700, 800] },
    mono: { $type: "fontFamily", $value: "Roboto Mono", weights: [400, 700] },
  },
  grid: { minor: grid.minor, major: grid.major, minorColor: grid.minorColor, majorColor: grid.majorColor },
  stage: { inset, radius: 28, surround: "#010409", border: colors.panelBorder },
  canvas: { master: "1920x1080", short: "1080x1920", feed: "1080x1350", thumbnail: "1280x720" },
};
writeFileSync(join(OUT, "theme", "tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
const swatches = Object.entries(colors);
const sw = 260;
const palette =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${sw * 4 + 40}" height="${Math.ceil(swatches.length / 4) * 200 + 40}">` +
  `<rect width="100%" height="100%" fill="#010409"/>` +
  swatches
    .map(([name, value], i) => {
      const x = 20 + (i % 4) * sw;
      const y = 20 + Math.floor(i / 4) * 200;
      return (
        `<rect x="${x}" y="${y}" width="${sw - 20}" height="120" rx="16" fill="${value}" stroke="${colors.panelBorder}"/>` +
        `<text x="${x}" y="${y + 150}" fill="${colors.text}" font-family="${font}" font-size="22" font-weight="700">${name}</text>` +
        `<text x="${x}" y="${y + 176}" fill="${colors.muted}" font-family="Roboto Mono" font-size="18">${value}</text>`
      );
    })
    .join("") +
  `</svg>\n`;
writeFileSync(join(OUT, "theme", "palette.svg"), palette);

// ---- brand
// Muhammad's photo, the same file the videos and slides use
copyFileSync("library/clipart/muhammad-raheel.png", join(OUT, "brand", "muhammad-raheel.png"));
writeFileSync(
  join(OUT, "brand", "avatar-mr.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colors.accent}"/><stop offset="1" stop-color="${colors.blue}"/></linearGradient></defs><circle cx="200" cy="200" r="200" fill="url(#g)"/><text x="200" y="200" dominant-baseline="central" text-anchor="middle" font-family="${font}" font-weight="800" font-size="160" fill="${colors.bg}">MR</text></svg>\n`
);

// Conceptoscope: a lens (the "scope") with a lightbulb inside (the concept): "See the concept."
const bulb = renderToStaticMarkup(React.createElement(lucide.Lightbulb, { size: 24, color: colors.highlight, strokeWidth: 2 }));
// keep the icon's stroke styling (it lives on its <svg> tag) on a group, scaled from the 24 px grid
const inner = (svg) =>
  `<g fill="none" stroke="${colors.highlight}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
  svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "") +
  `</g>`;
const markBody =
  `<circle cx="170" cy="170" r="120" fill="${colors.panel}" stroke="${colors.accent}" stroke-width="22"/>` +
  `<line x1="258" y1="258" x2="360" y2="360" stroke="${colors.accent}" stroke-width="34" stroke-linecap="round"/>` +
  `<g transform="translate(95 95) scale(6.25)">${inner(bulb)}</g>`;
writeFileSync(
  join(OUT, "brand", "conceptoscope-mark.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">${markBody}</svg>\n`
);
const wordmark = (dark) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="240" viewBox="0 0 1400 240">` +
  (dark ? `<rect width="1400" height="240" fill="${colors.bg}"/>` : "") +
  `<g transform="translate(20 20) scale(0.5)">${markBody}</g>` +
  `<text x="250" y="150" font-family="${font}" font-weight="800" font-size="104" fill="${dark ? colors.text : colors.bg}">Concepto<tspan fill="${colors.accent}">scope</tspan></text>` +
  `<text x="254" y="205" font-family="${font}" font-weight="600" font-size="34" fill="${colors.muted}">See the concept.</text></svg>\n`;
writeFileSync(join(OUT, "brand", "conceptoscope-wordmark-dark.svg"), wordmark(true));
writeFileSync(join(OUT, "brand", "conceptoscope-wordmark-light.svg"), wordmark(false));

writeFileSync(
  join(OUT, "README.md"),
  `# Figma assets (generated)

The faceless series' design assets, for building thumbnails and posts in Figma. Generated from
the video code by \`node pipeline/build/export-figma-assets.mjs\`; do not edit these files by
hand (edit freely once imported into Figma). Rules: \`pipeline/production-guide.md\`, section 7.

| Folder | What |
| --- | --- |
| \`theme/tokens.json\` | colours, fonts, grid and stage values (Design Tokens format) |
| \`theme/palette.svg\` | the colour swatches with names and hex values |
| \`patterns/\` | the grid background: a 200 px tile and full frames for the master (1920x1080), Shorts (1080x1920), the feed cut (1080x1350) and thumbnails (1280x720); \`canvas-frame-1920x1080.svg\` is the master's framed stage |
| \`icons/lucide/\` | the lucide icons the videos use (white, 96 px, 2 px stroke; recolour in Figma) |
| \`icons/logos/\`, \`icons/mdi/\` | the Iconify icons (brand logos keep their colours; the Apple, macOS and Instagram glyphs are black: invert or recolour them on dark backgrounds) |
| \`brand/conceptoscope-mark.svg\` | the Conceptoscope mark: a lens with a lightbulb inside ("See the concept.") |
| \`brand/conceptoscope-wordmark-dark.svg\`, \`-light.svg\` | mark + "Conceptoscope" + tagline, for dark and light backgrounds (Poppins font) |
| \`brand/muhammad-raheel.png\` | Muhammad's photo (1200 x 1200, circle on a dark backdrop), the one the videos and slides use |
| \`brand/avatar-mr.svg\` | the MR initials avatar (fallback) |
| \`frames/phase-NN/\` | full-size PNG frames of every beat of the master and a Short, for thumbnails and posts (\`pipeline/build/export-figma-frames.py\`) |

Fonts: ${font} (400, 600, 700, 800) for all text, Roboto Mono (400, 700) for code and binary.
Both are Google Fonts, available in Figma.
`
);

console.log(`figma-assets: ${used.size} lucide + ${iconify} Iconify icons, ${patterns.length + 1} patterns, ${swatches.length} colours`);
