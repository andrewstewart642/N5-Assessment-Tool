# N5 Assessment Tool — Current Repository Map

## 1. Purpose

This document is the human-readable navigation map for the repository **as it exists now**.

Use it to answer:

```text
Where does this responsibility live?
Which file is the likely entry point?
Which registry or composition root wires it into runtime?
What should I inspect next if something breaks?
```

This file describes **physical location and practical navigation**.

For dependency principles and ownership rules, use:

```text
Docs/Architecture.md
```

For mandatory preservation, copyright/source-isolation and development rules, use:

```text
AGENTS.md
```

For the detailed National 5 Mathematics evidence/generation model, use:

```text
app/Courses/National5Maths/ARCHITECTURE.md
```

This document intentionally does not preserve obsolete migration paths. Git history and designated historical documentation preserve the past.

---

## 2. Repository Root

```text
N5-Assessment-Tool/
├── app/
├── Docs/
├── scripts/
├── public/
├── AGENTS.md
├── next.config.ts
├── package.json
├── tsconfig.json
└── framework / tooling configuration
```

Runtime application source lives beneath:

```text
app/
```

There is no parallel runtime `src/` tree.

---

## 3. Runtime Source Root

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

Quick ownership map:

```text
Assessments
→ generic assessment creation, question contracts, persistence and compilation

Classes
→ class data, persistence, class pages and class coverage

Courses
→ Course identity, educational knowledge, Course configuration and Course-specific content/generation

DeveloperTools
→ runtime developer-only interfaces

Home
→ Home-page product experience

MyAssessments
→ user-facing saved-assessment library

UI/Application
→ interactive application presentation

UI/Documents
→ printable/generated document presentation
```

---

# Routing and Global Composition

## 4. `app/page.tsx`

`app/page.tsx` is the thin application routing adapter.

It imports the main product page entry points, including:

```text
HomePage
AssessmentSetupPage
AssessmentCreatorPage
AssessmentCompilationPage
MyAssessmentsPage
MyClassesPage
ClassDetailsPage
Generator Tester pages
```

It selects the correct page using internal route information supplied through the rewrite layer.

**Start here when:** the wrong product page loads, a route falls through, or a page entry point is not being reached.

**Trace next:** `next.config.ts` for public URL rewrites, then the selected product page.

---

## 5. `app/layout.tsx`

`app/layout.tsx` is the global application composition root.

It imports:

```text
KaTeX stylesheet
ApplicationGlobals.css
HeaderBar
SettingsProvider
ApplicationActivityRail
ApplicationShellTokens
```

It exports the root layout and application metadata.

**Start here when:** global shell, header, activity rail, application sizing or settings-provider behaviour is wrong across multiple pages.

---

# Assessments

## 6. Assessments Root

```text
app/Assessments/
├── AssessmentTypes.ts
├── Compilation/
├── Creation/
├── Questions/
└── SavedAssessments/
```

`AssessmentTypes.ts` owns generic assessment concepts used across assessment workflows.

Course-specific educational meaning does not belong here.

---

# Assessment Creation

## 7. Creation Root

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

### Main entry files

```text
AssessmentSetupPage.tsx
→ pre-Creator assessment configuration

AssessmentCreatorPage.tsx
→ main interactive assessment-building composition root
```

**Start here when:** a Creation feature appears across several subareas or it is unclear where Creator state is composed.

---

## 8. Setup

```text
app/Assessments/Creation/Setup/
```

Important responsibilities include:

```text
CourseSelect.tsx
CoursePaperOptions.ts
CreateAssessment.ts
FormState.ts
SavedChoices.ts
TargetCalculations.ts
TargetState.ts
ClassLoader.ts
ClassCoverageState.ts
ClassCoverageStorage.ts
Controls/
Sections/
```

Owns Course selection, assessment type/structure, initial targets, class/coverage selection and setup-time options.

**Trace next for Course-specific behaviour:** `app/Courses/CourseRegistry.ts` and `CourseAssessmentConfig.ts`.

---

## 9. TopBar

```text
app/Assessments/Creation/TopBar/
```

Current responsibility files include:

```text
TopBar.tsx
DateField.tsx
NameField.tsx
PaperSelector.tsx
DateCalendarBehaviour.ts
NameFieldBehaviour.ts
Dimensions.ts
```

Owns the Creator upper control region.

Do not confuse it with the global Application `HeaderBar`.

---

