# VecEd ChatGPT Workflow

**Document type:** AI-assisted development operating manual  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** All ChatGPT-assisted VecEd development  
**Primary purpose:** Provide repeatable startup, investigation, implementation, verification and handoff procedures for new ChatGPT conversations  
**Secondary purpose:** Prevent architectural drift between separate development conversations

---

# 1. Purpose of This Document

VecEd has been developed across many separate ChatGPT conversations.

That development model is useful because individual conversations can focus
deeply on one problem.

However, separate conversations create a serious architectural risk:

> A new conversation does not automatically understand every decision made in
> earlier conversations.

Architecture V2 introduces persistent repository documentation so that a new
ChatGPT conversation can recover the intended project architecture from the
repository itself.

This document defines **how ChatGPT should work with VecEd**.

It provides:

- mandatory startup procedures;
- repository-reading order;
- branch checks;
- source-inspection rules;
- refactor procedures;
- feature-development procedures;
- bug-investigation procedures;
- UI procedures;
- Course-development procedures;
- persistence procedures;
- document-rendering procedures;
- dead-code auditing procedures;
- verification procedures;
- commit/documentation procedures;
- end-of-conversation handoff procedures;
- reusable prompts which can be pasted into new ChatGPT chats.

The objective is continuity.

A new conversation should not behave like a new architect.

It should behave like another development session within the same established
project.

---

# 2. Core Principle

Every substantial new VecEd ChatGPT conversation should begin from:

```text
DOCUMENTATION
        ↓
CURRENT REPOSITORY
        ↓
TARGET FEATURE
        ↓
DEPENDENCY ANALYSIS
        ↓
PLAN
        ↓
USER APPROVAL
        ↓
IMPLEMENTATION
        ↓
VERIFICATION
        ↓
DOCUMENTATION UPDATE
        ↓
HANDOFF
```

Do not begin with:

```text
USER REQUEST
    ↓
GUESS
    ↓
EDIT FILES
```

---

# 3. Documentation Is Persistent Project Memory

The following files form VecEd's persistent architectural memory:

```text
AGENTS.md

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md
```

Each has a distinct role.

---

# 4. Documentation Responsibilities

## `AGENTS.md`

Mandatory startup and working contract.

Read first.

---

## `Docs/LockedDecisions.md`

Records decisions which have already been settled.

Do not casually reopen them.

---

## `Docs/Architecture.md`

Explains the long-form intended architecture.

Use it to understand ownership, naming and dependency philosophy.

---

## `Docs/RepositoryMap.md`

Explains where code physically lives at the current stage of migration.

Use it to distinguish:

```text
TARGET ARCHITECTURE
```

from:

```text
CURRENT IMPLEMENTATION
```

---

## `Docs/RefactorLedger.md`

Explains:

- current migration phase;
- what has already moved;
- what remains;
- known risks;
- current next action.

---

## `Docs/ChatGPTWorkflow.md`

This file.

Explains how the development conversation itself should operate.

---

# 5. Documentation Precedence

For VecEd-specific decisions, use the following precedence:

1. explicit user instruction in the current conversation;
2. `AGENTS.md`;
3. `Docs/LockedDecisions.md`;
4. `Docs/Architecture.md`;
5. `Docs/RepositoryMap.md`;
6. `Docs/RefactorLedger.md`;
7. current source implementation;
8. historical source conventions.

A current user instruction may deliberately change an earlier decision.

If it does, identify the conflict and update documentation as part of the work.

Do not silently leave repository documentation inconsistent.

---

# 6. Locked Decisions Are Not Brainstorming Prompts

If `LockedDecisions.md` says:

```text
Status: LOCKED
```

do not respond by casually proposing alternatives.

Example of incorrect behaviour:

> The project currently uses PascalCase, but kebab-case might be cleaner.

That issue has already been decided.

The correct behaviour is:

> PascalCase is locked for VecEd-owned architecture, so I will follow it.

A locked decision should only be reopened when:

- the user explicitly asks to reconsider it; or
- a genuine technical conflict is discovered.

---

# 7. Technical Conflict With a Locked Decision

If implementation evidence reveals that a locked decision creates a material
technical problem:

Do not silently violate it.

Use this structure:

```text
Locked decision:
LD-XXX

New technical evidence:
...

Conflict:
...

Consequences if current rule is retained:
...

Possible amendment:
...

Recommendation:
...

Do you want to reconsider LD-XXX?
```

Implementation pauses until the architectural conflict is resolved where the
decision materially affects the requested work.

---

# 8. Legacy Source Is Not Architectural Authority

During Architecture V2, legacy folders may contain conventions which conflict
with target architecture.

Examples:

```text
Builder
builder-logic
builder-behaviour
shared-types
math-helpers
ui
app/ui
```

Do not conclude:

> This is the project's convention because many old files use it.

The refactor exists precisely because those conventions are being replaced.

Use:

```text
LockedDecisions
Architecture
RepositoryMap
```

to determine intended ownership.

Use legacy code to determine current behaviour.

---

# 9. Never Assume Target Structure Already Exists

Documentation may describe target paths such as:

```text
src/Assessments/Creation/TopBar/
```

while the implementation still lives under legacy source.

Before editing:

- inspect the repository;
- confirm the actual current path;
- check RepositoryMap;
- check RefactorLedger.

Do not invent files because Architecture.md says they will eventually exist.

---

# 10. Mandatory Startup Protocol for a New VecEd Chat

Before substantial repository work, a new ChatGPT conversation should:

1. read `AGENTS.md`;
2. read the relevant locked decisions;
3. read the relevant Architecture sections;
4. read the relevant RepositoryMap sections;
5. read the current RefactorLedger status;
6. confirm the active Git branch;
7. inspect the actual current implementation of the target area;
8. trace important imports/exports/consumers;
9. summarise understanding;
10. propose a plan before editing.

If the user has asked only a conceptual question which does not require source
changes, full repository inspection may not be necessary.

Use judgement.

---

# 11. Mandatory Branch Check

Before significant implementation during Architecture V2:

Confirm the active branch is:

```text
refactor/architecture-V2
```

unless the user has explicitly moved the project to another approved branch.

Do not assume the branch based on previous conversations.

---

# 12. Working Tree Awareness

Before structural work, determine whether unrelated changes already exist.

The desired starting condition is ideally:

```text
known branch
+
understood working tree
+
known last good commit
```

If unrelated modifications are present:

Do not casually overwrite them.

Understand what they are before proceeding.

---

# 13. Do Not Ask the User to Repeat Repository Information That Can Be Inspected

If GitHub or repository access is available:

Inspect the relevant source.

Do not ask:

> Can you paste the file?

when the file can be retrieved directly.

Do not ask:

> What does this hook import?

when imports can be inspected.

Questions should be reserved for:

- product intent;
- ambiguous desired behaviour;
- architectural choices requiring user approval;
- information that cannot be determined from source.

---

# 14. Read Enough Context Before Editing

A single file often does not contain enough information for safe changes.

Before editing a feature, inspect:

- its parent composition;
- its local sibling files;
- shared state;
- imported types;
- relevant persistence;
- relevant Course data;
- important consumers.

The required breadth depends on the task.

---

# 15. Trace Imports Before Moving Files

Before a structural move:

Determine:

```text
What does this file import?
What imports this file?
What does it export?
Are there dynamic references?
Are there path aliases involved?
```

Do not move first and discover dependency shape afterwards.

---

# 16. Understand Behaviour Before Refactoring It

Before breaking apart a large component:

Identify:

- visible controls;
- state;
- callbacks;
- side effects;
- persistence;
- derived values;
- shared dependencies;
- route dependencies;
- Course dependencies.

The purpose of decomposition is conceptual clarity, not arbitrary extraction.

---

# 17. Standard Response Before Significant Editing

After investigation and before implementation, ChatGPT should normally provide
a concise summary containing:

```text
What I found
Current owner
Problem
Proposed V2 owner
Files affected
Behaviour to preserve
Main risks
Implementation sequence
Verification plan
```

Then obtain approval if the change is substantial or architectural.

---

# 18. Small Mechanical Changes

