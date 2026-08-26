import type {
  WorkedAnswerLine,
  WorkedAnswerMethod,
  WorkedAnswerSet,
} from "@/app/Assessments/Questions/Generation/AnswerGenerationTypes";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import type {
  CompoundPercentageNumericProfile,
  CompoundPercentageStage,
  GeneratedCompoundPercentageQuestion,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/Numerical/N04_Percentages/N04_2_PercentagesAppreciation/N04_2_PercentagesAppreciationQuestionWriter";

import {
  getN5MathsAnswerViewMethodEvidence,
} from "@/app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/MarkingSchemes/National5MathsExamMarkingSchemeCatalog";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";


const COMPOUND_PERCENTAGE_PAPER =
  "P2" as const;


const CALCULATION_DISPLAY_DECIMAL_PLACES =
  3;


type EvidenceRole =
  | "ILLUSTRATIVE"
  | "FULL_CREDIT_ALTERNATIVE"
  | "PARTIAL_METHOD_EVIDENCE";


function mathPart(
  latex: string
): PaperPart {
  return {
    kind:
      "math",

    latex,
  };
}


function mathLine(
  id: string,
  latex: string,
  markNumbers?: number[]
): WorkedAnswerLine {
  return {
    id,

    parts: [
      mathPart(
        latex
      ),
    ],

    ...(markNumbers
      ? {
          markNumbers,
        }
      : {}),
  };
}


function roundTo(
  value: number,
  decimalPlaces: number
): number {
  const factor =
    Math.pow(
      10,
      decimalPlaces
    );

  return (
    Math.round(
      (
        value +
        Number.EPSILON
      ) *
      factor
    ) /
    factor
  );
}


function approximatelyEqual(
  first: number,
  second: number,
  tolerance = 1e-8
): boolean {
  return (
    Math.abs(
      first -
      second
    ) <=
    tolerance *
      Math.max(
        1,
        Math.abs(
          first
        ),
        Math.abs(
          second
        )
      )
  );
}


function trimDecimalString(
  value: number,
  maximumDecimalPlaces = 12
): string {
  if (
    Number.isInteger(
      value
    )
  ) {
    return String(
      value
    );
  }

  return (
    value
      .toFixed(
        maximumDecimalPlaces
      )
      .replace(
        /0+$/,
        ""
      )
      .replace(
        /\.$/,
        ""
      )
  );
}


function groupIntegerLatex(
  integerText: string
): string {
  const isNegative =
    integerText.startsWith(
      "-"
    );

  const unsigned =
    isNegative
      ? integerText.slice(
          1
        )
      : integerText;

  const grouped =
    unsigned.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "\\,"
    );

  return (
    isNegative
      ? `-${grouped}`
      : grouped
  );
}


function decimalTextToLatex(
  text: string
): string {
  const [
    integerPart,
    decimalPart,
  ] =
    text.split(
      "."
    );

  const groupedInteger =
    groupIntegerLatex(
      integerPart
    );

  if (
    decimalPart ===
    undefined
  ) {
    return groupedInteger;
  }

  return (
    `${groupedInteger}.${decimalPart}`
  );
}


function numberToLatex(
  value: number,
  fixedDecimalPlaces?:
    number
): string {
  const text =
    fixedDecimalPlaces ===
      undefined
      ? trimDecimalString(
          value
        )
      : value.toFixed(
          fixedDecimalPlaces
        );

  return (
    decimalTextToLatex(
      text
    )
  );
}


function percentageToLatex(
  value: number
): string {
  return (
    `${trimDecimalString(
      value,
      4
    )}\\%`
  );
}


function multiplierToLatex(
  value: number
): string {
  return (
    trimDecimalString(
      value,
      6
    )
  );
}


function calculationValueToLatex(
  value: number
): string {
  const text =
    value
      .toFixed(
        CALCULATION_DISPLAY_DECIMAL_PLACES
      )
      .replace(
        /0+$/,
        ""
      )
      .replace(
        /\.$/,
        ""
      );

  const normalisedText =
    text === "-0"
      ? "0"
      : text;

  return (
    decimalTextToLatex(
      normalisedText
    )
  );
}