## 10. HUDBar

```text
app/Assessments/Creation/HUDBar/
```

Important files include:

```text
HUDBar.tsx
CompileButton.tsx
ProgressPanel.tsx
ProgressMetrics.ts
ProgressRows.ts
```

Owns lower Creator status/control presentation.

---

## 11. SkillsPanel

```text
app/Assessments/Creation/SkillsPanel/
├── 01-SkillsFilters/
├── 02-SkillsTree/
├── AssessmentClassCoverage.ts
├── AssessmentSkillsPanel.tsx
├── ClassCoverageState.ts
├── PanelState.ts
└── QuestionTreeRestoration.ts
```

This is the generic interactive skills-selection UI.

The actual Course skill tree comes through Course configuration.

**Start here when:** skill filtering, tree presentation, concept selection or class-coverage display is wrong.

**Trace next for National 5 Mathematics skill capability:**

```text
app/Courses/National5Maths/AssessmentConfig.ts
app/Courses/National5Maths/Skills/BuilderSkillRegistry.ts
```

---

## 12. Papers

```text
app/Assessments/Creation/Papers/
```

Important files include:

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

Owns generic paper workflow and sitting state.

Course-supplied paper configuration enters through the Course contracts rather than being hard-coded here.

---

## 13. PaperWorkspace

```text
app/Assessments/Creation/PaperWorkspace/
```

Important root responsibilities include:

```text
Workspace.tsx
LayoutAndResizing.ts
Divider.tsx
Dimensions.ts
ViewMode.ts
ViewModeState.ts
PageScrollLock.ts
CompactPreviewSpacing.ts
Preview/
```

Preview-specific implementation lives beneath:

```text
app/Assessments/Creation/PaperWorkspace/Preview/
```

Important files include:

```text
Pane.tsx
PageAssembly.ts
PageData.ts
PageRenderer.tsx
Pagination.ts
Question.tsx
QuestionPage.tsx
PrintedPaperDetails.ts
ScrollPositionPreservation.ts
ZoomAndPageTracking.ts
ZoomControls.tsx
Tray/
```

The Settings/View pull-out tray lives beneath:

```text
app/Assessments/Creation/PaperWorkspace/Preview/Tray/
```

with responsibilities such as schedule editing, date/time editing, view modes and workspace controls.

**Start here when:** Creator preview layout, pagination, zoom, page positioning or Preview Tray behaviour is wrong.

---

## 14. Creation Question Workflow

```text
app/Assessments/Creation/Questions/
```

Important files include:

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

Owns Creator-specific generated-question/draft state and workflow.

Generic question contracts are higher in `app/Assessments/Questions/`.

Course-specific generation is lower in the concrete Course.

**Trace a generation problem in this order:**

```text
Creation/Questions/DraftGeneration.ts
        ↓
generic Assessment generation contracts
        ↓
Course generation registry / concept module
```

---

## 15. Creation Persistence

```text
app/Assessments/Creation/Persistence/
```

Important files include:

```text
AutoSaveAssessment.ts
BrowserStorage.ts
CourseSelection.ts
LoadSavedAssessment.ts
RestoreInitialState.ts
SaveBrowserState.ts
SaveStatus.ts
```

Owns Creation-specific restore/autosave/browser persistence behaviour.

Persisted values are compatibility contracts; do not casually rename them.

---

## 16. Analysis and Feedback

```text
app/Assessments/Creation/Analysis/
app/Assessments/Creation/Feedback/
```

`Analysis/` owns assessment-quality calculations such as topic, standard and thinking balance.

`Feedback/` owns Creator feedback/warning state.

Course-specific targets/policy should enter through Course configuration rather than being embedded into generic analysis logic.

---

# Generic Question Contracts

## 17. `app/Assessments/Questions/`

```text
app/Assessments/Questions/
├── Content/
├── Generation/
├── Preview/
└── Selection/
```

```text
Content
→ generic structured question/answer content contracts

Generation
→ generic generator interfaces and payload contracts

Selection
→ generic eligibility/filter metadata

Preview
→ shared Assessment-owned interactive preview behaviour
```

These folders define generic contracts. They do not own National 5 Mathematics writing logic.

---

# Saved Assessments

## 18. `app/Assessments/SavedAssessments/`

Owns persisted saved-assessment data and storage.

Important files include:

```text
SavedAssessment.ts
SavedAssessmentsStorage.ts
CourseIdentity.ts
```

