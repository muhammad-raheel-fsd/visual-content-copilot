/**
 * Class 10 CS · Chapter 1 · Topic 1.8 · Types of Operating Systems
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, DO-YOU-KNOW box, and key-point sentence is copied
 * EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.8-types-of-os.md`.
 * Real-world extensions are labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 13 slides. Hand-drawn 4-quadrants diagram on slide 7. LAST topic of Chapter 1,
 * so the closing slide celebrates chapter completion and previews revision.
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

// ── Hero visual: 2x2 grid of device icons ─────────────────────────────

const HeroDeviceGrid: React.FC = () => {
  const items = [
    { icon: "mdi:airplane", label: "Air traffic control", color: "var(--warn)", sub: "REAL-TIME" },
    { icon: "mdi:microwave", label: "Microwave", color: "var(--sync)", sub: "EMBEDDED" },
    { icon: "mdi:server-network", label: "School server", color: "var(--task)", sub: "NETWORK" },
    { icon: "mdi:cellphone", label: "Smartphone", color: "var(--microtask)", sub: "MOBILE" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        maxWidth: 500,
      }}
    >
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.12, type: "spring", damping: 16 }}
          style={{
            padding: "18px 22px",
            backgroundColor: "var(--panel)",
            border: `1.5px solid ${it.color}`,
            borderRadius: 14,
            boxShadow: `0 0 24px ${it.color}44`,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Icon icon={it.icon} width={44} height={44} color={it.color} />
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, color: it.color, fontWeight: 800 }}>{it.sub}</div>
            <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 700, marginTop: 2 }}>
              {it.label}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── OS type card ────────────────────────────────────────────────────────

const OsTypeCard: React.FC<{
  code: string;
  title: string;
  color: string;
  definition: string;
  keyFeature: string;
  usedIn: string;
  icon: string;
  devices: { icon: string; label: string }[];
}> = ({ code, title, color, definition, keyFeature, usedIn, icon, devices }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: 24,
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 0 32px ${color}33`,
      height: "100%",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 14px",
          backgroundColor: color,
          color: "#0a0e14",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {code}
      </div>
      <Icon icon={icon} width={44} height={44} color={color} />
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{title}</div>
    </div>
    <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.55 }}>{definition}</div>
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: `${color}15`,
        border: `1px solid ${color}55`,
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 2, color, fontWeight: 800, marginBottom: 4 }}>
        KEY FEATURE
      </div>
      <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55 }}>{keyFeature}</div>
    </div>
    <div>
      <div style={{ fontSize: 11, letterSpacing: 2, color: "var(--muted)", fontWeight: 800, marginBottom: 8 }}>
        USED IN
      </div>
      <div style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.55, marginBottom: 10 }}>{usedIn}</div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {devices.map((d) => (
          <div
            key={d.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid var(--panel-border)",
              borderRadius: 999,
            }}
          >
            <Icon icon={d.icon} width={18} height={18} color={color} />
            <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── comparison table row ────────────────────────────────────────────────

const CompareRow: React.FC<{
  label: string;
  rtos: string;
  embedded: string;
  network: string;
  mobile: string;
}> = ({ label, rtos, embedded, network, mobile }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "140px 1fr 1fr 1fr 1fr",
      gap: 10,
      alignItems: "center",
      padding: "10px 14px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 8,
    }}
  >
    <div style={{ fontSize: 12, letterSpacing: 1.5, color: "var(--muted)", fontWeight: 800 }}>
      {label}
    </div>
    <div style={{ fontSize: 13, color: "var(--warn)", fontFamily: "Roboto Mono, monospace" }}>{rtos}</div>
    <div style={{ fontSize: 13, color: "var(--sync)", fontFamily: "Roboto Mono, monospace" }}>{embedded}</div>
    <div style={{ fontSize: 13, color: "var(--task)", fontFamily: "Roboto Mono, monospace" }}>{network}</div>
    <div style={{ fontSize: 13, color: "var(--microtask)", fontFamily: "Roboto Mono, monospace" }}>{mobile}</div>
  </div>
);

// ── DO YOU KNOW callout ─────────────────────────────────────────────────

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
      <div style={{ fontSize: 14, letterSpacing: 3, color: "var(--accent)", fontWeight: 800, marginBottom: 8 }}>
        DO YOU KNOW?
      </div>
      <div style={{ fontSize: 22, lineHeight: 1.55, color: "var(--text)" }}>{children}</div>
    </div>
  </div>
);

// ── BEYOND THE BOOK card ────────────────────────────────────────────────

const RealOsCard: React.FC<{
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
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxShadow: `0 0 22px ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={40} height={40} />
    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{title}</div>
    <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color, fontWeight: 700 }}>
      {subtitle}
    </div>
    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{body}</div>
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

// ── Chapter Complete Hero ──────────────────────────────────────────────

const ChapterCompleteHero: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", damping: 18 }}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      padding: 40,
      backgroundColor: "var(--panel)",
      border: "2px solid var(--sync)",
      borderRadius: 20,
      boxShadow: "0 0 70px rgba(63, 185, 80, 0.35)",
    }}
  >
    <motion.div
      animate={{ rotate: [0, -8, 8, 0] }}
      transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        backgroundColor: "var(--sync)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(63, 185, 80, 0.6)",
      }}
    >
      <Icon icon="mdi:trophy-outline" width={56} height={56} color="#0a0e14" />
    </motion.div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--sync)",
          color: "#0a0e14",
          borderRadius: 999,
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        Ch 1 DONE
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>
        Chapter 1 complete
      </div>
    </div>
    <div style={{ fontSize: 19, color: "var(--muted)", textAlign: "center", maxWidth: 780, lineHeight: 1.55 }}>
      You just crossed <b style={{ color: "var(--sync)" }}>8 topics</b> and 100+ pages worth of ideas: <b style={hlBlue}>OS basics</b>, <b style={hlBlue}>architecture</b>, <b style={hlBlue}>processes</b>, <b style={hlBlue}>memory</b>, <b style={hlBlue}>threads</b>, <b style={hlBlue}>system calls</b>, <b style={hlBlue}>file system</b>, and <b style={hlBlue}>types of OS</b>.
    </div>
    <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:file-check-outline", label: "Revision deck" },
        { icon: "mdi:checkbox-marked-outline", label: "Mixed MCQ bank" },
        { icon: "mdi:clipboard-text-outline", label: "Mock test" },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            backgroundColor: "rgba(63, 185, 80, 0.12)",
            border: "1px solid rgba(63, 185, 80, 0.45)",
            borderRadius: 999,
          }}
        >
          <Icon icon={c.icon} width={22} height={22} color="var(--sync)" />
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--sync)" }}>{c.label}</div>
        </div>
      ))}
    </div>
    <div style={{ fontSize: 15, color: "var(--muted)", textAlign: "center", maxWidth: 620, marginTop: 8 }}>
      Coming next: revision session + mock exam paper based on the whole chapter.
    </div>
  </motion.div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1T18TypesOfOsDeck: Deck = {
  title: "Types of Operating Systems",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.8 · Types of Operating Systems",
  topicCode: "1.8",
  topicTitle: "Types of Operating Systems",
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
              1.8 <span style={{ color: ACCENT }}>Types</span> of Operating Systems
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroDeviceGrid />
              </div>
              Not every OS is a desktop OS. Four flavours, one core idea.
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Intro (verbatim)
    {
      id: "intro",
      title: "Why so many types?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.8 Types of Operating Systems"
          subtitle="An OS on a microwave is very different from one on a smartphone. Same job, different constraints."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              Operating systems are designed according to the <b style={hlBlue}>needs of the device</b> and the <b style={hlBlue}>work it performs</b>. Each type <b>serves a different purpose</b> and is <b>optimized for specific tasks</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:shape-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                FOUR TYPES YOU WILL MEET IN THIS TOPIC
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
              {[
                { icon: "mdi:timer-outline", label: "Real-Time OS", color: "var(--warn)" },
                { icon: "mdi:chip", label: "Embedded OS", color: "var(--sync)" },
                { icon: "mdi:server-network-outline", label: "Network OS", color: "var(--task)" },
                { icon: "mdi:cellphone", label: "Mobile OS", color: "var(--microtask)" },
              ].map((t) => (
                <StaggerItem key={t.label}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 8,
                      padding: 20,
                      backgroundColor: "var(--panel)",
                      border: `1.5px solid ${t.color}`,
                      borderRadius: 12,
                      boxShadow: `0 0 20px ${t.color}22`,
                    }}
                  >
                    <Icon icon={t.icon} width={44} height={44} color={t.color} />
                    <div style={{ fontSize: 16, fontWeight: 800, color: t.color, textAlign: "center" }}>
                      {t.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Real-Time OS (verbatim)
    {
      id: "rtos",
      title: "Real-Time OS (RTOS)",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Real-Time Operating System (RTOS)" subtitle="When even a tiny delay is not acceptable." accent="var(--warn)">
          <OsTypeCard
            code="1"
            title="Real-Time OS"
            color="var(--warn)"
            icon="mdi:timer-outline"
            definition="A Real-Time Operating System is designed to process data and respond within a strict time limit, known as a deadline. It is used where even a tiny delay can cause system failure or serious consequences."
            keyFeature="Processes tasks immediately as they arrive, without long waiting times."
            usedIn="Critical systems such as air traffic control, heart-monitoring devices, or industrial robots."
            devices={[
              { icon: "mdi:airplane", label: "Air traffic control" },
              { icon: "mdi:heart-pulse", label: "Heart monitor" },
              { icon: "mdi:robot-industrial-outline", label: "Industrial robot" },
            ]}
          />
        </SlideLayout>
      ),
    },

    // 4. Embedded OS (verbatim)
    {
      id: "embedded",
      title: "Embedded OS (EOS)",
      render: (
        <SlideLayout title="Embedded Operating System (EOS)" subtitle="One device, one job. Tiny footprint, permanent home." accent="var(--sync)">
          <OsTypeCard
            code="2"
            title="Embedded OS"
            color="var(--sync)"
            icon="mdi:chip"
            definition="An Embedded OS is a small and highly efficient operating system built into a specific device to control only the functions it needs. It is not meant for general-purpose computing but is optimized for one task or a small set of tasks."
            keyFeature="Uses very little memory and power, and is often stored permanently inside the device."
            usedIn="Home appliances (microwaves, washing machines), printers, smart TVs, and ATMs."
            devices={[
              { icon: "mdi:microwave", label: "Microwave" },
              { icon: "mdi:washing-machine", label: "Washing machine" },
              { icon: "mdi:printer", label: "Printer" },
              { icon: "mdi:television", label: "Smart TV" },
              { icon: "mdi:atm", label: "ATM" },
            ]}
          />
        </SlideLayout>
      ),
    },

    // 5. Network OS (verbatim)
    {
      id: "network",
      title: "Network OS (NOS)",
      render: (
        <SlideLayout title="Network Operating System (NOS)" subtitle="Many computers, one shared brain. Files and printers travel between them." accent="var(--task)">
          <OsTypeCard
            code="3"
            title="Network OS"
            color="var(--task)"
            icon="mdi:server-network-outline"
            definition="A Network OS manages and supports multiple computers connected through a network. It enables the sharing of resources like files, printers, and internet connections among users like windows multipoint servers."
            keyFeature="Focuses on communication and coordination between computers."
            usedIn="Offices, schools, and data centers."
            devices={[
              { icon: "mdi:office-building-outline", label: "Offices" },
              { icon: "mdi:school-outline", label: "Schools" },
              { icon: "mdi:server", label: "Data centers" },
            ]}
          />
        </SlideLayout>
      ),
    },

    // 6. Mobile OS (verbatim)
    {
      id: "mobile",
      title: "Mobile OS",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout title="Mobile Operating System" subtitle="Touch first. Battery-aware. Millions of apps in your pocket." accent="var(--microtask)">
          <OsTypeCard
            code="4"
            title="Mobile OS"
            color="var(--microtask)"
            icon="mdi:cellphone"
            definition="A Mobile OS is designed for smartphones, tablets, and other handheld devices. It is optimized for touch-screen use, battery saving, and mobile apps."
            keyFeature="Supports wireless connectivity, cameras, sensors, and app stores."
            usedIn="Smartphones, tablets, smartwatches."
            devices={[
              { icon: "mdi:cellphone", label: "Smartphones" },
              { icon: "mdi:tablet", label: "Tablets" },
              { icon: "mdi:watch", label: "Smartwatches" },
            ]}
          />
        </SlideLayout>
      ),
    },

    // 7. Hand-drawn 4-quadrant diagram
    {
      id: "diagram-hand-drawn",
      title: "Four types · hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Four Types of Operating Systems, hand-drawn"
          subtitle="One kernel idea. Four very different flavours."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.8-types-of-os.svg"
              alt="Hand-drawn 4-quadrant diagram of OS types"
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

    // 8. Comparison table (all 4 side by side)
    {
      id: "compare",
      title: "All four side by side",
      render: (
        <SlideLayout title="The four types compared" subtitle="Same axes, four columns. Spot the trade-offs at a glance." accent={ACCENT}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 1fr 1fr 1fr",
                gap: 10,
                padding: "10px 14px",
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 800,
                color: "var(--muted)",
                borderBottom: "2px solid var(--panel-border)",
              }}
            >
              <div>PROPERTY</div>
              <div style={{ color: "var(--warn)" }}>REAL-TIME</div>
              <div style={{ color: "var(--sync)" }}>EMBEDDED</div>
              <div style={{ color: "var(--task)" }}>NETWORK</div>
              <div style={{ color: "var(--microtask)" }}>MOBILE</div>
            </div>
            <Stagger style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <StaggerItem>
                <CompareRow
                  label="PURPOSE"
                  rtos="Meet strict deadlines"
                  embedded="Control one specific device"
                  network="Coordinate many computers"
                  mobile="Touch-first + apps"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="KEY FEATURE"
                  rtos="Zero waiting"
                  embedded="Tiny memory + power"
                  network="Communication"
                  mobile="Wireless + apps + sensors"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="TYPICAL DEVICE"
                  rtos="Air traffic control"
                  embedded="Microwave, ATM"
                  network="School lab server"
                  mobile="Smartphone"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="RISK OF DELAY"
                  rtos="System failure / serious harm"
                  embedded="Device stops working"
                  network="Users cannot share files"
                  mobile="App feels laggy"
                />
              </StaggerItem>
              <StaggerItem>
                <CompareRow
                  label="OPTIMIZED FOR"
                  rtos="Timing precision"
                  embedded="One task, low resources"
                  network="Sharing + coordination"
                  mobile="Touch, battery, apps"
                />
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 9. DO YOU KNOW: Symbian → Android/iOS
    {
      id: "do-you-know",
      title: "DO YOU KNOW · Mobile OS then and now",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout title="From Symbian to Android + iOS" accent={ACCENT}>
          <DoYouKnow>
            The very first mobile operating systems, like <b style={{ color: "var(--accent)" }}>Symbian</b> (used in early Nokia phones), could only run a few small apps. Today's mobile OS platforms like <b style={{ color: "var(--accent)" }}>Android</b> and <b style={{ color: "var(--accent)" }}>iOS</b> can handle <b>millions of apps</b>, <b>3D games</b>, and even <b>professional video editing tools</b>.
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--sync)",
                  borderRadius: 12,
                }}
              >
                <Icon icon="mdi:nokia" width={30} height={30} color="var(--sync)" />
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--sync)", fontWeight: 800 }}>SYMBIAN</div>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 800 }}>a few small apps</div>
                </div>
              </div>
              <Icon icon="mdi:arrow-right-thick" width={30} height={30} color="var(--muted)" />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--microtask)",
                  borderRadius: 12,
                }}
              >
                <Icon icon="logos:android-icon" width={26} height={26} />
                <Icon icon="logos:apple-app-store" width={26} height={26} />
                <div>
                  <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800 }}>ANDROID + iOS</div>
                  <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 800 }}>millions of apps, 3D games, pro video</div>
                </div>
              </div>
            </div>
          </DoYouKnow>
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK: real-world OS in each type
    {
      id: "beyond-book",
      title: "Real operating systems you can name",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="Real operating systems in each family" accent={ACCENT}>
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book gives you the categories. Here are the actual names shipping today.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <StaggerItem style={{ height: "100%" }}>
              <RealOsCard
                icon="mdi:timer-outline"
                title="VxWorks · FreeRTOS · QNX"
                subtitle="Real-time"
                body="VxWorks runs NASA's Mars rovers. FreeRTOS powers Amazon IoT devices. QNX is inside your car's dashboard."
                color="var(--warn)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <RealOsCard
                icon="mdi:chip"
                title="Linux (custom) · Windows IoT"
                subtitle="Embedded"
                body="Most smart TVs run stripped-down Linux. Windows IoT Core runs on Raspberry Pi and factory kiosks."
                color="var(--sync)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <RealOsCard
                icon="mdi:server-network"
                title="Windows Server · Ubuntu Server"
                subtitle="Network"
                body="Windows Server runs office file + print servers. Ubuntu / Debian Linux runs the majority of public web servers."
                color="var(--task)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <RealOsCard
                icon="mdi:cellphone"
                title="Android · iOS · HarmonyOS"
                subtitle="Mobile"
                body="Android runs on billions of phones. iOS on iPhones + iPads. HarmonyOS from Huawei is the new challenger."
                color="var(--microtask)"
              />
            </StaggerItem>
          </Stagger>
          <div
            style={{
              marginTop: 16,
              padding: "12px 16px",
              backgroundColor: "rgba(255, 179, 71, 0.08)",
              border: "1px solid rgba(255, 179, 71, 0.4)",
              borderRadius: 10,
              fontSize: 14,
              color: "var(--muted)",
              lineHeight: 1.55,
            }}
          >
            <b style={{ color: "var(--microtask)" }}>Note:</b> Android is built on top of the Linux kernel. So a phone OS and a server OS can share the same core, just with very different top layers.
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
        <SlideLayout title="Important Concepts from 1.8" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:shape-outline"
                term="Why different types"
                def="Operating systems are designed according to the needs of the device and the work it performs. Each type serves a different purpose and is optimized for specific tasks."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:timer-outline"
                term="Real-Time OS (RTOS)"
                def="Designed to process data and respond within a strict time limit, known as a deadline. Processes tasks immediately as they arrive, without long waiting times. Used in air traffic control, heart-monitoring devices, industrial robots."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:chip"
                term="Embedded OS (EOS)"
                def="A small and highly efficient operating system built into a specific device to control only the functions it needs. Uses very little memory and power. Used in microwaves, washing machines, printers, smart TVs, ATMs."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:server-network-outline"
                term="Network OS (NOS)"
                def="Manages and supports multiple computers connected through a network. Focuses on communication and coordination between computers. Used in offices, schools, data centers."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cellphone"
                term="Mobile OS"
                def="Designed for smartphones, tablets, and other handheld devices. Optimized for touch-screen use, battery saving, and mobile apps. Supports wireless connectivity, cameras, sensors, and app stores."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:history"
                term="Mobile OS history"
                def="Early mobile OS like Symbian could only run a few small apps. Today's Android and iOS can handle millions of apps, 3D games, and even professional video editing tools."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. Definitions and Important Questions
    {
      id: "questions",
      title: "Definitions and Important Questions",
      render: (
        <SlideLayout title="Definitions and Important Questions" accent="var(--microtask)">
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StaggerItem>
              <QARow
                q="Define Real-Time Operating System (RTOS)."
                a="A Real-Time Operating System is designed to process data and respond within a strict time limit, known as a deadline. It is used where even a tiny delay can cause system failure or serious consequences."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define Embedded Operating System (EOS)."
                a="An Embedded OS is a small and highly efficient operating system built into a specific device to control only the functions it needs. It is not meant for general-purpose computing but is optimized for one task or a small set of tasks."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define Network Operating System (NOS)."
                a="A Network OS manages and supports multiple computers connected through a network. It enables the sharing of resources like files, printers, and internet connections among users like windows multipoint servers."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define Mobile Operating System."
                a="A Mobile OS is designed for smartphones, tablets, and other handheld devices. It is optimized for touch-screen use, battery saving, and mobile apps."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Give the book's example of a Network OS in action."
                a="In a school computer lab, students use different computers, but all can save files to the same server and print from the same printer, thanks to the Network OS."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Chapter 1 complete + revision teaser (final slide)
    {
      id: "chapter-complete",
      title: "Chapter 1 complete",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout title="Chapter 1 complete" accent="var(--sync)">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <ChapterCompleteHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
