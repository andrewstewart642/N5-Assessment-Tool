# National 5 Mathematics — Canonical Content Architecture

This file is the local architectural contract for `app/Courses/National5Maths`.

The content pipeline is deliberately split into six ordered responsibilities. Historical evidence is stored once, cross-corpus conclusions are synthesised once, and runtime generators consume reviewed synthesis rather than re-analysing individual papers.

Repository-wide operating, privacy and source-isolation rules remain governed by `AGENTS.md` and `Docs/LockedDecisions.md`.

---

## Canonical layers

### `01_QuestionCatalog` — historical question truth

Stores what the historical question paper asked and the source-side facts needed to describe it faithfully, including identity, pages, parts, marks, task structure, mathematics, context, language characteristics, historical visual semantics, curriculum classification, response-space evidence and review state.

Canonical historical storage is question-centric:

```text
year → paper → numbered question
```

A historical question exists once even when several skills contribute marks.

Question Catalogue is not the owner of cross-corpus conclusions or runtime generation policy.

---

### `02_AnswerCatalog` — historical marking truth

Stores what the historical marking instructions awarded, accepted, limited or rejected.

It owns source-backed mark nodes, valid pathways, follow-through evidence, precision/presentation requirements, mark ownership and mark-level classification.

Historical marking differences must be preserved rather than harmonised to suit runtime generation.

Question and Answer records are physically separate owners but matching records form one paired evidence unit for validation.

---

### `03_SkillCatalog` — reviewed cross-corpus synthesis

Consumes historical-only views of `01_QuestionCatalog` and `02_AnswerCatalog` and answers:

> What does the complete historical evidence teach us about this skill?

It owns skill-level evidence sets, family analysis, observed frequencies, calibration, difficulty mechanisms, numerical design patterns, prompt/surface patterns, marking patterns and the reviewed generation envelope.

Observed historical evidence and controlled generation extensions must remain distinguishable.

Skill Catalogue is a synthesis/facade over the historical catalogues, not a duplicate historical database.

---

### `04_QuestionGeneration` — question manufacture

Creates new valid question instances from the reviewed Skill Catalogue model.

It owns executable family selection, parameter selection, randomisation, prompt construction and generated-question validation.

Question generators must not trawl raw historical year/question files directly.

Generation should arise from cross-corpus mathematical/structural understanding rather than transforming one historical question into a lightly altered version.

---

### `05_AnswerGeneration` — answer and marking manufacture

Creates marking and worked solutions for the exact generated question state.

It owns executable generated-answer logic and validation, while historical marking evidence remains in `02_AnswerCatalog` and reviewed marking synthesis remains in `03_SkillCatalog`.

Generated questions and generated answers must remain paired through shared mathematical state rather than independently reconstructing values.

---

### `06_VisualAssets` — generated visual capability

Owns generated visual blueprints, renderer strategy/capability, generated-output originality rules and visual validation.

Historical visual semantics do **not** belong in this downstream layer.

Shared historical visual evidence types are owned by:

```text
CatalogVisualEvidenceTypes.ts
```

beside the catalogue core.

Historical artwork is evidence only. Generated visuals must be independently specified and rendered from mathematical/semantic meaning rather than copied, traced or reconstructed from source artwork geometry.

---

## Supporting contracts

```text
CatalogCoreTypes.ts
→ shared catalogue IDs, evidence/provenance and core review concepts

CatalogVisualEvidenceTypes.ts
→ shared historical visual semantic/evidence contracts

Skills/National5MathsSkills.ts
→ canonical Course skill/concept tree

Skills/BuilderSkillRegistry.ts
→ composition point for migrated generator capability

AssessmentConfig.ts
→ Course-facing Assessment configuration and Builder integration
```

---

## Dependency direction

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets
                                    when generated visuals are required

CatalogCoreTypes / CatalogVisualEvidenceTypes / Skills
        are shared upstream contracts, not downstream generation layers.
```

The architecture guard enforces the important negative rules:

- `01_QuestionCatalog` and `02_AnswerCatalog` must not import `03`, `04`, `05` or `06`.
- `03_SkillCatalog` must not import `04`, `05` or `06`.
- `04`, `05` and `06` must not import raw year/question files from `01` or `02`.
- deprecated paths `03_QuestionGeneration`, `04_AnswerGeneration` and `05_VisualAssets` are forbidden;
- historical visual evidence uses `CatalogVisualEvidenceTypes.ts`;
- generated visual capability uses `06_VisualAssets`.

Run the guard with:

```bash
npm run check:n5-architecture
```

Use the guard when work could affect these ownership/import boundaries; it is not required as ritual after unrelated tiny changes.

---

## Historical evidence rules

Historical material is evidence, not reusable assessment content.

The pipeline is:

```text
historical evidence
        ↓
