/**
 * Class 10 CS · Chapter 1 · Topic 1.6 · System Calls
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, DO-YOU-KNOW box, and key-point sentence is copied
 * EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.6-system-calls.md`.
 * Real-world examples are labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 13 slides. Animated syscall flow visual + hand-drawn diagram slide.
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

// ── Hero: 3-layer stack (user program → kernel → hardware) with syscall arrows

const HeroSyscallStack: React.FC = () => {
  const layers = [
    { label: "USER PROGRAM", icon: "mdi:application-outline", color: "var(--sync)", body: "text editor, browser, music player" },
    { label: "KERNEL", icon: "mdi:cog-sync-outline", color: "var(--accent)", body: "open · read · write · fork" },
    { label: "HARDWARE", icon: "mdi:chip", color: "var(--microtask)", body: "hard drive, screen, keyboard" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {layers.map((l, i) => (
        <div key={l.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.2, type: "spring", damping: 16 }}
            style={{
              width: 480,
              padding: "14px 20px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${l.color}`,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: `0 0 24px ${l.color}44`,
            }}
          >
            <Icon icon={l.icon} width={36} height={36} color={l.color} />
            <div>
              <div style={{ fontSize: 14, letterSpacing: 2.5, color: l.color, fontWeight: 800 }}>
                {l.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{l.body}</div>
            </div>
          </motion.div>
          {i < layers.length - 1 && (
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, delay: 0.6 + i * 0.2 }}
              style={{ display: "flex", alignItems: "center", color: "var(--muted)" }}
            >
              <Icon icon="mdi:arrow-down-thick" width={26} height={26} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── slide 3 property cards (why syscalls exist) ─────────────────────────

const WhyCard: React.FC<{ icon: string; label: string; body: string; color: string }> = ({
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

// ── slide 4 save-file flow ──────────────────────────────────────────────

const SaveFileFlow: React.FC = () => {
  const nodes = [
    { icon: "mdi:file-document-edit-outline", label: "Text editor", color: "var(--sync)", sub: "user clicks Save" },
    { icon: "mdi:cog-sync-outline", label: "system call", color: "var(--accent)", sub: "write() to OS" },
    { icon: "mdi:harddisk", label: "Hard drive", color: "var(--microtask)", sub: "data safely stored" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
      {nodes.map((n, i) => (
        <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.22, type: "spring", damping: 18 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "18px 22px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${n.color}`,
              borderRadius: 14,
              minWidth: 160,
              boxShadow: `0 0 24px ${n.color}33`,
            }}
          >
            <Icon icon={n.icon} width={54} height={54} color={n.color} />
            <div style={{ fontSize: 17, fontWeight: 800, color: n.color, textAlign: "center" }}>
              {n.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>{n.sub}</div>
          </motion.div>
          {i < nodes.length - 1 && (
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, delay: 0.4 + i * 0.2 }}
              style={{ color: "var(--muted)" }}
            >
              <Icon icon="mdi:arrow-right-thick" width={40} height={40} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── slide 6 syscall type card ───────────────────────────────────────────

const SyscallCard: React.FC<{
  syscall: string;
  icon: string;
  description: string;
  example: string;
  color: string;
}> = ({ syscall, icon, description, example, color }) => (
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
      <Icon icon={icon} width={40} height={40} color={color} />
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color,
          fontFamily: "Roboto Mono, monospace",
          letterSpacing: 1,
        }}
      >
        {syscall}
      </div>
    </div>
    <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{description}</div>
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
  </div>
);

// ── slide 7 animated syscall lifecycle ──────────────────────────────────

const SyscallLifecycleAnim: React.FC = () => {
  const steps = [
    { color: "var(--sync)", label: "1. Program calls syscall", detail: "e.g. write(\"myfile.txt\", data)", icon: "mdi:application-outline" },
    { color: "var(--accent)", label: "2. Kernel takes over", detail: "kernel checks permission + parameters", icon: "mdi:cog-sync-outline" },
    { color: "var(--microtask)", label: "3. Hardware acts", detail: "kernel writes bytes to the storage drive", icon: "mdi:harddisk" },
    { color: "var(--task)", label: "4. Result returns", detail: "kernel returns success/failure to program", icon: "mdi:check-circle-outline" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.2, type: "spring", damping: 18 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 16px",
            backgroundColor: "var(--panel)",
            border: `1px solid ${s.color}55`,
            borderRadius: 10,
          }}
        >
          <Icon icon={s.icon} width={32} height={32} color={s.color} />
          <div style={{ minWidth: 220, fontSize: 15, fontWeight: 800, color: s.color, letterSpacing: 0.5 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 14, color: "var(--muted)", fontFamily: "Roboto Mono, monospace" }}>
            {s.detail}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── slide 9 DO YOU KNOW ─────────────────────────────────────────────────

const DoYouKnow: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "22px 26px",
      backgroundColor: "rgba(88, 166, 255, 0.08)",
      border: "1.5px solid rgba(88, 166, 255, 0.4)",
      borderRadius: 14,
      display: "flex",
      alignItems: "flex-start",
      gap: 20,
    }}
  >
    <Icon icon="mdi:lightbulb-on-outline" width={44} height={44} color="var(--accent)" />
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 14,
          letterSpacing: 3,
          color: "var(--accent)",
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        DO YOU KNOW?
      </div>
      <div style={{ fontSize: 22, lineHeight: 1.55, color: "var(--text)" }}>{children}</div>
    </div>
  </div>
);

// ── slide 10 BEYOND THE BOOK: code snippet cards ────────────────────────

const CodeExampleCard: React.FC<{
  os: string;
  osIcon: string;
  osColor: string;
  language: string;
  code: string;
  hint: string;
}> = ({ os, osIcon, osColor, language, code, hint }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 20,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${osColor}`,
      borderRadius: 14,
      boxShadow: `0 0 22px ${osColor}22`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon icon={osIcon} width={36} height={36} />
      <div style={{ fontSize: 20, fontWeight: 800, color: osColor }}>{os}</div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2,
          color: "var(--muted)",
          fontWeight: 700,
          padding: "3px 8px",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 4,
        }}
      >
        {language}
      </div>
    </div>
    <pre
      style={{
        margin: 0,
        padding: "12px 14px",
        backgroundColor: "#0a0e14",
        border: "1px solid var(--panel-border)",
        borderRadius: 8,
        fontFamily: "Roboto Mono, monospace",
        fontSize: 13,
        color: "var(--text)",
        lineHeight: 1.55,
        whiteSpace: "pre-wrap",
      }}
    >
      {code}
    </pre>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginTop: "auto" }}>
      {hint}
    </div>
  </div>
);

// ── ConceptTag, QARow, NextTopicHero ────────────────────────────────────

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
        1.7
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>File System</div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      How does the OS organize millions of files into a neat, findable tree? Meet <b style={hlWarm}>files</b>, <b style={hlWarm}>folders</b>, and <b style={hlWarm}>metadata</b> next.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
      {[
        { icon: "mdi:file-outline", label: "Files" },
        { icon: "mdi:folder-outline", label: "Folders" },
        { icon: "mdi:tag-outline", label: "Metadata" },
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
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--microtask)" }}>{c.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1T16SystemCallsDeck: Deck = {
  title: "System Calls",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.6 · System Calls",
  topicCode: "1.6",
  topicTitle: "System Calls",
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
              1.6 <span style={{ color: ACCENT }}>System Calls</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <HeroSyscallStack />
              </div>
              The safe bridge between your program and the hardware.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. What is a System Call? (verbatim)
    {
      id: "definition",
      title: "What is a System Call?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.6 System Calls"
          subtitle="A program says please, and the OS does the work."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlBlue}>system call</b> is a request made by a program to the operating system to perform a specific task that the <b>program cannot do directly</b>. They act as a <b style={hlBlue}>bridge</b> between <b style={hlBlue}>user programs</b> and the <b style={hlBlue}>kernel</b>, allowing applications to access hardware and core OS functions <b>safely</b>. Without system calls, programs that directly control hardware can be <b style={{ color: "var(--warn)" }}>unsafe and complex</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:bridge" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THE BRIDGE, ONE ROW AT A TIME
              </span>
            </div>
            <HeroSyscallStack />
          </div>
        </SlideLayout>
      ),
    },

    // 3. Why System Calls exist
    {
      id: "why",
      title: "Why system calls exist",
      render: (
        <SlideLayout
          title="Why we need system calls"
          subtitle="Direct hardware access from user programs would be unsafe and complex."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Without system calls, programs that directly control hardware can be <b style={{ color: "var(--warn)" }}>unsafe and complex</b>. System calls act as a <b style={hlBlue}>bridge between user programs and the kernel</b>, allowing applications to access hardware and core OS functions <b style={hlBlue}>safely</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:shield-check-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE THINGS SYSTEM CALLS BUY YOU
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem style={{ height: "100%" }}>
                <WhyCard
                  icon="mdi:shield-lock-outline"
                  label="Safety"
                  color="var(--sync)"
                  body="The kernel is the only code allowed to touch hardware. User programs cannot damage the system by accident."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <WhyCard
                  icon="mdi:vector-arrange-below"
                  label="Simplicity"
                  color="var(--accent)"
                  body="Programs use one clean interface (the syscall). No need to know the details of every hard drive, printer, or GPU."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <WhyCard
                  icon="mdi:multicast"
                  label="Sharing"
                  color="var(--microtask)"
                  body="Many programs use the same hardware. The kernel coordinates access so no one steps on anyone else."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 4. Save-file example (verbatim)
    {
      id: "save-file-example",
      title: "Example · Save a file",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: saving a file"
          subtitle="You click Save. Behind the scenes, a system call does the work."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              When you save a file in a text editor, the program uses a <b style={hlBlue}>system call</b> to tell the operating system to <b style={hlBlue}>write the data to the storage drive</b> (like a Hard drive).
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:arrow-right-bold-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THE FLOW, LEFT TO RIGHT
              </span>
            </div>
            <SaveFileFlow />
            <div
              style={{
                marginTop: 6,
                padding: "14px 18px",
                backgroundColor: "rgba(88, 166, 255, 0.08)",
                border: "1px dashed var(--accent)",
                borderRadius: 10,
                fontSize: 15,
                color: "var(--muted)",
                lineHeight: 1.55,
              }}
            >
              The text editor never touches the hard drive itself. It just asks the OS with a syscall. The OS handles the physical write and reports back.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Hand-drawn diagram
    {
      id: "diagram-hand-drawn",
      title: "Syscall flow · hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="System Calls: The Bridge, hand-drawn"
          subtitle="User program on top. Hardware at the bottom. Kernel is the only path between them."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.6-system-calls.svg"
              alt="Hand-drawn system call flow diagram"
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

    // 6. Types of System Calls (all 4 verbatim in a 2x2 grid)
    {
      id: "types",
      title: "Types of System Calls",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Types of System Calls"
          subtitle="The main types of system calls include four you should know."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, height: "100%" }}>
            <StaggerItem style={{ height: "100%" }}>
              <SyscallCard
                syscall="open"
                icon="mdi:folder-open-outline"
                color="var(--sync)"
                description="Opens a file for reading or writing."
                example="Opening a music file to play."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <SyscallCard
                syscall="read"
                icon="mdi:book-open-outline"
                color="var(--accent)"
                description="Retrieves data from a file or input device."
                example="Reading text from a document."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <SyscallCard
                syscall="write"
                icon="mdi:pencil-outline"
                color="var(--microtask)"
                description="Sends data to a file or output device."
                example="Saving an image to the computer."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <SyscallCard
                syscall="fork"
                icon="mdi:source-fork"
                color="var(--task)"
                description="Creates a new process by duplicating an existing one."
                example="Opening a new browser tab, where the OS may use fork to create another process."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 7. Syscall lifecycle animated
    {
      id: "lifecycle",
      title: "The four-step syscall lifecycle",
      render: (
        <SlideLayout
          title="What happens on every syscall"
          subtitle="Four steps, every time a program asks the OS for something."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)" }}>
              A system call is a round-trip. The program asks. The kernel does the risky work. The kernel returns the result. The program keeps going.
            </p>
            <SyscallLifecycleAnim />
          </div>
        </SlideLayout>
      ),
    },

    // 8. DO YOU KNOW
    {
      id: "do-you-know",
      title: "DO YOU KNOW · Linux vs Windows syscall counts",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Not just four. Hundreds. Thousands, even."
          accent={ACCENT}
        >
          <DoYouKnow>
            <b style={{ color: "var(--accent)" }}>Linux</b> and <b style={{ color: "var(--accent)" }}>macOS</b> have a <b>few hundred</b> system calls, while <b style={{ color: "var(--accent)" }}>Windows</b> uses nearly <b>2,000</b>. These calls handle everything from opening files to running apps and showing graphics in the background while you work.
            <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
              <div
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Icon icon="logos:linux-tux" width={44} height={44} />
                <div>
                  <div style={{ fontSize: 14, letterSpacing: 2, color: "var(--sync)", fontWeight: 800 }}>LINUX + macOS</div>
                  <div style={{ fontSize: 22, color: "var(--text)", fontWeight: 800, fontFamily: "Roboto Mono, monospace" }}>
                    a few hundred
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "16px 20px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--microtask)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <Icon icon="logos:microsoft-windows-icon" width={44} height={44} />
                <div>
                  <div style={{ fontSize: 14, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800 }}>WINDOWS</div>
                  <div style={{ fontSize: 22, color: "var(--text)", fontWeight: 800, fontFamily: "Roboto Mono, monospace" }}>
                    ~ 2,000
                  </div>
                </div>
              </div>
            </div>
          </DoYouKnow>
        </SlideLayout>
      ),
    },

    // 9. BEYOND THE BOOK: real syscall code examples
    {
      id: "beyond-book",
      title: "Real syscalls in code",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="How syscalls look in real code"
          accent={ACCENT}
        >
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book names them. Here is what they actually look like in code on your laptop.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <StaggerItem style={{ height: "100%" }}>
              <CodeExampleCard
                os="Linux · macOS"
                osIcon="logos:linux-tux"
                osColor="var(--sync)"
                language="C"
                code={`int fd = open("photo.jpg", O_RDONLY);
char buf[1024];
read(fd, buf, 1024);
write(1, buf, 1024);   // 1 = screen
close(fd);`}
                hint="Four syscalls: open, read, write, close. Same names as in the book. Runs on any Unix."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <CodeExampleCard
                os="Windows"
                osIcon="logos:microsoft-windows-icon"
                osColor="var(--microtask)"
                language="Win32 API"
                code={`HANDLE h = CreateFile("photo.jpg",
  GENERIC_READ, 0, NULL,
  OPEN_EXISTING, 0, NULL);
DWORD n;
ReadFile(h, buf, 1024, &n, NULL);
CloseHandle(h);`}
                hint="Same idea, wrapped in the Win32 API. Under the hood, similar syscalls run in the Windows kernel."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <CodeExampleCard
                os="Python (all OS)"
                osIcon="logos:python"
                osColor="var(--accent)"
                language="Python"
                code={`with open("photo.jpg", "rb") as f:
    data = f.read()

print(len(data))`}
                hint="Python's `open()` and `f.read()` call the same OS syscalls behind the scenes. High-level, but the plumbing is identical."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <CodeExampleCard
                os="Node.js"
                osIcon="logos:nodejs-icon"
                osColor="var(--task)"
                language="JavaScript"
                code={`import { readFile } from "fs/promises";

const data = await readFile("photo.jpg");
console.log(data.length);`}
                hint="Node.js `readFile` also uses open + read + close syscalls internally, asynchronously so the main thread stays free."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 10. Important Concepts
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout title="Important Concepts from 1.6" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:bridge"
                term="System Call"
                def="A request made by a program to the operating system to perform a specific task that the program cannot do directly. Acts as a bridge between user programs and the kernel."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:folder-open-outline"
                term="open"
                def="Opens a file for reading or writing. Example: Opening a music file to play."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:book-open-outline"
                term="read"
                def="Retrieves data from a file or input device. Example: Reading text from a document."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:pencil-outline"
                term="write"
                def="Sends data to a file or output device. Example: Saving an image to the computer."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:source-fork"
                term="fork"
                def="Creates a new process by duplicating an existing one. Example: Opening a new browser tab, where the OS may use fork to create another process."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:shield-check-outline"
                term="Safe Access"
                def="Without system calls, programs that directly control hardware can be unsafe and complex. System calls allow applications to access hardware and core OS functions safely."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. Definitions and Important Questions
    {
      id: "questions",
      title: "Definitions and Important Questions",
      render: (
        <SlideLayout title="Definitions and Important Questions" accent="var(--microtask)">
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <QARow
                q="Define a system call."
                a="A system call is a request made by a program to the operating system to perform a specific task that the program cannot do directly. They act as a bridge between user programs and the kernel, allowing applications to access hardware and core OS functions safely."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Why are system calls needed?"
                a="Without system calls, programs that directly control hardware can be unsafe and complex. System calls provide a safe, simple interface between user programs and the kernel."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Give one example of a system call from real life."
                a="When you save a file in a text editor, the program uses a system call to tell the operating system to write the data to the storage drive (like a Hard drive)."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="List the four main types of system calls with a short description."
                a="open (opens a file for reading or writing), read (retrieves data from a file or input device), write (sends data to a file or output device), fork (creates a new process by duplicating an existing one)."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How many system calls do Linux, macOS, and Windows have?"
                a="Linux and macOS have a few hundred system calls, while Windows uses nearly 2,000. These calls handle everything from opening files to running apps and showing graphics in the background while you work."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Coming up next: 1.7 File System
    {
      id: "next-topic",
      title: "Next up: 1.7 File System",
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
