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
        borderBottom: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        display: "grid",
        gridTemplateColumns: "220px 1fr auto",
        alignItems: "center",
        gap: 16,
        padding: "0 16px",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 150,
            height: 30,
            borderRadius: 10,
            border: `1px dashed ${theme.borderStandard}`,
            background: theme.bgElevated,
            color: theme.textMuted,
            display: "grid",
            placeItems: "center",
            fontSize: 12,
            fontWeight: UI_TYPO.weightMedium,
            lineHeight: 1,
          }}
        >
          Reserved for logo
        </div>
      </div>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
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
                color: active ? theme.textPrimary : theme.textMuted,
                background: active ? theme.controlSelectedBg : "transparent",
                border: `1px solid ${
                  active ? theme.controlSelectedBorder : "transparent"
                }`,
                borderRadius: 12,
                padding: "8px 12px",
                fontWeight: active
                  ? UI_TYPO.weightSemibold
                  : UI_TYPO.weightMedium,
                fontSize: 14,
                lineHeight: 1,
                boxShadow: active
                  ? `inset 0 0 0 1px ${theme.accentSoft}`
                  : "none",
                transition:
                  "background 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease",
              }}
              onMouseEnter={(event) => {
                if (!active) {
                  event.currentTarget.style.background = theme.controlBg;
                  event.currentTarget.style.color = theme.textPrimary;
                  event.currentTarget.style.borderColor = theme.borderStandard;
                }
              }}
              onMouseLeave={(event) => {
                if (!active) {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.color = theme.textMuted;
                  event.currentTarget.style.borderColor = "transparent";
                }
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 14,
            background: theme.bgElevated,
            border: `1px solid ${theme.borderStandard}`,
            color: theme.textPrimary,
            fontSize: 13,
            fontWeight: UI_TYPO.weightSemibold,
            cursor: "pointer",
            boxShadow: `inset 0 0 0 1px ${theme.accentSoft}`,
            transition:
              "background 120ms ease, border-color 120ms ease, transform 80ms ease, box-shadow 120ms ease",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = theme.controlSelectedBg;
            event.currentTarget.style.borderColor = theme.controlSelectedBorder;
            event.currentTarget.style.boxShadow = `inset 0 0 0 1px ${theme.accentSoft}`;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = theme.bgElevated;
            event.currentTarget.style.borderColor = theme.borderStandard;
            event.currentTarget.style.transform = "scale(1)";
            event.currentTarget.style.boxShadow = `inset 0 0 0 1px ${theme.accentSoft}`;
          }}
          onMouseDown={(event) => {
            event.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(event) => {
            event.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>⚙</span>
          <span style={{ lineHeight: 1 }}>Settings</span>
        </button>
      </div>
    </header>
  );
}