import type { AssessmentLevelId } from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";
import type {
  AssessmentType,
  BuildPriority,
  PaperStructure,
} from "@/app/create-assessment/setup/AssessmentSetupStorage";
import type {
  Paper,
  Question,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/shared-types/AssessmentTypes";
import type {
  DraftByPaper,
  EditDraftByPaper,
} from "@/app/create-assessment/builder/BuilderUtils";

export type SavedAssessmentStatus = "DRAFT" | "COMPLETE";

export type SavedAssessmentSetup = {
  assessmentType: AssessmentType;
  buildPriority: BuildPriority;
  paperStructure: PaperStructure;

  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;

  marksTargetP1: number | null;
  marksTargetP2: number | null;
  timeTargetP1: number | null;
  timeTargetP2: number | null;

  assessmentName: string;
  className: string;
  assessmentDate: string;

  levelId: AssessmentLevelId | null;
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
};

export type SavedAssessmentBuilder = {
  standardFilter: StandardFilter;
  thinkingTypeFilter: ThinkingTypeFilter;
  targetMarks: number;

  activePaper: Paper;
  viewPaper: Paper;

  p1Target: number;
  p2Target: number;

  questions: Question[];
  draftByPaper: DraftByPaper;
  editDraftByPaper: EditDraftByPaper;

  includeCoverSheet: boolean;
  includeFormulaSheet: boolean;
  showCoverDateTime: boolean;
  showScottishCandidateNumberBox: boolean;

  assessmentName: string;
  className: string;
  assessmentDate: string;

  p1StartTime: string;
  p1EndTime: string;

  p2CoverDate: string;
  p2StartTime: string;
  p2EndTime: string;
  p2DateCustom: boolean;
};

export type SavedAssessment = {
  id: string;
  status: SavedAssessmentStatus;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  setup: SavedAssessmentSetup;
  builder: SavedAssessmentBuilder;
};