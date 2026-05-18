/**
 * Builder localStorage keys.
 *
 * The original prototype used `n5_...` and `n5-builder-...` key names because
 * National 5 Maths was the only supported course at the time.
 *
 * The app is now moving towards a course-agnostic assessment builder, so new
 * keys should use a neutral `assessment_builder_...` namespace.
 *
 * Legacy N5 keys are kept here so old browser storage can still be read during
 * the transition.
 */

export const BUILDER_STORAGE_NAMESPACE = "assessment_builder";

/**
 * New neutral keys.
 */
export const STORAGE_KEY = `${BUILDER_STORAGE_NAMESPACE}_state_v2`;
export const PANE_RATIO_KEY = `${BUILDER_STORAGE_NAMESPACE}_pane_ratio_v1`;
export const HUD_HEIGHT_KEY = `${BUILDER_STORAGE_NAMESPACE}_hud_height_v1`;
export const SHOW_PROGRESS_PANEL_KEY = `${BUILDER_STORAGE_NAMESPACE}_show_progress_panel_v1`;
export const INCLUDE_COVER_SHEET_KEY = `${BUILDER_STORAGE_NAMESPACE}_include_cover_sheet_v1`;
export const SHOW_COVER_DATE_TIME_KEY = `${BUILDER_STORAGE_NAMESPACE}_show_cover_date_time_v1`;
export const COVER_DATE_TEXT_KEY = `${BUILDER_STORAGE_NAMESPACE}_cover_date_text_v1`;
export const COVER_TIME_TEXT_KEY = `${BUILDER_STORAGE_NAMESPACE}_cover_time_text_v1`;
export const SHOW_SCN_BOX_KEY = `${BUILDER_STORAGE_NAMESPACE}_show_scn_box_v1`;
export const INCLUDE_FORMULA_SHEET_KEY = `${BUILDER_STORAGE_NAMESPACE}_include_formula_sheet_v1`;

export const META_NAME_KEY = `${BUILDER_STORAGE_NAMESPACE}_meta_name_v1`;
export const META_CLASS_KEY = `${BUILDER_STORAGE_NAMESPACE}_meta_class_v1`;
export const META_ASSESSMENT_DATE_KEY = `${BUILDER_STORAGE_NAMESPACE}_meta_assessment_date_v1`;

export const P1_COVER_DATE_KEY = `${BUILDER_STORAGE_NAMESPACE}_p1_cover_date_v1`;
export const P1_START_TIME_KEY = `${BUILDER_STORAGE_NAMESPACE}_p1_start_time_v1`;
export const P1_END_TIME_KEY = `${BUILDER_STORAGE_NAMESPACE}_p1_end_time_v1`;

export const P2_COVER_DATE_KEY = `${BUILDER_STORAGE_NAMESPACE}_p2_cover_date_v1`;
export const P2_START_TIME_KEY = `${BUILDER_STORAGE_NAMESPACE}_p2_start_time_v1`;
export const P2_END_TIME_KEY = `${BUILDER_STORAGE_NAMESPACE}_p2_end_time_v1`;

export const P2_DATE_CUSTOM_KEY = `${BUILDER_STORAGE_NAMESPACE}_p2_date_custom_v1`;

/**
 * Legacy N5 keys.
 *
 * These should not be used for new writes. They exist so old browser storage
 * can still be read during the transition.
 */
export const LEGACY_STORAGE_KEY = "n5_assessment_builder_v2";
export const LEGACY_PANE_RATIO_KEY = "n5_assessment_builder_pane_ratio_v1";
export const LEGACY_HUD_HEIGHT_KEY = "n5_assessment_builder_hud_height_v1";
export const LEGACY_SHOW_PROGRESS_PANEL_KEY =
  "n5_assessment_builder_show_progress_panel_v1";
export const LEGACY_INCLUDE_COVER_SHEET_KEY =
  "n5_assessment_builder_include_cover_sheet_v1";
export const LEGACY_SHOW_COVER_DATE_TIME_KEY =
  "n5_assessment_builder_show_cover_date_time_v1";
export const LEGACY_COVER_DATE_TEXT_KEY =
  "n5_assessment_builder_cover_date_text_v1";
export const LEGACY_COVER_TIME_TEXT_KEY =
  "n5_assessment_builder_cover_time_text_v1";
export const LEGACY_SHOW_SCN_BOX_KEY = "n5_assessment_builder_show_scn_box_v1";
export const LEGACY_INCLUDE_FORMULA_SHEET_KEY =
  "n5_assessment_builder_include_formula_sheet_v1";