**Start here when:** saved data fails to load, normalise, preserve Course identity or survive a source refactor.

The My Assessments library consumes this data but does not own it.

---

# Compilation and PDF

## 19. Compilation Root

```text
app/Assessments/Compilation/
├── Model/
├── Pagination/
├── PDF/
├── Rendering/
├── AssessmentCompilationPage.tsx
├── CompilationPageSizes.ts
└── CompilationPagination.ts
```

Compilation turns a saved assessment into a canonical final document representation.

---

## 20. Canonical Compilation Model

```text
app/Assessments/Compilation/Model/
```

Important files:

```text
AssessmentCompilationDocument.ts
buildAssessmentCompilationDocument.ts
```

`buildAssessmentCompilationDocument.ts` imports:

```text
SavedAssessment contracts
SavedAssessment Course identity resolution
CourseRegistry
CourseAssessmentConfig helpers
Compilation pagination
```

and exports:

```text
buildAssessmentCompilationDocument
```

**Start here when:** final paper metadata, Course identity, cover/formula inclusion, question grouping or compiled assessment content is wrong.

---

## 21. Pagination

```text
app/Assessments/Compilation/Pagination/
```

Important file:

```text
AssessmentCompilationPagination.ts
```

Owns grouping compiled questions into pages.

---

## 22. Rendering

```text
app/Assessments/Compilation/Rendering/
```

Important files include:

```text
AssessmentCompiledDocument.tsx
AssessmentCompiledPage.tsx
AssessmentCompiledQuestion.tsx
```

Renders the canonical compilation model using document and Course-owned presentation.

---

## 23. PDF

```text
app/Assessments/Compilation/PDF/
├── Client/
├── generate/
├── AssessmentPdfBrowser.ts
├── AssessmentPdfDocument.tsx
├── AssessmentPdfDownloadButton.tsx
├── AssessmentPdfHtml.tsx
├── AssessmentPdfKatexStyles.ts
└── generateAssessmentPdf.ts
```

Server route:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

The PDF system owns final HTML/browser/PDF generation.

Client PDF asset/cache behaviour lives in:

```text
app/Assessments/Compilation/PDF/Client/
```

My Assessments consumes those assets rather than maintaining a second PDF generator.

---

# My Assessments

## 24. Root

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

`MyAssessmentsPage.tsx` is the library composition root.

It coordinates saved-assessment loading, filtering/sorting, view mode and library actions.

---

## 25. Library Responsibilities

```text
Actions/
→ library-specific action UI

Display/
→ labels, dates and progress derivation

Library/
→ filtering, sorting and view-option behaviour

TileView/
→ visual tile presentation

ListView/
→ dense management presentation

Preview/
→ PDF.js/canvas/modal preview presentation

Toolbar/
→ search/filter/sort/view controls
```

**Start here when:** library display is wrong.

**Trace downward when data/assets are wrong:**

```text
SavedAssessments
Compilation/PDF/Client
```

---

# Classes

## 26. Classes Root

```text
app/Classes/
├── Coverage/
├── MyClasses/
├── Records/
├── ClassData.ts
├── ClassDetailsPage.tsx
└── MyClassesPage.tsx
```

Classes owns school-class records, persistence, pages and class coverage.

---

## 27. Records

```text
app/Classes/Records/
```

Important files:

```text
BrowserStorage.ts
Collection.ts
Normalisation.ts
```

Own class browser storage, normalisation and the live collection.

---

## 28. Coverage

```text
app/Classes/Coverage/
```

Important files include:

```text
AssessmentClassSelector.tsx
QuestionExamples.tsx
SelectedItem.ts
SelectionDetails.tsx
SkillsAndProgress.ts
SkillsTree.tsx
```

Educational structure should resolve through:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

**Start here when:** class coverage UI/selection is wrong.

**Trace next when the wrong curriculum appears:** Course Registry/configuration.

---

## 29. My Classes

```text
app/Classes/MyClasses/
```

Owns My Classes-specific presentation such as class tiles/grid, page header, add-class UI and Course colour settings.

---

# Courses — Generic Infrastructure

## 30. Courses Root

```text
app/Courses/
├── Documents/
├── National5ApplicationsOfMaths/
├── National5Maths/
├── National5MathsLegacy/
├── Papers/
├── QuestionExamples/
├── Selection/
├── CourseAssessmentConfig.ts
├── CourseAvailability.ts
├── CourseCatalog.ts
├── CourseRegistry.ts
└── CourseTypes.ts
```

