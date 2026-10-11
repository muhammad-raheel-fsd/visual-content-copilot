import {
  BookOpen,
  Calculator,
  Camera,
  Car,
  Cpu,
  MemoryStick,
  MessageCircle,
  Music,
  Printer,
  Speaker,
  SquareTerminal,
} from "lucide-react";
import { useCurrentFrame, useVideoConfig } from "remotion";

import { SfxCue } from "../../components/audio/SfxCue";
import { Icon } from "../../components/faceless/Icon";
import {
  Socials,
  Card,
  PhoneFrame,
  Pop,
  Scene,
  Txt,
  useAppear,
  useBetween,
} from "../../components/faceless/kit";
import { BRAND, DISPLAY_FONT, FL } from "../../components/faceless/theme";
import { cue, lineEnd, type Timeline } from "../../components/faceless/voice";
import { AppGrid, Crossroad } from "./scenes";

/**
 * Phase 1 Short (9:16 and the 4:5 feed cut): ONE complete idea, so a viewer learns something
 * even from 55 seconds. Question (who controls your apps?) > answer (the Operating System) >
 * the book's traffic controller acted out with its 3 decisions > takeaway card > next topic +
 * follow, website on screen. Cut list: pipeline/phase-01-who-controls-your-phone.md, section 4.
 * Every scene draws inside `stage`, the platform preset's safe stage (components/theme.ts).
 */

type Rect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
};
type SceneProps = { readonly tl: Timeline; readonly stage: Rect };

