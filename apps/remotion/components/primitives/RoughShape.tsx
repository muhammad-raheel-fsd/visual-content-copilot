import { useMemo } from "react";
import rough from "roughjs";
import { interpolate, useCurrentFrame } from "remotion";

/**
 * Hand-drawn "sketchy" SVG shape using RoughJS.
 * Generates once (using the frame as seed for stable output) and renders as SVG.
 * Supports optional draw-on animation via stroke-dashoffset.
 */
type Shape =
  | { kind: "rectangle"; x: number; y: number; w: number; h: number }
  | { kind: "circle"; cx: number; cy: number; d: number }
  | { kind: "ellipse"; cx: number; cy: number; w: number; h: number }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "arrow"; x1: number; y1: number; x2: number; y2: number };

type Props = {
  readonly shape: Shape;
  readonly color?: string;
  readonly strokeWidth?: number;
  readonly fill?: string;
  readonly fillStyle?: "hachure" | "solid" | "zigzag" | "cross-hatch" | "dots";
  readonly roughness?: number;
  readonly seed?: number;
  /** Frame range to animate the "draw-on" stroke (start..end). */
  readonly drawFrom?: number;
  readonly drawTo?: number;
  readonly focusKey?: string;
};

export const RoughShape: React.FC<Props> = ({
  shape,
  color = "#c9d1d9",
  strokeWidth = 2.5,
  fill,
  fillStyle = "hachure",
  roughness = 1.4,
  seed = 42,
  drawFrom,
  drawTo,
  focusKey,
}) => {
  const frame = useCurrentFrame();

  const paths = useMemo(() => {
    // Render to a detached SVG to grab the <path> elements RoughJS produces.
    const svgNs = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNs, "svg");
    const rc = rough.svg(svg as SVGSVGElement);
    const options = { stroke: color, strokeWidth, fill, fillStyle, roughness, seed };
    let node: SVGGElement;
    switch (shape.kind) {
      case "rectangle":
        node = rc.rectangle(shape.x, shape.y, shape.w, shape.h, options);
        break;
      case "circle":
        node = rc.circle(shape.cx, shape.cy, shape.d, options);
        break;
      case "ellipse":
        node = rc.ellipse(shape.cx, shape.cy, shape.w, shape.h, options);
        break;
      case "line":
        node = rc.line(shape.x1, shape.y1, shape.x2, shape.y2, options);
        break;
      case "arrow": {
        const line = rc.line(shape.x1, shape.y1, shape.x2, shape.y2, options);
        // add arrowhead
        const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
        const size = 18;
        const ax = shape.x2 - size * Math.cos(angle - Math.PI / 6);
        const ay = shape.y2 - size * Math.sin(angle - Math.PI / 6);
        const bx = shape.x2 - size * Math.cos(angle + Math.PI / 6);
        const by = shape.y2 - size * Math.sin(angle + Math.PI / 6);
        const head1 = rc.line(shape.x2, shape.y2, ax, ay, options);
        const head2 = rc.line(shape.x2, shape.y2, bx, by, options);
        const g = document.createElementNS(svgNs, "g");
        g.appendChild(line);
        g.appendChild(head1);
        g.appendChild(head2);
        node = g as SVGGElement;
        break;
      }
    }
    const pathEls = node.querySelectorAll("path");
    return Array.from(pathEls).map((p) => ({
      d: p.getAttribute("d") ?? "",
      stroke: p.getAttribute("stroke") ?? color,
      strokeWidth: p.getAttribute("stroke-width") ?? String(strokeWidth),
      fill: p.getAttribute("fill") ?? "none",
    }));
  }, [shape, color, strokeWidth, fill, fillStyle, roughness, seed]);

  const drawProgress =
    drawFrom !== undefined && drawTo !== undefined
      ? interpolate(frame, [drawFrom, drawTo], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  return (
    <svg
      data-focus-target={focusKey}
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {paths.map((p, i) => (
        <RoughPath key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill} progress={drawProgress} />
      ))}
    </svg>
  );
};

const RoughPath: React.FC<{
  readonly d: string;
  readonly stroke: string;
  readonly strokeWidth: string;
  readonly fill: string;
  readonly progress: number;
}> = ({ d, stroke, strokeWidth, fill, progress }) => {
  // For draw-on animation, use stroke-dasharray on the outline.
  // We approximate path length using getTotalLength() via a hidden ref-less trick.
  // Simpler: assume the path is up to ~3000px long; use a large dash.
  const APPROX_LEN = 3000;
  const dashOffset = fill === "none" ? APPROX_LEN * (1 - progress) : 0;
  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={fill === "none" ? APPROX_LEN : undefined}
      strokeDashoffset={dashOffset}
      opacity={fill !== "none" ? progress : 1}
    />
  );
};
