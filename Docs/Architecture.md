# VecEd Architecture

**Document type:** Architectural constitution  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** Current and future VecEd development unless explicitly superseded  
**Purpose:** Define the long-lived ownership, dependency and structural architecture of VecEd

---

# 1. Purpose

This document defines how VecEd is architected.

It is intentionally different from:

```text
Docs/RepositoryMap.md
```

which records where code physically lives during migration, and:

```text
Docs/RefactorLedger.md
```

which records what has already been migrated and what remains.

This document answers:

> Who should own this responsibility?

> What should this code depend upon?

> Where should a new implementation belong?

> Which architectural boundaries should remain stable as VecEd grows?

Architecture V2 exists because VecEd reached substantial functionality before the repository had been designed as one coherent system.

The legacy application worked, but its implementation accumulated across many separate development sessions.

That produced:

- unclear ownership;
- oversized components;
- generic helper/type locations;
- duplicated UI authorities;
- route files containing application implementation;
- course-specific behaviour mixed with generic Assessment behaviour;
- repeated persistence logic;
- inconsistent naming;
- legacy terminology such as `Builder`;
- temporary structures becoming de facto permanent structures;
- dependencies which reflected historical implementation rather than product responsibility.

Architecture V2 resolves those problems through explicit ownership.

The central principle is:

> **The repository should communicate the design of the product.**

A developer should normally be able to locate a responsibility by understanding what that responsibility means.

---

# 2. Architectural Objectives

Architecture V2 should make VecEd:

- understandable without historical conversation context;
- safe to extend;
- safe to refactor;
- easier to debug;
- easier to test;
- easier to hand over;
- resistant to duplicate sources of truth;
- resistant to accidental feature coupling;
- ready for additional Courses without duplicating Assessment Creation;
- ready for richer document generation without mixing document visuals into application UI;
- maintainable by someone who did not originally write the code.

The architecture should favour:

```text
clear ownership
over
clever abstraction
```

and:

```text
descriptive structure
over
historical familiarity
```

---

# 3. Core Architectural Principles

## 3.1 Ownership is determined by responsibility

A file belongs to the domain which owns the knowledge or behaviour it represents.

It does not belong to whichever component happens to consume it most often.

For example:

```text
Assessment Creation uses class data
```

but:

```text
Assessment Creation does not own Classes
```

Therefore Class models and behaviour belong to:

```text
src/Classes/
```

Likewise:

```text
Assessment Creation displays curriculum information
```

but:

```text
Assessment Creation does not define the curriculum
```

Therefore Course curriculum belongs to:

```text
src/Courses/
```

Usage does not determine ownership.

---

## 3.2 Dependency direction should follow ownership

Higher-level product orchestration may consume lower-level domain responsibilities.

Lower-level owners should not reach upward merely because a current consumer needs something.

Preferred conceptual direction:

```text
Course knowledge
      ↓
Assessment domain behaviour
      ↓
Assessment page composition
```

and:

```text
UI primitives / templates
      ↓
domain-owned visual composition
      ↓
screen or document consumer
```

Avoid circular ownership such as:

```text
Course
  ↔
Assessment Creation
```

or:

```text
generic UI
  → feature implementation
  → generic UI
```

---

## 3.3 One responsibility should have one authoritative owner

Architecture V2 must converge competing implementations.

Particular risks include duplicated:

- theme systems;
- typography;
- colour definitions;
- document dimensions;
- Course paper rules;
- question generation;
- assessment question state;
- persistence keys;
- document cover logic;
- Class models;
- Skills Tree definitions;
- quality-analysis rules.

Temporary adapters may exist during migration.

They are not permanent competing authorities.

---

## 3.4 Product terminology should drive code terminology

Where practical, internal terminology should match the product.

Approved vocabulary includes:

```text
HeaderBar
TopBar
HUDBar
SkillsPanel
SkillsFilters
SkillsTree
PaperWorkspace
Drawer
Popover
Panel
Control
Filter
Field
Pill
Picker
Status
Indicator
Modal
```

Avoid creating alternative terms for the same visible responsibility.

---

## 3.5 Architecture should support discoverability

A developer should be able to reason:

> “This appears in the Assessment Creation HUD”

and naturally inspect:

```text
src/Assessments/Creation/HUDBar/
```

