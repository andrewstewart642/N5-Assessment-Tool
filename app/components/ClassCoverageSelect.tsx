"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SchoolClass } from "@/app/my-classes/types/Classes";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  levelLabel: string | null;
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  onToggleClass: (classId: string) => void;
  onSelectCompleteCourseCoverage: () => void;

  label?: string;
  emptyText?: string;
  disabledText?: string;
  completeCoverageSummaryText?: string;
  hideHelperText?: boolean;
  compact?: boolean;
  width?: number | string;
  dropdownWidth?: number | string;
  zIndex?: number;
  theme?: AppTheme;
};

function getSummaryText(args: {
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  completeCoverageSummaryText: string;
}): string {
  const {
    classes,
    selectedClassIds,
    useCompleteCourseCoverage,
    completeCoverageSummaryText,
  } = args;

  if (useCompleteCourseCoverage) {
    return completeCoverageSummaryText;
  }

  if (selectedClassIds.length === 0) {
    return "Select classes";
  }

  const selectedClasses = classes.filter((item) =>
    selectedClassIds.includes(item.id)
  );

  if (selectedClasses.length === 1) {
    return selectedClasses[0].name;
  }

  if (selectedClasses.length === 2) {
    return `${selectedClasses[0].name}, ${selectedClasses[1].name}`;
  }

  return `${selectedClasses.length} classes selected`;
}

