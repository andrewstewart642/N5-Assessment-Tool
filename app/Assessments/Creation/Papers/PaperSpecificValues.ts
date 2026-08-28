import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

export type AssessmentPaperValueMap<T> =
  Partial<
    Record<
      Paper,
      T
    >
  >;

export type AssessmentPaperNumberMap =
  AssessmentPaperValueMap<number>;

export type AssessmentPaperStringMap =
  AssessmentPaperValueMap<string>;

export type AssessmentPaperBooleanMap =
  AssessmentPaperValueMap<boolean>;

export type AssessmentPaperSetterMap<T> =
  Partial<
    Record<
      Paper,
      Dispatch<
        SetStateAction<T>
      >
    >
  >;

export type AssessmentPaperStringSetterMap =
  AssessmentPaperSetterMap<string>;

export function buildAssessmentPaperValueMap<T>({
  papers,
  getValue,
}: {
  papers:
    Paper[];

  getValue:
    (
      paper: Paper
    ) => T;
}): AssessmentPaperValueMap<T> {
  return papers.reduce<
    AssessmentPaperValueMap<T>
  >(
    (
      valuesByPaper,
      paper
    ) => {
      valuesByPaper[
        paper
      ] =
        getValue(
          paper
        );

      return valuesByPaper;
    },
    {}
  );
}

export function buildEmptyAssessmentPaperValueMap<T>({
  papers,
  value,
}: {
  papers:
    Paper[];

  value:
    T;
}): AssessmentPaperValueMap<T> {
  return buildAssessmentPaperValueMap({
    papers,

    getValue:
      () => value,
  });
}

export function getAssessmentPaperValue<T>({
  paper,
  valuesByPaper,
  fallback,
}: {
  paper:
    Paper;

  valuesByPaper:
    AssessmentPaperValueMap<T>;

  fallback:
    T;
}): T {
  const value =
    valuesByPaper[
      paper
    ];

  return value ===
    undefined
    ? fallback
    : value;
}

export function getAssessmentPaperNumberValue({
  paper,
  valuesByPaper,
  fallback = 0,
}: {
  paper:
    Paper;

  valuesByPaper:
    AssessmentPaperNumberMap;

  fallback?:
    number;
}): number {
  const value =
    valuesByPaper[
      paper
    ];

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

export function getAssessmentPaperStringValue({
  paper,
  valuesByPaper,
  fallback = "",
}: {
  paper:
    Paper;

  valuesByPaper:
    AssessmentPaperStringMap;

  fallback?:
    string;
}): string {
  const value =
    valuesByPaper[
      paper
    ];

  return typeof value ===
    "string"
    ? value
    : fallback;
}

export function getAssessmentPaperBooleanValue({
  paper,
  valuesByPaper,
  fallback = false,
}: {
  paper:
    Paper;

  valuesByPaper:
    AssessmentPaperBooleanMap;

  fallback?:
    boolean;
}): boolean {
  const value =
    valuesByPaper[
      paper
    ];

  return typeof value ===
    "boolean"
    ? value
    : fallback;
}

export function getAssessmentPaperStringSetter({
  paper,
  settersByPaper,
}: {
  paper:
    Paper;

  settersByPaper:
    AssessmentPaperStringSetterMap;
}): Dispatch<
  SetStateAction<string>
> | null {
  return (
    settersByPaper[
      paper
    ] ??
    null
  );
}