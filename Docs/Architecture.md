# VecEd Architecture

**Document type:** Architectural constitution  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** Current and future VecEd development unless explicitly superseded  
**Purpose:** Define the durable ownership, dependency and structural rules of VecEd

---

# 1. Purpose

This document defines the long-lived architecture of VecEd.

It answers questions such as:

> Which domain owns this responsibility?

> What may this code depend upon?

> Where should new implementation belong?

> Which boundaries should remain stable as VecEd grows?

It does **not** attempt to describe every file currently present in the repository.

Use:

```text
Docs/RepositoryMap.md
```

for current physical implementation.

Use:

```text
Docs/RefactorLedger.md
```

for migration progress and current handoff state.

Use:

```text
Docs/LockedDecisions.md
```

for decisions which have already been explicitly settled.

Architecture describes:

```text
WHAT OWNS WHAT
+
HOW MAJOR RESPONSIBILITIES RELATE
```

rather than:

```text
EXACTLY WHICH FILE EXISTS TODAY
```

---

# 2. Architectural Mission

VecEd should be understandable through the structure of the product itself.

A developer unfamiliar with the project's history should be able to reason:

```text
"This is an Assessment Creation control"
→ Assessments/Creation

"This is National 5 Maths curriculum knowledge"
→ Courses/National5Maths

"This changes the teacher-facing application appearance"
→ UI/Application

"This changes the generated examination paper"
→ UI/Documents or Course Documents

"This is Class data"
→ Classes
```

The architecture should minimise reliance on:

- historical filenames;
- previous ChatGPT conversations;
- implementation accidents;
- generic helper folders;
- duplicated sources of truth;
- undocumented cross-feature coupling.

The repository should make the correct ownership decision easier than the incorrect one.

---

# 3. Core Principle — Ownership Follows Responsibility

A file belongs to the domain which **owns the knowledge or behaviour it represents**.

It does not belong to whichever component currently imports it most often.

For example:

```text
Assessment Creation uses Class data.
Assessment Creation does not own Classes.
```

Therefore Class models and Class behaviour belong to:

```text
Classes
```

Likewise:

```text
Assessment Creation displays Course curriculum.
Assessment Creation does not define Course curriculum.
```

Therefore curriculum belongs to:

```text
Courses
```

Likewise:

```text
Assessment Preview displays generated-paper visuals.
Assessment Preview does not define all generated-paper visual rules.
```

Those rules belong to the appropriate:

```text
UI/Documents
or
Course Documents
```

Ownership takes precedence over importer location.

---

# 4. Dependency Direction

Dependencies should generally flow from reusable owners toward consumers.

Conceptually:

```text
Course knowledge
      ↓
Assessment behaviour
      ↓
Assessment UI
```

and:

```text
UI document primitive
      ↓
qualification template
      ↓
Course document composition
      ↓
Assessment Preview / Compilation
```

and:

```text
Class domain
      ↓
features consuming Classes
```

Avoid architectures where major domains repeatedly depend upon one another in both directions.

If two major domains require deep mutual imports, reassess ownership.

---

# 5. One Authoritative Owner

A responsibility should normally have one authoritative implementation.

Architecture V2 should resist duplicate:

- state;
- persistence;
- Course rules;
- curriculum definitions;
- document dimensions;
- theme definitions;
- typography authorities;
- question generation logic;
- Class representations;
- Assessment models;
- quality-analysis logic.

Temporary compatibility adapters may exist during migration.

Adapters are not second sources of truth.

---

# 6. Product Terminology Drives Code Terminology

Internal naming should match the language used to describe VecEd wherever practical.

Established product terms include:

```text
HeaderBar
TopBar
HUDBar
SkillsPanel
SkillsFilters
SkillsTree
PaperWorkspace
Panel
Drawer
Popover
Control
Filter
Field
Pill
Picker
Status
Indicator
Modal
```

Do not introduce competing synonyms where an established term already describes the product concept.

Architecture should remain understandable without knowledge of historical implementation names.

---

# 7. Source Architecture

The principal long-term application architecture is:

```text
src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/
```

Additional top-level domains should exist only when they represent a genuinely independent responsibility.

A runtime-only development domain such as:

```text
DeveloperTools/
```

may exist if real developer-facing application features require it.

