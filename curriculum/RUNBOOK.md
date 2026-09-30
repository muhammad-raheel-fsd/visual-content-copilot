---
title: Curriculum content runbook
last_updated: 2026-09-26
maintained_by: Claude Code + Muhammad Raheel
---

# Curriculum content runbook

The single source of truth for how Muhammad's curriculum content is authored, stored, and eventually published to a student website + Postgres.

Every rule here is enforced. When Muhammad says "make slides for chapter X topic Y", this runbook drives the process end-to-end.

## Book PDFs live in ONE place

`curriculum/books/*.pdf` is the only home for source PDFs. Naming: `class-<N>-cs.pdf` (short, lowercase, no spaces).

Do not paste books under `curriculum/` or anywhere else. If you find duplicates, delete them and keep only the `curriculum/books/` copy.

Currently in place:
- `curriculum/books/class-10-cs.pdf` (Punjab PECTAA 2023 curriculum, 10th class)
- `curriculum/books/class-12-cs.pdf` (12th class)

## Every book is parsed into per-topic markdown files

Tree layout:

```
curriculum/books/parsed/
  <book-slug>/                             e.g. class-10-cs
    ch<M>-<chapter-slug>/                  e.g. ch1-operating-systems
      README.md                            chapter index + status table + extraction workflow
      overview.md                          SLOs + Introduction (chapter-scope material)
      t<T>-<topic-slug>.md                 one file per book topic, e.g. t1.1-intro-to-os.md
      t<T>-<topic-slug>.md
      ...
```

Rules:

- One MD file per book topic. Never lump multiple topics into one file. When Muhammad asks "cover topic 1.1", you only need to Read a small focused file.
- Extract verbatim using the vision-based Read tool with a `pages: "N-M"` range. `pdftotext` breaks on Pakistan-board watermarks like `study++`.
- Every topic file has YAML frontmatter with: `book`, `book_slug`, `publisher`, `edition`, `chapter`, `chapter_title`, `topic`, `topic_title`, `kind: topic`, `pages`, `source_pdf`, `last_extracted`.
- The `overview.md` uses `kind: overview` and contains only chapter-wide material (SLOs, Introduction).
- The `README.md` uses `kind: chapter_index` and tracks a status table showing which topics are extracted vs TODO.
- Every heading, definition, DO YOU KNOW box, ACTIVITY box, and key point is copied EXACTLY, punctuation and grammar quirks included.

Example current state:

- `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/overview.md`
- `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md`
- `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.2-architecture.md`

## For every topic, produce five artefacts

When Muhammad says "cover topic 1.1", generate all five:

```
apps/slides/src/decks/class-<N>-ch<M>-t<T>-<slug>.tsx    (interactive slide deck)
curriculum/multan-board/class-<N>/questions/
  ch<M>-t<T>-mcqs.md                                     (10 to 15 MCQs)
  ch<M>-t<T>-short.md                                    (5 to 8 short questions)
  ch<M>-t<T>-long.md                                     (2 to 3 long questions if applicable)
```

Optional per topic (not always needed):
- `library/diagrams/source/class-<N>-ch<M>-t<T>-*.excalidraw` (hand-drawn diagrams)
- `apps/remotion/videos/class-<N>-ch<M>-t<T>-<slug>/` (full narrated video)

## Question file format

All three (`mcqs.md`, `short.md`, `long.md`) share the same skeleton: YAML frontmatter + a strict markdown body that a small parser can turn into JSON for Postgres. Muhammad hand-edits the MD, a build script converts to JSON, the website + Postgres consume the JSON.

### MCQ format

```markdown
---
book: Computer Science 10 (PECTAA)
book_slug: class-10-cs
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
topic: "1.1"
topic_title: "Introduction to Operating System (OS)"
type: mcq
count: 10
verbatim_source: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md
generated_by: content-pipeline agent
last_updated: 2026-09-26
---

## Q1

**Question:** What is an Operating System?

**Options:**
- a) A hardware component of a computer
- b) A type of system software that manages hardware, runs application software, and provides a user interface
- c) An application software like MS Word
- d) A network protocol

**Correct:** b

**Explanation:** From the book: "Operating System (OS) is a type of system software that manages hardware, runs application software, and provides a user interface like Windows, macOS, Linux, Android, and iOS."

**Difficulty:** easy

**Bloom:** remember

---

## Q2
...
```

Rules for MCQs:

- Every question has exactly 4 options labelled `a) b) c) d)`.
- Every question has ONE correct answer, listed as the letter.
- Every question has an `Explanation` that quotes the book verbatim where possible ("From the book: ...").
- `Difficulty` is one of `easy | medium | hard`. Aim for a mix (about 3 easy, 5 medium, 2 hard per 10).
- `Bloom` (optional) is one of `remember | understand | apply | analyze | evaluate | create`.
- Never invent a fact. If the answer is not in the book or in verified web research, do not write the MCQ.
- Separator between questions is `---` on its own line.

### Short question format

```markdown
---
book: Computer Science 10 (PECTAA)
book_slug: class-10-cs
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
topic: "1.1"
topic_title: "Introduction to Operating System (OS)"
type: short
count: 6
verbatim_source: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md
last_updated: 2026-09-26
---

## Q1

**Question:** Define an Operating System.

**Answer:** Operating System (OS) is a type of system software that manages hardware, runs application software, and provides a user interface like Windows, macOS, Linux, Android, and iOS.

**Marks:** 2

**Difficulty:** easy

---

## Q2
...
```

Rules for short:

- Answer is 1 to 3 sentences.
- Quote book text verbatim when the answer is a definition.
- `Marks` is a per-question integer aligned to Punjab Board weighting (2 to 4 typical).

### Long question format

```markdown
---
book: Computer Science 10 (PECTAA)
book_slug: class-10-cs
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
topic: "1.1"
topic_title: "Introduction to Operating System (OS)"
type: long
count: 2
verbatim_source: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md
last_updated: 2026-09-26
---

## Q1

**Question:** Explain the role of the Operating System as the central system controller and as a translator between the user and the hardware. Include one real-world example for each role.

**Answer_hint:**
Cover both sub-topics:
1. Central system controller: verbatim quote from book about traffic controller, three decisions (which task, memory, devices).
2. Translator: verbatim quote about hardware not understanding human language + the click/keypress example, plus the binary ASCII example (A = 01000001) from the DO YOU KNOW box.
Real-world example ideas: (a) a school computer running WhatsApp + browser + music simultaneously (central controller); (b) pressing "A" and seeing it appear on screen (translator).

**Marks:** 8

**Difficulty:** medium

**Expected_answer_length:** 200-300 words

---

## Q2
...
```

Rules for long:

- Provide `Answer_hint` (not a full essay). A hint that lists the sub-points a student must cover, quoting book text where verbatim is required.
- `Marks` is 5 to 10 typical.
- `Expected_answer_length` gives the student a target word count.

## Pipeline to Postgres (future)

When Muhammad ships the Next.js quiz site, one small Node script converts every `questions/*.md` file into a JSON row set:

```
curriculum/**/*.md
   |
   v (lib/scripts/questions-to-json.mjs, when built)
output/questions/class-<N>.json
   |
   v (SQL COPY or Prisma upsert)
Postgres  → website
```

The MD format is designed so parsing is trivial: frontmatter for the metadata, headings for each question, `**Field:**` labels for structured fields. A regex-based parser will do the job. No re-parsing PDFs required.

## When Muhammad says "cover topic X.Y"

The default pipeline:

1. **Ensure the topic file exists** at `curriculum/books/parsed/<book-slug>/ch<M>-<chapter-slug>/t<T>-<topic-slug>.md`. If not, extract from PDF first using the vision Read tool (pages range) and update the chapter `README.md` status table.
2. **Slides**: `apps/slides/src/decks/<slug>.tsx` with verbatim wording, punchy tagline per slide, top-left chrome, no em dashes.
3. **MCQs**: 10 to 15 in `curriculum/<board>/class-<N>/questions/ch<M>-t<T>-mcqs.md`.
4. **Short questions**: 5 to 8 in `.../ch<M>-t<T>-short.md`.
5. **Long questions**: 2 to 3 in `.../ch<M>-t<T>-long.md` (skip if the topic is not exam-worthy at long length).
6. **Register the slide deck** in `apps/slides/src/App.tsx` `DECKS` map.
7. **Update the topic manifest** at `videos/topics/<slug>.md` linking all five artefacts.
8. **Verify**: `pnpm run slides:build`, `pnpm run lint`, zero em dashes / no `Tit Byt` / no `bytemotion` on-screen.

## Naming conventions

