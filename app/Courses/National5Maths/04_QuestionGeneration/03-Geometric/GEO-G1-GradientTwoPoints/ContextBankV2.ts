import type { G1ContextProfile } from "./Types";

export type RationalSeed = readonly [numerator: number, denominator: number];

export type G1ContextRecipeV2 = {
  context: G1ContextProfile;
  direction: "POSITIVE" | "NEGATIVE";
  lowerGradients: readonly RationalSeed[];
  upperGradients: readonly RationalSeed[];
  intercepts: readonly RationalSeed[];
  xScale: number;
};

export type G1BestFitRecipeV2 = {
  context: G1ContextProfile;
  direction: "POSITIVE" | "NEGATIVE";
  xValues: readonly number[];
  gradients: readonly RationalSeed[];
  intercepts: readonly RationalSeed[];
  scatterOffsets: readonly number[];
  xTick: number;
  yTick: number;
};

const context = (
  domainId: string,
  introduction: string,
  xDescription: string,
  yDescription: string,
  xVariable: string,
  yVariable: string,
  xUnit: string,
  yUnit: string,
): G1ContextProfile => ({ domainId, introduction, xDescription, yDescription, xVariable, yVariable, xUnit, yUnit });

const POS_SIMPLE: readonly RationalSeed[] = [[1, 2], [3, 2], [1, 4], [1, 5]];
const POS_HARD: readonly RationalSeed[] = [[5, 4], [7, 4], [5, 3], [7, 5], [9, 4]];
const NEG_SIMPLE: readonly RationalSeed[] = [[-1, 2], [-3, 2], [-1, 4], [-1, 5]];
const NEG_HARD: readonly RationalSeed[] = [[-5, 4], [-7, 4], [-5, 3], [-7, 5], [-9, 4]];
const MONEY_INTERCEPTS: readonly RationalSeed[] = [[2, 1], [5, 2], [3, 1], [7, 2], [4, 1], [9, 2], [5, 1]];
const GENERAL_INTERCEPTS: readonly RationalSeed[] = [[4, 1], [11, 2], [6, 1], [15, 2], [8, 1], [19, 2], [10, 1]];

/**
 * Thirty-two deterministic contexts. The bank is intentionally broad so that
 * repeated use feels like a new question rather than a reskinned template.
 * Every relationship is one which can plausibly be described by a straight-line
 * model over the limited interval used in the generated question.
 */
