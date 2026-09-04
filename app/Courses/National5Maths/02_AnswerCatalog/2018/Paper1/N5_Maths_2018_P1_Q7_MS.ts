import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2018_P1_Q7 as question } from "../../../01_QuestionCatalog/2018/Paper1/N5_Maths_2018_P1_Q7";

export const N5_MATHS_2018_P1_Q7_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2018, "P1", "7"),
);
