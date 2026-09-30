import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  readonly text: string;
  /** frame the typing starts */
  readonly startAt: number;
  /** characters per second (default 24, natural human typing) */
  readonly cps?: number;
  /** show a blinking cursor after the text */
  readonly cursor?: boolean;
  /** cursor color / text color */
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

/**
 * Typewriter effect: text appears character-by-character.
 * Deterministic (drives from useCurrentFrame). No wall-clock.
 *
 * For per-character SFX (a `type.wav` click on each keystroke), add a
 * matching series of <SfxCue file="type.wav" at={startAt + i / cps * fps} />
 * cues in the parent beat. TypeIn itself does not play audio (audio and
 * visuals are decoupled in Remotion; audio always lives at beat level).
 */
export const TypeIn: React.FC<Props> = ({
  text,
  startAt,
  cps = 24,
  cursor = true,
  color,
  style,
}) => {
  const frame = useCurrentFrame();

  const charsShown = Math.max(
    0,
    Math.min(text.length, Math.floor(interpolate(frame - startAt, [0, (text.length / cps) * 30], [0, text.length]))),
  );
  const visibleText = text.slice(0, charsShown);

  const cursorBlink = cursor
    ? (Math.floor((frame - startAt) / 15) % 2 === 0 ? 1 : 0)
    : 0;

  return (
    <span style={{ color, ...style, whiteSpace: "pre-wrap" }}>
      {visibleText}
      {cursor ? (
        <span
          style={{
            display: "inline-block",
            width: "0.55em",
            marginLeft: 2,
            backgroundColor: color ?? "currentColor",
            opacity: cursorBlink,
            verticalAlign: "text-bottom",
            height: "1em",
          }}
        />
      ) : null}
    </span>
  );
};