function calculateFromStages(
  initialValue: number,
  stages:
    CompoundPercentageStage[]
): number {
  let result =
    initialValue;

  for (
    const stage
    of stages
  ) {
    result *=
      Math.pow(
        stage.multiplier,
        stage.periods
      );
  }

  return result;
}


function roundingInstructionLatex(
  numeric:
    CompoundPercentageNumericProfile
): string | null {
  if (
    numeric.roundingMode ===
    "NEAREST_INTEGER"
  ) {
    if (
      numeric.valueKind ===
      "CURRENCY"
    ) {
      return (
        "\\text{nearest pound}"
      );
    }

    return (
      "\\text{nearest whole number}"
    );
  }

  if (
    numeric.roundingMode ===
    "NEAREST_TEN"
  ) {
    return (
      "\\text{nearest ten}"
    );
  }

  if (
    numeric.roundingMode ===
    "NEAREST_THOUSAND"
  ) {
    if (
      numeric.valueKind ===
      "CURRENCY"
    ) {
      return (
        "\\text{nearest thousand pounds}"
      );
    }

    return (
      "\\text{nearest thousand}"
    );
  }

  return null;
}


function requestedAnswerToLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  if (
    numeric.valueKind ===
    "CURRENCY"
  ) {
    const decimals =
      numeric.currencyDisplayDecimals ===
        2
        ? 2
        : 0;

    return (
      `\\text{£}${numberToLatex(
        numeric.requestedAnswer,
        decimals
      )}`
    );
  }

  if (
    numeric.valueKind ===
    "MEASUREMENT"
  ) {
    /**
     * Measurements are generated with at most three
     * meaningful decimal places. Use the same display
     * formatter as calculated working values so binary
     * floating-point noise cannot reappear here.
     *
     * Example:
     *
     *   17006.112000000001 -> 17 006.112
     *   14060.950000000001 -> 14 060.95
     */
    const valueLatex =
      calculationValueToLatex(
        numeric.requestedAnswer
      );

    if (
      numeric.unit
    ) {
      return (
        `${valueLatex}\\text{ ${numeric.unit}}`
      );
    }

    return valueLatex;
  }

  return (
    numberToLatex(
      numeric.requestedAnswer,
      0
    )
  );
}


function finalCalculationLineLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  const unroundedLatex =
    calculationValueToLatex(
      numeric.unroundedFinalValue
    );

  const answerLatex =
    requestedAnswerToLatex(
      numeric
    );

  const roundingInstruction =
    roundingInstructionLatex(
      numeric
    );

  if (
    roundingInstruction
  ) {
    return (
      `= ${unroundedLatex} \\approx ${answerLatex}`
      + `\\quad (${roundingInstruction})`
    );
  }

  if (
    numeric.valueKind ===
      "CURRENCY" &&
    numeric.currencyDisplayDecimals ===
      2
  ) {
    const roundedToPence =
      roundTo(
        numeric.unroundedFinalValue,
        2
      );

    if (
      !approximatelyEqual(
        numeric.unroundedFinalValue,
        roundedToPence
      )
    ) {
      return (
        `= ${unroundedLatex}`
        + ` \\Rightarrow ${answerLatex}`
      );
    }

    return (
      `= ${answerLatex}`
    );
  }

  if (
    approximatelyEqual(
      numeric.unroundedFinalValue,
      numeric.requestedAnswer
    )
  ) {
    return (
      `= ${answerLatex}`
    );
  }

  return (
    `= ${unroundedLatex}`
    + ` \\Rightarrow ${answerLatex}`
  );
}


