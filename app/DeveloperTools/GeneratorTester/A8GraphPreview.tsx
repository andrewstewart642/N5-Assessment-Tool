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
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

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

const distance = (first: Point, second: Point) =>
  Math.hypot(first.x - second.x, first.y - second.y);

const distanceFromLine = (point: Point, first: Point, second: Point) => {
  const dx = second.x - first.x;
  const dy = second.y - first.y;
  const denominator = Math.hypot(dx, dy);
  if (denominator < 1e-9) return Number.POSITIVE_INFINITY;
  return Math.abs(dy * point.x - dx * point.y + second.x * first.y - second.y * first.x) / denominator;
};

const formatNumber = (value: number) =>
  Number.isInteger(value)
    ? `${value}`
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

const formatEquation = (
  equation: A8LinearEquation,
  variables: [string, string],
) => {
  const terms: string[] = [];
  const append = (coefficient: number, variable: string) => {
    if (close(coefficient, 0)) return;
    const magnitude = Math.abs(coefficient);
    const term = `${close(magnitude, 1) ? "" : formatNumber(magnitude)}${variable}`;
    if (!terms.length) {
      terms.push(coefficient < 0 ? `−${term}` : term);
      return;
    }
    terms.push(`${coefficient < 0 ? "−" : "+"} ${term}`);
  };

  append(equation.a, variables[0]);
  append(equation.b, variables[1]);
  return `${terms.join(" ")} = ${formatNumber(equation.c)}`;
};

const choosePointLabelOffset = (
  intersection: Point,
  firstLine: Point[],
  secondLine: Point[],
  width: number,
  height: number,
): Point => {
  const candidates: Point[] = [
    { x: 16, y: -16 },
    { x: 18, y: 18 },
    { x: -18, y: -16 },
    { x: -20, y: 19 },
    { x: 2, y: -24 },
    { x: 2, y: 27 },
    { x: 27, y: 2 },
    { x: -27, y: 2 },
  ];

  return candidates
    .map((offset) => {
      const labelPoint = { x: intersection.x + offset.x, y: intersection.y + offset.y };
      const inFrame = labelPoint.x > 12 && labelPoint.x < width - 12 && labelPoint.y > 16 && labelPoint.y < height - 12;
      const lineDistances = [firstLine, secondLine]
        .filter((line) => line.length >= 2)
        .map((line) => distanceFromLine(labelPoint, line[0], line[1]));
      const clearance = lineDistances.length ? Math.min(...lineDistances) : 999;
      return { offset, score: clearance + (inFrame ? 20 : -40) };
    })
    .sort((first, second) => second.score - first.score)[0].offset;
};

const lineLabelPoint = (
  points: Point[],
  intersection: Point,
  side: 1 | -1,
  width: number,
  height: number,
): Point | null => {
  if (points.length < 2) return null;
  const endpoint = distance(points[0], intersection) >= distance(points[1], intersection)
    ? points[0]
    : points[1];
  const dx = endpoint.x - intersection.x;
  const dy = endpoint.y - intersection.y;
  const length = Math.hypot(dx, dy) || 1;
  const px = -dy / length;
  const py = dx / length;
  const along = 0.72;
  const offset = 14 * side;

  return {
    x: clamp(intersection.x + dx * along + px * offset, 55, width - 55),
    y: clamp(intersection.y + dy * along + py * offset, 18, height - 18),
  };
};

export default function A8GraphPreview({ visual }: { visual: A8GraphVisualSpec }) {
  const [intersectionX, intersectionY] = visual.intersection;
  const bounds: Bounds = {
    xMin: 0,
    yMin: 0,
    xMax: Math.max(7, Math.ceil(intersectionX + 3)),
    yMax: Math.max(8, Math.ceil(intersectionY + 3)),
  };
  const width = 430;
  const height = 290;
  const left = 48;
  const right = 24;
  const top = 20;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const sx = (x: number) => left + ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * plotHeight;
  const firstPoints = lineBoundaryPoints(visual.firstEquation, bounds);
  const secondPoints = lineBoundaryPoints(visual.secondEquation, bounds);
  const firstScreenPoints = firstPoints.map((point) => ({ x: sx(point.x), y: sy(point.y) }));
  const secondScreenPoints = secondPoints.map((point) => ({ x: sx(point.x), y: sy(point.y) }));
  const intersectionScreen = { x: sx(intersectionX), y: sy(intersectionY) };
  const pOffset = choosePointLabelOffset(intersectionScreen, firstScreenPoints, secondScreenPoints, width, height);
  const firstLabel = lineLabelPoint(firstScreenPoints, intersectionScreen, 1, width, height);
  const secondLabel = lineLabelPoint(secondScreenPoints, intersectionScreen, -1, width, height);

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
        strokeWidth="2"
      />
    );
  };

  const renderEquationLabel = (point: Point | null, equation: A8LinearEquation, key: string) => {
    if (!point) return null;
    return (
      <text
        key={key}
        x={point.x}
        y={point.y}
        textAnchor="middle"
        fontFamily="Times New Roman, Times, serif"
        fontSize="14"
        fill="#111111"
        stroke="#ffffff"
        strokeWidth="4"
        paintOrder="stroke"
      >
        {formatEquation(equation, [visual.xVariable, visual.yVariable])}
      </text>
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
          strokeWidth="1.4"
          markerEnd="url(#a8-axis-arrow)"
        />
        <line
          x1={sx(0)}
          y1={sy(bounds.yMin)}
          x2={sx(0)}
          y2={sy(bounds.yMax)}
          stroke="#111111"
          strokeWidth="1.4"
          markerEnd="url(#a8-axis-arrow)"
        />
        {renderLine(firstPoints, "first")}
        {renderLine(secondPoints, "second")}
        {renderEquationLabel(firstLabel, visual.firstEquation, "first-label")}
        {renderEquationLabel(secondLabel, visual.secondEquation, "second-label")}
        <circle cx={intersectionScreen.x} cy={intersectionScreen.y} r="3.5" fill="#111111" />
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
          y={sy(0) + 25}
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
          x={sx(0) - 12}
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
