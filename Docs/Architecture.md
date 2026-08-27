# N5 Assessment Tool Architecture

## 1. Purpose

This document defines the current architecture of the N5 Assessment Tool.

It explains:

- the major application domains;
- ownership boundaries;
- dependency direction;
- routing architecture;
- Course abstraction;
- Assessment architecture;
- Classes architecture;
- My Assessments architecture;
- question-generation architecture;
- generated-document and PDF architecture;
- application UI architecture;
- persistence rules;
- client-boundary rules;
- and the standards future structural work must preserve.

For the physical location of individual files and folders, see:

```text
Docs/RepositoryMap.md
```

For architectural decisions that should not be casually revisited, see:

```text
Docs/LockedDecisions.md
```

For the history of Architecture V2 and earlier migrations, see:

```text
Docs/RefactorLedger.md
```

For meaningful product/technical changes after the broad Architecture V2 migration, see:

```text
Docs/FeatureHistory.md
```

For future ideas and deferred work, see:

```text
Docs/FutureFeatures.md
```

This document describes current architecture, not migration history.

---

## 2. Current Architectural Phase

Architecture V2 is substantially complete.

The repository should now be treated as having an established architecture rather than being in a continuing whole-repository migration.

The normal development pattern is now:

```text
established architecture
        ↓
feature development
        ↓
feature refinement
        ↓
small targeted structural improvement where needed
```

Architecture V2 remains relevant as historical context because it explains why ownership boundaries exist, but current files should describe the repository in present tense.

Do not treat old “still to migrate” notes as active requirements unless the current repository still demonstrates the problem.

---

## 3. Architectural Goal

The repository should be understandable without knowing how it was originally built.

A developer or coding agent should be able to inspect the root source tree and determine:

```text
app/Assessments/
→ generic assessment workflow, persistence and compilation

app/Classes/
→ school-class data and class workflows

app/Courses/
→ educational and Course-specific knowledge

app/MyAssessments/
→ user-facing saved-assessment library

app/UI/Application/
→ interactive application presentation

app/UI/Documents/
→ generated-document presentation

app/DeveloperTools/
→ runtime developer utilities
```

The architecture should express responsibility directly rather than requiring historical knowledge.

---

## 4. Acceptance Criterion Zero: Preserve Behaviour

Architecture work must not remove functioning product behaviour merely to produce a cleaner folder structure.

The first acceptance criterion for structural work remains:

> Existing working product behaviour remains working unless a behavioural change is explicitly intended.

Architecture work may:

- move files;
- rename files;
- split or combine implementation where ownership becomes clearer;
- simplify APIs;
- remove proven dead code;
- eliminate compatibility aliases once consumers are migrated;
- improve dependency direction.

Architecture work must not casually:

- delete functioning features;
- invalidate saved user data;
- break public URLs;
- alter generated assessment output;
- remove active compatibility behaviour;
- silently change workflow semantics.

Clean architecture is not more important than preserving the product.

---

## 5. Runtime Source Model

All runtime application source lives beneath:

```text
app/
```

The top-level runtime source structure is now:

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

There is no separate runtime `src/` tree.

Global application CSS is owned by:

```text
app/UI/Application/Styles/ApplicationGlobals.css
```

The root `app/` folder serves two roles:

1. the Next.js App Router source root;
2. the container for product architecture.

Those roles are separated through naming and ownership rules.

---

## 6. Product Architecture vs Routing Architecture

Product architecture must not mirror URL structure.

For example:

```text
/create-assessment/builder
```

is a public URL, while its implementation belongs to:

```text
app/Assessments/Creation/AssessmentCreatorPage.tsx
```

Likewise:

```text
/my-assessments
```

maps to a first-class My Assessments-owned implementation beneath:

```text
app/MyAssessments/
```

and:

```text
/my-classes
```

maps to a Classes-owned implementation.

URLs describe navigation.

Product folders describe ownership.

These are separate concerns.

---

## 7. Routing Architecture

The application deliberately keeps the Next.js routing surface small.

Public application URLs are mapped through internal rewrites in:

```text
next.config.ts
```

Those rewrites preserve the public browser URL while dispatching into:

```text
app/page.tsx
```

`app/page.tsx` is the thin application routing adapter.

Its responsibility is to:

- read internal route information supplied by the rewrite layer;
- resolve route parameters where required;
- select the appropriate product-owned page;
- call `notFound()` when no valid route exists.

It must not accumulate feature implementation.

Global App Router composition remains in:

```text
app/layout.tsx
```

A real route-handler boundary may still exist where server behaviour requires one. The PDF generator is an intentional example:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

---

## 8. Current Public Route Contract

The route contract includes:

```text
/
→ Home

/create-assessment
→ Assessment Setup

/create-assessment/builder
→ Assessment Creator

/compile-assessment
→ Assessment Compilation

/my-assessments
→ My Assessments

/my-classes
→ My Classes

/my-classes/:classId
→ Class Details

/dev/generator-tester
→ Generator Tester
```

Structural work should preserve these URLs unless changing a public route is an explicit product decision.

Historical internal rewrite parameter names may remain for compatibility and must not be interpreted as current product branding.

---

## 9. Next.js Special Filename Rule

Because product code lives inside Next.js's `app/` tree, framework-significant filenames must be used deliberately.

Examples include:

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

Ordinary product implementations should use descriptive names such as:

```text
AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyAssessmentsPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx
```