or:

> “This is the National 5 Maths cover page”

and naturally inspect:

```text
src/Courses/National5Maths/Documents/CoverPage/
```

Architecture should minimise the need to know old filenames or implementation history.

---

## 3.6 Refactoring may rewrite

Architecture V2 is not constrained to preserving legacy file boundaries.

A migration may:

```text
KEEP
REWRITE
MOVE
RENAME
SPLIT
MERGE
CONSOLIDATE
DELETE
```

provided working behaviour is preserved unless a product change is deliberately approved.

---

# 4. Target Repository Architecture

The long-term source architecture is:

```text
N5-Assessment-Tool/
├── src/
│   ├── app/
│   ├── Assessments/
│   ├── Classes/
│   ├── Courses/
│   ├── UI/
│   └── DeveloperTools/
├── Docs/
├── Tools/
├── public/
├── AGENTS.md
├── package.json
├── tsconfig.json
└── ...
```

Not every target subtree must be created immediately.

Folders should appear when real implementation requires them.

Do not create speculative placeholder architecture.

---

# 5. `src/app` — Framework and Routing Layer

The target Next.js routing layer is:

```text
src/app/
```

During migration, some routes may still physically exist under root:

```text
app/
```

That is a transitional implementation detail recorded in `RepositoryMap.md`.

The architectural responsibility remains the same.

## `app` owns

- Next.js route folders;
- `page.tsx`;
- route layouts;
- route metadata;
- framework-specific entry points;
- minimal route glue.

## `app` does not own

- substantial feature UI;
- assessment state;
- Course logic;
- Class logic;
- question generation;
- document rendering rules;
- feature persistence.

---

# 6. Thin Route Wrapper Rule

A `page.tsx` should normally be a tiny framework wrapper.

Example:

```text
app/create-assessment/builder/page.tsx
        ↓
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

Conceptually:

```tsx
import AssessmentCreatorPage from "...";

