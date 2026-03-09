import { generateNQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms } from "./NQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms";
import { generateNQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms } from "./NQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms";
import { generateNQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify } from "./NQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type ConceptCode2 = "C01" | "C02" | "C03";

export function generateSurdsSimplifyBasic(conceptCode2: ConceptCode2, difficulty: DifficultyLevel) {
  switch (conceptCode2) {
    case "C01":
      return generateNQ_N5_NUM_N01_C01_SimplifySurds_CollectLikeTerms(difficulty);
    case "C02":
      return generateNQ_N5_NUM_N01_C02_SimplifySurds_CollectMultipleTerms(difficulty);
    case "C03":
      return generateNQ_N5_NUM_N01_C03_SimplifySurds_ExpandAndSimplify(difficulty);
    default: {
      const _exhaustive: never = conceptCode2;
      throw new Error(`Unsupported conceptCode2=${_exhaustive}`);
    }
  }
}

export function generateNQ_N5_NUM_N01(difficulty: DifficultyLevel = 3) {
  return generateSurdsSimplifyBasic("C01", difficulty);
}