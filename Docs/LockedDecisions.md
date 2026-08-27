# N5 Assessment Tool — Locked Decisions

**Document type:** Binding architectural decision register  
**Architecture baseline:** Architecture V2  
**Status:** Active  
**Applies to:** All N5 Assessment Tool development unless explicitly amended by the user  
**Purpose:** Preserve settled architectural decisions between development sessions

---

# 1. Purpose

This document records decisions which have already been considered and approved.

A decision marked `LOCKED` is not a suggestion or brainstorming prompt.

Future development should follow it unless:

- the user explicitly requests reconsideration; or
- new technical evidence demonstrates a material conflict.

Legacy implementation which disagrees with a locked decision is normally historical/migration evidence, not proof that the locked decision is wrong.

Architecture V2 is now substantially complete. Earlier decisions remain in this register because decision IDs are permanent and because they explain how the current architecture was established. Where an earlier decision no longer describes current state, it is explicitly marked superseded/implemented or is clarified by a later decision.

---

# 2. Documentation Precedence

Use this precedence for project-specific decisions:

```text
1. Explicit current user instruction
2. AGENTS.md
3. Docs/LockedDecisions.md
4. Docs/Architecture.md
5. Docs/RepositoryMap.md
6. Current source implementation
7. Docs/FeatureHistory.md
8. Docs/FutureFeatures.md
9. Docs/RefactorLedger.md
10. Historical implementation convention
```

`FeatureHistory.md` records what changed; it does not override architecture.

`FutureFeatures.md` records ideas/plans; an idea is not a locked decision merely because it is written there.

`RefactorLedger.md` is historical and may intentionally contain paths which are no longer current.

---

# 3. Changing a Locked Decision

Do not silently violate a locked decision.

If a genuine conflict appears:

```text
IDENTIFY DECISION
        ↓
EXPLAIN NEW EVIDENCE
        ↓
EXPLAIN CONFLICT
        ↓
PROPOSE AMENDMENT
        ↓
OBTAIN EXPLICIT APPROVAL
        ↓
UPDATE DOCUMENTATION
```

Decision IDs are permanent.

If a decision is replaced, the original remains in this register with `SUPERSEDED` status and the replacement receives a new ID.

---

# PART I — REFACTOR PURPOSE AND SAFETY

## LD-001 — Architecture V2 is a repository-wide architectural refactor

**Status:** LOCKED — HISTORICAL PURPOSE ACHIEVED

Architecture V2 restructured ownership, naming, dependencies, UI, Courses, persistence, state and repository organisation. It was not cosmetic folder tidying.

---

## LD-002 — Preservation is acceptance criterion zero

**Status:** LOCKED

Existing working behaviour must be preserved unless a product change is explicitly approved. Cleaner architecture which removes working functionality is a failed change.

---

## LD-003 — Architecture V2 proceeds in bounded stages

**Status:** LOCKED — PROCESS RETAINED

The refactor was performed through bounded, independently verifiable responsibility migrations rather than one uncontrolled repository-wide mutation. The same bounded-change principle remains valid for future structural work.

---

## LD-004 — Refactoring may reduce code

**Status:** LOCKED

Refactoring may delete dead code, merge redundant implementations, simplify behaviour and reduce file count. Historical file count is not valuable.

---

## LD-005 — Apparent dead code is not sufficient evidence for deletion

**Status:** LOCKED

Imports, exports, consumers, routes, framework behaviour, persistence and other relevant usage must be considered before deletion.

---

## LD-006 — Proven dead code should not be migrated

**Status:** LOCKED

Once confidently obsolete, delete dead legacy code rather than institutionalising it under a new owner.

---

## LD-007 — Major feature expansion remains secondary to the core refactor

**Status:** SUPERSEDED BY LD-268

During active Architecture V2 migration, substantial new product development was intentionally secondary to the refactor. That temporary phase has ended.

---

# PART II — GIT AND PRESERVATION

## LD-008 — Architecture V2 remains in the existing repository

**Status:** LOCKED

The authoritative repository remains `N5-Assessment-Tool`. Do not create a separate replacement repository as the normal strategy.

---

## LD-009 — Active refactor branch

**Status:** LOCKED WORKING-BRANCH RECORD

The working branch established for Architecture V2 is:

```text
refactor/architecture-V2
```

It remains the current development branch until deliberately changed/merged.

---

## LD-010 — `main` remains known-good

**Status:** LOCKED

Do not casually perform active experimental/refactor work directly on `main`.

---

## LD-011 — The archive branch is frozen

**Status:** LOCKED

`archive/25-08-2026-baseline` is a preservation reference, not a development branch.

---

## LD-012 — The offline project copy is a preservation layer

**Status:** LOCKED

The manually created Windows backup must not become the normal working copy.

---

## LD-013 — Prefer bounded commits

**Status:** LOCKED

Meaningful successful migrations/features should be committed in understandable stages.

---

# PART III — SOURCE MIGRATION MODEL

## LD-014 — Migrated application source belongs beneath `src`

**Status:** SUPERSEDED BY LD-251

The original V2 plan used `src/` as the target source root. The final architecture instead uses root `app/`.

---

## LD-015 — No duplicate V2 application repository

**Status:** LOCKED

Do not maintain parallel complete V1 and V2 application folders as competing working copies.

---

## LD-016 — Historical root source is legacy architecture

**Status:** SUPERSEDED BY LD-251

This recorded the earlier migration model in which root source was transitional. The final runtime source root is now `app/`.

---

## LD-017 — Legacy source remains in place until safely migrated

**Status:** LOCKED PROCESS PRINCIPLE

Do not mechanically move all legacy code into a `Legacy/` wrapper. Replace/migrate by responsibility and delete only when safe.

---

## LD-018 — Legacy hiding is visual only

**Status:** LOCKED WORKFLOW

VS Code `files.exclude` may hide legacy areas when useful. It must not alter source, Git, imports or runtime behaviour.

---

## LD-019 — `src` is the V2 construction area

**Status:** SUPERSEDED BY LD-251

The temporary `src/` construction strategy was retired in favour of root `app/` ownership.

---

## LD-020 — Permanent V1/V2 duplication is prohibited

**Status:** LOCKED

Temporary adapters are acceptable. Permanent duplicate authorities are not.

---

# PART IV — TOP-LEVEL REPOSITORY STRUCTURE

## LD-021 — Core V2 application domains are explicit

**Status:** SUPERSEDED BY LD-252 AND LD-275

The original domain model established explicit product owners. The final root `app/` domain list is defined by later decisions and now includes `MyAssessments`.

---

## LD-022 — New top-level domains require genuine ownership

**Status:** LOCKED

Do not create top-level folders merely to solve local organisational problems.

---

## LD-023 — No speculative feature folders

**Status:** LOCKED

Do not pre-create empty architecture for hypothetical Scanning, OCR, AI marking, Analytics or other future capabilities. Record future ideas in `Docs/FutureFeatures.md` until implementation requires an owner.

---

## LD-024 — Architecture documentation belongs in `Docs`

**Status:** SUPERSEDED IN DOCUMENT SET BY LD-269; PRINCIPLE RETAINED

Canonical project documentation belongs beneath `Docs/`. The original five-file set has been expanded deliberately by LD-269.

---

## LD-025 — `AGENTS.md` remains at repository root

**Status:** LOCKED

It is the mandatory development entry-point contract.

---

## LD-026 — `public/` remains repository infrastructure

**Status:** LOCKED

Do not move Next.js public assets merely for structural symmetry.

---

