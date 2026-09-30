# The JavaScript Event Loop

**Status**: video-review (all three artifacts exist; iterating on visuals + timing)
**Target formats**: YouTube 16:9 (primary), Instagram Reels 9:16 (secondary cut)

## Assets

- **Script** (single source of truth for narration): `videos/scripts/event-loop.md`
- **Slide deck**: `apps/slides/src/decks/event-loop.tsx` — `pnpm run slides:dev` → http://localhost:3030/?deck=event-loop
- **Excalidraw sources**:
  - `library/diagrams/source/event-loop.excalidraw` — main event-loop flow diagram (with STEPS box)
  - `library/diagrams/source/event-loop-scene.excalidraw` — additional scene diagram (WIP)
- **Rendered diagrams**:
  - `library/diagrams/event-loop.svg`
  - `library/diagrams/event-loop-scene.svg`
- **Voiceover**: `library/voiceover/event-loop/beat-{1..6}.mp3` — regenerate with `npm run gen:voice`
- **Remotion composition**: `apps/remotion/videos/event-loop/` — registered as `id="EventLoop"` in `apps/remotion/Root.tsx`
- **Final render output**: `output/EventLoop.mp4` (after `npx remotion render EventLoop`)

## Beats (video timing)

- **Beat 1 — Hook** (~15s): The paradox — 4 log statements, actual output A/D/C/B
- **Beat 2 — Call Stack** (~21s): Single-threaded, one stack, LIFO
- **Beat 3 — Web APIs** (~14s): setTimeout/fetch hand off to browser, stack keeps going
- **Beat 4 — Two Queues** (~17s): Microtask queue (Promises) vs Task queue (timers)
- **Beat 5 — Event Loop Drains** (~19s): Drain ALL microtasks before ANY task
- **Beat 6 — Payoff** (~15s): Same tick, same 0ms, microtasks jump the line

Total: ~101s target duration. Actual: measured from Edge TTS output per beat (see `videos/scripts/event-loop.md`).

## Notes

- Coordinate math for `Spotlight` uses DOM measurement (subtract root rect + divide by scale). See `apps/remotion/components/emphasis/Spotlight.tsx`.
- Every emphasis targets a `data-focus-target` — never raw pixel coords.
- Music: no background music by default in the slide version (SFX only). Video version can add a background loop from `library/music/`.
- Iconify used for icons: `Layers` (stack), `Timer` (task queue), `Zap` (microtask), `Globe` (Web APIs), `RefreshCw` (event loop), `Terminal` (console).
