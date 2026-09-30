import { RefreshCw } from "lucide-react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

/**
 * Rotating cycle icon. Positioned absolutely.
 * Rotates smoothly between `spinFrom` and `spinTo` frames.
 */
export const EventLoopIcon: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly appearAt?: number;
  readonly spinFrom?: number;
  readonly spinTo?: number;
  readonly rotations?: number;
  readonly focusKey?: string;
}> = ({
  x,
  y,
  size = 240,
  appearAt = 0,
  spinFrom,
  spinTo,
  rotations = 2,
  focusKey,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame: frame - appearAt, fps, config: { damping: 14 } });
  const opacity = interpolate(frame, [appearAt, appearAt + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotationDeg =
    spinFrom !== undefined && spinTo !== undefined
      ? interpolate(frame, [spinFrom, spinTo], [0, 360 * rotations], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      data-focus-target={focusKey}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* faint ring */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px dashed ${COLORS.loop}33`,
        }}
      />
      {/* rotating icon */}
      <div
        style={{
          transform: `rotate(${rotationDeg}deg) scale(${scale})`,
          color: COLORS.loop,
          filter: `drop-shadow(0 0 24px ${COLORS.loop}66)`,
        }}
      >
        <RefreshCw size={size * 0.5} strokeWidth={2.4} />
      </div>
      {/* label */}
      <div
        style={{
          position: "absolute",
          bottom: -34,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 16,
          color: COLORS.loop,
          fontWeight: 700,
          letterSpacing: 3,
        }}
      >
        EVENT LOOP
      </div>
    </div>
  );
};
