# Phase 02: Kernel vs Shell

| | |
| --- | --- |
| Topic code | C10-01-02 |
| Class | Class 10 |
| Book | Computer Science and Entrepreneurship - Class 10 (PECTAA, 1st edition, April 2026) |
| Chapter | Chapter 1: Operating Systems: Structure and Services (chapter starts p. 1) |
| Book section | 1.2 Architecture of an Operating System, the "Kernel vs Shell" part, pages 3 to 4 |
| Book source used | the PDF itself, book pages 3 to 4 (PDF pages 6 to 7 of `curriculum/books/class-10-cs.pdf`), read 2026-10-11, matching `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.2-architecture.md` |
| Priority / effort | A / M |
| Playlist | Class 10 Computer Science \| Animated Concepts (in book order; also "Operating Systems \| Class 10 CS Ch 1" once 3 videos exist) |
| Website page | `conceptoscope.com/<class-10 course>/<chapter-1>/architecture` (topic slug `architecture`) |
| Status | scripted (waiting for Muhammad's approval, then recording) |

Why this is phase 02: phase 01 ends with "OS ki agli video mein hum dekhenge ke Kernel aur Shell
mein kya difference hai". (It was planned as phase 19; "Spot the phishing message" moved to 19.)

**Scope: Kernel vs Shell only** (Muhammad, 2026-10-11). The animated series explains one concept
well; the rest of section 1.2 (architecture, layers, system libraries, device drivers) belongs to
the full lecture series.

Rules for every phase: [production-guide.md](production-guide.md). One recording; the master,
every Short and the feed cut come from it. The voice is the script: animations follow what is
actually said.

**What the book says (book pages 3 to 4, quoted, used on screen word for word):**

- Kernel: "The kernel is the core part of the operating system, that directly controls the
  computer's system software and hardware such as the CPU, memory, and devices." "It decides
  how and when different programs can use these resources." Example: "When you open a file, the
  kernel manages the process of reading it from the hard drive and sending it to the screen."
  Analogy: "Like Engine of a car is kernel and accessories like steering wheel, dashboard are
  shells."
- Shell: "The shell is the outer part of the OS that interacts with the user." "It receives
  commands from the user and passes them to the kernel." Graphical shells "(like Windows
  desktop) where you click icons and use menus"; command-line shells "(like the Command Prompt
  or Terminal) are where you type instructions."
- Figure 1.1: "Diagram to illustrate the relationship between the user, shell, and kernel in an
  operating system": User Applications at the top, the Operating System (Shell outside, Kernel
  inside) in the middle, Hardware (a printer, a chip) at the bottom.

**Book only** (Muhammad, 2026-10-11): every fact comes from book pages 3 to 4; the main scenario
is the book's own example (opening a file) and its car. Real-world examples that illustrate a
book sentence are fine (type / click / tap, two apps wanting the speaker, the letter A from
phase 01); no extra facts. Definitions are said simply, with the book's line on screen, so
students understand them instead of memorising long sentences.

**Link to phase 01:** phase 01 said the OS manages your commands. This video shows HOW: the OS
does it through its two parts, the Shell (talks to you) and the Kernel (controls the hardware).
Shell and Kernel are always called parts OF the OS, never separate layers.

---

## 1. Hook options

Lines 1.1 and 1.3 open the Short, so they must work alone. Style reference: phase 01 as recorded
(v4): calm, clear, a real question the video answers.

