import type { ConsistencyClassification } from "../../../02_AnswerCatalog/AnswerCatalogTypes";
import type { CatalogMarkStandard, CatalogMarkThinking } from "../../../CatalogCoreTypes";

export const N2_SKILL_ID = "num-n2-indices" as const;

export type N2CorpusFamily =
  | "FRACTIONAL_INDEX_EVALUATION"
  | "BRACKETED_INDEX_LAWS"
  | "MULTI_LAW_SIMPLIFICATION";

export type N2HistoricalMechanism =
  | "PRODUCT_QUOTIENT_WITH_COEFFICIENT"
  | "FRACTIONAL_NUMERIC_EVALUATION"
  | "POWER_OF_POWER_WITH_NEGATIVE_INDEX"
  | "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX"
  | "SQUARED_FRACTIONAL_MONOMIAL"
  | "PRODUCT_OVER_ROOT"
  | "NEGATIVE_INDEX_QUOTIENT"
  | "DISTRIBUTIVE_INDEX_EXPANSION"
  | "POSITIVE_POWER_PRODUCT_QUOTIENT";

export type N2QuestionStandardProfile = "C" | "A" | "C+A";
export type N2AnswerOnlyProfile = "FULL_CREDIT" | "NO_CREDIT" | "NOT_STATED";

export type N2CorpusEntrySummary = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: "P1" | "P2";
  questionNumber: string;
  questionFamilyId: string;
  family: N2CorpusFamily;
  mechanism: N2HistoricalMechanism;
  totalMarks: 2 | 3;
  standardProfile: N2QuestionStandardProfile;
  standardMarks: CatalogMarkStandard[];
  thinking: CatalogMarkThinking;
  correctAnswerWithoutWorking: N2AnswerOnlyProfile;
  positivePowerOutputRequired: boolean;
  sourceSpecificNotes: string[];
};

/**
 * Reviewed N2 corpus summary. These rows synthesise the historical Question and
 * Answer Catalogues; they are not source-text templates.
 */
