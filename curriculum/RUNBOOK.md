---
title: Curriculum content runbook
last_updated: 2026-10-03
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
curriculum/<board>/class-<N>/<subject>/
  ch<M>-<chapter-slug>/                    e.g. ch1-operating-systems
    README.md                              chapter index + status table
    source/
      overview.md                          SLOs + Introduction (chapter-scope material)
      t<T>-<topic-slug>.md                 one file per book topic, e.g. t1.1-intro-to-os.md
      summary.md                           book's own chapter Summary (R-H)
      board-exercise.md                    book's own EXERCISE section (R-H)
```

Full chapter layout (questions/, diagrams/, slides/, research.md): see [FOLDER-STRUCTURE.md](../FOLDER-STRUCTURE.md).

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

## For every topic, produce six artefacts

When Muhammad says "cover topic 1.1", generate all six (the sixth, the website article, is
written by the `web-article-writer` agent and imported with `pnpm content:import` in
`apps/bytemotion-web-app`):

```
apps/slides/src/decks/class-<N>-ch<M>-t<T>-<slug>.tsx    (interactive slide deck)
curriculum/<board>/class-<N>/<subject>/ch<M>-<chapter-slug>/questions/
  t<T>-mcqs.md                                           (10 to 15 MCQs)
  t<T>-short.md                                          (5 to 8 short questions)
  t<T>-long.md                                           (2 to 3 long questions if applicable)
curriculum/<board>/class-<N>/<subject>/ch<M>-<chapter-slug>/web/
  t<T>-<slug>.md                                         (website article: own words, book definitions in :::definition)
  overview.md                                            (once per chapter: title, URL slug, intro)