export default function Route() {
  return <AssessmentCreatorPage />;
}
```

Substantial page implementation belongs in the domain which owns the page.

Examples:

```text
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
HomePage.tsx
AssessmentCompilationPage.tsx
```

Route URL naming and implementation naming are separate concerns.

A legacy URL does not require the underlying V2 implementation to retain legacy terminology.

---

# 7. `src/Assessments` — Assessment Domain

Assessment-related product behaviour belongs under:

```text
src/Assessments/
```

This domain represents assessment workflows rather than Course curriculum knowledge.

Major conceptual responsibilities include:

```text
Assessments/
├── Creation/
├── Compilation/
└── ...
```

Only create additional Assessment subdomains when a real product responsibility exists.

---

# 8. Assessment Creation

The canonical Assessment Creation domain is:

```text
src/Assessments/Creation/
```

Its architecture is responsibility-based:

```text
Creation/
├── AssessmentCreatorPage.tsx
├── AssessmentSetupPage.tsx
├── Setup/
├── TopBar/
├── SkillsPanel/
├── PaperWorkspace/
├── HUDBar/
├── AssessmentSettings/
├── Questions/
├── Papers/
├── Analysis/
└── Persistence/
```

The exact file inventory may evolve.

These ownership boundaries are more important than preserving a fixed tree forever.

---

# 9. `AssessmentCreatorPage`

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

is the page-level coordinator for the Assessment Creation workspace.

It may:

- compose major Assessment Creation regions;
- coordinate state shared between those regions;
- connect Course configuration to generic Assessment behaviour;
- coordinate persistence;
- coordinate selected papers/classes;
- coordinate question state;
- supply region-specific props.

It should not become the permanent implementation owner for every behaviour used by the page.

When meaningful responsibility can be named independently, prefer extracting it to its owner.

The goal is:

```text
orchestration
```

not:

```text
one enormous feature implementation
```

---

# 10. Assessment Setup

Assessment Setup belongs under:

```text
src/Assessments/Creation/Setup/
```

with its page implementation in:

```text
src/Assessments/Creation/AssessmentSetupPage.tsx
```

Setup owns the workflow required before entering the full Assessment Creator.

Examples include:

- selected Course/level;
- paper structure;
- assessment type;
- timing/marks targets;
- class coverage;
- setup persistence;
- setup submission;
- setup-specific validation;
- setup-specific controls and sections.

Course-specific rules consumed during setup still belong to the Course where they represent Course knowledge.

---

# 11. TopBar

Assessment Creation's upper control region is:

```text
src/Assessments/Creation/TopBar/
```

`TopBar` is not the global site header.

Typical responsibilities include:

- assessment name;
- selected Class;
- assessment date;
- current paper view;
- zoom;
- page navigation.

The global application header is:

```text
HeaderBar
```

The Assessment Creation control row is:

```text
TopBar
```

These terms must not be conflated.

---

# 12. SkillsPanel

The Assessment Creation skills region belongs under:

```text
src/Assessments/Creation/SkillsPanel/
```

Conceptually it contains:

```text
SkillsPanel/
├── 01-SkillsFilters/
└── 02-SkillsTree/
```

Numbering is justified here because the visible/functional ordering is meaningful.

## SkillsPanel owns

- filters used while creating an assessment;
- displaying the active Course's Skills Tree;
- expansion/collapse UI;
- selection interaction;
- concept/difficulty controls;
- question-generation actions exposed through the panel.

## SkillsPanel does not own

- the curriculum itself;
- National 5 Maths skill definitions;
- Course category ordering;
- Course-specific mathematical generation rules.

---

# 13. Skills Tree Ownership Boundary

The Course owns:

```text
what exists
```

Assessment Creation owns:

```text
how the user interacts with it
```

Therefore:

```text
src/Courses/<Course>/SkillsTree/
```

owns:

- categories;
- skills;
- concepts;
- curriculum ordering;
- Course-specific educational structure.

While:

```text
src/Assessments/Creation/SkillsPanel/
```

owns:

- rendering;
- filters;
- collapse/expand state;
- selection interaction;
- generic assessment-building behaviour.

This boundary is fundamental to future multi-Course support.

---

# 14. PaperWorkspace

The central assessment paper workspace belongs under:

```text
src/Assessments/Creation/PaperWorkspace/
```

It is the composition boundary for the teacher-facing paper workspace.

Conceptually it may compose:

```text
PaperWorkspace
├── TopBar interaction boundary
├── Preview/
├── workspace resizing / view behaviour
└── HUDBar
```

The exact physical ownership of TopBar and HUDBar remains their own sibling domains.

PaperWorkspace coordinates them; it does not absorb their responsibilities.

---

# 15. Preview

Assessment Creation's interactive document preview belongs under:

```text
src/Assessments/Creation/PaperWorkspace/Preview/
```

Preview owns:

- arranging preview pages;
- rendering preview page sequences;
- connecting assessment questions to page presentation;
- deciding whether preview answers are shown;
- interactive preview behaviours;
- deciding which Course document component to render;
- preview-specific pagination/composition state.

Preview does not own:

- generic A4 dimensions;
- National Qualifications page decorations;
- National 5 Maths cover content;
- National 5 Maths formula content;
- Course-specific document design.

Those belong to document and Course layers described later.

---

# 16. Questions

Generic Assessment Creation question workflow belongs under:

```text
src/Assessments/Creation/Questions/
```

Responsibilities may include:

- question draft types;
- locked/draft/edit states;
- question state coordination;
- question spacing behaviour;
- generic interactive question preview components;
- measuring rendered question height;
- worked-answer preview interaction.

Course-specific question generation does not belong here.

---

# 17. Question Preview Components

Interactive teacher-facing question preview components belong under:

```text
src/Assessments/Creation/Questions/Preview/
```

Examples of responsibilities:

- measuring rendered question height;
- rendering locked questions in the creation preview;
- rendering draft questions;
- rendering worked-answer previews;
- question-preview layout values.

These components are part of Assessment Creation interaction.

They may consume generic document content renderers such as:

```text
src/UI/Documents/Components/PaperContent.tsx
```

but they do not own generic document primitives.

---

# 18. Papers

Generic assessment paper behaviour belongs under:

```text
src/Assessments/Creation/Papers/
```

Examples include:

- paper selection state;
- paper targets;
- generic assessment paper rules consumed from the Course;
- mapping between active paper and creation workflow.

Do not hard-code National 5 Maths P1/P2 educational rules here when the rule belongs to the Course.

---

# 19. Analysis

Assessment quality analysis belongs under:

```text
src/Assessments/Creation/Analysis/
```

This domain owns generic assessment-quality interpretation.

Examples include:

- quality note representation;
- combining quality notes;
- analysing selected-question balance;
- presenting advisory/essential/suggestion findings.

Course-specific thresholds or educational expectations should originate from Course configuration where appropriate.

The generic note model should not be named after the legacy Builder implementation.

---

# 20. HUDBar

The lower Assessment Creation region belongs under:

```text
src/Assessments/Creation/HUDBar/
```

It owns teacher-facing lower-workspace controls and assessment progress information.

Typical responsibilities include:

- marks/timing summary;
- quality notes;
- preview mode controls;
- save-state indicator;
- Compile action;
- HUD resizing;
- progress-row preparation where that representation exists specifically for the HUD.

`HUDBar` is the canonical product term.

Legacy `BuilderBottomHud` naming should not be reintroduced.

---

# 21. AssessmentSettings

Assessment-specific settings belong under:

```text
src/Assessments/Creation/AssessmentSettings/
```

These settings affect the assessment being created.

They are not application-global settings.

Examples may include:

- cover inclusion;
- formula sheet inclusion;
- candidate-number presentation;
- paper-specific date/time;
- assessment-document configuration.

Do not move assessment settings into the global application Settings Drawer simply because both are called settings.

Ownership is determined by what the setting affects.

---

# 22. Persistence

Assessment Creation persistence belongs under:

```text
src/Assessments/Creation/Persistence/
```

This domain should own storage behaviour which exists specifically for the Assessment Creation workflow.

Examples include:

- creator autosave;
- saved-assessment loading;
- Course selection persistence;
- assessment-creation storage adapters.

Visible components should not independently recreate persistence logic.

Persisted key names are compatibility contracts.

Source-code renaming does not automatically justify renaming storage keys.

---

# 23. Assessment Compilation

Compilation is a separate Assessment responsibility from Creation.

Conceptually:

```text
src/Assessments/Compilation/
```

should own the workflow which transforms an assessment into final printable/generated output.

Compilation may consume:

- saved assessment state;
- Course document definitions;
- generic document primitives;
- final question rendering;
- page composition.

Compilation should not permanently depend upon Assessment Creation's legacy implementation components merely because the first prototype was built there.

Current physical migration status belongs in `RepositoryMap.md`.

---

# 24. Creation vs Compilation

The distinction is:

```text
Creation
=
teacher interactively builds and previews an assessment
```

while:

```text
Compilation
=
the assessment is transformed into final printable document pages
```

They may share domain models and Course document components.

They should not share code by making one feature import the other's page-level implementation.

Common responsibilities should be moved to the owner which genuinely owns them.

---

# 25. `src/Courses` — Course Domain

Course-specific educational knowledge belongs under:

```text
src/Courses/
```

Conceptually:

```text
Courses/
├── CourseRegistry.ts
├── CourseDefinitionTypes.ts
├── Papers/
└── National5Maths/
```

Future Courses should appear as sibling implementations only when they are actually being developed.

Do not create empty speculative Courses.

---

# 26. Course Definition

A Course should eventually expose enough information for generic application features to consume it without embedding Course-specific knowledge.

Conceptually, Course configuration may supply:

- identity;
- display labels;
- Skills Tree;
- paper definitions;
- question-generation registry;
- document components;
- course-specific rules;
- source catalogues.

Assessment Creation should consume the selected Course's contract.

It should not require branches such as:

```ts
if (course === "National5Maths") {
  ...
}
```

throughout generic UI.

Some transitional direct imports may remain during migration.

The architectural direction is Course-provided behaviour.

---

# 27. Course Registry

The long-term multi-Course selection boundary should be a registry or equivalent explicit Course lookup owned under:

```text
src/Courses/
```

Its role is to map Course identity to Course definition.

It must not become a dumping ground for all Course implementation.

Each Course remains responsible for its own internal structure.

---

# 28. National 5 Maths

National 5 Maths lives under:

```text
src/Courses/National5Maths/
```

Its major conceptual responsibilities include:

```text
National5Maths/
├── SkillsTree/
├── Papers/
├── QuestionGeneration/
├── AnswerGeneration/
├── Documents/
├── SourceQuestionCatalog/
└── SourceMarkingSchemeCatalog/
```

Only create or preserve subdomains that have real responsibility.

This tree is conceptual, not a requirement to manufacture empty directories.

---

# 29. Course-Specific Question Generation

Mathematical generator knowledge belongs under:

```text
src/Courses/<Course>/QuestionGeneration/
```

It owns things such as:

- generator registry;
- concept-specific generators;
- mathematical constraints;
- Course-specific question construction.

Assessment Creation owns:

```text
requesting / selecting / assigning generated questions
```

The Course owns:

```text
how a valid Course question is generated
```

---

# 30. Answer Generation

Where Course-specific worked answers or solution structures require dedicated generation logic, that knowledge belongs with the Course.

Conceptually:

```text
src/Courses/<Course>/AnswerGeneration/
```

Generic interactive presentation of those worked answers may belong to Assessment Creation or Documents depending on the consumer.

Do not mix mathematical solution-generation rules with UI presentation merely because they appear together on screen.

---

# 31. Source Question and Marking-Scheme Catalogues

Strong existing concepts should be preserved when they already have clear ownership.

Course evidence/source material belongs under concepts such as:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

These are preferable to generic buckets.

They communicate what the data represents.

---

# 32. `src/Classes` — Classes Domain

Class data and class-specific behaviour belong under:

```text
src/Classes/
```

The Classes domain should eventually own:

- Class models;
- Class persistence where applicable;
- Class creation/editing;
- pupil identifier structures;
- Class-specific behaviours.

Assessment Creation may reference selected Class IDs.

It must not become the authoritative owner of Class data.

---

# 33. Pupil Privacy Boundary

VecEd's intended privacy model separates application/server-visible pupil identifiers from teacher-local names.

Conceptually:

```text
VecEd assessment data
→ pupil IDs
```

while teacher-local mapping may provide:

```text
pupil ID
→ pupil name
```

on the teacher's device.

Architectural changes must not casually introduce pupil names into storage or server-side systems where the established model intentionally avoids them.

Any change to this model is a separate privacy/product decision.

---

# 34. `src/UI` — Visual Architecture

There is one top-level visual domain:

```text
src/UI/
```

It is deliberately divided into:

```text
UI/
├── Application/
└── Documents/
```

These represent two different visual systems.

They should not be collapsed.

---

# 35. `UI/Application`

Application UI is the teacher-facing software interface.

Conceptually:

```text
src/UI/Application/
├── Colours/
├── Typography/
├── Spacing/
├── Motion/
├── Shadows/
├── Theme/
├── HeaderBar/
├── SettingsDrawer/
└── Components/
```

Not every folder must contain global tokens merely for symmetry.

Only centralise a visual value when it is genuinely shared.

---

# 36. Global Visual Source of Truth

Architecture V2 should converge on one authoritative application visual system.

Do not introduce competing:

- theme objects;
- typography authorities;
- accent-colour registries;
- global spacing authorities;
- global control systems.

Local component layout values are acceptable.

“One source of truth” does not mean every pixel must be a global token.

---

# 37. HeaderBar

The global VecEd website header is:

```text
src/UI/Application/HeaderBar/
```

It owns:

- VecEd logo;
- global navigation;
- application-wide Settings entry point.

It does not own Assessment Creation-specific controls.

---

# 38. Global Settings

Application-global settings belong under:

```text
src/UI/Application/SettingsDrawer/
```

Examples include application appearance.

The HeaderBar Settings button must consistently mean global application settings.

Do not make the same global button secretly open unrelated feature-specific settings depending on route.

Feature-specific settings belong to their feature.

---

# 39. `UI/Documents`

Generated assessment documents are a separate visual system:

```text
src/UI/Documents/
```

Conceptually:

```text
Documents/
├── Typography/
├── Layout/
├── Spacing/
├── Components/
└── Templates/
```

This domain owns reusable visual/document primitives, not Course-specific educational content.

---

# 40. Why Documents Are Separate From Application UI

The teacher-facing application and the generated examination document have different responsibilities.

For example:

```text
application button typography
```

is not the same design system as:

```text
printed examination typography
```

Likewise:

```text
responsive application panel layout
```

is not the same responsibility as:

```text
210 mm × 297 mm A4 paper geometry
```

Keeping these systems separate prevents application redesigns from accidentally altering generated papers and vice versa.

---

# 41. Document Architecture Layers

Generated assessment documents follow layered ownership:

```text
Generic document primitive
        ↓
