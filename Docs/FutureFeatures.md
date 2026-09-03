# N5 Assessment Tool — Future Features

## 1. Purpose

This file is the active forward-looking backlog for useful work that is not yet complete.

It records ideas, planned follow-up and deliberately deferred work so they do not depend on chat memory.

An entry here does **not** automatically:

```text
approve implementation
create a deadline
establish architecture
justify placeholder source folders
change a locked decision
```

Current binding rules live in `AGENTS.md` and `Docs/LockedDecisions.md`.

Implemented work should leave this active backlog and, where historically useful, be recorded in `Docs/FeatureHistory.md`.

---

## 2. Status Vocabulary

```text
PLANNED
→ accepted direction; implementation remains outstanding

INVESTIGATE
→ useful direction, but important design/technical questions remain

DEFERRED
→ intentionally postponed until another dependency or priority is ready

IDEA
→ worth preserving, not yet designed

PARKED
→ retain for later; not an active priority
```

Keep entries concise enough that the backlog remains useful.

---

# Near-Term Technical and Compliance Work

## FF-001 — Repository-wide source-isolation compliance sweep

**Status:** PLANNED  
**Area:** Repository / legal-source isolation

Audit repository-authored source, comments, documentation, metadata and developer tooling for prohibited awarding-body identifiers and any stored historical examination wording that should not remain in authored repository content.

The target state is that a repository-wide text search cannot recover prohibited organisation identifiers or verbatim historical questions from authored files.

Neutral historical locators such as year / paper / question number remain permitted.

This should be a deliberate whole-repository pass rather than opportunistic piecemeal edits because persistence, compatibility and developer-only names may require careful treatment.

---

## FF-002 — Automated source-isolation guard

**Status:** PLANNED  
**Area:** Repository tooling

After the manual compliance sweep establishes the intended clean baseline, add a lightweight automated check that fails when prohibited source-identifying terms are reintroduced into authored repository content.

The check should be simple, inspectable and maintainable.

Where practical, extend the idea beyond branding to detect known forbidden literal source fragments without storing substantial protected source text inside the repository solely to perform the check.

---

## FF-003 — Generated import/export dependency map

**Status:** PLANNED  
**Area:** Repository tooling / documentation

Generate a machine-derived dependency index for TypeScript/TSX source so troubleshooting and rewiring can begin from actual module relationships rather than manual archaeology.

Target output:

```text
Docs/DependencyMap.md
```

For each source module, capture where practical:

```text
file path
architectural owner
imports
imported symbols
exports
direct consumers
registry/composition role
```

The index must be regenerable from source. Do not maintain a complete per-file dependency graph manually in prose.

---

## FF-004 — Canonicalise the remaining A8 Builder adapter

**Status:** PLANNED  
**Area:** National 5 Mathematics / generation integration

The A8 simultaneous-equations generation capability still reaches Builder through a physical compatibility implementation even though its catalogue/generation dependencies have moved toward the canonical architecture.

Create a clean canonical Builder-facing module/adapter under the six-layer workspace, switch the generation registry to it and verify A8 generation/worked-answer behaviour before removing that specific compatibility seam.

Do not rewrite already-working mathematical generation merely to change its physical owner.

---

## FF-005 — Retire remaining National 5 Mathematics compatibility generation incrementally

**Status:** DEFERRED / ONGOING MIGRATION  
**Area:** National 5 Mathematics / Course integration

A compatibility Course tree and targeted TypeScript alias remain because several untouched concept generators still depend on the older implementation.

Retire those seams skill-by-skill as real catalogue/generator work reaches them:

```text
establish canonical replacement
→ switch registry/consumer
→ verify
→ search compatibility usage
→ remove proven-obsolete seam
```

Do not launch a blind rewrite of every remaining generator solely to eliminate the compatibility tree.

Remove the alias/tree only when legitimate consumers are gone.

---

