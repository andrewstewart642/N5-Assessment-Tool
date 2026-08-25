# VecEd Repository Map

**Document type:** Current physical repository and migration map
**Architecture version:** Architecture V2  
**Status:** Active
**Purpose:** Show where responsibilities physically live now, which areas are canonical V2, which remain transitional, and where unfinished responsibilities are expected to move

---

# 1. Purpose

This document answers:

> Where does this responsibility physically live right now?

and:

> Is that location canonical V2, transitional legacy, or a future target?

It complements:

```text
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/RefactorLedger.md
```

`Architecture.md` defines the intended architecture.

`RepositoryMap.md` describes the repository **as it currently exists during migration**.

The two may intentionally differ.

---

# 2. Authority During Active Local Refactoring

The user's local working tree may be ahead of the connected GitHub branch.

Therefore current migration state is determined primarily by:

```text
local source
local grep
local TypeScript
local build
local browser behaviour
```

The connected GitHub branch remains useful for inspection of pushed source.

If the remote repository and known local state differ, this map should describe the known local checkpoint.

---

# 3. Status Vocabulary

## V2 IMPLEMENTED

The responsibility has a canonical Architecture V2 owner and current consumers use it appropriately.

## V2 IMPLEMENTED — TRANSITIONAL CONSUMERS REMAIN

The canonical owner exists, but some legacy consumers or adapters still depend on compatibility paths.

## MIGRATION IN PROGRESS

Responsibility is divided between V2 and legacy architecture.

## LEGACY — ACTIVE

Historical implementation remains required by the working application.

Do not delete it.

## TARGET — NOT YET IMPLEMENTED

Architecture defines the intended owner but no real implementation exists there yet.

## AUDIT REQUIRED

The current role or long-term owner is not sufficiently established.

## SAFE TO REMOVE

Usage has been traced and the implementation has been proven obsolete.

A file should normally be deleted shortly after receiving this status rather than remaining documented indefinitely.

---

# 4. Current Repository Overview

The repository currently contains both V2 and legacy application architecture.

Conceptually:

```text
N5-Assessment-Tool/
├── AGENTS.md
├── Docs/
│
├── src/
│   ├── Assessments/
│   ├── Courses/
│   └── UI/
│
├── app/
├── course-data/
├── math-helpers/
├── page-sections/
├── shared-types/
│
├── public/
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── ...
```

Not all target V2 domains physically exist yet.

In particular:

src/app/
src/Classes/

are established architectural targets rather than fully implemented current
domains.

A runtime development domain such as:

src/DeveloperTools/

should be created only if genuine developer-facing application functionality
eventually requires one.

Do not create any of these merely to make the target tree visually complete.

---

# 5. Documentation

```text
AGENTS.md

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md
```

**Status:** V2 IMPLEMENTED

All six persistent Architecture V2 documents exist.

Their roles are:

```text
AGENTS.md
→ mandatory working contract

Architecture.md
→ long-lived architecture

LockedDecisions.md
→ settled decisions

RepositoryMap.md
→ current physical structure

RefactorLedger.md
→ migration progress and handoff

ChatGPTWorkflow.md
→ AI-assisted working procedure
```

The earlier documentation phase is complete.

These are active project infrastructure.

---

# 6. `src/`

**Status:** V2 IMPLEMENTED — EXPANDING

Current major V2 domains physically present are:

```text
src/
├── Assessments/
├── Courses/
└── UI/
```

This is no longer an empty construction area.

It contains substantial canonical application implementation.

Still-target core domains include:

src/app/
src/Classes/

Create those only when their real responsibilities are migrated.

`src/DeveloperTools/` remains optional and should exist only if a genuine
runtime developer responsibility later requires it.

---

# 7. `src/Assessments/`

**Status:** V2 IMPLEMENTED — EXPANDING

The principal implemented Assessment domain is currently:

```text
src/Assessments/
└── Creation/
```

A future separate Compilation domain has been architecturally established but is not yet migrated:

```text
src/Assessments/Compilation/
```

---

# 8. `src/Assessments/Creation/`

**Status:** V2 IMPLEMENTED — MAJOR MIGRATION IN PROGRESS

Current local structure is approximately:

```text
src/Assessments/Creation/
├── Analysis/
├── AssessmentCreatorPage.tsx
├── AssessmentSettings/
├── AssessmentSetupPage.tsx
├── HUDBar/
├── Papers/
├── PaperWorkspace/
├── Persistence/
├── Questions/
├── Setup/
├── SkillsPanel/
└── TopBar/
```

