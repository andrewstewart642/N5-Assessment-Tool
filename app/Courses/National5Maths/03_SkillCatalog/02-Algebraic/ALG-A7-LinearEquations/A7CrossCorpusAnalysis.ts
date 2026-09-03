import type { ConsistencyClassification } from "../../../02_AnswerCatalog/AnswerCatalogTypes";
import type { CatalogMarkStandard, CatalogMarkThinking } from "../../../CatalogCoreTypes";

export const A7_SKILL_ID = "alg-a07-linear-equations" as const;
export const A7_CONCEPT_ID = "alg-a7-1" as const;

export type A7CorpusSurfaceFamily =
  | "FRACTIONAL_COEFFICIENT"
  | "CONTEXT_AREA_EQUALITY";

export type A7HistoricalMarkProfile =
  | "CLEAR_DENOMINATORS_REARRANGE_SOLVE"
  | "FORM_AREA_EQUATE_START_REARRANGE_SOLVE";

export type A7ExactFinalPolicy =
  | "NON_INTEGER_REQUIRED_DECIMAL_ACCEPTED"
  | "EXACT_FRACTION_REQUIRED"
  | "INTEGER_EXACT";

export type A7CorpusEntrySummary = {
  sourceQuestionId: string;
  sourceAnswerId: string;
  year: number;
  paper: "P1" | "P2";
  questionNumber: string;
  surfaceFamily: A7CorpusSurfaceFamily;
  markProfile: A7HistoricalMarkProfile;
  totalMarks: number;
  standard: CatalogMarkStandard;
  thinking: CatalogMarkThinking;
  correctAnswerWithoutWorking: "NO_CREDIT";
  exactFinalPolicy: A7ExactFinalPolicy;
  explicitlyRejectedMethod: "GUESS_AND_CHECK" | "REPEATED_SUBSTITUTION" | null;
  sourceSpecificNotes: string[];
};

/**
 * Teacher-moderated A7 corpus for the supplied 2014-2025 National 5 papers.
 *
 * These rows summarise already-catalogued historical evidence. They are not
 * source-text templates and they do not broaden the corpus beyond reviewed
 * A7 occurrences.
 */
