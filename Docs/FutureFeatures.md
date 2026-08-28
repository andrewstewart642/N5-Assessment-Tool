# N5 Assessment Tool — Future Features

**Document type:** Future idea / planned-work / deferred-work register  
**Status:** Active living document  
**Started:** 27 August 2026

---

## 1. Purpose

This file is the central place to record useful future ideas before they are implemented.

Use it when the thought is:

> This would be useful later — do not let me forget it.

Recording an item here does **not**:

- approve implementation;
- establish architecture;
- create a deadline;
- justify placeholder source folders;
- make the idea a locked decision.

Architecture should still be created only when real implementation begins.

Implemented work should move into:

```text
Docs/FeatureHistory.md
```

when it forms a meaningful product/technical checkpoint.

---

## 2. Suggested Statuses

Use lightweight statuses:

```text
IDEA
→ worth remembering; not yet designed

INVESTIGATE
→ useful idea but important product/technical questions remain

PLANNED
→ agreed direction; implementation intentionally deferred

DEFERRED
→ deliberately postponed until another dependency/priority is ready

PARKED
→ keep the idea, but do not actively prioritise it
```

When implemented, remove it from the active future list or mark it implemented and reference `FeatureHistory.md`.

---

## 3. How to Add an Idea

A useful entry can be very small:

```text
### Feature name
Status: IDEA
Area: My Assessments

One or two sentences explaining the idea and why it matters.
```

Do not fully design every idea at capture time.

---

# My Assessments

## FA-001 — Archive assessments by academic year

**Status:** PLANNED / DEFERRED  
**Area:** My Assessments

Allow teachers to archive older assessments by year so the active library does not become cluttered after several academic years.

Motivation:

> Teacher tools accumulate hundreds of documents over time. Old work should remain accessible without overwhelming the current-year library.

Likely user-facing concepts may include:

```text
Archive
Academic year grouping
Active vs archived library
Restore from archive
```

Exact data model and interaction should be designed when implementation begins.

The current Search / Status / Sort / Tile–List toolbar should be treated as the existing library foundation rather than replaced unnecessarily.

---

## FA-002 — Formal assessment finalisation workflow

**Status:** INVESTIGATE  
**Area:** My Assessments / Assessment lifecycle

The saved-assessment model currently supports Draft/Complete state.

Investigate whether the product should expose a clearer explicit workflow for finalising an assessment rather than treating the status as passive metadata.

Questions to answer later:

- What action makes an assessment Complete?
- Can a completed assessment be reopened as Draft?
- Does finalisation freeze anything or merely change status?
- Should PDF generation/printing affect status?

Do not invent behaviour until this is deliberately designed.

---

# Assessment Creator

## FA-003 — Compile readiness signalling

**Status:** PLANNED / DEFERRED  
**Area:** Assessment Creator / HUDBar

The current Compile button is visually complete but does not yet communicate readiness beyond its normal state.

Agreed direction for a future enhancement:

```text
assessment becomes ready
        ↓
one restrained brighter pulse / glow
        ↓
richer but static ready state
```

Avoid continuous attention-grabbing animation.

Readiness rules themselves must be defined before implementation.

---

## FA-004 — Compile-time duration reconciliation

**Status:** IDEA / INVESTIGATE  
**Area:** Assessment Creator / Compilation / Paper Sitting

Paper Sitting currently calculates intended end time from configured assessment intent, and a teacher may manually override End.

A future Compile-stage check could compare the final assessment marks/duration with the intended sitting duration and surface a discrepancy when useful.

Teacher-entered manual overrides should remain respected; this should be a reconciliation/notice workflow, not silent rewriting.

---

# Application Shell / Account

## FA-005 — Account / login controls in HeaderBar right region

**Status:** PARKED  
**Area:** Application Shell

The HeaderBar's right-hand region is intentionally empty and reserved for future application/account controls.

Potential future use includes login/account identity once authentication/account architecture is designed.

Do **not** design or pre-build account UI merely because the space is reserved.

---

# Courses and Qualification Expansion

## FA-006 — Higher Mathematics Course

