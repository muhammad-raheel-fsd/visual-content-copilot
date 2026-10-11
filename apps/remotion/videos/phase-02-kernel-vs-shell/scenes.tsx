import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Car,
  Clapperboard,
  Cog,
  Cpu,
  FileText,
  Gauge,
  HardDrive,
  Hand,
  Keyboard,
  Layers,
  MemoryStick,
  MessageSquareText,
  Monitor,
  MousePointerClick,
  Printer,
  Smartphone,
  Speaker,
  SquareCheckBig,
  SquareTerminal,
  User,
  Users,
} from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { SfxCue } from "../../components/audio/SfxCue";
import { Icon } from "../../components/faceless/Icon";
import { Avatar, Card, DrawLine, FlowDot, Pop, Pulse, Scene, Txt, useBetween } from "../../components/faceless/kit";
import { BRAND, DISPLAY_FONT, FL } from "../../components/faceless/theme";
import { cue, lineEnd, type Timeline } from "../../components/faceless/voice";
import { LAYOUT } from "../../components/theme";
import { fontFamily as MONO_FONT } from "../../font";
import { IconChip, OsBox } from "./os-parts";

/**
 * Phase 02 master scenes (pipeline/phase-02-kernel-vs-shell.md, sections 2 and 3).
 *
 * COMPULSORY (Muhammad, 2026-10-11): everything appears ON the word that names it, never earlier,
 * never later, and nothing is on screen before its word. Every appear time below is
 * cue(tl, "<line id>", "<the word that names it>"); a `start + N` appear time is a bug.
 */

type SceneProps = { readonly tl: Timeline };
type Rect = { x: number; y: number; w: number; h: number };

const abs = (r: Rect): React.CSSProperties => ({ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h });
const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/** Output frames [from, to] of a whole word, e.g. the spoken "01000001". */
const wordSpan = (tl: Timeline, lineId: string, word: string) => {
  const w = tl.words.find((x) => x.lineId === lineId && x.w.toLowerCase().startsWith(word.toLowerCase()));
  const from = w?.from ?? cue(tl, lineId);
  return { from, to: Math.max(from + 1, w?.to ?? from + 1) };
};

/** A book line on screen, typed in over [from, to] (the book's exact words, quoted). */
const BookLine: React.FC<{ readonly r: Rect; readonly text: string; readonly from: number; readonly to: number }> = ({ r, text, from, to }) => {
  const frame = useCurrentFrame();
  const shown = Math.round(useBetween(from, to) * text.length);
  if (frame < from) return null;
  return (
    <div style={{ ...abs(r), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <Txt size={44} weight={600} color={FL.text} style={{ textAlign: "center", lineHeight: 1.4 }}>
        &ldquo;{text.slice(0, shown)}
        {shown >= text.length ? "”" : ""}
      </Txt>
      <Txt size={24} weight={600} color={FL.dim}>
        Book: Class 10, Chapter 1, page 3
      </Txt>
    </div>
  );
};

/** A sentence that builds word by word: each piece pops in on the word that says it. */
const Trail: React.FC<{
  readonly items: readonly { readonly at: number; readonly node: React.ReactNode }[];
  readonly size: number;
  readonly gap?: number;
  readonly justify?: React.CSSProperties["justifyContent"];
}> = ({ items, size, gap = 12, justify = "center" }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: justify, columnGap: gap, rowGap: 6 }}>
      {items.map((it, i) =>
        frame >= it.at ? (
          <Pop key={i} at={it.at} fromScale={0.85}>
            <Txt size={size} weight={800}>
              {it.node}
            </Txt>
          </Pop>
        ) : null
      )}
    </div>
  );
};

/** A word-sized scale kick on its cue (for a word already on screen). */
const kick = (frame: number, at: number) => (frame >= at ? 1 + 0.25 * Math.max(0, 1 - (frame - at) / 12) : 1);

/* ---------------------------------------------------------------- Beat 1: hook */

