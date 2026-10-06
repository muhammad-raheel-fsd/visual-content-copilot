import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import { buildCatalog } from "./catalog";
import { DeckBrowser } from "./components/DeckBrowser";
import { SlideDeck } from "./SlideDeck";
import { THEME_IDS, THEMES, chapterKeyOf, chapterThemeFor, isThemeId, type ThemeId } from "./themes";
import { eventLoopDeck } from "./decks/event-loop";
import { class10Ch1IntroToOsDeck } from "./decks/class-10-ch1-intro-to-os";
import { class10Ch1T12ArchitectureDeck } from "./decks/class-10-ch1-t1.2-architecture";
import { class10Ch1T13ProcessManagementDeck } from "./decks/class-10-ch1-t1.3-process-management";
import { class10Ch1T14MemoryDeck } from "./decks/class-10-ch1-t1.4-memory";
import { class10Ch1T15ProcessesAndThreadsDeck } from "./decks/class-10-ch1-t1.5-processes-and-threads";
import { class10Ch1T16SystemCallsDeck } from "./decks/class-10-ch1-t1.6-system-calls";
import { class10Ch1T17FileSystemDeck } from "./decks/class-10-ch1-t1.7-file-system";
import { class10Ch1T18TypesOfOsDeck } from "./decks/class-10-ch1-t1.8-types-of-os";
import { class10Ch1RevisionDeck } from "./decks/class-10-ch1-revision";
import { class10Ch1QuizDeck } from "./decks/class-10-ch1-quiz";
import { class12Ch4T41aTkinterIntroDeck } from "./decks/class-12-ch4-t4.1a-tkinter-intro";
import { class12Ch4T41bWidgetsFramesDeck } from "./decks/class-12-ch4-t4.1b-widgets-frames";
import { class12Ch4T41cLayoutManagementDeck } from "./decks/class-12-ch4-t4.1c-layout-management";
import { class12Ch4T41dEventHandlingDeck } from "./decks/class-12-ch4-t4.1d-event-handling";
import { class12Ch4T42aDatabaseConceptsDeck } from "./decks/class-12-ch4-t4.2a-database-concepts";
import { class12Ch4T42bPythonDbConnectionDeck } from "./decks/class-12-ch4-t4.2b-python-db-connection";
import { class12Ch4T42cCrudOperationsDeck } from "./decks/class-12-ch4-t4.2c-crud-operations";
import { class12Ch4RevisionDeck } from "./decks/class-12-ch4-revision";
import { class12Ch4QuizDeck } from "./decks/class-12-ch4-quiz";
import { useIsFullscreen } from "./hooks/useIsFullscreen";

const DECKS = {
  "event-loop": eventLoopDeck,
  "class-10-ch1-intro-to-os": class10Ch1IntroToOsDeck,
  "class-10-ch1-t1.2-architecture": class10Ch1T12ArchitectureDeck,
  "class-10-ch1-t1.3-process-management": class10Ch1T13ProcessManagementDeck,
  "class-10-ch1-t1.4-memory": class10Ch1T14MemoryDeck,
  "class-10-ch1-t1.5-processes-and-threads": class10Ch1T15ProcessesAndThreadsDeck,
  "class-10-ch1-t1.6-system-calls": class10Ch1T16SystemCallsDeck,
  "class-10-ch1-t1.7-file-system": class10Ch1T17FileSystemDeck,
  "class-10-ch1-t1.8-types-of-os": class10Ch1T18TypesOfOsDeck,
  "class-10-ch1-revision": class10Ch1RevisionDeck,
  "class-10-ch1-quiz": class10Ch1QuizDeck,
  "class-12-ch4-t4.1a-tkinter-intro": class12Ch4T41aTkinterIntroDeck,
  "class-12-ch4-t4.1b-widgets-frames": class12Ch4T41bWidgetsFramesDeck,
  "class-12-ch4-t4.1c-layout-management": class12Ch4T41cLayoutManagementDeck,
  "class-12-ch4-t4.1d-event-handling": class12Ch4T41dEventHandlingDeck,
  "class-12-ch4-t4.2a-database-concepts": class12Ch4T42aDatabaseConceptsDeck,
  "class-12-ch4-t4.2b-python-db-connection": class12Ch4T42bPythonDbConnectionDeck,
  "class-12-ch4-t4.2c-crud-operations": class12Ch4T42cCrudOperationsDeck,
  "class-12-ch4-revision": class12Ch4RevisionDeck,
  "class-12-ch4-quiz": class12Ch4QuizDeck,
} as const;

