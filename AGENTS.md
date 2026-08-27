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
app/MyAssessments/
app/UI/
```

Use responsibility to decide ownership.

Do not choose an owner merely because it produces the shortest import path.

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
Home/
Motion/
Settings/
SettingsDrawer/
Shell/
Styles/
Theme/
Typography/
```

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

Class types
→ app/Classes/

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

---

## 49. Source File Changes

When practical, provide or create complete replacement files rather than fragile chains of tiny text substitutions.

Use surgical edits when the file is genuinely very large, the change is tiny, and a full replacement would make review harder.

Preserve surrounding behaviour.

---

## 50. Verification Commands

After structural TypeScript/source work, normally run:

```bash
npx tsc --noEmit
npm run build
git --no-pager diff --check
```

For focused UI passes, TypeScript plus browser verification may be sufficient during iteration, but a clean production build should be obtained before treating infrastructure or release-level work as complete.

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
- Does the documentation still match the repository?
- If this was feature work, is the feature history/backlog now accurate?

If not, the change is not finished.
