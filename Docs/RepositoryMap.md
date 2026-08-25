# VecEd Repository Map

**Document type:** Practical repository navigation and migration map  
**Architecture version:** Architecture V2  
**Status:** Active and expected to change throughout the refactor  
**Primary purpose:** Record where VecEd responsibilities physically live now, where they are intended to live under Architecture V2, and how developers should navigate the repository during migration

---

# 1. Purpose of This Document

This document is the practical navigation companion to:

```text
Docs/Architecture.md
Docs/LockedDecisions.md

Architecture.md answers:

How should VecEd be organised?

LockedDecisions.md answers:

Which architectural decisions have already been settled?

RepositoryMap.md answers:

Where does the code physically live right now?

and:

Where is that responsibility expected to live after Architecture V2 migration?

This distinction is extremely important during the Architecture V2 refactor.

For a period of time, the intended architecture and the physical repository
will deliberately differ.

For example:

Architecture V2 may state:

HeaderBar
→ src/UI/Application/HeaderBar/

while the current implementation may still physically exist under a legacy
root folder.

That does not mean the Architecture V2 rule has changed.

It means the migration is incomplete.

2. This Document Must Describe Reality

Unlike Architecture.md, this file should be updated frequently during the
refactor.

It must not pretend that a target folder already exists if migration has not
yet occurred.

Every significant area should be distinguishable as one of:

V2 IMPLEMENTED
LEGACY — ACTIVE
MIGRATION IN PROGRESS
TARGET — NOT YET IMPLEMENTED
AUDIT REQUIRED
SAFE TO REMOVE

Where uncertainty exists, say so.

Do not guess.

3. Repository Map Status Vocabulary

The following status labels are used throughout this document.

V2 IMPLEMENTED

The responsibility has been migrated into its approved Architecture V2
location and is currently authoritative there.

LEGACY — ACTIVE

The responsibility remains in the historical source structure and is still
required by the working application.

Do not delete it.

MIGRATION IN PROGRESS

The responsibility currently exists partly in legacy source and partly in the
new Architecture V2 structure.

The Refactor Ledger should describe the current migration stage.

TARGET — NOT YET IMPLEMENTED

Architecture V2 has defined the intended owner/location, but the current
working implementation has not yet been migrated there.

AUDIT REQUIRED

The file/folder exists, but its long-term role has not yet been established
with sufficient confidence.

Inspect before moving, renaming or deleting it.

SAFE TO REMOVE

The responsibility has been verified as redundant or obsolete and may be
deleted.

This status should only be used after dependency analysis and verification.

4. Repository Root — Current Transitional View

During Architecture V2, the repository conceptually contains two worlds:

N5-Assessment-Tool/
│
├── ARCHITECTURE V2
│   ├── Docs/
│   ├── src/
│   ├── Tools/                  # when required
│   └── AGENTS.md
│
├── LEGACY APPLICATION SOURCE
│   ├── app/
│   ├── course-data/
│   ├── math-helpers/
│   ├── page-sections/
│   ├── shared-types/
│   └── ui/
│
├── REPOSITORY / STATIC INFRASTRUCTURE
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   ├── postcss.config.mjs
│   └── .gitignore
│
└── LEGACY / MAINTENANCE ARTEFACTS REQUIRING REVIEW
    ├── percentage_catalogue_hardening/
    ├── percentage_catalogue_hardening_bundle.zip
    ├── n5-assessment-tool@0.1.0
    ├── next
    └── npm

The Architecture V2 VS Code workspace hides much of the legacy application
source by default.

That hiding is visual only.

The legacy folders remain physically present and currently support the running
application.

5. Architecture V2 Documentation

Current V2 documentation location:

Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md

Root:

AGENTS.md

Current documentation creation status at the initial V2 setup stage:

Architecture.md       → created
LockedDecisions.md    → created
RepositoryMap.md      → this document
RefactorLedger.md     → pending creation
ChatGPTWorkflow.md    → pending creation
AGENTS.md             → pending creation

Update this status once those files are created.

6. Docs/Architecture.md

Status: V2 IMPLEMENTED

Owns

The long-lived architectural constitution of VecEd.

It defines:

architectural philosophy;
source domains;
ownership rules;
naming conventions;
UI terminology;
Assessment Creation architecture;
Course architecture;
persistence philosophy;
routing conventions;
migration principles.
Does not own
current migration status;
exact current file locations;
chronological work history;
detailed AI startup prompts.

Those responsibilities belong elsewhere.

7. Docs/LockedDecisions.md

Status: V2 IMPLEMENTED

Owns

The binding architectural decision register.

It records decisions which future conversations must not casually reinterpret.

Does not own

The complete explanatory rationale of the architecture.

That remains primarily in Architecture.md.

8. Docs/RepositoryMap.md

Status: V2 IMPLEMENTED

Owns

This practical map.

It should answer:

where something currently lives;
what it currently does;
whether it is legacy or V2;
where it should eventually live;
what must not be confused with it.
9. Docs/RefactorLedger.md

Status: TARGET — NOT YET IMPLEMENTED

Intended owner

Architecture V2 migration progress.

It will record
current refactor phase;
completed migrations;
migrations in progress;
pending migrations;
legacy dependencies;
code confirmed safe to remove;
relevant verification;
important migration decisions.
10. Docs/ChatGPTWorkflow.md

Status: TARGET — NOT YET IMPLEMENTED

Intended owner

Reusable AI-assisted development procedures.

It will contain standard workflows for:

starting a new VecEd conversation;
feature development;
bug investigation;
refactor planning;
approved refactor execution;
dead-code auditing;
UI changes;
Course work;
conversation handoff.
11. Root AGENTS.md

Status: TARGET — NOT YET IMPLEMENTED

Intended owner

Mandatory repository working protocol.

It should be the first project-specific file read by a new AI coding session.

It will instruct development agents to read the appropriate documentation and
inspect actual source before making changes.

12. src/

Status: V2 CONSTRUCTION AREA

src is the destination for Architecture V2 application source.

At the beginning of the migration it may be empty or nearly empty.

An empty src folder is not itself tracked by Git.

Do not add meaningless placeholder files merely to make Git preserve an empty
directory.

The intended source architecture is:

src/
├── app/
├── Assessments/
├── Classes/
├── Courses/
└── UI/

Only create these physical subtrees when actual source is being migrated into
them.

13. Target src/app

Status: TARGET — NOT YET IMPLEMENTED

Intended responsibility

Next.js route/framework layer.

Owns
URL route folders;
page.tsx route entry points;
Next.js layouts;
framework-specific route glue.
Does not own

The majority of:

product UI;
assessment business logic;
class domain logic;
Course definitions;
global visual systems.
Important rule

Substantial routes delegate to descriptive page implementations.

Example target:

src/app/create-assessment/workspace/page.tsx
        ↓
src/Assessments/Creation/AssessmentCreatorPage.tsx

The exact public route remains subject to a separate routing decision.

14. Target src/Assessments

Status: TARGET — NOT YET IMPLEMENTED

Intended responsibility

Everything fundamentally owned by the Assessment domain.

Currently known implemented product areas which may ultimately contribute to
this domain include:

Assessment Creation;
saved assessments;
assessment compilation;
assessment paper structures.

Do not create speculative future Assessment subdomains until they are actually
being implemented.

15. Target src/Assessments/Creation

Status: TARGET — NOT YET IMPLEMENTED

The intended conceptual architecture is:

Assessments/
└── Creation/
    ├── AssessmentCreatorPage.tsx
    │
    ├── TopBar/
    │
    ├── SkillsPanel/
    │   ├── 01-SkillsFilters/
    │   └── 02-SkillsTree/
    │
    ├── PaperWorkspace/
    │
    ├── HUDBar/
    │
    ├── AssessmentSettings/
    │
    ├── Questions/
    ├── Papers/
    ├── Analysis/
    └── Persistence/

This is a target ownership map.

The detailed file tree must emerge from the forensic migration of the existing
Builder implementation.

16. Target AssessmentCreatorPage.tsx

Status: TARGET — NOT YET IMPLEMENTED

Owns

Composition of the complete Assessment Creation screen.

Likely direct conceptual children:

TopBar
SkillsPanel
PaperWorkspace
HUDBar
Does not own

Every state and helper currently present in the legacy Builder route.

Architecture V2 exists partly to prevent another giant route orchestrator.

17. Target TopBar

Status: TARGET — NOT YET IMPLEMENTED

Owns

Visible upper Assessment Creation controls.

Current known product responsibilities include:

Assessment Name;
selected Class / Class Coverage;
Assessment Date;
P1/P2 paper viewing;
Zoom;
Page Navigation.

Potential target structure:

TopBar/
├── TopBar.tsx
├── AssessmentNameField.tsx
├── ClassCoverageControl.tsx
├── AssessmentDate/
│   ├── AssessmentDateControl.tsx
│   ├── AssessmentDatePicker.tsx
│   └── AssessmentDateFormatting.ts
├── PaperViewPill.tsx
├── ZoomControl.tsx
└── PageNavigationControl.tsx

This exact breakdown remains subject to inspection of the legacy TopBar.

18. Target SkillsPanel

Status: TARGET — NOT YET IMPLEMENTED

Owns

The complete left-hand skills interface.

Target visual hierarchy:

SkillsPanel/
├── SkillsPanel.tsx
├── 01-SkillsFilters/
└── 02-SkillsTree/

The numerical order deliberately mirrors screen order.

19. Target 01-SkillsFilters

Status: TARGET — NOT YET IMPLEMENTED

Owns

The controls visually above the Skills Tree.

Known examples:

StandardFilter
TargetMarksFilter
ThinkingTypeFilter
AddQuestionsButton
Does not own

National 5 Maths curriculum definitions.

20. Target 02-SkillsTree

Status: TARGET — NOT YET IMPLEMENTED

Owns

Generic visual rendering and interaction of the Skills Tree.

Potential child responsibilities include:

SkillsTree.tsx
SkillCategory.tsx
SkillRow.tsx
ConceptRow.tsx
DifficultyControl.tsx
useSkillsTreeState.ts

Exact decomposition remains subject to migration analysis.

Does not own

The actual National 5 Maths educational tree.

That belongs to Courses/National5Maths/SkillsTree.

21. Target PaperWorkspace

Status: TARGET — NOT YET IMPLEMENTED

Owns

The central assessment paper working/viewing surface.

Likely responsibilities include:

page rendering within the workspace;
viewport behaviour;
page layout;
zoom-related workspace behaviour;
question measurements;
page measurements;
workspace controls;
workspace-specific settings;
workspace-associated status where visually appropriate.
Does not automatically own

Generic generated-document visual truth.

If preview and compiled output share the same rendering rule, that rule may
instead belong under UI/Documents.

22. Target HUDBar

Status: TARGET — NOT YET IMPLEMENTED

Owns

Controls and information which genuinely belong to the lower Assessment
Creation region.

The legacy BottomHud should not simply be renamed wholesale.

Its responsibilities require reassignment.

23. Target AssessmentSettings

Status: TARGET — NOT YET IMPLEMENTED

Owns

Settings which affect the assessment itself rather than the application or
workspace.

Potential examples:

cover page;
formula sheet;
candidate number box;
assessment sitting information;
assessment-specific document options.

The existing settings implementation must be decomposed before final file
locations are determined.

24. Target Questions

Status: TARGET — NOT YET IMPLEMENTED

Owns

Generic Assessment Creation question workflow.

Potential responsibilities:

selection;
generated question orchestration;
drafts;
editing;
insertion/removal;
workflow transitions.
Does not own

National 5 Maths-specific generator definitions.

Those remain Course-owned.

25. Target Papers

Status: TARGET — NOT YET IMPLEMENTED

Owns

Shared paper state and paper-domain behaviour used by several visible regions.

Potential responsibilities identified in legacy code include:

paper metadata;
paper targets;
paper timing;
paper sitting state;
print metadata;
current paper/view information.

The existing paper-related hooks should be inspected collectively.

26. Target Analysis

Status: TARGET — NOT YET IMPLEMENTED

Owns

Assessment composition/distribution analysis.

Existing known analysis responsibilities include:

topic balance;
standard balance;
calculator suitability;
operational/reasoning balance;
overall assessment distribution.

Legacy builder-logic analysis modules are likely migration candidates.

27. Target Persistence

Status: TARGET — NOT YET IMPLEMENTED

Owns

Assessment Creation session persistence.

Potential responsibilities:

persistence keys;
save behaviour;
restore behaviour;
serialisation;
compatibility;
legacy storage migration where required.
Important migration warning

Do not alter persisted key strings simply because files move.

28. Target src/Classes

Status: TARGET — NOT YET IMPLEMENTED

Owns

The Class domain.

Potential responsibilities include:

class types;
class records;
class persistence;
class normalisation;
class pages;
class editing;
class-specific business logic.
Consumers

Assessment Creation may consume Classes when selecting which classes an
assessment covers.

Does not belong in

Assessment Creation merely because class selection appears there.

29. Target src/Courses

Status: TARGET — NOT YET IMPLEMENTED

Owns

Course-specific educational and assessment knowledge.

Conceptual structure:

Courses/
├── CourseRegistry.ts
├── CourseDefinitionTypes.ts
└── National5Maths/
    ├── CourseDefinition.ts
    ├── SkillsTree/
    ├── QuestionGeneration/
    ├── AnswerGeneration/
    ├── SourceQuestionCatalog/
    └── SourceMarkingSchemeCatalog/

Future courses should be sibling implementations.

Example:

Courses/
├── National5Maths/
└── HigherMaths/
30. Target CourseRegistry

Status: TARGET — NOT YET IMPLEMENTED

Owns

The authoritative mechanism for resolving supported Courses.

It should make generic product code depend upon a Course definition rather than
hard-coded National 5 Maths imports.

31. Target CourseDefinitionTypes

Status: TARGET — NOT YET IMPLEMENTED

Owns

The generic contract through which Course implementations expose information to
general VecEd systems.

Avoid allowing this file to become a replacement generic type dumping ground.

32. Target National5Maths

Status: TARGET — NOT YET IMPLEMENTED

Owns

National 5 Maths-specific:

curriculum structure;
Skills Tree definition;
question-generation knowledge;
answer-generation knowledge;
source question evidence;
source marking-scheme evidence;
course-specific assessment metadata.
33. Target National 5 Maths Skills Tree

Status: TARGET — NOT YET IMPLEMENTED

Intended conceptual structure:

National5Maths/
└── SkillsTree/
    ├── SkillsTreeDefinition.ts
    ├── 01-Numerical/
    ├── 02-Algebraic/
    ├── 03-Geometric/
    ├── 04-Trigonometric/
    └── 05-Statistical/

The numbering is intentional.

34. Target National 5 Maths Question Generation

Status: TARGET — NOT YET IMPLEMENTED

Expected concept:

National5Maths/
└── QuestionGeneration/
    ├── 01-Numerical/
    ├── 02-Algebraic/
    ├── 03-Geometric/
    ├── 04-Trigonometric/
    └── 05-Statistical/

Existing well-organised generator groupings should be preserved conceptually
where they already provide strong navigability.

35. Target SourceQuestionCatalog

Status: TARGET OWNER AGREED — MIGRATION PENDING

Owns

Historical/official source question evidence.

Existing organisation is considered a strong part of the legacy repository
and should not be dismantled simply to make the refactor look different.

36. Target SourceMarkingSchemeCatalog

Status: TARGET OWNER AGREED — MIGRATION PENDING

Owns

Historical source marking-scheme evidence.

Again, current clear organisational concepts should be preserved where useful.

37. Target src/UI

Status: MIGRATION IN PROGRESS

Single V2 visual domain:

UI/
├── Application/
└── Documents/

This replaces the competing/scattered visual ownership present in legacy
source.

38. UI/Application

Status: MIGRATION IN PROGRESS

Owns

Teacher-facing VecEd application appearance.

The first Architecture V2 Application UI responsibilities are now physically
implemented beneath:

src/UI/Application/

Current V2 structure includes:

Application/
├── Colours/
│   └── AccentPalette.ts
├── Components/
│   └── Drawer/
│       ├── Drawer.tsx
│       └── DrawerHeader.tsx
├── SettingsDrawer/
│   ├── Appearance/
│   │   ├── AccentColourPicker/
│   │   │   ├── AccentColourOptions.ts
│   │   │   ├── AccentColourPicker.tsx
│   │   │   ├── ColourHoneycomb.tsx
│   │   │   ├── ColourSwatch.tsx
│   │   │   └── NeutralColourPalette.tsx
│   │   ├── AccentColourControl.tsx
│   │   ├── AppearanceSettings.tsx
│   │   └── ThemeModeControl.tsx
│   ├── SettingsDrawer.tsx
│   ├── SettingsDrawerProvider.tsx
│   └── SettingsSection.tsx
├── Theme/
│   ├── AppTheme.ts
│   ├── ThemeMode.ts
│   ├── ThemePreferenceStorage.ts
│   └── ThemeProvider.tsx
└── Typography/
    └── Typography.ts

These V2 files are authoritative for the responsibilities they now own.

Legacy compatibility adapters remain active where unmigrated application areas
still depend upon historical imports.

Application UI migration is therefore underway but not complete.

HeaderBar, remaining legacy UI systems, Builder-specific settings and other
application visual responsibilities must still be audited independently.

39. Target HeaderBar

Status: TARGET — NOT YET IMPLEMENTED

Target:

UI/Application/HeaderBar/
Owns
VecEd logo;
global navigation;
navigation state/presentation;
global Settings button.
Does not own

Assessment Creation TopBar.

Does not own

Assessment Creation-specific settings behaviour.

40. SettingsDrawer

Status: V2 IMPLEMENTED

Current owner:

UI/Application/SettingsDrawer/

Owns

Global application settings.

Current implemented responsibilities include:

appearance;
theme mode;
custom accent colour;
Settings Drawer open/close state;
global appearance composition;
accent-colour picker UI.

The previous legacy GlobalSettingsBar wrapper has been removed after verifying
that it had no remaining consumers.

app/layout.tsx now mounts the Architecture V2 SettingsDrawer directly.

The legacy:

app/settings-bar/GlobalSettingsContext.tsx

remains temporarily active as a compatibility adapter for unmigrated consumers
of the historical useSettings() API.

This adapter must not yet be deleted.

Does not own

assessment-specific document options;
PaperWorkspace display/reset controls;
Builder-specific settings.

41. Target UI/Documents

Status: TARGET — NOT YET IMPLEMENTED

Owns

The generated-assessment visual system.

Likely areas:

Documents/
├── Typography/
├── Layout/
├── Spacing/
└── Components/

Potential responsibilities currently spread through legacy code include:

exam typography;
page size;
reflow;
question spacing;
page frames;
cover/formula page rendering.
42. Legacy Root app/

Status: LEGACY — ACTIVE

Current role:

The existing Next.js application and a large amount of product implementation
currently live directly under root:

app/

Known high-level contents include:

app/
├── compile-assessment/
├── components/
├── create-assessment/
├── dev/
├── favicon.ico
├── globals.css
├── layout.tsx
├── my-assessments/
├── my-classes/
├── page.tsx
├── paper-layout/
├── question-bank/
├── settings-bar/
└── ui/

This folder is currently required.

Do not move it wholesale at the beginning of the refactor.

43. Legacy app/page.tsx

Status: LEGACY — ACTIVE

Current role

Root/home page implementation.

V2 direction

The route should eventually become a thin route wrapper.

The substantial implementation should move to a descriptively named page
component, likely:

HomePage.tsx

The exact owning location should be established when Home is migrated.

44. Legacy app/layout.tsx

Status: LEGACY — ACTIVE

Current role

Next.js application layout and application-level providers/chrome.

V2 direction

Remain part of the route/framework layer where appropriate.

However, visual components/providers currently imported by it should be
reviewed for correct owners under UI/Application.

45. Legacy app/create-assessment/

Status: LEGACY — ACTIVE

Current role

Contains current Assessment Creation routes and implementation.

This is one of the largest and most important migration areas.

The setup page and Builder/workspace responsibilities need to be separated from
routing.

46. Legacy Assessment Creation Builder Root

The audited Builder area currently includes responsibilities/files such as:

BuilderStyles.tsx
assessmentTiming.ts
builderStorageKeys.ts
builderUtils.ts
page.tsx

builder-behaviour/
builder-definitions/
builder-logic/
builder-preview-engine/
components/

Status: LEGACY — ACTIVE

This area must not be migrated as one monolithic folder.

Each responsibility requires ownership mapping.

47. Legacy Builder page.tsx

Status: LEGACY — ACTIVE / MAJOR REFACTOR TARGET

Current role

The current Builder route is a large composition root.

It directly coordinates or imports areas including:

Builder UI;
Classes;
saved assessments;
current paper state;
paper targets;
question workflow;
assessment analyses;
preview behaviour;
persistence;
Course configuration;
UI settings;
metadata;
sitting state.
V2 destination

Route layer:

src/app/.../page.tsx

Substantial page implementation:

src/Assessments/Creation/AssessmentCreatorPage.tsx

Underlying responsibilities distributed to their proper owners.

Warning

Do not simply rename the legacy file to AssessmentCreatorPage.tsx.

Its responsibilities require decomposition.

48. Legacy BuilderStyles.tsx

Status: AUDIT REQUIRED

Current issue

Name suggests Builder-wide visual styling.

V2 questions

For every style:

is it Application UI?
is it PaperWorkspace-specific?
is it Assessment Creation layout?
is it document UI?
is it obsolete?

Do not move the complete file blindly.

49. Legacy assessmentTiming.ts

Status: AUDIT REQUIRED

Likely owner may be:

Assessments/Creation/Papers/

or another assessment-specific timing owner.

Inspect exact consumers before migration.

50. Legacy builderStorageKeys.ts

Status: LEGACY — ACTIVE / PERSISTENCE MIGRATION CANDIDATE

Likely V2 owner:

Assessments/Creation/Persistence/
Important

Filename migration does not imply persisted key-string changes.

Compatibility must be preserved.

51. Legacy builderUtils.ts

Status: AUDIT REQUIRED / LIKELY SPLIT

Generic Utils terminology is not accepted as a final V2 ownership model.

Inspect every export independently.

Potential outcomes:

MOVE
RENAME
SPLIT
DELETE

Do not recreate:

src/Assessments/Creation/BuilderUtils.ts

or:

src/Utils/

without explicit justification.

52. Legacy builder-behaviour/

Status: LEGACY — ACTIVE / MAJOR OWNERSHIP REASSIGNMENT REQUIRED

Known audited hooks include:

UseBuilderFlashFeedback
UseBuilderInitialisation
UseBuilderLayouts
UseBuilderMetadataTiming
UseBuilderPaperMetadataMaps
UseBuilderPaperPrintMetadata
UseBuilderPaperSittingState
UseBuilderPaperTargetMaps
UseBuilderPersistence
UseBuilderProgressHudRows
UseBuilderProgressMetrics
UseBuilderTargetMarksState
UseBuilderUiChrome
UseDraftWorkflow
UsePaperViewMetadata
UsePreviewViewport
UseQuestionDraftGeneration
UseQuestionWorkflow
UseSkillsTreeState

The folder is not expected to survive as one flat V2 equivalent.

53. UseBuilderInitialisation

Status: AUDIT REQUIRED / LIKELY SPLIT

Current implementation is substantial and likely coordinates several startup
responsibilities.

Potential V2 ownership may span:

AssessmentCreatorPage coordination;
Persistence;
Papers;
Courses;
Classes.

Do not merely rename to:

useAssessmentCreatorInitialisation

without examining whether the hook itself is too broad.

54. Paper-related legacy Builder hooks

Known examples:

UseBuilderPaperMetadataMaps
UseBuilderPaperPrintMetadata
UseBuilderPaperSittingState
UseBuilderPaperTargetMaps
UseBuilderTargetMarksState
UsePaperViewMetadata

Status: AUDIT REQUIRED AS A GROUP

Likely destination ownership:

Assessments/Creation/Papers/

The migration should inspect whether multiple hooks can be simplified or
consolidated.

55. Legacy UseBuilderPersistence

Status: LEGACY — ACTIVE

Likely V2 owner:

Assessments/Creation/Persistence/

Must be considered together with:

builderStorageKeys.ts

and any persistence logic embedded elsewhere.

56. Legacy UsePreviewViewport

Status: AUDIT REQUIRED

Potential V2 owner:

Assessments/Creation/PaperWorkspace/

if it controls workspace viewport behaviour.

Do not assume it belongs to document rendering merely because it affects
preview.

57. Legacy UseSkillsTreeState

Status: LEGACY — ACTIVE

Potential V2 owner:

Assessments/Creation/SkillsPanel/02-SkillsTree/

if its state is truly UI/tree interaction state.

Any Course curriculum data inside it must be separated from generic tree state.

58. Legacy question workflow hooks

Known examples:

UseDraftWorkflow
UseQuestionDraftGeneration
UseQuestionWorkflow

Status: AUDIT REQUIRED AS A GROUP

Likely general owner:

Assessments/Creation/Questions/

Course-specific generator knowledge should remain under Courses.

59. Legacy progress/HUD hooks

Known examples:

UseBuilderProgressHudRows
UseBuilderProgressMetrics

Status: AUDIT REQUIRED

Possible split:

actual assessment/progress calculations → shared domain/Analysis;
visible HUD presentation → HUDBar.

Do not assign calculation ownership solely based on the word Hud.

60. Legacy UI/chrome hooks

Known examples:

UseBuilderLayouts
UseBuilderUiChrome
UseBuilderFlashFeedback

Status: AUDIT REQUIRED

Possible owners may include:

AssessmentCreatorPage;
PaperWorkspace;
UI/Application;
individual visible regions.

The names are too broad to define destination without source inspection.

61. Legacy builder-logic/

Status: LEGACY — ACTIVE / SPLIT BY RESPONSIBILITY

Known audited contents include:

AssessmentDistributionAnalysis.ts
BuildCalculatorSuitabilityNotes.ts
BuildOperationalReasoningNotes.ts
BuildStandardBalanceNotes.ts
BuildTopicBalanceNotes.ts
BuilderCourseConfig.ts
BuilderDateHelpers.ts
BuilderNotes.ts
BuilderPaperStateMaps.ts
BuilderPaperTargets.ts
BuilderPaperTiming.ts
BuilderQuestionGenerators.ts
BuilderQuestionSpacing.ts
BuilderUiHelpers.tsx

This folder is a major example of legacy mixed ownership.

It must not simply become:

src/Assessments/Creation/Logic/
62. Legacy assessment analysis modules

Known files:

AssessmentDistributionAnalysis.ts
BuildCalculatorSuitabilityNotes.ts
BuildOperationalReasoningNotes.ts
BuildStandardBalanceNotes.ts
BuildTopicBalanceNotes.ts

Likely V2 owner:

Assessments/Creation/Analysis/

Status: TARGET OWNER LIKELY — FORENSIC MAPPING REQUIRED

Naming should be reviewed to remove unnecessary Build...Notes implementation
language where clearer analytical names exist.

63. Legacy BuilderCourseConfig.ts

Status: AUDIT REQUIRED / COURSE COUPLING TARGET

Current role should be inspected carefully.

Likely responsibilities may need separation between:

Courses/

and:

Assessments/Creation/

General Assessment Creation must not retain hard-coded National 5 Maths Course
configuration as a Builder-owned concept.

64. Legacy date helpers

Known:

BuilderDateHelpers.ts

Status: AUDIT REQUIRED

Likely destination depends on exact responsibility.

Possible owners:

TopBar/AssessmentDate/
Papers/
AssessmentSettings/

Do not create a generic V2 date-helper bucket.

65. Legacy paper modules

Known:

BuilderPaperStateMaps.ts
BuilderPaperTargets.ts
BuilderPaperTiming.ts

Status: TARGET OWNER LIKELY

Expected V2 owner:

Assessments/Creation/Papers/

Detailed consolidation opportunities should be reviewed.

66. Legacy BuilderQuestionGenerators.ts

Status: AUDIT REQUIRED

Need to distinguish:

generic generation coordination;
National 5 Maths generator knowledge.

Possible split:

Assessments/Creation/Questions/

and:

Courses/National5Maths/QuestionGeneration/
67. Legacy BuilderQuestionSpacing.ts

Status: AUDIT REQUIRED

Potential owners depend on whether it defines:

document layout;
PaperWorkspace measurement behaviour;
generated-paper rendering.

Possible V2 owners:

UI/Documents/

or:

PaperWorkspace/

Do not decide from filename alone.

68. Legacy BuilderUiHelpers.tsx

Status: AUDIT REQUIRED / GENERIC HELPER TARGET

Architecture V2 should not preserve a generic UiHelpers file by default.

Inspect exports individually and migrate to the UI/feature owner.

69. Legacy builder-preview-engine/

Status: LEGACY — ACTIVE / MAJOR RECLASSIFICATION AREA

The term preview engine is not automatically a permanent V2 owner.

Its contents should be classified according to whether they actually perform:

PaperWorkspace rendering;
document rendering;
pagination;
layout;
measurement;
workspace behaviour.

Likely destinations may include:

PaperWorkspace/
UI/Documents/
Papers/
70. Legacy Builder components/

Status: LEGACY — ACTIVE / PHYSICAL REGION MIGRATION SOURCE

Known high-level contents include:

assessment-paper-layout/
assessment-preview/
assessment-progress/
builder-controls/
builder-layout/
shared/
skills-tree/

Architecture V2 should replace generic grouping with ownership-oriented
physical regions and shared domains.

71. Legacy assessment-paper-layout/

Status: AUDIT REQUIRED

Potential owners:

UI/Documents/
PaperWorkspace/

depending on whether files define true document layout or only workspace
presentation.

72. Legacy assessment-preview/

Status: AUDIT REQUIRED

Preview is not automatically an owner.

Classify each file as:

document visual;
PaperWorkspace interaction;
assessment state;
pagination/layout;
obsolete wrapper.
73. Legacy assessment-progress/

Status: AUDIT REQUIRED

Potential split:

analysis/progress calculations → Analysis;
visible panel/control → HUDBar or appropriate physical region.
74. Legacy builder-controls/

Status: AUDIT REQUIRED / LIKELY DISTRIBUTED

Controls should move according to the physical region which owns them.

Potential destinations:

TopBar/
SkillsPanel/
PaperWorkspace/
HUDBar/
AssessmentSettings/

Do not create:

Creation/Controls/

as a replacement generic bucket.

75. Legacy builder-layout/

Status: AUDIT REQUIRED

Likely contains composition/layout implementation for the Builder screen.

Possible owners:

AssessmentCreatorPage;
physical regions;
application layout tokens.

Do not preserve generic Builder layout naming automatically.

76. Legacy Builder shared/

Status: AUDIT REQUIRED / GENERIC BUCKET TO DISMANTLE

Architecture V2 does not accept shared as sufficient ownership.

Each file must be classified individually.

77. Legacy skills-tree/

Status: LEGACY — ACTIVE

Likely V2 UI destination:

Assessments/Creation/SkillsPanel/02-SkillsTree/

Any actual N5 curriculum definition must instead move under:

Courses/National5Maths/SkillsTree/

This boundary is especially important.

78. Legacy BuilderTopBar.tsx

Status: LEGACY — ACTIVE / SPLIT TARGET

Current file is substantial and combines several visible TopBar controls.

Expected V2 result is several coherent files under:

Assessments/Creation/TopBar/

Do not simply move/rename the complete file unchanged unless audit proves it
already has appropriate decomposition.

79. Legacy BuilderBottomHud.tsx

Status: LEGACY — ACTIVE / RESPONSIBILITY REASSIGNMENT TARGET

Current file combines multiple lower-screen responsibilities.

Potential outcomes:

HUDBar/
PaperWorkspace/WorkspaceControls/
Analysis/

depending on exact ownership.

80. Legacy SettingsPanel.tsx

Status: LEGACY — ACTIVE / HIGH-PRIORITY SPLIT TARGET

Current implementation is exceptionally large.

It currently combines concerns which Architecture V2 separates into:

Global application settings
→ UI/Application/SettingsDrawer

Assessment settings
→ Assessments/Creation/AssessmentSettings

Workspace settings
→ Assessments/Creation/PaperWorkspace

This file must not survive as one giant V2 component merely under a new path.

81. Legacy app/my-assessments/

Status: LEGACY — ACTIVE

Current role

Saved assessment interface and associated route functionality.

V2 direction

Route entry:

src/app/my-assessments/

Descriptive product implementation likely under:

src/Assessments/

Potential page name:

AssessmentsLibraryPage.tsx

Exact internal domain structure requires audit.

82. Legacy app/compile-assessment/

Status: LEGACY — ACTIVE

Current role

Assessment compilation workflow.

V2 direction

Compilation should be treated as Assessment-domain functionality rather than
being owned solely by its Next.js route.

Final Assessment ownership requires detailed audit.

Route/framework code should eventually remain thin.

83. Legacy app/my-classes/

Status: LEGACY — ACTIVE

Current role

Class management/pages.

V2 direction

Routes eventually become thin wrappers.

Substantial class implementation moves under:

src/Classes/

Potential descriptive pages include:

ClassesPage.tsx
ClassDetailsPage.tsx
84. Legacy app/question-bank/

Status: AUDIT REQUIRED

The exact long-term product ownership has not yet been locked at detailed
folder level.

Inspect whether this represents:

a Course-owned bank;
a broader question domain;
source catalog presentation;
developer functionality;
another product responsibility.

Do not invent a V2 destination before audit.

85. Legacy app/dev/

Status: LEGACY — ACTIVE / DEVELOPER TOOLING AUDIT

Known development functionality includes generator testing.

This is runtime/in-application developer functionality.

It is distinct from root Tools/.

A future V2 implementation may justify an explicitly named application
developer-tool owner if real functionality is being migrated.

Do not create empty developer-tool architecture before migration.

86. Legacy app/paper-layout/

Status: LEGACY — ACTIVE / LIKELY DOCUMENT UI MIGRATION SOURCE

Known audited responsibilities include files such as:

N5-Question-Spacing-px.ts
SQA-Typography.ts
page-sizes.ts
reflow-pages.ts

These responsibilities should be reviewed individually.

Potential V2 owner:

src/UI/Documents/

Naming should become awarding-body-neutral where appropriate.

87. Legacy question-spacing definitions

Current known concept:

N5-Question-Spacing-px.ts

Status: AUDIT REQUIRED

Questions:

Is this course-specific spacing?
Is this generic exam/document spacing?
Is it tied to current implementation technology?
Is it used by both preview and compile?

Destination should be selected based on those answers.

88. Legacy SQA-Typography.ts

Status: LEGACY — ACTIVE / RENAME + MOVE CANDIDATE

Likely V2 concept:

UI/Documents/Typography/

Potential neutral name:

ExamTypography.ts

Exact rename should happen only after consumer/persistence compatibility checks.

89. Legacy page-sizes.ts

Status: TARGET OWNER LIKELY

Likely V2 owner:

UI/Documents/Layout/

if it represents generated document dimensions.

90. Legacy reflow-pages.ts

Status: AUDIT REQUIRED

Possible ownership:

UI/Documents/Layout/

or:

PaperWorkspace/

depending on whether it defines actual document pagination or workspace-only
behaviour.

91. Legacy app/settings-bar/

Status: LEGACY — ACTIVE / SETTINGS ARCHITECTURE MIGRATION SOURCE

Current settings functionality must be inspected alongside:

legacy SettingsPanel;
application theme state;
global header controls;
any route-specific event handling.

Expected V2 ownership splits between:

UI/Application/SettingsDrawer/
Assessments/Creation/AssessmentSettings/
PaperWorkspace/
92. Legacy app/ui/

Status: LEGACY — ACTIVE / DUPLICATE UI AUTHORITY

Known audited areas include:

InteractionTokens.ts
appTheme.ts
uiTypography.ts

These overlap conceptually with the separate root ui/ system.

Architecture V2 must determine and consolidate authoritative visual sources.

93. Legacy root ui/

Status: LEGACY — ACTIVE / DUPLICATE UI AUTHORITY

Known audited files include:

AccentPalette.ts
AppTheme.ts
ThemeMode.ts
ThemeProvider.tsx
UiTypography.ts
buildAccent.ts

This is one side of the current duplicated visual architecture.

Target:

src/UI/Application/

after consolidation.

94. Legacy theme duplication

Status: CONFIRMED ARCHITECTURAL PROBLEM

Two existing areas currently contribute overlapping theme/typography concepts:

/ui

and:

/app/ui

In addition, global settings/state participates in theme persistence.

Architecture V2 must converge these rather than moving all sources wholesale.

95. Legacy ThemeProvider.tsx

Status: LEGACY — ACTIVE

Likely V2 owner:

UI/Application/Theme/

However, its functionality must be compared with the current global settings
context before selecting the authoritative provider.

96. Legacy GlobalSettingsContext

Status: LEGACY — ACTIVE / CONSOLIDATION TARGET

Current responsibilities overlap with:

theme mode;
custom colour;
settings persistence.

It must be inspected together with the theme provider.

Do not keep two independent authorities for the same global application state.

97. Legacy typography duplication

Status: AUDIT REQUIRED

Current repository contains similarly named visual sources in different
locations.

The historical names do not guarantee equivalent meaning.

Architecture V2 should establish:

UI/Application/Typography/

for teacher-facing interface typography,

and:

UI/Documents/Typography/

for assessment-document typography.

98. Legacy root course-data/

Status: LEGACY — ACTIVE / STRONG MIGRATION SOURCE

Current course-data contains useful and substantial Course-specific
organisation.

It should not simply be deleted or flattened.

However, it currently combines several conceptually separate areas.

Identified responsibilities include:

Course configuration;
Skills Tree/course curriculum;
question generation;
answer generation;
source question catalogue;
source marking-scheme catalogue.

Target:

src/Courses/National5Maths/

with those responsibilities separated clearly.

99. Legacy Course configuration

Status: LEGACY — ACTIVE

Potential V2 owner:

Courses/National5Maths/CourseDefinition.ts

and/or generic Course contract:

Courses/CourseDefinitionTypes.ts

The exact split must be based on current data and consumers.

100. Legacy Skills Tree curriculum data

Status: LEGACY — ACTIVE

Target:

Courses/National5Maths/SkillsTree/

Generic Assessment Creation should stop directly depending upon a hard-coded N5
tree.

101. Legacy Question Generation

Status: LEGACY — ACTIVE / VALUABLE ORGANISATIONAL AREA

Target:

Courses/National5Maths/QuestionGeneration/

Preserve meaningful curriculum grouping.

Do not flatten strong existing structure simply to rename everything.

102. Legacy Answer Generation

Status: LEGACY — ACTIVE

Target likely:

Courses/National5Maths/AnswerGeneration/

where the answer logic is course/question-family specific.

103. Legacy Source Question Catalog

Status: LEGACY — ACTIVE / POSITIVE PRECEDENT

Target:

Courses/National5Maths/SourceQuestionCatalog/

Current conceptual organisation is considered strong.

Migration should preserve useful discoverability.

104. Legacy Source Marking Scheme Catalog

Status: LEGACY — ACTIVE / POSITIVE PRECEDENT

Target:

Courses/National5Maths/SourceMarkingSchemeCatalog/

Again, do not reorganise merely for novelty.

105. Legacy root shared-types/

Status: LEGACY — ACTIVE / DISMANTLE BY OWNERSHIP

Known areas include types describing:

assessments;
generation;
selection;
paper parts;
worked answers;
related application contracts.

These are not automatically genuinely shared.

Target strategy:

assessment types → Assessments
course/generation types → Courses
class types → Classes
document-specific types → appropriate owner

Do not create:

src/SharedTypes/

as a mechanical replacement.

106. Legacy root math-helpers/

Status: LEGACY — ACTIVE / DISMANTLE BY OWNERSHIP

Known important file:

QuestionLogic.ts

The folder name does not accurately express the responsibility if the file
contains question selection/ranking domain behaviour.

Target owner must be determined from implementation.

Do not replace it with:

src/Helpers/

or:

src/MathHelpers/

without genuine justification.

107. Legacy QuestionLogic.ts

Status: AUDIT REQUIRED / OWNERSHIP MISMATCH CONFIRMED

Potential owners may include:

Assessments/Creation/Questions/

or:

Courses/

depending on whether the logic is generic selection workflow or
Course-specific educational logic.

Detailed consumer tracing is required.

108. Legacy root page-sections/

Status: LEGACY — ACTIVE / PHYSICAL OWNER MIGRATION SOURCE

This folder historically groups page-level UI areas.

It does not represent a strong permanent V2 domain.

Files must be distributed according to actual owners.

A major known example is the current global application header/navigation.

109. Legacy global application header

Status: LEGACY — ACTIVE

Historical implementation includes a top-level application bar/header concept.

Target:

src/UI/Application/HeaderBar/

Expected conceptual decomposition:

HeaderBar/
├── HeaderBar.tsx
├── Logo.tsx
├── Navigation.tsx
└── SettingsButton.tsx

Exact files must be established from current implementation.

110. HeaderBar settings coupling

Status: LEGACY BEHAVIOUR TO REMOVE DURING RELEVANT MIGRATION

Current architecture has page-aware settings coupling.

Target rule:

HeaderBar Settings button
→ global SettingsDrawer only

Assessment Creation-specific settings are opened by Assessment Creation-owned
controls.

111. Legacy root percentage_catalogue_hardening/

Status: AUDIT REQUIRED / REPOSITORY TOOLING

This appears to be one-off catalogue migration/maintenance tooling.

It is not normal teacher-facing application source.

Potential outcomes:

MOVE → Tools/

or:

DELETE

once purpose/completion/ongoing value is established.

Do not migrate it into src.

112. percentage_catalogue_hardening_bundle.zip

Status: AUDIT REQUIRED

This bundle is not application architecture.

Determine whether it remains necessary after the catalogue migration history is
understood.

Potential final action:

DELETE

if no longer needed.

113. Root files n5-assessment-tool@0.1.0, next, npm

Status: AUDIT REQUIRED / LIKELY ACCIDENTAL ARTEFACTS

These currently appear as zero-length root files rather than meaningful source
modules.

Do not delete them solely based on appearance.

Before removal:

inspect file contents/metadata;
confirm no scripts depend on them;
confirm they are not intentional markers.

If verified as accidental shell/npm artefacts:

SAFE TO REMOVE

should be recorded in RefactorLedger before deletion.

114. public/

Status: ACTIVE INFRASTRUCTURE — NOT LEGACY ARCHITECTURE

Static Next.js/browser assets.

This folder remains at repository root.

It does not need to move into src.

115. package.json

Status: ACTIVE INFRASTRUCTURE

Owns:

package metadata;
npm scripts;
application dependencies;
development dependencies.

It remains at repository root.

Architecture migration may require script/dependency changes, but not a
location change.

116. package-lock.json

Status: ACTIVE INFRASTRUCTURE

NPM dependency lockfile.

Remain at repository root.

Do not manually reorganise it as part of source architecture.

117. tsconfig.json

Status: ACTIVE INFRASTRUCTURE / FUTURE MIGRATION CHANGE EXPECTED

Current TypeScript alias historically resolves:

@/*
→ ./*

Target once src becomes authoritative:

@/*
→ ./src/*

or equivalent.

Do not change this prematurely while significant legacy imports still rely on
the existing root alias.

Alias migration should be a deliberate bounded stage.

118. next.config.ts

Status: ACTIVE INFRASTRUCTURE

Remains at repository root.

Only change where a genuine Next.js configuration requirement emerges.

119. eslint.config.mjs

Status: ACTIVE INFRASTRUCTURE

Remains at repository root.

Architecture V2 may eventually use linting rules to reinforce conventions, but
that is a separate deliberate task.

120. postcss.config.mjs

Status: ACTIVE INFRASTRUCTURE

Remain at root.

Not part of domain migration.

121. .gitignore

Status: ACTIVE INFRASTRUCTURE

Remain at root.

The Architecture V2 .code-workspace file has intentionally been saved outside
the Git repository, so repository .gitignore changes are not currently
required merely to support the clean-slate Explorer view.

122. Generated directories

Typical generated/local directories include:

.next/
node_modules/

These are not repository architecture.

They may be hidden from the VS Code Architecture V2 Explorer.

They should not be treated as migration candidates.

123. Architecture V2 VS Code Workspace

The user currently opens the repository through an external workspace file:

VecEd-Architecture-V2.code-workspace

located beside, not inside, the Git repository.

Conceptually:

n5-assessment-tool/
├── N5-Assessment-Tool/
└── VecEd-Architecture-V2.code-workspace

This is intentional.

124. Workspace hiding strategy

The Architecture V2 workspace hides legacy folders such as:

app
course-data
math-helpers
page-sections
shared-types
ui

and distracting generated/legacy artefacts.

This does not alter the repository.

When a legacy area needs inspection during migration, reveal it temporarily or
open/search the file directly.

125. Target Product Navigation Map

A future developer should eventually be able to reason as follows.

Global Header problem

Look in:

src/UI/Application/HeaderBar/
Global settings problem

Look in:

src/UI/Application/SettingsDrawer/
Application colour/theme problem

Look in:

src/UI/Application/

especially the relevant:

Theme
Colours
Typography

owner.

Assessment Creation overall page problem

Look in:

src/Assessments/Creation/AssessmentCreatorPage.tsx

and the relevant owned region/domain.

Assessment Name/Class/Date/Paper View/Zoom/Page Navigation problem

Look in:

src/Assessments/Creation/TopBar/
Skill filter problem

Look in:

src/Assessments/Creation/SkillsPanel/01-SkillsFilters/
Skills Tree interaction/rendering problem

Look in:

src/Assessments/Creation/SkillsPanel/02-SkillsTree/
National 5 Maths Skills Tree data problem

Look in:

src/Courses/National5Maths/SkillsTree/

Do not confuse this with the generic Skills Tree UI.

Paper viewing/workspace problem

Look in:

src/Assessments/Creation/PaperWorkspace/
Generated document typography/layout problem

Look in:

src/UI/Documents/
Lower Assessment Creation controls problem

Look in:

src/Assessments/Creation/HUDBar/
Assessment configuration/settings problem

Look in:

src/Assessments/Creation/AssessmentSettings/
Workspace settings problem

Look inside:

src/Assessments/Creation/PaperWorkspace/
Question workflow problem

Look in:

src/Assessments/Creation/Questions/
National 5 Maths generator problem

Look in:

src/Courses/National5Maths/QuestionGeneration/
Shared paper state/metadata/timing problem

Look in:

src/Assessments/Creation/Papers/
Assessment composition analysis problem

Look in:

src/Assessments/Creation/Analysis/
Assessment Creation save/restore problem

Look in:

src/Assessments/Creation/Persistence/
Class-domain problem

Look in:

src/Classes/
National 5 Maths source exam question problem

Look in:

src/Courses/National5Maths/SourceQuestionCatalog/
National 5 Maths source marking scheme problem

Look in:

src/Courses/National5Maths/SourceMarkingSchemeCatalog/
126. Target Dependency Map

The exact dependency graph will evolve, but the intended ownership direction is
approximately:

                          ┌────────────────────┐
                          │     Courses        │
                          │ CourseDefinition   │
                          │ SkillsTree data    │
                          │ Generation logic   │
                          └─────────┬──────────┘
                                    │
                                    ▼
┌────────────────────┐   ┌──────────────────────────────┐
│      Classes       │──▶│     Assessment Creation     │
│ authoritative      │   │                              │
│ class information  │   │ TopBar                       │
└────────────────────┘   │ SkillsPanel                  │
                         │ PaperWorkspace               │
                         │ HUDBar                       │
                         │ Questions                    │
                         │ Papers                       │
                         │ Analysis                     │
                         │ Persistence                  │
                         └─────────────┬────────────────┘
                                       │
                                       ▼
                         ┌──────────────────────────────┐
                         │            UI                │
                         │ Application + Documents      │
                         └──────────────────────────────┘

This diagram is conceptual, not a statement that all imports must literally
flow exactly downward.

The important rule is ownership clarity and avoidance of circular domain
dependencies.

127. Target Assessment Creation Visual-to-Code Map

Canonical product view:

┌──────────────────────── HeaderBar ─────────────────────────┐
│ Logo │ Home │ Create │ Assessments │ Classes │ Settings  │
└────────────────────────────────────────────────────────────┘

┌───────────────────────── TopBar ───────────────────────────┐
│ Name │ Class │ Date │ P1/P2 │ Zoom │ Page Navigation    │
├────────────────────┬───────────────────────────────────────┤
│  01-SkillsFilters  │                                       │
├────────────────────┤                                       │
│                    │                                       │
│   02-SkillsTree    │            PaperWorkspace             │
│                    │                                       │
│                    │                          Workspace     │
│                    │                          Controls      │
├────────────────────┴───────────────────────────────────────┤
│                         HUDBar                             │
└────────────────────────────────────────────────────────────┘

Code equivalent:

UI/Application/
└── HeaderBar/

Assessments/Creation/
├── TopBar/
├── SkillsPanel/
│   ├── 01-SkillsFilters/
│   └── 02-SkillsTree/
├── PaperWorkspace/
└── HUDBar/
128. Current Legacy-to-V2 Migration Summary

High-level migration map:

Current legacy area	Primary V2 direction	Status
app/	src/app + product domains	Legacy active
app/create-assessment/...	src/Assessments/Creation	Pending
Builder page.tsx	thin route + AssessmentCreatorPage	Pending
Builder TopBar	Creation/TopBar	Pending
Builder skills tree	Creation/SkillsPanel/02-SkillsTree	Pending
N5 Skills data	Courses/National5Maths/SkillsTree	Pending
Builder preview	PaperWorkspace and/or UI/Documents	Audit required
Builder BottomHud	HUDBar and other owners	Audit required
giant SettingsPanel	SettingsDrawer + AssessmentSettings + PaperWorkspace	Pending split
course-data/	Courses/National5Maths	Pending
shared-types/	owning domains	Audit required
math-helpers/	owning domains	Audit required
page-sections/	relevant UI/product domains	Pending
root ui/	UI/Application	Consolidation pending
app/ui/	UI/Application	Consolidation pending
app/paper-layout/	likely UI/Documents	Audit required
my-classes implementation	Classes	Pending
my-assessments implementation	Assessments	Pending
compile assessment implementation	Assessments	Pending
app/dev runtime tools	developer runtime owner	Audit required
catalogue hardening scripts	root Tools or delete	Audit required
129. Migration Priority Guidance

This document does not itself establish the final chronological migration plan.

That belongs in RefactorLedger.md.

However, some dependency relationships matter.

Do not migrate an area blindly if doing so depends on an unresolved source of
truth.

Examples:

theme consolidation should be understood before scattering new UI styling;
Course ownership should be understood before hard-coding new N5 references
into V2 SkillsTree;
document visual ownership should be understood before duplicating preview
rendering under PaperWorkspace;
persistence compatibility should be understood before replacing Builder
storage files.
130. Current Known High-Risk Migration Areas

The following areas deserve especially careful forensic analysis.

Builder route/orchestrator

Reason:

Large number of responsibilities and dependencies.

Risk:

Creating AssessmentCreatorPage.tsx which is merely the same oversized file
under a better name.

SettingsPanel

Reason:

Very large file mixing different settings ownership.

Risk:

Moving the file unchanged and preserving architectural coupling.

Theme / global settings

Reason:

Multiple current sources of truth.

Risk:

Migrating both and accidentally creating duplicate V2 authorities.

Builder preview/document rendering

Reason:

Historical naming obscures whether responsibilities are workspace-specific or
true document-rendering concerns.

Risk:

Duplicating rendering between PaperWorkspace and compiled documents.

Course data

Reason:

Contains valuable organisation but several conceptual subdomains.

Risk:

Over-refactoring good existing structure or moving generic Assessment logic
into Courses.

shared-types

Reason:

Types cross several domains.

Risk:

Recreating another generic shared dumping ground.

persistence

Reason:

Current localStorage behaviour may contain user data compatibility assumptions.

Risk:

Breaking existing assessments/classes/settings through innocent-looking key
renames.

131. Current Known Strong Legacy Areas Worth Preserving Conceptually

Architecture V2 is not based on the assumption that everything old is bad.

The following legacy concepts have been identified as useful.

SourceQuestionCatalog

Clear ownership and discoverability.

Preserve conceptually beneath the Course.

SourceMarkingSchemeCatalog

Clear ownership and discoverability.

Preserve conceptually beneath the Course.

Curriculum-family grouping

Grouping generator/skill material by meaningful mathematical categories is
considered useful.

Retain semantic ordering such as:

01-Numerical
02-Algebraic
03-Geometric
04-Trigonometric
05-Statistical

where it matches actual course structure.

132. Terms Which Should Disappear Progressively From V2 Source

Legacy names may remain until their owning area is migrated.

Do not use them as new V2 naming defaults.

Examples:

Builder
BuilderLogic
BuilderUtils
BuilderBehaviour
BuilderPreviewEngine
BottomHud
math-helpers
shared-types

Their functions do not necessarily disappear.

Their responsibilities are renamed/reorganised according to ownership.

133. Terms Which Are Canonical in V2

Current canonical product/architecture vocabulary includes:

HeaderBar
TopBar
HUDBar
SkillsPanel
SkillsFilters
SkillsTree
PaperWorkspace
SettingsDrawer
SettingsPopover
Control
Filter
Field
Pill
Picker
Status
Indicator
Modal
AssessmentCreatorPage
CourseRegistry
CourseDefinition
SourceQuestionCatalog
SourceMarkingSchemeCatalog

Use these consistently.

134. RepositoryMap Update Protocol

Whenever a significant source migration completes:

locate the affected section in this document;
change its status;
update the current path;
update the V2 path;
remove descriptions which are no longer true;
retain useful legacy-path history where it aids navigation;
update the high-level migration table;
ensure RefactorLedger.md records the chronological migration event.
135. When a Legacy Folder Becomes Empty

If all meaningful responsibilities have been migrated from a legacy folder:

verify no files remain required;
verify imports;
run type/build checks;
test relevant behaviour;
delete the empty/obsolete legacy structure;
update this document;
update RefactorLedger;
commit the deletion as part of a bounded migration.

Do not keep empty historical folders for nostalgia.

136. When a Target Folder Changes

If forensic analysis demonstrates that a proposed V2 owner is genuinely wrong:

Do not silently change RepositoryMap and proceed.

Check whether the change conflicts with:

LockedDecisions.md
Architecture.md

If it changes a locked architectural decision, use the architectural change
procedure first.

If it merely refines a non-locked detailed subfolder, update RepositoryMap and
record the change in RefactorLedger.

137. RepositoryMap Is Not a Substitute for Source Inspection

This map should substantially reduce repository archaeology.

It does not mean developers can modify files without reading them.

Before editing a target area:

inspect the current implementation;
inspect related files;
trace relevant imports;
trace consumers;
check the Refactor Ledger.

The map tells you where to start.

It does not replace technical understanding.

138. RepositoryMap Is Not a Second Architecture Constitution

Do not use this document to invent architecture casually.

Long-lived architectural rules belong in:

Architecture.md
LockedDecisions.md

This file records practical location and migration state.

139. Current Architecture V2 Starting State

At the establishment of this document:

Architecture V2 documentation
→ being created

src
→ clean construction area

legacy application
→ still fully responsible for current runtime

source migrations
→ not yet begun

major feature development
→ paused

forensic migration mapping
→ next major phase after documentation

refactor branch
→ refactor/architecture-V2

No application source should be described as successfully migrated until that
migration has actually occurred and been verified.

140. Current Immediate Documentation Sequence

The documentation setup sequence is:

1. Architecture.md
2. LockedDecisions.md
3. RepositoryMap.md
4. RefactorLedger.md
5. ChatGPTWorkflow.md
6. AGENTS.md

After these documents are complete and reviewed:

Full forensic migration mapping
        ↓
Migration plan approval
        ↓
First bounded source migration
141. Forensic Migration Table Template

Before any major area is migrated, use a detailed table based on:

Current Path	Purpose	Imports / Dependencies	Consumers	Proposed Owner	Proposed V2 Path	Action	Risk / Notes
legacy/path/File.ts	What it actually does	Important dependencies	Who uses it	True owner	src/...	MOVE / SPLIT / etc.	Compatibility concerns

Allowed standard actions:

KEEP
MOVE
RENAME
SPLIT
MERGE
DELETE
MOVE OUT OF DOMAIN
142. Assessment Creation Forensic Mapping Order

When the Assessment Creation migration begins, the current Builder should be
mapped by responsibility rather than by arbitrary directory order.

Recommended categories to identify include:

Page composition
TopBar
SkillsFilters
SkillsTree
PaperWorkspace
HUDBar
AssessmentSettings
Questions
Papers
Analysis
Persistence
Course dependencies
Classes dependencies
Application UI dependencies
Document UI dependencies

Every legacy Builder file should eventually have an assigned owner or a
verified deletion decision.

143. Course Forensic Mapping Order

When course-data is migrated, classify content into:

Generic Course contract
National5Maths CourseDefinition
SkillsTree
QuestionGeneration
AnswerGeneration
SourceQuestionCatalog
SourceMarkingSchemeCatalog
Other genuine Course-owned responsibility
Dead/obsolete content

Do not classify by filename alone.

144. UI Forensic Mapping Order

When global UI is migrated, inspect together:

root ui/
app/ui/
global settings context
settings-bar
global HeaderBar
legacy SettingsPanel appearance settings
globals.css
other global styling

The objective is to identify the authoritative V2 source for:

Theme
Colours
Typography
Spacing
Motion
Shadows
Application components

without importing duplicate authorities.

145. Document UI Forensic Mapping Order

Review together:

app/paper-layout/
Builder preview rendering
assessment-paper-layout/
compiled assessment rendering
document-specific typography
question spacing
page reflow
cover/formula page components

The objective is to determine which behaviour belongs to:

UI/Documents

versus:

PaperWorkspace

versus:

Courses
146. Settings Forensic Mapping Order

Every setting in the existing giant settings implementation should be assigned
to exactly one category:

GLOBAL APPLICATION
ASSESSMENT
WORKSPACE
OBSOLETE / REMOVE

Then map it to:

UI/Application/SettingsDrawer
Assessments/Creation/AssessmentSettings
Assessments/Creation/PaperWorkspace
DELETE

Do not migrate settings as an undifferentiated block.

147. Type Forensic Mapping Order

For every file currently under shared-types, ask:

What real-world concept does this type describe?
Which domain owns that concept?
Who creates values of this type?
Who consumes them?
Is this a true cross-domain contract?

Then place it with the actual owner.

148. Helper Forensic Mapping Order

For every file currently under helper/utility-style locations, ask:

What exact behaviour does this implement?
Is the behaviour generic or domain-specific?
Who owns the rule?
Is it used anywhere?
Can it be simplified?

Do not use:

"many things import it"

as evidence that a generic helper folder is the correct owner.

149. V2 Completion View

When Architecture V2 is substantially complete, the root should look
conceptually similar to:

N5-Assessment-Tool/
│
├── src/
│   ├── app/
│   ├── Assessments/
│   ├── Classes/
│   ├── Courses/
│   └── UI/
│
├── Docs/
│   ├── Architecture.md
│   ├── LockedDecisions.md
│   ├── RepositoryMap.md
│   ├── RefactorLedger.md
│   └── ChatGPTWorkflow.md
│
├── Tools/                 # only if useful tools remain
├── public/
├── AGENTS.md
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── .gitignore

Historical root source folders should no longer remain as permanent runtime
architecture.

150. Final Navigation Principle

This repository map should make the answer to:

Where do I look?

predictable.

The intended final model is:

ROUTES
→ src/app

ASSESSMENT PRODUCT LOGIC
→ src/Assessments

CLASS PRODUCT LOGIC
→ src/Classes

COURSE / CURRICULUM KNOWLEDGE
→ src/Courses

APPLICATION VISUAL SYSTEM
→ src/UI/Application

GENERATED DOCUMENT VISUAL SYSTEM
→ src/UI/Documents

ARCHITECTURAL INTENT
→ Docs/Architecture.md

LOCKED RULES
→ Docs/LockedDecisions.md

WHERE CODE CURRENTLY LIVES
→ Docs/RepositoryMap.md

HOW FAR THE REFACTOR HAS PROGRESSED
→ Docs/RefactorLedger.md

HOW A NEW CHAT SHOULD WORK
→ Docs/ChatGPTWorkflow.md + AGENTS.md

If a future developer cannot determine where a responsibility belongs using
this model, that ambiguity should be investigated rather than solved by
creating another generic folder.

The goal of Architecture V2 is not simply an orderly folder tree.

The goal is a repository where ownership is obvious enough that the structure
itself becomes documentation.