type DeckId = keyof typeof DECKS;

const isDeckId = (v: string | null): v is DeckId => !!v && v in DECKS;

/**
 * Chrome behavior:
 *   - Normal browser mode: TopBar (library button, breadcrumb, theme + aspect pickers).
 *   - Fullscreen mode (F key): all chrome hidden, clean canvas for OBS recording.
 *
 * URL params:
 *   ?deck=<id>            pick a deck (no deck: the library opens so you can choose)
 *   ?aspect=portrait      portrait 9:16 canvas (default: landscape 16:9)
 *   ?theme=<theme-id>     PREVIEW the deck in another theme (src/themes.ts). Not saved.
 *   ?safezone=show        overlay the (disabled) OBS webcam safe-zone outline
 *
 * Keyboard: → / Space / PgDn next · ← / PgUp prev · Home / End · F fullscreen · L library · Esc close
 */
export function App() {
  const isFullscreen = useIsFullscreen();
  const params = new URLSearchParams(window.location.search);

  const [deckId, setDeckId] = useState<DeckId>(() => {
    const initial = params.get("deck");
    return isDeckId(initial) ? initial : "event-loop";
  });
  const [aspect, setAspect] = useState<"portrait" | "landscape">(() =>
    params.get("aspect") === "portrait" ? "portrait" : "landscape",
  );
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(() => {
    const t = params.get("theme");
    return isThemeId(t) ? t : null;
  });
  // First visit without a deck in the URL: open the library instead of guessing.
  const [browserOpen, setBrowserOpen] = useState(() => !isDeckId(params.get("deck")));

  const catalog = useMemo(() => buildCatalog(DECKS), []);
  const deck = DECKS[deckId];
  const chapterTheme = chapterThemeFor(deckId, deck.theme);
  const themeId = previewTheme ?? chapterTheme;

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    p.set("deck", deckId);
    p.set("aspect", aspect);
    if (previewTheme) p.set("theme", previewTheme);
    else p.delete("theme");
    window.history.replaceState({}, "", `?${p.toString()}`);
  }, [deckId, aspect, previewTheme]);

  // L opens the library, Esc closes it. Ignored while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setBrowserOpen(false);
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t && ["INPUT", "SELECT", "TEXTAREA"].includes(t.tagName)) return;
      if (e.key === "l" || e.key === "L") setBrowserOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pickDeck = (id: string) => {
    if (isDeckId(id)) setDeckId(id);
    setBrowserOpen(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "var(--bg)",
      }}
    >
      {!isFullscreen && (
        <TopBar
          crumbs={breadcrumb(deckId, deck)}
          onOpenLibrary={() => setBrowserOpen(true)}
          themeId={themeId}
          chapterTheme={chapterTheme}
          previewTheme={previewTheme}
          onPreviewTheme={setPreviewTheme}
          aspect={aspect}
          onAspectChange={setAspect}
        />
      )}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* key: a new deck always starts at slide 1 (a shorter deck must not inherit a high index) */}
        <SlideDeck
          key={deckId}
          deck={deck}
          themeId={themeId}
          aspect={aspect}
          chromeless={isFullscreen}
          keysDisabled={browserOpen && !isFullscreen}
        />
      </div>
      {browserOpen && !isFullscreen && (
        <DeckBrowser
          catalog={catalog}
          currentId={deckId}
          activeTheme={themeId}
          previewTheme={previewTheme}
          onPick={pickDeck}
          onPreviewTheme={setPreviewTheme}
          onClose={() => setBrowserOpen(false)}
        />
      )}
    </div>
  );
}

