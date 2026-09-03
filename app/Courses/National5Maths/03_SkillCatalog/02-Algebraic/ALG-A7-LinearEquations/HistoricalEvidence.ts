import { N5_MATHS_2016_P1_Q8 } from "../../../01_QuestionCatalog/2016/Paper1/N5_Maths_2016_P1_Q8";
import { N5_MATHS_2019_P1_Q14 } from "../../../01_QuestionCatalog/2019/Paper1/N5_Maths_2019_P1_Q14";
import { N5_MATHS_2022_P1_Q15 } from "../../../01_QuestionCatalog/2022/Paper1/N5_Maths_2022_P1_Q15";
import { N5_MATHS_2025_P2_Q13 } from "../../../01_QuestionCatalog/2025/Paper2/N5_Maths_2025_P2_Q13";
import { N5_MATHS_2016_P1_Q8_MS } from "../../../02_AnswerCatalog/2016/Paper1/N5_Maths_2016_P1_Q8_MS";
import { N5_MATHS_2019_P1_Q14_MS } from "../../../02_AnswerCatalog/2019/Paper1/N5_Maths_2019_P1_Q14_MS";
import { N5_MATHS_2022_P1_Q15_MS } from "../../../02_AnswerCatalog/2022/Paper1/N5_Maths_2022_P1_Q15_MS";
import { N5_MATHS_2025_P2_Q13_MS } from "../../../02_AnswerCatalog/2025/Paper2/N5_Maths_2025_P2_Q13_MS";
import { createSkillHistoricalEvidenceSet } from "../../SkillCatalogTypes";

/**
 * The complete teacher-moderated A7 historical corpus currently used by the
 * SkillCatalog. These are imports of the one-question/one-marking-scheme bank;
 * no historical record is copied into the SkillCatalog.
 */
export const A7_HISTORICAL_EVIDENCE = createSkillHistoricalEvidenceSet(
  "alg-a07-linear-equations",
  [
    { question: N5_MATHS_2016_P1_Q8, answer: N5_MATHS_2016_P1_Q8_MS },
    { question: N5_MATHS_2019_P1_Q14, answer: N5_MATHS_2019_P1_Q14_MS },
    { question: N5_MATHS_2022_P1_Q15, answer: N5_MATHS_2022_P1_Q15_MS },
    { question: N5_MATHS_2025_P2_Q13, answer: N5_MATHS_2025_P2_Q13_MS },
  ],
);
