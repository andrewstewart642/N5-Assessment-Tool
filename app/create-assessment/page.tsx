"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import LevelSelect from "./components/LevelSelect";
import { readMyClassesStorageValue } from "@/app/my-classes/state/ClassStorageKeys";
import ClassCoverageSelect from "../components/ClassCoverageSelect";
import { normaliseClass } from "@/app/my-classes/state/ClassNormalisation";
import {getAssessmentLevelOption, getDefaultAssessmentLevelId, loadAssessmentClassCoverageBrief, saveAssessmentClassCoverageBrief, type AssessmentLevelId,} from "@/app/create-assessment/setup/AssessmentClassCoverageStorage";
import {
  saveAssessmentSetupBrief,
  type AssessmentType,
  type BuildPriority,
  type PaperStructure,
} from "./setup/AssessmentSetupStorage";
import {
  createSavedAssessmentDraft,
  setCurrentSavedAssessmentId,
} from "@/app/my-assessments/state/SavedAssessmentsStorage";
import { ACTIVE_COURSE_CONFIG } from "@/course-data/course-configs/ActiveCourseConfig";
import { getCourseConfigById } from "@/course-data/course-configs/CourseConfigRegistry";
import { setBuilderActiveCourseId } from "@/app/create-assessment/builder/builder-logic/BuilderCourseConfig";
import {
  findCoursePaperConfigForSuitability,
  getCourseAssessmentStructure,
  getCoursePaperConfig,
  type CourseAssessmentConfig,
  type CoursePaperConfig,
} from "@/course-data/course-configs/CourseConfigTypes";
import type { Paper } from "@/shared-types/AssessmentTypes_TEMP";

type SetupCardProps = {
  title: string;
  children: React.ReactNode;
  theme: ReturnType<typeof useSettings>["theme"];
};

function SetupCard({ title, children, theme }: SetupCardProps) {
  return (
    <section
      style={{
        minWidth: 0,
        border: `1px solid ${theme.borderStandard}`,
        borderRadius: 22,
        background: theme.bgSurface,
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 14,
          color: theme.textPrimary,
        }}
      >
        {title}
      </div>

      <div style={{ display: "grid", gap: 10 }}>{children}</div>
    </section>
  );
}

type ChoiceRowProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  theme: ReturnType<typeof useSettings>["theme"];
};

