"use client";

import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  theme: AppTheme;
};

export default function AppTrayHeader({
  title,
  subtitle,
  onClose,
  theme,
}: Props) {
  return (
    <div
      style={{
        padding: "18px 18px 14px 18px",
        borderBottom: `1px solid ${theme.border}`,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 14,
        alignItems: "start",
      }}
    >
      <div>
        <div
          style={{
            color: theme.text,
            fontSize: 18,
            fontWeight: 900,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              marginTop: 4,
              color: theme.subtleText,
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          background: theme.buttonGhostBg,
          color: theme.subtleText,
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}