"use client";

import type {
  G1AxisSpec,
  G1GeneratedVisualSpec,
  G1NumericPoint,
  G1Rational,
} from "../../Courses/National5Maths/04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";

type Bounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const rationalNumber = (value: G1Rational) => value.numerator / value.denominator;

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const lineBoundaryPoints = (
  gradient: G1Rational,
  intercept: G1Rational,
  bounds: Bounds,
): G1NumericPoint[] => {
  const m = rationalNumber(gradient);
  const c = rationalNumber(intercept);
  const points: G1NumericPoint[] = [];
  const add = (x: number, y: number) => {
    if (
      x < bounds.xMin - 1e-9
      || x > bounds.xMax + 1e-9
      || y < bounds.yMin - 1e-9
      || y > bounds.yMax + 1e-9
    ) return;
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
  for (let value = first; value <= maximum + 1e-9 && values.length < 160; value += interval) {
    values.push(Number(value.toFixed(10)));
  }
  return values;
};

const labelStride = (count: number) => Math.max(1, Math.ceil(count / 12));

const axisLabel = (axis: G1AxisSpec, direction: "x" | "y") => {
  const label = direction === "x" ? axis.xLabel : axis.yLabel;
  const unit = direction === "x" ? axis.xUnit : axis.yUnit;
  return unit ? `${label} (${unit})` : label;
};

export default function G1GraphPreview({
  visual,
  showDeveloperOverlay = false,
}: {
  visual: G1GeneratedVisualSpec;
  showDeveloperOverlay?: boolean;
}) {
  const width = 500;
  const height = 330;
  const left = 66;
  const right = 24;
  const top = 22;
  const bottom = 58;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const axis = visual.axis;
  const bounds: Bounds = {
    xMin: axis.xMinimum,
    xMax: axis.xMaximum,
    yMin: axis.yMinimum,
    yMax: axis.yMaximum,
  };
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin || 1)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin || 1)) * plotHeight;
  const xTicks = enumerateTicks(bounds.xMin, bounds.xMax, axis.xTickInterval);
  const yTicks = enumerateTicks(bounds.yMin, bounds.yMax, axis.yTickInterval);
  const xLabelEvery = labelStride(xTicks.length);
  const yLabelEvery = labelStride(yTicks.length);
  const linePoints = lineBoundaryPoints(visual.line.gradient, visual.line.intercept, bounds);
  const xAxisY = sy(Math.min(bounds.yMax, Math.max(bounds.yMin, 0)));
  const yAxisX = sx(Math.min(bounds.xMax, Math.max(bounds.xMin, 0)));

  const labelledPoints = visual.kind === "G1_COORDINATE_DIAGRAM"
    ? visual.points
    : visual.kind === "G1_CONTEXT_LINE_GRAPH"
      ? visual.labelledPoints
      : visual.labelledLinePoints;
  const scatterPoints = visual.kind === "G1_BEST_FIT_GRAPH" ? visual.scatterPoints : [];
  const overlayPoints = visual.kind === "G1_BEST_FIT_GRAPH" ? visual.readableLinePoints : [];

  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          overflow: "hidden",
          border: "1px solid #d1d5db",
          borderRadius: 7,
          background: "#ffffff",
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Generated G1 coordinate graph diagnostic preview"
          style={{ display: "block", width: "100%", height: "auto" }}
        >
          <rect x={left} y={top} width={plotWidth} height={plotHeight} fill="#ffffff" stroke="#d1d5db" strokeWidth="1" />

          {xTicks.map((tick, index) => (
            <g key={`x-${tick}`}>
              <line x1={sx(tick)} y1={top} x2={sx(tick)} y2={top + plotHeight} stroke="#e5e7eb" strokeWidth="0.8" />
              {index % xLabelEvery === 0 ? (
                <text x={sx(tick)} y={top + plotHeight + 18} textAnchor="middle" fontSize="10" fill="#374151">
                  {tick}
                </text>
              ) : null}
            </g>
          ))}

          {yTicks.map((tick, index) => (
            <g key={`y-${tick}`}>
              <line x1={left} y1={sy(tick)} x2={left + plotWidth} y2={sy(tick)} stroke="#e5e7eb" strokeWidth="0.8" />
              {index % yLabelEvery === 0 ? (
                <text x={left - 9} y={sy(tick) + 3.5} textAnchor="end" fontSize="10" fill="#374151">
                  {tick}
                </text>
              ) : null}
            </g>
          ))}

          <line x1={left} y1={xAxisY} x2={left + plotWidth} y2={xAxisY} stroke="#111827" strokeWidth="1.25" />
          <line x1={yAxisX} y1={top} x2={yAxisX} y2={top + plotHeight} stroke="#111827" strokeWidth="1.25" />

          {scatterPoints.map((point, index) => (
            <circle key={`scatter-${index}`} cx={sx(point.x)} cy={sy(point.y)} r="3" fill="#4b5563" opacity="0.82" />
          ))}

          {linePoints.length === 2 ? (
            <line
              x1={sx(linePoints[0].x)}
              y1={sy(linePoints[0].y)}
              x2={sx(linePoints[1].x)}
              y2={sy(linePoints[1].y)}
              stroke="#111111"
              strokeWidth="2"
            />
          ) : null}

          {labelledPoints.map((point, index) => (
            <g key={`labelled-${index}-${point.label}`}>
              <circle cx={sx(point.x)} cy={sy(point.y)} r="4" fill="#111111" />
              <text x={sx(point.x) + 8} y={sy(point.y) - 8} fontSize="13" fontWeight="700" fill="#111111">
                {point.label}
              </text>
            </g>
          ))}

          {showDeveloperOverlay ? overlayPoints.map((point, index) => (
            <g key={`overlay-${index}`}>
              <circle cx={sx(point.x)} cy={sy(point.y)} r="6" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x={sx(point.x) + 8} y={sy(point.y) + 14} fontSize="9" fill="#2563eb">
                exact ({point.x}, {point.y})
              </text>
            </g>
          )) : null}

          <text x={left + plotWidth / 2} y={height - 15} textAnchor="middle" fontSize="11" fontWeight="700" fill="#111827">
            {axisLabel(axis, "x")}
          </text>
          <text
            x="16"
            y={top + plotHeight / 2}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#111827"
            transform={`rotate(-90 16 ${top + plotHeight / 2})`}
          >
            {axisLabel(axis, "y")}
          </text>
        </svg>
      </div>
      <div style={{ marginTop: 4, color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>
        Developer-only diagnostic rendering of the generated visual specification. Production visual ownership remains in layer 06.
        {visual.kind === "G1_BEST_FIT_GRAPH" && showDeveloperOverlay
          ? " Blue dashed circles reveal the exact readable fitted-line points for inspection; they are not candidate-facing content."
          : ""}
      </div>
    </div>
  );
}