## LD-027 — Repository maintenance tooling belongs under root `Tools`

**Status:** LOCKED CONCEPT; CLARIFIED BY LD-270

If enduring repository-level migration/validation/maintenance tooling is required, root `Tools/` is the approved owner. The folder does not need to exist when no enduring tooling exists.

---

## LD-028 — Runtime developer features are not repository maintenance tools

**Status:** LOCKED

Application-based developer/testing features and repository maintenance scripts are separate responsibilities.

---

# PART V — NAMING

## LD-029 — PascalCase is the default architectural naming convention

**Status:** LOCKED

Use PascalCase for project-owned architectural folders and descriptive source modules where practical.

---

## LD-030 — Hooks use `useCamelCase`

**Status:** LOCKED

Example: `useAssessmentProgressRows.ts`.

---

## LD-031 — Route folders may use URL-compatible casing

**Status:** LOCKED

Real Next.js URL segments may remain lowercase or kebab-case.

---

## LD-032 — Number folders only where order is meaningful

**Status:** LOCKED

Numbering may communicate genuine curriculum or visual order.

---

## LD-033 — Decorative numbering is rejected

**Status:** LOCKED

Do not number unrelated domains merely to control Explorer sorting.

---

## LD-034 — Ordered-folder format is `number-name`

**Status:** LOCKED

Where meaningful ordering genuinely exists, use forms such as `01-Numerical`.

---

## LD-035 — Folder context should reduce unnecessary repetition

**Status:** LOCKED

Do not repeat the complete parent-folder name in every child filename without reason.

---

## LD-036 — Region root components may repeat meaningful context

**Status:** LOCKED

A main component may reflect its owning region where this improves clarity, e.g. `AssessmentTopBar` or `AssessmentHUDBar`.

---

## LD-037 — Generic dumping-ground folders are prohibited by default

**Status:** LOCKED

Avoid `Helpers`, `Utils`, `Shared`, `Common`, `Misc`, `General` without real architectural justification.

---

## LD-038 — Legacy generic buckets must be dismantled by ownership

**Status:** LOCKED — IMPLEMENTED BY LD-258

Do not recreate historical generic buckets such as `shared-types` or `math-helpers` under a new source root.

---

## LD-039 — Types live with their owners

**Status:** LOCKED

Assessment types belong with Assessments, Course types with Courses, Class types with Classes, etc.

---

## LD-040 — Constants live with their owners

**Status:** LOCKED

Avoid giant generic constant files unless values are genuinely global.

---

# PART VI — FILE DECOMPOSITION

## LD-041 — Prefer small coherent files

**Status:** LOCKED

A meaningful independently understandable responsibility should normally have a clear source file.

---

## LD-042 — Line count alone does not justify splitting

**Status:** LOCKED

Split by responsibility, not arbitrary length.

---

## LD-043 — Do not create a subfolder for every file

**Status:** LOCKED

Create a subfolder when a responsibility has enough related implementation to justify one.

---

## LD-044 — Large visible regions should decompose by recognisable features

**Status:** LOCKED

Controls/features should not remain permanently entangled solely because they began in one large component.

---

## LD-045 — Historical hooks are not automatically permanent abstractions

**Status:** LOCKED

Historical `UseBuilder...` fragmentation must be judged by real responsibility, not preserved automatically.

---

# PART VII — ROUTING

## LD-046 — `src/app` is the target framework/routing layer

**Status:** SUPERSEDED BY LD-253 AND LD-267

The final architecture uses root `app/` and a centralised rewrite/dispatcher model.

---

## LD-047 — `page.tsx` is thin

**Status:** LOCKED

Substantial feature implementation must not live permanently inside a giant route file.

---

## LD-048 — Substantial pages have descriptive implementation names

**Status:** LOCKED

Examples include `HomePage`, `AssessmentSetupPage`, `AssessmentCreatorPage`, `AssessmentCompilationPage`, `MyAssessmentsPage`, `MyClassesPage` and `ClassDetailsPage`.

---

## LD-049 — Never give ambiguous `page.tsx` instructions

**Status:** LOCKED

Always use the complete repository-relative path or descriptive implementation filename.

---

## LD-050 — Root `app` → `src/app` migration is deliberate

**Status:** SUPERSEDED BY LD-251 / LD-253 / LD-267

The planned `src/app` migration was abandoned. Root `app/` is authoritative.

---

## LD-051 — Internal Builder cleanup does not automatically rename public routes

**Status:** LOCKED

URL changes are separate routing/product decisions.

---

# PART VIII — UI VOCABULARY

## LD-052 — Global website navigation is `HeaderBar`

**Status:** LOCKED

---

## LD-053 — Assessment Creation upper controls are `TopBar`

**Status:** LOCKED

---

## LD-054 — Assessment Creation lower region is `HUDBar`

**Status:** LOCKED

---

## LD-055 — Left Assessment Creation region is `SkillsPanel`

**Status:** LOCKED

---

## LD-056 — Central assessment surface is `PaperWorkspace`

**Status:** LOCKED

---

## LD-057 — `PDFWorkspace` is rejected

**Status:** LOCKED

Product terminology must not depend on current rendering technology.

---

## LD-058 — The whole creation screen is not `WorkspacePage`

**Status:** LOCKED

The page is `AssessmentCreatorPage`; the central region is `PaperWorkspace`.

---

## LD-059 — `Panel` means a substantial persistent region

**Status:** LOCKED VOCABULARY

---

## LD-060 — `Drawer` means a substantial edge-opening region

**Status:** LOCKED VOCABULARY

---

## LD-061 — `Popover` means a small anchored contextual region

**Status:** LOCKED VOCABULARY

---

## LD-062 — `Control` means an element which changes state/value

**Status:** LOCKED VOCABULARY

---

## LD-063 — `Filter` restricts/selects displayed or available information

**Status:** LOCKED VOCABULARY

---

## LD-064 — `Field` means editable data input

**Status:** LOCKED VOCABULARY

---

## LD-065 — `Pill` means compact pill-shaped selection/state UI

**Status:** LOCKED VOCABULARY

---

## LD-066 — `Picker` means a dedicated selection interface

**Status:** LOCKED VOCABULARY

---

## LD-067 — `Status` / `Indicator` display state

**Status:** LOCKED VOCABULARY

---

## LD-068 — `Modal` means a blocking foreground dialog

**Status:** LOCKED VOCABULARY

---

## LD-069 — Established vocabulary should not drift into casual synonyms

**Status:** LOCKED; `Tray` EXCEPTION DEFINED BY LD-271

Avoid introducing arbitrary `Flyout`, `Popup`, `MiniDrawer`, `Ribbon`, `Widget` or `Sidebar` terminology where an established term already applies. `Preview Tray` is now an explicitly approved product term under LD-271.

---

# PART IX — ASSESSMENT CREATION

## LD-070 — `Builder` is deprecated domain terminology

**Status:** LOCKED

Do not use `Builder` as the permanent source identity of Assessment Creation. Historical public URLs/persistence may retain it for compatibility.

---

## LD-071 — No blind global Builder rename

**Status:** LOCKED

Each historical `Builder...` responsibility must be understood and renamed according to its true owner.

---

## LD-072 — Canonical creation implementation is `AssessmentCreatorPage.tsx`

**Status:** SUPERSEDED IN PATH BY LD-254; CONCEPT RETAINED

The canonical current location is defined by LD-254.

---

## LD-073 — Assessment Creation major ownership structure is stable

**Status:** LOCKED AT CONCEPTUAL LEVEL

