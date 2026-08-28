
import { useEffect, useMemo, useState } from "react";

import type { SchoolClass } from "@/app/Classes/ClassData";

import {
  getAssessmentLevelOption,
  getDefaultAssessmentLevelId,
  loadAssessmentClassCoverageBrief,
  type AssessmentLevelId,
} from "./AssessmentClassCoverageStorage";

import { loadAssessmentSetupClasses } from "./ClassLoader";

export function useAssessmentSetupClassCoverage() {
  const [selectedLevelId, setSelectedLevelId] =
    useState<AssessmentLevelId | null>(
      getDefaultAssessmentLevelId()
    );

  const [selectedClassIds, setSelectedClassIds] =
    useState<string[]>([]);

  const [
    useCompleteCourseCoverage,
    setUseCompleteCourseCoverage,
  ] = useState(false);

  const [allClasses, setAllClasses] =
    useState<SchoolClass[]>([]);

  useEffect(() => {
    const savedCoverageBrief =
      loadAssessmentClassCoverageBrief();

    if (savedCoverageBrief) {
      setSelectedLevelId(
        savedCoverageBrief.levelId ??
          getDefaultAssessmentLevelId()
      );

      setSelectedClassIds(
        savedCoverageBrief.selectedClassIds
      );

      setUseCompleteCourseCoverage(
        savedCoverageBrief.useCompleteCourseCoverage
      );
    }

    setAllClasses(loadAssessmentSetupClasses());
  }, []);

  const selectedLevelOption = useMemo(() => {
    return getAssessmentLevelOption(selectedLevelId);
  }, [selectedLevelId]);

  const levelClasses = useMemo(() => {
    if (!selectedLevelOption) {
      return [];
    }

    return allClasses.filter(
      (schoolClass) =>
        schoolClass.courseId === selectedLevelOption.id
    );
  }, [allClasses, selectedLevelOption]);

  useEffect(() => {
    setSelectedClassIds((current) =>
      current.filter((classId) =>
        levelClasses.some(
          (schoolClass) => schoolClass.id === classId
        )
      )
    );
  }, [levelClasses]);

  function selectLevel(nextLevelId: AssessmentLevelId) {
    setSelectedLevelId(nextLevelId);
    setSelectedClassIds([]);
    setUseCompleteCourseCoverage(false);
  }

  function toggleClass(classId: string) {
    setUseCompleteCourseCoverage(false);

    setSelectedClassIds((current) =>
      current.includes(classId)
        ? current.filter((id) => id !== classId)
        : [...current, classId]
    );
  }

  function selectCompleteCourseCoverage() {
    setUseCompleteCourseCoverage(true);
    setSelectedClassIds([]);
  }

  return {
    selectedLevelId,
    selectedLevelOption,
    selectedClassIds,
    useCompleteCourseCoverage,
    levelClasses,
    selectLevel,
    toggleClass,
    selectCompleteCourseCoverage,
  };
}