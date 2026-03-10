import type { Skill } from "@/shared-types/assessmentTypes";

export const NQ_N5_NUM_N03_SignificantFigures: Skill = {
  id: "num-n03-significant-figures",
  code: "N3",
  domain: "NUM",
  text: "Round to a given number of significant figures",
  paperSuitability: "BOTH",
  tags: ["numerical", "rounding", "significant figures"],
  concepts: [
    {
      id: "num-n03-c01-significant-figures",
      code: "N3.1",
      label: "N3.1 Significant figures · 2 s.f. / 3 s.f.",
      shortLabel: "Significant figures",
      badge: "2 s.f.",
      fullDescription: "Rounding to a given number of significant figures",
      teacherNote:
        "This can be assessed directly or embedded as the final presentation requirement in another question.",
      standard: "C+A",
      marks: 1,
      promptStyleId: "B",
      metadata: {
        standardTier: "C+A",
        thinkingType: "operational",
        paperSuitability: "BOTH",
        calculator: "optional",
        interactionType: "either",
        stepCount: "single",
        topicTags: ["rounding", "significant figures", "presentation"],
        canBePrimary: true,
        canBeSupporting: true,
        canBeOutputSkill: true,
      },
    },
  ],
};