# N5 Assessment Tool — Agent Operating Contract

## 1. Purpose

`AGENTS.md` is the mandatory first-read contract for anyone making changes to this repository.

It defines the rules that must remain visible even when individual features, branches or implementation details change.

Use the more detailed documents for current architecture, physical repository layout, workflow, decisions, project status and history. Current-state documentation must describe the repository as it exists now; historical material belongs in designated history documents and Git history.

---

## 2. Project Intent

The project is an assessment-building and assessment-management application designed to support high-quality Course-aware assessment creation, preview, saving, management, compilation and PDF generation.

The architecture should support multiple Courses without forcing generic Assessment, Classes or UI code to depend directly on one concrete Course implementation.

For National 5 Mathematics, the long-term content goal is not merely to store old examinations. It is to build a structured evidence base from historical assessment material, synthesise what that evidence teaches us about individual mathematical skills, and use that reviewed synthesis to manufacture new, original questions, marking schemes, worked solutions and visuals.

---

## 3. Non-Negotiable Source and Copyright Isolation

Historical examination material is **reference evidence only**.

This rule is structural and applies throughout catalogue work, generation work, documentation, source comments, visual work and generated assessment content.

### 3.1 Never copy historical question or marking wording

Do not reproduce a historical examination question, marking instruction or worked solution verbatim in repository-authored content.

Do not create near-verbatim or minimally altered versions by changing only numbers, names, objects, units or superficial wording when a more independent construction is reasonably possible.

The intended process is:

```text
historical evidence
        ↓
normalised mathematical / structural / design facts
        ↓
cross-corpus synthesis
        ↓
independently authored generated question
```

It is **not**:

```text
historical question
        ↓
change a few values or nouns
        ↓
new question
```

For very simple mathematical tasks, complete structural uniqueness may be impossible. In those cases preserve the mathematics while still varying wording, values, representation, surface structure and other safe dimensions where reasonable.

### 3.2 Avoid accidental regeneration of a historical question

A generator should not be capable, through ordinary random variation, of intentionally reconstructing a known historical question.

Where practical, generation design and validation should use historical fingerprints, observed parameter combinations and family evidence to steer away from exact historical instances.

The goal is that repeated use of a generator does not eventually reveal the original examination bank by chance.

### 3.3 Catalogue wording must be independently authored

Catalogue records may describe source meaning very closely where precision is required, but prose must be independently written.

Preserve mathematical integrity, assessment intent, relationships, command meaning and natural examination style without storing source sentences as reusable text.

Neutral source locators such as:

```text
2019 P2 Q4
2024 P1 Q7
```

are allowed for traceability.

### 3.4 Awarding-body names and acronyms are prohibited in authored repository content

Do not place official awarding-body names or acronyms in source files, comments, documentation, catalogue prose, generated questions, generated answers, visual metadata or other repository-authored content.

Use neutral language such as:

```text
historical source
historical examination
source question paper
source marking instructions
awarding body
official examination material
```

External source files used as evidence are not rewritten merely to remove their original publisher identity, but authored project files must remain clean.

### 3.5 Historical artwork is evidence, not an asset library

Do not copy, embed, trace, vector-trace or reuse historical diagrams, images or source geometry.

Do not store source artwork and place it into generated assessments.

It is valid to catalogue the mathematical meaning of a visual, including:

```text
entities
relationships
orientation
labels
scale meaning
candidate interaction
response-surface role
mathematical invariants
required markers
safe variation
```

A circle, chord, radius, perpendicular bisector, graph, grid, triangle or other mathematical construction is not owned as an abstract mathematical idea. The project may independently render the same mathematical relationship without reproducing the source artwork.

Essential mathematical visuals should normally be independently generated through deterministic or procedural rendering.

Context photographs or illustrations may use a curated asset source only where licensing and attribution requirements are understood and recorded.

### 3.6 Historical spacing and dimensions are legitimate evidence

Candidate answer space, working space, page geometry and similar measurements may be recorded precisely, including near pixel-level measurements where useful.

These measurements describe assessment design and may inform generated layout.

They must not become a vehicle for copying source text or source artwork.

---

## 4. Historical Evidence Must Remain Truthful

The historical question paper and matching marking instructions are authoritative evidence for what actually appeared and how marks were awarded.

Project-authored structures such as the Skills Tree, generator assumptions or existing classifications may be incomplete or wrong.

If source evidence conflicts with project metadata:

```text
record the source fact accurately
        ↓
flag the mismatch
        ↓
review or fix project-authored metadata separately
```

Never distort a historical catalogue entry to make it agree with the current implementation.

Question evidence and matching marking evidence are separate records but form one evidence pair. Do not invent marking behaviour from the question alone when matching marking material exists and has not yet been reviewed.

---

## 5. Catalogue Evidence States and Provenance

Keep evidence state explicit.

```text
VALUE
NOT_APPLICABLE
UNKNOWN
NOT_REVIEWED
```

These states are not interchangeable. In particular, `UNKNOWN` must never silently become `NOT_APPLICABLE`.

Keep provenance explicit:

```text
SOURCE_FACT
CATALOGUE_CLASSIFICATION
GENERATION_ANALYSIS
```

