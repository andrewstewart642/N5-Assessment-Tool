import type {
  WorkedAnswerLine,
  WorkedAnswerMethod,
  WorkedAnswerSet,
} from "@/shared-types/AnswerGenerationTypes";

import type {
  Fraction,
  GeneratedFractionQuestion,
  MixedNumber,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/Numerical/N05_Fractions/N05_1_Fractions/N05_1_FractionsQuestionWriter";

import {
  getN5MathsAnswerViewMethodEvidence,
} from "@/src/Courses/National5Maths/ExamQuestionAndAnswerCatalog/MarkingSchemes/National5MathsExamMarkingSchemeCatalog";

import {
  ANSWER_METHOD_FAMILY_IDS,
} from "@/src/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/AnswerMethodIds";


const FRACTION_PAPER =
  "P1" as const;


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
        kind:
          "text",

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


function gcd(
  a: number,
  b: number
): number {
  let x =
    Math.abs(a);

  let y =
    Math.abs(b);

  while (
    y !== 0
  ) {
    const next =
      x % y;

    x = y;
    y = next;
  }

  return x || 1;
}


function makeFraction(
  numerator: number,
  denominator: number
): Fraction {
  if (
    denominator === 0
  ) {
    throw new Error(
      "Denominator cannot be zero."
    );
  }

  const sign =
    denominator < 0
      ? -1
      : 1;

  const adjustedNumerator =
    numerator *
    sign;

  const adjustedDenominator =
    Math.abs(
      denominator
    );

  const divisor =
    gcd(
      adjustedNumerator,
      adjustedDenominator
    );

  return {
    numerator:
      adjustedNumerator /
      divisor,

    denominator:
      adjustedDenominator /
      divisor,
  };
}


function addFractions(
  first: Fraction,
  second: Fraction
): Fraction {
  return makeFraction(
    first.numerator *
      second.denominator +
      second.numerator *
        first.denominator,

    first.denominator *
      second.denominator
  );
}


function subtractFractions(
  first: Fraction,
  second: Fraction
): Fraction {
  return makeFraction(
    first.numerator *
      second.denominator -
      second.numerator *
        first.denominator,

    first.denominator *
      second.denominator
  );
}


function multiplyFractions(
  first: Fraction,
  second: Fraction
): Fraction {
  return makeFraction(
    first.numerator *
      second.numerator,

    first.denominator *
      second.denominator
  );
}


function fractionsEqual(
  first: Fraction,
  second: Fraction
): boolean {
  return (
    first.numerator *
      second.denominator ===
    second.numerator *
      first.denominator
  );
}


function formatFraction(
  fraction: Fraction
): string {
  if (
    fraction.denominator ===
    1
  ) {
    return String(
      fraction.numerator
    );
  }

  return (
    `${fraction.numerator}/${fraction.denominator}`
  );
}


function formatRawFraction(
  numerator: number,
  denominator: number
): string {
  if (
    denominator ===
    1
  ) {
    return String(
      numerator
    );
  }

  return (
    `${numerator}/${denominator}`
  );
}


function formatMixedNumber(
  mixed: MixedNumber
): string {
  return (
    `${mixed.whole} ${formatFraction(
      mixed.fraction
    )}`
  );
}


function formatAnswer(
  fraction: Fraction
): string {
  if (
    fraction.denominator ===
    1
  ) {
    return String(
      fraction.numerator
    );
  }

  if (
    Math.abs(
      fraction.numerator
    ) >
    fraction.denominator
  ) {
    const whole =
      Math.trunc(
        fraction.numerator /
          fraction.denominator
      );

    const remainder =
      Math.abs(
        fraction.numerator %
          fraction.denominator
      );

    if (
      remainder === 0
    ) {
      return String(
        whole
      );
    }

    return (
      `${whole} ${remainder}/${fraction.denominator}`
    );
  }

  return formatFraction(
    fraction
  );
}


function numeratorAtDenominator(
  fraction: Fraction,
  denominator: number
): number | null {
  if (
    denominator %
      fraction.denominator !==
    0
  ) {
    return null;
  }

  return (
    fraction.numerator *
    (
      denominator /
      fraction.denominator
    )
  );
}


/**
 * All historical years remain valid evidence.
 *
 * As with reverse percentages, recent evidence
 * has slightly greater influence when choosing
 * the default displayed method.
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


/**
 * Fraction questions currently belong to
 * National 5 Paper 1.
 *
 * The catalogue helper therefore admits only
 * same-paper, full-credit illustrative evidence.
 */
function methodEvidenceScore(
  questionFamilyId: string,
  methodFamilyId: string
): number {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,
      paper:
        FRACTION_PAPER,
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


function sourceEvidenceIdsForMethod(
  questionFamilyId: string,
  methodFamilyId: string
): string[] {
  const evidence =
    getN5MathsAnswerViewMethodEvidence({
      questionFamilyId,
      paper:
        FRACTION_PAPER,
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
    GeneratedFractionQuestion;

  methodFamilyId:
    string;

  lines:
    WorkedAnswerLine[];
}): WorkedAnswerMethod | null {
  const {
    generated,
    methodFamilyId,
    lines,
  } = args;

  const evidenceScore =
    methodEvidenceScore(
      generated.familyId,
      methodFamilyId
    );

  if (
    evidenceScore <= 0
  ) {
    return null;
  }

  return {
    methodFamilyId,

    lines,

    evidenceScore,

    sourceEvidenceIds:
      sourceEvidenceIdsForMethod(
        generated.familyId,
        methodFamilyId
      ),
  };
}


/**
 * ADDITION
 *
 * Historical route:
 * retain the mixed-number structure and
 * place the fractional parts over a common
 * denominator.
 */
function buildAddMixedComponentsMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_PROPER_ADD"
  ) {
    return null;
  }

  const mixedNumerator =
    numeratorAtDenominator(
      numeric.mixed.fraction,
      numeric.commonDenominator
    );

  const properNumerator =
    numeratorAtDenominator(
      numeric.proper,
      numeric.commonDenominator
    );

  if (
    mixedNumerator === null ||
    properNumerator === null
  ) {
    return null;
  }

  const calculated =
    addFractions(
      numeric.mixedImproper,
      numeric.proper
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const commonDenominatorLine =
    [
      `${formatMixedNumber(
        numeric.mixed
      )} + ${formatFraction(
        numeric.proper
      )}`,

      "=",

      `${numeric.mixed.whole} + ` +
        `${formatRawFraction(
          mixedNumerator,
          numeric.commonDenominator
        )} + ` +
        `${formatRawFraction(
          properNumerator,
          numeric.commonDenominator
        )}`,
    ].join(" ");

  const answerLine =
    [
      "=",
      formatAnswer(
        numeric.answer
      ),
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_ADD_MIXED_COMPONENTS,

    lines: [
      textLine(
        "fraction-add-mixed-common-denominator",
        commonDenominatorLine,
        [1]
      ),

      textLine(
        "fraction-add-mixed-answer",
        answerLine,
        [2]
      ),
    ],
  });
}


/**
 * ADDITION
 *
 * Historical route:
 * convert the mixed number to an improper
 * fraction, then use a common denominator.
 */
function buildAddImproperMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_PROPER_ADD"
  ) {
    return null;
  }

  const mixedNumerator =
    numeratorAtDenominator(
      numeric.mixedImproper,
      numeric.commonDenominator
    );

  const properNumerator =
    numeratorAtDenominator(
      numeric.proper,
      numeric.commonDenominator
    );

  if (
    mixedNumerator === null ||
    properNumerator === null
  ) {
    return null;
  }

  const calculated =
    addFractions(
      numeric.mixedImproper,
      numeric.proper
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const commonDenominatorLine =
    [
      `${formatFraction(
        numeric.mixedImproper
      )} + ${formatFraction(
        numeric.proper
      )}`,

      "=",

      `${formatRawFraction(
        mixedNumerator,
        numeric.commonDenominator
      )} + ${formatRawFraction(
        properNumerator,
        numeric.commonDenominator
      )}`,
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_ADD_IMPROPER,

    lines: [
      textLine(
        "fraction-add-improper-common-denominator",
        commonDenominatorLine,
        [1]
      ),

      textLine(
        "fraction-add-improper-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


/**
 * SUBTRACTION
 *
 * Historical route:
 * retain the mixed-number structure and use
 * a common denominator.
 *
 * If necessary, one whole is borrowed from
 * the first mixed number before subtraction.
 */
function buildSubtractMixedComponentsMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_MIXED_SUBTRACT"
  ) {
    return null;
  }

  const firstNumerator =
    numeratorAtDenominator(
      numeric.first.fraction,
      numeric.commonDenominator
    );

  const secondNumerator =
    numeratorAtDenominator(
      numeric.second.fraction,
      numeric.commonDenominator
    );

  if (
    firstNumerator === null ||
    secondNumerator === null
  ) {
    return null;
  }

  const calculated =
    subtractFractions(
      numeric.firstImproper,
      numeric.secondImproper
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  let commonDenominatorLine:
    string;

  if (
    firstNumerator >=
    secondNumerator
  ) {
    commonDenominatorLine =
      [
        `${formatMixedNumber(
          numeric.first
        )} − ${formatMixedNumber(
          numeric.second
        )}`,

        "=",

        `${numeric.first.whole} ` +
          `${formatRawFraction(
            firstNumerator,
            numeric.commonDenominator
          )} − ` +
          `${numeric.second.whole} ` +
          `${formatRawFraction(
            secondNumerator,
            numeric.commonDenominator
          )}`,
      ].join(" ");
  } else {
    const borrowedWhole =
      numeric.first.whole -
      1;

    const borrowedNumerator =
      firstNumerator +
      numeric.commonDenominator;

    commonDenominatorLine =
      [
        `${formatMixedNumber(
          numeric.first
        )} − ${formatMixedNumber(
          numeric.second
        )}`,

        "=",

        `${borrowedWhole} ` +
          `${formatRawFraction(
            borrowedNumerator,
            numeric.commonDenominator
          )} − ` +
          `${numeric.second.whole} ` +
          `${formatRawFraction(
            secondNumerator,
            numeric.commonDenominator
          )}`,
      ].join(" ");
  }

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_SUBTRACT_MIXED_COMPONENTS,

    lines: [
      textLine(
        "fraction-subtract-mixed-common-denominator",
        commonDenominatorLine,
        [1]
      ),

      textLine(
        "fraction-subtract-mixed-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


/**
 * SUBTRACTION
 *
 * Historical route:
 * convert both mixed numbers to improper
 * fractions and use a common denominator.
 */
function buildSubtractImproperMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_MIXED_SUBTRACT"
  ) {
    return null;
  }

  const firstNumerator =
    numeratorAtDenominator(
      numeric.firstImproper,
      numeric.commonDenominator
    );

  const secondNumerator =
    numeratorAtDenominator(
      numeric.secondImproper,
      numeric.commonDenominator
    );

  if (
    firstNumerator === null ||
    secondNumerator === null
  ) {
    return null;
  }

  const calculated =
    subtractFractions(
      numeric.firstImproper,
      numeric.secondImproper
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const commonDenominatorLine =
    [
      `${formatFraction(
        numeric.firstImproper
      )} − ${formatFraction(
        numeric.secondImproper
      )}`,

      "=",

      `${formatRawFraction(
        firstNumerator,
        numeric.commonDenominator
      )} − ${formatRawFraction(
        secondNumerator,
        numeric.commonDenominator
      )}`,
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_SUBTRACT_IMPROPER,

    lines: [
      textLine(
        "fraction-subtract-improper-common-denominator",
        commonDenominatorLine,
        [1]
      ),

      textLine(
        "fraction-subtract-improper-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


/**
 * MULTIPLICATION
 *
 * Historical route:
 * convert the mixed number to an improper
 * fraction and start the multiplication.
 */
function buildMultiplyImproperMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_PROPER_MULTIPLY"
  ) {
    return null;
  }

  const calculated =
    multiplyFractions(
      numeric.mixedImproper,
      numeric.proper
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const multiplicationExpression =
    numeric.displayOrder ===
    "MIXED_THEN_PROPER"
      ? `${formatFraction(
          numeric.mixedImproper
        )} × ${formatFraction(
          numeric.proper
        )}`
      : `${formatFraction(
          numeric.proper
        )} × ${formatFraction(
          numeric.mixedImproper
        )}`;

  const rawLine =
    [
      multiplicationExpression,
      "=",
      formatRawFraction(
        numeric.rawIntermediate
          .numerator,
        numeric.rawIntermediate
          .denominator
      ),
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_MULTIPLY_IMPROPER,

    lines: [
      textLine(
        "fraction-multiply-improper-start",
        rawLine,
        [1]
      ),

      textLine(
        "fraction-multiply-improper-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


/**
 * MULTIPLICATION
 *
 * Historical alternative:
 * split the mixed number into its whole and
 * fractional components and distribute the
 * proper fraction across both.
 */
function buildMultiplyDistributiveMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_PROPER_MULTIPLY"
  ) {
    return null;
  }

  const wholeAsFraction:
    Fraction = {
      numerator:
        numeric.mixed.whole,

      denominator:
        1,
    };

  const wholeProduct =
    multiplyFractions(
      wholeAsFraction,
      numeric.proper
    );

  const fractionProduct =
    multiplyFractions(
      numeric.mixed.fraction,
      numeric.proper
    );

  const calculated =
    addFractions(
      wholeProduct,
      fractionProduct
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const distributionLine =
    numeric.displayOrder ===
    "MIXED_THEN_PROPER"
      ? [
          `(${numeric.mixed.whole} + ` +
            `${formatFraction(
              numeric.mixed.fraction
            )}) × ${formatFraction(
              numeric.proper
            )}`,

          "=",

          `${numeric.mixed.whole} × ` +
            `${formatFraction(
              numeric.proper
            )} + ` +
            `${formatFraction(
              numeric.mixed.fraction
            )} × ` +
            `${formatFraction(
              numeric.proper
            )}`,
        ].join(" ")

      : [
          `${formatFraction(
            numeric.proper
          )} × (` +
            `${numeric.mixed.whole} + ` +
            `${formatFraction(
              numeric.mixed.fraction
            )})`,

          "=",

          `${formatFraction(
            numeric.proper
          )} × ${numeric.mixed.whole} + ` +
            `${formatFraction(
              numeric.proper
            )} × ` +
            `${formatFraction(
              numeric.mixed.fraction
            )}`,
        ].join(" ");

  const productLine =
    [
      "=",
      `${formatFraction(
        wholeProduct
      )} + ${formatFraction(
        fractionProduct
      )}`,
      "=",
      formatAnswer(
        numeric.answer
      ),
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_MULTIPLY_DISTRIBUTIVE,

    lines: [
      textLine(
        "fraction-multiply-distributive-start",
        distributionLine,
        [1]
      ),

      textLine(
        "fraction-multiply-distributive-answer",
        productLine,
        [2]
      ),
    ],
  });
}


/**
 * DIVISION
 *
 * Historical route:
 * convert the mixed number to an improper
 * fraction, then multiply by the reciprocal.
 */
function buildDivideReciprocalMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "MIXED_PROPER_DIVIDE"
  ) {
    return null;
  }

  const calculated =
    multiplyFractions(
      numeric.mixedImproper,
      numeric.reciprocal
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const reciprocalLine =
    [
      `${formatFraction(
        numeric.mixedImproper
      )} × ${formatFraction(
        numeric.reciprocal
      )}`,

      "=",

      formatRawFraction(
        numeric.rawIntermediate
          .numerator,
        numeric.rawIntermediate
          .denominator
      ),
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_DIVIDE_RECIPROCAL,

    lines: [
      textLine(
        "fraction-divide-reciprocal-start",
        reciprocalLine,
        [1]
      ),

      textLine(
        "fraction-divide-reciprocal-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


/**
 * BRACKETED FRACTIONS
 *
 * Historical route:
 * evaluate the addition inside the bracket
 * first, then multiply by the outside fraction.
 */
function buildBracketThenMultiplyMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "BRACKETED_SUM_AND_MULTIPLY"
  ) {
    return null;
  }

  const firstNumerator =
    numeratorAtDenominator(
      numeric.first,
      numeric.commonDenominator
    );

  const secondNumerator =
    numeratorAtDenominator(
      numeric.second,
      numeric.commonDenominator
    );

  if (
    firstNumerator === null ||
    secondNumerator === null
  ) {
    return null;
  }

  const calculated =
    multiplyFractions(
      numeric.multiplier,
      numeric.bracketSum
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const bracketLine =
    [
      `${formatFraction(
        numeric.multiplier
      )} × (`,

      `${formatRawFraction(
        firstNumerator,
        numeric.commonDenominator
      )} + ${formatRawFraction(
        secondNumerator,
        numeric.commonDenominator
      )}`,

      ")",

      "=",

      `${formatFraction(
        numeric.multiplier
      )} × ${formatFraction(
        numeric.bracketSum
      )}`,
    ].join(" ");

  const multiplicationLine =
    [
      "=",

      formatRawFraction(
        numeric.rawIntermediate
          .numerator,
        numeric.rawIntermediate
          .denominator
      ),

      "=",

      formatAnswer(
        numeric.answer
      ),
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_BRACKET_THEN_MULTIPLY,

    lines: [
      textLine(
        "fraction-bracket-first",
        bracketLine,
        [1]
      ),

      textLine(
        "fraction-bracket-multiply-answer",
        multiplicationLine,
        [2]
      ),
    ],
  });
}


/**
 * BRACKETED FRACTIONS
 *
 * Historical alternative:
 * distribute the outside fraction across both
 * terms in the bracket, then add.
 */
function buildDistributeThenAddMethod(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerMethod | null {
  const numeric =
    generated.numericProfile;

  if (
    numeric.kind !==
    "BRACKETED_SUM_AND_MULTIPLY"
  ) {
    return null;
  }

  const firstProduct =
    multiplyFractions(
      numeric.multiplier,
      numeric.first
    );

  const secondProduct =
    multiplyFractions(
      numeric.multiplier,
      numeric.second
    );

  const calculated =
    addFractions(
      firstProduct,
      secondProduct
    );

  if (
    !fractionsEqual(
      calculated,
      numeric.answer
    )
  ) {
    return null;
  }

  const distributionLine =
    [
      `${formatFraction(
        numeric.multiplier
      )} × ${formatFraction(
        numeric.first
      )}`,

      "+",

      `${formatFraction(
        numeric.multiplier
      )} × ${formatFraction(
        numeric.second
      )}`,

      "=",

      `${formatFraction(
        firstProduct
      )} + ${formatFraction(
        secondProduct
      )}`,
    ].join(" ");

  return buildMethod({
    generated,

    methodFamilyId:
      ANSWER_METHOD_FAMILY_IDS
        .FRACTION_DISTRIBUTE_THEN_ADD,

    lines: [
      textLine(
        "fraction-distribute-first",
        distributionLine,
        [1]
      ),

      textLine(
        "fraction-distribute-answer",
        `= ${formatAnswer(
          numeric.answer
        )}`,
        [2]
      ),
    ],
  });
}


export function generateN5MathsFractionWorkedAnswers(
  generated:
    GeneratedFractionQuestion
): WorkedAnswerSet {
  const methods:
    WorkedAnswerMethod[] =
      [];


  const candidates = [
    buildAddMixedComponentsMethod(
      generated
    ),

    buildAddImproperMethod(
      generated
    ),

    buildSubtractMixedComponentsMethod(
      generated
    ),

    buildSubtractImproperMethod(
      generated
    ),

    buildMultiplyImproperMethod(
      generated
    ),

    buildMultiplyDistributiveMethod(
      generated
    ),

    buildDivideReciprocalMethod(
      generated
    ),

    buildBracketThenMultiplyMethod(
      generated
    ),

    buildDistributeThenAddMethod(
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
   * Historical marking-scheme evidence is
   * authoritative when choosing the default
   * Answers-view method.
   *
   * Where two methods carry exactly the same
   * evidence score, the stable candidate order
   * above selects the conventional presentation:
   *
   * addition/subtraction:
   * mixed components before improper fractions
   *
   * bracketed expressions:
   * bracket first before distribution
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
        "No valid fraction worked-answer method could be generated.",
        `Family: ${generated.familyId}.`,
        `Operation: ${generated.operationType}.`,
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