import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSlideSfx } from "./hooks/useSlideSfx";

export type Slide = {
  /** unique key for react */
  id: string;
  /** short label for the current slide (shown in top bar + bottom "now/next" indicator) */
  title?: string;
  /** what this slide contains */
  render: React.ReactNode;
  /** optional per-slide accent color (CSS variable value) */
  accent?: string;
  /** override transition style for this slide */
  transition?: "pop" | "slide" | "fade";
  /** SFX to play when this slide appears (default: pop.wav) */
  entrySfx?: string;
};

export type Deck = {
  title: string;
  slides: Slide[];
  /** default accent for the deck */
  accent?: string;
  /** curriculum context shown in the persistent header (book / chapter / topic) */
  book?: string;
  chapter?: string;
  topic?: string;
  /** exact book topic identifier + title for the top-left TopicBadge, e.g. "1.1" + "Introduction to Operating System (OS)" */
  topicCode?: string;
  topicTitle?: string;
};

type Props = {
  deck: Deck;
  aspect: "portrait" | "landscape";
  /** When true, hide stage border and outer padding , clean canvas for OBS recording. */
  chromeless?: boolean;
};

/** Canvas dimensions per aspect. */
const CANVAS = {
  landscape: { w: 1920, h: 1080 },
  portrait: { w: 1080, h: 1920 },
};

/**
 * Interactive slide deck.
 * - ← → and Space navigate
 * - F toggles fullscreen
 * - Every slide advance plays SFX (pop, then whoosh on major transitions)
 * - framer-motion drives the entry animation per slide
 *
 * The deck is designed to be recorded via OBS window capture. Bookmark the URL
 * with ?deck=<id>&aspect=portrait to jump straight into a specific recording setup.
 */
