import type {
  StraightLineModelGraphPart,
  StraightLineModelGraphPoint,
} from "@/app/Assessments/Questions/Content/PaperParts";

type ScreenPoint = {
  x: number;
  y: number;
};

type Bounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const EPSILON = 1e-8;
const mathFont = 'KaTeX_Math, KaTeX_Main, "Times New Roman", serif';

const formatNumber = (value: number) =>
  Number.isInteger(value)
    ? `${value}`
    : `${Number(value.toFixed(2))}`;

const axisTitle = (
  label: string,
  unit: string | null
) => unit ? `${label} (${unit})` : label;

const extendScreenLine = (
  a: ScreenPoint,
  b: ScreenPoint,
  bounds: Bounds
): readonly [ScreenPoint, ScreenPoint] => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const candidates: ScreenPoint[] = [];

  const addAtX = (x: number) => {
    if (Math.abs(dx) < EPSILON) return;
    const t = (x - a.x) / dx;
    const y = a.y + t * dy;
    if (y >= bounds.top - 0.5 && y <= bounds.bottom + 0.5) {
      candidates.push({ x, y });
    }
  };

  const addAtY = (y: number) => {
    if (Math.abs(dy) < EPSILON) return;
    const t = (y - a.y) / dy;
    const x = a.x + t * dx;
    if (x >= bounds.left - 0.5 && x <= bounds.right + 0.5) {
      candidates.push({ x, y });
    }
  };

  addAtX(bounds.left);
  addAtX(bounds.right);
  addAtY(bounds.top);
  addAtY(bounds.bottom);

  const distinct = candidates.filter(
    (point, index) =>
      !candidates
        .slice(0, index)
        .some((other) => Math.hypot(point.x - other.x, point.y - other.y) < 0.5)
  );

  if (distinct.length < 2) return [a, b];

  let best: readonly [ScreenPoint, ScreenPoint] = [distinct[0], distinct[1]];
  let bestDistance = 0;

  for (let first = 0; first < distinct.length; first += 1) {
    for (let second = first + 1; second < distinct.length; second += 1) {
      const distance = Math.hypot(
        distinct[first].x - distinct[second].x,
        distinct[first].y - distinct[second].y
      );
      if (distance > bestDistance) {
        bestDistance = distance;
        best = [distinct[first], distinct[second]];
      }
    }
  }

  return best;
};

const lineYAtX = (
  first: ScreenPoint,
  second: ScreenPoint,
  x: number
) => {
  const dx = second.x - first.x;
  if (Math.abs(dx) < EPSILON) return (first.y + second.y) / 2;
  const ratio = (x - first.x) / dx;
  return first.y + ratio * (second.y - first.y);
};

const schematicGeometry = (
  points: readonly [StraightLineModelGraphPoint, StraightLineModelGraphPoint],
  gradient: number,
  intercept: number,
  left: number,
  top: number,
  plotWidth: number,
  plotHeight: number
) => {
  const xValues = points.map((point) => point.x);
  const yValues = points.map((point) => point.y);
  const bothXPositive = xValues.every((value) => value > 0);
  const bothXNegative = xValues.every((value) => value < 0);
  const bothYPositive = yValues.every((value) => value > 0);
  const bothYNegative = yValues.every((value) => value < 0);
  const positiveIntercept = intercept > EPSILON;
  const negativeIntercept = intercept < -EPSILON;

  const originX = left + plotWidth * (
    bothXPositive ? 0.2 : bothXNegative ? 0.8 : 0.5
  );

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

  const order = points[0].x <= points[1].x
    ? [0, 1] as const
    : [1, 0] as const;

  const screen: [ScreenPoint, ScreenPoint] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  screen[order[0]].x = xSlots[0];
  screen[order[1]].x = xSlots[1];

  if (!bothYPositive && !bothYNegative) {
    for (let index = 0; index < 2; index += 1) {
      screen[index].y = points[index].y > 0
        ? top + plotHeight * 0.3
        : top + plotHeight * 0.7;
    }
  } else {
    const mid = top + plotHeight * (bothYPositive ? 0.42 : 0.58);
    const halfRise = Math.max(21, plotHeight * 0.145);
    const positiveGradient = gradient > 0;
    screen[order[0]].y = positiveGradient ? mid + halfRise : mid - halfRise;
    screen[order[1]].y = positiveGradient ? mid - halfRise : mid + halfRise;
  }

  const currentInterceptY = lineYAtX(screen[0], screen[1], originX);
  const clearance = Math.max(15, plotHeight * 0.13);
  const desiredInterceptY = positiveIntercept
    ? originY - clearance
    : negativeIntercept
      ? originY + clearance
      : originY;
  const lineShift = desiredInterceptY - currentInterceptY;
  screen[0].y += lineShift;
  screen[1].y += lineShift;

  const safeTop = top + 7;
  const safeBottom = top + plotHeight - 7;
  const minY = Math.min(originY, screen[0].y, screen[1].y, desiredInterceptY);
  const maxY = Math.max(originY, screen[0].y, screen[1].y, desiredInterceptY);
  let frameShift = 0;

  if (minY < safeTop) frameShift += safeTop - minY;
  if (maxY + frameShift > safeBottom) {
    frameShift += safeBottom - (maxY + frameShift);
  }

  if (Math.abs(frameShift) > EPSILON) {
    originY += frameShift;
    screen[0].y += frameShift;
    screen[1].y += frameShift;
  }

  return {
    origin: { x: originX, y: originY },
    screen,
  };
};

