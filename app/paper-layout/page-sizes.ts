export type PageSize = "A4" | "A3" | "A5";

export type PageSizeConfig = {
  size: PageSize;
  scale: number;
  contentHeightPx: number; // used for pagination packing
};

export const PAGE_SIZES: Record<PageSize, PageSizeConfig> = {
  A4: { size: "A4", scale: 1.0, contentHeightPx: 980 },
  A3: { size: "A3", scale: 1.25, contentHeightPx: 1225 },
  A5: { size: "A5", scale: 0.85, contentHeightPx: 835 },
};