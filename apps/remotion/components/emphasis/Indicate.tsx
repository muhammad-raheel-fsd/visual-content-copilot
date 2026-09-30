import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useCurrentScale,
} from "remotion";

export type IndicatePulse = {
  /** frame the pulse fires */
  at: number;
  /** data-focus-target on the element to pulse around */
  key: string;
  /** color of the pulse ring (default: accent yellow) */
  color?: string;
  /** duration in frames (default: 30 = 1s @30fps) */
  duration?: number;
  /** how much the ring grows past the element rect (default: 40 px) */
  grow?: number;
};

type Props = {
  readonly pulses: IndicatePulse[];
};

type Rect = { x: number; y: number; w: number; h: number };

/**
 * One-shot pulse ring around an element. Uses the same subtract-root pattern
 * as Spotlight for correct composition-space coordinates.
 */
export const Indicate: React.FC<Props> = ({ pulses }) => {
  const frame = useCurrentFrame();
  const rootRef = useRef<HTMLDivElement>(null);
  const measured = useMeasuredRects(pulses, rootRef);

  return (
    <AbsoluteFill ref={rootRef} style={{ pointerEvents: "none" }}>
      {pulses.map((p) => {
        const rect = measured[p.key];
        if (!rect) return null;
        const dur = p.duration ?? 30;
        const localFrame = frame - p.at;
        if (localFrame < 0 || localFrame >= dur) return null;
        const t = localFrame / dur;
        const scale = interpolate(t, [0, 1], [1, 1.35]);
        const opacity = interpolate(t, [0, 0.15, 1], [0, 0.9, 0]);
        const grow = p.grow ?? 40;
        const color = p.color ?? "#ffd166";
        return (
          <div
            key={`${p.key}-${p.at}`}
            style={{
              position: "absolute",
              left: rect.x - grow / 2,
              top: rect.y - grow / 2,
              width: rect.w + grow,
              height: rect.h + grow,
              borderRadius: 20,
              border: `4px solid ${color}`,
              transform: `scale(${scale})`,
              opacity,
              pointerEvents: "none",
              boxShadow: `0 0 24px ${color}66`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

function useMeasuredRects(
  pulses: IndicatePulse[],
  rootRef: React.RefObject<HTMLDivElement | null>,
): Record<string, Rect> {
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const scale = useCurrentScale();
  const handleRef = useRef<number | null>(null);

  if (handleRef.current === null) {
    handleRef.current = delayRender("indicate:measure");
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) {
      if (handleRef.current !== null) {
        const h = handleRef.current;
        handleRef.current = null;
        continueRender(h);
      }
      return;
    }
    const rootRect = root.getBoundingClientRect();

    const next: Record<string, Rect> = {};
    for (const p of pulses) {
      const el = document.querySelector(`[data-focus-target="${p.key}"]`);
      if (el) {
        const r = (el as Element).getBoundingClientRect();
        next[p.key] = {
          x: (r.left - rootRect.left) / scale,
          y: (r.top - rootRect.top) / scale,
          w: r.width / scale,
          h: r.height / scale,
        };
      }
    }
    setRects((prev) => (rectsEqual(prev, next) ? prev : next));
    if (handleRef.current !== null) {
      const h = handleRef.current;
      handleRef.current = null;
      continueRender(h);
    }
  });

  return rects;
}

function rectsEqual(a: Record<string, Rect>, b: Record<string, Rect>): boolean {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    const av = a[k];
    const bv = b[k];
    if (!av || !bv) return false;
    if (av.x !== bv.x || av.y !== bv.y || av.w !== bv.w || av.h !== bv.h) return false;
  }
  return true;
}
