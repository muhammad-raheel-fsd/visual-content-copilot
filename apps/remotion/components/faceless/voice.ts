/**
 * Voice timeline for the faceless series (pipeline/production-guide.md, section 3).
 *
 * Muhammad records one take. VERBATIM lines (phase 02 on, `sourceFrom` set) are untouched
 * stretches of that recording: `buildTimeline` plays them back to back exactly as recorded
 * (no gaps added, nothing cut, faded or re-timed) and only opens a pause where a meme goes
 * (extraGapAfter). "Never edit my words" (Muhammad, 2026-10-11).
 *
 * Older lines (phase 01) are baked files with pauses removed and speed applied, laid back to
 * back with fixed short gaps. Either way every word maps to its output frame, and scenes cue
 * their animations from it.
 */

export type VoiceWord = {
  /** The word as said (Roman Urdu / English). */
  readonly w: string;
  /** Start / end in seconds inside the line's file. */
  readonly t0: number;
  readonly t1: number;
};

export type VoiceLine = {
  /** Transcript line id, e.g. "4.5" (beat 4, line 5). */
  readonly id: string;
  readonly text: string;
  /**
   * The line's audio under library/ (pipeline/build/render_voice_lines.py): kept pieces of the
   * recording with fades and the line's speed already baked in.
   */
  readonly file: string;
  /** VERBATIM lines: where the line starts inside `file` (the whole recording), seconds. */
  readonly sourceFrom?: number;
  /** Length of the line, seconds. */
  readonly duration: number;
  readonly words: readonly VoiceWord[];
};

export type TimelineChunk = {
  readonly lineId: string;
  /** Output position, frames. */
  readonly from: number;
  readonly durationInFrames: number;
  /** Line file under library/. */
  readonly file: string;
  /** VERBATIM: frames to skip at the start of `file` (the recording). */
  readonly trimBefore?: number;
};

export type TimedWord = {
  readonly lineId: string;
  readonly index: number;
  readonly w: string;
  /** Output frames. */
  readonly from: number;
  readonly to: number;
};

export type Timeline = {
  readonly chunks: readonly TimelineChunk[];
  readonly words: readonly TimedWord[];
  /** Output frame range of each line. */
  readonly lines: Readonly<Record<string, { from: number; to: number }>>;
  readonly durationInFrames: number;
};

/** Gaps between lines, seconds: never more (production guide, section 3). Gaps inside a line are baked into its file. */
export const GAPS = { betweenLines: 0.25, betweenBeats: 0.35 } as const;

const beatOf = (id: string) => id.split(".")[0];

export function buildTimeline(
  all: readonly VoiceLine[],
  ids: readonly string[],
  fps: number,
  options: { lead?: number; tail?: number; extraGapAfter?: Readonly<Record<string, number>> } = {}
): Timeline {
  const byId = new Map(all.map((line) => [line.id, line]));
  const chunks: TimelineChunk[] = [];
  const words: TimedWord[] = [];
  const lines: Record<string, { from: number; to: number }> = {};
  let t = options.lead ?? 0.3; // output seconds

  ids.forEach((id, n) => {
    const line = byId.get(id);
    if (!line) throw new Error(`voice line ${id} not found`);
    const verbatim = line.sourceFrom !== undefined;
    const prev = n > 0 ? byId.get(ids[n - 1]!) : undefined;
    const extra = prev ? (options.extraGapAfter?.[prev.id] ?? 0) : 0;
    if (prev) {
      // verbatim: the recording's own pauses are already inside the lines, add nothing
      if (!verbatim) t += beatOf(prev.id) === beatOf(id) ? GAPS.betweenLines : GAPS.betweenBeats;
      t += extra;
    }
    const from = Math.round(t * fps);
    const last = chunks[chunks.length - 1];
    const continues =
      verbatim &&
      prev?.sourceFrom !== undefined &&
      extra === 0 &&
      last !== undefined &&
      last.file === line.file &&
      Math.abs(prev.sourceFrom + prev.duration - line.sourceFrom!) < 1e-3;
    if (verbatim && continues) {
      // the next stretch of the recording: keep playing the same chunk, no seam
      chunks[chunks.length - 1] = { ...last, durationInFrames: Math.round((t + line.duration) * fps) - last.from };
    } else if (verbatim) {
      chunks.push({ lineId: id, from, durationInFrames: Math.round(line.duration * fps), file: line.file, trimBefore: Math.round(line.sourceFrom! * fps) });
    } else {
      chunks.push({ lineId: id, from, durationInFrames: Math.ceil(line.duration * fps) + 1, file: line.file });
    }
    line.words.forEach((word, index) => {
      words.push({
        lineId: id,
        index,
        w: word.w,
        from: Math.round((t + word.t0) * fps),
        to: Math.round((t + word.t1) * fps),
      });
    });
    t += line.duration;
    lines[id] = { from, to: Math.round(t * fps) };
  });

  return { chunks, words, lines, durationInFrames: Math.round((t + (options.tail ?? 0)) * fps) };
}

/**
 * Frame of a word inside a line: `cue(tl, "4.5", "number")` = first word starting with
 * "number" in line 4.5 (case-insensitive). `nth` picks a later match. Falls back to the line
 * start, so a re-recorded line never crashes a scene.
 */
export function cue(tl: Timeline, lineId: string, word?: string, nth = 0): number {
  const range = tl.lines[lineId];
  if (!range) throw new Error(`line ${lineId} is not in this timeline`);
  if (!word) return range.from;
  const needle = word.toLowerCase();
  const matches = tl.words.filter(
    (w) => w.lineId === lineId && w.w.toLowerCase().replace(/[^a-z0-9']/g, "").startsWith(needle)
  );
  return matches[nth]?.from ?? range.from;
}

/** End frame of a line. */
export const lineEnd = (tl: Timeline, lineId: string): number => {
  const range = tl.lines[lineId];
  if (!range) throw new Error(`line ${lineId} is not in this timeline`);
  return range.to;
};

/** Frame of the word at `index` (0-based) inside a line; falls back to the line start. */
export function cueIndex(tl: Timeline, lineId: string, index: number): number {
  const word = tl.words.find((w) => w.lineId === lineId && w.index === index);
  return word?.from ?? cue(tl, lineId);
}
