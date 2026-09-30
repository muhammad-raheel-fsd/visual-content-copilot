# Diagrams (`public/diagrams/`)

Two workflows for infographic-style visuals in the studio: **manual (Excalidraw/tldraw)** for hand-crafted diagrams, and **programmatic (roughjs)** for on-the-fly sketchy shapes generated from code.

## Folder layout

```
public/diagrams/
  README.md              (this file)
  source/                (editable Excalidraw/tldraw sources)
    call-stack.excalidraw
    rag-pipeline.tldraw
  call-stack.svg         (rendered SVG, consumed by Remotion)
  rag-pipeline.svg
```

## Workflow A — Manual (Excalidraw / tldraw)

For a one-off hand-drawn diagram (Muhammad wants a specific composition):

1. Draw it in https://excalidraw.com or https://tldraw.com — browser-native, no plugin, no install.
2. **Save the source**: File → Save to... → `public/diagrams/source/<name>.excalidraw`.
3. **Export as SVG**: same UI → Export image → SVG → embed scene → `public/diagrams/<name>.svg`.
4. Validate: `npm run check:diagrams`.
5. Use in Remotion:
   ```tsx
   import { Img, staticFile } from "remotion";
   <Img src={staticFile("diagrams/call-stack.svg")} />
   ```

The two-file split (editable source + rendered SVG) means the `.svg` gets rendered into videos, deterministically and offline. The source can be re-opened later for edits.

### Animating an imported SVG

Simple: `<Img>` and animate `opacity` / `transform` externally.

Advanced (draw-on effect): inline the SVG, set `stroke-dasharray` and animate `stroke-dashoffset` from full length to 0 with `interpolate()`:

```tsx
const frame = useCurrentFrame();
const dashOffset = interpolate(frame, [0, 60], [PATH_LENGTH, 0]);
<path d="..." strokeDasharray={PATH_LENGTH} strokeDashoffset={dashOffset} />
```

## Workflow B — Programmatic (`RoughShape` component)

For infographics generated inside the composition itself (Muhammad asks "add a sketchy circle around the queue" and it happens without opening any editor):

```tsx
import { RoughShape } from "../../components/RoughShape";

<RoughShape
  shape={{ kind: "arrow", x1: 400, y1: 600, x2: 900, y2: 300 }}
  color="#58a6ff"
  strokeWidth={3}
  roughness={1.6}
  drawFrom={30}
  drawTo={60}
/>
```

Supported `shape` kinds: `rectangle`, `circle`, `ellipse`, `line`, `arrow`.

Options:
- `roughness` — 0 (smooth) to 3 (very sketchy). Default 1.4.
- `fillStyle` — `"hachure" | "solid" | "zigzag" | "cross-hatch" | "dots"`.
- `seed` — integer. Same seed = same hand-drawn wobble (deterministic across renders).
- `drawFrom` / `drawTo` — animate the stroke drawing on.

Built on [roughjs](https://roughjs.com) (MIT). No canvas needed — outputs SVG paths deterministically.

### When to use which

- **Excalidraw** — hand-composed diagrams with text labels, arrows, groupings. Full authorial control.
- **RoughShape** — decorative sketchy accents (circles around important elements, connecting arrows between boxes, underlines). Programmatic, animatable, on-demand.

## Fonts for handwritten-style text

Use `@remotion/google-fonts/Caveat` or `Kalam` or `IndieFlower` for handwritten text alongside RoughShape:

```tsx
import { loadFont } from "@remotion/google-fonts/Caveat";
const { fontFamily } = loadFont();
<div style={{ fontFamily, fontSize: 48 }}>hand-written note!</div>
```
