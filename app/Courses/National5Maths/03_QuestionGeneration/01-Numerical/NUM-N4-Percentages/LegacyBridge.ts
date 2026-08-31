/**
 * Preservation bridge for the trusted N4 percentage generators.
 *
 * N4.1 reverse percentage and N4.2/N4.2.1/N4.2.2 compound percentage
 * generation remain owned by the existing legacy implementations. The clean
 * architecture only provides the Builder-facing route so their established
 * behaviour and question feel are preserved exactly.
 *
 * The separate legacy N4.3 depreciation prototype is intentionally NOT
 * re-exported here; N4.2.2 is handled by the trusted appreciation/depreciation
 * generator shared with N4.2 and N4.2.1.
 */
export {
  ReversePercentagesConceptModule,
} from "../../../../National5MathsLegacy/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_1_PercentagesReverse";

export {
  AppreciationConceptModule,
} from "../../../../National5MathsLegacy/QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/Numerical/NQ_N5_NUM_N04_2_PercentagesAppreciation";