The established ownership model includes Setup, TopBar, SkillsPanel, PaperWorkspace, HUDBar, AssessmentSettings, Questions, Papers, Analysis and Persistence beneath `app/Assessments/Creation/`.

Substructure may evolve without reopening the major ownership model.

---

## LD-074 — Visible Assessment Creation UI is primarily organised by physical product region

**Status:** LOCKED

---

## LD-075 — Shared domain behaviour is not duplicated by physical region

**Status:** LOCKED

Physical UI organisation must not create competing state or business logic.

---

# PART X — TOPBAR

## LD-076 — TopBar and HeaderBar are separate responsibilities

**Status:** LOCKED

---

## LD-077 — TopBar owns page-specific upper controls

**Status:** LOCKED

Current examples include Assessment Name, Class, Assessment Date and viewed Paper. Preview-specific zoom/navigation controls may be owned by the preview/workspace where that better matches current UI.

---

## LD-078 — TopBar does not own shared paper-domain logic

**Status:** LOCKED

It consumes shared paper state.

---

## LD-079 — Multi-file TopBar features may receive dedicated subfolders

**Status:** LOCKED DESIGN DIRECTION

Use subfolders where a feature has genuine multi-file responsibility.

---

# PART XI — SKILLS PANEL

## LD-080 — SkillsPanel may use meaningful visual ordering

**Status:** LOCKED

Meaningful numbering may remain where it communicates real visual/curriculum order.

---

## LD-081 — SkillsFilters owns generic assessment filtering interaction

**Status:** LOCKED

---

## LD-082 — Assessment SkillsTree owns generic rendering/interaction

**Status:** LOCKED

---

## LD-083 — Assessment SkillsTree UI does not own Course curriculum data

**Status:** LOCKED

The active Course supplies curriculum definition.

---

# PART XII — PAPER WORKSPACE

## LD-084 — `PaperWorkspace` owns the central working/viewing surface

**Status:** LOCKED — IMPLEMENTED

---

## LD-085 — Workspace-specific controls belong with PaperWorkspace

**Status:** LOCKED

---

## LD-086 — Save-status location follows actual product ownership

**Status:** LOCKED OWNERSHIP PRINCIPLE; CURRENT LOCATION CLARIFIED BY LD-272

Historical location does not determine ownership. The current save-status presentation is preview-owned rather than HUD-owned.

---

## LD-087 — Workspace settings are not global application settings

**Status:** LOCKED

---

## LD-088 — Small workspace contextual settings use a Popover

**Status:** SUPERSEDED FOR CURRENT PREVIEW CONTROLS BY LD-271 AND LD-274

The current shared Settings/View interaction is the Preview Tray rather than the earlier Popover-only direction.

---

# PART XIII — HUDBAR

## LD-089 — Historical BottomHud becomes HUDBar

**Status:** LOCKED — IMPLEMENTED

`BuilderBottomHud` was migrated away from canonical Assessment Creation ownership.

---

## LD-090 — HUDBar owns only genuine lower-region responsibilities

**Status:** LOCKED

Do not mechanically put every historical BottomHud responsibility there.

---

# PART XIV — SETTINGS

## LD-091 — Settings are divided according to what they affect

**Status:** LOCKED

Primary categories remain Global application settings, Assessment settings and Workspace/View settings.

---

## LD-092 — Global settings belong to `UI/Application/SettingsDrawer`

**Status:** SUPERSEDED BY LD-273

Global settings remain Application-owned, but their current canonical interaction is through Application Settings + Shell/Activity Rail rather than the historical SettingsDrawer architecture.

---

## LD-093 — Assessment settings belong to `Assessments/Creation/AssessmentSettings`

**Status:** LOCKED OWNERSHIP PRINCIPLE; CURRENT PRESENTATION CLARIFIED BY LD-274

Assessment-specific settings remain Assessment-owned even when their current UI is surfaced through the Preview Tray.

---

## LD-094 — Workspace settings belong to PaperWorkspace ownership

**Status:** LOCKED

---

## LD-095 — The giant legacy settings implementation must not survive unchanged

**Status:** LOCKED FINDING — SUBSTANTIALLY RESOLVED

Settings responsibilities were split by ownership and current Assessment preview controls moved into the Preview Tray. Remaining compatibility files may be cleaned only after consumer tracing; do not recreate the monolithic legacy settings implementation.

---

## LD-096 — HeaderBar Settings always means global application settings

**Status:** SUPERSEDED IN PRESENTATION BY LD-273; SEMANTIC PRINCIPLE RETAINED

Global settings remain global, but the HeaderBar no longer owns the settings trigger.

---

## LD-097 — Global HeaderBar must not permanently rely on hidden Assessment-specific settings events

**Status:** LOCKED — IMPLEMENTED

The current HeaderBar is independent of Assessment-specific settings events. Its right-hand region is intentionally available for future application/account controls.

---

# PART XV — UI ARCHITECTURE

## LD-098 — There is one top-level UI domain

**Status:** SUPERSEDED IN PATH BY LD-252; CONCEPT RETAINED

The current owner is `app/UI/`.

---

## LD-099 — UI is divided into Application and Documents

**Status:** LOCKED

`UI/Application` and `UI/Documents` remain distinct systems.

---

## LD-100 — `UI/Application` owns teacher-facing application visuals

**Status:** LOCKED

---

## LD-101 — `UI/Documents` owns reusable generated-document visuals

**Status:** LOCKED

---

## LD-102 — Application UI and document UI remain separate visual systems

**Status:** LOCKED

---

## LD-103 — Global visual truth converges beneath UI

**Status:** LOCKED

---

## LD-104 — Course semantic data does not own literal application colours

**Status:** LOCKED

---

## LD-105 — There is one authoritative application theme architecture

**Status:** LOCKED

---

## LD-106 — Competing legacy theme systems must be consolidated

**Status:** LOCKED — IMPLEMENTED/SUBSTANTIALLY CONSOLIDATED

Do not introduce a competing theme authority.

---

## LD-107 — Not every pixel becomes a global token

**Status:** LOCKED

Centralise genuinely reusable visual decisions only.

---

# PART XVI — COURSES

## LD-108 — Course-specific knowledge belongs under `src/Courses`

**Status:** SUPERSEDED IN PATH BY LD-255; CONCEPT RETAINED

---

## LD-109 — Assessment Creation is Course-independent architecture

**Status:** LOCKED

Assessment Creation consumes the active Course. It is not intrinsically a National 5 Maths Builder.

---

## LD-110 — Active Course drives the Skills Tree

**Status:** LOCKED

---

## LD-111 — Course resolution uses an explicit CourseRegistry/equivalent boundary

**Status:** LOCKED AT ARCHITECTURAL LEVEL

---

## LD-112 — A CourseAssessmentConfig/equivalent contract supplies generic consumers

**Status:** LOCKED AT ARCHITECTURAL LEVEL

Generic features should consume a coherent Course contract rather than internal Course files.

---

## LD-113 — Future Courses are sibling implementations

**Status:** LOCKED

---

## LD-114 — Higher Maths must not require cloning Assessment Creation

**Status:** LOCKED

---

## LD-115 — Generic UI should avoid Course-name conditionals

**Status:** LOCKED

Use Course-provided variation where practical.

---

## LD-116 — National 5 Maths remains navigable by meaningful curriculum area

**Status:** LOCKED

---

## LD-117 — Course-specific question generation remains Course-owned

**Status:** LOCKED

---

## LD-118 — Course-specific answer generation remains separate from generic rendering

**Status:** LOCKED

