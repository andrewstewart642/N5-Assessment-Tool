import type {
  CatalogEvidenceRef,
  CatalogMarkClassificationProfile,
  CatalogMarkClassificationSummary,
  CatalogMarkStandard,
  CatalogMarkThinking,
  CatalogProvenance,
} from "../CatalogCoreTypes";
import type { MarkNode } from "./AnswerCatalogTypes";

export type ClassifiedMarkNode = Omit<MarkNode, "skillIds"> & {
  /** V2 compatibility mirror. V3 always contains exactly the owning Skill. */
  skillIds: [string];
  classification: CatalogMarkClassificationProfile;
};

const classifiedValue = <T extends CatalogMarkStandard | CatalogMarkThinking>(
  value: T,
  evidence: CatalogEvidenceRef[],
  provenance: CatalogProvenance,
  notes: string | null,
) => ({
  state: "VALUE" as const,
  value,
  confidence: "HIGH" as const,
  provenance,
  evidence,
  notes,
});

export const classifyMark = (
  mark: MarkNode,
  options: {
    primarySkillId: string;
    standard: CatalogMarkStandard;
    thinking: CatalogMarkThinking;
    standardEvidence: CatalogEvidenceRef[];
    thinkingEvidence: CatalogEvidenceRef[];
    standardProvenance?: CatalogProvenance;
    thinkingProvenance?: CatalogProvenance;
    standardNotes?: string | null;
    thinkingNotes?: string | null;
  },
): ClassifiedMarkNode => ({
  ...mark,
  skillIds: [options.primarySkillId],
  classification: {
    primarySkillId: options.primarySkillId,
    standard: classifiedValue(
      options.standard,
      options.standardEvidence,
      options.standardProvenance ?? "CATALOGUE_CLASSIFICATION",
      options.standardNotes ?? null,
    ),
    thinking: classifiedValue(
      options.thinking,
      options.thinkingEvidence,
      options.thinkingProvenance ?? "CATALOGUE_CLASSIFICATION",
      options.thinkingNotes ?? null,
    ),
  },
});

export const deriveMarkClassificationSummary = (
  markNodes: readonly ClassifiedMarkNode[],
): CatalogMarkClassificationSummary => {
  const summary: CatalogMarkClassificationSummary = {
    skillMarkDistribution: {},
    standardMarkDistribution: { C: 0, A: 0 },
    thinkingMarkDistribution: { OPERATIONAL: 0, REASONING: 0 },
  };

  for (const mark of markNodes) {
    const skillId = mark.classification.primarySkillId;
    summary.skillMarkDistribution[skillId] = (summary.skillMarkDistribution[skillId] ?? 0) + mark.markValue;

    if (mark.classification.standard.state === "VALUE") {
      summary.standardMarkDistribution[mark.classification.standard.value] += mark.markValue;
    }
    if (mark.classification.thinking.state === "VALUE") {
      summary.thinkingMarkDistribution[mark.classification.thinking.value] += mark.markValue;
    }
  }

  return summary;
};

export const validateClassifiedMarkNodes = (
  markNodes: readonly ClassifiedMarkNode[],
): string[] => {
  const issues: string[] = [];

  for (const mark of markNodes) {
    if (mark.skillIds.length !== 1) {
      issues.push(`${mark.id}: V3 mark must expose exactly one compatibility skillId.`);
    }
    if (mark.skillIds[0] !== mark.classification.primarySkillId) {
      issues.push(`${mark.id}: compatibility skillId does not match primarySkillId.`);
    }
    if (mark.classification.standard.state !== "VALUE") {
      issues.push(`${mark.id}: standard classification is not resolved.`);
    }
    if (mark.classification.thinking.state !== "VALUE") {
      issues.push(`${mark.id}: thinking classification is not resolved.`);
    }
  }

  return issues;
};
