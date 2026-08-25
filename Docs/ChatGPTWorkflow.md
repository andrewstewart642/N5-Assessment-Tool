# VecEd ChatGPT Workflow

**Document type:** AI-assisted development operating manual  
**Architecture version:** Architecture V2  
**Status:** Active  
**Applies to:** ChatGPT-assisted VecEd development
**Purpose:** Provide a repeatable workflow for investigation, implementation, refactoring, verification and handoff without losing architectural continuity between conversations

---

# 1. Purpose

VecEd is developed substantially through ChatGPT-assisted development sessions.

Separate conversations are useful, but they create a continuity problem:

> A new conversation does not automatically understand every architectural decision, completed migration or known compatibility constraint from previous work.

Architecture V2 solves this through persistent repository documentation.

This document defines **how a ChatGPT development session should operate**.

It does not define the architecture itself.

Use:

```text
Docs/Architecture.md
```

for architecture.

Use:

```text
Docs/LockedDecisions.md
```

for settled decisions.

Use:

```text
Docs/RepositoryMap.md
```

for current physical repository state.

Use:

```text
Docs/RefactorLedger.md
```

for current migration progress.

Use this file for:

```text
HOW TO WORK
```

---

# 2. Core Working Model

For substantial repository work, use:

```text
UNDERSTAND
    ↓
INSPECT
    ↓
TRACE
    ↓
ESTABLISH OWNER
    ↓
PLAN
    ↓
WRITE NEW
    ↓
TYPE-CHECK
    ↓
SWITCH CONSUMER
    ↓
VERIFY
    ↓
SEARCH BROADLY
    ↓
DELETE OLD
    ↓
VERIFY AGAIN
    ↓
DOCUMENT AT CHECKPOINT
```

Do not use:

```text
USER ASKS FOR CHANGE
        ↓
GUESS FILE
        ↓
PATCH RANDOM CODE
```

---

# 3. Mandatory Documentation Startup

Before substantial Architecture V2 work, read in this order:

```text
1. AGENTS.md

2. Docs/LockedDecisions.md

3. relevant sections of Docs/Architecture.md

4. relevant sections of Docs/RepositoryMap.md

5. current status in Docs/RefactorLedger.md
```

Read this workflow when detailed working procedure is required.

Do not reconstruct Architecture V2 from legacy filenames.

---

# 4. Documentation Precedence

For VecEd-specific decisions:

```text
1. explicit current user instruction
2. AGENTS.md
3. Docs/LockedDecisions.md
4. Docs/Architecture.md
5. Docs/RepositoryMap.md
6. Docs/RefactorLedger.md
7. current source implementation
8. historical implementation convention
```

If source conflicts with V2 documentation, investigate whether the source is simply transitional.

Do not automatically modify architecture to match legacy implementation.

---

# 5. Confirm the Working Branch

Before significant source work, confirm the active branch.

Current Architecture V2 branch:

```text
refactor/architecture-V2
```

Known-good branch:

```text
main
```

Frozen reference:

```text
archive/25-08-2026-baseline
```

Do not make active V2 changes to the frozen archive.

If the user provides a terminal prompt which already clearly shows the correct branch, do not ask them to confirm it again unnecessarily.

---

# 6. Local Working Tree vs Connected GitHub

The user's local working tree may be newer than the connected GitHub branch.

This distinction is critical.

Connected GitHub is useful for:

- inspecting pushed source;
- recovering context;
- understanding surrounding files;
- avoiding unnecessary user copy/paste.

However, during an active uncommitted migration, local results are authoritative.

Prefer:

```text
local grep
local tsc
local build
local browser behaviour
```

when determining whether the newest local implementation works or whether a legacy consumer still exists.

Do not claim a local file is dead merely because GitHub search cannot find a consumer.

Before substantial structural work, also establish whether the local working
tree already contains unrelated modifications.

Do not casually overwrite, revert or absorb changes whose purpose has not been
understood.

---

# 7. Do Not Ask the User to Paste Source You Can Inspect

If connected repository access is available:

```text
fetch the file
inspect the implementation
inspect its siblings
inspect consumers
```

before asking the user to manually provide code.

Ask the user only for information which genuinely requires:

- product intent;
- approval;
- local-only output;
- local grep results;
- compiler/build output;
- screenshots or runtime behaviour.

---

# 8. Repository Search Philosophy

Search serves different purposes.

## Remote source inspection

Use connected repository tools to inspect pushed implementation.

## Local dependency truth

Use user-run commands such as:

```bash
grep -RInE 'pattern' app src
```

for current local dependency/deletion decisions.

Local grep has repeatedly proven more reliable than remote code search during active refactoring.

---

# 9. Before Editing a Meaningful Responsibility

Inspect:

```text
target implementation
parent/composition layer
important siblings
imports
exports
consumers
persistence involvement
Course dependencies
Class dependencies
UI dependencies
routes
```

Then answer:

> What does this code actually do?

> Who should own that responsibility?

Do not decide destination from filename alone.

---

# 10. Responsibility Mapping

For a meaningful migration, establish:

```text
CURRENT PATH
CURRENT PURPOSE
IMPORTANT DEPENDENCIES
CONSUMERS
PROBLEMS
V2 OWNER
TARGET PATH
ACTION
RISKS
VERIFICATION
```

Possible actions include:

```text
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
```

Not every migration requires a giant written table.

Use enough analysis to make the ownership decision reliable.

---

# 11. Preferred Migration Technique

Where practical, prefer **write-new migration**.

Example:

```text
legacy implementation
        │
        │ remains intact
        ↓

create clean V2 owner
        ↓
npx tsc --noEmit
        ↓
switch consumer
        ↓
npx tsc --noEmit
        ↓
browser/build verification
        ↓
grep old implementation
        ↓
delete when proven dead
```

This is generally safer than physically moving the old file and repairing it while the application is broken.

---

# 12. Why Write-New Is Preferred

Writing the replacement first provides:

- an intact fallback;
- clear old/new ownership;
- easier comparison;
- smaller failure radius;
- easier rollback;
- simpler deletion auditing.

It also encourages genuine architectural rewriting rather than cosmetic relocation.

---

# 13. When Moving Is Still Appropriate

A simple move/rename may still be appropriate when:

- the implementation is already architecturally sound;
- only ownership/path is wrong;
- decomposition would add no value;
- behaviour is small and obvious;
- import repair is low risk.

Architecture V2 does not require rewriting good code merely to prove that refactoring occurred.

---

# 14. Temporary Adapters

Adapters may be used when a V2 owner has been established but legacy consumers cannot all move at once.

A good adapter:

```text
legacy import path
        ↓
thin re-export / compatibility translation
        ↓
canonical V2 implementation
```

The adapter must not duplicate the implementation.

Example principle:

```text
BuilderNote
```

may temporarily alias:

```text
AssessmentQualityNote
```

while old analysis consumers remain.

Once all legacy consumers are migrated:

```text
DELETE ADAPTER
```

---

# 15. Avoid Permanent Compatibility Architecture

A migration is not complete if every old path survives forever as an adapter.

Adapters are scaffolding.

At appropriate checkpoints:

```text
grep consumers
remove obsolete adapters
type-check
```

---

# 16. Whole-File Replacements Are the Default

When asking the user to edit a normal-sized file manually:

> provide the complete replacement file.

Do not make the user perform fifteen tiny edits when one clean rewrite is safer.

This also reduces:

- missed edits;
- incorrect insertion points;
- malformed imports;
- partial migration;
- conversation overhead.

---

# 17. Surgical Edits

Use surgical edits when:

```text
the file is genuinely very large
AND
the required change is genuinely small
```

For example, changing two imports in a 2,000-line orchestration file.

A surgical instruction must provide:

```text
complete repository-relative path
exact distinctive START text
exact replacement
exact next boundary / END text
```

Do not say:

> Replace the code ending at the next `}`.

That is too ambiguous.

---

# 18. Always Use Complete File Paths

Prefer:

```text
src/Assessments/Creation/AssessmentCreatorPage.tsx
```

not:

```text
AssessmentCreatorPage.tsx
```

when ambiguity is possible.

Never say only:

```text
page.tsx
```

Multiple Next.js route files exist.

---

# 19. File Creation Workflow