---

## LD-119 — `SourceQuestionCatalog` is approved terminology

**Status:** SUPERSEDED BY LD-256

---

## LD-120 — `SourceMarkingSchemeCatalog` is approved terminology

**Status:** SUPERSEDED BY LD-256

---

# PART XVII — EXAM TERMINOLOGY

## LD-121 — Generic architecture avoids unnecessary awarding-body branding

**Status:** LOCKED

---

## LD-122 — Neutral exam terminology is preferred where genuinely generic

**Status:** LOCKED DIRECTION

Use terms such as `Exam...` where responsibility is truly generic. Qualification-family-specific layers may use their real identity.

---

## LD-123 — `CandidateNumber` is preferred generic terminology

**Status:** LOCKED DIRECTION

---

## LD-124 — `OfficialPastPaper` is preferred where genuinely generic

**Status:** LOCKED DIRECTION

---

## LD-125 — No blind global awarding-body rename

**Status:** LOCKED

Inspect persistence, identifiers, source data and external meaning first.

---

## LD-126 — Neutral naming does not settle legal/content questions

**Status:** LOCKED

Copyright, trademarks, source material and document-design questions require separate review.

---

# PART XVIII — QUESTIONS, PAPERS AND ANALYSIS

## LD-127 — Generic Assessment Creation question workflow belongs under `Questions`

**Status:** LOCKED

---

## LD-128 — Course generation knowledge remains Course-owned

**Status:** LOCKED

---

## LD-129 — Shared assessment-paper behaviour belongs under `Papers`

**Status:** LOCKED

---

## LD-130 — Current-paper state must not be independently duplicated

**Status:** LOCKED

TopBar, PaperWorkspace and HUDBar consume shared state rather than owning competing copies.

---

## LD-131 — Assessment quality/distribution analysis belongs under `Analysis`

**Status:** LOCKED

---

## LD-132 — Analysis modules are named for what they analyse

**Status:** LOCKED

Prefer meaningful names such as TopicBalance, StandardBalance and AssessmentDistribution over generic `BuilderLogic`/`AnalysisHelper` names.

---

# PART XIX — CLASSES

## LD-133 — Class-owned functionality belongs under `src/Classes`

**Status:** SUPERSEDED IN PATH BY LD-255; CONCEPT RETAINED

---

## LD-134 — Assessment Creation consumes Classes but does not own them

**Status:** LOCKED

---

## LD-135 — Do not duplicate Class models for Assessment Creation

**Status:** LOCKED

---

# PART XX — PERSISTENCE

## LD-136 — Persistence has explicit domain ownership

**Status:** LOCKED

---

## LD-137 — Existing localStorage behaviour survives source refactoring

**Status:** LOCKED

---

## LD-138 — Source renames do not automatically rename persistence keys

**Status:** LOCKED

---

## LD-139 — Architecture V2 does not automatically introduce a backend/database

**Status:** LOCKED

A backend/database requires a separate product/architecture decision.

---

## LD-140 — Persistence should be sufficiently isolated for future storage changes

**Status:** LOCKED

Visible application code should not become more tightly coupled to raw storage APIs.

---

# PART XXI — DEPENDENCY AND OWNERSHIP

## LD-141 — Files live with the domain that owns their responsibility

**Status:** LOCKED

---

## LD-142 — Visible components normally belong to their visible region

**Status:** LOCKED

This applies to presentation ownership, not shared business logic.

---

## LD-143 — Shared domain logic is organised by responsibility

**Status:** LOCKED

---

## LD-144 — Courses must not depend on Assessment Creation UI

**Status:** LOCKED

---

## LD-145 — Document UI must not depend on application chrome

**Status:** LOCKED

---

## LD-146 — UI consumes domain meaning rather than redefining it

**Status:** LOCKED

---

## LD-147 — Avoid circular major-domain dependencies

**Status:** LOCKED

Repeated two-way imports are evidence that ownership should be reassessed.

---

## LD-148 — Imports should communicate current ownership

**Status:** LOCKED

Historical compatibility paths may remain only where required; new imports should point to canonical owners.

---

## LD-149 — The import alias should represent current source cleanly

**Status:** LOCKED — IMPLEMENTED BY LD-251

---

## LD-150 — Barrel files are not required everywhere

**Status:** LOCKED

Use `index.ts` only where it establishes a meaningful public module boundary.

---

# PART XXII — DOCUMENT RENDERING

## LD-151 — Shared document-rendering truth belongs under `UI/Documents`

**Status:** LOCKED

When Preview and Compilation share a genuinely generic document rule, prefer one canonical implementation.

---

## LD-152 — Preview is a consumer, not automatically the owner of document rules

**Status:** LOCKED

Historical code found under preview must be reassigned according to actual responsibility.

---

## LD-153 — Rendering technology should not dominate product naming

**Status:** LOCKED

Prefer `PaperWorkspace` to implementation-specific names such as `PDFViewer`.

---

# PART XXIII — ASSESSMENT LIBRARY AND BROADER ASSESSMENT DOMAIN

## LD-154 — Saved-assessment functionality belongs to `Assessments`

**Status:** LOCKED DATA/PERSISTENCE PRINCIPLE; UI OWNERSHIP CLARIFIED BY LD-275

Saved-assessment models and persistence belong to Assessments.

---

## LD-155 — Assessment Creation does not own the complete Assessment Library

**Status:** LOCKED — IMPLEMENTED BY LD-275

---

## LD-156 — Routes expose product domains rather than own them

**Status:** LOCKED

---

# PART XXIV — DEVELOPMENT TOOLING

## LD-157 — Catalogue-hardening scripts are not application architecture

**Status:** LOCKED

Enduring repository tooling belongs outside runtime source; obsolete temporary tools should be deleted. Root `Tools/` is reserved when such tooling genuinely exists (LD-270).

---

## LD-158 — Temporary tooling needs an expiry decision

**Status:** LOCKED

---

## LD-159 — Runtime developer tools may receive an explicit V2 owner

**Status:** SUPERSEDED IN PATH BY LD-257; CONCEPT RETAINED

---

# PART XXV — DOCUMENTATION

## LD-160 — Architecture documentation is part of repository architecture

**Status:** LOCKED

It is persistent project memory, not optional notes.

---

## LD-161 — `Architecture.md` records long-lived architectural intent/current architecture

**Status:** LOCKED

It is not a migration diary.

---

## LD-162 — `LockedDecisions.md` records settled decisions

**Status:** LOCKED

This document is not a work log.

---

## LD-163 — `RepositoryMap.md` records current physical reality

**Status:** LOCKED

---

## LD-164 — `RefactorLedger.md` records migration progress

**Status:** SUPERSEDED IN ACTIVE ROLE BY LD-276; HISTORICAL ROLE RETAINED

The ledger now records completed/historical Architecture V2 migration work rather than acting as the active feature tracker.

---

## LD-165 — `ChatGPTWorkflow.md` records AI-assisted development procedure

**Status:** LOCKED

---

## LD-166 — Significant AI-assisted work begins from repository documentation

**Status:** LOCKED

---

## LD-167 — Architecture must not be rediscovered from legacy source alone

**Status:** LOCKED

---

## LD-168 — Critical rules may be intentionally repeated

**Status:** LOCKED

Duplication is acceptable where it materially improves safe handoff. Avoid unnecessary repetition elsewhere.

---

# PART XXVI — MIGRATION PROCESS

## LD-169 — Major migrations require responsibility mapping

**Status:** LOCKED

