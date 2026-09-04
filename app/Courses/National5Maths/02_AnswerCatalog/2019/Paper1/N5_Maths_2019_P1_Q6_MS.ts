import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2019_P1_Q6 as question } from "../../../01_QuestionCatalog/2019/Paper1/N5_Maths_2019_P1_Q6";

export const N5_MATHS_2019_P1_Q6_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2019, "P1", "6"),
);
