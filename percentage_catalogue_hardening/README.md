# Percentage catalogue hardening batch

This bundle completes the remaining percentage catalogue hardening pass after the
2014 and 2015 compound-percentage files were already updated manually.

## Scope

The batch updates **38 remaining files**:

- 19 source-question catalogues:
  - 9 remaining compound-percentage questions (2016-2025, excluding 2020)
  - 10 reverse-percentage questions (2014-2025 source corpus)
- 19 source marking-scheme catalogues:
  - 9 remaining compound-percentage marking schemes
  - 10 reverse-percentage marking schemes

The four 2014/2015 compound files already completed before this batch are
intentionally left untouched.

## What changes

### Source questions

Only the `answerSpace` object is replaced. All existing mathematical,
wording/context and generator metadata is preserved.

Each updated question now uses the same reproducible source measurement standard:

- PDF render: 300 dpi
- A4 render: 2481 x 3508 px
- rendered-image origin: top-left
- `pdfPageNumber` recorded
- `topPx`, `bottomPx`, `heightPx`
- point conversions
- millimetre height
- measurement note describing the exact boundaries

The reverse-percentage pass also corrects previously shifted coordinates,
including the known 2017 P2 Q5 issue.

### Marking schemes

Each replacement marking-scheme file now includes:

- normalised method evidence
- mark-by-mark evidence
- explicit expected answer
- correct-answer-without-working treatment
- structured follow-through/error/rounding rules
- commonly observed responses where the historical source documents them
- exact 300-dpi `coreEvidenceBlock`
- exact full question-specific block, including Notes and Commonly Observed
  Responses where present

The 2024 compound question retains the explicitly documented year-by-year
full-credit alternative method.

## Prerequisite

The hardened versions of these two schema files must already be in the repo:

- `course-data/source-question-catalog/SourceQuestionTypes.ts`
- `course-data/source-marking-scheme-catalog/SourceMarkingSchemeTypes.ts`

The apply script checks this before writing anything.

## Apply

From the repository root:

```bash
python path/to/percentage_catalogue_hardening/apply_percentage_catalogue_hardening.py --check
```

Review the file list, then:

```bash
python path/to/percentage_catalogue_hardening/apply_percentage_catalogue_hardening.py --apply
```

A timestamped backup of every changed file is written under:

```text
.percentage_catalogue_hardening_backup/
```

Then verify:

```bash
python path/to/percentage_catalogue_hardening/verify_percentage_catalogue_hardening.py
```

Finally run the project's normal TypeScript/build check.

## Important layout rule

The historical question-paper answer-space measurements preserve the actual SQA
page allocation, including page-layout outliers. They should be used as source
evidence when deriving generator-family spacing, not blindly treated as a
minimum height for every generated instance.

For the marking schemes, `coreEvidenceBlock` is the useful historical
worked-solution footprint. `fullQuestionBlock` intentionally also preserves
diagnostic Notes/Commonly Observed Responses and should **not** be used directly
as the generated worked-answer height.
