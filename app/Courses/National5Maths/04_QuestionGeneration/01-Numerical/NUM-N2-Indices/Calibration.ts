import type { HistoricalQuestionReferenceProfile } from "../../../CatalogCoreTypes";
import {
  N2_GENERATOR_CORPUS,
  N2_GENERATOR_DIFFICULTY_ANCHORS,
  N2_GENERATOR_FAMILY_EVIDENCE,
  N2_GENERATOR_FRACTIONAL_FINGERPRINTS,
  N2_GENERATOR_FREQUENCY,
} from "./Evidence";
import type {
  N2GeneratedMathState,
  N2GeneratorDifficulty,
  N2GeneratorFamily,
  N2GeneratorMechanism,
  N2GeneratorMechanismReadiness,
  N2GeneratorPaper,
  N2GeneratorStandard,
  N2GeneratorStandardProfile,
  N2FractionalEvaluationState,
} from "./Types";

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;

export type N2MechanismProfile = {
  mechanism: N2GeneratorMechanism;
  family: N2GeneratorFamily;
  readiness: N2GeneratorMechanismReadiness;
  evidenceCount: number;
  supportedPapers: readonly N2GeneratorPaper[];
  difficulty: N2GeneratorDifficulty;
  marks: 2 | 3;
  standardProfile: N2GeneratorStandardProfile;
  standardMarks: readonly N2GeneratorStandard[];
  thinking: "OPERATIONAL";
  positivePowerOutputRequired: boolean;
  questionCatalogIds: string[];
  answerCatalogIds: string[];
};

const MECHANISM_ORDER: readonly N2GeneratorMechanism[] = [
  "FRACTIONAL_NUMERIC_EVALUATION",
  "SQUARED_FRACTIONAL_MONOMIAL",
  "DISTRIBUTIVE_INDEX_EXPANSION",
  "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
  "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
  "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
  "PRODUCT_OVER_ROOT",
  "NEGATIVE_INDEX_QUOTIENT",
  "POSITIVE_POWER_PRODUCT_QUOTIENT",
] as const;

const unique = <T>(values: readonly T[]): T[] => [...new Set(values)];

const profileForMechanism = (mechanism: N2GeneratorMechanism): N2MechanismProfile => {
  const entries = N2_GENERATOR_CORPUS.filter((entry) => entry.mechanism === mechanism);
  if (entries.length === 0) throw new Error(`No N2 SkillCatalog evidence for ${mechanism}.`);

  const families = unique(entries.map((entry) => entry.family));
  const marks = unique(entries.map((entry) => entry.totalMarks));
  const standards = unique(entries.map((entry) => entry.standardProfile));
  const positivePower = unique(entries.map((entry) => entry.positivePowerOutputRequired));
  const difficulties = unique(
    entries.map((entry) => {
      const anchor = N2_GENERATOR_DIFFICULTY_ANCHORS.find(
        (candidate) => candidate.sourceQuestionId === entry.sourceQuestionId,
      );
      if (!anchor) throw new Error(`Missing N2 difficulty anchor for ${entry.sourceQuestionId}.`);
      return anchor.difficulty;
    }),
  );

  if (
    families.length !== 1
    || marks.length !== 1
    || standards.length !== 1
    || positivePower.length !== 1
    || difficulties.length !== 1
  ) {
    throw new Error(`N2 mechanism ${mechanism} does not have a stable V1 generation profile.`);
  }

  const firstMarks = entries[0].standardMarks.join("|");
  if (entries.some((entry) => entry.standardMarks.join("|") !== firstMarks)) {
    throw new Error(`N2 mechanism ${mechanism} has inconsistent mark-level standard patterns.`);
  }

  return {
    mechanism,
    family: families[0],
    readiness: entries.length >= 2 ? "CORE" : "SUPPORTED",
    evidenceCount: entries.length,
    supportedPapers: unique(entries.map((entry) => entry.paper)),
    difficulty: difficulties[0],
    marks: marks[0],
    standardProfile: standards[0],
    standardMarks: [...entries[0].standardMarks],
    thinking: "OPERATIONAL",
    positivePowerOutputRequired: positivePower[0],
    questionCatalogIds: entries.map((entry) => entry.sourceQuestionId),
    answerCatalogIds: entries.map((entry) => entry.sourceAnswerId),
  };
};

export const N2_MECHANISM_PROFILES: Record<N2GeneratorMechanism, N2MechanismProfile> =
  Object.fromEntries(
    MECHANISM_ORDER.map((mechanism) => [mechanism, profileForMechanism(mechanism)]),
  ) as Record<N2GeneratorMechanism, N2MechanismProfile>;

export const getN2MechanismProfile = (
  mechanism: N2GeneratorMechanism,
): N2MechanismProfile => N2_MECHANISM_PROFILES[mechanism];

