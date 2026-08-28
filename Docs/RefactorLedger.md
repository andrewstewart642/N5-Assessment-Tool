# N5 Assessment Tool — Architecture V2 Refactor Ledger

**Document type:** Historical migration and handoff record  
**Architecture version:** Architecture V2  
**Status:** COMPLETE / ARCHIVED AS ACTIVE MIGRATION TRACKER  
**Architecture V2 final sign-off:** 26 August 2026  
**Post-sign-off documentation refresh:** 27–28 August 2026

---

# 1. Purpose

This document records how the repository moved from the historical architecture into the Architecture V2 ownership model.

It answers historical questions such as:

> What was migrated?

> Which legacy owners were removed?

> Which responsibilities became canonical?

> What verification was performed?

> Why do some historical paths differ from the current repository?

This document is **not** the active feature backlog and is no longer the current migration-status tracker.

Use:

```text
Docs/Architecture.md
→ current architecture

Docs/RepositoryMap.md
→ current physical repository ownership

Docs/LockedDecisions.md
→ settled decisions

Docs/FeatureHistory.md
→ meaningful feature/technical changes after the refactor baseline

Docs/FutureFeatures.md
→ future ideas and deferred/planned work

Docs/ChatGPTWorkflow.md
→ current AI-assisted development procedure
```

Historical paths in this ledger are intentionally preserved where they describe real earlier repository states.

---

# 2. Final Refactor Outcome

Architecture V2 is complete.

The broad repository migration achieved:

```text
one runtime application source root
+
explicit product owners
+
no historical Builder implementation
+
no Question Bank architecture
+
no generic shared-types bucket
+
no generic math-helpers bucket
+
no paper-layout legacy owner
+
Course-independent Assessment workflow
+
explicit Classes ownership
+
explicit Courses ownership
+
separate Compilation ownership
+
layered generated Documents
+
separate Application UI
+
explicit DeveloperTools ownership
+
thin central routing adapter
+
deliberate client boundaries
+
preserved persistence compatibility
```

The repository is no longer in a repository-wide migration phase.

Future development should be feature work, bug fixing, bounded architectural improvement or deliberate compatibility migration.

---

# 3. Git Safety Model Used During Architecture V2

Repository:

```text
andrewstewart642/N5-Assessment-Tool
```

Architecture V2 working branch:

```text
refactor/architecture-V2
```

Known-good branch:

```text
main
```

Frozen baseline:

```text
archive/25-08-2026-baseline
```

An offline project copy was also maintained as an additional preservation layer.

Known early migration anchors:

```text
MIG-001 — Application UI Foundations
1492b5841be785ebf0a0fc96517cf3480aacb10c

MIG-002 — Application Theme and Settings Architecture
4664123d6657ae8752817c8ea0569a16d33a0890
```

Later known anchors are listed in Section 27.

---

# 4. Migration Method

The migration established the following repeatable pattern:

```text
AUDIT
    ↓
ESTABLISH OWNER
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
DOCUMENT
    ↓
COMMIT
```

This proved safer than moving historical folders wholesale.

Temporary compatibility adapters were allowed when they reduced risk, but duplicate permanent authorities were not accepted.

This migration method remains valid for future bounded structural work even though Architecture V2 itself is complete.

---

# 5. Acceptance Criterion Zero

The governing migration rule was:

> Preserve the working application.

Architecture V2 could move, rename, rewrite, split, merge, simplify, consolidate and delete genuinely dead code, but it could not silently remove working product behaviour.

TypeScript passing alone was not accepted as proof for visual or interaction-sensitive changes.

---

# 6. Historical Source-Root Strategy

Architecture V2 initially used a transitional split:

```text
app/
→ Next.js routing

src/
→ migrated application implementation
```

During that phase, substantial owners were progressively created beneath:

```text
src/Assessments/
src/Courses/
src/UI/
src/Classes/
src/DeveloperTools/
```

That strategy was later deliberately replaced by the final source model:

