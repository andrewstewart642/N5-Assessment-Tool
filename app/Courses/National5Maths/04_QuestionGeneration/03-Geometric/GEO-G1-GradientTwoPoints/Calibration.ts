import {
  G1_CORPUS_ENTRIES,
  G1_GENERATOR_SCOPE,
  type G1CorpusFamily,
} from "../../../03_SkillCatalog/03-Geometric/GEO-G1-GradientTwoPoints/G1CrossCorpusAnalysis";
import {
  G1_EMPIRICAL_FAMILY_FREQUENCY,
  G1_NUMERIC_LINE_FINGERPRINTS,
  G1_SYMBOLIC_GRADIENT_FINGERPRINT,
} from "../../../03_SkillCatalog/03-Geometric/GEO-G1-GradientTwoPoints/G1CrossCorpusCalibration";
import type {
  G1GeneratorFamily,
  G1GeneratorPaper,
  G1GeneratorSurfaceStyle,
  G1LineModelState,
  G1Rational,
  G1SourceBasis,
  G1SymbolicGradientState,
} from "./Types";

const positiveModulo = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;

const reduced = (value: G1Rational): G1Rational => {
  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
  const divisor = gcd(Math.abs(value.numerator), Math.abs(value.denominator)) || 1;
  const sign = value.denominator < 0 ? -1 : 1;
  return {
    numerator: (value.numerator / divisor) * sign,
    denominator: Math.abs(value.denominator / divisor),
  };
};

const sameRational = (a: G1Rational, b: G1Rational) => {
  const ra = reduced(a);
  const rb = reduced(b);
  return ra.numerator === rb.numerator && ra.denominator === rb.denominator;
};

export const getG1FamilyProfile = (family: G1GeneratorFamily) => {
  const profile = G1_GENERATOR_SCOPE.find((entry) => entry.family === family);
  if (!profile) throw new Error(`Missing G1 generator profile for ${family}.`);
  return profile;
};

export const G1_SURFACES_BY_FAMILY: Record<G1GeneratorFamily, readonly G1GeneratorSurfaceStyle[]> = {
  LINE_EQUATION_FROM_TWO_POINTS: [
    "DIRECT_COORDINATES_LINE_EQUATION",
    "COORDINATE_DIAGRAM_LINE_EQUATION",
  ],
  CONTEXTUAL_LINEAR_MODEL: ["CONTEXT_LINE_GRAPH_LABELLED_POINTS"],
  BEST_FIT_LINEAR_MODEL: [
    "BEST_FIT_LABELLED_POINTS_CONTEXT",
    "BEST_FIT_GRID_READ_POINTS",
  ],
  SYMBOLIC_GRADIENT_FROM_TWO_POINTS: ["SYMBOLIC_COORDINATE_GRADIENT"],
};

export const g1FamilyFrequency = (
  family: G1GeneratorFamily,
  paper: G1GeneratorPaper,
) => {
  const table = paper === "P1" ? G1_EMPIRICAL_FAMILY_FREQUENCY.P1 : G1_EMPIRICAL_FAMILY_FREQUENCY.P2;
  return table.find((entry) => entry.family === family) ?? {
    family,
    count: 0,
    total: paper === "P1" ? 11 : 1,
    proportion: 0,
  };
};

export const historicalG1NumericOverlap = (state: G1LineModelState): boolean =>
  G1_NUMERIC_LINE_FINGERPRINTS.some((fingerprint) => {
    const sameLine = sameRational(state.gradient, fingerprint.gradient)
      && sameRational(state.intercept, fingerprint.intercept);
    const [a, b] = state.points;
    const [x, y] = fingerprint.primaryPoints;
    const samePoints = (a.x === x.x && a.y === x.y && b.x === y.x && b.y === y.y)
      || (a.x === y.x && a.y === y.y && b.x === x.x && b.y === x.y);
    return sameLine || samePoints;
  });

export const historicalG1SymbolicOverlap = (state: G1SymbolicGradientState): boolean =>
  state.denominatorScale === 2
  && state.parameterCoefficient === 2
  && state.constant === 3
  && state.numericPoint.x === G1_SYMBOLIC_GRADIENT_FINGERPRINT.numericPoint.x
  && state.numericPoint.y === G1_SYMBOLIC_GRADIENT_FINGERPRINT.numericPoint.y;

