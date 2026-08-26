export type CompilationPageSize =
  | "A4"
  | "A3"
  | "A5";

export type CompilationPageSizeConfig = {
  size: CompilationPageSize;

  /**
   * Scaling relative to the current A4 baseline.
   */
  scale: number;

  /**
   * Available vertical space used by the current
   * Compilation pagination algorithm.
   */
  contentHeightPx: number;
};

export const COMPILATION_PAGE_SIZES: Record<
  CompilationPageSize,
  CompilationPageSizeConfig
> = {
  A4: {
    size: "A4",
    scale: 1.0,
    contentHeightPx: 980,
  },

  A3: {
    size: "A3",
    scale: 1.25,
    contentHeightPx: 1225,
  },

  A5: {
    size: "A5",
    scale: 0.85,
    contentHeightPx: 835,
  },
};