# VecEd Architecture V2 — Refactor Ledger

**Document type:** Live migration status and handoff record
**Architecture version:** Architecture V2  
**Status:** Active  
**Authoritative for:** Current refactor progress, completed migration boundaries,known remaining seams and next work
**Not authoritative for:** Long-lived architectural rules — see `Architecture.md` and `LockedDecisions.md`

---

# 1. Purpose

This document answers:

> What has actually happened during Architecture V2?

> What is now canonical?

> What still depends on legacy source?

> What was verified?

> What should the next development session do?

It is intentionally not a complete chronological transcript of every file edit.

Small implementation steps should be condensed into meaningful architectural milestones.

The detailed architecture belongs in:

```text
Docs/Architecture.md
```

Settled decisions belong in:

```text
Docs/LockedDecisions.md
```

Current physical locations belong in:

```text
Docs/RepositoryMap.md
```

This ledger records:

```text
PROGRESS
CURRENT STATE
RISKS
NEXT ACTION
```

---

# 2. Current Refactor Status

Architecture V2 is well beyond the initial planning phase.

The repository now contains substantial canonical implementation beneath:

```text
src/
├── Assessments/
├── Courses/
└── UI/
```

The project remains intentionally transitional.

The current state is best described as:

```text
V2 architecture established
+
major Assessment Creation regions migrated
+
legacy source still active around orchestration, settings, Courses,
Classes, shared types, Compilation and routes
```

The refactor is therefore:

```text
IN PROGRESS
```

but several major feature boundaries are already complete.

---

# 3. Current Git Safety Model

Repository:

```text
andrewstewart642/N5-Assessment-Tool
```

Active refactor branch:

```text
refactor/architecture-V2
```

Known-good branch:

```text
main
```

Frozen baseline:

```text
archive/25-08-2026-baseline
```

A complete offline Windows copy of the project also exists as an additional preservation layer.

The archive and offline copy are not normal development locations.

---

# 4. Working-State Authority

During active migration, the local working tree may be ahead of connected GitHub.

For current uncommitted state, treat these as authoritative:

```text
local grep
local TypeScript
local build
local browser behaviour
```

Connected GitHub remains useful for inspecting the most recently pushed source.

Do not revert local progress merely because remote source has not caught up.

---

# 5. Refactor Strategy Established

The migration strategy has evolved into:

```text
AUDIT
    ↓
ESTABLISH OWNER
    ↓
WRITE NEW
    ↓
TYPE-CHECK
    ↓
SWITCH CONSUMER
    ↓
VERIFY
    ↓
SEARCH BROADLY
    ↓
DELETE OLD
    ↓
VERIFY AGAIN
```

This is now preferred over repeatedly moving and editing historical files in place.

Temporary adapters are acceptable where they provide a safe migration bridge.

They must not become permanent duplicate authorities.

---

# 6. Acceptance Criterion Zero

The governing preservation rule remains:

> Preserve the working application.

Architecture V2 may:

- rewrite;
- move;
- rename;
- split;
- merge;
- consolidate;
- simplify;
- delete genuinely dead code.

It must not silently remove working behaviour.

---

# 7. Documentation Foundation — COMPLETE

The Architecture V2 persistent documentation system is established:

```text
AGENTS.md

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md
```

Earlier versions were created at the beginning of the refactor.

At the current checkpoint they are being completely regenerated to reflect the architecture and migration knowledge gained during implementation.

Current regeneration progress:

AGENTS.md              → REWRITTEN
Architecture.md        → REWRITTEN / SECOND-PASS REVIEWED
LockedDecisions.md     → REWRITTEN
RepositoryMap.md       → REWRITTEN
RefactorLedger.md      → REWRITTEN
ChatGPTWorkflow.md     → REWRITTEN
Documentation sanity  → IN PROGRESS

---

# 8. Git / Workspace Foundation — COMPLETE

Architecture V2 uses:

```text
existing repository
+
refactor/architecture-V2
+
src/ migration boundary
+
external V2 VS Code workspace
```

The separate complete `N5-Assessment-Tool-V2` application approach was rejected.

The V2 workspace may hide legacy folders visually through `files.exclude`.

