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
 * All beats MUST place elements using one of these named presets: never invent raw rects.
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

  // Faceless series, 16:9 master scenes (pipeline/, phase 1 first). One preset per scene.
  flHook: {
    user: { x: 260, y: 360, w: 400, h: 360 },
    phone: { x: 780, y: 150, w: 360, h: 740 },
    counter: { x: 1220, y: 360, w: 480, h: 280 },
    steps: { x: 1220, y: 690, w: 480, h: 200 },
  },
  flProblem: {
    apps: { x: 140, y: 200, w: 440, h: 720 },
    links: { x: 600, y: 200, w: 700, h: 720 },
    resources: { x: 1320, y: 200, w: 460, h: 720 },
  },
  flAnswer: {
    band: { x: 260, y: 140, w: 1400, h: 150 },
    definition: { x: 260, y: 330, w: 1400, h: 320 },
    logos: { x: 260, y: 690, w: 1400, h: 240 },
  },
  flTraffic: {
    road: { x: 100, y: 150, w: 820, h: 820 },
    decisions: { x: 980, y: 160, w: 860, h: 600 },
    timebar: { x: 980, y: 790, w: 860, h: 180 },
  },
  /** Beat 4.1 book card, shown before the crossroad (separate preset, over flTraffic). */
  flTrafficBook: {
    card: { x: 160, y: 300, w: 1600, h: 480 },
  },
  /** Beat 4.9 example; replaces flTraffic.decisions + timebar (separate preset, same area). */
  flTrafficExample: {
    phone: { x: 1010, y: 190, w: 330, h: 680 },
    status: { x: 1400, y: 260, w: 440, h: 560 },
  },
  flTranslator: {
    header: { x: 160, y: 140, w: 1600, h: 120 },
    keyboard: { x: 160, y: 340, w: 420, h: 420 },
    os: { x: 750, y: 340, w: 420, h: 420 },
    monitor: { x: 1340, y: 340, w: 420, h: 420 },
    bits: { x: 460, y: 800, w: 1000, h: 140 },
  },
  flUsers: {
    userA: { x: 140, y: 180, w: 520, h: 300 },
    computer: { x: 760, y: 300, w: 400, h: 400 },
    userB: { x: 1260, y: 180, w: 520, h: 300 },
    denied: { x: 140, y: 560, w: 520, h: 160 },
    userC: { x: 700, y: 760, w: 520, h: 240 },
  },
  flTap: {
    phone: { x: 100, y: 170, w: 340, h: 720 },
    steps: { x: 500, y: 300, w: 1360, h: 420 },
    caption: { x: 500, y: 780, w: 1360, h: 140 },
  },
  flMistake: {
    title: { x: 140, y: 130, w: 1640, h: 110 },
    logos: { x: 140, y: 290, w: 600, h: 640 },
    apps: { x: 860, y: 290, w: 920, h: 240 },
    links: { x: 860, y: 540, w: 920, h: 120 },
    os: { x: 860, y: 670, w: 920, h: 260 },
  },
  // ---- phase 02 (Kernel vs Shell)
  p2Hook: {
    inputs: { x: 140, y: 190, w: 400, h: 700 },
    os: { x: 620, y: 160, w: 680, h: 520 },
    hardware: { x: 620, y: 720, w: 680, h: 180 },
    side: { x: 1380, y: 190, w: 400, h: 700 },
  },
  p2Os: {
    user: { x: 140, y: 300, w: 300, h: 460 },
    os: { x: 520, y: 150, w: 880, h: 780 },
    hardware: { x: 1480, y: 250, w: 300, h: 560 },
  },
  p2Kernel: {
    left: { x: 140, y: 190, w: 420, h: 480 },
    core: { x: 640, y: 170, w: 640, h: 500 },
    right: { x: 1360, y: 190, w: 420, h: 480 },
    quote: { x: 200, y: 720, w: 1520, h: 200 },
  },
  p2Shell: {
    ring: { x: 140, y: 160, w: 720, h: 580 },
    types: { x: 940, y: 160, w: 840, h: 580 },
    quote: { x: 200, y: 780, w: 1520, h: 160 },
  },
  p2Path: {
    file: { x: 110, y: 300, w: 260, h: 360 },
    os: { x: 430, y: 200, w: 560, h: 560 },
    hw: { x: 1050, y: 200, w: 340, h: 560 },
    screen: { x: 1450, y: 240, w: 360, h: 480 },
    caption: { x: 200, y: 800, w: 1520, h: 140 },
  },
  p2Diagram: {
    user: { x: 660, y: 130, w: 600, h: 160 },
    os: { x: 560, y: 320, w: 800, h: 400 },
    hw: { x: 660, y: 750, w: 600, h: 180 },
    caption: { x: 1400, y: 830, w: 400, h: 90 },
  },
  p2Car: {
    car: { x: 140, y: 200, w: 740, h: 600 },
    engine: { x: 960, y: 170, w: 820, h: 320 },
    dash: { x: 960, y: 530, w: 820, h: 320 },
  },
  p2Mistake: {
    title: { x: 140, y: 130, w: 1640, h: 110 },
    terminal: { x: 180, y: 290, w: 740, h: 560 },
    desktop: { x: 1000, y: 290, w: 740, h: 560 },
  },
  p2End: {
    question: { x: 260, y: 120, w: 1400, h: 200 },
    web: { x: 260, y: 345, w: 1400, h: 130 },
    next: { x: 260, y: 500, w: 1400, h: 110 },
    series: { x: 260, y: 635, w: 1400, h: 170 },
    follow: { x: 260, y: 830, w: 1400, h: 120 },
  },
  flRecap: {
    card: { x: 460, y: 130, w: 1000, h: 840 },
  },
  flEnd: {
    question: { x: 260, y: 150, w: 1400, h: 280 },
    next: { x: 260, y: 470, w: 1400, h: 160 },
    cta: { x: 260, y: 670, w: 1400, h: 300 },
  },
} as const;

