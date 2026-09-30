import { fontFamily } from "../../font";
import { CODE, COLORS } from "../theme";

/** Token categories for the mini highlighter. */
export type Tok = "kw" | "fn" | "str" | "num" | "punc" | "text" | "muted";

export type CodeLine = {
  /** array of [tokenType, text] pairs */
  tokens: Array<[Tok, string]>;
};

const colorFor = (t: Tok): string => {
  switch (t) {
    case "kw":
      return COLORS.keyword;
    case "fn":
      return COLORS.fn;
    case "str":
      return COLORS.string;
    case "num":
      return COLORS.number;
    case "punc":
      return COLORS.muted;
    case "muted":
      return COLORS.muted;
    default:
      return COLORS.text;
  }
};

/**
 * Renders a code block with active-line highlighting.
 * `activeIndex` is the currently-executing line index (-1 for none).
 * Each line gets `data-focus-target="<focusKey>-line-<i>"` for pointer alignment.
 */
export const CodeBlock: React.FC<{
  readonly lines: CodeLine[];
  readonly activeIndex: number;
  readonly focusKey?: string;
}> = ({ lines, activeIndex, focusKey }) => {
  return (
    <div style={{ fontFamily, fontSize: CODE.fontSize, lineHeight: `${CODE.lineHeight}px` }}>
      {lines.map((line, i) => (
        <div
          key={i}
          data-focus-target={focusKey ? `${focusKey}-line-${i}` : undefined}
          style={{
            backgroundColor: activeIndex === i ? COLORS.highlightBg : "transparent",
            borderLeft: `4px solid ${activeIndex === i ? COLORS.accent : "transparent"}`,
            marginLeft: -20,
            paddingLeft: 16,
            whiteSpace: "pre",
            height: CODE.lineHeight,
            display: "flex",
            alignItems: "center",
          }}
        >
          {line.tokens.map((tok, ti) => (
            <span key={ti} style={{ color: colorFor(tok[0]) }}>
              {tok[1]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Small helpers to build lines concisely. */
export const kw = (s: string): [Tok, string] => ["kw", s];
export const fn = (s: string): [Tok, string] => ["fn", s];
export const str = (s: string): [Tok, string] => ["str", s];
export const num = (s: string): [Tok, string] => ["num", s];
export const punc = (s: string): [Tok, string] => ["punc", s];
export const text = (s: string): [Tok, string] => ["text", s];
export const muted = (s: string): [Tok, string] => ["muted", s];
