/**
 * Class 10 CS · Chapter 1 · Topic 1.1 · Introduction to Operating System (OS)
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, DO-YOU-KNOW box, and key-point sentence is
 * copied EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.1-intro-to-os.md`. Real-world
 * scenarios and Tid-Bytes are clearly labelled as extensions of the book.
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
  fontSize: 24,
  lineHeight: 1.7,
  color: "var(--text)",
  paddingLeft: 30,
  margin: 0,
};
const hlBlue: CSSProperties = { color: "var(--accent)", fontWeight: 700 };

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

/** Small tag that flags a slide as an author-added extension (not from the book). */
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

const OsLogo: React.FC<{ icon: string; label: string; color: string }> = ({
  icon,
  label,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      padding: "22px 12px",
      borderRadius: 16,
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      boxShadow: `0 0 40px 0 ${color}22`,
    }}
  >
    <Icon icon={icon} width={80} height={80} />
    <div style={{ color, fontSize: 20, fontWeight: 700 }}>{label}</div>
  </div>
);

const DoYouKnow: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      marginTop: 16,
      padding: "18px 22px",
      backgroundColor: "rgba(88, 166, 255, 0.08)",
      border: "1px solid rgba(88, 166, 255, 0.35)",
      borderRadius: 12,
      display: "flex",
      alignItems: "flex-start",
      gap: 18,
    }}
  >
    <Icon icon="mdi:lightbulb-on-outline" width={36} height={36} color="var(--accent)" />
    <div>
      <div
        style={{
          fontSize: 13,
          letterSpacing: 3,
          color: "var(--accent)",
          fontWeight: 800,
          marginBottom: 4,
        }}
      >
        DO YOU KNOW?
      </div>
      <div style={{ fontSize: 18, lineHeight: 1.55, color: "var(--text)" }}>{children}</div>
    </div>
  </div>
);

// ── slide 3 visual: traffic hub ──────────────────────────────────────────

const TrafficHub: React.FC = () => {
  const spokes: Array<{ icon: string; label: string; angle: number; color: string }> = [
    { icon: "mdi:web", label: "Browser", angle: -90, color: "var(--accent)" },
    { icon: "mdi:printer", label: "Printer", angle: -30, color: "var(--sync)" },
    { icon: "mdi:volume-high", label: "Speakers", angle: 30, color: "var(--microtask)" },
    { icon: "mdi:harddisk", label: "Storage", angle: 90, color: "var(--task)" },
    { icon: "mdi:keyboard-outline", label: "Keyboard", angle: 150, color: "var(--api)" },
    { icon: "mdi:monitor", label: "Screen", angle: 210, color: "var(--warn)" },
  ];
  const STAGE = 520;
  const CENTER = STAGE / 2;
  const R = 190;
  const CORE = 150;
  const RING = 420;
  const SPOKE = 84;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: STAGE, height: STAGE }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          style={{
            position: "absolute",
            width: RING,
            height: RING,
            left: CENTER - RING / 2,
            top: CENTER - RING / 2,
            borderRadius: "50%",
            border: "2px dashed rgba(88, 166, 255, 0.35)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: CORE,
            height: CORE,
            left: CENTER - CORE / 2,
            top: CENTER - CORE / 2,
            borderRadius: "50%",
            backgroundColor: "var(--panel)",
            border: "2px solid var(--accent)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: "0 0 60px 10px rgba(88, 166, 255, 0.25)",
          }}
        >
          <Icon icon="mdi:cog-sync-outline" width={60} height={60} color="var(--accent)" />
          <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--accent)", fontWeight: 800 }}>OS</div>
        </div>
        {spokes.map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const cx = CENTER + Math.cos(rad) * R;
          const cy = CENTER + Math.sin(rad) * R;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", damping: 14 }}
              style={{
                position: "absolute",
                width: SPOKE,
                height: SPOKE,
                left: cx - SPOKE / 2,
                top: cy - SPOKE / 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "var(--panel)",
                  border: `1.5px solid ${s.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 0 16px ${s.color}44`,
                }}
              >
                <Icon icon={s.icon} width={28} height={28} color={s.color} />
              </div>
              <div style={{ fontSize: 11, color: s.color, fontWeight: 700, whiteSpace: "nowrap" }}>
                {s.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ── slide 4 visual: translator flow ──────────────────────────────────────

const TranslatorFlow: React.FC = () => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr auto 1fr",
      gap: 20,
      alignItems: "center",
      padding: "16px 0",
    }}
  >
    <FlowNode icon="mdi:keyboard-outline" label="You press A" color="var(--sync)" />
    <FlowArrow />
    <FlowNode
      icon="mdi:cog-sync-outline"
      label="OS translates"
      color="var(--accent)"
      sublabel={<span className="mono">A → 0100 0001</span>}
    />
    <FlowArrow />
    <FlowNode icon="mdi:monitor" label="Screen shows A" color="var(--microtask)" />
  </div>
);