Qualification-family template
        ↓
Course-specific document component
        ↓
Assessment preview / compilation
```

Current architectural example:

```text
A4PageFrame
        ↓
NationalQualifications template
        ↓
National5Maths Documents
        ↓
Assessment Preview / Compilation
```

Each layer should own only the knowledge appropriate to that level.

---

# 42. Generic Document Primitives

Generic physical/document primitives belong under:

```text
src/UI/Documents/
```

Examples:

```text
Components/A4PageFrame.tsx
Components/PaperContent.tsx
Layout/DocumentUnits.ts
```

They may own:

- A4 dimensions;
- millimetre-to-pixel conversion;
- generic page scaling;
- white paper surface;
- generic clipping;
- generic PaperPart rendering;
- generic KaTeX rendering.

They do not own National Qualifications branding or National 5 Maths paper rules.

---

# 43. Qualification-Family Templates

Reusable document conventions shared by a qualification family belong under:

```text
src/UI/Documents/Templates/<TemplateFamily>/
```

Current example:

```text
src/UI/Documents/Templates/NationalQualifications/
```

This layer may own visual conventions such as:

- corner marks;
- marks margin;
- candidate-number box presentation;
- qualification-family cover layout;
- qualification-family question-page margin treatment;
- page footer treatment;
- “Turn over” treatment;
- “Do not write in this margin” presentation.

It must not decide Course-specific paper marks or Course-specific formula content.

---

# 44. National 5 Maths Documents

National 5 Maths-specific document knowledge belongs under:

```text
src/Courses/National5Maths/Documents/
```

Current conceptual structure:

```text
Documents/
├── CourseDocuments.ts
├── CoverPage/
│   └── National5MathsCoverPage.tsx
├── FormulaSheet/
│   └── National5MathsFormulaSheet.tsx
└── QuestionPage/
    └── National5MathsQuestionPage.tsx
