# N5 Assessment Tool — Feature History

**Document type:** Meaningful implemented feature/technical change record  
**Status:** Active living document  
**Started:** 27 August 2026

---

## 1. Purpose

This document records meaningful product and technical changes after the Architecture V2 baseline.

It answers:

> What important capability was added or changed?

> What is the current outcome?

> Where does it live?

It is intentionally **not**:

- a per-commit changelog;
- a migration diary;
- a future-feature backlog;
- a replacement for Architecture or Repository Map documentation.

Use:

```text
Docs/Architecture.md
→ how the system currently works

Docs/RepositoryMap.md
→ where current code lives

Docs/RefactorLedger.md
→ Architecture V2 migration history

Docs/FutureFeatures.md
→ ideas/planned/deferred work
```

Add an entry when a future developer would materially benefit from knowing that a capability, workflow or technical foundation changed.

Historical entries may name files/paths that were correct when the entry was written. When a later structural/naming pass changes those paths, preserve the historical statement and add the current successor path where useful rather than rewriting the past.

---

## 2. Entry Style

Preferred entry shape:

```text
DATE — FEATURE / CHANGE

Status
What changed
Current behaviour
Primary owners
Important follow-up (only when useful)
```

Keep entries outcome-focused rather than describing every implementation pass.

---

# 26 August 2026 — Architecture V2 Baseline

**Status:** COMPLETE

Architecture V2 was formally signed off after the repository-wide refactor and verification pass.

The baseline established:

```text
root app/ runtime source
explicit Assessments ownership
explicit Classes ownership
explicit Courses ownership
explicit DeveloperTools ownership
Application UI / Documents UI separation
Course-independent Assessment Creation
separate Assessment Compilation ownership
retired Builder architecture
retired Question Bank
retired shared-types/math-helpers/paper-layout/course-data owners
thin central routing architecture
persistence compatibility rules
deliberate "use client" boundaries
```

This is the point after which development returned to normal feature-led work.

Historical migration detail remains in:

```text
Docs/RefactorLedger.md
```

---

# 27 August 2026 — Global Application Shell and Activity Rail

**Status:** IMPLEMENTED

The global application shell was redesigned into a compact workbench structure.

Current layout:

```text
44px HeaderBar
        ↓
44px Activity Rail + page content
```

Primary implementation:

```text
app/layout.tsx
app/UI/Application/Shell/ApplicationActivityRail.tsx
app/UI/Application/Shell/ApplicationShellTokens.ts
app/UI/Application/HeaderBar/HeaderBar.tsx
```

Key behaviour now includes:

- a persistent global Activity Rail below the HeaderBar;
- global Settings accessed from the rail rather than the HeaderBar;
- the Settings panel slides over the active page instead of resizing it;
- the rest of the page receives a dark focus backdrop while Settings is active;
- the currently accepted focus-overlay opacity is approximately `0.4`;
- click-outside and Escape close the Settings activity;
- route changes close temporary activity panels;
- the HeaderBar's right-hand area is intentionally left available for future account/application controls.

The shell also corrected page-height ownership so feature pages can use `height: 100%` rather than independently claiming the viewport.

---

# 27 August 2026 — Global Settings UI Consolidation

**Status:** IMPLEMENTED

Global appearance settings were moved into a compact Application-owned panel:

```text
app/UI/Application/Settings/GlobalSettingsPanel.tsx
```

Current appearance choices include:

```text
Dark
Soft Grey
Light
System
Custom
```

Custom appearance continues to support base/accent colour selection through existing theme infrastructure.

The active global Settings interaction is now owned by Application Settings + Shell/Activity Rail rather than the historical HeaderBar Settings button/SettingsDrawer interaction.

Some compatibility UI files may remain until proven unused, but they are not the preferred owner for new global settings work.

---

# 27 August 2026 — Assessment Creator Workbench UI Direction

**Status:** IMPLEMENTED / CURRENT DESIGN BASELINE

The Assessment Creator was progressively restyled into a compact desktop/workbench interface inspired by professional productivity tools without directly cloning one.

Current visual direction includes:

