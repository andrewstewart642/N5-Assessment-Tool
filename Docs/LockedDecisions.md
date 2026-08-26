# VecEd Locked Decisions

**Document type:** Binding architectural decision register  

**Architecture version:** Architecture V2  

**Status:** Active  

**Applies to:** All VecEd development unless explicitly amended by the user

**Purpose:** Preserve settled architectural decisions between development sessions

---

# 1. Purpose

This document records decisions which have already been considered and approved.

A decision marked:

```text

LOCKED

```

is not a suggestion or brainstorming prompt.

Future development should follow it unless:

- the user explicitly requests reconsideration; or

- new technical evidence demonstrates a material conflict.

Legacy implementation which disagrees with a locked decision is normally migration input, not evidence that the locked decision is wrong.

---

# 2. Documentation Precedence

Use this precedence for VecEd-specific decisions:

```text

1. Explicit current user instruction

2. AGENTS.md

3. Docs/LockedDecisions.md

4. Docs/Architecture.md

5. Docs/RepositoryMap.md

6. Docs/RefactorLedger.md

7. Current source implementation

8. Historical implementation convention

```

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

If a decision is replaced:

```text

Status: SUPERSEDED

```

must be recorded on the original decision and the replacement must receive a new ID.

---

# PART I — REFACTOR PURPOSE AND SAFETY

## LD-001 — Architecture V2 is a repository-wide architectural refactor

**Status:** LOCKED

Architecture V2 restructures ownership, naming, dependencies, UI, Courses, persistence, state and repository organisation.

It is not cosmetic folder tidying.

---

## LD-002 — Preservation is acceptance criterion zero

**Status:** LOCKED

Existing working behaviour must be preserved unless a product change is explicitly approved.

A cleaner architecture which removes working functionality is a failed migration.

---

## LD-003 — Architecture V2 proceeds in bounded stages

**Status:** LOCKED

Do not perform one uncontrolled repository-wide migration.

Use bounded, independently verifiable responsibility migrations.

---

## LD-004 — Refactoring may reduce code

**Status:** LOCKED

Architecture V2 may delete dead code, merge redundant implementations, simplify behaviour and reduce file count.

Historical file count is not valuable.

---

## LD-005 — Apparent dead code is not sufficient evidence for deletion

**Status:** LOCKED

Imports, exports, consumers, routes, framework behaviour, persistence and other relevant usage must be considered before deletion.

---

## LD-006 — Proven dead code should not be migrated

**Status:** LOCKED

Once confidently obsolete, delete legacy code rather than institutionalising it under V2.

---

## LD-007 — Major feature expansion remains secondary to the core refactor

**Status:** LOCKED FOR CURRENT REFACTOR

Substantial new product development remains paused unless explicitly prioritised over Architecture V2.

---

# PART II — GIT AND PRESERVATION

## LD-008 — Architecture V2 remains in the existing repository

**Status:** LOCKED

The authoritative repository remains:

```text

N5-Assessment-Tool

```

Do not create a separate replacement repository as the normal strategy.

---

## LD-009 — Active refactor branch

**Status:** LOCKED FOR CURRENT REFACTOR

Architecture V2 work occurs on:

```text

refactor/architecture-V2

```

until deliberately changed.

---

## LD-010 — `main` remains known-good

**Status:** LOCKED

Do not perform the active Architecture V2 refactor directly on `main`.

---

## LD-011 — The archive branch is frozen

**Status:** LOCKED

```text

archive/25-08-2026-baseline

```

is a preservation reference, not a development branch.

---

## LD-012 — The offline project copy is a preservation layer

**Status:** LOCKED

The manually created Windows backup must not become the normal working copy.

---

## LD-013 — Prefer bounded commits

**Status:** LOCKED

Meaningful successful migrations should be committed in understandable stages.

---

# PART III — SOURCE MIGRATION MODEL

## LD-014 — Migrated application source belongs beneath `src`

**Status:** SUPERSEDED BY LD-251

Architecture V2 application source progressively converges beneath:

```text

src/

```

---

## LD-015 — No duplicate V2 application repository

**Status:** LOCKED

Do not maintain parallel complete V1 and V2 application folders as competing working copies.

---

## LD-016 — Historical root source is legacy architecture

**Status:** SUPERSEDED BY LD-251

Historical locations such as:

```text

app/

course-data/

math-helpers/

page-sections/

shared-types/

```

remain transitional unless specifically retained for framework/infrastructure reasons.

---

## LD-017 — Legacy source remains in place until safely migrated

**Status:** LOCKED

Do not mechanically move all historical code beneath a `Legacy/` directory.

---

## LD-018 — Legacy hiding is visual only

**Status:** LOCKED FOR CURRENT WORKFLOW

