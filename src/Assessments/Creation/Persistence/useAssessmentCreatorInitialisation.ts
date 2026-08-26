"use client";

import {
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/course-data/course-configs/CourseConfigTypes";

import type {
  Paper,
  Question,
} from "@/shared-types/AssessmentTypes";

import {
  normaliseAssessmentDisplayDate,
  getTodayAssessmentDisplayDate,
} from "../AssessmentSettings/AssessmentDateTime";

import {
  ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT,
  ASSESSMENT_WORKSPACE_MAX_LEFT_PANE_RATIO,
  ASSESSMENT_WORKSPACE_MIN_LEFT_PANE_RATIO,
} from "../PaperWorkspace/AssessmentWorkspaceLayout";

import {
  buildAssessmentTargetMarksByPaperFromSetupTargets,
  getInitialAssessmentPaperForStructure,
  type AssessmentTargetMarksByPaper,
} from "../Papers/AssessmentPaperTargets";

import {
  getAssessmentQuestionSpacingBasePx,
} from "../Questions/AssessmentQuestionSpacing";

import {
  loadAssessmentSetupBrief,
} from "../Setup/AssessmentSetupStorage";

import {
  ASSESSMENT_CREATION_STORAGE_KEY_PAIRS,
  readAssessmentCreationStorageValue,
} from "./AssessmentCreationStorageKeys";

type StringSetter =
  Dispatch<
    SetStateAction<string>
  >;

type BooleanSetter =
  Dispatch<
    SetStateAction<boolean>
  >;

type UseAssessmentCreatorInitialisationArgs = {
  courseConfig:
    CourseAssessmentConfig;

  setLeftPaneRatio:
    Dispatch<
      SetStateAction<number>
    >;

  setHudHeight:
    Dispatch<
      SetStateAction<number>
    >;

  setShowProgressPanel:
    BooleanSetter;

  setIncludeCoverSheet:
    BooleanSetter;

  setShowCoverDateTime:
    BooleanSetter;

  setShowScottishCandidateNumberBox:
    BooleanSetter;

  setIncludeFormulaSheet:
    BooleanSetter;

  setAssessmentName:
    StringSetter;

  setClassName:
    StringSetter;

  setAssessmentDate:
    StringSetter;

  setP2CoverDate:
    StringSetter;

  setCreatedAt:
    Dispatch<
      SetStateAction<number>
    >;

  setP1StartTime:
    StringSetter;

  setP1EndTime:
    StringSetter;

  setP2StartTime:
    StringSetter;

  setP2EndTime:
    StringSetter;

  setP2DateCustom:
    BooleanSetter;

  setP1EndTimeManuallyEdited:
    BooleanSetter;

  setP2EndTimeManuallyEdited:
    BooleanSetter;

  setActivePaper:
    Dispatch<
      SetStateAction<Paper>
    >;

  setViewPaper:
    Dispatch<
      SetStateAction<Paper>
    >;

  setTargetMarksByPaper:
    (
      value:
        AssessmentTargetMarksByPaper
    ) => void;

  setQuestions:
    Dispatch<
      SetStateAction<
        Question[]
      >
    >;
};

function clampNumber(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

function createAssessmentQuestionId(): string {
  /*
   * Preserve the historical ID format.
   */
  return (
    Math.random()
      .toString(16)
      .slice(2) +
    Date.now()
      .toString(16)
  );
}

function ensureQuestionSpacingBase(
  question: Question
): Question {
  if (
    typeof question.spacingBasePx ===
      "number" &&
    Number.isFinite(
      question.spacingBasePx
    )
  ) {
    return question;
  }

  return {
    ...question,

    spacingBasePx:
      getAssessmentQuestionSpacingBasePx(
        question
      ),
  };
}

function ensureUniqueQuestionIds(
  questions: Question[]
): Question[] {
  const usedIds =
    new Set<string>();

  return questions.map(
    (
      question
    ) => {
      const existingId =
        typeof question.id ===
          "string"
          ? question.id.trim()
          : "";

      if (
        existingId &&
        !usedIds.has(
          existingId
        )
      ) {
        usedIds.add(
          existingId
        );

        return ensureQuestionSpacingBase(
          question
        );
      }

      let replacementId =
        createAssessmentQuestionId();

      while (
        usedIds.has(
          replacementId
        )
      ) {
        replacementId =
          createAssessmentQuestionId();
      }

      usedIds.add(
        replacementId
      );

      return ensureQuestionSpacingBase({
        ...question,

        id:
          replacementId,
      });
    }
  );
}

export function useAssessmentCreatorInitialisation({
  courseConfig,

  setLeftPaneRatio,
  setHudHeight,
  setShowProgressPanel,

  setIncludeCoverSheet,
  setShowCoverDateTime,
  setShowScottishCandidateNumberBox,
  setIncludeFormulaSheet,

  setAssessmentName,
  setClassName,
  setAssessmentDate,

  setP2CoverDate,
  setCreatedAt,

  setP1StartTime,
  setP1EndTime,

  setP2StartTime,
  setP2EndTime,

  setP2DateCustom,

  setP1EndTimeManuallyEdited,
  setP2EndTimeManuallyEdited,

  setActivePaper,
  setViewPaper,

  setTargetMarksByPaper,

  setQuestions,
}: UseAssessmentCreatorInitialisationArgs) {
  /*
   * Restore historical Assessment Creator
   * browser storage.
   */
  useEffect(() => {
    try {
      const rawPaneRatio =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .paneRatio
        );

      if (
        rawPaneRatio
      ) {
        const parsed =
          Number(
            rawPaneRatio
          );

        if (
          Number.isFinite(
            parsed
          )
        ) {
          setLeftPaneRatio(
            clampNumber(
              parsed,
              ASSESSMENT_WORKSPACE_MIN_LEFT_PANE_RATIO,
              ASSESSMENT_WORKSPACE_MAX_LEFT_PANE_RATIO
            )
          );
        }
      }

      const rawHudHeight =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .hudHeight
        );

      if (
        rawHudHeight
      ) {
        const parsed =
          Number(
            rawHudHeight
          );

        if (
          Number.isFinite(
            parsed
          )
        ) {
          /*
           * Preserve the historical initial
           * hydration bounds.
           */
          setHudHeight(
            clampNumber(
              parsed,
              ASSESSMENT_WORKSPACE_DEFAULT_HUD_HEIGHT,
              280
            )
          );
        }
      }

      const rawShowProgressPanel =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .showProgressPanel
        );

      if (
        rawShowProgressPanel ===
        "true"
      ) {
        setShowProgressPanel(
          true
        );
      }

      if (
        rawShowProgressPanel ===
        "false"
      ) {
        setShowProgressPanel(
          false
        );
      }

      const rawIncludeCoverSheet =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .includeCoverSheet
        );

      if (
        rawIncludeCoverSheet ===
        "true"
      ) {
        setIncludeCoverSheet(
          true
        );
      }

      if (
        rawIncludeCoverSheet ===
        "false"
      ) {
        setIncludeCoverSheet(
          false
        );
      }

      const rawShowCoverDateTime =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .showCoverDateTime
        );

      if (
        rawShowCoverDateTime ===
        "true"
      ) {
        setShowCoverDateTime(
          true
        );
      }

      if (
        rawShowCoverDateTime ===
        "false"
      ) {
        setShowCoverDateTime(
          false
        );
      }

      const rawShowScnBox =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .showScottishCandidateNumberBox
        );

      if (
        rawShowScnBox ===
        "true"
      ) {
        setShowScottishCandidateNumberBox(
          true
        );
      }

      if (
        rawShowScnBox ===
        "false"
      ) {
        setShowScottishCandidateNumberBox(
          false
        );
      }

      const rawIncludeFormulaSheet =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .includeFormulaSheet
        );

      if (
        rawIncludeFormulaSheet ===
        "true"
      ) {
        setIncludeFormulaSheet(
          true
        );
      }

      if (
        rawIncludeFormulaSheet ===
        "false"
      ) {
        setIncludeFormulaSheet(
          false
        );
      }

      const storedAssessmentName =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .metaName
        );

      const storedClassName =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .metaClass
        );

      const storedAssessmentDate =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .metaAssessmentDate
        );

      const storedP1CoverDate =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p1CoverDate
        );

      const storedP2CoverDate =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p2CoverDate
        );

      if (
        storedAssessmentName !==
        null
      ) {
        setAssessmentName(
          storedAssessmentName
        );
      }

      if (
        storedClassName !==
        null
      ) {
        setClassName(
          storedClassName
        );
      }

      const initialAssessmentDate =
        normaliseAssessmentDisplayDate(
          storedAssessmentDate ||
            storedP1CoverDate ||
            ""
        );

      if (
        initialAssessmentDate
      ) {
        setAssessmentDate(
          initialAssessmentDate
        );
      }

      const normalisedP2Date =
        normaliseAssessmentDisplayDate(
          storedP2CoverDate ||
            ""
        );

      if (
        normalisedP2Date
      ) {
        setP2CoverDate(
          normalisedP2Date
        );
      }

      const storedP1StartTime =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p1StartTime
        );

      const storedP1EndTime =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p1EndTime
        );

      const storedP2StartTime =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p2StartTime
        );

      const storedP2EndTime =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p2EndTime
        );

      const storedP2DateCustom =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .p2DateCustom
        );

      if (
        storedP1StartTime !==
        null
      ) {
        setP1StartTime(
          storedP1StartTime
        );
      }

      if (
        storedP1EndTime !==
        null
      ) {
        setP1EndTime(
          storedP1EndTime
        );

        if (
          storedP1EndTime.trim()
        ) {
          setP1EndTimeManuallyEdited(
            true
          );
        }
      }

      if (
        storedP2StartTime !==
        null
      ) {
        setP2StartTime(
          storedP2StartTime
        );
      }

      if (
        storedP2EndTime !==
        null
      ) {
        setP2EndTime(
          storedP2EndTime
        );

        if (
          storedP2EndTime.trim()
        ) {
          setP2EndTimeManuallyEdited(
            true
          );
        }
      }

      if (
        storedP2DateCustom ===
        "true"
      ) {
        setP2DateCustom(
          true
        );
      }
    } catch {
      /*
       * Corrupt browser state must never
       * prevent Assessment Creation loading.
       */
    }
  }, [
    setAssessmentDate,
    setAssessmentName,
    setClassName,

    setHudHeight,
    setIncludeCoverSheet,
    setIncludeFormulaSheet,
    setLeftPaneRatio,

    setP1EndTime,
    setP1EndTimeManuallyEdited,
    setP1StartTime,

    setP2CoverDate,
    setP2DateCustom,
    setP2EndTime,
    setP2EndTimeManuallyEdited,
    setP2StartTime,

    setShowCoverDateTime,
    setShowProgressPanel,
    setShowScottishCandidateNumberBox,
  ]);

  /*
   * Apply the Setup-screen handoff.
   */
  useEffect(() => {
    const brief =
      loadAssessmentSetupBrief();

    if (
      !brief
    ) {
      return;
    }

    setIncludeCoverSheet(
      brief.includeCoverSheet
    );

    setIncludeFormulaSheet(
      brief.includeFormulaSheet
    );

    setAssessmentName(
      (
        previous
      ) =>
        previous !==
        "[Untitled file]"
          ? previous
          : brief.assessmentName &&
              brief.assessmentName
                .trim()
                .length
            ? brief.assessmentName
            : "[Untitled file]"
    );

    setClassName(
      (
        previous
      ) =>
        previous
          .trim()
          .length
          ? previous
          : brief.className ??
            ""
    );

    const briefDate =
      normaliseAssessmentDisplayDate(
        brief.assessmentDate ||
          ""
      );

    if (
      briefDate
    ) {
      setAssessmentDate(
        (
          previous
        ) =>
          previous &&
          previous !==
            getTodayAssessmentDisplayDate()
            ? previous
            : briefDate
      );

      setP2CoverDate(
        (
          previous
        ) =>
          previous &&
          previous !==
            getTodayAssessmentDisplayDate()
            ? previous
            : briefDate
      );
    }

    setCreatedAt(
      typeof brief.createdAt ===
        "number" &&
      Number.isFinite(
        brief.createdAt
      )
        ? brief.createdAt
        : Date.now()
    );

    const initialPaper =
      getInitialAssessmentPaperForStructure({
        paperStructure:
          brief.paperStructure,

        courseConfig,
      });

    setActivePaper(
      initialPaper
    );

    setViewPaper(
      initialPaper
    );

    setTargetMarksByPaper(
      buildAssessmentTargetMarksByPaperFromSetupTargets({
        buildPriority:
          brief.buildPriority,

        marksTargetP1:
          brief.marksTargetP1,

        marksTargetP2:
          brief.marksTargetP2,

        timeTargetP1:
          brief.timeTargetP1,

        timeTargetP2:
          brief.timeTargetP2,

        courseConfig,
      })
    );
  }, [
    courseConfig,

    setActivePaper,
    setAssessmentDate,
    setAssessmentName,
    setClassName,
    setCreatedAt,

    setIncludeCoverSheet,
    setIncludeFormulaSheet,

    setP2CoverDate,

    setTargetMarksByPaper,
    setViewPaper,
  ]);

  /*
   * Restore the historical lightweight
   * locally persisted question collection.
   */
  useEffect(() => {
    try {
      const raw =
        readAssessmentCreationStorageValue(
          ASSESSMENT_CREATION_STORAGE_KEY_PAIRS
            .state
        );

      if (
        !raw
      ) {
        return;
      }

      const parsed =
        JSON.parse(
          raw
        ) as {
          questions?:
            Question[];
        };

      if (
        !Array.isArray(
          parsed.questions
        )
      ) {
        return;
      }

      setQuestions(
        ensureUniqueQuestionIds(
          parsed.questions
        )
      );
    } catch {
      /*
       * Corrupt historical question state
       * is ignored.
       */
    }
  }, [
    setQuestions,
  ]);
}