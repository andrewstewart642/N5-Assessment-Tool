# VecEd Architecture

**Document type:** Architectural constitution  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** All current and future VecEd development unless explicitly superseded  
**Primary audience:** Developers, maintainers, AI coding assistants and future project contributors  
**Primary purpose:** Preserve the architectural intent of VecEd independently of individual development conversations

---

# 1. Purpose of This Document

This document defines the intended software architecture of VecEd.

VecEd was initially developed iteratively across a large number of separate
development conversations.

That process successfully produced a substantial working application, but it
also created architectural inconsistency.

Individual features were frequently designed with limited visibility of the
entire project.

A solution which made sense for one local feature sometimes created problems
for the wider repository.

Over time this produced issues including:

- inconsistent folder naming;
- inconsistent file naming;
- multiple competing locations for UI code;
- generic folders such as `shared-types`;
- generic folders such as `math-helpers`;
- route files containing substantial application logic;
- duplicated settings logic;
- duplicated theme logic;
- unclear ownership of files;
- excessively large components;
- excessively fragmented hooks;
- files whose purpose cannot be inferred from their name;
- code organised according to historical implementation rather than product
  meaning;
- application code mixed with temporary migration tooling;
- course-specific behaviour coupled to general Assessment Creation behaviour;
- visible controls whose implementation is difficult to locate;
- repeated local solutions to problems that should have had a shared source of
  truth.

Architecture V2 exists to resolve those problems before further major feature
development significantly increases the size of the project.

The objective of Architecture V2 is **not** simply to make the repository look
cleaner.

The objective is to create a repository whose organisation communicates the
design of the product.

A new developer should be able to open VecEd and understand:

- what the major product domains are;
- where each feature lives;
- why each file exists;
- which domain owns each responsibility;
- what other code that responsibility is allowed to depend upon;
- where new files should be created;
- which naming convention should be used;
- where application appearance is controlled;
- where document appearance is controlled;
- where course data lives;
- how Assessment Creation obtains course information;
- how the Skills Tree obtains course information;
- how shared state is owned;
- how persistence is owned;
- which architectural decisions are intentional;
- which parts of the repository are temporary legacy architecture.

This document describes the **target Architecture V2**.

The existing pre-refactor implementation should be treated as migration input,
not as architectural precedent.

---

# 2. Architectural Mission

Architecture V2 should make VecEd:

- easier to understand;
- easier to debug;
- easier to maintain;
- easier to extend;
- safer to refactor;
- easier to hand over between development conversations;
- easier for AI assistants to understand reliably;
- less dependent upon historical knowledge;
- less dependent upon the original author remembering where code lives;
- less vulnerable to duplicate implementations;
- less vulnerable to inconsistent terminology;
- less vulnerable to accidental coupling between features.

The architecture should be clear enough that repository navigation becomes a
natural extension of understanding the product itself.

---

# 3. Core Architectural Principles

The following principles apply throughout VecEd.

---

## 3.1 Clarity over cleverness

Architecture should optimise for human comprehension.

A technically clever abstraction is not automatically desirable.

Where two technically valid solutions exist, prefer the solution whose purpose
and ownership are easier to understand from the repository structure.

Avoid architecture which requires historical knowledge of how a feature was
originally implemented.

A developer should not need to know that a control was created during a
particular previous refactor in order to locate it.

---

## 3.2 Product terminology should drive code terminology

Where practical, internal code terminology should match the terminology used to
describe the actual VecEd interface and product.

Examples include:

- `HeaderBar`;
- `TopBar`;
- `HUDBar`;
- `SkillsPanel`;
- `SkillsFilters`;
- `SkillsTree`;
- `PaperWorkspace`;
- `SettingsDrawer`;
- `SettingsPopover`.

These names should remain consistent across:

- folders;
- files;
- React components;
- documentation;
- development discussions;
- bug reports;
- implementation prompts.

Do not create an unnecessary developer-only synonym for an existing product
concept.

---

## 3.3 Repository structure should communicate product structure

Visible product features should generally be organised according to the visible
areas of the application.

For example, Assessment Creation can be understood visually as:

```text
┌──────────────────────── HeaderBar ─────────────────────────┐
│ Global navigation and application-wide controls           │
└────────────────────────────────────────────────────────────┘

┌───────────────────────── TopBar ───────────────────────────┐
│ Name │ Class │ Date │ Paper View │ Zoom │ Navigation     │
├────────────────────┬───────────────────────────────────────┤
│  01-SkillsFilters  │                                       │
├────────────────────┤                                       │
│                    │                                       │
│   02-SkillsTree    │            PaperWorkspace             │
│                    │                                       │
│                    │                                       │
├────────────────────┴───────────────────────────────────────┤
│                         HUDBar                             │
└────────────────────────────────────────────────────────────┘

The code structure should therefore broadly mirror that layout.

Conceptually:

Assessments/
└── Creation/
    ├── TopBar/
    ├── SkillsPanel/
    │   ├── 01-SkillsFilters/
    │   └── 02-SkillsTree/
    ├── PaperWorkspace/
    └── HUDBar/

This allows a developer to locate code by thinking about where the relevant
feature appears in the application.

3.4 Ownership is more important than usage

A file belongs to the domain which owns its responsibility, not every
feature which happens to use it.

For example:

Assessment Creation uses class information.
Assessment Creation does not own the Classes domain.
Class data therefore belongs under Classes.

Likewise:

Assessment Creation uses curriculum information.
Assessment Creation does not own curriculum information.
Curriculum information therefore belongs under Courses.

Likewise:

the Skills Tree displays course data;
the Skills Tree does not define the course curriculum;
the active Course owns the curriculum definition.

Usage does not determine ownership.

3.5 One source of truth

Where multiple parts of VecEd rely on the same information or behaviour, there
should normally be one authoritative source.

Particular attention should be paid to preventing duplication of:

theme state;
theme persistence;
typography;
colours;
spacing;
interaction behaviour;
course definitions;
Skills Tree definitions;
paper state;
assessment state;
question-generation rules;
paper timing;
persistence keys;
class data;
saved-assessment behaviour;
document-layout values;
assessment settings.

A source of truth should be owned by the appropriate domain.

3.6 Refactoring includes simplification

Architecture V2 is not merely a folder relocation project.

Whenever an area is migrated, the implementation should be reviewed for
simplification opportunities.

Potential simplification includes:

deleting dead files;
consolidating duplicated state;
consolidating duplicated data;
removing obsolete compatibility code;
removing redundant wrappers;
splitting oversized components;
merging unnecessarily fragmented files;
replacing invisible coupling with explicit relationships;
consolidating duplicate settings systems;
consolidating duplicate theme systems;
removing completed temporary migration tooling;
improving names which no longer describe actual responsibilities.

No file should survive merely because it existed before the refactor.

No file should be deleted merely because it appears unused.

Its imports, exports, runtime role and consumers must be understood first.

3.7 Behaviour preservation has priority

Architecture V2 must preserve the functionality which has already been built.

The refactor should not knowingly remove working behaviour unless the user has
explicitly approved the product change.

Refactoring may simplify implementation while preserving behaviour.

A cleaner architecture is not valuable if it destroys existing features.

3.8 Incremental migration over mass rewrite

Architecture V2 should be migrated gradually.

Do not move hundreds of files and then attempt to repair the entire application
afterwards.

Preferred process:

Understand bounded area
        ↓
Trace imports and exports
        ↓
Understand consumers
        ↓
Identify ownership
        ↓
Identify duplication/redundancy
        ↓
Define destination
        ↓
Move/refactor bounded group
        ↓
Repair dependencies
        ↓
Run verification
        ↓
Commit
        ↓
Continue

The repository should remain recoverable throughout the process.

4. Git Safety and Preservation

Architecture V2 exists within the existing repository.

A second replacement repository is not the primary refactor strategy.

The working architecture is protected through Git branching and external
backup.

Current conceptual branch roles:

main

represents the known-good working version of VecEd.

refactor/architecture-V2

is the active Architecture V2 development branch.

A frozen archive branch preserves the pre-refactor baseline.

A complete offline Windows copy provides an additional physical backup.

4.1 main

main should represent a version believed to work correctly.

Large architectural experiments should not be performed directly on main.

4.2 Architecture V2 branch

Architecture V2 work should occur on:

refactor/architecture-V2

until the refactor has been verified and is ready to merge.

4.3 Archive branch

The archive branch exists as a frozen reference point.

It should not be used as an active development branch.

4.4 Offline backup

The offline Windows backup is independent of GitHub.

It should remain untouched during normal development.

It exists as an emergency recovery source.

5. Repository-Level Architecture

The intended high-level repository structure is:

N5-Assessment-Tool/
│
├── src/
│   ├── app/
│   ├── Assessments/
│   ├── Classes/
│   ├── Courses/
│   └── UI/
│
├── Docs/
├── Tools/
├── public/
│
├── AGENTS.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── other required configuration files

Only implemented responsibilities should create physical folders.

Do not create empty speculative domains for potential future functionality.

6. The src Boundary

All migrated VecEd application source code should live beneath:

src/

src means source.

The purpose of src is to create a strong visual boundary between application
source code and repository-level infrastructure.

6.1 Inside src

Examples:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

These folders form the application architecture.

6.2 Outside src

Examples:

Docs/
Tools/
public/
package.json
tsconfig.json
next.config.ts

These are documentation, tooling, static assets and project infrastructure.

6.3 Why use src

The src boundary allows somebody opening the repository to understand:

If I want to understand the actual VecEd application, start here.

It also creates a clear target destination for Architecture V2 migrations.

6.4 src does not alter website URLs

src is an internal repository concept.

It does not appear in teacher-facing URLs.

For example:

src/app/create-assessment/workspace/page.tsx

may produce:

/create-assessment/workspace

not:

/src/app/create-assessment/workspace
7. Legacy Architecture During Migration

The pre-Architecture-V2 repository contains root-level source folders including:

app/
course-data/
math-helpers/
page-sections/
shared-types/
ui/

These folders are considered legacy source locations.

They remain temporarily because moving them simultaneously would create
unnecessary risk.

Their physical existence does not make them approved Architecture V2 structure.

7.1 Legacy code is migration input

When legacy structure conflicts with Architecture V2:

understand the old implementation;
preserve required behaviour;
identify the true owner;
migrate the responsibility into the correct V2 domain.

Do not change Architecture V2 simply to resemble the old repository.

7.2 Legacy architecture is hidden in the V2 workspace

During the refactor, legacy source folders may be hidden from the default VS
Code Architecture V2 workspace.

This is a visual workflow choice only.

It does not:

delete files;
move files;
alter imports;
alter Git;
alter Next.js behaviour.

Legacy folders may be revealed when required for migration work.

7.3 New architecture should not accumulate in legacy folders

New permanent responsibilities should not be created inside legacy root
folders.

Temporary compatibility modifications may be necessary while a migration is in
progress.

These temporary changes do not establish architectural precedent.

7.4 Legacy folders should progressively disappear

Expected migration direction:

app/             → src/app/ plus owned application domains
course-data/     → src/Courses/
ui/              → src/UI/
shared-types/    → types owned by actual domains
math-helpers/    → logic owned by actual domains
page-sections/   → appropriate product/UI owners

The old folders should disappear once their contents have been safely migrated.

8. Source Domains

The intended initial top-level source domains are:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

Do not introduce a new top-level source domain to solve a small local problem.

A new domain should represent a genuinely independent area of product
responsibility.

9. src/app — Routing Layer

src/app is the Next.js routing layer.

Its main responsibility is:

Define which URLs exist and connect those URLs to actual VecEd page
implementations.

It should not become the main home of product logic.

10. Next.js page.tsx Rule

Next.js requires route entry files to use reserved filenames such as:

page.tsx

These filenames are unavoidable.

However, substantial application implementation should not live inside them.

10.1 page.tsx should be thin

A typical route should delegate to a descriptively named page implementation.

Example:

src/app/create-assessment/workspace/page.tsx

may contain:

import AssessmentCreatorPage from "@/Assessments/Creation/AssessmentCreatorPage";

export default function Page() {
  return <AssessmentCreatorPage />;
}

The actual page implementation belongs at:

src/Assessments/Creation/AssessmentCreatorPage.tsx
10.2 Descriptive page implementations

Examples:

HomePage.tsx
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
AssessmentsLibraryPage.tsx
ClassesPage.tsx
ClassDetailsPage.tsx
10.3 Never refer ambiguously to page.tsx

Development instructions must never say only:

Change page.tsx.

Always specify either:

src/app/create-assessment/workspace/page.tsx

or preferably:

AssessmentCreatorPage.tsx

This rule exists because multiple page.tsx files exist throughout a Next.js
application.

11. Naming Philosophy

VecEd uses a deliberate naming vocabulary.

Names should prioritise:

readability;
discoverability;
consistency;
product meaning.

Names should not depend on historical implementation knowledge.

12. PascalCase Convention

VecEd-owned architectural folders and source files should use PascalCase
wherever practical.

Examples:

AssessmentCreatorPage.tsx
PaperWorkspace.tsx
AssessmentDateControl.tsx
QuestionSelection.ts
CourseRegistry.ts
SourceQuestionCatalog/
National5Maths/

PascalCase is intentionally chosen because it is visually easy to scan in a
large repository.

13. React Hook Naming

React hooks follow standard React naming conventions.

Examples:

useSkillsTreeState.ts
useQuestionWorkflow.ts
usePaperWorkspaceViewport.ts

Hooks therefore use:

useCamelCase

rather than PascalCase.

This is an intentional exception.

14. Next.js Route Naming

Route folders beneath src/app may use URL-friendly lowercase/kebab-case.

Examples:

create-assessment/
my-assessments/
my-classes/

These names influence public URLs and therefore follow web route conventions.

15. Ordered Folder Naming

Numbered folders are encouraged where order carries meaningful information.

Format:

01-Numerical
02-Algebraic
03-Geometric

or:

01-SkillsFilters
02-SkillsTree
15.1 Good numbering

Curriculum order:

01-Numerical
02-Algebraic
03-Geometric
04-Trigonometric
05-Statistical

Visible vertical order:

SkillsPanel/
├── 01-SkillsFilters/
└── 02-SkillsTree/
15.2 Numbering should not be decorative

Do not create arbitrary numbering merely to force an aesthetically pleasing
Explorer order.

Example to avoid:

01-Questions
02-Papers
03-Analysis
04-Persistence

unless those areas genuinely represent a meaningful sequence.

Numbers must communicate information.

16. Folder Context Should Reduce Filename Repetition

A filename should not repeat context already supplied by the folder.

Prefer:

TopBar/
├── TopBar.tsx
├── AssessmentNameField.tsx
├── ClassCoverageControl.tsx
├── PaperViewPill.tsx
├── ZoomControl.tsx
└── PageNavigationControl.tsx

Avoid:

TopBar/
├── TopBarAssessmentNameField.tsx
├── TopBarClassCoverageControl.tsx
├── TopBarPaperViewPill.tsx
├── TopBarZoomControl.tsx
└── TopBarPageNavigationControl.tsx

The folder already establishes that the files belong to TopBar.

16.1 Root component exception

The component representing the complete area may share the folder name.

Examples:

TopBar/TopBar.tsx
HUDBar/HUDBar.tsx
PaperWorkspace/PaperWorkspace.tsx
SkillsPanel/SkillsPanel.tsx
HeaderBar/HeaderBar.tsx
17. Avoid Generic Bucket Names

Avoid creating architectural folders or files named:

Helpers
Utils
Shared
Common
Misc
General
Stuff
Manager
Thing

These names often indicate unresolved ownership.

17.1 Why generic buckets are dangerous

A generic folder tends to accumulate unrelated files because it answers:

Where can I put this?

rather than:

Who owns this responsibility?

Over time such folders become difficult to reason about.

17.2 Example

A file called:

math-helpers/QuestionLogic.ts

may actually contain assessment-selection behaviour rather than generic maths
helpers.

In Architecture V2 such logic should move to the domain which genuinely owns
question selection.

17.3 Exceptions

A generic term may be used only when:

the responsibility is genuinely cross-domain;
no clearer owner exists;
the decision is deliberate;
the architectural reason is documented.

Generic folders must never become dumping grounds.

18. Small Coherent Files

VecEd intentionally favours small, coherent files where doing so improves
maintenance.

The objective is not to reduce every file below an arbitrary line count.

The objective is to isolate independently understandable responsibilities.

19. Good Component Decomposition

Example:

TopBar/
├── TopBar.tsx
├── AssessmentNameField.tsx
├── ClassCoverageControl.tsx
├── AssessmentDate/
│   ├── AssessmentDateControl.tsx
│   ├── AssessmentDatePicker.tsx
│   └── AssessmentDateFormatting.ts
├── PaperViewPill.tsx
├── ZoomControl.tsx
└── PageNavigationControl.tsx

If the PaperViewPill breaks, its code is immediately identifiable.

If the Assessment Date calendar breaks, the developer can navigate:

Assessments
→ Creation
→ TopBar
→ AssessmentDate

without searching unrelated files.

20. Avoid Meaningless Fragmentation

Do not split components simply to reduce line count.

Avoid structures such as:

PaperViewPillLabel.tsx
PaperViewPillText.tsx
PaperViewPillIcon.tsx
PaperViewPillBorder.tsx

unless those elements genuinely:

have independent behaviour;
are reused;
justify independent maintenance.

Small files should correspond to meaningful product responsibilities.

21. Subfolder Threshold

A single small file generally does not require its own folder.

Example:

TopBar/
└── PaperViewPill.tsx

If a feature has several closely related files, create a subfolder.

Example:

TopBar/
└── AssessmentDate/
    ├── AssessmentDateControl.tsx
    ├── AssessmentDatePicker.tsx
    └── AssessmentDateFormatting.ts

Avoid unnecessarily deep folder chains.

22. File Types

VecEd uses TypeScript, React TypeScript and Markdown documentation.

Understanding the distinction helps communicate responsibility.

22.1 .ts

A .ts file contains TypeScript without JSX requirements.

Typical responsibilities include:

domain logic;
calculations;
data structures;
types;
configuration;
persistence;
registries;
formatting;
algorithms.

Examples:

PaperTiming.ts
CourseRegistry.ts
QuestionSelection.ts
AssessmentTypes.ts
22.2 .tsx

A .tsx file can contain React JSX.

Typical responsibilities include:

visible interface components;
pages;
page regions;
controls;
React providers;
React composition.

Examples:

AssessmentCreatorPage.tsx
TopBar.tsx
PaperViewPill.tsx
SettingsDrawer.tsx
22.3 .md

A .md file is Markdown documentation.

Markdown is not normally executed as part of the application.

Its purpose is to preserve:

architecture;
decisions;
repository knowledge;
development workflow;
AI handoff instructions.

Examples:

Architecture.md
LockedDecisions.md
RepositoryMap.md
RefactorLedger.md
ChatGPTWorkflow.md
AGENTS.md
23. React Components

A React component is a unit of rendered interface.

A component can represent:

an entire page;
a substantial region;
a small meaningful control.

Examples:

AssessmentCreatorPage.tsx
TopBar.tsx
PaperWorkspace.tsx
PaperViewPill.tsx
AssessmentDatePicker.tsx

The fact that a file is a component does not determine where it belongs.

Ownership determines location.

23.1 No generic Components hierarchy for Assessment Creation

Architecture V2 does not use a generic Components/ folder as the main
Assessment Creation organisation.

For example, PaperViewPill.tsx belongs under:

TopBar/

because TopBar owns that visible feature.

The repository should optimise for locating product behaviour rather than
categorising all React files together.

24. React Hooks

Hooks coordinate React state or behaviour.

Examples:

useSkillsTreeState.ts
useQuestionWorkflow.ts
usePaperWorkspaceViewport.ts

Hooks should generally live close to the feature or domain which owns them.

Avoid a global generic Hooks folder.

25. Avoid Over-Fragmented Hook Architecture

The legacy project contains many UseBuilder... hooks.

Architecture V2 should review whether each remains an independent responsibility.

Extracting code from a large component into another hook does not automatically
reduce conceptual complexity.

Closely related behaviour may be better grouped into a coherent domain.

For example:

paper metadata
paper targets
paper timing
paper sitting state

may belong together under Papers rather than remaining a flat collection of
similarly named hooks.

The objective is conceptual organisation, not maximum file count.

26. Standard UI Vocabulary

VecEd uses an explicit vocabulary for interface concepts.

Future development should reuse these terms rather than inventing synonyms.

27. HeaderBar

HeaderBar means:

the global website header.

It contains application-wide navigation and global controls.

Examples:

VecEd logo;
Home;
Create Assessment;
My Assessments;
My Classes;
global Settings button.

The HeaderBar does not belong specifically to Assessment Creation.

28. TopBar

TopBar means:

the page-specific upper horizontal control area.

Within Assessment Creation it may contain:

assessment name;
class selection;
assessment date;
paper viewing;
zoom controls;
page navigation.

TopBar is not the global HeaderBar.

29. HUDBar

HUDBar means:

the page-specific lower information/control area.

It may contain persistent assessment-creation information and controls.

HUDBar is distinct from:

HeaderBar;
TopBar;
PaperWorkspace.
30. Panel

Panel means:

a substantial persistent interface region.

Examples:

SkillsPanel
ProgressPanel
31. Workspace

Workspace means:

the principal working or viewing surface.

The central assessment-paper area is:

PaperWorkspace
32. Drawer

Drawer means:

a substantial panel which opens from an edge of the interface.

Example:

SettingsDrawer
33. Popover

Popover means:

a smaller contextual panel anchored to a particular control.

Example:

SettingsPopover

A small workspace settings cog should generally open a Popover rather than a
second global Drawer.

34. Control

Control means:

an interactive interface element which changes a value or state.

Examples:

ZoomControl
ThinkingTypeControl
35. Filter

Filter means:

a control which restricts or selects the information relevant to a workflow.

Examples:

StandardFilter
TargetMarksFilter
ThinkingTypeFilter
36. Field

Field means:

an editable data-entry element.

Example:

AssessmentNameField
37. Pill

Pill means:

a compact pill-shaped state selector or control.

Example:

PaperViewPill
38. Button

Button means:

a discrete action.

Examples:

CompileButton
AddQuestionsButton
39. Picker

Picker means:

a dedicated selection interface.

Examples:

DatePicker
TimePicker
40. Status and Indicator

These terms describe interface elements which primarily display current state.

Examples:

SaveStatus
ConnectionIndicator
41. Modal

Modal means:

a blocking foreground dialog which temporarily takes interaction focus.

42. Avoid Vocabulary Drift

Do not casually introduce terms such as:

Tray
Flyout
Popup
MiniDrawer
Ribbon
Widget
Toolbar

when an existing VecEd term already accurately describes the interface.

If a genuinely new interaction pattern appears, its terminology should be
defined deliberately.

43. UI Architecture

All visual design sources of truth live under:

src/UI/

This is the single clear top-level location for VecEd visual design.

UI is divided into two major systems:

UI/
├── Application/
└── Documents/

These systems are related but intentionally distinct.

44. UI/Application

UI/Application owns the visual system of the VecEd software interface.

This includes concerns such as:

application colours;
application typography;
application spacing;
motion;
shadows;
border radii;
theme definitions;
interaction tokens;
global HeaderBar;
global SettingsDrawer;
reusable application-level visual primitives.
45. Application UI Single Source of Truth

Application-level visual decisions should come from a small number of
authoritative definitions wherever reasonable.

Examples include:

standard typography;
standard colours;
standard interaction transitions;
standard border radii;
shared spacing;
global control styles;
theme definitions.

The purpose is to make future redesign work manageable.

A global appearance change should not require manually finding dozens of
unrelated hard-coded values.

46. Local Visual Values Are Still Allowed

Not every unique measurement should become a global design token.

A measurement genuinely unique to one component may remain local.

Centralisation is appropriate when a value represents a reusable visual
decision.

Avoid creating an excessively abstract design system for one-off measurements.

47. Theme Architecture

VecEd should have one authoritative application theme architecture.

Legacy duplicated theme providers, theme-mode systems and persistence layers
should be reviewed and consolidated.

The intended principle is:

one theme definition
one theme state/provider
one theme persistence mechanism
one authoritative visual token system

Feature components consume theme information.

They should not create independent competing theme systems.

48. UI/Documents

UI/Documents owns the appearance of generated assessment documents.

This is deliberately distinct from the teacher-facing application UI.

Potential responsibilities include:

document typography;
page dimensions;
page margins;
question layout;
question numbering;
answer-space layout;
cover-page layout;
formula-sheet layout;
document spacing;
rendering primitives.
49. Application UI vs Document UI

Do not assume a button font and an assessment-paper font belong to the same
typography system.

Both systems belong beneath UI, but they serve different purposes.

Conceptually:

UI/
├── Application/
│   └── Typography/
└── Documents/
    └── Typography/

This keeps all visual code easy to locate while clearly distinguishing its
purpose.

50. Global HeaderBar Architecture

The global website header is:

HeaderBar

It belongs under:

src/UI/Application/HeaderBar/

Conceptually:

HeaderBar/
├── HeaderBar.tsx
├── Logo.tsx
├── Navigation.tsx
└── SettingsButton.tsx

The exact file structure should reflect the migrated implementation.

51. HeaderBar Responsibilities

HeaderBar owns:

global application navigation;
logo area;
active navigation presentation;
global Settings entry point.

HeaderBar should remain unaware of detailed page-specific implementation.

52. HeaderBar Must Not Control Assessment Creation Internals

The global HeaderBar should not contain hidden special-case logic such as:

If the current route is Assessment Creation, trigger a browser event which
opens a specific page settings panel.

Page-specific settings should be owned by the page.

Global settings should remain global.

Dependencies should be explicit.

53. Global SettingsDrawer

Global application settings are presented through:

SettingsDrawer

located under:

src/UI/Application/SettingsDrawer/

SettingsDrawer is a sibling responsibility to HeaderBar.

The button opening SettingsDrawer may live inside HeaderBar.

The drawer implementation itself does not.

54. Settings Ownership Principle

Settings live with the thing they modify.

Architecture V2 distinguishes at least three settings categories.

55. Global Application Settings

Owner:

UI/Application/SettingsDrawer

Examples:

theme;
appearance;
accent colour;
application-wide preferences.

These affect VecEd generally.

56. Assessment-Specific Settings

Owner:

Assessments/Creation/AssessmentSettings

Potential examples:

cover sheet;
formula sheet;
candidate number;
assessment document options;
assessment sitting information where appropriate.

The exact responsibilities should be established when the legacy Settings
implementation is mapped.

57. Workspace-Specific Settings

Owner:

Assessments/Creation/PaperWorkspace

Potential examples:

reset zoom;
reset layout;
workspace display behaviour;
workspace panel visibility.

A small workspace cog may open:

SettingsPopover

These settings should not be mixed into the global SettingsDrawer.

58. Assessments Domain

Assessment-related application functionality belongs under:

src/Assessments/

The Assessment domain should contain actual implemented assessment workflows.

Do not create speculative empty assessment feature folders.

59. Assessment Creation

The Assessment Creation experience belongs under:

src/Assessments/Creation/

The large legacy concept known as Builder is renamed conceptually.

Architecture V2 should move away from Builder terminology for newly migrated
code.

The overall screen becomes:

AssessmentCreatorPage.tsx
60. Legacy Builder Terminology

Legacy files may continue to contain names such as:

BuilderTopBar
BuilderUtils
BuilderStorageKeys

until they are migrated.

Do not perform a blind repository-wide Builder rename.

Each file should be renamed according to its actual responsibility during its
migration.

61. Assessment Creation Target Structure

The target conceptual structure is:

Assessments/
└── Creation/
    ├── AssessmentCreatorPage.tsx
    │
    ├── TopBar/
    │
    ├── SkillsPanel/
    │   ├── 01-SkillsFilters/
    │   └── 02-SkillsTree/
    │
    ├── PaperWorkspace/
    │
    ├── HUDBar/
    │
    ├── AssessmentSettings/
    │
    ├── Questions/
    ├── Papers/
    ├── Analysis/
    └── Persistence/

This tree is conceptual.

Additional meaningful subfolders may emerge during detailed mapping.

New folders should reflect genuine responsibilities rather than historical file
groupings.

62. AssessmentCreatorPage

AssessmentCreatorPage.tsx represents the entire Assessment Creation page.

It replaces the architectural role of the historical large Builder route
implementation.

Its purpose should be page-level composition and coordination.

It should not directly implement every feature.

Conceptually:

AssessmentCreatorPage
├── TopBar
├── SkillsPanel
├── PaperWorkspace
├── HUDBar
└── page-level coordination
63. Avoid Giant Page Orchestrators

The historical Assessment Creation route accumulated:

UI state;
class loading;
persistence;
paper state;
question generation;
preview behaviour;
analysis;
routing;
settings;
metadata;
viewport behaviour.

Architecture V2 should reduce this concentration substantially.

The page may coordinate important shared state, but meaningful subsystems should
have clear owners.

64. TopBar Architecture

Assessment Creation's upper control area is:

TopBar/

Potential structure:

TopBar/
├── TopBar.tsx
├── AssessmentNameField.tsx
├── ClassCoverageControl.tsx
├── AssessmentDate/
│   ├── AssessmentDateControl.tsx
│   ├── AssessmentDatePicker.tsx
│   └── AssessmentDateFormatting.ts
├── PaperViewPill.tsx
├── ZoomControl.tsx
└── PageNavigationControl.tsx

The exact migration should be based on current behaviour.

65. TopBar Ownership

TopBar owns visible controls physically located in the Assessment Creation upper
bar.

Examples:

assessment name;
selected classes;
assessment date;
P1/P2 viewing;
zoom;
page navigation.

TopBar does not own global navigation.

TopBar does not own curriculum data.

TopBar does not own shared paper-domain logic merely because it displays paper
state.

66. SkillsPanel

The entire left-hand Assessment Creation region is:

SkillsPanel/

This region contains:

01-SkillsFilters
02-SkillsTree

The ordering deliberately matches the physical screen.

67. SkillsPanel Physical Ordering

Folder order:

SkillsPanel/
├── 01-SkillsFilters/
└── 02-SkillsTree/

Visual order:

Skills Filters
      ↓
Skills Tree

This is an intentional architectural convention.

The repository should exploit meaningful ordering where doing so improves
navigation.

68. SkillsFilters

01-SkillsFilters owns the generic controls above the Skills Tree.

Potential files include:

SkillsFilters.tsx
IntroText.tsx
StandardFilter.tsx
TargetMarksFilter.tsx
ThinkingTypeFilter.tsx
AddQuestionsButton.tsx

The exact set should follow the existing interface.

69. SkillsFilters Does Not Own Course Curriculum

SkillsFilters may restrict or influence which course skills are available.

It does not define the skills themselves.

Educational data remains owned by the active Course.

70. SkillsTree UI

02-SkillsTree owns the generic visual rendering and interaction behaviour of
the Skills Tree.

Potential responsibilities include:

category display;
skill rows;
concepts;
difficulty controls;
selection state;
expand/collapse state;
course-driven rendering.
71. SkillsTree Is Course-Driven

The generic Skills Tree must not be implemented as a hard-coded National 5
Maths tree.

Conceptual dependency:

Active course
     ↓
CourseRegistry
     ↓
CourseDefinition
     ↓
SkillsTreeDefinition
     ↓
SkillsTree UI

The UI renders course information.

The Course defines the educational data.

72. PaperWorkspace

The central white assessment viewing/working region is:

PaperWorkspace

This term is intentionally chosen instead of:

PDFViewer
PDFWorkspace
BuilderPreview
PreviewEngine

because PaperWorkspace describes the teacher-facing purpose rather than the
current rendering implementation.

73. PaperWorkspace Future-Proofing

The workspace might currently resemble or ultimately generate PDF output.

That does not mean the architecture should depend on PDF terminology.

The implementation could later involve:

HTML rendering;
canvas rendering;
server-generated PDF;
browser print output;
another document renderer.

The product concept remains PaperWorkspace.

74. PaperWorkspace Responsibilities

Potential responsibilities include:

rendering paper pages;
displaying paper content;
viewport behaviour;
page positioning;
question-height measurement;
workspace zoom behaviour;
paper navigation;
workspace interaction;
workspace-specific controls;
workspace-specific settings.

The exact breakdown will be established from the legacy implementation.

75. WorkspaceControls

Controls physically associated with PaperWorkspace may live beneath:

PaperWorkspace/
└── WorkspaceControls/

Potential examples:

SaveStatusPill.tsx
WorkspaceSettings/
    SettingsButton.tsx
    SettingsPopover.tsx

If a control visibly belongs to the workspace, its implementation should not be
retained in HUDBar solely because legacy code placed it there.

76. HUDBar

The bottom Assessment Creation information/control area is:

HUDBar/

Potential structure:

HUDBar/
├── HUDBar.tsx
├── ViewModeControl.tsx
├── CompileButton.tsx
├── ProgressPanel.tsx
└── ResizeHandle.tsx

The exact final contents depend on the product design after migration.

77. Physical Area Organisation Has a Boundary

The physical-area architecture primarily applies to visible interface code.

Shared business logic should not be duplicated merely because several visible
regions use it.

For example:

TopBar may display current paper;
PaperWorkspace renders current paper;
HUDBar may display information about current paper.

These regions should consume shared paper state.

They should not independently maintain three competing current-paper states.

78. Shared Assessment Creation Domains

Shared behaviour may live under:

Questions/
Papers/
Analysis/
Persistence/

These folders represent shared responsibilities used by multiple visible
regions.

79. Questions Domain

General Assessment Creation question workflow belongs under:

Assessments/Creation/Questions/

Potential responsibilities include:

question selection;
question drafting;
question workflow;
generated-question coordination;
question editing;
placement into papers.
80. Course-Specific Question Logic Remains Course-Owned

The generic Assessment Creation Questions domain should not absorb all
National 5 Maths generation knowledge.

Course-specific generator families and educational generation data belong
within the Course.

Assessment Creation coordinates generation.

The Course defines the course-specific generator knowledge.

81. Papers Domain

Shared Assessment Creation paper behaviour belongs under:

Assessments/Creation/Papers/

Potential responsibilities include:

current paper;
paper configuration;
paper targets;
paper timing;
paper metadata;
sitting state;
per-paper derived values.
82. Paper State Should Not Be Fragmented Without Reason

The legacy implementation contains multiple paper-related hooks and maps.

Architecture V2 should review whether these represent true independent
responsibilities.

Where tightly related behaviour exists, it may be grouped behind a coherent
paper subsystem.

83. Analysis Domain

Assessment-quality and distribution analysis belongs under:

Assessments/Creation/Analysis/

Potential areas include:

TopicBalance.ts
StandardBalance.ts
CalculatorSuitability.ts
ThinkingBalance.ts
AssessmentDistribution.ts

Names should describe the thing being analysed.

Avoid generic names such as:

BuilderLogic

for clearly identifiable analytical responsibilities.

84. Persistence Domain

Assessment Creation persistence belongs under:

Assessments/Creation/Persistence/

Potential responsibilities include:

saving Assessment Creation state;
restoring state;
persistence keys;
serialisation;
compatibility handling;
legacy-key migration.
85. Persistence Must Not Be Scattered Through Visible UI

Avoid direct persistence calls throughout unrelated components where a clear
persistence owner can exist.

For example, visible controls should preferably communicate through a feature
state/persistence interface rather than each directly managing localStorage.

86. Preserve Existing Persisted Data

Architecture V2 is primarily a code architecture refactor.

It must not silently invalidate existing locally stored user data.

Renaming:

BuilderStorageKeys.ts

does not automatically justify renaming the underlying persisted keys.

Any persisted-data migration should be deliberate and separately verified.

87. Classes Domain

Class-related functionality belongs under:

src/Classes/

Potential responsibilities include:

class types;
class persistence;
class normalisation;
class-specific interfaces;
class coverage data;
class editing.

Assessment Creation may consume class information.

It does not own it.

88. Classes Must Not Remain Scattered Across Routes

Legacy code may currently place class code under:

app/my-classes/
app/components/
create-assessment/

Architecture V2 should migrate class-owned responsibilities into the Classes
domain.

Route files should expose class pages rather than own the complete class
implementation.

89. Courses Domain

Course-specific curriculum and assessment knowledge belongs under:

src/Courses/

This domain is fundamental to VecEd future-proofing.

Assessment Creation should be course-agnostic.

90. Assessment Creation Must Not Be “National 5 Maths Builder”

The correct conceptual model is:

Assessment Creation currently consumes the National 5 Maths course.

The incorrect conceptual model is:

The Builder is a National 5 Maths application.

This distinction allows future courses to use the same generic Assessment
Creation interface.

91. Course Registry

VecEd should have an authoritative way of resolving available courses.

Conceptually:

Courses/
├── CourseRegistry.ts
├── CourseDefinitionTypes.ts
└── National5Maths/

Later:

Courses/
├── CourseRegistry.ts
├── CourseDefinitionTypes.ts
├── National5Maths/
└── HigherMaths/
92. CourseDefinition

Each course should provide a coherent definition of the information generic
application systems require.

Conceptually:

National5Maths/
└── CourseDefinition.ts

Potential responsibilities may include references to:

course identity;
course display name;
course structure;
paper configuration;
Skills Tree definition;
relevant generators;
other course-specific capabilities.

Avoid allowing CourseDefinition itself to become a new giant dumping ground.

93. SkillsTreeDefinition

The Course owns the definition of its Skills Tree.

Conceptually:

National5Maths/
└── SkillsTree/
    ├── SkillsTreeDefinition.ts
    ├── 01-Numerical/
    ├── 02-Algebraic/
    ├── 03-Geometric/
    ├── 04-Trigonometric/
    └── 05-Statistical/
94. Ordered Curriculum Folders

Ordered curriculum folders intentionally use numbered names:

01-Numerical
02-Algebraic
03-Geometric
04-Trigonometric
05-Statistical

This ordering improves navigation and reflects meaningful curriculum grouping.

95. Course Data Owns Educational Meaning

Course data may define:

category identity;
category order;
skill IDs;
skill names;
concept IDs;
concept relationships;
generator family mappings;
assessment suitability;
course-specific semantic information.
96. Course Data Does Not Own Global Visual Design

Course data should not become the authoritative owner of literal application:

colours;
fonts;
border styles;
spacing;
animations.

If a curriculum category has a semantic identity, UI may map that identity to a
visual treatment.

Example conceptually:

Course:
category = Numerical

UI:
Numerical category appearance = defined visual treatment
97. Question Generation Architecture

Course-specific question-generation knowledge belongs with the Course.

Conceptually:

Courses/
└── National5Maths/
    └── QuestionGeneration/
        ├── 01-Numerical/
        ├── 02-Algebraic/
        ├── 03-Geometric/
        ├── 04-Trigonometric/
        └── 05-Statistical/

This should preserve the strong navigability already achieved in areas such as
the Numerical skill-family folders.

98. Answer Generation

Course-specific answer-generation logic belongs with the Course when it depends
on question families or curriculum semantics.

Conceptually:

Courses/
└── National5Maths/
    └── AnswerGeneration/

Document rendering remains separate from mathematical answer-generation logic.

99. SourceQuestionCatalog

Historical/official exam-question evidence should remain easy to locate.

A clearly named catalog such as:

SourceQuestionCatalog/

is considered a good architectural pattern.

The catalog should remain navigable by meaningful hierarchy such as:

course;
year;
paper;
question.
100. SourceMarkingSchemeCatalog

Historical marking-scheme evidence should similarly live under:

SourceMarkingSchemeCatalog/

This is considered a strong example of a descriptive folder name.

A new developer should immediately understand its purpose.

101. Avoid Awarding-Body-Specific Generic Architecture

Generic VecEd architecture should avoid unnecessarily embedding names such as:

SQA
QS
QualificationsScotland

into generic system infrastructure.

Prefer neutral concepts where possible.

Examples:

Exam
OfficialPastPaper
SourceQuestionCatalog
SourceMarkingSchemeCatalog
CandidateNumber
ExamTypography
ExamPageFrame
ExamCoverPage
102. Legacy Awarding-Body Names

Legacy code may contain awarding-body-specific names.

These should be reviewed individually during migration.

Do not perform a blind global rename if those values are:

persisted;
externally referenced;
part of IDs;
part of data contracts.

Migration should preserve compatibility.

103. Neutral Naming Does Not Resolve Legal Questions

Using neutral architecture terminology does not itself determine whether:

historical exam wording may be reproduced;
marking schemes may be reproduced;
layouts may be replicated;
logos may be used;
trademarks may be referenced.

Copyright, licensing and trademark review are separate launch considerations.

104. Data, Logic, State and Presentation

Architecture V2 should distinguish conceptually between four responsibility
types.

104.1 Data

Defines what information exists.

Examples:

Course definitions
Curriculum definitions
Source catalogs
Type definitions
104.2 Domain Logic

Defines rules and calculations.

Examples:

Question selection
Assessment distribution analysis
Paper target calculation
104.3 State and Behaviour

Coordinates changing application state and React behaviour.

Examples:

Current paper
Selected skills
Workspace viewport
Question workflow
104.4 Presentation

Defines what teachers see and interact with.

Examples:

HeaderBar
TopBar
SkillsPanel
PaperWorkspace
HUDBar

These responsibilities may be colocated where they belong to one small feature,
but their roles should remain conceptually clear.

105. Avoid Invisible Cross-Feature Coupling

Architecture V2 should avoid using hidden browser events as the default method
for communication between unrelated features.

Prefer explicit mechanisms such as:

props;
shared owned state;
context;
domain interfaces;
explicit callbacks.

Dependencies should be visible in the code.

106. Application Settings Should Not Know Page Internals

The global Settings system should not require knowledge of the current
Assessment Creation internals.

Likewise, Assessment Creation should not own global theme state.

Each setting belongs with the responsibility it affects.

107. Persistence Abstraction

Persistence should be owned through clearly named modules.

Architecture V2 should reduce unnecessary direct use of:

window.localStorage

throughout visible feature components.

This provides a future migration path if persistence later changes.

108. Architecture V2 Does Not Require a Database Migration

The current refactor is about architecture, not automatically moving VecEd to a
backend database.

Existing local persistence should continue working.

The architecture should merely make future storage changes possible without
rewiring the complete interface.

109. Tools Folder

Repository-level development utilities belong under:

Tools/

where they remain useful.

Examples may include:

migration scripts;
validation utilities;
catalog maintenance scripts;
temporary refactor tools.
110. Tools Are Not Product Architecture

Tools contains code which assists development or repository maintenance.

It should not contain normal teacher-facing runtime implementation.

Conversely, one-off maintenance scripts should not live under src.

111. Tools May Be Temporary

A tool may be deleted when:

its task is complete;
output has been verified;
it is not part of ongoing maintenance;
Git history preserves the previous implementation.

Do not keep obsolete migration utilities indefinitely.

112. public

Static web assets remain under:

public/

public is standard web application infrastructure.

It does not need to move beneath src.

113. Developer Tooling Inside the Application

If VecEd contains developer-only pages which actually run within the Next.js
application, their implementation may belong in an explicitly named internal
development area.

Do not confuse:

application developer tools

with:

repository maintenance Tools/

The distinction should be based on whether the code is part of the running
application.

114. Documentation System

Persistent architectural knowledge lives under:

Docs/

The intended documentation set is:

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md

with:

AGENTS.md

at repository root.

115. Architecture.md

This document defines:

architectural principles;
ownership;
naming;
source boundaries;
dependency philosophy;
long-lived structure.

This file should change relatively infrequently.

A change to Architecture.md generally means an architectural principle has
changed.

116. LockedDecisions.md

LockedDecisions.md records individual decisions already discussed and
approved.

Each decision should receive:

an ID;
a status;
a rule;
a rationale;
any explicit exceptions.

A decision marked:

LOCKED

must not be casually re-opened simply because another convention might also be
reasonable.

117. RepositoryMap.md

RepositoryMap.md records the practical current repository.

It should describe:

major folders;
what they own;
what they do not own;
important entry files;
current migration state.

RepositoryMap should be updated as the codebase physically changes.

118. RefactorLedger.md

RefactorLedger.md records Architecture V2 migration progress.

It should make it possible for a fresh development conversation to understand:

what has already moved;
what is being migrated;
what remains legacy;
which files are safe to delete;
what is still required for compatibility.
119. ChatGPTWorkflow.md

ChatGPTWorkflow.md contains reusable prompts and procedures for AI-assisted
development.

Potential workflow categories include:

new development conversation;
bug investigation;
feature discussion;
refactor planning;
refactor execution;
dead-code audit;
UI work;
course work;
repository handoff;
end-of-chat handoff.
120. AGENTS.md

AGENTS.md sits at repository root.

It contains mandatory startup and working instructions for developers and AI
assistants.

A fresh AI development conversation should be instructed to read AGENTS.md
before making repository changes.

121. Documentation Precedence

For project-specific architectural decisions, use this precedence:

explicit current user instruction;
AGENTS.md;
Docs/LockedDecisions.md;
Docs/Architecture.md;
Docs/RepositoryMap.md;
Docs/RefactorLedger.md;
legacy source implementation patterns.

Legacy code is not permitted to override an explicit Architecture V2 rule
merely because it existed first.

122. Locked Decisions Are Not Brainstorming Prompts

If a future developer or AI assistant reads a decision marked LOCKED, they
should treat it as settled architecture.

Do not automatically respond with alternative suggestions such as:

Another common convention would be...

unless a real technical problem has arisen.

If a locked decision genuinely causes a problem:

explain the conflict;
explain why the existing rule causes difficulty;
propose a specific alternative;
request explicit approval;
update documentation if approved.

Do not silently deviate.

123. Architecture Should Not Drift Through Local Fixes

A local bug fix must not introduce a new global architecture convention without
discussion.

Examples include:

creating a new top-level folder;
adding a generic Helpers folder;
introducing a new state library;
introducing a second theme provider;
inventing a second persistence strategy;
creating a new naming pattern.

Solve local problems within the established architecture where practical.

124. Future-Proofing Philosophy

Future-proofing does not mean physically creating every possible future domain.

Instead, future-proof through:

clear ownership;
stable dependency direction;
course independence;
explicit interfaces;
single sources of truth;
understandable folder boundaries.

These properties make future features easier to integrate.

125. No Speculative Empty Feature Folders

Do not create empty folders for hypothetical functionality such as:

AutoMarking/
Scanning/
AI/
Analytics/

until the feature is genuinely being developed.

Architecture should make future addition straightforward without cluttering the
current tree.

126. Future Courses

Future courses should be added as sibling Course implementations.

Example:

Courses/
├── National5Maths/
└── HigherMaths/

Generic Assessment Creation should consume the active CourseDefinition.

Adding Higher Maths should not require duplicating the complete Assessment
Creation system.

127. Generic UI Must Remain Course-Independent

Generic Assessment Creation components should avoid hard-coded logic such as:

if course is National5Maths...

where the difference can instead be represented through CourseDefinition data.

Prefer data-driven behaviour.

128. Do Not Prematurely Abstract

Architecture V2 should be extensible without becoming over-engineered.

Do not create a generic framework solely because a hypothetical feature may
require it later.

Build abstractions around real repeated requirements.

129. Simplification Checklist

Whenever an area is migrated, explicitly ask:

Does every current file still need to exist?
Is any file no longer imported?
Is any export unused?
Is state duplicated?
Is data duplicated?
Is styling duplicated?
Are two modules implementing the same responsibility?
Has historical compatibility code become obsolete?
Is the file named according to what it actually does?
Does the file live with its true owner?
Could a giant component be split into meaningful visible features?
Have previous splits created unnecessary fragmentation?
Is hidden coupling being used?
Is persistence implemented in visible components unnecessarily?
Is course-specific knowledge leaking into generic application code?

Simplification opportunities should be raised for discussion.

130. Deletion Rule

Never delete a file merely because:

its name looks old;
its folder looks redundant;
a code search appears empty.

Before deletion:

inspect the file;
trace imports;
trace exports;
trace dynamic access where relevant;
consider persisted compatibility;
consider route conventions;
consider build-time behaviour.

Once confidently redundant, deletion is encouraged.

131. Merge Rule

Files may be merged when their separation provides no meaningful maintenance
benefit.

Examples include multiple tiny state wrappers which always change together.

Merging should improve conceptual clarity.

Do not merge unrelated responsibilities merely to reduce file count.

132. Split Rule

Files should be split when they contain several independently understandable
features.

Examples:

A large TopBar containing:

date picker;
class selector;
zoom;
paper selection;
navigation;

is a strong candidate for decomposition.

The goal is discoverability.

133. Rename Rule

A file should be renamed when its existing name no longer describes its actual
responsibility.

Examples of legacy terms which should be reviewed include:

BuilderUtils
BuilderLogic
math-helpers
shared-types

Renames should communicate genuine ownership.

134. Move Rule

A file should move when its current location does not match its owner.

Examples:

class logic → Classes;
course data → Courses;
global appearance → UI/Application;
document typography → UI/Documents;
paper state → Assessments/Creation/Papers.
135. Migration Mapping Requirement

Before migrating a major area, produce a mapping containing:

CURRENT PATH
CURRENT PURPOSE
IMPORTS
EXPORTS
CONSUMERS
NEW OWNER
NEW PATH
ACTION

Actions may include:

KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN

No large migration should begin without understanding the mapping.

136. Refactor Verification

After each bounded migration:

run TypeScript checks;
run the application build;
test affected visible behaviour;
inspect Git diff;
ensure no accidental unrelated changes occurred;
commit the successful migration.

Do not stack many unverified migrations before testing.

137. Commit Philosophy

Architecture V2 commits should represent understandable migration steps.

Examples:

docs: establish Architecture V2 rules
refactor: establish HeaderBar architecture
refactor: consolidate global theme state
refactor: establish Assessment Creation TopBar
refactor: migrate SkillsFilters

Avoid one enormous final refactor commit containing the complete repository
reorganisation.

138. RepositoryMap Update Rule

Whenever a meaningful structural migration is completed, update:

Docs/RepositoryMap.md

so documentation reflects actual current locations.

139. RefactorLedger Update Rule

Whenever a migration stage begins or completes, update:

Docs/RefactorLedger.md

with:

current phase;
completed work;
pending work;
remaining legacy dependencies.
140. Architecture.md Update Rule

Do not update Architecture.md for every file move.

Architecture.md changes only when the architectural rule or design itself
changes.

141. Naming Vocabulary Change Rule

If a new UI concept requires a new standard term:

define it;
explain its meaning;
update Architecture.md;
update LockedDecisions.md if appropriate.

Do not allow terminology to evolve accidentally.

142. Assessment Creator vs PaperWorkspace

These terms refer to different levels.

AssessmentCreatorPage

means the complete Assessment Creation screen.

PaperWorkspace

means the central paper working/viewing region.

Do not use WorkspacePage to mean the entire Assessment Creation page if doing
so creates ambiguity with PaperWorkspace.

143. HeaderBar vs TopBar

These terms must remain distinct.

HeaderBar

is global.

TopBar

is Assessment Creation-specific.

A development instruction must not use one term for the other.

144. SettingsDrawer vs SettingsPopover

These terms must remain distinct.

SettingsDrawer

is the substantial global settings interface.

SettingsPopover

is a smaller contextual interface anchored to a specific control, such as
workspace settings.

145. SkillsFilters vs SkillsTree

These responsibilities are separate.

01-SkillsFilters

contains generic filter controls above the tree.

02-SkillsTree

contains the tree itself.

The folder ordering intentionally mirrors the UI.

146. Course SkillsTree vs Assessment SkillsTree UI

These are separate ownership concepts.

Course:

Courses/National5Maths/SkillsTree/

owns the curriculum definition.

Assessment Creation:

Assessments/Creation/SkillsPanel/02-SkillsTree/

owns the generic interface rendering/interaction.

Do not merge these responsibilities.

147. Course QuestionGeneration vs Assessment Question Workflow

These are also separate.

Course:

Courses/National5Maths/QuestionGeneration/

owns course-specific generator knowledge.

Assessment Creation:

Assessments/Creation/Questions/

owns the general workflow coordinating questions in an assessment.

148. UI Token Ownership

Global UI tokens belong under UI.

A feature should not create a parallel typography or colour system simply
because it needs a slightly different component.

Use shared tokens where the design decision is genuinely shared.

Use local values where the value is truly local.

149. Document Rendering Ownership

If the same document-rendering rule is used by:

PaperWorkspace preview;
compiled assessment;
answer display;

it should ideally have one shared owner under:

UI/Documents

rather than three diverging render implementations.

150. Preview Is Not Automatically an Owner

A legacy file may live in a preview folder because it was originally created
for the Builder preview.

During migration, ask whether it actually owns:

document rendering;
workspace interaction;
page measurement;
Builder-specific behaviour.

Move it according to the true responsibility.

151. Avoid Implementation-Technology Folder Names

Prefer product/domain names over temporary implementation names.

Examples:

Prefer:

PaperWorkspace

over:

PDFViewer

Prefer:

QuestionSelection

over:

MathHelpers

Prefer:

SettingsPopover

over:

PopupThing

Product concepts generally survive implementation changes better.

152. Assessment Compilation

Assessment compilation should be reviewed as its own responsibility during
migration.

If compilation represents a distinct stage of the assessment lifecycle, its
implementation should live under the Assessments domain rather than being
defined primarily by its route folder.

The final structure should be determined from actual current functionality.

153. Assessment Library

Saved assessment functionality belongs under the Assessments domain.

Route-level pages may expose the library.

The actual saved-assessment domain should not remain scattered solely under
Next.js route folders.

154. Saved Assessments Persistence

Saved assessment persistence should have an explicit owner.

Assessment Creation may save into the Assessment domain.

The creation interface should not become the authoritative owner of the entire
saved-assessment library.

155. Class Coverage

Class coverage should be reviewed according to ownership.

Generic class information belongs to Classes.

Assessment-specific selection of classes may belong to Assessment Creation.

Avoid duplicating the underlying class model.

156. Date and Time Logic

Date/time logic should be named according to its responsibility.

Avoid generic helper files if the logic specifically concerns:

assessment dates;
paper sitting times;
display formatting.

Small pure formatting functions may live near the feature using them if that
feature owns the convention.

157. Constants

Do not create giant generic constants files by default.

A constant should live close to the domain which owns it.

A small feature may have a clearly named constants module if several files
share those values.

Avoid:

GlobalConstants.ts

unless the constants are genuinely global.

158. Types

Types should generally live with the domain they describe.

Avoid a global shared-types dumping ground.

Examples:

Assessment types:

Assessments/...

Course types:

Courses/...

Class types:

Classes/...

Question-generation types:

with the appropriate question/course domain.

159. Cross-Domain Types

If a type genuinely defines a contract between major domains, it should be
placed with the domain which owns the contract or in an explicitly justified
contract location.

Do not default to moving it into a new generic SharedTypes folder.

160. Imports Should Reveal Ownership

Well-structured imports should tell a readable story.

Example:

Assessment Creation
imports
CourseDefinition
from Courses

This is preferable to importing curriculum files through obscure relative
paths or unrelated helper folders.

161. Import Aliases

Architecture V2 should use clean source aliases where appropriate.

Once src becomes the authoritative application source, the @/ alias should
resolve cleanly into src.

This makes imports resemble architectural ownership.

Example:

import CourseRegistry from "@/Courses/CourseRegistry";

instead of deeply nested relative traversal.

162. Avoid Excessive Barrel Files

Barrel exports such as index.ts should not be introduced everywhere by
default.

They may improve an intentionally public module boundary.

They may also obscure where a symbol actually originates.

Prefer direct imports unless a barrel file has a clear architectural purpose.

163. Public Module Boundaries

Where a domain exposes a stable set of functionality to other domains, an
explicit public API may be useful.

This should be introduced deliberately, not automatically.

The architecture should remain understandable from imports.

164. Circular Dependencies

Architecture V2 should avoid circular dependencies between major domains.

If two domains repeatedly depend upon each other, ownership likely needs to be
re-examined.

Example concern:

Courses → Assessments → Courses

The desired direction should generally remain clear.

165. Desired Dependency Direction

Conceptually:

Courses
   ↓
Assessment Creation
   ↑
Classes

UI
   ↓
visible application features

with domain-specific persistence and analysis beneath the owners which require
them.

The exact dependency graph may be richer, but ownership should remain
directional rather than circular.

166. UI Should Consume Domain State

UI components may consume domain state and behaviour.

UI should not redefine domain rules merely to display them.

Example:

PaperViewPill displays and changes paper selection.

It should not independently define what papers a course supports.

The active Course and Papers domain own that information.

167. Courses Should Not Import Assessment Creation UI

Course definitions should remain usable independently of the Assessment
Creation visual implementation.

Avoid dependencies from course data into page-specific components.

168. Documents Should Not Depend on Application Chrome

Generated document styling should remain independent of application chrome.

UI/Documents should not require:

HeaderBar;
SettingsDrawer;
application navigation.
169. Architecture V2 Workspace Convention

The dedicated VS Code Architecture V2 workspace is a development convenience.

Legacy folders are hidden by default to create a cleaner working environment.

This workspace configuration is not itself the application architecture.

Opening the raw repository should still reveal all files.

170. Clean-Slate Protocol

During Architecture V2:

src represents the new architecture;
legacy source remains functional outside src;
migration proceeds inward to src;
Docs represent architectural memory;
Tools represent temporary development/migration support;
source code is not duplicated into a second full V2 repository.
171. Rejected: Separate V2 Project Copy as Primary Strategy

Architecture V2 should not be built as a completely separate duplicated
application folder/repository such as:

N5-Assessment-Tool/
N5-Assessment-Tool-V2/

as the primary workflow.

Reason:

duplicate source of truth;
difficult synchronisation;
weaker Git history;
uncertainty about which project is authoritative;
unnecessary migration risk.

The Git branch and src boundary provide the clean-slate environment instead.

172. Rejected: Physically Move All Legacy Code into Legacy/ Immediately

Moving:

app/
course-data/
ui/
shared-types/

into:

Legacy/

at the start of the refactor was deliberately rejected.

Reason:

app has Next.js routing significance;
imports would immediately break;
hundreds of unrelated paths might need repair at once;
risk would increase before the actual architecture work begins.

Legacy code therefore remains physically in place temporarily.

173. Rejected: Generic Components as Primary Assessment Creation Tree

A structure such as:

AssessmentCreation/
└── Components/
    ├── ...

was deliberately not selected as the primary organisation.

Reason:

the user should be able to locate visible functionality by thinking about the
physical interface.

Therefore:

TopBar/
SkillsPanel/
PaperWorkspace/
HUDBar/

are the preferred primary visible-area owners.

174. Rejected: Builder as Permanent Product Terminology

The historical Builder terminology is considered too implementation-oriented
and overly repeated throughout the current codebase.

Architecture V2 uses:

AssessmentCreatorPage
Assessment Creation

and physical region terminology instead.

Legacy Builder names disappear progressively through migration.

175. Rejected: PDFWorkspace

The central assessment area should not be named according to a specific file
format.

PaperWorkspace is preferred because it describes the teacher's working
concept.

176. Rejected: Global Settings Owning Workspace Settings

Workspace settings should not remain inside global Settings simply because
legacy UI grouped them together.

Settings ownership follows the responsibility affected.

177. Rejected: Premature Future Feature Placeholders

Empty folders for hypothetical future features are not part of Architecture V2.

Future-proofing comes from ownership and dependency design rather than empty
directory scaffolding.

178. New Feature Development During Refactor

Major new feature development should generally pause while Architecture V2 is
being established.

This prevents the legacy architecture from continuing to expand while it is
being dismantled.

Exceptions require explicit user approval.

179. Refactor Opportunity Rule

Whenever a migration reveals an opportunity to materially simplify VecEd, the
developer or AI assistant should raise it.

The change should not be implemented silently if it alters significant
behaviour or architecture.

Present:

opportunity;
benefit;
risk;
migration implications.

Then discuss before proceeding.

180. Dead Code Rule

If code appears unwired:

inspect it;
search imports;
search exports;
search dynamic references;
inspect related state/persistence;
determine whether it remains needed.

If genuinely dead, deletion is preferred over carrying obsolete source into
Architecture V2.

181. Duplicate Code Rule

When two files perform the same task:

determine the correct owner;
determine which implementation is authoritative;
consolidate where safe.

Do not preserve duplicate implementations merely because different legacy
features imported each one.

182. Duplicate Data Rule

The same domain data should not be manually replicated in multiple locations.

Examples:

curriculum skill definitions;
course information;
typography;
theme colours;
paper configuration.

One owner should define the data.

Consumers import or derive it.

183. Duplicate State Rule

Multiple state systems representing the same concept should be consolidated.

Particular attention should be paid to:

theme state;
settings state;
current paper;
saved-assessment state;
Builder/Assessment Creation metadata.
184. Development Conversation Handoff

The repository documentation is designed to prevent every new ChatGPT
conversation from performing a complete archaeology scan.

A new conversation should begin by reading:

AGENTS.md
Docs/LockedDecisions.md
Docs/Architecture.md
Docs/RepositoryMap.md
Docs/RefactorLedger.md

before modifying code.

185. Repo Scans Still Have a Role

Documentation does not eliminate the need to inspect actual implementation.

A fresh development conversation should:

read architectural documentation;
inspect the target area;
trace relevant dependencies.

It should not need to rediscover the entire architectural philosophy from
source alone.

186. Architecture Documentation Is Persistent Memory

Source code explains:

how VecEd currently works.

Git explains:

how VecEd changed.

Architecture documentation explains:

why VecEd is organised this way.

All three are required for maintainability.

187. Architecture Change Procedure

If an architectural rule must change:

identify the existing rule;
explain why it no longer works;
discuss alternatives;
obtain explicit approval;
update LockedDecisions.md;
update this document;
update RepositoryMap if physical structure changes;
execute the migration deliberately.

Do not allow architecture to change invisibly through one implementation task.

188. Architecture V2 Success Criteria

Architecture V2 is successful when:

the legacy root source architecture has been migrated or removed;
application source lives beneath src;
major domains have clear ownership;
generic bucket folders have been eliminated or explicitly justified;
page.tsx files are thin route wrappers;
Assessment Creation is organised by clear visible regions and shared domains;
the global HeaderBar is distinct from Assessment Creation TopBar;
global Settings are distinct from workspace and assessment settings;
UI has clear Application and Documents systems;
duplicate theme architecture has been consolidated;
course definitions drive the Skills Tree;
Assessment Creation is not hard-coded to National 5 Maths;
source exam catalogs remain clearly navigable;
major redundant files have been removed;
persistence remains compatible;
documentation accurately describes the repository;
a fresh developer can locate a visible feature without knowing project
history;
a fresh AI-assisted development conversation can continue work after reading
repository documentation.
189. Long-Term Architectural Standard

Architecture V2 should not be viewed as a one-time clean-up after which
architectural discipline ends.

The standards established here should govern future VecEd development.

Every new feature should answer:

Who owns this?
Where does that owner live?
Is there already a source of truth?
Is this UI or domain logic?
Is this course-specific or generic?
Is this application appearance or document appearance?
Does this file name communicate its purpose?
Does its folder path communicate its context?
Does this introduce duplication?
Does this create a generic dumping ground?
Does this violate a locked decision?

If these questions are answered consistently, the repository should remain
manageable as VecEd grows.

190. Final Architectural Principle

VecEd Architecture V2 should make the obvious location for a piece of code also
be the correct location.

A developer should not need to memorise historical quirks.

If the teacher sees a broken control in the TopBar, start in:

Assessments/Creation/TopBar

If the Skills Tree is wrong, distinguish:

Assessment UI problem
→ Assessments/Creation/SkillsPanel/02-SkillsTree

from:

course curriculum problem
→ Courses/<ActiveCourse>/SkillsTree

If the global colour scheme is wrong, start in:

UI/Application

If generated assessment typography is wrong, start in:

UI/Documents

If historical exam question data is wrong, start in:

Courses/<Course>/SourceQuestionCatalog

If class data is wrong, start in:

Classes

The repository should teach its own architecture through its names.

That is the central goal of Architecture V2.

191. Status of This Document

This document represents the current Architecture V2 design agreed before the
main source migration begins.

Where detailed file-level analysis later reveals that a specific implementation
requires refinement, the existing architectural principles should be preserved
unless an explicit architectural change is approved.

Implementation should adapt to architecture.

Architecture should not drift merely to accommodate legacy accidents.

192. Relationship to LockedDecisions.md

This document explains the architecture in depth.

LockedDecisions.md will provide a more rigid decision-by-decision register.

Where a rule appears in both documents, LockedDecisions.md should make clear
whether the decision is formally locked.

Developers and AI assistants should read both.

193. Relationship to RepositoryMap.md

This document describes the intended architecture.

RepositoryMap.md describes the repository as it actually exists at the
current stage of migration.

During Architecture V2 these may temporarily differ.

For example:

Architecture.md may say:

HeaderBar belongs in src/UI/Application/HeaderBar

while RepositoryMap may temporarily report:

HeaderBar migration pending; legacy implementation remains under
page-sections/AppShellTopBar.tsx

This difference is expected during migration.

194. Relationship to RefactorLedger.md

RefactorLedger.md records the sequence and status of migration work.

Architecture.md should not become a chronological project diary.

RefactorLedger owns migration history and current progress.

195. Relationship to AGENTS.md

AGENTS.md defines the mandatory working protocol.

It tells future developers and AI assistants which documents to read and which
checks to perform before modifying VecEd.

Architecture.md defines the system they must respect.

196. Relationship to ChatGPTWorkflow.md

ChatGPTWorkflow.md contains standard prompt templates and AI-development
procedures.

It exists to make handoff between development conversations predictable.

It does not replace Architecture.md.

197. Documentation Maintenance Philosophy

Documentation should be detailed enough to prevent architectural knowledge from
depending upon one person's memory.

However, documentation should not be updated for trivial implementation details.

Update documentation when:

ownership changes;
significant folders move;
a naming rule changes;
a major architectural area is introduced;
a locked decision changes;
migration status changes.
198. Source Comments vs Documentation

Source comments should explain local implementation decisions.

Architecture.md explains repository-wide principles.

Do not use extensive source comments as a substitute for architecture
documentation.

Do not use Architecture.md to document every line of source implementation.

199. Principle of Intentionality

Every major folder should exist for a reason.

Every major file should have a meaningful owner.

Every new abstraction should solve a real problem.

Every shared system should have one authoritative source.

Every deviation from established conventions should be deliberate.

The purpose of Architecture V2 is intentionality.

200. Architecture V2 Motto

When deciding where new code belongs:

Organise by what the product is, not by how the code happened to be written.

When deciding whether to create another abstraction:

Prefer clarity over cleverness.

When deciding whether to preserve legacy structure:

Preserve behaviour, not historical accidents.

When deciding whether a future feature requires restructuring:

Good ownership today should make tomorrow's extension ordinary.
