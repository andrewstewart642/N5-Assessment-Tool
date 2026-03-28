import type { ResolvedThemeMode } from "./ThemeMode";

export type AppTheme = {
  [key: string]: string;

  // New semantic tokens
  bgPrimary: string;
  bgSurface: string;
  bgSurfaceAlt: string;
  bgElevated: string;
  bgOverlay: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  borderSubtle: string;
  borderStandard: string;
  borderStrong: string;
  divider: string;

  accentPrimary: string;
  accentPrimaryHover: string;
  accentSoft: string;
  accentSoftText: string;

  success: string;
  warning: string;
  danger: string;
  info: string;

  controlBg: string;
  controlBgHover: string;
  controlSelectedBg: string;
  controlSelectedBorder: string;

  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;

  panelBg: string;
  sidebarBg: string;
  toolbarBg: string;
  cardBg: string;
  cardBgHover: string;
  previewChromeBg: string;

  focusRing: string;
  shadowColor: string;
  scrollbarThumb: string;

  skillNumerical: string;
  skillAlgebraic: string;
  skillGeometric: string;
  skillTrigonometric: string;
  skillStatistical: string;

  // Legacy builder tokens kept for compatibility
  pageBg: string;
  panelBg2: string;
  panelBg3: string;
  headerBg: string;

  text: string;
  textSoft: string;
  textMutedLegacy: string;

  border: string;
  borderSoft: string;

  buttonBg: string;
  buttonBgHover: string;
  buttonText: string;

  pillBg: string;
  pillBorder: string;
  pillActiveBg: string;
  pillActiveBorder: string;
  pillText: string;
  pillActiveText: string;

  inputText: string;
  inputPlaceholder: string;

  dividerStrong: string;

  subtleText: string;
  mutedText: string;
  textDim: string;
  inverseText: string;

  rowHover: string;

  accent: string;
  accentStrong: string;
  ctaBlueText: string;

  // Final legacy keys still referenced
  inputBgSoft: string;
  buttonGhostBg: string;
  overlay: string;
  shadow: string;
  shadowStrong: string;
  modalOverlay: string;
  cardShadow: string;

  paper: string;
  paperBorder: string;
  paperText: string;
};

const darkTheme: AppTheme = {
  // New semantic tokens
  bgPrimary: "#212121",
  bgSurface: "#262626",
  bgSurfaceAlt: "#2b2b2b",
  bgElevated: "#303030",
  bgOverlay: "rgba(0,0,0,0.58)",

  textPrimary: "#f5f5f5",
  textSecondary: "#d4d4d4",
  textMuted: "#a3a3a3",
  textInverse: "#171717",

  borderSubtle: "#333333",
  borderStandard: "#404040",
  borderStrong: "#525252",
  divider: "#333333",

  accentPrimary: "#4a90e2",
  accentPrimaryHover: "#3f7fca",
  accentSoft: "rgba(74,144,226,0.14)",
  accentSoftText: "#a9cbf5",

  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#38bdf8",

  controlBg: "#2b2b2b",
  controlBgHover: "#323232",
  controlSelectedBg: "rgba(74,144,226,0.18)",
  controlSelectedBorder: "#4a90e2",

  inputBg: "#262626",
  inputBorder: "#454545",
  inputBorderFocus: "#4a90e2",

  panelBg: "#262626",
  sidebarBg: "#1f1f1f",
  toolbarBg: "#1f1f1f",
  cardBg: "#2b2b2b",
  cardBgHover: "#323232",
  previewChromeBg: "#212121",

  focusRing: "rgba(74,144,226,0.42)",
  shadowColor: "rgba(0,0,0,0.45)",
  scrollbarThumb: "#4a4a4a",

  skillNumerical: "#60a5fa",
  skillAlgebraic: "#a78bfa",
  skillGeometric: "#34d399",
  skillTrigonometric: "#facc15",
  skillStatistical: "#f472b6",

  // Legacy builder tokens
  pageBg: "#212121",
  panelBg2: "#262626",
  panelBg3: "#2b2b2b",
  headerBg: "#1f1f1f",

  text: "#f5f5f5",
  textSoft: "#d4d4d4",
  textMutedLegacy: "#a3a3a3",

  border: "#404040",
  borderSoft: "#333333",

  buttonBg: "#2b2b2b",
  buttonBgHover: "#323232",
  buttonText: "#f5f5f5",

  pillBg: "#2b2b2b",
  pillBorder: "#454545",
  pillActiveBg: "rgba(74,144,226,0.18)",
  pillActiveBorder: "#4a90e2",
  pillText: "#d4d4d4",
  pillActiveText: "#f5f5f5",

  inputText: "#f5f5f5",
  inputPlaceholder: "#8f8f8f",

  dividerStrong: "#525252",

  subtleText: "#d4d4d4",
  mutedText: "#a3a3a3",
  textDim: "#8f8f8f",
  inverseText: "#171717",

  rowHover: "rgba(255,255,255,0.035)",

  accent: "#4a90e2",
  accentStrong: "#3f7fca",
  ctaBlueText: "#a9cbf5",

  inputBgSoft: "#2b2b2b",
  buttonGhostBg: "rgba(255,255,255,0.025)",
  overlay: "rgba(0,0,0,0.52)",
  shadow: "0 8px 24px rgba(0,0,0,0.28)",
  shadowStrong: "0 16px 40px rgba(0,0,0,0.36)",
  modalOverlay: "rgba(0,0,0,0.62)",
  cardShadow: "0 6px 18px rgba(0,0,0,0.22)",

  paper: "#ffffff",
  paperBorder: "#d1d5db",
  paperText: "#111827",
};

