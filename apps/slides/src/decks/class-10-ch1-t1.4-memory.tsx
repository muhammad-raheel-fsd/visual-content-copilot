/**
 * Class 10 CS · Chapter 1 · Topic 1.4 · Memory
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, DO-YOU-KNOW box, and key-point sentence is copied
 * EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.4-memory.md`.
 * Real-world scenarios and Tid-Bytes are clearly labelled as extensions of the book.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 13 slides. Animated RAM fill + virtual memory spillover on the comparison slide.
 * Hand-drawn RAM vs Virtual diagram on slide 4.
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

// ── Hero visual: RAM stick with pulsing memory cells ─────────────────────

const HeroRamStack: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", damping: 16 }}
      style={{
        width: 520,
        height: 90,
        borderRadius: 14,
        backgroundColor: "var(--panel)",
        border: "2px solid var(--accent)",
        display: "grid",
        gridTemplateColumns: "60px repeat(8, 1fr) 60px",
        gap: 6,
        padding: 8,
        boxShadow: "0 0 50px rgba(88, 166, 255, 0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Icon icon="mdi:chip" width={30} height={30} color="var(--accent)" />
      </div>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ delay: 0.4 + i * 0.06, duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            backgroundColor: "rgba(88, 166, 255, 0.15)",
            border: "1px solid var(--accent)",
            borderRadius: 6,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 800, letterSpacing: 1 }}>RAM</div>
      </div>
    </motion.div>
    <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
      {[
        { icon: "mdi:speedometer", label: "FAST" },
        { icon: "mdi:timer-sand", label: "TEMPORARY" },
        { icon: "mdi:power-plug-off-outline", label: "GONE WHEN OFF" },
      ].map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + i * 0.15, type: "spring", damping: 18 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "rgba(88, 166, 255, 0.12)",
            border: "1px solid rgba(88, 166, 255, 0.4)",
          }}
        >
          <Icon icon={p.icon} width={18} height={18} color="var(--accent)" />
          <span style={{ fontSize: 12, letterSpacing: 2, color: "var(--accent)", fontWeight: 800 }}>
            {p.label}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

// ── slide 2 property cards ────────────────────────────────────────────────

const MemoryPropertyCard: React.FC<{ icon: string; label: string; body: string; color: string }> = ({
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
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={42} height={42} color={color} />
    <div style={{ fontSize: 20, fontWeight: 800, color }}>{label}</div>
    <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{body}</div>
  </div>
);

// ── slide 3: RAM Word doc example visual ────────────────────────────────

const WordDocIntoRam: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "22px 26px",
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--sync)",
        borderRadius: 14,
        boxShadow: "0 0 30px rgba(63, 185, 80, 0.28)",
      }}
    >
      <Icon icon="mdi:file-word-outline" width={70} height={70} color="var(--sync)" />
      <div style={{ fontSize: 17, fontWeight: 800, color: "var(--sync)" }}>Word document</div>
    </motion.div>
    <motion.div
      animate={{ x: [0, 8, 0] }}
      transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
      style={{ color: "var(--muted)" }}
    >
      <Icon icon="mdi:arrow-right-thick" width={48} height={48} />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "22px 26px",
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--accent)",
        borderRadius: 14,
        boxShadow: "0 0 30px rgba(88, 166, 255, 0.32)",
      }}
    >
      <Icon icon="mdi:memory" width={70} height={70} color="var(--accent)" />
      <div style={{ fontSize: 17, fontWeight: 800, color: "var(--accent)" }}>RAM</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>ready for the CPU</div>
    </motion.div>
    <motion.div
      animate={{ x: [0, 8, 0] }}
      transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut", repeat: Infinity }}
      style={{ color: "var(--muted)" }}
    >
      <Icon icon="mdi:arrow-right-thick" width={48} height={48} />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "22px 26px",
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--microtask)",
        borderRadius: 14,
        boxShadow: "0 0 30px rgba(255, 179, 71, 0.32)",
      }}
    >
      <Icon icon="mdi:chip" width={70} height={70} color="var(--microtask)" />
      <div style={{ fontSize: 17, fontWeight: 800, color: "var(--microtask)" }}>CPU</div>
      <div style={{ fontSize: 12, color: "var(--muted)" }}>works right away</div>
    </motion.div>
  </div>
);

// ── slide 5: storage type cards ──────────────────────────────────────────

const StorageTypeCard: React.FC<{ icon: string; label: string; color: string; sample: string }> = ({
  icon,
  label,
  color,
  sample,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "18px 12px",
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 22px ${color}22`,
    }}
  >
    <Icon icon={icon} width={44} height={44} color={color} />
    <div style={{ fontSize: 16, fontWeight: 800, color, textAlign: "center" }}>{label}</div>
    <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>{sample}</div>
  </div>
);

// ── slide 6: virtual memory spillover flow ───────────────────────────────

const VirtualMemoryFlow: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, height: "100%" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 16, alignItems: "center" }}>
      <div
        style={{
          padding: 18,
          backgroundColor: "var(--panel)",
          border: "1.5px solid var(--accent)",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Icon icon="mdi:memory" width={30} height={30} color="var(--accent)" />
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--accent)" }}>RAM (full)</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {["Browser", "Music", "Doc", "Chat", "Video", "Editor"].map((app, i) => (
            <div
              key={app}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                backgroundColor: i === 5 ? "rgba(255, 179, 71, 0.14)" : "rgba(88, 166, 255, 0.12)",
                border: i === 5 ? "1px dashed var(--microtask)" : "1px solid rgba(88, 166, 255, 0.35)",
                borderRadius: 6,
                color: i === 5 ? "var(--microtask)" : "var(--accent)",
                fontWeight: 700,
              }}
            >
              {app}
            </div>
          ))}
        </div>
      </div>
      <motion.div
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "var(--microtask)",
          gap: 4,
        }}
      >
        <Icon icon="mdi:arrow-right-thick" width={40} height={40} />
        <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 800 }}>MOVE</div>
      </motion.div>
      <div
        style={{
          padding: 18,
          backgroundColor: "var(--panel)",
          border: "1.5px solid var(--microtask)",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Icon icon="mdi:harddisk" width={30} height={30} color="var(--microtask)" />
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--microtask)" }}>
            Storage · Virtual Memory
          </div>
        </div>
        <div
          style={{
            padding: "12px 14px",
            backgroundColor: "rgba(255, 179, 71, 0.12)",
            border: "1px dashed var(--microtask)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--microtask)",
            fontWeight: 700,
          }}
        >
          Editor (less active) parked here until user needs it again
        </div>
      </div>
    </div>
  </div>
);

// ── slide 8: RAM vs Virtual Memory comparison table ──────────────────────

const CompareRow: React.FC<{ label: string; ram: string; vm: string }> = ({ label, ram, vm }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "160px 1fr 1fr",
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
    <div style={{ fontSize: 16, color: "var(--accent)", fontWeight: 700 }}>{ram}</div>
    <div style={{ fontSize: 16, color: "var(--microtask)", fontWeight: 700 }}>{vm}</div>
  </div>
);

// ── DO YOU KNOW callout ──────────────────────────────────────────────────

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

// ── slide 10 BEYOND THE BOOK: real RAM sizes ─────────────────────────────

const DeviceRamCard: React.FC<{ icon: string; label: string; ram: string; color: string }> = ({
  icon,
  label,
  ram,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "18px 12px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 12,
    }}
  >
    <Icon icon={icon} width={44} height={44} color={color} />
    <div style={{ fontSize: 14, fontWeight: 800, color, textAlign: "center" }}>{label}</div>
    <div
      style={{
        fontSize: 15,
        color: "var(--text)",
        fontWeight: 800,
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      {ram}
    </div>
  </div>
);

// ── Concept tag + Q&A row + Next preview ─────────────────────────────────

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
        1.5
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>Processes and Threads</div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      A process is one whole program. A <b style={hlWarm}>thread</b> is the smallest unit of work inside it. How do multiple threads inside one process share memory and get things done at the same time? Coming up next.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
      {[
        { icon: "mdi:application-outline", label: "Process" },
        { icon: "mdi:vector-line", label: "Thread" },
        { icon: "mdi:cog-refresh-outline", label: "Multithreading" },
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

export const class10Ch1T14MemoryDeck: Deck = {
  title: "Memory",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.4 · Memory",
  topicCode: "1.4",
  topicTitle: "Memory",
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
              1.4 <span style={{ color: ACCENT }}>Memory</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroRamStack />
              </div>
              The CPU's workspace. Fast, temporary, and always right next door.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. What is Memory (verbatim intro)
    {
      id: "intro",
      title: "What is Memory?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.4 Memory"
          subtitle="Every calculation the CPU does needs a place to hold data. That place is memory."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlBlue}>Memory</b> is a fundamental component of a computer system, used to <b>store data and instructions</b> required for processing. It ensures that the CPU can <b>access information quickly</b> during program execution.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:target" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE JOBS OF MEMORY
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem style={{ height: "100%" }}>
                <MemoryPropertyCard
                  icon="mdi:database-outline"
                  label="Store"
                  color="var(--sync)"
                  body="Holds the data and instructions the CPU needs to work on."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <MemoryPropertyCard
                  icon="mdi:speedometer"
                  label="Serve Fast"
                  color="var(--accent)"
                  body="The CPU can access information quickly during program execution."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <MemoryPropertyCard
                  icon="mdi:layers-triple-outline"
                  label="Two Types"
                  color="var(--microtask)"
                  body="Primary Memory (RAM) and Virtual Memory. Both help run programs."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Primary Memory (RAM) + Word doc example
    {
      id: "ram",
      title: "Primary Memory (RAM)",
      render: (
        <SlideLayout
          title="Primary Memory (RAM)"
          subtitle="The main working area. The CPU reads and writes here constantly."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Primary memory, also called <b style={hlBlue}>Random Access Memory (RAM)</b>, is the <b>main working area</b> of a computer. It is a <b>fast storage area</b> where the computer keeps the data and instructions <b>temporarily</b>. Its data is <b>erased when the computer is turned off</b>.
            </p>
            <div
              style={{
                padding: "16px 20px",
                backgroundColor: "rgba(255,255,255,0.03)",
                borderLeft: `3px solid ${ACCENT}`,
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 13, letterSpacing: 2, color: ACCENT, fontWeight: 800, marginBottom: 6 }}>
                EXAMPLE
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 21 }}>
                When you open a Word document, the computer quickly places the program and the document into RAM so the CPU can work on them right away.
              </p>
            </div>
            <WordDocIntoRam />
          </div>
        </SlideLayout>
      ),
    },

    // 4. Hand-drawn RAM vs Virtual Memory diagram
    {
      id: "diagram-hand-drawn",
      title: "Figure 1.2 · RAM vs Virtual Memory hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="RAM vs Virtual Memory, hand-drawn"
          subtitle="Same idea as Figure 1.2 in the book, redrawn on a whiteboard."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.4-ram-vs-virtual.svg"
              alt="Hand-drawn RAM vs Virtual Memory comparison"
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

    // 5. Virtual Memory intro + storage types
    {
      id: "virtual-memory",
      title: "Virtual Memory",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Virtual Memory"
          subtitle="What happens when RAM fills up? The OS borrows space from your storage drive."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              When the RAM is <b style={hlBlue}>full</b>, the operating system uses part of the computer's <b>storage drive</b> (like <b>Hard drives, solid-state drives (SSD), or Non-Volatile Memory Express (NVMe)</b>) as <b style={hlBlue}>virtual memory</b>. This extra space acts like <b>temporary RAM</b>, allowing more programs to run at the same time.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:harddisk" width={22} height={22} color="var(--microtask)" />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--microtask)", fontWeight: 800 }}>
                STORAGE DRIVES THAT CAN BACK VIRTUAL MEMORY
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <StorageTypeCard
                  icon="mdi:harddisk"
                  label="Hard drives"
                  color="var(--sync)"
                  sample="Spinning platters. Old but reliable."
                />
              </StaggerItem>
              <StaggerItem>
                <StorageTypeCard
                  icon="mdi:sd"
                  label="Solid-state drives (SSD)"
                  color="var(--accent)"
                  sample="No moving parts. Much faster than HDDs."
                />
              </StaggerItem>
              <StaggerItem>
                <StorageTypeCard
                  icon="mdi:memory"
                  label="NVMe"
                  color="var(--microtask)"
                  sample="Non-Volatile Memory Express. Fastest storage today."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 6. Virtual Memory trade-off (verbatim)
    {
      id: "virtual-memory-tradeoff",
      title: "Virtual Memory · trade-off",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Virtual Memory has a cost"
          subtitle="Storage is slower than RAM. Using it as memory can slow things down."
          accent="var(--warn)"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Storage drives operate at <b style={{ color: "var(--warn)", fontWeight: 700 }}>lower data transfer speeds</b> and have <b style={{ color: "var(--warn)", fontWeight: 700 }}>higher access times</b> as compared to RAM; that's why the use of virtual memory can result in <b style={{ color: "var(--warn)", fontWeight: 700 }}>reduced system performance</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:scale-balance" width={22} height={22} color="var(--warn)" />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--warn)", fontWeight: 800 }}>
                THE SPEED GAP AT A GLANCE
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(88, 166, 255, 0.28)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Icon icon="mdi:memory" width={36} height={36} color="var(--accent)" />
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>RAM</div>
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--accent)",
                    fontFamily: "Roboto Mono, monospace",
                  }}
                >
                  fast
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                  low access time · high transfer rate
                </div>
              </div>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--warn)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(255, 179, 71, 0.28)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Icon icon="mdi:harddisk" width={36} height={36} color="var(--warn)" />
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--warn)" }}>Storage Drive</div>
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "var(--warn)",
                    fontFamily: "Roboto Mono, monospace",
                  }}
                >
                  slower
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 6 }}>
                  higher access time · lower transfer rate
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 7. Simultaneous programs (verbatim second paragraph)
    {
      id: "simultaneous",
      title: "When many programs are open",
      render: (
        <SlideLayout
          title="When many programs are open at once"
          subtitle="The OS moves less-used data out of RAM to make space for what you are actively using."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              When several programs are open simultaneously, the operating system may transfer data from <b style={hlBlue}>less active programs</b> to virtual memory. This <b>frees up space in RAM</b> for the programs you are currently using, but may make those fewer active programs <b style={hlWarm}>slower to respond</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:swap-horizontal-bold" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                RAM → STORAGE, SIDELINED UNTIL NEEDED
              </span>
            </div>
            <VirtualMemoryFlow />
          </div>
        </SlideLayout>
      ),
    },

    // 8. RAM vs Virtual Memory side-by-side comparison
    {
      id: "compare",
      title: "RAM vs Virtual Memory",
      render: (
        <SlideLayout
          title="RAM vs Virtual Memory"
          subtitle="Same purpose, very different properties. Know both for the exam."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "160px 1fr 1fr",
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
              <div style={{ color: "var(--accent)" }}>RAM</div>
              <div style={{ color: "var(--microtask)" }}>VIRTUAL MEMORY</div>
            </div>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StaggerItem>
                <CompareRow
                  label="LOCATION"
                  ram="Main working area (physical memory chips)"
                  vm="Part of the storage drive (Hard drive, SSD, NVMe)"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow label="SPEED" ram="Fast" vm="Slower (higher access time)" />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="PERMANENCE"
                  ram="Temporary (erased when power off)"
                  vm="Uses storage drive (data persists on disk)"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="WHEN USED"
                  ram="Always, for the programs currently running"
                  vm="Only when RAM is full"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="EFFECT"
                  ram="CPU works right away on data"
                  vm="Allows more programs to run, but reduces system performance"
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 9. DO YOU KNOW: IBM 5150 + DDR5
    {
      id: "do-you-know",
      title: "DO YOU KNOW · Then and Now",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="From 16 KB to 50 GB per second"
          accent={ACCENT}
        >
          <DoYouKnow>
            The first personal computer, the <b style={{ color: "var(--accent)" }}>IBM 5150</b> (1981), was equipped with only <b style={{ color: "var(--accent)" }}>16 KB</b> of RAM. In contrast, modern DDR5 RAM can transfer data at speeds exceeding <b style={{ color: "var(--accent)" }}>50 GB</b> per second, enabling the copying of a full high-definition movie in less than <b style={{ color: "var(--accent)" }}>one</b> second.
            <div style={{ display: "flex", gap: 20, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 12,
                }}
              >
                <Icon icon="mdi:desktop-classic" width={30} height={30} color="var(--sync)" />
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--sync)", fontWeight: 800 }}>1981</div>
                  <div style={{ fontSize: 18, color: "var(--text)", fontWeight: 800, fontFamily: "Roboto Mono, monospace" }}>
                    IBM 5150 · 16 KB
                  </div>
                </div>
              </div>
              <Icon icon="mdi:arrow-right-thick" width={32} height={32} color="var(--muted)" />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--microtask)",
                  borderRadius: 12,
                }}
              >
                <Icon icon="mdi:memory" width={30} height={30} color="var(--microtask)" />
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800 }}>
                    TODAY
                  </div>
                  <div style={{ fontSize: 18, color: "var(--text)", fontWeight: 800, fontFamily: "Roboto Mono, monospace" }}>
                    DDR5 · &gt; 50 GB/s
                  </div>
                </div>
              </div>
            </div>
          </DoYouKnow>
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK: real RAM sizes across devices
    {
      id: "beyond-book",
      title: "How much RAM is inside real devices?",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="How much RAM lives in each device you use?"
          accent={ACCENT}
        >
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book tells you what RAM is. Here is roughly how much of it sits inside the devices you already own.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }}>
            <StaggerItem>
              <DeviceRamCard icon="mdi:raspberry-pi" label="Raspberry Pi (older)" ram="512 MB" color="var(--muted)" />
            </StaggerItem>
            <StaggerItem>
              <DeviceRamCard icon="mdi:cellphone" label="Budget phone" ram="4 GB" color="var(--sync)" />
            </StaggerItem>
            <StaggerItem>
              <DeviceRamCard icon="mdi:cellphone-android" label="Flagship phone" ram="8 to 16 GB" color="var(--accent)" />
            </StaggerItem>
            <StaggerItem>
              <DeviceRamCard icon="mdi:laptop" label="Laptop" ram="8 to 32 GB" color="var(--microtask)" />
            </StaggerItem>
            <StaggerItem>
              <DeviceRamCard icon="mdi:desktop-tower" label="Gaming PC" ram="16 to 64 GB" color="var(--task)" />
            </StaggerItem>
            <StaggerItem>
              <DeviceRamCard icon="mdi:server" label="Server" ram="128 GB to 1 TB" color="var(--warn)" />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 20,
              padding: "16px 20px",
              backgroundColor: "rgba(255, 179, 71, 0.08)",
              border: "1px solid rgba(255, 179, 71, 0.4)",
              borderRadius: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Icon icon="mdi:calculator-variant-outline" width={22} height={22} color="var(--microtask)" />
              <div style={{ fontSize: 13, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800 }}>
                DO THE MATH
              </div>
            </div>
            <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>
              A modern flagship phone has around <b>1,000,000</b> times more RAM than the IBM 5150 (16 GB vs 16 KB). Yet the OS still runs out of RAM sometimes, because apps have grown too.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 11. Important Concepts (verbatim definitions)
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Important Concepts from 1.4"
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:database-outline"
                term="Memory"
                def="A fundamental component of a computer system, used to store data and instructions required for processing. It ensures that the CPU can access information quickly during program execution."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:memory"
                term="Primary Memory (RAM)"
                def="The main working area of a computer. A fast storage area where the computer keeps the data and instructions temporarily. Its data is erased when the computer is turned off."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:harddisk"
                term="Virtual Memory"
                def="When the RAM is full, the operating system uses part of the computer's storage drive as virtual memory. This extra space acts like temporary RAM."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:sd"
                term="Storage Drives"
                def="Hard drives, solid-state drives (SSD), or Non-Volatile Memory Express (NVMe). Any of these can back virtual memory."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:speedometer-slow"
                term="Performance Trade-off"
                def="Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM; that's why the use of virtual memory can result in reduced system performance."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:swap-horizontal-bold"
                term="Transfer to Virtual Memory"
                def="When several programs are open simultaneously, the OS may transfer data from less active programs to virtual memory. This frees up space in RAM for the programs you are currently using."
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
        <SlideLayout
          title="Definitions and Important Questions"
          accent="var(--microtask)"
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <QARow
                q="Define Memory."
                a="Memory is a fundamental component of a computer system, used to store data and instructions required for processing. It ensures that the CPU can access information quickly during program execution."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define Primary Memory (RAM)."
                a="Primary memory, also called Random Access Memory (RAM), is the main working area of a computer. It is a fast storage area where the computer keeps the data and instructions temporarily. Its data is erased when the computer is turned off."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define Virtual Memory."
                a="When the RAM is full, the operating system uses part of the computer's storage drive (like Hard drives, solid-state drives (SSD), or Non-Volatile Memory Express (NVMe)) as virtual memory. This extra space acts like temporary RAM, allowing more programs to run at the same time."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Why does virtual memory reduce system performance?"
                a="Storage drives operate at lower data transfer speeds and have higher access times as compared to RAM; that's why the use of virtual memory can result in reduced system performance."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does the OS manage many open programs at once?"
                a="When several programs are open simultaneously, the operating system may transfer data from less active programs to virtual memory. This frees up space in RAM for the programs you are currently using, but may make those fewer active programs slower to respond."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Coming up next: 1.5 Processes and Threads
    {
      id: "next-topic",
      title: "Next up: 1.5 Processes and Threads",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout
          title="Coming up next"
          accent="var(--microtask)"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <NextTopicHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
