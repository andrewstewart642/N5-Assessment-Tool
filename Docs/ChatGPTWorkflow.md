# N5 Assessment Tool — ChatGPT Workflow

**Document type:** AI-assisted development operating manual  
**Architecture baseline:** Architecture V2  
**Status:** Active  
**Applies to:** ChatGPT-assisted development  
**Purpose:** Provide a repeatable, low-risk workflow for investigation, implementation, refactoring, verification, documentation and handoff.

---

## 1. Purpose

The N5 Assessment Tool is developed substantially through AI-assisted development sessions.

Separate conversations are useful, but continuity should come from the repository rather than from reconstructing old chats.

This document defines:

```text
HOW TO WORK
```

It does not define architecture itself.

Use:

```text
AGENTS.md
→ first-read repository working contract

Docs/LockedDecisions.md
→ settled architectural/product-development decisions

Docs/Architecture.md
→ current architecture and dependency rules

Docs/RepositoryMap.md
→ current physical repository state

Docs/FeatureHistory.md
→ meaningful implemented feature/technical history

Docs/FutureFeatures.md
→ future ideas, planned work and deferred concepts

Docs/RefactorLedger.md
→ historical Architecture V2 migration record
```

---

## 2. Current Development Mode

Architecture V2 is substantially complete.

The default workflow is now feature-led:

```text
UNDERSTAND CURRENT BEHAVIOUR
        ↓
INSPECT CURRENT SOURCE
        ↓
IDENTIFY OWNER
        ↓
PLAN A SMALL PASS
        ↓
IMPLEMENT
        ↓
TYPE-CHECK
        ↓
BROWSER / RUNTIME VERIFY
        ↓
BUILD WHEN APPROPRIATE
        ↓
DOCUMENT AT A MEANINGFUL CHECKPOINT
        ↓
COMMIT
```

When a real structural migration is required, retain the safer migration workflow established during Architecture V2:

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
DOCUMENT
    ↓
COMMIT
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

## 3. Documentation Startup

Before substantial work, read in this order as needed:

1. `AGENTS.md`
2. relevant decisions in `Docs/LockedDecisions.md`
3. relevant sections of `Docs/Architecture.md`
4. relevant sections of `Docs/RepositoryMap.md`
5. `Docs/FeatureHistory.md` when continuing or comparing recent feature work
6. `Docs/FutureFeatures.md` when planning future work or checking whether an idea is already recorded
7. `Docs/RefactorLedger.md` only when historical migration context is relevant

Read this workflow when detailed operating procedure is required.

Do not reconstruct current architecture from historical filenames, old chat history or Refactor Ledger entries alone.

---

## 4. Documentation Precedence

For project-specific decisions:

```text
1. explicit current user instruction
2. AGENTS.md
3. Docs/LockedDecisions.md
4. Docs/Architecture.md
5. Docs/RepositoryMap.md
6. current source implementation
7. Docs/FeatureHistory.md
8. Docs/FutureFeatures.md
9. Docs/RefactorLedger.md
10. historical implementation convention
```

If source conflicts with current architecture documentation, investigate whether source or documentation is stale.

Do not automatically change architecture to match a historical implementation accident.

FutureFeatures is not approval to implement an idea.

---

## 5. Confirm the Working Branch

Before significant source work, confirm the active branch when it is not already obvious.

Current working branch:

```text
refactor/architecture-V2
```

Known-good branch:

```text
main
```

Frozen preservation reference:

```text
archive/25-08-2026-baseline
```

Do not make active changes to the frozen archive.

If the terminal prompt already clearly shows the correct branch, do not ask for redundant confirmation.

---

## 6. Local vs Connected GitHub State

The local working tree may be newer than connected GitHub.

During uncommitted local work, prefer:

```text
local grep
local TypeScript
local build
local runtime/browser behaviour
local git diff
```

when determining what currently exists.

When the user says GitHub has been refreshed/pushed, connected GitHub can again be used as the current remote source of truth.

Do not claim a local file is dead merely because stale remote search cannot find a consumer.

Be explicit when connected GitHub is behind.

---

## 7. Establish Working-Tree State Before Mutation

