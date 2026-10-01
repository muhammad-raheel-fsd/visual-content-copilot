/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.1c · Layout Management (pack, grid, place)
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: Every heading, definition, TIDBIT, code example, and key-point
 * sentence is copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.1c-layout-management.md`.
 * Real-world extensions clearly labelled BEYOND THE BOOK.
 *
 * Research plan: ../research.md · section 3 · 4.1c. 13 slides initially; agent in
 * background will produce Figure 4.2 hand-drawn to add as slide 5b.
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

// ── Python syntax highlighter (same shape as 4.1a / 4.1b) ────────────────

const PY_KEYWORDS = new Set([
  "import", "def", "return", "if", "else", "elif", "as", "from", "in", "for",
  "while", "True", "False", "None", "class", "pass", "break", "continue",
  "and", "or", "not", "with",
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

// ── Mock Tkinter window + button ────────────────────────────────────────

const MockWindow: React.FC<{
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
  accent?: string;
}> = ({ title, children, width = 260, height, accent = "var(--accent)" }) => (
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
      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "Roboto Mono, monospace" }}>
        {title}
      </span>
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
    <div style={{ height }}>{children}</div>
  </div>
);

const MockBtn: React.FC<{
  children: ReactNode;
  width?: number;
  style?: CSSProperties;
}> = ({ children, width = 90, style }) => (
  <div
    style={{
      display: "inline-block",
      width,
      padding: "4px 8px",
      border: "1px solid #999",
      borderRadius: 3,
      backgroundColor: "#e5dece",
      fontSize: 13,
      fontWeight: 600,
      textAlign: "center",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
      color: "#1b1326",
      ...style,
    }}
  >
    {children}
  </div>
);

// Pack layout: 3 buttons stacked vertically with pady=10
const PackOutput: React.FC = () => (
  <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <MockBtn width={120}>Button 1</MockBtn>
    <MockBtn width={120}>Button 2</MockBtn>
    <MockBtn width={120}>Button 3</MockBtn>
  </div>
);

// Grid layout: 2 buttons in row 0, 1 button spanning row 1
const GridOutput: React.FC = () => (
  <div
    style={{
      padding: "20px 10px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
    }}
  >
    <MockBtn width={100}>Button 1</MockBtn>
    <MockBtn width={100}>Button 2</MockBtn>
    <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
      <MockBtn width={220}>Button 3</MockBtn>
    </div>
  </div>
);

// Place layout: 3 buttons at specific x,y
const PlaceOutput: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: 180,
    }}
  >
    <div style={{ position: "absolute", left: 15, top: 20 }}>
      <MockBtn width={90}>Button 1</MockBtn>
    </div>
    <div style={{ position: "absolute", left: 125, top: 65 }}>
      <MockBtn width={90}>Button 2</MockBtn>
    </div>
    <div style={{ position: "absolute", left: 15, top: 120 }}>
      <MockBtn width={90}>Button 3</MockBtn>
    </div>
  </div>
);

// ── PropCard ────────────────────────────────────────────────────────────

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

// ── Method overview card (slide 4) ──────────────────────────────────────

const MethodCard: React.FC<{
  name: string;
  color: string;
  icon: string;
  oneLiner: string;
  bestFor: string;
}> = ({ name, color, icon, oneLiner, bestFor }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 22,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${color}33`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon icon={icon} width={36} height={36} color={color} />
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {name}
      </div>
    </div>
    <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{oneLiner}</div>
    <div
      style={{
        marginTop: "auto",
        padding: "8px 12px",
        backgroundColor: `${color}18`,
        border: `1px solid ${color}55`,
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 2, color, fontWeight: 800, marginBottom: 4 }}>
        BEST FOR
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{bestFor}</div>
    </div>
  </div>
);

// ── Compare row (for slide 9) ───────────────────────────────────────────

const CompareRow: React.FC<{
  label: string;
  pack: string;
  grid: string;
  place: string;
}> = ({ label, pack, grid, place }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "150px 1fr 1fr 1fr",
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
    <div style={{ fontSize: 15, color: "var(--accent)", fontWeight: 600 }}>{pack}</div>
    <div style={{ fontSize: 15, color: "var(--sync)", fontWeight: 600 }}>{grid}</div>
    <div style={{ fontSize: 15, color: "var(--microtask)", fontWeight: 600 }}>{place}</div>
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
      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", marginBottom: 4 }}>
        {term}
      </div>
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
        4.1d
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Event Handling + Login Form
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
      Static UI is boring. Make your window <b style={hlViolet}>respond to clicks and keypresses</b> with event-driven programming. We will build a working <b style={hlViolet}>Login Form</b> that shows success or error pop-ups.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:cursor-default-click", label: "Events" },
        { icon: "mdi:cog-sync-outline", label: "command=" },
        { icon: "mdi:form-textbox-password", label: "Login Form" },
        { icon: "mdi:message-alert-outline", label: "messagebox" },
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
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--microtask)" }}>{c.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── Code examples (verbatim from book) ───────────────────────────────────