export const A7_CORPUS_ENTRIES: A7CorpusEntrySummary[] = [
  {
    sourceQuestionId: "N5_MATH_2016_P1_Q8",
    sourceAnswerId: "N5_MATH_2016_P1_Q8_MS",
    year: 2016,
    paper: "P1",
    questionNumber: "8",
    surfaceFamily: "FRACTIONAL_COEFFICIENT",
    markProfile: "CLEAR_DENOMINATORS_REARRANGE_SOLVE",
    totalMarks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "NO_CREDIT",
    exactFinalPolicy: "NON_INTEGER_REQUIRED_DECIMAL_ACCEPTED",
    explicitlyRejectedMethod: null,
    sourceSpecificNotes: [
      "Two valid source methods are shown: clear denominators first, or rearrange the fractional terms before solving.",
      "The final mark requires a non-integer value; the source accepts either the exact fraction or its exact terminating decimal.",
      "Multiplying throughout by any common multiple of the displayed denominators can earn the first mark when done correctly.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2019_P1_Q14",
    sourceAnswerId: "N5_MATH_2019_P1_Q14_MS",
    year: 2019,
    paper: "P1",
    questionNumber: "14",
    surfaceFamily: "FRACTIONAL_COEFFICIENT",
    markProfile: "CLEAR_DENOMINATORS_REARRANGE_SOLVE",
    totalMarks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "NO_CREDIT",
    exactFinalPolicy: "EXACT_FRACTION_REQUIRED",
    explicitlyRejectedMethod: null,
    sourceSpecificNotes: [
      "Two valid source methods are shown: eliminate denominators, or combine the algebraic terms into one fraction before rearranging.",
      "The final mark requires a non-integer exact value and is not awarded for a decimal approximation to the fraction.",
      "An incorrect conversion after first stating the correct exact fraction is not penalised.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2022_P1_Q15",
    sourceAnswerId: "N5_MATH_2022_P1_Q15_MS",
    year: 2022,
    paper: "P1",
    questionNumber: "15",
    surfaceFamily: "CONTEXT_AREA_EQUALITY",
    markProfile: "FORM_AREA_EQUATE_START_REARRANGE_SOLVE",
    totalMarks: 5,
    standard: "A",
    thinking: "REASONING",
    correctAnswerWithoutWorking: "NO_CREDIT",
    exactFinalPolicy: "INTEGER_EXACT",
    explicitlyRejectedMethod: "GUESS_AND_CHECK",
    sourceSpecificNotes: [
      "Part (a) awards one mark for constructing the triangle-area expression from the supplied diagram.",
      "Part (b) awards four marks for constructing/equating the rectangle area, beginning a valid solve, rearranging and solving for x.",
      "The first part's area expression may be supplied later in part (b).",
      "The solving-process mark tied to clearing the one-half factor is unavailable if the triangle-area expression has lost that fractional structure.",
      "The final solve mark is unavailable for a single-digit division leading to an integer answer; the intended generated structure must preserve a genuinely mark-bearing final division.",
    ],
  },
  {
    sourceQuestionId: "N5_MATH_2025_P2_Q13",
    sourceAnswerId: "N5_MATH_2025_P2_Q13_MS",
    year: 2025,
    paper: "P2",
    questionNumber: "13",
    surfaceFamily: "FRACTIONAL_COEFFICIENT",
    markProfile: "CLEAR_DENOMINATORS_REARRANGE_SOLVE",
    totalMarks: 3,
    standard: "A",
    thinking: "OPERATIONAL",
    correctAnswerWithoutWorking: "NO_CREDIT",
    exactFinalPolicy: "EXACT_FRACTION_REQUIRED",
    explicitlyRejectedMethod: "REPEATED_SUBSTITUTION",
    sourceSpecificNotes: [
      "The numerator of one fractional term is binomial, so clearing denominators produces a bracketed linear expression before rearrangement.",
      "The final mark requires the exact fraction and is not awarded for a decimal approximation.",
      "Repeated substitution is explicitly assigned zero marks for this source question.",
    ],
  },
];

export type A7FamilyComparison = {
  family: A7CorpusSurfaceFamily;
  entryIds: string[];
  classification: ConsistencyClassification;
  observedPattern: string;
  stableFeatures: string[];
  variableFeatures: string[];
  generatorDecision: string;
};

export const A7_FAMILY_COMPARISONS: A7FamilyComparison[] = [
  {
    family: "FRACTIONAL_COEFFICIENT",
    entryIds: A7_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "FRACTIONAL_COEFFICIENT").map((entry) => entry.sourceAnswerId),
    classification: "POLICY_REGIME_VARIATION",
    observedPattern: "All three reviewed abstract A7 questions use a stable three-mark progression: create a valid denominator-free/equivalent linear equation, rearrange to a one-variable form, then obtain a non-integer solution. Exact-output treatment tightens in the later sources and a repeated-substitution exclusion appears explicitly only in 2025.",
    stableFeatures: [
      "three marks",
      "one-variable linear equation",
      "fractional coefficients or fractional algebra materially affect the first mark",
      "x appears in more than one algebraic location before rearrangement",
      "first mark establishes an equivalent equation suitable for ordinary linear rearrangement",
      "second mark obtains ax=b or an equivalent one-step form",
      "third mark obtains a non-integer solution",
      "correct final answer without working receives no credit",
      "A-standard",
      "Operational",
    ],
    variableFeatures: [
      "denominator least common multiple",
      "sign pattern",
      "constant placement",
      "whether a binomial numerator creates a bracket after denominator clearing",
      "alternative source method",
      "exact-fraction versus exact-terminating-decimal treatment",
      "question-specific repeated-substitution exclusion",
      "Paper 1 versus Paper 2 placement",
    ],
    generatorDecision: "Treat fractional-coefficient A7 as the core family. Generate three-mark A-standard Operational questions with a genuine denominator-clearing/combining first step, a distinct rearrangement step and a non-integer exact solution. Use modern exact-fraction presentation for generated marking while preserving historical policy differences only as source evidence.",
  },
  {
    family: "CONTEXT_AREA_EQUALITY",
    entryIds: A7_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "CONTEXT_AREA_EQUALITY").map((entry) => entry.sourceAnswerId),
    classification: "INSUFFICIENT_EVIDENCE",
    observedPattern: "Only one reviewed A7 source uses contextual modelling. It is a five-mark A-standard Reasoning task built from a labelled triangle and rectangle whose equal areas create the linear equation.",
    stableFeatures: [
      "five marks total",
      "1+4 multipart tariff",
      "labelled diagram supplies the dimensions",
      "one mark constructs the first area expression",
      "equal areas create a one-variable linear equation",
      "the one-half factor from triangle area is structurally important to a later process mark",
      "algebraic solution is explicitly required",
      "A-standard",
      "Reasoning",
    ],
    variableFeatures: [
      "Only one historical source currently fixes the visual/context surface.",
      "No supplied A7 source establishes that a different context family preserves the same five-mark decomposition.",
      "No supplied A7 source establishes a Paper 2 version of this family.",
    ],
    generatorDecision: "Keep contextual A7 generation experimental and initially restrict it to an original triangle-versus-rectangle equal-area semantic structure with the same 1+4 mark architecture. Do not generalise to arbitrary word problems merely because they can be solved by a linear equation.",
  },
];

export const A7_GENERATOR_SCOPE = [
  {
    family: "FRACTIONAL_COEFFICIENT" as const,
    readiness: "CORE" as const,
    evidenceCount: 3,
    supportedPapers: ["P1", "P2"] as const,
    marks: 3 as const,
    standard: "A" as const,
    thinking: "OPERATIONAL" as const,
  },
  {
    family: "CONTEXT_AREA_EQUALITY" as const,
    readiness: "EXPERIMENTAL" as const,
    evidenceCount: 1,
    supportedPapers: ["P1"] as const,
    marks: 5 as const,
    standard: "A" as const,
    thinking: "REASONING" as const,
  },
] as const;

export const A7_CROSS_CORPUS_GENERATION_INVARIANTS = [
  "Every generated A7 equation must have exactly one valid real solution.",
  "A generated mark belongs wholly to A7 unless a future teacher-moderated catalogue example establishes a genuine rogue mark owned by another canonical Skill.",
  "Fractional-coefficient questions must preserve three independently mark-bearing stages: equivalent denominator-free/combined form, linear rearrangement, and final solve.",
  "The core fractional family must produce a non-integer exact solution so the third mark is not trivialised into a routine integer division.",
  "Generated fractional questions use an exact rational final-answer expectation; decimal approximations do not replace the exact value in the generated marking scheme.",
  "Context-area questions must preserve the one-half triangle-area structure through the mark-bearing start-to-solve stage.",
  "Context-area questions must keep every generated physical dimension positive at the intended solution.",
  "Context-area questions must avoid a final ax=b state where a single-digit coefficient divides to an integer, because the historical source explicitly withholds the final mark in that eased case.",
  "Question generation and answer generation must consume the same generated mathematical state so the prompt, solution and mark pathway cannot drift apart.",
  "Historical wording, artwork and source layout are evidence only and are never generator templates.",
  "A generated instance exposes catalogue IDs for its closest historical reference; the teacher-facing label is derived from those IDs rather than duplicated as text.",
] as const;