Before meaningful structural work, inspect:

```bash
git status --short
```

when local tooling is available or ask the user for it when genuinely necessary.

Understand existing modifications before adding new ones.

Do not casually overwrite, revert, absorb or stage unrelated changes.

For a bounded pass, know:

- what was already modified;
- what this pass intends to modify;
- what must remain untouched.

---

## 8. Prefer Read-Only Audit Before Structural Mutation

When ownership or consumers are uncertain, start with read-only inspection.

Useful techniques include:

```text
repository tree inspection
file reads
grep/search
import tracing
Git diff/status
consumer tracing
```

Before a risky structural mutation, understand:

- what will change;
- why it will change;
- which files are involved;
- what remains untouched.

For small feature/UI passes where ownership is already clear, do not turn every change into a formal migration audit.

---

## 9. Do Not Ask for Information the Repository Can Answer

Do not ask the user routine repository-archaeology questions if inspection can answer them.

Use questions for:

- product intent;
- approval;
- behavioural choices;
- privacy choices;
- ambiguous requirements;
- local-only runtime evidence.

Do not ask for:

- a path that repository inspection can find;
- import usage that search can establish;
- conventions already locked in documentation.

---

## 10. Before Editing a Meaningful Responsibility

Inspect the relevant combination of:

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
routing involvement
framework significance
```

Then answer:

> What does this code actually do?

and:

> Which domain owns that responsibility?

Do not decide destination from filename alone.

---

## 11. Responsibility Mapping

For a meaningful structural migration, establish enough of:

```text
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
MOVE OUT OF DOMAIN
TEMPORARY ADAPTER
DEFER
```

Not every feature change needs a formal table. Use enough analysis to make the ownership decision reliable.

---

## 12. Current Ownership Model

Use responsibility to determine location.

```text
app/Assessments/
→ generic assessment workflow, saving and compilation

app/MyAssessments/
→ user-facing assessment-library UI/workflow

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
```

Repository tooling is separate from runtime DeveloperTools and only needs a root `Tools/` owner if enduring tooling genuinely exists.

Do not move a file merely because one consumer imports it heavily.

---

## 13. Runtime Source Root

All runtime application source lives beneath:

```text
app/
```

Current high-level source shape:

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

Do not create a competing application source root.

---

## 14. Product Structure Is Not Route Structure

Public URLs and source ownership are separate concerns.

Example:

```text
/create-assessment/builder
```

is routed to the Assessment Creation implementation beneath:

```text
app/Assessments/Creation/
```

Public routes are preserved through rewrites in:

```text
next.config.ts
```

which dispatch into the thin:

```text
app/page.tsx
```

Do not create parallel feature trees merely to mirror URLs.

---

## 15. Next.js Special Filenames

Inside `app/`, filenames such as:

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

have framework meaning.

Do not use them casually inside product folders.

Ordinary page implementations should use descriptive names such as:

```text
AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyAssessmentsPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx
```

unless a genuine Next.js framework boundary is intended.

The PDF generation `route.ts` is an intentional server route-handler boundary.

---

## 16. Preferred Structural Migration Technique

Where practical, prefer write-new migration:

```text
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
```

This is usually safer than mutating the only working implementation while simultaneously moving it.

---

## 17. When Moving Is Appropriate

A direct move/rename may be appropriate when:

- implementation is already architecturally sound;
- only ownership/path is wrong;
- behaviour is small and obvious;
- import repair is low risk;
- rewriting would add no value.

Do not rewrite good code merely to prove refactoring occurred.

---

## 18. Temporary Adapters

Adapters may be used when the canonical owner is established but not every consumer can move at once.

A good adapter is:

```text
old import/API
    ↓
thin translation or re-export
    ↓
