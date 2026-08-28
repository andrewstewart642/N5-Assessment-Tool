# N5 Assessment Tool Repository Map

## 1. Purpose

This document is the authoritative map of the current repository.

It describes:

- where runtime source code belongs;
- which product area owns each responsibility;
- how Next.js routing is separated from product architecture;
- where shared application UI belongs;
- where generated-document UI belongs;
- where Course-specific educational knowledge belongs;
- where the Home experience belongs;
- where the My Assessments library belongs;
- where PDF generation belongs;
- and where historical migration material belongs.

This document describes the repository **as it exists now**.

Historical paths and migration steps belong in:

```text
Docs/RefactorLedger.md
```

They should not be preserved here as current architecture.

---

## 2. Repository Root

High-level repository structure:

```text
N5-Assessment-Tool/
├── app/
├── Docs/
├── AGENTS.md
├── next.config.ts
├── package.json
├── tsconfig.json
└── framework/tooling configuration
```

Runtime application source belongs beneath:

```text
app/
```

There is no separate `src/` source tree.

---

## 3. Runtime Source Root

Current runtime ownership structure:

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

The seven primary runtime ownership areas are:

```text
Assessments/
Classes/
Courses/
DeveloperTools/
Home/
MyAssessments/
UI/
```

These folders describe product responsibility. They are not route folders.

Global application CSS lives at:

```text
app/UI/Application/Styles/ApplicationGlobals.css
```

---

# Routing

## 4. Routing Philosophy

The application does not maintain a duplicate filesystem tree for public URLs.

Do not recreate route-signpost feature trees such as:

```text
app/create-assessment/
app/compile-assessment/
app/my-assessments/
app/my-classes/
app/dev/
```

Public URLs are mapped through:

```text
next.config.ts
```

using internal rewrites.

Those rewrites dispatch into:

```text
app/page.tsx
```

The global Next.js layout remains:

```text
app/layout.tsx
```

---

## 5. Current Application Routes

```text
/
→ Home

/compile-assessment
→ Assessment Compilation

/create-assessment
→ Assessment Setup

/create-assessment/builder
→ Assessment Creator

/my-assessments
→ My Assessments

/my-classes
→ My Classes

/my-classes/:classId
→ Class Details

/dev/generator-tester
→ Generator Tester
```

`next.config.ts` owns the public URL rewrite map.

`app/page.tsx` is the thin application routing adapter.

Neither should become a home for feature implementation.

---

## 6. Next.js Framework Files

Framework-significant root files include:

```text
app/layout.tsx
app/page.tsx
```

A real route-handler boundary also exists for server PDF generation:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

Inside `app/`, filenames such as `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx` and similar Next.js special names must be introduced deliberately.

Ordinary product page implementations should use descriptive names.

---

# Home

## 6A. Home Root

The Home experience is a first-class product area beneath:

```text
app/Home/
```

Current high-level structure includes:

```text
app/Home/
├── ContinueWorking/
├── DepartmentActivity/
├── ForYou/
├── Header/
├── HomeDashboardData/
├── MyClassesOverview/
├── ProductUpdates/
├── SharedComponents/
├── UpcomingAssessments/
└── HomePage.tsx
```

Home owns the Home dashboard/page experience and its Home-specific composition/data/presentation.

Reusable application-wide visual infrastructure remains beneath `app/UI/Application/`; the existence of a Home consumer does not move global UI ownership into Home.

---

# Assessments

## 7. Assessments Root

Assessment-owned functionality lives beneath:

```text
app/Assessments/
```

Current high-level structure:

```text
app/Assessments/
├── AssessmentTypes.ts
├── Compilation/
├── Creation/
├── Questions/
└── SavedAssessments/
```

Assessments owns generic assessment workflow, persistence contracts and compilation.

It should not own Course-specific educational knowledge.

The user-facing saved-assessment library now lives separately beneath `app/MyAssessments/`.

---

## 8. Assessment Compilation

Compilation lives beneath:

```text
app/Assessments/Compilation/
```

Current high-level structure includes:

```text
Compilation/
├── Model/
├── Pagination/
├── PDF/
├── Rendering/
├── AssessmentCompilationPage.tsx
├── CompilationPageSizes.ts
└── CompilationPagination.ts
```

Compilation owns the process of turning saved assessment data into a canonical, paginated and renderable assessment document.

It is separate from Assessment Creation.

---

## 9. Compilation Model

Canonical compilation data lives beneath:

```text
app/Assessments/Compilation/Model/
```

Important files include:

```text
AssessmentCompilationDocument.ts
buildAssessmentCompilationDocument.ts
```

This layer converts saved assessment state into the canonical document model consumed by compilation/rendering/PDF systems.

---

## 10. Compilation Pagination

Pagination implementation lives beneath:

```text
app/Assessments/Compilation/Pagination/
```

Important file:

```text
AssessmentCompilationPagination.ts
```

This layer owns page grouping and pagination behaviour for compiled assessments.

---

## 11. Compilation Rendering

Compiled document rendering lives beneath:

```text
app/Assessments/Compilation/Rendering/
```

Current files include:

```text
AssessmentCompiledDocument.tsx
AssessmentCompiledPage.tsx
AssessmentCompiledQuestion.tsx
```

These components render the canonical compilation model using Course/document infrastructure.

---

## 12. PDF Generation

Assessment PDF generation lives beneath:

```text
app/Assessments/Compilation/PDF/
```

Current responsibilities/files include:

```text
PDF/
├── Client/
├── generate/
├── AssessmentPdfBrowser.ts
├── AssessmentPdfDocument.tsx
├── AssessmentPdfDownloadButton.tsx
├── AssessmentPdfHtml.tsx
├── AssessmentPdfKatexStyles.ts
└── generateAssessmentPdf.ts
```

The server generation route is:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

The PDF pipeline owns:

- standalone assessment HTML generation;
- embedded KaTeX CSS/font assets;
- Chromium/Puppeteer browser launch;
- PDF byte generation;
- download/server response behaviour.

---

## 13. PDF Client Assets

Generated PDF client/cache behaviour lives beneath:

```text
app/Assessments/Compilation/PDF/Client/
```

Current files include:

```text
AssessmentPdfAssetCache.ts
useAssessmentPdfAsset.ts
```

This layer owns reusable generated assessment PDF assets consumed by UI such as My Assessments.

The `useAssessmentPdfAsset.ts` filename predates the later responsibility-first filename rule and may remain until a real reason to touch it; the naming overhaul was targeted rather than a mandate to churn every acceptable existing file indefinitely.

---

## 14. Assessment Creation

Assessment Creation lives beneath:

```text
app/Assessments/Creation/
```

Main page entry points include:

```text
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
```

Current feature structure includes areas such as:

```text
app/Assessments/Creation/
├── Analysis/
├── AssessmentSettings/
├── Feedback/
├── HUDBar/
├── Papers/
├── PaperWorkspace/
├── Persistence/
├── Questions/
├── Setup/
├── SkillsPanel/
├── TopBar/
├── AssessmentCreatorPage.tsx
└── AssessmentSetupPage.tsx
```

These folders represent visible or behavioural areas of Assessment Creation.

The 28 August 2026 naming pass deliberately made child filenames responsibility-readable rather than repeating the entire parent context or exposing implementation details such as `use...` in filenames.

---

## 15. Assessment Creation — Setup

Setup lives beneath:

```text
app/Assessments/Creation/Setup/
```

Current high-level contents include:

```text
Setup/
├── Controls/
├── Sections/
├── ClassCoverageState.ts
├── ClassCoverageStorage.ts
├── ClassLoader.ts
├── CoursePaperOptions.ts
├── CourseSelect.tsx
├── CreateAssessment.ts
├── FormState.ts
├── SavedChoices.ts
├── SetupCard.tsx
├── TargetCalculations.ts
└── TargetState.ts
```

It owns configuration collected before entering the main Creator.

Responsibilities include Course selection, assessment type, paper structure, marks/time targets, assessment metadata, class/coverage selection and document options.

Reusable setup controls and visible setup sections should remain owned here.

---

## 16. Assessment Creation — TopBar

The Creator upper control region lives beneath:

```text
app/Assessments/Creation/TopBar/
```

Current files are:

```text
DateCalendarBehaviour.ts
DateField.tsx
Dimensions.ts
FieldWithLabel.tsx
NameField.tsx
NameFieldBehaviour.ts
PaperSelector.tsx
TopBar.tsx
```

It owns assessment metadata and paper/view controls in the upper workspace region.

`TopBar` is distinct from the global application `HeaderBar`.

---

## 17. Assessment Creation — HUDBar

The lower Creator status/control region lives beneath:

```text
app/Assessments/Creation/HUDBar/
```

Current responsibility files include:

```text
CompileButton.tsx
HUDBar.tsx
ProgressPanel.tsx
ProgressMetrics.ts
ProgressRows.ts
```

It owns lower workspace status and controls such as Marks & Timings, Notes and the Compile action.

---

## 18. Assessment Creation — SkillsPanel

The Skills Panel lives beneath:

```text
app/Assessments/Creation/SkillsPanel/
```

Current high-level structure includes:

```text
SkillsPanel/
├── 01-SkillsFilters/
├── 02-SkillsTree/
├── AssessmentClassCoverage.ts
├── AssessmentSkillsPanel.tsx
├── ClassCoverageState.ts
├── PanelState.ts
└── QuestionTreeRestoration.ts
```

`02-SkillsTree/TreeState.ts` owns the tree's internal React state while the exported hook itself retains React `use...` naming.

