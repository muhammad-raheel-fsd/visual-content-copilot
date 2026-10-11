import { loadFont } from "@remotion/google-fonts/Poppins";

/**
 * Look of the faceless lecture series (pipeline/production-guide.md, section 7): GitHub dark
 * (Muhammad, 2026-10-10: no bluish backgrounds). accent = the concept being taught (the OS in
 * phase 1), highlight = question / emphasis, red = conflict, green = success. Shared by every
 * phase so the channel looks like one brand.
 */
export const { fontFamily: DISPLAY_FONT } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "600", "700", "800"],
});

export const FL = {
  bg: "#0d1117",
  panel: "#161b22",
  panelBorder: "#30363d",
  text: "#e6edf3",
  muted: "#8b949e",
  dim: "#6e7681",
  accent: "#58a6ff",
  accentSoft: "rgba(88, 166, 255, 0.14)",
  highlight: "#d29922",
  highlightSoft: "rgba(210, 153, 34, 0.16)",
  red: "#f85149",
  redSoft: "rgba(248, 81, 73, 0.16)",
  green: "#3fb950",
  blue: "#79c0ff",
  purple: "#bc8cff",
} as const;

/** Brand values (pipeline/production-guide.md, section 5). Channel: Conceptoscope (2026-10-11). */
export const BRAND = {
  /** the channel / brand (decided 2026-10-11: thoughts/research/2026-10-09-brand-name-candidates.md) */
  channel: "Conceptoscope",
  name: "Muhammad Raheel",
  initials: "MR",
  byline: "Full Stack Developer · AI Engineer",
  website: "conceptoscope.com",
  handle: "@conceptoscope",
  /** shown on the end cards and the bottom bar: YouTube with the name, then Facebook, Instagram, X */
  socials: {
    youtube: "@conceptoscope",
    facebook: "conceptoscope",
    instagram: "@conceptoscope",
    x: "@conceptoscope",
  },
} as const;

export const FPS = 30;

/** Sound effects gain for the faceless videos (Muhammad, 2026-10-11: "increase them a bit", +3 dB). */
export const SFX_GAIN = 1.4;
