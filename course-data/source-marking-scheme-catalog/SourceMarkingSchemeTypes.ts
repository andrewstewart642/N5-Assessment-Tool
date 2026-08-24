import type {
  CourseId,
  Paper,
} from "@/shared-types/AssessmentTypes";


export type SourceMarkingSchemeId =
  string;


export type SourceMarkingSchemeSourceContext =
  | "STANDARD_EXAM"
  | "COVID_RESOURCE";


export type SourceMarkingSchemeReviewStatus =
  | "DRAFT"
  | "CATALOGUED"
  | "REVIEWED"
  | "APPROVED";


/**
 * =========================================================
 * METHOD EVIDENCE
 * =========================================================
 */


export type SourceMethodEvidenceRole =
  | "ILLUSTRATIVE"
  | "FULL_CREDIT_ALTERNATIVE"
  | "PARTIAL_METHOD_EVIDENCE";


export type SourceMarkingSchemeMethodEvidence = {
  /**
   * Normalised VecEd method identity.
   *
   * We do NOT use historical labels such as
   * "Method 1" as the permanent identity.
   */
  methodFamilyId:
    string;


  /**
   * Optional more-specific route.
   */
  variantId?:
    string;


  /**
   * How this method appeared in the historical
   * marking scheme.
   */
  evidenceRole:
    SourceMethodEvidenceRole;


  /**
   * Whether the historical presentation shown
   * was sufficient for full credit.
   */
  supportsFullCredit:
    boolean;


  /**
   * Marks directly evidenced by this historical
   * method presentation.
   *
   * Optional because the older catalogue entries
   * were created before mark-level method links
   * were stored explicitly.
   */
  markNumbers?:
    number[];


  /**
   * Normalised mathematical evidence from the
   * source marking scheme.
   *
   * Examples:
   *
   *   [
   *     "Identify multiplier 0.85",
   *     "Apply 964 × 0.85^3",
   *     "Evaluate and round to 590"
   *   ]
   *
   * This is intentionally paraphrased rather than
   * copied verbatim from SQA material.
   */
  evidenceSummary?:
    string[];


  notes?:
    string;
};


/**
 * =========================================================
 * MARK OWNERSHIP
 * =========================================================
 */


export type SourceMarkSkillOwnership = {
  markNumber:
    number;


  /**
   * SQA skill owning this mark.
   *
   * Particularly important for interleaved
   * questions.
   */
  skillId:
    string;
};


/**
 * =========================================================
 * MARK-BY-MARK EVIDENCE
 * =========================================================
 */


export type SourceMarkEvidenceKind =
  | "INTERPRETATION"
  | "METHOD"
  | "PROCESS"
  | "ACCURACY"
  | "ROUNDING"
  | "PRESENTATION"
  | "OTHER";


export type SourceMarkingSchemeMarkEvidence = {
  markNumber:
    number;


  /**
   * Broad purpose of this mark.
   *
   * This lets later answer-generation / marking
   * systems distinguish, for example:
   *
   * - identifying the correct percentage multiplier;
   * - applying it for the required number of periods;
   * - evaluating / rounding the final answer.
   */
  evidenceKind:
    SourceMarkEvidenceKind;


  /**
   * Concise normalised description of what earns
   * this mark.
   *
   * Do not copy the historical marking-scheme
   * wording verbatim.
   */
  evidenceSummary:
    string;


  /**
   * Optional alternative forms of evidence that
   * the source explicitly accepts for this mark.
   */
  acceptableEvidenceSummaries?:
    string[];


  /**
   * Marks which normally need to have been
   * established before this mark can be awarded.
   *
   * Leave empty/undefined where the mark is
   * independently awardable.
   */
  dependsOnMarkNumbers?:
    number[];


  /**
   * Whether the historical scheme explicitly
   * permits follow-through onto this mark after
   * an earlier error.
   */
  followThroughAvailable?:
    boolean;


  notes?:
    string;
};


/**
 * =========================================================
 * EXPECTED ANSWER
 * =========================================================
 */


export type SourceMarkingSchemeExpectedAnswer = {
  /**
   * Human-readable normalised answer.
   *
   * This remains string-based because later skills
   * may require algebraic, fractional, exact or
   * otherwise non-numeric answers.
   *
   * Examples:
   *
   *   "590"
   *   "£253628.16"
   *   "27.25408 g"
   */
  displayText:
    string;


  /**
   * Optional numeric representation where one
   * exists.
   *
   * This is useful for consistency checks between
   * question catalogue and marking-scheme catalogue.
   */
  numericValue?:
    number;


  /**
   * Other historically accepted display forms,
   * where materially relevant.
   */
  alternativeDisplayTexts?:
    string[];


  notes?:
    string;
};


