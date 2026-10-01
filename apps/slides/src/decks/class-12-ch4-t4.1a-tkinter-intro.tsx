/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.1a · GUI Basics + Tkinter Introduction
 *
 * THEME: class-12 (Meridian  ·  deep plum + muted gold). First deck using this theme live.
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, and key-point sentence is copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.1a-tkinter-intro.md`.
 * Real-world extensions are clearly labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/research.md
 * Section 3 · 4.1a. 12 slides. Includes an inline PythonCode syntax highlighter
 * (first iteration  ·  if this works well, extract into a shared component for the rest of ch4).
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

// ── Python syntax highlighter (inline, first-pass) ──────────────────────

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
  keyword: "var(--accent)", // muted gold
  string: "var(--sync)", // teal
  comment: "var(--muted)",
  function: "var(--microtask)", // violet
  builtin: "var(--api)", // bright gold
  number: "var(--task)", // pink
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

// ── Mock Tkinter window (recreates Figure 4.1 and the example output) ──

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
    <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);

const MockLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ textAlign: "center", fontSize: 15, color: "#1b1326" }}>{children}</div>
);

const MockEntry: React.FC = () => (
  <div
    style={{
      height: 28,
      border: "1px solid #999",
      borderRadius: 2,
      backgroundColor: "#ffffff",
    }}
  />
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
    }}
  >
    {children}
  </div>
);

const MockTextArea: React.FC = () => (
  <div
    style={{
      height: 56,
      border: "1px solid #999",
      borderRadius: 2,
      backgroundColor: "#ffffff",
    }}
  />
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

// ── 6 building blocks card ──────────────────────────────────────────────

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

// ── Hero visual: layered mock desktop with GUI window ──────────────────

const HeroMockDesktop: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, type: "spring", damping: 16 }}
    >
      <MockWindow title="Simple GUI Example" width={360} accent="var(--accent)">
        <MockLabel>Welcome to Tkinter</MockLabel>
        <MockEntry />
        <MockButton>Click Me</MockButton>
      </MockWindow>
    </motion.div>
  </div>
);

// ── ConceptTag + QARow ──────────────────────────────────────────────────

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
        4.1b
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Widgets + Frames
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
      Now that you've seen Tkinter's hello-world, let's break the window into reusable sections with <b style={hlViolet}>Frames</b> and meet all the common <b style={hlViolet}>Widgets</b>: Label, Button, Entry, Menu, and Listbox.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:view-grid-outline", label: "Frames" },
        { icon: "mdi:form-textbox", label: "Label" },
        { icon: "mdi:gesture-tap-button", label: "Button" },
        { icon: "mdi:form-textbox-password", label: "Entry" },
        { icon: "mdi:menu", label: "Menu" },
        { icon: "mdi:format-list-bulleted", label: "Listbox" },
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

// ── the deck ─────────────────────────────────────────────────────────────

const EXAMPLE_CODE = `import tkinter as tk

# Create main window
window = tk.Tk()
window.title("Simple GUI Example")
window.geometry("300x200")

# Function to handle button click (event)
def on_click():
    label.config(text="Button Clicked!")

# Create a label
label = tk.Label(window, text="Welcome to Tkinter")
label.pack(pady=10)

# Create an entry field
entry = tk.Entry(window)
entry.pack(pady=10)

# Create a button
button = tk.Button(window, text="Click Me", command=on_click)
button.pack(pady=10)