```

This layer owns decisions such as:

- National 5 Maths paper titles;
- P1/P2 document differences;
- calculator/no-calculator messaging;
- National 5 Maths formula content;
- paper-specific total marks;
- Course-specific first-page instructions.

It may compose reusable National Qualifications templates.

---

# 45. Course Document Bundle

A Course should expose its document components through an explicit Course-owned bundle.

For National 5 Maths:

```text
src/Courses/National5Maths/Documents/CourseDocuments.ts
```

Conceptually:

```ts
{
  CoverPage,
  FormulaSheet,
  QuestionPage
}
```

This is the intended plug-in boundary between generic Assessment workflows and Course-specific generated-document implementation.

Long-term, Assessment code should obtain document components through the selected Course definition/registry rather than importing one Course directly everywhere.

---

# 46. Document Consumer Responsibilities

Assessment Preview or Compilation decides:

```text
which page is required
when it appears
which assessment data it receives
```

The Course document component decides:

```text
how that Course page is composed
```

The qualification template decides:

```text
shared qualification-family visual conventions
```

The generic document primitive decides:

```text
physical page mechanics
```

Do not collapse these layers.

---

# 47. Document Preservation

Generated-document refactoring requires visual verification.

A TypeScript pass cannot prove that:

- margins remained correct;
- corner marks remained correct;
- formula placement remained correct;
- scaling remained correct;
- page decorations remained correct.

Therefore document architecture changes require relevant visual comparison.

---

# 48. Persistence Architecture

Persistence should be explicit and domain-owned.

Visible components should consume persistence behaviour rather than scattering raw storage calls.

Examples of ownership:

```text
Assessments/Creation/Persistence/
Classes/... persistence owner
UI/Application/Theme/... preference storage
```

The storage technology itself is not being redesigned merely because Architecture V2 exists.

---

# 49. Persisted Compatibility

Persisted keys and stored data shapes may outlive source filenames.

Therefore:

```text
rename source module
```

does not imply:

```text
rename localStorage key
```

Any persisted-data migration must be deliberate and compatibility-aware.

---

# 50. State Architecture

Architecture V2 does not mandate a new global state-management library.

The preferred order is:

```text
identify state
        ↓
