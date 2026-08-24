import type {
  Paper,
} from "@/shared-types/AssessmentTypes_TEMP";

import type {
  SourceMarkingSchemeCatalogEntry,
  SourceMarkingSchemeMethodEvidence,
} from "./SourceMarkingSchemeTypes";

import {
  N5_MATHS_2014_P1_Q09_MS,
} from "./N5_Maths_2014/Paper1/N5_Maths_2014_P1_Q09_MS";

import {
  N5_MATHS_2015_P2_Q08_MS,
} from "./N5_Maths_2015/Paper2/N5_Maths_2015_P2_Q08_MS";

import {
  N5_MATHS_2017_P2_Q05_MS,
} from "./N5_Maths_2017/Paper2/N5_Maths_2017_P2_Q05_MS";

import {
  N5_MATHS_2018_P2_Q11_MS,
} from "./N5_Maths_2018/Paper2/N5_Maths_2018_P2_Q11_MS";

import {
  N5_MATHS_2019_P2_Q09_MS,
} from "./N5_Maths_2019/Paper2/N5_Maths_2019_P2_Q09_MS";

import {
  N5_MATHS_2021_P1_Q12_MS,
} from "./N5_Maths_2021/Paper1/N5_Maths_2021_P1_Q12_MS";

import {
  N5_MATHS_2022_P1_Q10_MS,
} from "./N5_Maths_2022/Paper1/N5_Maths_2022_P1_Q10_MS";

import {
  N5_MATHS_2023_P2_Q06_MS,
} from "./N5_Maths_2023/Paper2/N5_Maths_2023_P2_Q06_MS";

import {
  N5_MATHS_2024_P2_Q05_MS,
} from "./N5_Maths_2024/Paper2/N5_Maths_2024_P2_Q05_MS";

import {
  N5_MATHS_2025_P1_Q04_MS,
} from "./N5_Maths_2025/Paper1/N5_Maths_2025_P1_Q04_MS";


export const N5_MATHS_SOURCE_MARKING_SCHEME_CATALOG:
  SourceMarkingSchemeCatalogEntry[] = [
    N5_MATHS_2014_P1_Q09_MS,
    N5_MATHS_2015_P2_Q08_MS,

    N5_MATHS_2017_P2_Q05_MS,
    N5_MATHS_2018_P2_Q11_MS,
    N5_MATHS_2019_P2_Q09_MS,

    N5_MATHS_2021_P1_Q12_MS,
    N5_MATHS_2022_P1_Q10_MS,

    N5_MATHS_2023_P2_Q06_MS,
    N5_MATHS_2024_P2_Q05_MS,
    N5_MATHS_2025_P1_Q04_MS,
  ];


export function getN5MathsMarkingEvidenceByQuestionFamilyId(
  questionFamilyId: string
): SourceMarkingSchemeCatalogEntry[] {
  return (
    N5_MATHS_SOURCE_MARKING_SCHEME_CATALOG
      .filter(
        (entry) =>
          entry.questionFamilyId ===
          questionFamilyId
      )
  );
}


export function getN5MathsMarkingEvidenceBySourceQuestionId(
  sourceQuestionId: string
): SourceMarkingSchemeCatalogEntry | undefined {
  return (
    N5_MATHS_SOURCE_MARKING_SCHEME_CATALOG
      .find(
        (entry) =>
          entry.sourceQuestionId ===
          sourceQuestionId
      )
  );
}


export type N5MathsAnswerViewMethodEvidence = {
  entry:
    SourceMarkingSchemeCatalogEntry;

  method:
    SourceMarkingSchemeMethodEvidence;
};


function isAnswerViewEvidenceRoleEligible(
  paper: Paper,
  method:
    SourceMarkingSchemeMethodEvidence
): boolean {
  if (
    !method.supportsFullCredit
  ) {
    return false;
  }

  /**
   * Explicit illustrative working is valid
   * evidence on either paper.
   */
  if (
    method.evidenceRole ===
    "ILLUSTRATIVE"
  ) {
    return true;
  }

  /**
   * Calculator-paper COR/full-credit
   * alternatives may also be exposed as
   * selectable Answers-view methods.
   *
   * On P1 we deliberately do not promote
   * these accepted alternatives to the
   * illustrative pupil solution.
   */
  if (
    paper === "P2" &&
    method.evidenceRole ===
      "FULL_CREDIT_ALTERNATIVE"
  ) {
    return true;
  }

  return false;
}


export function getN5MathsAnswerViewMethodEvidence(args: {
  questionFamilyId: string;
  paper: Paper;
}): N5MathsAnswerViewMethodEvidence[] {
  const results:
    N5MathsAnswerViewMethodEvidence[] =
      [];

  for (
    const entry
    of N5_MATHS_SOURCE_MARKING_SCHEME_CATALOG
  ) {
    /**
     * This is the crucial paper filter.
     *
     * P1 generated questions learn only from
     * historical P1 schemes.
     *
     * P2 generated questions learn only from
     * historical P2 schemes.
     */
    if (
      entry.paper !== args.paper ||
      entry.questionFamilyId !==
        args.questionFamilyId
    ) {
      continue;
    }

    for (
      const method
      of entry.methodEvidence
    ) {
      if (
        !isAnswerViewEvidenceRoleEligible(
          args.paper,
          method
        )
      ) {
        continue;
      }

      results.push({
        entry,
        method,
      });
    }
  }

  return results;
}