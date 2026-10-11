import { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  getInputProps,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { Icon } from "./Icon";
import { BRAND, DISPLAY_FONT, FL } from "./theme";

/**
 * Building blocks of the faceless series (one look for every phase). Every animated piece takes
 * `at` (the frame it appears, usually a word cue from the voice timeline).
 */

/** Spring progress 0..1 starting at `at`. */
export function useAppear(at: number, damping = 14): number {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - at,
    fps,
    config: { damping, mass: 0.7, stiffness: 170 },
  });
}

/** Linear 0..1 between two frames (clamped). */
export function useBetween(from: number, to: number): number {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Grid pattern of the series: fine lines every 40 px, stronger every 200 px (GitHub dark). */
export const GRID = {
  minor: 40,
  major: 200,
  minorColor: "rgba(110, 118, 129, 0.10)",
  majorColor: "rgba(110, 118, 129, 0.22)",
} as const;

export const gridBackground = (
  offsetX = 0,
  offsetY = 0,
): React.CSSProperties => ({
  backgroundColor: FL.bg,
  backgroundImage: [
    `linear-gradient(${GRID.majorColor} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${GRID.majorColor} 1px, transparent 1px)`,
    `linear-gradient(${GRID.minorColor} 1px, transparent 1px)`,
    `linear-gradient(90deg, ${GRID.minorColor} 1px, transparent 1px)`,
  ].join(", "),
  backgroundSize: `${GRID.major}px ${GRID.major}px, ${GRID.major}px ${GRID.major}px, ${GRID.minor}px ${GRID.minor}px, ${GRID.minor}px ${GRID.minor}px`,
  backgroundPosition: `${offsetX}px ${offsetY}px`,
});

/**
 * The grid lights up on a scene change: a soft accent band sweeps across the grid lines in
 * 1 s, then the grid is still again (production guide, section 7: the background never
 * competes with the content, so no constant motion). `inset` matches StageFrame (0 for Shorts).
 */
export const GridSweep: React.FC<{
  readonly at: readonly number[];
  readonly inset?: number;
}> = ({ at, inset = 0 }) => {
  const frame = useCurrentFrame();
  const start = at.find((f) => frame >= f && frame < f + 30);
  if (start === undefined) return null;
  const p = interpolate(frame, [start, start + 30], [-20, 120]);
  const band = `linear-gradient(110deg, transparent ${p - 18}%, black ${p}%, transparent ${p + 18}%)`;
  const line = "rgba(88, 166, 255, 0.45)";
  const fine = "rgba(88, 166, 255, 0.2)";
  return (
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: inset ? 28 : 0,
        overflow: "hidden",
        pointerEvents: "none",
        backgroundImage: [
          `linear-gradient(${line} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          `linear-gradient(${fine} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${fine} 1px, transparent 1px)`,
        ].join(", "),
        backgroundSize: `${GRID.major}px ${GRID.major}px, ${GRID.major}px ${GRID.major}px, ${GRID.minor}px ${GRID.minor}px, ${GRID.minor}px ${GRID.minor}px`,
        backgroundPosition: `${-inset}px ${-inset}px`,
        maskImage: band,
        WebkitMaskImage: band,
      }}
    />
  );
};

/** Full-bleed grid background (Shorts and feed cuts). */
export const Backdrop: React.FC = () => (
  <AbsoluteFill style={gridBackground()} />
);

/**
 * The master's stage: a darker surround and a rounded grid canvas inset from the edges. The
 * margin separates the content from the screen edge (a "drawing board"). Children render in
 * full-canvas coordinates, so LAYOUT presets keep working.
 */
export const StageFrame: React.FC<{
  readonly inset?: number;
  readonly children?: React.ReactNode;
}> = ({ inset = 28, children }) => (
  <AbsoluteFill style={{ backgroundColor: "#010409" }}>
    <div
      style={{
        position: "absolute",
        inset,
        borderRadius: 28,
        border: `2px solid ${FL.panelBorder}`,
        overflow: "hidden",
        ...gridBackground(-inset, -inset),
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Pops its children in at `at` (scale + fade), optional slide in px. */
export const Pop: React.FC<{
  readonly at: number;
  readonly slide?: number;
  readonly fromScale?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ at, slide = 0, fromScale = 0.6, style, children }) => {
  const p = useAppear(at);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.4], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${(1 - p) * slide}px) scale(${interpolate(p, [0, 1], [fromScale, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Top-left topic tag: "Class 10 | Ch 1 | 1.1 Introduction to Operating System (OS)". */
export const TopicTag: React.FC<{
  readonly text: string;
  readonly fontSize?: number;
  /** top-left corner; defaults to the master's stage corner */
  readonly x?: number;
  readonly y?: number;
}> = ({ text, fontSize = 22, x = 64, y = 52 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontFamily: DISPLAY_FONT,
      fontSize,
      fontWeight: 600,
      color: FL.muted,
      letterSpacing: 0.3,
    }}
  >
    {text}
  </div>
);

/** Round MR avatar. */
export const Avatar: React.FC<{ readonly size: number }> = ({ size }) => (
  // Muhammad's photo (library/clipart/muhammad-raheel.png, already a circle with a dark backdrop)
  <Img
    src={staticFile("clipart/muhammad-raheel.png")}
    alt={BRAND.name}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      flexShrink: 0,
      display: "block",
    }}
  />
);

/** Bottom-right quiet branding: avatar + handle. */
export const BrandCorner: React.FC<{ readonly scale?: number }> = ({
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      right: 60 * scale,
      bottom: 50 * scale,
      display: "flex",
      alignItems: "center",
      gap: 12 * scale,
      opacity: 0.75,
      fontFamily: DISPLAY_FONT,
      fontSize: 20 * scale,
      fontWeight: 600,
      color: FL.text,
    }}
  >
    <Avatar size={40 * scale} />
    {BRAND.handle}
  </div>
);

/** Rounded card with an optional accent border. */
export const Card: React.FC<{
  readonly accent?: string;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ accent = FL.panelBorder, style, children }) => (
  <div
    data-fl-box="card"
    style={{
      background: FL.panel,
      border: `3px solid ${accent}`,
      borderRadius: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Overflow check (`--props='{"overflowCheck":true}'`): every Txt compares its real text bounds
 * with the card / phone it sits in (canvas bounds are check:layout's job), and logs `FL_OVERFLOW <frame> ...` to
 * the browser console when the text sticks out. pipeline/build/picture_audit.sh renders with
 * it on and lists what persists. Off in normal renders.
 */
const OVERFLOW_CHECK = (() => {
  try {
    return Boolean(
      (getInputProps() as { overflowCheck?: boolean }).overflowCheck,
    );
  } catch {
    return false;
  }
})();

const useOverflowCheck = (ref: React.RefObject<HTMLDivElement | null>) => {
  const frame = useCurrentFrame();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!OVERFLOW_CHECK || !el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const text = range.getBoundingClientRect();
    if (text.width === 0 || text.height === 0) return;
    const limits: {
      name: string;
      l: number;
      t: number;
      r: number;
      b: number;
    }[] = [];
    const box = el.parentElement?.closest("[data-fl-box]");
    // "free" = a deliberately floating label (e.g. a bobbing "?"), not a container
    if (box && box.getAttribute("data-fl-box") !== "free") {
      const r = box.getBoundingClientRect();
      const bw = parseFloat(getComputedStyle(box).borderLeftWidth) || 0;
      limits.push({
        name: box.getAttribute("data-fl-box") ?? "box",
        l: r.left + bw,
        t: r.top + bw,
        r: r.right - bw,
        b: r.bottom - bw,
      });
    }
    for (const lim of limits) {
      const over = Math.max(
        lim.l - text.left,
        text.right - lim.r,
        lim.t - text.top,
        text.bottom - lim.b,
      );
      if (over > 2)
        console.warn(
          `FL_OVERFLOW ${frame} ${lim.name} ${Math.round(over)}px "${(el.textContent ?? "").slice(0, 60)}"`,
        );
    }
  });
};

/** Text in the display font. */
export const Txt: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly weight?: number;
  readonly style?: React.CSSProperties;
  readonly children?: React.ReactNode;
}> = ({ size, color = FL.text, weight = 700, style, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useOverflowCheck(ref);
  return (
    <div
      ref={ref}
      style={{
        fontFamily: DISPLAY_FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** A phone outline; children render inside the screen. */
export const PhoneFrame: React.FC<{
  readonly width: number;
  readonly children?: React.ReactNode;
  readonly glow?: string;
}> = ({ width, children, glow }) => {
  const height = width * 2.05;
  return (
    <div
      data-fl-box="phone"
      style={{
        width,
        height,
        borderRadius: width * 0.14,
        border: `${Math.max(6, width * 0.03)}px solid #8b949e`,
        background: "#010409",
        position: "relative",
        boxShadow: glow ? `0 0 80px ${glow}` : "0 30px 80px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: width * 0.04,
          left: "50%",
          transform: "translateX(-50%)",
          width: width * 0.28,
          height: width * 0.06,
          borderRadius: width * 0.03,
          background: "#21262d",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: `${width * 0.14}px ${width * 0.07}px ${width * 0.1}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Big numbered step card: "1  CPU kis ko?" with an icon. */
export const NumberCard: React.FC<{
  readonly n: number;
  readonly at: number;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly color?: string;
  readonly width: number;
}> = ({ n, at, label, icon, color = FL.accent, width }) => (
  <Pop at={at} slide={40}>
    <Card
      accent={color}
      style={{
        width,
        height: 120,
        justifyContent: "flex-start",
        gap: 24,
        padding: "0 28px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: color,
          color: FL.bg,
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      {icon}
      <Txt size={34}>{label}</Txt>
    </Card>
  </Pop>
);

/** A dot travelling from (x1,y1) to (x2,y2) between two frames (request / data flow). */
export const FlowDot: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly color?: string;
  readonly size?: number;
  /** Keep the dot where it arrived (a pile-up); by default it vanishes once it lands. */
  readonly stay?: boolean;
}> = ({
  from,
  to,
  x1,
  y1,
  x2,
  y2,
  color = FL.highlight,
  size = 22,
  stay = false,
}) => {
  const frame = useCurrentFrame();
  const p = useBetween(from, to);
  if (frame < from || (!stay && frame > to + 6)) return null;
  const eased = 1 - Math.pow(1 - p, 3);
  return (
    <div
      style={{
        position: "absolute",
        left: x1 + (x2 - x1) * eased - size / 2,
        top: y1 + (y2 - y1) * eased - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
        boxShadow: `0 0 24px ${color}`,
      }}
    />
  );
};

/** A straight connector that draws itself between two frames. */
export const DrawLine: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly color?: string;
  readonly width?: number;
  readonly arrow?: boolean;
}> = ({
  from,
  to,
  x1,
  y1,
  x2,
  y2,
  color = FL.dim,
  width = 5,
  arrow = true,
}) => {
  const p = useBetween(from, to);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  // nothing before the line starts drawing (a zero-length round-capped line still shows a dot)
  if (p <= 0) return null;
  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
      width="100%"
      height="100%"
    >
      <line
        x1={x1}
        y1={y1}
        x2={x1 + (x2 - x1) * p}
        y2={y1 + (y2 - y1) * p}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {arrow && p > 0.98 && len > 0 ? (
        <polygon
          points={`0,0 -22,-11 -22,11`}
          fill={color}
          transform={`translate(${x2} ${y2}) rotate(${(angle * 180) / Math.PI})`}
        />
      ) : null}
    </svg>
  );
};

/**
 * The social handles (BRAND.socials): YouTube first with the channel name, then Facebook,
 * Instagram and X. `grid` puts YouTube on its own row and the other three under it (vertical cuts).
 */
export const Socials: React.FC<{
  readonly size: number;
  readonly grid?: boolean;
}> = ({ size, grid = false }) => {
  const items = [
    {
      key: "yt",
      icon: <Icon name="logos:youtube-icon" size={size * 1.1} />,
      text: `${BRAND.name} ${BRAND.socials.youtube}`,
    },
    {
      key: "fb",
      icon: <Icon name="logos:facebook" size={size} />,
      text: BRAND.socials.facebook,
    },
    {
      key: "ig",
      icon: (
        <Icon
          name="logos:instagram-icon"
          size={size}
          style={{ filter: "invert(1)" }}
        />
      ),
      text: BRAND.socials.instagram,
    },
    {
      key: "x",
      icon: (
        <Icon
          name="logos:x"
          size={size * 0.9}
          style={{ filter: "invert(1)" }}
        />
      ),
      text: BRAND.socials.x,
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: grid ? "auto auto auto" : "auto auto auto auto",
        columnGap: size * 1.1,
        rowGap: size * 0.5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {items.map((it, i) => (
        <div
          key={it.key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: size * 0.35,
            gridColumn: grid && i === 0 ? "1 / span 3" : undefined,
            justifySelf: "center",
          }}
        >
          {it.icon}
          <Txt size={size * 0.62} weight={700} style={{ whiteSpace: "nowrap" }}>
            {it.text}
          </Txt>
        </div>
      ))}
    </div>
  );
};

/**
 * The handles along the bottom of the master's stage, all video long (Muhammad, 2026-10-11):
 * YouTube with the name, Facebook, Instagram, X, small and quiet so they never compete.
 */
export const SocialBar: React.FC<{
  readonly bottom?: number;
  readonly size?: number;
}> = ({ bottom = 40, size = 26 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom,
      display: "flex",
      justifyContent: "center",
      opacity: 0.8,
    }}
  >
    <Socials size={size} />
  </div>
);

/** End card: avatar, name, byline, website, handles. */
export const EndCard: React.FC<{
  readonly at: number;
  readonly vertical?: boolean;
}> = ({ at, vertical = false }) => {
  const p = useAppear(at, 18);
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <AbsoluteFill
      style={{
        background: FL.bg,
        opacity: interpolate(p, [0, 0.5], [0, 1], {
          extrapolateRight: "clamp",
        }),
        alignItems: "center",
        justifyContent: "center",
        gap: vertical ? 40 : 28,
      }}
    >
      <Avatar size={vertical ? 220 : 160} />
      <Txt size={vertical ? 64 : 56} weight={800}>
        {BRAND.name}
      </Txt>
      <Txt size={vertical ? 34 : 30} color={FL.muted} weight={600}>
        {BRAND.byline}
      </Txt>
      <Txt
        size={vertical ? 40 : 34}
        color={FL.highlight}
        weight={700}
        style={{ marginTop: 16 }}
      >
        MCQs + short questions + notes
      </Txt>
      <Txt size={vertical ? 64 : 60} color={FL.accent} weight={800}>
        {BRAND.website}
      </Txt>
      <div style={{ marginTop: 8 }}>
        <Socials size={vertical ? 52 : 44} grid={vertical} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Shows its children only while the frame is inside [from, to), with a short crossfade in and
 * out. Scenes use absolute frames from the voice timeline, so no <Sequence> offset is needed.
 */
export const Scene: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly fade?: number;
  readonly children?: React.ReactNode;
}> = ({ from, to, fade = 8, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - fade || frame >= to + fade) return null;
  const opacity = interpolate(
    frame,
    [from - fade, from, to, to + fade],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** A one-shot ring pulse around a box (the "look here" accent). */
export const Pulse: React.FC<{
  readonly at: number;
  readonly color?: string;
  readonly radius?: number;
  readonly duration?: number;
}> = ({ at, color = FL.highlight, radius = 24, duration = 24 }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + duration) return null;
  const p = (frame - at) / duration;
  return (
    <div
      style={{
        position: "absolute",
        inset: -8 - p * 30,
        borderRadius: radius + p * 20,
        border: `5px solid ${color}`,
        opacity: 1 - p,
        pointerEvents: "none",
      }}
    />
  );
};
