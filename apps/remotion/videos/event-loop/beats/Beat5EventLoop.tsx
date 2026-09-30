import { Terminal, Timer, Zap } from "lucide-react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Chip } from "../../../components/primitives/Chip";
import { ConceptIcon } from "../../../components/primitives/ConceptIcon";
import { EventLoopIcon } from "../../../components/domain/EventLoopIcon";
import { FlyingChip } from "../../../components/primitives/FlyingChip";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Region } from "../../../components/containers/Region";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { centerOf, COLORS, LAYOUT } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// 600 frames (20s). VO = 18.48s = 554 frames.

const STACK = LAYOUT.scene.stack;
const MICRO = LAYOUT.scene.microtaskQueue;
const TASK = LAYOUT.scene.taskQueue;
const LOOP = LAYOUT.scene.loop;
const CONSOLE = LAYOUT.scene.console;

const microCenter = centerOf(MICRO);
const taskCenter = centerOf(TASK);
const loopCenter = centerOf(LOOP);

const microChipStart = { x: MICRO.x + 200, y: microCenter.y };
const taskChipStart = { x: TASK.x + 200, y: taskCenter.y };
const stackLanding = { x: STACK.x + STACK.w / 2, y: STACK.y + STACK.h - 100 };

const SPOTLIGHT: SpotlightTarget[] = [
  { at: 30, key: "beat5-loop", borderColor: COLORS.loop },
  { at: 130, key: "beat5-stack", borderColor: COLORS.text },
  { at: 210, key: "beat5-microtask-region", borderColor: COLORS.microtask },
  { at: 280, key: "beat5-stack", borderColor: COLORS.microtask },
  { at: 335, key: "beat5-console", borderColor: COLORS.microtask },
  { at: 390, key: "beat5-task-region", borderColor: COLORS.task },
  { at: 460, key: "beat5-stack", borderColor: COLORS.task },
  { at: 500, key: "beat5-console", borderColor: COLORS.task },
  { at: 545, key: "beat5-loop", borderColor: COLORS.microtask },
];

const PULSES: IndicatePulse[] = [
  { at: 300, key: "beat5-stack", color: COLORS.microtask, duration: 30 },
  { at: 480, key: "beat5-stack", color: COLORS.task, duration: 30 },
  { at: 510, key: "beat5-microtask-region", color: COLORS.microtask, duration: 45, grow: 30 },
];

export const Beat5EventLoop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={5} />
      <SfxCue file="whoosh.wav" at={240} volume={0.5} />
      <SfxCue file="tick.wav" at={280} volume={0.55} />
      <SfxCue file="pop.wav" at={320} volume={0.55} />
      <SfxCue file="whoosh.wav" at={400} volume={0.5} />
      <SfxCue file="tick.wav" at={440} volume={0.55} />
      <SfxCue file="pop.wav" at={480} volume={0.55} />
      <SfxCue file="ding.wav" at={500} volume={0.4} />

      <TitleCard title="The event loop drains queues" subtitle="Microtasks always go first" />

      <Region
        label="CALL STACK"
        x={STACK.x}
        y={STACK.y}
        w={STACK.w}
        h={STACK.h}
        color={COLORS.text}
        appearAt={10}
        focusKey="beat5-stack"
      >
        <StackLandings />
      </Region>

      <EventLoopIcon
        x={loopCenter.x}
        y={loopCenter.y}
        size={220}
        appearAt={20}
        spinFrom={90}
        spinTo={500}
        rotations={4}
        focusKey="beat5-loop"
      />

      <MicrotaskQueuePanel />
      <TaskQueuePanel />

      <Region
        label="CONSOLE"
        x={CONSOLE.x}
        y={CONSOLE.y}
        w={CONSOLE.w}
        h={CONSOLE.h}
        color={COLORS.text}
        appearAt={30}
        focusKey="beat5-console"
      >
        <MiniConsole />
      </Region>

      <FlyingMicrotask />
      <FlyingTask />

      <Spotlight path={SPOTLIGHT} startAt={28} />
      <Indicate pulses={PULSES} />

      <Reveal
        text="MICROTASKS FIRST. EVERY TIME."
        appearAt={500}
        color={COLORS.microtask}
        fontSize={38}
      />
    </AbsoluteFill>
  );
};

const StackLandings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 20,
        display: "flex",
        flexDirection: "column-reverse",
        gap: 10,
      }}
    >
      {frame >= 280 && frame < 320 ? (
        <StackChip
          color={COLORS.microtask}
          label='() => log("C")'
          from={280}
          out={320}
          fps={fps}
          currentFrame={frame}
        />
      ) : null}
      {frame >= 440 && frame < 480 ? (
        <StackChip
          color={COLORS.task}
          label='() => log("B")'
          from={440}
          out={480}
          fps={fps}
          currentFrame={frame}
        />
      ) : null}
    </div>
  );
};

const StackChip: React.FC<{
  readonly color: string;
  readonly label: string;
  readonly from: number;
  readonly out: number;
  readonly fps: number;
  readonly currentFrame: number;
}> = ({ color, label, from, out, fps, currentFrame }) => {
  const spr = spring({ frame: currentFrame - from, fps, config: { damping: 12 } });
  const opacity = interpolate(
    currentFrame,
    [from, from + 6, out - 3, out],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div style={{ width: "100%", transform: `scale(${spr})`, opacity }}>
      <Chip color={color} label={label} size="sm" fullWidth />
    </div>
  );
};

const MicrotaskQueuePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const chipOpacity = frame < 240 ? 1 : 0;
  return (
    <Region
      label="MICROTASK QUEUE"
      x={MICRO.x}
      y={MICRO.y}
      w={MICRO.w}
      h={MICRO.h}
      color={COLORS.microtask}
      appearAt={5}
      focusKey="beat5-microtask-region"
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
        <div style={{ opacity: chipOpacity }}>
          <Chip color={COLORS.microtask} label='() => log("C")' size="md" />
        </div>
      </div>
    </Region>
  );
};

const TaskQueuePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const chipOpacity = frame < 400 ? 1 : 0;
  return (
    <Region
      label="TASK QUEUE"
      x={TASK.x}
      y={TASK.y}
      w={TASK.w}
      h={TASK.h}
      color={COLORS.task}
      appearAt={5}
      focusKey="beat5-task-region"
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
        <div style={{ opacity: chipOpacity }}>
          <Chip color={COLORS.task} label='() => log("B")' size="md" />
        </div>
      </div>
    </Region>
  );
};

const MiniConsole: React.FC = () => {
  const frame = useCurrentFrame();
  const cOpacity = interpolate(frame, [320, 335], [0, 1], { extrapolateRight: "clamp" });
  const bOpacity = interpolate(frame, [480, 495], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        inset: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 26,
      }}
    >
      <ConceptIcon icon={Terminal} size={22} color={COLORS.muted} />
      <span style={{ color: COLORS.microtask, fontWeight: 700, opacity: cOpacity }}>C</span>
      <span style={{ color: COLORS.task, fontWeight: 700, opacity: bOpacity }}>B</span>
    </div>
  );
};

const FlyingMicrotask: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 240 || frame >= 285) return null;
  const progress = interpolate(frame, [240, 280], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <FlyingChip
      from={microChipStart}
      to={stackLanding}
      progress={progress}
      color={COLORS.microtask}
      label='() => log("C")'
    />
  );
};

const FlyingTask: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 400 || frame >= 445) return null;
  const progress = interpolate(frame, [400, 440], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <FlyingChip
      from={taskChipStart}
      to={stackLanding}
      progress={progress}
      color={COLORS.task}
      label='() => log("B")'
    />
  );
};
