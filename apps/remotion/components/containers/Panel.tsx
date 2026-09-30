import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, PANEL } from "../theme";

/**
 * Window-style container with traffic-light dots. Positioned absolutely
 * so its coordinates match LAYOUT constants exactly.
 */
export const Panel: React.FC<{
  readonly title: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly appearAt?: number;
  readonly slideFrom?: "left" | "right" | "none";
  readonly focusKey?: string;
  readonly children?: React.ReactNode;
}> = ({ title, x, y, w, h, appearAt = 0, slideFrom = "none", focusKey, children }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearAt;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOffset =
    slideFrom === "left"
      ? interpolate(localFrame, [0, 15], [-40, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : slideFrom === "right"
        ? interpolate(localFrame, [0, 15], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 0;

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
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity,
        transform: `translateX(${slideOffset}px)`,
      }}
    >
      <div
        style={{
          height: PANEL.headerHeight,
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          backgroundColor: COLORS.panelHeaderBg,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 20px",
          fontSize: 20,
          color: COLORS.muted,
          flex: "none",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
            <div
              key={c}
              style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c }}
            />
          ))}
        </div>
        {title}
      </div>
      <div
        style={{
          flex: 1,
          padding: `${PANEL.paddingY}px ${PANEL.paddingX}px`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};