VS Code `files.exclude` may hide legacy areas.

It must not alter source, Git, imports or runtime behaviour.

---

## LD-019 — `src` is the V2 construction area

**Status:** SUPERSEDED BY LD-251

V2 grows while legacy ownership shrinks.

---

## LD-020 — Permanent V1/V2 duplication is prohibited

**Status:** LOCKED

Temporary adapters are acceptable.

Permanent duplicate authorities are not.

---

# PART IV — TOP-LEVEL REPOSITORY STRUCTURE

## LD-021 — Core V2 application domains are explicit

**Status:** SUPERSEDED BY LD-252

The principal source domains are:

src/

├── app/

├── Assessments/

├── Classes/

├── Courses/

└── UI/

A runtime development domain such as:

src/DeveloperTools/

may be introduced only if genuine developer-facing application functionality

requires an independent owner.

It is not a mandatory core domain.

---

## LD-022 — New top-level domains require genuine ownership

**Status:** LOCKED

Do not create top-level folders merely to solve local organisational problems.

---

## LD-023 — No speculative feature folders

**Status:** LOCKED

Do not pre-create empty architecture for hypothetical:

```text

Scanning

OCR

AI marking

Analytics

```

or other future capabilities.

---

## LD-024 — Architecture documentation belongs in `Docs`

**Status:** LOCKED

Canonical project documentation is:

```text

Docs/

├── Architecture.md

├── LockedDecisions.md

├── RepositoryMap.md

├── RefactorLedger.md

└── ChatGPTWorkflow.md

```

---

## LD-025 — `AGENTS.md` remains at repository root

**Status:** LOCKED

It is the mandatory development entry-point contract.

---

## LD-026 — `public/` remains repository infrastructure

**Status:** LOCKED

Do not move Next.js public assets beneath `src` merely for structural symmetry.

---

## LD-027 — Repository maintenance tooling belongs under root `Tools`

**Status:** LOCKED

Migration, validation, catalogue-processing and maintenance scripts with continuing value belong under:

```text

Tools/

```

---

## LD-028 — Runtime developer features are not repository maintenance tools

**Status:** LOCKED

Application-based developer/testing features and root maintenance scripts are separate responsibilities.

---

# PART V — NAMING

## LD-029 — PascalCase is the default VecEd architectural naming convention

**Status:** LOCKED

Use PascalCase for VecEd-owned folders and descriptive source modules where practical.

---

## LD-030 — Hooks use `useCamelCase`

**Status:** LOCKED

Example:

```text

useAssessmentProgressRows.ts

```

---

## LD-031 — Route folders may use URL-compatible casing

**Status:** LOCKED

Next.js URL segments may remain lowercase or kebab-case.

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

Use:

```text

01-Numerical

```

---

## LD-035 — Folder context should reduce unnecessary repetition

**Status:** LOCKED

Do not repeat the complete parent-folder name in every child filename without reason.

---

## LD-036 — Region root components may repeat meaningful context

**Status:** LOCKED

A main component may reflect its owning region where this improves clarity.

Descriptive names such as:

```text

AssessmentTopBar

AssessmentHUDBar

```

are also valid where the prefix prevents ambiguity outside the folder.

---

## LD-037 — Generic dumping-ground folders are prohibited by default

**Status:** LOCKED

Avoid:

```text

Helpers

Utils

Shared

Common

Misc

General

```

without real architectural justification.

---

## LD-038 — Legacy generic buckets must be dismantled by ownership

**Status:** LOCKED

Do not simply recreate `shared-types` or `math-helpers` beneath `src`.

---

## LD-039 — Types live with their owners

**Status:** LOCKED

Assessment types belong with Assessments, Course types with Courses, Class types with Classes, etc.

---

## LD-040 — Constants live with their owners

**Status:** LOCKED

Avoid giant generic constant files unless the values are genuinely global.

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

Create a subfolder when a responsibility has enough closely related implementation to justify one.

---

## LD-044 — Large visible regions should decompose by recognisable features

**Status:** LOCKED

Controls such as name, date, paper selection and zoom should not remain permanently entangled solely because they began in one large component.

---

## LD-045 — Historical hooks are not automatically permanent abstractions

**Status:** LOCKED

`UseBuilder...` fragmentation must be reconsidered by actual responsibility.

---

# PART VII — ROUTING

## LD-046 — `src/app` is the target framework/routing layer

**Status:** SUPERSEDED BY LD-253

Product implementation belongs in domain-owned files outside the route layer.

---

## LD-047 — `page.tsx` is thin

**Status:** LOCKED

Substantial page implementation must not live permanently inside a giant route file.

---

## LD-048 — Substantial pages have descriptive implementation names

**Status:** LOCKED

Examples:

```text

HomePage

AssessmentSetupPage

AssessmentCreatorPage

AssessmentCompilationPage

ClassesPage

```

---

## LD-049 — Never give ambiguous `page.tsx` instructions

**Status:** LOCKED

Always use the complete repository-relative route path or descriptive implementation filename.

---

## LD-050 — Root `app` → `src/app` migration is deliberate

**Status:** SUPERSEDED BY LD-251 / LD-253

Do not combine routing relocation with unrelated major domain migrations merely for neatness.

---

## LD-051 — Internal Builder cleanup does not automatically rename public routes

**Status:** LOCKED

URL changes are separate routing/product decisions.

---

# PART VIII — VECED UI VOCABULARY

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

The page is:

```text

AssessmentCreatorPage

```

The central region is:

```text

PaperWorkspace

```

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

## LD-069 — Existing VecEd vocabulary should not drift into synonyms

**Status:** LOCKED

Avoid introducing `Tray`, `Flyout`, `Popup`, `MiniDrawer`, `Ribbon`, `Widget` or `Sidebar` where an established VecEd term already applies.

---

# PART IX — ASSESSMENT CREATION

## LD-070 — `Builder` is deprecated V2 domain terminology

**Status:** LOCKED

Do not use `Builder` as the permanent identity of Assessment Creation.

---

## LD-071 — No blind global Builder rename

**Status:** LOCKED

Each historical `Builder...` responsibility must be understood and renamed according to its true owner.

---

## LD-072 — Canonical creation implementation is `AssessmentCreatorPage.tsx`

**Status:** SUPERSEDED IN PATH BY LD-254; CONCEPT RETAINED

Canonical location:

```text

src/Assessments/Creation/AssessmentCreatorPage.tsx

```

---

## LD-073 — Assessment Creation major ownership structure is stable

**Status:** LOCKED AT CONCEPTUAL LEVEL

```text

Creation/

├── AssessmentCreatorPage.tsx

├── AssessmentSetupPage.tsx

├── Setup/

├── TopBar/

├── SkillsPanel/

├── PaperWorkspace/

├── HUDBar/

├── AssessmentSettings/

├── Questions/

├── Papers/

├── Analysis/

└── Persistence/

```

Substructure may evolve without reopening the major ownership model.

---

## LD-074 — Visible Assessment Creation UI is primarily organised by physical product region

**Status:** LOCKED

---

## LD-075 — Shared domain behaviour is not duplicated by physical region

**Status:** LOCKED

Physical UI organisation must not create separate competing state or business logic.

---

# PART X — TOPBAR

## LD-076 — TopBar and HeaderBar are separate responsibilities

**Status:** LOCKED

---

## LD-077 — TopBar owns page-specific upper controls

**Status:** LOCKED

Current examples include:

```text

Assessment Name

Class

Assessment Date

Paper View

Zoom

Page Navigation

```

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

Conceptually:

```text

01-SkillsFilters

02-SkillsTree

```

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

**Status:** LOCKED OWNERSHIP PRINCIPLE

Historical location does not determine ownership.

Current implementation may display save state through HUDBar where that matches the product.

---

## LD-087 — Workspace settings are not global application settings

**Status:** LOCKED

---

## LD-088 — Small workspace contextual settings use a Popover

**Status:** LOCKED PRODUCT TERMINOLOGY

---

# PART XIII — HUDBAR

## LD-089 — Historical BottomHud becomes HUDBar in V2

**Status:** LOCKED — IMPLEMENTED

`BuilderBottomHud` has been migrated away from canonical Assessment Creation ownership.

---

## LD-090 — HUDBar owns only genuine lower-region responsibilities

**Status:** LOCKED

Do not mechanically put every historical BottomHud responsibility there.

---

# PART XIV — SETTINGS

## LD-091 — Settings are divided according to what they affect

**Status:** LOCKED

Primary categories are:

```text

Global application settings

Assessment settings

Workspace settings

```

---

## LD-092 — Global settings belong to `UI/Application/SettingsDrawer`

**Status:** LOCKED

---

## LD-093 — Assessment settings belong to `Assessments/Creation/AssessmentSettings`

**Status:** LOCKED

---

## LD-094 — Workspace settings belong to PaperWorkspace ownership

**Status:** LOCKED

---

## LD-095 — The giant legacy settings implementation must not survive unchanged

**Status:** LOCKED — MIGRATION STILL REQUIRED

It must be decomposed by ownership rather than merely relocated.

---

## LD-096 — HeaderBar Settings always means global application settings

**Status:** LOCKED

---

## LD-097 — Global HeaderBar must not permanently rely on hidden Assessment-specific settings events

**Status:** LOCKED

Transitional compatibility may exist during migration but is not the target architecture.

---

# PART XV — UI ARCHITECTURE