Courses owns Course identity, registration and Course-specific educational knowledge.

---

## 31. `CourseTypes.ts`

Owns canonical Course identity types.

Import Course identity from here rather than creating parallel aliases in other domains.

---

## 32. `CourseAssessmentConfig.ts`

Defines the generic Assessment-facing Course contract.

Imports generic Assessment types and Course identity.

Exports Course configuration contracts and helper functions for paper/structure/suitability lookup.

**Start here when:** generic Assessment code cannot express a Course rule cleanly.

---

## 33. `CourseRegistry.ts`

Central runtime Course registration point.

Imports concrete Course AssessmentConfig modules.

Exports:

```text
DEFAULT_COURSE_ID
COURSE_REGISTRY
findCourseAssessmentConfigById
hasCourseAssessmentConfig
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs
```

**Start here when:** a Course is unavailable, resolves incorrectly or its Assessment config does not reach a generic consumer.

---

## 34. Course Catalog / Availability / Selection

```text
CourseCatalog.ts
→ user-facing/selectable Course metadata

CourseAvailability.ts
→ Course availability logic

Selection/
→ persisted Course selection
```

These are distinct from the runtime Course configuration registry.

---

## 35. Papers and Documents

```text
app/Courses/Papers/
→ generic access to Course paper rules

app/Courses/Documents/
→ generic Course-document registration/infrastructure
```

Concrete Course document composition remains Course-owned.

---

# National 5 Mathematics

## 36. Canonical Root

```text
app/Courses/National5Maths/
├── 01_QuestionCatalog/
├── 02_AnswerCatalog/
├── 03_SkillCatalog/
├── 04_QuestionGeneration/
├── 05_AnswerGeneration/
├── 06_VisualAssets/
├── Skills/
├── ARCHITECTURE.md
├── AssessmentConfig.ts
├── CatalogCoreTypes.ts
└── CatalogVisualEvidenceTypes.ts
```

This is the canonical current content workspace.

Detailed ownership/dependency rules are defined in the local `ARCHITECTURE.md`.

---

## 37. Shared Catalogue Contracts

```text
CatalogCoreTypes.ts
→ shared catalogue IDs, evidence/provenance and review concepts

CatalogVisualEvidenceTypes.ts
→ shared historical visual semantic/evidence contracts
```

These sit upstream of generation.

**Start here when:** a historical Question/Answer record cannot express a universal evidence concept cleanly.

---

## 38. `01_QuestionCatalog`

```text
app/Courses/National5Maths/01_QuestionCatalog/
```

Owns historical question truth.

Important universal files include:

```text
QuestionCatalogTypes.ts
QuestionCatalogHistoricalView.ts
```

Historical records are organised:

```text
<year>/Paper1/
<year>/Paper2/
```

with one file per numbered question.

Neutral year/paper/question locators are allowed for evidence traceability. Repository-authored wording and assets must obey `AGENTS.md` source-isolation rules.

**Start here when:** the question-paper side of historical evidence is missing, misclassified or structurally incomplete.

---

## 39. `02_AnswerCatalog`

```text
app/Courses/National5Maths/02_AnswerCatalog/
```

Owns historical marking truth.

Important universal files include:

```text
AnswerCatalogTypes.ts
AnswerCatalogHistoricalView.ts
```

Also organised by year / paper / numbered question.

Owns mark nodes, pathways, source-backed marking behaviour and mark-level classification.

**Start here when:** historical marking behaviour, mark ownership, follow-through or accepted pathways are wrong.

---

## 40. `03_SkillCatalog`

```text
app/Courses/National5Maths/03_SkillCatalog/
```

Owns reviewed cross-corpus synthesis.

Important root files include:

```text
SkillCatalogTypes.ts
README.md
```

Skill-specific evidence/synthesis lives beneath curriculum/skill folders.

Current hardened examples include algebraic A7 and A8 skill areas with `HistoricalEvidence` and validation modules.

**Start here when:** a generator is behaving according to the wrong historical pattern, calibration, family or difficulty model.

Do not fix that by directly teaching a generator to read individual year files.

---

## 41. `04_QuestionGeneration`

```text
app/Courses/National5Maths/04_QuestionGeneration/
```

Owns executable manufacture of new questions.

Important root file:

```text
Registry.ts
```

`Registry.ts` imports generic Assessment generation/selection contracts and registered concept modules.

It exports the main Builder-facing selection/dispatch functions, including:

```text
conceptSelectionText
getConceptFromSelection
getAvailableDifficultiesForConcept
isDifficultyEligibleForConcept
getEligibleDifficultiesForConcept
buildGenerated
buildSkillLinks
```

Skill-specific generators are organised under curriculum/skill folders.

**Start here when:** a selected concept does not dispatch, difficulty eligibility is wrong, or Builder generation reaches the wrong concept module.

---

## 42. `05_AnswerGeneration`

```text
app/Courses/National5Maths/05_AnswerGeneration/
```

Owns executable marking and worked-answer manufacture for generated questions.

Skill-specific modules are organised under curriculum/skill folders.

Generated answers should use the exact generated mathematical state rather than independently reconstructing values.

**Start here when:** a generated question is correct but its worked answer/marking output is wrong.

---

## 43. `06_VisualAssets`

```text
app/Courses/National5Maths/06_VisualAssets/
```

Current root files include:

```text
README.md
VisualCatalogTypes.ts
VisualGenerationTypes.ts
```

Owns generated visual capability, renderer strategy and generated-output visual validation.

Historical visual semantics remain in `CatalogVisualEvidenceTypes.ts` rather than moving into generated-visual ownership.

**Start here when:** generated mathematical visual specifications or renderer-facing contracts are wrong.

---

## 44. Skills

```text
app/Courses/National5Maths/Skills/
```

Important files include:

```text
National5MathsSkills.ts
BuilderSkillRegistration.ts
BuilderSkillRegistry.ts
A7BuilderSkillBridge.ts
A8BuilderSkillBridge.ts
```

`National5MathsSkills.ts` owns the canonical Course skill tree.

`BuilderSkillRegistry.ts` is the single composition point that applies migrated generator capability to Skills records.

It exports:

```text
applyBuilderSkillRegistrations
NATIONAL5_MATHS_BUILDER_SKILL_REGISTRATION_IDS
```

**Start here when:** a skill exists in the Course tree but its migrated generator capability is missing from Builder.

---

## 45. `AssessmentConfig.ts`

```text
app/Courses/National5Maths/AssessmentConfig.ts
```

Course-facing composition root.

Imports:

```text
Skills/National5MathsSkills
Skills/BuilderSkillRegistry
CourseAssessmentConfig type
```

Exports the concrete Course Assessment configuration consumed by `CourseRegistry.ts`.

**Start here when:** National 5 Mathematics paper setup, metrics, Course labels, skill-tree exposure or Course-level Builder wiring is wrong.

---

## 46. Current Compatibility Tree

```text
app/Courses/National5MathsLegacy/
```

This remains a compatibility owner for generator/concept implementations that have not yet been migrated into the canonical six-layer workspace.

A targeted `tsconfig.json` alias still resolves the historical National 5 Mathematics alias to this compatibility tree.

Therefore, when module resolution looks surprising, inspect `tsconfig.json` before assuming an alias points to the canonical folder.

Do not add new generator architecture to the compatibility tree merely because an existing runtime import still reaches it.

---

# Other Courses

## 47. National 5 Applications of Mathematics

```text
app/Courses/National5ApplicationsOfMaths/
```

Contains Course-specific implementation for that Course.

It should grow only when real responsibility exists; do not mirror the National 5 Mathematics tree for symmetry alone.

---

# UI

## 48. UI Root

```text
app/UI/
├── Application/
└── Documents/
```

These are distinct presentation systems.

---

## 49. Application UI

```text
app/UI/Application/
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

Important global files/areas:

```text
Styles/ApplicationGlobals.css
HeaderBar/
Shell/ApplicationActivityRail.tsx
Shell/ApplicationShellTokens.ts
Settings/
Theme/
Typography/
```

Owns interactive application presentation.

**Start here when:** a visual issue affects multiple product areas rather than one feature.

---

## 50. Generated Documents

```text
app/UI/Documents/
├── Components/
├── Layout/
└── Templates/
```

```text
Components
→ generic printable/document primitives

Layout
→ generic document measurement/layout behaviour

