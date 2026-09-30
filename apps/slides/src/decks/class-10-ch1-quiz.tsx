/**
 * Class 10 CS · Chapter 1 · Interactive Quiz Deck
 *
 * 8 questions (one per topic) as Q / Reveal slide pairs. Reader reads the
 * question, pauses to think, then advances to see the correct answer with a
 * verbatim book explanation. Great for live classroom + solo YouTube viewers.
 *
 * All questions and answers copied EXACTLY from the parsed topic files.
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { HeroSlide, SlideLayout } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

// ── style tokens ────────────────────────────────────────────────────────

const hlWarm: CSSProperties = { color: "var(--microtask)", fontWeight: 700 };

// ── option pill (for Q slides) ──────────────────────────────────────────

const OptionPill: React.FC<{
  letter: string;
  text: string;
  highlight?: "correct" | "none";
  delay?: number;
}> = ({ letter, text, highlight = "none", delay = 0 }) => {
  const isCorrect = highlight === "correct";
  const color = isCorrect ? "var(--sync)" : "var(--muted)";
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        backgroundColor: isCorrect ? "rgba(63, 185, 80, 0.14)" : "var(--panel)",
        border: isCorrect ? "2px solid var(--sync)" : "1px solid var(--panel-border)",
        borderRadius: 12,
        boxShadow: isCorrect ? "0 0 30px rgba(63, 185, 80, 0.4)" : "none",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: isCorrect ? "var(--sync)" : "var(--panel)",
          border: isCorrect ? "none" : `1.5px solid ${color}`,
          color: isCorrect ? "#0a0e14" : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
          flexShrink: 0,
        }}
      >
        {letter}
      </div>
      <div
        style={{
          fontSize: 18,
          color: isCorrect ? "var(--text)" : "var(--text)",
          lineHeight: 1.5,
          fontWeight: isCorrect ? 700 : 500,
          flex: 1,
        }}
      >
        {text}
      </div>
      {isCorrect && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
        >
          <Icon icon="mdi:check-circle" width={32} height={32} color="var(--sync)" />
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Q slide layout ──────────────────────────────────────────────────────

const QuestionSlide: React.FC<{
  number: string;
  topic: string;
  question: string;
  options: { letter: string; text: string }[];
}> = ({ number, topic, question, options }) => (
  <SlideLayout
    title={`Question ${number}`}
    subtitle={`Topic ${topic} · Pause. Think. Then press → to reveal the answer.`}
    accent={ACCENT}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--accent)",
            color: "#0a0e14",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "Roboto Mono, monospace",
          }}
        >
          Q{number}
        </div>
        <div
          style={{
            padding: "6px 12px",
            backgroundColor: "rgba(88, 166, 255, 0.15)",
            border: "1px solid rgba(88, 166, 255, 0.4)",
            borderRadius: 999,
            fontSize: 12,
            letterSpacing: 2,
            color: "var(--accent)",
            fontWeight: 700,
          }}
        >
          TOPIC {topic}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 18 }}
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text)",
          lineHeight: 1.4,
        }}
      >
        {question}
      </motion.div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((o, i) => (
          <OptionPill key={o.letter} letter={o.letter} text={o.text} delay={0.2 + i * 0.1} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginTop: 4,
          padding: "10px 16px",
          backgroundColor: "rgba(255, 179, 71, 0.08)",
          border: "1px dashed rgba(255, 179, 71, 0.5)",
          borderRadius: 10,
          color: "var(--microtask)",
        }}
      >
        <Icon icon="mdi:brain" width={22} height={22} />
        <div style={{ fontSize: 14, letterSpacing: 1, fontWeight: 700 }}>
          THINK, THEN PRESS → TO SEE THE ANSWER
        </div>
      </motion.div>
    </div>
  </SlideLayout>
);

// ── Reveal slide layout ─────────────────────────────────────────────────

const RevealSlide: React.FC<{
  number: string;
  topic: string;
  question: string;
  options: { letter: string; text: string }[];
  correctLetter: string;
  explanation: string;
}> = ({ number, topic, question, options, correctLetter, explanation }) => (
  <SlideLayout
    title={`Answer ${number}`}
    subtitle={`Topic ${topic} · The correct choice is highlighted below.`}
    accent="var(--sync)"
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--sync)",
            color: "#0a0e14",
            borderRadius: 999,
            fontSize: 15,
            fontWeight: 800,
            fontFamily: "Roboto Mono, monospace",
          }}
        >
          A{number}
        </div>
        <div
          style={{
            padding: "6px 12px",
            backgroundColor: "rgba(63, 185, 80, 0.15)",
            border: "1px solid rgba(63, 185, 80, 0.4)",
            borderRadius: 999,
            fontSize: 12,
            letterSpacing: 2,
            color: "var(--sync)",
            fontWeight: 700,
          }}
        >
          CORRECT: {correctLetter.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          fontSize: 20,
          color: "var(--muted)",
          lineHeight: 1.5,
          padding: "12px 16px",
          backgroundColor: "rgba(255,255,255,0.03)",
          borderLeft: "3px solid var(--muted)",
          borderRadius: 6,
        }}
      >
        {question}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((o, i) => (
          <OptionPill
            key={o.letter}
            letter={o.letter}
            text={o.text}
            highlight={o.letter === correctLetter ? "correct" : "none"}
            delay={0.15 + i * 0.08}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", damping: 18 }}
        style={{
          padding: "14px 18px",
          backgroundColor: "rgba(88, 166, 255, 0.08)",
          border: "1px solid rgba(88, 166, 255, 0.4)",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Icon icon="mdi:book-open-variant" width={22} height={22} color="var(--accent)" />
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--accent)", fontWeight: 800 }}>
            EXPLANATION FROM THE BOOK
          </div>
        </div>
        <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{explanation}</div>
      </motion.div>
    </div>
  </SlideLayout>
);

// ── Results / interpret-your-score slide ────────────────────────────────

const ResultsPanel: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", damping: 18 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 22,
      padding: 40,
      backgroundColor: "var(--panel)",
      border: "2px solid var(--sync)",
      borderRadius: 20,
      boxShadow: "0 0 60px rgba(63, 185, 80, 0.35)",
      maxWidth: 900,
    }}
  >
    <motion.div
      animate={{ rotate: [0, -6, 6, 0] }}
      transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      style={{
        width: 88,
        height: 88,
        borderRadius: "50%",
        backgroundColor: "var(--sync)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(63, 185, 80, 0.6)",
      }}
    >
      <Icon icon="mdi:medal-outline" width={52} height={52} color="#0a0e14" />
    </motion.div>
    <div style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", textAlign: "center" }}>
      Count your score
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, width: "100%" }}>
      {[
        {
          range: "7 to 8",
          label: "Exam ready",
          color: "var(--sync)",
          body: "You know Chapter 1. Move on to the mock test for the full exam feel.",
          icon: "mdi:trophy-outline",
        },
        {
          range: "5 to 6",
          label: "Almost there",
          color: "var(--accent)",
          body: "Go back to the topic decks where you missed a question. Re-take this quiz tomorrow.",
          icon: "mdi:target",
        },
        {
          range: "0 to 4",
          label: "Time to revise",
          color: "var(--microtask)",
          body: "Open the Chapter 1 Revision deck. Re-read each missed topic. Try again in a couple of days.",
          icon: "mdi:book-open-outline",
        },
      ].map((r) => (
        <div
          key={r.range}
          style={{
            padding: 20,
            backgroundColor: "var(--panel)",
            border: `1.5px solid ${r.color}`,
            borderRadius: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Icon icon={r.icon} width={36} height={36} color={r.color} />
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: r.color,
              fontFamily: "Roboto Mono, monospace",
            }}
          >
            {r.range}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: r.color, letterSpacing: 1 }}>
            {r.label}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{r.body}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 15, color: "var(--muted)", textAlign: "center", maxWidth: 720 }}>
      Next: try the full <b style={{ color: "var(--accent)" }}>Chapter 1 Mock Test</b> (40 marks, 60 minutes) or head back to the <b style={{ color: "var(--microtask)" }}>Revision deck</b> for a full recap.
    </div>
  </motion.div>
);

// ── the deck ────────────────────────────────────────────────────────────

export const class10Ch1QuizDeck: Deck = {
  title: "Chapter 1 Quick Quiz",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "Ch 1 · Quick Quiz",
  topicCode: "QUIZ",
  topicTitle: "Chapter 1 Quick Quiz · 8 questions",
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
              Chapter 1 <span style={{ color: ACCENT }}>Quick Quiz</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, gap: 14, flexWrap: "wrap" }}>
                {["1.1", "1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8"].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.06, type: "spring", damping: 14 }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      backgroundColor: "var(--panel)",
                      border: "1.5px solid var(--accent)",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--accent)",
                      fontFamily: "Roboto Mono, monospace",
                      boxShadow: "0 0 16px rgba(88, 166, 255, 0.35)",
                    }}
                  >
                    {t}
                  </motion.div>
                ))}
              </div>
              8 questions. One from every topic. Test what you actually remember.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. How to use this deck
    {
      id: "how-to-use",
      title: "How to use this quiz",
      transition: "slide",
      render: (
        <SlideLayout
          title="How to use this quiz"
          subtitle="Active recall beats passive re-reading every time. Pause, guess, then reveal."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                {
                  icon: "mdi:eye-outline",
                  label: "1. READ",
                  body: "Read the question and all 4 options carefully. Do not rush.",
                  color: "var(--accent)",
                },
                {
                  icon: "mdi:brain",
                  label: "2. THINK",
                  body: "Pause the video (or wait 15 seconds in class). Pick your answer in your head.",
                  color: "var(--microtask)",
                },
                {
                  icon: "mdi:arrow-right-thick",
                  label: "3. REVEAL",
                  body: "Press → (or space) to see the correct answer plus the book's explanation.",
                  color: "var(--sync)",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: 22,
                    backgroundColor: "var(--panel)",
                    border: `1.5px solid ${s.color}`,
                    borderRadius: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    boxShadow: `0 0 24px ${s.color}22`,
                  }}
                >
                  <Icon icon={s.icon} width={44} height={44} color={s.color} />
                  <div style={{ fontSize: 14, letterSpacing: 2, color: s.color, fontWeight: 800 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{s.body}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "rgba(88, 166, 255, 0.08)",
                border: "1px dashed var(--accent)",
                borderRadius: 12,
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.55,
              }}
            >
              <b style={{ color: "var(--accent)" }}>Why active recall?</b> Research shows that guessing (even wrong) before seeing the answer strengthens memory far more than reading the answer again. Count how many you get right; your score at the end tells you exactly what to revise.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // Q1 (Topic 1.1)
    {
      id: "q1",
      title: "Q1 · Topic 1.1",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="1"
          topic="1.1"
          question="In a multi-user environment, the OS ensures all of the following EXCEPT:"
          options={[
            { letter: "a", text: "Creation and management of separate user accounts" },
            { letter: "b", text: "Keeping each user's files private" },
            { letter: "c", text: "Fair sharing of system resources" },
            { letter: "d", text: "Automatic upgrade of computer hardware" },
          ]}
        />
      ),
    },
    {
      id: "a1",
      title: "A1 · Topic 1.1",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="1"
          topic="1.1"
          question="In a multi-user environment, the OS ensures all of the following EXCEPT:"
          options={[
            { letter: "a", text: "Creation and management of separate user accounts" },
            { letter: "b", text: "Keeping each user's files private" },
            { letter: "c", text: "Fair sharing of system resources" },
            { letter: "d", text: "Automatic upgrade of computer hardware" },
          ]}
          correctLetter="d"
          explanation="From the book (1.1): the OS handles user accounts, privacy, fair resource sharing, and protection from unauthorized access. Hardware upgrades are a technician's job, not the OS."
        />
      ),
    },

    // Q2 (Topic 1.2)
    {
      id: "q2",
      title: "Q2 · Topic 1.2",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="2"
          topic="1.2"
          question="In the book's car analogy, what is compared to the kernel?"
          options={[
            { letter: "a", text: "The steering wheel" },
            { letter: "b", text: "The dashboard" },
            { letter: "c", text: "The engine" },
            { letter: "d", text: "The seats" },
          ]}
        />
      ),
    },
    {
      id: "a2",
      title: "A2 · Topic 1.2",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="2"
          topic="1.2"
          question="In the book's car analogy, what is compared to the kernel?"
          options={[
            { letter: "a", text: "The steering wheel" },
            { letter: "b", text: "The dashboard" },
            { letter: "c", text: "The engine" },
            { letter: "d", text: "The seats" },
          ]}
          correctLetter="c"
          explanation='From the book (1.2): "Like Engine of a car is kernel and accessories like steering wheel, dashboard are shells." The engine is hidden but does all the real work, just like the kernel controls the hardware.'
        />
      ),
    },

    // Q3 (Topic 1.3)
    {
      id: "q3",
      title: "Q3 · Topic 1.3",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="3"
          topic="1.3"
          question='What is the "convoy effect" mentioned in the book?'
          options={[
            { letter: "a", text: "A special feature of multitasking" },
            {
              letter: "b",
              text: "Short processes waiting a long time when queued behind longer processes in FCFS",
            },
            { letter: "c", text: "The CPU processing multiple processes at once" },
            { letter: "d", text: "When the OS crashes" },
          ]}
        />
      ),
    },
    {
      id: "a3",
      title: "A3 · Topic 1.3",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="3"
          topic="1.3"
          question='What is the "convoy effect" mentioned in the book?'
          options={[
            { letter: "a", text: "A special feature of multitasking" },
            {
              letter: "b",
              text: "Short processes waiting a long time when queued behind longer processes in FCFS",
            },
            { letter: "c", text: "The CPU processing multiple processes at once" },
            { letter: "d", text: "When the OS crashes" },
          ]}
          correctLetter="b"
          explanation='From the book (1.3, Disadvantages of FCFS): "Short processes may have to wait a long time if they are queued behind longer processes (known as the convoy effect), which can affect the overall efficiency of the system." Think short cars stuck behind slow trucks on a one-lane road.'
        />
      ),
    },

    // Q4 (Topic 1.4)
    {
      id: "q4",
      title: "Q4 · Topic 1.4",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="4"
          topic="1.4"
          question="Why can using virtual memory reduce system performance?"
          options={[
            { letter: "a", text: "Storage drives are faster than RAM" },
            {
              letter: "b",
              text: "Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM",
            },
            { letter: "c", text: "Virtual memory uses more electricity" },
            { letter: "d", text: "Virtual memory heats up the CPU" },
          ]}
        />
      ),
    },
    {
      id: "a4",
      title: "A4 · Topic 1.4",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="4"
          topic="1.4"
          question="Why can using virtual memory reduce system performance?"
          options={[
            { letter: "a", text: "Storage drives are faster than RAM" },
            {
              letter: "b",
              text: "Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM",
            },
            { letter: "c", text: "Virtual memory uses more electricity" },
            { letter: "d", text: "Virtual memory heats up the CPU" },
          ]}
          correctLetter="b"
          explanation='From the book (1.4): "Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM; that’s why the use of virtual memory can result in reduced system performance."'
        />
      ),
    },

    // Q5 (Topic 1.5)
    {
      id: "q5",
      title: "Q5 · Topic 1.5",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="5"
          topic="1.5"
          question="How do multiple threads in the same process handle memory and resources?"
          options={[
            { letter: "a", text: "Each thread gets its own separate memory" },
            {
              letter: "b",
              text: "All threads in the same process share the same memory and resources, but operate independently",
            },
            { letter: "c", text: "Threads do not use memory" },
            { letter: "d", text: "Threads use only virtual memory" },
          ]}
        />
      ),
    },
    {
      id: "a5",
      title: "A5 · Topic 1.5",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="5"
          topic="1.5"
          question="How do multiple threads in the same process handle memory and resources?"
          options={[
            { letter: "a", text: "Each thread gets its own separate memory" },
            {
              letter: "b",
              text: "All threads in the same process share the same memory and resources, but operate independently",
            },
            { letter: "c", text: "Threads do not use memory" },
            { letter: "d", text: "Threads use only virtual memory" },
          ]}
          correctLetter="b"
          explanation='From the book (1.5): "All threads in the same process share the same memory and resources, but operate independently." This is why threads are much cheaper than full processes.'
        />
      ),
    },

    // Q6 (Topic 1.6)
    {
      id: "q6",
      title: "Q6 · Topic 1.6",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="6"
          topic="1.6"
          question="Which system call creates a new process by duplicating an existing one?"
          options={[
            { letter: "a", text: "open" },
            { letter: "b", text: "read" },
            { letter: "c", text: "write" },
            { letter: "d", text: "fork" },
          ]}
        />
      ),
    },
    {
      id: "a6",
      title: "A6 · Topic 1.6",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="6"
          topic="1.6"
          question="Which system call creates a new process by duplicating an existing one?"
          options={[
            { letter: "a", text: "open" },
            { letter: "b", text: "read" },
            { letter: "c", text: "write" },
            { letter: "d", text: "fork" },
          ]}
          correctLetter="d"
          explanation='From the book (1.6): "fork Creates a new process by duplicating an existing one." Example: opening a new browser tab, where the OS may use fork to create another process.'
        />
      ),
    },

    // Q7 (Topic 1.7)
    {
      id: "q7",
      title: "Q7 · Topic 1.7",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="7"
          topic="1.7"
          question="Which file system is typically used in USB flash drives?"
          options={[
            { letter: "a", text: "NTFS" },
            { letter: "b", text: "APFS" },
            { letter: "c", text: "FAT 32" },
            { letter: "d", text: "EXT4" },
          ]}
        />
      ),
    },
    {
      id: "a7",
      title: "A7 · Topic 1.7",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="7"
          topic="1.7"
          question="Which file system is typically used in USB flash drives?"
          options={[
            { letter: "a", text: "NTFS" },
            { letter: "b", text: "APFS" },
            { letter: "c", text: "FAT 32" },
            { letter: "d", text: "EXT4" },
          ]}
          correctLetter="c"
          explanation='From the book (1.7): "FAT 32 - Used in USB flash drives." Remember: NTFS = Windows, APFS = macOS, EXT4 = Linux, FAT 32 = USBs.'
        />
      ),
    },

    // Q8 (Topic 1.8)
    {
      id: "q8",
      title: "Q8 · Topic 1.8",
      entrySfx: "notify.wav",
      render: (
        <QuestionSlide
          number="8"
          topic="1.8"
          question="Which is NOT listed as a device that uses an Embedded OS in the book?"
          options={[
            { letter: "a", text: "Microwaves" },
            { letter: "b", text: "Washing machines" },
            { letter: "c", text: "Printers" },
            { letter: "d", text: "Desktop computers" },
          ]}
        />
      ),
    },
    {
      id: "a8",
      title: "A8 · Topic 1.8",
      entrySfx: "ding.wav",
      render: (
        <RevealSlide
          number="8"
          topic="1.8"
          question="Which is NOT listed as a device that uses an Embedded OS in the book?"
          options={[
            { letter: "a", text: "Microwaves" },
            { letter: "b", text: "Washing machines" },
            { letter: "c", text: "Printers" },
            { letter: "d", text: "Desktop computers" },
          ]}
          correctLetter="d"
          explanation='From the book (1.8): "Used in: Home appliances (microwaves, washing machines), printers, smart TVs, and ATMs." Desktop computers run general-purpose OS (Windows, macOS, Linux), not Embedded OS.'
        />
      ),
    },

    // Results
    {
      id: "results",
      title: "Score card",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Quiz complete. How did you do?" accent="var(--sync)">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <ResultsPanel />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
