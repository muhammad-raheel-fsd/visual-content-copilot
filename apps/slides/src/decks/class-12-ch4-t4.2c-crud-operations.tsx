/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.2c · CRUD Operations
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: CRUD intro paragraph, Table 4.1, all 4 operation definitions
 * (Create/Read/Update/Delete), CLASS ACTIVITY, Delete Python code, and
 * 3-bullet summary are copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.2c-crud-operations.md`.
 *
 * Research plan: ../research.md · section 3 · 4.2c. 15 slides initially; agent
 * in background will produce Figure 4.4 hand-drawn to add as slide 2b.
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
const hlPink: CSSProperties = { color: "var(--task)", fontWeight: 700 };

// Fixed color per CRUD operation (consistent across whole deck)
const C_CREATE = "var(--accent)";
const C_READ = "var(--sync)";
const C_UPDATE = "var(--microtask)";
const C_DELETE = "var(--task)";

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

// ── SQL inline code pill ────────────────────────────────────────────────

const SqlPill: React.FC<{ children: ReactNode; color?: string }> = ({ children, color = "var(--accent)" }) => (
  <code
    style={{
      padding: "6px 12px",
      backgroundColor: "#0b0820",
      borderRadius: 6,
      fontFamily: "Roboto Mono, monospace",
      fontSize: 14,
      color,
      border: `1px solid ${color}55`,
    }}
  >
    {children}
  </code>
);

// ── PropCard + ConceptTag ──────────────────────────────────────────────

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

const ConceptTag: React.FC<{ icon: string; term: string; def: string; color?: string }> = ({
  icon,
  term,
  def,
  color = "var(--accent)",
}) => (
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
    <Icon icon={icon} width={30} height={30} color={color} />
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, color, marginBottom: 4 }}>{term}</div>
      <div style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.55 }}>{def}</div>
    </div>
  </div>
);

// ── Figure 4.4 inline recreation (central table + 4 callouts) ────────────

const StudentsTableMini: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      border: "1.5px solid var(--sync)",
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: "#f5f0e4",
      boxShadow: "0 0 36px rgba(103, 216, 196, 0.3)",
    }}
  >
    <div
      style={{
        padding: "6px 14px",
        backgroundColor: "var(--sync)",
        color: "#0d0a1c",
        fontWeight: 800,
        fontSize: 13,
        fontFamily: "Roboto Mono, monospace",
        textAlign: "center",
      }}
    >
      students
    </div>
    <table
      style={{
        borderCollapse: "collapse",
        color: "#1b1326",
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#d8ccb3" }}>
          {["ID", "Name", "Age"].map((h) => (
            <th
              key={h}
              style={{
                padding: "6px 14px",
                border: "1px solid #a89880",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          ["1", "Ibrahim", "25"],
          ["2", "Zainab", "30"],
          ["3", "Kiran", "28"],
        ].map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td
                key={j}
                style={{
                  padding: "6px 14px",
                  border: "1px solid #a89880",
                  fontSize: 13,
                  textAlign: "center",
                  backgroundColor: "white",
                }}
              >
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CrudCallout: React.FC<{
  label: string;
  cmd: string;
  color: string;
  icon: string;
  align: "start" | "end";
}> = ({ label, cmd, color, icon, align }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "end" ? "flex-end" : "flex-start",
      gap: 6,
    }}
  >
    <div
      style={{
        fontSize: 12,
        letterSpacing: 2,
        color,
        fontWeight: 800,
      }}
    >
      {label.toUpperCase()}
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        backgroundColor: `${color}18`,
        border: `1.5px solid ${color}`,
        color,
        fontFamily: "Roboto Mono, monospace",
        fontWeight: 800,
        fontSize: 15,
      }}
    >
      <Icon icon={icon} width={20} />
      <span>{cmd}</span>
    </div>
  </div>
);

const Figure44Inline: React.FC = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      gap: 32,
      padding: "10px 0",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
      <CrudCallout label="Create" cmd="INSERT..." color={C_CREATE} icon="mdi:plus-circle-outline" align="start" />
      <CrudCallout label="Update" cmd="UPDATE..." color={C_UPDATE} icon="mdi:pencil-outline" align="start" />
    </div>
    <StudentsTableMini />
    <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end" }}>
      <CrudCallout label="Read" cmd="SELECT..." color={C_READ} icon="mdi:magnify" align="end" />
      <CrudCallout label="Delete" cmd="DELETE..." color={C_DELETE} icon="mdi:trash-can-outline" align="end" />
    </div>
  </div>
);

// ── Table 4.1 (CRUD operations table) ───────────────────────────────────

const Table41Row: React.FC<{
  cmd: string;
  example: string;
  desc: string;
  color: string;
  icon: string;
}> = ({ cmd, example, desc, color, icon }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "140px 2fr 1.4fr",
      gap: 16,
      alignItems: "center",
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon icon={icon} width={26} color={color} />
      <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "Roboto Mono, monospace" }}>
        {cmd}
      </div>
    </div>
    <code
      style={{
        padding: "6px 10px",
        backgroundColor: "#0b0820",
        borderRadius: 6,
        fontFamily: "Roboto Mono, monospace",
        fontSize: 13,
        color: "var(--text)",
      }}
    >
      {example}
    </code>
    <div style={{ fontSize: 14, color: "var(--muted)" }}>{desc}</div>
  </div>
);

// ── Code snippets ──────────────────────────────────────────────────────

const CREATE_CODE = `import sqlite3

