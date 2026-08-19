import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";

import type { SavedAssessment } from "../types/SavedAssessment";
import type {
  BuilderPaperBooleanMap,
  BuilderPaperNumberMap,
  BuilderPaperStringMap,
} from "@/app/create-assessment/builder/builder-logic/BuilderPaperStateMaps";

const SAVED_ASSESSMENTS_STORAGE_KEY = "assessment_builder_saved_assessments_v1";
const CURRENT_ASSESSMENT_ID_STORAGE_KEY =
  "assessment_builder_current_assessment_id_v1";

const LEGACY_SAVED_ASSESSMENTS_STORAGE_KEY = "n5-saved-assessments";
const LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY = "n5-current-assessment-id";

function makeAssessmentId(): string {
  return `assessment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortAssessments(items: SavedAssessment[]): SavedAssessment[] {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt);
}

function readStorageWithLegacyFallback(args: {
  currentKey: string;
  legacyKey: string;
}): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(args.currentKey);
  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(args.legacyKey);
  if (legacyValue === null) return null;

  window.localStorage.setItem(args.currentKey, legacyValue);
  return legacyValue;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readFiniteNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normaliseNumberMap(value: unknown): BuilderPaperNumberMap {
  if (!isPlainRecord(value)) return {};

  return Object.entries(value).reduce<BuilderPaperNumberMap>(
    (normalised, [paper, paperValue]) => {
      if (typeof paperValue === "number" && Number.isFinite(paperValue)) {
        normalised[paper] = paperValue;
      }

      return normalised;
    },
    {}
  );
}

function normaliseStringMap(value: unknown): BuilderPaperStringMap {
  if (!isPlainRecord(value)) return {};

  return Object.entries(value).reduce<BuilderPaperStringMap>(
    (normalised, [paper, paperValue]) => {
      if (typeof paperValue === "string") {
        normalised[paper] = paperValue;
      }

      return normalised;
    },
    {}
  );
}

function normaliseBooleanMap(value: unknown): BuilderPaperBooleanMap {
  if (!isPlainRecord(value)) return {};

  return Object.entries(value).reduce<BuilderPaperBooleanMap>(
    (normalised, [paper, paperValue]) => {
      if (typeof paperValue === "boolean") {
        normalised[paper] = paperValue;
      }

      return normalised;
    },
    {}
  );
}

function getDefaultTargetMarksForPaper(paper: string, fallback: number): number {
  const paperConfig = ACTIVE_COURSE_CONFIG.papers.find(
    (coursePaper) => coursePaper.id === paper
  );

  return paperConfig?.defaultTargetMarks ?? fallback;
}

function normaliseSavedAssessment(candidate: unknown): SavedAssessment | null {
  if (!candidate || typeof candidate !== "object") return null;

  const item = candidate as Partial<SavedAssessment>;

  if (
    typeof item.id !== "string" ||
    typeof item.status !== "string" ||
    typeof item.createdAt !== "number" ||
    typeof item.updatedAt !== "number" ||
    typeof item.isPinned !== "boolean" ||
    !item.setup ||
    typeof item.setup !== "object" ||
    !item.builder ||
    typeof item.builder !== "object"
  ) {
    return null;
  }

  const setup = item.setup as SavedAssessment["setup"];
  const builder = item.builder as Partial<SavedAssessment["builder"]>;

  const existingTargetMarksByPaper = normaliseNumberMap(
    builder.targetMarksByPaper
  );

  const p1Target = readFiniteNumber(
    existingTargetMarksByPaper.P1 ?? builder.p1Target,
    getDefaultTargetMarksForPaper("P1", 40)
  );

  const p2Target = readFiniteNumber(
    existingTargetMarksByPaper.P2 ?? builder.p2Target,
    getDefaultTargetMarksForPaper("P2", 50)
  );

  const targetMarksByPaper: BuilderPaperNumberMap = {
    P1: p1Target,
    P2: p2Target,
    ...existingTargetMarksByPaper,
  };

  const assessmentDate = readString(
    builder.assessmentDate,
    readString(setup.assessmentDate)
  );

  const existingCoverDateByPaper = normaliseStringMap(builder.coverDateByPaper);
  const existingStartTimeByPaper = normaliseStringMap(builder.startTimeByPaper);
  const existingEndTimeByPaper = normaliseStringMap(builder.endTimeByPaper);
  const existingCoverDateCustomByPaper = normaliseBooleanMap(
    builder.coverDateCustomByPaper
  );

  const p1StartTime = readString(
    existingStartTimeByPaper.P1 ?? builder.p1StartTime
  );

  const p1EndTime = readString(existingEndTimeByPaper.P1 ?? builder.p1EndTime);

  const p2DateCustom = readBoolean(
    existingCoverDateCustomByPaper.P2 ?? builder.p2DateCustom
  );

  const p2CoverDate = readString(
    existingCoverDateByPaper.P2 ?? builder.p2CoverDate,
    assessmentDate
  );

  const p2StartTime = readString(
    existingStartTimeByPaper.P2 ?? builder.p2StartTime
  );

  const p2EndTime = readString(existingEndTimeByPaper.P2 ?? builder.p2EndTime);

  const coverDateByPaper: BuilderPaperStringMap = {
    P1: assessmentDate,
    P2: p2DateCustom ? p2CoverDate : assessmentDate,
    ...existingCoverDateByPaper,
  };

  const startTimeByPaper: BuilderPaperStringMap = {
    P1: p1StartTime,
    P2: p2StartTime,
    ...existingStartTimeByPaper,
  };

  const endTimeByPaper: BuilderPaperStringMap = {
    P1: p1EndTime,
    P2: p2EndTime,
    ...existingEndTimeByPaper,
  };

  const coverDateCustomByPaper: BuilderPaperBooleanMap = {
    P1: false,
    P2: p2DateCustom,
    ...existingCoverDateCustomByPaper,
  };

  return {
    ...(item as SavedAssessment),
    setup: {
      ...setup,

      /**
       * Backwards compatibility:
       *
       * saved assessments created before the course-config refactor will not
       * have a courseId. For now, those assessments are treated as the active
       * course because N5 Maths is currently the only complete course config.
       */
      courseId: setup.courseId ?? ACTIVE_COURSE_CONFIG.courseId,
    },
    builder: {
      ...(builder as SavedAssessment["builder"]),

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
  if (typeof window === "undefined") return [];

  try {
    const raw = readStorageWithLegacyFallback({
      currentKey: SAVED_ASSESSMENTS_STORAGE_KEY,
      legacyKey: LEGACY_SAVED_ASSESSMENTS_STORAGE_KEY,
    });

    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const safeAssessments = parsed
      .map(normaliseSavedAssessment)
      .filter((item): item is SavedAssessment => item !== null);

    return sortAssessments(safeAssessments);
  } catch {
    return [];
  }
}

export function saveSavedAssessments(items: SavedAssessment[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    SAVED_ASSESSMENTS_STORAGE_KEY,
    JSON.stringify(sortAssessments(items))
  );
}

export function loadSavedAssessmentById(
  assessmentId: string
): SavedAssessment | null {
  const allAssessments = loadSavedAssessments();
  return allAssessments.find((item) => item.id === assessmentId) ?? null;
}

export function upsertSavedAssessment(assessment: SavedAssessment) {
  const allAssessments = loadSavedAssessments();
  const existingIndex = allAssessments.findIndex(
    (item) => item.id === assessment.id
  );

  if (existingIndex === -1) {
    saveSavedAssessments([...allAssessments, assessment]);
    return;
  }

  const next = [...allAssessments];
  next[existingIndex] = assessment;
  saveSavedAssessments(next);
}

export function createSavedAssessmentDraft(
  input: Omit<
    SavedAssessment,
    "id" | "status" | "createdAt" | "updatedAt" | "isPinned"
  >
): SavedAssessment {
  const now = Date.now();

  const nextAssessment: SavedAssessment = {
    id: makeAssessmentId(),
    status: "DRAFT",
    isPinned: false,
    createdAt: now,
    updatedAt: now,
    setup: {
      ...input.setup,
      courseId: input.setup.courseId ?? ACTIVE_COURSE_CONFIG.courseId,
    },
    builder: input.builder,
  };

  upsertSavedAssessment(nextAssessment);
  return nextAssessment;
}

export function deleteSavedAssessment(assessmentId: string) {
  const allAssessments = loadSavedAssessments();
  const next = allAssessments.filter((item) => item.id !== assessmentId);
  saveSavedAssessments(next);

  const currentAssessmentId = getCurrentSavedAssessmentId();

  if (currentAssessmentId === assessmentId) {
    clearCurrentSavedAssessmentId();
  }
}

export function setCurrentSavedAssessmentId(assessmentId: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    CURRENT_ASSESSMENT_ID_STORAGE_KEY,
    assessmentId
  );
}

export function getCurrentSavedAssessmentId(): string | null {
  if (typeof window === "undefined") return null;

  return readStorageWithLegacyFallback({
    currentKey: CURRENT_ASSESSMENT_ID_STORAGE_KEY,
    legacyKey: LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY,
  });
}

export function clearCurrentSavedAssessmentId() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(CURRENT_ASSESSMENT_ID_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_CURRENT_ASSESSMENT_ID_STORAGE_KEY);
}