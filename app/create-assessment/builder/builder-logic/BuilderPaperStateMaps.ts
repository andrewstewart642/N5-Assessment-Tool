import type { Paper } from "@/shared-types/AssessmentTypes";

export type BuilderPaperNumberMap = Partial<Record<Paper, number>>;
export type BuilderPaperStringMap = Partial<Record<Paper, string>>;
export type BuilderPaperBooleanMap = Partial<Record<Paper, boolean>>;

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