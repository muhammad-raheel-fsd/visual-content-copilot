import { interpolate, useCurrentFrame } from "remotion";
import { LAYOUT } from "../theme";

/**
 * Animated SVG arrow between two points. Draws on as `drawFrom..drawTo`,
 * optionally fades out at `fadeFrom..fadeTo`.
 * Path curves through control point offset (default: straight-line midpoint pushed perpendicular).
 */
export const Arrow: React.FC<{
  readonly from: { x: number; y: number };
  readonly to: { x: number; y: number };
  readonly color: string;
  readonly drawFrom: number;
  readonly drawTo: number;
  readonly fadeFrom?: number;
  readonly fadeTo?: number;
  readonly strokeWidth?: number;
  readonly dashed?: boolean;
  /** Perpendicular offset for curve (positive = right of direction of travel). */
  readonly curve?: number;
}> = ({
  from,
  to,
  color,
  drawFrom,
  drawTo,
  fadeFrom,
  fadeTo,
  strokeWidth = 3,
  dashed = true,
  curve = 60,
}) => {
  const frame = useCurrentFrame();

  const draw = interpolate(frame, [drawFrom, drawTo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade =
    fadeFrom !== undefined && fadeTo !== undefined
      ? interpolate(frame, [fadeFrom, fadeTo], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  // Compute quadratic bezier control point offset perpendicular from the midpoint
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curve;
  const cy = my + ny * curve;

  const pathId = `arrow-${from.x}-${from.y}-${to.x}-${to.y}`;
  // Approximate path length for stroke-dashoffset animation
  const approxLen = len * 1.2;
  const dashArray = dashed ? "10 8" : `${approxLen}`;
  const dashOffset = dashed ? 0 : approxLen * (1 - draw);

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: LAYOUT.title.y + 0 + 1920, // any large size, absolute inner coords
        height: 1080,
        pointerEvents: "none",
        opacity: fade,
      }}
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
    >
      <defs>
        <marker
          id={`head-${pathId}`}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path d="M0,0 L12,6 L0,12 Z" fill={color} />
        </marker>
      </defs>
      <path
        d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        markerEnd={draw > 0.5 ? `url(#head-${pathId})` : undefined}
        opacity={draw}
      />
    </svg>
  );
};