identify owner
        ↓
remove duplicate state
        ↓
reduce unnecessary coordination
        ↓
evaluate whether a new state library is actually necessary
```

Do not add infrastructure to solve organisational problems that can be solved through ownership.

---

# 51. Shared State vs Shared Ownership

Two components needing the same data does not mean the data belongs in a generic `Shared` folder.

Instead ask:

> Which domain owns this state?

Then allow both consumers to access that owner.

Examples:

```text
selected Class
→ Class / Assessment coordination

Course definition
→ Courses

application theme
→ UI/Application/Theme

assessment question state
→ Assessments/Creation/Questions
```

---

# 52. Generic Buckets Are Discouraged

Avoid new permanent folders named:

```text
Helpers
Utils
Shared
Common
Misc
```

unless the responsibility genuinely cannot be described more precisely.

Architecture V2 should move away from legacy concepts such as:

```text
shared-types
math-helpers
```

by relocating types and behaviour to their actual owners.

---

# 53. Types Belong With Their Domain

A type should normally live near the responsibility it models.

Examples:

```text
assessment draft type
→ Assessments/Creation/Questions

Course definition type
→ Courses

document component props
→ UI/Documents or Course Documents

Class type
→ Classes
```

Do not centralise all types merely because they are TypeScript types.

---

# 54. Naming Convention

VecEd-owned architectural folders use PascalCase where practical.

Examples:

```text
Assessments
Creation
PaperWorkspace
National5Maths
SettingsDrawer
```

React components use PascalCase:

```text
AssessmentCreatorPage.tsx
AssessmentHUDBar.tsx
National5MathsQuestionPage.tsx
```

Hooks use:

```text
useSomething.ts
```

Examples:

```text
useAssessmentQuestionState.ts
useAssessmentProgressRows.ts
```

Route folders may use lowercase or kebab-case according to URL requirements.

---

# 55. Descriptive Naming Over Historical Naming

Names should describe current responsibility.

Prefer:

```text
AssessmentCreatorPage
AssessmentHUDBar
AssessmentQualityNotes
AssessmentProgressPanel
```

over:

```text
BuilderPage
BuilderBottomHud
BuilderNotes
BuilderProgressHud
```

However, do not perform blind global renames.

Rename when the responsibility is being deliberately migrated and its consumers have been traced.

---

# 56. Neutral Exam Terminology

Generic architecture should avoid unnecessary awarding-body-specific naming.

Prefer neutral generic concepts where appropriate:

```text
Exam
OfficialPastPaper
CandidateNumber
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

