// app/create-assessment/builder/builder-logic/BuilderQuestionGenerators.ts

import type {
  Concept,
  DifficultyLevel,
  QuestionSkillLink,
  Skill,
} from "@/shared-types/AssessmentTypes";
import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
} from "@/shared-types/QuestionGenerationTypes";

import SurdsConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N01_1_Surds";
import RationaliseConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N01_2_Rationalise";
import MultiplyDivideIndicesConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_1_MultiplyAndDivideIndices";
import PowerOfAProductConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_2_PowerOfAProduct";
import PowerToAPowerConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_3_PowerToAPower";
import FractionalIndicesConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_4_FractionalIndices";
import ScientificNotationConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N02_5_ScientificNotation";
import SignificantFiguresConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N03_1_SignificantFigures";
import ReversePercentagesConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_1_PercentagesReverse";
import AppreciationConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation";
import DepreciationConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N04_3_PercentagesDepreciation";
import FractionsConceptModule from "@/app/question-bank/skills/01-numerical/NQ_N5_NUM_N05_1_Fractions";

const conceptModules: ConceptGeneratorModule[] = [
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
];

export function conceptSelectionText(concept: Concept): string {
  const short = concept.shortLabel?.trim();
  if (short) return `${concept.code} ${short}`;
  return concept.label.trim();
}

export function getConceptFromSelection(
  skill: Skill,
  selectedConcept: string
): Concept | undefined {
  const trimmed = selectedConcept.trim();

  return skill.concepts.find((c) => {
    const compact = conceptSelectionText(c);
    return (
      c.label === trimmed ||
      c.code === trimmed ||
      c.shortLabel === trimmed ||
      compact === trimmed
    );
  });
}

function getModule(conceptCode: string): ConceptGeneratorModule | undefined {
  return conceptModules.find((m) => m.canHandle(conceptCode));
}

function buildContext(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel
): GeneratorContext {
  const concept = getConceptFromSelection(skill, selectedConcept);

  return {
    skill,
    concept,
    difficulty,
    selectedConceptText: selectedConcept,
  };
}

export function buildGenerated(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel
): GeneratedQuestionData {
  const context = buildContext(skill, selectedConcept, difficulty);
  const conceptCode = context.concept?.code ?? selectedConcept;

  const module = getModule(conceptCode);

  if (module) {
    return module.generate(context);
  }

  return {
    prompt: `Placeholder question for ${selectedConcept}`,
    answer: "Not yet implemented",
    marks: 2,
  };
}

export function buildSkillLinks(
  skill: Skill,
  concept: Concept | undefined
): QuestionSkillLink[] {
  if (!concept) {
    return [
      {
        skillId: skill.id,
        role: "primary",
      },
    ];
  }

  return [
    {
      skillId: skill.id,
      conceptId: concept.id,
      role: "primary",
    },
  ];
}