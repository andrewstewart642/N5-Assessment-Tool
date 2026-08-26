export const ASSESSMENT_CREATION_STORAGE_NAMESPACE =
  "assessment_builder";

export type AssessmentCreationStorageKeyPair = {
  current: string;
  legacy: string;
};

export const ASSESSMENT_CREATION_STORAGE_KEY_PAIRS = {
  state: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_state_v2`,
    legacy:
      "n5_assessment_builder_v2",
  },

  paneRatio: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_pane_ratio_v1`,
    legacy:
      "n5_assessment_builder_pane_ratio_v1",
  },

  hudHeight: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_hud_height_v1`,
    legacy:
      "n5_assessment_builder_hud_height_v1",
  },

  showProgressPanel: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_show_progress_panel_v1`,
    legacy:
      "n5_assessment_builder_show_progress_panel_v1",
  },

  includeCoverSheet: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_include_cover_sheet_v1`,
    legacy:
      "n5_assessment_builder_include_cover_sheet_v1",
  },

  showCoverDateTime: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_show_cover_date_time_v1`,
    legacy:
      "n5_assessment_builder_show_cover_date_time_v1",
  },

  coverDateText: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_cover_date_text_v1`,
    legacy:
      "n5_assessment_builder_cover_date_text_v1",
  },

  coverTimeText: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_cover_time_text_v1`,
    legacy:
      "n5_assessment_builder_cover_time_text_v1",
  },

  showScottishCandidateNumberBox: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_show_scn_box_v1`,
    legacy:
      "n5_assessment_builder_show_scn_box_v1",
  },

  includeFormulaSheet: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_include_formula_sheet_v1`,
    legacy:
      "n5_assessment_builder_include_formula_sheet_v1",
  },

  metaName: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_meta_name_v1`,
    legacy:
      "n5-builder-meta-name",
  },

  metaClass: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_meta_class_v1`,
    legacy:
      "n5-builder-meta-class",
  },

  metaAssessmentDate: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_meta_assessment_date_v1`,
    legacy:
      "n5-builder-meta-assessment-date",
  },

  p1CoverDate: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p1_cover_date_v1`,
    legacy:
      "n5-builder-p1-cover-date",
  },

  p1StartTime: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p1_start_time_v1`,
    legacy:
      "n5-builder-p1-start-time",
  },

  p1EndTime: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p1_end_time_v1`,
    legacy:
      "n5-builder-p1-end-time",
  },

  p2CoverDate: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p2_cover_date_v1`,
    legacy:
      "n5-builder-p2-cover-date",
  },

  p2StartTime: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p2_start_time_v1`,
    legacy:
      "n5-builder-p2-start-time",
  },

  p2EndTime: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p2_end_time_v1`,
    legacy:
      "n5-builder-p2-end-time",
  },

  p2DateCustom: {
    current:
      `${ASSESSMENT_CREATION_STORAGE_NAMESPACE}_p2_date_custom_v1`,
    legacy:
      "n5-builder-p2-date-custom",
  },
} satisfies Record<
  string,
  AssessmentCreationStorageKeyPair
>;

export function readAssessmentCreationStorageValue(
  pair: AssessmentCreationStorageKeyPair
): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const currentValue =
    window.localStorage.getItem(
      pair.current
    );

  if (currentValue !== null) {
    return currentValue;
  }

  const legacyValue =
    window.localStorage.getItem(
      pair.legacy
    );

  if (legacyValue === null) {
    return null;
  }

  window.localStorage.setItem(
    pair.current,
    legacyValue
  );

  return legacyValue;
}

export function writeAssessmentCreationStorageValue(
  pair: AssessmentCreationStorageKeyPair,
  value: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    pair.current,
    value
  );
}

export function removeAssessmentCreationStorageValue(
  pair: AssessmentCreationStorageKeyPair
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    pair.current
  );
}