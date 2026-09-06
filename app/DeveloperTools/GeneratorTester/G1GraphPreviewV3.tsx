"use client";

import { useId } from "react";

import type {
  G1BestFitVisualSpec,
  G1GeneratedVisualSpec,
  G1NumericPoint,
  G1Rational,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";
import G1GraphPreviewV2 from "./G1GraphPreviewV2";

type ScreenPoint = { x: number; y: number };

const EPSILON = 1e-8;
const mathFont = 'KaTeX_Math, KaTeX_Main, "Times New Roman", serif';
const formatTick = (value: number) => Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;
const rationalValue = (value: G1Rational) => value.numerator / value.denominator;

const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
const rationalFromNumber = (value: number): G1Rational => {
  const denominator = 10000;
  const numerator = Math.round(value * denominator);
  const divisor = gcd(Math.abs(numerator), denominator) || 1;
  return { numerator: numerator / divisor, denominator: denominator / divisor };
};

const extendScreenLine = (
  a: ScreenPoint,
  b: ScreenPoint,
  bounds: { left: number; right: number; top: number; bottom: number },
): readonly [ScreenPoint, ScreenPoint] => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const candidates: ScreenPoint[] = [];
  const addAtX = (x: number) => {
    if (Math.abs(dx) < EPSILON) return;
    const t = (x - a.x) / dx;
    const y = a.y + t * dy;
    if (y >= bounds.top - 0.5 && y <= bounds.bottom + 0.5) candidates.push({ x, y });
  };
  const addAtY = (y: number) => {
    if (Math.abs(dy) < EPSILON) return;
    const t = (y - a.y) / dy;
    const x = a.x + t * dx;
    if (x >= bounds.left - 0.5 && x <= bounds.right + 0.5) candidates.push({ x, y });
  };
  addAtX(bounds.left);
  addAtX(bounds.right);
  addAtY(bounds.top);
  addAtY(bounds.bottom);
  const distinct = candidates.filter((point, index) => !candidates.slice(0, index).some((other) => Math.hypot(point.x - other.x, point.y - other.y) < 0.5));
  if (distinct.length < 2) return [a, b];
  let best: readonly [ScreenPoint, ScreenPoint] = [distinct[0], distinct[1]];
  let bestDistance = 0;
  for (let i = 0; i < distinct.length; i += 1) {
    for (let j = i + 1; j < distinct.length; j += 1) {
      const distance = Math.hypot(distinct[i].x - distinct[j].x, distinct[i].y - distinct[j].y);
      if (distance > bestDistance) {
        bestDistance = distance;
        best = [distinct[i], distinct[j]];
      }
    }
  }
  return best;
};

const lineYAtX = (a: ScreenPoint, b: ScreenPoint, x: number) => {
  const dx = b.x - a.x;
  if (Math.abs(dx) < EPSILON) return (a.y + b.y) / 2;
  const t = (x - a.x) / dx;
  return a.y + t * (b.y - a.y);
};

const labelPlacement = (
  point: ScreenPoint,
  lineA: ScreenPoint,
  lineB: ScreenPoint,
  index: number,
  labelLength: number,
  width: number,
  height: number,
) => {
  const dx = lineB.x - lineA.x;
  const dy = lineB.y - lineA.y;
  const length = Math.hypot(dx, dy) || 1;
  const normals = [
    { x: -dy / length, y: dx / length },
    { x: dy / length, y: -dx / length },
  ];
  const candidates = [normals[index % 2], normals[(index + 1) % 2]].map((normal) => {
    const distance = 14;
    const x = point.x + normal.x * distance;
    const y = point.y + normal.y * distance;
    const anchor: "start" | "end" = normal.x >= 0 ? "start" : "end";
    const approximateWidth = Math.min(125, 5.6 * labelLength);
    const leftEdge = anchor === "start" ? x : x - approximateWidth;
    const rightEdge = anchor === "start" ? x + approximateWidth : x;
    return {
      x,
      y,
      anchor,
      inBounds: leftEdge > 4 && rightEdge < width - 4 && y > 12 && y < height - 5,
    };
  });
  return candidates.find((candidate) => candidate.inBounds) ?? candidates[0];
};

