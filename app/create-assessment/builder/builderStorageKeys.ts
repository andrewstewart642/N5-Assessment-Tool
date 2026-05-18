/**
 * Builder localStorage keys.
 *
 * The original prototype used `n5_...` key names because National 5 Maths was
 * the only supported course at the time.
 *
 * The app is now moving towards a course-agnostic assessment builder, so new
 * keys should use a neutral `assessment_builder_...` namespace.
 *
 * Legacy N5 keys are kept here so we can migrate/fallback safely instead of
 * making older localStorage data disappear.
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

/**
 * Legacy N5 keys.
 *
 * These should not be used for new writes once the migration helpers are wired
 * in. They exist so old browser storage can still be read during the transition.
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
} satisfies Record<string, BuilderStorageKeyPair>;

export function readBuilderStorageValue(pair: BuilderStorageKeyPair): string | null {
  if (typeof window === "undefined") return null;

  const currentValue = window.localStorage.getItem(pair.current);
  if (currentValue !== null) return currentValue;

  const legacyValue = window.localStorage.getItem(pair.legacy);
  if (legacyValue === null) return null;

  /**
   * Soft migration:
   *
   * If a value exists only under the old N5 key, copy it to the new neutral key.
   * The old key is left in place for safety.
   */
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