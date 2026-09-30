import { Audio, staticFile } from "remotion";

/** Mounts the voiceover MP3 for a beat. Points at public/voiceover/<topic>/beat-<n>.mp3. */
export const VoiceoverAudio: React.FC<{
  readonly topic: string;
  readonly beat: number;
  readonly volume?: number;
}> = ({ topic, beat, volume = 1 }) => {
  return (
    <Audio src={staticFile(`voiceover/${topic}/beat-${beat}.mp3`)} volume={volume} />
  );
};
