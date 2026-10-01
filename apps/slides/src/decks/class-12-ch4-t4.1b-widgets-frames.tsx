/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.1b · Tkinter Widgets + Frames
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: Every heading, definition, CLASS ACTIVITY box, code example,
 * and key-point sentence is copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.1b-widgets-frames.md`.
 * Real-world extensions are clearly labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/research.md
 * Section 3 · 4.1b. 13 slides. Reuses PythonCode + MockWindow helpers from 4.1a style.
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { Card, HeroSlide, SlideLayout, SplitSlide } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

// ── style tokens ─────────────────────────────────────────────────────────

const bookQuoteStyle: CSSProperties = {
  fontSize: 23,
  lineHeight: 1.6,
  color: "var(--text)",
  margin: 0,
};
const hlGold: CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const hlTeal: CSSProperties = { color: "var(--sync)", fontWeight: 700 };
const hlViolet: CSSProperties = { color: "var(--microtask)", fontWeight: 700 };

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
      show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", damping: 18, stiffness: 200 },
      },
    }}
  >
    {children}
  </motion.div>
);

// ── BEYOND THE BOOK pill ────────────────────────────────────────────────

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

// ── Python syntax highlighter (same as 4.1a) ─────────────────────────────

const PY_KEYWORDS = new Set([
  "import",
  "def",
  "return",
  "if",
  "else",
  "elif",
  "as",
  "from",
  "in",
  "for",
  "while",
  "True",
  "False",
  "None",
  "class",
  "pass",
  "break",
  "continue",
  "and",
  "or",
  "not",
  "with",
]);

const PY_BUILTINS = new Set(["print", "len", "range", "str", "int", "float", "list", "dict", "tuple"]);

const PY_COLORS: Record<string, string> = {
  keyword: "var(--accent)",
  string: "var(--sync)",
  comment: "var(--muted)",
  function: "var(--microtask)",
  builtin: "var(--api)",
  number: "var(--task)",
  punct: "var(--text)",
  identifier: "var(--text)",
  whitespace: "var(--text)",
};

function tokenizePython(src: string): { type: string; text: string }[] {
  const out: { type: string; text: string }[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\n" || ch === " " || ch === "\t") {
      let j = i;
      while (j < src.length && (src[j] === " " || src[j] === "\t" || src[j] === "\n")) j++;
      out.push({ type: "whitespace", text: src.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === "#") {
      let j = i;
      while (j < src.length && src[j] !== "\n") j++;
      out.push({ type: "comment", text: src.slice(i, j) });
      i = j;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < src.length && src[j] !== quote) {
        if (src[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, src.length);
      out.push({ type: "string", text: src.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      let type: string = "identifier";
      if (PY_KEYWORDS.has(word)) type = "keyword";
      else if (PY_BUILTINS.has(word)) type = "builtin";
      else if (src[j] === "(") type = "function";
      out.push({ type, text: word });
      i = j;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j]!)) j++;
      out.push({ type: "number", text: src.slice(i, j) });
      i = j;
      continue;
    }
    out.push({ type: "punct", text: ch });
    i++;
  }
  return out;
}

const PythonCode: React.FC<{ source: string; fontSize?: number; maxHeight?: number }> = ({
  source,
  fontSize = 18,
  maxHeight,
}) => {
  const tokens = tokenizePython(source.trim());
  return (
    <pre
      style={{
        margin: 0,
        padding: "20px 26px",
        backgroundColor: "#0b0820",
        border: "1px solid var(--panel-border)",
        borderRadius: 12,
        fontFamily: "Roboto Mono, monospace",
        fontSize,
        lineHeight: 1.45,
        overflow: "auto",
        boxShadow: "0 0 24px rgba(201, 166, 107, 0.15)",
        maxHeight,
      }}
    >
      {tokens.map((t, idx) => (
        <span
          key={idx}
          style={{
            color: PY_COLORS[t.type] ?? "var(--text)",
            fontStyle: t.type === "comment" ? "italic" : undefined,
          }}
        >
          {t.text}
        </span>
      ))}
    </pre>
  );
};

// ── Mock Tkinter window + widget mocks ──────────────────────────────────

const MockWindow: React.FC<{
  title: string;
  children: ReactNode;
  width?: number;
  accent?: string;
}> = ({ title, children, width = 320, accent = "var(--accent)" }) => (
  <div
    style={{
      width,
      borderRadius: 10,
      overflow: "hidden",
      border: `1.5px solid ${accent}`,
      boxShadow: `0 0 32px ${accent}44`,
      backgroundColor: "#f5f0e4",
      color: "#1b1326",
    }}
  >
    <div
      style={{
        padding: "8px 12px",
        backgroundColor: "#2a2340",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#eaddf0",
      }}
    >
      <Icon icon="mdi:leaf" width={16} color={accent} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
      <span
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          fontSize: 15,
          opacity: 0.75,
        }}
      >
        <span>−</span>
        <span>□</span>
        <span>✕</span>
      </span>
    </div>
    {children}
  </div>
);

const MockFrame: React.FC<{
  bg: string;
  height: number;
  label: string;
}> = ({ bg, height, label }) => (
  <div
    style={{
      backgroundColor: bg,
      minHeight: height,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#1b1326",
      fontSize: 16,
      fontWeight: 500,
    }}
  >
    {label}
  </div>
);

const MockLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      textAlign: "center",
      fontSize: 15,
      color: "#1b1326",
      padding: "10px 20px",
    }}
  >
    {children}
  </div>
);

const MockButton: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      alignSelf: "center",
      padding: "6px 18px",
      border: "1px solid #999",
      borderRadius: 3,
      backgroundColor: "#e5dece",
      fontSize: 14,
      fontWeight: 600,
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      display: "inline-block",
      margin: "10px auto",
    }}
  >
    {children}
  </div>
);

const MockEntry: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
  <div
    style={{
      height: 28,
      border: "1px solid #999",
      borderRadius: 2,
      backgroundColor: "#ffffff",
      margin: "8px 20px",
      padding: "4px 8px",
      fontSize: 13,
      color: "#888",
      fontFamily: "sans-serif",
    }}
  >
    {placeholder}
  </div>
);

const MockMenuBar: React.FC = () => (
  <div
    style={{
      backgroundColor: "#e9e4d4",
      padding: "4px 10px",
      display: "flex",
      gap: 16,
      fontSize: 13,
      borderBottom: "1px solid #c9c3b3",
    }}
  >
    {["File", "Edit", "View", "Help"].map((m) => (
      <span key={m} style={{ color: "#1b1326" }}>{m}</span>
    ))}
  </div>
);

const MockListbox: React.FC<{ items: string[] }> = ({ items }) => (
  <div
    style={{
      margin: "10px 20px",
      border: "1px solid #999",
      backgroundColor: "#ffffff",
      fontSize: 14,
      color: "#1b1326",
      fontFamily: "sans-serif",
    }}
  >
    {items.map((item, i) => (
      <div
        key={item}
        style={{
          padding: "4px 10px",
          backgroundColor: i === 1 ? "#3b82f6" : "transparent",
          color: i === 1 ? "#ffffff" : "#1b1326",
        }}
      >
        {item}
      </div>
    ))}
  </div>
);

// ── Benefit / property card ────────────────────────────────────────────

const PropCard: React.FC<{
  icon: string;
  label: string;
  body: string;
  color: string;
}> = ({ icon, label, body, color }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 20,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={40} height={40} color={color} />
    <div style={{ fontSize: 18, fontWeight: 800, color }}>{label}</div>
    <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>{body}</div>
  </div>
);

// ── 5-bullet explanation card ───────────────────────────────────────────

const BuildingBlock: React.FC<{
  index: string;
  icon: string;
  symbol: string;
  explanation: string;
  color: string;
}> = ({ index, icon, symbol, explanation, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: `1px solid ${color}55`,
      borderRadius: 12,
    }}
  >
    <div
      style={{
        minWidth: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: color,
        color: "#0d0a1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 800,
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      {index}
    </div>
    <Icon icon={icon} width={28} height={28} color={color} />
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 17,
          fontWeight: 800,
          color,
          fontFamily: "Roboto Mono, monospace",
          marginBottom: 2,
        }}
      >
        {symbol}
      </div>
      <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.55 }}>{explanation}</div>
    </div>
  </div>
);

// ── Hero visual: Tkinter window divided into 2 colored frames ─────────

const HeroFramedWindow: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: "spring", damping: 16 }}
    >
      <MockWindow title="Tkinter Frames Example" width={400} accent="var(--accent)">
        <MockFrame bg="#aed6f1" height={70} label="Top Frame" />
        <MockFrame bg="#a9dfbf" height={140} label="Bottom Frame" />
      </MockWindow>
    </motion.div>
  </div>
);

// ── Widget deep-dive card ───────────────────────────────────────────────

const WidgetDeepDive: React.FC<{
  name: string;
  color: string;
  icon: string;
  definition: string;
  mock: ReactNode;
}> = ({ name, color, icon, definition, mock }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 14,
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${color}22`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon icon={icon} width={36} height={36} color={color} />
      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "Roboto Mono, monospace" }}>
        {name}
      </div>
    </div>
    <div style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.55 }}>{definition}</div>
    <div
      style={{
        marginTop: "auto",
        padding: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        border: `1px dashed ${color}55`,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 2, color, fontWeight: 800, marginBottom: 8 }}>
        LOOKS LIKE
      </div>
      {mock}
    </div>
  </div>
);

