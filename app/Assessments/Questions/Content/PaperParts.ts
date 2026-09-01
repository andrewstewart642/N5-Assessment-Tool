export type LinearEquationGraphData = {
  a: number;
  b: number;
  c: number;
};

export type StraightLineSystemGraphData = {
  xVariable: string;
  yVariable: string;
  firstEquation: LinearEquationGraphData;
  secondEquation: LinearEquationGraphData;
  intersection: [number, number];
  labelledIntersection: string;
};

export type StraightLineSystemGraphPart =
  StraightLineSystemGraphData & {
    kind: "straightLineSystemGraph";
  };

/**
 * Generic equal-area diagram payload used by assessment questions.
 *
 * The labels describe the generated question; the resolved dimensions are
 * teacher/pupil sense-check values used only to keep the drawing qualitatively
 * consistent with the mathematics. The diagram is intentionally not declared
 * to be exactly to scale.
 */
export type AreaEqualityDiagramPart = {
  kind: "areaEqualityDiagram";
  triangle: {
    baseLatex: string;
    heightLatex: string;
    resolvedBase: number;
    resolvedHeight: number;
  };
  rectangle: {
    widthLatex: string;
    heightLatex: string;
    resolvedWidth: number;
    resolvedHeight: number;
  };
};

export type PaperPart =
  | { kind: "text"; value: string }
  | { kind: "math"; latex: string; displayMode?: boolean }
  | StraightLineSystemGraphPart
  | AreaEqualityDiagramPart;
