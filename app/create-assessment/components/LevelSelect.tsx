"use client";

import {
  ASSESSMENT_LEVEL_OPTIONS,
  type AssessmentLevelId,
} from "../setup/AssessmentClassCoverageStorage";

type Props = {
  value: AssessmentLevelId | null;
  onChange: (value: AssessmentLevelId) => void;
};

export default function LevelSelect({ value, onChange }: Props) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 13,
          color: "rgba(214,227,243,0.72)",
          fontWeight: 600,
        }}
      >
        Level
      </span>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          padding: "10px 12px",
        }}
      >
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value as AssessmentLevelId)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "#f7fbff",
            fontSize: 16,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <option value="" disabled style={{ color: "#0b0f14" }}>
            Select level
          </option>

          {ASSESSMENT_LEVEL_OPTIONS.map((option) => (
            <option
              key={option.id}
              value={option.id}
              style={{ color: "#0b0f14" }}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}