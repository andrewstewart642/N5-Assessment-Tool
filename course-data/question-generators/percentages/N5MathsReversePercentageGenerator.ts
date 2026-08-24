import {
  N5_MATHS_SOURCE_QUESTION_CATALOG,
} from "@/course-data/source-question-catalog/N5MathsSourceQuestionCatalog";

export type ReversePercentagePaper =
  | "P1"
  | "P2";

export type ReversePercentageDifficulty =
  | 1
  | 2
  | 3;

export type ReversePercentageFamilyId =
  | "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE"
  | "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE"
  | "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE"
  | "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE";

type QuantityType =
  | "MONEY"
  | "COUNT";

type GeneratedNumbers = {
  percentage: number;
  retainedPercentage: number;
  multiplier: number;

  originalValue: number;
  knownValue: number;
  requestedAnswer: number;

  changeAmount?: number;

  quantityType: QuantityType;
};

type WordingResult = {
  text: string;
  patternId: string;
  contextId: string;
};

export type GeneratedReversePercentageQuestion = {
  id: string;

  familyId: ReversePercentageFamilyId;
  paper: ReversePercentagePaper;
  difficulty: ReversePercentageDifficulty;

  questionText: string;
  answerText: string;
  workingSummary: string;

  marks: 3;

  wordingProfile: {
    patternId: string;
    contextId: string;
  };

  numericProfile: {
    percentage: number;
    retainedPercentage: number;
    multiplier: number;

    originalValue: number;
    knownValue: number;
    requestedAnswer: number;

    changeAmount?: number;

    quantityType: QuantityType;
    nonCalculatorFriendly: boolean;
  };

  sourceEvidence: {
    sourceCountForFamilyAndPaper: number;
    sourceQuestionIds: string[];
    longestSharedSourcePhraseWords: number;
  };

  answerSpaceRecommendation: {
    category:
      | "SMALL"
      | "MEDIUM"
      | "LARGE"
      | "FULL_PAGE";

    estimatedLines: number;
    evidenceMedianMm: number;
  };
};

export type ReversePercentageGeneratorOptions = {
  paper: ReversePercentagePaper;

  difficulty?: ReversePercentageDifficulty;

  familyId?: ReversePercentageFamilyId;
};

const NAMES = [
  "Aisha",
  "Calum",
  "Eilidh",
  "Fraser",
  "Harris",
  "Iona",
  "Lewis",
  "Maya",
  "Niamh",
  "Owen",
  "Priya",
  "Ruaridh",
  "Sofia",
  "Yasmin",
  "Zoe",
] as const;

const RETAIL_ITEMS = [
  {
    id: "CAMERA",
    phrase: "a camera",
  },
  {
    id: "BICYCLE",
    phrase: "a bicycle",
  },
  {
    id: "TABLET",
    phrase: "a tablet",
  },
  {
    id: "SOFA",
    phrase: "a sofa",
  },
  {
    id: "WINTER_COAT",
    phrase: "a winter coat",
  },
  {
    id: "GUITAR",
    phrase: "a guitar",
  },
  {
    id: "WATCH",
    phrase: "a watch",
  },
  {
    id: "DESK",
    phrase: "a desk",
  },
  {
    id: "SUITCASE",
    phrase: "a suitcase",
  },
  {
    id: "COFFEE_MACHINE",
    phrase: "a coffee machine",
  },
] as const;

const STANDARD_RATE_CONTEXTS = [
  {
    id: "HOTEL_ROOM",
    phrase: "a hotel room",
  },
  {
    id: "EQUIPMENT_HIRE",
    phrase: "equipment hire",
  },
  {
    id: "VENUE_HIRE",
    phrase: "venue hire",
  },
  {
    id: "TRAINING_COURSE",
    phrase: "a training course",
  },
  {
    id: "ANNUAL_MEMBERSHIP",
    phrase: "an annual membership",
  },
] as const;

const RECURRING_COSTS = [
  {
    id: "GYM_MEMBERSHIP",
    phrase: "an annual gym membership",
  },
  {
    id: "PARKING_PERMIT",
    phrase: "a parking permit",
  },
  {
    id: "TRAIN_PASS",
    phrase: "a monthly train pass",
  },
  {
    id: "STORAGE_FEE",
    phrase: "a storage fee",
  },
  {
    id: "CLUB_MEMBERSHIP",
    phrase: "a club membership",
  },
  {
    id: "SERVICE_PLAN",
    phrase: "a service plan",
  },
  {
    id: "MAINTENANCE_CONTRACT",
    phrase: "a maintenance contract",
  },
  {
    id: "FERRY_PASS",
    phrase: "a ferry pass",
  },
] as const;

