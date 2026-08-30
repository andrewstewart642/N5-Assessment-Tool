import type {
  DifficultyLevel,
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  PaperPart,
  StraightLineSystemGraphPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import type {
  ConceptGeneratorModule,
  GeneratedQuestionData,
  GeneratorContext,
  StructureType,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import type {
  QuestionVariantSelectionMeta,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import {
  A8_DEFAULT_DIFFICULTY_LEVEL,
  A8_DIFFICULTY_BANDS,
  A8_EMPIRICAL_FAMILY_FREQUENCY,
  A8_GENERATOR_FAMILY_EVIDENCE,
  A8_SUPPORTED_DIFFICULTY_LEVELS,
  a8FamilySupportsDifficulty,
  generateA8Question,
  type A8GeneratedQuestion,
  type A8GeneratorDifficulty,
  type A8GeneratorFamily,
  type A8GeneratorPaper,
} from "../../../../../National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A8-SimultaneousEquations";

import {
  generateA8Answer,
} from "../../../../../National5Maths/04_AnswerGeneration/02-Algebraic/ALG-A8-SimultaneousEquations";

type A8BuilderCode =
  | "A8"
  | "A8.1"
  | "A8.2"
  | "A8.3"
  | "A8.4";

type A8Level = 1 | 2 | 3;

const ALL_FAMILIES: A8GeneratorFamily[] = [
  "ABSTRACT_SOLVE",
  "CONTEXT_FORM_AND_SOLVE",
  "GRAPH_INTERSECTION_SOLVE",
  "CONTEXT_DERIVED_TOTAL",
];

const isReasoningFamily = (
  family: A8GeneratorFamily
) =>
  family === "CONTEXT_FORM_AND_SOLVE" ||
  family === "CONTEXT_DERIVED_TOTAL";

const marksForFamily = (
  family: A8GeneratorFamily
) =>
  isReasoningFamily(family)
    ? 6
    : 3;

const structureForFamily = (
  family: A8GeneratorFamily
): StructureType => {
  if (family === "ABSTRACT_SOLVE") {
    return "EquationSolving";
  }

  if (family === "GRAPH_INTERSECTION_SOLVE") {
    return "CompoundSkills";
  }

  return "ContextualProblem";
};

const selectionMeta = (
  level: A8Level,
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  templateId = `a8-${family.toLowerCase()}-${paper.toLowerCase()}-l${level}`
): QuestionVariantSelectionMeta => ({
  level,
  templateId,
  marks: {
    totalMarks: marksForFamily(family),

    // A8's historical C/A ownership has not yet had the dedicated calibration
    // pass needed to split these marks safely. Keeping both at zero means the
    // live bridge is selectable under A+C using the known total-mark truth,
    // without inventing a C-only or A-only allocation.
    cMarks: 0,
    aMarks: 0,
    reasoningMarks:
      isReasoningFamily(family)
        ? 1
        : 0,
  },
  standardProfile: "C+A",
  paperSuitability: paper,
  calculatorStatus:
    paper === "P1"
      ? "NonCalculatorOnly"
      : "CalculatorAllowed",
});

const entriesForFamilies = (
  level: A8Level,
  families: readonly A8GeneratorFamily[]
): QuestionVariantSelectionMeta[] =>
  families.flatMap((family) => {
    if (!a8FamilySupportsDifficulty(family, level)) {
      return [];
    }

    return A8_GENERATOR_FAMILY_EVIDENCE[
      family
    ].supportedPapers.map((paper) =>
      selectionMeta(
        level,
        family,
        paper
      )
    );
  });

const levelSelectionProfile = (
  families: readonly A8GeneratorFamily[],
  levels: readonly A8Level[]
): NonNullable<
  ConceptGeneratorModule["metadata"]["levelSelectionProfile"]
> =>
  Object.fromEntries(
    levels.map((level) => [
      level,
      entriesForFamilies(
        level,
        families
      ),
    ])
  );

const resolveDifficulty = (
  difficulty: DifficultyLevel
): A8GeneratorDifficulty => {
  if (
    difficulty === 1 ||
    difficulty === 2 ||
    difficulty === 3
  ) {
    return difficulty;
  }

  throw new Error(
    `A8 supports only its calibrated difficulty levels 1, 2 and 3; received ${difficulty}.`
  );
};

const resolvePaper = (
  context: GeneratorContext,
  explicitFamily?: A8GeneratorFamily
): A8GeneratorPaper => {
  const requested =
    context.paper ??
    context.selectionFilters
      ?.targetPaper;

  if (
    requested === "P1" ||
    requested === "P2"
  ) {
    return requested;
  }

  if (explicitFamily) {
    const papers =
      A8_GENERATOR_FAMILY_EVIDENCE[
        explicitFamily
      ].supportedPapers;

    if (papers.length === 1) {
      return papers[0];
    }
  }

  return "P1";
};

const familyMatchesBuilderRequest = (
  family: A8GeneratorFamily,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
  context: GeneratorContext
) => {
  const evidence =
    A8_GENERATOR_FAMILY_EVIDENCE[
      family
    ];

  if (
    !evidence.supportedPapers.includes(
      paper
    ) ||
    !a8FamilySupportsDifficulty(
      family,
      difficulty
    )
  ) {
    return false;
  }

  const filters =
    context.selectionFilters;

  if (!filters) {
    return true;
  }

  // Until A8 has a dedicated C/A ownership calibration, the bridge only
  // claims the combined A+C standard. This is deliberate source honesty rather
  // than an arbitrary split of historical marks.
  if (
    filters.selectedStandard !==
    "C+A"
  ) {
    return false;
  }

  if (
    marksForFamily(family) !==
    filters.targetMarks
  ) {
    return false;
  }

  const reasoning =
    isReasoningFamily(family);

  if (
    filters.selectedThinkingType ===
      "REASONING" &&
    !reasoning
  ) {
    return false;
  }

  if (
    filters.selectedThinkingType ===
      "OPERATIONAL" &&
    reasoning
  ) {
    return false;
  }

  return true;
};

const chooseMixedFamily = (
  seed: number,
  paper: A8GeneratorPaper,
  difficulty: A8GeneratorDifficulty,
  context: GeneratorContext
): A8GeneratorFamily => {
  const eligible =
    ALL_FAMILIES.filter((family) =>
      familyMatchesBuilderRequest(
        family,
        paper,
        difficulty,
        context
      )
    );

  if (eligible.length === 0) {
    throw new Error(
      `No A8 family matches ${paper}, difficulty ${difficulty}, the current target marks and thinking-type filters.`
    );
  }

  const frequencies =
    A8_EMPIRICAL_FAMILY_FREQUENCY[
      paper
    ];

  const weighted = eligible.flatMap(
    (family) => {
      const observed =
        frequencies.find(
          (entry) =>
            entry.family === family
        );

      const weight =
        Math.max(
          1,
          observed?.count ?? 1
        );

      return Array.from(
        { length: weight },
        () => family
      );
    }
  );

  return weighted[
    (seed >>> 0) % weighted.length
  ];
};

const answerText = (
  finalAnswers: {
    partLabel: string;
    normalisedAnswer: string;
  }[]
) =>
  finalAnswers
    .map((answer) =>
      answer.partLabel
        ? `(${answer.partLabel}) ${answer.normalisedAnswer}`
        : answer.normalisedAnswer
    )
    .join("\n");

const asTextParts = (
  value: string
): PaperPart[] => [
  {
    kind: "text",
    value,
  },
];

const graphPart = (
  question: A8GeneratedQuestion
): StraightLineSystemGraphPart | null => {
  if (!question.visual) {
    return null;
  }

  return {
    kind: "straightLineSystemGraph",
    xVariable:
      question.visual.xVariable,
    yVariable:
      question.visual.yVariable,
    firstEquation:
      question.visual.firstEquation,
    secondEquation:
      question.visual.secondEquation,
    intersection:
      question.visual.intersection,
    labelledIntersection:
      question.visual.labelledIntersection,
  };
};

const promptPartsFor = (
  question: A8GeneratedQuestion
): PaperPart[] => {
  const graph = graphPart(question);

  if (!graph) {
    return question.promptParts;
  }

  if (question.promptParts.length >= 3) {
    return [
      question.promptParts[0],
      question.promptParts[1],
      graph,
      ...question.promptParts.slice(2),
    ];
  }

  return [
    ...question.promptParts,
    graph,
  ];
};

const generatedSelectionMeta = (
  question: A8GeneratedQuestion,
  templateId: string
): QuestionVariantSelectionMeta =>
  selectionMeta(
    question.difficulty,
    question.family,
    question.paper,
    templateId
  );

const generateBuilderA8 = (
  context: GeneratorContext,
  explicitFamily?: A8GeneratorFamily
): GeneratedQuestionData => {
  const difficulty =
    resolveDifficulty(
      context.difficulty
    );
  const paper =
    resolvePaper(
      context,
      explicitFamily
    );
  const seed =
    Math.floor(
      Math.random() * 0x7fffffff
    ) + 1;

  const family =
    explicitFamily ??
    chooseMixedFamily(
      seed,
      paper,
      difficulty,
      context
    );

  if (
    !familyMatchesBuilderRequest(
      family,
      paper,
      difficulty,
      context
    )
  ) {
    throw new Error(
      `${family} is not eligible under the current A8 Builder filters.`
    );
  }

  const question =
    generateA8Question({
      seed,
      difficulty,
      family,
      paper,
      includeExperimentalFamilies: true,
    });

  const markingScheme =
    generateA8Answer(
      question
    );

  const finalAnswer =
    answerText(
      markingScheme.finalAnswers
    );

  const workedAnswers = {
    defaultMethodFamilyId:
      markingScheme.defaultMethodFamilyId,
    methods:
      markingScheme.methods.map(
        (method) => ({
          methodFamilyId:
            method.methodFamilyId,
          lines:
            method.lines.map(
              (line) => ({
                id: line.id,
                parts:
                  asTextParts(
                    line.text
                  ),
                markNumbers:
                  line.markNumbers,
              })
            ),
          evidenceScore:
            method.methodFamilyId ===
            markingScheme.defaultMethodFamilyId
              ? 1
              : 0.9,
          sourceEvidenceIds:
            method.sourceEvidenceIds,
        })
      ),
  };

  const templateId = [
    "clean-a8",
    question.family.toLowerCase(),
    question.paper.toLowerCase(),
    `l${question.difficulty}`,
    question.context?.contextId ??
      "bare",
  ].join(":");

  const conceptCode =
    context.concept?.code ??
    "A8";

  const conceptLabel =
    context.concept?.label ??
    "Mixed simultaneous equations";

  const contextual =
    isReasoningFamily(
      question.family
    );

  return {
    prompt:
      question.prompt,
    answer:
      finalAnswer,
    marks:
      question.marks,
    questionCode:
      question.instanceId,
    promptParts:
      promptPartsFor(
        question
      ),
    answerParts:
      asTextParts(
        finalAnswer
      ),
    workedAnswers,
    classification: {
      standard: "Mixed",
      calculatorStatus:
        question.paper === "P1"
          ? "NonCalculatorOnly"
          : "Either",
      structureType:
        structureForFamily(
          question.family
        ),
      isReasoning:
        contextual,
      paperSuitability:
        question.paper,
    },
    sourceSkillCode:
      "A8",
    sourceConceptCode:
      conceptCode,
    sourceConceptLabel:
      conceptLabel,
    templateId,
    topicMarkBreakdown: {
      NUM: 0,
      ALG: question.marks,
      GEO: 0,
      TRIG: 0,
      STAT: 0,
    },
    selectionMeta:
      generatedSelectionMeta(
        question,
        templateId
      ),
  };
};

type ModuleOptions = {
  code: A8BuilderCode;
  label: string;
  families: A8GeneratorFamily[];
  levels: A8Level[];
  defaultLevel: A8Level;
  paperSuitability: "BOTH" | Paper;
  explicitFamily?: A8GeneratorFamily;
};

const makeA8Module = ({
  code,
  label,
  families,
  levels,
  defaultLevel,
  paperSuitability,
  explicitFamily,
}: ModuleOptions): ConceptGeneratorModule => ({
  metadata: {
    moduleId:
      `NQ_N5_ALG_${code.replaceAll(".", "_")}_SIMULTANEOUS_EQUATIONS`,
    domain: "ALG",
    skillCode: "A8",
    conceptCode: code,
    conceptLabel: label,
    tags: [
      "simultaneous equations",
      "elimination",
      "clean architecture bridge",
    ],
    difficultyProfile: {
      availableLevels:
        levels,
      defaultLevel,
      levelDescriptions:
        Object.fromEntries(
          A8_DIFFICULTY_BANDS.map(
            (band) => [
              band.level,
              band.description,
            ]
          )
        ),
    },
    capabilities: {
      standardCoverage: [
        "Mixed",
      ],
      canGenerateReasoning:
        families.some(
          isReasoningFamily
        ),
      calculatorStatus:
        paperSuitability === "P1"
          ? "NonCalculatorOnly"
          : "Either",
      paperSuitability,
      typicalStructureTypes: [
        ...new Set(
          families.map(
            structureForFamily
          )
        ),
      ],
    },
    levelSelectionProfile:
      levelSelectionProfile(
        families,
        levels
      ),
  },

  canHandle: (conceptCode) =>
    conceptCode === code,

  generate: (context) =>
    generateBuilderA8(
      context,
      explicitFamily
    ),
});

export const A8MixedConceptModule =
  makeA8Module({
    code: "A8",
    label:
      "Mixed simultaneous equations",
    families:
      ALL_FAMILIES,
    levels: [1, 2, 3],
    defaultLevel:
      A8_DEFAULT_DIFFICULTY_LEVEL,
    paperSuitability:
      "BOTH",
  });

export const A8BasicConceptModule =
  makeA8Module({
    code: "A8.1",
    label:
      "Solve simultaneous equations algebraically",
    families: [
      "ABSTRACT_SOLVE",
    ],
    levels:
      [...A8_SUPPORTED_DIFFICULTY_LEVELS] as A8Level[],
    defaultLevel:
      A8_DEFAULT_DIFFICULTY_LEVEL,
    paperSuitability:
      "P1",
    explicitFamily:
      "ABSTRACT_SOLVE",
  });

export const A8ContextConceptModule =
  makeA8Module({
    code: "A8.2",
    label:
      "Form and solve simultaneous equations from context",
    families: [
      "CONTEXT_FORM_AND_SOLVE",
    ],
    levels:
      [...A8_SUPPORTED_DIFFICULTY_LEVELS] as A8Level[],
    defaultLevel:
      A8_DEFAULT_DIFFICULTY_LEVEL,
    paperSuitability:
      "BOTH",
    explicitFamily:
      "CONTEXT_FORM_AND_SOLVE",
  });

export const A8GraphConceptModule =
  makeA8Module({
    code: "A8.3",
    label:
      "Find the point of intersection algebraically",
    families: [
      "GRAPH_INTERSECTION_SOLVE",
    ],
    levels: [3],
    defaultLevel: 3,
    paperSuitability:
      "P1",
    explicitFamily:
      "GRAPH_INTERSECTION_SOLVE",
  });

export const A8DerivedConceptModule =
  makeA8Module({
    code: "A8.4",
    label:
      "Solve then calculate a further quantity",
    families: [
      "CONTEXT_DERIVED_TOTAL",
    ],
    levels: [3],
    defaultLevel: 3,
    paperSuitability:
      "P2",
    explicitFamily:
      "CONTEXT_DERIVED_TOTAL",
  });
