import type { Skill } from "@/shared-types/AssessmentTypes";

export const NQ_N5_NUM_N05_Fractions: Skill = {
  id: "num-n05-fractions",
  code: "N5",
  domain: "NUM",
  text: "Work with fractions",
  paperSuitability: "BOTH",
  tags: ["numerical", "fractions"],
  concepts: [
    {
      id: "num-n05-c01-fraction-operations",
      code: "N5.1",
      label: "N5.1 Fraction operations · + − × ÷",
      shortLabel: "Fraction operations",
      badge: "+ − × ÷",
      fullDescription:
        "Operations and combinations of operations on fractions including mixed numbers (addition, subtraction, multiplication, division)",
      teacherNote:
        "Operate correctly with fractions and mixed numbers, including combinations of operations.",
      standard: "C+A",
      marks: 2,
      promptStyleId: "B",
      metadata: {
        standardTier: "C+A",
        thinkingType: "operational",
        paperSuitability: "BOTH",
        calculator: "none",
        interactionType: "core",
        stepCount: "multi",
        topicTags: ["fractions", "mixed numbers", "operations"],
        canBePrimary: true,
      },
    },
  ],
};