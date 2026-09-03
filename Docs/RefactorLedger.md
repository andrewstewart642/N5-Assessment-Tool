# N5 Assessment Tool — Refactor Ledger

## 1. Purpose

This document is a **concise historical summary of major repository refactors**.

It is not a current architecture document, active migration tracker, feature history or backlog.

Use:

```text
Docs/Architecture.md
→ current architecture and dependency direction

Docs/RepositoryMap.md
→ current physical source map

Docs/LockedDecisions.md
→ current binding decisions

Docs/FeatureHistory.md
→ meaningful implemented product/technical milestones

Docs/FutureFeatures.md
→ outstanding and future work

Git history / preservation checkpoints
→ detailed patches, intermediate states and superseded implementation
```

The purpose of retaining this file is to explain the few historical transitions that materially help a future developer understand **why the repository looks the way it does now**.

Do not use historical paths in this document as current navigation instructions.

---

# 2. Repository-Wide Architecture Refactor — August 2026

## Outcome

A repository-wide refactor replaced implementation-history-led organisation with responsibility-led ownership.

The durable outcomes were:

```text
one runtime application source root
explicit Assessments ownership
explicit Classes ownership
explicit Courses ownership
explicit DeveloperTools ownership
Application UI separated from generated Document UI
Course-independent Assessment workflow
Compilation separated from interactive Creation
thin public-route dispatch
persistence treated as a compatibility contract
deliberate client boundaries
retirement of broad generic source buckets
```

The refactor was declared complete on **26 August 2026**. After that point, normal development returned to feature work and targeted structural improvement rather than treating the entire repository as an unfinished migration.

---

## Transitional `src/` phase

An intermediate architecture temporarily separated:

```text
app/
→ framework/routing layer

src/
→ migrated product implementation
```

This was a genuine construction stage, not the final architecture.

Once ownership boundaries were established, runtime source was consolidated beneath root:

```text
app/
```

and the temporary `src/` application tree was removed.

Historical commits and old documentation may therefore refer to real `src/...` paths that no longer exist.

---

# 3. Major Ownership Migrations

## Assessment Creation

The historical all-purpose assessment-building implementation was decomposed into explicit responsibilities beneath Assessment ownership.

The important enduring regions became concepts such as:

```text
Setup
TopBar
SkillsPanel
PaperWorkspace
HUDBar
Questions
Papers
Analysis
Persistence
AssessmentSettings
```

The public creation URL was preserved independently from physical source ownership.

The key lesson was:

```text
route terminology
≠
source architecture
```

---

## Assessment Compilation

Final document composition became a separate Assessment responsibility from interactive creation.

This prevented final rendering, pagination and later PDF work from becoming coupled to Creation simply because both consume assessment content.

That separation became the foundation of the canonical Compilation/document pipeline used today.

---

## Courses

Educational and Course-specific knowledge gained explicit Course ownership.

Generic Assessment and Classes code moved toward consuming Course contracts/registry/configuration rather than importing one concrete Course's internal data directly.

This established the long-term rule:

```text
Course knowledge stays Course-owned
Generic product workflow consumes Course contracts
```

---

## Classes

Class data, persistence and class-specific workflows became explicitly Class-owned.

Class curriculum/skills information was routed through Course identity/configuration rather than copied into the Classes domain.

---

## UI and Documents

Interactive application presentation and printable/generated document presentation became separate systems:

```text
UI/Application
≠
UI/Documents
```

Generated-document architecture developed the layered responsibility model:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers
```

---

## Developer Tools

Runtime developer/testing interfaces gained an explicit application owner separate from one-off repository migration scripts.

This distinction remains useful whenever new tooling is proposed.

---

# 4. Architectures Deliberately Retired

The refactor removed several historical owners rather than moving them wholesale into new folders.

Examples included:

```text
historical Builder source architecture
parallel Question Bank architecture
generic shared-types bucket
generic math-helpers bucket
mixed paper-layout owner
mixed course-data owner
temporary src/ application root
route-shaped feature source trees
```

Surviving behaviour was reassigned according to responsibility. Proven-unused implementation was deleted.

The important lesson was to **preserve behaviour, not historical file structures**.

---

# 5. Migration Method That Proved Reliable

The repository-wide refactor established a migration technique that remains useful for risky structural work:

```text
AUDIT
  ↓
ESTABLISH OWNER
  ↓
WRITE / ESTABLISH CANONICAL REPLACEMENT
  ↓
SWITCH CONSUMERS
  ↓
VERIFY
  ↓
SEARCH BROADLY
  ↓
DELETE OLD IMPLEMENTATION
  ↓