At minimum understand current path, purpose, dependencies, consumers, owner, destination, action and risk.

---

## LD-170 — Migration actions are explicit

**Status:** LOCKED

Approved concepts include KEEP, REWRITE, MOVE, RENAME, SPLIT, MERGE, CONSOLIDATE, DELETE, MOVE OUT OF DOMAIN, TEMPORARY ADAPTER and DEFER.

---

## LD-171 — Destination cannot be decided from filename alone

**Status:** LOCKED

Inspect implementation.

---

## LD-172 — Imports and consumers are traced before structural moves/deletion

**Status:** LOCKED

---

## LD-173 — Verify after bounded migrations

**Status:** LOCKED

Do not accumulate many structural changes before TypeScript/build/runtime checks.

---

## LD-174 — User-visible behaviour must be tested where relevant

**Status:** LOCKED

Compilation success alone is insufficient.

---

## LD-175 — Diff review is part of migration completion

**Status:** LOCKED

Check accidental unrelated changes.

---

## LD-176 — RepositoryMap is updated after meaningful structural checkpoints

**Status:** LOCKED

---

## LD-177 — RefactorLedger tracks changing migration status

**Status:** SUPERSEDED FOR CURRENT DEVELOPMENT BY LD-276

This applied during active Architecture V2. Current feature evolution belongs in `FeatureHistory.md`; future ideas belong in `FutureFeatures.md`.

---

## LD-178 — Architecture changes only when architectural truth changes

**Status:** LOCKED

Do not update it after every file move or tiny feature change.

---

## LD-179 — LockedDecisions changes only for actual locked-decision changes/additions

**Status:** LOCKED

---

# PART XXVII — REJECTED APPROACHES

## LD-180 — Rejected: duplicate V2 repository

**Status:** LOCKED REJECTION

---

## LD-181 — Rejected: immediate physical `Legacy/` wrapper

**Status:** LOCKED REJECTION

---

## LD-182 — Rejected: giant generic Assessment Creation `Components/` folder

**Status:** LOCKED REJECTION

Use meaningful product regions and domain owners.

---

## LD-183 — Rejected: permanent Builder architecture

**Status:** LOCKED REJECTION

---

## LD-184 — Rejected: `PDFWorkspace`

**Status:** LOCKED REJECTION

Use `PaperWorkspace`.

---

## LD-185 — Rejected: page-specific workspace settings inside global settings

**Status:** LOCKED REJECTION

---

## LD-186 — Rejected: duplicating National 5 Maths data inside Assessment Creation

**Status:** LOCKED REJECTION

---

## LD-187 — Rejected: recreating generic helpers beneath a new source root

**Status:** LOCKED REJECTION

---

## LD-188 — Rejected: recreating global `SharedTypes`

**Status:** LOCKED REJECTION

---

## LD-189 — Rejected: renaming legacy files before understanding them

**Status:** LOCKED REJECTION

---

## LD-190 — Rejected: preserving every historical file in the name of safety

**Status:** LOCKED REJECTION

Preserve behaviour, not source debris.

---

## LD-191 — Rejected: deletion based on superficial searches

**Status:** LOCKED REJECTION

---

## LD-192 — Rejected: adding a new state library merely for Architecture V2

**Status:** LOCKED

---

## LD-193 — Rejected: speculative architecture for future OCR/AI/scanning/etc.

**Status:** LOCKED REJECTION

---

# PART XXVIII — IMPORTANT LEGACY FINDINGS

Resolved findings remain recorded because their IDs are permanent.

## LD-194 — Assessment Creation's historical route implementation was oversized

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

The substantial implementation now lives at `app/Assessments/Creation/AssessmentCreatorPage.tsx`. Further orchestration decomposition remains appropriate where meaningful.

---

## LD-195 — Legacy BuilderTopBar required decomposition

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

Canonical TopBar ownership now exists under `app/Assessments/Creation/TopBar/`. Do not regress to the legacy monolith.

---

## LD-196 — Legacy BuilderBottomHud responsibilities required reassignment

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

Canonical HUD ownership now exists under `app/Assessments/Creation/HUDBar/`.

---

## LD-197 — Legacy giant SettingsPanel remains a major decomposition target

**Status:** LOCKED FINDING — SUBSTANTIALLY RESOLVED

The active experience has been decomposed into global Application settings and Assessment workspace/Preview Tray controls. Remaining compatibility code should be removed only after proving it unused.

---

## LD-198 — Legacy theme architecture contained competing sources of truth

**Status:** LOCKED FINDING — SUBSTANTIALLY RESOLVED

Do not recreate competing theme ownership.

---

## LD-199 — Legacy `shared-types` requires domain reassignment

**Status:** LOCKED FINDING — RESOLVED BY LD-258

---

## LD-200 — Legacy `math-helpers` is not accepted ownership

**Status:** LOCKED FINDING — RESOLVED BY LD-258

---

## LD-201 — Historical localStorage access was too distributed

**Status:** LOCKED FINDING — ONGOING MAINTENANCE PRINCIPLE

Persistence has clearer domain ownership; further direct-storage cleanup should remain incremental and compatibility-safe rather than being treated as an unfinished whole-repository migration.

---

## LD-202 — Legacy `course-data` mixed responsibilities

**Status:** LOCKED FINDING — RESOLVED BY LD-258

---

## LD-203 — Existing `SourceQuestionCatalog` is a positive precedent

**Status:** SUPERSEDED BY LD-256

---

## LD-204 — Existing `SourceMarkingSchemeCatalog` is a positive precedent

**Status:** SUPERSEDED BY LD-256

---

## LD-205 — Meaningful curriculum-family grouping should be preserved

**Status:** LOCKED

Do not flatten strong Course organisation merely for uniformity.

---

# PART XXIX — FUTURE EXTENSIBILITY

## LD-206 — Higher Maths should be additive rather than invasive

**Status:** LOCKED

A future Higher Course should primarily add a sibling Course implementation.

---

## LD-207 — Extensibility comes from clear boundaries, not placeholder folders

**Status:** LOCKED

---

## LD-208 — Do not over-engineer CourseAssessmentConfig for unknown requirements

**Status:** LOCKED

Model actual product needs.

---

## LD-209 — New abstractions require demonstrated value

**Status:** LOCKED

Do not abstract merely because something could theoretically be reusable.

---

# PART XXX — AI-ASSISTED DEVELOPMENT

## LD-210 — AI inspects current implementation before meaningful edits

**Status:** LOCKED

Documentation does not replace source inspection.

---

## LD-211 — AI must not infer current architecture from historical names

**Status:** LOCKED

---

## LD-212 — AI does not casually relitigate locked conventions

**Status:** LOCKED

---

## LD-213 — AI should identify simplification opportunities

**Status:** LOCKED

Examples include dead code, duplication, misplaced ownership and obsolete adapters.

---

## LD-214 — Proposal is not approval

**Status:** LOCKED

A suggested architecture becomes locked only through explicit approval.

---

## LD-215 — AI uses exact repository-relative file paths

**Status:** LOCKED

Avoid ambiguous `page.tsx`, `types.ts`, etc.

---

## LD-216 — AI must not invent repository structure

**Status:** LOCKED

Inspect current physical structure when it matters.

---

## LD-217 — Target architecture and current physical repository remain distinct concepts during migration

**Status:** LOCKED HISTORICAL/STRUCTURAL PRINCIPLE

During structural work, distinguish intended target state from current physical state until the migration is actually complete.

---

# PART XXXI — CHANGE CONTROL

## LD-218 — Locked decisions change only through explicit approval