When decomposing a giant existing implementation into several new owners, prefer:

```text
1. create all new owner files

2. ensure they type-check even if temporarily unused

3. rewrite/switch the orchestration boundary

4. type-check

5. verify behaviour

6. delete old owners after grep
```

This is preferable to repeatedly mutating the giant file after every individual extraction.

---

# 20. TypeScript Verification

Routine bounded verification:

```bash
npx tsc --noEmit
```

Expected successful result:

```text
no output
```

Do not tell the user that silence means nothing happened.

For this command, silence is success.

---

# 21. When to Run TypeScript

Run TypeScript after:

- creating important new files;
- switching imports;
- replacing an owner;
- deleting legacy files;
- route changes;
- significant type changes.

Do not wait until twenty unrelated migrations have accumulated.

---

# 22. Production Build Verification

Use:

```bash
npm run build
```

after more substantial boundaries such as:

- route work;
- major implementation switches;
- document architecture changes;
- multiple coordinated migrations;
- a major checkpoint before committing.

A successful TypeScript check is not always enough.

---

# 23. Development Runtime Verification

Use:

```bash
npm run dev
```

when browser behaviour needs checking.

Relevant runtime tests should match the migrated responsibility rather than mechanically testing every feature after every small edit.

---

# 24. Next.js Route-Type Recovery

Route movement can leave stale generated `.next` validator files.

Known recovery:

```bash
npx next typegen
npx tsc --noEmit
```

If generated output remains stale, regenerate `.next`.

Never manually modify:

```text
.next/
```

---

# 25. VS Code Stale Diagnostics

If:

```bash
npx tsc --noEmit
```

passes but VS Code still shows old errors after moves/renames:

use:

```text
Ctrl+Shift+P
Developer: Reload Window
```

before assuming source remains broken.

The editor has previously retained stale diagnostics after successful migrations.

---

# 26. Browser Smoke Tests

After a visible Assessment Creation migration, relevant checks may include:

```text
route opens
P1/P2 switching
question generation
question regeneration
question editing
question removal
draft assignment
preview rendering
Exam / Compact / Answers switching
worked answers
zoom
page navigation
HUD resizing
marks/timings
quality notes
save state
Compile navigation
```

Test only what the changed area could reasonably affect.

---

# 27. Document Rendering Requires Visual Testing

Changes beneath:

```text
src/UI/Documents/
src/Courses/<Course>/Documents/
```

require more than TypeScript.

Visually verify relevant:

- page dimensions;
- page scaling;
- margins;
- corner marks;
- marks margin;
- candidate boxes;
- cover layout;
- formula layout;
- question spacing;
- footers;
- Turn over presentation.

Physical document appearance is behaviour.

---

# 28. Deletion Workflow

Deletion should normally happen last.

Use:

```text
WRITE REPLACEMENT
        ↓
SWITCH CONSUMER
        ↓
VERIFY
        ↓
SEARCH OLD SYMBOL
        ↓
DELETE
        ↓
TYPE-CHECK AGAIN
```

Never delete first merely because the new architecture intends to replace something.

---

# 29. Broad Search Before Deletion

Before deleting an old file, search by more than one clue where appropriate.

Example:

```bash
grep -RInE 'BuilderBottomHud|AssessmentProgressHud' app src
```

or:

```bash
grep -RInE 'DocumentPageFrame|SQAPageFrame' app src
```

Search:

- exported symbol;
- component name;
- filename;
- compatibility alias;
- historical alternate name.

---

# 30. Narrow Search Is Not Dead-Code Proof

A crucial lesson from the refactor:

```text
no imports found in one subtree
```

does not mean:

```text
component is unused repository-wide
```

Example:

Assessment Creation stopped using an old document frame.

Compilation still used it.

Therefore always widen the audit before deletion.

---

# 31. Self-Reference-Only Result

A strong deletion signal is:

```text
grep across app/src
→ matches occur only inside the old files themselves
```

At that point, if framework/dynamic usage is not relevant, deletion is usually appropriate.

Then run:

```bash
npx tsc --noEmit
```

again.

---

# 32. Empty Folder Cleanup

After deleting obsolete files, remove empty legacy folders where useful.