For very small, clearly bounded, non-architectural changes, extensive
pre-approval may not be necessary.

Examples:

- correcting a typo;
- changing one copy string;
- fixing one obvious local styling error.

However:

Even small changes must respect existing architecture and source ownership.

---

# 19. Architecture V2 Refactor Workflow

Use the following workflow for migration work.

---

# 20. Refactor Step 1 — Define the Boundary

Select one bounded area.

Examples:

```text
HeaderBar
TopBar
SkillsFilters
Theme system
Paper timing
```

Avoid scope such as:

```text
refactor the whole Builder
```

unless the current task is specifically forensic mapping rather than code
movement.

---

# 21. Refactor Step 2 — Audit the Complete Area

Inspect:

- all files in the target feature;
- parent composition;
- child components;
- hooks;
- types;
- persistence;
- shared dependencies;
- consumers.

Record observations.

---

# 22. Refactor Step 3 — Build the Forensic Map

Use:

| Current Path | Purpose | Dependencies | Consumers | Problem | New Owner | New Path | Action | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Standard actions:

```text
KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN
TEMPORARY ADAPTER
DEFER
```

---

# 23. Refactor Step 4 — Identify Simplification Opportunities

Ask:

- Is anything dead?
- Is state duplicated?
- Is data duplicated?
- Are two files performing the same job?
- Is one file doing several unrelated jobs?
- Are several files pretending to be separate responsibilities when they are
  really one?
- Is any helper name hiding a domain responsibility?
- Is there invisible event coupling?
- Is persistence scattered unnecessarily?
- Is Course-specific behaviour leaking into generic UI?

Discuss material opportunities before implementation.

---

# 24. Refactor Step 5 — Define Behaviour That Must Survive

Write down what users can currently do.

Example for TopBar:

```text
rename assessment
select class coverage
choose assessment date
switch P1/P2 viewing
change zoom
navigate pages
```

That becomes the migration acceptance checklist.

---

# 25. Refactor Step 6 — Define Compatibility Requirements

Check whether the migration affects:

```text
localStorage
saved assessments
classes
URLs
Course IDs
question IDs
generated documents
settings
theme preferences
```

A file rename may be safe while an internal persisted string rename is not.

---

# 26. Refactor Step 7 — Propose Exact V2 Destination

The destination must match ownership.

Examples:

```text
global navigation
→ UI/Application/HeaderBar

Assessment Date visible control
→ Assessments/Creation/TopBar/AssessmentDate

paper target calculation
→ Assessments/Creation/Papers

National 5 skill data
→ Courses/National5Maths/SkillsTree
```

Avoid destination guesses based only on old folder names.

---

# 27. Refactor Step 8 — Obtain Approval

Before substantial structural editing, present the mapping.

Do not begin moving dozens of files while the user is still reviewing the
architecture.

---

# 28. Refactor Step 9 — Implement in a Bounded Change

Perform only the approved migration scope.

Do not opportunistically rewrite unrelated areas unless required for the move
to compile.

If a newly discovered architectural issue materially changes scope:

Stop and surface it.

---

# 29. Refactor Step 10 — Verify

Use relevant checks.

Potential checks:

```text
TypeScript
production build
lint
development runtime
manual UI behaviour
persistence
document output
Course resolution
```

Do not declare success based solely on files compiling when visible behaviour
could still be wrong.

---

# 30. Refactor Step 11 — Inspect the Diff

Before completion:

- review changed files;
- check unexpected changes;
- ensure old files were actually removed where intended;
- ensure no accidental duplicate source was introduced.

---

# 31. Refactor Step 12 — Update Documentation

At minimum consider:

```text
RepositoryMap.md
RefactorLedger.md
```

Update:

```text
Architecture.md
LockedDecisions.md
```

only if architecture itself changed.

---

# 32. Refactor Step 13 — Commit

Use a clear commit boundary.

Example:

```text
refactor: migrate Assessment Creation TopBar
```

Do not wait until ten unrelated migrations are mixed together.

---

# 33. Refactor Step 14 — Record Handoff State

At the end of the work:

Record:

- what changed;
- verification;
- commit;
- remaining legacy dependency;
- next migration.

This goes into RefactorLedger where appropriate.

---

# 34. Feature Development Workflow

After the core Architecture V2 migration, or when the user explicitly approves
feature development during it, use this process.

---

# 35. Feature Step 1 — Identify the Owner

Before creating files, answer:

> Which existing domain owns this feature?

Possible owners include:

```text
Assessments
Classes
Courses
UI/Application
UI/Documents
```

Then identify the feature-level owner beneath that domain.

---

# 36. Feature Step 2 — Check for Existing Sources of Truth

Before adding:

- state;
- types;
- tokens;
- Course data;
- persistence;
- document layout;

check whether an authoritative owner already exists.

Do not solve a local problem by creating a second source of truth.

---

# 37. Feature Step 3 — Determine Whether the Feature Is Generic or Course-Specific

Ask:

> Does this behaviour apply to Assessment Creation generally, or only to one
> Course?

Example:

```text
Skills Tree row rendering
→ generic Assessment Creation UI

definition of "Fractions"
→ National5Maths Course data
```

---

# 38. Feature Step 4 — Determine Whether It Is App UI or Document UI

Ask:

> Does the teacher interact with this as part of the VecEd application, or is
> this part of the generated assessment document?

Application visuals:

```text
UI/Application
```

Document visuals:

```text
UI/Documents
```

Feature-specific visible components remain with their owning feature while
consuming shared UI sources of truth.

---

# 39. Feature Step 5 — Name Using Product Vocabulary

Before creating a new name:

Check established vocabulary.

Examples:

```text
Panel
Workspace
Drawer
Popover
Control
Filter
Field
Pill
Picker
Status
Modal
```

Do not invent:

```text
FlyoutWidgetTray
```

when the established concept is a Popover.

---

# 40. Feature Step 6 — Avoid Speculative Architecture

Do not add folders for possible future expansion unless current implementation
actually requires them.

Create the simplest structure which has correct ownership.

---

# 41. Bug Investigation Workflow

Bug fixes should begin with cause analysis, not random edits.

---

# 42. Bug Step 1 — Reproduce the Report Conceptually

Clarify:

- expected behaviour;
- actual behaviour;
- route/screen;
- trigger;
- whether it is persistent;
- whether it affects saved data.

If the user's description is already precise, do not ask unnecessary
questions.

---

# 43. Bug Step 2 — Read Relevant Architecture

Determine the intended owner before searching randomly.

Example:

If the issue is:

> wrong Skills Tree content

check Course data.

If:

> skill row cannot expand

check SkillsTree UI behaviour.

---

# 44. Bug Step 3 — Trace the Data/State Path

Follow:

```text
source
→ transformation
→ state
→ component
→ visible output
```

Identify the first point at which reality diverges from expected behaviour.

---

# 45. Bug Step 4 — Distinguish Root Cause From Symptom

Do not patch a downstream symptom if upstream state is wrong.

Example:

If the UI displays the wrong marks because paper targets are calculated
incorrectly:

Fix Papers logic.

Do not hard-code a correction into HUDBar display.

---

# 46. Bug Step 5 — Minimise Scope

Fix the root cause with the smallest coherent change.

Do not refactor an unrelated subsystem merely because it is nearby.

---

# 47. Bug Step 6 — Verify Regression Risk

Test:

- reported bug;
- adjacent behaviour;
- persistence if relevant;
- other consumers of the changed logic.

---

# 48. Bug Step 7 — Document Structural Discoveries

If the bug reveals a genuine architecture issue:

Record it.

Do not silently turn a bug fix into a repository redesign.

---

# 49. UI Work Workflow

When changing application UI:

---

# 50. UI Step 1 — Identify Physical Owner

Ask where the teacher sees the feature.

Examples:

```text
global nav
→ HeaderBar

assessment upper controls
→ TopBar

left skill controls
→ SkillsPanel

central paper interaction
→ PaperWorkspace
```

---

# 51. UI Step 2 — Check Shared Visual Sources

Before hard-coding:

- colours;
- typography;
- spacing;
- radii;
- motion;
- shadows;

inspect `UI/Application`.