Templates
→ qualification-family presentation templates
```

Generated documents must not depend on interactive Application UI merely because they are previewed inside the application.

---

# Home

## 51. Home

```text
app/Home/
```

Owns the Home-page product experience and Home-specific data/composition/presentation.

Reusable application-wide UI remains under `UI/Application`.

---

# Developer Tools

## 52. DeveloperTools

```text
app/DeveloperTools/
```

Current major area:

```text
GeneratorTester/
```

Contains runtime developer interfaces used to exercise question generators and previews.

DeveloperTools may consume production Course/generator APIs but must not become their educational owner.

When a tester works but Builder does not, compare the tester's imports with the canonical runtime registry/composition path.

---

# Documentation and Repository Tooling

## 53. Documentation

Current documentation root:

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

Repository-level mandatory agent rules:

```text
AGENTS.md
```

During the current documentation reset, individual documents are being audited and replaced one at a time. Current-state documents should contain current truth only.

---

## 54. Architecture Guard

```text
scripts/check-national5maths-architecture.mjs
```

Checks the canonical National 5 Mathematics six-layer architecture and forbidden deprecated paths/dependency directions.

Run through:

```bash
npm run check:n5-architecture
```

Use it when National 5 Mathematics architecture or imports may have changed, and periodically during significant content/generator work.

---

# Troubleshooting Navigation

## 55. Fast “Where Do I Start?” Table

| Symptom | Start here | Trace next |
| --- | --- | --- |
| Wrong page/route | `app/page.tsx` | `next.config.ts`, selected page |
| Global shell/layout issue | `app/layout.tsx` | `UI/Application/Shell`, HeaderBar, Settings |
| Course not found/registered | `Courses/CourseRegistry.ts` | concrete `AssessmentConfig.ts` |
| Generic Course rule missing | `Courses/CourseAssessmentConfig.ts` | relevant Assessment consumer |
| N5 skill exists but capability missing | `National5Maths/Skills/BuilderSkillRegistry.ts` | skill bridge/registration |
| N5 concept does not generate | `National5Maths/04_QuestionGeneration/Registry.ts` | concept module, SkillCatalog evidence |
| Generated answer wrong | `National5Maths/05_AnswerGeneration/` | generated question state, SkillCatalog |
| Historical question evidence wrong | `National5Maths/01_QuestionCatalog/` | matching Answer Catalog entry |
| Historical marking evidence wrong | `National5Maths/02_AnswerCatalog/` | matching Question Catalog entry |
| Generator calibration/pattern wrong | `National5Maths/03_SkillCatalog/` | historical evidence validation |
| Creator draft workflow wrong | `Assessments/Creation/Questions/` | generic generation contracts, Course registry |
| Skills Tree UI wrong | `Assessments/Creation/SkillsPanel/` | Course config + Skills registry |
| Compiled paper content wrong | `Compilation/Model/buildAssessmentCompilationDocument.ts` | Course config, pagination |
| PDF generation wrong | `Assessments/Compilation/PDF/` | canonical compilation model, Rendering |
| Saved assessment lost/malformed | `Assessments/SavedAssessments/` | Creation Persistence |
| My Assessments display wrong | `MyAssessments/` | SavedAssessments/PDF asset owner |
| Class coverage wrong | `Classes/Coverage/` | CourseRegistry/config/skillTree |
| Generated-document styling wrong | `UI/Documents/` | Course Documents / Compilation Rendering |
| Application-wide visual styling wrong | `UI/Application/` | feature-specific consumer |

---

## 56. Import / Export Dependency Index

This Repository Map records important boundary modules and navigation paths, but it does **not** attempt to hand-maintain every TypeScript/TSX import and export.

The intended next tooling improvement is a mechanically generated dependency document, conceptually:

```text
Docs/DependencyMap.md
```

For every source module it should be able to record:

```text
file path
architectural owner
imports
imported symbols where practical
exports
direct consumers
registry/composition role where relevant
```

This should be generated from source and regenerable after structural work.

A generated graph is preferable to a manually maintained exhaustive table because stale dependency documentation is worse than no dependency documentation.

---

## 57. Maintaining This Map

Update this file when:

- a current owner changes;
- an important folder or entry point is added/removed;
- a registry/composition root changes;
- a compatibility seam materially changes troubleshooting/navigation;
- a major feature is promoted into a new durable owner.

Do not add historical “used to be here” narratives to this current-state map.

When something becomes historical, Git history is the record.

The standard is simple:

> A developer with no knowledge of the repository's history should be able to use this file to find the right owner and begin tracing the relevant runtime wiring quickly.
