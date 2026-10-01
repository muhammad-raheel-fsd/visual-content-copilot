/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.1d · Event Handling + Login Form
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: Headings, definitions, Python code, 5-bullet summary, and
 * CLASS ACTIVITY are copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.1d-event-handling.md`.
 * Real-world extensions clearly labelled BEYOND THE BOOK.
 *
 * Research plan: ../research.md · section 3 · 4.1d. 13 slides initially; agent in
 * background will produce the hand-drawn event-loop diagram to add as slide 2b.
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

// ── Python syntax highlighter ───────────────────────────────────────────

const PY_KEYWORDS = new Set([
  "import", "def", "return", "if", "else", "elif", "as", "from", "in", "for",
  "while", "True", "False", "None", "class", "pass", "break", "continue",
  "and", "or", "not", "with", "try", "except", "raise",
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
  fontSize = 16,
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

// ── Mock Tkinter window + widgets ───────────────────────────────────────

const MockWindow: React.FC<{
  title: string;
  children: ReactNode;
  width?: number;
  height?: number;
  accent?: string;
  icon?: string;
}> = ({ title, children, width = 300, height, accent = "var(--accent)", icon = "mdi:leaf" }) => (
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
      <Icon icon={icon} width={16} color={accent} />
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

const MockLabel: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 14, color: "#1b1326", padding: "4px 0", textAlign: "center", ...style }}>
    {children}
  </div>
);

const MockEntry: React.FC<{ width?: number; masked?: boolean }> = ({ width = 180, masked }) => (
  <div
    style={{
      width,
      height: 24,
      border: "1px solid #777",
      backgroundColor: "white",
      margin: "4px auto",
      padding: "2px 6px",
      fontSize: 13,
      fontFamily: "Roboto Mono, monospace",
      color: "#1b1326",
      letterSpacing: masked ? 2 : 0,
    }}
  >
    {masked ? "••••" : ""}
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

const LoginFormMock: React.FC = () => (
  <div style={{ padding: "16px 20px" }}>
    <MockLabel>Username</MockLabel>
    <MockEntry />
    <div style={{ height: 8 }} />
    <MockLabel>Password</MockLabel>
    <MockEntry masked />
    <div style={{ height: 14 }} />
    <div style={{ textAlign: "center" }}>
      <MockBtn width={100}>Login</MockBtn>
    </div>
  </div>
);

const SuccessPopupMock: React.FC = () => (
  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#1b7bd8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexShrink: 0,
      }}
    >
      <Icon icon="mdi:check" width={22} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      <div style={{ fontSize: 14, color: "#1b1326", fontWeight: 600 }}>Login Successful!</div>
      <div style={{ textAlign: "center" }}>
        <MockBtn width={56}>OK</MockBtn>
      </div>
    </div>
  </div>
);

const ErrorPopupMock: React.FC = () => (
  <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "#d02020",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexShrink: 0,
      }}
    >
      <Icon icon="mdi:close" width={22} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
      <div style={{ fontSize: 13, color: "#1b1326", fontWeight: 600 }}>
        Invalid Username or Password
      </div>
      <div style={{ textAlign: "center" }}>
        <MockBtn width={56}>OK</MockBtn>
      </div>
    </div>
  </div>
);

// ── Prop + concept cards ────────────────────────────────────────────────

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

// ── Event-loop inline SVG-ish diagram (for slide 2 and 3) ───────────────

const WaitEventActionLoop: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, padding: "10px 0" }}>
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        padding: "18px 26px",
        borderRadius: 14,
        border: "1.5px solid var(--muted)",
        backgroundColor: "var(--panel)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 150,
      }}
    >
      <Icon icon="mdi:sleep" width={40} color="var(--muted)" />
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--muted)" }}>idle · wait</div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Icon icon="mdi:arrow-right-bold" width={44} color="var(--accent)" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        padding: "18px 26px",
        borderRadius: 14,
        border: "1.5px solid var(--accent)",
        backgroundColor: "var(--panel)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 150,
        boxShadow: "0 0 24px rgba(201, 166, 107, 0.3)",
      }}
    >
      <Icon icon="mdi:cursor-default-click" width={40} color="var(--accent)" />
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>event occurs</div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 }}
    >
      <Icon icon="mdi:arrow-right-bold" width={44} color="var(--sync)" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 }}
      style={{
        padding: "18px 26px",
        borderRadius: 14,
        border: "1.5px solid var(--sync)",
        backgroundColor: "var(--panel)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 150,
        boxShadow: "0 0 24px rgba(103, 216, 196, 0.3)",
      }}
    >
      <Icon icon="mdi:function-variant" width={40} color="var(--sync)" />
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--sync)" }}>function runs</div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.1 }}
    >
      <Icon icon="mdi:arrow-u-left-top" width={44} color="var(--microtask)" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.3 }}
      style={{
        padding: "18px 26px",
        borderRadius: 14,
        border: "1.5px dashed var(--microtask)",
        backgroundColor: "var(--panel)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        minWidth: 150,
      }}
    >
      <Icon icon="mdi:refresh" width={40} color="var(--microtask)" />
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--microtask)" }}>loop again</div>
    </motion.div>
  </div>
);

// ── The command= bridge visualization (slide 6) ─────────────────────────

const CommandBridge: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 32,
      padding: "20px 0",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <MockBtn width={140} style={{ padding: "10px 16px", fontSize: 16 }}>
        Login
      </MockBtn>
      <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700, letterSpacing: 1 }}>
        WIDGET · the button
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          padding: "8px 18px",
          borderRadius: 999,
          backgroundColor: "rgba(201, 166, 107, 0.14)",
          border: "1.5px solid var(--accent)",
          color: "var(--accent)",
          fontFamily: "Roboto Mono, monospace",
          fontWeight: 700,
          fontSize: 18,
        }}
      >
        command=check_login
      </div>
      <motion.div
        initial={{ x: -8 }}
        animate={{ x: 8 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9 }}
      >
        <Icon icon="mdi:arrow-right-bold" width={56} color="var(--accent)" />
      </motion.div>
      <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
        click fires → function runs
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          backgroundColor: "#0b0820",
          border: "1.5px solid var(--sync)",
          fontFamily: "Roboto Mono, monospace",
          fontSize: 16,
          color: "var(--text)",
          minWidth: 220,
        }}
      >
        <span style={{ color: "var(--accent)" }}>def</span>{" "}
        <span style={{ color: "var(--microtask)" }}>check_login</span>
        <span style={{ color: "var(--text)" }}>():</span>
        <br />
        <span style={{ color: "var(--muted)", marginLeft: 20 }}># body</span>
      </div>
      <div style={{ fontSize: 13, color: "var(--sync)", fontWeight: 700, letterSpacing: 1 }}>
        FUNCTION · the handler
      </div>
    </div>
  </div>
);

// ── Login form code snippets ────────────────────────────────────────────

const LOGIN_CODE_PART1 = `import tkinter as tk
from tkinter import messagebox

