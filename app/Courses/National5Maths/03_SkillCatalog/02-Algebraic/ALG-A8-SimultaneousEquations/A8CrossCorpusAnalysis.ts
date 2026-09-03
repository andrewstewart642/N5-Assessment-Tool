import type { ConsistencyClassification } from "../../../02_AnswerCatalog/AnswerCatalogTypes";

export const A8_SKILL_ID = "alg-a08-simultaneous-equations" as const;
export const A8_CONCEPT_ID = "alg-a8-1" as const;

export type A8CorpusSurfaceFamily =
  | "ABSTRACT_SOLVE"
  | "CONTEXT_FORM_AND_SOLVE"
  | "GRAPH_INTERSECTION_SOLVE"
  | "CONTEXT_DERIVED_TOTAL";

export type A8HistoricalMarkProfile =
  | "SCALE_STRATEGY_CORRECT"
  | "SCALE_VALUE_VALUE"
  | "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE"
  | "FORM_FORM_SCALE_VALUE_VALUE_DERIVED";

export type A8CorpusEntrySummary = {
  id: string;
  year: number;
  paper: "P1" | "P2";
  questionNumber: string;
  surfaceFamily: A8CorpusSurfaceFamily;
  markProfile: A8HistoricalMarkProfile;
  totalMarks: number;
  correctAnswerWithoutWorking: "NO_CREDIT" | "NOT_STATED";
  explicitlyRejectedMethod: "GUESS_AND_CHECK" | "REPEATED_SUBSTITUTION" | null;
  communicationMark: boolean;
  sourceSpecificNotes: string[];
};