canonical owner
```

It must not duplicate implementation.

Adapters are scaffolding, not permanent architecture.

Once consumers are migrated: search, verify, then delete the adapter.

---

## 19. Compatibility Is Not Automatically Dead Code

Comments containing `legacy`, `compatibility`, `transitional` or `backwards compatibility` do not prove code should be deleted.

Compatibility may support:

- saved assessments;
- class persistence;
- localStorage keys;
- old data shapes;
- active event wiring;
- Course metadata;
- routing identifiers.

Trace the actual contract first.

---

## 20. Whole-File Replacement Is the Default Manual Editing Strategy

For a normal-sized source file, provide the complete replacement file.

Always state the exact repository-relative path.

Complete replacements reduce missed edits, wrong insertion points, malformed imports, partial migrations, formatting drift and conversation overhead.

---

## 21. Surgical Edits

Use surgical edits only when:

```text
the file is genuinely very large
AND
the required change is genuinely tiny
```

A surgical instruction must include:

- exact repository-relative path;
- distinctive start text;
- exact replacement;
- distinctive end/next boundary.

Avoid ambiguous instructions such as “replace until the next `}`”.

---

## 22. Automation Must Remain Understandable

Automation is acceptable for clearly mechanical work.

Before automation:

- show/understand exact scope;
- establish exact transformation;
- confirm why it is mechanical.

Avoid large unexplained scripts combining auditing, movement, rewriting and deletion.

Prefer visibility over cleverness.

---

## 23. One Coherent Change at a Time

For risky or visually sensitive work, proceed in understandable checkpoints.

For UI work, incremental screenshot-led passes are preferred to large speculative rewrites.

Keep unrelated systems outside the pass where practical.

This keeps failures attributable and avoids destabilising already-accepted behaviour.

---

## 24. TypeScript Verification

Routine bounded verification:

```bash
npx tsc --noEmit
```

Expected successful result:

```text
no output
```

Silence means success for this command.

Do not ask the user to rerun it merely because it printed nothing.

---

## 25. Production Build Verification

Use:

```bash
npm run build
```

after substantial boundaries such as:

- route changes;
- major implementation switches;
- document/PDF infrastructure changes;
- multiple coordinated migrations;
- large ownership changes;
- pre-release/pre-commit infrastructure checkpoints.

A successful type-check is not always enough.

For small visual iteration, TypeScript + browser verification may be sufficient between passes.

---

## 26. Development Runtime Verification

Use:

```bash
npm run dev
```

when browser behaviour must be checked.

Test the changed responsibility rather than every feature after every tiny edit.

After major architecture/infrastructure work, perform a broader smoke test.

---

## 27. Next.js Generated-State Recovery

Route/framework changes can leave stale `.next` output.

If source is correct and diagnostics clearly point only to stale generated state, use an appropriate regeneration path such as:

```bash
rm -rf .next
npm run build
```

or Next type generation where appropriate.

Never manually edit `.next/`.

Cache deletion is recovery for stale generated state, not a substitute for diagnosing a repeatable source error.

---

## 28. VS Code Stale Diagnostics

If:

```bash
npx tsc --noEmit
```

passes but VS Code still shows old diagnostics after moves/renames, use:

```text
Ctrl+Shift+P
Developer: Reload Window
```

before assuming the source remains broken.

---

## 29. Git Pager Behaviour

Some Git commands may open `less`.

A terminal showing `:` at the bottom is often waiting inside the pager, not frozen.

Press `q` to exit.

For verification, prefer:

```bash
git --no-pager diff --check
git --no-pager diff --cached --check
git --no-pager diff
```

---

## 30. CRLF Warnings

On Windows, Git may report:

```text
LF will be replaced by CRLF the next time Git touches it
```

This is a line-ending warning, not automatically a diff error.

Use:

```bash
git --no-pager diff --check
```

or:

```bash
git --no-pager diff --cached --check
```

for actual whitespace validation.

---

## 31. Browser Smoke Tests

After substantive work, relevant checks may include:

```text
Home
Assessment Setup
Assessment Creator
paper switching
question generation/regeneration/editing/removal
preview rendering
Compact / Exam / Answers
Preview Tray Settings/View
zoom
HUD behaviour
marks/timing
quality notes
save state
Compile navigation
Compilation
PDF generation/download
My Assessments tile view
My Assessments list view
My Assessments PDF preview
search/filter/sort
My Classes
Class Details
global Activity Rail / settings
```

Test areas reasonably affected by the change.

---

## 32. Browser DevTools for Client/Server Failures

When browser-visible behaviour depends on a server/API request, use browser DevTools rather than guessing.

Useful first checks:

```text
Network
→ did the request happen?
→ what status code returned?
→ what payload/response came back?

