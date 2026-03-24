"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SchoolClass } from "@/app/my-classes/types/Classes";

type Props = {
  levelLabel: string | null;
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
  onToggleClass: (classId: string) => void;
  onSelectCompleteCourseCoverage: () => void;
};

function getSummaryText(args: {
  classes: SchoolClass[];
  selectedClassIds: string[];
  useCompleteCourseCoverage: boolean;
}): string {
  const { classes, selectedClassIds, useCompleteCourseCoverage } = args;

  if (useCompleteCourseCoverage) {
    return "Complete course coverage";
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
    return getSummaryText({
      classes,
      selectedClassIds,
      useCompleteCourseCoverage,
    });
  }, [classes, selectedClassIds, useCompleteCourseCoverage]);

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

  return (
    <div ref={wrapperRef} style={{ display: "grid", gap: 6, position: "relative" }}>
      <span
        style={{
          fontSize: 13,
          color: "rgba(214,227,243,0.72)",
          fontWeight: 600,
        }}
      >
        Classes sitting this assessment
      </span>

      <button
        type="button"
        onClick={() => {
          if (!levelLabel) return;
          setOpen((prev) => !prev);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          padding: "10px 12px",
          minHeight: 48,
          cursor: levelLabel ? "pointer" : "not-allowed",
          color: levelLabel ? "#f7fbff" : "rgba(214,227,243,0.45)",
          fontSize: 16,
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
          {levelLabel ? summaryText : "Choose level first"}
        </span>

        <span
          style={{
            color: "rgba(214,227,243,0.72)",
            fontSize: 14,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 140ms ease",
            flexShrink: 0,
          }}
        >
          ▾
        </span>
      </button>

      <div
        style={{
          fontSize: 12,
          lineHeight: 1.4,
          color: "rgba(214,227,243,0.58)",
        }}
      >
        {helperText}
      </div>

      {open && levelLabel ? (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 16,
            background: "#121a24",
            boxShadow: "0 18px 36px rgba(0,0,0,0.28)",
            padding: 10,
            zIndex: 20,
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
                          ? "rgba(96,165,250,0.95)"
                          : "rgba(255,255,255,0.08)"
                      }`,
                      borderRadius: 12,
                      background: checked
                        ? "rgba(37,99,235,0.16)"
                        : "rgba(255,255,255,0.03)",
                      padding: "10px 12px",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${
                          checked ? "#93c5fd" : "rgba(214,227,243,0.50)"
                        }`,
                        background: checked ? "#60a5fa" : "transparent",
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
                          color: checked ? "#eaf3ff" : "#d6e3f3",
                        }}
                      >
                        {schoolClass.name}
                      </span>

                      <span
                        style={{
                          fontSize: 12,
                          lineHeight: 1.35,
                          color: "rgba(214,227,243,0.60)",
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
                  border: "1px dashed rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  lineHeight: 1.45,
                  color: "rgba(214,227,243,0.58)",
                }}
              >
                No classes found for this level yet.
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
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
                    ? "rgba(96,165,250,0.95)"
                    : "rgba(255,255,255,0.08)"
                }`,
                borderRadius: 12,
                background: useCompleteCourseCoverage
                  ? "rgba(37,99,235,0.16)"
                  : "rgba(255,255,255,0.03)",
                padding: "10px 12px",
                cursor: "pointer",
                textAlign: "left",
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
                      ? "#93c5fd"
                      : "rgba(214,227,243,0.50)"
                  }`,
                  background: useCompleteCourseCoverage ? "#60a5fa" : "transparent",
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
                    color: useCompleteCourseCoverage ? "#eaf3ff" : "#d6e3f3",
                  }}
                >
                  Show complete course coverage
                </span>

                <span
                  style={{
                    fontSize: 12,
                    lineHeight: 1.35,
                    color: "rgba(214,227,243,0.60)",
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