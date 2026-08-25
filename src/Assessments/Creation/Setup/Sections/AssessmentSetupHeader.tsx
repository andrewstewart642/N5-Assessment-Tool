import type { AppTheme } from "@/src/UI/Application/Theme/AppTheme";
import { UI_TYPO } from "@/src/UI/Application/Typography/Typography";

type AssessmentSetupHeaderProps = {
  theme: AppTheme;
};

export default function AssessmentSetupHeader({
  theme,
}: AssessmentSetupHeaderProps) {
  return (
    <section
      style={{
        border: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        borderRadius: 22,
        padding: "22px 24px",
      }}
    >
      <div
        style={{
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightBold,
          fontSize: 28,
          color: theme.textPrimary,
          marginBottom: 8,
        }}
      >
        Create Assessment
      </div>

      <div
        style={{
          fontFamily: UI_TYPO.family,
          fontSize: 15,
          color: theme.textMuted,
          lineHeight: 1.5,
          maxWidth: 900,
        }}
      >
        Build the assessment brief first. The setup stays compact inside the
        page width, with nested options appearing directly under the choice
        they belong to.
      </div>
    </section>
  );
}