/** ["Class 12", "Ch 4", "4.1a Tkinter Widgets..."] for the top bar. */
function breadcrumb(deckId: string, deck: (typeof DECKS)[DeckId]): string[] {
  const m = deckId.match(/^class-(\d+)-ch(\d+)-/);
  if (!m || !chapterKeyOf(deckId)) return ["Other videos", deck.title];
  const code = deckId.endsWith("-revision") ? "Revision" : deckId.endsWith("-quiz") ? "Quiz" : deck.topicCode;
  return [`Class ${m[1]}`, `Ch ${m[2]}`, [code, deck.title].filter(Boolean).join("  ")];
}

const TopBar: React.FC<{
  crumbs: string[];
  onOpenLibrary: () => void;
  themeId: ThemeId;
  chapterTheme: ThemeId;
  previewTheme: ThemeId | null;
  onPreviewTheme: (t: ThemeId | null) => void;
  aspect: "portrait" | "landscape";
  onAspectChange: (a: "portrait" | "landscape") => void;
}> = ({ crumbs, onOpenLibrary, themeId, chapterTheme, previewTheme, onPreviewTheme, aspect, onAspectChange }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "8px 16px",
        borderBottom: "1px solid var(--panel-border)",
        backgroundColor: "var(--panel)",
        fontSize: 13,
        color: "var(--muted)",
        flex: "none",
      }}
    >
      <button onClick={onOpenLibrary} style={libraryButton} title="Open the deck library (L)">
        <Icon icon="mdi:folder-open-outline" width={17} />
        Library
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            {i > 0 && <Icon icon="mdi:chevron-right" width={14} style={{ flex: "none", opacity: 0.6 }} />}
            <span
              style={{
                color: i === crumbs.length - 1 ? "var(--text)" : "var(--muted)",
                fontWeight: i === crumbs.length - 1 ? 600 : 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {c}
            </span>
          </span>
        ))}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
        <select
          value={previewTheme ?? ""}
          onChange={(e) => onPreviewTheme(isThemeId(e.target.value) ? e.target.value : null)}
          style={{ ...selectStyle, color: previewTheme ? "var(--accent)" : "var(--text)" }}
          title="Preview this deck in another theme (not saved)"
        >
          <option value="">Theme: {THEMES[chapterTheme].name} (chapter)</option>
          {THEME_IDS.filter((id) => id !== chapterTheme).map((id) => (
            <option key={id} value={id}>
              Preview: {THEMES[id].name}
            </option>
          ))}
        </select>
        <span style={{ display: "inline-flex", gap: 3 }} title={THEMES[themeId].name}>
          {(["accent", "sync", "microtask", "task"] as const).map((k) => (
            <span
              key={k}
              style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: THEMES[themeId].tokens[k] }}
            />
          ))}
        </span>
        <select
          value={aspect}
          onChange={(e) => onAspectChange(e.target.value as "portrait" | "landscape")}
          style={selectStyle}
        >
          <option value="landscape">landscape 16:9</option>
          <option value="portrait">portrait 9:16</option>
        </select>
        <span style={{ opacity: 0.7, whiteSpace: "nowrap" }}>
          <kbd style={kbdStyle}>L</kbd> library &nbsp;
          <kbd style={kbdStyle}>F</kbd> fullscreen &nbsp;
          <kbd style={kbdStyle}>←</kbd> <kbd style={kbdStyle}>→</kbd> slides
        </span>
      </div>
    </div>
  );
};

const libraryButton: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "5px 12px",
  borderRadius: 6,
  border: "1px solid var(--panel-border)",
  backgroundColor: "var(--panel-elevated)",
  color: "var(--text)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  flex: "none",
};
const selectStyle: React.CSSProperties = {
  backgroundColor: "var(--bg)",
  color: "var(--text)",
  border: "1px solid var(--panel-border)",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 13,
};
const kbdStyle: React.CSSProperties = {
  padding: "1px 6px",
  border: "1px solid var(--panel-border)",
  borderRadius: 4,
  fontFamily: "Roboto Mono, monospace",
  fontSize: 11,
  backgroundColor: "var(--bg)",
};
