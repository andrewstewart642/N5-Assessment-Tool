import type { Skill } from "@/shared-types/assessmentTypes";

export const NQ_N5_NUM_N04_PercentageApplications: Skill[] = [
  {
    id: "num-n04-reverse-percentage",
    code: "N4",
    domain: "NUM",
    text: "Work with percentages (reverse percentage)",
    paperSuitability: "BOTH",
    tags: ["numerical", "percentages", "reverse percentage"],
    concepts: [
      {
        id: "num-n04-c01-reverse-percentage",
        code: "N4.1",
        label: "N4.1 Reverse percentage · original amount",
        shortLabel: "Reverse percentage",
        badge: "original amount",
        fullDescription:
          "Use reverse percentages to calculate an original quantity",
        teacherNote:
          "Work backwards from a final amount after an increase or decrease.",
        standard: "C+A",
        marks: 3,
        promptStyleId: "B",
        metadata: {
          standardTier: "C+A",
          thinkingType: "mixed",
          paperSuitability: "BOTH",
          calculator: "optional",
          interactionType: "core",
          stepCount: "multi",
          topicTags: ["percentages", "reverse percentage"],
          canBePrimary: true,
        },
      },
    ],
  },
  {
    id: "num-n04-appreciation-depreciation",
    code: "N4",
    domain: "NUM",
    text: "Work with percentages (appreciation/depreciation)",
    paperSuitability: "BOTH",
    tags: ["numerical", "percentages", "growth", "decay"],
    concepts: [
      {
        id: "num-n04-c02-appreciation",
        code: "N4.2",
        label: "N4.2 Appreciation / compound interest · growth",
        shortLabel: "Appreciation / compound interest",
        badge: "growth",
        fullDescription: "Appreciation including compound interest",
        teacherNote:
          "Apply repeated percentage increase, including compound interest contexts.",
        standard: "C+A",
        marks: 3,
        promptStyleId: "B",
        metadata: {
          standardTier: "C+A",
          thinkingType: "mixed",
          paperSuitability: "BOTH",
          calculator: "optional",
          interactionType: "core",
          stepCount: "multi",
          topicTags: ["percentages", "appreciation", "compound interest"],
          canBePrimary: true,
        },
      },
      {
        id: "num-n04-c03-depreciation",
        code: "N4.3",
        label: "N4.3 Depreciation · decay",
        shortLabel: "Depreciation",
        badge: "decay",
        fullDescription: "Depreciation",
        teacherNote:
          "Apply repeated percentage decrease in value over time.",
        standard: "C+A",
        marks: 3,
        promptStyleId: "B",
        metadata: {
          standardTier: "C+A",
          thinkingType: "mixed",
          paperSuitability: "BOTH",
          calculator: "optional",
          interactionType: "core",
          stepCount: "multi",
          topicTags: ["percentages", "depreciation"],
          canBePrimary: true,
        },
      },
    ],
  },
];