A product folder must not gain a `page.tsx` merely because the component visually represents a page.

---

## 10. Primary Ownership Domains

The primary runtime ownership domains are:

```text
Assessments
Classes
Courses
DeveloperTools
MyAssessments
UI
```

Ownership is based on responsibility.

It is not based on:

- which feature first created a file;
- which feature currently imports it most often;
- where a historical version lived;
- which folder gives the shortest import path.

The owner is the domain whose responsibility the concept represents.

---

## 11. Dependency Principle

A consumer may depend on an owner.

An owner should not move merely because another feature consumes it.

Examples:

```text
Classes
   ↓
CourseRegistry
   ↓
CourseAssessmentConfig
```

Classes consumes Course knowledge. That does not make Course configuration part of Classes.

Likewise:

```text
MyAssessments
      ↓
SavedAssessments
```

means the library consumes saved-assessment data. It does not make persistence part of My Assessments.

And:

```text
MyAssessments
      ↓
Assessment Compilation PDF assets
```

means the library consumes generated PDFs. It does not own PDF generation.

---

## 12. Avoid Circular Ownership

Dependencies should form understandable directions.

Preferred conceptual flows include:

```text
Course knowledge
      ↓
generic Assessment / Classes consumers
```

and:

```text
generic document primitives
      ↓
qualification-family templates
      ↓
Course-specific documents
      ↓
Assessment compilation / consumers
```

and:

```text
Saved assessment data
      ↓
My Assessments library presentation
```

Application features should not create circular ownership merely to avoid explicit wiring.

---

## 13. No Generic Dumping Grounds

Avoid broad folders such as:

```text
Helpers/
Utils/
Shared/
Common/
Misc/
shared-types/
math-helpers/
```

unless a durable responsibility genuinely requires one.

A function should normally live beside the domain that owns the concept it implements.

Specific ownership is more valuable than globally short import paths.

---

# Assessments

## 14. Assessments Domain

Generic assessment workflow belongs beneath:

```text
app/Assessments/
```

The major domain areas now include:

```text
Compilation/
Creation/
Questions/
SavedAssessments/
AssessmentTypes.ts
```

Assessments owns the lifecycle and contracts for creating, saving, generating, previewing and compiling assessments.

The user-facing saved-assessment library was deliberately promoted out of this domain into `app/MyAssessments/` because it has become a substantial product area in its own right.

Assessments should remain Course-aware but not Course-specific.

---

## 15. Assessment Types

Generic assessment concepts belong in:

```text
app/Assessments/AssessmentTypes.ts
```

Examples include genuinely Assessment-owned concepts such as papers, assessment questions, question standards, thinking-type filters and generic assessment contracts.

Course identity itself is not Assessment-owned.

`CourseId` belongs to the Courses domain.

Do not create convenience re-exports that obscure ownership.

---

## 16. Assessment Creation

Assessment Creation lives beneath:

```text
app/Assessments/Creation/
```

It represents the interactive workflow for configuring and building an assessment.

Main page entry points include:

```text
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
```

Assessment Creation is divided by visible and behavioural responsibility.

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

---

## 17. Assessment Setup

Assessment Setup owns configuration gathered before the main Creator workspace.

Responsibilities include concepts such as:

- Course selection;
- assessment type;
- paper structure;
- build priority;
- mark targets;
- time targets;
- assessment name;
- assessment date;
- class selection;
- coverage selection;
- cover-page options;
- formula-sheet options.

Setup should work through Course configuration rather than hard-coding National 5 Maths.

---

## 18. Assessment Creator

`AssessmentCreatorPage.tsx` is the composition root for the main creation workspace.

It may coordinate:

- feature state;
- persistence hooks;
- question state;
- paper state;
- preview state;
- analysis;
- workspace composition;
- settings state.

It should not become the permanent owner of every implementation detail.

When a coherent responsibility can be expressed in a dedicated hook, component or module, that implementation should live in its relevant Creation subfolder.

The goal is not the smallest possible page file. The goal is understandable orchestration.

---

## 19. TopBar

Assessment Creation's upper-row UI belongs beneath:

```text
app/Assessments/Creation/TopBar/
```

The name `TopBar` is reserved for this Assessment Creation region.

It is distinct from the global application `HeaderBar`.

TopBar concerns include assessment metadata, date controls and active/view paper controls.

---

## 20. HUDBar

Assessment Creation's lower status/control area belongs beneath:

```text
app/Assessments/Creation/HUDBar/
```

It owns Creator-specific lower status/control presentation such as Marks & Timings, Notes and the Compile action.

Compile readiness/state may evolve independently without moving the control out of the Creation HUD responsibility.

---

## 21. SkillsPanel

Skill selection belongs beneath:

```text
app/Assessments/Creation/SkillsPanel/
```

SkillsPanel owns interactive skill-selection presentation.

It may:

- display the active Course skill tree;
- filter skills;
- display category sections;
- display concepts;
- manage difficulty interaction;
- display class-coverage information.

It must not own the underlying educational definition of National 5 Maths skills. That belongs to Courses.

---

## 22. Paper State and Sitting State

Assessment Creation paper workflow belongs beneath:

```text
app/Assessments/Creation/Papers/
```

This includes generic concerns such as:

- active paper;
- viewed paper;
- paper targets;
- intended timing;
- selection;
- paper-value maps;
- sitting date/time state.

