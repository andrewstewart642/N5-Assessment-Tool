import type {
  QuestionAnswerSpaceCategory,
  QuestionDemandLevel,
  QuestionNumberType,
  QuestionStandardProfile,
  QuestionThinkingProfile,
} from "./QuestionCatalogTypes";

export type G1QuestionMode =
  | "DIRECT_COORDINATES_LINE"
  | "COORDINATE_DIAGRAM_LINE"
  | "CONTEXT_LINE_GRAPH"
  | "BEST_FIT_LABELLED_POINTS"
  | "BEST_FIT_READ_FROM_GRID"
  | "SYMBOLIC_COORDINATE_GRADIENT";

export type G1PointSource = "TEXT" | "DIAGRAM" | "GRAPH";

export type G1PointConfig = {
  id: string;
  label: string | null;
  x: number | string;
  y: number | string;
  xDisplay: string;
  yDisplay: string;
  source: G1PointSource;
  printedCoordinate: string;
  isPrimaryGradientPoint: boolean;
  isCandidateReadFromGraph: boolean;
};

export type G1ResponseRegion = {
  id: string;
  partId: string;
  pdfPage: number;
  printedPageLabel: string;
  topPt: number;
  bottomPt: number;
  boundaryConvention: string;
};

export type G1AxisConfig = {
  xVariable: string;
  xLabel: string;
  xUnit: string | null;
  xMinimum: number | null;
  xMaximum: number | null;
  xTickInterval: number | null;
  yVariable: string;
  yLabel: string;
  yUnit: string | null;
  yMinimum: number | null;
  yMaximum: number | null;
  yTickInterval: number | null;
  numericScaleShown: boolean;
  originShown: boolean;
  gridShown: boolean;
};

export type G1VisualConfig = {
  visualType: "COORDINATE_DIAGRAM" | "GRAPH" | "SCATTERGRAPH";
  sourcePageNumber: number;
  sourcePagePosition: "TOP" | "MIDDLE" | "BOTTOM" | "FULL_PAGE";
  sourceRelativeWidth: "SMALL" | "MEDIUM" | "LARGE" | "FULL_WIDTH";
  preferredGeneratedAspectRatio: string;
  dependency: "REQUIRED_TO_SOLVE" | "PARTIALLY_REQUIRED" | "REDUNDANT_WITH_TEXT";
  textRelationship: "VISUAL_ONLY" | "PARTLY_DUPLICATED" | "FULLY_DUPLICATED" | "TEXT_EXPLAINS_VISUAL";
  candidateMustReadValues: boolean;
  coordinateDataDuplicatedInText: boolean;
  exactGeometryRequiredForRenderer: boolean;
  axis: G1AxisConfig;
  scatterPresent: boolean;
  lineOfBestFitPresent: boolean;
  candidateDrawsBestFitLine: boolean;
  interpolationRequired: boolean;
  extrapolationRequired: boolean;
};

export type G1ContextConfig = {
  contextualised: boolean;
  domain: string | null;
  role: "NONE" | "MATHEMATICALLY_RELEVANT" | "MODEL_DEFINING";
  objects: string[];
  realWorldUnitsPresent: boolean;
  contextCanBeSafelyReplaced: boolean;
};

export type G1TargetConfig = {
  partId: string;
  variable: string;
  value: number;
  unit: string | null;
  outputDescription: string;
};

export type G1LanguageConfig = {
  sentenceCount: number;
  promptWordCount: number;
  informationDensity: "LOW" | "MEDIUM" | "HIGH";
  scaffoldingLevel: "LOW" | "MEDIUM" | "HIGH";
  introductionStyle: string;
  relationshipStatementStyle: string | null;
  commandStyle: string;
  informationOrder: string[];
  normalisedPromptStructure: string[];
  lexicalFeatureTags: string[];
  usesPronounReference: boolean;
};

export type G1DifficultyConfig = {
  overall: QuestionDemandLevel;
  methodSelection: QuestionDemandLevel;
  arithmetic: QuestionDemandLevel;
  algebraic: QuestionDemandLevel;
  representation: QuestionDemandLevel;
  language: QuestionDemandLevel;
  contextInterpretation: QuestionDemandLevel;
  reasoningDepth: QuestionDemandLevel;
  difficultyDrivers: string[];
};

export type G1QuestionConfig = {
  year: 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2021 | 2022 | 2023 | 2024 | 2025;
  paper: "P1" | "P2";
  questionNumber: string;
  sourcePages: number[];
  printedPageLabels: string[];
  responseRegions: G1ResponseRegion[];
  answerSpaceCategory: QuestionAnswerSpaceCategory;
  estimatedWritingLines: number;
  mode: G1QuestionMode;
  familyId: string;
  subFamilyId: string;
  totalMarks: 3 | 4;
  g1Marks: 3 | 4;
  embeddedS2Marks: 0 | 1;
  standardProfile: QuestionStandardProfile;
  thinkingProfile: QuestionThinkingProfile;
  points: G1PointConfig[];
  axis: G1AxisConfig;
  visual: G1VisualConfig | null;
  context: G1ContextConfig;
  target: G1TargetConfig | null;
  sourceRelationship: string;
  candidateMustConstructLineEquation: boolean;
  candidateMustFindGradientExpressionOnly: boolean;
  simplestFormExplicit: boolean;
  workingExplicitlyRequested: boolean;
  numberTypes: QuestionNumberType[];
  expectedOutputDescription: string;
  representationTransitions: { from: string; to: string; purpose: string }[];
  language: G1LanguageConfig;
  difficulty: G1DifficultyConfig;
  structuralSignature: string[];
  surfaceStyleId: string;
};

const noContext: G1ContextConfig = {
  contextualised: false,
  domain: null,
  role: "NONE",
  objects: [],
  realWorldUnitsPresent: false,
  contextCanBeSafelyReplaced: true,
};

const abstractAxes = (xVariable = "x", yVariable = "y"): G1AxisConfig => ({
  xVariable,
  xLabel: xVariable,
  xUnit: null,
  xMinimum: null,
  xMaximum: null,
  xTickInterval: null,
  yVariable,
  yLabel: yVariable,
  yUnit: null,
  yMinimum: null,
  yMaximum: null,
  yTickInterval: null,
  numericScaleShown: false,
  originShown: true,
  gridShown: false,
});

