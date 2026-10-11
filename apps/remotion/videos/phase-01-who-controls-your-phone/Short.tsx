import { AbsoluteFill } from "remotion";

import { Captions } from "../../components/faceless/Captions";
import { SfxGain } from "../../components/audio/SfxCue";
import { MemeLayer, MemePause } from "../../components/faceless/Meme";
import { Backdrop, GridSweep, TopicTag } from "../../components/faceless/kit";
import { FL, SFX_GAIN } from "../../components/faceless/theme";
import { cue } from "../../components/faceless/voice";
import { VoiceTrack } from "../../components/faceless/VoiceTrack";
import { LAYOUT_FEED, LAYOUT_PORTRAIT } from "../../components/theme";
import {
  ShortAnswer,
  ShortHook,
  ShortLoopFrame,
  ShortOutro,
  ShortStrip,
  ShortTraffic,
} from "./short-scenes";
import { shortMemes } from "./memes";
import { SHORT_TIMELINE as tl } from "./timeline";

/** Words shown in the accent colour in the burned-in captions. */
const KEYWORDS = [
  "control",
  "operating",
  "system",
  "os",
  "traffic",
  "controller",
  "crossroad",
  "crash",
  "signal",
  "decisions",
  "number",
  "cpu",
  "memory",
  "device",
  "printer",
  "speaker",
  "kernel",
  "shell",
  "follow",
  "subscribe",
];

/** One render per platform (production guide, section 8): same voice and scenes, own preset. */
export const SHORT_PLATFORMS = {
  shorts: LAYOUT_PORTRAIT.flShorts,
  reels: LAYOUT_PORTRAIT.flReels,
  tiktok: LAYOUT_PORTRAIT.flTiktok,
  fbReels: LAYOUT_PORTRAIT.flFbReels,
  feed: LAYOUT_FEED.flFeed,
} as const;

export type ShortPlatform = keyof typeof SHORT_PLATFORMS;

/**
 * Phase 1 Short: 9:16 for YouTube Shorts, Instagram Reels, TikTok and Facebook Reels, 4:5 for
 * the feed cut. Same voice as the master (cut list: pipeline/phase-01-who-controls-your-phone.md,
 * section 4); `platform` picks the safe-area preset.
 */
export const Phase01Short: React.FC<{ readonly platform: ShortPlatform }> = ({
  platform,
}) => {
  const L = SHORT_PLATFORMS[platform];
  const memes = shortMemes(tl);
  return (
    <AbsoluteFill style={{ backgroundColor: FL.bg }}>
      <VoiceTrack timeline={tl} />
      {/* the whole picture pauses and blurs while a meme plays */}
      <SfxGain value={SFX_GAIN}>
        <MemePause memes={memes}>
          <Backdrop />
          <GridSweep at={["3.1", "4.1", "10.3"].map((id) => cue(tl, id) - 6)} />
          <ShortStrip strip={L.strip} />

          <ShortHook tl={tl} stage={L.stage} />
          <ShortAnswer tl={tl} stage={L.stage} />
          <ShortTraffic tl={tl} stage={L.stage} />
          <ShortOutro tl={tl} stage={L.stage} />
          <ShortLoopFrame tl={tl} stage={L.stage} />

          <TopicTag
            text="Class 10 | Ch 1 | Operating System"
            fontSize={34}
            x={L.tag.x}
            y={L.tag.y + (L.tag.h - 42) / 2}
          />
        </MemePause>
      </SfxGain>
      <MemeLayer memes={memes} />
      <Captions timeline={tl} keywords={KEYWORDS} box={L.caption} />
    </AbsoluteFill>
  );
};
