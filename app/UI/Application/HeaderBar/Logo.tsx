
import { UI_TYPO } from "../Typography/Typography";
import { useTheme } from "../Theme/ThemeProvider";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 138,
          height: 26,
          borderRadius: 6,
          border: `1px dashed ${theme.borderStandard}`,
          background: theme.bgElevated,
          color: theme.textMuted,
          display: "grid",
          placeItems: "center",
          fontSize: UI_TYPO.sizeMeta,
          fontWeight: UI_TYPO.weightMedium,
          lineHeight: 1,
        }}
      >
        Reserved for logo
      </div>
    </div>
  );
}