```text
app/
→ routing + product implementation
```

The transitional `src/` tree was removed.

Earlier sections/commits referring to `src/...` therefore describe a real intermediate stage, not current architecture.

---

# 7. Documentation Foundation

Architecture V2 established persistent repository documentation and a root agent contract.

The original documentation set was:

```text
AGENTS.md
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/RepositoryMap.md
Docs/RefactorLedger.md
Docs/ChatGPTWorkflow.md
```

This established the separation between:

```text
architecture
locked decisions
physical repository state
migration history
AI-assisted workflow
agent entry instructions
```

After Architecture V2 completion, the documentation model was expanded with:

```text
Docs/FeatureHistory.md
Docs/FutureFeatures.md
```

so feature evolution and future ideas no longer need to be mixed into this ledger.

---

# 8. Application UI Foundations

Application UI gained an explicit owner during early V2 work.

The migrated architecture established responsibilities for:

```text
Colours
Theme
Typography
HeaderBar
Settings
reusable Application components
```

The historical root-level `ui/` ownership was removed rather than recreated under a different generic name.

A key enduring boundary was established:

```text
Application UI
≠
Generated Document UI
```

Generated documents would later receive their own layered architecture.

---

# 9. Assessment Setup Migration

Assessment Setup was moved into explicit Assessment Creation ownership.

The canonical concept became:

```text
Assessments/Creation/AssessmentSetupPage.tsx
Assessments/Creation/Setup/
```

Setup gained dedicated responsibility for:

```text
state
storage
submission
target calculations
Course/setup rules
Class coverage loading
controls
sections
```

The important outcome was that Setup became a product-owned implementation rather than a route-owned implementation.

---

# 10. Historical Builder Detachment

One of the largest V2 milestones was fully detaching Assessment Creation from the old Builder implementation.

The historical Builder area previously contained responsibilities such as:

```text
builder behaviour
builder definitions
builder logic
preview engine
components
styles
storage
assessment timing
paper logic
analysis
```

These responsibilities were audited and reassigned to explicit Assessment/Course/UI owners.

Canonical Assessment Creation areas emerged as:

```text
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
```

The old Builder implementation was then removed after consumer tracing and verification.

The public URL:

```text
/create-assessment/builder
```

was intentionally preserved as a route compatibility contract.

The permanent lesson was:

```text
route name contains builder
≠
Builder architecture exists
```

---

# 11. Assessment Creator Orchestration

The substantial Creator implementation became a descriptive product-owned page:

```text
AssessmentCreatorPage.tsx
```

It coordinates owners for:

```text
paper state
Course configuration
question workflow
skills state
settings
persistence
quality analysis
TopBar
SkillsPanel
PaperWorkspace
HUDBar
```

Architecture V2 deliberately did not require splitting orchestration merely to reduce line count.

The enduring test is:

> Does the page coordinate owners, or secretly implement them?

Only the second category should be extracted merely for ownership reasons.

---

# 12. TopBar Migration

The historical Builder TopBar was decomposed into canonical Assessment Creation ownership.

Recognised terminology became:

```text
HeaderBar
→ global application navigation

TopBar
→ Assessment Creation upper controls
```

The old Builder-style monolith was removed and must not be recreated.

---

# 13. SkillsPanel Migration

The Assessment interaction side of the Skills Tree moved into:

```text
Assessments/Creation/SkillsPanel/
```

The central architectural distinction became:

```text
Assessment Creation
→ rendering, filtering and interaction

Course
→ curriculum and educational knowledge
```

This separation later allowed Classes and Assessment workflows to consume Course structure through Course configuration rather than concrete National 5 Maths source paths.

---

# 14. Assessment Papers Migration

Generic Assessment paper workflow moved into:

```text
Assessments/Creation/Papers/
```

while Course-specific paper rules moved toward:

```text
Courses/Papers/
```

This separated concepts such as:

```text
active/viewed paper
paper selection
paper targets
assessment timing/sitting state
```

from Course-owned paper configuration and educational rules.

---

# 15. Assessment Analysis Migration

Assessment quality/distribution analysis moved into:

```text
Assessments/Creation/Analysis/
```

Responsibilities included:

```text
topic balance
standard balance
calculator suitability
operational/reasoning balance
assessment distribution
quality notes
```

The generic historical `builder-logic` ownership was retired.

---

# 16. Assessment Persistence Migration

Creation-specific persistence moved into:

```text
Assessments/Creation/Persistence/
```

Shared Course-selection persistence later gained Course ownership.

A major rule emerged and remains active:

> Source terminology migration does not automatically rename persisted browser data.

Historical storage keys containing terms such as `builder`, and compatibility fields such as P1/P2 representations, were retained where changing them would risk user data.

Persistence compatibility was treated as a separate contract from source cleanliness.

---

# 17. Assessment Question Workflow

Generic Assessment question workflow moved into explicit Assessment ownership.

Creation-specific workflow covered:

```text
question state
generated drafts
editing
controls
draft generation
spacing/workflow
```

Shared generic contracts were separated from Course-specific question-writing knowledge.

This eventually produced the durable split:

```text
Assessments/Questions/
→ generic contracts/preview/selection

Courses/<Course>/QuestionAndAnswerGeneration/
→ educational generation implementation
```

---

# 18. Shared Assessment Question Preview

When Compilation became a second consumer of locked-question rendering, preview code was promoted out of Creation-specific ownership into shared Assessment ownership.

This prevented:

```text
Compilation → Creation
```

from becoming the architecture simply because both required the same renderer.

The resulting principle remains:

> Promote genuinely shared Assessment behaviour to an Assessment owner; do not make major features depend on each other merely to share implementation.

---

# 19. PaperWorkspace Migration

The central interactive Creator workspace became:

```text
Assessments/Creation/PaperWorkspace/
```

It became a stable boundary for:

```text
workspace layout
preview behaviour
view modes
split/divider behaviour
document locking
interactive paper preview
```

The historical Builder dependency chain was removed from this area.

Browser verification during the migration covered question rendering, paper switching, preview modes, HUD behaviour, notes, marks/timings and Compile navigation.

---

# 20. HUDBar Migration

Historical BottomHud/Builder HUD responsibilities were reassigned to:

```text
Assessments/Creation/HUDBar/
```

Only genuine lower-region responsibilities were retained there.

This established the enduring rule that historical physical location does not determine future ownership.

---

# 21. Assessment Compilation Migration

Compilation became a separate Assessment responsibility rather than a route implementation or sub-feature of Creation.

The canonical concept became:

```text
Assessments/Compilation/
```

Compilation owns final assessment document composition and pagination.

Creation owns interactive assessment construction.

Shared dependencies were promoted to their correct owners instead of making Compilation depend on Creation.

This separation later became the basis for the canonical Compilation model/rendering/PDF system.

---

# 22. Course Selection and Paper Rules

Shared Course-selection persistence gained a Course owner.

Course paper behaviour gained explicit Course ownership beneath:

```text
Courses/Papers/
```

Responsibilities included:

```text
available papers
default paper
paper configuration
paper targets
paper labels
calculator suitability
```

This was an important step in making Assessment Creation genuinely Course-aware rather than National-5-Maths-specific.

---

# 23. Generated Document Architecture

Architecture V2 established the document layering still used today:

```text
generic document mechanics
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers
```

Canonical conceptual owners became:

```text
UI/Documents/
UI/Documents/Templates/NationalQualifications/
Courses/National5Maths/Documents/
Assessments/
```

Application UI and generated Document UI were explicitly separated.

---

# 24. Historical Paper Layout Removal

The historical `app/paper-layout/` area was identified as a major mixed-responsibility seam.

Its responsibilities were audited rather than moved wholesale.

Surviving behaviour was reassigned to owners including:

