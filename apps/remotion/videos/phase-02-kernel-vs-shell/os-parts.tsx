import { Cpu } from "lucide-react";
import { interpolate, useCurrentFrame } from "remotion";

import { Pop, Pulse, Txt } from "../../components/faceless/kit";
import { FL } from "../../components/faceless/theme";

/**
 * Phase 02's recurring picture: ONE Operating System box with its two parts inside, the Shell (an
 * outer ring, the side that talks to the user) and the Kernel (the inner core, the side that talks
 * to the hardware). The parts are always drawn INSIDE the OS box, so they read as parts of the OS,
 * never as separate layers (Muhammad, 2026-10-11).
 *
 * Each piece appears ON the word that names it and not before (Muhammad, 2026-10-11): the box on
 * "Operating System" (`at`), the Shell ring on "Shell" (`shellAt`), the Kernel core on "Kernel"
 * (`kernelAt`). Before its word a piece is not drawn at all (no dim placeholder); leave a time out
 * and that piece stays hidden for the scene.
 */
export const OsBox: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** frame the OS box itself appears ("Operating System") */
  readonly at?: number;
  /** frames the Shell / Kernel parts appear, lit */
  readonly shellAt?: number;
  readonly kernelAt?: number;
  /** extra pulses on a part, e.g. when a command passes through it */
  readonly shellPulses?: readonly number[];
  readonly kernelPulses?: readonly number[];
}> = ({ x, y, w, h, at, shellAt, kernelAt, shellPulses = [], kernelPulses = [] }) => {
  const frame = useCurrentFrame();
  const shown = (t: number | undefined) => t !== undefined && frame >= t;
  const shellOn = shown(shellAt) ? levelAt(frame, shellAt!) : 0;
  const kernelOn = shown(kernelAt) ? levelAt(frame, kernelAt!) : 0;
  const boxOn = shown(at) ? levelAt(frame, at!) : 0;
  const ringInset = Math.min(w, h) * 0.12;
  const coreInset = Math.min(w, h) * 0.3;
  if (!shown(at) && !shown(shellAt) && !shown(kernelAt)) return null;
  const grow = (on: number) => `scale(${interpolate(on, [0, 1], [0.9, 1])})`;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* the OS box */}
      {boxOn > 0 ? (
        <div style={{ position: "absolute", inset: 0, opacity: boxOn, transform: grow(boxOn) }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 32,
              border: `3px solid ${FL.panelBorder}`,
              background: "rgba(22,27,34,0.85)",
            }}
          />
          <div style={{ position: "absolute", left: 0, right: 0, top: 14, textAlign: "center" }}>
            <Txt size={Math.max(26, w * 0.04)} weight={800} color={FL.muted}>
              Operating System
            </Txt>
          </div>
        </div>
      ) : null}
      {/* the Shell: outer ring */}
      {shellOn > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: ringInset,
            top: ringInset + 30,
            borderRadius: 28,
            opacity: shellOn,
            transform: grow(shellOn),
            border: `10px solid ${FL.green}`,
            boxShadow: `0 0 30px rgba(63,185,80,0.35)`,
          }}
        >
          <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center" }}>
            <Txt size={Math.max(24, w * 0.045)} weight={800} color={FL.green}>
              Shell
            </Txt>
          </div>
        </div>
      ) : null}
      {shellPulses.map((p) =>
        shellOn > 0 ? (
          <div key={p} style={{ position: "absolute", inset: ringInset, top: ringInset + 30 }}>
            <Pulse at={p} color={FL.green} radius={28} />
          </div>
        ) : null
      )}
      {/* the Kernel: inner core */}
      {kernelOn > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: coreInset,
            top: coreInset + 40,
            borderRadius: 24,
            opacity: kernelOn,
            transform: grow(kernelOn),
            background: FL.accentSoft,
            border: `4px solid ${FL.accent}`,
            boxShadow: `0 0 40px rgba(88,166,255,0.4)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {kernelPulses.map((p) => (
            <Pulse key={p} at={p} color={FL.accent} radius={24} />
          ))}
          <Cpu size={Math.max(40, w * 0.08)} color={FL.accent} />
          <Txt size={Math.max(24, w * 0.045)} weight={800} color={FL.accent}>
            Kernel
          </Txt>
        </div>
      ) : null}
    </div>
  );
};

/** 0..1 ramp for a part lighting up (a plain function, not a hook). */
const levelAt = (frame: number, at: number): number =>
  interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** A small labelled icon card that pops in on its word (hardware, inputs, outputs). */
export const IconChip: React.FC<{
  readonly at: number;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly color?: string;
  readonly lit?: boolean;
  readonly pulses?: readonly number[];
  readonly width?: number;
}> = ({ at, icon, label, color = FL.text, lit = false, pulses = [], width = 260 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  return (
    <Pop at={at} slide={16}>
      <div
        style={{
          position: "relative",
          width,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 20px",
          borderRadius: 20,
          background: FL.panel,
          border: `3px solid ${lit ? color : FL.panelBorder}`,
        }}
      >
        {pulses.map((p) => (
          <Pulse key={p} at={p} color={color} radius={20} />
        ))}
        <div style={{ flexShrink: 0, display: "flex" }}>{icon}</div>
        <Txt size={30} weight={700} color={lit ? color : FL.text} style={{ whiteSpace: "nowrap" }}>
          {label}
        </Txt>
      </div>
    </Pop>
  );
};
