# Curriculum content

Chapter-based teaching content for board syllabi. Same markdown source powers all three output stages: Slidev slides → Excalidraw diagrams → Remotion videos.

## Current focus

Multan Board (Pakistan) Computer Science, classes 9-12. Each class = one folder, each chapter = one markdown file.

## Folder layout

```
curriculum/
  README.md                          (this file)
  chapter-template.md                (copy this to start a new chapter)
  multan-board/
    class-9/
      ch-01-<slug>.md
      ch-02-<slug>.md
    class-10/
    class-11/
      ch-01-programming-fundamentals.md
      ch-02-data-types.md
    class-12/
    questions/
      class-11-ch-01-mcq.md          (multiple choice)
      class-11-ch-01-short.md        (short-answer)
      class-11-ch-01-long.md         (long-answer)
```

A chapter file is the single source of truth. From it, the pipeline produces:
1. A **Slidev deck** at `slides/src/decks/<slug>.tsx` — for live teaching or recording
2. Zero or more **Excalidraw diagrams** at `public/diagrams/source/<slug>-*.excalidraw` — visual reference
3. A **Remotion video** at `src/videos/<slug>/` — final YouTube/reels output

## Chapter file structure

See `chapter-template.md` for the exact skeleton. Every chapter has:

- YAML frontmatter (board, class, chapter number, topic slug, target duration, difficulty)
- **Learning objectives** — what a student should be able to do after
- **Prerequisites** — what they need to know already
- **Beats** — 6-12 concept blocks, each with title, key point, voiceover line, on-screen text, visuals hint
- **Assets needed** — list of diagrams (excalidraw), sfx, illustrations
- **Assessment** — link to matching `questions/` files

## Adding a new chapter

1. Copy `chapter-template.md` to `curriculum/multan-board/class-XX/ch-NN-<slug>.md`
2. Fill in objectives, beats, voiceover lines
3. Ask Claude to:
   - Generate a Slidev deck: `slides/src/decks/<slug>.tsx`
   - Generate Excalidraw diagrams: `public/diagrams/source/<slug>-*.excalidraw`
   - Generate Remotion composition: `src/videos/<slug>/`
   - Generate matching MCQ / short / long question files in `questions/`
4. Review each stage: slides (fastest iteration), then diagrams, then video.

## Question file format

MCQ:
```yaml
- id: mcq-01
  question: "What is a variable in programming?"
  options:
    a: "A container that holds data"
    b: "A type of loop"
    c: "A function name"
    d: "An operator"
  correct: a
  explanation: "Variables store data that can be read and updated during program execution."
```

Short answer:
```yaml
- id: short-01
  question: "Define a variable and give two examples."
  answer_hint: "Container for data; examples like `age = 15` and `name = 'Ali'`."
  marks: 3
```

Long answer:
```yaml
- id: long-01
  question: "Explain data types in a programming language with examples."
  answer_hint: "Cover integer, float, string, boolean with a short example each; mention type inference vs explicit typing."
  marks: 8
```

## Future (planned, not built)

- Next.js quiz site consuming `questions/*.md` for interactive drills
- Python FastAPI grading pipeline for long-answer evaluation
