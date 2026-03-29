export type AccentOption =
  | "navy-900"
  | "navy-800"
  | "blue-800"
  | "blue-700"
  | "blue-600"
  | "indigo-700"
  | "indigo-800"
  | "teal-800"
  | "teal-700"
  | "cyan-600"
  | "sky-500"
  | "blue-500"
  | "indigo-500"
  | "violet-500"
  | "purple-600"
  | "green-800"
  | "green-700"
  | "emerald-600"
  | "mint-500"
  | "cyan-400"
  | "sky-300"
  | "blue-300"
  | "indigo-300"
  | "purple-300"
  | "magenta-500"
  | "lime-800"
  | "lime-700"
  | "green-500"
  | "lime-400"
  | "green-300"
  | "mint-300"
  | "aqua-200"
  | "lavender-200"
  | "pink-300"
  | "magenta-700"
  | "green-900"
  | "green-600"
  | "lime-500"
  | "yellow-green-400"
  | "lime-300"
  | "cream-100"
  | "blush-100"
  | "pink-200"
  | "pink-500"
  | "purple-800"
  | "olive-900"
  | "olive-700"
  | "yellow-500"
  | "yellow-300"
  | "cream-50"
  | "peach-100"
  | "peach-200"
  | "salmon-300"
  | "rose-500"
  | "plum-700"
  | "brown-700"
  | "mustard-600"
  | "amber-500"
  | "orange-400"
  | "orange-300"
  | "peach-300"
  | "coral-300"
  | "rose-400"
  | "red-500"
  | "berry-700"
  | "brown-800"
  | "amber-700"
  | "orange-600"
  | "orange-500"
  | "deep-orange-500"
  | "red-400"
  | "red-500-strong"
  | "crimson-600"
  | "crimson-700"
  | "red-800"
  | "white"
  | "grey-100"
  | "grey-200"
  | "grey-300"
  | "grey-400"
  | "grey-500"
  | "grey-600"
  | "grey-700"
  | "grey-800"
  | "black"
  | "slate";

export type AccentSwatch = {
  id: AccentOption;
  label: string;
  hex: string;
};

