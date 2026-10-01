/**
 * Class 12 CS · Chapter 4 · Revision Deck
 *
 * THEME: class-12 (Meridian · deep plum + muted gold).
 *
 * Follows class-10 revision pattern: hero → mind-map → 7 per-sub-topic recap
 * cards → exam-ready checklist → Book Summary (page 57 verbatim) → Board
 * Exercise overview + curveball callout → Practice Pyramid.
 *
 * Sources:
 * - curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/summary.md (page 57 verbatim)
 * - curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/board-exercise.md (pages 58-59 verbatim)
 */
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import type { Deck } from "../SlideDeck";
import { Card, HeroSlide, SlideLayout } from "../components/SlideLayout";

const ACCENT = "var(--accent)";

// ── style tokens ─────────────────────────────────────────────────────────

const hlGold: CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const hlTeal: CSSProperties = { color: "var(--sync)", fontWeight: 700 };
const hlViolet: CSSProperties = { color: "var(--microtask)", fontWeight: 700 };
const hlPink: CSSProperties = { color: "var(--task)", fontWeight: 700 };

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
      show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
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

// ── Recap card for one sub-topic ────────────────────────────────────────

const SubTopicRecap: React.FC<{
  code: string;
  title: string;
  color: string;
  bullets: string[];
  keyword: string;
}> = ({ code, title, color, bullets, keyword }) => (
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
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          padding: "4px 10px",
          backgroundColor: color,
          color: "#0d0a1c",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {code}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{title}</div>
    </div>
    <div
      style={{
        fontSize: 12,
        letterSpacing: 2,
        color,
        fontWeight: 800,
      }}
    >
      KEY: {keyword}
    </div>
    <ul
      style={{
        margin: 0,
        paddingLeft: 18,
        fontSize: 13,
        color: "var(--muted)",
        lineHeight: 1.55,
      }}
    >
      {bullets.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  </div>
);

// ── Summary term card (slide 11) ────────────────────────────────────────

const SummaryTerm: React.FC<{ term: string; def: string }> = ({ term, def }) => (
  <div
    style={{
      padding: "12px 14px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 10,
    }}
  >
    <div
      style={{
        fontSize: 15,
        fontWeight: 800,
        color: "var(--accent)",
        marginBottom: 4,
      }}
    >
      {term}
    </div>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{def}</div>
  </div>
);

// ── Mind-map node ───────────────────────────────────────────────────────

const MindBranch: React.FC<{
  label: string;
  icon: string;
  color: string;
  items: string[];
}> = ({ label, icon, color, items }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: 14,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 12,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon icon={icon} width={22} color={color} />
      <div style={{ fontSize: 14, fontWeight: 800, color }}>{label}</div>
    </div>
    <ul
      style={{
        margin: 0,
        paddingLeft: 18,
        fontSize: 12,
        color: "var(--muted)",
        lineHeight: 1.55,
      }}
    >
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  </div>
);

// ── Curveball callout ───────────────────────────────────────────────────

const Curveball: React.FC<{ q: string; wrong: string; right: string; why: string }> = ({
  q,
  wrong,
  right,
  why,
}) => (
  <div
    style={{
      padding: "16px 20px",
      backgroundColor: "var(--panel)",
      border: "1.5px solid var(--warn)",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon icon="mdi:alert-outline" width={24} color="var(--warn)" />
      <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{q}</div>
    </div>
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon icon="mdi:close-circle" width={20} color="var(--task)" />
        <div style={{ fontSize: 13, color: "var(--task)", fontFamily: "Roboto Mono, monospace" }}>
          {wrong}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon icon="mdi:check-circle" width={20} color="var(--sync)" />
        <div style={{ fontSize: 13, color: "var(--sync)", fontFamily: "Roboto Mono, monospace" }}>
          {right}
        </div>
      </div>
    </div>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{why}</div>
  </div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class12Ch4RevisionDeck: Deck = {
  title: "Chapter 4 · Revision",
  book: "Computer Science 12 (PECTAA)",
  chapter: "Ch 4 · Development of GUI",
  topic: "Revision",
  topicCode: "Ch 4",
  topicTitle: "Chapter 4 Revision",
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
              Chapter 4 <span style={{ color: ACCENT }}>Revision</span>
            </>
          }
          subtitle={
            <>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginBottom: 24,
                }}
              >
                {["4.1a", "4.1b", "4.1c", "4.1d", "4.2a", "4.2b", "4.2c"].map((t) => (
                  <div
                    key={t}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      backgroundColor: "rgba(201, 166, 107, 0.14)",
                      border: "1px solid var(--accent)",
                      color: "var(--accent)",
                      fontFamily: "Roboto Mono, monospace",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
              Everything you need to recall. <b style={hlGold}>7 sub-topics</b>, the book summary, and the board paper's trickiest MCQ.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Chapter mind map
    {
      id: "mind-map",
      title: "Mind map · chapter at a glance",
      render: (
        <SlideLayout
          title="Chapter 4 at a glance"
          subtitle="Two halves. Tkinter (GUI) and Databases + SQL."
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <StaggerItem>
              <div
                style={{
                  padding: 16,
                  backgroundColor: "rgba(201, 166, 107, 0.08)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--accent)",
                    textAlign: "center",
                  }}
                >
                  4.1 · GUI with Tkinter
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <MindBranch
                    label="4.1a Intro"
                    icon="mdi:application-outline"
                    color="var(--accent)"
                    items={["GUI definition", "Tkinter toolkit", "Simple GUI code"]}
                  />
                  <MindBranch
                    label="4.1b Widgets+Frames"
                    icon="mdi:view-grid-outline"
                    color="var(--sync)"
                    items={["Label/Button/Entry", "Menu/Listbox", "Frames + pack"]}
                  />
                  <MindBranch
                    label="4.1c Layouts"
                    icon="mdi:view-dashboard-outline"
                    color="var(--microtask)"
                    items={["pack()", "grid()", "place()", "Figure 4.2"]}
                  />
                  <MindBranch
                    label="4.1d Events"
                    icon="mdi:cursor-default-click"
                    color="var(--task)"
                    items={["Event-driven", "command= bridge", "Login form"]}
                  />
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div
                style={{
                  padding: 16,
                  backgroundColor: "rgba(103, 216, 196, 0.08)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "var(--sync)",
                    textAlign: "center",
                  }}
                >
                  4.2 · Databases + SQL
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <MindBranch
                    label="4.2a Concepts"
                    icon="mdi:database-outline"
                    color="var(--accent)"
                    items={[
                      "Entity / Attribute",
                      "Relationship / Identifier",
                      "PK / FK",
                      "Figure 4.3",
                    ]}
                  />
                  <MindBranch
                    label="4.2b Python+DB"
                    icon="mdi:language-python"
                    color="var(--sync)"
                    items={["sqlite3", "connect/cursor", "commit/close"]}
                  />
                  <div style={{ gridColumn: "1 / span 2" }}>
                    <MindBranch
                      label="4.2c CRUD"
                      icon="mdi:chart-bubble"
                      color="var(--microtask)"
                      items={[
                        "Create = INSERT",
                        "Read = SELECT",
                        "Update = UPDATE",
                        "Delete = DELETE (safely!)",
                        "Figure 4.4",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 3. 4.1a recap
    {
      id: "recap-4-1a",
      title: "Recap · 4.1a Tkinter Introduction",
      render: (
        <SlideLayout
          title="Recap · 4.1a Tkinter Introduction"
          subtitle='GUI definition, Tkinter toolkit, and the Simple GUI example.'
          accent="var(--accent)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SubTopicRecap
              code="4.1a"
              title="Core facts"
              color="var(--accent)"
              keyword="GUI + Tkinter"
              bullets={[
                'GUI = visual interface using windows, buttons, menus, text boxes',
                'Tkinter = Python standard GUI toolkit, pre-installed, event-driven',
                'Suitable for small to medium-sized GUI apps',
              ]}
            />
            <SubTopicRecap
              code="4.1a"
              title="Code to remember"
              color="var(--sync)"
              keyword="Tk() + mainloop()"
              bullets={[
                'window = tk.Tk() creates the main window',
                'Label displays text, Entry takes input, Button performs action',
                'command=on_click links a click to a function',
                'window.mainloop() runs the GUI event loop',
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 4. 4.1b recap
    {
      id: "recap-4-1b",
      title: "Recap · 4.1b Widgets + Frames",
      render: (
        <SlideLayout
          title="Recap · 4.1b Widgets + Frames"
          subtitle='Core widgets + Frame as the container that groups them.'
          accent="var(--sync)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SubTopicRecap
              code="4.1b"
              title="5 common widgets"
              color="var(--accent)"
              keyword="Label · Button · Entry · Menu · Listbox"
              bullets={[
                'Label → display text or messages',
                'Button → perform an action on click',
                'Entry → text input (name, password)',
                'Menu → list of options at the top of the window',
                'Listbox → list of items for selection',
              ]}
            />
            <SubTopicRecap
              code="4.1b"
              title="Frames + layout"
              color="var(--sync)"
              keyword="Frame = container"
              bullets={[
                'Frame divides window into smaller parts',
                'bg="lightblue", height=100, pack(fill="x", expand=True)',
                'top_frame + bottom_frame → organise layout',
                'CLASS ACTIVITY: divide window into two frames + add widgets',
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 5. 4.1c recap
    {
      id: "recap-4-1c",
      title: "Recap · 4.1c Layout Management",
      render: (
        <SlideLayout
          title="Recap · 4.1c Layout Management (pack, grid, place)"
          subtitle='Three ways to arrange widgets. Pick the right one for the job.'
          accent="var(--microtask)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <SubTopicRecap
              code="pack()"
              title="Simple stack"
              color="var(--accent)"
              keyword="vertical / horizontal"
              bullets={[
                "Simple vertical or horizontal order",
                "Easy to use, small apps",
                'Options: pady, fill="x"',
              ]}
            />
            <SubTopicRecap
              code="grid()"
              title="Table"
              color="var(--sync)"
              keyword="rows + columns"
              bullets={[
                "Rows and columns like a table",
                "Forms, structured layouts",
                'columnspan=2, grid_columnconfigure',
              ]}
            />
            <SubTopicRecap
              code="place()"
              title="Precise"
              color="var(--microtask)"
              keyword="x, y coordinates"
              bullets={[
                "Exact locations using pixels",
                "More control, careful adjustment",
                "x=30, y=40 from top-left",
              ]}
            />
          </div>
          <div
            style={{
              marginTop: 18,
              padding: "12px 18px",
              backgroundColor: "rgba(255, 141, 161, 0.08)",
              border: "1px dashed var(--task)",
              borderRadius: 10,
              fontSize: 15,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            <b style={hlPink}>TIDBIT (verbatim):</b> Proper layout management helps make applications look neat and work well on different screen sizes.
          </div>
        </SlideLayout>
      ),
    },

    // 6. 4.1d recap
    {
      id: "recap-4-1d",
      title: "Recap · 4.1d Event Handling + Login Form",
      render: (
        <SlideLayout
          title="Recap · 4.1d Event Handling + Login Form"
          subtitle='Idle until an event. command= links widget to function.'
          accent="var(--task)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SubTopicRecap
              code="4.1d"
              title="Event-driven programming"
              color="var(--accent)"
              keyword="idle → event → function"
              bullets={[
                "Program remains idle until an event occurs",
                "Each event is linked to a specific function",
                "Function runs only when event happens",
                "Saves system resources",
              ]}
            />
            <SubTopicRecap
              code="4.1d"
              title="Login form must-knows"
              color="var(--sync)"
              keyword="command= + .get() + messagebox"
              bullets={[
                'tk.Button(..., command=check_login) · NO parentheses',
                'entry_pass = tk.Entry(window, show="*") hides password',
                'username = entry_user.get() reads input',
                'messagebox.showinfo / showerror for popups',
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 7. 4.2a recap
    {
      id: "recap-4-2a",
      title: "Recap · 4.2a Database Concepts + SQL",
      render: (
        <SlideLayout
          title="Recap · 4.2a Database Concepts + SQL"
          subtitle='Entity, Attribute, Relationship, Identifier. Primary Key, Foreign Key.'
          accent="var(--accent)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SubTopicRecap
              code="4.2a"
              title="Data modelling"
              color="var(--accent)"
              keyword="E·A·R·I"
              bullets={[
                "Entity → real-world object (Student, Teacher)",
                "Attribute → property (Name, Roll Number)",
                "Relationship → how entities connect (Student enrols in Course)",
                "Identifier → unique attribute (Roll Number)",
              ]}
            />
            <SubTopicRecap
              code="4.2a"
              title="Relational database"
              color="var(--sync)"
              keyword="Tables + keys"
              bullets={[
                "Table = rows (records) + columns (fields)",
                "Primary Key uniquely identifies each record",
                "Foreign Key links one table to another's PK",
                "Figure 4.3: Student.DeptID → Department.DeptID",
                "SQL = Structured Query Language (CRUD)",
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 8. 4.2b recap
    {
      id: "recap-4-2b",
      title: "Recap · 4.2b Python + DB",
      render: (
        <SlideLayout
          title="Recap · 4.2b Connecting Python to a Database"
          subtitle='sqlite3 built-in. Five-step pattern: connect, cursor, execute, fetch, close.'
          accent="var(--sync)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <SubTopicRecap
              code="4.2b"
              title="sqlite3 vs MySQL"
              color="var(--accent)"
              keyword="small file vs server"
              bullets={[
                "sqlite3 built into Python, single file (school.db)",
                "MySQL for larger and more complex systems, needs server + credentials",
                'sqlite3.connect("school.db") creates file if missing',
              ]}
            />
            <SubTopicRecap
              code="4.2b"
              title="5-step pattern"
              color="var(--sync)"
              keyword="connect→cursor→execute→fetch→close"
              bullets={[
                "connection = sqlite3.connect(...)",
                "cursor = connection.cursor()",
                'cursor.execute("SELECT * FROM students")',
                "records = cursor.fetchall() + loop + print",
                "connection.commit() for writes, then close()",
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 9. 4.2c recap
    {
      id: "recap-4-2c",
      title: "Recap · 4.2c CRUD",
      render: (
        <SlideLayout
          title="Recap · 4.2c CRUD Operations"
          subtitle='Create, Read, Update, Delete. One SQL command each.'
          accent="var(--microtask)"
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <SubTopicRecap
              code="C"
              title="Create (INSERT)"
              color="var(--accent)"
              keyword="add new row"
              bullets={["INSERT INTO students (ID, Name, Age) VALUES (1, 'John', 20);", "needs commit()"]}
            />
            <SubTopicRecap
              code="R"
              title="Read (SELECT)"
              color="var(--sync)"
              keyword="retrieve rows"
              bullets={["SELECT * FROM students;", "fetchall() returns list of tuples", "NO commit needed"]}
            />
            <SubTopicRecap
              code="U"
              title="Update (UPDATE)"
              color="var(--microtask)"
              keyword="modify rows"
              bullets={["UPDATE students SET Age = 21 WHERE ID = 1;", "needs commit()"]}
            />
            <SubTopicRecap
              code="D"
              title="Delete (DELETE)"
              color="var(--task)"
              keyword="remove rows SAFELY"
              bullets={[
                "DELETE FROM students WHERE ID = 1;",
                "ALWAYS use WHERE",
                "needs commit()",
              ]}
            />
          </div>
        </SlideLayout>
      ),
    },

    // 10. Exam-ready checklist
    {
      id: "exam-checklist",
      title: "Exam-ready checklist",
      render: (
        <SlideLayout
          title="Exam-ready checklist"
          subtitle='Tick these before you walk into the exam hall.'
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { c: "var(--accent)", t: "Can define: GUI, Tkinter, Window, Frame, Widget" },
              { c: "var(--sync)", t: "Can name 5 common widgets (Label, Button, Entry, Menu, Listbox)" },
              { c: "var(--microtask)", t: "Know pack / grid / place: when to use each" },
              { c: "var(--task)", t: "Can explain event-driven programming + command= bridge" },
              { c: "var(--accent)", t: "Can walk through the Login Form code line by line" },
              { c: "var(--sync)", t: "Can define Entity, Attribute, Relationship, Identifier" },
              { c: "var(--microtask)", t: "Can draw Figure 4.3 (Student + Department with PK/FK)" },
              { c: "var(--task)", t: "Know the 5-step sqlite3 pattern (connect → close)" },
              { c: "var(--accent)", t: "Can write all 4 CRUD SQL commands from Table 4.1" },
              { c: "var(--sync)", t: "Can walk through the Delete code (verbatim from book)" },
              { c: "var(--microtask)", t: "Know what commit() does and why it's needed" },
              { c: "var(--task)", t: "Memorised the 12 Summary definitions on page 57" },
            ].map((item) => (
              <StaggerItem key={item.t}>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 16px",
                    backgroundColor: "var(--panel)",
                    border: `1px solid ${item.c}`,
                    borderRadius: 10,
                  }}
                >
                  <Icon icon="mdi:checkbox-blank-outline" width={22} color={item.c} />
                  <div style={{ fontSize: 14, color: "var(--text)" }}>{item.t}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. Book Summary (page 57 verbatim)
    {
      id: "book-summary",
      title: "Book Summary · page 57 verbatim",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Book Summary · page 57 (verbatim)"
          subtitle='The 12 definitions on the exam. Memorise the exact wording.'
          accent={ACCENT}
        >
          <Stagger
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {[
              { t: "GUI", d: "Visual way of interacting with a program using windows, buttons, menus, text boxes." },
              { t: "Tkinter", d: "Python's built-in library used to create desktop-based GUIs." },
              { t: "Window", d: "Main screen or container in a GUI application." },
              { t: "Frame", d: "Container to organize and group widgets inside a GUI window." },
              { t: "Widget", d: "GUI element (label, button, entry, menu, listbox) for display or input." },
              { t: "Event-Driven Programming", d: "Program responds to events or actions performed by the user." },
              { t: "Relational Database", d: "Stores data in tables (rows + columns) linked by keys." },
              { t: "SQL", d: "Structured Query Language · create, manage, and manipulate relational data." },
              { t: "Create Operation", d: "Used to add new records to a database." },
              { t: "Read Operation", d: "Used to retrieve and display data from a database." },
              { t: "Update Operation", d: "Used to modify existing records in a database." },
              { t: "Delete Operation", d: "Used to remove records from a database safely." },
            ].map((e) => (
              <StaggerItem key={e.t}>
                <SummaryTerm term={e.t} def={e.d} />
              </StaggerItem>
            ))}
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Board Exercise overview
    {
      id: "board-exercise-overview",
      title: "Board Exercise · pages 58-59",
      render: (
        <SlideLayout
          title="Board EXERCISE · what to expect on paper"
          subtitle='10 MCQs + 10 Short + 8 Long · verbatim shape of the paper.'
          accent={ACCENT}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                color: "var(--accent)",
                icon: "mdi:format-list-numbered",
                title: "MCQs · 10",
                items: [
                  "Short, one-mark questions",
                  "GUI purpose · Tkinter · widgets",
                  "pack/grid/place · layouts",
                  "Event-driven · command= · CRUD",
                ],
              },
              {
                color: "var(--sync)",
                icon: "mdi:format-paragraph",
                title: "Short Qs · 10",
                items: [
                  "2-4 mark questions",
                  "Define, name, how do you",
                  "Pick 4-6 to attempt",
                  "Quote book definitions",
                ],
              },
              {
                color: "var(--microtask)",
                icon: "mdi:format-align-left",
                title: "Long Qs · 8",
                items: [
                  "7-10 mark questions",
                  "Explain, describe, discuss",
                  "Usually choose 2-3",
                  "Walk through code + verbatim",
                ],
              },
            ].map((s) => (
              <div
                key={s.title}
                style={{
                  padding: 20,
                  backgroundColor: "var(--panel)",
                  border: `1.5px solid ${s.color}`,
                  borderRadius: 14,
                  boxShadow: `0 0 24px ${s.color}22`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon icon={s.icon} width={32} color={s.color} />
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.title}</div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
            Verbatim questions saved at <code style={{ color: ACCENT, fontFamily: "Roboto Mono, monospace" }}>source/board-exercise.md</code> · model answers at <code style={{ color: ACCENT, fontFamily: "Roboto Mono, monospace" }}>questions/board-exercise.md</code>.
          </div>
        </SlideLayout>
      ),
    },

    // 13. Curveball callout
    {
      id: "curveballs",
      title: "Curveballs · tricky MCQs to watch",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="Exam curveballs · do not get caught"
          subtitle='The three MCQs most likely to trip students on this paper.'
          accent="var(--warn)"
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <StaggerItem>
              <Curveball
                q="MCQ 9 · The Tkinter option that connects a button click to a function is:"
                wrong="bind()  or  command()"
                right="command= (no parentheses)"
                why='The correct option is literally spelled "command= (no parentheses)". Reading past the parenthetical note is the trap. In code: tk.Button(..., command=check_login) · check_login WITHOUT () · otherwise the function fires once at creation time instead of on click.'
              />
            </StaggerItem>
            <StaggerItem>
              <Curveball
                q="MCQ 5 · The methods used to organize widgets in Tkinter include:"
                wrong="pack()  or  grid()"
                right="All of the above (pack, grid, place)"
                why="If you only memorise pack() + grid() and skip place(), you pick a single-method option and lose the mark. The book names all three."
              />
            </StaggerItem>
            <StaggerItem>
              <Curveball
                q="MCQ 4 vs MCQ 8 · pack() vs place()"
                wrong="Mix them up"
                right="pack = vertical/horizontal · place = x,y coordinates"
                why="pack() aligns vertically or horizontally (MCQ 4A). place() positions widgets precisely using coordinates (MCQ 8C). grid() is rows/columns like a table. Three distinct answers."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 14. Practice pyramid
    {
      id: "practice-pyramid",
      title: "Practice pyramid",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout
          title="Practice pyramid · how to revise in order"
          subtitle='Start wide, finish narrow. Each layer takes you closer to the exam.'
          accent={ACCENT}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginTop: 10,
            }}
          >
            {[
              {
                w: "70%",
                color: "var(--accent)",
                icon: "mdi:book-open-outline",
                label: "1. Read the Chapter Summary (page 57)",
                detail: "12 verbatim definitions · memorise the exact wording",
              },
              {
                w: "60%",
                color: "var(--sync)",
                icon: "mdi:format-list-bulleted-type",
                label: "2. Do the Mixed MCQ bank · 30 Qs",
                detail: "questions/mixed-mcqs.md · one hit per sub-topic",
              },
              {
                w: "50%",
                color: "var(--microtask)",
                icon: "mdi:clipboard-text-outline",
                label: "3. Attempt the Board EXERCISE",
                detail: "questions/board-exercise.md · verbatim paper + answer key",
              },
              {
                w: "40%",
                color: "var(--task)",
                icon: "mdi:timer-outline",
                label: "4. Sit the Mock Test · 60 min",
                detail: "questions/mock-test.md · Section A + B + C · 40 marks",
              },
              {
                w: "30%",
                color: "var(--warn)",
                icon: "mdi:alert-circle-outline",
                label: "5. Review curveballs + weak sub-topics",
                detail: "Re-watch the sub-topic deck where you missed questions",
              },
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  width: row.w,
                  padding: "14px 20px",
                  backgroundColor: "var(--panel)",
                  border: `1.5px solid ${row.color}`,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  boxShadow: `0 0 24px ${row.color}22`,
                }}
              >
                <Icon icon={row.icon} width={32} color={row.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    {row.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              backgroundColor: "rgba(201, 166, 107, 0.08)",
              border: "1px dashed var(--accent)",
              borderRadius: 10,
              fontSize: 16,
              color: "var(--text)",
              textAlign: "center",
            }}
          >
            Target: hit all 5 layers in <b style={hlGold}>3 study sessions of 60 minutes</b> each. You will walk into the exam calm.
          </div>
        </SlideLayout>
      ),
    },
  ],
};