```text
Courses/National5Maths/Documents/
Assessments/Compilation/
UI/Documents/
```

The legacy paper-layout owner was then removed.

The unused historical typography component from that architecture was also removed after consumer verification.

---

# 25. Course Architecture Migration

Historical Course data/configuration was reorganised beneath explicit Course ownership.

The final generic Course architecture established concepts such as:

```text
CourseAssessmentConfig
CourseCatalog
CourseRegistry
CourseTypes
Papers
Selection
Documents
```

Course identity received one canonical owner.

Classes and Assessments could then consume Course knowledge through contracts rather than concrete National 5 Maths implementation paths.

---

# 26. National 5 Maths Ownership Migration

National 5 Mathematics implementation became a coherent Course-owned area containing responsibilities such as:

```text
AssessmentConfig
Skills
Documents
ExamQuestionAndAnswerCatalog
QuestionAndAnswerGeneration
```

Historical exam evidence and generated question-writing implementation were deliberately separated.

Current exam-evidence terminology became:

```text
ExamQuestion
ExamMarkingScheme
ExamQuestionAndAnswerCatalog
```

replacing the earlier SourceQuestion/SourceMarkingScheme naming.

---

# 27. Known Migration Commit Anchors

Known Architecture V2 anchors include:

```text
1492b5841be785ebf0a0fc96517cf3480aacb10c
→ MIG-001 — Application UI Foundations

4664123d6657ae8752817c8ea0569a16d33a0890
→ MIG-002 — Application Theme and Settings Architecture

eb03c43
→ Remove legacy Question Bank architecture

880292b
→ Migrate Developer Tools ownership

6986561
→ Move Next routing under src

c8ab01d
→ Migrate shared types under src

6a7cd59
→ Move application source to root app

5136858
→ Remove CourseRegistry compatibility aliases

b34251d
→ Remove redundant hook client boundaries
```

Other bounded commits also exist.

Git history remains authoritative for exact commit identity and full patch detail.

---

# 28. Question Bank Removal

The old:

```text
app/question-bank/
```

architecture was audited and retired.

Live concept adapters moved into Course-owned generation beneath the National 5 Maths Question/Answer Generation architecture.

Historical/evidence/prompt-style files without consumers were deleted rather than migrated.

The permanent rule is:

> Future question/answer generation extends the Course-owned generation model; do not recreate a parallel Question Bank.

---

# 29. Shared Type Bucket Removal

The historical:

```text
shared-types/
```

bucket was dismantled by responsibility.

Type ownership moved to domains such as:

```text
Assessments
Assessments/Questions
Courses
Classes
```

No replacement global `SharedTypes` owner was created.

---

# 30. Generic Math Helper Removal

The historical:

```text
math-helpers/
```

owner was eliminated.

Surviving responsibilities moved to genuine Course, Assessment or document owners.

No replacement `Helpers/`, `Utils/` or `Common/` bucket was introduced.

---

# 31. Classes Migration

Classes gained explicit canonical ownership.

Major responsibilities included:

```text
class types
class storage/state
My Classes
Class Details
class coverage
reusable class UI
```

Class coverage was made Course-aware through:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

This removed the need for Classes to import National 5 Maths skill data directly.

Later responsibility-first naming changed current physical names such as `ClassTypes.ts`/generic `State` or `Components` concepts; those later names are recorded in current-state docs rather than rewriting this historical migration description.

---

# 32. Developer Tools Migration

Runtime developer functionality gained an explicit application owner:

```text
DeveloperTools/
```

The Generator Tester became the principal runtime example.

This remained conceptually separate from repository-level migration/maintenance scripts.

Historical one-off migration tooling was later removed when it no longer had enduring value.

---

# 33. Root Source-Container Migration

The intermediate `src/` architecture was ultimately collapsed back into root `app/` so that all runtime source had one authoritative container.

The final runtime source became:

```text
app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── layout.tsx
└── page.tsx
```

