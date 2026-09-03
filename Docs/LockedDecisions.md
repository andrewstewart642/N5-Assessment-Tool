# N5 Assessment Tool — Locked Decisions

## 1. Purpose

This document records **current binding project decisions**.

It is intentionally not a historical decision archive. Superseded wording is preserved by Git history and preservation checkpoints rather than being retained beside current truth.

A decision in this file remains binding until the user explicitly changes it or new technical/legal evidence requires reconsideration.

When a genuine conflict appears:

```text
identify the decision
        ↓
explain the new evidence
        ↓
explain the conflict
        ↓
propose a replacement
        ↓
obtain explicit approval
        ↓
update current documentation
```

Do not drift around a locked decision silently.

---

# Project Safety and Change Control

## D-001 — Preserve working behaviour

Existing working behaviour is acceptance criterion zero unless an intentional product change is approved.

Cleaner architecture is not a successful change if it breaks relevant existing functionality.

---

## D-002 — Ownership determines location

Files live with the domain that owns their responsibility, not whichever feature happens to consume them most heavily.

Do not create a second source of truth to solve a local problem.

---

## D-003 — Bounded changes are preferred

Structural changes should be performed in coherent, inspectable passes with clear scope and recovery points.

Do not mix unrelated changes into one migration or commit merely because they are nearby.

---

## D-004 — Deletion happens after replacement and verification

Before deleting an old implementation, inspect relevant imports, exports, registries, dynamic access, persistence, routes, events and generated-data consumers.

Preferred sequence:

```text
establish replacement
        ↓
switch consumers
        ↓
verify
        ↓
search broadly
        ↓
delete obsolete source
        ↓
verify again
```

Proven dead code should be removed rather than migrated into a new permanent home.

---

## D-005 — Verification is proportional to risk

Use the checks capable of detecting failures the change could plausibly introduce.

Examples include:

```text
TypeScript
architecture guards
lint
build
browser/runtime tests
visual document inspection
repository search/diff checks
```

Do not run every check after every tiny edit merely as ritual. Broader verification is required at significant checkpoints and whenever the affected boundary makes cascading failure plausible.

---

## D-006 — Persistence and public routes are compatibility contracts

Source cleanup does not automatically rename persisted keys, stored fields, browser storage, route identifiers or public URLs.

A persistence or routing migration is a separate deliberate change.

---

# Repository Structure and Naming

## D-007 — Root `app/` is the runtime source tree

Runtime application source lives beneath:

```text
app/
```

Do not create a competing runtime `src/` application tree.

---

## D-008 — Top-level domains require genuine ownership

Current primary runtime owners include:

```text
Assessments
Classes
Courses
DeveloperTools
Home
MyAssessments
UI
```

Do not create new top-level folders merely to make a local implementation easier to organise.

---

## D-009 — Folder = context; filename = responsibility

The governing discoverability rule is:

> **Folder = context. Filename = responsibility.**

A developer unfamiliar with the implementation should be able to make a sensible guess about a file from its path and name.

Do not prefix filenames with `use` merely because they export React hooks; hook functions still use React's `useSomething` convention.

Avoid vague `Utils`, `Helpers`, `Common`, `Shared`, `Misc` and similar dumping-ground ownership where a concrete responsibility can be named.

---

## D-010 — Number folders only where order communicates real meaning

Meaningful product/curriculum ordering may use numeric prefixes.

Decorative numbering used only to control Explorer sorting is not accepted.

---

## D-011 — Do not create speculative architecture

Future Courses, scanning, OCR, assisted marking, analytics, storage systems or other ideas do not justify empty runtime folders or unused abstractions.

Record future ideas in the current backlog/future-work document until implementation requires a real owner.

---

# Routing, Runtime and State

## D-012 — Product architecture and route architecture remain separate

Public URLs describe navigation; source folders describe responsibility.

Routing remains thin and must not become a parallel feature architecture.

Framework-significant filenames such as `page.tsx`, `layout.tsx` and `route.ts` are used only at genuine framework boundaries.

---

## D-013 — Client boundaries are deliberate

`"use client"` marks a genuine client entry boundary.

Do not add it defensively to every child component/hook that uses browser APIs or React hooks when the module already sits beneath an established client boundary.

---

## D-014 — No new global state system without demonstrated need

Existing React state, hooks and contexts remain the default where they fit ownership.

A new global state-management library requires a demonstrated architectural problem and an explicit decision.

---

## D-015 — Prefer explicit dependencies over hidden coupling