const FlowNode: React.FC<{ icon: string; label: string; color: string; sublabel?: ReactNode }> = ({
  icon,
  label,
  color,
  sublabel,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      padding: "18px 12px",
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${color}33`,
    }}
  >
    <Icon icon={icon} width={56} height={56} color={color} />
    <div style={{ fontSize: 17, fontWeight: 700, color, textAlign: "center" }}>{label}</div>
    {sublabel ? (
      <div style={{ fontSize: 15, color: "var(--muted)", textAlign: "center" }}>{sublabel}</div>
    ) : null}
  </div>
);

const FlowArrow: React.FC = () => (
  <motion.div
    animate={{ x: [0, 6, 0] }}
    transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
    style={{ display: "flex", alignItems: "center", color: "var(--muted)" }}
  >
    <Icon icon="mdi:arrow-right-thick" width={40} height={40} />
  </motion.div>
);

// ── scenario cards (extension slide) ─────────────────────────────────────

const ScenarioCard: React.FC<{
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
      borderRadius: 16,
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      boxShadow: `0 0 40px 0 ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={56} height={56} color={color} />
    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{title}</div>
    <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color, fontWeight: 700 }}>
      {subtitle}
    </div>
    <div style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.6, marginTop: 2 }}>{body}</div>
  </div>
);

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
    <Icon icon={icon} width={32} height={32} color={color} />
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
    <div style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.55 }}>{body}</div>
  </div>
);

// ── local mini-components used above (declared BEFORE the deck) ──────────

const MultiUserItem: React.FC<{
  icon: string;
  color: string;
  text: string;
  bold?: string;
  textAfter?: string;
}> = ({ icon, color, text, bold, textAfter }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "18px 20px",
      backgroundColor: "var(--panel)",
      border: `1px solid var(--panel-border)`,
      borderRadius: 12,
      boxShadow: `0 0 30px 0 ${color}22`,
      height: "100%",
    }}
  >
    <Icon icon={icon} width={36} height={36} color={color} />
    <div style={{ fontSize: 20, color: "var(--text)", lineHeight: 1.55 }}>
      {text}
      {bold ? (
        <>
          {" "}
          <b style={{ color }}>{bold}</b>
        </>
      ) : null}
      {textAfter ?? ""}
    </div>
  </div>
);

const AccountChip: React.FC<{ icon: string; label: string; color: string }> = ({
  icon,
  label,
  color,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      backgroundColor: `${color}18`,
      border: `1.5px solid ${color}`,
      borderRadius: 12,
    }}
  >
    <Icon icon={icon} width={28} height={28} color={color} />
    <div style={{ fontSize: 18, fontWeight: 700, color }}>{label}</div>
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
      <div style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.55 }}>{a}</div>
    </div>
  </div>
);

const NextCard: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 20px",
      backgroundColor: "var(--panel)",
      border: "1px solid var(--panel-border)",
      borderRadius: 12,
    }}
  >
    <Icon icon={icon} width={32} height={32} color="var(--microtask)" />
    <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{title}</div>
  </div>
);

// ── the deck ─────────────────────────────────────────────────────────────

