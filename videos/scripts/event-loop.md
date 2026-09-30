# The JavaScript Event Loop

**Format**: YouTube 16:9 (primary)
**Target length**: 90s (approximate, adjusted to actual TTS duration + 1s buffer per beat)
**Audience**: Junior JS devs who have seen `setTimeout` and `Promise.then` but don't yet know why one runs before the other.
**One-sentence hook**: `Promise.resolve().then(...)` fires *before* a zero-ms `setTimeout`. Here's why.

## Beats

### Beat 1 — Hook (~12s)
- **On-screen visual**: Left panel with 4 log statements (A, setTimeout B 0, Promise.then C, D). Right panel is a console. As the narration proceeds, the actual output pops in one line at a time: A, D, C, B. B is highlighted at the end.
- **On-screen text**: "Wait, why is B last?"
- **Voiceover**: "Look at this code. Four log statements. What do you think prints first? Actually, it's A. Then D. Then C. Then B. Wait, why is B last?"
- **Sound**: `whoosh` on entry, `pop` per console line, `ding` on the paradox reveal.
- **Focus pointer**: sweep across code, then across each console line as it appears, ending on B.

### Beat 2 — The Call Stack (~16s)
- **On-screen visual**: Left panel with code (`greet`, `say`, `greet()` call). Right panel is a call stack visualization. Frames push in from below, one at a time, with syntax-matched colors. Then they pop off in LIFO order.
- **On-screen text**: "Last in, first out."
- **Voiceover**: "To understand this, we need to see how JavaScript actually runs code. JavaScript is single-threaded. It uses one call stack. Every time you call a function, a stack frame is added on top. When that function returns, the frame pops off. Last in, first out."
- **Sound**: `tick` per push, `pop` per pop, `ding` on the LIFO reveal.
- **Focus pointer**: follows the currently-executing code line and the top of the stack.

### Beat 3 — Web APIs Hand-off (~14s)
- **On-screen visual**: Left panel with code showing a `setTimeout(fn, 0)` call. Right panel split: stack on top, Web APIs box below. When `setTimeout` executes, its frame briefly appears in the stack, then an arrow animates from stack to Web APIs box. The Web APIs box lights up "timer running".
- **On-screen text**: "Async work leaves the stack."
- **Voiceover**: "But some operations aren't synchronous. When you call setTimeout, or fetch, or add an event listener, JavaScript doesn't wait. It hands the work over to browser APIs, and the stack keeps going."
- **Sound**: `tick` on push, `whoosh` on the hand-off arrow, `pop` on the Web API box lighting up.
- **Focus pointer**: setTimeout line → stack → Web API box.

### Beat 4 — Two Queues (~18s)
- **On-screen visual**: Full scene layout. Call stack on the left (empty). Event loop icon in the center. Two queues on the right: microtask queue on top (purple accent), task queue on bottom (orange accent). A Promise callback lands in the microtask queue with a pop. A setTimeout callback lands in the task queue with a pop.
- **On-screen text**: "Two queues. Two priorities."
- **Voiceover**: "When that async work completes, the callback doesn't jump straight back to the stack. First, it goes into a queue. But there are two queues. Promise callbacks land in the microtask queue. Timer callbacks land in the task queue."
- **Sound**: `pop` when each callback lands in its queue, `tick` on queue label reveal.
- **Focus pointer**: microtask queue label → task queue label → the two callback tokens inside them.

### Beat 5 — Event Loop Drains (~22s)
- **On-screen visual**: Same scene. The event loop icon rotates smoothly. First, the microtask flies from the microtask queue → onto the call stack → executes → "C" appears in a small console → the frame pops off. Then the task flies from the task queue → onto the stack → executes → "B" appears → pops.
- **On-screen text**: "Microtasks first. Every time."
- **Voiceover**: "This is where the event loop comes in. It watches the stack. When the stack is empty, it takes a callback from a queue and puts it on the stack to run. Here's the rule: it drains every microtask before touching the next task. Microtasks always go first."
- **Sound**: `whoosh` on each flight, `tick` when landing on stack, `pop` on each stack pop, `ding` on the rule reveal.
- **Focus pointer**: event loop icon → microtask flying to stack → console "C" → task flying to stack → console "B" → final label.

### Beat 6 — Payoff (~10s)
- **On-screen visual**: Return to Beat 1's console output. Each line gets an annotation badge: sync, sync, microtask, task. Big reveal at the bottom: "MICROTASKS JUMP THE LINE".
- **On-screen text**: "Microtasks jump the line."
- **Voiceover**: "That's why C, from the Promise, always fires before B, from setTimeout zero. Same tick. Same zero milliseconds. But microtasks jump the line. Every single time."
- **Sound**: `pop` per annotated line, `ding` on the final reveal.
- **Focus pointer**: sweep across all four annotated lines, then park on the reveal text.

## Assets needed

- Icons (via `lucide-react`): `Layers` (call stack), `Timer` (task queue), `Zap` (microtask queue), `Globe` (Web APIs), `RefreshCw` (event loop), `Terminal` (console).
- Illustrations: none.
- Sound effects: `tick.wav`, `pop.wav`, `whoosh.wav`, `ding.wav` — synthesized by `npm run gen:sfx`.
- Voiceover: `public/voiceover/event-loop/beat-{1,2,3,4,5,6}.mp3` — generated by `npm run gen:voice`.
- Custom components: all in `src/components/` (see file listing).
