/**
 * OBS webcam safe zone on the right edge of the slide canvas.
 *
 * DISABLED 2026-10-04: Muhammad now places the webcam himself in his OBS
 * window, so slides use the full canvas width. To reserve the right 10% for
 * the webcam again, swap the two lines below (192 = 10% of 1920).
 *
 * Used by SlideLayout, HeroSlide, and the slide chrome in SlideDeck.
 */
// export const SAFE_ZONE_RIGHT = 192;
export const SAFE_ZONE_RIGHT = 0;

/**
 * Width the webcam zone used to take, now handed back to centred content.
 * Wide callout cards with a fixed maxWidth (quiz cards, TIDBIT / DO YOU KNOW
 * boxes) add this so their side gaps stay the same as before. 0 when the
 * safe zone is switched back on, which restores their original widths.
 */
export const FREED_WIDTH = 192 - SAFE_ZONE_RIGHT;