Do not remove a parent directory containing other active historical code merely because one sub-feature completed migration.

---

# 33. Preserve Active Legacy Consumers

A V2 replacement existing does not make the old implementation dead.

For example:

```text
Assessment Creation Preview
```

may use a new question renderer while:

```text
Compilation
```

still uses the old one.

Keep the old file until the final consumer moves.

---

# 34. Route Wrappers Are Special Consumers

A page implementation can move successfully while its Next.js route wrapper remains mandatory.

Before deleting/moving route files, understand which URL they register.

A missing route wrapper previously caused:

```text
/create-assessment/builder
→ 404
```

despite otherwise clean source.

---

# 35. Compilation Is a Separate Scope

The live Compilation route is:

```text
app/compile-assessment/page.tsx
```

Do not treat its dependencies as dead merely because Assessment Creation has replaced them.

Compilation should receive its own bounded migration.

When working on Creation:

```text
protect live Compilation behaviour
```

unless Compilation is explicitly the approved scope.

---

# 36. Course Migration Workflow

When migrating Course knowledge, distinguish:

```text
generic Assessment behaviour
```

from:

```text
Course-specific educational knowledge
```

Examples:

```text
question workflow
→ Assessments

mathematical generator rules
→ Courses/<Course>

Skills Tree interaction
→ Assessments/Creation

curriculum definition
→ Courses/<Course>/SkillsTree

document page sequencing
→ Assessment consumer

Course cover contents
→ Courses/<Course>/Documents
```

---

# 37. Avoid Course-Specific Generic UI

When generic UI contains:

```ts
if (course === "National5Maths")
```

ask whether the variation belongs in:

```text
CourseDefinition
CourseDocuments
Course paper rules
Course SkillsTree
```

Do not mechanically remove every Course check.

First establish the correct contract.

---

# 38. Do Not Build Hypothetical Higher Architecture

Future Higher Maths support should influence boundary quality.

It should not cause:

```text
empty Higher folders
fake CourseDefinition fields
placeholder generator registries
unused document implementations
```

Build only actual requirements.

---

# 39. Application UI Workflow

For teacher-facing visual changes, first identify whether the feature is:

```text
global application UI
```

or:

```text
feature-specific UI
```

Global visual sources belong under:

```text
src/UI/Application/
```

Feature-specific presentation generally stays with its owning feature.

Do not centralise every visual value.

---

# 40. Document UI Workflow

For generated paper visuals, identify the correct layer:

```text
generic physical page rule
→ UI/Documents

qualification-family visual convention
→ UI/Documents/Templates/<Family>

Course content/rule
→ Courses/<Course>/Documents

page sequence / preview interaction
→ Assessments
```

Do not place everything visual under the same folder.

---

# 41. Settings Workflow

Classify every setting by effect.

```text
Does it affect the whole VecEd application?
→ UI/Application/SettingsDrawer

Does it affect the generated/current assessment?
→ Assessments/Creation/AssessmentSettings

Does it affect only workspace interaction/layout?
→ PaperWorkspace
```

Do not classify settings based on which cog currently opens them.

---

# 42. Persistence Workflow

Before moving persistence behaviour, identify:

```text
storage key
stored shape
readers
writers
fallback behaviour
migration compatibility
owner
```

Do not rename stored keys merely because `Builder` has disappeared from source terminology.

Persistence compatibility is a separate contract.

---

# 43. Shared Types Workflow

Do not migrate:

```text
shared-types/
```

as one unit.

For every type, ask:

> What does this type describe?

Then move it toward that owner.

Examples:

```text
Class type
→ Classes

Assessment question type
→ Assessments

Course configuration type
→ Courses

document rendering type
→ UI/Documents or Course Documents
```

Large widely used contracts may require temporary compatibility paths.

---

# 44. Generic Helper Workflow

Do not transform:

```text
math-helpers/
```

into:

```text
src/Helpers/
```

Instead inspect each function and assign it to:

```text
Course
Assessment
Documents
other genuine owner
```

The goal is responsibility ownership, not helper-folder renaming.

---

# 45. Large Orchestration Files

Large orchestration files are not automatically errors.

For example:

```text
AssessmentCreatorPage.tsx
```

