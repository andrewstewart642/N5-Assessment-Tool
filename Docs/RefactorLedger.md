# VecEd Architecture V2 — Refactor Ledger

**Document type:** Live migration status and handoff record
**Architecture version:** Architecture V2
**Status:** Active
**Last major checkpoint:** 26 August 2026

---

# 1. Purpose

This document records the current state of the Architecture V2 migration.

It answers:

> What has actually been migrated?

> What is now canonical?

> What remains transitional?

> What has been verified?

> What should the next development session do?

Long-lived architectural rules belong in:

```text
Docs/Architecture.md
```

Settled decisions belong in:

```text
Docs/LockedDecisions.md
```

Current physical repository ownership belongs in:

```text
Docs/RepositoryMap.md
```

This ledger is intentionally concise.

It records meaningful architectural milestones rather than every individual file edit.

---

# 2. Current Refactor Status

Architecture V2 is now well beyond the initial migration stage.

The repository contains substantial canonical implementation beneath:

```text
src/
├── Assessments/
├── Courses/
└── UI/
```

The most important recent milestone is:

> **The historical Assessment Builder implementation has been completely detached from the live application and deleted.**

The only file remaining beneath:

```text
app/create-assessment/builder/
```

is:

```text
page.tsx
```

because `/create-assessment/builder` remains a live Next.js route.

The feature implementation itself now lives beneath:

```text
src/Assessments/Creation/
```

Current overall state:

```text
Architecture V2 established
+
Assessment Creation migrated
+
Compilation migrated to its own Assessment owner
+
historical Builder implementation removed
+
remaining legacy root domains still require migration
```

Architecture V2 remains:

```text
IN PROGRESS
```

---

# 3. Git Safety Model

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

A complete offline copy of the project also exists.

Historical named migration anchors:

```text
MIG-001 — Application UI Foundations
1492b5841be785ebf0a0fc96517cf3480aacb10c

MIG-002 — Application Theme and Settings Architecture
4664123d6657ae8752817c8ea0569a16d33a0890
```

Do not work directly on the frozen archive.

---

# 4. Working-State Authority

During active migration, the local working tree may be ahead of connected GitHub.

For uncommitted work, authority is:

```text
local source
local grep
local TypeScript
local production build
browser behaviour
```

Connected GitHub remains useful for inspecting pushed state but must not override newer verified local work.

---

# 5. Migration Method

The preferred Architecture V2 migration sequence is:

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
    ↓
DOCUMENT
    ↓
COMMIT
```

This method has proven safer than moving historical files wholesale.

Temporary compatibility adapters are acceptable when they reduce migration risk.

They must not become duplicate permanent authorities.

---

# 6. Acceptance Criterion Zero

The governing rule remains:

> Preserve the working application.

Architecture V2 may:

```text
move
rename
rewrite
split
merge
simplify
consolidate
delete genuinely dead code
```

but must not silently remove working behaviour.

TypeScript passing alone is not sufficient for visual or interaction-sensitive migrations.

---

# 7. Documentation Foundation — COMPLETE

Persistent Architecture V2 documentation is established:

```text
AGENTS.md

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md
```

Responsibilities:

```text
AGENTS.md
→ mandatory working rules

Architecture.md
→ durable architecture

LockedDecisions.md
→ binding settled decisions

RepositoryMap.md
→ current physical repository state

RefactorLedger.md
→ migration status and handoff

ChatGPTWorkflow.md
→ practical AI-assisted workflow
```

---

# 8. Application UI Architecture — COMPLETE

Canonical application visual ownership exists beneath:

```text
src/UI/Application/
```

Major implemented areas include:

```text
Colours/
Theme/
Typography/
HeaderBar/
SettingsDrawer/
```

The historical root-level:

```text
ui/
```

has been removed.

Do not recreate it.

Application UI and generated-document UI remain separate architectural systems.

---

# 9. Assessment Setup — SUBSTANTIALLY COMPLETE

Canonical Setup ownership exists beneath:

```text
src/Assessments/Creation/AssessmentSetupPage.tsx
src/Assessments/Creation/Setup/
```

Setup now owns its dedicated:

```text
state
storage
submission
target calculations
Course/setup rules
Class coverage loading
controls
sections
```

The route remains thin.

Remaining work around Setup concerns broader Course and Classes ownership rather than rebuilding the Setup feature itself.

---

# 10. Assessment Creator Route — COMPLETE

The live route remains:

```text
app/create-assessment/builder/page.tsx
```

It delegates to:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

The route wrapper must remain while the public URL remains:

```text
/create-assessment/builder
```

Important distinction:

```text
route name contains "builder"
≠
Builder architecture still exists
```

The historical Builder implementation has been removed.

---

# 11. Assessment Creation — BUILDER DETACHED

Canonical Assessment Creation ownership exists beneath:

```text
src/Assessments/Creation/
```

Major implemented areas include:

```text
Analysis/
AssessmentSettings/
HUDBar/
Papers/
PaperWorkspace/
Persistence/
Questions/
Setup/
SkillsPanel/
TopBar/
```

Current local auditing confirms no live implementation imports from:

```text
app/create-assessment/builder/
```

The old Builder is no longer part of the application dependency graph.

---

# 12. Assessment Creator Orchestration — BUILDER INDEPENDENT

Canonical page:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

It coordinates:

```text
paper state
Course configuration
question workflow
skills state
settings
persistence
quality analysis
TopBar
SkillsPanel
PaperWorkspace
HUDBar
```

It is no longer dependent on historical Builder behaviour or logic modules.

Future extraction should occur only when there is a meaningful responsibility to extract.

Do not split the file merely to reduce line count.

---

# 13. Assessment TopBar — COMPLETE

Canonical owner:

```text
src/Assessments/Creation/TopBar/
```

The historical Builder TopBar is gone.

Do not recreate a new Builder-style monolith.

---

# 14. SkillsPanel — SUBSTANTIALLY COMPLETE

Canonical Assessment interaction owner:

```text
src/Assessments/Creation/SkillsPanel/
```

Architecture distinction:

```text
Assessment Creation
→ rendering, filtering and interaction