export const SlideDeck: React.FC<Props> = ({ deck, aspect, chromeless = false }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const { playCue } = useSlideSfx();

  const canvas = CANVAS[aspect];
  const slide = deck.slides[index]!;

  const goNext = () => {
    if (index >= deck.slides.length - 1) return;
    setDirection(1);
    setIndex((i) => i + 1);
  };
  const goPrev = () => {
    if (index <= 0) return;
    setDirection(-1);
    setIndex((i) => i - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Home") {
        setDirection(-1);
        setIndex(0);
      } else if (e.key === "End") {
        setDirection(1);
        setIndex(deck.slides.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, deck.slides.length]);

  // Play the slide's entry SFX
  useEffect(() => {
    playCue(slide.entrySfx ?? "pop.wav");
    // On big transitions, add a swoosh
    if (direction === 1 && index > 0) {
      setTimeout(() => playCue("swoosh.wav", 0.35), 30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const transition = slide.transition ?? "pop";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <ScaledStage width={canvas.w} height={canvas.h} chromeless={chromeless}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={variantsFor(transition)}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", damping: 22, stiffness: 180, mass: 0.7 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {slide.render}
          </motion.div>
        </AnimatePresence>
        <SlideChrome
          book={deck.book}
          chapter={deck.chapter}
          topicCode={deck.topicCode}
          topicTitle={deck.topicTitle}
          current={index + 1}
          total={deck.slides.length}
          currentTitle={slide.title}
          nextTitle={deck.slides[index + 1]?.title}
          accent={deck.accent}
        />
      </ScaledStage>
    </div>
  );
};

/**
 * Unified slide chrome. Sits INSIDE the safe padding zone (32px in from every
 * edge, right side reserved 216px for the OBS webcam), so no clipping ever
 * happens at the stage borders.
 *
 * Layout:
 *   Top-left     : `COMPUTER SCIENCE 10 · CH 1 · 1.1 INTRODUCTION TO OS`
 *   Bottom-left  : `01 / 12  ·  Cover`
 *   Bottom-right : `NEXT →  What is an OS?`
 */
const SlideChrome: React.FC<{
  book?: string;
  chapter?: string;
  topicCode?: string;
  topicTitle?: string;
  current: number;
  total: number;
  currentTitle?: string;
  nextTitle?: string;
  accent?: string;
}> = ({
  book,
  chapter,
  topicCode,
  topicTitle,
  current,
  total,
  currentTitle,
  nextTitle,
  accent = "var(--accent)",
}) => {
  const parts: React.ReactNode[] = [];
  if (book) parts.push(<span key="b">{book}</span>);
  if (chapter) parts.push(<span key="c">{chapter}</span>);
  if (topicCode && topicTitle) {
    parts.push(
      <span key="t" style={{ color: accent }}>
        {topicCode} {topicTitle}
      </span>,
    );
  }
  const joined: React.ReactNode[] = [];
  parts.forEach((p, i) => {
    if (i > 0)
      joined.push(<span key={`sep-${i}`} style={{ opacity: 0.35, margin: "0 10px" }}>·</span>);
    joined.push(p);
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 32,
          right: 216,
          display: "flex",
          alignItems: "center",
          fontSize: 13,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.55)",
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 600,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 6,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {joined}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 32,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 13,
          fontFamily: "Inter, system-ui, sans-serif",
          color: "rgba(255, 255, 255, 0.55)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 6,
        }}
      >
        <span
          style={{
            fontFamily: "Roboto Mono, monospace",
            fontWeight: 800,
            color: accent,
            fontSize: 14,
            letterSpacing: 1,
          }}
        >
          {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {currentTitle ? (
          <span style={{ color: "rgba(255, 255, 255, 0.7)", fontWeight: 600 }}>
            {currentTitle}
          </span>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 216,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 12,
          fontFamily: "Inter, system-ui, sans-serif",
          color: "rgba(255, 255, 255, 0.55)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 6,
        }}
      >
        {nextTitle ? (
          <>
            <span
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              NEXT
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.65)" }}>→ {nextTitle}</span>
          </>
        ) : (
          <span
            style={{
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.35)",
            }}
          >
            END OF DECK
          </span>
        )}
      </div>
    </>
  );
};

/**
 * Scales a fixed-canvas child to fit the viewport while preserving aspect.
 * Slide content is authored at 1920x1080 (or 1080x1920) , scaling happens once,
 * not per element. Same trick Remotion uses.
 */
const ScaledStage: React.FC<{
  width: number;
  height: number;
  chromeless?: boolean;
  children: React.ReactNode;
}> = ({ width, height, chromeless = false, children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById("stage-outer");
      if (!el) return;
      const s = Math.min(el.clientWidth / width, el.clientHeight / height);
      setScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [width, height]);

  return (
    <div
      id="stage-outer"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          position: "relative",
          backgroundColor: "var(--bg)",
          overflow: "hidden",
          // Border + rounded corners only in windowed mode (design chrome).
          // Fullscreen recording gets pure black bleed to viewport edges.
          border: chromeless ? "none" : "1px solid var(--panel-border)",
          borderRadius: chromeless ? 0 : 8,
        }}
      >
        {children}
        <SafeZoneMarker canvasWidth={width} canvasHeight={height} />
      </div>
    </div>
  );
};

/**
 * Faint outline of the right 10% safe zone reserved for the OBS webcam overlay.
 * OFF BY DEFAULT , opt-in with ?safezone=show for authoring, always hidden during recording.
 */
const SafeZoneMarker: React.FC<{ canvasWidth: number; canvasHeight: number }> = ({
  canvasWidth,
  canvasHeight,
}) => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("safezone") !== "show") return null;
  const zoneWidth = Math.round(canvasWidth * 0.1);
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: zoneWidth,
        height: canvasHeight,
        borderLeft: "1px dashed rgba(255, 204, 102, 0.35)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          fontSize: 10,
          color: "rgba(255, 204, 102, 0.55)",
          letterSpacing: 1,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        SAFE · OBS WEBCAM
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const variantsFor = (kind: "pop" | "slide" | "fade"): any => {
  if (kind === "fade") {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  if (kind === "slide") {
    return {
      enter: (d: number) => ({ x: d * 120, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d: number) => ({ x: -d * 120, opacity: 0 }),
    };
  }
  // pop (default)
  return {
    enter: { scale: 0.94, opacity: 0, y: 20 },
    center: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.98, opacity: 0, y: -12 },
  };
};

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