It is not a mandatory core domain.

Repository maintenance scripts belong separately under root-level:

```text
Tools/
```

when they have continuing value.

---

# 8. No Placeholder Architecture

Architecture describes allowed ownership.

It does not require creating empty folders merely because a future feature might need them.

Do not create speculative architecture for:

```text
Higher Maths
OCR
AI marking
Scanning
Analytics
DeveloperTools
```

until actual implementation requires those owners.

Future extensibility should come from good boundaries, not empty scaffolding.

---

# 9. `app` — Framework Boundary

The Next.js application routing layer owns framework-specific entry points.

Its responsibilities include:

- URL route folders;
- `page.tsx`;
- route layouts;
- metadata;
- framework glue.

It should not own substantial domain implementation.

The architectural intent is:

```text
route
   ↓
descriptive domain-owned page implementation
```

not:

```text
route
   ↓
entire feature implemented inside page.tsx
```

---

# 10. Thin Route Rule

A substantial route should normally delegate to a descriptively named page component.

Conceptually:

```text
page.tsx
    ↓
AssessmentCreatorPage
```

or:

```text
page.tsx
    ↓
AssessmentCompilationPage
```

Route names and implementation names are separate concerns.

A historical URL may remain stable while the implementation beneath it adopts clearer V2 terminology.

---

# 11. `Assessments` Domain

Assessment-related workflows belong beneath:

```text
src/Assessments/
```

An Assessment represents more than one page or screen.

The domain may contain distinct workflows such as:

```text
Creation
Compilation
Library / saved assessment responsibilities
```

when those responsibilities genuinely exist.

Do not treat one historical route as the owner of the entire Assessment domain.

---

# 12. Assessment Creation

Assessment Creation owns the workflow through which a teacher constructs an assessment.

Its major conceptual responsibilities include:

```text
AssessmentCreatorPage
AssessmentSetupPage
Setup
TopBar
SkillsPanel
PaperWorkspace
HUDBar
AssessmentSettings
Questions
Papers
Analysis
Persistence
```

Exact internal decomposition may evolve.

These ownership concepts are more important than preserving a fixed list of filenames.

---

# 13. Assessment Creator Page

The Assessment Creator page is the composition and orchestration boundary for the creation workspace.

It may coordinate:

- active Course;
- selected Class;
- Assessment configuration;
- paper state;
- question state;
- SkillsPanel state;
- persistence;
- quality analysis;
- major visible regions.

It should not permanently implement every behaviour it coordinates.

The page should increasingly contain:

```text
ORCHESTRATION
```

rather than:

```text
UNRELATED DOMAIN IMPLEMENTATION
```

A large coordinator is not automatically architecturally wrong.

The question is whether its code coordinates owners or secretly substitutes for them.

---

# 14. Assessment Setup

Assessment Setup owns the pre-creation workflow used to establish the Assessment configuration.

Examples include:

- selected level/Course;
- paper structure;
- Assessment type;
- target marks or time;
- Class coverage;
- Setup persistence;
- validation;
- submission into the Creator.

Course-specific educational rules consumed by Setup remain Course-owned.

Setup owns the interaction, not the Course knowledge.

---

# 15. TopBar

The Assessment Creation upper control region is:

```text
TopBar
```

It is separate from the global application:

```text
HeaderBar
```

TopBar may own visible controls such as:

- Assessment name;
- Class display/selection;
- Assessment date;
- active paper selector;
- zoom;
- page navigation.

TopBar consumes shared domain state where necessary.

It must not establish competing paper, Class or Assessment models simply because it displays them.

---

# 16. SkillsPanel

SkillsPanel owns teacher interaction with skills while creating an assessment.

Conceptually it may contain:

```text
SkillsFilters
SkillsTree
```

When visual sequence is meaningful, ordered folder naming may be used.

SkillsPanel owns:

- filtering;
- rendering;
- selection;
- expand/collapse interaction;
- difficulty/concept interaction;
- Assessment-specific question-selection actions.

SkillsPanel does **not** own the curriculum itself.

---

# 17. Skills Tree Boundary

The Course owns:

```text
WHAT THE CURRICULUM CONTAINS
```

Assessment Creation owns:

```text
HOW THE TEACHER INTERACTS WITH IT
```

Therefore Course ownership includes:

