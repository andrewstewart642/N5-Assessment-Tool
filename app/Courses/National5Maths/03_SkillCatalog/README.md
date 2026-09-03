# National 5 Mathematics Skill Catalog

`03_SkillCatalog` is the cross-corpus synthesis layer between historical evidence and generation.

## Ownership contract

- `01_QuestionCatalog` owns historical question evidence: what SQA asked.
- `02_AnswerCatalog` owns historical marking evidence: how marks were awarded, including mark ownership and source-backed classification.
- `03_SkillCatalog` owns reviewed cross-corpus synthesis: recurring families, calibration, difficulty mechanisms, surface patterns, generation envelopes and generator-facing invariants.
- Question/answer generation consume SkillCatalog rather than deriving cross-corpus policy independently from year folders.

## Dependency rule

`01_QuestionCatalog` and `02_AnswerCatalog` must never import from `03_SkillCatalog` or any generation layer. SkillCatalog may depend on the historical catalogs and shared core types. Generation may depend on SkillCatalog.

## Migration rule

During staged migration, old synthesis-module locations may remain as temporary re-export shims. New code must import the canonical SkillCatalog path. Remove a shim only after repository-wide consumers have been migrated and TypeScript/runtime checks pass.

## Stage 1 scope

A7 and A8 cross-corpus analysis/calibration are the first migrated skill slices. Source-backed general marking policies remain in `02_AnswerCatalog` because they are historical marking evidence, not synthesis.
