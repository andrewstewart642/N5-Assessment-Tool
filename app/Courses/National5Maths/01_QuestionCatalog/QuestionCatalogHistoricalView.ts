import type { CatalogReviewProfile, CatalogValue } from "../CatalogCoreTypes";
import type {
  VisualCatalogElement,
  VisualEvidenceProfile,
} from "../CatalogVisualEvidenceTypes";
import type {
  QuestionCatalogEntry,
  QuestionLanguageProfile,
  QuestionPromptStructureProfile,
} from "./QuestionCatalogTypes";

/**
 * Historical-only review state exposed outside 01_QuestionCatalog.
 * Generation-analysis completion is deliberately hidden from the source view.
 */
export type HistoricalQuestionReviewProfile = Omit<
  CatalogReviewProfile,
  "generationAnalysisComplete"
>;

/** Generator-writing notes belong to SkillCatalog, not historical prompt evidence. */
export type HistoricalQuestionPromptStructureProfile = Omit<
  QuestionPromptStructureProfile,
  "generatorVariationNotes"
>;

export type HistoricalQuestionLanguageProfile = Omit<
  QuestionLanguageProfile,
  "promptStructure"
> & {
  promptStructure?: HistoricalQuestionPromptStructureProfile;
};

/**
 * Visual semantic/source evidence is historical. Renderer strategy, originality
 * policy and generated-output validation are downstream concerns and are hidden.
 */
export type HistoricalVisualCatalogElement = Omit<
  VisualCatalogElement,
  "generation" | "originality" | "validation"
>;

export type HistoricalVisualEvidenceProfile = Omit<
  VisualEvidenceProfile,
  "elements" | "generationRequiresMultipleVisuals"
> & {
  elements: HistoricalVisualCatalogElement[];
};

/**
 * Canonical read-model for historical question evidence.
 *
 * Transitional QuestionCatalogEntry fields such as parameterDesign,
 * sourceIsolation and generation remain available inside 01_QuestionCatalog
 * while the corpus is migrated, but they are intentionally absent here.
 */
export type HistoricalQuestionCatalogView = Pick<
  QuestionCatalogEntry,
  | "identity"
  | "sourceLayout"
  | "structure"
  | "curriculum"
  | "task"
  | "mathematics"
  | "information"
  | "reasoning"
  | "numbers"
  | "calculator"
  | "constraints"
  | "answerSpecification"
  | "context"
  | "mathematicalModel"
  | "specialisedProfiles"
  | "family"
  | "surface"
> & {
  language: HistoricalQuestionLanguageProfile;
  visuals: CatalogValue<HistoricalVisualEvidenceProfile>;
  review: HistoricalQuestionReviewProfile;
};

const historicalVisuals = (
  visuals: QuestionCatalogEntry["visuals"],
): CatalogValue<HistoricalVisualEvidenceProfile> => {
  if (visuals.state !== "VALUE") return visuals;

  const {
    generationRequiresMultipleVisuals: _generationRequiresMultipleVisuals,
    elements,
    ...profile
  } = visuals.value;

  return {
    ...visuals,
    value: {
      ...profile,
      elements: elements.map((element) => {
        const {
          generation: _generation,
          originality: _originality,
          validation: _validation,
          ...historical
        } = element;
        return historical;
      }),
    },
  };
};

const historicalLanguage = (
  language: QuestionCatalogEntry["language"],
): HistoricalQuestionLanguageProfile => {
  if (!language.promptStructure) return language;

  const {
    generatorVariationNotes: _generatorVariationNotes,
    ...promptStructure
  } = language.promptStructure;

  return {
    ...language,
    promptStructure,
  };
};

const historicalReview = (
  review: QuestionCatalogEntry["review"],
): HistoricalQuestionReviewProfile => {
  const {
    generationAnalysisComplete: _generationAnalysisComplete,
    ...historical
  } = review;
  return historical;
};

/**
 * Projects a transitional full QuestionCatalogEntry into the only shape that
 * SkillCatalog is allowed to consume as historical question evidence.
 */
export const toHistoricalQuestionCatalogView = (
  entry: QuestionCatalogEntry,
): HistoricalQuestionCatalogView => ({
  identity: entry.identity,
  sourceLayout: entry.sourceLayout,
  structure: entry.structure,
  curriculum: entry.curriculum,
  task: entry.task,
  mathematics: entry.mathematics,
  information: entry.information,
  reasoning: entry.reasoning,
  numbers: entry.numbers,
  calculator: entry.calculator,
  constraints: entry.constraints,
  answerSpecification: entry.answerSpecification,
  context: entry.context,
  language: historicalLanguage(entry.language),
  visuals: historicalVisuals(entry.visuals),
  mathematicalModel: entry.mathematicalModel,
  specialisedProfiles: entry.specialisedProfiles,
  family: entry.family,
  surface: entry.surface,
  review: historicalReview(entry.review),
});

/**
 * Transitional storage adapter for newly purified historical entries.
 *
 * A7/A8 now store only HistoricalQuestionCatalogView data at runtime. The cast
 * preserves compatibility with older call sites that still name
 * QuestionCatalogEntry while the untouched corpus is migrated incrementally.
 * No omitted generator field is recreated by this adapter.
 */
export const asHistoricalQuestionCatalogEntry = (
  entry: HistoricalQuestionCatalogView,
): QuestionCatalogEntry => {
  const review = historicalReview(entry.review as QuestionCatalogEntry["review"]);
  return {
    ...entry,
    review,
  } as unknown as QuestionCatalogEntry;
};