- Book slug: lowercase-hyphenated, `class-10-cs`, `class-12-cs`
- Chapter number: `1`, `2`, ... (no leading zero)
- Topic code: dot-separated `1.1`, `1.2`, `2.3.1` (matches the book exactly)
- Deck ID (in URL and DECKS map): `class-<N>-ch<M>-t<T>-<slug>`, example `class-10-ch1-t1.1-intro-to-os`
- Question file: `ch<M>-t<T>-<type>.md`, example `ch1-t1.1-mcqs.md`

## Rules summary (all durable, all enforced)

From `~/.claude/projects/-home-janab-learnings-bytemotion/memory/`:

- **feedback_verbatim_book_wording.md**: verbatim book text is untouchable. Real-world examples labelled `BEYOND THE BOOK`.
- **feedback_slides_and_content.md**: no em dashes, every slide has a visual, simple English, short sentences.
- **feedback_branding_and_wording.md**: on-screen brand is "Muhammad Raheel · Full Stack Developer · AI Engineer" with `MR` avatar. Never "bytemotion". Never "Tit Bytes" (use "Tid-Bytes").
- **feedback_no_docker.md**: no Docker in bytemotion unless a service literally requires it, in which case a local `docker-compose.yml` auto-started by `pnpm run dev:all`.
- **feedback_visual_and_process.md**: no pill/border badges; always use project agents/skills; never hallucinate coordinates, APIs, or paths.

## Rules discovered while shipping topics (auto-added, do not remove)

These rules were learned during real slide reviews with Muhammad. They apply to every future topic.

**R-A. No vertical empty space in slides.**
- Never use `marginTop: "auto"` on a top-level slide child to push content to the bottom. It creates dead space.
- If a slide's paragraph + visual leaves obvious whitespace, add a **bridge caption** between them (small uppercase label with an icon, e.g. `FIVE FAMILIAR OPERATING SYSTEMS YOU HAVE ALREADY USED`) or add a short teasing sentence after the visual.
- Prefer natural stacking with `gap` over auto-margins for slide content.
- Card-internal `marginTop: auto` (e.g. aligning example boxes across two side-by-side cards) is OK — that's per-card layout, not per-slide.

**R-B. Verbatim rule applies EVERYWHERE, not just to teaching paragraphs.**
- Important Concepts summary slides: use the book's exact definition sentences, not paraphrases.
- Definitions and Important Questions Q&A slides: answers quote the book verbatim.
- Card body texts, tooltip labels, aside boxes: use book wording. Only labels like "EXAMPLE", "TIP", "STEPS" are author-added and must be clearly marked as chrome.
- Parenthetical qualifiers from the book (e.g. `(like guards and cleaners)`, `(like the lower layers working with hardware)`, `as shown in Figure 1.1`) are part of the verbatim text and MUST be included.

**R-C. Every deck's last slide previews the next topic.**
- Slide title: "Coming up next" or "Next: 1.<N+1> <topic>".
- Body: next-topic code + title + one-sentence hook pulled from section 3 of the chapter research doc.
- If it is the last topic of a chapter, preview chapter <M+1> instead, or a chapter-revision session.

**R-D. Do not ask "ready for next topic?" between topics.**
- Muhammad's instruction, 2026-09-30: when finishing a topic, stop the "ready for topic 1.<N+1>?" question. Just report what shipped and stop. He will name the next topic himself when ready.
- The chapter research doc still tracks progress; I still update it. But no confirmation prompt.

**R-E. Auto-document new rules the moment they are discovered.**
- If Muhammad corrects an approach, or if a review reveals a new pattern (like R-A above), add the rule to THIS section of the runbook in the same session, without asking.
- Also update CLAUDE.md, memory, or the content-pipeline agent if the rule belongs at that layer.

**R-F. Diagram slide count: prefer both variants.**
- When a chapter has an authoritative figure (e.g. Figure 1.1), ship TWO slides for it:
  1. A hand-drawn Excalidraw SVG that mirrors the book's figure (authentic, static).
  2. An animated inline SVG version that shows the flow/relationship dynamically.
- Rationale: students see the book's version first (recognition), then the animated version (comprehension).

