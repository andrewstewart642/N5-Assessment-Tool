# National 5 Maths Answer Generation

Answer-generation source mirrors Question Generation by **curriculum domain -> skill**.

It is not organised by historical year. Historical marking-scheme evidence remains in `02_AnswerCatalog` and is consumed across the relevant skill corpus.

Domain folders follow the Skills Tree order:

- `01-Numerical`
- `02-Algebraic`
- `03-Geometric`
- `04-Trigonometric`
- `05-Statistical`

Each skill should normally have one answer engine that consumes the exact generated-question state. Do not fork separate answer engines merely because the teacher selected a different question family; family-specific behaviour should branch from the shared generated state where necessary.

For A8, `02-Algebraic/ALG-A8-SimultaneousEquations/` remains the single answer-generation owner for mixed, basic, contextual, graph and derived-total simultaneous-equations questions.
