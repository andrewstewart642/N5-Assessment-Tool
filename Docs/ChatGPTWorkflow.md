VecEd ChatGPT Workflow

Document type: AI-assisted development operating manual
Architecture version: Architecture V2
Status: Active
Applies to: ChatGPT-assisted VecEd development
Purpose: Provide a repeatable, low-risk workflow for investigation, implementation, refactoring, verification, documentation and handoff.

1. Purpose

VecEd is developed substantially through AI-assisted development sessions.

Separate conversations are useful, but continuity must come from the repository rather than from reconstructing old chats.

This document defines:

HOW TO WORK

It does not define the architecture itself.

Use:

Docs/Architecture.md

for architecture and dependency rules.

Use:

Docs/LockedDecisions.md

for settled architectural decisions.

Use:

Docs/RepositoryMap.md

for current physical repository state.

Use:

Docs/RefactorLedger.md

for migration history and durable handoff.

Use:

AGENTS.md

as the repository-level working contract.

2. Core Working Model

For substantial repository work, use:

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
WRITE / MOVE / REPLACE
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
    ↓
COMMIT

Do not use:

USER ASKS FOR CHANGE
        ↓
GUESS FILE
        ↓
PATCH RANDOM CODE

3. Mandatory Documentation Startup

Before substantial Architecture V2 work, read in this order:

1. AGENTS.md
2. Docs/LockedDecisions.md
3. relevant sections of Docs/Architecture.md
4. relevant sections of Docs/RepositoryMap.md
5. relevant history/status in Docs/RefactorLedger.md

Read this workflow when detailed operating procedure is required.

Do not reconstruct the architecture from legacy filenames or old conversation history alone.

4. Documentation Precedence

For VecEd-specific decisions:

1. explicit current user instruction
2. AGENTS.md
3. Docs/LockedDecisions.md
4. Docs/Architecture.md
5. Docs/RepositoryMap.md
6. Docs/RefactorLedger.md
7. current source implementation
8. historical implementation convention

If source conflicts with current Architecture V2 documentation, investigate whether the source is transitional or whether the documentation is stale.

Do not automatically change architecture to match a historical implementation accident.

5. Confirm the Working Branch

Before significant source work, confirm the active branch when it is not already obvious.

Current Architecture V2 branch:

refactor/architecture-V2

Known-good branch:

main

Frozen reference:

archive/25-08-2026-baseline

Do not make active V2 changes to the frozen archive.

If the terminal prompt already clearly shows the correct branch, do not ask for redundant confirmation.

6. Local Working Tree Is Authoritative During Active Refactoring

The local working tree may be newer than any connected remote repository.

During active uncommitted work, prefer:

local grep
local TypeScript
local build
local runtime/browser behaviour
local git diff

when deciding what currently exists or whether a consumer remains.

Remote source is useful for pushed history and context.

It is not authoritative for uncommitted local state.

Do not claim that a local file is dead merely because remote search cannot find a consumer.

7. Establish Working-Tree State Before Mutation

Before meaningful structural work, inspect:

git status --short

Understand any existing modifications before adding new ones.

Do not casually overwrite, revert, absorb or stage unrelated changes.

For a bounded migration, know:

what was already modified
what this migration intends to modify
what must remain untouched

8. Prefer Read-Only Audit Before Mutation

When ownership or consumers are uncertain, start with read-only inspection.

Useful tools include:

cat
sed -n
grep -RIn
find
git status --short
git --no-pager diff

Before running a mutation, explain:

what will change
why it will change
which files are involved
what will remain untouched

The user should be able to understand the migration before executing it.

9. Do Not Ask for Information the Repository Can Answer

Do not ask:

Where is this file?

if repository inspection can answer it.

Do not ask:

Is this imported anywhere?

if search can answer it.

Do not ask:

Should this be PascalCase?

when the convention is already locked.

Use questions for:

product intent
approval
behavioural choices
privacy choices
ambiguous requirements
local-only runtime evidence

