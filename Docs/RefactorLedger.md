# VecEd Architecture V2 Refactor Ledger

**Document type:** Live architectural migration ledger  
**Architecture version:** Architecture V2  
**Status:** Active  
**Primary purpose:** Record the current state, progress, verification, dependencies, risks and history of the Architecture V2 repository refactor  
**Update frequency:** After every meaningful migration stage  
**Authoritative for:** Refactor progress and current migration status  
**Not authoritative for:** Architectural rules or locked decisions

---

# 1. Purpose of This Document

This document records the live progress of the VecEd Architecture V2 refactor.

It exists so that a new developer or AI-assisted development conversation can
answer, without reconstructing the entire project history:

- Why is the refactor happening?
- Which branch should be used?
- What preservation measures are in place?
- Which Architecture V2 documents already exist?
- Has any application source actually been migrated yet?
- Which legacy areas are still active?
- Which areas have already been audited?
- Which areas are currently being worked on?
- Which migrations have completed successfully?
- What verification was performed after each migration?
- Which legacy files are still required?
- Which files have been confirmed as dead?
- Which files are safe to delete?
- Which migration should happen next?
- Are there any known blockers?
- Are there unresolved architectural questions?
- What was the last known-good point in the refactor?

This file should be treated as the project’s **refactor timeline and current
status board**.

It complements:

```text
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/RepositoryMap.md
Docs/ChatGPTWorkflow.md
AGENTS.md
```

---

# 2. Relationship to Other Documentation

This file has a deliberately different responsibility from the other
Architecture V2 documentation.

---

## 2.1 `Architecture.md`

Defines:

> How VecEd should be architected.

It contains long-lived principles and target ownership.

It should not be used as a chronological migration diary.

---

## 2.2 `LockedDecisions.md`

Defines:

> Which architectural decisions have already been settled.

It prevents future development conversations from casually changing approved
Architecture V2 conventions.

It should not be used to record day-to-day migration progress.

---

## 2.3 `RepositoryMap.md`

Defines:

> Where VecEd responsibilities physically live right now and where they are
> intended to live.

It is the practical navigation map.

---

## 2.4 `RefactorLedger.md`

Defines:

> What has happened during the refactor, what is currently happening, and what
> remains to be done.

That is this document.

---

## 2.5 `ChatGPTWorkflow.md`

Defines:

> How future AI-assisted development conversations should begin and operate.

---

## 2.6 `AGENTS.md`

Defines:

> Mandatory working instructions before changing the repository.

---

# 3. Documentation Precedence

For project-specific decisions, use the following precedence:

1. explicit instruction from the user in the current conversation;
2. `AGENTS.md`;
3. `Docs/LockedDecisions.md`;
4. `Docs/Architecture.md`;
5. `Docs/RepositoryMap.md`;
6. `Docs/RefactorLedger.md`;
7. legacy source implementation.

This ledger records progress.

It does not override locked architecture.

---

# 4. Refactor Mission

VecEd reached a substantial level of functionality before a complete
repository architecture had been deliberately designed.

The project was developed across many separate AI-assisted conversations.

This resulted in working functionality but increasing structural issues,
including:

- large route implementations;
- heavy use of the term `Builder`;
- generic helper/type folders;
- overlapping UI systems;
- duplicated theme responsibilities;
- mixed settings ownership;
- course-specific data coupled to generic Assessment Creation;
- large UI components;
- fragmented behavioural hooks;
- unclear file ownership;
- temporary tooling mixed with application source;
- persistence distributed across multiple areas;
- product concepts represented by implementation-oriented filenames.

Architecture V2 exists to resolve those problems **before major new feature
development resumes**.

The refactor is not intended merely to make folders visually attractive.

The desired outcome is a repository in which ownership is obvious.

---

# 5. Acceptance Criterion Zero

The most important rule of the entire refactor is:

> Preserve the working product.

Architecture V2 is allowed to:

- move code;
- rename code;
- split code;
- merge code;
- simplify code;
- remove genuinely dead code;
- consolidate duplicated state;
- consolidate duplicated visual systems;
- reorganise dependencies.

Architecture V2 must not unintentionally destroy behaviour which currently
works.

A successful folder structure with missing functionality is not a successful
refactor.

---

# 6. Current Git Safety Model

The repository uses multiple preservation layers.

---

## 6.1 Working repository

Repository:

```text
andrewstewart642/N5-Assessment-Tool
```

This remains the one authoritative Git repository.

Architecture V2 is not being built in a second duplicate repository.

---

## 6.2 Known-good branch

```text
main
```

Role:

Known-good working VecEd.

Architecture V2 work should not be carried out directly here.

---

## 6.3 Active refactor branch

```text
refactor/architecture-V2
```

Role:

All current Architecture V2 work.

At the beginning of the documentation phase, this is the branch which should
be checked out before any refactor source changes.

---

## 6.4 Frozen baseline branch

```text
archive/25-08-2026-baseline
```

Role:

Frozen pre-refactor reference.

This branch must not be used for normal development.

It exists to preserve the state before the Architecture V2 migration.

---

## 6.5 Offline physical backup

A complete copy of the project was manually created in Windows before the
refactor.

Role:

Independent emergency backup outside Git branch history.

Normal development must not modify this backup.

---

# 7. Clean-Slate Development Protocol

A second complete `N5-Assessment-Tool-V2` project was considered and rejected.

Instead, Architecture V2 uses:

```text
existing Git repository
+
refactor/architecture-V2 branch
+
src/ as the new source boundary
+
an Architecture V2 VS Code workspace
```

This provides a clean-slate development environment without creating competing
copies of the application.

---

# 8. Architecture V2 VS Code Workspace

The repository is opened through an external VS Code workspace file:

```text
VecEd-Architecture-V2.code-workspace
```

This file is stored **outside the Git repository**, beside the project folder.

Conceptually:

```text
n5-assessment-tool/
│
├── N5-Assessment-Tool/
│
└── VecEd-Architecture-V2.code-workspace
```

This is intentional.

The workspace is a development-view configuration, not part of application
source.

---

# 9. Legacy Source Hiding

The Architecture V2 VS Code workspace hides legacy source areas by default.

Examples include:

```text
app/
course-data/
math-helpers/
page-sections/
shared-types/
ui/
```

It may also hide:

```text
.next/
node_modules/
percentage_catalogue_hardening/
percentage_catalogue_hardening_bundle.zip
n5-assessment-tool@0.1.0
next
npm
```

This hiding:

- does not delete anything;
- does not move anything;
- does not affect Git;
- does not affect Next.js;
- does not change imports;
- does not alter runtime behaviour.

Legacy folders can be temporarily revealed whenever migration work requires
them.

---

# 10. Current Refactor Phase

**Current phase:**