Specific qualification-family templates may use the identity they actually represent.

Specific Course implementation may use the Course identity it actually represents.

Neutral naming is an architectural clarity principle, not a claim about licensing or branding rights.

---

# 57. Numbered Folders

Use numeric prefixes only when order is meaningful.

Approved examples:

```text
01-Numerical
02-Algebraic
03-Geometric
```

and:

```text
01-SkillsFilters
02-SkillsTree
```

Do not decorate unrelated folders with numbers merely to control Explorer sorting.

---

# 58. Component Decomposition

Files should represent meaningful responsibilities.

Prefer decomposition when:

- a component owns several independent behaviours;
- part of a component has its own product name;
- a behaviour is reused;
- a responsibility has a separate lifecycle;
- extraction clarifies dependency ownership.

Do not split merely because a file exceeded an arbitrary line count.

Do not create one tiny file per function without conceptual value.

---

# 59. Page-Level Orchestration

Large page coordinators are acceptable while they genuinely coordinate many feature areas.

They should continually lose implementation detail as responsibilities gain clear owners.

The goal is not necessarily:

```text
tiny page coordinator
```

at all costs.

The goal is:

```text
page coordinator contains orchestration
not hidden domain implementation
```

---

# 60. Application-to-Course Dependency

Generic Assessment UI may depend upon a Course contract.

Course implementation should not depend upon Assessment Creation screen structure.

Preferred direction:

```text
Course definition
       ↓
Assessment Creation
```

not:

```text
Assessment Creation component
       ↓
Course generator
       ↓
Assessment Creation component
```

Course code should remain usable by other future consumers such as Compilation.

---

# 61. Application-to-UI Dependency

Domain features may consume application UI primitives.

For example:

```text
Assessment Creation
       ↓
UI/Application
```

Application UI primitives should not import Assessment Creation implementations merely to satisfy one feature.

