import type {
  StraightLineModelGraphPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import type {
  G1GeneratedVisualSpec,
  G1Rational,
} from "../../../04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/Types";

const value = (rational: G1Rational) =>
  rational.numerator / rational.denominator;

/**
 * Translate the canonical G1 visual specification into the shared paper visual
 * contract. Layer 06 owns this production construction seam; the document
 * renderer only consumes the resulting geometry and never invents mathematics.
 */
export const buildG1StraightLineModelGraphPart = (
  visual: G1GeneratedVisualSpec
): StraightLineModelGraphPart => {
  if (visual.kind === "G1_COORDINATE_DIAGRAM") {
    return {
      kind: "straightLineModelGraph",
      mode: "SCHEMATIC_COORDINATES",
      axis: { ...visual.axis },
      line: {
        gradient: value(visual.line.gradient),
        intercept: value(visual.line.intercept),
      },
      modelPoints: visual.points.map((point) => ({ ...point })),
      scatterPoints: [],
      readableLinePoints: visual.points.map((point) => ({ ...point })),
    };
  }

  if (visual.kind === "G1_CONTEXT_LINE_GRAPH") {
    return {
      kind: "straightLineModelGraph",
      mode: "SCHEMATIC_CONTEXT",
      axis: { ...visual.axis },
      line: {
        gradient: value(visual.line.gradient),
        intercept: value(visual.line.intercept),
      },
      modelPoints: visual.labelledPoints.map((point) => ({ ...point })),
      scatterPoints: [],
      readableLinePoints: visual.labelledPoints.map((point) => ({ ...point })),
    };
  }

  return {
    kind: "straightLineModelGraph",
    mode: visual.labelledLinePoints.length > 0
      ? "SCATTER_LABELLED"
      : "SCATTER_GRID",
    axis: { ...visual.axis },
    line: {
      gradient: value(visual.line.gradient),
      intercept: value(visual.line.intercept),
    },
    modelPoints: visual.labelledLinePoints.map((point) => ({ ...point })),
    scatterPoints: visual.scatterPoints.map((point) => ({ ...point })),
    readableLinePoints: visual.readableLinePoints.map((point) => ({ ...point })),
  };
};
