import {
  BookOpen,
  Calculator,
  Camera,
  Car,
  Cog,
  FileText,
  Gamepad2,
  CirclePlay,
  Cpu,
  Keyboard,
  Languages,
  Layers,
  Lock,
  MemoryStick,
  MessageCircle,
  MessageSquareText,
  Monitor,
  Music,
  Pin,
  Play,
  Printer,
  RotateCcw,
  Speaker,
  SquareCheckBig,
  TrafficCone,
  UserRound,
  Zap,
} from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { SfxCue } from "../../components/audio/SfxCue";
import { Icon } from "../../components/faceless/Icon";
import {
  Avatar,
  Card,
  DrawLine,
  FlowDot,
  NumberCard,
  PhoneFrame,
  Pop,
  Pulse,
  Scene,
  Txt,
  useAppear,
  useBetween,
} from "../../components/faceless/kit";
import { BRAND, DISPLAY_FONT, FL } from "../../components/faceless/theme";
import { cue, lineEnd, type Timeline } from "../../components/faceless/voice";
import { LAYOUT } from "../../components/theme";
import { fontFamily as MONO_FONT } from "../../font";

/**
 * Phase 1 master scenes (pipeline/phase-01-who-controls-your-phone.md, sections 2 and 3).
 * Every animation is cued to a word of the cleaned voice: cue(tl, "<line id>", "<word>").
 */

type SceneProps = { readonly tl: Timeline };

const abs = (r: {
  x: number;
  y: number;
  w: number;
  h: number;
}): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

/** Horizontal shake (px) for a few frames after `at`. */
const useShake = (at: number, amount = 14, frames = 14): number => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > frames) return 0;
  return Math.sin(t * 2.4) * amount * (1 - t / frames);
};

/** Linear 0..1 between two frames for a given frame (usable inside loops, unlike useBetween). */
const between01 = (frame: number, from: number, to: number): number =>
  interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/* ---------------------------------------------------------------- Beat 1: hook */

const PHONE_APPS: React.ReactNode[] = [
  <Icon key="wa" name="logos:whatsapp-icon" size={64} />,
  <Icon key="yt" name="logos:youtube-icon" size={48} />,
  <Icon key="tt" name="logos:tiktok-icon" size={60} />,
  <Calculator key="calc" size={56} color={FL.highlight} />,
  <Camera key="cam" size={56} color={FL.blue} />,
  <Music key="music" size={56} color={FL.purple} />,
  <MessageCircle key="msg" size={56} color={FL.green} />,
];

