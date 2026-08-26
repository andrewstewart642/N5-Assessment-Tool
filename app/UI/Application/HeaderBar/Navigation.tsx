
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTheme } from "../Theme/ThemeProvider";
import { UI_TYPO } from "../Typography/Typography";

type NavigationItem = {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
};

const NAVIGATION_ITEMS: NavigationItem[] = [
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

export default function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {NAVIGATION_ITEMS.map((item) => {
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
  );
}