# Create main window
window = tk.Tk()
window.title("Login Form")
window.geometry("300x200")

# Function to check login
def check_login():
    username = entry_user.get()
    password = entry_pass.get()

    # simple check
    if username == "admin" and password == "1234":
        messagebox.showinfo("Success", "Login Successful!")
    else:
        messagebox.showerror("Error", "Invalid Username or Password")`;

const LOGIN_CODE_PART2 = `# Username label and entry
tk.Label(window, text="Username").pack()
entry_user = tk.Entry(window)
entry_user.pack()

# Password label and entry
tk.Label(window, text="Password").pack()
entry_pass = tk.Entry(window, show="*")
entry_pass.pack()

# Login button
tk.Button(window, text="Login", command=check_login).pack(pady=10)

# Run application
window.mainloop()`;

// ── Next-topic hero (slide 13) ──────────────────────────────────────────

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
      border: "2px solid var(--sync)",
      borderRadius: 20,
      boxShadow: "0 0 60px rgba(103, 216, 196, 0.28)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--sync)",
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        4.2a
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Database Concepts + SQL Structure
      </div>
    </div>
    <div
      style={{
        fontSize: 20,
        color: "var(--muted)",
        textAlign: "center",
        maxWidth: 820,
        lineHeight: 1.55,
      }}
    >
      Hard-coding <b style={hlGold}>admin / 1234</b> is fake. Real apps store users in a <b style={hlTeal}>database</b>. Meet entities, attributes, tables, primary keys, and foreign keys.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:database-outline", label: "Database" },
        { icon: "mdi:table", label: "Table" },
        { icon: "mdi:key-variant", label: "Primary Key" },
        { icon: "mdi:link-variant", label: "Foreign Key" },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            backgroundColor: "rgba(103, 216, 196, 0.12)",
            border: "1px solid rgba(103, 216, 196, 0.4)",
            borderRadius: 999,
          }}
        >
          <Icon icon={c.icon} width={22} height={22} color="var(--sync)" />
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--sync)" }}>{c.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4T41dEventHandlingDeck: Deck = {
  title: "Event Handling + Login Form",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.1d · Event Handling",
  topicCode: "4.1d",
  topicTitle: "Event Handling + Login Form",
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
              4.1d <span style={{ color: ACCENT }}>Event</span> Handling
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <MockWindow title="Login Form" width={240} accent={ACCENT}>
                  <LoginFormMock />
                </MockWindow>
                <Icon icon="mdi:arrow-right-bold" width={44} color="var(--accent)" />
                <MockWindow title="Success" width={200} accent="var(--sync)">
                  <SuccessPopupMock />
                </MockWindow>
              </div>
              Make the window <b style={hlGold}>respond</b> to the user. Click a button, run a function.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Event Handling intro (verbatim)
    {
      id: "event-handling-intro",
      title: "Event Handling and Interactivity",
      transition: "slide",
      render: (
        <SlideLayout
          title="Event Handling and Interactivity"
          subtitle="A program that waits. When an event comes, it reacts."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>Event handling</b> and interactivity allow a program to respond to user actions. An <b style={hlGold}>event</b> is an action, such as <b>clicking a button</b> or <b>typing text</b>. The program <b>waits</b> for an event instead of running all the time. When an event occurs, a <b>specific task</b> is performed. This makes the application active and useful. Event handling is important in graphical programs. It helps control how the program behaves.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:timeline-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                THE WAIT → EVENT → ACTION LOOP
              </span>
            </div>
            <WaitEventActionLoop />
          </div>
        </SlideLayout>
      ),
    },

    // 2b. Hand-drawn event loop (Figure 4.3 analogue)
    {
      id: "event-loop-handdrawn",
      title: "Event loop · hand-drawn",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="The Tkinter event loop · hand-drawn"
          subtitle="User → Event → mainloop() queue → Function → UI update → repeat."
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
              src="/diagrams/class-12-ch4-t4.1d-event-loop.svg"
              alt="Hand-drawn event loop: user clicks, event enters mainloop queue, callback function runs, UI updates, loop repeats"
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

    // 3. Event-Driven Programming (verbatim)
    {
      id: "event-driven-programming",
      title: "Understanding Event-Driven Programming",
      render: (
        <SlideLayout
          title="Understanding Event-Driven Programming"
          subtitle="Idle until an event. Each event has one function."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>Event-driven programming</b> is based on actions called events. The program <b>remains idle</b> until an event occurs. Common events include <b>button clicks</b> and <b>key presses</b>. Each event is linked to a <b>specific function</b>. The function runs <b>only when the event happens</b>. This approach <b>saves system resources</b>. It is widely used in graphical user interfaces.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:brain" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                FOUR KEY IDEAS FROM THE BOOK
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:sleep"
                  label="Idle until event"
                  color="var(--accent)"
                  body="The program does nothing while waiting. No busy loop, no polling."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:link-variant"
                  label="Event → function"
                  color="var(--sync)"
                  body="Each event is linked to exactly one function. The function runs only when the event happens."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:lightning-bolt"
                  label="Saves resources"
                  color="var(--microtask)"
                  body="No CPU work when nothing is happening. Battery and memory thank you."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:monitor-dashboard"
                  label="Used in GUIs"
                  color="var(--api)"
                  body="Widely used in graphical user interfaces, where the user drives the action."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 4. Common events (click + keypress from book, plus examples)
    {
      id: "common-events",
      title: "Common events",
      render: (
        <SlideLayout
          title="Common events the book names"
          subtitle='"Button clicks and key presses" · plus a few everyday extras.'
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:cursor-default-click"
                label="Button click (from book)"
                color="var(--accent)"
                body='The user clicks a button. Example: pressing the "Login" button. In Tkinter, link it with command=my_function.'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:keyboard-outline"
                label="Key press (from book)"
                color="var(--sync)"
                body='The user types a key. Example: typing a letter in the Username field, or pressing Enter to submit.'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:cursor-move"
                label="Mouse move (bonus)"
                color="var(--microtask)"
                body="The cursor moves over the window. Used for hover effects or drawing apps."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:close-box-outline"
                label="Window close (bonus)"
                color="var(--task)"
                body='The user clicks the "✕" to close the window. The app can save data before exiting.'
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
              padding: "12px 16px",
              backgroundColor: "rgba(201, 166, 107, 0.08)",
              border: "1px dashed var(--accent)",
              borderRadius: 10,
              fontSize: 16,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Rule: <b style={hlGold}>one event → one function</b>. The function runs only when the event happens.
          </div>
        </SlideLayout>
      ),
    },

    // 5. Handling user input (verbatim)
    {
      id: "handling-user-input",
      title: "Handling User Input and Connecting Widgets to Functions",
      render: (
        <SlideLayout
          title="Handling User Input and Connecting Widgets to Functions"
          subtitle="Entry fields and buttons feed functions. Functions decide what happens."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>User input</b> is given through widgets like <b>entry fields</b> and <b>buttons</b>. Widgets are <b>connected to functions</b> in the program. When the widget is used, the connected function <b>executes</b>. This allows the program to process the input. For example, a <b>button click can display a message</b>. Proper connections ensure correct program behavior. This interaction improves user experience.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:transit-connection-variant" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                WIDGETS SEND INPUT TO FUNCTIONS
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:form-textbox"
                  label="Entry field"
                  color="var(--sync)"
                  body='Takes text input from the user. Read what they typed with .get().'
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:gesture-tap-button"
                  label="Button"
                  color="var(--accent)"
                  body="When clicked, fires an event that calls the linked function."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:function-variant"
                  label="Your function"
                  color="var(--microtask)"
                  body="Receives the input, decides what to do, updates the UI with a message or new state."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 6. The command= bridge
    {
      id: "command-bridge",
      title: "The command= bridge",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="How does Tkinter know which function to call?"
          subtitle="One parameter does the whole job. command= links the widget to the function."
          accent={ACCENT}
        >
          <CommandBridge />
          <div
            style={{
              marginTop: 10,
              padding: "16px 22px",
              backgroundColor: "var(--panel)",
              border: "1px solid var(--panel-border)",
              borderRadius: 10,
              fontSize: 17,
              color: "var(--text)",
              lineHeight: 1.6,
            }}
          >
            Pass <b style={hlGold}>command=check_login</b> (no parentheses!) when creating the button. Tkinter saves the reference. When the user clicks, Tkinter calls the function for you.
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 18px",
              backgroundColor: "rgba(255, 141, 161, 0.08)",
              border: "1px solid var(--task)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <Icon icon="mdi:alert-outline" width={22} color="var(--task)" />
            <span>
              Common mistake: writing <code style={{ color: "var(--task)", fontFamily: "Roboto Mono, monospace" }}>command=check_login()</code> with parentheses. That CALLS the function immediately instead of saving the reference. The button then does nothing on click.
            </span>
          </div>
        </SlideLayout>
      ),
    },

    // 7. Example: Simple Login Form intro + mock output
    {
      id: "login-form-intro",
      title: "Example: Simple Login Form",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Example: Simple Login Form"
          subtitle='Two Entry fields, one Button, a popup message for success or error.'
          accent={ACCENT}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 28,
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={bookQuoteStyle}>
                A simple login form allows a user to enter a <b style={hlGold}>username</b> and <b style={hlGold}>password</b>. <b>Entry fields</b> are used to take the input from the user. A <b>button</b> is provided to <b>submit</b> the information. When the button is clicked, the program <b>checks the entered data</b>. A <b>message is then shown</b> for success or error.
              </p>
              <div
                style={{
                  padding: "14px 18px",
                  backgroundColor: "rgba(201, 166, 107, 0.08)",
                  border: "1px dashed var(--accent)",
                  borderRadius: 10,
                  fontSize: 15,
                  color: "var(--text)",
                  lineHeight: 1.5,
                }}
              >
                In the book's example, the valid credentials are <b style={hlGold}>admin</b> / <b style={hlGold}>1234</b>.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
              <MockWindow title="Login Form" width={280}>
                <LoginFormMock />
              </MockWindow>
              <div style={{ display: "flex", gap: 14 }}>
                <MockWindow title="Success" width={200} accent="var(--sync)">
                  <SuccessPopupMock />
                </MockWindow>
                <MockWindow title="Error" width={200} accent="var(--task)">
                  <ErrorPopupMock />
                </MockWindow>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Login Form code · part 1
    {
      id: "login-code-part-1",
      title: "Login Form code · part 1",
      render: (
        <SlideLayout
          title="Login Form code · part 1"
          subtitle="Imports, window setup, and the check_login() function."
          accent={ACCENT}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: 24,
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
              <PythonCode source={LOGIN_CODE_PART1} fontSize={14} maxHeight={780} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                WHAT HAPPENS
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlGold}>Line 1-2:</b> Import Tkinter and the messagebox submodule for popup dialogs.
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlTeal}>Lines 5-7:</b> Create the main window, title it, set size to 300×200.
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlViolet}>check_login():</b> Reads both Entry fields with <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--microtask)" }}>.get()</code>, compares to <b>admin / 1234</b>, shows success or error popup.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. Login Form code · part 2
    {
      id: "login-code-part-2",
      title: "Login Form code · part 2",
      render: (
        <SlideLayout
          title="Login Form code · part 2"
          subtitle='Entry fields, the Login button, and mainloop(). The event loop is live.'
          accent={ACCENT}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr",
              gap: 24,
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
                CODE · PYTHON (continued)
              </div>
              <PythonCode source={LOGIN_CODE_PART2} fontSize={14} maxHeight={780} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                KEY LINES
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlGold}>entry_user, entry_pass:</b> saved as variables so check_login() can read them with <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--accent)" }}>.get()</code>.
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlTeal}>show="*":</b> masks each typed character so the password is hidden on screen.
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlViolet}>command=check_login:</b> links the button click to the function. No parentheses!
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                <b style={{ color: "var(--api)", fontWeight: 700 }}>window.mainloop():</b> starts the event loop. The program now <b>waits</b> for events.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 10. 5-bullet summary (verbatim)
    {
      id: "five-bullet-summary",
      title: "5 bullets · verbatim from book",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="How the login form works · five bullets from the book"
          subtitle="Verbatim list from pages 51-52."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "mdi:form-textbox", color: "var(--sync)", left: "Entry", right: "takes username and password" },
              { icon: "mdi:send", color: "var(--accent)", left: "Button", right: "submits data" },
              { icon: "mdi:function-variant", color: "var(--microtask)", left: "check_login()", right: "checks input" },
              { icon: "mdi:message-alert-outline", color: "var(--api)", left: "messagebox", right: "shows success or error" },
              { icon: "mdi:cursor-default-click", color: "var(--task)", left: "Works on", right: "event-driven programming" },
            ].map((row) => (
              <StaggerItem key={row.left}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "220px 60px 1fr",
                    gap: 20,
                    alignItems: "center",
                    padding: "18px 22px",
                    backgroundColor: "var(--panel)",
                    border: `1.5px solid ${row.color}`,
                    borderRadius: 14,
                    boxShadow: `0 0 24px ${row.color}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      fontSize: 22,
                      fontWeight: 800,
                      color: row.color,
                      fontFamily: "Roboto Mono, monospace",
                    }}
                  >
                    <Icon icon={row.icon} width={32} height={32} color={row.color} />
                    {row.left}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Icon icon="mdi:arrow-right-thick" width={32} height={32} color="var(--muted)" />
                  </div>
                  <div style={{ fontSize: 20, color: "var(--text)" }}>{row.right}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. CLASS ACTIVITY (yellow box)
    {
      id: "class-activity",
      title: "Class Activity",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="CLASS ACTIVITY"
          subtitle="Try this in the computer lab. Verbatim from the book."
          accent="var(--warn)"
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
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 16 }}
              style={{
                padding: "32px 42px",
                maxWidth: 1100,
                backgroundColor: "rgba(249, 203, 76, 0.1)",
                border: "2px solid var(--warn)",
                borderRadius: 20,
                boxShadow: "0 0 60px rgba(249, 203, 76, 0.22)",
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Icon icon="mdi:clipboard-check-outline" width={64} height={64} color="var(--warn)" />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    letterSpacing: 3,
                    color: "var(--warn)",
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  CLASS ACTIVITY
                </div>
                <div style={{ fontSize: 26, color: "var(--text)", lineHeight: 1.5 }}>
                  Explain event-driven concepts and have students <b style={{ color: "var(--warn)" }}>add a button that triggers a label update on click</b>.
                </div>
                <div
                  style={{
                    marginTop: 18,
                    padding: "12px 16px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    borderRadius: 8,
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: 14,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  Hint: <span style={{ color: "var(--accent)" }}>label.config(text="You clicked!")</span> changes the label text. Call it from the button's command= function.
                </div>
              </div>
            </motion.div>
          </div>
        </SlideLayout>
      ),
    },

    // 12. BEYOND THE BOOK
    {
      id: "beyond-book",
      title: "Beyond the book",
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
            The book covers click events via <code style={{ color: "var(--accent)", fontFamily: "Roboto Mono, monospace" }}>command=</code>. Real Tkinter and production apps go further.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:keyboard"
                label=".bind() for any event"
                color="var(--sync)"
                body='widget.bind("<Key>", handler) catches keyboard events. "<Button-1>" is left-click, "<Motion>" is mouse-move. Much more powerful than command=.'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:shield-lock"
                label="Never store plain passwords"
                color="var(--warn)"
                body='The book compares with username == "admin" for teaching. Real apps hash passwords with bcrypt or argon2 and never store the plaintext.'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:web"
                label="Same idea everywhere"
                color="var(--microtask)"
                body="Browser JS has addEventListener('click', fn). Android has onClickListener. iOS has @IBAction. All event-driven."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:bug-outline"
                label="Don't block mainloop()"
                color="var(--task)"
                body="If your callback runs a long computation (file download, big loop), the UI freezes. Use threading or window.after() for background work."
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
            <b style={hlViolet}>Big idea:</b> event-driven programming is the dominant style for UIs on every platform. Learn it here, use it for the next 30 years.
          </div>
        </SlideLayout>
      ),
    },

    // 13. Important Concepts + Next topic (combined for last slide)
    {
      id: "concepts-and-next",
      title: "Important Concepts + next topic",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Important Concepts + Coming up next" accent="var(--sync)">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:cursor-default-click"
                  term="Event"
                  def="An action, such as clicking a button or typing text. The program waits for events instead of running all the time."
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:sleep"
                  term="Event-driven programming"
                  def="Program remains idle until an event occurs. Each event is linked to a specific function that runs only when the event happens."
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:link-variant"
                  term="command= parameter"
                  def='Links a Tkinter widget (like Button) to a Python function. Example: tk.Button(..., command=check_login) runs check_login() on click.'
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:message-alert-outline"
                  term="messagebox"
                  def="Imported from tkinter. showinfo() and showerror() open small popup windows for success or error messages."
                />
              </StaggerItem>
            </Stagger>
            <NextTopicHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
