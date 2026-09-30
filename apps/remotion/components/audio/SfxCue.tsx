import { Audio, Sequence, staticFile } from "remotion";

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
  const from = Math.max(0, at);
  const child = <Audio src={staticFile(`sfx/${file}`)} volume={volume} />;
  if (from === 0) {
    return <Sequence durationInFrames={durationInFrames}>{child}</Sequence>;
  }
  return (
    <Sequence from={from} durationInFrames={durationInFrames}>
      {child}
    </Sequence>
  );
};