This is now the authoritative architectural home of Assessment Creation.

The page still contains legacy dependencies in areas which have not yet been migrated, so the whole Assessment Creation domain is not yet legacy-free.

---

# 9. `AssessmentCreatorPage.tsx`

Current location:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

**Status:** V2 IMPLEMENTED — ORCHESTRATION MIGRATION IN PROGRESS

This is the canonical substantial implementation of the Assessment Creator page.

It currently coordinates:

- paper state;
- selected Course configuration;
- question state;
- skills state;
- settings;
- persistence;
- quality analysis;
- TopBar;
- SkillsPanel;
- PaperWorkspace;
- HUD.

The file remains large and still consumes a number of historical:

```text
app/create-assessment/builder/...
```

behaviour/logic modules.

Do not move the page back into the route.

Future work should continue extracting genuine responsibilities rather than splitting merely to reduce line count.

---

# 10. Assessment Setup

Current implementation:

```text
src/Assessments/Creation/AssessmentSetupPage.tsx

src/Assessments/Creation/Setup/
├── AssessmentClassCoverageStorage.ts
├── AssessmentSetupClassLoader.ts
├── AssessmentSetupCourseRules.ts
├── AssessmentSetupStorage.ts
├── AssessmentSetupSubmission.ts
├── AssessmentSetupTargetCalculations.ts
├── LevelSelect.tsx
├── SetupCard.tsx
├── useAssessmentSetupClassCoverage.ts
├── useAssessmentSetupConfiguration.ts
├── useAssessmentSetupTargets.ts
├── Controls/
└── Sections/
```

**Status:** V2 IMPLEMENTED

Setup has been substantially decomposed from its historical page implementation.

The remaining issue is not the basic Setup UI architecture but wider Course/Class migration and any legacy dependencies still consumed from outside this subtree.

---

# 11. TopBar

Current owner:

```text
src/Assessments/Creation/TopBar/
```

**Status:** V2 IMPLEMENTED

The old giant Builder TopBar is no longer the canonical owner.

The V2 TopBar owns the Assessment Creation upper control region and its recognisable components.

Do not recreate:

```text
BuilderTopBar
```

as a new central implementation.

---

# 12. SkillsPanel

Current owner:

```text
src/Assessments/Creation/SkillsPanel/
```

**Status:** V2 IMPLEMENTED — COURSE MIGRATION STILL IN PROGRESS

Conceptually:

```text
SkillsPanel/
├── 01-SkillsFilters/
└── 02-SkillsTree/
```

This V2 area owns generic Assessment Creation rendering and interaction.

Course curriculum/data ownership is still partly transitional because the wider Course architecture has not yet fully absorbed historical `course-data`.

---

# 13. Papers

Current owner:

```text
src/Assessments/Creation/Papers/
```

Current known responsibilities include:

```text
AssessmentPaperRules.ts
AssessmentPaperTargets.ts
useBuilderPaperSelection.ts
```

**Status:** MIGRATION IN PROGRESS

The folder is canonical V2 ownership, but some filenames/types still expose historical `Builder` terminology or depend on legacy paper/configuration modules.

Do not interpret presence beneath `src` as evidence that every dependency of these files is already V2.

---

# 14. Analysis

Current owner:

```text
src/Assessments/Creation/Analysis/
```

Known V2 responsibilities include:

```text
AssessmentQualityNotes.ts
useAssessmentQualityAnalysis.ts
```

**Status:** V2 IMPLEMENTED — TRANSITIONAL LEGACY ANALYSIS DEPENDENCIES MAY REMAIN

`AssessmentQualityNotes.ts` is the canonical note representation introduced during the HUD migration.

The historical:

```text
app/create-assessment/builder/builder-logic/BuilderNotes.ts
```

may temporarily remain as a compatibility adapter while other legacy analysis modules still consume `BuilderNote`.

Do not establish a second note implementation.

---

# 15. Persistence

Current owner:

```text
src/Assessments/Creation/Persistence/
```

Known responsibilities include:

```text
AssessmentCourseSelectionStorage.ts
useAssessmentCreatorAutoSave.ts
useAssessmentCreatorSavedAssessment.ts
```

**Status:** MIGRATION IN PROGRESS

Important V2 persistence has been extracted, but historical storage behaviour remains elsewhere.

Persisted key compatibility must be preserved.

