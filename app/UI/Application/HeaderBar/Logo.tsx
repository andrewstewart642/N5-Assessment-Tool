
import { UI_TYPO } from "../Typography/Typography";
import { useTheme } from "../Theme/ThemeProvider";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 150,
          height: 30,
          borderRadius: 10,
          border: `1px dashed ${theme.borderStandard}`,
          background: theme.bgElevated,
          color: theme.textMuted,
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: UI_TYPO.weightMedium,
          lineHeight: 1,
        }}
      >
        Reserved for logo
      </div>
    </div>
  );
}