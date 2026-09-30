import { useCallback, useMemo } from "react";

/**
 * Play short SFX from public/sfx/*.wav — no wall-clock concerns here since
 * slides are a real interactive React app (not a Remotion composition).
 *
 * Reuses the same synthesized SFX library the video uses, so audio branding
 * is consistent between the live slide deck and the final rendered video.
 */
export function useSlideSfx() {
  // Cache <Audio> elements per file so repeated cues don't create tons of objects.
  const cache = useMemo(() => new Map<string, HTMLAudioElement>(), []);

  const playCue = useCallback(
    (file: string, volume = 0.55) => {
      let audio = cache.get(file);
      if (!audio) {
        audio = new Audio(`/sfx/${file}`);
        cache.set(file, audio);
      }
      // Rewind so rapid repeat presses still play the cue each time
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {
        // Autoplay may be blocked before first user interaction.
        // First keypress unlocks audio — subsequent cues will play.
      });
    },
    [cache],
  );

  return { playCue };
}