This is only an editor convenience.

## Historical migration anchors

Two early Architecture V2 migrations have named Git anchors worth preserving:

```text
MIG-001 — Application UI Foundations
Commit: 1492b5841be785ebf0a0fc96517cf3480aacb10c

MIG-002 — Application Theme and Settings Architecture
Commit: 4664123d6657ae8752817c8ea0569a16d33a0890

---

# 9. Early UI Migration — COMPLETE

The first major V2 migration established canonical application visual ownership.

Implemented V2 areas include:

```text
src/UI/Application/Colours/
src/UI/Application/Theme/
src/UI/Application/Typography/
```

Important canonical sources include concepts such as:

```text
AccentPalette
AppTheme
ThemeMode
Theme preference persistence
Typography
```

Competing visual authorities should continue converging toward these owners.

---

# 10. Global Settings Architecture — SUBSTANTIALLY COMPLETE

Canonical global settings ownership now exists under:

```text
src/UI/Application/SettingsDrawer/
```

This established the distinction between:

```text
global application settings
```

and:

```text
Assessment settings
workspace settings
```

The global Settings entry point belongs to HeaderBar/application UI.

A historical Assessment-specific settings bridge/event may still exist temporarily.

That bridge is transitional and should disappear when the Assessment Settings migration is completed.

---

# 11. HeaderBar Migration — COMPLETE

Canonical HeaderBar ownership exists under:

```text
src/UI/Application/HeaderBar/
```

The global HeaderBar now has a meaningful V2 decomposition around responsibilities such as:

```text
HeaderBar
Logo
Navigation
SettingsButton
```

The previous global header/settings architecture is no longer the canonical owner.

---

# 12. Historical Root `ui/` — REMOVED

The old root-level:

```text
ui/
```

was removed after its V2 responsibilities had moved.

Canonical visual architecture is now:

```text
src/UI/
├── Application/
└── Documents/
```

Do not recreate root `ui/`.

---

# 13. Assessment Setup Migration — SUBSTANTIALLY COMPLETE

The Assessment Setup workflow has been decomposed into:

```text
src/Assessments/Creation/AssessmentSetupPage.tsx

src/Assessments/Creation/Setup/
```

Responsibilities now include dedicated ownership for:

- setup state;
- Course/setup rules;
- target calculations;
- Class coverage;
- storage;
- submission;
- controls;
- sections.

A redundant duplicate Setup rules implementation was removed during this work.

The Setup page is now primarily orchestration rather than one giant implementation.

---

# 14. Assessment Creator Route Boundary — COMPLETE

The substantial Assessment Creation page now lives at:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

The route remains:

```text
app/create-assessment/builder/page.tsx
```

as a thin Next.js wrapper.

A migration temporarily removed this route wrapper, causing:

```text
/create-assessment/builder
```

to return 404.

The route was restored and verified.

Important lesson:

> Moving the implementation does not remove the requirement for the Next.js route entry point.

---

# 15. `AssessmentCreatorPage.tsx` — MIGRATION IN PROGRESS

The canonical page implementation exists beneath V2:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

However it remains a large orchestration file and still imports historical Builder modules.

This is expected at the current stage.

The file should continue losing implementation responsibilities as coherent owners are migrated.

Do not split it merely to reduce its line count.

Extract meaningful responsibilities.

---

# 16. Assessment Question State — COMPLETE V2 OWNER ESTABLISHED

Generic Assessment Creation question state now lives beneath:

```text
src/Assessments/Creation/Questions/
```

Known canonical responsibilities include:

```text
AssessmentQuestionDraftTypes.ts
AssessmentQuestionDrafts.ts
AssessmentQuestionSpacing.ts
useAssessmentQuestionState.ts
```

These should remain generic Assessment workflow owners.

Course-specific question generation remains separate.

---

# 17. Assessment Persistence — MAJOR V2 OWNERS ESTABLISHED

Important Assessment Creation persistence behaviour has moved beneath:

```text
src/Assessments/Creation/Persistence/
```

Known responsibilities include:

```text
AssessmentCourseSelectionStorage.ts
useAssessmentCreatorAutoSave.ts
useAssessmentCreatorSavedAssessment.ts
```

Existing storage compatibility has been deliberately preserved.

Persistence migration is not complete repository-wide.

---

# 18. Assessment Papers — V2 OWNER ESTABLISHED, MIGRATION CONTINUES

Generic Assessment paper behaviour now has ownership beneath:

```text
src/Assessments/Creation/Papers/
```

Known responsibilities include paper rules, targets and selection behaviour.

Some historical terminology/dependencies still remain.

Course-specific educational paper knowledge should continue moving toward the Course domain rather than becoming generic Assessment knowledge.

---

# 19. SkillsPanel Migration — SUBSTANTIALLY COMPLETE

Canonical interactive SkillsPanel ownership exists beneath:

```text
src/Assessments/Creation/SkillsPanel/
```

The intended distinction is established:

```text
Assessment Creation
→ rendering / filtering / interaction

