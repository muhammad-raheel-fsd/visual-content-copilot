import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CallStack, type StackFrame } from "../../../components/domain/CallStack";
import { CodeBlock, fn, kw, punc, str, text, type CodeLine } from "../../../components/code/CodeBlock";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Panel } from "../../../components/containers/Panel";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { COLORS, LAYOUT } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// 660 frames (22s). VO = 20.8s = 624 frames.

const CODE_LINES: CodeLine[] = [
  { tokens: [kw("function"), text(" "), fn("greet"), punc("() {")] },
  { tokens: [text("  "), fn("say"), punc('("'), str("hi"), punc('");')] },
  { tokens: [punc("}")] },
  { tokens: [] },
  { tokens: [kw("function"), text(" "), fn("say"), punc("("), text("msg"), punc(") {")] },
  { tokens: [text("  "), fn("console"), punc("."), fn("log"), punc("("), text("msg"), punc(");")] },
  { tokens: [punc("}")] },
  { tokens: [] },
  { tokens: [fn("greet"), punc("();")] },
];

function activeLine(frame: number): number {
  if (frame >= 260 && frame < 320) return 8;
  if (frame >= 320 && frame < 380) return 1;
  if (frame >= 380 && frame < 450) return 5;
  if (frame >= 450 && frame < 480) return 1;
  if (frame >= 480 && frame < 510) return 8;
  return -1;
}

const STACK: StackFrame[] = [
  { id: "greet", label: "greet()", color: COLORS.sync, pushAt: 280, popAt: 510 },
  { id: "say", label: 'say("hi")', color: COLORS.microtask, pushAt: 340, popAt: 480 },
  { id: "log", label: 'console.log("hi")', color: COLORS.task, pushAt: 400, popAt: 450 },
];

const SPOTLIGHT: SpotlightTarget[] = [
  { at: 40, key: "beat2-code", borderColor: COLORS.accent },
  { at: 200, key: "beat2-stack", borderColor: COLORS.accent },
  { at: 260, key: "beat2-code-line-8", borderColor: COLORS.sync, padding: 2 },
  { at: 285, key: "beat2-stack-frame-greet", borderColor: COLORS.sync, padding: 4 },
  { at: 320, key: "beat2-code-line-1", borderColor: COLORS.microtask, padding: 2 },
  { at: 345, key: "beat2-stack-frame-say", borderColor: COLORS.microtask, padding: 4 },
  { at: 380, key: "beat2-code-line-5", borderColor: COLORS.task, padding: 2 },
  { at: 405, key: "beat2-stack-frame-log", borderColor: COLORS.task, padding: 4 },
  { at: 460, key: "beat2-stack-frame-say", borderColor: COLORS.microtask, padding: 4 },
  { at: 490, key: "beat2-stack-frame-greet", borderColor: COLORS.sync, padding: 4 },
  { at: 540, key: "beat2-stack", borderColor: COLORS.accent },
];

const PULSES: IndicatePulse[] = [
  { at: 450, key: "beat2-stack-frame-log", color: COLORS.task, duration: 25 },
  { at: 480, key: "beat2-stack-frame-say", color: COLORS.microtask, duration: 25 },
  { at: 510, key: "beat2-stack-frame-greet", color: COLORS.sync, duration: 25 },
];

export const Beat2CallStack: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={2} />
      <SfxCue file="whoosh.wav" at={5} volume={0.3} />
      <SfxCue file="tick.wav" at={280} volume={0.55} />
      <SfxCue file="tick.wav" at={340} volume={0.55} />
      <SfxCue file="tick.wav" at={400} volume={0.55} />
      <SfxCue file="pop.wav" at={450} volume={0.55} />
      <SfxCue file="pop.wav" at={480} volume={0.55} />
      <SfxCue file="pop.wav" at={510} volume={0.55} />
      <SfxCue file="ding.wav" at={540} volume={0.35} />

      <TitleCard title="The Call Stack" subtitle="One stack, one thread." />

      <ActiveCodePanel />

      <CallStack
        frames={STACK}
        x={LAYOUT.twoCol.right.x}
        y={LAYOUT.twoCol.right.y}
        w={LAYOUT.twoCol.right.w}
        h={LAYOUT.twoCol.right.h}
        appearAt={25}
        focusKey="beat2-stack"
        frameFocusKeyPrefix="beat2-stack-frame"
      />

      <Spotlight path={SPOTLIGHT} startAt={38} />
      <Indicate pulses={PULSES} />

      <Reveal text="LAST IN, FIRST OUT" appearAt={545} color={COLORS.accent} fontSize={40} />
    </AbsoluteFill>
  );
};

const ActiveCodePanel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Panel
      title="source.js"
      x={LAYOUT.twoCol.left.x}
      y={LAYOUT.twoCol.left.y}
      w={LAYOUT.twoCol.left.w}
      h={LAYOUT.twoCol.left.h}
      appearAt={15}
      slideFrom="left"
      focusKey="beat2-code"
    >
      <CodeBlock lines={CODE_LINES} activeIndex={activeLine(frame)} focusKey="beat2-code" />
    </Panel>
  );
};
