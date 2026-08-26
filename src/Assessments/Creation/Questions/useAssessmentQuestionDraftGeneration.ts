
import {
  useCallback,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

import {
  getCoursePaperSuitabilityTags,
  type CourseAssessmentConfig,
} from "@/src/Courses/CourseAssessmentConfig";

import type {
  DifficultyLevel,
  Paper,
  Question,
  QuestionTopicMarkBreakdown,
  Skill,
  SkillDomain,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/src/Assessments/AssessmentTypes";

import type {
  QuestionSelectionFilters,
} from "@/src/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  buildGenerated,
  buildSkillLinks,
  getConceptFromSelection,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/QuestionWriterRegistry";

import {
  formatAssessmentPaperSuitability,
  getAssessmentPaperConfig,
  getAssessmentPaperLabel,
  isAssessmentPaperSuitable,
} from "../Papers/AssessmentPaperRules";

import {
  applyAssessmentQuestionSpacingBase,
} from "./AssessmentQuestionSpacing";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "./AssessmentQuestionDraftTypes";

type PendingJumpDraftRef =
  MutableRefObject<
    | {
        paper: Paper;
        draftId: string;
      }
    | null
  >;

type EditDraftRef =
  MutableRefObject<
    AssessmentEditQuestionDraftByPaper
  >;

type UseAssessmentQuestionDraftGenerationArgs = {
  courseConfig:
    CourseAssessmentConfig;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  editDraftRef:
    EditDraftRef;

  setDraftByPaper:
    Dispatch<
      SetStateAction<
        AssessmentQuestionDraftByPaper
      >
    >;

  setEditDraftByPaper:
    Dispatch<
      SetStateAction<
        AssessmentEditQuestionDraftByPaper
      >
    >;

  setViewPaper:
    Dispatch<
      SetStateAction<Paper>
    >;

  pendingJumpDraftRef:
    PendingJumpDraftRef;

  pushFlash:
    (
      message: string
    ) => void;

  addQualityNote:
    (
      message: string
    ) => void;
};

function createAssessmentQuestionId(): string {
  return (
    Math.random()
      .toString(16)
      .slice(2) +
    Date.now()
      .toString(16)
  );
}

function buildSingleTopicMarkBreakdown(
  topic:
    SkillDomain | undefined,

  totalMarks:
    number
): QuestionTopicMarkBreakdown | undefined {
  if (
    !topic ||
    !Number.isFinite(
      totalMarks
    ) ||
    totalMarks <= 0
  ) {
    return undefined;
  }

  const breakdown:
    QuestionTopicMarkBreakdown = {
      NUM: 0,
      ALG: 0,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    };

  breakdown[
    topic
  ] =
    totalMarks;

  return breakdown;
}

function resolvePreferredAnswerMethodFamilyId(
  previousQuestion:
    Question | null | undefined,

  generated:
    ReturnType<
      typeof buildGenerated
    >
): string | undefined {
  const workedAnswers =
    generated.workedAnswers;

  if (
    !workedAnswers ||
    workedAnswers.methods
      .length === 0
  ) {
    return undefined;
  }

  const previousPreference =
    previousQuestion
      ?.preferredAnswerMethodFamilyId;

  if (
    previousPreference &&
    workedAnswers.methods.some(
      (
        method
      ) =>
        method.methodFamilyId ===
        previousPreference
    )
  ) {
    return previousPreference;
  }

  return (
    workedAnswers
      .defaultMethodFamilyId ??
    workedAnswers
      .methods[0]
      .methodFamilyId
  );
}

function resolveGeneratedTotalMarks(
  generated:
    ReturnType<
      typeof buildGenerated
    >,

  targetMarks:
    number
): number {
  if (
    typeof generated
      .markBreakdown
      ?.totalMarks ===
      "number" &&
    Number.isFinite(
      generated
        .markBreakdown
        .totalMarks
    )
  ) {
    return generated
      .markBreakdown
      .totalMarks;
  }

  if (
    typeof generated.marks ===
      "number" &&
    Number.isFinite(
      generated.marks
    )
  ) {
    return generated.marks;
  }

  return targetMarks;
}

function buildSelectionFilters({
  standardFilter,
  thinkingTypeFilter,
  targetMarks,
  paper,
  courseConfig,
}: {
  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  paper:
    Paper;

  courseConfig:
    CourseAssessmentConfig;
}): QuestionSelectionFilters {
  const paperConfig =
    getAssessmentPaperConfig(
      paper,
      courseConfig
    );

  return {
    selectedStandard:
      standardFilter,

    selectedThinkingType:
      thinkingTypeFilter,

    targetMarks,

    targetPaper:
      paper,

    targetPaperSuitabilityTags:
      getCoursePaperSuitabilityTags(
        paperConfig
      ),
  };
}

function buildPaperMismatchMessage({
  skill,
  paper,
  actionText,
  courseConfig,
}: {
  skill:
    Skill;

  paper:
    Paper;

  actionText:
    string;

  courseConfig:
    CourseAssessmentConfig;
}): string {
  return `Paper mismatch: ${skill.code} is typically ${formatAssessmentPaperSuitability(
    skill.paperSuitability,
    courseConfig
  )} but you ${actionText} ${getAssessmentPaperLabel(
    paper,
    courseConfig
  )}.`;
}

function warnIfPaperMismatch({
  skill,
  paper,
  actionText,
  courseConfig,
  pushFlash,
  addQualityNote,
}: {
  skill:
    Skill;

  paper:
    Paper;

  actionText:
    string;

  courseConfig:
    CourseAssessmentConfig;

  pushFlash:
    (
      message: string
    ) => void;

  addQualityNote:
    (
      message: string
    ) => void;
}): void {
  if (
    isAssessmentPaperSuitable({
      paper,

      paperSuitability:
        skill.paperSuitability,

      courseConfig,
    })
  ) {
    return;
  }

  const message =
    buildPaperMismatchMessage({
      skill,
      paper,
      actionText,
      courseConfig,
    });

  pushFlash(
    message
  );

  addQualityNote(
    `• ${message}`
  );
}

export function useAssessmentQuestionDraftGeneration({
  courseConfig,

  standardFilter,
  thinkingTypeFilter,
  targetMarks,

  editDraftRef,

  setDraftByPaper,
  setEditDraftByPaper,
  setViewPaper,

  pendingJumpDraftRef,

  pushFlash,
  addQualityNote,
}: UseAssessmentQuestionDraftGenerationArgs) {
  const courseId =
    courseConfig.courseId;

  const addQuestionToPaper =
    useCallback(
      (
        category:
          string,

        skill:
          Skill,

        concept:
          string,

        difficulty:
          DifficultyLevel,

        paper:
          Paper
      ) => {
        warnIfPaperMismatch({
          skill,
          paper,

          actionText:
            "added it to",

          courseConfig,

          pushFlash,
          addQualityNote,
        });

        const selectionFilters =
          buildSelectionFilters({
            standardFilter,
            thinkingTypeFilter,
            targetMarks,
            paper,
            courseConfig,
          });

        const generated =
          buildGenerated(
            skill,
            concept,
            difficulty,
            selectionFilters
          );

        const conceptMeta =
          getConceptFromSelection(
            skill,
            concept
          );

        const skillLinks =
          buildSkillLinks(
            skill,
            conceptMeta
          );

        const resolvedMarks =
          resolveGeneratedTotalMarks(
            generated,
            targetMarks
          );

        const draft =
          applyAssessmentQuestionSpacingBase({
            id:
              createAssessmentQuestionId(),

            category,

            courseId,

            skillId:
              skill.id,

            skillCode:
              skill.code,

            skillText:
              skill.text,

            skillDomain:
              skill.domain,

            primarySkillId:
              skill.id,

            primaryConceptId:
              conceptMeta?.id,

            supportingSkillIds:
              [],

            skillLinks,

            standardFilter,

            concept,

            conceptId:
              conceptMeta?.id,

            difficulty,

            targetMarks,

            createdAt:
              Date.now(),

            paper,

            ...generated,

            preferredAnswerMethodFamilyId:
              resolvePreferredAnswerMethodFamilyId(
                null,
                generated
              ),

            topicMarkBreakdown:
              generated
                .topicMarkBreakdown ??
              buildSingleTopicMarkBreakdown(
                skill.domain,
                resolvedMarks
              ),
          });

        pendingJumpDraftRef.current = {
          paper,

          draftId:
            draft.id,
        };

        setDraftByPaper(
          (
            previous
          ) => ({
            ...previous,

            [paper]:
              draft,
          })
        );

        setViewPaper(
          (
            previous
          ) =>
            previous ===
            paper
              ? previous
              : paper
        );
      },
      [
        standardFilter,
        thinkingTypeFilter,
        targetMarks,

        courseId,
        courseConfig,

        setDraftByPaper,
        setViewPaper,

        pendingJumpDraftRef,

        pushFlash,
        addQualityNote,
      ]
    );

  const regenerateQuestionToPaper =
    useCallback(
      (
        category:
          string,

        skill:
          Skill,

        concept:
          string,

        difficulty:
          DifficultyLevel,

        paper:
          Paper
      ) => {
        warnIfPaperMismatch({
          skill,
          paper,

          actionText:
            "regenerated it for",

          courseConfig,

          pushFlash,
          addQualityNote,
        });

        const selectionFilters =
          buildSelectionFilters({
            standardFilter,
            thinkingTypeFilter,
            targetMarks,
            paper,
            courseConfig,
          });

        const generated =
          buildGenerated(
            skill,
            concept,
            difficulty,
            selectionFilters
          );

        const conceptMeta =
          getConceptFromSelection(
            skill,
            concept
          );

        const skillLinks =
          buildSkillLinks(
            skill,
            conceptMeta
          );

        const resolvedMarks =
          resolveGeneratedTotalMarks(
            generated,
            targetMarks
          );

        const activeEdit =
          editDraftRef.current[
            paper
          ];

        if (
          activeEdit
        ) {
          setEditDraftByPaper(
            (
              previous
            ) => {
              const currentEdit =
                previous[
                  paper
                ];

              if (
                !currentEdit
              ) {
                return previous;
              }

              const nextDraft =
                applyAssessmentQuestionSpacingBase({
                  ...currentEdit.draft,

                  category,

                  courseId,

                  skillId:
                    skill.id,

                  skillCode:
                    skill.code,

                  skillText:
                    skill.text,

                  skillDomain:
                    skill.domain,

                  primarySkillId:
                    skill.id,

                  primaryConceptId:
                    conceptMeta?.id,

                  supportingSkillIds:
                    [],

                  skillLinks,

                  standardFilter,

                  concept,

                  conceptId:
                    conceptMeta?.id,

                  difficulty,

                  targetMarks,

                  createdAt:
                    Date.now(),

                  paper,

                  ...generated,

                  preferredAnswerMethodFamilyId:
                    resolvePreferredAnswerMethodFamilyId(
                      currentEdit.draft,
                      generated
                    ),

                  topicMarkBreakdown:
                    generated
                      .topicMarkBreakdown ??
                    buildSingleTopicMarkBreakdown(
                      skill.domain,
                      resolvedMarks
                    ),
                });

              pendingJumpDraftRef.current = {
                paper,

                draftId:
                  nextDraft.id,
              };

              return {
                ...previous,

                [paper]: {
                  ...currentEdit,

                  draft:
                    nextDraft,
                },
              };
            }
          );

          setViewPaper(
            (
              previous
            ) =>
              previous ===
              paper
                ? previous
                : paper
          );

          return;
        }

        setDraftByPaper(
          (
            previous
          ) => {
            const nextDraft =
              applyAssessmentQuestionSpacingBase({
                id:
                  previous[
                    paper
                  ]?.id ??
                  createAssessmentQuestionId(),

                category,

                courseId,

                skillId:
                  skill.id,

                skillCode:
                  skill.code,

                skillText:
                  skill.text,

                skillDomain:
                  skill.domain,

                primarySkillId:
                  skill.id,

                primaryConceptId:
                  conceptMeta?.id,

                supportingSkillIds:
                  [],

                skillLinks,

                standardFilter,

                concept,

                conceptId:
                  conceptMeta?.id,

                difficulty,

                targetMarks,

                createdAt:
                  Date.now(),

                paper,

                ...generated,

                preferredAnswerMethodFamilyId:
                  resolvePreferredAnswerMethodFamilyId(
                    previous[
                      paper
                    ],
                    generated
                  ),

                topicMarkBreakdown:
                  generated
                    .topicMarkBreakdown ??
                  buildSingleTopicMarkBreakdown(
                    skill.domain,
                    resolvedMarks
                  ),
              });

            pendingJumpDraftRef.current = {
              paper,

              draftId:
                nextDraft.id,
            };

            return {
              ...previous,

              [paper]:
                nextDraft,
            };
          }
        );

        setViewPaper(
          (
            previous
          ) =>
            previous ===
            paper
              ? previous
              : paper
        );
      },
      [
        standardFilter,
        thinkingTypeFilter,
        targetMarks,

        courseId,
        courseConfig,

        editDraftRef,

        setEditDraftByPaper,
        setDraftByPaper,
        setViewPaper,

        pendingJumpDraftRef,

        pushFlash,
        addQualityNote,
      ]
    );

  return {
    addQuestionToPaper,
    regenerateQuestionToPaper,
  };
}