Paper sitting currently supports per-paper date/start/end behaviour with deliberate compatibility and linking rules.

Some internal models still expose P1/P2 compatibility fields because persisted assessment data uses them.

Those compatibility seams are not justification for moving paper ownership or deleting working compatibility.

---

## 23. PaperWorkspace

The central Creator workspace belongs beneath:

```text
app/Assessments/Creation/PaperWorkspace/
```

It owns the interactive workspace itself.

Responsibilities include:

- Creator workspace layout;
- panes;
- preview viewport;
- zoom/view behaviour;
- document locking behaviour;
- split layout;
- preview composition;
- preview-owned overlays/status controls.

Preview implementation specific to the workspace belongs beneath:

```text
PaperWorkspace/Preview/
```

The workspace may consume generated-document primitives. It does not own those primitives.

---

## 24. Preview Tray

The Assessment Creator PDF/workspace preview includes a shared pull-out tray on the preview edge.

The tray is an Assessment Creation/preview concern and currently provides two conceptual modes:

```text
Settings
View
```

Settings owns paper-content and paper-sitting controls for the assessment being built.

View owns preview/display controls such as Compact, Exam, Answers, HUD visibility and layout/zoom reset actions.

This tray must not be confused with global application settings.

---

## 25. Assessment Question Workflow

Assessment Creation-specific question workflow belongs beneath:

```text
app/Assessments/Creation/Questions/
```

It owns concerns such as question drafts, generated question state, edit state, question controls, Creator-specific question preview and question workflow.

Generic question contracts belong higher in:

```text
app/Assessments/Questions/
```

Course-specific writers belong under the Course.

---

## 26. Assessment Analysis

Assessment quality analysis belongs beneath:

```text
app/Assessments/Creation/Analysis/
```

Analysis may measure concerns such as topic distribution, standard distribution, calculator balance, operational/reasoning balance and assessment quality indicators.

Analysis should consume generic Assessment data and Course configuration.

It should not contain hidden National 5 Maths curriculum definitions.

---

## 27. Assessment-Specific Settings

Assessment-specific settings belong with Assessment Creation.

They are distinct from global application settings beneath:

```text
app/UI/Application/
```

Assessment Preview Tray settings currently provide the active UI for many assessment-specific presentation/sitting controls.

Using similar interaction patterns does not make global settings and assessment settings the same domain.

---

## 28. Assessment Persistence

Creation persistence belongs beneath:

```text
app/Assessments/Creation/Persistence/
```

Persistence is an architectural boundary because browser-saved data survives code refactors.

Persisted data must therefore be treated as an external compatibility contract.

---

## 29. Persisted Data Rule

Do not rename storage keys, saved fields or persisted contracts merely to make source terminology prettier.

Historical terminology may remain in persisted data even after source ownership has changed.

A source refactor and a persisted-data migration are separate changes.

A persisted-data migration requires deliberate handling of existing users, old localStorage data, defaults, normalisation, optional compatibility fields and migration order.

Legacy wording in persistent storage is acceptable when it protects user data.

---

## 30. Saved Assessments

Persistent saved-assessment models belong beneath:

```text
app/Assessments/SavedAssessments/
```

The saved-assessment domain owns:

- saved-assessment data contracts;
- saved-assessment storage;
- current/active saved-assessment identity;
- backwards-compatible normalisation where required.

The UI for browsing saved assessments belongs separately beneath:

```text
app/MyAssessments/
```

This distinction is intentional:

```text
SavedAssessments
→ data and persistence

MyAssessments
→ user-facing library experience
```

---

## 31. Shared Assessment Questions

Generic question architecture belongs beneath:

```text
app/Assessments/Questions/
```

Its responsibilities include generic content, generation, preview and selection contracts.

These modules define contracts generic assessment workflows can use.

They should not encode National 5 Maths-specific generation decisions.

---

## 32. Question Content

Generic structured question/answer content belongs beneath:

```text
app/Assessments/Questions/Content/
```

This layer provides generic content structures that can be rendered by document/UI consumers.

---

## 33. Question Generation Contracts

Generic question/answer generation contracts belong beneath:

```text
app/Assessments/Questions/Generation/
```

This layer answers questions such as:

- what input does a generator receive?
- what output does a generator return?
- what generic metadata does an answer generator provide?

It does not answer how a National 5 Maths concept should be written. That belongs in the Course implementation.

---

## 34. Question Selection Contracts

Generic question-selection models belong beneath:

```text
app/Assessments/Questions/Selection/
```

Course configuration may supply tags or metadata consumed by selection.

Compatibility fields may remain while genuine consumers still require them.

---

## 35. Shared Question Preview

Shared Assessment question preview belongs beneath:

```text
app/Assessments/Questions/Preview/
```

These are Assessment-owned previews, not themselves generic generated-document primitives.

Because they participate in the interactive application preview experience, they may use Application UI typography where appropriate.

The stronger layering rule remains:

```text
app/UI/Documents/
```

must not depend on:

```text
app/UI/Application/
```

---

# Compilation and PDF

## 36. Assessment Compilation

Compilation belongs beneath:

```text
app/Assessments/Compilation/
```

Compilation is conceptually separate from Creation.

Creation asks:

> What should this assessment contain?

Compilation asks:

> How should the chosen assessment become a final paginated/generated document?

Current major areas include:

```text
Model/
Pagination/
Rendering/
PDF/
AssessmentCompilationPage.tsx
CompilationPageSizes.ts
CompilationPagination.ts
```