may remain substantial while it coordinates many regions.

The correct question is:

> Does this code coordinate independent owners?

or:

> Does it secretly implement them?

Extract the second category.

Do not create meaningless wrappers solely to reduce line count.

---

# 46. Choosing the Next Migration

After completing one clean boundary, audit the next consumer boundary.

Example:

```text
PaperWorkspace clean
        ↓
inspect AssessmentCreatorPage remaining legacy imports
        ↓
group by responsibility
        ↓
choose one cluster
```

Do not choose the next file randomly.

Follow dependency/ownership seams.

---

# 47. Group Legacy Imports by Responsibility

A useful audit command may be:

```bash
grep -RInE 'from "(@/app/create-assessment/builder/|@/math-helpers/|@/course-data/|@/shared-types/)' src/Assessments/Creation
```

Then classify results into groups such as:

```text
Settings
Papers
Analysis
Persistence
Course configuration
Questions
UI
```

Migrate a coherent group rather than chasing filenames one at a time.

---

# 48. Scope Control

If an audit discovers an unrelated problem:

```text
record it
```

but do not automatically expand the approved migration.

A useful discovery is not automatically the next task.

---

# 49. Product Change vs Refactor

Refactoring may reveal a better product design.

Keep these separate.

Say:

```text
Current behaviour can be preserved during this migration.

There is also a possible product improvement:
...
```

Do not silently implement the product change while claiming it was architectural cleanup.

---

# 50. When to Ask for Approval

Ask before:

- changing locked architecture;
- changing product behaviour;
- changing persisted data contracts;
- changing public routes;
- introducing new dependencies;
- creating a new major domain;
- deleting something whose usage remains uncertain.

Do not repeatedly ask approval for every routine implementation step once the user has approved a clear bounded migration.

---

# 51. When Not to Ask a Question

Do not ask the user:

> Where is this file?

if the repository can answer.

Do not ask:

> Is this imported anywhere?

if local grep can answer.

Do not ask:

> Should I use PascalCase?

when it is already locked.

Use questions for genuine decisions, not repository archaeology.

---

# 52. Communicating Instructions to the User

The user prefers concise but sufficient instructions.

A good implementation message usually contains:

```text
what we are doing
exact path
complete replacement code
one verification command
expected result
```

Avoid overwhelming the user with ten speculative future steps at once.

---

# 53. One Coherent Check at a Time

For risky migration work, proceed in coherent checkpoints.

Example:

```text
create replacement
→ tsc

switch consumer
→ tsc

grep old implementation
→ delete

browser smoke test
```

This makes failures easy to attribute.

---

# 54. Avoid Fiddly Manual Work

Prefer:

```text
create three clean files
+
replace one consumer file
```

over:

```text
make seventeen tiny edits in seven files
```

where both achieve the same architecture safely.

---

# 55. Terminal Commands

Commands should be:

- exact;
- copyable;
- run from repository root unless otherwise stated.

Examples:

```bash
npx tsc --noEmit
```

```bash
npm run build
```

```bash
npx next typegen
```

```bash
grep -RInE 'BuilderBottomHud|AssessmentProgressHud' app src
```

State what result is expected.

---

# 56. Interpreting Empty `grep`

If the expected result is no references, say explicitly:

```text
Expected: no output.
```

When the user reports blank output, treat it as a successful result rather than asking them to retry.

---

# 57. Interpreting TypeScript Silence

If:

```bash
npx tsc --noEmit
```

returns to the prompt without errors:

```text
PASS
```

Do not request additional output.

---

# 58. Build/Runtime Failure Handling

If verification fails:

```text
STOP DELETION
```

Do not continue deeper into the migration.

Use the error to determine whether:

- import switch is wrong;
- adapter is needed;
- hidden consumer exists;
- generated Next types are stale;
- the architecture assumption was incomplete.

Repair from the last known-good boundary.

---

# 59. Preserve Known-Good Boundaries

Once a subtree has been explicitly verified clean, protect that boundary.

Current example:

```text
src/Assessments/Creation/PaperWorkspace/
```

has been verified free of direct legacy Builder/math-helper imports.

Future work should not casually reintroduce them.

---

# 60. Commit Checkpoints

