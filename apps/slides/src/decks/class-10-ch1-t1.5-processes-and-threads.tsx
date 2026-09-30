/**
 * Class 10 CS · Chapter 1 · Topic 1.5 · Processes and Threads
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, and key-point sentence is copied EXACTLY from
 * `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.5-processes-and-threads.md`.
 * Real-world examples are labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 13 slides. Hand-drawn Process vs Thread diagram on slide 5. Animated web browser 3-thread on slide 6.
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { Card, HeroSlide, SlideLayout, SplitSlide } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

// ── style tokens ─────────────────────────────────────────────────────────

const bookQuoteStyle: CSSProperties = {
  fontSize: 24,
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
      show: { transition: { staggerChildren: 0.12, delayChildren: delay } },
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
      hidden: { opacity: 0, y: 24, scale: 0.96 },
      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 18, stiffness: 200 } },
    }}
  >
    {children}
  </motion.div>
);

// ── shared tags ──────────────────────────────────────────────────────────

const BookExtensionTag: React.FC<{ color?: string }> = ({ color = "var(--microtask)" }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "4px 12px",
      borderRadius: 999,
      backgroundColor: `${color}20`,
      border: `1px solid ${color}55`,
      color,
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: 700,
      marginBottom: 10,
    }}
  >
    <Icon icon="mdi:plus-circle-outline" width={14} height={14} />
    <span>BEYOND THE BOOK</span>
  </div>
);

// ── hero: process with 3 animated threads inside ────────────────────────

const HeroProcessThreads: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, type: "spring", damping: 16 }}
      style={{
        width: 560,
        padding: 26,
        backgroundColor: "var(--panel)",
        border: "2.5px solid var(--accent)",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 0 50px rgba(88, 166, 255, 0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon icon="mdi:application-outline" width={40} height={40} color="var(--accent)" />
        <div style={{ fontSize: 20, letterSpacing: 3, color: "var(--accent)", fontWeight: 800 }}>
          ONE PROCESS
        </div>
      </div>
      {[
        { color: "var(--sync)", label: "Thread 1", icon: "mdi:web" },
        { color: "var(--microtask)", label: "Thread 2", icon: "mdi:play-outline" },
        { color: "var(--task)", label: "Thread 3", icon: "mdi:download" },
      ].map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: [0, 6, 0] }}
          transition={{
            opacity: { delay: 0.4 + i * 0.18 },
            x: { delay: 1.2 + i * 0.4, duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 16px",
            borderRadius: 10,
            backgroundColor: `${t.color}15`,
            border: `1.5px solid ${t.color}`,
          }}
        >
          <Icon icon={t.icon} width={28} height={28} color={t.color} />
          <div style={{ fontSize: 15, fontWeight: 800, color: t.color, letterSpacing: 1 }}>
            {t.label}
          </div>
          <motion.div
            animate={{ scaleX: [0, 1] }}
            transition={{ delay: 0.6 + i * 0.18, duration: 0.7 }}
            style={{ flex: 1, height: 2, backgroundColor: t.color, transformOrigin: "left" }}
          />
        </motion.div>
      ))}
      <div
        style={{
          padding: "8px 14px",
          backgroundColor: "rgba(88, 166, 255, 0.1)",
          border: "1px dashed var(--accent)",
          borderRadius: 8,
          fontSize: 13,
          color: "var(--accent)",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        SHARED MEMORY + RESOURCES
      </div>
    </motion.div>
  </div>
);

// ── slide 3 process properties cards ────────────────────────────────────

const ProcessPropCard: React.FC<{ icon: string; label: string; body: string; color: string }> = ({
  icon,
  label,
  body,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 20,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 22px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={40} height={40} color={color} />
    <div style={{ fontSize: 18, fontWeight: 800, color }}>{label}</div>
    <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{body}</div>
  </div>
);

// ── slide 6 web browser example ──────────────────────────────────────────

const BrowserThreadsVisual: React.FC = () => {
  const threads = [
    {
      color: "var(--sync)",
      icon: "mdi:web",
      title: "Thread 1",
      body: "Loading and rendering a webpage.",
    },
    {
      color: "var(--microtask)",
      icon: "mdi:play-circle-outline",
      title: "Thread 2",
      body: "Playing audio or video content.",
    },
    {
      color: "var(--task)",
      icon: "mdi:download",
      title: "Thread 3",
      body: "Downloading files in the background.",
    },
  ];
  return (
    <div
      style={{
        padding: 22,
        backgroundColor: "var(--panel)",
        border: "2px solid var(--accent)",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 0 40px rgba(88, 166, 255, 0.28)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Icon icon="mdi:google-chrome" width={44} height={44} color="var(--accent)" />
        <div>
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--accent)", fontWeight: 800 }}>
            THE ENTIRE BROWSER APPLICATION
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>= 1 process</div>
        </div>
      </div>
      <div style={{ height: 1, backgroundColor: "var(--panel-border)" }} />
      <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }} delay={0.1}>
        {threads.map((t) => (
          <StaggerItem key={t.title}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 16px",
                backgroundColor: `${t.color}18`,
                border: `1.5px solid ${t.color}`,
                borderRadius: 12,
              }}
            >
              <Icon icon={t.icon} width={36} height={36} color={t.color} />
              <div style={{ minWidth: 90, fontSize: 15, fontWeight: 800, color: t.color, letterSpacing: 1 }}>
                {t.title}
              </div>
              <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.5 }}>{t.body}</div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "rgba(88, 166, 255, 0.08)",
          border: "1px dashed var(--accent)",
          borderRadius: 10,
          fontSize: 14,
          color: "var(--accent)",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        THREADS SHARE THE BROWSER'S MEMORY AND RESOURCES
      </div>
    </div>
  );
};

// ── slide 8 benefit card ────────────────────────────────────────────────

const BenefitCard: React.FC<{
  number: string;
  icon: string;
  title: string;
  body: string;
  example?: string;
  color: string;
}> = ({ number, icon, title, body, example, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 20,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 22px ${color}22`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: color,
          color: "#0a0e14",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
        }}
      >
        {number}
      </div>
      <Icon icon={icon} width={32} height={32} color={color} />
      <div style={{ fontSize: 17, fontWeight: 800, color }}>{title}</div>
    </div>
    <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{body}</div>
    {example && (
      <div
        style={{
          marginTop: "auto",
          padding: "10px 12px",
          backgroundColor: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${color}`,
          borderRadius: 6,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: 2, color, fontWeight: 800, marginBottom: 4 }}>
          EXAMPLE
        </div>
        <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{example}</div>
      </div>
    )}
  </div>
);

// ── slide 9 comparison row ──────────────────────────────────────────────

const CompareRow: React.FC<{ label: string; process: string; thread: string }> = ({
  label,
  process,
  thread,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "180px 1fr 1fr",
      gap: 12,
      alignItems: "center",
      padding: "12px 16px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 10,
    }}
  >
    <div style={{ fontSize: 13, letterSpacing: 2, color: "var(--muted)", fontWeight: 800 }}>
      {label}
    </div>
    <div style={{ fontSize: 16, color: "var(--accent)", fontWeight: 700 }}>{process}</div>
    <div style={{ fontSize: 16, color: "var(--microtask)", fontWeight: 700 }}>{thread}</div>
  </div>
);

// ── slide 10 BEYOND THE BOOK card ───────────────────────────────────────

const WildCard: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  body: string;
  color: string;
}> = ({ icon, title, subtitle, body, color }) => (
  <div
    style={{
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 14,
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      boxShadow: `0 0 24px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={48} height={48} />
    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>{title}</div>
    <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color, fontWeight: 700 }}>
      {subtitle}
    </div>
    <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{body}</div>
  </div>
);

// ── ConceptTag + QARow + NextTopicHero ──────────────────────────────────

const ConceptTag: React.FC<{ icon: string; term: string; def: string }> = ({ icon, term, def }) => (
  <div
    style={{
      display: "flex",
      gap: 14,
      padding: "16px 18px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 12,
      alignItems: "flex-start",
    }}
  >
    <Icon icon={icon} width={30} height={30} color="var(--accent)" />
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>{term}</div>
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{def}</div>
    </div>
  </div>
);

const QARow: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div
    style={{
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 12,
    }}
  >
    <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
      <Icon icon="mdi:help-circle-outline" width={22} height={22} color="var(--microtask)" />
      <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>{q}</div>
    </div>
    <div style={{ display: "flex", gap: 12 }}>
      <Icon icon="mdi:arrow-right-thick" width={22} height={22} color="var(--sync)" />
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{a}</div>
    </div>
  </div>
);

const NextTopicHero: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", damping: 18 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      padding: 38,
      backgroundColor: "var(--panel)",
      border: "2px solid var(--microtask)",
      borderRadius: 20,
      boxShadow: "0 0 60px rgba(255, 179, 71, 0.28)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--microtask)",
          color: "#0a0e14",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        1.6
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>System Calls</div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      How does a program ask the OS to open a file, read from the disk, or start a new process? Through <b style={hlWarm}>system calls</b>. Meet <b style={hlWarm}>open</b>, <b style={hlWarm}>read</b>, <b style={hlWarm}>write</b>, and <b style={hlWarm}>fork</b> next.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
      {[
        { icon: "mdi:folder-open-outline", label: "open" },
        { icon: "mdi:book-open-outline", label: "read" },
        { icon: "mdi:pencil-outline", label: "write" },
        { icon: "mdi:source-fork", label: "fork" },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            backgroundColor: "rgba(255, 179, 71, 0.12)",
            border: "1px solid rgba(255, 179, 71, 0.45)",
            borderRadius: 999,
          }}
        >
          <Icon icon={c.icon} width={22} height={22} color="var(--microtask)" />
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--microtask)", fontFamily: "Roboto Mono, monospace" }}>
            {c.label}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1T15ProcessesAndThreadsDeck: Deck = {
  title: "Processes and Threads",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.5 · Processes and Threads",
  topicCode: "1.5",
  topicTitle: "Processes and Threads",
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
              1.5 <span style={{ color: ACCENT }}>Processes</span> and{" "}
              <span style={{ color: "var(--microtask)" }}>Threads</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroProcessThreads />
              </div>
              One whole program is a process. Inside it, tiny units of work called threads run at the same time.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. What is a Process? (verbatim)
    {
      id: "process",
      title: "What is a Process?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.5 Processes and Threads"
          subtitle="Every running program is a process. It gets its own everything."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlBlue}>process</b> is an <b>independent program that is currently being executed by the computer</b>. It has its own <b style={hlBlue}>memory space</b> <b style={hlBlue}>CPU time</b>, and other <b style={hlBlue}>resources (such as files or network connections)</b>. Processes are <b style={hlBlue}>isolated from one another</b> to ensure <b>stability and security</b>; a problem in one process generally does not affect another.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:application-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                WHAT EVERY PROCESS OWNS
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <ProcessPropCard
                  icon="mdi:memory"
                  label="Memory space"
                  color="var(--sync)"
                  body="Its own private area of RAM."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <ProcessPropCard
                  icon="mdi:chip"
                  label="CPU time"
                  color="var(--accent)"
                  body="A share of the processor's attention."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <ProcessPropCard
                  icon="mdi:file-multiple-outline"
                  label="Resources"
                  color="var(--microtask)"
                  body="Files, network connections, and other handles."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <ProcessPropCard
                  icon="mdi:shield-lock-outline"
                  label="Isolation"
                  color="var(--task)"
                  body="A crash in one process does not take down the others."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Process isolation deep dive
    {
      id: "process-isolation",
      title: "Why isolation matters",
      render: (
        <SlideLayout
          title="Isolation keeps the system stable and secure"
          subtitle="One misbehaving app cannot poison the whole computer."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Processes are <b style={hlBlue}>isolated from one another</b> to ensure <b>stability and security</b>; a problem in one process generally does not affect another.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 22, alignItems: "center" }}>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(63, 185, 80, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Icon icon="mdi:file-word-outline" width={36} height={36} color="var(--sync)" />
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--sync)" }}>Word</div>
                </div>
                <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>
                  Own memory. Own files. Runs happily.
                </div>
              </div>
              <div
                style={{
                  padding: 12,
                  backgroundColor: "var(--panel)",
                  border: "2px dashed var(--warn)",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon icon="mdi:wall" width={30} height={30} color="var(--warn)" />
                <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--warn)", fontWeight: 800 }}>
                  ISOLATED
                </div>
              </div>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--task)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(255, 121, 198, 0.25)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Icon icon="mdi:web" width={36} height={36} color="var(--task)" />
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--task)" }}>Browser</div>
                </div>
                <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>
                  Own memory. Own files. If it crashes, Word keeps going.
                </div>
              </div>
            </div>
            <div style={{ fontSize: 15, color: "var(--muted)", textAlign: "center", lineHeight: 1.6, marginTop: 6 }}>
              Two processes, two separate worlds. Their memory and resources never mix. This is the OS's promise of <b style={hlBlue}>stability and security</b>.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 4. What is a Thread? (verbatim)
    {
      id: "thread",
      title: "What is a Thread?",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="What is a Thread?"
          subtitle="The tiniest unit of work. A process has one or more of them."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlWarm}>thread</b>, on the other hand, is the <b style={hlWarm}>smallest unit of execution within a process</b>. Multiple threads can exist inside a single process, each performing a different task. All threads in the same process <b style={hlWarm}>share the same memory and resources</b>, but <b style={hlWarm}>operate independently</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:vector-line" width={22} height={22} color="var(--microtask)" />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--microtask)", fontWeight: 800 }}>
                THREADS INSIDE ONE PROCESS
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <ProcessPropCard
                icon="mdi:vector-arrange-below"
                label="Smallest unit"
                color="var(--microtask)"
                body="A thread is the smallest unit of execution inside a process."
              />
              <ProcessPropCard
                icon="mdi:share-variant-outline"
                label="Shared memory"
                color="var(--sync)"
                body="All threads in one process share the same memory and resources."
              />
              <ProcessPropCard
                icon="mdi:cog-refresh-outline"
                label="Independent"
                color="var(--accent)"
                body="Each thread performs a different task and runs on its own."
              />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Hand-drawn Process vs Thread diagram
    {
      id: "diagram-hand-drawn",
      title: "Process vs Thread · hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Process vs Thread, hand-drawn"
          subtitle="Two isolated processes on the left. One process with three shared-memory threads on the right."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.5-process-vs-thread.svg"
              alt="Hand-drawn Process vs Thread diagram"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 140 }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 40px rgba(88, 166, 255, 0.15))",
              }}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 6. Web browser example (verbatim + visual)
    {
      id: "web-browser-example",
      title: "Example · Web Browser",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: a Web Browser"
          subtitle="The book's real example: one process, three threads, all working together."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  Consider a web browser:
                </p>
                <ul style={{ paddingLeft: 22, marginTop: 10, fontSize: 18, color: "var(--text)", lineHeight: 1.6 }}>
                  <li>The entire browser application is one <b style={hlBlue}>process</b>.</li>
                  <li>
                    Within this process, different <b style={hlWarm}>threads</b> are responsible for:
                    <ul style={{ paddingLeft: 22, marginTop: 6 }}>
                      <li>One thread is loading and rendering a webpage.</li>
                      <li>The second thread is playing audio or video content.</li>
                      <li>Another thread is downloading files in the background.</li>
                    </ul>
                  </li>
                </ul>
                <p style={{ ...bookQuoteStyle, fontSize: 18, marginTop: 14, color: "var(--muted)" }}>
                  By using the above multiple threads, the browser can continue loading new content while playing a video, without making the user wait for one task to finish before starting another.
                </p>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <BrowserThreadsVisual />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 7. Multithreading definition
    {
      id: "multithreading",
      title: "Multithreading",
      render: (
        <SlideLayout
          title="Multithreading"
          subtitle="An OS technique: one process, many threads, all running at the same time."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlBlue}>Multithreading</b> is an operating system technique that allows a <b>single process to perform multiple tasks at the same time</b> by dividing its work into smaller units called <b style={hlWarm}>threads</b>.
            </p>
            <p style={bookQuoteStyle}>
              Each thread runs <b style={hlBlue}>independently</b> but <b style={hlBlue}>shares the same memory and resources</b> of the process, enabling <b>faster execution</b>, <b>better responsiveness</b>, and <b>efficient use of system resources</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:cog-refresh-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE WINS OUT OF THE BOX
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--sync)", borderRadius: 12, boxShadow: "0 0 22px rgba(63, 185, 80, 0.22)" }}>
                  <Icon icon="mdi:rocket-launch-outline" width={40} height={40} color="var(--sync)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--sync)", marginTop: 8 }}>Faster</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Faster execution.</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--microtask)", borderRadius: 12, boxShadow: "0 0 22px rgba(255, 179, 71, 0.22)" }}>
                  <Icon icon="mdi:cursor-move" width={40} height={40} color="var(--microtask)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--microtask)", marginTop: 8 }}>Responsive</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Better responsiveness.</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--task)", borderRadius: 12, boxShadow: "0 0 22px rgba(255, 121, 198, 0.22)" }}>
                  <Icon icon="mdi:scale-balance" width={40} height={40} color="var(--task)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--task)", marginTop: 8 }}>Efficient</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Efficient use of system resources.</div>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 8. 4 Benefits grid (verbatim)
    {
      id: "benefits",
      title: "Benefits of Multithreading",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Benefits of Multithreading"
          subtitle="Multithreading offers several advantages. Here are the four most important."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, height: "100%" }}>
            <StaggerItem style={{ height: "100%" }}>
              <BenefitCard
                number="1"
                icon="mdi:rocket-launch-outline"
                title="Enhanced Performance"
                color="var(--sync)"
                body="Tasks can be divided into multiple threads and executed in parallel, allowing complex operations to complete more quickly and improving overall system efficiency."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <BenefitCard
                number="2"
                icon="mdi:cursor-move"
                title="Improved Responsiveness"
                color="var(--microtask)"
                body="Applications remain responsive even when one thread is busy with a specific task."
                example="A word processor enables continuous typing while another thread checks spelling in the background."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <BenefitCard
                number="3"
                icon="mdi:multicast"
                title="Support for Concurrent (parallel) Operations"
                color="var(--task)"
                body="Multiple tasks can progress during the same period, which is particularly important in applications such as games, video editing, and real-time communication tools."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <BenefitCard
                number="4"
                icon="mdi:scale-balance"
                title="Efficient Use of Resources"
                color="var(--api)"
                body="Threads share the same memory space and resources of their parent process, requiring fewer system resources compared to creating separate processes."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 9. Process vs Thread comparison
    {
      id: "compare",
      title: "Process vs Thread comparison",
      render: (
        <SlideLayout
          title="Process vs Thread"
          subtitle="Same idea of running work. Very different scope and cost."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 1fr",
                gap: 12,
                padding: "10px 16px",
                fontSize: 13,
                letterSpacing: 2,
                fontWeight: 800,
                color: "var(--muted)",
                borderBottom: "2px solid var(--panel-border)",
              }}
            >
              <div>PROPERTY</div>
              <div style={{ color: "var(--accent)" }}>PROCESS</div>
              <div style={{ color: "var(--microtask)" }}>THREAD</div>
            </div>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StaggerItem>
                <CompareRow
                  label="WHAT IT IS"
                  process="An independent program that is currently being executed"
                  thread="The smallest unit of execution within a process"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="MEMORY"
                  process="Its own memory space"
                  thread="Shares the same memory and resources as other threads in the process"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="RESOURCES"
                  process="Its own files and network connections"
                  thread="Uses the parent process's resources"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="ISOLATION"
                  process="Isolated from other processes for stability and security"
                  thread="Runs independently but shares state with sibling threads"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="COST"
                  process="Heavier: needs its own memory + resources"
                  thread="Lighter: reuses the parent process's memory + resources"
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK: real-world multithreading
    {
      id: "beyond-book",
      title: "Where multithreading shows up in the wild",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Multithreading you already meet every day"
          accent={ACCENT}
        >
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book gives you the browser example. Here are four more places threads quietly do all the work.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:google-chrome"
                title="Chrome"
                subtitle="One process per tab, many threads"
                body="Each tab is its own process (isolation), and each tab uses threads for rendering, network, and JavaScript."
                color="var(--sync)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:vlc"
                title="VLC media player"
                subtitle="Video decoding on multiple threads"
                body="One thread reads the file, another decodes video frames, another decodes audio, another draws to the screen."
                color="var(--microtask)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="mdi:image-edit-outline"
                title="Photo editors"
                subtitle="Filters on many threads at once"
                body="Applying a blur to a 100 MP photo splits the pixels across all your CPU cores, one thread per chunk."
                color="var(--task)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="mdi:controller-classic"
                title="Video games"
                subtitle="Physics, AI, graphics in parallel"
                body="One thread runs physics, one runs enemy AI, one runs the renderer, one streams music. All at 60+ frames per second."
                color="var(--warn)"
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. Important Concepts
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout title="Important Concepts from 1.5" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:application-outline"
                term="Process"
                def="An independent program that is currently being executed by the computer. It has its own memory space, CPU time, and other resources. Processes are isolated from one another to ensure stability and security."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:vector-line"
                term="Thread"
                def="The smallest unit of execution within a process. Multiple threads can exist inside a single process, each performing a different task. All threads in the same process share the same memory and resources, but operate independently."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cog-refresh-outline"
                term="Multithreading"
                def="An operating system technique that allows a single process to perform multiple tasks at the same time by dividing its work into smaller units called threads."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:rocket-launch-outline"
                term="Enhanced Performance"
                def="Tasks can be divided into multiple threads and executed in parallel, allowing complex operations to complete more quickly and improving overall system efficiency."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cursor-move"
                term="Improved Responsiveness"
                def="Applications remain responsive even when one thread is busy with a specific task. Example: a word processor enables continuous typing while another thread checks spelling in the background."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:scale-balance"
                term="Efficient Use of Resources"
                def="Threads share the same memory space and resources of their parent process, requiring fewer system resources compared to creating separate processes."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Definitions and Important Questions
    {
      id: "questions",
      title: "Definitions and Important Questions",
      render: (
        <SlideLayout title="Definitions and Important Questions" accent="var(--microtask)">
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <QARow
                q="Define a process."
                a="A process is an independent program that is currently being executed by the computer. It has its own memory space CPU time, and other resources (such as files or network connections). Processes are isolated from one another to ensure stability and security; a problem in one process generally does not affect another."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define a thread."
                a="A thread is the smallest unit of execution within a process. Multiple threads can exist inside a single process, each performing a different task. All threads in the same process share the same memory and resources, but operate independently."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define multithreading."
                a="Multithreading is an operating system technique that allows a single process to perform multiple tasks at the same time by dividing its work into smaller units called threads."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="List the four benefits of multithreading."
                a="Enhanced Performance, Improved Responsiveness, Support for Concurrent (parallel) Operations, Efficient Use of Resources."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does the book's web browser illustrate processes and threads?"
                a="The entire browser application is one process. Inside it, one thread loads and renders a webpage, a second thread plays audio or video content, and another thread downloads files in the background. Together they let the browser keep working without waiting on any single task."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Coming up next: 1.6 System Calls
    {
      id: "next-topic",
      title: "Next up: 1.6 System Calls",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Coming up next" accent="var(--microtask)">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <NextTopicHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
