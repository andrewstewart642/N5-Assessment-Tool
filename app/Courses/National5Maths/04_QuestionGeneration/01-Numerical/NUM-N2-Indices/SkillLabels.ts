import {
  N2_SKILL_PARENT_LABEL,
  N2_SKILLS,
} from "../../../03_SkillCatalog/01-Numerical/NUM-N2-Indices/N2SkillTaxonomy";
import type { N2GeneratorMechanism, N2GeneratorSkillId } from "./Types";

export { N2_SKILL_PARENT_LABEL, N2_SKILLS };

export const N2_MECHANISMS_BY_SKILL: Record<N2GeneratorSkillId, readonly N2GeneratorMechanism[]> = {
  "N2.1": [
    "PRODUCT_QUOTIENT_WITH_COEFFICIENT",
    "POWER_OF_POWER_WITH_NEGATIVE_INDEX",
    "RECIPROCAL_ROOT_TO_NEGATIVE_FRACTIONAL_INDEX",
    "SQUARED_FRACTIONAL_MONOMIAL",
    "PRODUCT_OVER_ROOT",
    "NEGATIVE_INDEX_QUOTIENT",
    "POSITIVE_POWER_PRODUCT_QUOTIENT",
  ],
  "N2.2": ["DISTRIBUTIVE_INDEX_EXPANSION"],
  "N2.3": ["FRACTIONAL_NUMERIC_EVALUATION"],
};

export const n2SkillForMechanism = (mechanism: N2GeneratorMechanism) => {
  const skill = N2_SKILLS.find((entry) =>
    (N2_MECHANISMS_BY_SKILL[entry.id] as readonly N2GeneratorMechanism[]).includes(mechanism),
  );
  if (!skill) throw new Error(`No public N2 skill label is mapped to ${mechanism}.`);
  return skill;
};