const APPRECIATING_ASSETS = [
  {
    id: "PAINTING",
    phrase: "a painting",
  },
  {
    id: "VINTAGE_WATCH",
    phrase: "a vintage watch",
  },
  {
    id: "MOTORBIKE",
    phrase: "a motorbike",
  },
  {
    id: "MUSICAL_INSTRUMENT",
    phrase: "a musical instrument",
  },
  {
    id: "COLLECTIBLE",
    phrase: "a collectible",
  },
  {
    id: "SCULPTURE",
    phrase: "a sculpture",
  },
  {
    id: "CAMERA_LENS",
    phrase: "a camera lens",
  },
  {
    id: "ANTIQUE_DESK",
    phrase: "an antique desk",
  },
] as const;

const COUNT_INCREASE_CONTEXTS = [
  {
    id: "VISITOR_ATTRACTION",
    subject: "A visitor attraction",
    noun: "visitors",
  },
  {
    id: "SPORTS_CLUB",
    subject: "A sports club",
    noun: "members",
  },
  {
    id: "FACTORY_OUTPUT",
    subject: "A factory",
    noun: "units",
  },
  {
    id: "CHARITY_EVENT",
    subject: "A charity event",
    noun: "entries",
  },
  {
    id: "MUSEUM",
    subject: "A museum",
    noun: "visitors",
  },
  {
    id: "ONLINE_RETAILER",
    subject: "An online retailer",
    noun: "orders",
  },
] as const;

function chooseOne<T>(
  items: readonly T[]
): T {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ];
}

function randomInt(
  min: number,
  max: number
): number {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomMultiple(
  min: number,
  max: number,
  multiple: number
): number {
  const first =
    Math.ceil(min / multiple);

  const last =
    Math.floor(max / multiple);

  return (
    randomInt(first, last) *
    multiple
  );
}

function gcd(
  a: number,
  b: number
): number {
  let x =
    Math.abs(Math.round(a));

  let y =
    Math.abs(Math.round(b));

  while (y !== 0) {
    const next = x % y;

    x = y;
    y = next;
  }

  return x || 1;
}

function roundMoney(
  value: number
): number {
  return (
    Math.round(
      (value + Number.EPSILON) *
        100
    ) / 100
  );
}

function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-GB",
    {
      maximumFractionDigits: 2,
    }
  ).format(value);
}

function formatMoney(
  value: number
): string {
  return `£${new Intl.NumberFormat(
    "en-GB",
    {
      minimumFractionDigits:
        Number.isInteger(value)
          ? 0
          : 2,

      maximumFractionDigits: 2,
    }
  ).format(value)}`;
}

function formatAnswer(
  numbers: GeneratedNumbers
): string {
  if (
    numbers.quantityType ===
    "MONEY"
  ) {
    return formatMoney(
      numbers.requestedAnswer
    );
  }

  return formatNumber(
    numbers.requestedAnswer
  );
}

/**
 * SQA-style presentation:
 * each meaningful stage of the question is placed on a new line.
 */
function sqaLines(
  ...lines: string[]
): string {
  return lines.join("\n");
}

function sourceQuestions(
  familyId:
    ReversePercentageFamilyId,

  paper:
    ReversePercentagePaper
) {
  return (
    N5_MATHS_SOURCE_QUESTION_CATALOG
      .filter(
        (question) =>
          question.familyId ===
            familyId &&
          question.paper === paper
      )
  );
}

function sourceWeight(
  familyId:
    ReversePercentageFamilyId,

  paper:
    ReversePercentagePaper
): number {
  return sourceQuestions(
    familyId,
    paper
  ).length;
}

function pickWeighted<T>(
  items: {
    value: T;
    weight: number;
  }[]
): T {
  const valid =
    items.filter(
      (item) =>
        item.weight > 0
    );

  if (valid.length === 0) {
    return items[0].value;
  }

  const total =
    valid.reduce(
      (sum, item) =>
        sum + item.weight,
      0
    );

  let roll =
    Math.random() * total;

  for (
    const item of valid
  ) {
    roll -= item.weight;

    if (roll <= 0) {
      return item.value;
    }
  }

  return valid[
    valid.length - 1
  ].value;
}

function pickFamily(
  paper:
    ReversePercentagePaper,

  difficulty:
    ReversePercentageDifficulty
): ReversePercentageFamilyId {
  if (paper === "P1") {
    return pickWeighted([
      {
        value:
          "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",

        weight:
          Math.max(
            1,
            sourceWeight(
              "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
              "P1"
            )
          ),
      },

      {
        value:
          "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",

        weight:
          Math.max(
            1,
            sourceWeight(
              "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
              "P1"
            )
          ),
      },
    ]);
  }

  return pickWeighted([
    {
      value:
        "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",

      weight:
        Math.max(
          2,
          sourceWeight(
            "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE",
            "P2"
          )
        ),
    },

    {
      value:
        "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",

      weight:
        Math.max(
          1,
          sourceWeight(
            "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE",
            "P2"
          )
        ),
    },

    {
      value:
        "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",

      weight:
        Math.max(
          1,
          sourceWeight(
            "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE",
            "P2"
          )
        ),
    },

    {
      value:
        "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE",

      weight:
        difficulty === 1
          ? 0
          : Math.max(
              1,
              sourceWeight(
                "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE",
                "P2"
              )
            ) *
            (
              difficulty === 3
                ? 2
                : 1
            ),
    },
  ]);
}

