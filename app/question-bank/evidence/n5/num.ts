// app/question-bank/evidence/n5/num.ts
import type { EvidenceRow } from "../../evidence-engine/evidence-types";

/**
 * N5 Numerical evidence (SQA + other sources).
 * This is raw “observations” data. No logic in here.
 */
export const N5_NUM_EVIDENCE: EvidenceRow[] = [
  // -------------------------
  // Simplify Surds (Basic) — N01
  // -------------------------

  // SQA 2024 N5 Maths Paper 1 Question 6 (2 marks)
  // Simplify √75 − √3
  {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C01",
    year: 2024,
    paper: "P1",
    question: "Q6",
    promptStyle: "A", // "Simplify ..."
    marks: 2,
  },

  // SQA 2024 N5 Maths Paper 1 Question 8 (3 marks)
  // Express √40 + 4√10 + √90 as a surd in its simplest form.
  {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C01",
    year: 2024,
    paper: "P1",
    question: "Q8",
    promptStyle: "B", // "Express ... as a surd in its simplest form."
    marks: 3,
  },

  // SQA 2022 N5 Maths Paper 1 Question 13 (3 marks)
  // Expand and simplify √10(√10 − √2) + 8√5
  {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C03",
    year: 2022,
    paper: "P1",
    question: "Q13",
    promptStyle: "C", // "Expand and simplify ..."
    marks: 3,
  },

  // Unknown source ("PP" likely = Past Paper / Practice Paper)
  // Express √45 − 2√5 as a surd in its simplest form. (2 marks)
  {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C01",
    year: null,
    paper: "PP",
    question: "Q14a",
    promptStyle: "B",
    marks: 2,
  },

  // Unknown source ("PP" likely = Past Paper / Practice Paper)
  // Express √12 + 5√3 − √27 as a surd in its simplest form. (3 marks)
  {
    level: "N5",
    umbrella: "NUM",
    skillCode2: "N01",
    conceptCode2: "C01",
    year: null,
    paper: "PP",
    question: "Q11",
    promptStyle: "B",
    marks: 3,
  },
];