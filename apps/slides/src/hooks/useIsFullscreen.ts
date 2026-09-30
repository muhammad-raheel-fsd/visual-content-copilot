import { useEffect, useState } from "react";

/** Tracks browser fullscreen state, updates on enter/exit. */
export function useIsFullscreen(): boolean {
  const [isFullscreen, setIsFullscreen] = useState(
    typeof document !== "undefined" && Boolean(document.fullscreenElement),
  );

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return isFullscreen;
}
