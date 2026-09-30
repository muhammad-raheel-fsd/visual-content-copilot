# bytemotion

Muhammad's personal content studio. Remotion 4.x + Code Hike for videos, Figma-first for static designs. Produces YouTube videos, Instagram Reels / posts / carousels, LinkedIn posts / banners, YouTube thumbnails, and profile pictures for a solo educational channel (event loop, RAG, and other CS/AI explainers).

**This is not an elunic repo.** The elunic branch/commit/MR conventions in `~/.claude/CLAUDE.md` do NOT apply here. Follow standard git conventions; the Claude co-author line is fine if Muhammad wants it (ask if unsure).

## Repository layout

**Canonical layout guide: [FOLDER-STRUCTURE.md](FOLDER-STRUCTURE.md).** Read that file before creating any new folder or moving anything. What follows is a short overview.

```
bytemotion/
├── apps/                        Code that builds (Vite apps + Remotion)
│   ├── remotion/                Remotion source (Root.tsx, videos/<topic>/beats/)
│   ├── slides/                  Vite + React slides app (port 3030). All deck .tsx files under src/decks/.
│   └── excalidraw-editor/       Vite + React Excalidraw editor (port 3040)
│
├── curriculum/                  School curriculum content, one folder per chapter
│   ├── README.md
│   ├── RUNBOOK.md               Author workflow rules
│   ├── chapter-template.md
│   ├── books/                   Source PDFs (class-10-cs.pdf, class-12-cs.pdf)
│   └── <board>/class-<N>/<subject>/ch<M>-<slug>/
│       ├── README.md            Chapter index
│       ├── research.md          Chapter brain (workflow + tracker + per-topic plans)
│       ├── source/              Verbatim book content (t<T>-<slug>.md + overview + summary + board-exercise)
│       ├── questions/           Postgres-ready practice sets (t<T>-{mcqs,short,long}.md + board-exercise + mock-test + mixed-mcqs)
│       ├── diagrams/            source/ (Excalidraw JSON) + rendered/ (SVGs, also symlinked into library/diagrams/)
│       └── slides/README.md     Points to deck .tsx files in apps/slides/src/decks/
│
├── videos/                      Video productions (not tied to a curriculum chapter)
│   ├── scripts/                 Video script markdown
│   ├── topics/                  Topic manifests
│   ├── recordings/              Raw camera captures (gitignored)
│   ├── transcripts/             Whisper outputs (gitignored)
│   └── source-clips/            Reference input videos (gitignored)
│
├── library/                     Reusable atoms used across multiple chapters/videos
│   ├── scripts/                 Node build/gen scripts (shared/remotion/excalidraw)
│   ├── sfx/                     12 synthesised WAVs
│   ├── music/                   10 CC0 Kenney loops
│   ├── clipart/                 Small decorative SVGs (generic)
│   ├── illustrations/           Full-scene SVGs (generic)
│   ├── diagrams/                Rendered SVGs (mostly symlinks to chapter folders) + source/ for generic diagrams only
│   ├── voiceover/<topic>/       Per-video-topic MP3s
│   ├── thumbnails/<topic>/      Rendered thumbnails
│   └── snippets/<topic>/        Code Hike snippets
│
├── output/                      Legacy export bucket (new exports go inside their chapter or video folder)
├── thoughts/                    Internal notes, NOT shipped content
├── .agents/                     Remotion-published skills (managed by `npx skills`)
├── .claude/                     Claude Code agents + skills (project-scoped)
├── CLAUDE.md · FOLDER-STRUCTURE.md · package.json · ...
```

**Key path invariants**:

| Concept | Path |
|---|---|
| Deck .tsx source | `apps/slides/src/decks/class-<N>-ch<M>-*.tsx` (Vite requires this location) |
| Remotion source | `apps/remotion/*` |
| Remotion video compositions | `apps/remotion/videos/<slug>/beats/*` |
| Source PDFs | `curriculum/books/*.pdf` |
| Chapter home | `curriculum/<board>/class-<N>/<subject>/ch<M>-<slug>/` |
| Chapter parsed source | `curriculum/<...>/ch<M>-<slug>/source/*.md` |
| Chapter questions | `curriculum/<...>/ch<M>-<slug>/questions/*.md` |
| Chapter diagrams (master) | `curriculum/<...>/ch<M>-<slug>/diagrams/{source,rendered}/*` |
| Chapter research | `curriculum/<...>/ch<M>-<slug>/research.md` |
| Video scripts | `videos/scripts/<slug>.md` |
| Video topic manifests | `videos/topics/<slug>.md` |
| Reusable SFX / music / clipart | `library/{sfx,music,clipart}/*` |
| Vite-served diagrams | `library/diagrams/class-<N>-ch<M>-*.svg` (symlinks to `curriculum/<...>/diagrams/rendered/*.svg`) |
| Node scripts | `library/scripts/{shared,remotion,excalidraw}/*.mjs` |
| Recordings (camera output) | `videos/recordings/*` (gitignored) |
| Whisper transcripts | `videos/transcripts/*` (gitignored) |
| Final video renders | `output/*.mp4` (legacy; new exports inside chapter/video folder) |

