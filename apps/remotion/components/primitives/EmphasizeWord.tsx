import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  /** frame at which the word emphasizes */
  readonly at: number;
  /** color the word becomes at the emphasis peak */
  readonly color?: string;
  /** peak scale (default 1.15) */
  readonly scale?: number;
  /** how long the emphasized state holds (frames) */
  readonly holdFrames?: number;
  /** underline color if set */
  readonly underline?: string;
  readonly children?: React.ReactNode;
};

/**
 * Inline word-level emphasis. Scales + colors a single word (or short phrase)
 * as the narrator hits it, then eases back to normal.
 *
 * Usage:
 *   <p>Microtasks always <EmphasizeWord at={120} color={COLORS.microtask}>
 *     jump the line
 *   </EmphasizeWord></p>
 *
 * Pair with <SfxCue file="ting.wav" at={at} /> for the classic emphasis chime.
 */
export const EmphasizeWord: React.FC<Props> = ({
  at,
  color,
  scale = 1.15,
  holdFrames = 30,
  underline,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - at;

  const enterSpr = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 200 },
  });
  const exitProgress = interpolate(
    localFrame,
    [holdFrames, holdFrames + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const currentScale = interpolate(enterSpr - exitProgress, [0, 1], [1, scale]);
  const colorMix = enterSpr - exitProgress;

  return (
    <span
      style={{
        display: "inline-block",
        transformOrigin: "center bottom",
        transform: `scale(${currentScale})`,
        color: colorMix > 0.5 && color ? color : undefined,
        textDecoration: underline && colorMix > 0.5 ? `underline solid ${underline}` : undefined,
        textUnderlineOffset: "6px",
        textDecorationThickness: "3px",
        fontWeight: "inherit",
      }}
    >
      {children}
    </span>
  );
};
