# N5 Assessment Tool — Agent Instructions

## 1. Purpose

This file is the first set of repository instructions for any coding agent working on the N5 Assessment Tool.

Read it before making changes.

For deeper information, use:

```text
Docs/Architecture.md
Docs/RepositoryMap.md
Docs/LockedDecisions.md
Docs/ChatGPTWorkflow.md
Docs/RefactorLedger.md
Docs/FeatureHistory.md
Docs/FutureFeatures.md
```

Use those documents for their intended purposes:

```text
Architecture.md
→ current architecture and dependency rules

RepositoryMap.md
→ where current code lives and what each area owns

LockedDecisions.md
→ decisions that should not be casually reopened

ChatGPTWorkflow.md
→ safe AI-assisted development workflow

RefactorLedger.md
→ historical Architecture V2 migration record

FeatureHistory.md
→ chronological record of meaningful product/technical feature changes

FutureFeatures.md
→ central backlog for future ideas, planned work and deferred concepts
```

`RefactorLedger.md` contains historical paths and migration states. Do not treat those historical states as current architecture.

---

## 2. Current Development Phase

Architecture V2 has been substantially completed.

The repository is no longer in a broad architecture-migration phase. The current default mode is:

```text
current architecture
        ↓
feature development
        ↓
feature refinement
        ↓
maintenance / targeted refactor where justified
```

Do not reopen completed Architecture V2 decisions merely because an older structure was once familiar.

Structural cleanup is still valid when a real ownership or dependency problem is found, but it should now normally support a concrete feature or maintenance goal rather than becoming a repository-wide migration by default.

---

## 3. Product

The application is an assessment-building and assessment-management tool.

The current product workflow includes:

```text
select/configure assessment
        ↓
build assessment
        ↓
preview assessment
        ↓
save assessment
        ↓
manage assessment library
        ↓
compile / generate PDF
```

Class and Course systems support the assessment workflow.

The architecture is intended to support multiple Courses without making generic Assessment workflows depend directly on one Course implementation.

Do not introduce or infer a product/brand name from historical identifiers. Historical internal names may remain in compatibility code or persisted keys; they are not current branding guidance.

---

## 4. Acceptance Criterion Zero

Preserve working product behaviour unless behavioural change is explicitly requested.

Do not remove functioning features merely because code is being cleaned up or moved.

Preserve, where applicable:

- public URLs;
- assessment creation behaviour;
- question generation;
- paper switching;
- interactive previews;
- saved assessments;
- My Assessments library behaviour;
- class data;
- generated documents and PDFs;
- application settings;
- persisted browser data;
- backwards compatibility for existing records.

Do not delete code merely because its name looks old. Prove that it is dead first.

---

## 5. Runtime Source Root

All runtime source lives beneath:

```text
app/
```

Current high-level ownership structure:

```text
app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── Home/
├── MyAssessments/
├── UI/
├── layout.tsx
└── page.tsx
```

There is no runtime `src/` tree. Do not recreate one.

Global application CSS is owned by:

```text
app/UI/Application/Styles/ApplicationGlobals.css
```

---

## 6. Primary Ownership Areas

The primary product/runtime owners are:

```text
app/Assessments/
app/Classes/
app/Courses/
app/DeveloperTools/
app/Home/
app/MyAssessments/
app/UI/
```

Use responsibility to decide ownership.

Do not choose an owner merely because it produces the shortest import path.

`app/Home/` owns the Home-page product experience. Reusable application-wide UI used by Home remains owned by `app/UI/Application/` where appropriate.

---

## 7. Assessments

Generic Assessment workflow belongs beneath:

```text
app/Assessments/
```

Major areas include:

```text
Compilation/
Creation/
Questions/
SavedAssessments/
AssessmentTypes.ts
```

Assessments owns generic assessment workflow and persistence contracts.

It should not own Course-specific educational knowledge.

The user-facing assessment library no longer belongs under Assessments; it is now owned by the first-class `app/MyAssessments/` domain.

---

## 8. Assessment Creation

Assessment Creation lives beneath:

```text
app/Assessments/Creation/
```

Main entry points include:

```text
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
```

Established areas include responsibilities such as:

```text
Analysis/
AssessmentSettings/
Feedback/
HUDBar/
Papers/
PaperWorkspace/
Persistence/
Questions/
Setup/
SkillsPanel/
TopBar/
```

Use existing owners before creating new generic folders.

The post-Architecture-V2 naming pass deliberately made these folders responsibility-readable. Within an established folder, prefer concise filenames that describe the responsibility supplied by that folder rather than repeating the whole parent path.

---

## 9. Product UI Terminology

Use recognised current terminology such as:

```text
HeaderBar
ActivityRail
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Preview Tray
Drawer
Popover
```

Meaning:

```text
HeaderBar
→ global application header

ActivityRail
→ global vertical application rail beneath the header

TopBar
→ upper Assessment Creation region

HUDBar
→ lower Assessment Creation region

SkillsPanel
→ assessment skill-selection region

PaperWorkspace
→ central Assessment Creation workspace

Preview Tray
→ PDF-workspace pull-out controls such as Settings and View
```

Do not revive old Builder terminology as source architecture.

---

## 10. Builder Compatibility

The public URL:

```text
/create-assessment/builder
```

still exists.

Persisted keys and internal routing tokens may contain historical terminology.

That does not mean new source should be placed in folders such as:

```text
Builder/
BuilderComponents/
BuilderLogic/
```

Current source terminology is Assessment Creation.

Public/persisted compatibility wording may differ from source terminology.

---

## 11. Assessment Compilation

Compilation lives beneath:

```text
app/Assessments/Compilation/
```

Compilation is separate from Creation.

Creation determines assessment content.

Compilation converts saved assessment content into a canonical compilation model, paginated document structure, rendered pages and generated PDF output.

Current major responsibilities include:

```text
Model/
Pagination/
Rendering/
PDF/
```

Do not merge Creation and Compilation merely because they consume the same assessment data.

---

## 12. PDF Generation

Server-generated assessment PDFs belong beneath:

```text
app/Assessments/Compilation/PDF/
```

The current pipeline uses the canonical compilation document and rendered assessment document, produces standalone HTML, launches Chromium through Puppeteer, and returns PDF bytes through the PDF generation route.

Client-side PDF asset/cache logic also belongs with the PDF compilation system where it represents generated assessment PDF assets rather than My Assessments presentation.

My Assessments may consume those assets for previews without owning the generation pipeline.

Do not create a second independent assessment-PDF renderer for library previews.

---

## 13. Saved Assessments

Persistent saved-assessment data belongs beneath:

```text
app/Assessments/SavedAssessments/
```

Keep the distinction:

```text
SavedAssessments
→ persistence, storage contracts, saved assessment records

MyAssessments
→ user-facing library, browsing, filtering, preview and management workflow
```

---

## 14. My Assessments

The My Assessments feature is a first-class product owner beneath:

```text
app/MyAssessments/
```

Current responsibilities include:

```text
Actions/
Display/
Library/
ListView/
Preview/
TileView/
Toolbar/
MyAssessmentsPage.tsx
```

My Assessments owns presentation and interaction for the assessment library, including tile/list views, library controls, assessment metadata display, PDF preview interaction, and user-facing assessment actions.

Current responsibility-readable library modules include `Display/LabelsAndDates.ts`, `Display/Progress.ts`, `Library/Filtering.ts`, `Library/Sorting.ts` and `Library/ViewOptions.ts`.

It should consume saved-assessment and compilation/PDF contracts rather than duplicating them.

---

## 15. Generic Questions

Generic Assessment question contracts belong beneath:

```text
app/Assessments/Questions/
```

Responsibilities may include:

```text
Content/
Generation/
Preview/
Selection/
```

Course-specific question-writing logic does not belong here.

---

## 16. Classes

Class-owned functionality belongs beneath:

```text
app/Classes/
```

Current high-level structure is:

```text
app/Classes/
├── Coverage/
├── MyClasses/
├── Records/
├── ClassData.ts
├── ClassDetailsPage.tsx
└── MyClassesPage.tsx
```

`Records/` owns class browser storage, normalisation and the live class collection. `MyClasses/` owns the My Classes page-specific UI. `Coverage/` owns coverage selection, display and skill-progress behaviour.

Classes owns class data, persistence, coverage, My Classes and Class Details.

Keep Class-specific workflow separate from Assessment persistence and Course educational definitions.

---

## 17. Classes Must Be Course-Aware, Not Course-Specific

Class coverage should resolve educational structure through Course configuration, conceptually:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

Do not make generic Classes code directly depend on concrete National 5 Maths skills when the Course abstraction can provide the information.

---

## 18. Courses

Educational and Course-specific knowledge belongs beneath:

```text
app/Courses/
```

Generic Course infrastructure includes concepts such as:

```text
CourseAssessmentConfig
CourseCatalog
CourseRegistry
CourseTypes
Papers
Selection
Documents
```

Course-specific implementation belongs beneath:

```text
app/Courses/<Course>/
```

---

## 19. CourseId Ownership

`CourseId` is owned by the Course domain.

Import it directly from its owner.

Do not re-export it from Assessment files merely for convenience and do not create parallel Course ID types.

---

## 20. Course Registry Terminology

Use the canonical Course Registry API and current names in source.

Do not reintroduce retired Course configuration aliases unless a real compatibility requirement appears.

---

## 21. National 5 Mathematics

National 5 Mathematics knowledge belongs beneath:

```text
app/Courses/National5Maths/
```