function isFamilySupportedForGeneration(args: {
  familyId:
    ReversePercentageFamilyId;

  paper:
    ReversePercentagePaper;

  difficulty:
    ReversePercentageDifficulty;
}): boolean {
  const {
    familyId,
    paper,
    difficulty,
  } = args;

  if (
    paper === "P1"
  ) {
    return (
      familyId ===
        "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE" ||
      familyId ===
        "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE"
    );
  }

  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE"
  ) {
    return (
      difficulty !== 1
    );
  }

  return true;
}

function p1DecreasePercentages(
  difficulty:
    ReversePercentageDifficulty
): number[] {
  if (difficulty === 1) {
    return [
      10,
      20,
      25,
      50,
    ];
  }

  if (difficulty === 2) {
    return [
      20,
      25,
      30,
      40,
    ];
  }

  return [
    15,
    20,
    30,
    35,
    40,
  ];
}

function p1PartWholePercentages(
  difficulty:
    ReversePercentageDifficulty
): number[] {
  if (difficulty === 1) {
    return [
      50,
      75,
      80,
    ];
  }

  if (difficulty === 2) {
    return [
      60,
      75,
      80,
      90,
    ];
  }

  return [
    60,
    70,
    75,
    80,
    90,
  ];
}

function p2DirectPercentages(
  difficulty:
    ReversePercentageDifficulty
): number[] {
  if (difficulty === 1) {
    return [
      10,
      15,
      20,
      25,
    ];
  }

  if (difficulty === 2) {
    return [
      6,
      8,
      12,
      15,
      16,
      18,
    ];
  }

  return [
    7,
    11,
    13,
    17,
    19,
    22,
    27,
  ];
}

function p2PartWholePercentages(
  difficulty:
    ReversePercentageDifficulty
): number[] {
  if (difficulty === 1) {
    return [
      60,
      70,
      75,
      80,
    ];
  }

  if (difficulty === 2) {
    return [
      65,
      72,
      82,
      85,
      88,
    ];
  }

  return [
    62,
    68,
    78,
    82,
    85,
    92,
  ];
}

function generateDecreaseNumbers(
  paper:
    ReversePercentagePaper,

  difficulty:
    ReversePercentageDifficulty
): GeneratedNumbers {
  const percentage =
    paper === "P1"
      ? chooseOne(
          p1DecreasePercentages(
            difficulty
          )
        )
      : chooseOne(
          p2DirectPercentages(
            difficulty
          )
        );

  const retainedPercentage =
    100 - percentage;

  const multiplier =
    retainedPercentage / 100;

  const requiredMultiple =
    100 /
    gcd(
      retainedPercentage,
      100
    );

  const originalValue =
    paper === "P1"
      ? randomMultiple(
          40,
          1200,
          requiredMultiple * 5
        )
      : randomMultiple(
          80,
          2400,
          5
        );

  const knownValue =
    roundMoney(
      originalValue *
        multiplier
    );

  return {
    percentage,

    retainedPercentage,

    multiplier,

    originalValue,

    knownValue,

    requestedAnswer:
      originalValue,

    quantityType:
      "MONEY",
  };
}

function generateIncreaseNumbers(
  difficulty:
    ReversePercentageDifficulty,

  quantityType:
    QuantityType
): GeneratedNumbers {
  const percentage =
    chooseOne(
      p2DirectPercentages(
        difficulty
      )
    );

  const retainedPercentage =
    100 + percentage;

  const multiplier =
    retainedPercentage / 100;

  if (
    quantityType === "COUNT"
  ) {
    const requiredMultiple =
      100 /
      gcd(
        retainedPercentage,
        100
      );

    const originalValue =
      randomMultiple(
        600,

        difficulty === 3
          ? 20000
          : 12000,

        requiredMultiple * 10
      );

    const knownValue =
      (
        originalValue *
        retainedPercentage
      ) / 100;

    return {
      percentage,

      retainedPercentage,

      multiplier,

      originalValue,

      knownValue,

      requestedAnswer:
        originalValue,

      quantityType,
    };
  }

  const originalValue =
    randomMultiple(
      100,

      difficulty === 3
        ? 5000
        : 2500,

      5
    );

  const knownValue =
    roundMoney(
      originalValue *
        multiplier
    );

  return {
    percentage,

    retainedPercentage,

    multiplier,

    originalValue,

    knownValue,

    requestedAnswer:
      originalValue,

    quantityType,
  };
}

