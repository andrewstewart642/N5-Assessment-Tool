import {
  N5_MATHS_EXAM_QUESTION_CATALOG,
} from "@/src/Courses/National5Maths/ExamQuestionAndAnswerCatalog/Questions/National5MathsExamQuestionCatalog";


export type CompoundPercentageFamilyId =
  | "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE"
  | "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE"
  | "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE";


export type CompoundPercentageDirection =
  | "INCREASE"
  | "DECREASE";


export type CompoundPercentageRateStructure =
  | "FIXED_RATE"
  | "MULTI_RATE";


export type CompoundPercentageDifficulty =
  | 1
  | 2
  | 3;


export type CompoundPercentageRoundingMode =
  | "NONE"
  | "NEAREST_INTEGER"
  | "NEAREST_TEN"
  | "NEAREST_THOUSAND";


export type CompoundPercentageValueKind =
  | "CURRENCY"
  | "COUNT"
  | "MEASUREMENT";


export type CompoundPercentageStage = {
  percentageValue: number;
  multiplier: number;
  periods: number;
};


export type CompoundPercentageNumericProfile = {
  kind:
    | "FIXED_RATE"
    | "MULTI_RATE";

  direction:
    CompoundPercentageDirection;

  stages:
    CompoundPercentageStage[];

  initialValue: number;
  totalPeriods: number;

  unroundedFinalValue: number;
  requestedAnswer: number;

  roundingMode:
    CompoundPercentageRoundingMode;

  roundingExplicitInPrompt: boolean;

  valueKind:
    CompoundPercentageValueKind;

  currencyDisplayDecimals?:
    | 0
    | 2;

  unit?: string;

  contextTemplateId: string;

  startYear?: number;
  targetYear?: number;
};


export type CompoundPercentageGeneratorOptions = {
  difficulty?:
    CompoundPercentageDifficulty;

  familyId?:
    CompoundPercentageFamilyId;

  direction?:
    CompoundPercentageDirection;

  rateStructure?:
    CompoundPercentageRateStructure;
};


export type GeneratedCompoundPercentageQuestion = {
  id: string;

  familyId:
    CompoundPercentageFamilyId;

  difficulty:
    CompoundPercentageDifficulty;

  questionText: string;
  answerText: string;
  workingSummary: string;

  numericProfile:
    CompoundPercentageNumericProfile;

  sourceEvidenceSummary: string;

  checks: {
    label: string;
    passed: boolean;
    detail: string;
  }[];

  metrics: {
    sourceFamilyEvidenceCount: number;
    sourceCorpusSize: number;

    totalPeriods: number;
    rateCount: number;

    minimumPercentageRate: number;
    maximumPercentageRate: number;

    initialValue: number;
    unroundedFinalValue: number;

    resultDecimalPlaces: number;

    contextTemplateId: string;
    contextPoolSize: number;

    decimalRateUsed: boolean;
    friendlyArithmetic: boolean;

    calculatorNatural: boolean;
  };
};


type RoundingPolicy =
  | "NONE"
  | "PENCE"
  | "NEAREST_POUND"
  | "NEAREST_THOUSAND_POUNDS"
  | "AUTO_COUNT";


type RateProfileId =
  | "PROPERTY_GROWTH"
  | "ASSET_GROWTH"
  | "BUSINESS_GROWTH"
  | "COUNT_GROWTH"
  | "OUTPUT_GROWTH"
  | "ASSET_DEPRECIATION"
  | "REDUCTION"
  | "COUNT_DECLINE"
  | "MEASUREMENT_REDUCTION";


type RateProfile = {
  friendly: number[];
  integer: number[];
  decimal: number[];
};


type ContextShell = {
  id: string;

  family:
    CompoundPercentageFamilyId;

  rateProfile:
    RateProfileId;

  valueKind:
    CompoundPercentageValueKind;

  minInitialValue: number;
  maxInitialValue: number;

  baseMultiple: number;

  roundingPolicy:
    RoundingPolicy;

  currencyDisplayDecimals?:
    | 0
    | 2;

  unit?: string;

  usesDates?: boolean;

  templates: string[];
};


type GeneratedScenario = {
  contextTemplateId: string;

  direction:
    CompoundPercentageDirection;

  stages:
    CompoundPercentageStage[];

  initialValue: number;

  roundingMode:
    CompoundPercentageRoundingMode;

  roundingExplicitInPrompt: boolean;

  valueKind:
    CompoundPercentageValueKind;

  currencyDisplayDecimals?:
    | 0
    | 2;

  unit?: string;

  startYear?: number;
  targetYear?: number;

  questionText: string;

  friendlyArithmetic: boolean;
};


const FAMILY_IDS:
  CompoundPercentageFamilyId[] = [
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",
    "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",
  ];


const MAX_RESULT_DECIMAL_PLACES =
  3;


const RATE_PROFILES:
  Record<
    RateProfileId,
    RateProfile
  > = {
    PROPERTY_GROWTH: {
      friendly: [
        5,
        10,
      ],

      integer: [
        3,
        4,
        5,
        6,
        8,
        10,
      ],

      decimal: [
        2.5,
        2.8,
        3.5,
        4.5,
        5.5,
        6.5,
        7.5,
      ],
    },

    ASSET_GROWTH: {
      friendly: [
        5,
        10,
        20,
      ],

      integer: [
        4,
        5,
        8,
        10,
        12,
        15,
      ],

      decimal: [
        4.5,
        5.5,
        6.5,
        7.5,
        9.5,
        11.5,
        14.5,
      ],
    },

    BUSINESS_GROWTH: {
      friendly: [
        5,
        10,
      ],

      integer: [
        3,
        4,
        5,
        6,
        8,
        10,
      ],

      decimal: [
        2.5,
        2.8,
        3.5,
        4.5,
        5.5,
        6.5,
        7.5,
      ],
    },

    COUNT_GROWTH: {
      friendly: [
        5,
        10,
        20,
        25,
      ],

      integer: [
        4,
        5,
        8,
        10,
        12,
        15,
        20,
      ],

      decimal: [
        2.5,
        3.5,
        4.5,
        6.5,
        8.5,
        12.5,
        17.5,
      ],
    },

    OUTPUT_GROWTH: {
      friendly: [
        5,
        10,
        20,
        25,
      ],

      integer: [
        4,
        5,
        8,
        10,
        12,
        15,
        20,
      ],

      decimal: [
        2.5,
        3.5,
        4.5,
        6.5,
        7.5,
        9.5,
        12.5,
      ],
    },

    ASSET_DEPRECIATION: {
      friendly: [
        10,
        20,
        25,
      ],

      integer: [
        8,
        10,
        12,
        15,
        20,
        25,
        26,
      ],

      decimal: [
        7.5,
        9.5,
        11.5,
        12.5,
        17.5,
        22.5,
        24.5,
      ],
    },

    REDUCTION: {
      friendly: [
        5,
        10,
        20,
        25,
      ],

      integer: [
        5,
        8,
        10,
        12,
        15,
        20,
        25,
      ],

      decimal: [
        4.5,
        6.5,
        7.5,
        9.5,
        11.5,
        12.5,
        17.5,
      ],
    },

    COUNT_DECLINE: {
      friendly: [
        5,
        10,
        20,
        25,
      ],

      integer: [
        4,
        5,
        8,
        10,
        12,
        15,
        20,
      ],

      decimal: [
        2.5,
        3.5,
        4.5,
        6.5,
        8.5,
        11.5,
        12.5,
      ],
    },

    MEASUREMENT_REDUCTION: {
      friendly: [
        5,
        10,
        20,
        25,
      ],

      integer: [
        5,
        8,
        10,
        12,
        15,
        20,
        25,
      ],

      decimal: [
        4.5,
        6.5,
        7.5,
        9.5,
        11.5,
        12.5,
        17.5,
      ],
    },
  };


/**
 * =========================================================
 * CONTEXT SHELLS
 * =========================================================
 *
 * 60+ distinct contextual shells.
 *
 * Each shell contains multiple wording templates, so the
 * practical surface pool is substantially larger before
 * numerical variation is considered.
 * =========================================================
 */