Do not rename persisted keys merely because the source owner changed.

---

# 16. Questions

Current owner:

```text
src/Assessments/Creation/Questions/
```

Known structure:

```text
Questions/
├── AssessmentQuestionDrafts.ts
├── AssessmentQuestionDraftTypes.ts
├── AssessmentQuestionSpacing.ts
├── useAssessmentQuestionState.ts
└── Preview/
    ├── QuestionPreviewLayout.ts
    ├── QuestionMeasureBox.tsx
    ├── QuestionLockedPreview.tsx
    ├── QuestionDraftPreview.tsx
    └── WorkedAnswerPreview.tsx
```

**Status:** V2 IMPLEMENTED

This folder owns generic Assessment Creation question workflow and interactive question-preview behaviour.

The recent Preview migration replaced direct PaperWorkspace use of historical:

```text
MeasureBox
PaperQuestionDraft
PaperQuestionLocked
WorkedAnswerPreview
```

from the legacy Builder tree.

Some legacy equivalents may remain required by other consumers, particularly Compilation.

Do not delete an old question component merely because Assessment Creation no longer uses it.

---

# 17. `PaperWorkspace/`

Current structure:

```text
src/Assessments/Creation/PaperWorkspace/
├── AssessmentPaperWorkspace.tsx
├── Preview/
│   ├── AssessmentPreviewPane.tsx
│   ├── AssessmentPreviewPageRenderer.tsx
│   ├── AssessmentPreviewQuestion.tsx
│   ├── AssessmentPreviewQuestionPage.tsx
│   └── AssessmentPreviewTypes.ts
├── PreviewViewMode.ts
├── WorkspaceDivider.tsx
├── useBuilderWorkspaceDocumentLock.ts
├── useCompactPreviewContent.ts
└── usePreviewViewMode.ts
```

**Status:** V2 IMPLEMENTED — CANONICAL CLEAN BOUNDARY

This is a major completed migration milestone.

Current local audits confirm:

```text
src/Assessments/Creation/PaperWorkspace/
```

contains no direct imports from:

```text
@/app/create-assessment/builder/
@/math-helpers/
```

The PaperWorkspace subtree is therefore independent of the historical Builder implementation.

This is now a protected V2 boundary.

Some filenames inside it may still retain `Builder` in a hook name where migration has not yet justified another rewrite, but the subtree itself does not depend on the old Builder source tree.

---

# 18. HUDBar

Current owner:

```text
src/Assessments/Creation/HUDBar/
```

Current local implementation includes:

```text
AssessmentHUDBar.tsx
AssessmentProgressPanel.tsx
useAssessmentProgressRows.ts
```

**Status:** V2 IMPLEMENTED

This migration replaced:

```text
app/create-assessment/builder/components/builder-layout/BuilderBottomHud.tsx

app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud.tsx

app/create-assessment/builder/builder-behaviour/UseBuilderProgressHudRows.ts
```

Those legacy HUD files have been proven unconsumed and deleted locally.

The canonical HUD now consumes:

- V2 theme;
- V2 preview mode;
- V2 quality-note representation;
- V2 progress-row preparation.

The HUD migration was browser-tested successfully, including resizing, notes, marks/timings, view modes and Compile navigation.

---

# 19. AssessmentSettings

Current owner:

```text
src/Assessments/Creation/AssessmentSettings/
```

Known implementation includes an Assessment-specific wrapper/component.

**Status:** MIGRATION IN PROGRESS — MAJOR REMAINING SEAM

The historical settings implementation remains one of the largest unresolved Assessment Creation ownership areas.

It historically mixes:

```text
global application appearance
assessment document settings
workspace settings
```

These must continue to be separated according to ownership.

Do not merely move the giant historical SettingsPanel unchanged.

---

# 20. Assessment Creation Current Dependency Status

The most important completed boundary is:

```text
PaperWorkspace
→ V2-clean
```

The broader:

```text
AssessmentCreatorPage
```

still imports historical Builder modules.

Therefore current status is:

```text
Assessment Creation domain
→ MIGRATION IN PROGRESS

PaperWorkspace subtree
→ V2 IMPLEMENTED / LEGACY-DETACHED

TopBar
→ V2 IMPLEMENTED

HUDBar
→ V2 IMPLEMENTED

Question Preview
→ V2 IMPLEMENTED

Setup
→ V2 IMPLEMENTED

Settings
→ major remaining migration target

Creator orchestration
→ still contains legacy seams
```

