---
board: Multan Board (Punjab)
class: 10
subject: Computer Science and Entrepreneurship
book: Computer Science and Entrepreneurship 10 (PECTAA)
edition: 1st, April 2026
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
source_pdf: curriculum/books/class-10-cs.pdf
source_pages: 1-19
topics_total: 8
status: COMPLETE
last_updated: 2026-09-30
---

# Chapter 1 · Operating Systems: Structure and Services

**Board:** Multan Board (Punjab) · **Class:** 10 · **Subject:** Computer Science and Entrepreneurship

Everything about this chapter lives inside this folder. One source of truth.

## What is in this folder

```
ch1-operating-systems/
├── README.md              ← you are here (chapter index + status)
├── research.md            ← chapter research + slide plan + status tracker
├── source/                ← verbatim book content (extracted from the PDF)
├── questions/             ← Postgres-ready practice sets (MCQs, short, long, board exercise, mock test)
├── diagrams/
│   ├── source/            ← Excalidraw JSON (editable master)
│   └── rendered/          ← rendered SVGs (also symlinked into library/diagrams/ for the app)
└── slides/                ← README pointing to deck .tsx files in apps/slides/src/decks/
```

## source/ · Verbatim book content

Every heading, definition, DO YOU KNOW box, ACTIVITY box, and key sentence copied EXACTLY from the book, no paraphrasing. This is the ground truth for every deck, question, and diagram.

| File | Book pages | What it holds |
|---|---|---|
| [overview.md](source/overview.md) | 1 | SLOs (13) + chapter Introduction |
| [t1.1-intro-to-os.md](source/t1.1-intro-to-os.md) | 2-3 | Intro to OS (traffic controller, translator, multi-user, accounts) |
| [t1.2-architecture.md](source/t1.2-architecture.md) | 3-5 | Architecture (kernel, shell, layers, libraries, drivers, ACTIVITY) |
| [t1.3-process-management.md](source/t1.3-process-management.md) | 6-9 | Process lifecycle, multitasking, concurrency, scheduling, FCFS, ACTIVITY |
| [t1.4-memory.md](source/t1.4-memory.md) | 9-10 | RAM + Virtual Memory + IBM 5150 fact |
| [t1.5-processes-and-threads.md](source/t1.5-processes-and-threads.md) | 10-12 | Process, thread, browser example, multithreading + 4 benefits |
| [t1.6-system-calls.md](source/t1.6-system-calls.md) | 12 | System call, open/read/write/fork, Linux vs Windows syscall count |
| [t1.7-file-system.md](source/t1.7-file-system.md) | 13-14 | Files, folders, metadata, FAT32/NTFS/APFS/EXT4, ACTIVITY |
| [t1.8-types-of-os.md](source/t1.8-types-of-os.md) | 14-15 | RTOS, Embedded, Network, Mobile OS |
| [summary.md](source/summary.md) | 16 | Book's own Summary (11 verbatim bullets) |
| [board-exercise.md](source/board-exercise.md) | 17-19 | Book's EXERCISE section (8 MCQs + 10 short + 5 long + answer key) |

## questions/ · Practice sets (Postgres-ready)

Every question file has YAML frontmatter + `## Q<N>` heading format so a small Node script can lift these into a database.

**Study order (highest priority first):**
1. [board-exercise.md](questions/board-exercise.md) — the **board's OWN** 8 MCQs + 10 short + 5 long, verbatim from book pages 17-19. Includes the FCFS Long Q5 with full worked waiting-time solution.
2. [mock-test.md](questions/mock-test.md) — bonus 40-mark / 60-min invented mock test (book-inspired).
3. [mixed-mcqs.md](questions/mixed-mcqs.md) — 30 extra MCQs sampled across all 8 topics.

**Per-topic drill (24 files, 8 topics × 3 types):**

