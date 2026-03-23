// shared-types/QuestionSelectionTypes.ts

/**
 * ============================================================================
 * QUESTION SELECTION TYPES
 * ============================================================================
 *
 * Purpose
 * -------
 * This file defines the shared type contracts used when the builder decides
 * which question variants are eligible to generate.
 *
 * It does NOT store live UI state.
 *
 * Instead, it defines:
 * - the standard pill options
 * - the thinking-type pill options
 * - the meaning of target marks
 * - the paper slot being filled
 * - the filter object passed into selection logic
 * - the metadata shape each variant can expose
 *
 * Core design rule
 * ----------------
 * The builder state says what the teacher wants.
 * The question variant metadata says what the question actually is.
 * Central filtering logic compares the two.
 *
 * Standards behaviour
 * -------------------
 * - "C"   => target marks refers to C marks
 * - "A"   => target marks refers to A marks
 * - "C+A" => target marks refers to total marks
 *
 * Thinking-type behaviour
 * -----------------------
 * - "OPERATIONAL" => only operational-style questions should match
 * - "REASONING"   => only reasoning-rich questions should match
 * - "ANY"         => no thinking-type restriction
 *
 * Paper behaviour
 * ---------------
 * Some questions are restricted to:
 * - Paper 1 only
 * - Paper 2 only
 * - both papers
 *
 * Example:
 * Rationalise is Paper 1 only.
 * Scientific notation is usually Paper 2 only.
 * Some concepts may be usable in both.
 * ============================================================================
 */

/**
 * The teacher's selected standard pill in the builder.
 */
export type QuestionStandardMode = "C" | "A" | "C+A";

/**
 * The teacher's selected thinking-type pill in the builder.
 */
export type QuestionThinkingTypeMode =
  | "OPERATIONAL"
  | "REASONING"
  | "ANY";

/**
 * Which paper slot the teacher is currently building into.
 */
export type QuestionPaperMode = "P1" | "P2" | "BOTH";

/**
 * Optional calculator suitability metadata for a question variant.
 * Useful later when filtering by paper or calculator restrictions.
 */
export type QuestionCalculatorStatus =
  | "NonCalculatorOnly"
  | "CalculatorAllowed"
  | "CalculatorRequired";

/**
 * Exact mark split carried by a single question variant.
 */
export type QuestionMarkProfile = {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  reasoningMarks: number;
};

/**
 * A derived high-level label for the variant's standard composition.
 */
export type QuestionStandardProfile = "C" | "A" | "C+A";

/**
 * Metadata that a single variant can expose for filtering.
 */
export type QuestionVariantSelectionMeta = {
  /**
   * The level bucket this variant belongs to.
   * Example: 1, 2, 3, 4
   */
  level: number;

  /**
   * Unique identifier for the variant/template.
   * Example: "rationalise-l2-c"
   */
  templateId: string;

  /**
   * Mark split truth for this variant.
   */
  marks: QuestionMarkProfile;

  /**
   * Derived standard composition for display/filtering support.
   */
  standardProfile: QuestionStandardProfile;

  /**
   * Where this question can appear.
   */
  paperSuitability: QuestionPaperMode;

  /**
   * Calculator suitability.
   */
  calculatorStatus: QuestionCalculatorStatus;
};

/**
 * The builder's active filter request at the moment a question is being chosen.
 *
 * selectedStandard:
 * - "C"   => targetMarks means C marks
 * - "A"   => targetMarks means A marks
 * - "C+A" => targetMarks means total marks
 *
 * selectedThinkingType:
 * - "OPERATIONAL" => operational only
 * - "REASONING"   => reasoning only
 * - "ANY"         => no thinking-type restriction
 */
export type QuestionSelectionFilters = {
  selectedStandard: QuestionStandardMode;
  selectedThinkingType: QuestionThinkingTypeMode;
  targetMarks: number;
  targetPaper: "P1" | "P2";
};