Current high-level responsibilities include:

```text
AssessmentConfig.ts
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/
Skills/
```

Generic Assessment code should consume this knowledge through Course contracts where possible.

---

## 22. National 5 Maths Skills

The canonical National 5 Maths skills definition lives beneath:

```text
app/Courses/National5Maths/Skills/
```

Do not create another skills tree elsewhere for convenience.

---

## 23. Historical Exam Material

Historical exam question and marking-scheme catalogues belong beneath:

```text
app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/
```

Historical exam evidence and generated-question implementation are separate responsibilities.

---

## 24. Question and Answer Generation

National 5 Maths generation implementation belongs beneath:

```text
app/Courses/National5Maths/QuestionAndAnswerGeneration/
```

Use current concepts such as:

```text
QuestionWriting
AnswerWriting
AnswerMethods
ExamQuestion
ExamMarkingScheme
```

Do not revive the retired Question Bank architecture.

---

## 25. Question Bank Is Retired

Do not recreate:

```text
app/question-bank/
```

Future generation work should extend Course-owned generation architecture rather than creating a parallel question-bank domain.

---

## 26. Course Documents

Course-specific document composition belongs beneath the relevant Course.

For National 5 Maths:

```text
app/Courses/National5Maths/Documents/
```

Course-specific document concerns may include cover-page composition, formula sheets, question pages, question spacing and Course document registration.

Generic document infrastructure does not belong here.

---

## 27. UI Architecture

UI is divided into:

```text
app/UI/
├── Application/
└── Documents/
```

This separation is important.

---

## 28. Application UI

Interactive application presentation belongs beneath:

```text
app/UI/Application/
```

Current areas include responsibilities such as:

```text
Colours/
Components/
HeaderBar/
Motion/
Settings/
SettingsDrawer/
Shell/
Styles/
Theme/
Typography/
```

Home-page product implementation is owned separately by `app/Home/`; reusable application-level presentation used by Home may still come from `app/UI/Application/`.

The global shell is owned here. `app/layout.tsx` composes the HeaderBar, application Activity Rail and page content region through the application shell tokens.

Application UI owns interactive product presentation, not generated-document layout.

Some compatibility/legacy UI folders may remain until their consumers are deliberately removed. Do not infer that every existing folder is the preferred owner for new work.

---

## 29. Global Settings and Shell

Global application settings are accessed through the Application Shell/Activity Rail rather than being treated as Assessment Creation settings.

Keep global appearance/settings concerns beneath `app/UI/Application/`.

Assessment-specific Settings/View controls belong with the assessment workspace/preview experience, not the global application settings system.

Do not merge these two settings concepts.

---

## 30. Documents UI

Generated-document presentation belongs beneath:

```text
app/UI/Documents/
```

Current major areas include:

```text
Components/
Layout/
Templates/
```

The generated-document system is distinct from interactive application UI.

---

## 31. Document Dependency Direction

Preserve this layering:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers / compilation
```

Examples:

```text
app/UI/Documents/Components/
app/UI/Documents/Templates/NationalQualifications/
app/Courses/National5Maths/Documents/
app/Assessments/Compilation/
```

Do not invert this dependency direction.

---

## 32. Application vs Documents Boundary

Code beneath:

```text
app/UI/Documents/
```

should not depend on:

```text
app/UI/Application/
```

Generated documents should not depend on application navigation, drawers, hover state or global application presentation.

An interactive Assessment/My Assessments preview may use Application UI styling where that styling belongs to the editor/library experience.

---

## 33. Developer Tools

Runtime developer functionality belongs beneath:

```text
app/DeveloperTools/
```

This is runtime source.

Repository tooling, if introduced later, must remain conceptually separate from runtime developer tools.

---

## 34. Architecture V2 and Migration History

Architecture V2 is substantially complete.

Historical migration tooling has been removed where it was no longer required.

Migration history belongs in:

```text
Docs/RefactorLedger.md
Git history
```

Do not rewrite historically accurate ledger entries simply to make old paths look current.

Do not use the Refactor Ledger as the active feature backlog.

New meaningful product changes should be recorded in `Docs/FeatureHistory.md`.

Future ideas belong in `Docs/FutureFeatures.md`.

---

## 35. Routing

Public application URLs are defined through internal rewrites in:

```text
next.config.ts
```

Those rewrites dispatch into:

```text
app/page.tsx
```

`app/page.tsx` is the thin application routing adapter.

Do not recreate duplicate route-shaped feature folders solely to represent URLs.

Feature implementation belongs beneath its product owner.

Historical internal rewrite parameter names may remain for compatibility. Do not interpret an old internal identifier as current product branding.

---

## 36. Next.js Special Filenames

Inside `app/`, filenames such as:

```text
page.tsx
layout.tsx
route.ts
loading.tsx
error.tsx
not-found.tsx
template.tsx
default.tsx
```

have framework meaning.

Do not use them casually inside product folders.

Use descriptive implementation names unless a real Next.js route/framework boundary is intended.

`route.ts` is valid where an actual route-handler boundary exists, such as server PDF generation.

---

## 37. `"use client"`

Add `"use client"` only at genuine client entry boundaries.

Do not add it to every nested component or module merely because it uses hooks, browser APIs or event handlers.

Internal modules imported below an existing client boundary inherit the client environment.

Do not add `"use client"` defensively.

A needless client boundary can create Next.js serialisation warnings for ordinary callback props.

---

## 38. Persistence Is a Compatibility Contract

Browser-persisted data survives source refactors.

Do not rename storage keys or persisted fields merely because they contain old terminology.

Before changing persisted data, investigate:

- existing keys;
- existing saved records;
- normalisation;
- backwards compatibility;
- optional legacy fields;
- migration requirements.

A persistence migration is a separate deliberate change.

---

## 39. Compatibility Code

Do not delete compatibility code merely because comments contain words such as `legacy`, `compatibility`, `transitional` or `backwards compatibility`.

First determine what it supports.

Possible reasons include persisted data, active event wiring, old saved assessments, old class records, routing compatibility and Course metadata compatibility.

Remove compatibility only after its consumers have been migrated or proven absent.

---

## 40. Dead Code Investigation

Before deleting a file, symbol or compatibility layer, check more than direct imports.

Investigate:

```text
direct imports
re-exports
registries
dynamic imports
string lookup
route dispatch
browser events
persistence
Course registration
generated-data consumers
```

Absence from one grep is not always proof of dead code.

---

## 41. Ownership Before Movement

Before moving a file, answer:

> Which domain owns this responsibility?

Use:

```text
Assessments
→ generic assessment workflow, compilation and persistence

