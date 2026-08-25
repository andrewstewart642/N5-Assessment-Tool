import type { CourseAssessmentConfig } from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes";

import {
  createSavedAssessmentDraft,
  setCurrentSavedAssessmentId,
} from "@/app/my-assessments/state/SavedAssessmentsStorage";

import { setBuilderActiveCourseId } from "@/app/create-assessment/builder/builder-logic/BuilderCourseConfig";

import {
  saveAssessmentClassCoverageBrief,
  type AssessmentLevelId,
} from "./AssessmentClassCoverageStorage";

import {
  saveAssessmentSetupBrief,
  type AssessmentType,
  type BuildPriority,
  type PaperStructure,
} from "./AssessmentSetupStorage";

import {
  estimateMarksFromTime,
  getDefaultTargetMarks,
  getIncludedPapers,
} from "./AssessmentSetupCourseRules";

type CreateAssessmentFromSetupArgs = {
  courseConfig: CourseAssessmentConfig;

  assessmentType: AssessmentType;
  paperStructure: PaperStructure;
  buildPriority: BuildPriority;

  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;

  assessmentName: string;
  assessmentDate: string;

  selectedLevelId: AssessmentLevelId;
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;

  parsedMarksP1: number | null;
  parsedMarksP2: number | null;
  parsedTimeP1: number | null;
  parsedTimeP2: number | null;
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createAssessmentFromSetup({
  courseConfig,
  assessmentType,
  paperStructure,
  buildPriority,
  includeCoverSheet,
  includeFormulaSheet,
  assessmentName,
  assessmentDate,
  selectedLevelId,
  selectedClassIds,
  useCompleteCourseCoverage,
  parsedMarksP1,
  parsedMarksP2,
  parsedTimeP1,
  parsedTimeP2,
}: CreateAssessmentFromSetupArgs): string {
  const now = Date.now();

  const coursePapers = courseConfig.papers.map((paper) => paper.id);

  const includedPapers = getIncludedPapers(
    paperStructure,
    courseConfig
  );

  const firstCoursePaper = coursePapers[0] ?? "P1";
  const secondCoursePaper = coursePapers[1] ?? firstCoursePaper;

  const initialActivePaper =
    includedPapers[0] ?? firstCoursePaper;

  const emptyDraftByPaper = coursePapers.reduce<Record<Paper, null>>(
    (drafts, paper) => {
      drafts[paper] = null;
      return drafts;
    },
    {} as Record<Paper, null>
  );

  const normalisedAssessmentName =
    assessmentName.trim().length > 0
      ? assessmentName.trim()
      : "[Untitled file]";

  const normalisedAssessmentDate =
    assessmentDate || todayIsoDate();

  const normalisedUseCompleteCourseCoverage =
    useCompleteCourseCoverage || selectedClassIds.length === 0;

  const initialP1Target =
    buildPriority === "MARKS"
      ? parsedMarksP1 ??
        getDefaultTargetMarks(firstCoursePaper, courseConfig)
      : parsedTimeP1 !== null
        ? estimateMarksFromTime(
            firstCoursePaper,
            parsedTimeP1,
            courseConfig
          )
        : getDefaultTargetMarks(firstCoursePaper, courseConfig);

  const initialP2Target =
    buildPriority === "MARKS"
      ? parsedMarksP2 ??
        getDefaultTargetMarks(secondCoursePaper, courseConfig)
      : parsedTimeP2 !== null
        ? estimateMarksFromTime(
            secondCoursePaper,
            parsedTimeP2,
            courseConfig
          )
        : getDefaultTargetMarks(secondCoursePaper, courseConfig);

  const targetMarksByPaper: Partial<Record<Paper, number>> = {
    [firstCoursePaper]: initialP1Target,
    [secondCoursePaper]: initialP2Target,
  };

  const coverDateByPaper = coursePapers.reduce<
    Partial<Record<Paper, string>>
  >((dates, paper) => {
    dates[paper] = normalisedAssessmentDate;
    return dates;
  }, {});

  const startTimeByPaper = coursePapers.reduce<
    Partial<Record<Paper, string>>
  >((times, paper) => {
    times[paper] = "";
    return times;
  }, {});

  const endTimeByPaper = coursePapers.reduce<
    Partial<Record<Paper, string>>
  >((times, paper) => {
    times[paper] = "";
    return times;
  }, {});

  const coverDateCustomByPaper = coursePapers.reduce<
    Partial<Record<Paper, boolean>>
  >((customFlags, paper) => {
    customFlags[paper] = false;
    return customFlags;
  }, {});

  setBuilderActiveCourseId(courseConfig.courseId);

  saveAssessmentSetupBrief({
    courseId: courseConfig.courseId,
    assessmentType,
    buildPriority,
    paperStructure,
    includeCoverSheet,
    includeFormulaSheet,
    marksTargetP1:
      buildPriority === "MARKS" ? parsedMarksP1 : null,
    marksTargetP2:
      buildPriority === "MARKS" ? parsedMarksP2 : null,
    timeTargetP1:
      buildPriority === "TIME" ? parsedTimeP1 : null,
    timeTargetP2:
      buildPriority === "TIME" ? parsedTimeP2 : null,
    assessmentName: normalisedAssessmentName,
    className: "",
    assessmentDate: normalisedAssessmentDate,
    createdAt: now,
  });

  saveAssessmentClassCoverageBrief({
    levelId: selectedLevelId,
    selectedClassIds,
    useCompleteCourseCoverage:
      normalisedUseCompleteCourseCoverage,
    savedAt: now,
  });

  const savedAssessment = createSavedAssessmentDraft({
    setup: {
      courseId: courseConfig.courseId,
      assessmentType,
      buildPriority,
      paperStructure,
      includeCoverSheet,
      includeFormulaSheet,
      marksTargetP1:
        buildPriority === "MARKS" ? parsedMarksP1 : null,
      marksTargetP2:
        buildPriority === "MARKS" ? parsedMarksP2 : null,
      timeTargetP1:
        buildPriority === "TIME" ? parsedTimeP1 : null,
      timeTargetP2:
        buildPriority === "TIME" ? parsedTimeP2 : null,
      assessmentName: normalisedAssessmentName,
      className: "",
      assessmentDate: normalisedAssessmentDate,
      levelId: selectedLevelId,
      selectedClassIds,
      useCompleteCourseCoverage:
        normalisedUseCompleteCourseCoverage,
    },

    builder: {
      standardFilter: "C+A",
      thinkingTypeFilter: "ANY",
      targetMarks: 2,

      activePaper: initialActivePaper,
      viewPaper: initialActivePaper,

      targetMarksByPaper,
      p1Target: initialP1Target,
      p2Target: initialP2Target,

      questions: [],
      draftByPaper: emptyDraftByPaper,
      editDraftByPaper: emptyDraftByPaper,

      includeCoverSheet,
      includeFormulaSheet,

      showCoverDateTime: false,
      showScottishCandidateNumberBox: true,

      assessmentName: normalisedAssessmentName,
      className: "",
      assessmentDate: normalisedAssessmentDate,

      coverDateByPaper,
      startTimeByPaper,
      endTimeByPaper,
      coverDateCustomByPaper,

      p1StartTime: "",
      p1EndTime: "",

      p2CoverDate: normalisedAssessmentDate,
      p2StartTime: "",
      p2EndTime: "",
      p2DateCustom: false,
    },
  });

  setCurrentSavedAssessmentId(savedAssessment.id);

  return savedAssessment.id;
}