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
 *
 * "C"
 *   = hunt for questions containing exactly the requested number of C marks
 *
 * "A"
 *   = hunt for questions containing exactly the requested number of A marks
 *
 * "C+A"
 *   = ignore standard split and hunt using total marks instead
 */
export type QuestionStandardMode = "C" | "A" | "C+A";

/**
 * Which paper slot the teacher is currently building into.
 *
 * "P1"
 *   = Paper 1 only
 *
 * "P2"
 *   = Paper 2 only
 *
 * "BOTH"
 *   = question is valid in either paper
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
 *
 * Example:
 * - totalMarks: 3
 * - cMarks: 2
 * - aMarks: 1
 * - reasoningMarks: 0
 */
export type QuestionMarkProfile = {
  totalMarks: number;
  cMarks: number;
  aMarks: number;
  reasoningMarks: number;
};

/**
 * A derived high-level label for the variant's standard composition.
 *
 * This is useful for display/debugging, but the real filtering truth remains
 * the mark profile itself.
 */
export type QuestionStandardProfile = "C" | "A" | "C+A";

/**
 * Metadata that a single variant can expose for filtering.
 *
 * This should eventually live beside each curated question variant
 * inside concept generator files.
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
 */
export type QuestionSelectionFilters = {
  selectedStandard: QuestionStandardMode;
  targetMarks: number;
  targetPaper: "P1" | "P2";
};

/**
 * A helper return shape that can be used by central filtering logic to explain
 * why a variant is eligible or not.
 *
 * This is optional, but useful later for:
 * - debugging
 * - greying out unavailable levels
 * - teacher-facing helper messages
 */
export type QuestionVariantFilterResult = {
  isEligible: boolean;
  reasons: string[];
};

/**
 * Derive a high-level standard profile from a mark split.
 *
 * Rules:
 * - cMarks > 0 and aMarks === 0 => "C"
 * - aMarks > 0 and cMarks === 0 => "A"
 * - cMarks > 0 and aMarks > 0   => "C+A"
 *
 * If both are zero, default to "C" for now as a safe fallback,
 * though in practice that case should not occur for real questions.
 */
export function deriveStandardProfile(
  marks: QuestionMarkProfile,
): QuestionStandardProfile {
  if (marks.cMarks > 0 && marks.aMarks > 0) return "C+A";
  if (marks.aMarks > 0) return "A";
  return "C";
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
 */
export function isVariantEligibleForFilters(
  variant: QuestionVariantSelectionMeta,
  filters: QuestionSelectionFilters,
): boolean {
  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    variant.paperSuitability === filters.targetPaper;

  if (!paperMatches) return false;

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
  filters: QuestionSelectionFilters,
): QuestionVariantFilterResult {
  const reasons: string[] = [];

  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    variant.paperSuitability === filters.targetPaper;

  if (!paperMatches) {
    reasons.push(
      `Variant is ${variant.paperSuitability}-only and cannot be used in ${filters.targetPaper}.`,
    );
  }

  if (filters.selectedStandard === "C") {
    if (variant.marks.cMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} C marks, but this variant has ${variant.marks.cMarks}.`,
      );
    }
  } else if (filters.selectedStandard === "A") {
    if (variant.marks.aMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} A marks, but this variant has ${variant.marks.aMarks}.`,
      );
    }
  } else {
    if (variant.marks.totalMarks !== filters.targetMarks) {
      reasons.push(
        `Requires exactly ${filters.targetMarks} total marks, but this variant has ${variant.marks.totalMarks}.`,
      );
    }
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}