const canonicalSchematicGeometry = (
  points: readonly [G1NumericPoint, G1NumericPoint],
  gradient: G1Rational,
  intercept: G1Rational,
  left: number,
  top: number,
  plotWidth: number,
  plotHeight: number,
) => {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const bothXPositive = xValues.every((value) => value > 0);
  const bothXNegative = xValues.every((value) => value < 0);
  const bothYPositive = yValues.every((value) => value > 0);
  const bothYNegative = yValues.every((value) => value < 0);
  const interceptNumber = rationalValue(intercept);
  const positiveIntercept = interceptNumber > EPSILON;
  const negativeIntercept = interceptNumber < -EPSILON;

  const originX = left + plotWidth * (bothXPositive ? 0.2 : bothXNegative ? 0.8 : 0.5);
  let originY = top + plotHeight * (
    bothYPositive
      ? negativeIntercept ? 0.62 : 0.79
      : bothYNegative
        ? positiveIntercept ? 0.38 : 0.21
        : 0.5
  );

  const xSlots: readonly [number, number] = bothXPositive
    ? [left + plotWidth * 0.43, left + plotWidth * 0.76]
    : bothXNegative
      ? [left + plotWidth * 0.24, left + plotWidth * 0.57]
      : [left + plotWidth * 0.23, left + plotWidth * 0.77];
  const xOrder = points[0].x <= points[1].x ? [0, 1] as const : [1, 0] as const;
  const screen: [ScreenPoint, ScreenPoint] = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  screen[xOrder[0]].x = xSlots[0];
  screen[xOrder[1]].x = xSlots[1];

  if (!bothYPositive && !bothYNegative) {
    for (let index = 0; index < 2; index += 1) {
      screen[index].y = points[index].y > 0
        ? top + plotHeight * 0.3
        : top + plotHeight * 0.7;
    }
  } else {
    const mid = top + plotHeight * (bothYPositive ? 0.42 : 0.58);
    const halfRise = Math.max(21, plotHeight * 0.145);
    const positiveGradient = gradient.numerator > 0;
    screen[xOrder[0]].y = positiveGradient ? mid + halfRise : mid - halfRise;
    screen[xOrder[1]].y = positiveGradient ? mid - halfRise : mid + halfRise;
  }

  // The sketch is intentionally not to scale, but it must never contradict the
  // generated equation. In particular, a non-zero intercept must cross the
  // y-axis visibly on the correct side of the x-axis and must not masquerade as
  // a line through O. We therefore translate the schematic line vertically while
  // keeping its direction, point ordering and compact slope unchanged.
  const currentInterceptY = lineYAtX(screen[0], screen[1], originX);
  const interceptClearance = Math.max(15, plotHeight * 0.13);
  const desiredInterceptY = positiveIntercept
    ? originY - interceptClearance
    : negativeIntercept
      ? originY + interceptClearance
      : originY;
  const lineShift = desiredInterceptY - currentInterceptY;
  screen[0].y += lineShift;
  screen[1].y += lineShift;

  // Keep the whole sketch comfortably inside the small plotting window. Shift
  // the axes and line together so the intercept relationship cannot be lost by
  // later framing adjustments.
  const safeTop = top + 7;
  const safeBottom = top + plotHeight - 7;
  const minY = Math.min(originY, screen[0].y, screen[1].y, desiredInterceptY);
  const maxY = Math.max(originY, screen[0].y, screen[1].y, desiredInterceptY);
  let frameShift = 0;
  if (minY < safeTop) frameShift += safeTop - minY;
  if (maxY + frameShift > safeBottom) frameShift += safeBottom - (maxY + frameShift);
  if (Math.abs(frameShift) > EPSILON) {
    originY += frameShift;
    screen[0].y += frameShift;
    screen[1].y += frameShift;
  }

  return { origin: { x: originX, y: originY }, screen };
};

