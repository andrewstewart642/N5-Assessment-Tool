import type { SchoolClass } from "@/app/my-classes/types/Classes";
import { normaliseClass } from "@/app/my-classes/state/ClassNormalisation";
import { readMyClassesStorageValue } from "@/app/my-classes/state/ClassStorageKeys";

export function loadAssessmentSetupClasses(): SchoolClass[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = readMyClassesStorageValue();

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normaliseClass)
      .filter((item): item is SchoolClass => item !== null);
  } catch {
    return [];
  }
}