function ChoiceRow({
  label,
  selected,
  onClick,
  children,
  theme,
}: ChoiceRowProps) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          border: `1px solid ${
            selected ? theme.controlSelectedBorder : theme.borderStandard
          }`,
          background: selected ? theme.controlSelectedBg : theme.controlBg,
          color: selected ? theme.textPrimary : theme.textSecondary,
          borderRadius: 14,
          padding: "12px 14px",
          cursor: "pointer",
          textAlign: "left",
          fontSize: 15,
          lineHeight: 1.3,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            border: `2px solid ${
              selected ? theme.accentPrimary : theme.textMuted
            }`,
            background: selected ? theme.accentPrimary : "transparent",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        />
        <span>{label}</span>
      </button>

      {selected && children ? (
        <div
          style={{
            marginLeft: 14,
            padding: 12,
            borderRadius: 16,
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgElevated,
            display: "grid",
            gap: 10,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

type CheckRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
};

function CheckRow({ label, checked, onToggle, theme }: CheckRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        border: `1px solid ${
          checked ? theme.controlSelectedBorder : theme.borderStandard
        }`,
        background: checked ? theme.controlSelectedBg : theme.controlBg,
        color: checked ? theme.textPrimary : theme.textSecondary,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 15,
        lineHeight: 1.3,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${
            checked ? theme.accentPrimary : theme.textMuted
          }`,
          background: checked ? theme.accentPrimary : "transparent",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      />
      <span>{label}</span>
    </button>
  );
}

type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  theme: ReturnType<typeof useSettings>["theme"];
};

function NumberField({
  label,
  value,
  onChange,
  suffix,
  theme,
}: NumberFieldProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 13,
          color: theme.textMuted,
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 10,
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 14,
          background: theme.controlBg,
          padding: "10px 12px",
        }}
      >
        <input
          type="number"
          min={1}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            color: theme.textPrimary,
            fontSize: 16,
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />

        <span
          style={{
            fontSize: 13,
            color: theme.textMuted,
            whiteSpace: "nowrap",
          }}
        >
          {suffix}
        </span>
      </div>
    </label>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  type?: "text" | "date";
  theme: ReturnType<typeof useSettings>["theme"];
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  onFocus,
  type = "text",
  theme,
}: TextFieldProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 13,
          color: theme.textMuted,
          fontWeight: 600,
        }}
      >
        {label}
      </span>

      <div
        style={{
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 14,
          background: theme.controlBg,
          padding: "10px 12px",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: theme.textPrimary,
            fontSize: 16,
            fontFamily: "inherit",
          }}
        />
      </div>
    </label>
  );
}

function toPositiveInt(value: string): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return Math.round(n);
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadAllClasses(): SchoolClass[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = readMyClassesStorageValue();
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(normaliseClass)
      .filter((item): item is SchoolClass => item !== null);
  } catch {
    return [];
  }
}

function isSetupAssessmentType(
  value: AssessmentType,
  courseConfig: CourseAssessmentConfig
): boolean {
  const visibleModeIds =
    courseConfig.visibleSetupAssessmentModeIds ??
    courseConfig.assessmentModes.map((mode) => mode.id);

  return visibleModeIds.includes(value);
}

function isSetupPaperStructure(
  value: PaperStructure,
  courseConfig: CourseAssessmentConfig
): boolean {
  const visibleStructureIds =
    courseConfig.visibleSetupAssessmentStructureIds ??
    courseConfig.assessmentStructures.map((structure) => structure.id);

  return visibleStructureIds.includes(value);
}

function getIncludedPapers(
  structure: PaperStructure,
  courseConfig: CourseAssessmentConfig
): Paper[] {
  return getCourseAssessmentStructure(courseConfig, structure).includedPapers;
}

function getSetupPaperConfig(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): CoursePaperConfig {
  const exactPaperConfig = courseConfig.papers.find(
    (paperConfig) => paperConfig.id === paper
  );

  if (exactPaperConfig) {
    return exactPaperConfig;
  }

  const aliasPaperConfig = findCoursePaperConfigForSuitability(
    courseConfig,
    paper
  );

  if (aliasPaperConfig) {
    return aliasPaperConfig;
  }

  return getCoursePaperConfig(courseConfig, paper);
}

function structureIncludesPaper(
  structure: PaperStructure | null,
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): boolean {
  if (!structure) return false;

  const includedPapers = getIncludedPapers(structure, courseConfig);

  if (includedPapers.includes(paper)) {
    return true;
  }

  const targetPaperConfig = getSetupPaperConfig(paper, courseConfig);

  return includedPapers.some((includedPaper) => {
    const includedPaperConfig = getSetupPaperConfig(
      includedPaper,
      courseConfig
    );

    return includedPaperConfig.id === targetPaperConfig.id;
  });
}

function getPaperLabel(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return getSetupPaperConfig(paper, courseConfig).label;
}

function getDefaultTargetMarks(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): number {
  return getSetupPaperConfig(paper, courseConfig).defaultTargetMarks;
}

function getDefaultTargetMarksText(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return String(getDefaultTargetMarks(paper, courseConfig));
}

function getDefaultTargetTime(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);
  return Math.round(paperConfig.defaultTargetMarks * paperConfig.minutesPerMark);
}

function getDefaultTargetTimeText(
  paper: Paper,
  courseConfig: CourseAssessmentConfig
): string {
  return String(getDefaultTargetTime(paper, courseConfig));
}

function estimateTimeFromMarks(
  paper: Paper,
  marks: number,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);
  return Math.round(marks * paperConfig.minutesPerMark);
}

function estimateMarksFromTime(
  paper: Paper,
  minutes: number,
  courseConfig: CourseAssessmentConfig
): number {
  const paperConfig = getSetupPaperConfig(paper, courseConfig);
  return Math.max(1, Math.floor(minutes / paperConfig.minutesPerMark));
}

export default function CreateAssessmentSetupPage() {
  const router = useRouter();
  const { theme } = useSettings();


  const [assessmentType, setAssessmentType] = useState<AssessmentType | null>(
    null
  );
  const [paperStructure, setPaperStructure] = useState<PaperStructure | null>(
    null
  );
  const [buildPriority, setBuildPriority] = useState<BuildPriority | null>(
    null
  );

  const [includeCoverSheet, setIncludeCoverSheet] = useState(true);
  const [includeFormulaSheet, setIncludeFormulaSheet] = useState(true);

  const [marksTargetP1, setMarksTargetP1] = useState("");
  const [marksTargetP2, setMarksTargetP2] = useState("");
  const [timeTargetP1, setTimeTargetP1] = useState("");
  const [timeTargetP2, setTimeTargetP2] = useState("");

  const [assessmentName, setAssessmentName] = useState("[Untitled file]");
  const [assessmentDate, setAssessmentDate] = useState(todayIsoDate());

  const [selectedLevelId, setSelectedLevelId] = useState<AssessmentLevelId | null>(
  getDefaultAssessmentLevelId()
);

const selectedCourseConfig = useMemo<CourseAssessmentConfig>(() => {
  return getCourseConfigById(selectedLevelId ?? ACTIVE_COURSE_CONFIG.courseId);
}, [selectedLevelId]);

const setupAssessmentModes = useMemo(() => {
  return selectedCourseConfig.assessmentModes.filter((mode) =>
    isSetupAssessmentType(mode.id, selectedCourseConfig)
  );
}, [selectedCourseConfig]);

const setupAssessmentStructures = useMemo(() => {
  return selectedCourseConfig.assessmentStructures.filter((structure) =>
    isSetupPaperStructure(structure.id, selectedCourseConfig)
  );
}, [selectedCourseConfig]);

const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [useCompleteCourseCoverage, setUseCompleteCourseCoverage] =
    useState(false);

  const [allClasses, setAllClasses] = useState<SchoolClass[]>([]);

  useEffect(() => {
    const savedCoverageBrief = loadAssessmentClassCoverageBrief();
    if (savedCoverageBrief) {
      setSelectedLevelId(
        savedCoverageBrief.levelId ?? getDefaultAssessmentLevelId()
      );
      setSelectedClassIds(savedCoverageBrief.selectedClassIds);
      setUseCompleteCourseCoverage(savedCoverageBrief.useCompleteCourseCoverage);
    }

    setAllClasses(loadAllClasses());
  }, []);

  useEffect(() => {
    if (!buildPriority || !paperStructure) return;

    const includesP1 = structureIncludesPaper(
      paperStructure,
      "P1",
      selectedCourseConfig
    );

    const includesP2 = structureIncludesPaper(
      paperStructure,
      "P2",
      selectedCourseConfig
    );

    if (buildPriority === "MARKS") {
      if (includesP1) {
        setMarksTargetP1((prev) =>
          prev.trim().length
            ? prev
            : getDefaultTargetMarksText("P1", selectedCourseConfig)
        );
      } else {
        setMarksTargetP1("");
      }

      if (includesP2) {
        setMarksTargetP2((prev) =>
          prev.trim().length
            ? prev
            : getDefaultTargetMarksText("P2", selectedCourseConfig)
        );
      } else {
        setMarksTargetP2("");
      }

      setTimeTargetP1("");
      setTimeTargetP2("");
      return;
    }

    if (includesP1) {
      setTimeTargetP1((prev) =>
        prev.trim().length
          ? prev
          : getDefaultTargetTimeText("P1", selectedCourseConfig)
      );
    } else {
      setTimeTargetP1("");
    }

    if (includesP2) {
      setTimeTargetP2((prev) =>
        prev.trim().length
          ? prev
          : getDefaultTargetTimeText("P2", selectedCourseConfig)
      );
    } else {
      setTimeTargetP2("");
    }

    setMarksTargetP1("");
    setMarksTargetP2("");
  }, [buildPriority, paperStructure, selectedCourseConfig]);

  const themeLevel = useMemo(() => {
  return getAssessmentLevelOption(selectedLevelId);
}, [selectedLevelId]);

  const levelClasses = useMemo(() => {
  if (!themeLevel) return [];

  return allClasses.filter(
    (schoolClass) => schoolClass.courseId === themeLevel.id
  );
}, [allClasses, themeLevel]);

  useEffect(() => {
    setSelectedClassIds((current) =>
      current.filter((classId) =>
        levelClasses.some((schoolClass) => schoolClass.id === classId)
      )
    );
  }, [levelClasses]);

  const showPaperStructure = assessmentType !== null;
  const showBuildPriority = paperStructure !== null;
  const showContinue =
    assessmentType !== null &&
    paperStructure !== null &&
    buildPriority !== null &&
    selectedLevelId !== null;

  const parsedMarksP1 = toPositiveInt(marksTargetP1);
  const parsedMarksP2 = toPositiveInt(marksTargetP2);
  const parsedTimeP1 = toPositiveInt(timeTargetP1);
  const parsedTimeP2 = toPositiveInt(timeTargetP2);

  const targetsValid = useMemo(() => {
    if (!buildPriority || !paperStructure) return false;

    const includesP1 = structureIncludesPaper(
      paperStructure,
      "P1",
      selectedCourseConfig
    );

    const includesP2 = structureIncludesPaper(
      paperStructure,
      "P2",
      selectedCourseConfig
    );

    if (buildPriority === "MARKS") {
      const p1Valid = !includesP1 || parsedMarksP1 !== null;
      const p2Valid = !includesP2 || parsedMarksP2 !== null;
      return p1Valid && p2Valid;
    }

    const p1Valid = !includesP1 || parsedTimeP1 !== null;
    const p2Valid = !includesP2 || parsedTimeP2 !== null;
    return p1Valid && p2Valid;
  }, [
    buildPriority,
    paperStructure,
    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,
    selectedCourseConfig,
  ]);

  const derivedSummary = useMemo(() => {
    if (!buildPriority || !paperStructure) return [];

    const rows: string[] = [];
    const includedPapers = getIncludedPapers(
      paperStructure,
      selectedCourseConfig
    );

    if (buildPriority === "MARKS") {
      if (includedPapers.includes("P1") && parsedMarksP1 !== null) {
        rows.push(
          `${getPaperLabel("P1", selectedCourseConfig)} estimated time: ${estimateTimeFromMarks(
            "P1",
            parsedMarksP1,
            selectedCourseConfig
          )} mins`
        );
      }

      if (includedPapers.includes("P2") && parsedMarksP2 !== null) {
        rows.push(
          `${getPaperLabel("P2", selectedCourseConfig)} estimated time: ${estimateTimeFromMarks(
            "P2",
            parsedMarksP2,
            selectedCourseConfig
          )} mins`
        );
      }

      return rows;
    }

    if (includedPapers.includes("P1") && parsedTimeP1 !== null) {
      rows.push(
        `${getPaperLabel("P1", selectedCourseConfig)} estimated marks: ${estimateMarksFromTime(
          "P1",
          parsedTimeP1,
          selectedCourseConfig
        )}`
      );
    }

    if (includedPapers.includes("P2") && parsedTimeP2 !== null) {
      rows.push(
        `${getPaperLabel("P2", selectedCourseConfig)} estimated marks: ${estimateMarksFromTime(
          "P2",
          parsedTimeP2,
          selectedCourseConfig
        )}`
      );
    }

    return rows;
  }, [
    buildPriority,
    paperStructure,
    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,
    selectedCourseConfig,
  ]);

  function handleContinue() {
    if (
      !assessmentType ||
      !paperStructure ||
      !buildPriority ||
      !targetsValid ||
      !selectedLevelId
    ) {
      return;
    }

    const now = Date.now();

    const coursePapers = selectedCourseConfig.papers.map((paper) => paper.id);
    const includedPapers = getIncludedPapers(
      paperStructure,
      selectedCourseConfig
    );

    const firstCoursePaper = coursePapers[0] ?? "P1";
    const secondCoursePaper = coursePapers[1] ?? firstCoursePaper;

    const initialActivePaper = includedPapers[0] ?? firstCoursePaper;

    const emptyDraftByPaper = coursePapers.reduce<Record<Paper, null>>(
      (drafts, paper) => {
        drafts[paper] = null;
        return drafts;
      },
      {}
    );

    const normalisedAssessmentName =
      assessmentName.trim().length > 0
        ? assessmentName.trim()
        : "[Untitled file]";

    const normalisedAssessmentDate = assessmentDate || todayIsoDate();

    const normalisedUseCompleteCourseCoverage =
      useCompleteCourseCoverage || selectedClassIds.length === 0;

    const initialP1Target =
      buildPriority === "MARKS"
        ? parsedMarksP1 ??
          getDefaultTargetMarks(firstCoursePaper, selectedCourseConfig)
        : parsedTimeP1 !== null
          ? estimateMarksFromTime(
              firstCoursePaper,
              parsedTimeP1,
              selectedCourseConfig
            )
          : getDefaultTargetMarks(firstCoursePaper, selectedCourseConfig);

    const initialP2Target =
      buildPriority === "MARKS"
        ? parsedMarksP2 ??
          getDefaultTargetMarks(secondCoursePaper, selectedCourseConfig)
        : parsedTimeP2 !== null
          ? estimateMarksFromTime(
              secondCoursePaper,
              parsedTimeP2,
              selectedCourseConfig
            )
          : getDefaultTargetMarks(secondCoursePaper, selectedCourseConfig);

    const targetMarksByPaper = {
      [firstCoursePaper]: initialP1Target,
      [secondCoursePaper]: initialP2Target,
    };

    setBuilderActiveCourseId(selectedCourseConfig.courseId);

    saveAssessmentSetupBrief({
      courseId: selectedCourseConfig.courseId,
      assessmentType,
      buildPriority,
      paperStructure,
      includeCoverSheet,
      includeFormulaSheet,
      marksTargetP1: buildPriority === "MARKS" ? parsedMarksP1 : null,
      marksTargetP2: buildPriority === "MARKS" ? parsedMarksP2 : null,
      timeTargetP1: buildPriority === "TIME" ? parsedTimeP1 : null,
      timeTargetP2: buildPriority === "TIME" ? parsedTimeP2 : null,
      assessmentName: normalisedAssessmentName,
      className: "",
      assessmentDate: normalisedAssessmentDate,
      createdAt: now,
    });

    saveAssessmentClassCoverageBrief({
      levelId: selectedLevelId,
      selectedClassIds,
      useCompleteCourseCoverage: normalisedUseCompleteCourseCoverage,
      savedAt: now,
    });

    const savedAssessment = createSavedAssessmentDraft({
      setup: {
        courseId: selectedCourseConfig.courseId,
        assessmentType,
        buildPriority,
        paperStructure,
        includeCoverSheet,
        includeFormulaSheet,
        marksTargetP1: buildPriority === "MARKS" ? parsedMarksP1 : null,
        marksTargetP2: buildPriority === "MARKS" ? parsedMarksP2 : null,
        timeTargetP1: buildPriority === "TIME" ? parsedTimeP1 : null,
        timeTargetP2: buildPriority === "TIME" ? parsedTimeP2 : null,
        assessmentName: normalisedAssessmentName,
        className: "",
        assessmentDate: normalisedAssessmentDate,
        levelId: selectedLevelId,
        selectedClassIds,
        useCompleteCourseCoverage: normalisedUseCompleteCourseCoverage,
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
coverDateByPaper: coursePapers.reduce<Record<Paper, string>>(
  (dates, paper) => {
    dates[paper] = normalisedAssessmentDate;
    return dates;
  },
  {}
),
startTimeByPaper: coursePapers.reduce<Record<Paper, string>>(
  (times, paper) => {
    times[paper] = "";
    return times;
  },
  {}
),
endTimeByPaper: coursePapers.reduce<Record<Paper, string>>(
  (times, paper) => {
    times[paper] = "";
    return times;
  },
  {}
),
coverDateCustomByPaper: coursePapers.reduce<Record<Paper, boolean>>(
  (customFlags, paper) => {
    customFlags[paper] = false;
    return customFlags;
  },
  {}
),
p1StartTime: "",
        p1EndTime: "",
        p2CoverDate: normalisedAssessmentDate,
        p2StartTime: "",
        p2EndTime: "",
        p2DateCustom: false,
      },
    });

    setCurrentSavedAssessmentId(savedAssessment.id);
    router.push("/create-assessment/builder");
  }

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

function handleLevelChange(nextLevelId: AssessmentLevelId) {
  setSelectedLevelId(nextLevelId);

  setAssessmentType(null);
  setPaperStructure(null);
  setBuildPriority(null);

  setMarksTargetP1("");
  setMarksTargetP2("");
  setTimeTargetP1("");
  setTimeTargetP2("");

  setSelectedClassIds([]);
  setUseCompleteCourseCoverage(false);
}

function handleToggleClass(classId: string) {
  setUseCompleteCourseCoverage(false);
  setSelectedClassIds((current) =>
    current.includes(classId)
      ? current.filter((id) => id !== classId)
      : [...current, classId]
  );
}

function handleSelectCompleteCourseCoverage() {
  setUseCompleteCourseCoverage(true);
  setSelectedClassIds([]);
}

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.bgPage,
        color: theme.textPrimary,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gap: 22,
        }}
      >
        <section
          style={{
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgSurface,
            borderRadius: 22,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 28,
              color: theme.textPrimary,
              marginBottom: 8,
            }}
          >
            Create Assessment
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 15,
              color: theme.textMuted,
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            Build the assessment brief first. The setup stays compact inside the
            page width, with nested options appearing directly under the choice
            they belong to.
          </div>
        </section>

        <section
          style={{
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgSurface,
            borderRadius: 22,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 18,
              color: theme.textPrimary,
              marginBottom: 14,
            }}
          >
            Assessment details
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.2fr) 260px minmax(0, 1.15fr) 220px",
              gap: 14,
              alignItems: "start",
            }}
          >
            <div onBlur={handleAssessmentNameBlur}>
              <TextField
                label="Assessment name"
                value={assessmentName}
                onChange={setAssessmentName}
                onFocus={handleAssessmentNameFocus}
                theme={theme}
              />
            </div>

            <LevelSelect
              value={selectedLevelId}
              onChange={handleLevelChange}
              theme={theme}
            />

            <ClassCoverageSelect
              levelLabel={themeLevel?.label ?? null}
              classes={levelClasses}
              selectedClassIds={selectedClassIds}
              useCompleteCourseCoverage={useCompleteCourseCoverage}
              onToggleClass={handleToggleClass}
              onSelectCompleteCourseCoverage={handleSelectCompleteCourseCoverage}
              theme={theme}
            />

            <TextField
              label="Assessment date"
              type="date"
              value={assessmentDate}
              onChange={setAssessmentDate}
              theme={theme}
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(280px, 1fr))",
            gap: 18,
            alignItems: "start",
          }}
        >
          <SetupCard title="1. Assessment Type" theme={theme}>
            {setupAssessmentModes.map((mode) => (
              <ChoiceRow
                key={mode.id}
                label={mode.label}
                selected={assessmentType === mode.id}
                onClick={() => setAssessmentType(mode.id)}
                theme={theme}
              />
            ))}
          </SetupCard>

          <SetupCard title="2. Paper Structure" theme={theme}>
            {showPaperStructure ? (
              <>
                {setupAssessmentStructures.map((structure) => (
                  <ChoiceRow
                    key={structure.id}
                    label={structure.label}
                    selected={paperStructure === structure.id}
                    onClick={() => setPaperStructure(structure.id)}
                    theme={theme}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: theme.textMuted,
                        marginBottom: 2,
                      }}
                    >
                      Include
                    </div>

                    <CheckRow
                      label="Cover sheet"
                      checked={includeCoverSheet}
                      onToggle={() => setIncludeCoverSheet((prev) => !prev)}
                      theme={theme}
                    />

                    <CheckRow
                      label="Formula sheet"
                      checked={includeFormulaSheet}
                      onToggle={() => setIncludeFormulaSheet((prev) => !prev)}
                      theme={theme}
                    />
                  </ChoiceRow>
                ))}
              </>
            ) : (
              <div
                style={{
                  border: `1px dashed ${theme.borderStandard}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  color: theme.textMuted,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Choose an assessment type first.
              </div>
            )}
          </SetupCard>

          <SetupCard title="3. Build Priority" theme={theme}>
            {showBuildPriority ? (
              <>
                <ChoiceRow
                  label="Marks-led"
                  selected={buildPriority === "MARKS"}
                  onClick={() => setBuildPriority("MARKS")}
                  theme={theme}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    Targets
                  </div>

                  {structureIncludesPaper(
                    paperStructure,
                    "P1",
                    selectedCourseConfig
                  ) ? (
                    <NumberField
                      label={`${getPaperLabel("P1", selectedCourseConfig)} target`}
                      value={marksTargetP1}
                      onChange={setMarksTargetP1}
                      suffix="marks"
                      theme={theme}
                    />
                  ) : null}

                  {structureIncludesPaper(
                    paperStructure,
                    "P2",
                    selectedCourseConfig
                  ) ? (
                    <NumberField
                      label={`${getPaperLabel("P2", selectedCourseConfig)} target`}
                      value={marksTargetP2}
                      onChange={setMarksTargetP2}
                      suffix="marks"
                      theme={theme}
                    />
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gap: 4,
                      fontSize: 13,
                      color: theme.textMuted,
                    }}
                  >
                    {buildPriority === "MARKS"
                      ? derivedSummary.map((row) => <div key={row}>{row}</div>)
                      : null}
                  </div>
                </ChoiceRow>

                <ChoiceRow
                  label="Time-led"
                  selected={buildPriority === "TIME"}
                  onClick={() => setBuildPriority("TIME")}
                  theme={theme}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: theme.textMuted,
                      marginBottom: 2,
                    }}
                  >
                    Targets
                  </div>

                  {structureIncludesPaper(
                    paperStructure,
                    "P1",
                    selectedCourseConfig
                  ) ? (
                    <NumberField
                      label={`${getPaperLabel("P1", selectedCourseConfig)} target`}
                      value={timeTargetP1}
                      onChange={setTimeTargetP1}
                      suffix="minutes"
                      theme={theme}
                    />
                  ) : null}

                  {structureIncludesPaper(
                    paperStructure,
                    "P2",
                    selectedCourseConfig
                  ) ? (
                    <NumberField
                      label={`${getPaperLabel("P2", selectedCourseConfig)} target`}
                      value={timeTargetP2}
                      onChange={setTimeTargetP2}
                      suffix="minutes"
                      theme={theme}
                    />
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gap: 4,
                      fontSize: 13,
                      color: theme.textMuted,
                    }}
                  >
                    {buildPriority === "TIME"
                      ? derivedSummary.map((row) => <div key={row}>{row}</div>)
                      : null}
                  </div>
                </ChoiceRow>
              </>
            ) : (
              <div
                style={{
                  border: `1px dashed ${theme.borderStandard}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  color: theme.textMuted,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Choose a paper structure first.
              </div>
            )}
          </SetupCard>
        </section>

        <section
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={handleContinue}
            disabled={!showContinue || !targetsValid}
            style={{
              minWidth: 240,
              height: 58,
              borderRadius: 18,
              border: `1px solid ${
                showContinue && targetsValid
                  ? theme.controlSelectedBorder
                  : theme.borderStandard
              }`,
              background:
                showContinue && targetsValid
                  ? theme.controlSelectedBg
                  : theme.controlBg,
              color:
                showContinue && targetsValid
                  ? theme.textPrimary
                  : theme.textMuted,
              cursor:
                showContinue && targetsValid ? "pointer" : "not-allowed",
              fontSize: 16,
              fontWeight: 700,
              boxShadow:
                showContinue && targetsValid
                  ? "0 12px 24px rgba(0,0,0,0.18)"
                  : "none",
            }}
          >
            Continue to Builder →
          </button>
        </section>
      </div>
    </main>
  );
}