// ── ConceptTag + NextTopicHero ──────────────────────────────────────────

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
      boxShadow: "0 0 60px rgba(228, 183, 255, 0.28)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--microtask)",
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        4.1c
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Layout Management
      </div>
    </div>
    <div
      style={{
        fontSize: 20,
        color: "var(--muted)",
        textAlign: "center",
        maxWidth: 760,
        lineHeight: 1.55,
      }}
    >
      You have widgets and frames. Now meet the <b style={hlViolet}>three ways to place them</b>: <b style={hlViolet}>pack()</b> for simple stacks, <b style={hlViolet}>grid()</b> for tables and forms, and <b style={hlViolet}>place()</b> for exact coordinates.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:view-sequential-outline", label: "pack()" },
        { icon: "mdi:grid", label: "grid()" },
        { icon: "mdi:cursor-move", label: "place()" },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            backgroundColor: "rgba(228, 183, 255, 0.12)",
            border: "1px solid rgba(228, 183, 255, 0.4)",
            borderRadius: 999,
          }}
        >
          <Icon icon={c.icon} width={22} height={22} color="var(--microtask)" />
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--microtask)",
              fontFamily: "Roboto Mono, monospace",
            }}
          >
            {c.label}
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

const FRAMES_CODE = `import tkinter as tk

# Create main window
window = tk.Tk()
window.title("Tkinter Frames Example")
window.geometry("400x300")

# Create top frame
top_frame = tk.Frame(window, bg="lightblue", height=100)
top_frame.pack(fill="x")

# Create bottom frame
bottom_frame = tk.Frame(window, bg="lightgreen", height=200)
bottom_frame.pack(fill="both", expand=True)

# Add widgets to top frame
label_top = tk.Label(top_frame, text="Top Frame", bg="lightblue")
label_top.pack(pady=20)

# Add widgets to bottom frame
label_bottom = tk.Label(bottom_frame, text="Bottom Frame", bg="lightgreen")
label_bottom.pack(pady=50)

# Run the application
window.mainloop()`;