The `01-` / `02-` folder ordering is intentional: it mirrors the webpage/product order in which Skills Filters appear above the Skills Tree.

Responsibilities include:

- skill filtering;
- skill-tree presentation;
- concept selection;
- difficulty controls;
- class coverage integration;
- assessment skill-selection state.

Course-specific skill definitions do not belong here.

---

## 19. Assessment Creation — Papers

Paper workflow state lives beneath:

```text
app/Assessments/Creation/Papers/
```

Current files are:

```text
ActiveAndViewedPaper.ts
AutomaticEndTimes.ts
IntendedDuration.ts
MarkTargetCalculations.ts
MarkTargetEditing.ts
MarkTargetSummary.ts
PaperRules.ts
PaperSpecificValues.ts
SittingSchedule.ts
TimeCalculations.ts
```

Responsibilities include paper selection, target marks, intended timing, paper sitting state, paper-specific values and generic paper workflow.

Course-specific paper rules belong beneath:

```text
app/Courses/Papers/
```

---

## 20. Assessment Creation — PaperWorkspace

The central Creator workspace lives beneath:

```text
app/Assessments/Creation/PaperWorkspace/
```

Current root files are:

```text
CompactPreviewSpacing.ts
Dimensions.ts
Divider.tsx
LayoutAndResizing.ts
PageScrollLock.ts
ViewMode.ts
ViewModeState.ts
Workspace.tsx
Preview/
```

Responsibilities include workspace layout, split-panel behaviour, preview view mode, divider behaviour, preview viewport behaviour, document locking and preview composition.

Preview-specific implementation belongs beneath:

```text
app/Assessments/Creation/PaperWorkspace/Preview/
```

Current Preview responsibilities include:

```text
DisplayedDateAndTime.ts
FloatingControlsVisibility.ts
JumpToQuestion.ts
PageAssembly.ts
PageData.ts
PageRenderer.tsx
Pagination.ts
Pane.tsx
PrintedPaperDetails.ts
Question.tsx
QuestionPage.tsx
SaveStatusIndicator.tsx
ScrollPositionPreservation.ts
ZoomAndPageTracking.ts
ZoomControls.tsx
Tray/
```

The shared preview-edge Settings/View tray lives beneath:

```text
app/Assessments/Creation/PaperWorkspace/Preview/Tray/
```

Current Tray files are:

```text
ClockPicker.tsx
DateEditor.tsx
ScheduleEditor.tsx
SegmentedControl.tsx
SettingsTab.tsx
Tab.tsx
TimeEditor.tsx
TimeParsingAndFormatting.ts
ToggleRow.tsx
Tray.tsx
ViewModeSelector.tsx
ViewTab.tsx
WorkspaceControls.tsx
```

---

## 21. Assessment Creation — Questions

Creation-specific question workflow lives beneath:

```text
app/Assessments/Creation/Questions/
```

Current root files include:

```text
Actions.ts
DraftActions.ts
DraftDefaults.ts
DraftGeneration.ts
DraftTypes.ts
SelectionSettings.ts
Spacing.ts
WorkingState.ts
Preview/
```

Creator-specific question Preview files are:

```text
DraftQuestion.tsx
QuestionHeightMeasurement.tsx
QuestionHeightTracking.ts
WorkedAnswer.tsx
```

Responsibilities include question state, generated drafts, edit drafts, question controls, question workflow and Creator-specific preview behaviour.

Shared generic question contracts belong in `app/Assessments/Questions/`.

---

## 22. Assessment Creation — Analysis

Assessment quality analysis lives beneath:

```text
app/Assessments/Creation/Analysis/
```

Current concerns include topic balance, standard balance, calculator suitability, operational/reasoning balance and distribution/quality analysis.

---

## 23. Assessment Creation — Persistence

Creation persistence lives beneath:

```text
app/Assessments/Creation/Persistence/
```

Current files are:

```text
AutoSaveAssessment.ts
BrowserStorage.ts
CourseSelection.ts
LoadSavedAssessment.ts
RestoreInitialState.ts
SaveBrowserState.ts
SaveStatus.ts
```

Responsibilities include Creator initialisation/restoration, autosave, browser-state persistence, saved-assessment integration and Creation-specific persistence behaviour.

Persisted keys may retain historical names where required for compatibility.

---

## 23A. Assessment Creation — Feedback

Creation feedback state lives beneath:

```text
app/Assessments/Creation/Feedback/
```

Current primary module:

```text
FeedbackState.ts
```

This owns Creator feedback/quality-note and transient warning state without exposing the implementation detail that it is implemented as a React hook in the filename.

---

## 24. Saved Assessments

Persistent saved-assessment models and storage live beneath:

```text
app/Assessments/SavedAssessments/
```

Important files include:

```text
SavedAssessment.ts
SavedAssessmentsStorage.ts
```

This area owns saved-assessment data and persistence.

