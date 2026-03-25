"use client";

import { useEffect } from "react";
import {
  COURSE_OPTIONS,
  LEVEL_OPTIONS,
  type CourseOption,
  type LevelOption,
} from "../types/Classes";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  open: boolean;
  className: string;
  setClassName: (value: string) => void;
  course: CourseOption;
  setCourse: (value: CourseOption) => void;
  level: LevelOption;
  setLevel: (value: LevelOption) => void;
  teacher: string;
  setTeacher: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
  theme: AppTheme;
};

export default function AddClassModal({
  open,
  className,
  setClassName,
  course,
  setCourse,
  level,
  setLevel,
  teacher,
  setTeacher,
  onClose,
  onCreate,
  theme,
}: Props) {
  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const canCreate = className.trim().length > 0;

  const labelStyle: React.CSSProperties = {
    display: "grid",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
    color: theme.textPrimary,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.inputText,
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    lineHeight: 1.3,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        backdropFilter: "blur(6px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 24,
          background: theme.bgElevated,
          boxShadow: theme.shadowStrong,
          padding: 24,
          display: "grid",
          gap: 18,
        }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.1,
              color: theme.textPrimary,
            }}
          >
            Add Class
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <label style={labelStyle}>
            Class name
            <input
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              placeholder="e.g. 4A1"
              style={inputStyle}
              autoFocus
            />
          </label>

          <label style={labelStyle}>
            Course
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value as CourseOption)}
              style={inputStyle}
            >
              {COURSE_OPTIONS.map((option) => (
                <option
                  key={option}
                  value={option}
                  style={{ background: theme.bgElevated, color: theme.textPrimary }}
                >
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Level
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as LevelOption)}
              style={inputStyle}
            >
              {LEVEL_OPTIONS.map((option) => (
                <option
                  key={option || "blank"}
                  value={option}
                  style={{ background: theme.bgElevated, color: theme.textPrimary }}
                >
                  {option || "Select level"}
                </option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            Teacher
            <input
              value={teacher}
              onChange={(event) => setTeacher(event.target.value)}
              placeholder="Optional"
              style={inputStyle}
            />
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            paddingTop: 4,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              borderRadius: 14,
              padding: "11px 14px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCreate}
            disabled={!canCreate}
            style={{
              border: `1px solid ${canCreate ? theme.accentPrimary : theme.borderStandard}`,
              background: canCreate ? theme.accentSoft : theme.controlBg,
              color: canCreate ? theme.textPrimary : theme.textMuted,
              borderRadius: 14,
              padding: "11px 14px",
              cursor: canCreate ? "pointer" : "not-allowed",
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Create Class
          </button>
        </div>
      </div>
    </div>
  );
}