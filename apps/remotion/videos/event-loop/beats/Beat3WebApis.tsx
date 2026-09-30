import { Globe, Timer } from "lucide-react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Arrow } from "../../../components/primitives/Arrow";
import { CallStack, type StackFrame } from "../../../components/domain/CallStack";
import {
  CodeBlock,
  fn,
  num,
  punc,
  str,
  text,
  type CodeLine,
} from "../../../components/code/CodeBlock";
import { ConceptIcon } from "../../../components/primitives/ConceptIcon";
import { Indicate, type IndicatePulse } from "../../../components/emphasis/Indicate";
import { Panel } from "../../../components/containers/Panel";
import { Region } from "../../../components/containers/Region";
import { Reveal } from "../../../components/containers/Reveal";
import { SfxCue } from "../../../components/audio/SfxCue";
import { Spotlight, type SpotlightTarget } from "../../../components/emphasis/Spotlight";
import { COLORS, LAYOUT } from "../../../components/theme";
import { TitleCard } from "../../../components/containers/TitleCard";
import { VoiceoverAudio } from "../../../components/audio/VoiceoverAudio";

// 450 frames (15s). VO = 14.06s = 422 frames.

const CODE_LINES: CodeLine[] = [
  { tokens: [fn("console"), punc("."), fn("log"), punc('("'), str("start"), punc('");')] },
  { tokens: [fn("setTimeout"), punc("(() => {")] },
  {
    tokens: [
      text("  "),
      fn("console"),
      punc("."),
      fn("log"),
      punc('("'),
      str("hello"),
      punc('");'),
    ],
  },
  { tokens: [punc("}, "), num("0"), punc(");")] },
  { tokens: [fn("console"), punc("."), fn("log"), punc('("'), str("end"), punc('");')] },
];

function activeLine(frame: number): number {
  if (frame >= 90 && frame < 160) return 0;
  if (frame >= 160 && frame < 260) return 1;
  if (frame >= 350 && frame < 410) return 4;
  return -1;
}

const STACK_REGION = LAYOUT.twoColSplitRight.rightTop;
const WEBAPI_REGION = LAYOUT.twoColSplitRight.rightBottom;

const STACK: StackFrame[] = [
  { id: "log-start", label: 'console.log("start")', color: COLORS.sync, pushAt: 130, popAt: 155 },
  { id: "settimeout", label: "setTimeout(cb, 0)", color: COLORS.api, pushAt: 190, popAt: 245 },
  { id: "log-end", label: 'console.log("end")', color: COLORS.sync, pushAt: 355, popAt: 380 },
];

const SPOTLIGHT: SpotlightTarget[] = [
  { at: 40, key: "beat3-code", borderColor: COLORS.accent },
  { at: 100, key: "beat3-code-line-0", borderColor: COLORS.sync, padding: 2 },
  { at: 170, key: "beat3-code-line-1", borderColor: COLORS.api, padding: 2 },
  { at: 200, key: "beat3-stack-frame-settimeout", borderColor: COLORS.api, padding: 4 },
  { at: 260, key: "beat3-webapi", borderColor: COLORS.api },
  { at: 320, key: "beat3-code-line-4", borderColor: COLORS.sync, padding: 2 },
  { at: 395, key: "beat3-webapi", borderColor: COLORS.api },
];

const PULSES: IndicatePulse[] = [
  { at: 260, key: "beat3-webapi", color: COLORS.api, duration: 35, grow: 40 },
];

export const Beat3WebApis: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <VoiceoverAudio topic="event-loop" beat={3} />
      <SfxCue file="whoosh.wav" at={5} volume={0.3} />
      <SfxCue file="tick.wav" at={130} volume={0.5} />
      <SfxCue file="pop.wav" at={155} volume={0.5} />
      <SfxCue file="tick.wav" at={190} volume={0.55} />
      <SfxCue file="whoosh.wav" at={225} volume={0.5} />
      <SfxCue file="pop.wav" at={260} volume={0.55} />
      <SfxCue file="tick.wav" at={355} volume={0.5} />
      <SfxCue file="pop.wav" at={380} volume={0.5} />
      <SfxCue file="ding.wav" at={390} volume={0.35} />

      <TitleCard title="Async work leaves the stack" subtitle="setTimeout, fetch, DOM events" />

      <ActiveCodePanel />

      <CallStack
        frames={STACK}
        x={STACK_REGION.x}
        y={STACK_REGION.y}
        w={STACK_REGION.w}
        h={STACK_REGION.h}
        appearAt={25}
        focusKey="beat3-stack"
        frameFocusKeyPrefix="beat3-stack-frame"
      />

      <Region
        label="WEB APIs"
        sublabel="browser handles timers, network, events"
        x={WEBAPI_REGION.x}
        y={WEBAPI_REGION.y}
        w={WEBAPI_REGION.w}
        h={WEBAPI_REGION.h}
        color={COLORS.api}
        appearAt={30}
        focusKey="beat3-webapi"
      >
        <WebApiContent />
      </Region>

      <Arrow
        from={{
          x: STACK_REGION.x + STACK_REGION.w / 2,
          y: STACK_REGION.y + STACK_REGION.h - 20,
        }}
        to={{ x: WEBAPI_REGION.x + WEBAPI_REGION.w / 2, y: WEBAPI_REGION.y + 20 }}
        color={COLORS.api}
        drawFrom={225}
        drawTo={270}
        fadeFrom={400}
        fadeTo={430}
        curve={40}
      />

      <Spotlight path={SPOTLIGHT} startAt={38} />
      <Indicate pulses={PULSES} />

      <Reveal text="THE STACK IS FREE" appearAt={385} color={COLORS.api} fontSize={38} />
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
      focusKey="beat3-code"
    >
      <CodeBlock lines={CODE_LINES} activeIndex={activeLine(frame)} focusKey="beat3-code" />
    </Panel>
  );
};

const WebApiContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = spring({ frame: frame - 260, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [255, 275], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        inset: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity,
        transform: `scale(${interpolate(spr, [0, 1], [0.85, 1])})`,
      }}
    >
      <ConceptIcon icon={Timer} size={72} color={COLORS.api} glow />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 32, color: COLORS.api, fontWeight: 700 }}>timer running</div>
        <div style={{ fontSize: 22, color: COLORS.muted }}>0 ms — callback ready</div>
      </div>
      <ConceptIcon icon={Globe} size={56} color={`${COLORS.api}88`} strokeWidth={1.5} />
    </div>
  );
};