Course
→ curriculum definition
```

The old giant SkillsTree/CategorySection architecture has been decomposed.

Course-side curriculum migration remains incomplete.

---

# 20. TopBar Migration — COMPLETE

Canonical TopBar implementation now exists under:

```text
src/Assessments/Creation/TopBar/
```

The legacy giant TopBar no longer defines the architecture.

TopBar now represents the Assessment Creation-specific upper controls rather than being confused with the global HeaderBar.

---

# 21. Preview Engine Migration — COMPLETE

Historical preview engine files:

```text
app/create-assessment/builder/builder-preview-engine/BuilderPreviewPane.tsx
app/create-assessment/builder/builder-preview-engine/BuilderPreviewPageRenderer.tsx
```

were replaced by:

```text
src/Assessments/Creation/PaperWorkspace/Preview/
```

and deleted after dependency checks.

Canonical preview responsibilities now include:

```text
AssessmentPreviewPane.tsx
AssessmentPreviewPageRenderer.tsx
AssessmentPreviewQuestion.tsx
AssessmentPreviewQuestionPage.tsx
AssessmentPreviewTypes.ts
```

---

# 22. Question Preview Migration — COMPLETE

Assessment Creation's interactive question rendering has moved away from historical Builder components.

Canonical location:

```text
src/Assessments/Creation/Questions/Preview/
```

Current responsibilities include:

```text
QuestionPreviewLayout.ts
QuestionMeasureBox.tsx
QuestionLockedPreview.tsx
QuestionDraftPreview.tsx
WorkedAnswerPreview.tsx
```

The migration preserved:

- rendered-height measurement;
- locked question display;
- draft controls;
- edit controls;
- worked-answer display;
- worked-answer method cycling;
- PaperContent rendering.

The V2 question preview now consumes:

```text
src/UI/Documents/Components/PaperContent.tsx
```

rather than the historical preview content renderer.

---

# 23. Important Question Legacy Exception

The historical:

```text
app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx
```

is **still active**.

It is no longer used by Assessment Creation Preview.

It remains consumed by:

```text
app/compile-assessment/page.tsx
```

Therefore:

```text
DO NOT DELETE
```

until Compilation is migrated.

This is a key example of why broad consumer searches are mandatory before deletion.

---

# 24. Document Architecture Discovery

While migrating Preview, the generated-document architecture was clarified.

The correct layers are:

```text
generic document mechanics
        ↓
qualification-family templates
        ↓
Course-specific document rules/content
        ↓
Assessment consumer
```

Current concrete chain:

```text
A4PageFrame
        ↓
NationalQualifications templates
        ↓
National5Maths Documents
        ↓
Assessment Preview
```

This is now locked Architecture V2.

---

# 25. Generic Document Layer — IMPLEMENTED

Canonical generic document ownership exists beneath:

```text
src/UI/Documents/
```

Important implementations include:

```text
Layout/DocumentUnits.ts

