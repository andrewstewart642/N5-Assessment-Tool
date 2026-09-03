# 06_VisualAssets

`06_VisualAssets` owns **new visual construction**, not historical source truth.

Historical visual facts, semantic entities/relations, scale/orientation evidence and candidate interaction are described by the shared `CatalogVisualEvidenceTypes.ts` contract. `01_QuestionCatalog` and `02_AnswerCatalog` may consume that shared contract, but they must not import this layer.

This layer consumes reviewed semantic evidence to define original generated visuals, renderer requirements, originality constraints and validation policy. Historical artwork, historical vector geometry and source layout coordinates are never generation assets.

The old `05_VisualAssets` path is a temporary compatibility seam for the 2014 pilot only and must not receive new consumers.
