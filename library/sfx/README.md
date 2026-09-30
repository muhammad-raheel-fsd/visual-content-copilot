# Sound effects (`public/sfx/`)

All sounds are **synthesized locally** by `scripts/generate-sfx.mjs` (pure Node, no dependencies, no downloads, no licensing concerns). Regenerate any time with:

```bash
npm run gen:sfx
```

## Vocabulary

| File | Duration | Character | Use for |
|---|---|---|---|
| `tick.wav` | 40ms | 2.4kHz sine burst, sharp decay | Small increment (list item, step counter, stack push) |
| `click.wav` | 50ms | 900Hz sine + noise, exponential decay | UI selection, decision point |
| `whoosh.wav` | 280ms | Low-pass filtered noise, cutoff swept | Scene / beat transition |
| `pop.wav` | 100ms | 900Hz descending to sub-bass | Element appears (badge, callout, stack pop) |
| `ding.wav` | 600ms | 880/1760/2640Hz harmonic stack | Success, aha moment, final reveal |
| `type.wav` | 25ms | White-noise micro-click | Typing rhythm loop (one per keystroke) |
| `notify.wav` | 650ms | C5 → E5 chime | Notification, message arrival |

## Usage in Remotion

```tsx
import { Audio, staticFile } from "remotion";

<Audio src={staticFile("sfx/tick.wav")} startFrom={0} />
```

`staticFile()` resolves against `public/`, so `staticFile("sfx/tick.wav")` → `public/sfx/tick.wav`.

## Rules

- Do **not** use `use-sound` or `howler` inside compositions. Wall-clock playback breaks render determinism.
- If a new sound is needed, add a synthesis function to `scripts/generate-sfx.mjs` rather than importing a file. Keep the vocabulary small (7 files is the ceiling — resist bloat).
- Never commit downloaded audio to this folder. If you need a source you cannot synthesize (music bed, voiceover), put it in `public/audio/` instead and track licensing in `public/audio/CREDITS.md`.