const PACK_CODE = `import tkinter as tk

# Create main window
window = tk.Tk()
window.title("pack()")
window.geometry("300x220")

# Create buttons
button1 = tk.Button(window, text="Button 1", width=12)
button2 = tk.Button(window, text="Button 2", width=12)
button3 = tk.Button(window, text="Button 3", width=12)

# Arrange buttons using pack()
button1.pack(pady=10)
button2.pack(pady=10)
button3.pack(pady=10)

# Run the application
window.mainloop()`;

const GRID_CODE = `import tkinter as tk

# Create main window
window = tk.Tk()
window.title("grid()")
window.geometry("300x220")

# Create buttons
button1 = tk.Button(window, text="Button 1", width=10)
button2 = tk.Button(window, text="Button 2", width=10)
button3 = tk.Button(window, text="Button 3", width=24)

# Arrange buttons using grid()
button1.grid(row=0, column=0, padx=10, pady=20)
button2.grid(row=0, column=1, padx=10, pady=20)

# Button 3 spans two columns
button3.grid(row=1, column=0, columnspan=2, padx=10, pady=10)

# Keep content centred
window.grid_columnconfigure(0, weight=1)
window.grid_columnconfigure(1, weight=1)

# Run the application
window.mainloop()`;

const PLACE_CODE = `import tkinter as tk

# Create main window
window = tk.Tk()
window.title("place()")
window.geometry("300x220")

# Create buttons
button1 = tk.Button(window, text="Button 1", width=10)
button2 = tk.Button(window, text="Button 2", width=10)
button3 = tk.Button(window, text="Button 3", width=10)

# Arrange buttons using place()
button1.place(x=30, y=40)
button2.place(x=170, y=85)
button3.place(x=30, y=140)

# Run the application
window.mainloop()`;

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4T41cLayoutManagementDeck: Deck = {
  title: "Layout Management (pack, grid, place)",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.1c · Layout Management",
  topicCode: "4.1c",
  topicTitle: "Layout Management (pack, grid, place)",
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
              4.1c <span style={{ color: ACCENT }}>Layout</span> Management
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                <MockWindow title="pack()" width={220} accent="var(--accent)">
                  <PackOutput />
                </MockWindow>
                <MockWindow title="grid()" width={220} accent="var(--sync)">
                  <GridOutput />
                </MockWindow>
                <MockWindow title="place()" width={220} accent="var(--microtask)">
                  <PlaceOutput />
                </MockWindow>
              </div>
              Three ways to place widgets. Each has its own personality.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Layout management intro (verbatim)
    {
      id: "layout-intro",
      title: "Layout Management",
      transition: "slide",
      render: (
        <SlideLayout
          title="Layout Management"
          subtitle="Arrange widgets properly. Pick the position and size of each one."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>Layout management</b> is used to arrange widgets inside a window in a proper way. It decides the <b>position and size</b> of each widget on the screen. Good layout management makes the interface <b>clear and easy to use</b>. It also helps in keeping the window <b>organized</b>. Tkinter provides different methods to manage layout. Each method has its own way of placing widgets.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:view-dashboard-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                WHAT LAYOUT MANAGEMENT DECIDES
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:crosshairs-gps"
                  label="Position"
                  color="var(--accent)"
                  body="Where each widget sits on the window."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:arrow-expand-all"
                  label="Size"
                  color="var(--sync)"
                  body="How big each widget appears."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:eye-outline"
                  label="Clear + easy"
                  color="var(--microtask)"
                  body="Interface is clear and easy to use."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:broom"
                  label="Organized"
                  color="var(--api)"
                  body="Keeps the window neat and tidy."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. TIDBIT
    {
      id: "tidbit",
      title: "Tidbit · why layout matters",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="TIDBIT"
          subtitle="A one-line reminder from the book, in a pink box."
          accent="var(--task)"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 16 }}
              style={{
                padding: "36px 48px",
                maxWidth: 1100,
                backgroundColor: "rgba(255, 141, 161, 0.08)",
                border: "2px solid var(--task)",
                borderRadius: 20,
                boxShadow: "0 0 60px rgba(255, 141, 161, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Icon icon="mdi:lightbulb-on-outline" width={64} height={64} color="var(--task)" />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    letterSpacing: 3,
                    color: "var(--task)",
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  TIDBIT
                </div>
                <div style={{ fontSize: 28, color: "var(--text)", lineHeight: 1.5 }}>
                  Proper layout management helps make applications look <b style={{ color: "var(--task)" }}>neat</b> and work well on <b style={{ color: "var(--task)" }}>different screen sizes</b>.
                </div>
              </div>
            </motion.div>
          </div>
        </SlideLayout>
      ),
    },

    // 4. The 3 methods overview (verbatim one-liners)
    {
      id: "three-methods",
      title: "Organizing Elements · pack, grid, place",
      render: (
        <SlideLayout
          title="Organizing Elements using pack(), grid(), and place()"
          subtitle="Three methods. Three personalities. Verbatim from the book."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Tkinter provides <b style={hlGold}>three ways</b> to arrange widgets. Each is a Python method you call on the widget.
            </p>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              <StaggerItem style={{ height: "100%" }}>
                <MethodCard
                  name="pack()"
                  color="var(--accent)"
                  icon="mdi:view-sequential-outline"
                  oneLiner="Places widgets in a simple vertical or horizontal order. Easy to use and works well for small applications."
                  bestFor="Small apps with a quick vertical or horizontal stack."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <MethodCard
                  name="grid()"
                  color="var(--sync)"
                  icon="mdi:grid"
                  oneLiner="Arranges widgets in rows and columns like a table. Useful for forms and structured layouts."
                  bestFor="Forms, login screens, structured tables."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <MethodCard
                  name="place()"
                  color="var(--microtask)"
                  icon="mdi:cursor-move"
                  oneLiner="Positions widgets at exact locations on the window (as shown in Figure 4.2). More control but needs careful adjustment."
                  bestFor="When you need pixel-perfect positioning (rare)."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Figure 4.2 inline recreation
    {
      id: "figure-4-2",
      title: "Figure 4.2 · the three layouts side by side",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Figure 4.2: Tkinter Layout Managers"
          subtitle="Three windows. Same 3 buttons. Three different arrangements."
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              gap: 24,
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: 10,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <MockWindow title="pack()" width={260} accent="var(--accent)">
                <PackOutput />
              </MockWindow>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(201, 166, 107, 0.14)",
                  border: "1px solid var(--accent)",
                  fontSize: 13,
                  color: "var(--accent)",
                  fontWeight: 700,
                }}
              >
                vertical or horizontal stack
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <MockWindow title="grid()" width={260} accent="var(--sync)">
                <GridOutput />
              </MockWindow>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(103, 216, 196, 0.14)",
                  border: "1px solid var(--sync)",
                  fontSize: 13,
                  color: "var(--sync)",
                  fontWeight: 700,
                }}
              >
                rows and columns
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <MockWindow title="place()" width={260} accent="var(--microtask)">
                <PlaceOutput />
              </MockWindow>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: "rgba(228, 183, 255, 0.14)",
                  border: "1px solid var(--microtask)",
                  fontSize: 13,
                  color: "var(--microtask)",
                  fontWeight: 700,
                }}
              >
                exact x,y coordinates
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 24,
              padding: "14px 20px",
              backgroundColor: "rgba(201, 166, 107, 0.08)",
              border: "1px dashed var(--accent)",
              borderRadius: 10,
              fontSize: 16,
              color: "var(--text)",
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Choose based on your need: <b style={hlGold}>simplicity</b> (pack) · <b style={hlTeal}>structure</b> (grid) · <b style={hlViolet}>precision</b> (place).
          </div>
        </SlideLayout>
      ),
    },

    // 5b. Figure 4.2 hand-drawn (Excalidraw-rendered)
    {
      id: "figure-4-2-handdrawn",
      title: "Figure 4.2 · hand-drawn",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Figure 4.2: Tkinter Layout Managers (hand-drawn)"
          subtitle="The same three managers, sketched on the whiteboard."
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 0,
            }}
          >
            <motion.img
              src="/diagrams/class-12-ch4-t4.1c-layout-managers.svg"
              alt="Hand-drawn Figure 4.2: pack(), grid(), place() layouts side by side"
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

    // 6. pack() deep dive
    {
      id: "pack-example",
      title: "Example · pack()",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: pack()"
          subtitle="Three buttons stacked top-to-bottom with 10 pixels of vertical padding."
          accent="var(--accent)"
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--accent)",
                  fontWeight: 800,
                  flex: "none",
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={PACK_CODE} fontSize={16} maxHeight={720} />
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
                OUTPUT
              </div>
              <MockWindow title="pack()" width={300}>
                <PackOutput />
              </MockWindow>
              <div
                style={{
                  fontSize: 15,
                  color: "var(--muted)",
                  textAlign: "center",
                  maxWidth: 280,
                  lineHeight: 1.5,
                }}
              >
                Call <b style={{ color: "var(--accent)" }}>.pack()</b> on each widget. They stack in the order you call them.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 7. grid() deep dive
    {
      id: "grid-example",
      title: "Example · grid()",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: grid()"
          subtitle="Two buttons in row 0. Button 3 spans both columns in row 1."
          accent="var(--sync)"
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                  flex: "none",
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={GRID_CODE} fontSize={14} maxHeight={760} />
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
                OUTPUT
              </div>
              <MockWindow title="grid()" width={300}>
                <GridOutput />
              </MockWindow>
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "rgba(103, 216, 196, 0.1)",
                  border: "1px dashed var(--sync)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.5,
                  maxWidth: 280,
                }}
              >
                <b style={hlTeal}>columnspan=2</b> stretches Button 3 across both columns. <b style={hlTeal}>grid_columnconfigure(0, weight=1)</b> keeps content centred when the window grows.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. place() deep dive
    {
      id: "place-example",
      title: "Example · place()",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: place()"
          subtitle="Three buttons placed by hand at exact x,y pixel coordinates."
          accent="var(--microtask)"
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
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--microtask)",
                  fontWeight: 800,
                  flex: "none",
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={PLACE_CODE} fontSize={16} maxHeight={720} />
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
                  color: "var(--microtask)",
                  fontWeight: 800,
                }}
              >
                OUTPUT
              </div>
              <MockWindow title="place()" width={300}>
                <PlaceOutput />
              </MockWindow>
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "rgba(228, 183, 255, 0.1)",
                  border: "1px dashed var(--microtask)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "var(--text)",
                  lineHeight: 1.5,
                  maxWidth: 280,
                }}
              >
                <b style={hlViolet}>x,y</b> are pixels from the top-left. Full control, but you must do the maths yourself.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. Compare the 3
    {
      id: "compare-3",
      title: "pack vs grid vs place",
      render: (
        <SlideLayout
          title="The three managers compared"
          subtitle="Same job. Very different trade-offs. Pick the one that fits."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr 1fr 1fr",
                gap: 12,
                padding: "10px 16px",
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 800,
                color: "var(--muted)",
                borderBottom: "2px solid var(--panel-border)",
              }}
            >
              <div>PROPERTY</div>
              <div style={{ color: "var(--accent)" }}>pack()</div>
              <div style={{ color: "var(--sync)" }}>grid()</div>
              <div style={{ color: "var(--microtask)" }}>place()</div>
            </div>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <StaggerItem>
                <CompareRow
                  label="ORDER"
                  pack="simple vertical or horizontal"
                  grid="rows and columns like a table"
                  place="exact x,y coordinates"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="EASE OF USE"
                  pack="easy, 2 lines per widget"
                  grid="medium, pick row + column"
                  place="hardest, you calculate positions"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="BEST FOR"
                  pack="small applications"
                  grid="forms and structured layouts"
                  place="pixel-perfect designs"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="CONTROL"
                  pack="low (auto)"
                  grid="medium (align to a table)"
                  place="high (every pixel)"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="RISK"
                  pack="widgets stack in call order"
                  grid="pick same row/column twice = overlap"
                  place="forgot screen size = off-screen"
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 10. Designing Clean and Responsive Interfaces (verbatim)
    {
      id: "clean-responsive",
      title: "Designing Clean and Responsive Interfaces",
      render: (
        <SlideLayout
          title="Designing Clean and Responsive Interfaces"
          subtitle="A good interface is well-arranged, easy to read, and works on every screen size."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlGold}>clean interface</b> has well-arranged widgets and enough <b>space between them</b>. Text and buttons should be <b>clear and easy to read</b>. <b style={hlGold}>Responsive interfaces</b> adjust their layout when the window size changes. This helps the program work well on <b>different screen sizes</b>. Proper <b>alignment</b> improves the overall look of the application. Simple design makes the interface <b>user-friendly</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:check-circle-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                SIX RULES FOR A GOOD INTERFACE
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:space-invaders"
                  label="Enough space"
                  color="var(--accent)"
                  body="Widgets have breathing room, not cramped."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:format-size"
                  label="Clear + readable"
                  color="var(--sync)"
                  body="Text and buttons are easy to see and understand."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:resize"
                  label="Responsive"
                  color="var(--microtask)"
                  body="Layout adjusts when the window size changes."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:devices"
                  label="Many screen sizes"
                  color="var(--api)"
                  body="Works well on different displays."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:align-vertical-center"
                  label="Proper alignment"
                  color="var(--task)"
                  body="Items line up neatly, improving the look."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:emoticon-happy-outline"
                  label="User-friendly"
                  color="var(--warn)"
                  body="Simple design beats fancy complexity."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 11. BEYOND THE BOOK
    {
      id: "beyond-book",
      title: "Rules of thumb from real Tkinter devs",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Pro tips the book does not mention" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book teaches the three methods. Here are four rules real Tkinter devs follow to avoid common bugs.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:alert-circle-outline"
                label="Never mix pack and grid"
                color="var(--warn)"
                body="Inside the same parent widget, pick ONE method. Mixing pack() and grid() in the same window freezes Tkinter (it never finishes figuring out positions)."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:resize"
                label="Use weight for responsive"
                color="var(--sync)"
                body="grid_rowconfigure(..., weight=1) and grid_columnconfigure(..., weight=1) tell Tkinter which rows/columns should grow when the window is resized."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:palette-outline"
                label="ttk themed widgets"
                color="var(--microtask)"
                body="`from tkinter import ttk` gives you themed widgets (ttk.Button, ttk.Entry) that look modern on every OS. Same layout methods still apply."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:crosshairs-off"
                label="Avoid place() for whole UIs"
                color="var(--task)"
                body="Use place() only for small details (overlays, custom tweaks). A full UI built with place() breaks the moment the user resizes the window."
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
              padding: "14px 18px",
              backgroundColor: "rgba(228, 183, 255, 0.08)",
              border: "1px dashed rgba(228, 183, 255, 0.5)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              lineHeight: 1.55,
            }}
          >
            <b style={hlViolet}>Rule of thumb:</b> start with pack() for prototypes, switch to grid() when you build a real form, reach for place() only if you need pixel precision.
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
        <SlideLayout title="Important Concepts from 4.1c" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:view-dashboard-outline"
                term="Layout management"
                def="Used to arrange widgets inside a window in a proper way. Decides the position and size of each widget on the screen."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:view-sequential-outline"
                term="pack()"
                def="Places widgets in a simple vertical or horizontal order. Easy to use and works well for small applications."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:grid"
                term="grid()"
                def="Arranges widgets in rows and columns like a table. Useful for forms and structured layouts."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cursor-move"
                term="place()"
                def="Positions widgets at exact locations on the window using x,y pixel coordinates. Gives more control but needs careful adjustment."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:format-size"
                term="Clean interface"
                def="Has well-arranged widgets and enough space between them. Text and buttons should be clear and easy to read."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:resize"
                term="Responsive interface"
                def="Adjusts its layout when the window size changes. Helps the program work well on different screen sizes."
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
        <SlideLayout title="Definitions and Important Questions" accent="var(--microtask)">
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <QARow
                q="Define layout management in Tkinter."
                a="Layout management is used to arrange widgets inside a window in a proper way. It decides the position and size of each widget on the screen. Good layout management makes the interface clear and easy to use."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does pack() organize widgets?"
                a="The pack() method places widgets in a simple vertical or horizontal order. It is easy to use and works well for small applications."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does grid() organize widgets?"
                a="The grid() method arranges widgets in rows and columns like a table. It is useful for forms and structured layouts."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does place() position widgets?"
                a="The place() method positions widgets at exact locations on the window using x,y pixel coordinates. It gives more control but needs careful adjustment."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What is a responsive interface?"
                a="Responsive interfaces adjust their layout when the window size changes. This helps the program work well on different screen sizes."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 14. Coming up next
    {
      id: "next-topic",
      title: "Next up: 4.1d Event Handling + Login Form",
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