**Status:** IDEA  
**Area:** Courses

Add Higher Mathematics as a sibling Course implementation when product priorities justify it.

Architecture expectation:

```text
app/Courses/HigherMaths/
```

only once real implementation begins.

The existing generic Assessment Creation workflow should be reused rather than cloned.

Do not pre-create an empty Higher Course tree.

---

## FA-007 — Advanced Higher Mathematics Course

**Status:** IDEA  
**Area:** Courses

Potential future sibling Course after the generic Course architecture has been exercised by another real qualification.

Do not create placeholder source architecture before implementation begins.

---

## FA-008 — National 5 Applications of Mathematics expansion

**Status:** IDEA / INVESTIGATE  
**Area:** Courses

A National 5 Applications of Mathematics Course owner already exists.

Future work may expand its real assessment configuration, skills, documents and question/answer generation as required.

Only add substructure when genuine Course functionality exists; do not mechanically mirror National 5 Maths for symmetry.

---

# Scanning, Marking and Pupil Workflow

## FA-009 — QR-coded assessment scripts

**Status:** IDEA / INVESTIGATE  
**Area:** Future marking workflow

Explore adding QR-coded identifiers to generated assessment pages so scanned pupil scripts can be associated with the correct assessment/page/pupil identifier without requiring pupil names in server-visible document metadata.

Any implementation must preserve the privacy model around pupil identity.

---

## FA-010 — Batch scanned-script ingestion

**Status:** IDEA / INVESTIGATE  
**Area:** Future marking workflow

Explore a teacher workflow for scanning a batch of completed scripts into PDF and automatically separating/identifying scripts/pages using generated identifiers such as QR codes.

This should be designed as a real workflow before any source architecture is created.

---

## FA-011 — OCR-assisted marking foundation

**Status:** IDEA / INVESTIGATE  
**Area:** Future marking workflow

Longer-term concept: use OCR/recognition to assist marking of scanned pupil responses.

The intended direction is assistance rather than pretending fully automatic marking is reliable from day one.

Early concepts discussed include:

- local/controlled OCR where practical;
- teacher review/correction;
- collecting teacher-marked examples as useful training/evaluation data;
- incrementally improving recognition/marking support from real marked work.

Do not create speculative OCR/AI source folders until implementation responsibilities are understood.

---

## FA-012 — Teacher-marked training/evaluation dataset

**Status:** IDEA / INVESTIGATE  
**Area:** Future marking workflow

If OCR/AI-assisted marking progresses, investigate using teacher-confirmed marks/annotations from an early pilot as the highest-quality source of training/evaluation examples.

A possible early pilot scale previously discussed was approximately 10–15 teachers, but this is not a committed rollout number.

Data governance, consent, retention, anonymisation and GDPR requirements must be designed before collecting data.

---

## FA-013 — AI-assisted marking

**Status:** LONG-TERM IDEA  
**Area:** Future marking workflow

Explore AI support for suggesting marks/feedback from scanned responses after sufficient OCR, evaluation and teacher-reviewed evidence exists.

Principles:

- teacher remains able to review/override;
- reliability must be measured rather than assumed;
- launch should not depend on “magical robot marking” being perfect;
- privacy/data governance must be part of architecture from the beginning.

This is a long-term product direction, not a near-term implementation instruction.

---

# Privacy and Pupil Identity

## FA-014 — Local pupil-ID → name mapping workflow

**Status:** PLANNED PRINCIPLE / FUTURE UX  
**Area:** Classes / future pupil workflow

Maintain the privacy approach where the application can operate on anonymous/non-identifying pupil IDs while the pupil-ID → pupil-name mapping remains local to the teacher's device where practical.

Future pupil/scanning/marking UX should make this model easy for teachers rather than weakening it for convenience.

Any proposal to transmit/store pupil names more broadly requires explicit privacy review.

---

# Technical / Maintenance Follow-Up

## FA-015 — Remove remaining obsolete SettingsDrawer compatibility files

**Status:** DEFERRED MAINTENANCE  
**Area:** Application UI