Console
→ did client-side JavaScript report an error?

Development terminal
→ what server-side stack trace identifies the failing file/line?
```

A `2xx` response indicates success; `4xx` usually indicates request/client-side input/auth/resource problems; `5xx` indicates server failure.

Keep explanations concise unless the user asks to learn more.

---

## 33. Document Rendering Requires Visual Verification

Changes beneath:

```text
app/UI/Documents/
app/Courses/<Course>/Documents/
app/Assessments/Compilation/
app/Assessments/Compilation/PDF/
```

may affect visible generated output.

Visually verify relevant page dimensions, scaling, margins, corner marks, marks margin, candidate boxes, cover/formula layout, question spacing, footers and pagination.

Physical document appearance is product behaviour.

---

## 34. Deletion Happens Last

Preferred deletion sequence:

```text
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
```

Never delete first merely because target architecture intends to replace something.

---

## 35. Broad Search Before Deletion

Before deleting an old file, search by more than one clue where appropriate:

- exported symbol;
- component name;
- filename;
- compatibility alias;
- historical alternate name;
- route reference;
- registry key;
- event name;
- persisted field/key.

A narrow path-only search is not dead-code proof.

---

## 36. Self-Reference-Only Results

A strong deletion signal is:

```text
repository-wide search
→ matches occur only inside the old implementation itself
```

Still consider framework discovery, dynamic imports, registries, string lookup, persistence, route dispatch and browser events.

If those do not apply, deletion is usually appropriate.

Verify again afterwards.

---

## 37. Empty Folder Cleanup

After obsolete files are deleted, remove empty folders when useful.

Do not keep empty historical signposts merely because they once had meaning.

Do not remove a parent folder that still contains active responsibilities.

---

## 38. Course Workflow

Distinguish generic Assessment workflow from Course-specific educational knowledge.

Examples:

```text
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
```

---

## 39. Course Contracts

Generic features should consume Course knowledge through canonical Course architecture where practical.

Current generic Course owners include:

```text
app/Courses/CourseTypes.ts
app/Courses/CourseCatalog.ts
app/Courses/CourseRegistry.ts
app/Courses/CourseAssessmentConfig.ts
app/Courses/Papers/
app/Courses/Selection/
app/Courses/Documents/
```

Do not bypass these contracts merely because importing a concrete Course file is quicker.

---

## 40. CourseId Ownership

`CourseId` is owned by:

```text
app/Courses/CourseTypes.ts
```

Consumers import it from its owner.

Do not create convenience re-exports from unrelated domains.

---

## 41. Course Registry API

Use canonical Course Registry terminology:

```text
COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs
```

Do not reintroduce retired aliases without a real compatibility requirement.

---

## 42. National 5 Maths Question Architecture

Historical exam evidence lives beneath:

```text
app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/
```

with Questions and MarkingSchemes.

Generated question/answer implementation lives beneath:

```text
app/Courses/National5Maths/QuestionAndAnswerGeneration/
```

with QuestionWriting, AnswerWriting and AnswerMethods.

Do not recreate the retired Question Bank architecture.

---

## 43. Avoid Course-Specific Generic UI

When generic UI contains concrete Course-name conditions, ask whether the variation belongs in:

```text
CourseAssessmentConfig
Course Documents
Course paper rules
Course skill data
```

Do not mechanically remove every Course condition. Establish the correct owner first.

---

## 44. No Hypothetical Course Architecture

Future Higher/Advanced Higher support should influence boundary quality, not create empty Course trees, placeholder document folders, fake configuration fields or unused registries.

Record ideas in `Docs/FutureFeatures.md` until implementation exists.

---

## 45. Classes Workflow

Class-owned functionality belongs beneath:

```text
app/Classes/
```

Classes obtains Course-specific skill knowledge through:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

Do not make Classes depend directly on a concrete National 5 Maths skills file where Course abstraction can provide the data.

---

## 46. My Assessments Workflow

The assessment library belongs beneath:

```text
app/MyAssessments/
```

Use the owner distinction:

```text
app/Assessments/SavedAssessments/
→ saved assessment data/storage

