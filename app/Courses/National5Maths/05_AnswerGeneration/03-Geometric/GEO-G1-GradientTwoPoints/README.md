# G1 Gradient from Two Points — Answer Generation

This directory owns generated marking and worked-answer manufacture for the canonical G1 question engine.

The answer generator consumes the exact `mathState` produced by `04_QuestionGeneration/03-Geometric/GEO-G1-GradientTwoPoints/`; it does not regenerate coordinates, gradients, intercepts, contextual outputs or symbolic factors independently.

Supported generated answer architectures are:

- three-mark line equation from two points: gradient -> line position -> simplified equation;
- deterministic contextual model: the same three-mark line construction plus one G1 model-application mark;
- fitted-line model construction: three G1 marks only, with the historically adjacent statistical follow-up explicitly deferred;
- symbolic coordinate gradient: gradient quotient -> numerator factorisation -> denominator factor/cancel -> exact simplified gradient.

Generated marking uses one deliberate working-required regime rather than varying historical answer-only policy by seed. Historical source-local policy remains evidence in `02_AnswerCatalog`; this layer stores a reviewed generation policy derived from the cross-corpus synthesis.

Slope-intercept and point-slope routes are equivalent for numeric line construction. Coordinate subtraction order must remain consistent, exact fractional gradients are not replaced by decimal approximations, contextual variable names are retained where the generated question uses them, and follow-through requires mathematically coherent work of comparable difficulty.

The fitted-line family never emits the deferred statistical mark or answer. That boundary is represented explicitly in the generated marking scheme until the statistical generation layer is implemented.