/**
 * All historical years remain valid evidence.
 *
 * More recent schemes receive a small weighting
 * increase when the default Answers-view method
 * is selected.
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
  switch (
    role
  ) {
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


function methodEvidenceScore(
  questionFamilyId: string,
  methodFamilyId: string
): number {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,

      paper:
        COMPOUND_PERCENTAGE_PAPER,
    });

  return (
    evidence
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
      )
  );
}


function sourceEvidenceIdsForMethod(
  questionFamilyId: string,
  methodFamilyId: string
): string[] {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,

      paper:
        COMPOUND_PERCENTAGE_PAPER,
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


function buildMethod(args: {
  generated:
    GeneratedCompoundPercentageQuestion;

  methodFamilyId:
    string;

  lines:
    WorkedAnswerLine[];
}): WorkedAnswerMethod | null {
  const evidenceScore =
    methodEvidenceScore(
      args.generated.familyId,
      args.methodFamilyId
    );

  if (
    evidenceScore <= 0
  ) {
    return null;
  }

  return {
    methodFamilyId:
      args.methodFamilyId,

    lines:
      args.lines,

    evidenceScore,

    sourceEvidenceIds:
      sourceEvidenceIdsForMethod(
        args.generated.familyId,
        args.methodFamilyId
      ),
  };
}


function fixedMultiplierLineLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  const stage =
    numeric.stages[0];

  const percentage =
    percentageToLatex(
      stage.percentageValue
    );

  const multiplier =
    multiplierToLatex(
      stage.multiplier
    );

  if (
    numeric.direction ===
    "INCREASE"
  ) {
    return (
      `100\\% + ${percentage}`
      + ` = ${trimDecimalString(
        100 +
          stage.percentageValue,
        4
      )}\\%`
      + `\\quad\\Rightarrow\\quad`
      + `\\times ${multiplier}`
    );
  }

  return (
    `100\\% - ${percentage}`
    + ` = ${trimDecimalString(
      100 -
        stage.percentageValue,
      4
    )}\\%`
    + `\\quad\\Rightarrow\\quad`
    + `\\times ${multiplier}`
  );
}


function fixedPowerExpressionLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  const stage =
    numeric.stages[0];

  return (
    `${numberToLatex(
      numeric.initialValue
    )}`
    + ` \\times ${multiplierToLatex(
      stage.multiplier
    )}^{${stage.periods}}`
  );
}


/**
 * FIXED-RATE COMPOUND PERCENTAGE
 *
 * Historical illustrative route:
 *
 *   identify multiplier
 *   initial × multiplier^periods
 *   evaluate / round
 */
function buildFixedRateMultiplierPowerMethod(
  generated:
    GeneratedCompoundPercentageQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "FIXED_RATE" ||
    numeric.stages.length !==
      1
  ) {
    return null;
  }

  const calculated =
    calculateFromStages(
      numeric.initialValue,
      numeric.stages
    );

  if (
    !approximatelyEqual(
      calculated,
      numeric.unroundedFinalValue
    )
  ) {
    return null;
  }

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .COMPOUND_PERCENT_MULTIPLIER_POWER,

    lines: [
      mathLine(
        "compound-percent-fixed-multiplier",
        fixedMultiplierLineLatex(
          numeric
        ),
        [1]
      ),

      mathLine(
        "compound-percent-fixed-power",
        fixedPowerExpressionLatex(
          numeric
        ),
        [2]
      ),

      mathLine(
        "compound-percent-fixed-answer",
        finalCalculationLineLatex(
          numeric
        ),
        [3]
      ),
    ],
  });
}


function multiRateMultiplierLineLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  return (
    numeric.stages
      .map(
        (stage) => {
          const percentage =
            percentageToLatex(
              stage.percentageValue
            );

          const remainingPercentage =
            trimDecimalString(
              100 -
                stage.percentageValue,
              4
            );

          return (
            `100\\% - ${percentage}`
            + ` = ${remainingPercentage}\\%`
            + `\\Rightarrow`
            + `\\times ${multiplierToLatex(
              stage.multiplier
            )}`
          );
        }
      )
      .join(
        "\\qquad"
      )
  );
}


function multiRateExpressionLatex(
  numeric:
    CompoundPercentageNumericProfile
): string {
  const stageExpressions =
    numeric.stages
      .map(
        (stage) => {
          const multiplier =
            multiplierToLatex(
              stage.multiplier
            );

          if (
            stage.periods ===
            1
          ) {
            return (
              `\\times ${multiplier}`
            );
          }

          return (
            `\\times ${multiplier}^{${stage.periods}}`
          );
        }
      )
      .join(
        " "
      );

  return (
    `${numberToLatex(
      numeric.initialValue
    )} ${stageExpressions}`
  );
}


/**
 * MULTI-RATE DEPRECIATION
 *
 * Historical 2023 route:
 *
 *   identify both multipliers
 *   apply each over its correct number of periods
 *   evaluate
 */
