/**
 * Class 10 CS · Chapter 1 · Topic 1.7 · File System Structure and Management
 *
 * VERBATIM RULE (memory: feedback_verbatim_book_wording.md):
 * Every heading, definition, ACTIVITY box, and key-point sentence is copied
 * EXACTLY from `curriculum/multan-board/class-10/computer-science/ch1-operating-systems/source/t1.7-file-system.md`.
 * Real-world extensions are labelled BEYOND THE BOOK.
 *
 * Research plan: curriculum/multan-board/class-10/computer-science/ch1-operating-systems/research.md
 * 14 slides. Hand-drawn file tree + metadata panel on slide 6.
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

// ── Hero: animated folder tree opening up ────────────────────────────────

const HeroFolderTree: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", damping: 16 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 22px",
        backgroundColor: "var(--panel)",
        border: "2px solid var(--accent)",
        borderRadius: 12,
        boxShadow: "0 0 40px rgba(88, 166, 255, 0.35)",
      }}
    >
      <Icon icon="mdi:folder-outline" width={40} height={40} color="var(--accent)" />
      <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)", letterSpacing: 1 }}>
        My Computer
      </div>
    </motion.div>
    <div style={{ display: "flex", gap: 40, marginTop: 10 }}>
      {[
        { label: "Documents", icon: "mdi:folder-text-outline", color: "var(--sync)", children: ["homework.docx", "notes.txt"] },
        { label: "Pictures", icon: "mdi:folder-image", color: "var(--microtask)", children: ["photo.jpg", "trip.png"] },
        { label: "Music", icon: "mdi:folder-music-outline", color: "var(--task)", children: ["song.mp3", "album.wav"] },
      ].map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.15, type: "spring", damping: 18 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${f.color}`,
              borderRadius: 10,
              boxShadow: `0 0 20px ${f.color}44`,
            }}
          >
            <Icon icon={f.icon} width={30} height={30} color={f.color} />
            <div style={{ fontSize: 15, fontWeight: 800, color: f.color }}>{f.label}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
            {f.children.map((c, ci) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15 + ci * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "var(--muted)",
                  fontFamily: "Roboto Mono, monospace",
                }}
              >
                <Icon icon="mdi:file-outline" width={14} height={14} color={f.color} />
                <span>{c}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ── Files visual: 5 file type icons ─────────────────────────────────────

const FileTypesVisual: React.FC = () => {
  const types = [
    { icon: "mdi:file-document-outline", label: "Text", ext: ".txt / .docx", color: "var(--sync)" },
    { icon: "mdi:file-image-outline", label: "Images", ext: ".jpg / .png", color: "var(--microtask)" },
    { icon: "mdi:file-music-outline", label: "Audio", ext: ".mp3 / .wav", color: "var(--task)" },
    { icon: "mdi:file-video-outline", label: "Video", ext: ".mp4 / .mov", color: "var(--api)" },
    { icon: "mdi:file-code-outline", label: "Program", ext: ".exe / .py", color: "var(--warn)" },
  ];
  return (
    <Stagger style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
      {types.map((t) => (
        <StaggerItem key={t.label}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              padding: "18px 10px",
              backgroundColor: "var(--panel)",
              border: `1.5px solid ${t.color}`,
              borderRadius: 12,
              boxShadow: `0 0 18px ${t.color}22`,
            }}
          >
            <Icon icon={t.icon} width={40} height={40} color={t.color} />
            <div style={{ fontSize: 14, fontWeight: 800, color: t.color }}>{t.label}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Roboto Mono, monospace" }}>
              {t.ext}
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
};

// ── Folders visual: nested tree ─────────────────────────────────────────

const FolderTreeVisual: React.FC = () => {
  const Row: React.FC<{ icon: string; label: string; depth: number; color: string }> = ({
    icon,
    label,
    depth,
    color,
  }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: depth * 24 }}>
      <Icon icon={icon} width={22} height={22} color={color} />
      <div style={{ fontSize: 15, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
        {label}
      </div>
    </div>
  );
  return (
    <div
      style={{
        padding: "18px 22px",
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--accent)",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Row icon="mdi:folder-outline" label="My Computer" depth={0} color="var(--accent)" />
      <Row icon="mdi:folder-outline" label="Documents" depth={1} color="var(--sync)" />
      <Row icon="mdi:file-document-outline" label="homework.docx" depth={2} color="var(--muted)" />
      <Row icon="mdi:file-document-outline" label="notes.txt" depth={2} color="var(--muted)" />
      <Row icon="mdi:folder-outline" label="Pictures" depth={1} color="var(--microtask)" />
      <Row icon="mdi:file-image-outline" label="photo.jpg" depth={2} color="var(--muted)" />
      <Row icon="mdi:folder-outline" label="Vacation" depth={2} color="var(--microtask)" />
      <Row icon="mdi:file-image-outline" label="beach.jpg" depth={3} color="var(--muted)" />
      <Row icon="mdi:file-image-outline" label="sunset.jpg" depth={3} color="var(--muted)" />
    </div>
  );
};

// ── Metadata visual: file properties panel ──────────────────────────────

const MetadataPanel: React.FC = () => {
  const rows = [
    { key: "Name", value: "photo.jpg" },
    { key: "Type", value: "JPEG image" },
    { key: "Size", value: "2.4 MB" },
    { key: "Date of creation", value: "2026-05-14" },
    { key: "Last modification", value: "2026-09-30" },
  ];
  return (
    <div
      style={{
        padding: 20,
        backgroundColor: "var(--panel)",
        border: "1.5px solid var(--microtask)",
        borderRadius: 12,
        boxShadow: "0 0 28px rgba(255, 179, 71, 0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 10, borderBottom: "1px solid var(--panel-border)" }}>
        <Icon icon="mdi:tag-outline" width={30} height={30} color="var(--microtask)" />
        <div>
          <div style={{ fontSize: 12, letterSpacing: 2, color: "var(--microtask)", fontWeight: 800 }}>
            METADATA OF
          </div>
          <div style={{ fontSize: 17, color: "var(--text)", fontFamily: "Roboto Mono, monospace", fontWeight: 800 }}>
            photo.jpg
          </div>
        </div>
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.key}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            gap: 10,
            padding: "8px 12px",
            backgroundColor: "rgba(255, 179, 71, 0.06)",
            borderRadius: 6,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--muted)", letterSpacing: 1, fontWeight: 700 }}>
            {r.key}
          </div>
          <div style={{ fontSize: 14, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
            {r.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── File Systems cards ──────────────────────────────────────────────────

const FSCard: React.FC<{ name: string; icon: string; os: string; osIcon: string; color: string }> = ({
  name,
  icon,
  os,
  osIcon,
  color,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: "18px 14px",
      backgroundColor: "var(--panel)",
      border: `1.5px solid ${color}`,
      borderRadius: 12,
      boxShadow: `0 0 20px ${color}22`,
      alignItems: "center",
    }}
  >
    <Icon icon={icon} width={44} height={44} color={color} />
    <div
      style={{
        fontSize: 22,
        fontWeight: 800,
        color,
        fontFamily: "Roboto Mono, monospace",
        letterSpacing: 1,
      }}
    >
      {name}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <Icon icon={osIcon} width={22} height={22} />
      <div style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>{os}</div>
    </div>
  </div>
);

// ── Activity box (verbatim) ─────────────────────────────────────────────

const ActivityBox: React.FC = () => (
  <div
    style={{
      padding: "22px 26px",
      backgroundColor: "rgba(255, 179, 71, 0.08)",
      border: "1.5px solid rgba(255, 179, 71, 0.45)",
      borderRadius: 14,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <Icon icon="mdi:hand-back-right-outline" width={28} height={28} color="var(--microtask)" />
      <div style={{ fontSize: 13, letterSpacing: 3, color: "var(--microtask)", fontWeight: 800 }}>
        ACTIVITY · CLASSROOM ROLE-PLAY
      </div>
    </div>
    <div style={{ fontSize: 17, color: "var(--text)", marginBottom: 12 }}>
      <b>Objective:</b> Demonstrate how system calls work when managing files.
    </div>
    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
      1. PREPARE
    </div>
    <ul style={{ paddingLeft: 24, marginBottom: 10, fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>
      <li>Give each student a small card labeled with a file name (e.g., photo.jpg, homework.docx, song.mp3).</li>
      <li>Write <b>"open"</b>, <b>"read"</b>, <b>"write"</b>, and <b>"close"</b> on the board.</li>
    </ul>
    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
      2. STEPS
    </div>
    <ul style={{ paddingLeft: 24, marginBottom: 10, fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>
      <li>Call one student the <b>"Operating System"</b>.</li>
      <li>Another student plays the <b>"Application"</b> (e.g., Photo Viewer).</li>
      <li>The Application requests: "OS, please <b>open</b> photo.jpg".</li>
      <li>The OS responds by selecting the card from the "file list" and handing it over.</li>
      <li>Repeat with <b>read</b>, <b>write</b>, and <b>close</b> for different files.</li>
    </ul>
    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 6, fontWeight: 700, letterSpacing: 1 }}>
      3. WRAP-UP DISCUSSION
    </div>
    <ul style={{ paddingLeft: 24, fontSize: 15, lineHeight: 1.6, color: "var(--text)" }}>
      <li>Explain that each action represents a <b>system call</b>.</li>
    </ul>
  </div>
);

// ── ConceptTag, QARow, NextTopicHero ────────────────────────────────────

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
      boxShadow: "0 0 60px rgba(255, 179, 71, 0.28)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          padding: "6px 16px",
          backgroundColor: "var(--microtask)",
          color: "#0a0e14",
          borderRadius: 999,
          fontSize: 18,
          fontWeight: 800,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        1.8
      </div>
      <div style={{ fontSize: 34, fontWeight: 800, color: "var(--text)" }}>Types of Operating Systems</div>
    </div>
    <div style={{ fontSize: 20, color: "var(--muted)", textAlign: "center", maxWidth: 720, lineHeight: 1.55 }}>
      Not every OS is a desktop OS. Meet <b style={hlWarm}>Real-Time</b>, <b style={hlWarm}>Embedded</b>, <b style={hlWarm}>Network</b>, and <b style={hlWarm}>Mobile</b> operating systems, each optimized for its own kind of device.
    </div>
    <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
      {[
        { icon: "mdi:timer-outline", label: "Real-Time" },
        { icon: "mdi:chip", label: "Embedded" },
        { icon: "mdi:server-network-outline", label: "Network" },
        { icon: "mdi:cellphone", label: "Mobile" },
      ].map((c) => (
        <div
          key={c.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 16px",
            backgroundColor: "rgba(255, 179, 71, 0.12)",
            border: "1px solid rgba(255, 179, 71, 0.45)",
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

export const class10Ch1T17FileSystemDeck: Deck = {
  title: "File System Structure and Management",
  book: "Computer Science 10 (PECTAA)",
  chapter: "Ch 1 · Operating Systems: Structure and Services",
  topic: "1.7 · File System",
  topicCode: "1.7",
  topicTitle: "File System Structure and Management",
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
              1.7 <span style={{ color: ACCENT }}>File System</span> Structure and Management
            </>
          }
          subtitle={
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <HeroFolderTree />
              </div>
              How does the OS keep thousands of files organized, secure, and findable?
            </>
          }
          accent={ACCENT}
        />
      ),
    },

    // 2. Intro (verbatim)
    {
      id: "intro",
      title: "What is a File System?",
      transition: "slide",
      render: (
        <SlideLayout
          title="1.7 File System Structure and Management"
          subtitle="An OS runs programs. But it also stores and organizes your data. That is the file system's job."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              An operating system not only runs programs but also <b style={hlBlue}>stores and organizes the users' data</b>. This is achieved through the <b style={hlBlue}>file system</b>, which provides a structured way for users and applications to <b>store</b>, <b>locate</b>, and <b>manage</b> information on storage devices.
            </p>
            <p style={bookQuoteStyle}>
              A well-designed file system ensures that data remains <b style={hlBlue}>organized, secure, and easily retrievable</b>, even when there are thousands of files contain complex data.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:magnify" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                THREE JOBS OF A FILE SYSTEM
              </span>
            </div>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <StaggerItem>
                <div style={{ padding: 18, backgroundColor: "var(--panel)", border: "1.5px solid var(--sync)", borderRadius: 12 }}>
                  <Icon icon="mdi:database-arrow-down-outline" width={36} height={36} color="var(--sync)" />
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--sync)", marginTop: 8 }}>Store</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Put data on disk in a known place.
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 18, backgroundColor: "var(--panel)", border: "1.5px solid var(--accent)", borderRadius: 12 }}>
                  <Icon icon="mdi:magnify" width={36} height={36} color="var(--accent)" />
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--accent)", marginTop: 8 }}>Locate</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Find any file quickly, even among thousands.
                  </div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div style={{ padding: 18, backgroundColor: "var(--panel)", border: "1.5px solid var(--microtask)", borderRadius: 12 }}>
                  <Icon icon="mdi:cog-outline" width={36} height={36} color="var(--microtask)" />
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--microtask)", marginTop: 8 }}>Manage</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                    Create, rename, copy, delete, protect.
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </SlideLayout>
      ),
    },

    // 3. Files (verbatim)
    {
      id: "files",
      title: "Files",
      render: (
        <SlideLayout
          title="Files"
          subtitle="A file is not just text or a photo. Anything the computer stores as one unit is a file."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlBlue}>file</b> is a <b>collection of related data</b> stored on a computer. It may contain <b style={hlBlue}>text, images, audio, video, or program instructions</b>.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <Icon icon="mdi:file-multiple-outline" width={22} height={22} color={ACCENT} />
              <span style={{ fontSize: 13, letterSpacing: 2.5, color: ACCENT, fontWeight: 800 }}>
                FIVE KINDS OF FILE, ALL FROM THE BOOK
              </span>
            </div>
            <FileTypesVisual />
          </div>
        </SlideLayout>
      ),
    },

    // 4. Folders (verbatim)
    {
      id: "folders",
      title: "Folders (Directories)",
      render: (
        <SlideLayout
          title="Folders"
          subtitle="Containers that group related files. Folders can hold other folders too."
          accent={ACCENT}
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent={ACCENT}>
                <p style={bookQuoteStyle}>
                  A <b style={hlBlue}>folder</b> (also called a <b style={hlBlue}>directory</b>) is a <b>container used to organize files and other folders</b> in a logical structure, making it <b>easier to locate and manage information</b>.
                </p>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <FolderTreeVisual />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 5. Metadata (verbatim)
    {
      id: "metadata",
      title: "Metadata",
      entrySfx: "ting.wav",
      render: (
        <SlideLayout
          title="Metadata"
          subtitle="Data about the data. Right-click any file, and this is what you see."
          accent="var(--microtask)"
        >
          <SplitSlide
            ratio="1:1"
            left={
              <Card title="From the book" accent="var(--microtask)">
                <p style={bookQuoteStyle}>
                  <b style={hlWarm}>Metadata</b> refers to <b>details about a file, folder</b>, such as its <b style={hlWarm}>name, type, size, date of creation, and date of last modification</b>. This information helps both the operating system and the user <b>identify and manage files/ folders without opening them</b>.
                </p>
              </Card>
            }
            right={
              <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                <MetadataPanel />
              </div>
            }
          />
        </SlideLayout>
      ),
    },

    // 6. Hand-drawn file tree + metadata diagram
    {
      id: "diagram-hand-drawn",
      title: "Files, Folders, Metadata · hand-drawn",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Files, Folders, and Metadata, hand-drawn"
          subtitle="Tree on the left, metadata panel on the right, connected by a click."
          accent={ACCENT}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 8 }}>
            <motion.img
              src="/diagrams/class-10-ch1-t1.7-file-system.svg"
              alt="Hand-drawn file tree and metadata panel"
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

    // 7. File Systems definition + 4 types
    {
      id: "file-systems",
      title: "File Systems",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout
          title="File Systems"
          subtitle="Different operating systems use different file systems, each with trade-offs."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <p style={bookQuoteStyle}>
              A <b style={hlBlue}>file system</b> is the way an operating system <b>stores and organizes files on a storage device</b>, such as a <b>hard drive, SSD, or USB</b>. It decides where each file will be kept and save its location so it can be access later.
            </p>
            <p style={{ ...bookQuoteStyle, fontSize: 20 }}>
              Some widely used file systems include computer-based file systems are including:
            </p>
            <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
              <StaggerItem>
                <FSCard
                  name="FAT 32"
                  icon="mdi:usb-flash-drive-outline"
                  os="USB flash drives"
                  osIcon="mdi:usb-flash-drive"
                  color="var(--sync)"
                />
              </StaggerItem>
              <StaggerItem>
                <FSCard
                  name="NTFS"
                  icon="mdi:microsoft-windows"
                  os="Windows OS"
                  osIcon="logos:microsoft-windows-icon"
                  color="var(--accent)"
                />
              </StaggerItem>
              <StaggerItem>
                <FSCard
                  name="APFS / HFS+"
                  icon="mdi:apple"
                  os="macOS"
                  osIcon="logos:apple"
                  color="var(--microtask)"
                />
              </StaggerItem>
              <StaggerItem>
                <FSCard
                  name="EXT4"
                  icon="mdi:linux"
                  os="Linux OS"
                  osIcon="logos:linux-tux"
                  color="var(--task)"
                />
              </StaggerItem>
            </Stagger>
            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "rgba(88, 166, 255, 0.08)",
                border: "1px dashed var(--accent)",
                borderRadius: 10,
                fontSize: 16,
                color: "var(--text)",
                lineHeight: 1.55,
              }}
            >
              The choice of file system affects <b style={hlBlue}>performance</b>, <b style={hlBlue}>storage capacity</b>, and <b style={hlBlue}>security features</b>.
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 8. Example: photo + librarian analogy
    {
      id: "librarian-example",
      title: "Example · The librarian analogy",
      render: (
        <SlideLayout
          title="Example: save a photo, like shelving a book"
          subtitle="The file system knows exactly where each file lives, so it can find it fast."
          accent={ACCENT}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={bookQuoteStyle}>
              If you save a photo on your computer, the file system makes sure it is <b style={hlBlue}>stored in the right place</b> and <b style={hlBlue}>knows exactly where to find it</b> when you open it again, just like a <b style={hlBlue}>librarian placing a book in the right section</b> and knowing where to locate it later.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 22, alignItems: "center" }}>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--microtask)",
                  borderRadius: 14,
                  boxShadow: "0 0 30px rgba(255, 179, 71, 0.28)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Icon icon="mdi:library" width={56} height={56} color="var(--microtask)" />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--microtask)" }}>Librarian</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4, lineHeight: 1.55 }}>
                    Shelves the book by section, code, and shelf. Can retrieve it in seconds.
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  color: "var(--muted)",
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 800 }}>SAME IDEA</div>
                <Icon icon="mdi:arrow-right-thick" width={36} height={36} />
              </motion.div>
              <div
                style={{
                  padding: 22,
                  backgroundColor: "var(--panel)",
                  border: "1.5px solid var(--accent)",
                  borderRadius: 14,
                  boxShadow: "0 0 30px rgba(88, 166, 255, 0.28)",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Icon icon="mdi:file-image-outline" width={56} height={56} color="var(--accent)" />
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>File System</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginTop: 4, lineHeight: 1.55 }}>
                    Puts the photo in Pictures/2026/, remembers the path, opens it on demand.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SlideLayout>
      ),
    },

    // 9. ACTIVITY (verbatim)
    {
      id: "activity",
      title: "Activity · Classroom role-play",
      entrySfx: "chime.wav",
      render: (
        <SlideLayout
          title="Try this in class"
          subtitle="Role-play the OS handling file system calls with paper cards."
          accent="var(--microtask)"
        >
          <ActivityBox />
        </SlideLayout>
      ),
    },

    // 10. BEYOND THE BOOK: real file system comparison
    {
      id: "beyond-book",
      title: "How the four file systems really compare",
      entrySfx: "zap.wav",
      render: (
        <SlideLayout title="File systems in the wild" accent={ACCENT}>
          <BookExtensionTag />
          <p style={{ ...bookQuoteStyle, fontSize: 19, color: "var(--muted)", marginBottom: 14 }}>
            The book names the four. Here is how they actually differ under the hood.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "150px 1fr 1fr 1fr 1fr",
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
            <div style={{ color: "var(--sync)" }}>FAT 32</div>
            <div style={{ color: "var(--accent)" }}>NTFS</div>
            <div style={{ color: "var(--microtask)" }}>APFS</div>
            <div style={{ color: "var(--task)" }}>EXT4</div>
          </div>
          <Stagger style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {[
              { label: "MAX FILE SIZE", fat: "4 GB", ntfs: "16 EB", apfs: "8 EB", ext: "16 TB" },
              { label: "MAX VOLUME SIZE", fat: "2 TB", ntfs: "8 PB", apfs: "8 EB", ext: "1 EB" },
              { label: "CROSS-PLATFORM", fat: "Yes (all OS)", ntfs: "Windows + read-only elsewhere", apfs: "macOS only", ext: "Linux only" },
              { label: "JOURNALING", fat: "No", ntfs: "Yes", apfs: "Yes (metadata)", ext: "Yes" },
              { label: "ENCRYPTION", fat: "No", ntfs: "Yes (BitLocker)", apfs: "Yes (built-in)", ext: "Optional" },
            ].map((row) => (
              <StaggerItem key={row.label}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr 1fr 1fr 1fr",
                    gap: 10,
                    padding: "10px 14px",
                    backgroundColor: "var(--panel)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 1.5, color: "var(--muted)", fontWeight: 800 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
                    {row.fat}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
                    {row.ntfs}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
                    {row.apfs}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text)", fontFamily: "Roboto Mono, monospace" }}>
                    {row.ext}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              backgroundColor: "rgba(255, 179, 71, 0.08)",
              border: "1px solid rgba(255, 179, 71, 0.4)",
              borderRadius: 10,
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.55,
            }}
          >
            <b style={{ color: "var(--microtask)" }}>Note:</b> This is why a big movie file will not fit on an old FAT 32 USB (4 GB limit), but works fine on an NTFS-formatted external drive.
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
        <SlideLayout title="Important Concepts from 1.7" accent={ACCENT}>
          <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <StaggerItem>
              <ConceptTag
                icon="mdi:file-tree-outline"
                term="File System"
                def="The way an operating system stores and organizes files on a storage device, such as a hard drive, SSD, or USB. Provides a structured way to store, locate, and manage information."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:file-outline"
                term="File"
                def="A collection of related data stored on a computer. It may contain text, images, audio, video, or program instructions."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:folder-outline"
                term="Folder (Directory)"
                def="A container used to organize files and other folders in a logical structure, making it easier to locate and manage information."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:tag-outline"
                term="Metadata"
                def="Details about a file, folder, such as its name, type, size, date of creation, and date of last modification. Helps identify and manage files without opening them."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:harddisk"
                term="Widely Used File Systems"
                def="FAT 32 (USB flash drives), NTFS (Windows OS), APFS/HFS+ (macOS), EXT4 (Linux OS)."
              />
            </StaggerItem>
            <StaggerItem>
              <ConceptTag
                icon="mdi:tune-vertical"
                term="Trade-offs"
                def="The choice of file system affects performance, storage capacity, and security features."
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
                q="Define a file."
                a="A file is a collection of related data stored on a computer. It may contain text, images, audio, video, or program instructions."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define a folder."
                a="A folder (also called a directory) is a container used to organize files and other folders in a logical structure, making it easier to locate and manage information."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define metadata."
                a="Metadata refers to details about a file, folder, such as its name, type, size, date of creation, and date of last modification. This information helps both the operating system and the user identify and manage files/ folders without opening them."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="Define a file system and give four widely used examples with their OS."
                a="A file system is the way an operating system stores and organizes files on a storage device. Widely used file systems include: FAT 32 (USB flash drives), NTFS (Windows OS), APFS/HFS+ (macOS), EXT4 (Linux OS)."
              />
            </StaggerItem>
            <StaggerItem>
              <QARow
                q="What does the choice of file system affect?"
                a="The choice of file system affects performance, storage capacity, and security features."
              />
            </StaggerItem>
          </Stagger>
        </SlideLayout>
      ),
    },

    // 13. Coming up next: 1.8 Types of Operating Systems
    {
      id: "next-topic",
      title: "Next up: 1.8 Types of Operating Systems",
      entrySfx: "swoosh.wav",
      render: (
        <SlideLayout title="Coming up next" accent="var(--microtask)">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <NextTopicHero />
          </div>
        </SlideLayout>
      ),
    },
  ],
};
