/**
 * Class 10 CS · Chapter 1 · Revision Deck
 *
 * A compact recap of all 8 topics in Chapter 1: Operating Systems.
 * One slide per topic showing the 2-3 most exam-tested facts (all verbatim from
 * the book), then a summary + exam-readiness slide + mock test preview.
 *
 * Every recap card is copied EXACTLY from the parsed topic files.
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { HeroSlide, SlideLayout } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

// ── style tokens ─────────────────────────────────────────────────────────

const bookQuoteStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.6,
  color: "var(--text)",
  margin: 0,
};
const hlBlue: CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const hlWarm: CSSProperties = { color: "var(--microtask)", fontWeight: 700 };

// ── Stagger primitives ───────────────────────────────────────────────────

const Stagger: React.FC<{ children: ReactNode; style?: CSSProperties; delay?: number }> = ({
  children,
  style,
  delay = 0,
}) => (
  <motion.div
    style={style}
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.1, delayChildren: delay } },
    }}
  >
    {children}
  </motion.div>
);

const StaggerItem: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <motion.div
    style={style}
    variants={{
      hidden: { opacity: 0, y: 20, scale: 0.96 },
      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 18, stiffness: 200 } },
    }}
  >
    {children}
  </motion.div>
);

// ── Hero: 8 topics arranged in a grid ────────────────────────────────────

const HeroTopicGrid: React.FC = () => {
  const topics = [
    { code: "1.1", icon: "mdi:cog-sync-outline", color: "var(--accent)" },
    { code: "1.2", icon: "mdi:layers-outline", color: "var(--sync)" },
    { code: "1.3", icon: "mdi:progress-clock", color: "var(--microtask)" },
    { code: "1.4", icon: "mdi:memory", color: "var(--warn)" },
    { code: "1.5", icon: "mdi:vector-line", color: "var(--task)" },
    { code: "1.6", icon: "mdi:bridge", color: "var(--api)" },
    { code: "1.7", icon: "mdi:file-tree-outline", color: "var(--accent)" },
    { code: "1.8", icon: "mdi:shape-outline", color: "var(--sync)" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10, maxWidth: 700 }}>
      {topics.map((t, i) => (
        <motion.div
          key={t.code}
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", damping: 14 }}
          style={{
            padding: "14px 8px",
            backgroundColor: "var(--panel)",
            border: `1.5px solid ${t.color}`,
            borderRadius: 12,
            boxShadow: `0 0 20px ${t.color}44`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon icon={t.icon} width={30} height={30} color={t.color} />
          <div style={{ fontSize: 12, fontWeight: 800, color: t.color, fontFamily: "Roboto Mono, monospace" }}>
            {t.code}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── Topic recap card ────────────────────────────────────────────────────

const RecapCard: React.FC<{
  code: string;
  title: string;
  color: string;
  icon: string;
  facts: string[];
  keyword: string;
}> = ({ code, title, color, icon, facts, keyword }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: 26,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 0 32px ${color}33`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: color,
          color: "#0a0e14",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {code}
      </div>
      <Icon icon={icon} width={44} height={44} color={color} />
      <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text)" }}>{title}</div>
    </div>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        backgroundColor: `${color}18`,
        border: `1px solid ${color}`,
        borderRadius: 999,
        alignSelf: "flex-start",
      }}
    >
      <Icon icon="mdi:key-outline" width={16} height={16} color={color} />
      <span style={{ fontSize: 12, letterSpacing: 2, color, fontWeight: 800 }}>
        KEYWORD · {keyword}
      </span>
    </div>
    <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {facts.map((f, i) => (
        <StaggerItem key={i}>
          <div
            style={{
              display: "flex",
              gap: 14,
              padding: "14px 18px",
              backgroundColor: "rgba(255,255,255,0.03)",
              borderLeft: `3px solid ${color}`,
              borderRadius: 6,
            }}
          >
            <div
              style={{
                minWidth: 26,
                height: 26,
                borderRadius: "50%",
                backgroundColor: color,
                color: "#0a0e14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                fontFamily: "Roboto Mono, monospace",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.55 }}>{f}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  </div>
);

// ── Big picture chapter mind-map ────────────────────────────────────────

const ChapterMindMap: React.FC = () => {
  const branches = [
    { code: "1.1", label: "Intro to OS", color: "var(--accent)", angle: -135 },
    { code: "1.2", label: "Architecture", color: "var(--sync)", angle: -90 },
    { code: "1.3", label: "Process Mgmt", color: "var(--microtask)", angle: -45 },
    { code: "1.4", label: "Memory", color: "var(--warn)", angle: 0 },
    { code: "1.5", label: "Threads", color: "var(--task)", angle: 45 },
    { code: "1.6", label: "System Calls", color: "var(--api)", angle: 90 },
    { code: "1.7", label: "File System", color: "var(--accent)", angle: 135 },
    { code: "1.8", label: "Types of OS", color: "var(--sync)", angle: 180 },
  ];
  const R = 220;
  const CENTER = 300;
  const STAGE = 600;
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative", width: STAGE, height: STAGE }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute",
            width: R * 2 + 20,
            height: R * 2 + 20,
            left: CENTER - R - 10,
            top: CENTER - R - 10,
            borderRadius: "50%",
            border: "2px dashed rgba(88, 166, 255, 0.28)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 130,
            height: 130,
            left: CENTER - 65,
            top: CENTER - 65,
            borderRadius: "50%",
            backgroundColor: "var(--panel)",
            border: "2.5px solid var(--accent)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: "0 0 60px 10px rgba(88, 166, 255, 0.4)",
          }}
        >
          <Icon icon="mdi:cog-sync-outline" width={44} height={44} color="var(--accent)" />
          <div style={{ fontSize: 13, letterSpacing: 2, color: "var(--accent)", fontWeight: 800 }}>
            CH 1: OS
          </div>
        </div>
        {branches.map((b, i) => {
          const rad = (b.angle * Math.PI) / 180;
          const cx = CENTER + Math.cos(rad) * R;
          const cy = CENTER + Math.sin(rad) * R;
          return (
            <motion.div
              key={b.code}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.1, type: "spring", damping: 14 }}
              style={{
                position: "absolute",
                left: cx - 65,
                top: cy - 22,
                width: 130,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                backgroundColor: "var(--panel)",
                border: `1.5px solid ${b.color}`,
                borderRadius: 999,
                boxShadow: `0 0 20px ${b.color}55`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  fontFamily: "Roboto Mono, monospace",
                  color: b.color,
                  minWidth: 26,
                }}
              >
                {b.code}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: 0.5 }}>
                {b.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── Exam checklist row ──────────────────────────────────────────────────

const ChecklistRow: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 10,
    }}
  >
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: `${color}18`,
        border: `1.5px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon icon="mdi:check" width={18} height={18} color={color} />
    </div>
    <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.5 }}>{text}</div>
  </div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1RevisionDeck: Deck = {
  title: "Chapter 1 Revision",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "Ch 1 · Revision",
  topicCode: "REV",
  topicTitle: "Chapter 1 Revision · Operating Systems",
  theme: "class-10",
  accent: ACCENT,
  slides: [
    // 1. Hero
    {
      id: "hero",
      title: "Cover",
      render: (
        <HeroSlide
          title={
            <>
              <span style={{ color: ACCENT }}>Chapter 1</span> Revision
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroTopicGrid />
              </div>
              8 topics. 12 slides. Everything you need before the exam.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. The big picture · chapter mind-map
    {
      id: "mind-map",
      title: "The big picture",
      transition: "slide",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="The big picture: everything in Chapter 1"
          subtitle="Eight topics, one central idea: the OS runs everything."
          accent={ACCENT}
        >
          <ChapterMindMap />
        </SlideLayout>
      ),
    },

    // 3. T1.1 Recap
    {
      id: "recap-1-1",
      title: "1.1 Recap · Intro to OS",
      render: (
        <SlideLayout title="1.1 Introduction to Operating System (OS)" accent="var(--accent)">
          <RecapCard
            code="1.1"
            title="Intro to OS"
            color="var(--accent)"
            icon="mdi:cog-sync-outline"
            keyword="TRAFFIC CONTROLLER + TRANSLATOR"
            facts={[
              "Operating System (OS) is a type of system software that manages hardware, runs application software, and provides a user interface like Windows, macOS, Linux, Android, and iOS.",
              "As central controller: works like a traffic controller. Decides which task should be done first, how the computer's memory is used, and which devices should be active at a given time.",
              "As translator: computer hardware cannot understand human language directly. The OS translates user actions into instructions the hardware can understand. Letter A = 01000001 in binary.",
              "Multi-user responsibilities: user accounts (Standard, Administrative, Guest), private files, fair resource sharing, protection from unauthorized access.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 4. T1.2 Recap
    {
      id: "recap-1-2",
      title: "1.2 Recap · Architecture",
      render: (
        <SlideLayout title="1.2 Architecture of an Operating System" accent="var(--sync)">
          <RecapCard
            code="1.2"
            title="Architecture"
            color="var(--sync)"
            icon="mdi:layers-outline"
            keyword="KERNEL + SHELL + LAYERS"
            facts={[
              "Architecture is the way its parts are organized and how they work together. Like a school with different departments performing specific duties.",
              "Kernel: core part of the OS. Directly controls CPU, memory, and devices. Like the engine of a car.",
              "Shell: outer part of the OS. Interacts with the user. Types: graphical (Windows desktop) + command-line (Terminal). Like the steering wheel + dashboard.",
              "3 layers: Lower (hardware: CPU, RAM, storage) → Middle (manages resources) → Upper (runs apps + UI). Each layer depends on the one below.",
              "System libraries = ready-made instructions. Device drivers = programs that let the OS communicate with printers, keyboards, graphics cards.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 5. T1.3 Recap
    {
      id: "recap-1-3",
      title: "1.3 Recap · Process Management",
      render: (
        <SlideLayout title="1.3 Process Management in Operating System (OS)" accent="var(--microtask)">
          <RecapCard
            code="1.3"
            title="Process Management"
            color="var(--microtask)"
            icon="mdi:progress-clock"
            keyword="LIFECYCLE + FCFS + CONVOY EFFECT"
            facts={[
              "Running programs are called processes. Each has its own memory, CPU time, and resources.",
              "Process life cycle: Creation → Execution → Termination. Example: Google Chrome (click icon → browse → close).",
              "Multitasking: OS allows more than one program open at the same time. Concurrency: CPU processes them one by one in extremely fast cycles (chef preparing 3 dishes).",
              "FCFS scheduling: CPU processes tasks in the exact order they arrive. Like a queue at a shop counter.",
              "Convoy effect (disadvantage): Short processes may have to wait a long time if queued behind longer processes. Example: P3 (2s) waits until P1 (5s) + P2 (3s) finish.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 6. T1.4 Recap
    {
      id: "recap-1-4",
      title: "1.4 Recap · Memory",
      render: (
        <SlideLayout title="1.4 Memory" accent="var(--warn)">
          <RecapCard
            code="1.4"
            title="Memory"
            color="var(--warn)"
            icon="mdi:memory"
            keyword="RAM (FAST + TEMPORARY) vs VIRTUAL (SLOW + BORROWED)"
            facts={[
              "Memory stores data and instructions required for processing. Ensures the CPU can access information quickly.",
              "Primary Memory / RAM: main working area. Fast. Temporary. Data is erased when the computer is turned off. Example: opening a Word document places program + document into RAM.",
              "Virtual Memory: when RAM is full, the OS uses part of the storage drive (Hard drive, SSD, or NVMe) as extra memory.",
              "Trade-off: storage drives operate at lower data transfer speeds and higher access times than RAM → use of virtual memory can result in reduced system performance.",
              "IBM 5150 (1981) had 16 KB RAM. Modern DDR5 RAM transfers over 50 GB per second.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 7. T1.5 Recap
    {
      id: "recap-1-5",
      title: "1.5 Recap · Processes and Threads",
      render: (
        <SlideLayout title="1.5 Processes and Threads" accent="var(--task)">
          <RecapCard
            code="1.5"
            title="Processes and Threads"
            color="var(--task)"
            icon="mdi:vector-line"
            keyword="ISOLATED PROCESS + SHARED-MEMORY THREADS"
            facts={[
              "Process = independent program being executed. Its own memory space, CPU time, and resources. Isolated from other processes (stability + security).",
              "Thread = smallest unit of execution within a process. Multiple threads inside one process share the same memory and resources but operate independently.",
              "Web browser example: entire browser = 1 process. Threads: rendering webpage, playing audio/video, downloading files in background.",
              "Multithreading: OS technique that allows a single process to perform multiple tasks at the same time.",
              "4 benefits: (1) Enhanced Performance, (2) Improved Responsiveness (word processor typing while spellcheck runs), (3) Support for Concurrent Operations, (4) Efficient Use of Resources.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 8. T1.6 Recap
    {
      id: "recap-1-6",
      title: "1.6 Recap · System Calls",
      render: (
        <SlideLayout title="1.6 System Calls" accent="var(--api)">
          <RecapCard
            code="1.6"
            title="System Calls"
            color="var(--api)"
            icon="mdi:bridge"
            keyword="BRIDGE BETWEEN PROGRAM AND KERNEL"
            facts={[
              "A system call is a request made by a program to the OS to perform a specific task the program cannot do directly.",
              "System calls act as a bridge between user programs and the kernel. Without them, programs that directly control hardware can be unsafe and complex.",
              "Example: saving a file in a text editor uses a system call telling the OS to write the data to the storage drive.",
              "4 main types: open (opens a file), read (retrieves data), write (sends data), fork (creates a new process by duplicating an existing one).",
              "Linux and macOS have a few hundred system calls; Windows uses nearly 2,000.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 9. T1.7 Recap
    {
      id: "recap-1-7",
      title: "1.7 Recap · File System",
      render: (
        <SlideLayout title="1.7 File System Structure and Management" accent="var(--accent)">
          <RecapCard
            code="1.7"
            title="File System"
            color="var(--accent)"
            icon="mdi:file-tree-outline"
            keyword="FILES + FOLDERS + METADATA + FS TYPES"
            facts={[
              "A file system provides a structured way for users and applications to store, locate, and manage information on storage devices.",
              "File = collection of related data. May contain text, images, audio, video, or program instructions.",
              "Folder (directory) = container used to organize files and other folders in a logical structure.",
              "Metadata = details about a file/folder: name, type, size, date of creation, date of last modification. Helps identify files without opening them.",
              "4 widely used file systems: FAT 32 (USB flash drives), NTFS (Windows), APFS/HFS+ (macOS), EXT4 (Linux). Choice affects performance, storage capacity, and security features.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 10. T1.8 Recap
    {
      id: "recap-1-8",
      title: "1.8 Recap · Types of OS",
      render: (
        <SlideLayout title="1.8 Types of Operating Systems" accent="var(--sync)">
          <RecapCard
            code="1.8"
            title="Types of Operating Systems"
            color="var(--sync)"
            icon="mdi:shape-outline"
            keyword="RTOS · EMBEDDED · NETWORK · MOBILE"
            facts={[
              "Operating systems are designed according to the needs of the device and the work it performs.",
              "Real-Time OS (RTOS): processes data within a strict deadline. Used in air traffic control, heart-monitoring devices, industrial robots.",
              "Embedded OS: small and highly efficient, built into a specific device. Used in microwaves, washing machines, printers, smart TVs, ATMs.",
              "Network OS: manages multiple computers connected through a network. Focuses on communication + coordination. Used in offices, schools, data centers.",
              "Mobile OS: designed for smartphones, tablets, handheld devices. Optimized for touch-screen, battery saving, and mobile apps. Symbian → Android + iOS.",
            ]}
          />
        </SlideLayout>
      ),
    },

    // 11. Exam ready checklist
    {
      id: "exam-checklist",
      title: "Exam-ready checklist",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Exam-ready checklist"
          subtitle="Tick each one mentally. If any is fuzzy, jump back to that topic's deck."
          accent="var(--sync)"
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StaggerItem>
              <ChecklistRow color="var(--accent)" text="I can define OS + name 5 examples (Windows, macOS, Linux, Android, iOS)." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--accent)" text="I know the letter A in binary is 01000001." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--sync)" text="I can differentiate kernel and shell using the car engine analogy." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--sync)" text="I can name the 3 OS layers and their jobs." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--microtask)" text="I can list the 3 process lifecycle stages and walk through Chrome." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--microtask)" text="I can solve an FCFS problem and explain the convoy effect." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--warn)" text="I can differentiate RAM and Virtual Memory + explain when + why VM is used." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--task)" text="I can differentiate process and thread + explain the browser example." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--task)" text="I can list the 4 benefits of multithreading." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--api)" text="I can define a system call + describe open, read, write, fork." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--accent)" text="I can define file, folder, metadata + name 4 file systems and their OS." />
            </StaggerItem>
            <StaggerItem>
              <ChecklistRow color="var(--sync)" text="I can describe all 4 OS types with definition, key feature, and one example device." />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Book's OWN Summary (page 16 verbatim, 11 bullets)
    {
      id: "book-summary",
      title: "The book's own Summary (page 16)",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Book Summary · page 16 verbatim"
          subtitle="These 11 bullets are printed at the end of Chapter 1. Memorise them."
          accent="var(--accent)"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Operating System (OS) is a type of system software that manages hardware, runs application software, and provides a user interface.",
              "The kernel is the core part of the operating system, that directly controls the computer's hardware and system software such as the CPU, memory, and devices.",
              "The shell is the outer part of the OS that interacts with the user.",
              "System libraries are collections of ready-made instructions that programs can use to perform common tasks, such as opening files or showing text on the screen.",
              "The operating system is responsible for managing all the programs that run on a computer. In this context, these running programs are called processes.",
              "In multitasking the operating system allows more than one program to be open and usable by a single user at the same time.",
              "In concurrency more than one process is active at the same time in an OS, but the CPU processes them one by one in extremely fast cycles.",
              "In the FCFS method, the CPU processes tasks in the exact order they arrive. The first process to arrive is completed first, and the next process starts only after the previous one finishes.",
              "When the RAM is full, the operating system uses part of the computer's storage drive (like Hard drives, solid-state drives (SSD), and Non-Volatile Memory Express (NVMe)) as virtual memory.",
              "A process is an independent program that is currently being executed by the computer. A thread, on the other hand, is the smallest unit of execution within a process.",
              "A system call is a request made by a program to the operating system to perform a specific task that the program cannot do directly.",
            ].map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 12px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    minWidth: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    color: "#0a0e14",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "Roboto Mono, monospace",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{bullet}</div>
              </motion.div>
            ))}
          </div>
        </SlideLayout>
      ),
    },

    // 13. Board's own EXERCISE (page 17-19) overview
    {
      id: "board-exercise",
      title: "Book's EXERCISE section (page 17-19)",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="The board's OWN exercise questions"
          subtitle="Straight from the back of Chapter 1. Study these BEFORE any invented practice."
          accent="var(--microtask)"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "rgba(255, 179, 71, 0.08)",
                border: "1px dashed var(--microtask)",
                borderRadius: 10,
                fontSize: 15,
                color: "var(--text)",
                lineHeight: 1.55,
              }}
            >
              <b style={{ color: "var(--microtask)" }}>Why priority:</b> These are the questions the exam board itself printed. Anything invented (mock test, quiz, MCQ bank) is bonus practice. Master this file first.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                {
                  icon: "mdi:checkbox-multiple-marked-outline",
                  count: "8",
                  label: "MCQs",
                  detail: "Board's own MCQs with the printed answer key. Includes: 'NOT an example of OS', 'kernel = direct hardware', 'FCFS = order of arrival', 'fork creates process'.",
                  color: "var(--sync)",
                },
                {
                  icon: "mdi:pencil-outline",
                  count: "10",
                  label: "Short Questions",
                  detail: "Cover every topic: central controller, translator, kernel vs shell, system library example, FCFS pros/cons, virtual memory speed, syscall, file system role, multitasking.",
                  color: "var(--accent)",
                },
                {
                  icon: "mdi:file-document-edit-outline",
                  count: "5",
                  label: "Long Questions",
                  detail: "Architecture with kernel/shell/layers, process lifecycle, RAM vs virtual + multithreading, system calls with 3+ types, AND an FCFS numerical asking for waiting time + average waiting time.",
                  color: "var(--task)",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    padding: 18,
                    backgroundColor: "var(--panel)",
                    border: `1.5px solid ${c.color}`,
                    borderRadius: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    boxShadow: `0 0 24px ${c.color}22`,
                  }}
                >
                  <Icon icon={c.icon} width={36} height={36} color={c.color} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div
                      style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: c.color,
                        fontFamily: "Roboto Mono, monospace",
                      }}
                    >
                      {c.count}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: c.color, letterSpacing: 1 }}>
                      {c.label}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
                    {c.detail}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "rgba(255, 121, 198, 0.08)",
                border: "1px solid rgba(255, 121, 198, 0.4)",
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Icon icon="mdi:alert-circle-outline" width={22} height={22} color="var(--task)" />
                <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--task)", fontWeight: 800 }}>
                  EXAM CURVEBALL
                </div>
              </div>
              <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>
                Long Q5's FCFS problem asks for <b style={{ color: "var(--task)" }}>waiting time</b> and <b style={{ color: "var(--task)" }}>average waiting time</b>. The teaching only shows execution timeline. Formula: <b>Waiting time = Start time − Arrival time</b>. Average = sum / count. Full worked solution in the file.
              </div>
            </div>
            <div style={{ fontSize: 15, color: "var(--muted)", textAlign: "center" }}>
              File: <b style={{ color: "var(--microtask)" }}>curriculum/multan-board/class-10/computer-science/ch1-operating-systems/questions/board-exercise.md</b>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 14. Practice pyramid + mock test + final motivator
    {
      id: "practice-pyramid",
      title: "Practice pyramid + mock test",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Your practice pyramid" accent="var(--sync)">
          <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center", padding: "10px 0" }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 16 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "var(--sync)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 40px rgba(63, 185, 80, 0.55)",
              }}
            >
              <Icon icon="mdi:podium" width={44} height={44} color="#0a0e14" />
            </motion.div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", textAlign: "center" }}>
              Study in this order for maximum score
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, width: "100%" }}>
              {[
                {
                  rank: "1st",
                  title: "Board's Exercise",
                  file: "ch1-board-exercise.md",
                  body: "8 MCQs + 10 short + 5 long, verbatim from the book. These are the exam's actual questions.",
                  color: "var(--microtask)",
                  icon: "mdi:crown-outline",
                },
                {
                  rank: "2nd",
                  title: "Mock Test",
                  file: "ch1-mock-test.md",
                  body: "Book-inspired 40-mark paper. Practice under 60-minute timer for exam feel.",
                  color: "var(--accent)",
                  icon: "mdi:clipboard-text-outline",
                },
                {
                  rank: "3rd",
                  title: "Mixed MCQ Bank + Quiz",
                  file: "ch1-mixed-mcqs.md + ch1-quiz deck",
                  body: "30 more MCQs + 8-question interactive quiz. Extra drill on weak areas.",
                  color: "var(--sync)",
                  icon: "mdi:target",
                },
              ].map((p) => (
                <div
                  key={p.rank}
                  style={{
                    padding: 20,
                    backgroundColor: "var(--panel)",
                    border: `1.5px solid ${p.color}`,
                    borderRadius: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    boxShadow: `0 0 22px ${p.color}22`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon icon={p.icon} width={34} height={34} color={p.color} />
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: p.color,
                        fontFamily: "Roboto Mono, monospace",
                      }}
                    >
                      {p.rank}
                    </div>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: p.color, fontFamily: "Roboto Mono, monospace" }}>
                    {p.file}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{p.body}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: 1,
              }}
            >
              You got this.
            </div>
          </div>
        </SlideLayout>
      ),
    },
  ],
};