const CONTEXT_SHELLS:
  ContextShell[] = [
    /**
     * -----------------------------------------------------
     * FIXED-RATE APPRECIATION
     * -----------------------------------------------------
     */

    {
      id:
        "HOUSE_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "PROPERTY_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        80000,

      maxInitialValue:
        450000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A house is valued at {money}. Its value is predicted to rise by {rate}% each year. Calculate its predicted value after {years} years.{rounding}",

        "The current value of a house is {money}. Property prices in the area are expected to increase by {rate}% per annum. What will the house be worth after {years} years?{rounding}",

        "A house currently worth {money} is expected to appreciate by {rate}% each year. Calculate its value {years} years from now.{rounding}",
      ],
    },

    {
      id:
        "FLAT_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "PROPERTY_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        70000,

      maxInitialValue:
        350000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A flat is currently valued at {money}. Its value is forecast to increase by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "The value of a flat is {money}. It is expected to appreciate at a rate of {rate}% per year. Find its expected value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "FARMLAND_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "PROPERTY_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        100000,

      maxInitialValue:
        600000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_THOUSAND_POUNDS",

      currencyDisplayDecimals:
        0,

      templates: [
        "A parcel of farmland is valued at {money}. Its value is expected to rise by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "Farmland currently worth {money} is predicted to appreciate by {rate}% per annum. What will its value be after {years} years?{rounding}",
      ],
    },

    {
      id:
        "COMMERCIAL_PROPERTY_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "PROPERTY_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        150000,

      maxInitialValue:
        900000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_THOUSAND_POUNDS",

      currencyDisplayDecimals:
        0,

      templates: [
        "A commercial property is currently worth {money}. Its value is expected to increase by {rate}% each year. Calculate its value after {years} years.{rounding}",

        "The value of a small business unit is {money}. It is forecast to rise by {rate}% per annum. Calculate the expected value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "ANTIQUE_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "ASSET_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        800,

      maxInitialValue:
        12000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "An antique is valued at {money}. Its value is expected to increase by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "An antique currently worth {money} is predicted to appreciate by {rate}% per year. What will it be worth after {years} years?{rounding}",
      ],
    },

    {
      id:
        "ARTWORK_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "ASSET_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        1000,

      maxInitialValue:
        25000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A painting is valued at {money}. Its value is expected to rise by {rate}% each year. Calculate its value after {years} years.{rounding}",

        "A piece of artwork currently valued at {money} appreciates by {rate}% per year. Find its expected value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "CLASSIC_CAR_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "ASSET_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        5000,

      maxInitialValue:
        80000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A classic car is valued at {money}. Its value is expected to increase by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "A collector buys a classic car worth {money}. Its value is predicted to appreciate by {rate}% per annum. What will it be worth after {years} years?{rounding}",
      ],
    },

    {
      id:
        "JEWELLERY_VALUE_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "ASSET_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        500,

      maxInitialValue:
        12000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A necklace is valued at {money}. Its value is expected to increase by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "A piece of jewellery currently worth {money} appreciates by {rate}% per year. Find its value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "MUSICAL_INSTRUMENT_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "ASSET_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        600,

      maxInitialValue:
        20000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A vintage musical instrument is valued at {money}. Its value is expected to increase by {rate}% each year. Calculate its value after {years} years.{rounding}",

        "A rare guitar is currently worth {money}. Its value is forecast to rise by {rate}% per annum. What will it be worth after {years} years?{rounding}",
      ],
    },

    {
      id:
        "BUSINESS_PROFIT_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "BUSINESS_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        100000,

      maxInitialValue:
        600000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_THOUSAND_POUNDS",

      currencyDisplayDecimals:
        0,

      usesDates:
        true,

      templates: [
        "A small engineering company made a profit of {money} in {year}. Its profit is expected to increase by {rate}% each year. Calculate the expected profit in {targetYear}.{rounding}",

        "A company's annual profit was {money} in {year}. The profit is forecast to grow by {rate}% per year. Find the expected profit in {targetYear}.{rounding}",

        "In {year}, a business reported an annual profit of {money}. This is expected to rise by {rate}% each year. Calculate the expected profit in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "BUSINESS_TURNOVER_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "BUSINESS_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        150000,

      maxInitialValue:
        1200000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_THOUSAND_POUNDS",

      currencyDisplayDecimals:
        0,

      usesDates:
        true,

      templates: [
        "A business had a turnover of {money} in {year}. Turnover is expected to increase by {rate}% each year. Calculate the expected turnover in {targetYear}.{rounding}",

        "The annual turnover of a company was {money} in {year}. It is forecast to grow by {rate}% per annum. What is the expected turnover in {targetYear}?{rounding}",
      ],
    },

    {
      id:
        "CHARITY_DONATIONS_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "BUSINESS_GROWTH",

      valueKind:
        "CURRENCY",

      minInitialValue:
        20000,

      maxInitialValue:
        300000,

      baseMultiple:
        1000,

      roundingPolicy:
        "NEAREST_THOUSAND_POUNDS",

      currencyDisplayDecimals:
        0,

      usesDates:
        true,

      templates: [
        "A charity received donations totalling {money} in {year}. The total is expected to increase by {rate}% each year. Calculate the expected amount donated in {targetYear}.{rounding}",

        "Donations to a charity totalled {money} in {year}. If donations rise by {rate}% each year, calculate the expected total in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "MUSEUM_VISITOR_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        30000,

      maxInitialValue:
        300000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A museum recorded {number} visitors in {year}. Visitor numbers are expected to increase by {rate}% each year. Calculate the expected number of visitors in {targetYear}.{rounding}",

        "The annual number of visitors to a museum was {number} in {year}. Attendance is forecast to grow by {rate}% per year. Find the expected number of visitors in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "ZOO_VISITOR_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        40000,

      maxInitialValue:
        350000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A zoo welcomed {number} visitors in {year}. Visitor numbers are expected to increase by {rate}% each year. Calculate the expected number of visitors in {targetYear}.{rounding}",

        "The number of people visiting a zoo was {number} in {year}. This is forecast to rise by {rate}% per year. Calculate the expected attendance in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "THEME_PARK_VISITOR_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        50000,

      maxInitialValue:
        500000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A theme park recorded {number} visitors in {year}. Attendance is expected to grow by {rate}% each year. Calculate the expected number of visitors in {targetYear}.{rounding}",

        "Annual attendance at a theme park was {number} in {year}. It is predicted to increase by {rate}% per annum. Find the expected attendance in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "SPORTS_CLUB_MEMBERSHIP_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        200,

      maxInitialValue:
        5000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A sports club has {number} members. Membership is expected to increase by {rate}% each year. Calculate the expected membership after {years} years.{rounding}",

        "There are currently {number} members of a sports club. The membership is forecast to grow by {rate}% per year. How many members are expected after {years} years?{rounding}",
      ],
    },

    {
      id:
        "GYM_MEMBERSHIP_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        500,

      maxInitialValue:
        8000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A gym currently has {number} members. Membership is expected to increase by {rate}% each year. Calculate the expected number of members after {years} years.{rounding}",

        "The membership of a leisure centre is {number}. It is predicted to grow by {rate}% per annum. Find the expected membership after {years} years.{rounding}",
      ],
    },

    {
      id:
        "WEBSITE_USER_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        10000,

      maxInitialValue:
        500000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A website had {number} regular users in {year}. The number of users is expected to increase by {rate}% each year. Calculate the expected number in {targetYear}.{rounding}",

        "The number of regular users of a website was {number} in {year}. This figure is predicted to grow by {rate}% per annum. Find the expected number of users in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "APP_SUBSCRIBER_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        5000,

      maxInitialValue:
        250000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "An app has {number} subscribers. Subscriber numbers are expected to increase by {rate}% each year. Calculate the expected number after {years} years.{rounding}",

        "There are currently {number} subscribers to an app. The total is forecast to grow by {rate}% per year. Find the expected number of subscribers after {years} years.{rounding}",
      ],
    },

    {
      id:
        "RAIL_PASSENGER_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        50000,

      maxInitialValue:
        800000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A railway station recorded {number} passenger journeys in {year}. The number is expected to increase by {rate}% each year. Calculate the expected number of journeys in {targetYear}.{rounding}",

        "Passenger journeys through a railway station totalled {number} in {year}. The total is forecast to grow by {rate}% per annum. Find the expected total in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "BUS_PASSENGER_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        40000,

      maxInitialValue:
        600000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A bus operator carried {number} passengers in {year}. Passenger numbers are expected to increase by {rate}% each year. Calculate the expected number in {targetYear}.{rounding}",

        "The annual number of passengers using a bus service was {number} in {year}. This is predicted to rise by {rate}% per annum. Find the expected number in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "FACTORY_OUTPUT_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "OUTPUT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        10000,

      maxInitialValue:
        300000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A factory produces {number} components each year. Production is expected to increase by {rate}% each year. Calculate the expected annual output after {years} years.{rounding}",

        "A manufacturing plant currently produces {number} units per year. Output is forecast to grow by {rate}% per annum. Find the expected annual output after {years} years.{rounding}",
      ],
    },

    {
      id:
        "CROP_YIELD_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "OUTPUT_GROWTH",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        1000,

      maxInitialValue:
        20000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "tonnes",

      templates: [
        "A farm produces {number} tonnes of a crop each year. The yield is expected to increase by {rate}% per year. Calculate the expected annual yield after {years} years.",

        "The annual crop yield on a farm is {number} tonnes. Improvements are expected to increase this by {rate}% each year. Find the expected yield after {years} years.",
      ],
    },

    {
      id:
        "WILDLIFE_POPULATION_GROWTH",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE",

      rateProfile:
        "COUNT_GROWTH",

      valueKind:
        "COUNT",

      minInitialValue:
        500,

      maxInitialValue:
        30000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A wildlife reserve has an estimated population of {number} animals of a particular species. The population is expected to increase by {rate}% each year. Calculate the expected population after {years} years.{rounding}",

        "The estimated population of a species in a reserve is {number}. It is predicted to grow by {rate}% per year. Find the expected population after {years} years.{rounding}",
      ],
    },


    /**
     * -----------------------------------------------------
     * FIXED-RATE DEPRECIATION / REDUCTION
     * -----------------------------------------------------
     */

    {
      id:
        "LAPTOP_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        400,

      maxInitialValue:
        2500,

      baseMultiple:
        10,

      roundingPolicy:
        "PENCE",

      currencyDisplayDecimals:
        2,

      templates: [
        "{name} buys a laptop for {money}. Its value is expected to depreciate by {rate}% each year. Calculate its expected value after {years} years.",

        "A laptop costs {money}. It is expected to lose {rate}% of its value each year. Calculate its value after {years} years.",
      ],
    },

    {
      id:
        "CAMERA_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        500,

      maxInitialValue:
        6000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A camera is bought for {money}. Its value depreciates by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "{name} buys a camera worth {money}. The camera is expected to lose {rate}% of its value each year. Find its value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "TABLET_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        300,

      maxInitialValue:
        1800,

      baseMultiple:
        10,

      roundingPolicy:
        "PENCE",

      currencyDisplayDecimals:
        2,

      templates: [
        "A tablet costs {money}. Its value is expected to depreciate by {rate}% each year. Calculate its value after {years} years.",

        "{name} pays {money} for a tablet. It loses {rate}% of its value each year. Find its expected value after {years} years.",
      ],
    },

    {
      id:
        "OFFICE_EQUIPMENT_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        3000,

      maxInitialValue:
        40000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A business buys office equipment costing {money}. The equipment depreciates by {rate}% each year. Calculate its value after {years} years.{rounding}",

        "Office equipment is valued at {money}. Its value is expected to fall by {rate}% per year. Find its expected value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "MACHINERY_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        5000,

      maxInitialValue:
        80000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A machine is purchased for {money}. Its value depreciates by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "A piece of machinery is currently valued at {money}. It is expected to lose {rate}% of its value each year. Find its value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "BOAT_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        4000,

      maxInitialValue:
        60000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A boat is valued at {money}. Its value depreciates by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "{name} buys a boat for {money}. Its value is expected to fall by {rate}% per year. Find its value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "CARAVAN_FIXED_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        5000,

      maxInitialValue:
        40000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A caravan is bought for {money}. Its value depreciates by {rate}% each year. Calculate its expected value after {years} years.{rounding}",

        "The current value of a caravan is {money}. It is expected to fall by {rate}% per year. Find its value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "USED_CAR_FIXED_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        4000,

      maxInitialValue:
        40000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A car is valued at {money}. Its value is expected to depreciate by {rate}% each year. Calculate its value after {years} years.{rounding}",

        "{name} buys a car for {money}. The car loses {rate}% of its value each year. Find its expected value after {years} years.{rounding}",
      ],
    },

    {
      id:
        "HOUSEHOLD_WASTE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        50000,

      maxInitialValue:
        300000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "tonnes",

      usesDates:
        true,

      templates: [
        "A council collected {number} tonnes of household waste in {year}. The amount is expected to fall by {rate}% each year. Calculate the expected amount collected in {targetYear}.",

        "The amount of household waste collected by a council was {number} tonnes in {year}. This is predicted to decrease by {rate}% per annum. Find the expected amount in {targetYear}.",
      ],
    },

    {
      id:
        "LANDFILL_WASTE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        30000,

      maxInitialValue:
        250000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "tonnes",

      usesDates:
        true,

      templates: [
        "A region sent {number} tonnes of waste to landfill in {year}. The amount is expected to decrease by {rate}% each year. Calculate the expected amount in {targetYear}.",

        "The quantity of waste sent to landfill was {number} tonnes in {year}. It is forecast to fall by {rate}% per year. Find the expected quantity in {targetYear}.",
      ],
    },

    {
      id:
        "COMPANY_EMISSIONS_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        5000,

      maxInitialValue:
        120000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "tonnes",

      usesDates:
        true,

      templates: [
        "A company produced {number} tonnes of carbon emissions in {year}. It aims to reduce this amount by {rate}% each year. Calculate the expected emissions in {targetYear}.",

        "The annual carbon emissions of a company were {number} tonnes in {year}. They are expected to fall by {rate}% per year. Find the expected emissions in {targetYear}.",
      ],
    },

    {
      id:
        "ENERGY_CONSUMPTION_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        10000,

      maxInitialValue:
        250000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "kWh",

      templates: [
        "A building uses {number} kWh of energy each year. A reduction programme aims to cut this by {rate}% each year. Calculate the expected annual energy use after {years} years.",

        "The annual energy consumption of a building is {number} kWh. It is expected to decrease by {rate}% per year. Find the expected consumption after {years} years.",
      ],
    },

    {
      id:
        "WATER_CONSUMPTION_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        10000,

      maxInitialValue:
        500000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "litres",

      templates: [
        "A business uses {number} litres of water each year. It plans to reduce its usage by {rate}% each year. Calculate the expected annual usage after {years} years.",

        "Annual water use at a site is {number} litres. The amount is expected to fall by {rate}% per year. Find the expected usage after {years} years.",
      ],
    },

    {
      id:
        "PAPER_USE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "COUNT",

      minInitialValue:
        10000,

      maxInitialValue:
        300000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "An organisation uses {number} sheets of paper each year. It aims to reduce this by {rate}% each year. Calculate the expected annual use after {years} years.{rounding}",

        "Annual paper use in an office is {number} sheets. The total is expected to fall by {rate}% per year. Find the expected annual use after {years} years.{rounding}",
      ],
    },

    {
      id:
        "PLASTIC_USE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        2000,

      maxInitialValue:
        80000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "kg",

      templates: [
        "A manufacturer uses {number} kg of plastic each year. It plans to reduce this amount by {rate}% per year. Calculate the expected annual use after {years} years.",

        "Annual plastic use at a factory is {number} kg. This is expected to decrease by {rate}% each year. Find the expected amount after {years} years.",
      ],
    },

    {
      id:
        "FUEL_CONSUMPTION_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        5000,

      maxInitialValue:
        100000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "litres",

      templates: [
        "A delivery fleet uses {number} litres of fuel each year. The company aims to reduce this by {rate}% annually. Calculate the expected fuel use after {years} years.",

        "The annual fuel consumption of a vehicle fleet is {number} litres. It is predicted to fall by {rate}% each year. Find the expected consumption after {years} years.",
      ],
    },

    {
      id:
        "SUGAR_CONTENT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "MEASUREMENT_REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        20,

      maxInitialValue:
        80,

      baseMultiple:
        1,

      roundingPolicy:
        "NONE",

      unit:
        "g",

      templates: [
        "A food product currently contains {number} g of sugar. The manufacturer plans to reduce this amount by {rate}% each year for {years} years. Calculate the sugar content after {years} years.",

        "A drink contains {number} g of sugar. Its recipe is being changed so that the sugar content falls by {rate}% each year. Calculate the amount of sugar after {years} years.",
      ],
    },

    {
      id:
        "SALT_CONTENT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "MEASUREMENT_REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        20,

      maxInitialValue:
        80,

      baseMultiple:
        1,

      roundingPolicy:
        "NONE",

      unit:
        "g",

      templates: [
        "A food product currently contains {number} g of salt. The manufacturer plans to reduce this amount by {rate}% each year for {years} years. Calculate the salt content after {years} years.",

        "A manufacturer is reducing the salt in a food product. It currently contains {number} g. The amount will be reduced by {rate}% each year. Calculate the salt content after {years} years.",
      ],
    },

    {
      id:
        "SATURATED_FAT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "MEASUREMENT_REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        10,

      maxInitialValue:
        60,

      baseMultiple:
        1,

      roundingPolicy:
        "NONE",

      unit:
        "g",

      templates: [
        "A ready meal currently contains {number} g of saturated fat. The recipe is to be changed so that this amount falls by {rate}% each year. Calculate the amount after {years} years.",

        "A manufacturer plans to reduce the saturated fat in a product by {rate}% each year. The product currently contains {number} g. Find the amount after {years} years.",
      ],
    },

    {
      id:
        "CUSTOMER_COMPLAINT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        200,

      maxInitialValue:
        8000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A company receives {number} customer complaints each year. It aims to reduce this number by {rate}% each year. Calculate the expected number after {years} years.{rounding}",

        "The annual number of customer complaints received by a business is {number}. This is expected to fall by {rate}% per year. Find the expected number after {years} years.{rounding}",
      ],
    },

    {
      id:
        "PRODUCT_DEFECT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        500,

      maxInitialValue:
        20000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A factory records {number} defective items each year. Improvements are expected to reduce this number by {rate}% annually. Calculate the expected number after {years} years.{rounding}",

        "The annual number of defective products from a factory is {number}. This is predicted to decrease by {rate}% each year. Find the expected number after {years} years.{rounding}",
      ],
    },

    {
      id:
        "SERVICE_CALLOUT_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        300,

      maxInitialValue:
        12000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A maintenance company handles {number} emergency callouts each year. The number is expected to fall by {rate}% annually. Calculate the expected number after {years} years.{rounding}",

        "The annual number of emergency maintenance callouts is {number}. Improvements are expected to reduce this by {rate}% each year. Find the expected number after {years} years.{rounding}",
      ],
    },

    {
      id:
        "SCHOOL_ROLL_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        500,

      maxInitialValue:
        2000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A school has {number} pupils. The school roll is expected to decrease by {rate}% each year. Calculate the expected number of pupils after {years} years.{rounding}",

        "There are currently {number} pupils at a school. Enrolment is predicted to fall by {rate}% per year. Find the expected school roll after {years} years.{rounding}",
      ],
    },

    {
      id:
        "CLUB_MEMBERSHIP_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        200,

      maxInitialValue:
        6000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A club currently has {number} members. Membership is expected to decrease by {rate}% each year. Calculate the expected membership after {years} years.{rounding}",

        "The membership of a community organisation is {number}. It is predicted to fall by {rate}% per annum. Find the expected membership after {years} years.{rounding}",
      ],
    },

    {
      id:
        "TOWN_POPULATION_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        5000,

      maxInitialValue:
        80000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A town has a population of {number}. The population is expected to decrease by {rate}% each year. Calculate the expected population after {years} years.{rounding}",

        "The population of a small town is currently {number}. It is forecast to fall by {rate}% per year. Find the expected population after {years} years.{rounding}",
      ],
    },

    {
      id:
        "WILDLIFE_POPULATION_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        500,

      maxInitialValue:
        30000,

      baseMultiple:
        10,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "A wildlife survey estimates a population of {number} animals. The population is expected to decrease by {rate}% each year. Calculate the expected population after {years} years.{rounding}",

        "The estimated population of a species is {number}. It is predicted to fall by {rate}% per year. Find the expected population after {years} years.{rounding}",
      ],
    },

    {
      id:
        "LIBRARY_LOAN_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        10000,

      maxInitialValue:
        150000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      usesDates:
        true,

      templates: [
        "A library recorded {number} book loans in {year}. The number of loans is expected to decrease by {rate}% each year. Calculate the expected number in {targetYear}.{rounding}",

        "The annual number of books borrowed from a library was {number} in {year}. This is predicted to fall by {rate}% per year. Find the expected number in {targetYear}.{rounding}",
      ],
    },

    {
      id:
        "PRINTED_BROCHURE_DECLINE",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "COUNT_DECLINE",

      valueKind:
        "COUNT",

      minInitialValue:
        10000,

      maxInitialValue:
        250000,

      baseMultiple:
        100,

      roundingPolicy:
        "AUTO_COUNT",

      templates: [
        "An organisation prints {number} brochures each year. It plans to reduce this number by {rate}% annually. Calculate the expected number printed after {years} years.{rounding}",

        "The annual number of printed brochures is {number}. The organisation expects this to fall by {rate}% each year. Find the expected number after {years} years.{rounding}",
      ],
    },

    {
      id:
        "ROAD_SALT_USE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        1000,

      maxInitialValue:
        30000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "tonnes",

      templates: [
        "A council uses {number} tonnes of road salt each winter. It aims to reduce this amount by {rate}% each year. Calculate the expected amount used after {years} years.",

        "Annual road salt use by a council is {number} tonnes. This is expected to fall by {rate}% per year. Find the expected amount after {years} years.",
      ],
    },

    {
      id:
        "PACKAGING_MATERIAL_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        1000,

      maxInitialValue:
        50000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "kg",

      templates: [
        "A company uses {number} kg of packaging material each year. It plans to reduce this amount by {rate}% annually. Calculate the expected annual use after {years} years.",

        "Annual packaging use at a business is {number} kg. This is expected to decrease by {rate}% per year. Find the expected amount after {years} years.",
      ],
    },

    {
      id:
        "FOOD_WASTE_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "MEASUREMENT",

      minInitialValue:
        1000,

      maxInitialValue:
        50000,

      baseMultiple:
        100,

      roundingPolicy:
        "NONE",

      unit:
        "kg",

      templates: [
        "A catering company produces {number} kg of food waste each year. It aims to reduce this by {rate}% annually. Calculate the expected amount after {years} years.",

        "Annual food waste from a large kitchen is {number} kg. A new scheme is expected to reduce this by {rate}% each year. Find the expected amount after {years} years.",
      ],
    },

    {
      id:
        "ELECTRICITY_COST_REDUCTION",

      family:
        "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_DECREASE",

      rateProfile:
        "REDUCTION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        10000,

      maxInitialValue:
        120000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A business currently spends {money} each year on electricity. It aims to reduce this cost by {rate}% annually. Calculate the expected annual cost after {years} years.{rounding}",

        "The annual electricity bill for a business is {money}. Efficiency improvements are expected to reduce this by {rate}% each year. Find the expected cost after {years} years.{rounding}",
      ],
    },


    /**
     * -----------------------------------------------------
     * MULTI-RATE DEPRECIATION
     * -----------------------------------------------------
     */

    {
      id:
        "CAR_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        8000,

      maxInitialValue:
        50000,

      baseMultiple:
        100,

      roundingPolicy:
        "PENCE",

      currencyDisplayDecimals:
        2,

      templates: [
        "A car is bought for {money}. It depreciates by {firstRate}% during the first year. It then depreciates by {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.",

        "{name} buys a car for {money}. Its value falls by {firstRate}% in the first year. During each of the following {laterYears} years it falls by a further {laterRate}%. Calculate its value after {totalYears} years.",
      ],
    },

    {
      id:
        "CARAVAN_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        8000,

      maxInitialValue:
        40000,

      baseMultiple:
        100,

      roundingPolicy:
        "PENCE",

      currencyDisplayDecimals:
        2,

      templates: [
        "A caravan is bought for {money}. Its value decreases by {firstRate}% in the first year. It then decreases by {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.",

        "The original value of a caravan is {money}. It depreciates by {firstRate}% during its first year. It then depreciates by {laterRate}% per year for the following {laterYears} years. Find its value after {totalYears} years.",
      ],
    },

    {
      id:
        "MOTORHOME_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        15000,

      maxInitialValue:
        80000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A motorhome is purchased for {money}. It loses {firstRate}% of its value in the first year. It then loses {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A motorhome initially worth {money} depreciates by {firstRate}% during year one. Its value then falls by {laterRate}% per year for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "VAN_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        10000,

      maxInitialValue:
        60000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A company buys a van for {money}. Its value falls by {firstRate}% in the first year. It then falls by {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A van initially costs {money}. It depreciates by {firstRate}% during the first year. It then depreciates by {laterRate}% annually for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "BOAT_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        10000,

      maxInitialValue:
        100000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A boat is purchased for {money}. Its value decreases by {firstRate}% in the first year. It then decreases by {laterRate}% in each of the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A boat initially worth {money} loses {firstRate}% of its value during year one. It then depreciates by {laterRate}% per year for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "LAPTOP_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        700,

      maxInitialValue:
        3000,

      baseMultiple:
        10,

      roundingPolicy:
        "PENCE",

      currencyDisplayDecimals:
        2,

      templates: [
        "A laptop costs {money}. Its value falls by {firstRate}% in the first year. It then falls by {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.",

        "{name} buys a laptop for {money}. It depreciates by {firstRate}% during the first year. It then depreciates by {laterRate}% annually for another {laterYears} years. Find its value after {totalYears} years.",
      ],
    },

    {
      id:
        "CAMERA_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        1000,

      maxInitialValue:
        8000,

      baseMultiple:
        10,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A camera is bought for {money}. It loses {firstRate}% of its value in the first year. It then loses {laterRate}% in each of the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A camera initially worth {money} depreciates by {firstRate}% during year one. It then falls in value by {laterRate}% each year for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "MACHINERY_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        10000,

      maxInitialValue:
        120000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A machine is purchased for {money}. It depreciates by {firstRate}% in the first year. It then depreciates by {laterRate}% per year for the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A piece of machinery initially costs {money}. Its value falls by {firstRate}% during year one. It then falls by {laterRate}% each year for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "OFFICE_TECH_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        5000,

      maxInitialValue:
        50000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "A company buys computer equipment for {money}. Its value falls by {firstRate}% in the first year. It then falls by {laterRate}% each year for the following {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "Computer equipment initially worth {money} depreciates by {firstRate}% during year one. It then loses {laterRate}% of its value annually for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },

    {
      id:
        "SPECIALIST_EQUIPMENT_MULTI_RATE_DEPRECIATION",

      family:
        "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE",

      rateProfile:
        "ASSET_DEPRECIATION",

      valueKind:
        "CURRENCY",

      minInitialValue:
        10000,

      maxInitialValue:
        150000,

      baseMultiple:
        100,

      roundingPolicy:
        "NEAREST_POUND",

      currencyDisplayDecimals:
        0,

      templates: [
        "Specialist equipment is purchased for {money}. Its value depreciates by {firstRate}% in the first year. It then depreciates by {laterRate}% each year for the next {laterYears} years. Calculate its value after {totalYears} years.{rounding}",

        "A company owns specialist equipment initially valued at {money}. It loses {firstRate}% of its value during year one. It then loses {laterRate}% per year for another {laterYears} years. Find its value after {totalYears} years.{rounding}",
      ],
    },
  ];


const NAMES = [
  "Aiden",
  "Calum",
  "Euan",
  "Freya",
  "Isla",
  "Lucy",
  "Maya",
  "Sophie",
] as const;


function randomInt(
  min: number,
  max: number
): number {
  return (
    Math.floor(
      Math.random() *
        (
          max -
          min +
          1
        )
    ) +
    min
  );
}


function chooseOne<T>(
  items:
    readonly T[]
): T {
  return (
    items[
      randomInt(
        0,
        items.length - 1
      )
    ]
  );
}


function pickWeighted<T>(
  items: {
    value: T;
    weight: number;
  }[]
): T {
  const usable =
    items.filter(
      (item) =>
        item.weight > 0
    );

  if (
    usable.length === 0
  ) {
    throw new Error(
      "Cannot choose from an empty weighted set."
    );
  }

  const total =
    usable.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.weight,

      0
    );

  let roll =
    Math.random() *
    total;

  for (
    const item
    of usable
  ) {
    roll -=
      item.weight;

    if (
      roll <= 0
    ) {
      return item.value;
    }
  }

  return (
    usable[
      usable.length - 1
    ].value
  );
}


