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