A future developer must be able to distinguish:

- what the historical source directly establishes;
- what the project classified from that evidence;
- what was later inferred or synthesised for generation.

---

## 6. National 5 Mathematics Six-Layer Content Architecture

The canonical National 5 Mathematics content pipeline is:

```text
01_QuestionCatalog
        +
02_AnswerCatalog
        ↓
03_SkillCatalog
        ↓
04_QuestionGeneration
        +
05_AnswerGeneration
        ↓
06_VisualAssets when required
```

Detailed rules live in:

```text
app/Courses/National5Maths/ARCHITECTURE.md
```

The ownership summary is:

- `01_QuestionCatalog` — historical question truth.
- `02_AnswerCatalog` — historical marking truth.
- `03_SkillCatalog` — reviewed cross-corpus synthesis for a skill.
- `04_QuestionGeneration` — executable manufacture of new questions.
- `05_AnswerGeneration` — executable manufacture of paired marking and worked answers.
- `06_VisualAssets` — generated visual capability, rendering and validation.

Historical visual semantics are shared catalogue evidence, not generated visual assets.

Question and Answer Catalogues store historical evidence once. `03_SkillCatalog` synthesises that evidence; it must not become a duplicate historical database.

Generators should normally consume reviewed SkillCatalog synthesis rather than trawling individual historical year files.

---

## 7. Mark-Level Integrity

Historical marking evidence is richer than a final answer string.

Where supported by the source, preserve concepts such as:

```text
mark nodes
method pathways
mark dependencies
follow-through
answer-only treatment
working requirements
alternative valid methods
method restrictions
rounding and precision
units and notation
contextual conclusions
visual marking
shared/general marking policy
```

A marking scheme may be a branching evidence graph rather than one linear worked solution.

Each one-mark node should have one primary Skill owner for totals and metrics. Broader secondary relevance must not double-count marks.

Standard classification and thinking classification are independent dimensions.

---

## 8. Runtime Source and Domain Ownership

Runtime application source lives beneath:

```text
app/
```

Do not recreate a parallel runtime `src/` tree.

The major runtime owners are:

```text
app/Assessments/
app/Classes/
app/Courses/
app/DeveloperTools/
app/Home/
app/MyAssessments/
app/UI/
```

Choose ownership by responsibility, not by shortest import path.

High-level rules:

```text
Assessments
→ generic assessment workflow, persistence and compilation

Classes
→ class records, class workflow and class coverage

Courses
→ educational and Course-specific knowledge

Home
→ Home-page product experience

MyAssessments
→ saved-assessment library UI and workflow

UI/Application
→ interactive application presentation

UI/Documents
→ generated-document presentation

DeveloperTools
→ runtime developer tooling
```

Generic Assessment or Classes code should obtain Course knowledge through Course configuration rather than directly importing one Course's concrete skills or educational rules.

---

## 9. Preserve Working Behaviour

Preservation is acceptance criterion zero for structural work.

Unless behavioural change is explicitly intended, preserve:

- public URLs;
- assessment creation behaviour;
- question and answer generation;
- paper switching;
- previews;
- saved assessments;
- My Assessments behaviour;
- class data;
- application settings;
- generated documents and PDFs;
- browser-persisted data;
- compatibility required by existing records.

Cleaner code that removes working behaviour is not a successful refactor.

---

## 10. Persistence Is a Compatibility Contract

Do not rename persisted keys, persisted fields or compatibility identifiers merely because their wording looks old.

Before changing persistent data, investigate:

```text
existing keys
existing saved records
normalisation
backwards compatibility
optional legacy fields
migration requirements
```

A persistence migration is a separate deliberate change.

---

## 11. Dead Code and Compatibility

Do not delete a file merely because it looks old, contains compatibility wording or has no obvious direct import.

Before deletion, consider:

```text
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
```

Once code is confidently obsolete and its consumers have migrated, delete it rather than preserving a permanent second implementation.

---

## 12. Ownership Before Movement

Before moving or creating a file, ask:

> Which domain owns this responsibility?

Types belong with the concepts they describe.

Avoid global dumping grounds such as:

```text
Helpers/
Utils/
Shared/
Common/
Misc/
shared-types/
math-helpers/
```

unless a durable architectural responsibility genuinely requires one.

Do not create empty folders for hypothetical future work.

---

## 13. File and Folder Naming

The repository naming rule is:

> **Folder = context. Filename = responsibility.**

Optimise for discoverability by responsibility.

A developer who understands the product but not the implementation should be able to browse a path and make a sensible guess about what the file owns.

Practical rules:

- Do not repeat the full parent-folder context in every child filename.
- Keep contextual wording when removing it would make a filename misleading.
- Prefer responsibility names over `Utils`, `Helpers`, `Common`, `Shared` or `Misc`.
- A filename need not start with `use` merely because it exports a React hook; exported hooks still follow React naming convention.
- Meaningful numeric ordering is allowed where ordering communicates real workflow or curriculum structure.
- Source naming changes do not automatically rename public URLs, persisted keys or persisted JSON fields.

---

