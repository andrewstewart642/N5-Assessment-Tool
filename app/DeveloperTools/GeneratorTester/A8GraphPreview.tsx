"use client";

import type { A8GraphVisualSpec, A8LinearEquation } from "../../Courses/National5Maths/03_QuestionGeneration/A8_SimultaneousEquations";

type Point = { x: number; y: number };

type Bounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;

const lineBoundaryPoints = (equation: A8LinearEquation, bounds: Bounds): Point[] => {
  const points: Point[] = [];
  const add = (x: number, y: number) => {
    if (
      x < bounds.xMin - 1e-9 ||
      x > bounds.xMax + 1e-9 ||
      y < bounds.yMin - 1e-9 ||
      y > bounds.yMax + 1e-9
    ) return;
    if (points.some((point) => close(point.x, x) && close(point.y, y))) return;
    points.push({ x, y });
  };

  if (!close(equation.b, 0)) {
    add(bounds.xMin, (equation.c - equation.a * bounds.xMin) / equation.b);
    add(bounds.xMax, (equation.c - equation.a * bounds.xMax) / equation.b);
  }
  if (!close(equation.a, 0)) {
    add((equation.c - equation.b * bounds.yMin) / equation.a, bounds.yMin);
    add((equation.c - equation.b * bounds.yMax) / equation.a, bounds.yMax);
  }

  return points.slice(0, 2);
};

const distanceFromLine = (point: Point, first: Point, second: Point) => {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const denominator = Math.hypot(dx, dy);
  if (denominator < 1e-9) return Number.POSITIVE_INFINITY;
  return Math.abs(dy * point.x - dx * point.y + second.x * first.y - second.y * first.x) / denominator;
};

const intercepts = (equation: A8LinearEquation) => ({
  x: close(equation.a, 0) ? null : equation.c / equation.a,
  y: close(equation.b, 0) ? null : equation.c / equation.b,
});

const equationDerivedBounds = (
  visual: A8GraphVisualSpec,
  plotWidth: number,
  plotHeight: number,
): Bounds => {
  const [intersectionX, intersectionY] = visual.intersection;
  const firstIntercepts = intercepts(visual.firstEquation);
  const secondIntercepts = intercepts(visual.secondEquation);
  const xCandidates = [
    0,
    intersectionX,
    firstIntercepts.x,
    secondIntercepts.x,
  ].filter((value): value is number => value !== null && Number.isFinite(value));
  const yCandidates = [
    0,
    intersectionY,
    firstIntercepts.y,
    secondIntercepts.y,
  ].filter((value): value is number => value !== null && Number.isFinite(value));

  let xMin = Math.min(-1.5, intersectionX - 2, ...xCandidates);
  let xMax = Math.max(7, intersectionX + 3, ...xCandidates);
  let yMin = Math.min(-2, intersectionY - 3, ...yCandidates);
  let yMax = Math.max(7, intersectionY + 3, ...yCandidates);

  let xRange = Math.max(1, xMax - xMin);
  let yRange = Math.max(1, yMax - yMin);
  const xMargin = Math.max(0.8, xRange * 0.06);
  const yMargin = Math.max(0.8, yRange * 0.08);
  xMin -= xMargin;
  xMax += xMargin;
  yMin -= yMargin;
  yMax += yMargin;

  xRange = xMax - xMin;
  yRange = yMax - yMin;
  const targetAspect = plotWidth / plotHeight;
  const currentAspect = xRange / yRange;

  // Keep one unit horizontally the same visual size as one unit vertically.
  // If one dimension needs expanding, favour positive x and negative y so the
  // axes sit naturally inside the diagram rather than at the bottom-left edge.
  if (currentAspect < targetAspect) {
    const extra = yRange * targetAspect - xRange;
    xMin -= extra * 0.2;
    xMax += extra * 0.8;
  } else if (currentAspect > targetAspect) {
    const extra = xRange / targetAspect - yRange;
    yMin -= extra * 0.58;
    yMax += extra * 0.42;
  }

  return { xMin, xMax, yMin, yMax };
};

