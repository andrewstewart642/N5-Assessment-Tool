import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";

type CheckRowProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  theme: AppTheme;
};

export default function CheckRow({
  label,
  checked,
  onToggle,
  theme,
}: CheckRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",
        border: `1px solid ${
          checked ? theme.controlSelectedBorder : theme.borderStandard
        }`,
        background: checked ? theme.controlSelectedBg : theme.controlBg,
        color: checked ? theme.textPrimary : theme.textSecondary,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
        textAlign: "left",
        fontSize: 15,
        lineHeight: 1.3,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${
            checked ? theme.accentPrimary : theme.textMuted
          }`,
          background: checked ? theme.accentPrimary : "transparent",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      />

      <span>{label}</span>
    </button>
  );
}