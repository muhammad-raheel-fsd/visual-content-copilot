import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, LAYOUT, SAFE_ZONE_RIGHT } from "../theme";

/** Bottom-of-canvas reveal text, appears with fade-in. */
export const Reveal: React.FC<{
  readonly text: string;
  readonly appearAt: number;
  readonly color?: string;
  readonly fontSize?: number;
}> = ({ text, appearAt, color = COLORS.accent, fontSize = 38 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearAt;
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(localFrame, [0, 20], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.reveal.y,
        left: 0,
        // Right offset by SAFE_ZONE_RIGHT keeps text centred in the content area.
        // SAFE_ZONE_RIGHT is 0 now (webcam zone disabled), so this centres on the full canvas.
        right: SAFE_ZONE_RIGHT,
        textAlign: "center",
        opacity,
        transform: `translateY(${y}px)`,
        fontSize,
        color,
        fontWeight: 700,
        letterSpacing: 2,
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};
