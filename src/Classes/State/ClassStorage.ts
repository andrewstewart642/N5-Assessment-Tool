export const MY_CLASSES_STORAGE_KEY = "assessment_builder_my_classes_v1";
export const LEGACY_MY_CLASSES_STORAGE_KEY = "n5-my-classes";

export function readMyClassesStorageValue(): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(MY_CLASSES_STORAGE_KEY);
  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(LEGACY_MY_CLASSES_STORAGE_KEY);
  if (legacyValue === null) return null;

  window.localStorage.setItem(MY_CLASSES_STORAGE_KEY, legacyValue);
  return legacyValue;
}

export function writeMyClassesStorageValue(value: string): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(MY_CLASSES_STORAGE_KEY, value);
}