## LD-098 — There is one top-level UI domain

**Status:** SUPERSEDED IN PATH BY LD-252; CONCEPT RETAINED

```text

src/UI/

```

---

## LD-099 — UI is divided into Application and Documents

**Status:** LOCKED

```text

UI/

├── Application/

└── Documents/

```

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

**Status:** LOCKED — SUBSTANTIALLY IMPLEMENTED

Do not introduce a new competing theme authority.

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

Assessment Creation consumes the active Course.

It is not intrinsically a National 5 Maths Builder.

---

## LD-110 — Active Course drives the Skills Tree

**Status:** LOCKED

---

## LD-111 — Course resolution should use an explicit CourseRegistry/equivalent boundary

**Status:** LOCKED AT ARCHITECTURAL LEVEL

---

## LD-112 — A CourseDefinition/equivalent contract supplies generic consumers

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

Use terms such as `Exam...` where the responsibility is truly generic.

Qualification-family-specific layers may use their real qualification-family identity.

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

Prefer meaningful names such as:

```text

TopicBalance

StandardBalance

AssessmentDistribution

```

over `BuilderLogic` or `AnalysisHelper`.

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

---

## LD-140 — Persistence should become sufficiently isolated for future storage changes

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

## LD-148 — Imports should increasingly communicate V2 ownership

**Status:** LOCKED

---

## LD-149 — The import alias should eventually represent V2 source cleanly

**Status:** LOCKED DIRECTION — IMPLEMENTED BY LD-251

Alias migration must happen deliberately when legacy imports no longer make it dangerous.

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

**Status:** LOCKED

---

## LD-155 — Assessment Creation does not own the complete Assessment Library

**Status:** LOCKED

---

## LD-156 — Routes expose product domains rather than own them

**Status:** LOCKED

---

# PART XXIV — DEVELOPMENT TOOLING

## LD-157 — Catalogue-hardening scripts are not application architecture

**Status:** LOCKED

Move enduring tools to root `Tools/` or delete obsolete temporary tools.

---

## LD-158 — Temporary tooling needs an expiry decision

**Status:** LOCKED

---

## LD-159 — Runtime developer tools may receive an explicit V2 owner

**Status:** SUPERSEDED IN PATH BY LD-257; CONCEPT RETAINED

Use:

```text

src/DeveloperTools/

```

only when an actual runtime developer responsibility is migrated.

---

# PART XXV — DOCUMENTATION

## LD-160 — Architecture documentation is part of repository architecture

**Status:** LOCKED

It is persistent project memory, not optional notes.

---

## LD-161 — `Architecture.md` records long-lived architectural intent

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

**Status:** LOCKED

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

Duplication is acceptable where it materially improves safe handoff.

Avoid unnecessary repetition elsewhere.

---

# PART XXVI — MIGRATION PROCESS

## LD-169 — Major migrations require responsibility mapping

**Status:** LOCKED

At minimum understand:

```text

CURRENT PATH

PURPOSE

DEPENDENCIES

CONSUMERS

OWNER

DESTINATION

ACTION

RISK

```

---

## LD-170 — Migration actions are explicit

**Status:** LOCKED

Approved concepts include:

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

**Status:** LOCKED

---

## LD-178 — Architecture changes only when architectural truth changes

**Status:** LOCKED

Do not update it after every file move.

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

## LD-187 — Rejected: recreating generic helpers beneath `src`

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

These decisions preserve historically important findings.

Resolved findings remain recorded because their IDs are permanent.

## LD-194 — Assessment Creation's historical route implementation was oversized

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

The substantial implementation has moved to:

```text

src/Assessments/Creation/AssessmentCreatorPage.tsx

```

Further orchestration decomposition remains appropriate where meaningful.

---

## LD-195 — Legacy BuilderTopBar required decomposition

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

Canonical TopBar ownership now exists under:

```text

src/Assessments/Creation/TopBar/

```

Do not regress to the legacy monolith.

---

## LD-196 — Legacy BuilderBottomHud responsibilities required reassignment

**Status:** LOCKED FINDING — RESOLVED; CURRENT PATH SET BY LD-254

Canonical HUD ownership now exists under:

```text

src/Assessments/Creation/HUDBar/

```

The old HUD implementation has been removed from the canonical PaperWorkspace dependency chain.

---

## LD-197 — Legacy giant SettingsPanel remains a major decomposition target

**Status:** LOCKED FINDING — ACTIVE

---

## LD-198 — Legacy theme architecture contained competing sources of truth

**Status:** LOCKED FINDING — SUBSTANTIALLY RESOLVED

Do not recreate competing theme ownership.

---

## LD-199 — Legacy `shared-types` requires domain reassignment

**Status:** LOCKED FINDING — RESOLVED BY LD-258