# Run the application
window.mainloop()`;

export const class12Ch4T41aTkinterIntroDeck: Deck = {
  title: "GUI Basics + Tkinter Introduction",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.1a · GUI Basics + Tkinter",
  topicCode: "4.1a",
  topicTitle: "Graphical User Interface (GUI) Development with Tkinter",
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
              4.1a <span style={{ color: ACCENT }}>GUI</span> + <span style={{ color: ACCENT }}>Tkinter</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroMockDesktop />
              </div>
              Build visual Python apps your users can actually click.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Chapter 4 intro (SLOs + "In this chapter" paragraph)
    {
      id: "chapter-intro",
      title: "What this chapter teaches",
      transition: "slide",
      render: (
        <SlideLayout
          title="Chapter 4: What you will learn"
          subtitle="Two big ideas: build desktop UIs with Tkinter, then connect them to a database."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              In this chapter, students will learn to develop user-friendly <b style={hlGold}>Graphical User Interfaces (GUIs)</b> using <b style={hlGold}>Tkinter</b>, Python's built-in GUI toolkit. They will create windows, frames, labels, buttons, entry fields, and manage layouts using <b style={hlGold}>pack(), grid(), and place()</b>. They will practice event handling by linking user actions with functions and developing a simple login form. The chapter also introduces database concepts, SQL, Python database connectivity, and basic <b style={hlGold}>CRUD operations</b> using SQLite or MySQL.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:target" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                STUDENT LEARNING OUTCOMES
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <PropCard
                  icon="mdi:application-outline"
                  label="SLO 1"
                  color="var(--accent)"
                  body="Design interactive GUI-based programs using the Tkinter library."
                />
              </StaggerItem>
              <StaggerItem>
                <PropCard
                  icon="mdi:database-outline"
                  label="SLO 2"
                  color="var(--sync)"
                  body="Connect Python applications to databases and perform CRUD operations."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. 4.1 Opening + Figure 4.1
    {
      id: "section-opening",
      title: "4.1 Why GUIs beat command lines",
      render: (
        <SlideLayout
          title="4.1 Graphical User Interface (GUI) Development with Tkinter"
          subtitle="Visual elements beat typing commands. That's the whole point."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  <b style={hlGold}>Graphical User Interface (GUI)</b> development allows programs to interact with users through <b>visual elements</b> like windows, buttons, labels, and text boxes (as shown in Figure 4.1). GUIs make applications more <b>user-friendly</b> and <b>easier to use</b> compared to command-line interfaces. Python provides tools to create GUI applications efficiently. <b style={hlGold}>Tkinter</b> is Python's built-in library for creating GUI programs. It is <b>simple</b>, <b>widely used</b>, and allows developers to design interactive applications quickly.
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
                  FIGURE 4.1 · GRAPHICAL USER INTERFACE
                </div>
                <MockWindow title="Simple GUI Example" width={320}>
                  <MockEntry />
                  <MockButton>Button</MockButton>
                  <MockLabel>Label</MockLabel>
                  <MockTextArea />
                </MockWindow>
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 4. What is a GUI? Why is it important?
    {
      id: "what-is-gui",
      title: "What is a GUI? Why is it important?",
      render: (
        <SlideLayout
          title="What is a GUI? Why is it important?"
          subtitle="One sentence from the book. Four reasons it matters."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlGold}>GUI</b>, or Graphical User Interface, is a <b>visual interface</b> that allows users to interact with software using elements like <b>buttons, menus, and forms</b>. GUIs are important because they make programs easier to understand and operate, especially for non-technical users. They improve <b>usability</b> by providing <b style={hlGold}>visual feedback</b> and reducing the need to remember complex commands. GUI applications are widely used in <b>desktop software, web applications, and mobile apps</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:thumb-up-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                FOUR REASONS GUIS WIN
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:eye-outline"
                  label="Visual feedback"
                  color="var(--accent)"
                  body="See exactly what happens when you click."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:brain"
                  label="Less memorising"
                  color="var(--sync)"
                  body="No long command cheat-sheets to remember."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:account-group-outline"
                  label="For everyone"
                  color="var(--microtask)"
                  body="Non-technical users can operate the program."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:devices"
                  label="Everywhere"
                  color="var(--api)"
                  body="Desktop software, web apps, and mobile apps."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 5. BEYOND THE BOOK  ·  where GUIs show up
    {
      id: "where-guis-live",
      title: "Where GUIs show up in your life",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="GUIs are everywhere you look" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book says GUIs are used in desktop, web, and mobile. Here are the exact apps you probably used today.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:monitor"
                label="Desktop"
                color="var(--accent)"
                body="Windows File Explorer, macOS Finder, Microsoft Word, VS Code, Photoshop."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:web"
                label="Web apps"
                color="var(--sync)"
                body="YouTube, Facebook, Gmail, WhatsApp Web, Google Docs. Every form you fill in a browser."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:cellphone"
                label="Mobile apps"
                color="var(--microtask)"
                body="WhatsApp, Instagram, TikTok, Zoom, Snapchat. All the taps and swipes you do daily."
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
            <b style={hlViolet}>Before GUIs</b>, people typed every command: <span className="mono" style={{ color: "var(--accent)" }}>copy file1.txt file2.txt</span>. The <b>Xerox Star</b> (1981) and <b>Apple Macintosh</b> (1984) changed that forever by making computers point-and-click.
          </div>
        </SlideLayout>
      ),
    },

    // 6. Tkinter overview (verbatim) + checklist
    {
      id: "tkinter-overview",
      title: "Tkinter · Python's built-in GUI toolkit",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Overview of Tkinter as Python's built-in GUI toolkit"
          subtitle="Already installed with Python. Ready to use. Zero setup."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>Tkinter</b> is Python's <b>standard GUI toolkit</b> that comes <b style={hlGold}>pre-installed</b> with the language. It provides a set of <b>classes and functions</b> to create windows, buttons, labels, entry fields, and other widgets. Tkinter is <b style={hlGold}>easy to learn, lightweight,</b> and supports <b style={hlGold}>event-driven programming</b>, where actions are triggered by user events. It is suitable for building <b>small to medium-sized GUI applications</b> quickly and efficiently.
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
                WHY TKINTER WINS FOR LEARNING
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="logos:python"
                  label="Pre-installed"
                  color="var(--accent)"
                  body="Comes with Python. No pip install needed. Just import."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:feather"
                  label="Lightweight"
                  color="var(--sync)"
                  body="Small library, fast to start, uses little memory."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:cursor-default-click"
                  label="Event-driven"
                  color="var(--microtask)"
                  body="Buttons, keys, and clicks fire user events the program listens to."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:school-outline"
                  label="Easy to learn"
                  color="var(--api)"
                  body="Great for small to medium apps. Perfect for your first GUI."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 7. First Tkinter program  ·  code walkthrough
    {
      id: "example-code",
      title: "Example · Welcome to Tkinter",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: Simple GUI Example"
          subtitle="Code on the left, the actual output window on the right."
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 28, height: "100%", minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
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
              <PythonCode source={EXAMPLE_CODE} fontSize={18} maxHeight={760} />
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
              <MockWindow title="Simple GUI Example" width={380}>
                <MockLabel>Welcome to Tkinter</MockLabel>
                <MockEntry />
                <MockButton>Click Me</MockButton>
              </MockWindow>
              <div
                style={{
                  fontSize: 16,
                  color: "var(--muted)",
                  textAlign: "center",
                  lineHeight: 1.5,
                  maxWidth: 320,
                }}
              >
                A real window at <b style={{ color: "var(--accent)" }}>300×200 px</b>. Press Click Me and the label changes.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. The 6 building blocks (verbatim bullets)
    {
      id: "six-building-blocks",
      title: "The 6 building blocks",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="The 6 Tkinter building blocks (verbatim)"
          subtitle="Every Tkinter app you'll ever write uses some combination of these."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                icon="mdi:form-textbox"
                symbol="Label"
                explanation="displays text"
                color="var(--sync)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="3"
                icon="mdi:text-box-outline"
                symbol="Entry"
                explanation="takes user input"
                color="var(--microtask)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="4"
                icon="mdi:gesture-tap-button"
                symbol="Button"
                explanation="performs action"
                color="var(--api)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="5"
                icon="mdi:cursor-default-click-outline"
                symbol="command=on_click"
                explanation="event handling (button click)"
                color="var(--task)"
              />
            </StaggerItem>
            <StaggerItem>
              <BuildingBlock
                index="6"
                icon="mdi:refresh-circle"
                symbol="mainloop()"
                explanation="runs the GUI"
                color="var(--warn)"
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 9. Code anatomy  ·  which line produces which part of the UI
    {
      id: "code-anatomy",
      title: "Line by line · which code builds what",
      render: (
        <SlideLayout
          title="Trace the code to the output"
          subtitle="Every line of Python code is responsible for one piece of the window."
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  code: "window = tk.Tk()",
                  effect: "creates the empty window frame",
                  color: "var(--accent)",
                },
                {
                  code: 'window.title("Simple GUI Example")',
                  effect: "sets the title bar text",
                  color: "var(--accent)",
                },
                {
                  code: 'window.geometry("300x200")',
                  effect: "sets window size to 300 wide × 200 tall",
                  color: "var(--accent)",
                },
                {
                  code: 'label = tk.Label(window, text="Welcome to Tkinter")',
                  effect: "creates the top greeting text",
                  color: "var(--sync)",
                },
                {
                  code: "label.pack(pady=10)",
                  effect: "adds the label with 10 px vertical padding",
                  color: "var(--sync)",
                },
                {
                  code: "entry = tk.Entry(window)",
                  effect: "creates the empty text field for input",
                  color: "var(--microtask)",
                },
                {
                  code: 'button = tk.Button(window, ...)',
                  effect: "creates the clickable button",
                  color: "var(--api)",
                },
                {
                  code: "window.mainloop()",
                  effect: "shows the window and waits for events",
                  color: "var(--warn)",
                },
              ].map((row) => (
                <StaggerItem key={row.code}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto 1fr",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 18px",
                      backgroundColor: "var(--panel)",
                      border: `1px solid ${row.color}44`,
                      borderRadius: 10,
                    }}
                  >
                    <code
                      style={{
                        fontSize: 15,
                        color: row.color,
                        fontFamily: "Roboto Mono, monospace",
                        lineHeight: 1.5,
                      }}
                    >
                      {row.code}
                    </code>
                    <Icon icon="mdi:arrow-right-thick" width={22} height={22} color="var(--muted)" />
                    <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.5 }}>{row.effect}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                FINAL OUTPUT
              </div>
              <MockWindow title="Simple GUI Example" width={300}>
                <MockLabel>Welcome to Tkinter</MockLabel>
                <MockEntry />
                <MockButton>Click Me</MockButton>
              </MockWindow>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK  ·  real Tkinter apps
    {
      id: "beyond-book",
      title: "Real apps built with Tkinter (or its cousins)",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Tkinter is not a toy. Real tools use it." accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book calls Tkinter "small to medium-sized". That still covers tools shipped to millions.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="logos:python"
                label="IDLE"
                color="var(--accent)"
                body="Python's own code editor is written in Tkinter. Ships with every Python install."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:school-outline"
                label="Thonny"
                color="var(--sync)"
                body="The friendly Python IDE used in thousands of schools. Tkinter under the hood."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:database-outline"
                label="DB Browser for SQLite"
                color="var(--microtask)"
                body="Popular desktop GUI for SQLite databases. Qt-based cousin of Tkinter."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:calculator-variant-outline"
                label="Your first calculator app"
                color="var(--api)"
                body="Perfect first project. Two Entry fields, four buttons, one Label for the result."
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
              fontSize: 14,
              color: "var(--text)",
              lineHeight: 1.55,
            }}
          >
            <b style={hlViolet}>Under the hood</b>: Tkinter wraps a cross-platform GUI toolkit called <b style={hlGold}>Tcl/Tk</b>, invented at Berkeley in 1988. That's why your Tkinter window looks the same on Windows, Mac, and Linux.
          </div>
        </SlideLayout>
      ),
    },

    // 11. Important Concepts
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout title="Important Concepts from 4.1a" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:application-outline"
                term="Graphical User Interface (GUI)"
                def="A visual interface that allows users to interact with software using elements like buttons, menus, and forms. Widely used in desktop software, web applications, and mobile apps."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="logos:python"
                term="Tkinter"
                def="Python's standard GUI toolkit that comes pre-installed with the language. Provides classes and functions to create windows, buttons, labels, entry fields, and other widgets."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:window-restore"
                term="Tk()"
                def="Creates the main window of a Tkinter application."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:form-textbox"
                term="Label · Entry · Button"
                def="Three essential widgets. Label displays text. Entry takes user input. Button performs an action when clicked."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cursor-default-click-outline"
                term="Event-driven programming"
                def="A programming style where actions are triggered by user events like a button click or key press. Supported by Tkinter via the command= argument."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:refresh-circle"
                term="mainloop()"
                def="Runs the GUI. Keeps the window open and listening for user events until the window is closed."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Coming up next: 4.1b Widgets + Frames
    {
      id: "next-topic",
      title: "Next up: 4.1b Widgets + Frames",
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
