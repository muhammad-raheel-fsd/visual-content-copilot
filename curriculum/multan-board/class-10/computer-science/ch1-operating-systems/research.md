---
book: Computer Science and Entrepreneurship 10
book_slug: class-10-cs
publisher: PECTAA
edition: 1st, April 2026
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
source_pdf: curriculum/books/class-10-cs.pdf
source_pages: 1-19
status: COMPLETE
topics_total_expected: 8
topics_shipped: 8
last_updated: 2026-09-30
maintained_by: Claude Code + Muhammad Raheel
---

# Chapter 1 Research: Operating Systems: Structure and Services

The single "brain" for chapter 1. When Muhammad says "topic 1.<N>", I read this file first, do exactly what section 3 says for that topic, and update the tracker in section 2 when done.

## 1. The workflow (READ FIRST every single time)

Before generating anything for a topic, verify all prerequisites are met. Skip any = broken output.

### Prerequisites checklist

- [ ] Muhammad has explicitly named the topic (e.g. "topic 1.2"). Never guess.
- [ ] Parsed topic file exists at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t<T>-<slug>.md`. If missing, extract from the PDF page range using the vision Read tool. Never use `pdftotext` (watermark defeats it). Update the chapter's `README.md` status table.
- [ ] I have re-read `curriculum/RUNBOOK.md` (question file format + naming conventions).
- [ ] I have re-read the durable rules: verbatim wording, no em dashes, Muhammad Raheel byline (never "bytemotion"), never "Tit Bytes" (use "Tid-Bytes"), every slide has a visual, simple English short sentences.
- [ ] I know which topic is NEXT in the chapter (section 2 tracker) so the deck's final slide can preview it.

### The 10-step process per topic

Step 1. **Confirm scope.** Muhammad says "topic 1.<N>". I look up the per-topic plan in section 3 below. If anything is unclear I ask ONE question before starting.

Step 2. **Ensure the parsed file exists.** Path: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t<T>-<slug>.md`. If missing, extract from the PDF pages listed in section 3 for that topic. Vision Read tool with `pages: "N-M"`. Copy every heading, definition, DO YOU KNOW box, ACTIVITY box verbatim, punctuation and grammar quirks included.

Step 3. **Build the slide deck** at `apps/slides/src/decks/class-10-ch1-t<T>-<slug>.tsx`. Use `SlideLayout`, `HeroSlide`, `SplitSlide`, `Card`. Every slide includes at least one visual (icon, illustration, diagram, animated shape). Use `@iconify/react` for domain icons. Follow the slide outline in section 3.

Step 4. **Last content slide = next-topic preview.** Every deck ends with a "Coming up next" slide showing the NEXT topic's code, title, and one-sentence hook. Section 3 lists the next-topic pointer for every topic. Final chapter topic previews chapter 2, or "End of chapter, revision time" if we're done.

Step 5. **Generate MCQs** (10 to 15). File: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t<T>-mcqs.md`. Format per RUNBOOK.md. Every question's Explanation quotes the book verbatim. Mix: ~3 easy, ~5 medium, ~2 hard.

Step 6. **Generate short questions** (5 to 8). File: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t<T>-short.md`. Answers 1 to 3 sentences, verbatim quotes for definitions.

