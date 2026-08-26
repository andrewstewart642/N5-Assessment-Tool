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
 * Paper/component slot used by question selection metadata.
 *
 * "BOTH" is retained as the legacy/all-papers marker.
 * Any other value should match a configured course paper id.
 */
export type QuestionPaperMode = string;

/**
 * Calculator suitability metadata for a question variant.
 *
 * Interpretation used by legacy filtering:
 * - NonCalculatorOnly => P1 only
 * - CalculatorAllowed => P1 or P2
 * - CalculatorRequired => P2 only
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
 */
export type QuestionSelectionFilters = {
  selectedStandard: QuestionStandardMode;
  selectedThinkingType: QuestionThinkingTypeMode;
  targetMarks: number;
  targetPaper: QuestionPaperMode;

  /**
   * Course-config compatibility tags for the selected paper.
   *
   * Example:
   * - targetPaper: "NON_CALCULATOR"
   * - targetPaperSuitabilityTags: ["NON_CALCULATOR", "P1"]
   */
  targetPaperSuitabilityTags?: string[];
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
 * Determine whether the variant is valid for the target paper based on
 * calculator status.
 *
 * Legacy rule:
 * - P1 accepts NonCalculatorOnly or CalculatorAllowed
 * - P2 accepts CalculatorAllowed or CalculatorRequired
 *
 * For non-legacy paper ids, this function does not make a calculator-policy
 * decision. Paper suitability remains the hard gate. The course-config alias
 * layer is handled separately through targetPaperSuitabilityTags.
 */
export function variantMatchesCalculatorAndPaper(
  variant: QuestionVariantSelectionMeta,
  targetPaper: QuestionPaperMode
): boolean {
  if (targetPaper === "P1") {
    return (
      variant.calculatorStatus === "NonCalculatorOnly" ||
      variant.calculatorStatus === "CalculatorAllowed"
    );
  }

  if (targetPaper === "P2") {
    return (
      variant.calculatorStatus === "CalculatorAllowed" ||
      variant.calculatorStatus === "CalculatorRequired"
    );
  }

  return true;
}

function buildPaperSuitabilityTagSet(
  filters: QuestionSelectionFilters
): Set<string> {
  return new Set([
    filters.targetPaper,
    ...(filters.targetPaperSuitabilityTags ?? []),
  ]);
}

/**
 * Determine whether a variant is eligible under the current builder filters.
 *
 * Rules:
 * - Standard "C"   => target marks matches cMarks
 * - Standard "A"   => target marks matches aMarks
 * - Standard "C+A" => target marks matches totalMarks
 *
 * Hard validity gates:
 * 1) paper suitability must match
 * 2) calculator suitability must match the target paper
 * 3) thinking type must match
 */
export function isVariantEligibleForFilters(
  variant: QuestionVariantSelectionMeta,
  filters: QuestionSelectionFilters
): boolean {
  const paperSuitabilityTags = buildPaperSuitabilityTagSet(filters);

  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    paperSuitabilityTags.has(variant.paperSuitability);

  if (!paperMatches) return false;

  const calculatorMatches = variantMatchesCalculatorAndPaper(
    variant,
    filters.targetPaper
  );

  if (!calculatorMatches) return false;

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
  const paperSuitabilityTags = buildPaperSuitabilityTagSet(filters);

  const paperMatches =
    variant.paperSuitability === "BOTH" ||
    paperSuitabilityTags.has(variant.paperSuitability);

  if (!paperMatches) {
    reasons.push(
      `Variant is ${variant.paperSuitability}-only and cannot be used in ${filters.targetPaper}.`
    );
  }

  const calculatorMatches = variantMatchesCalculatorAndPaper(
    variant,
    filters.targetPaper
  );

  if (!calculatorMatches) {
    if (
      filters.targetPaper === "P1" &&
      variant.calculatorStatus === "CalculatorRequired"
    ) {
      reasons.push("Variant requires a calculator and cannot be used in this paper.");
    } else if (
      filters.targetPaper === "P2" &&
      variant.calculatorStatus === "NonCalculatorOnly"
    ) {
      reasons.push("Variant is non-calculator only and cannot be used in this paper.");
    }
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