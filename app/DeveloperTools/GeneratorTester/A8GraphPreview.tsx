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

  const renderLine = (points: Point[], key: string, dash?: string) => {
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
        strokeDasharray={dash}
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
        {renderLine(secondPoints, "second", "7 5")}
        <circle cx={sx(intersectionX)} cy={sy(intersectionY)} r="3.5" fill="#111111" />
        <text
          x={sx(intersectionX) + 9}
          y={sy(intersectionY) - 8}
          fontFamily="Trebuchet MS, Trebuchet, Arial, sans-serif"
          fontSize="15"
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