The former `src/` tree was removed.

This was not a regression to the old route-owned architecture: product domains now lived directly under the App Router source root with explicit ownership.

This tree is the historical sign-off snapshot. `Home/` and `MyAssessments/` are represented in current-state docs where their post-sign-off/current ownership is recorded.

---

# 34. Routing Finalisation

Architecture V2 removed physical route-signpost feature trees.

The final sign-off routing model became:

```text
next.config.ts
        ↓
app/page.tsx
        ↓
product-owned page implementation
```

Public URLs remained stable while physical product source stopped mirroring URL structure.

A temporary catch-all `app/[...route]/page.tsx` adapter existed during migration and was later retired.

This is why historical ledger entries referring to route wrappers or the catch-all route are valid history but not current routing guidance.

---

# 35. Client-Boundary Cleanup

Architecture V2 audited `"use client"` usage across hooks and internal components.

Redundant directives were removed from internal hooks/components/document renderers where a parent already established the client subtree.

Remaining directives were intended to represent genuine client entry boundaries such as interactive top-level pages, providers and global interactive application boundaries.

The goal was never zero client directives.

The goal was deliberate client boundaries.

This rule remains especially important because unnecessary client boundaries can trigger Next.js serialisability warnings for normal function props.

---

# 36. Persistence Compatibility

Architecture V2 deliberately left some historical terminology in persisted/browser contracts.

Intentional compatibility included areas such as:

```text
historical localStorage keys containing builder
P1/P2 persisted paper fields and aliases
saved-assessment backwards compatibility
class-storage backwards compatibility
Course-selection persisted compatibility
active compatibility wiring with real consumers
```

These were not considered architectural failures merely because the names were old.

They require deliberate migration if changed.

---

# 37. Dead-Code Investigation Lesson

During migration, an apparently obsolete document component was briefly removed after an overly narrow search.

TypeScript exposed a surviving Compilation consumer and the file was restored.

The permanent lesson was:

> A narrow search is not proof of deadness.

Before deletion, search broadly by path, filename, symbol, export, component, hook, adapter, dynamic import, route consumer and persistence/event usage where relevant.

---

# 38. Repository Root Cleanup

Final Architecture V2 cleanup removed proven dead/historical repository material including items such as:

```text
old root README
historical one-off migration tooling
starter public assets
postcss.config.mjs
old favicon
unused Tailwind/PostCSS dependencies
```

Global application CSS moved to:

```text
app/UI/Application/Styles/ApplicationGlobals.css
```

Required Turbopack root configuration remained in `next.config.ts`.

The repository no longer depended on historical runtime buckets including:

```text
src/
course-data/
math-helpers/
shared-types/
app/paper-layout/
app/question-bank/
```

---

# 39. Dependency and Security Checkpoint

During final V2 cleanup, the project was upgraded to:

```text
Next.js 16.3.3
eslint-config-next 16.3.3
```

At the recorded final checkpoint, npm audit reported:

```text
0 vulnerabilities
```

for the checked dependency tree/production dependencies.

This is historical verification, not a permanent guarantee about future dependency state.

---

# 40. Final Architecture V2 Runtime Shape

At final sign-off on 26 August 2026, the canonical runtime ownership model was:

```text
app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── layout.tsx
└── page.tsx
```

Shortly after sign-off, `MyAssessments` was promoted to its own first-class root domain during feature-led work. `Home/` also exists as a dedicated root product-area owner in the current repository. Those current/post-sign-off facts belong in current-state docs and Feature History rather than being rewritten into the historical sign-off snapshot.

Current physical truth always belongs in `RepositoryMap.md`.

---

# 41. Final Architecture V2 Ownership at Sign-Off

At the completion checkpoint:

```text
Assessments
→ generic assessment workflow, saved assessments and compilation

Classes
→ class data/workflows

Courses
→ educational/Course-specific knowledge

DeveloperTools
→ runtime developer functionality

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation
```

