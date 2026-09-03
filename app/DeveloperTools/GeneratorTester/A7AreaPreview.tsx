"use client";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import type {
  A7AreaVisualSpec,
  A7ContextAreaState,
  A7LinearDimension,
} from "../../Courses/National5Maths/04_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";

type A7AreaPreviewProps = {
  visual: A7AreaVisualSpec;
  state?: A7ContextAreaState;
};

const VIEWBOX_WIDTH = 760;
const VIEWBOX_HEIGHT = 300;
const SHAPE_BOTTOM = 235;

// Each shape gets its own SQA-like drawing slot. We preserve the resolved aspect
// ratio of each shape, but do not force both shapes to use the same pixel scale:
// official exam diagrams are qualitative, and an extreme aspect ratio should not
// make the other shape collapse into a postage stamp.
const TRIANGLE_MAX_WIDTH = 220;
const TRIANGLE_MAX_HEIGHT = 190;
const RECTANGLE_MAX_WIDTH = 185;
const RECTANGLE_MAX_HEIGHT = 165;
const SCALE_CAP = 32;
const ARROW_CLEARANCE = 26;
const LABEL_CLEARANCE = 18;

const LEGACY_PREVIEW_DIMENSIONS = {
  triangle: {
    base: 8,
    height: 6,
  },
  rectangle: {
    width: 7,
    height: 4,
  },
};

const mathParts = (latex: string): PaperPart[] => [
  { kind: "math", latex, displayMode: false },
];

const dimensionAt = (dimension: A7LinearDimension, x: number) =>
  dimension.xCoefficient * x + dimension.constant;

const resolvedDimensions = (state: A7ContextAreaState) => {
  const triangleLinear = dimensionAt(state.triangle.linearDimension, state.solution);
  const rectangleLinear = dimensionAt(state.rectangle.linearDimension, state.solution);

  return {
    triangle: {
      base: state.triangle.algebraicDimension === "BASE" ? triangleLinear : state.triangle.fixedDimension,
      height: state.triangle.algebraicDimension === "HEIGHT" ? triangleLinear : state.triangle.fixedDimension,
    },
    rectangle: {
      width: state.rectangle.algebraicDimension === "BASE" ? rectangleLinear : state.rectangle.fixedDimension,
      height: state.rectangle.algebraicDimension === "HEIGHT" ? rectangleLinear : state.rectangle.fixedDimension,
    },
  };
};

const fitScale = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) => Math.min(SCALE_CAP, maxWidth / width, maxHeight / height);

type MathLabelAnchor = "CENTRE" | "LEFT";

function MathLabel({
  latex,
  x,
  y,
  anchor = "CENTRE",
  protectClearance = false,
}: {
  latex: string;
  x: number;
  y: number;
  anchor?: MathLabelAnchor;
  protectClearance?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${(x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(y / VIEWBOX_HEIGHT) * 100}%`,
        transform: anchor === "CENTRE" ? "translate(-50%, -50%)" : "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: "17px",
        lineHeight: 1,
        color: "currentColor",
        pointerEvents: "none",
        background: protectClearance ? "#ffffff" : undefined,
        padding: protectClearance ? "2px 4px" : undefined,
        zIndex: protectClearance ? 2 : 1,
      }}
    >
      <PaperContent parts={mathParts(latex)} />
    </div>
  );
}

export default function A7AreaPreview({ visual, state }: A7AreaPreviewProps) {
  const resolved = state
    ? resolvedDimensions(state)
    : LEGACY_PREVIEW_DIMENSIONS;

  const triangleScale = fitScale(
    resolved.triangle.base,
    resolved.triangle.height,
    TRIANGLE_MAX_WIDTH,
    TRIANGLE_MAX_HEIGHT,
  );
  const rectangleScale = fitScale(
    resolved.rectangle.width,
    resolved.rectangle.height,
    RECTANGLE_MAX_WIDTH,
    RECTANGLE_MAX_HEIGHT,
  );

  const triangleWidth = resolved.triangle.base * triangleScale;
  const triangleHeight = resolved.triangle.height * triangleScale;
  const rectangleWidth = resolved.rectangle.width * rectangleScale;
  const rectangleHeight = resolved.rectangle.height * rectangleScale;

  const triangleCentreX = 180;
  const triangleLeft = triangleCentreX - triangleWidth / 2;
  const triangleRight = triangleCentreX + triangleWidth / 2;
  const triangleTop = SHAPE_BOTTOM - triangleHeight;
  const triangleArrowX = triangleRight + ARROW_CLEARANCE;
  const triangleHeightLabelX = triangleArrowX + LABEL_CLEARANCE;

  const rectangleCentreX = 525;
  const rectangleLeft = rectangleCentreX - rectangleWidth / 2;
  const rectangleTop = SHAPE_BOTTOM - rectangleHeight;
  const rectangleRight = rectangleCentreX + rectangleWidth / 2;
  const rectangleArrowX = rectangleRight + ARROW_CLEARANCE;
  const rectangleHeightLabelX = rectangleArrowX + LABEL_CLEARANCE;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}`,
        margin: "0 auto 4px",
        color: "#111111",
      }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Isosceles triangle and rectangle shown in proportions consistent with the generated dimensions"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <marker id="a7-dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fill="none" stroke="currentColor" strokeWidth="1.65">
          <path d={`M${triangleLeft} ${SHAPE_BOTTOM} L${triangleRight} ${SHAPE_BOTTOM} L${triangleCentreX} ${triangleTop} Z`} />
          <rect x={rectangleLeft} y={rectangleTop} width={rectangleWidth} height={rectangleHeight} />

          <line
            x1={triangleArrowX}
            y1={triangleTop + 3}
            x2={triangleArrowX}
            y2={SHAPE_BOTTOM - 3}
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
          <line
            x1={rectangleArrowX}
            y1={rectangleTop + 3}
            x2={rectangleArrowX}
            y2={SHAPE_BOTTOM - 3}
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
        </g>
      </svg>

      <MathLabel latex={visual.triangle.baseLatex} x={triangleCentreX} y={SHAPE_BOTTOM + 24} />
      <MathLabel
        latex={visual.triangle.heightLatex}
        x={triangleHeightLabelX}
        y={(triangleTop + SHAPE_BOTTOM) / 2}
        anchor="LEFT"
        protectClearance
      />
      <MathLabel latex={visual.rectangle.widthLatex} x={rectangleCentreX} y={SHAPE_BOTTOM + 24} />
      <MathLabel
        latex={visual.rectangle.heightLatex}
        x={rectangleHeightLabelX}
        y={(rectangleTop + SHAPE_BOTTOM) / 2}
        anchor="LEFT"
        protectClearance
      />
    </div>
  );
}