Course
→ curriculum and educational knowledge
```

Course-side curriculum migration still remains.

---

# 15. Assessment Settings — BUILDER DETACHED

Canonical owner:

```text
src/Assessments/Creation/AssessmentSettings/
```

Current implementation includes:

```text
AssessmentSettingsPanel.tsx
```

The historical Builder Settings components have been removed.

Global application settings remain separate beneath:

```text
src/UI/Application/
```

Workspace behaviour belongs to the relevant workspace owner.

Do not recombine these responsibilities into a giant settings implementation.

---

# 16. Assessment Papers — BUILDER DETACHED

Canonical generic Assessment Creation paper ownership exists beneath:

```text
src/Assessments/Creation/Papers/
```

Important current responsibilities include:

```text
AssessmentPaperRules.ts
AssessmentPaperTargets.ts
useAssessmentPaperSelection.ts
```

Course-specific paper knowledge belongs to Course architecture.

Current shared Course paper rules live beneath:

```text
src/Courses/Papers/CoursePaperRules.ts
```

The historical Builder paper-selection and target implementation has been removed.

---

# 17. Assessment Analysis — BUILDER DETACHED

Canonical owner:

```text
src/Assessments/Creation/Analysis/
```

Current responsibilities include:

```text
AssessmentDistributionAnalysis.ts
AssessmentQualityNotes.ts
BuildCalculatorSuitabilityNotes.ts
BuildOperationalReasoningNotes.ts
BuildStandardBalanceNotes.ts
BuildTopicBalanceNotes.ts
useAssessmentQualityAnalysis.ts
```

The historical Builder analysis layer has been removed.

Do not recreate `builder-logic` as a generic analysis owner.

---

# 18. Assessment Persistence — BUILDER DETACHED

Canonical Assessment Creation persistence lives beneath:

```text
src/Assessments/Creation/Persistence/
```

Important responsibilities include:

```text
AssessmentCourseSelectionStorage.ts
useAssessmentCreatorAutoSave.ts
useAssessmentCreatorSavedAssessment.ts
```

Shared Course selection now has canonical ownership beneath:

```text
src/Courses/Selection/CourseSelectionStorage.ts
```

`AssessmentCourseSelectionStorage.ts` acts as an Assessment-facing compatibility adapter.

Existing persisted storage keys and shapes remain compatibility contracts.

Historical strings containing `builder` must not be renamed merely because the source architecture has changed.

---

# 19. Assessment Question Workflow — COMPLETE V2 OWNER

Generic Assessment Creation question workflow exists beneath:

```text
src/Assessments/Creation/Questions/
```

Important responsibilities include:

```text
AssessmentQuestionDrafts.ts
AssessmentQuestionDraftTypes.ts
AssessmentQuestionSpacing.ts
useAssessmentDraftWorkflow.ts
useAssessmentQuestionDraftGeneration.ts
useAssessmentQuestionState.ts
useAssessmentQuestionWorkflow.ts
```

Course-specific question generation remains separate.

---

# 20. Shared Assessment Question Preview — IMPLEMENTED

Rendering used by more than one Assessment workflow now has shared ownership beneath:

```text
src/Assessments/Questions/Preview/
```

Current shared files include:

```text
QuestionLockedPreview.tsx
QuestionPreviewLayout.ts
```

These were promoted from Creation-specific ownership when Compilation became a second consumer.

Creation and Compilation therefore share an Assessment-owned renderer rather than depending on one another.

The historical:

```text
app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx
```

has been deleted.

---

# 21. PaperWorkspace — COMPLETE

Canonical owner:

```text
src/Assessments/Creation/PaperWorkspace/
```

This area owns Assessment Creation's interactive paper workspace and preview behaviour.

The subtree has been verified free of historical Builder implementation imports.

Browser testing previously covered:

```text
question rendering
P1/P2 switching
preview modes
HUD resize
notes
marks
timings
Compile navigation
```

This is a stable V2 boundary.

---

# 22. HUDBar — COMPLETE

Canonical owner:

```text
src/Assessments/Creation/HUDBar/
```

Historical Builder HUD implementations have been removed.

The V2 HUD consumes canonical theme, preview and quality-analysis state.

---

# 23. Compilation — MIGRATED TO V2 OWNER

Compilation remains a separate Assessment responsibility.

Canonical implementation:

```text
src/Assessments/Compilation/AssessmentCompilationPage.tsx
```

Live route:

```text
app/compile-assessment/page.tsx
```

The route is a thin Next.js wrapper.

Compilation now consumes shared V2 owners for:

```text
Course selection
→ src/Courses/Selection/CourseSelectionStorage.ts

Course paper rules
→ src/Courses/Papers/CoursePaperRules.ts

locked question rendering
→ src/Assessments/Questions/Preview/QuestionLockedPreview.tsx
```

Compilation no longer depends on:

```text
app/create-assessment/builder/
```

Remaining Compilation work concerns transitional dependencies rather than page ownership.

---

# 24. Compilation Separation Rule

Compilation must remain separate from Assessment Creation.

Correct conceptual relationship:

```text
Assessment Creation
        ↓
persisted / selected assessment state
        ↓