It is distinct from the My Assessments library UI.

---

## 25. Shared Assessment Question Architecture

Generic Assessment question functionality lives beneath:

```text
app/Assessments/Questions/
```

Current structure includes:

```text
Content/
Generation/
Preview/
Selection/
```

Generic question-content contracts belong in `Content/`.

Generic generation contracts belong in `Generation/`.

Shared interactive question preview behaviour belongs in `Preview/`.

Generic question-selection contracts belong in `Selection/`.

Course-specific generation implementation does not belong here.

---

# My Assessments

## 26. My Assessments Root

The user-facing assessment library lives beneath:

```text
app/MyAssessments/
```

Current structure:

```text
app/MyAssessments/
├── Actions/
├── Display/
├── Library/
├── ListView/
├── Preview/
├── TileView/
├── Toolbar/
└── MyAssessmentsPage.tsx
```

My Assessments is a first-class product owner.

It consumes SavedAssessments persistence and Assessment Compilation PDF assets without owning either of those lower-level systems.

---

## 27. My Assessments — Page Composition

Page composition lives in:

```text
app/MyAssessments/MyAssessmentsPage.tsx
```

It coordinates:

- saved-assessment loading;
- library filtering/sorting;
- tile/list mode;
- pin/duplicate/delete actions;
- delete confirmation;
- view-mode persistence;
- library child components.

---

## 28. My Assessments — Actions

Library-specific action UI lives beneath:

```text
app/MyAssessments/Actions/
```

Example responsibility:

```text
DeleteAssessmentModal.tsx
```

Persistent mutation still uses the SavedAssessments storage owner.

---

## 29. My Assessments — Display

Derived/formatting presentation logic lives beneath:

```text
app/MyAssessments/Display/
```

Current files are:

```text
LabelsAndDates.ts
Progress.ts
```

This area owns library-friendly assessment labels, date/time formatting and progress-display derivation.

It must not become a parallel persistence model.

---

## 30. My Assessments — Library

Library behaviour lives beneath:

```text
app/MyAssessments/Library/
```

Current files are:

```text
Filtering.ts
Sorting.ts
ViewOptions.ts
```

This includes view/filter/sort contracts and library filtering/sorting rules.

Keep these rules separate from tile/list presentation when they are shared between views.

---

## 31. My Assessments — TileView

Tile-specific presentation lives beneath:

```text
app/MyAssessments/TileView/
```

The tile view owns the visual assessment cards and their embedded scrollable PDF preview panes.

Tile presentation includes assessment metadata, progress, status, dates and assessment actions.

---

## 32. My Assessments — ListView

List-specific presentation lives beneath:

```text
app/MyAssessments/ListView/
```

The list view preserves key assessment information and actions in a denser management-oriented layout.

Preview is intentionally represented as a clear first-class action/column.

---

## 33. My Assessments — Preview

Library PDF preview presentation lives beneath:

```text
app/MyAssessments/Preview/
```

This includes PDF.js setup/canvas rendering and the large centred preview modal.

It consumes generated PDF assets from `app/Assessments/Compilation/PDF/Client/`.

It does not generate assessment PDFs itself.

---

## 34. My Assessments — Toolbar

Library controls live beneath:

```text
app/MyAssessments/Toolbar/
```

Current controls include search, status filtering, sorting, result count and Tile/List switching.

---

# Classes

## 35. Classes Root

Class-owned functionality lives beneath:

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

Classes owns saved school classes, metadata, completed-skill coverage, My Classes, Class Details and class persistence.

---

## 36. My Classes UI

My Classes-specific UI lives beneath:

```text
app/Classes/MyClasses/
```

Current files are:

```text
AddClassModal.tsx
CourseColourSettings.tsx
Grid.tsx
PageHeader.tsx
Tile.tsx
```

The folder context supplies “My Classes”, so child files use concise responsibility names rather than repeating `Class` in every filename.

---

## 37. Class Coverage

Class coverage functionality lives beneath:

```text
app/Classes/Coverage/
```

Current files are:

```text
AssessmentClassSelector.tsx
QuestionExamples.tsx
SelectedItem.ts
SelectionDetails.tsx
SkillsAndProgress.ts
SkillsTree.tsx
```

Coverage resolves educational structure through:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

This keeps Classes independent of any single qualification implementation.

---

## 38. Class Records

Class persistence/collection state lives beneath:

```text
app/Classes/Records/
```

Current files are:

```text
BrowserStorage.ts
Collection.ts
Normalisation.ts
```

`Records/` replaces the former generic `State/` folder in current source naming and owns storage, normalisation and the live class collection.

---

# Courses

## 39. Courses Root

Educational/domain knowledge belongs beneath:

```text
app/Courses/
```

Current generic Course structure includes areas such as:

```text
app/Courses/
├── Documents/
├── National5ApplicationsOfMaths/
├── National5Maths/
├── Papers/
├── Selection/
├── CourseAssessmentConfig.ts
├── CourseCatalog.ts
├── CourseRegistry.ts
└── CourseTypes.ts
```

Courses owns Course identity, registration, assessment configuration, Course-specific skills/documents/generation and exam evidence.

---

## 40. Course Identity

Course identity belongs to:

```text
app/Courses/CourseTypes.ts
```

`CourseId` should be imported from its Course owner rather than re-exported through unrelated domains.

---

## 41. Course Registry

Registered Course assessment configurations are owned by:

```text
app/Courses/CourseRegistry.ts
```

The registry exposes the canonical Course Assessment Config API.

---

## 42. Course Catalog

User-facing Course catalogue metadata belongs in:

```text
app/Courses/CourseCatalog.ts
```

The catalogue represents selectable/available Courses.

The registry represents assessment configuration.

---

## 43. Course Assessment Configuration

The generic Course assessment contract lives in:

```text
app/Courses/CourseAssessmentConfig.ts
```

Generic Assessment workflows should consume this contract rather than directly importing qualification-specific implementations.

---

## 44. Course Selection

Shared Course-selection persistence belongs beneath:

```text
app/Courses/Selection/
```

Persisted key strings may retain historical wording for backwards compatibility.

---

## 45. Course Paper Rules

Generic access to Course paper rules belongs beneath:

```text
app/Courses/Papers/
```

---

## 46. Course Documents Infrastructure

Generic Course-document registration/infrastructure belongs beneath:

```text
app/Courses/Documents/
```

Course-specific documents remain under their concrete Course folder.

---

## 47. National 5 Mathematics

National 5 Mathematics knowledge lives beneath:

```text
app/Courses/National5Maths/
```

Current high-level structure:

```text
National5Maths/
├── AssessmentConfig.ts
├── Documents/
├── ExamQuestionAndAnswerCatalog/
├── QuestionAndAnswerGeneration/
└── Skills/
```

Anything specific to National 5 Mathematics should normally be owned here rather than by generic Assessment code.

---

## 48. National 5 Mathematics Skills

Canonical National 5 Maths skills live beneath:

```text
app/Courses/National5Maths/Skills/
```

The Course configuration exposes this structure to generic consumers.

---

## 49. Exam Question and Answer Catalogue

Historical exam-question evidence lives beneath:

```text
app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/
```

Questions and marking schemes are separated from generated-question implementation.

---

## 50. National 5 Maths Question and Answer Generation

Course-specific generated-question implementation lives beneath:

```text
app/Courses/National5Maths/QuestionAndAnswerGeneration/
```

Current conceptual structure includes:

```text
AnswerMethods/
AnswerWriting/
QuestionWriting/
```

Question-writing owns concept selection/writers.

Answer-writing owns Course/concept-specific answer writers.

Answer-method knowledge remains Course-owned.

---

## 51. National 5 Mathematics Documents

Course-specific generated-document composition lives beneath:

```text
app/Courses/National5Maths/Documents/
```

Current structure includes:

```text
CoverPage/
FormulaSheet/
QuestionPage/
CourseDocuments.ts
National5MathsQuestionSpacing.ts
```

Course-specific document files compose generic document primitives and National Qualifications templates.

They should not own generic A4/document infrastructure.

---

## 52. National 5 Applications of Mathematics

National 5 Applications of Mathematics knowledge lives beneath:

```text
app/Courses/National5ApplicationsOfMaths/
```

The folder should grow only as genuine Course-specific implementation is added.

Do not create placeholder mirrored architecture merely to match National 5 Maths.

---

# UI

## 53. UI Root

Reusable presentation infrastructure lives beneath:

```text
app/UI/
```

Major separation:

```text
UI/
├── Application/
└── Documents/
```

These represent two different visual systems.

---

## 54. Application UI

Interactive application UI infrastructure lives beneath:

```text
app/UI/Application/
```

Current structure includes:

```text
Application/
├── Colours/
├── Components/
├── HeaderBar/
├── Motion/
├── Settings/
├── SettingsDrawer/
├── Shell/
├── Styles/
├── Theme/
└── Typography/
```

Home-specific product implementation lives beneath `app/Home/`, not `app/UI/Application/Home/`.

Application UI includes navigation, interactive controls, application theming, global settings, shell behaviour and application typography.

It is distinct from generated assessment documents.

---

## 55. Application Shell

Global shell infrastructure lives beneath:

```text
app/UI/Application/Shell/
```

Important files include:

```text
ApplicationActivityRail.tsx
ApplicationShellTokens.ts
```

`app/layout.tsx` composes the HeaderBar, Activity Rail and page-content region using these Application-owned shell pieces.

---

## 56. Application Colours

Application colour definitions live beneath:

```text
app/UI/Application/Colours/
```

---

