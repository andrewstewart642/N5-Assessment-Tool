"use client";

import type {
  G1AxisSpec,
  G1BestFitVisualSpec,
  G1GeneratedVisualSpec,
  G1NumericPoint,
  G1Rational,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";

type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };
type ScreenPoint = { x: number; y: number };

const rationalNumber = (value: G1Rational) => value.numerator / value.denominator;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-8;
const formatTick = (value: number) => Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;
const mathFont = 'KaTeX_Math, KaTeX_Main, "Times New Roman", serif';

const lineBoundaryPoints = (gradient: G1Rational, intercept: G1Rational, bounds: Bounds): G1NumericPoint[] => {
  const m = rationalNumber(gradient);
  const c = rationalNumber(intercept);
  const points: G1NumericPoint[] = [];
  const add = (x: number, y: number) => {
    if (x < bounds.xMin - 1e-8 || x > bounds.xMax + 1e-8 || y < bounds.yMin - 1e-8 || y > bounds.yMax + 1e-8) return;
    if (points.some((point) => close(point.x, x) && close(point.y, y))) return;
    points.push({ x, y });
  };
  add(bounds.xMin, m * bounds.xMin + c);
  add(bounds.xMax, m * bounds.xMax + c);
  if (!close(m, 0)) {
    add((bounds.yMin - c) / m, bounds.yMin);
    add((bounds.yMax - c) / m, bounds.yMax);
  }
  return points.slice(0, 2);
};

const enumerateTicks = (minimum: number, maximum: number, interval: number) => {
  if (!Number.isFinite(interval) || interval <= 0) return [];
  const first = Math.ceil(minimum / interval) * interval;
  const values: number[] = [];
  for (let value = first; value <= maximum + 1e-8 && values.length < 40; value += interval) {
    values.push(Number(value.toFixed(6)));
  }
  return values;
};

const axisLabel = (axis: G1AxisSpec, direction: "x" | "y", compact = false) => {
  if (compact) return direction === "x" ? axis.xVariable : axis.yVariable;
  const label = direction === "x" ? axis.xLabel : axis.yLabel;
  const unit = direction === "x" ? axis.xUnit : axis.yUnit;
  return unit ? `${label} (${unit})` : label;
};

function GraphShell({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <div style={{ marginTop: 9 }}>
      <div style={{ overflow: "hidden", background: "#ffffff" }}>{children}</div>
      <div style={{ marginTop: 4, color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>{footer}</div>
    </div>
  );
}

const compressed = (value: number) => Math.sign(value) * Math.sqrt(Math.abs(value));

const paddedRange = (values: readonly number[], minimumSpan: number) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, minimumSpan);
  const pad = span * 0.22;
  return { min: min - pad, max: max + pad };
};

const extendScreenLine = (a: ScreenPoint, b: ScreenPoint, bounds: { left: number; right: number; top: number; bottom: number }) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const candidates: ScreenPoint[] = [];
  const add = (t: number) => {
    const x = a.x + ux * t;
    const y = a.y + uy * t;
    if (x >= bounds.left - 0.5 && x <= bounds.right + 0.5 && y >= bounds.top - 0.5 && y <= bounds.bottom + 0.5) candidates.push({ x, y });
  };
  if (Math.abs(ux) > 1e-8) {
    add((bounds.left - a.x) / ux);
    add((bounds.right - a.x) / ux);
  }
  if (Math.abs(uy) > 1e-8) {
    add((bounds.top - a.y) / uy);
    add((bounds.bottom - a.y) / uy);
  }
  if (candidates.length < 2) return [a, b] as const;
  let best: readonly [ScreenPoint, ScreenPoint] = [candidates[0], candidates[1]];
  let bestDistance = 0;
  for (let i = 0; i < candidates.length; i += 1) {
    for (let j = i + 1; j < candidates.length; j += 1) {
      const distance = Math.hypot(candidates[i].x - candidates[j].x, candidates[i].y - candidates[j].y);
      if (distance > bestDistance) {
        bestDistance = distance;
        best = [candidates[i], candidates[j]];
      }
    }
  }
  return best;
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
  const preferred = index % 2;
  const candidates = [normals[preferred], normals[1 - preferred]].map((normal) => {
    const distance = 14;
    const x = point.x + normal.x * distance;
    const y = point.y + normal.y * distance;
    const anchor: "start" | "end" = normal.x >= 0 ? "start" : "end";
    const approximateWidth = Math.min(118, 5.5 * labelLength);
    const leftEdge = anchor === "start" ? x : x - approximateWidth;
    const rightEdge = anchor === "start" ? x + approximateWidth : x;
    const inBounds = leftEdge > 4 && rightEdge < width - 4 && y > 13 && y < height - 5;
    return { x, y, anchor, inBounds };
  });
  return candidates.find((candidate) => candidate.inBounds) ?? candidates[0];
};