not routine repository archaeology.

10. Before Editing a Meaningful Responsibility

Inspect:

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
routing involvement
framework significance

Then answer:

What does this code actually do?

and:

Which domain owns that responsibility?

Do not decide destination from filename alone.

11. Responsibility Mapping

For a meaningful migration, establish:

CURRENT PATH
CURRENT PURPOSE
IMPORTANT DEPENDENCIES
CONSUMERS
PROBLEMS
OWNER
TARGET PATH
ACTION
RISKS
VERIFICATION

Possible actions include:

KEEP
REWRITE
MOVE
RENAME
SPLIT
MERGE
CONSOLIDATE
DELETE
MOVE OUT OF DOMAIN
TEMPORARY ADAPTER
DEFER

Not every change needs a formal table.

Use enough analysis to make the ownership decision reliable.

12. Ownership Model

Use responsibility to determine location.

High-level ownership:

app/Assessments/
→ generic assessment workflow

app/Classes/
→ class data and class workflows

app/Courses/
→ educational and Course-specific knowledge

app/UI/Application/
→ interactive application presentation

app/UI/Documents/
→ generated-document presentation

app/DeveloperTools/
→ runtime developer functionality

Tools/
→ repository tooling and historical migrations

Do not move a file merely because one consumer imports it heavily.

13. Runtime Source Root

All runtime application source lives beneath:

app/

Current high-level source areas are:

app/[...route]/
app/Assessments/
app/Classes/
app/Courses/
app/DeveloperTools/
app/UI/
app/layout.tsx
app/page.tsx

There is no separate runtime source tree outside app/.

Do not create a second competing application source root.

14. Product Structure Is Not Route Structure

Public URLs and source ownership are separate concerns.

For example:

/create-assessment/builder

is routed to:

app/Assessments/Creation/AssessmentCreatorPage.tsx

Do not create a parallel feature tree merely to mirror the URL.

Application routes are primarily dispatched through:

app/[...route]/page.tsx

The route dispatcher is thin.

Feature implementation remains with the owning product domain.

15. Next.js Special Filenames

Inside app/, filenames such as:

page.tsx
layout.tsx
route.ts
loading.tsx
error.tsx
not-found.tsx
template.tsx
default.tsx

have framework meaning.

Do not use them casually inside product folders.

Ordinary page implementations should use descriptive names such as:

AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx

unless a genuine Next.js route/framework boundary is intended.

16. Preferred Migration Technique

Where practical, prefer write-new migration.

old implementation remains intact
        ↓
write clean owner
        ↓
type-check
        ↓
switch consumer
        ↓
type-check
        ↓
build / browser verify
        ↓
search old implementation
        ↓
delete when proven dead
        ↓
verify again

This is usually safer than mutating the only working implementation while simultaneously moving it.

17. When Moving Is Appropriate

A direct move or rename may be appropriate when:

implementation is already architecturally sound
only ownership/path is wrong
behaviour is small and obvious
import repair is low risk
rewriting would add no value

Architecture V2 does not require rewriting good code merely to prove refactoring occurred.

18. Temporary Adapters

Adapters may be used when the canonical owner is established but not every consumer can move at once.

A good adapter is:

old import/API
    ↓
thin translation or re-export
    ↓
canonical owner

It must not duplicate the implementation.

Adapters are scaffolding, not permanent architecture.

Once consumers are migrated:

search
verify
delete adapter

19. Compatibility Is Not Automatically Dead Code

Comments containing words such as:

legacy
compatibility
transitional
backwards compatibility

do not prove that code should be deleted.

Compatibility may support:

saved assessments
class persistence
localStorage keys
old data shapes
active event wiring
Course metadata

Trace the actual contract first.

20. Whole-File Replacement Is the Default Manual Editing Strategy

For a normal-sized source file, provide the complete replacement file.

Do not make the user perform a long sequence of tiny edits when one clean replacement is safer.