The post-sign-off My Assessments promotion later separated the user-facing library UI from `Assessments/SavedAssessments` persistence ownership.

The current Home owner is likewise documented in current-state Architecture/Repository Map rather than retroactively added to this sign-off snapshot.

---

# 42. Final Verification

The final Architecture V2 tree passed the recorded verification set, including:

```text
TypeScript typecheck
production Next.js build
git diff / whitespace validation
repository structural inspection
public-route browser smoke testing
direct URL refresh testing
browser navigation testing
Assessment Setup
Assessment Creator
question interaction
save/reopen behaviour
Compilation
My Assessments
My Classes
Class Details
application settings
Assessment settings
generated-document behaviour
```

The application remained functional after routing and repository cleanup.

---

# 43. Builder Removal Verification

The historical Builder-removal checkpoint included:

```text
consumer audit
→ PASS

implementation deletion
→ COMPLETE

TypeScript
→ PASS

production build
→ PASS

Assessment Creator browser smoke
→ PASS

Compilation browser smoke
→ PASS
```

Verified behaviour included question rendering, draft rendering, Answers view, P1/P2 switching, question generation/assignment/edit/remove, Compile navigation, Compilation loading/rendering, Compilation paper switching and page-size switching.

This was the strongest proof that the historical Builder implementation was genuinely dead before final source cleanup.

---

# 44. Historical Path Policy

Earlier migration work used real paths including:

```text
src/Assessments/
src/Courses/
src/UI/
app/create-assessment/builder/
app/compile-assessment/page.tsx
app/[...route]/page.tsx
app/paper-layout/
shared-types/
course-data/
math-helpers/
```

These references are valid historical evidence.

They must not be globally replaced merely because the final repository uses different paths.

Use:

```text
Docs/RepositoryMap.md
```

for current physical truth.

Use:

```text
Docs/Architecture.md
```

for current ownership/dependency truth.

Use this ledger to understand how those truths were reached.

---

# 45. Things Future Sessions Must Not Infer from This Ledger

Do not assume:

```text
src/ is still a source root

old route wrappers still exist

My Assessments still lives under Assessments

historical Builder strings mean Builder architecture exists

persisted builder strings should be renamed

old SettingsDrawer presentation is still canonical

root Tools/ must exist even when there is no enduring tooling

historical pending-migration sections remain active tasks

historical filenames in this ledger are necessarily current filenames
```

This file contains historical state by design.

---

# 46. Things Future Sessions May Treat as Established from V2

Future sessions may rely on the following V2 outcomes unless explicitly reconsidered:

```text
preservation is acceptance criterion zero

ownership determines source location

root app/ is the runtime source container

product structure is not route structure

Builder is retired source terminology

Assessment Creation is Course-independent

Courses own educational knowledge

Classes consume Course contracts

Compilation is separate from Creation

Application UI and Documents UI are separate

generated documents use generic → template → Course → consumer layering

Question Bank is retired

generic shared-types/math-helpers owners are retired

persistence compatibility is deliberate

client boundaries are deliberate

write-new before delete-old is preferred for risky migrations

broad consumer search precedes deletion

no speculative empty architecture
```

---

# 47. Architecture V2 Final Sign-Off — 26 August 2026

Architecture V2 was declared:

```text
COMPLETE
```

after the repository-wide migration and final cleanup were completed and verified.

Completion meant:

```text
future development can proceed on top of the architecture
without continuing the repository-wide migration
```

It did **not** mean the product itself was complete.

---

# 48. Post-Sign-Off Transition — 27 August 2026

Feature development resumed immediately on top of the completed Architecture V2 baseline.

This exposed and validated several aspects of the architecture in real feature work, including:

- further global Application Shell/settings refinement;
- Assessment Preview Tray refinement;
- canonical Compilation/PDF generation;
- generated-PDF reuse in product UI;
- first-class `app/MyAssessments/` ownership;
- redesigned My Assessments tile/list library.

