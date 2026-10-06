/**
 * Slide themes: ONE place for every colour palette, and for which chapter uses which.
 *
 * - Each theme maps the same token roles to CSS custom properties on <html>, so a
 *   deck never hardcodes colours: it uses var(--accent), var(--sync), etc.
 * - CHAPTER_THEMES picks the theme per chapter. Muhammad chooses the theme before a
 *   new chapter starts (RUNBOOK R-L), and it is set here, nowhere else.
 * - `?theme=<id>` in the URL previews any deck in any theme without changing this file.
 *
 * Palettes are copied from each theme's official source (links in `source`).
 * Token roles:
 *   accent    primary brand colour, headings, main highlight
 *   sync      success, correct answers
 *   microtask BEYOND THE BOOK, Tid-Bytes
 *   task      emphasis
 *   api       secondary highlight, DO YOU KNOW
 *   warn      warnings, errors
 *   onAccent  dark text placed ON a coloured badge
 *   codeBg    background of code blocks
 *   syn*      Python / SQL syntax colours inside code blocks
 */

export type ThemeTokens = {
  bg: string;
  bgGradientStop: string;
  panel: string;
  panelElevated: string;
  panelBorder: string;
  text: string;
  textStrong: string;
  muted: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  sync: string;
  microtask: string;
  task: string;
  api: string;
  loop: string;
  warn: string;
  onAccent: string;
  codeBg: string;
  synKeyword: string;
  synString: string;
  synFunction: string;
  synNumber: string;
  synBuiltin: string;
  synComment: string;
  fontDisplay: string;
};

export type Theme = {
  id: ThemeId;
  name: string;
  /** one line: what it looks like and why it is popular */
  blurb: string;
  source: string;
  tokens: ThemeTokens;
};

const INTER = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const SPACE_GROTESK = '"Space Grotesk", Inter, system-ui, sans-serif';

