/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.2b · Connecting Python to a Database
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: Headings, definitions, sqlite3 code, and 5-bullet summary
 * copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.2b-python-db-connection.md`.
 * Real-world extensions and VS Code extension recommendations clearly labelled
 * BEYOND THE BOOK / COOL TOOLS.
 *
 * Research plan: ../research.md · section 3 · 4.2b. 13 slides (12 planned + 1
 * added "VS Code extensions" slide at Muhammad's request).
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

const BookExtensionTag: React.FC<{ color?: string; label?: string }> = ({
  color = "var(--microtask)",
  label = "BEYOND THE BOOK",
}) => (
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
    <span>{label}</span>
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

// ── PropCard + ConceptTag + QARow ──────────────────────────────────────

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

// ── Step pill (for 5-step pattern slide) ─────────────────────────────────

const StepCard: React.FC<{
  n: number;
  icon: string;
  color: string;
  title: string;
  body: string;
  code?: string;
}> = ({ n, icon, color, title, body, code }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: 18,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 20px ${color}22`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: color,
          color: "#0d0a1c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {n}
      </div>
      <Icon icon={icon} width={28} color={color} />
    </div>
    <div style={{ fontSize: 15, fontWeight: 800, color, lineHeight: 1.3 }}>{title}</div>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{body}</div>
    {code && (
      <code
        style={{
          marginTop: "auto",
          padding: "6px 10px",
          backgroundColor: "#0b0820",
          borderRadius: 6,
          fontFamily: "Roboto Mono, monospace",
          fontSize: 12,
          color: "var(--text)",
          wordBreak: "break-all",
        }}
      >
        {code}
      </code>
    )}
  </div>
);

// ── VS Code extension card (slide 10) ─────────────────────────────────

const ExtensionCard: React.FC<{
  icon: string;
  name: string;
  pub: string;
  blurb: string;
  tag: string;
  color: string;
}> = ({ icon, name, pub, blurb, tag, color }) => (
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
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: `${color}22`,
          border: `1px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon icon={icon} width={28} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{name}</div>
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "Roboto Mono, monospace",
            marginTop: 2,
          }}
        >
          {pub}
        </div>
      </div>
    </div>
    <div
      style={{
        padding: "3px 10px",
        borderRadius: 999,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}55`,
        color,
        fontSize: 11,
        letterSpacing: 1.5,
        fontWeight: 800,
        alignSelf: "flex-start",
      }}
    >
      {tag}
    </div>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{blurb}</div>
  </div>
);

// ── Code snippets (verbatim from book) ──────────────────────────────────

const CODE_PART1 = `# Import sqlite3 module
import sqlite3

# Connect to the database file named "school.db"
# If the file does not exist, SQLite will create it automatically
connection = sqlite3.connect("school.db")

# Create a cursor object
# Cursor is used to execute SQL queries
cursor = connection.cursor()

# Create "students" table if it does not exist
cursor.execute(""" CREATE TABLE IF NOT EXISTS students
 ( id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade TEXT ) """)`;

const CODE_PART2 = `# (Optional) Insert sample data
cursor.execute("INSERT INTO students (name, age, grade) VALUES ('Ali', 14, '8th')")
cursor.execute("INSERT INTO students (name, age, grade) VALUES ('Sara', 15, '9th')")

# Save changes
connection.commit()`;

const CODE_PART3 = `# This query selects all columns (*) from the table named "students"
cursor.execute("SELECT * FROM students")

# Fetch all records returned by the query
# fetchall() returns a list of rows/records
records = cursor.fetchall()

# Display all records
# Loop through each row in the records list
for row in records:
    # Print each row of the table
    print(row)

# Close the database connection
connection.close()`;

// ── Mock terminal output ────────────────────────────────────────────────

