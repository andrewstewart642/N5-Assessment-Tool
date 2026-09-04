import { N5_MATHS_2014_P1_Q6 } from "../../../01_QuestionCatalog/2014/Paper1/N5_Maths_2014_P1_Q6";
import { N5_MATHS_2015_P1_Q8 } from "../../../01_QuestionCatalog/2015/Paper1/N5_Maths_2015_P1_Q8";
import { N5_MATHS_2016_P1_Q5 } from "../../../01_QuestionCatalog/2016/Paper1/N5_Maths_2016_P1_Q5";
import { N5_MATHS_2017_P1_Q6 } from "../../../01_QuestionCatalog/2017/Paper1/N5_Maths_2017_P1_Q6";
import { N5_MATHS_2018_P1_Q7 } from "../../../01_QuestionCatalog/2018/Paper1/N5_Maths_2018_P1_Q7";
import { N5_MATHS_2019_P1_Q6 } from "../../../01_QuestionCatalog/2019/Paper1/N5_Maths_2019_P1_Q6";
import { N5_MATHS_2019_P2_Q13 } from "../../../01_QuestionCatalog/2019/Paper2/N5_Maths_2019_P2_Q13";
import { N5_MATHS_2021_P1_Q10 } from "../../../01_QuestionCatalog/2021/Paper1/N5_Maths_2021_P1_Q10";
import { N5_MATHS_2022_P1_Q6 } from "../../../01_QuestionCatalog/2022/Paper1/N5_Maths_2022_P1_Q6";
import { N5_MATHS_2023_P1_Q7 } from "../../../01_QuestionCatalog/2023/Paper1/N5_Maths_2023_P1_Q7";
import { N5_MATHS_2024_P1_Q9 } from "../../../01_QuestionCatalog/2024/Paper1/N5_Maths_2024_P1_Q9";
import { N5_MATHS_2025_P1_Q6 } from "../../../01_QuestionCatalog/2025/Paper1/N5_Maths_2025_P1_Q6";
import { toHistoricalQuestionCatalogView } from "../../../01_QuestionCatalog/QuestionCatalogHistoricalView";

import { N5_MATHS_2014_P1_Q6_MS } from "../../../02_AnswerCatalog/2014/Paper1/N5_Maths_2014_P1_Q6_MS";
import { N5_MATHS_2015_P1_Q8_MS } from "../../../02_AnswerCatalog/2015/Paper1/N5_Maths_2015_P1_Q8_MS";
import { N5_MATHS_2016_P1_Q5_MS } from "../../../02_AnswerCatalog/2016/Paper1/N5_Maths_2016_P1_Q5_MS";
import { N5_MATHS_2017_P1_Q6_MS } from "../../../02_AnswerCatalog/2017/Paper1/N5_Maths_2017_P1_Q6_MS";
import { N5_MATHS_2018_P1_Q7_MS } from "../../../02_AnswerCatalog/2018/Paper1/N5_Maths_2018_P1_Q7_MS";
import { N5_MATHS_2019_P1_Q6_MS } from "../../../02_AnswerCatalog/2019/Paper1/N5_Maths_2019_P1_Q6_MS";
import { N5_MATHS_2019_P2_Q13_MS } from "../../../02_AnswerCatalog/2019/Paper2/N5_Maths_2019_P2_Q13_MS";
import { N5_MATHS_2021_P1_Q10_MS } from "../../../02_AnswerCatalog/2021/Paper1/N5_Maths_2021_P1_Q10_MS";
import { N5_MATHS_2022_P1_Q6_MS } from "../../../02_AnswerCatalog/2022/Paper1/N5_Maths_2022_P1_Q6_MS";
import { N5_MATHS_2023_P1_Q7_MS } from "../../../02_AnswerCatalog/2023/Paper1/N5_Maths_2023_P1_Q7_MS";
import { N5_MATHS_2024_P1_Q9_MS } from "../../../02_AnswerCatalog/2024/Paper1/N5_Maths_2024_P1_Q9_MS";
import { N5_MATHS_2025_P1_Q6_MS } from "../../../02_AnswerCatalog/2025/Paper1/N5_Maths_2025_P1_Q6_MS";
import { toHistoricalAnswerCatalogView } from "../../../02_AnswerCatalog/AnswerCatalogHistoricalView";

import { createSkillHistoricalEvidenceSet } from "../../SkillCatalogTypes";

const historicalPair = (
  question: Parameters<typeof toHistoricalQuestionCatalogView>[0],
  answer: Parameters<typeof toHistoricalAnswerCatalogView>[0],
) => ({
  question: toHistoricalQuestionCatalogView(question),
  answer: toHistoricalAnswerCatalogView(answer),
});

/**
 * Complete reviewed G1 corpus for the 2014-2025 source set.
 *
 * Questions with a one-mark statistical follow-up are intentionally included
 * because G1 genuinely owns the three-mark model-construction part. The S2 mark
 * remains S2-owned at mark level and is not reclassified by this evidence set.
 */
export const G1_HISTORICAL_EVIDENCE = createSkillHistoricalEvidenceSet(
  "geo-g01-gradient-two-points",
  [
    historicalPair(N5_MATHS_2014_P1_Q6, N5_MATHS_2014_P1_Q6_MS),
    historicalPair(N5_MATHS_2015_P1_Q8, N5_MATHS_2015_P1_Q8_MS),
    historicalPair(N5_MATHS_2016_P1_Q5, N5_MATHS_2016_P1_Q5_MS),
    historicalPair(N5_MATHS_2017_P1_Q6, N5_MATHS_2017_P1_Q6_MS),
    historicalPair(N5_MATHS_2018_P1_Q7, N5_MATHS_2018_P1_Q7_MS),
    historicalPair(N5_MATHS_2019_P1_Q6, N5_MATHS_2019_P1_Q6_MS),
    historicalPair(N5_MATHS_2019_P2_Q13, N5_MATHS_2019_P2_Q13_MS),
    historicalPair(N5_MATHS_2021_P1_Q10, N5_MATHS_2021_P1_Q10_MS),
    historicalPair(N5_MATHS_2022_P1_Q6, N5_MATHS_2022_P1_Q6_MS),
    historicalPair(N5_MATHS_2023_P1_Q7, N5_MATHS_2023_P1_Q7_MS),
    historicalPair(N5_MATHS_2024_P1_Q9, N5_MATHS_2024_P1_Q9_MS),
    historicalPair(N5_MATHS_2025_P1_Q6, N5_MATHS_2025_P1_Q6_MS),
  ],
);