## FF-006 — Remove obsolete Application Settings compatibility files

**Status:** DEFERRED MAINTENANCE  
**Area:** Application UI

Audit the remaining historical Settings compatibility area and remove/rehome files only when their consumers are proven migrated or absent.

New global settings work should continue to use the current Application Settings/Shell ownership rather than expanding old compatibility structure.

---

## FF-007 — Continue targeted Course-independence audits

**Status:** PARKED MAINTENANCE  
**Area:** Assessments / Classes / Courses

When feature work exposes a concrete Course-specific dependency inside generic Assessment or Classes code, determine whether the variation belongs behind an existing Course contract or warrants a small contract extension.

Do not start a repository-wide abstraction exercise without a real consumer problem.

---

# National 5 Mathematics Catalogue and Generation Programme

## FF-008 — Continue paired historical Question and Answer cataloguing

**Status:** PLANNED  
**Area:** `01_QuestionCatalog` / `02_AnswerCatalog`

Continue chronological source capture across the intended historical corpus using one Question Catalogue record and one matching Answer Catalogue record per numbered question.

Question and marking evidence should be cross-checked as a pair while remaining physically separate owners.

Catalogue work must preserve mathematical, marking, response-space, visual and classification evidence without storing historical wording/artwork as reusable content.

Avoid embedding transient completion counts in this backlog; current catalogue state should be established from source.

---

## FF-009 — Prove the full catalogue-to-generator pipeline on another skill

**Status:** PLANNED / HIGH VALUE  
**Area:** `03_SkillCatalog` → `04_QuestionGeneration` → `05_AnswerGeneration`

Before investing exclusively in mass chronological population, take another representative skill through the complete vertical slice:

```text
identify all historical evidence for the skill
→ catalogue/cross-check required Question + Answer records
→ create reviewed Skill Catalogue synthesis
→ implement Question generator
→ implement paired Answer generator
→ wire into Builder
→ test variation/originality/output quality
```

Choose a skill materially different from the already-hardened algebraic examples so the architecture is tested against a new question family.

The aim is to prove that the catalogue contract produces high-quality Builder output before hundreds of additional records are populated.

---

## FF-010 — Expand Skill Catalogue synthesis skill-by-skill

**Status:** PLANNED  
**Area:** `03_SkillCatalog`

Build reviewed cross-corpus synthesis for each skill once enough historical Question/Answer evidence exists.

Skill Catalogue entries should distinguish:

```text
what was actually observed
cross-corpus patterns
marking patterns
difficulty mechanisms
safe invariants
controlled generation extensions
```

Do not duplicate historical records into skill folders.

---

## FF-011 — Expand original Question generation skill-by-skill

**Status:** PLANNED  
**Area:** `04_QuestionGeneration`

Develop executable generators from reviewed Skill Catalogue synthesis rather than directly from individual historical questions.

Each generator should provide meaningful variation in mathematics and surface form while preserving the skill's authentic assessment characteristics.

Avoid “same question, different numbers” construction wherever the skill permits richer variation.

---

## FF-012 — Expand paired Answer/marking generation

**Status:** PLANNED  
**Area:** `05_AnswerGeneration`

For each generated question family, manufacture marking and worked-answer output from the exact generated mathematical state.

Support legitimate alternative methods, mark-node dependencies, follow-through and presentation requirements where the skill evidence justifies them.

The same generated state should feed both the question and its answer; answer generation must not independently guess/reconstruct values.

---

## FF-013 — Generated-question originality and collision testing

**Status:** PLANNED  
**Area:** National 5 Mathematics / generator validation

Add generator validation aimed specifically at preventing historical-question reconstruction.

Testing should include large sample runs and structural/literal similarity checks sufficient to expose generators whose parameter spaces are too narrow or whose surface construction is effectively a historical template.

The goal is not to reject ordinary unavoidable mathematical similarity in basic skills. It is to detect suspiciously close recreation of a known historical instance and improve the generator's variation envelope.