function SchematicGraphV3({ visual }: { visual: Extract<G1GeneratedVisualSpec, { kind: "G1_COORDINATE_DIAGRAM" | "G1_CONTEXT_LINE_GRAPH" }> }) {
  const id = useId().replaceAll(":", "");
  const coordinateMode = visual.kind === "G1_COORDINATE_DIAGRAM";
  const width = 430;
  const height = coordinateMode ? 168 : 178;
  const left = 48;
  const right = 38;
  const top = 18;
  const bottom = 31;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const points = visual.kind === "G1_COORDINATE_DIAGRAM" ? visual.points : visual.labelledPoints;
  const { origin, screen } = canonicalSchematicGeometry(points, visual.line.gradient, visual.line.intercept, left, top, plotWidth, plotHeight);
  const lineEnds = extendScreenLine(screen[0], screen[1], { left, right: left + plotWidth, top, bottom: top + plotHeight });
  const axis = visual.axis;

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ overflow: "hidden", background: "#ffffff" }}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Generated compact straight-line schematic" style={{ display: "block", width: "100%", maxHeight: coordinateMode ? 205 : 215 }}>
          <defs>
            <marker id={`g1v3-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
            </marker>
          </defs>

          <line x1={left} y1={origin.y} x2={left + plotWidth + 6} y2={origin.y} stroke="#111111" strokeWidth="1.05" markerEnd={`url(#g1v3-arrow-${id})`} />
          <line x1={origin.x} y1={top + plotHeight} x2={origin.x} y2={top - 5} stroke="#111111" strokeWidth="1.05" markerEnd={`url(#g1v3-arrow-${id})`} />
          <text x={origin.x - 7} y={origin.y + 14} textAnchor="middle" fontSize="10.5" fontFamily={mathFont} fontStyle="italic" fill="#111111">O</text>
          <text x={left + plotWidth + 16} y={origin.y + 4} fontSize="12" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axis.xVariable}</text>
          <text x={origin.x - 4} y={top - 8} textAnchor="end" fontSize="12" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axis.yVariable}</text>

          <line x1={lineEnds[0].x} y1={lineEnds[0].y} x2={lineEnds[1].x} y2={lineEnds[1].y} stroke="#111111" strokeWidth="1.6" />

          {points.map((point, index) => {
            const label = coordinateMode ? `${point.label} (${formatTick(point.x)}, ${formatTick(point.y)})` : point.label;
            const placement = labelPlacement(screen[index], lineEnds[0], lineEnds[1], index, label.length, width, height);
            return (
              <g key={`${point.label}-${index}`}>
                <circle cx={screen[index].x} cy={screen[index].y} r="3.4" fill="#111111" />
                <text
                  x={placement.x}
                  y={placement.y}
                  textAnchor={placement.anchor}
                  dominantBaseline="middle"
                  fontSize={coordinateMode ? "10.2" : "11.2"}
                  fontFamily={coordinateMode ? mathFont : undefined}
                  fontWeight={coordinateMode ? 400 : 600}
                  fill="#111111"
                >{label}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ marginTop: 4, color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>
        Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.
      </div>
    </div>
  );
}

const normaliseLabelledBestFitVisual = (visual: G1BestFitVisualSpec): G1BestFitVisualSpec => {
  if (visual.labelledLinePoints.length === 0) return visual;
  const sourcePoints = [...visual.scatterPoints, ...visual.readableLinePoints, ...visual.labelledLinePoints];
  const xMin = Math.min(...sourcePoints.map((point) => point.x));
  const xMax = Math.max(...sourcePoints.map((point) => point.x));
  const yMin = Math.min(...sourcePoints.map((point) => point.y));
  const yMax = Math.max(...sourcePoints.map((point) => point.y));
  const xSpan = Math.max(xMax - xMin, 1);
  const ySpan = Math.max(yMax - yMin, 1);
  const mapPoint = (point: G1NumericPoint): G1NumericPoint => ({
    x: 1 + 8 * (point.x - xMin) / xSpan,
    y: 1 + 8 * (point.y - yMin) / ySpan,
  });
  const mappedRead = visual.readableLinePoints.map(mapPoint);
  const a = mappedRead[0] ?? mapPoint(visual.labelledLinePoints[0]);
  const b = mappedRead[1] ?? mapPoint(visual.labelledLinePoints[1]);
  const gradient = (b.y - a.y) / (b.x - a.x || 1);
  const intercept = a.y - gradient * a.x;

  return {
    ...visual,
    axis: {
      ...visual.axis,
      xMinimum: 0,
      xMaximum: 10,
      xTickInterval: 1,
      yMinimum: 0,
      yMaximum: 10,
      yTickInterval: 1,
    },
    line: {
      gradient: rationalFromNumber(gradient),
      intercept: rationalFromNumber(intercept),
    },
    scatterPoints: visual.scatterPoints.map(mapPoint),
    readableLinePoints: mappedRead,
    labelledLinePoints: visual.labelledLinePoints.map((point) => ({ ...mapPoint(point), label: point.label })),
    requirements: [
      ...visual.requirements,
      "Developer preview uses a schematic display transform for labelled-point best-fit surfaces so the scatter cloud occupies the available plotting area; the pupil-facing point values remain those stated in the prompt.",
    ],
  };
};

export default function G1GraphPreviewV3({ visual, showDeveloperOverlay = false }: { visual: G1GeneratedVisualSpec; showDeveloperOverlay?: boolean }) {
  if (visual.kind === "G1_COORDINATE_DIAGRAM" || visual.kind === "G1_CONTEXT_LINE_GRAPH") {
    return <SchematicGraphV3 visual={visual} />;
  }
  return <G1GraphPreviewV2 visual={normaliseLabelledBestFitVisual(visual)} showDeveloperOverlay={showDeveloperOverlay} />;
}
