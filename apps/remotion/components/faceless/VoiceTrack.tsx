import { Audio, Sequence, staticFile } from "remotion";

import type { Timeline } from "./voice";

/**
 * Plays the voice. VERBATIM timelines: one chunk per untouched stretch of the recording
 * (trimBefore = where it starts), split only at meme pauses. Older timelines: each line's
 * baked file. No playbackRate ever: Remotion's trims ignore it, which clipped sped-up lines.
 */
export const VoiceTrack: React.FC<{
  readonly timeline: Timeline;
  readonly volume?: number;
}> = ({ timeline, volume = 1 }) => (
  <>
    {timeline.chunks.map((chunk) => (
      <Sequence key={chunk.lineId} from={chunk.from} durationInFrames={chunk.durationInFrames} name={`voice ${chunk.lineId}`}>
        <Audio src={staticFile(chunk.file)} trimBefore={chunk.trimBefore} volume={volume} />
      </Sequence>
    ))}
  </>
);