---

# 21. `src/Courses/`

**Status:** V2 IMPLEMENTED — EARLY/MID MIGRATION

Current physical V2 Course implementation includes:

```text
src/Courses/
└── National5Maths/
    ├── Documents/
    └── QuestionGeneration/
```

The complete Course architecture is not yet migrated.

Important target concepts such as:

```text
CourseRegistry
CourseDefinition
SkillsTree
Papers
AnswerGeneration
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

must only be marked implemented when real V2 source exists.

Do not infer their implementation merely from Architecture.md.

---

# 22. National 5 Maths Question Generation

Current owner:

```text
src/Courses/National5Maths/QuestionGeneration/
```

**Status:** V2 IMPLEMENTED — WIDER GENERATION MIGRATION MAY CONTINUE

Course-specific mathematical generation belongs here rather than under generic Assessment Creation.

This is the correct V2 dependency direction.

---

# 23. National 5 Maths Documents

Current structure:

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

**Status:** V2 IMPLEMENTED

This is the canonical Course-specific generated-document owner.

The earlier duplicate top-level National 5 Maths cover/formula implementations were removed after consumer auditing.

`CourseDocuments.ts` is the current Course document bundle.

It exposes the Course-owned:

```text
CoverPage
FormulaSheet
QuestionPage
```

components.

---

# 24. Course Registry / Definition

Target location:

```text
src/Courses/CourseRegistry.ts
src/Courses/CourseDefinitionTypes.ts
```

or an equivalent deliberately approved structure.

**Status:** TARGET — NOT YET IMPLEMENTED

Do not claim generic multi-Course resolution is complete.

Assessment Creation still has transitional direct Course/configuration dependencies.

This is a future migration boundary.

---

# 25. National 5 Maths SkillsTree

Target conceptual owner:

```text
src/Courses/National5Maths/SkillsTree/
```

**Status:** MIGRATION IN PROGRESS / LEGACY SOURCE STILL ACTIVE

The architectural owner is settled.

Current curriculum implementation remains at least partly in historical Course data.

Do not manufacture a V2 duplicate.

---

# 26. National 5 Maths Papers

Target conceptual owner:

```text
src/Courses/National5Maths/Papers/
```

**Status:** MIGRATION IN PROGRESS

Some generic Assessment paper behaviour already exists beneath:

```text
src/Assessments/Creation/Papers/
```

but Course-specific educational paper knowledge must continue moving toward Course ownership.

---

# 27. Source Catalogues

Approved Course concepts:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

**Status:** LEGACY/CURRENT ORGANISATION REQUIRES CONTINUED COURSE MIGRATION

These are considered strong organisational concepts.

Do not dismantle them merely because their current physical location may still be legacy.

Move them when their Course migration boundary is addressed.

---

# 28. `src/UI/`

Current structure:

```text
src/UI/
├── Application/
└── Documents/
```

**Status:** V2 IMPLEMENTED

This split is canonical.

Do not create another top-level competing UI system.

---

# 29. `src/UI/Application/`

Current V2 responsibilities include:

```text
src/UI/Application/
├── Colours/
├── Theme/
├── Typography/
├── HeaderBar/
├── SettingsDrawer/
└── Components/        # where genuine reusable application components exist
```

Other architectural categories such as:

```text
Spacing/
Motion/
Shadows/
```

should only physically exist where actual reusable implementation justifies them.

**Status:** V2 IMPLEMENTED — EXPANDING

---

# 30. Application Colours

Canonical owner:

```text
src/UI/Application/Colours/
```

Known source:

```text
AccentPalette.ts
```

**Status:** V2 IMPLEMENTED

---

# 31. Application Theme

Canonical owner:

```text
src/UI/Application/Theme/
```

Known sources include:

```text
AppTheme.ts
ThemeMode.ts
ThemePreferenceStorage.ts
```

plus associated provider/state implementation where present.

**Status:** V2 IMPLEMENTED

Historical compatibility aliases may remain temporarily.

Do not create another theme authority.

---

# 32. Application Typography

Canonical owner:

```text
src/UI/Application/Typography/
```

Known source:

```text
Typography.ts
```

**Status:** V2 IMPLEMENTED

---

# 33. HeaderBar

Canonical owner:

```text
src/UI/Application/HeaderBar/
```

Conceptually:

```text
HeaderBar.tsx
Logo.tsx
Navigation.tsx
SettingsButton.tsx
```

**Status:** V2 IMPLEMENTED

The global HeaderBar Settings entry point represents global application settings.

Any remaining Assessment-specific event compatibility should be treated as transitional.

---

# 34. SettingsDrawer

Canonical owner:

```text
src/UI/Application/SettingsDrawer/
```

Known concepts include:

```text
SettingsDrawer.tsx
SettingsDrawerProvider.tsx
SettingsSection.tsx
Appearance/
```

**Status:** V2 IMPLEMENTED

This is global application settings ownership.

It does not own Assessment-specific settings.

---

# 35. Historical Root `ui/`

**Status:** REMOVED

The previous root-level:

```text
ui/
```

has been deleted during Architecture V2 migration.

Do not recreate it.

Canonical visual ownership now belongs beneath:

```text
src/UI/
```

---

# 36. `src/UI/Documents/`

Current structure:

```text
src/UI/Documents/
├── Components/
├── Layout/
└── Templates/
```

**Status:** V2 IMPLEMENTED

Additional document categories should only be created when real implementation requires them.

---

# 37. Document Layout

Current owner:

```text
src/UI/Documents/Layout/
```

Known source:

```text
DocumentUnits.ts
```

**Status:** V2 IMPLEMENTED

`DocumentUnits.ts` owns generic physical conversion values such as millimetres to pixels and A4 dimensions.

---

# 38. Generic Document Components

Current owner:

```text
src/UI/Documents/Components/
```

Known important components include:

```text
A4PageFrame.tsx
DocumentPageFrame.tsx
PaperContent.tsx
```

These do not currently all have the same migration status.

---

# 39. `A4PageFrame.tsx`

Location:

```text
src/UI/Documents/Components/A4PageFrame.tsx
```

**Status:** V2 IMPLEMENTED

Owns generic A4 page mechanics such as:

- page dimensions;
- scaling;
- white paper surface;
- clipping;
- generic page presentation.

It must not absorb Course-specific or qualification-specific rules.

---

# 40. `PaperContent.tsx`

Location:

```text
src/UI/Documents/Components/PaperContent.tsx
```

**Status:** V2 IMPLEMENTED

This is the canonical reusable document content renderer used by migrated question/document components.

---

# 41. `DocumentPageFrame.tsx`

Location:

```text
src/UI/Documents/Components/DocumentPageFrame.tsx
```

**Status:** LEGACY/TRANSITIONAL — ACTIVE

This file must currently remain.

It is still consumed by the live:

```text
app/compile-assessment/page.tsx
```

route.

It was previously deleted prematurely during refactoring, producing a TypeScript failure, and was deliberately restored.

Do not delete it until Compilation is migrated or its consumer has been switched.

---

# 42. National Qualifications Templates

Current owner:

```text
src/UI/Documents/Templates/NationalQualifications/
```

Known components include:

```text
NationalQualificationsPageFrame.tsx
NationalQualificationsQuestionPageFrame.tsx
NationalQualificationsCoverPage.tsx
```

**Status:** V2 IMPLEMENTED

This layer owns reusable qualification-family presentation such as:

- corner marks;
- marks margin;
- candidate-number presentation;
- page footer conventions;
- question-page side treatment;
- common cover layout.

It does not own National 5 Maths-specific content/rules.

---

# 43. Document Dependency Chain

Current canonical dependency direction is:

```text
src/UI/Documents/Components/
        ↓
