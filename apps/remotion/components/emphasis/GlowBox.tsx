import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly color: string;
  /** frame the glow appears */
  readonly appearAt?: number;
  /** frame the glow fades out (default: never) */
  readonly fadeAt?: number;
  /** border thickness in px */
  readonly borderWidth?: number;
  /** glow blur radius in px */
  readonly glow?: number;
  /** enable slow continuous breathe pulse */
  readonly pulse?: boolean;
  /** border radius */
  readonly radius?: number;
};

/**
 * Rectangular animated glow border. Positioned absolutely.
 * For an element-following glow, use Spotlight instead — GlowBox is for
 * static frames (highlight a region without dimming the rest).
 */
export const GlowBox: React.FC<Props> = ({
  x,
  y,
  w,
  h,
  color,
  appearAt = 0,
  fadeAt,
  borderWidth = 3,
  glow = 24,
  pulse = true,
  radius = 12,
}) => {
  const frame = useCurrentFrame();

  const appearOpacity = interpolate(frame, [appearAt, appearAt + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOpacity =
    fadeAt !== undefined
      ? interpolate(frame, [fadeAt, fadeAt + 12], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const breathe = pulse ? 0.7 + 0.3 * (Math.sin((frame / 30) * Math.PI * 0.9) + 1) * 0.5 : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        border: `${borderWidth}px solid ${color}`,
        boxShadow: `0 0 ${glow}px ${glow / 2}px ${color}66`,
        opacity: appearOpacity * fadeOpacity * breathe,
        pointerEvents: "none",
      }}
    />
  );
};
