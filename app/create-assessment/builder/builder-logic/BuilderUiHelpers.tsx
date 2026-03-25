import type { Paper } from "@/shared-types/AssessmentTypes";
import { UI_TYPO } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";

type BuilderMetaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  width?: number;
  theme?: AppTheme;
};

function getLabelStyle(theme?: AppTheme): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: UI_TYPO.weightMedium,
    letterSpacing: 0,
    color: theme ? theme.subtleText : "rgba(214,227,243,0.74)",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

function getInputStyle(theme?: AppTheme): React.CSSProperties {
  return {
    height: 30,
    borderRadius: 10,
    border: theme
      ? `1px solid ${theme.inputBorder}`
      : "1px solid rgba(255,255,255,0.08)",
    background: theme ? theme.inputBg : "rgba(255,255,255,0.02)",
    color: theme ? theme.inputText : "#f7fbff",
    padding: "0 9px",
    fontSize: 13,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };
}

export function BuilderMetaField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
  theme,
}: BuilderMetaFieldProps) {
  return (
    <label
      style={{
        display: "grid",
        gap: 3,
        minWidth: 0,
        width: width ?? "auto",
        fontFamily: UI_TYPO.family,
      }}
    >
      <span style={getLabelStyle(theme)}>{label}</span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={getInputStyle(theme)}
      />
    </label>
  );
}

type ViewingToggleProps = {
  value: Paper;
  onChange: (paper: Paper) => void;
  theme?: AppTheme;
};

export function ViewingToggle({
  value,
  onChange,
  theme,
}: ViewingToggleProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        height: 30,
        borderRadius: 10,
        background: theme ? theme.controlBg : "rgba(255,255,255,0.04)",
        border: theme
          ? `1px solid ${theme.borderSoft}`
          : "1px solid rgba(255,255,255,0.08)",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {(["P1", "P2"] as const).map((paper) => {
        const active = value === paper;

        return (
          <button
            key={paper}
            onClick={() => onChange(paper)}
            style={{
              height: "100%",
              padding: "0 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              color: active
                ? theme?.textPrimary ?? "#ffffff"
                : theme?.textMuted ?? "rgba(214,227,243,0.72)",
              background: active
                ? theme?.controlSelectedBg ?? "rgba(96,165,250,0.18)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              whiteSpace: "nowrap",
              transition:
                "background 0.15s ease, color 0.15s ease",
            }}
          >
            {paper === "P1" ? "Paper 1" : "Paper 2"}
          </button>
        );
      })}
    </div>
  );
}