# Topic manifests

One markdown file per topic that lists every artifact the topic owns — the discoverability index. When you (or Claude) come back to a topic weeks later, `videos/topics/<slug>.md` is the ONE place to look for "where does everything live?".

The file structure of the repo is organized by *tool* (script → `videos/scripts/`, video → `apps/remotion/videos/`, slides → `apps/slides/src/decks/`, diagrams → `library/diagrams/`, voiceover → `library/voiceover/`, thumbnails → `library/thumbnails/`). A topic manifest here reverses the index: for a given topic, where are all the pieces?

## Format

```markdown
# <Topic name>

**Status**: draft | slides-review | diagrams-review | video-review | shipped
**Target formats**: YouTube 16:9 | IG Reels 9:16 | LinkedIn 1:1

## Assets
- **Script**: `videos/scripts/<slug>.md`
- **Slide deck**: `apps/slides/src/decks/<slug>.tsx` — `pnpm run slides:dev` → http://localhost:3030/?deck=<slug>
- **Excalidraw sources**: `library/diagrams/source/<slug>*.excalidraw`
- **Rendered diagrams**: `library/diagrams/<slug>*.svg`
- **Voiceover**: `library/voiceover/<slug>/beat-N.mp3`
- **Remotion composition**: `apps/remotion/videos/<slug>/` — `id="<TopicPascalCase>"` in `apps/remotion/Root.tsx`
- **Final render output**: `output/<slug>.mp4` (after `npx remotion render`)

## Beats (one-line summary)
- Beat 1: ...
- Beat 2: ...

## Assessment / questions (if curriculum)
- MCQ: `curriculum/<board>/questions/<slug>-mcq.md`
- Short: `curriculum/<board>/questions/<slug>-short.md`
- Long: `curriculum/<board>/questions/<slug>-long.md`

## Notes
Free-form notes about what worked, what to change, iteration history.
```

## Current topics

- [Event loop](./event-loop.md)