src/UI/Documents/Templates/NationalQualifications/
        ↓
src/Courses/National5Maths/Documents/
        ↓
src/Assessments/Creation/PaperWorkspace/Preview/
```

Compilation should eventually consume this architecture as appropriate.

Do not reverse this dependency.

---

# 44. `src/Classes/`

**Status:** TARGET — NOT YET IMPLEMENTED

The Classes architectural owner is established but the V2 Classes domain has not yet been migrated into `src`.

Current Class implementation remains in historical source/routes.

When migrated, it should own:

- Class models;
- Class-specific data;
- Class persistence;
- Class page implementations where appropriate.

Assessment Creation may consume Classes but must not become their owner.

---

# 45. `src/app/`

**Status:** TARGET — NOT YET IMPLEMENTED

The repository still uses root:

```text
app/
```

for Next.js routes.

This is deliberate during the current migration.

The eventual routing migration should be bounded separately.

---

# 46. Root `app/`

**Status:** LEGACY/FRAMEWORK — ACTIVE

Root `app/` remains the active Next.js routing tree.

It contains a mixture of:

```text
thin migrated route wrappers
+
legacy route implementations
+
legacy Builder source still awaiting migration
```

Do not delete or wholesale relocate it.

---

# 47. Assessment Creator Route

Current route wrapper:

```text
app/create-assessment/builder/page.tsx
```

**Status:** ROUTE ACTIVE — V2 IMPLEMENTATION DELEGATED

It delegates to:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

This route previously disappeared temporarily during migration and caused a 404.

The wrapper was restored and verified.

Do not remove it without an explicit route migration.

---

# 48. Assessment Setup Route

The Assessment Setup route delegates to:

```text
src/Assessments/Creation/AssessmentSetupPage.tsx
```

**Status:** ROUTE ACTIVE — V2 IMPLEMENTATION DELEGATED

The route layer should remain thin.

---

# 49. Compilation Route

Current route:

```text
app/compile-assessment/page.tsx
```

**Status:** LEGACY — ACTIVE / SEPARATE FUTURE MIGRATION

This route is live and reachable from the Assessment Creator's Compile action.

It currently performs significant implementation itself and still depends on historical architecture.

Known dependencies include:

```text
src/UI/Documents/Components/DocumentPageFrame.tsx

