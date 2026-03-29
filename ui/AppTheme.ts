import { ACCENT_MAP, type AccentOption } from "./AccentPalette";

/**
 * Theme structure used across the app
 */
export type Theme = {
  bgPage: string;
  bgSurface: string;
  bgElevated: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  borderStandard: string;

  controlBg: string;
  controlBgHover: string;
  controlSelectedBg: string;
  controlSelectedBorder: string;

  accentPrimary: string;
  accentSoft: string;

  shadow: string;
  shadowStrong: string;

  modalOverlay: string;

  paper: string;
};

/**
 * ---------- UTILITIES ----------
 */

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function mix(hex1: string, hex2: string, ratio: number) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);

  return rgbToHex(
    Math.round(c1.r * (1 - ratio) + c2.r * ratio),
    Math.round(c1.g * (1 - ratio) + c2.g * ratio),
    Math.round(c1.b * (1 - ratio) + c2.b * ratio)
  );
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 160;
}

/**
 * ---------- CORE GENERATOR ----------
 */

function generateThemeFromBase(base: string): Theme {
  const light = isLight(base);

  const bgPage = light ? mix(base, "#ffffff", 0.92) : mix(base, "#000000", 0.88);
  const bgSurface = light
    ? mix(base, "#ffffff", 0.96)
    : mix(base, "#000000", 0.82);
  const bgElevated = light
    ? mix(base, "#ffffff", 0.98)
    : mix(base, "#000000", 0.75);

  const textPrimary = light ? "#0f172a" : "#f8fafc";
  const textSecondary = light ? "#334155" : "#cbd5f5";
  const textMuted = light ? "#64748b" : "#94a3b8";

  const borderStandard = light
    ? mix(base, "#000000", 0.08)
    : mix(base, "#ffffff", 0.12);

  const controlBg = light
    ? mix(base, "#ffffff", 0.90)
    : mix(base, "#000000", 0.75);

  const controlBgHover = light
    ? mix(base, "#ffffff", 0.82)
    : mix(base, "#000000", 0.65);

  const controlSelectedBg = light
    ? mix(base, "#ffffff", 0.70)
    : mix(base, "#000000", 0.55);

  const controlSelectedBorder = base;

  const accentPrimary = base;
  const accentSoft = light
    ? mix(base, "#ffffff", 0.7)
    : mix(base, "#000000", 0.4);

  return {
    bgPage,
    bgSurface,
    bgElevated,

    textPrimary,
    textSecondary,
    textMuted,

    borderStandard,

    controlBg,
    controlBgHover,
    controlSelectedBg,
    controlSelectedBorder,

    accentPrimary,
    accentSoft,

    shadow: "0 6px 18px rgba(0,0,0,0.08)",
    shadowStrong: "0 18px 40px rgba(0,0,0,0.18)",

    modalOverlay: "rgba(0,0,0,0.35)",

    paper: light ? "#ffffff" : "#0b1220",
  };
}

/**
 * ---------- PRESETS ----------
 */

const LIGHT_THEME = generateThemeFromBase("#3b82f6"); // blue baseline
const DARK_THEME = generateThemeFromBase("#0f172a");
const SOFT_GREY_THEME = generateThemeFromBase("#6b7280");

/**
 * ---------- PUBLIC API ----------
 */

export function getTheme(options: {
  mode: "light" | "dark" | "soft-grey" | "custom";
  customColour?: AccentOption;
}): Theme {
  const { mode, customColour } = options;

  if (mode === "custom" && customColour) {
    const base = ACCENT_MAP[customColour];
    return generateThemeFromBase(base);
  }

  if (mode === "dark") return DARK_THEME;
  if (mode === "soft-grey") return SOFT_GREY_THEME;

  return LIGHT_THEME;
}