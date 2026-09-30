# Clip art (`public/clipart/`)

Small decorative SVGs used as accents inside compositions and posts. Distinct from `public/illustrations/` (which holds full-scene illustrations like unDraw): clip art lives here for arrows, hand-drawn doodles, badges, patterns, stickers, stamps, and other standalone decorative elements.

## Sources (in order of preference)

1. **OpenMoji** — https://openmoji.org . CC BY-SA 4.0 (attribution required — track in `CREDITS.md`). 4000+ open-source emoji + symbols. Great for concept accents (💡, ⚡, ⚠️, 📦, 🔒).
2. **OpenDoodles** — https://www.opendoodles.com . CC0 (no attribution). Hand-drawn people doodles + objects. Perfect for the sketchy-explainer style.
3. **SVGRepo (CC0/MIT filter)** — https://www.svgrepo.com/collection/free-svg-collections . Massive library, use the license filter to grab only CC0 / MIT / permissive.
4. **Reshot** — https://www.reshot.com . Attribution-free stickers/icons/illustrations.
5. **Streamline (free tier)** — https://www.streamlinehq.com/freebies . Consistent stroke-based sets.

## Naming

`<category>-<name>.svg`, kebab-case. Examples:
- `arrow-curved-right.svg`
- `doodle-lightbulb.svg`
- `badge-new.svg`
- `pattern-dots.svg`
- `sticker-checkmark.svg`

## Attribution

Any non-CC0 clip art (e.g. OpenMoji) MUST be tracked in `public/clipart/CREDITS.md` in the format:

```
- openmoji-lightbulb.svg — OpenMoji (CC BY-SA 4.0), https://openmoji.org
```

## When to use clipart vs. iconify vs. RoughShape vs. illustrations

- **Iconify** (`@iconify/react`) → any icon-sized concept glyph (24-64px), including brand logos, tech icons, architectural symbols. First choice.
- **Clipart** (this folder) → medium-sized decorative accents (80-400px) with authored personality — hand-drawn doodles, custom badges, stickers.
- **RoughShape** (`src/components/primitives/RoughShape.tsx`) → programmatically generated sketchy shapes (arrows, circles, boxes) in any dimension. Deterministic, animatable draw-on.
- **Illustrations** (`public/illustrations/`) → full-scene compositions (500px+), typically person + environment (unDraw style).

## Usage in Remotion

```tsx
import { Img, staticFile } from "remotion";

<Img src={staticFile("clipart/doodle-lightbulb.svg")} style={{ width: 120 }} />
```
