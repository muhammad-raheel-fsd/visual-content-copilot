import type { Deck } from "../SlideDeck";
import { Card, HeroSlide, SlideLayout, SplitSlide } from "../components/SlideLayout";

const Row: React.FC<{ label: string; tag: string; color: string }> = ({ label, tag, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <span style={{ color: "var(--muted)", fontSize: 24 }}>›</span>
    <span style={{ color: "var(--text)", fontWeight: 700, minWidth: 60 }} className="mono">
      {label}
    </span>
    <span
      style={{
        fontSize: 18,
        color,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        opacity: 0.9,
      }}
    >
      {tag}
    </span>
  </div>
);

const StackChip: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div
    style={{
      padding: "26px 32px",
      borderRadius: 14,
      backgroundColor: `${color}22`,
      border: `2px solid ${color}`,
      color,
      fontSize: 28,
      fontFamily: "Roboto Mono, monospace",
      boxShadow: `0 0 30px 0 ${color}44`,
      minWidth: 320,
      textAlign: "center",
    }}
  >
    {label}
  </div>
);

const QueueRow: React.FC<{ label: string; sublabel: string; color: string; item: string }> = ({
  label,
  sublabel,
  color,
  item,
}) => (
  <Card title={`${label}   ·   ${sublabel}`} accent={color} style={{ height: "auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: -8 }}>
      <div
        style={{
          padding: "20px 28px",
          borderRadius: 12,
          backgroundColor: `${color}22`,
          border: `2px solid ${color}`,
          color,
          fontSize: 28,
          fontFamily: "Roboto Mono, monospace",
        }}
      >
        {item}
      </div>
    </div>
  </Card>
);

const ACCENT_LOOP = "var(--loop)";

export const eventLoopDeck: Deck = {
  title: "The JavaScript Event Loop",
  accent: ACCENT_LOOP,
  slides: [
    {
      id: "hook",
      render: (
        <HeroSlide
          title={
            <>
              Same tick.<br />
              Different order.
            </>
          }
          subtitle={
            <>
              Why does <span style={{ color: "var(--microtask)" }}>Promise.then</span> beat{" "}
              <span style={{ color: "var(--task)" }}>setTimeout(0)</span>?
            </>
          }
          accent={ACCENT_LOOP}
        />
      ),
    },
    {
      id: "code",
      transition: "slide",
      render: (
        <SlideLayout
          title="The paradox"
          subtitle="Guess the output order. Then check the console."
          accent={ACCENT_LOOP}
        >
          <SplitSlide
            left={
              <Card title="source.js" accent={ACCENT_LOOP}>
                <pre className="mono" style={{ fontSize: 26, lineHeight: 1.7, margin: 0 }}>
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>console</span>.log(
                  <span style={{ color: "#a5d6ff" }}>"A"</span>);
                  {"\n"}
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>setTimeout</span>(() =&gt;{" "}
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>console</span>.log(
                  <span style={{ color: "#a5d6ff" }}>"B"</span>), <span style={{ color: "#79c0ff" }}>0</span>);
                  {"\n"}
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>Promise</span>.resolve().then(() =&gt;{" "}
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>console</span>.log(
                  <span style={{ color: "#a5d6ff" }}>"C"</span>));{"\n"}
                  <span style={{ color: "var(--fn, #d2a8ff)" }}>console</span>.log(
                  <span style={{ color: "#a5d6ff" }}>"D"</span>);
                </pre>
              </Card>
            }
            right={
              <Card title="Console" accent={ACCENT_LOOP}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: 40 }}>
                  <Row label="A" tag="sync" color="var(--sync)" />
                  <Row label="D" tag="sync" color="var(--sync)" />
                  <Row label="C" tag="microtask" color="var(--microtask)" />
                  <Row label="B" tag="task" color="var(--task)" />
                </div>
              </Card>
            }
          />
        </SlideLayout>
      ),
    },
    {
      id: "stack",
      render: (
        <SlideLayout
          title="One call stack"
          subtitle="JavaScript is single-threaded. Every call is a frame on top of the stack."
          accent={ACCENT_LOOP}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 20,
              height: "100%",
              paddingBottom: 40,
            }}
          >
            <StackChip color="var(--task)" label='console.log("hi")' />
            <StackChip color="var(--microtask)" label='say("hi")' />
            <StackChip color="var(--sync)" label="greet()" />
          </div>
        </SlideLayout>
      ),
    },
    {
      id: "web-apis",
      render: (
        <SlideLayout
          title="Async work leaves the stack"
          subtitle="setTimeout, fetch, DOM events — the browser handles them."
          accent="var(--api)"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              height: "100%",
              alignItems: "center",
            }}
          >
            <Card title="call stack" accent="var(--api)">
              <div style={{ opacity: 0.5, fontSize: 24, fontStyle: "italic" }}>empty</div>
            </Card>
            <Card title="Web APIs" accent="var(--api)">
              <div style={{ fontSize: 30, color: "var(--api)", fontWeight: 700 }}>
                ⏱ timer running · 0 ms
              </div>
              <div style={{ marginTop: 12, fontSize: 20, color: "var(--muted)" }}>
                callback ready to enqueue
              </div>
            </Card>
          </div>
        </SlideLayout>
      ),
    },
    {
      id: "queues",
      render: (
        <SlideLayout title="Two queues, two priorities" accent={ACCENT_LOOP}>
          <div style={{ display: "flex", flexDirection: "column", gap: 32, height: "100%" }}>
            <QueueRow
              label="MICROTASK QUEUE"
              sublabel="Promises · queueMicrotask · async/await"
              color="var(--microtask)"
              item='() => log("C")'
            />
            <QueueRow
              label="TASK QUEUE"
              sublabel="setTimeout · setInterval · DOM events · I/O"
              color="var(--task)"
              item='() => log("B")'
            />
          </div>
        </SlideLayout>
      ),
    },
    {
      id: "loop",
      render: (
        <SlideLayout
          title="The event loop drains queues"
          subtitle="Microtasks always go first."
          accent={ACCENT_LOOP}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 24,
              height: "100%",
              fontSize: 40,
              lineHeight: 1.5,
            }}
          >
            <div>
              <span style={{ color: "var(--muted)" }}>1.</span> Stack is empty →{" "}
              <span style={{ color: "var(--microtask)" }}>drain ALL microtasks</span>
            </div>
            <div>
              <span style={{ color: "var(--muted)" }}>2.</span> Take{" "}
              <span style={{ color: "var(--task)" }}>ONE task</span> from task queue
            </div>
            <div>
              <span style={{ color: "var(--muted)" }}>3.</span> Repeat forever
            </div>
          </div>
        </SlideLayout>
      ),
    },
    {
      id: "payoff",
      entrySfx: "ting.wav",
      render: (
        <HeroSlide
          title={
            <>
              Microtasks jump the line.
            </>
          }
          subtitle={
            <>
              Same tick. Same zero milliseconds. But <span style={{ color: "var(--microtask)" }}>C</span>{" "}
              always fires before <span style={{ color: "var(--task)" }}>B</span>.
            </>
          }
          accent="var(--microtask)"
        />
      ),
    },
  ],
};