## 14. Application UI and Document UI Are Different Systems

Interactive application presentation belongs beneath:

```text
app/UI/Application/
```

Generated-document presentation belongs beneath:

```text
app/UI/Documents/
```

Generated documents must not depend on application navigation, drawers, hover state or other application chrome.

The document dependency direction is:

```text
generic document primitives
        ↓
qualification-family templates
        ↓
Course-specific documents
        ↓
Assessment compilation / consumers
```

Do not invert this dependency direction.

---

## 15. Established UI/UX Direction

The application now has a distinct visual language. New interactive UI should default to that existing direction unless a deliberate redesign is requested.

Characteristics include:

- compact desktop/workbench presentation;
- restrained surface contrast;
- modest radii, generally around 4–6px for controls and panels;
- thin borders;
- restrained accent usage;
- clear hierarchy rather than decorative chrome;
- deliberate information density and alignment;
- consistent behaviour across supported appearance modes.

Structural work should not accidentally alter spacing, typography, colours, paper layout, question positioning, cover pages, formula sheets or interactive behaviour.

Generated assessment documents remain visually distinct from the application workbench.

---

## 16. Development Workflow

For non-trivial feature work:

```text
UNDERSTAND CURRENT BEHAVIOUR
        ↓
INSPECT CURRENT SOURCE
        ↓
IDENTIFY OWNER
        ↓
DEFINE A BOUNDED PASS
        ↓
IMPLEMENT
        ↓
VERIFY APPROPRIATELY
        ↓
DOCUMENT MEANINGFUL CHANGE
```

For structural migration:

```text
AUDIT
  ↓
ESTABLISH OWNER
  ↓
WRITE / MOVE CANONICAL IMPLEMENTATION
  ↓
SWITCH CONSUMERS
  ↓
VERIFY
  ↓
SEARCH BROADLY FOR RESIDUE
  ↓
DELETE OLD PATH
  ↓
VERIFY AGAIN
  ↓
DOCUMENT
```

Do not delete the old implementation before the replacement path is working.

Prefer small, understandable changes over unexplained repository-wide mutation.

Automation is appropriate for genuinely repetitive mechanical work only after the operation and scope are clear.

---

## 17. Verification Uses Risk, Not Ritual

Use verification proportionate to the change.

Important available checks include:

```bash
npm run check:n5-architecture
npx tsc --noEmit
npm run lint
npm run build
git --no-pager diff --check
```

Do **not** run every command after every tiny edit merely as ritual.

Run the National 5 Mathematics architecture guard when a change could affect its layer ownership, imports, catalogue/generation boundaries or compatibility paths, and periodically during sustained National 5 Mathematics work so violations cannot accumulate.

Run TypeScript when changes may affect types, imports, module resolution or runtime source structure, and periodically during larger implementation passes so errors do not cascade.

Use lint/build where their scope justifies the cost.

Substantive behavioural changes require runtime/browser verification. Document or PDF infrastructure changes require visual inspection of generated output where appropriate.

A silent `npx tsc --noEmit` completion means TypeScript passed.

---

## 18. Framework and Browser Cautions

Inside `app/`, Next.js special filenames such as `page.tsx`, `layout.tsx` and `route.ts` have framework meaning. Use them only at genuine framework boundaries.

Add `"use client"` only at real client boundaries rather than defensively adding it to nested modules.

If generated Next.js state is clearly stale after a valid source change, rebuild or clear generated output before rewriting correct source. Cache deletion is not a substitute for diagnosing a reproducible source error.

When browser-to-server behaviour fails, use browser console/network evidence and the development-server error before guessing.

---

## 19. Current Truth vs History

Current-state documents must contain current truth.

Do not preserve obsolete paths, branch states or migration instructions inside active documentation merely because they were once correct.

Use this rule:

```text
current truth
→ active docs

historical truth and rationale
→ designated history docs and Git history

new decision
→ current decision record

obsolete current instruction
→ remove or replace after its useful meaning has been retained
```

Nothing materially important should be discarded during documentation migration, but active docs must not become cumulative migration diaries.

---

## 20. Documentation Responsibilities

Architecture changes must update current architecture documentation.

Meaningful completed product/technical changes belong in the project history record.

Future or deferred ideas belong in the project backlog rather than speculative source folders.

When documentation is rewritten, audit the old file before deletion or replacement and explicitly retain any still-relevant rule, rationale, safety constraint or project intention.

The repository must remain understandable without relying on private chat history or model memory.

---

## 21. Final Standard

A good change should leave the repository easier for the next developer to understand and safer for the project to maintain.

Before treating a substantial pass as complete, ask:

- Is ownership clearer?
- Is dependency direction still correct?
- Did working behaviour survive where intended?
- Did persisted data and public routing survive?
- Is there one obvious source of truth?
- Did we avoid creating another permanent compatibility layer?
- Was old code removed only after proving it safe?
- Can the folder path and filename explain responsibility?
- Does current documentation match current source?
- Does historical evidence remain separate from generation logic?
- Could any generated content reproduce or closely expose a historical examination item?
- Have source/copyright isolation rules been preserved?

If the answer to an important question is no, the change is not finished.
