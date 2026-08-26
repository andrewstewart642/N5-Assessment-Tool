import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  theme: AppTheme;
};

export default function NumberField({
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
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 14,
          background: theme.controlBg,
          padding: "10px 12px",
        }}
      >
        <input
          type="number"
          min={1}
          step={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            color: theme.textPrimary,
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