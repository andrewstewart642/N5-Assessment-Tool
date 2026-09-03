# N5 Assessment Tool — Feature History

## 1. Purpose

This document records **meaningful implemented product and technical milestones**.

It is deliberately concise. It is not a per-commit changelog, current architecture manual, migration ledger or future-work backlog.

Use:

```text
Docs/Architecture.md
→ current architecture

Docs/RepositoryMap.md
→ current physical source map

Docs/LockedDecisions.md
→ current binding decisions

Docs/FutureFeatures.md
→ work that is not yet complete

Git history / preservation checkpoints
→ detailed historical implementation and superseded states
```

Historical milestones below describe the outcome that mattered. Obsolete intermediate paths and temporary migration mechanics are omitted unless they materially explain the current system.

---

# 26 August 2026 — Repository Architecture Baseline

**Status:** COMPLETE

A repository-wide architecture refactor established the product ownership model that remains the application baseline.

Key outcomes included:

```text
root app/ as the runtime source tree
explicit Assessments ownership
explicit Classes ownership
explicit Courses ownership
explicit DeveloperTools ownership
Application UI separated from generated Document UI
Course-independent Assessment Creation
Assessment Compilation separated from Creation
thin central public-route dispatch
persistence treated as a compatibility contract
deliberate client boundaries
retirement of broad generic source buckets
```

The important long-term result was responsibility-led ownership rather than preservation of the repository's historical folder layout.

---

# 27 August 2026 — Application Workbench and Global Shell

**Status:** IMPLEMENTED

The interactive application settled on its compact desktop/workbench visual direction and a shared global shell.

Major outcomes included:

- persistent HeaderBar and Activity Rail composition;
- global settings owned by Application UI rather than individual product pages;
- compact, information-dense controls and restrained surfaces;
- consistent application appearance handling;
- feature pages inheriting global shell height/layout rather than independently claiming the viewport.

This work established the visual language that remains the default for new interactive application UI.

---

# 27 August 2026 — Assessment Creator Interaction Model

**Status:** IMPLEMENTED

Assessment Creation matured into the current workbench structure with clear ownership for TopBar, SkillsPanel, PaperWorkspace, HUDBar, question workflow, paper workflow and persistence.

Notable product capabilities established during this period included:

```text
compact assessment metadata controls
Course-driven Skills Tree interaction
preview zoom and view-mode controls
preview-owned save status
shared Preview Tray with Settings and View tabs
per-paper sitting/date/time controls
Compact / Exam / Answers presentation modes
compile action in the lower workbench region
```

Assessment-specific settings remained Assessment-owned even when surfaced beside the preview, while global application settings remained separate.

---

# 27 August 2026 — Canonical Compilation and PDF Pipeline

**Status:** IMPLEMENTED

Assessment Compilation became a separate final-document responsibility rather than an extension of the interactive Creator.

The system gained a canonical compilation model and a single server PDF-generation pipeline:

```text
SavedAssessment
      ↓
canonical compilation document
      ↓
pagination + document rendering
      ↓
standalone HTML / mathematical typesetting assets
      ↓
headless browser
      ↓
PDF bytes
```

A reusable client PDF-asset/cache layer was also introduced so downstream interfaces can display the generated assessment without inventing another document renderer.

This remains a major anti-drift boundary: preview/library/PDF consumers should share assessment-document meaning rather than reconstruct it independently.

---

# 27 August 2026 — My Assessments Became a First-Class Product Area

**Status:** IMPLEMENTED

The user-facing assessment library became its own top-level owner:

```text
app/MyAssessments/
```

The library gained:

```text
Tile and List views
search / filtering / sorting
pin / duplicate / delete / open actions
real generated-PDF previews
large reusable PDF preview modal
progress/status/date presentation
persisted view preference
```

Ownership was deliberately separated:

```text
SavedAssessments
→ persisted assessment data

Compilation/PDF
→ generated assessment documents/assets

MyAssessments
→ library presentation and workflow
```

---

# 28 August 2026 — Responsibility-First Naming and Discoverability

**Status:** COMPLETE

A repository-wide naming pass established the rule:

> **Folder = context. Filename = responsibility.**

The pass removed unnecessary parent-name repetition, reduced implementation-led filenames, retained meaningful ordered folders and avoided generic dumping-ground names where a durable responsibility could be stated.

Public routes, persisted fields and compatibility identifiers were intentionally excluded from cosmetic source renaming.

The result was a repository intended to be navigable by developers who did not build it.

---

# 28 August 2026 — Historical Catalogue Contract and 2014 Pilot

**Status:** IMPLEMENTED AS FOUNDATION

The National 5 Mathematics historical catalogue programme moved from narrow prototypes toward universal per-question evidence contracts.

The 2014 Paper 1 and Paper 2 question sets were used as the first full-fidelity stress test.

