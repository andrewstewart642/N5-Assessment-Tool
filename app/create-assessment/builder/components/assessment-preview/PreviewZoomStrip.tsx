"use client";

import { UI_TYPO } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  theme: AppTheme;
  zoomPct: number;
  zoomIn: () => void;
  zoomOut: () => void;
  currentPage: number;
  totalPages: number;
};

export default function PreviewZoomStrip({
  theme,
  zoomPct,
  zoomIn,
  zoomOut,
  currentPage,
  totalPages,
}: Props) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        width: "100%",
        height: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "rgba(7, 10, 16, 0.94)",
        borderBottom: `1px solid ${theme.borderSoft}`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: "translateY(-42%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          minHeight: 10,
          padding: "4px 12px",
          borderRadius: 4,
          background: "rgba(7, 10, 16, 0.94)",
          border: `1px solid ${theme.borderSoft}`,
          boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            minWidth: 34,
            textAlign: "center",
            color: theme.textMuted,
            fontSize: 12,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightMedium,
            lineHeight: 1,
          }}
          title={`Page ${currentPage} of ${totalPages}`}
        >
          {currentPage}/{totalPages}
        </div>

        <div
          style={{
            width: 1,
            height: 14,
            background: theme.borderSoft,
          }}
        />

        <button
          type="button"
          onClick={zoomOut}
          style={{
            width: 16,
            height: 16,
            border: "none",
            background: "transparent",
            color: theme.text,
            cursor: "pointer",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightMedium,
            fontSize: 16,
            lineHeight: "16px",
            display: "grid",
            placeItems: "center",
            padding: 0,
          }}
          title="Zoom out"
        >
          −
        </button>

        <div
          style={{
            minWidth: 42,
            textAlign: "center",
            color: theme.text,
            fontSize: 12,
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            lineHeight: 1,
          }}
          title="Current zoom"
        >
          {zoomPct}%
        </div>

        <button
          type="button"
          onClick={zoomIn}
          style={{
            width: 16,
            height: 16,
            border: "none",
            background: "transparent",
            color: theme.text,
            cursor: "pointer",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightMedium,
            fontSize: 16,
            lineHeight: "16px",
            display: "grid",
            placeItems: "center",
            padding: 0,
          }}
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}