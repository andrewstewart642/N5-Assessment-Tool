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

export type PaperPart =
  | { kind: "text"; value: string }
  | { kind: "math"; latex: string; displayMode?: boolean }
  | StraightLineSystemGraphPart;
