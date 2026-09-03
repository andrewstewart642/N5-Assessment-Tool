# National 5 Mathematics Skill Catalog

`03_SkillCatalog` is the cross-corpus synthesis layer between historical evidence and generation.

## Ownership contract

- `01_QuestionCatalog` owns historical question evidence: what SQA asked.
- `02_AnswerCatalog` owns historical marking evidence: how marks were awarded, including mark ownership and source-backed classification.
- `03_SkillCatalog` owns reviewed cross-corpus synthesis: recurring families, calibration, difficulty mechanisms, surface patterns, generation envelopes and generator-facing invariants.
- `04_QuestionGeneration` and `05_AnswerGeneration` consume SkillCatalog rather than deriving cross-corpus policy independently from year folders.

## Dependency rule

`01_QuestionCatalog` and `02_AnswerCatalog` must never import from `03_SkillCatalog` or any generation layer. SkillCatalog may depend on the historical catalogs and shared core types. Generation may depend on SkillCatalog.

## Historical-view rule

SkillCatalog does not consume the transitional catalogue entries directly as synthesis inputs.

- `QuestionCatalogHistoricalView` exposes historical question evidence while hiding top-level generator policy and generator-writing notes.
- `AnswerCatalogHistoricalView` exposes historical marking evidence while hiding cross-corpus consistency judgements and answer-generation policy.
- `SkillCatalogTypes.createSkillHistoricalEvidenceSet` pairs the real one-question Question Catalog record with the real one-question Answer Catalog record and validates their IDs, mark tariff and Skill relevance before synthesis.

A SkillCatalog summary may add reviewed interpretation, family labels and generation decisions, but it must not duplicate historical identity/tariff facts without validation against the imported source pair.

## Cross-skill rule

A historical question is stored once in `01_QuestionCatalog` and once in `02_AnswerCatalog`. A SkillCatalog evidence set may include that same source question for every Skill that genuinely owns one or more marks. This does not duplicate the historical record; it creates another reviewed index/synthesis view over the same source files.

## Migration rule

During staged migration, old synthesis-module locations or old numbered generation paths may remain as temporary compatibility mounts/re-export shims. New code must import the canonical SkillCatalog and generation paths. Remove a shim only after repository-wide consumers have been migrated and TypeScript/runtime checks pass.

## Current migration scope

A7 and A8 are the first complete examples of the new evidence seam. Their `HistoricalEvidence.ts` files import the actual question-by-question and marking-scheme-by-marking-scheme records, then the generation Evidence layer requires the corresponding historical-evidence validation before exposing generator calibration.

Source-backed general marking policies remain in `02_AnswerCatalog` because they are historical marking evidence, not synthesis.
