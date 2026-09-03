# N5 Assessment Tool — Current Architecture

## 1. Purpose

This document describes the architecture of the repository **as it exists now**.

It explains ownership, dependency direction, runtime composition and the principal module boundaries used when tracing or changing behaviour.

It is not a migration diary and does not preserve obsolete folder structures for historical interest. Historical change is available through Git history and designated history documents.

Use:

```text
AGENTS.md
→ mandatory operating, preservation and source-isolation rules

Docs/RepositoryMap.md
→ physical repository/file map

app/Courses/National5Maths/ARCHITECTURE.md
→ detailed National 5 Mathematics evidence/generation architecture
```

---

## 2. Architectural Objective

The repository should be understandable by responsibility.

A developer should be able to answer:

```text
Where does this behaviour belong?
What depends on it?
What does it depend on?
What public contract does it expose?
What else could be affected if it changes?
```

The architecture optimises for clear ownership and explicit wiring rather than the shortest possible imports.

The governing naming principle is:

> **Folder = context. Filename = responsibility.**

---

## 3. Runtime Source Root

Runtime application source lives beneath:

```text
app/
```

The top-level runtime owners are:

```text
app/
├── Assessments/
├── Classes/
├── Courses/
├── DeveloperTools/
├── Home/
├── MyAssessments/
├── UI/
├── layout.tsx
└── page.tsx
```

There is no parallel runtime `src/` tree.

Each top-level folder owns a product or platform responsibility rather than mirroring a browser URL.

---

## 4. Product Architecture and Routing Are Separate

Public URLs describe navigation.

Source folders describe ownership.

The application deliberately keeps route composition thin:

```text
next.config.ts
        ↓
internal route information
        ↓
app/page.tsx
        ↓
product-owned page component
```

`app/page.tsx` imports the major product page entry points and selects one according to the internal route value. It must remain a routing adapter rather than becoming a feature implementation owner.

`app/layout.tsx` owns global application composition and imports the global stylesheet, application settings provider, header and activity rail.

Framework-significant names such as `page.tsx`, `layout.tsx` and `route.ts` should only be used at genuine framework boundaries.

Public routes and persisted routing identifiers should be treated as compatibility contracts unless a deliberate product change says otherwise.

---

## 5. Top-Level Ownership

```text
Assessments
→ generic assessment workflow, question contracts, persistence and compilation

Classes
→ class records, class workflow and class coverage

Courses
→ Course identity, educational knowledge, Course configuration and Course-specific generation

DeveloperTools
→ runtime developer-only interfaces

Home
→ Home-page product experience

MyAssessments
→ saved-assessment library presentation and management workflow

UI/Application
→ interactive application presentation

UI/Documents
→ printable/generated-document presentation
```

A consumer may depend on an owner. Consumption does not transfer ownership.

---

## 6. High-Level Dependency Direction

The principal dependency direction is:

```text
Course knowledge
      ↓
CourseAssessmentConfig / CourseRegistry
      ↓
generic Assessment + Classes consumers
```

and:

```text
Saved assessment state
      ↓
Assessment Compilation
      ↓
generated document / PDF asset
      ↓
My Assessments preview and other consumers
```

and:

```text
generic document primitives
      ↓
qualification-family templates
      ↓
Course-specific document composition
      ↓
Assessment Compilation
```

Avoid circular ownership introduced merely to make wiring convenient.

---

# Assessments

## 7. Assessments Domain

`app/Assessments/` owns generic assessment behaviour.

Current major areas are:

```text
AssessmentTypes.ts
Compilation/
Creation/
Questions/
SavedAssessments/
```

The domain should be Course-aware but not Course-specific.

If a rule describes how one mathematical Course works, it belongs in Courses rather than being embedded in generic Assessment workflow.

---

## 8. Assessment Creation

`app/Assessments/Creation/` owns the interactive process of configuring and building an assessment.

It includes responsibilities such as setup, skill selection, paper state, question state, analysis, persistence, workspace preview, assessment-specific settings and status controls.

Creation asks:

