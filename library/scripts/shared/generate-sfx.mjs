import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// library/scripts/shared/*.mjs → siblings under library/, so ../../sfx
const OUT_DIR = join(HERE, "..", "..", "sfx");
const SAMPLE_RATE = 44100;

mkdirSync(OUT_DIR, { recursive: true });

function writeWav(filename, samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(filename, buf);
}

function makeBuffer(seconds) {
  return new Float32Array(Math.floor(SAMPLE_RATE * seconds));
}

// tick: short high-pitched sine burst, ~30ms
function tick() {
  const s = makeBuffer(0.04);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 180);
    s[i] = Math.sin(2 * Math.PI * 2400 * t) * env * 0.45;
  }
  return s;
}

// click: mid-frequency sine + noise burst, ~40ms
function click() {
  const s = makeBuffer(0.05);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 140);
    const tone = Math.sin(2 * Math.PI * 900 * t) * 0.55;
    const noise = (Math.random() * 2 - 1) * 0.35;
    s[i] = (tone + noise) * env * 0.55;
  }
  return s;
}

// whoosh: low-pass filtered noise, cutoff sweeps up then down, ~250ms
function whoosh() {
  const dur = 0.28;
  const s = makeBuffer(dur);
  let lp = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const raw = Math.random() * 2 - 1;
    const progress = t / dur;
    const cutoffHz = 300 + 3000 * Math.sin(Math.PI * progress);
    const alpha = Math.exp((-2 * Math.PI * cutoffHz) / SAMPLE_RATE);
    lp = raw * (1 - alpha) + lp * alpha;
    const env = Math.sin(Math.PI * progress);
    s[i] = lp * env * 1.6;
  }
  return s;
}

// pop: quick descending pitch, ~80ms
function pop() {
  const s = makeBuffer(0.1);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 900 * Math.exp(-t * 22);
    const env = Math.exp(-t * 32);
    s[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.65;
  }
  return s;
}

// ding: bell with harmonic stack, ~500ms
function ding() {
  const s = makeBuffer(0.6);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 5);
    s[i] =
      (Math.sin(2 * Math.PI * 880 * t) * 0.5 +
        Math.sin(2 * Math.PI * 1760 * t) * 0.28 +
        Math.sin(2 * Math.PI * 2640 * t) * 0.12) *
      env *
      0.4;
  }
  return s;
}

// type: micro noise-click for typing rhythm, ~20ms
function type() {
  const s = makeBuffer(0.025);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 350);
    s[i] = (Math.random() * 2 - 1) * env * 0.42;
  }
  return s;
}

// notify: two-tone C5 -> E5 chime, ~600ms
function notify() {
  const dur = 0.65;
  const s = makeBuffer(dur);
  const half = Math.floor(s.length / 2);
  for (let i = 0; i < s.length; i++) {
    const inSecond = i >= half;
    const localT = (inSecond ? i - half : i) / SAMPLE_RATE;
    const freq = inSecond ? 659.25 : 523.25;
    const env = Math.exp(-localT * 4);
    s[i] = Math.sin(2 * Math.PI * freq * localT) * env * 0.38;
  }
  return s;
}

// ting: single crisp bell for emphasis, ~350ms. Higher and cleaner than ding.
function ting() {
  const s = makeBuffer(0.4);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 7);
    s[i] =
      (Math.sin(2 * Math.PI * 1568 * t) * 0.55 + // G6 fundamental
        Math.sin(2 * Math.PI * 3136 * t) * 0.3 + // G7 harmonic
        Math.sin(2 * Math.PI * 4704 * t) * 0.12) * // stacked bell shimmer
      env *
      0.4;
  }
  return s;
}

// zap: quick descending noise-tone for cut/transition, ~120ms
function zap() {
  const s = makeBuffer(0.14);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const freq = 1800 * Math.exp(-t * 18);
    const env = Math.exp(-t * 22);
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.6;
    const noise = (Math.random() * 2 - 1) * 0.25;
    s[i] = (tone + noise) * env * 0.55;
  }
  return s;
}

// chime: warm rising two-tone (E5 -> B5), softer than notify, ~700ms
function chime() {
  const dur = 0.75;
  const s = makeBuffer(dur);
  const midpoint = Math.floor(s.length * 0.4);
  for (let i = 0; i < s.length; i++) {
    const inSecond = i >= midpoint;
    const localT = (inSecond ? i - midpoint : i) / SAMPLE_RATE;
    const freq = inSecond ? 987.77 : 659.25; // B5, E5
    const env = Math.exp(-localT * 3.5);
    const fund = Math.sin(2 * Math.PI * freq * localT) * 0.5;
    const harm = Math.sin(2 * Math.PI * freq * 2 * localT) * 0.2;
    s[i] += (fund + harm) * env * 0.35;
  }
  // add a soft attack fade
  const attack = Math.min(200, s.length);
  for (let i = 0; i < attack; i++) s[i] *= i / attack;
  return s;
}

// click-soft: gentler click for subtle UI ticks, ~30ms
function clickSoft() {
  const s = makeBuffer(0.04);
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 200);
    const tone = Math.sin(2 * Math.PI * 1200 * t) * 0.4;
    const noise = (Math.random() * 2 - 1) * 0.15;
    s[i] = (tone + noise) * env * 0.4;
  }
  return s;
}

// swoosh: longer, deeper whoosh for zoom/scene changes, ~450ms
function swoosh() {
  const dur = 0.5;
  const s = makeBuffer(dur);
  let lp = 0;
  for (let i = 0; i < s.length; i++) {
    const t = i / SAMPLE_RATE;
    const progress = t / dur;
    const raw = Math.random() * 2 - 1;
    // cutoff sweeps low -> high -> low, longer envelope
    const cutoffHz = 200 + 2500 * Math.sin(Math.PI * progress);
    const alpha = Math.exp((-2 * Math.PI * cutoffHz) / SAMPLE_RATE);
    lp = raw * (1 - alpha) + lp * alpha;
    const env = Math.pow(Math.sin(Math.PI * progress), 1.5);
    s[i] = lp * env * 1.8;
  }
  return s;
}

const sounds = {
  tick,
  click,
  whoosh,
  pop,
  ding,
  type,
  notify,
  ting,
  zap,
  chime,
  "click-soft": clickSoft,
  swoosh,
};

for (const [name, fn] of Object.entries(sounds)) {
  const samples = fn();
  const path = join(OUT_DIR, `${name}.wav`);
  writeWav(path, samples);
  const ms = ((samples.length / SAMPLE_RATE) * 1000).toFixed(0);
  process.stdout.write(`wrote ${name}.wav (${ms}ms)\n`);
}
