/**
 * Generic weighted item type used throughout the evidence engine.
 * IDs are intentionally strings (not "A" | "B" | "C") so any number of prompt styles
 * can be supported per skill.
 */
export type WeightedItem<TId extends string = string> = {
  id: TId;
  weight: number;
};

/**
 * Backwards-friendly aliases (in case other parts of the app use these names).
 * Keep these lean and generic to avoid future refactors.
 */
export type PromptWeight<TId extends string = string> = WeightedItem<TId>;
export type MarksWeight<TId extends string = string> = WeightedItem<TId>;