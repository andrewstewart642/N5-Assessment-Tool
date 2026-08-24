import type {
  WorkedAnswerLine,
  WorkedAnswerMethod,
  WorkedAnswerSet,
} from "@/shared-types/AnswerGenerationTypes";

import type {
  GeneratedReversePercentageQuestion,
} from "@/course-data/question-generators/percentages/N5MathsReversePercentageGenerator";

import {
  getN5MathsAnswerViewMethodEvidence,
} from "@/course-data/source-marking-scheme-catalog/N5MathsSourceMarkingSchemeCatalog";

import {
  ANSWER_METHOD_FAMILY_IDS,
  ANSWER_METHOD_VARIANT_IDS,
} from "@/course-data/answer-generators/AnswerMethodIds";


type QuantityType =
  GeneratedReversePercentageQuestion[
    "numericProfile"
  ]["quantityType"];


type EvidenceRole =
  | "ILLUSTRATIVE"
  | "FULL_CREDIT_ALTERNATIVE"
  | "PARTIAL_METHOD_EVIDENCE";


function textLine(
  id: string,
  value: string,
  markNumbers?: number[]
): WorkedAnswerLine {
  return {
    id,

    parts: [
      {
        kind: "text",
        value,
      },
    ],

    ...(markNumbers
      ? {
          markNumbers,
        }
      : {}),
  };
}


function roundForComparison(
  value: number
): number {
  return (
    Math.round(
      (value + Number.EPSILON) *
        1_000_000
    ) /
    1_000_000
  );
}


function isClose(
  first: number,
  second: number,
  tolerance = 0.011
): boolean {
  return (
    Math.abs(
      roundForComparison(first) -
        roundForComparison(second)
    ) <= tolerance
  );
}


function isWholeNumber(
  value: number
): boolean {
  return isClose(
    value,
    Math.round(value),
    0.000001
  );
}


function formatNumber(
  value: number,
  maximumFractionDigits = 4
): string {
  return new Intl.NumberFormat(
    "en-GB",
    {
      maximumFractionDigits,
    }
  ).format(value);
}


function formatPercentage(
  value: number
): string {
  return `${formatNumber(
    value,
    2
  )}%`;
}


function formatValue(
  value: number,
  quantityType: QuantityType,
  maximumFractionDigits = 4
): string {
  const formatted =
    formatNumber(
      value,
      maximumFractionDigits
    );

  if (
    quantityType === "MONEY"
  ) {
    return `£${formatted}`;
  }

  return formatted;
}


function formatFinalValue(
  value: number,
  quantityType: QuantityType
): string {
  if (
    quantityType === "MONEY"
  ) {
    return formatValue(
      value,
      quantityType,
      2
    );
  }

  return formatValue(
    value,
    quantityType,
    Number.isInteger(value)
      ? 0
      : 2
  );
}


/**
 * All historical years remain valid evidence.
 *
 * More recent evidence has greater influence
 * when choosing the default illustrative route,
 * but no source year is discarded.
 *
 * 2021 receives no COVID-related penalty.
 */
function yearWeight(
  year: number
): number {
  return (
    1 +
    Math.max(
      0,
      year - 2014
    ) *
      0.12
  );
}


function evidenceRoleWeight(
  role: EvidenceRole
): number {
  switch (role) {
    case "ILLUSTRATIVE":
      return 1;

    case "FULL_CREDIT_ALTERNATIVE":
      return 0.82;

    case "PARTIAL_METHOD_EVIDENCE":
      return 0.35;

    default:
      return 0;
  }
}


/**
 * Scores a major method using only historical
 * evidence that is eligible for the generated
 * question's actual paper.
 *
 * The catalogue helper is responsible for:
 *
 * P1:
 * - same-paper evidence only
 * - illustrative methods only
 *
 * P2:
 * - same-paper evidence only
 * - illustrative methods
 * - full-credit alternatives
 */
function methodEvidenceScore(
  questionFamilyId: string,
  paper:
    GeneratedReversePercentageQuestion[
      "paper"
    ],
  methodFamilyId: string
): number {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,
      paper,
    });

  return evidence
    .filter(
      ({ method }) =>
        method.methodFamilyId ===
        methodFamilyId
    )
    .reduce(
      (
        score,
        {
          entry,
          method,
        }
      ) =>
        score +
        yearWeight(
          entry.year
        ) *
          evidenceRoleWeight(
            method.evidenceRole
          ),
      0
    );
}