const eligibleMechanismProfiles = (
  paper: N2GeneratorPaper,
  family?: N2GeneratorFamily,
  difficulty?: N2GeneratorDifficulty,
) => MECHANISM_ORDER
  .map((mechanism) => N2_MECHANISM_PROFILES[mechanism])
  .filter((profile) =>
    profile.supportedPapers.includes(paper)
    && (!family || profile.family === family)
    && (!difficulty || profile.difficulty === difficulty),
  );

const weightedPick = <T>(
  seed: number,
  items: readonly T[],
  weight: (item: T) => number,
): T => {
  if (items.length === 0) throw new Error("Cannot choose from an empty N2 generation set.");
  const weights = items.map((item) => Math.max(0, Math.floor(weight(item))));
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) return items[positiveModulo(seed, items.length)];

  let slot = positiveModulo(seed * 1103515245 + 12345, total);
  for (let index = 0; index < items.length; index += 1) {
    if (slot < weights[index]) return items[index];
    slot -= weights[index];
  }
  return items[items.length - 1];
};

export const chooseN2Paper = (
  seed: number,
  requestedFamily?: N2GeneratorFamily,
  requestedMechanism?: N2GeneratorMechanism,
  requestedPaper?: N2GeneratorPaper,
  difficulty?: N2GeneratorDifficulty,
): N2GeneratorPaper => {
  if (requestedMechanism) {
    const profile = N2_MECHANISM_PROFILES[requestedMechanism];
    if (requestedFamily && requestedFamily !== profile.family) {
      throw new Error(`${requestedMechanism} belongs to ${profile.family}, not ${requestedFamily}.`);
    }
    if (difficulty && profile.difficulty !== difficulty) {
      throw new Error(`${requestedMechanism} is calibrated at N2 difficulty ${profile.difficulty}, not ${difficulty}.`);
    }
    if (requestedPaper) {
      if (!profile.supportedPapers.includes(requestedPaper)) {
        throw new Error(`${requestedMechanism} is not supported on ${requestedPaper} by the reviewed N2 mechanism evidence.`);
      }
      return requestedPaper;
    }
    return profile.supportedPapers[positiveModulo(seed, profile.supportedPapers.length)];
  }

  if (requestedFamily) {
    const family = N2_GENERATOR_FAMILY_EVIDENCE[requestedFamily];
    const eligiblePapers = difficulty
      ? (["P1", "P2"] as const).filter((paper) =>
          eligibleMechanismProfiles(paper, requestedFamily, difficulty).length > 0,
        )
      : [...family.supportedPapers];
    if (requestedPaper) {
      if (!eligiblePapers.includes(requestedPaper)) {
        throw new Error(`${requestedFamily} has no N2 V1 mechanism on ${requestedPaper}${difficulty ? ` at difficulty ${difficulty}` : ""}.`);
      }
      return requestedPaper;
    }
    if (eligiblePapers.length === 0) {
      throw new Error(`${requestedFamily} has no N2 V1 paper support${difficulty ? ` at difficulty ${difficulty}` : ""}.`);
    }
    return eligiblePapers[positiveModulo(seed, eligiblePapers.length)];
  }

  if (requestedPaper) {
    if (difficulty && eligibleMechanismProfiles(requestedPaper, undefined, difficulty).length === 0) {
      throw new Error(`No N2 V1 mechanism is available on ${requestedPaper} at difficulty ${difficulty}.`);
    }
    return requestedPaper;
  }

  const papers = ["P1", "P2"] as const;
  const paperCounts = {
    P1: difficulty
      ? eligibleMechanismProfiles("P1", undefined, difficulty).reduce((sum, profile) => sum + profile.evidenceCount, 0)
      : N2_GENERATOR_CORPUS.filter((entry) => entry.paper === "P1").length,
    P2: difficulty
      ? eligibleMechanismProfiles("P2", undefined, difficulty).reduce((sum, profile) => sum + profile.evidenceCount, 0)
      : N2_GENERATOR_CORPUS.filter((entry) => entry.paper === "P2").length,
  };
  const eligiblePapers = papers.filter((paper) => paperCounts[paper] > 0);
  return weightedPick(seed, eligiblePapers, (paper) => paperCounts[paper]);
};