Assessment Compilation
```

Shared behaviour should be promoted to:

```text
Assessments
Courses
UI/Documents
```

as appropriate.

Do not make:

```text
Compilation → Creation
```

or:

```text
Creation → Compilation
```

a general architectural dependency.

---

# 25. Course Selection — SHARED OWNER ESTABLISHED

Canonical shared Course-selection persistence:

```text
src/Courses/Selection/CourseSelectionStorage.ts
```

It owns the existing active-Course storage contract and historical aliases.

Creation and Compilation can consume this shared owner independently.

Persisted key:

```text
assessment_builder_active_course_id_v1
```

must remain unchanged until a deliberate persistence migration says otherwise.

Its historical name is not evidence of a Builder code dependency.

---

# 26. Course Paper Rules — V2 OWNER ESTABLISHED

Canonical Course paper behaviour exists beneath:

```text
src/Courses/Papers/CoursePaperRules.ts
```

Responsibilities include:

```text
available papers
default paper
paper configuration
paper targets
paper labels
calculator suitability
```

Course-specific educational paper knowledge belongs here rather than inside generic Assessment workflow.

---

# 27. Generated Document Architecture — ESTABLISHED

The generated-document layering is:

```text
generic document mechanics
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers
```

Current concrete structure includes:

```text
src/UI/Documents/
src/UI/Documents/Templates/NationalQualifications/
src/Courses/National5Maths/Documents/
```

Application UI and generated Documents UI remain separate systems.

---

# 28. Generic Document Layer — IMPLEMENTED

Canonical ownership:

```text
src/UI/Documents/
```

Important components include:

```text
Components/A4PageFrame.tsx
Components/PaperContent.tsx
Layout/DocumentUnits.ts
```

Some transitional document components may remain until page-layout migration is complete.

Do not delete them without a broad consumer audit.

---

# 29. National Qualifications Templates — IMPLEMENTED

Canonical qualification-family visual templates:

```text
src/UI/Documents/Templates/NationalQualifications/
```

They own reusable qualification visuals rather than Course-specific content.

---

# 30. National 5 Maths Documents — IMPLEMENTED

Canonical owner:

```text
src/Courses/National5Maths/Documents/
```

Current structure includes Course-specific:

```text
CoverPage
FormulaSheet
QuestionPage
CourseDocuments.ts
```

Duplicate historical document owners have been removed.

---

# 31. National 5 Maths Question Generation — V2 OWNER ESTABLISHED

Canonical Course-specific question generation lives beneath:

```text
src/Courses/National5Maths/QuestionGeneration/
```

Course-specific mathematics must remain outside generic Assessment Creation.

---

# 32. Legacy Builder Removal — COMPLETE

Historical implementation area:

```text
app/create-assessment/builder/
```

Previously contained:

```text
builder-behaviour/
builder-definitions/
builder-logic/
builder-preview-engine/
components/
BuilderStyles
Builder utilities
Builder storage modules
Assessment timing
```

A broad consumer audit was performed before deletion.

The implementation files were then removed with Git.

Current tracked contents:

```text
app/create-assessment/builder/page.tsx
```

only.

This route wrapper is intentionally retained.

The historical implementation must not be recreated.

---

# 33. Legacy Builder Removal Verification

After deleting the old implementation:

```bash
npx tsc --noEmit
```

passed.

Then:

```bash
npm run build
```

passed.

Production routes successfully generated included:

```text
/
/compile-assessment
/create-assessment
/create-assessment/builder
/dev/generator-tester
/my-assessments
/my-classes
/my-classes/[classId]
```

A browser smoke test also passed.

Verified behaviour included:

```text
Assessment Creator loads
existing questions render
draft questions render
Answers view renders
P1/P2 switching works
question generation works
question assignment works
editing works
remove works
Compile navigation works
Compilation loads
Compilation renders questions
Compilation paper switching works
Compilation page-size switching works
```

This is the strongest proof that the historical Builder implementation was genuinely dead.

---

# 34. Builder Reference Audit

After deletion:

```bash
git ls-files app/create-assessment/builder
```

returned only:

```text
app/create-assessment/builder/page.tsx
```

A broad source-path search for:

```text
app/create-assessment/builder
```

outside that route returned no implementation references.

Public route strings such as:

```text
/create-assessment/builder
```

remain legitimate.

Do not confuse route-string usage with historical source dependency.

---

# 35. Important Dead-Code Lesson

A previous migration briefly deleted an apparently obsolete document component after too narrow a search.

TypeScript exposed a surviving Compilation consumer.

The file was restored.

The permanent rule is:

> A narrow search is not proof of deadness.

Before deletion, search broadly for:

```text
path
filename
symbol
export
component
hook
adapter
dynamic import
route consumer
persistence use
```

across relevant repository roots.

---

# 36. Current Major Remaining Legacy Seams

The Builder is no longer one of the remaining seams.

Major unfinished areas now include:

```text
app/paper-layout/

course-data/

shared-types/

remaining math-helpers/

Classes ownership

legacy application pages outside Assessment Creation

developer generator ownership

remaining persistence consolidation

transitional document dependencies

