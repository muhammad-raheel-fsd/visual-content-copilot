---
book: Computer Science 10 (PECTAA)
book_slug: class-10-cs
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
topic: "board-exercise"
topic_title: "Chapter 1 Board Exercise (verbatim from book pages 17-19)"
type: board_exercise
sections:
  - id: mcq
    count: 8
    marks_per: 1
  - id: short
    count: 10
    marks_per: 2-4
  - id: long
    count: 5
    marks_per: 8-12
verbatim_source: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/board-exercise.md
last_updated: 2026-09-30
priority: PRIMARY
purpose: "These are the exam board's OWN questions from the book's EXERCISE section. Study these BEFORE any invented practice questions. Model answers use verbatim book text."
---

# Chapter 1 · Board Exercise

**Source:** Pages 17-19 of Computer Science 10 (PECTAA). Every question here is copied verbatim from the book's EXERCISE section. The MCQ answer key comes from the book (page 19). Short and long question model answers use verbatim book text.

## Section A · Multiple Choice Questions (8 · Board's own)

### MCQ1

**Question:** Which is NOT an example of an operating system?

**Options:**
- a) Linux
- b) Windows
- c) Photoshop
- d) macOS

**Correct:** c

**Explanation:** From book page 19 Answer Key: c) Photoshop. The book lists Windows, macOS, Linux, Android, and iOS as operating systems (Topic 1.1). Photoshop is an application software.

**Board source:** Page 17, Q1

**Difficulty:** easy

---

### MCQ2

**Question:** In multi-user environments, the OS ensures:

**Options:**
- a) Equal access and data privacy
- b) All users share the same files
- c) Hardware is never used
- d) Internet speed is increased

**Correct:** a

**Explanation:** From book page 19 Answer Key: a) Equal access and data privacy. This maps to Topic 1.1's four responsibilities: user accounts, private files, fair sharing of resources, and protection from unauthorized access.

**Board source:** Page 17, Q2

**Difficulty:** medium

---

### MCQ3

**Question:** In Windows, user accounts can be created via:

**Options:**
- a) Task Manager
- b) Control Panel or Settings
- c) Disk Management
- d) BIOS settings

**Correct:** b

**Explanation:** From book page 19 Answer Key: b) Control Panel or Settings. Topic 1.1 verbatim: "a new account can be created through the Settings or Control Panel by selecting User Accounts, choosing Add New User..."

**Board source:** Page 17, Q3

**Difficulty:** easy

---

### MCQ4

**Question:** The core part of the OS that interacts directly with hardware is the:

**Options:**
- a) Shell
- b) Kernel
- c) Device Driver
- d) System Library

**Correct:** b

**Explanation:** From book page 19 Answer Key: b) Kernel. Topic 1.2 verbatim: "The kernel is the core part of the operating system, that directly controls the computer's system software and hardware such as the CPU, memory, and devices."

**Board source:** Page 17, Q4

**Difficulty:** easy

---

### MCQ5

**Question:** A graphical shell allows the user to:

**Options:**
- a) Type commands only
- b) Click icons and use menus
- c) Interact only via code
- d) Access only the BIOS

**Correct:** b

**Explanation:** From book page 19 Answer Key: b) Click icons and use menus. Topic 1.2 verbatim: "Graphical shells (like Windows desktop) where you click icons and use menus."

**Board source:** Page 17, Q5

**Difficulty:** easy

---

### MCQ6

**Question:** In the FCFS scheduling method, processes are served:

**Options:**
- a) Randomly
- b) Shortest job first
- c) In the order they arrive
- d) By priority only

**Correct:** c

**Explanation:** From book page 19 Answer Key: c) In the order they arrive. Topic 1.3 verbatim: "In the FCFS method, the CPU processes tasks in the exact order they arrive."

**Board source:** Page 17, Q6

**Difficulty:** easy

---

### MCQ7

**Question:** Threads in the same process:

**Options:**
- a) Have separate memory spaces
- b) Share the same memory and resources
- c) Run on different OS
- d) Cannot run simultaneously

**Correct:** b

