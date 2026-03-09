export type PaperPart =
  | { kind: "text"; value: string }
  | { kind: "math"; latex: string; displayMode?: boolean };