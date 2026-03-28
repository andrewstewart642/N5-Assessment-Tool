"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import LevelSelect from "./components/LevelSelect";
import ClassCoverageSelect from "../components/ClassCoverageSelect";
import {
  ASSESSMENT_LEVEL_OPTIONS,
  loadAssessmentClassCoverageBrief,
  saveAssessmentClassCoverageBrief,
  type AssessmentLevelId,
} from "./setup/AssessmentClassCoverageStorage";
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
        border: `1px solid ${theme.border}`,
        borderRadius: 22,
        background: theme.panelBg,
        padding: 18,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 14,
          color: theme.text,
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
            selected ? theme.accent : theme.border
          }`,
          background: selected
            ? theme.accentSoft
            : theme.buttonGhostBg,
          color: selected ? theme.text : theme.textSoft,
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
              selected ? theme.accent : theme.textMuted
            }`,
            background: selected ? theme.accent : "transparent",
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
            border: `1px solid ${theme.border}`,
            background: theme.buttonGhostBg,
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
          checked ? theme.accent : theme.border
        }`,
        background: checked
          ? theme.accentSoft
          : theme.buttonGhostBg,
        color: checked ? theme.text : theme.textSoft,
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
            checked ? theme.accent : theme.textMuted
          }`,
          background: checked ? theme.accent : "transparent",
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
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          background: theme.buttonGhostBg,
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
            color: theme.text,
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
          border: `1px solid ${theme.border}`,
          borderRadius: 14,
          background: theme.buttonGhostBg,
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
            color: theme.text,
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
    const raw = window.localStorage.getItem("n5-my-classes");
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is SchoolClass => {
      if (!item || typeof item !== "object") return false;

      const candidate = item as Partial<SchoolClass>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        typeof candidate.course === "string" &&
        typeof candidate.level === "string" &&
        typeof candidate.teacher === "string" &&
        typeof candidate.createdAt === "number" &&
        Array.isArray(candidate.completedSkillIds)
      );
    });
  } catch {
    return [];
  }
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
    "N5_MATHS"
  );
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [useCompleteCourseCoverage, setUseCompleteCourseCoverage] =
    useState(false);

  const [allClasses, setAllClasses] = useState<SchoolClass[]>([]);

  useEffect(() => {
    const savedCoverageBrief = loadAssessmentClassCoverageBrief();
    if (savedCoverageBrief) {
      setSelectedLevelId(savedCoverageBrief.levelId ?? "N5_MATHS");
      setSelectedClassIds(savedCoverageBrief.selectedClassIds);
      setUseCompleteCourseCoverage(savedCoverageBrief.useCompleteCourseCoverage);
    }

    setAllClasses(loadAllClasses());
  }, []);

  useEffect(() => {
    if (!buildPriority || !paperStructure) return;

    if (buildPriority === "MARKS") {
      if (paperStructure === "BOTH") {
        setMarksTargetP1((prev) => (prev.trim().length ? prev : "40"));
        setMarksTargetP2((prev) => (prev.trim().length ? prev : "50"));
      } else if (paperStructure === "P1_ONLY") {
        setMarksTargetP1((prev) => (prev.trim().length ? prev : "40"));
        setMarksTargetP2("");
      } else {
        setMarksTargetP2((prev) => (prev.trim().length ? prev : "50"));
        setMarksTargetP1("");
      }

      setTimeTargetP1("");
      setTimeTargetP2("");
      return;
    }

    if (paperStructure === "BOTH") {
      setTimeTargetP1((prev) => (prev.trim().length ? prev : "60"));
      setTimeTargetP2((prev) => (prev.trim().length ? prev : "90"));
    } else if (paperStructure === "P1_ONLY") {
      setTimeTargetP1((prev) => (prev.trim().length ? prev : "60"));
      setTimeTargetP2("");
    } else {
      setTimeTargetP2((prev) => (prev.trim().length ? prev : "90"));
      setTimeTargetP1("");
    }

    setMarksTargetP1("");
    setMarksTargetP2("");
  }, [buildPriority, paperStructure]);

  const themeLevel = useMemo(() => {
    return (
      ASSESSMENT_LEVEL_OPTIONS.find((option) => option.id === selectedLevelId) ?? null
    );
  }, [selectedLevelId]);

  const levelClasses = useMemo(() => {
    if (!themeLevel) return [];
    return allClasses.filter(
      (schoolClass) => schoolClass.course === themeLevel.classCourseLabel
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

    if (buildPriority === "MARKS") {
      if (paperStructure === "BOTH") {
        return parsedMarksP1 !== null && parsedMarksP2 !== null;
      }
      if (paperStructure === "P1_ONLY") {
        return parsedMarksP1 !== null;
      }
      return parsedMarksP2 !== null;
    }

    if (paperStructure === "BOTH") {
      return parsedTimeP1 !== null && parsedTimeP2 !== null;
    }
    if (paperStructure === "P1_ONLY") {
      return parsedTimeP1 !== null;
    }
    return parsedTimeP2 !== null;
  }, [
    buildPriority,
    paperStructure,
    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,
  ]);

  const derivedSummary = useMemo(() => {
    if (!buildPriority || !paperStructure) return [];

    if (buildPriority === "MARKS") {
      const rows: string[] = [];

      if (paperStructure !== "P2_ONLY" && parsedMarksP1 !== null) {
        rows.push(
          `Paper 1 estimated time: ${Math.round(parsedMarksP1 * 1.5)} mins`
        );
      }

      if (paperStructure !== "P1_ONLY" && parsedMarksP2 !== null) {
        rows.push(
          `Paper 2 estimated time: ${Math.round(parsedMarksP2 * 1.8)} mins`
        );
      }

      return rows;
    }

    const rows: string[] = [];

    if (paperStructure !== "P2_ONLY" && parsedTimeP1 !== null) {
      rows.push(`Paper 1 estimated marks: ${Math.floor(parsedTimeP1 / 1.5)}`);
    }

    if (paperStructure !== "P1_ONLY" && parsedTimeP2 !== null) {
      rows.push(`Paper 2 estimated marks: ${Math.floor(parsedTimeP2 / 1.8)}`);
    }

    return rows;
  }, [
    buildPriority,
    paperStructure,
    parsedMarksP1,
    parsedMarksP2,
    parsedTimeP1,
    parsedTimeP2,
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

    const normalisedAssessmentName =
      assessmentName.trim().length > 0
        ? assessmentName.trim()
        : "[Untitled file]";

    const normalisedAssessmentDate = assessmentDate || todayIsoDate();

    const normalisedUseCompleteCourseCoverage =
      useCompleteCourseCoverage || selectedClassIds.length === 0;

    const initialP1Target =
      buildPriority === "MARKS"
        ? parsedMarksP1 ?? 40
        : parsedTimeP1 !== null
          ? Math.max(1, Math.floor(parsedTimeP1 / 1.5))
          : 40;

    const initialP2Target =
      buildPriority === "MARKS"
        ? parsedMarksP2 ?? 50
        : parsedTimeP2 !== null
          ? Math.max(1, Math.floor(parsedTimeP2 / 1.8))
          : 50;

    saveAssessmentSetupBrief({
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
        activePaper: paperStructure === "P2_ONLY" ? "P2" : "P1",
        viewPaper: paperStructure === "P2_ONLY" ? "P2" : "P1",
        p1Target: initialP1Target,
        p2Target: initialP2Target,
        questions: [],
        draftByPaper: { P1: null, P2: null },
        editDraftByPaper: { P1: null, P2: null },
        includeCoverSheet,
        includeFormulaSheet,
        showCoverDateTime: false,
        showScottishCandidateNumberBox: true,
        assessmentName: normalisedAssessmentName,
        className: "",
        assessmentDate: normalisedAssessmentDate,
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
        background: theme.pageBg,
        color: theme.text,
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
            border: `1px solid ${theme.border}`,
            background: theme.panelBg,
            borderRadius: 22,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 28,
              color: theme.text,
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
            border: `1px solid ${theme.border}`,
            background: theme.panelBg,
            borderRadius: 22,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 18,
              color: theme.text,
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

            <LevelSelect value={selectedLevelId} onChange={setSelectedLevelId} />

            <ClassCoverageSelect
              levelLabel={themeLevel?.label ?? null}
              classes={levelClasses}
              selectedClassIds={selectedClassIds}
              useCompleteCourseCoverage={useCompleteCourseCoverage}
              onToggleClass={handleToggleClass}
              onSelectCompleteCourseCoverage={handleSelectCompleteCourseCoverage}
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
            <ChoiceRow
              label="Prelim Assessment (SQA)"
              selected={assessmentType === "PRELIM"}
              onClick={() => setAssessmentType("PRELIM")}
              theme={theme}
            />

            <ChoiceRow
              label="Class Test"
              selected={assessmentType === "CLASS_TEST"}
              onClick={() => setAssessmentType("CLASS_TEST")}
              theme={theme}
            />

            <ChoiceRow
              label="Homework"
              selected={assessmentType === "HOMEWORK"}
              onClick={() => setAssessmentType("HOMEWORK")}
              theme={theme}
            />
          </SetupCard>

          <SetupCard title="2. Paper Structure" theme={theme}>
            {showPaperStructure ? (
              <>
                <ChoiceRow
                  label="Both Paper 1 & Paper 2"
                  selected={paperStructure === "BOTH"}
                  onClick={() => setPaperStructure("BOTH")}
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

                <ChoiceRow
                  label="Paper 1 only"
                  selected={paperStructure === "P1_ONLY"}
                  onClick={() => setPaperStructure("P1_ONLY")}
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

                <ChoiceRow
                  label="Paper 2 only"
                  selected={paperStructure === "P2_ONLY"}
                  onClick={() => setPaperStructure("P2_ONLY")}
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
              </>
            ) : (
              <div
                style={{
                  border: `1px dashed ${theme.border}`,
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

                  {paperStructure !== "P2_ONLY" ? (
                    <NumberField
                      label="Paper 1 target"
                      value={marksTargetP1}
                      onChange={setMarksTargetP1}
                      suffix="marks"
                      theme={theme}
                    />
                  ) : null}

                  {paperStructure !== "P1_ONLY" ? (
                    <NumberField
                      label="Paper 2 target"
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

                  {paperStructure !== "P2_ONLY" ? (
                    <NumberField
                      label="Paper 1 target"
                      value={timeTargetP1}
                      onChange={setTimeTargetP1}
                      suffix="minutes"
                      theme={theme}
                    />
                  ) : null}

                  {paperStructure !== "P1_ONLY" ? (
                    <NumberField
                      label="Paper 2 target"
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
                  border: `1px dashed ${theme.border}`,
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
                showContinue && targetsValid ? theme.accent : theme.border
              }`,
              background:
                showContinue && targetsValid
                  ? theme.accentSoft
                  : theme.buttonGhostBg,
              color:
                showContinue && targetsValid
                  ? theme.text
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