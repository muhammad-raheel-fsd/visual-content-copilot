/**
 * Class 10 CS · Chapter 1 · Topic 1.2 · Architecture of an Operating System
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, ACTIVITY box, and key-point sentence is
 * copied EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.2-architecture.md`.
 * Real-world scenarios and Tid-Bytes are clearly labelled as extensions of the book.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * Section 3, Topic 1.2. 14 slides. Animated Figure 1.1 concentric diagram on slide 5.
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

// ── stagger container ────────────────────────────────────────────────────

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

// ── reusable pieces ──────────────────────────────────────────────────────

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

// ── hero: layered stack that assembles on entry ─────────────────────────

const HeroStack: React.FC = () => {
  const layers = [
    { label: "User", icon: "mdi:account-outline", color: "var(--microtask)", w: 320 },
    { label: "Shell", icon: "mdi:apple-keyboard-command", color: "var(--sync)", w: 380 },
    { label: "Kernel", icon: "mdi:cog-outline", color: "var(--warn)", w: 440 },
    { label: "Hardware", icon: "mdi:chip", color: "var(--task)", w: 500 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {layers.map((l, i) => (
        <motion.div
          key={l.label}
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15 + i * 0.14, type: "spring", damping: 16, stiffness: 180 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            width: l.w,
            padding: "16px 22px",
            backgroundColor: "var(--panel)",
            border: `1.5px solid ${l.color}`,
            borderRadius: 12,
            boxShadow: `0 0 30px ${l.color}33`,
          }}
        >
          <Icon icon={l.icon} width={36} height={36} color={l.color} />
          <div style={{ fontSize: 22, fontWeight: 800, color: l.color, letterSpacing: 1 }}>
            {l.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── school analogy visual (departments) ─────────────────────────────────

const SchoolDepartments: React.FC = () => {
  const depts = [
    { icon: "mdi:shield-account-outline", label: "Guards", color: "var(--task)" },
    { icon: "mdi:broom", label: "Cleaners", color: "var(--task)" },
    { icon: "mdi:account-tie-outline", label: "Admin", color: "var(--sync)" },
    { icon: "mdi:school-outline", label: "Teachers", color: "var(--microtask)" },
    { icon: "mdi:human-child", label: "Students", color: "var(--api)" },
  ];
  return (
    <Stagger style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
      {depts.map((d) => (
        <StaggerItem key={d.label}>
          <div
            style={{
              width: 110,
              padding: "16px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              backgroundColor: "var(--panel)",
              border: `1px solid ${d.color}`,
              borderRadius: 12,
              boxShadow: `0 0 16px ${d.color}33`,
            }}
          >
            <Icon icon={d.icon} width={40} height={40} color={d.color} />
            <div style={{ fontSize: 14, fontWeight: 700, color: d.color }}>{d.label}</div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
};

// ── kernel visual: engine + accessories ──────────────────────────────────

const CarEngineAnalogy: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, height: "100%" }}>
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 24,
        backgroundColor: "var(--panel)",
        border: "2px solid var(--warn)",
        borderRadius: 16,
        boxShadow: "0 0 40px rgba(255, 179, 71, 0.25)",
      }}
    >
      <Icon icon="mdi:engine-outline" width={80} height={80} color="var(--warn)" />
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--warn)" }}>ENGINE</div>
      <div style={{ fontSize: 14, color: "var(--muted)" }}>= Kernel</div>
      <div style={{ fontSize: 15, textAlign: "center", color: "var(--text)", marginTop: 4 }}>
        Hidden. Does the real work.
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 24,
        backgroundColor: "var(--panel)",
        border: "2px solid var(--accent)",
        borderRadius: 16,
        boxShadow: "0 0 40px rgba(88, 166, 255, 0.25)",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Icon icon="mdi:steering" width={60} height={60} color="var(--accent)" />
        <Icon icon="mdi:speedometer" width={60} height={60} color="var(--accent)" />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>
        STEERING · DASHBOARD
      </div>
      <div style={{ fontSize: 14, color: "var(--muted)" }}>= Shell</div>
      <div style={{ fontSize: 15, textAlign: "center", color: "var(--text)", marginTop: 4 }}>
        What the driver touches.
      </div>
    </motion.div>
  </div>
);

// ── shell visual: graphical vs command-line ─────────────────────────────

const ShellComparison: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, height: "100%" }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 22,
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--sync)",
        borderRadius: 16,
        boxShadow: "0 0 30px rgba(63, 185, 80, 0.22)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon icon="mdi:cursor-default-click-outline" width={40} height={40} color="var(--sync)" />
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--sync)" }}>Graphical shell</div>
      </div>
      <div
        style={{
          height: 120,
          borderRadius: 10,
          background: "linear-gradient(135deg, #223, #334)",
          border: "1px solid var(--panel-border)",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: 10,
        }}
      >
        {["mdi:folder", "mdi:file-document", "mdi:image", "mdi:cog", "mdi:web", "mdi:email", "mdi:music", "mdi:trash-can"].map(
          (i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            >
              <Icon icon={i} width={24} height={24} color="var(--sync)" />
            </div>
          ),
        )}
      </div>
      <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>
        Windows desktop, macOS Finder. Click icons, use menus.
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: "spring", damping: 18 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 22,
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--microtask)",
        borderRadius: 16,
        boxShadow: "0 0 30px rgba(255, 179, 71, 0.22)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon icon="mdi:console" width={40} height={40} color="var(--microtask)" />
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--microtask)" }}>Command-line shell</div>
      </div>
      <div
        style={{
          height: 120,
          borderRadius: 10,
          backgroundColor: "#0a0e14",
          border: "1px solid var(--panel-border)",
          padding: "10px 14px",
          fontFamily: "Roboto Mono, monospace",
          fontSize: 13,
          color: "var(--microtask)",
          lineHeight: 1.55,
        }}
      >
        <div>$ ls -la</div>
        <div style={{ color: "var(--muted)" }}>&nbsp;&nbsp;total 8</div>
        <div style={{ color: "var(--muted)" }}>&nbsp;&nbsp;drwxr-xr-x  homework.txt</div>
        <TerminalCursor />
      </div>
      <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>
        Command Prompt, Terminal. Type instructions.
      </div>
    </motion.div>
  </div>
);

const TerminalCursor: React.FC = () => (
  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
    <span>$</span>
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1.2, repeat: Infinity }}
      style={{ display: "inline-block", width: 8, height: 16, backgroundColor: "var(--microtask)" }}
    />
  </div>
);

// ── slide 5: animated concentric Figure 1.1 ──────────────────────────────

const ConcentricArchitecture: React.FC = () => {
  const STAGE = 640;
  const CENTER = STAGE / 2;
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <div style={{ position: "relative", width: STAGE, height: STAGE }}>
        {/* Rings */}
        {[
          { r: 300, color: "var(--sync)", label: "USER", icon: "mdi:account-outline" },
          { r: 240, color: "var(--accent)", label: "SHELL", icon: "mdi:console" },
          { r: 180, color: "var(--warn)", label: "KERNEL", icon: "mdi:cog-sync-outline" },
        ].map((ring, i) => (
          <motion.div
            key={ring.label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.2, type: "spring", damping: 16 }}
            style={{
              position: "absolute",
              width: ring.r * 2,
              height: ring.r * 2,
              left: CENTER - ring.r,
              top: CENTER - ring.r,
              borderRadius: "50%",
              border: `2.5px dashed ${ring.color}`,
              backgroundColor: `${ring.color}0d`,
              boxShadow: `0 0 40px ${ring.color}33`,
            }}
          />
        ))}
        {/* Hardware core */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, type: "spring", damping: 14 }}
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            left: CENTER - 100,
            top: CENTER - 100,
            borderRadius: "50%",
            backgroundColor: "var(--panel)",
            border: "2px solid var(--task)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            boxShadow: "0 0 60px 10px rgba(255, 121, 198, 0.25)",
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <Icon icon="mdi:chip" width={40} height={40} color="var(--task)" />
            <Icon icon="mdi:memory" width={40} height={40} color="var(--task)" />
          </div>
          <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--task)", fontWeight: 800 }}>
            HARDWARE
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>CPU · RAM · devices</div>
        </motion.div>
        {/* Ring labels */}
        <RingLabel angle={-90} r={210} label="KERNEL" color="var(--warn)" icon="mdi:cog-sync-outline" delay={0.5} />
        <RingLabel angle={-90} r={270} label="SHELL" color="var(--accent)" icon="mdi:console" delay={0.7} />
        <RingLabel angle={-90} r={330} label="USER" color="var(--sync)" icon="mdi:account-outline" delay={0.9} />
        {/* Animated command flow: user → shell → kernel → hardware */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <svg width={STAGE} height={STAGE} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <marker id="arrow-flow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="var(--microtask)" />
              </marker>
            </defs>
            {[350, 290, 230, 170].map((y, i) => (
              <motion.line
                key={y}
                x1={CENTER}
                y1={y}
                x2={CENTER}
                y2={y - 30}
                stroke="var(--microtask)"
                strokeWidth={3}
                strokeDasharray="6 4"
                markerEnd="url(#arrow-flow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1.4 + i * 0.25, duration: 0.5 }}
              />
            ))}
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

const RingLabel: React.FC<{
  angle: number;
  r: number;
  label: string;
  color: string;
  icon: string;
  delay: number;
}> = ({ angle, r, label, color, icon, delay }) => {
  const STAGE = 640;
  const CENTER = STAGE / 2;
  const rad = (angle * Math.PI) / 180;
  const cx = CENTER + Math.cos(rad) * r;
  const cy = CENTER + Math.sin(rad) * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", damping: 14 }}
      style={{
        position: "absolute",
        left: cx - 56,
        top: cy - 24,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        backgroundColor: "var(--panel)",
        border: `1.5px solid ${color}`,
        borderRadius: 999,
        boxShadow: `0 0 16px ${color}55`,
      }}
    >
      <Icon icon={icon} width={20} height={20} color={color} />
      <div style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: 2 }}>{label}</div>
    </motion.div>
  );
};

