"use client";

import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  onAddClass: () => void;
  theme: AppTheme;
};

export default function Header({ onAddClass, theme }: Props) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        border: `1px solid ${theme.borderSubtle}`,
        borderRadius: 22,
        padding: 24,
        background: theme.cardBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
            color: theme.textPrimary,
          }}
        >
          My Classes
        </h1>

        <p
          style={{
            margin: "8px 0 0 0",
            color: theme.textSecondary,
            fontSize: 15,
            lineHeight: 1.45,
          }}
        >
          Organise classes by course and build assessments more quickly.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClass}
        style={{
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textPrimary,
          borderRadius: 14,
          padding: "11px 16px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1,
          boxShadow: theme.shadow,
        }}
      >
        + Add Class
      </button>
    </div>
  );
}