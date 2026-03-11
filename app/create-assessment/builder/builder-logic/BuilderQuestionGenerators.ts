import type { PaperPart } from "@/shared-types/PaperParts";
import type {
  Concept,
  DifficultyLevel,
  QuestionSkillLink,
  Skill,
} from "@/shared-types/AssessmentTypes";

export type GeneratedQuestionData = {
  prompt?: string;
  answer?: string;
  marks?: number;
  questionCode?: string;
  promptParts?: PaperPart[];
  answerParts?: PaperPart[];
};

function textPart(value: string): PaperPart {
  return { kind: "text", value };
}

function mathPart(latex: string, displayMode = false): PaperPart {
  return { kind: "math", latex, displayMode };
}

function randomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function chooseOne<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function reduceFraction(numerator: number, denominator: number) {
  const sign = denominator < 0 ? -1 : 1;
  const g = gcd(numerator, denominator);
  return {
    numerator: (sign * numerator) / g,
    denominator: (sign * denominator) / g,
  };
}

function formatFractionPlain(numerator: number, denominator: number): string {
  const reduced = reduceFraction(numerator, denominator);
  if (reduced.denominator === 1) return `${reduced.numerator}`;
  return `${reduced.numerator}/${reduced.denominator}`;
}

function formatFractionLatex(numerator: number, denominator: number): string {
  const reduced = reduceFraction(numerator, denominator);
  if (reduced.denominator === 1) return `${reduced.numerator}`;
  return `\\dfrac{${reduced.numerator}}{${reduced.denominator}}`;
}

function nonSquarePartFromRoot(radicand: number) {
  let outside = 1;
  let inside = radicand;

  for (let i = 2; i * i <= inside; i += 1) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= i * i;
    }
  }

  return { outside, inside };
}

function formatSimplifiedSurdPlain(radicand: number): string {
  const { outside, inside } = nonSquarePartFromRoot(radicand);
  if (inside === 1) return `${outside}`;
  if (outside === 1) return `√${inside}`;
  return `${outside}√${inside}`;
}

function formatSimplifiedSurdLatex(radicand: number): string {
  const { outside, inside } = nonSquarePartFromRoot(radicand);
  if (inside === 1) return `${outside}`;
  if (outside === 1) return `\\sqrt{${inside}}`;
  return `${outside}\\sqrt{${inside}}`;
}

export function conceptSelectionText(concept: Concept): string {
  const short = concept.shortLabel?.trim();
  if (short) return `${concept.code} ${short}`;
  return concept.label.trim();
}

export function getConceptFromSelection(
  skill: Skill,
  selectedConcept: string
): Concept | undefined {
  const trimmed = selectedConcept.trim();

  return skill.concepts.find((c) => {
    const compact = conceptSelectionText(c);
    return (
      c.label === trimmed ||
      c.code === trimmed ||
      c.shortLabel === trimmed ||
      compact === trimmed
    );
  });
}

function buildQuestionCode(domain: string, skillCode: string, conceptCode: string) {
  const safeSkill = skillCode.replace(/\./g, "");
  const safeConcept = conceptCode.replace(/\./g, "");
  return `NQ_N5_${domain}_${safeSkill}_${safeConcept}`;
}

function generateSurdsSimplify(difficulty: DifficultyLevel): GeneratedQuestionData {
  const squareFactorsByDifficulty: Record<DifficultyLevel, number[]> = {
    1: [4, 9],
    2: [4, 9, 16],
    3: [4, 9, 16, 25],
    4: [4, 9, 16, 25, 36],
    5: [9, 16, 25, 36, 49],
  };

  const insideChoicesByDifficulty: Record<DifficultyLevel, number[]> = {
    1: [2, 3, 5, 6],
    2: [2, 3, 5, 6, 7, 10],
    3: [2, 3, 5, 6, 7, 10, 11, 12],
    4: [2, 3, 5, 6, 7, 10, 11, 13, 15],
    5: [2, 3, 5, 6, 7, 10, 11, 13, 15, 17],
  };

  const squareFactor = chooseOne(squareFactorsByDifficulty[difficulty]);
  const inside = chooseOne(insideChoicesByDifficulty[difficulty]);
  const radicand = squareFactor * inside;

  return {
    prompt: `Simplify √${radicand}.`,
    answer: formatSimplifiedSurdPlain(radicand),
    marks: difficulty >= 4 ? 3 : 2,
    questionCode: "NQ_N5_NUM_N01_N11_SurdsSimplification",
    promptParts: [textPart("Simplify "), mathPart(`\\sqrt{${radicand}}`), textPart(".")],
    answerParts: [mathPart(formatSimplifiedSurdLatex(radicand))],
  };
}