MyAssessments
→ assessment-library UI/workflow

Classes
→ class data/workflow

Courses
→ educational/Course knowledge

Home
→ Home-page product experience

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation

DeveloperTools
→ runtime developer tooling
```

Do not move a file simply because many consumers happen to exist elsewhere.

---

## 42. Type Ownership

Types belong with the concept they describe.

Examples:

```text
Course types
→ app/Courses/

Class data/types
→ app/Classes/ClassData.ts and the Classes domain

Assessment types
→ app/Assessments/

question content contracts
→ app/Assessments/Questions/Content/

generation contracts
→ app/Assessments/Questions/Generation/
```

Do not create a global `shared-types/` bucket.

---

## 43. Avoid Generic Buckets

Do not introduce broad dumping grounds such as:

```text
Helpers/
Utils/
Shared/
Common/
Misc/
math-helpers/
shared-types/
```

without a durable architectural responsibility.

Prefer domain-specific ownership.

The same principle applies to filenames: avoid `SomethingUtils.ts` or `SomethingHelpers.ts` when the file can be named for the concrete responsibility it owns.

---

## 44. No Placeholder Architecture

Do not create empty folders for hypothetical future work.

Examples include new Course implementations before real work begins, OCR infrastructure before implementation begins, or AI-marking folders before implementation begins.

Record ideas in:

```text
Docs/FutureFeatures.md
```

Create source architecture only when real implementation requires ownership.

---

## 45. New Courses

When implementing another Course, place real Course-specific functionality beneath:

```text
app/Courses/<Course>/
```

Expose it through generic Course contracts where appropriate.

Do not copy the entire National 5 Maths tree merely to make folders symmetrical.

Only create real responsibilities.

---

## 46. Feature Development Workflow

The normal development mode is now feature-led.

For non-trivial feature work, prefer:

```text
UNDERSTAND CURRENT BEHAVIOUR
        ↓
IDENTIFY OWNER
        ↓
DEFINE SMALL PASS
        ↓
IMPLEMENT
        ↓
TYPE-CHECK
        ↓
BROWSER TEST
        ↓
BUILD WHEN APPROPRIATE
        ↓
DOCUMENT MEANINGFUL CHANGE
```

Keep unrelated feature changes out of the same pass where practical.

For UI work, incremental visual passes are preferred over large speculative redesigns.

---

## 47. Structural Refactor Workflow

When a genuine non-trivial migration is required, retain the Architecture V2 safety pattern:

```text
AUDIT
  ↓
OWNER
  ↓
WRITE NEW
  ↓
TYPE-CHECK
  ↓
SWITCH CONSUMER
  ↓
VERIFY
  ↓
BROAD GREP
  ↓
DELETE OLD
  ↓
VERIFY AGAIN
  ↓
DOCUMENT
  ↓
