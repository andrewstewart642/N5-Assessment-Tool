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
- `CONTEXTUAL_LINEAR_MODEL` — supported four-mark Paper 1 deterministic straight-line model. The second-pass bank contains 32 distinct deterministic domains, including both increasing and decreasing relationships. Lower-band questions may use transparent fractions such as `3/2` or unit fractions such as `1/20`; harder fractions such as `5/4`, `7/4` and `5/3` are reserved for the upper band. Terminating decimal intercepts are permitted as authentic presentation texture rather than being treated automatically as harder mathematics.
- `BEST_FIT_LINEAR_MODEL` — the complete historical-style two-part wrapper is generated. Part (a) carries the three G1 model-construction marks; part (b) is retained as the adjacent one-mark `stat-s02-linear-model` estimate. The S2 answer/mark-generation layer remains deferred, so the G1 answer engine still emits only the three G1 marks while preserving the cross-skill ownership metadata. Labelled-point and graph-read surfaces retain their observed 3:2 surface prior.
- `SYMBOLIC_GRADIENT_FROM_TWO_POINTS` — experimental Paper 2 family using parameterised coordinates, factorisation and cancellation inside a coordinate-gradient route. Its generic weighting remains deliberately low because only one reviewed source supports it; exact fractional presentation is preserved.

Across deterministic and statistical wrappers the second-pass context bank contains 48 independently authored domains so repeated generation does not collapse into a handful of reskinned stories.

## Visual policy

Visual economy is part of the generation contract.

Coordinate diagrams and deterministic contextual diagrams are compact schematics: simple x/y or contextual-variable axes, small positive arrowheads, an origin marker, no gridlines, no readable intercept scale, two clear points and one straight line. They are intentionally not scale-reading exercises. The diagnostic renderer compresses large coordinate magnitudes so points remain sensibly close to the origin and whitespace is not dictated by an unnecessary exact plotting scale. Point and coordinate labels are placed away from the line rather than allowed to sit through it.

Best-fit labelled-point surfaces are also visually restrained because the defining values are supplied in text. Only `BEST_FIT_GRID_READ_POINTS` receives a true scaled grid. Its axes begin at zero and use one uniform major-grid system. The generator does not insert point-specific gridlines. Exactly two scatter points lie on the fitted line, both at ordinary major-grid intersections, while every other scatter point lies off the line.

Positive/negative line direction is calibrated rather than accidental. The common line family is predominantly negative, best-fit generation targets the reviewed two-negative/three-positive balance, and deterministic contexts deliberately include physically meaningful decreasing models rather than defaulting to positive correlation.

## Prompt policy

New information or a new instruction begins on a new line. The simplest-form instruction is separated from the main command. Contextual and best-fit questions explicitly require the final equation in the named contextual variables, because a generic `y = mx + c` form is not sufficient presentation for those surfaces.

Contextual wrappers follow the information → diagram → point information → part (a) → part (b) flow. Best-fit wrappers follow the information → scattergraph → point-selection/point-information → part (a) → part (b) flow.

## Ownership and dependency rules

The generator consumes reviewed synthesis from `03_SkillCatalog`; it does not inspect year folders directly and does not store historical wording, coordinates or artwork as templates.

Generated visual data is represented here as mathematical visual specifications. Production rendering remains owned by `06_VisualAssets`; the DeveloperTools renderer is diagnostic only. Every visual must consume the same mathematical state used by the prompt and answer generator so point positions, gradient, intercept and line equation cannot drift apart.

The best-fit family preserves the cross-skill boundary explicitly: the wrapper contains all four question marks structurally, but only three are G1-owned. The one-mark statistical estimate is tagged to `stat-s02-linear-model` and remains outside the current G1 answer engine.

## Key files

- `Types.ts` — public generated-question, mathematical-state, visual-spec and quality contracts; currently routed through the reviewed second-pass definitions.
- `Calibration.ts` — reviewed family/surface support, historical occurrence weighting, source anchoring and overlap checks.
- `Difficulty.ts` — route-based lower/upper-band assessment, including the transparent-versus-demanding contextual fraction distinction.
- `ContextBankV2.ts` — broad deterministic and best-fit scenario bank.
- `PromptGrammar.ts` — independently authored, line-broken prompt surfaces, complete best-fit wrapper structure and exact mathematical formatting.
- `Generator.ts` — deterministic seeded manufacture, context/sign priors, uniform graph-read scales and batch diversity.
- `Validation.ts` — mathematical, ownership, visual-state, grid-read and composite-wrapper invariants.
- `Families/` — thin teacher/developer selectors over the single authoritative generator.

Question generation deliberately stops before answer manufacture. The answer layer consumes the exact `mathState` emitted here rather than re-deriving a second solution state.