export const G1_QUESTION_CONFIGS: readonly G1QuestionConfig[] = [
  {
    year: 2014,
    paper: "P1",
    questionNumber: "6",
    sourcePages: [6, 7],
    printedPageLabels: ["Page six", "Page seven"],
    responseRegions: [
      { id: "Q6_SPACE_A", partId: "Q6_a", pdfPage: 7, printedPageLabel: "Page seven", topPt: 109.232, bottomPt: 472.012, boundaryConvention: "Upper boundary is the part (a) instruction block; lower boundary is the top of the part (b) prompt block." },
      { id: "Q6_SPACE_B", partId: "Q6_b", pdfPage: 7, printedPageLabel: "Page seven", topPt: 536.293, bottomPt: 754.011, boundaryConvention: "Upper boundary is the part (b) instruction block; lower boundary is the total-marks/footer region." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 14,
    mode: "BEST_FIT_LABELLED_POINTS",
    familyId: "GEO_G1_BEST_FIT_LINEAR_MODEL",
    subFamilyId: "BEST_FIT_LABELLED_POINTS_WITH_FOLLOW_ON_ESTIMATE",
    totalMarks: 4,
    g1Marks: 3,
    embeddedS2Marks: 1,
    standardProfile: "C",
    thinkingProfile: "MIXED",
    points: [
      { id: "A", label: "A", x: 5, y: 200, xDisplay: "5", yDisplay: "200", source: "TEXT", printedCoordinate: "(5, 200)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 25, y: 500, xDisplay: "25", yDisplay: "500", source: "TEXT", printedCoordinate: "(25, 500)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: { xVariable: "F", xLabel: "fat", xUnit: "g", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "C", yLabel: "calories", yUnit: null, yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false },
    visual: { visualType: "SCATTERGRAPH", sourcePageNumber: 6, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "4:3", dependency: "REDUNDANT_WITH_TEXT", textRelationship: "PARTLY_DUPLICATED", candidateMustReadValues: false, coordinateDataDuplicatedInText: true, exactGeometryRequiredForRenderer: false, axis: { xVariable: "F", xLabel: "fat", xUnit: "g", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "C", yLabel: "calories", yUnit: null, yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false }, scatterPresent: true, lineOfBestFitPresent: true, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: true },
    context: { contextualised: true, domain: "food nutrition", role: "MODEL_DEFINING", objects: ["sandwich", "fat content", "calorie content"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q6_b", variable: "F", value: 40, unit: "g", outputDescription: "estimated calorie content" },
    sourceRelationship: "A supplied line of best fit relates fat content to calories; two named points on that line are given explicitly and determine the linear model.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: false,
    workingExplicitlyRequested: true,
    numberTypes: ["INTEGER"],
    expectedOutputDescription: "Part (a) requires a straight-line equation in the contextual variables; part (b) requires a numerical estimate from that model.",
    representationTransitions: [
      { from: "scattergraph with a supplied best-fit line and two labelled observations", to: "straight-line equation", purpose: "construct the linear model" },
      { from: "straight-line equation", to: "contextual numerical estimate", purpose: "apply the model to a new input" },
    ],
    language: { sentenceCount: 9, promptWordCount: 106, informationDensity: "HIGH", scaffoldingLevel: "MEDIUM", introductionStyle: "SHORT_CONTEXT_THEN_GRAPH_RELATIONSHIP", relationshipStatementStyle: "VARIABLES_DEFINED_IN_PROSE_WITH_TWO_REFERENCE_POINTS", commandStyle: "PART_A_MODEL_THEN_PART_B_USE_MODEL_WITH_WORKING", informationOrder: ["CONTEXT", "VARIABLES", "SCATTERGRAPH", "BEST_FIT_LINE", "REFERENCE_POINTS", "EQUATION_TASK", "NEW_INPUT", "FOLLOW_ON_ESTIMATE", "WORKING_INSTRUCTION"], normalisedPromptStructure: ["Introduce a quantitative context.", "Define the two graph variables.", "Supply a scattergraph with a best-fit line.", "Give two named points on the line.", "Ask for the line equation.", "Provide a new input and require an estimate using the model."], lexicalFeatureTags: ["contextual graph", "best-fit line", "multipart", "named reference points", "follow-on estimate", "explicit working instruction"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "LOW", algebraic: "MEDIUM", representation: "MEDIUM", language: "MEDIUM", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["coordinating gradient and intercept in contextual variables", "moving from graph representation to a line equation", "follow-on model use"] },
    structuralSignature: ["contextual scattergraph", "supplied best-fit line", "two explicit line points", "three-mark line equation", "one-mark follow-on estimate"],
    surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT",
  },
  {
    year: 2015,
    paper: "P1",
    questionNumber: "8",
    sourcePages: [8],
    printedPageLabels: ["Page eight"],
    responseRegions: [{ id: "Q8_SPACE_MAIN", partId: "Q8_MAIN", pdfPage: 8, printedPageLabel: "Page eight", topPt: 125, bottomPt: 375, boundaryConvention: "Upper boundary is immediately below the line-equation instruction; lower boundary is immediately above the next question." }],
    answerSpaceCategory: "LARGE",
    estimatedWritingLines: 10,
    mode: "DIRECT_COORDINATES_LINE",
    familyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS",
    subFamilyId: "DIRECT_TEXT_COORDINATES",
    totalMarks: 3,
    g1Marks: 3,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "P1", label: null, x: -2, y: 5, xDisplay: "-2", yDisplay: "5", source: "TEXT", printedCoordinate: "(-2, 5)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "P2", label: null, x: 3, y: 15, xDisplay: "3", yDisplay: "15", source: "TEXT", printedCoordinate: "(3, 15)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: abstractAxes(),
    visual: null,
    context: noContext,
    target: null,
    sourceRelationship: "Two Cartesian coordinate pairs are supplied directly in prose and define one non-vertical straight line.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "NEGATIVE"],
    expectedOutputDescription: "A simplified straight-line equation in x and y.",
    representationTransitions: [{ from: "two coordinate pairs", to: "straight-line equation", purpose: "determine the unique line through the points" }],
    language: { sentenceCount: 2, promptWordCount: 20, informationDensity: "LOW", scaffoldingLevel: "LOW", introductionStyle: "DIRECT_COORDINATE_PAIR_TASK", relationshipStatementStyle: null, commandStyle: "FIND_LINE_EQUATION_THEN_SIMPLEST_FORM", informationOrder: ["LINE_TASK", "POINT_1", "POINT_2", "SIMPLEST_FORM_REQUIREMENT"], normalisedPromptStructure: ["State two coordinate points.", "Ask for the equation of the joining line.", "Require simplest form."], lexicalFeatureTags: ["abstract coordinate geometry", "direct two-point line", "minimal prose"], usesPronounReference: false },
    difficulty: { overall: "LOW", methodSelection: "VERY_LOW", arithmetic: "LOW", algebraic: "LOW", representation: "VERY_LOW", language: "VERY_LOW", contextInterpretation: "VERY_LOW", reasoningDepth: "VERY_LOW", difficultyDrivers: ["signed coordinate subtraction", "forming an intercept after the gradient"] },
    structuralSignature: ["two explicit coordinate pairs", "no visual", "find gradient", "construct straight-line equation", "three marks"],
    surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION",
  },
  {
    year: 2016,
    paper: "P1",
    questionNumber: "5",
    sourcePages: [6, 7],
    printedPageLabels: ["Page 06", "Page 07"],
    responseRegions: [
      { id: "Q5_SPACE_A", partId: "Q5_a", pdfPage: 6, printedPageLabel: "Page 06", topPt: 481, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q5_SPACE_B", partId: "Q5_b", pdfPage: 7, printedPageLabel: "Page 07", topPt: 155, bottomPt: 440, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is immediately above the next question." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 14,
    mode: "BEST_FIT_LABELLED_POINTS",
    familyId: "GEO_G1_BEST_FIT_LINEAR_MODEL",
    subFamilyId: "BEST_FIT_LABELLED_POINTS_WITH_FOLLOW_ON_ESTIMATE",
    totalMarks: 4,
    g1Marks: 3,
    embeddedS2Marks: 1,
    standardProfile: "C",
    thinkingProfile: "MIXED",
    points: [
      { id: "D", label: "D", x: 3, y: 100, xDisplay: "3", yDisplay: "100", source: "TEXT", printedCoordinate: "(3, 100)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "E", label: "E", x: 15, y: 340, xDisplay: "15", yDisplay: "340", source: "TEXT", printedCoordinate: "(15, 340)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: { xVariable: "A", xLabel: "age", xUnit: "months", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "W", yLabel: "weight", yUnit: "kg", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false },
    visual: { visualType: "SCATTERGRAPH", sourcePageNumber: 6, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "4:3", dependency: "REDUNDANT_WITH_TEXT", textRelationship: "PARTLY_DUPLICATED", candidateMustReadValues: false, coordinateDataDuplicatedInText: true, exactGeometryRequiredForRenderer: false, axis: { xVariable: "A", xLabel: "age", xUnit: "months", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "W", yLabel: "weight", yUnit: "kg", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false }, scatterPresent: true, lineOfBestFitPresent: true, candidateDrawsBestFitLine: false, interpolationRequired: true, extrapolationRequired: false },
    context: { contextualised: true, domain: "livestock growth", role: "MODEL_DEFINING", objects: ["calf", "age", "weight"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q5_b", variable: "A", value: 12, unit: "months", outputDescription: "estimated weight" },
    sourceRelationship: "A supplied best-fit line relates calf age to weight; two named observations are explicitly stated and lie on the line.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: true,
    numberTypes: ["INTEGER"],
    expectedOutputDescription: "Part (a) requires a contextual line equation; part (b) requires an estimate for a one-year input.",
    representationTransitions: [
      { from: "scattergraph with best-fit line and named observations", to: "straight-line equation", purpose: "construct the linear model" },
      { from: "straight-line equation", to: "contextual estimate", purpose: "evaluate the model at a specified age" },
    ],
    language: { sentenceCount: 8, promptWordCount: 93, informationDensity: "HIGH", scaffoldingLevel: "MEDIUM", introductionStyle: "CONTEXT_THEN_SCATTER_RELATIONSHIP", relationshipStatementStyle: "VARIABLES_AND_UNITS_DEFINED_WITH_TWO_NAMED_OBSERVATIONS", commandStyle: "PART_A_MODEL_THEN_PART_B_USE_MODEL_WITH_WORKING", informationOrder: ["CONTEXT", "VARIABLES", "SCATTERGRAPH", "BEST_FIT_LINE", "POINT_D", "POINT_E", "EQUATION_TASK", "FOLLOW_ON_INPUT", "WORKING_INSTRUCTION"], normalisedPromptStructure: ["Introduce a growth context.", "Define the graph variables and units.", "Supply a scattergraph and best-fit line.", "State two named observations.", "Ask for a simplest-form equation.", "Require a follow-on estimate at a specified age."], lexicalFeatureTags: ["contextual statistics", "best-fit line", "named points", "multipart", "explicit working instruction"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "MEDIUM", algebraic: "MEDIUM", representation: "MEDIUM", language: "MEDIUM", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["larger coordinate differences", "context-variable equation", "graph-to-equation translation"] },
    structuralSignature: ["contextual scattergraph", "best-fit line", "two explicit line points", "three-mark equation", "one-mark follow-on estimate"],
    surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT",
  },
  {
    year: 2017,
    paper: "P1",
    questionNumber: "6",
    sourcePages: [6],
    printedPageLabels: ["Page 06"],
    responseRegions: [{ id: "Q6_SPACE_MAIN", partId: "Q6_MAIN", pdfPage: 6, printedPageLabel: "Page 06", topPt: 300, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the coordinate-diagram line-equation instruction; lower boundary is the page footer region." }],
    answerSpaceCategory: "FULL_PAGE",
    estimatedWritingLines: 16,
    mode: "COORDINATE_DIAGRAM_LINE",
    familyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS",
    subFamilyId: "COORDINATE_DIAGRAM_LABELLED_POINTS",
    totalMarks: 3,
    g1Marks: 3,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "A", label: "A", x: -1, y: 6, xDisplay: "-1", yDisplay: "6", source: "DIAGRAM", printedCoordinate: "(-1, 6)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 3, y: -2, xDisplay: "3", yDisplay: "-2", source: "DIAGRAM", printedCoordinate: "(3, -2)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: abstractAxes(),
    visual: { visualType: "COORDINATE_DIAGRAM", sourcePageNumber: 6, sourcePagePosition: "TOP", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "16:9", dependency: "REQUIRED_TO_SOLVE", textRelationship: "VISUAL_ONLY", candidateMustReadValues: true, coordinateDataDuplicatedInText: false, exactGeometryRequiredForRenderer: true, axis: abstractAxes(), scatterPresent: false, lineOfBestFitPresent: false, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: false },
    context: noContext,
    target: null,
    sourceRelationship: "A coordinate-axis diagram supplies two labelled points and the straight line through them; the coordinates are visual data rather than duplicated prose givens.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "NEGATIVE"],
    expectedOutputDescription: "A simplified equation of line AB.",
    representationTransitions: [{ from: "coordinate-axis diagram with labelled points", to: "coordinate pairs and gradient", purpose: "extract the geometric data" }, { from: "gradient and one point", to: "straight-line equation", purpose: "determine the line" }],
    language: { sentenceCount: 3, promptWordCount: 24, informationDensity: "LOW", scaffoldingLevel: "LOW", introductionStyle: "DIAGRAM_FIRST", relationshipStatementStyle: "LINE_JOINING_TWO_NAMED_POINTS", commandStyle: "FIND_LINE_EQUATION_THEN_SIMPLEST_FORM", informationOrder: ["DIAGRAM_DESCRIPTION", "COORDINATE_DIAGRAM", "EQUATION_TASK", "SIMPLEST_FORM_REQUIREMENT"], normalisedPromptStructure: ["Identify a diagram containing a straight line through two named points.", "Require the equation of that line.", "Require simplest form."], lexicalFeatureTags: ["coordinate diagram", "visual data", "named points", "negative coordinates"], usesPronounReference: false },
    difficulty: { overall: "MEDIUM", methodSelection: "VERY_LOW", arithmetic: "LOW", algebraic: "LOW", representation: "MEDIUM", language: "VERY_LOW", contextInterpretation: "VERY_LOW", reasoningDepth: "VERY_LOW", difficultyDrivers: ["reading coordinates from a diagram", "signed coordinate differences", "negative gradient"] },
    structuralSignature: ["coordinate-axis diagram", "two labelled points", "visual coordinates", "negative gradient", "three-mark line equation"],
    surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION",
  },
  {
    year: 2018,
    paper: "P1",
    questionNumber: "7",
    sourcePages: [6, 7],
    printedPageLabels: ["page 06", "page 07"],
    responseRegions: [
      { id: "Q7_SPACE_A", partId: "Q7_a", pdfPage: 6, printedPageLabel: "page 06", topPt: 396, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q7_SPACE_B", partId: "Q7_b", pdfPage: 7, printedPageLabel: "page 07", topPt: 122, bottomPt: 355, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is immediately above the next question." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 13,
    mode: "CONTEXT_LINE_GRAPH",
    familyId: "GEO_G1_CONTEXTUAL_LINEAR_MODEL",
    subFamilyId: "CONTEXT_GRAPH_LABELLED_POINTS_WITH_FOLLOW_ON_CALCULATION",
    totalMarks: 4,
    g1Marks: 4,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "A", label: "A", x: 8, y: 14, xDisplay: "8", yDisplay: "14", source: "TEXT", printedCoordinate: "(8, 14)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 12, y: 20, xDisplay: "12", yDisplay: "20", source: "TEXT", printedCoordinate: "(12, 20)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: { xVariable: "d", xLabel: "distance travelled", xUnit: "miles", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "P", yLabel: "journey cost", yUnit: "pounds", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false },
    visual: { visualType: "GRAPH", sourcePageNumber: 6, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "16:9", dependency: "REDUNDANT_WITH_TEXT", textRelationship: "PARTLY_DUPLICATED", candidateMustReadValues: false, coordinateDataDuplicatedInText: true, exactGeometryRequiredForRenderer: false, axis: { xVariable: "d", xLabel: "distance travelled", xUnit: "miles", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "P", yLabel: "journey cost", yUnit: "pounds", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false }, scatterPresent: false, lineOfBestFitPresent: false, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: false },
    context: { contextualised: true, domain: "taxi pricing", role: "MODEL_DEFINING", objects: ["taxi journey", "distance", "cost"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q7_b", variable: "d", value: 5, unit: "miles", outputDescription: "journey cost" },
    sourceRelationship: "A deterministic straight-line graph models journey cost against distance; two named point values are stated explicitly and define the line.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "FRACTION"],
    expectedOutputDescription: "Part (a) requires a contextual line equation; part (b) requires a numerical cost calculated from that equation.",
    representationTransitions: [{ from: "contextual straight-line graph and two named observations", to: "line equation", purpose: "construct the pricing model" }, { from: "line equation", to: "contextual calculation", purpose: "evaluate the model at a new distance" }],
    language: { sentenceCount: 8, promptWordCount: 76, informationDensity: "MEDIUM", scaffoldingLevel: "MEDIUM", introductionStyle: "CONTEXT_THEN_DETERMINISTIC_GRAPH", relationshipStatementStyle: "TWO_REFERENCE_OBSERVATIONS_EXPLAINED_IN_PROSE", commandStyle: "PART_A_MODEL_THEN_PART_B_CALCULATE", informationOrder: ["CONTEXT", "GRAPH_VARIABLES", "GRAPH", "POINT_A", "POINT_B", "EQUATION_TASK", "FOLLOW_ON_INPUT"], normalisedPromptStructure: ["Introduce a pricing relationship.", "Define graph variables and units.", "Supply a straight-line graph.", "State two named point values.", "Ask for the line equation.", "Ask for a cost at a new distance."], lexicalFeatureTags: ["contextual graph", "deterministic linear model", "multipart", "fractional gradient"], usesPronounReference: false },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "MEDIUM", algebraic: "MEDIUM", representation: "LOW", language: "LOW", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["fractional gradient", "context-variable notation", "follow-on substitution"] },
    structuralSignature: ["deterministic contextual graph", "two explicit line points", "fractional gradient", "three-mark equation", "one-mark follow-on calculation"],
    surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS",
  },
  {
    year: 2019,
    paper: "P1",
    questionNumber: "6",
    sourcePages: [6, 7],
    printedPageLabels: ["page 06", "page 07"],
    responseRegions: [
      { id: "Q6_SPACE_A", partId: "Q6_a", pdfPage: 6, printedPageLabel: "page 06", topPt: 456, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q6_SPACE_B", partId: "Q6_b", pdfPage: 7, printedPageLabel: "page 07", topPt: 163, bottomPt: 365, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is immediately above the next question." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 13,
    mode: "BEST_FIT_READ_FROM_GRID",
    familyId: "GEO_G1_BEST_FIT_LINEAR_MODEL",
    subFamilyId: "BEST_FIT_GRID_READ_POINTS_WITH_FOLLOW_ON_ESTIMATE",
    totalMarks: 4,
    g1Marks: 3,
    embeddedS2Marks: 1,
    standardProfile: "C",
    thinkingProfile: "MIXED",
    points: [
      { id: "R1", label: null, x: 1.5, y: 14, xDisplay: "1.5", yDisplay: "14", source: "GRAPH", printedCoordinate: "(1.5, 14)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: true },
      { id: "R2", label: null, x: 3.5, y: 8, xDisplay: "3.5", yDisplay: "8", source: "GRAPH", printedCoordinate: "(3.5, 8)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: true },
    ],
    axis: { xVariable: "E", xLabel: "engine size", xUnit: "litres", xMinimum: 0, xMaximum: 5, xTickInterval: 1, yVariable: "F", yLabel: "fuel consumption", yUnit: "km/l", yMinimum: 0, yMaximum: 16, yTickInterval: 2, numericScaleShown: true, originShown: true, gridShown: true },
    visual: { visualType: "SCATTERGRAPH", sourcePageNumber: 6, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "LARGE", preferredGeneratedAspectRatio: "4:3", dependency: "REQUIRED_TO_SOLVE", textRelationship: "TEXT_EXPLAINS_VISUAL", candidateMustReadValues: true, coordinateDataDuplicatedInText: false, exactGeometryRequiredForRenderer: true, axis: { xVariable: "E", xLabel: "engine size", xUnit: "litres", xMinimum: 0, xMaximum: 5, xTickInterval: 1, yVariable: "F", yLabel: "fuel consumption", yUnit: "km/l", yMinimum: 0, yMaximum: 16, yTickInterval: 2, numericScaleShown: true, originShown: true, gridShown: true }, scatterPresent: true, lineOfBestFitPresent: true, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: true },
    context: { contextualised: true, domain: "vehicle fuel efficiency", role: "MODEL_DEFINING", objects: ["car", "engine size", "fuel consumption"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q6_b", variable: "E", value: 1.1, unit: "litres", outputDescription: "estimated fuel consumption" },
    sourceRelationship: "A scaled scattergraph supplies a line of best fit but no prose coordinate pair for the gradient; the candidate must select/read suitable line points from the graph before constructing the model.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "DECIMAL", "NEGATIVE"],
    expectedOutputDescription: "Part (a) requires a line-of-best-fit equation in contextual variables; part (b) requires an estimate at a decimal input.",
    representationTransitions: [{ from: "scaled scattergraph and best-fit line", to: "candidate-read coordinate pairs", purpose: "obtain suitable line points" }, { from: "read coordinate pairs", to: "line equation", purpose: "construct the model" }, { from: "line equation", to: "contextual estimate", purpose: "evaluate the model at a new engine size" }],
    language: { sentenceCount: 7, promptWordCount: 82, informationDensity: "MEDIUM", scaffoldingLevel: "LOW", introductionStyle: "CONTEXT_THEN_SCALED_SCATTERGRAPH", relationshipStatementStyle: "VARIABLES_DEFINED_BUT_REFERENCE_POINTS_NOT_GIVEN_IN_PROSE", commandStyle: "PART_A_READ_GRAPH_AND_MODEL_THEN_PART_B_USE_MODEL", informationOrder: ["CONTEXT", "VARIABLES", "SCALED_SCATTERGRAPH", "BEST_FIT_LINE", "EQUATION_TASK", "FOLLOW_ON_DECIMAL_INPUT"], normalisedPromptStructure: ["Introduce a vehicle context.", "Define the two variables and units.", "Supply a scaled scattergraph with a best-fit line.", "Require the candidate to obtain suitable line points from the graph and form the equation.", "Provide a new input for a follow-on estimate."], lexicalFeatureTags: ["scaled scattergraph", "candidate-read points", "best-fit line", "multipart", "decimal follow-on input"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "MEDIUM", algebraic: "MEDIUM", representation: "HIGH", language: "LOW", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["candidate must identify precise usable points on a plotted line", "negative gradient", "decimal coordinate/input handling"] },
    structuralSignature: ["scaled scattergraph", "best-fit line", "candidate-read line points", "three-mark equation", "one-mark follow-on estimate"],
    surfaceStyleId: "BEST_FIT_GRID_READ_POINTS",
  },
  {
    year: 2019,
    paper: "P2",
    questionNumber: "13",
    sourcePages: [32],
    printedPageLabels: ["page 12"],
    responseRegions: [{ id: "Q13_SPACE_MAIN", partId: "Q13_MAIN", pdfPage: 32, printedPageLabel: "page 12", topPt: 128, bottomPt: 358, boundaryConvention: "Upper boundary is immediately below the symbolic-gradient instruction; lower boundary is immediately above the next question." }],
    answerSpaceCategory: "LARGE",
    estimatedWritingLines: 9,
    mode: "SYMBOLIC_COORDINATE_GRADIENT",
    familyId: "GEO_G1_SYMBOLIC_GRADIENT_FROM_TWO_POINTS",
    subFamilyId: "SYMBOLIC_COORDINATES_FACTOR_AND_SIMPLIFY",
    totalMarks: 3,
    g1Marks: 3,
    embeddedS2Marks: 0,
    standardProfile: "A",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "A", label: "A", x: 6, y: 9, xDisplay: "6", yDisplay: "9", source: "TEXT", printedCoordinate: "(6, 9)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: "4p", y: "4p^2", xDisplay: "4p", yDisplay: "4p^2", source: "TEXT", printedCoordinate: "(4p, 4p^2)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: abstractAxes(),
    visual: null,
    context: noContext,
    target: null,
    sourceRelationship: "One numerical coordinate pair and one parameterised algebraic coordinate pair define a line; the task requires its gradient as a simplified expression rather than the line equation.",
    candidateMustConstructLineEquation: false,
    candidateMustFindGradientExpressionOnly: true,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "ALGEBRAIC", "POWER", "FRACTION"],
    expectedOutputDescription: "A simplified algebraic expression for the gradient.",
    representationTransitions: [{ from: "two coordinate pairs including a parameterised point", to: "gradient quotient", purpose: "apply the two-point gradient definition" }, { from: "rational algebraic gradient", to: "factorised and cancelled expression", purpose: "reach simplest form" }],
    language: { sentenceCount: 2, promptWordCount: 22, informationDensity: "LOW", scaffoldingLevel: "LOW", introductionStyle: "DIRECT_SYMBOLIC_COORDINATE_TASK", relationshipStatementStyle: "TWO_POINTS_WITH_ONE_PARAMETERISED", commandStyle: "FIND_GRADIENT_EXPRESSION_THEN_SIMPLEST_FORM", informationOrder: ["GRADIENT_TASK", "POINT_A", "POINT_B", "SIMPLEST_FORM_REQUIREMENT"], normalisedPromptStructure: ["Supply two points, one containing an algebraic parameter.", "Ask for the gradient expression.", "Require simplest form."], lexicalFeatureTags: ["abstract coordinate geometry", "symbolic coordinate", "algebraic fraction", "factorisation", "higher demand"], usesPronounReference: false },
    difficulty: { overall: "HIGH", methodSelection: "VERY_LOW", arithmetic: "LOW", algebraic: "HIGH", representation: "MEDIUM", language: "VERY_LOW", contextInterpretation: "VERY_LOW", reasoningDepth: "MEDIUM", difficultyDrivers: ["parameterised coordinate", "difference-of-squares recognition inside the gradient numerator", "factor-and-cancel simplification of an algebraic fraction"] },
    structuralSignature: ["two coordinate pairs", "one symbolic point", "gradient only", "algebraic rational expression", "factorisation required", "three marks"],
    surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT",
  },
  {
    year: 2021,
    paper: "P1",
    questionNumber: "10",
    sourcePages: [8, 9],
    printedPageLabels: ["page 08", "page 09"],
    responseRegions: [
      { id: "Q10_SPACE_A", partId: "Q10_a", pdfPage: 8, printedPageLabel: "page 08", topPt: 379, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q10_SPACE_B", partId: "Q10_b", pdfPage: 9, printedPageLabel: "page 09", topPt: 122, bottomPt: 264, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is immediately above the next question." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 12,
    mode: "CONTEXT_LINE_GRAPH",
    familyId: "GEO_G1_CONTEXTUAL_LINEAR_MODEL",
    subFamilyId: "CONTEXT_GRAPH_LABELLED_POINTS_WITH_FOLLOW_ON_CALCULATION",
    totalMarks: 4,
    g1Marks: 4,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "A", label: "A", x: 6000, y: 450, xDisplay: "6000", yDisplay: "450", source: "TEXT", printedCoordinate: "(6000, 450)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 7200, y: 510, xDisplay: "7200", yDisplay: "510", source: "TEXT", printedCoordinate: "(7200, 510)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: { xVariable: "S", xLabel: "sales", xUnit: "pounds", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "W", yLabel: "weekly wage", yUnit: "pounds", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false },
    visual: { visualType: "GRAPH", sourcePageNumber: 8, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "16:9", dependency: "REDUNDANT_WITH_TEXT", textRelationship: "PARTLY_DUPLICATED", candidateMustReadValues: false, coordinateDataDuplicatedInText: true, exactGeometryRequiredForRenderer: false, axis: { xVariable: "S", xLabel: "sales", xUnit: "pounds", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "W", yLabel: "weekly wage", yUnit: "pounds", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: true, gridShown: false }, scatterPresent: false, lineOfBestFitPresent: false, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: false },
    context: { contextualised: true, domain: "wages and commission", role: "MODEL_DEFINING", objects: ["weekly wage", "basic wage", "commission", "sales"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q10_b", variable: "S", value: 1000, unit: "pounds", outputDescription: "weekly wage" },
    sourceRelationship: "A deterministic straight-line graph models weekly wage against sales; two named sales/wage observations are stated explicitly.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "FRACTION"],
    expectedOutputDescription: "Part (a) requires a contextual line equation; part (b) requires a wage calculated at a new sales value.",
    representationTransitions: [{ from: "contextual straight-line graph and two named observations", to: "line equation", purpose: "construct the wage model" }, { from: "line equation", to: "contextual calculation", purpose: "evaluate the wage model at a new sales amount" }],
    language: { sentenceCount: 8, promptWordCount: 78, informationDensity: "MEDIUM", scaffoldingLevel: "MEDIUM", introductionStyle: "CONTEXT_THEN_DETERMINISTIC_GRAPH", relationshipStatementStyle: "TWO_REFERENCE_OBSERVATIONS_EXPLAINED_IN_PROSE", commandStyle: "PART_A_MODEL_THEN_PART_B_CALCULATE", informationOrder: ["CONTEXT", "PAY_STRUCTURE", "GRAPH_VARIABLES", "GRAPH", "POINT_A", "POINT_B", "EQUATION_TASK", "FOLLOW_ON_INPUT"], normalisedPromptStructure: ["Introduce a wage-and-sales context.", "Explain the linear pay structure.", "Supply a straight-line graph with two named points.", "State the point values in prose.", "Ask for a simplest-form equation.", "Ask for a wage at a new sales value."], lexicalFeatureTags: ["contextual graph", "deterministic linear model", "large coordinate values", "fractional gradient", "multipart"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "MEDIUM", algebraic: "MEDIUM", representation: "LOW", language: "LOW", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["large coordinate values with a simple ratio", "small fractional gradient", "context-variable notation"] },
    structuralSignature: ["deterministic contextual graph", "two explicit line points", "large coordinates", "fractional gradient", "three-mark equation", "one-mark follow-on calculation"],
    surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS",
  },
  {
    year: 2022,
    paper: "P1",
    questionNumber: "6",
    sourcePages: [6],
    printedPageLabels: ["page 06"],
    responseRegions: [{ id: "Q6_SPACE_MAIN", partId: "Q6_MAIN", pdfPage: 6, printedPageLabel: "page 06", topPt: 472, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the line-equation instruction; lower boundary is the page footer region." }],
    answerSpaceCategory: "LARGE",
    estimatedWritingLines: 11,
    mode: "DIRECT_COORDINATES_LINE",
    familyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS",
    subFamilyId: "DIRECT_TEXT_COORDINATES",
    totalMarks: 3,
    g1Marks: 3,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "P1", label: null, x: -3, y: -1, xDisplay: "-3", yDisplay: "-1", source: "TEXT", printedCoordinate: "(-3, -1)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "P2", label: null, x: -5, y: 7, xDisplay: "-5", yDisplay: "7", source: "TEXT", printedCoordinate: "(-5, 7)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: abstractAxes(),
    visual: null,
    context: noContext,
    target: null,
    sourceRelationship: "Two signed Cartesian coordinate pairs are supplied directly and define one non-vertical straight line.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "NEGATIVE"],
    expectedOutputDescription: "A simplified straight-line equation in x and y.",
    representationTransitions: [{ from: "two signed coordinate pairs", to: "gradient and line equation", purpose: "determine the unique line through the points" }],
    language: { sentenceCount: 2, promptWordCount: 18, informationDensity: "LOW", scaffoldingLevel: "LOW", introductionStyle: "DIRECT_COORDINATE_PAIR_TASK", relationshipStatementStyle: null, commandStyle: "FIND_LINE_EQUATION_THEN_SIMPLEST_FORM", informationOrder: ["LINE_TASK", "POINT_1", "POINT_2", "SIMPLEST_FORM_REQUIREMENT"], normalisedPromptStructure: ["Supply two signed coordinate pairs.", "Ask for the line through them.", "Require simplest form."], lexicalFeatureTags: ["abstract coordinate geometry", "negative coordinates", "minimal prose"], usesPronounReference: false },
    difficulty: { overall: "LOW", methodSelection: "VERY_LOW", arithmetic: "MEDIUM", algebraic: "LOW", representation: "VERY_LOW", language: "VERY_LOW", contextInterpretation: "VERY_LOW", reasoningDepth: "VERY_LOW", difficultyDrivers: ["subtracting negative coordinates", "negative gradient", "negative intercept"] },
    structuralSignature: ["two explicit coordinate pairs", "negative coordinates", "no visual", "three-mark line equation"],
    surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION",
  },
  {
    year: 2023,
    paper: "P1",
    questionNumber: "7",
    sourcePages: [8, 9],
    printedPageLabels: ["page 08", "page 09"],
    responseRegions: [
      { id: "Q7_SPACE_A", partId: "Q7_a", pdfPage: 8, printedPageLabel: "page 08", topPt: 472, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q7_SPACE_B", partId: "Q7_b", pdfPage: 9, printedPageLabel: "page 09", topPt: 138, bottomPt: 268, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is immediately above the next question." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 12,
    mode: "BEST_FIT_READ_FROM_GRID",
    familyId: "GEO_G1_BEST_FIT_LINEAR_MODEL",
    subFamilyId: "BEST_FIT_GRID_READ_POINTS_WITH_FOLLOW_ON_ESTIMATE",
    totalMarks: 4,
    g1Marks: 3,
    embeddedS2Marks: 1,
    standardProfile: "C",
    thinkingProfile: "MIXED",
    points: [
      { id: "R1", label: null, x: 5, y: 20000, xDisplay: "5", yDisplay: "20000", source: "GRAPH", printedCoordinate: "(5, 20000)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: true },
      { id: "R2", label: null, x: 15, y: 35000, xDisplay: "15", yDisplay: "35000", source: "GRAPH", printedCoordinate: "(15, 35000)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: true },
      { id: "R3", label: null, x: 25, y: 50000, xDisplay: "25", yDisplay: "50000", source: "GRAPH", printedCoordinate: "(25, 50000)", isPrimaryGradientPoint: false, isCandidateReadFromGraph: true },
    ],
    axis: { xVariable: "T", xLabel: "time worked", xUnit: "years", xMinimum: 0, xMaximum: 30, xTickInterval: 5, yVariable: "P", yLabel: "salary", yUnit: "pounds", yMinimum: 0, yMaximum: 60000, yTickInterval: 10000, numericScaleShown: true, originShown: true, gridShown: true },
    visual: { visualType: "SCATTERGRAPH", sourcePageNumber: 8, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "LARGE", preferredGeneratedAspectRatio: "4:3", dependency: "REQUIRED_TO_SOLVE", textRelationship: "TEXT_EXPLAINS_VISUAL", candidateMustReadValues: true, coordinateDataDuplicatedInText: false, exactGeometryRequiredForRenderer: true, axis: { xVariable: "T", xLabel: "time worked", xUnit: "years", xMinimum: 0, xMaximum: 30, xTickInterval: 5, yVariable: "P", yLabel: "salary", yUnit: "pounds", yMinimum: 0, yMaximum: 60000, yTickInterval: 10000, numericScaleShown: true, originShown: true, gridShown: true }, scatterPresent: true, lineOfBestFitPresent: true, candidateDrawsBestFitLine: false, interpolationRequired: true, extrapolationRequired: false },
    context: { contextualised: true, domain: "salary and employment duration", role: "MODEL_DEFINING", objects: ["employee", "salary", "time worked"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q7_b", variable: "T", value: 8, unit: "years", outputDescription: "estimated salary" },
    sourceRelationship: "A scaled scattergraph supplies a best-fit line without prose reference coordinates; the candidate must read suitable points from the line before constructing the model.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER"],
    expectedOutputDescription: "Part (a) requires a line-of-best-fit equation in contextual variables; part (b) requires an estimated salary.",
    representationTransitions: [{ from: "scaled scattergraph and best-fit line", to: "candidate-read line coordinates", purpose: "obtain usable points" }, { from: "read coordinates", to: "line equation", purpose: "construct the salary model" }, { from: "line equation", to: "contextual estimate", purpose: "evaluate the model at a specified duration" }],
    language: { sentenceCount: 7, promptWordCount: 80, informationDensity: "MEDIUM", scaffoldingLevel: "LOW", introductionStyle: "CONTEXT_THEN_SCALED_SCATTERGRAPH", relationshipStatementStyle: "VARIABLES_DEFINED_WITHOUT_REFERENCE_POINT_VALUES", commandStyle: "PART_A_READ_GRAPH_AND_MODEL_THEN_PART_B_USE_MODEL", informationOrder: ["CONTEXT", "VARIABLES", "SCALED_SCATTERGRAPH", "BEST_FIT_LINE", "EQUATION_TASK", "FOLLOW_ON_INPUT"], normalisedPromptStructure: ["Introduce an employment context.", "Define salary and time variables.", "Supply a scaled scattergraph with a best-fit line.", "Ask for the simplest-form equation using points read from the line.", "Ask for a follow-on estimate."], lexicalFeatureTags: ["scaled scattergraph", "candidate-read points", "large y-values", "best-fit line", "multipart"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "MEDIUM", algebraic: "MEDIUM", representation: "HIGH", language: "LOW", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["choosing/readable graph coordinates", "large salary scale", "coordinating line equation with contextual notation"] },
    structuralSignature: ["scaled scattergraph", "best-fit line", "candidate-read line points", "large coordinate scale", "three-mark equation", "one-mark follow-on estimate"],
    surfaceStyleId: "BEST_FIT_GRID_READ_POINTS",
  },
  {
    year: 2024,
    paper: "P1",
    questionNumber: "9",
    sourcePages: [8, 9],
    printedPageLabels: ["page 08", "page 09"],
    responseRegions: [
      { id: "Q9_SPACE_A", partId: "Q9_a", pdfPage: 8, printedPageLabel: "page 08", topPt: 497, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the part (a) instruction; lower boundary is the page footer region." },
      { id: "Q9_SPACE_B", partId: "Q9_b", pdfPage: 9, printedPageLabel: "page 09", topPt: 166, bottomPt: 439, boundaryConvention: "Upper boundary is immediately below the part (b) instruction; lower boundary is the turn-over/footer region." },
    ],
    answerSpaceCategory: "MIXED",
    estimatedWritingLines: 13,
    mode: "BEST_FIT_LABELLED_POINTS",
    familyId: "GEO_G1_BEST_FIT_LINEAR_MODEL",
    subFamilyId: "BEST_FIT_LABELLED_POINTS_WITH_FOLLOW_ON_ESTIMATE",
    totalMarks: 4,
    g1Marks: 3,
    embeddedS2Marks: 1,
    standardProfile: "C",
    thinkingProfile: "MIXED",
    points: [
      { id: "A", label: "A", x: 3, y: 26, xDisplay: "3", yDisplay: "26", source: "TEXT", printedCoordinate: "(3, 26)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 10, y: 12, xDisplay: "10", yDisplay: "12", source: "TEXT", printedCoordinate: "(10, 12)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: { xVariable: "T", xLabel: "time driving", xUnit: "minutes", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "D", yLabel: "distance to finish", yUnit: "km", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: false, gridShown: false },
    visual: { visualType: "SCATTERGRAPH", sourcePageNumber: 8, sourcePagePosition: "MIDDLE", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "4:3", dependency: "REDUNDANT_WITH_TEXT", textRelationship: "PARTLY_DUPLICATED", candidateMustReadValues: false, coordinateDataDuplicatedInText: true, exactGeometryRequiredForRenderer: false, axis: { xVariable: "T", xLabel: "time driving", xUnit: "minutes", xMinimum: 0, xMaximum: null, xTickInterval: null, yVariable: "D", yLabel: "distance to finish", yUnit: "km", yMinimum: 0, yMaximum: null, yTickInterval: null, numericScaleShown: false, originShown: false, gridShown: false }, scatterPresent: true, lineOfBestFitPresent: true, candidateDrawsBestFitLine: false, interpolationRequired: true, extrapolationRequired: false },
    context: { contextualised: true, domain: "car rally progress", role: "MODEL_DEFINING", objects: ["competitor", "driving time", "distance to finishing line"], realWorldUnitsPresent: true, contextCanBeSafelyReplaced: true },
    target: { partId: "Q9_b", variable: "T", value: 7, unit: "minutes", outputDescription: "estimated distance to the finishing line" },
    sourceRelationship: "A best-fit line relates driving time to remaining distance; two named points are stated in prose and plotted on the graph.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER", "NEGATIVE"],
    expectedOutputDescription: "Part (a) requires a contextual best-fit line equation; part (b) requires a distance estimate at a specified time.",
    representationTransitions: [{ from: "scattergraph with best-fit line and named observations", to: "line equation", purpose: "construct the rally-progress model" }, { from: "line equation", to: "contextual estimate", purpose: "estimate remaining distance for another competitor" }],
    language: { sentenceCount: 9, promptWordCount: 100, informationDensity: "HIGH", scaffoldingLevel: "MEDIUM", introductionStyle: "CONTEXT_THEN_SCATTER_RELATIONSHIP", relationshipStatementStyle: "TWO_REFERENCE_OBSERVATIONS_EXPLAINED_IN_PROSE", commandStyle: "PART_A_MODEL_THEN_PART_B_USE_MODEL", informationOrder: ["CONTEXT", "VARIABLES", "SCATTERGRAPH", "BEST_FIT_LINE", "POINT_A", "POINT_B", "EQUATION_TASK", "NEW_COMPETITOR_INPUT", "FOLLOW_ON_ESTIMATE"], normalisedPromptStructure: ["Introduce a time-versus-distance context.", "Define the graph variables and units.", "Supply a scattergraph with a best-fit line.", "State two named point values.", "Ask for the simplest-form equation.", "Provide another input and ask for an estimate."], lexicalFeatureTags: ["contextual scattergraph", "best-fit line", "negative gradient", "named points", "multipart"], usesPronounReference: true },
    difficulty: { overall: "MEDIUM", methodSelection: "LOW", arithmetic: "LOW", algebraic: "MEDIUM", representation: "MEDIUM", language: "MEDIUM", contextInterpretation: "LOW", reasoningDepth: "LOW", difficultyDrivers: ["negative contextual gradient", "model equation in nonstandard variable letters", "follow-on interpolation"] },
    structuralSignature: ["contextual scattergraph", "best-fit line", "two explicit line points", "negative gradient", "three-mark equation", "one-mark follow-on estimate"],
    surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT",
  },
  {
    year: 2025,
    paper: "P1",
    questionNumber: "6",
    sourcePages: [6],
    printedPageLabels: ["page 06"],
    responseRegions: [{ id: "Q6_SPACE_MAIN", partId: "Q6_MAIN", pdfPage: 6, printedPageLabel: "page 06", topPt: 296, bottomPt: 760, boundaryConvention: "Upper boundary is immediately below the coordinate-diagram line-equation instruction; lower boundary is the page footer region." }],
    answerSpaceCategory: "FULL_PAGE",
    estimatedWritingLines: 16,
    mode: "COORDINATE_DIAGRAM_LINE",
    familyId: "GEO_G1_LINE_EQUATION_FROM_TWO_POINTS",
    subFamilyId: "COORDINATE_DIAGRAM_LABELLED_POINTS",
    totalMarks: 3,
    g1Marks: 3,
    embeddedS2Marks: 0,
    standardProfile: "C",
    thinkingProfile: "OPERATIONAL",
    points: [
      { id: "A", label: "A", x: 1, y: 12, xDisplay: "1", yDisplay: "12", source: "DIAGRAM", printedCoordinate: "(1, 12)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
      { id: "B", label: "B", x: 6, y: 2, xDisplay: "6", yDisplay: "2", source: "DIAGRAM", printedCoordinate: "(6, 2)", isPrimaryGradientPoint: true, isCandidateReadFromGraph: false },
    ],
    axis: abstractAxes(),
    visual: { visualType: "COORDINATE_DIAGRAM", sourcePageNumber: 6, sourcePagePosition: "TOP", sourceRelativeWidth: "MEDIUM", preferredGeneratedAspectRatio: "16:9", dependency: "REQUIRED_TO_SOLVE", textRelationship: "VISUAL_ONLY", candidateMustReadValues: true, coordinateDataDuplicatedInText: false, exactGeometryRequiredForRenderer: true, axis: abstractAxes(), scatterPresent: false, lineOfBestFitPresent: false, candidateDrawsBestFitLine: false, interpolationRequired: false, extrapolationRequired: false },
    context: noContext,
    target: null,
    sourceRelationship: "A coordinate-axis diagram supplies two labelled positive-coordinate points and the line through them; the coordinates are visual givens.",
    candidateMustConstructLineEquation: true,
    candidateMustFindGradientExpressionOnly: false,
    simplestFormExplicit: true,
    workingExplicitlyRequested: false,
    numberTypes: ["INTEGER"],
    expectedOutputDescription: "A simplified equation of line AB.",
    representationTransitions: [{ from: "coordinate-axis diagram with labelled points", to: "coordinate pairs and gradient", purpose: "extract the geometric data" }, { from: "gradient and one point", to: "straight-line equation", purpose: "determine the line" }],
    language: { sentenceCount: 3, promptWordCount: 23, informationDensity: "LOW", scaffoldingLevel: "LOW", introductionStyle: "DIAGRAM_FIRST", relationshipStatementStyle: "LINE_PASSING_THROUGH_TWO_NAMED_POINTS", commandStyle: "FIND_LINE_EQUATION_THEN_SIMPLEST_FORM", informationOrder: ["DIAGRAM_DESCRIPTION", "COORDINATE_DIAGRAM", "EQUATION_TASK", "SIMPLEST_FORM_REQUIREMENT"], normalisedPromptStructure: ["Identify a coordinate diagram with a straight line through two points.", "Ask for the equation of the line.", "Require simplest form."], lexicalFeatureTags: ["coordinate diagram", "visual data", "named points", "negative gradient"], usesPronounReference: false },
    difficulty: { overall: "LOW", methodSelection: "VERY_LOW", arithmetic: "LOW", algebraic: "LOW", representation: "MEDIUM", language: "VERY_LOW", contextInterpretation: "VERY_LOW", reasoningDepth: "VERY_LOW", difficultyDrivers: ["reading coordinates from the diagram", "negative gradient", "constructing the intercept"] },
    structuralSignature: ["coordinate-axis diagram", "two labelled points", "visual coordinates", "negative gradient", "three-mark line equation"],
    surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION",
  },
] as const;

export const getG1QuestionConfig = (
  year: G1QuestionConfig["year"],
  paper: G1QuestionConfig["paper"],
  questionNumber: string,
): G1QuestionConfig => {
  const config = G1_QUESTION_CONFIGS.find(
    (entry) => entry.year === year && entry.paper === paper && entry.questionNumber === questionNumber,
  );
  if (!config) throw new Error(`Missing G1 catalogue config for ${year} ${paper} Q${questionNumber}`);
  return config;
};