COMMIT
```

Do not delete the old implementation before the replacement path is working.

---

## 48. Work in Small Visible Steps

Prefer small, understandable changes.

Before mutation:

- establish the current state;
- identify the owner;
- identify consumers;
- explain what will change when collaboration requires it.

Avoid large unexplained mutation scripts.

Automation is acceptable for genuinely repetitive mechanical work, but the scope and operation must be clear first.

For file-renaming batches, use `git mv` plus explicit import-path repair rather than broad symbol replacement. A filename change must not accidentally rename exported React hook identifiers or other symbols merely because they share the old filename text.

---

## 49. Source File Changes

When practical, provide or create complete replacement files rather than fragile chains of tiny text substitutions.

Use surgical edits when the file is genuinely very large, the change is tiny, and a full replacement would make review harder.

Preserve surrounding behaviour.

Mechanical file/folder renames are an exception: use a clear rename map, update import paths only, then verify the entire TypeScript graph.

---

## 50. Verification Commands

After structural TypeScript/source work, normally run:

```bash
npx tsc --noEmit
npm run lint
npm run build
git --no-pager diff --check
```

For focused UI passes, TypeScript plus lint/browser verification may be sufficient during iteration, but a clean production build should be obtained before treating infrastructure or release-level work as complete.

Use `git --no-pager ...` for Git output that could otherwise enter a pager during scripted verification.

---

## 51. Git Line-Ending Warnings

On Windows, Git may report messages such as:

```text
LF will be replaced by CRLF the next time Git touches it
```

These are not automatically diff errors.

For whitespace validation, use:

```bash
git --no-pager diff --check
```

or, for staged changes:

```bash
git --no-pager diff --cached --check
```

Distinguish warnings from actual whitespace errors.

---

## 52. Next.js Generated Types and Build State

After route/framework changes, `.next` output may temporarily describe an old state.

If TypeScript or Turbopack errors clearly point to stale generated output after a valid source change, rebuild or clear `.next` before rewriting correct source.

Do not use cache deletion as a substitute for diagnosing a reproducible source error.

---

## 53. Browser and DevTools Verification

Type-check and build are not sufficient for final sign-off after substantive changes.

Verify important workflows in the browser.

Major checks include:

```text
Home
Assessment Setup
Assessment Creator
question generation
paper switching
assessment preview
Preview Tray
application settings
saved assessments
Compilation
PDF generation/download
My Assessments tile view
My Assessments list view
My Assessments PDF preview
My Classes
Class Details
```

When a browser-to-server feature fails, use browser DevTools Network/Console plus the development-server stack trace rather than guessing.

If document infrastructure changed, visually inspect generated pages/PDFs as well.

---

## 54. Visual Preservation and Current UI Direction

Structural changes should not accidentally alter spacing, typography, colours, paper layout, question positioning, cover-page layout, formula-sheet layout or interactive behaviour.

When UI change is intentional, follow the established application direction:

- compact desktop/workbench presentation;
- restrained surface contrast;
- modest radii, generally around 4–6px for controls/panels;
- thin borders;
- restrained blue accent;
- clear visual hierarchy rather than decorative chrome;
- consistent behaviour across dark, soft-grey and light appearance modes.

Generated assessment documents remain visually separate from the application workbench aesthetic.

---

## 55. Course Independence Check

When changing generic Assessment code, ask:

> Is this rule genuinely generic, or is it National 5 Maths knowledge?

If it is Course-specific, prefer ownership beneath:

```text
app/Courses/<Course>/
```

---

## 56. Classes Independence Check

When changing Classes, ask:

> Could this work for another registered Course without importing that Course's concrete skills file?

If not, resolve the information through Course configuration instead.

---

## 57. Document Independence Check

When changing generated-document UI, ask:

> Does this belong to a generic document, a qualification family, or a specific Course?

Use the correct layer.

Do not put Course-specific layout into generic document primitives.

---

## 58. Do Not Infer Current Architecture from Legacy History

Legacy code and historical migration files are evidence. They are not precedent.

Use:

```text
Docs/RepositoryMap.md
Docs/Architecture.md
Docs/LockedDecisions.md
```

as current architectural guidance.

Use:

```text
Docs/RefactorLedger.md
Git history
```

as migration history.

Use:

```text
Docs/FeatureHistory.md
```

for post-refactor product/technical evolution.

---

## 59. Documentation Changes

When architecture changes, update the relevant current-state documentation.

When a meaningful feature is completed or materially changed, add a concise entry to:

```text
Docs/FeatureHistory.md
```

When a future idea is identified but not yet implemented, record it in:

```text
Docs/FutureFeatures.md
```

Do not blindly replace historical paths inside `Docs/RefactorLedger.md` if those paths accurately describe what existed at that stage of the migration.

History should remain historically accurate.

Documentation reconciliation is information-preserving by default. Add current knowledge, correct current-state falsehoods, and explicitly supersede contradictory rules. Do not remove useful rationale, compatibility notes or historical truth merely to make the documents shorter.

---

## 60. Keep Structural and Feature Changes Understandable

Do not mix unrelated feature work and structural migration without need.

A structural pass should normally be easy to evaluate as:

```text
same behaviour
+
clearer ownership / dependency direction
```

A feature pass should be easy to evaluate in terms of the user-visible or system capability it introduces.

---

## 61. Final Standard

A good change should leave the repository easier for the next developer to understand.

Before finishing, ask:

- Is ownership clearer?
- Is dependency direction clear?
- Did working behaviour survive where it was meant to?
- Did persisted data survive?
- Did public routing survive?
- Is there one obvious source of truth?
- Did we avoid creating another compatibility layer unnecessarily?
- Did we remove old code only after proving it safe?
- Do folder and filename choices reveal responsibility without requiring implementation knowledge?
- Does the documentation still match the repository?
- If this was feature work, is the feature history/backlog now accurate?

If not, the change is not finished.

---

## 62. File and Folder Naming / Discoverability

The repository naming rule is:

> **Folder = context. Filename = responsibility.**

File and folder names optimise for discoverability by responsibility, not implementation mechanism. A developer — or a non-developer who understands the product — should be able to browse the tree and make a sensible guess about what a file owns.

Apply these rules:

- Do not prefix a filename with `use` merely because it exports a React hook. The exported hook function must still obey React convention (`useSomething`), but the filename describes responsibility. Example: `AutoSaveAssessment.ts` may export `useAssessmentCreatorAutoSave`.
- Do not repeat the entire parent-folder context in every child filename. Prefer `Preview/Pane.tsx` over `Preview/AssessmentPreviewPane.tsx` when the folder already supplies the missing meaning.
- Keep contextual wording when removing it would make the filename misleading or excessively generic. `Papers/PaperRules.ts` is acceptable when plain `Rules.ts` would lose useful meaning.
- Prefer responsibility names over implementation-detail names such as `Utils`, `Helpers`, `Common`, `Shared` or `Misc`.
- Folder names describe durable domains, product regions or coherent responsibilities. Do not introduce a generic `Components/` or `State/` bucket when a more meaningful owner can be named.
- Meaningful ordering prefixes are allowed where the order itself communicates product/curriculum structure. `SkillsPanel/01-SkillsFilters/` and `SkillsPanel/02-SkillsTree/` intentionally mirror the webpage order and are valid. Decorative numbering remains rejected.
- A source naming pass does not rename public URLs, localStorage keys, persisted JSON fields or other compatibility identifiers unless a separate deliberate migration is approved.

The practical test is:

> If somebody unfamiliar with the implementation sees only the folder path and filename, can they make a sensible guess about what the file is responsible for?

If not, improve the name or reassess whether the file mixes responsibilities.

---

## 63. Documentation Preservation Rule

Repository documentation is durable project memory.

When reconciling or rewriting documentation:

```text
historical truth
→ preserve