> What should this assessment contain, and how should the user build it?

Creation may consume generic question contracts and Course configuration. It must not become the owner of Course curriculum knowledge or final document generation.

---

## 9. Assessment Questions

`app/Assessments/Questions/` owns generic question contracts and shared question behaviour.

The important separation is:

```text
Assessments/Questions
→ generic contracts and generic interaction

Courses/<Course>
→ educational knowledge and Course-specific manufacture
```

Course-specific question generation should adapt into Assessment-owned contracts rather than redefining the generic Assessment model.

---

## 10. Saved Assessments

`app/Assessments/SavedAssessments/` owns persistent assessment data and compatibility handling.

Persisted browser data is an external compatibility contract.

A source refactor must not casually rename storage keys, persisted fields or stored compatibility identifiers.

The user-facing library does not own this persistence layer.

---

## 11. Assessment Compilation

`app/Assessments/Compilation/` owns transformation of saved assessment state into final document meaning.

Creation and Compilation are deliberately separate:

```text
Creation
→ chooses and edits assessment content

Compilation
→ converts saved content into a canonical paginated document
```

The canonical compilation document should be the shared meaning used by browser compilation and server PDF generation. Do not create independent preview and download document models that can drift apart.

---

## 12. Canonical Compilation Flow

The current conceptual flow is:

```text
SavedAssessment
      ↓
buildAssessmentCompilationDocument
      ↓
AssessmentCompilationDocument
      ↓
pagination + Course document composition
      ↓
rendered document
      ↓
PDF generation / preview consumers
```

`buildAssessmentCompilationDocument.ts` imports saved-assessment identity/state, the Course Registry, Course paper/structure helpers and pagination. It exports `buildAssessmentCompilationDocument`, making it a major troubleshooting boundary when final document content is incorrect.

---

# Courses

## 13. Courses Domain

`app/Courses/` owns educational and Course-specific knowledge.

Important generic Course infrastructure includes:

```text
CourseTypes.ts
CourseCatalog.ts
CourseAvailability.ts
CourseAssessmentConfig.ts
CourseRegistry.ts
Documents/
Papers/
QuestionExamples/
Selection/
```

Concrete Courses live beneath their own folders.

The architecture is intentionally multi-Course. National 5 Mathematics is the present primary development focus, but generic Assessment and Classes code must remain capable of consuming another registered Course without being rewritten around one curriculum.

---

## 14. Course Assessment Configuration

`app/Courses/CourseAssessmentConfig.ts` defines the Assessment-facing Course contract.

It imports generic Assessment types and Course identity, and exports:

```text
Course configuration types
paper configuration types
assessment mode/structure types
metric policy types
paper/structure lookup helpers
paper suitability helpers
```

Its role is to answer:

> What does generic Assessment workflow need to know about this Course?

It should not become the complete Course domain model. Historical evidence, generators, visuals and Course document implementation remain separately owned.

Authored repository files must remain free of official awarding-body names and acronyms. Any residual branded metadata currently present in Course configuration or developer-only naming is compliance debt to remove in a dedicated source-isolation sweep.

---

## 15. Course Registry

`app/Courses/CourseRegistry.ts` is the central runtime registration point for Course assessment configurations.

It imports:

```text
CourseId
CourseAssessmentConfig
registered concrete Course AssessmentConfig modules
```

and exports:

```text
DEFAULT_COURSE_ID
COURSE_REGISTRY
findCourseAssessmentConfigById
hasCourseAssessmentConfig
getCourseAssessmentConfigById
getDefaultCourseAssessmentConfig
getRegisteredCourseAssessmentConfigs
```

When a generic feature cannot resolve Course behaviour, this is one of the first wiring points to inspect.

---

# National 5 Mathematics

## 16. National 5 Mathematics Content Architecture

The canonical Course content workspace is:

