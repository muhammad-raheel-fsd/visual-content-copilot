import { SfxCue } from "../../components/audio/SfxCue";
import type { MemeSpec } from "../../components/faceless/Meme";
import { lineEnd, type Timeline } from "../../components/faceless/voice";

/**
 * Phase 02 meme cut-ins (pipeline/phase-02-kernel-vs-shell.md, section 3; rules in the production
 * guide, section 7). Each plays in the voice gap timeline.ts leaves after its line (MEME_GAPS); the
 * picture pauses and blurs behind it. The last one (the subscribe ask) sits straight.
 */
export const masterMemes = (tl: Timeline): MemeSpec[] => [
  // after "Tum phone ya computer pe type karte ho, click karte ho, ya tap karte ho" (Muhammad,
  // 2026-10-12): typing at full speed, muted; the sound is our type.wav
  { src: "memes/typing-fast.mp4", at: lineEnd(tl, "1.1") + 2, duration: 75, aspect: 1280 / 720, muted: true },
  // "Lekin kabhi socha hai ... kaise hain?" (Muhammad, 2026-10-11): the shocked "ah?" face
  { src: "memes/kya-socha.mp4", at: lineEnd(tl, "1.3") + 2, duration: 69, aspect: 1280 / 720 },
  { src: "memes/aaiye-dekhte-hain.mp4", at: lineEnd(tl, "1.6") + 2, duration: 60, aspect: 1280 / 720 },
  { src: "memes/shabash-beta.mp4", at: lineEnd(tl, "7.5") + 2, duration: 95, aspect: 488 / 720 },
  { src: "memes/kuch-gadbad-daya.mp4", at: lineEnd(tl, "8.1") + 2, duration: 63, aspect: 406 / 720 },
  { src: "memes/carry-subscribe-karo.mp4", at: lineEnd(tl, "10.5") + 2, duration: 230, aspect: 1280 / 720, tilt: 0 },
];

/** Sounds that play with a meme (outside the paused picture, so they are not frozen). */
export const MasterMemeSounds: React.FC<{ readonly tl: Timeline }> = ({ tl }) => {
  const at = lineEnd(tl, "1.1") + 4;
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => (
        <SfxCue key={i} file="type.wav" at={at + i * 4 + (i % 3)} volume={0.45} />
      ))}
    </>
  );
};