- thin borders;
- restrained neutral/dark surfaces;
- approximately 4–6px radii for most controls/panels;
- compact control heights;
- smaller typography;
- restrained blue accent;
- subtle selected-state surfaces;
- clear pane gutters;
- reduced decorative card chrome.

This visual direction is now used as the default reference for future interactive application UI work.

Generated assessment documents remain visually separate from the workbench UI.

---

# 27 August 2026 — Assessment TopBar Refinement

**Status:** IMPLEMENTED

The Creator TopBar was refined around compact assessment-building controls.

Current prominent controls include:

```text
Assessment Name
Class
Assessment Date
Viewing Paper
```

Class and date selection use compact custom controls consistent with the workbench UI.

The TopBar remains distinct from the global HeaderBar and does not own shared paper-domain logic.

---

# 27 August 2026 — SkillsPanel / Skills Tree Refinement

**Status:** IMPLEMENTED

The Creator SkillsPanel received a substantial visual and interaction cleanup.

Current behaviour/design includes:

- compact Show/Hide guidance;
- compact filter controls;
- consistent segmented-control geometry;
- smaller radii and typography;
- centred target-mark arrows;
- slimmer category presentation;
- aligned skill IDs;
- unbolded skill rows;
- simplified expand/collapse presentation;
- refined concept editor styling;
- removal of the old pane collapse button.

The SkillsPanel continues to own interaction only; Course skill definitions remain Course-owned.

---

# 27 August 2026 — Preview Zoom Rebase

**Status:** IMPLEMENTED

The Assessment preview zoom display was rebased so the UI's displayed `100%` corresponds to the previously preferred physical viewing scale rather than literal browser scale.

Current behaviour includes:

- default physical preview scale around `0.8` shown as `100%` to the user;
- practical displayed zoom range approximately 60%–200%;
- viewport-anchor preservation when switching view modes;
- preview-owned zoom overlay near the top centre;
- idle fading after several seconds.

This makes the default preview visually useful while keeping user-facing zoom language intuitive.

---

# 27 August 2026 — Preview-Owned Save Status

**Status:** IMPLEMENTED

Assessment save status moved away from the HUD and is now displayed at the lower-left of the preview.

Primary ownership:

```text
app/Assessments/Creation/Persistence/
app/Assessments/Creation/PaperWorkspace/Preview/
```

Current behaviour includes:

```text
Saving...
Saved
Save failed
```

Saving is real/synchronous with UI timing used only to make status transitions readable.

The Saved indicator also uses a subtle periodic heartbeat without simulating fake save operations.

---

# 27 August 2026 — Compile Button Redesign

**Status:** IMPLEMENTED

The Creator Compile action was redesigned as a compact workbench control at the lower-right of the HUD region.

Primary component at the time of implementation:

```text
app/Assessments/Creation/HUDBar/AssessmentCompileButton.tsx
```

Current filename after the 28 August responsibility-first naming pass:

```text
app/Assessments/Creation/HUDBar/CompileButton.tsx
```

The current button uses the selected-control blue family, compact height/radius and a small right arrow.

More sophisticated compile-readiness signalling remains a possible future enhancement rather than part of the current baseline.

---

# 27 August 2026 — Shared Preview Tray

**Status:** IMPLEMENTED

The PDF/assessment preview gained one shared pull-out tray with two vertical edge tabs:

```text
Settings
View
```

The tabs behave like a shared binder divider:

- opening either tab moves the whole tray;
- selecting the other tab while open changes content without moving the tray again;
- clicking the active tab closes the tray;
- click-outside/Escape close the tray;
- inactive tabs are visually de-emphasised;
- the active tab receives the blue active edge/state.

The accepted product term is:

```text
Preview Tray
```

This interaction is distinct from a generic Drawer or Popover.

The current implementation path after the 28 August naming pass is:

```text
app/Assessments/Creation/PaperWorkspace/Preview/Tray/
```

---

# 27 August 2026 — Preview Tray View Controls

**Status:** IMPLEMENTED

The Preview Tray's View tab now provides:

```text
Compact
Exam
Answers
Show HUD
Reset layout
Reset zoom
```

View-mode descriptions explain the purpose of each mode.

