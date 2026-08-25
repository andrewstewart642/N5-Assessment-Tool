export const DOCUMENT_PX_PER_MM =
  96 / 25.4;

export function mmToPx(
  millimetres: number
): number {
  return Math.round(
    millimetres *
      DOCUMENT_PX_PER_MM
  );
}

export const A4_PAGE_WIDTH_PX =
  mmToPx(210);

export const A4_PAGE_HEIGHT_PX =
  mmToPx(297);