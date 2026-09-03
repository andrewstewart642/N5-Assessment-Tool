# N5 Assessment Tool — ChatGPT Project Workflow

## 1. Purpose

This document defines how ChatGPT-assisted development is carried out for this repository.

The working model is now:

```text
ChatGPT Project
        +
connected GitHub repository
        +
project source/reference files when available
        +
user's local VS Code / Git Bash checkout
```

The repository remains the durable project record. Chat context is useful working context, but it must not become the only place where an important rule, architectural decision or implementation state exists.

Use:

```text
AGENTS.md
→ mandatory operating, preservation and source-isolation rules

Docs/Architecture.md
→ current architecture and dependency direction

Docs/RepositoryMap.md
→ current physical locations and troubleshooting entry points

app/Courses/National5Maths/ARCHITECTURE.md
→ detailed six-layer National 5 Mathematics content architecture
```

Other project documents provide decisions, backlog and historical context as defined by their current roles.

---

## 2. Core Collaboration Model

The normal workflow is:

```text
USER DEFINES GOAL / ACCEPTANCE CRITERIA
        ↓
CHATGPT INSPECTS CURRENT REMOTE SOURCE
        ↓
TRACE OWNER / IMPORTS / EXPORTS / CONSUMERS
        ↓
AGREE BOUNDED PASS WHEN NEEDED
        ↓
CHATGPT COMMITS CHANGE TO THE WORKING BRANCH
        ↓
USER PULLS THE BRANCH LOCALLY
        ↓
LOCAL TYPE / ARCHITECTURE / RUNTIME CHECKS AS APPROPRIATE
        ↓
USER REPORTS RESULT
        ↓
CERTIFY, REPAIR OR CONTINUE
```

This arrangement keeps repository mutation fast while preserving the user's local machine as the primary runtime/browser verification environment.

Do not pretend a remote edit has been locally verified when it has not.

---

## 3. Repository Truth vs Chat Context

Use this hierarchy when establishing current implementation state:

```text
explicit current user instruction
        ↓
current repository source on the active working branch
        ↓
AGENTS.md / current-state architecture documentation
        ↓
verified local runtime/type-check results supplied by the user
        ↓
project conversation context
        ↓
historical documentation / Git history
```

ChatGPT Project context can accelerate continuity, but it may describe a previous checkpoint. When current source state matters, inspect GitHub rather than relying on remembered paths or assumptions.

If source and documentation disagree, investigate which is stale. Do not silently choose the more convenient version.

---

## 4. Working Branch Discipline

Do not hard-code one permanent development branch into the workflow document.

Before meaningful repository work, establish the current working branch from the conversation, local prompt or connected GitHub state.

For a broad or risky transition, create a preservation checkpoint before mutation when useful.

A good pattern is:

```text
known-good branch head
        ↓
checkpoint branch or tag-like preservation branch
        ↓
dedicated implementation/docs branch
        ↓
bounded commits
        ↓
local verification
        ↓
consolidation when approved
```

Do not modify a preservation checkpoint after it has been created for recovery purposes.

Do not force-update local or remote history merely to make the graph look tidy unless history rewriting is explicitly intended and the consequences are understood.

---

## 5. Connected GitHub and Local Checkout Are Different States

Connected GitHub exposes committed remote state.

The user's local checkout may contain:

```text
unpulled remote commits
uncommitted edits
local-only experiments
generated build state
runtime/browser behaviour
```

Therefore:

- use connected GitHub for current remote source reads and writes;
- use local output supplied by the user for local TypeScript, build and runtime truth;
- do not overwrite or dismiss possible local work merely because it is absent from GitHub;
- if local and remote state may differ materially, resolve that before risky mutation.

When ChatGPT commits directly to GitHub, the normal user handoff is a safe fetch/checkout/pull sequence rather than asking the user to recreate the edit manually.

---

## 6. Do Not Ask the User for Repository Facts the Tools Can Resolve

Before asking the user for a path, file contents, import usage or repository structure, inspect the connected repository when possible.

Ask the user when the missing information is genuinely user-owned, such as:

```text
product intent
behavioural preference
legal/privacy choice
approval to make a significant change
local runtime result
visual judgement
ambiguous acceptance criteria
```

Repository archaeology is normally the assistant's job.

---

## 7. Read Before Write

For a meaningful change, inspect enough surrounding source to answer:

```text
What owns this responsibility?
What imports it?
What does it import?
What does it export?
Which registry/composition root makes it live?
Does persistence, routing or compatibility depend on it?
What else could reasonably break if it changes?
```

Useful read-only techniques include:

```text
repository tree inspection
file reads
code search
import/export tracing
registry tracing
branch/commit inspection
diff comparison
```