- categories;
- skills;
- concepts;
- educational ordering;
- Course-specific curriculum metadata.

Assessment Creation ownership includes:

- display;
- selection state;
- filtering;
- expand/collapse;
- interactive controls.

This boundary is essential for supporting multiple Courses without cloning Assessment Creation.

---

# 18. PaperWorkspace

PaperWorkspace is the central teacher-facing working surface for the Assessment paper.

It owns workspace-level composition and interaction.

Responsibilities may include:

- arranging the preview area;
- workspace sizing;
- view modes;
- workspace-level interaction;
- composition of Preview and lower workspace regions.

PaperWorkspace does not own every visual rule visible within a paper.

Generated-document rules belong to document owners.

PaperWorkspace is a strong architectural boundary and should depend on canonical V2 Assessment, Course and UI responsibilities rather than historical Builder implementations.

---

# 19. Assessment Preview

Preview belongs to the Assessment Creation workflow.

It owns responsibilities such as:

- sequencing preview pages;
- mapping current Assessment data to preview pages;
- preview-specific pagination/composition;
- preview modes;
- deciding whether answers are displayed;
- coordinating interactive preview behaviour.

Preview is a **consumer** of document architecture.

It is not automatically the owner of:

- A4 page dimensions;
- qualification-family decorations;
- Course cover pages;
- Course formula content;
- generic document typography.

---

# 20. Questions

Generic Assessment question workflow belongs to the Assessment domain.

This includes responsibilities such as:

- question drafts;
- question state;
- selected/locked/editable question workflow;
- placement;
- regeneration coordination;
- generic Assessment-side question interaction;
- interactive question preview.

Course-specific mathematical knowledge does not belong here merely because Assessment Creation triggers generation.

---

# 21. Interactive Question Preview

Teacher-facing interactive question preview components belong with Assessment Creation question workflow.

They may own:

- rendered-height measurement;
- draft controls;
- edit controls;
- locked question interaction;
- worked-answer switching;
- Assessment-preview layout behaviour.

They may consume generic document-content renderers.

They should not redefine generic document primitives or Course generation rules.

---

# 22. Papers

The Assessment domain owns generic paper workflow.

Examples include:

- active paper selection;
- Assessment paper state;
- generic targets derived from Course configuration;
- coordination between visible regions.

Course-specific facts about the paper remain Course-owned.

For example:

```text
"this Course has these paper definitions"
```

is Course knowledge.

```text
"the teacher is currently viewing Paper 2"
```

is Assessment workflow state.

---

# 23. Analysis

Assessment quality analysis belongs beneath the Assessment domain.

It may own:

- quality-note representation;
- aggregation of findings;
- Assessment balance analysis;
- advice/suggestion severity;
- generic interpretation of Assessment composition.

Where analysis relies upon Course-specific educational thresholds or expectations, those values should originate from the Course rather than becoming hidden global assumptions.

---

# 24. HUDBar

HUDBar is the persistent lower Assessment Creation region.

It may own presentation such as:

- progress information;
- marks/timings summary;
- quality notes;
- preview-view controls;
- save status;
- Compile entry point;
- lower-region sizing interaction.

Only responsibilities which actually belong to the lower region should live there.

Historical location does not determine final ownership.

---

# 25. Assessment Settings

Assessment-specific settings belong with Assessment Creation.

These settings affect the Assessment itself or the generated Assessment document.

Examples may include:

- cover-page inclusion;
- formula-sheet inclusion;
- candidate-information presentation;
- Assessment document options.

They are distinct from:

```text
global application settings
```

and from:

```text
workspace-only interaction settings
```

---

# 26. Settings Ownership Model

Settings are categorised by **what they affect**.

## Application-global settings

Belong to:

```text
UI/Application
```

Examples:

- theme;
- appearance;
- accent colour.

## Assessment settings

Belong to:

```text
Assessments/Creation
```

Examples:

- document configuration;
- cover/formula inclusion;
- Assessment-level presentation options.

## Workspace settings

Belong to:

```text
PaperWorkspace
```

Examples:

- workspace layout;
- preview display behaviour;
- workspace reset controls.

Do not merge settings merely because they are all accessed through a cog icon.

Communication between unrelated features should remain explicit.

