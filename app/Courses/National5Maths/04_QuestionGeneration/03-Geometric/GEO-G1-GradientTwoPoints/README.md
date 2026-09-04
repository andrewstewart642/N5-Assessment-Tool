# G1 Gradient from two points — question generation

This folder owns executable manufacture for the reviewed G1 coordinate-gradient skill.

## Supported generation families

- `LINE_EQUATION_FROM_TWO_POINTS` — core three-mark Paper 1 line construction from either direct coordinate pairs or an essential generated coordinate diagram.
- `CONTEXTUAL_LINEAR_MODEL` — supported four-mark Paper 1 deterministic straight-line model with a direct G1-owned follow-up calculation.
- `BEST_FIT_LINEAR_MODEL` — the three G1 model-construction marks can be generated for inspection, but the historical fourth mark belongs to the separate statistical skill and remains deliberately deferred.
- `SYMBOLIC_GRADIENT_FROM_TWO_POINTS` — experimental Paper 2 family using parameterised coordinates, factorisation and cancellation inside a coordinate-gradient route.

## Ownership and dependency rules

The generator consumes reviewed synthesis from `03_SkillCatalog`; it does not inspect year folders directly and does not store historical wording, coordinates or artwork as templates.

Generated coordinate and graph visuals are represented here as mathematical visual specifications only. Rendering belongs in `06_VisualAssets`. A coordinate diagram or scaled graph must be generated from the same mathematical state used by the prompt and future answer generator so point positions, gradient, intercept and line equation cannot drift apart.

The best-fit family preserves the reviewed cross-skill boundary explicitly: three marks are G1, while the one-mark statistical estimate is recorded as deferred rather than silently absorbed into G1.

## Key files

- `Types.ts` — generated question, mathematical state, visual-spec and quality contracts.
- `Calibration.ts` — reviewed family/surface support, source anchoring and historical-overlap checks.
- `Difficulty.ts` — route-based lower/upper-band assessment.
- `PromptGrammar.ts` — independently authored prompt surfaces and exact mathematical formatting.
- `Generator.ts` — deterministic seeded manufacture and batch diversity.
- `Validation.ts` — mathematical, ownership, visual-state and calibration invariants.
- `Families/` — thin teacher/developer selectors over the single authoritative generator.

Question generation deliberately stops before answer manufacture. The next layer must consume the exact `mathState` emitted here rather than re-deriving a second solution state.
