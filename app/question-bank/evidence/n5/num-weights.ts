// app/question-bank/evidence/n5/num-weights.ts
import { N5_NUM_EVIDENCE } from "./num";
import { computePromptWeights } from "../../evidence-engine/compute-prompt-weights";
import { computeMarksWeights } from "../../evidence-engine/compute-marks-weights";

/**
 * Cached weights for the N5 Numerical umbrella.
 * These are computed ONCE when this module is imported (fast for UI).
 *
 * As you add more evidence rows to num.ts, these update automatically.
 */

// N01 = Simplify Surds (Basic)
export const N5_NUM_N01_PROMPT_WEIGHTS = computePromptWeights(N5_NUM_EVIDENCE, {
  level: "N5",
  umbrella: "NUM",
  skillCode2: "N01",
  // Keep low while we're still building the dataset
  minSamples: 10,
  // Default to SQA-ish wording: mostly "Express ... simplest form"
  fallback: [
    { id: "B", weight: 90 },
    { id: "A", weight: 10 },
  ],
});

export const N5_NUM_N01_MARKS_WEIGHTS = computeMarksWeights(N5_NUM_EVIDENCE, {
  level: "N5",
  umbrella: "NUM",
  skillCode2: "N01",
  minSamples: 10,
  // Typical surds mark split (tune later as evidence grows)
  fallback: [
    { marks: 2, weight: 60 },
    { marks: 3, weight: 40 },
  ],
});