Design this without embedding full protected source questions into runtime generator code.

---

## FF-014 — Expand deterministic mathematical visual capability

**Status:** PLANNED / ITERATIVE  
**Area:** `06_VisualAssets`

Build renderer families as generator work requires them, prioritising deterministic code-driven mathematical visuals.

Likely families include:

```text
2D geometry
circle geometry
function graphs
scattergraphs
vectors / grids
bearings/navigation
coordinate diagrams
solids/composite solids
response surfaces
```

Generated visuals should consume mathematical/semantic specifications and create independent layouts rather than reproduce historical source artwork.

Context photography/illustration may use approved original/licensed assets with licence metadata where required.

---

## FF-015 — Reconcile Skills Tree metadata from mature corpus evidence

**Status:** DEFERRED UNTIL EVIDENCE IS SUFFICIENT  
**Area:** National 5 Mathematics / Skills

The project-authored Skills Tree may contain paper-suitability, classification or other assumptions that historical evidence contradicts.

Continue recording the historical evidence faithfully and flag mismatches during catalogue work.

When enough corpus evidence exists, perform a systematic reconciliation pass rather than making isolated reactive edits whenever one mismatch appears.

---

## FF-016 — Tighten catalogue completeness validation

**Status:** PLANNED / AFTER CONTRACT MATURITY  
**Area:** catalogue contracts / architecture guard

As the Question and Answer catalogue contracts survive a wider range of real historical evidence, strengthen validation so reviewed records cannot silently omit fields that have become genuinely mandatory.

Potential validation targets include:

```text
source/counterpart linkage
part/mark integrity
classification completeness
response-space evidence
visual evidence state
review state
mark-node ownership
```

Do not harden assumptions prematurely from one question family.

---

## FF-017 — Evidence-derived Skills Tree / generator progress reporting

**Status:** IDEA  
**Area:** Developer Tools / catalogue programme

Consider a generated progress view showing, by skill and/or historical paper:

```text
Question Catalogue coverage
Answer Catalogue coverage
Skill Catalogue synthesis status
Question Generator status
Answer Generator status
visual capability dependencies
validation state
```

If implemented, derive this from canonical source records rather than maintaining a second manual progress database.

---

# Assessment Library and Creator

## FF-018 — Archive assessments by academic year

**Status:** PLANNED / DEFERRED  
**Area:** My Assessments

Allow teachers to archive older assessments so the active library remains manageable across multiple academic years while archived work remains accessible and restorable.

Build on the current library rather than creating a second assessment store.

---

## FF-019 — Formal assessment finalisation workflow

**Status:** INVESTIGATE  
**Area:** Assessment lifecycle / My Assessments

Design what it means for an assessment to move from Draft to a genuinely final/complete state.

Questions include:

```text
what action finalises it?
can it be reopened?
does finalisation freeze content?
does printing/PDF generation affect state?
```

Do not infer lifecycle semantics from the current status field alone.

---

## FF-020 — Compile readiness signalling

**Status:** DEFERRED  
**Area:** Assessment Creator / HUD

Once readiness rules are defined, give the Compile action a restrained indication that the assessment is ready.

Preferred interaction direction remains one subtle transition/pulse into a richer static ready state rather than continuous animation.

---

## FF-021 — Compile-time duration reconciliation

**Status:** INVESTIGATE  
**Area:** Assessment Creator / Compilation / paper sitting

Compare final marks/duration with the teacher's intended sitting duration at compile time and surface a useful discrepancy when appropriate.

Respect deliberate teacher overrides; this should warn/reconcile rather than silently rewrite timings.

---

## FF-022 — Teacher assessment calendar

**Status:** IDEA  
**Area:** Application shell / My Assessments / planning

Explore a teacher-facing calendar accessible from the side action area showing upcoming/planned assessment dates and, once lifecycle semantics exist, useful readiness/completion state.

