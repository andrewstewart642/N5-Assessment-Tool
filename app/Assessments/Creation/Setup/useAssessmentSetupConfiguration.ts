
import { useMemo, useState } from "react";

import {
  DEFAULT_COURSE_ID,
  getCourseAssessmentConfigById,
} from "@/app/Courses/CourseRegistry";
import type { CourseAssessmentConfig } from "@/app/Courses/CourseAssessmentConfig";

import type { AssessmentLevelId } from "./AssessmentClassCoverageStorage";

import type {
  AssessmentType,
  PaperStructure,
} from "./AssessmentSetupStorage";

import {
  isSetupAssessmentType,
  isSetupPaperStructure,
} from "./AssessmentSetupCourseRules";

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

type UseAssessmentSetupConfigurationArgs = {
  selectedLevelId: AssessmentLevelId | null;
};

export function useAssessmentSetupConfiguration({
  selectedLevelId,
}: UseAssessmentSetupConfigurationArgs) {
  const [assessmentType, setAssessmentType] =
    useState<AssessmentType | null>(null);

  const [paperStructure, setPaperStructure] =
    useState<PaperStructure | null>(null);

  const [includeCoverSheet, setIncludeCoverSheet] =
    useState(true);

  const [includeFormulaSheet, setIncludeFormulaSheet] =
    useState(true);

  const [assessmentName, setAssessmentName] =
    useState("[Untitled file]");

  const [assessmentDate, setAssessmentDate] =
    useState(todayIsoDate());

  const selectedCourseConfig =
    useMemo<CourseAssessmentConfig>(() => {
      return getCourseAssessmentConfigById(
        selectedLevelId ??
          DEFAULT_COURSE_ID
      );
    }, [selectedLevelId]);

  const setupAssessmentModes = useMemo(() => {
    return selectedCourseConfig.assessmentModes.filter(
      (mode) =>
        isSetupAssessmentType(
          mode.id,
          selectedCourseConfig
        )
    );
  }, [selectedCourseConfig]);

  const setupAssessmentStructures = useMemo(() => {
    return selectedCourseConfig.assessmentStructures.filter(
      (structure) =>
        isSetupPaperStructure(
          structure.id,
          selectedCourseConfig
        )
    );
  }, [selectedCourseConfig]);

  function handleAssessmentNameFocus() {
    if (assessmentName === "[Untitled file]") {
      setAssessmentName("");
    }
  }

  function handleAssessmentNameBlur() {
    if (!assessmentName.trim().length) {
      setAssessmentName("[Untitled file]");
    }
  }

  function resetCourseDependentConfiguration() {
    setAssessmentType(null);
    setPaperStructure(null);
  }

  return {
    selectedCourseConfig,

    assessmentType,
    setAssessmentType,

    paperStructure,
    setPaperStructure,

    includeCoverSheet,
    setIncludeCoverSheet,

    includeFormulaSheet,
    setIncludeFormulaSheet,

    assessmentName,
    setAssessmentName,

    assessmentDate,
    setAssessmentDate,

    setupAssessmentModes,
    setupAssessmentStructures,

    handleAssessmentNameFocus,
    handleAssessmentNameBlur,

    resetCourseDependentConfiguration,
  };
}