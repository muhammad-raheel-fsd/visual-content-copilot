/**
 * Builds the folder tree shown in the deck browser (Class > Chapter > decks)
 * straight from the DECKS map in App.tsx. Nothing to maintain by hand:
 * a deck registered as `class-<N>-ch<M>-...` lands in the right folder.
 */
import type { Deck } from "./SlideDeck";
import { CHAPTER_THEMES, chapterKeyOf, type ThemeId } from "./themes";

export type DeckKind = "topic" | "revision" | "quiz" | "other";

export type DeckEntry = {
  id: string;
  deck: Deck;
  kind: DeckKind;
  /** short code shown on the left: "1.2", "4.1a", "REV", "QUIZ" */
  code: string;
  label: string;
  slides: number;
};

export type ChapterGroup = {
  key: string;
  chapterNum: number;
  title: string;
  theme: ThemeId;
  decks: DeckEntry[];
};

export type ClassGroup = { classNum: number; chapters: ChapterGroup[] };

export type Catalog = { classes: ClassGroup[]; other: DeckEntry[] };

const KIND_ORDER: Record<DeckKind, number> = { topic: 0, revision: 1, quiz: 2, other: 3 };

function toEntry(id: string, deck: Deck): DeckEntry {
  const kind: DeckKind = id.endsWith("-revision")
    ? "revision"
    : id.endsWith("-quiz")
      ? "quiz"
      : chapterKeyOf(id)
        ? "topic"
        : "other";
  const code =
    kind === "revision" ? "REV" : kind === "quiz" ? "QUIZ" : kind === "topic" ? (deck.topicCode ?? "") : "";
  const label =
    kind === "revision" ? "Chapter revision" : kind === "quiz" ? "Quick quiz" : deck.title;
  return { id, deck, kind, code, label, slides: deck.slides.length };
}

/** "Ch 4 · Development of GUI" → "Development of GUI" */
const stripChapterPrefix = (s: string) => s.replace(/^Ch\s*\d+\s*·\s*/, "");

export function buildCatalog(decks: Record<string, Deck>): Catalog {
  const chapters = new Map<string, ChapterGroup & { classNum: number }>();
  const other: DeckEntry[] = [];

  for (const [id, deck] of Object.entries(decks)) {
    const entry = toEntry(id, deck);
    const m = id.match(/^class-(\d+)-ch(\d+)-/);
    if (!m) {
      other.push(entry);
      continue;
    }
    const key = `class-${m[1]}-ch${m[2]}`;
    let group = chapters.get(key);
    if (!group) {
      group = {
        key,
        classNum: Number(m[1]),
        chapterNum: Number(m[2]),
        title: "",
        theme: CHAPTER_THEMES[key] ?? "default",
        decks: [],
      };
      chapters.set(key, group);
    }
    // Use the longest chapter name any deck gives (some decks shorten it).
    const title = stripChapterPrefix(deck.chapter ?? "");
    if (title.length > group.title.length) group.title = title;
    group.decks.push(entry);
  }

  const classes = new Map<number, ClassGroup>();
  for (const g of chapters.values()) {
    g.decks.sort(
      (a, b) =>
        KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
        a.code.localeCompare(b.code, undefined, { numeric: true }),
    );
    if (!classes.has(g.classNum)) classes.set(g.classNum, { classNum: g.classNum, chapters: [] });
    classes.get(g.classNum)!.chapters.push(g);
  }
  const sorted = [...classes.values()].sort((a, b) => a.classNum - b.classNum);
  sorted.forEach((c) => c.chapters.sort((a, b) => a.chapterNum - b.chapterNum));
  return { classes: sorted, other };
}