Components/A4PageFrame.tsx
Components/PaperContent.tsx
```

`DocumentUnits.ts` owns generic physical page calculations such as:

```text
mm → px
A4 dimensions
```

`A4PageFrame.tsx` owns generic page mechanics only.

---

# 26. National Qualifications Template Layer — IMPLEMENTED

Reusable qualification-family visuals now live beneath:

```text
src/UI/Documents/Templates/NationalQualifications/
```

Important components include:

```text
NationalQualificationsPageFrame.tsx
NationalQualificationsQuestionPageFrame.tsx
NationalQualificationsCoverPage.tsx
```

Responsibilities include shared visual conventions such as:

- corner marks;
- marks margin;
- candidate boxes;
- question margin treatment;
- page footer;
- Turn over;
- qualification cover layout.

These components do not own National 5 Maths-specific paper content.

---

# 27. National 5 Maths Document Layer — IMPLEMENTED

Canonical Course document ownership is:

```text
src/Courses/National5Maths/Documents/
├── CourseDocuments.ts
├── CoverPage/
│   └── National5MathsCoverPage.tsx
├── FormulaSheet/
│   └── National5MathsFormulaSheet.tsx
└── QuestionPage/
    └── National5MathsQuestionPage.tsx
```

Duplicate earlier National 5 Maths document components were removed after consumer checks.

The Course-specific implementation now composes reusable qualification templates.

---

# 28. Course Documents Bundle — IMPLEMENTED

National 5 Maths exposes its page components through:

```text
src/Courses/National5Maths/Documents/CourseDocuments.ts
```

providing the conceptual contract:

```text
CoverPage
FormulaSheet
QuestionPage
```

This is the current Course document plug-in boundary.

Long-term Assessment consumers should resolve this through the selected Course definition rather than hard-code National 5 Maths throughout generic code.

---

# 29. Document Visual Preservation — VERIFIED DURING MIGRATION

TypeScript checks were used throughout document migration.

Document changes were also treated as preservation-sensitive because compilation alone cannot verify:

- page dimensions;
- margins;
- corner marks;
- qualification visual elements;
- formula layout;
- question layout.

Relevant browser visual checks should remain mandatory for future document-layer migrations.

---

# 30. `DocumentPageFrame.tsx` Deletion Mistake — RESOLVED / LESSON RETAINED

During document cleanup:

```text
src/UI/Documents/Components/DocumentPageFrame.tsx
```

appeared obsolete from an overly narrow audit and was deleted.

TypeScript immediately exposed:

```text
app/compile-assessment/page.tsx
```

as an active consumer.

The file was restored.

Current status:

```text
DocumentPageFrame.tsx
→ LEGACY/TRANSITIONAL BUT ACTIVE
```

Important lesson:

> Never establish deadness from a narrow path-specific search.

Search symbols and consumers broadly before deletion.

---

# 31. Compilation Route Discovery — ACTIVE LEGACY FEATURE

The route:

```text
app/compile-assessment/page.tsx
```

is live.

It is reached by the Assessment Creator's:

```text
Compile →
```

action.

It is not abandoned prototype code.

Current responsibilities include:

- loading current assessment data;
- selecting paper;
- selecting page size;
- paginating questions;
- rendering compile-preview pages;
- displaying printable-style questions.

---

# 32. Compilation Current Legacy Dependencies

Known live Compilation dependencies include:

```text
src/UI/Documents/Components/DocumentPageFrame.tsx

app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx

app/paper-layout/Page-Sizes

app/paper-layout/Reflow-Pages

legacy Builder paper configuration/targets
```

Compilation also reads the existing assessment-builder localStorage contract.

These dependencies must not be deleted during unrelated Creation cleanup.

---

# 33. Compilation Architectural Decision

Compilation is now recognised as a separate Assessment responsibility.

Target conceptual owner:

```text
src/Assessments/Compilation/
```

A future bounded migration should establish something like:

```text
src/Assessments/Compilation/
└── AssessmentCompilationPage.tsx
```

with:

```text
app/compile-assessment/page.tsx
```

eventually becoming a thin route wrapper.

This migration has **not** yet begun.

---

# 34. HUD Migration — COMPLETE

Historical HUD implementation consisted of:

```text
BuilderBottomHud.tsx
AssessmentProgressHud.tsx
UseBuilderProgressHudRows.ts
```

The V2 replacement was written beneath:

```text
src/Assessments/Creation/HUDBar/
```

Canonical local implementation includes:

```text
AssessmentHUDBar.tsx
AssessmentProgressPanel.tsx
useAssessmentProgressRows.ts
```

---

# 35. Assessment Quality Notes — CANONICAL OWNER ESTABLISHED

Historical:

```text
BuilderNotes
```

behaviour has received a V2 owner:

```text
src/Assessments/Creation/Analysis/AssessmentQualityNotes.ts
```

The historical Builder module may temporarily serve as a compatibility adapter for remaining legacy analysis consumers.

There must be only one actual quality-note implementation.

---

# 36. HUD Legacy Files — REMOVED

After switching consumers, broad search confirmed the old HUD files only referenced themselves.

The following were deleted:

```text
app/create-assessment/builder/builder-behaviour/UseBuilderProgressHudRows.ts

