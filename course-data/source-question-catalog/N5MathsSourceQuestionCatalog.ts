import type { SourceQuestionCatalogEntry } from "./SourceQuestionTypes";

import { N5_MATHS_2014_P1_Q01 } from "./N5_Maths_2014/Paper1/N5_Maths_2014_P1_Q01";
import { N5_MATHS_2015_P1_Q01 } from "./N5_Maths_2015/Paper1/N5_Maths_2015_P1_Q01";
import { N5_MATHS_2016_P1_Q02 } from "./N5_Maths_2016/Paper1/N5_Maths_2016_P1_Q02";
import { N5_MATHS_2017_P1_Q03 } from "./N5_Maths_2017/Paper1/N5_Maths_2017_P1_Q03";
import { N5_MATHS_2018_P1_Q01 } from "./N5_Maths_2018/Paper1/N5_Maths_2018_P1_Q01";
import { N5_MATHS_2019_P1_Q02 } from "./N5_Maths_2019/Paper1/N5_Maths_2019_P1_Q02";
import { N5_MATHS_2021_P1_Q02 } from "./N5_Maths_2021/Paper1/N5_Maths_2021_P1_Q02";
import { N5_MATHS_2022_P1_Q01 } from "./N5_Maths_2022/Paper1/N5_Maths_2022_P1_Q01";
import { N5_MATHS_2023_P1_Q01 } from "./N5_Maths_2023/Paper1/N5_Maths_2023_P1_Q01";
import { N5_MATHS_2024_P1_Q01 } from "./N5_Maths_2024/Paper1/N5_Maths_2024_P1_Q01";
import { N5_MATHS_2025_P1_Q01 } from "./N5_Maths_2025/Paper1/N5_Maths_2025_P1_Q01";

export const N5_MATHS_SOURCE_QUESTION_CATALOG = [
  N5_MATHS_2014_P1_Q01,
  N5_MATHS_2015_P1_Q01,
  N5_MATHS_2016_P1_Q02,
  N5_MATHS_2017_P1_Q03,
  N5_MATHS_2018_P1_Q01,
  N5_MATHS_2019_P1_Q02,
  N5_MATHS_2021_P1_Q02,
  N5_MATHS_2022_P1_Q01,
  N5_MATHS_2023_P1_Q01,
  N5_MATHS_2024_P1_Q01,
  N5_MATHS_2025_P1_Q01,
] satisfies SourceQuestionCatalogEntry[];

export function getN5MathsSourceQuestionsByFamilyId(familyId: string) {
  return N5_MATHS_SOURCE_QUESTION_CATALOG.filter(
    (question: SourceQuestionCatalogEntry) => question.familyId === familyId
  );
}

export function getN5MathsSourceQuestionsBySkillId(skillId: string) {
  return N5_MATHS_SOURCE_QUESTION_CATALOG.filter(
    (question: SourceQuestionCatalogEntry) =>
      question.skillIds.includes(skillId)
  );
}

export function getN5MathsSourceQuestionsByConceptId(conceptId: string) {
  return N5_MATHS_SOURCE_QUESTION_CATALOG.filter(
    (question: SourceQuestionCatalogEntry) =>
      question.conceptIds.includes(conceptId)
  );
}