function generatePartWholeNumbers(
  paper:
    ReversePercentagePaper,

  difficulty:
    ReversePercentageDifficulty
): GeneratedNumbers {
  const percentage =
    paper === "P1"
      ? chooseOne(
          p1PartWholePercentages(
            difficulty
          )
        )
      : chooseOne(
          p2PartWholePercentages(
            difficulty
          )
        );

  const requiredMultiple =
    100 /
    gcd(
      percentage,
      100
    );

  const originalValue =
    randomMultiple(
      paper === "P1"
        ? 600
        : 1000,

      paper === "P1"
        ? 15000
        : 30000,

      requiredMultiple * 10
    );

  const knownValue =
    (
      originalValue *
      percentage
    ) / 100;

  return {
    percentage,

    retainedPercentage:
      percentage,

    multiplier:
      percentage / 100,

    originalValue,

    knownValue,

    requestedAnswer:
      originalValue,

    quantityType:
      "COUNT",
  };
}

function generateDifferenceNumbers(
  difficulty:
    ReversePercentageDifficulty
): GeneratedNumbers {
  const percentage =
    chooseOne(
      difficulty === 3
        ? [
            2.5,
            5,
            7.5,
            12.5,
            15,
          ]
        : [
            5,
            10,
            12.5,
            15,
          ]
    );

  const retainedPercentage =
    100 + percentage;

  const multiplier =
    retainedPercentage / 100;

  const originalValue =
    randomMultiple(
      120,
      2400,
      40
    );

  const changeAmount =
    roundMoney(
      originalValue *
        (
          percentage / 100
        )
    );

  const knownValue =
    roundMoney(
      originalValue +
        changeAmount
    );

  return {
    percentage,

    retainedPercentage,

    multiplier,

    originalValue,

    knownValue,

    requestedAnswer:
      changeAmount,

    changeAmount,

    quantityType:
      "MONEY",
  };
}

function buildDecreaseQuestion(
  numbers:
    GeneratedNumbers
): WordingResult {
  const name =
    chooseOne(NAMES);

  const item =
    chooseOne(
      RETAIL_ITEMS
    );

  const standardRate =
    chooseOne(
      STANDARD_RATE_CONTEXTS
    );

  const patterns: Array<{
    id: string;
    contextId: string;
    build: () => string;
  }> = [
    {
      id:
        "DECREASE_RETAIL_01",

      contextId:
        item.id,

      build: () =>
        sqaLines(
          `The price of ${item.phrase} is reduced by ${numbers.percentage}% in a sale.`,
          `The sale price is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the price before the sale.`
        ),
    },

    {
      id:
        "DECREASE_RETAIL_02",

      contextId:
        item.id,

      build: () =>
        sqaLines(
          `${name} buys ${item.phrase} during a sale.`,
          `${name} receives a ${numbers.percentage}% discount and pays ${formatMoney(numbers.knownValue)}.`,
          `Calculate the price before the discount.`
        ),
    },

    {
      id:
        "DECREASE_RETAIL_03",

      contextId:
        item.id,

      build: () =>
        sqaLines(
          `A shop gives a ${numbers.percentage}% discount on ${item.phrase}.`,
          `After the discount, it costs ${formatMoney(numbers.knownValue)}.`,
          `Calculate the marked price.`
        ),
    },

    {
      id:
        "DECREASE_RETAIL_04",

      contextId:
        item.id,

      build: () =>
        sqaLines(
          `${item.phrase.charAt(0).toUpperCase()}${item.phrase.slice(1)} is reduced in price by ${numbers.percentage}%.`,
          `It now costs ${formatMoney(numbers.knownValue)}.`,
          `Calculate the price before the reduction.`
        ),
    },

    {
      id:
        "DECREASE_RATE_01",

      contextId:
        standardRate.id,

      build: () =>
        sqaLines(
          `A special offer reduces the cost of ${standardRate.phrase} by ${numbers.percentage}%.`,
          `The reduced cost is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the usual cost.`
        ),
    },

    {
      id:
        "DECREASE_RATE_02",

      contextId:
        standardRate.id,

      build: () =>
        sqaLines(
          `During a promotion, the cost of ${standardRate.phrase} is reduced by ${numbers.percentage}%.`,
          `The promotional cost is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the cost before the promotion.`
        ),
    },

    {
      id:
        "DECREASE_RATE_03",

      contextId:
        standardRate.id,

      build: () =>
        sqaLines(
          `A ${numbers.percentage}% discount is applied to the cost of ${standardRate.phrase}.`,
          `The discounted cost is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the cost without the discount.`
        ),
    },
  ];

  const chosen =
    chooseOne(patterns);

  return {
    text:
      chosen.build(),

    patternId:
      chosen.id,

    contextId:
      chosen.contextId,
  };
}

