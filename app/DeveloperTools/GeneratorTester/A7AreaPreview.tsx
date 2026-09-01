"use client";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import type {
  A7AreaVisualSpec,
  A7ContextAreaState,
  A7LinearDimension,
} from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";

type A7AreaPreviewProps = {
  visual: A7AreaVisualSpec;
  state: A7ContextAreaState;
};

const VIEWBOX_WIDTH = 760;
const VIEWBOX_HEIGHT = 350;
const SHAPE_BOTTOM = 286;

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
  return (
    <div
      style={{
        position: "absolute",
        left: `${(x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(y / VIEWBOX_HEIGHT) * 100}%`,
        transform: centred ? "translate(-50%, -50%)" : "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: "17px",
        lineHeight: 1,
        color: "currentColor",
        pointerEvents: "none",
      }}
    >
      <PaperContent parts={mathParts(latex)} />
    </div>
  );
}

export default function A7AreaPreview({ visual, state }: A7AreaPreviewProps) {
  const resolved = resolvedDimensions(state);

  // Use one common scale for both shapes. Because the generated areas are equal
  // at the intended solution, this makes the drawing a useful qualitative
  // sense-check without pretending that the diagram is an exact construction.
  const largestHorizontal = Math.max(resolved.triangle.base, resolved.rectangle.width);
  const largestVertical = Math.max(resolved.triangle.height, resolved.rectangle.height);
  const scale = Math.min(23, 170 / largestHorizontal, 220 / largestVertical);

  const triangleWidth = resolved.triangle.base * scale;
  const triangleHeight = resolved.triangle.height * scale;
  const rectangleWidth = resolved.rectangle.width * scale;
  const rectangleHeight = resolved.rectangle.height * scale;

  const triangleCentreX = 195;
  const triangleLeft = triangleCentreX - triangleWidth / 2;
  const triangleRight = triangleCentreX + triangleWidth / 2;
  const triangleTop = SHAPE_BOTTOM - triangleHeight;
  const triangleArrowX = triangleRight + 28;

  const rectangleCentreX = 535;
  const rectangleLeft = rectangleCentreX - rectangleWidth / 2;
  const rectangleTop = SHAPE_BOTTOM - rectangleHeight;
  const rectangleRight = rectangleCentreX + rectangleWidth / 2;
  const rectangleArrowX = rectangleRight + 28;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 650,
        aspectRatio: `${VIEWBOX_WIDTH} / ${VIEWBOX_HEIGHT}`,
        margin: "6px auto 12px",
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
          {/* Always isosceles: the apex stays directly above the midpoint. */}
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
        x={triangleArrowX + 16}
        y={(triangleTop + SHAPE_BOTTOM) / 2}
        centred={false}
      />
      <MathLabel latex={visual.rectangle.widthLatex} x={rectangleCentreX} y={SHAPE_BOTTOM + 24} />
      <MathLabel
        latex={visual.rectangle.heightLatex}
        x={rectangleArrowX + 16}
        y={(rectangleTop + SHAPE_BOTTOM) / 2}
        centred={false}
      />
    </div>
  );
}
