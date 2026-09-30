import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip } from "../primitives/Chip";
import { Region } from "../containers/Region";
import { COLORS } from "../theme";

export type StackFrame = {
  id: string;
  label: string;
  color: string;
  pushAt: number;
  popAt: number;
};

/** Call-stack visualization. Frames push from below and pop upward, LIFO. */
export const CallStack: React.FC<{
  readonly frames: StackFrame[];
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly appearAt?: number;
  readonly showLabel?: boolean;
  readonly focusKey?: string;
  readonly frameFocusKeyPrefix?: string;
}> = ({ frames, x, y, w, h, appearAt = 0, showLabel = true, focusKey, frameFocusKeyPrefix }) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Region
      label={showLabel ? "CALL STACK" : ""}
      x={x}
      y={y}
      w={w}
      h={h}
      color={COLORS.text}
      appearAt={appearAt}
      focusKey={focusKey}
    >
      <div
        style={{
          position: "absolute",
          inset: 20,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 10,
        }}
      >
        {frames.map((f) => {
          const pushed = currentFrame >= f.pushAt;
          if (!pushed) return null;
          const popped = currentFrame >= f.popAt;
          const pushProgress = spring({
            frame: currentFrame - f.pushAt,
            fps,
            config: { damping: 12, stiffness: 180 },
          });
          const popProgress = popped
            ? interpolate(currentFrame, [f.popAt, f.popAt + 14], [0, 1], {
                extrapolateRight: "clamp",
              })
            : 0;
          const translateY = interpolate(pushProgress, [0, 1], [80, 0]) + popProgress * -50;
          const opacity = Math.max(0, pushProgress - popProgress);
          const scale = interpolate(pushProgress, [0, 1], [0.85, 1]) - popProgress * 0.15;
          return (
            <div
              key={f.id}
              style={{
                width: "100%",
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
              }}
            >
              <Chip
                color={f.color}
                label={f.label}
                size="sm"
                fullWidth
                focusKey={frameFocusKeyPrefix ? `${frameFocusKeyPrefix}-${f.id}` : undefined}
              />
            </div>
          );
        })}
      </div>
    </Region>
  );
};