function buildPartWholeQuestion(
  numbers:
    GeneratedNumbers
): WordingResult {
  const patterns: Array<{
    id: string;
    contextId: string;
    build: () => string;
  }> = [
    {
      id:
        "PART_WHOLE_TICKETS",

      contextId:
        "FESTIVAL_TICKETS",

      build: () =>
        sqaLines(
          `A festival has sold ${formatNumber(numbers.knownValue)} tickets in advance.`,
          `This is ${numbers.percentage}% of the tickets available.`,
          `Calculate the total number of tickets available.`
        ),
    },

    {
      id:
        "PART_WHOLE_MEMBERSHIP",

      contextId:
        "MEMBERS_RENEWED",

      build: () =>
        sqaLines(
          `${formatNumber(numbers.knownValue)} members of a sports club have renewed their membership.`,
          `This represents ${numbers.percentage}% of the club's members.`,
          `Calculate the total number of members.`
        ),
    },

    {
      id:
        "PART_WHOLE_SCHOOL",

      contextId:
        "SCHOOL_FORMS",

      build: () =>
        sqaLines(
          `A school has received completed forms from ${formatNumber(numbers.knownValue)} pupils.`,
          `This is ${numbers.percentage}% of the pupils in the school.`,
          `Calculate the total number of pupils.`
        ),
    },

    {
      id:
        "PART_WHOLE_WAREHOUSE",

      contextId:
        "WAREHOUSE_ORDERS",

      build: () =>
        sqaLines(
          `A warehouse has packed ${formatNumber(numbers.knownValue)} orders.`,
          `This is ${numbers.percentage}% of the orders due to be packed that day.`,
          `Calculate the total number of orders.`
        ),
    },

    {
      id:
        "PART_WHOLE_EVENT",

      contextId:
        "EVENT_FINISHERS",

      build: () =>
        sqaLines(
          `${formatNumber(numbers.knownValue)} people completed a charity event.`,
          `This was ${numbers.percentage}% of the number who started the event.`,
          `Calculate the number of people who started.`
        ),
    },

    {
      id:
        "PART_WHOLE_VISITORS",

      contextId:
        "VISITOR_COMPARISON",

      build: () =>
        sqaLines(
          `A visitor centre recorded ${formatNumber(numbers.knownValue)} visitors in April.`,
          `This was ${numbers.percentage}% of the number recorded in May.`,
          `Calculate the number of visitors recorded in May.`
        ),
    },

    {
      id:
        "PART_WHOLE_BRANCH_SALES",

      contextId:
        "BRANCH_SALES",

      build: () =>
        sqaLines(
          `One branch of a company sold ${formatNumber(numbers.knownValue)} items during a promotion.`,
          `This was ${numbers.percentage}% of the number sold by another branch.`,
          `Calculate the number sold by the other branch.`
        ),
    },

    {
      id:
        "PART_WHOLE_REGISTRATIONS",

      contextId:
        "COURSE_REGISTRATIONS",

      build: () =>
        sqaLines(
          `${formatNumber(numbers.knownValue)} people have registered for a training programme.`,
          `This represents ${numbers.percentage}% of the available places.`,
          `Calculate the total number of places.`
        ),
    },

    {
      id:
        "PART_WHOLE_CONCERT",

      contextId:
        "CONCERT_TICKETS",

      build: () =>
        sqaLines(
          `A concert venue has sold ${formatNumber(numbers.knownValue)} tickets.`,
          `This is ${numbers.percentage}% of the venue's capacity.`,
          `Calculate the capacity of the venue.`
        ),
    },

    {
      id:
        "PART_WHOLE_SURVEY",

      contextId:
        "SURVEY_RESPONSES",

      build: () =>
        sqaLines(
          `${formatNumber(numbers.knownValue)} people responded to a survey.`,
          `This was ${numbers.percentage}% of the people invited to take part.`,
          `Calculate the number of people invited.`
        ),
    },
  ];

  const chosen =
    chooseOne(patterns);

  return {
    text:
      chosen.build(),

    patternId:
      chosen.id,

    contextId:
      chosen.contextId,
  };
}