```text
PHASE 1 — FULL REPOSITORY FORENSIC MAPPING

Phase 0 — Preservation and Architectural Documentation — is complete.

Repository forensic mapping has begun, with the Global Application UI and
settings/theme architecture being the first major area inspected.

The first bounded application-source migration has also been completed:

MIG-001 — Application UI Foundations

This migration established the first authoritative Architecture V2 application
source beneath src/ while retaining temporary compatibility adapters for
legacy imports.

Broad source migration remains deliberately paused.

Each further area must still be audited, mapped and approved before substantial
movement or deletion.

MIG-002 — Application Theme and Settings Architecture

Status: COMPLETE / VERIFIED

This migration established the Architecture V2 owners for global theme state,
global Settings Drawer state, reusable Drawer primitives, appearance controls
and the custom accent-colour picker.

Major completed changes include:

- Theme preference storage moved into UI/Application/Theme.
- Global theme state moved into the V2 ThemeProvider.
- Settings Drawer open/close state separated into SettingsDrawerProvider.
- Generic legacy Tray terminology replaced with Drawer terminology.
- Global appearance settings decomposed into focused V2 components.
- The accent-colour picker was decomposed into independently owned palette,
  honeycomb, swatch and neutral-colour components.
- The V2 SettingsDrawer is now mounted directly by app/layout.tsx.
- The legacy GlobalSettingsBar.tsx was verified as unreferenced and deleted.
- GlobalSettingsContext.tsx remains intentionally as a temporary compatibility
  adapter for unmigrated legacy consumers.

Verification completed:

- npx tsc --noEmit — PASS
- npm run build — PASS
- Home page — PASS
- Global Settings Drawer open/close — PASS
- System / Light / Soft Grey / Dark / Custom theme modes — PASS
- Custom accent-colour picker — PASS
- Assessment setup route — PASS
- Assessment Builder route — PASS
- Existing Builder Settings behaviour — PASS

No intentional product behaviour changed during MIG-002.

11. Current Overall Status
Preservation setup             COMPLETE
Refactor branch                COMPLETE
Frozen baseline                COMPLETE
Offline backup                 COMPLETE
Architecture V2 workspace      COMPLETE
Legacy-source hiding           COMPLETE
src construction area          ACTIVE
Architecture.md                COMPLETE
LockedDecisions.md             COMPLETE
RepositoryMap.md               COMPLETE / ACTIVE
RefactorLedger.md              COMPLETE / ACTIVE
ChatGPTWorkflow.md             COMPLETE
AGENTS.md                      COMPLETE
Repository forensic mapping    IN PROGRESS
MIG-001 UI foundations         COMPLETE / VERIFIED
MIG-002 Theme and Settings     COMPLETE / VERIFIED
Application source migration   STARTED — BOUNDED
Major new feature development  PAUSED

The documentation files marked ACTIVE remain living documents and must be
updated as the physical repository changes.

12. Critical Current Fact

Architecture V2 now contains its first verified application-source
implementation.

The following Architecture V2 Application UI areas are now authoritative:

src/UI/Application/
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

Temporary legacy compatibility adapters still remain where unmigrated
application code depends on historical APIs or import paths.

In particular:

app/settings-bar/GlobalSettingsContext.tsx

remains intentionally active as a compatibility adapter for legacy
useSettings() consumers.

The legacy GlobalSettingsBar.tsx has been removed after verification that it
had no remaining consumers.

The wider application still depends heavily upon the legacy source tree.

Therefore:

Architecture V2 source migration has begun, but the repository remains in a
transitional mixed V2/legacy state.

No legacy source area should be deleted merely because its first V2
replacement has been introduced.

# 13. Architecture V2 Documentation Bootstrap

The agreed documentation set is:

```text
Docs/
├── Architecture.md
├── LockedDecisions.md
├── RepositoryMap.md
├── RefactorLedger.md
└── ChatGPTWorkflow.md

AGENTS.md
```

---

# 14. Documentation Bootstrap Progress

## `Architecture.md`

**Status:** COMPLETE

Contains the long-form Architecture V2 constitution.

Major topics include:

- architectural purpose;
- product terminology;
- ownership;
- `src` boundary;
- naming;
- Next.js route rules;
- Assessment Creation;
- UI;
- Courses;
- Classes;
- persistence;
- migration process;
- clean-slate protocol;
- rejected approaches;
- documentation responsibilities.

---

## `LockedDecisions.md`

**Status:** COMPLETE

Contains the formal decision register.

Current decision IDs extend through:

```text
LD-240
```

Future approved decisions continue numbering.

Do not renumber existing entries.

---

## `RepositoryMap.md`

**Status:** COMPLETE

Contains:

- current legacy locations;
- target V2 ownership;
- known migration candidates;
- legacy-to-V2 mapping;
- repository navigation guidance;
- known high-risk areas.

---

## `RefactorLedger.md`

**Status:** IN CREATION

This file.

Once pasted, saved and reviewed:

```text
Status → COMPLETE / ACTIVE
```

It remains permanently active throughout the refactor.

---

## `ChatGPTWorkflow.md`

**Status:** PENDING

Next documentation file after this ledger.

---

## `AGENTS.md`

**Status:** PENDING

To be created after the full documentation set is established.

---

# 15. Architecture V2 Target Root

The intended repository root is conceptually:

```text
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
├── Tools/
├── public/
│
├── AGENTS.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── .gitignore
```

`Tools/` should exist only if useful repository tools remain.

No speculative empty feature folders should be created.

---

# 16. Current Legacy Source Areas

The following historical source areas remain active:

```text
app/
course-data/
math-helpers/
page-sections/
shared-types/
ui/
```

These remain required until their individual responsibilities are migrated.

They are not approved permanent Architecture V2 destinations.

---

# 17. Current Major Legacy Application Areas

The current root `app/` contains major areas including:

```text
compile-assessment/
components/
create-assessment/
dev/
my-assessments/
my-classes/
paper-layout/
question-bank/
settings-bar/
ui/
```

along with Next.js framework files such as:

```text
layout.tsx
page.tsx
globals.css
favicon.ico
```

These should not all be moved simultaneously.

---

# 18. Migration Strategy

Every migration follows:

```text
AUDIT
  ↓
MAP
  ↓
APPROVE
  ↓
MIGRATE
  ↓
VERIFY
  ↓
DOCUMENT
  ↓