VERIFY AGAIN
```

Two lessons were particularly important.

### Compatibility is not automatically dead code

Old terminology or compatibility wiring may still support persistence, routes, saved data, active consumers or runtime lookup. Trace the contract before deletion.

### A narrow search does not prove deadness

During the refactor, at least one apparently-unused document component still had a real downstream consumer that was exposed by TypeScript after removal.

Deletion therefore requires appropriate searches across symbols, filenames, imports, registries, routes, persistence and other dynamic access paths where relevant.

---

# 6. Persistence and Routing Lessons

Source naming and compatibility contracts were deliberately separated.

The refactor did **not** automatically rename:

```text
persisted browser-storage keys
stored field names
legacy-compatible data representations
public URLs
```

because a cleaner internal name is not sufficient reason to break stored user data or public navigation.

Likewise, public URLs were preserved through thin routing/dispatch rather than forcing physical source trees to mirror route paths.

These principles remain binding in the current project documentation.

---

# 7. Client Boundary Cleanup

The refactor also removed unnecessary `"use client"` directives from internal modules where a genuine parent boundary already established the client subtree.

The target was never zero client directives.

The target was:

```text
deliberate client entry boundaries
```

This reduced unnecessary boundary noise and avoided serialisability warnings caused by declaring ordinary internal modules as independent client entry points.

---

# 8. Responsibility-First Naming Pass — 28 August 2026

After broad ownership was established, a separate naming/discoverability pass adopted the rule:

> **Folder = context. Filename = responsibility.**

The pass removed unnecessary parent-name repetition, reduced implementation-detail filenames and avoided vague generic helper buckets where a concrete responsibility could be named.

It deliberately did **not** rename public routes or persistence contracts merely to make source names prettier.

Current naming rules are documented in the active architecture/decision files; Git preserves the individual rename history.

---

# 9. National 5 Mathematics Content Architecture Evolution

## Initial clean-workspace transition — 28 August 2026

After the repository-wide architecture refactor, National 5 Mathematics began a separate bounded migration focused on historical evidence and question/answer generation.

A clean destination workspace was introduced while existing working generation remained available through compatibility infrastructure.

The first transition used a five-stage evidence-to-generation layout and the 2014 corpus as a contract stress test.

Important lessons from that period survived even though the physical layout was later replaced:

```text
historical evidence outranks project-authored classification
one historical question is stored once
Question and matching marking evidence form a pair
exact response-space measurements are useful evidence
historical visuals are captured semantically, not copied
catalogue contracts should be stress-tested before mass population
```

Useful early catalogue checkpoints include:

```text
abc652a0791be98f065303569a9e2cf057c017aa
→ strengthen the universal Question Catalogue contract

6e08e59e646f4f865705444e9b5f1c8e90ec26e0
→ 2014 Paper 1 full-fidelity catalogue pass

545314ce6988105695f9b3f74d4167b9e85ff65a
→ 2014 Paper 2 full-fidelity catalogue pass
```

---

## Skill Catalogue boundary — 3 September 2026

The evidence/generation architecture was refined by introducing `03_SkillCatalog` as the explicit cross-corpus synthesis layer.

This separated three different responsibilities that had previously been too easy to mix:

```text
historical source evidence
        ↓
reviewed cross-corpus skill synthesis
        ↓
executable generation
```

A7 and A8 were used as the proving ground for this boundary.

Their historical records were purified so source storage did not need to carry generator policy merely to satisfy downstream consumers.

Reference checkpoint:

```text
3c0c1c7d8f94b9bf85eedb420ebca0ec4402a6c9
→ Stage 3C historical A7/A8 purification
```

---

## Registry-driven Builder integration

Migrated skill capability moved toward generic registration rather than bespoke skill-to-skill bridge chaining.

A7 was exposed through canonical generation modules. A8 retained trusted mathematical behaviour while being redirected toward canonical generation paths.

Reference checkpoint:

```text
6e2095c7cea18466bc445aa9edd8892e2764916c
→ Stage 4 registry/canonical generation integration checkpoint
```

---

## Six-layer finalisation — 3 September 2026

The National 5 Mathematics content workspace reached the canonical six-layer structure:

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets when required
```

The finalisation removed obsolete numbered generation paths, separated historical visual evidence from generated visual capability and introduced a dedicated architecture guard.

Useful checkpoints:

```text
e52e2dadae1b3af60bac6f1ffb3c83b623e9e755
→ remove deprecated generation trees

39651ea747b468ca95365931476da040f07baec6
→ correct historical visual evidence boundary

7e7b1b9b7b884dbae9231f6bffb81393b357d3cd
→ document/finalise canonical six-layer architecture
```

At that checkpoint the architecture guard and TypeScript verification passed locally.

The detailed current model belongs in:

```text
app/Courses/National5Maths/ARCHITECTURE.md
```

Remaining compatibility generation is tracked as future/maintenance work rather than as unfinished architecture in this ledger.

---

# 10. Documentation Reset — 3 September 2026

Once the source architecture stabilised, the active documentation system was reset.

The previous approach had accumulated current instructions, superseded instructions and historical migration commentary in the same documents.

The new model is:

```text
current-state documents
→ contain current truth

FeatureHistory
→ meaningful implemented milestones

FutureFeatures
→ outstanding/future work

Git history + preservation checkpoints
→ superseded wording and detailed implementation history

this RefactorLedger
→ concise explanation of major architectural transitions only
```

This means the ledger no longer attempts to preserve every migration pass, old path, temporary branch, shell lesson or obsolete decision chain in prose.

---

# 11. Selected Historical Anchors

These references are retained only because they make deeper investigation quicker:

```text
1492b5841be785ebf0a0fc96517cf3480aacb10c
→ early Application UI foundation

4664123d6657ae8752817c8ea0569a16d33a0890
→ early theme/settings architecture

6a7cd59
→ consolidation of application source beneath root app/

3c0c1c7d8f94b9bf85eedb420ebca0ec4402a6c9
→ A7/A8 historical-storage purification

6e2095c7cea18466bc445aa9edd8892e2764916c
→ registry/canonical generation integration checkpoint

7e7b1b9b7b884dbae9231f6bffb81393b357d3cd
→ six-layer National 5 Mathematics architecture checkpoint
```

Git history is authoritative for exact patches and additional commits.

---

# 12. Final Historical Rule

Use this ledger only when the question is:

> **How did this major architectural boundary come to exist?**

For questions about what exists **now**, use the current Architecture and Repository Map instead.

Do not expand this file into another migration diary. If a future structural change materially changes the architecture, record the resulting milestone in `FeatureHistory.md` and let Git preserve the detailed implementation sequence.