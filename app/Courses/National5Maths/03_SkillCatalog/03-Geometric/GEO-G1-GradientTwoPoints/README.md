# G1 - Gradient from two points / straight-line model

This directory is the reviewed cross-corpus SkillCatalog synthesis for canonical Skill `geo-g01-gradient-two-points`.

## Evidence boundary

`HistoricalEvidence.ts` imports the complete reviewed 2014-2025 G1 question/answer bank and projects it through the historical-only Question/Answer views before synthesis. No generation-only fields are allowed across that boundary.

## Reviewed families

The corpus separates four genuine G1 families:

- three-mark line equation from two points, using either direct text coordinates or an essential coordinate diagram;
- four-mark deterministic contextual straight-line models, where the follow-up calculation remains G1;
- best-fit/scattergraph wrappers, where the first three marks are G1 but the one-mark estimate is S2;
- a narrow A-standard symbolic-coordinate gradient family whose algebra remains subordinate to its geometric origin.

## Cross-skill ownership

Best-fit questions are not treated as wholly G1. Their historical mark structure is fixed as:

- 3 marks: G1, C-standard, Operational;
- 1 mark: S2, C-standard, Reasoning.

The S2 mark is retained in the SkillCatalog evidence and calibration because it controls the structure of the historical question wrapper, but standalone S2 generation policy is intentionally deferred.

## Generator-facing purpose

The files in this directory establish:

- complete historical evidence coverage and drift validation;
- recurring family and surface classifications;
- exact mathematical fingerprints for calibration;
- difficulty bands based on route/representation burden rather than Standard;
- visual-generation requirements for coordinate diagrams and graph-read surfaces;
- explicit ownership and generation invariants to be consumed by later QuestionGeneration and AnswerGeneration files.

Historical wording, artwork, data sets, coordinates and page layouts remain reference evidence only.