routing/source-root consolidation
```

These must be migrated by responsibility.

Do not move entire legacy folders beneath `src` merely to make the repository look tidy.

---

# 37. `app/paper-layout/` — NEXT STRONG CANDIDATE

Current V2 code still consumes historical page-layout behaviour.

Known concerns include:

```text
page sizing
question spacing
reflow / pagination
Compilation layout behaviour
document mechanics
```

The next bounded audit should establish:

```text
which behaviour is generic document mechanics
which belongs to Assessment
which belongs to Compilation
which belongs to Course
which is dead
```

Likely current consumers include Assessment Creation question spacing and Compilation.

Do not move the folder wholesale.

---

# 38. `course-data/` — LEGACY ACTIVE

Historical Course configuration/data remains active.

Target ownership is beneath:

```text
src/Courses/
```

Important future Course concepts include:

```text
CourseDefinition
CourseRegistry
SkillsTree
paper definitions
question-generation knowledge
answer-generation knowledge
source question catalogues
source marking-scheme catalogues
```

Create only real owners when responsibilities are migrated.

Do not create speculative empty architecture.

---

# 39. `shared-types/` — LEGACY ACTIVE

Historical shared type buckets remain widely consumed.

Do not replace:

```text
shared-types/
```

with:

```text
src/SharedTypes/
```

as a cosmetic move.

Types should migrate to the domain that owns the concept.

Because type dependencies are broad, migration requires deliberate consumer mapping.

---

# 40. `math-helpers/` — LEGACY WHERE REMAINING

`math-helpers/` is not an accepted long-term V2 owner.

Remaining contents must be assigned according to actual responsibility:

```text
Course
Assessment
Documents
other genuine domain
```

Do not create a new generic helper bucket under `src`.

---

# 41. Classes — NOT YET FULLY MIGRATED

The target domain:

```text
src/Classes/
```

should be created only when real Class implementation is migrated.

Current legacy Class pages remain active.

Do not create empty scaffolding merely to complete the visual tree.

---

# 42. Route Tree

Root:

```text
app/
```

remains the active Next.js route tree.

Thin route wrappers are valid framework infrastructure.

Architecture V2 completion does not mean deleting every file beneath `app/`.

The important distinction is:

```text
app/
→ routing

src/
→ substantial application implementation
```

A future `src/app` routing migration may be considered separately if useful.

Do not combine it with unrelated domain migrations.

---

# 43. TypeScript Alias

Current alias:

```json
"@/*": ["./*"]
```

remains transitional because both root legacy source and `src` are still consumed.

Do not change the alias until remaining root-level dependencies have been reduced sufficiently.

---

# 44. Next.js Generated Files

Never manually edit:

```text
.next/
```

When route movement produces stale diagnostics, use:

```bash
npx next typegen
npx tsc --noEmit
```

If necessary, regenerate `.next`.

Terminal TypeScript is more authoritative than stale VS Code diagnostics.

---

# 45. Client Boundary Rule

Do not add:

```ts
"use client";
```

automatically to internal hooks or modules.

Only genuine client entry boundaries should carry it when required.

Adding it unnecessarily can create Next.js serializability warnings such as:

```text
ts(71007)
```

Internal hooks consumed beneath an existing client boundary should normally remain ordinary modules.

---

# 46. Persisted Compatibility Rule

Source naming cleanup and persisted-data migration are separate concerns.

Historical storage keys such as those containing:

```text
assessment_builder
```

must remain until a deliberate compatibility migration changes them.

Do not rename persisted keys merely to remove historical terminology from source code.

---

# 47. Naming Rule

Architecture V2 prefers meaningful PascalCase source naming.

Historical names may remain temporarily where renaming would add risk without changing ownership.

Naming cleanup should be performed separately from responsibility migration when appropriate.

Do not perform unrelated renames during destructive deletion phases.

---

# 48. Current Verification State

At the 26 August 2026 Builder-removal checkpoint:

```text
Builder implementation consumer audit
→ PASS

Builder implementation deletion
→ COMPLETE

TypeScript
→ PASS

Production build
→ PASS

Assessment Creator browser smoke
→ PASS

Compilation browser smoke
→ PASS

RepositoryMap whitespace check
→ PASS

RepositoryMap stale Builder/Compilation language audit
→ PASS
```

The application is currently working after the Builder removal.

---

# 49. Current Canonical Navigation

Use these as starting points:

```text
Assessment Creator
→ src/Assessments/Creation/AssessmentCreatorPage.tsx

Assessment Setup
→ src/Assessments/Creation/Setup/

Assessment Settings
→ src/Assessments/Creation/AssessmentSettings/

Assessment TopBar
→ src/Assessments/Creation/TopBar/

Assessment SkillsPanel
→ src/Assessments/Creation/SkillsPanel/

Assessment Papers
→ src/Assessments/Creation/Papers/

Assessment PaperWorkspace
→ src/Assessments/Creation/PaperWorkspace/

Assessment question workflow
→ src/Assessments/Creation/Questions/

shared Assessment question preview
→ src/Assessments/Questions/Preview/

Assessment Analysis
→ src/Assessments/Creation/Analysis/

Assessment Persistence
→ src/Assessments/Creation/Persistence/

Assessment Compilation
→ src/Assessments/Compilation/

shared Course selection
→ src/Courses/Selection/

Course paper rules
→ src/Courses/Papers/

National 5 Maths question generation
→ src/Courses/National5Maths/QuestionGeneration/

National 5 Maths documents
→ src/Courses/National5Maths/Documents/

application theme
→ src/UI/Application/Theme/

application HeaderBar
→ src/UI/Application/HeaderBar/

application settings
→ src/UI/Application/SettingsDrawer/

generic document components
→ src/UI/Documents/Components/

document layout
→ src/UI/Documents/Layout/

National Qualifications templates
→ src/UI/Documents/Templates/NationalQualifications/
```

---

# 50. Things Future Sessions Must Not Assume

Do not assume:

```text
everything beneath src is fully migration-complete

everything beneath app is obsolete

route names containing "builder" imply Builder architecture

historical persisted "builder" strings should be renamed

all app/paper-layout code belongs together