function gcd(
  a: number,
  b: number
): number {
  let x =
    Math.abs(
      Math.round(a)
    );

  let y =
    Math.abs(
      Math.round(b)
    );

  while (
    y !== 0
  ) {
    const remainder =
      x %
      y;

    x = y;
    y = remainder;
  }

  return x || 1;
}


function lcm(
  a: number,
  b: number
): number {
  return (
    Math.abs(
      a *
      b
    ) /
    gcd(
      a,
      b
    )
  );
}


function decimalPlaces(
  value: number
): number {
  const text =
    String(
      value
    );

  const index =
    text.indexOf(
      "."
    );

  if (
    index === -1
  ) {
    return 0;
  }

  return (
    text.length -
    index -
    1
  );
}


function percentageMultiplier(
  percentageValue: number,
  direction:
    CompoundPercentageDirection
): number {
  return (
    direction ===
      "INCREASE"
      ? 1 +
        percentageValue /
          100
      : 1 -
        percentageValue /
          100
  );
}


function multiplierFraction(
  percentageValue: number,
  direction:
    CompoundPercentageDirection
): {
  numerator: number;
  denominator: number;
} {
  const places =
    decimalPlaces(
      percentageValue
    );

  const scale =
    Math.pow(
      10,
      places
    );

  const percentageInteger =
    Math.round(
      percentageValue *
      scale
    );

  const base =
    100 *
    scale;

  const numerator =
    direction ===
      "INCREASE"
      ? base +
        percentageInteger
      : base -
        percentageInteger;

  const divisor =
    gcd(
      numerator,
      base
    );

  return {
    numerator:
      numerator /
      divisor,

    denominator:
      base /
      divisor,
  };
}