export const THEME_IDS = [
  "default",
  "horizon",
  "github-dark",
  "one-dark",
  "catppuccin-mocha",
  "tokyo-night",
  "gruvbox",
  "nord",
  "everforest",
] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const THEMES: Record<ThemeId, Theme> = {
  default: {
    id: "default",
    name: "Default",
    blurb: "GitHub-dark base used by non-curriculum decks like the event loop.",
    source: "apps/slides/index.html :root",
    tokens: {
      bg: "#0d1117",
      bgGradientStop: "transparent",
      panel: "#161b22",
      panelElevated: "#1c232d",
      panelBorder: "#30363d",
      text: "#c9d1d9",
      textStrong: "#ffffff",
      muted: "#8b949e",
      accent: "#58a6ff",
      accentSoft: "rgba(88, 166, 255, 0.12)",
      accentStrong: "#388bfd",
      sync: "#3fb950",
      microtask: "#d2a8ff",
      task: "#f0883e",
      api: "#f778ba",
      loop: "#58a6ff",
      warn: "#f0883e",
      onAccent: "#0d1117",
      codeBg: "#0d1117",
      synKeyword: "#ff7b72",
      synString: "#a5d6ff",
      synFunction: "#d2a8ff",
      synNumber: "#79c0ff",
      synBuiltin: "#79c0ff",
      synComment: "#8b949e",
      fontDisplay: INTER,
    },
  },

  horizon: {
    id: "horizon",
    name: "Horizon",
    blurb: "Deep navy with electric cyan and warm amber. Energetic. Class 10 Ch1.",
    source: "custom (bytemotion)",
    tokens: {
      bg: "#0a1020",
      bgGradientStop: "rgba(76, 201, 255, 0.06)",
      panel: "#121a2e",
      panelElevated: "#1a2340",
      panelBorder: "#273255",
      text: "#eaf0fb",
      textStrong: "#ffffff",
      muted: "#8c9ab9",
      accent: "#4cc9ff",
      accentSoft: "rgba(76, 201, 255, 0.14)",
      accentStrong: "#22b8f0",
      sync: "#4ade80",
      microtask: "#ffc14d",
      task: "#f472b6",
      api: "#a78bfa",
      loop: "#4cc9ff",
      warn: "#fb7185",
      onAccent: "#0a0e14",
      codeBg: "#070c18",
      synKeyword: "#f472b6",
      synString: "#4ade80",
      synFunction: "#4cc9ff",
      synNumber: "#ffc14d",
      synBuiltin: "#a78bfa",
      synComment: "#8c9ab9",
      fontDisplay: SPACE_GROTESK,
    },
  },

  "github-dark": {
    id: "github-dark",
    name: "GitHub Dark",
    blurb: "GitHub's own dark mode. Near-black, grey panels, blue. Calm and familiar.",
    source: "https://primer.style/foundations/color",
    tokens: {
      bg: "#0d1117",
      bgGradientStop: "transparent",
      panel: "#161b22",
      panelElevated: "#21262d",
      panelBorder: "#30363d",
      text: "#e6edf3",
      textStrong: "#ffffff",
      muted: "#8b949e",
      accent: "#58a6ff",
      accentSoft: "rgba(88, 166, 255, 0.15)",
      accentStrong: "#1f6feb",
      sync: "#3fb950",
      microtask: "#ffa657",
      task: "#f778ba",
      api: "#d29922",
      loop: "#58a6ff",
      warn: "#ff7b72",
      onAccent: "#0d1117",
      codeBg: "#0d1117",
      synKeyword: "#ff7b72",
      synString: "#a5d6ff",
      synFunction: "#d2a8ff",
      synNumber: "#79c0ff",
      synBuiltin: "#79c0ff",
      synComment: "#8b949e",
      fontDisplay: INTER,
    },
  },

  "one-dark": {
    id: "one-dark",
    name: "One Dark Pro",
    blurb: "Most downloaded VS Code theme. Soft charcoal grey with clear, friendly colours.",
    source: "https://github.com/Binaryify/OneDark-Pro",
    tokens: {
      bg: "#282c34",
      bgGradientStop: "transparent",
      panel: "#21252b",
      panelElevated: "#2c313a",
      panelBorder: "#3e4452",
      // Brightened from the editor foreground (#abb2bf / #7f848e) so slide text
      // stays readable on a projector or a phone screen.
      text: "#d7dae0",
      textStrong: "#ffffff",
      muted: "#9da5b4",
      accent: "#61afef",
      accentSoft: "rgba(97, 175, 239, 0.15)",
      accentStrong: "#4d9de0",
      sync: "#98c379",
      microtask: "#d19a66",
      task: "#c678dd",
      api: "#e5c07b",
      loop: "#56b6c2",
      warn: "#e06c75",
      onAccent: "#21252b",
      codeBg: "#21252b",
      synKeyword: "#c678dd",
      synString: "#98c379",
      synFunction: "#61afef",
      synNumber: "#d19a66",
      synBuiltin: "#56b6c2",
      // Lightened from the official colour to pass WCAG AA (4.5:1) on slide panels.
      synComment: "#898e97",
      fontDisplay: INTER,
    },
  },

  "catppuccin-mocha": {
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    blurb: "No.1 trending editor theme. Cosy pastels on a soft dark base (slight cool tint).",
    source: "https://github.com/catppuccin/palette",
    tokens: {
      bg: "#1e1e2e",
      bgGradientStop: "transparent",
      panel: "#181825",
      panelElevated: "#313244",
      panelBorder: "#45475a",
      text: "#cdd6f4",
      textStrong: "#ffffff",
      muted: "#a6adc8",
      accent: "#89b4fa",
      accentSoft: "rgba(137, 180, 250, 0.15)",
      accentStrong: "#74c7ec",
      sync: "#a6e3a1",
      microtask: "#fab387",
      task: "#f5c2e7",
      api: "#f9e2af",
      loop: "#94e2d5",
      warn: "#f38ba8",
      onAccent: "#11111b",
      codeBg: "#11111b",
      synKeyword: "#cba6f7",
      synString: "#a6e3a1",
      synFunction: "#89b4fa",
      synNumber: "#fab387",
      synBuiltin: "#f38ba8",
      synComment: "#9399b2",
      fontDisplay: INTER,
    },
  },

  "tokyo-night": {
    id: "tokyo-night",
    name: "Tokyo Night Storm",
    blurb: "No.2 trending. City-at-night slate blue with neon-soft accents.",
    source: "https://github.com/folke/tokyonight.nvim (storm)",
    tokens: {
      bg: "#24283b",
      bgGradientStop: "transparent",
      panel: "#1f2335",
      panelElevated: "#292e42",
      panelBorder: "#3b4261",
      text: "#c0caf5",
      textStrong: "#ffffff",
      muted: "#a9b1d6",
      accent: "#7aa2f7",
      accentSoft: "rgba(122, 162, 247, 0.15)",
      accentStrong: "#3d59a1",
      sync: "#9ece6a",
      microtask: "#ff9e64",
      task: "#bb9af7",
      api: "#e0af68",
      loop: "#7dcfff",
      warn: "#f7768e",
      onAccent: "#1b1e2d",
      codeBg: "#1b1e2d",
      synKeyword: "#bb9af7",
      synString: "#9ece6a",
      synFunction: "#7aa2f7",
      synNumber: "#ff9e64",
      synBuiltin: "#2ac3de",
      // Lightened from the official colour to pass WCAG AA (4.5:1) on slide panels.
      synComment: "#8187ab",
      fontDisplay: INTER,
    },
  },

  gruvbox: {
    id: "gruvbox",
    name: "Gruvbox Dark",
    blurb: "Warm retro classic. Brown-grey paper tones with yellow and orange. Very human.",
    source: "https://github.com/morhetz/gruvbox",
    tokens: {
      bg: "#282828",
      bgGradientStop: "transparent",
      // Cards use dark0_hard so small coloured labels pass WCAG AA.
      panel: "#1d2021",
      panelElevated: "#3c3836",
      panelBorder: "#504945",
      text: "#ebdbb2",
      textStrong: "#fbf1c7",
      muted: "#a89984",
      accent: "#fabd2f",
      accentSoft: "rgba(250, 189, 47, 0.15)",
      accentStrong: "#d79921",
      sync: "#b8bb26",
      microtask: "#fe8019",
      task: "#d3869b",
      api: "#83a598",
      loop: "#8ec07c",
      warn: "#fb4934",
      onAccent: "#1d2021",
      // Derived: a step darker than dark0_hard so code blocks stand out from cards.
      codeBg: "#181a1b",
      synKeyword: "#fb4934",
      synString: "#b8bb26",
      synFunction: "#8ec07c",
      synNumber: "#d3869b",
      synBuiltin: "#fe8019",
      // light4 instead of gray_245 so comments pass WCAG AA.
      synComment: "#a89984",
      fontDisplay: INTER,
    },
  },

  nord: {
    id: "nord",
    name: "Nord",
    blurb: "Arctic, north-bluish calm. Cool grey-blue with frosty accents. Easy on the eyes.",
    source: "https://www.nordtheme.com/docs/colors-and-palettes",
    tokens: {
      bg: "#2e3440",
      bgGradientStop: "transparent",
      // Derived: darker than nord0 so Aurora colours pass WCAG AA on cards.
      panel: "#272c36",
      panelElevated: "#3b4252",
      panelBorder: "#4c566a",
      text: "#e5e9f0",
      textStrong: "#eceff4",
      // Derived: nord4 (#d8dee9) dimmed toward nord0 so it reads as secondary text.
      muted: "#aeb6c4",
      accent: "#88c0d0",
      accentSoft: "rgba(136, 192, 208, 0.15)",
      accentStrong: "#5e81ac",
      sync: "#a3be8c",
      // nord12 lightened to pass WCAG AA (official #d08770).
      microtask: "#d28c76",
      // nord15 lightened to pass WCAG AA (official #b48ead).
      task: "#b793b0",
      api: "#ebcb8b",
      loop: "#8fbcbb",
      // nord11 lightened to pass WCAG AA (official #bf616a).
      warn: "#d18d94",
      onAccent: "#2e3440",
      // Derived: a step darker than the cards for inset code blocks.
      codeBg: "#22262e",
      synKeyword: "#81a1c1",
      synString: "#a3be8c",
      synFunction: "#88c0d0",
      synNumber: "#b48ead",
      synBuiltin: "#8fbcbb",
      // Lightened from the official colour to pass WCAG AA (4.5:1) on slide panels.
      synComment: "#969faf",
      fontDisplay: INTER,
    },
  },

  everforest: {
    id: "everforest",
    name: "Everforest",
    blurb: "Forest greens on a soft dark green-grey. Natural, warm, low eye strain.",
    source: "https://github.com/sainnhe/everforest (dark, medium)",
    tokens: {
      bg: "#2d353b",
      bgGradientStop: "transparent",
      // Cards use bg_dim so small coloured labels pass WCAG AA.
      panel: "#232a2e",
      panelElevated: "#3d484d",
      panelBorder: "#475258",
      text: "#d3c6aa",
      textStrong: "#fdf6e3",
      muted: "#9da9a0",
      accent: "#a7c080",
      accentSoft: "rgba(167, 192, 128, 0.15)",
      accentStrong: "#83c092",
      sync: "#83c092",
      microtask: "#e69875",
      task: "#d699b6",
      api: "#dbbc7f",
      loop: "#7fbbb3",
      warn: "#e67e80",
      onAccent: "#232a2e",
      // Derived: a step darker than bg_dim so code blocks stand out from cards.
      codeBg: "#1e2326",
      synKeyword: "#e67e80",
      synString: "#83c092",
      synFunction: "#a7c080",
      synNumber: "#d699b6",
      synBuiltin: "#7fbbb3",
      // Lightened from the official colour to pass WCAG AA (4.5:1) on slide panels.
      synComment: "#87948b",
      fontDisplay: INTER,
    },
  },
};