Complete replacements reduce:

missed edits
wrong insertion points
malformed imports
partial migrations
formatting drift
conversation overhead

Always state the exact repository-relative path.

21. Surgical Edits

Use surgical edits when:

the file is genuinely very large
AND
the required change is genuinely tiny

A surgical instruction must include:

exact repository-relative path
distinctive start text
exact replacement
distinctive end/next boundary

Avoid ambiguous instructions such as:

Replace the code ending at the next }.

22. Automation Must Remain Understandable

Automation is acceptable for clearly mechanical work.

Examples:

repetitive import-prefix replacement
removing the same first-line directive from a verified file list
moving a coherent directory tree

Before automation:

show the exact scope
show the exact transformation
explain why it is mechanical

Avoid large unexplained scripts that combine auditing, movement, rewriting and deletion.

Prefer visibility over cleverness.

23. One Coherent Change at a Time

For risky migration work, proceed in understandable checkpoints.

Example:

audit
→ create replacement
→ type-check
→ switch consumer
→ type-check
→ search old owner
→ delete
→ build
→ browser check

This keeps failures attributable.

Do not stack many unrelated structural changes before verification.

24. TypeScript Verification

Routine bounded verification:

npx tsc --noEmit

Expected successful result:

no output

Silence means success for this command.

Do not ask the user to rerun it merely because it printed nothing.

25. Production Build Verification

Use:

npm run build

after substantial boundaries such as:

route changes
major implementation switches
document architecture changes
multiple coordinated migrations
large ownership changes
pre-commit checkpoints

A successful type-check is not always enough.

26. Development Runtime Verification

Use:

npm run dev

when browser behaviour must be checked.

Test the changed responsibility, not every feature after every tiny edit.

After major architecture work, perform a broader smoke test.

27. Next.js Generated-Type Recovery

Route changes can leave stale generated .next route validators.

If source routing has changed and TypeScript errors point only to stale generated route types, use an appropriate regeneration path such as:

npx next typegen
npx tsc --noEmit

or:

rm -rf .next
npm run build

Never manually edit:

.next/

28. VS Code Stale Diagnostics

If:

npx tsc --noEmit

passes but VS Code still shows old diagnostics after moves or renames, use:

Ctrl+Shift+P
Developer: Reload Window

before assuming the source is still broken.

29. Git Pager Behaviour

Some Git commands may open the less pager.

A terminal showing:

:

at the bottom is usually waiting inside the pager, not frozen.

Press:

q

to exit.

For verification commands, prefer:

git --no-pager diff --check
git --no-pager diff --cached --check
git --no-pager diff

when pager behaviour would be distracting.

30. CRLF Warnings

On Windows, Git may report:

LF will be replaced by CRLF the next time Git touches it

This is a line-ending warning, not automatically a diff error.

For whitespace validation use:

git --no-pager diff --check

or:

git --no-pager diff --cached --check

Distinguish warnings from actual whitespace errors.

31. Browser Smoke Tests

After substantive source architecture work, useful checks include:

Home
Assessment Setup
Assessment Creator
paper switching
question generation
question regeneration
question editing
question removal
preview rendering
Exam / Compact / Answers switching
worked answers
zoom
page navigation
HUD behaviour
marks/timing
quality notes
save state
Compile navigation
Compilation
My Assessments
My Classes
Class Details

Test the areas reasonably affected by the migration.

For final Architecture V2 sign-off, test the major end-to-end flows.

32. Document Rendering Requires Visual Verification

Changes beneath:

app/UI/Documents/
app/Courses/<Course>/Documents/
app/Assessments/Compilation/

may affect visible generated output.

Visually verify relevant:

page dimensions
page scaling
margins
corner marks
marks margin
candidate boxes
cover layout
formula layout
question spacing
footers
Turn over presentation
pagination

Physical document appearance is product behaviour.

33. Deletion Happens Last

Preferred deletion sequence:

WRITE / ESTABLISH REPLACEMENT
        ↓