app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud.tsx

app/create-assessment/builder/components/builder-layout/BuilderBottomHud.tsx
```

Empty legacy folders were eligible for removal where applicable.

---

# 37. PaperWorkspace Legacy-Dependency Audit — PASSED

The decisive audit was:

```bash
grep -RInE 'from "(@/app/create-assessment/builder/|@/math-helpers/)' src/Assessments/Creation/PaperWorkspace
```

Current result:

```text
NO MATCHES
```

This establishes:

```text
src/Assessments/Creation/PaperWorkspace/
```

as a canonical V2-clean boundary.

This is one of the most important completed milestones of the refactor so far.

---

# 38. PaperWorkspace Smoke Test — PASSED

After Preview, question rendering and HUD migration, the Assessment Creator was manually tested.

Confirmed working:

```text
P1/P2 switching
question generation/interactions
question editing
question removal
draft assignment/removal
Exam / Compact / Answers modes
worked-answer display
HUD resizing
quality notes
marks/timings
Compile navigation
```

The user confirmed the feature was functioning correctly after the migration.

This is the current known-good Assessment Creation checkpoint.

---

# 39. Current Assessment Creation Status

The domain can now be summarised as:

```text
Assessment Setup
→ substantially migrated

TopBar
→ migrated

SkillsPanel UI
→ migrated

Questions / question preview
→ migrated

PaperWorkspace
→ migrated and legacy-detached

HUDBar
→ migrated

Assessment persistence
→ significant V2 ownership established

Analysis
→ significant V2 ownership established

Assessment Settings
→ major remaining seam

AssessmentCreatorPage orchestration
→ still contains legacy imports

Course integration
→ transitional
```

---

# 40. Course Migration — IN PROGRESS

Canonical V2 Course source currently exists beneath:

```text
src/Courses/National5Maths/
```

Implemented responsibilities include:

```text
Documents/
QuestionGeneration/
```

The broader Course migration is incomplete.

---

# 41. National 5 Maths Question Generation — V2 OWNER ESTABLISHED

Course-specific mathematical generation has started moving beneath:

```text
src/Courses/National5Maths/QuestionGeneration/
```

This is the correct V2 owner.

Do not move Course-specific generator knowledge back into generic Assessment Creation.

---

# 42. Remaining Course Architecture

Important Course responsibilities still requiring migration include concepts such as:

```text
CourseRegistry
CourseDefinition
SkillsTree
Papers
AnswerGeneration
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

Some or all currently exist in legacy:

```text
course-data/
```

or related source.

Do not create duplicate V2 implementations without switching consumers deliberately.

---

# 43. Classes — NOT YET MIGRATED

Architectural owner:

```text
src/Classes/
```

Current status:

```text
TARGET — NOT YET IMPLEMENTED
```

Existing Class functionality remains outside the V2 Classes domain.

This migration should occur later as its own bounded responsibility.

---

# 44. Routes — PARTIALLY MIGRATED

Substantial implementations have begun moving into domain files, but routing still physically lives beneath:

```text
app/
```

This is intentional.

Examples of routes already delegating to V2 page implementations include Assessment Setup and Assessment Creator.

Full:

```text
app/
→
src/app/
```

migration remains deferred.

---

# 45. `shared-types/` — ACTIVE LEGACY

Many V2 files still consume historical:

```text
shared-types/
```

contracts.

This folder must eventually be dismantled by ownership.

Do not simply replace it with:

```text
src/SharedTypes/
```

Type migration should occur carefully because these contracts may have many consumers.

---

# 46. `math-helpers/` — ACTIVE LEGACY WHERE REMAINING

`math-helpers` is not an accepted permanent V2 owner.

Its contents must migrate according to actual responsibility.

Important achievement:

```text
PaperWorkspace
```

no longer directly depends upon it.

---

# 47. `course-data/` — ACTIVE LEGACY

`course-data` remains important to the working application.

It contains useful Course information but mixes multiple responsibilities.

Migration should preserve good organisation while separating:

```text
Course definition
SkillsTree
QuestionGeneration
AnswerGeneration
Paper rules
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

---

# 48. Legacy Builder Tree — ACTIVE BUT SHRINKING

The historical:

```text
app/create-assessment/builder/
```

is no longer the owner of the Assessment Creation feature as a whole.

However it still contains active modules consumed by:

```text
AssessmentCreatorPage
Assessment Settings
Course/paper coordination
quality analysis
Compilation
other unmigrated behaviours
```

Do not attempt one wholesale deletion.

---

# 49. Legacy Builder Behaviour — NEXT AUDIT AREA

Historical area:

```text
app/create-assessment/builder/builder-behaviour/
```

still contains several hooks imported by:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

The HUD rows hook has already been successfully removed.

Remaining hooks should be grouped by responsibility before migration.

Do not assume one old hook must become one new hook.

---

# 50. Legacy Builder Logic — ACTIVE

Historical:

```text
app/create-assessment/builder/builder-logic/
```

contains mixed responsibilities.

Some modules are now adapters.

Some remain genuine active implementations.

This folder must eventually disappear as an architectural owner.

Migration must occur by actual responsibility.

---

# 51. Assessment Settings — MAJOR NEXT SEAM

The historical settings implementation remains one of the largest unresolved areas.

It mixes responsibilities historically associated with:

```text
global appearance
Assessment document settings
workspace controls
```

The V2 architecture already defines their owners:

```text
global
→ src/UI/Application/SettingsDrawer/

Assessment
→ src/Assessments/Creation/AssessmentSettings/

workspace
→ src/Assessments/Creation/PaperWorkspace/
```

Do not move the historical giant SettingsPanel unchanged.

This is likely one of the next substantial Assessment Creation migrations.

---

# 52. TypeScript Verification Pattern

The routine bounded verification command is:

```bash
npx tsc --noEmit
```

Silent output means pass.

This has been used repeatedly throughout the current migration.

---

# 53. Next.js Generated-Type Issue

Moving routes can leave stale generated validators beneath:

```text
.next/
```

Known recovery procedure:

```bash
npx next typegen
npx tsc --noEmit
```

If needed, regenerate `.next`.

Never manually edit `.next` source.

If terminal TypeScript passes while VS Code still reports old errors:

```text
Developer: Reload Window
```

has successfully cleared stale editor diagnostics.

---

# 54. Browser Verification Pattern

For meaningful visual or interaction migrations, TypeScript is followed by targeted browser verification.

Relevant Assessment Creation checks include:

```text
route opens
P1/P2
questions
editing
preview modes
zoom/navigation
HUD
save state
Compile
```

Document-layer changes additionally require visual paper inspection.

---

# 55. Dead-Code Audit Rule Established Through Experience

The migration produced a concrete lesson:

```text
NARROW SEARCH
≠
PROOF OF DEADNESS
```

Before deleting a legacy implementation, search:

```text
filename
exported symbol
component name
adapter name
known alias
route consumer
```

across:

```text
app
src
```

as relevant.

This rule prevented further accidental removals after the `DocumentPageFrame` incident.

---

# 56. Current Protected Legacy Files / Features

At this checkpoint, the following are known active and must not be deleted casually:

```text
app/compile-assessment/page.tsx

src/UI/Documents/Components/DocumentPageFrame.tsx

app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx

remaining Builder behaviour imported by AssessmentCreatorPage

remaining Builder logic imported by V2 source

active course-data

active shared-types

active persistence contracts
```

---

# 57. Current Removed / Superseded Implementations

Important obsolete implementations already removed include:

```text
root ui/

