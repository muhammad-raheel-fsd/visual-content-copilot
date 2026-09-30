---
board: multan-board
class: 11
chapter_number: 1
slug: programming-fundamentals
title: "Programming Fundamentals"
target_duration_seconds: 480          # 8 minutes — full lesson video
difficulty: introductory
prerequisites:
  - "class-10 basic computer literacy"
learning_objectives:
  - "Define what programming is and why it matters"
  - "Distinguish source code from executable code"
  - "Name three programming languages and their typical use"
questions_file: questions/class-11-ch-01-mcq.md
---

# Programming Fundamentals

## Beats

### Beat 1 — Hook (~30s)
- **Key point**: A computer only understands numbers. Programming is the art of telling it what to do in a language that we and it can both read.
- **On-screen text**: "How do we talk to a machine?"
- **Voiceover**: "Every app on your phone, every website you visit, every game you play — someone wrote instructions for a computer to follow. Those instructions are called a program. Writing them is called programming. Let's see how it works."
- **Visuals**: title card + a doodle of a phone with icons popping in.
- **SFX**: `pop.wav` on each icon.

### Beat 2 — Source code vs machine code (~60s)
- **Key point**: We write human-readable source code; a compiler or interpreter turns it into instructions the CPU actually runs.
- **On-screen text**: "Source → Compiler → Machine code"
- **Voiceover**: "Humans write in languages like Python or C++. But the CPU only reads 0s and 1s. A special program called a compiler translates our code into machine code. Some languages, like Python, use an interpreter that translates and runs at the same time."
- **Visuals**: excalidraw diagram — three labeled boxes (Source code, Compiler, Machine code) with numbered arrows.
- **SFX**: `tick.wav` per box appearance, `swoosh.wav` when the arrow draws.
- **Diagram needed**: `programming-fundamentals-compile.excalidraw`

### Beat 3 — Common languages (~60s)
- **Key point**: Different languages exist because they solve different problems.
- **On-screen text**: "Right tool for the job"
- **Voiceover**: "Python is easy to read — great for beginners and data science. JavaScript runs in every browser — that's why every website uses it. C++ is fast and low-level — used in games and operating systems."
- **Visuals**: three cards (Python / JavaScript / C++) with brand logos via iconify, each with one use-case line.
- **SFX**: `pop.wav` per card entry.

### Beat 4 — Write and run (~60s)
- **Key point**: A program is written in a plain text file, then run with a command.
- **Voiceover**: "Let's write a program. Open a text editor. Type `print('Hello, world!')`. Save it as `hello.py`. In the terminal, type `python hello.py`. The computer prints `Hello, world!` back to you. That is a program."
- **Visuals**: split slide — code panel (hello.py) on left, terminal output on right.
- **SFX**: `type.wav` per keystroke of code, `ding.wav` on output.

### Beat 5 — Recap (~30s)
- **Voiceover**: "Programming is writing instructions in a language humans can read and machines can execute. Different languages fit different jobs. To write your first program, you need only a text editor and one command in the terminal."
- **On-screen text**: 3-bullet recap.
- **SFX**: `chime.wav` on final bullet.

## Assets needed

- Diagrams (via `excalidraw-designer`):
  - `programming-fundamentals-compile.excalidraw` — source → compiler → machine code, numbered arrows
- Icons (iconify):
  - `logos:python` — for Python card
  - `logos:javascript` — for JavaScript card
  - `logos:cplusplus` — for C++ card
  - `carbon:terminal` — for terminal panel
- SFX: `pop`, `tick`, `swoosh`, `type`, `ding`, `chime` — all in library
- Voiceover: `public/voiceover/programming-fundamentals/beat-{1..5}.mp3` — `npm run gen:voice`

## Assessment

- MCQ: `curriculum/multan-board/questions/class-11-ch-01-mcq.md`
- Short-answer: `curriculum/multan-board/questions/class-11-ch-01-short.md`
- Long-answer: `curriculum/multan-board/questions/class-11-ch-01-long.md`