/**
 * A helper return shape that can be used by central filtering logic to explain
 * why a variant is eligible or not.
 */
export type QuestionVariantFilterResult = {
  isEligible: boolean;
  reasons: string[];
};

/**
 * Derive a high-level standard profile from a mark split.
 */
export function deriveStandardProfile(
  marks: QuestionMarkProfile
): QuestionStandardProfile {
  if (marks.cMarks > 0 && marks.aMarks > 0) return "C+A";
  if (marks.aMarks > 0) return "A";
  return "C";
}

/**
 * Determine whether the current variant matches the selected thinking type.
 *
 * Current working rule:
 * - reasoningMarks > 0 => reasoning
 * - reasoningMarks = 0 => operational
 */
export function variantMatchesThinkingType(
  variant: QuestionVariantSelectionMeta,
  selectedThinkingType: QuestionThinkingTypeMode
): boolean {
  if (selectedThinkingType === "ANY") return true;

  const isReasoning = variant.marks.reasoningMarks > 0;

  if (selectedThinkingType === "REASONING") {
    return isReasoning;
  }

  return !isReasoning;
}

/**
 * Determine whether a variant is eligible under the current builder filters.
 *
 * Rules:
 * - Standard "C"   => targetMarks matches cMarks
 * - Standard "A"   => targetMarks matches aMarks
 * - Standard "C+A" => targetMarks matches totalMarks
 *
 * Paper rules:
 * - targetPaper "P1" accepts "P1" or "BOTH"
 * - targetPaper "P2" accepts "P2" or "BOTH"
 *
 * Thinking-type rules:
 * - "ANY"         => no restriction
 * - "OPERATIONAL" => reasoningMarks must be 0
 * - "REASONING"   => reasoningMarks must be > 0
 */
export function isVariantEligibleForFilters(
  variant: QuestionVariantSelectionMeta,
  filters: QuestionSelectionFilters
): boolean {
  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    variant.paperSuitability === filters.targetPaper;

  if (!paperMatches) return false;

  const thinkingTypeMatches = variantMatchesThinkingType(
    variant,
    filters.selectedThinkingType
  );

  if (!thinkingTypeMatches) return false;

  if (filters.selectedStandard === "C") {
    return variant.marks.cMarks === filters.targetMarks;
  }

  if (filters.selectedStandard === "A") {
    return variant.marks.aMarks === filters.targetMarks;
  }

  return variant.marks.totalMarks === filters.targetMarks;
}

/**
 * A slightly more descriptive version of the eligibility check.
 * Useful later for UI feedback, disabled levels, and debugging.
 */
export function explainVariantEligibility(
  variant: QuestionVariantSelectionMeta,
  filters: QuestionSelectionFilters
): QuestionVariantFilterResult {
  const reasons: string[] = [];

  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    variant.paperSuitability === filters.targetPaper;

  if (!paperMatches) {
    reasons.push(
      `Variant is ${variant.paperSuitability}-only and cannot be used in ${filters.targetPaper}.`
    );
  }

  const thinkingTypeMatches = variantMatchesThinkingType(
    variant,
    filters.selectedThinkingType
  );

  if (!thinkingTypeMatches) {
    if (filters.selectedThinkingType === "REASONING") {
      reasons.push(
        "Variant has no reasoning marks and does not match the Reasoning filter."
      );
    } else if (filters.selectedThinkingType === "OPERATIONAL") {
      reasons.push(
        "Variant includes reasoning marks and does not match the Operational filter."
      );
    }
  }

  if (filters.selectedStandard === "C") {
    if (variant.marks.cMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} C marks, but this variant has ${variant.marks.cMarks}.`
      );
    }
  } else if (filters.selectedStandard === "A") {
    if (variant.marks.aMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} A marks, but this variant has ${variant.marks.aMarks}.`
      );
    }
  } else {
    if (variant.marks.totalMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} total marks, but this variant has ${variant.marks.totalMarks}.`
      );
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}