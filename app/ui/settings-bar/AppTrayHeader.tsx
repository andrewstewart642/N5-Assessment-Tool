"use client";

import type { Theme } from "@/ui/AppTheme";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";

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
        padding: "12px 16px",
        borderBottom: `1px solid ${theme.borderStandard}`,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 12,
        alignItems: "center",
        background: theme.bgSurface,
        minHeight: 58,
        boxSizing: "border-box",
        fontFamily: UI_TYPO.family,
      }}
    >
      <div
        style={{
          minWidth: 0,
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            ...UI_TEXT.sectionTitle,
            color: theme.textPrimary,
            fontSize: 17,
            fontWeight: UI_TYPO.weightBold,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div
            style={{
              ...UI_TEXT.controlText,
              color: theme.textMuted,
              fontSize: 13,
              fontWeight: UI_TYPO.weightMedium,
              lineHeight: 1.3,
              minWidth: 0,
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
          width: 32,
          height: 32,
          borderRadius: 10,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textMuted,
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          padding: 0,
          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.bgElevated;
          e.currentTarget.style.color = theme.textPrimary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = theme.controlBg;
          e.currentTarget.style.color = theme.textMuted;
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
            transform: "translateY(-0.5px)",
          }}
        >
          ×
        </span>
      </button>
    </div>
  );
}