**Status:** LOCKED

Silence and implementation convenience are not approval.

---

## LD-219 — Superseded decisions retain their IDs/history

**Status:** LOCKED

---

## LD-220 — New architectural decisions receive new IDs

**Status:** LOCKED

Continue numbering from the current highest ID.

---

## LD-221 — Approved architecture changes require documentation synchronisation

**Status:** LOCKED; EXPANDED BY LD-269 AND LD-276

Update the relevant Architecture, Locked Decisions, Repository Map and historical/current feature documentation as appropriate.

---

# PART XXXII — ARCHITECTURE V2 DEFINITION OF DONE

## LD-222 — Root legacy source is transitional

**Status:** LOCKED — IMPLEMENTED BY LD-251 / LD-258

---

## LD-223 — `src` becomes the authoritative application source tree

**Status:** SUPERSEDED BY LD-251

---

## LD-224 — Generic legacy buckets disappear or receive explicit justification

**Status:** LOCKED — IMPLEMENTED BY LD-258

---

## LD-225 — Major route implementations become thin wrappers

**Status:** LOCKED — IMPLEMENTED; ROUTING MODEL CLARIFIED BY LD-267

---

## LD-226 — Global, Assessment and workspace settings gain clear ownership

**Status:** LOCKED — IMPLEMENTED/CLARIFIED BY LD-273 AND LD-274

---

## LD-227 — Global visual truth has no competing authorities

**Status:** LOCKED

---

## LD-228 — Assessment Creation does not fundamentally depend on an N5-specific Skills Tree implementation

**Status:** LOCKED

---

## LD-229 — Product language should lead developers to the correct folder

**Status:** LOCKED SUCCESS CRITERION

Examples:

```text
broken Assessment TopBar
→ app/Assessments/Creation/TopBar

wrong curriculum skill
→ app/Courses/<Course>/Skills

wrong generated-paper primitive
→ app/UI/Documents

wrong Course cover content
→ app/Courses/<Course>/Documents

wrong assessment-library presentation
→ app/MyAssessments
```

---

## LD-230 — Architecture V2 reduces dependence on historical memory

**Status:** LOCKED SUCCESS CRITERION — ACHIEVED AS BASELINE

A new developer should be able to reconstruct ownership from repository structure and documentation.

---

# PART XXXIII — GOVERNING PRINCIPLES

## LD-231 — Organise by what the product is

**Status:** LOCKED

Do not organise primarily around how implementation happened historically.

---

## LD-232 — Preserve behaviour, not historical accidents

**Status:** LOCKED

---

## LD-233 — The obvious location should normally be the correct location

**Status:** LOCKED

Repository discoverability is an architectural requirement.

---

## LD-234 — Do not create a second source of truth to solve a local problem

**Status:** LOCKED

Always determine whether an authoritative owner already exists.

---

## LD-235 — Architectural consistency outweighs personal convention preference

**Status:** LOCKED

---

## LD-236 — Architecture should be intentionally predictable

**Status:** LOCKED PRINCIPLE

A developer should not be surprised by where code lives.

---

## LD-237 — New code must strengthen current architecture rather than recreate legacy patterns

**Status:** LOCKED

Do not knowingly create new Builder catch-alls, global helper buckets, duplicate theme systems, giant route implementations, Course-specific generic UI or hidden cross-feature event coupling.

---

## LD-238 — Difficult migration does not automatically invalidate target architecture

**Status:** LOCKED

Investigate whether difficulty is historical coupling.

---

## LD-239 — Genuine technical discoveries may challenge architecture

**Status:** LOCKED

Surface the conflict explicitly rather than drifting silently.

---

## LD-240 — The register is intentionally conservative

**Status:** LOCKED

When uncertain whether an established convention may change, assume it remains locked until explicitly reconsidered.

---

# PART XXXIV — DECISIONS ESTABLISHED DURING ACTIVE V2 MIGRATION

## LD-241 — Prefer write-new migration where practical

**Status:** LOCKED

For a replaceable responsibility, prefer:

```text
WRITE NEW
    ↓
TYPE-CHECK
    ↓
SWITCH CONSUMER
    ↓
VERIFY
    ↓
SEARCH
    ↓
DELETE OLD
```

over repeatedly moving and mutating legacy implementation.

---

## LD-242 — The local working tree is authoritative for uncommitted state

**Status:** LOCKED

Connected GitHub may lag behind local work. When current local migration/feature state is uncommitted, local grep, TypeScript, build and runtime/browser behaviour are authoritative. Remote source is authoritative once refreshed/pushed.

---

## LD-243 — Deletion requires broad symbol-level searching

**Status:** LOCKED

Do not establish deadness from a narrow path-specific search. Search relevant symbol names, component names, filenames, adapters, import paths and route references before deletion.

---

## LD-244 — Whole-file replacement is preferred for normal-sized manual edits

**Status:** LOCKED WORKFLOW

When the user is applying source manually, provide complete replacement contents for normal-sized files. Use surgical edits only when the file is unusually large and the required change is genuinely tiny.

---

## LD-245 — PaperWorkspace is a canonical boundary

**Status:** SUPERSEDED IN PATH BY LD-254; CONCEPT RETAINED

Current canonical ownership is `app/Assessments/Creation/PaperWorkspace/`. It must not casually regain dependencies on retired Builder/generic legacy buckets.

---

## LD-246 — Generated-document architecture uses layered ownership

**Status:** LOCKED

