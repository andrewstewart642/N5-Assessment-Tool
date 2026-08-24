import { skillsData } from "@/course-data/N5-Skills";
import type { Skill } from "@/shared-types/AssessmentTypes";

type SkillConceptLike = {
  code?: string;
  label?: string;
  shortLabel?: string;
};

export type SkillLike = Skill & {
  code?: string;
  label?: string;
  title?: string;
  name?: string;
  description?: string;
  concepts?: SkillConceptLike[];
};

export type CoverageSkillRecord = {
  categoryName: string;
  skill: SkillLike;
};

export function getCategoryAccent(categoryName: string): string {
  const name = categoryName.toLowerCase();

  if (name.includes("numerical")) return "rgba(96,165,250,0.92)";
  if (name.includes("algebra")) return "rgba(196,181,253,0.92)";
  if (name.includes("geometric")) return "rgba(74,222,128,0.92)";
  if (name.includes("trigon")) return "rgba(250,204,21,0.92)";
  if (name.includes("stat")) return "rgba(244,114,182,0.92)";

  return "rgba(148,163,184,0.92)";
}

export function getAllCoverageSkills(): CoverageSkillRecord[] {
  const entries = Object.entries(skillsData) as Array<[string, SkillLike[]]>;
  return entries.flatMap(([categoryName, skills]) =>
    skills.map((skill) => ({
      categoryName,
      skill,
    }))
  );
}

export function getCoverageSkillById(
  skillId: string | null
): CoverageSkillRecord | null {
  if (!skillId) return null;
  return getAllCoverageSkills().find((entry) => entry.skill.id === skillId) ?? null;
}

export function getSkillCode(skill: SkillLike): string {
  if (typeof skill.code === "string" && skill.code.trim()) {
    return skill.code.trim();
  }

  const idMatch = skill.id.match(/-([a-z]\d+)-/i);
  if (idMatch?.[1]) {
    return idMatch[1].toUpperCase();
  }

  const fallbackMatch = skill.id.match(/^([a-z]\d+)/i);
  if (fallbackMatch?.[1]) {
    return fallbackMatch[1].toUpperCase();
  }

  return "";
}

export function getSkillTitle(skill: SkillLike): string {
  if (typeof skill.title === "string" && skill.title.trim()) return skill.title.trim();
  if (typeof skill.label === "string" && skill.label.trim()) return skill.label.trim();
  if (typeof skill.name === "string" && skill.name.trim()) return skill.name.trim();

  const concepts = Array.isArray(skill.concepts) ? skill.concepts : [];
  const firstShortLabel = concepts.find(
    (concept) => typeof concept.shortLabel === "string" && concept.shortLabel.trim()
  )?.shortLabel;

  if (firstShortLabel?.trim()) {
    const cleaned = firstShortLabel
      .replace(/^Factorising\s*-\s*/i, "")
      .replace(/^Algebraic Fractions\s*-\s*/i, "")
      .trim();

    if (cleaned) return cleaned;
  }

  const idParts = skill.id.split("-");
  if (idParts.length >= 3) {
    return toTitleCase(idParts.slice(2).join(" "));
  }

  return toTitleCase(skill.id.replace(/-/g, " "));
}

export function getSkillConceptSummary(skill: SkillLike): string {
  const concepts = Array.isArray(skill.concepts) ? skill.concepts : [];
  if (concepts.length === 0) return "Click to view skill details";

  return concepts
    .map((concept) => {
      const code = concept.code?.trim();
      const label =
        concept.shortLabel?.trim() || concept.label?.trim() || "Unnamed concept";
      return code ? `${code} ${label}` : label;
    })
    .join("\n");
}

export function getConceptBodyLines(concept: SkillConceptLike): string[] {
  const code = concept.code?.trim().toUpperCase() ?? "";
  const label = concept.label?.trim();
  const lines: string[] = [];

  if (label) {
    lines.push(label);
  }

  const mappedExamples = getMappedConceptExamples(code);
  for (const line of mappedExamples) {
    if (!lines.includes(line)) {
      lines.push(line);
    }
  }

  if (lines.length === 0) {
    lines.push("More example guidance can be added here later.");
  }

  return lines;
}

function getMappedConceptExamples(code: string): string[] {
  switch (code) {
    case "N1.1":
      return ["√12 = 2√3", "√50 = 5√2"];
    case "N1.2":
      return ["3/√5 = 3√5/5", "2/(√3 + 1)"];
    case "N2.1":
      return ["a³ × a⁵", "x⁷ ÷ x²"];
    case "N2.2":
      return ["(ab)³", "(2x)⁴"];
    case "N2.3":
      return ["(x³)²", "(a²)⁵"];
    case "N2.4":
      return ["16^(1/2)", "27^(2/3)"];
    case "N3.1":
      return ["0.004781 to 2 significant figures", "4839 to 3 significant figures"];
    case "A1.1":
      return ["a(bx + c) + d(ex + f)"];
    case "A1.2":
      return ["ax(bx + c)"];
    case "A1.3":
      return ["(ax + b)(cx + d)"];
    case "A2.1":
      return ["6x + 9 = 3(2x + 3)"];
    case "A2.2":
      return ["x² - 9 = (x - 3)(x + 3)"];
    default:
      return [];
  }
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}