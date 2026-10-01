/**
 * Class 12 CS · Chapter 4 · Quick Quiz Deck
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * 17 slides: hero + how-to + 7 Q+Reveal pairs (one per sub-topic) + score card.
 * Each question is a Short-Question style prompt, answer is revealed on the
 * next slide so the teacher can pause for class discussion.
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { HeroSlide, SlideLayout } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

const hlGold: CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const hlTeal: CSSProperties = { color: "var(--sync)", fontWeight: 700 };

// ── Question slide ──────────────────────────────────────────────────────

const QuestionSlide: React.FC<{
  n: number;
  code: string;
  q: string;
  hint?: string;
  color?: string;
}> = ({ n, code, q, hint, color = "var(--accent)" }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 24,
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 18 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          backgroundColor: color,
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        Q{n} · {code}
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", damping: 16 }}
      style={{
        padding: "40px 48px",
        maxWidth: 1200,
        backgroundColor: "var(--panel)",
        border: `2px solid ${color}`,
        borderRadius: 20,
        boxShadow: `0 0 60px ${color}33`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 32, color: "var(--text)", lineHeight: 1.5, fontWeight: 600 }}>{q}</div>
      {hint && (
        <div
          style={{
            marginTop: 18,
            fontSize: 15,
            color: "var(--muted)",
            fontStyle: "italic",
          }}
        >
          Hint: {hint}
        </div>
      )}
    </motion.div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 15,
        color: "var(--muted)",
      }}
    >
      <Icon icon="mdi:timer-outline" width={22} />
      <span>Think for 30 seconds. Then press → to reveal the answer.</span>
    </motion.div>
  </div>
);

// ── Reveal slide ────────────────────────────────────────────────────────

const RevealSlide: React.FC<{
  n: number;
  q: string;
  a: string;
  verbatimTag?: boolean;
  color?: string;
}> = ({ n, q, a, verbatimTag, color = "var(--sync)" }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 20,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          padding: "6px 14px",
          backgroundColor: color,
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 15,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        A{n}
      </div>
      {verbatimTag && (
        <div
          style={{
            padding: "4px 12px",
            borderRadius: 999,
            backgroundColor: "rgba(201, 166, 107, 0.14)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
            fontSize: 11,
            letterSpacing: 2,
            fontWeight: 800,
          }}
        >
          VERBATIM FROM BOOK
        </div>
      )}
    </div>
    <div
      style={{
        padding: "16px 24px",
        maxWidth: 1100,
        backgroundColor: "var(--panel)",
        border: "1px dashed var(--muted)",
        borderRadius: 10,
        fontSize: 18,
        color: "var(--muted)",
      }}
    >
      Q: {q}
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 16 }}
      style={{
        padding: "32px 44px",
        maxWidth: 1200,
        backgroundColor: "var(--panel)",
        border: `2px solid ${color}`,
        borderRadius: 20,
        boxShadow: `0 0 60px ${color}33`,
        display: "flex",
        gap: 20,
        alignItems: "flex-start",
      }}
    >
      <Icon icon="mdi:check-circle-outline" width={48} color={color} />
      <div style={{ fontSize: 22, color: "var(--text)", lineHeight: 1.55, fontWeight: 500 }}>
        {a}
      </div>
    </motion.div>
  </div>
);

// ── Q+A pairs (one per sub-topic) ───────────────────────────────────────

const QUIZ_ITEMS = [
  {
    code: "4.1a",
    color: "var(--accent)",
    q: "What is Tkinter and what is it suitable for?",
    hint: "Think about where it comes from and what size of apps it fits.",
    a: "Tkinter is Python's standard GUI toolkit that comes pre-installed with the language. It is easy to learn, lightweight, and supports event-driven programming. It is suitable for building small to medium-sized GUI applications quickly and efficiently.",
    verbatim: true,
  },
  {
    code: "4.1b",
    color: "var(--sync)",
    q: "What is a Frame in Tkinter, and why do we use frames?",
    hint: "Container... group... divide window.",
    a: "A frame is a container used to organize and group widgets inside a GUI window. Frames divide the window into smaller parts, making it easier to group related widgets. This structure improves clarity and keeps the interface well-arranged.",
    verbatim: true,
  },
  {
    code: "4.1c",
    color: "var(--microtask)",
    q: "What are the three layout methods in Tkinter, and when do you use each?",
    hint: "pack · grid · place · simple / table / coordinates",
    a: "pack() places widgets in a simple vertical or horizontal order (small apps). grid() arranges widgets in rows and columns like a table (forms, structured layouts). place() positions widgets at exact x,y coordinates (precise placement, careful adjustment).",
    verbatim: true,
  },
  {
    code: "4.1d",
    color: "var(--task)",
    q: "How does Tkinter connect a button click to a Python function? Give the exact syntax.",
    hint: "One keyword parameter · no parentheses.",
    a: "Through the command= parameter when creating the button. Example: tk.Button(window, text=\"Login\", command=check_login). Note: command=check_login with NO parentheses · otherwise the function fires once immediately instead of on click.",
    verbatim: false,
  },
  {
    code: "4.2a",
    color: "var(--api)",
    q: "Differentiate between Primary Key and Foreign Key. Give one example from Figure 4.3.",
    hint: "unique id vs link to another table.",
    a: "A Primary Key is a unique identifier for each record in a table (e.g., RollNo in Student). A Foreign Key is a field that links one table to another by referring to the primary key of another table (e.g., DeptID in Student links to DeptID in Department).",
    verbatim: true,
  },
  {
    code: "4.2b",
    color: "var(--sync)",
    q: "List the 5 steps of connecting Python to a SQLite database and running a SELECT query.",
    hint: "connect → cursor → execute → fetch → close.",
    a: "1. Connect to Database: sqlite3.connect(\"school.db\"). 2. Create Cursor: connection.cursor(). 3. Execute Query: cursor.execute(\"SELECT * FROM students\"). 4. Fetch and Display Data: cursor.fetchall() + for row in records: print(row). 5. Close Connection: connection.close(). For writes also call connection.commit() before closing.",
    verbatim: true,
  },
  {
    code: "4.2c",
    color: "var(--microtask)",
    q: "What are the 4 CRUD operations, and what SQL command does each use?",
    hint: "C · R · U · D.",
    a: "Create = INSERT (adds a new record). Read = SELECT (retrieves data). Update = UPDATE (modifies an existing record). Delete = DELETE (removes a record, safely with WHERE). All write operations (INSERT, UPDATE, DELETE) need commit() to be permanent.",
    verbatim: true,
  },
];

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4QuizDeck: Deck = {
  title: "Chapter 4 · Quick Quiz",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of GUI",
  topic: "Quick Quiz",
  topicCode: "Ch 4",
  topicTitle: "Chapter 4 Quick Quiz",
  theme: "class-12",
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
              Chapter 4 <span style={{ color: ACCENT }}>Quick Quiz</span>
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                {["4.1a", "4.1b", "4.1c", "4.1d", "4.2a", "4.2b", "4.2c"].map((t) => (
                  <div
                    key={t}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      backgroundColor: "rgba(103, 216, 196, 0.14)",
                      border: "1px solid var(--sync)",
                      color: "var(--sync)",
                      fontFamily: "Roboto Mono, monospace",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <b style={hlTeal}>7 questions</b>. One per sub-topic. Think first, then peek at the answer.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. How to play
    {
      id: "how-to-play",
      title: "How this quiz works",
      render: (
        <SlideLayout
          title="How this quiz works"
          subtitle='Teacher-friendly. Pause, discuss, reveal, repeat.'
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "20px 0",
            }}
          >
            {[
              { n: 1, icon: "mdi:help-circle-outline", color: "var(--accent)", title: "Question slide", detail: "A short question appears with a 30-second thinking prompt and a hint." },
              { n: 2, icon: "mdi:timer-sand", color: "var(--sync)", title: "Think + discuss", detail: "Students write or discuss their answer. Teacher can pause up to 60 seconds." },
              { n: 3, icon: "mdi:check-circle-outline", color: "var(--microtask)", title: "Reveal slide", detail: "Press → to flip to the answer. Verbatim-from-book answers are tagged." },
              { n: 4, icon: "mdi:repeat", color: "var(--task)", title: "Score + move on", detail: "Students mark their answer right/wrong. Score card at the end." },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "14px 18px",
                  backgroundColor: "var(--panel)",
                  border: `1.5px solid ${s.color}`,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: s.color,
                    color: "#0d0a1c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 800,
                    fontFamily: "Roboto Mono, monospace",
                    flex: "none",
                  }}
                >
                  {s.n}
                </div>
                <Icon icon={s.icon} width={32} color={s.color} />
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </SlideLayout>
      ),
    },

    // 3-16. Q+A pairs (7 pairs = 14 slides)
    ...QUIZ_ITEMS.flatMap((item, i) => [
      {
        id: `q${i + 1}`,
        title: `Q${i + 1} · ${item.code}`,
        entrySfx: "ting.wav",
        render: (
          <SlideLayout title={`Question ${i + 1}`} accent={item.color}>
            <QuestionSlide
              n={i + 1}
              code={item.code}
              q={item.q}
              hint={item.hint}
              color={item.color}
            />
          </SlideLayout>
        ),
      },
      {
        id: `a${i + 1}`,
        title: `Answer ${i + 1}`,
        entrySfx: "ding.wav",
        transition: "fade" as const,
        render: (
          <SlideLayout title={`Answer ${i + 1}`} accent={item.color}>
            <RevealSlide
              n={i + 1}
              q={item.q}
              a={item.a}
              verbatimTag={item.verbatim}
              color={item.color}
            />
          </SlideLayout>
        ),
      },
    ]),

    // 17. Score card
    {
      id: "score-card",
      title: "Your score",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout
          title="How did you do?"
          subtitle='Score yourself. Review the sub-topics where you got the answer wrong.'
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              marginTop: 10,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 14,
                width: "100%",
              }}
            >
              {[
                { range: "7 / 7", icon: "mdi:trophy-outline", color: "var(--accent)", title: "Exam-ready", detail: "You can walk into the paper today. Attempt the Mock Test for timing." },
                { range: "5-6 / 7", icon: "mdi:medal-outline", color: "var(--sync)", title: "Strong", detail: "Review the 1-2 sub-topics you missed. Attempt the Board EXERCISE next." },
                { range: "3-4 / 7", icon: "mdi:book-open-outline", color: "var(--microtask)", title: "On your way", detail: "Re-watch the sub-topic decks where you missed. Then quiz again." },
                { range: "0-2 / 7", icon: "mdi:refresh-circle", color: "var(--task)", title: "Needs another pass", detail: "Start with the Revision deck, then re-watch each sub-topic in order." },
              ].map((row) => (
                <div
                  key={row.range}
                  style={{
                    padding: 18,
                    backgroundColor: "var(--panel)",
                    border: `1.5px solid ${row.color}`,
                    borderRadius: 14,
                    boxShadow: `0 0 20px ${row.color}22`,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Icon icon={row.icon} width={40} color={row.color} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: row.color, fontFamily: "Roboto Mono, monospace" }}>
                    {row.range}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{row.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{row.detail}</div>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "14px 20px",
                backgroundColor: "rgba(201, 166, 107, 0.08)",
                border: "1px dashed var(--accent)",
                borderRadius: 10,
                fontSize: 16,
                color: "var(--text)",
                textAlign: "center",
                maxWidth: 900,
              }}
            >
              Full chapter kit: <b style={hlGold}>Revision deck</b> · <b style={hlTeal}>Mock Test (60 min)</b> · <b style={hlGold}>Board EXERCISE</b> · <b style={hlTeal}>Mixed MCQ bank (30 Qs)</b>. Everything you need for the paper is in this chapter folder.
            </div>
          </div>
        </SlideLayout>
      ),
    },
  ],
};