app/Assessments/Compilation/PDF/
→ PDF generation/assets

app/MyAssessments/
→ library browsing, tile/list views, toolbar, preview interaction and library actions
```

Do not duplicate saved-assessment storage or PDF generation inside My Assessments.

Current library modes intentionally serve different jobs:

```text
Tile view
→ visual browsing and embedded PDF scanning

List view
→ dense assessment management while retaining Preview
```

---

## 47. PDF Generation Workflow

The canonical PDF pipeline belongs to Assessment Compilation.

Conceptually:

```text
SavedAssessment
      ↓
buildAssessmentCompilationDocument
      ↓
canonical assessment document rendering
      ↓
standalone HTML + embedded KaTeX assets
      ↓
Chromium / Puppeteer
      ↓
PDF bytes
```

Client-generated PDF assets/cache belong beneath:

```text
app/Assessments/Compilation/PDF/Client/
```

UI consumers should reuse this pipeline/assets rather than invent another renderer.

---

## 48. Application UI Workflow

For interactive visual changes, determine whether the responsibility is global Application UI or feature-specific UI.

Global application visual infrastructure belongs beneath:

```text
app/UI/Application/
```

Feature-specific presentation normally stays with its product owner.

Do not centralise every colour, spacing value or component merely because it is visual.

---

## 49. Current Workbench UI Direction

When refining interactive application UI, preserve the established direction unless the user requests a redesign:

- compact desktop/workbench presentation;
- thin borders;
- modest 4–6px radii;
- restrained neutral surfaces;
- restrained blue accent;
- clear hierarchy and deliberate density;
- support for Dark, Soft Grey, Light, System and Custom appearance modes.

Generated assessment documents are a separate visual system.

---

## 50. Generated-Document Workflow

For generated document visuals, identify the correct layer:

```text
generic document primitive
→ app/UI/Documents/

qualification-family convention
→ app/UI/Documents/Templates/<Family>/

Course-specific document content/rule
→ app/Courses/<Course>/Documents/

assessment sequence / compilation workflow
→ app/Assessments/Compilation/
```

Preserve:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers
```

---

## 51. Application UI and Document UI Stay Separate

Code beneath:

```text
app/UI/Documents/
```

should not depend on interactive application chrome.

Do not make generated documents depend on navigation, activity rail, global settings panels, hover state or application-only layout.

An Assessment/MyAssessments-owned interactive preview may use Application styling where that styling belongs to the viewing experience.

---

## 52. Settings Workflow

Classify settings by what they affect.

```text
Whole application appearance/settings
→ app/UI/Application/Settings/ + Shell/ActivityRail

Assessment/paper content and sitting settings
→ Assessment Creation / Preview Tray ownership

Workspace view/layout behaviour
→ PaperWorkspace / Preview Tray ownership
```

Do not classify settings based solely on which icon currently opens them.

The historical global SettingsDrawer is not the preferred owner for new global settings work.

---

## 53. Preview Tray Workflow

The shared preview-edge `Preview Tray` is an established Assessment Creator interaction.

Current conceptual tabs:

```text
Settings
View
```

Settings controls assessment paper-content/sitting presentation.

View controls Compact/Exam/Answers and workspace display/reset actions.

Do not merge Preview Tray settings into global application settings.

---

## 54. Persistence Workflow

Before changing persistence behaviour, identify:

```text
storage key
stored shape
readers
writers
normalisation
fallback behaviour
compatibility
owner
```

Do not rename persisted keys merely because source terminology changed.

A persistence migration is a separate deliberate change.

---

## 55. Historical Persistence Terminology Is Allowed

Persisted data may retain old terminology such as `builder`, `P1`, `P2` or legacy field names when changing it would risk existing user data.

Historical internal route/persistence names do not define current product branding.

Source cleanliness does not override persistence compatibility.

---

## 56. Hidden Event Coupling

Prefer explicit dependencies over hidden browser-event coupling.

However, do not delete an active event bridge until all consumers have a replacement.

Migration sequence:

```text
understand event
→ identify dispatcher
→ identify listeners
→ introduce explicit replacement
→ switch consumers
→ verify
→ delete event bridge
```

---

## 57. Type Ownership

Types live with the concepts they describe.

Examples:

```text
CourseId
→ app/Courses/CourseTypes.ts

Class types
→ app/Classes/

Assessment types
→ app/Assessments/

question content contracts
→ app/Assessments/Questions/Content/

question generation contracts
→ app/Assessments/Questions/Generation/
```

Do not create a global shared-types bucket for convenience.

---

## 58. Generic Helper Workflow

Do not respond to ownership uncertainty by creating `Helpers/`, `Utils/`, `Shared/`, `Common/` or `Misc/` buckets.

Ask:

> Which domain owns this behaviour?

A helper function is still owned by the concept it helps.

---

## 59. Large Orchestration Files

Large orchestration files are not automatically architectural failures.

For example, `AssessmentCreatorPage.tsx` may remain substantial while coordinating many independent responsibilities.

Ask:

> Does this code coordinate owners?

or:

> Does it secretly implement them?

Extract the second category.

Do not create meaningless wrappers solely to reduce line count.

---

## 60. Client Boundary Workflow

`"use client"` marks a client entry boundary.

Do not add it to every internal component/hook that uses hooks, `window`, `document`, localStorage or event handlers.

If a module is imported beneath a genuine client boundary, it inherits the client environment.

Goal:

```text
deliberate client boundaries
```

not:

```text
zero client directives
```

A redundant client boundary can cause serialisability warnings for normal function props.

---

## 61. Client-Boundary Audit

When reviewing `"use client"`:

1. identify where the file is imported;
2. determine whether it itself establishes a client subtree from a server graph;
3. inspect whether a parent already establishes that subtree;
4. remove only genuinely redundant directives;
5. type-check/build as appropriate;
6. verify runtime behaviour where relevant.

Do not remove directives by filename pattern alone.

---

## 62. Scope Control

If an audit discovers an unrelated problem, record it but do not automatically expand the approved pass.

A useful discovery is not automatically the next task.

Future/parked work can be recorded in `Docs/FutureFeatures.md` when it is worth remembering.

---

## 63. Product Change vs Refactor

Refactoring may expose a better product design.

Keep the two changes conceptually separate.

Do not silently introduce a product change while presenting it as architecture cleanup.

Conversely, feature-led work may legitimately include a small structural improvement where the feature reveals a clear ownership problem.

---

## 64. When Approval Is Required

Ask before:

- changing locked architecture;
- changing intended product behaviour where the requirement is ambiguous;
- changing persisted data contracts;
- changing public URLs;
- introducing a significant dependency;
- creating a new major domain;
- deleting something whose usage remains uncertain;
- weakening privacy assumptions.

Do not ask for approval for every routine implementation step inside an already-approved bounded pass.

---

## 65. Communicating Instructions

A good implementation message usually contains:

- what is changing;
- why;
- exact repository-relative path;
- complete replacement file or exact small edit;
- one coherent verification step;
- expected result.

Do not overwhelm the user with many speculative future steps.

The user currently prefers concise explanations during implementation unless they explicitly ask for more detail.

---

## 66. Terminal Commands

Commands should be exact, copyable and run from repository root unless stated otherwise.

Useful examples:

```bash
npx tsc --noEmit
npm run build
git status --short
git --no-pager diff --check
```

State the expected result when it may not be obvious.

---

## 67. Interpreting Empty Output

If the expected result is no references/errors, say:

```text
Expected: no output.
```

When the command returns blank output, treat that as success.

Do not make the user rerun a successful empty search without a new reason.

---

## 68. Failure Handling

If verification fails during a risky migration:

```text
STOP DELETION
```

Investigate whether:

- import switch is wrong;
- hidden consumer exists;
- adapter is required;
- generated Next state is stale;
- persistence assumption was incomplete;
- route behaviour changed;
- client boundary was incorrect;
- architecture assumption was incomplete.

Repair from the last known-good boundary.

For feature work, similarly isolate the failing boundary before rewriting unrelated code.

---

## 69. Commit Checkpoints

A good commit point occurs after a coherent responsibility/feature pass is complete and verified.