function SchematicGraph({ visual }: { visual: Extract<G1GeneratedVisualSpec, { kind: "G1_COORDINATE_DIAGRAM" | "G1_CONTEXT_LINE_GRAPH" }> }) {
  const coordinateMode = visual.kind === "G1_COORDINATE_DIAGRAM";
  const width = 430;
  const height = coordinateMode ? 178 : 190;
  const left = 52;
  const right = 39;
  const top = 20;
  const bottom = 37;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const points = visual.kind === "G1_COORDINATE_DIAGRAM" ? visual.points : visual.labelledPoints;

  // These historical-style diagrams are deliberately schematic rather than
  // scaled graphs. A signed square-root compression preserves quadrant/order
  // information while preventing large coordinates from creating dead space or
  // making the intercept readable by eye.
  const txValues = [0, ...points.map((point) => compressed(point.x))];
  const tyValues = [0, ...points.map((point) => compressed(point.y))];
  const xr = paddedRange(txValues, 2.4);
  const yr = paddedRange(tyValues, 2.4);
  const sx = (value: number) => left + ((compressed(value) - xr.min) / (xr.max - xr.min || 1)) * plotWidth;
  const sy = (value: number) => top + plotHeight - ((compressed(value) - yr.min) / (yr.max - yr.min || 1)) * plotHeight;
  const origin = { x: sx(0), y: sy(0) };
  const screenPoints = points.map((point) => ({ x: sx(point.x), y: sy(point.y) }));
  const lineEnds = extendScreenLine(screenPoints[0], screenPoints[1], { left, right: left + plotWidth, top, bottom: top + plotHeight });
  const axis = visual.axis;

  return (
    <GraphShell footer="Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Generated sparse straight-line schematic" style={{ display: "block", width: "100%", maxHeight: coordinateMode ? 220 : 235 }}>
        <defs>
          <marker id={`g1v2-arrow-x-${visual.kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
          <marker id={`g1v2-arrow-y-${visual.kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
        </defs>

        <line x1={left} y1={origin.y} x2={left + plotWidth + 7} y2={origin.y} stroke="#111111" strokeWidth="1.05" markerEnd={`url(#g1v2-arrow-x-${visual.kind})`} />
        <line x1={origin.x} y1={top + plotHeight} x2={origin.x} y2={top - 6} stroke="#111111" strokeWidth="1.05" markerEnd={`url(#g1v2-arrow-y-${visual.kind})`} />
        <text x={origin.x - 7} y={origin.y + 15} textAnchor="middle" fontSize="10.5" fontFamily={mathFont} fontStyle="italic" fill="#111111">O</text>
        <text x={left + plotWidth + 17} y={origin.y + 4} fontSize="12.5" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axisLabel(axis, "x", true)}</text>
        <text x={origin.x - 4} y={top - 9} textAnchor="end" fontSize="12.5" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axisLabel(axis, "y", true)}</text>

        <line x1={lineEnds[0].x} y1={lineEnds[0].y} x2={lineEnds[1].x} y2={lineEnds[1].y} stroke="#111111" strokeWidth="1.65" />

        {points.map((point, index) => {
          const screen = screenPoints[index];
          const label = coordinateMode ? `${point.label} (${formatTick(point.x)}, ${formatTick(point.y)})` : point.label;
          const placement = labelPlacement(screen, lineEnds[0], lineEnds[1], index, label.length, width, height);
          return (
            <g key={`${point.label}-${index}`}>
              <circle cx={screen.x} cy={screen.y} r="3.4" fill="#111111" />
              <text
                x={placement.x}
                y={placement.y}
                textAnchor={placement.anchor}
                dominantBaseline="middle"
                fontSize={coordinateMode ? "10.2" : "11.5"}
                fontFamily={coordinateMode ? mathFont : undefined}
                fontWeight={coordinateMode ? 400 : 600}
                fill="#111111"
              >{label}</text>
            </g>
          );
        })}
      </svg>
    </GraphShell>
  );
}

