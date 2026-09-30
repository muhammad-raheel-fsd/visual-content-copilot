---
title: bytemotion folder structure guide
status: canonical
last_updated: 2026-09-30
maintained_by: Muhammad Raheel + Claude Code
---

# Folder Structure Guide

**This is the single source of truth for where every file goes.** Read this before creating a new folder or file. If a new type of content does not fit any existing bucket, update this doc first, then create the folder.

## Top-level layout

```
bytemotion/
├── apps/                (code: apps that build)
├── curriculum/          (school curriculum content, board/class/subject/chapter tree)
├── videos/              (video productions not tied to a specific curriculum chapter)
├── library/             (reusable atoms: sfx, music, clipart, fonts, node scripts, generic diagrams)
├── output/              (generic export bucket — legacy; new exports go inside their chapter or video folder)
├── thoughts/            (internal working notes, NOT for shipped content)
├── .agents/             (Claude Code agent definitions, managed by npx skills)
├── .claude/             (Claude Code project config)
├── CLAUDE.md            (project instructions)
├── FOLDER-STRUCTURE.md  (this file)
├── README.md            (project readme)
└── package.json, ...    (workspace config)
```

Rules:

- **Never create a new top-level folder** without updating this doc.
- **Never create `content/` again.** It was deleted and merged into `curriculum/` + `videos/` for good reasons: too many overlapping meanings.

## curriculum/ · School curriculum content

Everything tied to a specific board / class / subject / chapter of a school syllabus.

```
curriculum/
├── README.md                   (curriculum-level index)
├── RUNBOOK.md                  (author workflow: how to add a chapter, rules, formats)
├── chapter-template.md         (blank template for a new chapter)
├── books/                      (source PDFs)
│   ├── class-10-cs.pdf
│   └── class-12-cs.pdf
└── <board>/                    (e.g. multan-board)
    └── class-<N>/              (e.g. class-10)
        └── <subject>/          (e.g. computer-science)
            └── ch<M>-<slug>/   (e.g. ch1-operating-systems)
                ├── README.md           (chapter index)
                ├── research.md         (chapter brain: workflow + tracker + per-topic plans)
                ├── source/             (verbatim book content, one file per topic)
                │   ├── overview.md
                │   ├── summary.md
                │   ├── board-exercise.md
                │   └── t<T>-<slug>.md
                ├── questions/          (Postgres-ready practice sets)
                │   ├── board-exercise.md
                │   ├── mock-test.md
                │   ├── mixed-mcqs.md
                │   └── t<T>-{mcqs,short,long}.md
                ├── diagrams/
                │   ├── source/         (Excalidraw JSON, editable master)
                │   └── rendered/       (SVGs; also symlinked into library/diagrams/ for Vite)
                └── slides/
                    └── README.md       (index pointing to deck .tsx files in apps/slides/src/decks/)
```

### Rules for curriculum

- **One folder per chapter.** Everything about that chapter (source, questions, diagrams, slides pointer, research) sits under it.
- **Never create a parallel path** for a chapter's content (no `content/books/parsed/...`, no `thoughts/research/...` per chapter). Everything is under the chapter folder.
- **Every chapter folder MUST have:** `README.md`, `research.md`, `source/`, `questions/`, `diagrams/`, `slides/`.
- **Slide .tsx source files stay in `apps/slides/src/decks/`** because Vite needs them there. The chapter's `slides/README.md` acts as the index + preview URL list. Never put .tsx files in the chapter folder.
- **Rendered SVGs live in the chapter's `diagrams/rendered/`** as the master. Symlinks in `library/diagrams/class-<N>-ch<M>-<name>.svg` point to them so the Vite slides app can serve them via `/diagrams/class-<N>-ch<M>-<name>.svg`.
- **Source PDFs live in `curriculum/books/`.** Naming: `class-<N>-<subject-short>.pdf` (e.g. `class-10-cs.pdf`, `class-12-cs.pdf`). Do NOT store PDFs in the chapter folder.

### The chapter research doc (`research.md`)

Every chapter has ONE `research.md` at its root. Sections:

1. Workflow (10-step per-topic process + prerequisites checklist)
2. Topic status tracker (table showing SHIPPED / READY / TODO)
3. Per-topic plans (book coverage, slide outline, diagram opportunities, question coverage, next-topic preview)
4. Chapter-end deliverables (Summary + Board Exercise + Mock Test + MCQ bank + Revision deck + Quiz deck)
5. Notes on the doc itself

