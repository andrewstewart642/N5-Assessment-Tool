import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2022_P1_Q6 as question } from "../../../01_QuestionCatalog/2022/Paper1/N5_Maths_2022_P1_Q6";

export const N5_MATHS_2022_P1_Q6_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2022, "P1", "6"),
);
