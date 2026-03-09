// app/paper-layout/SQA-Typography.ts

export type SQATypographyConfig = {
  /**
   * Primary paper font stack.
   * We bias toward Trebuchet (as used in SQA papers) with safe fallbacks.
   */
  fontFamily: string;

  /**
   * Use pt for print-faithful sizing.
   */
  baseFontSizePt: string;

  /**
   * Line height used throughout paper body.
   */
  lineHeight: string;

  /**
   * Optional mono stack (useful later for working, code-style text, etc.)
   */
  monoFontFamily: string;
};

export const SQA_TYPOGRAPHY: SQATypographyConfig = {
  fontFamily: `"Trebuchet MS", Trebuchet, Arial, sans-serif`,
  baseFontSizePt: "11pt",
  lineHeight: "1.35",
  monoFontFamily: `var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
};

/**
 * Centralised CSS variable names (avoid magic strings).
 */
export const SQA_TYPO_VARS = {
  fontFamily: "--sqa-font-family",
  fontSize: "--sqa-font-size",
  lineHeight: "--sqa-line-height",
  monoFontFamily: "--sqa-mono-font-family",
} as const;

/**
 * Returns a CSS variable map to be applied at the app root once.
 */
export function getSQATypographyCssVars(config: SQATypographyConfig = SQA_TYPOGRAPHY): Record<string, string> {
  return {
    [SQA_TYPO_VARS.fontFamily]: config.fontFamily,
    [SQA_TYPO_VARS.fontSize]: config.baseFontSizePt,
    [SQA_TYPO_VARS.lineHeight]: config.lineHeight,
    [SQA_TYPO_VARS.monoFontFamily]: config.monoFontFamily,
  };
}