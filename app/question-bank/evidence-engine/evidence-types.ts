
/**
 * Prompt wording/style category used by the older evidence engine.
 *
 * These IDs correspond to the A / B / C prompt-style labels
 * stored in the historical evidence rows.
 */
export type PromptStyleId =
  | "A"
  | "B"
  | "C";


/**
 * One historical evidence observation.
 *
 * This type describes the older evidence-engine records such as
 * the entries in app/question-bank/evidence/n5/num.ts.
 */
export type EvidenceRow = {
  level: string;

  umbrella: string;

  skillCode2: string;

  conceptCode2?: string;

  year: number | null;

  paper: string;

  question: string;

  promptStyle?: PromptStyleId;

  marks?: number;
};


/**
 * Generic weighted item type used throughout the evidence engine.
 *
 * IDs are intentionally strings rather than a fixed A / B / C union
 * so other weighted selectors can use their own identifiers.
 */
export type WeightedItem<
  TId extends string = string
> = {
  id: TId;

  weight: number;
};


/**
 * Backwards-friendly aliases.
 */
export type PromptWeight<
  TId extends string = string
> =
  WeightedItem<TId>;


export type MarksWeight<
  TId extends string = string
> =
  WeightedItem<TId>;