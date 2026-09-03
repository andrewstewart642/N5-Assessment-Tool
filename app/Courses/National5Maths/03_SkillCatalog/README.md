# National 5 Mathematics Skill Catalog

`03_SkillCatalog` is the cross-corpus synthesis layer between historical evidence and generation.

## Ownership contract

- `01_QuestionCatalog` owns historical question evidence: what SQA asked.
- `02_AnswerCatalog` owns historical marking evidence: how marks were awarded, including mark ownership and source-backed classification.
- `03_SkillCatalog` owns reviewed cross-corpus synthesis: recurring families, calibration, difficulty mechanisms, surface patterns, generation envelopes and generator-facing invariants.
- `04_QuestionGeneration` and `05_AnswerGeneration` consume SkillCatalog rather than deriving cross-corpus policy independently from year folders.

## Dependency rule

`01_QuestionCatalog` and `02_AnswerCatalog` must never import from `03_SkillCatalog` or any generation layer. SkillCatalog may depend on historical-only catalogue views and shared core types. Generation may depend on SkillCatalog.

## Historical boundary rule

`03_SkillCatalog` must not accept the transitional full `QuestionCatalogEntry` or `AnswerCatalogEntry` contracts.

Raw year/question files are projected at the `01/02 -> 03` boundary through `toHistoricalQuestionCatalogView` and `toHistoricalAnswerCatalogView`. From that point onward SkillCatalog can see historical question/marking evidence only.

The boundary rejects generator-only or synthesis-only fields such as:

- Question `generation`, `parameterDesign` and `sourceIsolation`.
- Visual renderer-generation/originality/validation policy.
- Answer `consistency`, `generation` and `integrity`.

This is deliberate. If generator research needs a fact, that fact must first exist as legitimate historical evidence in `01` or `02`, then be synthesised in `03`.

## Cross-skill rule

A historical question is stored once in `01_QuestionCatalog` and once in `02_AnswerCatalog`. A SkillCatalog evidence set may include that same source question for every Skill that genuinely owns one or more marks. This does not duplicate the historical record; it creates another reviewed index/synthesis view over the same source files.

## Migration rule

The old master catalogue contracts remain temporarily available inside `01_QuestionCatalog` and `02_AnswerCatalog` while the existing corpus is migrated. New SkillCatalog code must use the historical-only boundary. Generator-facing and cross-corpus fields will be removed from migrated A7/A8 source factories before the same pattern is rolled across the remaining historical bank.

During staged migration, old synthesis-module locations or old numbered generation paths may remain as temporary compatibility mounts/re-export shims. New code must import the canonical SkillCatalog and generation paths. Remove a shim only after repository-wide consumers have been migrated and TypeScript/runtime checks pass.

## Current migration scope

A7 and A8 are the proof slices. Their `HistoricalEvidence.ts` files import the real one-question/one-marking-scheme bank, project those records into historical-only views, validate Question ↔ Answer linkage and tariff consistency, and then compare the curated cross-corpus summaries against that evidence.

Source-backed general marking policies remain in `02_AnswerCatalog` because they are historical marking evidence, not synthesis.