const sourceBasis = (
  family: G1GeneratorFamily,
  surfaceStyleId: G1GeneratorSurfaceStyle,
  paper: G1GeneratorPaper,
): G1SourceBasis => {
  const familyEntries = G1_CORPUS_ENTRIES.filter((entry) => entry.family === family);
  const surfaceEntries = familyEntries.filter((entry) => entry.surfaceStyleId === surfaceStyleId);
  const paperEntries = surfaceEntries.filter((entry) => entry.paper === paper);
  const ranked = paperEntries.length ? paperEntries : surfaceEntries.length ? surfaceEntries : familyEntries;
  const primary = ranked[0] ?? familyEntries[0];
  const supporting = ranked.slice(1).map((entry) => entry.sourceQuestionId);

  return {
    questionCatalogIds: familyEntries.map((entry) => entry.sourceQuestionId),
    answerCatalogIds: familyEntries.map((entry) => entry.sourceAnswerId),
    comparisonFamily: family,
    historicalReference: {
      primaryQuestionCatalogId: primary?.sourceQuestionId ?? null,
      supportingQuestionCatalogIds: supporting,
      matchReasons: [
        "SAME_FAMILY",
        "SAME_MARK_TARIFF",
        "SAME_STANDARD_PROFILE",
        "SAME_THINKING_PROFILE",
        "SAME_PAPER",
        "SIMILAR_STRUCTURE",
      ],
    },
  };
};

export const historicalReferenceForG1 = sourceBasis;

export const chooseG1Paper = (
  seed: number,
  requestedFamily?: G1GeneratorFamily,
  requestedPaper?: G1GeneratorPaper,
): G1GeneratorPaper => {
  if (requestedFamily) {
    const profile = getG1FamilyProfile(requestedFamily);
    if (requestedPaper && !profile.supportedPapers.includes(requestedPaper as never)) {
      throw new Error(`${requestedFamily} is not calibrated for ${requestedPaper}.`);
    }
    return requestedPaper ?? profile.supportedPapers[0];
  }
  if (requestedPaper) return requestedPaper;
  return positiveModulo(seed, 12) === 0 ? "P2" : "P1";
};

export const selectG1Family = (
  seed: number,
  paper: G1GeneratorPaper,
  requestedFamily: G1GeneratorFamily | undefined,
  includeExperimentalFamilies: boolean,
  includeDeferredCompositeFamilies: boolean,
): G1GeneratorFamily => {
  if (requestedFamily) {
    const profile = getG1FamilyProfile(requestedFamily);
    if (!profile.supportedPapers.includes(paper as never)) {
      throw new Error(`${requestedFamily} is not calibrated for ${paper}.`);
    }
    if (profile.readiness === "EXPERIMENTAL" && !includeExperimentalFamilies) {
      throw new Error(`${requestedFamily} is experimental and has been excluded by the caller.`);
    }
    if (profile.readiness === "COMPOSITE_DEFERRED" && !includeDeferredCompositeFamilies) {
      throw new Error(`${requestedFamily} contains a deferred cross-skill composite mark and has been excluded by the caller.`);
    }
    return requestedFamily;
  }

  const candidates = G1_GENERATOR_SCOPE.filter((profile) =>
    profile.supportedPapers.includes(paper as never)
    && (includeExperimentalFamilies || profile.readiness !== "EXPERIMENTAL")
    && (includeDeferredCompositeFamilies || profile.readiness !== "COMPOSITE_DEFERRED"),
  );

  if (!candidates.length) {
    throw new Error(`No G1 generator family is enabled for ${paper}.`);
  }

  if (paper === "P2") return "SYMBOLIC_GRADIENT_FROM_TWO_POINTS";

  const weighted: G1CorpusFamily[] = [];
  for (const profile of candidates) {
    const weight = profile.family === "LINE_EQUATION_FROM_TWO_POINTS"
      ? 6
      : profile.family === "CONTEXTUAL_LINEAR_MODEL"
        ? 3
        : profile.family === "BEST_FIT_LINEAR_MODEL"
          ? 2
          : 1;
    for (let index = 0; index < weight; index += 1) weighted.push(profile.family);
  }
  return weighted[positiveModulo(seed, weighted.length)] as G1GeneratorFamily;
};