Important lessons established by that pilot included:

- historical source facts must outrank project-authored taxonomy;
- one numbered question is stored once rather than duplicated by skill;
- exact candidate response-space measurements are useful assessment-design evidence;
- visual evidence should be captured semantically rather than by retaining source artwork;
- evidence state/provenance must distinguish observed facts, classification and later generation analysis;
- a universal catalogue contract should be hardened against real variety before mass population.

The physical architecture used during this first transition was later superseded by the six-layer model described below. The evidence lessons survived.

---

# 3 September 2026 — Skill Catalogue Synthesis Boundary

**Status:** IMPLEMENTED AND CERTIFIED

`03_SkillCatalog` became the explicit reviewed cross-corpus synthesis layer between historical evidence and executable generation.

The A7 and A8 algebraic skill families were used to harden the boundary.

Key outcomes:

```text
01 Question Catalogue
→ historical question evidence only

02 Answer Catalogue
→ historical marking evidence only

03 Skill Catalogue
→ reviewed cross-corpus conclusions and generation envelope
```

Historical-only views prevent downstream generator policy and synthesis fields from leaking back into stored source records.

A7/A8 historical factories were also purified so their stored runtime payloads no longer carried generator-specific policy merely to satisfy older transitional types.

Reference checkpoint:

```text
3c0c1c7d8f94b9bf85eedb420ebca0ec4402a6c9
Stage 3C document purified A7 A8 catalogues
```

---

# 3 September 2026 — Registry-Driven Builder Skill Composition

**Status:** IMPLEMENTED

Builder capability for migrated National 5 Mathematics skills moved toward generic registration/composition instead of chained skill-specific bridges.

A7 question/answer generation was exposed through canonical generation modules, while A8's existing concept implementation was redirected to canonical question/answer generation paths without unnecessarily rewriting its mathematical behaviour.

The architectural direction became:

```text
skill registration
        ↓
BuilderSkillRegistry
        ↓
canonical generation registry
```

Adding another migrated skill should therefore be a registration problem rather than another bespoke bridge chain.

Reference checkpoint:

```text
6e2095c7cea18466bc445aa9edd8892e2764916c
Stage 4 point A8 Legacy module at canonical generation paths
```

---

# 3 September 2026 — Six-Layer National 5 Mathematics Architecture

**Status:** IMPLEMENTED; STRUCTURAL AND TYPE GATES CERTIFIED

The National 5 Mathematics evidence/generation workspace reached its canonical six-layer structure:

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets when required
```

The finalisation removed obsolete numbered generation trees and the old visual-compatibility path, separated historical visual evidence from generated visual capability, and introduced/strengthened the National 5 Mathematics architecture guard.

Useful reference checkpoints:

```text
e52e2dadae1b3af60bac6f1ffb3c83b623e9e755
Stage 5B remove deprecated generation trees

39651ea747b468ca95365931476da040f07baec6
Stage 5C fix historical visual import boundary

7e7b1b9b7b884dbae9231f6bffb81393b357d3cd
Stage 5D document canonical National5Maths architecture
```

The local Course architecture document now defines the dependency rules, catalogue workflow and skill-by-skill generator workflow.

At the final Stage 5 checkpoint the architecture guard and TypeScript checks passed locally. Remaining compatibility generation is treated as bounded migration debt rather than part of the six-layer content model.

---

# 3 September 2026 — Documentation System Reset

**Status:** IMPLEMENTED

After the source architecture stabilised, the active documentation system was reset so current truth no longer had to compete with several generations of superseded migration instructions.

A preservation checkpoint was created before the reset, then the documentation work moved to a dedicated branch.

The active documentation roles were simplified:

```text
AGENTS.md
→ concise mandatory operating/source-isolation contract

Docs/Architecture.md
→ current architecture and dependency direction

Docs/RepositoryMap.md
→ current physical navigation and troubleshooting entry points

Docs/ChatGPTWorkflow.md
→ current ChatGPT Project + GitHub + local-verification workflow

Docs/LockedDecisions.md
→ current binding decisions only

Docs/FutureFeatures.md
→ active forward-looking backlog

Docs/FeatureHistory.md
→ meaningful implemented milestones
```

The reset also elevated source-isolation/originality requirements: historical material is treated as evidence rather than reusable content, generated questions must avoid verbatim and near-verbatim reproduction, historical artwork is not reused, and neutral source locators remain available for traceability.

The old permanent superseded-decision chains were retired from the active decision register; Git history and preservation checkpoints now preserve superseded wording.

---

## Ongoing History Rule

Add a Feature History entry only when a future developer would materially benefit from knowing that a product capability, technical foundation or major architectural boundary changed.

Do not record every commit or temporary implementation step.

When an old implementation is later replaced, prefer recording the new milestone rather than repeatedly editing old historical entries to resemble the present.