COMMIT
```

No major stage should skip directly from:

```text
"this folder looks messy"
```

to:

```text
"move it"
```

---

# 19. Mandatory Migration Mapping

Before moving a substantial area, produce:

| Field | Meaning |
| --- | --- |
| Current Path | Exact legacy path |
| Purpose | What the file actually does |
| Imports | Important dependencies |
| Exports | What it exposes |
| Consumers | What depends on it |
| Current Problems | Naming, duplication, ownership, complexity |
| Proposed Owner | Correct V2 domain |
| Proposed V2 Path | Exact intended destination |
| Action | KEEP / MOVE / RENAME / SPLIT / MERGE / DELETE |
| Compatibility Risk | Persistence, routing, rendering, etc. |
| Verification | How success will be tested |

This forensic map must be approved before broad structural movement.

---

# 20. Standard Migration Actions

Use the following action labels consistently:

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

## `KEEP`

The current responsibility and file boundary are already appropriate.

A path change may still occur if the owner moves.

---

## `MOVE`

Responsibility is correct but physical owner/location is wrong.

---

## `RENAME`

Responsibility is useful but current name no longer describes it accurately.

---

## `SPLIT`

One current file contains several independently owned responsibilities.

---

## `MERGE`

Several current files represent one coherent responsibility and their
separation no longer improves maintenance.

---

## `DELETE`

The code is genuinely dead, obsolete or redundant.

Must be verified first.

---

## `MOVE OUT OF DOMAIN`

A file currently lives in one feature but is actually owned by another major
domain.

Example:

```text
Assessment Creation course config
→ Courses
```

---

## `TEMPORARY ADAPTER`

A transitional compatibility layer required during incremental migration.

Adapters should have an intended deletion point.

---

## `DEFER`

No safe destination decision can yet be made.

This should include an explanation of what information is missing.

---

# 21. Refactor Phases

The Architecture V2 project is currently expected to proceed through phases.

The precise order may change if dependency analysis shows a safer sequence.

---

# PHASE 0 — Preservation and Architectural Documentation

**Status:** IN PROGRESS

Purpose:

- protect working state;
- establish Git safety;
- create clean VS Code V2 environment;
- establish persistent architecture documentation;
- prevent future conversation drift.

Completed:

- offline project backup;
- `main` preserved;
- frozen archive branch established;
- `refactor/architecture-V2` created;
- Architecture V2 workspace created;
- legacy source hidden visually;
- `src` construction area created;
- Architecture constitution written;
- Locked Decisions register written;
- Repository Map written.

Remaining:

- complete this Refactor Ledger;
- create ChatGPT Workflow;
- create root AGENTS.md;
- review documentation for contradictions;
- commit documentation bootstrap.

---

# PHASE 1 — Full Repository Forensic Mapping

**Status:** NOT STARTED

Purpose:

Create a complete responsibility-level migration plan before application code
moves.

Expected work includes:

- inspect root source areas;
- trace imports;
- trace consumers;
- identify duplicated systems;
- identify dead code;
- classify types;
- classify helpers;
- classify UI;
- classify document rendering;
- classify Course data;
- classify persistence.

Output:

Detailed migration tables.

No broad source movement until mapping is approved.

---

# PHASE 2 — Establish Core V2 Foundations

**Status:** NOT STARTED

Possible responsibilities may include:

- source alias strategy;
- authoritative UI architecture;
- global theme ownership;
- Course contract;
- foundational domain boundaries.

Exact order must come from Phase 1 dependency analysis.

Do not assume this phase means moving `app/` first.

---

# PHASE 3 — Global Application UI Migration

**Status:** NOT STARTED

Likely areas:

- HeaderBar;
- SettingsDrawer;
- application theme;
- application typography;
- colours;
- interaction tokens;
- global settings state.

High priority:

Consolidate duplicate global visual authorities.

---

# PHASE 4 — Course Architecture Migration

**Status:** NOT STARTED

Likely areas:

- CourseRegistry;
- CourseDefinition contract;
- National5Maths CourseDefinition;
- Skills Tree data;
- QuestionGeneration;
- AnswerGeneration;
- SourceQuestionCatalog;
- SourceMarkingSchemeCatalog.

Important:

Preserve strong existing catalogue and curriculum organisation where useful.

---

# PHASE 5 — Assessment Creation Migration

**Status:** NOT STARTED

Largest migration phase.

Expected ownership areas:

```text
AssessmentCreatorPage
TopBar
SkillsPanel
PaperWorkspace
HUDBar
AssessmentSettings
Questions
Papers
Analysis
Persistence
```

Legacy Builder terminology should progressively disappear.

---

# PHASE 6 — Classes Migration

**Status:** NOT STARTED

Expected:

- class domain;
- class page implementations;
- class persistence;
- class types;
- Assessment Creation class consumers.

---

# PHASE 7 — Assessment Library / Compilation Migration

**Status:** NOT STARTED

Expected:

- saved assessments;
- Assessment Library page;
- assessment compilation;
- shared Assessment domain types;
- compile route separation.

Exact structure requires audit.

---

# PHASE 8 — Next.js Route Migration to `src/app`

**Status:** NOT STARTED

This is intentionally not the first migration.

Expected:

- thin `page.tsx` wrappers;
- descriptive page implementations already available;
- move root `app` routing into `src/app`;
- adjust framework imports;
- verify all URLs.

Any public route rename must be separately approved.

---

# PHASE 9 — Alias and Legacy Root Removal

**Status:** NOT STARTED

Likely tasks:

- change TypeScript alias to authoritative `src`;
- eliminate remaining root source imports;
- remove emptied legacy source folders;
- remove compatibility adapters;
- verify no duplicate sources remain.

---

# PHASE 10 — Final Architecture Verification

**Status:** NOT STARTED

Success criteria include:

- source lives under `src`;
- legacy root source is gone;
- page routes are thin;
- theme sources are consolidated;
- Settings ownership is clear;
- Courses drive course-specific behaviour;
- Assessment Creation is course-independent;
- generic helper/type dumps are gone;
- documentation matches reality;
- build succeeds;
- key product workflows succeed.

---

# 22. Phase Order Is Not Itself Fully Locked

The phase list above represents the current planning model.

Detailed dependency analysis may show that some migrations should be reordered.

Any reordering must preserve locked architectural principles.

Do not interpret this section as permission to change target architecture.

---

# 23. Current Known Legacy Assessment Creation Structure

The current Builder root includes known areas such as:

```text
BuilderStyles.tsx
assessmentTiming.ts
builder-behaviour/
builder-definitions/
builder-logic/
builder-preview-engine/
builderStorageKeys.ts
builderUtils.ts
components/
page.tsx
```

This is a major forensic-mapping target.

---

# 24. Current Builder `page.tsx`

**Migration status:** NOT STARTED

**Known issue:**

Large composition root.

Known responsibility mix includes:

- Builder UI;
- classes;
- saved assessments;
- paper state;
- paper targets;
- question workflow;
- analysis;
- preview;
- persistence;
- course configuration;
- UI settings;
- metadata.

**Target principle:**

```text
thin route
+
AssessmentCreatorPage
+
owned subdomains
```

**Risk:**

Simply renaming the giant implementation without reducing its responsibility.

---

# 25. Current Builder TopBar

Known major file:

```text
BuilderTopBar.tsx
```

**Migration status:** NOT STARTED

**Known issue:**

Contains several identifiable controls.

Expected decomposition may include:

```text
AssessmentNameField
ClassCoverageControl
AssessmentDate
PaperViewPill
ZoomControl
PageNavigationControl
```

Final decomposition requires source audit.

---

# 26. Current Builder Bottom HUD

Known major file:

```text
BuilderBottomHud.tsx
```

**Migration status:** NOT STARTED

**Known issue:**

Several lower-screen responsibilities are combined.

Potential V2 owners include:

```text
HUDBar
PaperWorkspace
Analysis
```

Do not mechanically rename it to `HUDBar.tsx`.

---

# 27. Current SettingsPanel

Known major file:

```text
SettingsPanel.tsx
```

**Migration status:** NOT STARTED

**Risk level:** HIGH

Known issue:

Large component mixing:

```text
GLOBAL APPLICATION SETTINGS
ASSESSMENT SETTINGS
WORKSPACE SETTINGS
```

Required migration principle:

Every setting is classified before movement.

---

# 28. Current Builder Behaviour Hooks

Known audited hooks include:

```text
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
```

**Migration status:** NOT STARTED

The flat `builder-behaviour` structure is not intended as a permanent V2
pattern.

Hooks should be reassigned according to responsibility.

---

# 29. Initial Hook Ownership Hypotheses

These are hypotheses only.

They must be confirmed by source inspection.

```text
UseBuilderPersistence
→ Persistence

UsePreviewViewport
→ PaperWorkspace

UseSkillsTreeState
→ SkillsPanel/02-SkillsTree

UseDraftWorkflow
UseQuestionDraftGeneration
UseQuestionWorkflow
→ Questions

Paper metadata/timing/target hooks
→ Papers

Progress calculations
→ Analysis and/or HUD presentation split
```

Do not treat this section as an approved file-level migration map.

---

# 30. Current Builder Logic

Known files include:

```text
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
```

**Migration status:** NOT STARTED

This folder is expected to be dismantled by ownership.

---

# 31. Initial Builder Logic Classification

Likely categories:

```text
Analysis
Papers
Questions
Courses
TopBar/AssessmentDate
UI/Documents
PaperWorkspace
```

No replacement generic:

```text
Creation/Logic/
```

should be introduced automatically.

---

# 32. Current Preview Engine

Known legacy area:

```text
builder-preview-engine/
```

**Migration status:** NOT STARTED

**Risk level:** HIGH

Reason:

The word `preview` may currently mix:

- document rendering;
- workspace presentation;
- page reflow;
- measurement;
- pagination;
- Assessment Creation-specific behaviour.

Potential V2 owners:

```text
PaperWorkspace
UI/Documents
Papers
```

Detailed audit is mandatory.

---

# 33. Current Builder Components

Known grouping:

```text
assessment-paper-layout/
assessment-preview/
assessment-progress/
builder-controls/
builder-layout/
shared/
skills-tree/
```

**Migration status:** NOT STARTED

This generic component hierarchy should not be copied wholesale.

Each visible component should be mapped to its physical UI owner.

Shared domain logic should be mapped to its actual domain owner.

---

# 34. Current `skills-tree` Area

**Migration status:** NOT STARTED

Important architectural split:

```text
Skills Tree UI
→ Assessments/Creation/SkillsPanel/02-SkillsTree
```

versus:

```text
National 5 Maths Skills Tree data
→ Courses/National5Maths/SkillsTree
```

This distinction must be maintained throughout migration.

---

# 35. Current Course Data

Legacy owner:

```text
course-data/
```

**Migration status:** NOT STARTED

Known valuable responsibilities include:

```text
course configuration
Skills Tree/catalogue
QuestionGeneration
AnswerGeneration
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

Target:

```text
src/Courses/National5Maths/
```

plus generic Course contracts where appropriate.

---

# 36. Strong Course Areas to Preserve Conceptually

The refactor should not assume all existing organisation is poor.

