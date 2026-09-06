# G1 Gradient from two points — question generation

This folder owns executable manufacture for the reviewed G1 coordinate-gradient skill.

## Generic occurrence prior

The generic G1 family is not an equal-weight mixed bag. Reviewed occurrence counts are used as the starting prior:

- `LINE_EQUATION_FROM_TWO_POINTS` — 4 of 12 reviewed appearances.
- `CONTEXTUAL_LINEAR_MODEL` — 2 of 12.
- `BEST_FIT_LINEAR_MODEL` — 5 of 12.
- `SYMBOLIC_GRADIENT_FROM_TWO_POINTS` — 1 of 12.

On Paper 1 this becomes a 4:2:5 prior across line, deterministic-context and best-fit families. The rare symbolic family occupies the single reviewed Paper 2 appearance. These are calibration priors rather than claims about future assessment probability.

## Supported generation families

- `LINE_EQUATION_FROM_TWO_POINTS` — core three-mark Paper 1 line construction from direct coordinates or a sparse coordinate diagram. The source-centred lower band uses compact integer arithmetic; a smaller upper band uses simple exact fractional gradients with denominators 2–5.
- `CONTEXTUAL_LINEAR_MODEL` — supported four-mark Paper 1 deterministic straight-line model. Contexts must be genuinely linear, variables/units are explicit, the final equation must use the contextual variable letters, and the fourth mark is a direct G1-owned model calculation.
- `BEST_FIT_LINEAR_MODEL` — the three G1 model-construction marks can be generated, but the adjacent one-mark statistical component remains deliberately deferred. Labelled-point and graph-read surfaces retain their observed 3:2 surface prior.
- `SYMBOLIC_GRADIENT_FROM_TWO_POINTS` — experimental Paper 2 family using parameterised coordinates, factorisation and cancellation inside a coordinate-gradient route. Its generic weighting remains deliberately low because only one reviewed source supports it.

## Visual policy

Visual economy is part of the generation contract.

Coordinate diagrams and deterministic contextual diagrams are compact schematics: simple x/y or contextual-variable axes, small positive arrowheads, an origin marker, no gridlines, no readable intercept scale, two clear points and one straight line. Their purpose is to carry only the information the pupil actually needs.

Best-fit labelled-point surfaces are also visually restrained because the defining values are supplied in text. Only `BEST_FIT_GRID_READ_POINTS` receives a true scaled grid. That surface must contain exactly two intended scatter points on the supplied line, both on clean grid intersections, while every other scatter point lies off the line.

Positive/negative line direction is calibrated rather than accidental. The common line family is predominantly negative, while best-fit generation targets the reviewed two-negative/three-positive balance. Deterministic contexts include decreasing models only where the real-world scenario makes that direction sensible.

## Prompt policy

New information or a new instruction begins on a new line. The simplest-form instruction is separated from the main command. Contextual and best-fit questions explicitly require the final equation in the named contextual variables, because a generic `y = mx + c` form is not sufficient presentation for those surfaces.

## Ownership and dependency rules

The generator consumes reviewed synthesis from `03_SkillCatalog`; it does not inspect year folders directly and does not store historical wording, coordinates or artwork as templates.

Generated visual data is represented here as mathematical visual specifications. Production rendering remains owned by `06_VisualAssets`; the DeveloperTools renderer is diagnostic only. Every visual must consume the same mathematical state used by the prompt and answer generator so point positions, gradient, intercept and line equation cannot drift apart.

The best-fit family preserves the cross-skill boundary explicitly: three marks are G1, while the one-mark statistical estimate remains deferred rather than silently absorbed into G1.

## Key files

- `Types.ts` — generated question, mathematical state, visual-spec and quality contracts.
- `Calibration.ts` — reviewed family/surface support, historical occurrence weighting, source anchoring and overlap checks.
- `Difficulty.ts` — route-based lower/upper-band assessment.
- `PromptGrammar.ts` — independently authored, line-broken prompt surfaces and exact mathematical formatting.
- `Generator.ts` — deterministic seeded manufacture, realistic contexts, sign priors and batch diversity.
- `Validation.ts` — mathematical, ownership, visual-state and generation invariants.
- `Families/` — thin teacher/developer selectors over the single authoritative generator.

Question generation deliberately stops before answer manufacture. The answer layer consumes the exact `mathState` emitted here rather than re-deriving a second solution state.
