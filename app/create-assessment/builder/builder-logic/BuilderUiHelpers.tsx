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

export function ViewingToggle({ value, onChange }: ViewingToggleProps) {
  return (
    <div
      style={{
        position: "relative",
        width: 176,
        height: 34,
        borderRadius: 999,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 2,
          bottom: 2,
          left: 2,
          width: "calc(50% - 2px)",
          borderRadius: 999,
          background: "rgba(37,99,235,0.20)",
          border: "1px solid rgba(96,165,250,0.95)",
          transform: value === "P1" ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 180ms ease",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => onChange("P1")}
          style={{
            border: "none",
            background: "transparent",
            color: value === "P1" ? "#f7fbff" : "rgba(214,227,243,0.76)",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightBold,
            lineHeight: 1,
          }}
        >
          Paper 1
        </button>

        <button
          type="button"
          onClick={() => onChange("P2")}
          style={{
            border: "none",
            background: "transparent",
            color: value === "P2" ? "#f7fbff" : "rgba(214,227,243,0.76)",
            cursor: "pointer",
            fontSize: 14,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightBold,
            lineHeight: 1,
          }}
        >
          Paper 2
        </button>
      </div>
    </div>
  );
}