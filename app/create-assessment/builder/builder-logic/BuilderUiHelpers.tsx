import type { Paper } from "@/shared-types/AssessmentTypes";
import { UI_TYPO } from "@/app/ui/UiTypography";

type BuilderMetaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  width?: number;
};

export function BuilderMetaField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
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
      <span
        style={{
          fontSize: 12,
          fontWeight: UI_TYPO.weightMedium,
          letterSpacing: 0,
          color: "rgba(214,227,243,0.74)",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          height: 30,
          borderRadius: 9,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          color: "#f7fbff",
          padding: "0 9px",
          fontSize: 13,
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightSemibold,
          minWidth: 0,
          width: "100%",
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    </label>
  );
}

type ViewingToggleProps = {
  value: Paper;
  onChange: (paper: Paper) => void;
};

export function ViewingToggle({
  value,
  onChange,
}: {
  value: "P1" | "P2";
  onChange: (next: "P1" | "P2") => void;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        height: 30,
        borderRadius: 9,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
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
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              color: active ? "#ffffff" : "rgba(214,227,243,0.72)",
              background: active
                ? "rgba(96,165,250,0.18)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {paper === "P1" ? "Paper 1" : "Paper 2"}
          </button>
        );
      })}
    </div>
  );
}