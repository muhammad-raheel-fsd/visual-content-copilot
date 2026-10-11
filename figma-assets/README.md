# Figma assets (generated)

The faceless series' design assets, for building thumbnails and posts in Figma. Generated from
the video code by `node pipeline/build/export-figma-assets.mjs`; do not edit these files by
hand (edit freely once imported into Figma). Rules: `pipeline/production-guide.md`, section 7.

| Folder | What |
| --- | --- |
| `theme/tokens.json` | colours, fonts, grid and stage values (Design Tokens format) |
| `theme/palette.svg` | the colour swatches with names and hex values |
| `patterns/` | the grid background: a 200 px tile and full frames for the master (1920x1080), Shorts (1080x1920), the feed cut (1080x1350) and thumbnails (1280x720); `canvas-frame-1920x1080.svg` is the master's framed stage |
| `icons/lucide/` | the lucide icons the videos use (white, 96 px, 2 px stroke; recolour in Figma) |
| `icons/logos/`, `icons/mdi/` | the Iconify icons (brand logos keep their colours; the Apple, macOS and Instagram glyphs are black: invert or recolour them on dark backgrounds) |
| `brand/conceptoscope-mark.svg` | the Conceptoscope mark: a lens with a lightbulb inside ("See the concept.") |
| `brand/conceptoscope-wordmark-dark.svg`, `-light.svg` | mark + "Conceptoscope" + tagline, for dark and light backgrounds (Poppins font) |
| `brand/muhammad-raheel.png` | Muhammad's photo (1200 x 1200, circle on a dark backdrop), the one the videos and slides use |
| `brand/avatar-mr.svg` | the MR initials avatar (fallback) |
| `frames/phase-NN/` | full-size PNG frames of every beat of the master and a Short, for thumbnails and posts (`pipeline/build/export-figma-frames.py`) |

Fonts: Poppins (400, 600, 700, 800) for all text, Roboto Mono (400, 700) for code and binary.
Both are Google Fonts, available in Figma.