Avoid using custom browser events, window events or other hidden cross-feature
signals as the normal mechanism for connecting application-global systems to
page-specific implementation.

Prefer explicit props, callbacks, owned state, context or domain interfaces
where they make the dependency visible.

---

# 27. Assessment Persistence

Persistence used specifically by the Assessment Creation workflow belongs with that workflow.

Responsibilities may include:

- autosave;
- loading a saved Assessment into Creation;
- selected Course persistence;
- Setup persistence;
- Assessment draft state.

Visible components should not scatter raw storage implementation throughout the UI where a clear persistence owner can exist.

---

# 28. Assessment Compilation

Compilation is a distinct Assessment responsibility.

Creation means:

```text
the teacher interactively builds and previews an Assessment
```

Compilation means:

```text
the Assessment becomes final printable/generated document output
```

These workflows may share:

- Assessment models;
- Course definitions;
- Course Documents;
- document primitives.

Compilation must not be architecturally treated as a sub-component of Assessment Creation merely because early implementation shared historical Builder code.

---

# 29. Shared Creation / Compilation Responsibilities

Where Creation and Compilation need the same rule, ask who genuinely owns it.

Examples:

```text
generic A4 mechanics
→ UI/Documents

Course question-page presentation
→ Course Documents

Assessment data model
→ Assessments

Course paper definition
→ Courses

interactive Creator controls
→ Assessments/Creation

final output sequencing
→ Assessments/Compilation
```

Do not share code by making one complete workflow depend upon another workflow's UI implementation.

---

# 30. `Courses` Domain

Course-specific educational knowledge belongs beneath:

```text
src/Courses/
```

A Course may own:

- Course identity;
- curriculum;
- paper definitions;
- educational rules;
- question generation;
- answer generation;
- Course Documents;
- official/source question catalogues;
- marking-scheme catalogues.

Only actual responsibilities should receive physical folders.

Course data may define semantic identity, such as curriculum category,
difficulty or educational grouping.

It should not become the authoritative owner of literal application styling
such as colours, fonts, spacing or animation.

Application visual treatment remains owned by UI/Application.

---

# 31. Course Contract

Generic application features should be able to consume a Course through a coherent Course contract.

That contract may expose capabilities such as:

- identity;
- label;
- curriculum;
- papers;
- question generation;
- document components;
- Course-specific rules.

The exact implementation or filename of this contract is not prescribed here.

Conceptually:

```text
Course resolver / registry
        ↓
Course definition
        ↓
generic consumers
```

The contract should evolve from real requirements rather than speculative future fields.

---

# 32. Course Resolution

VecEd should have one clear authoritative mechanism for resolving a supported Course.

Generic Assessment UI should not require Course-specific logic scattered throughout the application.

Avoid repeated patterns such as:

```ts
if (course === "National5Maths") {
  ...
}
```

when the variation can instead be supplied through Course configuration or Course-owned components.

Not every temporary Course check must be abstracted immediately.

The goal is clear long-term Course ownership.

---

# 33. Future Courses

Future Courses should be sibling Course implementations.

Conceptually:

```text
Courses/
├── National5Maths/
└── HigherMaths/
```

only when Higher Maths is actually implemented.

A new Course should not normally require cloning:

- AssessmentCreatorPage;
- TopBar;
- PaperWorkspace;
- HUDBar;
- generic SkillsPanel;
- generic Assessment state.

Course differences should be supplied by Course-owned data and behaviour.

---

# 34. Course Skills Tree

Course curriculum belongs to the Course.

A Course Skills Tree may organise curriculum by meaningful educational sequence.

For National 5 Maths, meaningful curriculum grouping may include areas such as:

```text
Numerical
Algebraic
Geometric
Trigonometric
Statistical
```

The exact physical structure may evolve.

Meaningful educational organisation should not be flattened merely for technical uniformity.

---

# 35. Course Question Generation

Course-specific question-generation knowledge belongs with the Course.

It may include:

- generator registration;
- mathematical construction;
- concept-specific generation rules;
- valid value constraints;
- difficulty-dependent generation behaviour.

Assessment Creation owns the workflow of requesting/placing/generated-question interaction.

The Course owns how a valid Course question is created.

---

# 36. Course Answer Generation

Where worked-answer generation requires Course-specific mathematical knowledge, it belongs with the Course.