/**
 * 9:16 presets (1080 x 1920) for the faceless Shorts, one per platform (production guide,
 * section 8). `npm run check:layout` validates them against the portrait canvas. The stage and
 * captions are centred on the canvas (Muhammad, 2026-10-11); text and key content stay inside
 * each platform's safe area (measured margins, 2026: YouTube Shorts top
 * ~240 / bottom ~380 / right ~200, Reels bottom ~320 / right ~130 and a 4:5 feed crop of
 * y 285..1635, TikTok top ~200 / bottom ~370 to 480 / right ~165). `strip` is the protected
 * band under the platform UI: it gets moving decoration, never blank grid only.
 */
export const PORTRAIT_CANVAS = { w: 1080, h: 1920 } as const;

export const LAYOUT_PORTRAIT = {
  flShorts: {
    tag: { x: 120, y: 250, w: 840, h: 70 },
    stage: { x: 120, y: 340, w: 840, h: 840 },
    caption: { x: 140, y: 1200, w: 800, h: 220 },
    strip: { x: 0, y: 1460, w: 1080, h: 460 },
  },
  flReels: {
    tag: { x: 100, y: 240, w: 880, h: 70 },
    stage: { x: 100, y: 330, w: 880, h: 880 },
    caption: { x: 130, y: 1230, w: 820, h: 220 },
    strip: { x: 0, y: 1490, w: 1080, h: 430 },
  },
  flTiktok: {
    tag: { x: 120, y: 200, w: 840, h: 70 },
    stage: { x: 120, y: 290, w: 840, h: 840 },
    caption: { x: 140, y: 1150, w: 800, h: 220 },
    strip: { x: 0, y: 1410, w: 1080, h: 510 },
  },
  flFbReels: {
    tag: { x: 100, y: 240, w: 880, h: 70 },
    stage: { x: 100, y: 330, w: 880, h: 880 },
    caption: { x: 130, y: 1230, w: 820, h: 220 },
    strip: { x: 0, y: 1490, w: 1080, h: 430 },
  },
} as const;

/** 4:5 presets (1080 x 1350) for the feed cut (X, Facebook feed, LinkedIn): no platform buttons. */
export const FEED_CANVAS = { w: 1080, h: 1350 } as const;

export const LAYOUT_FEED = {
  flFeed: {
    tag: { x: 60, y: 40, w: 960, h: 60 },
    stage: { x: 90, y: 110, w: 900, h: 820 },
    caption: { x: 90, y: 950, w: 900, h: 220 },
    strip: { x: 0, y: 1200, w: 1080, h: 150 },
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
