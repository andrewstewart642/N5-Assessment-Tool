import type { PaperPart } from "@/shared-types/paperParts";

export type Paper = "P1" | "P2";

/**
 * Difficulty: 1 (easiest) -> 5 (hardest)
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type StandardFilter = "C" | "A" | "C+A";

export type Theme = {
  pageBg: string;
  panelBg: string;
  panelBg2: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textDim: string;
  headerBg: string;
  rowHover: string;
  controlBg: string;
  accent: string;
  accentStrong: string;
  ctaBlueText: string;
};

export type SkillPaperSuitability = "P1" | "P2" | "BOTH";

export type Skill = {
  id: string;
  code: string;
  text: string;
  concepts: string[];
  paperSuitability: SkillPaperSuitability;
  tags?: string[];
};

export type Question = {
  id: string;

  category: string;

  skillId: string;
  skillCode: string;
  skillText: string;

  standardFilter: StandardFilter;

  concept: string;
  difficulty: DifficultyLevel;

  targetMarks: number;
  paper: Paper;

  createdAt: number;

  /**
   * Legacy/plain text versions (still useful for non-maths prompts)
   */
  prompt?: string;
  answer?: string;
  marks?: number;

  /**
   * ✅ Rich render versions (KaTeX-friendly)
   * If present, the paper preview should render THESE instead of prompt/answer strings.
   */
  promptParts?: PaperPart[];
  answerParts?: PaperPart[];

  questionCode?: string;

  /**
   * ✅ Baseline spacing stored at assign/save time (treat as A4 "base")
   * Compile stage will scale this for A3/A5 and reflow pages.
   */
  spacingBasePx?: number;
    /**
   * ✅ Measured content height (A4 baseline, px).
   * Captured from actual DOM render (includes KaTeX).
   * Used by pagination/reflow to avoid bad page breaks.
   */
  measuredHeightBasePx?: number;
};