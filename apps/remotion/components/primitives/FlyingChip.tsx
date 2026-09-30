import { interpolate } from "remotion";
import { Chip } from "./Chip";

/** Chip that flies from one point to another along a curved path. */
export const FlyingChip: React.FC<{
  readonly from: { x: number; y: number };
  readonly to: { x: number; y: number };
  /** 0..1 progress */
  readonly progress: number;
  readonly color: string;
  readonly label: React.ReactNode;
  readonly focusKey?: string;
}> = ({ from, to, progress, color, label, focusKey }) => {
  const x = interpolate(progress, [0, 1], [from.x, to.x]);
  const y = interpolate(progress, [0, 1], [from.y, to.y]);
  const scale = interpolate(progress, [0, 0.5, 1], [1, 1.12, 1]);
  const arc = -80 * Math.sin(progress * Math.PI); // arc upwards mid-flight

  return (
    <div
      data-focus-target={focusKey}
      style={{
        position: "absolute",
        left: x,
        top: y + arc,
        transform: `translate(-50%, -50%) scale(${scale})`,
        filter: `drop-shadow(0 0 20px ${color}88)`,
      }}
    >
      <Chip color={color} label={label} size="sm" />
    </div>
  );
};
