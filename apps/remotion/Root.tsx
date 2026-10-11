import { Composition } from "remotion";
import { Main } from "./Main";

import { calculateMetadata } from "./calculate-metadata/calculate-metadata";
import { schema } from "./calculate-metadata/schema";
import { EventLoop, EVENT_LOOP_DURATION } from "./videos/event-loop";
import {
  MASTER_TIMELINE,
  Phase01Master,
  Phase01Short,
  SHORT_TIMELINE,
  type ShortPlatform,
} from "./videos/phase-01-who-controls-your-phone";
import { Phase02Master, PHASE02_MASTER_TIMELINE } from "./videos/phase-02-kernel-vs-shell";

const SHORT_RENDERS: readonly { id: string; platform: ShortPlatform; height: number }[] = [
  { id: "Phase01Shorts", platform: "shorts", height: 1920 },
  { id: "Phase01Reels", platform: "reels", height: 1920 },
  { id: "Phase01Tiktok", platform: "tiktok", height: 1920 },
  { id: "Phase01FbReels", platform: "fbReels", height: 1920 },
  { id: "Phase01Feed", platform: "feed", height: 1350 },
];

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        defaultProps={{
          steps: null,
          themeColors: null,
          theme: "github-dark" as const,
          codeWidth: null,
          width: {
            type: "auto",
          },
        }}
        fps={30}
        height={1080}
        calculateMetadata={calculateMetadata}
        schema={schema}
      />
      <Composition
        id="EventLoop"
        component={EventLoop}
        durationInFrames={EVENT_LOOP_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Faceless series, phase 1 (pipeline/phase-01-who-controls-your-phone.md). */}
      <Composition
        id="Phase01Master"
        component={Phase01Master}
        durationInFrames={MASTER_TIMELINE.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Faceless series, phase 02 (pipeline/phase-02-kernel-vs-shell.md). */}
      <Composition
        id="Phase02Master"
        component={Phase02Master}
        durationInFrames={PHASE02_MASTER_TIMELINE.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* One Short per platform (pipeline/production-guide.md, section 8). */}
      {SHORT_RENDERS.map((r) => (
        <Composition
          key={r.id}
          id={r.id}
          component={Phase01Short}
          defaultProps={{ platform: r.platform }}
          durationInFrames={SHORT_TIMELINE.durationInFrames}
          fps={30}
          width={1080}
          height={r.height}
        />
      ))}
    </>
  );
};
