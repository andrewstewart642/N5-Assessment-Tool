import type { PaperPart } from "@/shared-types/paperParts";

export type PromptStyleId = string;

export type PromptStyleParts = {
  id: PromptStyleId;
  templateParts: (expressionLatex: string) => PaperPart[];
};

export const PROMPT_STYLES_PARTS: Record<PromptStyleId, PromptStyleParts> = {
  A: {
    id: "A",
    templateParts: (exprLatex) => [
      { kind: "text", value: "Simplify " },
      { kind: "math", latex: exprLatex },
    ],
  },
  B: {
    id: "B",
    templateParts: (exprLatex) => [
      { kind: "text", value: "Express " },
      { kind: "math", latex: exprLatex },
      { kind: "text", value: " in its simplest form" },
    ],
  },
  C: {
    id: "C",
    templateParts: (exprLatex) => [
      { kind: "text", value: "Expand and simplify " },
      { kind: "math", latex: exprLatex },
    ],
  },
};