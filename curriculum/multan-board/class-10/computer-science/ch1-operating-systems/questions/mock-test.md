---
book: Computer Science 10 (PECTAA)
book_slug: class-10-cs
class: 10
chapter: 1
chapter_title: "Operating Systems: Structure and Services"
topic: "mock-test"
topic_title: "Chapter 1 Mock Test"
type: mock_test
sections:
  - id: A
    kind: mcq
    count: 10
    marks_per: 1
    section_marks: 10
  - id: B
    kind: short
    count: 4
    marks_per: 4
    section_marks: 16
  - id: C
    kind: long
    count: 2
    marks_per: 7
    section_marks: 14
total_marks: 40
duration_minutes: 60
verbatim_source: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/*
last_updated: 2026-09-30
---

# Chapter 1 Mock Test

**Chapter:** Operating Systems: Structure and Services
**Total marks:** 40
**Duration:** 60 minutes
**Format:** Punjab Board style. Section A (10 MCQs, 10 marks) + Section B (4 short questions, 16 marks) + Section C (2 long questions, 14 marks).

> **⚠️ IMPORTANT · Read this before using:**
> This is **BONUS PRACTICE** with invented (book-inspired) questions. For the exam board's ACTUAL questions from the book, see `board-exercise.md` FIRST — that file contains all 8 MCQs + 10 short + 5 long verbatim from pages 17-19 of the book, including the FCFS Long Q5 that asks for waiting time and average waiting time. Study the board exercise, then use this mock test for extra timed practice.

## Section A · Multiple Choice Questions (10 marks · 1 each)

### A1

**Question:** Which of the following is NOT an operating system?

**Options:**
- a) Windows
- b) Linux
- c) MS Word
- d) Android

**Correct:** c

**Topic:** 1.1

---

### A2

**Question:** In modern Windows, the three account types are:

**Options:**
- a) Standard, Administrative, Guest
- b) Owner, Editor, Viewer
- c) Root, User, Public
- d) Admin, Teacher, Student

**Correct:** a

**Topic:** 1.1

---

### A3

**Question:** Which is a graphical shell?

**Options:**
- a) Command Prompt
- b) Terminal
- c) Windows desktop
- d) BIOS

**Correct:** c

**Topic:** 1.2

---

### A4

**Question:** In an OS design divided into layers, which layer works DIRECTLY with the hardware?

**Options:**
- a) Upper layer
- b) Middle layer
- c) Lower layer
- d) Application layer

**Correct:** c

**Topic:** 1.2

---

### A5

**Question:** Using the FCFS example from the book (P1: 5s, P2: 3s, P3: 2s), at what time does P3 finish?

**Options:**
- a) 5 seconds
- b) 8 seconds
- c) 10 seconds
- d) 2 seconds

**Correct:** c

**Topic:** 1.3

---

### A6

**Question:** According to the book, the IBM 5150 (1981) had how much RAM?

**Options:**
- a) 16 KB
- b) 16 MB
- c) 16 GB
- d) 640 KB

**Correct:** a

**Topic:** 1.4

---

### A7

**Question:** Which is the smallest unit of execution within a process?

**Options:**
- a) A file
- b) A folder
- c) A thread
- d) A system call

**Correct:** c

**Topic:** 1.5

---

### A8

**Question:** Which system call sends data to a file or output device?

**Options:**
- a) open
- b) read
- c) write
- d) fork

**Correct:** c

**Topic:** 1.6

---

### A9

**Question:** Which file system is typically used in USB flash drives?

**Options:**
- a) NTFS
- b) APFS
- c) FAT 32
- d) EXT4

**Correct:** c

**Topic:** 1.7

---

### A10

**Question:** Which OS type is used in critical systems such as air traffic control and heart-monitoring devices?

**Options:**
- a) Mobile OS
- b) Network OS
- c) Real-Time OS
- d) Embedded OS

**Correct:** c

**Topic:** 1.8

---

## Section B · Short Questions (16 marks · 4 each)

### B1

**Question:** How does the OS act as a translator between the user and the hardware? Give one example from the book.

**Marks:** 4

**Topic:** 1.1

**Model_answer:** Computer hardware cannot understand human language directly. The operating system acts as a translator between the user and the hardware system. When you click an icon or type something, the OS changes those actions into instructions that the hardware can understand. This allows people to use computers easily without learning how the hardware works. Example: pressing the letter A on a keyboard, the OS converts it into binary code (01000001) and sends it to the screen to display A.

---

### B2

**Question:** Differentiate between the kernel and the shell of an operating system. Name the two types of shells with one example each.

**Marks:** 4

**Topic:** 1.2

**Model_answer:** The kernel is the core part of the operating system that directly controls the computer's system software and hardware such as the CPU, memory, and devices. It decides how and when different programs can use these resources. The shell is the outer part of the OS that interacts with the user, receiving commands from the user and passing them to the kernel. The two types are: graphical shells (like Windows desktop) where you click icons and use menus, and command-line shells (like the Command Prompt or Terminal) where you type instructions.

---

### B3

**Question:** Define Multitasking and Concurrency. Use the book's examples to explain each.

**Marks:** 4

**Topic:** 1.3

**Model_answer:** Multitasking: The operating system allows more than one program to be open and usable by a single user at the same time. Example: You can listen to music, keep a document open, and browse the internet, moving between them as needed. Concurrency: More than one process is active at the same time in an OS, but the CPU processes them one by one in extremely fast cycles. Example: Like a chef preparing three dishes, working on one for a short time, then moving to the next, and repeating, the CPU switches between processes so rapidly that the user does not notice any delay.

---

### B4

**Question:** Define a file system. List the four widely used file systems and the OS each belongs to.

**Marks:** 4

**Topic:** 1.7

**Model_answer:** A file system is the way an operating system stores and organizes files on a storage device, such as a hard drive, SSD, or USB. It decides where each file will be kept and save its location so it can be access later. Four widely used file systems: FAT 32 (used in USB flash drives), NTFS (used by Windows OS), APFS / HFS+ (used by macOS), and EXT4 (commonly used by Linux OS).

---

## Section C · Long Questions (14 marks · 7 each)

### C1

**Question:** Explain the process life cycle. Describe each of the three stages, then walk through the Google Chrome lifecycle example from the book.

**Marks:** 7

**Topic:** 1.3

**Model_answer:**

The process life cycle has three stages:

1. **Creation:** This happens when you start any program (like MS Word). The OS loads the program into memory and gives it the resources (like CPU time and memory) it needs.

2. **Execution:** The process is actively running and performing tasks effectively.

3. **Termination:** The process finishes its task and is closed by the user or the system. The OS frees the resources so they can be used by other processes.

**Google Chrome lifecycle example:**

- **Creation:** Begins when the user clicks the browser icon. The operating system loads the program into memory and allocates the required resources.
- **Execution:** The browser performs tasks such as loading web pages, displaying media, and responding to user actions.
- **Termination:** Occurs when the browser is closed. The operating system stops the process and releases its resources for other uses.

---

### C2

**Question:** Describe the four types of operating systems from Topic 1.8. For each, give its definition, key feature, and one place where it is used.

**Marks:** 7

**Topic:** 1.8

**Model_answer:**

Operating systems are designed according to the needs of the device and the work it performs. Each type serves a different purpose and is optimized for specific tasks.

1. **Real-Time OS (RTOS):**
   - Definition: A Real-Time Operating System is designed to process data and respond within a strict time limit, known as a deadline. Used where even a tiny delay can cause system failure or serious consequences.
   - Key Feature: Processes tasks immediately as they arrive, without long waiting times.
   - Used in: Air traffic control, heart-monitoring devices, industrial robots.

2. **Embedded OS (EOS):**
   - Definition: A small and highly efficient operating system built into a specific device to control only the functions it needs. Optimized for one task or a small set of tasks.
   - Key Feature: Uses very little memory and power, and is often stored permanently inside the device.
   - Used in: Home appliances (microwaves, washing machines), printers, smart TVs, ATMs.

3. **Network OS (NOS):**
   - Definition: Manages and supports multiple computers connected through a network. Enables the sharing of resources like files, printers, and internet connections.
   - Key Feature: Focuses on communication and coordination between computers.
   - Used in: Offices, schools, data centers.

4. **Mobile OS:**
   - Definition: Designed for smartphones, tablets, and other handheld devices. Optimized for touch-screen use, battery saving, and mobile apps.
   - Key Feature: Supports wireless connectivity, cameras, sensors, and app stores.
   - Used in: Smartphones, tablets, smartwatches.

---

## Marking scheme summary

| Section | Type | Count | Marks each | Section total |
|---|---|---|---|---|
| A | MCQ | 10 | 1 | 10 |
| B | Short | 4 | 4 | 16 |
| C | Long | 2 | 7 | 14 |
| **Total** | | | | **40** |

## Time budget suggestion

- Section A (10 MCQs): 10 minutes (1 min each)
- Section B (4 Short): 20 minutes (5 min each)
- Section C (2 Long): 25 minutes (12-13 min each)
- Review: 5 minutes
