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
  bgPrimary: "#f5f5f5",
  bgSurface: "#ffffff",
  bgSurfaceAlt: "#fafafa",
  bgElevated: "#ffffff",
  bgOverlay: "rgba(0,0,0,0.08)",

  textPrimary: "#171717",
  textSecondary: "#404040",
  textMuted: "#737373",
  textInverse: "#ffffff",

  borderSubtle: "#e5e5e5",
  borderStandard: "#d4d4d4",
  borderStrong: "#a3a3a3",
  divider: "#e5e5e5",

  accentPrimary: "#2563eb",
  accentPrimaryHover: "#1d4ed8",
  accentSoft: "rgba(37,99,235,0.10)",
  accentSoftText: "#1d4ed8",

  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0284c7",

  controlBg: "#f5f5f5",
  controlBgHover: "#eeeeee",
  controlSelectedBg: "rgba(37,99,235,0.14)",
  controlSelectedBorder: "#2563eb",

  inputBg: "#ffffff",
  inputBorder: "#d4d4d4",
  inputBorderFocus: "#2563eb",

  panelBg: "#ffffff",
  sidebarBg: "#fafafa",
  toolbarBg: "#ffffff",
  cardBg: "#ffffff",
  cardBgHover: "#fafafa",
  previewChromeBg: "#f5f5f5",

  focusRing: "rgba(37,99,235,0.28)",
  shadowColor: "rgba(0,0,0,0.10)",
  scrollbarThumb: "#d4d4d4",

  skillNumerical: "#3b82f6",
  skillAlgebraic: "#8b5cf6",
  skillGeometric: "#10b981",
  skillTrigonometric: "#eab308",
  skillStatistical: "#ec4899",

  // Legacy builder tokens
  pageBg: "#f5f5f5",
  panelBg2: "#ffffff",
  panelBg3: "#fafafa",
  headerBg: "#ffffff",

  text: "#171717",
  textSoft: "#404040",
  textMutedLegacy: "#737373",

  border: "#d4d4d4",
  borderSoft: "#e5e5e5",

  buttonBg: "#f5f5f5",
  buttonBgHover: "#eeeeee",
  buttonText: "#171717",

  pillBg: "#f5f5f5",
  pillBorder: "#d4d4d4",
  pillActiveBg: "rgba(37,99,235,0.14)",
  pillActiveBorder: "#2563eb",
  pillText: "#404040",
  pillActiveText: "#171717",

  inputText: "#171717",
  inputPlaceholder: "#8f8f8f",

  dividerStrong: "#a3a3a3",

  subtleText: "#404040",
  mutedText: "#737373",
  textDim: "#8f8f8f",
  inverseText: "#ffffff",

  rowHover: "rgba(23,23,23,0.035)",

  accent: "#2563eb",
  accentStrong: "#1d4ed8",
  ctaBlueText: "#1d4ed8",

  inputBgSoft: "#f5f5f5",
  buttonGhostBg: "rgba(23,23,23,0.025)",
  overlay: "rgba(0,0,0,0.08)",
  shadow: "0 8px 24px rgba(0,0,0,0.06)",
  shadowStrong: "0 16px 40px rgba(0,0,0,0.10)",
  modalOverlay: "rgba(0,0,0,0.14)",
  cardShadow: "0 6px 18px rgba(0,0,0,0.05)",

  paper: "#ffffff",
  paperBorder: "#d1d5db",
  paperText: "#111827",
};

export function getTheme(mode: ResolvedThemeMode): AppTheme {
  return mode === "dark" ? darkTheme : lightTheme;
}