export const AppGrid: React.FC<{
  readonly start: number;
  readonly tile: number;
  readonly gap: number;
  /** [from, to): the tiles jiggle in a wave (e.g. "kabhi socha hai ... kaun") */
  readonly wiggle?: readonly [number, number];
}> = ({ start, tile, gap, wiggle }) => {
  const frame = useCurrentFrame();
  const on = wiggle !== undefined && frame >= wiggle[0] && frame < wiggle[1];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(4, ${tile}px)`,
        gap,
        justifyContent: "center",
      }}
    >
      {Array.from({ length: 24 }, (_, i) => (
        <Pop key={i} at={start + i * 3} fromScale={0.3}>
          <div
            style={{
              width: tile,
              height: tile,
              borderRadius: tile * 0.24,
              transform: on
                ? `rotate(${Math.sin((frame - wiggle![0]) / 3 + i * 0.7) * 7}deg)`
                : undefined,
              background: i < PHONE_APPS.length ? "#21262d" : "#30363d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {PHONE_APPS[i] ?? null}
          </div>
        </Pop>
      ))}
    </div>
  );
};

/**
 * Line 1.3 inside the phone: "tap" = a ripple on WhatsApp, "boom" = the chat zooms open from
 * its icon, "peeche" = the app fades back, "under the hood" = the phone turns x-ray and shows
 * the layers behind one tap (app, OS, hardware) with a spinning gear.
 */
const TapToOpen: React.FC<{
  readonly tap: number;
  readonly boom: number;
  readonly peeche: number;
  readonly hood: number;
  readonly tile: { x: number; y: number };
}> = ({ tap, boom, peeche, hood, tile }) => {
  const frame = useCurrentFrame();
  const open = useAppear(boom, 16);
  const back = useBetween(peeche, peeche + 10);
  const xray = useBetween(hood, hood + 12);
  const ripple = between01(frame, tap, tap + 16);
  const bubbles = [
    "Assalam o Alaikum!",
    "Homework ho gaya?",
    "Haan, bhej raha hoon",
  ];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {frame >= tap && frame < tap + 18 ? (
        <div
          style={{
            position: "absolute",
            left: tile.x - 30 - ripple * 30,
            top: tile.y - 30 - ripple * 30,
            width: 60 + ripple * 60,
            height: 60 + ripple * 60,
            borderRadius: "50%",
            border: `4px solid ${FL.text}`,
            background: "rgba(230,237,243,0.25)",
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      {frame >= boom ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#0b141a",
            transformOrigin: `${tile.x}px ${tile.y}px`,
            transform: `scale(${0.08 + 0.92 * open})`,
            opacity: 1 - 0.8 * back,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "#1f2c34",
              padding: "48px 18px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Icon name="logos:whatsapp-icon" size={40} />
            <Txt size={24} weight={700}>
              WhatsApp
            </Txt>
          </div>
          <div
            style={{
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {bubbles.map((b, i) =>
              frame >= boom + 8 + i * 7 ? (
                <Pop key={b} at={boom + 8 + i * 7} slide={10}>
                  <div
                    style={{
                      alignSelf: i === 1 ? "flex-start" : "flex-end",
                      marginLeft: i === 1 ? 0 : 40,
                      marginRight: i === 1 ? 40 : 0,
                      background: i === 1 ? "#1f2c34" : "#005c4b",
                      borderRadius: 14,
                      padding: "10px 14px",
                    }}
                  >
                    <Txt size={20} weight={600}>
                      {b}
                    </Txt>
                  </div>
                </Pop>
              ) : null,
            )}
          </div>
        </div>
      ) : null}
      {frame >= hood ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: xray,
            background: "rgba(1,4,9,0.82)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 18,
            padding: "0 22px",
          }}
        >
          {[
            {
              label: "App",
              color: FL.green,
              icon: <Icon name="logos:whatsapp-icon" size={40} />,
            },
            {
              label: "OS",
              color: FL.accent,
              icon: <Layers size={40} color={FL.accent} />,
            },
            {
              label: "Hardware",
              color: FL.highlight,
              icon: (
                <Cog
                  size={40}
                  color={FL.highlight}
                  style={{ transform: `rotate(${(frame - hood) * 6}deg)` }}
                />
              ),
            },
          ].map((layer, i) => (
            <Pop key={layer.label} at={hood + 4 + i * 6} slide={16}>
              <Card
                accent={layer.color}
                style={{
                  height: 96,
                  gap: 14,
                  justifyContent: "flex-start",
                  padding: "0 18px",
                  borderRadius: 18,
                }}
              >
                {layer.icon}
                <Txt size={28} weight={800} color={layer.color}>
                  {layer.label}
                </Txt>
              </Card>
            </Pop>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const SceneHook: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flHook;
  const frame = useCurrentFrame();
  const start = cue(tl, "1.1");
  const pachaas = cue(tl, "1.1", "pachaas");
  const control = cue(tl, "1.2", "control");
  const hood = cue(tl, "1.3", "under");
  const tap = cue(tl, "1.3", "tap");
  const boom = cue(tl, "1.3", "open");
  const peeche = cue(tl, "1.3", "peeche");
  const questionOut = useBetween(tap - 8, tap);
  const stepAt = cue(tl, "1.4", "step");
  const simple = cue(tl, "1.4", "simple");
  const count = Math.round(
    interpolate(frame, [start, pachaas + 12], [0, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const zoom = 1 + 0.12 * useAppear(control, 20);
  const kaun = cue(tl, "1.2", "kaun");

  return (
    <Scene from={start - 10} to={lineEnd(tl, "1.4")}>
      <SfxCue file="pop.wav" at={start} volume={0.35} />
      <SfxCue file="tick.wav" at={start + 9} volume={0.25} />
      <SfxCue file="tick.wav" at={start + 21} volume={0.25} />
      <SfxCue file="tick.wav" at={start + 33} volume={0.25} />
      <SfxCue file="snap.wav" at={control} volume={0.5} />
      <SfxCue file="pop.wav" at={kaun} volume={0.4} />
      <SfxCue file="whoosh.wav" at={hood} volume={0.35} />
      <SfxCue file="click.wav" at={tap} volume={0.45} />
      <SfxCue file="pop.wav" at={boom} volume={0.45} />
      {[0, 1, 2].map((i) => (
        <SfxCue key={i} file="tick.wav" at={stepAt + i * 6} volume={0.3} />
      ))}
      <SfxCue file="pop.wav" at={simple} volume={0.35} />

      <div
        style={{
          ...abs(L.phone),
          transform: `scale(${zoom})`,
        }}
      >
        <PhoneFrame width={L.phone.w}>
          <div style={{ paddingTop: 30 }}>
            <AppGrid
              start={start}
              tile={62}
              gap={12}
              wiggle={[cue(tl, "1.2", "lekin"), control]}
            />
          </div>
          {/* first tile centre: grid (4 x 62 + 3 x 12) centred in the frame's inner width */}
          <TapToOpen
            tap={tap}
            boom={boom}
            peeche={peeche}
            hood={hood}
            tile={{
              x: (L.phone.w - 2 * Math.max(6, L.phone.w * 0.03) - 284) / 2 + 31,
              y: 61,
            }}
          />
        </PhoneFrame>
        {frame >= control && questionOut < 1 ? (
          <Pop
            at={control}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - questionOut,
            }}
          >
            <Txt
              size={320}
              color={FL.highlight}
              weight={800}
              style={{ textShadow: `0 0 60px ${FL.bg}` }}
            >
              ?
            </Txt>
          </Pop>
        ) : null}
      </div>

      <div
        style={{
          ...abs(L.counter),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Txt size={150} weight={800} color={FL.highlight}>
          {count}
          {count >= 50 ? "+" : ""}
        </Txt>
        <Txt size={40} color={FL.muted} weight={600}>
          apps
        </Txt>
        {frame >= hood ? (
          <Pop at={hood} slide={20}>
            <Txt size={44} color={FL.accent} style={{ marginTop: 24 }}>
              Under the hood?
            </Txt>
          </Pop>
        ) : null}
      </div>

      <div
        style={{
          ...abs(L.steps),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {[1, 2, 3].map((n) =>
            frame >= stepAt + (n - 1) * 6 ? (
              <Pop key={n} at={stepAt + (n - 1) * 6} slide={14}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: FL.panel,
                    border: `2px solid ${FL.panelBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Txt size={40} weight={800} color={FL.accent}>
                    {n}
                  </Txt>
                </div>
              </Pop>
            ) : null,
          )}
          {frame >= stepAt ? (
            <Pop at={stepAt + 12}>
              <Txt
                size={38}
                weight={700}
                color={FL.text}
                style={{ marginLeft: 10, whiteSpace: "nowrap" }}
              >
                Step by step
              </Txt>
            </Pop>
          ) : null}
        </div>
        {frame >= simple ? (
          <Pop at={simple} slide={16}>
            <Txt size={44} weight={800} color={FL.green}>
              Bilkul simple.
            </Txt>
          </Pop>
        ) : null}
      </div>

      {/* 1.2 "in sab ko control kaun karta hai?": a controller, and the question */}
      {frame >= control ? (
        <Pop
          at={control}
          style={{
            ...abs(L.user),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              background: FL.panel,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${Math.sin((frame - control) / 6) * 8}deg)`,
            }}
          >
            <Gamepad2 size={120} color={FL.highlight} />
          </div>
          {frame >= kaun ? (
            <Pop at={kaun}>
              <Txt
                size={46}
                color={FL.highlight}
                weight={800}
                style={{ textAlign: "center" }}
              >
                Control kaun karta hai?
              </Txt>
            </Pop>
          ) : null}
        </Pop>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 2: the problem */

const APP_ROWS = [
  { key: "music", label: "Music", icon: <Music size={64} color={FL.purple} /> },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: <Icon name="logos:whatsapp-icon" size={64} />,
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: <Icon name="logos:youtube-icon" size={48} />,
  },
] as const;

const RESOURCE_ROWS = [
  { key: "cpu", label: "CPU", icon: <Cpu size={64} color={FL.accent} /> },
  {
    key: "memory",
    label: "RAM",
    icon: <MemoryStick size={64} color={FL.blue} />,
  },
  {
    key: "speaker",
    label: "Speaker",
    icon: <Speaker size={64} color={FL.highlight} />,
  },
] as const;

const ROW_H = 150;
const ROW_GAP = 90;
const rowY = (region: { y: number; h: number }, i: number) =>
  region.y + (region.h - (3 * ROW_H + 2 * ROW_GAP)) / 2 + i * (ROW_H + ROW_GAP);

export const SceneProblem: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flProblem;
  const frame = useCurrentFrame();
  const start = cue(tl, "2.2");
  const appAt = [
    cue(tl, "2.2", "music"),
    cue(tl, "2.2", "whatsapp"),
    cue(tl, "2.2", "youtube"),
  ];
  const teen = cue(tl, "2.3", "processing");
  const memory = cue(tl, "2.3", "memory");
  const speaker = cue(tl, "2.3", "speaker");
  const faisla = cue(tl, "2.4", "decide");
  const teenoAt = cue(tl, "2.3", "teeno");
  const cpuWord = cue(tl, "2.3", "cpu");
  const sawal = cue(tl, "2.4", "sawal");
  // 2.4, one question per resource, on its words
  const askAt = [
    cue(tl, "2.4", "pehle"),
    cue(tl, "2.4", "kitni"),
    cue(tl, "2.4", "speaker"),
  ];
  const asks = ["Pehle kaun?", "Kitni?", "Kis ki awaaz?"];
  const jam = teen + 22;
  const cpuShake = useShake(jam, 10, 16);
  const appRight = L.apps.x + L.apps.w;
  const resLeft = L.resources.x;
  const cpuY = rowY(L.resources, 0) + ROW_H / 2;

  return (
    <Scene from={start - 8} to={lineEnd(tl, "2.4")}>
      {appAt.map((at, i) => (
        <SfxCue key={i} file="pop.wav" at={at} volume={0.4} />
      ))}
      <SfxCue file="zap.wav" at={jam} volume={0.45} />
      <SfxCue file="snap.wav" at={faisla} volume={0.4} />
      <SfxCue file="click.wav" at={teenoAt} volume={0.35} />
      <SfxCue file="pop.wav" at={sawal} volume={0.4} />
      {askAt.map((at, i) => (
        <SfxCue key={`ask${i}`} file="click.wav" at={at} volume={0.4} />
      ))}

      {APP_ROWS.map((row, i) => (
        <div
          key={row.key}
          style={{
            position: "absolute",
            left: L.apps.x,
            top: rowY(L.apps, i),
            width: L.apps.w,
            height: ROW_H,
          }}
        >
          <Pop at={appAt[i]!} slide={30}>
            <Card
              style={{
                height: ROW_H,
                gap: 26,
                justifyContent: "flex-start",
                padding: "0 34px",
              }}
            >
              {row.icon}
              <Txt size={46}>{row.label}</Txt>
            </Card>
          </Pop>
          {/* "teeno apps ek hi time pe": all three ask at once */}
          <Pulse at={teenoAt} color={FL.accent} />
        </div>
      ))}

      {RESOURCE_ROWS.map((row, i) => {
        const hot =
          i === 0 ? frame >= jam : i === 1 ? frame >= memory : frame >= speaker;
        const color =
          i === 0 && frame >= jam
            ? FL.red
            : hot
              ? FL.highlight
              : FL.panelBorder;
        return (
          <div
            key={row.key}
            style={{
              position: "absolute",
              left: L.resources.x + (i === 0 ? cpuShake : 0),
              top: rowY(L.resources, i),
              width: L.resources.w,
              height: ROW_H,
            }}
          >
            <Pop at={start + i * 6}>
              <Card
                accent={color}
                style={{
                  height: ROW_H,
                  gap: 26,
                  justifyContent: "flex-start",
                  padding: "0 34px",
                  background: i === 0 && frame >= jam ? FL.redSoft : FL.panel,
                }}
              >
                {row.icon}
                <Txt size={46}>{row.label}</Txt>
              </Card>
            </Pop>
            {i === 0 ? <Pulse at={cpuWord} color={FL.accent} /> : null}
            {i === 1 ? <Pulse at={memory} /> : null}
            {i === 2 ? <Pulse at={speaker} /> : null}
            <Pulse at={askAt[i]!} color={FL.highlight} />
            {frame >= askAt[i]! ? (
              <Pop
                at={askAt[i]!}
                slide={-12}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: ROW_H + 14,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Txt size={38} weight={800} color={FL.highlight}>
                  {asks[i]}
                </Txt>
              </Pop>
            ) : null}
          </div>
        );
      })}

      {APP_ROWS.map((row, i) => (
        <div key={`flow-${row.key}`}>
          <DrawLine
            from={teen}
            to={teen + 14}
            x1={appRight + 10}
            y1={rowY(L.apps, i) + ROW_H / 2}
            x2={resLeft - 16}
            y2={cpuY}
            color={FL.dim}
          />
          <FlowDot
            stay
            from={teen + 4}
            to={jam}
            x1={appRight + 10}
            y1={rowY(L.apps, i) + ROW_H / 2}
            x2={resLeft - 30}
            y2={cpuY}
          />
        </div>
      ))}

      {frame >= sawal && frame < faisla ? (
        <Pop
          at={sawal}
          style={{
            position: "absolute",
            left: L.links.x,
            top: L.links.y + L.links.h - 240,
            width: L.links.w,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Txt size={160} color={FL.highlight} weight={800}>
            ?
          </Txt>
        </Pop>
      ) : null}
      {frame >= faisla ? (
        <Pop
          at={faisla}
          style={{
            position: "absolute",
            left: L.links.x,
            top: L.links.y + L.links.h - 100,
            width: L.links.w,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Txt
            size={54}
            color={FL.highlight}
            weight={800}
            style={{ whiteSpace: "nowrap" }}
          >
            Kaun decide karega?
          </Txt>
        </Pop>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 3: the answer */

const DEFINITION: { text: string; key?: "manage" | "chalata" | "user" }[] = [
  { text: "Operating System (OS) is a type of system software that " },
  { text: "manages hardware", key: "manage" },
  { text: ", " },
  { text: "runs application software", key: "chalata" },
  { text: ", and " },
  { text: "provides a user interface", key: "user" },
];

const OS_LOGOS = [
  {
    word: "windows",
    label: "Windows",
    icon: <Icon name="logos:microsoft-windows-icon" size={90} />,
  },
  {
    word: "macos",
    label: "macOS",
    icon: <Icon name="logos:macos" size={36} style={{ filter: "invert(1)" }} />,
  },
  {
    word: "linux",
    label: "Linux",
    icon: <Icon name="logos:linux-tux" size={96} />,
  },
  {
    word: "android",
    label: "Android",
    icon: <Icon name="logos:android-icon" size={70} />,
  },
  {
    word: "ios",
    label: "iOS",
    icon: <Icon name="logos:apple" size={96} style={{ filter: "invert(1)" }} />,
  },
] as const;

const PHONE_OS = new Set<string>(["android", "ios"]);

export const SceneAnswer: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flAnswer;
  const frame = useCurrentFrame();
  const start = cue(tl, "3.1");
  const os = cue(tl, "3.1", "operating");
  const defFrom = cue(tl, "3.2");
  const defTo = lineEnd(tl, "3.2") - 10;
  const keyAt = {
    manage: cue(tl, "3.2", "manage"),
    chalata: cue(tl, "3.2", "chalata"),
    user: cue(tl, "3.2", "user"),
  };
  const yours = cue(tl, "3.3", "tumhare");
  const yahiKaam = cue(tl, "3.3", "kaam");
  const phoneOsAt: Record<string, number> = {
    android: cue(tl, "3.3", "android", 1),
    ios: cue(tl, "3.3", "ios", 1),
  };
  const lift = useAppear(yours, 14);
  const total = DEFINITION.reduce((n, part) => n + part.text.length, 0);
  const shown = Math.round(useBetween(defFrom, defTo) * total);
  let used = 0;

  return (
    <Scene from={start - 8} to={lineEnd(tl, "3.3")}>
      <SfxCue file="swoosh.wav" at={os} volume={0.4} />
      <SfxCue file="snap.wav" at={keyAt.manage} volume={0.35} />
      <SfxCue file="snap.wav" at={keyAt.chalata} volume={0.35} />
      <SfxCue file="snap.wav" at={keyAt.user} volume={0.35} />
      {OS_LOGOS.map((logo) => (
        <SfxCue
          key={logo.word}
          file="pop.wav"
          at={cue(tl, "3.3", logo.word)}
          volume={0.3}
        />
      ))}
      <SfxCue file="snap.wav" at={yours} volume={0.4} />
      <SfxCue file="thud.wav" at={yahiKaam} volume={0.35} />

      <div
        style={{ ...abs(L.band), display: "flex", justifyContent: "center" }}
      >
        <Pop at={os} slide={-60}>
          <Card
            accent={FL.accent}
            style={{
              height: L.band.h,
              padding: "0 70px",
              background: FL.accentSoft,
            }}
          >
            <Txt size={84} weight={800} color={FL.accent}>
              Operating System (OS)
            </Txt>
          </Card>
        </Pop>
      </div>

      <div
        style={{
          ...abs(L.definition),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 50,
            fontWeight: 600,
            color: FL.text,
            lineHeight: 1.45,
            textAlign: "center",
          }}
        >
          &ldquo;
          {DEFINITION.map((part, i) => {
            const visible = Math.max(
              0,
              Math.min(part.text.length, shown - used),
            );
            used += part.text.length;
            const lit = part.key ? frame >= keyAt[part.key] : false;
            return (
              <span
                key={i}
                style={{
                  color: lit ? FL.accent : part.key ? FL.text : FL.muted,
                  fontWeight: lit ? 800 : 600,
                  // "exactly yahi kaam": the phone OS does these three jobs
                  background:
                    part.key && frame >= yahiKaam ? FL.accentSoft : undefined,
                  borderRadius: 10,
                }}
              >
                {part.text.slice(0, visible)}
              </span>
            );
          })}
          {shown >= total ? "”" : ""}
        </div>
        {frame >= defFrom ? (
          <Txt
            size={26}
            color={FL.dim}
            weight={600}
            style={{ textAlign: "center" }}
          >
            Book: Class 10, Chapter 1, page 2
          </Txt>
        ) : null}
      </div>

      <div
        style={{
          ...abs(L.logos),
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {OS_LOGOS.map((logo) => (
          <div
            key={logo.word}
            style={{
              width: 220,
              display: "flex",
              justifyContent: "center",
              // "Tumhare phone mein Android ya iOS": the phone OSes lift, the others step back.
              opacity: PHONE_OS.has(logo.word) ? 1 : 1 - 0.65 * lift,
              transform: PHONE_OS.has(logo.word)
                ? `translateY(${-22 * lift}px) scale(${1 + 0.12 * lift})`
                : undefined,
            }}
          >
            <Pop
              at={cue(tl, "3.3", logo.word)}
              style={{ position: "relative" }}
            >
              {PHONE_OS.has(logo.word) ? (
                <Pulse at={phoneOsAt[logo.word]!} color={FL.accent} />
              ) : null}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{ height: 100, display: "flex", alignItems: "center" }}
                >
                  {logo.icon}
                </div>
                <Txt
                  size={34}
                  weight={700}
                  color={
                    PHONE_OS.has(logo.word) && lift > 0.5 ? FL.accent : FL.text
                  }
                >
                  {logo.label}
                </Txt>
              </div>
            </Pop>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 4: traffic controller */

type Pt = readonly [number, number];
/** Position along keyframes [(frame, x, y)], eased between each pair. */
const along = (
  frame: number,
  keys: readonly (readonly [number, number, number])[],
): Pt => {
  if (frame <= keys[0]![0]) return [keys[0]![1], keys[0]![2]];
  for (let i = 1; i < keys.length; i++) {
    const [f1, x1, y1] = keys[i]!;
    const [f0, x0, y0] = keys[i - 1]!;
    if (frame <= f1) {
      const t = f1 === f0 ? 1 : (frame - f0) / (f1 - f0);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return [x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
    }
  }
  const last = keys[keys.length - 1]!;
  return [last[1], last[2]];
};

/** The four app cars; the first three each take one of the OS decisions. */
const CAR_ICONS = (size: number): React.ReactNode[] => [
  <Icon key="wa" name="logos:whatsapp-icon" size={size * 0.6} />,
  <Icon key="yt" name="logos:youtube-icon" size={size * 0.46} />,
  <Music key="mu" size={size * 0.52} color={FL.purple} />,
  <Icon key="tt" name="logos:tiktok-icon" size={size * 0.56} />,
];
const ENTRY: readonly Pt[] = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];

export type CrossroadCues = {
  /** cars drive in ("crossroad") */
  readonly arrive: number;
  /** cars crash in the middle ("crash") */
  readonly crash: number;
  readonly signal: number;
  /** "number ek / do / teen": car 1 to the CPU, car 2 to memory, car 3 to a device. */
  readonly numbers: readonly [number, number, number];
  /** "simple lafzon mein": the apps take turns on the CPU (optional). */
  readonly simple?: number;
  /** roads fade in ("imagine karo"); without it they are there from the start */
  readonly roadsAt?: number;
  /** "process karega": a processing bar runs in the CPU box */
  readonly busy?: number;
  /** "printer", "speaker": the device box pings */
  readonly devicePings?: readonly number[];
  /** "yaani CPU": the CPU box pings */
  readonly cpuPings?: readonly number[];
};

/**
 * The book's analogy, acted out on the words: cars (apps) crash at a crossroad with no signal;
 * the signal (OS) appears and lines them up; then each "number" sends one car to what the OS
 * decides: the CPU (top), memory (right), a device (bottom). On "simple" the apps take turns
 * in the CPU box (time sharing). Square box: `size` px from (x, y).
 */
export const Crossroad: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly cues: CrossroadCues;
}> = ({ x, y, size, cues }) => {
  const frame = useCurrentFrame();
  const {
    arrive,
    crash,
    signal,
    numbers,
    simple,
    roadsAt,
    busy,
    devicePings = [],
    cpuPings = [],
  } = cues;
  const roads =
    roadsAt === undefined ? 1 : between01(frame, roadsAt, roadsAt + 14);
  const cx = x + size / 2;
  const cy = y + size / 2;
  const road = size * 0.17;
  const car = size * 0.105;
  const reach = size / 2 - car * 0.7;
  const box = { w: size * 0.3, h: size * 0.15 };
  const lightOn = frame >= signal;
  const shake =
    !lightOn && frame >= crash
      ? Math.sin((frame - crash) * 2.4) *
        6 *
        Math.max(0, 1 - (frame - crash) / 14)
      : 0;
  // destinations: CPU top, memory right, device bottom (box centres)
  const dest: readonly Pt[] = [
    [cx, y + box.h / 2 + 4],
    [x + size - box.w / 2 - 4, cy],
    [cx, y + size - box.h / 2 - 4],
  ];
  const queue = (slot: number): Pt => [cx - road * 0.9 - slot * car * 1.12, cy];
  const icons = CAR_ICONS(car);
  const slice =
    simple !== undefined && frame >= simple
      ? Math.floor((frame - simple) / 9) % 3
      : -1;

  const carPos = (i: number): Pt => {
    const [dx, dy] = ENTRY[i]!;
    const start: Pt = [cx + dx * reach, cy + dy * reach];
    const hit: Pt = [cx + dx * car * 0.32, cy + dy * car * 0.32];
    const keys: (readonly [number, number, number])[] = [
      [arrive, start[0], start[1]],
      [crash, hit[0], hit[1]],
      [signal + 4, hit[0], hit[1]],
      [signal + 22, queue(i)[0], queue(i)[1]],
    ];
    if (i < 3) {
      const go = numbers[i]!;
      keys.push(
        [go, queue(i)[0], queue(i)[1]],
        [go + 12, cx, cy],
        [go + 28, dest[i]![0], dest[i]![1]],
      );
    }
    return along(frame, keys);
  };

  const boxes = [
    {
      label: "CPU",
      icon: <Cpu size={box.h * 0.42} color={FL.accent} />,
      color: FL.accent,
    },
    {
      label: "Memory",
      icon: <MemoryStick size={box.h * 0.42} color={FL.blue} />,
      color: FL.blue,
    },
    {
      label: "Device",
      icon: (
        <div style={{ display: "flex", gap: 4 }}>
          <Printer size={box.h * 0.36} color={FL.highlight} />
          <Speaker size={box.h * 0.36} color={FL.highlight} />
        </div>
      ),
      color: FL.highlight,
    },
  ];

  return (
    <>
      {/* roads */}
      <div style={{ opacity: roads }}>
        <div
          style={{
            position: "absolute",
            left: x,
            top: cy - road / 2,
            width: size,
            height: road,
            background: "#21262d",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: cx - road / 2,
            top: y,
            width: road,
            height: size,
            background: "#21262d",
            borderRadius: 12,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: x + 20,
            top: cy - 3,
            width: size - 40,
            height: 6,
            backgroundImage: `repeating-linear-gradient(90deg, ${FL.dim} 0 28px, transparent 28px 52px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: cx - 3,
            top: y + 20,
            width: 6,
            height: size - 40,
            backgroundImage: `repeating-linear-gradient(180deg, ${FL.dim} 0 28px, transparent 28px 52px)`,
          }}
        />
      </div>

      {/* destinations appear just before their car leaves */}
      {boxes.map((b, i) =>
        frame >= numbers[i]! - 8 ? (
          <div
            key={b.label}
            style={{
              position: "absolute",
              left: dest[i]![0] - box.w / 2,
              top: dest[i]![1] - box.h / 2,
              width: box.w,
              height: box.h,
            }}
          >
            <Pop at={numbers[i]! - 8}>
              <Card
                accent={b.color}
                style={{
                  width: box.w,
                  height: box.h,
                  gap: 10,
                  background: FL.panel,
                }}
              >
                {b.icon}
                <Txt size={box.h * 0.26} weight={800}>
                  {b.label}
                </Txt>
              </Card>
            </Pop>
            <Pulse at={numbers[i]! + 28} color={b.color} />
            {i === 0 && busy !== undefined && frame >= busy ? (
              <div
                style={{
                  position: "absolute",
                  left: 14,
                  right: 14,
                  bottom: 10,
                  height: 8,
                  borderRadius: 4,
                  background: FL.bg,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(((frame - busy) % 30) / 30) * 100}%`,
                    height: "100%",
                    background: FL.accent,
                  }}
                />
              </div>
            ) : null}
            {i === 2
              ? devicePings.map((at) => (
                  <Pulse key={at} at={at} color={FL.highlight} />
                ))
              : null}
            {i === 0
              ? cpuPings.map((at) => (
                  <Pulse key={at} at={at} color={FL.accent} />
                ))
              : null}
          </div>
        ) : null,
      )}

      {/* cars: hidden once parked (the destination box shows them) */}
      {frame >= arrive
        ? icons.map((icon, i) => {
            const parked = i < 3 && frame >= numbers[i]! + 28;
            if (parked) return null;
            const [px, py] = carPos(i);
            const crashed = frame >= crash && !lightOn;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: px - car / 2 + shake,
                  top: py - car / 2,
                  width: car,
                  height: car,
                  borderRadius: car * 0.22,
                  background: crashed ? FL.redSoft : FL.panel,
                  border: `3px solid ${crashed ? FL.red : FL.panelBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </div>
            );
          })
        : null}

      {/* parked apps: a small badge on their destination; on "simple" the CPU shows the app whose turn it is */}
      {[0, 1, 2].map((i) =>
        frame >= numbers[i]! + 28 ? (
          <div
            key={`parked-${i}`}
            style={{
              position: "absolute",
              left: dest[i]![0] + box.w / 2 - car * 0.45,
              top: dest[i]![1] - box.h / 2 - car * 0.35,
              width: car * 0.7,
              height: car * 0.7,
              borderRadius: car * 0.18,
              background: FL.bg,
              border: `3px solid ${FL.panelBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "scale(0.8)",
            }}
          >
            {i === 0 && slice >= 0
              ? CAR_ICONS(car * 0.7)[slice]
              : CAR_ICONS(car * 0.7)[i]}
          </div>
        ) : null,
      )}

      {/* the signal = OS */}
      {lightOn ? (
        <Pop
          at={signal}
          slide={-60}
          style={{
            position: "absolute",
            left: cx + road * 0.75,
            top: cy - road * 0.75 - size * 0.2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              position: "relative",
            }}
          >
            <Icon
              name="mdi:traffic-light"
              size={size * 0.17}
              color={FL.green}
            />
            <Txt size={size * 0.07} color={FL.accent} weight={800}>
              OS
            </Txt>
            {numbers.map((at, i) => (
              <Pulse key={i} at={at} color={FL.green} radius={16} />
            ))}
          </div>
        </Pop>
      ) : null}
    </>
  );
};

export const SceneTraffic: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flTraffic;
  const frame = useCurrentFrame();
  const start = cue(tl, "4.1");
  const crash = cue(tl, "4.2", "crash");
  const signal = cue(tl, "4.3", "signal");
  const faislay = cue(tl, "4.4");
  const numbers = [
    cue(tl, "4.5", "number"),
    cue(tl, "4.6", "number"),
    cue(tl, "4.7", "number"),
  ] as const;
  const simple = cue(tl, "4.8", "simple");
  const book = cue(tl, "4.1", "book");
  const trafficWord = cue(tl, "4.1", "traffic");
  const imagine = cue(tl, "4.2", "imagine");
  const carsAre = cue(tl, "4.3", "cars");
  const appsAre = cue(tl, "4.3", "apps");
  const busy = cue(tl, "4.5", "process");
  const cpuPings = [cue(tl, "4.5", "cpu"), cue(tl, "4.5", "pehle", 1)];
  const devicePings = [cue(tl, "4.7", "printer"), cue(tl, "4.7", "speaker")];
  const bookOut = useBetween(imagine - 6, imagine + 4);
  // 4.9: the decisions step aside for the everyday example (song + WhatsApp, no hang).
  const example = cue(tl, "4.9");
  const panelOpacity = 1 - useBetween(example - 4, example + 8);

  return (
    <Scene from={start - 8} to={lineEnd(tl, "4.9")}>
      <SfxCue file="swoosh.wav" at={start} volume={0.35} />
      <SfxCue file="zap.wav" at={crash} volume={0.45} />
      <SfxCue file="thud.wav" at={signal + 6} volume={0.4} />
      {numbers.map((at, i) => (
        <SfxCue key={i} file="snap.wav" at={at} volume={0.45} />
      ))}
      {numbers.map((at, i) => (
        <SfxCue key={`w${i}`} file="whoosh.wav" at={at + 10} volume={0.25} />
      ))}

      <SfxCue file="pop.wav" at={book} volume={0.35} />
      <SfxCue file="thud.wav" at={trafficWord} volume={0.35} />
      <SfxCue file="pop.wav" at={carsAre} volume={0.35} />
      <SfxCue file="tick.wav" at={busy} volume={0.3} />
      {devicePings.map((at) => (
        <SfxCue key={at} file="click.wav" at={at} volume={0.35} />
      ))}

      <Crossroad
        x={L.road.x}
        y={L.road.y}
        size={L.road.w}
        cues={{
          arrive: cue(tl, "4.2", "crossroad"),
          crash,
          signal,
          numbers,
          simple,
          roadsAt: imagine,
          busy,
          devicePings,
          cpuPings,
        }}
      />

      {/* 4.1: the book's line, before the crossroad */}
      {frame >= book && bookOut < 1 ? (
        <div
          style={{
            ...abs(LAYOUT.flTrafficBook.card),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - bookOut,
          }}
        >
          <Pop at={book} slide={30}>
            <Card
              accent={FL.accent}
              style={{ padding: "40px 60px", gap: 40, background: FL.panel }}
            >
              {frame >= trafficWord ? (
                <Pop at={trafficWord} slide={-60}>
                  <Icon name="mdi:traffic-light" size={200} color={FL.green} />
                </Pop>
              ) : (
                <div
                  style={{
                    width: 200,
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={150} color={FL.muted} />
                </div>
              )}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <Txt size={32} color={FL.muted} weight={600}>
                  Book, Class 10, Chapter 1
                </Txt>
                <Txt size={66} weight={800}>
                  OS = computer ka{" "}
                  <span
                    style={{
                      color: frame >= trafficWord ? FL.accent : FL.text,
                    }}
                  >
                    traffic controller
                  </span>
                </Txt>
              </div>
            </Card>
          </Pop>
        </div>
      ) : null}

      {/* 4.3: cars = apps, signal = OS (until the 3 decisions take this column) */}
      {frame >= carsAre && frame < faislay ? (
        <div
          style={{
            ...abs(L.decisions),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <Pop at={carsAre} slide={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Car size={80} color={FL.muted} />
              <Txt size={56} weight={800}>
                Cars ={" "}
                {frame >= appsAre ? (
                  <span style={{ color: FL.green }}>apps</span>
                ) : (
                  "?"
                )}
              </Txt>
            </div>
          </Pop>
          {frame >= signal ? (
            <Pop at={signal} slide={20}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Icon name="mdi:traffic-light" size={80} color={FL.green} />
                <Txt size={56} weight={800}>
                  Signal = <span style={{ color: FL.accent }}>OS</span>
                </Txt>
              </div>
            </Pop>
          ) : null}
        </div>
      ) : null}

      {/* the three decisions */}
      <div
        style={{
          ...abs(L.decisions),
          display: "flex",
          flexDirection: "column",
          gap: 34,
          opacity: panelOpacity,
        }}
      >
        {frame >= faislay ? (
          <Pop at={faislay} slide={20}>
            <Txt size={54} weight={800}>
              OS ke <span style={{ color: FL.accent }}>3 decisions</span>
            </Txt>
          </Pop>
        ) : null}
        <NumberCard
          n={1}
          at={numbers[0]}
          width={L.decisions.w}
          label="CPU pehle kis ko?"
          icon={<Cpu size={58} color={FL.accent} />}
        />
        <NumberCard
          n={2}
          at={numbers[1]}
          width={L.decisions.w}
          label="Memory kis ko, kitni?"
          icon={<MemoryStick size={58} color={FL.blue} />}
        />
        <NumberCard
          n={3}
          at={numbers[2]}
          width={L.decisions.w}
          label="Kaunsa device, kab?"
          icon={
            <div style={{ display: "flex", gap: 8 }}>
              <Printer size={52} color={FL.highlight} />
              <Speaker size={52} color={FL.highlight} />
            </div>
          }
        />
      </div>

      {/* simple version: the CPU's time sliced between the 3 apps */}
      {frame >= simple && panelOpacity > 0 ? (
        <div
          style={{
            ...abs(L.timebar),
            display: "flex",
            flexDirection: "column",
            gap: 14,
            opacity: panelOpacity,
          }}
        >
          <Pop at={simple}>
            <Txt size={32} color={FL.highlight} weight={700}>
              CPU switch: blink of an eye
            </Txt>
          </Pop>
          <div style={{ display: "flex", gap: 6, height: 70 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <Pop
                key={i}
                at={simple + 8 + i * 9}
                fromScale={0.2}
                style={{ flex: 1 }}
              >
                <div
                  style={{
                    height: 70,
                    borderRadius: 10,
                    background: [FL.green, FL.red, FL.purple][i % 3],
                  }}
                />
              </Pop>
            ))}
          </div>
        </div>
      ) : null}

      <TrafficExample tl={tl} />
    </Scene>
  );
};

/** Line 4.9: "song sunte hue WhatsApp bhi chala sakte ho, aur phone hang nahi hota. Smooth, right?" */
const TrafficExample: React.FC<SceneProps> = ({ tl }) => {
  const E = LAYOUT.flTrafficExample;
  const frame = useCurrentFrame();
  const example = cue(tl, "4.9");
  const song = cue(tl, "4.9", "song");
  const whatsapp = cue(tl, "4.9", "whatsapp");
  const hang = cue(tl, "4.9", "hang");
  if (frame < example) return null;

  return (
    <>
      <SfxCue file="pop.wav" at={example} volume={0.3} />
      <SfxCue file="pop.wav" at={whatsapp} volume={0.35} />
      <SfxCue file="snap.wav" at={hang} volume={0.4} />

      <Pop at={example} slide={40} style={abs(E.phone)}>
        <PhoneFrame width={E.phone.w}>
          <div
            style={{
              padding: "70px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            <Card
              accent={FL.purple}
              style={{ flexDirection: "column", padding: "26px 20px", gap: 18 }}
            >
              <Music size={64} color={FL.purple} />
              <Txt size={26} weight={700} style={{ whiteSpace: "nowrap" }}>
                Now playing
              </Txt>
              {/* equaliser: frame-driven, keeps moving while the song "plays" */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  height: 60,
                  alignItems: "flex-end",
                }}
              >
                {Array.from({ length: 7 }, (_, i) => {
                  const live = frame >= song;
                  const h = live
                    ? 14 +
                      44 * Math.abs(Math.sin((frame - song) * 0.22 + i * 1.3))
                    : 14;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 16,
                        height: h,
                        borderRadius: 4,
                        background: FL.purple,
                      }}
                    />
                  );
                })}
              </div>
            </Card>
            {frame >= whatsapp ? (
              <Pop at={whatsapp} slide={30}>
                <Card
                  accent={FL.green}
                  style={{
                    padding: "16px 14px",
                    gap: 12,
                    justifyContent: "flex-start",
                  }}
                >
                  <div style={{ flexShrink: 0, display: "flex" }}>
                    <Icon name="logos:whatsapp-icon" size={46} />
                  </div>
                  <Txt size={22} weight={700} style={{ whiteSpace: "nowrap" }}>
                    Message
                  </Txt>
                </Card>
              </Pop>
            ) : null}
          </div>
        </PhoneFrame>
      </Pop>

      <div
        style={{
          ...abs(E.status),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {frame >= hang ? (
          <Pop at={hang} slide={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <SquareCheckBig size={64} color={FL.green} />
              <Txt
                size={42}
                weight={800}
                color={FL.green}
                style={{ whiteSpace: "nowrap" }}
              >
                Hang nahi hota
              </Txt>
            </div>
          </Pop>
        ) : null}
      </div>
    </>
  );
};

/* ---------------------------------------------------------------- Beat 5: translator */

const BITS = "01000001".split("");

/** Frames of the 8 spoken digits ("zero" / "one") of line 5.4, in order. */
export const digitCues = (tl: Timeline): number[] => {
  const digits = tl.words
    .filter((w) => w.lineId === "5.4" && /^(zero|one)\b/i.test(w.w))
    .map((w) => w.from);
  return BITS.map((_, k) => digits[k] ?? cue(tl, "5.4"));
};

export const SceneTranslator: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flTranslator;
  const frame = useCurrentFrame();
  const start = cue(tl, "5.1");
  const translator = cue(tl, "5.1", "translation");
  const header = cue(tl, "5.2");
  const keyA = cue(tl, "5.3", "a");
  const kya = cue(tl, "5.3", "kya");
  // The 8 spoken digits of line 5.4 ("... binary code pohnchta hai: zero, one, ...").
  const bitAt = digitCues(tl);
  const send = lineEnd(tl, "5.4");
  const screenA = cue(tl, "5.5", "screen");
  const doosra = cue(tl, "5.1", "doosri");
  const interesting = cue(tl, "5.1", "responsibility");
  const urdu = cue(tl, "5.2", "urdu");
  const english = cue(tl, "5.2", "english");
  const computer = cue(tl, "5.2", "computer");
  const binary = cue(tl, "5.2", "binary");
  const keyboardWord = cue(tl, "5.3", "keyboard");
  const codeWord = cue(tl, "5.4", "binary");
  const behind = cue(tl, "5.5", "behind");
  const fast = cue(tl, "5.5", "fast");
  const keyPress = useAppear(keyA, 10);
  const center = (r: { x: number; y: number; w: number; h: number }) => ({
    x: r.x + r.w / 2,
    y: r.y + r.h / 2,
  });
  const k = center(L.keyboard);
  const o = center(L.os);
  const m = center(L.monitor);

  return (
    <Scene from={start - 8} to={lineEnd(tl, "5.5")}>
      <SfxCue file="swoosh.wav" at={start} volume={0.35} />
      <SfxCue file="click.wav" at={keyA} volume={0.5} />
      {bitAt.map((at, i) => (
        <SfxCue key={i} file="type.wav" at={at} volume={0.35} />
      ))}
      <SfxCue file="pop.wav" at={screenA} volume={0.5} />
      <SfxCue file="pop.wav" at={doosra} volume={0.35} />
      <SfxCue file="snap.wav" at={interesting} volume={0.35} />
      <SfxCue file="click.wav" at={urdu} volume={0.3} />
      <SfxCue file="click.wav" at={english} volume={0.3} />
      <SfxCue file="pop.wav" at={computer} volume={0.35} />
      <SfxCue file="whoosh.wav" at={behind} volume={0.3} />
      <SfxCue file="zap.wav" at={fast} volume={0.35} />

      {/* 5.1: the title, then 5.2 builds the header word by word, then 5.5 "behind the scenes" */}
      {frame >= doosra && frame < header ? (
        <Pop
          at={doosra}
          style={{
            ...abs(L.header),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Txt size={56} weight={800}>
            OS ka kaam <span style={{ color: FL.accent }}>#2</span>
          </Txt>
          {frame >= interesting ? (
            <Pop at={interesting}>
              <Zap
                size={56}
                color={FL.highlight}
                style={{
                  transform: `rotate(${Math.sin((frame - interesting) / 3) * 12}deg)`,
                }}
              />
            </Pop>
          ) : null}
        </Pop>
      ) : null}
      {frame >= header && frame < behind ? (
        <div
          style={{
            ...abs(L.header),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 60,
          }}
        >
          <Pop at={header}>
            <Txt size={46}>
              Hum:{" "}
              <span style={{ color: frame >= urdu ? FL.highlight : FL.dim }}>
                Urdu
              </span>{" "}
              /{" "}
              <span style={{ color: frame >= english ? FL.highlight : FL.dim }}>
                English
              </span>
            </Txt>
          </Pop>
          {frame >= computer ? (
            <Pop at={computer}>
              <Txt size={46}>
                Computer:{" "}
                <span
                  style={{
                    color: frame >= binary ? FL.accent : FL.dim,
                    fontFamily: MONO_FONT,
                  }}
                >
                  0 aur 1
                </span>
              </Txt>
            </Pop>
          ) : null}
        </div>
      ) : null}
      {frame >= behind ? (
        <Pop
          at={behind}
          style={{
            ...abs(L.header),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Txt size={50} weight={800}>
            Behind the scenes:
          </Txt>
          {frame >= fast ? (
            <Pop at={fast}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Zap size={52} color={FL.highlight} />
                <Txt size={50} weight={800} color={FL.highlight}>
                  itna fast
                </Txt>
              </div>
            </Pop>
          ) : null}
        </Pop>
      ) : null}

      {/* keyboard + the A key */}
      <div
        style={{
          ...abs(L.keyboard),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Pop at={start} style={{ position: "relative" }}>
          <Keyboard
            size={200}
            color={frame >= keyboardWord ? FL.highlight : FL.muted}
            strokeWidth={1.5}
          />
          <Pulse at={keyboardWord} color={FL.highlight} />
        </Pop>
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 18,
            background: frame >= keyA ? FL.highlightSoft : FL.panel,
            border: `4px solid ${frame >= keyA ? FL.highlight : FL.panelBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${frame >= keyA ? Math.sin(Math.min(1, keyPress) * Math.PI) * 10 : 0}px)`,
          }}
        >
          <Txt
            size={64}
            weight={800}
            color={frame >= keyA ? FL.highlight : FL.text}
          >
            A
          </Txt>
        </div>
      </div>

      {/* the OS translator */}
      <div
        style={{
          ...abs(L.os),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pop at={translator}>
          <Card
            accent={FL.accent}
            style={{
              width: 380,
              height: 380,
              flexDirection: "column",
              gap: 20,
              background: FL.accentSoft,
              position: "relative",
            }}
          >
            <Languages size={120} color={FL.accent} />
            <Txt size={44} color={FL.accent} weight={800}>
              OS = Translator
            </Txt>
            {frame >= kya && frame < bitAt[0]! ? (
              <div
                data-fl-box="free"
                style={{
                  position: "absolute",
                  top: -90 + Math.sin((frame - kya) / 5) * 10,
                }}
              >
                <Txt size={110} color={FL.highlight} weight={800}>
                  ?
                </Txt>
              </div>
            ) : null}
          </Card>
        </Pop>
      </div>

      {/* monitor */}
      <div
        style={{
          ...abs(L.monitor),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <Pop at={start + 6}>
          <Monitor size={300} color={FL.muted} strokeWidth={1.3} />
        </Pop>
        {/* "computer sirf binary samajhta hai": binary scrolls on the screen until the A shows */}
        {frame >= binary && frame < screenA ? (
          <div
            style={{
              position: "absolute",
              top: 88,
              width: 220,
              height: 130,
              overflow: "hidden",
              opacity: 0.8,
            }}
          >
            {Array.from({ length: 8 }, (_, r) => (
              <div
                key={r}
                style={{
                  position: "absolute",
                  top: r * 30 - (((frame - binary) * 2) % 30),
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: MONO_FONT,
                  fontSize: 24,
                  color: FL.accent,
                }}
              >
                {((r + Math.floor((frame - binary) / 15)) * 37)
                  .toString(2)
                  .padStart(10, "0")
                  .slice(-10)}
              </div>
            ))}
          </div>
        ) : null}
        {frame >= screenA ? (
          <Pop at={screenA} style={{ position: "absolute", top: 110 }}>
            <Txt size={140} weight={800} color={FL.text}>
              A
            </Txt>
          </Pop>
        ) : null}
      </div>

      {/* the A travels into the OS, the bits travel to the monitor */}
      <FlowDot
        from={Math.min(codeWord, bitAt[0]! - 14)}
        to={bitAt[0]!}
        x1={k.x + 70}
        y1={k.y + 80}
        x2={o.x - 160}
        y2={o.y}
        color={FL.highlight}
        size={30}
      />
      <DrawLine
        from={send}
        to={send + 12}
        x1={o.x + 200}
        y1={o.y}
        x2={m.x - 160}
        y2={m.y}
        color={FL.accent}
      />
      <FlowDot
        from={send}
        to={screenA}
        x1={o.x + 200}
        y1={o.y}
        x2={m.x - 170}
        y2={m.y}
        color={FL.accent}
        size={26}
      />

      {/* "itna fast": signals race keyboard > OS > monitor, again and again */}
      {Array.from(
        { length: Math.max(0, Math.ceil((lineEnd(tl, "5.5") - fast) / 12)) },
        (_, n) => (
          <div key={`fast-${n}`}>
            <FlowDot
              from={fast + n * 12}
              to={fast + n * 12 + 10}
              x1={k.x + 70}
              y1={k.y}
              x2={o.x - 160}
              y2={o.y}
              color={FL.highlight}
              size={20}
            />
            <FlowDot
              from={fast + n * 12 + 6}
              to={fast + n * 12 + 16}
              x1={o.x + 200}
              y1={o.y}
              x2={m.x - 170}
              y2={m.y}
              color={FL.accent}
              size={20}
            />
          </div>
        ),
      )}

      <div
        style={{
          ...abs(L.bits),
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {BITS.map((bit, i) =>
          frame >= bitAt[i]! ? (
            <Pop key={i} at={bitAt[i]!} fromScale={0.3}>
              <div
                style={{
                  width: 96,
                  height: 120,
                  borderRadius: 16,
                  background: FL.panel,
                  border: `3px solid ${FL.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 80,
                    fontWeight: 700,
                    color: bit === "1" ? FL.accent : FL.text,
                  }}
                >
                  {bit}
                </span>
              </div>
            </Pop>
          ) : (
            <div
              key={i}
              style={{
                width: 96,
                height: 120,
                borderRadius: 16,
                border: `3px dashed ${FL.panelBorder}`,
                // "yeh binary code": empty slots wait, blinking, for the 8 digits
                opacity:
                  frame >= cue(tl, "5.4")
                    ? 0.4 + 0.4 * Math.abs(Math.sin((frame + i * 4) / 8))
                    : 0,
              }}
            />
          ),
        )}
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 6: many users */

const STUDENTS = [
  { name: "Ali", region: "userA" },
  { name: "Ayesha", region: "userB" },
  { name: "Hamza", region: "userC" },
] as const;

export const SceneUsers: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flUsers;
  const frame = useCurrentFrame();
  const start = cue(tl, "6.1");
  const lab = cue(tl, "6.1", "lab");
  const account = cue(tl, "6.2", "account");
  const privateAt = cue(tl, "6.3", "private");
  const denied = cue(tl, "6.3", "permission");
  const school = cue(tl, "6.1", "school");
  const kaam = cue(tl, "6.1", "kaam");
  const username = cue(tl, "6.2", "username");
  const passwords = cue(tl, "6.2", "password");
  const files = cue(tl, "6.3", "files");
  const doosre = cue(tl, "6.3", "doosre");
  const resources = cue(tl, "6.4", "resources");
  const access = cue(tl, "6.3", "access");
  const computerWord = cue(tl, "6.4", "computer");
  const deniedShake = useShake(access, 12, 16);
  const equally = cue(tl, "6.4", "equally");
  const fill = useBetween(equally, equally + 16);

  return (
    <Scene from={start - 8} to={lineEnd(tl, "6.4")}>
      <SfxCue file="pop.wav" at={resources} volume={0.3} />
      <SfxCue file="pop.wav" at={school} volume={0.3} />
      {[0, 1, 2, 3].map((n) => (
        <SfxCue
          key={`pw${n}`}
          file="type.wav"
          at={passwords + n * 4}
          volume={0.3}
        />
      ))}
      <SfxCue file="pop.wav" at={files} volume={0.35} />
      <SfxCue file="whoosh.wav" at={doosre} volume={0.3} />
      <SfxCue file="thud.wav" at={equally} volume={0.4} />
      <SfxCue file="swoosh.wav" at={start} volume={0.35} />
      {STUDENTS.map((s, i) => (
        <SfxCue key={s.name} file="pop.wav" at={lab + i * 6} volume={0.35} />
      ))}
      <SfxCue file="click-soft.wav" at={privateAt} volume={0.5} />
      <SfxCue file="zap.wav" at={denied} volume={0.45} />

      <div
        style={{
          ...abs(L.computer),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Pop
          at={start}
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Monitor size={250} color={FL.muted} strokeWidth={1.3} />
          <Pulse at={computerWord} color={FL.green} />
          {/* "kai students kaam karte hain": the screen takes turns between them */}
          {frame >= kaam && frame < account ? (
            <div
              style={{
                position: "absolute",
                top: 64,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <UserRound size={60} color={FL.accent} />
              <Txt size={26} weight={700}>
                {
                  STUDENTS[Math.floor((frame - kaam) / 12) % STUDENTS.length]!
                    .name
                }
              </Txt>
            </div>
          ) : null}
        </Pop>
        {frame >= school ? (
          <Pop at={school}>
            <Txt size={34} color={FL.muted} weight={600}>
              School lab
            </Txt>
          </Pop>
        ) : null}
      </div>

      {STUDENTS.map((s, i) => {
        const r = L[s.region];
        return (
          <div
            key={s.name}
            style={{
              ...abs(r),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pop at={lab + i * 6}>
              <Card
                accent={frame >= privateAt ? FL.accent : FL.panelBorder}
                style={{ padding: "26px 36px", gap: 24 }}
              >
                <UserRound size={84} color={FL.text} />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <Txt size={44}>{s.name}</Txt>
                  {frame >= username ? (
                    <Pop at={username + i * 4}>
                      <Txt
                        size={24}
                        color={FL.muted}
                        weight={600}
                        style={{ fontFamily: MONO_FONT }}
                      >
                        user:{" "}
                        {s.name
                          .toLowerCase()
                          .slice(
                            0,
                            Math.max(
                              0,
                              Math.floor((frame - username - i * 4) / 3),
                            ),
                          )}
                      </Txt>
                    </Pop>
                  ) : frame >= account ? (
                    <Pop at={account + i * 5}>
                      <Txt size={26} color={FL.muted} weight={600}>
                        User account
                      </Txt>
                    </Pop>
                  ) : null}
                  {frame >= passwords ? (
                    <Txt
                      size={24}
                      color={FL.muted}
                      weight={600}
                      style={{ fontFamily: MONO_FONT }}
                    >
                      pass:{" "}
                      {"\u2022".repeat(
                        Math.min(
                          4,
                          Math.max(0, Math.floor((frame - passwords) / 4) + 1),
                        ),
                      )}
                    </Txt>
                  ) : null}
                  {frame >= files ? (
                    <Pop at={files + i * 4}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <FileText size={28} color={FL.blue} />
                        <FileText size={28} color={FL.blue} />
                      </div>
                    </Pop>
                  ) : null}
                  {/* 6.4 "resources sab mein equally share": the same CPU + RAM share for everyone */}
                  {frame >= resources ? (
                    <Pop at={resources + i * 4}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 6,
                        }}
                      >
                        <Cpu size={30} color={FL.green} />
                        <div
                          style={{
                            width: 170,
                            height: 16,
                            borderRadius: 8,
                            background: FL.bg,
                            border: `2px solid ${FL.panelBorder}`,
                          }}
                        >
                          <div
                            style={{
                              width: `${(100 / 3) * (0.25 + 0.75 * fill)}%`,
                              height: "100%",
                              borderRadius: 8,
                              background: FL.green,
                            }}
                          />
                        </div>
                        <Txt
                          size={26}
                          weight={800}
                          color={fill > 0.5 ? FL.green : FL.muted}
                        >
                          1/3
                        </Txt>
                      </div>
                    </Pop>
                  ) : null}
                </div>
                {frame >= account ? (
                  <Pop at={account + i * 5}>
                    <Lock
                      size={56}
                      color={frame >= privateAt ? FL.accent : FL.muted}
                    />
                  </Pop>
                ) : null}
              </Card>
            </Pop>
          </div>
        );
      })}

      {/* "koi bhi doosre ki files": Ali reaches for Ayesha's files, the OS blocks it */}
      {frame >= doosre ? (
        <DrawLine
          from={cue(tl, "6.3", "koi")}
          to={denied}
          x1={L.userA.x + L.userA.w - 20}
          y1={L.userA.y + L.userA.h / 2 - 40}
          x2={L.userB.x + 20}
          y2={L.userB.y + L.userB.h / 2 - 40}
          color={frame >= denied ? FL.red : FL.dim}
          arrow
        />
      ) : null}
      {frame >= denied ? (
        <Pop
          at={denied}
          style={{
            position: "absolute",
            left: (L.userA.x + L.userA.w + L.userB.x) / 2 - 50,
            top: L.userA.y + L.userA.h / 2 - 95,
            width: 100,
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Txt size={110} weight={800} color={FL.red}>
            {"\u00d7"}
          </Txt>
        </Pop>
      ) : null}
      <SfxCue file="zap.wav" at={access} volume={0.3} />
      {frame >= denied ? (
        <Pop
          at={denied}
          style={{
            ...abs(L.denied),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card
            accent={FL.red}
            style={{
              padding: "18px 34px",
              background: FL.redSoft,
              transform: `translateX(${deniedShake}px)`,
            }}
          >
            <Txt size={46} color={FL.red} weight={800}>
              Access denied
            </Txt>
          </Card>
        </Pop>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 7: one tap */

const STEPS = [
  {
    line: "7.2",
    label: "OS",
    sub: "tap > instruction",
    icon: <Layers size={60} color={FL.accent} />,
    color: FL.accent,
  },
  {
    line: "7.3",
    label: "RAM",
    sub: "jagah",
    icon: <MemoryStick size={60} color={FL.blue} />,
    color: FL.blue,
  },
  {
    line: "7.4",
    label: "CPU",
    sub: "CPU time",
    icon: <Cpu size={60} color={FL.accent} />,
    color: FL.accent,
  },
  {
    line: "7.5",
    label: "Screen",
    sub: "+ speaker",
    icon: (
      <div style={{ display: "flex", gap: 6 }}>
        <Monitor size={52} color={FL.highlight} />
        <Speaker size={52} color={FL.highlight} />
      </div>
    ),
    color: FL.highlight,
  },
] as const;

export const SceneTap: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flTap;
  const frame = useCurrentFrame();
  const start = cue(tl, "7.1");
  const tap = cue(tl, "7.1", "tap");
  const stepAt = STEPS.map((s) => cue(tl, s.line, "number"));
  const video = cue(tl, "7.6", "video");
  const powers = cue(tl, "7.6", "super");
  const stepW = 300;
  const gap = (L.steps.w - STEPS.length * stepW) / (STEPS.length - 1);
  const stepX = (i: number) => L.steps.x + i * (stepW + gap);
  const midY = L.steps.y + L.steps.h / 2;
  const wapas = cue(tl, "7.1", "wapas");
  const ytWord = cue(tl, "7.1", "youtube");
  const instructions = cue(tl, "7.2", "tap");
  const convert = cue(tl, "7.2", "convert");
  const cpuTime = cue(tl, "7.4", "access");
  const processAt = cue(tl, "7.4", "process");
  const screenAt = cue(tl, "7.5", "screen");
  const speakersAt = cue(tl, "7.5", "speaker");
  const tap2 = cue(tl, "7.6", "tap");
  const end = lineEnd(tl, "7.6");
  const ripple = useBetween(tap, tap + 18);
  const ripple2 = useBetween(tap2, tap2 + 18);
  const play = useAppear(video, 12);
  const timeFill = useBetween(cpuTime, lineEnd(tl, "7.4"));
  const phoneLight =
    frame >= screenAt ? 0.5 + 0.2 * Math.sin((frame - screenAt) / 6) : 0;

  return (
    <Scene from={start - 8} to={lineEnd(tl, "7.6")}>
      <SfxCue file="swoosh.wav" at={start} volume={0.35} />
      <SfxCue file="click.wav" at={tap} volume={0.45} />
      {stepAt.map((at, i) => (
        <SfxCue key={i} file="snap.wav" at={at} volume={0.45} />
      ))}
      <SfxCue file="thud.wav" at={video} volume={0.45} />
      <SfxCue file="whoosh.wav" at={wapas} volume={0.35} />
      <SfxCue file="tick.wav" at={cpuTime} volume={0.3} />
      <SfxCue file="pop.wav" at={screenAt} volume={0.3} />
      <SfxCue file="pop.wav" at={speakersAt} volume={0.3} />
      <SfxCue file="click.wav" at={tap2} volume={0.4} />

      {/* 7.1 "wapas apne pehle question par": a rewind caption until step 1 */}
      {frame >= wapas && frame < stepAt[0]! ? (
        <Pop
          at={wapas}
          style={{
            ...abs(L.caption),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <RotateCcw
            size={56}
            color={FL.highlight}
            style={{
              transform: `rotate(${-Math.min(1, (frame - wapas) / 20) * 360}deg)`,
            }}
          />
          {frame >= cue(tl, "7.1", "under") ? (
            <Cog
              size={52}
              color={FL.accent}
              style={{
                transform: `rotate(${(frame - cue(tl, "7.1", "under")) * 6}deg)`,
              }}
            />
          ) : null}
          <Txt size={52} weight={800}>
            Wapas:{" "}
            <span style={{ color: FL.highlight }}>
              ek tap ke peeche kya hota hai?
            </span>
          </Txt>
        </Pop>
      ) : null}

      <div style={abs(L.phone)}>
        <PhoneFrame
          width={L.phone.w}
          glow={frame >= video ? "rgba(239,68,68,0.35)" : undefined}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {frame < video ? (
              <div style={{ position: "relative" }}>
                <Pulse at={ytWord} color={FL.red} />
                <Icon name="logos:youtube-icon" size={90} />
                {frame >= tap && frame < tap + 18 ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 60 + ripple * 180,
                      height: 60 + ripple * 180,
                      marginLeft: -(30 + ripple * 90),
                      marginTop: -(30 + ripple * 90),
                      borderRadius: "50%",
                      border: `4px solid ${FL.text}`,
                      opacity: 1 - ripple,
                    }}
                  />
                ) : null}
              </div>
            ) : (
              <div style={{ transform: `scale(${0.5 + play * 0.5})` }}>
                <CirclePlay size={150} color={FL.red} />
              </div>
            )}
          </div>
          {/* "screen ... kaam pe lagata hai": the screen lights up */}
          {phoneLight > 0 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: FL.accent,
                opacity: phoneLight * 0.25,
              }}
            />
          ) : null}
          {/* "video chal parti hai": the video plays */}
          {frame >= video ? (
            <div
              style={{
                position: "absolute",
                left: 24,
                right: 24,
                bottom: 60,
                height: 8,
                borderRadius: 4,
                background: FL.panelBorder,
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, ((frame - video) / (end - video)) * 100)}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: FL.red,
                }}
              />
            </div>
          ) : null}
          {frame >= tap2 && frame < tap2 + 18 ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 60 + ripple2 * 180,
                height: 60 + ripple2 * 180,
                marginLeft: -(30 + ripple2 * 90),
                marginTop: -(30 + ripple2 * 90),
                borderRadius: "50%",
                border: `4px solid ${FL.text}`,
                opacity: 1 - ripple2,
              }}
            />
          ) : null}
        </PhoneFrame>
        {/* "speakers": sound waves beside the phone */}
        {frame >= speakersAt
          ? [0, 1, 2].map((n) => {
              const t = ((frame - speakersAt + n * 10) % 30) / 30;
              return (
                <div
                  key={n}
                  style={{
                    position: "absolute",
                    left: L.phone.w - 30 + t * 50,
                    top: L.phone.h / 2 - 40 - t * 30,
                    width: 40 + t * 40,
                    height: 80 + t * 60,
                    borderRadius: "50%",
                    borderRight: `5px solid ${FL.highlight}`,
                    opacity: 1 - t,
                  }}
                />
              );
            })
          : null}
      </div>

      {/* 7.2 "app ko hardware ki instructions mein convert": signals stream into step 1 */}
      {Array.from(
        {
          length: Math.max(
            0,
            Math.ceil((lineEnd(tl, "7.2") - instructions) / 10),
          ),
        },
        (_, n) => (
          <FlowDot
            key={`ins-${n}`}
            from={instructions + n * 10}
            to={instructions + n * 10 + 14}
            x1={L.phone.x + L.phone.w + 10}
            y1={midY}
            x2={stepX(0) - 16}
            y2={midY}
            color={FL.accent}
            size={18}
          />
        ),
      )}
      {/* 7.6: the whole chain keeps working */}
      {Array.from(
        { length: Math.max(0, Math.ceil((end - video) / 14)) },
        (_, n) => (
          <div key={`run-${n}`}>
            {STEPS.slice(1).map((st, i) => (
              <FlowDot
                key={st.line}
                from={video + n * 14 + i * 4}
                to={video + n * 14 + i * 4 + 12}
                x1={stepX(i) + stepW + 8}
                y1={midY}
                x2={stepX(i + 1) - 16}
                y2={midY}
                color={st.color}
                size={16}
              />
            ))}
          </div>
        ),
      )}

      {STEPS.map((s, i) => (
        <div
          key={s.line}
          style={{
            position: "absolute",
            left: stepX(i),
            top: L.steps.y,
            width: stepW,
            height: L.steps.h,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Pop at={stepAt[i]!} slide={30} style={{ width: stepW }}>
            <Card
              accent={s.color}
              style={{
                width: stepW,
                height: 260,
                flexDirection: "column",
                gap: 14,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  left: -18,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  background: s.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 800,
                  fontSize: 34,
                  color: FL.bg,
                }}
              >
                {i + 1}
              </div>
              {s.icon}
              <Txt size={36}>{s.label}</Txt>
              <Txt size={26} color={FL.muted} weight={600}>
                {s.sub}
              </Txt>
              {/* 7.4 "CPU time deta hai": the app's slice of CPU time fills */}
              {/* 7.3 "memory yaani RAM mein place": YouTube's space in memory fills */}
              {i === 1 && frame >= cue(tl, "7.3", "memory") ? (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    right: 30,
                    bottom: 18,
                    height: 10,
                    borderRadius: 5,
                    background: FL.bg,
                  }}
                >
                  <div
                    style={{
                      width: `${interpolate(frame, [cue(tl, "7.3", "memory"), lineEnd(tl, "7.3")], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
                      height: "100%",
                      borderRadius: 5,
                      background: FL.blue,
                    }}
                  />
                </div>
              ) : null}
              {i === 1 ? (
                <Pulse at={cue(tl, "7.3", "ram")} color={s.color} />
              ) : null}
              {i === 1 ? (
                <Pulse at={cue(tl, "7.3", "place")} color={s.color} />
              ) : null}
              {i === 2 && frame >= cpuTime ? (
                <div
                  style={{
                    position: "absolute",
                    left: 30,
                    right: 30,
                    bottom: 18,
                    height: 10,
                    borderRadius: 5,
                    background: FL.bg,
                  }}
                >
                  <div
                    style={{
                      width: `${timeFill * 100}%`,
                      height: "100%",
                      borderRadius: 5,
                      background: FL.accent,
                    }}
                  />
                </div>
              ) : null}
              {i === 0 ? <Pulse at={convert} color={s.color} /> : null}
              {i === 2 ? <Pulse at={processAt} color={s.color} /> : null}
              {i === 2 ? (
                <Pulse at={cue(tl, "7.4", "taake")} color={s.color} />
              ) : null}
              {i === 2 ? (
                <Pulse at={cue(tl, "7.4", "cpu", 1)} color={FL.highlight} />
              ) : null}
              {i === 3 ? <Pulse at={screenAt} color={s.color} /> : null}
              {i === 3 ? <Pulse at={speakersAt} color={s.color} /> : null}
            </Card>
          </Pop>
        </div>
      ))}

      {STEPS.slice(1).map((s, i) => (
        <div key={`arrow-${s.line}`}>
          <DrawLine
            from={stepAt[i + 1]! - 6}
            to={stepAt[i + 1]! + 6}
            x1={stepX(i) + stepW + 8}
            y1={midY}
            x2={stepX(i + 1) - 12}
            y2={midY}
            color={FL.dim}
          />
          <FlowDot
            from={stepAt[i + 1]! - 6}
            to={stepAt[i + 1]! + 8}
            x1={stepX(i) + stepW + 8}
            y1={midY}
            x2={stepX(i + 1) - 16}
            y2={midY}
            color={s.color}
          />
        </div>
      ))}
      <DrawLine
        from={stepAt[0]! - 6}
        to={stepAt[0]!}
        x1={L.phone.x + L.phone.w + 10}
        y1={midY}
        x2={stepX(0) - 12}
        y2={midY}
        color={FL.dim}
      />

      {frame >= powers ? (
        <Pop
          at={powers}
          style={{
            ...abs(L.caption),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Txt size={52} weight={800}>
            Ek tap pe:{" "}
            <span style={{ color: FL.accent }}>
              OS ki saari super powers ON
            </span>
          </Txt>
        </Pop>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 8: common mistake */

const MISTAKE_OS = [
  {
    word: "windows",
    label: "Windows",
    icon: (s: number) => <Icon name="logos:microsoft-windows-icon" size={s} />,
  },
  {
    word: "android",
    label: "Android",
    icon: (s: number) => <Icon name="logos:android-icon" size={s * 0.78} />,
  },
] as const;

const MISTAKE_APPS = [
  { word: "whatsapp", icon: <Icon name="logos:whatsapp-icon" size={92} /> },
  { word: "youtube", icon: <Icon name="logos:youtube-icon" size={72} /> },
] as const;

/**
 * "Windows ya Android bhi bas ek app hai?" No: on "yaad rakhna" the OS logos slide down into
 * the system software layer, the apps drop onto the application software layer above it, and
 * on "upar" arrows show the apps running on top of the OS.
 */
export const SceneMistake: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flMistake;
  const frame = useCurrentFrame();
  const start = cue(tl, "8.1");
  const mistake = cue(tl, "8.1", "mistake");
  const appQ = cue(tl, "8.1", "app");
  const yaad = cue(tl, "8.2", "yaad");
  const application = cue(tl, "8.2", "application");
  const systemSw = cue(tl, "8.2", "system", 1);
  const upar = cue(tl, "8.2", "upar");
  const studentsAt = cue(tl, "8.1", "students");
  const samajhte = cue(tl, "8.1", "samajhte");
  const osWord = cue(tl, "8.2", "operating");
  const strike = useBetween(yaad, yaad + 8);
  const logoSize = 110;
  // logo centres: left column first, then inside the OS layer (right side)
  const homes: readonly Pt[] = [
    [L.logos.x + L.logos.w / 2, L.logos.y + L.logos.h * 0.27],
    [L.logos.x + L.logos.w / 2, L.logos.y + L.logos.h * 0.73],
  ];
  const slots: readonly Pt[] = [
    [L.os.x + L.os.w - 330, L.os.y + L.os.h / 2],
    [L.os.x + L.os.w - 130, L.os.y + L.os.h / 2],
  ];
  const arrowsX = [0.2, 0.5, 0.8].map((f) => L.links.x + L.links.w * f);

  return (
    <Scene from={start - 8} to={lineEnd(tl, "8.2")}>
      <SfxCue file="zap.wav" at={mistake} volume={0.45} />
      {MISTAKE_OS.map((o) => (
        <SfxCue
          key={o.word}
          file="pop.wav"
          at={cue(tl, "8.1", o.word)}
          volume={0.3}
        />
      ))}
      <SfxCue file="click.wav" at={appQ} volume={0.4} />
      <SfxCue file="swoosh.wav" at={yaad} volume={0.35} />
      {MISTAKE_APPS.map((a) => (
        <SfxCue
          key={a.word}
          file="pop.wav"
          at={cue(tl, "8.2", a.word)}
          volume={0.3}
        />
      ))}
      <SfxCue file="thud.wav" at={upar} volume={0.4} />
      {[0, 1, 2].map((i) => (
        <SfxCue
          key={`st${i}`}
          file="tick.wav"
          at={studentsAt + i * 5}
          volume={0.3}
        />
      ))}
      <SfxCue file="pop.wav" at={samajhte} volume={0.35} />

      <div
        style={{
          ...abs(L.title),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pop at={mistake} slide={-30}>
          <Txt size={64} weight={800}>
            Common <span style={{ color: FL.red }}>mistake</span>
          </Txt>
        </Pop>
        {/* "jo bohat se students karte hain: woh samajhte hain ..." */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {frame >= samajhte ? (
            <Pop at={samajhte} slide={10}>
              <Card
                accent={FL.highlight}
                style={{ padding: "8px 22px", borderRadius: 30 }}
              >
                <Txt size={36} weight={800} color={FL.highlight}>
                  Windows = app?
                </Txt>
              </Card>
            </Pop>
          ) : null}
          {[0, 1, 2].map((i) =>
            frame >= studentsAt + i * 5 ? (
              <Pop key={i} at={studentsAt + i * 5} slide={16}>
                <UserRound size={64} color={FL.muted} />
              </Pop>
            ) : null,
          )}
        </div>
      </div>

      {/* layers: apps on top, OS below */}
      {frame >= yaad ? (
        <Pop at={yaad} style={abs(L.os)}>
          <Card
            accent={frame >= systemSw ? FL.accent : FL.panelBorder}
            style={{
              width: L.os.w,
              height: L.os.h,
              justifyContent: "flex-start",
              padding: "0 44px",
              background: FL.accentSoft,
            }}
          >
            <Pulse at={osWord} color={FL.accent} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Txt size={50} weight={800} color={FL.accent}>
                Operating System
              </Txt>
              <Txt
                size={34}
                weight={700}
                color={frame >= systemSw ? FL.text : FL.muted}
              >
                system software
              </Txt>
            </div>
          </Card>
        </Pop>
      ) : null}
      {frame >= yaad + 6 ? (
        <Pop at={yaad + 6} style={abs(L.apps)}>
          <Card
            accent={frame >= application ? FL.green : FL.panelBorder}
            style={{
              width: L.apps.w,
              height: L.apps.h,
              justifyContent: "flex-start",
              padding: "0 44px",
            }}
          >
            <Pulse at={application} color={FL.green} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Txt size={50} weight={800} color={FL.green}>
                Apps
              </Txt>
              <Txt
                size={34}
                weight={700}
                color={frame >= application ? FL.text : FL.muted}
              >
                application software
              </Txt>
            </div>
          </Card>
        </Pop>
      ) : null}
      {MISTAKE_APPS.map((a, i) => {
        const at = cue(tl, "8.2", a.word);
        return frame >= at ? (
          <Pop
            key={a.word}
            at={at}
            slide={-80}
            style={{
              position: "absolute",
              left: slots[i]![0] - 60,
              top: L.apps.y + L.apps.h / 2 - 60,
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {a.icon}
          </Pop>
        ) : null;
      })}
      {arrowsX.map((x, i) =>
        frame < upar + i * 4 ? null : (
          <DrawLine
            key={i}
            from={upar + i * 4}
            to={upar + i * 4 + 12}
            x1={x}
            y1={L.links.y + L.links.h - 6}
            x2={x}
            y2={L.links.y + 10}
            color={FL.accent}
          />
        ),
      )}

      {/* the left column, emptied by the move, keeps the answer */}
      {frame >= systemSw ? (
        <div
          style={{
            ...abs(L.logos),
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 36,
          }}
        >
          <Pop at={systemSw} slide={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <SquareCheckBig size={56} color={FL.green} />
              <Txt size={36} weight={800} style={{ whiteSpace: "nowrap" }}>
                Windows, Android = <span style={{ color: FL.accent }}>OS</span>
              </Txt>
            </div>
          </Pop>
          <Pop at={systemSw + 8} slide={20}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <SquareCheckBig size={56} color={FL.green} />
              <Txt size={36} weight={800} style={{ whiteSpace: "nowrap" }}>
                WhatsApp, YouTube ={" "}
                <span style={{ color: FL.green }}>apps</span>
              </Txt>
            </div>
          </Pop>
        </div>
      ) : null}

      {/* the OS logos: tagged "App?" on the mistake, then moved into the OS layer */}
      {MISTAKE_OS.map((o, i) => {
        const at = cue(tl, "8.1", o.word);
        if (frame < at) return null;
        const [px, py] = along(frame, [
          [yaad + 6, homes[i]![0], homes[i]![1]],
          [yaad + 30 + i * 4, slots[i]![0], slots[i]![1]],
        ]);
        const moved = between01(frame, yaad + 6, yaad + 30);
        return (
          <div
            key={o.word}
            style={{
              position: "absolute",
              left: px - 150,
              top: py - 110,
              width: 300,
              height: 220,
            }}
          >
            <Pop
              at={at}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  transform: `scale(${1 - 0.25 * moved})`,
                }}
              >
                {o.icon(logoSize)}
              </div>
              {frame >= appQ && moved < 0.5 ? (
                <Pop at={appQ + i * 5} style={{ position: "relative" }}>
                  <Card
                    accent={FL.red}
                    style={{
                      padding: "6px 22px",
                      background: FL.redSoft,
                      borderRadius: 16,
                    }}
                  >
                    <Txt size={38} weight={800} color={FL.red}>
                      App?
                    </Txt>
                  </Card>
                  {strike > 0 ? (
                    <div
                      style={{
                        position: "absolute",
                        left: -8,
                        top: "50%",
                        height: 6,
                        width: `calc(${strike * 100}% + 16px)`,
                        background: FL.red,
                        borderRadius: 3,
                      }}
                    />
                  ) : null}
                </Pop>
              ) : null}
            </Pop>
          </div>
        );
      })}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 9: recap */

const RECAP = [
  {
    word: "hardware",
    label: "Hardware manage karna",
    icon: <TrafficCone size={52} color={FL.highlight} />,
  },
  {
    word: "apps",
    label: "Apps chalana",
    icon: <Play size={52} color={FL.green} />,
  },
  {
    word: "user",
    label: "User interface dena",
    icon: <Languages size={52} color={FL.accent} />,
  },
  {
    word: "separate",
    label: "Har user ka data alag",
    icon: <Lock size={52} color={FL.blue} />,
  },
] as const;

export const SceneRecap: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flRecap;
  const start = cue(tl, "9.1");
  const rowAt = RECAP.map((r) => cue(tl, "9.1", r.word));
  const frame = useCurrentFrame();
  const chaar = cue(tl, "9.1", "chaar");
  const yaad = cue(tl, "9.1", "yaad");

  return (
    <Scene from={start - 8} to={lineEnd(tl, "9.1")}>
      {rowAt.map((at, i) => (
        <SfxCue key={i} file="pop.wav" at={at} volume={0.4} />
      ))}
      <SfxCue file="thud.wav" at={lineEnd(tl, "9.1") - 12} volume={0.35} />
      <SfxCue file="snap.wav" at={chaar} volume={0.4} />
      <SfxCue file="pop.wav" at={yaad} volume={0.35} />
      <div style={{ ...abs(L.card) }}>
        <Pop at={start}>
          <Card
            style={{
              width: L.card.w,
              height: L.card.h,
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "56px 80px",
              gap: 48,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
                marginBottom: 20,
              }}
            >
              <Txt size={72} weight={800}>
                OS ke
              </Txt>
              {frame >= chaar ? (
                <Pop at={chaar} fromScale={0.2}>
                  <Txt size={88} weight={800} color={FL.highlight}>
                    4
                  </Txt>
                </Pop>
              ) : null}
              <Txt size={72} weight={800} color={FL.accent}>
                kaam
              </Txt>
              {frame >= yaad ? (
                <Pop at={yaad}>
                  <Pin
                    size={60}
                    color={FL.red}
                    style={{
                      transform: `rotate(${Math.sin((frame - yaad) / 3) * 14 * Math.max(0, 1 - (frame - yaad) / 40)}deg)`,
                    }}
                  />
                </Pop>
              ) : null}
            </div>
            {RECAP.map((r, i) => (
              <Pop key={r.word} at={rowAt[i]!} slide={20}>
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                  <SquareCheckBig size={60} color={FL.accent} />
                  {r.icon}
                  <Txt size={52} weight={700}>
                    {r.label}
                  </Txt>
                </div>
              </Pop>
            ))}
          </Card>
        </Pop>
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------- Beat 10: question, next, website, follow */

export const SceneEnd: React.FC<SceneProps> = ({ tl }) => {
  const L = LAYOUT.flEnd;
  const frame = useCurrentFrame();
  const start = cue(tl, "10.1");
  const comments = cue(tl, "10.1", "comments");
  const decide = cue(tl, "10.1", "decide");
  const website = cue(tl, "10.2", "website");
  const kernel = cue(tl, "10.3", "kernel");
  const follow = cue(tl, "10.4", "follow");
  const end = lineEnd(tl, "10.5");
  const followPulse =
    frame >= follow ? 1 + 0.06 * Math.sin((frame - follow) / 4) : 1;
  const chaarApps = cue(tl, "10.1", "chaar");
  const request = cue(tl, "10.1", "request");
  const ekTime = cue(tl, "10.1", "time");
  const cpuAsk = cue(tl, "10.1", "cpu");
  const kaun = cue(tl, "10.1", "kaun");
  const pehle = cue(tl, "10.1", "pehle");
  const mcqs = cue(tl, "10.2", "mcqs");
  const shortQ = cue(tl, "10.2", "short");
  const notes = cue(tl, "10.2", "notes");
  const check = cue(tl, "10.2", "check");
  const sahi = cue(tl, "10.2", "solve");
  const nextAt = cue(tl, "10.3");
  const shell = cue(tl, "10.3", "shell");
  const askApps = [
    <Icon key="wa" name="logos:whatsapp-icon" size={50} />,
    <Icon key="yt" name="logos:youtube-icon" size={40} />,
    <Music key="mu" size={46} color={FL.purple} />,
    <Icon key="tt" name="logos:tiktok-icon" size={46} />,
  ];

  return (
    <Scene from={start - 8} to={end + 6}>
      {askApps.map((_, i) => (
        <SfxCue
          key={`ap${i}`}
          file="tick.wav"
          at={chaarApps + i * 4}
          volume={0.3}
        />
      ))}
      <SfxCue file="zap.wav" at={request} volume={0.3} />
      {[mcqs, shortQ, notes].map((at) => (
        <SfxCue key={`w${at}`} file="click.wav" at={at} volume={0.35} />
      ))}
      {[0, 1, 2].map((i) => (
        <SfxCue
          key={`ck${i}`}
          file="tick.wav"
          at={check + i * 6}
          volume={0.35}
        />
      ))}
      <SfxCue file="pop.wav" at={sahi} volume={0.35} />
      <SfxCue file="whoosh.wav" at={nextAt} volume={0.3} />
      <SfxCue file="pop.wav" at={start} volume={0.45} />
      <SfxCue file="thud.wav" at={website} volume={0.45} />
      <SfxCue file="pop.wav" at={kernel} volume={0.4} />
      <SfxCue file="snap.wav" at={follow} volume={0.45} />

      {/* 10.1: the comments question */}
      <div style={{ ...abs(L.question) }}>
        <Pop at={start}>
          <Card
            accent={FL.highlight}
            style={{
              height: L.question.h,
              flexDirection: "column",
              gap: 14,
              position: "relative",
              padding: "0 60px",
            }}
          >
            {/* "chaar apps ... request bhejein": four apps jostle for one CPU; "pehle kis app ko": a ? hops between them */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                height: 70,
              }}
            >
              {askApps.map((icon, i) => {
                const jostle =
                  frame >= ekTime && frame < kaun
                    ? Math.sin((frame + i * 7) / 2.5) * 5
                    : 0;
                const asked =
                  frame >= pehle && Math.floor((frame - pehle) / 8) % 4 === i;
                return frame >= chaarApps + i * 4 ? (
                  <div key={i} style={{ transform: `translateY(${jostle}px)` }}>
                    <Pop
                      at={chaarApps + i * 4}
                      style={{ position: "relative" }}
                    >
                      {icon}
                      {asked ? (
                        <div
                          data-fl-box="free"
                          style={{
                            position: "absolute",
                            top: -46,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                          }}
                        >
                          <Txt size={40} weight={800} color={FL.highlight}>
                            ?
                          </Txt>
                        </div>
                      ) : null}
                    </Pop>
                  </div>
                ) : (
                  <div key={i} style={{ width: 50 }} />
                );
              })}
              {frame >= cpuAsk ? (
                <Pop
                  at={cpuAsk}
                  style={{ display: "flex", alignItems: "center", gap: 18 }}
                >
                  <Txt size={40} weight={800} color={FL.dim}>
                    {"\u2192"}
                  </Txt>
                  <Cpu size={56} color={FL.accent} />
                </Pop>
              ) : null}
            </div>
            <Txt size={38} weight={800} style={{ textAlign: "center" }}>
              4 apps ek saath CPU ko processing request bhejein:{" "}
              <span style={{ color: frame >= kaun ? FL.highlight : FL.dim }}>
                CPU pehle kis ko process kare, kaun decide karega?
              </span>
            </Txt>
            {frame >= comments ? (
              <Pop at={comments}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <MessageSquareText size={40} color={FL.accent} />
                  <Txt size={34} color={FL.accent} weight={700}>
                    Comments mein batao
                  </Txt>
                </div>
              </Pop>
            ) : null}
            <Pulse at={decide} color={FL.highlight} duration={30} />
          </Card>
        </Pop>
      </div>

      {/* 10.2: the website, as a challenge */}
      {frame >= mcqs ? (
        <div
          style={{ ...abs(L.next), display: "flex", justifyContent: "center" }}
        >
          <Pop at={mcqs} slide={30}>
            <Card
              accent={FL.accent}
              style={{
                height: L.next.h,
                padding: "0 44px",
                gap: 30,
                background: FL.accentSoft,
              }}
            >
              <Txt size={34} weight={700}>
                <span style={{ color: frame >= mcqs ? FL.highlight : FL.dim }}>
                  MCQs
                </span>{" "}
                +{" "}
                <span
                  style={{ color: frame >= shortQ ? FL.highlight : FL.dim }}
                >
                  short questions
                </span>{" "}
                +{" "}
                <span style={{ color: frame >= notes ? FL.highlight : FL.dim }}>
                  notes
                </span>
              </Txt>
              {frame >= website ? (
                <Pop at={website}>
                  <Txt size={48} color={FL.accent} weight={800}>
                    {BRAND.website}
                  </Txt>
                </Pop>
              ) : null}
              {frame >= check ? (
                <Pop
                  at={check}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    {[0, 1, 2].map((i) =>
                      frame >= check + i * 6 ? (
                        <Pop key={i} at={check + i * 6} fromScale={0.3}>
                          <SquareCheckBig size={38} color={FL.green} />
                        </Pop>
                      ) : (
                        <div key={i} style={{ width: 38 }} />
                      ),
                    )}
                  </div>
                  {frame >= sahi ? (
                    <Pop at={sahi}>
                      <Txt size={28} weight={800} color={FL.green}>
                        Kitne solve?
                      </Txt>
                    </Pop>
                  ) : null}
                </Pop>
              ) : null}
            </Card>
          </Pop>
        </div>
      ) : null}

      {/* 10.3 + 10.4: what comes next, and why to follow */}
      {frame >= nextAt ? (
        <div
          style={{
            ...abs(L.cta),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 26,
          }}
        >
          <Pop at={nextAt} slide={30}>
            <Card style={{ padding: "22px 50px", gap: 24 }}>
              <Layers size={56} color={FL.accent} />
              <Txt size={42} weight={700}>
                Next:{" "}
                <span style={{ color: frame >= kernel ? FL.accent : FL.dim }}>
                  Kernel
                </span>{" "}
                vs{" "}
                <span style={{ color: frame >= shell ? FL.highlight : FL.dim }}>
                  Shell
                </span>
                , kya difference hai?
              </Txt>
            </Card>
          </Pop>
          {frame >= follow ? (
            <Pop at={follow}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Avatar size={70} />
                <Txt size={36} weight={700}>
                  {BRAND.handle}
                </Txt>
                <div
                  style={{
                    transform: `scale(${followPulse})`,
                    background: FL.red,
                    color: FL.text,
                    borderRadius: 40,
                    padding: "12px 34px",
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 800,
                    fontSize: 32,
                    boxShadow: `0 0 40px ${FL.red}`,
                  }}
                >
                  Follow + Subscribe
                </div>
                <Txt size={30} color={FL.muted} weight={600}>
                  taake agli video miss na ho
                </Txt>
              </div>
            </Pop>
          ) : null}
        </div>
      ) : null}
    </Scene>
  );
};
