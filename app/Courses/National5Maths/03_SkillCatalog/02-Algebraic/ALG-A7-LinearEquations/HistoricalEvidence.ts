import { N5_MATHS_2016_P1_Q8 } from "../../../01_QuestionCatalog/2016/Paper1/N5_Maths_2016_P1_Q8";
import { N5_MATHS_2019_P1_Q14 } from "../../../01_QuestionCatalog/2019/Paper1/N5_Maths_2019_P1_Q14";
import { N5_MATHS_2022_P1_Q15 } from "../../../01_QuestionCatalog/2022/Paper1/N5_Maths_2022_P1_Q15";
import { N5_MATHS_2025_P2_Q13 } from "../../../01_QuestionCatalog/2025/Paper2/N5_Maths_2025_P2_Q13";
import {
  toHistoricalQuestionCatalogView,
} from "../../../01_QuestionCatalog/QuestionCatalogHistoricalView";
import { N5_MATHS_2016_P1_Q8_MS } from "../../../02_AnswerCatalog/2016/Paper1/N5_Maths_2016_P1_Q8_MS";
import { N5_MATHS_2019_P1_Q14_MS } from "../../../02_AnswerCatalog/2019/Paper1/N5_Maths_2019_P1_Q14_MS";
import { N5_MATHS_2022_P1_Q15_MS } from "../../../02_AnswerCatalog/2022/Paper1/N5_Maths_2022_P1_Q15_MS";
import { N5_MATHS_2025_P2_Q13_MS } from "../../../02_AnswerCatalog/2025/Paper2/N5_Maths_2025_P2_Q13_MS";
import {
  toHistoricalAnswerCatalogView,
} from "../../../02_AnswerCatalog/AnswerCatalogHistoricalView";
import { createSkillHistoricalEvidenceSet } from "../../SkillCatalogTypes";

const historicalPair = (
  question: Parameters<typeof toHistoricalQuestionCatalogView>[0],
  answer: Parameters<typeof toHistoricalAnswerCatalogView>[0],
) => ({
  question: toHistoricalQuestionCatalogView(question),
  answer: toHistoricalAnswerCatalogView(answer),
});

/**
 * The complete teacher-moderated A7 historical corpus currently used by the
 * SkillCatalog. Raw one-question/one-marking-scheme records are projected at
 * this boundary; downstream SkillCatalog code receives historical-only views.
 */
export const A7_HISTORICAL_EVIDENCE = createSkillHistoricalEvidenceSet(
  "alg-a07-linear-equations",
  [
    historicalPair(N5_MATHS_2016_P1_Q8, N5_MATHS_2016_P1_Q8_MS),
    historicalPair(N5_MATHS_2019_P1_Q14, N5_MATHS_2019_P1_Q14_MS),
    historicalPair(N5_MATHS_2022_P1_Q15, N5_MATHS_2022_P1_Q15_MS),
    historicalPair(N5_MATHS_2025_P2_Q13, N5_MATHS_2025_P2_Q13_MS),
  ],
);
