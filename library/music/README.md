# Background music (`public/music/`)

10 CC0 music loops from Kenney's Music Loops pack, downloaded automatically by `npm run fetch:music`. All Creative Commons Zero — commercial use OK, no attribution required, no restrictions.

## Vocabulary — what's here

| File | Duration | Mood | When to use |
|---|---|---|---|
| `chill-lofi.ogg` | ~11s | mellow, laid-back | Default background bed. Safe pick for any tutorial. |
| `ukulele-tacky.ogg` | ~12s | cheerful, playful | The classic 2015-era YouTube-tutorial vibe you asked for. |
| `upbeat-farm.ogg` | ~11s | positive, energetic | Upbeat explainers, productivity content. |
| `chip-8bit.ogg` | ~40s | retro chiptune | Nostalgic segments, gaming-adjacent topics. |
| `cinematic-warm.ogg` | ~11s | warm, cinematic | Longer intros / outros, "big idea" reveals. |
| `ambient-focus.ogg` | ~27s | slow, atmospheric | Deep-focus content (algorithm walkthroughs, hard concepts). |
| `quirky-mission.ogg` | ~10s | mysterious, quirky | Project reveals, product launches. |
| `spaced-out.ogg` | ~20s | spacey, futuristic | ML/AI, transformers, LLM topics. |
| `sad-slow.ogg` | ~19s | reflective, slower | "Here's why this hurts" moments, cautionary content. |
| `polka-fast.ogg` | ~16s | very fast, comedic | Montage segments, "everything is on fire" moments. |

Every file is a seamless loop — Remotion's `<Audio>` handles looping automatically past the track duration.

## Re-download / add more

```bash
npm run fetch:music
```

The script is idempotent — skips files that already exist. Delete a file locally to re-download it.

To add more tracks, either:
1. Add new entries to `TRACKS` in `scripts/fetch-music.mjs` (browse [gamesounds.xyz Kenney sound pack](https://gamesounds.xyz/?dir=Kenney%27s+Sound+Pack%2FMusic+Loops%2FLoops) for the source filenames).
2. Manually drop your own file into this folder and update this README.

If you add non-CC0 tracks (from Pixabay, YouTube Audio Library, etc.), track their attribution in `CREDITS.md` (create if needed).

## Usage in Remotion

```tsx
import { Audio, staticFile } from "remotion";

// Mount at the top-level composition so it plays across all beats.
<Audio
  src={staticFile("music/chill-lofi.ogg")}
  volume={0.10}         // 0.08-0.15 range — VO must dominate
  loopVolumeCurveBehavior="extend"
/>
```

Rules:
- **Volume 0.08-0.15.** If you can't hear the voiceover clearly, it's too loud.
- Mount at composition level, not per-beat — the track plays continuously as the video progresses through beats.
- For short loops (10-15s), Remotion loops them automatically via `<Audio loop />` prop.
- Fade in/out with a `<Sequence>` wrapper if the loop's boundary feels abrupt at the video edges.

## License

All 10 tracks are **CC0 (Creative Commons Zero)** — public domain equivalent. Original author: [Kenney (@KenneyNL)](https://kenney.nl). Original pack: https://kenney.nl/assets/music-loops. Mirror used for direct download: https://gamesounds.xyz.

No attribution required, but crediting Kenney in your video description is a nice thing to do.