const choosePointLabelOffset = (
  intersection: Point,
  firstLine: Point[],
  secondLine: Point[],
  width: number,
  height: number,
): Point => {
  const candidates: Point[] = [
    { x: 18, y: -18 },
    { x: 20, y: 21 },
    { x: -20, y: -18 },
    { x: -22, y: 21 },
    { x: 3, y: -29 },
    { x: 3, y: 31 },
    { x: 31, y: 3 },
    { x: -31, y: 3 },
  ];

  return candidates
    .map((offset) => {
      const labelPoint = { x: intersection.x + offset.x, y: intersection.y + offset.y };
      const inFrame = labelPoint.x > 14 && labelPoint.x < width - 14 && labelPoint.y > 18 && labelPoint.y < height - 14;
      const lineDistances = [firstLine, secondLine]
        .filter((line) => line.length >= 2)
        .map((line) => distanceFromLine(labelPoint, line[0], line[1]));
      const clearance = lineDistances.length ? Math.min(...lineDistances) : 999;
      return { offset, score: clearance + (inFrame ? 28 : -60) };
    })
    .sort((first, second) => second.score - first.score)[0].offset;
};

export default function A8GraphPreview({ visual }: { visual: A8GraphVisualSpec }) {
  const [intersectionX, intersectionY] = visual.intersection;
  const width = 430;
  const height = 290;
  const left = 48;
  const right = 24;
  const top = 20;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const bounds = equationDerivedBounds(visual, plotWidth, plotHeight);
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * plotHeight;
  const firstPoints = lineBoundaryPoints(visual.firstEquation, bounds);
  const secondPoints = lineBoundaryPoints(visual.secondEquation, bounds);
  const firstScreenPoints = firstPoints.map((point) => ({ x: sx(point.x), y: sy(point.y) }));
  const secondScreenPoints = secondPoints.map((point) => ({ x: sx(point.x), y: sy(point.y) }));
  const intersectionScreen = { x: sx(intersectionX), y: sy(intersectionY) };
  const pOffset = choosePointLabelOffset(intersectionScreen, firstScreenPoints, secondScreenPoints, width, height);

  const renderLine = (points: Point[], key: string) => {
    if (points.length < 2) return null;
    return (
      <line
        key={key}
        x1={sx(points[0].x)}
        y1={sy(points[0].y)}
        x2={sx(points[1].x)}
        y2={sy(points[1].y)}
        stroke="#111111"
        strokeWidth="1.8"
      />
    );
  };

  return (
    <div style={{ margin: "12px 0 14px 30px", width: "min(430px, calc(100% - 30px))" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Two straight lines intersecting at point P"
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          <marker id="a8-axis-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#111111" />
          </marker>
        </defs>
        <line
          x1={sx(bounds.xMin)}
          y1={sy(0)}
          x2={sx(bounds.xMax)}
          y2={sy(0)}
          stroke="#111111"
          strokeWidth="1.3"
          markerEnd="url(#a8-axis-arrow)"
        />
        <line
          x1={sx(0)}
          y1={sy(bounds.yMin)}
          x2={sx(0)}
          y2={sy(bounds.yMax)}
          stroke="#111111"
          strokeWidth="1.3"
          markerEnd="url(#a8-axis-arrow)"
        />
        {renderLine(firstPoints, "first")}
        {renderLine(secondPoints, "second")}
        <circle cx={intersectionScreen.x} cy={intersectionScreen.y} r="3.4" fill="#111111" />
        <text
          x={intersectionScreen.x + pOffset.x}
          y={intersectionScreen.y + pOffset.y}
          textAnchor={pOffset.x < 0 ? "end" : "start"}
          fontFamily="Times New Roman, Times, serif"
          fontStyle="italic"
          fontSize="16"
          fill="#111111"
        >
          {visual.labelledIntersection}
        </text>
        <text
          x={sx(bounds.xMax) - 2}
          y={sy(0) + 24}
          textAnchor="end"
          fontFamily="Times New Roman, Times, serif"
          fontStyle="italic"
          fontSize="17"
          fill="#111111"
        >
          {visual.xVariable}
        </text>
        <text
          x={sx(0) - 17}
          y={sy(bounds.yMax) + 7}
          textAnchor="middle"
          fontFamily="Times New Roman, Times, serif"
          fontStyle="italic"
          fontSize="17"
          fill="#111111"
        >
          {visual.yVariable}
        </text>
        <text
          x={sx(0) - 11}
          y={sy(0) + 18}
          fontFamily="Trebuchet MS, Trebuchet, Arial, sans-serif"
          fontSize="12"
          fill="#111111"
        >
          O
        </text>
      </svg>
    </div>
  );
}