export const selectN2Family = (
  seed: number,
  paper: N2GeneratorPaper,
  requestedFamily?: N2GeneratorFamily,
  requestedMechanism?: N2GeneratorMechanism,
  difficulty?: N2GeneratorDifficulty,
): N2GeneratorFamily => {
  if (requestedMechanism) {
    const profile = N2_MECHANISM_PROFILES[requestedMechanism];
    if (requestedFamily && requestedFamily !== profile.family) {
      throw new Error(`${requestedMechanism} belongs to ${profile.family}, not ${requestedFamily}.`);
    }
    if (!profile.supportedPapers.includes(paper)) {
      throw new Error(`${requestedMechanism} is not supported on ${paper}.`);
    }
    if (difficulty && profile.difficulty !== difficulty) {
      throw new Error(`${requestedMechanism} is calibrated at N2 difficulty ${profile.difficulty}, not ${difficulty}.`);
    }
    return profile.family;
  }

  if (requestedFamily) {
    const candidates = eligibleMechanismProfiles(paper, requestedFamily, difficulty);
    if (candidates.length === 0) {
      throw new Error(`${requestedFamily} has no N2 V1 mechanism for ${paper}${difficulty ? ` at difficulty ${difficulty}` : ""}.`);
    }
    return requestedFamily;
  }

  const candidates = eligibleMechanismProfiles(paper, undefined, difficulty);
  const families = unique(candidates.map((profile) => profile.family));
  if (families.length === 0) {
    throw new Error(`No N2 V1 family is available for ${paper}${difficulty ? ` at difficulty ${difficulty}` : ""}.`);
  }

  const cells = paper === "P1" ? N2_GENERATOR_FREQUENCY.P1 : N2_GENERATOR_FREQUENCY.P2;
  return weightedPick(seed, families, (family) =>
    cells.find((cell: (typeof cells)[number]) => cell.family === family)?.count ?? 0,
  );
};

export const selectN2Mechanism = (
  seed: number,
  paper: N2GeneratorPaper,
  family: N2GeneratorFamily,
  requestedMechanism?: N2GeneratorMechanism,
  difficulty?: N2GeneratorDifficulty,
): N2GeneratorMechanism => {
  if (requestedMechanism) {
    const profile = N2_MECHANISM_PROFILES[requestedMechanism];
    if (profile.family !== family) {
      throw new Error(`${requestedMechanism} belongs to ${profile.family}, not ${family}.`);
    }
    if (!profile.supportedPapers.includes(paper)) {
      throw new Error(`${requestedMechanism} is not supported on ${paper}.`);
    }
    if (difficulty && profile.difficulty !== difficulty) {
      throw new Error(`${requestedMechanism} is calibrated at N2 difficulty ${profile.difficulty}, not ${difficulty}.`);
    }
    return requestedMechanism;
  }

  const candidates = eligibleMechanismProfiles(paper, family, difficulty);
  if (candidates.length === 0) {
    throw new Error(`${family} has no eligible N2 V1 mechanism for ${paper}${difficulty ? ` at difficulty ${difficulty}` : ""}.`);
  }

  return weightedPick(seed * 31 + 7, candidates, (profile) => profile.evidenceCount).mechanism;
};

export const n2FamilyFrequency = (
  family: N2GeneratorFamily,
  paper: N2GeneratorPaper,
) => {
  const cells = paper === "P1" ? N2_GENERATOR_FREQUENCY.P1 : N2_GENERATOR_FREQUENCY.P2;
  const cell = cells.find((entry: (typeof cells)[number]) => entry.family === family);
  const total = paper === "P1"
    ? N2_GENERATOR_CORPUS.filter((entry) => entry.paper === "P1").length
    : N2_GENERATOR_CORPUS.filter((entry) => entry.paper === "P2").length;
  return cell ?? { family, count: 0, total, proportion: 0 };
};

export const historicalN2FractionalOverlap = (
  state: N2FractionalEvaluationState,
) => N2_GENERATOR_FRACTIONAL_FINGERPRINTS.some((source) =>
  source.base === state.base
  && source.exponentNumerator === state.exponentNumerator
  && source.exponentDenominator === state.rootIndex,
);

export const historicalReferenceForN2 = (
  state: N2GeneratedMathState,
): HistoricalQuestionReferenceProfile => {
  const profile = N2_MECHANISM_PROFILES[state.mechanism];
  let primaryQuestionCatalogId = profile.questionCatalogIds[0] ?? null;

  if (state.mechanism === "FRACTIONAL_NUMERIC_EVALUATION" && profile.questionCatalogIds.length > 1) {
    primaryQuestionCatalogId = state.rootIndex === 2
      ? "N5_MATH_2021_P1_Q15"
      : "N5_MATH_2015_P1_Q14";
  }

  if (state.mechanism === "POWER_OF_POWER_WITH_NEGATIVE_INDEX" && profile.questionCatalogIds.length > 1) {
    primaryQuestionCatalogId = state.innerExponent < 0
      ? "N5_MATH_2022_P1_Q11"
      : "N5_MATH_2016_P2_Q10";
  }

  return {
    primaryQuestionCatalogId,
    supportingQuestionCatalogIds: profile.questionCatalogIds.filter(
      (id) => id !== primaryQuestionCatalogId,
    ),
    matchReasons: [
      "SAME_FAMILY",
      "SAME_SKILL",
      "SAME_MARK_TARIFF",
      "SAME_STANDARD_PROFILE",
      "SAME_THINKING_PROFILE",
      "SIMILAR_STRUCTURE",
      "SIMILAR_NUMERICAL_DEMAND",
    ],
  };
};
