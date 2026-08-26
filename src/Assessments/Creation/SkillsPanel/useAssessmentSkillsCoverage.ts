
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { SchoolClass } from "@/src/Classes/ClassTypes";
import type { SavedAssessment } from "@/src/Assessments/SavedAssessments/SavedAssessment";

import type {
  Skill,
} from "@/src/Assessments/AssessmentTypes";

import {
  getAssessmentLevelLabel,
} from "../Setup/AssessmentClassCoverageStorage";

import {
  buildClassCoverageSummary,
  buildFilteredSkillsData,
  getCourseIdForLevelId,
  getSharedCompletedSkillIds,
  loadSavedClasses,
} from "./AssessmentClassCoverage";

type UseAssessmentSkillsCoverageArgs = {
  loadedSavedAssessment:
    SavedAssessment | null;

  selectedClassIds: string[];

  setSelectedClassIds:
    Dispatch<
      SetStateAction<string[]>
    >;

  useCompleteCourseCoverage: boolean;

  setUseCompleteCourseCoverage:
    Dispatch<
      SetStateAction<boolean>
    >;

  activeSkillsData:
    Record<string, Skill[]>;

  setClassName:
    Dispatch<
      SetStateAction<string>
    >;
};

export function useAssessmentSkillsCoverage({
  loadedSavedAssessment,
  selectedClassIds,
  setSelectedClassIds,
  useCompleteCourseCoverage,
  setUseCompleteCourseCoverage,
  activeSkillsData,
  setClassName,
}: UseAssessmentSkillsCoverageArgs) {
  const [
    savedClasses,
    setSavedClasses,
  ] = useState<SchoolClass[]>([]);

  useEffect(() => {
    setSavedClasses(
      loadSavedClasses()
    );
  }, []);

  const builderLevelLabel =
    useMemo(() => {
      return getAssessmentLevelLabel(
        loadedSavedAssessment?.setup
          .levelId
      );
    }, [loadedSavedAssessment]);

  const builderAvailableClasses =
    useMemo(() => {
      if (
        !loadedSavedAssessment?.setup
          .levelId
      ) {
        return [];
      }

      const expectedCourseId =
        getCourseIdForLevelId(
          loadedSavedAssessment.setup
            .levelId
        );

      if (!expectedCourseId) {
        return [];
      }

      return savedClasses.filter(
        (schoolClass) =>
          schoolClass.courseId ===
          expectedCourseId
      );
    }, [
      loadedSavedAssessment,
      savedClasses,
    ]);

  const computedClassSummary =
    useMemo(() => {
      return buildClassCoverageSummary({
        classes:
          builderAvailableClasses,

        selectedClassIds,

        useCompleteCourseCoverage,
      });
    }, [
      builderAvailableClasses,
      selectedClassIds,
      useCompleteCourseCoverage,
    ]);

  useEffect(() => {
    setClassName(
      computedClassSummary
    );
  }, [
    computedClassSummary,
    setClassName,
  ]);

  const selectedClassesForCoverage =
    useMemo(() => {
      if (!loadedSavedAssessment) {
        return [];
      }

      const expectedCourseId =
        getCourseIdForLevelId(
          loadedSavedAssessment.setup
            .levelId
        );

      const selectedClasses =
        selectedClassIds
          .map((classId) =>
            savedClasses.find(
              (schoolClass) =>
                schoolClass.id ===
                classId
            )
          )
          .filter(
            (
              schoolClass
            ): schoolClass is SchoolClass =>
              schoolClass !== undefined
          );

      if (!expectedCourseId) {
        return selectedClasses;
      }

      return selectedClasses.filter(
        (schoolClass) =>
          schoolClass.courseId ===
          expectedCourseId
      );
    }, [
      loadedSavedAssessment,
      savedClasses,
      selectedClassIds,
    ]);

  const sharedCompletedSkillIds =
    useMemo(() => {
      return getSharedCompletedSkillIds(
        selectedClassesForCoverage
      );
    }, [
      selectedClassesForCoverage,
    ]);

  const filteredSkillsData =
    useMemo<
      Record<string, Skill[]>
    >(() => {
      if (!loadedSavedAssessment) {
        return activeSkillsData;
      }

      if (
        useCompleteCourseCoverage
      ) {
        return activeSkillsData;
      }

      if (
        selectedClassIds.length === 0
      ) {
        return activeSkillsData;
      }

      if (
        selectedClassesForCoverage
          .length === 0
      ) {
        return activeSkillsData;
      }

      const allowedSkillIds =
        new Set(
          sharedCompletedSkillIds
        );

      return buildFilteredSkillsData(
        activeSkillsData,
        allowedSkillIds
      );
    }, [
      activeSkillsData,
      loadedSavedAssessment,
      selectedClassesForCoverage,
      sharedCompletedSkillIds,
      useCompleteCourseCoverage,
      selectedClassIds,
    ]);

  const totalSkillsCount =
    useMemo(() => {
      return Object.values(
        filteredSkillsData
      ).reduce<number>(
        (total, skills) =>
          total + skills.length,
        0
      );
    }, [filteredSkillsData]);

  const toggleClass =
    useCallback(
      (classId: string) => {
        setUseCompleteCourseCoverage(
          false
        );

        setSelectedClassIds(
          (current) =>
            current.includes(classId)
              ? current.filter(
                  (id) =>
                    id !== classId
                )
              : [
                  ...current,
                  classId,
                ]
        );
      },
      [
        setSelectedClassIds,
        setUseCompleteCourseCoverage,
      ]
    );

  const selectCompleteCourseCoverage =
    useCallback(() => {
      setUseCompleteCourseCoverage(
        true
      );

      setSelectedClassIds([]);
    }, [
      setSelectedClassIds,
      setUseCompleteCourseCoverage,
    ]);

  return {
    savedClasses,

    builderLevelLabel,
    builderAvailableClasses,

    computedClassSummary,

    selectedClassesForCoverage,
    sharedCompletedSkillIds,

    filteredSkillsData,
    totalSkillsCount,

    toggleClass,
    selectCompleteCourseCoverage,
  };
}