**Explanation:** From book page 19 Answer Key: b) Share the same memory and resources. Topic 1.5 verbatim: "All threads in the same process share the same memory and resources, but operate independently."

**Board source:** Page 17, Q7

**Difficulty:** medium

---

### MCQ8

**Question:** Which system call is used to create a new process?

**Options:**
- a) Open
- b) read
- c) Write
- d) fork

**Correct:** d

**Explanation:** From book page 19 Answer Key: d) fork. Topic 1.6 verbatim: "fork Creates a new process by duplicating an existing one."

**Board source:** Page 17, Q8

**Difficulty:** medium

---

## Section B · Short Questions (10 · Board's own)

### Short1

**Question:** Why is the operating system referred to as the "central controller"?

**Model_answer:** An operating system works like a traffic controller for the computer. It decides which task should be done first, how the computer's memory is used, and which devices (like a printer or speakers) should be active at a given time. In short, we can say that the OS makes sure the computer works smoothly even when multiple tasks are running at the same time.

**Source_topic:** 1.1

**Marks:** 3

---

### Short2

**Question:** How does the OS act as a translator between the user and hardware?

**Model_answer:** Computer hardware cannot understand human language directly. The operating system acts as a translator between the user and the hardware system. When you click an icon or type something, the OS changes those actions into instructions that the hardware can understand. This allows people to use computers easily without learning how the hardware works.

**Source_topic:** 1.1

**Marks:** 3

---

### Short3

**Question:** Define one way to create a new user account in Windows.

**Model_answer:** In most modern OS like Windows, a new account can be created through the Settings or Control Panel by selecting User Accounts, choosing Add New User, and entering details like username, password, and account type (Standard, Administrative, Guest).

**Source_topic:** 1.1

**Marks:** 3

---

### Short4

**Question:** How is kernel different from shell.

**Model_answer:** The kernel is the core part of the operating system, that directly controls the computer's system software and hardware such as the CPU, memory, and devices. The shell is the outer part of the OS that interacts with the user; it receives commands from the user and passes them to the kernel. In the book's car analogy: the engine of a car is the kernel, and accessories like the steering wheel and dashboard are the shells.

**Source_topic:** 1.2

**Marks:** 4

---

### Short5

**Question:** Give one example of a system library and its purpose.

**Model_answer:** When a photo editing app needs to open an image, it uses the operating system's library to read the file. This way, the app does not have to create its own method to open pictures. System libraries are collections of ready-made instructions that programs can use to perform common tasks, such as opening files or showing text on the screen.

**Source_topic:** 1.2

**Marks:** 3

---

### Short6

**Question:** Explain one advantage and one disadvantage of FCFS scheduling.

**Model_answer:** Advantage: FCFS is easy to understand and implement, as processes are served in the exact order they arrive. No process is skipped. Disadvantage: Short processes may have to wait a long time if they are queued behind longer processes (known as the "convoy effect"), which can affect the overall efficiency of the system.

**Source_topic:** 1.3

**Marks:** 4

---

### Short7

**Question:** Why is virtual memory slower than RAM?

**Model_answer:** Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM; that's why the use of virtual memory can result in reduced system performance. Virtual memory uses part of the computer's storage drive (like Hard drives, SSDs, or NVMe) rather than the fast dedicated memory chips of RAM.

**Source_topic:** 1.4

**Marks:** 3

---

### Short8

**Question:** Define a system call.

**Model_answer:** A system call is a request made by a program to the operating system to perform a specific task that the program cannot do directly. System calls act as a bridge between user programs and the kernel, allowing applications to access hardware and core OS functions safely.

**Source_topic:** 1.6

**Marks:** 2

---

### Short9

**Question:** What is the role of a file system?

**Model_answer:** A file system is the way an operating system stores and organizes files on a storage device, such as a hard drive, SSD, or USB. It decides where each file will be kept and save its location so it can be access later. It provides a structured way for users and applications to store, locate, and manage information on storage devices.

**Source_topic:** 1.7

**Marks:** 3

---

### Short10

**Question:** Define multitasking in computer system.