legacy Builder preview engine

legacy Builder TopBar ownership

legacy Builder BottomHud

legacy AssessmentProgressHud

legacy UseBuilderProgressHudRows

dead old question-preview components where no other consumer remained

duplicate National5Maths document owners
```

Do not recreate these merely because older commits or conversations reference them.

---

# 58. Current Canonical V2 Areas

At this checkpoint, strong canonical ownership exists for:

```text
src/UI/Application/

src/UI/Documents/

src/UI/Documents/Templates/NationalQualifications/

src/Courses/National5Maths/Documents/

src/Courses/National5Maths/QuestionGeneration/

src/Assessments/Creation/Setup/

src/Assessments/Creation/TopBar/

src/Assessments/Creation/SkillsPanel/

src/Assessments/Creation/Questions/

src/Assessments/Creation/PaperWorkspace/

src/Assessments/Creation/HUDBar/

src/Assessments/Creation/Analysis/

src/Assessments/Creation/Persistence/
```

Canonical ownership does not necessarily mean the whole surrounding repository has zero legacy dependencies.

---

# 59. Most Important Current Milestone

The current milestone is:

> **Assessment Creation's PaperWorkspace is fully detached from the legacy Builder tree.**

Specifically:

```text
src/Assessments/Creation/PaperWorkspace/
```

has no direct imports from:

```text
app/create-assessment/builder/
math-helpers/
```

and its migrated behaviour has passed browser testing.

This should be treated as a stable boundary going forward.

---

# 60. Current Recommended Next Investigation

The next broad audit should begin at:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

Search remaining legacy dependencies such as:

```text
@/app/create-assessment/builder/
@/math-helpers/
@/course-data/
@/shared-types/
```

Then group them by responsibility.

Do **not** migrate every import in one pass.

Likely clusters include:

```text
Assessment Settings
paper behaviour
remaining Builder behaviour hooks
quality-analysis implementation
Course configuration
persistence compatibility
```

Choose the next bounded owner after seeing the dependency map.

---

# 61. Recommended Immediate Next Migration Candidate

Based on the current architecture, one of the strongest next candidates is:

```text
Assessment Settings
```

because:

- it remains a large legacy seam;
- V2 ownership is already defined;
- global Settings architecture already exists;
- PaperWorkspace is now clean;
- the giant settings implementation still mixes unrelated responsibilities.

However, confirm remaining `AssessmentCreatorPage.tsx` legacy imports first before committing to the exact order.

---

# 62. Compilation Is Deferred Deliberately

Do not migrate Compilation merely because its legacy dependencies become visible during Creation cleanup.

Compilation deserves its own bounded phase.

Before migration, audit:

```text
route implementation
storage handoff
paper selection
page-size behaviour
pagination
question rendering
document frame
Course document integration
```

Only then establish the V2 Compilation structure.

---

# 63. Classes Are Deferred Deliberately

The Classes architecture is settled but has not yet become the most urgent dependency boundary.

Do not create:

```text
src/Classes/
```

as empty scaffolding.

Create it when migrating real Class implementation.

---

# 64. `src/app` Migration Is Deferred Deliberately

Root `app/` remains the active Next.js route tree.

Moving routes to:

```text
src/app/
```

should happen as a dedicated routing migration when enough feature implementation already lives beneath `src`.

Do not combine it with unrelated domain work.

---

# 65. Alias Migration Is Deferred Deliberately

Current:

```json
"@/*": ["./*"]
```

still supports both legacy and V2 source.

Changing the alias to treat `src` as root should wait until legacy imports are sufficiently reduced.

Premature alias migration would create broad unrelated breakage.

---

# 66. Current Risks

The principal architectural risks remaining are:

### Legacy orchestration coupling

`AssessmentCreatorPage.tsx` still depends on historical Builder modules.

### Settings coupling

The historical settings implementation still mixes ownership categories.

### Course coupling

Generic Assessment behaviour still relies on legacy Course configuration/data structures.

### Type coupling

`shared-types` remains widely consumed.

### Compilation coupling

The live Compilation route still consumes historical preview/paper implementations.

### Persistence compatibility

Storage keys/shapes must survive source migration.

### Route migration

Root `app/` remains active and cannot be mechanically relocated.

---

# 67. Things Future Sessions Must Not Assume

Do not assume:

```text
everything beneath src is fully legacy-free