app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx

app/paper-layout/Page-Sizes

app/paper-layout/Reflow-Pages

legacy Builder paper-target logic
```

It also reads the existing assessment-builder localStorage data.

Do not delete or casually refactor these dependencies during unrelated Assessment Creation cleanup.

Target conceptual owner:

```text
src/Assessments/Compilation/
```

Migration should be handled as its own bounded stage.

---

# 50. Legacy `PaperQuestionLocked.tsx`

Historical location:

```text
app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx
```

**Status:** LEGACY — ACTIVE

Assessment Creation Preview no longer consumes this component.

Compilation still does.

Therefore it is **not dead**.

Do not delete it until Compilation switches consumer.

---

# 51. Other Old Question Preview Components

Historical components formerly consumed by PaperWorkspace included:

```text
MeasureBox.tsx
PaperQuestionDraft.tsx
WorkedAnswerPreview.tsx
```

**Status:** REMOVED WHERE PROVEN DEAD

Their Assessment Creation behaviour now lives under:

```text
src/Assessments/Creation/Questions/Preview/
```

Only retain any historical equivalent if a broad search proves another consumer exists.

---

# 52. Old Preview Engine

Historical files:

```text
app/create-assessment/builder/builder-preview-engine/BuilderPreviewPane.tsx
app/create-assessment/builder/builder-preview-engine/BuilderPreviewPageRenderer.tsx
```

**Status:** REMOVED

They were replaced by canonical:

```text
src/Assessments/Creation/PaperWorkspace/Preview/
```

implementation after consumer tracing and verification.

---

# 53. Old HUD Implementation

Historical files:

```text
app/create-assessment/builder/components/builder-layout/BuilderBottomHud.tsx

app/create-assessment/builder/components/assessment-progress/AssessmentProgressHud.tsx