SWITCH CONSUMER
        ↓
VERIFY
        ↓
SEARCH OLD SYMBOL / PATH
        ↓
DELETE
        ↓
TYPE-CHECK AGAIN
        ↓
BUILD / RUNTIME CHECK

Never delete first merely because the target architecture intends to replace something.

34. Broad Search Before Deletion

Before deleting an old file, search by more than one clue where appropriate.

Search:

exported symbol
component name
filename
compatibility alias
historical alternate name
route reference
registry key
event name
persisted field/key

Example:

grep -RInE 'OldSymbol|AlternateOldName' app \
  --exclude-dir=.next \
  --exclude-dir=node_modules

A narrow path-only search is not dead-code proof.

35. Self-Reference-Only Results

A strong deletion signal is:

repository-wide search
→ matches occur only inside the old implementation itself

Then still consider:

framework discovery
dynamic imports
registries
string lookup
persistence
route dispatch
browser events

If those do not apply, deletion is usually appropriate.

Verify again afterwards.

36. Empty Folder Cleanup

After obsolete files are deleted, remove empty folders when useful.

Do not keep empty historical signposts merely because they once had meaning.

Do not remove a parent folder that still contains active responsibilities.

37. Course Migration Workflow

Distinguish:

generic Assessment workflow

from:

Course-specific educational knowledge

Examples:

assessment question workflow
→ app/Assessments/

mathematical generator rules
→ app/Courses/<Course>/

SkillsPanel interaction
→ app/Assessments/Creation/SkillsPanel/

curriculum definition
→ app/Courses/<Course>/Skills/

Course document content
→ app/Courses/<Course>/Documents/

generic generated-document primitive
→ app/UI/Documents/

38. Course Contracts

Generic features should consume Course knowledge through the canonical Course architecture where practical.

Current generic Course owners include:

app/Courses/CourseTypes.ts
app/Courses/CourseCatalog.ts
app/Courses/CourseRegistry.ts
app/Courses/CourseAssessmentConfig.ts
app/Courses/Papers/
app/Courses/Selection/

Do not bypass these contracts merely because importing a concrete Course file is quicker.

39. CourseId Ownership

CourseId is owned by:

app/Courses/CourseTypes.ts

Consumers should import it from its owner.

Do not create convenience re-exports from unrelated domains.

40. Course Registry API

Use canonical Course Registry terminology:

COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs

Do not reintroduce retired compatibility aliases unless a real compatibility requirement appears.

41. National 5 Maths Question Architecture

National 5 Maths historical exam evidence lives beneath:

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/

with:

Questions/
MarkingSchemes/

Generated question/answer implementation lives beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/

with:

QuestionWriting/
AnswerWriting/
AnswerMethods/

Do not recreate the retired Question Bank architecture.

42. Avoid Course-Specific Generic UI

When generic UI contains logic such as:

if (course === "National5Maths") {
  // ...
}

ask whether the variation belongs in:

CourseAssessmentConfig
Course Documents
Course paper rules
Course skill data

Do not mechanically remove every Course condition.

Establish the correct owner first.

43. No Hypothetical Course Architecture

Future Higher or Advanced Higher support should influence boundary quality.

It should not create:

empty Course trees
placeholder document folders
fake configuration fields
unused generator registries

Build only actual requirements.

44. Classes Workflow

Class-owned functionality belongs beneath:

app/Classes/

Classes should obtain Course-specific skill knowledge through:

SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree

Do not make Classes depend directly on a concrete National 5 Maths skills file when the Course abstraction can provide the data.

45. Application UI Workflow

For interactive visual changes, first determine whether the responsibility is:

global application UI

or:

feature-specific UI

Global application visual infrastructure belongs beneath:

app/UI/Application/

Feature-specific presentation normally stays with its owning product feature.

Do not centralise every colour, spacing value or component merely because it is visual.

46. Generated-Document Workflow