```text
app/Courses/National5Maths/
├── 01_QuestionCatalog/
├── 02_AnswerCatalog/
├── 03_SkillCatalog/
├── 04_QuestionGeneration/
├── 05_AnswerGeneration/
├── 06_VisualAssets/
├── Skills/
├── AssessmentConfig.ts
├── CatalogCoreTypes.ts
├── CatalogVisualEvidenceTypes.ts
└── ARCHITECTURE.md
```

Detailed rules live in the local `ARCHITECTURE.md`.

The six ordered layers are meaningful workflow architecture, not decorative numbering.

---

## 17. Six-Layer Evidence-to-Generation Flow

```text
01_QuestionCatalog ──┐
                     ├──► 03_SkillCatalog ───► 04_QuestionGeneration
02_AnswerCatalog ────┘            │
                                  └──────────► 05_AnswerGeneration

04 / 05 ──────────────────────────► 06_VisualAssets when required
```

Shared catalogue contracts sit upstream of generation.

Historical evidence is stored once. Skill-level conclusions are synthesised once. Runtime generators consume reviewed synthesis rather than re-analysing individual year files.

---

## 18. Historical Catalogue Boundary

`01_QuestionCatalog` owns historical question truth.

`02_AnswerCatalog` owns historical marking truth.

These layers may describe mathematical structure, response-space measurements, visual semantics, mark pathways, classification and source locators, but they must obey the source-isolation rules in `AGENTS.md`.

Historical evidence must not be rewritten to agree with project-authored Skills metadata.

Question and matching marking evidence are separate records but one evidence pair.

---

## 19. Skill Catalog Boundary

`03_SkillCatalog` is the reviewed cross-corpus synthesis layer.

It consumes historical-only views of the Question and Answer Catalogues and answers:

> What does the complete historical evidence teach us about this skill?

It owns observed patterns, family analysis, calibration, difficulty mechanisms, marking patterns and controlled generation envelopes.

It must not become a second copy of the historical database.

---

## 20. Generation Boundaries

`04_QuestionGeneration` manufactures new question instances.

`05_AnswerGeneration` manufactures marking and worked solutions paired to the exact generated mathematical state.

`06_VisualAssets` owns generated visual blueprints, rendering capability and generated-output visual validation.

Historical visual semantics remain catalogue evidence and do not move downstream merely because a generator later consumes the mathematical meaning.

---

## 21. National 5 Mathematics Runtime Composition

`app/Courses/National5Maths/AssessmentConfig.ts` is the Course-facing composition root.

It imports:

```text
Skills/National5MathsSkills
Skills/BuilderSkillRegistry
CourseAssessmentConfig type
```

and exports the concrete Course Assessment configuration.

The Skills registry applies generator capability to the canonical Skills data before the Course config exposes the tree to generic Assessment consumers.

---

## 22. Builder Skill Registration

`Skills/BuilderSkillRegistry.ts` is the single composition point for migrated skill capability.

It imports individual skill registrations and the generic Skills contract.

It exports:

```text
applyBuilderSkillRegistrations
NATIONAL5_MATHS_BUILDER_SKILL_REGISTRATION_IDS
```

Registrations must not chain through one another. Adding a new migrated skill should mean adding its own registration rather than editing a previously migrated skill.

---

## 23. Question Generation Registry

`04_QuestionGeneration/Registry.ts` is the canonical Builder-facing question dispatch boundary.

It imports generic Assessment generation/selection contracts plus registered concept modules.

It exports the principal dispatch/selection functions:

```text
conceptSelectionText
getConceptFromSelection
getAvailableDifficultiesForConcept
isDifficultyEligibleForConcept
getEligibleDifficultiesForConcept
buildGenerated
buildSkillLinks
```

When a concept appears in the Skills Tree but does not generate correctly, this registry and the relevant concept module are primary troubleshooting points.

Some not-yet-migrated concept modules still enter through `National5MathsLegacy`. That compatibility tree is not the preferred owner for new work and should not be expanded merely for convenience.

---

## 24. Current Compatibility Seam

`tsconfig.json` currently contains a targeted alias that resolves the historical National 5 Mathematics alias to `National5MathsLegacy`.

The normal root alias remains separate.

