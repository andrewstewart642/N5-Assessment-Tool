# N2 Indices Answer Generation

This folder is the single answer-generation owner for the N2 indices question engine in `04_QuestionGeneration/01-Numerical/NUM-N2-Indices/`.

The answer engine consumes the exact generated question state rather than reconstructing the mathematics independently. It therefore keeps each mark point, Standard classification, output-form requirement and worked method tied to the same mechanism and parameters used by question generation.

V1 supports all nine reviewed N2 mechanisms. Mark roles and C/A patterns are mechanism-specific; every mark remains Operational. Answer-only policy is also mechanism-specific rather than universal: the generated positive-power/product/quotient mechanism preserves the source-confirmed working-required/no-answer-only regime, while the other current mechanisms use the reviewed full-credit answer-only regime where supported by their calibration evidence.

`Calibration.ts` owns generated marking-policy profiles. `MarkPoints.ts` and `Methods.ts` derive the mark architecture and worked routes from the shared question state, while `Generator.ts` assembles the final marking scheme. `Validation.ts` checks question-answer agreement, and `Pairing.ts` is the supported entry point for matched generated assessment pairs used by Builder/developer-tool wiring.
