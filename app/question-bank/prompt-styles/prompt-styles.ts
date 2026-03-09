export type PromptStyleId = string;

export type PromptStyle = {
  id: PromptStyleId;
  template: (expression: string) => string;
};

/**
 * Prompt style registry:
 * - Keys are style IDs (string)
 * - Values are templates
 *
 * This is intentionally flexible: different skills can define different style sets.
 */
export const PROMPT_STYLES: Record<PromptStyleId, PromptStyle> = {
  A: {
    id: "A",
    template: (expr) => `Simplify ${expr}`,
  },
  B: {
    id: "B",
    template: (expr) => `Express ${expr} in its simplest form`,
  },
  C: {
    id: "C",
    template: (expr) => `Expand and simplify ${expr}`,
  },
};