const MockOutput: React.FC = () => (
  <div
    style={{
      padding: "14px 18px",
      backgroundColor: "#0a0612",
      border: "1px solid var(--sync)",
      borderRadius: 10,
      fontFamily: "Roboto Mono, monospace",
      fontSize: 15,
      color: "var(--sync)",
      lineHeight: 1.7,
    }}
  >
    <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 2, marginBottom: 8 }}>
      $ python school_demo.py
    </div>
    <div>(1, 'Ali', 14, '8th')</div>
    <div>(2, 'Sara', 15, '9th')</div>
  </div>
);

// ── Next-topic hero ─────────────────────────────────────────────────────

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
        4.2c
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>CRUD Operations</div>
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
      You can open a database. Time to do the four basic actions on it: <b style={hlGold}>Create</b>, <b style={hlTeal}>Read</b>, <b style={hlViolet}>Update</b>, and <b style={{ color: "var(--task)", fontWeight: 700 }}>Delete</b>.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:plus-box-outline", label: "INSERT" },
        { icon: "mdi:magnify", label: "SELECT" },
        { icon: "mdi:pencil-outline", label: "UPDATE" },
        { icon: "mdi:trash-can-outline", label: "DELETE" },
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
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--sync)",
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

export const class12Ch4T42bPythonDbConnectionDeck: Deck = {
  title: "Connecting Python to a Database",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.2b · Python + Database",
  topicCode: "4.2b",
  topicTitle: "Connecting Python to a Database",
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
              4.2b <span style={{ color: ACCENT }}>Python</span> opens the DB
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon icon="mdi:language-python" width={60} color="var(--accent)" />
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--accent)",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono, monospace",
                    }}
                  >
                    Python
                  </div>
                </div>
                <Icon icon="mdi:arrow-right-bold" width={36} color="var(--muted)" />
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    backgroundColor: "rgba(201, 166, 107, 0.14)",
                    border: "1.5px solid var(--accent)",
                    color: "var(--accent)",
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  sqlite3.connect("school.db")
                </div>
                <Icon icon="mdi:arrow-right-bold" width={36} color="var(--muted)" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon icon="mdi:database" width={60} color="var(--sync)" />
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--sync)",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono, monospace",
                    }}
                  >
                    school.db
                  </div>
                </div>
              </div>
              Five steps and your Python program is talking to a real database.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Connecting Python to a Database (verbatim)
    {
      id: "connecting-python",
      title: "Connecting Python to a Database",
      transition: "slide",
      render: (
        <SlideLayout
          title="Connecting Python to a Database"
          subtitle="A connection is the first thing you need, before any INSERT or SELECT."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Connecting Python to a database allows programs to <b style={hlGold}>work with stored data</b>. A database connection is <b>required before performing any data operation</b>. Python provides libraries that help establish this connection easily. Once connected, data can be <b>added, retrieved, or modified</b>. Proper connection handling ensures smooth communication between Python and the database.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:connection" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                THREE THINGS A CONNECTION DOES
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:plus-box-outline"
                  label="Add data"
                  color="var(--accent)"
                  body="INSERT new rows into tables using cursor.execute()."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:magnify"
                  label="Retrieve data"
                  color="var(--sync)"
                  body="SELECT rows back out, then fetchall() to get them in Python."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:pencil-outline"
                  label="Modify data"
                  color="var(--microtask)"
                  body="UPDATE existing rows or DELETE old ones. Then commit() to save."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. sqlite3 vs MySQL
    {
      id: "sqlite-vs-mysql",
      title: "sqlite3 vs MySQL",
      render: (
        <SlideLayout
          title="Using sqlite3 or MySQL to Establish a Database Connection"
          subtitle="Two choices. One is built in. The other scales up."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlGold}>sqlite3</b> library is <b>built into Python</b> and is used for <b>small databases</b>. It stores data in a <b>single file</b> on the system. <b style={hlTeal}>MySQL</b> is used for <b>larger and more complex database systems</b>. A connection is created by providing database details such as <b>name and credentials</b>. A successful connection allows Python to access the database.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: 24,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(201, 166, 107, 0.22)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon icon="mdi:database-outline" width={40} color="var(--accent)" />
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>sqlite3</div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: "var(--text)", lineHeight: 1.7 }}>
                  <li><b style={hlGold}>Built into Python</b> · no install needed</li>
                  <li>Single <b>file on disk</b> (school.db)</li>
                  <li>For <b>small databases</b> and personal projects</li>
                  <li>Zero server to run or configure</li>
                </ul>
                <code
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#0b0820",
                    borderRadius: 6,
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: 13,
                    color: "var(--accent)",
                  }}
                >
                  sqlite3.connect("school.db")
                </code>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  padding: 24,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 14,
                  boxShadow: "0 0 24px rgba(103, 216, 196, 0.22)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon icon="simple-icons:mysql" width={40} color="var(--sync)" />
                  <div style={{ fontSize: 26, fontWeight: 800, color: "var(--sync)" }}>MySQL</div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, color: "var(--text)", lineHeight: 1.7 }}>
                  <li>Runs as a <b style={hlTeal}>server</b> on your machine or on a server</li>
                  <li>Needs connection details: <b>host, user, password, database name</b></li>
                  <li>For <b>larger and more complex systems</b></li>
                  <li>Multiple users / apps can connect at once</li>
                </ul>
                <code
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#0b0820",
                    borderRadius: 6,
                    fontFamily: "Roboto Mono, monospace",
                    fontSize: 13,
                    color: "var(--sync)",
                  }}
                >
                  pymysql.connect(host, user, password, db)
                </code>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 4. The 5-step connection pattern (verbatim 5 bullets)
    {
      id: "five-step-pattern",
      title: "The 5-step connection pattern",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="The 5-step pattern · verbatim from the book"
          subtitle="Connect, cursor, execute, fetch + display, close."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <StaggerItem style={{ height: "100%" }}>
              <StepCard
                n={1}
                icon="mdi:connection"
                color="var(--accent)"
                title="Connect to Database"
                body="Establishes a connection to the school.db SQLite database."
                code='sqlite3.connect("school.db")'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <StepCard
                n={2}
                icon="mdi:cursor-pointer"
                color="var(--sync)"
                title="Create Cursor"
                body="Creates a cursor object to execute SQL commands."
                code="connection.cursor()"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <StepCard
                n={3}
                icon="mdi:play-circle-outline"
                color="var(--microtask)"
                title="Execute Query"
                body="Executes a SQL query to fetch all records from the students table."
                code='cursor.execute("SELECT * FROM students")'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <StepCard
                n={4}
                icon="mdi:download-outline"
                color="var(--task)"
                title="Fetch + Display Data"
                body="Fetches all records and prints each row in the result."
                code="cursor.fetchall()"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <StepCard
                n={5}
                icon="mdi:close-circle-outline"
                color="var(--api)"
                title="Close Connection"
                body="Closes the database connection after the operation."
                code="connection.close()"
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              backgroundColor: "rgba(201, 166, 107, 0.08)",
              border: "1px dashed var(--accent)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Same five steps work for sqlite3, MySQL, PostgreSQL · only the <code style={{ color: "var(--accent)", fontFamily: "Roboto Mono, monospace" }}>connect()</code> call changes.
          </div>
        </SlideLayout>
      ),
    },

    // 5. Full code walkthrough part 1
    {
      id: "code-part-1",
      title: "Code · part 1 · connect + cursor + CREATE TABLE",
      render: (
        <SlideLayout
          title="Code · part 1"
          subtitle="Import sqlite3, open school.db, create a cursor, create the students table."
          accent="var(--accent)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--accent)",
                  fontWeight: 800,
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={CODE_PART1} fontSize={15} maxHeight={760} />
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
                <b style={hlGold}>sqlite3.connect:</b> opens school.db. If the file does not exist, SQLite creates it for you.
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
                <b style={hlTeal}>connection.cursor():</b> gives you a cursor to send SQL commands with.
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
                <b style={hlViolet}>CREATE TABLE IF NOT EXISTS:</b> defines a students table with 4 columns (id, name, age, grade). The IF NOT EXISTS part lets you run the program many times without errors.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 6. Full code walkthrough part 2
    {
      id: "code-part-2",
      title: "Code · part 2 · INSERT + commit",
      render: (
        <SlideLayout
          title="Code · part 2 · add data and save"
          subtitle="Two INSERT statements. Then commit() writes the changes to disk."
          accent="var(--sync)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--accent)",
                  fontWeight: 800,
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={CODE_PART2} fontSize={16} maxHeight={700} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                KEY IDEA
              </div>
              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 10,
                  fontSize: 15,
                  color: "var(--text)",
                  lineHeight: 1.6,
                }}
              >
                <b style={hlTeal}>Write operations stay in memory</b> until you call <code style={{ color: "var(--sync)", fontFamily: "Roboto Mono, monospace" }}>connection.commit()</code>. Without commit(), the two Ali / Sara rows are lost when the program ends.
              </div>
              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: "rgba(255, 141, 161, 0.08)",
                  border: "1px solid var(--task)",
                  borderRadius: 10,
                  fontSize: 14,
                  color: "var(--text)",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <Icon icon="mdi:alert-outline" width={22} color="var(--task)" />
                <div>
                  <b style={{ color: "var(--task)" }}>Rule:</b> any INSERT, UPDATE, or DELETE needs a commit() to actually save.
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 7. Full code walkthrough part 3
    {
      id: "code-part-3",
      title: "Code · part 3 · SELECT + fetchall + loop + close",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Code · part 3 · read, print, close"
          subtitle="SELECT returns rows. fetchall() lists them. Loop + print, then close."
          accent="var(--microtask)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, minHeight: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--accent)",
                  fontWeight: 800,
                }}
              >
                CODE · PYTHON
              </div>
              <PythonCode source={CODE_PART3} fontSize={15} maxHeight={720} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: "var(--sync)",
                  fontWeight: 800,
                }}
              >
                EXPECTED OUTPUT
              </div>
              <MockOutput />
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1px solid var(--panel-border)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "var(--muted)",
                  lineHeight: 1.55,
                }}
              >
                <b style={hlViolet}>fetchall()</b> returns a list of tuples. One tuple per row. Each tuple holds the column values in order (id, name, age, grade).
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Executing SQL Commands From Python (verbatim)
    {
      id: "executing-sql",
      title: "Executing SQL Commands From Python",
      render: (
        <SlideLayout
          title="Executing SQL Commands From Python"
          subtitle="Python → Cursor → SQL → Database. Four hops, every time."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>SQL commands</b> are used to interact with the database from Python. Python sends these commands using a <b style={hlTeal}>database cursor</b>. Commands can be used to <b>create tables or insert data</b>. Data can also be <b>retrieved using select queries</b>. Executing SQL commands allows Python programs to <b>manage database data effectively</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:transit-connection-horizontal" width={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                THE PATH OF A SQL COMMAND
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 18,
                padding: "20px 0",
              }}
            >
              {[
                { icon: "mdi:language-python", label: "Python", color: "var(--accent)" },
                { icon: "mdi:cursor-pointer", label: "Cursor", color: "var(--sync)" },
                { icon: "mdi:code-tags", label: "SQL command", color: "var(--microtask)" },
                { icon: "mdi:database", label: "Database", color: "var(--task)" },
              ].map((n, i, arr) => (
                <>
                  <motion.div
                    key={n.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * i }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      padding: "18px 24px",
                      border: `1.5px solid ${n.color}`,
                      borderRadius: 14,
                      backgroundColor: "var(--panel)",
                      minWidth: 150,
                      boxShadow: `0 0 24px ${n.color}22`,
                    }}
                  >
                    <Icon icon={n.icon} width={38} color={n.color} />
                    <div style={{ fontSize: 15, fontWeight: 800, color: n.color }}>{n.label}</div>
                  </motion.div>
                  {i < arr.length - 1 && (
                    <Icon icon="mdi:arrow-right-bold" width={32} color="var(--muted)" />
                  )}
                </>
              ))}
            </div>
            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "rgba(201, 166, 107, 0.08)",
                border: "1px dashed var(--accent)",
                borderRadius: 10,
                fontSize: 15,
                color: "var(--text)",
                lineHeight: 1.55,
                textAlign: "center",
              }}
            >
              Python never talks to the database directly. The <b style={hlTeal}>cursor</b> is always in the middle.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. BEYOND THE BOOK · pro habits
    {
      id: "beyond-book",
      title: "Beyond the book · pro habits",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Pro habits the book skips" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book's example works. Real production code adds four habits that save you from pain later.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:shield-lock-outline"
                label="Parameterized queries"
                color="var(--warn)"
                body='NEVER build SQL with f-strings. Use "?" placeholders instead: cursor.execute("INSERT INTO students VALUES (?, ?)", (name, age)). This prevents SQL injection attacks.'
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:code-braces"
                label='"with" auto-closes'
                color="var(--sync)"
                body="Use `with sqlite3.connect('school.db') as conn:` so the connection closes automatically even if an error happens. No forgotten close()."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:database-sync-outline"
                label="pymysql / psycopg2"
                color="var(--microtask)"
                body="For MySQL, pip install pymysql. For PostgreSQL, pip install psycopg2. Same cursor + execute + fetchall API as sqlite3."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:cube-outline"
                label="ORMs: SQLAlchemy, Django"
                color="var(--accent)"
                body="Once your project grows, you move from raw SQL to an ORM. Models become Python classes. `Student.objects.all()` replaces `SELECT * FROM students`."
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
              padding: "14px 18px",
              backgroundColor: "rgba(255, 141, 161, 0.08)",
              border: "1px dashed var(--task)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              lineHeight: 1.55,
            }}
          >
            <b style={{ color: "var(--task)" }}>SQL injection in one line:</b> <code style={{ fontFamily: "Roboto Mono, monospace" }}>f"... WHERE name = '{"{"}name{"}"}'"</code> lets an attacker type <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--task)" }}>'; DROP TABLE students;--</code> and your table is gone. Use <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--sync)" }}>?</code> placeholders. Always.
          </div>
        </SlideLayout>
      ),
    },

    // 10. VS Code extensions for Python + SQLite (COOL TOOLS, chapter-scoped)
    {
      id: "vscode-extensions",
      title: "Cool VS Code extensions for this chapter",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Open school.db inside VS Code"
          subtitle="Four extensions · just the ones you need for Python + SQLite work."
          accent="var(--microtask)"
        >
          <BookExtensionTag color="var(--microtask)" label="COOL TOOLS" />
          <p
            style={{
              fontSize: 17,
              color: "var(--muted)",
              lineHeight: 1.55,
              marginBottom: 14,
            }}
          >
            Open VS Code, press <code style={{ color: "var(--accent)", fontFamily: "Roboto Mono, monospace", backgroundColor: "var(--panel)", padding: "2px 6px", borderRadius: 4 }}>Ctrl+Shift+X</code>, and paste the IDs below. Then you can run the sqlite3 script and view school.db without leaving the editor.
          </p>
          <Stagger
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 18,
            }}
          >
            <StaggerItem style={{ height: "100%" }}>
              <ExtensionCard
                icon="mdi:language-python"
                name="Python"
                pub="ms-python.python"
                tag="RUN THE CODE"
                color="var(--accent)"
                blurb="Microsoft's official Python extension. Lets you run and debug the sqlite3 example line by line. Without this, VS Code is just a text editor."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <ExtensionCard
                icon="mdi:database-eye-outline"
                name="SQLite Viewer"
                pub="qwtel.sqlite-viewer"
                tag="VIEW school.db"
                color="var(--sync)"
                blurb="Opens any .db file in a visual table view. Click school.db in the sidebar and the rows the Python script inserted show up instantly."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <ExtensionCard
                icon="mdi:console-line"
                name="SQLTools + SQLite driver"
                pub="mtxr.sqltools (+ mtxr.sqltools-driver-sqlite)"
                tag="RUN SQL"
                color="var(--microtask)"
                blurb="A full SQL console inside VS Code. Write SELECT / INSERT / UPDATE / DELETE queries against school.db, hit Run, see the result in a table. Install BOTH extensions."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <ExtensionCard
                icon="mdi:database-outline"
                name="SQLite"
                pub="alexcvzz.vscode-sqlite"
                tag="QUICK QUERIES"
                color="var(--task)"
                blurb='Lighter alternative to SQLTools. Right-click any .db file → "Open Database" → write SQL and run. Great for quick peeks at the students table.'
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
              padding: "12px 16px",
              backgroundColor: "rgba(228, 183, 255, 0.08)",
              border: "1px dashed var(--microtask)",
              borderRadius: 10,
              fontSize: 14,
              color: "var(--text)",
              lineHeight: 1.55,
            }}
          >
            <b style={hlViolet}>Workflow tip:</b> run the Python script in a terminal, then click school.db in the SQLite Viewer sidebar to see the new rows appear. No need to type <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--accent)" }}>SELECT *</code> yourself.
          </div>
        </SlideLayout>
      ),
    },

    // 11. Common pitfalls
    {
      id: "pitfalls",
      title: "Common pitfalls",
      render: (
        <SlideLayout
          title="Four pitfalls that catch every beginner"
          subtitle="Memorise these now and save yourself a weekend of debugging."
          accent="var(--warn)"
        >
          <BookExtensionTag color="var(--warn)" label="PRO TIPS" />
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:content-save-alert-outline"
                label="Forgot commit()"
                color="var(--warn)"
                body="You INSERT a row, print 'Done!', close the program. Next run shows nothing. Rule: every INSERT / UPDATE / DELETE needs a commit()."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:file-lock-outline"
                label="Forgot close()"
                color="var(--task)"
                body="Program crashes mid-run. Next time you open school.db from the SQLite Viewer, it says 'database locked'. Use `with` to auto-close."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:shield-off-outline"
                label="SQL injection via f-strings"
                color="var(--task)"
                body="Building SQL with f-strings and user input is a security hole. Use ? placeholders instead: cursor.execute('...WHERE name = ?', (name,))"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:folder-alert-outline"
                label="Wrong working directory"
                color="var(--microtask)"
                body='sqlite3.connect("school.db") uses the current folder. If you run from the wrong place, you create a new empty school.db in that folder. Use absolute paths or Path(__file__).parent.'
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
        <SlideLayout title="Important Concepts from 4.2b" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:connection"
                term="Connection"
                def="Opens a channel to the database file (sqlite3) or server (MySQL). Required before any data operation. Created with sqlite3.connect() or pymysql.connect()."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cursor-pointer"
                term="Cursor"
                def="An object used to execute SQL queries. Every SQL command is sent through a cursor. Created with connection.cursor()."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:play-circle-outline"
                term="execute()"
                def="Runs a single SQL command. Example: cursor.execute('SELECT * FROM students'). Use ? placeholders for user input to prevent SQL injection."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:content-save-outline"
                term="commit()"
                def="Saves pending INSERT / UPDATE / DELETE changes to the database file. Without commit(), the changes are lost when the program ends."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:download-outline"
                term="fetchall()"
                def="Returns all rows produced by the last SELECT query as a list of tuples. Each tuple holds the column values in order."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:close-circle-outline"
                term="close()"
                def="Closes the database connection, releasing file locks and freeing resources. Always call close() at the end (or use `with` to auto-close)."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Coming up next: 4.2c CRUD
    {
      id: "next-topic",
      title: "Next up: 4.2c CRUD Operations",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Coming up next" accent="var(--sync)">
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