function multiplierDenominator(
  percentageValue: number,
  direction:
    CompoundPercentageDirection
): number {
  return (
    multiplierFraction(
      percentageValue,
      direction
    ).denominator
  );
}


function makeStage(
  percentageValue: number,
  direction:
    CompoundPercentageDirection,
  periods: number
): CompoundPercentageStage {
  return {
    percentageValue,

    multiplier:
      percentageMultiplier(
        percentageValue,
        direction
      ),

    periods,
  };
}


function calculateFinalValue(
  initialValue: number,
  stages:
    CompoundPercentageStage[]
): number {
  let result =
    initialValue;

  for (
    const stage
    of stages
  ) {
    result *=
      Math.pow(
        stage.multiplier,
        stage.periods
      );
  }

  return result;
}


function roundTo(
  value: number,
  decimalPlacesValue: number
): number {
  const factor =
    Math.pow(
      10,
      decimalPlacesValue
    );

  return (
    Math.round(
      (
        value +
        Number.EPSILON
      ) *
      factor
    ) /
    factor
  );
}


function approximatelyInteger(
  value: number
): boolean {
  return (
    Math.abs(
      value -
      Math.round(
        value
      )
    ) <
    0.0000001
  );
}


function resultDecimalPlaces(
  value: number
): number {
  for (
    let places = 0;
    places <=
      MAX_RESULT_DECIMAL_PLACES;
    places += 1
  ) {
    if (
      Math.abs(
        value -
        roundTo(
          value,
          places
        )
      ) <
      0.0000001
    ) {
      return places;
    }
  }

  return (
    MAX_RESULT_DECIMAL_PLACES +
    1
  );
}