/**
 * Scores a specific presentation variant
 * within a major method family.
 *
 * Example:
 *
 * REVERSE_PERCENT_UNITARY
 *   -> VIA_1_PERCENT
 *   -> VIA_10_PERCENT
 *   -> VIA_20_PERCENT
 */
function variantEvidenceScore(
  questionFamilyId: string,
  paper:
    GeneratedReversePercentageQuestion[
      "paper"
    ],
  methodFamilyId: string,
  variantId: string
): number {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,
      paper,
    });

  return evidence
    .filter(
      ({ method }) =>
        method.methodFamilyId ===
          methodFamilyId &&
        method.variantId ===
          variantId
    )
    .reduce(
      (
        score,
        {
          entry,
          method,
        }
      ) =>
        score +
        yearWeight(
          entry.year
        ) *
          evidenceRoleWeight(
            method.evidenceRole
          ),
      0
    );
}


function sourceEvidenceIdsForMethod(
  questionFamilyId: string,
  paper:
    GeneratedReversePercentageQuestion[
      "paper"
    ],
  methodFamilyId: string
): string[] {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,
      paper,
    });

  return [
    ...new Set(
      evidence
        .filter(
          ({ method }) =>
            method.methodFamilyId ===
            methodFamilyId
        )
        .map(
          ({ entry }) =>
            entry.id
        )
    ),
  ];
}


/**
 * Most reverse-percentage questions ultimately
 * calculate 100%.
 *
 * The increase-find-difference family instead
 * calculates the percentage increase itself.
 *
 * Example:
 *
 * 102.5% = £977.85
 * 1%     = £9.54
 * 2.5%   = £23.85
 */
function targetPercentageForQuestion(
  generated:
    GeneratedReversePercentageQuestion
): number {
  if (
    generated.familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE"
  ) {
    return (
      generated.numericProfile
        .percentage
    );
  }

  return 100;
}


function variantPercentage(
  variantId: string
): number | null {
  switch (variantId) {
    case ANSWER_METHOD_VARIANT_IDS
      .VIA_1_PERCENT:
      return 1;

    case ANSWER_METHOD_VARIANT_IDS
      .VIA_10_PERCENT:
      return 10;

    case ANSWER_METHOD_VARIANT_IDS
      .VIA_20_PERCENT:
      return 20;

    case ANSWER_METHOD_VARIANT_IDS
      .VIA_25_PERCENT:
      return 25;

    default:
      return null;
  }
}