everything beneath app is dead

PaperQuestionLocked is dead

DocumentPageFrame is dead

Compilation is unused

CourseRegistry already exists

src/Classes already exists

src/app already exists

Higher Maths architecture should be created now

all Builder modules should be renamed one-for-one

TypeScript passing proves document visuals are preserved
```

Inspect first.

---

# 68. Things Future Sessions May Treat as Established

Future sessions may rely on:

```text
Architecture V2 ownership philosophy

PascalCase architectural naming

thin page.tsx rule

HeaderBar / TopBar / HUDBar / PaperWorkspace terminology

Application vs Documents UI split

Course ownership of educational knowledge

Assessment ownership of generic creation workflow

write-new migration strategy

broad search before deletion

PaperWorkspace V2-clean boundary

National Qualifications document template layer

National5Maths Course Documents layer

Compilation as a separate Assessment responsibility
```

unless explicitly reconsidered.

---

# 69. Documentation Checkpoint — 26 August 2026

This ledger regeneration records the end of the current major PaperWorkspace migration phase.

At this checkpoint:

```text
TypeScript
→ PASS

PaperWorkspace legacy-import audit
→ PASS

legacy HUD reference audit
→ PASS after deletion

Assessment Creator browser smoke test
→ PASS

Compile navigation
→ PASS
```

The project is in a working state.

Documentation regeneration is being performed before beginning the next major migration boundary.

---

# 70. Commit Status for This Checkpoint

The documentation regeneration currently represents local working-tree changes until committed/pushed.

Do not invent a commit SHA before the documentation checkpoint has actually been committed.

After the next meaningful commit, Git history remains the authoritative exact record of the source snapshot.

---

# 71. Suggested New-Session Handoff

A fresh development session should be able to begin with:

```text
Architecture V2 is active on refactor/architecture-V2.

The current major completed milestone is the Assessment Creation
PaperWorkspace migration.

src/Assessments/Creation/PaperWorkspace/ has been verified to contain
no direct legacy Builder or math-helpers imports.

TopBar, question Preview and HUDBar have canonical V2 owners.

The live Compilation route remains legacy and must not be deleted.

The next task is to audit remaining legacy imports in
src/Assessments/Creation/AssessmentCreatorPage.tsx and choose the next
coherent migration cluster, likely Assessment Settings or another
remaining Builder behaviour group.

Preserve behaviour. Write new before deleting old. Search broadly before
deletion.
```

That is sufficient to resume without reconstructing this conversation.

---

# 72. Refactor Completion Criteria

Architecture V2 should not be considered complete until, at minimum:

```text
src is the authoritative application source tree

major route files are thin wrappers

legacy Builder architecture is gone

generic helper/type buckets are removed or explicitly justified

Course definitions are explicit

Assessment Creation is Course-independent

Classes have explicit ownership

settings are fully separated by responsibility

application visual truth has one authority

document visual truth follows layered ownership

Compilation has a proper Assessment owner

persistence ownership is clear

legacy root application source no longer fundamentally supports V2
```

Completion does not require every file to be tiny or every local value to become an abstraction.

---

# 73. Current Next Action

After completing this documentation sanity review:

1. Review the documentation diff for accidental omissions or contradictions.

2. Commit the documentation checkpoint.

3. Audit direct legacy imports in:
   src/Assessments/Creation/AssessmentCreatorPage.tsx

4. Group the results by architectural responsibility.

5. Select one bounded migration.

6. Continue Architecture V2.

---

# 74. Final Handoff Rule

Do not leave a major architectural milestone only in conversation history.

At each meaningful checkpoint, this ledger should make it possible for a new session to answer:

```text
WHAT IS CANONICAL?
WHAT IS STILL LEGACY?
WHAT WAS VERIFIED?
WHAT MUST NOT BE DELETED?
WHAT SHOULD HAPPEN NEXT?
```

If it can answer those five questions accurately, it is doing its job.