function buildIncreaseQuestion(
  numbers:
    GeneratedNumbers
): WordingResult {
  const name =
    chooseOne(NAMES);

  if (
    numbers.quantityType ===
    "COUNT"
  ) {
    const context =
      chooseOne(
        COUNT_INCREASE_CONTEXTS
      );

    const patterns = [
      {
        id:
          "INCREASE_COUNT_01",

        build: () =>
          sqaLines(
            `${context.subject} recorded ${formatNumber(numbers.knownValue)} ${context.noun} this year.`,
            `This was ${numbers.percentage}% more than last year.`,
            `Calculate the number recorded last year.`
          ),
      },

      {
        id:
          "INCREASE_COUNT_02",

        build: () =>
          sqaLines(
            `The number of ${context.noun} recorded by ${context.subject.toLowerCase()} increased by ${numbers.percentage}%.`,
            `The number is now ${formatNumber(numbers.knownValue)}.`,
            `Calculate the number before the increase.`
          ),
      },

      {
        id:
          "INCREASE_COUNT_03",

        build: () =>
          sqaLines(
            `${context.subject} recorded ${formatNumber(numbers.knownValue)} ${context.noun} this year.`,
            `This is an increase of ${numbers.percentage}% on the previous year's figure.`,
            `Calculate the previous year's figure.`
          ),
      },
    ];

    const chosen =
      chooseOne(patterns);

    return {
      text:
        chosen.build(),

      patternId:
        chosen.id,

      contextId:
        context.id,
    };
  }

  if (
    Math.random() < 0.42
  ) {
    const asset =
      chooseOne(
        APPRECIATING_ASSETS
      );

    const patterns = [
      {
        id:
          "INCREASE_ASSET_01",

        build: () =>
          sqaLines(
            `${name} bought ${asset.phrase} last year.`,
            `Its value has increased by ${numbers.percentage}% and it is now worth ${formatMoney(numbers.knownValue)}.`,
            `Calculate how much ${name} paid for it.`
          ),
      },

      {
        id:
          "INCREASE_ASSET_02",

        build: () =>
          sqaLines(
            `${asset.phrase.charAt(0).toUpperCase()}${asset.phrase.slice(1)} has increased in value by ${numbers.percentage}%.`,
            `It is now valued at ${formatMoney(numbers.knownValue)}.`,
            `Calculate its value before the increase.`
          ),
      },

      {
        id:
          "INCREASE_ASSET_03",

        build: () =>
          sqaLines(
            `The value of ${asset.phrase} has risen by ${numbers.percentage}%.`,
            `It is now worth ${formatMoney(numbers.knownValue)}.`,
            `Calculate its value before the rise.`
          ),
      },
    ];

    const chosen =
      chooseOne(patterns);

    return {
      text:
        chosen.build(),

      patternId:
        chosen.id,

      contextId:
        asset.id,
    };
  }

  const cost =
    chooseOne(
      RECURRING_COSTS
    );

  const patterns = [
    {
      id:
        "INCREASE_COST_01",

      build: () =>
        sqaLines(
          `The cost of ${cost.phrase} has increased by ${numbers.percentage}%.`,
          `The new cost is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the cost before the increase.`
        ),
    },

    {
      id:
        "INCREASE_COST_02",

      build: () =>
        sqaLines(
          `${name} now pays ${formatMoney(numbers.knownValue)} for ${cost.phrase}.`,
          `This is ${numbers.percentage}% more than the previous cost.`,
          `Calculate the previous cost.`
        ),
    },

    {
      id:
        "INCREASE_COST_03",

      build: () =>
        sqaLines(
          `This year's cost of ${cost.phrase} is ${formatMoney(numbers.knownValue)}.`,
          `This is ${numbers.percentage}% higher than the cost last year.`,
          `Calculate last year's cost.`
        ),
    },

    {
      id:
        "INCREASE_COST_04",

      build: () =>
        sqaLines(
          `The cost of ${cost.phrase} increased by ${numbers.percentage}%.`,
          `Following the increase, the cost is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the cost before the increase.`
        ),
    },
  ];

  const chosen =
    chooseOne(patterns);

  return {
    text:
      chosen.build(),

    patternId:
      chosen.id,

    contextId:
      cost.id,
  };
}

function buildDifferenceQuestion(
  numbers:
    GeneratedNumbers
): WordingResult {
  const name =
    chooseOne(NAMES);

  const patterns: Array<{
    id: string;
    contextId: string;
    build: () => string;
  }> = [
    {
      id:
        "DIFFERENCE_BOOKING",

      contextId:
        "BOOKING_SURCHARGE",

      build: () =>
        sqaLines(
          `${name} pays ${formatMoney(numbers.knownValue)} for a booking.`,
          `This includes an additional charge of ${numbers.percentage}%.`,
          `Calculate how much less the booking would have cost without the additional charge.`
        ),
    },

    {
      id:
        "DIFFERENCE_WEEKEND_HIRE",

      contextId:
        "WEEKEND_HIRE",

      build: () =>
        sqaLines(
          `Weekend equipment hire costs ${formatMoney(numbers.knownValue)}.`,
          `This includes a surcharge of ${numbers.percentage}% on the normal hire charge.`,
          `Calculate the amount of the surcharge.`
        ),
    },

    {
      id:
        "DIFFERENCE_LATE_RETURN",

      contextId:
        "LATE_RETURN",

      build: () =>
        sqaLines(
          `${name} returns some hired equipment late.`,
          `${name} pays ${formatMoney(numbers.knownValue)}, including an extra charge of ${numbers.percentage}%.`,
          `Calculate the value of the extra charge.`
        ),
    },

    {
      id:
        "DIFFERENCE_PRIORITY_SERVICE",

      contextId:
        "PRIORITY_SERVICE",

      build: () =>
        sqaLines(
          `A priority service costs ${formatMoney(numbers.knownValue)}.`,
          `This includes a surcharge of ${numbers.percentage}% on the standard service.`,
          `Calculate how much would be saved by using the standard service.`
        ),
    },

    {
      id:
        "DIFFERENCE_PROCESSING_FEE",

      contextId:
        "PROCESSING_FEE",

      build: () =>
        sqaLines(
          `A payment of ${formatMoney(numbers.knownValue)} includes an additional processing charge of ${numbers.percentage}%.`,
          `Calculate the amount of the processing charge.`
        ),
    },

    {
      id:
        "DIFFERENCE_LATE_PAYMENT",

      contextId:
        "LATE_PAYMENT",

      build: () =>
        sqaLines(
          `${name} pays a bill after a ${numbers.percentage}% late-payment charge is added.`,
          `The total paid is ${formatMoney(numbers.knownValue)}.`,
          `Calculate the amount of the late-payment charge.`
        ),
    },
  ];

  const chosen =
    chooseOne(patterns);

  return {
    text:
      chosen.build(),

    patternId:
      chosen.id,

    contextId:
      chosen.contextId,
  };
}