Compilation owns canonical document modelling, page sizes, pagination, compiled document composition, final rendering and generated PDF workflow.

---

## 37. Canonical Compilation Model

The final assessment is represented through an Assessment-owned canonical compilation model beneath:

```text
app/Assessments/Compilation/Model/
```

`buildAssessmentCompilationDocument.ts` converts saved assessment state into a document representation that compilation renderers can consume.

This boundary is important because browser compilation and server PDF generation should consume the same document meaning rather than independently reconstructing an assessment.

Do not create parallel “preview PDF” and “download PDF” assessment models.

---

## 38. Compilation Pagination

Pagination belongs beneath:

```text
app/Assessments/Compilation/Pagination/
```

Pagination determines how compiled assessment content is grouped into pages while respecting document/page-space rules.

Generic pagination should not become a second location for Course-specific educational knowledge.

---

## 39. Compilation Rendering

Compiled assessment rendering belongs beneath:

```text
app/Assessments/Compilation/Rendering/
```

The renderer consumes the canonical compilation model and Course/document components to produce the compiled assessment representation.

Creation preview, compilation preview and PDF generation should converge on shared document meaning wherever practical rather than drifting into visually different independent implementations.

---

## 40. PDF Generation Architecture

PDF generation lives beneath:

```text
app/Assessments/Compilation/PDF/
```

The current server pipeline is conceptually:

```text
SavedAssessment
      ↓
buildAssessmentCompilationDocument
      ↓
AssessmentPdfDocument / shared document rendering
      ↓
standalone HTML + embedded KaTeX assets
      ↓
headless Chromium via Puppeteer
      ↓
PDF bytes
      ↓
PDF generation route response
```

The server route is:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

Server-only browser launch concerns belong with PDF compilation, not with My Assessments.

---

## 41. PDF Assets and Client Cache

Client-side generated PDF asset/cache behaviour belongs beneath:

```text
app/Assessments/Compilation/PDF/Client/
```

The cache represents generated assessment PDF assets, not presentation-specific tile/list UI.

Consumers such as My Assessments should reuse the same generated asset where possible.

The asset identity should account for assessment identity and revision/update state so a changed assessment cannot silently reuse a stale PDF.

---

## 42. PDF Rendering in My Assessments

My Assessments uses PDF.js to render generated PDF assets into interactive canvas previews.

The library owns the viewer/presentation interaction; it does not own PDF generation.

Tile previews and large modal previews should reuse the same generated PDF asset rather than launching duplicate PDF generation work.

List-view preview generation should remain demand-driven rather than generating every library PDF simply because the list is visible.

---

## 43. Compilation and Courses

Compilation obtains Course-specific document behaviour through Course-owned document configuration.

It should not become a second location for National 5 Maths document knowledge.

Preferred direction:

```text
Assessment Compilation
        ↓
Course Documents
        ↓
qualification-family templates
        ↓
generic document primitives
```

---

# My Assessments

## 44. My Assessments Domain

The user-facing assessment library is now a first-class product domain beneath:

```text
app/MyAssessments/
```

This was promoted from the older Assessment-owned library location because the feature now has substantial independent UI/workflow responsibility.

Current high-level structure includes:

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

My Assessments owns library presentation and interaction, while consuming saved-assessment persistence and PDF-generation contracts from their real owners.

---

## 45. Library Responsibilities

My Assessments currently supports two equal library modes:

```text
Tile view
List view
```

Tile view prioritises visual browsing and embedded PDF previews.

List view prioritises rapid scanning, progress comparison and assessment management while retaining explicit Preview functionality.

The selected view mode is a user preference and may be persisted locally.

---

## 46. My Assessments Toolbar

Library controls belong beneath:

```text
app/MyAssessments/Toolbar/
```

Current controls include search, status filtering, sort selection, result count and tile/list switching.

Filtering/sorting rules belong in library-specific modules rather than being buried in presentation components.

---

## 47. My Assessments Display Metadata

Formatting and derived display metadata belong beneath:

```text
app/MyAssessments/Display/
```

This may include date/time formatting, Course/type/coverage labels and progress display derivation.

Display derivation must not become a parallel saved-assessment data model.

---

## 48. Tile View

Tile-specific presentation belongs beneath:

```text
app/MyAssessments/TileView/
```

Tiles provide:

- full-height scrollable generated-PDF preview;
- assessment title and Course/type/coverage metadata;
- overall and paper-specific progress;
- status;
- assessment/edited/created dates;
- pin, duplicate, delete and open actions.

The tile height is deliberately bounded so the PDF scrolls inside the preview pane rather than expanding the whole library card.

---

## 49. List View

List-specific presentation belongs beneath:

```text
app/MyAssessments/ListView/
```

The list retains the core information/functionality of tile view while optimising density.

Preview is intentionally a first-class column/action rather than an obscure secondary icon.

The list should avoid horizontal overflow at the primary desktop target width and should preserve readable column hierarchy.

---

## 50. Library PDF Preview

My Assessments large PDF-preview presentation belongs beneath:

```text
app/MyAssessments/Preview/
```

The modal viewer uses the same generated PDF asset as the tile/list preview path where possible.

The preview should support scrolling and clear dismissal through close control, backdrop and Escape.

This is a library presentation concern; PDF generation remains Assessment Compilation-owned.

---

## 51. Library Actions

