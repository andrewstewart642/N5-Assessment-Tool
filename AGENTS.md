# VecEd AGENTS.md

**Document type:** Mandatory repository working contract  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** All AI-assisted and developer-led work in this repository  
**Primary purpose:** Define the mandatory startup, investigation, implementation and verification protocol for VecEd

---

# 1. Read This First

Before making any meaningful change to VecEd, read and follow this file.

Do not begin implementation immediately.

VecEd has an established Architecture V2 and a persistent documentation system.

Do not reconstruct the architecture from legacy source code alone.

Do not invent a new architectural convention because another convention might
also be reasonable.

---

# 2. Mandatory Documentation Order

For substantial work, read:

1. `AGENTS.md`
2. `Docs/LockedDecisions.md`
3. the relevant sections of `Docs/Architecture.md`
4. the relevant sections of `Docs/RepositoryMap.md`
5. the current status in `Docs/RefactorLedger.md`

Use:

```text
Docs/ChatGPTWorkflow.md

for detailed task-specific operating procedures and reusable prompt formats.

3. Documentation Roles
Docs/LockedDecisions.md

Defines decisions already considered and approved.

A decision marked:

LOCKED

is not a brainstorming prompt.

Do not casually propose an alternative convention.

Docs/Architecture.md

Defines the long-lived intended Architecture V2.

Use it to understand:

ownership;
naming;
dependency direction;
Assessment Creation structure;
Courses;
Classes;
UI;
persistence;
routing;
migration principles.
Docs/RepositoryMap.md

Defines where responsibilities physically live at the current stage of the
refactor.

Use it to distinguish:

TARGET V2 ARCHITECTURE

from:

CURRENT LEGACY IMPLEMENTATION
Docs/RefactorLedger.md

Defines:

current refactor phase;
completed migrations;
work in progress;
remaining legacy dependencies;
known risks;
current next action.
Docs/ChatGPTWorkflow.md

Defines the detailed development workflow for:

new chats;
refactors;
bugs;
UI work;
Course work;
persistence;
dead-code audits;
handoff.
4. Documentation Precedence

For VecEd-specific decisions, use this order:

explicit instruction from the user in the current conversation;
AGENTS.md;
Docs/LockedDecisions.md;
Docs/Architecture.md;
Docs/RepositoryMap.md;
Docs/RefactorLedger.md;
current source implementation;
historical implementation conventions.

Legacy source is migration input.

It is not architectural precedent.

5. Mandatory Branch Check

Before substantial Architecture V2 source changes, confirm the active branch.

During the current refactor, the expected branch is:

refactor/architecture-V2

Do not perform Architecture V2 work directly on:

main

unless explicitly instructed.

The frozen archive branch is not an active development branch.

6. Preservation Rule

Preserving the working application is acceptance criterion zero.

Refactoring may:

move;
rename;
split;
merge;
simplify;
consolidate;
delete genuinely dead code.

Refactoring must not unintentionally destroy working behaviour.

Preserve behaviour, not historical accidents.

7. Inspect Before Editing

Before changing a meaningful feature:

inspect the actual current implementation;
inspect relevant sibling files;
inspect the parent/composition layer;
trace important imports;
trace exports;
trace important consumers;
identify relevant persistence;
identify relevant Course/Class/UI dependencies;
determine the true architectural owner.

Do not infer a file's responsibility from its filename alone.

8. Do Not Ask for Information the Repository Can Provide

If repository access is available:

inspect the file;
inspect imports;
inspect consumers;
inspect current paths.

Do not ask the user to paste source which can be retrieved directly.

Ask the user only for information which genuinely requires product intent,
approval or context unavailable from the repository.

9. No Significant Structural Changes Without a Plan

Before substantial migration or architectural work, report:

CURRENT STATE
ARCHITECTURAL OWNER
RELEVANT LOCKED DECISIONS
PROBLEMS FOUND
PROPOSED CHANGES
CURRENT PATH → TARGET PATH
SIMPLIFICATION OPPORTUNITIES
RISKS
VERIFICATION PLAN

For major structural work, wait for user approval before implementation.

10. Architecture V2 Source Boundary

Migrated application source belongs under:

src/

The target core source domains are:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

Do not create new top-level source domains casually.

Do not create speculative empty future-feature folders.

11. Legacy Source

Historical root-level source areas include:

app/
course-data/
math-helpers/
page-sections/
shared-types/
ui/

These are legacy Architecture V1 locations.

They remain active during migration.

Do not treat their structure as the preferred V2 convention.

Do not add new permanent architecture to them unless required temporarily for
compatibility.

12. Migration Rule

Do not perform a mass rewrite.

Use bounded migrations:

AUDIT
→ MAP
→ APPROVE
→ MIGRATE
→ VERIFY
→ DOCUMENT
→ COMMIT

Forensic migration mapping should include:

CURRENT PATH
PURPOSE
IMPORTS / DEPENDENCIES
EXPORTS
CONSUMERS
CURRENT PROBLEMS
PROPOSED OWNER
PROPOSED V2 PATH
ACTION
RISK / COMPATIBILITY

Standard actions:

KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN
TEMPORARY ADAPTER
DEFER
13. Naming Rules

VecEd-owned architectural folders and descriptive source files use PascalCase
where practical.

Examples:

Assessments
PaperWorkspace
National5Maths
AssessmentCreatorPage.tsx
CourseRegistry.ts

React hooks use:

useCamelCase

Next.js URL route folders may use lowercase/kebab-case.

14. Numbered Folder Rule

Number folders only when order is genuinely meaningful.

Approved examples:

01-Numerical
02-Algebraic
03-Geometric

and:

01-SkillsFilters
02-SkillsTree

Do not number unrelated domains decoratively.

15. Avoid Generic Buckets

Do not introduce generic dumping grounds such as:

Helpers
Utils
Shared
Common
Misc

without explicit architectural justification.

A file should live with the domain which owns its responsibility.

Do not recreate legacy:

shared-types
math-helpers

under new generic names.

16. File Decomposition Rule

VecEd prefers small, coherent files where each file represents a meaningful
responsibility.

Do not split code merely to reduce line count.

Do not create micro-files with no independent conceptual value.

Do not preserve giant components merely because they already exist.

17. Next.js page.tsx Rule

Next.js route files such as:

page.tsx

must remain thin framework/routing wrappers.

Substantial page implementation belongs in descriptive page files such as:

AssessmentCreatorPage.tsx
ClassesPage.tsx
AssessmentsLibraryPage.tsx

Never give an instruction which refers only to:

page.tsx

when multiple route files exist.

Use the full route path or descriptive implementation filename.

18. Canonical VecEd UI Vocabulary

Use these terms consistently:

HeaderBar
TopBar
HUDBar
Panel
Workspace
Drawer
Popover
Control
Filter
Field
Pill
Button
Picker
Status
Indicator
Modal

Do not invent synonyms where one of these already describes the interface.

19. HeaderBar Rule
HeaderBar

means the global VecEd website header.

It owns:

logo;
global navigation;
global Settings entry point.

It does not own Assessment Creation-specific behaviour.

20. TopBar Rule
TopBar

means the Assessment Creation-specific upper control bar.

It is not the global HeaderBar.

Known responsibilities include:

Assessment Name;
Class;
Assessment Date;
P1/P2 view;
Zoom;
Page Navigation.
21. Assessment Creation Naming

The legacy term:

Builder

is deprecated Architecture V2 terminology.

The complete page is:

AssessmentCreatorPage

The central paper surface is:

PaperWorkspace

The lower assessment region is:

HUDBar

Do not perform a blind global Builder rename.

Rename files according to actual responsibility during migration.

22. Assessment Creation Target Ownership

The conceptual target is:

src/Assessments/Creation/
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

Visible UI is generally organised by physical product region.

Shared domain behaviour is organised by responsibility.

Do not duplicate shared state across physical regions.

23. Skills Tree Ownership Boundary

This boundary is mandatory:

Courses/<Course>/SkillsTree

owns:

educational curriculum definition;
categories;
skills;
concepts;
ordering.
Assessments/Creation/SkillsPanel/02-SkillsTree

owns:

rendering;
interaction;
expand/collapse;
selection UI;
generic Skills Tree behaviour.

Do not hard-code National 5 Maths curriculum into generic Skills Tree UI.

24. Course Ownership

Course-specific knowledge belongs under:

src/Courses/

Assessment Creation consumes the active Course.

It is not fundamentally a National 5 Maths-specific Builder.

Future Courses should be sibling implementations.

Conceptually:

Courses/
├── CourseRegistry.ts
├── CourseDefinitionTypes.ts
├── National5Maths/
└── HigherMaths/        # only when actually implemented

Do not create Higher Maths placeholder folders now.

25. Question Generation Boundary
Assessments/Creation/Questions

owns generic assessment question workflow.

Courses/<Course>/QuestionGeneration

owns Course-specific mathematical generator knowledge.

Do not collapse these responsibilities.

26. Classes Ownership

The Classes domain owns class data and class-specific behaviour.

Assessment Creation may select/use classes.

It does not own the underlying Class model.

Do not duplicate Class representations.

27. UI Architecture

There is one top-level visual domain:

src/UI/

with two distinct systems:

UI/
├── Application/
└── Documents/
28. UI/Application

Owns teacher-facing VecEd application visuals.

Examples:

theme;
colours;
typography;
spacing;
motion;
shadows;
HeaderBar;
SettingsDrawer.
29. UI/Documents

Owns generated assessment-document visuals.

Examples:

document typography;
page dimensions;
page layout;
question spacing;
page frame;
cover/formula presentation.

Do not mix generated-document visual truth with application chrome.

30. One Visual Source of Truth

Do not introduce competing theme, typography, colour or global UI systems.

Architecture V2 should converge duplicate legacy UI authorities into one
coherent system.

Not every local pixel value must become a global token.

Centralise genuinely reusable visual decisions.

31. Settings Ownership

Settings are separated by what they affect.

Global application settings:

UI/Application/SettingsDrawer

Assessment settings:

Assessments/Creation/AssessmentSettings

Workspace settings:

Assessments/Creation/PaperWorkspace

A small contextual workspace settings panel is a:

Popover

not another global Drawer.

32. Global Settings Button Rule

The global HeaderBar Settings button always represents global application
settings.

Do not make its meaning change depending on the current page.

Do not use hidden feature-specific browser events as the default settings
communication mechanism.

33. Persistence Rule

Persistence should be owned explicitly.

Do not scatter direct storage calls throughout visible components where an
owning persistence module can exist.

Existing localStorage behaviour must be preserved during Architecture V2 unless
an explicit migration is approved.

Source-file renames do not automatically rename persisted keys.

34. No New State Library During Architecture V2

Do not introduce a new global state-management library merely as part of this
refactor.

First:

identify existing state;
establish ownership;
remove duplication;
simplify current React coordination.

A future state-library decision requires separate justification.

35. No Automatic Backend Migration

Architecture V2 does not automatically replace localStorage with:

a database;
server persistence;
cloud accounts.

Storage technology changes are separate product/architecture decisions.

36. Neutral Exam Terminology

Generic internal architecture should avoid unnecessary awarding-body-specific
branding.

Prefer neutral terms where appropriate, such as:

Exam
OfficialPastPaper
CandidateNumber
SourceQuestionCatalog
SourceMarkingSchemeCatalog
ExamTypography
ExamPageFrame

Do not perform blind global renames of persisted or externally meaningful
identifiers.

Neutral naming does not itself resolve copyright/trademark/licensing issues.

37. Strong Existing Organisation Should Be Preserved

Architecture V2 does not mean rewriting everything.

Existing concepts identified as strong include:

SourceQuestionCatalog
SourceMarkingSchemeCatalog
meaningful curriculum-area grouping

Preserve useful organisation where it already has clear ownership and
discoverability.

38. Dead-Code Rule

Do not delete code based only on:

old-looking names;
empty-looking imports;
superficial search.

Before deletion:

inspect;
trace references;
consider framework behaviour;
consider persistence;
identify replacement/obsolescence.

Once confidently dead, deletion is preferred over migrating obsolete code.

39. Simplification Rule

During migration, actively flag:

duplicate state;
duplicate data;
duplicate visual systems;
dead code;
oversized components;
misleading names;
over-fragmented hooks;
hidden cross-feature events;
obsolete compatibility layers.

Do not silently implement major behavioural changes without approval.

40. Scope Rule

Do not expand a bounded refactor into unrelated work because of:

while we're here...

Record useful discoveries.

Finish the approved scope.

If a new issue blocks the current migration, surface it explicitly.

41. Product Change vs Refactor Change

Do not silently combine:

architecture refactor

with:

product redesign

If refactoring exposes a design opportunity, present it separately.

Preserve current user-facing behaviour unless change is approved.

42. Architecture Change Control

If a proposed implementation conflicts with a locked decision:

Stop.

Identify:

Relevant LD decision
Technical conflict
Consequences
Proposed amendment

Request approval.

Do not silently drift architecture.

43. Verification Requirement

After a bounded migration, run relevant checks.

Consider:

TypeScript
production build
lint
development runtime
manual feature testing
persistence
document output
Course behaviour

Use clear result language:

PASS
PASS WITH PRE-EXISTING WARNINGS
FAIL
NOT APPLICABLE
NOT YET TESTED
44. Diff Review Requirement

Before declaring structural work complete:

inspect the diff;
check accidental unrelated changes;
confirm old files were removed where intended;
confirm no unintended duplicate source remains.
45. Documentation Update Requirement

After meaningful structural migration:

Update:

Docs/RepositoryMap.md
Docs/RefactorLedger.md

Update:

Docs/Architecture.md
Docs/LockedDecisions.md

only when architecture or locked decisions actually change.

46. Commit Rule

Prefer bounded, descriptive commits.

Examples:

docs: establish VecEd Architecture V2 workflow
refactor: migrate global HeaderBar
refactor: migrate Assessment Creation TopBar
fix: restore page navigation after TopBar migration

Avoid vague commit messages.

47. Do Not Falsely Mark Migration Complete

A file move alone is not completion.

Completion requires relevant:

imports repaired;
type/build checks;
behaviour verification;
documentation updates.

If V2 code still relies significantly on legacy implementation, record the area
as:

MIGRATION IN PROGRESS
48. Current Refactor Status Source

Do not hard-code current migration progress into assumptions.

Read:

Docs/RefactorLedger.md

at the start of a substantial session.

It is the authoritative live refactor status.

49. End-of-Session Handoff

For significant work, do not leave important project state trapped only in the
conversation.

Before finishing:

update RepositoryMap where needed;
update RefactorLedger;
identify the commit;
identify remaining legacy dependencies;
record the next action.

Use the handoff format in:

Docs/ChatGPTWorkflow.md
50. Before Declaring Work Complete

Check:

 Correct branch confirmed.
 Target implementation inspected.
 Relevant locked decisions followed.
 Required behaviour preserved.
 No accidental second source of truth introduced.
 No generic bucket added without justification.
 No speculative architecture added.
 Relevant verification completed.
 Diff inspected.
 RepositoryMap updated if structure changed.
 RefactorLedger updated if migration status changed.
 Architecture/LockedDecisions updated only if actually changed.
 Next action is clear.
51. Mandatory Behaviour for Future AI Sessions

A future AI assistant working on VecEd must:

read before editing;
inspect before guessing;
respect locked decisions;
distinguish current legacy code from target V2 architecture;
preserve behaviour;
trace dependencies before moving/deleting files;
use precise file paths;
use established product vocabulary;
flag meaningful simplification opportunities;
avoid unnecessary architectural debate;
avoid scope creep;
verify work;
keep repository documentation current.
52. What Future AI Sessions Must Not Do

Do not:

invent repository files;
assume target V2 folders already exist;
treat legacy naming as the desired convention;
work directly on main during the refactor without explicit instruction;
create a duplicate V2 repository;
move all legacy source into Legacy/;
create generic Helpers/Utils/Shared dumping grounds;
recreate SharedTypes;
recreate generic BuilderLogic;
keep giant page.tsx implementations;
refer ambiguously to page.tsx;
call HeaderBar and TopBar the same thing;
rename PaperWorkspace to PDFWorkspace;
put workspace settings into global SettingsDrawer;
hard-code N5 curriculum into generic Skills Tree UI;
introduce a new state library without approval;
introduce a new backend merely because persistence code moved;
create placeholder folders for future features;
delete significant code without tracing it;
change public routes accidentally;
silently alter persisted keys;
silently change locked architecture.
53. Current Architecture V2 Motto

When deciding where code belongs:

Organise by what the product is, not by how the code happened to be written.

When deciding whether to preserve old structure:

Preserve behaviour, not historical accidents.

When deciding between several valid conventions:

Follow the established VecEd convention.

When deciding whether to create another source of truth:

Do not.

When deciding whether to refactor broadly:

Change the smallest coherent thing, verify it, then continue.

54. Final Instruction

VecEd should have one architectural identity regardless of how many separate
developers or ChatGPT conversations contribute to it.

Do not treat each new conversation as permission to redesign the repository.

Read the established project memory.

Understand the current implementation.

Continue the architecture deliberately.

Leave the repository easier for the next contributor to understand.