import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, LAYOUT, SAFE_ZONE_RIGHT } from "../theme";

/** Beat title with subtitle, positioned at the top of the canvas. */
export const TitleCard: React.FC<{
  readonly title: string;
  readonly subtitle?: React.ReactNode;
  readonly appearAt?: number;
}> = ({ title, subtitle, appearAt = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - appearAt;

  const spr = spring({ frame: localFrame, fps, config: { damping: 14 } });
  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.title.y,
        left: 0,
        // Right offset by SAFE_ZONE_RIGHT so text is centered in the content
        // area, not the full canvas — otherwise it sits under the OBS webcam.
        right: SAFE_ZONE_RIGHT,
        textAlign: "center",
        transform: `translateY(${(1 - spr) * -24}px)`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: -1, color: COLORS.text }}>
        {title}
      </div>
      {subtitle ? (
        <div style={{ fontSize: 24, color: COLORS.muted, marginTop: 8 }}>{subtitle}</div>
      ) : null}
    </div>
  );
};
