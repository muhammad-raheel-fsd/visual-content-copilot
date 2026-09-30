import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  /** frame at which the pop begins */
  readonly at: number;
  /** spring damping (lower = bouncier) */
  readonly damping?: number;
  /** initial scale before the pop */
  readonly fromScale?: number;
  /** how far above/below to start (px). Positive = starts below and rises up. */
  readonly slide?: number;
  /** wrap style — inline or block */
  readonly display?: "inline-block" | "block";
  readonly children?: React.ReactNode;
};

/**
 * Spring-based scale + optional slide entry. Cover the vast majority of
 * "element appears with bounce" moments in modern explainer videos.
 * Pair with <SfxCue file="pop.wav" at={at} /> in the parent beat.
 */
export const PopIn: React.FC<Props> = ({
  at,
  damping = 12,
  fromScale = 0.6,
  slide = 0,
  display = "block",
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - at,
    fps,
    config: { damping, mass: 0.7, stiffness: 180 },
  });

  const scale = interpolate(progress, [0, 1], [fromScale, 1]);
  const translate = slide === 0 ? 0 : interpolate(progress, [0, 1], [slide, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display,
        transform: `translateY(${translate}px) scale(${scale})`,
        opacity,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};