/** A phone drawn as a real handset: frame, notch, app grid; "tap" opens the middle app. */
const PhoneDevice: React.FC<{ readonly tapAt: number }> = ({ tapAt }) => {
  const frame = useCurrentFrame();
  const opened = useBetween(tapAt + 4, tapAt + 16);
  const apps = [FL.green, FL.highlight, FL.blue, FL.purple, FL.accent, FL.red, FL.blue, FL.green, FL.highlight];
  return (
    <div style={{ position: "relative", width: 180, height: 340, borderRadius: 34, border: `6px solid ${FL.green}`, background: "#0b0f14", boxShadow: "0 0 40px rgba(63,185,80,0.25)" }}>
      <div style={{ position: "absolute", left: 65, top: 10, width: 38, height: 8, borderRadius: 4, background: FL.panelBorder }} />
      <div style={{ position: "absolute", inset: "28px 12px 22px", borderRadius: 18, background: FL.panel, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: 14 }}>
          {apps.map((c, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: c, opacity: 0.85, transform: i === 4 && frame >= tapAt ? `scale(${1 + 0.25 * Math.max(0, 1 - (frame - tapAt) / 8)})` : undefined }} />
          ))}
        </div>
        {/* the tapped app opens over the screen */}
        {opened > 0 ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${opened * 100}%`, background: FL.accentSoft, borderTop: `3px solid ${FL.accent}` }} /> : null}
      </div>
      <Pulse at={tapAt} color={FL.green} radius={34} />
    </div>
  );
};

/** A desktop computer: screen with a window, stand; "type" types in, "click" presses a button. */
const ComputerDevice: React.FC<{ readonly typeAt: number; readonly clickAt: number }> = ({ typeAt, clickAt }) => {
  const frame = useCurrentFrame();
  const text = "Hello!";
  const shown = frame >= typeAt ? Math.min(text.length, Math.floor((frame - typeAt) / 3) + 1) : 0;
  const pressed = frame >= clickAt;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 420, height: 270, borderRadius: 18, border: `10px solid ${FL.blue}`, background: "#0b0f14", boxShadow: "0 0 40px rgba(121,192,255,0.25)" }}>
        <div style={{ position: "absolute", inset: "20px 26px", borderRadius: 10, background: FL.panel, border: `2px solid ${FL.panelBorder}` }}>
          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderBottom: `2px solid ${FL.panelBorder}` }}>
            {[FL.red, FL.highlight, FL.green].map((c) => (
              <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
            ))}
          </div>
          <div style={{ padding: "14px 18px", fontFamily: MONO_FONT, fontSize: 34, color: FL.accent }}>
            {text.slice(0, shown)}
            {frame >= typeAt && Math.floor(frame / 8) % 2 ? "_" : ""}
          </div>
          {/* the button the click presses */}
          <div style={{ position: "absolute", right: 22, bottom: 18, padding: "8px 22px", borderRadius: 10, background: pressed ? FL.highlight : FL.panelBorder, fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 24, color: pressed ? "#0b0f14" : FL.muted, transform: pressed ? `scale(${1 - 0.12 * Math.max(0, 1 - (frame - clickAt) / 6)})` : undefined }}>
            OK
          </div>
          {pressed ? <MousePointerClick size={44} color={FL.text} style={{ position: "absolute", right: 30, bottom: -6 }} /> : null}
        </div>
        <Pulse at={clickAt} color={FL.highlight} radius={18} />
      </div>
      <div style={{ width: 28, height: 36, background: FL.blue }} />
      <div style={{ width: 190, height: 14, borderRadius: 7, background: FL.blue }} />
    </div>
  );
};

const INPUTS = [
  { line: "1.1", word: "type", label: "Type", icon: <Keyboard size={56} color={FL.accent} /> },
  { line: "1.1", word: "click", label: "Click", icon: <MousePointerClick size={56} color={FL.highlight} /> },
  { line: "1.1", word: "tap", label: "Tap", icon: <Smartphone size={56} color={FL.green} /> },
] as const;
const BITS = "01000001".split("");

export const SceneHook: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Hook;
  const frame = useCurrentFrame();
  const start = cue(tl, "1.1");
  const phone = cue(tl, "1.1", "phone");
  const computer = cue(tl, "1.1", "computer");
  const typeW = cue(tl, "1.1", "type");
  const clickW = cue(tl, "1.1", "click");
  const tapW = cue(tl, "1.1", "tap");
  const pichli = cue(tl, "1.2", "pichli");
  const os12 = cue(tl, "1.2", "operating");
  const commands12 = cue(tl, "1.2", "commands");
  const manage = cue(tl, "1.2", "manage");
  const socha = cue(tl, "1.3", "socha");
  const commands13 = cue(tl, "1.3", "commands");
  const hardware = cue(tl, "1.3", "hardware");
  const kaise13 = cue(tl, "1.3", "kaise");
  const letter = cue(tl, "1.4", "letter");
  const binary = cue(tl, "1.4", "binary");
  const digits = wordSpan(tl, "1.4", "0100");
  const hw14a = cue(tl, "1.4", "hardware");
  const hw14b = cue(tl, "1.4", "hardware", 1);
  const samjha = cue(tl, "1.4", "samjha");
  const os15 = cue(tl, "1.5", "operating");
  const andar = cue(tl, "1.5", "andar");
  // the pickup (1.5b): "Uske do parts mein: Shell aur Kernel"
  const parts15 = cue(tl, "1.5b", "parts");
  const shell15 = cue(tl, "1.5b", "shell");
  const kernel15 = cue(tl, "1.5b", "kernel");
  const dono = cue(tl, "1.6", "dono");
  const step = cue(tl, "1.6", "step");
  const simple = cue(tl, "1.6", "simple");
  const osC = centre(L.os);
  const sideC = centre(L.side);
  const drop = useBetween(commands13, commands13 + 18);
  // the phone and computer fill the middle while 1.1 is spoken, then step aside on "Pichli video"
  // (the card and, on "Operating System", the OS box take the middle)
  const aside = useBetween(pichli, pichli + 14);
  const devX = interpolate(aside, [0, 1], [1180, sideC.x]);
  const devY = interpolate(aside, [0, 1], [480, sideC.y]);
  const devScale = interpolate(aside, [0, 1], [1.45, 0.55]);
  const bitAt = (i: number) => digits.from + Math.round((i * (digits.to - digits.from)) / BITS.length);
  return (
    <Scene from={start} to={lineEnd(tl, "1.6")}>
      <SfxCue file="pop.wav" at={phone} volume={0.35} />
      <SfxCue file="pop.wav" at={computer} volume={0.35} />
      {INPUTS.map((inp) => (
        <SfxCue key={inp.word} file="click.wav" at={cue(tl, inp.line, inp.word)} volume={0.4} />
      ))}
      <SfxCue file="whoosh.wav" at={pichli} volume={0.3} />
      <SfxCue file="thud.wav" at={os12} volume={0.35} />
      <SfxCue file="whoosh.wav" at={commands13} volume={0.25} />
      <SfxCue file="pop.wav" at={hardware} volume={0.35} />
      <SfxCue file="pop.wav" at={letter} volume={0.35} />
      {BITS.map((_, i) => (
        <SfxCue key={i} file="type.wav" at={bitAt(i)} volume={0.3} />
      ))}
      <SfxCue file="click.wav" at={os15} volume={0.35} />
      <SfxCue file="click.wav" at={andar} volume={0.35} />
      <SfxCue file="pop.wav" at={shell15} volume={0.4} />
      <SfxCue file="thud.wav" at={kernel15} volume={0.4} />

      {/* "phone ya computer": the two devices, big, on their words */}
      {frame >= phone && frame < letter ? (
        <div style={{ position: "absolute", left: devX - 330, top: devY - 180, width: 660, height: 360, display: "flex", alignItems: "center", justifyContent: "center", gap: 50, transform: `scale(${devScale})` }}>
          <Pop at={phone}>
            <PhoneDevice tapAt={tapW} />
          </Pop>
          {frame >= computer ? (
            <Pop at={computer}>
              <ComputerDevice typeAt={typeW} clickAt={clickW} />
            </Pop>
          ) : null}
        </div>
      ) : null}

      {/* type, click, tap */}
      <div style={{ ...abs(L.inputs), display: "flex", flexDirection: "column", justifyContent: "center", gap: 30 }}>
        {INPUTS.map((inp) => (
          <div key={inp.word} style={{ height: 96 }}>
            <IconChip at={cue(tl, inp.line, inp.word)} icon={inp.icon} label={inp.label} width={L.inputs.w} lit pulses={[cue(tl, inp.line, inp.word), commands12, commands13]} color={FL.accent} />
          </div>
        ))}
      </div>

      {/* the OS box on "Operating System"; "andar" and "do parts" pulse it; the Shell on "Shell",
          the Kernel on "Kernel" (the pickup line 1.5b) */}
      <OsBox x={L.os.x} y={L.os.y} w={L.os.w} h={L.os.h} at={os12} shellAt={shell15} kernelAt={kernel15} shellPulses={[shell15, dono]} kernelPulses={[kernel15, dono + 6]} />
      {frame >= os12 && frame < shell15 ? (
        <div style={{ position: "absolute", left: L.os.x, top: L.os.y, width: L.os.w, height: L.os.h, pointerEvents: "none" }}>
          <Pulse at={socha} color={FL.highlight} radius={32} />
          <Pulse at={os15} color={FL.accent} radius={32} />
          <Pulse at={andar} color={FL.green} radius={32} />
          <Pulse at={parts15} color={FL.highlight} radius={32} />
        </div>
      ) : null}
      {frame >= parts15 && frame < shell15 ? (
        <Pop at={parts15} style={{ position: "absolute", left: L.os.x, top: L.os.y + L.os.h / 2 - 30, width: L.os.w, display: "flex", justifyContent: "center" }}>
          <Txt size={52} weight={800} color={FL.highlight}>
            2 parts
          </Txt>
        </Pop>
      ) : null}
      {frame >= pichli && frame < andar ? (
        <Pop at={pichli} style={{ position: "absolute", left: L.os.x + 60, top: L.os.y + 58, width: L.os.w - 120, display: "flex", justifyContent: "center" }}>
          <Card accent={frame >= manage ? FL.accent : FL.panelBorder} style={{ padding: "8px 22px", gap: 12 }}>
            <Icon name="mdi:traffic-light" size={34} color={FL.green} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Txt size={24} weight={800} color={FL.muted}>
                Pichli video
              </Txt>
              {frame >= manage ? (
                <Txt size={24} weight={700} color={FL.accent}>
                  OS commands manage karta hai
                </Txt>
              ) : null}
            </div>
          </Card>
        </Pop>
      ) : null}

      {/* hardware row on "hardware" */}
      <div style={{ ...abs(L.hardware), display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        {frame >= hardware ? (
          <>
            <IconChip at={hardware} icon={<Cpu size={44} color={FL.accent} />} label="CPU" width={200} lit={frame >= samjha} color={FL.highlight} pulses={[hw14a, hw14b]} />
            <IconChip at={hardware + 4} icon={<Printer size={44} color={FL.highlight} />} label="Printer" width={240} pulses={[hw14a + 3, hw14b + 3]} />
            <IconChip at={hardware + 8} icon={<Monitor size={44} color={FL.blue} />} label="Screen" width={240} pulses={[hw14a + 6, hw14b + 6]} />
          </>
        ) : null}
      </div>
      {/* "yeh saari commands": a command drops into the OS; "kaise?": it stops at a "?" */}
      {frame >= commands13 && frame < andar ? (
        <>
          <div
            style={{
              position: "absolute",
              left: osC.x - 70,
              top: interpolate(drop, [0, 1], [L.os.y - 40, osC.y - 20]),
              padding: "8px 16px",
              borderRadius: 14,
              background: FL.highlightSoft,
              border: `2px solid ${FL.highlight}`,
              fontFamily: MONO_FONT,
              fontSize: 26,
              color: FL.highlight,
            }}
          >
            command
          </div>
          {frame >= kaise13 ? (
            <Pop at={kaise13} style={{ position: "absolute", left: osC.x + 90, top: osC.y - 40 }}>
              <Txt size={80} weight={800} color={FL.highlight} style={{ transform: `translateY(${Math.sin((frame - kaise13) / 5) * 8}px)` }}>
                ?
              </Txt>
            </Pop>
          ) : null}
        </>
      ) : null}

      {/* "letter A", its binary code typed bit by bit while the digits are spoken */}
      <div style={{ ...abs(L.side), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        {frame >= letter ? (
          <Pop at={letter}>
            <div style={{ width: 130, height: 130, borderRadius: 22, background: FL.highlightSoft, border: `4px solid ${FL.highlight}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Txt size={80} weight={800} color={FL.highlight}>
                A
              </Txt>
            </div>
          </Pop>
        ) : null}
        {frame >= binary ? (
          <Pop at={binary}>
            <Txt size={30} weight={700} color={FL.muted}>
              binary code
            </Txt>
          </Pop>
        ) : null}
        {frame >= letter ? (
          <div style={{ display: "flex", gap: 6 }}>
            {BITS.map((b, i) =>
              frame >= bitAt(i) ? (
                <Pop key={i} at={bitAt(i)} fromScale={0.3}>
                  <div style={{ width: 42, height: 56, borderRadius: 8, border: `2px solid ${FL.accent}`, background: FL.panel, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO_FONT, fontSize: 32, fontWeight: 700, color: b === "1" ? FL.accent : FL.text }}>
                    {b}
                  </div>
                </Pop>
              ) : (
                <div key={i} style={{ width: 42, height: 56 }} />
              )
            )}
          </div>
        ) : null}
        {frame >= samjha && frame < andar ? (
          <Pop at={samjha}>
            <Txt size={34} weight={800} color={FL.highlight}>
              Hardware ne kaise samjha?
            </Txt>
          </Pop>
        ) : null}
        {frame >= step ? (
          <Pop at={step}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ width: 56, height: 56, borderRadius: 14, border: `2px solid ${FL.panelBorder}`, background: FL.panel, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Txt size={30} weight={800} color={FL.accent}>
                    {n}
                  </Txt>
                </div>
              ))}
              {frame >= simple ? (
                <Pop at={simple}>
                  <Txt size={36} weight={800} color={FL.green} style={{ marginLeft: 8 }}>
                    Simple
                  </Txt>
                </Pop>
              ) : null}
            </div>
          </Pop>
        ) : null}
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 2: the big picture */