For small obvious changes, use proportionate judgement. Do not turn every typo into an architectural investigation.

---

## 8. Use the Repository Map for Fast Troubleshooting

Start with:

```text
Docs/RepositoryMap.md
```

for physical ownership and high-value wiring points.

Start with:

```text
Docs/Architecture.md
```

for dependency direction and architectural boundaries.

When a failure appears after rewiring, trace outward from the changed module:

```text
changed file
        ↓
exports
        ↓
direct consumers
        ↓
registry / composition root
        ↓
runtime feature
```

The long-term target is a mechanically generated dependency index for exhaustive per-file imports, exports and direct consumers. Do not rely on a manually maintained full-module graph.

---

## 9. Scope a Coherent Pass

A good pass has one understandable purpose.

Examples:

```text
migrate one architectural seam
catalogue one defined evidence set
implement one skill generator family
repair one runtime regression
rewrite one documentation file
refine one UI region
```

When an audit exposes unrelated problems, record or report them rather than silently expanding the task.

A structural pass should normally be understandable as:

```text
same intended behaviour
+
clearer owner / dependency direction
```

A feature pass should be understandable in terms of the capability it adds or changes.

---

## 10. Preferred Structural Migration Pattern

For non-trivial structural work, use:

```text
AUDIT CURRENT STATE
        ↓
ESTABLISH OWNER
        ↓
CREATE / MOVE / ADAPT CANONICAL IMPLEMENTATION
        ↓
SWITCH CONSUMERS
        ↓
VERIFY THE NEW PATH
        ↓
SEARCH FOR OLD REFERENCES
        ↓
DELETE OBSOLETE PATH ONLY WHEN PROVEN SAFE
        ↓
VERIFY AGAIN
        ↓
DOCUMENT THE NEW CURRENT TRUTH
```

Do not delete the working implementation first simply because the destination architecture is known.

A thin compatibility adapter is acceptable where migration must be staged, but it should forward to one canonical implementation rather than duplicate behaviour.

---

## 11. Direct Moves vs Rewrites

Move or rename directly when:

```text
implementation is already sound
ownership/path is the real problem
behaviour need not change
import repair is straightforward
```

Rewrite when the responsibility itself is wrong, mixed, unsafe or no longer fits the current contract.

Do not rewrite good code merely to make a refactor look more substantial.

For mechanical renames, preserve exported symbols and persisted/public identifiers unless those are separately approved changes.

---

## 12. GitHub Write Strategy

When the connected GitHub tools can safely perform the work, ChatGPT may commit directly to the current working branch.

Preferred behaviour:

```text
fetch current file/tree
        ↓
verify current SHA / branch head
        ↓
perform bounded write
        ↓
commit with a clear message
        ↓
re-fetch critical result when useful
        ↓
hand user the branch + verification commands
```

For a normal file update, preserve the complete file unless a patch-capable operation is genuinely safer.

For large historical/source files where the connector would require whole-file replacement for a one-line mechanical edit, prefer a safer local mechanical command or codemod rather than unnecessarily rewriting thousands of lines through a remote API.

Do not create a pull request unless the user asks for one or the collaboration mode explicitly requires it.

---

## 13. Local Handoff After Remote Commits

When ChatGPT has already committed changes remotely, give the user exact commands to synchronise the intended branch.

Typical pattern:

```bash
git fetch origin
git checkout <working-branch>
git pull origin <working-branch>
```

If the user is already on the branch, the checkout step may be unnecessary.

Use `git reset --hard` only for a deliberate history/state replacement and only after warning that local uncommitted work would be lost.

A routine forward commit should normally be consumed by a normal pull.

---

## 14. Verification Is Risk-Based

Verification should be frequent enough to catch cascading problems, but not performed mechanically after every tiny edit.

Choose checks according to what could plausibly have broken.

Common checks include:

```bash
npx tsc --noEmit
npm run lint
npm run build
npm run dev
git --no-pager diff --check
```

For National 5 Mathematics architecture-sensitive work, also use when relevant:

```bash
npm run check:n5-architecture
```

Typical guidance:

```text
single documentation rewrite
→ repository/content inspection; source compilation usually unnecessary

small isolated TypeScript change
→ TypeScript; focused runtime test if behaviour changed

cross-folder/import/registry change
→ TypeScript + architecture check where relevant

persistence/routing/document/PDF infrastructure change
→ TypeScript + appropriate build/runtime/browser verification

major architecture checkpoint
→ architecture check + TypeScript + broader runtime smoke test
```

Use common sense. The goal is early failure detection, not ritual.

---

## 15. Interpreting Common Local Results

For:

```bash
npx tsc --noEmit
```

