import type { WeightedItem } from "./evidence-types";

/**
 * Picks a weighted item safely:
 * - Works with any array length
 * - Handles zero/negative weights by falling back to uniform selection
 */
export function pickWeighted<TId extends string>(items: WeightedItem<TId>[]): WeightedItem<TId> {
  if (!items.length) {
    throw new Error("pickWeighted: items array is empty");
  }

  const total = items.reduce((sum, item) => sum + Math.max(0, item.weight), 0);

  // If all weights are 0 (or negative), fall back to uniform selection
  if (total <= 0) {
    return items[Math.floor(Math.random() * items.length)];
  }

  let r = Math.random() * total;

  for (const item of items) {
    r -= Math.max(0, item.weight);
    if (r <= 0) return item;
  }

  // Failsafe
  return items[items.length - 1];
}