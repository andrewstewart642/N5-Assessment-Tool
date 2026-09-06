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

export type StraightLineModelGraphPoint = {
  x: number;
  y: number;
  label?: string;
};

export type StraightLineModelGraphAxis = {
  xVariable: string;
  yVariable: string;
  xLabel: string;
  yLabel: string;
  xUnit: string | null;
  yUnit: string | null;
  xMinimum: number;
  xMaximum: number;
  xTickInterval: number;
  yMinimum: number;
  yMaximum: number;
  yTickInterval: number;
};

/**
 * Course generators translate their reviewed visual specification into this
 * generic paper contract before the document layer renders it. The renderer is
 * deliberately presentation-only: it receives the line, points and axis truth
 * and never manufactures assessment mathematics.
 */
export type StraightLineModelGraphPart = {
  kind: "straightLineModelGraph";
  mode:
    | "SCHEMATIC_COORDINATES"
    | "SCHEMATIC_CONTEXT"
    | "SCATTER_LABELLED"
    | "SCATTER_GRID";
  axis: StraightLineModelGraphAxis;
  line: {
    gradient: number;
    intercept: number;
  };
  modelPoints: StraightLineModelGraphPoint[];
  scatterPoints: StraightLineModelGraphPoint[];
  readableLinePoints: StraightLineModelGraphPoint[];
};

export type PaperPart =
  | { kind: "text"; value: string }
  | { kind: "math"; latex: string; displayMode?: boolean }
  | StraightLineSystemGraphPart
  | StraightLineModelGraphPart
  | AreaEqualityDiagramPart;