User-facing library actions belong beneath:

```text
app/MyAssessments/Actions/
```

This includes interaction such as delete confirmation UI where the action is specific to the library experience.

The actual persistent mutation still uses SavedAssessments-owned storage contracts.

---

# Classes

## 52. Classes Domain

Class-owned functionality belongs beneath:

```text
app/Classes/
```

Classes owns:

- class records;
- class names and metadata;
- Course association;
- completed skill coverage;
- class persistence;
- My Classes;
- Class Details;
- reusable class UI;
- class coverage presentation.

---

## 53. Class Types

Class-specific contracts belong in the Classes domain.

A Class may reference `CourseId`, but does not own Course identity.

Course identity remains defined by Courses.

---

## 54. Class State

Class state and persistence belong beneath:

```text
app/Classes/State/
```

Class storage compatibility should be preserved when existing browser data depends on it.

---

## 55. Class Coverage

Class coverage belongs beneath:

```text
app/Classes/Coverage/
```

Class coverage must resolve educational skills through Course configuration.

Preferred flow:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

Classes should not directly import concrete National 5 Maths skills merely because National 5 Maths is currently the most complete Course.

---

# Courses

## 56. Courses Domain

Course-specific educational knowledge belongs beneath:

```text
app/Courses/
```

Courses owns concepts such as:

- Course identity;
- Course registration;
- assessment configuration;
- skills;
- qualification-specific rules;
- Course documents;
- historical exam evidence;
- question writers;
- answer writers.

The Courses domain is the principal boundary preventing generic Assessment and Classes workflows from becoming National-5-Maths-specific.

---

## 57. Course Identity

Course identity belongs in the Courses domain.

`CourseId` must have one canonical owner.

Do not recreate aliases such as `AssessmentCourseId` or re-export Course identity from unrelated domains merely to shorten imports.

---

## 58. Course Catalog

Selectable Course catalogue information belongs in:

```text
app/Courses/CourseCatalog.ts
```

This represents user-facing Course availability/metadata.

It is distinct from runtime assessment configuration.

---

## 59. Course Registry

Course assessment configurations are registered through the Course Registry.

Canonical terminology should remain consistent with the current registry API.

Historical shorter aliases should not be reintroduced without a real compatibility need.

---

## 60. Course Assessment Config

The generic contract between Courses and Assessment workflows lives in:

```text
app/Courses/CourseAssessmentConfig.ts
```

Its purpose is to answer:

> What does a generic Assessment workflow need to know about this Course?

This contract allows generic application code to consume Course knowledge without knowing the concrete Course implementation.

---

## 61. Course Selection

Course-selection persistence belongs beneath:

```text
app/Courses/Selection/
```

Ownership belongs to Courses because the persisted value represents Course identity/selection.

Historical storage keys may remain where required for backwards compatibility.

---

## 62. Course Paper Rules

Generic access to Course paper behaviour belongs beneath:

```text
app/Courses/Papers/
```

This boundary prevents Assessment Creation from hard-coding Course-specific paper assumptions where a Course contract can supply them.

---

## 63. National 5 Mathematics

National 5 Mathematics implementation belongs beneath:

```text
app/Courses/National5Maths/
```

Major responsibilities include:

```text
AssessmentConfig.ts
Skills/
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/
```

National 5 Maths-specific knowledge should normally remain inside this domain.

---

## 64. National 5 Maths Skills

The canonical National 5 Mathematics skill tree belongs beneath:

```text
app/Courses/National5Maths/Skills/
```

Generic consumers receive that structure through Course configuration.

They should not know the concrete skills file path unless they are Course-owned implementation.

---

## 65. Historical Exam Evidence

Historical National 5 Mathematics exam questions and marking schemes belong beneath:

```text
app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/
```

The catalogue represents evidence from historical examination material.

It is not the same thing as generated-question implementation.

---

## 66. Question and Answer Generation

Course-specific generation implementation belongs beneath:

```text
app/Courses/National5Maths/QuestionAndAnswerGeneration/
```

The high-level distinction is:

```text
QuestionWriting/
AnswerWriting/
AnswerMethods/
```

This terminology should be preferred over historical ambiguous generation names when referring to current architecture.

---

## 67. Question Writing

Question-writing logic belongs beneath the Course's QuestionWriting area.

It owns concept selection, writer registration, concept modules and concept-specific question writers.

Concept modules may adapt Course evidence into generation behaviour.

They remain part of the Course because they encode educational knowledge.

---

## 68. Answer Writing

Answer-writing implementation is distinct from question writing even when both are invoked by one assessment-generation flow.

This separation allows an answer implementation to evolve without embedding all answer logic inside question writers.

---

## 69. Answer Methods

Course-specific answer-method knowledge remains Course-owned.

Generic Assessment code may consume answer-generation contracts, but the educational method itself remains beneath the Course.

---

## 70. Question Bank Architecture Is Retired

The historical:

```text
app/question-bank/
```

architecture is not part of the current system and must not be recreated.

Live concept adapters were migrated to Course-owned question-writing architecture.

Future question-generation work should extend the Course architecture rather than creating a parallel Question Bank.

---

## 71. Adding a New Course

A new Course belongs beneath:

```text
app/Courses/<Course>/
```

Only create folders required by real implementation.

Do not pre-create empty structures for future Courses, future document systems or future generation systems.

When implementation exists, expose it through generic Course contracts where appropriate.

