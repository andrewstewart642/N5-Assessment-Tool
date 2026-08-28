import {
  DEFAULT_COURSE_ID,
  findCourseAssessmentConfigById,
  getDefaultCourseAssessmentConfig,
} from "@/app/Courses/CourseRegistry";

import type {
  AssessmentPaperBooleanMap,
  AssessmentPaperNumberMap,
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/PaperSpecificValues";

import {
  createSavedAssessmentCourseIdentity,
  resolveSavedAssessmentCourseIdentity,
} from "./CourseIdentity";

import type {
  SavedAssessment,
} from "./SavedAssessment";

const SAVED_ASSESSMENTS_STORAGE_KEY =
  "assessment_builder_saved_assessments_v1";

const CURRENT_ASSESSMENT_ID_STORAGE_KEY =
  "assessment_builder_current_assessment_id_v1";

const LEGACY_SAVED_ASSESSMENTS_STORAGE_KEY =
  "n5-saved-assessments";

const LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY =
  "n5-current-assessment-id";

function makeAssessmentId(): string {
  return `assessment-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function sortAssessments(
  items: SavedAssessment[]
): SavedAssessment[] {
  return [
    ...items,
  ].sort(
    (
      first,
      second
    ) =>
      second.updatedAt -
      first.updatedAt
  );
}

function readStorageWithLegacyFallback({
  currentKey,
  legacyKey,
}: {
  currentKey:
    string;

  legacyKey:
    string;
}): string | null {
  if (
    typeof window ===
      "undefined"
  ) {
    return null;
  }

  const currentValue =
    window.localStorage.getItem(
      currentKey
    );

  if (
    currentValue !==
      null
  ) {
    return currentValue;
  }

  const legacyValue =
    window.localStorage.getItem(
      legacyKey
    );

  if (
    legacyValue ===
      null
  ) {
    return null;
  }

  window.localStorage.setItem(
    currentKey,
    legacyValue
  );

  return legacyValue;
}

function isPlainRecord(
  value: unknown
): value is Record<
  string,
  unknown
> {
  return (
    value !== null &&
    typeof value ===
      "object" &&
    !Array.isArray(
      value
    )
  );
}

function readFiniteNumber(
  value: unknown,
  fallback: number
): number {
  return (
    typeof value ===
      "number" &&
    Number.isFinite(
      value
    )
  )
    ? value
    : fallback;
}

function readString(
  value: unknown,
  fallback = ""
): string {
  return typeof value ===
    "string"
    ? value
    : fallback;
}

function readBoolean(
  value: unknown,
  fallback = false
): boolean {
  return typeof value ===
    "boolean"
    ? value
    : fallback;
}

function normaliseNumberMap(
  value: unknown
): AssessmentPaperNumberMap {
  if (
    !isPlainRecord(
      value
    )
  ) {
    return {};
  }

  return Object.entries(
    value
  ).reduce<AssessmentPaperNumberMap>(
    (
      normalised,
      [
        paper,
        paperValue,
      ]
    ) => {
      if (
        typeof paperValue ===
          "number" &&
        Number.isFinite(
          paperValue
        )
      ) {
        normalised[
          paper
        ] =
          paperValue;
      }

      return normalised;
    },
    {}
  );
}

function normaliseStringMap(
  value: unknown
): AssessmentPaperStringMap {
  if (
    !isPlainRecord(
      value
    )
  ) {
    return {};
  }

  return Object.entries(
    value
  ).reduce<AssessmentPaperStringMap>(
    (
      normalised,
      [
        paper,
        paperValue,
      ]
    ) => {
      if (
        typeof paperValue ===
          "string"
      ) {
        normalised[
          paper
        ] =
          paperValue;
      }

      return normalised;
    },
    {}
  );
}

function normaliseBooleanMap(
  value: unknown
): AssessmentPaperBooleanMap {
  if (
    !isPlainRecord(
      value
    )
  ) {
    return {};
  }

  return Object.entries(
    value
  ).reduce<AssessmentPaperBooleanMap>(
    (
      normalised,
      [
        paper,
        paperValue,
      ]
    ) => {
      if (
        typeof paperValue ===
          "boolean"
      ) {
        normalised[
          paper
        ] =
          paperValue;
      }

      return normalised;
    },
    {}
  );
}

function getDefaultTargetMarksForPaper({
  courseId,
  paper,
  fallback,
}: {
  courseId:
    SavedAssessment["setup"]["courseId"];

  paper:
    string;

  fallback:
    number;
}): number {
  const courseConfig =
    courseId
      ? findCourseAssessmentConfigById(
          courseId
        ) ??
        getDefaultCourseAssessmentConfig()
      : getDefaultCourseAssessmentConfig();

  const paperConfig =
    courseConfig.papers.find(
      (
        coursePaper
      ) =>
        coursePaper.id ===
        paper
    );

  return (
    paperConfig
      ?.defaultTargetMarks ??
    fallback
  );
}

function normaliseSavedAssessment(
  candidate: unknown
): SavedAssessment | null {
  if (
    !candidate ||
    typeof candidate !==
      "object"
  ) {
    return null;
  }

  const item =
    candidate as Partial<SavedAssessment>;

  if (
    typeof item.id !==
      "string" ||
    typeof item.status !==
      "string" ||
    typeof item.createdAt !==
      "number" ||
    typeof item.updatedAt !==
      "number" ||
    typeof item.isPinned !==
      "boolean" ||
    !item.setup ||
    typeof item.setup !==
      "object" ||
    !item.builder ||
    typeof item.builder !==
      "object"
  ) {
    return null;
  }

  const setup =
    item.setup as SavedAssessment["setup"];

  const courseIdentity =
    resolveSavedAssessmentCourseIdentity({
      courseId:
        setup.courseId,

      courseIdentityVersion:
        setup.courseIdentityVersion,
    });

  const builder =
    item.builder as Partial<
      SavedAssessment["builder"]
    >;

  const existingTargetMarksByPaper =
    normaliseNumberMap(
      builder.targetMarksByPaper
    );

  const p1Target =
    readFiniteNumber(
      existingTargetMarksByPaper
        .P1 ??
        builder.p1Target,

      getDefaultTargetMarksForPaper({
        courseId:
          courseIdentity.courseId,

        paper:
          "P1",

        fallback:
          40,
      })
    );

  const p2Target =
    readFiniteNumber(
      existingTargetMarksByPaper
        .P2 ??
        builder.p2Target,

      getDefaultTargetMarksForPaper({
        courseId:
          courseIdentity.courseId,

        paper:
          "P2",

        fallback:
          50,
      })
    );

  const targetMarksByPaper:
    AssessmentPaperNumberMap = {
      P1:
        p1Target,

      P2:
        p2Target,

      ...existingTargetMarksByPaper,
    };

  const assessmentDate =
    readString(
      builder.assessmentDate,

      readString(
        setup.assessmentDate
      )
    );

  const existingCoverDateByPaper =
    normaliseStringMap(
      builder.coverDateByPaper
    );

  const existingStartTimeByPaper =
    normaliseStringMap(
      builder.startTimeByPaper
    );

  const existingEndTimeByPaper =
    normaliseStringMap(
      builder.endTimeByPaper
    );

  const existingCoverDateCustomByPaper =
    normaliseBooleanMap(
      builder.coverDateCustomByPaper
    );

  const p1StartTime =
    readString(
      existingStartTimeByPaper
        .P1 ??
        builder.p1StartTime
    );

  const p1EndTime =
    readString(
      existingEndTimeByPaper
        .P1 ??
        builder.p1EndTime
    );

  const p2DateCustom =
    readBoolean(
      existingCoverDateCustomByPaper
        .P2 ??
        builder.p2DateCustom
    );

  const p2CoverDate =
    readString(
      existingCoverDateByPaper
        .P2 ??
        builder.p2CoverDate,

      assessmentDate
    );

  const p2StartTime =
    readString(
      existingStartTimeByPaper
        .P2 ??
        builder.p2StartTime
    );

  const p2EndTime =
    readString(
      existingEndTimeByPaper
        .P2 ??
        builder.p2EndTime
    );

  const coverDateByPaper:
    AssessmentPaperStringMap = {
      P1:
        assessmentDate,

      P2:
        p2DateCustom
          ? p2CoverDate
          : assessmentDate,

      ...existingCoverDateByPaper,
    };

  const startTimeByPaper:
    AssessmentPaperStringMap = {
      P1:
        p1StartTime,

      P2:
        p2StartTime,

      ...existingStartTimeByPaper,
    };

  const endTimeByPaper:
    AssessmentPaperStringMap = {
      P1:
        p1EndTime,

      P2:
        p2EndTime,

      ...existingEndTimeByPaper,
    };

  const coverDateCustomByPaper:
    AssessmentPaperBooleanMap = {
      P1:
        false,

      P2:
        p2DateCustom,

      ...existingCoverDateCustomByPaper,
    };

  return {
    ...(
      item as SavedAssessment
    ),

    setup: {
      ...setup,
      ...courseIdentity,
    },

    builder: {
      ...(
        builder as SavedAssessment["builder"]
      ),

      targetMarksByPaper,

      p1Target,
      p2Target,

      assessmentDate,

      coverDateByPaper,
      startTimeByPaper,
      endTimeByPaper,
      coverDateCustomByPaper,

      p1StartTime,
      p1EndTime,

      p2CoverDate,
      p2StartTime,
      p2EndTime,
      p2DateCustom,
    },
  };
}

export function loadSavedAssessments(): SavedAssessment[] {
  if (
    typeof window ===
      "undefined"
  ) {
    return [];
  }

  try {
    const raw =
      readStorageWithLegacyFallback({
        currentKey:
          SAVED_ASSESSMENTS_STORAGE_KEY,

        legacyKey:
          LEGACY_SAVED_ASSESSMENTS_STORAGE_KEY,
      });

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(
        raw
      ) as unknown;

    if (
      !Array.isArray(
        parsed
      )
    ) {
      return [];
    }

    const safeAssessments =
      parsed
        .map(
          normaliseSavedAssessment
        )
        .filter(
          (
            item
          ): item is SavedAssessment =>
            item !== null
        );

    return sortAssessments(
      safeAssessments
    );
  } catch {
    return [];
  }
}

export function saveSavedAssessments(
  items: SavedAssessment[]
) {
  if (
    typeof window ===
      "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    SAVED_ASSESSMENTS_STORAGE_KEY,

    JSON.stringify(
      sortAssessments(
        items
      )
    )
  );
}

export function loadSavedAssessmentById(
  assessmentId: string
): SavedAssessment | null {
  const allAssessments =
    loadSavedAssessments();

  return (
    allAssessments.find(
      (
        item
      ) =>
        item.id ===
        assessmentId
    ) ??
    null
  );
}

export function upsertSavedAssessment(
  assessment: SavedAssessment
) {
  const allAssessments =
    loadSavedAssessments();

  const existingIndex =
    allAssessments.findIndex(
      (
        item
      ) =>
        item.id ===
        assessment.id
    );

  if (
    existingIndex ===
      -1
  ) {
    saveSavedAssessments([
      ...allAssessments,
      assessment,
    ]);

    return;
  }

  const next = [
    ...allAssessments,
  ];

  next[
    existingIndex
  ] =
    assessment;

  saveSavedAssessments(
    next
  );
}

export function createSavedAssessmentDraft(
  input: Omit<
    SavedAssessment,
    | "id"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "isPinned"
  >
): SavedAssessment {
  const now =
    Date.now();

  const courseIdentity =
    createSavedAssessmentCourseIdentity(
      input.setup.courseId ??
        DEFAULT_COURSE_ID
    );

  const nextAssessment:
    SavedAssessment = {
      id:
        makeAssessmentId(),

      status:
        "DRAFT",

      isPinned:
        false,

      createdAt:
        now,

      updatedAt:
        now,

      setup: {
        ...input.setup,
        ...courseIdentity,
      },

      builder:
        input.builder,
    };

  upsertSavedAssessment(
    nextAssessment
  );

  return nextAssessment;
}

export function deleteSavedAssessment(
  assessmentId: string
) {
  const allAssessments =
    loadSavedAssessments();

  const next =
    allAssessments.filter(
      (
        item
      ) =>
        item.id !==
        assessmentId
    );

  saveSavedAssessments(
    next
  );

  const currentAssessmentId =
    getCurrentSavedAssessmentId();

  if (
    currentAssessmentId ===
      assessmentId
  ) {
    clearCurrentSavedAssessmentId();
  }
}

export function setCurrentSavedAssessmentId(
  assessmentId: string
) {
  if (
    typeof window ===
      "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    CURRENT_ASSESSMENT_ID_STORAGE_KEY,
    assessmentId
  );
}

export function getCurrentSavedAssessmentId(): string | null {
  if (
    typeof window ===
      "undefined"
  ) {
    return null;
  }

  return readStorageWithLegacyFallback({
    currentKey:
      CURRENT_ASSESSMENT_ID_STORAGE_KEY,

    legacyKey:
      LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY,
  });
}

export function clearCurrentSavedAssessmentId() {
  if (
    typeof window ===
      "undefined"
  ) {
    return;
  }

  window.localStorage.removeItem(
    CURRENT_ASSESSMENT_ID_STORAGE_KEY
  );

  window.localStorage.removeItem(
    LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY
  );
}