// ── layer stack for slide 6 ──────────────────────────────────────────────

const LayerStack: React.FC = () => {
  const layers = [
    { label: "Upper layer", subtitle: "applications, user interface", color: "var(--microtask)", icon: "mdi:monitor-dashboard" },
    { label: "Middle layer", subtitle: "manages resources", color: "var(--sync)", icon: "mdi:cog-transfer-outline" },
    { label: "Lower layer", subtitle: "CPU, RAM, storage, Hard drive", color: "var(--task)", icon: "mdi:chip" },
  ];
  return (
    <Stagger style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {layers.map((l) => (
        <StaggerItem key={l.label}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 22px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${l.color}`,
              borderRadius: 12,
              boxShadow: `0 0 24px ${l.color}22`,
            }}
          >
            <Icon icon={l.icon} width={36} height={36} color={l.color} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: l.color }}>{l.label}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 2 }}>{l.subtitle}</div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
};

// ── slide 7: layer + school analogy split ────────────────────────────────

const LayerToSchoolRow: React.FC<{
  icon: string;
  label: string;
  color: string;
  schoolIcon: string;
  schoolLabel: string;
  bookText: string;
}> = ({ icon, label, color, schoolIcon, schoolLabel, bookText }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "180px 60px 180px 1fr",
      alignItems: "center",
      gap: 14,
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 12,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon icon={icon} width={30} height={30} color={color} />
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{label}</div>
    </div>
    <motion.div
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}
    >
      <Icon icon="mdi:arrow-right-thick" width={32} height={32} />
    </motion.div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon icon={schoolIcon} width={30} height={30} color={color} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{schoolLabel}</div>
    </div>
    <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>{bookText}</div>
  </div>
);

// ── slide 8: system libs vs device drivers ───────────────────────────────

const LibVsDriverCard: React.FC<{
  icon: string;
  title: string;
  color: string;
  bodyText: string;
  exampleIcon: string;
  exampleLabel: string;
  exampleBody: string;
}> = ({ icon, title, color, bodyText, exampleIcon, exampleLabel, exampleBody }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 0 30px ${color}33`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon icon={icon} width={42} height={42} color={color} />
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{title}</div>
    </div>
    <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.55 }}>{bodyText}</div>
    <div
      style={{
        marginTop: "auto",
        padding: "12px 16px",
        borderLeft: `3px solid ${color}`,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Icon icon={exampleIcon} width={22} height={22} color={color} />
        <div style={{ fontSize: 12, letterSpacing: 2, color, fontWeight: 800 }}>{exampleLabel}</div>
      </div>
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{exampleBody}</div>
    </div>
  </div>
);

// ── slide 9: ACTIVITY box ────────────────────────────────────────────────

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
      <Icon icon="mdi:hand-back-right-outline" width={30} height={30} color="var(--microtask)" />
      <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--microtask)", fontWeight: 800 }}>
        ACTIVITY · TRY THIS AT HOME
      </div>
    </div>
    <div style={{ fontSize: 18, color: "var(--text)", marginBottom: 12 }}>
      <b>Objective:</b> Identify the shell, device driver, and system library used by your computer.
    </div>
    <div style={{ fontSize: 15, color: "var(--muted)", marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
      STEPS
    </div>
    <ol style={{ ...bulletStyle, fontSize: 15, paddingLeft: 24, lineHeight: 1.7 }}>
      <li>Locate the shell on your computer (desktop or command-line).</li>
      <li>Open Device Manager (Windows) or System Information (Mac/Linux).</li>
      <li>Find one hardware device (e.g., printer, keyboard) and note its driver name.</li>
      <li>Open a simple program (e.g., Calculator) and identify one task it performs that may use a system library (e.g., displaying numbers).</li>
      <li>
        Record your findings in a table with these columns:
        <ul style={{ paddingLeft: 22, marginTop: 6 }}>
          <li><b>OS Component</b> (Shell / Device Driver / System Library)</li>
          <li><b>Your Example</b> (e.g., Windows desktop, HP printer driver, Calculator app)</li>
          <li><b>Purpose/Role</b> (what it does in the system).</li>
        </ul>
      </li>
    </ol>
  </div>
);

// ── slide 10: BEYOND THE BOOK, kernels/shells in the wild ────────────────

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
      boxShadow: `0 0 30px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={52} height={52} />
    <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text)" }}>{title}</div>
    <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color, fontWeight: 700 }}>
      {subtitle}
    </div>
    <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>{body}</div>
  </div>
);

// ── slide 11: Tid-Bytes fact rows ────────────────────────────────────────

const FactRow: React.FC<{ icon: string; index: string; body: ReactNode; color: string }> = ({
  icon,
  index,
  body,
  color,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 18,
      padding: "14px 20px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 12,
    }}
  >
    <Icon icon={icon} width={30} height={30} color={color} />
    <div
      style={{
        fontSize: 20,
        fontWeight: 800,
        color,
        fontFamily: "Roboto Mono, monospace",
        letterSpacing: 1,
        minWidth: 34,
      }}
    >
      {index}
    </div>
    <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{body}</div>
  </div>
);

// ── slide 12: Concept tags ───────────────────────────────────────────────

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
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>
        {term}
      </div>
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{def}</div>
    </div>
  </div>
);

// ── slide 13: Q&A rows ───────────────────────────────────────────────────

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

// ── slide 14: next-topic preview card ────────────────────────────────────

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
        1.3
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Process Management
      </div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      Every app you open is a process. How does the OS <b style={hlWarm}>create</b>, <b style={hlWarm}>run</b>, and <b style={hlWarm}>end</b> them? Coming up next.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
      {[
        { icon: "mdi:progress-clock", label: "Lifecycle" },
        { icon: "mdi:sort-numeric-ascending", label: "FCFS scheduling" },
        { icon: "mdi:swap-horizontal-bold", label: "Multitasking" },
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

// ── slide 10 helper: activity guide card ─────────────────────────────────

const ActivityGuideCard: React.FC<{ icon: string; label: string; color: string; sample: string }> = ({
  icon,
  label,
  color,
  sample,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 14px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 10,
    }}
  >
    <Icon icon={icon} width={28} height={28} color={color} />
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color, letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginTop: 2 }}>{sample}</div>
    </div>
  </div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1T12ArchitectureDeck: Deck = {
  title: "Architecture of an Operating System",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.2 · Architecture of an OS",
  topicCode: "1.2",
  topicTitle: "Architecture of an Operating System",
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
              1.2 <span style={{ color: ACCENT }}>Architecture</span> of an Operating System
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroStack />
              </div>
              Every OS is built like a school: layers of people, each with a job.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Definition + school analogy
    {
      id: "definition",
      title: "What is architecture?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.2 Architecture of an Operating System"
          subtitle="Not one giant thing. Many parts, each with a role, working together."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlBlue}>architecture of an operating system</b> is the way how its parts are organized and how they work together. Each part has a special role, and together they make the computer work smoothly, just like a school has different departments that perform specific duties but work together for the smooth working of the school.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:school-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                A SCHOOL HAS MANY DEPARTMENTS
              </span>
            </div>
            <SchoolDepartments />
            <div style={{ fontSize: 17, color: "var(--muted)", textAlign: "center", lineHeight: 1.6, marginTop: 6 }}>
              An OS works the same way. Each part has a role. Coming up: <b style={hlBlue}>kernel</b>, <b style={hlBlue}>shell</b>, <b style={hlBlue}>layers</b>, <b style={hlBlue}>system libraries</b>, and <b style={hlBlue}>device drivers</b>.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Kernel deep dive
    {
      id: "kernel",
      title: "Kernel · the core",
      render: (
        <SlideLayout
          title="I. Kernel"
          subtitle="Hidden inside. Talks to the CPU, the RAM, and every device you own."
          accent="var(--warn)"
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent="var(--warn)">
                <p style={bookQuoteStyle}>
                  The <b style={{ color: "var(--warn)", fontWeight: 700 }}>kernel</b> is the <b>core part of the operating system</b>, that directly controls the computer's system software and hardware such as the <b>CPU, memory, and devices</b>, as shown in Figure 1.1. It decides how and when different programs can use these resources.
                </p>
                <div
                  style={{
                    marginTop: 18,
                    padding: "14px 18px",
                    borderLeft: "3px solid var(--warn)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--warn)", fontWeight: 800, marginBottom: 6 }}>
                    EXAMPLE
                  </div>
                  <div style={{ fontSize: 18, color: "var(--text)", lineHeight: 1.55 }}>
                    When you open a file, the kernel manages the process of reading it from the hard drive and sending it to the screen.
                  </div>
                </div>
              </Card>
            }
            right={
              <div style={{ height: "100%", padding: 6 }}>
                <CarEngineAnalogy />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 4. Shell deep dive
    {
      id: "shell",
      title: "Shell · what you touch",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="II. Shell"
          subtitle="The face of the OS. Everything the user sees, clicks, or types goes through here first."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
            <p style={bookQuoteStyle}>
              The <b style={hlBlue}>shell</b> is the <b>outer part of the OS</b> that interacts with the user, also depicted in Figure 1.1. It receives commands from the user and passes them to the kernel. Shells can be:
            </p>
            <div style={{ flex: 1 }}>
              <ShellComparison />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Figure 1.1 hand-drawn (book diagram, reproduced by hand)
    {
      id: "figure-1-1-hand-drawn",
      title: "Figure 1.1 · book diagram, hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Figure 1.1: the book's own diagram"
          subtitle="Same picture, hand-drawn. Feels like a whiteboard, not a textbook."
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 12,
            }}
          >
            <motion.img
              src="/diagrams/class-10-ch1-t1.2-kernel-shell.svg"
              alt="Figure 1.1: user, shell, kernel, hardware"
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

    // 6. Figure 1.1 animated concentric with command flow
    {
      id: "figure-1-1-animated",
      title: "The flow of a click",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="What actually happens on a click"
          subtitle="A click goes inward. A screen update comes back out."
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, height: "100%" }}>
            <ConcentricArchitecture />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              <div style={{ fontSize: 14, letterSpacing: 2, color: "var(--muted)", fontWeight: 700 }}>
                READ FROM OUTSIDE IN
              </div>
              {[
                { color: "var(--sync)", label: "USER", body: "clicks, types, speaks" },
                { color: "var(--accent)", label: "SHELL", body: "graphical or command-line" },
                { color: "var(--warn)", label: "KERNEL", body: "decides what happens when" },
                { color: "var(--task)", label: "HARDWARE", body: "CPU, RAM, storage, devices" },
              ].map((row, i) => (
                <motion.div
                  key={row.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, type: "spring", damping: 18 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    backgroundColor: "var(--panel)",
                    border: `1px solid ${row.color}55`,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: row.color,
                      boxShadow: `0 0 12px ${row.color}`,
                    }}
                  />
                  <div style={{ fontSize: 15, fontWeight: 800, color: row.color, letterSpacing: 2, minWidth: 96 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 15, color: "var(--muted)" }}>{row.body}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 6. OS Layers intro
    {
      id: "layers-intro",
      title: "OS Layers and Modular Design",
      render: (
        <SlideLayout
          title="OS Layers and Modular Design"
          subtitle="Stack them like floors of a building. Each floor sits on the one below."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  In operating systems, the design is divided into <b style={hlBlue}>layers</b>, where each layer has a specific job.
                </p>
                <p style={{ ...bookQuoteStyle, marginTop: 14, fontSize: 20 }}>
                  Each layer depends on the one below it. This design makes the operating system easier to <b style={hlBlue}>manage</b>, <b style={hlBlue}>repair</b>, and <b style={hlBlue}>improve</b> without changing the whole system.
                </p>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <LayerStack />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 7. Layer detail + school analogy
    {
      id: "layers-school",
      title: "Layers, mapped to a school",
      render: (
        <SlideLayout
          title="Layers, mapped to a school"
          subtitle="Same idea, different clothes. Follow the arrows to see the match."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <LayerToSchoolRow
                icon="mdi:monitor-dashboard"
                label="Upper layer"
                color="var(--microtask)"
                schoolIcon="mdi:school-outline"
                schoolLabel="Teachers and students"
                bookText="Upper layer run applications and provide the interface that the user views on the screen. The teachers and students use these arrangements to teach and learn (like the upper layers running applications and interacting with users)."
              />
            </StaggerItem>
            <StaggerItem>
              <LayerToSchoolRow
                icon="mdi:cog-transfer-outline"
                label="Middle layer"
                color="var(--sync)"
                schoolIcon="mdi:account-tie-outline"
                schoolLabel="Administration"
                bookText="Middle layer manage these resources and make sure programs can use them when needed. The administration manages resources, schedules, and rules (like the middle layers managing memory and storage)."
              />
            </StaggerItem>
            <StaggerItem>
              <LayerToSchoolRow
                icon="mdi:chip"
                label="Lower layer"
                color="var(--task)"
                schoolIcon="mdi:shield-account-outline"
                schoolLabel="Support staff (guards and cleaners)"
                bookText="Lower layer work directly with hardware devices like the CPU, RAM, storage and Hard drive. The support staff (like guards and cleaners) work at the base, keeping the school ready (like the lower layers working with hardware)."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 8. System Libraries + Device Drivers
    {
      id: "libs-drivers",
      title: "System Libraries + Device Drivers",
      render: (
        <SlideLayout
          title="System Libraries and Device Drivers"
          subtitle="Two helpers that make life easier for apps and for hardware."
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, height: "100%" }}>
            <LibVsDriverCard
              icon="mdi:library-outline"
              title="System Libraries"
              color="var(--sync)"
              bodyText="System libraries are collections of ready-made instructions that programs can use to perform common tasks, such as opening files or showing text on the screen."
              exampleIcon="mdi:image-outline"
              exampleLabel="EXAMPLE"
              exampleBody="When a photo editing app needs to open an image, it uses the operating system's library to read the file. This way, the app does not have to create its own method to open pictures."
            />
            <LibVsDriverCard
              icon="mdi:usb-port"
              title="Device Drivers"
              color="var(--microtask)"
              bodyText="Device drivers are special programs that allow the operating system to communicate with hardware devices such as printers, keyboards, and graphics cards."
              exampleIcon="mdi:printer"
              exampleLabel="THREE DEVICES FROM THE BOOK"
              exampleBody="Printers. Keyboards. Graphics cards. Each one has its own driver so the OS can talk to it."
            />
          </div>
        </SlideLayout>
      ),
    },

    // 9. ACTIVITY box + companion guide (fills vertical space with meaningful content)
    {
      id: "activity",
      title: "Activity · Try this at home",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Try this at home"
          subtitle="Find the three parts of your own computer's architecture."
          accent="var(--microtask)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 22, height: "100%" }}>
            <ActivityBox />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center" }}>
              <div style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--muted)", fontWeight: 800 }}>
                WHAT TO LOOK FOR ON YOUR COMPUTER
              </div>
              <ActivityGuideCard
                icon="mdi:apple-keyboard-command"
                label="Shell"
                color="var(--accent)"
                sample="Windows desktop, macOS Finder, Command Prompt, Terminal, PowerShell"
              />
              <ActivityGuideCard
                icon="mdi:usb-port"
                label="Device Driver"
                color="var(--microtask)"
                sample="HP printer driver, NVIDIA GPU driver, USB keyboard driver"
              />
              <ActivityGuideCard
                icon="mdi:library-outline"
                label="System Library"
                color="var(--sync)"
                sample="Calculator app uses an OS library to display numbers. Photos app uses one to open a JPG file."
              />
              <div
                style={{
                  marginTop: 6,
                  padding: "12px 14px",
                  backgroundColor: "rgba(255, 179, 71, 0.10)",
                  borderRadius: 10,
                  border: "1px solid rgba(255, 179, 71, 0.4)",
                }}
              >
                <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800, marginBottom: 4 }}>
                  RECORD IT
                </div>
                <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>
                  Draw a table with columns <b>OS Component</b>, <b>Your Example</b>, <b>Purpose/Role</b>. Fill one row per part.
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK: kernels + shells in the wild
    {
      id: "beyond-book",
      title: "Kernels and shells in the wild",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Kernels and shells you already use"
          accent={ACCENT}
        >
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book names the ideas. Here is where they show up in real products.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:linux-tux"
                title="Linux kernel"
                subtitle="Powers Android, servers, Raspberry Pi"
                body="The most-used kernel on Earth. Same code runs on a $35 Pi, a NASA rover, and the servers behind Google."
                color="var(--sync)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:microsoft-windows-icon"
                title="Windows NT kernel"
                subtitle="Windows 10, 11, Xbox"
                body="Same kernel family since 1993. Handles CPU, memory, and every USB you plug in on more than a billion PCs."
                color="var(--accent)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:apple"
                title="XNU kernel"
                subtitle="macOS, iOS, iPadOS, watchOS"
                body="One kernel shared across your iPhone, iPad, Mac, and Apple Watch. That is why they all feel like family."
                color="var(--microtask)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="mdi:console"
                title="bash and zsh"
                subtitle="Command-line shells on Linux, Mac"
                body="Type a command, press enter, get an answer. bash was born in 1989; zsh became the default on macOS in 2019."
                color="var(--task)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="mdi:powershell"
                title="PowerShell"
                subtitle="Modern shell on Windows"
                body="Microsoft's answer to bash. Works with objects, not just text. Comes preinstalled on Windows 10 and 11."
                color="var(--api)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <WildCard
                icon="logos:android-icon"
                title="Android's full stack"
                subtitle="Linux kernel + Android runtime + apps"
                body="Android is a layered OS in the wild: Linux kernel at the base, hardware abstraction layer above, then Android runtime, framework, and your apps at the top."
                color="var(--warn)"
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. Tid-Bytes
    {
      id: "tid-bytes",
      title: "Tid-Bytes",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Tid-Bytes"
          accent="var(--microtask)"
        >
          <BookExtensionTag color="var(--microtask)" />
          <p style={{ ...bookQuoteStyle, fontSize: 18, color: "var(--muted)", marginBottom: 12 }}>
            Five short facts about the kernel, the shell, and the layers that run the world.
          </p>
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StaggerItem>
              <FactRow
                icon="mdi:code-tags"
                index="01"
                color="var(--sync)"
                body="The Linux kernel is about 30 million lines of code as of 2024, most of it drivers for hardware you have never heard of."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:pig-variant-outline"
                index="02"
                color="var(--api)"
                body="'Kernel' means seed or core, like the edible bit inside a nut. The 'shell' wraps around it."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:history"
                index="03"
                color="var(--microtask)"
                body="The first Unix shell was written by Ken Thompson at Bell Labs in 1971. Every terminal today is a distant cousin of it."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:printer"
                index="04"
                color="var(--warn)"
                body="Windows ships with thousands of built-in drivers. Plug in most printers and the OS installs them silently in seconds."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:phone-outline"
                index="05"
                color="var(--task)"
                body="Every Android phone is a layered OS: Linux kernel at the bottom, hardware abstraction layer above, Android runtime, then the app you tap on top."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Important Concepts
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Important Concepts from 1.2"
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:sitemap-outline"
                term="Architecture of an OS"
                def="The way how its parts are organized and how they work together. Each part has a special role, and together they make the computer work smoothly."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cog-outline"
                term="Kernel"
                def="The core part of the operating system, that directly controls the computer's system software and hardware such as the CPU, memory, and devices."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:apple-keyboard-command"
                term="Shell"
                def="The outer part of the OS that interacts with the user. It receives commands from the user and passes them to the kernel."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:layers-outline"
                term="OS Layers"
                def="Lower layer works with hardware. Middle layer manages these resources. Upper layer runs applications and provides the interface the user views on the screen."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:library-outline"
                term="System Libraries"
                def="Collections of ready-made instructions that programs can use to perform common tasks, such as opening files or showing text on the screen."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:usb-port"
                term="Device Drivers"
                def="Special programs that allow the operating system to communicate with hardware devices such as printers, keyboards, and graphics cards."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Definitions and Important Questions
    {
      id: "questions",
      title: "Definitions and Important Questions",
      render: (
        <SlideLayout
          title="Definitions and Important Questions"
          accent="var(--microtask)"
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
            <StaggerItem>
              <QARow
                q="Define the architecture of an operating system."
                a="The architecture of an operating system is the way how its parts are organized and how they work together. Each part has a special role, and together they make the computer work smoothly."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define the kernel."
                a="The kernel is the core part of the operating system, that directly controls the computer's system software and hardware such as the CPU, memory, and devices. It decides how and when different programs can use these resources."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define the shell and name its two types."
                a="The shell is the outer part of the OS that interacts with the user. It receives commands from the user and passes them to the kernel. Two types: graphical shells (like Windows desktop) and command-line shells (like Command Prompt or Terminal)."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Name the three OS layers and one job each."
                a="Lower layer work directly with hardware devices like the CPU, RAM, storage and Hard drive. Middle layer manage these resources and make sure programs can use them when needed. Upper layer run applications and provide the interface that the user views on the screen."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What are system libraries and device drivers?"
                a="System libraries are collections of ready-made instructions that programs can use to perform common tasks, such as opening files or showing text on the screen. Device drivers are special programs that allow the operating system to communicate with hardware devices such as printers, keyboards, and graphics cards."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 14. Coming up next: 1.3 Process Management
    {
      id: "next-topic",
      title: "Next up: 1.3 Process Management",
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
