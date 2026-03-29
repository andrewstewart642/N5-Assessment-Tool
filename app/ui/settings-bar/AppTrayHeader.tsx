"use client";

import type { Theme } from "@/ui/AppTheme";

type Props = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  theme: Theme;
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
        borderBottom: `1px solid ${theme.borderStandard}`,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 14,
        alignItems: "start",
        background: theme.bgSurface,
      }}
    >
      <div>
        <div
          style={{
            color: theme.textPrimary,
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
              color: theme.textMuted,
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
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textMuted,
          fontSize: 18,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      >
        ×
      </button>
    </div>
  );
}