**Model_answer:** In multitasking the operating system allows more than one program to be open and usable by a single user at the same time. You can easily switch between them whenever you need. Example: You can listen to music, keep a document open, and browse the internet, moving between them as needed.

**Source_topic:** 1.3

**Marks:** 2

---

## Section C · Long Questions (5 · Board's own)

### Long1

**Question:** Describe the architecture of an operating system, explaining kernel, shell, and layered design with examples.

**Model_answer_hint:**
Cover all three parts using verbatim book text:

1. **Architecture (verbatim):**
   "The architecture of an operating system is the way how its parts are organized and how they work together. Each part has a special role, and together they make the computer work smoothly, just like a school has different departments that perform specific duties but work together for the smooth working of the school."

2. **Kernel (verbatim):**
   "The kernel is the core part of the operating system, that directly controls the computer's system software and hardware such as the CPU, memory, and devices, as shown in Figure 1.1. It decides how and when different programs can use these resources."
   Example: "When you open a file, the kernel manages the process of reading it from the hard drive and sending it to the screen. Like Engine of a car is kernel and accessories like steering wheel, dashboard are shells."

3. **Shell (verbatim):**
   "The shell is the outer part of the OS that interacts with the user, also depicted in Figure 1.1. It receives commands from the user and passes them to the kernel."
   Two types: Graphical shells (like Windows desktop) where you click icons and use menus; Command-line shells (like the Command Prompt or Terminal) are where you type instructions.

4. **Layered design (verbatim + school analogy):**
   - Lower layer: work directly with hardware devices like the CPU, RAM, storage and Hard drive. (School: support staff = guards and cleaners.)
   - Middle layer: manage these resources and make sure programs can use them when needed. (School: administration.)
   - Upper layer: run applications and provide the interface that the user views on the screen. (School: teachers and students.)
   - Benefit: "Each layer depends on the one below it. This design makes the operating system easier to manage, repair, and improve without changing the whole system."

**Board source:** Page 18, Long Q1

**Marks:** 10

**Expected_answer_length:** 300-400 words

---

### Long2

**Question:** Explain the process lifecycle in detail with examples.

**Model_answer_hint:**
Cover both parts verbatim:

1. **Three stages (verbatim):**
   - **Creation:** This happens when you start any program (like MS Word). The OS loads the program into memory and gives it the resources (like CPU time and memory) it needs.
   - **Execution:** The process is actively running and performing tasks effectively.
   - **Termination:** The process finishes its task and is closed by the user or the system. The OS frees the resources so they can be used by other processes.

2. **Google Chrome lifecycle example (verbatim):**
   - **Creation:** Begins when the user clicks the browser icon. The operating system loads the program into memory and allocates the required resources.
   - **Execution:** The browser performs tasks such as loading web pages, displaying media, and responding to user actions.
   - **Termination:** Occurs when the browser is closed. The operating system stops the process and releases its resources for other uses.

**Board source:** Page 18, Long Q2

**Marks:** 8

**Expected_answer_length:** 200-300 words

---

### Long3

**Question:** Differentiate between RAM and virtual memory, and explain how multithreading improves performance.

**Model_answer_hint:**
Cover three parts:

1. **Primary Memory (RAM) verbatim:**
   "Primary memory, also called Random Access Memory (RAM), is the main working area of a computer. It is a fast storage area where the computer keeps the data and instructions temporarily. Its data is erased when the computer is turned off."

2. **Virtual Memory verbatim:**
   "When the RAM is full, the operating system uses part of the computer's storage drive (like Hard drives, solid-state drives (SSD), or Non-Volatile Memory Express (NVMe)) as virtual memory. This extra space acts like temporary RAM, allowing more programs to run at the same time. Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM; that's why the use of virtual memory can result in reduced system performance."

3. **How multithreading improves performance (verbatim):**
   "Multithreading is an operating system technique that allows a single process to perform multiple tasks at the same time by dividing its work into smaller units called threads. Each thread runs independently but shares the same memory and resources of the process, enabling faster execution, better responsiveness, and efficient use of system resources."
   Benefits: Enhanced Performance (tasks executed in parallel), Improved Responsiveness (word processor typing while spellcheck runs), Support for Concurrent Operations (games, video editing), Efficient Use of Resources (fewer resources than separate processes).