/**
 * =========================================================
 * CORRECT ANSWER WITH NO WORKING
 * =========================================================
 */


export type SourceAnswerOnlyTreatment =
  | "FULL_CREDIT"
  | "PARTIAL_CREDIT"
  | "NO_CREDIT"
  | "NOT_STATED";


export type SourceCorrectAnswerWithoutWorking = {
  treatment:
    SourceAnswerOnlyTreatment;


  /**
   * Explicit number of marks awarded where the
   * source states this.
   *
   * Examples:
   *
   *   FULL_CREDIT with marksAwarded: 3
   *   NO_CREDIT with marksAwarded: 0
   *
   * Leave undefined when the source does not give
   * an exact numerical award.
   */
  marksAwarded?:
    number;


  notes?:
    string;
};


/**
 * =========================================================
 * STRUCTURED MARKING RULES
 * =========================================================
 */


export type SourceMarkingRuleCategory =
  | "FOLLOW_THROUGH"
  | "ROUNDING"
  | "WRONG_OPERATION"
  | "WRONG_PERCENTAGE"
  | "METHOD_LIMIT"
  | "ERROR_LIMIT"
  | "ANSWER_ONLY"
  | "PRESENTATION"
  | "ALTERNATIVE_METHOD"
  | "OTHER";


export type SourceMarkingRuleOutcome = {
  /**
   * Exact mark award if the historical source
   * specifies one.
   */
  marksAwarded?:
    number;


  /**
   * Maximum total score attainable after this
   * condition occurs.
   *
   * Particularly useful for rules such as an
   * incorrect percentage followed through for
   * no more than 2/3.
   */
  maximumMarks?:
    number;


  /**
   * Specific marks made unavailable by the rule.
   */
  unavailableMarkNumbers?:
    number[];


  /**
   * Marks which remain available by follow-through.
   */
  followThroughMarkNumbers?:
    number[];
};


export type SourceMarkingSchemeRule = {
  /**
   * Stable local identity within the source
   * marking-scheme entry.
   *
   * Example:
   *
   *   "incorrect-percentage-follow-through"
   */
  id:
    string;


  category:
    SourceMarkingRuleCategory;


  /**
   * Normalised description of the condition
   * triggering the rule.
   */
  conditionSummary:
    string;


  /**
   * Structured consequence of that condition.
   */
  outcome:
    SourceMarkingRuleOutcome;


  /**
   * Marks directly affected by this rule.
   */
  appliesToMarkNumbers?:
    number[];


  notes?:
    string;
};


/**
 * =========================================================
 * COMMON / OBSERVED RESPONSES
 * =========================================================
 */


export type SourceCommonResponseCategory =
  | "COMMON_ERROR"
  | "PARTIAL_METHOD"
  | "VALID_ALTERNATIVE"
  | "ROUNDING_ERROR"
  | "ANSWER_ONLY"
  | "OTHER";


export type SourceMarkingSchemeCommonResponse = {
  id:
    string;


  category:
    SourceCommonResponseCategory;


  /**
   * Paraphrased description of the response.
   *
   * Examples:
   *
   *   "Applies the annual percentage once only"
   *
   *   "Uses simple interest rather than compound
   *    percentage change"
   */
  responseSummary:
    string;


  /**
   * Exact score awarded where the source
   * explicitly states it.
   */
  marksAwarded?:
    number;


  /**
   * Maximum score available where the source
   * gives a ceiling rather than a fixed score.
   */
  maximumMarks?:
    number;


  /**
   * Links the response to one or more structured
   * marking rules in this same catalogue entry.
   */
  linkedRuleIds?:
    string[];


  notes?:
    string;
};


/**
 * =========================================================
 * SOURCE MARKING-SCHEME LAYOUT
 * =========================================================
 */


export type SourceMarkingSchemeMeasurementMethod =
  | "PDF_RENDER"
  | "MANUAL_ESTIMATE"
  | "NOT_MEASURED";


export type SourceMarkingSchemePdfRenderMeasurement = {
  /**
   * 1-based physical page number in the source
   * marking-scheme PDF.
   *
   * This is deliberately compulsory whenever a
   * PDF_RENDER measurement is added, unlike the
   * transitional question-catalogue field.
   */
  pdfPageNumber:
    number;


  /**
   * Rendering standard.
   *
   * Current percentage cataloguing standard:
   *
   *   300 dpi
   *   2481 × 3508 px for an A4 source page
   */
  renderDpi:
    number;

  pageWidthPx:
    number;

  pageHeightPx:
    number;


  /**
   * TOP-LEFT coordinate origin.
   *
   * The primary layout requirement is vertical
   * extent, because this is what informs worked-
   * answer spacing and pagination.
   */
  topPx:
    number;

  bottomPx:
    number;

  heightPx:
    number;


  /**
   * Optional horizontal measurements.
   *
   * They are retained because marking-scheme
   * evidence can sometimes occupy only one table
   * column or subsection of the page.
   */
  leftPx?:
    number;

  rightPx?:
    number;

  widthPx?:
    number;


  /**
   * PDF-native point equivalents.
   */
  topPt?:
    number;

  bottomPt?:
    number;

  heightPt?:
    number;

  leftPt?:
    number;

  rightPt?:
    number;

  widthPt?:
    number;


  /**
   * Physical dimensions at the recorded render DPI.
   */
  heightMm:
    number;

  widthMm?:
    number;
};


