import { AbsoluteFill } from "remotion";
import { CodeBlock, fn, num, punc, str, type CodeLine } from "../../../components/code/CodeBlock";
import { Console, type ConsoleLine } from "../../../components/code/Console";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Panel } from "../../../components/containers/Panel";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { COLORS, LAYOUT } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// Beat length: 480 frames (16s). VO = 15.05s = 451 frames.

const CODE_LINES: CodeLine[] = [
  { tokens: [fn("console"), punc("."), fn("log"), punc('("'), str("A"), punc('");')] },
  {
    tokens: [
      fn("setTimeout"),
      punc("(() => "),
      fn("console"),
      punc("."),
      fn("log"),
      punc('("'),
      str("B"),
      punc('"), '),
      num("0"),
      punc(");"),
    ],
  },
  {
    tokens: [
      fn("Promise"),
      punc("."),
      fn("resolve"),
      punc("()."),
      fn("then"),
      punc("(() => "),
      fn("console"),
      punc("."),
      fn("log"),
      punc('("'),
      str("C"),
      punc('"));'),
    ],
  },
  { tokens: [fn("console"), punc("."), fn("log"), punc('("'), str("D"), punc('");')] },
];

const OUTPUT_LINES: ConsoleLine[] = [
  { label: "A", at: 220, badge: { text: "sync", color: COLORS.sync } },
  { label: "D", at: 255, badge: { text: "sync", color: COLORS.sync } },
  { label: "C", at: 285, badge: { text: "microtask", color: COLORS.microtask } },
  { label: "B", at: 315, badge: { text: "task", color: COLORS.task } },
];

// Spotlight path: dim everything except the active element per narration.
const SPOTLIGHT: SpotlightTarget[] = [
  { at: 40, key: "beat1-code", borderColor: COLORS.accent },
  { at: 145, key: "beat1-console", borderColor: COLORS.accent },
  { at: 220, key: "beat1-console-A", borderColor: COLORS.sync, padding: 4 },
  { at: 255, key: "beat1-console-D", borderColor: COLORS.sync, padding: 4 },
  { at: 285, key: "beat1-console-C", borderColor: COLORS.microtask, padding: 4 },
  { at: 315, key: "beat1-console-B", borderColor: COLORS.task, padding: 4 },
];

// Punch moments: single ring pulse on B when the narration questions it.
const PULSES: IndicatePulse[] = [
  { at: 340, key: "beat1-console-B", color: COLORS.warn, duration: 45, grow: 60 },
];

export const Beat1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={1} />
      <SfxCue file="whoosh.wav" at={5} volume={0.35} />
      <SfxCue file="pop.wav" at={220} volume={0.5} />
      <SfxCue file="pop.wav" at={255} volume={0.5} />
      <SfxCue file="pop.wav" at={285} volume={0.55} />
      <SfxCue file="pop.wav" at={315} volume={0.55} />
      <SfxCue file="ding.wav" at={340} volume={0.35} />

      <TitleCard
        title="Same tick. Different order."
        subtitle={
          <>
            Why does <span style={{ color: COLORS.microtask }}>Promise.then</span> beat{" "}
            <span style={{ color: COLORS.task }}>setTimeout(0)</span>?
          </>
        }
      />

      <Panel
        title="source.js"
        x={LAYOUT.twoCol.left.x}
        y={LAYOUT.twoCol.left.y}
        w={LAYOUT.twoCol.left.w}
        h={LAYOUT.twoCol.left.h}
        appearAt={10}
        slideFrom="left"
        focusKey="beat1-code"
      >
        <CodeBlock lines={CODE_LINES} activeIndex={-1} focusKey="beat1-code" />
      </Panel>

      <Panel
        title="Console"
        x={LAYOUT.twoCol.right.x}
        y={LAYOUT.twoCol.right.y}
        w={LAYOUT.twoCol.right.w}
        h={LAYOUT.twoCol.right.h}
        appearAt={20}
        slideFrom="right"
        focusKey="beat1-console"
      >
        <Console lines={OUTPUT_LINES} focusKey="beat1-console" />
      </Panel>

      <Spotlight path={SPOTLIGHT} startAt={38} />
      <Indicate pulses={PULSES} />

      <Reveal text="WAIT — WHY IS B LAST?" appearAt={340} color={COLORS.warn} fontSize={36} />
    </AbsoluteFill>
  );
};