current truth
→ update

new rule / new decision
→ add

obsolete contradictory instruction
→ explicitly supersede or replace
```

Do not delete information merely because it is old if it still explains history, rationale, compatibility or a settled decision.

Current-state documents (`AGENTS.md`, `Docs/Architecture.md`, `Docs/RepositoryMap.md`) must not knowingly retain false current paths or owners.

Historical documents (`Docs/RefactorLedger.md` and historically framed Feature History entries) may retain old paths when those paths accurately describe the state at that time. When useful, add the current successor path rather than pretending the old path never existed.

`Docs/LockedDecisions.md` preserves permanent decision IDs. Superseded decisions remain recorded and are explicitly linked to the newer decision that replaced or clarified them.

---

# PASS 4 — NATIONAL 5 MATHEMATICS CATALOGUE ARCHITECTURE UPDATE — 28 AUGUST 2026

## 64. Current-Path Override for Sections 21–26

Sections 21–26 above are retained because they document the National 5 Maths architecture that was current before the dedicated catalogue/generation transition began. **Their physical National 5 Maths paths are superseded by this Pass 4 section for current work.** Do not delete those earlier sections merely to make this file shorter.

The current transition deliberately separates:

```text
app/Courses/National5Maths/
→ clean catalogue / generation architecture being built now

app/Courses/National5MathsLegacy/
→ preserved former working National 5 Maths implementation used for runtime compatibility during migration
```

The legacy tree currently contains the former:

```text
AssessmentConfig.ts
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/
Skills/
```

responsibilities. They are preserved, not endorsed as the destination architecture.

The clean current National 5 Maths workspace is:

```text
app/Courses/National5Maths/
├── 01_QuestionCatalog/
├── 02_AnswerCatalog/
├── 03_QuestionGeneration/
├── 04_AnswerGeneration/
├── 05_VisualAssets/
├── PaperContexts/
├── Skills/
├── CatalogCoreTypes.ts
└── National5MathsConfig.ts
```

The numeric prefixes are meaningful workflow ordering and are an intentional exception to the normal rejection of decorative numbering.

---

## 65. National 5 Maths Evidence-to-Generation Workflow

The intended Course-owned knowledge flow is:

```text
historical Question Paper
        ↓