Prefer imports, props, hooks, registries and explicit composition over hidden browser-event communication or global mutable coupling.

Compatibility event bridges may remain while genuinely required, but they should be removed after all consumers have a verified replacement.

---

# Course, Assessment and Class Boundaries

## D-016 — Assessment workflow is Course-independent

Generic Assessment Creation, persistence, selection, metrics and Compilation architecture must not become specific to one Course.

Course-specific educational knowledge belongs beneath:

```text
app/Courses/<Course>/
```

---

## D-017 — Course knowledge reaches generic consumers through Course contracts

Use the Course Registry and Course Assessment configuration boundary rather than concrete Course imports where generic workflow requires educational rules.

Another Course should be addable without cloning and rewriting the entire Assessment workflow.

---

## D-018 — Classes do not own curriculum knowledge

Class records may reference a Course identity.

Course-specific skills and curriculum structure should resolve through the Course abstraction rather than direct imports of one concrete Course's data.

---

## D-019 — My Assessments is presentation/workflow, not persistence or PDF ownership

`app/MyAssessments/` owns the user-facing assessment library.

Saved assessment contracts/storage remain Assessment-owned.

Assessment PDF generation remains Compilation-owned.

My Assessments consumes those systems rather than duplicating them.

---

# UI and Documents

## D-020 — Application UI and generated Documents are separate visual systems

Interactive application chrome belongs beneath:

```text
app/UI/Application/
```

Printable/generated document presentation belongs beneath:

```text
app/UI/Documents/
```

Generated documents must not depend on application navigation, activity rails, settings drawers, hover behaviour or other application-only assumptions.

---

## D-021 — The established workbench UI direction is the default

New interactive UI should normally preserve the existing compact desktop/workbench character:

```text
restrained neutral surfaces
thin borders
modest radii
compact controls
restrained accent use
clear hierarchy
high information density
consistent appearance modes
```

Depart from that visual language only when a deliberate redesign is requested.

---

## D-022 — Assessment PDF generation has one canonical pipeline

Assessment Compilation owns the canonical document model and final PDF-generation pipeline.

Interactive preview, server generation and My Assessments previews must not evolve into independent incompatible assessment-document models.

---

## D-023 — Physical document changes require visual verification

Changes to document layout, pagination, cover/formula pages, question spacing, marks margins, page dimensions or PDF rendering require visual inspection where those outputs may change.

A clean type-check cannot prove physical document preservation.

---

# Privacy and Data

## D-024 — Preserve the pupil-identity privacy boundary

Pupil names should not need to be stored by the application server merely to support class/assessment workflow.

Where identity is required, prefer non-identifying IDs and teacher-owned/local mapping where practical.

Future scanning, assisted marking, analytics or backend work must not weaken this boundary casually.

---

## D-025 — A backend/database is a separate product decision

Do not introduce a backend, database or remote persistence layer merely as architecture housekeeping.

It may be introduced later when real product requirements justify it.

---

# Historical Evidence and Source Isolation

## D-026 — Historical examination material is evidence only

Historical examination material may inform mathematical structure, assessment design, difficulty, marking, layout, language characteristics and generator calibration.

It is not a repository content bank or generation-template library.

---

## D-027 — Do not reproduce historical questions verbatim or near-verbatim

Repository-authored content and generated assessment material must not reproduce an official historical question word-for-word.

Avoid near-verbatim/minimally altered transformations such as taking one historical question and changing only names, values or superficial context.

Where a skill is inherently simple and structural diversity is limited, vary as much as reasonably possible without damaging mathematical validity or natural assessment style.

---

## D-028 — Generation must resist accidental historical-question reproduction

The generator should be designed so that repeated random sampling is not reasonably capable of reconstructing a known historical question merely by eventually aligning the same parameter combination.

Prefer cross-corpus synthesis, broader controlled parameter spaces, independent context construction and varied mathematical/surface structures over cloning one historical instance.

This requirement protects both deliberate originality and accidental coincidence.

---

## D-029 — Catalogue prose is independently authored

Historical catalogues may store neutral locators, mathematical facts, measurements, classifications and normalised structural descriptions.

Avoid storing source prompt or marking wording verbatim except for unavoidable tiny mathematical tokens/command terminology where meaning cannot reasonably be represented otherwise.

Catalogue prose should preserve mathematical integrity while remaining independently written.

---

## D-030 — Official awarding-body names and acronyms are prohibited in authored repository content

Repository-authored files and generated assessment content must not contain official awarding-body names or acronyms.

This includes source code, comments, documentation, metadata labels, generated output and developer-only naming where practical.

