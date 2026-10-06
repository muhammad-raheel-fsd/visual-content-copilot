---
kind: curriculum_index
last_updated: 2026-10-03
---

# Curriculum content

Board-syllabus teaching content. Current focus: Multan Board (Punjab, Pakistan) Computer Science, PECTAA "Computer Science and Entrepreneurship" books, classes 9-12.

**Where files go:** [FOLDER-STRUCTURE.md](../FOLDER-STRUCTURE.md) (canonical).
**How to author a topic:** [RUNBOOK.md](RUNBOOK.md) (question format, naming, rules R-A to R-J).
**Reference chapter:** [class-10 ch1 Operating Systems](multan-board/class-10/computer-science/ch1-operating-systems/).

## Layout

```
curriculum/
  README.md                 (this file)
  RUNBOOK.md                (authoring rules + Postgres-ready question format)
  chapter-template.md       (LEGACY beat-style template, see note inside)
  books/                    (source PDFs, gitignored: class-10-cs.pdf, class-12-cs.pdf)
  multan-board/
    class-<N>/<subject>/ch<M>-<slug>/
      README.md             chapter index + status
      research.md           chapter brain: workflow, status tracker, per-topic plans
      source/               verbatim book text (overview, t<T>-*.md, summary, board-exercise)
      questions/            t<T>-{mcqs,short,long}.md + board-exercise + mock-test + mixed-mcqs
      diagrams/             source/ (Excalidraw master) + rendered/ (SVG)
      slides/README.md      deck index; deck .tsx files live in apps/slides/src/decks/
```

## Chapters

| Chapter | Topics | Theme | Status |
|---|---|---|---|
| [Class 10 · Ch1 Operating Systems](multan-board/class-10/computer-science/ch1-operating-systems/) | 8 (1.1-1.8) | Horizon (`horizon`) | COMPLETE |
| [Class 12 · Ch4 Development of GUI](multan-board/class-12/computer-science/ch4-development-of-gui/) | 7 (4.1a-4.2c) | GitHub Dark (`github-dark`) | COMPLETE |

## Starting a new chapter

1. Create the chapter folder with all subfolders, `README.md`, and `research.md`. Copy the structure of the class-10 ch1 `research.md` (sections 1-5).
2. Extract the chapter from the PDF into `source/` with the vision Read tool (`pages: "N-M"`), never `pdftotext`. Extract Summary + EXERCISE first (R-H).
3. Per topic, when Muhammad names it: deck + MCQs + short + long + registration, plus diagrams where `research.md` plans them. Follow `research.md` section 1.
4. Chapter end: board-exercise questions, mock test, mixed MCQ bank, revision deck, quiz deck (R-G, R-H).

## Future (planned, not built)

- `library/scripts/questions-to-json.mjs`: lift every `questions/*.md` into JSON for Postgres (see RUNBOOK "Pipeline to Postgres").
- Next.js quiz site consuming that JSON for interactive drills.
- Python FastAPI grading pipeline for long-answer evaluation.