const lightTheme: AppTheme = {
  // New semantic tokens
  bgPrimary: "#E6E8EB",
  bgSurface: "#ECEFF1",
  bgSurfaceAlt: "#E9ECEF",
  bgElevated: "#E4E7EB",
  bgOverlay: "rgba(15,23,42,0.18)",

  textPrimary: "#1F2937",
  textSecondary: "rgba(31,41,55,0.78)",
  textMuted: "rgba(31,41,55,0.58)",
  textInverse: "#ffffff",

  borderSubtle: "rgba(31,41,55,0.08)",
  borderStandard: "rgba(31,41,55,0.12)",
  borderStrong: "rgba(31,41,55,0.18)",
  divider: "rgba(31,41,55,0.10)",

  accentPrimary: "#2563eb",
  accentPrimaryHover: "#1d4ed8",
  accentSoft: "rgba(37,99,235,0.10)",
  accentSoftText: "#2563eb",

  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0284c7",

  controlBg: "rgba(31,41,55,0.035)",
  controlBgHover: "rgba(31,41,55,0.055)",
  controlSelectedBg: "rgba(37,99,235,0.10)",
  controlSelectedBorder: "#2563eb",

  inputBg: "rgba(31,41,55,0.05)",
  inputBorder: "rgba(31,41,55,0.12)",
  inputBorderFocus: "#2563eb",

  panelBg: "#ECEFF1",
  sidebarBg: "#E4E7EB",
  toolbarBg: "#ECEFF1",
  cardBg: "#ECEFF1",
  cardBgHover: "#E9ECEF",
  previewChromeBg: "#E4E7EB",

  focusRing: "rgba(37,99,235,0.16)",
  shadowColor: "rgba(15,23,42,0.06)",
  scrollbarThumb: "#C8CDD3",

  skillNumerical: "#3b82f6",
  skillAlgebraic: "#8b5cf6",
  skillGeometric: "#10b981",
  skillTrigonometric: "#eab308",
  skillStatistical: "#ec4899",

  // Legacy builder tokens
  pageBg: "#E6E8EB",
  panelBg2: "#E9ECEF",
  panelBg3: "#E4E7EB",
  headerBg: "#ECEFF1",

  text: "#1F2937",
  textSoft: "rgba(31,41,55,0.78)",
  textMutedLegacy: "rgba(31,41,55,0.58)",

  border: "rgba(31,41,55,0.12)",
  borderSoft: "rgba(31,41,55,0.08)",

  buttonBg: "rgba(31,41,55,0.05)",
  buttonBgHover: "rgba(31,41,55,0.08)",
  buttonText: "#1F2937",

  pillBg: "#ECEFF1",
  pillBorder: "rgba(31,41,55,0.12)",
  pillActiveBg: "#E4E7EB",
  pillActiveBorder: "rgba(31,41,55,0.14)",
  pillText: "rgba(31,41,55,0.68)",
  pillActiveText: "#1F2937",

  inputText: "#1F2937",
  inputPlaceholder: "rgba(31,41,55,0.42)",

  dividerStrong: "rgba(31,41,55,0.18)",

  subtleText: "rgba(31,41,55,0.78)",
  mutedText: "rgba(31,41,55,0.58)",
  textDim: "rgba(31,41,55,0.42)",
  inverseText: "#ffffff",

  rowHover: "rgba(31,41,55,0.035)",

  accent: "#2563eb",
  accentStrong: "#1d4ed8",
  ctaBlueText: "#2563eb",

  inputBgSoft: "rgba(31,41,55,0.035)",
  buttonGhostBg: "rgba(31,41,55,0.035)",
  overlay: "rgba(15,23,42,0.18)",
  shadow: "0 1px 2px rgba(15,23,42,0.04)",
  shadowStrong: "0 4px 12px rgba(15,23,42,0.06)",
  modalOverlay: "rgba(15,23,42,0.18)",
  cardShadow: "0 1px 2px rgba(15,23,42,0.04)",

  paper: "#ffffff",
  paperBorder: "#d9dde4",
  paperText: "#111111",
};

export function getTheme(mode: ResolvedThemeMode): AppTheme {
  return mode === "dark" ? darkTheme : lightTheme;
}