export const class10Ch1IntroToOsDeck: Deck = {
  title: "Introduction to Operating System (OS)",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.1 · Introduction to OS",
  topicCode: "1.1",
  topicTitle: "Introduction to Operating System (OS)",
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
              1.1 Introduction to <span style={{ color: ACCENT }}>Operating System</span>
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 24 }}>
                <Icon icon="logos:microsoft-windows-icon" width={64} height={64} />
                <Icon icon="logos:apple" width={64} height={64} color="var(--text)" />
                <Icon icon="logos:linux-tux" width={64} height={64} />
                <Icon icon="logos:android-icon" width={64} height={64} />
                <Icon icon="logos:apple-app-store" width={64} height={64} />
              </div>
              Chapter 1 · Class 10 Computer Science and Entrepreneurship (PECTAA)
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Definition (verbatim from book, page 2)
    {
      id: "definition",
      title: "What is an OS?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.1 Introduction to Operating System (OS)"
          subtitle="Runs on your phone, laptop, smart TV, ATM, Tesla, even the rover on Mars."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              <b style={{ color: ACCENT }}>Operating System (OS)</b> is a type of system software that manages hardware, runs application software, and provides a user interface like Windows, macOS, Linux, Android, and iOS, along with their basic roles. Here we will go a step further and focus on how the operating system works as the central controller of the computer system, ensuring smooth and secure interaction between the user and the hardware, especially in multi-user environments.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:earth" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                FIVE FAMILIAR OPERATING SYSTEMS YOU HAVE ALREADY USED
              </span>
            </div>
            <Stagger
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 20,
              }}
            >
              <StaggerItem><OsLogo icon="logos:microsoft-windows-icon" label="Windows" color="#00A4EF" /></StaggerItem>
              <StaggerItem><OsLogo icon="logos:apple" label="macOS" color="#c9d1d9" /></StaggerItem>
              <StaggerItem><OsLogo icon="logos:linux-tux" label="Linux" color="#3fb950" /></StaggerItem>
              <StaggerItem><OsLogo icon="logos:android-icon" label="Android" color="#3ddc84" /></StaggerItem>
              <StaggerItem><OsLogo icon="logos:apple-app-store" label="iOS" color="#0d96f6" /></StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. OS as the Central System Controller (verbatim sub-heading + verbatim quote)
    {
      id: "central-controller",
      title: "Operating System (OS) as the Central System Controller",
      render: (
        <SlideLayout
          title="Operating System (OS) as the Central System Controller"
          subtitle="Think of it like a traffic controller: your browser, your music player, your printer, all sharing one road."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  An <b style={hlBlue}>operating system</b> works like a <b style={hlBlue}>traffic controller</b> for the computer. It decides <b style={hlBlue}>which task should be done first</b>, how the computer's <b style={hlBlue}>memory</b> is used, and which <b style={hlBlue}>devices</b> (like a printer or speakers) should be active at a given time. In short, we can say that the OS makes sure the computer works smoothly even when multiple tasks are running at the same time.
                </p>
              </Card>
            }
            right={
              <div style={{ height: "100%", padding: 6 }}>
                <TrafficHub />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 4. Role in User Hardware Interaction (verbatim sub-heading + verbatim quote + example)
    {
      id: "user-hardware-interaction",
      title: "Role in User Hardware Interaction",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Role in User Hardware Interaction"
          subtitle="You speak English or Urdu, hardware speaks 0s and 1s. The OS sits in the middle."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
            <p style={bookQuoteStyle}>
              Computer hardware cannot understand human language directly. The <b style={hlBlue}>operating system acts as a translator</b> between the user and the hardware system.
            </p>
            <div style={{ padding: "16px 20px", backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${ACCENT}`, borderRadius: 6 }}>
              <div style={{ fontSize: 13, letterSpacing: 2, color: ACCENT, fontWeight: 700, marginBottom: 6 }}>
                EXAMPLE
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 22 }}>
                When you click an icon or type something, the OS changes those actions into instructions that the hardware can understand. This allows people to use computers easily without learning how the hardware works.
              </p>
            </div>
            <TranslatorFlow />
          </div>
        </SlideLayout>
      ),
    },

    // 5. DO YOU KNOW (verbatim from book)
    {
      id: "do-you-know-binary",
      title: "DO YOU KNOW? · Binary encoding",
      render: (
        <SlideLayout
          title="Humans and computers speak different languages"
          accent={ACCENT}
        >
          <DoYouKnow>
            Humans speak languages like Urdu or English, whereas computers understand only binary language, or ON and Off switch i.e. 0 and 1.
            <div style={{ marginTop: 14 }}>
              <b>Example:</b> When you press the letter A on a keyboard, the operating system converts it into a special binary code:
            </div>
            <ul style={{ ...bulletStyle, fontSize: 17, marginTop: 10 }}>
              <li>The letter A in binary is <span className="mono" style={{ color: "var(--sync)" }}>(01000001)</span>.</li>
              <li>This code is then sent to the computer screen, which displays A on the screen.</li>
              <li>This process happens so quickly that it feels instant to the user.</li>
            </ul>
          </DoYouKnow>
        </SlideLayout>
      ),
    },

    // 6. Responsibilities in Multi-User Environments Tasks (verbatim heading + 4 verbatim bullets)
    {
      id: "multi-user",
      title: "Responsibilities in Multi-User Environments Tasks",
      render: (
        <SlideLayout
          title="Responsibilities in Multi-User Environments Tasks"
          subtitle="One computer. Many users. Ali's homework never shows up on Ahmed's screen."
          accent={ACCENT}
        >
          <p style={{ ...bookQuoteStyle, marginBottom: 20 }}>
            In places like schools, offices, or online systems, many people may use the same computer. The operating system ensures:
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <StaggerItem>
              <MultiUserItem
                icon="mdi:account-multiple-outline"
                color="var(--sync)"
                bold="user accounts"
                text="The creation and management of separate"
                textAfter="."
              />
            </StaggerItem>
            <StaggerItem>
              <MultiUserItem
                icon="mdi:lock-outline"
                color="var(--microtask)"
                bold="private"
                text="Keeps each user's files and information"
                textAfter="."
              />
            </StaggerItem>
            <StaggerItem>
              <MultiUserItem
                icon="mdi:scale-balance"
                color="var(--task)"
                text="Shares the computer's resources fairly so that no one slows down the systems functionalities."
              />
            </StaggerItem>
            <StaggerItem>
              <MultiUserItem
                icon="mdi:shield-check-outline"
                color="var(--api)"
                bold="unauthorized access"
                text="Protect shared resources from"
                textAfter="."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 7. Creating and Managing User Accounts (verbatim quote + verbatim Example)
    {
      id: "user-accounts",
      title: "Creating and Managing User Accounts",
      render: (
        <SlideLayout
          title="Creating and Managing User Accounts"
          subtitle="Each user gets their own desktop, files, settings, and password. Login separates one from another."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "100%" }}>
            <p style={bookQuoteStyle}>
              The operating system allows separate accounts for different users, each with its own <b style={hlBlue}>desktop</b>, <b style={hlBlue}>files</b>, <b style={hlBlue}>settings</b>, and <b style={hlBlue}>passwords</b>.
            </p>
            <div style={{ padding: "18px 22px", backgroundColor: "rgba(255,255,255,0.03)", borderLeft: `3px solid ${ACCENT}`, borderRadius: 6 }}>
              <div style={{ fontSize: 13, letterSpacing: 2, color: ACCENT, fontWeight: 700, marginBottom: 8 }}>
                EXAMPLE
              </div>
              <p style={{ ...bookQuoteStyle, fontSize: 21 }}>
                In computer lab, students login with a username and password provided by the school. This keeps each student's work separate and private. In most modern OS like Windows, a new account can be created through the Settings or Control Panel by selecting User Accounts, choosing Add New User, and entering details like username, password, and account type(Standard, Administrative, Guest).
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:shield-account-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE ACCOUNT TYPES IN MODERN WINDOWS
              </span>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <AccountChip icon="mdi:account-outline" label="Standard" color="var(--sync)" />
              <AccountChip icon="mdi:shield-account-outline" label="Administrative" color="var(--warn)" />
              <AccountChip icon="mdi:account-question-outline" label="Guest" color="var(--muted)" />
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Beyond the book: real-world scenarios (EXTENSION, clearly labelled)
    {
      id: "real-world",
      title: "Beyond the book · Real-world scenarios",
      render: (
        <SlideLayout
          title="Where do operating systems actually live?"
          accent={ACCENT}
        >
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 20, color: "var(--muted)", marginBottom: 16 }}>
            The book covers Windows, macOS, Linux, Android, and iOS. Here are three more places you already meet an OS every day.
          </p>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
            <StaggerItem style={{ height: "100%" }}>
              <ScenarioCard
                icon="mdi:school-outline"
                title="School computer lab"
                subtitle="Windows or Linux"
                body="Every student logs in with their own account. Files stay private, admin can reset passwords."
                color={ACCENT}
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <ScenarioCard
                icon="mdi:bank-outline"
                title="ATM machine"
                subtitle="Windows (historically XP)"
                body="In 2014, about 95 percent of the world's 2.2 million ATMs still ran Windows XP, long after Microsoft dropped support."
                color="var(--warn)"
              />
            </StaggerItem>
            <StaggerItem style={{ height: "100%" }}>
              <ScenarioCard
                icon="logos:tesla"
                title="Tesla dashboard"
                subtitle="Modified Ubuntu Linux"
                body="Your car has a full Linux OS running the giant touchscreen, plus games in newer models."
                color="var(--sync)"
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 9. Tid-Bytes (EXTENSION, clearly labelled)
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
            Five extra facts to remember. Great for opening your next class.
          </p>
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StaggerItem>
              <FactRow
                icon="mdi:cake-variant-outline"
                index="01"
                color="var(--sync)"
                body="Linux was born in a Finnish student's bedroom in 1991. Linus Torvalds' first email: 'I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu).'"
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:rocket-launch-outline"
                index="02"
                color="var(--api)"
                body="NASA's Mars rovers Curiosity and Perseverance run VxWorks on a 200 MHz radiation-hardened chip. Slower than a 2005 phone, but bulletproof against cosmic rays."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:earth"
                index="03"
                color="var(--microtask)"
                body="Windows 10 and 11 run on 1.4 billion active devices, roughly one Windows machine for every six people on Earth."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:apple"
                index="04"
                color="var(--warn)"
                body="macOS, iOS, iPadOS, watchOS, and tvOS all share one core called Darwin. That is why your iPhone and your MacBook feel like cousins."
              />
            </StaggerItem>
            <StaggerItem>
              <FactRow
                icon="mdi:console"
                index="05"
                color="var(--task)"
                body="The word 'shell' comes from Multics in the 1960s, the idea being a soft outer layer wrapping the hard kernel, like a nut. Ken Thompson wrote the first Unix shell in 1971."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 10. Important Concepts (auto-generated summary, verbatim key terms)
    {
      id: "important-concepts",
      title: "Important Concepts",
      entrySfx: "ding.wav",
      render: (
        <SlideLayout
          title="Important Concepts from 1.1"
          accent={ACCENT}
        >
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:cog-sync-outline"
                term="Operating System (OS)"
                def="A type of system software that manages hardware, runs application software, and provides a user interface."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:traffic-light"
                term="Central System Controller"
                def="The OS works like a traffic controller: decides which task runs, how memory is used, and which devices are active."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:swap-horizontal"
                term="Translator role"
                def="The OS translates user actions (clicks, keys) into instructions the hardware can understand."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:code-braces"
                term="Binary language"
                def="The only language computers understand: ON and OFF, i.e. 0 and 1. The letter A = 01000001."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:account-multiple-outline"
                term="Multi-user environment"
                def="One computer used by many people, each with their own account, files, and privacy."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:shield-account-outline"
                term="Account types"
                def="Standard, Administrative, and Guest, differing by what a user can install, change, or access."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 11. Definitions and Important Questions (Q&A style, verbatim from book)
    {
      id: "questions",
      title: "Definitions and Important Questions",
      render: (
        <SlideLayout
          title="Definitions and Important Questions"
          accent="var(--microtask)"
        >
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
            <StaggerItem>
              <QARow
                q="Define an Operating System."
                a="Operating System (OS) is a type of system software that manages hardware, runs application software, and provides a user interface like Windows, macOS, Linux, Android, and iOS."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="How does the OS act as a central controller?"
                a="An operating system works like a traffic controller for the computer. It decides which task should be done first, how the computer's memory is used, and which devices (like a printer or speakers) should be active at a given time."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Why is the OS called a translator?"
                a="Computer hardware cannot understand human language directly. The operating system acts as a translator between the user and the hardware system, changing actions like clicks and keypresses into instructions the hardware can understand."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="List the responsibilities of the OS in a multi-user environment."
                a="Creating and managing separate user accounts; keeping each user's files private; sharing resources fairly; protecting shared resources from unauthorized access."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Name the three account types available in modern OS like Windows."
                a="Standard, Administrative, Guest."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 12. What's next teaser
    {
      id: "next-topic",
      title: "Next up: 1.2 Architecture of an OS",
      render: (
        <SlideLayout
          title="Next: 1.2 Architecture of an Operating System"
          accent="var(--microtask)"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              The architecture of an operating system is the way how its parts are organized and how they work together. Each part has a special role, and together they make the computer work smoothly, just like a school has different departments that perform specific duties but work together for the smooth working of the school.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:map-marker-path" width={22} height={22} color="var(--microtask)" />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: "var(--microtask)", fontWeight: 800 }}>
                FOUR SUB-TOPICS WAITING FOR YOU IN 1.2
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <NextCard icon="mdi:cog-outline" title="Kernel vs Shell" />
              <NextCard icon="mdi:layers-outline" title="OS Layers and Modular Design" />
              <NextCard icon="mdi:library-outline" title="System Libraries" />
              <NextCard icon="mdi:usb-port" title="Device Drivers" />
            </div>
          </div>
        </SlideLayout>
      ),
    },
  ],
};

