# N2 Indices Question Generation

`N2_INDICES_V1` is the authoritative question-generation engine for the reviewed N2 indices skill slice.

The engine consumes only `03_SkillCatalog` synthesis. Public skill labels are intentionally compact (`N2.1` Simplify indices, `N2.2` Expand and simplify, `N2.3` Evaluate fractional indices); the more detailed families and mechanisms remain internal generation variants rather than separate pupil-facing skills.

The engine selects a reviewed family/mechanism, then samples compact parameters inside a requested difficulty band. Difficulty is instance-level: the historical mechanism difficulty is the default anchor, not a permanent lock. The same mechanism can therefore produce lower- and upper-band instances when the mathematical envelope supports both.

V1 supports all nine reviewed internal mechanisms, including numerical fractional-index evaluation, the two bracketed mechanisms and the six multi-law mechanisms. The refined pass adds controlled structural variation to distributive expansion, negative-index power-of-a-power and reciprocal-root conversion while retaining the reviewed mathematical grammar.

Every generated N2 item is Operational. C/A standard and tariff continue to come from the selected mechanism rather than from difficulty or law count.

Question typography is generated semantically for KaTeX: top-level fractions use a clear display-style fraction, fractional exponents use a legible text-style fraction inside the power, and positive-power output instructions emphasise the word **positive**.

This folder deliberately owns question generation only. Paired marking/worked answers are owned by `05_AnswerGeneration/01-Numerical/NUM-N2-Indices/`, and DeveloperTools consumes both canonical layers without duplicating generation logic.
