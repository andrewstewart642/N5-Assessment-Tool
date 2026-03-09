import type React from "react";

export const UI_TYPO = {
  family: "var(--app-ui-font-family)",
  sizeXs: 10,
  sizeSm: 11,
  sizeMeta: 12,
  sizeBase: 13,
  sizeTitle: 14,
  weightRegular: 400,
  weightMedium: 500,
  weightSemibold: 600,
  weightBold: 700,
  weightHeavy: 800,
  lineTight: 1.1,
  lineBase: 1.3,
  lineRelaxed: 1.4,
} as const;

export const UI_TEXT = {
  appRoot: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    lineHeight: UI_TYPO.lineBase,
    fontWeight: UI_TYPO.weightRegular,
  } satisfies React.CSSProperties,

  pageTitle: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeTitle,
    fontWeight: UI_TYPO.weightBold,
    lineHeight: 1.2,
  } satisfies React.CSSProperties,

  sectionTitle: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: 1.2,
  } satisfies React.CSSProperties,

  sectionLabel: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeMeta,
    fontWeight: UI_TYPO.weightMedium,
    lineHeight: 1.2,
    letterSpacing: 0.15,
  } satisfies React.CSSProperties,

  metadata: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightMedium,
    lineHeight: 1.2,
  } satisfies React.CSSProperties,

  helper: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeMeta,
    fontWeight: UI_TYPO.weightRegular,
    lineHeight: UI_TYPO.lineRelaxed,
  } satisfies React.CSSProperties,

  controlText: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightMedium,
    lineHeight: UI_TYPO.lineBase,
  } satisfies React.CSSProperties,

  controlTextStrong: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: UI_TYPO.lineBase,
  } satisfies React.CSSProperties,

  chipText: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeMeta,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: 1,
  } satisfies React.CSSProperties,

  chipTextSmall: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeSm,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: 1,
  } satisfies React.CSSProperties,

  buttonText: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: UI_TYPO.lineTight,
  } satisfies React.CSSProperties,

  buttonTextSmall: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeMeta,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: UI_TYPO.lineTight,
  } satisfies React.CSSProperties,

  valueText: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeBase,
    fontWeight: UI_TYPO.weightSemibold,
    lineHeight: UI_TYPO.lineBase,
  } satisfies React.CSSProperties,

  smallValueText: {
    fontFamily: UI_TYPO.family,
    fontSize: UI_TYPO.sizeMeta,
    fontWeight: UI_TYPO.weightMedium,
    lineHeight: UI_TYPO.lineBase,
  } satisfies React.CSSProperties,
} as const;