This means new clean-workspace National 5 Mathematics code should not assume that the historical Course alias points at the six-layer workspace.

Use deliberate imports and inspect alias resolution when troubleshooting unexpected module selection.

The compatibility tree exists to keep untouched runtime generators working while individual skills are migrated into the canonical architecture. New generator development should target the six-layer workspace.

---

# Classes

## 25. Classes Domain

`app/Classes/` owns class records, class persistence, class pages and coverage behaviour.

Classes may reference a Course identity but does not own curriculum definitions.

Educational structure should flow through:

```text
SchoolClass.courseId
        ↓
CourseRegistry
        ↓
CourseAssessmentConfig
        ↓
skillTree
```

Generic Classes code should not import a concrete Course's skills merely because that Course is currently the most complete.

---

## 26. Privacy Boundary

Pupil identity should not need to be stored by the application server merely to support class/assessment workflow.

Where pupil identity becomes necessary, prefer non-identifying IDs and teacher-owned/local mapping where practical.

Future OCR, assisted-marking or analytics work must not casually weaken this privacy boundary.

Specific future features belong in backlog documentation until implementation requires real architecture.

---

# Home and My Assessments

## 27. Home

`app/Home/` owns the Home-page product experience.

Reusable global presentation remains `UI/Application`-owned even when Home consumes it.

---

## 28. My Assessments

`app/MyAssessments/` owns the user-facing saved-assessment library.

It may browse, filter, sort, preview and manage assessments, but it does not own:

```text
SavedAssessment persistence
PDF generation
Course educational knowledge
```

Preferred direction:

```text
MyAssessments
      ↓
SavedAssessments + Compilation/PDF contracts
```

not the reverse.

---

# UI and Documents

## 29. Application UI

`app/UI/Application/` owns interactive application presentation such as global shell, header, activity rail, settings, theme, typography and reusable controls.

The established visual direction is compact, desktop/workbench-oriented and information-dense, with restrained surfaces, modest radii, thin borders and consistent appearance behaviour.

New application UI should default toward the existing visual language unless an intentional redesign is requested.

---

## 30. Generated Documents

`app/UI/Documents/` owns reusable printable/document presentation.

Generated documents must remain independent of application navigation, drawers, hover behaviour and application-only styling assumptions.

The document dependency direction is:

```text
UI/Documents generic primitives
        ↓
qualification-family templates
        ↓
Course-specific document composition
        ↓
Assessment Compilation
```

A document displayed inside the application does not become Application UI merely because the viewer is interactive.

---

## 31. PDF Architecture

Server PDF generation belongs under Assessment Compilation.

The final PDF should consume the same canonical assessment document meaning used by compilation rather than independently reconstructing the assessment.

My Assessments may cache or display generated PDF assets but does not own PDF generation.

---

# Runtime and State Boundaries

## 32. Client Boundaries

`"use client"` should be introduced only at genuine client entry boundaries.

Nested modules imported below an existing client boundary do not require redundant directives merely because they use hooks or browser APIs.

Avoid defensive client-boundary expansion.

---

## 33. State Management

Use existing React state, hooks and contexts where they fit the owner.

Do not introduce a new global state-management library merely as routine cleanup. A new state system requires a demonstrated architectural problem and a deliberate decision.

Global providers should represent genuinely global state/environment rather than convenience.

---

## 34. Explicit Dependencies

Prefer explicit imports, props, hooks and registry wiring over hidden global/event coupling.

Existing browser-event compatibility may remain while genuinely required, but replacement should follow:

```text
introduce explicit path
        ↓
switch consumers
        ↓
verify
        ↓
remove compatibility path
```

---

# Troubleshooting and Dependency Navigation

## 35. Why Import/Export Mapping Matters

When debugging or rewiring behaviour, the fastest useful question is often not “which folder sounds relevant?” but:

```text
Who imports this module?
What does this module import?
What symbols does it expose?
Which registry/composition root connects it to runtime?
```

For that reason, architecture documentation should identify **boundary modules and composition points**, while the physical repository map should identify concrete files.