Positive legacy patterns include:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
curriculum-area grouping
```

These should be retained or improved rather than destroyed for novelty.

---

# 37. Current UI Duplication

Known overlapping sources include:

```text
root ui/
app/ui/
global settings state
settings-bar
SettingsPanel appearance controls
```

**Migration status:** NOT STARTED

**Risk level:** HIGH

Known problem:

Competing visual/theme authorities.

Target:

```text
src/UI/Application/
```

with one coherent source of truth.

---

# 38. Known Root `ui/` Files

Previously audited examples include:

```text
AccentPalette.ts
AppTheme.ts
ThemeMode.ts
ThemeProvider.tsx
UiTypography.ts
buildAccent.ts
```

These must be compared against equivalent responsibilities elsewhere before
migration.

---

# 39. Known `app/ui/` Files

Previously audited examples include:

```text
InteractionTokens.ts
appTheme.ts
uiTypography.ts
```

These overlap conceptually with root UI.

Do not simply move both systems beneath the new UI domain.

---

# 40. Theme Consolidation Target

Architecture V2 intends to converge toward:

```text
one theme definition
one theme state/provider
one persistence mechanism
one authoritative visual-token system
```

**Migration status:** NOT STARTED

---

# 41. Current Document Visual Sources

Known current document/layout area:

```text
app/paper-layout/
```

Known examples include:

```text
N5-Question-Spacing-px.ts
SQA-Typography.ts
page-sizes.ts
reflow-pages.ts
```

Additional document visual responsibilities may currently live inside:

```text
builder-preview-engine
assessment-paper-layout
compile-assessment
```

**Migration status:** NOT STARTED

---

# 42. Document UI Target

Likely authoritative visual owner:

```text
src/UI/Documents/
```

but only for truly document-owned presentation.

PaperWorkspace-specific interaction remains separate.

Course-specific semantic rules remain separate.

---

# 43. Current Shared Types

Legacy owner:

```text
shared-types/
```

**Migration status:** NOT STARTED

Known issue:

The types describe several different domains.

Target strategy:

Assign every type to the owner of the concept it models.

Do not create:

```text
src/SharedTypes/
```

as a replacement bucket.

---

# 44. Current Math Helpers

Legacy owner:

```text
math-helpers/
```

Known example:

```text
QuestionLogic.ts
```

**Migration status:** NOT STARTED

Known issue:

At least some behaviour is not genuinely generic mathematical helper
functionality.

Target:

Domain reassignment following audit.

---

# 45. Current Page Sections

Legacy owner:

```text
page-sections/
```

**Migration status:** NOT STARTED

Expected:

Distribute global application sections to actual owners.

Important candidate:

```text
global navigation/header
→ UI/Application/HeaderBar
```

---

# 46. Current Classes

Legacy route area:

```text
app/my-classes/
```

**Migration status:** NOT STARTED

Target:

```text
src/Classes/
```

for substantial Class-domain implementation,

with:

```text
src/app/my-classes/...
```

eventually acting as route glue.

---

# 47. Current Saved Assessments

Legacy route area:

```text
app/my-assessments/
```

**Migration status:** NOT STARTED

Target:

Assessment-domain ownership.

Potential descriptive page:

```text
AssessmentsLibraryPage.tsx
```

Final internal structure requires audit.

---

# 48. Current Assessment Compilation

Legacy area:

```text
app/compile-assessment/
```

**Migration status:** NOT STARTED

Target principle:

Compilation belongs to Assessment-domain functionality, not solely route
ownership.

Detailed destination requires audit.

---

# 49. Current Application Developer Tools

Legacy area:

```text
app/dev/
```

Known example:

Generator Tester.

**Migration status:** NOT STARTED

This is application/runtime developer functionality.

It is distinct from root repository:

```text
Tools/
```

---

# 50. Current Repository Tooling

Known root area:

```text
percentage_catalogue_hardening/
```

and:

```text
percentage_catalogue_hardening_bundle.zip
```

**Migration status:** NOT STARTED

Potential actions:

```text
MOVE → Tools/
```

or:

```text
DELETE
```

after the tooling's ongoing value is determined.

---

# 51. Suspected Accidental Root Artefacts

Known files:

```text
n5-assessment-tool@0.1.0
next
npm
```

These are reportedly zero-length root files.

**Current status:** AUDIT REQUIRED

Do not delete yet.

Required checks:

- inspect contents;
- inspect Git history if useful;
- search references;
- inspect npm scripts;
- confirm no intentional purpose.

If verified as accidental artefacts:

```text
Action → DELETE
```

and record the verification here before removal.

---

# 52. TypeScript Alias

Current historical alias:

```text
@/*
→ ./*
```

Target once migration permits:

```text
@/*
→ ./src/*
```

or equivalent.

**Migration status:** NOT STARTED

Do not switch prematurely while legacy source still depends heavily on root
resolution.

---

# 53. Next.js Root `app` Migration

The current app router lives at:

```text
app/
```

Target:

```text
src/app/
```

**Migration status:** NOT STARTED

This migration is intentionally delayed.

Reason:

It should not be mixed into the earliest product-domain refactors.

---

# 54. Public Route Naming

Internal Architecture V2 terminology changes do not automatically imply public
URL changes.

Example:

Legacy internal `Builder` terminology may be removed while an existing route
temporarily remains unchanged.

Any route change such as:

```text
/builder
→ /workspace
```

requires a separate explicit decision.

**Current route rename status:** NOT APPROVED / NOT PART OF INITIAL MIGRATION

---

# 55. Current Known High-Risk Areas

The following deserve particular care.

---

## 55.1 Assessment Creation orchestrator

Risk:

Moving the entire giant file under a better name without reducing
responsibility.

---

## 55.2 SettingsPanel

Risk:

Preserving three different settings domains inside one component.

---

## 55.3 Theme/state consolidation

Risk:

Accidentally maintaining two authorities after migration.

---

## 55.4 Preview/document rendering

Risk:

Duplicating document rendering between preview and compile.

---

## 55.5 Course data

Risk:

Breaking strong existing educational organisation while trying to generalise.

---

## 55.6 Persistence

Risk:

Breaking saved user state through storage-key changes.

---

## 55.7 Shared types

Risk:

Recreating the same dumping ground under a new name.

---

## 55.8 Question generation

Risk:

Blurring generic Assessment workflow with Course-specific mathematical
generation.

---

# 56. Current Known Architectural Opportunities

The refactor has already identified likely opportunities to make the
implementation materially smaller/clearer.

These opportunities require confirmation during forensic mapping.

---

## Opportunity A — Theme consolidation

Potential result:

Remove duplicated theme providers/definitions.

---

## Opportunity B — Settings decomposition

Potential result:

Replace one enormous settings component with independently owned settings
systems.

---

## Opportunity C — Builder hook consolidation

Potential result:

Reduce many `UseBuilder...` hooks by grouping related state and behaviour.

---

## Opportunity D — Remove generic helper/type buckets

Potential result:

Improve ownership clarity and reduce arbitrary cross-domain imports.

---

## Opportunity E — Shared document renderer

Potential result:

Preview and compiled document rendering may share authoritative layout
responsibilities under `UI/Documents`.

This must be confirmed from actual implementation.

---

## Opportunity F — Course-driven Skills Tree

Potential result:

Assessment Creation no longer directly depends on N5-specific Skills data.

---

# 57. Known Architectural Non-Goals

Architecture V2 is **not currently intended** to:

- introduce a new state-management library;
- replace localStorage with a backend database;
- implement OCR;
- implement AI marking;
- implement scanning;
- add Higher Maths immediately;
- redesign every product screen;
- change every URL;
- rewrite all question generators;
- change existing assessment behaviour unnecessarily.

Those may become future projects.

They are not justification for expanding the current refactor scope.

---

# 58. State-Management Rule During Refactor

Do not introduce a new global state library merely to make Architecture V2
look more sophisticated.

First:

- identify current state;
- group it by owner;
- remove duplication;
- simplify React coordination.

Only reconsider state technology later if real requirements justify it.

---

# 59. Persistence Rule During Refactor

Do not change storage technology merely because persistence files are being
moved.

The desired outcome is:

```text
better persistence ownership
```

not automatically:

```text
new persistence technology
```

---

# 60. UI Rule During Refactor

Do not use the architecture refactor as an excuse for uncontrolled visual
redesign.

Where component decomposition requires minor UI adjustment, preserve current
teacher-facing behaviour unless a redesign is explicitly approved.

---

# 61. Course Rule During Refactor

Do not over-generalise National 5 Maths merely to demonstrate multi-course
support.

The architecture should support another Course.

It does not need speculative functionality for Courses which do not yet exist.

---

# 62. Dead-Code Ledger

This section records code which has been **verified** as dead or obsolete.

At initial ledger creation:

```text
NONE CONFIRMED
```

Do not put suspected files here until verification is complete.

---

# 63. Suspected Dead / Obsolete Code Queue

These items require audit but are **not safe to delete yet**:

```text
n5-assessment-tool@0.1.0
next
npm
percentage_catalogue_hardening_bundle.zip
possibly completed catalogue migration utilities
unwired legacy helper files discovered during future audits
```

Status:

```text
AUDIT REQUIRED
```

---

# 64. Safe-to-Delete Ledger

This section records files/folders approved for removal.

Initial state:

```text
NONE
```

Entry template:

```text
Date:
Path:
Reason:
Import search:
Runtime/build check:
Replacement:
Approved:
Deleted in commit:
```

---

# 65. Temporary Adapter Ledger

Any transitional compatibility files introduced during migration must be
recorded here.

Initial state:

```text
NONE
```

Entry template:

```text
Adapter:
Created during:
Purpose:
Legacy dependency:
V2 dependency:
Removal condition:
Target removal phase:
```

---

# 66. Open Architectural Questions

Only unresolved questions belong here.

A question already settled in `LockedDecisions.md` must not be added as though
it were open.

Initial known detailed questions include:

---

## OQ-001 — Exact chronological migration order after documentation

**Status:** OPEN

Need:

Full dependency-aware forensic map before deciding first source migration.

---

## OQ-002 — Exact public route name for Assessment Creation workspace

**Status:** OPEN / NOT REQUIRED YET

Potential historical/current route may continue during internal migration.

Possible future `/workspace` naming has been discussed conceptually but is not
approved merely through internal architecture terminology.

---

## OQ-003 — Exact final ownership of shared document pagination/reflow

**Status:** OPEN

Need audit of:

```text
app/paper-layout
builder-preview-engine
assessment-paper-layout
compile-assessment
```

Potential owners:

```text
UI/Documents
PaperWorkspace
```

---

## OQ-004 — Exact final ownership of save status UI

**Status:** OPEN AT COMPONENT LEVEL

Current design thinking suggests it may visually belong to PaperWorkspace near
the workspace controls.

Final location requires product/source mapping.

Underlying persistence remains separately owned.

---

## OQ-005 — Exact decomposition of CourseDefinition

**Status:** OPEN AT IMPLEMENTATION LEVEL

The Course contract concept is locked.

Its precise properties and file boundaries should be based on actual
requirements.

---

## OQ-006 — Final home of runtime developer tools

**Status:** OPEN

Need audit of `app/dev`.

Do not confuse this with root `Tools`.

---

# 67. Resolved Architectural Questions

Use this section for questions which were once open but have now been resolved.

---

## RQ-001 — Separate V2 repository?

**Resolution:**

No.

Use the existing repository, refactor branch and `src`.

---

## RQ-002 — Move old source into `Legacy/` immediately?

**Resolution:**

No.

Keep legacy source physically in place and hide it visually in the V2
workspace.

---

## RQ-003 — What is the new central assessment area called?

**Resolution:**

```text
PaperWorkspace
```

---

## RQ-004 — What is the whole Assessment Creation page called?

**Resolution:**

```text
AssessmentCreatorPage
```

---

## RQ-005 — Global top navigation naming?

**Resolution:**

```text
HeaderBar
```

---

## RQ-006 — Assessment-specific top row naming?

**Resolution:**

```text
TopBar
```

---

## RQ-007 — Bottom assessment region naming?

**Resolution:**

```text
HUDBar
```

---

## RQ-008 — Global vs assessment vs workspace settings?

**Resolution:**

Three separate ownership categories.

---

## RQ-009 — Should future feature folders be created now?

**Resolution:**

No.

Only implemented responsibilities receive physical folders.

---

## RQ-010 — Should a new state library be introduced during this refactor?

**Resolution:**

No.

Organise existing state first.

---

# 68. Refactor Migration Entry Template

Every completed migration should receive an entry using this structure.

---

## MIG-XXX — [Migration Name]

**Status:** PLANNED / IN PROGRESS / COMPLETE / ROLLED BACK  
**Date started:**  
**Date completed:**  
**Git branch:**  
**Commit:**  

### Scope

Exact area being migrated.

### Legacy paths

```text
...
```

### V2 paths

```text
...
```

### Actions

```text
MOVE
RENAME
SPLIT
MERGE
DELETE
...
```

### Behaviour intended to remain unchanged

List user-facing behaviour that must survive.

### Architectural improvements

List:

- ownership changes;
- source-of-truth consolidation;
- naming improvements;
- simplification;
- duplicate removal.

### Compatibility considerations

Examples:

- localStorage;
- URLs;
- persisted data;
- generated assessment output;
- type contracts.

### Verification performed

```text
TypeScript:
Build:
Lint:
Manual UI test:
Persistence test:
Document test:
```

### Result

Describe outcome.

### Remaining legacy dependency

Describe any temporary legacy files still required.

### Documentation updated

```text
RepositoryMap:
RefactorLedger:
Architecture:
LockedDecisions:
```

### Rollback point

Commit before migration.

---

# 69. Migration Numbering

Use sequential migration IDs:

```text
MIG-001
MIG-002
MIG-003
...
```

Do not reuse an ID.

If a migration is rolled back, preserve the entry.

The historical fact that it occurred remains useful.

---

# 70. Initial Migration Entries

No application source migrations have been completed yet.

The first entries in this ledger concern Architecture V2 setup.

---

# MIG-000 — Architecture V2 Preservation Setup

**Status:** COMPLETE

## Scope

Protect the existing working application before source restructuring.

## Actions completed

- maintain known-good `main`;
- create frozen baseline branch;
- create `refactor/architecture-V2`;
- create offline Windows project copy;
- continue using existing repository rather than duplicate V2 repository.

## Result

Multiple independent recovery paths exist before refactor source movement.

## Behaviour change

None.

---

# MIG-000A — Architecture V2 Clean Workspace Setup

**Status:** COMPLETE

## Scope

Create a visually clean Architecture V2 working environment without physically
moving legacy source.

## Actions completed

- create `src`;
- save external `VecEd-Architecture-V2.code-workspace`;
- configure VS Code to hide legacy source;
- hide generated/dependency folders where useful.

## Result

Developers can focus on:

```text
Docs
src
public
repository configuration
```

while the old application remains fully present.

## Behaviour change

None.

---

# MIG-000B — Architecture Documentation Bootstrap

**Status:** IN PROGRESS

## Scope

Create persistent architectural memory before source migration begins.

## Completed files

```text
Docs/Architecture.md
Docs/LockedDecisions.md
Docs/RepositoryMap.md
```

## Current file

```text
Docs/RefactorLedger.md
```

## Remaining

```text
Docs/ChatGPTWorkflow.md
AGENTS.md
```

## Result target

Future development conversations no longer need to reconstruct Architecture V2
from historical chat context.

---

# 71. Verification Standards

Different migrations require different verification.

Not every migration requires every test below, but each relevant check should be
considered explicitly.

---

## 71.1 TypeScript verification

Typical command:

```text
npx tsc --noEmit
```

or the project's approved equivalent.

Record result.

---

## 71.2 Production build

Typical command:

```text
npm run build
```

Record:

- success;
- warnings;
- failures.

Do not ignore newly introduced build errors.

---

## 71.3 Lint verification

Where appropriate:

```text
npm run lint
```

or configured equivalent.

Distinguish pre-existing warnings from newly introduced issues.

---

## 71.4 Development runtime

Confirm:

```text
npm run dev
```

starts successfully where required.

---

## 71.5 Manual product verification

Test the visible feature affected.

Examples for Assessment Creation:

- name editing;
- class selection;
- date selection;
- P1/P2 view switching;
- zoom;
- navigation;
- Skills Tree;
- filters;
- question addition;
- preview;
- progress;
- saving;
- compile.

---

## 71.6 Persistence verification

When persistence code changes, test:

- existing saved state loads;
- new state saves;
- refresh restores state;
- old localStorage keys still work where required.

---

## 71.7 Document verification

When document layout/rendering changes, inspect:

- page dimensions;
- typography;
- question placement;
- answer space;
- page breaks;
- cover page;
- formula sheet;
- compiled output.

---

## 71.8 Course verification

When Course architecture changes, verify:

- active course resolves;
- Skills Tree matches existing N5 data;
- generators still resolve;
- source catalogues remain accessible;
- no generic UI requires N5-specific hard-coded imports unnecessarily.

---

# 72. Verification Result Vocabulary

Use:

```text
PASS
PASS WITH PRE-EXISTING WARNINGS
FAIL
NOT APPLICABLE
NOT YET TESTED
```

Avoid vague terms such as:

```text
seems okay
probably fine
looks good
```

in formal migration records.

---

# 73. Pre-Existing Problems

If verification exposes a problem that already existed before the current
migration:

Record it separately.

Do not automatically expand migration scope to fix unrelated behaviour.

Example:

```text
Pre-existing issue:
...
Evidence:
...
Current migration caused it?
No.
Follow-up required?
Yes/No.
```

---

# 74. Regression Rule

If a bounded migration introduces a regression:

Do not continue stacking further migrations on top of it.

Preferred sequence:

```text
identify
↓
repair
or
rollback
↓
re-verify
↓
continue
```

---

# 75. Rollback Strategy

Every meaningful migration should have a known previous commit.

If a migration becomes unstable:

- stop;
- inspect diff;
- identify whether repair is small and understood;
- otherwise revert/reset appropriately using Git.

Do not manually reconstruct the previous state from memory.

That is what Git is for.

---

# 76. Last Known-Good Architecture V2 Point

At initial ledger creation:

```text
Last known-good source state:
Pre-source-migration application on refactor/architecture-V2

Application source migration:
None

Documentation changes:
In progress
```

Update this after every verified migration commit.

---

# 77. Current Blockers

At initial ledger creation:

```text
No technical blocker.
```

Current deliberate prerequisite:

```text
Complete Architecture V2 documentation before source movement.
```

---

# 78. Current Immediate Next Actions

The agreed immediate sequence is:

```text
1. Finish RefactorLedger.md
2. Create ChatGPTWorkflow.md
3. Create AGENTS.md
4. Review all Architecture V2 documents together
5. Save all files
6. Inspect Git changes
7. Commit documentation bootstrap on refactor/architecture-V2
8. Begin full forensic repository mapping
9. Approve migration plan
10. Begin first bounded source migration
```

---

# 79. Documentation Bootstrap Commit

Intended first Architecture V2 documentation commit concept:

```text
docs: establish VecEd Architecture V2 and AI workflow
```

Exact wording may be adjusted.

This commit should ideally contain the completed documentation suite without
application source migration.

---

# 80. Documentation Review Checklist

Before the documentation bootstrap commit:

- [ ] Architecture.md exists.
- [ ] LockedDecisions.md exists.
- [ ] RepositoryMap.md exists.
- [ ] RefactorLedger.md exists.
- [ ] ChatGPTWorkflow.md exists.
- [ ] AGENTS.md exists at repository root.
- [ ] No contradictory naming exists.
- [ ] HeaderBar and TopBar remain distinct.
- [ ] PaperWorkspace terminology is consistent.
- [ ] AssessmentCreatorPage terminology is consistent.
- [ ] `src` is documented as target source boundary.
- [ ] Legacy source is documented as transitional.
- [ ] Course-driven Skills Tree architecture is explicit.
- [ ] Application UI and Document UI split is explicit.
- [ ] Settings ownership split is explicit.
- [ ] PascalCase rule is explicit.
- [ ] Next.js `page.tsx` rule is explicit.
- [ ] No speculative future feature folders are mandated.
- [ ] No new state library is introduced.
- [ ] Refactor branch is correctly named.
- [ ] Frozen archive branch is correctly named.

---

# 81. Source Migration Readiness Checklist

Before the first source file is moved:

- [ ] Documentation bootstrap committed.
- [ ] Correct branch confirmed.
- [ ] Working application still starts.
- [ ] Relevant legacy area revealed/accessible.
- [ ] Full target area inspected.
- [ ] Imports traced.
- [ ] Exports traced.
- [ ] Consumers traced.
- [ ] Existing behaviour documented.
- [ ] Proposed owner agreed.
- [ ] Proposed path agreed.
- [ ] KEEP/MOVE/RENAME/SPLIT/MERGE/DELETE decisions agreed.
- [ ] Persistence implications understood.
- [ ] Route implications understood.
- [ ] UI implications understood.
- [ ] Verification plan defined.
- [ ] Rollback point known.

---

# 82. Current Source Migration Readiness

At initial ledger creation:

```text
NOT READY
```

Reason:

Architecture documentation is not yet fully complete.

No source migration should begin until:

```text
ChatGPTWorkflow.md
AGENTS.md
```

have also been established and the documentation set reviewed.

---

# 83. Branch Check Requirement

Before every substantial work session:

Confirm:

```text
refactor/architecture-V2
```

during the refactor.

Do not rely solely on memory.

The branch should be visibly checked in GitHub Desktop, VS Code or Git.

---

# 84. Git Status Requirement

Before a migration begins:

Understand the current working-tree state.

Avoid starting structural work with unrelated unexplained changes already
present.

---

# 85. Migration Commit Boundary Rule

Prefer commits which describe one understandable architectural change.

Examples:

```text
refactor: migrate global HeaderBar
refactor: consolidate application theme
refactor: migrate Assessment Creation TopBar
refactor: separate Skills Filters from Skills Tree
```

Avoid:

```text
refactor: move lots of stuff
```

---

# 86. Documentation Changes Within Migration Commits

When a migration changes physical structure:

Update `RepositoryMap.md` and this ledger in the same logical migration.

This ensures documentation and implementation cannot easily drift apart.

---

# 87. Architecture Change During Migration

If a migration reveals a need to change a locked architectural rule:

Stop implementation.

Record:

```text
Conflict:
Relevant LD decision:
Why implementation cannot cleanly comply:
Proposed amendment:
Consequences:
```

Obtain approval first.

Then update:

```text
LockedDecisions.md
Architecture.md
RepositoryMap.md
RefactorLedger.md
```

as required.

---

# 88. Implementation Refinement vs Architecture Change

Not every file-level adjustment is an architecture change.

Example:

Changing:

```text
AssessmentDatePicker.tsx
```

to:

```text
AssessmentDateCalendar.tsx
```

after detailed product inspection may simply refine naming.

However, changing:

```text
AssessmentDate
```

from TopBar ownership to a new global `DateSystem` top-level domain would be an
architectural change.

Use judgement.

When uncertain, surface the decision rather than silently changing ownership.

---

# 89. Migration Risk Scale

Use this informal scale where useful.

---

## LOW

Examples:

- straightforward rename;
- single component move;
- no persistence;
- few consumers;
- no route change.

---

## MEDIUM

Examples:

- several imports;
- shared component;
- state hook relocation;
- moderate visible workflow.

---

## HIGH

Examples:

- persistence;
- routing;
- large state ownership;
- theme/provider consolidation;
- document pagination;
- giant settings component;
- Builder orchestrator;
- Course contract.

---

## CRITICAL

Use sparingly.

Examples:

- migration could invalidate saved user data;
- migration could prevent the entire application from routing;
- migration touches multiple central sources of truth simultaneously.

High-risk areas should be migrated in smaller pieces.

---

# 90. Current Risk Register

| Area | Risk | Reason |
| --- | --- | --- |
| Builder `page.tsx` | HIGH | Large orchestration surface |
| SettingsPanel | HIGH | Mixed ownership and large size |
| Theme/global settings | HIGH | Duplicate authorities |
| Preview/document rendering | HIGH | Potential rendering duplication |
| Course architecture | HIGH | Many consumers and future-proofing |
| Persistence | HIGH | Existing local data compatibility |
| Shared types | MEDIUM | Cross-domain import effects |
| TopBar | MEDIUM | Several controls/state consumers |
| SkillsTree | HIGH | UI/course ownership split |
| HUDBar | MEDIUM | Responsibilities may move elsewhere |
| Root artefact cleanup | LOW | Once references verified |
| Documentation creation | LOW | No runtime behaviour |

Update this table as evidence changes.

---

# 91. Compatibility Register

This section tracks compatibility concerns which should survive structural
migration.

---

## LocalStorage

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Do not silently break existing keys.

---

## Public URLs

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Internal naming changes do not automatically change routes.

---

## Saved Assessments

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Existing saved assessments should remain accessible unless an explicit data
migration is approved.

---

## Classes

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Class data should survive domain migration.

---

## UI Settings

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Theme/appearance preferences should survive consolidation where currently
persisted.

---

## Generated Assessment Output

**Status:** ACTIVE COMPATIBILITY REQUIREMENT

Document architecture changes should preserve expected generated paper
behaviour unless intentionally redesigned.

---

# 92. Naming Migration Register

Legacy terms scheduled to disappear progressively include:

```text
Builder
BuilderLogic
BuilderUtils
BuilderBehaviour
BuilderPreviewEngine
BottomHud
shared-types
math-helpers
```

Do not globally rename them at once.

Each disappears through ownership-driven migration.

---

# 93. Canonical V2 Vocabulary Register

Approved terms include:

```text
HeaderBar
TopBar
HUDBar
SkillsPanel
SkillsFilters
SkillsTree
PaperWorkspace
AssessmentCreatorPage
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
CourseRegistry
CourseDefinition
SourceQuestionCatalog
SourceMarkingSchemeCatalog
```

Use RepositoryMap and LockedDecisions for precise meaning.

---

# 94. Course Extensibility Check

Every Course-related migration should ask:

> If Higher Maths were added later as a sibling Course, would this generic
> Assessment Creation code require unnecessary rewriting?

If yes:

Investigate whether Course-specific knowledge is leaking into generic code.

Do not build Higher now.

Use the question only as an architecture test.

---

# 95. UI Ownership Check

Every visual migration should ask:

> Is this application UI or generated-document UI?

If:

```text
teacher-facing VecEd interface
```

likely owner:

```text
UI/Application
```

If:

```text
assessment document appearance
```

likely owner:

```text
UI/Documents
```

If:

```text
feature-specific visible control
```

likely owner:

the relevant feature/physical region.

---

# 96. Assessment Creation Ownership Check

For every Builder file, ask:

```text
Is this:
- page composition?
- TopBar?
- SkillsFilters?
- SkillsTree?
- PaperWorkspace?
- HUDBar?
- AssessmentSettings?
- Questions?
- Papers?
- Analysis?
- Persistence?
- Course-owned?
- Classes-owned?
- Application UI?
- Document UI?
- dead?
```

One of these should normally provide a more meaningful answer than:

```text
Builder
```

---

# 97. Source-of-Truth Check

Before creating a new V2 module, ask:

- Does equivalent state already exist?
- Does equivalent data already exist?
- Does equivalent visual configuration already exist?
- Does another persistence system already own this?
- Is another Course module already authoritative?

If yes:

Prefer migration/consolidation over duplication.

---

# 98. “Do Not Copy the Mess” Rule

A migration is not successful merely because:

```text
legacy/path
```

became:

```text
src/new/path
```

If the old file:

- mixes responsibilities;
- duplicates state;
- has misleading naming;
- contains dead code;

the migration should address those issues where safely possible.

---

# 99. “Do Not Rewrite for Sport” Rule

The inverse also applies.

If a current file:

- has clear ownership;
- is well organised;
- works;
- has an accurate name;
- introduces no duplication;

it may simply need to move.

Architecture V2 is not an excuse to rewrite good code unnecessarily.

---

# 100. Positive Legacy Preservation Principle

Strong legacy organisation should be kept conceptually.

Examples already identified:

```text
SourceQuestionCatalog
SourceMarkingSchemeCatalog
curriculum-area generator grouping
```

A refactor should distinguish:

```text
old
```

from:

```text
bad
```

They are not the same thing.

---

# 101. Refactor Session Start Template

At the beginning of every future Architecture V2 work session, record or
confirm:

```text
Date:
Branch:
Current phase:
Current migration:
Last known-good commit:
Working tree clean?
Relevant docs read?
Target area inspected?
```

This may be recorded formally when the work is substantial.

---

# 102. Refactor Session End Template

At the end of a substantial refactor session:

```text
Date:
Migration worked on:
Completed:
Not completed:
Verification:
Known regressions:
New discoveries:
Documentation updated:
Commit:
Next action:
```

This ensures a new conversation can continue accurately.

---

# 103. Current Session Bootstrap Record

**Date:** 25 August 2026

## Work completed before this ledger

- Architecture V2 direction extensively discussed.
- Frozen Git baseline established.
- Active refactor branch established.
- Offline Windows backup established.
- External Architecture V2 VS Code workspace established.
- Legacy source hidden visually.
- `src` clean construction area established.
- `Architecture.md` created.
- `LockedDecisions.md` created.
- `RepositoryMap.md` created.

## Current work

Creating:

```text
RefactorLedger.md
```

## Application source modified?

```text
NO
```

## Migration started?

```text
NO
```

---

# 104. Current Documentation State After This File Is Saved

Once this file has been pasted and saved:

```text
Architecture.md       COMPLETE
LockedDecisions.md    COMPLETE
RepositoryMap.md      COMPLETE
RefactorLedger.md     COMPLETE / ACTIVE
ChatGPTWorkflow.md    PENDING
AGENTS.md             PENDING
```

---

# 105. Immediate Next File

After this ledger:

```text
Docs/ChatGPTWorkflow.md
```

Purpose:

Create repeatable prompts and procedures so a fresh ChatGPT conversation can
join the project without architectural drift.

---

# 106. Final Bootstrap File

After `ChatGPTWorkflow.md`:

```text
AGENTS.md
```

at repository root.

This becomes the mandatory entry point for AI/developer repository work.

---

# 107. Documentation Freeze Point

Once all five Docs files plus `AGENTS.md` exist:

Pause.

Before application source migration:

1. review all documents;
2. check for contradictions;
3. inspect Git diff;
4. confirm correct branch;
5. make the documentation bootstrap commit.

Only then begin forensic source mapping.

---

# 108. Refactor Ledger Update Discipline

This document only remains useful if it stays current.

Whenever a migration completes:

Update at minimum:

```text
Current phase
Current migration
Migration entry
Verification
Legacy dependency state
Last known-good commit
Immediate next action
```

---

# 109. Never Falsify Migration Completion

Do not mark an area:

```text
COMPLETE
```

merely because files have moved.

Completion requires relevant verification.

At minimum:

```text
structure migrated
imports repaired
required checks pass
relevant behaviour tested
documentation updated
```

---

# 110. Partial Migration Status

If an area has moved but still relies on legacy code, mark:

```text
MIGRATION IN PROGRESS
```

or equivalent.

Do not conceal transitional dependencies.

---

# 111. Migration Dependency Register

This section will track dependencies which temporarily prevent legacy removal.

Initial state:

```text
All application source remains legacy-dependent because migration has not begun.
```

Future example:

```text
Legacy file:
app/create-assessment/builder/SomeFile.ts

Still required by:
src/Assessments/Creation/...

Removal condition:
consumer X migrated in MIG-012
```

---

# 112. Legacy Folder Retirement Register

Track when a historical root source folder can finally disappear.

---

## `app/`

```text
Status: ACTIVE
Retirement condition:
All routes migrated to src/app and all product implementation relocated.
```

---

## `course-data/`

```text
Status: ACTIVE
Retirement condition:
All Course responsibilities migrated and all consumers updated.
```

---

## `math-helpers/`

```text
Status: ACTIVE
Retirement condition:
Every helper classified, migrated or deleted.
```

---

## `page-sections/`

```text
Status: ACTIVE
Retirement condition:
Every page section assigned to its proper V2 owner.
```

---

## `shared-types/`

```text
Status: ACTIVE
Retirement condition:
Every type assigned to an owning domain or justified contract.
```

---

## `ui/`

```text
Status: ACTIVE
Retirement condition:
Application visual system migrated and duplicate authorities removed.
```

---

# 113. Root Artefact Retirement Register

---

## `percentage_catalogue_hardening/`

```text
Status: AUDIT REQUIRED
Potential destination: Tools/
Potential alternative: DELETE
```

---

## `percentage_catalogue_hardening_bundle.zip`

```text
Status: AUDIT REQUIRED
Potential action: DELETE
```

---

## `n5-assessment-tool@0.1.0`

```text
Status: AUDIT REQUIRED
Likely accidental artefact
```

---

## `next`

```text
Status: AUDIT REQUIRED
Likely accidental artefact
```

---

## `npm`

```text
Status: AUDIT REQUIRED
Likely accidental artefact
```

---

# 114. Documentation Drift Check

During every significant migration, ask:

```text
Does RepositoryMap still describe reality?
Does RefactorLedger still describe progress?
Did any locked decision change?
Did any architectural principle change?
```

If:

```text
Repository location changed
```

update RepositoryMap.

If:

```text
progress changed
```

update RefactorLedger.

If:

```text
locked decision changed
```

update LockedDecisions after approval.

If:

```text
architecture changed
```

update Architecture after approval.

---

# 115. Scope-Control Rule

Architecture V2 is already a large project.

When a migration exposes an unrelated potential feature:

Record it separately if valuable.

Do not automatically implement it.

Examples:

```text
new marking feature
new analytics panel
new Course
new persistence backend
new AI functionality
```

Keep the refactor bounded.

---

# 116. Bug-Fix During Refactor Rule

If a genuine bug is discovered while refactoring:

Determine whether:

```text
A. the migration caused it;
B. it was pre-existing;
C. it blocks the migration;
D. it is unrelated.
```

If migration-caused:

Fix before proceeding.

If pre-existing and blocking:

Discuss whether to fix within current scope.

If unrelated:

Record/defer rather than expanding scope automatically.

---

# 117. Visual Redesign During Refactor Rule

If decomposition exposes an opportunity to improve UI:

Do not silently redesign.

Separate:

```text
architecture refactor
```

from:

```text
product design change
```

unless the user explicitly chooses to combine them.

---

# 118. Performance Changes During Refactor

Do not claim performance improvement simply because structure is cleaner.

If performance work emerges:

Measure when possible.

Architecture and runtime performance are related but not identical concerns.

---

# 119. Test Coverage Opportunity

Architecture V2 may expose useful boundaries where tests could later be added.

This is desirable but not automatically mandatory for every migration if the
project does not currently have equivalent test infrastructure.

Do not turn the refactor into an uncontrolled test-framework migration without
discussion.

---

# 120. Build Infrastructure Changes

Avoid changing:

- bundler;
- package manager;
- framework;
- major compiler configuration;

unless the architecture task genuinely requires it.

Architecture V2 is not a technology-stack replacement.

---

# 121. Dependency Upgrade Rule

Do not combine large dependency upgrades with structural migrations without a
specific reason.

Otherwise regressions become harder to attribute.

---

# 122. Naming-Only Commit Rule

Large naming migrations may deserve dedicated commits if they materially affect
many paths.

Do not combine widespread naming churn with unrelated behavioural changes where
it can be avoided.

---

# 123. Persistence-Only Commit Rule

Persistence compatibility changes deserve particularly clear commit boundaries
where practical.

Saved user data is too important for persistence changes to be hidden inside a
large unrelated refactor.

---

# 124. Route-Only Commit Rule

Moving routing from root `app` to `src/app` should ideally occur as a deliberate
migration stage after descriptive product implementations already exist.

Do not hide route movement inside unrelated component cleanup.

---

# 125. Alias Migration Rule

Changing:

```text
@/*
```

to resolve from `src` should occur only when consumer migration has reached a
safe point.

This change may affect large portions of the repository.

Treat it as a deliberate migration stage.

---

# 126. Last Legacy File Principle

Do not remove a legacy folder just because almost everything has migrated.

The final remaining file may still be critical.

Retirement happens only after the last dependency is understood.

---

# 127. Temporary Mixed Architecture Is Expected

During the refactor, imports such as:

```text
legacy route
→ V2 component
```

or:

```text
V2 component
→ temporarily required legacy domain
```

may exist.

This is acceptable during bounded migration.

It must be recorded where significant.

The transitional architecture is not the final architecture.

---

# 128. Avoid Permanent Transitional Architecture

A temporary adapter is not automatically a new architectural pattern.

Once migration completes:

Remove transitional layers which no longer serve a purpose.

---

# 129. Refactor Completion Does Not Mean Zero Legacy Terminology in History

Git history will naturally contain historical Builder names and old paths.

The goal is clean current source.

Historical commits do not need rewriting to erase old terminology.

---

# 130. Repository History Is Valuable

Prefer normal Git moves/refactors which preserve historical traceability.

Do not rewrite repository history simply to make Architecture V2 appear as if
it always existed.

---

# 131. Architecture V2 Definition of Success

The refactor is substantially complete when:

- application source is under `src`;
- legacy root application-source folders are gone;
- Next.js route files are thin;
- descriptive pages own substantial page implementation;
- Assessment Creation is no longer a giant Builder tree;
- global HeaderBar is distinct from TopBar;
- Settings ownership is separated;
- PaperWorkspace has clear ownership;
- HUDBar contains only genuine HUD responsibilities;
- Courses drive Course-specific data;
- Skills Tree UI is distinct from Skills Tree curriculum;
- UI/Application is authoritative for app visuals;
- UI/Documents is authoritative for document visuals;
- duplicate theme systems are gone;
- generic type/helper dumps are gone or explicitly justified;
- persistence remains compatible;
- strong existing catalog organisation is preserved;
- future Course addition is straightforward;
- documentation matches physical reality;
- a fresh developer can navigate the repository predictably.

---

# 132. Architecture V2 Final Verification Checklist

When the refactor nears completion:

- [ ] `src` is authoritative.
- [ ] Root `app/` retired.
- [ ] Root `course-data/` retired.
- [ ] Root `math-helpers/` retired.
- [ ] Root `page-sections/` retired.
- [ ] Root `shared-types/` retired.
- [ ] Root `ui/` retired.
- [ ] No duplicate app UI theme authority.
- [ ] No giant legacy SettingsPanel.
- [ ] No giant Builder route implementation.
- [ ] No course data hard-coded into generic SkillsTree.
- [ ] No generic `Helpers` dump.
- [ ] No generic `SharedTypes` dump.
- [ ] `page.tsx` files are thin.
- [ ] TypeScript alias reflects final source boundary.
- [ ] Routes function.
- [ ] Existing stored data functions.
- [ ] Assessment Creation functions.
- [ ] Assessment compilation functions.
- [ ] Classes function.
- [ ] Saved assessments function.
- [ ] Source catalogues function.
- [ ] Document rendering functions.
- [ ] Production build succeeds.
- [ ] RepositoryMap matches reality.
- [ ] RefactorLedger is current.
- [ ] LockedDecisions reflects approved architecture.
- [ ] Architecture.md reflects final architecture.

---

# 133. Post-Refactor Rule

Once Architecture V2 is complete, this ledger should remain in the repository.

Do not delete it immediately.

It provides historical context for why significant paths and responsibilities
changed.

It may eventually be marked:

```text
Architecture V2 Migration — COMPLETE
```

and retained as historical project documentation.

---

# 134. Future Architecture Refactors

If VecEd later requires another major architecture revision:

Do not overwrite the historical V2 ledger as if the migration never happened.

Either:

- extend this ledger carefully; or
- archive it and establish a clearly versioned successor.

Historical architectural intent has value.

---

# 135. Current Refactor Dashboard

**Last updated:** 25 August 2026

```text
ARCHITECTURE V2 STATUS

Safety / preservation
██████████  COMPLETE

Architecture discussion
██████████  COMPLETE FOR BOOTSTRAP

Architecture.md
██████████  COMPLETE

LockedDecisions.md
██████████  COMPLETE

RepositoryMap.md
██████████  COMPLETE

RefactorLedger.md
████████░░  BEING CREATED

ChatGPTWorkflow.md
░░░░░░░░░░  NOT STARTED

AGENTS.md
░░░░░░░░░░  NOT STARTED

Forensic repository mapping
░░░░░░░░░░  NOT STARTED

Application source migration
░░░░░░░░░░  NOT STARTED

Legacy retirement
░░░░░░░░░░  NOT STARTED

Final V2 verification
░░░░░░░░░░  NOT STARTED
```

After this file is saved, update:

```text
RefactorLedger.md
██████████  COMPLETE / ACTIVE
```

---

# 136. Current Authoritative Statement

At this point in the project:

> VecEd Architecture V2 has been designed conceptually but has not yet been
> applied to the application source.

The old source tree remains the working implementation.

The new `src` tree is the migration destination.

This is intentional.

No future conversation should infer that folders shown in the target
Architecture V2 diagrams have already been fully implemented simply because
they appear in documentation.

---

# 137. Immediate Next Step

After saving this file:

```text
Create Docs/ChatGPTWorkflow.md
```

Then:

```text
Create root AGENTS.md
```

Then:

```text
review
→ commit documentation
→ begin forensic mapping
```

---

# 138. Final Ledger Principle

This document should make it possible for somebody joining the project months
from now to answer:

> Where exactly did the Architecture V2 refactor get to?

without relying on memory, chat history or guesswork.

Every meaningful migration should leave behind enough information that the next
person can continue safely.

The goal is not merely to finish Architecture V2.

The goal is to ensure that VecEd never again requires a complete archaeological
reconstruction of its own architecture before development can continue.