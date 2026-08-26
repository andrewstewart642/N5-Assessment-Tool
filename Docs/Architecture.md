# VecEd Architecture

## 1. Purpose

This document defines the current architecture of VecEd.

It explains:

- the major application domains,
- ownership boundaries,
- dependency direction,
- routing architecture,
- Course abstraction,
- Assessment architecture,
- Classes architecture,
- question-generation architecture,
- generated-document architecture,
- application UI architecture,
- persistence rules,
- client-boundary rules,
- and the standards that future structural work must preserve.

For the physical location of individual files and folders, see:

```text
Docs/RepositoryMap.md

For architectural decisions that should not be casually revisited, see:

Docs/LockedDecisions.md

For the history of Architecture V2 and earlier migrations, see:

Docs/RefactorLedger.md

This document describes current architecture, not migration history.

2. Architectural Goal

VecEd should be understandable without knowing how it was originally built.

A developer or coding agent should be able to inspect the repository and determine:

app/Assessments/

→ assessment workflow

app/Classes/

→ school-class data and class workflows

app/Courses/

→ educational and course-specific knowledge

app/UI/Application/

→ interactive application presentation

app/UI/Documents/

→ generated-document presentation

app/DeveloperTools/

→ runtime developer utilities

Tools/

→ repository tooling and historical migrations

The architecture should express responsibility directly rather than requiring historical knowledge.

3. Acceptance Criterion Zero: Preserve Behaviour

Architecture work must not remove functioning product behaviour merely to produce a cleaner folder structure.

The first acceptance criterion for structural work is:

Existing working product behaviour remains working unless a behavioural change is explicitly intended.

Architecture work may:

move files,
rename files,
split files,
merge files,
simplify APIs,
remove proven dead code,
eliminate compatibility aliases once consumers are migrated,
improve dependency direction.

Architecture work must not casually:

delete functioning features,
invalidate saved user data,
break public URLs,
alter generated assessment output,
remove active compatibility behaviour,
or silently change workflow semantics.

Clean architecture is not more important than preserving the product.

4. Runtime Source Model

All runtime application source lives beneath:

app/

The top-level runtime source structure is:

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

There is no separate runtime:

src/

tree.

The root app/ folder therefore serves two roles:

the Next.js App Router source root;
the container for VecEd's product architecture.

Those roles are deliberately separated through naming and ownership rules.

5. Product Architecture vs Routing Architecture

VecEd's product architecture must not mirror its URL structure.

For example:

/create-assessment/builder

is a public URL.

Its implementation belongs to:

app/Assessments/Creation/AssessmentCreatorPage.tsx

The repository must not recreate:

app/create-assessment/builder/

merely because that URL exists.

Likewise:

/my-classes

maps to a Classes-owned implementation rather than requiring:

app/my-classes/

as a feature directory.

URLs describe navigation.

Product folders describe ownership.

These are separate concerns.

6. Routing Architecture

Most application URLs are dispatched by:

app/[...route]/page.tsx

The catch-all route is intentionally thin.

Its responsibility is to:

read route segments,
resolve route parameters,
select the appropriate product-owned page,
call notFound() when no route exists.

It must not accumulate feature logic.

The homepage remains:

app/page.tsx

Global App Router composition remains:

app/layout.tsx
7. Current Public Route Contract

The current route contract includes:

/

→ Home

/create-assessment

→ Assessment Setup

/create-assessment/builder

→ Assessment Creator

/compile-assessment

→ Assessment Compilation

/my-assessments

→ My Assessments

/my-classes

→ My Classes

/my-classes/:classId

→ Class Details

/dev/generator-tester

→ Generator Tester

Architecture refactors should preserve these URLs unless changing a public route is an explicit product decision.

8. Next.js Special Filename Rule

Because product code lives inside Next.js's app/ tree, framework-significant filenames must be used deliberately.

Examples include:

page.tsx
layout.tsx
route.ts
loading.tsx
error.tsx
not-found.tsx
template.tsx
default.tsx

These names have App Router meaning.

Ordinary product implementations should therefore use descriptive names such as:

AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx

A product folder must not gain a page.tsx simply because the component visually represents a page.

9. Primary Ownership Domains

The primary runtime ownership domains are:

Assessments
Classes
Courses
DeveloperTools
UI

Ownership is based on responsibility.

It is not based on:

which feature first created a file,
which feature currently imports it most often,
where a historical version lived,
or which folder would make an import path shortest.

The owner is the domain whose responsibility the concept represents.

10. Dependency Principle

A consumer may depend on an owner.

An owner should not move merely because another feature consumes it.

Example:

Classes
   ↓
CourseRegistry
   ↓
CourseAssessmentConfig

Classes consumes Course knowledge.

That does not make Course configuration part of Classes.

Likewise:

Assessment Creation
   ↓
Course assessment configuration

does not make Course knowledge part of Assessment Creation.

11. Avoid Circular Ownership

Dependencies should form understandable directions.

Preferred conceptual flow:

Course knowledge
      ↓
generic Assessment / Classes consumers

and:

generic document primitives
      ↓
qualification-family templates
      ↓
Course-specific documents
      ↓
Assessment consumers

Application features should not create circular ownership merely to avoid a small amount of explicit wiring.

12. No Generic Dumping Grounds

Avoid broad folders such as:

Helpers/
Utils/
Shared/
Common/
Misc/
shared-types/
math-helpers/

unless a durable responsibility genuinely requires one.

A function should normally live beside the domain that owns the concept it implements.

Prefer:

Classes/Coverage/ClassCoverageHelpers.ts

over:

Utils/ClassHelpers.ts

Prefer:

Courses/CourseTypes.ts

over:

shared-types/CourseTypes.ts

Specific ownership is more valuable than globally short import paths.

13. Assessments Domain

Generic assessment workflow belongs beneath:

app/Assessments/

The domain includes:

Compilation/
Creation/
MyAssessments/
Questions/
SavedAssessments/
AssessmentTypes.ts

Assessments owns the lifecycle of creating, saving, previewing, analysing and compiling assessments.

Assessments should remain course-aware but not course-specific.

14. Assessment Types

Generic assessment concepts belong in:

app/Assessments/AssessmentTypes.ts

Examples include concepts genuinely owned by assessments such as:

papers,
assessment questions,
question standards,
thinking-type filters,
assessment-specific question contracts.

Course identity itself is not Assessment-owned.

CourseId belongs to:

app/Courses/CourseTypes.ts

Consumers should import it directly from Courses.

Do not create convenience re-exports that obscure ownership.

15. Assessment Creation

Assessment Creation lives beneath:

app/Assessments/Creation/

It represents the interactive workflow for configuring and building an assessment.

The main page entry points are:

AssessmentSetupPage.tsx
AssessmentCreatorPage.tsx

Assessment Creation is intentionally divided by visible and behavioural responsibility.

Current major areas include:

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
16. Assessment Setup

Assessment Setup owns configuration gathered before the main Creator workspace.

Responsibilities include:

Course selection,
assessment type,
paper structure,
build priority,
mark targets,
time targets,
assessment name,
assessment date,
class selection,
coverage selection,
cover-page options,
formula-sheet options.

Setup should work through Course configuration rather than hard-coding National 5 Maths.

17. Assessment Creator

AssessmentCreatorPage.tsx is the composition root for the main creation workspace.

It may coordinate:

feature state,
persistence hooks,
question state,
paper state,
preview state,
analysis,
workspace composition,
settings state.

It should not become the permanent owner of every implementation detail.

When a coherent responsibility can be expressed in a dedicated hook, component or module, that implementation should live in its relevant Creation subfolder.

The goal is not the smallest possible page file.

The goal is a page whose orchestration remains understandable.

18. TopBar

Assessment Creation's upper-row UI belongs beneath:

app/Assessments/Creation/TopBar/

The name TopBar is reserved for this Assessment Creation region.

It is distinct from the global application:

HeaderBar

TopBar concerns include items such as:

assessment metadata,
date controls,
active/view paper controls,
preview zoom.
19. HUDBar

Assessment Creation's lower status/control area belongs beneath:

app/Assessments/Creation/HUDBar/

The name HUDBar is reserved for the lower Creator region.

It owns Creator-specific progress/status presentation.

20. SkillsPanel

Skills selection belongs beneath:

app/Assessments/Creation/SkillsPanel/

SkillsPanel owns interactive skill-selection presentation.

It may:

display the active Course skill tree,
filter skills,
display category sections,
display concepts,
manage difficulty interaction,
display class-coverage information.

It must not own the underlying educational definition of National 5 Maths skills.

That belongs to Courses.

21. Paper State

Assessment Creation paper workflow belongs beneath:

app/Assessments/Creation/Papers/

This includes generic concerns such as:

active paper,
viewed paper,
paper targets,
timing,
selection,
paper-value maps,
sitting state.

Some internal models still expose P1/P2 compatibility fields because persisted assessment data uses them.

Those compatibility seams are not justification for moving paper ownership or deleting working compatibility.

22. PaperWorkspace

The central Creator workspace belongs beneath:

app/Assessments/Creation/PaperWorkspace/

It owns the interactive workspace itself.

Responsibilities include:

Creator workspace layout,
panes,
preview viewport,
zoom/view behaviour,
document locking behaviour,
split layout,
preview composition.

Preview implementation specific to the workspace belongs beneath:

PaperWorkspace/Preview/

The workspace may consume generated-document primitives.

It does not own those primitives.

23. Assessment Question Workflow

Assessment Creation-specific question workflow belongs beneath:

app/Assessments/Creation/Questions/

It owns concerns such as:

question drafts,
generated question state,
edit state,
question controls,
Creator-specific question preview,
question workflow.

Generic question contracts belong higher in:

app/Assessments/Questions/

Course-specific writers belong under the Course.

24. Assessment Analysis

Assessment quality analysis belongs beneath:

app/Assessments/Creation/Analysis/

Analysis may measure concerns such as:

topic distribution,
standard distribution,
calculator balance,
operational/reasoning balance,
assessment quality indicators.

Analysis should consume generic Assessment data and Course configuration.

It should not contain hidden National 5 Maths curriculum definitions.

25. Assessment Settings

Assessment-specific settings belong beneath:

app/Assessments/Creation/AssessmentSettings/

These settings are specific to the Assessment Creation workflow.

They are distinct from global application settings beneath:

app/UI/Application/SettingsDrawer/

Both may visually use a Drawer.

Using the same presentation primitive does not make them the same domain.

26. Assessment Persistence

Creation persistence belongs beneath:

app/Assessments/Creation/Persistence/

Persistence is an architectural boundary because browser-saved data survives code refactors.

Persisted data must therefore be treated as an external compatibility contract.

27. Persisted Data Rule

Do not rename storage keys, saved fields or persisted contracts merely to make source terminology prettier.

Examples of historical terminology may remain in persisted data even after source ownership has changed.

A source refactor and a persisted-data migration are separate changes.

A persisted-data migration requires deliberate handling of:

existing users,
old localStorage data,
defaults,
normalisation,
optional compatibility fields,
migration order.

Legacy wording in persistent storage is acceptable when it protects user data.

28. Saved Assessments

Persistent saved-assessment models belong beneath:

app/Assessments/SavedAssessments/

The saved-assessment domain owns:

saved-assessment data contracts,
saved-assessment storage,
backwards-compatible normalisation where required.

The UI for browsing saved assessments belongs separately beneath:

app/Assessments/MyAssessments/

This distinction is intentional:

SavedAssessments
→ data and persistence

MyAssessments
→ user-facing library experience
29. Shared Assessment Questions

Generic question architecture belongs beneath:

app/Assessments/Questions/

Its responsibilities include:

Content/
Generation/
Preview/
Selection/

These modules define contracts generic assessment workflows can use.

They should not encode National 5 Maths-specific generation decisions.

30. Question Content

Generic structured question/answer content belongs beneath:

app/Assessments/Questions/Content/

For example:

PaperParts.ts

provides generic content structures that can be rendered by document/UI consumers.

31. Question Generation Contracts

Generic question/answer generation contracts belong beneath:

app/Assessments/Questions/Generation/

This layer answers questions such as:

what input does a generator receive?
what output does a generator return?
what generic metadata does an answer generator provide?

It does not answer:

How should National 5 Maths percentage questions be written?

That belongs in the Course implementation.

32. Question Selection Contracts

Generic question-selection models belong beneath:

app/Assessments/Questions/Selection/

Course configuration may supply tags or metadata consumed by selection.

Compatibility fields may remain while genuine consumers still require them.

33. Shared Question Preview

Shared assessment-question preview belongs beneath:

app/Assessments/Questions/Preview/

This includes:

QuestionLockedPreview.tsx
QuestionPreviewLayout.ts

These are Assessment-owned previews.

They are not themselves generic generated-document primitives.

Because they participate in the interactive application preview experience, they may use Application UI typography when appropriate.

The stronger layering rule is:

app/UI/Documents/ must not depend on app/UI/Application/.

34. Assessment Compilation

Compilation belongs beneath:

app/Assessments/Compilation/

Compilation is conceptually separate from Creation.

Creation asks:

What should this assessment contain?

Compilation asks:

How should the chosen assessment become a final paginated document?

Compilation owns concerns such as:

page sizes,
pagination,
compiled document composition,
compilation workflow.
35. Compilation and Courses

Compilation must obtain Course-specific document behaviour through Course-owned document configuration.

It should not become a second location for National 5 Maths document knowledge.

Preferred direction:

Assessment Compilation
        ↓
Course Documents
        ↓
qualification-family templates
        ↓
generic document primitives
36. Classes Domain

Class-owned functionality belongs beneath:

app/Classes/

Classes owns:

class records,
class names and metadata,
course association,
completed skill coverage,
class persistence,
My Classes,
Class Details,
reusable class UI,
class coverage presentation.
37. Class Types

Class-specific contracts belong in:

app/Classes/ClassTypes.ts

A Class may reference:

CourseId

but does not own Course identity.

CourseId remains defined by Courses.

38. Class State

Class state and persistence belong beneath:

app/Classes/State/

This includes:

storage,
normalisation,
class state hooks.

Class storage compatibility should be preserved when existing browser data depends on it.

39. Class Coverage

Class coverage belongs beneath:

app/Classes/Coverage/

Class coverage must resolve educational skills through Course configuration.

Preferred flow:

SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree

Classes should not directly import:

National5MathsSkills

merely because National 5 Maths is currently the most complete Course.

That would destroy Course independence.

40. Courses Domain

Course-specific educational knowledge belongs beneath:

app/Courses/

Courses owns concepts such as:

Course identity,
Course registration,
assessment configuration,
skills,
qualification-specific rules,
Course documents,
historical exam evidence,
question writers,
answer writers.

The Courses domain is the principal boundary preventing generic Assessment and Classes workflows from becoming National-5-Maths-specific.

41. Course Identity

Course identity belongs in:

app/Courses/CourseTypes.ts

CourseId must have one canonical owner.

Do not recreate aliases such as:

AssessmentCourseId

or re-export CourseId from unrelated domains merely to shorten imports.

42. Course Catalog

Selectable Course catalogue information belongs in:

app/Courses/CourseCatalog.ts

This represents user-facing Course availability/metadata.

It is distinct from runtime assessment configuration.

43. Course Registry

Course assessment configurations are registered through:

app/Courses/CourseRegistry.ts

Canonical terminology is:

COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs

Historical shorter CourseConfig aliases should not be reintroduced.

44. Course Assessment Config

The generic contract between Courses and Assessment workflows lives in:

app/Courses/CourseAssessmentConfig.ts

Its purpose is to answer:

What does a generic Assessment workflow need to know about this Course?

This contract allows generic application code to consume Course knowledge without knowing the concrete Course implementation.

45. Course Selection

Course-selection persistence belongs beneath:

app/Courses/Selection/

Ownership belongs to Courses because the persisted value represents Course identity/selection.

Historical storage keys may remain where required for backwards compatibility.

46. Course Paper Rules

Generic access to Course paper behaviour belongs beneath:

app/Courses/Papers/

This boundary prevents Assessment Creation from hard-coding Course-specific paper assumptions where a Course contract can supply them.

47. National 5 Mathematics

National 5 Mathematics implementation belongs beneath:

app/Courses/National5Maths/

Its major responsibilities include:

AssessmentConfig.ts
Skills/
Documents/
ExamQuestionAndAnswerCatalog/
QuestionAndAnswerGeneration/

National 5 Maths-specific knowledge should normally remain inside this domain.

48. National 5 Maths Skills

The canonical National 5 Mathematics skill tree belongs beneath:

app/Courses/National5Maths/Skills/

Generic consumers receive that structure through the Course configuration.

They should not know the concrete skills file path.

49. Historical Exam Evidence

Historical National 5 Mathematics exam questions and marking schemes belong beneath:

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/

The catalogue separates:

Questions/
MarkingSchemes/

The catalogue represents evidence from historical examination material.

It is not the same thing as generated-question implementation.

50. Question and Answer Generation

Course-specific generation implementation belongs beneath:

app/Courses/National5Maths/QuestionAndAnswerGeneration/

The high-level distinction is:

QuestionWriting/
AnswerWriting/
AnswerMethods/

This terminology should be preferred over historical ambiguous terms such as:

QuestionGeneration
SourceQuestion
SourceMarkingScheme

when referring to the current architecture.

51. Question Writing

Question-writing logic belongs beneath:

QuestionAndAnswerGeneration/QuestionWriting/

It owns:

concept selection,
writer registration,
concept modules,
concept-specific question writers.

Concept modules may adapt Course evidence into generation behaviour.

They remain part of the Course because they encode educational knowledge.

52. Answer Writing

Answer-writing implementation belongs beneath:

QuestionAndAnswerGeneration/AnswerWriting/

It is distinct from question writing even when both are invoked by one assessment-generation flow.

This separation allows an answer implementation to evolve without embedding all answer logic inside question writers.

53. Answer Methods

Course-specific answer-method knowledge belongs beneath:

QuestionAndAnswerGeneration/AnswerMethods/

Generic Assessment code may consume answer-generation contracts, but the educational method itself remains Course-owned.

54. Question Bank Architecture Is Retired

The historical:

app/question-bank/

architecture is not part of Architecture V2.

It must not be recreated.

Live concept adapters were migrated to the Course-owned question-writing architecture.

Historical/evidence files that had no consumers were removed after consumer tracing.

Future question-generation work should extend the Course architecture rather than creating a parallel Question Bank.

55. Adding a New Course

A new Course belongs beneath:

app/Courses/<Course>/

Only create folders required by real implementation.

Do not pre-create empty structures for:

Higher Mathematics,
Advanced Higher Mathematics,
future qualifications,
future document systems,
future question generation.

When implementation exists, expose it through the generic Course contracts where appropriate.

The architecture should grow from real responsibilities rather than speculative placeholders.

56. UI Domain

Presentation infrastructure belongs beneath:

app/UI/

The most important visual boundary is:

UI/
├── Application/
└── Documents/

These represent different presentation systems.

57. Application UI

Interactive product UI belongs beneath:

app/UI/Application/

This includes concerns such as:

global HeaderBar,
settings,
application theme,
colours,
typography,
interactive controls,
drawers,
home-page UI.

Application UI is allowed to depend on browser interaction where required.

58. Generated Document UI

Generated-document presentation belongs beneath:

app/UI/Documents/

This layer represents printable/document-like output.

It should remain conceptually independent of the interactive application chrome.

Document output must not rely on global navigation, settings drawers, hover behaviour or application-only layout assumptions.

59. Application UI Must Not Own Documents

A generated assessment may be previewed inside the application.

That does not make document layout part of Application UI.

The preview container may be Application/Assessment-owned.

The document being rendered inside it remains Document/Course-owned.

This distinction prevents the printable document system becoming coupled to editor chrome.

60. Document Layering

Generated documents follow this layering model:

generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment consumers

Each layer should add only the knowledge it owns.

61. Generic Document Primitives

Generic document primitives live beneath:

app/UI/Documents/Components/

Examples include:

A4PageFrame.tsx
DocumentPageFrame.tsx
PaperContent.tsx

These components should remain qualification-agnostic where practical.

62. Document Layout Utilities

Generic document measurement/layout logic belongs beneath:

app/UI/Documents/Layout/

For example:

DocumentUnits.ts

should provide generic conversion/layout behaviour rather than National 5 Maths semantics.

63. Qualification-Family Templates

National Qualifications presentation patterns belong beneath:

app/UI/Documents/Templates/NationalQualifications/

This layer may encode formatting common to a qualification family.

Examples include:

NationalQualificationsPageFrame.tsx
NationalQualificationsQuestionPageFrame.tsx
NationalQualificationsCoverPage.tsx

It should not encode National 5 Maths curriculum knowledge.

64. Course Documents

National 5 Maths document composition belongs beneath:

app/Courses/National5Maths/Documents/

Course Documents may compose:

generic Document primitives
+
National Qualifications templates
+
National 5 Maths-specific content

Examples include:

National 5 Maths cover pages,
formula sheets,
question-page composition,
question-spacing rules.
65. Document Dependency Boundary

The generated-document system must not depend on interactive Application UI.

Specifically:

app/UI/Documents/

should not import from:

app/UI/Application/

If generated documents require typography, spacing or colours, document-appropriate ownership should be established rather than silently depending on the application theme.

An Assessment-owned interactive preview may still use Application typography if that styling belongs to the editor/preview experience rather than the generated document itself.

66. Application Theme

Global application theming belongs beneath:

app/UI/Application/Theme/

Theme infrastructure may provide:

colour mode,
appearance preference,
accent colour,
visual semantic tokens.

Theme compatibility aliases may remain while they have genuine active consumers.

They should be removed only after consumer migration proves them redundant.

67. Application Typography

Interactive application typography belongs beneath:

app/UI/Application/Typography/

UI_TYPO is the canonical application typography token set.

It is appropriate for:

controls,
metadata,
application headings,
Creator UI,
Classes UI,
interactive previews where the preview styling is part of the application.

It should not automatically become the typography source for generated documents.

68. Global HeaderBar

Global navigation/header functionality belongs beneath:

app/UI/Application/HeaderBar/

Recognised terminology:

HeaderBar

The HeaderBar is global application chrome.

It is not the same concept as Assessment Creation's:

TopBar

These names must remain distinct.

69. Drawers

Generic interactive Drawer primitives belong beneath:

app/UI/Application/Components/Drawer/

A feature may compose those primitives without moving its settings into UI/Application.

For example:

AssessmentSettings

remains Assessment-owned even though it uses a Drawer.

70. Global Settings Drawer

Global application appearance/settings functionality belongs beneath:

app/UI/Application/SettingsDrawer/

This owns application-wide settings.

It must remain separate from:

app/Assessments/Creation/AssessmentSettings/

which owns assessment-specific settings.

71. Client Boundaries

"use client" marks a module boundary between Server and Client Component graphs.

It should therefore be placed deliberately.

A file does not need its own "use client" merely because it contains:

useState,
useEffect,
useMemo,
useRef,
browser APIs,
event handlers.

If the file is imported only beneath an existing client boundary, it inherits that client environment.

72. Genuine Client Entry Boundaries

Appropriate client boundaries include modules that are intentionally imported from a server boundary while establishing an interactive client subtree.

Typical examples may include:

interactive top-level application pages,
providers,
global interactive components mounted by layout.tsx.

Internal hooks and internal child components should not add redundant directives.

Do not add "use client" defensively.

73. Why Client-Boundary Discipline Matters

Unnecessary client directives:

enlarge client boundaries,
obscure Server/Client ownership,
make component behaviour harder to reason about,
may create hydration problems,
reduce the architectural value of Next.js boundaries.

Architecture V2 therefore prefers a small number of deliberate client entry points over "use client" on every interactive file.

74. Providers

Global providers should exist only when they represent genuinely global state or environment.

Current examples include application theme/settings infrastructure.

Do not introduce a new global provider simply to avoid passing a small explicit dependency.

Prefer local ownership where state is local.

75. State Management

Architecture V2 does not introduce a new external state-management library.

Existing React state, hooks, contexts and persistence remain appropriate where they fit.

A state-library migration would be a separate architectural decision requiring a demonstrated problem.

Do not add Redux, Zustand or another global state system merely as part of routine cleanup.

76. Explicit Dependencies Over Hidden Coupling

Prefer explicit component/hook dependencies over hidden browser-event communication.

Custom browser events may remain while actively required for compatibility or existing feature wiring.

They should not be deleted until a replacement path exists.

When replacing hidden event coupling:

introduce explicit path
→ switch all consumers
→ verify behaviour
→ remove event bridge

Do not simply delete the event because the architecture would look cleaner without it.

77. Developer Tools

Runtime developer-only functionality belongs beneath:

app/DeveloperTools/

It is part of the application source tree because the tools execute inside the application runtime.

Current example:

GeneratorTester/

Developer Tools should not contain production educational ownership merely because a developer tool consumes it.

78. Repository Tools

Repository tooling belongs beneath:

Tools/

This is separate from:

app/DeveloperTools/

The distinction is:

app/DeveloperTools/
→ runtime application tooling

Tools/
→ repository scripts, migration artefacts and historical tooling

Runtime application code should not depend on historical migration tooling.

79. Legacy Migration Material

Historical one-off migration material belongs beneath:

Tools/LegacyMigrations/

It exists as repository history/tooling.

Legacy migrations are evidence of how the repository arrived at its current state.

They are not precedent for new runtime architecture.

80. Naming Architecture

Names should describe current product concepts.

Preferred terms include:

Assessment Creation
Assessment Compilation
HeaderBar
TopBar
HUDBar
SkillsPanel
PaperWorkspace
Drawer
Popover
QuestionWriting
AnswerWriting
ExamQuestion
ExamMarkingScheme
CourseAssessmentConfig

Avoid reviving superseded implementation terminology simply because old files or persisted keys still contain it.

81. Builder Terminology

The public URL:

/create-assessment/builder

and some persisted keys may continue to contain builder.

That does not mean the source architecture should return to:

Builder/
BuilderComponents/
BuilderLogic/

The current source concept is:

Assessment Creation

Persisted/public compatibility wording and source architecture terminology are allowed to differ.

82. Type Ownership

Types should live with the concept that owns them.

Examples:

CourseId
→ Courses/CourseTypes.ts

Class data
→ Classes/ClassTypes.ts

generic assessment types
→ Assessments/AssessmentTypes.ts

question content contracts
→ Assessments/Questions/Content/

generation contracts
→ Assessments/Questions/Generation/

Do not create a global shared-types bucket merely because several domains consume a type.

Multi-domain consumption does not remove ownership.

83. Compatibility Aliases

Compatibility aliases are acceptable only when they serve an active migration or compatibility purpose.

Before deleting one:

find definitions
→ find imports
→ find indirect consumers
→ check persisted data
→ check dynamic access
→ migrate consumers
→ verify
→ delete alias

An alias with no consumers can be removed.

An alias with active persisted-data responsibilities cannot be removed merely because its name looks old.

84. Dead Code Standard

Code is not dead merely because no obvious static import appears in one search.

Before deletion, check:

direct imports,
re-exports,
registry references,
dynamic imports,
string-based lookup,
persistence contracts,
runtime events,
Course registration,
route dispatch,
generated-data consumers.

Delete only after the ownership/consumer investigation supports it.

85. Refactor Migration Pattern

Structural migrations should normally follow:

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

The exact implementation may vary, but the principle is:

Do not destroy the old path until the new path is proven.

86. Verification Standard

Structural source changes should normally be followed by:

npx tsc --noEmit
npm run build
git --no-pager diff --check

When Next.js route files change, stale generated .next/types may temporarily cause type errors.

In that case, regenerate route types through a build/typegen or remove stale .next output as appropriate.

Do not interpret stale generated route types as proof that the source migration itself is wrong.

87. Browser Verification

Compilation and type-checking are necessary but not sufficient for visible application changes.

After substantive architecture work, browser smoke testing should confirm major workflows such as:

Home
→ Assessment Setup
→ Assessment Creator
→ preview behaviour
→ saved assessment behaviour
→ Compilation
→ My Assessments
→ My Classes
→ Class Details

Generated document pages should also be visually checked where their rendering infrastructure changed.

88. Course Independence Test

A useful architecture test is:

Could another Course be added without copying and rewriting the entire Assessment workflow?

If the answer is no because generic Assessment code contains National 5 Maths-specific knowledge, ownership is probably wrong.

Course-specific knowledge should migrate toward the Course boundary.

89. Classes Independence Test

A useful Classes architecture test is:

Can a Class point to a different registered Course without Classes importing that Course's concrete skills implementation?

If not, Classes is too tightly coupled to one Course.

Use CourseRegistry and CourseAssessmentConfig.

90. Document Independence Test

A useful document architecture test is:

Could the generated assessment document be rendered without relying on the interactive application theme/navigation system?

If not, the Documents layer is probably coupled too strongly to Application UI.

Generated documents should own or receive their own presentation requirements.

91. Creation Independence Test

A useful Assessment Creation test is:

Can the Creator obtain educational rules through Course configuration rather than importing one Course's concrete implementation everywhere?

If not, Course knowledge is leaking into the generic workflow.

92. Feature Folder Standard

Create a new subfolder when it represents a coherent, durable responsibility.

Do not create folders solely to:

reduce the number of files visible in Explorer,
mirror another feature,
reserve space for future work,
encode arbitrary numbering,
make every file have a unique directory.

Many small coherent files are acceptable.

Micro-fragmentation without ownership value is not.

93. Visible-Area Structure

For complex UI features, grouping by visible product area is preferred when that area represents a real responsibility.

Examples:

TopBar/
HUDBar/
SkillsPanel/
PaperWorkspace/
SettingsDrawer/

This makes repository navigation align with the UI vocabulary used during development.

94. Decorative Numbering

Folder numbering should not be introduced merely to force Explorer ordering.

Existing numbered SkillsPanel folders may remain during Architecture V2 where changing them provides no meaningful ownership benefit.

Future architecture should prefer descriptive ownership over decorative ordering.

95. No Placeholder Architecture

Do not create empty architecture for future features.

Examples:

no empty Higher Maths Course tree,
no empty Advanced Higher tree,
no speculative OCR domain,
no future AI marking folders,
no empty document-template hierarchies.

Create architecture when real implementation needs an owner.

96. Future OCR / Marking Work

OCR and assisted-marking concepts may be added in future.

Their current conceptual existence is not sufficient reason to create placeholder runtime folders.

When implementation begins:

determine the actual responsibilities;
establish ownership based on real behaviour;
introduce the smallest coherent architecture required.

Future ideas must not distort today's repository.

97. Privacy Boundary

VecEd's class/assessment architecture should preserve the privacy model that pupil names do not need to be stored by the application server.

Where pupil identity is required, product architecture should favour non-identifying IDs and local teacher-owned mapping where appropriate.

Future data architecture must not casually weaken that boundary.

98. Application Source vs Historical Evidence

The repository contains both:

current runtime source

and:

historical migration/tooling evidence

Current source defines architecture.

Historical files explain how the current source was reached.

Never infer a preferred modern pattern merely because a legacy migration file used it.

99. Documentation Roles

Architecture documentation has distinct responsibilities.

Docs/Architecture.md

defines architecture and dependency principles.

Docs/RepositoryMap.md

defines current physical locations.

Docs/LockedDecisions.md

records decisions that should not be casually reopened.

Docs/RefactorLedger.md

records historical migration work.

Docs/ChatGPTWorkflow.md

defines safe AI-assisted development procedure.

AGENTS.md

provides concise repository instructions for coding agents.

Do not turn one document into all six.

100. Architecture V2 Definition of Done

Architecture V2 is successful when:

runtime source has clear owners,
duplicated legacy architecture is removed,
route structure does not duplicate product structure,
generic Assessment workflow is separated from Course knowledge,
Classes resolves Course skills through the Course abstraction,
question writing and answer writing are Course-owned,
historical exam evidence is separated from generation implementation,
generated Documents are separated from Application UI,
shared types have explicit owners,
redundant compatibility aliases have been removed where safe,
active persisted-data compatibility has been preserved,
client boundaries are deliberate,
runtime Developer Tools and repository Tools are distinct,
no obsolete parallel source roots remain,
documentation describes the current repository accurately,
and the existing website continues to function.

The goal is not architectural novelty.

The goal is a repository whose structure communicates the product clearly enough that future development can proceed without recreating the confusion Architecture V2 removed.