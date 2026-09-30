import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { fontFamily } from "../../font";
import { COLORS } from "../../components/theme";
import { Beat1Hook } from "./beats/Beat1Hook";
import { Beat2CallStack } from "./beats/Beat2CallStack";
import { Beat3WebApis } from "./beats/Beat3WebApis";
import { Beat4TwoQueues } from "./beats/Beat4TwoQueues";
import { Beat5EventLoop } from "./beats/Beat5EventLoop";
import { Beat6Payoff } from "./beats/Beat6Payoff";

const FPS = 30;

// Beat durations sized to actual measured TTS voiceover length + ~1s buffer.
// Total: 480+660+450+540+600+480 = 3210 frames = 107s.
const BEAT_FRAMES = {
  hook: 480,
  callStack: 660,
  webApis: 450,
  twoQueues: 540,
  eventLoop: 600,
  payoff: 480,
} as const;

export const EVENT_LOOP_DURATION =
  BEAT_FRAMES.hook +
  BEAT_FRAMES.callStack +
  BEAT_FRAMES.webApis +
  BEAT_FRAMES.twoQueues +
  BEAT_FRAMES.eventLoop +
  BEAT_FRAMES.payoff;

export const EVENT_LOOP_FPS = FPS;

export const EventLoop: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        fontFamily
      }}
      showInTimeline={false}
    >
      {/* Background music: chill-lofi, low volume so VO dominates. Loops seamlessly. */}
      <Audio
        src={staticFile("music/chill-lofi.ogg")}
        volume={0.3}
        loop={true}
        loopVolumeCurveBehavior="extend"
      />
      <Series>
        <Series.Sequence
          durationInFrames={BEAT_FRAMES.hook}
          name="1. Hook"
          style={{
            translate: "-1px 0px"
          }}
        >
          <Beat1Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEAT_FRAMES.callStack} name="2. Call stack">
          <Beat2CallStack />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEAT_FRAMES.webApis} name="3. Web APIs">
          <Beat3WebApis />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEAT_FRAMES.twoQueues} name="4. Two queues">
          <Beat4TwoQueues />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEAT_FRAMES.eventLoop} name="5. Event loop drains">
          <Beat5EventLoop />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEAT_FRAMES.payoff} name="6. Payoff">
          <Beat6Payoff />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
