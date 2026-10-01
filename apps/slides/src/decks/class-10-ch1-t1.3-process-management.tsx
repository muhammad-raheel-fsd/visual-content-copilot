/**
 * Class 10 CS · Chapter 1 · Topic 1.3 · Process Management in Operating System (OS)
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, DO-YOU-KNOW box, ACTIVITY box, and key-point sentence is
 * copied EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.3-process-management.md`.
 * Real-world scenarios and Tid-Bytes are clearly labelled as extensions of the book.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 17 slides. Animated FCFS Gantt chart on slide 12. Hand-drawn lifecycle SVG on slide 6.
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
const bulletStyle: CSSProperties = {
  fontSize: 22,
  lineHeight: 1.7,
  color: "var(--text)",
  paddingLeft: 30,
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

// ── hero: animated processes swirling around a CPU core ─────────────────

const HeroProcessOrbit: React.FC = () => {
  const R = 170;
  const CENTER = 220;
  const procs = [
    { icon: "mdi:web", label: "Browser", color: "var(--sync)", angle: -90 },
    { icon: "mdi:music", label: "Music", color: "var(--microtask)", angle: -30 },
    { icon: "mdi:file-document-outline", label: "Doc", color: "var(--task)", angle: 30 },
    { icon: "mdi:download", label: "Download", color: "var(--api)", angle: 90 },
    { icon: "mdi:message-outline", label: "Chat", color: "var(--warn)", angle: 150 },
    { icon: "mdi:video-outline", label: "Video", color: "var(--accent)", angle: 210 },
  ];
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 440, height: 440 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute",
            width: R * 2 + 40,
            height: R * 2 + 40,
            left: CENTER - R - 20,
            top: CENTER - R - 20,
            borderRadius: "50%",
            border: "2px dashed rgba(88, 166, 255, 0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            left: CENTER - 70,
            top: CENTER - 70,
            borderRadius: "50%",
            backgroundColor: "var(--panel)",
            border: "2.5px solid var(--accent)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: "0 0 70px 12px rgba(88, 166, 255, 0.35)",
          }}
        >
          <Icon icon="mdi:chip" width={54} height={54} color="var(--accent)" />
          <div style={{ fontSize: 14, letterSpacing: 3, color: "var(--accent)", fontWeight: 800 }}>CPU</div>
        </div>
        {procs.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const cx = CENTER + Math.cos(rad) * R;
          const cy = CENTER + Math.sin(rad) * R;
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", damping: 14 }}
              style={{
                position: "absolute",
                width: 88,
                left: cx - 44,
                top: cy - 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  backgroundColor: "var(--panel)",
                  border: `1.5px solid ${p.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 18px ${p.color}55`,
                }}
              >
                <Icon icon={p.icon} width={30} height={30} color={p.color} />
              </div>
              <div style={{ fontSize: 11, color: p.color, fontWeight: 700 }}>{p.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── lifecycle stage card (slide 3) ───────────────────────────────────────

const LifecycleCard: React.FC<{
  step: string;
  title: string;
  icon: string;
  color: string;
  bullets: ReactNode[];
}> = ({ step, title, icon, color, bullets }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 0 30px ${color}33`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: color,
          color: "#0a0e14",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {step}
      </div>
      <Icon icon={icon} width={36} height={36} color={color} />
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{title}</div>
    </div>
    <ul style={{ ...bulletStyle, fontSize: 17, paddingLeft: 22 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ marginBottom: 8 }}>{b}</li>
      ))}
    </ul>
  </div>
);

// ── Chrome lifecycle card (slide 4) ──────────────────────────────────────

const ChromeStageCard: React.FC<{
  step: string;
  title: string;
  icon: string;
  color: string;
  bookText: string;
}> = ({ step, title, icon, color, bookText }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 0 30px ${color}22`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: color,
          color: "#0a0e14",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {step}
      </div>
      <Icon icon={icon} width={40} height={40} color={color} />
      <div style={{ fontSize: 20, fontWeight: 800, color }}>{title}</div>
    </div>
    <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{bookText}</div>
  </div>
);

// ── Multitasking visual: 3 apps side-by-side with switch arrows ──────────

const MultitaskingVisual: React.FC = () => {
  const apps = [
    { icon: "mdi:music", label: "Music", color: "var(--microtask)" },
    { icon: "mdi:file-document-outline", label: "Document", color: "var(--sync)" },
    { icon: "mdi:web", label: "Internet", color: "var(--api)" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
      {apps.map((a, i) => (
        <div key={a.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.2, type: "spring", damping: 18 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: 20,
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${a.color}`,
              borderRadius: 14,
              width: 160,
              boxShadow: `0 0 24px ${a.color}33`,
            }}
          >
            <Icon icon={a.icon} width={54} height={54} color={a.color} />
            <div style={{ fontSize: 18, fontWeight: 800, color: a.color }}>{a.label}</div>
          </motion.div>
          {i < apps.length - 1 && (
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
              style={{ color: "var(--muted)" }}
            >
              <Icon icon="mdi:swap-horizontal-bold" width={32} height={32} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Concurrency visual: chef + 3 dishes with time-shifted focus ──────────

const ConcurrencyChef: React.FC = () => {
  const dishes = [
    { icon: "mdi:pot-mix-outline", label: "Dish 1", color: "var(--warn)" },
    { icon: "mdi:food-outline", label: "Dish 2", color: "var(--microtask)" },
    { icon: "mdi:noodles", label: "Dish 3", color: "var(--task)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <motion.div
        animate={{ rotate: [0, -6, 0, 6, 0] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          backgroundColor: "var(--panel)",
          border: "2.5px solid var(--accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(88, 166, 255, 0.4)",
        }}
      >
        <Icon icon="mdi:chef-hat" width={60} height={60} color="var(--accent)" />
      </motion.div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
        {dishes.map((d, i) => (
          <motion.div
            key={d.label}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "16px 22px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${d.color}`,
              borderRadius: 14,
              boxShadow: `0 0 24px ${d.color}44`,
            }}
          >
            <Icon icon={d.icon} width={44} height={44} color={d.color} />
            <div style={{ fontSize: 14, fontWeight: 700, color: d.color }}>{d.label}</div>
          </motion.div>
        ))}
      </div>
      <div style={{ fontSize: 14, color: "var(--muted)", letterSpacing: 2, fontWeight: 700 }}>
        SWITCHES BETWEEN THEM SO FAST YOU DO NOT NOTICE
      </div>
    </div>
  );
};

// ── FCFS numerical example table ─────────────────────────────────────────

const FCFSTable: React.FC = () => {
  const rows = [
    { p: "P1", arrival: "0 seconds", time: "5 seconds", color: "var(--sync)" },
    { p: "P2", arrival: "1 second", time: "3 seconds", color: "var(--microtask)" },
    { p: "P3", arrival: "2 seconds", time: "2 seconds", color: "var(--task)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr 1.4fr",
          gap: 10,
          padding: "10px 16px",
          fontSize: 13,
          letterSpacing: 2,
          fontWeight: 800,
          color: "var(--muted)",
          borderBottom: "2px solid var(--panel-border)",
        }}
      >
        <div>PROCESS ID</div>
        <div>ARRIVAL TIME</div>
        <div>TIME NEEDED</div>
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.p}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.15, type: "spring", damping: 18 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr 1.4fr",
            gap: 10,
            alignItems: "center",
            padding: "14px 16px",
            backgroundColor: "var(--panel)",
            border: `1px solid ${r.color}55`,
            borderRadius: 10,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: r.color,
              fontFamily: "Roboto Mono, monospace",
            }}
          >
            {r.p}
          </div>
          <div style={{ fontSize: 18, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
            {r.arrival}
          </div>
          <div style={{ fontSize: 18, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
            {r.time}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── FCFS animated Gantt chart (star of the deck) ─────────────────────────

const FCFSGantt: React.FC = () => {
  const WIDTH = 660;
  const HEIGHT = 100;
  const TICK = 10;
  const unit = WIDTH / TICK;
  const blocks = [
    { label: "P1", start: 0, end: 5, color: "var(--sync)", delay: 0.3 },
    { label: "P2", start: 5, end: 8, color: "var(--microtask)", delay: 1.5 },
    { label: "P3", start: 8, end: 10, color: "var(--task)", delay: 2.7 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "relative", width: WIDTH, height: HEIGHT }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--panel)",
            border: "1.5px solid var(--panel-border)",
            borderRadius: 10,
          }}
        />
        {blocks.map((b) => {
          const bw = (b.end - b.start) * unit;
          const bx = b.start * unit;
          return (
            <motion.div
              key={b.label}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: bw, opacity: 1 }}
              transition={{ delay: b.delay, duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 6,
                bottom: 6,
                left: bx + 4,
                backgroundColor: b.color,
                border: `2px solid ${b.color}`,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0e14",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
                fontFamily: "Roboto Mono, monospace",
                overflow: "hidden",
                boxShadow: `0 0 20px ${b.color}77`,
              }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: b.delay + 0.6 }}
              >
                {b.label}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
      <div style={{ position: "relative", width: WIDTH, height: 26 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
          <div
            key={t}
            style={{
              position: "absolute",
              left: t * unit,
              top: 0,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ width: 1, height: 6, backgroundColor: "var(--muted)" }} />
            <div style={{ fontSize: 12, color: "var(--muted)", fontFamily: "Roboto Mono, monospace" }}>
              {t}s
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
        {blocks.map((b) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: b.delay + 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              backgroundColor: "var(--panel)",
              border: `1px solid ${b.color}55`,
              borderRadius: 999,
              fontFamily: "Roboto Mono, monospace",
              fontSize: 14,
            }}
          >
            <div
              style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: b.color }}
            />
            <span style={{ color: b.color, fontWeight: 800 }}>{b.label}</span>
            <span style={{ color: "var(--muted)" }}>
              {b.start}s → {b.end}s (finish at {b.end})
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ── FCFS step-by-step step card ──────────────────────────────────────────

const StepCard: React.FC<{
  time: string;
  color: string;
  bullets: ReactNode[];
}> = ({ time, color, bullets }) => (
  <div
    style={{
      display: "flex",
      gap: 16,
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 12,
    }}
  >
    <div
      style={{
        minWidth: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: "6px 10px",
        backgroundColor: `${color}18`,
        border: `1px solid ${color}`,
        borderRadius: 10,
        color,
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700 }}>AT</div>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{time}</div>
    </div>
    <ul style={{ ...bulletStyle, fontSize: 15, paddingLeft: 22, flex: 1 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ marginBottom: 4 }}>{b}</li>
      ))}
    </ul>
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

// ── ACTIVITY box (verbatim) ──────────────────────────────────────────────

const ActivityBox: React.FC = () => (
  <div
    style={{
      padding: "22px 26px",
      backgroundColor: "rgba(255, 179, 71, 0.08)",
      border: "1.5px solid rgba(255, 179, 71, 0.45)",
      borderRadius: 14,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <Icon icon="mdi:hand-back-right-outline" width={28} height={28} color="var(--microtask)" />
      <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--microtask)", fontWeight: 800 }}>
        ACTIVITY · YOUR TURN
      </div>
    </div>
    <div style={{ fontSize: 17, color: "var(--text)", marginBottom: 14 }}>
      <b>Objective:</b> Use the <b>First Come, First Served (FCFS)</b> method to determine the order and completion time of processes.
    </div>
    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
      STEPS
    </div>
    <ol style={{ ...bulletStyle, fontSize: 15, paddingLeft: 24, lineHeight: 1.7, marginBottom: 12 }}>
      <li>
        Consider the following processes:
        <div
          style={{
            marginTop: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1.2fr",
            gap: 6,
            fontFamily: "Roboto Mono, monospace",
            fontSize: 14,
          }}
        >
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6, fontWeight: 800 }}>Process</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6, fontWeight: 800 }}>Arrival Time</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6, fontWeight: 800 }}>Time Needed</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>P1</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>0s</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>4s</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>P2</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>1s</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>5s</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>P3</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>2s</div>
          <div style={{ padding: "6px 10px", backgroundColor: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: 6 }}>3s</div>
        </div>
      </li>
      <li style={{ marginTop: 10 }}>Arrange the processes in the order they will run according to the FCFS method.</li>
      <li>Calculate the <b>start</b> and <b>finish time</b> for each process.</li>
    </ol>
    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>
      ANSWER THE QUESTIONS
    </div>
    <ul style={{ ...bulletStyle, fontSize: 15, paddingLeft: 24, lineHeight: 1.7 }}>
      <li>What is the total time taken for all processes to finish?</li>
      <li>Which process had to wait the longest?</li>
    </ul>
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
        1.4
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>Memory</div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      Where does the OS keep everything it is running? Meet <b style={hlWarm}>RAM</b> (fast, temporary) and <b style={hlWarm}>Virtual Memory</b> (extra space borrowed from your disk). Coming up next.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
      {[
        { icon: "mdi:memory", label: "Primary Memory (RAM)" },
        { icon: "mdi:harddisk", label: "Virtual Memory" },
        { icon: "mdi:speedometer", label: "Speed vs Capacity" },
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

export const class10Ch1T13ProcessManagementDeck: Deck = {
  title: "Process Management in Operating System (OS)",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.3 · Process Management",
  topicCode: "1.3",
  topicTitle: "Process Management in Operating System (OS)",
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
              1.3 <span style={{ color: ACCENT }}>Process Management</span> in the OS
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <HeroProcessOrbit />
              </div>
              One CPU. Many programs. The OS is the choreographer.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. What is process management? (verbatim intro)
    {
      id: "intro",
      title: "What is process management?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.3 Process Management in Operating System (OS)"
          subtitle="Every app you open is a process. The OS makes sure they all get what they need."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              The operating system is responsible for managing all the programs that run on a computer. In this context, these running programs are called <b style={hlBlue}>processes</b>. Process management ensures that each process gets the <b style={hlBlue}>resources</b> it needs, even when multiple processes are active. Process management is one of the most important jobs of an operating system because it ensures all processes run smoothly without disturbing each other.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:cog-play-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE THINGS TO REMEMBER
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--sync)", borderRadius: 12, boxShadow: "0 0 24px rgba(63, 185, 80, 0.22)" }}>
                  <Icon icon="mdi:application-outline" width={40} height={40} color="var(--sync)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--sync)", marginTop: 8 }}>Process</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                    A running program.
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--microtask)", borderRadius: 12, boxShadow: "0 0 24px rgba(255, 179, 71, 0.22)" }}>
                  <Icon icon="mdi:chip" width={40} height={40} color="var(--microtask)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--microtask)", marginTop: 8 }}>Resources</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                    CPU time, memory, devices.
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 20, backgroundColor: "var(--panel)", border: "1.5px solid var(--task)", borderRadius: 12, boxShadow: "0 0 24px rgba(255, 121, 198, 0.22)" }}>
                  <Icon icon="mdi:shield-check-outline" width={40} height={40} color="var(--task)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--task)", marginTop: 8 }}>No Disturbance</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                    Processes never step on each other.
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Process Life Cycle (3 stages verbatim)
    {
      id: "life-cycle",
      title: "Process Life Cycle",
      render: (
        <SlideLayout
          title="Process Life Cycle"
          subtitle="A process goes through several stages during its life cycle."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, height: "100%" }}>
            <StaggerItem style={{ height: "100%" }}>
              <LifecycleCard
                step="1"
                title="Creation"
                icon="mdi:play-circle-outline"
                color="var(--microtask)"
                bullets={[
                  "This happens when you start any program (like MS Word).",
                  "The OS loads the program into memory and gives it the resources (like CPU time and memory) it needs.",
                ]}
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <LifecycleCard
                step="2"
                title="Execution"
                icon="mdi:cog-sync-outline"
                color="var(--sync)"
                bullets={["The process is actively running and performing tasks effectively."]}
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <LifecycleCard
                step="3"
                title="Termination"
                icon="mdi:stop-circle-outline"
                color="var(--task)"
                bullets={[
                  "The process finishes its task and is closed by the user or the system.",
                  "The OS frees the resources so they can be used by other processes.",
                ]}
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 4. Google Chrome lifecycle (verbatim example)
    {
      id: "chrome-example",
      title: "Example · Google Chrome lifecycle",
      render: (
        <SlideLayout
          title="Example: Google Chrome lifecycle"
          subtitle="The book's real-world walkthrough of the three stages, applied to a browser."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={{ ...bookQuoteStyle, fontSize: 20 }}>
              Process Lifecycle of opening a Web Browser on your mobile or computer like <b style={hlBlue}>Google Chrome</b>.
            </p>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem style={{ height: "100%" }}>
                <ChromeStageCard
                  step="1"
                  title="Creation"
                  icon="mdi:cursor-default-click-outline"
                  color="var(--microtask)"
                  bookText="Begins when the user clicks the browser icon. The operating system loads the program into memory and allocates the required resources."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <ChromeStageCard
                  step="2"
                  title="Execution"
                  icon="mdi:web"
                  color="var(--sync)"
                  bookText="The browser performs tasks such as loading web pages, displaying media, and responding to user actions."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <ChromeStageCard
                  step="3"
                  title="Termination"
                  icon="mdi:close-circle-outline"
                  color="var(--task)"
                  bookText="Occurs when the browser is closed. The operating system stops the process and releases its resources for other uses."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Hand-drawn lifecycle diagram
    {
      id: "lifecycle-hand-drawn",
      title: "Lifecycle · hand-drawn diagram",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="The Process Life Cycle, hand-drawn"
          subtitle="Feels like a whiteboard. Three states, one loop back to the free-resources pool."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.3-process-lifecycle.svg"
              alt="Hand-drawn process lifecycle diagram"
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

    // 6. Multitasking (verbatim + music/doc/internet)
    {
      id: "multitasking",
      title: "Multitasking",
      render: (
        <SlideLayout
          title="Multitasking"
          subtitle="Modern operating systems can manage many processes so efficiently that it appears they are all running at the same time."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlBlue}>Multitasking:</b> The operating system allows more than one program to be open and usable by a single user at the same time. You can easily switch between them whenever you need.
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
              <p style={{ ...bookQuoteStyle, fontSize: 20 }}>
                You can listen to music, keep a document open, and browse the internet, moving between them as needed.
              </p>
            </div>
            <MultitaskingVisual />
          </div>
        </SlideLayout>
      ),
    },

    // 7. Concurrency (verbatim + chef)
    {
      id: "concurrency",
      title: "Concurrency",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Concurrency"
          subtitle="Not truly parallel. Just extremely fast switching. The book's chef analogy explains it best."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  <b style={hlBlue}>Concurrency:</b> More than one process is active at the same time in an OS, but the CPU processes them one by one in extremely fast cycles.
                </p>
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    borderLeft: `3px solid ${ACCENT}`,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 2, color: ACCENT, fontWeight: 800, marginBottom: 6 }}>
                    EXAMPLE
                  </div>
                  <div style={{ fontSize: 18, color: "var(--text)", lineHeight: 1.55 }}>
                    Like a chef preparing three dishes, working on one for a short time, then moving to the next, and repeating, the CPU switches between processes so rapidly that the user does not notice any delay.
                  </div>
                </div>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <ConcurrencyChef />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 8. Process Scheduling Concepts (verbatim + 2 decisions)
    {
      id: "scheduling-intro",
      title: "Process Scheduling Concepts",
      render: (
        <SlideLayout
          title="Process Scheduling Concepts"
          subtitle="One CPU can only work on one thing at a time. Something has to decide the order."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              We have learned that many processes can be in progress during the same time period, but the CPU works on them <b style={hlBlue}>one at a time in very fast turns</b>. Since the CPU cannot run all processes at the same time, the operating system must decide:
            </p>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 22px",
                    backgroundColor: "var(--panel)",
                    border: "1.5px solid var(--sync)",
                    borderRadius: 14,
                    boxShadow: "0 0 24px rgba(63, 185, 80, 0.22)",
                  }}
                >
                  <Icon icon="mdi:sort-numeric-ascending" width={42} height={42} color="var(--sync)" />
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.45 }}>
                    Which process should run <b style={{ color: "var(--sync)" }}>first?</b>
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 22px",
                    backgroundColor: "var(--panel)",
                    border: "1.5px solid var(--microtask)",
                    borderRadius: 14,
                    boxShadow: "0 0 24px rgba(255, 179, 71, 0.22)",
                  }}
                >
                  <Icon icon="mdi:timer-outline" width={42} height={42} color="var(--microtask)" />
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.45 }}>
                    How <b style={{ color: "var(--microtask)" }}>long</b> each process should run.
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
            <p style={{ ...bookQuoteStyle, fontSize: 20 }}>
              This process is called <b style={hlBlue}>scheduling</b>. There are different scheduling methods used by operating systems. But in this unit, we will explore only one of the simplest scheduling techniques, <b style={{ ...hlBlue, fontStyle: "italic" }}>First Come, First Served (FCFS)</b>.
            </p>
          </div>
        </SlideLayout>
      ),
    },

    // 9. FCFS definition + queue analogy
    {
      id: "fcfs-intro",
      title: "First Come, First Served (FCFS)",
      render: (
        <SlideLayout
          title="First Come, First Served (FCFS)"
          subtitle="Simplest scheduling method. Like a queue at a shop counter."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  In the <b style={hlBlue}>FCFS</b> method, the CPU processes tasks in the <b>exact order they arrive</b>. The first process to arrive is completed first, and the next process starts only after the previous one finishes.
                </p>
                <div
                  style={{
                    marginTop: 16,
                    padding: "14px 18px",
                    borderLeft: `3px solid ${ACCENT}`,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 2, color: ACCENT, fontWeight: 800, marginBottom: 6 }}>
                    EXAMPLE
                  </div>
                  <div style={{ fontSize: 18, color: "var(--text)", lineHeight: 1.55 }}>
                    Like a queue at a shop counter, the first customer in line is served first, then the next, and so on.
                  </div>
                </div>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {[
                      { color: "var(--sync)", label: "1st" },
                      { color: "var(--microtask)", label: "2nd" },
                      { color: "var(--task)", label: "3rd" },
                      { color: "var(--api)", label: "4th" },
                    ].map((c, i) => (
                      <motion.div
                        key={c.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.12, type: "spring", damping: 18 }}
                        style={{ display: "flex", alignItems: "center", gap: 6 }}
                      >
                        <div
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: "50%",
                            backgroundColor: "var(--panel)",
                            border: `1.5px solid ${c.color}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 2,
                            boxShadow: `0 0 16px ${c.color}55`,
                          }}
                        >
                          <Icon icon="mdi:human" width={30} height={30} color={c.color} />
                          <div style={{ fontSize: 10, color: c.color, fontWeight: 800 }}>{c.label}</div>
                        </div>
                        {i < 3 && (
                          <Icon icon="mdi:arrow-left" width={20} height={20} color="var(--muted)" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, type: "spring", damping: 18 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 22px",
                      backgroundColor: "var(--panel)",
                      border: "2px solid var(--accent)",
                      borderRadius: 12,
                      boxShadow: "0 0 30px rgba(88, 166, 255, 0.4)",
                    }}
                  >
                    <Icon icon="mdi:store-outline" width={40} height={40} color="var(--accent)" />
                    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>SHOP COUNTER</div>
                  </motion.div>
                </div>
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 10. Numerical Example (table + intro)
    {
      id: "fcfs-numerical",
      title: "FCFS · Numerical Example",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Numerical Example"
          subtitle="Let us use some simple data to see how FCFS scheduling works in practice."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="Three processes arrive" accent={ACCENT}>
                <FCFSTable />
                <div style={{ marginTop: 18, fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
                  P1 arrives first, then P2 one second later, then P3 one second after that. They all need different amounts of CPU time.
                </div>
              </Card>
            }
            right={
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: 20, padding: 6 }}>
                <div style={{ fontSize: 14, letterSpacing: 2, color: "var(--muted)", fontWeight: 800 }}>
                  RESULT · FCFS TIMELINE
                </div>
                <FCFSGantt />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 11. Step-by-Step Explanation (verbatim 5 steps)
    {
      id: "fcfs-steps",
      title: "FCFS · Step-by-Step Explanation",
      render: (
        <SlideLayout
          title="Step-by-Step Explanation"
          subtitle="Follow the clock. Every second, something happens."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StaggerItem>
              <StepCard
                time="0s"
                color="var(--sync)"
                bullets={[
                  <span key="1">P1 arrives first, so it starts running immediately.</span>,
                  <span key="2">It requires <b style={{ color: "var(--sync)" }}>5 seconds</b> to finish.</span>,
                  <span key="3">It runs from <b style={{ color: "var(--sync)" }}>0s to 5s</b>.</span>,
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                time="1s"
                color="var(--microtask)"
                bullets={[
                  <span key="1">P2 arrives while P1 is still running, so P2 waits.</span>,
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                time="2s"
                color="var(--task)"
                bullets={[
                  <span key="1">P3 arrives, but P1 is still running and P2 is already waiting.</span>,
                  <span key="2">In FCFS, P3 will also wait until both P1 and P2 have completed.</span>,
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                time="5s"
                color="var(--microtask)"
                bullets={[
                  <span key="1">P1 finishes.</span>,
                  <span key="2">The CPU now starts <b style={{ color: "var(--microtask)" }}>P2</b>, which needs <b style={{ color: "var(--microtask)" }}>3 seconds</b> to complete.</span>,
                  <span key="3">P2 runs from <b style={{ color: "var(--microtask)" }}>5s to 8s</b>.</span>,
                ]}
              />
            </StaggerItem>
            <StaggerItem>
              <StepCard
                time="8s"
                color="var(--task)"
                bullets={[
                  <span key="1">P2 finishes.</span>,
                  <span key="2">The CPU now starts <b style={{ color: "var(--task)" }}>P3</b>, which needs <b style={{ color: "var(--task)" }}>2 seconds</b>.</span>,
                  <span key="3">P3 starts and runs from <b style={{ color: "var(--task)" }}>8s to 10s</b>.</span>,
                ]}
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Observation (verbatim)
    {
      id: "fcfs-observation",
      title: "FCFS · Observation",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Observation"
          subtitle="Even the shortest task can get stuck behind long ones."
          accent="var(--warn)"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Even though <b style={{ color: "var(--task)" }}>P3</b> has the shortest duration (only <b>2 seconds</b>), it must still wait until <b style={{ color: "var(--sync)" }}>P1</b> and <b style={{ color: "var(--microtask)" }}>P2</b> have finished because they arrived earlier. This is one of the main characteristics of FCFS; <b style={{ color: "var(--warn)" }}>shorter tasks can be delayed if they arrive after longer ones</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:eye-outline" width={22} height={22} color="var(--warn)" />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--warn)", fontWeight: 800 }}>
                WHAT THIS LOOKS LIKE ON THE TIMELINE
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FCFSGantt />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 13. Advantages + Disadvantages + convoy effect
    {
      id: "fcfs-pros-cons",
      title: "FCFS · Advantages and Disadvantages",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Advantages and Disadvantages of FCFS"
          subtitle="Although FCFS is a simple and fair scheduling method, it has both advantages and disadvantages."
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, height: "100%" }}>
            <div
              style={{
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--sync)",
                borderRadius: 16,
                boxShadow: "0 0 30px rgba(63, 185, 80, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:thumb-up-outline" width={40} height={40} color="var(--sync)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--sync)" }}>Advantages</div>
              </div>
              <div style={{ fontSize: 18, color: "var(--text)", lineHeight: 1.55 }}>
                Easy to <b>understand</b> and <b>implement</b>, as processes are served in the exact order they arrive. <b>No process is skipped.</b>
              </div>
            </div>
            <div
              style={{
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--warn)",
                borderRadius: 16,
                boxShadow: "0 0 30px rgba(255, 179, 71, 0.28)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:thumb-down-outline" width={40} height={40} color="var(--warn)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--warn)" }}>Disadvantages</div>
              </div>
              <div style={{ fontSize: 18, color: "var(--text)", lineHeight: 1.55 }}>
                Short processes may have to <b>wait a long time</b> if they are queued behind longer processes (known as the <b style={{ color: "var(--warn)" }}>"convoy effect"</b>), which can affect the overall efficiency of the system.
              </div>
              <div
                style={{
                  marginTop: "auto",
                  padding: "12px 14px",
                  backgroundColor: "rgba(255, 179, 71, 0.12)",
                  border: "1px dashed rgba(255, 179, 71, 0.5)",
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Icon icon="mdi:truck-outline" width={22} height={22} color="var(--warn)" />
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--warn)", fontWeight: 800 }}>
                    CONVOY EFFECT
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>
                  Short cars stuck behind slow trucks on a one-lane road. Everyone waits.
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 14. DO YOU KNOW: millions of switches per second
    {
      id: "do-you-know",
      title: "DO YOU KNOW · Millions of switches",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="A single second, millions of switches"
          accent={ACCENT}
        >
          <DoYouKnow>
            The CPU in your computer can switch between processes <b style={{ color: "var(--accent)" }}>millions of times</b> in just <b>one second</b>. This happens so fast that you can play music, browse the web, and download files all at once.
            <div style={{ display: "flex", gap: 14, marginTop: 18, flexWrap: "wrap" }}>
              {[
                { icon: "mdi:music", label: "Music" },
                { icon: "mdi:web", label: "Browsing" },
                { icon: "mdi:download", label: "Downloading" },
              ].map((a) => (
                <div
                  key={a.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    backgroundColor: "rgba(88, 166, 255, 0.12)",
                    border: "1px solid rgba(88, 166, 255, 0.4)",
                    borderRadius: 999,
                  }}
                >
                  <Icon icon={a.icon} width={20} height={20} color="var(--accent)" />
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>{a.label}</div>
                </div>
              ))}
            </div>
          </DoYouKnow>
        </SlideLayout>
      ),
    },

    // 15. ACTIVITY box (verbatim)
    {
      id: "activity",
      title: "Activity · Your turn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Your turn to solve FCFS"
          subtitle="Same technique, new numbers. Walk through the timeline yourself."
          accent="var(--microtask)"
        >
          <ActivityBox />
        </SlideLayout>
      ),
    },

    // 16. Important Concepts (verbatim definitions)
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Important Concepts from 1.3"
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:application-outline"
                term="Process"
                def="A running program. Process management ensures that each process gets the resources it needs, even when multiple processes are active."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:progress-clock"
                term="Process Life Cycle"
                def="A process goes through several stages during its life cycle: Creation, Execution, Termination."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:swap-horizontal-bold"
                term="Multitasking"
                def="The operating system allows more than one program to be open and usable by a single user at the same time. You can easily switch between them whenever you need."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:chef-hat"
                term="Concurrency"
                def="More than one process is active at the same time in an OS, but the CPU processes them one by one in extremely fast cycles."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:sort-numeric-ascending"
                term="Scheduling"
                def="The operating system must decide which process should run first and how long each process should run. This process is called scheduling."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:human-queue"
                term="FCFS"
                def="First Come, First Served. The CPU processes tasks in the exact order they arrive. Simple and fair, but short tasks can wait behind long ones (convoy effect)."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 17. Definitions and Important Questions
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
                q="What is a process?"
                a="In an operating system, running programs are called processes. Process management ensures that each process gets the resources it needs, even when multiple processes are active."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="List the three stages of the process life cycle."
                a="Creation, Execution, and Termination."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Differentiate Multitasking and Concurrency."
                a="Multitasking allows more than one program to be open and usable by a single user at the same time. Concurrency is when more than one process is active at the same time, but the CPU processes them one by one in extremely fast cycles."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define FCFS scheduling."
                a="In the FCFS method, the CPU processes tasks in the exact order they arrive. The first process to arrive is completed first, and the next process starts only after the previous one finishes."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What is the convoy effect?"
                a="Short processes may have to wait a long time if they are queued behind longer processes. This is called the convoy effect and it can affect the overall efficiency of the system."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 18. Next topic preview
    {
      id: "next-topic",
      title: "Next up: 1.4 Memory",
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