Reuse authoritative values where appropriate.

---

# 52. UI Step 3 — Keep Domain Rules Out of Presentation

A visual component may display data.

It should not redefine the underlying domain rule.

Example:

TopBar may display P1/P2.

It should not independently invent the Course's paper structure.

---

# 53. UI Step 4 — Preserve Established Terminology

If the feature is a:

```text
Popover
```

do not call it:

```text
Popup
```

merely because that name feels locally convenient.

---

# 54. UI Step 5 — Avoid Giant Component Regression

If a new visible region begins accumulating many meaningful controls:

Split it by recognisable feature.

Do not recreate another `SettingsPanel.tsx`-style mega-component.

---

# 55. Document UI Workflow

Generated assessment documents have their own visual architecture.

---

# 56. Document UI Step 1 — Determine Whether the Rule Is Truly Document-Level

Examples:

```text
page dimensions
question spacing
exam typography
cover page frame
```

Likely:

```text
UI/Documents
```

---

# 57. Document UI Step 2 — Distinguish Preview From Document Truth

A rule should not live in PaperWorkspace merely because preview currently uses
it.

Ask whether compiled assessments also need it.

If yes, consider shared document ownership.

---

# 58. Document UI Step 3 — Distinguish Course Semantics From Presentation

Example:

```text
National 5 paper has particular educational structure
→ Course

how the page is visually rendered
→ UI/Documents
```

Do not merge these layers unnecessarily.

---

# 59. Document UI Step 4 — Verify Output

Document work should be visually verified where practical.

Check:

- layout;
- page breaks;
- question numbering;
- answer space;
- typography;
- cover/formula pages;
- printed/compiled result.

---

# 60. Course Development Workflow

When working on Course architecture or Course-specific data:

---

# 61. Course Step 1 — Identify Whether Behaviour Is Generic

Ask:

> Would this code still make sense if the active Course were Higher Maths?

If yes:

It may belong to generic application architecture.

If no:

It may be Course-owned.

---

# 62. Course Step 2 — Preserve Course Independence

Do not make generic Assessment Creation import National 5 Maths internals
directly when CourseDefinition can provide the information.

---

# 63. Course Step 3 — Preserve Navigability

Course data should remain easy to locate by educational concept.

Meaningful folders such as:

```text
01-Numerical
02-Algebraic
03-Geometric
04-Trigonometric
05-Statistical
```

are desirable where they reflect the real Course.

---

# 64. Course Step 4 — Preserve Strong Existing Catalogues

Do not dismantle:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

without a real benefit.

They are already considered positive organisational patterns.

---

# 65. Course Step 5 — Avoid UI Styling in Course Data

Course data may expose semantic category identity.

It should not become the source of literal app colours and fonts.

---

# 66. Course Step 6 — Test Through Generic Consumers

When Course definitions change, verify:

- Course resolution;
- Skills Tree;
- question generation;
- relevant paper configuration;
- source catalogue consumers.

---

# 67. Skills Tree Workflow

The Skills Tree has a particularly important ownership boundary.

---

# 68. Skills Tree UI Owner

Generic interaction/rendering belongs under:

```text
Assessments/Creation/SkillsPanel/02-SkillsTree
```

Examples:

- expand/collapse;
- category component;
- skill row;
- difficulty control;
- selection interaction.

---

# 69. Skills Tree Data Owner

Educational definitions belong under:

```text
Courses/<Course>/SkillsTree
```

Examples:

- categories;
- skills;
- concepts;
- ordering;
- IDs;
- educational relationships.

---

# 70. Skills Tree Debugging Rule

If the tree contains the wrong educational content:

Investigate Course data.

If correct content renders incorrectly:

Investigate Skills Tree UI.

Do not blur those problems.

---

# 71. Question Generation Workflow

Question generation has another critical ownership boundary.

---

# 72. Generic Assessment Question Workflow

Belongs under:

```text
Assessments/Creation/Questions
```

Potential responsibilities:

- selecting;
- adding;
- removing;
- draft coordination;
- workflow state;
- placement in assessment.

---

# 73. Course-Specific Generator Knowledge

Belongs under:

```text
Courses/<Course>/QuestionGeneration
```

Examples:

- mathematical generator families;
- Course-specific question rules;
- Course-specific parameterisation.

---

# 74. Question Generation Debugging Rule

If Assessment Creation fails to coordinate a valid generated question:

Investigate Questions workflow.

If the generated mathematical content itself is wrong:

Investigate Course QuestionGeneration.

---

# 75. Classes Workflow

Class data has its own domain.

---

# 76. Classes Ownership

Class:

- records;
- persistence;
- types;
- editing;
- normalisation;

belong under:

```text
Classes
```

---

# 77. Assessment Creation Class Selection

The control used to select class coverage may belong to TopBar.

It consumes authoritative Class data.

Do not duplicate Class models inside Assessment Creation.

---

# 78. Persistence Workflow

Persistence changes require extra caution.

---

# 79. Persistence Step 1 — Identify the Persisted Contract

Before changing code, identify:

- storage key;
- stored shape;
- current reader;
- current writer;
- compatibility assumptions.

---

# 80. Persistence Step 2 — Separate Filename From Persisted Identifier

Renaming:

```text
BuilderStorageKeys.ts
```

does not mean stored keys should also change.

Source naming and persistent contracts are separate concerns.

---

# 81. Persistence Step 3 — Preserve Existing User Data

When possible, existing data should load after refactoring.

If a persisted shape must change:

Design a migration.

Do not silently abandon old data.

---

# 82. Persistence Step 4 — Verify Refresh Behaviour

Test:

```text
save
refresh
restore
```

where relevant.

---

# 83. Theme and Global Settings Workflow

Global theme architecture is a known duplication area.

---

# 84. Theme Step 1 — Audit All Authorities Together

Do not modify one theme file in isolation without checking competing systems.

Relevant legacy sources may include:

```text
root ui/
app/ui/
GlobalSettingsContext
settings-bar
SettingsPanel appearance settings
globals.css
```

---

# 85. Theme Step 2 — Determine Authoritative Responsibility

Target principle:

```text
one theme definition
one state/provider
one persistence mechanism
one coherent token system
```

---

# 86. Theme Step 3 — Preserve User Preferences

If theme/accent preferences are persisted:

Verify they survive consolidation.

---

# 87. Theme Step 4 — Remove Obsolete Authority

Once all consumers migrate:

Delete duplicate legacy theme definitions rather than leaving dormant second
sources of truth.

---

# 88. Dead-Code Audit Workflow

Use a deliberately cautious process.

---

# 89. Dead-Code Step 1 — Identify Candidate

A candidate may be:

- unimported file;
- unused export;
- obsolete migration script;
- duplicate implementation;
- empty accidental artefact.

---

# 90. Dead-Code Step 2 — Search References

Check:

- static imports;
- dynamic imports;
- string references;
- route conventions;
- scripts;
- build configuration;
- persistence;
- external tooling where relevant.

---

# 91. Dead-Code Step 3 — Establish Replacement or Obsolescence

Ask:

- Was this functionality replaced?
- Is another implementation authoritative?
- Was it a one-off tool?
- Does Git history preserve it if deleted?

---

# 92. Dead-Code Step 4 — Record

Before or during deletion, update RefactorLedger where the removal is
architecturally meaningful.

---

# 93. Dead-Code Step 5 — Verify

Run relevant checks after deletion.

Never assume an unreferenced-looking file cannot affect framework behaviour.

---

# 94. Root Artefact Cleanup Workflow

For suspicious files such as:

```text
n5-assessment-tool@0.1.0
next
npm
```

use:

```text
inspect contents
→ search references
→ inspect package scripts
→ establish origin if possible
→ verify safe
→ record
→ delete
```

Do not delete solely because they look silly.

---

# 95. Repository Tooling Workflow

For migration/maintenance scripts:

Ask:

> Is this useful ongoing tooling or completed one-off machinery?

If ongoing:

```text
Tools/
```

may be appropriate.

If complete and no longer useful:

Deletion may be better.

---

# 96. New File Creation Checklist

Before creating a file, ask:

1. Who owns this responsibility?
2. Does an existing file already own it?
3. Does an existing folder already describe it?
4. Is the name product-oriented?
5. Does folder context make part of the filename redundant?
6. Is this genuinely a new file responsibility?
7. Would adding it recreate a generic bucket?
8. Is it Course-specific?
9. Is it Application UI or Document UI?
10. Is it speculative?

---

# 97. New Folder Creation Checklist

Before creating a folder:

1. Does it represent a real responsibility?
2. Are there enough related files to justify the grouping?
3. Does an existing owner already fit?
4. Is the name precise?
5. Is ordering meaningful?
6. Is the folder speculative?
7. Would it create unnecessary nesting?
8. Does it violate a locked naming decision?

---

# 98. New Top-Level Domain Checklist

A folder directly beneath `src` requires a high bar.

Before proposing one:

- prove existing domains cannot own the responsibility cleanly;
- explain why it is independently important;
- explain dependency direction;
- explain future ownership;
- treat it as an architectural decision.

Do not create casually.

---

# 99. Naming Review Checklist

Before approving a new architectural name:

- Is it PascalCase where required?
- Does it match product vocabulary?
- Does it avoid unnecessary implementation technology?
- Does folder context already communicate part of the name?
- Does it avoid generic `Utils`/`Shared` language?
- Does it conflict with an existing VecEd term?
- Does it remain sensible if implementation technology changes?

---

# 100. Large File Review

When a file becomes large, do not automatically split it.

Ask:

> Does it contain multiple independently understandable responsibilities?

If yes:

Split meaningfully.

If no:

A large coherent file can remain large.

---

# 101. Small File Review

When many tiny files accumulate:

Ask:

> Can a developer understand why each file exists independently?

If not:

Consider merging closely related implementation.

Architecture V2 prefers clarity, not maximal fragmentation.

---

# 102. Hook Review

For every substantial hook:

Ask:

- What state does it own?
- What feature/domain owns that state?
- Is the hook simply hiding orchestration complexity?
- Does it duplicate another hook?
- Does it combine unrelated behaviours?
- Should some logic become pure domain functions instead?

---

# 103. Context/Provider Review

Before introducing a React Context or provider:

Ask:

- Is the state genuinely shared?
- What domain owns it?
- Does an existing provider already represent the same concept?
- Will this create another global authority?

Do not create providers solely to avoid passing a few local props.

---

# 104. Browser Event Review

Before using:

```text
window events
custom browser events
document events
```

for feature communication:

Ask whether an explicit React/domain relationship is clearer.

Hidden cross-feature events are not preferred Architecture V2 communication.

---

# 105. Type Placement Workflow

When moving/creating a type:

Ask:

> What concept does this type represent?

Then place it with that concept's owner.

Avoid:

```text
SharedTypes
```

as the default answer.

---

# 106. Cross-Domain Contract Types

If a type genuinely crosses domains:

Determine which domain defines the contract.

The fact that two domains use a type does not automatically make it ownerless.

---

# 107. Helper Function Placement Workflow

For a function currently described as a helper:

Ask:

> What rule does it implement?

Example:

```text
calculatePaperTarget()
```

is not merely a helper.

It likely belongs to Papers.

Rename/place according to responsibility.

---

# 108. Constants Placement Workflow

Place constants with their owner.

Examples:

```text
paper timing constants
→ Papers

application animation timing
→ UI/Application/Motion

document page dimensions
→ UI/Documents/Layout
```

Do not create `GlobalConstants.ts` without genuine need.

---

# 109. Import Review

After a migration, inspect imports for architecture quality.

Warning signs:

```text
../../../..
legacy generic helpers
Course internals imported into generic UI
UI importing business logic from presentation components
circular domain imports
```

Imports should increasingly reveal clear ownership.

---

# 110. Barrel File Rule

Do not create `index.ts` everywhere.

Use a barrel only when it provides a meaningful public boundary.

Direct imports are often easier to trace.

---

# 111. Alias Rule

When `@/` eventually targets `src`, imports should become readable.

Example:

```ts
import { ... } from "@/Courses/...";
```

Do not change the alias until migration reaches a safe point.

---

# 112. Route Work Workflow

When working on routes:

---

# 113. Route Step 1 — Identify Framework Responsibility

Keep:

```text
page.tsx
layout.tsx
```

focused on Next.js concerns.

---

# 114. Route Step 2 — Delegate Product Implementation

Use descriptive page components.

Example:

```text
page.tsx
→ AssessmentCreatorPage.tsx
```

---

# 115. Route Step 3 — Do Not Rename URLs Accidentally

Moving internal code does not require changing public routes.

URL changes require explicit product decision.

---

# 116. Route Step 4 — Verify Navigation

After route changes, verify:

- direct URL;
- application navigation;
- refresh;
- dynamic params where relevant.

---

# 117. Compile Assessment Workflow

When migrating compilation:

Determine:

- route glue;
- Assessment-domain orchestration;
- document rendering;
- Course data;
- shared document layout.

Do not leave compilation owned purely by the route directory.

---

# 118. Saved Assessments Workflow

Distinguish:

```text
Assessment Creation session persistence
```

from:

```text
persistent Assessment Library
```

They are related but not necessarily the same owner.

---

# 119. Developer Tools Workflow

Distinguish:

```text
runtime developer page
```

from:

```text
repository maintenance script
```

Runtime developer functionality may live within `src`.

Repository scripts belong under root `Tools`.

---

# 120. Verification Workflow

Verification should be proportional to risk.

---

# 121. TypeScript Check

Where relevant:

```text
npx tsc --noEmit
```

or project-approved equivalent.

Record exact failure if unsuccessful.

---

# 122. Production Build

Where relevant:

```text
npm run build
```

A passing dev server alone is not equivalent to a passing production build.

---

# 123. Lint

Use the project's configured lint process where useful.

Distinguish:

- pre-existing warnings;
- newly introduced errors.

---

# 124. Manual Product Check

Test the actual affected workflow.

Code correctness is not fully established by compilation.

---

# 125. Persistence Check

When storage changes:

Test old data, new saves and refresh restoration.

---

# 126. Document Check

When document logic changes:

Inspect visible output.

---

# 127. Course Check

When Course architecture changes:

Verify the active Course still drives expected behaviour.

---

# 128. Verification Language

Use:

```text
PASS
PASS WITH PRE-EXISTING WARNINGS
FAIL
NOT APPLICABLE
NOT YET TESTED
```

Avoid vague formal reporting such as:

```text
probably okay
looks fine
```

---

# 129. Regression Handling

If a change creates a regression:

Stop stacking further refactors.

Fix or roll back first.

---

# 130. Pre-Existing Issue Handling

If an unrelated pre-existing issue is discovered:

Record it.

Do not automatically expand scope unless:

- it blocks current work; or
- the user explicitly asks to fix it.

---

# 131. Scope Expansion Rule

A useful discovery does not automatically become part of the task.

Present:

```text
Discovery
Why it matters
Whether it blocks current work
Suggested future action
```

Then continue the approved scope unless instructed otherwise.

---

# 132. Commit Workflow

ChatGPT should help maintain understandable commit boundaries.

---

# 133. Commit Content Rule

A commit should represent one coherent change where practical.

Good:

```text
refactor: migrate global HeaderBar
```

Less useful:

```text
updates
```

---

# 134. Commit Timing

Commit after:

- migration complete;
- checks pass;
- relevant documentation updated.

Do not wait until many unrelated migrations are stacked together.

---

# 135. Documentation Commit

The Architecture V2 bootstrap should have its own documentation-focused commit
before source migration begins.

---

# 136. Commit Message Style

Prefer concise imperative/category style such as:

```text
docs: establish Architecture V2 workflow
refactor: migrate Assessment Creation TopBar
fix: restore paper navigation after TopBar migration
```

---

# 137. Documentation Update Workflow

After structural change:

---

# 138. Update `RepositoryMap.md`

If physical location/ownership changed.

---

# 139. Update `RefactorLedger.md`

If migration progress changed.

---

# 140. Update `Architecture.md`

Only if a long-lived architectural principle changed.

---

# 141. Update `LockedDecisions.md`

Only when:

- a new important decision has been approved; or
- an existing locked decision has been superseded.

---

# 142. Decision Numbering Rule

New locked decisions continue from the highest existing LD number.

Do not renumber old decisions.

---

# 143. Migration Numbering Rule

New completed/planned migration entries use:

```text
MIG-001
MIG-002
...
```

Do not reuse IDs.

---

# 144. End-of-Conversation Handoff Is Mandatory for Significant Work

A long development chat should not end with all relevant state trapped in the
conversation.

Before ending:

- update RefactorLedger;
- update RepositoryMap if required;
- identify commit;
- record next action.

---

# 145. Standard End-of-Chat Handoff

Use this structure:

```text
## VecEd handoff

Branch:
...

Current migration:
...

Completed:
...

Verification:
...

Commit:
...

Remaining legacy dependencies:
...

Open questions:
...

Next recommended action:
...
```

The permanent details should also exist in repository documentation.

---

# 146. If No Code Was Changed

The handoff should still record useful architectural discoveries if they will
matter later.

Do not update documentation for trivial discussion.

Do update it for approved decisions.

---

# 147. Starting a New Chat — Minimal User Prompt

Once `AGENTS.md` is active, the user should be able to start many new
development chats with:

```text
This is the VecEd project.

Read AGENTS.md and follow its startup protocol.

Do not make any code changes yet.

My task is:

[DESCRIBE TASK]
```

The assistant should then gather context from the repository.

---

# 148. Starting a New Chat — Full Safe Prompt

Use when beginning substantial work:

```text
You are continuing development of VecEd.

Before proposing or making any repository changes:

1. Read AGENTS.md.
2. Read Docs/LockedDecisions.md.
3. Read the relevant sections of Docs/Architecture.md.
4. Read the relevant sections of Docs/RepositoryMap.md.
5. Read the current status in Docs/RefactorLedger.md.
6. Confirm the active Git branch.
7. Inspect the complete current implementation of the feature I am asking
   about.
8. Trace the relevant imports, exports and consumers.
9. Distinguish current legacy implementation from target Architecture V2.
10. Do not make edits yet.

Then report:

- your understanding of the current implementation;
- the architectural owner;
- any relevant locked decisions;
- risks;
- the files you believe are relevant;
- your proposed plan.

Wait for my approval before making substantial structural changes.

Task:

[DESCRIBE TASK]
```

---

# 149. New Architecture V2 Refactor Chat Prompt

Use when a fresh conversation is continuing the refactor:

```text
Continue the VecEd Architecture V2 refactor.

Read AGENTS.md first and follow it.

Then read:

- Docs/LockedDecisions.md
- Docs/Architecture.md
- Docs/RepositoryMap.md
- Docs/RefactorLedger.md

Confirm the active branch before source changes.

Do not edit anything yet.

Audit the target area thoroughly and produce a forensic migration map using:

CURRENT PATH
PURPOSE
IMPORTS / DEPENDENCIES
EXPORTS
CONSUMERS
CURRENT PROBLEMS
PROPOSED OWNER
PROPOSED V2 PATH
ACTION
RISK / COMPATIBILITY NOTES

Allowed actions:

KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN
TEMPORARY ADAPTER
DEFER

Explicitly identify:

- dead-code opportunities;
- duplicated state;
- duplicated data;
- naming problems;
- ownership problems;
- simplification opportunities;
- persistence risks;
- routing risks.

Do not implement the migration until I approve the map.

Target area:

[AREA]
```

---

# 150. Approved Refactor Execution Prompt

Use after a migration plan has already been approved:

```text
We have already approved the migration plan for:

[AREA]

Read AGENTS.md, the relevant locked decisions, RepositoryMap and
RefactorLedger before editing.

Re-inspect the approved target files so you are working from current source.

Implement only the approved migration.

Requirements:

- preserve existing behaviour;
- preserve persistence compatibility;
- do not introduce new generic Helpers/Utils/Shared buckets;
- follow PascalCase naming;
- keep visible UI with its physical owner;
- keep shared domain behaviour with its actual owner;
- do not expand scope unless implementation reveals a blocker;
- if a new architectural conflict appears, stop and surface it.

After implementation:

1. run relevant type/build/lint checks;
2. test the affected workflow where possible;
3. inspect the diff;
4. update RepositoryMap.md;
5. update RefactorLedger.md;
6. report any remaining legacy dependencies.

Do not change Architecture.md or LockedDecisions.md unless the approved plan
actually changes architecture.
```

---

# 151. Bug Fix Chat Prompt

```text
Investigate a VecEd bug.

Read AGENTS.md and the relevant project documentation first.

Do not edit immediately.

Bug:

[BUG DESCRIPTION]

Determine:

- expected behaviour;
- current behaviour;
- architectural owner;
- data/state path involved;
- root cause;
- whether the problem is legacy architecture, current V2 code or both;
- whether persistence, Course data or document rendering is involved.

Inspect the relevant source and consumers.

Report the root cause and proposed minimal fix before substantial changes.

Do not use the bug as an excuse for unrelated refactoring.

After fixing:

- verify the reported bug;
- check adjacent consumers;
- run relevant checks;
- update repository documentation only if structure or refactor status changed.
```

---

# 152. UI Change Chat Prompt

```text
Work on this VecEd UI change:

[UI CHANGE]

First read AGENTS.md and the relevant architecture/locked decisions.

Inspect the current implementation.

Before editing, identify:

- the physical UI owner;
- whether the feature is application UI or document UI;
- shared UI tokens it should consume;
- relevant state/domain owner;
- established VecEd vocabulary for this component.

Do not introduce duplicate theme, typography, colour or spacing sources of
truth.

Do not move domain rules into presentation components.

Preserve unrelated behaviour.

Then propose the exact file changes.
```

---

# 153. Skills Tree Chat Prompt

```text
Work on the VecEd Skills Tree.

Read AGENTS.md and the relevant Course and Assessment Creation architecture.

Keep this ownership boundary explicit:

Courses/<Course>/SkillsTree
= educational curriculum definition

Assessments/Creation/SkillsPanel/02-SkillsTree
= generic rendering and interaction

Task:

[TASK]

Inspect both sides where relevant.

Before editing, state whether the issue belongs to:

- Course data;
- generic Skills Tree UI;
- selection state;
- question workflow;
- more than one layer.

Do not hard-code National 5 Maths curriculum into generic Assessment Creation
UI.
```

---

# 154. Course Architecture Chat Prompt

```text
Work on VecEd Course architecture.

Read AGENTS.md, LockedDecisions and the Courses sections of Architecture.md and
RepositoryMap.md.

Task:

[TASK]

Before editing:

- determine what is generic and what is Course-specific;
- inspect CourseRegistry / CourseDefinition if already implemented;
- inspect the active Course implementation;
- preserve meaningful curriculum grouping;
- preserve SourceQuestionCatalog and SourceMarkingSchemeCatalog organisation
  where appropriate;
- avoid literal app visual styling in Course data;
- avoid hard-coded Course checks in generic UI where CourseDefinition can
  express the variation.

Use future Higher Maths only as an architecture test, not as a reason to create
speculative code.

Propose a plan before substantial changes.
```

---

# 155. Question Generator Chat Prompt

```text
Work on VecEd question generation.

Read AGENTS.md and the relevant Course / Questions documentation.

Task:

[TASK]

Maintain this boundary:

Courses/<Course>/QuestionGeneration
= Course-specific mathematical generator knowledge

Assessments/Creation/Questions
= generic assessment question workflow

Inspect the relevant generator family, types and consumers.

Do not move mathematical generator rules into generic Assessment Creation
merely because the Builder currently coordinates them.

Preserve question IDs/contracts and existing behaviour unless explicitly
approved.
```

---

# 156. Global Theme Chat Prompt

```text
Work on the VecEd global theme / appearance system.

Read AGENTS.md and the UI architecture first.

Before editing, audit all current authorities involved in the requested
behaviour, including relevant legacy sources such as:

- root ui/
- app/ui/
- GlobalSettingsContext
- settings-bar
- SettingsPanel appearance controls
- globals.css

Do not create another theme source.

Target principle:

one authoritative theme definition
one state/provider
one persistence mechanism
one coherent application UI token system

Preserve existing persisted preferences where possible.

Report the current duplication and proposed authoritative V2 model before
editing.
```