all course-data belongs in one future file

shared-types should become src/SharedTypes

math-helpers should become src/Helpers

Compilation belongs inside Creation

every hook requires "use client"

TypeScript passing proves visual preservation

GitHub always reflects the latest local state
```

Inspect first.

---

# 51. Things Future Sessions May Treat as Established

Future sessions may rely on:

```text
Architecture V2 ownership philosophy

preservation as acceptance criterion zero

thin page.tsx wrappers

HeaderBar / TopBar / HUDBar / PaperWorkspace terminology

Application UI vs Documents UI separation

Course ownership of educational knowledge

Assessment ownership of generic workflow

Compilation as a separate Assessment responsibility

shared Course selection ownership

shared Course paper-rule ownership

Assessment-wide locked-question preview ownership

historical Builder implementation removed

write-new before delete-old strategy

broad consumer search before deletion

persisted key compatibility rule

no speculative empty domains

no generic Helpers/Shared/Common buckets without justification
```

unless explicitly reconsidered.

---

# 52. Immediate Next Task

The strongest next migration candidate is:

```text
app/paper-layout/
```

Begin with an inventory and dependency audit.

Recommended first command:

```bash
find app/paper-layout -type f | sort
```

Then map all consumers across:

```text
app
src
```

before deciding owners or deleting anything.

Likely ownership destinations may include:

```text
src/UI/Documents/
src/Assessments/
src/Assessments/Compilation/
src/Courses/
```

but these must be determined from actual responsibilities.

Do not predetermine a one-folder-to-one-folder move.

---

# 53. Current Handoff Summary

A fresh development session should be able to begin with:

```text
Architecture V2 is active on refactor/architecture-V2.

Assessment Creation has been fully detached from the historical Builder
implementation.

The old Builder implementation beneath app/create-assessment/builder/
has been deleted. Only page.tsx remains as the live Next.js route wrapper.

Assessment Creation lives beneath src/Assessments/Creation/.

Compilation now lives beneath src/Assessments/Compilation/ and its
app/compile-assessment/page.tsx route is a thin wrapper.

Creation and Compilation share locked-question rendering through
src/Assessments/Questions/Preview/.

Shared Course selection lives beneath src/Courses/Selection/.

Course paper rules live beneath src/Courses/Papers/.

After the Builder deletion, TypeScript, the production build and browser
smoke testing all passed.

The next strong migration target is app/paper-layout/.

Preserve behaviour. Audit broadly. Establish the real owner. Write new.
Switch consumers. Verify. Delete old only after proving deadness.
```

---

# 54. Refactor Completion Criteria

Architecture V2 should not be considered complete until, at minimum:

```text
src is the authoritative application implementation tree

major route files are thin wrappers

legacy Builder architecture is gone

generic helper/type buckets are removed or explicitly justified

Course definitions are explicit

Assessment Creation is Course-independent

Classes have explicit ownership

settings are separated by responsibility

application visual truth has one authority

document visual truth follows layered ownership

Compilation has a proper Assessment owner

persistence ownership is clear

legacy root application source no longer fundamentally supports V2
```

Several of these criteria are now complete.

The principal remaining work is concentrated in the other historical root-level source areas.

Completion does not require every file to be tiny or every local value to become an abstraction.

---

# 55. Architecture V2 Final Source-Architecture Checkpoint — 26 August 2026

Architecture V2 has now progressed substantially beyond the repository state described in the earlier sections of this ledger.

Those earlier sections are intentionally preserved as historical migration evidence.

They must not be rewritten merely because the paths and owners they describe were later migrated again.

The current source architecture has reached the intended V2 ownership model.

---

## 55.1 Final Runtime Source Root

The transitional split between:

```text
app/
→ routing

src/
→ implementation
has been retired.

All runtime application source now lives beneath the root:

app/

Current high-level structure:

app/
├── [...route]/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx

The former:

src/

tree has been removed.

This means historical statements earlier in this ledger describing src/ as the V2 target remain valid records of an intermediate migration stage, but they no longer describe current physical repository ownership.

55.2 Product Ownership Is Now the Runtime Source Structure

The principal runtime owners are now:

app/Assessments/
→ generic assessment workflow

app/Classes/
→ class data and class workflows

app/Courses/
→ educational and Course-specific knowledge

app/DeveloperTools/
→ runtime developer functionality

app/UI/Application/
→ interactive application presentation

app/UI/Documents/
→ generated-document presentation

Repository maintenance tooling remains separate beneath:

Tools/

Historical one-off migration material belongs beneath:

Tools/LegacyMigrations/
55.3 Route Signpost Architecture Has Been Removed

The old physical route folders:

app/compile-assessment/
app/create-assessment/
app/create-assessment/builder/
app/my-assessments/
app/my-classes/
app/dev/

are no longer retained merely as source signposts.

Application feature URLs are now dispatched through:

app/[...route]/page.tsx

The catch-all route maps public URLs to descriptive product-owned page implementations.

Current supported feature URLs include:

/compile-assessment
/create-assessment
/create-assessment/builder
/my-assessments
/my-classes
/my-classes/:classId
/dev/generator-tester

The public URLs remain compatible.

The physical source architecture no longer mirrors those URLs.

The route dispatcher remains a thin framework adapter.

55.4 Assessment Creation Final Ownership

Canonical Assessment Creation ownership is:

app/Assessments/Creation/

Main entry points:

app/Assessments/Creation/AssessmentSetupPage.tsx
app/Assessments/Creation/AssessmentCreatorPage.tsx

Major ownership regions include:

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

The historical Builder implementation remains retired.

The public URL:

/create-assessment/builder

