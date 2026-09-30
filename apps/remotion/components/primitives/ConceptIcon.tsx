import type { LucideIcon } from "lucide-react";
import { COLORS } from "../theme";

/** Wrapper for lucide icons with consistent brand styling. */
export const ConceptIcon: React.FC<{
  readonly icon: LucideIcon;
  readonly size?: number;
  readonly color?: string;
  readonly strokeWidth?: number;
  readonly glow?: boolean;
}> = ({ icon: Icon, size = 32, color = COLORS.text, strokeWidth = 2, glow = false }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        color,
        filter: glow ? `drop-shadow(0 0 12px ${color}66)` : undefined,
      }}
    >
      <Icon size={size} strokeWidth={strokeWidth} />
    </span>
  );
};
