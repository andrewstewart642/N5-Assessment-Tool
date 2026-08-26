# VecEd — Agent Instructions

## 1. Purpose

This file is the first set of repository instructions for any coding agent working on VecEd.

Read it before making changes.

For deeper information, use:

```text
Docs/Architecture.md
Docs/RepositoryMap.md
Docs/LockedDecisions.md
Docs/ChatGPTWorkflow.md
Docs/RefactorLedger.md

Use those documents for their intended purposes:

Architecture.md
→ architecture and dependency rules

RepositoryMap.md
→ where current code belongs

LockedDecisions.md
→ decisions that should not be casually reopened

ChatGPTWorkflow.md
→ safe AI-assisted development workflow

RefactorLedger.md
→ historical migration record

RefactorLedger.md contains historical paths.

Do not treat historical paths as current architecture.

2. Product

VecEd is an assessment-building application.

The current workflow includes:

select/configure assessment
        ↓
build assessment
        ↓
preview assessment
        ↓
save assessment
        ↓
compile document

The architecture is intended to support multiple Courses without making generic Assessment workflows depend directly on one Course implementation.

3. Acceptance Criterion Zero

Preserve working product behaviour.

Architecture cleanup is not permission to remove functioning features.

Unless behavioural change is explicitly requested, preserve:

public URLs,
assessment creation behaviour,
question generation,
previews,
saved assessments,
class data,
generated documents,
application settings,
persisted browser data.

Do not delete code merely because its name looks old.

Prove that it is dead first.

4. Runtime Source Root

All runtime source lives beneath:

app/

Current high-level structure:

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

There is no runtime:

src/

tree.

Do not recreate one.

5. Primary Ownership Areas

The main ownership domains are:

app/Assessments/
app/Classes/
app/Courses/
app/DeveloperTools/
app/UI/

Use responsibility to decide ownership.

Do not choose an owner merely because it produces the shortest import path.

6. Assessments

Generic Assessment workflow belongs beneath:

app/Assessments/

Major areas include:

Compilation/
Creation/
MyAssessments/
Questions/
SavedAssessments/
AssessmentTypes.ts

Assessments owns generic assessment workflow.

It should not own Course-specific educational knowledge.

7. Assessment Creation

Assessment Creation lives beneath:

app/Assessments/Creation/

Main entry points:

AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx

Major areas include:

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

Use these existing areas before creating new generic folders.

8. Product UI Terminology

Use the current recognised names:

HeaderBar
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Drawer
Popover

Meaning:

HeaderBar
→ global application header

TopBar
→ upper Assessment Creation region

HUDBar
→ lower Assessment Creation region

SkillsPanel
→ assessment skill-selection region

PaperWorkspace
→ central Assessment Creation workspace

Do not revive old Builder terminology as source architecture.

9. Builder Compatibility

The public URL:

/create-assessment/builder

still exists.

Persisted keys may also contain historical builder terminology.

That does not mean new source should be placed in folders such as:

Builder/
BuilderComponents/
BuilderLogic/

Current source terminology is:

Assessment Creation

Public/persisted compatibility wording may differ from source terminology.

10. Assessment Compilation

Compilation lives beneath:

app/Assessments/Compilation/

Compilation is separate from Creation.

Creation determines assessment content.

Compilation turns assessment content into paginated/generated document output.

Do not merge these domains merely because they consume the same assessment data.

11. Saved Assessments

Persistent saved-assessment data belongs beneath:

app/Assessments/SavedAssessments/

The user-facing assessment library belongs beneath:

app/Assessments/MyAssessments/

Keep the distinction:

SavedAssessments
→ persistence/data

MyAssessments
→ UI/workflow
12. Generic Questions

Generic Assessment question contracts belong beneath:

app/Assessments/Questions/

Current responsibilities include:

Content/
Generation/
Preview/
Selection/

Course-specific question-writing logic does not belong here.

13. Classes

Class-owned functionality belongs beneath:

app/Classes/

Current major areas include:

Components/
Coverage/
State/
ClassDetailsPage.tsx
ClassTypes.ts
MyClassesPage.tsx

Classes owns:

class data,
class persistence,
class coverage,
My Classes,
Class Details.
14. Classes Must Be Course-Aware, Not Course-Specific

Class coverage should resolve educational structure through:

SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree

Do not make Classes directly depend on:

National5MathsSkills

when the Course abstraction can provide the information.

15. Courses

Educational and Course-specific knowledge belongs beneath:

app/Courses/

Generic Course infrastructure includes:

CourseAssessmentConfig.ts
CourseCatalog.ts
CourseRegistry.ts
CourseTypes.ts
Papers/
Selection/

Course-specific implementation belongs beneath:

app/Courses/<Course>/
16. CourseId Ownership

CourseId is owned by:

app/Courses/CourseTypes.ts

Import it directly from its owner.

Do not re-export it from Assessment files merely for convenience.

Do not create parallel Course ID types.

17. Course Registry Terminology

Use the canonical Course Registry API.

Current terminology includes:

COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs

Do not reintroduce retired CourseConfig compatibility aliases unless a real compatibility requirement appears.

18. National 5 Mathematics

National 5 Mathematics knowledge belongs beneath:

app/Courses/National5Maths/

Current high-level structure:

AssessmentConfig.ts
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/
Skills/

Generic Assessment code should consume this knowledge through Course contracts where possible.

19. National 5 Maths Skills

The canonical National 5 Maths skills definition lives beneath:

app/Courses/National5Maths/Skills/

Do not create another skills tree elsewhere for convenience.

20. Historical Exam Material

Historical exam question and marking-scheme catalogues live beneath:

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/

with:

Questions/
MarkingSchemes/

Historical exam evidence and generated-question implementation are separate responsibilities.

21. Question and Answer Generation

National 5 Maths generation implementation lives beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/

Current conceptual structure:

AnswerMethods/
AnswerWriting/
QuestionWriting/

Use current terminology:

QuestionWriting
AnswerWriting
ExamQuestion
ExamMarkingScheme

Do not revive the retired Question Bank architecture.

22. Question Bank Is Retired

Do not recreate:

app/question-bank/

Live generation adapters were moved into Course-owned question-writing architecture.

Future generation work should extend:

app/Courses/<Course>/QuestionAndAnswerGeneration/

rather than creating a parallel question-bank domain.

23. Course Documents

National 5 Maths document composition belongs beneath:

app/Courses/National5Maths/Documents/

Course-specific document concerns may include:

cover-page composition,
formula sheets,
question pages,
question spacing,
Course document registration.

Generic document infrastructure does not belong here.

24. UI Architecture

UI is divided into:

app/UI/
├── Application/
└── Documents/

This separation is important.

25. Application UI

Interactive application presentation belongs beneath:

app/UI/Application/

Examples include:

Components/
HeaderBar/
Home/
Settings/
SettingsDrawer/
Theme/
Typography/

Application UI owns interactive product presentation.

26. Documents UI

Generated-document presentation belongs beneath:

app/UI/Documents/

Current major areas:

Components/
Layout/
Templates/

The generated-document system is distinct from interactive application UI.

27. Document Dependency Direction

Preserve this layering:

generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers

Generic document primitives:

app/UI/Documents/Components/

Qualification-family templates:

app/UI/Documents/Templates/NationalQualifications/

Course-specific documents:

app/Courses/National5Maths/Documents/

Assessment consumers:

app/Assessments/

Do not invert this dependency direction.

28. Application vs Documents Boundary

Code beneath:

app/UI/Documents/

should not depend on:

app/UI/Application/

Generated documents should not depend on application navigation, drawers, hover state or global application presentation.

An Assessment-owned interactive preview may use Application UI styling where that styling belongs to the editor experience.

29. Developer Tools

Runtime developer functionality belongs beneath:

app/DeveloperTools/

Current example:

GeneratorTester/

This is runtime source.

30. Repository Tools

Repository tooling and historical migrations belong beneath:

Tools/

This is different from:

app/DeveloperTools/

Rule:

app/DeveloperTools/
→ runtime developer application functionality

Tools/
→ repository tooling / migration history

Runtime application code should not depend on historical migration material.

31. Routing

Application routes are primarily dispatched through:

app/[...route]/page.tsx

Do not recreate duplicate feature folders solely to represent URLs.

Do not recreate:

app/create-assessment/
app/compile-assessment/
app/my-assessments/
app/my-classes/
app/dev/

as parallel source architecture.

The catch-all route is a thin adapter.

Product implementation stays with its owner.

32. Next.js Special Filenames

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

Use descriptive implementation names such as:

AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx

unless a real Next.js route/framework boundary is intended.

33. "use client"

Add "use client" only at genuine client entry boundaries.

Do not add it to every component or custom hook that uses:

useState
useEffect
useMemo
useRef
window
document
localStorage
event handlers

Internal modules imported below an existing client boundary inherit the client environment.

Do not add "use client" defensively.

34. Persistence Is a Compatibility Contract

Browser-persisted data survives source refactors.

Do not rename storage keys or persisted fields merely because they contain old terminology.

Before changing persisted data, investigate:

existing keys,
existing saved records,
normalisation,
backwards compatibility,
optional legacy fields,
migration requirements.

A persistence migration is a separate deliberate change.

35. Compatibility Code

Do not delete compatibility code merely because comments contain words such as:

legacy
compatibility
transitional
backwards compatibility

First determine what it supports.

Possible reasons include:

persisted data,
active event wiring,
old saved assessments,
old class records,
Course metadata compatibility.

Remove compatibility only after its consumers have been migrated or proven absent.

36. Dead Code Investigation

Before deleting a file, symbol or compatibility layer, check more than direct imports.

Investigate:

direct imports
re-exports
registries
dynamic imports
string lookup
route dispatch
browser events
persistence
Course registration
generated-data consumers

Absence from one grep is not always proof of dead code.

37. Ownership Before Movement

Before moving a file, answer:

Which domain owns this responsibility?

Use:

Assessments
→ generic assessment workflow

Classes
→ class data/workflow

Courses
→ educational/course knowledge

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation

DeveloperTools
→ runtime developer tooling

Tools
→ repository tooling/history

Do not move a file simply because many consumers happen to exist elsewhere.

38. Type Ownership

Types belong with the concept they describe.

Examples:

CourseId
→ app/Courses/CourseTypes.ts

Class types
→ app/Classes/ClassTypes.ts

Assessment types
→ app/Assessments/AssessmentTypes.ts

question content contracts
→ app/Assessments/Questions/Content/

generation contracts
→ app/Assessments/Questions/Generation/

Do not create a global:

shared-types/

bucket.

39. Avoid Generic Buckets

Do not introduce broad dumping grounds such as:

Helpers/
Utils/
Shared/
Common/
Misc/
math-helpers/
shared-types/

without a durable architectural responsibility.

Prefer domain-specific ownership.

40. No Placeholder Architecture

Do not create empty folders for hypothetical future work.

Examples include:

Higher Maths implementation before it exists,
Advanced Higher implementation before it exists,
OCR infrastructure before implementation begins,
AI marking folders before implementation begins.

Add architecture when real implementation requires ownership.

41. New Courses

When implementing another Course, place real Course-specific functionality beneath:

app/Courses/<Course>/

Expose it through generic Course contracts where appropriate.

Do not copy the entire National 5 Maths tree merely to make folders symmetrical.

Only create real responsibilities.

42. Structural Refactor Workflow

For non-trivial migrations, prefer:

AUDIT
  ↓
OWNER
  ↓
WRITE NEW
  ↓
TYPE-CHECK
  ↓
SWITCH CONSUMER
  ↓
VERIFY
  ↓
BROAD GREP
  ↓
DELETE OLD
  ↓
VERIFY AGAIN
  ↓
DOCUMENT
  ↓
COMMIT

Do not delete the old implementation before the replacement path is working.

43. Work in Small Visible Steps

Prefer small, understandable migrations.

Before mutation:

establish the current state;
identify the owner;
identify consumers;
explain what will change.

Avoid large unexplained mutation scripts.

Automation is acceptable for genuinely repetitive mechanical work, but the scope and operation must be clear first.

44. Source File Changes

When practical, provide or create complete replacement files rather than fragile chains of tiny text substitutions.

Use surgical edits when:

the file is genuinely very large,
the change is tiny,
and a full replacement would make review harder.

Preserve surrounding behaviour.

45. Verification Commands

After structural TypeScript/source work, normally run:

npx tsc --noEmit
npm run build
git --no-pager diff --check

Use:

git --no-pager ...

for Git output that could otherwise enter a pager during scripted verification.

46. Git Line-Ending Warnings

On Windows, Git may report messages such as:

LF will be replaced by CRLF the next time Git touches it

These are not automatically diff errors.

For whitespace validation, use:

git --no-pager diff --check

or, for staged changes:

git --no-pager diff --cached --check

Distinguish warnings from actual whitespace errors.

47. Next.js Generated Types

After changing route files, .next/types may temporarily describe an old route tree.

If TypeScript errors point only to stale generated route validators after a routing migration:

rebuild,
run Next type generation where appropriate,
or clear stale .next output.

Do not rewrite correct source merely to satisfy stale generated files.

48. Browser Smoke Testing

Type-check and build are not sufficient for final sign-off after substantive architecture changes.

Verify important workflows in the browser.

Major checks include:

Home
Assessment Setup
Assessment Creator
question generation
paper switching
assessment preview
settings
saved assessments
Compilation
My Assessments
My Classes
Class Details

If document infrastructure changed, visually inspect generated pages as well.

49. Visual Preservation

Architecture refactors should not accidentally change:

spacing,
typography,
colours,
paper layout,
question positioning,
cover-page layout,
formula-sheet layout,
interactive control behaviour.

If a migration is intended to be structural, visual output should remain equivalent.

50. Course Independence Check

When changing generic Assessment code, ask:

Is this rule genuinely generic, or is it National 5 Maths knowledge?

If it is Course-specific, prefer ownership beneath:

app/Courses/<Course>/
51. Classes Independence Check

When changing Classes, ask:

Could this work for another registered Course without importing that Course's concrete skills file?

If not, resolve the information through Course configuration instead.

52. Document Independence Check

When changing generated-document UI, ask:

Does this really belong to a generic document, a qualification family, or a specific Course?

Use the correct layer.

Do not put Course-specific layout into generic document primitives.

53. Do Not Infer Architecture from Legacy

Legacy code and historical migration files are evidence.

They are not precedent.

If current documentation and historical files disagree, determine whether the historical material is describing a past state.

Use:

Docs/RepositoryMap.md
Docs/Architecture.md
Docs/LockedDecisions.md

as current architectural guidance.

Use:

Docs/RefactorLedger.md
Tools/LegacyMigrations/

as history.

54. Documentation Changes

When architecture changes, update the relevant current-state documentation.

Do not blindly replace historical paths inside:

Docs/RefactorLedger.md

if those paths accurately describe what existed at that stage of the migration.

History should remain historically accurate.

55. No Feature Work During Structural Migration Without Need

When performing a structural refactor, avoid mixing unrelated feature development into the same change.

A migration should be easy to evaluate as:

same behaviour
+
better ownership

Feature changes should normally be separate.

56. Final Standard

A good change should leave the repository easier for the next developer to understand.

Before finishing, ask:

Is ownership clearer?
Is dependency direction clearer?
Did working behaviour survive?
Did persisted data survive?
Did public routing survive?
Is there one obvious source of truth?
Did we avoid creating another compatibility layer unnecessarily?
Did we remove old code only after proving it safe?
Does the documentation still match the repository?

If not, the migration is not finished.