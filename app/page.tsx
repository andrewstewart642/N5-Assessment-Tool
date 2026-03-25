"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { getTheme } from "@/ui/AppTheme";

const APPEARANCE_STORAGE_KEY = "n5-assessment-tool-appearance";
type AppearancePreference = "light" | "dark" | "system";

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
  const [appearance, setAppearance] = useState<AppearancePreference>("dark");
  const [systemPrefersDark, setSystemPrefersDark] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setSystemPrefersDark(media.matches);

    apply();

    const raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (raw === "dark" || raw === "light" || raw === "system") {
      setAppearance(raw);
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }

    media.addListener(apply);
    return () => media.removeListener(apply);
  }, []);

  const resolvedAppearance =
  appearance === "system"
    ? systemPrefersDark
      ? "dark"
      : "light"
    : appearance;

const theme = getTheme(resolvedAppearance);

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.pageBg,
        color: theme.text,
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
            border: `1px solid ${theme.border}`,
            background: theme.panelBg,
            borderRadius: 22,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontWeight: UI_TYPO.weightBold,
              fontSize: 28,
              color: theme.text,
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
                border: `1px solid ${theme.border}`,
                background: theme.panelBg,
                borderRadius: 24,
                padding: 22,
                display: "grid",
                alignContent: "space-between",
                boxSizing: "border-box",
                boxShadow:
                  theme.pageBg === "#eef3f8"
                    ? "0 12px 24px rgba(15,23,42,0.06)"
                    : "0 12px 24px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 16,
                  border: `1px solid ${theme.border}`,
                  background:
                    theme.pageBg === "#eef3f8"
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.04)",
                }}
              />

              <div>
                <div
                  style={{
                    fontFamily: UI_TYPO.family,
                    fontWeight: UI_TYPO.weightBold,
                    fontSize: 20,
                    color: theme.text,
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