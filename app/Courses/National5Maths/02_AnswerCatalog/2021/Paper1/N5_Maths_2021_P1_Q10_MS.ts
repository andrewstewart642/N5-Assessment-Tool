import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2021_P1_Q10 as question } from "../../../01_QuestionCatalog/2021/Paper1/N5_Maths_2021_P1_Q10";

export const N5_MATHS_2021_P1_Q10_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2021, "P1", "10"),
);
