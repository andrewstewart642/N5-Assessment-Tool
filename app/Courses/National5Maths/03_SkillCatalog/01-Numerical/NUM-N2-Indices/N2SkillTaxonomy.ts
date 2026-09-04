export type N2SkillId = "N2.1" | "N2.2" | "N2.3";

export const N2_SKILL_PARENT_LABEL = "N2 Simplify expressions using the laws of indices" as const;

export const N2_SKILLS: readonly { id: N2SkillId; label: string }[] = [
  { id: "N2.1", label: "Simplify indices" },
  { id: "N2.2", label: "Expand and simplify" },
  { id: "N2.3", label: "Evaluate fractional indices" },
] as const;
