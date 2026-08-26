import type { ReactNode } from "react";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

type ChoiceRowProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  children?: ReactNode;
  theme: AppTheme;
};

export default function ChoiceRow({
  label,
  selected,
  onClick,
  children,
  theme,
}: ChoiceRowProps) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          border: `1px solid ${
            selected ? theme.controlSelectedBorder : theme.borderStandard
          }`,
          background: selected ? theme.controlSelectedBg : theme.controlBg,
          color: selected ? theme.textPrimary : theme.textSecondary,
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
            borderRadius: 999,
            border: `2px solid ${
              selected ? theme.accentPrimary : theme.textMuted
            }`,
            background: selected ? theme.accentPrimary : "transparent",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        />

        <span>{label}</span>
      </button>

      {selected && children ? (
        <div
          style={{
            marginLeft: 14,
            padding: 12,
            borderRadius: 16,
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgElevated,
            display: "grid",
            gap: 10,
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}