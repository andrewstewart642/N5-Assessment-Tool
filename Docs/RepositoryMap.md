# VecEd Repository Map

## 1. Purpose

This document is the authoritative map of the current VecEd repository.

It describes:

- where runtime source code belongs,
- which product area owns each responsibility,
- how Next.js routing is separated from product architecture,
- where shared application UI belongs,
- where generated-document UI belongs,
- where course-specific educational knowledge belongs,
- and where repository tooling and historical migration material belong.

This document describes the repository **as it exists now**.

Historical paths and migration steps belong in:

```text
Docs/RefactorLedger.md

They should not be preserved here as current architecture.

2. Repository Root

The high-level repository structure is:

N5-Assessment-Tool/
├── app/
├── Docs/
├── AGENTS.md
└── framework / package / TypeScript configuration files

Runtime application source belongs beneath:

app/

There is no separate:

src/

source tree.

3. Runtime Source Root

The current runtime architecture is:

app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── layout.tsx
└── page.tsx

The five primary product ownership areas are:

Assessments/
Classes/
Courses/
DeveloperTools/
UI/

These folders describe product responsibility.

They are not route folders.

Global application CSS lives beneath:

app/UI/Application/Styles/ApplicationGlobals.css

4. Next.js Routing
4.1 Routing philosophy

VecEd does not maintain a duplicate filesystem tree for application URLs.

The old pattern:

app/
├── compile-assessment/
├── create-assessment/
├── my-assessments/
├── my-classes/
└── dev/

must not be recreated.

Instead, public application URLs are mapped through:

next.config.ts

using internal rewrites.

Those rewrites dispatch into the single application page:

app/page.tsx

The global Next.js layout remains:

app/layout.tsx

4.2 Current application routes

The catch-all router currently resolves the following URLs:

/

→ application home

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

4.3 Routing rule

next.config.ts owns the public URL rewrite map.

app/page.tsx is the thin application routing adapter.

Together they may:

preserve public URLs,
supply internal route identifiers and parameters,
select the appropriate product-owned page,
invoke notFound() for unsupported routes.

Neither file should become a home for feature implementation.

Feature implementation belongs in its owning product folder.

5. Assessments

Assessment-owned functionality lives beneath:

app/Assessments/

Current structure:

app/Assessments/
├── AssessmentTypes.ts
├── Compilation/
├── Creation/
├── MyAssessments/
├── Questions/
└── SavedAssessments/

Assessment code owns generic assessment workflow and state.

It should not own course-specific educational knowledge.

6. Assessment Compilation

Compilation lives beneath:

app/Assessments/Compilation/

Current key files include:

AssessmentCompilationPage.tsx
CompilationPageSizes.ts
CompilationPagination.ts

Compilation owns the process of turning assessment data into compiled assessment documents.

It is separate from Assessment Creation.

Course-specific document presentation should be obtained from the relevant Course rather than encoded directly into generic Compilation logic.

7. Assessment Creation

Assessment Creation lives beneath:

app/Assessments/Creation/

Its main entry points are:

AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
AssessmentCreatorStyles.tsx

The current feature structure is:

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
├── AssessmentCreatorStyles.tsx
└── AssessmentSetupPage.tsx

These folders represent visible or behavioural areas of Assessment Creation.

8. Assessment Creation — Setup

Setup lives beneath:

app/Assessments/Creation/Setup/

It owns the configuration collected before entering the main Assessment Creator.

Responsibilities include:

course selection,
assessment mode,
paper structure,
marks/time targets,
assessment metadata,
class coverage selection,
cover sheet selection,
formula sheet selection,
setup submission.

Reusable setup controls belong beneath:

app/Assessments/Creation/Setup/Controls/

Visible setup sections belong beneath:

app/Assessments/Creation/Setup/Sections/
9. Assessment Creation — Top Bar

The Assessment Creation upper control region lives beneath:

app/Assessments/Creation/TopBar/

It owns the Assessment Creator's upper-row controls, including concerns such as:

assessment name,
assessment date,
paper viewing controls,
preview zoom controls,
assessment metadata fields.

The term TopBar refers specifically to this Assessment Creation region.

It is distinct from the global application:

HeaderBar
10. Assessment Creation — HUD Bar

The lower Assessment Creation status/control region lives beneath:

app/Assessments/Creation/HUDBar/

It owns Assessment Creation progress and lower workspace status UI.

The term HUDBar refers specifically to this lower Assessment Creation region.

11. Assessment Creation — Skills Panel

The Skills Panel lives beneath:

app/Assessments/Creation/SkillsPanel/

Current responsibilities include:

skill filtering,
skill-tree presentation,
concept selection,
difficulty controls,
class coverage integration,
assessment skill selection state.

Course-specific skill knowledge does not belong here.

The Skills Panel consumes skill definitions supplied through the Course architecture.

12. Assessment Creation — Papers

Paper workflow state lives beneath:

app/Assessments/Creation/Papers/

Responsibilities include:

paper selection,
target marks,
paper timing,
sitting state,
paper-value maps,
paper-specific creation rules.

Generic assessment-paper workflow belongs here.

Course-specific paper rules belong beneath:

app/Courses/Papers/
13. Assessment Creation — Paper Workspace

The central Assessment Creator workspace lives beneath:

app/Assessments/Creation/PaperWorkspace/

Responsibilities include:

workspace layout,
split-panel behaviour,
preview view mode,
workspace divider behaviour,
preview viewport behaviour,
document locking,
paper preview composition.

Preview-specific implementation belongs beneath:

app/Assessments/Creation/PaperWorkspace/Preview/

The Paper Workspace owns the interactive application workspace.

It does not own generic generated-document primitives.

14. Assessment Creation — Questions

Assessment Creation question workflow lives beneath:

app/Assessments/Creation/Questions/

Responsibilities include:

assessment question state,
generated question drafts,
edit drafts,
question controls,
question workflow,
draft generation,
question spacing within the Creation workflow.

Creation-specific question previews live beneath:

app/Assessments/Creation/Questions/Preview/

Shared locked-question preview behaviour belongs beneath:

app/Assessments/Questions/Preview/
15. Assessment Creation — Analysis

Assessment quality analysis lives beneath:

app/Assessments/Creation/Analysis/

Current analysis concerns include:

topic balance,
standard balance,
calculator suitability,
operational/reasoning balance,
distribution analysis,
quality notes.

The analysis layer should consume Course configuration rather than hard-code National 5 Maths knowledge.

16. Assessment Creation — Persistence

Assessment Creation persistence lives beneath:

app/Assessments/Creation/Persistence/

Responsibilities include:

assessment creation persistence,
creator initialisation,
creator autosave,
saved-assessment loading,
creation-specific storage keys,
course-selection persistence integration.

Historical persisted key names may remain when required for backwards compatibility.

A legacy-sounding persisted key is not, by itself, justification for renaming it.

Persisted-data migrations must be deliberate.

17. My Assessments

My Assessments UI lives beneath:

app/Assessments/MyAssessments/

Current structure includes:

app/Assessments/MyAssessments/
├── Components/
├── MyAssessmentsDisplay.ts
└── MyAssessmentsPage.tsx

Visible My Assessments components include:

Components/
├── AssessmentPreviewCard.tsx
└── DeleteAssessmentModal.tsx

My Assessments owns the user-facing saved-assessment library experience.

18. Saved Assessments

Persistent saved-assessment models and storage live beneath:

app/Assessments/SavedAssessments/

Current key files include:

SavedAssessment.ts
SavedAssessmentsStorage.ts

This is distinct from the My Assessments UI.

SavedAssessments/ owns persisted assessment data.

MyAssessments/ owns presentation and interaction with that data.

19. Shared Assessment Question Architecture

Generic assessment-question functionality lives beneath:

app/Assessments/Questions/

Current structure includes:

app/Assessments/Questions/
├── Content/
├── Generation/
├── Preview/
└── Selection/
19.1 Question Content

Generic question-content contracts belong beneath:

app/Assessments/Questions/Content/

Current example:

PaperParts.ts
19.2 Question Generation Contracts

Generic generation contracts belong beneath:

app/Assessments/Questions/Generation/

Current files include:

AnswerGenerationTypes.ts
QuestionGenerationTypes.ts

Course-specific generation implementations do not belong here.

19.3 Shared Question Preview

Shared question preview code belongs beneath:

app/Assessments/Questions/Preview/

Current key files include:

QuestionLockedPreview.tsx
QuestionPreviewLayout.ts
19.4 Question Selection

Generic question-selection contracts belong beneath:

app/Assessments/Questions/Selection/

Current key file:

QuestionSelectionTypes.ts
20. Classes

Class-owned functionality lives beneath:

app/Classes/

Current structure:

app/Classes/
├── Components/
├── Coverage/
├── State/
├── ClassDetailsPage.tsx
├── ClassTypes.ts
└── MyClassesPage.tsx

Classes owns:

saved school classes,
class metadata,
completed-skill coverage,
My Classes presentation,
Class Details presentation,
class persistence.

Classes must resolve course-specific skill knowledge through the Course architecture.

Classes should not import National 5 Maths skill data directly when generic Course configuration can provide it.

21. Class Components

Reusable class UI lives beneath:

app/Classes/Components/

Current components include:

AddClassModal.tsx
ClassesHeader.tsx
ClassGrid.tsx
ClassTile.tsx
22. Class Coverage

Class coverage functionality lives beneath:

app/Classes/Coverage/

Current files include:

ClassCoverageDetails.tsx
ClassCoverageHelpers.ts
ClassCoverageSelect.tsx
ClassCoverageTree.tsx

Coverage resolves:

SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree

This keeps Classes independent of any single qualification.

23. Class State

Class persistence and state live beneath:

app/Classes/State/

Current files include:

ClassNormalisation.ts
ClassStorage.ts
useClasses.ts
24. Courses

Educational/domain knowledge belongs beneath:

app/Courses/

Current generic Course structure includes:

app/Courses/
├── National5ApplicationsOfMaths/
├── National5Maths/
├── Papers/
├── Selection/
├── CourseAssessmentConfig.ts
├── CourseCatalog.ts
├── CourseRegistry.ts
└── CourseTypes.ts

Courses owns:

course identity,
course registration,
assessment configuration,
course-specific skills,
course-specific document configuration,
course-specific question generation,
exam-question evidence/catalogues.
25. Course Identity

Course identity is owned by:

app/Courses/CourseTypes.ts

CourseId must be imported from its Courses owner.

It must not be re-exported from Assessment-owned type files merely for convenience.

26. Course Registry

Registered Course assessment configurations are owned by:

app/Courses/CourseRegistry.ts

The registry exposes the canonical Course Assessment Config API.

Compatibility aliases for historical shorter CourseConfig terminology must not be reintroduced.

27. Course Catalog

User-facing Course catalogue metadata belongs in:

app/Courses/CourseCatalog.ts

The catalogue represents selectable/available Courses.

The registry represents Course assessment configuration.

These responsibilities should remain distinct.

28. Course Assessment Configuration

The generic Course assessment contract lives in:

app/Courses/CourseAssessmentConfig.ts

It defines the information generic Assessment workflows need from a Course.

Assessment workflows should consume this contract rather than directly importing qualification-specific implementations.

29. Course Selection

Shared Course-selection persistence belongs beneath:

app/Courses/Selection/

Current key file:

CourseSelectionStorage.ts

Historical persisted key strings may remain for backwards compatibility.

Ownership is determined by responsibility, not by the wording of old persisted keys.

30. Course Paper Rules

Generic access to Course paper rules belongs beneath:

app/Courses/Papers/

Current key file:

CoursePaperRules.ts
31. National 5 Mathematics

National 5 Mathematics knowledge lives beneath:

app/Courses/National5Maths/

Current high-level structure:

app/Courses/National5Maths/
├── AssessmentConfig.ts
├── Documents/
├── ExamQuestionAndAnswerCatalog/
├── QuestionAndAnswerGeneration/
└── Skills/

Anything specific to National 5 Mathematics should normally be owned here rather than by generic Assessment code.

32. National 5 Mathematics Skills

The National 5 Mathematics skills definition lives beneath:

app/Courses/National5Maths/Skills/

Current key file:

National5MathsSkills.ts

The Course configuration exposes this educational structure to generic consumers.

33. Exam Question and Answer Catalogue

Historical exam-question evidence lives beneath:

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/

Current structure:

ExamQuestionAndAnswerCatalog/
├── Questions/
└── MarkingSchemes/

Questions and marking schemes are organised by exam year and paper where appropriate.

The catalogue represents real exam evidence.

It is separate from VecEd's generated question-writing system.

34. National 5 Mathematics Question and Answer Generation

Course-specific generated-question implementation lives beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/

Current structure includes:

QuestionAndAnswerGeneration/
├── AnswerMethods/
├── AnswerWriting/
└── QuestionWriting/
34.1 Question Writing

Question-writing implementation belongs beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/QuestionWriting/

Current responsibilities include:

concept selection,
question-writer registration,
concept modules,
concept-specific question writers.

Current high-level structure includes:

QuestionWriting/
├── ConceptModules/
├── Numerical/
├── ConceptSelection.ts
└── QuestionWriterRegistry.ts
34.2 Answer Writing

Answer-writing implementation belongs beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerWriting/

This contains course/concept-specific answer writers.

34.3 Answer Methods

Answer-method identifiers and course-specific answer-method knowledge belong beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/AnswerMethods/
35. National 5 Mathematics Documents

Course-specific generated-document composition lives beneath:

app/Courses/National5Maths/Documents/

Current structure includes:

Documents/
├── CoverPage/
├── FormulaSheet/
├── QuestionPage/
├── CourseDocuments.ts
└── National5MathsQuestionSpacing.ts

Course-specific document files compose generic document primitives and National Qualifications templates.

They should not own generic A4/document infrastructure.

36. National 5 Applications of Mathematics

National 5 Applications of Mathematics knowledge lives beneath:

app/Courses/National5ApplicationsOfMaths/

Its current assessment configuration lives in:

AssessmentConfig.ts

The folder may grow as genuine course-specific implementation is added.

Placeholder folders should not be created simply to mirror another Course.

37. UI

Reusable presentation infrastructure lives beneath:

app/UI/

The major separation is:

UI/
├── Application/
└── Documents/

These represent two different visual systems.

38. Application UI

Interactive application UI lives beneath:

app/UI/Application/

Current structure includes:

Application/
├── Colours/
├── Components/
├── HeaderBar/
├── Home/
├── Motion/
├── Settings/
├── SettingsDrawer/
├── Theme/
└── Typography/

Application UI includes:

navigation,
interactive controls,
application theming,
settings,
drawers,
application typography,
home-page presentation.

It is distinct from generated assessment documents.

39. Application Colours

Application colour definitions belong beneath:

app/UI/Application/Colours/

Current key file:

AccentPalette.ts
40. Application Theme

Application theme infrastructure belongs beneath:

app/UI/Application/Theme/

Current files include:

AppTheme.ts
ThemeMode.ts
ThemePreferenceStorage.ts
ThemeProvider.tsx

Application visual compatibility aliases may remain while they are genuinely consumed.

They should be removed only after consumer migration proves them unnecessary.

41. Application Typography

Application typography tokens live beneath:

app/UI/Application/Typography/

Current key file:

Typography.ts

UI_TYPO and application text styles are shared across interactive application UI.

42. Global Header Bar

The global application header lives beneath:

app/UI/Application/HeaderBar/

Current structure includes:

HeaderBar.tsx
Logo.tsx
Navigation.tsx
SettingsButton.tsx

The global HeaderBar is distinct from Assessment Creation's TopBar.

43. Application Settings

Application settings composition lives beneath:

app/UI/Application/Settings/

Current key file:

ApplicationSettings.tsx
44. Settings Drawer

Global settings-drawer infrastructure lives beneath:

app/UI/Application/SettingsDrawer/

It owns global application appearance/settings UI.

Assessment-specific settings remain owned by:

app/Assessments/Creation/AssessmentSettings/

The two concerns must not be merged merely because both are presented using drawers.

45. Generic Application Components

Reusable interactive application components live beneath:

app/UI/Application/Components/

Current examples include:

ActionButton.tsx
CalendarPicker.tsx
Drawer/

Generic drawer primitives live beneath:

app/UI/Application/Components/Drawer/
46. Documents UI

Generated-document infrastructure lives beneath:

app/UI/Documents/

Current structure:

app/UI/Documents/
├── Components/
├── Layout/
└── Templates/

This layer owns generated-document presentation rather than interactive application chrome.

47. Document Components

Generic generated-document primitives live beneath:

app/UI/Documents/Components/

Current key files include:

A4PageFrame.tsx
DocumentPageFrame.tsx
PaperContent.tsx

These components should remain qualification-agnostic where possible.

48. Document Layout

Generated-document measurement/layout utilities live beneath:

app/UI/Documents/Layout/

Current key file:

DocumentUnits.ts
49. National Qualifications Document Templates

Qualification-family templates live beneath:

app/UI/Documents/Templates/NationalQualifications/

Current key files include:

NationalQualificationsCoverPage.tsx
NationalQualificationsPageFrame.tsx
NationalQualificationsQuestionPageFrame.tsx

The document layering model is:

generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific Documents
        ↓
Assessment consumers

This direction should be preserved.

50. Developer Tools

Runtime developer-only functionality lives beneath:

app/DeveloperTools/

Current structure:

app/DeveloperTools/
└── GeneratorTester/
    ├── GeneratorTestTarget.ts
    └── GeneratorTesterPage.tsx

DeveloperTools/ is application source.

51. Repository Tooling

There is currently no permanent repository-level Tools/ directory.

The historical one-off migration tooling used during Architecture V2 was removed once its work had been completed and verified.

Migration history is preserved in:

Docs/RefactorLedger.md

and Git history.

Runtime source must not depend on historical migration tooling.

52. Documentation

Architecture documentation lives beneath:

Docs/

Current architecture documents include:

Docs/
├── Architecture.md
├── ChatGPTWorkflow.md
├── LockedDecisions.md
├── RefactorLedger.md
└── RepositoryMap.md

Repository-level coding instructions also live in:

AGENTS.md
53. Documentation Responsibilities
RepositoryMap.md

Answers:

Where does something live?

It describes the current repository only.

Architecture.md

Answers:

Why is the system divided this way, and how should the major layers depend on each other?

LockedDecisions.md

Records architectural decisions that should not be casually revisited.

RefactorLedger.md

Records migration history.

Historical paths are valid here when they accurately describe what happened at that point in time.

ChatGPTWorkflow.md

Defines the safe workflow for AI-assisted work on the repository.

AGENTS.md

Provides repository-level working rules and navigation guidance for future coding agents.

54. Ownership Rules

Ownership is determined by responsibility, not by whichever file currently imports something.

Core ownership rules:

Assessments
→ generic assessment workflow

Classes
→ class data and class workflows

Courses
→ educational/domain/course knowledge

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation

DeveloperTools
→ runtime development utilities

55. Dependency Direction

Preferred high-level dependency direction:

UI primitives
        ↑
product presentation

Courses
        ↑
Assessments / Classes consume course contracts

generic document primitives
        ↓
qualification-family templates
        ↓
Course Documents
        ↓
Assessment document consumers

Avoid circular ownership.

A consumer may depend on an owner.

An owner should not be moved merely because another feature consumes it.

56. Course Knowledge Rule

Course-specific educational knowledge belongs beneath:

app/Courses/<Course>/

Examples include:

skills,
paper configuration,
qualification-specific documents,
exam-question catalogues,
marking schemes,
question writers,
answer writers.

Generic Assessment code should consume Course contracts instead of hard-coding National 5 Maths knowledge.

57. No Generic Dumping Grounds

Do not introduce broad buckets such as:

Helpers/
Utils/
Shared/
Common/
Misc/
shared-types/
math-helpers/

unless a specific, durable architectural responsibility genuinely justifies them.

Prefer ownership-specific names.

58. No Shadow Route Architecture

Do not recreate route-signpost folders such as:

app/create-assessment/
app/compile-assessment/
app/my-assessments/
app/my-classes/
app/dev/generator-tester/

The URLs may continue to exist.

Their implementation belongs in the product architecture.

Routing is handled by:

next.config.ts
        ↓
app/page.tsx

Public URLs are preserved through internal rewrites rather than physical feature-route folders.

59. Next.js Special Filename Rule

Because the complete runtime source now lives beneath Next.js's:

app/

special Next.js filenames must be introduced deliberately.

Files such as:

page.tsx
layout.tsx
route.ts
loading.tsx
error.tsx
not-found.tsx
template.tsx
default.tsx

have framework meaning inside the App Router.

Do not create one inside a product architecture folder unless the intention is genuinely to define Next.js routing/framework behaviour.

Ordinary product page implementations should use descriptive names such as:

AssessmentCreatorPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx
60. Client Boundary Rule

"use client" should mark genuine client entry boundaries.

Internal hooks and child components do not need their own directive merely because they use:

React hooks,
window,
document,
local storage,
event handlers.

They may inherit the client environment from a genuine client boundary.

Do not add "use client" defensively.

61. Persistence Rule

Persisted browser data is an external compatibility contract.

Old storage keys or legacy field names may remain when required to preserve existing user data.

Do not rename persisted keys merely to make source terminology cleaner.

A persisted-data migration should be treated as a separate deliberate change.

62. Naming Rule

Prefer product terminology over historical implementation terminology.

Current recognised terms include:

HeaderBar
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Drawer
Popover
Compilation
Creation
MyAssessments
SavedAssessments

Old Builder terminology should not be reintroduced into source architecture merely because historical persisted keys or public URLs still contain it.

63. Adding a New Feature

Before adding a new file, determine its owner.

Ask:

Is this generic Assessment workflow?
Is this Class data/workflow?
Is this Course-specific educational knowledge?
Is this interactive Application UI?
Is this generated-document UI?
Is this runtime developer tooling?
Is this repository tooling rather than application source?

Place the file according to the answer.

Do not create a new top-level folder simply because no existing filename immediately seems suitable.

64. Adding a New Course

A new Course should be introduced beneath:

app/Courses/<Course>/

Only create folders that correspond to real implementation.

Do not pre-create empty mirrored structures.

Where appropriate, expose the Course through the generic:

CourseAssessmentConfig
CourseCatalog
CourseRegistry

architecture.

Generic Assessment and Classes workflows should then consume the Course through those contracts.

65. Architecture Acceptance Standard

A future developer or coding agent with no knowledge of the repository's history should be able to open the repository and infer:

app/Assessments/

→ assessment workflow

app/Classes/

→ classes

app/Courses/

→ educational/course knowledge

app/UI/

→ presentation systems

app/DeveloperTools/

→ runtime developer functionality

without needing to understand the Architecture V2 migration that produced this structure.

That clarity is the acceptance standard for future structural work.