a successful run normally produces no output.

Do not ask the user to rerun a silent successful command merely because it was silent.

For Git Bash:

```text
:
```

at the bottom of the terminal may indicate a pager; `q` exits it.

A continuation prompt such as:

```text
>
```

usually means Bash is waiting for the rest of an unfinished quoted/multiline command; `Ctrl+C` safely cancels it before retrying.

Windows line-ending warnings are not automatically whitespace failures. Use `git --no-pager diff --check` for actual whitespace validation.

---

## 16. Runtime and Browser Verification

When behaviour changes, verify the affected workflow rather than assuming compilation proves correctness.

Relevant areas can include:

```text
Home
Assessment Setup
Assessment Creator
Skills Tree / filters
question generation / regeneration
paper switching
assessment preview
Preview Tray
saved assessment behaviour
Compilation
PDF generation/download
My Assessments
My Classes / Class Details
application settings
```

For browser/server failures use evidence:

```text
browser Network panel
browser Console
local development-server stack trace
```

Do not guess at a server failure from UI symptoms when request/response evidence is available.

Document/PDF changes require visual inspection because page geometry and pagination are product behaviour.

---

## 17. Failure Handling

When verification fails after a structural change:

```text
STOP DELETION / FURTHER EXPANSION
```

Isolate the failing boundary first.

Check likely causes such as:

```text
wrong import path
wrong registry/composition wiring
missed consumer
compatibility seam still active
stale generated framework state
persistence assumption
route change
client/server boundary
incorrect architecture assumption
```

Repair from the most recent known-good checkpoint rather than rewriting unrelated systems.

Never claim a check passed unless it was actually run successfully by the available environment, CI, or the user locally.

---

## 18. National 5 Mathematics Content Work

For National 5 Mathematics, follow the six-layer methodology defined in:

```text
app/Courses/National5Maths/ARCHITECTURE.md
```

The high-level development sequence is:

```text
historical Question evidence
        +
historical Answer/marking evidence
        ↓
reviewed Skill synthesis
        ↓
Question generation
        +
Answer generation
        ↓
generated visuals when required
        ↓
Builder / Assessment runtime
```

Historical year files are evidence records, not runtime generation templates.

Do not bypass `03_SkillCatalog` by teaching new generators to trawl raw historical records directly.

The source-isolation rules in `AGENTS.md` apply throughout this workflow.

---

## 19. Historical Source Analysis in the ChatGPT Project

Historical reference files may be attached or otherwise available inside the ChatGPT Project.

Use them as evidence when the task requires source review.

Important separation:

```text
Project source/reference file
→ evidence being analysed

repository catalogue record
→ independently authored structured description of that evidence

SkillCatalog
→ cross-corpus synthesis

generator
→ independently constructed output logic
```

Project attachments are working inputs, not a substitute for durable repository contracts.

Do not copy source wording or artwork into authored repository content. Follow `AGENTS.md` for the full source-isolation boundary.

---

## 20. Catalogue Pass Workflow

For a historical catalogue pass, work question/answer evidence deliberately rather than mass-transforming old records.

A useful sequence is:

```text
CONFIRM SOURCE ITEM
        ↓
CAPTURE SOURCE-SUPPORTED FACTS
        ↓
CAPTURE RESPONSE / LAYOUT EVIDENCE WHERE USEFUL
        ↓
CAPTURE SEMANTIC VISUAL EVIDENCE
        ↓
CAPTURE MATCHING MARKING EVIDENCE
        ↓
CLASSIFY WITH EXPLICIT PROVENANCE
        ↓
FLAG UNKNOWN / NOT REVIEWED ITEMS HONESTLY
        ↓
VALIDATE THE EVIDENCE PAIR
        ↓
COMMIT A COHERENT CHECKPOINT
```

If a source reveals a characteristic the universal contract cannot represent, strengthen the contract before multiplying the omission across the wider corpus.

---

## 21. Generator Development Workflow

A new or hardened skill generator should be built from reviewed skill-level synthesis rather than one historical question.

Preferred sequence:

```text
identify complete historical corpus for the skill
        ↓
validate Question + Answer evidence coverage
        ↓
synthesise observed families / difficulty / marking patterns
        ↓
define controlled generation envelope
        ↓
implement Question generator
        ↓
implement paired Answer generator
        ↓
register through canonical runtime composition
        ↓
test repeated generation for quality/originality
        ↓
verify Builder integration
```

Repeated generation should be used to look for degenerate, repetitive or historical-instance collisions, not merely to demonstrate that one seed works.

---

## 22. Source Isolation and Compliance Checks

