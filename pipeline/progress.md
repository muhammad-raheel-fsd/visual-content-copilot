# Faceless lecture pipeline: progress

Animated, faceless Shorts and explainers that come BEFORE the full sequential lectures, so
students find the channel on YouTube, Instagram, TikTok and Facebook and then practise on the website.

- **Source list:** [class_10_12_visual_faceless_shortlist.pdf](class_10_12_visual_faceless_shortlist.pdf):
  61 curated topics (28 Class 10, 33 Class 12) from the Punjab "Computer Science and
  Entrepreneurship" books. Hooks, animation ideas, quiz ideas and thumbnail text per topic.
- **Book text:** `curriculum/books/class-10-cs.pdf`, `curriculum/books/class-12-cs.pdf`. Parsed
  chapters (use them first): Class 10 Ch 1 (`curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/`),
  Class 12 Ch 4 (`.../class-12/computer-science/ch4-development-of-gui/source/`).
- **One phase = one topic.** Say "execute phase N" and the phase file is written in this folder.
- **Before writing or approving ANY script:** run the script checklist in
  [production-guide.md](production-guide.md), section 4. No phase skips it.
- **How every video is made:** [production-guide.md](production-guide.md) (one recording, auto
  trimmed voice, the Short cut from the master, transcript rules, brand, style recipe).

Status flow: `planned` > `scripted` > `recorded` > `animated` > `rendered` > `published`.

## Chapters

| Key | Book chapter (exact name) | Book page |
| --- | --- | --- |
| C10 Ch1 | Operating Systems: Structure and Services | 1 |
| C10 Ch2 | System Recovery and Advanced Maintenance | 20 |
| C10 Ch3 | Introduction to Python Programming | 40 |
| C10 Ch4 | Control Structures in Python | 55 |
| C10 Ch5 | Data Science | 69 |
| C10 Ch6 | Introduction To Artificial Intelligence (AI), and Machine Learning (ML) | 88 |
| C10 Ch7 | Applications of AI | 101 |
| C10 Ch8 | Digital Entrepreneurship | 115 |
| C12 Ch1 | Computer Networks | 1 |
| C12 Ch2 | Computational Thinking & Algorithms | 20 |
| C12 Ch3 | Object Oriented Programming Using Python | 33 |
| C12 Ch4 | Development of Graphical User Interface (GUI) | 45 |
| C12 Ch5 | Code Testing and Debugging | 60 |
| C12 Ch6 | Data and Analysis | 72 |
| C12 Ch7 | Hypothesis Testing | 89 |
| C12 Ch8 | Applications of Computer Science | 103 |
| C12 Ch9 | Cybersecurity and Safe Digital Collaboration | 118 |

Class 10 book: "Computer Science and Entrepreneurship - Class 10". Class 12 book: "Computer
Science and Entrepreneurship - Class 12".

## Phases

Order: phases 1 to 18 follow the PDF's six-week launch plan (3 topics a week, Class 10 and 12
alternating), then the remaining A-priority topics in book order, then the B-priority topics.
Priority: A = publish early, B = follow-up. Effort: S = text / code animation, M = process
diagram, L = several scenes or heavy fact-checking.

### Six-week launch (phases 1 to 18)

