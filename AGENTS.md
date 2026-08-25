# VecEd — Repository Working Contract

**Architecture:** V2  
**Status:** Active  
**Applies to:** All developer-led and AI-assisted work in this repository  
**Purpose:** Define the mandatory rules for safely developing and refactoring VecEd

---

# 1. Read This First

Before making a meaningful repository change, read this file.

VecEd has an established Architecture V2.

Do not reconstruct the intended architecture from legacy source code.

Do not invent a new convention merely because another convention would also be reasonable.

For substantial work, read the relevant project documentation in this order:

1. `AGENTS.md`
2. `Docs/LockedDecisions.md`
3. relevant sections of `Docs/Architecture.md`
4. relevant sections of `Docs/RepositoryMap.md`
5. current status in `Docs/RefactorLedger.md`

Use:

```text
Docs/ChatGPTWorkflow.md

for the detailed development and refactor procedure.

2. Documentation Responsibilities

Each Architecture V2 document has one job.

AGENTS.md

Mandatory working rules.

Docs/LockedDecisions.md

Binding decisions which must not be casually reinterpreted.

Docs/Architecture.md

Long-lived ownership, dependency and structural architecture.

Docs/RepositoryMap.md

Current physical repository structure and migration state.

Docs/RefactorLedger.md

What has been completed, what remains, known transitional seams and the current next area.

Docs/ChatGPTWorkflow.md

Detailed working procedure for investigation, rewriting, verification, deletion and handoff.

Do not use one document as a substitute for another.

3. Documentation Precedence

For VecEd-specific decisions, use this precedence:

explicit user instruction in the current conversation;
AGENTS.md;
Docs/LockedDecisions.md;
Docs/Architecture.md;
Docs/RepositoryMap.md;
Docs/RefactorLedger.md;
current source implementation;
historical implementation convention.

Legacy source is migration evidence.

It is not architectural precedent.

4. Git Safety

The active Architecture V2 branch is:

refactor/architecture-V2

Known-good application history remains on:

main

The frozen pre-refactor archive is:

archive/25-08-2026-baseline

Do not perform normal development on the archive branch.

Before substantial Architecture V2 work, confirm the active branch.

A complete offline project backup also exists and must not be used as the normal working copy.

5. Preservation Is Acceptance Criterion Zero

Architecture V2 exists to improve the implementation without unintentionally damaging the working product.

Refactoring may:

rewrite;
move;
rename;
split;
merge;
consolidate;
simplify;
delete genuinely dead code.

Refactoring must preserve working behaviour unless a product change has been explicitly approved.

A structurally cleaner repository with lost functionality is a failed migration.

Preserve behaviour, not historical accidents.

6. Architecture V2 Is Not a File-Moving Exercise

Do not treat successful relocation as successful refactoring.

Every migrated area should be considered for:

KEEP
REWRITE
MOVE
RENAME
SPLIT
MERGE
CONSOLIDATE
DELETE
TEMPORARY ADAPTER
DEFER

Prefer meaningful ownership improvements over cosmetic path changes.

Architecture V2 should reduce unnecessary code and duplication where safely possible.

7. Preferred Migration Strategy

Where practical, prefer:

WRITE NEW
    ↓
TYPE-CHECK
    ↓
SWITCH CONSUMER
    ↓
VERIFY
    ↓
SEARCH FOR OLD REFERENCES
    ↓
DELETE LEGACY IMPLEMENTATION
    ↓
VERIFY AGAIN

This is preferred over repeatedly moving and mutating legacy files.

The old implementation should remain intact until the replacement has compiled and the consumer boundary has been switched successfully.

Temporary adapters are acceptable when they provide a controlled migration boundary.

Do not keep adapters indefinitely once all consumers have moved.

8. Inspect Before Editing

Before changing a meaningful feature:

inspect the actual implementation;
inspect relevant parent/composition files;
inspect sibling responsibilities;
trace imports;
trace exports;
trace consumers;
identify persistence involvement;
identify Course, Class, UI and Assessment dependencies;
determine the true architectural owner.

Do not infer ownership from a filename alone.

If repository access can answer a question, inspect the repository rather than asking the user to paste the source manually.

9. Local Working State Is Authoritative During Active Refactoring

The local working tree may be ahead of the connected GitHub branch.

When local commands and remote repository inspection disagree:

local grep;
local TypeScript results;
local build results;
local browser behaviour

are authoritative for the current uncommitted state.

Connected GitHub remains useful for inspection of pushed source, but must not be assumed to contain the user's newest local changes.

Never delete code solely because a remote search fails to find a consumer.

10. Dead-Code Rule

Do not delete a file because:

its name looks old;
it appears redundant;
one narrow search returns nothing;
another file appears to replace it.

Before deletion, search broadly using:

component/function name;
filename;
import path;
known aliases or adapter names.

Consider:

direct imports;
re-exports;
route usage;
framework conventions;
dynamic usage;
persistence;
compilation screens;
transitional consumers.

When confidently obsolete, delete rather than migrate dead code.

After deletion, type-check again.

11. Search the Actual Symbol Before Deletion

Deletion audits must search the real implementation, not merely an adapter path.

For example, if investigating:

DocumentPageFrame

search broadly for:

DocumentPageFrame
SQAPageFrame

rather than checking only one historical path.

Do not infer deadness from a narrower path-specific search.

12. Architecture V2 Source Domains

The intended core source architecture is:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

A runtime-only development domain such as:

src/DeveloperTools/

may exist if genuine developer-facing application functionality requires it.

It is not a mandatory core domain and should not be created speculatively.

Repository-level tooling belongs under:

Tools/

when required.

Do not create new top-level source domains casually.

Do not create speculative future-feature folders.

Create folders when actual implementation requires them.

13. Transitional Legacy Source

Historical source remains active in areas including:

app/
course-data/
math-helpers/
page-sections/
shared-types/

Some legacy areas have already been removed.

Do not add new permanent architecture to legacy folders unless a temporary compatibility boundary requires it.

Do not assume a legacy path should remain simply because current code still imports from it.

Migration status belongs in:

Docs/RepositoryMap.md
Docs/RefactorLedger.md
14. Naming Rules

VecEd-owned architectural folders use PascalCase where practical.

Examples:

Assessments
PaperWorkspace
National5Maths
SettingsDrawer

Descriptive React components use PascalCase:

AssessmentCreatorPage.tsx
AssessmentHUDBar.tsx
National5MathsCoverPage.tsx

Descriptive TypeScript modules use PascalCase where they represent named responsibilities:

CourseDocuments.ts
AssessmentQualityNotes.ts
DocumentUnits.ts

Hooks use:

useCamelCase.ts

Examples:

useAssessmentProgressRows.ts
useAssessmentQuestionState.ts

Next.js route folders may remain lowercase or kebab-case where required by URL structure.

Do not globally rename historical identifiers without understanding their consumers and persistence implications.

15. Meaningful Numbering Only

Folder numbering is permitted only where order is conceptually meaningful.

Examples:

01-Numerical
02-Algebraic
03-Geometric

and:

01-SkillsFilters
02-SkillsTree

Do not number unrelated domains decoratively.

16. Avoid Generic Buckets

Do not create architectural dumping grounds such as:

Helpers
Utils
Shared
Common
Misc

without explicit justification.

A responsibility should live with the domain which owns it.

Do not recreate legacy:

shared-types
math-helpers

under different generic names.

17. File Decomposition

Prefer small, coherent files representing meaningful responsibilities.

Do not:

preserve giant components merely because they already exist;
split code solely to reduce line count;
create micro-files with no independent conceptual value.

A file should have a clear reason to exist and a clear owner.

18. Full-File Rewrites Are Preferred

For normal-sized files, provide or implement complete replacement contents rather than asking for many small manual edits.

Use surgical changes only when:

the file is unusually large; and
the required change is genuinely tiny.

When giving a surgical edit, identify an exact distinctive start and end boundary.

Do not use an ambiguous closing brace as the only end marker.

Always identify files using complete repository-relative paths.

19. Next.js page.tsx Rule

Next.js route files should be thin framework wrappers.

Substantial implementation belongs in descriptive domain-owned page components.

Example:

app/create-assessment/builder/page.tsx
    ↓
src/Assessments/Creation/AssessmentCreatorPage.tsx

A route wrapper should normally do little more than import and render its implementation component.

Never refer generically to “page.tsx” when multiple route files exist.

Use the complete repository-relative path.

20. Product Terminology

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

Do not introduce unnecessary synonyms.

The legacy term:

Builder

is deprecated Architecture V2 terminology for the Assessment Creation feature.

Do not perform a blind global Builder rename.

Rename responsibilities as they are deliberately migrated.

21. Assessment Creation Ownership

The primary Assessment Creation domain is:

src/Assessments/Creation/

Its major responsibility groups include:

AssessmentCreatorPage.tsx
Setup/
TopBar/
SkillsPanel/
PaperWorkspace/
HUDBar/
AssessmentSettings/
Questions/
Papers/
Analysis/
Persistence/

Visible areas may be grouped according to their physical product region.

Shared assessment behaviour belongs with the domain responsibility that owns it.

Do not duplicate state merely because multiple visible areas consume it.

22. Current PaperWorkspace Rule

The canonical Assessment Creation paper workspace is:

src/Assessments/Creation/PaperWorkspace/

It must not regain dependencies on:

app/create-assessment/builder/
math-helpers/

without explicit architectural justification.

Its current V2 dependencies should flow through V2 Assessment, Course and UI ownership.

If future work introduces a legacy dependency back into this subtree, treat that as a regression unless deliberately approved.

23. Course Ownership

Course-specific educational knowledge belongs under:

src/Courses/

Assessment Creation consumes Course behaviour.

Assessment Creation does not own Course definitions.

Course responsibilities may include:

curriculum structure;
Skills Tree definitions;
question generation;
paper rules;
generated document configuration;
source-question catalogues;
source-marking-scheme catalogues.

Do not hard-code National 5 Maths knowledge into generic Assessment Creation UI.

Do not create Higher Maths placeholder architecture until actual implementation begins.

24. Skills Tree Boundary

Course curriculum definition belongs under:

src/Courses/<Course>/SkillsTree/

Generic Assessment Creation Skills Tree interaction belongs under:

src/Assessments/Creation/SkillsPanel/

The Course owns what the curriculum contains.

Assessment Creation owns how a user interacts with it while creating an assessment.

Do not merge these responsibilities.

25. Question Boundary

Generic question workflow belongs under:

src/Assessments/Creation/Questions/

Course-specific mathematical generation belongs under:

src/Courses/<Course>/QuestionGeneration/

Generated-document rendering is a separate concern again.

Do not collapse all three responsibilities into one generic question folder.

26. Classes Boundary

Class data and class-specific behaviour belong to:

src/Classes/

Assessment Creation may select and consume classes.

It does not own the underlying Class model.

Avoid duplicate Class representations.

27. UI Architecture

There is one top-level visual domain:

src/UI/

It contains two intentionally separate systems:

src/UI/
├── Application/
└── Documents/
UI/Application

Teacher-facing VecEd interface visuals.

Examples:

theme;
colours;
typography;
application controls;
HeaderBar;
SettingsDrawer.
UI/Documents

Generated assessment-document visuals.

Examples:

page dimensions;
document layout;
A4 frame;
document content rendering;
National Qualifications document templates.

Do not mix application chrome with generated-document visual truth.

28. Document Architecture

Generated documents use layered ownership.

Conceptually:

generic document primitives
        ↓
qualification-family templates
        ↓
course-specific document composition
        ↓
assessment preview / compilation

Current examples are:

src/UI/Documents/Components/A4PageFrame.tsx

src/UI/Documents/Templates/NationalQualifications/

src/Courses/National5Maths/Documents/

Generic A4 dimensions and generic document rendering do not belong to National 5 Maths.

National Qualifications visual conventions do not belong to Assessment Creation.

National 5 Maths paper-specific decisions belong to the National 5 Maths Course.

Assessment Preview consumes the Course document implementation rather than owning those visual rules.

29. Course Document Bundle

National 5 Maths currently exposes its generated document components through:

src/Courses/National5Maths/Documents/CourseDocuments.ts

with course-owned responsibilities including:

CoverPage/
FormulaSheet/
QuestionPage/

This bundle represents the intended plug-in boundary for course-specific document composition.

Do not recreate duplicate top-level National 5 Maths cover/formula/question implementations.

30. Application Theme and Visual Truth

Architecture V2 must converge on one authoritative Application visual system.

Do not introduce competing:

theme systems;
typography systems;
colour systems;
application-wide visual token systems.

Not every local pixel value needs to become a global design token.

Centralise values only when they are genuinely reusable visual decisions.

31. Settings Ownership

Global application settings belong under:

src/UI/Application/SettingsDrawer/

Assessment-specific settings belong under:

src/Assessments/Creation/AssessmentSettings/

Workspace-specific contextual controls belong with the workspace that owns them.

The global HeaderBar Settings button always means global application settings.

Do not make its semantic meaning change from page to page.

32. Persistence Ownership

Persistence must have explicit ownership.

Avoid scattering direct storage access across visible components where a persistence module can own it.

Preserve existing persistence behaviour during refactoring unless a migration is explicitly approved.

Source-code renaming does not imply storage-key renaming.

Do not replace local storage with a database, cloud account or backend merely as part of Architecture V2.

That is a separate product decision.

33. State Management

Do not introduce a new global state-management library merely because the repository is being refactored.

First:

identify existing state;
establish ownership;
remove duplication;
simplify React coordination.

Any future state-library decision requires separate justification.

34. Neutral Exam Terminology

Generic architecture should avoid unnecessary awarding-body-specific naming.

Prefer neutral concepts where appropriate, such as:

Exam
OfficialPastPaper
CandidateNumber
SourceQuestionCatalog
SourceMarkingSchemeCatalog

Qualification- or course-specific branding may remain where that identity is genuinely part of the responsibility.

Do not perform blind renames of persisted or externally meaningful identifiers.

35. Verification Cadence

After a small rewrite, split, import switch or deletion, run:

npx tsc --noEmit

Silent output means the TypeScript check passed.

After meaningful implementation switches, route changes or visual changes, also use relevant runtime verification such as:

npm run build
npm run dev

and browser-test the affected workflow.

Physical document rendering requires visual verification; TypeScript success alone is insufficient.

36. Next.js Generated-Type Recovery

Route moves can leave stale generated Next.js type files.

If a route change produces stale .next type errors, run:

npx next typegen
npx tsc --noEmit

If necessary, remove generated .next output and regenerate.

Never manually edit generated .next files.

If terminal TypeScript passes but VS Code still displays stale diagnostics, use:

Developer: Reload Window

before assuming the source is still broken.

37. Product Behaviour Smoke Tests

After visual or interactive migrations, manually test relevant behaviour.

For Assessment Creation this may include:

P1/P2 switching;
question generation;
regeneration;
editing;
assigning/removing drafts;
worked-answer views;
Exam/Compact/Answers cycling;
zoom;
page navigation;
HUD resizing;
notes;
marks/timings;
autosave state;
Compile navigation;
document rendering.

Only test behaviour relevant to the changed area.

38. Scope Control

Do not expand a bounded migration into unrelated work simply because another issue becomes visible.

Record useful discoveries.

Finish the current ownership boundary.

If a newly discovered issue blocks the migration, surface it explicitly.

Do not silently combine:

architecture refactor

with:

product redesign

Preserve current behaviour unless change has been approved.

39. Locked Decision Conflicts

If implementation evidence materially conflicts with a locked decision:

stop;
identify the exact decision;
explain the technical conflict;
explain the consequences;
propose a specific amendment;
obtain approval before violating the rule.

Do not silently drift architecture.

40. Documentation Checkpoints

Do not update the documentation after every tiny file change.

Update it at meaningful architectural checkpoints.

A good checkpoint occurs when:

a responsibility has obtained a canonical V2 owner;
a significant legacy seam has been removed;
a bounded migration has completed;
architecture or a locked decision has changed;
a new future session would otherwise struggle to reconstruct the current state.

At a checkpoint:

update RepositoryMap.md;
update RefactorLedger.md;
update Architecture.md only if architectural truth changed;
update LockedDecisions.md only if a locked decision changed or a new one was deliberately established.
41. Completion Standard

A migration is not complete merely because files have moved.

Before declaring a bounded migration complete, confirm:

the canonical owner exists;
consumers use the canonical implementation;
old references have been searched broadly;
obsolete files have been removed where appropriate;
TypeScript passes;
relevant runtime behaviour works;
no duplicate source of truth remains;
documentation accurately records the new state at the next checkpoint.

Use:

MIGRATION IN PROGRESS

when significant V2 code still relies upon a legacy implementation.

42. Working With the User

The user should not be burdened with repository work that can be inferred or inspected directly.

When giving manual instructions:

use complete repository-relative paths;
prefer whole-file replacements;
keep steps coherent;
avoid dozens of tiny edits;
give exact commands;
state the expected result;
verify before deletion.

When a giant source file requires only a tiny change, use a precise surgical edit rather than rewriting thousands of lines unnecessarily.

43. Before Ending a Significant Session

Do not leave important project state trapped only in conversation history.

At an appropriate checkpoint, record:

what became canonical;
what legacy code was removed;
what transitional dependencies remain;
what was verified;
what should happen next.

Docs/RefactorLedger.md is the authoritative handoff for refactor progress.

44. Final Rule

When uncertain:

INSPECT
TRACE
ESTABLISH OWNERSHIP
PRESERVE BEHAVIOUR
WRITE THE CLEAN OWNER
VERIFY
SEARCH
DELETE ONLY WHEN PROVEN SAFE

Architecture V2 should make VecEd easier for the next developer to understand than it was for the previous one.