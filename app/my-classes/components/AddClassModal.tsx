"use client";

import { useEffect } from "react";
import {
  COURSE_OPTIONS,
  LEVEL_OPTIONS,
  type CourseOption,
  type LevelOption,
} from "../types/Classes";

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
    color: "#e5eef8",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5eef8",
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
        background: "rgba(5,8,12,0.62)",
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
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          background: "#111821",
          boxShadow: "0 28px 60px rgba(0,0,0,0.34)",
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
              color: "#e5eef8",
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
                  style={{ background: "#111821", color: "#e5eef8" }}
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
                  style={{ background: "#111821", color: "#e5eef8" }}
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
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(229,238,248,0.86)",
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
              border: "1px solid rgba(255,255,255,0.10)",
              background: canCreate
                ? "rgba(96,165,250,0.22)"
                : "rgba(255,255,255,0.05)",
              color: canCreate ? "#e5eef8" : "rgba(229,238,248,0.42)",
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