function generateRationalisingDenominator(difficulty: DifficultyLevel): GeneratedQuestionData {
  const numerator = randomInt(1, difficulty >= 3 ? 7 : 5);
  const radicandChoices =
    difficulty <= 2 ? [2, 3, 5, 6, 7] : [2, 3, 5, 6, 7, 10, 11, 13];
  const radicand = chooseOne(radicandChoices);

  return {
    prompt: `Write ${numerator}/√${radicand} with a rational denominator.`,
    answer: `${numerator}√${radicand}/${radicand}`,
    marks: 3,
    questionCode: "NQ_N5_NUM_N01_N12_RationalisingDenominators",
    promptParts: [
      textPart("Write "),
      mathPart(`\\dfrac{${numerator}}{\\sqrt{${radicand}}}`),
      textPart(" with a rational denominator."),
    ],
    answerParts: [mathPart(`\\dfrac{${numerator}\\sqrt{${radicand}}}{${radicand}}`)],
  };
}

function generateIndicesProductQuotient(difficulty: DifficultyLevel): GeneratedQuestionData {
  const variable = chooseOne(["a", "b", "x", "y"]);
  const useDivision = Math.random() < 0.5;

  const exponentCap = difficulty <= 2 ? 6 : difficulty === 3 ? 8 : 10;
  const m = randomInt(difficulty >= 4 ? -4 : 1, exponentCap);
  const n = randomInt(difficulty >= 3 ? -4 : 1, exponentCap);

  const result = useDivision ? m - n : m + n;
  const expression = useDivision
    ? `${variable}^{${m}} \\div ${variable}^{${n}}`
    : `${variable}^{${m}} \\times ${variable}^{${n}}`;

  return {
    prompt: `Simplify ${
      useDivision ? `${variable}^${m} ÷ ${variable}^${n}` : `${variable}^${m} × ${variable}^${n}`
    }.`,
    answer: `${variable}^${result}`,
    marks: 2,
    questionCode: "NQ_N5_NUM_N02_N21_ProductQuotientIndices",
    promptParts: [textPart("Simplify "), mathPart(expression), textPart(".")],
    answerParts: [mathPart(`${variable}^{${result}}`)],
  };
}

function generatePowerOfProduct(): GeneratedQuestionData {
  const a = chooseOne(["a", "x", "p"]);
  const b = chooseOne(["b", "y", "q"]);
  const power = randomInt(2, 5);

  return {
    prompt: `Expand (${a}${b})^${power} using the laws of indices.`,
    answer: `${a}^${power}${b}^${power}`,
    marks: 2,
    questionCode: "NQ_N5_NUM_N02_N22_PowerOfProduct",
    promptParts: [
      textPart("Expand "),
      mathPart(`(${a}${b})^{${power}}`),
      textPart(" using the laws of indices."),
    ],
    answerParts: [mathPart(`${a}^{${power}}${b}^{${power}}`)],
  };
}

function generatePowerOfPower(): GeneratedQuestionData {
  const variable = chooseOne(["a", "x", "m"]);
  const outer = randomInt(2, 5);
  const inner = randomInt(2, 5);

  return {
    prompt: `Simplify (${variable}^${inner})^${outer}.`,
    answer: `${variable}^${inner * outer}`,
    marks: 2,
    questionCode: "NQ_N5_NUM_N02_N23_PowerOfPower",
    promptParts: [textPart("Simplify "), mathPart(`(${variable}^{${inner}})^{${outer}}`), textPart(".")],
    answerParts: [mathPart(`${variable}^{${inner * outer}}`)],
  };
}

