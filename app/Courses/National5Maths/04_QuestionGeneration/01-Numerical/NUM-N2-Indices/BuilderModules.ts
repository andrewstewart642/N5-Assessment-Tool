import type {
  ConceptGeneratorModule,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  getN2MechanismProfile,
} from "./Calibration";
import {
  buildN2BuilderGenerated,
  n2VariantSelectionMeta,
} from "./BuilderBridge";
import {
  N2_MECHANISMS_BY_SKILL,
  N2_SKILLS,
} from "./SkillLabels";
import type {
  N2GeneratorMechanism,
  N2GeneratorSkillId,
} from "./Types";

const conceptLabel = (code: N2GeneratorSkillId) =>
  N2_SKILLS.find((entry) => entry.id === code)?.label ?? code;

const paperSuitability = (mechanisms: readonly N2GeneratorMechanism[]) => {
  const papers = new Set(
    mechanisms.flatMap((mechanism) => getN2MechanismProfile(mechanism).supportedPapers),
  );
  if (papers.has("P1") && papers.has("P2")) return "BOTH" as const;
  return papers.has("P2") ? "P2" as const : "P1" as const;
};

const standardCoverage = (mechanisms: readonly N2GeneratorMechanism[]) => {
  const values = new Set(
    mechanisms.map((mechanism) => {
      const profile = getN2MechanismProfile(mechanism).standardProfile;
      return profile === "C+A" ? "Mixed" as const : profile;
    }),
  );
  return [...values];
};

const makeN2Module = (
  code: N2GeneratorSkillId,
): ConceptGeneratorModule => {
  const mechanisms = N2_MECHANISMS_BY_SKILL[code];
  const suitability = paperSuitability(mechanisms);

  return {
    metadata: {
      moduleId: `NQ_N5_NUM_${code.replaceAll(".", "_")}_INDICES`,
      domain: "NUM",
      skillCode: "N2",
      conceptCode: code,
      conceptLabel: conceptLabel(code),
      tags: ["indices", "skill-catalog", "paired answer generation"],
      difficultyProfile: {
        availableLevels: [1, 2],
        defaultLevel: 1,
        levelDescriptions: {
          1: "Lower source-centred N2 demand within the selected indices skill.",
          2: "Upper examination-natural N2 demand within the selected indices skill.",
        },
      },
      capabilities: {
        standardCoverage: standardCoverage(mechanisms),
        canGenerateReasoning: false,
        calculatorStatus: suitability === "P1" ? "NonCalculatorOnly" : "Either",
        paperSuitability: suitability,
        typicalStructureTypes: ["ExpressionSimplification"],
      },
      levelSelectionProfile: {
        1: mechanisms.map((mechanism) => n2VariantSelectionMeta(mechanism, 1)),
        2: mechanisms.map((mechanism) => n2VariantSelectionMeta(mechanism, 2)),
      },
    },
    canHandle: (conceptCode) => conceptCode === code,
    generate: buildN2BuilderGenerated,
  };
};

export const N2SimplifyConceptModule = makeN2Module("N2.1");
export const N2ExpandConceptModule = makeN2Module("N2.2");
export const N2EvaluateFractionalConceptModule = makeN2Module("N2.3");
