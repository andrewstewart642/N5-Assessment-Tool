# N2 Indices Skill Synthesis

This folder contains the reviewed cross-corpus synthesis for `num-n2-indices`.

The historical bank currently contains eleven paired Question/Answer Catalogue records spanning three top-level families: fractional-index evaluation, bracketed index laws and multi-law simplification. SkillCatalog keeps those source records immutable and synthesises only the recurring family structure, mark-standard behaviour, difficulty levers, surface patterns and generation guardrails needed by downstream question/answer generators.

Key conclusions fixed by the first N2 pass:

- all 28 reviewed N2 marks are Operational;
- the corpus contains 12 C marks and 16 A marks;
- C/A standard is not a property of the broad multi-law family: the reviewed examples span wholly C, mixed C/A and wholly A demand;
- numerical fractional-index evaluation is a stable two-mark A-standard family in the current bank;
- bracketed index-law evidence supports two distinct two-mark mechanisms rather than one unrestricted bracket generator;
- the repeated power-of-a-power with negative-index structure is the strongest repeated symbolic subfamily anchor;
- historical answer-only policy varies and must not be universalised by generation.

`HistoricalEvidence.ts` is the only source-bank ingress. The remaining files operate on reviewed synthesis and must not import raw year records directly.
