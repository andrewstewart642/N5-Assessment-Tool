"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import SkillsTree from "@/app/create-assessment/builder/components/skills-tree/SkillsTree";
import AssessmentProgressHud from "@/app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud";
import SQAPageFrame from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAPageFrame";
import SQAN5FormulaSheet from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAN5FormulaSheet";
import SQAN5CoverPage from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAN5CoverPage";
import PaperQuestionLocked from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked";
import PaperQuestionDraft from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionDraft";
import MeasureBox from "@/app/create-assessment/builder/components/assessment-preview/MeasureBox";
import SettingsPanel from "@/app/create-assessment/builder/components/builder-controls/SettingsPanel";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { calculateEndTime } from "./AssessmentTiming";

import { skillsData } from "@/course-data/N5-Skills";
import { makeId } from "@/math-helpers/QuestionLogic";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import {
  APPEARANCE_STORAGE_KEY,
  getTheme,
  type AppearancePreference,
} from "@/app/ui/AppTheme";
import type { PaperPart } from "@/shared-types/PaperParts";
import type {
  Concept,
  DifficultyLevel,
  Paper,
  Question,
  QuestionSkillLink,
  Skill,
  StandardFilter,
} from "@/shared-types/AssessmentTypes";

import { getSpacingBasePx } from "@/app/paper-layout/N5-Question-Spacing-px";

import BuilderGlobalStyles from "./BuilderStyles";
import { buildBuilderPages, buildPreviewPages } from "./BuildPreviewPages";
import {
  A4_W_PX,
  clamp,
  estimateMinutes,
  spacingBasePxFor,
  sumActualQuestionMarks,
  sumMarks,
  type DraftByPaper,
  type EditDraftByPaper,
  type PreviewPage,
} from "./BuilderUtils";
import {
  HUD_HEIGHT_KEY,
  INCLUDE_COVER_SHEET_KEY,
  INCLUDE_FORMULA_SHEET_KEY,
  PANE_RATIO_KEY,
  SHOW_COVER_DATE_TIME_KEY,
  SHOW_PROGRESS_PANEL_KEY,
  SHOW_SCN_BOX_KEY,
  STORAGE_KEY,
} from "./BuilderStorageKeys";
import { loadAssessmentSetupBrief } from "../setup/AssessmentSetupStorage";

const META_NAME_KEY = "n5-builder-meta-name";
const META_CLASS_KEY = "n5-builder-meta-class";
const META_ASSESSMENT_DATE_KEY = "n5-builder-meta-assessment-date";

const P1_COVER_DATE_KEY = "n5-builder-p1-cover-date";
const P1_START_TIME_KEY = "n5-builder-p1-start-time";
const P1_END_TIME_KEY = "n5-builder-p1-end-time";

const P2_COVER_DATE_KEY = "n5-builder-p2-cover-date";
const P2_START_TIME_KEY = "n5-builder-p2-start-time";
const P2_END_TIME_KEY = "n5-builder-p2-end-time";

const P2_DATE_CUSTOM_KEY = "n5-builder-p2-date-custom";