export const class12Ch4T41bWidgetsFramesDeck: Deck = {
  title: "Tkinter Widgets + Frames",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.1b · Widgets + Frames",
  topicCode: "4.1b",
  topicTitle: "Tkinter Widgets + Frames",
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
              4.1b <span style={{ color: ACCENT }}>Widgets</span> +{" "}
              <span style={{ color: ACCENT }}>Frames</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroFramedWindow />
              </div>
              Build your Tkinter UI from reusable blocks: windows, frames, and widgets.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Tkinter Components and Widgets (verbatim)
    {
      id: "widgets-intro",
      title: "Tkinter Components and Widgets",
      transition: "slide",
      render: (
        <SlideLayout
          title="Tkinter Components and Widgets"
          subtitle="Widgets are the building blocks. Combine them to create an interface."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Tkinter provides many components, called <b style={hlGold}>widgets</b>, that help build interactive graphical applications. A program can contain multiple visual elements such as <b>windows, frames, buttons, and text fields</b>. These widgets allow users to <b>enter data, choose options, or perform actions</b>. Each widget has its own purpose, and combining them creates a complete interface. Tkinter also supports <b>layout management</b>, so widgets can be arranged neatly on the screen.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:puzzle-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                WHAT WIDGETS LET USERS DO
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:keyboard-outline"
                  label="Enter data"
                  color="var(--sync)"
                  body="Type in an Entry field, write in a Text box, pick a date."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:format-list-bulleted"
                  label="Choose options"
                  color="var(--microtask)"
                  body="Open a Menu, pick from a Listbox, tick a Checkbutton."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:gesture-tap-button"
                  label="Perform actions"
                  color="var(--api)"
                  body="Click a Button, submit a form, trigger a function."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. CLASS ACTIVITY (verbatim yellow box)
    {
      id: "class-activity",
      title: "Class activity · Try it in class",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Try this in class"
          subtitle="A short exercise from the book. Open your editor and build it live."
          accent="var(--microtask)"
        >
          <div
            style={{
              padding: "28px 32px",
              backgroundColor: "rgba(228, 183, 255, 0.08)",
              border: "1.5px solid rgba(228, 183, 255, 0.45)",
              borderRadius: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <Icon
                icon="mdi:hand-back-right-outline"
                width={32}
                height={32}
                color="var(--microtask)"
              />
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 3,
                  color: "var(--microtask)",
                  fontWeight: 800,
                }}
              >
                CLASS ACTIVITY
              </div>
            </div>
            <div style={{ fontSize: 24, color: "var(--text)", lineHeight: 1.55, marginBottom: 20 }}>
              Create a main window and divide it into two frames. Add different widgets in each frame to organize layout.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
                marginTop: 10,
              }}
            >
              {[
                { step: "1", text: "Create window with tk.Tk()", icon: "mdi:window-restore" },
                { step: "2", text: "Add 2 Frames (top + bottom)", icon: "mdi:view-grid-outline" },
                { step: "3", text: "Add widgets inside each frame", icon: "mdi:puzzle-outline" },
              ].map((s) => (
                <div
                  key={s.step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    backgroundColor: "var(--panel)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "var(--microtask)",
                      color: "#0d0a1c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 800,
                      fontFamily: "Roboto Mono, monospace",
                    }}
                  >
                    {s.step}
                  </div>
                  <Icon icon={s.icon} width={24} height={24} color="var(--microtask)" />
                  <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.4 }}>{s.text}</div>
                </div>
              ))}
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 4. Creating Windows + Adding Frames (verbatim)
    {
      id: "windows-frames",
      title: "Creating Windows and Adding Frames",
      render: (
        <SlideLayout
          title="Creating Windows and Adding Frames"
          subtitle="The main window is the base. Frames split it into neat sections."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  A Tkinter program begins by creating a <b style={hlGold}>main window</b>, which serves as the <b>base for all other elements</b>. The window can be <b>resized</b>, given a <b>title</b>, and designed to hold different widgets. <b style={hlGold}>Frames</b> are <b>sections within the window</b> that help organize content. Frames divide the window into smaller parts, making it easier to group related widgets. This structure improves clarity and keeps the interface well-arranged.
                </p>
              </Card>
            }
            right={
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 2.5,
                    color: "var(--muted)",
                    fontWeight: 700,
                  }}
                >
                  THE HIERARCHY
                </div>
                <div
                  style={{
                    width: 340,
                    padding: 20,
                    backgroundColor: "var(--panel)",
                    border: "2px solid var(--accent)",
                    borderRadius: 12,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    boxShadow: "0 0 30px rgba(201, 166, 107, 0.3)",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      backgroundColor: "rgba(201, 166, 107, 0.18)",
                      border: "1px solid var(--accent)",
                      color: "var(--accent)",
                      fontFamily: "Roboto Mono, monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    window = tk.Tk()
                  </div>
                  <Icon
                    icon="mdi:arrow-down-thick"
                    width={22}
                    height={22}
                    color="var(--muted)"
                    style={{ margin: "0 auto" }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["top_frame", "bottom_frame"].map((f) => (
                      <div
                        key={f}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          backgroundColor: "rgba(228, 183, 255, 0.14)",
                          border: "1px solid var(--microtask)",
                          color: "var(--microtask)",
                          fontFamily: "Roboto Mono, monospace",
                          fontSize: 12,
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                  <Icon
                    icon="mdi:arrow-down-thick"
                    width={22}
                    height={22}
                    color="var(--muted)"
                    style={{ margin: "0 auto" }}
                  />
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      backgroundColor: "rgba(103, 216, 196, 0.18)",
                      border: "1px solid var(--sync)",
                      color: "var(--sync)",
                      fontSize: 13,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    widgets (Label · Button · Entry · ...)
                  </div>
                </div>
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 5. Hand-drawn widget tree diagram
    {
      id: "widget-tree-hand-drawn",
      title: "Widget tree · hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="The Tkinter widget tree, hand-drawn"
          subtitle="Window at the top. Frames in the middle. Widgets at the bottom. The 5 common widgets listed on the right."
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: 8,
            }}
          >
            <motion.img
              src="/diagrams/class-12-ch4-t4.1b-widget-tree.svg"
              alt="Hand-drawn Tkinter widget tree: window, frames, widgets"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 18, stiffness: 140 }}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                filter: "drop-shadow(0 0 40px rgba(201, 166, 107, 0.18))",
              }}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 6. Frames code example
    {
      id: "frames-code",
      title: "Example · Tkinter Frames Example",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: Tkinter Frames Example"
          subtitle="Code on the left, two coloured frames on the right."
          accent={ACCENT}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: 28,
              height: "100%",
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                  flex: "none",
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={FRAMES_CODE} fontSize={16} maxHeight={740} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                OUTPUT · WHAT YOU SEE
              </div>
              <MockWindow title="Tkinter Frames Example" width={340}>
                <MockFrame bg="#aed6f1" height={70} label="Top Frame" />
                <MockFrame bg="#a9dfbf" height={150} label="Bottom Frame" />
              </MockWindow>
              <div
                style={{
                  fontSize: 15,
                  color: "var(--muted)",
                  textAlign: "center",
                  lineHeight: 1.5,
                  maxWidth: 300,
                }}
              >
                Window is <b style={{ color: "var(--accent)" }}>400 x 300 px</b>. Top frame fills the width; bottom frame fills the rest.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 6. The 5-bullet explanation (verbatim)
    {
      id: "frames-5-bullets",
      title: "Frames code · 5-bullet summary",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="The 5 things the Frames example teaches"
          subtitle="Verbatim from the book."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <BuildingBlock
                index="1"
                icon="mdi:window-restore"
                symbol="Tk()"
                explanation="creates main window"
                color="var(--accent)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="2"
                icon="mdi:view-grid-outline"
                symbol="Frame"
                explanation="divides window into sections"
                color="var(--sync)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="3"
                icon="mdi:format-rotate-90"
                symbol="top_frame and bottom_frame"
                explanation="organize layout"
                color="var(--microtask)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="4"
                icon="mdi:select-place"
                symbol="pack()"
                explanation="places frames and widgets"
                color="var(--api)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="5"
                icon="mdi:broom"
                symbol="Frames"
                explanation="help keep the GUI clean and well-structured"
                color="var(--task)"
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 7. Common widgets overview (5 heroes, verbatim)
    {
      id: "common-widgets-overview",
      title: "Common Widgets · 5 heroes",
      render: (
        <SlideLayout
          title="Common Widgets: Labels, Buttons, Entry Fields, Menus, and List boxes"
          subtitle="Verbatim from the book. One sentence per widget."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ ...bookQuoteStyle, fontSize: 20 }}>
              Widgets are the basic elements used to build a graphical user interface.
            </p>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:form-textbox"
                  label="Label"
                  color="var(--accent)"
                  body="A Label is used to display text or messages on the screen."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:gesture-tap-button"
                  label="Button"
                  color="var(--sync)"
                  body="A Button allows the user to perform an action when it is clicked."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:form-textbox-password"
                  label="Entry"
                  color="var(--microtask)"
                  body="An Entry field is used to enter text, such as a name or password."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:menu"
                  label="Menu"
                  color="var(--api)"
                  body="A Menu provides a list of options at the top of the window."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:format-list-bulleted"
                  label="Listbox"
                  color="var(--task)"
                  body="A Listbox shows a list of items and allows selection from the list."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Widget deep dive: Label
    {
      id: "widget-label",
      title: "Widget · Label",
      render: (
        <SlideLayout
          title="Widget 1 · Label"
          subtitle="Shows text. The simplest widget. Every Tkinter app uses one."
          accent="var(--accent)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, height: "100%" }}>
            <WidgetDeepDive
              name="Label"
              color="var(--accent)"
              icon="mdi:form-textbox"
              definition='A Label is used to display text or messages on the screen.'
              mock={
                <MockWindow title="Label demo" width={260}>
                  <MockLabel>Welcome, Student!</MockLabel>
                  <MockLabel>Chapter 4 · Tkinter</MockLabel>
                </MockWindow>
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1px solid var(--panel-border)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "var(--accent)",
                  fontWeight: 800,
                }}
              >
                MINIMAL CODE
              </div>
              <PythonCode
                source={`label = tk.Label(window, text="Welcome, Student!")
label.pack()`}
                fontSize={16}
              />
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55 }}>
                Two lines. Create the Label, then <b style={hlGold}>pack()</b> it into the window.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. Widget deep dive: Button + Entry
    {
      id: "widget-button-entry",
      title: "Widget · Button + Entry",
      render: (
        <SlideLayout
          title="Widget 2 and 3 · Button + Entry"
          subtitle="Two widgets that make the window actually do something."
          accent="var(--sync)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, height: "100%" }}>
            <WidgetDeepDive
              name="Button"
              color="var(--sync)"
              icon="mdi:gesture-tap-button"
              definition="A Button allows the user to perform an action when it is clicked."
              mock={
                <MockWindow title="Button demo" width={260}>
                  <MockButton>Save</MockButton>
                  <MockButton>Delete</MockButton>
                </MockWindow>
              }
            />
            <WidgetDeepDive
              name="Entry"
              color="var(--microtask)"
              icon="mdi:form-textbox-password"
              definition="An Entry field is used to enter text, such as a name or password."
              mock={
                <MockWindow title="Entry demo" width={260}>
                  <MockLabel>Name</MockLabel>
                  <MockEntry placeholder="Type here..." />
                  <MockLabel>Password</MockLabel>
                  <MockEntry placeholder="••••••" />
                </MockWindow>
              }
            />
          </div>
        </SlideLayout>
      ),
    },

    // 10. Widget deep dive: Menu + Listbox
    {
      id: "widget-menu-listbox",
      title: "Widget · Menu + Listbox",
      render: (
        <SlideLayout
          title="Widget 4 and 5 · Menu + Listbox"
          subtitle="Both show lists of options. Menu lives at the top; Listbox lives inside."
          accent="var(--api)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, height: "100%" }}>
            <WidgetDeepDive
              name="Menu"
              color="var(--api)"
              icon="mdi:menu"
              definition="A Menu provides a list of options at the top of the window."
              mock={
                <MockWindow title="Menu demo" width={280}>
                  <MockMenuBar />
                  <MockLabel>Main content area</MockLabel>
                </MockWindow>
              }
            />
            <WidgetDeepDive
              name="Listbox"
              color="var(--task)"
              icon="mdi:format-list-bulleted"
              definition="A Listbox shows a list of items and allows selection from the list."
              mock={
                <MockWindow title="Listbox demo" width={280}>
                  <MockLabel>Pick a colour</MockLabel>
                  <MockListbox items={["Red", "Green", "Blue", "Yellow"]} />
                </MockWindow>
              }
            />
          </div>
        </SlideLayout>
      ),
    },

    // 11. BEYOND THE BOOK: more Tkinter widgets
    {
      id: "beyond-book",
      title: "More Tkinter widgets you can use",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Tkinter has many more widgets than 5" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book covers 5 common widgets. Here are 6 more that ship with Tkinter and are useful in real apps.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:checkbox-marked-outline"
                label="Checkbutton"
                color="var(--accent)"
                body="A tick-box. User turns it on or off. Great for 'I agree' or multi-select settings."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:radiobox-marked"
                label="Radiobutton"
                color="var(--sync)"
                body="Pick ONE option from a group. Perfect for Yes/No, Male/Female, size S/M/L."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:text-box-multiple-outline"
                label="Text"
                color="var(--microtask)"
                body="Multi-line text box. Entry is one line; Text is for paragraphs, notes, essays."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:tune-vertical"
                label="Scale"
                color="var(--api)"
                body="A slider for picking a number in a range. Volume, brightness, zoom level."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:format-color-fill"
                label="Canvas"
                color="var(--task)"
                body="Draw shapes, lines, images. Used for simple paint apps, charts, games."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:window-maximize"
                label="Toplevel"
                color="var(--warn)"
                body="A second window. Pop up a dialog or a settings page on top of the main window."
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 16,
              padding: "14px 18px",
              backgroundColor: "rgba(228, 183, 255, 0.08)",
              border: "1px dashed rgba(228, 183, 255, 0.5)",
              borderRadius: 10,
              fontSize: 14,
              color: "var(--text)",
              lineHeight: 1.55,
            }}
          >
            <b style={hlViolet}>Also worth knowing</b>: <b style={hlGold}>ttk</b> is a themed version of these widgets with a more modern look (`from tkinter import ttk; ttk.Button(...)`), and <b style={hlGold}>tk.messagebox</b> gives you one-line pop-up dialogs (used in the Login Form example coming in 4.1d).
          </div>
        </SlideLayout>
      ),
    },

    // 12. Important Concepts
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout title="Important Concepts from 4.1b" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:puzzle-outline"
                term="Widget"
                def="A component that helps build interactive graphical applications. Allows users to enter data, choose options, or perform actions."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:view-grid-outline"
                term="Frame"
                def="A section within the window that helps organize content. Frames divide the window into smaller parts, making it easier to group related widgets."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:form-textbox"
                term="Label"
                def="A Label is used to display text or messages on the screen."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:gesture-tap-button"
                term="Button"
                def="A Button allows the user to perform an action when it is clicked."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:form-textbox-password"
                term="Entry"
                def="An Entry field is used to enter text, such as a name or password."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:format-list-bulleted"
                term="Menu + Listbox"
                def="A Menu provides a list of options at the top of the window. A Listbox shows a list of items and allows selection from the list."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Coming up next: 4.1c Layout Management
    {
      id: "next-topic",
      title: "Next up: 4.1c Layout Management",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Coming up next" accent="var(--microtask)">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <NextTopicHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