is a compatibility URL, not an architectural owner.

Do not recreate Builder source architecture.

55.5 Assessment Compilation Final Ownership

Compilation is canonically owned beneath:

app/Assessments/Compilation/

Current principal implementation includes:

AssessmentCompilationPage.tsx
CompilationPageSizes.ts
CompilationPagination.ts

Compilation remains separate from Assessment Creation.

Creation owns interactive assessment construction.

Compilation owns final assessment-document composition and pagination.

55.6 My Assessments and Saved Assessments

The user-facing saved-assessment library is owned beneath:

app/Assessments/MyAssessments/

Persistent saved-assessment data is owned separately beneath:

app/Assessments/SavedAssessments/

The distinction is:

MyAssessments
→ presentation and workflow

SavedAssessments
→ data and persistence

This separation is now canonical.

55.7 Shared Assessment Question Architecture

Generic Assessment question responsibilities are now owned beneath:

app/Assessments/Questions/

Current conceptual structure:

Content/
Generation/
Preview/
Selection/

Shared locked-question preview ownership remains beneath:

app/Assessments/Questions/Preview/

Course-specific question writing does not belong here.

55.8 Classes Migration — COMPLETE STRUCTURALLY

Classes now has explicit canonical ownership:

app/Classes/

Current high-level structure:

Components/
Coverage/
State/
ClassDetailsPage.tsx
ClassTypes.ts
MyClassesPage.tsx

Classes no longer owns or directly assumes one concrete Course curriculum.

Coverage resolves educational structure through:

SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree

This is the canonical Classes → Courses dependency.

55.9 Course Architecture — COMPLETE

Generic Course architecture is now owned beneath:

app/Courses/

Canonical generic Course files include:

CourseAssessmentConfig.ts
CourseCatalog.ts
CourseRegistry.ts
CourseTypes.ts

Supporting Course concerns include:

Papers/
Selection/

The historical:

course-data/

owner has been removed.

Educational knowledge is now owned by Courses.

55.10 CourseId Has One Canonical Owner

CourseId is owned by:

app/Courses/CourseTypes.ts

Assessment-owned convenience re-exporting has been removed.

Consumers import Course identity from its actual owner.

This eliminates the previous ambiguity created by shared/global type ownership.

55.11 CourseRegistry Compatibility Aliases Removed

Canonical Course Registry terminology is now:

COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs

Historical aliases such as:

COURSE_CONFIG_REGISTRY
getCourseConfigById
getDefaultCourseConfig
getRegisteredCourseConfigs

were audited, found to have no remaining consumers and removed.

Do not reintroduce them without a genuine compatibility requirement.

55.12 National 5 Maths Course Ownership

National 5 Mathematics implementation is canonically owned beneath:

app/Courses/National5Maths/

Current major responsibilities include:

AssessmentConfig.ts
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/
Skills/

National 5 Maths-specific educational knowledge must remain outside generic Assessment workflow.

55.13 Historical Exam Catalogue Terminology Finalised

Historical exam evidence now uses:

ExamQuestion
ExamMarkingScheme

terminology rather than the earlier:

SourceQuestion
SourceMarkingScheme

architecture.

Historical exam evidence is owned beneath:

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/

with:

Questions/
MarkingSchemes/

This catalogue is distinct from generated question-writing implementation.

55.14 Question and Answer Generation Final Ownership

Course-specific generated-question implementation is now owned beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/

Current conceptual layers are:

QuestionWriting/
AnswerWriting/
AnswerMethods/

Question-writing implementation includes:

ConceptSelection.ts
QuestionWriterRegistry.ts
ConceptModules/

and concept-specific writers.

Answer-writing implementation remains a separate Course responsibility.

55.15 Historical Question Bank — REMOVED

The former Question Bank architecture has been retired.

The old:

app/question-bank/

tree is gone.

A broad consumer audit established that only the live concept adapters required migration.

Those live adapters moved into Course-owned:

QuestionAndAnswerGeneration/QuestionWriting/ConceptModules/

Historical/evidence/prompt-style files without consumers were deleted.

Future generation work must extend the Course generation architecture rather than recreating a parallel Question Bank.

55.16 Shared Type Bucket — REMOVED

The historical:

shared-types/

bucket has been fully dismantled by responsibility.

Current type ownership includes:

app/Assessments/AssessmentTypes.ts
app/Assessments/Questions/Content/PaperParts.ts
app/Assessments/Questions/Generation/AnswerGenerationTypes.ts
app/Assessments/Questions/Generation/QuestionGenerationTypes.ts
app/Assessments/Questions/Selection/QuestionSelectionTypes.ts
app/Courses/CourseTypes.ts
app/Classes/ClassTypes.ts

There is no replacement generic SharedTypes architecture.

55.17 Generic Math Helper Bucket — REMOVED

The historical:

math-helpers/

owner has been eliminated.

Its surviving responsibilities were migrated to genuine Course, Assessment or document owners.

No replacement:

Helpers/
Utils/
Common/

bucket was created.

55.18 Historical Paper Layout Architecture — REMOVED

The earlier ledger identified:

app/paper-layout/

as a major remaining migration seam.

That migration has since been completed.

Canonical ownership now includes:

app/Courses/National5Maths/Documents/National5MathsQuestionSpacing.ts

app/Assessments/Compilation/CompilationPageSizes.ts

app/Assessments/Compilation/CompilationPagination.ts

The historical paper-layout owner is gone.

The unused historical typography module from that architecture was also removed after consumer verification.

55.19 Generated Document Architecture Final State

The canonical generated-document dependency model remains:

generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers

Generic document infrastructure:

app/UI/Documents/

Qualification-family templates:

app/UI/Documents/Templates/NationalQualifications/

National 5 Maths Course documents:

app/Courses/National5Maths/Documents/

Assessment consumers:

app/Assessments/

Application UI and generated Documents UI remain distinct systems.

55.20 Application UI Final Ownership

Interactive application presentation is canonically owned beneath:

app/UI/Application/

Major areas include:

Colours/
Components/
HeaderBar/
Home/
Motion/
Settings/
SettingsDrawer/
Theme/
Typography/

There is one application theme architecture.

Classes and Assessment features consume that application visual system rather than establishing competing global visual authorities.

55.21 Developer Tools Migration — COMPLETE

Runtime developer functionality now has explicit ownership beneath:

app/DeveloperTools/

Current runtime developer functionality includes:

GeneratorTester/
├── GeneratorTestTarget.ts
└── GeneratorTesterPage.tsx

This remains distinct from repository-level:

Tools/
55.22 Repository Root Cleanup — COMPLETE

Historical/transitional root source buckets have been removed or rehomed.

The repository no longer depends on root application areas such as:

src/
course-data/
math-helpers/
shared-types/
app/paper-layout/
app/question-bank/

Historical one-off percentage catalogue hardening material was rehomed beneath:

Tools/LegacyMigrations/PercentageCatalogueHardening/

Repository-root accidental empty files and duplicate migration artefacts were also removed during cleanup.

55.23 "use client" Boundary Cleanup — COMPLETE

Architecture V2 audited client directives across hooks and internal components.

Redundant "use client" directives were removed from:

internal custom hooks
internal Assessment components
internal Classes components
internal Application UI children
generated-document render components

The remaining directives are intended to represent genuine client entry boundaries such as:

interactive top-level pages
providers
global interactive application boundaries

The goal is not zero client directives.

The goal is deliberate client boundaries.

This cleanup was repeatedly verified through TypeScript and production builds.

55.24 Intentional Compatibility Seams Remain

Architecture V2 source cleanup does not require removing all historical terminology from persisted or compatibility contracts.

Intentional compatibility currently includes areas such as:

historical localStorage keys containing "builder"
P1 / P2 persisted paper fields and aliases
saved-assessment backwards compatibility
class-storage backwards compatibility
Course-selection persisted compatibility
active compatibility wiring that still has real consumers

These are not automatically architectural defects.

They should be changed only through a deliberate compatibility/persistence migration.

55.25 Hidden Event Compatibility Is Not Yet Automatically Removed

The global HeaderBar and Assessment settings architecture still contains active compatibility event wiring.

That wiring is not the preferred long-term dependency style.

However:

architecturally transitional
≠
dead

It must remain until an explicit replacement path is implemented and all consumers are switched.

Do not delete it merely to remove the word transitional.

55.26 Documentation Refresh — CURRENT CHECKPOINT

Architecture V2 documentation has now been refreshed around the final source architecture.

Current-state documents are:

AGENTS.md
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/RepositoryMap.md
Docs/ChatGPTWorkflow.md

These documents describe current Architecture V2 ownership.

This ledger deliberately preserves historical migration paths rather than rewriting them.

The Locked Decisions register now contains:

LD-001 → LD-266

with superseded historical decisions retained under their permanent IDs and replacement decisions recorded separately.

55.27 Historical Ledger Paths Must Remain Historical

Earlier entries in this file contain paths such as:

src/Assessments/
src/Courses/
src/UI/
app/create-assessment/builder/
app/compile-assessment/page.tsx
app/paper-layout/
shared-types/
course-data/
math-helpers/

These references must not be globally replaced.

They document actual earlier repository states.

Current physical truth belongs in:

Docs/RepositoryMap.md

Current architecture belongs in:

Docs/Architecture.md

This ledger records how the repository reached that state.

55.28 Important Verified Migration Checkpoints

Important source migrations completed during Architecture V2 include:

Builder implementation removal
Compilation ownership migration
paper-layout ownership migration
Course configuration migration
Course skill ownership migration
National 5 Maths Question/Answer architecture migration
Question Bank removal
Classes ownership migration
My Assessments ownership migration
Developer Tools ownership migration
shared-type ownership migration
root source-container migration
CourseId ownership cleanup
CourseRegistry compatibility cleanup
theme compatibility simplification
client-boundary cleanup
repository-root cleanup

Each destructive migration was preceded by consumer auditing and followed by relevant TypeScript/build verification.

55.29 Known Commit Anchors

Known Architecture V2 commit anchors include:

1492b5841be785ebf0a0fc96517cf3480aacb10c
→ MIG-001 — Application UI Foundations

4664123d6657ae8752817c8ea0569a16d33a0890
→ MIG-002 — Application Theme and Settings Architecture

eb03c43
→ Remove legacy Question Bank architecture

880292b
→ Migrate Developer Tools ownership

6986561
→ Move Next routing under src

c8ab01d
→ Migrate shared types under src

6a7cd59
→ Move application source to root app

5136858
→ Remove CourseRegistry compatibility aliases

b34251d
→ Remove redundant hook client boundaries

Other bounded commits also exist.

Do not infer that a migration is absent merely because its exact SHA is not repeated in this ledger.

Git history remains the authority for exact commit identity.

55.30 Architecture V2 Current Completion State

The structural/source phase of Architecture V2 is now:

SUBSTANTIALLY COMPLETE

The repository now satisfies the intended core architecture:

one runtime source root
clear major owners
no Builder implementation
no Question Bank architecture
no generic shared-types owner
no generic math-helpers owner
no paper-layout legacy owner
Course-independent Assessment workflow
explicit Classes ownership
explicit Course ownership
separate Compilation ownership
layered generated Documents
separate Application UI
explicit DeveloperTools ownership
thin routing adapter
deliberate client boundaries
preserved persistence compatibility

The remaining work for final Architecture V2 sign-off is verification and documentation closure rather than another major source migration.

55.31 Final Verification Still Required Before Sign-Off

Before declaring Architecture V2 fully signed off, perform one final repository-wide verification pass.

At minimum verify:

TypeScript
production build
Git diff / whitespace
stale source-path audit
legacy root-folder audit
special Next filename audit
"use client" inventory
major dependency-boundary audit
browser smoke test
generated-document visual behaviour

Do not mark the final browser verification as passed until it has actually been performed on the final local tree.

55.32 Final Browser Smoke Test Scope

The final browser smoke should cover the major product path:

Home
    ↓
Assessment Setup
    ↓
Assessment Creator
    ↓
question generation / editing / preview
    ↓
save behaviour
    ↓
Compilation

and independently verify:

My Assessments
My Classes
Class Details
global Settings
Assessment Settings
paper switching
preview modes
generated cover page
formula sheet
question pages

The purpose is regression detection.

No product redesign should be introduced during this smoke test.

55.33 Final Sign-Off Standard

Architecture V2 may be declared complete when:

final TypeScript passes
final production build passes
final structural audits pass
final browser smoke passes
generated-document output remains visually correct
documentation is synchronised
working tree / commit state is understood

At that point:

Architecture V2
→ COMPLETE

does not mean that VecEd development is finished.

It means future feature development can proceed on top of the new architecture without continuing the repository-wide migration.

56. Updated Current Handoff

A fresh development session should now begin from this state:

Architecture V2 has reached its final source-architecture checkpoint.

Runtime source lives beneath root app/.

The primary owners are Assessments, Classes, Courses, DeveloperTools and UI.

Public feature URLs are dispatched through app/[...route]/page.tsx rather
than mirrored by physical feature-route folders.

Assessment Creation is owned by app/Assessments/Creation/.

Compilation is owned separately by app/Assessments/Compilation/.

Classes is owned by app/Classes/ and resolves educational coverage through
CourseRegistry and CourseAssessmentConfig.

Course-specific educational knowledge is owned by app/Courses/.

National 5 Maths historical exam evidence and generated question-writing
architecture are separate Course responsibilities.

The historical Builder, Question Bank, shared-types, math-helpers,
paper-layout and course-data architectures are retired.

Application UI and generated Documents UI remain separate systems.

Generated documents follow generic → qualification-family → Course →
Assessment layering.

Persistence compatibility remains where required.

"use client" is reserved for genuine client entry boundaries.

Historical paths earlier in this ledger are migration history and should
not be rewritten.

Before final Architecture V2 sign-off, run the final repository-wide audit
and final browser/document smoke test.
57. Architecture V2 Next Action

The next action is no longer another source-owner migration.

It is:

FINAL REPOSITORY AUDIT
        ↓
FINAL BUILD / TYPECHECK
        ↓
FINAL BROWSER SMOKE
        ↓
FINAL DOCUMENT VISUAL CHECK
        ↓
ARCHITECTURE V2 SIGN-OFF
        ↓
COMMIT DOCUMENTATION / FINAL CHECKPOINT

Do not begin unrelated feature development until this final verification is complete unless explicitly requested.

# 58. Architecture V2 Final Sign-Off — 26 August 2026

Architecture V2 is now:

```text
COMPLETE

The repository-wide migration and final cleanup have been completed and verified.

58.1 Final Runtime Structure

The canonical runtime source root is:

app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── layout.tsx
└── page.tsx

There is no separate runtime src/ tree and no physical feature-route tree.

58.2 Final Routing Architecture

Public URLs are preserved through internal rewrites owned by:

next.config.ts

The single application page:

app/page.tsx

acts as the thin routing dispatcher and selects product-owned page implementations.

The historical:

app/[...route]/page.tsx

adapter has been retired.

58.3 Final Repository Cleanup

The final cleanup removed proven dead or historical repository material, including:

README.md
Tools/LegacyMigrations/
public/ starter assets
postcss.config.mjs
app/favicon.ico

Unused Tailwind/PostCSS dependencies were removed.

Global application CSS moved from:

app/globals.css

to:

app/UI/Application/Styles/ApplicationGlobals.css

The required Turbopack project-root configuration remains in:

next.config.ts

Required framework/generated files remain available even where they are hidden from the normal VS Code Explorer working surface.

58.4 Dependency and Security Checkpoint

The project was upgraded to:

Next.js 16.3.3
eslint-config-next 16.3.3

The final npm audit reported:

0 vulnerabilities

for both the complete dependency tree and production dependencies.

58.5 Final Verification

The final Architecture V2 tree passed:

TypeScript typecheck
production Next.js build
git diff --check
repository structural inspection
public-route browser smoke testing
direct URL refresh testing
browser navigation testing
Assessment Setup
Assessment Creator
question interaction
save/reopen behaviour
Compilation
My Assessments
My Classes
Class Details
application settings
Assessment settings
generated-document behaviour

The final application remained functional after the routing and repository cleanup.

58.6 Architecture V2 Status

The Architecture V2 repository-wide refactor is signed off.

Future development should proceed on top of this architecture rather than continuing the repository-wide migration.

Architecture V2 being complete does not mean VecEd itself is complete.

Future changes should be feature work, bounded architectural improvement, bug fixing or deliberate compatibility migration.

Historical migration entries earlier in this ledger remain historical truth and must not be rewritten merely to match the final physical structure.