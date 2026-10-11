import { useCurrentFrame } from "remotion";

import { DISPLAY_FONT, FL } from "./theme";
import type { Timeline, TimedWord } from "./voice";

/**
 * Burned-in captions for the Shorts (production guide, section 7): 2 to 4 words at a time,
 * white, key words in the accent colour, the word being spoken slightly bigger. Groups break at line ends
 * and after a word ending with "." "," "?" ":" so a caption never spans two thoughts.
 */
export const Captions: React.FC<{
  readonly timeline: Timeline;
  readonly keywords: readonly string[];
  readonly box: { x: number; y: number; w: number; h: number };
  readonly fontSize?: number;
  readonly maxWords?: number;
}> = ({ timeline, keywords, box, fontSize = 72, maxWords = 3 }) => {
  const frame = useCurrentFrame();
  const groups: TimedWord[][] = [];
  let current: TimedWord[] = [];
  timeline.words.forEach((word, i) => {
    const next = timeline.words[i + 1];
    current.push(word);
    const breakHere =
      current.length >= maxWords || !next || next.lineId !== word.lineId || /[.,?:!]$/.test(word.w);
    if (breakHere) {
      groups.push(current);
      current = [];
    }
  });

  const group = groups.find((g, i) => {
    const start = g[0]!.from;
    const end = groups[i + 1] ? groups[i + 1]![0]!.from : g[g.length - 1]!.to + 6;
    return frame >= start && frame < end;
  });
  if (!group) return null;

  const keys = keywords.map((k) => k.toLowerCase());
  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "center",
        justifyContent: "center",
        gap: "0 22px",
      }}
    >
      {group.map((word) => {
        const clean = word.w.toLowerCase().replace(/[^a-z0-9']/g, "");
        const isKey = keys.some((k) => clean.startsWith(k));
        const active = frame >= word.from && frame < word.to + 2;
        return (
          <span
            key={`${word.lineId}-${word.index}`}
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: active ? fontSize * 1.08 : fontSize,
              color: isKey ? FL.accent : FL.text,
              textShadow: "0 4px 18px rgba(0,0,0,0.85)",
              WebkitTextStroke: "2px rgba(0,0,0,0.35)",
              lineHeight: 1.25,
            }}
          >
            {word.w.replace(/[.,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