function generateFractionalIndices(difficulty: DifficultyLevel): GeneratedQuestionData {
  const denominator = chooseOne([2, 3]);
  const numerator = denominator === 2 ? chooseOne([1, 3]) : chooseOne([1, 2, 4]);
  const base =
    denominator === 2
      ? chooseOne([4, 9, 16, 25, 36, 49])
      : chooseOne([8, 27, 64, 125]);

  const variable = chooseOne(["a", "x"]);

  if (difficulty <= 3) {
    const powerValue = Math.pow(base, numerator / denominator);

    return {
      prompt: `Evaluate ${base}^(${numerator}/${denominator}).`,
      answer: `${powerValue}`,
      marks: 3,
      questionCode: "NQ_N5_NUM_N02_N24_FractionalIndices",
      promptParts: [textPart("Evaluate "), mathPart(`${base}^{\\frac{${numerator}}{${denominator}}}`), textPart(".")],
      answerParts: [mathPart(`${powerValue}`)],
    };
  }

  const latex =
    numerator === 1
      ? `\\sqrt[${denominator}]{${variable}}`
      : `\\sqrt[${denominator}]{${variable}^{${numerator}}}`;

  return {
    prompt: `Write ${variable}^(${numerator}/${denominator}) in radical form.`,
    answer: latex,
    marks: 3,
    questionCode: "NQ_N5_NUM_N02_N24_FractionalIndices",
    promptParts: [
      textPart("Write "),
      mathPart(`${variable}^{\\frac{${numerator}}{${denominator}}}`),
      textPart(" in radical form."),
    ],
    answerParts: [mathPart(latex)],
  };
}

function generateScientificNotation(difficulty: DifficultyLevel): GeneratedQuestionData {
  const a = chooseOne([1.2, 1.5, 2.4, 3.6, 4.8, 6.2, 7.5, 8.4]);
  const b = chooseOne([1.1, 1.4, 2.5, 3.2, 4.6, 5.5]);
  const powerA = randomInt(2, 6);
  const powerB = randomInt(2, 6);
  const useDivision = difficulty >= 3 ? Math.random() < 0.5 : false;

  if (useDivision) {
    const value = (a * Math.pow(10, powerA)) / (b * Math.pow(10, powerB));
    const answer = value.toExponential(2);
    const [mantissa, exponentRaw] = answer.split("e");
    const exponent = Number(exponentRaw);

    return {
      prompt: `Calculate (${a} × 10^${powerA}) ÷ (${b} × 10^${powerB}). Give your answer in scientific notation.`,
      answer: `${mantissa} × 10^${exponent}`,
      marks: 3,
      questionCode: "NQ_N5_NUM_N02_N25_ScientificNotation",
      promptParts: [
        textPart("Calculate "),
        mathPart(`(${a} \\times 10^{${powerA}}) \\div (${b} \\times 10^{${powerB}})`),
        textPart(". Give your answer in scientific notation."),
      ],
      answerParts: [mathPart(`${mantissa} \\times 10^{${exponent}}`)],
    };
  }

  const value = a * Math.pow(10, powerA) * (b * Math.pow(10, powerB));
  const answer = value.toExponential(2);
  const [mantissa, exponentRaw] = answer.split("e");
  const exponent = Number(exponentRaw);

  return {
    prompt: `Calculate (${a} × 10^${powerA}) × (${b} × 10^${powerB}). Give your answer in scientific notation.`,
    answer: `${mantissa} × 10^${exponent}`,
    marks: 3,
    questionCode: "NQ_N5_NUM_N02_N25_ScientificNotation",
    promptParts: [
      textPart("Calculate "),
      mathPart(`(${a} \\times 10^{${powerA}}) \\times (${b} \\times 10^{${powerB}})`),
      textPart(". Give your answer in scientific notation."),
    ],
    answerParts: [mathPart(`${mantissa} \\times 10^{${exponent}}`)],
  };
}