Reference implementation: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md`.

## videos/ · Video productions

Video projects for YouTube, Instagram, LinkedIn, or general explainers that are NOT tied to a specific curriculum chapter. Curriculum-tied videos live inside the chapter folder (future extension).

```
videos/
├── scripts/            (video script markdown, one per topic)
│   └── <topic>.md
├── topics/             (topic manifests: which assets exist for each video topic)
│   └── <topic>.md
├── recordings/         (raw phone/camera captures, gitignored)
├── transcripts/        (whisper transcripts of recordings, gitignored)
└── source-clips/       (reference input videos, gitignored)
```

**Future extension** (not built yet): per-topic `videos/<topic>/` with `script.md`, `voiceover/`, `diagrams/`, `beats/`, `exports/`. The .tsx composition source stays in `apps/remotion/videos/<topic>/`, similar to how slides work.

## library/ · Reusable atoms

Truly generic assets used ACROSS multiple curriculum chapters or video productions. If it's specific to one chapter or one video, it does NOT belong here.

```
library/
├── scripts/            (Node build/gen scripts, organised by consumer)
│   ├── shared/         (cross-app: gen-sfx, fetch-music, transcribe)
│   ├── remotion/       (Remotion-specific: gen-voiceover, check-layout, verify-assets)
│   ├── excalidraw/     (render-diagrams, check-diagrams)
│   └── slides/         (reserved)
├── sfx/                (12 synthesised WAV files — regenerate with `npm run gen:sfx`)
├── music/              (10 CC0 Kenney music loops)
├── clipart/            (small decorative SVGs, generic — e.g. Muhammad's avatar)
├── illustrations/      (full-scene SVGs, generic — unDraw, Humaaans)
├── diagrams/           (SVGs used by Vite slides + Remotion, populated via symlinks from chapter folders)
│   └── source/         (editable Excalidraw sources for GENERIC diagrams only, e.g. event-loop)
├── voiceover/<topic>/  (per-video-topic voiceover MP3s)
├── thumbnails/<topic>/ (rendered YouTube/IG thumbnails)
└── snippets/<topic>/   (Code Hike code snippets)
```

### Rules for library

- **Only put something in library/ if it is used by MORE THAN ONE chapter or video.** Chapter-specific diagrams live in `curriculum/<...>/diagrams/`, not here.
- **library/diagrams/ contains rendered SVGs, mostly via symlinks from chapter folders.** The physical file lives in the chapter folder. Symlink here so Vite's publicDir can serve `/diagrams/<name>.svg`.
- **library/diagrams/source/ contains editable Excalidraw sources for GENERIC (non-chapter) diagrams only** (e.g. event-loop). Chapter diagrams stay in the chapter folder.

## apps/ · Code

Three independent apps + one Remotion setup:

```
apps/
├── remotion/           (Remotion video source: Root.tsx + videos/<topic>/beats/)
├── slides/             (Vite + React slides app on port 3030; source of all .tsx decks)
└── excalidraw-editor/  (Vite + React Excalidraw editor on port 3040)
```

### Rules for apps

- **Slide .tsx files live in `apps/slides/src/decks/`.** No exceptions. Vite compiles from there. Each chapter's `slides/README.md` indexes which decks belong to that chapter.
- **Remotion video composition .tsx files live in `apps/remotion/videos/<topic>/`.** Non-negotiable for the same reason.
- **Nothing in apps/ should reference curriculum/ paths hardcoded.** Use the symlinks in library/ (for diagrams) or import via relative paths from within the app.

## output/ · Generic exports (legacy)

Currently holds mixed exports. **New exports should go inside their chapter or video folder**, not here. This folder will shrink over time.

## thoughts/ · Internal notes

Internal working notes that are NOT shipped content. Includes:

- `thoughts/research/README.md` — explains that per-chapter research now lives inside the chapter folder, not here
- Any cross-chapter or non-curriculum research notes

**Nothing in thoughts/ should be referenced from shipped code, slides, questions, or curriculum content.** If a note becomes load-bearing, move it into the relevant chapter's `research.md` or into `curriculum/RUNBOOK.md`.

## Migration history

This doc replaces the previous scattered structure:

| Old path | New path |
|---|---|
| `content/books/*.pdf` | `curriculum/books/*.pdf` |
| `content/books/parsed/<book>/ch<M>-<slug>/*.md` | `curriculum/<board>/<class>/<subject>/ch<M>-<slug>/source/*.md` |
| `content/curriculum/multan-board/class-<N>/questions/ch<M>-t<T>-*.md` | `curriculum/multan-board/class-<N>/<subject>/ch<M>-<slug>/questions/t<T>-*.md` |
| `content/curriculum/RUNBOOK.md` | `curriculum/RUNBOOK.md` |
| `content/scripts/*.md` | `videos/scripts/*.md` |
| `content/topics/*.md` | `videos/topics/*.md` |
| `content/recordings/` | `videos/recordings/` |
| `content/transcripts/` | `videos/transcripts/` |
| `content/videos/` | `videos/source-clips/` |
| `thoughts/research/<book>/ch<M>-<slug>/chapter-research.md` | `curriculum/<board>/<class>/<subject>/ch<M>-<slug>/research.md` |
| `library/diagrams/class-<N>-ch<M>-*.svg` | `curriculum/<...>/diagrams/rendered/*.svg` (symlinks kept in library/ for Vite) |

## When adding a new chapter, follow this order

1. Create the chapter folder: `curriculum/<board>/class-<N>/<subject>/ch<M>-<slug>/` with all 4 subfolders + `README.md` + `research.md`.
2. Add the source PDF to `curriculum/books/` if not already there.
3. Extract the chapter to `source/` files (one per topic + overview + summary + board-exercise), verbatim.
4. Author the deck `.tsx` at `apps/slides/src/decks/class-<N>-ch<M>-t<T>-<slug>.tsx` and register in the DECKS map.
5. Update the chapter's `slides/README.md` with the deck ID + preview URL.
6. Author the questions files in `questions/`.
7. Author excalidraw source in `diagrams/source/`, render to `diagrams/rendered/`, symlink into `library/diagrams/`.
8. Update the chapter's `README.md` status.
9. Update the chapter's `research.md` tracker.

## When in doubt

- Read this file first.
- If the new content type is not covered here, ADD IT TO THIS FILE FIRST, then create the folder.
- **Never scatter.** One source of truth per chapter, per video, per asset type.
