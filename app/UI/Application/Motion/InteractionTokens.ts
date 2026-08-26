export const INTERACTION = {
  transition: {
    fast: "all 0.15s ease",
    smooth: "all 0.18s ease",
    calm: "all 0.2s ease",
  },

  lift: {
    subtle: {
      transform: "scale(1.004)",
      shadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
    },
    medium: {
      transform: "scale(1.01)",
      shadow: "0 10px 22px rgba(15, 23, 42, 0.1)",
    },
  },
} as const;