function compoundedFraction(
  stages:
    CompoundPercentageStage[]
): {
  numerator: number;
  denominator: number;
} {
  let numerator =
    1;

  let denominator =
    1;

  for (
    const stage
    of stages
  ) {
    const direction:
      CompoundPercentageDirection =
        stage.multiplier >
          1
          ? "INCREASE"
          : "DECREASE";

    const fraction =
      multiplierFraction(
        stage.percentageValue,
        direction
      );

    numerator *=
      Math.pow(
        fraction.numerator,
        stage.periods
      );

    denominator *=
      Math.pow(
        fraction.denominator,
        stage.periods
      );

    const divisor =
      gcd(
        numerator,
        denominator
      );

    numerator /=
      divisor;

    denominator /=
      divisor;
  }

  return {
    numerator,
    denominator,
  };
}


/**
 * Returns the smallest integer factor the starting
 * value must contain so that the final answer can be
 * represented using no more than the requested number
 * of decimal places.
 *
 * Example:
 *
 *   multiplier = 1.065
 *              = 213 / 200
 *
 * Repeated three times gives denominator 8,000,000.
 *
 * To terminate to at most 3 d.p., the starting amount
 * needs to cancel all but a factor contained in 1000.
 */
function requiredInitialMultipleForPrecision(
  stages:
    CompoundPercentageStage[],
  maximumDecimalPlaces:
    number
): number {
  const fraction =
    compoundedFraction(
      stages
    );

  const decimalScale =
    Math.pow(
      10,
      maximumDecimalPlaces
    );

  return (
    fraction.denominator /
    gcd(
      fraction.denominator,
      decimalScale
    )
  );
}


function trimDecimalString(
  value: number,
  maximumDecimalPlaces = 8
): string {
  if (
    Number.isInteger(
      value
    )
  ) {
    return String(
      value
    );
  }

  return (
    value
      .toFixed(
        maximumDecimalPlaces
      )
      .replace(
        /0+$/,
        ""
      )
      .replace(
        /\.$/,
        ""
      )
  );
}


function formatNumberWithCommas(
  value: number,
  fixedDecimals?: number
): string {
  const raw =
    fixedDecimals ===
      undefined
      ? trimDecimalString(
          value
        )
      : value.toFixed(
          fixedDecimals
        );

  const [
    integerPart,
    decimalPart,
  ] =
    raw.split(
      "."
    );

  const sign =
    integerPart.startsWith(
      "-"
    )
      ? "-"
      : "";

  const unsigned =
    integerPart.replace(
      "-",
      ""
    );

  const grouped =
    unsigned.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );

  if (
    decimalPart ===
    undefined
  ) {
    return (
      `${sign}${grouped}`
    );
  }

  return (
    `${sign}${grouped}.${decimalPart}`
  );
}


function formatPercentage(
  value: number
): string {
  return (
    trimDecimalString(
      value,
      4
    )
  );
}


function periodsForDifficulty(
  difficulty:
    CompoundPercentageDifficulty
): number {
  if (
    difficulty === 1
  ) {
    return (
      chooseOne([
        2,
        2,
        3,
      ])
    );
  }

  if (
    difficulty === 2
  ) {
    return (
      chooseOne([
        2,
        2,
        3,
        3,
      ])
    );
  }

  return (
    chooseOne([
      3,
      3,
      4,
    ])
  );
}


/**
 * Decimal percentages remain uncommon because the
 * historical corpus is overwhelmingly whole-number
 * percentage change.
 *
 * L1:
 *   no decimal rates.
 *
 * L2:
 *   decimal rates are technically possible but rare.
 *
 * L3:
 *   decimal rates receive a modestly heavier weighting,
 *   while integer rates remain the majority.
 */
function decimalRateProbability(
  difficulty:
    CompoundPercentageDifficulty
): number {
  if (
    difficulty === 1
  ) {
    return 0;
  }

  if (
    difficulty === 2
  ) {
    return 0.02;
  }

  return 0.30;
}


function pickRate(
  profileId:
    RateProfileId,
  difficulty:
    CompoundPercentageDifficulty
): number {
  const profile =
    RATE_PROFILES[
      profileId
    ];

  if (
    difficulty === 1
  ) {
    return (
      chooseOne(
        profile.friendly
      )
    );
  }

  const useDecimal =
    Math.random() <
    decimalRateProbability(
      difficulty
    );

  if (
    useDecimal &&
    profile.decimal.length >
      0
  ) {
    return (
      chooseOne(
        profile.decimal
      )
    );
  }

  return (
    chooseOne(
      profile.integer
    )
  );
}


/**
 * Multi-rate questions already carry additional
 * structural demand.
 *
 * The historical 2023 source uses whole-number
 * percentages in both stages.
 *
 * Therefore:
 *
 * L1 / L2:
 *   integer rates only.
 *
 * L3:
 *   a decimal percentage is still unusual.
 *   When it occurs, only one stage may be decimal.
 */
function multiRateUsesDecimal(
  difficulty:
    CompoundPercentageDifficulty
): boolean {
  return (
    difficulty === 3 &&
    Math.random() <
      0.08
  );
}


function pickMultiRateValue(args: {
  profileId:
    RateProfileId;

  difficulty:
    CompoundPercentageDifficulty;

  useDecimal:
    boolean;
}): number {
  const profile =
    RATE_PROFILES[
      args.profileId
    ];

  if (
    args.useDecimal
  ) {
    return (
      chooseOne(
        profile.decimal
      )
    );
  }

  if (
    args.difficulty === 1
  ) {
    return (
      chooseOne(
        profile.friendly
      )
    );
  }

  return (
    chooseOne(
      profile.integer
    )
  );
}


