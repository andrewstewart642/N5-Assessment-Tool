import type { Dispatch, SetStateAction } from "react";

import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";

export type BuilderPaperValueMap<T> = Partial<Record<Paper, T>>;

export type BuilderPaperNumberMap = BuilderPaperValueMap<number>;
export type BuilderPaperStringMap = BuilderPaperValueMap<string>;
export type BuilderPaperBooleanMap = BuilderPaperValueMap<boolean>;

export type BuilderPaperSetterMap<T> = Partial<
  Record<Paper, Dispatch<SetStateAction<T>>>
>;

export type BuilderPaperStringSetterMap = BuilderPaperSetterMap<string>;

export type LegacyPaperNumberValues = {
  p1Value: number;
  p2Value: number;
};

export type LegacyPaperStringValues = {
  p1Value: string;
  p2Value: string;
};

export type LegacyPaperBooleanValues = {
  p1Value: boolean;
  p2Value: boolean;
};

export type LegacyPaperStringSetters = {
  setP1Value: Dispatch<SetStateAction<string>>;
  setP2Value: Dispatch<SetStateAction<string>>;
};

export function buildPaperValueMap<T>({
  papers,
  getValue,
}: {
  papers: Paper[];
  getValue: (paper: Paper) => T;
}): BuilderPaperValueMap<T> {
  return papers.reduce<BuilderPaperValueMap<T>>((valuesByPaper, paper) => {
    valuesByPaper[paper] = getValue(paper);
    return valuesByPaper;
  }, {});
}

export function buildEmptyPaperValueMap<T>({
  papers,
  value,
}: {
  papers: Paper[];
  value: T;
}): BuilderPaperValueMap<T> {
  return buildPaperValueMap({
    papers,
    getValue: () => value,
  });
}

export function normalisePaperValueMap<T>({
  papers,
  valuesByPaper,
  getFallbackValue,
}: {
  papers: Paper[];
  valuesByPaper: BuilderPaperValueMap<T>;
  getFallbackValue: (paper: Paper) => T;
}): BuilderPaperValueMap<T> {
  return papers.reduce<BuilderPaperValueMap<T>>((normalised, paper) => {
    const existingValue = valuesByPaper[paper];

    normalised[paper] =
      existingValue === undefined ? getFallbackValue(paper) : existingValue;

    return normalised;
  }, {});
}

export function getPaperValue<T>({
  paper,
  valuesByPaper,
  fallback,
}: {
  paper: Paper;
  valuesByPaper: BuilderPaperValueMap<T>;
  fallback: T;
}): T {
  const value = valuesByPaper[paper];

  return value === undefined ? fallback : value;
}

export function setPaperValue<T>({
  paper,
  value,
  setValuesByPaper,
}: {
  paper: Paper;
  value: T;
  setValuesByPaper: Dispatch<SetStateAction<BuilderPaperValueMap<T>>>;
}) {
  setValuesByPaper((prev) => ({
    ...prev,
    [paper]: value,
  }));
}

export function buildPaperNumberMapFromLegacyValues({
  p1Value,
  p2Value,
}: LegacyPaperNumberValues): BuilderPaperNumberMap {
  return {
    P1: p1Value,
    P2: p2Value,
  };
}

export function buildPaperStringMapFromLegacyValues({
  p1Value,
  p2Value,
}: LegacyPaperStringValues): BuilderPaperStringMap {
  return {
    P1: p1Value,
    P2: p2Value,
  };
}

export function buildPaperBooleanMapFromLegacyValues({
  p1Value,
  p2Value,
}: LegacyPaperBooleanValues): BuilderPaperBooleanMap {
  return {
    P1: p1Value,
    P2: p2Value,
  };
}

export function buildPaperStringSetterMapFromLegacySetters({
  setP1Value,
  setP2Value,
}: LegacyPaperStringSetters): BuilderPaperStringSetterMap {
  return {
    P1: setP1Value,
    P2: setP2Value,
  };
}

export function getPaperNumberValue({
  paper,
  valuesByPaper,
  fallback = 0,
}: {
  paper: Paper;
  valuesByPaper: BuilderPaperNumberMap;
  fallback?: number;
}): number {
  const value = valuesByPaper[paper];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

export function getPaperStringValue({
  paper,
  valuesByPaper,
  fallback = "",
}: {
  paper: Paper;
  valuesByPaper: BuilderPaperStringMap;
  fallback?: string;
}): string {
  const value = valuesByPaper[paper];

  return typeof value === "string" ? value : fallback;
}

export function getPaperBooleanValue({
  paper,
  valuesByPaper,
  fallback = false,
}: {
  paper: Paper;
  valuesByPaper: BuilderPaperBooleanMap;
  fallback?: boolean;
}): boolean {
  const value = valuesByPaper[paper];

  return typeof value === "boolean" ? value : fallback;
}

export function getPaperStringSetter({
  paper,
  settersByPaper,
}: {
  paper: Paper;
  settersByPaper: BuilderPaperStringSetterMap;
}): Dispatch<SetStateAction<string>> | null {
  return settersByPaper[paper] ?? null;
}