Separate:

```text
HOW AN ANSWER IS MATHEMATICALLY GENERATED
```

from:

```text
HOW AN ANSWER IS DISPLAYED
```

Display ownership depends on whether the consumer is Assessment interaction or generated documents.

---

# 37. Source Catalogues

Course source material should use descriptive domain concepts such as:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

where appropriate.

These are valid explicit owners because they communicate what the data represents.

Do not replace clear catalogue ownership with generic data/helper folders.

---

# 38. `Classes` Domain

Class data and Class-specific behaviour belong beneath:

```text
src/Classes/
```

Classes may own:

- Class models;
- Class storage;
- Class creation/editing;
- pupil identifier structures;
- Class-specific page implementations;
- Class-specific behaviour.

Assessment Creation may select and consume a Class.

It does not own the Class model.

---

# 39. Pupil Privacy Boundary

VecEd's intended pupil-data architecture separates pupil identity used by the application from teacher-local name mapping.

Conceptually:

```text
VecEd Assessment / Class data
→ pupil identifiers
```

while teacher-local mapping may provide:

```text
identifier
→ pupil name
```

on the teacher's device.

Do not casually move pupil names into broader persistence, server-side systems or future services.

Changes to this privacy model require deliberate product/privacy review.

---

# 40. `UI` Domain

Visual architecture belongs beneath one top-level domain:

```text
src/UI/
```

It is split into:

```text
UI/
├── Application/
└── Documents/
```

These are intentionally separate visual systems.

---

# 41. `UI/Application`

Application UI represents the teacher-facing VecEd software interface.

It may own:

- theme;
- application colours;
- application typography;
- global visual tokens;
- HeaderBar;
- SettingsDrawer;
- reusable application-level components.

Only genuine global/reusable values should be centralised.

Not every local layout number belongs in a global design system.

---

# 42. HeaderBar

HeaderBar is the global VecEd navigation region.

It owns:

- VecEd identity/logo;
- global navigation;
- global application Settings access.

It does not own Assessment Creation-specific controls.

HeaderBar's Settings entry point should consistently represent application-global settings.

---

# 43. Application Theme

VecEd should have one authoritative application appearance architecture.

Avoid competing:

- theme definitions;
- theme providers;
- theme persistence;
- global colour authorities.

A feature may consume theme information.

It should not create a second application theme system.

---

# 44. `UI/Documents`

Generated Assessment documents use a separate visual architecture beneath:

```text
src/UI/Documents/
```

This domain may own:

- physical document units;
- page dimensions;
- generic page frames;
- generic document typography;
- reusable document content rendering;
- qualification-family templates.

It does not own Course-specific educational content merely because that content appears on paper.

---

# 45. Why Application and Documents Are Separate

Teacher-facing application UI and printable/generated documents have fundamentally different visual responsibilities.

For example:

```text
responsive application layout
```

is different from:

```text
fixed A4 document geometry
```

and:

```text
application typography
```

is different from:

```text
printed examination typography
```

Changing application appearance should not accidentally alter Assessment papers.

Changing paper layout should not accidentally redesign the application.

---

# 46. Document Layering

Generated documents follow a layered ownership model.

```text
Generic document primitives
        ↓
Qualification-family templates
        ↓
Course Documents
        ↓
Assessment consumer
```

This is a core V2 architectural boundary.

---

# 47. Generic Document Primitives

Generic document mechanics belong to:

```text
UI/Documents
```

They may own:

- A4 dimensions;
- unit conversion;
- page scaling;
- clipping;
- white paper surface;
- generic content rendering;
- generic mathematical content rendering;
- reusable physical layout behaviour.

They must not embed Course-specific titles, marks or curriculum rules.

---

# 48. Qualification-Family Templates

Reusable document conventions shared across a qualification family belong beneath a qualification-family template layer.

Current example:

```text
UI/Documents/Templates/NationalQualifications/
```

This layer may own visual conventions such as:

- corner marks;
- candidate-number areas;
- marks margins;
- side-margin treatment;
- common page footer treatment;
- common cover structure;
- Turn over presentation.

It should not determine National 5 Maths-specific formula content or paper totals.

---

# 49. Course Documents

Course-specific document composition belongs with the Course.

For National 5 Maths:

```text
Courses/National5Maths/Documents/
```

owns things such as:

- National 5 Maths cover content;
- formula-sheet content;
- P1/P2 Course presentation differences;
- Course-specific paper instructions;
- Course-specific question-page configuration.

Course Documents may compose qualification templates and generic document primitives.

---

# 50. Course Document Boundary

A Course should expose its generated document capabilities through one coherent Course-owned boundary.

Conceptually:

```text
Course Documents
├── CoverPage
├── FormulaSheet
└── QuestionPage
```

where those document types apply.

Generic Assessment consumers should eventually receive these through the active Course contract rather than importing Course internals throughout the application.

---

# 51. Document Dependency Direction

The intended dependency direction is:

```text
UI/Documents primitives
        ↓
UI/Documents qualification templates
        ↓
Courses/<Course>/Documents
        ↓
Assessments
```

Do not make:

```text
UI/Documents
```

depend upon:

```text
Assessment Creation
```

or make Course document primitives depend upon a specific Preview component.

---

# 52. Document Consumers

Assessment consumers decide:

```text
WHICH PAGE IS REQUIRED
WHEN IT APPEARS
WHAT ASSESSMENT DATA IT RECEIVES
```

Course Documents decide:

```text
HOW THAT COURSE PAGE IS COMPOSED
```

Qualification templates decide:

```text
WHAT THE QUALIFICATION FAMILY SHARES
```

Generic document primitives decide:

```text
HOW PHYSICAL DOCUMENT MECHANICS WORK
```

Keeping these questions separate prevents document architecture from becoming another monolith.

---

# 53. Persistence Architecture

Persistence belongs to explicit owners.

Examples:

```text
application appearance
→ UI/Application

Assessment Creation persistence
→ Assessments/Creation

Class persistence
→ Classes
```

Visible UI should consume persistence responsibilities rather than scattering raw storage calls where ownership can be explicit.

---

# 54. Persistence Compatibility

Persisted identifiers and data shapes are contracts independent of source filenames.

Therefore:

```text
rename BuilderStorage module
```

does not automatically imply:

```text
rename localStorage keys
```

Persistence migration must be deliberate.

Architecture V2 does not automatically replace local storage with:

- a database;
- cloud accounts;
- server persistence.

Those are separate product/architecture decisions.

---

# 55. State Architecture

Architecture V2 does not require a new state-management library.

The preferred sequence is:

```text
identify state
      ↓
identify owner
      ↓
remove duplication
      ↓
simplify coordination
      ↓
evaluate whether infrastructure is actually needed
```

Do not introduce global state infrastructure merely to compensate for unclear ownership.

---

# 56. Shared State Does Not Mean Shared Folder

If multiple features use the same value, ask:

> Who owns the value?

Examples:

```text
Course definition
→ Courses

Application theme
→ UI/Application

Class model
→ Classes

Assessment question state
→ Assessments

Document dimensions
→ UI/Documents
```

Do not create a generic:

```text
Shared/
```

folder simply because several consumers exist.

---

# 57. Types Belong With Their Models

A TypeScript type should normally live with the responsibility it describes.

Examples:

```text
Assessment question type
→ Assessments

Course definition type
→ Courses

Class type
→ Classes

document primitive props
→ UI/Documents

Course document props
→ Course Documents
```

Do not recreate a global `SharedTypes` architecture.

---

# 58. Generic Helpers Are Not an Architecture

Avoid permanent catch-all domains such as:

```text
Helpers
Utils
Shared
Common
Misc
```

unless a genuinely coherent responsibility cannot be described more specifically.

Functions should move toward the domain owning their behaviour.

Architecture V2 should not simply rename historical generic buckets.

---

# 59. Naming

VecEd-owned architectural folders use PascalCase where practical.

Examples:

```text
Assessments
PaperWorkspace
National5Maths
SettingsDrawer
```

React components use descriptive PascalCase names.

Hooks use:

```text
useSomething
```

Route folders may use URL-compatible lowercase/kebab-case.

Naming should describe current responsibility, not implementation history.

---

# 60. Meaningful Numbering

Numeric prefixes are permitted when they communicate genuine order.

Examples:

```text
01-Numerical
02-Algebraic
```

or:

```text
01-SkillsFilters
02-SkillsTree
```

