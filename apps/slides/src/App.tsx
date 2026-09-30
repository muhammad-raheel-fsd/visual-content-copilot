import { useEffect, useState } from "react";
import { SlideDeck } from "./SlideDeck";
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
} as const;

type DeckId = keyof typeof DECKS;

/**
 * Chrome behavior:
 *   - Normal browser mode: TopBar visible (deck picker, aspect toggle, kbd hints), border around stage.
 *   - Fullscreen mode (F key): all chrome hidden, clean canvas for OBS recording.
 * Slide counter is always visible (bottom-left, subtle).
 *
 * URL params:
 *   ?deck=<id>            — pick a deck (default: event-loop)
 *   ?aspect=portrait      — portrait 9:16 canvas (default: landscape 16:9)
 *   ?safezone=show        — overlay OBS webcam safe-zone outline (default: hidden)
 *
 * Keyboard: → / Space / PgDn next · ← / PgUp prev · Home / End · F fullscreen
 */
export function App() {
  const isFullscreen = useIsFullscreen();

  const [deckId, setDeckId] = useState<DeckId>(() => {
    const initial = new URLSearchParams(window.location.search).get("deck");
    return (initial as DeckId) in DECKS ? (initial as DeckId) : "event-loop";
  });
  const [aspect, setAspect] = useState<"portrait" | "landscape">(() => {
    const q = new URLSearchParams(window.location.search).get("aspect");
    return q === "portrait" ? "portrait" : "landscape";
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("deck", deckId);
    params.set("aspect", aspect);
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [deckId, aspect]);

  const deck = DECKS[deckId];

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
          deckId={deckId}
          deckIds={Object.keys(DECKS) as DeckId[]}
          onDeckChange={setDeckId}
          aspect={aspect}
          onAspectChange={setAspect}
        />
      )}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <SlideDeck deck={deck} aspect={aspect} chromeless={isFullscreen} />
      </div>
    </div>
  );
}

const TopBar: React.FC<{
  deckId: DeckId;
  deckIds: DeckId[];
  onDeckChange: (id: DeckId) => void;
  aspect: "portrait" | "landscape";
  onAspectChange: (a: "portrait" | "landscape") => void;
}> = ({ deckId, deckIds, onDeckChange, aspect, onAspectChange }) => {
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
      <span style={{ color: "var(--text)", fontWeight: 600 }}>bytemotion slides</span>
      <select
        value={deckId}
        onChange={(e) => onDeckChange(e.target.value as DeckId)}
        style={selectStyle}
      >
        {deckIds.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
      <select
        value={aspect}
        onChange={(e) => onAspectChange(e.target.value as "portrait" | "landscape")}
        style={selectStyle}
      >
        <option value="landscape">landscape 16:9 (1920×1080)</option>
        <option value="portrait">portrait 9:16 (1080×1920)</option>
      </select>
      <div style={{ marginLeft: "auto", opacity: 0.7 }}>
        <kbd style={kbdStyle}>F</kbd> fullscreen (hides this bar) &nbsp;
        <kbd style={kbdStyle}>→</kbd> / <kbd style={kbdStyle}>Space</kbd> next &nbsp;
        <kbd style={kbdStyle}>←</kbd> prev
      </div>
    </div>
  );
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