01_QuestionCatalog

historical matching Marking Scheme
        ↓
02_AnswerCatalog

Question + Answer structural knowledge
        ↓
03_QuestionGeneration
        ↓
04_AnswerGeneration
        ↓
05_VisualAssets / deterministic renderers / approved context assets
        ↓
generic Assessment question/answer contracts
        ↓
Assessment Creation / Compilation / PDF
```

The catalogue is evidence/knowledge architecture. It is **not** a second Builder-native question model and should not be forced to mirror Assessment runtime payloads directly.

Generation adapts catalogued knowledge into the generic Assessment contracts.

---

## 66. Historical Examination Evidence Is Authoritative Evidence

For historical cataloguing, the source Question Paper and matching Marking Scheme are treated as the authority for what actually appeared and how it was marked.

Project-authored structures — including the Skills Tree — may be incomplete or wrong.

Therefore:

```text
source evidence conflicts with project classification
        ↓
record the source fact accurately
        ↓
flag the classification mismatch
        ↓
fix project-authored metadata later
```

Never rewrite or distort a historical catalogue entry to make it agree with the current Skills Tree.

The 2014 pilot already exposed paper-suitability mismatches in the current Skills Tree. Skills reconciliation is deliberately deferred until the broader catalogue phase is complete enough to support an evidence-led correction pass.

---

## 67. Question and Marking Scheme Are Paired Evidence

Question Catalogue files and Answer Catalogue files are physically separate for navigability, but the historical Question Paper and matching Marking Scheme are analysed as an atomic evidence pair.

The relationship is conceptually:

```text
Question source facts
+
matching marking evidence
+
paper/general marking policy
=
full historical evidence for that numbered Question
```

A Question entry should therefore link its matching Answer/MS catalogue ID, and its review should not be considered fully counterpart-validated until the matching marking-scheme pass has been completed.

Do not infer marking logic from the Question Paper when a source Marking Scheme exists and has not yet been reviewed.

---

## 68. Historical Corpus and File Naming

The intended National 5 Mathematics examination corpus is:

```text
2014–2019
2021–2025
```

There is no 2020 examination paper in this corpus because of the COVID cancellation.

The known corpus contains 337 numbered Questions across those years.

Question Catalogue files use:

```text
N5_Maths_YYYY_Px_Qn.ts
```

Examples:

```text
N5_Maths_2014_P1_Q1.ts
N5_Maths_2014_P2_Q13.ts
```

Matching Answer/Marking Scheme catalogue files use:

```text
N5_Maths_YYYY_Px_Qn_MS.ts
```

Question and Answer folders are organised by year and then `Paper1/` / `Paper2/`.

Do not invent a 2020 folder as if a normal examination paper existed.

---

## 69. Universal Catalogue Evidence Rules

`CatalogCoreTypes.ts` defines the common evidence language.

Important rules include:

```text
VALUE
NOT_APPLICABLE
UNKNOWN
NOT_REVIEWED
```

These states are not interchangeable. `UNKNOWN` must never be silently treated as `NOT_APPLICABLE`.

Provenance remains explicit:

```text
SOURCE_FACT
CATALOGUE_CLASSIFICATION
GENERATION_ANALYSIS
```

A catalogue entry should make it possible to distinguish what the source directly establishes, what the project has classified from that evidence, and what has been inferred specifically to support safe future generation.

Evidence references use source document/page/question locators. They do not license storing historical prompt wording as generator content.

---

## 70. Response Space Is First-Class Historical Evidence

Candidate answer/working space must be catalogued as part of Question design.

Do not reduce source spacing to a vague `SMALL` / `LARGE` label when reliable physical measurement is available.

The strengthened Question Catalogue supports multiple measured response regions and records details such as:

```text
physical PDF page
printed page label
measurement method
render DPI
page pixel dimensions
top / bottom / left / right boundaries
pixel dimensions
PDF-point dimensions
millimetre dimensions
boundary convention
Question parts served by the region
response-region type
```

The 2014 full-fidelity pilot uses controlled 300 dpi source renders for this evidence where appropriate.

Exact historical layout measurements are **evidence about assessment design**. They are not source coordinates that a generator is allowed to copy as historical layout geometry.

---

## 71. Visual Evidence Is a First-Class Subsystem

Do not treat diagrams, graphs, grids, context images or response surfaces as incidental decoration.

Historical visuals must be analysed semantically:

```text
entities
relationships
facts
orientation
scale meaning
labels
candidate interaction
response-surface role
mathematical invariants
safe variation
renderer requirements
```

Essential mathematical visuals should normally be regenerated through deterministic/procedural SVG or equivalent code-driven renderers.

Context photographs/illustrations may use a curated licensed/free asset bank with explicit licence/attribution metadata where appropriate.

Do not pixel-trace, vector-trace, reuse, or feed historical source artwork/geometry into generation.

The generation goal is to reproduce the **mathematical function** of a visual, not its historical artwork.

Runtime AI image generation is not required for essential mathematical schematics.

---

## 72. Copyright / Source Isolation Is Structural

Historical source material is evidence only.

The catalogue/generation boundary must preserve:

```text
historical prompt wording stored in generator source → NO
historical marking wording stored in generator source → NO
historical pixel artwork stored/reused → NO
historical vector geometry stored/reused → NO
exact source coordinates reusable by generator → NO
normalised semantic/mathematical facts usable → YES
```

Paraphrased structural descriptions, source locators, mathematical relationships and catalogue classifications are allowed because they describe evidence rather than copying the examination content as templates.

---

## 73. Temporary Legacy Runtime Bridge

`tsconfig.json` currently contains a deliberate compatibility bridge:

```text
@/app/Courses/National5Maths
@/app/Courses/National5Maths/*
        ↓
app/Courses/National5MathsLegacy
```

The normal root alias `@/*` still exists as well.

This keeps old runtime imports working while the clean `National5Maths` workspace is built.

**Important:** a new clean-workspace file must not assume that `@/app/Courses/National5Maths/...` points to the new folder during this transition. It currently resolves to legacy code.

Use safe relative imports within the clean National 5 Maths catalogue/generation workspace, or introduce a deliberately approved new alias if one becomes necessary.

`.vscode/settings.json` hides `National5MathsLegacy` and `.gitkeep` from normal navigation/search. That is visual convenience only; it does not make legacy code dead or remove it from Git/runtime.

Remove the bridge only after its consumers have migrated and the clean Course implementation is proven.

---

## 74. 2014 Full-Fidelity Question Catalogue Pilot State

The first full pilot is complete for Question Papers:

```text
2014 Paper 1 → 13 numbered Questions / 40 marks
2014 Paper 2 → 13 numbered Questions / 50 marks
```

All 26 numbered 2014 Questions have been re-audited against the strengthened universal Question Catalogue contract.

The entries include the restored legacy strengths — especially exact response-space measurement, part-level demand, calculator burden, richer numerical structure and forensic prompt/language structure — plus the new semantic visual and generation architecture.

The matching 2014 Answer/Marking Scheme catalogue pass has **not** yet been completed. The Question review state should therefore continue to expose counterpart cross-checking as outstanding rather than pretending the paired evidence is finished.

---

## 75. Catalogue Completeness Before Mass Population

Do not mass-populate later years merely because the folder structure exists.

The intended sequence is:

```text
master Question Catalogue contract
        ↓
2014 P1 Question stress test
        ↓
2014 P2 Question stress test
        ↓
master Answer Catalogue / 2014 Answer stress test
        ↓
resolve contract gaps
        ↓
then expand through the remaining corpus
```

When a new source exposes a characteristic not representable by the current contract, improve the master contract and retrofit the pilot before multiplying the omission across hundreds of files.

The legacy narrow pilot is valuable evidence of useful catalogue characteristics. Do not discard a proven legacy feature merely because the new architecture expresses it differently; determine whether its meaning is already represented before deciding it is redundant.

---

## 76. Answer Catalogue Design Direction

The Answer Catalogue is intended to represent historical marking evidence, not merely a final answer string or one worked solution.

It must be able to describe, where supported by source evidence:

```text
expected answer set
method pathways
mark nodes
mark type / dependency
implied evidence
follow-through
difficulty preservation
answer-only rules
working/location requirements
alternative-method equivalence
method exclusions / eligibility
cross-part and cross-question rules
rounding / exactness
units / notation / context
solution selection
diagram/visual marking
common-result rules
special cases
general marking policy links
```

Marking schemes should be understood as branching evidence/pathway graphs where necessary, not forced into one linear worked solution.

---

## 77. Current Pass / Next Pass Discipline

At the end of Pass 4:

```text
Question Catalogue architecture → established
2014 P1 Question Catalogue → full-fidelity pilot complete
2014 P2 Question Catalogue → full-fidelity pilot complete
documentation → reconciled
Answer Catalogue population → next substantive evidence phase
Skills Tree reconciliation → deliberately deferred until catalogue phase is mature
legacy bridge retirement → deliberately deferred until clean runtime migration is proven
```

Do not silently expand an Answer Catalogue pass into Skills Tree correction, legacy deletion or runtime Course switching unless separately approved.