Global Settings now uses Application Settings + Activity Rail/Shell ownership.

A small historical `app/UI/Application/SettingsDrawer/` compatibility area remains in the repository.

Audit its remaining consumers and remove/rehome files only when proven safe.

Do not treat the folder's existence as permission to build new global Settings functionality there.

---

## FA-016 — Continue targeted Course-independence audits

**Status:** PARKED MAINTENANCE  
**Area:** Assessments / Courses

Architecture V2 established Course-independent generic workflows, but future feature work should continue to watch for concrete National 5 Maths imports leaking into generic Assessment/Classes code.

When a real seam is encountered:

```text
confirm it is genuinely Course-specific
        ↓
add/extend a Course contract if justified
        ↓
switch the consumer
        ↓
verify
```

Do not launch another repository-wide “Course independence refactor” without a concrete problem.

---

# Application Shell / Planning

## FA-017 — Teacher assessment calendar in the side action area

**Status:** IDEA  
**Area:** Application Shell / My Assessments / assessment planning

Explore a teacher-facing calendar accessible from the application's side action/Activity Rail area so upcoming and planned assessment dates can be viewed at a glance.

The calendar could potentially show whether an assessment is:

```text
planned/upcoming
completed
ready for print
```

or equivalent meaningful readiness/status information once the assessment lifecycle/finalisation model is defined.

This idea should build on existing assessment dates and library status rather than creating a second assessment record system.

The exact owner, status semantics and interaction should be designed when implementation begins. This entry preserves the earlier loose idea without establishing source architecture prematurely.

---

# Product / UI Ideas to Capture Later

This section intentionally remains lightweight.

When a new idea appears during normal development, add it here rather than relying on chat history or memory.

Good candidates include:

- a workflow improvement the team deliberately postpones;
- an idea discovered while polishing another feature;
- an enhancement which depends on a future system;
- technical debt worth remembering but not worth expanding the current pass to fix.

Do not add speculative ideas merely to make the roadmap look larger.

---

# Implemented / Moved to Feature History

When an item is implemented, either remove it from the active sections or record a short pointer here, for example:

```text
FA-XXX — Implemented 2026-09-01
→ See Docs/FeatureHistory.md
```

The active future list should remain useful rather than becoming another historical ledger.

---

# National 5 Mathematics Catalogue / Generation Programme — Added 28 August 2026

The following entries capture work that is deliberately **not yet complete** after the 2014 Question Catalogue pilot. The architecture itself is established; these entries describe the next population, reconciliation and retirement stages.

## FA-018 — Populate the Answer Catalogue from historical marking schemes

**Status:** PLANNED  
**Area:** National 5 Maths / `02_AnswerCatalog`

Catalogue the matching historical answers/marking schemes as first-class evidence paired to each Question Catalogue entry.

The Answer Catalogue should model the marking scheme as a structured evidence system rather than a single linear worked solution. It should support method pathways, mark nodes, dependencies, implied evidence, follow-through, answer-only rules, alternative methods, exactness/rounding, units, notation, diagram evidence, common-result rules and cross-question/general marking policy where the source supports them.

Question and Answer files remain physically separate for navigability while the Question Paper and matching Marking Scheme are analysed as a paired evidence unit.

The 2014 Question entries currently remain `IN_PROGRESS` until their matching Answer/MS catalogue pass is completed and cross-checked.

---

## FA-019 — Extend full-fidelity Question cataloguing across the historical corpus

**Status:** PLANNED  
**Area:** National 5 Maths / `01_QuestionCatalog`

After the 2014 pilot contracts and workflow have survived the Answer Catalogue stress test, extend the same evidence standard through the remaining historical corpus:

```text
2015
2016
2017
2018
2019
2021
2022
2023
2024
2025
```

There is no 2020 National 5 examination paper in the intended corpus because of the COVID cancellation.

The known corpus contains 337 numbered Questions across 2014–2019 and 2021–2025. Population should remain year/paper based and should not trade completeness for speed.

---

## FA-020 — Reconcile the National 5 Maths Skills Tree after corpus cataloguing

