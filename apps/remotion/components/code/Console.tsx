import { interpolate, useCurrentFrame } from "remotion";
import { fontFamily } from "../../font";
import { COLORS, CONSOLE_METRICS } from "../theme";

export type ConsoleLine = {
  label: string;
  at: number;
  badge?: { text: string; color: string };
};

/**
 * Console output. Each line appears with a scale+fade animation at its `at` frame.
 * Each line stamps `data-focus-target="<focusKey>-<label>"` for cursor targeting.
 */
export const Console: React.FC<{
  readonly lines: ConsoleLine[];
  readonly focusKey?: string;
}> = ({ lines, focusKey }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        fontFamily,
        fontSize: CONSOLE_METRICS.fontSize,
        lineHeight: `${CONSOLE_METRICS.lineHeight}px`,
      }}
    >
      {lines.map((line) => {
        const visible = frame >= line.at;
        const localFrame = frame - line.at;
        const opacity = visible
          ? interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" })
          : 0;
        const scale = visible
          ? interpolate(localFrame, [0, 12], [0.75, 1], { extrapolateRight: "clamp" })
          : 0.75;
        return (
          <div
            key={line.label}
            data-focus-target={focusKey ? `${focusKey}-${line.label}` : undefined}
            style={{
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: "left center",
              display: "flex",
              alignItems: "center",
              gap: 20,
              height: CONSOLE_METRICS.lineHeight,
            }}
          >
            <span style={{ color: COLORS.muted, width: 24 }}>›</span>
            <span style={{ color: COLORS.text, fontWeight: 700, minWidth: 40 }}>
              {line.label}
            </span>
            {line.badge ? (
              <span
                style={{
                  fontSize: 15,
                  color: line.badge.color,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  opacity: 0.9,
                }}
              >
                {line.badge.text}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