type GeneratedQuestionData = {
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

function conceptSelectionText(concept: Concept): string {
  const short = concept.shortLabel?.trim();
  if (short) return `${concept.code} ${short}`;
  return concept.label.trim();
}

function getConceptFromSelection(skill: Skill, selectedConcept: string): Concept | undefined {
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
    prompt: `Simplify ${useDivision ? `${variable}^${m} ÷ ${variable}^${n}` : `${variable}^${m} × ${variable}^${n}`}.`,
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

function buildGenerated(
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
        questionCode: buildQuestionCode(skill.domain ?? "GEN", skill.code, concept?.code ?? "C00"),
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

function buildSkillLinks(skill: Skill, concept: Concept | undefined): QuestionSkillLink[] {
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

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

function parseFlexibleDateInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  const displayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (displayMatch) {
    const day = Number(displayMatch[1]);
    const month = Number(displayMatch[2]);
    const year = Number(displayMatch[3]);

    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
  }

  return null;
}

function formatDisplayDate(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function normaliseDisplayDate(input: string): string {
  const parsed = parseFlexibleDateInput(input);
  return parsed ? formatDisplayDate(parsed) : "";
}

function todayDisplayDate(): string {
  return formatDisplayDate(new Date());
}

function ordinalDay(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;

  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function formatCoverDate(input: string): string {
  if (!input) return "";

  const date = parseFlexibleDateInput(input);
  if (!date) return input;

  const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  const day = ordinalDay(date.getDate());

  return `${weekday}, ${day} ${month}`;
}

function buildTimeRange(start: string, end: string): string {
  if (start && end) return `${start} - ${end}`;
  if (start) return start;
  if (end) return end;
  return "";
}

type BuilderMetaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  width?: number;
};

function BuilderMetaField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
}: BuilderMetaFieldProps) {
  return (
    <label
      style={{
        display: "grid",
        gap: 3,
        minWidth: 0,
        width: width ?? "auto",
        fontFamily: UI_TYPO.family,
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: UI_TYPO.weightMedium,
          letterSpacing: 0,
          color: "rgba(214,227,243,0.74)",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          height: 30,
          borderRadius: 9,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          color: "#f7fbff",
          padding: "0 9px",
          fontSize: 13,
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightSemibold,
          minWidth: 0,
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    </label>
  );
}

type ViewingToggleProps = {
  value: Paper;
  onChange: (paper: Paper) => void;
};

function ViewingToggle({ value, onChange }: ViewingToggleProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 176,
        height: 34,
        borderRadius: 999,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: 2,
          width: "calc(50% - 2px)",
          borderRadius: 999,
          background: "rgba(37,99,235,0.20)",
          border: "1px solid rgba(96,165,250,0.95)",
          transform: value === "P1" ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 180ms ease",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => onChange("P1")}
          style={{
            border: "none",
            background: "transparent",
            color: value === "P1" ? "#f7fbff" : "rgba(214,227,243,0.76)",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightBold,
            lineHeight: 1,
          }}
        >
          Paper 1
        </button>

        <button
          type="button"
          onClick={() => onChange("P2")}
          style={{
            border: "none",
            background: "transparent",
            color: value === "P2" ? "#f7fbff" : "rgba(214,227,243,0.76)",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightBold,
            lineHeight: 1,
          }}
        >
          Paper 2
        </button>
      </div>
    </div>
  );
}

export default function CreateAssessmentBuilderPage() {
  const router = useRouter();

  const [standardFilter, setStandardFilter] = useState<StandardFilter>("C+A");
  const [targetMarks, setTargetMarks] = useState<number>(2);

  const [activePaper, setActivePaper] = useState<Paper>("P1");
  const [viewPaper, setViewPaper] = useState<Paper>("P1");

  const [p1Target, setP1Target] = useState<number>(40);
  const [p2Target, setP2Target] = useState<number>(50);

  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [expandedSkillIds, setExpandedSkillIds] = useState<string[]>([]);
  const [conceptIndexBySkill, setConceptIndexBySkill] = useState<Record<string, number>>({});
  const [difficultyBySkill, setDifficultyBySkill] = useState<Record<string, DifficultyLevel>>({});

  const [questions, setQuestions] = useState<Question[]>([]);

  const [draftByPaper, setDraftByPaper] = useState<DraftByPaper>({ P1: null, P2: null });
  const [editDraftByPaper, setEditDraftByPaper] = useState<EditDraftByPaper>({
    P1: null,
    P2: null,
  });

  const [qualityNotes, setQualityNotes] = useState<string[]>([]);
  const [flashWarning, setFlashWarning] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});

  const previewPaneRef = useRef<HTMLDivElement | null>(null);
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const hudResizeStartRef = useRef<{ startY: number; startHeight: number } | null>(null);
  const pageWrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pendingJumpDraftRef = useRef<{ paper: Paper; draftId: string } | null>(null);
  const builderDateFieldRef = useRef<HTMLDivElement | null>(null);

  const [fitWidthScale, setFitWidthScale] = useState<number>(1);
  const [zoomPct, setZoomPct] = useState<number>(90);

  const [leftPaneRatio, setLeftPaneRatio] = useState<number>(1 / 2.25);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);

  const DEFAULT_HUD_HEIGHT = 170;
  const [hudHeight, setHudHeight] = useState<number>(DEFAULT_HUD_HEIGHT);
  const [isDraggingHud, setIsDraggingHud] = useState(false);
  const [showProgressPanel, setShowProgressPanel] = useState(true);

  const [includeCoverSheet, setIncludeCoverSheet] = useState(false);
  const [showCoverDateTime, setShowCoverDateTime] = useState(false);
  const [showScottishCandidateNumberBox, setShowScottishCandidateNumberBox] = useState(true);
  const [includeFormulaSheet, setIncludeFormulaSheet] = useState(false);

  const [currentViewerPage, setCurrentViewerPage] = useState<number>(1);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [appearance, setAppearance] = useState<AppearancePreference>("dark");
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

  const [assessmentName, setAssessmentName] = useState("[Untitled file]");
  const [className, setClassName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState(todayDisplayDate());
  const [builderCalendarOpen, setBuilderCalendarOpen] = useState(false);
  const [createdAt, setCreatedAt] = useState<number>(Date.now());

  const [p1StartTime, setP1StartTime] = useState("");
  const [p1EndTime, setP1EndTime] = useState("");

  const [p2CoverDate, setP2CoverDate] = useState(todayDisplayDate());
  const [p2StartTime, setP2StartTime] = useState("");
  const [p2EndTime, setP2EndTime] = useState("");
  const [p2DateCustom, setP2DateCustom] = useState(false);

  const [p1EndTimeManuallyEdited, setP1EndTimeManuallyEdited] = useState(false);
  const [p2EndTimeManuallyEdited, setP2EndTimeManuallyEdited] = useState(false);

  const theme = useMemo(
    () => getTheme(appearance, systemPrefersDark),
    [appearance, systemPrefersDark]
  );

  const editDraftRef = useRef<EditDraftByPaper>({ P1: null, P2: null });
  useEffect(() => {
    editDraftRef.current = editDraftByPaper;
  }, [editDraftByPaper]);

  const onMeasure = useCallback((id: string, heightPx: number) => {
    if (!Number.isFinite(heightPx) || heightPx <= 0) return;
    const rounded = Math.round(heightPx);

    setMeasuredHeights((prev) => {
      const prevH = prev[id];
      if (typeof prevH !== "number") return { ...prev, [id]: rounded };
      if (Math.abs(prevH - rounded) <= 1) return prev;
      return { ...prev, [id]: rounded };
    });
  }, []);

  const zoomIn = useCallback(() => setZoomPct((p) => clamp(p + 5, 50, 160)), []);
  const zoomOut = useCallback(() => setZoomPct((p) => clamp(p - 5, 50, 160)), []);
  const resetZoom = useCallback(() => setZoomPct(100), []);

  const resetLayout = useCallback(() => {
    setLeftPaneRatio(1 / 2.25);
    setHudHeight(DEFAULT_HUD_HEIGHT);
    setShowProgressPanel(true);

    try {
      window.localStorage.removeItem(PANE_RATIO_KEY);
      window.localStorage.removeItem(HUD_HEIGHT_KEY);
      window.localStorage.removeItem(SHOW_PROGRESS_PANEL_KEY);
    } catch {
      // ignore
    }
  }, []);

  const viewerScale = useMemo(() => {
    const mult = zoomPct / 100;
    return fitWidthScale * mult;
  }, [fitWidthScale, zoomPct]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemPrefersDark(media.matches);

    apply();

    const raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (raw === "dark" || raw === "light" || raw === "system") {
      setAppearance(raw as AppearancePreference);
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance);
    } catch {
      // ignore
    }
  }, [appearance]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PANE_RATIO_KEY);
      if (raw) {
        const parsed = Number(raw);
        if (Number.isFinite(parsed)) setLeftPaneRatio(clamp(parsed, 0.28, 0.62));
      }

      const rawHud = window.localStorage.getItem(HUD_HEIGHT_KEY);
      if (rawHud) {
        const parsedHud = Number(rawHud);
        if (Number.isFinite(parsedHud)) setHudHeight(clamp(parsedHud, DEFAULT_HUD_HEIGHT, 280));
      }

      const rawShowHud = window.localStorage.getItem(SHOW_PROGRESS_PANEL_KEY);
      if (rawShowHud === "true") setShowProgressPanel(true);
      if (rawShowHud === "false") setShowProgressPanel(false);

      const rawIncludeCover = window.localStorage.getItem(INCLUDE_COVER_SHEET_KEY);
      if (rawIncludeCover === "true") setIncludeCoverSheet(true);
      if (rawIncludeCover === "false") setIncludeCoverSheet(false);

      const rawShowDateTime = window.localStorage.getItem(SHOW_COVER_DATE_TIME_KEY);
      if (rawShowDateTime === "true") setShowCoverDateTime(true);
      if (rawShowDateTime === "false") setShowCoverDateTime(false);

      const rawScn = window.localStorage.getItem(SHOW_SCN_BOX_KEY);
      if (rawScn === "true") setShowScottishCandidateNumberBox(true);
      if (rawScn === "false") setShowScottishCandidateNumberBox(false);

      const rawFormula = window.localStorage.getItem(INCLUDE_FORMULA_SHEET_KEY);
      if (rawFormula === "true") setIncludeFormulaSheet(true);
      if (rawFormula === "false") setIncludeFormulaSheet(false);

      const storedName = window.localStorage.getItem(META_NAME_KEY);
      const storedClass = window.localStorage.getItem(META_CLASS_KEY);
      const storedAssessmentDate = window.localStorage.getItem(META_ASSESSMENT_DATE_KEY);
      const storedP1Date = window.localStorage.getItem(P1_COVER_DATE_KEY);
      const storedP2Date = window.localStorage.getItem(P2_COVER_DATE_KEY);

      if (storedName !== null) setAssessmentName(storedName);
      if (storedClass !== null) setClassName(storedClass);

      const initialAssessmentDate = normaliseDisplayDate(
        storedAssessmentDate || storedP1Date || ""
      );
      if (initialAssessmentDate) {
        setAssessmentDate(initialAssessmentDate);
      }

      const normalisedP2Date = normaliseDisplayDate(storedP2Date || "");
      if (normalisedP2Date) {
        setP2CoverDate(normalisedP2Date);
      }

      const storedP1Start = window.localStorage.getItem(P1_START_TIME_KEY);
      const storedP1End = window.localStorage.getItem(P1_END_TIME_KEY);
      const storedP2Start = window.localStorage.getItem(P2_START_TIME_KEY);
      const storedP2End = window.localStorage.getItem(P2_END_TIME_KEY);
      const storedP2Custom = window.localStorage.getItem(P2_DATE_CUSTOM_KEY);

      if (storedP1Start !== null) setP1StartTime(storedP1Start);
      if (storedP1End !== null) {
        setP1EndTime(storedP1End);
        if (storedP1End.trim()) setP1EndTimeManuallyEdited(true);
      }

      if (storedP2Start !== null) setP2StartTime(storedP2Start);
      if (storedP2End !== null) {
        setP2EndTime(storedP2End);
        if (storedP2End.trim()) setP2EndTimeManuallyEdited(true);
      }

      if (storedP2Custom === "true") setP2DateCustom(true);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const brief = loadAssessmentSetupBrief();
    if (!brief) return;

    setIncludeCoverSheet(brief.includeCoverSheet);
    setIncludeFormulaSheet(brief.includeFormulaSheet);

    setAssessmentName((prev) =>
      prev !== "[Untitled file]"
        ? prev
        : brief.assessmentName && brief.assessmentName.trim().length
        ? brief.assessmentName
        : "[Untitled file]"
    );

    setClassName((prev) => (prev.trim().length ? prev : brief.className ?? ""));

    const briefDate = normaliseDisplayDate(brief.assessmentDate || "");
    if (briefDate) {
      setAssessmentDate((prev) => (prev && prev !== todayDisplayDate() ? prev : briefDate));
      setP2CoverDate((prev) => (prev && prev !== todayDisplayDate() ? prev : briefDate));
    }

    setCreatedAt(
      typeof brief.createdAt === "number" && Number.isFinite(brief.createdAt)
        ? brief.createdAt
        : Date.now()
    );

    if (brief.paperStructure === "P2_ONLY") {
      setActivePaper("P2");
      setViewPaper("P2");
    } else {
      setActivePaper("P1");
      setViewPaper("P1");
    }

    if (brief.buildPriority === "MARKS") {
      if (typeof brief.marksTargetP1 === "number" && brief.marksTargetP1 > 0) {
        setP1Target(brief.marksTargetP1);
      }
      if (typeof brief.marksTargetP2 === "number" && brief.marksTargetP2 > 0) {
        setP2Target(brief.marksTargetP2);
      }
      return;
    }

    if (typeof brief.timeTargetP1 === "number" && brief.timeTargetP1 > 0) {
      setP1Target(Math.max(1, Math.floor(brief.timeTargetP1 / 1.5)));
    }
    if (typeof brief.timeTargetP2 === "number" && brief.timeTargetP2 > 0) {
      setP2Target(Math.max(1, Math.floor(brief.timeTargetP2 / 1.8)));
    }
  }, []);

  useEffect(() => {
    if (!p2DateCustom) {
      setP2CoverDate(assessmentDate || todayDisplayDate());
    }
  }, [assessmentDate, p2DateCustom]);

  useEffect(() => {
    if (!builderCalendarOpen) return;

    function handleMouseDown(event: MouseEvent) {
      if (!builderDateFieldRef.current) return;
      if (builderDateFieldRef.current.contains(event.target as Node)) return;
      setBuilderCalendarOpen(false);
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [builderCalendarOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(META_NAME_KEY, assessmentName);
      window.localStorage.setItem(META_CLASS_KEY, className);
      window.localStorage.setItem(META_ASSESSMENT_DATE_KEY, assessmentDate);

      window.localStorage.setItem(P1_COVER_DATE_KEY, assessmentDate);
      window.localStorage.setItem(P1_START_TIME_KEY, p1StartTime);
      window.localStorage.setItem(P1_END_TIME_KEY, p1EndTime);

      window.localStorage.setItem(
        P2_COVER_DATE_KEY,
        p2DateCustom ? p2CoverDate : assessmentDate
      );
      window.localStorage.setItem(P2_START_TIME_KEY, p2StartTime);
      window.localStorage.setItem(P2_END_TIME_KEY, p2EndTime);

      window.localStorage.setItem(P2_DATE_CUSTOM_KEY, String(p2DateCustom));
    } catch {
      // ignore
    }
  }, [
    assessmentName,
    className,
    assessmentDate,
    p1StartTime,
    p1EndTime,
    p2CoverDate,
    p2StartTime,
    p2EndTime,
    p2DateCustom,
  ]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PANE_RATIO_KEY, String(leftPaneRatio));
    } catch {
      // ignore
    }
  }, [leftPaneRatio]);

  useEffect(() => {
    try {
      window.localStorage.setItem(HUD_HEIGHT_KEY, String(hudHeight));
    } catch {
      // ignore
    }
  }, [hudHeight]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOW_PROGRESS_PANEL_KEY, String(showProgressPanel));
    } catch {
      // ignore
    }
  }, [showProgressPanel]);

  useEffect(() => {
    try {
      window.localStorage.setItem(INCLUDE_COVER_SHEET_KEY, String(includeCoverSheet));
    } catch {
      // ignore
    }
  }, [includeCoverSheet]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOW_COVER_DATE_TIME_KEY, String(showCoverDateTime));
    } catch {
      // ignore
    }
  }, [showCoverDateTime]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SHOW_SCN_BOX_KEY, String(showScottishCandidateNumberBox));
    } catch {
      // ignore
    }
  }, [showScottishCandidateNumberBox]);

  useEffect(() => {
    try {
      window.localStorage.setItem(INCLUDE_FORMULA_SHEET_KEY, String(includeFormulaSheet));
    } catch {
      // ignore
    }
  }, [includeFormulaSheet]);

  useEffect(() => {
    document.body.classList.toggle("dragging-divider", isDraggingDivider);
    document.body.classList.toggle("dragging-hud", isDraggingHud);
    document.body.style.overflow = settingsOpen ? "hidden" : "";

    return () => {
      document.body.classList.remove("dragging-divider");
      document.body.classList.remove("dragging-hud");
      document.body.style.overflow = "";
    };
  }, [isDraggingDivider, isDraggingHud, settingsOpen]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingDivider || !layoutRef.current) return;

      const rect = layoutRef.current.getBoundingClientRect();
      const dividerW = 8;
      const usableW = rect.width - dividerW;
      if (usableW <= 0) return;

      const nextRatio = (e.clientX - rect.left) / usableW;
      setLeftPaneRatio(clamp(nextRatio, 0.28, 0.62));
    };

    const onUp = () => setIsDraggingDivider(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingDivider]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!showProgressPanel) return;

      const start = hudResizeStartRef.current;
      if (!start) return;

      const delta = start.startY - e.clientY;
      setHudHeight(clamp(start.startHeight + delta, 88, 280));
    };

    const onUp = () => {
      hudResizeStartRef.current = null;
      setIsDraggingHud(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [showProgressPanel]);

  useEffect(() => {
    const onOpen = () => setSettingsOpen(true);
    window.addEventListener("open-builder-settings", onOpen);
    return () => window.removeEventListener("open-builder-settings", onOpen);
  }, []);

  useEffect(() => {
    const el = previewPaneRef.current;
    if (!el) return;

    const calc = () => {
      const w = el.clientWidth;
      const pad = 40;
      const next = clamp((w - pad) / A4_W_PX, 0.45, 1.35);
      setFitWidthScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
    };

    calc();

    const ro = new ResizeObserver(() => calc());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = previewPaneRef.current;
    if (!el) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;

      event.preventDefault();

      setZoomPct((prev) => clamp(prev + (event.deltaY < 0 ? 5 : -5), 50, 160));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const totalSkillsCount = useMemo(() => {
    return Object.values(skillsData).reduce<number>(
      (acc, list) => acc + (list as Skill[]).length,
      0
    );
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { questions?: Question[] };
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ questions }));
    } catch {
      // ignore
    }
  }, [questions]);

  useEffect(() => {
    const liveIds = new Set<string>();
    questions.forEach((q) => liveIds.add(q.id));
    if (draftByPaper.P1) liveIds.add(draftByPaper.P1.id);
    if (draftByPaper.P2) liveIds.add(draftByPaper.P2.id);
    if (editDraftByPaper.P1) {
      liveIds.add(editDraftByPaper.P1.original.id);
      liveIds.add(editDraftByPaper.P1.draft.id);
    }
    if (editDraftByPaper.P2) {
      liveIds.add(editDraftByPaper.P2.original.id);
      liveIds.add(editDraftByPaper.P2.draft.id);
    }

    setMeasuredHeights((prev) => {
      let changed = false;
      const next: Record<string, number> = {};
      for (const [id, h] of Object.entries(prev)) {
        if (liveIds.has(id)) next[id] = h;
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [questions, draftByPaper, editDraftByPaper]);

  const toggleCategory = useCallback((name: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const toggleSkillRow = useCallback((skillId: string) => {
    setExpandedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }, []);

  const collapseAllSkills = useCallback(() => setExpandedSkillIds([]), []);

  const getConceptIndex = useCallback(
  (skillId: string) => conceptIndexBySkill[skillId] ?? -1,
  [conceptIndexBySkill],
);

  const setConceptIndex = useCallback((skillId: string, nextIndex: number) => {
    setConceptIndexBySkill((prev) => ({ ...prev, [skillId]: nextIndex }));
  }, []);

  const getDifficulty = useCallback(
    (skillId: string) => difficultyBySkill[skillId] ?? 3,
    [difficultyBySkill]
  );

  const setDifficulty = useCallback((skillId: string, next: DifficultyLevel) => {
    setDifficultyBySkill((prev) => ({ ...prev, [skillId]: next }));
  }, []);

  function pushFlash(message: string) {
    setFlashWarning(message);

    if (flashTimerRef.current) {
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }

    flashTimerRef.current = window.setTimeout(() => {
      setFlashWarning(null);
      flashTimerRef.current = null;
    }, 3200);
  }

  function addQualityNote(message: string) {
    setQualityNotes((prev) => [message, ...prev].slice(0, 10));
  }

  const addQuestionToPaper = useCallback(
    (category: string, skill: Skill, concept: string, difficulty: DifficultyLevel, paper: Paper) => {
      if (skill.paperSuitability !== "BOTH" && skill.paperSuitability !== paper) {
        const msg = `Paper mismatch: ${skill.code} is typically ${skill.paperSuitability} but you added it to ${paper}.`;
        pushFlash(msg);
        addQualityNote(`• ${msg}`);
      }

      const generated = buildGenerated(skill, concept, difficulty);
      const conceptMeta = getConceptFromSelection(skill, concept);
      const skillLinks = buildSkillLinks(skill, conceptMeta);

      const draft: Question = {
        id: makeId(),
        category,
        skillId: skill.id,
        skillCode: skill.code,
        skillText: skill.text,
        primarySkillId: skill.id,
        primaryConceptId: conceptMeta?.id,
        supportingSkillIds: [],
        skillLinks,
        standardFilter,
        concept,
        conceptId: conceptMeta?.id,
        difficulty,
        targetMarks,
        createdAt: Date.now(),
        paper,
        ...generated,
      };

      pendingJumpDraftRef.current = { paper, draftId: draft.id };
      setDraftByPaper((prev) => ({ ...prev, [paper]: draft }));
      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [standardFilter, targetMarks]
  );

  const regenerateQuestionToPaper = useCallback(
    (category: string, skill: Skill, concept: string, difficulty: DifficultyLevel, paper: Paper) => {
      if (skill.paperSuitability !== "BOTH" && skill.paperSuitability !== paper) {
        const msg = `Paper mismatch: ${skill.code} is typically ${skill.paperSuitability} but you regenerated it for ${paper}.`;
        pushFlash(msg);
        addQualityNote(`• ${msg}`);
      }

      const generated = buildGenerated(skill, concept, difficulty);
      const conceptMeta = getConceptFromSelection(skill, concept);
      const skillLinks = buildSkillLinks(skill, conceptMeta);

      const activeEdit = editDraftRef.current[paper];

      if (activeEdit) {
        setEditDraftByPaper((prev) => {
          const nowEdit = prev[paper];
          if (!nowEdit) return prev;

          const nextDraft: Question = {
            ...nowEdit.draft,
            category,
            skillId: skill.id,
            skillCode: skill.code,
            skillText: skill.text,
            primarySkillId: skill.id,
            primaryConceptId: conceptMeta?.id,
            supportingSkillIds: [],
            skillLinks,
            standardFilter,
            concept,
            conceptId: conceptMeta?.id,
            difficulty,
            targetMarks,
            createdAt: Date.now(),
            paper,
            ...generated,
          };

          pendingJumpDraftRef.current = { paper, draftId: nextDraft.id };

          return { ...prev, [paper]: { ...nowEdit, draft: nextDraft } };
        });

        setViewPaper((prev) => (prev === paper ? prev : paper));
        return;
      }

      setDraftByPaper((prevDrafts) => {
        const nextDraft: Question = {
          id: prevDrafts[paper]?.id ?? makeId(),
          category,
          skillId: skill.id,
          skillCode: skill.code,
          skillText: skill.text,
          primarySkillId: skill.id,
          primaryConceptId: conceptMeta?.id,
          supportingSkillIds: [],
          skillLinks,
          standardFilter,
          concept,
          conceptId: conceptMeta?.id,
          difficulty,
          targetMarks,
          createdAt: Date.now(),
          paper,
          ...generated,
        };

        pendingJumpDraftRef.current = { paper, draftId: nextDraft.id };

        return { ...prevDrafts, [paper]: nextDraft };
      });

      setViewPaper((prev) => (prev === paper ? prev : paper));
    },
    [standardFilter, targetMarks]
  );

  const assignedForView = useMemo(
    () => questions.filter((q) => q.paper === viewPaper),
    [questions, viewPaper]
  );

  const editForView = editDraftByPaper[viewPaper];
  const newDraftForView = draftByPaper[viewPaper];

  const p1Questions = useMemo(() => questions.filter((q) => q.paper === "P1"), [questions]);
  const p2Questions = useMemo(() => questions.filter((q) => q.paper === "P2"), [questions]);

  const p1Marks = useMemo(() => sumMarks(p1Questions), [p1Questions]);
  const p2Marks = useMemo(() => sumMarks(p2Questions), [p2Questions]);

  const p1ActualQuestionMarks = useMemo(() => sumActualQuestionMarks(p1Questions), [p1Questions]);
  const p2ActualQuestionMarks = useMemo(() => sumActualQuestionMarks(p2Questions), [p2Questions]);

  const p1Mins = useMemo(() => estimateMinutes("P1", p1Marks), [p1Marks]);
  const p2Mins = useMemo(() => estimateMinutes("P2", p2Marks), [p2Marks]);

  useEffect(() => {
    if (p1EndTimeManuallyEdited) return;
    if (!p1StartTime.trim()) {
      setP1EndTime("");
      return;
    }

    setP1EndTime(calculateEndTime("N5", "paper1", p1Marks, p1StartTime));
  }, [p1Marks, p1StartTime, p1EndTimeManuallyEdited]);

  useEffect(() => {
    if (p2EndTimeManuallyEdited) return;
    if (!p2StartTime.trim()) {
      setP2EndTime("");
      return;
    }

    setP2EndTime(calculateEndTime("N5", "paper2", p2Marks, p2StartTime));
  }, [p2Marks, p2StartTime, p2EndTimeManuallyEdited]);

  const activePaperCoverMarks = useMemo(() => {
    if (viewPaper === "P1") return p1ActualQuestionMarks;
    return p2ActualQuestionMarks;
  }, [viewPaper, p1ActualQuestionMarks, p2ActualQuestionMarks]);

  const assignNewDraft = useCallback(() => {
    const draft = draftByPaper[viewPaper];
    if (!draft) return;

    const code = draft.questionCode;
    const spacingBasePx = code ? getSpacingBasePx(code) : 48;

    setQuestions((prev) => [
      ...prev,
      {
        ...draft,
        id: makeId(),
        createdAt: Date.now(),
        spacingBasePx,
      },
    ]);

    setDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [draftByPaper, viewPaper]);

  const removeNewDraft = useCallback(() => {
    pendingJumpDraftRef.current = null;
    setDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [viewPaper]);

  const startEditLockedQuestion = useCallback(
    (lockedQuestionId: string) => {
      const idx = questions.findIndex((q) => q.id === lockedQuestionId);
      if (idx < 0) return;

      const original = questions[idx];

      setEditDraftByPaper((prev) => ({
        ...prev,
        [original.paper]: {
          questionIndex: idx,
          original,
          draft: { ...original },
        },
      }));
    },
    [questions]
  );

  const saveEdit = useCallback(() => {
    const edit = editDraftByPaper[viewPaper];
    if (!edit) return;

    const code = edit.draft.questionCode;
    const nextSpacingBasePx = code ? getSpacingBasePx(code) : 48;

    setQuestions((prev) => {
      if (edit.questionIndex < 0 || edit.questionIndex >= prev.length) return prev;
      const next = [...prev];
      next[edit.questionIndex] = {
        ...edit.draft,
        createdAt: Date.now(),
        spacingBasePx: nextSpacingBasePx,
      };
      return next;
    });

    setEditDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [editDraftByPaper, viewPaper]);

  const removeWhileEditing = useCallback(() => {
    pendingJumpDraftRef.current = null;

    const edit = editDraftByPaper[viewPaper];
    if (!edit) return;

    setQuestions((prev) => prev.filter((q) => q.id !== edit.original.id));
    setEditDraftByPaper((prev) => ({ ...prev, [viewPaper]: null }));
  }, [editDraftByPaper, viewPaper]);

  const builderPages = useMemo(() => {
    return buildBuilderPages({
      assignedForView,
      editForView,
      newDraftForView,
      measuredHeights,
    });
  }, [assignedForView, editForView, newDraftForView, measuredHeights]);

  const renderById = useMemo(() => {
    const map = new Map<string, { kind: "locked" | "edit" | "draft"; q: Question }>();

    assignedForView.forEach((q) => map.set(q.id, { kind: "locked", q }));
    if (editForView) map.set(editForView.original.id, { kind: "edit", q: editForView.draft });
    if (newDraftForView) map.set(newDraftForView.id, { kind: "draft", q: newDraftForView });

    return map;
  }, [assignedForView, editForView, newDraftForView]);

  const previewPages = useMemo<PreviewPage[]>(() => {
    return buildPreviewPages({
      includeCoverSheet,
      includeFormulaSheet,
      builderPages,
    });
  }, [includeCoverSheet, includeFormulaSheet, builderPages]);

  const totalViewerPages = Math.max(previewPages.length, 1);

  const updateCurrentViewerPage = useCallback(() => {
    const container = previewPaneRef.current;
    if (!container) {
      setCurrentViewerPage(1);
      return;
    }

    if (previewPages.length === 0) {
      setCurrentViewerPage(1);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    let bestPage = 1;
    let bestVisible = -1;

    pageWrapperRefs.current.forEach((node, idx) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visible = Math.max(0, visibleBottom - visibleTop);

      if (visible > bestVisible) {
        bestVisible = visible;
        bestPage = idx + 1;
      }
    });

    setCurrentViewerPage(bestPage);
  }, [previewPages.length]);

  useEffect(() => {
    const pending = pendingJumpDraftRef.current;
    if (!pending) return;
    if (pending.paper !== viewPaper) return;

    let targetPreviewIndex = -1;

    for (let i = 0; i < previewPages.length; i += 1) {
      const page = previewPages[i];
      if (page.kind !== "questions") continue;
      if (page.pageQuestions.some((q) => q.id === pending.draftId)) {
        targetPreviewIndex = i;
        break;
      }
    }

    if (targetPreviewIndex < 0) return;

    const targetNode = pageWrapperRefs.current[targetPreviewIndex];
    if (!targetNode) return;

    const frame = window.requestAnimationFrame(() => {
      targetNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      pendingJumpDraftRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [previewPages, viewPaper]);

  useEffect(() => {
    const container = previewPaneRef.current;
    if (!container) return;

    const handle = () => updateCurrentViewerPage();

    handle();
    container.addEventListener("scroll", handle);

    const ro = new ResizeObserver(() => handle());
    ro.observe(container);

    window.addEventListener("resize", handle);

    return () => {
      container.removeEventListener("scroll", handle);
      ro.disconnect();
      window.removeEventListener("resize", handle);
    };
  }, [updateCurrentViewerPage, viewerScale, viewPaper, previewPages]);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => updateCurrentViewerPage());
    return () => window.cancelAnimationFrame(id);
  }, [
    updateCurrentViewerPage,
    previewPages,
    viewerScale,
    viewPaper,
    showProgressPanel,
    includeCoverSheet,
    includeFormulaSheet,
  ]);

  function handleAssessmentNameFocus() {
    if (assessmentName === "[Untitled file]") {
      setAssessmentName("");
    }
  }

  function handleAssessmentNameBlur() {
    if (!assessmentName.trim().length) {
      setAssessmentName("[Untitled file]");
    }
  }

  const dividerWidth = 8;
  const viewerHudRow = showProgressPanel ? `${hudHeight}px` : "0px";
  const bodyGridColumns = `${(leftPaneRatio * 100).toFixed(3)}% ${dividerWidth}px minmax(0, 1fr)`;

  const coverDateTextForView =
    viewPaper === "P1"
      ? formatCoverDate(assessmentDate)
      : formatCoverDate(p2DateCustom ? p2CoverDate : assessmentDate);

  const coverTimeTextForView =
    viewPaper === "P1"
      ? buildTimeRange(p1StartTime, p1EndTime)
      : buildTimeRange(p2StartTime, p2EndTime);

  return (
    <>
      <BuilderGlobalStyles theme={theme} />

      <main
        style={{
          height: "100vh",
          background: theme.pageBg,
          color: theme.text,
          display: "grid",
          gridTemplateRows: "1fr",
          overflow: "hidden",
          position: "relative",
          ...UI_TEXT.appRoot,
        }}
      >
        <div
          ref={layoutRef}
          style={{
            display: "grid",
            gridTemplateColumns: bodyGridColumns,
            minHeight: 0,
            overflow: "hidden",
            fontFamily: UI_TYPO.family,
          }}
        >
          <SkillsTree
            skillsData={skillsData as any}
            totalSkillsCount={totalSkillsCount}
            standardFilter={standardFilter}
            setStandardFilter={setStandardFilter}
            targetMarks={targetMarks}
            setTargetMarks={setTargetMarks}
            minTargetMarks={1}
            maxTargetMarks={6}
            activePaper={activePaper}
            setActivePaper={setActivePaper}
            collapsedCategories={collapsedCategories}
            toggleCategory={toggleCategory}
            expandedSkillIds={expandedSkillIds}
            toggleSkillRow={toggleSkillRow}
            collapseAllSkills={collapseAllSkills}
            getConceptIndex={getConceptIndex}
            setConceptIndex={setConceptIndex}
            getDifficulty={getDifficulty}
            setDifficulty={setDifficulty}
            addQuestionToPaper={addQuestionToPaper}
            regenerateQuestionToPaper={regenerateQuestionToPaper}
            theme={theme}
          />

          <div
            onMouseDown={() => setIsDraggingDivider(true)}
            onMouseUp={() => setIsDraggingDivider(false)}
            style={{
              width: dividerWidth,
              background: isDraggingDivider
                ? theme.pageBg === "#eef3f8"
                  ? "#cfe0f5"
                  : "#1e2b3b"
                : (theme as any).borderSoft ?? theme.border,
              cursor: "col-resize",
              position: "relative",
            }}
            title="Drag to resize panes"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, transparent 0, transparent 2px, rgba(147,197,253,0.20) 2px, rgba(147,197,253,0.20) 6px, transparent 6px, transparent 100%)",
                opacity: isDraggingDivider ? 1 : 0.4,
              }}
            />
          </div>

          <section
            style={{
              background: theme.panelBg2,
              display: "grid",
              gridTemplateRows: `65px minmax(0, 1fr) ${viewerHudRow}`,
              minHeight: 0,
              overflow: "hidden",
              position: "relative",
              fontFamily: UI_TYPO.family,
            }}
          >
            <div
              style={{
                borderBottom: `1px solid ${theme.border}`,
                background: theme.panelBg2,
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                alignItems: "center",
                gap: 10,
                padding: "3px 10px 14px",
                boxSizing: "border-box",
                minHeight: 0,
                position: "relative",
                zIndex: 3,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <BuilderMetaField
                  label="Name"
                  value={assessmentName}
                  onChange={setAssessmentName}
                  onFocus={handleAssessmentNameFocus}
                  onBlur={handleAssessmentNameBlur}
                  width={220}
                />

                <BuilderMetaField
                  label="Class"
                  value={className}
                  onChange={setClassName}
                  width={118}
                />

                <div
                  ref={builderDateFieldRef}
                  style={{
                    display: "grid",
                    gap: 3,
                    minWidth: 0,
                    width: 170,
                    position: "relative",
                    fontFamily: UI_TYPO.family,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: UI_TYPO.weightMedium,
                      letterSpacing: 0,
                      color: "rgba(214,227,243,0.74)",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Assessment Date
                  </span>

                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      value={assessmentDate}
                      onChange={(e) => setAssessmentDate(e.target.value)}
                      onFocus={() => setBuilderCalendarOpen(true)}
                      onClick={() => setBuilderCalendarOpen(true)}
                      style={{
                        height: 30,
                        borderRadius: 9,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                        color: "#f7fbff",
                        padding: "0 34px 0 9px",
                        fontSize: 13,
                        fontFamily: UI_TYPO.family,
                        fontWeight: UI_TYPO.weightSemibold,
                        minWidth: 0,
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setBuilderCalendarOpen((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 4,
                        top: 4,
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(214,227,243,0.78)",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 12,
                        lineHeight: 1,
                      }}
                      aria-label="Open assessment date calendar"
                    >
                      🗓️
                    </button>
                  </div>

                  {builderCalendarOpen ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 10px)",
                        left: 0,
                        zIndex: 20,
                        width: 320,
                      }}
                    >
                      <SharedCalendarPicker
                        theme={theme}
                        value={assessmentDate}
                        onCancel={() => setBuilderCalendarOpen(false)}
                        onApply={(next) => {
                          setAssessmentDate(next);
                          setBuilderCalendarOpen(false);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  justifySelf: "end",
                  whiteSpace: "nowrap",
                  transform: "translateY(1px)",
                }}
              >
                <div
                  style={{
                    color: "rgba(214,227,243,0.78)",
                    fontSize: 13,
                    fontFamily: UI_TYPO.family,
                    fontWeight: UI_TYPO.weightMedium,
                  }}
                >
                  Viewing
                </div>

                <ViewingToggle value={viewPaper} onChange={setViewPaper} />
              </div>
            </div>

            <div
              ref={previewPaneRef}
              className="hover-scroll"
              style={{
                position: "relative",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "auto",
                padding: "18px 18px 18px",
                background: theme.pageBg === "#eef3f8" ? "#e9eff6" : theme.panelBg2,
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 8,
                  zIndex: 6,
                  width: "100%",
                  height: 0,
                  display: "flex",
                  justifyContent: "center",
                  pointerEvents: "none",
                  overflow: "visible",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 188,
                    height: 42,
                    background: "rgba(188, 194, 203, 0.88)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 14,
                    boxShadow: "0 12px 24px rgba(0,0,0,0.18)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    pointerEvents: "auto",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        textAlign: "center",
                        color: "rgba(70,70,70,0.65)",
                        fontSize: 12,
                        fontFamily: UI_TYPO.family,
                        fontWeight: UI_TYPO.weightMedium,
                        lineHeight: 1,
                      }}
                      title={`Page ${currentViewerPage} of ${totalViewerPages}`}
                    >
                      {currentViewerPage}/{totalViewerPages}
                    </div>

                    <div
                      style={{
                        width: 1,
                        height: 18,
                        background: "rgba(90,90,90,0.30)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "58%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "grid",
                      gridTemplateColumns: "24px 54px 24px",
                      alignItems: "center",
                      justifyItems: "center",
                      columnGap: 6,
                      height: 24,
                    }}
                  >
                    <button
                      type="button"
                      onClick={zoomOut}
                      style={{
                        width: 24,
                        height: 24,
                        border: "none",
                        borderRadius: 6,
                        background: "transparent",
                        color: "rgba(70,70,70,0.94)",
                        cursor: "pointer",
                        fontFamily: UI_TYPO.family,
                        fontWeight: UI_TYPO.weightMedium,
                        fontSize: 20,
                        lineHeight: "24px",
                        display: "grid",
                        placeItems: "center",
                        padding: 0,
                      }}
                      title="Zoom out"
                    >
                      −
                    </button>

                    <div
                      style={{
                        width: 54,
                        textAlign: "center",
                        color: "rgba(70,70,70,0.95)",
                        fontSize: 15,
                        fontFamily: UI_TYPO.family,
                        fontWeight: UI_TYPO.weightSemibold,
                        lineHeight: "24px",
                      }}
                      title="Current zoom"
                    >
                      {zoomPct}%
                    </div>

                    <button
                      type="button"
                      onClick={zoomIn}
                      style={{
                        width: 24,
                        height: 24,
                        border: "none",
                        borderRadius: 6,
                        background: "transparent",
                        color: "rgba(70,70,70,0.94)",
                        cursor: "pointer",
                        fontFamily: UI_TYPO.family,
                        fontWeight: UI_TYPO.weightMedium,
                        fontSize: 20,
                        lineHeight: "24px",
                        display: "grid",
                        placeItems: "center",
                        padding: 0,
                      }}
                      title="Zoom in"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "max-content",
                  minWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {flashWarning ? (
                  <div
                    style={{
                      width: "min(100%, 760px)",
                      border: `1px solid ${theme.border}`,
                      background: theme.pageBg === "#eef3f8" ? "#fff4e5" : "#241a0b",
                      color: theme.pageBg === "#eef3f8" ? "#9a5b00" : "#ffd7a3",
                      borderRadius: 12,
                      padding: "10px 12px",
                      ...UI_TEXT.controlTextStrong,
                    }}
                  >
                    {flashWarning}
                  </div>
                ) : null}

                <div
                  style={{
                    width: "max-content",
                    minWidth: "100%",
                    display: "grid",
                    justifyItems: "center",
                    gap: 18,
                  }}
                >
                  {previewPages.map((previewPage, previewIndex) => {
                    if (previewPage.kind === "cover") {
                      return (
                        <div
                          key={`${viewPaper}-preview-cover-${previewPage.pageNumber}`}
                          ref={(el) => {
                            pageWrapperRefs.current[previewIndex] = el;
                          }}
                        >
                          <SQAN5CoverPage
                            pageNumber={previewPage.pageNumber}
                            paper={viewPaper}
                            totalMarks={activePaperCoverMarks}
                            showDateTime={showCoverDateTime}
                            dateText={coverDateTextForView}
                            timeText={coverTimeTextForView}
                            showScottishCandidateNumberBox={showScottishCandidateNumberBox}
                            viewerScale={viewerScale}
                            outerPaddingPx={0}
                          />
                        </div>
                      );
                    }

                    if (previewPage.kind === "formula") {
                      return (
                        <div
                          key={`${viewPaper}-preview-formula-${previewPage.pageNumber}`}
                          ref={(el) => {
                            pageWrapperRefs.current[previewIndex] = el;
                          }}
                        >
                          <SQAN5FormulaSheet
                            pageNumber={previewPage.pageNumber}
                            viewerScale={viewerScale}
                            outerPaddingPx={0}
                          />
                        </div>
                      );
                    }

                    if (previewPage.kind === "empty") {
                      return (
                        <div
                          key={`${viewPaper}-preview-empty-${previewPage.pageNumber}`}
                          ref={(el) => {
                            pageWrapperRefs.current[previewIndex] = el;
                          }}
                        >
                          <SQAPageFrame
                            viewerScale={viewerScale}
                            outerPaddingPx={0}
                            paper={viewPaper}
                            pageIndex={0}
                            footerPageNumber={previewPage.pageNumber}
                            footerLabelMode="sqa-lower"
                            isFirstQuestionPage={!includeCoverSheet && !includeFormulaSheet}
                          >
                            <div
                              style={{
                                marginTop: 10,
                                border: "1px dashed rgba(15,23,42,0.25)",
                                borderRadius: 8,
                                padding: 14,
                                color: "rgba(15,23,42,0.65)",
                                ...UI_TEXT.controlTextStrong,
                              }}
                            >
                              No questions added yet for {viewPaper === "P1" ? "Paper 1" : "Paper 2"}.
                            </div>
                          </SQAPageFrame>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${viewPaper}-builder-page-wrap-${previewPage.questionPageIndex}`}
                        ref={(el) => {
                          pageWrapperRefs.current[previewIndex] = el;
                        }}
                      >
                        <SQAPageFrame
                          viewerScale={viewerScale}
                          outerPaddingPx={0}
                          paper={viewPaper}
                          pageIndex={previewPage.questionPageIndex}
                          footerPageNumber={previewPage.pageNumber}
                          footerLabelMode="sqa-lower"
                          isFirstQuestionPage={previewPage.questionPageIndex === 0}
                          showTurnOver
                        >
                          <div style={{ display: "grid", gap: 2 }}>
                            {previewPage.pageQuestions.map((layoutQ, i) => {
                              const globalIndex = previewPage.questionStartIndex + i;

                              const render = renderById.get(layoutQ.id);
                              const kind = render?.kind ?? "locked";
                              const q = render?.q ?? layoutQ;

                              let gapPx = spacingBasePxFor(q);
                              if (kind === "edit" && editForView) {
                                gapPx = spacingBasePxFor(editForView.original);
                              }

                              const content =
                                kind === "edit" ? (
                                  <MeasureBox id={q.id} onMeasure={onMeasure}>
                                    <PaperQuestionDraft
                                      index={globalIndex}
                                      question={q}
                                      primaryLabel="Save"
                                      secondaryLabel="Remove"
                                      onPrimary={saveEdit}
                                      onSecondary={removeWhileEditing}
                                    />
                                  </MeasureBox>
                                ) : kind === "draft" ? (
                                  <MeasureBox id={q.id} onMeasure={onMeasure}>
                                    <PaperQuestionDraft
                                      index={globalIndex}
                                      question={q}
                                      primaryLabel="Assign"
                                      secondaryLabel="Remove"
                                      onPrimary={assignNewDraft}
                                      onSecondary={removeNewDraft}
                                    />
                                  </MeasureBox>
                                ) : (
                                  <MeasureBox id={q.id} onMeasure={onMeasure}>
                                    <div style={{ position: "relative" }}>
                                      <PaperQuestionLocked index={globalIndex} question={q} />
                                      <button
                                        type="button"
                                        onClick={() => startEditLockedQuestion(q.id)}
                                        style={{
                                          position: "absolute",
                                          top: 6,
                                          right: 86,
                                          border: "1px solid rgba(15,23,42,0.25)",
                                          background: "rgba(255,255,255,0.70)",
                                          color: "rgba(15,23,42,0.75)",
                                          borderRadius: 10,
                                          padding: "6px 10px",
                                          cursor: "pointer",
                                          height: 32,
                                          ...UI_TEXT.buttonTextSmall,
                                        }}
                                        title="Edit"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                  </MeasureBox>
                                );

                              return (
                                <div key={`${kind}-${layoutQ.id}`}>
                                  {content}
                                  <div aria-hidden="true" style={{ height: gapPx }} />
                                </div>
                              );
                            })}
                          </div>
                        </SQAPageFrame>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/compile-assessment")}
              style={{
                position: "absolute",
                right: 14,
                bottom: showProgressPanel ? hudHeight + 14 : 14,
                border: `1px solid ${theme.border}`,
                background:
                  theme.pageBg === "#eef3f8"
                    ? "rgba(255,255,255,0.92)"
                    : "rgba(11,17,24,0.92)",
                color: (theme as any).textMuted ?? theme.subtleText ?? theme.text,
                borderRadius: 16,
                padding: "10px 14px",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
                zIndex: 4,
                ...UI_TEXT.buttonText,
              }}
              title="Compile assessment into printable pages"
            >
              Compile →
            </button>

            {showProgressPanel ? (
              <div
                style={{
                  borderTop: `1px solid ${theme.border}`,
                  minHeight: 0,
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  background:
                    theme.pageBg === "#eef3f8"
                      ? "rgba(255,255,255,0.72)"
                      : "rgba(15,22,32,0.92)",
                }}
              >
                <div
                  onMouseDown={(e) => {
                    hudResizeStartRef.current = {
                      startY: e.clientY,
                      startHeight: hudHeight,
                    };
                    setIsDraggingHud(true);
                  }}
                  title="Drag to resize notes panel"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 12,
                    cursor: "row-resize",
                    zIndex: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 4,
                      borderRadius: 999,
                      background:
                        theme.pageBg === "#eef3f8"
                          ? "rgba(80,97,116,0.28)"
                          : "rgba(169,182,197,0.35)",
                    }}
                  />
                </div>

                <div
                  style={{
                    position: "absolute",
                    inset: "12px 0 0 0",
                    minHeight: 0,
                    overflow: "hidden",
                  }}
                >
                  <AssessmentProgressHud
                    viewPaper={viewPaper}
                    p1Marks={p1Marks}
                    p2Marks={p2Marks}
                    p1TargetMarks={p1Target}
                    p2TargetMarks={p2Target}
                    p1TimeMinutes={p1Mins}
                    p2TimeMinutes={p2Mins}
                    notes={qualityNotes}
                    theme={theme}
                  />
                </div>
              </div>
            ) : (
              <div style={{ minHeight: 0, overflow: "hidden" }} />
            )}
          </section>
        </div>

        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          appearance={appearance}
          onChangeAppearance={setAppearance}
          includeCoverSheet={includeCoverSheet}
          onToggleIncludeCoverSheet={setIncludeCoverSheet}
          showCoverDateTime={showCoverDateTime}
          onToggleShowCoverDateTime={setShowCoverDateTime}
          p1CoverDateText={assessmentDate}
          onChangeP1CoverDateText={setAssessmentDate}
          p1StartTimeText={p1StartTime}
          onChangeP1StartTimeText={setP1StartTime}
          p1EndTimeText={p1EndTime}
          onChangeP1EndTimeText={(value) => {
            setP1EndTimeManuallyEdited(true);
            setP1EndTime(value);
          }}
          p2CoverDateText={p2DateCustom ? p2CoverDate : assessmentDate}
          onChangeP2CoverDateText={(value) => {
            setP2DateCustom(true);
            setP2CoverDate(value);
          }}
          p2StartTimeText={p2StartTime}
          onChangeP2StartTimeText={setP2StartTime}
          p2EndTimeText={p2EndTime}
          onChangeP2EndTimeText={(value) => {
            setP2EndTimeManuallyEdited(true);
            setP2EndTime(value);
          }}
          showScottishCandidateNumberBox={showScottishCandidateNumberBox}
          onToggleShowScottishCandidateNumberBox={setShowScottishCandidateNumberBox}
          includeFormulaSheet={includeFormulaSheet}
          onToggleIncludeFormulaSheet={setIncludeFormulaSheet}
          showProgressPanel={showProgressPanel}
          onToggleShowProgressPanel={setShowProgressPanel}
          onResetLayout={resetLayout}
          onResetZoom={resetZoom}
        />
      </main>
    </>
  );
}