For generated document visuals, identify the correct layer:

generic document primitive
→ app/UI/Documents/

qualification-family convention
→ app/UI/Documents/Templates/<Family>/

Course-specific document content/rule
→ app/Courses/<Course>/Documents/

assessment sequence / compilation workflow
→ app/Assessments/

Preserve the dependency direction:

generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers

47. Application UI and Document UI Stay Separate

Code beneath:

app/UI/Documents/

should not depend on interactive application chrome.

Do not make generated documents depend on:

navigation
settings drawers
hover state
application-only layout
global application controls

An Assessment-owned interactive preview may use Application styling where that styling belongs to the editor experience.

48. Settings Workflow

Classify settings by what they affect.

Does it affect the whole VecEd application?
→ app/UI/Application/SettingsDrawer/

Does it affect the assessment being created?
→ app/Assessments/Creation/AssessmentSettings/

Does it affect only workspace interaction/layout?
→ app/Assessments/Creation/PaperWorkspace/

Do not classify settings based solely on which cog currently opens them.

49. Persistence Workflow

Before changing persistence behaviour, identify:

storage key
stored shape
readers
writers
normalisation
fallback behaviour
compatibility
owner

Do not rename persisted keys merely because source terminology changed.

A persistence migration is a separate deliberate change.

50. Historical Persistence Terminology Is Allowed

Persisted data may retain old terminology such as:

builder
P1
P2
legacy field names

when changing it would risk existing user data.

Source cleanliness does not override persistence compatibility.

51. Hidden Event Coupling

Prefer explicit dependencies over hidden browser-event coupling.

However, do not delete an active event bridge until all consumers have a replacement.

Migration sequence:

understand event
→ identify dispatcher
→ identify listeners
→ introduce explicit replacement
→ switch consumers
→ verify
→ delete event bridge

A hidden event may be architecturally undesirable and still be currently necessary.

52. Type Ownership

Types live with the concepts they describe.

Examples:

CourseId
→ app/Courses/CourseTypes.ts

Class types
→ app/Classes/ClassTypes.ts

Assessment types
→ app/Assessments/AssessmentTypes.ts

question content contracts
→ app/Assessments/Questions/Content/

question generation contracts
→ app/Assessments/Questions/Generation/

Do not create a global shared-types bucket for convenience.

53. Generic Helper Workflow

Do not respond to ownership uncertainty by creating:

Helpers/
Utils/
Shared/
Common/
Misc/

Instead ask:

Which domain owns this behaviour?

Place it there.

A helper function is still owned by the concept it helps.

54. Large Orchestration Files

Large orchestration files are not automatically architectural failures.

For example:

app/Assessments/Creation/AssessmentCreatorPage.tsx

may remain substantial while coordinating many independent responsibilities.

Ask:

Does this code coordinate owners?

or:

Does it secretly implement them?

Extract the second category.

Do not create meaningless wrappers solely to reduce line count.

55. Client Boundary Workflow

"use client" marks a client entry boundary.

Do not add it to every internal component or hook that uses:

useState
useEffect
useMemo
useRef
window
document
localStorage
event handlers

If the module is imported beneath a genuine client boundary, it inherits the client environment.

Goal:

deliberate client boundaries

not:

zero client directives

56. Client-Boundary Audit

When reviewing "use client":

identify where the file is imported;

determine whether it is itself an entry from a server graph;

inspect whether a parent already establishes the client subtree;

remove only genuinely redundant directives;

type-check;

build;

verify runtime behaviour where relevant.

Do not remove directives by filename pattern alone.

57. Scope Control

If an audit discovers an unrelated problem:

record it

but do not automatically expand the approved migration.

A useful discovery is not automatically the next task.

58. Product Change vs Refactor

Refactoring may expose a better product design.

Keep the two changes separate.

Use language such as:

Current behaviour can be preserved during this migration.

A separate product improvement could be:
...

Do not silently introduce a product change while presenting it as architecture cleanup.