Do not migrate the folder wholesale.

---

## LD-200 — Legacy `math-helpers` is not accepted V2 ownership

**Status:** LOCKED FINDING — RESOLVED BY LD-258

---

## LD-201 — Historical localStorage access was too distributed

**Status:** LOCKED FINDING — MIGRATION IN PROGRESS

---

## LD-202 — Legacy `course-data` mixes responsibilities

**Status:** LOCKED FINDING — RESOLVED BY LD-258

Useful data organisation should survive while ownership separates.

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

## LD-208 — Do not over-engineer CourseDefinition for unknown requirements

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

## LD-211 — AI must not infer V2 architecture from historical names

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

Inspect when current physical structure matters.

---

## LD-217 — Target architecture and current physical repository must remain distinct concepts

**Status:** LOCKED

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

**Status:** LOCKED

Update the relevant Architecture, Locked Decisions, Repository Map and Ledger documents.

---

# PART XXXII — ARCHITECTURE V2 DEFINITION OF DONE

## LD-222 — Root legacy source is transitional

**Status:** LOCKED — IMPLEMENTED BY LD-251 / LD-258

Finished V2 must not fundamentally depend on the historical root source architecture indefinitely.

---

## LD-223 — `src` becomes the authoritative application source tree

**Status:** SUPERSEDED BY LD-251

---

## LD-224 — Generic legacy buckets disappear or receive explicit justification

**Status:** LOCKED

---

## LD-225 — Major route implementations become thin wrappers

**Status:** LOCKED — IMPLEMENTED; ROUTING MODEL CLARIFIED BY LD-253

---

## LD-226 — Global, Assessment and workspace settings gain clear ownership

**Status:** LOCKED

---

## LD-227 — Global visual truth has no competing authorities

**Status:** LOCKED

---

## LD-228 — Assessment Creation does not fundamentally depend on an N5-specific Skills Tree implementation

**Status:** LOCKED

---

## LD-229 — Product language should lead developers to the correct folder

**Status:** LOCKED SUCCESS CRITERION

Example:

```text

broken Assessment TopBar

→ Assessments/Creation/TopBar

wrong curriculum skill

→ Courses/<Course>/Skills

wrong generated-paper primitive

→ UI/Documents

wrong Course cover content

→ Courses/<Course>/Documents

```

---

## LD-230 — Architecture V2 reduces dependence on historical memory

**Status:** LOCKED SUCCESS CRITERION

A new developer must be able to reconstruct ownership from repository structure and documentation.

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

## LD-236 — Architecture V2 should be intentionally predictable

**Status:** LOCKED PRINCIPLE

A developer should not be surprised by where code lives.

---

## LD-237 — New code must strengthen V2 rather than recreate legacy patterns

**Status:** LOCKED

Do not knowingly create new:

```text

Builder catch-alls

global helper buckets

duplicate theme systems

giant route implementations

course-specific generic UI

hidden cross-feature event coupling

```

inside V2.

---

## LD-238 — Difficult migration does not automatically invalidate target architecture

**Status:** LOCKED

Investigate whether the difficulty is simply historical coupling.

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

The following decisions were established after the original LD-001 → LD-240 register.

---

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

over repeatedly moving and mutating the legacy implementation.

### Rationale

Keeping the old owner intact until the replacement is proven reduces migration risk and makes rollback obvious.

---

## LD-242 — The local working tree is authoritative for uncommitted refactor state

**Status:** LOCKED

Connected GitHub may lag behind the user's local branch.

When determining whether a current local migration is complete, prioritise:

```text

local grep

local TypeScript

local build

local runtime/browser behaviour

```

over stale remote repository state.

Remote source remains useful for inspecting the latest pushed implementation.

---

## LD-243 — Deletion requires broad symbol-level searching

**Status:** LOCKED

Do not establish deadness from a narrow path-specific search.

Search relevant:

```text

symbol names

component names

filenames

adapter names

import paths

route references

```

before deletion.

### Rationale

A transitional adapter may be dead while the implementation it wraps still has another consumer.

---

## LD-244 — Whole-file replacement is preferred for normal-sized manual edits

**Status:** LOCKED WORKFLOW

When the user is applying source manually, provide complete replacement contents for normal-sized files.

Use surgical edits only when:

```text

the file is unusually large

AND

the required change is genuinely tiny

```

Surgical instructions must include distinctive exact boundaries.

---

## LD-245 — PaperWorkspace is a canonical V2 boundary

**Status:** SUPERSEDED IN PATH BY LD-254; CONCEPT RETAINED

The canonical subtree is:

```text

src/Assessments/Creation/PaperWorkspace/

```

It must not casually regain direct dependencies on:

```text

app/create-assessment/builder/

math-helpers/

```