---

# 157. Settings Refactor Chat Prompt

```text
Refactor VecEd settings.

Read AGENTS.md and the locked settings decisions.

Inspect the complete current Settings implementation before editing.

Classify every affected setting as exactly one of:

GLOBAL APPLICATION
ASSESSMENT
WORKSPACE
OBSOLETE

Target ownership:

GLOBAL APPLICATION
→ UI/Application/SettingsDrawer

ASSESSMENT
→ Assessments/Creation/AssessmentSettings

WORKSPACE
→ Assessments/Creation/PaperWorkspace

OBSOLETE
→ delete after verification

Do not simply move the legacy giant SettingsPanel.

Produce the classification map first and wait for approval.
```

---

# 158. PaperWorkspace Chat Prompt

```text
Work on VecEd PaperWorkspace.

Read AGENTS.md and the relevant Assessment Creation and UI/Documents
architecture.

Task:

[TASK]

Before editing, distinguish:

- workspace interaction;
- workspace viewport;
- document rendering;
- document pagination/layout;
- shared paper state;
- Course-specific document rules.

PaperWorkspace owns the teacher-facing central working surface.

UI/Documents owns genuinely shared document presentation.

Papers owns shared paper-domain state.

Do not put everything historically called "preview" into PaperWorkspace
automatically.
```

---

# 159. Document Rendering Chat Prompt

```text
Work on VecEd generated document rendering.

Read AGENTS.md and the UI/Documents architecture.

Inspect all relevant consumers, including preview and compiled output.

Task:

[TASK]

Determine whether the rule is:

- shared document visual truth;
- PaperWorkspace-only interaction;
- Course-specific semantic configuration;
- Assessment state.

Avoid duplicate preview vs compiled rendering logic where one authoritative
document implementation is appropriate.

Preserve generated document behaviour unless a redesign is explicitly
approved.
```

---

# 160. Persistence Chat Prompt

```text
Work on VecEd persistence.

Read AGENTS.md and the persistence architecture first.

Task:

[TASK]

Before editing:

- identify every affected storage key;
- identify readers and writers;
- identify persisted shapes;
- identify current compatibility requirements;
- identify whether existing saved assessments/classes/settings depend on the
  data.

Source-file renames must not silently rename persisted identifiers.

Do not introduce a new database or storage technology unless explicitly
requested.

Propose a compatibility-safe plan before editing.
```

---

# 161. Classes Chat Prompt

```text
Work on the VecEd Classes domain.

Read AGENTS.md and the relevant Classes architecture.

Task:

[TASK]

Inspect current legacy class pages, persistence, types and Assessment Creation
consumers.

Maintain this boundary:

Classes
= authoritative class data/behaviour

Assessment Creation
= may select/use classes but does not own the class model

Do not duplicate class representations.

Propose the ownership/migration plan before structural changes.
```

---

# 162. Saved Assessments Chat Prompt

```text
Work on VecEd saved assessments.

Read AGENTS.md and the Assessments architecture.

Task:

[TASK]

Distinguish:

- current Assessment Creation session state;
- persistent saved assessment records;
- Assessment Library UI;
- route glue;
- compilation.

Do not make Assessment Creation the permanent owner of the entire Assessment
Library merely because it saves assessments.

Inspect persistence compatibility before changing stored structures.
```

---

# 163. Dead-Code Audit Chat Prompt

```text
Audit this VecEd area for dead or redundant code:

[AREA]

Read AGENTS.md and relevant repository documentation.

Do not delete anything initially.

For each candidate file/export, determine:

- current purpose;
- imports;
- consumers;
- dynamic references;
- framework significance;
- persistence significance;
- replacement implementation if any.

Classify each candidate:

KEEP
MERGE
MOVE
DELETE
DEFER

For DELETE candidates, provide evidence that removal is safe.

Wait for approval before deleting significant files.
```

---

# 164. Generic Folder Cleanup Prompt

```text
Audit this legacy generic folder:

[FOLDER]

Examples may include:

shared-types
math-helpers
builder-logic
builder-behaviour
shared

Read AGENTS.md and Architecture V2 ownership rules.

Do not create a renamed generic V2 equivalent.

For every file:

1. describe its actual responsibility;
2. identify consumers;
3. identify true owner;
4. propose KEEP / MOVE / RENAME / SPLIT / MERGE / DELETE;
5. propose exact V2 path;
6. identify compatibility risk.

Produce the full mapping before implementation.
```

---

# 165. Next.js Route Migration Prompt

```text
Work on VecEd Next.js route migration.

Read AGENTS.md and the locked page.tsx rules.

Task:

[TASK]

Requirements:

- page.tsx remains thin framework glue;
- substantial implementation belongs in descriptive page components;
- never refer ambiguously to page.tsx;
- do not change public URLs unless explicitly approved;
- do not mix route migration with unrelated major refactors where avoidable.

Inspect all affected navigation and direct-route consumers before editing.

After migration, verify direct URLs, navigation and refresh behaviour.
```

---

# 166. Repository Tooling Cleanup Prompt

```text
Audit VecEd repository tooling / root artefacts.

Read AGENTS.md.

Target:

[FILES OR FOLDER]

Determine whether each item is:

- active application source;
- runtime developer tooling;
- repository maintenance tooling;
- completed one-off migration tooling;
- accidental artefact;
- unknown.

Do not delete unknown items.

If ongoing repository tooling:
→ propose Tools/ destination.

If verified obsolete:
→ propose deletion.

Provide evidence before removal.
```

---

# 167. Full Repository Architecture Audit Prompt

Use rarely, when a broad state review is genuinely needed.

```text
Perform a VecEd Architecture V2 repository audit.

Read:

AGENTS.md
Docs/LockedDecisions.md
Docs/Architecture.md
Docs/RepositoryMap.md
Docs/RefactorLedger.md

Do not edit anything.

Inspect the current repository and compare actual implementation against
Architecture V2.

Report:

1. V2 areas already implemented.
2. Legacy areas still active.
3. Documentation drift.
4. Duplicate sources of truth.
5. Generic bucket folders still present.
6. Oversized orchestrators.
7. Course-specific leakage into generic UI.
8. UI/Application vs UI/Documents boundary issues.
9. Persistence risks.
10. Dead-code candidates.
11. Temporary adapters.
12. Recommended next bounded migration.

Do not propose a wholesale rewrite.
```

---

# 168. Architecture Decision Discussion Prompt

```text
We need to consider a possible VecEd architectural change.

Read AGENTS.md, LockedDecisions.md and Architecture.md first.

Proposed issue:

[ISSUE]

Before recommending any change:

- identify relevant locked decisions;
- explain the current architecture;
- explain why the existing rule may no longer be sufficient;
- distinguish implementation inconvenience from genuine architectural
  conflict;
- give the consequences of retaining the existing rule;
- give the consequences of changing it.

Do not edit source or documentation until I explicitly approve a decision.
```

---

# 169. End-of-Chat Handoff Prompt

Use when a conversation has become long and work will continue elsewhere.

```text
Prepare the VecEd handoff for the next ChatGPT conversation.

Do not rely only on chat summary.

Update the appropriate repository documentation first if changes have been
made.

Then provide:

Branch:
Last known-good commit:
Current migration ID:
Current phase:

Completed in this conversation:
...

Files moved/renamed/deleted:
...

Verification:
...

Remaining legacy dependencies:
...

Open technical questions:
...

Locked decisions changed:
...

RepositoryMap updated:
...

RefactorLedger updated:
...

Immediate next action:
...

Then give me a short copy-paste prompt I can use to start the next chat.
```

---

# 170. Resuming From a Handoff Prompt

```text
Continue VecEd development from the repository's current handoff state.

Read AGENTS.md first.

Then read:

Docs/LockedDecisions.md
Docs/Architecture.md
Docs/RepositoryMap.md
Docs/RefactorLedger.md

Use those files as the authoritative project memory.

Do not assume the previous chat summary is more current than the repository.

Confirm:

- active branch;
- current migration;
- last completed migration;
- next recorded action.

Then inspect the actual source involved in that next action.

Do not edit until you have reported your understanding and plan.
```