const pointLabelPlacement = (
  point: ScreenPoint,
  lineA: ScreenPoint,
  lineB: ScreenPoint,
  index: number,
  labelLength: number,
  width: number,
  height: number
) => {
  const dx = lineB.x - lineA.x;
  const dy = lineB.y - lineA.y;
  const length = Math.hypot(dx, dy) || 1;
  const normals = [
    { x: -dy / length, y: dx / length },
    { x: dy / length, y: -dx / length },
  ];

  const candidates = [
    normals[index % 2],
    normals[(index + 1) % 2],
  ].map((normal) => {
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
      inBounds:
        leftEdge > 4 &&
        rightEdge < width - 4 &&
        y > 12 &&
        y < height - 5,
    };
  });

  return candidates.find((candidate) => candidate.inBounds) ?? candidates[0];
};

function SchematicModelGraph({
  graph,
}: {
  graph: StraightLineModelGraphPart;
}) {
  if (graph.modelPoints.length < 2) return null;

  const coordinateMode = graph.mode === "SCHEMATIC_COORDINATES";
  const width = 430;
  const height = coordinateMode ? 168 : 178;
  const left = 48;
  const right = 38;
  const top = 18;
  const bottom = 31;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const points = [graph.modelPoints[0], graph.modelPoints[1]] as const;
  const geometry = schematicGeometry(
    points,
    graph.line.gradient,
    graph.line.intercept,
    left,
    top,
    plotWidth,
    plotHeight
  );
  const lineEnds = extendScreenLine(
    geometry.screen[0],
    geometry.screen[1],
    {
      left,
      right: left + plotWidth,
      top,
      bottom: top + plotHeight,
    }
  );

  return (
    <div style={{ margin: "10px 0 12px 18px", width: "min(430px, calc(100% - 18px))" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Straight-line sketch with two labelled points"
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          <marker id="straight-line-model-schematic-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#111111" />
          </marker>
        </defs>

        <line
          x1={left}
          y1={geometry.origin.y}
          x2={left + plotWidth + 6}
          y2={geometry.origin.y}
          stroke="#111111"
          strokeWidth="1.05"
          markerEnd="url(#straight-line-model-schematic-arrow)"
        />
        <line
          x1={geometry.origin.x}
          y1={top + plotHeight}
          x2={geometry.origin.x}
          y2={top - 5}
          stroke="#111111"
          strokeWidth="1.05"
          markerEnd="url(#straight-line-model-schematic-arrow)"
        />
        <text x={geometry.origin.x - 7} y={geometry.origin.y + 14} textAnchor="middle" fontSize="10.5" fontFamily={mathFont} fontStyle="italic">O</text>
        <text x={left + plotWidth + 16} y={geometry.origin.y + 4} fontSize="12" fontFamily={mathFont} fontStyle="italic">{graph.axis.xVariable}</text>
        <text x={geometry.origin.x - 4} y={top - 8} textAnchor="end" fontSize="12" fontFamily={mathFont} fontStyle="italic">{graph.axis.yVariable}</text>

        <line
          x1={lineEnds[0].x}
          y1={lineEnds[0].y}
          x2={lineEnds[1].x}
          y2={lineEnds[1].y}
          stroke="#111111"
          strokeWidth="1.6"
        />

        {points.map((point, index) => {
          const label = coordinateMode
            ? `${point.label ?? (index === 0 ? "A" : "B")} (${formatNumber(point.x)}, ${formatNumber(point.y)})`
            : point.label ?? (index === 0 ? "A" : "B");
          const placement = pointLabelPlacement(
            geometry.screen[index],
            lineEnds[0],
            lineEnds[1],
            index,
            label.length,
            width,
            height
          );

          return (
            <g key={`${label}-${index}`}>
              <circle cx={geometry.screen[index].x} cy={geometry.screen[index].y} r="3.4" fill="#111111" />
              <text
                x={placement.x}
                y={placement.y}
                textAnchor={placement.anchor}
                dominantBaseline="middle"
                fontSize={coordinateMode ? "10.2" : "11.2"}
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
    </div>
  );
}

const lineBoundaryPoints = (
  gradient: number,
  intercept: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): StraightLineModelGraphPoint[] => {
  const points: StraightLineModelGraphPoint[] = [];
  const add = (x: number, y: number) => {
    if (
      x < xMin - EPSILON ||
      x > xMax + EPSILON ||
      y < yMin - EPSILON ||
      y > yMax + EPSILON ||
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) return;
    if (points.some((point) => Math.hypot(point.x - x, point.y - y) < EPSILON)) return;
    points.push({ x, y });
  };

  add(xMin, gradient * xMin + intercept);
  add(xMax, gradient * xMax + intercept);
  if (Math.abs(gradient) > EPSILON) {
    add((yMin - intercept) / gradient, yMin);
    add((yMax - intercept) / gradient, yMax);
  }
  return points.slice(0, 2);
};

const ticks = (minimum: number, maximum: number, interval: number) => {
  if (!Number.isFinite(interval) || interval <= 0) return [];
  const first = Math.ceil(minimum / interval) * interval;
  const result: number[] = [];
  for (let value = first; value <= maximum + EPSILON && result.length < 22; value += interval) {
    result.push(Number(value.toFixed(6)));
  }
  return result;
};

function ScatterModelGraph({
  graph,
}: {
  graph: StraightLineModelGraphPart;
}) {
  const grid = graph.mode === "SCATTER_GRID";
  const width = 500;
  const height = grid ? 294 : 236;
  const left = grid ? 62 : 56;
  const right = 25;
  const top = 20;
  const bottom = grid ? 54 : 48;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  let xMinimum = graph.axis.xMinimum;
  let xMaximum = graph.axis.xMaximum;
  let yMinimum = graph.axis.yMinimum;
  let yMaximum = graph.axis.yMaximum;
  let gradient = graph.line.gradient;
  let intercept = graph.line.intercept;
  let scatter = graph.scatterPoints;
  let model = graph.modelPoints;
  let readable = graph.readableLinePoints;

  if (!grid) {
    const source = [...scatter, ...model, ...readable];
    const xMin = Math.min(...source.map((point) => point.x));
    const xMax = Math.max(...source.map((point) => point.x));
    const yMin = Math.min(...source.map((point) => point.y));
    const yMax = Math.max(...source.map((point) => point.y));
    const xSpan = Math.max(xMax - xMin, 1);
    const ySpan = Math.max(yMax - yMin, 1);
    const mapPoint = (point: StraightLineModelGraphPoint): StraightLineModelGraphPoint => ({
      ...point,
      x: 1 + 8 * (point.x - xMin) / xSpan,
      y: 1 + 8 * (point.y - yMin) / ySpan,
    });
    scatter = scatter.map(mapPoint);
    model = model.map(mapPoint);
    readable = readable.map(mapPoint);
    const first = readable[0] ?? model[0];
    const second = readable[1] ?? model[1];
    if (first && second && Math.abs(second.x - first.x) > EPSILON) {
      gradient = (second.y - first.y) / (second.x - first.x);
      intercept = first.y - gradient * first.x;
    }
    xMinimum = 0;
    xMaximum = 10;
    yMinimum = 0;
    yMaximum = 10;
  }

  const sx = (x: number) => left + ((x - xMinimum) / (xMaximum - xMinimum || 1)) * plotWidth;
  const sy = (y: number) => top + plotHeight - ((y - yMinimum) / (yMaximum - yMinimum || 1)) * plotHeight;
  const linePoints = lineBoundaryPoints(gradient, intercept, xMinimum, xMaximum, yMinimum, yMaximum);
  const xTicks = grid ? ticks(xMinimum, xMaximum, graph.axis.xTickInterval) : [];
  const yTicks = grid ? ticks(yMinimum, yMaximum, graph.axis.yTickInterval) : [];

  return (
    <div style={{ margin: "12px 0 14px 18px", width: "min(500px, calc(100% - 18px))" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Scatter graph with a line of best fit"
        style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
      >
        <defs>
          <marker id="straight-line-model-scatter-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#111111" />
          </marker>
        </defs>

        {xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={sx(tick)} y1={top} x2={sx(tick)} y2={top + plotHeight} stroke="#d1d5db" strokeWidth="0.75" />
            <text x={sx(tick)} y={top + plotHeight + 17} textAnchor="middle" fontSize="9.5" fill="#374151">{formatNumber(tick)}</text>
          </g>
        ))}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={left} y1={sy(tick)} x2={left + plotWidth} y2={sy(tick)} stroke="#d1d5db" strokeWidth="0.75" />
            <text x={left - 8} y={sy(tick) + 3.5} textAnchor="end" fontSize="9.5" fill="#374151">{formatNumber(tick)}</text>
          </g>
        ))}

        <line x1={left} y1={top + plotHeight} x2={left + plotWidth + 6} y2={top + plotHeight} stroke="#111111" strokeWidth="1.05" markerEnd="url(#straight-line-model-scatter-arrow)" />
        <line x1={left} y1={top + plotHeight} x2={left} y2={top - 6} stroke="#111111" strokeWidth="1.05" markerEnd="url(#straight-line-model-scatter-arrow)" />

        {linePoints.length >= 2 ? (
          <line
            x1={sx(linePoints[0].x)}
            y1={sy(linePoints[0].y)}
            x2={sx(linePoints[1].x)}
            y2={sy(linePoints[1].y)}
            stroke="#111111"
            strokeWidth="1.65"
          />
        ) : null}

        {scatter.map((point, index) => (
          <circle key={`scatter-${index}`} cx={sx(point.x)} cy={sy(point.y)} r="2.6" fill="#737b87" />
        ))}

        {(grid ? readable : model).map((point, index) => (
          <g key={`model-${index}`}>
            <circle cx={sx(point.x)} cy={sy(point.y)} r="3.4" fill="#111111" />
            {!grid && point.label ? (
              <text
                x={sx(point.x) + (index % 2 === 0 ? 7 : -7)}
                y={sy(point.y) + (index % 2 === 0 ? 15 : -9)}
                textAnchor={index % 2 === 0 ? "start" : "end"}
                fontSize="11"
                fontWeight="600"
                fill="#111111"
              >
                {point.label}
              </text>
            ) : null}
          </g>
        ))}

        <text
          x={left + plotWidth / 2}
          y={height - 9}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#111111"
        >
          {axisTitle(graph.axis.xLabel, graph.axis.xUnit)}
        </text>
        <text
          x="14"
          y={top + plotHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${top + plotHeight / 2})`}
          fontSize="11"
          fontWeight="600"
          fill="#111111"
        >
          {axisTitle(graph.axis.yLabel, graph.axis.yUnit)}
        </text>
      </svg>
    </div>
  );
}

export default function StraightLineModelGraph({
  graph,
}: {
  graph: StraightLineModelGraphPart;
}) {
  if (
    graph.mode === "SCHEMATIC_COORDINATES" ||
    graph.mode === "SCHEMATIC_CONTEXT"
  ) {
    return <SchematicModelGraph graph={graph} />;
  }

  return <ScatterModelGraph graph={graph} />;
}
