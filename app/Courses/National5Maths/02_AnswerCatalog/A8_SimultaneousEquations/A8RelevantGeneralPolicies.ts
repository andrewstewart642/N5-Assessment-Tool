import type { Paper } from "@/app/Assessments/AssessmentTypes";
import type { CatalogEvidenceRef } from "../../CatalogCoreTypes";
import type { GeneralMarkingPolicyCatalogEntry, SharedMarkingRule } from "../AnswerCatalogTypes";
import { answerIntegrity } from "../AnswerCatalogHelpers";

export type A8PolicyYear = 2015 | 2016 | 2017 | 2018 | 2019 | 2021 | 2022 | 2023 | 2025;

type PolicyLocator = {
  paper: "P1" | "P2";
  pdfPages: number[];
  printedPageLabels: string[];
  explicitUnsupportedAnswerRule: boolean;
};

const LOCATORS: Record<A8PolicyYear, PolicyLocator> = {
  2015: { paper: "P1", pdfPages: [2], printedPageLabels: ["Page two"], explicitUnsupportedAnswerRule: false },
  2016: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["Page 02", "Page 03", "Page 04"], explicitUnsupportedAnswerRule: true },
  2017: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2018: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2019: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2021: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2022: { paper: "P2", pdfPages: [19, 20, 21], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2023: { paper: "P1", pdfPages: [2, 3, 4], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
  2025: { paper: "P2", pdfPages: [24, 25, 26], printedPageLabels: ["page 02", "page 03", "page 04"], explicitUnsupportedAnswerRule: true },
};

export const a8GeneralPolicyId = (year: number) => `N5_MATH_${year}_GENERAL_MARKING_POLICY_A8_RELEVANT`;

export const a8GeneralPolicyRuleIds = (year: number) => ({
  positiveMarking: `N5_MATH_${year}_A8_RULE_POSITIVE_MARKING`,
  validMethods: `N5_MATH_${year}_A8_RULE_VALID_METHODS`,
  followThrough: `N5_MATH_${year}_A8_RULE_FOLLOW_THROUGH`,
  workingRequired: `N5_MATH_${year}_A8_RULE_WORKING_REQUIRED_UNLESS_SPECIFIED`,
  units: `N5_MATH_${year}_A8_RULE_OMITTED_UNITS`,
  badForm: `N5_MATH_${year}_A8_RULE_BAD_FORM`,
  repeatedError: `N5_MATH_${year}_A8_RULE_REPEATED_ERROR`,
});

export const a8GeneralPolicyEvidence = (year: A8PolicyYear): CatalogEvidenceRef => {
  const locator = LOCATORS[year];
  return {
    documentId: `N5_MATH_${year}_MS`,
    pdfPages: locator.pdfPages,
    printedPageLabels: locator.printedPageLabels,
    paper: locator.paper,
    questionLocator: null,
    evidenceType: "GENERAL_MARKING_POLICY",
    locatorNote: `${year} ${locator.paper} general marking principles; only rules materially relevant to the A8 simultaneous-equations vertical slice are catalogued in this snapshot.`,
  };
};

const buildPolicy = (year: A8PolicyYear): GeneralMarkingPolicyCatalogEntry => {
  const locator = LOCATORS[year];
  const evidence = a8GeneralPolicyEvidence(year);
  const ids = a8GeneralPolicyRuleIds(year);
  const rules: SharedMarkingRule[] = [
    { id: ids.positiveMarking, scope: "ASSESSMENT", category: "POSITIVE_MARKING", normalisedRule: "Accumulate credit for demonstrated mathematics rather than deducting from a maximum.", penaltyLimit: "NOT_APPLICABLE", sourceEvidence: [evidence] },
    { id: ids.validMethods, scope: "ASSESSMENT", category: "VALID_METHODS", normalisedRule: "Accept mathematically correct methods unless the question or detailed instructions explicitly require or exclude a method.", penaltyLimit: "NOT_APPLICABLE", sourceEvidence: [evidence] },
    { id: ids.followThrough, scope: "ASSESSMENT", category: "FOLLOW_THROUGH", normalisedRule: "Continue marking after an error and award later credit only when the subsequent mathematical demand remains comparable to the intended demand.", penaltyLimit: "NOT_APPLICABLE", sourceEvidence: [evidence] },
    { id: ids.units, scope: "ASSESSMENT", category: "UNITS", normalisedRule: "Do not apply a generic penalty for omitted units unless the detailed instructions make units mark-bearing.", penaltyLimit: "NONE", sourceEvidence: [evidence] },
    { id: ids.badForm, scope: "ASSESSMENT", category: "PRESENTATION", normalisedRule: "Do not apply a generic penalty for bad form unless later work or the detailed instructions make the form consequential.", penaltyLimit: "NONE", sourceEvidence: [evidence] },
    { id: ids.repeatedError, scope: "QUESTION", category: "REPEATED_ERROR", normalisedRule: "Do not impose an additional generic penalty for repeating the same error within one question.", penaltyLimit: "NONE", sourceEvidence: [evidence] },
  ];
  if (locator.explicitUnsupportedAnswerRule) {
    rules.splice(3, 0, {
      id: ids.workingRequired,
      scope: "ASSESSMENT",
      category: "OTHER",
      normalisedRule: "Full credit normally requires appropriate working; an unsupported correct answer receives no credit unless the detailed instructions explicitly say otherwise.",
      penaltyLimit: "NOT_APPLICABLE",
      sourceEvidence: [evidence],
    });
  }
  return {
    id: a8GeneralPolicyId(year),
    schemaVersion: "N5_CATALOG_V2",
    courseId: "N5_MATH",
    year,
    affectedPapers: [locator.paper as Paper],
    sourceDocumentId: `N5_MATH_${year}_MS`,
    rules,
    sourceEvidence: [evidence],
    integrity: answerIntegrity(),
    review: {
      status: "IN_PROGRESS",
      sourceFactsComplete: false,
      classificationComplete: false,
      generationAnalysisComplete: false,
      counterpartCrossChecked: true,
      visualEvidenceCrossChecked: true,
      unresolvedIssues: ["This file deliberately catalogues only the general-policy rules needed by the A8 vertical slice; a future whole-year policy pass must complete the remaining rules."],
      validationNotes: [`A8-relevant general marking principles for ${year} ${locator.paper} were read from the source policy pages before the question-specific marking instructions were catalogued.`],
      reviewedAt: null,
    },
  };
};

export const A8_RELEVANT_GENERAL_POLICIES: Record<A8PolicyYear, GeneralMarkingPolicyCatalogEntry> = {
  2015: buildPolicy(2015),
  2016: buildPolicy(2016),
  2017: buildPolicy(2017),
  2018: buildPolicy(2018),
  2019: buildPolicy(2019),
  2021: buildPolicy(2021),
  2022: buildPolicy(2022),
  2023: buildPolicy(2023),
  2025: buildPolicy(2025),
};