connection = sqlite3.connect("school.db")
cursor = connection.cursor()

# INSERT a new student
cursor.execute(
    "INSERT INTO students (ID, Name, Age) VALUES (1, 'John', 20)"
)

# Save and close
connection.commit()
connection.close()`;

const READ_CODE = `import sqlite3

connection = sqlite3.connect("school.db")
cursor = connection.cursor()

# SELECT all rows
cursor.execute("SELECT * FROM students")
records = cursor.fetchall()

# Display
for row in records:
    print(row)

# No commit needed (SELECT does not change data)
connection.close()`;

const UPDATE_CODE = `import sqlite3

connection = sqlite3.connect("school.db")
cursor = connection.cursor()

# UPDATE student with ID = 1
cursor.execute(
    "UPDATE students SET Age = 21 WHERE ID = 1"
)

# Save and close
connection.commit()
connection.close()`;

const DELETE_CODE = `import sqlite3
# Connect to the database
connection = sqlite3.connect("school.db")
# Create a cursor object
cursor = connection.cursor()
# Execute DELETE query (example: delete student with ID = 1)
cursor.execute("DELETE FROM students WHERE ID = 1")
# Save changes
connection.commit()
# Display confirmation
print("Record deleted successfully")
# Close the connection
connection.close()`;

// ── Chapter-end hero (slide 15) ─────────────────────────────────────────

const ChapterEndHero: React.FC = () => (
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
      border: "2px solid var(--accent)",
      borderRadius: 20,
      boxShadow: "0 0 60px rgba(201, 166, 107, 0.3)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--accent)",
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        CH 4 WRAPPED
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text)" }}>
        All 7 sub-topics shipped
      </div>
    </div>
    <div
      style={{
        fontSize: 19,
        color: "var(--muted)",
        textAlign: "center",
        maxWidth: 820,
        lineHeight: 1.55,
      }}
    >
      You went from <b style={hlGold}>Tkinter windows</b> and <b style={hlGold}>buttons</b>, through <b style={hlViolet}>event handling</b> and a <b style={hlViolet}>login form</b>, into <b style={hlTeal}>databases</b>, <b style={hlTeal}>SQL</b>, and all four <b style={hlPink}>CRUD operations</b>.
    </div>
    <div
      style={{
        display: "flex",
        gap: 10,
        marginTop: 4,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {["4.1a Tkinter intro", "4.1b Widgets+Frames", "4.1c Layouts", "4.1d Event handling", "4.2a DB concepts", "4.2b Python+DB", "4.2c CRUD"].map((t) => (
        <div
          key={t}
          style={{
            padding: "6px 12px",
            backgroundColor: "rgba(201, 166, 107, 0.12)",
            border: "1px solid rgba(201, 166, 107, 0.4)",
            borderRadius: 999,
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {t}
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: 10,
        padding: "14px 20px",
        backgroundColor: "rgba(103, 216, 196, 0.08)",
        border: "1px dashed var(--sync)",
        borderRadius: 10,
        fontSize: 16,
        color: "var(--text)",
        textAlign: "center",
      }}
    >
      Next up for this chapter: the <b style={hlTeal}>Revision deck</b>, the <b style={hlTeal}>Quick Quiz deck</b>, and the <b style={hlTeal}>Board Exercise</b> (pages 58-59) with answer key.
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4T42cCrudOperationsDeck: Deck = {
  title: "CRUD Operations",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.2c · CRUD Operations",
  topicCode: "4.2c",
  topicTitle: "CRUD Operations",
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
              4.2c <span style={{ color: ACCENT }}>CRUD</span> Operations
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                {[
                  { l: "C", word: "Create", color: C_CREATE, cmd: "INSERT" },
                  { l: "R", word: "Read", color: C_READ, cmd: "SELECT" },
                  { l: "U", word: "Update", color: C_UPDATE, cmd: "UPDATE" },
                  { l: "D", word: "Delete", color: C_DELETE, cmd: "DELETE" },
                ].map((o) => (
                  <div
                    key={o.l}
                    style={{
                      padding: "14px 18px",
                      borderRadius: 14,
                      border: `1.5px solid ${o.color}`,
                      backgroundColor: `${o.color}18`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      minWidth: 130,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 48,
                        fontWeight: 900,
                        color: o.color,
                        fontFamily: "Roboto Mono, monospace",
                        lineHeight: 1,
                      }}
                    >
                      {o.l}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: o.color }}>{o.word}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--muted)",
                        fontFamily: "Roboto Mono, monospace",
                      }}
                    >
                      {o.cmd}
                    </div>
                  </div>
                ))}
              </div>
              Four basic database actions. Every app you'll ever build does these.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. CRUD intro (verbatim) + Figure 4.4 inline
    {
      id: "crud-intro",
      title: "CRUD Operations",
      transition: "slide",
      render: (
        <SlideLayout
          title="CRUD Operations"
          subtitle="Create, Read, Update, Delete · the four basic database actions."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              <b style={hlGold}>CRUD</b> stands for <b>Create, Read, Update, and Delete</b> and defines <b>basic database actions</b>. These operations are used to manage data stored in a database (as shown in Figure 4.4 and Table 4.1). <b>Every database-based application depends on CRUD operations</b>. They help maintain <b>accurate and up-to-date information</b>. Python uses SQL commands to perform these operations on databases.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon icon="mdi:chart-bubble" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                FIGURE 4.4 · THE FOUR ACTIONS AROUND A TABLE
              </span>
            </div>
            <Figure44Inline />
          </div>
        </SlideLayout>
      ),
    },

    // 2b. Figure 4.4 hand-drawn (Excalidraw-rendered)
    {
      id: "figure-4-4-handdrawn",
      title: "Figure 4.4 · hand-drawn",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Figure 4.4 (hand-drawn)"
          subtitle="The students table with Create, Read, Update, Delete around it."
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
              src="/diagrams/class-12-ch4-t4.2c-crud-flow.svg"
              alt="Hand-drawn Figure 4.4: students table in the center with Create INSERT, Read SELECT, Update UPDATE, Delete DELETE callouts around it"
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

    // 3. Table 4.1 verbatim
    {
      id: "table-4-1",
      title: "Table 4.1 · CRUD commands",
      render: (
        <SlideLayout
          title="Table 4.1 · CRUD operations (verbatim)"
          subtitle="One SQL command per operation. Memorise the shape of each."
          accent={ACCENT}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <Table41Row
                cmd="INSERT"
                icon="mdi:plus-circle-outline"
                color={C_CREATE}
                example="INSERT INTO students (ID, Name, Age) VALUES (1, 'John', 20);"
                desc="Adds a new record to a table."
              />
            </StaggerItem>
            <StaggerItem>
              <Table41Row
                cmd="READ"
                icon="mdi:magnify"
                color={C_READ}
                example="SELECT * FROM students;"
                desc="Retrieves data from a table."
              />
            </StaggerItem>
            <StaggerItem>
              <Table41Row
                cmd="UPDATE"
                icon="mdi:pencil-outline"
                color={C_UPDATE}
                example="UPDATE students SET Age = 21 WHERE ID = 1;"
                desc="Modifies an existing record in a table."
              />
            </StaggerItem>
            <StaggerItem>
              <Table41Row
                cmd="DELETE"
                icon="mdi:trash-can-outline"
                color={C_DELETE}
                example="DELETE FROM students WHERE ID = 1;"
                desc="Removes a record from a table."
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
              padding: "12px 18px",
              backgroundColor: "rgba(201, 166, 107, 0.08)",
              border: "1px dashed var(--accent)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Write operations (INSERT, UPDATE, DELETE) need <code style={{ fontFamily: "Roboto Mono, monospace", color: ACCENT }}>commit()</code>. SELECT does not · it only reads.
          </div>
        </SlideLayout>
      ),
    },

    // 4. Create: Adding New Records (verbatim)
    {
      id: "create-adding",
      title: "Create · Adding New Records",
      render: (
        <SlideLayout
          title="Create: Adding New Records"
          subtitle='INSERT a new row. Python sends the command. Row becomes stored data.'
          accent={C_CREATE}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlGold}>Create</b> operation is used to <b>add new data</b> to a database table. It stores information such as <b>names, values, or records</b>. <b>SQL insert commands</b> are used for this purpose. Python sends these commands to the database. <b>New records become part of the stored data after execution</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Icon icon="mdi:plus-circle-outline" width={28} color={C_CREATE} />
              <SqlPill color={C_CREATE}>
                INSERT INTO students (ID, Name, Age) VALUES (1, 'John', 20);
              </SqlPill>
              <Icon icon="mdi:arrow-right-bold" width={28} color="var(--muted)" />
              <div style={{ fontSize: 16, color: "var(--text)" }}>
                Adds <b style={hlGold}>one new row</b> to the students table.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 5. Create · Python
    {
      id: "create-code",
      title: "Create · Python code",
      render: (
        <SlideLayout
          title="Create · Python code"
          subtitle='Open connection, execute INSERT, commit, close. (follows the Delete-example pattern from the book).'
          accent={C_CREATE}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, minHeight: 0 }}>
            <PythonCode source={CREATE_CODE} fontSize={16} maxHeight={760} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PropCard
                icon="mdi:plus-circle-outline"
                label="What happens"
                color={C_CREATE}
                body="A single INSERT statement adds one new row. commit() writes the change to disk. Without commit(), the row is lost when the program ends."
              />
              <PropCard
                icon="mdi:lightbulb-outline"
                label="Pro tip"
                color="var(--sync)"
                body='For user input, use parameter placeholders: cursor.execute("INSERT INTO students VALUES (?, ?, ?)", (id, name, age)). Prevents SQL injection.'
              />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 6. Read: Retrieving and Displaying Data (verbatim)
    {
      id: "read-retrieving",
      title: "Read · Retrieving + Displaying",
      render: (
        <SlideLayout
          title="Read: Retrieving and Displaying Data"
          subtitle='SELECT returns rows. Python processes them. Never changes the data.'
          accent={C_READ}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlTeal}>Read</b> operation is used to <b>fetch data from the database</b>. It helps <b>display stored records when needed</b>. SQL select commands are commonly used for reading data. Python retrieves the results and processes them. <b>This operation does not change the stored data</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Icon icon="mdi:magnify" width={28} color={C_READ} />
              <SqlPill color={C_READ}>SELECT * FROM students;</SqlPill>
              <Icon icon="mdi:arrow-right-bold" width={28} color="var(--muted)" />
              <div style={{ fontSize: 16, color: "var(--text)" }}>
                Returns <b style={hlTeal}>all columns</b> of <b>all rows</b> from students.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 7. Read · Python code
    {
      id: "read-code",
      title: "Read · Python code",
      render: (
        <SlideLayout
          title="Read · Python code"
          subtitle='SELECT, fetchall(), loop, print. No commit() needed. (follows the Delete-example pattern from the book).'
          accent={C_READ}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, minHeight: 0 }}>
            <PythonCode source={READ_CODE} fontSize={16} maxHeight={760} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PropCard
                icon="mdi:download-outline"
                label="fetchall()"
                color={C_READ}
                body="Returns a list of tuples. One tuple per row. Each tuple holds the column values in order."
              />
              <PropCard
                icon="mdi:cancel"
                label="No commit for SELECT"
                color="var(--muted)"
                body="Reading never changes the stored data, so commit() is not required (and not harmful if you call it)."
              />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Update: Modifying Existing Records (verbatim)
    {
      id: "update-modifying",
      title: "Update · Modifying Existing Records",
      render: (
        <SlideLayout
          title="Update: Modifying Existing Records"
          subtitle="Fix stored info. SET the new value, WHERE picks the row."
          accent={C_UPDATE}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlViolet}>Update</b> operation <b>changes existing data</b> in a database. It is used when stored information needs correction. <b>SQL update commands modify selected records</b>. Python executes these commands based on <b>conditions</b>. <b>Only the specified data is changed</b> during this process.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Icon icon="mdi:pencil-outline" width={28} color={C_UPDATE} />
              <SqlPill color={C_UPDATE}>UPDATE students SET Age = 21 WHERE ID = 1;</SqlPill>
              <Icon icon="mdi:arrow-right-bold" width={28} color="var(--muted)" />
              <div style={{ fontSize: 16, color: "var(--text)" }}>
                Changes <b style={hlViolet}>only the student with ID 1</b> to Age 21.
              </div>
            </div>
            <div
              style={{
                padding: "12px 18px",
                backgroundColor: "rgba(255, 141, 161, 0.08)",
                border: "1px dashed var(--task)",
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
                <b style={hlPink}>UPDATE without WHERE</b> changes <b>every row</b>. Always include the WHERE clause.
              </span>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. Update · Python code
    {
      id: "update-code",
      title: "Update · Python code",
      render: (
        <SlideLayout
          title="Update · Python code"
          subtitle='Open connection, execute UPDATE, commit, close. (follows the Delete-example pattern from the book).'
          accent={C_UPDATE}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, minHeight: 0 }}>
            <PythonCode source={UPDATE_CODE} fontSize={16} maxHeight={760} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PropCard
                icon="mdi:pencil-outline"
                label="What happens"
                color={C_UPDATE}
                body="SET names the column(s) to change. WHERE picks which row(s) are affected. commit() saves to disk."
              />
              <PropCard
                icon="mdi:format-list-numbered"
                label="Multiple columns"
                color="var(--sync)"
                body="You can set many columns at once: UPDATE students SET Age = 21, Name = 'John S.' WHERE ID = 1."
              />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 10. CLASS ACTIVITY (yellow)
    {
      id: "class-activity",
      title: "Class Activity",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="CLASS ACTIVITY"
          subtitle="Try this in the computer lab · verbatim from the book."
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
                <div style={{ fontSize: 28, color: "var(--text)", lineHeight: 1.5 }}>
                  <b style={{ color: "var(--warn)" }}>Update a student's marks</b> and <b style={{ color: "var(--warn)" }}>display updated data</b>.
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
                  Hint: run <span style={{ color: C_UPDATE }}>UPDATE students SET Marks = ? WHERE ID = ?</span> then <span style={{ color: C_READ }}>SELECT * FROM students WHERE ID = ?</span> to confirm.
                </div>
              </div>
            </motion.div>
          </div>
        </SlideLayout>
      ),
    },

    // 11. Delete: Removing Data Safely (verbatim)
    {
      id: "delete-removing",
      title: "Delete · Removing Data Safely",
      render: (
        <SlideLayout
          title="Delete: Removing Data Safely"
          subtitle="Remove unwanted rows. Always with a WHERE condition."
          accent={C_DELETE}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              The <b style={hlPink}>Delete</b> operation <b>removes unwanted data</b> from a database. It helps keep the database <b>clean and accurate</b>. <b>SQL delete commands are used with conditions</b>. Python ensures only selected records are removed. <b>Careful use prevents loss of important data</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <Icon icon="mdi:trash-can-outline" width={28} color={C_DELETE} />
              <SqlPill color={C_DELETE}>DELETE FROM students WHERE ID = 1;</SqlPill>
              <Icon icon="mdi:arrow-right-bold" width={28} color="var(--muted)" />
              <div style={{ fontSize: 16, color: "var(--text)" }}>
                Removes <b style={hlPink}>only the student with ID 1</b>.
              </div>
            </div>
            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "rgba(255, 141, 161, 0.08)",
                border: "1.5px solid var(--task)",
                borderRadius: 10,
                fontSize: 16,
                color: "var(--text)",
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                lineHeight: 1.55,
              }}
            >
              <Icon icon="mdi:alert-octagon-outline" width={26} color="var(--task)" />
              <div>
                <b style={hlPink}>Warning:</b> <code style={{ fontFamily: "Roboto Mono, monospace", color: "var(--task)" }}>DELETE FROM students</code> (no WHERE) deletes <b>every row</b>. There is no undo. Always include the WHERE clause.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 12. Delete · Python code (verbatim)
    {
      id: "delete-code",
      title: "Delete · Python code (verbatim)",
      render: (
        <SlideLayout
          title="Delete · Python code (verbatim from book)"
          subtitle="The exact sqlite3 example from the book."
          accent={C_DELETE}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, minHeight: 0 }}>
            <PythonCode source={DELETE_CODE} fontSize={15} maxHeight={760} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <PropCard
                icon="mdi:trash-can-outline"
                label="Core line"
                color={C_DELETE}
                body='cursor.execute("DELETE FROM students WHERE ID = 1") removes exactly one row · the student with ID 1.'
              />
              <PropCard
                icon="mdi:content-save-outline"
                label="commit() is critical"
                color="var(--warn)"
                body="Without commit(), the delete is NOT written to disk. Next time you open school.db, the record is still there."
              />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 13. Delete 3-bullet summary (verbatim)
    {
      id: "delete-bullets",
      title: "Delete · 3 bullets from the book",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="How the Delete code works · three bullets"
          subtitle="Verbatim bullets from the book."
          accent={C_DELETE}
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                icon: "mdi:trash-can-outline",
                left: "DELETE FROM students WHERE ID = 1",
                right: "removes a specific record",
                color: C_DELETE,
                mono: true,
              },
              {
                icon: "mdi:content-save-outline",
                left: "connection.commit()",
                right: "saves the changes in database",
                color: C_CREATE,
                mono: true,
              },
              {
                icon: "mdi:alert-octagon-outline",
                left: "Without commit()",
                right: "deletion will not be permanent",
                color: "var(--warn)",
                mono: false,
              },
            ].map((row) => (
              <StaggerItem key={row.left}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 60px 1fr",
                    gap: 20,
                    alignItems: "center",
                    padding: "20px 24px",
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
                      fontSize: row.mono ? 18 : 20,
                      fontWeight: 800,
                      color: row.color,
                      fontFamily: row.mono ? "Roboto Mono, monospace" : undefined,
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

    // 14. BEYOND THE BOOK · REST + transactions
    {
      id: "beyond-book",
      title: "Beyond the book",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="CRUD is everywhere" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            CRUD is not just SQL. It is the universal shape of every data system you will touch.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:web"
                label="REST APIs = CRUD"
                color="var(--sync)"
                body="POST = Create, GET = Read, PUT or PATCH = Update, DELETE = Delete. Every web backend you'll build maps directly to these four verbs."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:undo-variant"
                label="Transactions + rollback"
                color="var(--microtask)"
                body="A transaction groups several writes. If anything fails, rollback() undoes them all. Use for anything that must succeed or fail together (bank transfers)."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:shield-off-outline"
                label="SQL injection, again"
                color="var(--warn)"
                body="Especially for DELETE and UPDATE. Never build SQL with f-strings. Always use ? placeholders with (value,) tuples."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:eye-outline"
                label="Soft delete"
                color="var(--accent)"
                body="Real apps rarely DELETE. They set a deleted_at column instead · the row stays, hidden from reads. Lets you recover deleted data."
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
            <b style={hlViolet}>Big picture:</b> once you know CRUD, every backend job, every API, every mobile app's data layer feels familiar. This is the base vocabulary of all software data work.
          </div>
        </SlideLayout>
      ),
    },

    // 15. Important Concepts + Chapter end
    {
      id: "concepts-and-end",
      title: "Important Concepts + Chapter 4 wrapped",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Important Concepts + Chapter 4 complete" accent={ACCENT}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:chart-bubble"
                  color="var(--accent)"
                  term="CRUD"
                  def="Create, Read, Update, Delete. The four basic database actions. Every database-based application depends on them."
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:plus-circle-outline"
                  color={C_CREATE}
                  term="Create (INSERT)"
                  def="Adds new data to a database table. SQL: INSERT INTO students (ID, Name, Age) VALUES (1, 'John', 20);"
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:magnify"
                  color={C_READ}
                  term="Read (SELECT)"
                  def="Fetches data from the database. Does not change stored data. SQL: SELECT * FROM students;"
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:pencil-outline"
                  color={C_UPDATE}
                  term="Update (UPDATE)"
                  def="Modifies existing records. Only specified rows change. SQL: UPDATE students SET Age = 21 WHERE ID = 1;"
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:trash-can-outline"
                  color={C_DELETE}
                  term="Delete (DELETE)"
                  def="Removes records safely with a WHERE condition. SQL: DELETE FROM students WHERE ID = 1;"
                />
              </StaggerItem>
              <StaggerItem>
                <ConceptTag
                  icon="mdi:content-save-outline"
                  color="var(--sync)"
                  term="commit()"
                  def="Saves write operations (INSERT / UPDATE / DELETE) to the database. Without commit(), changes are not permanent."
                />
              </StaggerItem>
            </Stagger>
            <ChapterEndHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
