"use client";

import katex from "katex";

import type {
  AreaEqualityDiagramPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

const VIEWBOX_WIDTH = 760;
const VIEWBOX_HEIGHT = 300;
const SHAPE_BOTTOM = 232;

const TRIANGLE_MAX_WIDTH = 220;
const TRIANGLE_MAX_HEIGHT = 188;
const RECTANGLE_MAX_WIDTH = 190;
const RECTANGLE_MAX_HEIGHT = 165;
const SCALE_CAP = 34;

const fitScale = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) => Math.min(
  SCALE_CAP,
  maxWidth / Math.max(width, 0.01),
  maxHeight / Math.max(height, 0.01),
);

function MathLabel({
  latex,
  x,
  y,
  centred = true,
}: {
  latex: string;
  x: number;
  y: number;
  centred?: boolean;
}) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: false,
  });

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: `${(x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(y / VIEWBOX_HEIGHT) * 100}%`,
        transform: centred ? "translate(-50%, -50%)" : "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: 16,
        lineHeight: 1,
        color: "#111111",
        background: "rgba(255,255,255,0.96)",
        padding: centred ? "0 2px" : "0 3px 0 5px",
        pointerEvents: "none",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function AreaEqualityDiagram({
  diagram,
}: {
  diagram: AreaEqualityDiagramPart;
}) {
  const triangleScale = fitScale(
    diagram.triangle.resolvedBase,
    diagram.triangle.resolvedHeight,
    TRIANGLE_MAX_WIDTH,
    TRIANGLE_MAX_HEIGHT,
  );
  const rectangleScale = fitScale(
    diagram.rectangle.resolvedWidth,
    diagram.rectangle.resolvedHeight,
    RECTANGLE_MAX_WIDTH,
    RECTANGLE_MAX_HEIGHT,
  );

  const triangleWidth = diagram.triangle.resolvedBase * triangleScale;
  const triangleHeight = diagram.triangle.resolvedHeight * triangleScale;
  const rectangleWidth = diagram.rectangle.resolvedWidth * rectangleScale;
  const rectangleHeight = diagram.rectangle.resolvedHeight * rectangleScale;

  const triangleCentreX = 180;
  const triangleLeft = triangleCentreX - triangleWidth / 2;
  const triangleRight = triangleCentreX + triangleWidth / 2;
  const triangleTop = SHAPE_BOTTOM - triangleHeight;
  const triangleArrowX = triangleRight + 25;
  const triangleHeightLabelX = triangleArrowX + 18;

  const rectangleCentreX = 520;
  const rectangleLeft = rectangleCentreX - rectangleWidth / 2;
  const rectangleRight = rectangleCentreX + rectangleWidth / 2;
  const rectangleTop = SHAPE_BOTTOM - rectangleHeight;
  const rectangleArrowX = rectangleRight + 25;
  const rectangleHeightLabelX = Math.min(
    VIEWBOX_WIDTH - 105,
    rectangleArrowX + 18,
  );

  return (
    <span
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        maxWidth: 720,
        aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}`,
        margin: "8px auto 5px",
        color: "#111111",
      }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Isosceles triangle and rectangle with labelled dimensions"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <defs>
          <marker
            id="area-equality-dimension-arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fill="none" stroke="currentColor" strokeWidth="1.65">
          <path
            d={`M${triangleLeft} ${SHAPE_BOTTOM} L${triangleRight} ${SHAPE_BOTTOM} L${triangleCentreX} ${triangleTop} Z`}
          />
          <rect
            x={rectangleLeft}
            y={rectangleTop}
            width={rectangleWidth}
            height={rectangleHeight}
          />

          <line
            x1={triangleArrowX}
            y1={triangleTop + 3}
            x2={triangleArrowX}
            y2={SHAPE_BOTTOM - 3}
            markerStart="url(#area-equality-dimension-arrow)"
            markerEnd="url(#area-equality-dimension-arrow)"
          />
          <line
            x1={rectangleArrowX}
            y1={rectangleTop + 3}
            x2={rectangleArrowX}
            y2={SHAPE_BOTTOM - 3}
            markerStart="url(#area-equality-dimension-arrow)"
            markerEnd="url(#area-equality-dimension-arrow)"
          />
        </g>
      </svg>

      <MathLabel
        latex={diagram.triangle.baseLatex}
        x={triangleCentreX}
        y={SHAPE_BOTTOM + 23}
      />
      <MathLabel
        latex={diagram.triangle.heightLatex}
        x={triangleHeightLabelX}
        y={(triangleTop + SHAPE_BOTTOM) / 2}
        centred={false}
      />
      <MathLabel
        latex={diagram.rectangle.widthLatex}
        x={rectangleCentreX}
        y={SHAPE_BOTTOM + 23}
      />
      <MathLabel
        latex={diagram.rectangle.heightLatex}
        x={rectangleHeightLabelX}
        y={(rectangleTop + SHAPE_BOTTOM) / 2}
        centred={false}
      />
    </span>
  );
}