## 57. Application Theme

Application theme infrastructure lives beneath:

```text
app/UI/Application/Theme/
```

This area owns semantic application theme tokens and appearance preference behaviour.

---

## 58. Application Typography

Application typography tokens live beneath:

```text
app/UI/Application/Typography/
```

These styles are shared across interactive application UI, not generated assessment documents by default.

---

## 59. Global HeaderBar

The global application header lives beneath:

```text
app/UI/Application/HeaderBar/
```

The global HeaderBar is distinct from Assessment Creation's TopBar.

---

## 60. Application Settings

Global application settings composition lives beneath:

```text
app/UI/Application/Settings/
```

Global settings are surfaced through the application shell/activity rail.

Assessment-specific Settings/View controls remain Assessment Creation-owned.

---

## 61. SettingsDrawer Compatibility Area

A `SettingsDrawer/` area remains beneath Application UI where existing components are still consumed.

Do not assume this historical folder is the preferred owner for new global settings work.

Remove compatibility pieces only after their consumers are migrated/proven absent.

---

## 62. Generic Application Components

Reusable interactive application components live beneath:

```text
app/UI/Application/Components/
```

Examples include action controls, calendar controls and generic drawer primitives.

A generic Application `Components/` folder remains valid because it is an established reusable UI owner; the responsibility-first naming rule is not a blind ban on the word “Components”. New generic buckets still require real shared ownership rather than convenience.

---

## 63. Documents UI

Generated-document infrastructure lives beneath:

```text
app/UI/Documents/
```

Current structure:

```text
app/UI/Documents/
├── Components/
├── Layout/
└── Templates/
```

This layer owns generated-document presentation rather than interactive application chrome.

---

## 64. Document Components

Generic generated-document primitives live beneath:

```text
app/UI/Documents/Components/
```

These components should remain qualification-agnostic where possible.

---

## 65. Document Layout

Generated-document measurement/layout utilities live beneath:

```text
app/UI/Documents/Layout/
```

Example responsibility:

```text
DocumentUnits.ts
```

---

## 66. National Qualifications Templates

Qualification-family templates live beneath:

```text
app/UI/Documents/Templates/NationalQualifications/
```

The layering model remains:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course Documents
        ↓
Assessment compilation/consumers
```

---

# Developer Tools and Documentation

## 67. Developer Tools

Runtime developer-only functionality lives beneath:

```text
app/DeveloperTools/
```

Current example:

```text
GeneratorTester/
```

`DeveloperTools/` is application source.

---

## 68. Repository Tooling

There is currently no permanent repository-level `Tools/` directory.

Historical Architecture V2 migration tooling was removed once completed and verified.

Migration history is preserved in `Docs/RefactorLedger.md` and Git history.

Runtime source must not depend on historical migration tooling.

---

## 69. Documentation

Architecture/project documentation lives beneath:

```text
Docs/
```

Current living/historical docs are:

```text
Docs/
├── Architecture.md
├── ChatGPTWorkflow.md
├── FeatureHistory.md
├── FutureFeatures.md
├── LockedDecisions.md
├── RefactorLedger.md
└── RepositoryMap.md
```

Repository-level agent instructions live in:

```text
AGENTS.md
```

All of these files are established canonical documents in the repository.

---

## 70. Documentation Responsibilities

```text
RepositoryMap.md
→ Where does something live?

Architecture.md
→ Why is the system divided this way and how should layers depend on each other?

LockedDecisions.md
→ Which durable decisions should not be casually reopened?

RefactorLedger.md
→ What happened during Architecture V2 migration?

FeatureHistory.md
→ What meaningful features/technical capabilities changed after the refactor?

FutureFeatures.md
→ What ideas/planned/deferred work should be remembered for later?

ChatGPTWorkflow.md
→ What is the safe AI-assisted workflow for this repository?

AGENTS.md
→ What must a coding agent know before working here?
```

Current-state documentation should be updated when physical owners/names change. Historical docs should retain historically accurate paths and receive clarifying successor/current-state notes rather than blind global rewrites.

---

# Repository Rules Summary

## 71. Ownership Rules

Ownership is determined by responsibility, not by whichever file currently imports something.

```text
Assessments
→ generic assessment workflow, persistence and compilation

MyAssessments
→ assessment library UI/workflow

Classes
→ class data and class workflows

Courses
→ educational/domain/Course knowledge

Home
→ Home-page product experience

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation

DeveloperTools
→ runtime developer utilities
```

---

## 72. Dependency Direction

Preferred high-level direction:

```text
Courses
        ↓
Assessments / Classes consume Course contracts
```

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course Documents
        ↓
Assessment compilation/consumers
```

```text
SavedAssessments / PDF assets
        ↓
MyAssessments consumes them
```

Avoid circular ownership.

A consumer may depend on an owner.

An owner should not move merely because another feature consumes it.