Current meanings:

```text
Compact
→ removes answer space for a condensed paper

Exam
→ provides working space appropriate to questions

Answers
→ exam layout plus worked solutions / alternative methods
```

The View tab owns preview/workspace presentation rather than assessment content.

---

# 27 August 2026 — Preview Tray Settings / Paper Sitting

**Status:** IMPLEMENTED

The Preview Tray's Settings tab now contains paper-content toggles and paper-sitting controls.

Paper-content controls include:

```text
Cover sheet
Formula sheet
Date & time
Candidate number
```

Paper Sitting supports:

```text
Paper 1 / Paper 2
Date / Time
```

with compact date/time editors.

Important behaviour includes:

- Paper 1/Paper 2 dates start linked until the other paper is manually edited;
- start times use the same link-until-other-paper-edited model;
- once manually separated, the values do not magically relink;
- automatic end time is based on configured assessment intent rather than live HUD marks;
- time-led assessments use configured time targets;
- marks-led assessments use configured marks × Course minutes-per-mark;
- manual end-time override wins for that paper;
- time entry supports HH:MM progression;
- the compact clock shows draggable hour and minute hands simultaneously;
- AM/PM uses a compact segmented control.

No automatic jump to Paper 2 occurs after completing Paper 1 timing.

---

# 27 August 2026 — Canonical Assessment Compilation Model

**Status:** IMPLEMENTED

Assessment Compilation was expanded from a page-level feature into a canonical document pipeline.

Current major owners:

```text
app/Assessments/Compilation/Model/
app/Assessments/Compilation/Pagination/
app/Assessments/Compilation/Rendering/
```

`buildAssessmentCompilationDocument.ts` converts saved assessment state into the canonical compilation document used by final rendering/PDF generation.

This reduces the risk of separate preview/download systems independently reconstructing assessment meaning.

---

# 27 August 2026 — Server Assessment PDF Generation

**Status:** IMPLEMENTED

The application gained real server-generated assessment PDFs.

Primary owner:

```text
app/Assessments/Compilation/PDF/
```

Canonical pipeline:

```text
SavedAssessment
      ↓
buildAssessmentCompilationDocument
      ↓
Assessment PDF document rendering
      ↓
standalone static HTML
      ↓
embedded KaTeX CSS/fonts
      ↓
headless Chromium through Puppeteer
      ↓
PDF bytes
```

The server endpoint is:

```text
app/Assessments/Compilation/PDF/generate/route.ts
```

Important technical decisions made during implementation:

- React static document rendering is used instead of importing `react-dom/server` into the App Router route graph;
- KaTeX CSS/font assets are embedded so generated PDFs do not depend on external font requests;
- Google-hosted application/document fonts were removed from the build-critical path where they caused network-dependent builds;
- PDF asset tracing is explicitly constrained for deployment;
- Chromium/Puppeteer remain server-only dependencies.

The pipeline reached clean TypeScript and production build verification.

---

# 27 August 2026 — Client PDF Asset Cache

**Status:** IMPLEMENTED

Generated assessment PDFs now have a reusable client asset/cache layer beneath:

```text
app/Assessments/Compilation/PDF/Client/
```

The cache identity accounts for assessment identity and update revision so unchanged assessments can reuse an existing PDF while changed assessments do not silently display a stale asset.

Initial PDF generation is intentionally controlled rather than launching many Chromium jobs at once.

This asset layer is shared by My Assessments preview experiences.

---

# 27 August 2026 — My Assessments Promoted to First-Class Domain

**Status:** IMPLEMENTED

The user-facing assessment library was promoted from Assessment-owned presentation into its own top-level product owner:

```text
app/MyAssessments/
```

Current structure includes:

```text
Actions/
Display/
Library/
ListView/
Preview/
TileView/
Toolbar/
MyAssessmentsPage.tsx
```

The ownership distinction is now:

```text
app/Assessments/SavedAssessments/
→ saved-assessment data and persistence

app/Assessments/Compilation/PDF/
→ generated assessment PDFs

app/MyAssessments/
→ assessment-library presentation/workflow
```