export const SceneBigPicture: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Os;
  const frame = useCurrentFrame();
  const start = cue(tl, "2.1");
  const shell21 = cue(tl, "2.1", "shell");
  const kernel21 = cue(tl, "2.1", "kernel");
  const os21 = cue(tl, "2.1", "operating");
  const parts = cue(tl, "2.1", "parts");
  const os22 = cue(tl, "2.2", "operating");
  const tumhari = cue(tl, "2.2", "tumhari");
  const commands22 = cue(tl, "2.2", "commands");
  const parts22 = cue(tl, "2.2", "parts");
  const zariye = cue(tl, "2.2", "zariye");
  const bahar = cue(tl, "2.3", "bahar");
  const tum23 = cue(tl, "2.3", "tum");
  const baat23 = cue(tl, "2.3", "baat");
  const kernel23 = cue(tl, "2.3", "kernel");
  const andar = cue(tl, "2.3", "andar");
  const hw = cue(tl, "2.3", "hardware");
  const u = centre(L.user);
  const h = centre(L.hardware);
  const o = centre(L.os);
  return (
    <Scene from={start} to={lineEnd(tl, "2.3")}>
      <SfxCue file="pop.wav" at={shell21} volume={0.35} />
      <SfxCue file="pop.wav" at={kernel21} volume={0.35} />
      <SfxCue file="thud.wav" at={os21} volume={0.35} />
      <SfxCue file="snap.wav" at={parts} volume={0.4} />
      <SfxCue file="pop.wav" at={tumhari} volume={0.3} />
      <SfxCue file="whoosh.wav" at={zariye} volume={0.3} />
      <SfxCue file="pop.wav" at={hw} volume={0.35} />

      {/* "Sab se pehle ek baat clear kar lo" */}
      {frame < shell21 ? (
        <div style={{ ...abs(L.os), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Trail
            size={52}
            items={[
              { at: cue(tl, "2.1", "pehle"), node: <span style={{ color: FL.highlight }}>Sab se pehle:</span> },
              { at: cue(tl, "2.1", "baat"), node: "ek baat" },
              { at: cue(tl, "2.1", "clear"), node: <span style={{ color: FL.green }}>clear</span> },
            ]}
          />
        </div>
      ) : null}
      <OsBox x={L.os.x} y={L.os.y} w={L.os.w} h={L.os.h} at={os21} shellAt={shell21} kernelAt={kernel21} shellPulses={[parts, parts22, bahar, baat23 + 8]} kernelPulses={[parts, parts22 + 4, kernel23, andar]} />
      {frame >= os22 && frame < os22 + 24 ? (
        <div style={{ ...abs(L.os), pointerEvents: "none" }}>
          <Pulse at={os22} color={FL.accent} radius={32} />
        </div>
      ) : null}
      {frame >= parts && frame < bahar ? (
        <Pop at={parts} style={{ position: "absolute", left: L.os.x, top: L.os.y + L.os.h + 6, width: L.os.w, textAlign: "center" }}>
          <Txt size={34} weight={800} color={FL.highlight}>
            Dono OS ke hi parts hain
          </Txt>
        </Pop>
      ) : null}

      {/* "tumhari commands": the user (tum) */}
      {frame >= tumhari ? (
        <Pop at={tumhari} style={{ ...abs(L.user), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ position: "relative", display: "flex" }}>
            <Users size={140} color={frame >= bahar ? FL.green : FL.muted} />
            <Pulse at={tum23} color={FL.green} radius={30} />
          </div>
          <Txt size={34} weight={700}>
            User (tum)
          </Txt>
        </Pop>
      ) : null}
      <FlowDot from={commands22} to={commands22 + 14} x1={u.x + 120} y1={u.y} x2={L.os.x + 70} y2={u.y} color={FL.highlight} />
      {/* "inhi do parts ke zariye": user > Shell > Kernel */}
      <DrawLine from={zariye} to={zariye + 16} x1={u.x + 120} y1={u.y} x2={L.os.x + 70} y2={u.y} color={FL.green} />
      <FlowDot from={zariye} to={zariye + 24} x1={u.x + 120} y1={u.y} x2={o.x} y2={o.y + 40} color={FL.highlight} />
      {/* "tum se baat karta hai": a message hops from the user to the Shell */}
      <FlowDot from={baat23} to={baat23 + 12} x1={u.x + 120} y1={u.y} x2={L.os.x + 70} y2={u.y} color={FL.green} />

      {/* "hardware se baat karta hai": the hardware, and the Kernel's line to it */}
      {frame >= hw ? (
        <div style={{ ...abs(L.hardware), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          {[<Cpu key="c" size={70} color={FL.accent} />, <MemoryStick key="m" size={70} color={FL.blue} />, <Printer key="p" size={70} color={FL.highlight} />].map((ic, i) => (
            <Pop key={i} at={hw + i * 3}>
              {ic}
            </Pop>
          ))}
          <Pop at={hw}>
            <Txt size={34} weight={700}>
              Hardware
            </Txt>
          </Pop>
        </div>
      ) : null}
      <DrawLine from={hw} to={hw + 14} x1={L.os.x + L.os.w - 70} y1={h.y} x2={h.x - 110} y2={h.y} color={FL.accent} />
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 3: the Kernel */

export const SceneKernel: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Kernel;
  const frame = useCurrentFrame();
  const start = cue(tl, "3.1");
  const kernel31 = cue(tl, "3.1", "kernel");
  const book32 = cue(tl, "3.2", "book");
  const core = cue(tl, "3.2", "core");
  const control = cue(tl, "3.3", "control");
  const cpuW = cue(tl, "3.3", "cpu");
  const memW = cue(tl, "3.3", "memory");
  const devW = cue(tl, "3.3", "devices");
  const decide = cue(tl, "3.4", "decide");
  const program = cue(tl, "3.4", "program");
  const resources = cue(tl, "3.4", "resources");
  const kab = cue(tl, "3.4", "kab");
  const kaise = cue(tl, "3.4", "kaise");
  const apps = cue(tl, "3.5", "do");
  const use34 = cue(tl, "3.4", "use");
  const speaker = cue(tl, "3.5", "speaker");
  const decide35 = cue(tl, "3.5", "decide");
  const awaaz = cue(tl, "3.5", "awaaz");
  const c = centre(L.core);
  const gate = useBetween(kaise, kaise + 10);
  const parts: { at: number; icon: React.ReactNode; label: string; side: "left" | "right"; i: number; color: string }[] = [
    { at: cpuW, icon: <Cpu size={44} color={FL.accent} />, label: "CPU", side: "left", i: 0, color: FL.accent },
    { at: memW, icon: <MemoryStick size={44} color={FL.blue} />, label: "Memory", side: "left", i: 1, color: FL.blue },
    { at: devW, icon: <Printer size={44} color={FL.highlight} />, label: "Devices", side: "right", i: 0, color: FL.highlight },
  ];
  const chipY = (side: "left" | "right", i: number) => (side === "left" ? L.left : L.right).y + 60 + i * 150;
  return (
    <Scene from={start} to={lineEnd(tl, "3.5")}>
      <SfxCue file="pop.wav" at={kernel31} volume={0.35} />
      <SfxCue file="thud.wav" at={core} volume={0.4} />
      {parts.map((p) => (
        <SfxCue key={p.label} file="pop.wav" at={p.at} volume={0.35} />
      ))}
      <SfxCue file="snap.wav" at={decide} volume={0.4} />
      <SfxCue file="pop.wav" at={program} volume={0.3} />
      <SfxCue file="click.wav" at={kaise} volume={0.35} />
      <SfxCue file="pop.wav" at={apps} volume={0.3} />
      <SfxCue file="pop.wav" at={speaker} volume={0.35} />

      {/* the Kernel, on "Kernel" */}
      <div style={{ ...abs(L.core), display: "flex", alignItems: "center", justifyContent: "center" }}>
        {frame >= kernel31 ? (
          <Pop at={kernel31}>
            <div style={{ position: "relative", width: 300, height: 300, borderRadius: 40, background: frame >= core ? FL.accentSoft : FL.panel, border: `5px solid ${frame >= core ? FL.accent : FL.panelBorder}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: frame >= core ? "0 0 60px rgba(88,166,255,0.35)" : undefined }}>
              <Pulse at={cue(tl, "3.2", "kernel")} color={FL.accent} radius={40} />
              <Pulse at={core} color={FL.accent} radius={40} />
              <Pulse at={cue(tl, "3.3", "kernel")} color={FL.accent} radius={40} />
              <Pulse at={cue(tl, "3.3", "hardware")} color={FL.highlight} radius={40} />
              <Pulse at={control} color={FL.accent} radius={40} />
              <Pulse at={decide} color={FL.green} radius={40} />
              <Pulse at={cue(tl, "3.5", "kernel")} color={FL.accent} radius={40} />
              <Pulse at={decide35} color={FL.green} radius={40} />
              <Cpu size={110} color={FL.accent} />
              <Txt size={46} weight={800} color={FL.accent}>
                Kernel
              </Txt>
              {frame >= core ? (
                <Pop at={core}>
                  <Txt size={26} weight={700} color={FL.muted}>
                    OS ka core part
                  </Txt>
                </Pop>
              ) : null}
            </div>
          </Pop>
        ) : null}
      </div>

      {/* "control karta hai, jaise CPU, memory aur devices": each cable on its word */}
      {parts.map((p) => {
        const cx = p.side === "left" ? L.left.x + L.left.w : L.right.x;
        const cy = chipY(p.side, p.i) + 40;
        return (
          <div key={p.label}>
            <DrawLine from={p.at} to={p.at + 12} x1={p.side === "left" ? c.x - 150 : c.x + 150} y1={c.y} x2={cx} y2={cy} color={p.color} width={4} arrow={false} />
            <div style={{ position: "absolute", left: p.side === "left" ? L.left.x : L.right.x, top: chipY(p.side, p.i) }}>
              <IconChip at={p.at} icon={p.icon} label={p.label} width={L.left.w} lit={frame >= p.at} color={p.color} pulses={[p.at, resources]} />
            </div>
          </div>
        );
      })}

      {/* "kaunsa program ... kab aur kaise": two programs, the gate lets one through */}
      {frame >= program ? (
        <div style={{ position: "absolute", left: L.right.x, top: L.right.y + 230, width: L.right.w, display: "flex", flexDirection: "column", gap: 12 }}>
          {["Program 1", "Program 2"].map((name, i) => (
            <Pop key={name} at={program + i * 3}>
              <Card accent={i === 0 && gate >= 1 ? FL.green : FL.panelBorder} style={{ position: "relative", padding: "10px 18px", gap: 10, justifyContent: "flex-start" }}>
                {i === 0 ? <Pulse at={use34} color={FL.green} radius={24} /> : null}
                <Layers size={30} color={i === 0 && gate >= 1 ? FL.green : FL.muted} />
                <Txt size={26} weight={700} color={i === 0 && gate >= 1 ? FL.green : FL.muted}>
                  {name}: {i === 0 ? (gate >= 1 ? "abhi" : "...") : frame >= kab ? "wait" : "..."}
                </Txt>
              </Card>
            </Pop>
          ))}
        </div>
      ) : null}

      {/* "do apps ... speaker ... awaaz": two apps want it, the Kernel picks one */}
      {frame >= apps ? (
        <div style={{ position: "absolute", left: L.left.x, top: L.left.y + 330, width: L.left.w, display: "flex", alignItems: "center", gap: 14 }}>
          <Pop at={apps}>
            <Icon name="logos:youtube-icon" size={40} />
          </Pop>
          <Pop at={apps + 3}>
            <Icon name="logos:whatsapp-icon" size={44} />
          </Pop>
          {frame >= speaker ? (
            <Pop at={speaker}>
              <div style={{ position: "relative", display: "flex" }}>
                <Speaker size={56} color={frame >= awaaz ? FL.green : FL.highlight} />
                <Pulse at={awaaz} color={FL.green} radius={14} />
              </div>
            </Pop>
          ) : null}
          {frame >= awaaz ? (
            <Pop at={awaaz}>
              <Txt size={26} weight={800} color={FL.green}>
                YouTube ki awaaz
              </Txt>
            </Pop>
          ) : null}
        </div>
      ) : null}

      <BookLine r={L.quote} text="The kernel is the core part of the operating system" from={book32} to={core + 30} />
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 4: the Shell */

export const SceneShell: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Shell;
  const frame = useCurrentFrame();
  const start = cue(tl, "4.1");
  const shell41 = cue(tl, "4.1", "shell");
  const book42 = cue(tl, "4.2", "book");
  const os42 = cue(tl, "4.2", "operating");
  const outer = cue(tl, "4.2", "outer");
  const user = cue(tl, "4.2", "user");
  const receive = cue(tl, "4.3", "receive");
  const kernel43 = cue(tl, "4.3", "kernel");
  const pass = cue(tl, "4.3", "pass");
  const types = cue(tl, "4.4", "types");
  const n1 = cue(tl, "4.5", "number");
  const graphical = cue(tl, "4.5", "graphical");
  const windows = cue(tl, "4.5", "windows");
  const desktop = cue(tl, "4.5", "desktop");
  const icons = cue(tl, "4.5", "icons");
  const click = cue(tl, "4.5", "click");
  const menus = cue(tl, "4.5", "menus");
  const n2 = cue(tl, "4.6", "number");
  const cmdLine = cue(tl, "4.6", "command");
  const prompt = cue(tl, "4.6", "prompt");
  const terminal = cue(tl, "4.6", "terminal");
  const instructions = cue(tl, "4.6", "instructions");
  const typed = "C:\\> dir notes";
  const shownChars = Math.round(useBetween(instructions, lineEnd(tl, "4.6")) * typed.length);
  const midY = L.ring.y + L.ring.h / 2;
  return (
    <Scene from={start} to={lineEnd(tl, "4.6")}>
      <SfxCue file="pop.wav" at={shell41} volume={0.35} />
      <SfxCue file="thud.wav" at={os42} volume={0.3} />
      <SfxCue file="pop.wav" at={user} volume={0.35} />
      <SfxCue file="whoosh.wav" at={receive} volume={0.3} />
      <SfxCue file="pop.wav" at={kernel43} volume={0.3} />
      <SfxCue file="snap.wav" at={n1} volume={0.4} />
      <SfxCue file="snap.wav" at={n2} volume={0.4} />
      <SfxCue file="click.wav" at={click} volume={0.3} />
      <SfxCue file="click.wav" at={terminal} volume={0.3} />
      {typed.split("").map((_, i) => (
        <SfxCue key={i} file="type.wav" at={instructions + Math.round((i * (lineEnd(tl, "4.6") - instructions)) / typed.length)} volume={0.25} />
      ))}

      {/* the Shell ring on "Shell", the OS box on "Operating System", the Kernel on "Kernel" */}
      <OsBox x={L.ring.x + 140} y={L.ring.y} w={L.ring.w - 140} h={L.ring.h} at={os42} shellAt={shell41} kernelAt={kernel43} shellPulses={[outer, receive]} kernelPulses={[pass + 12]} />
      {frame >= user ? (
        <Pop at={user} style={{ position: "absolute", left: L.ring.x - 10, top: midY - 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Users size={96} color={FL.green} />
          <Txt size={26} weight={700}>
            User
          </Txt>
        </Pop>
      ) : null}
      {/* "receive" then "pass": the command walks in */}
      <FlowDot from={receive} to={receive + 16} x1={L.ring.x + 100} y1={midY} x2={L.ring.x + 230} y2={midY} color={FL.highlight} size={26} />
      <FlowDot from={pass} to={pass + 14} x1={L.ring.x + 230} y1={midY} x2={L.ring.x + L.ring.w / 2 + 70} y2={midY + 30} color={FL.highlight} size={26} />

      {/* the two types */}
      <div style={{ ...abs(L.types), display: "flex", flexDirection: "column", gap: 26, justifyContent: "center" }}>
        <div style={{ height: 54 }}>
          {frame >= types ? (
            <Pop at={types}>
              <Txt size={44} weight={800}>
                Shell ki <span style={{ color: FL.green }}>2 types</span>
              </Txt>
            </Pop>
          ) : null}
        </div>
        <div style={{ height: 150 }}>
          {frame >= n1 ? (
            <Pop at={n1} slide={20}>
              <Card accent={FL.green} style={{ position: "relative", height: 150, padding: "18px 24px", gap: 22, justifyContent: "flex-start" }}>
                <Pulse at={cue(tl, "4.5", "choose")} color={FL.green} radius={20} />
                <div style={{ width: 170, height: 110, flexShrink: 0, position: "relative" }}>
                  {/* "Windows desktop", its icons, a click, a menu: each on its word */}
                  {frame >= windows ? (
                    <Pop at={windows} style={{ position: "absolute", inset: 0 }}>
                      <div style={{ width: 170, height: 110, borderRadius: 10, background: frame >= desktop ? "#0b3a6a" : "#08223d", position: "relative", overflow: "hidden" }}>
                        <Icon name="logos:microsoft-windows-icon" size={30} style={{ position: "absolute", left: 8, bottom: 6 }} />
                        {frame >= icons
                          ? [0, 1, 2].map((k) => (
                              <div key={k} style={{ position: "absolute", left: 12 + k * 50, top: 12, width: 34, height: 34, borderRadius: 8, background: [FL.green, FL.highlight, FL.blue][k] }} />
                            ))
                          : null}
                        {frame >= menus ? <div style={{ position: "absolute", right: 8, bottom: 26, width: 70, height: 50, borderRadius: 6, background: FL.panel, border: `1px solid ${FL.panelBorder}` }} /> : null}
                        {frame >= click ? <MousePointerClick size={28} color={FL.text} style={{ position: "absolute", left: 44, top: 36 }} /> : null}
                      </div>
                    </Pop>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Txt size={34} weight={800} color={FL.green}>
                    1.{frame >= graphical ? " Graphical shell" : ""}
                  </Txt>
                  <Txt size={24} weight={600} color={FL.muted}>
                    {frame >= icons ? "icons pe click" : ""}
                    {frame >= menus ? ", menus" : ""}
                  </Txt>
                </div>
              </Card>
            </Pop>
          ) : null}
        </div>
        <div style={{ height: 150 }}>
          {frame >= n2 ? (
            <Pop at={n2} slide={20}>
              <Card accent={FL.accent} style={{ position: "relative", height: 150, padding: "18px 24px", gap: 22, justifyContent: "flex-start" }}>
                <Pulse at={terminal} color={FL.accent} radius={20} />
                <Pulse at={cue(tl, "4.6", "type")} color={FL.highlight} radius={20} />
                <div style={{ width: 170, height: 110, flexShrink: 0 }}>
                  {frame >= cmdLine ? (
                    <Pop at={cmdLine}>
                      <div style={{ width: 170, height: 110, borderRadius: 10, background: "#010409", border: `1px solid ${FL.panelBorder}`, padding: 10, fontFamily: MONO_FONT, fontSize: 20, color: FL.green }}>
                        <SquareTerminal size={22} color={FL.muted} />
                        <div>
                          {typed.slice(0, frame >= instructions ? shownChars : 0)}
                          {Math.floor(frame / 8) % 2 ? "_" : ""}
                        </div>
                      </div>
                    </Pop>
                  ) : null}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <Txt size={34} weight={800} color={FL.accent}>
                    2.{frame >= cmdLine ? " Command-line shell" : ""}
                  </Txt>
                  <Txt size={24} weight={600} color={FL.text}>
                    {frame >= prompt ? "Command Prompt" : ""}
                    {frame >= terminal ? ", Terminal" : ""}
                  </Txt>
                </div>
              </Card>
            </Pop>
          ) : null}
        </div>
      </div>

      <BookLine r={L.quote} text="The shell is the outer part of the OS that interacts with the user" from={book42} to={user + 10} />
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 5: the whole scenario (book example) */

export const SceneScenario: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Path;
  const frame = useCurrentFrame();
  const start = cue(tl, "5.1");
  const fileW = cue(tl, "5.1", "file");
  const scenario = cue(tl, "5.1", "scenario");
  const book51 = cue(tl, "5.1", "book");
  const open51 = cue(tl, "5.1", "open");
  const kya = cue(tl, "5.1", "kya");
  const n1 = cue(tl, "5.2", "number");
  const click52 = cue(tl, "5.2", "click");
  const os52 = cue(tl, "5.2", "operating");
  const shell52 = cue(tl, "5.2", "shell");
  const receive52 = cue(tl, "5.2", "receive");
  const n2 = cue(tl, "5.3", "number");
  const kernel53 = cue(tl, "5.3", "kernel");
  const pass53 = cue(tl, "5.3", "pass");
  const n3 = cue(tl, "5.4", "number");
  const hard = cue(tl, "5.4", "hard");
  const read = cue(tl, "5.4", "read");
  const cpuW = cue(tl, "5.4", "cpu");
  const memW = cue(tl, "5.4", "memory");
  const lagata = cue(tl, "5.4", "lagata");
  const n4 = cue(tl, "5.5", "number");
  const screen = cue(tl, "5.5", "screen");
  const bhejta = cue(tl, "5.5", "bhejta");
  const open = cue(tl, "5.5", "open");
  const cmd56 = cue(tl, "5.6", "command");
  const shell56 = cue(tl, "5.6", "shell");
  const kernel56 = cue(tl, "5.6", "kernel");
  const hw56 = cue(tl, "5.6", "hardware");
  const result = cue(tl, "5.6", "result");
  const wapas = cue(tl, "5.6", "wapas");
  const hw56b = cue(tl, "5.6", "hardware", 1);
  const kernel56c = cue(tl, "5.6", "kernel", 2);
  const shell56b = cue(tl, "5.6", "shell", 1);
  const tum56 = cue(tl, "5.6", "tum");
  const a57 = cue(tl, "5.7", "a");
  const type57 = cue(tl, "5.7", "type");
  const shell57 = cue(tl, "5.7", "shell");
  const kernel57 = cue(tl, "5.7", "kernel");
  const hw57 = cue(tl, "5.7", "hardware");
  const aScreen = cue(tl, "5.7", "screen");
  const f = centre(L.file);
  const o = centre(L.os);
  const s = centre(L.screen);
  const hwX = L.hw.x + L.hw.w / 2;
  const opened = useBetween(open, open + 14);
  const hops: { at: number; x1: number; y1: number; x2: number; y2: number; color: string }[] = [
    { at: receive52, x1: f.x + 90, y1: f.y, x2: L.os.x + 40, y2: o.y, color: FL.green },
    { at: pass53, x1: L.os.x + 70, y1: o.y, x2: o.x - 60, y2: o.y + 30, color: FL.green },
    { at: read, x1: o.x + 60, y1: o.y + 30, x2: L.hw.x, y2: o.y, color: FL.accent },
    { at: bhejta, x1: L.hw.x + L.hw.w, y1: o.y, x2: L.screen.x, y2: s.y, color: FL.accent },
  ];
  const hwChips = [
    { at: hard, icon: <HardDrive size={40} color={FL.highlight} />, label: "Hard drive", color: FL.highlight, pulses: [read, hw56, hw57] },
    { at: cpuW, icon: <Cpu size={40} color={FL.accent} />, label: "CPU", color: FL.accent, pulses: [cpuW, lagata, hw56 + 3, hw57 + 3] },
    { at: memW, icon: <MemoryStick size={40} color={FL.blue} />, label: "Memory", color: FL.blue, pulses: [memW, lagata + 4, hw56 + 6, hw57 + 6] },
  ];
  const arrow = <span style={{ color: FL.muted }}>&gt;</span>;
  return (
    <Scene from={start} to={lineEnd(tl, "5.7")}>
      <SfxCue file="pop.wav" at={fileW} volume={0.35} />
      {[n1, n2, n3, n4].map((at, i) => (
        <SfxCue key={i} file="snap.wav" at={at} volume={0.4} />
      ))}
      <SfxCue file="click.wav" at={click52} volume={0.35} />
      <SfxCue file="thud.wav" at={os52} volume={0.3} />
      {hwChips.map((c) => (
        <SfxCue key={c.label} file="pop.wav" at={c.at} volume={0.3} />
      ))}
      <SfxCue file="pop.wav" at={screen} volume={0.35} />
      <SfxCue file="pop.wav" at={open} volume={0.4} />
      <SfxCue file="whoosh.wav" at={wapas} volume={0.35} />
      <SfxCue file="type.wav" at={type57} volume={0.3} />
      <SfxCue file="thud.wav" at={aScreen} volume={0.4} />

      {/* the file, on "file" */}
      <div style={{ ...abs(L.file), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        {frame >= fileW ? (
          <Pop at={fileW} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <FileText size={120} color={FL.text} />
              {frame >= click52 ? <MousePointerClick size={48} color={FL.highlight} style={{ position: "absolute", right: -20, bottom: -10 }} /> : null}
              <Pulse at={click52} color={FL.highlight} radius={20} />
              <Pulse at={tum56} color={FL.green} radius={20} />
            </div>
            <Txt size={30} weight={700}>
              notes.txt
            </Txt>
          </Pop>
        ) : null}
      </div>

      <OsBox x={L.os.x} y={L.os.y} w={L.os.w} h={L.os.h} at={os52} shellAt={shell52} kernelAt={kernel53} shellPulses={[receive52, cue(tl, "5.3", "shell"), cue(tl, "5.5", "shell"), shell56, shell56b, shell57]} kernelPulses={[pass53, n3, cue(tl, "5.5", "kernel"), kernel56, kernel56c, kernel57]} />

      {/* hardware: hard drive, CPU, memory, each on its word (fixed slots, nothing jumps) */}
      <div style={{ ...abs(L.hw), display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
        {hwChips.map((c) => (
          <div key={c.label} style={{ height: 84 }}>
            <IconChip at={c.at} icon={c.icon} label={c.label} width={L.hw.w} lit color={c.color} pulses={c.pulses} />
          </div>
        ))}
      </div>

      {/* the screen on "screen": the file opens, then the A from the hook */}
      <div style={{ ...abs(L.screen), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        {frame >= screen ? (
          <Pop at={screen} style={{ position: "relative" }}>
            <Monitor size={260} color={FL.blue} strokeWidth={1.3} />
            <Pulse at={cue(tl, "5.5", "jati")} color={FL.blue} radius={20} />
            {frame >= open && frame < a57 ? (
              <div style={{ position: "absolute", left: 130 - 90 * opened, top: 108 - 55 * opened, width: 180 * opened, height: 110 * opened, borderRadius: 8, background: FL.panel, border: `2px solid ${FL.text}`, padding: 8, overflow: "hidden" }}>
                {[0, 1, 2].map((k) => (
                  <div key={k} style={{ height: 8, width: `${90 - k * 20}%`, borderRadius: 4, background: FL.muted, marginBottom: 10 }} />
                ))}
              </div>
            ) : null}
            {frame >= aScreen ? (
              <Pop at={aScreen} style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center" }}>
                <Txt size={110} weight={800}>
                  A
                </Txt>
              </Pop>
            ) : null}
          </Pop>
        ) : null}
        {frame >= aScreen ? (
          <Pop at={aScreen}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SquareCheckBig size={40} color={FL.green} />
              <Txt size={30} weight={800} color={FL.green}>
                Hardware tak pohncha!
              </Txt>
            </div>
          </Pop>
        ) : null}
      </div>

      {/* the four hops, each on its action word, then the result back */}
      {hops.map((hp, i) => (
        <div key={i}>
          <DrawLine from={hp.at} to={hp.at + 12} x1={hp.x1} y1={hp.y1} x2={hp.x2} y2={hp.y2} color={hp.color} width={5} />
          <FlowDot from={hp.at} to={hp.at + 16} x1={hp.x1} y1={hp.y1} x2={hp.x2} y2={hp.y2} color={FL.highlight} size={22} />
        </div>
      ))}
      <FlowDot from={cue(tl, "5.3", "command")} to={cue(tl, "5.3", "command") + 14} x1={L.os.x + 40} y1={o.y} x2={L.os.x + 90} y2={o.y} color={FL.highlight} size={22} />
      <FlowDot from={shell56} to={shell56 + 14} x1={L.os.x + 40} y1={o.y} x2={o.x} y2={o.y + 30} color={FL.highlight} size={22} />
      <FlowDot from={hw56} to={hw56 + 14} x1={o.x + 60} y1={o.y + 30} x2={L.hw.x} y2={o.y} color={FL.highlight} size={22} />
      <FlowDot from={hw56b} to={hw56b + 16} x1={hwX} y1={o.y + 120} x2={o.x} y2={o.y + 120} color={FL.green} size={22} />
      <FlowDot from={shell56b} to={shell56b + 16} x1={o.x} y1={o.y + 120} x2={f.x} y2={f.y + 120} color={FL.green} size={22} />
      <FlowDot from={type57} to={type57 + 16} x1={f.x + 90} y1={f.y} x2={L.os.x + 40} y2={o.y} color={FL.highlight} size={22} />

      {/* 5.6 / 5.7 said as a path: each stop appears on its word */}
      <div style={{ ...abs(L.caption), display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* 5.1 "poora scenario ... book ki example ... file open karte ho, to kya hota hai?" */}
        {frame >= cue(tl, "5.1", "poora") && frame < n1 ? (
          <Trail
            size={36}
            items={[
              { at: cue(tl, "5.1", "poora"), node: "Poora" },
              { at: scenario, node: "scenario" },
              { at: cue(tl, "5.1", "dekhte"), node: "dekhte hain," },
              { at: book51, node: <><BookOpen size={38} color={FL.highlight} style={{ verticalAlign: "middle" }} /> book ki example:</> },
              { at: open51, node: <span style={{ color: FL.highlight }}>file open</span> },
              { at: kya, node: "karo to kya hota hai?" },
            ]}
          />
        ) : null}
        {/* "Number ek ... chaar": the steps, each number on its word */}
        {frame >= n1 && frame < cmd56 ? (
          <div style={{ display: "flex", gap: 22 }}>
            {[n1, n2, n3, n4].map((at, i) =>
              frame >= at ? (
                <Pop key={i} at={at}>
                  <div style={{ width: 84, height: 84, borderRadius: 42, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${i === [n1, n2, n3, n4].filter((t) => frame >= t).length - 1 ? FL.highlight : FL.panelBorder}`, background: FL.panel }}>
                    <Txt size={44} weight={800} color={i === [n1, n2, n3, n4].filter((t) => frame >= t).length - 1 ? FL.highlight : FL.muted}>
                      {i + 1}
                    </Txt>
                  </div>
                </Pop>
              ) : (
                <div key={i} style={{ width: 84, height: 84 }} />
              )
            )}
          </div>
        ) : null}
        {frame >= cmd56 && frame < a57 ? (
          <Trail
            size={34}
            items={[
              { at: cmd56, node: "Command:" },
              { at: shell56, node: <span style={{ color: FL.green }}>Shell</span> },
              { at: kernel56, node: <>{arrow} <span style={{ color: FL.accent }}>Kernel</span></> },
              { at: hw56, node: <>{arrow} hardware.</> },
              { at: result, node: <span style={{ marginLeft: 24 }}>Result:</span> },
              { at: hw56b, node: "hardware" },
              { at: kernel56c, node: <>{arrow} <span style={{ color: FL.accent }}>Kernel</span></> },
              { at: shell56b, node: <>{arrow} <span style={{ color: FL.green }}>Shell</span></> },
              { at: tum56, node: <>{arrow} tum</> },
            ]}
          />
        ) : null}
        {frame >= a57 ? (
          <Trail
            size={38}
            items={[
              { at: a57, node: <><Keyboard size={40} color={FL.highlight} style={{ verticalAlign: "middle" }} /> Tumhara <span style={{ color: FL.highlight }}>A</span>:</> },
              { at: shell57, node: <span style={{ color: FL.green }}>Shell</span> },
              { at: kernel57, node: <>{arrow} <span style={{ color: FL.accent }}>Kernel</span></> },
              { at: aScreen, node: <>{arrow} screen</> },
            ]}
          />
        ) : null}
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 6: the book's diagram (Figure 1.1) */

export const SceneDiagram: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Diagram;
  const frame = useCurrentFrame();
  const start = cue(tl, "6.1");
  const book61 = cue(tl, "6.1", "book");
  const diagram = cue(tl, "6.1", "diagram");
  const upar = cue(tl, "6.2", "upar");
  const user = cue(tl, "6.2", "user");
  const applications = cue(tl, "6.2", "applications");
  const os = cue(tl, "6.2", "operating");
  const neeche = cue(tl, "6.2", "neeche");
  const hardware = cue(tl, "6.2", "hardware");
  const os63 = cue(tl, "6.3", "operating");
  const shell = cue(tl, "6.3", "shell");
  const userSide = cue(tl, "6.3", "user");
  const kernel = cue(tl, "6.3", "kernel");
  const hwSide = cue(tl, "6.3", "hardware");
  return (
    <Scene from={start} to={lineEnd(tl, "6.3")}>
      <SfxCue file="pop.wav" at={book61} volume={0.35} />
      <SfxCue file="click.wav" at={diagram} volume={0.35} />
      <SfxCue file="pop.wav" at={user} volume={0.35} />
      <SfxCue file="pop.wav" at={os} volume={0.35} />
      <SfxCue file="pop.wav" at={hardware} volume={0.35} />
      <SfxCue file="pop.wav" at={shell} volume={0.35} />
      <SfxCue file="snap.wav" at={kernel} volume={0.4} />

      {/* "Tumhari book yahi baat ek diagram se dikhati hai": the book opens, then its figure */}
      {frame >= book61 && frame < upar ? (
        <div style={{ ...abs(L.os), display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <Pop at={book61}>
            <BookOpen size={150} color={FL.highlight} strokeWidth={1.4} />
          </Pop>
          {frame >= diagram ? (
            <Pop at={diagram}>
              <Txt size={48} weight={800}>
                Figure 1.1
              </Txt>
            </Pop>
          ) : null}
        </div>
      ) : null}
      {frame >= diagram ? (
        <Pop at={diagram} style={{ ...abs(L.caption), display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <Txt size={24} weight={600} color={FL.dim}>
            Book, Figure 1.1
          </Txt>
        </Pop>
      ) : null}

      {/* "sab se upar user aur applications" */}
      {frame >= upar ? (
        <Pop at={upar} style={{ position: "absolute", left: L.user.x - 110, top: L.user.y + L.user.h / 2 - 40 }}>
          <ArrowUp size={80} color={FL.highlight} />
        </Pop>
      ) : null}
      <div style={{ ...abs(L.user), display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        {frame >= user ? (
          <Pop at={user} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Users size={72} color={FL.text} />
            <Txt size={38} weight={800}>
              User
            </Txt>
          </Pop>
        ) : null}
        {frame >= applications ? (
          <Pop at={applications} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Monitor size={64} color={FL.text} />
            <Txt size={38} weight={800}>
              + Applications
            </Txt>
          </Pop>
        ) : null}
      </div>
      <OsBox x={L.os.x} y={L.os.y} w={L.os.w} h={L.os.h} at={os} shellAt={shell} kernelAt={kernel} shellPulses={[os63, userSide]} kernelPulses={[hwSide]} />
      {/* "sab se neeche hardware" */}
      {frame >= neeche ? (
        <Pop at={neeche} style={{ position: "absolute", left: L.hw.x - 110, top: L.hw.y + L.hw.h / 2 - 40 }}>
          <ArrowDown size={80} color={FL.highlight} />
        </Pop>
      ) : null}
      {frame >= hardware ? (
        <Pop at={hardware} slide={30} style={{ ...abs(L.hw), display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <Printer size={70} color={FL.highlight} />
          <Cpu size={70} color={FL.accent} />
          <Txt size={38} weight={800}>
            Hardware
          </Txt>
        </Pop>
      ) : null}
      {/* arrows: the Shell faces the user, the Kernel faces the hardware */}
      <DrawLine from={userSide} to={userSide + 12} x1={L.os.x + L.os.w / 2} y1={L.os.y + 40} x2={L.os.x + L.os.w / 2} y2={L.user.y + L.user.h} color={FL.green} />
      <DrawLine from={hwSide} to={hwSide + 12} x1={L.os.x + L.os.w / 2} y1={L.os.y + L.os.h - 30} x2={L.os.x + L.os.w / 2} y2={L.hw.y} color={FL.accent} />
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 7: the car */

export const SceneCar: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Car;
  const frame = useCurrentFrame();
  const start = cue(tl, "7.1");
  const book71 = cue(tl, "7.1", "book");
  const carW = cue(tl, "7.1", "car");
  const engine = cue(tl, "7.2", "engine");
  const kernel72 = cue(tl, "7.2", "kernel");
  const asal = cue(tl, "7.2", "asal");
  const steering = cue(tl, "7.3", "steering");
  const dashboard = cue(tl, "7.3", "dashboard");
  const shell73 = cue(tl, "7.3", "shell");
  const driver73 = cue(tl, "7.3", "driver");
  const control73 = cue(tl, "7.3", "control");
  const engine74 = cue(tl, "7.4", "engine");
  const directly = cue(tl, "7.4", "directly");
  const steering2 = cue(tl, "7.4", "steering");
  const engine74b = cue(tl, "7.4", "engine", 1);
  const driver75 = cue(tl, "7.5", "driver");
  const you = cue(tl, "7.5", "tum");
  const spin = (frame - engine) * (frame >= steering2 ? 9 : 4);
  const wheel = frame >= control73 ? Math.sin((frame - control73) / 6) * 40 : 0;
  const needle = interpolate(frame, [dashboard, dashboard + 20], [-60, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drive = interpolate(frame, [carW, carW + 18], [-300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Scene from={start} to={lineEnd(tl, "7.5")}>
      <SfxCue file="pop.wav" at={book71} volume={0.3} />
      <SfxCue file="whoosh.wav" at={carW} volume={0.35} />
      <SfxCue file="snap.wav" at={engine} volume={0.4} />
      <SfxCue file="click.wav" at={steering} volume={0.4} />
      <SfxCue file="pop.wav" at={driver73} volume={0.35} />
      <SfxCue file="zap.wav" at={directly} volume={0.35} />
      <SfxCue file="ting.wav" at={you} volume={0.35} />

      {/* "Tumhari book ... samjhati hai" */}
      {frame >= book71 && frame < engine ? (
        <Pop at={book71} style={{ ...abs(L.engine), display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <BookOpen size={90} color={FL.highlight} strokeWidth={1.4} />
          <Txt size={34} weight={700} color={FL.muted}>
            Book ki example
          </Txt>
        </Pop>
      ) : null}

      <div style={{ ...abs(L.car), display: "flex", alignItems: "center", justifyContent: "center" }}>
        {frame >= carW ? (
          <div style={{ transform: `translateX(${drive}px)`, opacity: interpolate(frame, [carW, carW + 6], [0, 1], { extrapolateRight: "clamp" }) }}>
            <Car size={420} color={FL.muted} strokeWidth={1.2} />
          </div>
        ) : null}
        {frame >= directly ? (
          <Pop at={directly} style={{ position: "absolute", left: L.car.w / 2 - 40, top: 120, display: "flex", alignItems: "center", gap: 8 }}>
            <Hand size={70} color={FL.text} />
            <Txt size={80} weight={800} color={FL.red}>
              ×
            </Txt>
          </Pop>
        ) : null}
        {/* the driver, on "driver"; "Aur yahan driver tum ho" */}
        {frame >= driver73 ? (
          <Pop at={driver73} slide={16} style={{ position: "absolute", left: 0, right: 0, bottom: 10, display: "flex", justifyContent: "center" }}>
            <Card accent={frame >= you ? FL.highlight : FL.panelBorder} style={{ position: "relative", padding: "12px 26px", gap: 16 }}>
              <User size={46} color={FL.highlight} />
              <Txt size={40} weight={800} color={frame >= you ? FL.highlight : FL.text}>
                {frame >= you ? "Driver = Tum" : "Driver"}
              </Txt>
              <Pulse at={cue(tl, "7.4", "driver")} color={FL.text} radius={20} />
              <Pulse at={driver75} color={FL.highlight} radius={20} />
              <Pulse at={you} color={FL.highlight} radius={20} />
            </Card>
          </Pop>
        ) : null}
      </div>
      {frame >= engine ? (
        <Pop at={engine} slide={20} style={abs(L.engine)}>
          <Card accent={FL.accent} style={{ position: "relative", width: L.engine.w, height: L.engine.h, gap: 34, background: FL.accentSoft }}>
            <Pulse at={engine74} color={FL.accent} radius={24} />
            <Pulse at={engine74b} color={FL.accent} radius={24} />
            <Cog size={150} color={FL.accent} style={{ transform: `rotate(${spin}deg)` }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Txt size={54} weight={800} color={FL.accent}>
                Engine{frame >= kernel72 ? " = Kernel" : ""}
              </Txt>
              <Txt size={28} weight={600} color={FL.muted}>
                {frame >= asal ? "asal kaam" : ""}
              </Txt>
            </div>
          </Card>
        </Pop>
      ) : null}
      {frame >= steering ? (
        <Pop at={steering} slide={20} style={abs(L.dash)}>
          <Card accent={FL.green} style={{ width: L.dash.w, height: L.dash.h, gap: 30 }}>
            <div style={{ transform: `rotate(${wheel}deg)`, display: "flex" }}>
              <Icon name="mdi:steering" size={130} color={FL.green} />
            </div>
            {frame >= dashboard ? (
              <Pop at={dashboard}>
                <Gauge size={110} color={FL.highlight} style={{ transform: `rotate(${needle}deg)` }} />
              </Pop>
            ) : null}
            <Txt size={44} weight={800} color={FL.green} style={{ whiteSpace: "nowrap", minWidth: 150 }}>
              {frame >= shell73 ? "= Shell" : ""}
            </Txt>
          </Card>
        </Pop>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 8: a common mistake */

export const SceneMistake: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Mistake;
  const frame = useCurrentFrame();
  const start = cue(tl, "8.1");
  const common = cue(tl, "8.1", "common");
  const mistake = cue(tl, "8.1", "mistake");
  const students = cue(tl, "8.1", "students");
  const shell81 = cue(tl, "8.1", "shell");
  const command81 = cue(tl, "8.1", "command");
  const black = cue(tl, "8.1", "black");
  const windows = cue(tl, "8.2", "windows");
  const shell82 = cue(tl, "8.2", "shell");
  const graphical = cue(tl, "8.2", "graphical");
  const dono = cue(tl, "8.2", "dono");
  return (
    <Scene from={start} to={lineEnd(tl, "8.2")}>
      <SfxCue file="zap.wav" at={mistake} volume={0.45} />
      <SfxCue file="pop.wav" at={students} volume={0.3} />
      <SfxCue file="pop.wav" at={shell81} volume={0.3} />
      <SfxCue file="pop.wav" at={windows} volume={0.35} />
      <SfxCue file="thud.wav" at={dono} volume={0.4} />
      <div style={{ ...abs(L.title), display: "flex", alignItems: "center" }}>
        {frame >= common ? (
          <Pop at={common} slide={-30}>
            <Txt size={64} weight={800}>
              Common {frame >= mistake ? <span style={{ color: FL.red }}>mistake</span> : null}
            </Txt>
          </Pop>
        ) : null}
        {frame >= students ? (
          <Pop at={students} style={{ marginLeft: 40, display: "flex", alignItems: "center", gap: 12 }}>
            <Users size={56} color={FL.muted} />
            <Txt size={34} weight={700} color={FL.muted}>
              bohat se students
            </Txt>
          </Pop>
        ) : null}
      </div>
      {frame >= shell81 ? (
        <Pop at={shell81} style={{ ...abs(L.terminal), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ position: "relative", width: 520, height: 320, borderRadius: 16, background: frame >= black ? "#010409" : FL.panel, border: `2px solid ${FL.panelBorder}`, padding: 22, fontFamily: MONO_FONT, fontSize: 30, color: FL.green }}>
            {frame >= command81 ? <>C:\&gt; _</> : null}
            <Pulse at={command81} color={FL.green} radius={16} />
            <Pulse at={black} color={FL.red} radius={16} />
          </div>
          <Txt size={40} weight={800} color={frame >= dono ? FL.green : frame >= black ? FL.red : FL.text}>
            {frame >= dono ? "Shell" : frame >= black ? "Sirf yeh Shell?" : frame >= command81 ? "Command Prompt" : "Shell?"}
          </Txt>
        </Pop>
      ) : null}
      {frame >= windows ? (
        <Pop at={windows} style={{ ...abs(L.desktop), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ width: 520, height: 320, borderRadius: 16, background: "#0b3a6a", border: `2px solid ${FL.panelBorder}`, position: "relative", overflow: "hidden" }}>
            {[0, 1, 2, 3].map((k) => (
              <div key={k} style={{ position: "absolute", left: 24 + k * 90, top: 24, width: 64, height: 64, borderRadius: 12, background: [FL.green, FL.highlight, FL.blue, FL.purple][k] }} />
            ))}
            <Icon name="logos:microsoft-windows-icon" size={48} style={{ position: "absolute", left: 18, bottom: 14 }} />
          </div>
          <Txt size={40} weight={800} color={frame >= shell82 ? FL.green : FL.text}>
            {frame >= graphical ? "Shell (graphical)" : frame >= shell82 ? "Shell" : "Windows desktop"}
          </Txt>
        </Pop>
      ) : null}
      {frame >= dono
        ? [L.terminal, L.desktop].map((r, i) => (
            <Pop key={i} at={dono + i * 3} style={{ position: "absolute", left: r.x + r.w - 110, top: r.y + 10 }}>
              <SquareCheckBig size={72} color={FL.green} />
            </Pop>
          ))
        : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 9: recap */

export const SceneRecap: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2Os;
  const frame = useCurrentFrame();
  const start = cue(tl, "9.1");
  const shell91 = cue(tl, "9.1", "shell");
  const kernel91 = cue(tl, "9.1", "kernel");
  const os91 = cue(tl, "9.1", "operating");
  const parts = cue(tl, "9.1", "parts");
  const shell92 = cue(tl, "9.2", "shell");
  const outer = cue(tl, "9.2", "outer");
  const tumhari = cue(tl, "9.2", "tumhari");
  const commands92 = cue(tl, "9.2", "commands");
  const kernel92 = cue(tl, "9.2", "kernel");
  const core = cue(tl, "9.2", "core");
  const hw92 = cue(tl, "9.2", "hardware");
  const control92 = cue(tl, "9.2", "control");
  const kaam92 = cue(tl, "9.2", "kaam");
  const box = { ...L.os, h: L.os.h - 160 };
  const bc = centre(box);
  return (
    <Scene from={start} to={lineEnd(tl, "9.2")}>
      <SfxCue file="pop.wav" at={shell91} volume={0.35} />
      <SfxCue file="pop.wav" at={kernel91} volume={0.35} />
      <SfxCue file="snap.wav" at={parts} volume={0.4} />
      <SfxCue file="pop.wav" at={outer} volume={0.35} />
      <SfxCue file="whoosh.wav" at={commands92} volume={0.3} />
      <SfxCue file="thud.wav" at={core} volume={0.4} />
      <SfxCue file="pop.wav" at={hw92} volume={0.35} />

      <OsBox x={box.x} y={box.y} w={box.w} h={box.h} at={os91} shellAt={shell91} kernelAt={kernel91} shellPulses={[parts, shell92, outer, commands92 + 16]} kernelPulses={[parts, kernel92, core]} />

      {/* "tumhari commands leta hai": the user sends one in */}
      {frame >= tumhari ? (
        <Pop at={tumhari} style={{ ...abs(L.user), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Users size={120} color={FL.green} />
          <Txt size={32} weight={700}>
            User (tum)
          </Txt>
        </Pop>
      ) : null}
      <FlowDot from={commands92} to={commands92 + 16} x1={L.user.x + L.user.w - 20} y1={bc.y} x2={box.x + 70} y2={bc.y} color={FL.highlight} />
      {/* "hardware ko control karke woh kaam karwata hai" */}
      {frame >= hw92 ? (
        <div style={{ ...abs(L.hardware), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          {[<Cpu key="c" size={70} color={FL.accent} />, <MemoryStick key="m" size={70} color={FL.blue} />, <Printer key="p" size={70} color={FL.highlight} />].map((ic, i) => (
            <Pop key={i} at={hw92 + i * 3}>
              <div style={{ position: "relative", display: "flex" }}>
                {ic}
                <Pulse at={control92 + i * 3} color={FL.accent} radius={14} />
                <Pulse at={kaam92 + i * 3} color={FL.green} radius={14} />
              </div>
            </Pop>
          ))}
        </div>
      ) : null}
      <FlowDot from={control92} to={control92 + 16} x1={box.x + box.w - 70} y1={bc.y} x2={L.hardware.x + 20} y2={bc.y} color={FL.accent} />

      {/* the two lines in his exact words, built word by word */}
      <div style={{ position: "absolute", left: 210, top: L.os.y + L.os.h - 140, width: 1500, display: "flex", flexDirection: "column", gap: 12 }}>
        <Trail
          size={32}
          gap={10}
          items={[
            { at: shell92, node: <span style={{ color: FL.green }}>Shell</span> },
            { at: outer, node: "outer part hai," },
            { at: cue(tl, "9.2", "jo"), node: "jo" },
            { at: tumhari, node: "tumhari commands leta hai." },
          ]}
        />
        <Trail
          size={32}
          gap={10}
          items={[
            { at: cue(tl, "9.2", "aur"), node: "Aur" },
            { at: kernel92, node: <span style={{ color: FL.accent }}>Kernel</span> },
            { at: cue(tl, "9.2", "is"), node: "is ka" },
            { at: core, node: "core part hai," },
            { at: cue(tl, "9.2", "jo", 1), node: "jo" },
            { at: hw92, node: "hardware ko" },
            { at: control92, node: "control karke" },
            { at: cue(tl, "9.2", "woh"), node: <span style={{ color: FL.green }}>woh kaam karwata hai.</span> },
          ]}
        />
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 10: question, website, next, full series, follow */

export const SceneEnd: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.p2End;
  const frame = useCurrentFrame();
  const start = cue(tl, "10.1");
  const comments = cue(tl, "10.1", "comments");
  const cmd101 = cue(tl, "10.1", "command");
  const type101 = cue(tl, "10.1", "type");
  const kaunsa = cue(tl, "10.1", "kaunsa");
  const receive101 = cue(tl, "10.1", "receive");
  const shell101 = cue(tl, "10.1", "shell");
  const kernel101 = cue(tl, "10.1", "kernel");
  const items = [
    { at: cue(tl, "10.2", "mcqs"), label: "MCQs" },
    { at: cue(tl, "10.2", "short"), label: "+ short questions" },
    { at: cue(tl, "10.2", "notes"), label: "+ notes" },
  ];
  const website = cue(tl, "10.2", "website");
  const visit = cue(tl, "10.2", "visit");
  const agli = cue(tl, "10.3", "agli");
  const os103 = cue(tl, "10.3", "operating");
  const decide = cue(tl, "10.3", "decide");
  const cpu103 = cue(tl, "10.3", "cpu");
  const apps103 = cue(tl, "10.3", "apps");
  const order = cue(tl, "10.3", "order");
  const process = cue(tl, "10.3", "process");
  const animated = cue(tl, "10.4", "animated");
  const concepts = cue(tl, "10.4", "concepts");
  const series = cue(tl, "10.4", "full");
  const detailed = cue(tl, "10.4", "detailed");
  const interesting = cue(tl, "10.4", "interesting");
  const follow = cue(tl, "10.5", "follow");
  const subscribe = cue(tl, "10.5", "subscribe");
  const launch = cue(tl, "10.5", "launch");
  const access = cue(tl, "10.5", "access");
  const website105 = cue(tl, "10.5", "website");
  const quizzes = cue(tl, "10.5", "quizzes");
  const shortQ = cue(tl, "10.5", "short");
  const longQ = cue(tl, "10.5", "long");
  const practice = cue(tl, "10.5", "practice");
  const end = lineEnd(tl, "10.6");
  const pulse = frame >= follow ? 1 + 0.06 * Math.sin((frame - follow) / 4) : 1;
  const ticks = [
    { at: detailed, label: "Detailed" },
    { at: interesting, label: "Interesting" },
  ];
  return (
    <Scene from={start} to={end + 6}>
      <SfxCue file="pop.wav" at={comments} volume={0.4} />
      <SfxCue file="ting.wav" at={shell101} volume={0.3} />
      <SfxCue file="ting.wav" at={kernel101} volume={0.3} />
      {items.map((it) => (
        <SfxCue key={it.label} file="tick.wav" at={it.at} volume={0.3} />
      ))}
      <SfxCue file="thud.wav" at={website} volume={0.4} />
      <SfxCue file="pop.wav" at={agli} volume={0.35} />
      <SfxCue file="pop.wav" at={animated} volume={0.35} />
      <SfxCue file="whoosh.wav" at={series} volume={0.35} />
      {ticks.map((t) => (
        <SfxCue key={t.label} file="tick.wav" at={t.at} volume={0.35} />
      ))}
      <SfxCue file="snap.wav" at={follow} volume={0.45} />
      <SfxCue file="tick.wav" at={quizzes} volume={0.3} />

      {/* "comments mein batao": the question, built on its words */}
      {frame >= comments ? (
        <div style={abs(L.question)}>
          <Pop at={comments}>
            <Card accent={FL.highlight} style={{ position: "relative", height: L.question.h, flexDirection: "column", gap: 12, padding: "0 50px" }}>
              <Pulse at={receive101} color={FL.highlight} radius={20} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MessageSquareText size={34} color={FL.accent} />
                <Txt size={28} weight={700} color={FL.accent}>
                  Comments mein batao
                </Txt>
              </div>
              <Trail
                size={38}
                items={[
                  { at: cmd101, node: "Command Prompt mein" },
                  { at: type101, node: <span style={{ color: FL.highlight }}>command type ki:</span> },
                  { at: kaunsa, node: "is ka kaunsa part" },
                  { at: receive101, node: <span style={{ color: FL.highlight }}>receive karta hai?</span> },
                  { at: shell101, node: <span style={{ display: "inline-block", color: FL.green, transform: `scale(${kick(frame, shell101)})` }}>Shell</span> },
                  { at: kernel101, node: <>ya <span style={{ display: "inline-block", color: FL.accent, transform: `scale(${kick(frame, kernel101)})` }}>Kernel</span>?</> },
                ]}
              />
            </Card>
          </Pop>
        </div>
      ) : null}

      {/* "MCQs, short questions aur notes maine website pe" */}
      {frame >= items[0]!.at ? (
        <div style={{ ...abs(L.web), display: "flex", justifyContent: "center" }}>
          <Pop at={items[0]!.at} slide={20}>
            <Card accent={FL.accent} style={{ position: "relative", height: L.web.h, padding: "0 44px", gap: 28, background: FL.accentSoft }}>
              <Pulse at={website105} color={FL.accent} radius={24} />
              <Txt size={32} weight={700} color={FL.highlight}>
                {items
                  .filter((it) => frame >= it.at)
                  .map((it) => it.label)
                  .join(" ")}
              </Txt>
              {frame >= website ? (
                <Pop at={website}>
                  <Txt size={46} weight={800} color={FL.accent}>
                    {BRAND.website}
                  </Txt>
                </Pop>
              ) : null}
              {frame >= visit ? (
                <Pop at={visit}>
                  <Txt size={28} weight={800} color={FL.green}>
                    Abhi visit karo
                  </Txt>
                </Pop>
              ) : null}
            </Card>
          </Pop>
        </div>
      ) : null}

      {/* "OS ki agli video": the next topic, on its words */}
      {frame >= agli ? (
        <div style={{ ...abs(L.next), display: "flex", justifyContent: "center" }}>
          <Pop at={agli} slide={20}>
            <Card style={{ position: "relative", height: L.next.h, padding: "0 36px", gap: 18 }}>
              <div style={{ position: "relative", display: "flex", width: 44 }}>
                {frame >= cpu103 ? (
                  <Pop at={cpu103}>
                    <Cpu size={44} color={FL.accent} />
                  </Pop>
                ) : null}
              </div>
              <Trail
                size={32}
                gap={10}
                items={[
                  { at: agli, node: "Agli video:" },
                  { at: os103, node: <span style={{ color: FL.accent }}>OS</span> },
                  { at: decide, node: <span style={{ color: FL.accent }}>decide karta hai,</span> },
                  { at: cpu103, node: "CPU" },
                  { at: apps103, node: "apps ko" },
                  { at: order, node: <>kis <span style={{ color: FL.highlight }}>order</span> mein</> },
                  { at: process, node: "process kare" },
                ]}
              />
            </Card>
          </Pop>
        </div>
      ) : null}

      {/* "yeh animated series sirf concepts ko samjhane ke liye hai" */}
      {frame >= animated && frame < series ? (
        <div style={{ ...abs(L.series), display: "flex", justifyContent: "center" }}>
          <Pop at={animated} slide={30}>
            <Card style={{ height: L.series.h, padding: "0 40px", gap: 24 }}>
              <Clapperboard size={56} color={FL.highlight} />
              <Txt size={38} weight={800}>
                Animated series{frame >= concepts ? " = " : ""}
                {frame >= concepts ? <span style={{ display: "inline-block", color: FL.highlight, transform: `scale(${kick(frame, concepts)})` }}>sirf concepts</span> : null}
              </Txt>
            </Card>
          </Pop>
        </div>
      ) : null}
      {/* "meri full lecture series ... detailed aur interesting"; "jab woh series launch ho" */}
      {frame >= series ? (
        <div style={{ ...abs(L.series), display: "flex", justifyContent: "center" }}>
          <Pop at={series} slide={30}>
            <Card accent={FL.purple} style={{ position: "relative", height: L.series.h, padding: "0 40px", gap: 30 }}>
              <Pulse at={launch} color={FL.purple} radius={24} />
              <Pulse at={access} color={FL.purple} radius={24} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <Txt size={40} weight={800} color={FL.purple}>
                  Full lecture series
                </Txt>
                <Txt size={26} weight={700} color={FL.muted}>
                  {frame >= launch ? "launch hogi: foran access" : ""}
                </Txt>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
                {ticks.map((t) =>
                  frame >= t.at ? (
                    <Pop key={t.label} at={t.at}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <SquareCheckBig size={28} color={FL.green} />
                        <Txt size={26} weight={700}>
                          {t.label}
                        </Txt>
                      </div>
                    </Pop>
                  ) : null
                )}
              </div>
            </Card>
          </Pop>
        </div>
      ) : null}
      {/* "follow aur subscribe kar lo ... website pe quizzes ... practice" */}
      {frame >= follow ? (
        <div style={{ ...abs(L.follow), display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <Pop at={follow}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <Avatar size={80} />
              <div style={{ transform: `scale(${pulse})`, background: FL.red, color: FL.text, borderRadius: 40, padding: "14px 40px", fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 36, boxShadow: `0 0 40px ${FL.red}` }}>
                Follow{frame >= subscribe ? " + Subscribe" : ""}
              </div>
            </div>
          </Pop>
          <div style={{ width: 600 }}>
            <Trail
              size={28}
              gap={8}
              justify="flex-start"
              items={[
                { at: website105, node: <span style={{ color: FL.accent }}>Website pe:</span> },
                { at: quizzes, node: "quizzes," },
                { at: shortQ, node: "short" },
                { at: longQ, node: "+ long questions" },
                { at: practice, node: <span style={{ color: FL.green }}>practice</span> },
              ]}
            />
          </div>
        </div>
      ) : null}
    </Scene>
  );
};
