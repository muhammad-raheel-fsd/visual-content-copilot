import { createContext, useContext } from "react";
import { Audio, Sequence, staticFile } from "remotion";

/**
 * A gain on every SfxCue inside it (capped at volume 1), so a whole video's sound effects can
 * be raised or lowered in one place: <SfxGain value={1.4}>...</SfxGain>. Default 1.
 */
const SfxGainContext = createContext(1);
export const SfxGain = SfxGainContext.Provider;

/**
 * Play a short SFX at a specific frame. Wraps <Sequence> + <Audio>
 * to avoid the "from={0} default" lint warning and keep call sites concise.
 */
export const SfxCue: React.FC<{
  readonly file: string;
  readonly at: number;
  readonly volume?: number;
  readonly durationInFrames?: number;
}> = ({ file, at, volume = 0.5, durationInFrames = 30 }) => {
  const level = Math.min(1, volume * useContext(SfxGainContext));
  const from = Math.max(0, at);
  const child = <Audio src={staticFile(`sfx/${file}`)} volume={level} />;
  if (from === 0) {
    return <Sequence durationInFrames={durationInFrames}>{child}</Sequence>;
  }
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      {child}
    </Sequence>
  );
};