59. When Approval Is Required

Ask before:

changing locked architecture
changing product behaviour
changing persisted data contracts
changing public URLs
introducing a significant dependency
creating a new major domain
deleting something whose usage remains uncertain
weakening privacy assumptions

Do not ask for approval for every routine implementation step inside an already-approved bounded migration.

60. Communicating Instructions

A good implementation message usually contains:

what we are doing
why
exact repository-relative path
complete replacement file or exact mechanical command
one coherent verification step
expected result

Avoid overwhelming the user with many speculative future steps.

61. Terminal Commands

Commands should be:

exact
copyable
run from repository root unless stated otherwise

State the expected result.

Useful examples:

npx tsc --noEmit

npm run build

git status --short

git --no-pager diff --check

grep -RInE 'PatternA|PatternB' app \
  --exclude-dir=.next \
  --exclude-dir=node_modules

62. Interpreting Empty Search Output

If the expected result is no references, say:

Expected: no output.

When the command returns blank output, treat that as success.

Do not make the user rerun a successful empty search without a new reason.

63. Failure Handling

If verification fails:

STOP DELETION

Do not continue deeper into the migration.

Investigate whether:

import switch is wrong
hidden consumer exists
adapter is required
generated Next types are stale
persistence assumption was incomplete
route behaviour changed
client boundary was incorrect
architecture assumption was incomplete

Repair from the last known-good boundary.

64. Commit Checkpoints

A good commit point occurs after:

bounded responsibility completed
+
type/build verification
+
relevant browser verification
+
legacy cleanup

Before committing:

git status --short
git --no-pager diff --check

Then stage:

git add -A

Validate staged diff:

git --no-pager diff --cached --check

Commit only when the staged change represents what was actually verified.

65. Do Not Mix Unrelated Changes Into a Commit

Before committing, confirm:

no unrelated files changed accidentally
intended deletions occurred
no duplicate implementation remains
generated output was not accidentally edited
documentation matches the completed boundary

A commit should tell one understandable story.

66. Documentation Timing

Do not update documentation after every tiny source edit.

Update at meaningful checkpoints such as:

canonical owner established
major legacy seam removed
bounded migration completed
architectural decision changed
handoff point reached
Architecture V2 finalisation

Documentation is durable project memory, not a keystroke diary.

67. Which Documents to Update

Use:

Docs/RepositoryMap.md
→ current physical repository

Docs/Architecture.md
→ current architecture and dependency rules

Docs/LockedDecisions.md
→ settled decisions and supersessions

Docs/RefactorLedger.md
→ migration history / handoff

Docs/ChatGPTWorkflow.md
→ development operating procedure

AGENTS.md
→ concise repository entry contract

Do not rewrite history in RefactorLedger.md merely because paths later changed.

Historical paths may be correct for the time they describe.

68. RefactorLedger Is Historical

Docs/RefactorLedger.md is intentionally different from current-state documentation.

When refreshing it:

preserve historical entries
preserve old paths when historically accurate
append final outcomes
mark migrations complete where appropriate
record the final architecture

Do not run a blind global path replacement through the Ledger.

69. End-of-Session Handoff

A significant session should leave durable context answering:

WHAT BECAME CANONICAL?
WHAT WAS REMOVED?
WHAT COMPATIBILITY REMAINS?
WHAT WAS VERIFIED?
WHAT SHOULD HAPPEN NEXT?

Use Docs/RefactorLedger.md for durable migration handoff.

Do not paste the entire conversation into project documentation.

Condense decisions and results.

70. Starting a Fresh Chat

A fresh ChatGPT conversation can begin with:

We are continuing VecEd development.

Read AGENTS.md and the Architecture V2 documentation in Docs before proposing changes.

Use Docs/RefactorLedger.md for historical migration context.

Inspect the actual current repository before editing.

Preserve working behaviour and follow the current ownership architecture.

The repository documentation should provide the rest.

71. Current Architecture V2 Source Shape