A future legacy dependency introduced there should be treated as an architectural regression unless explicitly justified.

---

## LD-246 — Generated-document architecture uses layered ownership

**Status:** LOCKED

The dependency model is:

```text

generic document primitives

        ↓

qualification-family templates

        ↓

Course-specific documents

        ↓

Assessment Preview / Compilation

```

Current example:

```text

A4PageFrame

        ↓

NationalQualifications templates

        ↓

National5Maths Documents

        ↓

Assessment consumers

```

Each layer owns only knowledge appropriate to that level.

---

## LD-247 — Course Documents expose an explicit Course-owned bundle

**Status:** SUPERSEDED IN PATH BY LD-259; CONCEPT RETAINED

Course-specific generated page components should be exposed through a coherent Course document boundary.

Current National 5 Maths implementation:

```text

src/Courses/National5Maths/Documents/CourseDocuments.ts

```

Conceptually provides:

```text

CoverPage

FormulaSheet

QuestionPage

```

Long-term generic Assessment consumers should resolve these through the active Course contract rather than hard-code one Course throughout the application.

---

## LD-248 — Compilation is a separate Assessment responsibility from Creation

**Status:** SUPERSEDED IN PATH BY LD-259; CONCEPT RETAINED

Conceptually:

```text

src/Assessments/Compilation/

```

owns final printable/generated assessment composition.

Assessment Creation owns interactive building and preview.

A live Compilation route must not be deleted merely because its implementation remains legacy.

It should receive its own bounded migration.

---

## LD-249 — Physical document refactors require visual verification

**Status:** LOCKED

A clean TypeScript result cannot establish visual preservation of generated documents.

Changes affecting:

```text

cover pages

formula sheets

question pages

page frames

margins

corner marks

page scaling

document spacing

```

require relevant visual/browser comparison.

---

## LD-250 — Documentation updates occur at meaningful checkpoints

**Status:** LOCKED WORKFLOW

Do not interrupt every tiny migration with documentation edits.

Update persistent documentation when a meaningful boundary is reached, such as:

```text

a canonical owner established

a major legacy seam removed

a bounded migration completed

an architectural decision changed

a handoff point reached

```

This keeps documentation useful without turning it into a noisy edit-by-edit diary.

---

# PART XXXV — ARCHITECTURE V2 FINAL-STATE DECISIONS

The following decisions record the final source-ownership model established after the original V2 migration strategy changed from a src/ construction area to a root app/ application source container.

They supersede only the specific earlier decisions identified below. Earlier decision IDs remain in this register as historical project memory.

---

## LD-251 — Root app/ is the authoritative runtime application source tree

**Status:** LOCKED — IMPLEMENTED

The authoritative runtime source container is:

```text

app/

```

There is no separate runtime:

```text

src/

```

tree.

This supersedes the source-root assumptions in LD-014, LD-016, LD-019, LD-050 and LD-223.

The final repository architecture must not recreate a second src/ application tree.

---

## LD-252 — Product ownership domains live directly beneath root app/

**Status:** LOCKED — IMPLEMENTED

The principal runtime ownership domains are:

```text

app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
└── UI/

```

Next.js routing infrastructure also lives beneath root app/, but routing does not determine product ownership.

This supersedes the physical src/... model in LD-021 and the path-only wording in LD-098.

---

## LD-253 — Public routes use a thin catch-all dispatcher rather than shadow feature trees

**Status:** LOCKED — IMPLEMENTED

The current routing adapter is:

```text

app/[...route]/page.tsx

```

It dispatches the established public URLs to product-owned page implementations.

Current preserved route contract includes:

```text

/
/create-assessment
/create-assessment/builder
/compile-assessment
/my-assessments
/my-classes
/my-classes/
/dev/generator-tester

```

Do not recreate parallel physical signpost trees such as:

```text

app/create-assessment/
app/compile-assessment/
app/my-assessments/
app/my-classes/
app/dev/

```

merely to mirror URLs.

This supersedes LD-046 and the routing direction in LD-050.

LD-047, LD-048, LD-049, LD-051, LD-156 and LD-225 remain conceptually active.

---

## LD-254 — Assessment Creation's canonical implementation lives under root app/Assessments/Creation

**Status:** LOCKED — IMPLEMENTED

Canonical creation entry points are:

```text

app/Assessments/Creation/AssessmentSetupPage.tsx
app/Assessments/Creation/AssessmentCreatorPage.tsx

```

The canonical PaperWorkspace subtree is:

```text

app/Assessments/Creation/PaperWorkspace/

```

The established Creation ownership model remains:

```text

Creation/
├── Analysis/
├── AssessmentSettings/
├── Feedback/
├── HUDBar/
├── Papers/
├── PaperWorkspace/
├── Persistence/
├── Questions/
├── Setup/
├── SkillsPanel/
├── TopBar/
├── AssessmentCreatorPage.tsx
└── AssessmentSetupPage.tsx

```