The architecture should grow from real responsibilities rather than speculative placeholders.

---

# UI

## 72. UI Domain

Presentation infrastructure belongs beneath:

```text
app/UI/
```

The most important visual boundary is:

```text
UI/
├── Application/
└── Documents/
```

These represent different presentation systems.

---

## 73. Application UI

Interactive product UI belongs beneath:

```text
app/UI/Application/
```

Current areas include:

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

Application UI is allowed to depend on browser interaction where required.

A remaining compatibility folder does not automatically become the preferred owner for new work.

---

## 74. Global Application Shell

The global shell is composed in:

```text
app/layout.tsx
```

using Application-owned pieces including:

```text
HeaderBar
ApplicationActivityRail
ApplicationShellTokens
SettingsProvider
```

The current shell establishes a global header row and a body row containing the activity rail plus page content.

The Activity Rail is global application chrome and is not specific to Assessment Creation.

Global panel overlays should not structurally resize feature content unless that interaction is explicitly intended.

---

## 75. Global Settings

Global appearance/settings functionality belongs beneath:

```text
app/UI/Application/Settings/
```

and associated Application UI ownership.

Global settings are surfaced through the Application Shell/Activity Rail.

They must remain separate from Assessment-specific Settings/View controls in the Creator preview tray.

Older SettingsDrawer-owned compatibility pieces may remain where still consumed, but new global settings architecture should follow current Application Settings/Shell ownership.

---

## 76. Application Theme

Global application theming belongs beneath:

```text
app/UI/Application/Theme/
```

Theme infrastructure may provide colour mode, appearance preference, accent colour and semantic visual tokens.

Current application appearance supports dark, soft-grey, light, system and custom modes through the global settings system.

Compatibility aliases may remain while they have genuine active consumers.

---

## 77. Application Typography

Interactive application typography belongs beneath:

```text
app/UI/Application/Typography/
```

Application typography tokens are appropriate for controls, metadata, application headings, Creator UI, Classes UI and interactive previews where the styling belongs to the application.

They should not automatically become the typography source for generated documents.

---

## 78. Current Workbench UI Direction

The established application UI direction is compact and desktop/workbench-oriented.

Characteristics include:

- restrained dark/neutral surfaces;
- thin borders;
- modest 4–6px radii for most controls and panels;
- compact control heights;
- restrained blue accent;
- subtle surface hierarchy rather than large card chrome;
- deliberate alignment and information density;
- consistent behaviour across appearance modes.

This is product UI guidance, not generated-document styling guidance.

---

## 79. Generated Document UI

Generated-document presentation belongs beneath:

```text
app/UI/Documents/
```

This layer represents printable/document-like output.

It should remain conceptually independent of interactive application chrome.

Document output must not rely on global navigation, activity rails, settings drawers, hover behaviour or application-only layout assumptions.

---

## 80. Application UI Must Not Own Documents

A generated assessment may be previewed inside the application.

That does not make document layout part of Application UI.

The preview container may be Assessment/MyAssessments-owned.

The document being rendered inside it remains Document/Course/Compilation-owned.

This distinction prevents the printable document system becoming coupled to editor/library chrome.

---

## 81. Document Layering

