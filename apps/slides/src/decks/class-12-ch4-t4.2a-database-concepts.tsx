/**
 * Class 12 CS · Chapter 4 · Sub-topic 4.2a · Database Concepts + SQL Structure
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * VERBATIM RULE: Definitions (Entity, Attribute, Relationship, Identifier),
 * 5 "Understanding Databases" bullets, DO YOU KNOW box, Figure 4.3 data, and
 * the "Overview of Relational Databases and SQL Structure" paragraph are
 * copied EXACTLY from
 * `curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/t4.2a-database-concepts.md`.
 * Real-world extensions clearly labelled BEYOND THE BOOK.
 *
 * Research plan: ../research.md · section 3 · 4.2a. 14 slides initially; agent
 * in background will produce Figure 4.3 hand-drawn to add as slide 10.
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

// ── Data table (for Figure 4.3) ─────────────────────────────────────────

type Cell = { text: string; highlight?: "fk" | "pk" };

const DataTable: React.FC<{
  title: string;
  columns: string[];
  rows: Cell[][];
  accent: string;
  pkIndex?: number; // which column is the primary key
  fkIndex?: number; // which column is the foreign key
}> = ({ title, columns, rows, accent, pkIndex, fkIndex }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      border: `1.5px solid ${accent}`,
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: "#f5f0e4",
      boxShadow: `0 0 32px ${accent}33`,
      minWidth: 320,
    }}
  >
    <div
      style={{
        padding: "8px 14px",
        backgroundColor: accent,
        color: "#0d0a1c",
        fontWeight: 800,
        fontSize: 14,
        letterSpacing: 1,
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      Table: {title}
    </div>
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        color: "#1b1326",
        fontFamily: "Roboto Mono, monospace",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#d8ccb3" }}>
          {columns.map((c, i) => (
            <th
              key={c}
              style={{
                padding: "8px 12px",
                textAlign: "left",
                fontSize: 13,
                fontWeight: 800,
                border: "1px solid #a89880",
                backgroundColor: i === pkIndex ? "#f8ddb0" : i === fkIndex ? "#c5e9d3" : "#d8ccb3",
              }}
            >
              {c}
              {i === pkIndex && (
                <span style={{ fontSize: 10, color: "#a67510", marginLeft: 6 }}>PK</span>
              )}
              {i === fkIndex && (
                <span style={{ fontSize: 10, color: "#2a6b45", marginLeft: 6 }}>FK</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  border: "1px solid #a89880",
                  backgroundColor:
                    cell.highlight === "fk"
                      ? "#dff4e7"
                      : cell.highlight === "pk"
                        ? "#fcefd4"
                        : "white",
                }}
              >
                {cell.text}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Student table data (from Figure 4.3)
const STUDENT_COLS = ["RollNo", "Name", "Age", "DeptID"];
const STUDENT_ROWS: Cell[][] = [
  [{ text: "101", highlight: "pk" }, { text: "Kiran" }, { text: "20" }, { text: "1", highlight: "fk" }],
  [{ text: "102", highlight: "pk" }, { text: "Ibrahim" }, { text: "21" }, { text: "2", highlight: "fk" }],
  [{ text: "103", highlight: "pk" }, { text: "M Kamal" }, { text: "20" }, { text: "1", highlight: "fk" }],
  [{ text: "104", highlight: "pk" }, { text: "Zainab" }, { text: "22" }, { text: "3", highlight: "fk" }],
];
const DEPT_COLS = ["DeptID", "DeptName"];
const DEPT_ROWS: Cell[][] = [
  [{ text: "1", highlight: "pk" }, { text: "Computer Science" }],
  [{ text: "2", highlight: "pk" }, { text: "Electronics" }],
  [{ text: "3", highlight: "pk" }, { text: "Mechanical" }],
];

// ── Figure 4.3 inline recreate (slide 9) ─────────────────────────────────

const Figure43Inline: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      padding: "10px 0",
    }}
  >
    <DataTable
      title="Student"
      columns={STUDENT_COLS}
      rows={STUDENT_ROWS}
      accent="var(--sync)"
      pkIndex={0}
      fkIndex={3}
    />
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring" }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Icon icon="mdi:arrow-right-bold" width={44} color="var(--microtask)" />
      <div
        style={{
          fontSize: 12,
          color: "var(--microtask)",
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        FOREIGN KEY
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)" }}>DeptID → DeptID</div>
    </motion.div>
    <DataTable
      title="Department"
      columns={DEPT_COLS}
      rows={DEPT_ROWS}
      accent="var(--accent)"
      pkIndex={0}
    />
  </div>
);

// ── SQL command preview (slide 11) ──────────────────────────────────────

const SqlRow: React.FC<{ kind: string; cmd: string; purpose: string; color: string; icon: string }> = ({
  kind,
  cmd,
  purpose,
  color,
  icon,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "140px 1fr 1fr",
      gap: 16,
      alignItems: "center",
      padding: "14px 18px",
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon icon={icon} width={26} height={26} color={color} />
      <div style={{ fontSize: 16, fontWeight: 800, color, fontFamily: "Roboto Mono, monospace" }}>
        {kind}
      </div>
    </div>
    <code
      style={{
        padding: "6px 10px",
        backgroundColor: "#0b0820",
        borderRadius: 6,
        fontFamily: "Roboto Mono, monospace",
        fontSize: 14,
        color: "var(--text)",
      }}
    >
      {cmd}
    </code>
    <div style={{ fontSize: 14, color: "var(--muted)" }}>{purpose}</div>
  </div>
);

// ── Hero preview (slide 1) ───────────────────────────────────────────────

const HeroTablePreview: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <DataTable
      title="Student"
      columns={["RollNo", "Name", "DeptID"]}
      rows={[
        [{ text: "101", highlight: "pk" }, { text: "Kiran" }, { text: "1", highlight: "fk" }],
        [{ text: "102", highlight: "pk" }, { text: "Ibrahim" }, { text: "2", highlight: "fk" }],
      ]}
      accent="var(--sync)"
      pkIndex={0}
      fkIndex={2}
    />
    <Icon icon="mdi:arrow-right-bold" width={32} color="var(--microtask)" />
    <DataTable
      title="Department"
      columns={["DeptID", "DeptName"]}
      rows={[
        [{ text: "1", highlight: "pk" }, { text: "Computer Science" }],
        [{ text: "2", highlight: "pk" }, { text: "Electronics" }],
      ]}
      accent="var(--accent)"
      pkIndex={0}
    />
  </div>
);

// ── Next-topic hero (slide 14) ──────────────────────────────────────────

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
        4.2b
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Connecting Python to a Database
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
      Tables on paper are nice. Now <b style={hlTeal}>Python</b> actually opens the file, runs <b style={hlGold}>sqlite3</b> queries, and talks to the database.
    </div>
    <div style={{ display: "flex", gap: 14, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:language-python", label: "import sqlite3" },
        { icon: "mdi:connection", label: "connect()" },
        { icon: "mdi:cursor-pointer", label: "cursor()" },
        { icon: "mdi:content-save-outline", label: "commit()" },
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

// ── QARow (slide 13) ────────────────────────────────────────────────────

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

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4T42aDatabaseConceptsDeck: Deck = {
  title: "Database Concepts + SQL Structure",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of Graphical User Interface (GUI)",
  topic: "4.2a · Databases + SQL",
  topicCode: "4.2a",
  topicTitle: "Database Concepts + SQL Structure",
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
              4.2a <span style={{ color: ACCENT }}>Databases</span> + SQL
            </>
          }
          subtitle={
            <>
              <div style={{ marginBottom: 24 }}>
                <HeroTablePreview />
              </div>
              Where <b style={hlGold}>real</b> app data lives. Tables, rows, keys, and the SQL that talks to them.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. 4.2 Working with Databases in Python (verbatim)
    {
      id: "working-with-databases",
      title: "4.2 Working with Databases in Python",
      transition: "slide",
      render: (
        <SlideLayout
          title="4.2 Working with Databases in Python"
          subtitle="Python can insert, retrieve, update, and delete data from a database."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Working with databases in Python involves <b style={hlGold}>storing and managing data</b> using database systems. Python programs can connect to databases to <b>insert</b>, <b>retrieve</b>, <b>update</b>, and <b>delete</b> data. Databases allow applications to handle <b>large amounts of information</b> efficiently. Using databases helps maintain <b>data accuracy and consistency</b>. Python supports database operations through <b>built-in and external libraries</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:database-outline" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                WHAT PYTHON CAN DO WITH A DATABASE
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:plus-box-outline"
                  label="Insert"
                  color="var(--accent)"
                  body="Add new records to a table (new students, new orders, new users)."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:magnify"
                  label="Retrieve"
                  color="var(--sync)"
                  body="Read existing records to show them on screen or process them."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:pencil-outline"
                  label="Update"
                  color="var(--microtask)"
                  body="Change the values in records that already exist."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:trash-can-outline"
                  label="Delete"
                  color="var(--task)"
                  body="Remove records that are no longer needed."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. DO YOU KNOW
    {
      id: "do-you-know",
      title: "Do you know · safe + fast",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="DO YOU KNOW?"
          subtitle="A one-line callout from the book, in a blue box."
          accent="var(--api)"
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
                backgroundColor: "rgba(123, 184, 227, 0.1)",
                border: "2px solid var(--api)",
                borderRadius: 20,
                boxShadow: "0 0 60px rgba(123, 184, 227, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Icon icon="mdi:help-circle-outline" width={64} height={64} color="var(--api)" />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    letterSpacing: 3,
                    color: "var(--api)",
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  DO YOU KNOW?
                </div>
                <div style={{ fontSize: 28, color: "var(--text)", lineHeight: 1.5 }}>
                  Databases allow programs to <b style={{ color: "var(--api)" }}>store large amounts of information safely</b> and <b style={{ color: "var(--api)" }}>retrieve it quickly</b> when needed.
                </div>
              </div>
            </motion.div>
          </div>
        </SlideLayout>
      ),
    },

    // 4. Introduction to Databases (verbatim)
    {
      id: "intro-to-databases",
      title: "Introduction to Databases",
      render: (
        <SlideLayout
          title="Introduction to Databases"
          subtitle="Organized data. Structured format. Accessed and managed easily."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlGold}>database</b> is an <b>organized collection of data</b> stored in a <b>structured format</b>. It allows data to be <b>accessed and managed easily</b>. Databases <b>reduce data duplication</b> and <b>improve reliability</b>. They support <b>secure storage</b> of information. Databases are commonly used in many types of software applications.
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
                FOUR BENEFITS FROM THE BOOK
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:folder-open-outline"
                  label="Easy access"
                  color="var(--accent)"
                  body="Data can be accessed and managed easily, not hidden in random files."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:content-duplicate"
                  label="No duplication"
                  color="var(--sync)"
                  body="Reduces data duplication. The same fact is stored in one place only."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:shield-check-outline"
                  label="Reliable + secure"
                  color="var(--microtask)"
                  body="Improves reliability and supports secure storage of information."
                />
              </StaggerItem>
              <StaggerItem style={{ height: "100%" }}>
                <PropCard
                  icon="mdi:apps"
                  label="Many applications"
                  color="var(--api)"
                  body="Commonly used in many types of software applications."
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 5. The ERD cast (overview of 4 concepts)
    {
      id: "erd-cast",
      title: "The data-modelling cast",
      render: (
        <SlideLayout
          title="The data-modelling cast"
          subtitle="Four concepts you will meet in every database design."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:account-outline"
                label="Entity"
                color="var(--accent)"
                body="A real-world object, person, place, event, or concept about which data is stored."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:tag-outline"
                label="Attribute"
                color="var(--sync)"
                body="A property or characteristic of an entity. Describes specific information about it."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:link-variant"
                label="Relationship"
                color="var(--microtask)"
                body="How two or more entities are connected with each other."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:key-variant"
                label="Identifier"
                color="var(--task)"
                body="An attribute that uniquely identifies each record or object of an entity."
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 18,
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
            Design starts with <b style={hlGold}>entities</b>, pins <b style={hlTeal}>attributes</b> on them, names <b style={hlViolet}>relationships</b>, then picks an <b style={{ color: "var(--task)", fontWeight: 700 }}>identifier</b>.
          </div>
        </SlideLayout>
      ),
    },

    // 6. Entity + Attribute deep dive
    {
      id: "entity-attribute",
      title: "Entity + Attribute",
      render: (
        <SlideLayout
          title="Entity + Attribute · Student as the running example"
          subtitle='"Student" is the entity. "Name, Roll Number, Class, Age" are its attributes.'
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, height: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--accent)",
                borderRadius: 14,
                boxShadow: "0 0 24px rgba(201, 166, 107, 0.22)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:account-outline" width={36} color="var(--accent)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>Entity</div>
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 18 }}>
                An entity is a <b>real-world object, person, place, event, or concept</b> about which data is stored in a database.
              </p>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "var(--muted)",
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                EXAMPLES FROM THE BOOK
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { icon: "mdi:school-outline", label: "Student" },
                  { icon: "mdi:account-tie-outline", label: "Teacher" },
                  { icon: "mdi:book-open-outline", label: "Course" },
                  { icon: "mdi:bookshelf", label: "Book" },
                  { icon: "mdi:briefcase-outline", label: "Employee" },
                ].map((e) => (
                  <div
                    key={e.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 999,
                      backgroundColor: "rgba(201, 166, 107, 0.12)",
                      border: "1px solid var(--accent)",
                    }}
                  >
                    <Icon icon={e.icon} width={18} color="var(--accent)" />
                    <span style={{ fontSize: 14, color: "var(--accent)", fontWeight: 700 }}>
                      {e.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--sync)",
                borderRadius: 14,
                boxShadow: "0 0 24px rgba(103, 216, 196, 0.22)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:tag-outline" width={36} color="var(--sync)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--sync)" }}>Attribute</div>
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 18 }}>
                An attribute is a <b>property or characteristic</b> of an entity. It describes <b>specific information</b> about an entity.
              </p>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "var(--muted)",
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                FOR THE ENTITY STUDENT, ATTRIBUTES CAN BE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "mdi:badge-account-outline", label: "Student Name" },
                  { icon: "mdi:numeric", label: "Roll Number" },
                  { icon: "mdi:school", label: "Class" },
                  { icon: "mdi:cake-variant-outline", label: "Age" },
                ].map((a) => (
                  <div
                    key={a.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 14px",
                      borderRadius: 10,
                      backgroundColor: "rgba(103, 216, 196, 0.08)",
                      border: "1px solid rgba(103, 216, 196, 0.4)",
                    }}
                  >
                    <Icon icon={a.icon} width={22} color="var(--sync)" />
                    <span style={{ fontSize: 16, color: "var(--text)", fontWeight: 600 }}>
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 7. Relationship + Identifier deep dive
    {
      id: "relationship-identifier",
      title: "Relationship + Identifier",
      render: (
        <SlideLayout
          title="Relationship + Identifier"
          subtitle='"A Student enrols in a Course." · "Roll Number" uniquely identifies a Student.'
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, height: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--microtask)",
                borderRadius: 14,
                boxShadow: "0 0 24px rgba(228, 183, 255, 0.22)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:link-variant" width={36} color="var(--microtask)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--microtask)" }}>
                  Relationship
                </div>
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 18 }}>
                A relationship shows how <b>two or more entities</b> are <b>connected</b> with each other.
              </p>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "var(--muted)",
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                EXAMPLE FROM THE BOOK
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  padding: "18px 14px",
                  backgroundColor: "rgba(228, 183, 255, 0.08)",
                  border: "1px dashed var(--microtask)",
                  borderRadius: 12,
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
                  <Icon icon="mdi:school-outline" width={38} color="var(--accent)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--accent)" }}>Student</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      backgroundColor: "var(--microtask)",
                      color: "#0d0a1c",
                      fontSize: 13,
                      fontWeight: 800,
                      fontStyle: "italic",
                    }}
                  >
                    enrols in
                  </div>
                  <Icon icon="mdi:arrow-right-bold" width={32} color="var(--microtask)" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Icon icon="mdi:book-open-outline" width={38} color="var(--sync)" />
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--sync)" }}>Course</div>
                </div>
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
                <b style={hlViolet}>enrols in</b> is the relationship. It connects two entities.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 22,
                backgroundColor: "var(--panel)",
                border: "1.5px solid var(--task)",
                borderRadius: 14,
                boxShadow: "0 0 24px rgba(255, 141, 161, 0.22)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon icon="mdi:key-variant" width={36} color="var(--task)" />
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--task)" }}>Identifier</div>
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 18 }}>
                An identifier is an attribute that <b>uniquely identifies</b> each <b>record or object</b> of an entity.
              </p>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "var(--muted)",
                  fontWeight: 800,
                  marginTop: 6,
                }}
              >
                EXAMPLE FROM THE BOOK
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  backgroundColor: "rgba(255, 141, 161, 0.08)",
                  border: "1px dashed var(--task)",
                  borderRadius: 10,
                  fontSize: 16,
                  color: "var(--text)",
                  lineHeight: 1.55,
                }}
              >
                For the entity <b style={hlGold}>Student</b>, <b style={{ color: "var(--task)" }}>Roll Number</b> can be used as an identifier because <b>each student has a unique roll number</b>.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                {["101 Kiran", "102 Ibrahim", "103 M Kamal", "104 Zainab"].map((s) => (
                  <div
                    key={s}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "var(--panel)",
                      border: "1px solid var(--task)",
                      borderRadius: 6,
                      fontSize: 13,
                      fontFamily: "Roboto Mono, monospace",
                      color: "var(--task)",
                      fontWeight: 700,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                No two students share the same roll number · perfect identifier.
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Understanding Databases: 5 key concepts
    {
      id: "understanding-databases",
      title: "Understanding Databases · 5 key concepts",
      render: (
        <SlideLayout
          title="Understanding Databases"
          subtitle="Five concepts the book calls out, verbatim."
          accent={ACCENT}
        >
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 20,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            Databases store important data required for application operation. They allow applications to manage large data sets effectively. Key database concepts are:
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:database-outline"
                label="Relational Database"
                color="var(--accent)"
                body="Stores data in tables (rows and columns) and links them using relationships."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:table"
                label="Table"
                color="var(--sync)"
                body="A collection of related data organised in rows (records) and columns (fields)."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:view-column-outline"
                label="Column"
                color="var(--microtask)"
                body="A property or characteristic of an entity (e.g., name, age)."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:key-variant"
                label="Primary Key"
                color="var(--task)"
                body="A unique identifier for each record in a table."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:link-variant"
                label="Foreign Key"
                color="var(--api)"
                body="A field that links one table to another by referring to the primary key of another table."
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
            Next slide shows Figure 4.3 · all five concepts drawn on real tables.
          </div>
        </SlideLayout>
      ),
    },

    // 9. Figure 4.3 inline (Student + Department)
    {
      id: "figure-4-3-inline",
      title: "Figure 4.3 · Student + Department tables",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Figure 4.3 · Student and Department tables"
          subtitle="RollNo is the primary key of Student. DeptID links Student to Department."
          accent={ACCENT}
        >
          <Figure43Inline />
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
            }}
          >
            {[
              {
                color: "var(--task)",
                icon: "mdi:key-variant",
                label: "PRIMARY KEY",
                body: "Unique id for each row. RollNo in Student, DeptID in Department.",
              },
              {
                color: "var(--sync)",
                icon: "mdi:link-variant",
                label: "FOREIGN KEY",
                body: "DeptID in Student points at DeptID (primary key) in Department.",
              },
              {
                color: "var(--microtask)",
                icon: "mdi:table-row",
                label: "RECORD (tuple)",
                body: "A single row. '102 | Ibrahim | 21 | 2' is one record in Student.",
              },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--panel)",
                  border: `1px solid ${c.color}`,
                  borderRadius: 10,
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <Icon icon={c.icon} width={26} color={c.color} />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      letterSpacing: 1.5,
                      fontWeight: 800,
                      color: c.color,
                      marginBottom: 4,
                    }}
                  >
                    {c.label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{c.body}</div>
                </div>
              </div>
            ))}
          </div>
        </SlideLayout>
      ),
    },

    // 9b. Figure 4.3 hand-drawn (Excalidraw-rendered)
    {
      id: "figure-4-3-handdrawn",
      title: "Figure 4.3 · hand-drawn",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Figure 4.3 (hand-drawn)"
          subtitle="Student + Department tables with Column, Field, Record, Primary Key, Foreign Key callouts."
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
              src="/diagrams/class-12-ch4-t4.2a-student-dept-tables.svg"
              alt="Hand-drawn Figure 4.3: Student table (RollNo PK, Name, Age, DeptID FK) linked to Department table (DeptID PK, DeptName) with annotation callouts"
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

    // 10. Overview of Relational Databases and SQL Structure
    {
      id: "overview-rdb-sql",
      title: "Overview of Relational Databases + SQL Structure",
      render: (
        <SlideLayout
          title="Overview of Relational Databases and SQL Structure"
          subtitle='SQL = Structured Query Language. Four commands cover almost everything. (Preview of Table 4.1 · covered in 4.2c.)'
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Relational databases organize data into <b style={hlGold}>tables</b> made of <b>rows and columns</b>. Each table stores related data in a <b>structured manner</b>. Relationships between tables are maintained using <b>keys</b>. <b style={hlGold}>SQL</b> stands for <b>Structured Query Language</b> and is used to <b>interact with databases</b>. SQL commands help <b>create, read, update, and delete</b> data.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:code-tags" width={22} height={22} color={ACCENT} />
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 2.5,
                  color: ACCENT,
                  fontWeight: 800,
                }}
              >
                FOUR SQL COMMANDS = CRUD
              </span>
            </div>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <StaggerItem>
                <SqlRow
                  kind="CREATE"
                  cmd="INSERT INTO students ..."
                  purpose="Add a new row to a table."
                  color="var(--accent)"
                  icon="mdi:plus-circle-outline"
                />
              </StaggerItem>
              <StaggerItem>
                <SqlRow
                  kind="READ"
                  cmd="SELECT * FROM students"
                  purpose="Retrieve rows from a table."
                  color="var(--sync)"
                  icon="mdi:magnify"
                />
              </StaggerItem>
              <StaggerItem>
                <SqlRow
                  kind="UPDATE"
                  cmd="UPDATE students SET Age = 21"
                  purpose="Change values in existing rows."
                  color="var(--microtask)"
                  icon="mdi:pencil-outline"
                />
              </StaggerItem>
              <StaggerItem>
                <SqlRow
                  kind="DELETE"
                  cmd="DELETE FROM students WHERE ID = 1"
                  purpose="Remove rows from a table."
                  color="var(--task)"
                  icon="mdi:trash-can-outline"
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
      title: "Beyond the book",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Databases in the real world" accent={ACCENT}>
          <BookExtensionTag />
          <p
            style={{
              ...bookQuoteStyle,
              fontSize: 19,
              color: "var(--muted)",
              marginBottom: 14,
            }}
          >
            The book teaches relational databases + SQL. Real applications use a bigger toolbox.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:database"
                label="Popular SQL engines"
                color="var(--sync)"
                body="SQLite (file-based, built into Python). MySQL / MariaDB (web apps). PostgreSQL (bigger apps, popular at startups). Microsoft SQL Server (enterprise)."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:file-tree-outline"
                label="NoSQL databases"
                color="var(--microtask)"
                body="Not every database is relational. MongoDB stores JSON-like documents. Redis stores key-value pairs. Good for flexible or very fast reads."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:microsoft-excel"
                label="Excel analogy"
                color="var(--accent)"
                body="A table is like an Excel sheet. Rows = records. Columns = fields. The big difference: databases enforce types + keys + relationships."
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <PropCard
                icon="mdi:shield-key-outline"
                label="Why keys matter"
                color="var(--task)"
                body="Without primary keys, you cannot tell two John Smiths apart. Without foreign keys, you cannot link orders to customers. Keys are the glue of relational data."
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
            <b style={hlViolet}>Rule of thumb:</b> if your data is tabular with clear relationships (students, courses, orders, invoices), use a relational SQL database. For free-form documents, consider a NoSQL one.
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
        <SlideLayout title="Important Concepts from 4.2a" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:database-outline"
                term="Database"
                def="An organized collection of data stored in a structured format. Reduces duplication, improves reliability, supports secure storage."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:account-outline"
                term="Entity"
                def="A real-world object, person, place, event, or concept about which data is stored in a database."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:tag-outline"
                term="Attribute"
                def="A property or characteristic of an entity. Describes specific information about an entity."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:link-variant"
                term="Relationship"
                def="Shows how two or more entities are connected with each other. Example: a Student enrols in a Course."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:key-variant"
                term="Identifier / Primary Key"
                def="An attribute that uniquely identifies each record of an entity. In a table, this is called the primary key."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:key-link"
                term="Foreign Key"
                def="A field that links one table to another by referring to the primary key of another table."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:table"
                term="Table"
                def="A collection of related data organised in rows (records) and columns (fields)."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:code-tags"
                term="SQL"
                def="Structured Query Language. Used to interact with databases. Commands help create, read, update, and delete data."
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
                q="Define a database."
                a="A database is an organized collection of data stored in a structured format. It allows data to be accessed and managed easily. Databases reduce data duplication and improve reliability."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What is an entity? Give three examples."
                a="An entity is a real-world object, person, place, event, or concept about which data is stored in a database. Examples: Student, Teacher, Course."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Differentiate between Primary Key and Foreign Key."
                a="A Primary Key uniquely identifies each record in a table (e.g., RollNo in Student). A Foreign Key is a field that links one table to another by referring to the primary key of another table (e.g., DeptID in Student links to Department)."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What is a relational database?"
                a="A database that stores data in tables (rows and columns) and links them using relationships."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What does SQL stand for and what is it used for?"
                a="SQL stands for Structured Query Language. It is used to interact with databases. SQL commands help create, read, update, and delete data."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 14. Coming up next
    {
      id: "next-topic",
      title: "Next up: 4.2b Connecting Python to a Database",
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
