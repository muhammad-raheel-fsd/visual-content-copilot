import { Icon } from "@iconify/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Catalog, ChapterGroup, DeckEntry } from "../catalog";
import { CHAPTER_THEMES, THEME_IDS, THEMES, chapterKeyOf, type ThemeId } from "../themes";

/**
 * Left-side library drawer: Class > Chapter > decks, plus a theme gallery.
 * Authoring UI only. It is hidden in fullscreen, so it never shows in a recording.
 */
type Props = {
  catalog: Catalog;
  currentId: string;
  /** theme the current deck is showing right now */
  activeTheme: ThemeId;
  /** `?theme=` preview, null when the chapter theme is in use */
  previewTheme: ThemeId | null;
  onPick: (id: string) => void;
  onPreviewTheme: (id: ThemeId | null) => void;
  onClose: () => void;
};

export const DeckBrowser: React.FC<Props> = ({
  catalog,
  currentId,
  activeTheme,
  previewTheme,
  onPick,
  onPreviewTheme,
  onClose,
}) => {
  const [tab, setTab] = useState<"decks" | "themes">("decks");
  const [query, setQuery] = useState("");
  const currentChapter = chapterKeyOf(currentId);
  const [open, setOpen] = useState<Set<string>>(() => {
    const s = new Set<string>(["other"]);
    const m = currentId.match(/^class-(\d+)-/);
    if (m) s.add(`class-${m[1]}`);
    if (currentChapter) s.add(currentChapter);
    // Nothing chapter-specific open yet (e.g. first visit): open every class.
    if (!m) catalog.classes.forEach((c) => s.add(`class-${c.classNum}`));
    return s;
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tab === "decks") searchRef.current?.focus();
  }, [tab]);

  const q = query.trim().toLowerCase();
  const matches = (d: DeckEntry, ch?: ChapterGroup) =>
    !q || `${d.code} ${d.label} ${d.id} ${ch?.title ?? ""}`.toLowerCase().includes(q);

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const isOpen = (key: string) => !!q || open.has(key);

  const usedBy = useMemo(() => {
    const map = new Map<ThemeId, string[]>();
    for (const [key, theme] of Object.entries(CHAPTER_THEMES)) {
      const m = key.match(/^class-(\d+)-ch(\d+)$/);
      const label = m ? `Class ${m[1]} · Ch ${m[2]}` : key;
      map.set(theme, [...(map.get(theme) ?? []), label]);
    }
    return map;
  }, []);

  return (
    <>
      <div onClick={onClose} style={backdropStyle} />
      <aside style={drawerStyle} aria-label="Deck library">
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px 10px" }}>
          <TabButton active={tab === "decks"} onClick={() => setTab("decks")} icon="mdi:folder-multiple-outline">
            Decks
          </TabButton>
          <TabButton active={tab === "themes"} onClick={() => setTab("themes")} icon="mdi:palette-outline">
            Themes
          </TabButton>
          <button onClick={onClose} style={{ ...iconButton, marginLeft: "auto" }} title="Close (Esc)">
            <Icon icon="mdi:close" width={18} />
          </button>
        </div>

        {tab === "decks" ? (
          <>
            <div style={{ padding: "0 16px 10px", position: "relative" }}>
              <Icon icon="mdi:magnify" width={16} style={{ position: "absolute", left: 27, top: 9, color: "var(--muted)" }} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topic, code or chapter"
                style={searchStyle}
              />
            </div>
            <div style={{ overflowY: "auto", flex: 1, padding: "0 8px 16px" }}>
              {catalog.classes.map((c) => {
                const classKey = `class-${c.classNum}`;
                const chapters = c.chapters.filter((ch) => ch.decks.some((d) => matches(d, ch)));
                if (!chapters.length) return null;
                return (
                  <div key={classKey}>
                    <FolderRow
                      depth={0}
                      open={isOpen(classKey)}
                      onClick={() => toggle(classKey)}
                      label={`Class ${c.classNum}`}
                      meta={`${c.chapters.length} chapter${c.chapters.length === 1 ? "" : "s"}`}
                    />
                    {isOpen(classKey) &&
                      chapters.map((ch) => (
                        <div key={ch.key}>
                          <FolderRow
                            depth={1}
                            open={isOpen(ch.key)}
                            onClick={() => toggle(ch.key)}
                            label={`Ch ${ch.chapterNum} · ${ch.title}`}
                            meta={THEMES[ch.theme].name}
                            swatch={ch.theme}
                          />
                          {isOpen(ch.key) &&
                            ch.decks
                              .filter((d) => matches(d, ch))
                              .map((d) => (
                                <DeckRow key={d.id} entry={d} depth={2} current={d.id === currentId} onClick={() => onPick(d.id)} />
                              ))}
                        </div>
                      ))}
                  </div>
                );
              })}
              {catalog.other.some((d) => matches(d)) && (
                <div>
                  <FolderRow depth={0} open={isOpen("other")} onClick={() => toggle("other")} label="Other videos" meta="not tied to a chapter" />
                  {isOpen("other") &&
                    catalog.other
                      .filter((d) => matches(d))
                      .map((d) => (
                        <DeckRow key={d.id} entry={d} depth={1} current={d.id === currentId} onClick={() => onPick(d.id)} />
                      ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ overflowY: "auto", flex: 1, padding: "0 16px 16px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 12.5, lineHeight: 1.5, color: "var(--muted)" }}>
              Click a theme to preview this deck in it. Previews are not saved: a chapter's real
              theme is set in <code>src/themes.ts</code> (CHAPTER_THEMES).
            </p>
            {previewTheme && (
              <button onClick={() => onPreviewTheme(null)} style={{ ...plainButton, marginBottom: 12 }}>
                <Icon icon="mdi:undo-variant" width={16} /> Back to the chapter theme
              </button>
            )}
            <div style={{ display: "grid", gap: 10 }}>
              {THEME_IDS.map((id) => (
                <ThemeCard
                  key={id}
                  id={id}
                  active={id === activeTheme}
                  usedBy={usedBy.get(id)}
                  onClick={() => onPreviewTheme(id)}
                />
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

const FolderRow: React.FC<{
  depth: number;
  open: boolean;
  onClick: () => void;
  label: string;
  meta?: string;
  swatch?: ThemeId;
}> = ({ depth, open, onClick, label, meta, swatch }) => (
  <button onClick={onClick} style={{ ...rowStyle, paddingLeft: 8 + depth * 18 }}>
    <Icon icon={open ? "mdi:chevron-down" : "mdi:chevron-right"} width={16} style={{ color: "var(--muted)", flex: "none" }} />
    <Icon icon={open ? "mdi:folder-open-outline" : "mdi:folder-outline"} width={17} style={{ color: "var(--accent)", flex: "none" }} />
    <span style={{ fontWeight: depth === 0 ? 700 : 600, color: "var(--text)", textAlign: "left", flex: 1, minWidth: 0 }}>
      {label}
    </span>
    {swatch && <Swatches id={swatch} size={8} />}
    {meta && <span style={{ fontSize: 11.5, color: "var(--muted)", flex: "none" }}>{meta}</span>}
  </button>
);

const DeckRow: React.FC<{ entry: DeckEntry; depth: number; current: boolean; onClick: () => void }> = ({
  entry,
  depth,
  current,
  onClick,
}) => (
  <button
    onClick={onClick}
    style={{
      ...rowStyle,
      paddingLeft: 30 + depth * 18,
      backgroundColor: current ? "var(--accent-soft)" : undefined,
    }}
    title={entry.id}
  >
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: 700,
        color: entry.kind === "topic" ? "var(--accent)" : "var(--sync)",
        width: 44,
        flex: "none",
        textAlign: "left",
      }}
    >
      {entry.code}
    </span>
    <span
      style={{
        color: current ? "var(--text-strong)" : "var(--text)",
        fontWeight: current ? 700 : 500,
        textAlign: "left",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {entry.label}
    </span>
    <span style={{ fontSize: 11.5, color: "var(--muted)", flex: "none" }}>{entry.slides} slides</span>
  </button>
);

const Swatches: React.FC<{ id: ThemeId; size?: number }> = ({ id, size = 10 }) => {
  const t = THEMES[id].tokens;
  return (
    <span style={{ display: "inline-flex", gap: 3, flex: "none" }}>
      {[t.bg, t.accent, t.sync, t.microtask, t.task].map((c, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: c,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </span>
  );
};

/** A tiny slide painted with the theme's OWN colours, so themes can be compared side by side. */
const ThemeCard: React.FC<{ id: ThemeId; active: boolean; usedBy?: string[]; onClick: () => void }> = ({
  id,
  active,
  usedBy,
  onClick,
}) => {
  const theme = THEMES[id];
  const t = theme.tokens;
  return (
    <button
      onClick={onClick}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "150px 1fr",
        gap: 12,
        padding: 10,
        borderRadius: 10,
        border: `1px solid ${active ? "var(--accent)" : "var(--panel-border)"}`,
        backgroundColor: active ? "var(--accent-soft)" : "transparent",
      }}
    >
      <div
        style={{
          backgroundColor: t.bg,
          borderRadius: 6,
          padding: 8,
          height: 84,
          display: "flex",
          flexDirection: "column",
          gap: 5,
          border: `1px solid ${t.panelBorder}`,
          fontFamily: t.fontDisplay,
        }}
      >
        <div style={{ width: 22, height: 3, borderRadius: 2, backgroundColor: t.accent }} />
        <div style={{ color: t.textStrong, fontSize: 11, fontWeight: 700 }}>4.1a Tkinter</div>
        <div style={{ backgroundColor: t.panel, border: `1px solid ${t.panelBorder}`, borderRadius: 4, padding: "3px 5px" }}>
          <div style={{ fontFamily: "Roboto Mono, monospace", fontSize: 8.5, whiteSpace: "nowrap" }}>
            <span style={{ color: t.synKeyword }}>import </span>
            <span style={{ color: t.text }}>tkinter </span>
            <span style={{ color: t.synKeyword }}>as </span>
            <span style={{ color: t.text }}>tk</span>
          </div>
          <div style={{ fontFamily: "Roboto Mono, monospace", fontSize: 8.5, whiteSpace: "nowrap" }}>
            <span style={{ color: t.synFunction }}>print</span>
            <span style={{ color: t.text }}>(</span>
            <span style={{ color: t.synString }}>"Hi"</span>
            <span style={{ color: t.text }}>)</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, fontSize: 8, fontWeight: 800, letterSpacing: 0.5 }}>
          <span style={{ color: t.sync }}>CORRECT</span>
          <span style={{ color: t.microtask }}>BEYOND</span>
          <span style={{ color: t.api }}>DID YOU KNOW</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 700, color: "var(--text-strong)", fontSize: 14 }}>{theme.name}</span>
          {active && <span style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>showing</span>}
        </div>
        <span style={{ fontSize: 12, lineHeight: 1.45, color: "var(--muted)" }}>{theme.blurb}</span>
        <Swatches id={id} />
        {usedBy && <span style={{ fontSize: 11.5, color: "var(--sync)" }}>Used by {usedBy.join(", ")}</span>}
      </div>
    </button>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: string; children: React.ReactNode }> = ({
  active,
  onClick,
  icon,
  children,
}) => (
  <button
    onClick={onClick}
    style={{
      ...plainButton,
      color: active ? "var(--text-strong)" : "var(--muted)",
      backgroundColor: active ? "var(--panel-elevated)" : "transparent",
    }}
  >
    <Icon icon={icon} width={16} />
    {children}
  </button>
);

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  zIndex: 40,
};
const drawerStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  bottom: 0,
  width: 480,
  maxWidth: "92vw",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--panel)",
  borderRight: "1px solid var(--panel-border)",
  boxShadow: "8px 0 32px rgba(0, 0, 0, 0.35)",
  zIndex: 50,
  fontFamily: "var(--font-sans)",
  fontSize: 13.5,
};
const rowStyle: React.CSSProperties = {
  all: "unset",
  boxSizing: "border-box",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "7px 10px",
  borderRadius: 6,
};
const plainButton: React.CSSProperties = {
  all: "unset",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 10px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text)",
};
const iconButton: React.CSSProperties = {
  all: "unset",
  cursor: "pointer",
  display: "inline-flex",
  padding: 6,
  borderRadius: 6,
  color: "var(--muted)",
};
const searchStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px 8px 32px",
  borderRadius: 8,
  border: "1px solid var(--panel-border)",
  backgroundColor: "var(--bg)",
  color: "var(--text)",
  fontSize: 13.5,
  outline: "none",
};
