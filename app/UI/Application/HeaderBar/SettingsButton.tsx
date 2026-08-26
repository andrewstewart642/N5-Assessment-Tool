
import { useTheme } from "../Theme/ThemeProvider";
import { UI_TYPO } from "../Typography/Typography";

type SettingsButtonProps = {
  onClick: () => void;
};

export default function SettingsButton({ onClick }: SettingsButtonProps) {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <button
        type="button"
        onClick={onClick}
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
          event.currentTarget.style.boxShadow =
            `inset 0 0 0 1px ${theme.accentSoft}`;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = theme.bgElevated;
          event.currentTarget.style.borderColor = theme.borderStandard;
          event.currentTarget.style.transform = "scale(1)";
          event.currentTarget.style.boxShadow =
            `inset 0 0 0 1px ${theme.accentSoft}`;
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
  );
}