function buildUnitaryVariant(args: {
  generated:
    GeneratedReversePercentageQuestion;

  variantId: string;
}): {
  variantId: string;
  lines: WorkedAnswerLine[];
  variantScore: number;
} | null {
  const {
    generated,
    variantId,
  } = args;

  const numeric =
    generated.numericProfile;

  const referencePercentage =
    numeric.retainedPercentage;

  const targetPercentage =
    targetPercentageForQuestion(
      generated
    );

  const stepPercentage =
    variantPercentage(
      variantId
    );

  if (
    stepPercentage === null
  ) {
    return null;
  }


  /**
   * A unitary variant may only appear in
   * Answers view if it has actually been
   * evidenced historically on the same paper
   * and question family.
   *
   * This prevents us inventing mathematically
   * valid but non-evidenced presentation styles.
   */
  const historicalVariantScore =
    variantEvidenceScore(
      generated.familyId,
      generated.paper,
      ANSWER_METHOD_FAMILY_IDS
        .REVERSE_PERCENT_UNITARY,
      variantId
    );

  if (
    historicalVariantScore <= 0
  ) {
    return null;
  }


  const divideBy =
    referencePercentage /
    stepPercentage;

  const multiplyBy =
    targetPercentage /
    stepPercentage;

  if (
    !Number.isFinite(divideBy) ||
    !Number.isFinite(multiplyBy) ||
    divideBy <= 0 ||
    multiplyBy <= 0
  ) {
    return null;
  }


  /**
   * A 1% route is always structurally valid.
   *
   * Larger stepping percentages are only shown
   * when both scaling operations are clean.
   *
   * Example:
   *
   * 80% -> 10% -> 100%
   *
   * is suitable.
   *
   * 75% -> 10% -> 100%
   *
   * would require awkward 7.5 and 10 scaling,
   * so it is not used as an illustrative route.
   */
  if (
    stepPercentage !== 1 &&
    (
      !isWholeNumber(
        divideBy
      ) ||
      !isWholeNumber(
        multiplyBy
      )
    )
  ) {
    return null;
  }


  const stepValue =
    numeric.knownValue /
    divideBy;

  const calculatedTarget =
    stepValue *
    multiplyBy;


  /**
   * The question generator remains authoritative
   * for the final numerical answer.
   *
   * We reject any worked route that does not
   * reproduce that answer.
   */
  if (
    !isClose(
      calculatedTarget,
      numeric.requestedAnswer
    )
  ) {
    return null;
  }


  const relationshipLine =
    `${formatPercentage(
      referencePercentage
    )} = ${formatValue(
      numeric.knownValue,
      numeric.quantityType,
      4
    )}`;


  const stepLine =
    `${formatPercentage(
      stepPercentage
    )} = ${formatValue(
      numeric.knownValue,
      numeric.quantityType,
      4
    )} ÷ ${formatNumber(
      divideBy,
      4
    )} = ${formatValue(
      stepValue,
      numeric.quantityType,
      4
    )}`;


  const targetLine =
    `${formatPercentage(
      targetPercentage
    )} = ${formatValue(
      stepValue,
      numeric.quantityType,
      4
    )} × ${formatNumber(
      multiplyBy,
      4
    )} = ${formatFinalValue(
      numeric.requestedAnswer,
      numeric.quantityType
    )}`;


  /**
   * Historical evidence remains the dominant
   * score.
   *
   * A small arithmetic-friendliness bonus helps
   * choose the cleaner route where multiple
   * historically evidenced variants are possible.
   */
  let friendlinessScore =
    0;

  if (
    isWholeNumber(
      divideBy
    )
  ) {
    friendlinessScore +=
      0.25;
  }

  if (
    isWholeNumber(
      multiplyBy
    )
  ) {
    friendlinessScore +=
      0.15;
  }


  return {
    variantId,

    lines: [
      textLine(
        `${variantId}-relationship`,
        relationshipLine,
        [1]
      ),

      textLine(
        `${variantId}-strategy`,
        stepLine,
        [2]
      ),

      textLine(
        `${variantId}-answer`,
        targetLine,
        [3]
      ),
    ],

    variantScore:
      historicalVariantScore +
      friendlinessScore,
  };
}


function buildUnitaryMethod(
  generated:
    GeneratedReversePercentageQuestion
): WorkedAnswerMethod | null {
  const candidateVariantIds = [
    ANSWER_METHOD_VARIANT_IDS
      .VIA_1_PERCENT,

    ANSWER_METHOD_VARIANT_IDS
      .VIA_10_PERCENT,

    ANSWER_METHOD_VARIANT_IDS
      .VIA_20_PERCENT,

    ANSWER_METHOD_VARIANT_IDS
      .VIA_25_PERCENT,
  ];


  const candidates =
    candidateVariantIds
      .map(
        (variantId) =>
          buildUnitaryVariant({
            generated,
            variantId,
          })
      )
      .filter(
        (
          item
        ): item is NonNullable<
          typeof item
        > =>
          item !== null
      )
      .sort(
        (
          first,
          second
        ) =>
          second.variantScore -
          first.variantScore
      );


  const chosen =
    candidates[0];

  if (!chosen) {
    return null;
  }


  const evidenceScore =
    methodEvidenceScore(
      generated.familyId,
      generated.paper,
      ANSWER_METHOD_FAMILY_IDS
        .REVERSE_PERCENT_UNITARY
    );

  if (
    evidenceScore <= 0
  ) {
    return null;
  }


  return {
    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .REVERSE_PERCENT_UNITARY,

    methodVariantId:
      chosen.variantId,

    lines:
      chosen.lines,

    evidenceScore,

    sourceEvidenceIds:
      sourceEvidenceIdsForMethod(
        generated.familyId,
        generated.paper,
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_UNITARY
      ),
  };
}