function generateSignificantFigures(difficulty: DifficultyLevel): GeneratedQuestionData {
  const sf = chooseOne([2, 3]);
  const whole = randomInt(10, difficulty >= 4 ? 9999 : 999);
  const decimalPart = randomInt(100, 9999);
  const value = Number(`${whole}.${decimalPart}`);
  const rounded = Number(value.toPrecision(sf)).toString();

  return {
    prompt: `Round ${value} to ${sf} significant figures.`,
    answer: rounded,
    marks: 1,
    questionCode: "NQ_N5_NUM_N03_N31_SignificantFigures",
    promptParts: [
      textPart("Round "),
      mathPart(`${value}`),
      textPart(` to ${sf} significant figures.`),
    ],
    answerParts: [mathPart(rounded)],
  };
}

function generateReversePercentage(): GeneratedQuestionData {
  const original = randomInt(80, 400);
  const percent = chooseOne([5, 10, 15, 20, 25]);
  const increase = Math.random() < 0.5;

  const finalAmount = increase
    ? original * (1 + percent / 100)
    : original * (1 - percent / 100);

  const finalText = Number.isInteger(finalAmount) ? `${finalAmount}` : finalAmount.toFixed(2);

  return {
    prompt: increase
      ? `After an increase of ${percent}%, a price is £${finalText}. Find the original price.`
      : `After a decrease of ${percent}%, a price is £${finalText}. Find the original price.`,
    answer: `£${original}`,
    marks: 3,
    questionCode: "NQ_N5_NUM_N04_N41_ReversePercentage",
    promptParts: [
      textPart(
        increase
          ? `After an increase of ${percent}%, a price is £${finalText}. Find the original price.`
          : `After a decrease of ${percent}%, a price is £${finalText}. Find the original price.`
      ),
    ],
    answerParts: [textPart(`£${original}`)],
  };
}

function generateAppreciation(): GeneratedQuestionData {
  const principal = randomInt(200, 3000);
  const rate = chooseOne([2, 3, 4, 5, 6, 8, 10]);
  const years = randomInt(2, 5);
  const value = principal * Math.pow(1 + rate / 100, years);

  return {
    prompt: `A value of £${principal} appreciates by ${rate}% each year for ${years} years. Calculate the final value.`,
    answer: `£${value.toFixed(2)}`,
    marks: 3,
    questionCode: "NQ_N5_NUM_N04_N42_Appreciation",
    promptParts: [
      textPart(
        `A value of £${principal} appreciates by ${rate}% each year for ${years} years. Calculate the final value.`
      ),
    ],
    answerParts: [textPart(`£${value.toFixed(2)}`)],
  };
}

function generateDepreciation(): GeneratedQuestionData {
  const principal = randomInt(500, 5000);
  const rate = chooseOne([5, 8, 10, 12, 15, 20]);
  const years = randomInt(2, 5);
  const value = principal * Math.pow(1 - rate / 100, years);

  return {
    prompt: `A machine worth £${principal} depreciates by ${rate}% each year for ${years} years. Calculate its value after ${years} years.`,
    answer: `£${value.toFixed(2)}`,
    marks: 3,
    questionCode: "NQ_N5_NUM_N04_N43_Depreciation",
    promptParts: [
      textPart(
        `A machine worth £${principal} depreciates by ${rate}% each year for ${years} years. Calculate its value after ${years} years.`
      ),
    ],
    answerParts: [textPart(`£${value.toFixed(2)}`)],
  };
}