| Topic | MCQs | Short | Long |
|---|---|---|---|
| 1.1 | [t1.1-mcqs.md](questions/t1.1-mcqs.md) (12) | [t1.1-short.md](questions/t1.1-short.md) (7) | [t1.1-long.md](questions/t1.1-long.md) (2) |
| 1.2 | [t1.2-mcqs.md](questions/t1.2-mcqs.md) (13) | [t1.2-short.md](questions/t1.2-short.md) (7) | [t1.2-long.md](questions/t1.2-long.md) (2) |
| 1.3 | [t1.3-mcqs.md](questions/t1.3-mcqs.md) (14) | [t1.3-short.md](questions/t1.3-short.md) (8) | [t1.3-long.md](questions/t1.3-long.md) (3) |
| 1.4 | [t1.4-mcqs.md](questions/t1.4-mcqs.md) (11) | [t1.4-short.md](questions/t1.4-short.md) (6) | [t1.4-long.md](questions/t1.4-long.md) (2) |
| 1.5 | [t1.5-mcqs.md](questions/t1.5-mcqs.md) (12) | [t1.5-short.md](questions/t1.5-short.md) (7) | [t1.5-long.md](questions/t1.5-long.md) (2) |
| 1.6 | [t1.6-mcqs.md](questions/t1.6-mcqs.md) (11) | [t1.6-short.md](questions/t1.6-short.md) (6) | [t1.6-long.md](questions/t1.6-long.md) (2) |
| 1.7 | [t1.7-mcqs.md](questions/t1.7-mcqs.md) (13) | [t1.7-short.md](questions/t1.7-short.md) (7) | [t1.7-long.md](questions/t1.7-long.md) (2) |
| 1.8 | [t1.8-mcqs.md](questions/t1.8-mcqs.md) (13) | [t1.8-short.md](questions/t1.8-short.md) (8) | [t1.8-long.md](questions/t1.8-long.md) (2) |

**Chapter totals:** 8 board MCQs + 99 topic MCQs + 30 mixed MCQs = 137 MCQs. 10 board short + 56 topic short = 66 short. 5 board long + 17 topic long = 22 long. Plus 1 mock test paper.

## diagrams/ · Hand-drawn infographics

- [diagrams/source/](diagrams/source/) — Excalidraw JSON files (edit these in the local Excalidraw editor: `pnpm run editor:dev`).
- [diagrams/rendered/](diagrams/rendered/) — SVGs rendered by `pnpm run render:diagrams`. Also symlinked into `library/diagrams/class-10-ch1-*.svg` so the Vite slides app can serve them.

| Topic | Diagram |
|---|---|
| 1.2 | [t1.2-kernel-shell](diagrams/rendered/t1.2-kernel-shell.svg) — recreated Figure 1.1 (User → Shell → Kernel → Hardware) |
| 1.3 | [t1.3-process-lifecycle](diagrams/rendered/t1.3-process-lifecycle.svg) — Creation → Execution → Termination with free-resources loop |
| 1.4 | [t1.4-ram-vs-virtual](diagrams/rendered/t1.4-ram-vs-virtual.svg) — RAM vs Storage with spillover arrow |
| 1.5 | [t1.5-process-vs-thread](diagrams/rendered/t1.5-process-vs-thread.svg) — isolated processes vs shared-memory threads |
| 1.6 | [t1.6-system-calls](diagrams/rendered/t1.6-system-calls.svg) — User Program → Kernel → Hardware syscall flow |
| 1.7 | [t1.7-file-system](diagrams/rendered/t1.7-file-system.svg) — folder tree + metadata panel |
| 1.8 | [t1.8-types-of-os](diagrams/rendered/t1.8-types-of-os.svg) — 4-quadrant OS types |

## slides/ · Slide decks

See [slides/README.md](slides/README.md). Deck source `.tsx` files stay in `apps/slides/src/decks/` because Vite needs them there. That README lists each deck ID + preview URL.

## research.md · Chapter brain

[research.md](research.md) — the chapter's planning doc. Section 1 = workflow, section 2 = topic status tracker, section 3 = per-topic plans, section 4 = chapter-end deliverables. Update this when work ships.

## Status

**Chapter status: COMPLETE.** All 8 topics + summary + board exercise shipped. See [research.md](research.md) section 2 tracker.