1. **(picked, Muhammad's own flow, 2026-10-11)** Start straight with what the student does
   (type, click, tap), recall the last video (the OS manages these commands; letter A =
   01000001), then ask how the command and the A reach the hardware.
2. "Jab tum phone pe ek app pe tap karte ho, to yeh order phone ke andar kahan jata hai?"
   Shorter, but no link to the series.
3. "Har Operating System ke do parts hain jinke baghair tumhara phone ek command bhi nahi samajh
   sakta." A statement, not a question.

---

## 2. Master transcript (read once, straight through)

About 4 minutes 15 seconds after editing (about 780 words). **Bold** = stress the word. Do not read the line
IDs. A mistake? Say the line again and carry on: the last complete take wins. Speak calmly and
evenly, like in phase 01. Change any line that sounds more natural to you: the video follows what
you actually say.

### Beat 1: Hook (0:00 to 0:26)

> `1.1` Tum phone ya computer pe **type** karte ho, **click** karte ho, ya **tap** karte ho.
> `1.2` Pichli video mein humne dekha tha ke Operating System tumhari in saari commands ko manage
> karta hai.
> `1.3` Lekin kabhi socha hai ke yeh saari commands **hardware** tak pohnchti kaise hain?
> `1.4` Jaise letter A ka binary code 01000001 (zero one zero zero zero zero zero one) tha. Lekin A
> hardware tak kaise pohncha, aur hardware ne usay samjha kaise?
> `1.5` Iska answer Operating System ke andar hi hai, uske do parts mein: **Shell** aur **Kernel**.
> `1.6` Aaj hum in dono ko step by step samjhenge, bilkul simple terms mein.

### Beat 2: The big picture (0:26 to 0:44)

> `2.1` Sab se pehle ek baat clear kar lo: Shell aur Kernel, dono Operating System ke hi **parts**
> hain.
> `2.2` Operating System tumhari commands ka kaam inhi do parts ke zariye karta hai.
> `2.3` Shell OS ka **bahar wala** part hai, jo tum se baat karta hai. Aur Kernel OS ka **andar
> wala** part hai, jo hardware se baat karta hai.

### Beat 3: The Kernel (0:44 to 1:10)

> `3.1` To pehle Kernel ko samajhte hain.
> `3.2` Tumhari book ke mutabiq, Kernel Operating System ka **core part** hai.
> `3.3` Simple terms mein, Kernel computer ke hardware ko directly **control** karta hai, jaise CPU,
> memory aur devices.
> `3.4` Aur Kernel hi **decide** karta hai ke kaunsa program in resources ko kab aur kaise use
> karega.
> `3.5` Jaise agar do apps ek hi time pe speaker use karna chahein, to Kernel decide karta hai ke
> awaaz kis ki aayegi.

### Beat 4: The Shell (1:10 to 1:40)

> `4.1` Ab aate hain **Shell** ki taraf.
> `4.2` Tumhari book ke mutabiq, Shell Operating System ka **outer part** hai, jo user se interact
> karta hai.
> `4.3` Yaani Shell tumhari commands **receive** karta hai, aur unhein Kernel tak pass karta hai.
> `4.4` Shell do types ke hote hain.
> `4.5` **Number ek**: graphical shell, jaise Windows desktop, jahan tum icons pe click karte ho
> aur menus use karte ho.
> `4.6` **Number do**: command-line shell, jaise Command Prompt ya Terminal, jahan tum
> instructions type karte ho.

### Beat 5: The whole scenario, the book's example (1:40 to 2:30)

> `5.1` Ab poora scenario dekhte hain, tumhari book ki example ke saath: jab tum ek **file** open
> karte ho, to kya hota hai?
> `5.2` **Number ek**: tum file pe click karte ho, aur Operating System ka Shell yeh command
> receive karta hai.
> `5.3` **Number do**: Shell yeh command OS ke Kernel tak pass karta hai.
> `5.4` **Number teen**: Kernel hard drive se file **read** karta hai, aur CPU aur memory ko kaam pe
> lagata hai.
> `5.5` **Number chaar**: Kernel file ko screen tak bhejta hai, aur Shell ke zariye file tumhare
> saamne open ho jati hai.
> `5.6` To command Shell se Kernel tak jati hai, aur Kernel se hardware tak. Aur result wapas
> hardware se Kernel, aur Kernel se Shell ke zariye tum tak aata hai.
> `5.7` Tumhara A bhi isi tarah pohnchta hai: jab tum Command Prompt mein A type karte ho, to Shell
> usay receive karta hai, aur Kernel, jo hardware ko control karta hai, usay screen tak pohnchata
> hai.

### Beat 6: The book's diagram (2:30 to 2:48)

> `6.1` Tumhari book yahi baat ek **diagram** se dikhati hai.
> `6.2` Sab se upar user aur applications hain, phir Operating System, aur sab se neeche hardware.
> `6.3` Aur Operating System ke andar, Shell user ki taraf hai, aur Kernel hardware ki taraf.

### Beat 7: The car (2:48 to 3:08)

> `7.1` Tumhari book in dono ko ek car ki example se bhi samjhati hai.
> `7.2` Car ka **engine** Kernel hai, jo asal kaam karta hai.
> `7.3` Aur steering wheel aur dashboard **Shell** hain, jin ke zariye driver car ko control karta
> hai.
> `7.4` Driver engine ko directly handle nahi karta. Woh steering use karta hai, aur baaqi kaam
> engine karta hai.

### Beat 8: A common mistake (3:08 to 3:22)

> `8.1` Ab ek **common mistake**, jo bohat se students karte hain: woh samajhte hain ke Shell sirf
> Command Prompt jaisi black screen hoti hai.
> `8.2` Lekin tumhari book ke mutabiq, Windows desktop bhi ek Shell hai, graphical shell. Dono hi
> Shell hain.

### Beat 9: Recap (3:22 to 3:36)

> `9.1` To yeh hamesha yaad rakhna: Shell aur Kernel, dono Operating System ke parts hain.
> `9.2` Shell OS ka outer part hai, jo tumhari commands leta hai. Aur Kernel OS ka core part hai,
> jo hardware ko control karke woh kaam karwata hai.

### Beat 10: Question, website, next video, full series (3:36 to 4:20, then a 5 s end card)

> `10.1` To ab tum comments mein batao: jab tum Command Prompt mein ek command type karte ho, to OS
> ka kaunsa part tumhari command receive karta hai, Shell ya Kernel?
> `10.2` Is topic ke MCQs, short questions aur notes maine website pe daal diye hain. Abhi jao aur
> check karo ke tum kitne solve kar paate ho.
> `10.3` OS ki agli video mein hum dekhenge ke Operating System kaise **decide** karta hai ke CPU
> apps ko kis order mein process kare.
> `10.4` Aur yaad rakhna, yeh animated series sirf concepts ko samajhne ke liye hai. Meri **full
> lecture series** is se kahin zyada detailed aur interesting hai.
> `10.5` To follow aur subscribe kar lo, taake jab woh series launch ho, to tum usay foran access
> kar sako, aur meri website pe quizzes aur important short aur long questions ki practice kar
> sako.
> `10.6` Allah Hafiz.

(Answer to 10.1: the Shell. It receives the command and passes it to the Kernel.)

---

## 3. Master visual plan (16:9)

GitHub-dark stage with the grid, the handles bar along the bottom, topic tag "Class 10 | Ch 1 |
1.2 Kernel vs Shell". Every animation is cued to a spoken word; all icons are lucide unless
marked Iconify. SFX are the equalised, non-musical set (pop, click, snap, thud, whoosh, swoosh,
zap, tick, type), times `SFX_GAIN`.

| Beat | On screen | Animation on the words | Sound |
| --- | --- | --- | --- |
| 1 Hook | Three input cards (type `Keyboard`, click `MousePointerClick`, tap `Smartphone`); a "Pichli video" chip with the phase 01 traffic-signal frame; the letter A key and its 8 bits (reuse phase 01's bit tiles); a computer outline with an "Operating System" box above a hardware row (`Cpu`, `Printer`). | "type", "click", "tap": each card pops with its gesture. "Pichli video": the chip slides in, "manage" lights the OS on it. "hardware": a command chip drops into the OS box and stops at a "?" above the hardware row. "01000001": the A key presses and its bits type in; "samjha": a "?" over the CPU. "Shell" and "Kernel": the OS box opens and shows two parts inside, named on their words. "step by step": three numbered boxes, "simple" in green. | click per card, type per bit, pop on Shell, thud on Kernel |
| 2 Big picture | One "Operating System" box, always on screen from here: an outer ring "Shell" facing the user (`Users`, left) and an inner core "Kernel" facing the hardware (right). | "parts": both parts pulse inside the one OS box (the label "Operating System" stays on the box). "zariye": a dotted path user > Shell > Kernel > hardware draws. "bahar wala": the ring lights with a speech bubble to the user; "andar wala": the core lights with cables to the hardware. | snap on parts, pop, pop |
| 3 Kernel | The core grows to the centre; the book line on screen: "The kernel is the core part of the operating system". | "core part": the book line types in under the core. "control": cables draw to `Cpu`, `MemoryStick`, device (`Printer`, `Monitor`) cards; "devices" pulses. "decide": a gate opens for one program card, the others wait. "speaker": two app chips reach for a `Speaker` card; the gate lets one through. | thud on core, snap on decide |
| 4 Shell | The ring returns round the core; the book line: "The shell is the outer part of the OS that interacts with the user". Two cards for the types. | "outer part": the book line types in. "receive": a command chip goes user > ring; "pass": ring > core. "Number ek": graphical card (Windows desktop mock with icons + `MousePointerClick`). "Number do": command-line card (`SquareTerminal`, `C:\> dir` typing in, mono font). | pop per card, type ticks while the command types |
| 5 Scenario | Left to right: a `FileText` icon on a desktop > the OS box (Shell ring, Kernel core) > `HardDrive`, `Cpu`, `MemoryStick` > a monitor showing the open file. Caption "Book example". | "file": the file icon pops. On each "Number" one hop draws with a dot: click > Shell (ring lights), Shell > Kernel (core lights), Kernel > hard drive / CPU / memory (each lights on "read", "CPU", "memory"), Kernel > screen (the file opens). "result wapas": the dot runs back up the same path to the user. 5.7: the A key's bits run the same path through Command Prompt, the "A" appears on screen, and the hook's "?" turns into a green tick. | snap per number, whoosh on the way back, thud on the tick |
| 6 Diagram | The book's Figure 1.1, redrawn in the series style: User Applications (top), the Operating System box with the Shell on the user side and the Kernel on the hardware side (middle), Hardware row with a printer and a chip (bottom). Caption: "Book, Figure 1.1". | "upar": the user row drops in; "Operating System": the box (both parts inside); "neeche": the hardware row. "user ki taraf": the Shell lights with an arrow to the user; "hardware ki taraf": the Kernel lights with arrows to the hardware. | pop per row, snap |
| 7 Car | A car (`Car` icon, large) splits into an engine (`Cog` spinning, "Engine = Kernel") and a dashboard (`Gauge` + Iconify `mdi:steering`, "Steering + dashboard = Shell"). | "car": the car drives in. "engine": the engine slides out and spins. "steering": the wheel turns; "dashboard": the needle sweeps. "directly": a hand (`Hand`) reaching for the engine gets a red cross; "steering use": the wheel turns and the engine spins faster. | whoosh, snap on engine, click on steering |
| 8 Mistake | A black terminal labelled "Shell?" and a Windows desktop labelled "Not a shell?". | "common mistake": title, red. "black screen": the terminal gets a red "only this?" tag. "Windows desktop": the desktop slides in; both get green ticks "Shell" on "dono". | zap on mistake, thud on dono |
| 9 Recap | The OS box one last time: Shell = outer part, takes your commands; Kernel = core part, controls the hardware. | "parts": the box pulses; the two rows pop on "outer part" and "core part"; a thud as it settles. | pop, thud |
| 10 End | Question card ("OS ka kaunsa part command receive karta hai: Shell ya Kernel?"), website card (`conceptoscope.com`, MCQs + short questions + notes), next card ("Next: CPU apps ko kis order mein process kare?"), a "Full lecture series: coming soon" card, the follow button, the handles. | "comments", "website", "check", "decide" as in phase 01. "full lecture series": the card slides up with three ticks on "detailed", "quizzes", "questions" (detailed lectures, quizzes, important short + long questions). "subscribe": the follow button pulses. | pop, thud, snap |

**Memes** (raw clip, centred, tilted 3 degrees, picture paused and blurred; voice gap after the
line; the last one straight):

| After line | Meme | Why |
| --- | --- | --- |
| 1.3 "...hardware tak pohnchti kaise hain?" | a "thinking" / "hmm" reaction from the collection (new import) | the question lands |
| 7.4 "...baaqi kaam engine karta hai" | `shabash-beta.mp4` | the driver does nothing hard |
| 8.1 "...black screen hoti hai" (the mistake) | `kuch-gadbad-daya.mp4` | the misconception |
| 10.5 "follow aur subscribe kar lo..." | `carry-subscribe-karo.mp4` (straight, master only) | the subscribe ask |

Prefer fresh memes from `videos/source-clips/meme-and-sound-assets/` (import with
`pipeline/build/import-meme-assets.py`); reusing one from phase 01 is fine once.

**New Remotion pieces:** `OsBox` (one Operating System box with the Shell ring and the Kernel
core inside, used from beat 2 to the recap so the two always read as parts of the OS), the Figure
1.1 diagram (`OsDiagram`), `CarSplit` (engine and dashboard pull apart), and the command path
there and back (reuse `FlowDot` + `DrawLine`). Add `mdi:steering` to
the offline icons (`components/faceless/icons.ts`).

---

## 4. Short (9:16, about 58 s): cut list from the master voice

One complete idea: the Shell and the Kernel are the OS's two parts, and the book's file example
travels through both.

| Order | Lines | What it says | 9:16 visual |
| --- | --- | --- | --- |
| 1 | `1.1`, `1.3` | You type, click and tap: how do these commands reach the hardware? (1.2 and 1.4 refer to the last video, so the Short skips them.) | Type, click, tap cards; the command chip drops into the device and stops at "?". |
| 2 | `2.3` | The Shell is the OS part that talks to you; the Kernel is the OS part that talks to the hardware. | The OS box with the ring and the core, big. |
| 3 | `5.2` to `5.5` | The book's example: open a file, Shell, Kernel, hard drive, screen. | The file path top to bottom, the file opens. |
| 4 | `7.2`, `7.3` | Engine = Kernel, steering + dashboard = Shell. | Car split, big. |
| 5 | 1.2 s beat | (no voice: rows pop with sound) | Takeaway card: "Shell = OS ka outer part (tumhari command) / Kernel = OS ka core part (hardware)". |
| 6 | `10.3`, `10.5` | Next video, then follow and subscribe for the full lecture series. | Next card, then the follow button with "Full lecture series: coming soon", website on screen, handles. Last frame = first frame. |

About 170 words: 55 s of voice + gaps + the takeaway = about 58 s. If the take runs long, drop
`7.3` first.

---

## 5. Website quiz (3 questions, answers from the book)

1. The core part of the OS that directly controls the hardware is the: (a) Shell (b) **Kernel**
   (c) Device Driver (d) System Library
2. A graphical shell allows the user to: (a) type commands only (b) **click icons and use
   menus** (c) repair hardware (d) store files
3. The shell receives commands from the user and passes them to the: (a) hardware (b) **kernel**
   (c) printer (d) monitor

---

## 6. Thumbnail

1280 x 720, GitHub dark with the grid. Left: an engine (`Cog`, glowing) labelled **KERNEL**;
right: a steering wheel labelled **SHELL**; "vs" between in highlight yellow. Small top-left:
"Class 10 CS | Ch 1". Text alternative: "Tumhari command hardware tak kaise pohnchti hai?".

## 7. Titles, descriptions, hashtags

- **YouTube:** "Kernel vs Shell Explained Simply | Class 10 Computer Science Ch 1 | Conceptoscope"
- **Shorts / Reels / TikTok:** "Kernel vs Shell in 60 seconds (Class 10 CS)"
- **Description (all):** "Part of: Class 10 Computer Science | Animated Concepts (selected topics,
  in book order). Kernel aur Shell kya hain, aur tumhari command hardware tak kaise pohnchti
  hai? Book: Computer Science and Entrepreneurship, Class 10, Chapter 1 (1.2, Kernel vs Shell).
  MCQs, short questions aur notes: conceptoscope.com. The full lecture series is coming soon.
  Muhammad Raheel, Full Stack Developer and AI Engineer."
- **Hashtags:** #Class10ComputerScience #OperatingSystem #Kernel #Shell #PunjabBoard
  #MultanBoard #Conceptoscope

## 8. Recording notes (for you)

- Calm, even tone from the first line to the last (phase 1 v4 is the reference); keep the same
  distance from the mic.
- Read the "Number ek / do / teen" lines a little slower; each one triggers an animation.
- In 4.6 say "Command Prompt" and "Terminal" clearly; they appear on screen.
- Say the binary digits in 1.4 clearly, one by one; they type in on screen.
- Change a line if it sounds more natural to you: the video follows what you actually say.
- Save as `videos/recordings/phase-02.m4a` (any phone format is fine).
