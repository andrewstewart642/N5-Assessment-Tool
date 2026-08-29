import type { AnswerCatalogEntry } from "./AnswerCatalogTypes";
import type { A8AnswerConfig } from "./A8SimultaneousEquationsAnswerTypes";
import { bareEntry } from "./A8SimultaneousEquationsBareAnswerFactory";
import { contextualEntry } from "./A8SimultaneousEquationsContextAnswerFactory";

export type { A8AnswerConfig, A8RejectedMethod } from "./A8SimultaneousEquationsAnswerTypes";

export const createA8AnswerCatalogEntry = (config: A8AnswerConfig): AnswerCatalogEntry =>
  config.surfaceFamily === "CONTEXT_FORM_AND_SOLVE" || config.surfaceFamily === "CONTEXT_DERIVED_TOTAL"
    ? contextualEntry(config)
    : bareEntry(config);