An exhaustive import/export graph for every source file should be generated mechanically from source rather than hand-maintained in prose. A hand-written full graph will become stale and therefore dangerous.

The long-term documentation/tooling target is a generated dependency index containing, for each TypeScript/TSX module:

```text
file path
imports
imported symbols where practical
exports
known direct consumers
architectural owner
boundary/registry role where applicable
```

That index should be regenerable after structural work.

---

## 36. Key Wiring Index

The following modules are current high-value troubleshooting entry points:

| Module | Depends on / imports | Provides / exports | Typical reason to inspect |
| --- | --- | --- | --- |
| `app/layout.tsx` | Application globals, settings provider, header, activity rail, shell tokens | root layout + metadata | global shell/theme/layout issue |
| `app/page.tsx` | product page entry points + route handling | application page router | wrong page/route dispatch |
| `app/Courses/CourseAssessmentConfig.ts` | Course identity + generic Assessment types | Course contract types + paper/structure helpers | generic Course behaviour mismatch |
| `app/Courses/CourseRegistry.ts` | concrete Course configs | registry lookup APIs | Course not registered/resolved |
| `app/Courses/National5Maths/AssessmentConfig.ts` | canonical Skills + Builder skill registry + Course contract | concrete National 5 Maths config | skill tree/paper/metric wiring |
| `app/Courses/National5Maths/Skills/BuilderSkillRegistry.ts` | migrated skill registrations | skill-capability composition | migrated skill missing from Builder |
| `app/Courses/National5Maths/04_QuestionGeneration/Registry.ts` | concept modules + generic generation/selection contracts | question dispatch + eligibility APIs | concept/difficulty/generation dispatch |
| `app/Assessments/Compilation/Model/buildAssessmentCompilationDocument.ts` | SavedAssessment + Course Registry/config + pagination | canonical compilation builder | final document content/paper mismatch |

This is intentionally a boundary index, not an attempt to duplicate every leaf import in prose.

---

## 37. Repository Map Responsibility

`Docs/RepositoryMap.md` should remain the human-readable physical map of current source.

When it is rewritten, it should complement this Architecture document by showing:

```text
owner
important entry files
major registries/composition roots
important cross-domain contracts
troubleshooting path
```

It should not preserve obsolete paths simply because they existed historically.

---

# Preservation and Change Rules

## 38. Persistence and Compatibility

Persistence, public routes and active compatibility are external contracts.

Do not remove or rename them merely to make source terminology prettier.

Before removing compatibility, inspect imports, re-exports, registries, dynamic access, browser events, persistence, route dispatch and generated-data consumers.

Once a compatibility implementation has no legitimate consumer, remove it rather than allowing two authorities to drift.

---

## 39. Source Isolation

The non-negotiable source/copyright isolation rules live in `AGENTS.md` and apply to every architecture layer.

Architecture must preserve the separation between:

```text
historical evidence
        ↓
normalised facts / reviewed synthesis
        ↓
independently authored generation
```

Historical wording and artwork are not runtime template assets.

Neutral year/paper/question locators and mathematical/structural evidence remain valid traceability data.

---

## 40. Verification

Verification should be proportional to risk.

Use TypeScript, architecture checks, lint/build, runtime tests and browser/document inspection where the changed area could plausibly be affected.

For National 5 Mathematics structural/content-boundary work, the architecture guard is:

```bash
npm run check:n5-architecture
```

A TypeScript graph check is:

```bash
npx tsc --noEmit
```

These checks are not required as ritual after every harmless prose edit, but should be run often enough that structural breakage cannot accumulate unnoticed.

---

## 41. Definition of Good Architecture

A strong change should leave the answer to these questions clearer:

```text
Who owns this responsibility?
What does it consume?
What consumes it?
What contract does it expose?
Does it preserve Course independence?
Does it preserve persistence and public behaviour?
Does it preserve source isolation?
Can the next developer find the wiring quickly?
```

If the repository becomes harder to trace after a structural change, the architecture has not improved.