Reuse canonical assessment records and dates rather than creating a parallel planning database.

---

## FF-023 — Account/login controls

**Status:** PARKED  
**Area:** Application shell

The HeaderBar right region may later host account/login identity and controls once authentication/account architecture is actually designed.

Do not pre-build account architecture solely because presentation space is available.

---

# Future Courses

## FF-024 — Higher Mathematics

**Status:** IDEA  
**Area:** Courses

Add a Higher Mathematics sibling Course when product priorities justify it.

Reuse generic Assessment/Class architecture rather than cloning the National 5 Mathematics workflow.

Create Course-specific folders only when real implementation begins.

---

## FF-025 — Advanced Higher Mathematics

**Status:** IDEA  
**Area:** Courses

Potential future sibling Course after the generic Course boundaries have been exercised by additional real implementations.

Do not create placeholder source architecture in advance.

---

## FF-026 — Expand National 5 Applications of Mathematics

**Status:** IDEA / INVESTIGATE  
**Area:** Courses

Expand the existing Course owner with genuine configuration, skills, documents and question/answer generation when required.

Do not mirror the National 5 Mathematics folder tree mechanically merely for symmetry.

---

# Scanning, Marking and Pupil Workflow

## FF-027 — QR-coded assessment scripts

**Status:** IDEA / INVESTIGATE  
**Area:** future marking workflow

Explore generated non-identifying page/script identifiers that allow scanned responses to be associated with the correct assessment, page and pupil ID without embedding pupil names into server-visible document metadata.

Any implementation must preserve the locked pupil-identity privacy boundary.

---

## FF-028 — Batch scanned-script ingestion

**Status:** IDEA / INVESTIGATE  
**Area:** future marking workflow

Explore a teacher workflow for importing a batch scan/PDF and separating or identifying individual scripts/pages using generated identifiers.

Design the real workflow before creating source architecture.

---

## FF-029 — OCR-assisted response recognition

**Status:** IDEA / INVESTIGATE  
**Area:** future marking workflow

Investigate recognition of handwritten/printed pupil responses as an assistive stage for marking.

Early design should assume teacher review/correction and measured reliability rather than fully automatic recognition.

Privacy, processing location, retention and error handling require explicit design before implementation.

---

## FF-030 — Teacher-confirmed marking evaluation dataset

**Status:** IDEA / INVESTIGATE  
**Area:** future marking workflow

If assisted recognition/marking progresses, investigate whether appropriately governed teacher-confirmed examples can support evaluation and improvement.

Consent, anonymisation, retention, access and data-protection requirements must be designed before collecting such data.

No pilot scale is committed by this entry.

---

## FF-031 — AI-assisted marking

**Status:** LONG-TERM IDEA  
**Area:** future marking workflow

Explore AI support for suggesting marks/feedback only after sufficient recognition quality, evaluation evidence and teacher-review workflow exist.

Teachers must remain able to review and override suggestions, and reliability must be measured rather than assumed.

This is a long-term direction, not a near-term implementation instruction.

---

## FF-032 — Local pupil-ID/name mapping UX

**Status:** IDEA / FUTURE UX  
**Area:** Classes / future pupil workflow

Make the locked privacy model easy to use: the application should be able to operate on non-identifying pupil IDs while teacher-facing local mapping supplies names where practical.

Future scanning/marking flows should preserve this model rather than weakening it for convenience.

---

# Backlog Maintenance

## 3. Keep This File Forward-Looking

When an item is completed:

```text
remove it from the active backlog
        ↓
record the meaningful implemented outcome in FeatureHistory when useful
```

Do not leave implemented items here indefinitely as a second historical ledger.

When current architecture changes, update stale paths in active backlog items.

When an idea becomes a binding rule, move the rule to `LockedDecisions.md` rather than trying to make this file authoritative.

Do not add speculative items merely to make the roadmap appear larger.
