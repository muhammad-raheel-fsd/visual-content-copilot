import { FPS } from "../../components/faceless/theme";
import { buildTimeline } from "../../components/faceless/voice";
import { VOICE_LINES } from "./voice-lines";

/**
 * Both videos come from the ONE recording (pipeline/production-guide.md, section 1).
 * Master = every line in order. Short = the cut list in the phase file, section 4.
 */
export const MASTER_IDS = VOICE_LINES.map((line) => line.id);

/** One complete idea: question > answer > the traffic controller and its 3 decisions > takeaway > next topic + follow. */
export const SHORT_IDS = [
  "1.1",
  "1.2",
  "3.1",
  "4.1",
  "4.2",
  "4.3",
  "4.4",
  "4.5",
  "4.6",
  "4.7",
  "10.3",
  "10.4",
];

/** Seconds of voice gap after a line, for the meme that follows it. */
export const MEME_GAPS: Readonly<Record<string, number>> = {
  "1.2": 3.0, // "kabhi socha hai in sab ko control kaun karta hai?" > Bas hawa nikal gayi
  "1.4": 2.7, // "bilkul simple terms mein" > Abhi maza aayega na bhidu
  "4.9": 3.3, // "Smooth, right?" > Shabash beta, bahut badhiya
  "7.6": 5.0, // "superpowers activate" > Goku, with Carry: "Raja ji apni shaktiyon ka poora istemaal..."
  "8.1": 2.3, // "Windows ya Android bhi bas ek app hai" > Kuch to gadbad hai Daya
  "10.4": 7.9, // "Follow aur subscribe kar lo" > Carry: "subscribe karo, woh jo laal wala button hai..."
};

/** End card length after the last word, seconds. */
export const END_CARD_SECONDS = 5;

export const MASTER_TIMELINE = buildTimeline(VOICE_LINES, MASTER_IDS, FPS, {
  tail: END_CARD_SECONDS + 0.4,
  extraGapAfter: MEME_GAPS,
});

/** The "hawa nikal gayi" meme after 1.2; 1.2 s after 4.7 for the takeaway card to build. */
export const SHORT_TIMELINE = buildTimeline(VOICE_LINES, SHORT_IDS, FPS, {
  lead: 0.1,
  tail: 0.7,
  extraGapAfter: { "1.2": MEME_GAPS["1.2"]!, "4.7": 1.2 },
});