export const N2_CORPUS_ENTRIES: N2CorpusEntrySummary[] = [
  {
    sourceQuestionId: "N5_MATH_2014_P2_Q8",
    sourceAnswerId: "N5_MATH_2014_P2_Q8_MS",
    year: 2014,
    paper: "P2",
    questionNumber: "8",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
    totalMarks: 3,
    standardProfile: "C",
    standardMarks: ["C", "C", "C"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The three marks separate numerator power combination, numerical coefficient reduction and the quotient law.",
      "The source distinguishes a fully simplified result from an otherwise equivalent form retaining a denominator of one.",
      "Several explicitly listed error routes show that displayed working can change the mark total attached to the same incorrect final power.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2015_P1_Q14",
    sourceAnswerId: "N5_MATH_2015_P1_Q14_MS",
    year: 2015,
    paper: "P1",
    questionNumber: "14",
    questionFamilyId: "NUM_N2_FRACTIONAL_INDEX_EVALUATION",
    family: "FRACTIONAL_INDEX_EVALUATION",
    mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
    totalMarks: 2,
    standardProfile: "A",
    standardMarks: ["A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The two marks separate interpretation of the fractional exponent from completion of the exact numerical evaluation.",
      "A partial root/power interpretation can retain one mark when the full evaluation is not completed.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2016_P2_Q10",
    sourceAnswerId: "N5_MATH_2016_P2_Q10_MS",
    year: 2016,
    paper: "P2",
    questionNumber: "10",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    totalMarks: 3,
    standardProfile: "C+A",
    standardMarks: ["C", "A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: true,
    sourceSpecificNotes: [
      "The route is power-of-a-power, signed-exponent combination, then conversion to a reciprocal positive-power form.",
      "A full-credit alternative can convert the negative power to reciprocal form before the final same-base combination.",
      "The positive-power output instruction is mark-bearing rather than cosmetic.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2017_P2_Q12",
    sourceAnswerId: "N5_MATH_2017_P2_Q12_MS",
    year: 2017,
    paper: "P2",
    questionNumber: "12",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    totalMarks: 2,
    standardProfile: "A",
    standardMarks: ["A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The two marks are representation-led: root to fractional index, then reciprocal to negative fractional index.",
      "The source accepts stating the required exponent directly as an equivalent full-credit response.",
      "Common errors distinguish a misplaced negative sign from using the wrong reciprocal/root exponent.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2018_P1_Q15",
    sourceAnswerId: "N5_MATH_2018_P1_Q15_MS",
    year: 2018,
    paper: "P1",
    questionNumber: "15",
    questionFamilyId: "NUM_N2_BRACKETED_INDEX_LAWS",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "SQUARED_FRACTIONAL_MONOMIAL",
    totalMarks: 2,
    standardProfile: "C+A",
    standardMarks: ["C", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The first mark can be evidenced by correctly squaring either the fractional coefficient or the indexed variable component.",
      "The second mark completes both components into one simplified monomial.",
      "Subsequent incorrect work after a valid first step can block the second mark.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P2_Q16",
    sourceAnswerId: "N5_MATH_2019_P2_Q16_MS",
    year: 2019,
    paper: "P2",
    questionNumber: "16",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "PRODUCT_OVER_ROOT",
    totalMarks: 3,
    standardProfile: "C+A",
    standardMarks: ["C", "A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The mark sequence combines a numerator product, translates the root denominator to a fractional exponent and then applies the quotient law.",
      "A rationalising start is recognised as partial method evidence rather than the primary three-mark route.",
      "An equivalent decimal exponent is accepted even though the fractional exponent is the cleaner representation.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2021_P1_Q15",
    sourceAnswerId: "N5_MATH_2021_P1_Q15_MS",
    year: 2021,
    paper: "P1",
    questionNumber: "15",
    questionFamilyId: "NUM_N2_FRACTIONAL_INDEX_EVALUATION",
    family: "FRACTIONAL_INDEX_EVALUATION",
    mechanism: "FRACTIONAL_NUMERIC_EVALUATION",
    totalMarks: 2,
    standardProfile: "A",
    standardMarks: ["A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "NOT_STATED",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The mathematical structure repeats the two-stage fractional-index evaluation pattern seen in 2015.",
      "The source record does not state a question-specific answer-only rule, so SkillCatalog does not infer one for this year.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q11",
    sourceAnswerId: "N5_MATH_2022_P1_Q11_MS",
    year: 2022,
    paper: "P1",
    questionNumber: "11",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    totalMarks: 3,
    standardProfile: "C+A",
    standardMarks: ["C", "A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: true,
    sourceSpecificNotes: [
      "This is the strongest repeated N2 symbolic mechanism: a powered negative index, a second negative power and an explicit positive-power final form.",
      "Three full-credit pathways are represented, including signed-exponent and reciprocal-first variants.",
      "The supplied classification data fixes the question total at one C mark and two A marks; the node allocation is the moderated catalogue split.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2023_P1_Q12",
    sourceAnswerId: "N5_MATH_2023_P1_Q12_MS",
    year: 2023,
    paper: "P1",
    questionNumber: "12",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "NEGATIVE_INDEX_QUOTIENT",
    totalMarks: 3,
    standardProfile: "C+A",
    standardMarks: ["C", "C", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: true,
    sourceSpecificNotes: [
      "The source permits either signed-exponent simplification or a positive-powers-first route.",
      "The final mark requires correct conversion of the negative final power while retaining the numerical coefficient in the correct position.",
      "The supplied classification data fixes the question total at two C marks and one A mark.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2024_P1_Q13",
    sourceAnswerId: "N5_MATH_2024_P1_Q13_MS",
    year: 2024,
    paper: "P1",
    questionNumber: "13",
    questionFamilyId: "NUM_N2_BRACKETED_INDEX_LAWS",
    family: "BRACKETED_INDEX_LAWS",
    mechanism: "DISTRIBUTIVE_INDEX_EXPANSION",
    totalMarks: 2,
    standardProfile: "A",
    standardMarks: ["A", "A"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "FULL_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "The outside same-base factor is distributed over a two-term bracket containing fractional and negative powers.",
      "The second mark requires both products and the zero-power term to be fully simplified.",
      "The supplied classification data makes both marks A-standard.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P1_Q10",
    sourceAnswerId: "N5_MATH_2025_P1_Q10_MS",
    year: 2025,
    paper: "P1",
    questionNumber: "10",
    questionFamilyId: "NUM_N2_MULTI_LAW_SIMPLIFICATION",
    family: "MULTI_LAW_SIMPLIFICATION",
    mechanism: "POSITIVE_POWER_PRODUCT_QUOTIENT",
    totalMarks: 3,
    standardProfile: "C",
    standardMarks: ["C", "C", "C"],
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "NO_CREDIT",
    positivePowerOutputRequired: false,
    sourceSpecificNotes: [
      "Three positive-index laws form three distinct process marks: power-of-a-power, product and quotient.",
      "A correct final answer without supporting working receives no credit in this source question.",
      "The supplied classification data makes all three marks C-standard, demonstrating that a three-law indices question is not inherently A-standard.",
    ],
  },
];

export type N2FamilyComparison = {
  family: N2CorpusFamily;
  entryIds: string[];
  classification: ConsistencyClassification;
  observedPattern: string;
  stableFeatures: string[];
  variableFeatures: string[];
  generatorDecision: string;
};

export const N2_FAMILY_COMPARISONS: N2FamilyComparison[] = [
  {
    family: "FRACTIONAL_INDEX_EVALUATION",
    entryIds: N2_CORPUS_ENTRIES.filter((entry) => entry.family === "FRACTIONAL_INDEX_EVALUATION").map((entry) => entry.sourceAnswerId),
    classification: "STABLE",
    observedPattern: "Both reviewed numerical fractional-index questions are two-mark Paper 1 tasks. The first mark interprets the fractional exponent and the second completes an exact integer evaluation. Both are A-standard and Operational.",
    stableFeatures: [
      "two marks",
      "direct numerical evaluation",
      "integer base chosen for exact evaluation",
      "fractional exponent translated through root/power structure",
      "exact integer final value",
      "A-standard",
      "Operational",
    ],
    variableFeatures: [
      "integer base",
      "fractional exponent numerator",
      "root index",
      "whether the source states an answer-only rule",
    ],
    generatorDecision: "Treat numerical fractional-index evaluation as a core two-mark N2 family. Generate exact, hand-solvable integer results with a genuine interpretation step before evaluation; do not turn the family into calculator approximation or surd evaluation.",
  },
  {
    family: "BRACKETED_INDEX_LAWS",
    entryIds: N2_CORPUS_ENTRIES.filter((entry) => entry.family === "BRACKETED_INDEX_LAWS").map((entry) => entry.sourceAnswerId),
    classification: "QUESTION_FAMILY_VARIATION",
    observedPattern: "Both bracketed questions are two-mark Paper 1 Operational tasks, but their mechanisms differ materially: one applies an outer power to a monomial, while the other distributes an outside factor over an indexed binomial. Their standard profiles are also different.",
    stableFeatures: [
      "two marks",
      "Paper 1",
      "bracket structure is mathematically essential",
      "direct expand/simplify cue",
      "Operational",
      "no supplied visual or context",
    ],
    variableFeatures: [
      "outer power versus distributive expansion",
      "monomial versus two-term bracket",
      "fractional coefficient versus fractional/negative exponents",
      "C+A versus A standard profile",
      "whether a zero power must be simplified",
    ],
    generatorDecision: "Keep the bracketed family as two separately parameterised surface mechanisms rather than one free-form bracket generator. Standard must be selected from the actual mechanism/demand, not inherited from the family label.",
  },
  {
    family: "MULTI_LAW_SIMPLIFICATION",
    entryIds: N2_CORPUS_ENTRIES.filter((entry) => entry.family === "MULTI_LAW_SIMPLIFICATION").map((entry) => entry.sourceAnswerId),
    classification: "QUESTION_FAMILY_VARIATION",
    observedPattern: "Seven reviewed questions combine two or more index-law or representation stages. The family spans two- and three-mark tariffs and the full observed standard range: wholly C, mixed C/A and wholly A. Every example remains Operational.",
    stableFeatures: [
      "direct symbolic task",
      "same-base index structure",
      "at least two distinct mark-bearing law/representation stages",
      "Operational",
      "no contextual interpretation",
      "no visual stimulus",
    ],
    variableFeatures: [
      "two or three marks",
      "C, C+A or A standard profile",
      "positive, negative and fractional exponents",
      "root notation",
      "coefficient arithmetic",
      "algebraic fraction layout",
      "explicit positive-power output constraint",
      "answer-only treatment",
      "number and form of accepted full-credit pathways",
    ],
    generatorDecision: "Use multi-law simplification as the broad core N2 family, but require a reviewed mechanism/subfamily to be selected before parameters are generated. Do not create arbitrary mixtures of laws and then infer tariff or standard afterwards. The repeated 2016/2022 negative-index power-of-a-power mechanism is the strongest symbolic calibration anchor.",
  },
];

export const N2_GENERATOR_SCOPE = [
  {
    family: "FRACTIONAL_INDEX_EVALUATION" as const,
    readiness: "CORE" as const,
    evidenceCount: 2,
    supportedPapers: ["P1"] as const,
    supportedMarks: [2] as const,
    observedStandardProfiles: ["A"] as const,
    thinking: "OPERATIONAL" as const,
  },
  {
    family: "BRACKETED_INDEX_LAWS" as const,
    readiness: "SUPPORTED" as const,
    evidenceCount: 2,
    supportedPapers: ["P1"] as const,
    supportedMarks: [2] as const,
    observedStandardProfiles: ["C+A", "A"] as const,
    thinking: "OPERATIONAL" as const,
  },
  {
    family: "MULTI_LAW_SIMPLIFICATION" as const,
    readiness: "CORE" as const,
    evidenceCount: 7,
    supportedPapers: ["P1", "P2"] as const,
    supportedMarks: [2, 3] as const,
    observedStandardProfiles: ["C", "C+A", "A"] as const,
    thinking: "OPERATIONAL" as const,
  },
] as const;

export const N2_CROSS_CORPUS_GENERATION_INVARIANTS = [
  "N2 V1 generation remains Operational. The reviewed corpus contains 28 Operational marks and no Reasoning marks.",
  "Standard is not a family constant. The selected mechanism and mark-level demand must determine C/A classification explicitly.",
  "Every generated mark must correspond to one independently observable index-law, representation or required-output step; tariff is designed before numbers are sampled.",
  "A generated multi-law item must select a reviewed mechanism grammar before parameter generation; random law combinations are out of scope.",
  "Numerical fractional-index evaluation uses two marks and must resolve exactly without calculator approximation.",
  "When a positive-power final form is explicitly required, the generated answer scheme must preserve a genuine mark-bearing conversion into that form.",
  "Bracketed generation must use either the powered-monomial or indexed-binomial distributive mechanism until further evidence supports additional bracket architectures.",
  "Question generation and answer generation must consume the same generated mathematical state, including the intended intermediate mark states.",
  "Historical expressions, wording and source layout are evidence only and must not be emitted as generated templates.",
  "Historical-reference selection should prefer the closest family and mechanism fingerprint, not merely any source carrying N2.",
] as const;
