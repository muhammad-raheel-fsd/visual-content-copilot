import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, PANEL } from "../theme";

/**
 * Labeled area used for the call-stack, queues, and Web APIs regions.
 * Different from Panel: no traffic-light header, has a spaced-out label at the top.
 */
export const Region: React.FC<{
  readonly label: string;
  readonly sublabel?: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly color?: string;
  readonly appearAt?: number;
  readonly focusKey?: string;
  readonly children?: React.ReactNode;
}> = ({ label, sublabel, x, y, w, h, color = COLORS.muted, appearAt = 0, focusKey, children }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearAt;
  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      data-focus-target={focusKey}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: COLORS.panel,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: PANEL.radius,
        opacity,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "14px 20px 8px",
          textAlign: "center",
          borderBottom: `1px dashed ${COLORS.panelBorder}`,
        }}
      >
        <div
          style={{
            fontSize: 15,
            color,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          {label}
        </div>
        {sublabel ? (
          <div style={{ fontSize: 13, color: COLORS.dim, marginTop: 4 }}>{sublabel}</div>
        ) : null}
      </div>
      <div style={{ flex: 1, padding: 20, position: "relative" }}>{children}</div>
    </div>
  );
};