| Phase | Code | Topic | Chapter | Pri / Effort | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | C10-01-01 | [What does an OS actually do?](phase-01-who-controls-your-phone.md) | C10 Ch1 | A / M | A phone opens 3 apps; the OS is the invisible traffic controller of CPU, RAM and files. | rendered (v4): master approved + 5 social cuts |
| 02 | C10-01-02 | [Kernel vs Shell](phase-02-kernel-vs-shell.md) | C10 Ch1 | A / M | One click travels shell > kernel > hardware; the book's car and diagram. | recorded 2026-10-11; master rendered (output/phase-02/phase-02-master.mp4), waiting for review; social cuts after approval |
| 03 | C10-03-01 | Variables as labeled boxes | C10 Ch3 | A / S | What `x = x + 1` really does: a value goes into a labelled box and gets replaced. | planned |
| 04 | C12-01-02 | Network topologies | C12 Ch1 | A / M | Star, bus and ring side by side; cut one cable and watch who loses the connection. | planned |
| 05 | C10-06-01 | AI versus ML | C10 Ch6 | A / M | ML as a circle inside AI, filled with everyday examples; not every AI learns from data. | planned |
| 06 | C12-02-02 | Algorithm to flowchart | C12 Ch2 | A / M | A spoken rule turns into start, process, decision and end shapes, then a dry run. | planned |
| 07 | C10-01-03 | The process life cycle | C10 Ch1 | A / M | A music-player process moves through new, ready, running, waiting and terminated. | planned |
| 08 | C12-03-01 | Class versus object | C12 Ch3 | A / M | One blueprint (class) makes three student objects, each with its own attribute values. | planned |
| 09 | C10-04-02 | For-loop versus while-loop | C10 Ch4 | A / M | A fixed-count for loop next to a condition-driven while loop; how a loop can run forever. | planned |
| 10 | C10-05-03 | How a graph can mislead | C10 Ch5 | A / M | Same data, two bar charts; a cut y-axis makes a tiny difference look huge. | planned |
| 11 | C12-04-01 | Your first GUI button | C12 Ch4 | A / M | An empty Tkinter window gets a label, an entry and a button whose callback runs on click. | planned |
| 12 | C10-07-01 | Speech recognition pipeline | C10 Ch7 | A / M | Voice wave to features to predicted text to captions; why noise causes mistakes. | planned |
| 13 | C12-01-03 | OSI layers as a delivery story | C12 Ch1 | A / L | A parcel goes down 7 layers, travels, and is unpacked layer by layer. | planned |
| 14 | C12-06-03 | Train versus test split | C12 Ch6 | A / L | Why a model must never see its exam: a training stack and a held-out test stack. | planned |
| 15 | C10-02-02 | Task Manager detective | C10 Ch2 | A / M | CPU, memory and disk bars; find the one runaway app slowing the PC. | planned |
| 16 | C12-08-01 | Smart agriculture with IoT | C12 Ch8 | A / L | A soil sensor reads dry soil, a controller decides, a pump waters: sensor, network, decision, actuator. | planned |
| 17 | C12-05-01 | Syntax vs runtime vs logic errors | C12 Ch5 | A / M | Three snippets: one is rejected, one crashes, one runs but gives a wrong answer. | planned |
| 18 | C10-04-01 | If/else as a decision road | C10 Ch4 | A / M | Marks enter a decision gate and leave on the pass or fail road; elif adds more roads. | planned |

Week 1 = phases 1 to 3 (plus one short face-to-camera intro), week 2 = 4 to 6, week 3 = 7 to 9,
week 4 = 10 to 12, week 5 = 13 to 15, week 6 = 16 to 18 (then announce the first full lecture).

### Remaining A priority (phases 19 to 45)

| Phase | Code | Topic | Chapter | Pri / Effort | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 19 | C12-09-01 | Spot the phishing message | C12 Ch9 | A / M | Two near-identical school notices; zoom into the URL, urgency and sender clues that expose the fake. | planned |
| 20 | C10-01-05 | RAM and virtual memory | C10 Ch1 | A / L | Tabs fill the RAM and spill over to the slower disk; why too many tabs slow a laptop. | planned |
| 21 | C10-02-01 | The PC boot journey | C10 Ch2 | A / M | Power button, firmware checks, bootloader, then the OS: the startup timeline. | planned |
| 22 | C10-03-02 | Python type conversion | C10 Ch3 | A / S | Text "5" and number 2; why `"5" + 2` fails and `int("5") + 2` gives 7. | planned |
| 23 | C10-03-03 | Operator precedence puzzle | C10 Ch3 | A / S | `2 + 3 * 4`: multiplication first, so 14, not 20; brackets change the order. | planned |
| 24 | C10-04-04 | Trace a Python output | C10 Ch4 | A / S | Three lines of code, a variable table, and a pause for the viewer to predict the output. | planned |
| 25 | C10-05-01 | Dirty data to clean chart | C10 Ch5 | A / M | Duplicates and missing values get cleaned and the chart changes; missing is not zero. | planned |
| 26 | C10-05-02 | Structured versus unstructured data | C10 Ch5 | A / S | Rows and columns versus photos and chats; why a sheet sorts names but not images. | planned |
| 27 | C10-06-02 | Teaching a model with examples | C10 Ch6 | A / L | Labelled cat and dog photos train a model that then labels a new photo. | planned |
| 28 | C10-06-04 | Biased training data | C10 Ch6 | A / L | A lopsided training set makes uneven mistakes; balance the data, fairer results. | planned |
| 29 | C10-07-02 | Computer vision | C10 Ch7 | A / L | A camera frame splits into regions, boxes and labels appear; a box can still be wrong. | planned |
| 30 | C12-01-01 | How a message travels | C12 Ch1 | A / L | A message splits into packets that hop through a router to the receiver. | planned |
| 31 | C12-01-04 | Switch versus router | C12 Ch1 | A / M | A switch moves traffic inside one network; a router connects different networks. | planned |
| 32 | C12-01-06 | Firewall as a checkpoint | C12 Ch1 | A / M | Packets reach a rule-based gate and are allowed or blocked; a firewall has limits. | planned |
| 33 | C12-02-01 | Decomposition of a big problem | C12 Ch2 | A / M | A school timetable splits into rooms, teachers, slots and constraints. | planned |
| 34 | C12-02-03 | AND, OR and NOT logic | C12 Ch2 | A / M | Two light switches show AND, OR and NOT, then the truth table fills in. | planned |
| 35 | C12-03-03 | Inheritance and polymorphism | C12 Ch3 | A / L | A Vehicle parent class with child classes that share and override methods. | planned |
| 36 | C12-04-02 | Event-driven programming | C12 Ch4 | A / M | Clicks and key presses become events that trigger handlers, which update the screen. | planned |
| 37 | C12-05-02 | Debugger step-by-step | C12 Ch5 | A / M | The execution line walks the code while a watch panel shows where x became 0. | planned |
| 38 | C12-06-01 | Raw data to usable dataset | C12 Ch6 | A / M | Missing values and mixed labels flash red, then become clean columns for a model. | planned |
| 39 | C12-06-04 | Precision versus recall | C12 Ch6 | A / L | False alarms versus misses for two models; which mistake is worse depends on the job. | planned |
| 40 | C12-07-01 | Null versus alternative hypothesis | C12 Ch7 | A / M | H0 and H1 as two claim cards tested with coin flips; a test weighs evidence, it does not prove. | planned |
| 41 | C12-07-02 | Sampling variability | C12 Ch7 | A / L | Several samples from the same class give different bars; 10 answers is not the whole truth. | planned |
| 42 | C12-08-02 | How cloud computing feels | C12 Ch8 | A / M | A phone uploads and a laptop opens the same file: where "the cloud" really is. | planned |
| 43 | C12-09-02 | Two-factor authentication | C12 Ch9 | A / M | The password opens lock one, a second factor opens lock two; why one is not enough. | planned |
| 44 | C12-09-03 | Ransomware and backups | C12 Ch9 | A / M | Files get locked in a safe demo while the offline backup survives; prevention and recovery only. | planned |
| 45 | C12-09-04 | Digital footprint and privacy | C12 Ch9 | A / M | Old public posts stay as breadcrumbs; what sharing exposes and which privacy settings help. | planned |