Dependency model:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment Preview / Compilation consumers
```

Each layer owns only knowledge appropriate to that level.

---

## LD-247 — Course Documents expose an explicit Course-owned bundle

**Status:** SUPERSEDED IN PATH BY LD-259; CONCEPT RETAINED

Course-specific generated page components are exposed through a coherent Course document boundary.

---

## LD-248 — Compilation is a separate Assessment responsibility from Creation

**Status:** SUPERSEDED IN PATH BY LD-259; CONCEPT RETAINED

Creation owns interactive building. Compilation owns final paginated/generated document composition.

---

## LD-249 — Physical document refactors require visual verification

**Status:** LOCKED

A clean TypeScript result cannot establish visual preservation of cover pages, formula sheets, question pages, page frames, margins, corner marks, scaling or spacing.

---

## LD-250 — Documentation updates occur at meaningful checkpoints

**Status:** LOCKED WORKFLOW

Do not interrupt every tiny change with documentation edits. Update persistent docs when a meaningful owner/feature/migration/decision/handoff boundary is reached.

---

# PART XXXV — ARCHITECTURE V2 FINAL-STATE DECISIONS

## LD-251 — Root `app/` is the authoritative runtime application source tree

**Status:** LOCKED — IMPLEMENTED

The authoritative runtime source container is `app/`. There is no separate runtime `src/` tree. This supersedes LD-014, LD-016, LD-019, LD-050 and LD-223.

---

## LD-252 — Product ownership domains live directly beneath root `app/`

**Status:** LOCKED — IMPLEMENTED; DOMAIN LIST EXPANDED BY LD-275

The original final-state principal domains were Assessments, Classes, Courses, DeveloperTools and UI. `MyAssessments` was subsequently promoted to a genuine first-class root owner by LD-275.

---

## LD-253 — Public routes use a thin dispatcher rather than shadow feature trees

**Status:** SUPERSEDED IN PHYSICAL ROUTING DETAIL BY LD-267; PRINCIPLE RETAINED

The key principle remains: public URLs dispatch to product-owned implementations without recreating route-shaped feature trees.

---

## LD-254 — Assessment Creation's canonical implementation lives under root `app/Assessments/Creation`

**Status:** LOCKED — IMPLEMENTED

Canonical entry points are:

```text
app/Assessments/Creation/AssessmentSetupPage.tsx
app/Assessments/Creation/AssessmentCreatorPage.tsx
```

The established ownership model includes Analysis, AssessmentSettings, Feedback, HUDBar, Papers, PaperWorkspace, Persistence, Questions, Setup, SkillsPanel and TopBar.

---

## LD-255 — Courses and Classes use root `app/` ownership

**Status:** LOCKED — IMPLEMENTED

Course-specific knowledge belongs beneath `app/Courses/`; Class-owned functionality beneath `app/Classes/`; Course implementations beneath `app/Courses/<Course>/`.

---

## LD-256 — Current historical-exam terminology is ExamQuestion / ExamMarkingScheme

**Status:** LOCKED — IMPLEMENTED

Historical National 5 Maths exam evidence is owned by `app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/` with current terminology `ExamQuestion`, `ExamMarkingScheme`, `ExamQuestionAndAnswerCatalog`. This supersedes LD-119, LD-120, LD-203 and LD-204.

---

## LD-257 — Runtime Developer Tools live under `app/DeveloperTools`; repository tooling is separate

**Status:** LOCKED — IMPLEMENTED; ROOT TOOLING EXISTENCE CLARIFIED BY LD-270

Runtime developer-facing application functionality belongs beneath `app/DeveloperTools/`. Repository tooling, when genuinely required, is not runtime application source.

---

## LD-258 — Root generic legacy source buckets are retired

**Status:** LOCKED — IMPLEMENTED

Former root buckets such as `shared-types/`, `math-helpers/` and `course-data/` are removed. Their surviving responsibilities were reassigned to explicit owners. Do not recreate renamed equivalents.

---

## LD-259 — Current generated-document and Compilation owners use root `app/` paths

**Status:** LOCKED — IMPLEMENTED; PDF PIPELINE EXPANDED BY LD-277

Generic documents live under `app/UI/Documents/`, National 5 Maths Course documents under `app/Courses/National5Maths/Documents/`, and Assessment Compilation under `app/Assessments/Compilation/`.

---

## LD-260 — CourseId has one canonical owner

**Status:** LOCKED — IMPLEMENTED

`CourseId` is defined by `app/Courses/CourseTypes.ts`. Consumers import it directly from Courses. Do not create parallel identity types or convenience re-exports.

---

## LD-261 — Course Registry uses the canonical Course Assessment Config API

**Status:** LOCKED — IMPLEMENTED

Canonical owner: `app/Courses/CourseRegistry.ts`. Canonical terminology includes `COURSE_REGISTRY`, `getCourseAssessmentConfigById`, `getDefaultCourseAssessmentConfig`, `getRegisteredCourseAssessmentConfigs`. Retired shorter aliases must not be reintroduced without demonstrated compatibility need.

---

## LD-262 — Classes resolves Course skills through the Course abstraction

**Status:** LOCKED — IMPLEMENTED

Class coverage resolves `SchoolClass.courseId → CourseRegistry → CourseAssessmentConfig → skillTree`. Classes must not directly depend on National 5 Maths skill data where the Course contract provides the required structure.

---

## LD-263 — The Question Bank architecture is retired

**Status:** LOCKED — IMPLEMENTED

The former `app/question-bank/` architecture has been removed. Live generation belongs beneath `app/Courses/National5Maths/QuestionAndAnswerGeneration/`. Do not recreate a parallel Question Bank.

---

## LD-264 — `"use client"` marks genuine client entry boundaries only

**Status:** LOCKED — IMPLEMENTED

Do not add `"use client"` to internal hooks/child components merely because they use hooks, browser APIs or event handlers. A module imported beneath an existing client boundary inherits that environment. Do not add the directive defensively.

---

## LD-265 — Historical paths remain valid inside the Refactor Ledger when they describe history

**Status:** LOCKED

Do not blindly rewrite earlier `src/...`, Builder or old-route paths inside `Docs/RefactorLedger.md` when historically accurate. Current-state documents must describe current root `app/` architecture.

---

## LD-266 — Next.js special filenames inside product architecture require deliberate framework intent

**Status:** LOCKED

Inside `app/`, `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `default.tsx` and similar filenames must be introduced deliberately. Ordinary product implementations use descriptive names unless defining real framework behaviour.

---

## LD-267 — The application uses one application page with centralised public-route rewrites

**Status:** LOCKED — IMPLEMENTED

The runtime App Router surface is intentionally minimal:

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

Public URLs are preserved through rewrites in `next.config.ts`, which dispatch into `app/page.tsx` as the thin application routing adapter. Product implementation remains beneath owning domains rather than route-shaped feature trees.

Historical internal rewrite parameter names are compatibility details and do not define current product branding.

---

# PART XXXVI — POST-REFACTOR CURRENT-STATE DECISIONS

## LD-268 — Architecture V2 is substantially complete; feature-led development is now the default

**Status:** LOCKED — CURRENT PHASE

Architecture V2's broad repository migration has reached its intended baseline. Development should now default to feature development, feature refinement and targeted maintenance/refactor rather than treating the whole repository as an unfinished migration.

Structural work remains appropriate when a real ownership/dependency problem exists, but it is no longer the automatic priority over product work.

This supersedes the temporary active-refactor constraint in LD-007.

---

## LD-269 — Project documentation includes separate Feature History and Future Features records

**Status:** LOCKED — IMPLEMENTED BY DOCUMENTATION RESET

The canonical documentation model is:

```text
Docs/Architecture.md
→ current architecture

Docs/RepositoryMap.md
→ current physical repository map

Docs/LockedDecisions.md
→ settled decisions

Docs/ChatGPTWorkflow.md
→ AI-assisted development workflow

Docs/RefactorLedger.md
→ Architecture V2 migration history

Docs/FeatureHistory.md
→ meaningful implemented feature/technical changes

Docs/FutureFeatures.md
→ future ideas, planned work and deferred concepts

AGENTS.md
→ first-read repository instructions
```

`FutureFeatures.md` is a memory/backlog, not approval to implement an idea.

This expands/supersedes the original document set in LD-024 and clarifies LD-221.

---

## LD-270 — A repository-level `Tools/` folder is optional until enduring tooling exists

**Status:** LOCKED

There is currently no permanent root `Tools/` directory, because historical one-off migration tooling was removed after completion.

If enduring repository maintenance/validation/migration tooling is later required, root `Tools/` remains the approved owner.

Do not create the directory merely to satisfy symmetry or preserve obsolete scripts.

This clarifies LD-027, LD-157 and LD-257.

---

## LD-271 — `Preview Tray` is approved terminology for the shared preview-edge pull-out interface

**Status:** LOCKED — IMPLEMENTED

The Assessment Creator's shared right-edge binder-style pull-out interface is named the `Preview Tray`.

It currently contains `Settings` and `View` tabs which move as one tray.

`Tray` is therefore an intentional exception to the synonym-avoidance guidance in LD-069 and supersedes the Popover-only direction of LD-088 for these controls.

Do not rename it to Drawer/Popover merely for vocabulary uniformity; its interaction model is distinct.

---

## LD-272 — Assessment save status is preview-owned and displayed at the lower-left of the PDF preview

**Status:** LOCKED — IMPLEMENTED

The save-status UI no longer belongs in the HUDBar.

It is an Assessment Creation preview/workspace status presentation, currently shown at the lower-left of the PDF preview with Saving/Saved/Failed behaviour.

