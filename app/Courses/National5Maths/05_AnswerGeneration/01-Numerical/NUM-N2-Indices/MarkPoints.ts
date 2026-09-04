import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkPoint } from "./Types";
import { buildMarkPointsGroupA } from "./MarkPointsGroupA";
import { buildMarkPointsGroupB } from "./MarkPointsGroupB";
import { buildMarkPointsGroupC } from "./MarkPointsGroupC";

export const buildN2MarkPoints = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
): N2GeneratedMarkPoint[] => {
  const markPoints =
    buildMarkPointsGroupA(question, profile)
    ?? buildMarkPointsGroupB(question, profile)
    ?? buildMarkPointsGroupC(question, profile);

  if (!markPoints) {
    throw new Error(`Unsupported N2 answer-generation mechanism: ${question.mechanism}.`);
  }
  return markPoints;
};
