import type { N2GeneratedQuestion } from "../../../04_QuestionGeneration/01-Numerical/NUM-N2-Indices/Types";
import type { N2GeneratedAnswerProfile, N2GeneratedMarkPoint } from "./Types";

const SKILL_ID = "num-n2-indices" as const;

export const classifiedN2Mark = (
  question: N2GeneratedQuestion,
  profile: N2GeneratedAnswerProfile,
  markNumber: number,
  input: Omit<N2GeneratedMarkPoint, "markNumber" | "partLabel" | "primarySkillId" | "standard" | "thinking" | "sourceAnchorIds">,
): N2GeneratedMarkPoint => {
  const standard = question.standardMarks[markNumber - 1];
  if (!standard) throw new Error(`N2 generated question ${question.instanceId} has no Standard classification for mark ${markNumber}.`);
  return {
    ...input,
    markNumber,
    partLabel: "",
    primarySkillId: SKILL_ID,
    standard,
    thinking: "OPERATIONAL",
    sourceAnchorIds: [...profile.sourceAnchorIds],
  };
};
