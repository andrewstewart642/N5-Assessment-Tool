import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2016_P1_Q5 as question } from "../../../01_QuestionCatalog/2016/Paper1/N5_Maths_2016_P1_Q5";

export const N5_MATHS_2016_P1_Q5_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2016, "P1", "5"),
);
