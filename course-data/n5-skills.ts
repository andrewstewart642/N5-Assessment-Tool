// course-data/n5-skills.ts
// N5 course skills data (sample set). Expand later.

import type { SkillsData } from "@/shared-types/assessmentTypes";

export const skillsData: SkillsData = {
  "Numerical Skills": [
    {
      id: "num-n1-surds-simplify",
      code: "N1",
      text: "Work with surds (simplify)",
      paperSuitability: "BOTH",
      concepts: [
        // C01
        { label: "Simplify (basic)", standard: "C", marks: 2, promptStyleId: "B" },

        // C02
        { label: "Simplify (standard)", standard: "C+A", marks: 2, promptStyleId: "B" },

        // C03
        { label: "Simplify (brackets)", standard: "A", marks: 3, promptStyleId: "C" },
      ],
    },
    {
      id: "num-n1-surds-rationalise",
      code: "N1",
      text: "Work with surds (rationalise denominator)",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Single surd", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Binomial denominator", standard: "A", marks: 3, promptStyleId: "A" },
        { label: "Mixed numbers", standard: "C+A", marks: 3, promptStyleId: "B" },
      ],
    },
    {
      id: "num-n2-indices",
      code: "N2",
      text: "Simplify expressions using the laws of indices",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Product rule", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Quotient rule", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Power of a power", standard: "C+A", marks: 2, promptStyleId: "B" },
        { label: "Negative/fractional indices", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
    {
      id: "num-n2-sci-notation",
      code: "N2",
      text: "Scientific notation",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Standard form", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Multiply/divide", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "Harder conversions", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
  ],

  "Algebraic Skills": [
    {
      id: "alg-a1-expand",
      code: "A1",
      text: "Work with algebraic expressions involving expansion of brackets",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Single bracket", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Double brackets", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "Harder mixed terms", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
    {
      id: "alg-a2-factorise",
      code: "A2",
      text: "Factorise an algebraic expression",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Common factor", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Difference of squares", standard: "C+A", marks: 2, promptStyleId: "B" },
        { label: "Quadratic factorising", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
    {
      id: "alg-a7-linear-eqn",
      code: "A7",
      text: "Work with linear equations",
      paperSuitability: "BOTH",
      concepts: [
        { label: "One-step", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Multi-step", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "With brackets", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
  ],

  "Geometric Skills": [
    {
      id: "geo-g4-pythag",
      code: "G4",
      text: "Apply Pythagoras’ Theorem",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Find hypotenuse", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Find a leg", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Worded problem", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "Multi-step context", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
  ],

  "Trigonometric Skills": [
    {
      id: "trig-t2-related-angles",
      code: "T2",
      text: "Work with trigonometric relationships in degrees",
      paperSuitability: "P2",
      concepts: [
        { label: "Related angles (basic)", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Exact values", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "Harder combinations", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
  ],

  "Statistical Skills": [
    {
      id: "stats-s4-prob",
      code: "S4",
      text: "Work with probability",
      paperSuitability: "BOTH",
      concepts: [
        { label: "Single event", standard: "C", marks: 2, promptStyleId: "B" },
        { label: "Combined events", standard: "C+A", marks: 3, promptStyleId: "B" },
        { label: "Tree diagrams (later)", standard: "A", marks: 3, promptStyleId: "A" },
      ],
    },
  ],
};