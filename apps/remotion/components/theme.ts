/**
 * Single source of truth for layout coordinates and colors.
 * All beats place Panel/Region components using LAYOUT presets defined here
 * so that overlap is impossible by design (validated by `npm run check:layout`).
 */

export const CANVAS = { w: 1920, h: 1080 } as const;

/**
 * OBS webcam safe zone on the right edge of the canvas.
 *
 * DISABLED 2026-10-04: Muhammad now places the webcam himself in his OBS
 * window, so videos use the full 1920 width. While it was on, nothing
 * (Panel, Region, TitleCard, Reveal, arrow, chip) could pass x = 1728.
 * To bring it back: swap the two SAFE_ZONE_RIGHT lines below, restore the
 * commented "webcam-safe" LAYOUT presets, and set SAFE_ZONE_RIGHT = 192 in
 * library/scripts/remotion/check-layout.mjs.
 */
// export const SAFE_ZONE_RIGHT = 192;
export const SAFE_ZONE_RIGHT = 0;
export const CONTENT_MAX_X = CANVAS.w - SAFE_ZONE_RIGHT; // 1920 now (was 1728)

export const COLORS = {
  bg: "#0d1117",
  panel: "#161b22",
  panelBorder: "#30363d",
  panelHeaderBg: "#1c2128",
  text: "#c9d1d9",
  muted: "#8b949e",
  dim: "#6e7681",

  // syntax
  keyword: "#ff7b72",
  fn: "#d2a8ff",
  string: "#a5d6ff",
  number: "#79c0ff",
  comment: "#8b949e",

  // categorical (used consistently across beats)
  sync: "#3fb950",
  microtask: "#d2a8ff",
  task: "#f0883e",
  api: "#f778ba",
  loop: "#58a6ff",
  accent: "#58a6ff",
  warn: "#f0883e",
  ok: "#3fb950",

  highlightBg: "rgba(88, 166, 255, 0.14)",
} as const;

export type Rect = { x: number; y: number; w: number; h: number };

/**
 * Layout regions in canvas pixel coordinates.
 * All beats MUST place elements using one of these named presets — never invent raw rects.
 * `npm run check:layout` validates that no two rects within a preset overlap.
 */
export const LAYOUT = {
  title: { y: 60, height: 100 },
  reveal: { y: 990, height: 80 },
  contentTop: 200,
  contentBottom: 970,

  // Two-column layout (used by Beats 1, 2). 40px gap between columns.
  // Full width: 80px margin on both sides, right column ends at x=1840.
  // Webcam-safe version (right column ended at x=1720):
  //   left: { x: 80, y: 200, w: 800, h: 760 },  right: { x: 920, y: 200, w: 800, h: 760 },
  twoCol: {
    left: { x: 80, y: 200, w: 860, h: 760 },
    right: { x: 980, y: 200, w: 860, h: 760 },
  },

  // Two-column with right side split vertically (used by Beat 3).
  // Webcam-safe version:
  //   left: { x: 80, y: 200, w: 800, h: 760 },
  //   rightTop: { x: 920, y: 200, w: 800, h: 400 },  rightBottom: { x: 920, y: 620, w: 800, h: 340 },
  twoColSplitRight: {
    left: { x: 80, y: 200, w: 860, h: 760 },
    rightTop: { x: 980, y: 200, w: 860, h: 400 },
    rightBottom: { x: 980, y: 620, w: 860, h: 340 },
  },

  // Event-loop scene layout (Beats 4, 5).
  // 3 columns: stack (left, narrow), loop+webApi+console (middle), queues (right).
  scene: {
    stack: { x: 80, y: 200, w: 340, h: 760 },
    webApi: { x: 460, y: 200, w: 260, h: 200 },
    loop: { x: 460, y: 460, w: 260, h: 280 },
    console: { x: 460, y: 800, w: 260, h: 160 },
    // Queues take the freed width: end at x=1840 (webcam-safe version had w: 960, ending at 1720).
    microtaskQueue: { x: 760, y: 200, w: 1080, h: 350 },
    taskQueue: { x: 760, y: 590, w: 1080, h: 370 },
  },
} as const;

/** Panel chrome measurements (matches Panel.tsx). */
export const PANEL = {
  headerHeight: 52,
  paddingX: 32,
  paddingY: 28,
  radius: 12,
} as const;

/** Code block metrics. */
export const CODE = {
  fontSize: 24,
  lineHeight: 44, // ~fontSize * 1.83
} as const;

/** Console block metrics. */
export const CONSOLE_METRICS = {
  fontSize: 30,
  lineHeight: 56,
} as const;

/**
 * Returns the y-coordinate at the vertical center of a code line
 * inside a panel positioned at panelY.
 */
export const codeLineY = (panelY: number, lineIndex: number): number =>
  panelY + PANEL.headerHeight + PANEL.paddingY + lineIndex * CODE.lineHeight + CODE.lineHeight / 2;

/**
 * Returns the y-coordinate at the vertical center of a console line
 * inside a panel positioned at panelY.
 */
export const consoleLineY = (panelY: number, lineIndex: number): number =>
  panelY +
  PANEL.headerHeight +
  PANEL.paddingY +
  lineIndex * CONSOLE_METRICS.lineHeight +
  CONSOLE_METRICS.lineHeight / 2;

/** Center of a rectangle. */
export const centerOf = (r: { x: number; y: number; w: number; h: number }): {
  x: number;
  y: number;
} => ({
  x: r.x + r.w / 2,
  y: r.y + r.h / 2,
});
