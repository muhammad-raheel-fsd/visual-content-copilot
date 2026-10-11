import { SfxCue } from "../../components/audio/SfxCue";
import type { MemeSpec } from "../../components/faceless/Meme";
import { cue, lineEnd, type Timeline } from "../../components/faceless/voice";

/**
 * Phase 1 meme cut-ins (pipeline/phase-01-who-controls-your-phone.md, section 3; rules in the
 * production guide, section 7). Each one plays in the voice gap timeline.ts leaves after its
 * line (MEME_GAPS), except Goku, who starts over "superpowers activate kar deta hai" and stays
 * on while Carry's "Raja ji apni shaktiyon ka poora istemaal kar rahe hain" plays in the gap. The
 * picture pauses and blurs behind every meme (MemePause in Master.tsx / Short.tsx).
 */
export const masterMemes = (tl: Timeline): MemeSpec[] => {
  const superAt = cue(tl, "7.6", "super");
  return [
    {
      src: "memes/hawa-nikal-gayi.mp4",
      at: lineEnd(tl, "1.2") + 2,
      duration: 86,
      aspect: 1706 / 720,
    },
    {
      src: "memes/maza-aayega-bhidu.mp4",
      at: lineEnd(tl, "1.4") + 2,
      duration: 77,
      aspect: 1280 / 720,
    },
    {
      src: "memes/shabash-beta.mp4",
      at: lineEnd(tl, "4.9") + 2,
      duration: 95,
      aspect: 488 / 720,
    },
    {
      src: "memes/goku-ultra-instinct.mp4",
      at: superAt - 2,
      duration: lineEnd(tl, "7.6") + 150 - (superAt - 2),
      aspect: 846 / 480,
      muted: true,
    },
    {
      src: "memes/kuch-gadbad-daya.mp4",
      at: lineEnd(tl, "8.1") + 2,
      duration: 63,
      aspect: 406 / 720,
    },
    {
      src: "memes/carry-subscribe-karo.mp4",
      at: lineEnd(tl, "10.4") + 2,
      duration: 230,
      aspect: 1280 / 720,
      tilt: 0, // the last meme sits straight
    },
  ];
};

export const shortMemes = (tl: Timeline): MemeSpec[] => [
  {
    src: "memes/hawa-nikal-gayi.mp4",
    at: lineEnd(tl, "1.2") + 2,
    duration: 86,
    aspect: 1706 / 720,
  },
];

/** The meme sounds that are not clips: FAAAH on "hang"; zap, swoosh and Carry's "Raja ji..." as Goku powers up. */
export const MasterMemeSounds: React.FC<{ readonly tl: Timeline }> = ({
  tl,
}) => {
  const superAt = cue(tl, "7.6", "super");
  return (
    <>
      <SfxCue
        file="meme-fah.wav"
        at={cue(tl, "4.9", "hang")}
        volume={0.55}
        durationInFrames={60}
      />
      <SfxCue file="zap.wav" at={superAt} volume={0.45} />
      <SfxCue file="swoosh.wav" at={superAt + 4} volume={0.35} />
      {/* Carry over the powering-up Goku, in the voice gap after 7.6 */}
      <SfxCue
        file="meme-raja-ji-shaktiyan.wav"
        at={lineEnd(tl, "7.6") + 4}
        volume={0.9}
        durationInFrames={146}
      />
    </>
  );
};