normalised mathematical / structural / design facts
        ↓
reviewed cross-corpus synthesis
        ↓
independently authored generated question
```

It is **not**:

```text
historical question
        ↓
change numbers / names / surface context
        ↓
new question
```

Catalogue prose must be independently authored while preserving mathematical meaning and assessment intent.

Generated questions must avoid verbatim and near-verbatim reproduction of known historical questions. Generator design should also reduce the chance that repeated random sampling can accidentally recreate a known historical instance where practical.

Neutral source locators such as year / paper / question number remain valid for traceability.

Exact response-space measurements and other physical design evidence may be retained at high precision. Those measurements are evidence about assessment design, not reusable source-layout templates.

---

## Mark-level integrity

Each one-mark node has one primary skill owner for Builder/Metrics totals.

Optional secondary relevance must not double-count marks.

These are independent classifications:

```text
primary skill ownership
standard classification (C / A)
thinking classification (Operational / Reasoning)
```

Do not infer one classification mechanically from another.

Historical marking evidence may require branching pathways, alternative methods, dependencies, follow-through and presentation rules. Do not flatten it into one final-answer string merely for generator convenience.

---

## Evidence state and provenance

Catalogue evidence uses explicit state:

```text
VALUE
NOT_APPLICABLE
UNKNOWN
NOT_REVIEWED
```

`UNKNOWN` is not equivalent to `NOT_APPLICABLE`.

Provenance distinguishes:

```text
SOURCE_FACT
CATALOGUE_CLASSIFICATION
GENERATION_ANALYSIS
```

Historical facts must remain distinguishable from project-authored interpretation and later generator synthesis.

Historical evidence outranks project-authored taxonomy when they conflict. Record the historical fact faithfully, flag the mismatch, and reconcile project metadata separately.

---

## Catalogue and generator workflow

Historical catalogue work may proceed chronologically:

```text
question-paper source facts
        ↓
matching marking source facts
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
Skill Catalogue synthesis / calibration
        ↓
GENERATION_ANALYSED
        ↓
Question Generator + Answer Generator
        ↓
runtime / Builder registration
```

This separation allows the historical corpus to progress year by year while generator development progresses skill by skill.

---

## Adding or upgrading a skill

A generator-capable skill should normally follow this route:

1. Ensure its historical question and answer occurrences exist canonically in `01` and `02`.
2. Build the skill's historical evidence set in `03_SkillCatalog` through historical-only views of the real catalogue records.
3. Synthesize families, calibration, difficulty, numerical/prompt/marking patterns and a controlled generation envelope in `03`.
4. Implement executable question manufacture in `04`.
5. Implement paired marking/worked-answer manufacture in `05`.
6. Add reusable generated visual capability to `06` only when required.
7. Register Builder/generator capability through the generic registries; do not create chained skill-specific bridges.
8. Verify the affected architecture, TypeScript and runtime behaviour before removing compatibility code.

---

## Compatibility boundary

`app/Courses/National5MathsLegacy/` still contains compatibility implementations required by parts of the current runtime.

That tree is **not** a seventh canonical content layer.

New catalogue, synthesis, question-generation, answer-generation and generated-visual architecture must be added to the six-layer workspace rather than extending the compatibility tree merely because an existing consumer still reaches it.

Compatibility should be retired incrementally:

```text
audit real consumer
        ↓
establish canonical replacement
        ↓
switch consumer / registry
        ↓
verify
        ↓
search remaining usage
        ↓
remove proven-obsolete seam
```

Do not claim the compatibility tree is removable until its real consumers have been migrated and verified.

---

## Final local rule

The six-layer workspace should make the evidence-to-generation chain inspectable:

```text
What did historical material contain?
→ 01 / 02

What did we learn across the corpus?
→ 03

How do we manufacture a new question?
→ 04

How do we manufacture its marking and worked answer?
→ 05

How do we independently render required generated visuals?
→ 06
```

If a responsibility cannot be placed cleanly in that chain, establish its owner before adding another compatibility path or duplicate source of truth.
