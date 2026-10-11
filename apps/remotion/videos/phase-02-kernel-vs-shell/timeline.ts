import { FPS } from "../../components/faceless/theme";
import { buildTimeline } from "../../components/faceless/voice";
import { VOICE_LINES } from "./voice-lines";

/**
 * Phase 02 comes from ONE recording (pipeline/production-guide.md, section 1).
 * Master = every line in order; the Shorts are built after Muhammad approves the master.
 */
export const MASTER_IDS = VOICE_LINES.map((line) => line.id);

/** Seconds of voice gap after a line, for the meme that follows it. */
export const MEME_GAPS: Readonly<Record<string, number>> = {
  "1.1": 2.8, // "...click karte ho, ya tap karte ho" > typing at full speed (muted, type.wav)
  "1.3": 2.6, // "...pohnchti kaise hain?" > the shocked "ah?" face
  "1.6": 2.3, // "bilkul simple terms mein" > Aaiye dekhte hain, maza aayega
  "7.5": 3.3, // "Aur yahan driver tum ho" > Shabash beta, bahut badhiya
  "8.1": 2.3, // "Shell sirf black screen hoti hai" > Kuch to gadbad hai, Daya
  "10.5": 7.9, // "follow aur subscribe kar lo..." > Carry: "subscribe karo..."
};

/** End card length after the last word, seconds. */
export const END_CARD_SECONDS = 5;

export const MASTER_TIMELINE = buildTimeline(VOICE_LINES, MASTER_IDS, FPS, {
  tail: END_CARD_SECONDS + 0.4,
  extraGapAfter: MEME_GAPS,
});
