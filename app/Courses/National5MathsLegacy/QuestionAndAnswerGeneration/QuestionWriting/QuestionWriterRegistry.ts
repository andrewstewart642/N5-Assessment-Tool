import type {
  Concept,
  DifficultyLevel,
  QuestionSkillLink,
  Skill,
} from "@/app/Assessments/AssessmentTypes";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import type {
  QuestionSelectionFilters,
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  isVariantEligibleForFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import SurdsConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N01_1_Surds";

import RationaliseConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N01_2_Rationalise";

import MultiplyDivideIndicesConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N02_1_MultiplyAndDivideIndices";

import PowerOfAProductConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N02_2_PowerOfAProduct";

import PowerToAPowerConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N02_3_PowerToAPower";

import FractionalIndicesConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N02_4_FractionalIndices";

import ScientificNotationConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N02_5_ScientificNotation";

import SignificantFiguresConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N03_1_SignificantFigures";

import ReversePercentagesConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_1_PercentagesReverse";

import AppreciationConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation";

import DepreciationConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_3_PercentagesDepreciation";

import FractionsConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N05_1_Fractions";

import TrigEquationsConceptModule from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/Trigonometry/NQ_N5_TRIG_T02_2_Equations";

import {
  A8BasicConceptModule,
  A8ContextConceptModule,
  A8DerivedConceptModule,
  A8GraphConceptModule,
  A8MixedConceptModule,
} from "./ConceptModules/Algebraic/NQ_N5_ALG_A08_SimultaneousEquations";

const conceptModules:
  ConceptGeneratorModule[] = [
    SurdsConceptModule,
    RationaliseConceptModule,
    MultiplyDivideIndicesConceptModule,
    PowerOfAProductConceptModule,
    PowerToAPowerConceptModule,
    FractionalIndicesConceptModule,
    ScientificNotationConceptModule,
    SignificantFiguresConceptModule,
    ReversePercentagesConceptModule,
    AppreciationConceptModule,
    DepreciationConceptModule,
    FractionsConceptModule,
    A8MixedConceptModule,
    A8BasicConceptModule,
    A8ContextConceptModule,
    A8GraphConceptModule,
    A8DerivedConceptModule,
    TrigEquationsConceptModule,
  ];

export function conceptSelectionText(
  concept: Concept
): string {
  const short =
    concept.shortLabel?.trim();

  if (short) {
    return `${concept.code} ${short}`;
  }

  return concept.label.trim();
}

export function getConceptFromSelection(
  skill: Skill,
  selectedConcept: string
): Concept | undefined {
  const trimmed =
    selectedConcept.trim();

  return skill.concepts.find(
    (concept) => {
      const compact =
        conceptSelectionText(
          concept
        );

      return (
        concept.label ===
          trimmed ||
        concept.code ===
          trimmed ||
        concept.shortLabel ===
          trimmed ||
        compact === trimmed
      );
    }
  );
}

function getModule(
  conceptCode: string
):
  | ConceptGeneratorModule
  | undefined {
  return conceptModules.find(
    (module) =>
      module.canHandle(
        conceptCode
      )
  );
}

function buildContext(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?:
    QuestionSelectionFilters
): GeneratorContext {
  const concept =
    getConceptFromSelection(
      skill,
      selectedConcept
    );

  return {
    skill,
    concept,
    difficulty,

    selectedConceptText:
      selectedConcept,

    paper:
      selectionFilters
        ?.targetPaper,

    selectionFilters,
  };
}

function getLevelSelectionEntries(
  module:
    ConceptGeneratorModule,
  difficulty:
    DifficultyLevel
): QuestionVariantSelectionMeta[] {
  const profile =
    module.metadata
      .levelSelectionProfile;

  if (!profile) {
    return [];
  }

  return (
    profile[difficulty] ?? []
  );
}

export function getAvailableDifficultiesForConcept(
  skill: Skill,
  selectedConcept: string
): DifficultyLevel[] {
  const concept =
    getConceptFromSelection(
      skill,
      selectedConcept
    );

  const conceptCode =
    concept?.code ??
    selectedConcept;

  const questionModule =
    getModule(conceptCode);

  if (!questionModule) {
    return [];
  }

  return [
    ...questionModule.metadata
      .difficultyProfile
      .availableLevels,
  ];
}

export function isDifficultyEligibleForConcept(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?:
    QuestionSelectionFilters
): boolean {
  if (!selectionFilters) {
    return true;
  }

  const concept =
    getConceptFromSelection(
      skill,
      selectedConcept
    );

  const conceptCode =
    concept?.code ??
    selectedConcept;

  const questionModule =
    getModule(conceptCode);

  if (!questionModule) {
    return true;
  }

  const profile =
    questionModule.metadata
      .levelSelectionProfile;

  if (!profile) {
    return true;
  }

  const entries =
    getLevelSelectionEntries(
      questionModule,
      difficulty
    );

  if (
    entries.length === 0
  ) {
    return false;
  }

  return entries.some(
    (entry) =>
      isVariantEligibleForFilters(
        entry,
        selectionFilters
      )
  );
}

export function getEligibleDifficultiesForConcept(
  skill: Skill,
  selectedConcept: string,
  selectionFilters?:
    QuestionSelectionFilters
): DifficultyLevel[] {
  const concept =
    getConceptFromSelection(
      skill,
      selectedConcept
    );

  const conceptCode =
    concept?.code ??
    selectedConcept;

  const questionModule =
    getModule(conceptCode);

  if (!questionModule) {
    return [];
  }

  const availableLevels =
    questionModule.metadata
      .difficultyProfile
      .availableLevels;

  const profile =
    questionModule.metadata
      .levelSelectionProfile;

  if (
    !selectionFilters ||
    !profile
  ) {
    return [
      ...availableLevels,
    ];
  }

  return availableLevels.filter(
    (level) =>
      isDifficultyEligibleForConcept(
        skill,
        selectedConcept,
        level,
        selectionFilters
      )
  );
}

function resolveGenerationDifficulty(
  skill: Skill,
  selectedConcept: string,
  requestedDifficulty:
    DifficultyLevel,
  selectionFilters?:
    QuestionSelectionFilters
): DifficultyLevel {
  const concept =
    getConceptFromSelection(
      skill,
      selectedConcept
    );

  const conceptCode =
    concept?.code ??
    selectedConcept;

  const questionModule =
    getModule(conceptCode);

  if (!questionModule) {
    return requestedDifficulty;
  }

  if (!selectionFilters) {
    return requestedDifficulty;
  }

  const profile =
    questionModule.metadata
      .levelSelectionProfile;

  if (!profile) {
    return requestedDifficulty;
  }

  if (
    isDifficultyEligibleForConcept(
      skill,
      selectedConcept,
      requestedDifficulty,
      selectionFilters
    )
  ) {
    return requestedDifficulty;
  }

  const defaultLevel =
    questionModule.metadata
      .difficultyProfile
      .defaultLevel;

  if (
    isDifficultyEligibleForConcept(
      skill,
      selectedConcept,
      defaultLevel,
      selectionFilters
    )
  ) {
    return defaultLevel;
  }

  const eligibleLevels =
    getEligibleDifficultiesForConcept(
      skill,
      selectedConcept,
      selectionFilters
    );

  if (
    eligibleLevels.length > 0
  ) {
    return eligibleLevels[0];
  }

  return requestedDifficulty;
}

export function buildGenerated(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel,
  selectionFilters?:
    QuestionSelectionFilters
): GeneratedQuestionData {
  const resolvedDifficulty =
    resolveGenerationDifficulty(
      skill,
      selectedConcept,
      difficulty,
      selectionFilters
    );

  const context =
    buildContext(
      skill,
      selectedConcept,
      resolvedDifficulty,
      selectionFilters
    );

  const conceptCode =
    context.concept?.code ??
    selectedConcept;

  const questionModule =
    getModule(conceptCode);

  if (questionModule) {
    return questionModule.generate(
      context
    );
  }

  return {
    prompt:
      `Placeholder question for ${selectedConcept}`,

    answer:
      "Not yet implemented",

    marks: 2,
  };
}

export function buildSkillLinks(
  skill: Skill,
  concept:
    Concept | undefined
): QuestionSkillLink[] {
  if (!concept) {
    return [
      {
        skillId:
          skill.id,

        role:
          "primary",
      },
    ];
  }

  return [
    {
      skillId:
        skill.id,

      conceptId:
        concept.id,

      role:
        "primary",
    },
  ];
}