function buildFriendlyInitialValue(
  stages:
    CompoundPercentageStage[],
  shell:
    ContextShell
): number | undefined {
  let requiredMultiple =
    Math.max(
      1,
      shell.baseMultiple
    );

  for (
    const stage
    of stages
  ) {
    const denominator =
      multiplierDenominator(
        stage.percentageValue,
        stage.multiplier >
          1
          ? "INCREASE"
          : "DECREASE"
      );

    const stageRequirement =
      Math.pow(
        denominator,
        stage.periods
      );

    requiredMultiple =
      lcm(
        requiredMultiple,
        stageRequirement
      );
  }

  const lower =
    Math.ceil(
      shell.minInitialValue /
      requiredMultiple
    );

  const upper =
    Math.floor(
      shell.maxInitialValue /
      requiredMultiple
    );

  if (
    upper <
    Math.max(
      1,
      lower
    )
  ) {
    return undefined;
  }

  return (
    requiredMultiple *
    randomInt(
      Math.max(
        1,
        lower
      ),
      upper
    )
  );
}


/**
 * L2/L3 values are constructed so that the exact
 * compound calculation normally terminates at no more
 * than three decimal places.
 *
 * This avoids calculator-dump answers such as
 *
 *   5399.53482375
 *
 * while retaining the same compound-percentage maths.
 */
function buildTidyInitialValue(
  stages:
    CompoundPercentageStage[],
  shell:
    ContextShell
): number | undefined {
  const precisionMultiple =
    requiredInitialMultipleForPrecision(
      stages,
      MAX_RESULT_DECIMAL_PLACES
    );

  const requiredMultiple =
    lcm(
      Math.max(
        1,
        shell.baseMultiple
      ),
      precisionMultiple
    );

  const lower =
    Math.ceil(
      shell.minInitialValue /
      requiredMultiple
    );

  const upper =
    Math.floor(
      shell.maxInitialValue /
      requiredMultiple
    );

  if (
    upper <
    Math.max(
      1,
      lower
    )
  ) {
    return undefined;
  }

  return (
    requiredMultiple *
    randomInt(
      Math.max(
        1,
        lower
      ),
      upper
    )
  );
}


function sourceQuestionCountForFamily(
  familyId:
    CompoundPercentageFamilyId
): number {
  return (
    N5_MATHS_EXAM_QUESTION_CATALOG
      .filter(
        (question) =>
          question.familyId ===
          familyId
      )
      .length
  );
}


function compoundSourceCorpusSize(): number {
  return (
    N5_MATHS_EXAM_QUESTION_CATALOG
      .filter(
        (question) =>
          FAMILY_IDS.includes(
            question.familyId as
              CompoundPercentageFamilyId
          )
      )
      .length
  );
}


function familyDirection(
  familyId:
    CompoundPercentageFamilyId
): CompoundPercentageDirection {
  return (
    familyId ===
      "NUM_COMPOUND_PERCENTAGE_FIXED_RATE_INCREASE"
      ? "INCREASE"
      : "DECREASE"
  );
}


function familyRateStructure(
  familyId:
    CompoundPercentageFamilyId
): CompoundPercentageRateStructure {
  return (
    familyId ===
      "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE"
      ? "MULTI_RATE"
      : "FIXED_RATE"
  );
}


/**
 * Historical family counts contribute the base weight.
 *
 * L3 deliberately increases multi-rate frequency because
 * the structure itself represents an additional level of
 * demand.
 *
 * With the current historical family counts:
 *
 *   fixed families combined = weight 10
 *   multi-rate family       = weight 6
 *
 * giving approximately 37.5% multi-rate generation at L3.
 */
function difficultyFamilyMultiplier(
  familyId:
    CompoundPercentageFamilyId,
  difficulty:
    CompoundPercentageDifficulty
): number {
  if (
    familyId !==
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE"
  ) {
    return 1;
  }

  if (
    difficulty === 1
  ) {
    return 0;
  }

  if (
    difficulty === 2
  ) {
    return 0.8;
  }

  return 6;
}


function chooseFamilyId(
  options:
    CompoundPercentageGeneratorOptions,
  difficulty:
    CompoundPercentageDifficulty
): CompoundPercentageFamilyId {
  if (
    options.familyId
  ) {
    return (
      options.familyId
    );
  }

  const candidates =
    FAMILY_IDS.filter(
      (familyId) => {
        if (
          options.direction &&
          familyDirection(
            familyId
          ) !==
            options.direction
        ) {
          return false;
        }

        if (
          options.rateStructure &&
          familyRateStructure(
            familyId
          ) !==
            options.rateStructure
        ) {
          return false;
        }

        return true;
      }
    );

  if (
    candidates.length === 0
  ) {
    throw new Error(
      "No historically supported compound-percentage family matches the requested options."
    );
  }

  return (
    pickWeighted(
      candidates.map(
        (familyId) => ({
          value:
            familyId,

          weight:
            sourceQuestionCountForFamily(
              familyId
            ) *
            difficultyFamilyMultiplier(
              familyId,
              difficulty
            ),
        })
      )
    )
  );
}


function chooseShell(
  familyId:
    CompoundPercentageFamilyId
): ContextShell {
  const candidates =
    CONTEXT_SHELLS.filter(
      (shell) =>
        shell.family ===
        familyId
    );

  if (
    candidates.length === 0
  ) {
    throw new Error(
      `No context shells registered for ${familyId}.`
    );
  }

  return (
    chooseOne(
      candidates
    )
  );
}


function buildFixedStages(
  shell:
    ContextShell,
  difficulty:
    CompoundPercentageDifficulty
): CompoundPercentageStage[] {
  const direction =
    familyDirection(
      shell.family
    );

  const periods =
    periodsForDifficulty(
      difficulty
    );

  const rate =
    pickRate(
      shell.rateProfile,
      difficulty
    );

  return [
    makeStage(
      rate,
      direction,
      periods
    ),
  ];
}


function buildMultiRateStages(
  shell:
    ContextShell,
  difficulty:
    CompoundPercentageDifficulty
): CompoundPercentageStage[] {
  const laterPeriods =
    difficulty === 3
      ? chooseOne([
          2,
          2,
          3,
        ])
      : 2;

  const useDecimal =
    multiRateUsesDecimal(
      difficulty
    );

  const decimalStage =
    useDecimal
      ? chooseOne(
          [
            "FIRST",
            "LATER",
          ] as const
        )
      : "NONE";


  for (
    let attempt = 0;
    attempt < 100;
    attempt += 1
  ) {
    const firstRate =
      pickMultiRateValue({
        profileId:
          shell.rateProfile,

        difficulty,

        useDecimal:
          decimalStage ===
          "FIRST",
      });

    const laterRate =
      pickMultiRateValue({
        profileId:
          "REDUCTION",

        difficulty,

        useDecimal:
          decimalStage ===
          "LATER",
      });

    /**
     * Preserve the historically evidenced pattern:
     *
     * a larger first-year depreciation followed by a
     * smaller recurring annual depreciation.
     */
    if (
      firstRate >
        laterRate
    ) {
      return [
        makeStage(
          firstRate,
          "DECREASE",
          1
        ),

        makeStage(
          laterRate,
          "DECREASE",
          laterPeriods
        ),
      ];
    }
  }


  if (
    decimalStage ===
    "FIRST"
  ) {
    return [
      makeStage(
        17.5,
        "DECREASE",
        1
      ),

      makeStage(
        8,
        "DECREASE",
        laterPeriods
      ),
    ];
  }

  if (
    decimalStage ===
    "LATER"
  ) {
    return [
      makeStage(
        20,
        "DECREASE",
        1
      ),

      makeStage(
        7.5,
        "DECREASE",
        laterPeriods
      ),
    ];
  }

  return [
    makeStage(
      15,
      "DECREASE",
      1
    ),

    makeStage(
      8,
      "DECREASE",
      laterPeriods
    ),
  ];
}


function buildStages(
  shell:
    ContextShell,
  difficulty:
    CompoundPercentageDifficulty
): CompoundPercentageStage[] {
  if (
    shell.family ===
    "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE"
  ) {
    return (
      buildMultiRateStages(
        shell,
        difficulty
      )
    );
  }

  return (
    buildFixedStages(
      shell,
      difficulty
    )
  );
}


function buildInitialValue(
  shell:
    ContextShell,
  stages:
    CompoundPercentageStage[],
  difficulty:
    CompoundPercentageDifficulty
): {
  value: number;
  friendlyArithmetic: boolean;
} | undefined {
  if (
    difficulty === 1
  ) {
    const friendly =
      buildFriendlyInitialValue(
        stages,
        shell
      );

    if (
      friendly ===
      undefined
    ) {
      return undefined;
    }

    return {
      value:
        friendly,

      friendlyArithmetic:
        true,
    };
  }

  const tidy =
    buildTidyInitialValue(
      stages,
      shell
    );

  if (
    tidy ===
    undefined
  ) {
    return undefined;
  }

  return {
    value:
      tidy,

    friendlyArithmetic:
      false,
  };
}


