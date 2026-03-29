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
 * Used for custom themes generated from a selected base colour.
 */

function generateThemeFromBase(base: string): Theme {
  const light = isLight(base);

  const bgPage = light ? mix(base, "#ffffff", 0.94) : mix(base, "#000000", 0.9);
  const bgSurface = light
    ? mix(base, "#ffffff", 0.975)
    : mix(base, "#000000", 0.84);
  const bgElevated = light
    ? mix(base, "#ffffff", 0.99)
    : mix(base, "#000000", 0.78);

  const textPrimary = light ? "#0f172a" : "#f5f5f5";
  const textSecondary = light ? "#334155" : "#c4c7cf";
  const textMuted = light ? "#64748b" : "#9aa0aa";

  const borderStandard = light
    ? mix(base, "#0f172a", 0.14)
    : mix(base, "#ffffff", 0.14);

  const controlBg = light
    ? mix(base, "#ffffff", 0.92)
    : mix(base, "#000000", 0.72);

  const controlBgHover = light
    ? mix(base, "#ffffff", 0.84)
    : mix(base, "#000000", 0.62);

  const controlSelectedBg = light
    ? mix(base, "#ffffff", 0.74)
    : mix(base, "#000000", 0.5);

  const controlSelectedBorder = base;

  const accentPrimary = base;
  const accentSoft = light
    ? mix(base, "#ffffff", 0.78)
    : mix(base, "#000000", 0.42);

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

    shadow: light
      ? "0 6px 18px rgba(15,23,42,0.06)"
      : "0 6px 18px rgba(0,0,0,0.24)",
    shadowStrong: light
      ? "0 18px 40px rgba(15,23,42,0.12)"
      : "0 18px 40px rgba(0,0,0,0.42)",

    modalOverlay: light ? "rgba(15,23,42,0.18)" : "rgba(0,0,0,0.48)",

    paper: "#ffffff",
  };
}

/**
 * ---------- PRESETS ----------
 * These are intentionally hand-tuned rather than derived,
 * so Light / Soft Grey / Dark land exactly where you want them.
 */

const LIGHT_THEME: Theme = {
  bgPage: "#f8fafc",
  bgSurface: "#fcfdff",
  bgElevated: "#ffffff",

  textPrimary: "#0f172a",
  textSecondary: "#334155",
  textMuted: "#64748b",

  borderStandard: "#d7e3f0",

  controlBg: "#f8fbff",
  controlBgHover: "#eef4fb",
  controlSelectedBg: "#dbeafe",
  controlSelectedBorder: "#60a5fa",

  accentPrimary: "#60a5fa",
  accentSoft: "#dbeafe",

  shadow: "0 6px 18px rgba(15,23,42,0.06)",
  shadowStrong: "0 18px 40px rgba(15,23,42,0.12)",

  modalOverlay: "rgba(15,23,42,0.16)",

  paper: "#ffffff",
};

const SOFT_GREY_THEME: Theme = {
  bgPage: "#eef1f4",
  bgSurface: "#f5f6f8",
  bgElevated: "#fbfcfd",

  textPrimary: "#1f2937",
  textSecondary: "#4b5563",
  textMuted: "#6b7280",

  borderStandard: "#c7d0db",

  controlBg: "#f2f4f7",
  controlBgHover: "#e7ebf0",
  controlSelectedBg: "#d9dee7",
  controlSelectedBorder: "#8b95a7",

  accentPrimary: "#8b95a7",
  accentSoft: "#d9dee7",

  shadow: "0 6px 18px rgba(15,23,42,0.05)",
  shadowStrong: "0 18px 40px rgba(15,23,42,0.1)",

  modalOverlay: "rgba(15,23,42,0.18)",

  paper: "#ffffff",
};

const DARK_THEME: Theme = {
  bgPage: "#0d0d0d",
  bgSurface: "#171717",
  bgElevated: "#1f1f1f",

  textPrimary: "#ececec",
  textSecondary: "#c5c5d2",
  textMuted: "#a1a1aa",

  borderStandard: "#3a3a3a",

  controlBg: "#212121",
  controlBgHover: "#2a2a2a",
  controlSelectedBg: "#1f3a68",
  controlSelectedBorder: "#3b82f6",

  accentPrimary: "#3b82f6",
  accentSoft: "#1f3a68",

  shadow: "0 6px 18px rgba(0,0,0,0.28)",
  shadowStrong: "0 18px 40px rgba(0,0,0,0.48)",

  modalOverlay: "rgba(0,0,0,0.52)",

  paper: "#ffffff",
};

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