### B priority (phases 46 to 61)

| Phase | Code | Topic | Chapter | Pri / Effort | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 46 | C10-01-04 | FCFS CPU scheduling | C10 Ch1 | B / M | Three arrival cards queue up and become a Gantt strip: first come, first served. | planned |
| 47 | C10-02-03 | Safe Mode versus System Restore | C10 Ch2 | B / M | The PC will not start: Safe Mode, System Restore and backup as three routes, each with limits. | planned |
| 48 | C10-04-03 | Break and continue | C10 Ch4 | B / S | A counter skips one turn (continue) versus stopping the loop (break). | planned |
| 49 | C10-05-04 | How SQL finds a result | C10 Ch5 | B / M | SELECT and WHERE filter 20 rows down to the matching ones. | planned |
| 50 | C10-06-03 | Classification versus regression | C10 Ch6 | B / M | Spam or not spam (a category) versus tomorrow's temperature (a number). | planned |
| 51 | C10-07-03 | Recommendation system | C10 Ch7 | B / M | Watching habits become signals that rank your next videos. | planned |
| 52 | C10-08-01 | SWOT analysis as four windows | C10 Ch8 | B / S | A student app idea fills strengths, weaknesses, opportunities and threats. | planned |
| 53 | C10-08-02 | Customer journey to useful product | C10 Ch8 | B / M | Problem, survey, prototype, feedback, improve: building what students actually need. | planned |
| 54 | C12-01-05 | IP addressing visualized | C12 Ch1 | B / M | Every device gets a logical address; packets carry the destination address. | planned |
| 55 | C12-02-04 | Logical inference puzzle | C12 Ch2 | B / M | Premise cards lead to a conclusion; an invalid jump flashes red. | planned |
| 56 | C12-03-02 | Constructor and self | C12 Ch3 | B / M | A new object is built; values flow through `__init__` and `self` points to that object. | planned |
| 57 | C12-04-03 | Layout manager showdown | C12 Ch4 | B / M | The same widgets placed with pack, grid and place. | planned |
| 58 | C12-05-03 | Edge cases and assertions | C12 Ch5 | B / M | The usual test passes, an empty input breaks the code; test the boundaries too. | planned |
| 59 | C12-06-02 | Supervised versus unsupervised ML | C12 Ch6 | B / M | Labelled apples and oranges versus unlabelled dots that form their own groups. | planned |
| 60 | C12-07-03 | What a p-value does NOT say | C12 Ch7 | B / L | p = 0.03 does not mean "97% true"; the common myth crossed out. | planned |
| 61 | C12-08-03 | Blockchain as linked records | C12 Ch8 | B / L | Blocks chained by hashes; change one old record and every later check breaks. | planned |
