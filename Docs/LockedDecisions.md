# VecEd Locked Decisions

**Document type:** Binding architectural decision register  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** All VecEd development unless an explicit current user instruction changes a decision  
**Primary purpose:** Prevent previously settled architectural decisions from being accidentally reinterpreted, replaced or re-litigated by future development conversations

---

# 1. Purpose of This Document

This document records architectural and development decisions which have already
been discussed and approved for VecEd Architecture V2.

These decisions are not brainstorming prompts.

They are not suggestions.

They are not examples of one possible way to organise the repository.

Unless explicitly stated otherwise, every decision in this document is:

**LOCKED**

A future developer or AI assistant must not replace a locked decision merely
because another convention might also be common, fashionable, technically
valid or personally preferred.

Architecture V2 exists partly because the project was developed across many
separate conversations and architectural assumptions were repeatedly
reconstructed from incomplete context.

This file is intended to prevent that from happening again.

---

# 2. Meaning of `LOCKED`

A decision marked:

```text
Status: LOCKED

means:

the issue has already been considered;
a direction has been deliberately chosen;
future implementation should follow that direction;
alternative conventions should not be proposed merely for variety;
source code which conflicts with the decision should normally be migrated
toward the decision rather than used as evidence against it;
the decision may only be changed through the explicit architectural change
process defined below.
3. Locked Decisions Are Not Absolute Technical Prohibitions

A locked architectural decision may eventually prove unsuitable because of:

a framework constraint;
a newly discovered technical limitation;
a significant product change;
a major new requirement;
evidence that the existing decision would create material technical harm.

If this happens, do not silently violate the decision.

Instead:

identify the exact locked decision;
explain the newly discovered conflict;
explain the consequences of preserving the existing decision;
propose a specific alternative;
obtain explicit user approval;
update this file if the decision changes;
update Architecture.md where necessary;
update RepositoryMap.md if physical ownership changes.

Until that process occurs, the existing decision remains authoritative.

4. Documentation Precedence

For VecEd-specific architectural decisions, use the following precedence:

explicit instruction from the user in the current conversation;
AGENTS.md;
Docs/LockedDecisions.md;
Docs/Architecture.md;
Docs/RepositoryMap.md;
Docs/RefactorLedger.md;
current implementation details in source code;
historical implementation conventions.

Legacy source code is not architectural precedent.

If legacy implementation conflicts with an explicit Architecture V2 decision,
treat the legacy implementation as migration input.

5. Decision Format

Each decision contains:

an identifier;
a status;
a rule;
a rationale;
important consequences;
exceptions where applicable.

Decision IDs are permanent.

If a decision is later replaced, retain the original decision entry and mark it
as superseded rather than reusing its ID.

PART I — REFACTOR PURPOSE AND SAFETY
LD-001 — Architecture V2 is a deliberate repository-wide refactor

Status: LOCKED

Rule

VecEd Architecture V2 is not a cosmetic folder clean-up.

It is a deliberate restructuring of:

ownership;
naming;
dependencies;
UI organisation;
course organisation;
settings ownership;
persistence ownership;
state organisation;
document styling;
application styling;
development documentation.
Rationale

The legacy repository accumulated successfully functioning features without a
single consistent architecture.

Simply moving the existing files into prettier folders would preserve the
underlying ownership problems.

Consequence

Every significant migration should ask whether the existing implementation
should be:

kept;
moved;
renamed;
split;
merged;
simplified;
deleted.
LD-002 — Preservation of existing working behaviour is acceptance criterion zero

Status: LOCKED

Rule

Architecture V2 must preserve existing working VecEd behaviour unless the user
explicitly approves a product behaviour change.

Rationale

The purpose of the refactor is to improve maintainability, not sacrifice
features which already work.

Consequence

A cleaner implementation which unintentionally removes working behaviour is not
a successful migration.

LD-003 — No mass repository rewrite

Status: LOCKED

Rule

Architecture V2 must be migrated in bounded, verifiable stages.

Do not move the entire repository and repair it afterwards.

Required sequence

For each substantial migration:

inspect the current implementation;
trace dependencies;
establish ownership;
identify simplification opportunities;
define the V2 destination;
migrate a bounded area;
repair imports and dependencies;
verify behaviour;
run relevant build/type checks;
commit the successful stage.
Rationale

Small migrations reduce risk and make regressions attributable to specific
changes.

LD-004 — Refactoring may reduce the amount of code

Status: LOCKED

Rule

Architecture V2 is allowed and encouraged to:

delete dead code;
remove duplicate implementations;
merge redundant files;
remove obsolete wrappers;
consolidate state;
consolidate persistence;
simplify complicated implementation.
Rationale

The goal is not to preserve historical file count.

The goal is a smaller and clearer implementation where possible.

LD-005 — No file is deleted merely because it appears unused

Status: LOCKED

Rule

Before deleting a legacy file, its role must be investigated.

At minimum, check:

imports;
exports;
consumers;
dynamic access where relevant;
framework conventions;
persistence compatibility where relevant.
Rationale

Apparently unused code may still participate in runtime, build-time, routing or
stored-data behaviour.

LD-006 — Dead code should not be carried into Architecture V2

Status: LOCKED

Rule

Once a file or implementation has been confidently established as genuinely
dead or obsolete, prefer deleting it over migrating it into the new
architecture.

Rationale

Architecture V2 should not institutionalise historical debris.

LD-007 — Major new feature development pauses during the core architecture refactor

Status: LOCKED

Rule

Do not resume substantial new product feature work while the Architecture V2
refactor is being established unless the user explicitly changes this
priority.

Rationale

Continuing to expand the legacy structure while dismantling it creates moving
targets and additional migration work.

PART II — GIT AND PRESERVATION
LD-008 — Architecture V2 remains in the existing Git repository

Status: LOCKED

Rule

The refactor remains inside the existing:

N5-Assessment-Tool

repository.

Do not create a completely separate replacement repository as the normal V2
development strategy.

Rationale

Keeping V2 within the same Git history preserves:

provenance;
commit history;
comparison;
rollback;
traceability.
LD-009 — refactor/architecture-V2 is the active refactor branch

Status: LOCKED FOR THE CURRENT REFACTOR**

Rule

Architecture V2 development occurs on:

refactor/architecture-V2

until a deliberate branch/merge decision changes this.

Consequence

Before significant source changes, confirm the active branch.

LD-010 — main represents known-good VecEd

Status: LOCKED

Rule

Do not perform the Architecture V2 refactor directly on main.

main represents the known-good application and becomes the destination only
when migrated work is considered ready.

LD-011 — The pre-refactor archive branch is frozen

Status: LOCKED

Rule

The archive branch exists as a preservation snapshot.

Do not use it for normal development.

Do not rewrite it casually.

LD-012 — The offline Windows copy is a preservation layer

Status: LOCKED

Rule

The user's manually copied project directory is an additional offline backup.

Normal Architecture V2 development must not rely on modifying that backup.

LD-013 — Architecture V2 should use incremental commits

Status: LOCKED

Rule

Successful bounded migrations should receive their own understandable commits.

Examples:

docs: establish Architecture V2 rules
refactor: establish HeaderBar architecture
refactor: consolidate application theme state
refactor: migrate Assessment Creation TopBar
Rejected alternative

One enormous commit containing the entire repository reorganisation.

PART III — CLEAN-SLATE PROTOCOL
LD-014 — Architecture V2 grows under src

Status: LOCKED

Rule

The authoritative destination for migrated application source is:

src/
Rationale

src creates a clear boundary between the application and repository
infrastructure.

LD-015 — Do not create N5-Assessment-Tool-V2 as a duplicate working application

Status: LOCKED

Rule

Do not maintain two complete project copies such as:

N5-Assessment-Tool/
N5-Assessment-Tool-V2/

as the normal refactor strategy.

Rejected because

This would create:

two competing sources of truth;
synchronisation problems;
confusion over which implementation is current;
weaker Git rename/history continuity;
greater risk of fixes being applied to only one copy.
LD-016 — The existing root source structure is legacy architecture

Status: LOCKED

Rule

The following historical root-level source locations are considered legacy
during migration:

app/
course-data/
math-helpers/
page-sections/
shared-types/
ui/

Their presence is transitional.

They are not approved permanent Architecture V2 locations.

LD-017 — Legacy source remains physically in place until migrated

Status: LOCKED

Rule

Do not move all legacy source immediately beneath a physical Legacy/ folder.

Rationale

Doing so would immediately disrupt:

Next.js routing;
import paths;
aliases;
runtime dependencies.
Rejected structure
Legacy/
├── app/
├── course-data/
├── shared-types/
└── ui/

as an initial mechanical operation.

LD-018 — Legacy source is hidden visually rather than relocated prematurely

Status: LOCKED FOR CURRENT REFACTOR WORKFLOW**

Rule

The Architecture V2 VS Code workspace may hide legacy folders through
files.exclude.

This is a development-view convenience only.

It must not
delete legacy source;
move source;
affect Git;
affect Next.js;
affect imports.
LD-019 — src is the clean-slate construction area

Status: LOCKED

Rule

New Architecture V2 implementation should progressively appear beneath src
as bounded responsibilities are migrated.

Legacy source shrinks while src grows.

LD-020 — Do not duplicate migrated source indefinitely

Status: LOCKED

Rule

Migration should normally move/refactor responsibilities rather than create
permanent V1 and V2 copies of the same implementation.

Temporary adapters are allowed when technically necessary.

Temporary duplication must have an intended removal path.

PART IV — TOP-LEVEL REPOSITORY STRUCTURE
LD-021 — Target application source domains

Status: LOCKED

Rule

The intended core top-level application source structure is:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

Only genuine implemented domains should physically exist.

LD-022 — Do not create new top-level domains casually

Status: LOCKED

Rule

A new folder directly beneath src requires a genuinely independent
architectural responsibility.

Do not create new top-level source domains merely to solve a small local
problem.

LD-023 — No speculative future feature domains

Status: LOCKED

Rule

Do not create empty folders for features not currently being implemented.

Examples which must not be added merely for future-proofing include:

Scanning/
AutoMarking/
AI/
Analytics/
Rationale

Future-proofing comes from good ownership and dependency design, not empty
directory scaffolding.

LD-024 — Repository documentation lives in Docs

Status: LOCKED

Rule

Persistent project architecture and workflow documentation lives under:

Docs/

Current planned documentation:

Architecture.md
LockedDecisions.md
RepositoryMap.md
RefactorLedger.md
ChatGPTWorkflow.md
LD-025 — AGENTS.md lives at repository root

Status: LOCKED

Rule

AGENTS.md must remain at repository root rather than inside Docs.

Rationale

It is the mandatory entry-point instruction file for development agents and AI
assistants.

LD-026 — public remains a repository-root infrastructure folder

Status: LOCKED

Rule

Do not move standard Next.js static assets beneath src merely for structural
symmetry.

public/ remains at repository root.

LD-027 — Repository maintenance tooling belongs under root Tools

Status: LOCKED

Rule

One-off or repository-level:

migration scripts;
validation scripts;
maintenance scripts;
catalogue-processing utilities;

belong under:

Tools/

when they need to remain available.

LD-028 — Runtime developer features and repository Tools are different concepts

Status: LOCKED

Rule

A developer-only feature which runs inside the application is not the same
thing as a repository maintenance script.

Do not place runtime application implementation in root Tools.

PART V — NAMING CONVENTIONS
LD-029 — PascalCase is the default VecEd architectural naming convention

Status: LOCKED

Rule

VecEd-owned architectural source folders and descriptive source filenames use
PascalCase wherever practical.

Examples:

Assessments
PaperWorkspace
National5Maths
AssessmentCreatorPage.tsx
CourseRegistry.ts
LD-030 — React hooks use conventional useCamelCase

Status: LOCKED

Rule

Hooks use names such as:

useSkillsTreeState.ts
useQuestionWorkflow.ts

rather than PascalCase filenames.

LD-031 — Next.js URL route folders may remain lowercase/kebab-case

Status: LOCKED

Rule

Route directories which directly define URL segments may use names such as:

create-assessment
my-assessments
my-classes

This is an intentional exception to PascalCase.

LD-032 — Number folders only when order is meaningful

Status: LOCKED

Rule

Number prefixes are permitted when they communicate genuine:

curriculum order;
visual order;
domain sequence.

Examples:

01-Numerical
02-Algebraic

and:

01-SkillsFilters
02-SkillsTree
LD-033 — Do not use decorative numbering

Status: LOCKED

Rule

Do not number unrelated sibling domains merely to force Explorer sorting.

Rejected example:

01-Questions
02-Papers
03-Analysis
04-Persistence

when no semantic sequence exists.

LD-034 — Ordered folder format uses number-hyphen-name

Status: LOCKED

Rule

Use:

01-Numerical

rather than:

01 - Numerical
01_Numerical
1.Numerical
LD-035 — Folder context should reduce filename repetition

Status: LOCKED

Rule

Prefer:

TopBar/PaperViewPill.tsx

rather than:

TopBar/TopBarPaperViewPill.tsx
LD-036 — Root region components may share their folder name

Status: LOCKED

Rule

The main component representing a region may use:

TopBar/TopBar.tsx
HUDBar/HUDBar.tsx
PaperWorkspace/PaperWorkspace.tsx
HeaderBar/HeaderBar.tsx

This is not considered redundant repetition.

LD-037 — Generic bucket folders are prohibited by default

Status: LOCKED

Rule

Do not create broad dumping-ground folders named:

Helpers
Utils
Shared
Common
Misc
General

without explicit architectural justification.

LD-038 — Existing generic legacy buckets should be dismantled by ownership

Status: LOCKED

Rule

Legacy areas such as:

shared-types/
math-helpers/

should not simply be recreated beneath src.

Their files should be reassigned to the domains which actually own them.

LD-039 — Types live with the domains they describe

Status: LOCKED

Rule

Do not recreate a global generic SharedTypes dumping ground.

Examples:

assessment types → Assessments;
course types → Courses;
class types → Classes;
question-generation types → appropriate question/course owner.
LD-040 — Constants live with their owners

Status: LOCKED

Rule

Do not create a giant generic global constants file unless the constants are
genuinely global.

Feature/domain constants should normally live close to their owner.

PART VI — FILE DECOMPOSITION
LD-041 — Small coherent files are preferred

Status: LOCKED

Rule

A meaningful independently understandable feature should generally have its own
file.

Examples:

AssessmentNameField.tsx
PaperViewPill.tsx
ZoomControl.tsx
StandardFilter.tsx
LD-042 — Line count alone does not justify a split

Status: LOCKED

Rule

Do not create micro-files simply because a source file has become long.

A split should correspond to meaningful responsibility.

LD-043 — Do not create a subfolder for every single file

Status: LOCKED

Rule

A single simple responsibility can remain directly in its owning folder.

Create a named subfolder when a feature develops multiple closely related
files.

LD-044 — Large visible regions should be decomposed by recognisable features

Status: LOCKED

Rule

Large UI components containing several independently understandable controls
should be split accordingly.

Example:

A large TopBar should not remain one enormous file if it contains:

assessment name;
class controls;
date controls;
paper selector;
zoom;
navigation.
LD-045 — Over-fragmented hooks should be reconsidered

Status: LOCKED

Rule

Architecture V2 must not assume every historical UseBuilder... hook deserves
to survive independently.

Related behaviour may be reorganised into coherent domain ownership.

PART VII — NEXT.JS ROUTING
LD-046 — src/app is the routing/framework layer

Status: LOCKED

Rule

Substantial product implementation should live outside src/app where
appropriate.

src/app primarily connects URLs and Next.js conventions to descriptive
application page implementations.

LD-047 — page.tsx must remain thin

Status: LOCKED

Rule

A substantial page must not be implemented primarily inside a giant Next.js
page.tsx.

page.tsx should normally delegate to a descriptively named implementation.

LD-048 — Every substantial page gets a descriptive implementation name

Status: LOCKED

Examples
HomePage.tsx
AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx
AssessmentsLibraryPage.tsx
ClassesPage.tsx
ClassDetailsPage.tsx
LD-049 — Never give ambiguous page.tsx instructions

Status: LOCKED

Rule

Never instruct a developer to:

Edit page.tsx.

without a complete route path.

Prefer referring to the descriptive page implementation.

LD-050 — Moving root app to src/app happens deliberately, not as the first migration

Status: LOCKED FOR THE CURRENT REFACTOR STRATEGY**

Rule

The existing root app/ remains responsible for routing during early
Architecture V2 migrations.

Other product responsibilities may migrate into src first.

The routing migration to:

src/app/

should happen only when appropriate and deliberately.

Rationale

Do not combine:

route relocation;
domain migration;
component refactoring;
import rewriting;

into the first architectural change.

LD-051 — The public Builder route is not automatically renamed during initial architecture work

Status: LOCKED UNTIL EXPLICIT ROUTE DECISION**

Rule

Architecture terminology may change from Builder to Assessment Creation
without requiring the public URL to change immediately.

Any route change, such as changing a historical /builder route to
/workspace, must be a separate deliberate product/routing decision.

PART VIII — STANDARD VECED UI VOCABULARY
LD-052 — Global website navigation is HeaderBar

Status: LOCKED

Rule

The topmost global VecEd navigation area is named:

HeaderBar

It contains global application navigation and global settings access.

LD-053 — Assessment Creation upper control area is TopBar

Status: LOCKED

Rule

The Assessment Creation-specific horizontal bar below HeaderBar is named:

TopBar

Do not call it HeaderBar.

LD-054 — Assessment Creation lower region is HUDBar

Status: LOCKED

Rule

The lower persistent assessment information/control area is named:

HUDBar
LD-055 — The left-hand assessment region is SkillsPanel

Status: LOCKED

Rule

The complete left-hand skill-selection region is:

SkillsPanel
LD-056 — The central assessment surface is PaperWorkspace

Status: LOCKED

Rule

The central paper working/viewing surface is named:

PaperWorkspace
LD-057 — PDFWorkspace is rejected

Status: LOCKED

Rule

Do not rename PaperWorkspace according to PDF technology.

Rationale

PaperWorkspace describes the product concept and survives rendering
implementation changes.

LD-058 — WorkspacePage is rejected as the name of the entire Assessment Creation screen

Status: LOCKED

Rule

The whole screen is:

AssessmentCreatorPage

The central surface is:

PaperWorkspace

Avoid naming the whole page WorkspacePage, which would blur those concepts.

LD-059 — Panel means a substantial persistent region

Status: LOCKED VOCABULARY**

Examples:

SkillsPanel
ProgressPanel
LD-060 — Drawer means a substantial edge-opening panel

Status: LOCKED VOCABULARY**

Example:

SettingsDrawer
LD-061 — Popover means a small contextual anchored panel

Status: LOCKED VOCABULARY**

Example:

SettingsPopover
LD-062 — Control means an element which changes state/value

Status: LOCKED VOCABULARY**

Examples:

ZoomControl
PageNavigationControl
LD-063 — Filter means a control restricting/selecting available information

Status: LOCKED VOCABULARY**

Examples:

StandardFilter
TargetMarksFilter
ThinkingTypeFilter
LD-064 — Field means editable data input

Status: LOCKED VOCABULARY**

Example:

AssessmentNameField
LD-065 — Pill means compact pill-shaped selector/state control

Status: LOCKED VOCABULARY**

Example:

PaperViewPill
LD-066 — Picker means a dedicated selection interface

Status: LOCKED VOCABULARY**

Examples:

DatePicker
TimePicker
LD-067 — Status / Indicator display state

Status: LOCKED VOCABULARY**

Examples:

SaveStatus
ConnectionIndicator
LD-068 — Modal means blocking foreground dialog

Status: LOCKED VOCABULARY**

Do not casually replace this term with generic Popup.

LD-069 — Existing VecEd vocabulary should not drift into synonyms

Status: LOCKED

Rule

Do not casually introduce names such as:

Tray
Flyout
Popup
MiniDrawer
Ribbon
Widget
Sidebar

where an existing VecEd term already describes the interface.

A genuinely new UI concept may introduce a new term only deliberately.

PART IX — ASSESSMENT CREATION
LD-070 — Builder is deprecated Architecture V2 terminology

Status: LOCKED

Rule

Newly migrated Architecture V2 code should use Assessment Creation terminology
instead of using Builder as the permanent product/domain label.

Legacy Builder filenames remain until individually migrated.

LD-071 — Do not perform a blind global Builder rename

Status: LOCKED

Rule

Each legacy Builder... file must be renamed according to its actual
responsibility during migration.

Examples:

BuilderTopBar

may become:

TopBar

where appropriate.

But:

BuilderUtils

must first be analysed because its contents may belong to several different
owners.

LD-072 — Entire Assessment Creation page implementation is AssessmentCreatorPage.tsx

Status: LOCKED

Rule

The substantial page implementation is:

src/Assessments/Creation/AssessmentCreatorPage.tsx

once migrated.

LD-073 — Assessment Creation target ownership structure

Status: LOCKED AT CONCEPTUAL LEVEL**

Rule

The current conceptual architecture is:

Assessments/
└── Creation/
    ├── AssessmentCreatorPage.tsx
    ├── TopBar/
    ├── SkillsPanel/
    │   ├── 01-SkillsFilters/
    │   └── 02-SkillsTree/
    ├── PaperWorkspace/
    ├── HUDBar/
    ├── AssessmentSettings/
    ├── Questions/
    ├── Papers/
    ├── Analysis/
    └── Persistence/

Detailed subfolders may be refined through forensic migration mapping.

The major ownership concepts must not be casually replaced.

LD-074 — Visible Assessment Creation UI is organised primarily by physical region

Status: LOCKED

Rule

Visible components should generally live with the area in which teachers see
them.

Examples:

TopBar controls → TopBar;
left-hand skill UI → SkillsPanel;
central paper controls → PaperWorkspace;
lower-bar controls → HUDBar.
LD-075 — Shared domain behaviour is not duplicated by physical region

Status: LOCKED

Rule

Physical UI organisation must not create duplicate underlying state.

Shared responsibilities belong to owners such as:

Questions
Papers
Analysis
Persistence
PART X — TOPBAR
LD-076 — Assessment Creation TopBar is independent from global HeaderBar

Status: LOCKED

Rule

These are separate components, separate folders and separate responsibilities.

LD-077 — TopBar owns visible page-specific upper controls

Status: LOCKED

Current expected responsibilities
assessment name;
class coverage/selection presentation;
assessment date;
P1/P2 viewing;
zoom;
page navigation.

Exact component decomposition follows migration analysis.

LD-078 — TopBar does not own shared paper-domain logic

Status: LOCKED

Rule

If TopBar displays current-paper state, it consumes the shared paper owner.

It must not establish a second paper-domain implementation merely because it
displays the state.

LD-079 — Assessment Date may have its own TopBar subfolder

Status: LOCKED DESIGN DIRECTION**

Rule

A multi-file date feature may use:

TopBar/
└── AssessmentDate/

with descriptive files such as:

AssessmentDateControl.tsx
AssessmentDatePicker.tsx
AssessmentDateFormatting.ts

Exact filenames may be refined during migration.

PART XI — SKILLS PANEL
LD-080 — SkillsPanel uses meaningful visual ordering

Status: LOCKED

Rule

The structure is:

SkillsPanel/
├── 01-SkillsFilters/
└── 02-SkillsTree/

because the interface visually presents Filters above the Tree.

LD-081 — 01-SkillsFilters owns generic filtering controls

Status: LOCKED

Expected examples
StandardFilter
TargetMarksFilter
ThinkingTypeFilter
AddQuestionsButton
LD-082 — 02-SkillsTree owns generic Skills Tree rendering and interaction

Status: LOCKED

Possible responsibilities
category rendering;
skill rows;
concept rows;
difficulty interaction;
expansion/collapse;
generic selection interaction.
LD-083 — Assessment Creation SkillsTree UI does not own course curriculum data

Status: LOCKED

Rule

The UI renders curriculum supplied by the active Course.

The Course defines the curriculum.

PART XII — PAPER WORKSPACE
LD-084 — PaperWorkspace owns the central paper working/viewing surface

Status: LOCKED

Rule

The central paper display and directly associated workspace interactions belong
beneath:

PaperWorkspace/
LD-085 — Workspace-specific controls should live with PaperWorkspace

Status: LOCKED

Rule

If a control physically and conceptually belongs to the workspace, do not leave
it in another legacy region solely because that is where it historically
existed.

LD-086 — Save status may move with PaperWorkspace when product ownership supports it

Status: LOCKED OWNERSHIP PRINCIPLE, FINAL COMPONENT LOCATION SUBJECT TO MAPPING**

Rule

Do not assume save status belongs to HUDBar merely because the legacy BottomHud
implemented it there.

Its final location should reflect the actual product UI.

LD-087 — Workspace settings are not global settings

Status: LOCKED

Rule

Workspace controls such as:

reset zoom;
reset layout;
workspace display options;

belong to PaperWorkspace ownership.

LD-088 — Small workspace settings use a Popover

Status: LOCKED PRODUCT TERMINOLOGY**

Rule

A small cog anchored to PaperWorkspace should use a contextual:

SettingsPopover

rather than another global SettingsDrawer.

PART XIII — HUDBAR
LD-089 — Historical BottomHud becomes HUDBar terminology in Architecture V2

Status: LOCKED

Rule

New V2 naming uses:

HUDBar

rather than BottomHud.

Legacy filenames may retain their current names until migrated.

LD-090 — HUDBar owns only features which actually belong to the lower region

Status: LOCKED

Rule

Do not migrate every legacy BottomHud responsibility into HUDBar automatically.

Each responsibility must be assigned according to actual product ownership.

PART XIV — SETTINGS ARCHITECTURE
LD-091 — Settings are divided by what they affect

Status: LOCKED

Current categories
Global application settings.
Assessment-specific settings.
Workspace-specific settings.

Do not merge these merely because they all use cog icons.

LD-092 — Global application settings belong to UI/Application/SettingsDrawer

Status: LOCKED

Examples
application appearance;
theme mode;
accent colour;
other genuine application-wide preferences.
LD-093 — Assessment settings belong to Assessments/Creation/AssessmentSettings

Status: LOCKED

Potential examples
cover sheet;
formula sheet;
candidate-number box;
assessment/paper sitting information;
assessment document options.

Exact ownership of individual existing settings must be established during
migration.

LD-094 — Workspace settings belong to PaperWorkspace

Status: LOCKED

Examples
workspace layout;
zoom reset;
workspace display behaviour;
workspace panel visibility.
LD-095 — The legacy giant SettingsPanel must not survive unchanged merely in a new folder

Status: LOCKED

Rule

The historical settings implementation must be decomposed according to the
three ownership categories.

Rationale

The current large settings file mixes unrelated application-level and
Assessment Creation-specific responsibilities.

LD-096 — Global HeaderBar Settings button always means global application settings

Status: LOCKED

Rule

The global settings entry point should not change meaning based on the current
page.

LD-097 — Global HeaderBar should not fire Assessment Creation-specific hidden settings events

Status: LOCKED

Rule

Remove or avoid feature-specific hidden coupling between HeaderBar and
Assessment Creation as the relevant code is migrated.

PART XV — UI ARCHITECTURE
LD-098 — There is one top-level UI domain

Status: LOCKED

Rule

Global visual sources of truth belong under:

src/UI/

Do not create several competing top-level UI systems.

LD-099 — UI is explicitly divided into Application and Documents

Status: LOCKED

Rule

The major visual split is:

UI/
├── Application/
└── Documents/
LD-100 — UI/Application owns teacher-facing VecEd application visuals

Status: LOCKED

Examples
application typography;
colours;
theme;
motion;
spacing;
shadows;
HeaderBar;
SettingsDrawer;
reusable application-level UI primitives.
LD-101 — UI/Documents owns generated assessment-document visuals

Status: LOCKED

Examples
exam/document typography;
page dimensions;
document margins;
question spacing;
page frames;
cover-page presentation;
formula-sheet presentation;
answer-space layout.
LD-102 — Application UI and document UI are distinct systems

Status: LOCKED

Rule

Do not use one undifferentiated typography/layout system for both the VecEd
software interface and generated assessment documents merely because both are
visual.

LD-103 — All genuinely global visual sources of truth converge under UI

Status: LOCKED

Rule

Repeated global visual decisions should not remain scattered throughout
feature folders.

LD-104 — Course data does not own literal application colours

Status: LOCKED

Rule

Courses may expose semantic category identity.

The UI system determines the visual representation.

LD-105 — One authoritative theme architecture

Status: LOCKED

Rule

Architecture V2 should converge on:

one theme definition
one theme state/provider
one persistence mechanism
one coherent visual-token system

where practical.

LD-106 — Competing legacy theme systems should be consolidated

Status: LOCKED

Rule

Do not preserve duplicate theme definitions simply because different existing
components use them.

Determine the authoritative V2 system and migrate consumers.

LD-107 — Not every pixel must become a global token

Status: LOCKED

Rule

Unique local layout values may remain local.

Only reusable/global visual decisions require centralised ownership.

Rationale

Avoid over-engineering the design system.

PART XVI — COURSES
LD-108 — Course-specific knowledge belongs under src/Courses

Status: LOCKED

Rule

Curriculum data, course definitions, course-specific generation logic and exam
source catalogues belong to the Courses domain.

LD-109 — Assessment Creation is course-independent architecture

Status: LOCKED

Rule

The correct conceptual model is:

Assessment Creation consumes an active course.

Not:

Assessment Creation is inherently the National 5 Maths Builder.

LD-110 — Active course drives the Skills Tree

Status: LOCKED

Dependency model
Active Course
    ↓
CourseRegistry
    ↓
CourseDefinition
    ↓
SkillsTreeDefinition
    ↓
Assessment Creation SkillsTree UI
LD-111 — CourseRegistry is the intended course-resolution concept

Status: LOCKED AT ARCHITECTURAL LEVEL**

Rule

VecEd should have a clear authoritative mechanism for identifying and resolving
supported courses rather than hard-coding National 5 Maths throughout generic
features.

The detailed implementation may evolve.

LD-112 — CourseDefinition provides the generic course contract

Status: LOCKED AT ARCHITECTURAL LEVEL**

Rule

Each Course should expose the information generic application systems need
through a coherent definition/contract rather than requiring generic UI to know
course internals.

LD-113 — Future courses are sibling Course implementations

Status: LOCKED

Example
Courses/
├── National5Maths/
└── HigherMaths/
LD-114 — Adding Higher Maths must not require cloning Assessment Creation

Status: LOCKED

Rule

Do not create:

a second Higher-specific TopBar;
a second Higher-specific PaperWorkspace;
a duplicate Assessment Creation page;

merely because a second course exists.

Generic Assessment Creation consumes course-specific data.

LD-115 — Generic UI should avoid hard-coded course checks

Status: LOCKED

Rule

Avoid logic such as:

if course === National5Maths

inside generic UI where the variation can be expressed through CourseDefinition
data.

LD-116 — National 5 Maths course structure remains easy to navigate by curriculum area

Status: LOCKED

Intended conceptual organisation
National5Maths/
└── SkillsTree/
    ├── 01-Numerical/
    ├── 02-Algebraic/
    ├── 03-Geometric/
    ├── 04-Trigonometric/
    └── 05-Statistical/
LD-117 — QuestionGeneration is course-specific where educational generation knowledge is course-specific

Status: LOCKED

Rule

National 5 Maths generator definitions belong beneath the National 5 Maths
course domain.

Do not move all generator knowledge into generic Assessment Creation.

LD-118 — AnswerGeneration is course-owned where answer behaviour is course/question-family specific

Status: LOCKED

Rule

Keep educational answer-generation logic distinct from generic document
rendering.

LD-119 — SourceQuestionCatalog is approved terminology

Status: LOCKED

Rule

Historical/official source question data may live under clearly named:

SourceQuestionCatalog/

This existing organisational concept should be preserved where appropriate.

LD-120 — SourceMarkingSchemeCatalog is approved terminology

Status: LOCKED

Rule

Historical marking-scheme source data may live under:

SourceMarkingSchemeCatalog/

This is considered clear and maintainable terminology.

PART XVII — AWARDING-BODY-NEUTRAL TERMINOLOGY
LD-121 — Generic architecture should avoid unnecessary awarding-body branding

Status: LOCKED

Rule

Where a concept is genuinely generic, prefer neutral internal names rather than
embedding awarding-body names throughout system architecture.

LD-122 — Approved neutral terminology includes Exam

Status: LOCKED DIRECTION**

Where appropriate, prefer concepts such as:

ExamTypography
ExamPageFrame
ExamCoverPage

over generic infrastructure whose name unnecessarily embeds a particular
awarding body.

LD-123 — CandidateNumber is preferred generic terminology

Status: LOCKED DIRECTION**

Where the concept does not specifically require an awarding-body name, prefer:

CandidateNumber

rather than an organisation-specific candidate-number identifier.

LD-124 — OfficialPastPaper is preferred neutral concept where appropriate

Status: LOCKED DIRECTION**

The exact persisted values and existing data contracts must be reviewed before
renaming legacy identifiers.

LD-125 — No blind global SQA/QS rename

Status: LOCKED

Rule

Awarding-body-specific legacy identifiers must be inspected individually.

Do not perform a global search-and-replace without considering:

persistence;
IDs;
source data;
compatibility;
external meaning.
LD-126 — Neutral naming does not settle copyright or trademark questions

Status: LOCKED

Rule

Internal neutral naming is an architectural decision only.

Legal/content questions concerning:

source questions;
marking schemes;
document design;
trademarks;
logos;

require separate review.

PART XVIII — QUESTIONS, PAPERS AND ANALYSIS
LD-127 — Generic Assessment Creation question workflow belongs under Questions

Status: LOCKED

Potential responsibilities
question selection coordination;
draft workflow;
placement;
editing;
generation orchestration.
LD-128 — Course generation knowledge remains Course-owned

Status: LOCKED

Rule

Assessments/Creation/Questions coordinates question workflow.

Courses/<Course>/QuestionGeneration owns course-specific generator knowledge.

Do not collapse these distinct responsibilities.

LD-129 — Shared paper behaviour belongs under Papers

Status: LOCKED

Potential responsibilities
current paper;
paper targets;
paper timing;
metadata;
sitting state;
paper-derived values.
LD-130 — Current-paper state must not be independently duplicated across visible regions

Status: LOCKED

Rule

TopBar, HUDBar and PaperWorkspace consume shared paper ownership.

Do not maintain three competing versions of the same state.

LD-131 — Assessment quality/distribution analysis belongs under Analysis

Status: LOCKED

Examples
topic balance;
standard balance;
calculator suitability;
operational/reasoning balance;
assessment distribution.
LD-132 — Analysis modules should be named for what they analyse

Status: LOCKED

Rule

Prefer:

TopicBalance
StandardBalance
AssessmentDistribution

over generic:

BuilderLogic
AnalysisHelper
PART XIX — CLASSES
LD-133 — Class-owned functionality belongs under src/Classes

Status: LOCKED

Rule

Class data and class-specific behaviour should not remain permanently scattered
through route folders and Assessment Creation.

LD-134 — Assessment Creation may consume Classes but does not own Classes

Status: LOCKED

Rule

Selecting classes for an assessment may be an Assessment Creation interaction.

The underlying class domain remains Classes-owned.

LD-135 — Do not duplicate class models for Assessment Creation

Status: LOCKED

Rule

Assessment Creation should use the authoritative class representation rather
than maintaining a separate incompatible version.

PART XX — PERSISTENCE
LD-136 — Persistence belongs to explicit owning domains

Status: LOCKED

Rule

Visible UI should not scatter persistence implementation throughout unrelated
components when a clear feature/domain persistence owner can exist.

LD-137 — Existing localStorage behaviour must survive Architecture V2

Status: LOCKED

Rule

The refactor must not silently break current local data because source
filenames changed.

LD-138 — Source refactoring does not automatically rename persistence keys

Status: LOCKED

Rule

A file rename such as:

BuilderStorageKeys.ts

does not imply that persisted key strings should immediately change.

Any persistence-key migration is a separate compatibility decision.

LD-139 — Architecture V2 does not automatically introduce a new backend/database

Status: LOCKED

Rule

Storage technology is not being replaced merely because persistence is being
architecturally reorganised.

LD-140 — Persistence should be isolated enough to allow future technology changes

Status: LOCKED

Rule

Although localStorage may remain today, visible application implementation
should become less tightly coupled to direct storage APIs.

PART XXI — DEPENDENCY AND OWNERSHIP RULES
LD-141 — A file lives with the domain that owns its responsibility

Status: LOCKED

Rule

Ownership, not whichever feature happens to import the file most frequently,
determines location.

LD-142 — Visible UI location determines visible-component ownership where appropriate

Status: LOCKED

Rule

If a meaningful visible control clearly belongs to TopBar, its component should
normally live under TopBar.

This rule applies to presentation ownership, not shared domain logic.

LD-143 — Shared domain logic is organised by responsibility, not physical screen position

Status: LOCKED

Rule

A paper rule used by TopBar and PaperWorkspace belongs to Papers rather than
being duplicated in each physical region.

LD-144 — Courses must not depend on Assessment Creation UI

Status: LOCKED

Rule

Course definitions should remain usable independently of the specific
Assessment Creation presentation.

LD-145 — Document UI must not depend on application chrome

Status: LOCKED

Rule

Generated assessment document visuals should not depend on:

HeaderBar;
application navigation;
global SettingsDrawer.
LD-146 — UI consumes domain meaning rather than redefining it

Status: LOCKED

Example

PaperViewPill may display available papers.

It should not independently define the course's supported paper structure.

LD-147 — Avoid circular major-domain dependencies

Status: LOCKED

Rule

If two major domains repeatedly import each other's internal implementation,
reassess ownership.

LD-148 — Imports should communicate architecture clearly

Status: LOCKED

Rule

As migration progresses, imports should increasingly reflect clear domain
ownership rather than deep historical relative paths.

LD-149 — @/ should ultimately represent the V2 source root cleanly

Status: LOCKED DIRECTION**

Rule

Once the source migration reaches the appropriate stage, the TypeScript alias
should be adjusted so clean imports resolve from src.

This must be done deliberately at the appropriate migration stage rather than
prematurely breaking legacy imports.

LD-150 — Do not introduce barrel files everywhere by default

Status: LOCKED

Rule

index.ts exports may be used for a meaningful public module boundary.

They are not required for every folder.

Rationale

Excessive barrels can obscure symbol ownership.

PART XXII — DOCUMENT RENDERING
LD-151 — Shared document-rendering truth belongs under UI/Documents where genuinely shared

Status: LOCKED

Rule

If preview and compiled assessment depend on the same document visual rule,
prefer one authoritative implementation where practical.

LD-152 — Preview is not automatically an architectural owner

Status: LOCKED

Rule

Legacy code inside a preview folder must be analysed according to what it
actually does.

It may belong to:

PaperWorkspace;
UI/Documents;
Papers;
another genuine owner.

Do not preserve preview as a catch-all purely because of history.

LD-153 — Implementation technology should not dominate product naming

Status: LOCKED

Rule

Prefer product/domain terminology over names tied to current rendering
technology.

Example:

PaperWorkspace

instead of:

PDFViewer
PART XXIII — ASSESSMENT LIBRARY AND ASSESSMENT DOMAIN
LD-154 — Saved assessment functionality belongs to the Assessments domain

Status: LOCKED

Rule

The saved-assessment library should not remain permanently owned only by a
Next.js route directory.

LD-155 — Assessment Creation does not own the entire Assessment Library

Status: LOCKED

Rule

Assessment Creation may create/save assessments.

The persistent assessment library is a broader Assessment-domain
responsibility.

LD-156 — Next.js routes expose product domains rather than own them

Status: LOCKED

Rule

Routes such as:

my-assessments
my-classes

should become thin entry points into descriptive domain-owned page
implementations.

PART XXIV — DEVELOPMENT TOOLING AND MIGRATION ARTEFACTS
LD-157 — One-off catalogue hardening scripts are not application architecture

Status: LOCKED

Rule

Temporary catalogue migration utilities should eventually:

move into root Tools; or
be deleted if no longer needed.

They should not remain mixed with product source indefinitely.

LD-158 — Temporary tooling should have an expiry decision

Status: LOCKED

Rule

When a migration tool's task is complete, decide whether it has ongoing
maintenance value.

If not, delete it once the result is safely verified and Git history preserves
it.

LD-159 — In-application developer tools may receive an explicit development owner

Status: LOCKED DIRECTION**

Rule

Existing runtime developer pages such as generator-testing functionality should
not be confused with root maintenance scripts.

Their final V2 location should be determined during migration.

Do not create speculative empty developer-tool architecture before an actual
runtime tool is migrated.

PART XXV — DOCUMENTATION
LD-160 — Architecture documentation is part of the repository architecture

Status: LOCKED

Rule

These files are not optional notes.

They form the persistent memory of the project.

LD-161 — Architecture.md explains long-lived architectural intent

Status: LOCKED

Rule

Do not turn Architecture.md into a day-by-day migration diary.

LD-162 — LockedDecisions.md records settled decisions

Status: LOCKED

Rule

Future conversations must treat entries marked LOCKED as already decided.

LD-163 — RepositoryMap.md records the practical current repository

Status: LOCKED

Rule

RepositoryMap should reflect where responsibilities physically live now,
including transitional legacy locations during migration.

LD-164 — RefactorLedger.md records migration progress

Status: LOCKED

Rule

The ledger should answer:

what has moved;
what has not;
what is currently being worked on;
what legacy dependencies remain;
what can safely be deleted.
LD-165 — ChatGPTWorkflow.md contains reusable AI-development protocols

Status: LOCKED

Rule

It should provide prompts/procedures for:

starting new development conversations;
bugs;
refactors;
audits;
migration work;
handoff.
LD-166 — Future AI conversations must read project documentation before architectural work

Status: LOCKED

Rule

The mandatory startup protocol will be defined in AGENTS.md.

At minimum, significant repository work should be grounded in:

AGENTS.md
LockedDecisions.md
Architecture.md
RepositoryMap.md
RefactorLedger.md

as relevant.

LD-167 — Future AI sessions must not rediscover architecture from legacy source alone

Status: LOCKED

Rule

Legacy source should not be treated as the primary description of intended
Architecture V2.

Read the project documents first.

LD-168 — Documentation may intentionally repeat critical rules

Status: LOCKED

Rule

Do not aggressively deduplicate documentation merely for elegance.

Important architectural rules may appear in more than one document when doing
so makes future handoff safer.

PART XXVI — MIGRATION PROCESS
LD-169 — Major migrations require a forensic mapping before movement

Status: LOCKED

Required mapping fields
CURRENT PATH
PURPOSE
IMPORTS
EXPORTS
CONSUMERS
NEW OWNER
NEW PATH
ACTION
LD-170 — Allowed migration actions are explicit

Status: LOCKED

Standard actions
KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN

Additional specific actions may be defined if needed.

LD-171 — Do not decide destination from filename alone

Status: LOCKED

Rule

Inspect the actual implementation.

A legacy name may be inaccurate.

Example:

QuestionLogic.ts

may contain something quite different from what its name implies.

LD-172 — Imports and consumers must be traced before structural moves

Status: LOCKED

Rule

A migration plan must understand who depends on the file being moved.

LD-173 — Build/type verification occurs after bounded migrations

Status: LOCKED

Rule

Do not accumulate many unverified structural migrations before checking the
application.

LD-174 — Behaviour testing includes affected visible workflows

Status: LOCKED

Rule

Successful TypeScript compilation alone does not prove that the migrated
feature still works.

Relevant user-visible behaviour should be tested.

LD-175 — Git diff should be inspected before declaring a migration complete

Status: LOCKED

Rule

Check for accidental unrelated changes.

LD-176 — RepositoryMap must be updated after meaningful structural migration

Status: LOCKED

Rule

A successful move which changes where developers should look for functionality
should update the practical map.

LD-177 — RefactorLedger must be updated as migration status changes

Status: LOCKED

Rule

The ledger should remain useful to a new conversation joining the project.

LD-178 — Architecture.md changes only when architecture changes

Status: LOCKED

Rule

Do not edit the constitution for every individual moved file.

LD-179 — LockedDecisions.md changes when a locked architectural decision changes or a new one is approved

Status: LOCKED

Rule

Do not use this file as a general work log.

PART XXVII — EXPLICITLY REJECTED APPROACHES
LD-180 — Rejected: duplicate V2 repository

Status: LOCKED REJECTION**

Rejected
N5-Assessment-Tool
N5-Assessment-Tool-V2

as the normal Architecture V2 strategy.

Reason

Duplicate authority and synchronisation risk.

LD-181 — Rejected: immediate physical Legacy/ wrapper

Status: LOCKED REJECTION**

Rejected

Moving all old source beneath:

Legacy/

before migration.

Reason

Would break routing and imports before actual architectural work begins.

LD-182 — Rejected: giant generic Assessment Creation Components folder

Status: LOCKED REJECTION**

Rejected
Assessments/Creation/Components/

as the primary organisation for all visible Assessment Creation code.

Preferred
TopBar
SkillsPanel
PaperWorkspace
HUDBar

because these mirror the product.

LD-183 — Rejected: permanent Builder architecture

Status: LOCKED REJECTION**

Rejected

Using Builder as the long-term domain identity of Assessment Creation.

LD-184 — Rejected: PDFWorkspace

Status: LOCKED REJECTION**

Preferred
PaperWorkspace
LD-185 — Rejected: global settings containing page-specific workspace settings

Status: LOCKED REJECTION**

Preferred

Settings are split according to ownership.

LD-186 — Rejected: duplicating N5 course data inside Assessment Creation

Status: LOCKED REJECTION**

Preferred

The active Course supplies course definitions to generic Assessment Creation.

LD-187 — Rejected: generic helpers recreated under src

Status: LOCKED REJECTION**

Rejected

Simply transforming:

math-helpers/

into:

src/Helpers/

or equivalent.

Preferred

Distribute responsibilities to actual owners.

LD-188 — Rejected: global SharedTypes recreation

Status: LOCKED REJECTION**

Rejected
src/SharedTypes/

as a default replacement for legacy shared-types.

LD-189 — Rejected: renaming every legacy file before understanding it

Status: LOCKED REJECTION**

Rule

Migration names should emerge from responsibility analysis.

LD-190 — Rejected: preserving every existing file because refactoring should be “safe”

Status: LOCKED REJECTION**

Rule

Safety means preserving behaviour.

It does not mean preserving obsolete source structure.

LD-191 — Rejected: deleting old code based solely on superficial search results

Status: LOCKED REJECTION**

Rule

Deletion requires dependency understanding.

LD-192 — Rejected: introducing a new state library during this architecture refactor

Status: LOCKED

Rule

Do not add a new global state-management library merely as part of Architecture
V2.

Rationale

The first objective is to organise the existing state and establish ownership.

A future state-management decision can be considered separately if genuine need
emerges.

LD-193 — Rejected: premature architecture for hypothetical future capabilities

Status: LOCKED REJECTION**

Rule

Do not add infrastructure purely in anticipation of future:

OCR;
AI marking;
scanning;
analytics;
other concepts;

unless the current task is actually implementing them.

PART XXVIII — CURRENT KNOWN LEGACY AREAS REQUIRING SPECIAL ATTENTION
LD-194 — Legacy Assessment Creation page.tsx is recognised as an oversized orchestrator

Status: LOCKED FINDING**

Rule

Architecture V2 should reduce the existing page's combined responsibilities
rather than reproducing the same giant composition root beneath a new name.

LD-195 — Legacy BuilderTopBar.tsx is expected to be decomposed

Status: LOCKED DIRECTION**

Rule

The current large TopBar implementation should be analysed into meaningful
visible controls during migration.

Do not assume the entire file should simply become TopBar.tsx unchanged.

LD-196 — Legacy BuilderBottomHud.tsx responsibilities require reassignment

Status: LOCKED DIRECTION**

Rule

The existing BottomHud contains multiple responsibilities.

Some may remain under HUDBar.

Some may move to PaperWorkspace or another owner.

Do not mechanically migrate the file unchanged.

LD-197 — Legacy SettingsPanel.tsx is a major decomposition target

Status: LOCKED FINDING**

Rule

The large legacy settings implementation mixes:

global application appearance;
Assessment Creation settings;
workspace settings.

Architecture V2 must separate these ownership categories.

LD-198 — Legacy theme implementations contain duplicate/competing sources of truth

Status: LOCKED FINDING**

Rule

Architecture V2 should consolidate the duplicate theme/appearance systems
rather than preserving both as parallel authorities.

LD-199 — Legacy shared-types contains types which need domain reassignment

Status: LOCKED FINDING**

Rule

Do not move the folder wholesale.

Classify individual types by owner.

LD-200 — Legacy math-helpers/QuestionLogic.ts is not accepted as generic maths-helper architecture

Status: LOCKED FINDING**

Rule

Its implementation must be inspected and migrated to the domain which actually
owns its behaviour.

LD-201 — Legacy localStorage access is distributed too widely

Status: LOCKED FINDING**

Rule

Architecture V2 should progressively place storage behaviour behind appropriate
feature/domain persistence ownership.

Compatibility must be preserved.

LD-202 — Legacy course-data is useful but combines multiple responsibilities

Status: LOCKED FINDING**

Rule

Its useful organisation should be retained where appropriate while separating:

course definition;
Skills Tree;
question generation;
answer generation;
SourceQuestionCatalog;
SourceMarkingSchemeCatalog.
LD-203 — Existing SourceQuestionCatalog organisation is considered a positive precedent

Status: LOCKED

Rule

Do not dismantle a clear source catalogue merely for the sake of changing
everything during the refactor.

Improve it only where there is a real architectural reason.

LD-204 — Existing SourceMarkingSchemeCatalog organisation is considered a positive precedent

Status: LOCKED

Same principle as LD-203.

LD-205 — Existing question-generation curriculum grouping is worth preserving conceptually

Status: LOCKED

Rule

Strong organisation by meaningful curriculum family should be retained under
the new Course architecture rather than flattened.

PART XXIX — FUTURE EXTENSIBILITY
LD-206 — Higher Maths should be additive rather than invasive

Status: LOCKED

Rule

A future Higher Maths course should mainly add a sibling Course implementation.

It should not require widespread modifications throughout generic Assessment
Creation solely because it is a different course.

LD-207 — Good architecture should allow future features without placeholder folders

Status: LOCKED

Rule

Extension capability comes from clear boundaries and contracts.

Do not confuse extensibility with pre-building empty architecture.

LD-208 — Do not over-engineer CourseDefinition for unknown future requirements

Status: LOCKED

Rule

CourseDefinition should expose actual requirements.

Do not turn it into a speculative all-purpose framework.

LD-209 — New abstractions require demonstrated value

Status: LOCKED

Rule

Do not add an abstraction merely because it could theoretically be useful.

Use abstractions to solve actual repeated or boundary-level problems.

PART XXX — AI-ASSISTED DEVELOPMENT RULES
LD-210 — AI must inspect before editing

Status: LOCKED

Rule

For meaningful source work, a fresh AI session should inspect the relevant
current implementation before proposing edits.

Documentation provides architectural context but does not replace source
inspection.

LD-211 — AI must not infer Architecture V2 from historical naming

Status: LOCKED

Rule

Names such as:

Builder
shared-types
math-helpers
builder-logic

describe legacy history, not approved future architecture.

LD-212 — AI must not casually propose alternative conventions to locked decisions

Status: LOCKED

Rule

Do not waste development conversations re-discussing:

PascalCase;
src;
HeaderBar vs TopBar;
PaperWorkspace naming;
physical-region organisation;
course-driven Skills Tree;
Application/Documents UI split;

unless a genuine new technical conflict exists.

LD-213 — AI should flag simplification opportunities

Status: LOCKED

Rule

During migration, identify potential:

dead code;
duplication;
unnecessary complexity;
misplaced ownership;
obsolete compatibility code.

Do not silently implement major behavioural/architectural changes without
approval.

LD-214 — AI must distinguish proposal from approved architecture

Status: LOCKED

Rule

A suggestion made during investigation does not become a locked decision until
the user approves it.

LD-215 — AI should use exact file paths when ambiguity exists

Status: LOCKED

Rule

Do not refer vaguely to files such as:

page.tsx
types.ts
settings.ts

when multiple files could match.

LD-216 — AI must not invent missing repository structure

Status: LOCKED

Rule

If detailed current structure is required, inspect the repository.

Do not assume a proposed target tree has already been implemented.

LD-217 — Architecture V2 target and current RepositoryMap must be distinguished

Status: LOCKED

Rule

A future conversation must understand the difference between:

where a responsibility should end up

and:

where it physically exists today.

That transitional difference is expected during the refactor.

PART XXXI — CHANGE CONTROL
LD-218 — Locked decisions change only through explicit approval

Status: LOCKED

Rule

Silence is not approval.

Implementation convenience is not approval.

A future assistant preferring another convention is not approval.

LD-219 — Superseded decisions remain in this file

Status: LOCKED

Rule

If a decision later changes, preserve its historical entry and mark:

Status: SUPERSEDED

with a reference to the replacement decision.

Do not erase the fact that the previous decision existed.

LD-220 — New important architectural decisions receive new IDs

Status: LOCKED

Rule

Continue numbering from the latest Decision ID.

Do not reuse IDs.

LD-221 — Architecture changes require documentation synchronisation

Status: LOCKED

Rule

When an approved architectural change affects multiple documents, update the
appropriate:

LockedDecisions;
Architecture;
RepositoryMap;
RefactorLedger.
PART XXXII — ARCHITECTURE V2 DEFINITION OF DONE
LD-222 — Root legacy source folders are transitional, not part of the finished V2 target

Status: LOCKED

Rule

The completed Architecture V2 should not rely on the historical root-level
source architecture remaining indefinitely.

LD-223 — src becomes the authoritative source tree

Status: LOCKED

Rule

Once migration is complete, application source should be understandable by
starting under:

src/
LD-224 — Generic legacy buckets should be removed or explicitly justified

Status: LOCKED

Rule

Architecture V2 is not complete if legacy catch-all folders have merely been
renamed and retained.

LD-225 — Large route implementations should have become thin wrappers

Status: LOCKED

Rule

Major Next.js route files should delegate to descriptive implementations.

LD-226 — Global and feature settings should have clear ownership

Status: LOCKED

Architecture V2 is not complete while one giant settings system still owns
unrelated:

application;
assessment;
workspace;

settings.

LD-227 — UI visual truth should no longer have competing global authorities

Status: LOCKED

Rule

Theme/appearance architecture should converge on coherent sources of truth.

LD-228 — Assessment Creation should no longer depend fundamentally on N5-specific Skills Tree implementation

Status: LOCKED

Rule

The active Course should supply its curriculum definition.

LD-229 — A future developer should be able to navigate VecEd using product language

Status: LOCKED SUCCESS CRITERION**

Examples:

broken TopBar control
→ Assessments/Creation/TopBar

wrong curriculum skill
→ Courses/<Course>/SkillsTree

wrong Skills Tree interaction
→ Assessments/Creation/SkillsPanel/02-SkillsTree

wrong application colour
→ UI/Application

wrong assessment-paper typography
→ UI/Documents

wrong class data
→ Classes
LD-230 — Architecture V2 must reduce dependence on historical project memory

Status: LOCKED SUCCESS CRITERION**

Rule

A new developer or AI assistant should be able to understand ownership through:

repository structure;
Architecture.md;
LockedDecisions.md;
RepositoryMap.md;
RefactorLedger.md;
AGENTS.md.

The original author should not need to remember why every file exists.

PART XXXIII — FINAL GOVERNING RULES
LD-231 — Organise by what the product is, not how the code happened to be written

Status: LOCKED

This is one of the central Architecture V2 principles.

LD-232 — Preserve behaviour, not historical accidents

Status: LOCKED

Legacy organisation is not valuable merely because it already exists.

Working behaviour is valuable.

LD-233 — The obvious location should also be the correct location

Status: LOCKED

Rule

Repository names should make it possible to locate a feature through product
understanding.

LD-234 — Do not establish a second source of truth to solve a local problem

Status: LOCKED

Rule

Before introducing new state, data, visual tokens or persistence, determine
whether an authoritative implementation already exists.

LD-235 — Architectural consistency outweighs personal convention preference

Status: LOCKED

Rule

Once a VecEd convention has been approved, use it consistently even if another
developer would personally choose another valid convention.

LD-236 — Architecture V2 should remain intentionally boring to navigate

Status: LOCKED PRINCIPLE**

A developer should not be surprised by where code lives.

Predictability is a feature.

LD-237 — New code should strengthen Architecture V2 rather than recreate legacy patterns

Status: LOCKED

Rule

Do not knowingly create new:

Builder catch-alls;
global helper buckets;
duplicate theme systems;
giant route implementations;
course-specific generic UI;
invisible event coupling;

inside the V2 source tree.

LD-238 — When architecture and legacy implementation disagree, investigate before compromising architecture

Status: LOCKED

Rule

A difficult migration is not automatically evidence that the target
architecture is wrong.

First determine whether the difficulty is simply historical coupling which the
refactor exists to remove.

LD-239 — Genuine technical discoveries may challenge architecture, but they must be surfaced explicitly

Status: LOCKED

Rule

Do not blindly obey an architectural rule if new evidence shows it would cause
serious technical harm.

Surface the issue.

Do not silently solve it by architectural drift.

LD-240 — This register is intentionally conservative

Status: LOCKED

Rule

When uncertain whether a previously agreed architectural convention may be
changed, assume it remains locked until explicitly discussed.

This prevents accidental divergence between development conversations.

6. Quick Locked-Rule Index

The following condensed list exists for fast reference.

It does not replace the full decisions above.

Repository
Architecture V2 remains in the existing repository.
Refactor work occurs on refactor/architecture-V2.
main remains known-good.
Archive baseline remains frozen.
Application V2 source grows under src.
Do not build a duplicate V2 application repository.
Do not physically wrap all legacy source in Legacy/ at the beginning.
Structure
Core source domains: app, Assessments, Classes, Courses, UI.
No speculative empty feature domains.
Repository tooling belongs under root Tools.
Documentation belongs under Docs.
AGENTS.md remains at root.
public remains at root.
Naming
PascalCase for VecEd-owned architecture.
useCamelCase for React hooks.
URL-friendly route folders under Next.js.
Number folders only where order is meaningful.
Avoid Helpers, Utils, Shared, Common and Misc dumping grounds.
Do not unnecessarily repeat folder context in filenames.
Routing
page.tsx is thin framework glue.
Significant pages get descriptive implementation files.
Never refer ambiguously to page.tsx.
Routing migration to src/app is deliberate.
Public route renaming is separate from internal Builder terminology cleanup.
Assessment Creation
Builder is legacy terminology.
Whole page = AssessmentCreatorPage.
Global navigation = HeaderBar.
Assessment upper controls = TopBar.
Left region = SkillsPanel.
Central surface = PaperWorkspace.
Lower region = HUDBar.
SkillsPanel contains 01-SkillsFilters then 02-SkillsTree.
Visible UI organised by physical region.
Shared behaviour organised by domain responsibility.
Settings
Global application settings → UI/Application/SettingsDrawer.
Assessment settings → Assessments/Creation/AssessmentSettings.
Workspace settings → PaperWorkspace.
Workspace contextual settings use a Popover.
Global HeaderBar Settings always means global application settings.
UI
One top-level UI domain.
UI/Application and UI/Documents are distinct systems.
Global visual truths converge under UI.
One authoritative theme system.
Courses do not own literal application colours.
Courses
Course-specific knowledge belongs under Courses.
Assessment Creation is course-independent.
Active Course drives Skills Tree.
Future courses are sibling Course implementations.
Higher Maths should be additive.
SourceQuestionCatalog and SourceMarkingSchemeCatalog are approved clear
concepts.
Generic architecture uses neutral exam terminology where appropriate.
Persistence
Preserve current stored data.
Do not rename persisted keys merely because files move.
Persistence should move behind owning domains.
Architecture V2 does not automatically introduce a database.
Refactor Process
No mass rewrite.
Map before moving.
Trace imports/exports/consumers.
Simplify where appropriate.
Delete genuinely dead code.
Verify after bounded migrations.
Commit incrementally.
Update RepositoryMap and RefactorLedger.
AI Development
Read documentation first.
Inspect the target implementation before editing.
Locked decisions are not brainstorming prompts.
Do not infer intended architecture from legacy code.
Do not invent current repository structure.
Distinguish target architecture from current migration state.
7. Final Instruction

If a future developer or AI assistant believes a decision in this document
should change, the correct response is not:

I will use a different convention.

The correct response is:

This requirement conflicts with locked decision LD-XXX for the following
technical reason. Here are the consequences of retaining the existing
decision, and here is the proposed architectural amendment. Should the locked
decision be reconsidered?

Until explicit approval is given, the existing decision remains in force.

The purpose of this register is continuity.

VecEd should not acquire a different architectural personality every time a new
development conversation begins.
