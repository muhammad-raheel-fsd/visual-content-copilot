---
kind: chapter_slides_index
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
deck_count: 10
last_updated: 2026-09-30
---

# Chapter 1 · Slide Decks

The `.tsx` deck source files physically live in `apps/slides/src/decks/` (the Vite app needs them there to build). This file is the index of all decks that belong to this chapter, with preview URLs.

## How to preview

```bash
pnpm run dev:all           # starts all 3 dev servers (Remotion + slides + editor)
# OR just the slides app:
pnpm run slides:dev
```

Then open one of the URLs below in a browser.

## Decks in this chapter

| # | Deck ID | Purpose | Source file | Preview URL |
|---|---|---|---|---|
| 1 | `class-10-ch1-intro-to-os` | Topic 1.1 — Intro to OS (12 slides) | [apps/slides/src/decks/class-10-ch1-intro-to-os.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-intro-to-os.tsx) | http://localhost:3030/?deck=class-10-ch1-intro-to-os |
| 2 | `class-10-ch1-t1.2-architecture` | Topic 1.2 — Architecture (15 slides) | [.../class-10-ch1-t1.2-architecture.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.2-architecture.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.2-architecture |
| 3 | `class-10-ch1-t1.3-process-management` | Topic 1.3 — Process Management (18 slides) | [.../class-10-ch1-t1.3-process-management.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.3-process-management.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.3-process-management |
| 4 | `class-10-ch1-t1.4-memory` | Topic 1.4 — Memory (13 slides) | [.../class-10-ch1-t1.4-memory.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.4-memory.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.4-memory |
| 5 | `class-10-ch1-t1.5-processes-and-threads` | Topic 1.5 — Processes and Threads (13 slides) | [.../class-10-ch1-t1.5-processes-and-threads.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.5-processes-and-threads.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.5-processes-and-threads |
| 6 | `class-10-ch1-t1.6-system-calls` | Topic 1.6 — System Calls (12 slides) | [.../class-10-ch1-t1.6-system-calls.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.6-system-calls.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.6-system-calls |
| 7 | `class-10-ch1-t1.7-file-system` | Topic 1.7 — File System (13 slides) | [.../class-10-ch1-t1.7-file-system.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.7-file-system.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.7-file-system |
| 8 | `class-10-ch1-t1.8-types-of-os` | Topic 1.8 — Types of OS (13 slides) | [.../class-10-ch1-t1.8-types-of-os.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-t1.8-types-of-os.tsx) | http://localhost:3030/?deck=class-10-ch1-t1.8-types-of-os |
| 9 | `class-10-ch1-revision` | Chapter revision deck (14 slides, includes book Summary + Board Exercise preview + Practice Pyramid) | [.../class-10-ch1-revision.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-revision.tsx) | http://localhost:3030/?deck=class-10-ch1-revision |
| 10 | `class-10-ch1-quiz` | Interactive quiz deck (19 slides, 8 Q + Reveal pairs + score card) | [.../class-10-ch1-quiz.tsx](../../../../../../../apps/slides/src/decks/class-10-ch1-quiz.tsx) | http://localhost:3030/?deck=class-10-ch1-quiz |

## Why the .tsx files are not physically here

Vite compiles from `apps/slides/src/` and only that directory. Moving `.tsx` files into `content/` would break the build. Instead we keep the source there and this README acts as the chapter-level index.

**Future work:** add a build step that exports each deck to static HTML (via `vite build` per-deck) or PDF (via headless Chrome print), and place those exports in this folder as `<deck-id>.html` / `<deck-id>.pdf`. That would make this folder fully self-contained for offline sharing without needing the Vite app.