```

Optional per topic (not always needed):
- `curriculum/<board>/class-<N>/<subject>/ch<M>-<chapter-slug>/diagrams/source/t<T>-<name>.excalidraw` (hand-drawn diagram master), rendered to `diagrams/rendered/t<T>-<name>.svg`, with RELATIVE symlinks `library/diagrams/source/class-<N>-ch<M>-t<T>-<name>.excalidraw` and `library/diagrams/class-<N>-ch<M>-t<T>-<name>.svg` so `npm run render:diagrams` and the slides app find them (see R-I)
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

1. **Ensure the topic file exists** at `curriculum/<board>/class-<N>/<subject>/ch<M>-<chapter-slug>/source/t<T>-<topic-slug>.md`. If not, extract from PDF first using the vision Read tool (pages range) and update the chapter `README.md` status table.
2. **Slides**: `apps/slides/src/decks/<slug>.tsx` with verbatim wording, punchy tagline per slide, top-left chrome, no em dashes.
3. **MCQs**: 10 to 15 in `curriculum/<board>/class-<N>/<subject>/ch<M>-<chapter-slug>/questions/t<T>-mcqs.md`.
4. **Short questions**: 5 to 8 in `.../questions/t<T>-short.md`.
5. **Long questions**: 2 to 3 in `.../questions/t<T>-long.md` (skip if the topic is not exam-worthy at long length).
6. **Register the slide deck** in `apps/slides/src/App.tsx` `DECKS` map.
7. **Update the chapter docs**: chapter `README.md` tables, `slides/README.md` deck index, and the `research.md` status tracker. (`videos/topics/` manifests are for non-curriculum videos only.)
8. **Verify**: `pnpm run slides:build`, `pnpm run lint`, zero em dashes / no `Tit Byt` / no `bytemotion` on-screen.

## Naming conventions

- Book slug: lowercase-hyphenated, `class-10-cs`, `class-12-cs`
- Chapter number: `1`, `2`, ... (no leading zero)
- Topic code: dot-separated `1.1`, `1.2`, `2.3.1` (matches the book exactly)
- Deck ID (in URL and DECKS map): `class-<N>-ch<M>-t<T>-<slug>`, example `class-10-ch1-t1.2-architecture` (one legacy exception: topic 1.1 shipped as `class-10-ch1-intro-to-os`)
- Question file: `t<T>-<type>.md` inside the chapter's `questions/`, example `questions/t1.1-mcqs.md`
- Diagram: `t<T>-<name>` inside the chapter, `class-<N>-ch<M>-t<T>-<name>` for the library symlinks

## Rules summary (all durable, all enforced)

Originally kept as Claude memory files on the previous machine (`/home/janab/...`). Those files did not migrate on 2026-10-03, so THIS list is now the surviving copy:

- **feedback_verbatim_book_wording.md**: verbatim book text is untouchable. Real-world examples labelled `BEYOND THE BOOK`.
- **feedback_slides_and_content.md**: no em dashes, every slide has a visual, simple English, short sentences.
- **feedback_branding_and_wording.md**: on-screen brand is "Muhammad Raheel · Full Stack Developer · AI Engineer" with `MR` avatar. Never "bytemotion". Never "Tit Bytes" (use "Tid-Bytes").
- **feedback_no_docker.md**: no Docker in bytemotion unless a service literally requires it, in which case a local `docker-compose.yml` auto-started by `pnpm run dev:all`.
- **feedback_visual_and_process.md**: no pill/border badges; always use project agents/skills; never hallucinate coordinates, APIs, or paths.

## Rules discovered while shipping topics (auto-added, do not remove)

- **R-W (2026-10-06) Website articles are own words.** `web/t<T>-<slug>.md` explains the topic
  in our own simple English; only definitions, the book's headings and short lists are quoted,
  inside `:::definition{source="<book> (PECTAA), topic <T>"}` blocks. Never paste book
  paragraphs (copyright). Format contract: `.claude/agents/web-article-writer.md`. Question files
  must keep the formats above: the importer parses them (`questions/mixed-mcqs.md` is skipped,
  because it repeats the topic MCQs).
- **R-T (2026-10-07) "Instructor", never "teacher", in our own words.** Muhammad is the
  site's one instructor: articles, slides, emails and the website say "instructor" (singular),
  never "teacher". Book wording quoted verbatim stays as printed (for example the book's
  database examples "Student, Teacher, Course").
- **R-N (2026-10-09) Only the book's own numbering on screen.** Never invent topic codes such
  as "4.1a" or "4.2b". When one book section is split into several decks, every deck shows the
  book's section number and exact section title (`topicCode: "4.1"`, `topicTitle` = the book's
  heading), and the deck title is the book's own sub-heading for that part (for example
  "Layout Management"). The decks are "lessons", never "sub-topics". File names and deck ids
  may keep their internal suffixes (OBS bookmarks), but nothing a student sees may.


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

**R-J. Library symlinks must be RELATIVE, and must carry the `class-<N>-ch<M>-` prefix.**
- Create them from inside the link's folder, e.g. `cd library/diagrams && ln -s ../../curriculum/<...>/diagrams/rendered/t4.1c-layout-managers.svg class-12-ch4-t4.1c-layout-managers.svg`. Never `ln -s /home/<user>/...`.
- **Why:** the 2026-09-30 links were absolute `/home/janab/learnings/bytemotion/...` paths. When the repo moved to a new machine (2026-10-03) every one of them broke, and all 12 deck diagrams stopped loading. Separately, four class-12 source links had no `class-12-ch4-` prefix, so `npm run render:diagrams` wrote loose `library/diagrams/t4.*.svg` copies instead of writing through the prefixed SVG link into the chapter's `diagrams/rendered/`.
- **Check:** `find library/diagrams -xtype l` must print nothing, and `find library/diagrams -type l -lname '/*'` must print nothing.
- Clone or check out this repo with Linux git inside WSL, not a Windows git client: Windows git turns symlinks into small "IntxLNK" stub files.

**R-K. No webcam safe zone: slides, videos and diagrams use the full canvas width (2026-10-04).**
- Muhammad now places his webcam himself in the OBS window, so the old right-10% reservation (192px of 1920) is switched off everywhere. Do not leave an empty strip on the right of any slide, beat, or diagram.
- The switch is kept, not deleted, in case the overlay comes back: `apps/slides/src/components/safeZone.ts` (`SAFE_ZONE_RIGHT`, `FREED_WIDTH`) for slides, `SAFE_ZONE_RIGHT` in `apps/remotion/components/theme.ts` plus `library/scripts/remotion/check-layout.mjs` for videos (old LAYOUT presets are in comments next to the new ones), and a commented-out rule 13 in `.claude/agents/excalidraw-designer.md`.
- When authoring a new deck, rely on `SlideLayout` / `HeroSlide` padding instead of hardcoding right padding. If a centred card needs a fixed `maxWidth`, size it for the full 1760px content width.

**R-L. Ask Muhammad which theme to use BEFORE starting a new chapter. Themes are per chapter, set in ONE place (2026-10-05).**
- **When:** the first time a new chapter is started (new `ch<M>` folder), before building its first deck. Ask with the theme list from `apps/slides/src/themes.ts` (ids: `horizon`, `github-dark`, `one-dark`, `catppuccin-mocha`, `tokyo-night`, `gruvbox`, `nord`, `everforest`) and mention which ones other chapters already use, so neighbouring chapters can look different. He can compare them live in the slide app: **Library** (or `L`) > **Themes** tab, or `?theme=<id>` in the URL.
- **Where it is set:** one line in `CHAPTER_THEMES` in `apps/slides/src/themes.ts`, e.g. `"class-11-ch2": "gruvbox"`. Record the choice in the chapter's `research.md` (section 0) and `README.md`.
- **Decks never carry a theme:** no `theme:` field in the Deck export, and no hardcoded theme colours. Use `var(--accent)`, `var(--sync)`, `var(--microtask)`, `var(--task)`, `var(--api)`, `var(--warn)`, `var(--panel)`, `var(--code-bg)`, `var(--on-accent)` (dark text on a coloured badge), `var(--syn-*)` for code. For tints use `color-mix(in srgb, var(--accent) 10%, transparent)`, never `rgba(r, g, b, a)` of a theme colour. Fixed real-world colours (brand logos, the book's own `lightblue`, mock app windows) may stay hardcoded.
- **Diagrams** are drawn in the chapter theme's colours (background = the theme's `bg`, strokes from its tokens). Changing a chapter's theme later means re-colouring its diagrams too.
- **Adding a new theme:** add an entry to `THEMES` with the palette copied from the theme's official source (link in `source`), then run a WCAG AA contrast check: every text/accent colour must reach 4.5:1 on `panel` and `bg`. Lighten a colour just enough to pass and note it in a comment.
- **Why:** Muhammad found two chapters looking the same (both dark blue) and wants each chapter to have its own look, chosen by him.