function generateFractions(difficulty: DifficultyLevel): GeneratedQuestionData {
  const denominatorCap = difficulty <= 2 ? 12 : 20;

  const a = randomInt(1, denominatorCap - 1);
  const b = randomInt(2, denominatorCap);
  const c = randomInt(1, denominatorCap - 1);
  const d = randomInt(2, denominatorCap);

  const op = chooseOne(["+", "-", "×", "÷"] as const);

  if (op === "+") {
    const common = lcm(b, d);
    const resultNum = (a * common) / b + (c * common) / d;
    const result = reduceFraction(resultNum, common);

    return {
      prompt: `Calculate ${a}/${b} + ${c}/${d}.`,
      answer: formatFractionPlain(result.numerator, result.denominator),
      marks: 2,
      questionCode: "NQ_N5_NUM_N05_N51_Fractions",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} + \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(result.numerator, result.denominator))],
    };
  }

  if (op === "-") {
    const common = lcm(b, d);
    const resultNum = (a * common) / b - (c * common) / d;
    const result = reduceFraction(resultNum, common);

    return {
      prompt: `Calculate ${a}/${b} - ${c}/${d}.`,
      answer: formatFractionPlain(result.numerator, result.denominator),
      marks: 2,
      questionCode: "NQ_N5_NUM_N05_N51_Fractions",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} - \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(result.numerator, result.denominator))],
    };
  }

  if (op === "×") {
    const result = reduceFraction(a * c, b * d);

    return {
      prompt: `Calculate ${a}/${b} × ${c}/${d}.`,
      answer: formatFractionPlain(result.numerator, result.denominator),
      marks: 2,
      questionCode: "NQ_N5_NUM_N05_N51_Fractions",
      promptParts: [
        textPart("Calculate "),
        mathPart(`\\dfrac{${a}}{${b}} \\times \\dfrac{${c}}{${d}}`),
        textPart("."),
      ],
      answerParts: [mathPart(formatFractionLatex(result.numerator, result.denominator))],
    };
  }

  const result = reduceFraction(a * d, b * c);

  return {
    prompt: `Calculate ${a}/${b} ÷ ${c}/${d}.`,
    answer: formatFractionPlain(result.numerator, result.denominator),
    marks: 2,
    questionCode: "NQ_N5_NUM_N05_N51_Fractions",
    promptParts: [
      textPart("Calculate "),
      mathPart(`\\dfrac{${a}}{${b}} \\div \\dfrac{${c}}{${d}}`),
      textPart("."),
    ],
    answerParts: [mathPart(formatFractionLatex(result.numerator, result.denominator))],
  };
}

export function buildGenerated(
  skill: Skill,
  selectedConcept: string,
  difficulty: DifficultyLevel
): GeneratedQuestionData {
  const concept = getConceptFromSelection(skill, selectedConcept);
  const conceptCode = concept?.code ?? selectedConcept;

  switch (conceptCode) {
    case "N1.1":
      return generateSurdsSimplify(difficulty);

    case "N1.2":
      return generateRationalisingDenominator(difficulty);

    case "N2.1":
      return generateIndicesProductQuotient(difficulty);

    case "N2.2":
      return generatePowerOfProduct();

    case "N2.3":
      return generatePowerOfPower();

    case "N2.4":
      return generateFractionalIndices(difficulty);

    case "N2.5":
      return generateScientificNotation(difficulty);

    case "N3.1":
      return generateSignificantFigures(difficulty);

    case "N4.1":
      return generateReversePercentage();

    case "N4.2":
      return generateAppreciation();

    case "N4.3":
      return generateDepreciation();

    case "N5.1":
      return generateFractions(difficulty);

    default:
      return {
        prompt: concept?.fullDescription
          ? `Placeholder question for ${concept.code}: ${concept.fullDescription}`
          : `Placeholder question for ${skill.code}: ${selectedConcept}`,
        answer: "Answer not yet implemented.",
        marks: concept?.marks ?? 2,
        questionCode: buildQuestionCode(
          skill.domain ?? "GEN",
          skill.code,
          concept?.code ?? "C00"
        ),
        promptParts: [
          textPart(
            concept?.fullDescription
              ? `Placeholder question for ${concept.code}: ${concept.fullDescription}`
              : `Placeholder question for ${skill.code}: ${selectedConcept}`
          ),
        ],
        answerParts: [textPart("Answer not yet implemented.")],
      };
  }
}

export function buildSkillLinks(
  skill: Skill,
  concept: Concept | undefined
): QuestionSkillLink[] {
  if (!concept) {
    return [
      {
        skillId: skill.id,
        role: "primary",
      },
    ];
  }

  return [
    {
      skillId: skill.id,
      conceptId: concept.id,
      role: "primary",
    },
  ];
}