**R-G. Every chapter ships a Quick Quiz deck alongside the revision deck + mock test.**
- File: `apps/slides/src/decks/class-<N>-ch<M>-quiz.tsx`. Deck ID: `class-<N>-ch<M>-quiz`.
- Structure: 8 questions (one per topic) as Q + Reveal slide pairs. Adds hero + how-to + score card = ~19 slides.
- Q slide: number badge + topic tag + big question + 4 option pills + "THINK, THEN PRESS →" nudge. `entrySfx: "notify.wav"`.
- Reveal slide: same question shown small at top + all 4 options with correct one highlighted green + explanation quoting the book verbatim. `entrySfx: "ding.wav"`.
- Score card at end interprets score (7-8 exam ready / 5-6 almost / 0-4 revise).
- Rationale: **active recall** is the single most-studied learning technique. Guessing before seeing the answer beats passive re-reading. Also makes decks usable in live class where teacher pauses.
- Reference implementation: `apps/slides/src/decks/class-10-ch1-quiz.tsx`.

**R-H. Extract the book's EXERCISE section and Chapter Summary FIRST, before authoring any invented practice questions.**
- **Why:** The exam board draws directly from the book's back-of-chapter EXERCISE. Students who study only invented practice (mock test, quiz, MCQ bank) may miss the exact wording of the real exam questions. Also the book's own Summary section is what students memorise for revision. Missing either = incomplete syllabus coverage.
- **How to apply:**
  1. When starting a new chapter, extract pages that follow the last teaching topic (usually 2-4 pages: Summary + EXERCISE). Look for headers `Summary`, `EXERCISE`, `Multiple Choice Questions`, `Short Questions`, `Long Questions`, `Answer Key`.
  2. Save verbatim to `curriculum/<board>/class-<N>/<subject>/ch<M>-<slug>/source/summary.md` and `.../source/board-exercise.md`.
  3. Convert the EXERCISE into a Postgres-ready question file at `curriculum/<board>/class-<N>/<subject>/ch<M>-<slug>/questions/board-exercise.md`, with model answers built from verbatim book text. Mark it `priority: PRIMARY` in the frontmatter.
  4. Update the chapter `README.md` status table to include `summary.md` and `board-exercise.md` rows.
  5. Update the revision deck: add a "Book Summary" slide (all bullets verbatim) + a "Board's Exercise" preview slide + a "Practice Pyramid" final slide ranking (1st board-exercise → 2nd mock-test → 3rd MCQ bank / quiz).
  6. Watch for **exam curveballs**: exercise questions that ask for concepts the book teaches lightly (e.g. Class 10 Ch1 Long Q5 asks for waiting time + average waiting time; the teaching only shows execution timeline). Flag the formula in the model answer and in a callout on the board-exercise revision slide.
- **Rationale:** Syllabus completeness. Students should never feel they are learning content that is not in the book, AND should never miss content that IS in the book but appears in the back-of-chapter exercise. Skip this rule and students get sandbagged by exam curveballs.
- Reference implementation: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/{summary,board-exercise}.md` + `.../questions/board-exercise.md`.

**R-I. One source of truth per chapter. NEVER scatter.**
- Every chapter lives in ONE folder: `curriculum/<board>/class-<N>/<subject>/ch<M>-<slug>/` with fixed subfolders (`source/`, `questions/`, `diagrams/`, `slides/`) + `README.md` + `research.md`. That's it. See [FOLDER-STRUCTURE.md](../FOLDER-STRUCTURE.md) for the canonical layout.
- **NEVER create** a parallel path for chapter content (no `content/books/parsed/...`, no `thoughts/research/<book>/<chapter>/...`, no scattered `library/diagrams/class-<N>-ch<M>-*.excalidraw` masters). Chapter-specific stuff lives inside the chapter folder.
- **NEVER re-create the `content/` top-level folder.** It was deleted 2026-09-30 and merged into `curriculum/` + `videos/`. If you need a new bucket, add it to `FOLDER-STRUCTURE.md` FIRST, then create.
- **Slide `.tsx` source files must stay in `apps/slides/src/decks/`** — Vite compiles from there. The chapter's `slides/README.md` acts as the index + preview URL list; the physical .tsx cannot move.
- **Rendered chapter SVGs live in the chapter's `diagrams/rendered/`** as the master. Symlink into `library/diagrams/class-<N>-ch<M>-*.svg` so Vite can serve them at `/diagrams/*.svg`. Never keep the physical SVG in `library/`; the symlink resolves to the chapter folder.
- **Reason:** Muhammad 2026-09-30, after a scattering incident. Structured patterns beat one-off placement every time. Complete guide: `FOLDER-STRUCTURE.md` at repo root.