export const LEGACY_META_NAME_KEY = "n5-builder-meta-name";
export const LEGACY_META_CLASS_KEY = "n5-builder-meta-class";
export const LEGACY_META_ASSESSMENT_DATE_KEY = "n5-builder-meta-assessment-date";

export const LEGACY_P1_COVER_DATE_KEY = "n5-builder-p1-cover-date";
export const LEGACY_P1_START_TIME_KEY = "n5-builder-p1-start-time";
export const LEGACY_P1_END_TIME_KEY = "n5-builder-p1-end-time";

export const LEGACY_P2_COVER_DATE_KEY = "n5-builder-p2-cover-date";
export const LEGACY_P2_START_TIME_KEY = "n5-builder-p2-start-time";
export const LEGACY_P2_END_TIME_KEY = "n5-builder-p2-end-time";

export const LEGACY_P2_DATE_CUSTOM_KEY = "n5-builder-p2-date-custom";

export type BuilderStorageKeyPair = {
  current: string;
  legacy: string;
};

export const BUILDER_STORAGE_KEY_PAIRS = {
  state: {
    current: STORAGE_KEY,
    legacy: LEGACY_STORAGE_KEY,
  },
  paneRatio: {
    current: PANE_RATIO_KEY,
    legacy: LEGACY_PANE_RATIO_KEY,
  },
  hudHeight: {
    current: HUD_HEIGHT_KEY,
    legacy: LEGACY_HUD_HEIGHT_KEY,
  },
  showProgressPanel: {
    current: SHOW_PROGRESS_PANEL_KEY,
    legacy: LEGACY_SHOW_PROGRESS_PANEL_KEY,
  },
  includeCoverSheet: {
    current: INCLUDE_COVER_SHEET_KEY,
    legacy: LEGACY_INCLUDE_COVER_SHEET_KEY,
  },
  showCoverDateTime: {
    current: SHOW_COVER_DATE_TIME_KEY,
    legacy: LEGACY_SHOW_COVER_DATE_TIME_KEY,
  },
  coverDateText: {
    current: COVER_DATE_TEXT_KEY,
    legacy: LEGACY_COVER_DATE_TEXT_KEY,
  },
  coverTimeText: {
    current: COVER_TIME_TEXT_KEY,
    legacy: LEGACY_COVER_TIME_TEXT_KEY,
  },
  showScottishCandidateNumberBox: {
    current: SHOW_SCN_BOX_KEY,
    legacy: LEGACY_SHOW_SCN_BOX_KEY,
  },
  includeFormulaSheet: {
    current: INCLUDE_FORMULA_SHEET_KEY,
    legacy: LEGACY_INCLUDE_FORMULA_SHEET_KEY,
  },

  metaName: {
    current: META_NAME_KEY,
    legacy: LEGACY_META_NAME_KEY,
  },
  metaClass: {
    current: META_CLASS_KEY,
    legacy: LEGACY_META_CLASS_KEY,
  },
  metaAssessmentDate: {
    current: META_ASSESSMENT_DATE_KEY,
    legacy: LEGACY_META_ASSESSMENT_DATE_KEY,
  },

  p1CoverDate: {
    current: P1_COVER_DATE_KEY,
    legacy: LEGACY_P1_COVER_DATE_KEY,
  },
  p1StartTime: {
    current: P1_START_TIME_KEY,
    legacy: LEGACY_P1_START_TIME_KEY,
  },
  p1EndTime: {
    current: P1_END_TIME_KEY,
    legacy: LEGACY_P1_END_TIME_KEY,
  },

  p2CoverDate: {
    current: P2_COVER_DATE_KEY,
    legacy: LEGACY_P2_COVER_DATE_KEY,
  },
  p2StartTime: {
    current: P2_START_TIME_KEY,
    legacy: LEGACY_P2_START_TIME_KEY,
  },
  p2EndTime: {
    current: P2_END_TIME_KEY,
    legacy: LEGACY_P2_END_TIME_KEY,
  },

  p2DateCustom: {
    current: P2_DATE_CUSTOM_KEY,
    legacy: LEGACY_P2_DATE_CUSTOM_KEY,
  },
} satisfies Record<string, BuilderStorageKeyPair>;

export function readBuilderStorageValue(
  pair: BuilderStorageKeyPair
): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(pair.current);
  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(pair.legacy);
  if (legacyValue === null) return null;

  window.localStorage.setItem(pair.current, legacyValue);
  return legacyValue;
}

export function writeBuilderStorageValue(
  pair: BuilderStorageKeyPair,
  value: string
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(pair.current, value);
}

export function removeBuilderStorageValue(pair: BuilderStorageKeyPair): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(pair.current);
}