# National 5 Mathematics — Canonical Content Architecture

This file is the local architectural contract for `app/Courses/National5Maths`.

The content pipeline is deliberately split into six ordered responsibilities. Historical evidence is stored once, cross-corpus conclusions are synthesised once, and runtime generators consume reviewed synthesis rather than re-analysing individual papers.

## Canonical layers

### `01_QuestionCatalog` — historical question truth

Stores what the historical question paper actually asked and the source-side facts needed to describe it faithfully: identity, source pages, parts and marks, task, mathematical structure, context, language, historical visual semantics, curriculum classification and review state.

Canonical historical storage is question-centric: year → paper → question. A historical question exists once even when several skills contribute marks.

Question Catalog is not the owner of cross-corpus conclusions or runtime generation policy.

### `02_AnswerCatalog` — historical marking truth

Stores what the historical marking instructions actually awarded, accepted, limited or rejected. It owns mark nodes, valid source-backed pathways, follow-through evidence, presentation/precision requirements, mark ownership and mark-level C/A and Operational/Reasoning classification.

Answer Catalog must preserve source differences rather than harmonising years to suit runtime generation.

### `03_SkillCatalog` — reviewed cross-corpus synthesis

Consumes historical-only views of `01_QuestionCatalog` and `02_AnswerCatalog` and answers: **what does the complete historical evidence teach us about this skill?**

It owns skill-level historical evidence sets, family analysis, observed frequencies, calibration, difficulty mechanisms, prompt/surface patterns, marking patterns, numerical design evidence and the reviewed generation envelope.

Observed SQA evidence and controlled generation extensions must remain distinguishable. SkillCatalog is a synthesis/facade over the historical catalogues, not a duplicate historical database.

### `04_QuestionGeneration` — question manufacture

Creates new valid question instances from the reviewed SkillCatalog model. It owns executable parameter selection, randomisation, family selection, prompt construction and question validation.

Question generators must not trawl raw historical year files directly.

### `05_AnswerGeneration` — answer and marking manufacture

Creates the marking scheme and worked solution for the exact generated question state. It owns executable generated-answer logic and validation, while historical marking evidence remains in `02_AnswerCatalog` and reviewed cross-corpus marking synthesis remains in `03_SkillCatalog`.

Generated questions and generated answers must remain paired through shared mathematical state rather than independently reconstructed values.

### `06_VisualAssets` — generated visual capability

Owns generated visual blueprints, renderer strategy/capability, generated-output originality rules and visual validation.

Historical visual semantics do **not** belong in this downstream layer. Shared historical visual evidence types are owned by `CatalogVisualEvidenceTypes.ts` beside the catalogue core.

## Supporting contracts

- `CatalogCoreTypes.ts` — shared catalogue IDs, evidence/provenance and core review concepts.
- `CatalogVisualEvidenceTypes.ts` — shared historical visual semantic/evidence contract used by the historical catalogue layers.
- `Skills/National5MathsSkills.ts` — canonical course skill/concept tree.
- `AssessmentConfig.ts` — course-facing assessment configuration and Builder integration.

## Dependency direction

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets   (when generated visuals are required)

CatalogCoreTypes / CatalogVisualEvidenceTypes / Skills
        are shared upstream contracts, not downstream generation layers.
```

The architecture guard enforces the important negative rules:

- `01_QuestionCatalog` and `02_AnswerCatalog` must not import `03`, `04`, `05` or `06`.
- `03_SkillCatalog` must not import `04`, `05` or `06`.
- `04`, `05` and `06` must not import raw year/question files from `01` or `02`.
- Deprecated paths `03_QuestionGeneration`, `04_AnswerGeneration` and `05_VisualAssets` are forbidden.
- Historical visual evidence uses `CatalogVisualEvidenceTypes.ts`; generated visual capability uses `06_VisualAssets`.

Run the guard with:

```bash
npm run check:n5-architecture
```

## Catalogue workflow

Historical catalogue work may proceed chronologically and exhaustively:

```text
question-paper source facts
        ↓
marking-scheme source facts
        ↓
mark-level classification / ownership
        ↓
mechanical validation
        ↓
CATALOGUED
```

`CATALOGUED` means the historical evidence has been faithfully captured and classified. It does not require generator reverse-engineering.

Generator work proceeds separately, skill by skill:

```text
complete relevant historical evidence set
        ↓
SkillCatalog synthesis / calibration
        ↓
GENERATION_ANALYSED
        ↓
Question Generator + Answer Generator
        ↓
runtime / Builder registration
```

This separation allows the historical bank to progress year by year while generator development progresses skill by skill.

## Adding or upgrading a skill

A new generator-capable skill should normally follow this route:

1. Ensure its historical question and answer occurrences exist canonically in `01` and `02`.
2. Build the skill's `HistoricalEvidence` set in `03_SkillCatalog` by importing the real historical entries through historical-only views.
3. Synthesize families, calibration, difficulty, numerical/prompt/marking patterns and a controlled generation envelope in `03`.
4. Implement executable question manufacture in `04`.
5. Implement paired marking/worked-answer manufacture in `05`.
6. Add reusable generated visual capability to `06` only when required.
7. Register Builder/generator capability through the generic registries; do not create chained skill-specific bridges.
8. Run architecture, TypeScript and runtime regression checks before removing any compatibility code.

## Refactor / migration rule

For structural migrations, preserve working behaviour before pursuing a prettier tree:

```text
AUDIT
  ↓
ESTABLISH OWNER
  ↓
WRITE / MOVE CANONICAL IMPLEMENTATION
  ↓
SWITCH CONSUMERS
  ↓
TYPE-CHECK + RUNTIME VERIFY
  ↓
SEARCH FOR RESIDUE
  ↓
DELETE OLD PATH
  ↓
VERIFY AGAIN
```

Compatibility code must be explicit and temporary. Once its final consumer is migrated, delete it rather than leaving a second implementation that can drift.