**Never create `content/`.** That folder was deleted and split into `curriculum/` + `videos/` on 2026-09-30. See [FOLDER-STRUCTURE.md § Migration history](FOLDER-STRUCTURE.md#migration-history) for old-path → new-path mapping.

## 3-stage teaching-content pipeline (the default workflow)

For any new topic or curriculum chapter, produce three reviewable artifacts in sequence, faster iteration first:

1. **Slides** — `apps/slides/src/decks/<slug>.tsx`. Vite + React + framer-motion + SFX from `library/sfx/`. Keyboard-navigable (← → space). Portrait or landscape aspect. Open with `pnpm run slides:dev` → http://localhost:3030/?deck=<slug>&aspect=portrait. Record via OBS window capture. Every slide advance plays `pop.wav`; major transitions add `swoosh.wav`; emphasized slides can override with `entrySfx: "ting.wav"`.
2. **Diagrams** — `library/diagrams/source/<slug>-*.excalidraw`, rendered to SVG via `npm run render:diagrams`. Authored by `excalidraw-designer` agent — enforces title + text labels + numbered arrows + legend. Consumed in slides or Remotion via `<Img src={staticFile("diagrams/<name>.svg")} />`.
3. **Video** — `apps/remotion/videos/<slug>/`, authored by `remotion-composer` agent. Full narrated composition with Spotlight/Indicate emphasis and Voiceover.

The `content-pipeline` agent orchestrates all three, stopping between stages for review. Do not skip stages — errors caught in slides (seconds to fix) stay cheap; errors caught after a video render (~1 hour) do not.

## Curriculum content (`curriculum/`)

Board-syllabus content — currently Multan Board Pakistan CS classes 9-12. See `curriculum/README.md` for structure. Every chapter file is the source of truth for slides + diagrams + video + assessment questions.

## Slides app (`apps/slides/`)

Standalone Vite + React app in the same repo. Reuses `library/` (SFX, music, illustrations) with Remotion. **Independent** of Remotion — `framer-motion` and `use-sound` are safe here because slides are a real interactive React app, not a rendered composition.

Commands (see also `pnpm run dev:all` for the one-command dev environment below):
- `pnpm run slides:dev` — Vite dev server on **port 3030**
- `pnpm run slides:build` — production build to `apps/slides/dist/`
- `pnpm run slides:preview` — serve the built bundle

Keyboard: `→` / `Space` / `PgDn` next · `←` / `PgUp` prev · `Home` / `End` jump · `F` fullscreen

URL params: `?deck=<id>&aspect=portrait|landscape` — bookmark for OBS setups.

Aspect ratios rendered at fixed canvas (1920×1080 landscape, 1080×1920 portrait), scaled to fit viewport. Slides are pixel-perfect regardless of window size — same trick Remotion uses.

## Excalidraw editor (`apps/excalidraw-editor/`) — port 3040

Local self-hosted Excalidraw. Loads/saves `.excalidraw` files directly from `library/diagrams/source/` via a Vite middleware endpoint. Dark theme, integrated file browser sidebar.

Commands:
- `pnpm run editor:dev` — Vite dev server on **port 3040**
- `pnpm run editor:build` — production build (though usually you just run dev)

Workflow:
1. `pnpm run editor:dev` → http://127.0.0.1:3040
2. Pick a diagram from the left sidebar (or click **New diagram**).
3. Edit in the embedded Excalidraw canvas.
4. Click **Save** — writes back to `library/diagrams/source/<name>.excalidraw`.
5. Run `npm run render:diagrams` to update the corresponding `.svg`.

Reference: use this instead of excalidraw.com when Muhammad wants offline editing or the file must land directly in the project.

## One-command dev environment

`pnpm run dev:all` — starts **all three** dev servers concurrently with color-coded output:

| Service | Port | URL |
|---|---|---|
| Remotion Studio | `3000` | http://127.0.0.1:3000 (composition preview) |
| Slides | `3030` | http://127.0.0.1:3030 (interactive slides) |
| Excalidraw editor | `3040` | http://127.0.0.1:3040 (diagram authoring) |

Use `Ctrl+C` once to stop all three.

## Topic manifests (`topics/`)

Discoverability index — one markdown file per topic listing every asset (script, slides, diagrams, voiceover, video, questions) with paths. When you come back to a topic weeks later, `videos/topics/<slug>.md` is the ONE place to look for "where does everything live?". See `videos/topics/README.md` and `videos/topics/event-loop.md` for the format.

## OBS live compositing recipe

For side-by-side portrait recording (your camera left, slides right):

1. OBS canvas: 1920×1080
2. Scene sources:
   - **Video Capture Device** (your camera), cropped to 9:16, positioned x=0..864 (left ~45%)
   - **Window Capture** (Chrome on `localhost:3030/?deck=<slug>&aspect=portrait`), positioned x=864..1920 (right ~55%)
3. Record. Every arrow key advances the slide with SFX; your voice narrates in real-time; OBS captures the composite.

For portrait-only reels (9:16 canvas), swap: your camera fills 60%, slides fill 40% at bottom as chapter cards.

## Session policy — read this FIRST, follow it ALWAYS

Every Claude Code session in this repo MUST follow these rules. Skipping any one = broken output.

**1. Use the specialized agents in `.claude/agents/` for their scope.**  Before doing multi-step domain work, invoke the right agent instead of inventing an approach:
   - Recording → composition (end-to-end pipeline) → **`video-from-recording`** agent (orchestrator)
   - Writing/revising a video script → `video-script` agent
   - Turning an approved script into a composition → `remotion-composer` agent
   - Reviewing a beat `.tsx` file for issues (prohibited libs, raw coords, missing focusKeys, VO overflow) → **`beat-reviewer`** agent
   - Hand-drawn / sketch-style infographic diagrams → **`excalidraw-designer`** agent
   - Creating YouTube/IG thumbnails → `thumbnail-generator` agent
   - Creating IG/LinkedIn posts, carousels, banners, profile pictures → `social-post-designer` agent
   - Picking sound effects, icons, illustrations for a beat → `sfx-icon-curator` agent

**2. Use skills in `.claude/skills/` when their scope fits.**  `frontend-design` provides aesthetic direction for any visual work — invoke it when picking a look for a new beat, thumbnail, or post.

**3. Follow the 8-step video workflow.** (see "Video authoring workflow" below.) Skipping ANY step = broken output. In particular: script → measure VO with ffprobe → pick a `LAYOUT` preset → compose with library components → wire Spotlight/Indicate emphasis → register → validate → iterate.

**4. Never hallucinate.**
   - **Library names/APIs** → grep `node_modules/`, read the package README, or web-search first. Do not guess an API shape.
   - **File paths** → verify with `ls`, `find`, or `Glob`. Do not assume.
   - **Coordinates** → derive from `LAYOUT` presets in `theme.ts`. Never hardcode `x: 1400, y: 620` in a beat file.
   - **VO timing** → measure with `ffprobe`. Never estimate word-timing without measurement.
   - **Component props** → read the actual `.tsx` file. Do not invent `focusKey` prop shapes that don't exist.

**5. Validate before saying "done."**  Run these in order, all must pass:
   - `npm run check:layout` (no rect overlaps in `LAYOUT` presets)
   - `npm run check:diagrams` (only if diagrams involved)
   - `npm run check:assets` (every `staticFile(...)`, `<VoiceoverAudio/>`, `<SfxCue/>` reference resolves to a real file under `library/`)
   - `npm run lint` (tsc + eslint)
   Only after all four succeed do you report completion.

**6. Never introduce prohibited libraries inside compositions.**  Framer Motion, `use-sound`, `howler`, `d3.transition`, `d3.timer`, bare `lottie-web`, bare `three` — all wall-clock-driven, they desync during render. See "Library conventions" table for approved alternatives.

**7. When uncertain, research before writing.**  Web search or read the actual source. Sixty seconds of research beats an hour of debugging wrong code.

**8. No visual noise.**  Muhammad has flagged pill/border badges as clutter, prefer inline colored text over bordered containers for labels. Ask before adding heavy chrome (drop shadows, gradients, borders) that does not earn its pixels.

**9. NEVER use em dashes.** The character `—` (U+2014) is banned in every output: slide text, voiceover scripts, video overlays, code comments, agent files, CLAUDE.md edits, chat replies. Reason: it is the strongest AI writing tell and Muhammad's audience is students who spot inauthentic voice. Use commas, periods, colons, or normal hyphens (`-`) instead. Same rule for en dashes (`–`). Scan every draft for both characters before returning.

**10. Every slide has at least one visual.** No text-only slides. Each slide includes at minimum ONE of: `@iconify/react` icon, `lucide-react` icon, brand logo, illustration, diagram, arrow, or `framer-motion` animated shape. If you cannot picture a visual for the slide, either the concept is not slide-worthy or you have not thought hard enough.

**11. Content maps tightly to the source.** For curriculum decks, every slide headline must correspond to a section, sub-heading, or bulleted item in the book. Real-world examples are welcome but frame them as extensions of the book's own examples, not new teaching material. Students will be tested on the book, not on what you invented.

**12. Simple English, short sentences.** Audience is 15-year-olds in Pakistan reading English as a second language. Prefer common words over jargon (say "runs" not "executes" unless the book uses "executes"). Keep sentences under 15 words. Active voice, not passive. When a technical term appears, define it inline on first use.

**13. VERBATIM BOOK WORDING for curriculum content (STRICT).** For any deck/video/diagram based on a book:
   - First parse the chapter's exact text to per-topic files under `curriculum/books/parsed/<book-slug>/ch<M>-<slug>/t<T>-<slug>.md` (one file per topic; vision-based Read tool with `pages: "N-M"`, NOT `pdftotext` — Pakistan board PDFs have watermarks that break it). Chapter-wide material (SLOs, Introduction) goes in `overview.md`; a `README.md` tracks per-topic extraction status.
   - Then generate slides from the parsed markdown. Copy topic titles, headings, definitions, Do-You-Know boxes, Activity boxes, and key point sentences EXACTLY. Not one word changed.
   - What you MAY add: layouts, colours, icons, animations, real-world examples (Tesla/ATM/Mars), Tid-Bytes fact boxes. Frame these as clearly-labelled extensions.
   - What you MUST NOT change: any wording inside the book's own headings, definitions, or examples. Even the book's grammar quirks stay (students see the same book).
   - Every slide displays the book's exact topic identifier and title in the top-left of the slide (e.g. `1.1  Introduction to Operating System (OS)`).
   - Every topic ends with two auto-generated summary slides: "Important Concepts" (bullet list of key terms in book wording) + "Definitions and Important Questions" (Q&A a student could face on the exam).
   - Reason: Punjab Board exams quote the book verbatim. Paraphrase = student loses marks.

**14. Personal brand on all viewer-facing credits.** On-screen byline is `Muhammad Raheel · Full Stack Developer · AI Engineer` with the `MR` avatar (or `library/clipart/muhammad-raheel.jpg` if present). Never surface the string `bytemotion` to viewers — that is only the internal repo name.

**15. Never use "Tit Byte" / "Tit Bytes".** The word `tit` is offensive slang. Use `Tid-Bytes` (proper English "tidbits" + byte pun), `Did You Know`, `Fun Facts`, or `Quick Bytes`. `grep -ri 'tit byte'` the repo before shipping any content.

**16. Every curriculum topic = five artefacts, not one.** When Muhammad says "cover topic X.Y" or "make slides for chapter X topic Y", produce ALL of:
   1. Slide deck at `apps/slides/src/decks/class-<N>-ch<M>-t<T>-<slug>.tsx`
   2. MCQs (10 to 15) at `curriculum/multan-board/class-<N>/questions/ch<M>-t<T>-mcqs.md`
   3. Short questions (5 to 8) at `.../ch<M>-t<T>-short.md`
   4. Long questions (2 to 3, if the topic is exam-worthy at long length) at `.../ch<M>-t<T>-long.md`
   5. Deck registration in `apps/slides/src/App.tsx` DECKS map + topic manifest at `videos/topics/<slug>.md`

   Question files use the strict YAML frontmatter + `## Q<N>` heading format defined in `curriculum/RUNBOOK.md`. The format is Postgres-import ready — a small Node script will lift MD → JSON → DB for a future student practice website. Never invent facts; every answer traceable to the per-topic parsed source file `curriculum/books/parsed/<book-slug>/ch<M>-<slug>/t<T>-<slug>.md` or verified web research. Consult the runbook before generating.

**17. Chapter research doc is the source of truth for slide plans.** For every chapter, a `thoughts/research/<book-slug>/ch<M>-<slug>/chapter-research.md` file holds:
   - The 10-step per-topic workflow (prerequisites, extraction, deck, questions, diagrams, verify, report)
   - A status tracker (which topic is shipped, ready-to-build, or needs PDF extract)
   - Per-topic plans: book coverage, slide outline, diagram opportunities, real-world extensions, MCQ/short/long topic coverage, next-topic preview

   When Muhammad says just "topic 1.<N>" or "next topic", read the chapter research doc FIRST. Section 1 tells me the workflow, section 2 tells me the current state, section 3 tells me exactly what to build for that topic. Update the status tracker after every shipped topic. The last content slide of every deck previews the NEXT topic (code + title + one-sentence hook) using the pointer in section 3.

   **Do NOT ask "ready for topic 1.<N+1>?" between topics** (durable rule, Muhammad 2026-09-30). Just report what shipped and stop. He names the next topic himself when ready. Newly discovered rules during a topic (like the no-vertical-empty-space rule) are auto-added to `curriculum/RUNBOOK.md` section "Rules discovered while shipping topics" in the same session, without asking.

## Workflow

**Videos** live under `apps/remotion/videos/<topic-slug>/` with one `<Composition>` per topic registered in `apps/remotion/Root.tsx`. Each composition breaks into per-beat components under `beats/`, using the existing `PlaceholderBeat` primitive as a starting template. Iterate live with `npm run dev` (Remotion Studio). Render with `npx remotion render <CompositionId>`.

**Scripts** live at `content/<topic-slug>.md` in the format enforced by the `video-script` agent. Always write the script first, get it approved, then run `remotion-composer` to scaffold TSX.

**Static social assets** (IG, LinkedIn, thumbnails) go under `library/thumbnails/` or `library/social/<platform>/`. Prefer Figma-first via the Figma MCP when a template exists. Fall back to Remotion stills (`npx remotion still`) when no Figma template is available.

## Agents (project-local, at `.claude/agents/`)

- **`content-pipeline`** — **ORCHESTRATOR.** Runs the full 3-stage pipeline: script → Slidev deck → Excalidraw diagrams → Remotion video, pausing between stages for review. Default entry point for a new topic or chapter.
- **`video-script`** — Topic → structured script in `videos/scripts/<slug>.md`
- **`video-from-recording`** — Raw recording (Urdu OK) → Whisper transcript → script → composition
- **`remotion-composer`** — Approved script → TSX composition registered in `apps/remotion/Root.tsx`
- **`excalidraw-designer`** — Concept → `.excalidraw` JSON with title + labels + numbered arrows + legend. Renders to SVG via `npm run render:diagrams`.
- **`beat-reviewer`** — Post-hoc validator for beat files (prohibited libs, raw coords, missing focusKeys, VO overrun)
- **`thumbnail-generator`** — Topic → 3 thumbnail variants (Figma or code-first)
- **`social-post-designer`** — Topic → IG/LinkedIn posts, carousels, banners
- **`sfx-icon-curator`** — Beat/concept → sound + icon + illustration picks (with gap flags)

## Skills (project-local, at `.claude/skills/`)

- **`frontend-design`** — Copied from the official plugin. Use for aesthetic direction on any visual (post, thumbnail, still). Enforces "no generic AI aesthetics."

## MCP servers

- **`figma`** — the official Figma MCP (`https://mcp.figma.com/mcp`) is already connected via claude.ai OAuth at the user level. No project config needed. Verify with `claude mcp list`. If it ever disconnects, reconnect via `/mcp` in Claude Code.

## Library conventions

| Concern | Choice | Notes |
|---|---|---|
| Icons | `lucide-react` | Default. ISC license, tree-shakable. Fall back to `@iconify/react` only when lucide lacks the concept. |
| Illustrations | unDraw first | CC0-ish, no attribution. Humaaans (CC-BY) second, track in `library/illustrations/CREDITS.md`. |
| Sounds | Synthesized locally, no downloads | Run `npm run gen:sfx` to (re)generate the 7 WAV files in `library/sfx/`. Add new synthesis functions to `library/scripts/shared/generate-sfx.mjs`, never commit downloaded audio. |
| Voiceover | Edge TTS via `msedge-tts` (free, no key) | Run `npm run gen:voice` to synthesise voiceover MP3s from `content/<topic>.md` voiceover lines into `library/voiceover/<topic>/beat-N.mp3`. Voice defaults to `en-US-AriaNeural`; override with `VOICE=en-US-GuyNeural npm run gen:voice`. |
| Diagrams | Excalidraw or tldraw, local file workflow | Author in excalidraw.com or tldraw.com. Save source to `library/diagrams/source/`. Export SVG from the UI to `library/diagrams/<name>.svg`. Run `npm run check:diagrams` to verify pairs. Consume in Remotion via `<Img src={staticFile('diagrams/<name>.svg')} />`. |
| Fonts | `@remotion/google-fonts` | Reuse `apps/remotion/font.ts` (RobotoMono) for code. Add a display font per composition if the script requests. |
| Motion | `useCurrentFrame()` + `interpolate()` + `spring()` | Native Remotion only. **Never** `framer-motion` or `react-spring` inside compositions — they use wall-clock time and desync during render. `remotion-animated` (Stefan Wittwer) is OK for declarative presets (`<Move>`, `<Scale>`, `<Rotate>`, `<Fade>`). |
| Charts | `recharts` / `visx` | Drive values from `useCurrentFrame()`. |
| Audio | `<Audio src={staticFile('sfx/...')} />` | Never `use-sound` or `howler` inside compositions. |
| Emphasis | `Spotlight` + `Indicate` (`apps/remotion/components/`) | Dim + border + pulse. Use `data-focus-target` attributes, not raw coordinates. See "Emphasis system" section. |
| Data viz | `d3-*` scoped modules (`d3-scale`, `d3-shape`, `d3-hierarchy`, `d3-force`) | Pure-math D3 modules only. Never `d3.transition()` or `d3.timer()` (wall-clock). Drive rendering with `useCurrentFrame()`. |
| 3D | `@remotion/three` | Official three.js integration. Renders `<ThreeCanvas>` per-frame. |
| Lottie | `@remotion/lottie` | Maps Lottie's internal timeline to Remotion frame. Never bare `lottie-web` (wall-clock). |
| GSAP (optional) | `@remotion/gsap` (official package) | Use `useGsapTimeline()` from `@remotion/gsap` — it handles the frame-drive bridge for you (no manual `.progress()` needed). Plugins (FLIP, ScrollTrigger, etc.) are **not supported** as of Remotion 4.0.527. GSAP core is Webflow-owned and fully free since Apr 2025. Use when native `interpolate + spring` gets tedious (15+ staggered elements, complex eases like `back.out(1.7)`). |
| Prohibited | `framer-motion`, `use-sound`, `howler`, `d3.transition`, `d3.timer`, bare `lottie-web`, bare `three` | All wall-clock-driven or auto-ticking — desync during render. For 3D use `@remotion/three`, for Lottie use `@remotion/lottie`. |

## Common components (`apps/remotion/components/`)

Organized into subdirectories by role. Beats import direct paths (e.g. `../../../components/primitives/Chip`) — no barrel index, so tree-shaking stays clean.

### `theme.ts` (root)
`CANVAS`, `COLORS`, `LAYOUT` (named rect presets, validated by `check:layout`), `PANEL`, `CODE`, `CONSOLE_METRICS`, `codeLineY()`, `consoleLineY()`, `centerOf()`, `Rect` type.

### `primitives/` — reusable atoms
- **`Chip.tsx`** — colored token/badge. Props: `color`, `label`, `size`, `focusKey`, `fullWidth`.
- **`FlyingChip.tsx`** — chip that flies between two coordinates along an arc.
- **`Arrow.tsx`** — animated SVG bezier arrow with draw-on and fade-out.
- **`ConceptIcon.tsx`** — lucide-react wrapper with consistent branding.
- **`RoughShape.tsx`** — hand-drawn sketchy SVG shapes via roughjs (rectangle, circle, ellipse, line, arrow).
- **`PopIn.tsx`** — spring scale + optional slide entry. Wrap any child that should "pop in" on cue. Pair with `<SfxCue file="pop.wav" at={at} />`.
- **`TypeIn.tsx`** — typewriter text (character-by-character reveal). Props: `text`, `startAt`, `cps`, `cursor`. For per-keystroke SFX, add a series of `<SfxCue file="type.wav" at={startAt + i/cps*fps} />` at the beat level.
- **`EmphasizeWord.tsx`** — inline word-level scale + color emphasis. Use in prose to hit a keyword on cue: `<p>Where <EmphasizeWord at={120} color={COLORS.microtask}>microtasks</EmphasizeWord> go first</p>`. Pair with `<SfxCue file="ting.wav" at={at} />`.

### `containers/` — layout wrappers
- **`Panel.tsx`** — window-style container with traffic-light dots. Accepts `focusKey`.
- **`Region.tsx`** — labeled area. Accepts `focusKey`.
- **`TitleCard.tsx`** — beat title + subtitle, fades in from top.
- **`Reveal.tsx`** — bottom-of-canvas reveal text.

### `code/` — code + console display
- **`CodeBlock.tsx`** — token-highlighted code with active-line support. `focusKey` → per-line `data-focus-target="<key>-line-<i>"`. Helpers: `kw`, `fn`, `str`, `num`, `punc`, `text`, `muted`.
- **`Console.tsx`** — console output line-by-line. `focusKey` → per-line `data-focus-target="<key>-<label>"`.

### `emphasis/` — attention-direction system
- **`Spotlight.tsx`** — element-following dim + border. Path: `{ at, key, borderColor?, padding? }`. Measures via `data-focus-target`. **Default emphasis for concept videos.**
- **`Indicate.tsx`** — one-shot pulse rings. `pulses: { at, key, color?, duration?, grow? }[]`. For punch moments.
- **`GlowBox.tsx`** — static rectangular pulsing glow border. Position via `x, y, w, h`. For highlighting a fixed region without dimming the rest (contrast with Spotlight which dims). Optional `pulse` for slow breathe animation.
- **`ZoomHold.tsx`** — Ken Burns zoom on wrapped content. Props: `focusX, focusY` (fraction of canvas), `scale`, `zoomInAt`, `holdAt`, `zoomOutAt?`, `endAt?`. Use for punch moments where the narrator emphasizes something worth scrutinizing (specific code line, chart datapoint, diagram detail). Pair with `<SfxCue file="swoosh.wav" at={zoomInAt} />`.

### `domain/` — topic-specific but reusable
- **`CallStack.tsx`** — stack of push/pop `StackFrame` chips. Props: `focusKey` (region), `frameFocusKeyPrefix` (per-frame → `<prefix>-<id>`).
- **`EventLoopIcon.tsx`** — spinning lucide `RefreshCw` icon with pulse ring.

### `audio/`
- **`VoiceoverAudio.tsx`** — mounts the beat MP3 by topic + beat number.
- **`SfxCue.tsx`** — Sequence-based `<Audio>` cue helper.

**Icon conventions:** Layers=stack, Timer=task queue, Zap=microtask queue, Globe=Web APIs, RefreshCw=event loop, Terminal=console.

## Asset library (`library/`)

Everything Remotion loads via `staticFile()` lives here. Organized by asset type — the "personal library" for the studio. Regeneration/fetch scripts documented per folder.

| Folder | What lives here | How to add more |
|---|---|---|
| `sfx/` | 12 synthesized UI sounds (tick, click, whoosh, pop, ding, type, notify, ting, zap, chime, click-soft, swoosh) — WAV, all local, no downloads | Add a synthesis function to `library/scripts/shared/generate-sfx.mjs`, then `npm run gen:sfx` |
| `music/` | 10 CC0 Kenney music loops (chill-lofi, ambient-focus, chip-8bit, cinematic-warm, polka-fast, quirky-mission, sad-slow, spaced-out, ukulele-tacky, upbeat-farm) — OGG | Add a `TRACKS` entry to `library/scripts/shared/fetch-music.mjs`, then `npm run fetch:music` |
| `voiceover/<topic>/` | Per-topic MP3s generated by Edge TTS from script voiceover lines | `npm run gen:voice` (auto per topic) |
| `illustrations/` | Full-scene SVGs (unDraw style, people + environments) | Manual — download from unDraw / Humaaans, save here. Track CC-BY sources in `CREDITS.md`. |
| `clipart/` | Small decorative SVGs (arrows, doodles, badges, stickers) | Manual — sources documented in `library/clipart/README.md` |
| `diagrams/` | Rendered SVGs from `.excalidraw` sources | `npm run render:diagrams` (autonomous Puppeteer + Excalidraw) |
| `diagrams/source/` | Editable `.excalidraw` JSON files | Written by `excalidraw-designer` agent or hand-authored |
| `thumbnails/<topic>/` | Rendered YouTube/IG thumbnail PNGs | `thumbnail-generator` agent |
| `snippets/<topic>/` | Code Hike source snippets loaded by compositions | Manual per topic |

### SFX vocabulary (when to use which)

| File | Use for |
|---|---|
| `tick.wav` | Small increment (list item added, stack push, counter tick) |
| `click.wav` | UI selection, decision point |
| `click-soft.wav` | Subtle UI ticks (e.g. active-line highlight moves) |
| `pop.wav` | Element appears (badge, callout, stack pop) — the go-to entry sound |
| `whoosh.wav` | Scene / beat transition, brief hand-off |
| `swoosh.wav` | Longer, deeper transition — pair with `ZoomHold` starts, big scene changes |
| `zap.wav` | Quick cut / interruption / snappy transition |
| `ting.wav` | Word-level emphasis — pair with `EmphasizeWord` on the punch word |
| `ding.wav` | Success, aha, reveal — end of a section |
| `chime.wav` | Warmer positive tone, softer than ding — for gentle transitions |
| `notify.wav` | Notification, message arrival, incoming event |
| `type.wav` | Per-keystroke click for TypeIn effect — instance the cue in a loop |

## Emphasis system — CRITICAL

For **concept-explainer videos** (event loop, RAG, algorithm walkthroughs), use **`Spotlight` + `Indicate`**, not `FocusPointer`. Research from 3Blue1Brown / Fireship / ByteByteGo / Kurzgesagt: cursor-based pointers are for software tutorials where the viewer will replicate the mouse motion themselves. For concepts with no UI, they're decorative noise.

### Coordinate math — the trap and the fix

`getBoundingClientRect()` returns **viewport** coordinates, but `left / top` inside `<AbsoluteFill>` are **composition** coordinates. In Remotion Studio the composition is positioned inside the Studio chrome, so viewport ≠ composition. `useCurrentScale()` alone does NOT fix this (it only handles size scaling). The correct pattern:

```tsx
const rootRef = useRef<HTMLDivElement>(null);
const scale = useCurrentScale();

useLayoutEffect(() => {
  const rootRect = rootRef.current!.getBoundingClientRect();
  const targetRect = document.querySelector('[data-focus-target="foo"]')!.getBoundingClientRect();
  const compX = (targetRect.left - rootRect.left) / scale;  // ← subtract THEN divide
  const compY = (targetRect.top  - rootRect.top ) / scale;
  const compW = targetRect.width  / scale;
  const compH = targetRect.height / scale;
}, [scale]);

return <AbsoluteFill ref={rootRef}>...</AbsoluteFill>;
```

Neither the Remotion docs page nor the `remotion-dev/measure-item` reference repo mention this — they only handle width/height. Baking the subtract-root pattern into `Spotlight` and `Indicate` is the reason they now land correctly.

## Layout system — overlap is impossible by design

**Rule: beats MUST place Panel/Region components using named `LAYOUT` presets from `theme.ts`.** Never invent raw pixel rectangles inline in a beat file.

- **`LAYOUT.twoCol`** — two columns with 40px gap. Beats 1, 2.
- **`LAYOUT.twoColSplitRight`** — left = code, right split vertically. Beat 3.
- **`LAYOUT.scene`** — full event-loop layout: stack + loop + queues + webApi + console. Beats 4, 5.

`npm run check:layout` walks every preset in `theme.ts` and verifies:
1. No two rects within a preset overlap.
2. No rect extends outside the 1920x1080 canvas.

Run before every commit that touches layout. Adding a new preset is fine — the validator picks it up automatically as long as its rects follow `{ x, y, w, h }`. If you need overlap between rects (rare, e.g., an overlay), put them in different presets.

## Video authoring workflow (my responsibility)

When Muhammad gives me a topic or a recorded video, I follow this exact sequence. No skipping steps, no inventing shortcuts.

**1. Script** — write `videos/scripts/<slug>.md` with 4-8 beats. Each beat has: title, on-screen text, verbatim voiceover line, sound cues, expected pointer targets. Voice line ≤ ~200 characters per beat (fits Aria's natural pacing).

**2. Voiceover generation + measurement** — `npm run gen:voice` produces MP3s. Then `ffprobe` each one to get exact duration. Size each `Series.Sequence` in the beat as `ceil(vo_seconds + 1) * fps` — always a 1-second buffer minimum so no beat ever truncates narration.

**3. Layout choice** — pick ONE preset from `LAYOUT` based on the beat count and content:
   - 2-3 beats + code walkthrough → `twoCol`
   - Code walkthrough with sub-regions → `twoColSplitRight`
   - Event-loop-style 5+ regions → `scene`
   - New format? → add a new preset to `theme.ts` first, run `check:layout`, then build the beat.

**4. Composition** — each beat is a `.tsx` file under `apps/remotion/videos/<slug>/beats/`. Uses ONLY the components from `apps/remotion/components/`. Places elements via `LAYOUT.<preset>.<region>`. Never `x: 1400, y: 620` inline.

**5. Emphasis** — every beat has a `<Spotlight path={...}>` and optionally `<Indicate pulses={...}>`. Every target references a `focusKey` string that a `data-focus-target` on some element matches. Pointer timing is calibrated against the VO word rate (~2.7 words/sec for Aria).

**6. Register** — add the `<Composition>` to `apps/remotion/Root.tsx` with `id`, `component`, `durationInFrames`, `fps={30}`, `width={1920}`, `height={1080}`.

**7. Validate** — run in this order:
   - `npm run check:layout` (no rect overlaps)
   - `npm run check:diagrams` (if diagrams involved)
   - `npm run lint` (tsc + eslint)
   - `npm run dev` (open Studio, watch every beat end-to-end)

**8. Iterate** — Muhammad reviews, I adjust. Only after 7 passes clean do we consider a beat done.

**Non-negotiables** (violating any of these means the workflow is broken):
- Never inline raw pixel rectangles in a beat file.
- Never hardcode `x, y` in Spotlight/Indicate paths — always use `key: "..."` + `data-focus-target`.
- Never let a `<Series.Sequence durationInFrames>` be shorter than the beat's VO duration + 1s buffer.
- Never use `framer-motion`, `use-sound`, `howler`, bare `d3.transition`, bare `lottie-web`, bare `three` inside compositions.
- Never leave `console.log` calls or dead imports before returning "done."

### The winning pattern

- **Anchor**: `Spotlight` — dims everything except one element (`data-focus-target="key"`) via the "big box-shadow" trick, draws a colored border, springs between targets. One anchor per moment.
- **Accent**: `Indicate` — one-shot pulse ring at a target for punch moments (VO says "microtasks jump the line" → ring pulses on the microtask queue). Fires once, fades.
- **Rule of thumb**: one anchor + one accent = intentional. Three techniques stacked = chaos.

### Usage

```tsx
// Every element that can be spotlit needs a data-focus-target attribute.
// All common components (Panel, Region, Chip, CodeBlock lines, Console lines,
// EventLoopIcon) accept a `focusKey` prop that stamps this attribute.

<Panel focusKey="beat1-code" ... />
<CodeBlock focusKey="beat1-code" ... />  // → per-line: "beat1-code-line-0", "beat1-code-line-1", ...
<Console focusKey="beat1-console" ... />   // → per-line: "beat1-console-A", "beat1-console-B", ...

<Spotlight
  path={[
    { at: 40,  key: "beat1-code",       borderColor: COLORS.accent },
    { at: 220, key: "beat1-console-A",  borderColor: COLORS.sync, padding: 4 },
    { at: 340, key: "beat1-console-B",  borderColor: COLORS.warn, padding: 4 },
  ]}
  startAt={38}
/>

<Indicate pulses={[
  { at: 340, key: "beat1-console-B", color: COLORS.warn, duration: 45 },
]} />
```

Coordinates are measured from the DOM via `useLayoutEffect` + `getBoundingClientRect` + `useCurrentScale` inside `useDelayRender`. **Never hardcoded.**

### On cursor pointers

Deleted. Concept videos use Spotlight + Indicate exclusively. If we ever build a Camtasia-style software walkthrough video, we can reintroduce a cursor primitive at that time — the pattern is well-documented in the git history.

### Winning combinations (from research)

| Content type | Anchor | Accent |
|---|---|---|
| Concept diagram (event loop, RAG pipeline) | Spotlight dim + border | Indicate ring on the punch moment |
| Code walkthrough | CodeBlock line highlight + Spotlight on the block | Indicate on a specific token |
| Stat / punchline | Whole-frame dim + scale-up target | One-shot glow (Indicate with large `grow`) |

Sources: [3b1b/manim](https://github.com/3b1b/manim), [ByteByteGo diagrams](https://dev.to/rahishsaifi/how-to-create-bytebytego-like-animated-diagrams-for-free-4ece), [Kurzgesagt motion](https://www.skillshare.com/en/classes/motion-graphics-with-kurzgesagt-part-1/631970755), [Remotion measuring](https://www.remotion.dev/docs/measuring), [NN/g animation for attention](https://www.nngroup.com/articles/animation-usability/).

## Whisper transcription (opt-in)

For turning recorded speech (including Urdu) into scripts:

1. `pnpm add @remotion/install-whisper-cpp` (first-time only)
2. Drop your recording at `videos/recordings/<name>.mp4` (folder gitignored)
3. `npm run transcribe recordings/<name>.mp4 --language ur --translate --model small`
4. Outputs `videos/transcripts/<name>.json` (word-level timestamps) and `videos/transcripts/<name>.txt` (plain text).

Flags:
- `--language ur` — Urdu input (also: `en`, `hi`, `es`, ... or `auto`).
- `--translate` — translate to English (Whisper does Urdu→English natively).
- `--model` — `base` (~150MB), `small` (~500MB, default), `medium` (~1.5GB), `large-v3` (~3GB). Larger = slower + more accurate. `small` is a good balance for educational content.

First run downloads whisper.cpp + model to `.whisper/` (gitignored, ~500MB for `small`). Subsequent runs reuse the cached binary and model.

**Muhammad's Urdu workflow**: record video in Urdu (or mixed Urdu+English), transcribe with `--language ur --translate` to get the English script, then generate the composition from the English text. The final video's voiceover is regenerated with `gen:voice` (Edge TTS, English) or overlaid with the original audio track.

## Iconify — the universal icon library

`@iconify/react` is installed and provides on-demand access to **200,000+ icons** across every popular pack. Use it whenever `lucide-react` lacks a concept, and always for **architectural diagrams**, **brand logos**, and **domain-specific glyphs**.

Usage pattern:

```tsx
import { Icon } from "@iconify/react";

<Icon icon="carbon:cloud-services" width={64} color={COLORS.accent} />
<Icon icon="logos:react" width={72} />
<Icon icon="devicon:typescript" width={48} />
<Icon icon="simple-icons:github" width={40} color={COLORS.text} />
```

Icons are fetched from the Iconify API on-demand and cached — no bundle bloat.

### Recommended icon packs by use case

| Use case | Pack | Prefix | Notes |
|---|---|---|---|
| **Cloud / architecture** | Carbon (IBM) | `carbon:*` | 2000+ icons, professionally designed, great for AWS/Azure/GCP diagrams. `carbon:cloud`, `carbon:api`, `carbon:data-base`, `carbon:worker`. |
| **Brand logos** | Simple Icons | `simple-icons:*` | 3000+ tech brand logos, mono-color. `simple-icons:react`, `simple-icons:postgresql`, `simple-icons:kubernetes`. |
| **Dev tools** | Devicon | `devicon:*` | Color logos of programming languages, frameworks, editors. `devicon:typescript`, `devicon:nodejs`. Use `devicon-plain:*` for outline versions. |
| **Colored brand logos** | Logos | `logos:*` | Curated color brand logos. `logos:aws`, `logos:google-cloud`, `logos:kubernetes`. |
| **General UI** | Material Design | `mdi:*` | 7000+ icons for anything not covered above. |
| **Detailed line icons** | Tabler | `tabler:*` | 5000+ crisp stroke icons. |
| **Emoji + symbols** | OpenMoji | `openmoji:*` | 4000+ open-source emoji. Great as accents. |
| **Animated icons** | Icon Park (with anim) | `icon-park-solid:*` / `icon-park-twotone:*` | Some support built-in SMIL animations. |

Browse the full catalog: https://icon-sets.iconify.design . Copy the `set:name` string, paste into `<Icon icon="..."/>`.

### For architectural diagrams specifically

- **AWS Architecture Icons**: `logos:aws-*` or `simple-icons:amazonaws` for the logo; for service-specific icons use `logos:aws-lambda`, `logos:aws-s3`, `logos:aws-rds`, etc. (Iconify's `logos` pack has ~100 AWS service icons.)
- **Azure**: `logos:microsoft-azure`, `logos:azure-databricks-icon`, `logos:azure-functions`, `logos:azure-cosmos-db`.
- **GCP**: `logos:google-cloud`, `logos:google-cloud-run`, `logos:google-cloud-firestore`, `logos:google-cloud-pubsub`.
- **Kubernetes ecosystem**: `logos:kubernetes`, `logos:helm`, `logos:istio`, `logos:prometheus`, `logos:grafana`.
- **Networking (generic)**: `carbon:router`, `carbon:load-balancer-network`, `carbon:firewall`.
- **Databases**: `logos:postgresql`, `logos:mongodb`, `logos:redis`, `simple-icons:mysql`.

Combine iconify icons with `<Arrow>` (from `primitives/`) and `<RoughShape>` for connections between architectural components, and `<GlowBox>` to highlight active subsystems.

## Visual library toolkit (installed)

- **`lucide-react`** — 1500+ line icons. Default for concept icons.
- **`@iconify/react`** — 200k+ icons across every popular pack (Heroicons, Phosphor, Material, Font Awesome, Simple Icons for brand logos). Use when lucide lacks the concept. On-demand loading, no bundle bloat.
- **`@remotion/shapes`** — `<Circle>`, `<Rect>`, `<Triangle>`, `<Star>`, `<Ellipse>`, `<Pie>`, `<Polygon>`. Static geometric primitives.
- **`@remotion/paths`** — parse and animate SVG `<path>` data. `getLength()`, `evolvePath()` for draw-on effects, `resetPath()`, `translatePath()`.
- **`@remotion/lottie`** — `<Lottie animationData={json} />`. Renders After Effects animations frame-synced with the video. Load Lottie JSON from `library/lottie/` or CDN.
- **`roughjs`** — hand-drawn sketchy shapes. Wrapped by `apps/remotion/components/RoughShape.tsx` — pass `{ kind, dims, roughness, seed }`, done.
- **`perfect-freehand`** — pressure-sensitive stroke generator. For custom signature-style annotations, hand-drawn arrows with variable stroke width. Lower-level than roughjs.

## Common visual patterns

- **Concept icon in a scene**: `<ConceptIcon icon={Timer} size={44} color={COLORS.task} glow />`.
- **Branded logo**: `<Icon icon="simple-icons:react" width={72} />` from `@iconify/react`.
- **Draw-on arrow with sketchy style**: `<RoughShape shape={{ kind: "arrow", x1, y1, x2, y2 }} drawFrom={0} drawTo={30} />`.
- **Circle a highlight**: `<RoughShape shape={{ kind: "circle", cx, cy, d: 200 }} color={COLORS.warn} strokeWidth={3} drawFrom={30} drawTo={60} />`.
- **Handwritten note text**: load Caveat/Kalam/IndieFlower via `@remotion/google-fonts`, big font size, near a RoughShape.
- **Animated lottie asset**: `<Lottie animationData={require("../../library/lottie/celebrate.json")} loop={false} />`.

## Infographic library — sourcing

## Canonical dimensions (memorised in agents)

| Platform | Aspect | Pixels |
|---|---|---|
| YouTube 16:9 | 16:9 | 1920x1080 (video), 1280x720 (thumbnail) |
| IG Reels / Stories | 9:16 | 1080x1920 |
| IG feed square | 1:1 | 1080x1080 |
| IG feed portrait / carousel | 4:5 | 1080x1350 |
| LinkedIn post | ~1:1 | 1200x1200 |
| LinkedIn banner (profile) | ~4:1 | 1584x396 |
| Profile picture | 1:1 | 800x800 |

## Commands

- `npm run dev` — Remotion Studio
- `npm run lint` — tsc + eslint (must pass before returning any TSX-writing task)
- `npm run gen:sfx` — regenerate the UI sound library
- `npm run gen:voice` — synthesise voiceover MP3s from `content/<topic>.md` (env: `VOICE`, `RATE`)
- `npm run check:diagrams` — verify every `library/diagrams/source/*.excalidraw|tldraw` has a matching `<name>.svg`
- `npm run check:assets` — verify every asset referenced by a beat exists under `library/`
- `npm run check:layout` — verify no rect overlaps within a `LAYOUT` preset
- `npm run render:diagrams` — render every `library/diagrams/source/*.excalidraw` to `library/diagrams/*.svg` via headless Chromium + Excalidraw
- `npm run transcribe <input> [--language ur] [--translate]` — Whisper transcription (needs `@remotion/install-whisper-cpp`)
- `npx remotion render <CompositionId>` — render a video
- `npx remotion still <entry> <CompositionId> <out.png>` — render a single frame (thumbnails, still posts)

## Package manager

Use `pnpm` (not `npm`) for installs. There's an npm@11.6.0 arborist bug on this Node v24 setup that fails on some dependency trees. `pnpm add <pkg>` works reliably.

## Common pitfalls to avoid

- Don't animate with `framer-motion` inside compositions.
- Don't play sound with `use-sound` / `howler` inside compositions.
- Don't inline text as an image without also recording the raw copy in `content/`.
- Don't invent asset paths in a script; flag missing assets so `sfx-icon-curator` can be run.