Neutral historical locators such as:

```text
2019 / Paper 2 / Question 4
```

are permitted for evidence traceability without linking or reproducing source content.

Source/reference files stored outside authored repository content are evidence inputs and are treated separately.

---

## D-031 — Historical artwork is never copied into generation

Do not store historical diagrams/images for runtime reuse, trace their pixel/vector geometry, or embed source artwork into generated assessment content.

Catalogue the mathematical/semantic meaning required by the task.

Generated mathematical visuals should be independently specified and rendered from mathematical meaning.

Approved original/licensed contextual assets may be used separately with appropriate licence/source metadata.

---

## D-032 — Exact response-space and sizing evidence may be retained

Physical response-space dimensions, page measurements, proportions and similar assessment-design evidence may be recorded with high precision.

These measurements describe useful design characteristics; they do not confer permission to reproduce source wording/artwork.

Historical coordinates are evidence, not reusable source-layout templates.

---

# National 5 Mathematics Evidence and Generation Architecture

## D-033 — The six-layer National 5 Mathematics architecture is canonical

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets when required
```

Responsibilities:

```text
01 Question Catalogue
→ historical question truth

02 Answer Catalogue
→ historical marking truth

03 Skill Catalogue
→ reviewed cross-corpus synthesis

04 Question Generation
→ original question manufacture

05 Answer Generation
→ marking/worked-answer manufacture

06 Visual Assets
→ generated visual capability
```

---

## D-034 — Historical evidence is stored once

Each historical numbered question exists once in the Question Catalogue and once on the matching Answer Catalogue side.

Do not recatalogue historical source records by skill.

Skill-first development means researching/synthesising a skill from the shared historical corpus, not duplicating the historical database into skill folders.

---

## D-035 — Question and marking evidence form a paired evidence unit

Question and Answer catalogues are physically separate owners but matching source question/marking evidence must be treated as one evidence pair for validation.

Do not invent marking behaviour from the question side when matching marking evidence exists but has not yet been reviewed.

---

## D-036 — Historical evidence outranks project-authored classification

If historical evidence conflicts with the Skills Tree, paper suitability, difficulty assumptions or other project-authored metadata:

```text
record historical truth faithfully
        ↓
flag the mismatch
        ↓
reconcile project metadata later
```

Do not distort the historical record to preserve our taxonomy.

---

## D-037 — Evidence state and provenance remain explicit

These states are distinct:

```text
VALUE
NOT_APPLICABLE
UNKNOWN
NOT_REVIEWED
```

These provenance categories are distinct:

```text
SOURCE_FACT
CATALOGUE_CLASSIFICATION
GENERATION_ANALYSIS
```

Do not use `NOT_APPLICABLE` as a substitute for unresolved or unreviewed evidence.

---

## D-038 — Skill Catalogue is synthesis, not duplicated source storage

`03_SkillCatalog` consumes historical-only views of Question/Answer evidence and records reviewed cross-corpus conclusions.

It must not become a second historical database.

Generators normally consume Skill Catalogue synthesis rather than reading raw year/question files directly.

---

## D-039 — Observed evidence and generation envelope are different things

Historical observation records what actually occurred.

Generation envelope may contain carefully reviewed controlled extensions beyond the observed set where those extensions remain mathematically valid, stylistically appropriate and source-independent.

Do not mislabel controlled generation possibilities as historical facts.

---

## D-040 — Mark-level ownership is singular for totals

Each one-mark historical or generated mark node has one primary skill owner for Builder/Metrics totals.

Secondary relevance may be recorded where useful but must not double-count marks.

Skill ownership, Standard classification and Thinking classification are separate dimensions.

---

## D-041 — Standard and Thinking classifications are independent

C/A Standard and Operational/Reasoning Thinking classifications must not be collapsed into one dimension.

A mark can be Common or Advanced standard independently of whether it is operational or reasoning.

---

## D-042 — Answer Catalogue models marking pathways, not just answer strings

Historical marking evidence may require branching method pathways, mark nodes, dependencies, alternatives, follow-through, answer-only rules, working requirements, exactness/rounding, units, notation, diagram evidence, cross-part effects and general marking policy.

Do not reduce a marking scheme to a final answer string or one preferred worked solution.

---

## D-043 — Generated answers derive from the exact generated question state

Question Generation and Answer Generation are paired by the generated mathematical state.

Answer/marking code should consume the exact values/structure produced for the generated question rather than independently reconstructing them and risking divergence.

---

## D-044 — Generated mathematical visuals are original capability

Historical visual semantics may inform required entities, relationships, labels, scale/orientation, candidate interaction and invariants.

`06_VisualAssets` owns generated visual specification/rendering capability.

Generated diagrams should be newly constructed from mathematics rather than historical geometry.

---

## D-045 — Catalogue contracts are hardened before mass propagation of omissions

When a new historical source exposes a genuinely useful characteristic the master catalogue contracts cannot express:

```text
identify the missing meaning
        ↓
