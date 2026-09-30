import { Timer, Zap } from "lucide-react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip } from "../../../components/primitives/Chip";
import { ConceptIcon } from "../../../components/primitives/ConceptIcon";
import { EventLoopIcon } from "../../../components/domain/EventLoopIcon";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Region } from "../../../components/containers/Region";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { centerOf, COLORS, LAYOUT } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// 540 frames (18s). VO = 16.87s = 506 frames.

const STACK = LAYOUT.scene.stack;
const MICRO = LAYOUT.scene.microtaskQueue;
const TASK = LAYOUT.scene.taskQueue;
const LOOP = LAYOUT.scene.loop;
const loopCenter = centerOf(LOOP);

const SPOTLIGHT: SpotlightTarget[] = [
  { at: 40, key: "beat4-stack", borderColor: COLORS.text },
  { at: 180, key: "beat4-microtask-region", borderColor: COLORS.microtask },
  { at: 260, key: "beat4-task-region", borderColor: COLORS.task },
  { at: 340, key: "beat4-microtask-region", borderColor: COLORS.microtask },
  { at: 450, key: "beat4-task-region", borderColor: COLORS.task },
];

const PULSES: IndicatePulse[] = [
  { at: 340, key: "beat4-microtask-chip", color: COLORS.microtask, duration: 40, grow: 30 },
  { at: 450, key: "beat4-task-chip", color: COLORS.task, duration: 40, grow: 30 },
];

export const Beat4TwoQueues: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={4} />
      <SfxCue file="whoosh.wav" at={5} volume={0.3} />
      <SfxCue file="tick.wav" at={225} volume={0.45} />
      <SfxCue file="pop.wav" at={340} volume={0.6} />
      <SfxCue file="pop.wav" at={450} volume={0.6} />
      <SfxCue file="ding.wav" at={510} volume={0.35} />

      <TitleCard title="Two queues, two priorities." />

      <Region
        label="CALL STACK"
        x={STACK.x}
        y={STACK.y}
        w={STACK.w}
        h={STACK.h}
        color={COLORS.text}
        appearAt={15}
        focusKey="beat4-stack"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: COLORS.dim,
            fontSize: 20,
            fontStyle: "italic",
          }}
        >
          empty
        </div>
      </Region>

      <EventLoopIcon
        x={loopCenter.x}
        y={loopCenter.y}
        size={200}
        appearAt={30}
        focusKey="beat4-loop"
      />

      <MicrotaskQueue />
      <TaskQueue />

      <Spotlight path={SPOTLIGHT} startAt={38} />
      <Indicate pulses={PULSES} />

      <Reveal text="MICROTASKS ≠ TASKS" appearAt={475} color={COLORS.microtask} fontSize={38} />
    </AbsoluteFill>
  );
};

const MicrotaskQueue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chipSpring = spring({ frame: frame - 340, fps, config: { damping: 12 } });
  const chipOpacity = interpolate(frame, [335, 355], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Region
      label="MICROTASK QUEUE"
      sublabel="Promises · queueMicrotask · async/await"
      x={MICRO.x}
      y={MICRO.y}
      w={MICRO.w}
      h={MICRO.h}
      color={COLORS.microtask}
      appearAt={20}
      focusKey="beat4-microtask-region"
    >
      <div
        style={{
          position: "absolute",
          inset: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ConceptIcon icon={Zap} size={44} color={COLORS.microtask} strokeWidth={2} />
        <div
          style={{
            opacity: chipOpacity,
            transform: `scale(${chipSpring})`,
            transformOrigin: "left center",
          }}
        >
          <Chip
            color={COLORS.microtask}
            label='() => log("C")'
            size="md"
            focusKey="beat4-microtask-chip"
          />
        </div>
      </div>
    </Region>
  );
};

const TaskQueue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chipSpring = spring({ frame: frame - 450, fps, config: { damping: 12 } });
  const chipOpacity = interpolate(frame, [445, 465], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Region
      label="TASK QUEUE"
      sublabel="setTimeout · setInterval · DOM events · I/O"
      x={TASK.x}
      y={TASK.y}
      w={TASK.w}
      h={TASK.h}
      color={COLORS.task}
      appearAt={25}
      focusKey="beat4-task-region"
    >
      <div
        style={{
          position: "absolute",
          inset: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <ConceptIcon icon={Timer} size={44} color={COLORS.task} strokeWidth={2} />
        <div
          style={{
            opacity: chipOpacity,
            transform: `scale(${chipSpring})`,
            transformOrigin: "left center",
          }}
        >
          <Chip
            color={COLORS.task}
            label='() => log("B")'
            size="md"
            focusKey="beat4-task-chip"
          />
        </div>
      </div>
    </Region>
  );
};