The underlying persistence owner remains `app/Assessments/Creation/Persistence/`.

This clarifies/supersedes the historical possible HUD location in LD-086.

---

## LD-273 — Global application settings are surfaced through the Application Activity Rail

**Status:** LOCKED — IMPLEMENTED

Global settings remain owned by `app/UI/Application/`, but the current canonical interaction is the global Activity Rail/Shell:

```text
app/UI/Application/Shell/ApplicationActivityRail.tsx
        ↓
app/UI/Application/Settings/GlobalSettingsPanel.tsx
```

The settings panel overlays page content and uses a focus backdrop rather than pushing feature layout.

The HeaderBar no longer owns the Settings trigger; its right-hand region is deliberately reserved for future application/account controls.

This supersedes the historical SettingsDrawer presentation in LD-092 and HeaderBar Settings presentation in LD-096 while preserving LD-091's global-vs-assessment separation.

Remaining `SettingsDrawer/` files are compatibility/implementation remnants unless still consumed; they are not the preferred owner for new global settings work.

---

## LD-274 — Assessment Settings/View controls are surfaced through the Preview Tray while remaining Assessment-owned

**Status:** LOCKED — IMPLEMENTED

Assessment-specific paper/content/sitting controls and workspace view controls are surfaced through the Preview Tray.

Settings currently covers paper-content and sitting concerns such as cover/formula/date-time/candidate-number and per-paper date/time controls.

View currently covers Compact/Exam/Answers, HUD visibility and reset actions.

This presentation does not move Assessment settings into global Application settings.

This clarifies LD-093 and LD-094 and supersedes LD-088 for the current preview control surface.

---

## LD-275 — `app/MyAssessments/` is a first-class product owner for the assessment-library UI/workflow

**Status:** LOCKED — IMPLEMENTED

The user-facing saved-assessment library now belongs beneath:

```text
app/MyAssessments/
```

Current sub-owners include Actions, Display, Library, ListView, Preview, TileView and Toolbar.

`app/Assessments/SavedAssessments/` continues to own persisted saved-assessment data/contracts.

`app/Assessments/Compilation/PDF/` continues to own generated PDF assets/pipeline.

My Assessments consumes those owners rather than duplicating them.

This expands the root-domain list in LD-252 and implements/clarifies LD-154 and LD-155.

---

## LD-276 — Refactor history, implemented feature history and future ideas are separate records

**Status:** LOCKED

`Docs/RefactorLedger.md` is now a historical Architecture V2 migration record and should not be used as the active feature change log.

`Docs/FeatureHistory.md` records meaningful implemented product/technical changes after/around the completion boundary.

`Docs/FutureFeatures.md` records ideas, planned work and deferred concepts which should not be forgotten.

Do not rewrite historically correct Refactor Ledger entries merely to make them look current.

This supersedes the active-progress role in LD-164/LD-177 while preserving the Ledger's historical purpose.

---

## LD-277 — Assessment PDF generation has one canonical Compilation-owned pipeline

**Status:** LOCKED — IMPLEMENTED

Assessment PDF generation belongs beneath:

```text
app/Assessments/Compilation/PDF/
```

Conceptual pipeline:

```text
SavedAssessment
      ↓
buildAssessmentCompilationDocument
      ↓
canonical rendered assessment document
      ↓
standalone HTML + embedded KaTeX assets
      ↓
headless Chromium / Puppeteer
      ↓
PDF bytes
```

The server generation route remains Compilation-owned.

Client generated-PDF caching belongs beneath `app/Assessments/Compilation/PDF/Client/`.

My Assessments PDF tile/list/modal previews reuse generated PDF assets and must not create a second independent assessment-PDF renderer/generator.

This extends LD-246 and LD-259.

---

## LD-278 — The application UI follows the established compact workbench design direction

**Status:** LOCKED DESIGN DIRECTION

Interactive application UI should normally preserve the established direction:

- compact desktop/workbench presentation;
- restrained neutral/dark surfaces;
- thin borders;
- modest approximately 4–6px radii for most controls/panels;
- restrained blue accent;
- clear hierarchy and deliberate information density;
- consistent behaviour across Dark, Soft Grey, Light, System and Custom appearance modes.

This is application UI guidance, not generated-document styling guidance.

---

## LD-279 — Historical internal names do not establish current product branding

**Status:** LOCKED

Do not introduce a product/brand name from historical repository identifiers, internal rewrite parameters, persistence keys, old documentation headings or previous exploratory naming.

Current code/documentation should use neutral project/product terminology unless the user explicitly establishes a brand later.

Historical compatibility identifiers may remain where changing them would risk persistence/routing behaviour.

---

# 4. Quick Reference

```text
PRESERVE WORKING BEHAVIOUR.

ARCHITECTURE V2 IS THE CURRENT BASELINE; FEATURE-LED DEVELOPMENT IS NOW DEFAULT.

ROOT app/ IS THE AUTHORITATIVE RUNTIME SOURCE.

DO NOT RECREATE A src/ APPLICATION TREE.

OWNERSHIP DETERMINES LOCATION.

MYASSESSMENTS OWNS LIBRARY UI; SAVEDASSESSMENTS OWNS PERSISTED DATA.

PUBLIC ROUTES USE CENTRAL REWRITES + THIN app/page.tsx DISPATCH.

BUILDER IS HISTORICAL/COMPATIBILITY TERMINOLOGY, NOT SOURCE ARCHITECTURE.

ASSESSMENT CREATION IS COURSE-INDEPENDENT.

COURSES OWN EDUCATIONAL KNOWLEDGE.

CLASSES RESOLVES COURSE SKILLS THROUGH COURSE CONFIGURATION.

QUESTION BANK IS RETIRED.

"USE CLIENT" BELONGS ONLY AT GENUINE CLIENT ENTRY BOUNDARIES.

APPLICATION UI AND DOCUMENT UI ARE SEPARATE SYSTEMS.

PREVIEW TRAY IS THE APPROVED ASSESSMENT PREVIEW SETTINGS/VIEW INTERFACE.

GLOBAL SETTINGS LIVE IN APPLICATION SETTINGS/SHELL AND OPEN FROM THE ACTIVITY RAIL.

PDF GENERATION IS COMPILATION-OWNED AND REUSED BY LIBRARY PREVIEWS.

DOCUMENTS USE GENERIC → TEMPLATE → COURSE → CONSUMER LAYERS.

PERSISTENCE HAS EXPLICIT OWNERSHIP.

DO NOT CREATE SECOND SOURCES OF TRUTH.

DO NOT CREATE SPECULATIVE SOURCE ARCHITECTURE; RECORD IDEAS IN FutureFeatures.md.

LOCAL WORKING STATE IS AUTHORITATIVE WHILE UNCOMMITTED; REFRESHED GITHUB IS AUTHORITATIVE REMOTE STATE.

VERIFY TYPES, BUILD WHERE APPROPRIATE, AND TEST RELEVANT USER BEHAVIOUR.

UPDATE DOCUMENTATION AT MEANINGFUL CHECKPOINTS.

DO NOT INFER CURRENT PRODUCT BRANDING FROM HISTORICAL IDENTIFIERS.

WHEN A LOCKED RULE GENUINELY FAILS, SURFACE THE CONFLICT RATHER THAN DRIFTING.
```

---

# 5. Final Rule

A future developer or AI assistant should treat this register as settled project memory, not a list of suggestions to reconsider.

The architecture may evolve deliberately through explicit decisions and evidence. It must not drift accidentally.
