import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  type?: "text" | "date";
  theme: AppTheme;
};

export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  onFocus,
  type = "text",
  theme,
}: TextFieldProps) {
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
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 14,
          background: theme.controlBg,
          padding: "10px 12px",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            color: theme.textPrimary,
            fontSize: 16,
            fontFamily: "inherit",
          }}
        />
      </div>
    </label>
  );
}