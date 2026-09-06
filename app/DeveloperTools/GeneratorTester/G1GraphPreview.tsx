"use client";

import type {
  G1AxisSpec,
  G1BestFitVisualSpec,
  G1GeneratedVisualSpec,
  G1NumericPoint,
  G1Rational,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";

type Bounds = { xMin: number; xMax: number; yMin: number; yMax: number };

const rationalNumber = (value: G1Rational) => value.numerator / value.denominator;
const close = (a: number, b: number) => Math.abs(a - b) < 1e-8;

const lineBoundaryPoints = (
  gradient: G1Rational,
  intercept: G1Rational,
  bounds: Bounds,
): G1NumericPoint[] => {
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
  for (let value = first; value <= maximum + 1e-8 && values.length < 80; value += interval) {
    values.push(Number(value.toFixed(6)));
  }
  return values;
};

const uniqueSorted = (values: readonly number[]) =>
  [...new Set(values.map((value) => Number(value.toFixed(6))))].sort((a, b) => a - b);

const formatTick = (value: number) => Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(2))}`;

const axisLabel = (axis: G1AxisSpec, direction: "x" | "y", compact = false) => {
  if (compact) return direction === "x" ? axis.xVariable : axis.yVariable;
  const label = direction === "x" ? axis.xLabel : axis.yLabel;
  const unit = direction === "x" ? axis.xUnit : axis.yUnit;
  return unit ? `${label} (${unit})` : label;
};

const mathFont = 'KaTeX_Math, KaTeX_Main, "Times New Roman", serif';

function GraphShell({ children, footer }: { children: React.ReactNode; footer: string }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ overflow: "hidden", background: "#ffffff" }}>{children}</div>
      <div style={{ marginTop: 4, color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>{footer}</div>
    </div>
  );
}

function SchematicGraph({
  visual,
}: {
  visual: Extract<G1GeneratedVisualSpec, { kind: "G1_COORDINATE_DIAGRAM" | "G1_CONTEXT_LINE_GRAPH" }>;
}) {
  const coordinateMode = visual.kind === "G1_COORDINATE_DIAGRAM";
  const width = 430;
  const height = coordinateMode ? 190 : 205;
  const left = 45;
  const right = 34;
  const top = 20;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const axis = visual.axis;
  const bounds: Bounds = { xMin: axis.xMinimum, xMax: axis.xMaximum, yMin: axis.yMinimum, yMax: axis.yMaximum };
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin || 1)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin || 1)) * plotHeight;
  const xAxisY = sy(Math.min(bounds.yMax, Math.max(bounds.yMin, 0)));
  const yAxisX = sx(Math.min(bounds.xMax, Math.max(bounds.xMin, 0)));
  const linePoints = lineBoundaryPoints(visual.line.gradient, visual.line.intercept, bounds);
  const points = visual.kind === "G1_COORDINATE_DIAGRAM" ? visual.points : visual.labelledPoints;
  const slope = rationalNumber(visual.line.gradient);

  return (
    <GraphShell footer="Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Generated sparse straight-line diagram" style={{ display: "block", width: "100%", maxHeight: coordinateMode ? 240 : 260 }}>
        <defs>
          <marker id={`g1-arrow-x-${visual.kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
          <marker id={`g1-arrow-y-${visual.kind}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
        </defs>

        <line x1={left} y1={xAxisY} x2={left + plotWidth + 8} y2={xAxisY} stroke="#111111" strokeWidth="1.15" markerEnd={`url(#g1-arrow-x-${visual.kind})`} />
        <line x1={yAxisX} y1={top + plotHeight} x2={yAxisX} y2={top - 7} stroke="#111111" strokeWidth="1.15" markerEnd={`url(#g1-arrow-y-${visual.kind})`} />

        <text x={yAxisX - 8} y={xAxisY + 16} textAnchor="middle" fontSize="11" fontFamily={mathFont} fontStyle="italic" fill="#111111">O</text>
        <text x={left + plotWidth + 18} y={xAxisY + 4} fontSize="13" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axisLabel(axis, "x", true)}</text>
        <text x={yAxisX - 4} y={top - 10} textAnchor="end" fontSize="13" fontFamily={mathFont} fontStyle="italic" fill="#111111">{axisLabel(axis, "y", true)}</text>

        {linePoints.length === 2 ? (
          <line x1={sx(linePoints[0].x)} y1={sy(linePoints[0].y)} x2={sx(linePoints[1].x)} y2={sy(linePoints[1].y)} stroke="#111111" strokeWidth="1.7" />
        ) : null}

        {points.map((point, index) => {
          const leftSide = index === 0;
          const above = slope < 0 ? leftSide : !leftSide;
          const dx = leftSide ? -8 : 8;
          const dy = above ? -9 : 15;
          const label = coordinateMode ? `${point.label} (${formatTick(point.x)}, ${formatTick(point.y)})` : point.label;
          return (
            <g key={`${point.label}-${index}`}>
              <circle cx={sx(point.x)} cy={sy(point.y)} r="3.6" fill="#111111" />
              <text
                x={sx(point.x) + dx}
                y={sy(point.y) + dy}
                textAnchor={leftSide ? "end" : "start"}
                fontSize={coordinateMode ? "10.5" : "12"}
                fontFamily={coordinateMode ? mathFont : undefined}
                fontWeight={coordinateMode ? 400 : 600}
                fill="#111111"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </GraphShell>
  );
}

function BestFitGraph({
  visual,
  showDeveloperOverlay,
}: {
  visual: G1BestFitVisualSpec;
  showDeveloperOverlay: boolean;
}) {
  const gridRead = visual.labelledLinePoints.length === 0;
  const width = 500;
  const height = gridRead ? 310 : 245;
  const left = gridRead ? 62 : 48;
  const right = 25;
  const top = 20;
  const bottom = gridRead ? 55 : 42;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const axis = visual.axis;
  const bounds: Bounds = { xMin: axis.xMinimum, xMax: axis.xMaximum, yMin: axis.yMinimum, yMax: axis.yMaximum };
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin || 1)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin || 1)) * plotHeight;
  const linePoints = lineBoundaryPoints(visual.line.gradient, visual.line.intercept, bounds);
  const xAxisY = sy(Math.min(bounds.yMax, Math.max(bounds.yMin, 0)));
  const yAxisX = sx(Math.min(bounds.xMax, Math.max(bounds.xMin, 0)));

  const baseXTicks = gridRead ? enumerateTicks(bounds.xMin, bounds.xMax, axis.xTickInterval) : [];
  const baseYTicks = gridRead ? enumerateTicks(bounds.yMin, bounds.yMax, axis.yTickInterval) : [];
  // Essential graph-read points are explicitly folded into the grid. This keeps
  // the grid sparse while guaranteeing that the two intended points lie on
  // visible intersections even when the automatic major interval is coarser.
  const xTicks = gridRead ? uniqueSorted([...baseXTicks, ...visual.readableLinePoints.map((point) => point.x)]) : [];
  const yTicks = gridRead ? uniqueSorted([...baseYTicks, ...visual.readableLinePoints.map((point) => point.y)]) : [];

  return (
    <GraphShell footer={`Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.${showDeveloperOverlay ? " Blue rings reveal the two exact fitted-line points for developer inspection only." : ""}`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Generated best-fit graph diagnostic preview" style={{ display: "block", width: "100%", maxHeight: gridRead ? 390 : 310 }}>
        <defs>
          <marker id={`g1-bestfit-arrow-x-${gridRead ? "grid" : "label"}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
          <marker id={`g1-bestfit-arrow-y-${gridRead ? "grid" : "label"}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#111111" />
          </marker>
        </defs>

        {gridRead ? xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={sx(tick)} y1={top} x2={sx(tick)} y2={top + plotHeight} stroke="#d1d5db" strokeWidth="0.7" />
            <text x={sx(tick)} y={top + plotHeight + 17} textAnchor="middle" fontSize="9.5" fill="#374151">{formatTick(tick)}</text>
          </g>
        )) : null}
        {gridRead ? yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={left} y1={sy(tick)} x2={left + plotWidth} y2={sy(tick)} stroke="#d1d5db" strokeWidth="0.7" />
            <text x={left - 8} y={sy(tick) + 3.5} textAnchor="end" fontSize="9.5" fill="#374151">{formatTick(tick)}</text>
          </g>
        )) : null}

        <line x1={left} y1={xAxisY} x2={left + plotWidth + 7} y2={xAxisY} stroke="#111111" strokeWidth="1.15" markerEnd={`url(#g1-bestfit-arrow-x-${gridRead ? "grid" : "label"})`} />
        <line x1={yAxisX} y1={top + plotHeight} x2={yAxisX} y2={top - 6} stroke="#111111" strokeWidth="1.15" markerEnd={`url(#g1-bestfit-arrow-y-${gridRead ? "grid" : "label"})`} />

        {visual.scatterPoints.map((point, index) => {
          const isReadable = visual.readableLinePoints.some((candidate) => close(candidate.x, point.x) && close(candidate.y, point.y));
          return <circle key={`scatter-${index}`} cx={sx(point.x)} cy={sy(point.y)} r={isReadable && gridRead ? 3.5 : 3} fill={isReadable && gridRead ? "#111111" : "#4b5563"} opacity={isReadable && gridRead ? 1 : 0.78} />;
        })}

        {linePoints.length === 2 ? (
          <line x1={sx(linePoints[0].x)} y1={sy(linePoints[0].y)} x2={sx(linePoints[1].x)} y2={sy(linePoints[1].y)} stroke="#111111" strokeWidth="1.8" />
        ) : null}

        {visual.labelledLinePoints.map((point, index) => (
          <g key={`labelled-${point.label}-${index}`}>
            <circle cx={sx(point.x)} cy={sy(point.y)} r="3.7" fill="#111111" />
            <text x={sx(point.x) + 8} y={sy(point.y) - 7} fontSize="11.5" fontWeight="600" fill="#111111">{point.label}</text>
          </g>
        ))}

        {showDeveloperOverlay ? visual.readableLinePoints.map((point, index) => (
          <circle key={`overlay-${index}`} cx={sx(point.x)} cy={sy(point.y)} r="6.5" fill="none" stroke="#2563eb" strokeWidth="1.4" strokeDasharray="3 2" />
        )) : null}

        <text x={left + plotWidth / 2} y={height - 13} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#111827">{axisLabel(axis, "x")}</text>
        <text x="16" y={top + plotHeight / 2} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#111827" transform={`rotate(-90 16 ${top + plotHeight / 2})`}>{axisLabel(axis, "y")}</text>
      </svg>
    </GraphShell>
  );
}

export default function G1GraphPreview({
  visual,
  showDeveloperOverlay = false,
}: {
  visual: G1GeneratedVisualSpec;
  showDeveloperOverlay?: boolean;
}) {
  if (visual.kind === "G1_COORDINATE_DIAGRAM" || visual.kind === "G1_CONTEXT_LINE_GRAPH") {
    return <SchematicGraph visual={visual} />;
  }
  return <BestFitGraph visual={visual} showDeveloperOverlay={showDeveloperOverlay} />;
}
