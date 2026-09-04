# N2 Indices Question Generation

`N2_INDICES_V1` is the authoritative question-generation engine for the reviewed N2 indices skill slice.

The engine consumes only `03_SkillCatalog` synthesis. Public skill labels are intentionally compact (`N2.1` Simplify indices, `N2.2` Expand and simplify, `N2.3` Evaluate fractional indices); the more detailed families and mechanisms remain internal generation variants rather than separate pupil-facing skills.

The engine selects a reviewed family/mechanism, then samples compact parameters inside a requested difficulty band. Difficulty is instance-level: the historical mechanism difficulty is the default anchor, not a permanent lock. The same mechanism can therefore produce lower- and upper-band instances when the mathematical envelope supports both.

V1 supports all nine reviewed internal mechanisms, including numerical fractional-index evaluation, the two bracketed mechanisms and the six multi-law mechanisms. The moderated pass keeps those mechanism grammars but tightens their generated surface and parameter envelopes so that variation remains examination-natural rather than becoming artificially difficult or mechanically repetitive.

The main difficulty rules are now deliberately skill-specific. N2.2 lower-band generation stays close to a compact integer-outside/fractional-plus-negative-term structure, while upper-band generation adds one controlled representation lever at a time. N2.3 upper-band generation can be harder because of perfect-power recognition or a less routine fractional numerator as well as exact-value size; very large exact answers are stretch cases rather than the normal target.

Every generated N2 item is Operational. C/A standard and tariff continue to come from the selected mechanism rather than from difficulty or law count.

Prompt grammar is intentionally terse and notation-led. Positive-power output requirements are separated from the main simplify command and the word **positive** is emphasised. Reciprocal-root questions prescribe a compact same-base power form. Generation also rejects exact historical parameter fingerprints where a new item would otherwise amount to a trivial relabelling.

Question typography is generated semantically for KaTeX: top-level fractions use a clear display-style fraction, while fractional exponents use a script-style fraction with an explicitly visible rule so the exponent remains smaller, higher and visually distinct from the main expression.

This folder deliberately owns question generation only. Paired marking/worked answers are owned by `05_AnswerGeneration/01-Numerical/NUM-N2-Indices/`, and DeveloperTools consumes both canonical layers without duplicating generation logic.
