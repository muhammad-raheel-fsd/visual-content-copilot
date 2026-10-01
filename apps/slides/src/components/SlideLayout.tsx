import type { CSSProperties, ReactNode } from "react";


/**
 * Standard slide layout with title + subtitle + content area.
 * Consistent chrome across all slides.
 */
export const SlideLayout: React.FC<{
  title?: string;
  subtitle?: ReactNode;
  accent?: string;
  children?: ReactNode;
  style?: CSSProperties;
}> = ({ title, subtitle, accent = "var(--accent)", children, style }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        // Right padding = 80 (regular) + 192 (SAFE_ZONE_RIGHT for OBS webcam).
        padding: "60px 272px 60px 80px",
        color: "var(--text)",
        ...style,
      }}
    >
      {title ? (
        <header style={{ marginBottom: 40 }}>
          <div
            style={{
              width: 60,
              height: 4,
              backgroundColor: accent,
              borderRadius: 2,
              marginBottom: 20,
            }}
          />
          <h1
            style={{
              margin: 0,
              fontSize: 64,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              color: "var(--text-strong, var(--text))",
              fontFamily: "var(--font-display)",
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <div style={{ marginTop: 12, fontSize: 26, color: "var(--muted)" }}>
              {subtitle}
            </div>
          ) : null}
        </header>
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
};

/** Hero-style centered slide: giant text, personal brand byline, optional avatar. */
export const HeroSlide: React.FC<{
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: string;
}> = ({ title, subtitle, accent = "var(--accent)" }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // Match SlideLayout: top 90 / bottom 78 (chrome) + right 272 (safe zone).
        padding: "90px 272px 78px 80px",
        textAlign: "center",
      }}
    >
      <PresenterByline accent={accent} />
      <div
        style={{
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -2.5,
          lineHeight: 1.05,
          fontFamily: "var(--font-display)",
          color: "var(--text-strong, var(--text))",
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div style={{ marginTop: 32, fontSize: 32, color: "var(--muted)", maxWidth: 1200 }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
};

/**
 * Personal byline shown on hero slides: Muhammad Raheel + titles + avatar.
 * Avatar tries /clipart/muhammad-raheel.jpg from the library; falls back to
 * "MR" initials on a gradient if the photo is not there yet.
 */
export const PresenterByline: React.FC<{ accent?: string; size?: "sm" | "md" | "lg" }> = ({
  accent = "var(--accent)",
  size = "md",
}) => {
  const avatarSize = size === "sm" ? 44 : size === "lg" ? 96 : 64;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        marginBottom: 30,
        padding: "12px 22px 12px 12px",
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Avatar size={avatarSize} accent={accent} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>
          Muhammad Raheel
        </div>
        <div
          style={{
            fontSize: 13,
            letterSpacing: 2,
            color: accent,
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          FULL STACK DEV · AI ENGINEER
        </div>
      </div>
    </div>
  );
};

const Avatar: React.FC<{ size: number; accent: string }> = ({ size, accent }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 20px ${accent}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        background: `linear-gradient(135deg, ${accent}55, var(--panel))`,
        position: "relative",
      }}
    >
      <img
        src="/clipart/muhammad-raheel.jpg"
        alt="Muhammad Raheel"
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span
        style={{
          fontSize: size * 0.36,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: 1,
        }}
      >
        MR
      </span>
    </div>
  );
};

/** Two-column split (code left, output right). */
export const SplitSlide: React.FC<{
  left: ReactNode;
  right: ReactNode;
  ratio?: "1:1" | "3:2" | "2:3";
}> = ({ left, right, ratio = "1:1" }) => {
  const grid = ratio === "3:2" ? "3fr 2fr" : ratio === "2:3" ? "2fr 3fr" : "1fr 1fr";
  return (
    <div style={{ display: "grid", gridTemplateColumns: grid, gap: 40, height: "100%" }}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
};

/** Card container with soft glow (matches the video's Panel aesthetic). */
export const Card: React.FC<{
  title?: string;
  accent?: string;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ title, accent = "var(--accent)", children, style }) => {
  return (
    <div
      style={{
        backgroundColor: "var(--panel)",
        border: `1px solid var(--panel-border)`,
        borderRadius: 16,
        padding: 32,
        boxShadow: `0 0 40px 0 ${accent}22`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 16,
            color: "var(--muted)",
            letterSpacing: 3,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {title.toUpperCase()}
        </div>
      ) : null}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
};