---

## 73. Course Knowledge Rule

Course-specific educational knowledge belongs beneath:

```text
app/Courses/<Course>/
```

Generic Assessment/Class/My Assessments code should consume Course contracts rather than hard-coding National 5 Maths knowledge.

---

## 74. No Generic Dumping Grounds

Do not introduce broad buckets such as:

```text
Helpers/
Utils/
Shared/
Common/
Misc/
shared-types/
```

without a durable architectural responsibility.

Likewise, prefer a filename that states a concrete responsibility over a vague helper/utility label.

---

## 75. No Shadow Route Architecture

Do not recreate physical feature-route folders solely because public URLs exist.

Routing remains:

```text
next.config.ts
        ↓
app/page.tsx
        ↓
product-owned implementation
```

---

## 76. Client Boundary Rule

`"use client"` should mark genuine client entry boundaries.

Nested hooks/components imported under an existing client boundary do not need their own directive merely because they use React hooks or browser APIs.

Do not add it defensively.

---

## 77. Persistence Rule

Persisted browser data is a compatibility contract.

Old storage keys or legacy field names may remain when required to preserve existing user data.

Do not rename persisted keys merely to make source terminology cleaner.

---

## 78. Naming and Discoverability Rule

The governing source naming rule is:

> **Folder = context. Filename = responsibility.**

Prefer current product terminology such as:

```text
HeaderBar
ActivityRail
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Preview Tray
Compilation
Creation
MyAssessments
SavedAssessments
```

For files:

- do not prefix filenames with `use` merely because they export React hooks;
- keep the exported hook's `use...` function name where React requires it;
- avoid repeating the full parent-folder context in every child filename;
- retain contextual wording only where removing it would create ambiguity;
- avoid `Utils`, `Helpers`, `Common`, `Shared` or `Misc` when the actual responsibility can be named;
- use meaningful ordering prefixes only where order itself communicates real product/curriculum structure.

`SkillsPanel/01-SkillsFilters/` and `SkillsPanel/02-SkillsTree/` are the intentional current example of meaningful ordered folders.

Do not reintroduce old Builder/source architecture solely because public URLs or persisted keys retain historical wording.

Do not infer a current product brand from historical internal identifiers.

The discoverability test is:

> If somebody unfamiliar with the implementation sees only the folder path and filename, can they make a sensible guess about what the file is responsible for?

---

## 79. Adding a New Feature

Before adding a new file, determine its owner.

Ask whether the responsibility is:

- generic Assessment workflow;
- assessment-library workflow;
- Class data/workflow;
- Course-specific educational knowledge;
- Home-page product behaviour;
- interactive Application UI;
- generated-document UI;
- runtime developer tooling;
- repository tooling.

Place the file according to the answer.

Then name the file for its responsibility within that owner rather than for the implementation mechanism used to build it.

Do not create a new top-level folder merely because no existing filename immediately seems suitable.

---

## 80. Adding a New Course

A new Course belongs beneath:

```text
app/Courses/<Course>/
```

Only create folders that correspond to real implementation.

Do not pre-create empty mirrored structures.

Expose the Course through generic Course contracts where appropriate.

---

## 81. Current Acceptance Standard

A future developer or coding agent with no knowledge of the repository's history should be able to open the repository and infer:

```text
app/Assessments/
→ generic assessment workflow, saving and compilation

app/MyAssessments/
→ saved-assessment library

app/Classes/
→ classes

app/Courses/
→ educational/Course knowledge

app/Home/
→ Home-page product experience

app/UI/
→ presentation systems

app/DeveloperTools/
→ runtime developer functionality
```

and should be able to descend into the major feature folders and make a sensible guess about individual file responsibilities from their paths/names.

That clarity is the acceptance standard for future structural work.

---

# PASS 4 — CURRENT NATIONAL 5 MATHEMATICS CATALOGUE MAP — 28 AUGUST 2026

## 82. Current National 5 Maths Map Overrides Sections 47–51

Sections 47–51 above are retained as a record of the immediately preceding National 5 Maths layout, but they no longer describe the current physical `National5Maths/` tree. For current navigation, use this section.

There are now two distinct National 5 Maths areas during the transition:

```text
app/Courses/National5Maths/
→ clean destination catalogue/generation workspace

app/Courses/National5MathsLegacy/
→ preserved former working Course implementation used by runtime compatibility imports
```

Do not confuse them merely because both are under `app/Courses/`.

---

## 83. Clean National 5 Maths Root

Current clean structure:

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

The numeric prefixes are intentional workflow ordering.

Current core files include:

```text
CatalogCoreTypes.ts
01_QuestionCatalog/QuestionCatalogTypes.ts
01_QuestionCatalog/QuestionCatalogHelpers.ts
05_VisualAssets/VisualCatalogTypes.ts
National5MathsConfig.ts
```

