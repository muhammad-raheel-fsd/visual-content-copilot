import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  /** zoom target as fraction of canvas (0..1). Default center. */
  readonly focusX?: number;
  readonly focusY?: number;
  /** max scale factor */
  readonly scale?: number;
  /** frame the zoom-in starts */
  readonly zoomInAt: number;
  /** frame the zoom is fully applied */
  readonly holdAt: number;
  /** frame the zoom-out starts (optional) */
  readonly zoomOutAt?: number;
  /** frame the zoom-out finishes */
  readonly endAt?: number;
  readonly children?: React.ReactNode;
};

/**
 * Ken Burns-style zoom-and-hold. Wraps content, applies a smooth transform
 * that zooms in toward (focusX, focusY) between zoomInAt..holdAt, holds until
 * zoomOutAt, then zooms back out by endAt.
 *
 * Use for punch moments where the narrator emphasizes something worth
 * scrutinizing — a specific code line, a chart data point, a diagram detail.
 */
export const ZoomHold: React.FC<Props> = ({
  focusX = 0.5,
  focusY = 0.5,
  scale = 1.3,
  zoomInAt,
  holdAt,
  zoomOutAt,
  endAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // holdAt clamps the zoom-in spring: past holdAt, we stay at full zoom.
  const springFrame = Math.min(frame - zoomInAt, holdAt - zoomInAt);
  const zoomInProgress = spring({
    frame: springFrame,
    fps,
    config: { damping: 20, mass: 0.9, stiffness: 100 },
  });
  const zoomOutProgress =
    zoomOutAt !== undefined && endAt !== undefined
      ? interpolate(frame, [zoomOutAt, endAt], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const currentScale = interpolate(zoomInProgress - zoomOutProgress, [0, 1], [1, scale]);

  // Translate so the focus point stays anchored during scale
  const originX = focusX * width;
  const originY = focusY * height;
  const dx = (originX - width / 2) * (1 - currentScale);
  const dy = (originY - height / 2) * (1 - currentScale);

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dx}px, ${dy}px) scale(${currentScale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