---

# 171. Conversation Length Management

Long technical conversations can eventually become difficult to continue
reliably.

Do not wait until architectural context is trapped only in conversation
history.

When a substantial milestone is reached:

- update repository Docs;
- commit;
- hand off cleanly.

A new conversation should resume from repository state rather than needing a
gigantic pasted transcript.

---

# 172. Repository Documentation Beats Chat Memory

If conversation history and repository documentation conflict:

Investigate which is newer.

Do not blindly trust an older chat statement over current committed project
documentation.

The repository is intended to become the persistent source of project context.

---

# 173. Current Conversation Instruction Beats Documentation When Explicit

If the user explicitly says:

> Change this locked decision.

the current instruction takes precedence.

However:

The documentation must then be updated.

Do not allow an approved architectural change to exist only in chat memory.

---

# 174. Avoid Repeated Architecture Explanation to the User

Once the documentation is established, a new ChatGPT session should not require
the user to explain again:

- why `src` exists;
- why Builder is deprecated;
- what HeaderBar means;
- why PaperWorkspace is named that way;
- why PascalCase is used;
- why generic Helpers are discouraged.

Read the repository.

---

# 175. User Questions Still Override Automation

The purpose of this workflow is not to make conversations rigid or bureaucratic.

If the user asks:

> Explain what this file does.

Answer the question.

Do not force an unnecessary 12-step workflow for a simple explanation.

Apply the full workflow when source modifications, architectural decisions or
substantial technical analysis are involved.

---

# 176. Explain Technical Work Clearly

VecEd development conversations should remain understandable.

When discussing code:

Prefer:

```text
This file owns paper timing.
```

over:

```text
This abstraction mediates temporal assessment orchestration concerns.
```

Precision does not require needless jargon.

---

# 177. File References Should Be Precise

When multiple files share a generic framework name, use full paths.

Especially:

```text
page.tsx
layout.tsx
types.ts
```

Never rely on ambiguous shorthand.

---

# 178. Proposed Paths Should Be Explicit

When recommending a move, state:

```text
CURRENT:
app/...

TARGET:
src/...
```

rather than:

> move this into the new folder.

---

# 179. Distinguish Confirmed Fact From Hypothesis

During forensic work, label uncertain conclusions.

Use:

```text
CONFIRMED
LIKELY
HYPOTHESIS
AUDIT REQUIRED
```

Do not present an inferred destination as though source inspection already
proved it.

---

# 180. Do Not Invent File Contents

If a file has not been inspected:

Do not claim what it does based only on its name.

Filename is evidence.

Source content is stronger evidence.

Consumers are stronger still.

---

# 181. Do Not Invent Current V2 Progress

If RepositoryMap or RefactorLedger says migration has not happened:

Do not refer to target files as current implementation.

---

# 182. Update Docs When Reality Changes

The documentation only works if it remains truthful.

A new chat which moves code without updating RepositoryMap undermines the entire
handoff system.

Documentation update is part of structural completion.

---

# 183. Avoid Documentation Bloat From Trivial Edits

The reverse is also true.

Do not record every:

- CSS pixel;
- copy edit;
- local variable rename;

in the RefactorLedger.

Record meaningful architectural/migration state.

---

# 184. Refactor Ledger Update Threshold

Update the ledger when work changes:

- migration status;
- legacy dependency;
- safe-to-delete status;
- open architecture question;
- migration verification;
- current phase;
- next major action.

---

# 185. RepositoryMap Update Threshold

Update the map when:

- a file/domain changes owner;
- a major folder changes path;
- a legacy area retires;
- a V2 area becomes authoritative;
- practical navigation advice changes.

---

# 186. LockedDecisions Update Threshold

Add a new locked decision when the user explicitly settles an important
architectural question which future conversations could plausibly reopen.

Do not create a new LD entry for every implementation detail.

---

# 187. Architecture Update Threshold

Update the constitution when:

- core ownership changes;
- naming philosophy changes;
- a new major domain is approved;
- dependency philosophy changes;
- product architecture changes materially.

---

# 188. ChatGPTWorkflow Update Threshold

Update this file when:

- the development process itself changes;
- a new recurring type of VecEd task needs a standard workflow;
- a recurring failure mode is discovered in AI-assisted development.

---

# 189. AGENTS Update Threshold

Keep `AGENTS.md` concise enough to function as an entry contract.

Do not copy every detail from these longer documents into AGENTS.

AGENTS should point agents to the authoritative detailed files.

---

# 190. AI Should Raise Risks, Not Manufacture Debate

A good VecEd assistant should flag:

- persistence risk;
- circular dependency;
- duplicate state;
- dead code;
- architectural conflict.

It should not manufacture debate over settled stylistic choices.

---

# 191. AI Should Prefer Evidence

When recommending a refactor, ground the recommendation in:

- file contents;
- import graph;
- runtime role;
- current ownership;
- locked architecture.

Avoid generic software-engineering advice disconnected from the repository.

---

# 192. AI Should Preserve Strong Existing Work

Architecture V2 is not based on the belief that all old code is bad.

If source is already:

- well named;
- clearly owned;
- cohesive;
- reusable;
- easy to navigate;

preserve it where appropriate.

Moving may be sufficient.

---

# 193. AI Should Challenge Historical Accidents

Conversely, do not retain:

- giant Builder files;
- duplicate themes;
- generic helpers;
- misplaced types;

merely because changing them requires effort.

The refactor exists to correct those issues.

---

# 194. AI Should Separate Product Change From Refactor Change

If architecture work creates a tempting UI redesign opportunity:

State it separately.

Example:

```text
Refactor requirement:
move workspace settings into PaperWorkspace ownership.

Optional product change:
change the settings control from X to Y.
```

Do not blur the two unless approved.

---

# 195. AI Should Separate Architecture From Technology Upgrade

Do not combine Architecture V2 with:

- framework upgrades;
- new state library;
- new database;
- dependency overhaul;

unless necessary and explicitly approved.

---

# 196. AI Should Avoid “While We're Here” Scope Creep

A refactor should not become:

> while we're here, let's rewrite everything nearby.

Record additional opportunities.

Finish the bounded task.

---

# 197. AI Should Stop When New Evidence Invalidates the Plan

If implementation reveals the approved plan was based on incorrect assumptions:

Stop.

Report the evidence.

Do not force the code to match a now-invalid plan.

---

# 198. AI Should Not Stop for Trivial Implementation Choices

Not every local implementation detail needs another user approval.

Once the architecture and migration plan are approved, reasonable internal
choices may be made within that scope.

Use judgement.

---

# 199. User Approval Threshold

Explicit approval is especially important for:

- architectural changes;
- product behaviour changes;
- route changes;
- persistence migrations;
- deleting significant code;
- changing Course contracts;
- visual redesign;
- adding dependencies;
- changing locked decisions.

---

# 200. Standard Investigation Summary Format

Before substantial implementation, a useful summary is:

```text
## Current state

...

## Ownership

...

## Relevant locked decisions

...

## Problems found

...

## Proposed changes

CURRENT → TARGET

...

## Simplification opportunities

...

## Risks

...

## Verification plan

...
```

---

# 201. Standard Completion Summary Format

After implementation:

```text
## Completed

...

## Structural changes

...

## Behaviour preserved

...

## Verification

TypeScript:
Build:
Lint:
Manual:
Persistence:
Documents:

## Remaining legacy dependencies

...

## Documentation updated

...

## Commit

...

## Next step

...
```

---

# 202. Standard Architecture Conflict Format

```text
## Architecture conflict

Locked decision:
LD-XXX

Current rule:
...

Implementation evidence:
...

Why this matters:
...

Options:

A. Preserve existing rule
Consequences:
...

B. Amend rule
Consequences:
...

Recommendation:
...

No architecture change has been made yet.
```

---

# 203. Standard Dead-Code Evidence Format