This keeps the substantial library experience independently navigable without duplicating lower-level data/PDF ownership.

---

# 27 August 2026 — My Assessments Tile Redesign

**Status:** IMPLEMENTED / PAUSED AS FINAL-FORM BASELINE

The My Assessments page was redesigned from large older-style cards into a compact three-across assessment library.

Current tile behaviour includes:

- three assessments per row at the primary desktop viewport;
- compact workbench visual language;
- fixed approximately 310px tile height;
- full-height left preview pane;
- bold assessment title;
- Course + assessment type line;
- coverage/class line;
- Draft/Complete status badge;
- overall progress plus individual paper progress;
- consistently formatted `DD/MM/YYYY` dates;
- right-aligned assessment/edited/created dates;
- explicit Open, Duplicate and Delete actions;
- pinning support.

The tile design is currently considered sufficiently complete for normal use and is intentionally paused rather than continuously polished.

---

# 27 August 2026 — Real PDF Previews in My Assessments Tiles

**Status:** IMPLEMENTED

The former blank assessment-preview placeholder was replaced with the actual generated assessment PDF.

My Assessments now:

```text
loads/generates the canonical PDF asset
        ↓
uses PDF.js
        ↓
renders pages to canvas
        ↓
displays them inside the tile preview pane
```

Tile previews:

- render real A4 pages;
- preserve document legibility as far as the tile size permits;
- stack pages vertically;
- scroll inside the fixed tile rather than expanding the card;
- generate lazily as the tile approaches the viewport;
- reuse cached PDF assets.

This means the library preview now shows the same assessment document that the PDF generation pipeline produces rather than a separate miniature reimplementation.

---

# 27 August 2026 — Large My Assessments PDF Preview Modal

**Status:** IMPLEMENTED

Clicking a tile PDF now opens a large centred PDF preview over a darkened page backdrop.

The modal:

- reuses the existing cached PDF asset;
- does not launch another PDF-generation job merely because it is enlarged;
- supports vertical scrolling;
- displays assessment title and page count;
- closes through X, Escape or backdrop click.

The same modal is also used by the List-view Preview action.

---

# 27 August 2026 — My Assessments Library Toolbar

**Status:** IMPLEMENTED

My Assessments gained a compact library toolbar containing:

```text
Search
Status filter
Sort
result count
Tile/List switch
```

Current status filtering supports:

```text
All
Draft
Complete
```

Current sort modes include:

```text
Last edited
Assessment date
Date created
Name A–Z
```

Pinned assessments retain priority within sorting.

Tile/List preference is stored locally so the library remembers the user's chosen presentation.

Current responsibility-first library modules after the 28 August naming pass include:

```text
app/MyAssessments/Library/ViewOptions.ts
app/MyAssessments/Library/Filtering.ts
app/MyAssessments/Library/Sorting.ts
```

---

# 27 August 2026 — My Assessments List View

**Status:** IMPLEMENTED / PAUSED AS FINAL-FORM BASELINE

My Assessments gained a second dense management-oriented List view.

The List view retains the important information/functionality of Tile view while prioritising scanning and management.

Current columns include:

```text
Assessment
Progress
Assessment Date
Last Edited
Status
Preview
Actions
```

Current presentation includes:

- bold assessment title;
- Course/type and coverage metadata;
- overall green progress line;
- individual P1/P2 progress and subtle blue progress lines;
- centred Assessment Date;
- aligned edited time/date and created date;
- centred Draft/Complete badge;
- dedicated labelled Preview button/column;
- explicit Pin, Duplicate, Delete and Open actions;
- no horizontal scrollbar at the primary desktop target viewport.

Preview is intentionally treated as a first-class library capability rather than an obscure icon.

The List view is currently considered sufficiently complete for normal use and is intentionally paused.

---

# 27 August 2026 — Documentation Model Reset

**Status:** IMPLEMENTED

Project documentation was rewritten around the post-refactor development phase.

Key changes:

```text
AGENTS.md
→ current first-read repository contract

Architecture.md
→ current architecture in present tense

RepositoryMap.md
→ current physical owners including MyAssessments/PDF/Shell

LockedDecisions.md
→ historical IDs preserved + post-refactor superseding decisions

ChatGPTWorkflow.md
→ feature-led workflow by default; migration workflow retained when needed

RefactorLedger.md
→ closed historical Architecture V2 migration record

FeatureHistory.md
→ new implemented feature/technical history

FutureFeatures.md
→ new future idea/backlog document
```

The documentation reset intentionally preserved useful Architecture V2 rules/history while removing the false impression that the repository-wide migration is still the default task.

---

# 28 August 2026 — Repository Naming and Discoverability Overhaul

**Status:** COMPLETE

After Architecture V2 ownership was established, the repository received a dedicated file/folder naming pass focused on day-to-day discoverability rather than another architectural migration.

The governing rule became:

> **Folder = context. Filename = responsibility.**

The objective was that somebody who did not build the project — including a non-coder familiar with the product — should be able to browse a folder and make a sensible guess about what each file does.

The pass deliberately:

- removed `use...` from filenames where it only exposed the implementation detail that a file exports a React hook;
- retained React `use...` naming for the exported hook functions themselves;
- removed repeated parent-folder prefixes where the folder already supplied the context;
- replaced vague implementation-led names with responsibility-led names;
- avoided creating generic `Helpers`, `Utils`, `Common`, `Shared` or `Misc` owners;
- retained contextual wording where removing it would make a filename ambiguous;
- retained meaningful ordered folders where the order itself communicates product structure;
- preserved public routes, localStorage keys and persisted compatibility fields.

The intentional ordered SkillsPanel folders remain:

```text
01-SkillsFilters/
02-SkillsTree/
```

because their Explorer order mirrors the actual webpage flow.

Major areas touched included:

```text
app/Assessments/Creation/Setup/
app/Assessments/Creation/Persistence/
app/Assessments/Creation/Questions/
app/Assessments/Creation/TopBar/
app/Assessments/Creation/HUDBar/
app/Assessments/Creation/Papers/
app/Assessments/Creation/PaperWorkspace/
app/Assessments/Creation/SkillsPanel/
app/Assessments/Creation/Feedback/
app/Classes/
app/MyAssessments/Display/
app/MyAssessments/Library/
```

Representative current names include:

```text
Persistence/AutoSaveAssessment.ts
Persistence/RestoreInitialState.ts
Questions/DraftGeneration.ts
TopBar/PaperSelector.tsx
Papers/AutomaticEndTimes.ts
PaperWorkspace/Preview/ZoomAndPageTracking.ts
Classes/Records/Normalisation.ts
MyAssessments/Library/Filtering.ts
```

The pass was behaviour-preserving and was repeatedly verified with TypeScript, ESLint and Git whitespace checks. Import-path issues caused by file moves were repaired without renaming exported hook symbols.

The responsibility-first naming rule is now locked in `Docs/LockedDecisions.md` and documented in `AGENTS.md`, `Architecture.md`, `RepositoryMap.md` and `ChatGPTWorkflow.md`.

---

# 28 August 2026 — Documentation Reconciliation After Naming Overhaul

**Status:** IMPLEMENTED

The repository documentation was reconciled after the naming/discoverability pass.

The reconciliation adopted an information-preserving rule:

```text
historical truth
→ preserve

current truth
→ update

new rule / decision
→ add

obsolete contradictory instruction
→ explicitly supersede or replace
```

Current-state documents were updated to reflect the real post-rename tree, including `app/Home/`, current Classes ownership (`MyClasses/`, `Coverage/`, `Records/`), responsibility-first Assessment Creation filenames and current My Assessments Display/Library names.

Historical migration paths remain intact where they accurately describe earlier repository states.

---

# Current Pause Point — 28 August 2026

The repository-wide file-renaming/discoverability phase is complete.

Further filename changes should now be driven by a real discoverability or responsibility problem rather than continuing to polish already-serviceable names indefinitely.

Feature development and targeted maintenance remain the normal development mode.

The My Assessments redesign also remains intentionally paused at its current working baseline unless a real product need justifies further refinement.

Future ideas, including archive/year organisation, belong in:

```text
Docs/FutureFeatures.md
```
