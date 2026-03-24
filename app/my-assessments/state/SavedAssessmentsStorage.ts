import type { SavedAssessment } from "./SavedAssessment";

const SAVED_ASSESSMENTS_STORAGE_KEY = "n5-saved-assessments";
const CURRENT_ASSESSMENT_ID_STORAGE_KEY = "n5-current-assessment-id";

function makeAssessmentId(): string {
  return `assessment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortAssessments(items: SavedAssessment[]): SavedAssessment[] {
  return [...items].sort((a, b) => b.updatedAt - a.updatedAt);
}

function normaliseSavedAssessment(candidate: unknown): SavedAssessment | null {
  if (!candidate || typeof candidate !== "object") return null;

  const item = candidate as Partial<SavedAssessment>;

  if (
    typeof item.id !== "string" ||
    typeof item.status !== "string" ||
    typeof item.createdAt !== "number" ||
    typeof item.updatedAt !== "number" ||
    !item.setup ||
    typeof item.setup !== "object" ||
    !item.builder ||
    typeof item.builder !== "object"
  ) {
    return null;
  }

  return item as SavedAssessment;
}

export function loadSavedAssessments(): SavedAssessment[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SAVED_ASSESSMENTS_STORAGE_KEY);
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
  input: Omit<SavedAssessment, "id" | "status" | "createdAt" | "updatedAt">
): SavedAssessment {
  const now = Date.now();

  const nextAssessment: SavedAssessment = {
    id: makeAssessmentId(),
    status: "DRAFT",
    createdAt: now,
    updatedAt: now,
    setup: input.setup,
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
  return window.localStorage.getItem(CURRENT_ASSESSMENT_ID_STORAGE_KEY);
}

export function clearCurrentSavedAssessmentId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CURRENT_ASSESSMENT_ID_STORAGE_KEY);
}