export default function ClassCoverageSelect({
  levelLabel,
  classes,
  selectedClassIds,
  useCompleteCourseCoverage,
  onToggleClass,
  onSelectCompleteCourseCoverage,
  label = "Classes sitting this assessment",
  emptyText = "Select classes",
  disabledText = "Choose level first",
  completeCoverageSummaryText = "Complete course coverage",
  hideHelperText = false,
  compact = false,
  width = "100%",
  dropdownWidth = "100%",
  zIndex = 20,
  theme,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const summaryText = useMemo(() => {
    const rawSummary = getSummaryText({
      classes,
      selectedClassIds,
      useCompleteCourseCoverage,
      completeCoverageSummaryText,
    });

    if (!useCompleteCourseCoverage && selectedClassIds.length === 0) {
      return emptyText;
    }

    return rawSummary;
  }, [
    classes,
    selectedClassIds,
    useCompleteCourseCoverage,
    completeCoverageSummaryText,
    emptyText,
  ]);

  const helperText = useMemo(() => {
    if (useCompleteCourseCoverage) {
      return "Builder will show the full course tree.";
    }

    if (selectedClassIds.length > 0) {
      return "Builder will only show skills covered by all selected classes.";
    }

    return levelLabel
      ? "Choose one or more classes, or use complete course coverage."
      : "Choose a level first.";
  }, [levelLabel, selectedClassIds.length, useCompleteCourseCoverage]);

  const labelStyle: React.CSSProperties = {
    fontSize: compact ? 12 : 13,
    color: theme ? theme.subtleText : "rgba(214,227,243,0.72)",
    fontWeight: 600,
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };

  const triggerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    border: theme
      ? `1px solid ${theme.inputBorder}`
      : "1px solid rgba(255,255,255,0.10)",
    borderRadius: compact ? 10 : 14,
    background: theme ? theme.inputBg : "rgba(255,255,255,0.02)",
    padding: compact ? "0 10px" : "10px 12px",
    minHeight: compact ? 30 : 48,
    height: compact ? 30 : undefined,
    cursor: levelLabel ? "pointer" : "not-allowed",
    color: levelLabel
      ? theme?.inputText ?? "#f7fbff"
      : theme?.textDim ?? "rgba(214,227,243,0.45)",
    fontSize: compact ? 13 : 16,
    fontFamily: "inherit",
    fontWeight: compact ? 600 : undefined,
    textAlign: "left",
    boxSizing: "border-box",
    transition:
      "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        display: "grid",
        gap: hideHelperText ? 3 : 6,
        position: "relative",
        width,
        minWidth: 0,
      }}
    >
      <span style={labelStyle}>{label}</span>

      <button
        type="button"
        onClick={() => {
          if (!levelLabel) return;
          setOpen((prev) => !prev);
        }}
        style={triggerStyle}
      >
        <span
          style={{
            display: "block",
            flex: "1 1 auto",
            minWidth: 0,
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {levelLabel ? summaryText : disabledText}
        </span>

        <span
          style={{
            color: theme ? theme.subtleText : "rgba(214,227,243,0.72)",
            fontSize: compact ? 11 : 14,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 140ms ease",
            flexShrink: 0,
            marginLeft: 2,
            lineHeight: 1,
          }}
        >
          ▾
        </span>
      </button>

      {!hideHelperText ? (
        <div
          style={{
            fontSize: 12,
            lineHeight: 1.4,
            color: theme ? theme.mutedText : "rgba(214,227,243,0.58)",
          }}
        >
          {helperText}
        </div>
      ) : null}

      {open && levelLabel ? (
        <div
          style={{
            position: "absolute",
            top: hideHelperText ? "calc(100% + 6px)" : "100%",
            left: 0,
            width: dropdownWidth,
            marginTop: hideHelperText ? 0 : 8,
            border: theme
              ? `1px solid ${theme.borderSoft}`
              : "1px solid rgba(255,255,255,0.10)",
            borderRadius: 16,
            background: theme?.bgElevated ?? "#121a24",
            boxShadow: theme?.shadowStrong ?? "0 18px 36px rgba(0,0,0,0.28)",
            padding: 10,
            zIndex,
            display: "grid",
            gap: 8,
          }}
        >
          <div
            className="hover-scroll"
            style={{
              maxHeight: 260,
              overflowY: "auto",
              display: "grid",
              gap: 8,
            }}
          >
            {classes.length > 0 ? (
              classes.map((schoolClass) => {
                const checked = selectedClassIds.includes(schoolClass.id);

                return (
                  <button
                    key={schoolClass.id}
                    type="button"
                    onClick={() => onToggleClass(schoolClass.id)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "18px minmax(0, 1fr)",
                      alignItems: "start",
                      gap: 10,
                      width: "100%",
                      border: `1px solid ${
                        checked
                          ? theme?.controlSelectedBorder ?? "#60a5fa"
                          : theme?.borderSoft ?? "rgba(255,255,255,0.08)"
                      }`,
                      borderRadius: 12,
                      background: checked
                        ? theme?.controlSelectedBg ?? "rgba(37,99,235,0.16)"
                        : theme?.controlBg ?? "rgba(255,255,255,0.03)",
                      padding: "10px 12px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition:
                        "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${
                          checked
                            ? theme?.controlSelectedBorder ?? "#93c5fd"
                            : theme?.textDim ?? "rgba(214,227,243,0.50)"
                        }`,
                        background: checked
                          ? theme?.controlSelectedBorder ?? "#60a5fa"
                          : "transparent",
                        boxSizing: "border-box",
                        marginTop: 1,
                      }}
                    />

                    <span style={{ minWidth: 0, display: "grid", gap: 4 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: checked
                            ? theme?.textPrimary ?? "#eaf3ff"
                            : theme?.textSecondary ?? "#d6e3f3",
                        }}
                      >
                        {schoolClass.name}
                      </span>

                      <span
                        style={{
                          fontSize: 12,
                          lineHeight: 1.35,
                          color: theme?.mutedText ?? "rgba(214,227,243,0.60)",
                        }}
                      >
                        {[schoolClass.level, schoolClass.teacher]
                          .filter(Boolean)
                          .join(" • ") || schoolClass.course}
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <div
                style={{
                  border: theme
                    ? `1px dashed ${theme.borderSoft}`
                    : "1px dashed rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: theme?.mutedText ?? "rgba(214,227,243,0.58)",
                }}
              >
                No classes found for this level yet.
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: theme
                ? `1px solid ${theme.borderSoft}`
                : "1px solid rgba(255,255,255,0.08)",
              paddingTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onSelectCompleteCourseCoverage}
              style={{
                display: "grid",
                gridTemplateColumns: "18px minmax(0, 1fr)",
                alignItems: "start",
                gap: 10,
                width: "100%",
                border: `1px solid ${
                  useCompleteCourseCoverage
                    ? theme?.controlSelectedBorder ?? "#60a5fa"
                    : theme?.borderSoft ?? "rgba(255,255,255,0.08)"
                }`,
                borderRadius: 12,
                background: useCompleteCourseCoverage
                  ? theme?.controlSelectedBg ?? "rgba(37,99,235,0.16)"
                  : theme?.controlBg ?? "rgba(255,255,255,0.03)",
                padding: "10px 12px",
                cursor: "pointer",
                textAlign: "left",
                transition:
                  "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  border: `2px solid ${
                    useCompleteCourseCoverage
                      ? theme?.controlSelectedBorder ?? "#93c5fd"
                      : theme?.textDim ?? "rgba(214,227,243,0.50)"
                  }`,
                  background: useCompleteCourseCoverage
                    ? theme?.controlSelectedBorder ?? "#60a5fa"
                    : "transparent",
                  boxSizing: "border-box",
                  marginTop: 1,
                }}
              />

              <span style={{ minWidth: 0, display: "grid", gap: 4 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: useCompleteCourseCoverage
                      ? theme?.textPrimary ?? "#eaf3ff"
                      : theme?.textSecondary ?? "#d6e3f3",
                  }}
                >
                  Show complete course coverage
                </span>

                <span
                  style={{
                    fontSize: 12,
                    lineHeight: 1.35,
                    color: theme?.mutedText ?? "rgba(214,227,243,0.60)",
                  }}
                >
                  Ignore class coverage filters and show the full course tree.
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}