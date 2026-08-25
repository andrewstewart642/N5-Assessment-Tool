"use client";

import { useMemo, useState } from "react";

import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";
import { getCourseConfigById } from "@/course-data/course-configs/CourseConfigRegistry";
import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";

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
      return getCourseConfigById(
        selectedLevelId ??
          ACTIVE_COURSE_CONFIG.courseId
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