function buildMultiplierMethod(
  generated:
    GeneratedReversePercentageQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;


  /**
   * This is the important paper gate.
   *
   * On P1, multiplier solutions appearing only
   * as accepted COR/full-credit alternatives are
   * filtered out by the catalogue helper.
   *
   * Therefore their evidence score is zero and
   * the method is not exposed in Answers view.
   *
   * On P2, eligible multiplier evidence can
   * produce a selectable Method ↻ route.
   */
  const evidenceScore =
    methodEvidenceScore(
      generated.familyId,
      generated.paper,
      ANSWER_METHOD_FAMILY_IDS
        .REVERSE_PERCENT_INVERSE_MULTIPLIER
    );

  if (
    evidenceScore <= 0
  ) {
    return null;
  }


  if (
    !Number.isFinite(
      numeric.multiplier
    ) ||
    numeric.multiplier <= 0
  ) {
    return null;
  }


  const originalValue =
    numeric.knownValue /
    numeric.multiplier;


  const isDifferenceQuestion =
    generated.familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE";


  const finalCalculatedValue =
    isDifferenceQuestion
      ? numeric.knownValue -
        originalValue
      : originalValue;


  if (
    !isClose(
      finalCalculatedValue,
      numeric.requestedAnswer
    )
  ) {
    return null;
  }


  const relationshipLine =
    `${formatPercentage(
      numeric.retainedPercentage
    )} = ${formatValue(
      numeric.knownValue,
      numeric.quantityType,
      4
    )}`;


  const originalLine =
    `100% = ${formatValue(
      numeric.knownValue,
      numeric.quantityType,
      4
    )} ÷ ${formatNumber(
      numeric.multiplier,
      4
    )} = ${formatValue(
      originalValue,
      numeric.quantityType,
      4
    )}`;


  const lines:
    WorkedAnswerLine[] = [
      textLine(
        "inverse-multiplier-relationship",
        relationshipLine,
        [1]
      ),
    ];


  if (
    isDifferenceQuestion
  ) {
    lines.push(
      textLine(
        "inverse-multiplier-original",
        originalLine,
        [2]
      )
    );

    lines.push(
      textLine(
        "inverse-multiplier-difference",
        `${formatValue(
          numeric.knownValue,
          numeric.quantityType,
          4
        )} - ${formatValue(
          originalValue,
          numeric.quantityType,
          4
        )} = ${formatFinalValue(
          numeric.requestedAnswer,
          numeric.quantityType
        )}`,
        [3]
      )
    );
  } else {
    lines.push(
      textLine(
        "inverse-multiplier-answer",
        originalLine,
        [2, 3]
      )
    );
  }


  return {
    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .REVERSE_PERCENT_INVERSE_MULTIPLIER,

    methodVariantId:
      ANSWER_METHOD_VARIANT_IDS
        .DIVIDE_BY_MULTIPLIER,

    lines,

    evidenceScore,

    sourceEvidenceIds:
      sourceEvidenceIdsForMethod(
        generated.familyId,
        generated.paper,
        ANSWER_METHOD_FAMILY_IDS
          .REVERSE_PERCENT_INVERSE_MULTIPLIER
      ),
  };
}


export function generateN5MathsReversePercentageWorkedAnswers(
  generated:
    GeneratedReversePercentageQuestion
): WorkedAnswerSet {
  const methods:
    WorkedAnswerMethod[] =
      [];


  const unitaryMethod =
    buildUnitaryMethod(
      generated
    );

  if (
    unitaryMethod
  ) {
    methods.push(
      unitaryMethod
    );
  }


  const multiplierMethod =
    buildMultiplierMethod(
      generated
    );

  if (
    multiplierMethod
  ) {
    methods.push(
      multiplierMethod
    );
  }


  /**
   * Highest-evidence method becomes the
   * default Answers-view presentation.
   *
   * In practice this generally means the
   * explicitly illustrated unitary method,
   * while P2 may expose the inverse-multiplier
   * solution through Method ↻.
   */
  methods.sort(
    (
      first,
      second
    ) =>
      second.evidenceScore -
      first.evidenceScore
  );


  if (
    methods.length === 0
  ) {
    throw new Error(
      [
        "No valid worked-answer method could be generated.",
        `Family: ${generated.familyId}.`,
        `Paper: ${generated.paper}.`,
      ].join(" ")
    );
  }


  return {
    defaultMethodFamilyId:
      methods[0]
        .methodFamilyId,

    methods,
  };
}