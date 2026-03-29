"use client";

import Link from "next/link";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

type HomeCard = {
  title: string;
  subtitle: string;
  href: string;
};

const CARDS: HomeCard[] = [
  {
    title: "Create Assessment",
    subtitle: "Open the assessment workspace and begin building papers.",
    href: "/create-assessment",
  },
  {
    title: "My Assessments",
    subtitle: "Review saved assessments, drafts and compiled papers.",
    href: "/my-assessments",
  },
  {
    title: "My Classes",
    subtitle: "Organise classes and prepare future links to assessments.",
    href: "/my-classes",
  },
  {
    title: "Question Bank",
    subtitle: "Placeholder for future question-bank tools and browsing.",
    href: "/create-assessment",
  },
];

export default function HomePage() {
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
          maxWidth: 1440,
          margin: "0 auto",
          display: "grid",
          gap: 22,
        }}
      >
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
              fontSize: 28,
              color: theme.textPrimary,
              marginBottom: 8,
            }}
          >
            Home
          </div>

          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 15,
              color: theme.textMuted,
              lineHeight: 1.5,
              maxWidth: 820,
            }}
          >
            This is the new dashboard shell for the assessment platform. For now
            it gives you a proper landing page with working navigation and large
            action tiles instead of the previous lonely stack of buttons.
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 18,
          }}
        >
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              style={{
                textDecoration: "none",
                color: "inherit",
                minHeight: 220,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.bgSurface,
                borderRadius: 24,
                padding: 22,
                display: "grid",
                alignContent: "space-between",
                boxSizing: "border-box",
                transition:
                  "background 140ms ease, border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = theme.bgElevated;
                event.currentTarget.style.borderColor =
                  theme.controlSelectedBorder;
                event.currentTarget.style.transform = "translateY(-1px)";
                event.currentTarget.style.boxShadow = `inset 0 0 0 1px ${theme.accentSoft}`;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = theme.bgSurface;
                event.currentTarget.style.borderColor = theme.borderStandard;
                event.currentTarget.style.transform = "translateY(0)";
                event.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  border: `1px solid ${theme.controlSelectedBorder}`,
                  background: theme.controlSelectedBg,
                  boxShadow: `inset 0 0 0 1px ${theme.accentSoft}`,
                }}
              />

              <div>
                <div
                  style={{
                    fontFamily: UI_TYPO.family,
                    fontWeight: UI_TYPO.weightBold,
                    fontSize: 20,
                    color: theme.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  {card.title}
                </div>

                <div
                  style={{
                    fontFamily: UI_TYPO.family,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: theme.textMuted,
                  }}
                >
                  {card.subtitle}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}