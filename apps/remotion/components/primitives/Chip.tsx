import { fontFamily } from "../../font";

/**
 * Colored token (used for stack frames, queue items, flying callbacks).
 * Static — animate via wrapper style.
 */
export const Chip: React.FC<{
  readonly color: string;
  readonly label: React.ReactNode;
  readonly size?: "sm" | "md" | "lg";
  readonly style?: React.CSSProperties;
  readonly focusKey?: string;
  /** If true, chip stretches to fill its container (display: flex instead of inline-flex). */
  readonly fullWidth?: boolean;
}> = ({ color, label, size = "md", style, focusKey, fullWidth = false }) => {
  const dims = size === "sm" ? { padY: 10, padX: 14, font: 18 } : size === "lg" ? { padY: 20, padX: 26, font: 26 } : { padY: 14, padX: 20, font: 22 };
  return (
    <div
      data-focus-target={focusKey}
      style={{
        padding: `${dims.padY}px ${dims.padX}px`,
        borderRadius: 10,
        backgroundColor: `${color}1e`,
        border: `1.5px solid ${color}`,
        color,
        fontSize: dims.font,
        fontFamily,
        display: fullWidth ? "flex" : "inline-flex",
        alignItems: "center",
        gap: 12,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
          flex: "none",
        }}
      />
      {label}
    </div>
  );
};