Do not number unrelated domains merely to control Explorer order.

---

# 61. File Decomposition

Files should represent meaningful responsibilities.

Split when:

- a responsibility has its own product identity;
- behaviour has an independent lifecycle;
- ownership becomes clearer;
- multiple consumers need the same owner;
- a component contains independently understandable features.

Do not split solely because a file crosses an arbitrary line count.

Do not create micro-files without conceptual value.

---

# 62. Folder Decomposition

Do not create a folder for every single file.

A responsibility may remain directly inside its owning domain when simple.

Create subfolders where several files together form one meaningful sub-feature.

Folder structure should communicate concepts, not satisfy symmetry.

---

# 63. Legacy Terminology

Historical names such as:

```text
Builder
builder-logic
builder-behaviour
shared-types
math-helpers
```

are migration evidence.

They are not permanent V2 architectural concepts.

Do not blindly search-and-replace them.

Determine actual responsibility first.

---

# 64. `Builder` Terminology

The permanent product/domain name is:

```text
Assessment Creation
```

not:

```text
Builder
```

The substantial page is:

```text
AssessmentCreatorPage
```

The central surface is:

```text
PaperWorkspace
```

The lower region is:

```text
HUDBar
```

Old `Builder...` identifiers should disappear as responsibilities are migrated, not through a blind global rename.

---

# 65. Temporary Adapters

Temporary adapters may preserve compatibility while consumers migrate.

A valid adapter:

- forwards to one canonical owner;
- contains little or no independent behaviour;
- exists for a known migration reason;
- has an intended removal point.

Adapters should not become permanent parallel APIs without explicit architectural justification.

---

# 66. Dead Code

Architecture V2 should not preserve obsolete source.

Before deletion, investigate:

- imports;
- exports;
- consumers;
- aliases;
- routes;
- dynamic/framework usage;
- persistence;
- other workflows.

A new implementation existing does not prove the old implementation is unused.

Once genuinely dead, deletion is preferred to migration.

---

# 67. Product vs Implementation Technology

Names should describe product concepts rather than current implementation technology where possible.

Prefer:

```text
PaperWorkspace
```

over:

```text
PDFViewer
```

because the product concept survives rendering-engine changes.

Likewise, generic architectural concepts should avoid unnecessary technology-specific naming.

---

# 68. Neutral Exam Terminology

Generic internals should avoid unnecessary awarding-body-specific naming.

Appropriate neutral concepts may include:

```text
Exam
CandidateNumber
OfficialPastPaper
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

Qualification-specific templates and Course-specific content may use the identity they genuinely represent.

Neutral naming does not resolve legal, copyright or trademark questions.

Those require separate review.

---

# 69. Repository Tooling

Repository-level scripts with continuing maintenance value belong under:

```text
Tools/
```

Examples may include:

- migration scripts;
- catalogue validation;
- one-off data processors retained for maintenance;
- repository validation.

Runtime developer/testing pages are application responsibilities, not root Tools.

---

# 70. Runtime Developer Features

If VecEd contains developer-facing functionality which runs inside the application, it may eventually justify:

```text
src/DeveloperTools/
```

or another explicitly approved owner.

Do not create this domain until actual runtime developer functionality is migrated.

---

# 71. Architectural Extensibility

Good extensibility means:

```text
a new Course can be added without cloning Assessment Creation

a new document template can reuse generic document mechanics

a new persistence technology can replace storage behind an owner

a new Class consumer can use the Classes domain