strengthen the master contract if warranted
        ↓
retrofit affected pilot/hardened records
        ↓
continue wider corpus work
```

Do not knowingly multiply the same schema omission across hundreds of files.

---

# Development and Documentation

## D-046 — The repository is durable project memory

Important architectural rules, decisions and current-state knowledge must live in repository documentation/source rather than only in chat context.

ChatGPT Project context accelerates work but is not the sole source of truth.

---

## D-047 — Current-state documents contain current truth

Current documentation should describe the repository as it exists now.

Historical truth belongs in Git history and designated historical documents.

Do not keep obsolete contradictory instructions in active docs merely to preserve history.

---

## D-048 — Documentation updates happen at meaningful checkpoints

Update persistent documentation when a future developer would materially benefit from knowing that an owner, architecture rule, compatibility seam, feature or workflow has changed.

Do not turn documentation into a keystroke or per-commit diary.

---

## D-049 — AI inspects current source before meaningful repository claims

When current structure, imports, consumers or branch state matters, inspect the connected repository rather than inferring from old chat context or historical filenames.

Do not ask the user for repository facts that available tools can resolve.

---

## D-050 — Significant decisions require explicit approval

Ask before materially changing:

```text
locked architecture
source-isolation/legal rules
privacy model
public routes
persistence contracts
major product behaviour where intent is ambiguous
major new dependencies/domains
```

Routine implementation inside an already-approved bounded pass does not require repeated approval.

---

# Quick Reference

```text
PRESERVE WORKING BEHAVIOUR.

OWNERSHIP DETERMINES LOCATION.

FOLDER = CONTEXT. FILENAME = RESPONSIBILITY.

ROOT app/ IS THE RUNTIME SOURCE TREE.

DO NOT CREATE SECOND SOURCES OF TRUTH OR SPECULATIVE SOURCE ARCHITECTURE.

PUBLIC ROUTES AND PERSISTENCE ARE COMPATIBILITY CONTRACTS.

ASSESSMENT WORKFLOW REMAINS COURSE-INDEPENDENT.

CLASSES RESOLVE CURRICULUM THROUGH COURSE CONTRACTS.

APPLICATION UI AND GENERATED DOCUMENTS ARE SEPARATE SYSTEMS.

ONE CANONICAL COMPILATION/PDF PIPELINE.

PUPIL IDENTITY PRIVACY MUST NOT BE WEAKENED CASUALLY.

HISTORICAL EXAM MATERIAL IS EVIDENCE ONLY.

NEVER COPY OR NEAR-COPY A HISTORICAL QUESTION.

DESIGN GENERATORS TO RESIST ACCIDENTAL REPRODUCTION OF KNOWN HISTORICAL QUESTIONS.

DO NOT COPY, TRACE OR STORE HISTORICAL ARTWORK FOR GENERATION.

OFFICIAL AWARDING-BODY NAMES/ACRONYMS DO NOT APPEAR IN AUTHORED REPOSITORY CONTENT.

NEUTRAL YEAR / PAPER / QUESTION LOCATORS ARE ALLOWED.

01 QUESTION CATALOGUE + 02 ANSWER CATALOGUE → 03 SKILL CATALOGUE → 04/05 GENERATION → 06 VISUALS.

HISTORICAL EVIDENCE IS STORED ONCE; SKILL CATALOGUE IS SYNTHESIS.

HISTORICAL EVIDENCE OUTRANKS PROJECT-AUTHORED TAXONOMY.

ONE PRIMARY SKILL OWNER PER MARK; SECONDARY RELEVANCE DOES NOT DOUBLE-COUNT.

STANDARD AND THINKING ARE INDEPENDENT CLASSIFICATIONS.

GENERATED ANSWERS USE THE EXACT GENERATED QUESTION STATE.

VERIFY PROPORTIONATELY TO RISK.

CURRENT DOCS CONTAIN CURRENT TRUTH; GIT/HISTORY PRESERVE THE PAST.

WHEN A LOCKED DECISION GENUINELY FAILS, SURFACE THE CONFLICT RATHER THAN DRIFTING.
```