const stageBox = (stage: Rect): React.CSSProperties => ({
  position: "absolute",
  left: stage.x,
  top: stage.y,
  width: stage.w,
  height: stage.h,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const OpeningPhone: React.FC<{
  readonly stage: Rect;
  readonly start: number;
  readonly control?: number;
  /** [from, to): the app tiles jiggle ("Lekin kabhi socha hai ...") */
  readonly wiggle?: readonly [number, number];
}> = ({ stage, start, control, wiggle }) => {
  const frame = useCurrentFrame();
  const phoneW = Math.min(420, Math.round((stage.h * 0.92) / 2.05));
  const zoom = 1 + 0.08 * useAppear(control ?? Number.MAX_SAFE_INTEGER, 20);
  return (
    <div style={stageBox(stage)}>
      <div
        style={{
          position: "relative",
          transform: `scale(${zoom})`,
        }}
      >
        <PhoneFrame width={phoneW}>
          <div style={{ paddingTop: phoneW * 0.08 }}>
            <AppGrid
              start={start}
              tile={Math.round(phoneW * 0.17)}
              gap={Math.round(phoneW * 0.033)}
              wiggle={wiggle}
            />
          </div>
        </PhoneFrame>
        {control !== undefined && frame >= control ? (
          <Pop
            at={control}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt
              size={phoneW * 0.85}
              color={FL.highlight}
              weight={800}
              style={{ textShadow: `0 0 60px ${FL.bg}` }}
            >
              ?
            </Txt>
          </Pop>
        ) : null}
      </div>
    </div>
  );
};

export const ShortHook: React.FC<SceneProps> = ({ tl, stage }) => (
  <Scene from={cue(tl, "1.1") - 8} to={lineEnd(tl, "1.2")}>
    <SfxCue file="tick.wav" at={cue(tl, "1.1") + 9} volume={0.25} />
    <SfxCue file="tick.wav" at={cue(tl, "1.1") + 21} volume={0.25} />
    <SfxCue file="snap.wav" at={cue(tl, "1.2", "control")} volume={0.5} />
    <OpeningPhone
      stage={stage}
      start={cue(tl, "1.1")}
      control={cue(tl, "1.2", "control")}
      wiggle={[cue(tl, "1.2", "lekin"), cue(tl, "1.2", "control")]}
    />
  </Scene>
);

/** "Is question ka simple answer hai: Operating System, yaani OS." */
export const ShortAnswer: React.FC<SceneProps> = ({ tl, stage }) => {
  const os = cue(tl, "3.1", "operating");
  const start = cue(tl, "3.1");
  const answerWord = cue(tl, "3.1", "answer");
  const frame = useCurrentFrame();
  return (
    <Scene from={start - 6} to={lineEnd(tl, "3.1")}>
      <SfxCue file="swoosh.wav" at={os} volume={0.45} />
      <SfxCue file="pop.wav" at={start} volume={0.35} />
      {/* "Is question ka simple answer hai:": a bouncing ? until the answer lands */}
      {frame < os ? (
        <div style={{ ...stageBox(stage), gap: 20 }}>
          <Pop at={start}>
            <div
              style={{
                transform: `translateY(${Math.sin((frame - start) / 4) * 18}px)`,
              }}
            >
              <Txt size={300} weight={800} color={FL.highlight}>
                ?
              </Txt>
            </div>
          </Pop>
          {frame >= answerWord ? (
            <Pop at={answerWord}>
              <Txt size={72} weight={800}>
                Answer?
              </Txt>
            </Pop>
          ) : null}
        </div>
      ) : null}
      <div
        style={{ ...stageBox(stage), gap: 40, opacity: frame >= os ? 1 : 0 }}
      >
        <Pop at={os} slide={-80}>
          <Icon name="mdi:traffic-light" size={260} color={FL.green} />
        </Pop>
        <Pop at={os + 4}>
          <Card
            accent={FL.accent}
            style={{
              padding: "30px 48px",
              flexDirection: "column",
              gap: 6,
              background: FL.accentSoft,
            }}
          >
            <Txt
              size={80}
              weight={800}
              color={FL.accent}
              style={{ textAlign: "center" }}
            >
              Operating System
            </Txt>
            <Txt size={60} weight={800} color={FL.text}>
              (OS)
            </Txt>
          </Card>
        </Pop>
      </div>
    </Scene>
  );
};

/** Lines 4.1 to 4.7: the traffic controller acted out on the crossroad, one car per decision. */
export const ShortTraffic: React.FC<SceneProps> = ({ tl, stage }) => {
  const frame = useCurrentFrame();
  const start = cue(tl, "4.1");
  const trafficWord = cue(tl, "4.1", "traffic");
  const imagine = cue(tl, "4.2", "imagine");
  const arrive = cue(tl, "4.2", "crossroad");
  const crash = cue(tl, "4.2", "crash");
  const carsAre = cue(tl, "4.3", "cars");
  const appsAre = cue(tl, "4.3", "apps");
  const signal = cue(tl, "4.3", "signal");
  const decisionAt = [
    cue(tl, "4.4", "teen"),
    cue(tl, "4.4", "important"),
    cue(tl, "4.4", "decisions"),
  ];
  const numbers = [
    cue(tl, "4.5", "number"),
    cue(tl, "4.6", "number"),
    cue(tl, "4.7", "number"),
  ] as const;
  const size = Math.min(stage.w, stage.h);
  const x0 = stage.x + (stage.w - size) / 2;
  const y0 = stage.y + (stage.h - size) / 2;
  // the empty corners between the roads (the Crossroad's road is 17% of its size)
  const corner = (size * (1 - 0.17)) / 2 - 24;
  const bookOut = useBetween(imagine - 6, imagine + 4);

  return (
    <Scene from={start - 6} to={lineEnd(tl, "4.7")}>
      <SfxCue file="thud.wav" at={trafficWord} volume={0.35} />
      <SfxCue file="zap.wav" at={crash} volume={0.45} />
      <SfxCue file="pop.wav" at={carsAre} volume={0.35} />
      <SfxCue file="thud.wav" at={signal + 6} volume={0.4} />
      {decisionAt.map((at) => (
        <SfxCue key={at} file="tick.wav" at={at} volume={0.35} />
      ))}
      {numbers.map((at, i) => (
        <SfxCue key={i} file="snap.wav" at={at} volume={0.45} />
      ))}
      {numbers.map((at, i) => (
        <SfxCue key={`w${i}`} file="whoosh.wav" at={at + 10} volume={0.25} />
      ))}

      <Crossroad
        x={x0}
        y={y0}
        size={size}
        cues={{
          arrive,
          crash,
          signal,
          numbers,
          roadsAt: imagine,
          busy: cue(tl, "4.5", "process"),
          cpuPings: [cue(tl, "4.5", "cpu"), cue(tl, "4.5", "pehle", 1)],
          devicePings: [cue(tl, "4.7", "printer"), cue(tl, "4.7", "speaker")],
        }}
      />

      {/* 4.1: the book's line, the light on "traffic" */}
      {bookOut < 1 ? (
        <Pop
          at={start}
          style={{
            position: "absolute",
            left: stage.x,
            top: stage.y,
            width: stage.w,
            height: stage.h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1 - bookOut,
          }}
        >
          <Card
            accent={FL.accent}
            style={{
              maxWidth: stage.w,
              padding: "34px 40px",
              flexDirection: "column",
              gap: 18,
              background: FL.panel,
            }}
          >
            {frame >= trafficWord ? (
              <Pop at={trafficWord} slide={-50}>
                <Icon name="mdi:traffic-light" size={180} color={FL.green} />
              </Pop>
            ) : (
              <BookOpen size={140} color={FL.muted} />
            )}
            <Txt size={30} color={FL.muted} weight={600}>
              Book, Class 10, Chapter 1
            </Txt>
            <Txt size={60} weight={800} style={{ textAlign: "center" }}>
              OS = computer ka{" "}
              <span
                style={{ color: frame >= trafficWord ? FL.accent : FL.text }}
              >
                traffic controller
              </span>
            </Txt>
          </Card>
        </Pop>
      ) : null}

      {/* 4.3 in the top-left corner: cars = apps, signal = OS */}
      {frame >= carsAre && frame < numbers[0] ? (
        <div
          style={{
            position: "absolute",
            left: x0 + 10,
            top: y0 + 10,
            width: corner,
            height: corner,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <Pop at={carsAre} slide={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Car size={56} color={FL.muted} />
              <Txt size={42} weight={800}>
                ={" "}
                {frame >= appsAre ? (
                  <span style={{ color: FL.green }}>apps</span>
                ) : (
                  "?"
                )}
              </Txt>
            </div>
          </Pop>
          {frame >= signal ? (
            <Pop at={signal} slide={16}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon name="mdi:traffic-light" size={56} color={FL.green} />
                <Txt size={42} weight={800}>
                  = <span style={{ color: FL.accent }}>OS</span>
                </Txt>
              </div>
            </Pop>
          ) : null}
        </div>
      ) : null}

      {/* 4.4 in the bottom-left corner: "teen important decisions" */}
      {frame >= decisionAt[0]! ? (
        <div
          style={{
            position: "absolute",
            left: x0 + 10,
            top: y0 + size - corner - 10,
            width: corner,
            height: corner,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {[1, 2, 3].map((n, i) =>
              frame >= decisionAt[i]! ? (
                <Pop key={n} at={decisionAt[i]!} fromScale={0.3}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      background: [FL.accent, FL.blue, FL.highlight][i],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Txt size={34} weight={800} color={FL.bg}>
                      {n}
                    </Txt>
                  </div>
                </Pop>
              ) : null,
            )}
          </div>
          {frame >= decisionAt[2]! ? (
            <Pop at={decisionAt[2]!} slide={12}>
              <Txt size={42} weight={800}>
                decisions
              </Txt>
            </Pop>
          ) : null}
        </div>
      ) : null}
    </Scene>
  );
};

const TAKEAWAY = [
  {
    n: 1,
    label: "CPU pehle kis ko?",
    icon: <Cpu size={56} color={FL.accent} />,
    color: FL.accent,
  },
  {
    n: 2,
    label: "Memory kis ko, kitni?",
    icon: <MemoryStick size={56} color={FL.blue} />,
    color: FL.blue,
  },
  {
    n: 3,
    label: "Kaunsa device, kab?",
    icon: (
      <div style={{ display: "flex", gap: 6 }}>
        <Printer size={48} color={FL.highlight} />
        <Speaker size={48} color={FL.highlight} />
      </div>
    ),
    color: FL.highlight,
  },
] as const;

/**
 * Takeaway card (built in the 1.2 s gap after 4.7), then "OS ki agli video mein ... Kernel aur
 * Shell" (10.3) and "Follow aur subscribe kar lo, taake agli video miss na ho jaye" (10.4).
 * The website is on screen only.
 */
export const ShortOutro: React.FC<SceneProps> = ({ tl, stage }) => {
  const frame = useCurrentFrame();
  const start = lineEnd(tl, "4.7") + 2;
  const kernel = cue(tl, "10.3", "kernel");
  const follow = cue(tl, "10.4", "follow");
  const pulse = frame >= follow ? 1 + 0.06 * Math.sin((frame - follow) / 4) : 1;

  return (
    <Scene from={start} to={lineEnd(tl, "10.4") + 4}>
      {TAKEAWAY.map((row, i) => (
        <SfxCue
          key={row.n}
          file="pop.wav"
          at={start + 6 + i * 9}
          volume={0.4}
        />
      ))}
      <SfxCue file="whoosh.wav" at={kernel} volume={0.35} />
      <SfxCue file="thud.wav" at={follow} volume={0.45} />
      <div style={{ ...stageBox(stage), gap: 24 }}>
        <Pop at={start}>
          <Card
            accent={FL.accent}
            style={{
              width: stage.w,
              padding: "28px 40px",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 16,
              background: FL.panel,
            }}
          >
            <Txt size={46} weight={800} style={{ textAlign: "center" }}>
              OS = <span style={{ color: FL.accent }}>traffic controller</span>
            </Txt>
            {TAKEAWAY.map((row, i) => (
              <Pop key={row.n} at={start + 6 + i * 9} slide={20}>
                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      background: row.color,
                      color: FL.bg,
                      fontFamily: DISPLAY_FONT,
                      fontWeight: 800,
                      fontSize: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {row.n}
                  </div>
                  {row.icon}
                  <Txt size={42}>{row.label}</Txt>
                </div>
              </Pop>
            ))}
          </Card>
        </Pop>
        {frame >= kernel ? (
          <Pop at={kernel} slide={30}>
            <Card
              accent={FL.purple}
              style={{
                width: stage.w,
                padding: "20px 36px",
                gap: 22,
                background: FL.panel,
              }}
            >
              <SquareTerminal size={60} color={FL.purple} />
              <Txt size={44} weight={800}>
                Next: <span style={{ color: FL.purple }}>Kernel vs Shell</span>
              </Txt>
            </Card>
          </Pop>
        ) : null}
        {frame >= follow ? (
          <Pop at={follow}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Socials size={42} grid />
              <div
                style={{
                  transform: `scale(${pulse})`,
                  background: FL.red,
                  color: FL.text,
                  borderRadius: 50,
                  padding: "14px 44px",
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 800,
                  fontSize: 44,
                  boxShadow: `0 0 40px ${FL.red}`,
                }}
              >
                Follow + Subscribe
              </div>
              <Txt size={32} color={FL.highlight} weight={700}>
                MCQs + notes:{" "}
                <span style={{ color: FL.accent }}>{BRAND.website}</span>
              </Txt>
            </div>
          </Pop>
        ) : null}
      </div>
    </Scene>
  );
};

/** Last frames: the opening phone again, so the Short loops into its own start. */
export const ShortLoopFrame: React.FC<SceneProps> = ({ tl, stage }) => (
  <Scene from={lineEnd(tl, "10.4") + 4} to={tl.durationInFrames} fade={6}>
    <OpeningPhone stage={stage} start={lineEnd(tl, "10.4") - 200} />
  </Scene>
);

const STRIP_ICONS: React.ReactNode[] = [
  <Icon key="wa" name="logos:whatsapp-icon" size={56} />,
  <Cpu key="cpu" size={52} color={FL.accent} />,
  <Icon key="yt" name="logos:youtube-icon" size={44} />,
  <MemoryStick key="ram" size={52} color={FL.blue} />,
  <Music key="mu" size={52} color={FL.purple} />,
  <Speaker key="sp" size={52} color={FL.highlight} />,
  <Calculator key="calc" size={52} color={FL.highlight} />,
  <Camera key="cam" size={52} color={FL.blue} />,
  <MessageCircle key="msg" size={52} color={FL.green} />,
];

/**
 * The protected band under the platform's caption and buttons (production guide, section 8:
 * never blank): a thin progress line and the video's icons drifting slowly left, faint.
 */
export const ShortStrip: React.FC<{ readonly strip: Rect }> = ({ strip }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const step = 120;
  const period = STRIP_ICONS.length * step;
  const offset = (frame * 1.5) % period;
  const rows = strip.h > 200 ? 2 : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: strip.x,
        top: strip.y,
        width: strip.w,
        height: strip.h,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 18,
          height: 6,
          borderRadius: 3,
          background: FL.panelBorder,
        }}
      >
        <div
          style={{
            width: `${(100 * frame) / durationInFrames}%`,
            height: "100%",
            borderRadius: 3,
            background: FL.accent,
          }}
        />
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            top: 70 + r * 130,
            left: 0,
            height: 80,
            opacity: 0.22,
          }}
        >
          {Array.from(
            { length: Math.ceil(strip.w / step) + STRIP_ICONS.length + 1 },
            (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * step - offset + (r % 2) * (step / 2),
                  width: step,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {STRIP_ICONS[(i + r * 4) % STRIP_ICONS.length]}
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};