a new Assessment workflow can reuse Assessment models without importing Creation UI
```

Extensibility does not mean pre-building every possible abstraction.

---

# 72. Avoid Premature Abstraction

Create abstractions when they solve:

- real duplication;
- real ownership boundaries;
- real multi-consumer contracts;
- real Course variation.

Do not create abstractions merely because they may theoretically be useful one day.

A direct, well-owned implementation is preferable to a speculative framework.

---

# 73. Architecture and Migration Are Separate Concerns

The architecture may define an owner before all historical source has migrated there.

That does not weaken the architectural decision.

For current physical implementation use:

```text
RepositoryMap.md
```

For current migration progress use:

```text
RefactorLedger.md
```

Do not contaminate durable architecture with temporary migration status.

---

# 74. Verification Is Part of Architectural Work

A structural change is not successful merely because files are organised elegantly.

Relevant verification may include:

```text
TypeScript
production build
development runtime
browser interaction
persistence
generated-document appearance
```

Architecture V2 preserves working behaviour while improving ownership.

---

# 75. Generated Documents Are Behaviour

For generated Assessment documents, visual output is part of application behaviour.

Changes affecting:

- physical page dimensions;
- scaling;
- margins;
- question spacing;
- qualification decorations;
- cover pages;
- formula sheets;
- final paper composition

require visual verification.

Type correctness alone does not prove document correctness.

---

# 76. Product Changes Are Separate From Refactors

Architecture work may expose a desirable product improvement.

Do not silently combine:

```text
architectural refactor
```

with:

```text
product redesign
```

Preserve behaviour first.

Propose product changes separately.

---

# 77. Architecture Change Control

If new technical evidence demonstrates that a locked architectural rule creates material harm:

```text
identify rule
      ↓
describe evidence
      ↓
explain conflict
      ↓
propose amendment
      ↓
obtain explicit approval
      ↓
update documentation
```

Do not silently drift architecture through implementation convenience.

---

# 78. Architectural Health Questions

When deciding where new code belongs, ask:

> Who owns the knowledge represented here?

> Would this still belong here if the current consumer disappeared?

> Is another implementation already authoritative?

> Would another Course require copying this?

> Is this application UI or document UI?

> Is this generic document behaviour or Course-specific document behaviour?

> Is this Assessment workflow or Course educational knowledge?

> Is this shared because it has many consumers, or because it genuinely has a shared owner?

> Does the filename describe responsibility or history?

> Would an unfamiliar developer look here first?

If these answers are unclear, ownership probably requires further analysis.

---

# 79. Desired Dependency Shape

The broad architectural direction should resemble:

```text
                 Classes
                    ↓
                  Features

Courses ───────────────→ Assessments
  │                         │
  │                         ↓
  │                   Creation / Compilation
  │
  ↓
Course Documents
  ↑
  │
UI/Documents Templates
  ↑
  │
UI/Documents Primitives
```

while teacher-facing application features may consume:

```text
UI/Application
```

for reusable application visuals.

Major domain dependencies should remain understandable from this model.

---

# 80. Desired End State

Architecture V2 is successful when VecEd can be navigated using product meaning.

For example:

```text
broken Assessment upper control
→ Assessments/Creation/TopBar

wrong Assessment preview behaviour
→ Assessments/Creation/PaperWorkspace

wrong question-generation maths
→ Courses/<Course>/QuestionGeneration

wrong curriculum definition
→ Courses/<Course>/SkillsTree

wrong application theme
→ UI/Application

wrong generic A4 sizing
→ UI/Documents

wrong qualification page treatment
→ UI/Documents/Templates/<QualificationFamily>

wrong National 5 Maths formula sheet
→ Courses/National5Maths/Documents

wrong Class data
→ Classes

wrong final Assessment assembly
→ Assessments/Compilation
```

The developer should not need to know the project's refactor history to find the correct owner.

---

# 81. Architectural Definition of Done

Architecture V2 has achieved its purpose when:

- `src` is the understandable authoritative application source tree;
- route files are thin framework boundaries;
- Assessment Creation no longer relies on a historical Builder architecture;
- Course-specific knowledge is Course-owned;
- additional Courses do not require cloning generic Assessment UI;
- Classes have explicit domain ownership;
- global, Assessment and workspace settings have distinct owners;
- persistence responsibilities are explicit;
- generic type/helper dumping grounds are gone or explicitly justified;
- application UI has coherent visual authority;
- generated documents follow layered ownership;
- Compilation has an explicit Assessment owner;
- the repository can be navigated without historical project memory.

Architecture V2 does not require:

- the fewest possible files;
- the most abstract possible code;
- every value becoming a token;
- every feature being future-proofed for hypothetical requirements.

It requires clear, predictable ownership.

---

# 82. Final Architectural Rule

The central VecEd Architecture V2 principle is:

> **Put knowledge where it is owned, put behaviour where it belongs, and make dependencies flow toward those owners.**

That principle should remain valid even as individual files, components and Courses evolve.

If the repository continues to satisfy it, VecEd should remain understandable as the product grows.