Generated documents follow this layering model:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment compilation/consumers
```

Each layer should add only the knowledge it owns.

---

## 82. Generic Document Primitives

Generic document primitives live beneath:

```text
app/UI/Documents/Components/
```

They should remain qualification-agnostic where practical.

---

## 83. Document Layout Utilities

Generic document measurement/layout logic belongs beneath:

```text
app/UI/Documents/Layout/
```

This should provide generic conversion/layout behaviour rather than National 5 Maths semantics.

---

## 84. Qualification-Family Templates

National Qualifications presentation patterns belong beneath:

```text
app/UI/Documents/Templates/NationalQualifications/
```

This layer may encode formatting common to the qualification family.

It should not encode National 5 Maths curriculum knowledge.

---

## 85. Course Documents

National 5 Maths document composition belongs beneath:

```text
app/Courses/National5Maths/Documents/
```

Course Documents may compose:

```text
generic Document primitives
+
National Qualifications templates
+
National 5 Maths-specific content
```

This includes cover pages, formula sheets, question-page composition and question-spacing rules.

---

## 86. Document Dependency Boundary

The generated-document system must not depend on interactive Application UI.

Specifically:

```text
app/UI/Documents/
```

should not import from:

```text
app/UI/Application/
```

If generated documents require typography, spacing or colours, document-appropriate ownership should be established rather than silently depending on application theme.

---

# Runtime Boundaries and Development Rules

## 87. Client Boundaries

`"use client"` marks a boundary between Server and Client Component graphs.

It should therefore be placed deliberately.

A nested file does not need its own `"use client"` merely because it contains hooks, browser APIs or event handlers if it is imported only beneath an existing client boundary.

Do not add `"use client"` defensively.

---

## 88. Why Client-Boundary Discipline Matters

Unnecessary client directives:

- enlarge client boundaries;
- obscure Server/Client ownership;
- make behaviour harder to reason about;
- may create Next.js serialisation warnings for function props;
- reduce the architectural value of Next.js boundaries.

Prefer a small number of deliberate client entry points.

---

## 89. Providers

Global providers should exist only when they represent genuinely global state or environment.

Current global examples include application settings/theme infrastructure.

Do not introduce a new global provider simply to avoid passing a small explicit dependency.

Prefer local ownership where state is local.

---

## 90. State Management

The architecture does not introduce a new external state-management library.

Existing React state, hooks, contexts and persistence remain appropriate where they fit.

A state-library migration would be a separate architectural decision requiring a demonstrated problem.

Do not add Redux, Zustand or another global state system merely as routine cleanup.

---

## 91. Explicit Dependencies Over Hidden Coupling

Prefer explicit component/hook dependencies over hidden browser-event communication.

Custom browser events may remain while actively required for compatibility or existing wiring.

They should not be deleted until a replacement path exists.

When replacing hidden event coupling:

```text
introduce explicit path
→ switch all consumers
→ verify behaviour
→ remove event bridge
```

Do not simply delete an event because the architecture looks cleaner without it.

---

## 92. Developer Tools

Runtime developer-only functionality belongs beneath:

```text
app/DeveloperTools/
```

It is part of the application source tree because these tools execute inside the application runtime.

Developer Tools should not contain production educational ownership merely because a developer tool consumes it.

---

## 93. Repository Tooling

There is currently no permanent repository-level `Tools/` tree.

Historical migration tooling used during Architecture V2 was removed after its work was completed and verified.

Repository tooling, if introduced later, must have a specific responsibility and must remain conceptually separate from runtime `app/DeveloperTools/`.

Runtime application code must never depend on historical migration tooling.

---

## 94. Architecture V2 History

Architecture V2 migration history is preserved through:

```text
Docs/RefactorLedger.md
Git history
```

Historical migration artefacts and paths are evidence of how the repository arrived at the current state.

They are not precedent for new runtime architecture.

The current architecture files take precedence over historical migration wording when describing ownership today.

---

## 95. Naming Architecture

Names should describe current product concepts.

Preferred terms include:

```text
Assessment Creation
Assessment Compilation
My Assessments
HeaderBar
ActivityRail
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Preview Tray
Drawer
Popover
QuestionWriting
AnswerWriting
ExamQuestion
ExamMarkingScheme
CourseAssessmentConfig
```

Avoid reviving superseded implementation terminology simply because old files, storage keys or internal route parameters still contain it.

Do not introduce historical product/brand terminology into new user-facing or source naming.

---

## 96. Builder Terminology

The public URL:

```text
/create-assessment/builder
```

and some persisted/internal compatibility keys may continue to contain `builder`.

That does not mean source architecture should return to:

```text
Builder/
BuilderComponents/
BuilderLogic/
```

The current source concept is Assessment Creation.

Persisted/public compatibility wording and source architecture terminology are allowed to differ.

---

## 97. Type Ownership

Types should live with the concept that owns them.

Examples:

```text
Course identity/types
→ Courses

Class data
→ Classes

generic assessment types
→ Assessments

question content contracts
→ Assessments/Questions/Content

generation contracts
→ Assessments/Questions/Generation
```

Do not create a global `shared-types` bucket merely because several domains consume a type.

Multi-domain consumption does not remove ownership.

---

## 98. Compatibility Aliases

Compatibility aliases are acceptable only when they serve an active compatibility purpose.

Before deleting one:

```text
find definition
→ find imports
→ find indirect consumers
→ check persisted data
→ check dynamic access
→ migrate consumers
→ verify
→ delete alias
```

An alias with no consumers can be removed.

An alias with active persistence/backwards-compatibility responsibilities cannot be removed merely because its name looks old.

---

## 99. Dead Code Standard

Code is not dead merely because no obvious static import appears in one search.

Before deletion, check:

- direct imports;
- re-exports;
- registry references;
- dynamic imports;
- string-based lookup;
- persistence contracts;
- runtime events;
- Course registration;
- route dispatch;
- generated-data consumers.

Delete only after the ownership/consumer investigation supports it.

---

## 100. Feature Development Pattern

The default development pattern after Architecture V2 is:

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

Incremental UI passes are preferred when visual behaviour is being refined.

Do not destabilise unrelated systems during a focused feature pass.

---

## 101. Refactor Migration Pattern

When a genuine structural migration is still required, retain the proven pattern:

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

The principle remains:

> Do not destroy the old path until the new path is proven.

---

## 102. Verification Standard

Structural source changes should normally be followed by:

```bash
npx tsc --noEmit
npm run build
git --no-pager diff --check
```

During focused UI iteration, TypeScript plus browser verification may be sufficient between passes, but infrastructure/release-level completion should reach a clean production build.

When route/framework changes leave stale `.next` output, regenerate or clear it as appropriate before rewriting correct source.

---

## 103. Browser Verification

Compilation and type-checking are necessary but not sufficient for visible application changes.

Browser smoke testing should cover the affected workflow and, where appropriate:

```text
Home
Assessment Setup
Assessment Creator
question generation
paper switching
Preview Tray
assessment preview
application settings
saved assessment behaviour
Compilation
PDF generation/download
My Assessments tile view
My Assessments list view
My Assessments PDF preview
My Classes
Class Details
```

When a browser/server boundary fails, DevTools Network/Console and the development server stack trace should be used to isolate the failing stage.

Generated document pages/PDFs should be visually checked where rendering infrastructure changed.

---

## 104. Course Independence Test

A useful architecture test is:

> Could another Course be added without copying and rewriting the entire Assessment workflow?

If the answer is no because generic Assessment code contains National 5 Maths-specific knowledge, ownership is probably wrong.

Course-specific knowledge should move toward the Course boundary.

---

## 105. Classes Independence Test

A useful Classes architecture test is:

> Can a Class point to a different registered Course without Classes importing that Course's concrete skills implementation?

If not, Classes is too tightly coupled to one Course.

Use Course Registry/configuration boundaries.

---

## 106. Document Independence Test

A useful document architecture test is:

> Could the generated assessment document be rendered without relying on the interactive application theme/navigation system?

If not, the Documents layer is probably too tightly coupled to Application UI.

Generated documents should own or receive their own presentation requirements.

---

## 107. Creation Independence Test

A useful Assessment Creation test is:

> Can the Creator obtain educational rules through Course configuration rather than importing one Course's concrete implementation everywhere?

If not, Course knowledge is leaking into generic workflow.

---

## 108. My Assessments Independence Test

A useful My Assessments test is:

> Can the library display/manage saved assessments without becoming the owner of persistence or PDF generation?

If not, library presentation is leaking into lower-level data/compilation ownership.

The preferred direction is:

```text
MyAssessments
   ↓