A fresh session should expect the runtime source shape:

app/
├── [...route]/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── favicon.ico
├── globals.css
├── layout.tsx
└── page.tsx

Do not assume an older source layout.

If the real repository differs, inspect before editing and determine whether documentation is stale or a new migration has occurred.

72. Current Assessment Creation Owner

Assessment Creation is owned beneath:

app/Assessments/Creation/

Main entry points:

app/Assessments/Creation/AssessmentSetupPage.tsx
app/Assessments/Creation/AssessmentCreatorPage.tsx

Major regions include:

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

Do not recreate a generic Builder architecture.

73. Current Compilation Owner

Assessment Compilation is owned beneath:

app/Assessments/Compilation/

It is separate from Creation.

Do not treat Compilation dependencies as dead merely because Creation no longer uses them.

Search repository-wide before deleting shared document or question infrastructure.

74. Current Routing Owner

Public feature URLs are resolved through:

app/[...route]/page.tsx

Current route dispatch includes:

/compile-assessment
/create-assessment
/create-assessment/builder
/my-assessments
/my-classes
/my-classes/:classId
/dev/generator-tester

The catch-all route should remain thin.

Do not create duplicate physical feature trees solely to represent these URLs.

75. Current Shared Question Preview

Shared Assessment question preview code belongs beneath:

app/Assessments/Questions/Preview/

Course-specific question writing belongs beneath the Course.

Generated-document primitives belong beneath app/UI/Documents/.

Do not collapse these three responsibilities into one generic Preview bucket.

76. Current Document Architecture

Generated documents use:

app/UI/Documents/
        ↓
app/UI/Documents/Templates/NationalQualifications/
        ↓
app/Courses/National5Maths/Documents/
        ↓
Assessment consumers

Keep generic physical-document infrastructure separate from Course-specific document content.

77. Current Developer Tools Boundary

Runtime developer functionality belongs beneath:

app/DeveloperTools/

Repository maintenance and historical migration tooling belongs beneath:

Tools/

Do not merge these concerns.

78. No Speculative Architecture

Future ideas such as:

OCR
AI marking
batch scanning
analytics
Higher Maths
Advanced Higher Maths

may influence boundary quality.

They do not justify empty placeholder folders or unused abstractions.

Build architecture when implementation exists.

79. Privacy-Sensitive Work

VecEd's pupil-data approach intentionally separates pupil IDs from teacher-local name mapping.

When working on:

Classes
assessment pupil data
storage
future scanning
future marking

do not casually move pupil names into broader or server-visible data contracts.

Changes to the privacy model require explicit product/privacy consideration.

80. Definition of a Successful Bounded Migration

A bounded migration is complete when:

canonical owner exists
consumer uses it
working behaviour is preserved
TypeScript passes
build passes where relevant
runtime behaviour passes where relevant
old references are searched broadly
obsolete source is removed
no duplicate truth remains
documentation is updated when the boundary is meaningful

If the old implementation still materially supplies the responsibility:

MIGRATION IN PROGRESS

81. Definition of a Documentation Checkpoint

A documentation checkpoint is appropriate when a future developer would materially benefit from knowing:

this owner is now canonical

or:

this legacy boundary is gone

or:

this architectural rule changed

or:

Architecture V2 reached final sign-off

82. Final Working Rule

When unsure how to proceed:

READ CURRENT DOCUMENTATION
        ↓
INSPECT REAL SOURCE
        ↓
TRACE CONSUMERS
        ↓
ESTABLISH OWNER
        ↓
MAKE ONE COHERENT CHANGE
        ↓
VERIFY
        ↓
SEARCH BEFORE DELETING
        ↓
VERIFY AGAIN
        ↓
DOCUMENT AT A MEANINGFUL CHECKPOINT

The purpose of this workflow is not only to finish Architecture V2.

It is to make future VecEd development predictable enough that a new developer or AI-assisted session can continue safely without reconstructing the project's history.