Those are not additional Architecture V2 migration tasks.

They are post-refactor feature/technical evolution and should be recorded in:

```text
Docs/FeatureHistory.md
```

Future ideas should be recorded in:

```text
Docs/FutureFeatures.md
```

---

# 49. Final Handoff

A fresh development session should now begin from this state:

```text
Architecture V2 is complete.

Current runtime source lives beneath root app/.

Current owners are documented in RepositoryMap.md and Architecture.md.

The historical Builder, Question Bank, shared-types, math-helpers,
paper-layout and course-data architectures are retired.

Public URLs are preserved through next.config.ts rewrites and a thin app/page.tsx dispatcher.

Assessment Creation is Course-independent.

Compilation is a separate Assessment responsibility.

Classes resolves educational structure through Course configuration.

Application UI and generated Documents UI remain separate systems.

Persistence compatibility remains where required.

"use client" is reserved for genuine client entry boundaries.

Historical paths in this ledger are history, not current navigation instructions.

Feature-led development is now the normal mode.
```

---

# 50. Ledger Closure Rule

This ledger is closed as the active migration tracker.

Add future entries here only when they genuinely clarify Architecture V2 history or correct the historical record.

Do not use it to log ordinary feature work.

Use:

```text
Docs/FeatureHistory.md
```

for implemented feature evolution and:

```text
Docs/FutureFeatures.md
```

for ideas/planned/deferred work.

---

# 51. Post-Sign-Off Naming and Discoverability Maintenance — 28 August 2026

After the Architecture V2 migration and initial feature-led work, the repository received a targeted maintenance pass focused on file/folder discoverability.

This was **not** a reopened Architecture V2 migration. The broad ownership model remained intact.

The work proceeded after separate dead/obsolete-file cleanup and lint cleanup, then systematically renamed files/folders where current names still exposed historical context, implementation details or vague responsibilities.

The resulting governing rule became:

> **Folder = context. Filename = responsibility.**

The maintenance pass included areas such as:

```text
Assessments/Creation/Setup/
Assessments/Creation/Persistence/
Assessments/Creation/Questions/
Assessments/Creation/TopBar/
Assessments/Creation/HUDBar/
Assessments/Creation/Papers/
Assessments/Creation/PaperWorkspace/
Assessments/Creation/SkillsPanel/
Assessments/Creation/Feedback/
Classes/
MyAssessments/Display/
MyAssessments/Library/
```

Important outcomes included:

- hook implementation files no longer use `use...` filenames merely because the exported function is a React hook;
- exported React hook functions themselves retain required `use...` names;
- repeated parent-folder prefixes were removed where the folder already provided sufficient context;
- vague responsibility names were replaced with clearer product/behaviour names;
- `Classes/Components/` and `Classes/State/` were replaced by current responsibility owners such as `Classes/MyClasses/` and `Classes/Records/`;
- the Preview Tray folder became the simpler current `PaperWorkspace/Preview/Tray/` owner;
- meaningful SkillsPanel ordering was intentionally preserved as `01-SkillsFilters/` followed by `02-SkillsTree/` because that order mirrors the page;
- public routes and persistence compatibility identifiers were deliberately left unchanged.

The pass was repeatedly verified with:

```text
npx tsc --noEmit
npm run lint
git --no-pager diff --check
```

One practical lesson from the rename pass was that successful `git mv` operations do not themselves guarantee import-path updates. Missing-module TypeScript errors were repaired by updating module-path strings while preserving exported hook symbols.

Another practical shell lesson was that Git Bash's `>` prompt can mean an unfinished quoted command rather than a frozen terminal; `Ctrl+C` safely cancels that incomplete command before retrying with simpler quoting.

Current physical names belong in:

```text
Docs/RepositoryMap.md
```

The new naming rule belongs in:

```text
AGENTS.md
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/ChatGPTWorkflow.md
```

Earlier filenames/paths in this ledger remain historical evidence and are intentionally not globally rewritten.
