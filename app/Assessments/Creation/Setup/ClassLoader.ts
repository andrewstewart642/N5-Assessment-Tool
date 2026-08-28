import type { SchoolClass } from "@/app/Classes/ClassData";
import { normaliseClass } from "@/app/Classes/Records/Normalisation";
import { readMyClassesStorageValue } from "@/app/Classes/Records/BrowserStorage";

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