app/create-assessment/builder/builder-behaviour/UseBuilderProgressHudRows.ts
```

**Status:** REMOVED

Their consumers were migrated to V2 owners and broad search returned only self-references before deletion.

Canonical replacement:

```text
src/Assessments/Creation/HUDBar/
```

---

# 54. Legacy Builder Tree

Current area:

```text
app/create-assessment/builder/
```

**Status:** LEGACY — ACTIVE BUT SHRINKING

This tree no longer owns the entire Assessment Creator.

However, it still contains active historical responsibilities used by:

- `AssessmentCreatorPage.tsx`;
- Assessment Settings;
- quality-analysis helpers;
- paper state/configuration;
- persistence compatibility;
- Compilation;
- other unmigrated behaviour.

Do not delete the whole tree.

Continue bounded ownership migrations.

---

# 55. Legacy Builder Behaviour

Current area:

```text
app/create-assessment/builder/builder-behaviour/
```

**Status:** LEGACY — ACTIVE

Several historical `UseBuilder...` hooks are still consumed by:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

The recently migrated HUD rows hook has been removed.

Remaining hooks should be evaluated individually.

Do not automatically create one V2 file for every old hook.

Related responsibilities may be consolidated where appropriate.

---

# 56. Legacy Builder Logic

Current area:

```text
app/create-assessment/builder/builder-logic/
```

**Status:** LEGACY — ACTIVE

Contains mixed responsibilities.

Some modules have already received V2 replacements/adapters.

Others remain important to:

- paper state;
- quality analysis;
- Course configuration;
- question generation coordination;
- Assessment Creator behaviour.

This is not a valid future V2 domain.

Migrate by responsibility rather than moving the folder wholesale.

---

# 57. Legacy Builder Components

Current area:

```text
app/create-assessment/builder/components/
```

**Status:** LEGACY — ACTIVE BUT SIGNIFICANTLY REDUCED

Several old visual owners have already been removed from the V2 Assessment Creation dependency chain.

Still-live components must be audited individually because Compilation and Settings may consume them.

---

# 58. `course-data/`

**Status:** LEGACY — ACTIVE

Historical Course data/configuration remains important to the working application.

Responsibilities should progressively separate toward:

```text
src/Courses/
```

Do not move the entire folder wholesale.

Preserve useful Course organisation while assigning actual owners.

---

# 59. `math-helpers/`

**Status:** LEGACY — ACTIVE WHERE REMAINING

This is not an accepted V2 architectural owner.

Its contents must be assigned to their real:

- Course;
- Assessment;
- document;
- or other domain owner.

PaperWorkspace has already been verified free of direct `math-helpers` imports.

---

# 60. `shared-types/`

**Status:** LEGACY — ACTIVE

Many current V2 files still consume historical shared types such as:

```text
AssessmentTypes
```

This folder must not simply become:

```text
src/SharedTypes/
```

Types should move gradually to their owning domains when safe.

Because types may be consumed widely, this migration requires careful dependency mapping.

---

# 61. `page-sections/`

**Status:** LEGACY — AUDIT/MIGRATION REQUIRED

Historical page/component organisation remains outside the V2 ownership model.

Inspect actual responsibilities before moving or deleting.

---

# 62. Root Infrastructure

These remain normal repository/framework infrastructure:

```text
public/
package.json
package-lock.json
tsconfig.json
next.config.ts
eslint.config.mjs
postcss.config.mjs
.gitignore
```

**Status:** KEEP

Do not move infrastructure beneath `src` merely for symmetry.

---

# 63. TypeScript Alias

Current alias:

```json
"paths": {
  "@/*": ["./*"]
}
```

**Status:** TRANSITIONAL — ACTIVE

This currently allows imports to both legacy root source and V2 `src`.

Long-term alias simplification should occur only when legacy dependency volume makes it safe.

Do not change it prematurely.

---

# 64. Next.js Generated Types

Generated source beneath:

```text
.next/
```

**Status:** GENERATED — NEVER MANUALLY EDIT

After route movement, stale generated validators may create false diagnostics.

Use:

```bash
npx next typegen
npx tsc --noEmit
```

and regenerate `.next` where required.

Do not treat `.next` source as repository architecture.

---

# 65. Architecture V2 Workspace

External workspace:

```text
VecEd-Architecture-V2.code-workspace
```

**Status:** DEVELOPMENT ENVIRONMENT — OUTSIDE REPOSITORY

It may visually hide legacy areas.

This does not alter physical repository state.

---

# 66. Current Major Completed V2 Areas

At this checkpoint, meaningful canonical migrations include:

```text
Architecture documentation

UI/Application theme and appearance architecture

UI/Application HeaderBar

UI/Application SettingsDrawer

Assessment Setup

Assessment Creation TopBar

Assessment Creation SkillsPanel interaction

Assessment Creation question state/drafts

Assessment Creation question Preview components

Assessment Creation PaperWorkspace

Assessment Creation HUDBar

Assessment quality-note model

Assessment Creation persistence modules

generic document A4/layout/content primitives

National Qualifications document templates

National 5 Maths Course Documents

National 5 Maths QuestionGeneration ownership
```

This list describes architectural milestones, not necessarily complete legacy independence of each wider domain.

---

# 67. Current Major Remaining Seams

The most important unfinished areas currently include:

```text
AssessmentCreatorPage remaining legacy Builder imports

giant / mixed Assessment Settings implementation

remaining Builder behaviour and Builder logic ownership

CourseRegistry / CourseDefinition contract

remaining course-data migration

National5Maths SkillsTree Course ownership

National5Maths paper Course ownership

Classes domain migration

shared-types dismantling

remaining math-helpers migration

Compilation migration

root app → src/app routing migration

remaining persistence consolidation

