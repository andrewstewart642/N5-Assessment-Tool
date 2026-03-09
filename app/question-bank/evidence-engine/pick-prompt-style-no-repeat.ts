import { pickWeighted } from "./pick-weighted";
import type { WeightedItem } from "./evidence-types";

/**
 * Creates a no-repeat picker for weighted IDs.
 * - Supports any number of IDs (vector length adapts automatically)
 * - Avoids back-to-back repeats when possible
 * - Optional adjustPicked() lets a generator bias away from certain IDs
 */
export function createNoRepeatPicker<TId extends string>(weights: WeightedItem<TId>[]) {
  const availableIds = Array.from(new Set(weights.map((w) => w.id)));
  let lastId: TId | null = null;

  return function pickNoRepeat(options?: {
    adjustPicked?: (id: TId) => TId;
    maxTries?: number;
  }): TId {
    if (!weights.length) {
      throw new Error("createNoRepeatPicker: weights array is empty");
    }

    const canAvoidRepeat = availableIds.length > 1;
    const maxTries = options?.maxTries ?? 10;

    for (let i = 0; i < maxTries; i++) {
      let picked = pickWeighted(weights).id;

      if (options?.adjustPicked) {
        picked = options.adjustPicked(picked);
      }

      if (canAvoidRepeat && lastId && picked === lastId) continue;

      lastId = picked;
      return picked;
    }

    // Failsafe: pick a different ID if possible
    if (canAvoidRepeat && lastId) {
      const alt = availableIds.find((id) => id !== lastId);
      if (alt) {
        lastId = alt as TId;
        return alt as TId;
      }
    }

    // Absolute fallback
    lastId = availableIds[0] as TId;
    return availableIds[0] as TId;
  };
}