function normalisedWords(
  text: string
): string[] {
  return text
    .toLowerCase()

    .replace(
      /[£,%.'’!?():;/-]/g,
      " "
    )

    .replace(
      /\s+/g,
      " "
    )

    .trim()

    .split(" ")

    .filter(Boolean);
}

function longestSharedPhraseLength(
  generatedText: string,

  sourceText: string
): number {
  const generatedWords =
    normalisedWords(
      generatedText
    );

  const sourceWords =
    normalisedWords(
      sourceText
    );

  const maxPossible =
    Math.min(
      generatedWords.length,
      sourceWords.length,
      14
    );

  for (
    let size = maxPossible;
    size >= 1;
    size -= 1
  ) {
    const sourcePhrases =
      new Set<string>();

    for (
      let i = 0;
      i <=
      sourceWords.length -
        size;
      i += 1
    ) {
      sourcePhrases.add(
        sourceWords
          .slice(
            i,
            i + size
          )
          .join(" ")
      );
    }

    for (
      let i = 0;
      i <=
      generatedWords.length -
        size;
      i += 1
    ) {
      const phrase =
        generatedWords
          .slice(
            i,
            i + size
          )
          .join(" ");

      if (
        sourcePhrases.has(
          phrase
        )
      ) {
        return size;
      }
    }
  }

  return 0;
}

function longestSharedSourcePhrase(
  questionText: string
): number {
  let longest = 0;

  for (
    const source of
    N5_MATHS_SOURCE_QUESTION_CATALOG
  ) {
    if (
      !source.sourcePromptText
    ) {
      continue;
    }

    longest =
      Math.max(
        longest,

        longestSharedPhraseLength(
          questionText,
          source.sourcePromptText
        )
      );
  }

  return longest;
}

function median(
  values: number[]
): number {
  if (
    values.length === 0
  ) {
    return 90;
  }

  const sorted =
    [...values].sort(
      (a, b) => a - b
    );

  const middle =
    Math.floor(
      sorted.length / 2
    );

  if (
    sorted.length % 2 === 1
  ) {
    return sorted[middle];
  }

  return (
    (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2
  );
}

function answerSpaceRecommendation(
  familyId:
    ReversePercentageFamilyId,

  paper:
    ReversePercentagePaper
):
  GeneratedReversePercentageQuestion["answerSpaceRecommendation"] {
  const measurements =
    sourceQuestions(
      familyId,
      paper
    )
      .map(
        (question) =>
          question
            .answerSpace
            .sourceMeasurement
            ?.heightMm
      )

      .filter(
        (
          value
        ): value is number =>
          typeof value ===
          "number"
      );

  const evidenceMedianMm =
    Math.round(
      median(measurements) *
        10
    ) / 10;

  const category =
    evidenceMedianMm >= 150
      ? "FULL_PAGE"
      : evidenceMedianMm >= 85
        ? "LARGE"
        : evidenceMedianMm >= 55
          ? "MEDIUM"
          : "SMALL";

  return {
    category,

    estimatedLines:
      Math.max(
        4,
        Math.round(
          evidenceMedianMm / 14
        )
      ),

    evidenceMedianMm,
  };
}

function buildWorkingSummary(
  familyId:
    ReversePercentageFamilyId,

  numbers:
    GeneratedNumbers
): string {
  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_PART_OF_WHOLE"
  ) {
    return `${numbers.percentage}% corresponds to ${formatNumber(numbers.knownValue)}. Divide by ${numbers.multiplier} to find 100%, giving ${formatNumber(numbers.originalValue)}.`;
  }

  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE"
  ) {
    return `After a ${numbers.percentage}% decrease, ${numbers.retainedPercentage}% remains. Divide ${formatMoney(numbers.knownValue)} by ${numbers.multiplier} to find the original value ${formatMoney(numbers.originalValue)}.`;
  }

  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE"
  ) {
    return `The final amount is ${numbers.retainedPercentage}% of the original. Divide ${formatMoney(numbers.knownValue)} by ${numbers.multiplier} to find ${formatMoney(numbers.originalValue)}, then subtract to find ${formatMoney(numbers.changeAmount ?? 0)}.`;
  }

  return `After a ${numbers.percentage}% increase, the final value is ${numbers.retainedPercentage}% of the original. Divide the final value by ${numbers.multiplier} to recover the original value.`;
}