/**
 * Theme per chapter, keyed by the deck-ID prefix `class-<N>-ch<M>`.
 * Ask Muhammad which theme to use BEFORE starting a new chapter (RUNBOOK R-L),
 * then add one line here.
 */
export const CHAPTER_THEMES: Record<string, ThemeId> = {
  "class-10-ch1": "horizon",
  "class-12-ch4": "github-dark",
};

const CSS_VARS: Record<keyof ThemeTokens, string> = {
  bg: "--bg",
  bgGradientStop: "--bg-gradient-stop",
  panel: "--panel",
  panelElevated: "--panel-elevated",
  panelBorder: "--panel-border",
  text: "--text",
  textStrong: "--text-strong",
  muted: "--muted",
  accent: "--accent",
  accentSoft: "--accent-soft",
  accentStrong: "--accent-strong",
  sync: "--sync",
  microtask: "--microtask",
  task: "--task",
  api: "--api",
  loop: "--loop",
  warn: "--warn",
  onAccent: "--on-accent",
  codeBg: "--code-bg",
  synKeyword: "--syn-keyword",
  synString: "--syn-string",
  synFunction: "--syn-function",
  synNumber: "--syn-number",
  synBuiltin: "--syn-builtin",
  synComment: "--syn-comment",
  fontDisplay: "--font-display",
};

export const isThemeId = (v: string | null | undefined): v is ThemeId =>
  !!v && (THEME_IDS as readonly string[]).includes(v);

/** `class-12-ch4-t4.1a-tkinter-intro` → `class-12-ch4` (null for non-chapter decks). */
export const chapterKeyOf = (deckId: string): string | null =>
  deckId.match(/^(class-\d+-ch\d+)-/)?.[1] ?? null;

/** Theme a deck uses when no `?theme=` preview is active. */
export const chapterThemeFor = (deckId: string, deckTheme?: ThemeId): ThemeId => {
  if (deckTheme) return deckTheme;
  const key = chapterKeyOf(deckId);
  return (key && CHAPTER_THEMES[key]) || "default";
};

/** Write every token of `id` onto <html> as CSS custom properties. */
export function applyTheme(id: ThemeId): void {
  const style = document.documentElement.style;
  const tokens = THEMES[id].tokens;
  (Object.keys(CSS_VARS) as (keyof ThemeTokens)[]).forEach((k) => {
    style.setProperty(CSS_VARS[k], tokens[k]);
  });
  document.documentElement.setAttribute("data-theme", id);
}
