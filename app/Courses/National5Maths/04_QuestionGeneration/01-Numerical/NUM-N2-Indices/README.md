# N2 Indices Question Generation

`N2_INDICES_V1` is the authoritative question-generation engine for the reviewed N2 indices skill slice.

The engine consumes only `03_SkillCatalog` synthesis. It selects a reviewed family first, then a calibrated mechanism, then samples compact parameters. It does not invent arbitrary combinations of index laws and it does not copy historical prompt wording.

V1 supports:

- core two-mark numerical fractional-index evaluation;
- the two separately calibrated bracket mechanisms;
- six reviewed multi-law mechanisms, including the repeated negative-index power-of-a-power structure.

Every generated N2 item is Operational. C/A standard and tariff come from the selected mechanism rather than from difficulty or law count.

This folder deliberately contains only question generation. Builder-facing paired output remains on the existing legacy N2 path until `05_AnswerGeneration` is implemented for this engine; the subsequent bridge will switch the clean Registry to the paired N2 generator without duplicating answer logic here.