function generateCandidate(
  familyId:
    ReversePercentageFamilyId,

  paper:
    ReversePercentagePaper,

  difficulty:
    ReversePercentageDifficulty
): {
  numbers:
    GeneratedNumbers;

  wording:
    WordingResult;
} {
  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_DECREASE_GIVEN_FINAL_VALUE"
  ) {
    const numbers =
      generateDecreaseNumbers(
        paper,
        difficulty
      );

    return {
      numbers,

      wording:
        buildDecreaseQuestion(
          numbers
        ),
    };
  }

  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_GIVEN_FINAL_VALUE"
  ) {
    const quantityType:
      QuantityType =
        Math.random() < 0.34
          ? "COUNT"
          : "MONEY";

    const numbers =
      generateIncreaseNumbers(
        difficulty,
        quantityType
      );

    return {
      numbers,

      wording:
        buildIncreaseQuestion(
          numbers
        ),
    };
  }

  if (
    familyId ===
    "NUM_REVERSE_PERCENTAGE_INCREASE_FIND_DIFFERENCE"
  ) {
    const numbers =
      generateDifferenceNumbers(
        difficulty
      );

    return {
      numbers,

      wording:
        buildDifferenceQuestion(
          numbers
        ),
    };
  }

  const numbers =
    generatePartWholeNumbers(
      paper,
      difficulty
    );

  return {
    numbers,

    wording:
      buildPartWholeQuestion(
        numbers
      ),
  };
}

export function generateN5MathsReversePercentageQuestion(
  options:
    ReversePercentageGeneratorOptions
):
  GeneratedReversePercentageQuestion {
  const difficulty =
    options.difficulty ?? 2;


  if (
    options.familyId &&
    !isFamilySupportedForGeneration({
      familyId:
        options.familyId,

      paper:
        options.paper,

      difficulty,
    })
  ) {
    throw new Error(
      [
        "The requested reverse-percentage family is not supported",
        "for the requested paper and difficulty.",
        `Family: ${options.familyId}.`,
        `Paper: ${options.paper}.`,
        `Difficulty: ${difficulty}.`,
      ].join(" ")
    );
  }


  for (
    let attempt = 0;
    attempt < 250;
    attempt += 1
  ) {
    const familyId =
      options.familyId ??
      pickFamily(
        options.paper,
        difficulty
      );

    const candidate =
      generateCandidate(
        familyId,
        options.paper,
        difficulty
      );

    const sharedPhraseWords =
      longestSharedSourcePhrase(
        candidate.wording.text
      );

    /*
     * Prevent generated questions
     * from reproducing unusually
     * long verbatim phrases from
     * any catalogued source.
     */
    if (
      sharedPhraseWords >= 8
    ) {
      continue;
    }

    const sources =
      sourceQuestions(
        familyId,
        options.paper
      );

    return {
      id:
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      familyId,

      paper:
        options.paper,

      difficulty,

      questionText:
        candidate.wording.text,

      answerText:
        formatAnswer(
          candidate.numbers
        ),

      workingSummary:
        buildWorkingSummary(
          familyId,
          candidate.numbers
        ),

      marks: 3,

      wordingProfile: {
        patternId:
          candidate
            .wording
            .patternId,

        contextId:
          candidate
            .wording
            .contextId,
      },

      numericProfile: {
        percentage:
          candidate
            .numbers
            .percentage,

        retainedPercentage:
          candidate
            .numbers
            .retainedPercentage,

        multiplier:
          candidate
            .numbers
            .multiplier,

        originalValue:
          candidate
            .numbers
            .originalValue,

        knownValue:
          candidate
            .numbers
            .knownValue,

        requestedAnswer:
          candidate
            .numbers
            .requestedAnswer,

        changeAmount:
          candidate
            .numbers
            .changeAmount,

        quantityType:
          candidate
            .numbers
            .quantityType,

        nonCalculatorFriendly:
          options.paper ===
          "P1",
      },

      sourceEvidence: {
        sourceCountForFamilyAndPaper:
          sources.length,

        sourceQuestionIds:
          sources.map(
            (source) =>
              source.id
          ),

        longestSharedSourcePhraseWords:
          sharedPhraseWords,
      },

      answerSpaceRecommendation:
        answerSpaceRecommendation(
          familyId,
          options.paper
        ),
    };
  }

  throw new Error(
    "Could not generate a sufficiently distinct reverse-percentage question."
  );
}

export function generateN5MathsReversePercentageSamples(
  count: number,

  options:
    ReversePercentageGeneratorOptions
):
  GeneratedReversePercentageQuestion[] {
  return Array.from(
    {
      length: count,
    },

    () =>
      generateN5MathsReversePercentageQuestion(
        options
      )
  );
}