The `02_AnswerCatalog`, `03_QuestionGeneration`, `04_AnswerGeneration`, `PaperContexts` and clean `Skills` areas are destination owners whose population/migration continues in bounded passes.

---

## 84. Preserved National 5 Maths Legacy Root

The previous working Course implementation currently lives at:

```text
app/Courses/National5MathsLegacy/
├── AssessmentConfig.ts
├── Documents/
├── ExamQuestionAndAnswerCatalog/
├── QuestionAndAnswerGeneration/
└── Skills/
```

This is compatibility source during the migration, not the intended long-term architecture.

Do not add new catalogue/generation work there merely because runtime consumers still resolve into it.

Do not delete it until consumers have been migrated and replacement owners are verified.

---

## 85. Question Catalogue Physical Structure

Question Catalogue root:

```text
app/Courses/National5Maths/01_QuestionCatalog/
```

It contains the universal master contract/helpers plus year/paper data.

Historical year structure is intended for:

```text
2014
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

Each year uses:

```text
Paper1/
Paper2/
```

There is no normal 2020 examination-paper catalogue year.

Question filenames use:

```text
N5_Maths_YYYY_Px_Qn.ts
```

Current fully populated/re-audited pilot folders are:

```text
app/Courses/National5Maths/01_QuestionCatalog/2014/Paper1/
app/Courses/National5Maths/01_QuestionCatalog/2014/Paper2/
```

with 13 numbered Question files in each.

---

## 86. Answer Catalogue Physical Structure

Answer/Marking Scheme evidence belongs beneath:

```text
app/Courses/National5Maths/02_AnswerCatalog/
```

It follows the same year / `Paper1` / `Paper2` organisation as Question Catalogue.

Matching per-Question files use:

```text
N5_Maths_YYYY_Px_Qn_MS.ts
```

The Answer Catalogue is the destination for structured historical marking evidence; do not put new marking-scheme catalogue entries back into `National5MathsLegacy/ExamQuestionAndAnswerCatalog`.

---

## 87. Question Generation Physical Owner

New catalogue-informed Course-specific Question generation belongs beneath:

```text
app/Courses/National5Maths/03_QuestionGeneration/
```

This is distinct from:

```text
app/Assessments/Questions/Generation/
→ generic Assessment generation contracts
```

and from:

```text
app/Courses/National5MathsLegacy/QuestionAndAnswerGeneration/
→ preserved old runtime generation implementation during migration
```

---

## 88. Answer Generation Physical Owner

New Course-specific Answer generation belongs beneath:

```text
app/Courses/National5Maths/04_AnswerGeneration/
```

It will consume paired Question/Answer catalogue knowledge and produce Assessment-native answer/marking output without storing historical marking-scheme wording as templates.

---

## 89. Visual Assets Physical Owner

Visual semantic types, deterministic renderer families and approved context-asset knowledge belong beneath:

```text
app/Courses/National5Maths/05_VisualAssets/
```

Current master visual contract:

```text
app/Courses/National5Maths/05_VisualAssets/VisualCatalogTypes.ts
```

Mathematical diagrams are intended to be recreated from semantic models through original procedural rendering. Context image assets, when used, require appropriate licence/source metadata.

---

## 90. Paper Contexts

Paper-level historical context belongs beneath:

```text
app/Courses/National5Maths/PaperContexts/
```

Paper context is separate from individual Question records because duration, marks, calculator regime, source type and other paper-wide conditions apply across many Questions.

Known corpus regimes include standard papers, the 2021 Assessment Resource and the 2022–2023 Modified papers.

---

## 91. Current Compatibility Alias

`tsconfig.json` currently maps:

```text
@/app/Courses/National5Maths
@/app/Courses/National5Maths/*
```

to:

```text
./app/Courses/National5MathsLegacy
./app/Courses/National5MathsLegacy/*
```

while retaining:

```text
@/* → ./*
```

Therefore, during this transition, the historical National5Maths alias does **not** point to the clean destination tree.

New files inside the clean catalogue/generation workspace currently use relative imports where necessary to avoid accidental legacy resolution.

---

## 92. VS Code Legacy Hiding

`.vscode/settings.json` currently hides:

```text
**/National5MathsLegacy
**/.gitkeep
```

and excludes `National5MathsLegacy` from normal search.

This is Explorer/search convenience only.

It does not:

```text
delete legacy source
remove it from Git
change TypeScript resolution
prove it is unused
```

---

## 93. Current 2014 Catalogue State

Current clean Question catalogue includes:

```text
2014 Paper 1 → Q1–Q13
2014 Paper 2 → Q1–Q13
```

All 26 entries have been rewritten against the strengthened universal Question Catalogue contract and include source response-space measurement plus the wider semantic/generation evidence model.

Their Answer/MS counterpart files are not yet populated, so counterpart cross-check/review remains outstanding.