Before committing:

```bash
git status --short
git --no-pager diff --check
```

Then stage and validate staged whitespace where useful:

```bash
git add -A
git --no-pager diff --cached --check
```

Commit only when the staged change represents what was actually verified.

---

## 70. Do Not Mix Unrelated Changes Into a Commit

Before committing, confirm:

- no unrelated files changed accidentally;
- intended deletions occurred;
- no duplicate implementation remains where removal was part of the pass;
- generated output was not accidentally edited;
- documentation matches the completed checkpoint where required.

A commit should tell one understandable story.

---

## 71. Documentation Timing

Do not update documentation after every tiny source edit.

Update at meaningful checkpoints such as:

- canonical owner established;
- major compatibility seam removed;
- bounded migration completed;
- architectural decision changed;
- substantial feature completed/refined;
- handoff point reached.

Documentation is durable project memory, not a keystroke diary.

---

## 72. Which Documents to Update

Use:

```text
Docs/RepositoryMap.md
→ current physical repository

Docs/Architecture.md
→ current architecture/dependency rules

Docs/LockedDecisions.md
→ settled decisions and supersessions

Docs/RefactorLedger.md
→ historical Architecture V2 migration record

Docs/FeatureHistory.md
→ meaningful implemented feature/technical change

Docs/FutureFeatures.md
→ future ideas, planned work and deferred concepts

Docs/ChatGPTWorkflow.md
→ development operating procedure

AGENTS.md
→ concise repository entry contract
```

Do not rewrite history in `RefactorLedger.md` merely because paths later changed.

---

## 73. RefactorLedger Is Historical

`Docs/RefactorLedger.md` is intentionally different from current-state documentation.

When refreshing it:

- preserve historical entries;
- preserve old paths when historically accurate;
- append final outcomes;
- mark migrations complete where appropriate;
- record the completion-state architecture.

Do not run blind global path replacements through the Ledger.

It is no longer the active product feature tracker.

---

## 74. FeatureHistory Is the Implemented-Change Record

Use `Docs/FeatureHistory.md` when a future developer would materially benefit from knowing that a meaningful product or technical capability was added, redesigned or completed.

Keep entries concise and outcome-focused.

Do not turn it into a per-commit diary.

---

## 75. FutureFeatures Is the Idea Backlog

Use `Docs/FutureFeatures.md` when an idea is worth preserving but is not being implemented immediately.

Suitable statuses include:

```text
IDEA
PLANNED
DEFERRED
INVESTIGATE
```

Recording an idea does not create runtime folders, establish architecture or imply approval to implement.

---

## 76. End-of-Session Handoff

A significant session should leave durable context answering relevant questions such as:

```text
WHAT BECAME CANONICAL?
WHAT FEATURE CHANGED?
WHAT WAS REMOVED?
WHAT COMPATIBILITY REMAINS?
WHAT WAS VERIFIED?
WHAT IS PARKED FOR LATER?
```

Use the appropriate docs rather than dumping the entire conversation into repository documentation.

Condense decisions and outcomes.

---

## 77. Starting a Fresh Chat

A fresh conversation can begin with:

```text
We are continuing development of the N5 Assessment Tool.

Read AGENTS.md and the relevant current docs before proposing structural changes.

Use FeatureHistory for implemented feature context, FutureFeatures for parked ideas, and RefactorLedger only for Architecture V2 migration history.

Inspect the actual current repository before editing.

Preserve working behaviour and follow current ownership architecture.
```

No product/brand name should be inferred from historical internal identifiers.

---

## 78. Current Assessment Creation Owner

Assessment Creation is owned beneath:

```text
app/Assessments/Creation/
```

Main entry points:

```text
app/Assessments/Creation/AssessmentSetupPage.tsx
app/Assessments/Creation/AssessmentCreatorPage.tsx
```

Major regions include Analysis, AssessmentSettings, Feedback, HUDBar, Papers, PaperWorkspace, Persistence, Questions, Setup, SkillsPanel and TopBar.

Do not recreate a generic Builder architecture.

---

## 79. Current Compilation Owner

Assessment Compilation is owned beneath:

```text
app/Assessments/Compilation/
```

Major current areas include:

```text
Model/
Pagination/
Rendering/
PDF/
```

Compilation is separate from Creation.

Do not treat Compilation/document dependencies as dead merely because Creation does not import them directly.

---

## 80. Current Routing Owner

Public feature URLs are rewritten in:

```text
next.config.ts
```

and dispatched by:

```text
app/page.tsx
```

The dispatcher remains thin.

Do not create duplicate physical feature trees solely to represent public URLs.

---

## 81. Current Shared Question Preview

Shared Assessment question preview code belongs beneath:

```text
app/Assessments/Questions/Preview/
```

Course-specific question writing belongs beneath the Course.

Generated-document primitives belong beneath `app/UI/Documents/`.

Do not collapse these responsibilities into one generic Preview bucket.

---

## 82. Current Document Architecture

Generated documents use:

```text
app/UI/Documents/
        ↓
app/UI/Documents/Templates/NationalQualifications/
        ↓
app/Courses/National5Maths/Documents/
        ↓
app/Assessments/Compilation/
```

Keep generic physical-document infrastructure separate from Course-specific document content.

---

## 83. Current Application Shell

Global application shell ownership is beneath:

```text
app/UI/Application/Shell/
```

`app/layout.tsx` composes the HeaderBar, Activity Rail and page-content area.

Global Settings opens from the Activity Rail and overlays the active page with a focus backdrop.

The HeaderBar right side is intentionally not the global Settings trigger.

---

## 84. Current My Assessments Owner

The user-facing assessment library is owned beneath:

```text
app/MyAssessments/
```

Current areas include Actions, Display, Library, ListView, Preview, TileView and Toolbar.

Tile and List views are both intentional supported modes.

Generated PDF previews consume the canonical Compilation PDF asset pipeline.

---

## 85. Current Developer Tools Boundary

Runtime developer functionality belongs beneath:

```text
app/DeveloperTools/
```

Repository maintenance tooling is separate and should only create root `Tools/` when enduring tooling genuinely exists.

---

## 86. No Speculative Architecture

Future ideas such as OCR, AI marking, batch scanning, analytics, Higher Maths and Advanced Higher Maths may influence boundary quality.

They do not justify empty source folders or unused abstractions.

Record ideas in `Docs/FutureFeatures.md` until implementation begins.

---

## 87. Privacy-Sensitive Work

The pupil-data approach intentionally separates non-identifying pupil IDs from teacher-local name mapping where appropriate.

When working on Classes, assessment pupil data, storage, future scanning or future marking, do not casually move pupil names into broader/server-visible data contracts.

Changes to the privacy model require explicit product/privacy consideration.

---

## 88. Definition of a Successful Feature Pass

A feature pass is complete when the intended behaviour works, existing relevant behaviour is preserved, TypeScript passes, browser/runtime verification passes where relevant, build passes where infrastructure/release significance requires it, and documentation is updated if the change forms a meaningful checkpoint.

A visual feature is not complete merely because TypeScript compiles.

---

## 89. Definition of a Successful Bounded Migration

A bounded migration is complete when:

```text
canonical owner exists
consumer uses it
working behaviour is preserved
TypeScript passes
build passes where relevant
runtime behaviour passes where relevant
old references are searched broadly
obsolete source is removed
no duplicate truth remains
documentation is updated at a meaningful boundary
```

If the old implementation still materially supplies the responsibility, the migration is still in progress.

---

## 90. Definition of a Documentation Checkpoint

A documentation checkpoint is appropriate when a future developer would materially benefit from knowing:

```text
this owner is now canonical
this legacy boundary is gone
this architectural rule changed
this meaningful feature now exists/changed
this future idea should not be forgotten
```

---

## 91. Final Working Rule

When unsure how to proceed:

```text
READ CURRENT DOCUMENTATION
        ↓
INSPECT REAL SOURCE
        ↓
TRACE CONSUMERS WHEN NEEDED
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
```

The purpose of this workflow is no longer merely to finish Architecture V2.

It is to make ongoing feature development predictable enough that a fresh developer or AI-assisted session can continue safely without reconstructing the project's history.