**Board source:** Page 18, Long Q3

**Marks:** 10

**Expected_answer_length:** 300-400 words

---

### Long4

**Question:** Describe system calls, their purpose, and give examples of at least three types.

**Model_answer_hint:**
Cover three parts verbatim:

1. **Definition + purpose (verbatim):**
   "A system call is a request made by a program to the operating system to perform a specific task that the program cannot do directly. They act as a bridge between user programs and the kernel, allowing applications to access hardware and core OS functions safely. Without system calls, programs that directly control hardware can be unsafe and complex."

2. **Real-world example (verbatim):**
   "When you save a file in a text editor, the program uses a system call to tell the operating system to write the data to the storage drive (like a Hard drive)."

3. **At least three types (verbatim):**
   - **open:** Opens a file for reading or writing. Example: Opening a music file to play.
   - **read:** Retrieves data from a file or input device. Example: Reading text from a document.
   - **write:** Sends data to a file or output device. Example: Saving an image to the computer.
   - **fork:** Creates a new process by duplicating an existing one. Example: Opening a new browser tab, where the OS may use fork to create another process.

**Board source:** Page 18, Long Q4

**Marks:** 8

**Expected_answer_length:** 200-300 words

---

### Long5

**Question:** A computer system uses the First-Come, First-Served (FCFS) scheduling method to manage processes. The following table shows the arrival time and the CPU burst time (time needed for execution) of three processes:

| Process | Arrival Time (seconds) | Burst Time (seconds) |
|---|---|---|
| P1 | 0 | 4 |
| P2 | 1 | 3 |
| P3 | 2 | 1 |

**Requirements:**
- I. Arrange the processes in the order they will be executed according to the FCFS scheduling method.
- II. Show the execution sequence of all processes.
- III. Calculate the start time and completion time for each process.
- IV. Find the waiting time for each process.
- V. Calculate the average waiting time for all processes.

**Model_answer:**

**I. Execution order (FCFS = order of arrival):**
P1 → P2 → P3

**II. Execution sequence (Gantt chart):**

```
[ P1: 0-4 ] → [ P2: 4-7 ] → [ P3: 7-8 ]
0        4        7        8
| P1     | P2     | P3     |
```

**III. Start time and completion time for each process:**

| Process | Arrival Time | Burst Time | Start Time | Completion Time |
|---|---|---|---|---|
| P1 | 0 | 4 | 0 | 4 |
| P2 | 1 | 3 | 4 | 7 |
| P3 | 2 | 1 | 7 | 8 |

**IV. Waiting time for each process (Waiting time = Start time − Arrival time):**

- P1: 0 − 0 = **0 seconds**
- P2: 4 − 1 = **3 seconds**
- P3: 7 − 2 = **5 seconds**

**V. Average waiting time:**

Average waiting time = (Sum of waiting times) / (Number of processes)
= (0 + 3 + 5) / 3
= 8 / 3
≈ **2.67 seconds**

**Note on the formula (not stated verbatim in the book but derivable from the book's teaching):**
- Waiting time = Start time − Arrival time (how long the process sat idle after arriving, before the CPU picked it up).
- Even the shortest process (P3, burst = 1s) has the longest waiting time (5s) because P1 and P2 arrived first. This is exactly the **convoy effect** the book describes as the disadvantage of FCFS.

**Board source:** Page 18-19, Long Q5

**Marks:** 12

**Expected_answer_length:** 250-400 words + full working shown

---

## How to use this file

- These are the **board's OWN questions** from the book. Highest priority.
- Compare with `mock-test.md` and `mixed-mcqs.md` (both are my invented practice sets, book-inspired but not board-authored).
- Compare with topic-level questions (`ch1-t1.1-*.md` through `ch1-t1.8-*.md`) which are also my invented practice sets.
- For revision: (1) memorise the model answers here first, (2) then attempt the mock test for time practice, (3) then use the MCQ bank for extra drill.