A good commit point occurs after:

```text
bounded responsibility migrated
+
type/build verification
+
relevant browser verification
+
legacy cleanup
```

Prefer meaningful commits rather than giant mixed snapshots.

Before committing a significant migration, review the diff.

Confirm:

- no unrelated files changed accidentally;
- intended deletions actually occurred;
- no obsolete duplicate implementation remains;
- generated files were not accidentally edited;
- the commit represents the migration that was actually verified.

The user's existing commit naming may be used if they deliberately prefer timestamp-style messages; architectural documentation should not depend on a particular cosmetic commit-message style.

---

# 61. Documentation Timing

Do **not** update documentation after every small source edit.

Update at meaningful checkpoints such as:

- completion of a major visible region;
- removal of a major legacy dependency boundary;
- establishment of a new Course/document layer;
- a locked architectural decision;
- a substantial handoff point.

Documentation should represent durable project memory, not a live keystroke diary.

---

# 62. Which Documents to Update

At a normal migration checkpoint:

```text
RepositoryMap.md
→ current physical status

RefactorLedger.md
→ completed migration / remaining work
```

Update:

```text
Architecture.md
```

only when long-lived architecture changes.

Update:

```text
LockedDecisions.md
```

only when a meaningful locked decision is established, changed or superseded.

Update:

```text
AGENTS.md
ChatGPTWorkflow.md
```

only when development operating procedure materially changes.

---

# 63. End-of-Session Handoff

A significant session should leave enough persistent context to resume safely.

The handoff should answer:

```text
WHAT BECAME CANONICAL?

WHAT WAS DELETED?

WHAT LEGACY DEPENDENCIES REMAIN?

WHAT WAS VERIFIED?

WHAT SHOULD HAPPEN NEXT?
```

Use `RefactorLedger.md` for durable migration handoff.

---

# 64. Recommended Handoff Format

A concise handoff can use:

```text
CURRENT BRANCH
refactor/architecture-V2

COMPLETED
...

CANONICAL OWNER
...

REMOVED LEGACY
...

VERIFIED
...

KNOWN ACTIVE LEGACY
...

DO NOT DELETE
...

NEXT AUDIT
...
```

Do not dump the full conversation into documentation.

Condense decisions and results.

---

# 65. Starting a Fresh Chat

A new ChatGPT conversation can be started with a short instruction such as:

```text
We are continuing the VecEd Architecture V2 refactor.

Read AGENTS.md and the Architecture V2 documentation in Docs before
proposing changes.

Use Docs/RefactorLedger.md as the current migration handoff.

Inspect the actual current repository before editing.

Preserve working behaviour and continue from the next recorded migration
boundary.
```

The repository documentation should provide the rest.

---

# 66. Fresh-Chat Assessment Creation Workflow

If resuming Assessment Creation specifically:

```text
1. read the current Ledger

2. inspect:
   src/Assessments/Creation/AssessmentCreatorPage.tsx

3. audit remaining legacy imports

4. group by responsibility

5. choose one bounded cluster

6. write the V2 owner first

7. type-check

8. switch consumers

9. verify

10. grep and delete old code
```

Do not reopen already completed PaperWorkspace migration without evidence of a regression.

---

# 67. Current Known-Good Assessment Creation Boundary

At the current checkpoint:

```text
src/Assessments/Creation/PaperWorkspace/
```

has no direct dependencies on:

```text
app/create-assessment/builder/
math-helpers/
```

Its Preview, question preview and HUD behaviour have been browser-tested successfully.

Treat that as known-good project state.

---

# 68. Current Major Protected Legacy Scope

The live Compilation feature still depends upon historical document/question code.

Do not delete merely because Creation has migrated:

```text
app/compile-assessment/page.tsx

src/UI/Documents/Components/DocumentPageFrame.tsx

app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked.tsx
```

until Compilation itself is migrated.

---

# 69. Known Good Refactor Pattern Example — HUD

The HUD migration is a useful model.

Historical dependency:

```text
PaperWorkspace
    ↓
BuilderBottomHud
    ↓
AssessmentProgressHud
```

Migration:

```text
write AssessmentQualityNotes
write AssessmentProgressPanel
write AssessmentHUDBar
write useAssessmentProgressRows
        ↓
switch PaperWorkspace / Creator consumers
        ↓
tsc
        ↓
grep old HUD names
        ↓
delete old HUD files
        ↓
grep again
        ↓
browser smoke test
```

Result:

```text
no permanent compatibility duplicate
```

This is the preferred style of Architecture V2 migration.

---

# 70. Known Failure Pattern Example — Premature Deletion

The `DocumentPageFrame` incident is the model for what not to do.

Incorrect reasoning:

```text
new document frame exists
+
Preview no longer uses old frame
=
old frame is dead
```

Reality:

```text
Compilation still consumed old frame
```

Correct lesson:

```text
NEW OWNER EXISTS
≠
OLD OWNER HAS ZERO CONSUMERS
```

Always search repository-wide before deletion.

---

# 71. Known Failure Pattern Example — Route Removal

Another important lesson:

```text
page implementation moved
≠
route wrapper unnecessary
```

When:

```text
app/create-assessment/builder/page.tsx
```

was absent, the route returned 404.

The descriptive V2 implementation does not replace the framework route entry point.

---

# 72. Known Success Pattern — Full-File Rewrite

When a component is conceptually being replaced, a fresh V2 implementation has generally proved easier to reason about than repeatedly renaming legacy internals.

Use fresh files where this improves ownership clarity.

Then delete the historical implementation after consumer verification.

---

# 73. Debugging Philosophy

When something breaks during refactor, first assume:

```text
dependency/consumer assumption may be incomplete
```

rather than immediately abandoning the target architecture.

Investigate:

```text
imports
types
route registration
generated types
persistence
hidden consumers
```

before redesigning the architecture.

---

# 74. Avoid Architectural Overreaction

One unexpected dependency does not automatically require a giant abstraction.

Solve the actual boundary.

Example:

```text
one legacy consumer remains
```

may justify:

```text
temporary adapter
```

not:

```text
new global framework
```

---

# 75. New Dependencies

Architecture V2 should not casually introduce:

- state libraries;
- new UI frameworks;
- new persistence infrastructure;
- large utility dependencies

merely to make migration easier.

A dependency change is a separate architectural decision when significant.

---

# 76. Privacy-Sensitive Work

VecEd's pupil-data model intentionally distinguishes pupil IDs from local teacher name mappings.

When working on:

```text
Classes
assessment pupil data
storage
scanning
future marking
```

do not casually move pupil names into broader/server-visible data contracts.

Changes to this model require explicit product/privacy consideration.

---

# 77. Future Feature Ideas Are Not Current Architecture

Ideas such as:

```text
OCR
AI marking
batch scanning
analytics
Higher Maths
```

may inform boundary quality.

They do not justify empty placeholder folders or speculative abstractions today.

---

# 78. Definition of a Successful Bounded Migration

A migration can be called complete when:

```text
canonical owner exists
consumer uses it
behaviour is preserved
TypeScript passes
relevant runtime behaviour passes
old references have been searched
obsolete source is removed
no duplicate truth remains
```

If legacy implementation still materially supplies the responsibility:

```text
MIGRATION IN PROGRESS
```

---

# 79. Definition of a Documentation Checkpoint

A documentation checkpoint is appropriate when a future session would materially benefit from knowing:

```text
this owner is now canonical
```

or:

```text
this legacy boundary is now gone
```

or:

```text
this architecture changed
```

The completion of PaperWorkspace legacy detachment is an example of a good documentation checkpoint.

---

# 80. Final Working Rule

When unsure how to proceed:

```text
READ THE CURRENT DOCUMENTATION
        ↓
INSPECT THE REAL SOURCE
        ↓
TRACE THE CONSUMERS
        ↓
ASK WHO OWNS THE RESPONSIBILITY
        ↓
WRITE THE CLEAN OWNER
        ↓
VERIFY BEFORE SWITCHING
        ↓
VERIFY AFTER SWITCHING
        ↓
SEARCH BEFORE DELETING
```

The purpose of this workflow is not merely to finish the current refactor.

It is to make future VecEd development predictable enough that a new ChatGPT conversation can continue the project without reconstructing its history from scratch.