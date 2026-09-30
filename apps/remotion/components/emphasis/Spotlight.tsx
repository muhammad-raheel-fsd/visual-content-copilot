import { useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useCurrentScale,
  useVideoConfig,
} from "remotion";

export type SpotlightTarget = {
  /** frame at which the spotlight should arrive on this target */
  at: number;
  /** data-focus-target attribute of the element to spotlight */
  key: string;
  /** optional colored border color (defaults to accent) */
  borderColor?: string;
  /** extra pixels of padding around the measured rect */
  padding?: number;
};

type Rect = { x: number; y: number; w: number; h: number };

type Props = {
  readonly path: SpotlightTarget[];
  /** overlay dim color (default: rgba(13, 17, 23, 0.72)) */
  readonly dimColor?: string;
  /** default border color if a target doesn't set one */
  readonly borderColor?: string;
  /** delay before spotlight starts (frames) */
  readonly startAt?: number;
};

/**
 * Element-following spotlight. Measures each target via `data-focus-target` and
 * positions a dim overlay + colored border at the target's location.
 *
 * Coordinate math (this is the ONLY correct way in Remotion):
 *   1. Get root's viewport rect: rootRect = rootRef.getBoundingClientRect()
 *   2. Get target's viewport rect: targetRect = target.getBoundingClientRect()
 *   3. Composition space: {x: (targetRect.left - rootRect.left) / scale, ...}
 *
 * Why subtract? getBoundingClientRect() is viewport-relative; left/top inside
 * an AbsoluteFill are composition-relative. The Studio positions the composition
 * inside its chrome, so viewport != composition. Both rects are scaled by the same
 * factor (transforms propagate), so subtracting first cancels the offset, and
 * dividing by scale converts the delta to composition pixels.
 */
export const Spotlight: React.FC<Props> = ({
  path,
  dimColor = "rgba(13, 17, 23, 0.72)",
  borderColor = "#ffd166",
  startAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rootRef = useRef<HTMLDivElement>(null);
  const measured = useMeasuredRects(path, rootRef);

  if (frame < startAt || path.length === 0) {
    return <AbsoluteFill ref={rootRef} style={{ pointerEvents: "none" }} />;
  }

  const sorted = [...path].sort((a, b) => a.at - b.at);
  let currentIdx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (frame >= sorted[i]!.at) currentIdx = i;
  }
  const current = sorted[currentIdx]!;
  const prev = sorted[currentIdx - 1] ?? current;

  const currentRect = measured[current.key];
  const prevRect = measured[prev.key] ?? currentRect;

  const framesSince = frame - current.at;
  const transition = spring({
    frame: framesSince,
    fps,
    config: { damping: 20, mass: 0.7, stiffness: 130 },
  });

  const overallOpacity = interpolate(frame, [startAt, startAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill ref={rootRef} style={{ pointerEvents: "none" }}>
      {currentRect ? (
        <div
          style={{
            position: "absolute",
            left: interpolate(transition, [0, 1], [prevRect!.x, currentRect.x]) -
              (current.padding ?? 8),
            top: interpolate(transition, [0, 1], [prevRect!.y, currentRect.y]) -
              (current.padding ?? 8),
            width: interpolate(transition, [0, 1], [prevRect!.w, currentRect.w]) +
              (current.padding ?? 8) * 2,
            height: interpolate(transition, [0, 1], [prevRect!.h, currentRect.h]) +
              (current.padding ?? 8) * 2,
            borderRadius: 14,
            pointerEvents: "none",
            // The big-box-shadow trick: huge outward shadow paints the entire
            // viewport around this element in dimColor, cutting a "hole" at the
            // element's position without SVG masks.
            boxShadow: `0 0 0 9999px ${dimColor}`,
            border: `3px solid ${current.borderColor ?? borderColor}`,
            opacity: overallOpacity,
            filter: `drop-shadow(0 0 12px ${current.borderColor ?? borderColor}88)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

function useMeasuredRects(
  path: SpotlightTarget[],
  rootRef: React.RefObject<HTMLDivElement | null>,
): Record<string, Rect> {
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const scale = useCurrentScale();
  const handleRef = useRef<number | null>(null);

  if (handleRef.current === null) {
    handleRef.current = delayRender("spotlight:measure");
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
    for (const target of path) {
      const el = document.querySelector(`[data-focus-target="${target.key}"]`);
      if (el) {
        const r = (el as Element).getBoundingClientRect();
        next[target.key] = {
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
