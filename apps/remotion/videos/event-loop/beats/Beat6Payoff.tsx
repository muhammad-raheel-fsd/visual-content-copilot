import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "../../../font";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { COLORS } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// 480 frames (16s). VO = 14.98s = 449 frames.

type Row = { label: string; source: "sync" | "microtask" | "task"; sourceLabel: string; at: number };

const ROWS: Row[] = [
  { label: "A", source: "sync", sourceLabel: "sync", at: 30 },
  { label: "D", source: "sync", sourceLabel: "sync", at: 60 },
  { label: "C", source: "microtask", sourceLabel: "microtask", at: 90 },
  { label: "B", source: "task", sourceLabel: "task (0 ms)", at: 130 },
];

const LIST_X = 560;
const LIST_Y_START = 340;
const ROW_HEIGHT = 100;

const colorFor = (s: Row["source"]): string =>
  s === "sync" ? COLORS.sync : s === "microtask" ? COLORS.microtask : COLORS.task;

const SPOTLIGHT: SpotlightTarget[] = [
  { at: 30, key: "beat6-row-A", borderColor: COLORS.sync, padding: 8 },
  { at: 60, key: "beat6-row-D", borderColor: COLORS.sync, padding: 8 },
  { at: 100, key: "beat6-row-C", borderColor: COLORS.microtask, padding: 8 },
  { at: 140, key: "beat6-row-B", borderColor: COLORS.task, padding: 8 },
  { at: 220, key: "beat6-row-C", borderColor: COLORS.microtask, padding: 8 },
  { at: 290, key: "beat6-row-C", borderColor: COLORS.microtask, padding: 8 },
];

const PULSES: IndicatePulse[] = [
  { at: 340, key: "beat6-row-C", color: COLORS.microtask, duration: 60, grow: 30 },
];

export const Beat6Payoff: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={6} />
      {ROWS.map((r) => (
        <SfxCue key={r.label} file="pop.wav" at={r.at} volume={0.5} />
      ))}
      <SfxCue file="ding.wav" at={340} volume={0.4} />

      <TitleCard title="Same tick. New mental model." subtitle="The console output, annotated." />

      <div
        style={{
          position: "absolute",
          left: LIST_X,
          top: LIST_Y_START,
          width: 800,
        }}
      >
        {ROWS.map((r) => (
          <PayoffRow key={r.label} row={r} />
        ))}
      </div>

      <Spotlight path={SPOTLIGHT} startAt={28} />
      <Indicate pulses={PULSES} />

      <Reveal text="MICROTASKS JUMP THE LINE" appearAt={340} color={COLORS.microtask} fontSize={44} />
    </AbsoluteFill>
  );
};

const PayoffRow: React.FC<{ readonly row: Row }> = ({ row }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= row.at;
  const localFrame = frame - row.at;
  const spr = spring({ frame: localFrame, fps, config: { damping: 14 } });
  const opacity = visible
    ? interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" })
    : 0;
  const translateX = visible ? interpolate(spr, [0, 1], [-30, 0]) : -30;
  const color = colorFor(row.source);

  return (
    <div
      data-focus-target={`beat6-row-${row.label}`}
      style={{
        height: ROW_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 32,
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily,
      }}
    >
      <span style={{ color: COLORS.muted, width: 32, fontSize: 32 }}>›</span>
      <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 56, minWidth: 60 }}>
        {row.label}
      </span>
      <span
        style={{
          fontSize: 22,
          color,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        {row.sourceLabel}
      </span>
    </div>
  );
};