**Status:** PLANNED / DEFERRED UNTIL CATALOGUE PHASE COMPLETES  
**Area:** National 5 Maths / Skills

Historical examination evidence is treated as authoritative evidence of what actually appeared. The project-authored Skills Tree is useful infrastructure but can contain incorrect paper-suitability or classification assumptions.

The 2014 Paper 1 pilot already exposed examples where historical Questions conflict with current Skills Tree paper-suitability metadata.

Do **not** distort catalogue evidence to make it agree with the current Skills Tree. Record the historical fact and flag the mismatch. Reconcile the Skills Tree systematically after enough corpus evidence has been catalogued to make the correction evidence-led rather than reactive.

---

## FA-021 — Populate `03_QuestionGeneration` from catalogue knowledge

**Status:** PLANNED / DEFERRED UNTIL CATALOGUE EVIDENCE IS SUFFICIENT  
**Area:** National 5 Maths / Question Generation

Build original Question generators from the normalised structural knowledge learned from the historical Question + Answer catalogues.

Generation must consume semantic/catalogued knowledge rather than historical wording or artwork. It should produce Builder/Assessment-native Question objects only after the catalogue layer has described the relevant family, constraints, difficulty, response space, representations and safe parameter variation.

The earlier successful trig-equation prototype remains evidence that catalogue-informed generation is viable, but the new workflow should be populated against the full-fidelity contracts rather than restoring the narrow legacy generation layout.

---

## FA-022 — Populate `04_AnswerGeneration` and downloadable marking-scheme output

**Status:** PLANNED / DEFERRED UNTIL ANSWER CATALOGUE EVIDENCE IS SUFFICIENT  
**Area:** National 5 Maths / Answer Generation

Generate original worked answers and illustrative marking-scheme structures from catalogued marking knowledge, linked to generated Questions.

The generation layer should preserve legitimate alternative methods, mark dependencies, follow-through and presentation requirements without copying historical marking-scheme wording.

This should ultimately support both in-application answers and downloadable marking-scheme-style documents through the existing document/Compilation architecture.

---

## FA-023 — Build out deterministic visual renderer families and context-asset bank

**Status:** PLANNED / INVESTIGATE DURING GENERATION WORK  
**Area:** National 5 Maths / `05_VisualAssets`

Implement the renderer families required by the visual evidence catalogue, prioritising deterministic procedural SVG for mathematical schematics such as geometry, circles, graphs, scattergraphs, vectors, bearings, coordinate diagrams, solids and response surfaces.

Context photographs/illustrations should come from an approved/licensed asset bank with licence metadata where a contextual image is useful. Historical source artwork and exact source geometry must not be used as generation templates.

Runtime AI image generation is not required for essential mathematical diagrams.

---

## FA-024 — Retire `National5MathsLegacy` and the temporary TypeScript alias bridge

**Status:** DEFERRED MAINTENANCE / MIGRATION END STATE  
**Area:** National 5 Maths / Course integration

The current runtime continues to resolve historical National 5 Maths imports through a temporary TypeScript path bridge into:

```text
app/Courses/National5MathsLegacy/
```

while the clean workflow architecture is built in:

```text
app/Courses/National5Maths/
```

Remove the bridge and legacy tree only after the clean Skills, Course config, Documents, catalogue/generation and runtime consumers have been migrated or replaced and the application is verified end-to-end.

Do not delete the legacy tree merely because Explorer hides it or because the clean catalogue workspace now exists.

---

## FA-025 — Tighten catalogue completeness validation after the pilot transition

**Status:** PLANNED  
**Area:** National 5 Maths / catalogue contracts

Several evidence fields added during the 2014 pilot are intentionally transitional/optional so the contract could be strengthened without breaking pre-rewrite entries.

Once the pilot Question + Answer passes establish the final evidence standard, tighten validation so reviewed catalogue entries cannot silently omit required response-space measurement, part-demand, calculator, language or other mandatory evidence fields.

Do this after the contract has survived real historical variety rather than prematurely hardening assumptions from one Question family.