export const ACCENT_OPTIONS: AccentSwatch[] = [
  { id: "navy-900", label: "Navy 900", hex: "#0b4f7d" },
  { id: "navy-800", label: "Navy 800", hex: "#125b8f" },
  { id: "blue-800", label: "Blue 800", hex: "#2b6cb0" },
  { id: "blue-700", label: "Blue 700", hex: "#2563eb" },
  { id: "blue-600", label: "Blue 600", hex: "#1d4ed8" },
  { id: "indigo-700", label: "Indigo 700", hex: "#1e40af" },
  { id: "indigo-800", label: "Indigo 800", hex: "#1e3a8a" },

  { id: "teal-800", label: "Teal 800", hex: "#0f766e" },
  { id: "teal-700", label: "Teal 700", hex: "#0d9488" },
  { id: "cyan-600", label: "Cyan 600", hex: "#22c1dc" },
  { id: "sky-500", label: "Sky 500", hex: "#38bdf8" },
  { id: "blue-500", label: "Blue 500", hex: "#60a5fa" },
  { id: "indigo-500", label: "Indigo 500", hex: "#6366f1" },
  { id: "violet-500", label: "Violet 500", hex: "#7c3aed" },
  { id: "purple-600", label: "Purple 600", hex: "#9333ea" },

  { id: "green-800", label: "Green 800", hex: "#15803d" },
  { id: "green-700", label: "Green 700", hex: "#16a34a" },
  { id: "emerald-600", label: "Emerald 600", hex: "#10b981" },
  { id: "mint-500", label: "Mint 500", hex: "#2dd4bf" },
  { id: "cyan-400", label: "Cyan 400", hex: "#67e8f9" },
  { id: "sky-300", label: "Sky 300", hex: "#7dd3fc" },
  { id: "blue-300", label: "Blue 300", hex: "#93c5fd" },
  { id: "indigo-300", label: "Indigo 300", hex: "#a5b4fc" },
  { id: "purple-300", label: "Purple 300", hex: "#c4b5fd" },
  { id: "magenta-500", label: "Magenta 500", hex: "#c026d3" },

  { id: "lime-800", label: "Lime 800", hex: "#3f6212" },
  { id: "lime-700", label: "Lime 700", hex: "#65a30d" },
  { id: "green-500", label: "Green 500", hex: "#22c55e" },
  { id: "lime-400", label: "Lime 400", hex: "#84cc16" },
  { id: "green-300", label: "Green 300", hex: "#86efac" },
  { id: "mint-300", label: "Mint 300", hex: "#99f6e4" },
  { id: "aqua-200", label: "Aqua 200", hex: "#cffafe" },
  { id: "lavender-200", label: "Lavender 200", hex: "#ddd6fe" },
  { id: "pink-300", label: "Pink 300", hex: "#f9a8d4" },
  { id: "magenta-700", label: "Magenta 700", hex: "#a21caf" },

  { id: "green-900", label: "Green 900", hex: "#14532d" },
  { id: "green-600", label: "Green 600", hex: "#16a34a" },
  { id: "lime-500", label: "Lime 500", hex: "#a3e635" },
  { id: "yellow-green-400", label: "Yellow Green 400", hex: "#bef264" },
  { id: "lime-300", label: "Lime 300", hex: "#d9f99d" },
  { id: "cream-100", label: "Cream 100", hex: "#fef9c3" },
  { id: "blush-100", label: "Blush 100", hex: "#fce7f3" },
  { id: "pink-200", label: "Pink 200", hex: "#fbcfe8" },
  { id: "pink-500", label: "Pink 500", hex: "#ec4899" },
  { id: "purple-800", label: "Purple 800", hex: "#86198f" },

  { id: "olive-900", label: "Olive 900", hex: "#4d5b00" },
  { id: "olive-700", label: "Olive 700", hex: "#7c8f00" },
  { id: "yellow-500", label: "Yellow 500", hex: "#eab308" },
  { id: "yellow-300", label: "Yellow 300", hex: "#fde047" },
  { id: "cream-50", label: "Cream 50", hex: "#fff7ed" },
  { id: "peach-100", label: "Peach 100", hex: "#ffedd5" },
  { id: "peach-200", label: "Peach 200", hex: "#fed7aa" },
  { id: "salmon-300", label: "Salmon 300", hex: "#fda4af" },
  { id: "rose-500", label: "Rose 500", hex: "#f43f5e" },
  { id: "plum-700", label: "Plum 700", hex: "#861657" },

  { id: "brown-700", label: "Brown 700", hex: "#8b5a2b" },
  { id: "mustard-600", label: "Mustard 600", hex: "#ca8a04" },
  { id: "amber-500", label: "Amber 500", hex: "#f59e0b" },
  { id: "orange-400", label: "Orange 400", hex: "#fb923c" },
  { id: "orange-300", label: "Orange 300", hex: "#fdba74" },
  { id: "peach-300", label: "Peach 300", hex: "#fdc5a5" },
  { id: "coral-300", label: "Coral 300", hex: "#fca5a5" },
  { id: "rose-400", label: "Rose 400", hex: "#fb7185" },
  { id: "red-500", label: "Red 500", hex: "#ef4444" },
  { id: "berry-700", label: "Berry 700", hex: "#9f1239" },

  { id: "brown-800", label: "Brown 800", hex: "#7c2d12" },
  { id: "amber-700", label: "Amber 700", hex: "#d97706" },
  { id: "orange-600", label: "Orange 600", hex: "#ea580c" },
  { id: "orange-500", label: "Orange 500", hex: "#f97316" },
  { id: "deep-orange-500", label: "Deep Orange 500", hex: "#f97316" },
  { id: "red-400", label: "Red 400", hex: "#f87171" },
  { id: "red-500-strong", label: "Red 500 Strong", hex: "#dc2626" },
  { id: "crimson-600", label: "Crimson 600", hex: "#e11d48" },
  { id: "crimson-700", label: "Crimson 700", hex: "#be123c" },
  { id: "red-800", label: "Red 800", hex: "#991b1b" },

  { id: "white", label: "White", hex: "#ffffff" },
  { id: "grey-100", label: "Grey 100", hex: "#f3f4f6" },
  { id: "grey-200", label: "Grey 200", hex: "#e5e7eb" },
  { id: "grey-300", label: "Grey 300", hex: "#d1d5db" },
  { id: "grey-400", label: "Grey 400", hex: "#9ca3af" },
  { id: "grey-500", label: "Grey 500", hex: "#6b7280" },
  { id: "grey-600", label: "Grey 600", hex: "#4b5563" },
  { id: "grey-700", label: "Grey 700", hex: "#374151" },
  { id: "grey-800", label: "Grey 800", hex: "#111827" },
  { id: "black", label: "Black", hex: "#000000" },

  { id: "slate", label: "Slate", hex: "#475569" },
];

export const ACCENT_MAP: Record<AccentOption, string> = ACCENT_OPTIONS.reduce(
  (acc, option) => {
    acc[option.id] = option.hex;
    return acc;
  },
  {} as Record<AccentOption, string>
);

export function isAccentOption(value: unknown): value is AccentOption {
  return ACCENT_OPTIONS.some((option) => option.id === value);
}