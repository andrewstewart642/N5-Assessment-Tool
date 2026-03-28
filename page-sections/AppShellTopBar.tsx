"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UI_TYPO } from "@/app/ui/UiTypography";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

type NavItem = {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "Create Assessment",
    href: "/create-assessment",
    isActive: (pathname) =>
      pathname === "/create-assessment" ||
      pathname.startsWith("/create-assessment/"),
  },
  {
    label: "My Assessments",
    href: "/my-assessments",
    isActive: (pathname) =>
      pathname === "/my-assessments" ||
      pathname.startsWith("/my-assessments/"),
  },
  {
    label: "My Classes",
    href: "/my-classes",
    isActive: (pathname) =>
      pathname === "/my-classes" || pathname.startsWith("/my-classes/"),
  },
];

export default function AppShellTopBar() {
  const pathname = usePathname();
  const { theme, openSettings } = useSettings();

  const isLight = theme.inverseText === "#ffffff";
  const lightSurface = "#eceff1";

  function handleOpenSettings() {
    if (pathname.startsWith("/create-assessment/builder")) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("open-builder-settings"));
      }
      return;
    }

    openSettings();
  }

  return (
    <header
      style={{
        height: 56,
        borderBottom: `1px solid ${theme.border}`,
        background: isLight ? lightSurface : theme.headerBg,
        display: "grid",
        gridTemplateColumns: "220px 1fr auto",
        alignItems: "center",
        gap: 16,
        padding: "0 16px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <div
          title="Reserved for future name/logo"
          style={{
            width: 150,
            height: 30,
            borderRadius: 10,
            border: `1px dashed ${theme.border}`,
            background: isLight ? lightSurface : "rgba(255,255,255,0.03)",
            color: theme.textMuted,
            display: "grid",
            placeItems: "center",
            fontFamily: UI_TYPO.family,
            fontSize: 12,
            fontWeight: UI_TYPO.weightMedium,
            letterSpacing: 0.2,
          }}
        >
          Reserved for logo
        </div>
      </div>

      <nav
        aria-label="Primary"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: active ? theme.text : theme.textMuted,
                background: active
                  ? isLight
                    ? "#e7eaed"
                    : "rgba(255,255,255,0.06)"
                  : "transparent",
                border: active
                  ? `1px solid ${theme.border}`
                  : "1px solid transparent",
                borderRadius: 12,
                padding: "8px 12px",
                fontFamily: UI_TYPO.family,
                fontWeight: active
                  ? UI_TYPO.weightSemibold
                  : UI_TYPO.weightMedium,
                fontSize: 14,
                lineHeight: 1,
                whiteSpace: "nowrap",
                boxShadow: "none",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={handleOpenSettings}
          title="Settings"
          style={{
            border: `1px solid ${theme.border}`,
            background: isLight ? "#e7eaed" : "rgba(11,17,24,0.92)",
            color: theme.textMuted,
            borderRadius: 16,
            padding: "10px 14px",
            cursor: "pointer",
            boxShadow: "none",
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            lineHeight: 1,
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 14 }}>
            ⚙
          </span>
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
}