function buildMultiRateMultiplierPowerMethod(
  generated:
    GeneratedCompoundPercentageQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
      "MULTI_RATE" ||
    numeric.direction !==
      "DECREASE" ||
    numeric.stages.length <
      2
  ) {
    return null;
  }

  const calculated =
    calculateFromStages(
      numeric.initialValue,
      numeric.stages
    );

  if (
    !approximatelyEqual(
      calculated,
      numeric.unroundedFinalValue
    )
  ) {
    return null;
  }

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .COMPOUND_PERCENT_MULTI_RATE_MULTIPLIER_POWER,

    lines: [
      mathLine(
        "compound-percent-multi-rate-multipliers",
        multiRateMultiplierLineLatex(
          numeric
        ),
        [1]
      ),

      mathLine(
        "compound-percent-multi-rate-expression",
        multiRateExpressionLatex(
          numeric
        ),
        [2]
      ),

      mathLine(
        "compound-percent-multi-rate-answer",
        finalCalculationLineLatex(
          numeric
        ),
        [3]
      ),
    ],
  });
}


function yearByYearResultLatex(
  value: number
): string {
  return (
    calculationValueToLatex(
      value
    )
  );
}


/**
 * FIXED-RATE YEAR-BY-YEAR METHOD
 *
 * The 2024 marking instructions explicitly
 * award full credit for repeated year-by-year
 * multiplication.
 *
 * We still pass this through the evidence
 * catalogue rather than making it universally
 * available by assumption.
 */
function buildYearByYearMethod(
  generated:
    GeneratedCompoundPercentageQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
      "FIXED_RATE" ||
    numeric.stages.length !==
      1
  ) {
    return null;
  }

  const stage =
    numeric.stages[0];

  if (
    stage.periods <
    2
  ) {
    return null;
  }

  const calculated =
    calculateFromStages(
      numeric.initialValue,
      numeric.stages
    );

  if (
    !approximatelyEqual(
      calculated,
      numeric.unroundedFinalValue
    )
  ) {
    return null;
  }

  const lines:
    WorkedAnswerLine[] = [
      mathLine(
        "compound-percent-year-by-year-multiplier",
        fixedMultiplierLineLatex(
          numeric
        ),
        [1]
      ),
    ];

  let runningValue =
    numeric.initialValue;

  for (
    let period = 1;
    period <=
      stage.periods;
    period += 1
  ) {
    const previousValue =
      runningValue;

    runningValue *=
      stage.multiplier;

    lines.push(
      mathLine(
        `compound-percent-year-by-year-period-${period}`,

        `${yearByYearResultLatex(
          previousValue
        )}`
        + ` \\times ${multiplierToLatex(
          stage.multiplier
        )}`
        + ` = ${yearByYearResultLatex(
          runningValue
        )}`,

        period ===
          stage.periods
          ? [2]
          : undefined
      )
    );
  }

  lines.push(
    mathLine(
      "compound-percent-year-by-year-answer",
      finalCalculationLineLatex(
        numeric
      ),
      [3]
    )
  );

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .COMPOUND_PERCENT_YEAR_BY_YEAR,

    lines,
  });
}


export function generateN5MathsCompoundPercentageWorkedAnswers(
  generated:
    GeneratedCompoundPercentageQuestion
): WorkedAnswerSet {
  const methods:
    WorkedAnswerMethod[] =
      [];

  const candidates = [
    buildFixedRateMultiplierPowerMethod(
      generated
    ),

    buildMultiRateMultiplierPowerMethod(
      generated
    ),

    buildYearByYearMethod(
      generated
    ),
  ];

  for (
    const candidate
    of candidates
  ) {
    if (
      candidate
    ) {
      methods.push(
        candidate
      );
    }
  }

  /**
   * Historical marking-scheme evidence decides
   * the default Answers-view method.
   *
   * For fixed-rate decrease questions the
   * multiplier-power route has evidence across
   * several years, so it remains the default.
   *
   * The 2024 year-by-year route is retained as
   * a selectable full-credit alternative because
   * that method is explicitly catalogued.
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
        "No valid compound-percentage worked-answer method could be generated.",
        `Family: ${generated.familyId}.`,
        `Profile: ${generated.numericProfile.kind}.`,
      ].join(
        " "
      )
    );
  }

  return {
    defaultMethodFamilyId:
      methods[0]
        .methodFamilyId,

    methods,
  };
}