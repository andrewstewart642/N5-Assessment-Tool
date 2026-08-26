import type { SchoolClass } from "@/app/Classes/ClassTypes";
import { normaliseClass } from "@/app/Classes/State/ClassNormalisation";
import { readMyClassesStorageValue } from "@/app/Classes/State/ClassStorage";

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