If something is feature-specific, keep it with the feature.

---

# 62. Course-to-Document Dependency

Course document implementations may consume reusable document templates and primitives.

Preferred direction:

```text
UI/Documents primitives
       ↓
UI/Documents/Templates
       ↓
Courses/<Course>/Documents
       ↓
Assessments
```

This dependency direction should remain stable.

---

# 63. Legacy Code During Migration

Legacy source remains valid evidence for:

- current behaviour;
- current data contracts;
- persistence compatibility;
- visual details;
- route behaviour.

It is not automatically valid evidence for:

- future naming;
- future ownership;
- dependency direction;
- preferred folder structure.

Architecture V2 should preserve useful behaviour without institutionalising legacy structure.

---

# 64. Temporary Adapters

A temporary adapter is acceptable when it enables safe migration.

A good adapter:

- has a clear migration purpose;
- forwards to the canonical owner;
- does not duplicate implementation;
- allows legacy consumers to survive temporarily.

An adapter should be deleted once all consumers have moved.

Adapters are transition tools, not architecture destinations.

---

# 65. Dead Code

Architecture V2 should not migrate code which has been proven obsolete.

Before deletion:

- inspect the implementation;
- search the symbol broadly;
- search alternate names/adapters;
- trace imports;
- trace consumers;
- consider routes;
- consider persistence;
- consider dynamic/framework use.

Once deadness is established, deletion is preferable to carrying obsolete code forward.

---

# 66. Compiler and Runtime Verification

Architectural correctness requires more than file placement.

Verification may include:

```text
npx tsc --noEmit
npm run build
npm run dev
browser smoke testing
document visual inspection
persistence checks
```

Choose checks appropriate to the changed responsibility.

---

# 67. Preservation Boundary for Refactors

A refactor should not silently redesign the product.

If architecture work reveals a desirable product change:

```text
record it
separate it
obtain approval
```

Do not bundle it invisibly into structural migration.

---

# 68. Architecture Change Process

If new technical evidence materially conflicts with this architecture or a locked decision:

1. identify the existing rule;
2. explain the technical evidence;
3. explain why compliance is harmful or impossible;
4. propose a precise amendment;
5. obtain explicit approval;
6. update the relevant documentation.

Do not allow architecture to drift through implementation accidents.

---

# 69. Documentation Responsibilities

Architecture V2 documentation has deliberately separated roles.

```text
AGENTS.md
```

owns mandatory working rules.

```text
Docs/LockedDecisions.md
```

owns settled decisions.

```text
Docs/Architecture.md
```

owns long-lived architecture.

```text
Docs/RepositoryMap.md
```

owns current physical location/status.

```text
Docs/RefactorLedger.md
```

owns migration history/current progress.

```text
Docs/ChatGPTWorkflow.md
```

owns detailed AI-assisted working procedure.

Do not turn Architecture into a migration diary.

---

# 70. Architectural Health Test

When deciding whether new structure is good, ask:

> Can someone unfamiliar with the implementation infer where this responsibility belongs?

> Does the owner make sense independently of its current consumer?

> Is there already another source of truth?

> Would a second Course require copying this implementation?

> Would a redesign of application UI unexpectedly alter printed documents?

> Would changing a Course require editing generic UI?

> Is this file here because of responsibility or merely history?

If these questions expose ambiguity, ownership probably needs further work.

---

# 71. Desired End State

Architecture V2 is successful when VecEd can be understood approximately as:

```text
Routes
  ↓
Product Domains
  ↓
Explicit Responsibilities
  ↓
Course Contracts / Class Data / UI Systems
```

rather than:

```text
Route
  ↓
giant historical component
  ↓
misc helper folder
  ↓
another feature's component
  ↓
duplicated implementation
```

The repository should make correct development easier than incorrect development.

---

# 72. Final Architectural Principle

The defining Architecture V2 rule is:

> **Put knowledge where it is owned, put behaviour where it belongs, and make dependencies flow toward those owners.**

When that rule is followed consistently:

- folders become predictable;
- names become meaningful;
- features become easier to isolate;
- Course expansion becomes safer;
- document rendering becomes reusable;
- legacy coupling disappears naturally;
- future development requires less historical context.

That is the standard VecEd Architecture V2 should continue to converge toward.