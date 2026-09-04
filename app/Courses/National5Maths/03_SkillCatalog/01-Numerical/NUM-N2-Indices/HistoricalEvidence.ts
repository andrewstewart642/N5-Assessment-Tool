import { N5_MATHS_2014_P2_Q8 } from "../../../01_QuestionCatalog/2014/Paper2/N5_Maths_2014_P2_Q8";
import { N5_MATHS_2015_P1_Q14 } from "../../../01_QuestionCatalog/2015/Paper1/N5_Maths_2015_P1_Q14";
import { N5_MATHS_2016_P2_Q10 } from "../../../01_QuestionCatalog/2016/Paper2/N5_Maths_2016_P2_Q10";
import { N5_MATHS_2017_P2_Q12 } from "../../../01_QuestionCatalog/2017/Paper2/N5_Maths_2017_P2_Q12";
import { N5_MATHS_2018_P1_Q15 } from "../../../01_QuestionCatalog/2018/Paper1/N5_Maths_2018_P1_Q15";
import { N5_MATHS_2019_P2_Q16 } from "../../../01_QuestionCatalog/2019/Paper2/N5_Maths_2019_P2_Q16";
import { N5_MATHS_2021_P1_Q15 } from "../../../01_QuestionCatalog/2021/Paper1/N5_Maths_2021_P1_Q15";
import { N5_MATHS_2022_P1_Q11 } from "../../../01_QuestionCatalog/2022/Paper1/N5_Maths_2022_P1_Q11";
import { N5_MATHS_2023_P1_Q12 } from "../../../01_QuestionCatalog/2023/Paper1/N5_Maths_2023_P1_Q12";
import { N5_MATHS_2024_P1_Q13 } from "../../../01_QuestionCatalog/2024/Paper1/N5_Maths_2024_P1_Q13";
import { N5_MATHS_2025_P1_Q10 } from "../../../01_QuestionCatalog/2025/Paper1/N5_Maths_2025_P1_Q10";
import { toHistoricalQuestionCatalogView } from "../../../01_QuestionCatalog/QuestionCatalogHistoricalView";
import { N5_MATHS_2014_P2_Q8_MS } from "../../../02_AnswerCatalog/2014/Paper2/N5_Maths_2014_P2_Q8_MS";
import { N5_MATHS_2015_P1_Q14_MS } from "../../../02_AnswerCatalog/2015/Paper1/N5_Maths_2015_P1_Q14_MS";
import { N5_MATHS_2016_P2_Q10_MS } from "../../../02_AnswerCatalog/2016/Paper2/N5_Maths_2016_P2_Q10_MS";
import { N5_MATHS_2017_P2_Q12_MS } from "../../../02_AnswerCatalog/2017/Paper2/N5_Maths_2017_P2_Q12_MS";
import { N5_MATHS_2018_P1_Q15_MS } from "../../../02_AnswerCatalog/2018/Paper1/N5_Maths_2018_P1_Q15_MS";
import { N5_MATHS_2019_P2_Q16_MS } from "../../../02_AnswerCatalog/2019/Paper2/N5_Maths_2019_P2_Q16_MS";
import { N5_MATHS_2021_P1_Q15_MS } from "../../../02_AnswerCatalog/2021/Paper1/N5_Maths_2021_P1_Q15_MS";
import { N5_MATHS_2022_P1_Q11_MS } from "../../../02_AnswerCatalog/2022/Paper1/N5_Maths_2022_P1_Q11_MS";
import { N5_MATHS_2023_P1_Q12_MS } from "../../../02_AnswerCatalog/2023/Paper1/N5_Maths_2023_P1_Q12_MS";
import { N5_MATHS_2024_P1_Q13_MS } from "../../../02_AnswerCatalog/2024/Paper1/N5_Maths_2024_P1_Q13_MS";
import { N5_MATHS_2025_P1_Q10_MS } from "../../../02_AnswerCatalog/2025/Paper1/N5_Maths_2025_P1_Q10_MS";
import { toHistoricalAnswerCatalogView } from "../../../02_AnswerCatalog/AnswerCatalogHistoricalView";
import { createSkillHistoricalEvidenceSet } from "../../SkillCatalogTypes";

const historicalPair = (
  question: Parameters<typeof toHistoricalQuestionCatalogView>[0],
  answer: Parameters<typeof toHistoricalAnswerCatalogView>[0],
) => ({
  question: toHistoricalQuestionCatalogView(question),
  answer: toHistoricalAnswerCatalogView(answer),
});

/** Complete reviewed N2 indices corpus currently used by SkillCatalog. */
export const N2_HISTORICAL_EVIDENCE = createSkillHistoricalEvidenceSet(
  "num-n2-indices",
  [
    historicalPair(N5_MATHS_2014_P2_Q8, N5_MATHS_2014_P2_Q8_MS),
    historicalPair(N5_MATHS_2015_P1_Q14, N5_MATHS_2015_P1_Q14_MS),
    historicalPair(N5_MATHS_2016_P2_Q10, N5_MATHS_2016_P2_Q10_MS),
    historicalPair(N5_MATHS_2017_P2_Q12, N5_MATHS_2017_P2_Q12_MS),
    historicalPair(N5_MATHS_2018_P1_Q15, N5_MATHS_2018_P1_Q15_MS),
    historicalPair(N5_MATHS_2019_P2_Q16, N5_MATHS_2019_P2_Q16_MS),
    historicalPair(N5_MATHS_2021_P1_Q15, N5_MATHS_2021_P1_Q15_MS),
    historicalPair(N5_MATHS_2022_P1_Q11, N5_MATHS_2022_P1_Q11_MS),
    historicalPair(N5_MATHS_2023_P1_Q12, N5_MATHS_2023_P1_Q12_MS),
    historicalPair(N5_MATHS_2024_P1_Q13, N5_MATHS_2024_P1_Q13_MS),
    historicalPair(N5_MATHS_2025_P1_Q10, N5_MATHS_2025_P1_Q10_MS),
  ],
);
