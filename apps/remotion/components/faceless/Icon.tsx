import { ICONS, type IconName } from "./icons";

/**
 * An Iconify icon drawn from local SVG data (icons.ts). Never fetches at render time, so every
 * frame has its icons. `size` is the height in px; the width follows the icon's aspect ratio.
 */
export const Icon: React.FC<{
  readonly name: IconName;
  readonly size: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
}> = ({ name, size, color, style }) => {
  const icon = ICONS[name];
  const width = (size * icon.width) / icon.height;
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      style={{ color, display: "block", ...style }}
      // Iconify bodies are trusted, generated SVG markup (icons.ts), not user content.
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
};