function determineRounding(args: {
  shell:
    ContextShell;

  unroundedFinalValue:
    number;
}): {
  roundingMode:
    CompoundPercentageRoundingMode;

  roundingExplicitInPrompt:
    boolean;

  currencyDisplayDecimals?:
    | 0
    | 2;
} {
  const {
    shell,
    unroundedFinalValue,
  } = args;

  if (
    shell.roundingPolicy ===
    "NEAREST_POUND"
  ) {
    return {
      roundingMode:
        "NEAREST_INTEGER",

      roundingExplicitInPrompt:
        true,

      currencyDisplayDecimals:
        0,
    };
  }

  if (
    shell.roundingPolicy ===
    "NEAREST_THOUSAND_POUNDS"
  ) {
    return {
      roundingMode:
        "NEAREST_THOUSAND",

      roundingExplicitInPrompt:
        true,

      currencyDisplayDecimals:
        0,
    };
  }

  if (
    shell.roundingPolicy ===
    "PENCE"
  ) {
    return {
      roundingMode:
        "NONE",

      roundingExplicitInPrompt:
        false,

      currencyDisplayDecimals:
        2,
    };
  }

  if (
    shell.roundingPolicy ===
    "AUTO_COUNT"
  ) {
    if (
      approximatelyInteger(
        unroundedFinalValue
      )
    ) {
      return {
        roundingMode:
          "NONE",

        roundingExplicitInPrompt:
          false,
      };
    }

    return {
      roundingMode:
        "NEAREST_INTEGER",

      roundingExplicitInPrompt:
        true,
    };
  }

  return {
    roundingMode:
      "NONE",

    roundingExplicitInPrompt:
      false,

    currencyDisplayDecimals:
      shell.currencyDisplayDecimals,
  };
}


function applyRounding(
  value: number,
  roundingMode:
    CompoundPercentageRoundingMode
): number {
  if (
    roundingMode ===
    "NEAREST_INTEGER"
  ) {
    return (
      Math.round(
        value
      )
    );
  }

  if (
    roundingMode ===
    "NEAREST_TEN"
  ) {
    return (
      Math.round(
        value /
        10
      ) *
      10
    );
  }

  if (
    roundingMode ===
    "NEAREST_THOUSAND"
  ) {
    return (
      Math.round(
        value /
        1000
      ) *
      1000
    );
  }

  return value;
}


function requestedAnswerForScenario(args: {
  shell:
    ContextShell;

  unroundedFinalValue:
    number;

  roundingMode:
    CompoundPercentageRoundingMode;

  currencyDisplayDecimals?:
    | 0
    | 2;
}): number {
  if (
    args.roundingMode !==
    "NONE"
  ) {
    return (
      applyRounding(
        args.unroundedFinalValue,
        args.roundingMode
      )
    );
  }

  if (
    args.shell.valueKind ===
      "CURRENCY" &&
    args.currencyDisplayDecimals ===
      2
  ) {
    return (
      roundTo(
        args.unroundedFinalValue,
        2
      )
    );
  }

  if (
    args.shell.valueKind ===
      "COUNT"
  ) {
    return (
      Math.round(
        args.unroundedFinalValue
      )
    );
  }

  /**
   * By construction the underlying value should now
   * require no more than three decimal places.
   *
   * The round here only protects against ordinary
   * JavaScript floating-point noise.
   */
  return (
    roundTo(
      args.unroundedFinalValue,
      MAX_RESULT_DECIMAL_PLACES
    )
  );
}


function roundingInstruction(
  shell:
    ContextShell,
  roundingMode:
    CompoundPercentageRoundingMode
): string {
  if (
    roundingMode ===
    "NEAREST_THOUSAND"
  ) {
    return (
      " Give your answer to the nearest thousand pounds."
    );
  }

  if (
    roundingMode ===
      "NEAREST_INTEGER" &&
    shell.valueKind ===
      "CURRENCY"
  ) {
    return (
      " Give your answer to the nearest pound."
    );
  }

  if (
    roundingMode ===
      "NEAREST_INTEGER" &&
    shell.valueKind ===
      "COUNT"
  ) {
    return (
      " Give your answer to the nearest whole number."
    );
  }

  return "";
}


function replaceAll(
  value: string,
  token: string,
  replacement: string
): string {
  return (
    value
      .split(
        token
      )
      .join(
        replacement
      )
  );
}


/**
 * SQA contextual questions commonly place each sentence
 * on its own line.
 *
 * We preserve that convention in the generated string.
 * PaperContent already renders newline characters as
 * explicit line breaks.
 */
function formatQuestionSentenceLines(
  value: string
): string {
  const normalised =
    value
      .replace(
        /[ \t]+/g,
        " "
      )
      .trim();

  return (
    normalised.replace(
      /([.!?])\s+(?=[A-Z£])/g,
      "$1\n"
    )
  );
}


function renderTemplate(args: {
  shell:
    ContextShell;

  stages:
    CompoundPercentageStage[];

  initialValue:
    number;

  startYear:
    number;

  targetYear:
    number;

  roundingMode:
    CompoundPercentageRoundingMode;
}): string {
  const {
    shell,
    stages,
    initialValue,
    startYear,
    targetYear,
    roundingMode,
  } = args;

  const template =
    chooseOne(
      shell.templates
    );

  const totalYears =
    stages.reduce(
      (
        sum,
        stage
      ) =>
        sum +
        stage.periods,

      0
    );

  const firstStage =
    stages[0];

  const secondStage =
    stages[1];

  const replacements:
    Record<
      string,
      string
    > = {
      "{number}":
        formatNumberWithCommas(
          initialValue
        ),

      "{money}":
        `£${formatNumberWithCommas(
          initialValue
        )}`,

      "{rate}":
        formatPercentage(
          firstStage
            .percentageValue
        ),

      "{years}":
        String(
          totalYears
        ),

      "{year}":
        String(
          startYear
        ),

      "{targetYear}":
        String(
          targetYear
        ),

      "{firstRate}":
        formatPercentage(
          firstStage
            .percentageValue
        ),

      "{laterRate}":
        secondStage
          ? formatPercentage(
              secondStage
                .percentageValue
            )
          : "",

      "{laterYears}":
        secondStage
          ? String(
              secondStage
                .periods
            )
          : "",

      "{totalYears}":
        String(
          totalYears
        ),

      "{rounding}":
        roundingInstruction(
          shell,
          roundingMode
        ),

      "{name}":
        chooseOne(
          NAMES
        ),
    };

  let result =
    template;

  for (
    const [
      token,
      replacement,
    ]
    of Object.entries(
      replacements
    )
  ) {
    result =
      replaceAll(
        result,
        token,
        replacement
      );
  }

  return (
    formatQuestionSentenceLines(
      result
    )
  );
}


function formatAnswerText(args: {
  shell:
    ContextShell;

  requestedAnswer:
    number;

  currencyDisplayDecimals?:
    | 0
    | 2;
}): string {
  const {
    shell,
    requestedAnswer,
    currencyDisplayDecimals,
  } = args;

  if (
    shell.valueKind ===
    "CURRENCY"
  ) {
    const decimals =
      currencyDisplayDecimals ===
        2
        ? 2
        : 0;

    return (
      `£${formatNumberWithCommas(
        requestedAnswer,
        decimals
      )}`
    );
  }

  if (
    shell.valueKind ===
    "COUNT"
  ) {
    return (
      formatNumberWithCommas(
        requestedAnswer,
        0
      )
    );
  }

  const number =
    formatNumberWithCommas(
      requestedAnswer
    );

  if (
    shell.unit
  ) {
    return (
      `${number} ${shell.unit}`
    );
  }

  return number;
}


function buildWorkingSummary(
  initialValue: number,
  stages:
    CompoundPercentageStage[],
  requestedAnswer: number
): string {
  const stageExpression =
    stages
      .map(
        (stage) => {
          const multiplier =
            trimDecimalString(
              stage.multiplier,
              6
            );

          if (
            stage.periods ===
            1
          ) {
            return (
              `× ${multiplier}`
            );
          }

          return (
            `× ${multiplier}^${stage.periods}`
          );
        }
      )
      .join(
        " "
      );

  return (
    `${formatNumberWithCommas(
      initialValue
    )} ${stageExpression} = ${formatNumberWithCommas(
      requestedAnswer
    )}`
  );
}


function buildScenario(
  shell:
    ContextShell,
  difficulty:
    CompoundPercentageDifficulty
): GeneratedScenario {
  /**
   * Some rate/period/context combinations cannot produce
   * an appropriately tidy result within the shell's
   * realistic starting-value range.
   *
   * In that case we simply draw another mathematically
   * valid rate/period combination rather than accepting
   * an artificial calculator-dump result.
   */
  for (
    let attempt = 0;
    attempt < 150;
    attempt += 1
  ) {
    const stages =
      buildStages(
        shell,
        difficulty
      );

    const initial =
      buildInitialValue(
        shell,
        stages,
        difficulty
      );

    if (
      !initial
    ) {
      continue;
    }

    const unroundedFinalValue =
      calculateFinalValue(
        initial.value,
        stages
      );

    if (
      resultDecimalPlaces(
        unroundedFinalValue
      ) >
      MAX_RESULT_DECIMAL_PLACES
    ) {
      continue;
    }

    const rounding =
      determineRounding({
        shell,
        unroundedFinalValue,
      });

    const totalPeriods =
      stages.reduce(
        (
          sum,
          stage
        ) =>
          sum +
          stage.periods,

        0
      );

    const startYear =
      randomInt(
        2018,
        2024
      );

    const targetYear =
      startYear +
      totalPeriods;

    const questionText =
      renderTemplate({
        shell,
        stages,
        initialValue:
          initial.value,
        startYear,
        targetYear,
        roundingMode:
          rounding.roundingMode,
      });

    return {
      contextTemplateId:
        shell.id,

      direction:
        familyDirection(
          shell.family
        ),

      stages,

      initialValue:
        initial.value,

      roundingMode:
        rounding.roundingMode,

      roundingExplicitInPrompt:
        rounding.roundingExplicitInPrompt,

      valueKind:
        shell.valueKind,

      currencyDisplayDecimals:
        rounding.currencyDisplayDecimals,

      unit:
        shell.unit,

      startYear:
        shell.usesDates
          ? startYear
          : undefined,

      targetYear:
        shell.usesDates
          ? targetYear
          : undefined,

      questionText,

      friendlyArithmetic:
        initial.friendlyArithmetic,
    };
  }

  throw new Error(
    `Unable to construct a tidy compound-percentage scenario for context shell ${shell.id}.`
  );
}


