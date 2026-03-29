import { ACCENT_MAP, type AccentOption } from "./AccentPalette";

type Rgb = {
  r: number;
  g: number;
  b: number;
};

function clamp(value: number, min = 0, max = 255): number {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex: string): Rgb {
  const cleaned = hex.replace("#", "");
  const expanded =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((char) => char + char)
          .join("")
      : cleaned;

  const value = parseInt(expanded, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(hexA: string, hexB: string, amount: number): string {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  return rgbToHex({
    r: Math.round(a.r + (b.r - a.r) * amount),
    g: Math.round(a.g + (b.g - a.g) * amount),
    b: Math.round(a.b + (b.b - a.b) * amount),
  });
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function buildAccent(accent: AccentOption) {
  const base = ACCENT_MAP[accent];

  const hover = mix(base, "#000000", 0.14);
  const strong = mix(base, "#000000", 0.22);
  const softText = mix(base, "#000000", 0.18);

  return {
    accentPrimary: base,
    accentPrimaryHover: hover,
    accentSoft: withAlpha(base, 0.14),
    accentSoftText: softText,
    controlSelectedBg: withAlpha(base, 0.16),
    controlSelectedBorder: base,
    focusRing: withAlpha(base, 0.24),
    accent: base,
    accentStrong: strong,
    ctaBlueText: strong,
  };
}