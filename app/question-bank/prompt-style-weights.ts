export const PROMPT_STYLES = {

  A: {
    id: "A",
    description: "Simplify",
    template: (expression: string) => `Simplify ${expression}.`
  },

  B: {
    id: "B",
    description: "Express as simplest surd",
    template: (expression: string) =>
      `Express ${expression} as a surd in its simplest form.`
  },

  C: {
    id: "C",
    description: "Expand and simplify",
    template: (expression: string) =>
      `Expand and simplify ${expression}.`
  }

};