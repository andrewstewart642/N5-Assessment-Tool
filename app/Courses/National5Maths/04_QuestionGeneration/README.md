# National 5 Maths Question Generation

Question-generation source is organised by **curriculum domain -> skill**, never by historical exam year.

Historical year/paper evidence belongs in `01_QuestionCatalog` and `02_AnswerCatalog`; generators consume that evidence across the corpus.

Domain folders follow the Skills Tree order:

- `01-Numerical`
- `02-Algebraic`
- `03-Geometric`
- `04-Trigonometric`
- `05-Statistical`

A skill owns one authoritative generation engine. Teacher-selectable question families are thin selectors over that engine rather than duplicated generators.

For A8 this is:

- `A8` - calibrated mixed simultaneous-equations distribution
- `A8.1` - solve simultaneous equations algebraically
- `A8.2` - form and solve simultaneous equations from context
- `A8.3` - find a point of intersection algebraically
- `A8.4` - solve simultaneous equations and calculate a further quantity

The family metadata lives under `02-Algebraic/ALG-A8-SimultaneousEquations/Families/`. The Builder can consume those selectors when the clean National 5 Maths generation layer is wired into Assessment Creation.

Do not create year folders here and do not copy historical wording or artwork into generator templates.