function buildChecks(args: {
  familyId:
    CompoundPercentageFamilyId;

  scenario:
    GeneratedScenario;

  unroundedFinalValue:
    number;

  requestedAnswer:
    number;
}): {
  label: string;
  passed: boolean;
  detail: string;
}[] {
  const sourceCount =
    sourceQuestionCountForFamily(
      args.familyId
    );

  const rates =
    args.scenario.stages.map(
      (stage) =>
        stage.percentageValue
    );

  const totalPeriods =
    args.scenario.stages.reduce(
      (
        sum,
        stage
      ) =>
        sum +
        stage.periods,

      0
    );

  const multipliersValid =
    args.scenario.stages.every(
      (stage) =>
        args.scenario.direction ===
          "INCREASE"
          ? stage.multiplier >
            1
          : (
              stage.multiplier >
                0 &&
              stage.multiplier <
                1
            )
    );

  const multiRateValid =
    args.familyId !==
      "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE" ||
    (
      args.scenario.stages.length ===
        2 &&
      args.scenario.stages[0]
        .percentageValue !==
        args.scenario.stages[1]
          .percentageValue
    );

  const decimalPlacesUsed =
    resultDecimalPlaces(
      args.unroundedFinalValue
    );

  return [
    {
      label:
        "Historical family evidence",

      passed:
        sourceCount > 0,

      detail:
        `${sourceCount} historical question${
          sourceCount === 1
            ? ""
            : "s"
        } catalogued for this family.`,
    },

    {
      label:
        "Compound period count",

      passed:
        totalPeriods >=
          2 &&
        totalPeriods <=
          4,

      detail:
        `${totalPeriods} compound periods generated.`,
    },

    {
      label:
        "Historical rate envelope",

      passed:
        rates.every(
          (rate) =>
            rate >= 2 &&
            rate <= 26
        ),

      detail:
        `Rate(s): ${rates.join(
          "%, "
        )}%.`,
    },

    {
      label:
        "Multiplier direction",

      passed:
        multipliersValid,

      detail:
        args.scenario.direction ===
          "INCREASE"
          ? "Increase multipliers are greater than 1."
          : "Decrease multipliers lie between 0 and 1.",
    },

    {
      label:
        "Multi-rate structure",

      passed:
        multiRateValid,

      detail:
        args.familyId ===
          "NUM_COMPOUND_PERCENTAGE_MULTI_RATE_DECREASE"
          ? "Two distinct sequential depreciation rates are used."
          : "A single rate is compounded repeatedly.",
    },

    {
      label:
        "Natural numerical precision",

      passed:
        decimalPlacesUsed <=
        MAX_RESULT_DECIMAL_PLACES,

      detail:
        `The unrounded result requires ${decimalPlacesUsed} decimal place${
          decimalPlacesUsed === 1
            ? ""
            : "s"
        }.`,
    },

    {
      label:
        "Positive finite result",

      passed:
        Number.isFinite(
          args.unroundedFinalValue
        ) &&
        args.unroundedFinalValue >
          0 &&
        Number.isFinite(
          args.requestedAnswer
        ) &&
        args.requestedAnswer >
          0,

      detail:
        `Unrounded result: ${roundTo(
          args.unroundedFinalValue,
          MAX_RESULT_DECIMAL_PLACES
        )}.`,
    },

    {
      label:
        "Forward percentage change",

      passed:
        true,

      detail:
        "The original amount is known and percentage change is applied forward through time; this is not a reverse-percentage question.",
    },
  ];
}


function makeGeneratedId(): string {
  return (
    `compound-percent-${Date.now()}-${Math.random()
      .toString(36)
      .slice(
        2,
        10
      )}`
  );
}


function buildGeneratedQuestion(
  familyId:
    CompoundPercentageFamilyId,
  difficulty:
    CompoundPercentageDifficulty
): GeneratedCompoundPercentageQuestion {
  const shell =
    chooseShell(
      familyId
    );

  const scenario =
    buildScenario(
      shell,
      difficulty
    );

  const unroundedFinalValue =
    calculateFinalValue(
      scenario.initialValue,
      scenario.stages
    );

  const requestedAnswer =
    requestedAnswerForScenario({
      shell,
      unroundedFinalValue,
      roundingMode:
        scenario.roundingMode,
      currencyDisplayDecimals:
        scenario.currencyDisplayDecimals,
    });

  const answerText =
    formatAnswerText({
      shell,
      requestedAnswer,
      currencyDisplayDecimals:
        scenario.currencyDisplayDecimals,
    });

  const totalPeriods =
    scenario.stages.reduce(
      (
        sum,
        stage
      ) =>
        sum +
        stage.periods,

      0
    );

  const rates =
    scenario.stages.map(
      (stage) =>
        stage.percentageValue
    );

  const sourceFamilyEvidenceCount =
    sourceQuestionCountForFamily(
      familyId
    );

  const sourceCorpusSize =
    compoundSourceCorpusSize();

  const checks =
    buildChecks({
      familyId,
      scenario,
      unroundedFinalValue,
      requestedAnswer,
    });

  return {
    id:
      makeGeneratedId(),

    familyId,

    difficulty,

    questionText:
      scenario.questionText,

    answerText,

    workingSummary:
      buildWorkingSummary(
        scenario.initialValue,
        scenario.stages,
        requestedAnswer
      ),

    numericProfile: {
      kind:
        scenario.stages.length >
        1
          ? "MULTI_RATE"
          : "FIXED_RATE",

      direction:
        scenario.direction,

      stages:
        scenario.stages,

      initialValue:
        scenario.initialValue,

      totalPeriods,

      unroundedFinalValue,

      requestedAnswer,

      roundingMode:
        scenario.roundingMode,

      roundingExplicitInPrompt:
        scenario.roundingExplicitInPrompt,

      valueKind:
        scenario.valueKind,

      currencyDisplayDecimals:
        scenario.currencyDisplayDecimals,

      unit:
        scenario.unit,

      contextTemplateId:
        scenario.contextTemplateId,

      startYear:
        scenario.startYear,

      targetYear:
        scenario.targetYear,
    },

    sourceEvidenceSummary:
      `${sourceFamilyEvidenceCount} historical source question${
        sourceFamilyEvidenceCount ===
          1
          ? ""
          : "s"
      } in this family; ${sourceCorpusSize} compound-percentage source questions in the 2014–2025 catalogue. The surface generator contains ${CONTEXT_SHELLS.length} contextual shells while preserving the historically evidenced mathematical families.`,

    checks,

    metrics: {
      sourceFamilyEvidenceCount,

      sourceCorpusSize,

      totalPeriods,

      rateCount:
        scenario.stages.length,

      minimumPercentageRate:
        Math.min(
          ...rates
        ),

      maximumPercentageRate:
        Math.max(
          ...rates
        ),

      initialValue:
        scenario.initialValue,

      unroundedFinalValue,

      resultDecimalPlaces:
        resultDecimalPlaces(
          unroundedFinalValue
        ),

      contextTemplateId:
        scenario.contextTemplateId,

      contextPoolSize:
        CONTEXT_SHELLS.length,

      decimalRateUsed:
        rates.some(
          (rate) =>
            !Number.isInteger(
              rate
            )
        ),

      friendlyArithmetic:
        scenario.friendlyArithmetic,

      calculatorNatural:
        true,
    },
  };
}


export function generateN5MathsCompoundPercentageQuestion(
  options:
    CompoundPercentageGeneratorOptions = {}
): GeneratedCompoundPercentageQuestion {
  const difficulty =
    options.difficulty ??
    2;

  /**
   * A particular randomly selected context shell can
   * occasionally be incompatible with a tidy numerical
   * construction at the selected difficulty.
   *
   * Rather than relaxing the precision requirement, draw
   * another shell/family combination.
   */
  for (
    let attempt = 0;
    attempt < 200;
    attempt += 1
  ) {
    try {
      const familyId =
        chooseFamilyId(
          options,
          difficulty
        );

      const generated =
        buildGeneratedQuestion(
          familyId,
          difficulty
        );

      if (
        generated.checks.every(
          (check) =>
            check.passed
        )
      ) {
        return generated;
      }
    } catch {
      /**
       * Retry with another valid random construction.
       */
    }
  }

  throw new Error(
    "Unable to generate a valid National 5 compound-percentage question after 200 attempts."
  );
}


export function generateN5MathsCompoundPercentageSamples(
  sampleCount = 20,
  options:
    CompoundPercentageGeneratorOptions = {}
): GeneratedCompoundPercentageQuestion[] {
  return (
    Array.from(
      {
        length:
          sampleCount,
      },

      () =>
        generateN5MathsCompoundPercentageQuestion(
          options
        )
    )
  );
}