Step 7. **Generate long questions** (2 to 3, skip if topic isn't exam-worthy at long length). File: `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t<T>-long.md`. `Answer_hint` lists sub-points and verbatim quotes.

Step 8. **Register the deck** in `apps/slides/src/App.tsx` DECKS map with a stable ID (e.g. `class-10-ch1-t1.2-architecture`).

Step 9. **Diagrams (only if planned in section 3).** If the topic needs a hand-drawn infographic, delegate to `excalidraw-designer` agent. Save source at `library/diagrams/source/class-10-ch1-t<T>-<name>.excalidraw`. Run `npm run render:diagrams`. Consume in the deck via `<img src={staticFile("diagrams/<name>.svg")} />`.

Step 10. **Verify and report.** Run `pnpm run slides:build` and `pnpm run lint`. Grep the deck + question files for em dashes, `bytemotion`, `Tit Byt`. All must return zero. Report: paths of all files created. **Do not ask "ready for next topic?"** (Muhammad's rule, 2026-09-30). Stop here. He names the next topic himself when ready.

### The rules that hold across every topic

From `/CLAUDE.md` session policy (rules 1 through 17) and memory:

1. **Verbatim book wording (STRICT).** Book text is untouchable. Real-world extensions labelled "BEYOND THE BOOK" or similar.
2. **Every slide has a visual.** No text-only slides.
3. **Simple English, short sentences.** Audience: 15-year-olds in Pakistan reading English as a second language.
4. **No em dashes** (U+2014 or U+2013 characters). Use commas, periods, or hyphens.
5. **Personal brand:** on-screen byline is "Muhammad Raheel · Full Stack Developer · AI Engineer" with `MR` avatar. Never "bytemotion".
6. **Never "Tit Bytes".** Use "Tid-Bytes", "Did You Know", or "Fun Facts".
7. **Deck last slide = next-topic preview** (new rule from this research doc).
8. **Every topic = 5 artefacts:** deck + MCQs + short + long + registration.

## 2. Topic status tracker

| # | Topic | Book pages | Parsed | Slides | MCQs | Short | Long | Diagram | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | Introduction to Operating System (OS) | 2-3 | done | done | done | done | done | (icons only) | SHIPPED |
| 1.2 | Architecture of an Operating System | 3-5 | done | done | done | done | done | Figure 1.1 hand-drawn (rendered) | SHIPPED |
| 1.3 | Process Management in Operating System (OS) | 6-9 | done | done | done | done | done | lifecycle diagram (rendered) | SHIPPED |
| 1.4 | Memory (Primary + Virtual) | 9-10 | done | done | done | done | done | RAM vs Virtual diagram (rendered) | SHIPPED |
| 1.5 | Processes and Threads | 10-12 | done | done | done | done | done | Process vs Thread diagram (rendered) | SHIPPED |
| 1.6 | System Calls | 12 | done | done | done | done | done | syscall flow diagram (rendered) | SHIPPED |
| 1.7 | File System Structure and Management | 13-14 | done | done | done | done | done | file tree + metadata diagram (rendered) | SHIPPED |
| 1.8 | Types of Operating Systems | 14-15 | done | done | done | done | done | 4-quadrant OS types diagram (rendered) | SHIPPED |

Topic count and page ranges 1.3+ derived from the chapter's Student Learning Outcomes and Introduction section. Actual splits confirmed by extracting pages 6-19 with the vision Read tool.

## 3. Per-topic research

### 1.1 Introduction to Operating System (OS)  [SHIPPED]

**Parsed:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md`
**Deck:** `apps/slides/src/decks/class-10-ch1-intro-to-os.tsx`
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.1-{mcqs,short,long}.md`

**Book coverage:** OS as central controller (traffic controller analogy), Role in user hardware interaction (translator analogy), DO YOU KNOW binary A=01000001, Responsibilities in multi-user environments (4 bullets), Creating and managing user accounts (Standard / Administrative / Guest).

**Real-world extensions used in deck:** Tesla, ATM, Mars rover, phone/laptop, WhatsApp + browser + music simultaneously, computer lab scenario, home shared PC.

**Diagrams:** icons only. No excalidraw needed. The topic is conceptual and the DO YOU KNOW binary example is text-strong enough.

**Next-topic preview slide (last slide of this deck):** "Coming up: 1.2 Architecture of an Operating System. How the OS is built inside, with kernels, shells, and layers."

### 1.2 Architecture of an Operating System  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.2-architecture.md`
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.2-architecture.tsx` (15 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.2-{mcqs,short,long}.md`
**Diagram:** `library/diagrams/class-10-ch1-t1.2-kernel-shell.svg` (source at `library/diagrams/source/class-10-ch1-t1.2-kernel-shell.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.2-architecture`

**Book coverage:**
- Definition of architecture ("way how its parts are organized and how they work together", school analogy)
- Kernel vs Shell (Figure 1.1 in book)
- Kernel: core, controls CPU/memory/devices, car engine analogy
- Shell: outer part, interacts with user, graphical vs command-line
- OS Layers and Modular Design (lower/middle/upper)
- School analogy for layers (support staff / administration / teachers + students)
- System Libraries (ready-made instructions)
- Device Drivers (communicate with hardware)
- ACTIVITY box: identify shell, device driver, system library on your own computer

**Suggested slide outline (12 slides):**

1. Hero: "The Layered Machine". Punchy tagline like "Every OS is built like a school: layers of people, each with a job." Icon stack: kernel + shell + layers.
2. Definition of architecture (verbatim + school analogy visual).
3. Split: Kernel vs Shell (intro card).
4. Kernel deep dive (verbatim definition + car engine analogy + icons: CPU + RAM + devices).
5. Shell deep dive (verbatim + graphical vs command-line examples: Windows desktop + Terminal screenshot).
6. **Figure 1.1 recreate.** Hand-drawn diagram user → shell → kernel → hardware. Excalidraw source at `library/diagrams/source/class-10-ch1-t1.2-kernel-shell.excalidraw`.
7. OS Layers intro (verbatim + layered stack visual).
8. Lower / Middle / Upper layers (three cards with icons: hardware chip / gears / laptop screen).
9. School analogy for layers (verbatim example, three cards matching layers).
10. System Libraries + Device Drivers (split slide with verbatim definitions + photo-editing-app example + printer icon).
11. ACTIVITY box (verbatim, framed as "Try this at home").
12. Important Concepts + Definitions/Important Questions + **Next topic preview:** "Coming up: 1.3 Process Management. How the OS creates, runs, and finishes every program you launch."

**Diagram to author:** `class-10-ch1-t1.2-kernel-shell.excalidraw`. Recreates book Figure 1.1. Concentric layers: hardware center, kernel ring, shell ring, user avatar outside. Labels + numbered arrows for user command flow. Delegate to `excalidraw-designer`.

**Real-world extensions (label as BEYOND THE BOOK):**
- Kernel examples: Linux kernel, Windows NT kernel, XNU (macOS/iOS), Android runs on Linux kernel.
- Shell examples: Windows Explorer + PowerShell + cmd; macOS Finder + zsh; Linux GNOME/KDE + bash.
- Layered design real-world: Android stack (Linux kernel, HAL, Android runtime, framework, apps).
- System library example: libc, Windows API DLLs.
- Device driver example: NVIDIA GPU driver, printer driver for HP.

**MCQ topic coverage (target 12):**
- Definition of architecture (easy)
- School analogy purpose (easy)
- Kernel definition (easy)
- What kernel controls (medium)
- Kernel car analogy match (easy)
- Shell definition (easy)
- Shell types (easy)
- Graphical vs command-line examples (medium)
- Layer purposes lower/middle/upper (medium x3)
- School analogy → layers mapping (medium)
- System library purpose (medium)
- Device driver purpose (easy)
- Photo-editing-app system library example (hard)

**Short question topic coverage (target 6):**
- Define architecture of an OS.
- Differentiate kernel and shell.
- Name the two types of shells with one example each.
- List the three OS layers and one job each.
- Define system libraries.
- Define device drivers.

**Long question topic coverage (target 2):**
- Explain kernel vs shell using the car engine analogy. Include one graphical and one command-line shell example.
- Describe the layered architecture of an OS using the school analogy. Map each layer to its school-analogy component and give one real-world hardware/software example per layer.

**Next-topic preview slide (last slide content):**
- Code: `1.3`
- Title: `Process Management`
- One-liner: "Every app you open is a process. How does the OS create, run, and end them? Coming up next."

### 1.3 Process Management in Operating System (OS)  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.3-process-management.md` (pages 6-9)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.3-process-management.tsx` (18 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.3-{mcqs,short,long}.md` (14 MCQs, 8 short, 3 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.3-process-lifecycle.svg` (source at `library/diagrams/source/class-10-ch1-t1.3-process-lifecycle.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.3-process-management`

**Book coverage (all verbatim in deck):**
- Intro: processes + resources definitions
- Process Life Cycle: Creation / Execution / Termination (with verbatim bullets)
- Example: Google Chrome lifecycle (verbatim 3 stages)
- Multitasking + Concurrency (chef analogy verbatim)
- Process Scheduling Concepts (verbatim + 2 decisions OS must make)
- FCFS definition + queue example
- Numerical Example (P1/P2/P3 table with animated Gantt chart)
- Step-by-Step Explanation (5 verbatim time-stamped steps)
- Observation (verbatim P3 waiting characteristic)
- Advantages + Disadvantages + convoy effect
- DO YOU KNOW: millions of switches per second
- ACTIVITY: FCFS exercise with sample data

**Star slide:** Slide 10 (FCFS Numerical Example) — animated Gantt chart where P1 (0-5s) fills first, then P2 (5-8s), then P3 (8-10s), with time axis + legend. Rendered via inline `<motion.div width>` animations with staggered delays.

**Next-topic preview slide (last slide of this deck):** "Coming up: 1.4 Memory. Where does the OS keep everything it is running? Meet RAM (fast, temporary) and Virtual Memory (extra space borrowed from your disk)."

### 1.4 Memory  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.4-memory.md` (pages 9-10)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.4-memory.tsx` (13 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.4-{mcqs,short,long}.md` (11 MCQs, 6 short, 2 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.4-ram-vs-virtual.svg` (hand-drawn, source at `library/diagrams/source/class-10-ch1-t1.4-ram-vs-virtual.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.4-memory`

**Book coverage (all verbatim in deck):**
- Memory intro (fundamental component, stores data + instructions, CPU access quickly)
- Primary Memory / RAM (main working area, fast, temporary, erased on power off)
- Word document example
- Virtual Memory (when RAM full, OS uses Hard drives / SSD / NVMe)
- Trade-off (storage slower than RAM = reduced performance)
- Simultaneous programs (OS transfers less-active data to virtual memory)
- DO YOU KNOW: IBM 5150 (1981) 16 KB vs modern DDR5 50 GB/s

**Real-world extensions (labelled BEYOND THE BOOK):** typical RAM sizes across devices (Raspberry Pi 512 MB, budget phone 4 GB, flagship phone 8-16 GB, laptop 8-32 GB, gaming PC 16-64 GB, server 128 GB-1 TB) + math note that modern phones have ~1,000,000x more RAM than IBM 5150.

**Next-topic preview slide:** "Coming up: 1.5 Processes and Threads. A process is one whole program. A thread is the smallest unit of work inside it."

### 1.5 Processes and Threads  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.5-processes-and-threads.md` (pages 10-12)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.5-processes-and-threads.tsx` (13 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.5-{mcqs,short,long}.md` (12 MCQs, 7 short, 2 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.5-process-vs-thread.svg` (hand-drawn, source at `library/diagrams/source/class-10-ch1-t1.5-process-vs-thread.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.5-processes-and-threads`

**Book coverage (all verbatim in deck):**
- Process definition (independent program, own memory/CPU/resources, isolated for stability + security)
- Thread definition (smallest unit of execution, multiple per process, shared memory, independent operation)
- Web browser example (1 process, 3 threads: rendering, audio/video, downloads)
- Multithreading definition
- 4 Benefits: Enhanced Performance, Improved Responsiveness (with word processor example), Support for Concurrent Operations (games/video editing/real-time comms), Efficient Use of Resources

**Real-world extensions (labelled BEYOND THE BOOK):** Chrome (one process per tab, threads inside), VLC (video decoding on multiple threads), Photo editors (filters across CPU cores), Video games (physics + AI + graphics + audio in parallel).

**Next-topic preview slide:** "Coming up: 1.6 System Calls. How does a program ask the OS to open a file, read from disk, or start a new process? Meet open, read, write, and fork."

### 1.6 System Calls  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.6-system-calls.md` (page 12)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.6-system-calls.tsx` (12 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.6-{mcqs,short,long}.md` (11 MCQs, 6 short, 2 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.6-system-calls.svg` (hand-drawn, source at `library/diagrams/source/class-10-ch1-t1.6-system-calls.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.6-system-calls`

**Book coverage (all verbatim in deck):**
- Definition + bridge role between user programs and kernel
- Why they exist (safety, simplicity)
- Text editor save example
- 4 types: open (music file), read (document text), write (image save), fork (browser tab)
- DO YOU KNOW: Linux/macOS ~few hundred syscalls, Windows nearly 2,000

**Real-world extensions (labelled BEYOND THE BOOK):** Real syscall code samples in C (Linux/macOS), Win32 API (Windows), Python (`open()`, `f.read()`), Node.js (`readFile`), all mapping back to the same 4 book syscalls.

**Next-topic preview slide:** "Coming up: 1.7 File System. How does the OS organize millions of files into a neat findable tree? Meet files, folders, and metadata."

### 1.7 File System Structure and Management  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.7-file-system.md` (pages 13-14)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.7-file-system.tsx` (13 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.7-{mcqs,short,long}.md` (13 MCQs, 7 short, 2 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.7-file-system.svg` (hand-drawn, source at `library/diagrams/source/class-10-ch1-t1.7-file-system.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.7-file-system`

**Book coverage (all verbatim in deck):**
- Intro: OS stores + organizes user data via file system
- Files (collection of related data: text/images/audio/video/programs)
- Folders (directories: containers to organize files + folders)
- Metadata (name/type/size/date-created/date-modified)
- File Systems: FAT 32 (USB), NTFS (Windows), APFS/HFS+ (macOS), EXT4 (Linux)
- Librarian analogy for photo save
- ACTIVITY: classroom role-play with file cards demonstrating open/read/write/close syscalls

**Real-world extensions (labelled BEYOND THE BOOK):** Detailed comparison table of the 4 file systems (max file size, max volume size, cross-platform support, journaling, encryption). Concrete example: why a big movie file will not fit on FAT 32 USB (4 GB limit).

**Next-topic preview slide:** "Coming up: 1.8 Types of Operating Systems. Meet Real-Time, Embedded, Network, and Mobile operating systems, each optimized for its own device."

### 1.8 Types of Operating Systems  [SHIPPED]

**Parsed source:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.8-types-of-os.md` (pages 14-15)
**Deck:** `apps/slides/src/decks/class-10-ch1-t1.8-types-of-os.tsx` (13 slides)
**Questions:** `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/t1.8-{mcqs,short,long}.md` (13 MCQs, 8 short, 2 long)
**Diagram:** `library/diagrams/class-10-ch1-t1.8-types-of-os.svg` (hand-drawn, source at `library/diagrams/source/class-10-ch1-t1.8-types-of-os.excalidraw`)
**Deck ID in App.tsx:** `class-10-ch1-t1.8-types-of-os`

**Book coverage (all verbatim in deck):**
- Intro: OS designed per device needs + optimized for specific tasks
- Real-Time OS (RTOS): strict deadline, air traffic control / heart-monitoring / industrial robots
- Embedded OS (EOS): small + efficient + built-in, microwaves / washing machines / printers / smart TVs / ATMs
- Network OS (NOS): manages multiple computers, offices / schools / data centers, school lab example
- Mobile OS: smartphones / tablets / handheld, touch-screen + battery + apps
- DO YOU KNOW: Symbian on Nokia → Android / iOS handle millions of apps + 3D games + pro video

**Real-world extensions (labelled BEYOND THE BOOK):** VxWorks (Mars rovers), FreeRTOS (Amazon IoT), QNX (car dashboards); Linux embedded (smart TVs), Windows IoT Core; Windows Server, Ubuntu Server; Android, iOS, HarmonyOS. Note that Android is built on Linux kernel (phone OS + server OS share the same core).

**Final slide:** Chapter 1 celebration + revision teaser (trophy icon, "8 topics complete", 3 pill preview: Revision deck / Mixed MCQ bank / Mock test). This is the LAST topic in the chapter, so it does not preview 1.9 (does not exist); instead it previews the chapter-end deliverables from section 4 of this research doc.

## Chapter status: COMPLETE

All 8 topics shipped. Ready for chapter-end deliverables (section 4): revision deck, mixed MCQ bank, mock test.

## 4. Chapter-end deliverables  [ALL SHIPPED]

1. **Chapter Summary parsed file** at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/summary.md`. **SHIPPED.** All 11 verbatim bullets from book page 16.
2. **Board Exercise parsed file** at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/board-exercise.md`. **SHIPPED.** Verbatim 8 MCQs + 10 short + 5 long + printed answer key from book pages 17-19.
3. **Board Exercise question file** at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/board-exercise.md`. **SHIPPED.** Postgres-ready format, priority = PRIMARY. Model answers built from verbatim book text. Long Q5 includes full worked FCFS solution with waiting time formula (`Waiting time = Start time − Arrival time`).
4. **Chapter revision deck** at `apps/slides/src/decks/class-10-ch1-revision.tsx`. **SHIPPED (updated to 14 slides).** hero → mind-map → 8 per-topic recap cards → exam-ready checklist → **Book Summary (page 16 verbatim, 11 bullets)** → **Board Exercise overview** with curveball callout for waiting-time formula → **Practice Pyramid** ranking (1st board-exercise → 2nd mock-test → 3rd MCQ bank + quiz). Deck ID `class-10-ch1-revision`.
5. **Interactive Quiz deck** at `apps/slides/src/decks/class-10-ch1-quiz.tsx`. **SHIPPED.** 19 slides: hero → how-to → 8 Q+Reveal pairs → score card. Deck ID `class-10-ch1-quiz`.
6. **Chapter MCQ bank** at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/mixed-mcqs.md`. **SHIPPED.** 30 MCQs sampled across all 8 topics (invented practice, book-inspired).
7. **Chapter mock test** at `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/mock-test.md`. **SHIPPED.** Punjab Board style: 40 marks / 60 min (invented practice, book-inspired). Note in file explains this is BONUS practice; primary is `ch1-board-exercise.md`.

## 5. Notes on this research doc

- Update the tracker in section 2 after every shipped topic. Change status from `pending` to `SHIPPED` and remove "READY TO BUILD" from the row.
- Update section 3 per-topic entries as I learn more from PDF extraction (page ranges, diagram opportunities, real-world extensions that actually match the book's tone).
- Add web-research findings under each per-topic block, labelled `**Web research:**`, when useful trivia appears (e.g. "Linux kernel line count today" for a Tid-Bytes box).
- Never delete history from this doc. Struck-through or archived research is still useful context for future decisions.