SavedAssessments / Compilation PDF contracts
```

not the reverse.

---

## 109. Feature Folder Standard

Create a new subfolder when it represents a coherent, durable responsibility.

Do not create folders solely to:

- reduce the number of files visible in Explorer;
- mirror another feature;
- reserve space for future work;
- encode arbitrary numbering;
- make every file have a unique directory.

Many small coherent files are acceptable.

Micro-fragmentation without ownership value is not.

---

## 110. Visible-Area Structure

For complex UI features, grouping by visible product area is preferred when that area represents a real responsibility.

Examples include:

```text
TopBar/
HUDBar/
SkillsPanel/
PaperWorkspace/
TileView/
ListView/
Toolbar/
Shell/
```

This makes repository navigation align with the UI vocabulary used during development.

---

## 111. Decorative Numbering

Folder numbering should not be introduced merely to force Explorer ordering.

Existing numbered areas may remain where changing them provides no meaningful ownership benefit.

Future architecture should prefer descriptive ownership over decorative ordering.

---

## 112. No Placeholder Architecture

Do not create empty architecture for future features.

Examples:

```text
no empty Higher Maths Course tree
no empty Advanced Higher tree
no speculative OCR domain
no future AI-marking source folders
no empty document-template hierarchies
```

Future concepts should be recorded in:

```text
Docs/FutureFeatures.md
```

Create runtime architecture when real implementation needs an owner.

---

## 113. Future OCR / Assisted Marking Work

OCR and assisted-marking concepts remain valid future product ideas.

Their conceptual existence is not sufficient reason to create placeholder runtime folders.

When implementation begins:

1. determine actual responsibilities;
2. establish ownership based on real behaviour;
3. introduce the smallest coherent architecture required;
4. preserve the privacy boundary described below.

---

## 114. Privacy Boundary

The class/assessment architecture should preserve the privacy model that pupil names do not need to be stored by the application server.

Where pupil identity is required, architecture should favour non-identifying IDs and local teacher-owned mapping where appropriate.

Future data architecture must not casually weaken that boundary.

---

## 115. Current Source vs Historical Evidence

The repository contains current runtime source and historical migration evidence.

Current source defines architecture.

Historical files explain how the current source was reached.

Never infer a preferred modern pattern merely because a legacy migration entry used it.

---

## 116. Documentation Roles

Documentation has distinct responsibilities:

```text
Docs/Architecture.md
→ current architecture and dependency principles

Docs/RepositoryMap.md
→ current physical locations and owners

Docs/LockedDecisions.md
→ durable decisions that should not be casually reopened

Docs/RefactorLedger.md
→ historical Architecture V2 migration work

Docs/FeatureHistory.md
→ post-refactor feature and technical evolution

Docs/FutureFeatures.md
→ future ideas, planned work and deferred concepts

Docs/ChatGPTWorkflow.md
→ safe AI-assisted development procedure

AGENTS.md
→ first-read repository instructions for coding agents
```

Do not turn one document into all of the others.

---

## 117. Architecture V2 Completion State

Architecture V2 achieved its broad objective when:

- runtime source gained clear owners;
- duplicated legacy architecture was removed;
- route structure stopped duplicating product structure;
- generic Assessment workflow was separated from Course knowledge;
- Classes resolved Course skills through Course abstraction;
- question writing and answer writing became Course-owned;
- historical exam evidence was separated from generation implementation;
- generated Documents were separated from Application UI;
- shared types gained explicit owners;
- redundant compatibility aliases were removed where safe;
- active persisted-data compatibility was preserved;
- client boundaries became deliberate;
- runtime Developer Tools and repository tooling were distinguished;
- obsolete parallel source roots were removed;
- documentation described the current repository;
- and the existing website continued to function.

Those outcomes are now the baseline, not a future checklist.

---

## 118. Current Definition of Good Architecture

The goal is not architectural novelty.

The goal is a repository whose structure communicates the product clearly enough that feature development can continue without recreating the confusion Architecture V2 removed.

A strong current change should therefore:

- fit an obvious owner;
- preserve dependency direction;
- reuse existing lower-level contracts instead of duplicating them;
- keep persistence compatibility deliberate;
- avoid unnecessary client boundaries;
- avoid speculative folder structure;
- keep UI and generated-document presentation distinct;
- and update the appropriate living documentation when the product meaningfully changes.
