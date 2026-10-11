import {
  AbsoluteFill,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Meme cut-ins (production guide, section 7), one look for every meme: the raw clip (no border,
 * no label) pops in at the centre, tilted a little (`tilt`), always the same height, while the whole
 * video behind it pauses and blurs (MemePause). Clips come from library/memes/, pre-trimmed to
 * the punchline and loudness-equalised by pipeline/build/import-meme-assets.py.
 */
export type MemeSpec = {
  /** path under library/, e.g. "memes/shabash-beta.mp4" */
  readonly src: string;
  readonly at: number;
  /** frames on screen */
  readonly duration: number;
  /** width / height of the clip */
  readonly aspect: number;
  readonly volume?: number;
  readonly muted?: boolean;
  /** degrees; most memes sit a little tilted, -3 by default (0 = straight) */
  readonly tilt?: number;
};

const EASE = 6; // frames for the blur / pop to come in and go out

const inMeme = (memes: readonly MemeSpec[], frame: number) =>
  memes.find((m) => frame >= m.at && frame < m.at + m.duration);

/** Wrap the picture (not the voice, not the captions): it freezes and blurs while a meme plays. */
export const MemePause: React.FC<{
  readonly memes: readonly MemeSpec[];
  readonly children: React.ReactNode;
}> = ({ memes, children }) => {
  const frame = useCurrentFrame();
  const m = inMeme(memes, frame);
  const amount = m
    ? interpolate(
        frame,
        [m.at, m.at + EASE, m.at + m.duration - EASE, m.at + m.duration],
        [0, 1, 1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        },
      )
    : 0;
  return (
    <AbsoluteFill
      style={{
        filter:
          amount > 0
            ? `blur(${amount * 14}px) brightness(${1 - amount * 0.35})`
            : undefined,
      }}
    >
      <Freeze frame={m?.at ?? 0} active={Boolean(m)}>
        {children}
      </Freeze>
    </AbsoluteFill>
  );
};

/** All the memes of a video, drawn above the paused picture. */
export const MemeLayer: React.FC<{ readonly memes: readonly MemeSpec[] }> = ({
  memes,
}) => (
  <>
    {memes.map((m) => (
      <Sequence
        key={`${m.src}-${m.at}`}
        from={m.at}
        durationInFrames={m.duration}
        layout="none"
      >
        <MemeClip {...m} />
      </Sequence>
    ))}
  </>
);

const MemeClip: React.FC<MemeSpec> = ({
  src,
  duration,
  aspect,
  volume = 0.9,
  muted = false,
  tilt = -3,
}) => {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  // the same height for every meme; narrower canvases (Shorts) cap the width instead
  const h = Math.min(H * 0.6, (W * 0.84) / aspect);
  const w = h * aspect;
  const pop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });
  const out = interpolate(frame, [duration - EASE, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: (W - w) / 2,
        top: (H - h) / 2,
        width: w,
        height: h,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])}) rotate(${tilt}deg)`,
        opacity: out,
      }}
    >
      <OffthreadVideo
        src={staticFile(src)}
        muted={muted}
        // fade the meme's own sound in and out so it never clicks
        volume={(f) =>
          volume *
          interpolate(f, [0, 3, duration - EASE, duration], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};