export type SourceMarkingSchemePdfMeasuredBlock = {
  measurementMethod:
    "PDF_RENDER";

  sourceMeasurement:
    SourceMarkingSchemePdfRenderMeasurement;

  notes?:
    string;
};


export type SourceMarkingSchemeEstimatedBlock = {
  measurementMethod:
    | "MANUAL_ESTIMATE"
    | "NOT_MEASURED";

  sourceMeasurement?:
    never;

  notes?:
    string;
};


export type SourceMarkingSchemeMeasuredBlock =
  | SourceMarkingSchemePdfMeasuredBlock
  | SourceMarkingSchemeEstimatedBlock;


export type SourceMarkingSchemeLayoutEvidence = {
  /**
   * Tight measurement around the actual worked /
   * marking evidence for this question.
   *
   * This is the useful block for understanding how
   * much vertical space the historical worked
   * solution itself occupies.
   */
  coreEvidenceBlock?:
    SourceMarkingSchemeMeasuredBlock;


  /**
   * Measurement of the complete question-specific
   * marking-scheme section.
   *
   * This may additionally include:
   *
   * - notes;
   * - additional guidance;
   * - commonly observed responses;
   * - alternative method discussion.
   *
   * This should NOT automatically become the
   * generated worked-answer height, but it preserves
   * the complete source-layout evidence.
   */
  fullQuestionBlock?:
    SourceMarkingSchemeMeasuredBlock;


  notes?:
    string;
};


/**
 * =========================================================
 * COMPLETE CATALOGUE ENTRY
 * =========================================================
 */


export type SourceMarkingSchemeCatalogEntry = {
  id:
    SourceMarkingSchemeId;


  /**
   * Direct connection to the corresponding
   * source-question catalogue entry.
   */
  sourceQuestionId:
    string;


  courseId:
    CourseId;


  year:
    number;

  paper:
    Paper;

  questionNumber:
    string;


  totalMarks:
    number;


  /**
   * Generator family this evidence informs.
   */
  questionFamilyId:
    string;


  /**
   * Context metadata only.
   *
   * COVID_RESOURCE does NOT reduce weighting.
   */
  sourceContext:
    SourceMarkingSchemeSourceContext;


  /**
   * Correct / usable method evidence extracted
   * from the historical marking scheme.
   *
   * No verbatim SQA prose.
   */
  methodEvidence:
    SourceMarkingSchemeMethodEvidence[];


  /**
   * Exact mark-level skill ownership.
   */
  markSkillOwnership:
    SourceMarkSkillOwnership[];


  /**
   * Expected final answer as evidenced by the
   * historical marking scheme.
   *
   * Optional while older entries are backfilled.
   */
  expectedAnswer?:
    SourceMarkingSchemeExpectedAnswer;


  /**
   * What each individual mark is actually awarded
   * for.
   *
   * This is deliberately distinct from
   * markSkillOwnership:
   *
   * ownership answers:
   *   "which skill owns M1?"
   *
   * evidence answers:
   *   "what must the pupil demonstrate for M1?"
   */
  markEvidence?:
    SourceMarkingSchemeMarkEvidence[];


  /**
   * Explicit historical treatment of a completely
   * correct final answer with no visible working.
   *
   * This is important because this is not uniform
   * across all National 5 question families.
   */
  correctAnswerWithoutWorking?:
    SourceCorrectAnswerWithoutWorking;


  /**
   * Follow-through, rounding, method limits and
   * other source-specific marking instructions.
   */
  markingRules?:
    SourceMarkingSchemeRule[];


  /**
   * Structured versions of useful commonly
   * observed / explicitly discussed responses.
   */
  commonResponses?:
    SourceMarkingSchemeCommonResponse[];


  /**
   * Exact source-PDF dimensions for the historical
   * marking evidence.
   *
   * Optional while the existing catalogue is
   * progressively remeasured.
   */
  sourceLayout?:
    SourceMarkingSchemeLayoutEvidence;


  reviewStatus:
    SourceMarkingSchemeReviewStatus;
};