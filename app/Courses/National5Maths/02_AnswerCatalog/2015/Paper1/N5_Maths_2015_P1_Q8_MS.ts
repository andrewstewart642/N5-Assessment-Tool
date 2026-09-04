import { createG1GradientAnswerCatalogEntry } from "../../G1GradientAnswerCatalogFactory";
import { getG1AnswerConfig } from "../../G1GradientAnswerCatalogSource";
import { N5_MATHS_2015_P1_Q8 as question } from "../../../01_QuestionCatalog/2015/Paper1/N5_Maths_2015_P1_Q8";

export const N5_MATHS_2015_P1_Q8_MS = createG1GradientAnswerCatalogEntry(
  question,
  getG1AnswerConfig(2015, "P1", "8"),
);