Before treating a content-generation milestone as complete, consider whether authored repository content accidentally contains prohibited source-identifying terms, copied source prose or reused source assets.

These checks should eventually be automated where practical.

If a repository-wide compliance sweep discovers legacy authored violations, handle them as a deliberate cleanup pass rather than silently mixing broad source changes into unrelated feature work.

---

## 23. Persistence and Public Compatibility

Persisted data and public routes are external contracts.

Before changing either, identify:

```text
current readers
current writers
stored key/shape
normalisation
fallback behaviour
existing saved records
route consumers
migration requirement
```

A source naming cleanup does not automatically justify a persisted-data or URL migration.

Ask for explicit approval when a compatibility contract must genuinely change.

---

## 24. UI/UX Work

New interactive UI should default to the established application visual language unless the user requests a redesign.

For UI refinement:

```text
inspect current component / neighbouring patterns
        ↓
make one visible-area change
        ↓
run appropriate source checks
        ↓
inspect in browser
        ↓
iterate from observed result
```

Avoid large speculative visual rewrites when incremental passes can be judged more reliably.

Generated assessment documents are a separate presentation system from the application workbench.

---

## 25. Privacy-Sensitive Work

When Classes, pupil data, future scanning, marking or analytics are involved, preserve the project's privacy boundary.

Do not casually broaden server-visible personally identifying data.

Where practical, prefer non-identifying IDs with teacher-owned/local identity mapping.

A change that weakens the privacy model requires explicit discussion and approval.

---

## 26. Documentation During Development

Current-state documentation contains current truth only.

Update documentation at meaningful checkpoints, such as:

```text
canonical owner changed
major compatibility seam removed
new architecture boundary introduced
important workflow changed
meaningful feature completed
project rule changed
```

Do not maintain a keystroke diary.

Do not preserve obsolete current instructions inside active documents merely for nostalgia. Historical information belongs in designated historical records and Git history.

The repository should remain usable by a future developer who has never read the conversations that produced it.

---

## 27. Commit Discipline

A good commit represents one coherent verified story.

Before treating a pass as banked, check as appropriate:

```bash
git status --short
git --no-pager diff --check
```

and inspect the actual changed files/commit on GitHub.

Do not mix unrelated cleanup into a feature or structural commit without reason.

For long-running work, create meaningful checkpoints before moving into a riskier phase.

---

## 28. Handoff Discipline

After ChatGPT commits a pass, the handoff should normally state:

```text
what changed
branch
commit SHA
what was intentionally not changed
local pull commands
verification commands
expected result
next decision / next bounded pass
```

Keep the handoff concise enough to execute.

Do not make the user decipher a long retrospective before they can pull and test the work.

---

## 29. Starting a New Conversation Inside the Project

A new conversation inside the ChatGPT Project does not need the entire project history pasted back into chat.

Instead:

```text
state the current goal
identify the intended working branch if relevant
reference the relevant current document/source area
let repository inspection establish current implementation state
```

The assistant should use Project context for continuity but verify current repository facts before mutation.

If an important rule exists only in conversation and matters beyond the current task, move it into the appropriate repository document at a meaningful checkpoint.

---

## 30. When to Ask Before Acting

Ask for explicit user direction when the work would:

```text
change product behaviour ambiguously
change a locked/current architectural rule
change public URLs
migrate persisted user data
weaken privacy assumptions
introduce a major new dependency or domain
delete something whose usage remains uncertain
make a legal/source-isolation trade-off
```

Do not ask for approval for every ordinary implementation step within an already-approved bounded pass.

---

## 31. Definition of a Successful Pass

A pass is complete when, proportionate to its risk:

```text
intended change is present
ownership is correct
relevant consumers are wired
existing affected behaviour is preserved
appropriate checks pass
runtime/visual behaviour is verified when required
obsolete code is removed only when safe
documentation matches the new current truth when necessary
a coherent commit/checkpoint exists
```

The standard is not “the file changed”.

The standard is “the requested capability or structural outcome is trustworthy enough to build on”.

---

## 32. Final Working Rule

When unsure:

```text
READ THE CURRENT CONTRACTS
        ↓
INSPECT THE REAL CURRENT SOURCE
        ↓
TRACE IMPORTS / EXPORTS / CONSUMERS
        ↓
ESTABLISH THE OWNER
        ↓
MAKE ONE COHERENT CHANGE
        ↓
VERIFY ACCORDING TO RISK
        ↓
BANK THE RESULT
        ↓
UPDATE CURRENT DOCUMENTATION WHEN THE TRUTH CHANGED
```

The purpose of ChatGPT-assisted development is not to move quickly at the cost of recoverability.

It is to make progress quickly **because** the repository state, ownership, checkpoints and verification remain understandable.