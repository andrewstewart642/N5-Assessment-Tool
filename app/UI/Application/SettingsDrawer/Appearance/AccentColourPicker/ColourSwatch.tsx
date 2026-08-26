
import type { Theme } from "../../../Theme/AppTheme";

type ColourSwatchProps = {
  colour: string;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: Theme;
  width: number;
  height: number;
  innerBorder?: boolean;
};

export default function ColourSwatch({
  colour,
  label,
  active,
  onClick,
  theme,
  width,
  height,
  innerBorder = false,
}: ColourSwatchProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="theme-hex-swatch"
        style={{
          width,
          height,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          position: "relative",
          zIndex: active ? 3 : 1,
        }}
      >
        <span
          style={{
            width,
            height,
            display: "block",
            background: colour,
            clipPath:
              "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
            border: active
              ? `2px solid ${theme.textPrimary}`
              : innerBorder
                ? `1px solid ${theme.borderStandard}`
                : `1px solid rgba(255,255,255,0.15)`,
            outline: active ? `2px solid ${theme.paper}` : "none",
            outlineOffset: active ? "-4px" : 0,
            boxShadow: active
              ? theme.shadowStrong
              : "0 1px 2px rgba(0,0,0,0.06)",
            transform: active ? "scale(1.02)" : "scale(1)",
            transition:
              "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, outline 140ms ease, filter 140ms ease",
          }}
        />
      </button>

      <style jsx>{`
        .theme-hex-swatch:hover {
          z-index: 4;
        }

        .theme-hex-swatch:hover span {
          transform: scale(1.05);
          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
          filter: brightness(1.04);
          border-color: ${theme.textPrimary};
        }

        .theme-hex-swatch:focus-visible {
          outline: 2px solid ${theme.accentPrimary};
          outline-offset: 3px;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}