function BestFitGraph({ visual, showDeveloperOverlay }: { visual: G1BestFitVisualSpec; showDeveloperOverlay: boolean }) {
  const gridRead = visual.labelledLinePoints.length === 0;
  const width = 500;
  const height = gridRead ? 294 : 232;
  const left = gridRead ? 62 : 51;
  const right = 25;
  const top = 20;
  const bottom = gridRead ? 54 : 43;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const axis = visual.axis;
  const bounds: Bounds = { xMin: axis.xMinimum, xMax: axis.xMaximum, yMin: axis.yMinimum, yMax: axis.yMaximum };
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin || 1)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin || 1)) * plotHeight;
  const linePoints = lineBoundaryPoints(visual.line.gradient, visual.line.intercept, bounds);
  const xAxisY = sy(0);
  const yAxisX = sx(0);
  const xTicks = gridRead ? enumerateTicks(0, bounds.xMax, axis.xTickInterval) : [];
  const yTicks = gridRead ? enumerateTicks(0, bounds.yMax, axis.yTickInterval) : [];

  return (
    <GraphShell footer={`Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.${showDeveloperOverlay ? " Blue rings reveal the two intended line-reading points for developer inspection only." : ""}`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Generated line-of-best-fit diagnostic preview" style={{ display: "block", width: "100%", maxHeight: gridRead ? 370 : 295 }}>
        <defs>
          <marker id={`g1v2-bestfit-arrow-x-${gridRead ? "grid" : "label"}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
          <marker id={`g1v2-bestfit-arrow-y-${gridRead ? "grid" : "label"}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
        </defs>

        {gridRead ? xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={sx(tick)} y1={top} x2={sx(tick)} y2={top + plotHeight} stroke="#d1d5db" strokeWidth="0.75" />
            <text x={sx(tick)} y={top + plotHeight + 17} textAnchor="middle" fontSize="9.5" fill="#374151">{formatTick(tick)}</text>
          </g>
        )) : null}
        {gridRead ? yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={left} y1={sy(tick)} x2={left + plotWidth} y2={sy(tick)} stroke="#d1d5db" strokeWidth="0.75" />
            <text x={left - 8} y={sy(tick) + 3.5} textAnchor="end" fontSize="9.5" fill="#374151">{formatTick(tick)}</text>
          </g>
        )) : null}

        <line x1={left} y1={xAxisY} x2={left + plotWidth + 7} y2={xAxisY} stroke="#111111" strokeWidth="1.1" markerEnd={`url(#g1v2-bestfit-arrow-x-${gridRead ? "grid" : "label"})`} />
        <line x1={yAxisX} y1={top + plotHeight} x2={yAxisX} y2={top - 6} stroke="#111111" strokeWidth="1.1" markerEnd={`url(#g1v2-bestfit-arrow-y-${gridRead ? "grid" : "label"})`} />

        {visual.scatterPoints.map((point, index) => {
          const isReadable = visual.readableLinePoints.some((candidate) => close(candidate.x, point.x) && close(candidate.y, point.y));
          return <circle key={`scatter-${index}`} cx={sx(point.x)} cy={sy(point.y)} r={isReadable && gridRead ? 3.45 : 3} fill={isReadable && gridRead ? "#111111" : "#4b5563"} opacity={isReadable && gridRead ? 1 : 0.76} />;
        })}

        {linePoints.length === 2 ? <line x1={sx(linePoints[0].x)} y1={sy(linePoints[0].y)} x2={sx(linePoints[1].x)} y2={sy(linePoints[1].y)} stroke="#111111" strokeWidth="1.75" /> : null}

        {visual.labelledLinePoints.map((point, index) => {
          const screen = { x: sx(point.x), y: sy(point.y) };
          const a = linePoints.length === 2 ? { x: sx(linePoints[0].x), y: sy(linePoints[0].y) } : screen;
          const b = linePoints.length === 2 ? { x: sx(linePoints[1].x), y: sy(linePoints[1].y) } : { x: screen.x + 1, y: screen.y };
          const placement = labelPlacement(screen, a, b, index, point.label.length, width, height);
          return (
            <g key={`labelled-${point.label}-${index}`}>
              <circle cx={screen.x} cy={screen.y} r="3.6" fill="#111111" />
              <text x={placement.x} y={placement.y} textAnchor={placement.anchor} dominantBaseline="middle" fontSize="11.2" fontWeight="600" fill="#111111">{point.label}</text>
            </g>
          );
        })}

        {showDeveloperOverlay ? visual.readableLinePoints.map((point, index) => (
          <circle key={`overlay-${index}`} cx={sx(point.x)} cy={sy(point.y)} r="6.5" fill="none" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="3 2" />
        )) : null}

        <text x={left + plotWidth / 2} y={height - 12} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#111827">{axisLabel(axis, "x")}</text>
        <text x="16" y={top + plotHeight / 2} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#111827" transform={`rotate(-90 16 ${top + plotHeight / 2})`}>{axisLabel(axis, "y")}</text>
      </svg>
    </GraphShell>
  );
}

export default function G1GraphPreview({ visual, showDeveloperOverlay = false }: { visual: G1GeneratedVisualSpec; showDeveloperOverlay?: boolean }) {
  if (visual.kind === "G1_COORDINATE_DIAGRAM" || visual.kind === "G1_CONTEXT_LINE_GRAPH") return <SchematicGraph visual={visual} />;
  return <BestFitGraph visual={visual} showDeveloperOverlay={showDeveloperOverlay} />;
}
