"use client";

import type { Theme } from "@/ui/AppTheme";
import {
  ASSESSMENT_LEVEL_OPTIONS,
  type AssessmentLevelId,
} from "../setup/AssessmentClassCoverageStorage";

type Props = {
  value: AssessmentLevelId | null;
  onChange: (value: AssessmentLevelId) => void;
  theme: Theme;
};

export default function LevelSelect({ value, onChange, theme }: Props) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontSize: 13,
          color: theme.textMuted,
          fontWeight: 600,
        }}
      >
        Level
      </span>

      <div
        style={{
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 14,
          background: theme.controlBg,
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
            color: theme.textPrimary,
            fontSize: 16,
            fontFamily: "inherit",
            cursor: "pointer",
          }}
        >
          <option value="" disabled style={{ color: "#0f172a" }}>
            Select level
          </option>

          {ASSESSMENT_LEVEL_OPTIONS.map((option) => (
            <option key={option.id} value={option.id} style={{ color: "#0f172a" }}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}