legacy application pages outside Assessment Creation
```

These should be migrated in bounded responsibility stages.

---

# 68. Current Recommended Next Assessment Creation Audit

Now that:

```text
PaperWorkspace
```

is V2-clean, the next useful architectural audit should begin from:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

and identify its remaining direct imports from:

```text
app/create-assessment/builder/
math-helpers/
course-data/
shared-types/
```

Do not automatically migrate everything in one pass.

Group related imports into coherent ownership clusters.

Likely significant targets include:

```text
Assessment Settings
remaining Builder behaviour hooks
remaining paper behaviour
quality-analysis dependencies
Course configuration dependencies
```

The exact order should follow dependency analysis.

---

# 69. Compilation Must Remain Separate

Do not fold:

```text
app/compile-assessment/page.tsx
```

into the current Assessment Creation cleanup merely because it shares question/document code.

Compilation has its own architectural migration.

Before migrating it, inspect:

```text
storage/data handoff
page sizing
pagination
document frames
question rendering
paper configuration
route behaviour
```

The final target should then be established deliberately beneath:

```text
src/Assessments/Compilation/
```

---

# 70. Repository Navigation Guide

For current work, use these starting points:

```text
Assessment Creator orchestration
→ src/Assessments/Creation/AssessmentCreatorPage.tsx

Assessment Setup
→ src/Assessments/Creation/Setup/

Assessment TopBar
→ src/Assessments/Creation/TopBar/

Skills interaction
→ src/Assessments/Creation/SkillsPanel/

Paper preview/workspace
→ src/Assessments/Creation/PaperWorkspace/

Question creation-preview components
→ src/Assessments/Creation/Questions/Preview/

HUD / progress / notes UI
→ src/Assessments/Creation/HUDBar/

Assessment quality model
→ src/Assessments/Creation/Analysis/

Assessment persistence
→ src/Assessments/Creation/Persistence/

National 5 Maths question generation
→ src/Courses/National5Maths/QuestionGeneration/

National 5 Maths document pages
→ src/Courses/National5Maths/Documents/

application theme
→ src/UI/Application/Theme/

global HeaderBar
→ src/UI/Application/HeaderBar/

global Settings
→ src/UI/Application/SettingsDrawer/

generic A4 / document content
→ src/UI/Documents/Components/

document physical units
→ src/UI/Documents/Layout/

National Qualifications visual templates
→ src/UI/Documents/Templates/NationalQualifications/

final assessment compilation
→ currently app/compile-assessment/page.tsx
  LEGACY — ACTIVE
```

---

# 71. Critical Do-Not-Delete List

At this checkpoint, do not delete simply because newer equivalents exist:

```text
app/compile-assessment/page.tsx

src/UI/Documents/Components/DocumentPageFrame.tsx

app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx

active Builder behaviour/logic still imported by AssessmentCreatorPage

active course-data dependencies

active shared-types dependencies
```

Delete only after a broad consumer audit proves replacement or obsolescence.

---

# 72. Critical Do-Not-Recreate List

Do not recreate removed or superseded architectural owners such as:

```text
root ui/

BuilderTopBar monolith

BuilderBottomHud

AssessmentProgressHud

UseBuilderProgressHudRows

Builder preview engine

duplicate National5Maths cover/formula owners

generic new Helpers/

generic new SharedTypes/

permanent Assessment Creation Builder architecture
```

---

# 73. Current Milestone

The current documentation checkpoint follows completion of a substantial Assessment Creation migration.

Most importantly:

```text
src/Assessments/Creation/PaperWorkspace/
```

has been verified through local grep to contain **zero direct dependencies** on:

```text
app/create-assessment/builder/
math-helpers/
```

Its related Preview, Questions/Preview and HUD behaviour were browser-tested successfully.

The following behaviours were confirmed working:

- P1/P2 switching;
- question interactions;
- editing/removing;
- preview modes;
- HUD resizing;
- notes;
- marks/timings;
- Compile navigation.

This is the current known-good architectural checkpoint.

---

# 74. Final Map Principle

When this file and source code appear to disagree:

```text
inspect the actual current repository
```

and update this map at the next meaningful checkpoint.

Do not alter long-lived Architecture rules merely because a transitional implementation still exists.

The repository is currently a controlled mixture of:

```text
CANONICAL V2
+
ACTIVE LEGACY
+
EXPLICIT MIGRATION BOUNDARIES
```

The goal of the remaining refactor is to shrink the second category without destabilising the first.