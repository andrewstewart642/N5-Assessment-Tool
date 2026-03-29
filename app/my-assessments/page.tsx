"use client";

import Link from "next/link";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

export default function MyAssessmentsPage() {
  const { theme } = useSettings();

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.bgPage,
        color: theme.textPrimary,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gap: 22,
        }}
      >
        {/* Header */}
        <section
          style={{
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgSurface,
            borderRadius: 22,
            padding: "22px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: 4,
              background: theme.accentPrimary,
              opacity: 0.9,
            }}
          />

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 26,
              marginBottom: 6,
            }}
          >
            My Assessments
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 14,
              color: theme.textMuted,
              maxWidth: 700,
              lineHeight: 1.5,
            }}
          >
            This will contain saved assessments, drafts, and previously exported
            papers. For now, this is a placeholder page while the builder system
            continues to develop.
          </div>
        </section>

        {/* Placeholder Content */}
        <section
          style={{
            border: `1px solid ${theme.borderStandard}`,
            background: theme.bgSurface,
            borderRadius: 22,
            padding: 28,
            display: "grid",
            gap: 16,
            justifyItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              background: theme.controlSelectedBg,
              border: `1px solid ${theme.controlSelectedBorder}`,
              boxShadow: `inset 0 0 0 1px ${theme.accentSoft}`,
            }}
          />

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 16,
              fontWeight: UI_TYPO.weightSemibold,
            }}
          >
            No assessments yet
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 14,
              color: theme.textMuted,
              maxWidth: 420,
              lineHeight: 1.5,
            }}
          >
            Once you start creating assessments, they’ll appear here for quick
            access and editing.
          </div>

          <Link
            href="/create-assessment"
            style={{
              marginTop: 6,
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 14,
              background: theme.controlSelectedBg,
              border: `1px solid ${theme.controlSelectedBorder}`,
              color: theme.textPrimary,
              fontSize: 13,
              fontWeight: UI_TYPO.weightSemibold,
              boxShadow: `inset 0 0 0 1px ${theme.accentSoft}`,
              transition:
                "background 120ms ease, border-color 120ms ease, transform 80ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.controlBgHover;
              e.currentTarget.style.borderColor = theme.controlSelectedBorder;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = theme.controlSelectedBg;
              e.currentTarget.style.borderColor =
                theme.controlSelectedBorder;
              e.currentTarget.style.transform = "scale(1)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Create your first assessment
          </Link>
        </section>
      </div>
    </main>
  );
}