export const G1_CONTEXT_RECIPES_V2: readonly G1ContextRecipeV2[] = [
  { context: context("TAXI_FARE", "A taxi fare is made up of a fixed charge and a charge for the distance travelled.", "distance travelled", "taxi fare", "d", "P", "miles", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("COURIER_CHARGE", "A courier company charges a fixed booking fee and an additional amount for each kilometre travelled.", "delivery distance", "delivery charge", "d", "C", "km", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 5]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("WEEKLY_WAGE", "An employee is paid a basic weekly wage together with commission on sales.", "sales", "weekly wage", "S", "W", "pounds", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 20], [1, 25], [1, 40]], upperGradients: [[3, 50], [7, 100], [9, 100]], intercepts: [[125, 1], [275, 2], [150, 1], [325, 2], [175, 1]], xScale: 100 },
  { context: context("WATER_DRAIN", "Water is drained from a storage tank at a steady rate.", "time elapsed", "volume of water remaining", "t", "V", "minutes", "litres"), direction: "NEGATIVE", lowerGradients: [[-3, 2], [-1, 2]], upperGradients: [[-7, 4], [-5, 3]], intercepts: [[180, 1], [385, 2], [205, 1], [435, 2], [230, 1]], xScale: 2 },
  { context: context("BATTERY_DRAIN", "A device battery loses charge at a steady rate while it is in use.", "time in use", "battery charge remaining", "t", "B", "hours", "percent"), direction: "NEGATIVE", lowerGradients: [[-3, 2], [-1, 2]], upperGradients: [[-7, 4], [-9, 4]], intercepts: [[90, 1], [185, 2], [95, 1], [195, 2], [100, 1]], xScale: 1 },
  { context: context("CAR_PARK_CHARGE", "A car park charges an entry fee and then a fixed amount for each hour parked.", "parking time", "parking charge", "t", "C", "hours", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[7, 4], [9, 4]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("BIKE_HIRE_CHARGE", "A bicycle-hire company charges a fixed booking amount plus a charge for each hour of hire.", "hire time", "total hire charge", "t", "C", "hours", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("TOOL_HIRE_CHARGE", "A tool-hire shop charges a fixed deposit fee and a further amount for each day of hire.", "hire duration", "hire charge", "d", "H", "days", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[8, 1], [19, 2], [11, 1], [25, 2]], xScale: 1 },
  { context: context("PRINTER_CHARGE", "A print shop charges a set-up fee and a fixed amount for each batch printed.", "number of batches", "total print charge", "b", "P", "batches", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 5]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("CATERING_CHARGE", "A caterer charges a fixed preparation fee together with a charge for each guest.", "number of guests", "total catering charge", "n", "C", "guests", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 2], [3, 2]], upperGradients: [[7, 4], [9, 4]], intercepts: [[20, 1], [45, 2], [25, 1], [55, 2], [30, 1]], xScale: 2 },
  { context: context("VENUE_HIRE_CHARGE", "A venue charges a fixed booking fee and a charge for each hour used.", "time hired", "total venue charge", "t", "V", "hours", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[25, 1], [55, 2], [30, 1], [65, 2]], xScale: 1 },
  { context: context("MOBILE_DATA_CHARGE", "A mobile-data plan has a fixed monthly charge and an additional charge for each gigabyte used.", "data used", "monthly charge", "g", "C", "GB", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 2], [1, 4]], upperGradients: [[5, 4], [7, 5]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("COACH_HIRE_CHARGE", "A coach company charges a fixed booking fee and an amount for each mile travelled.", "journey distance", "coach hire charge", "d", "C", "miles", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 4], [1, 5]], upperGradients: [[5, 4], [7, 5]], intercepts: [[40, 1], [85, 2], [45, 1], [95, 2]], xScale: 5 },
  { context: context("STORAGE_CHARGE", "A storage company charges a fixed administration fee plus a weekly charge for each crate stored.", "number of crates", "weekly storage charge", "n", "C", "crates", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 2], [3, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("MEMBERSHIP_CHARGE", "A sports centre charges a monthly membership fee plus a fixed amount for each booked session.", "number of sessions", "monthly cost", "n", "C", "sessions", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 2], [3, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[12, 1], [25, 2], [14, 1], [31, 2]], xScale: 1 },
  { context: context("FUEL_REMAINING", "A vehicle uses fuel at a steady rate during a journey.", "distance travelled", "fuel remaining", "d", "F", "km", "litres"), direction: "NEGATIVE", lowerGradients: [[-1, 2], [-1, 5]], upperGradients: [[-5, 4], [-7, 5]], intercepts: [[45, 1], [95, 2], [50, 1], [105, 2], [55, 1]], xScale: 2 },
  { context: context("STOCK_REMAINING", "A shop sells identical packs at a steady rate during a promotion.", "packs sold", "packs remaining", "n", "R", "packs", "packs"), direction: "NEGATIVE", lowerGradients: [[-1, 2], [-3, 2]], upperGradients: [[-5, 4], [-7, 4]], intercepts: [[80, 1], [165, 2], [90, 1], [185, 2]], xScale: 2 },
  { context: context("INK_REMAINING", "A printer uses ink at a steady rate while printing identical pages.", "pages printed", "ink remaining", "p", "I", "pages", "ml"), direction: "NEGATIVE", lowerGradients: [[-1, 20], [-1, 25]], upperGradients: [[-3, 50], [-7, 100]], intercepts: [[50, 1], [105, 2], [55, 1], [115, 2]], xScale: 100 },
  { context: context("DISTANCE_REMAINING", "A runner travels at a steady speed towards the finish of a route.", "time elapsed", "distance remaining", "t", "D", "minutes", "km"), direction: "NEGATIVE", lowerGradients: [[-1, 2], [-3, 2]], upperGradients: [[-5, 4], [-7, 4]], intercepts: [[20, 1], [45, 2], [25, 1], [55, 2]], xScale: 1 },
  { context: context("SAVINGS_BALANCE", "A saver starts with an initial amount and then adds the same amount each month.", "number of months", "savings balance", "m", "S", "months", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[7, 4], [9, 4]], intercepts: [[100, 1], [225, 2], [125, 1], [275, 2]], xScale: 5 },
  { context: context("CHARITY_TOTAL", "A charity event begins with a fixed sponsorship amount and adds the same amount for each completed lap.", "laps completed", "money raised", "n", "M", "laps", "pounds"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[25, 1], [55, 2], [30, 1], [65, 2]], xScale: 2 },
  { context: context("WATER_TANK_FILL", "Water flows into a tank at a steady rate.", "time elapsed", "volume of water", "t", "V", "minutes", "litres"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[30, 1], [65, 2], [35, 1], [75, 2]], xScale: 2 },
  { context: context("RESERVOIR_FILL", "A small reservoir receives water at a steady measured rate.", "time elapsed", "stored volume", "t", "V", "hours", "m3"), direction: "POSITIVE", lowerGradients: [[1, 2], [3, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[60, 1], [125, 2], [65, 1], [135, 2]], xScale: 2 },
  { context: context("CONSTANT_SPEED_DISTANCE", "A vehicle travels along a straight road at a constant speed.", "time travelled", "distance from the start", "t", "D", "hours", "km"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[7, 4], [9, 4]], intercepts: [[5, 1], [11, 2], [10, 1], [21, 2]], xScale: 5 },
  { context: context("HEATING_TEMPERATURE", "A laboratory heater raises the temperature at a steady rate over a short interval.", "time elapsed", "temperature", "t", "T", "minutes", "°C"), direction: "POSITIVE", lowerGradients: [[1, 2], [3, 2]], upperGradients: [[5, 4], [7, 4]], intercepts: [[18, 1], [39, 2], [21, 1], [45, 2]], xScale: 1 },
  { context: context("COOLING_TEMPERATURE", "A cooling process lowers the temperature at a steady rate over the interval shown.", "time elapsed", "temperature", "t", "T", "minutes", "°C"), direction: "NEGATIVE", lowerGradients: [[-1, 2], [-3, 2]], upperGradients: [[-5, 4], [-7, 4]], intercepts: [[80, 1], [165, 2], [90, 1], [185, 2]], xScale: 1 },
  { context: context("SPRING_LENGTH", "Over the measured range, a spring length increases linearly with the load attached.", "load", "spring length", "L", "S", "N", "cm"), direction: "POSITIVE", lowerGradients: [[1, 2], [1, 4]], upperGradients: [[5, 4], [7, 5]], intercepts: GENERAL_INTERCEPTS, xScale: 1 },
  { context: context("PRODUCTION_OUTPUT", "A machine begins with a completed stock amount and then produces items at a steady rate.", "time running", "total items produced", "t", "N", "hours", "items"), direction: "POSITIVE", lowerGradients: [[3, 2], [1, 2]], upperGradients: [[7, 4], [9, 4]], intercepts: [[20, 1], [45, 2], [25, 1], [55, 2]], xScale: 2 },
  { context: context("RECIPE_MASS", "A food producer uses a fixed container mass plus the same amount of mixture for each portion.", "number of portions", "total mass", "n", "M", "portions", "kg"), direction: "POSITIVE", lowerGradients: [[1, 2], [1, 4]], upperGradients: [[5, 4], [7, 5]], intercepts: [[1, 2], [3, 4], [1, 1], [5, 4]], xScale: 1 },
  { context: context("WATER_BILL", "A water bill contains a fixed service charge plus a charge for each unit of water used.", "water used", "bill total", "u", "B", "units", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 2], [1, 4]], upperGradients: [[5, 4], [7, 5]], intercepts: MONEY_INTERCEPTS, xScale: 1 },
  { context: context("ELECTRICITY_BILL", "An electricity bill contains a fixed standing charge plus a charge for each unit of electricity used.", "electricity used", "bill total", "u", "B", "units", "pounds"), direction: "POSITIVE", lowerGradients: [[1, 20], [1, 25]], upperGradients: [[3, 50], [7, 100]], intercepts: [[10, 1], [21, 2], [12, 1], [25, 2]], xScale: 100 },
  { context: context("LOAN_BALANCE", "A loan balance is reduced by the same repayment amount each month over the interval shown.", "number of repayments", "loan balance", "n", "L", "months", "pounds"), direction: "NEGATIVE", lowerGradients: [[-1, 2], [-3, 2]], upperGradients: [[-5, 4], [-7, 4]], intercepts: [[500, 1], [1025, 2], [550, 1], [1125, 2]], xScale: 10 },
] as const;

/** Sixteen statistical contexts used by the best-fit wrapper. */
export const G1_BEST_FIT_RECIPES_V2: readonly G1BestFitRecipeV2[] = [
  { context: context("ENGINE_FUEL", "A motoring study compares engine size with fuel consumption for several cars.", "engine size", "fuel consumption", "E", "F", "litres", "km/litre"), direction: "NEGATIVE", xValues: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5], gradients: [[-2, 1], [-3, 1]], intercepts: [[37, 2], [20, 1], [43, 2]], scatterOffsets: [-2, -1, 1, 2], xTick: 0.5, yTick: 2 },
  { context: context("RALLY_DISTANCE", "During a timed route, measurements compare elapsed time with the distance still to travel.", "time elapsed", "distance remaining", "T", "D", "minutes", "km"), direction: "NEGATIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[-2, 1], [-3, 1]], intercepts: [[28, 1], [32, 1], [36, 1]], scatterOffsets: [-3, -2, 2, 3], xTick: 1, yTick: 4 },
  { context: context("CALF_GROWTH", "A farmer records the age and mass of several young animals.", "age", "mass", "A", "W", "weeks", "kg"), direction: "POSITIVE", xValues: [2, 4, 6, 8, 10, 12, 14, 16], gradients: [[2, 1], [3, 1]], intercepts: [[6, 1], [10, 1], [14, 1]], scatterOffsets: [-6, -4, 4, 6], xTick: 2, yTick: 10 },
  { context: context("SUNLIGHT_GROWTH", "A researcher compares daily sunlight with plant growth for a group of plants.", "daily sunlight", "growth", "H", "G", "hours", "mm"), direction: "POSITIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[2, 1], [3, 1]], intercepts: [[10, 1], [12, 1], [16, 1]], scatterOffsets: [-3, -2, 2, 3], xTick: 1, yTick: 5 },
  { context: context("MACHINE_EFFICIENCY", "Measurements compare the age of several machines with an efficiency score.", "machine age", "efficiency score", "A", "E", "years", "points"), direction: "NEGATIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[-2, 1], [-3, 1]], intercepts: [[40, 1], [44, 1], [48, 1]], scatterOffsets: [-3, -2, 2, 3], xTick: 1, yTick: 4 },
  { context: context("STUDY_SCORE", "A study compares revision time with test score for a group of pupils.", "revision time", "test score", "T", "S", "hours", "marks"), direction: "POSITIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[3, 1], [4, 1]], intercepts: [[18, 1], [20, 1], [24, 1]], scatterOffsets: [-4, -2, 2, 4], xTick: 1, yTick: 5 },
  { context: context("RAINFALL_LEVEL", "Measurements compare rainfall with river level at several observation times.", "rainfall", "river level", "R", "L", "mm", "cm"), direction: "POSITIVE", xValues: [5, 10, 15, 20, 25, 30, 35, 40], gradients: [[1, 2], [1, 1]], intercepts: [[10, 1], [15, 1], [20, 1]], scatterOffsets: [-4, -2, 2, 4], xTick: 5, yTick: 5 },
  { context: context("EXERCISE_PULSE", "Data compare weekly exercise time with resting pulse rate for a group of adults.", "weekly exercise", "resting pulse rate", "H", "R", "hours", "beats/min"), direction: "NEGATIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[-2, 1], [-3, 1]], intercepts: [[70, 1], [72, 1], [76, 1]], scatterOffsets: [-4, -2, 2, 4], xTick: 1, yTick: 5 },
  { context: context("CAR_AGE_VALUE", "A survey compares the age of several cars with their resale value.", "car age", "resale value", "A", "V", "years", "thousand pounds"), direction: "NEGATIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[-2, 1], [-3, 1]], intercepts: [[28, 1], [30, 1], [34, 1]], scatterOffsets: [-3, -2, 2, 3], xTick: 1, yTick: 5 },
  { context: context("HEIGHT_ARM_SPAN", "A survey compares height with arm span for a group of people.", "height", "arm span", "H", "A", "cm", "cm"), direction: "POSITIVE", xValues: [140, 145, 150, 155, 160, 165, 170, 175], gradients: [[1, 1], [2, 1]], intercepts: [[5, 1], [10, 1], [15, 1]], scatterOffsets: [-6, -3, 3, 6], xTick: 5, yTick: 10 },
  { context: context("ADVERTISING_SALES", "A business compares advertising spend with weekly sales over several weeks.", "advertising spend", "weekly sales", "A", "S", "hundreds of pounds", "thousand pounds"), direction: "POSITIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[2, 1], [3, 1]], intercepts: [[8, 1], [10, 1], [12, 1]], scatterOffsets: [-3, -2, 2, 3], xTick: 1, yTick: 4 },
  { context: context("COMMUTE_TIME", "A travel survey compares journey distance with commuting time for several journeys.", "journey distance", "commuting time", "D", "T", "km", "minutes"), direction: "POSITIVE", xValues: [2, 4, 6, 8, 10, 12, 14, 16], gradients: [[2, 1], [3, 1]], intercepts: [[5, 1], [10, 1], [15, 1]], scatterOffsets: [-4, -2, 2, 4], xTick: 2, yTick: 5 },
  { context: context("HOUSE_AGE_EFFICIENCY", "A housing study compares property age with an energy-efficiency score.", "property age", "efficiency score", "A", "E", "years", "points"), direction: "NEGATIVE", xValues: [5, 10, 15, 20, 25, 30, 35, 40], gradients: [[-1, 1], [-2, 1]], intercepts: [[90, 1], [100, 1], [110, 1]], scatterOffsets: [-5, -3, 3, 5], xTick: 5, yTick: 10 },
  { context: context("SLEEP_REACTION", "A study compares sleep duration with reaction time for a group of adults.", "sleep duration", "reaction time", "H", "R", "hours", "ms"), direction: "NEGATIVE", xValues: [4, 5, 6, 7, 8, 9, 10, 11], gradients: [[-10, 1], [-15, 1]], intercepts: [[400, 1], [450, 1], [500, 1]], scatterOffsets: [-20, -10, 10, 20], xTick: 1, yTick: 25 },
  { context: context("TEMPERATURE_ICECREAM", "A shop compares daily temperature with the number of ice creams sold.", "temperature", "ice creams sold", "T", "N", "°C", "items"), direction: "POSITIVE", xValues: [10, 12, 14, 16, 18, 20, 22, 24], gradients: [[3, 1], [4, 1]], intercepts: [[5, 1], [10, 1], [15, 1]], scatterOffsets: [-8, -4, 4, 8], xTick: 2, yTick: 10 },
  { context: context("SCREEN_TIME_SLEEP", "A survey compares evening screen time with hours of sleep for a group of pupils.", "screen time", "sleep duration", "T", "H", "hours", "hours"), direction: "NEGATIVE", xValues: [1, 2, 3, 4, 5, 6, 7, 8], gradients: [[-1, 2], [-1, 1]], intercepts: [[10, 1], [11, 1], [12, 1]], scatterOffsets: [-1, -0.5, 0.5, 1], xTick: 1, yTick: 1 },
] as const;