export const A8_CORPUS_ENTRIES: A8CorpusEntrySummary[] = [
  { id: "N5_MATH_2014_P2_Q3_MS", year: 2014, paper: "P2", questionNumber: "3", surfaceFamily: "CONTEXT_FORM_AND_SOLVE", markProfile: "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE", totalMarks: 6, correctAnswerWithoutWorking: "NOT_STATED", explicitlyRejectedMethod: null, communicationMark: true, sourceSpecificNotes: ["Alternative variable names are explicitly accepted for the first equation.", "The final communication mark requires contextual labels, currency symbols and two decimal figures."] },
  { id: "N5_MATH_2015_P1_Q11_MS", year: 2015, paper: "P1", questionNumber: "11", surfaceFamily: "ABSTRACT_SOLVE", markProfile: "SCALE_STRATEGY_CORRECT", totalMarks: 3, correctAnswerWithoutWorking: "NOT_STATED", explicitlyRejectedMethod: "GUESS_AND_CHECK", communicationMark: false, sourceSpecificNotes: ["The detailed instructions reject guess-and-check but do not state a question-specific answer-only total."] },
  { id: "N5_MATH_2016_P1_Q4_MS", year: 2016, paper: "P1", questionNumber: "4", surfaceFamily: "CONTEXT_FORM_AND_SOLVE", markProfile: "FORM_FORM_SCALE_STRATEGY_CORRECT_COMMUNICATE", totalMarks: 6, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: null, communicationMark: true, sourceSpecificNotes: ["The part-(c) correct answer without working receives no credit.", "The communication mark requires the two object labels and correct square-metre units and is unavailable for negative solved values."] },
  { id: "N5_MATH_2017_P1_Q13_MS", year: 2017, paper: "P1", questionNumber: "13", surfaceFamily: "GRAPH_INTERSECTION_SOLVE", markProfile: "SCALE_STRATEGY_CORRECT", totalMarks: 3, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "GUESS_AND_CHECK", communicationMark: false, sourceSpecificNotes: ["The graph is supportive; algebraic working is required.", "A source-listed response with the two correct values reversed in the final ordered pair still receives full credit when valid working is shown."] },
  { id: "N5_MATH_2018_P1_Q3_MS", year: 2018, paper: "P1", questionNumber: "3", surfaceFamily: "ABSTRACT_SOLVE", markProfile: "SCALE_STRATEGY_CORRECT", totalMarks: 3, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "GUESS_AND_CHECK", communicationMark: false, sourceSpecificNotes: [] },
  { id: "N5_MATH_2019_P1_Q8_MS", year: 2019, paper: "P1", questionNumber: "8", surfaceFamily: "CONTEXT_FORM_AND_SOLVE", markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE", totalMarks: 6, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "GUESS_AND_CHECK", communicationMark: true, sourceSpecificNotes: ["Units appended to equation totals are accepted as bad form.", "The communication mark requires both object labels and kilogram units and is unavailable for negative solved values."] },
  { id: "N5_MATH_2021_P1_Q7_MS", year: 2021, paper: "P1", questionNumber: "7", surfaceFamily: "ABSTRACT_SOLVE", markProfile: "SCALE_VALUE_VALUE", totalMarks: 3, correctAnswerWithoutWorking: "NOT_STATED", explicitlyRejectedMethod: null, communicationMark: false, sourceSpecificNotes: ["The detailed Q7 row contains no question-specific notes about answer-only work or excluded methods; the general policy remains separate."] },
  { id: "N5_MATH_2022_P2_Q4_MS", year: 2022, paper: "P2", questionNumber: "4", surfaceFamily: "CONTEXT_FORM_AND_SOLVE", markProfile: "FORM_FORM_SCALE_VALUE_VALUE_COMMUNICATE", totalMarks: 6, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "GUESS_AND_CHECK", communicationMark: true, sourceSpecificNotes: ["Equivalent totals in pounds or pence are accepted with source-defined bad-form treatment.", "Later equation evidence can supply an omitted earlier equation mark.", "The communication mark requires nearest-penny values, labels and valid units."] },
  { id: "N5_MATH_2023_P1_Q3_MS", year: 2023, paper: "P1", questionNumber: "3", surfaceFamily: "ABSTRACT_SOLVE", markProfile: "SCALE_VALUE_VALUE", totalMarks: 3, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "REPEATED_SUBSTITUTION", communicationMark: false, sourceSpecificNotes: ["Following an earlier error, rounded values are accepted to at least one decimal place."] },
  { id: "N5_MATH_2024_P1_Q7_MS", year: 2024, paper: "P1", questionNumber: "7", surfaceFamily: "ABSTRACT_SOLVE", markProfile: "SCALE_VALUE_VALUE", totalMarks: 3, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "REPEATED_SUBSTITUTION", communicationMark: false, sourceSpecificNotes: ["Two displayed elimination routes reverse which variable receives the second and third marks.", "When separate scaling is used for the two variables, the scaling mark survives if either scaling is correct."] },
  { id: "N5_MATH_2025_P2_Q10_MS", year: 2025, paper: "P2", questionNumber: "10", surfaceFamily: "CONTEXT_DERIVED_TOTAL", markProfile: "FORM_FORM_SCALE_VALUE_VALUE_DERIVED", totalMarks: 6, correctAnswerWithoutWorking: "NO_CREDIT", explicitlyRejectedMethod: "REPEATED_SUBSTITUTION", communicationMark: false, sourceSpecificNotes: ["The prompt explicitly fixes the variable symbols for the first equation and the first mark is unavailable when alternatives are used.", "The final mark is for a consistent derived bundle calculation, not for communicating the two solved unit values.", "The final mark is unavailable if either solved value is negative."] },
];

export type A8FamilyComparison = {
  family: A8CorpusSurfaceFamily;
  entryIds: string[];
  classification: ConsistencyClassification;
  observedPattern: string;
  stableFeatures: string[];
  variableFeatures: string[];
  generatorDecision: string;
};

export const A8_FAMILY_COMPARISONS: A8FamilyComparison[] = [
  {
    family: "ABSTRACT_SOLVE",
    entryIds: A8_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "ABSTRACT_SOLVE").map((entry) => entry.id),
    classification: "POLICY_REGIME_VARIATION",
    observedPattern: "All reviewed abstract systems award the first mark for coefficient scaling and then two further marks for completing the algebra, while the detailed wording shifts from a strategy/correct-values split to separate value marks and source-local method exclusions change over time.",
    stableFeatures: ["three marks", "two independent linear equations", "algebraic solution", "coefficient scaling is first-mark evidence", "unique pair of values"],
    variableFeatures: ["strategy-versus-value wording for marks two and three", "question-specific answer-only note", "guess-and-check versus repeated-substitution exclusion", "follow-through rounding note"],
    generatorDecision: "Prototype abstract questions use an evidence-led three-mark elimination profile with scaling, first solved value and second solved value; source-local historical exclusions are not treated as universal historical facts.",
  },
  {
    family: "CONTEXT_FORM_AND_SOLVE",
    entryIds: A8_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "CONTEXT_FORM_AND_SOLVE").map((entry) => entry.id),
    classification: "CONTEXT_CONDITIONED",
    observedPattern: "The four reviewed form-and-solve contexts consistently use two one-mark equation-construction parts followed by a four-mark solving section, but the final mark's communication requirements and the middle solving-mark decomposition depend on context and marking era.",
    stableFeatures: ["six marks total", "one mark for each constructed equation", "four-mark solve section", "scaling is mark-bearing", "both unknown values are mathematically required"],
    variableFeatures: ["strategy/correct split versus separate value marks", "unit and contextual-label requirements", "currency formatting", "negative-value gate", "cross-part equation evidence"],
    generatorDecision: "Prototype contextual questions preserve the 1+1+4 scaffold and use explicit generated communication requirements tied to the selected context; totals are always derived from intended unknown values.",
  },
  {
    family: "GRAPH_INTERSECTION_SOLVE",
    entryIds: A8_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "GRAPH_INTERSECTION_SOLVE").map((entry) => entry.id),
    classification: "INSUFFICIENT_EVIDENCE",
    observedPattern: "Only one supplied A8 source uses a supporting graph while requiring algebraic solution of the intersection.",
    stableFeatures: ["algebraic elimination remains the assessed method", "graph and equations represent the same unique solution"],
    variableFeatures: ["final coordinate-pair presentation treatment cannot be generalised from one source"],
    generatorDecision: "Keep graph-intersection generation available as an experimental prototype family and require strict graph/equation consistency validation.",
  },
  {
    family: "CONTEXT_DERIVED_TOTAL",
    entryIds: A8_CORPUS_ENTRIES.filter((entry) => entry.surfaceFamily === "CONTEXT_DERIVED_TOTAL").map((entry) => entry.id),
    classification: "INSUFFICIENT_EVIDENCE",
    observedPattern: "Only the 2025 source in the supplied corpus asks candidates to solve the system as an intermediate stage and then evaluate a third bundle total.",
    stableFeatures: ["two one-mark equation-construction parts", "scaling and two solved-value marks", "derived final calculation"],
    variableFeatures: ["fixed variable symbols", "negative-value gate", "shape of the derived target"],
    generatorDecision: "Support this as a distinct experimental family rather than treating the 2025 final-mark behaviour as universal to contextual simultaneous-equation questions.",
  },
];

export const A8_CROSS_CORPUS_GENERATION_INVARIANTS = [
  "Every generated system must have a non-zero determinant and exactly one solution.",
  "At least one genuine coefficient-scaling step must be needed for the elimination route used by the marking scheme.",
  "Contextual totals must be derived from the generated unknown values and coefficients rather than generated independently.",
  "Question generation and answer generation must share the same mathematical state object so that prompts, solutions and marks cannot drift apart.",
  "Historical prompt wording, historical marking wording and source layout coordinates are not generation templates.",
  "The generator may vary context and algebraic surface form only within constraints supported by the relevant family evidence.",
] as const;