This supersedes only the obsolete src/... paths in LD-072 and LD-245.

The conceptual decisions in LD-070 through LD-097 remain active unless separately superseded.

---

## LD-255 — Courses and Classes use root app/ ownership

**Status:** LOCKED — IMPLEMENTED

Course-specific knowledge belongs beneath:

```text

app/Courses/

```

Class-owned functionality belongs beneath:

```text

app/Classes/

```

Course-specific implementation belongs beneath:

```text

app/Courses/<Course>/

```

This supersedes only the obsolete src/... paths in LD-108 and LD-133.

The ownership principles behind those decisions remain active.

---

## LD-256 — Current historical-exam terminology is ExamQuestion / ExamMarkingScheme

**Status:** LOCKED — IMPLEMENTED

The current National 5 Mathematics historical exam evidence owner is:

```text

app/Courses/National5Maths/ExamQuestionAndAnswerCatalog/
├── Questions/
└── MarkingSchemes/

```

Current terminology is:

```text

ExamQuestion
ExamMarkingScheme
ExamQuestionAndAnswerCatalog

```

The historical SourceQuestionCatalog and SourceMarkingSchemeCatalog terminology is retired from current source architecture.

This supersedes LD-119, LD-120, LD-203 and LD-204.

Historical migration material may still use the old terminology where historically accurate.

---

## LD-257 — Runtime Developer Tools live under app/DeveloperTools; repository tooling remains under root Tools

**Status:** LOCKED — IMPLEMENTED

Runtime developer-facing application functionality belongs beneath:

```text

app/DeveloperTools/

```

Current example:

```text

app/DeveloperTools/GeneratorTester/

```

Repository scripts, migration artefacts and maintenance tooling belong beneath:

```text

Tools/

```

This supersedes only the obsolete src/DeveloperTools/ path in LD-159.

LD-027 and LD-028 remain active.

---

## LD-258 — Root generic legacy source buckets are retired

**Status:** LOCKED — IMPLEMENTED

The former root runtime-source buckets:

```text

shared-types/
math-helpers/
course-data/

```

have been removed from current application architecture.

Their surviving responsibilities were reassigned to explicit owners.

Do not recreate these buckets under root app/, beneath another source container, or under renamed generic equivalents.

This resolves the active findings recorded in LD-199, LD-200 and LD-202.

---

## LD-259 — Current generated-document and Compilation owners use root app/ paths

**Status:** LOCKED — IMPLEMENTED

Generic generated-document infrastructure lives beneath:

```text

app/UI/Documents/

```

National 5 Mathematics Course documents live beneath:

```text

app/Courses/National5Maths/Documents/

```

The Course document bundle is:

```text

app/Courses/National5Maths/Documents/CourseDocuments.ts

```

Assessment Compilation lives beneath:

```text

app/Assessments/Compilation/

```

The layering remains:

```text

generic document primitives
↓
qualification-family templates
↓
Course-specific documents
↓
Assessment consumers

```

This supersedes only the obsolete src/... paths in LD-247 and LD-248.

LD-145, LD-151 through LD-153, LD-246 and LD-249 remain active.

---

## LD-260 — CourseId has one canonical owner

**Status:** LOCKED — IMPLEMENTED

CourseId is defined by:

```text

app/Courses/CourseTypes.ts

```

Genuine consumers import it directly from Courses.

Do not re-export CourseId from Assessment-owned type files merely for convenience.

Do not create parallel Course identity types.

---

## LD-261 — Course Registry uses the canonical Course Assessment Config API

**Status:** LOCKED — IMPLEMENTED

The canonical Course registry owner is:

```text

app/Courses/CourseRegistry.ts

```

Canonical API terminology includes:

```text

COURSE_REGISTRY
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs

```

Retired compatibility aliases such as:

```text

COURSE_CONFIG_REGISTRY
getCourseConfigById
getDefaultCourseConfig
getRegisteredCourseConfigs

```

must not be reintroduced without a demonstrated compatibility requirement.

---

## LD-262 — Classes resolves Course skills through the Course abstraction

**Status:** LOCKED — IMPLEMENTED

Class coverage resolves educational structure through:

```text

SchoolClass.courseId
↓
CourseRegistry
↓
CourseAssessmentConfig
↓
skillTree

```

Classes must not directly depend on National 5 Mathematics skill data when the Course contract supplies the required educational structure.

This is the implemented form of LD-110, LD-111, LD-112, LD-115 and LD-133 through LD-135.

---

## LD-263 — The Question Bank architecture is retired

**Status:** LOCKED — IMPLEMENTED

The former:

```text

app/question-bank/

```

architecture has been removed.

Live concept adapters were migrated into Course-owned generation beneath:

```text

app/Courses/National5Maths/QuestionAndAnswerGeneration/

```

Proven dead history/evidence/prompt-style files were deleted rather than migrated.

Do not recreate a parallel Question Bank architecture.

Future question and answer generation should extend the Course-owned generation model.

---

## LD-264 — "use client" marks genuine client entry boundaries only

**Status:** LOCKED — IMPLEMENTED

Do not add "use client" to an internal hook or child component merely because it uses:

```text

useState
useEffect
useMemo
useCallback
useRef
browser APIs
event handlers

```

A module imported beneath an existing Client Component boundary inherits the client environment.

Use "use client" where the module intentionally establishes a client subtree from a server boundary.

Do not add the directive defensively.

---

## LD-265 — Historical paths remain valid inside the Refactor Ledger when they describe history

**Status:** LOCKED

Docs/RefactorLedger.md is a historical migration record.

Do not blindly rewrite earlier src/..., legacy Builder or old route paths inside the ledger when those paths accurately describe repository state at that point in the migration.

Current-state documents must describe the current root app/ architecture.

Historical documents must remain historically truthful.

---

## LD-266 — Next.js special filenames inside product architecture require deliberate framework intent

**Status:** LOCKED

Because product source now lives beneath the App Router's root app/ tree, filenames such as:

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

must be introduced deliberately.

Ordinary product page implementations should use descriptive names such as:

```text

AssessmentCreatorPage.tsx
AssessmentCompilationPage.tsx
MyClassesPage.tsx
ClassDetailsPage.tsx

```

unless the file is genuinely intended to define Next.js routing/framework behaviour.

---

# 4. Quick Reference

The highest-level locked rules are:

```text

PRESERVE WORKING BEHAVIOUR.

ROOT app/ IS THE AUTHORITATIVE RUNTIME SOURCE.

DO NOT RECREATE A src/ APPLICATION TREE.

OWNERSHIP DETERMINES LOCATION.

PUBLIC ROUTES USE THIN ROUTING ADAPTERS; DO NOT RECREATE SHADOW ROUTE TREES.

WRITE NEW BEFORE DELETING OLD WHERE PRACTICAL.

TRACE CONSUMERS BEFORE STRUCTURAL CHANGE.

SEARCH BROADLY BEFORE DELETION.

ROUTES ARE THIN.

BUILDER IS LEGACY TERMINOLOGY.

ASSESSMENT CREATION IS COURSE-INDEPENDENT.

COURSES OWN EDUCATIONAL KNOWLEDGE.

COURSEID IS OWNED BY app/Courses/CourseTypes.ts.

CLASSES RESOLVES COURSE SKILLS THROUGH THE COURSE REGISTRY/CONFIG CONTRACT.

QUESTION BANK IS RETIRED.

"USE CLIENT" BELONGS ONLY AT GENUINE CLIENT ENTRY BOUNDARIES.

APPLICATION UI AND DOCUMENT UI ARE SEPARATE SYSTEMS.

DOCUMENTS USE GENERIC → TEMPLATE → COURSE → CONSUMER LAYERS.

PERSISTENCE HAS EXPLICIT OWNERSHIP.

DO NOT CREATE SECOND SOURCES OF TRUTH.

DO NOT CREATE SPECULATIVE ARCHITECTURE.

LOCAL WORKING STATE IS AUTHORITATIVE WHILE UNCOMMITTED.

VERIFY TYPES AND RELEVANT USER BEHAVIOUR.

UPDATE DOCUMENTATION AT MEANINGFUL CHECKPOINTS.

WHEN A LOCKED RULE GENUINELY FAILS, SURFACE THE CONFLICT RATHER THAN DRIFTING.

```

---

# 5. Final Rule

A future developer or AI assistant should treat this register as:

```text

settled project memory

```

not:

```text

a list of suggestions to reconsider

```

Architecture V2 should evolve deliberately, not accidentally.

---

## LD-267 — VecEd uses one application page with centralised public-route rewrites

**Status:** LOCKED — IMPLEMENTED

The runtime App Router surface is intentionally minimal:

```text
app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── UI/
├── layout.tsx
└── page.tsx

Public application URLs are preserved through rewrites defined in:

next.config.ts

Those rewrites dispatch into:

app/page.tsx

which acts as the single thin application routing adapter.

Product implementation must remain beneath its owning domain rather than
recreating filesystem route trees for public URLs.

Do not recreate:

app/create-assessment/
app/my-assessments/
app/my-classes/
app/compile-assessment/
app/dev/

merely to mirror URL structure.

The routing model may be changed in future only for a genuine framework,
performance or product requirement, not simply to mirror URLs physically.