```text
Candidate:
[path]

Current purpose:
...

Imports:
...

Consumers:
...

Dynamic/framework references:
...

Replacement:
...

Persistence significance:
...

Conclusion:
KEEP / DELETE / DEFER

Confidence:
HIGH / MEDIUM / LOW
```

---

# 204. Standard File Move Format

```text
CURRENT:
...

OWNER:
...

TARGET:
...

ACTION:
MOVE / RENAME / SPLIT / etc.

WHY:
...

CONSUMERS TO UPDATE:
...

COMPATIBILITY:
...

VERIFICATION:
...
```

---

# 205. Standard Source-of-Truth Audit Format

```text
Concept:
...

Current authorities:
1. ...
2. ...
3. ...

Consumers:
...

Duplicate behaviour:
...

Proposed authoritative owner:
...

Migration path:
...

Legacy authorities to retire:
...
```

Useful for:

- theme;
- typography;
- Course definitions;
- paper state;
- persistence.

---

# 206. Standard Settings Classification Format

```text
Setting:
...

Current location:
...

Affects:
GLOBAL APPLICATION / ASSESSMENT / WORKSPACE

Target owner:
...

Persistence:
...

Consumers:
...

Migration action:
...
```

---

# 207. Standard Course Responsibility Format

```text
Responsibility:
...

Generic or Course-specific:
...

Current location:
...

Target:
...

Generic consumer:
...

Would another Course need its own implementation?
YES / NO

Reason:
...
```

---

# 208. Standard UI Ownership Format

```text
Visible feature:
...

Where teacher sees it:
...

Physical owner:
...

Shared state owner:
...

Shared visual source:
...

Course dependency:
...

Target path:
...
```

---

# 209. Standard Document Responsibility Format

```text
Rule/component:
...

Used by preview?
YES / NO

Used by compiled output?
YES / NO

Course-specific?
YES / NO

Workspace-interaction-specific?
YES / NO

Likely owner:
UI/Documents / PaperWorkspace / Course / Papers

Reason:
...
```

---

# 210. Standard Refactor Session Record

For major sessions, RefactorLedger may include:

```text
Date:
Branch:
Migration:
Starting commit:

Scope:
...

Completed:
...

Verification:
...

Unexpected discoveries:
...

Architecture conflicts:
...

Ending commit:
...

Next step:
...
```

---

# 211. Architecture V2 Current Bootstrap State

At the initial creation of this workflow:

```text
Architecture.md
→ created

LockedDecisions.md
→ created

RepositoryMap.md
→ created

RefactorLedger.md
→ created

ChatGPTWorkflow.md
→ this document

AGENTS.md
→ next file

Application source migration
→ not yet started
```

This section should not be relied upon forever.

The current authoritative migration state lives in `RefactorLedger.md`.

---

# 212. First New Chat After Documentation Bootstrap

The first source-refactor conversation after these documents are committed
should not immediately begin moving files.

Its initial job should be:

```text
FULL FORENSIC MIGRATION MAPPING
```

as recorded in the Refactor Ledger.

---

# 213. First Refactor Audit Objective

The audit should map:

```text
CURRENT FILE
→ ACTUAL PURPOSE
→ DEPENDENCIES
→ CONSUMERS
→ CORRECT OWNER
→ V2 DESTINATION
→ ACTION
```

for the selected major area.

The full repository may require several audit passes.

---

# 214. Do Not Assume Migration Order From Documentation Order

The fact that Architecture.md discusses HeaderBar before Courses does not
automatically determine migration order.

Migration order should follow dependency/risk analysis.

---

# 215. Recommended New-Chat Behaviour During Phase 1

During forensic mapping:

- read;
- search;
- trace;
- classify;
- propose.

Do not move source while the user is still approving the map.

---

# 216. Recommended New-Chat Behaviour During Later Migration

Once a migration is approved:

- re-read current source;
- implement bounded changes;
- verify;
- document;
- commit.

---

# 217. Do Not Trust Stale Handoff Information Over Current Source

If documentation claims:

```text
File X still exists
```

but repository inspection shows it has moved:

Recognise documentation drift.

Do not recreate the old file.

Update the documentation.

---

# 218. Do Not Trust Stale Source Assumptions Over Current Docs

If a previous chat remembered:

```text
TopBar should live under Components
```

but current LockedDecisions says:

```text
TopBar is a physical Assessment Creation owner
```

follow the current docs.

---

# 219. Architecture V2 Is Designed to Reduce Full-Repo Archaeology

A new chat should not re-scan every file in VecEd for every local task.

Use:

```text
Docs
→ RepositoryMap
→ targeted source inspection
```

Full scans are appropriate for:

- major audits;
- uncertain ownership;
- repository-wide migration planning.

---

# 220. Context Efficiency Rule

Read the documentation necessary to understand the task.

Do not repeatedly dump all documentation into every analysis if only one
section is relevant.

However, do not skip LockedDecisions when a structural choice is involved.

---

# 221. Maintainability Test

When choosing between two valid implementations, ask:

> Which implementation will make a future developer more likely to find the
> correct file immediately?

This is an important VecEd architecture criterion.

---

# 222. Product-Language Test

Ask:

> Can I describe this folder using the same words the user uses when pointing
> at the interface?

If yes, that is usually a strong sign for visible-feature ownership.

---

# 223. Ownership Test

Ask:

> If every current consumer disappeared, which domain would still logically own
> this concept?

That often identifies the true owner.

Example:

Even if Assessment Creation were removed, National 5 Maths curriculum would
still belong to National5Maths Course data.

---

# 224. Source-of-Truth Test

Ask:

> If this value changes, how many places should need editing?

For a true global/domain rule, the ideal answer is usually:

```text
one authoritative place
```

with consumers deriving from it.

---

# 225. Generic-Bucket Test

If the proposed folder name could contain almost anything:

```text
Utils
Shared
Common
Misc
```

stop.

The owner has probably not been identified.

---

# 226. Future-Course Test

For generic Assessment code, ask:

> Would this still be valid for another Course?

If not:

Determine whether the logic belongs under the active Course.

---

# 227. Document-vs-Workspace Test

Ask:

> If PaperWorkspace disappeared but compiled assessments still existed, would
> this rule still be required?

If yes:

It may be true document ownership rather than workspace ownership.

---

# 228. Route-vs-Product Test

Ask:

> Would this component still conceptually exist if the URL changed?

If yes:

It probably belongs outside `app`.

---

# 229. Presentation-vs-Domain Test

Ask:

> Does this code determine what is true, or only how truth is displayed?

What is true:

likely domain/data ownership.

How it is displayed:

likely presentation ownership.

---

# 230. Persistence-vs-State Test

Ask:

> Is this behaviour about the current in-memory state or about storing/restoring
> it?

Do not mix those responsibilities without reason.

---

# 231. Final New-Chat Rule

A new VecEd conversation should never need to ask:

> What architecture are we using again?

The answer is in the repository.

The job of the new conversation is to:

```text
READ IT
UNDERSTAND IT
INSPECT CURRENT SOURCE
CONTINUE IT
```

not reinvent it.

---

# 232. Final Development Rule

For every substantial change:

> Understand first.

Then:

> Assign ownership.

Then:

> Change the smallest coherent thing.

Then:

> Verify it.

Then:

> Record what changed.

This is the standard VecEd development cycle.

---

# 233. Final Refactor Rule

Architecture V2 should not be judged by how quickly files move into `src`.

It should be judged by whether those files arrive in `src` with:

- clear ownership;
- accurate names;
- reduced duplication;
- preserved behaviour;
- understandable dependencies;
- reliable documentation.

Fast migration which copies the legacy architecture is failure.

Deliberate migration which improves the system is success.

---

# 234. Final ChatGPT Instruction

A ChatGPT conversation working on VecEd is not an independent architectural
authority.

It is a temporary contributor to an established project.

Its responsibilities are to:

- understand the current project;
- respect approved decisions;
- investigate actual source;
- identify genuine problems;
- suggest improvements when evidence supports them;
- obtain approval for material architectural change;
- preserve working behaviour;
- keep documentation current;
- leave the repository easier for the next conversation to understand.

VecEd should have one architectural identity regardless of how many separate
ChatGPT conversations contribute to it.