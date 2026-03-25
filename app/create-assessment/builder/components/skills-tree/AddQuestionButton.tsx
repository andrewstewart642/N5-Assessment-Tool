import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  onClick: () => void;
  theme: AppTheme;
  label?: string;
  title?: string;
  variant?: "primary" | "secondary";
};

export default function AddQuestionButton(props: Props) {
  const {
    onClick,
    theme,
    label = "Add Question",
    title = "Add this (skill + concept + difficulty) to the assessment",
    variant = "primary",
  } = props;

  const isSecondary = variant === "secondary";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 12px",
        background: isSecondary ? theme.controlBg : theme.controlSelectedBg,
        color: isSecondary ? theme.textSecondary : theme.textPrimary,
        borderRadius: 10,
        border: `1px solid ${
          isSecondary ? theme.border : theme.controlSelectedBorder
        }`,
        cursor: "pointer",
        width: "100%",
        minWidth: 140,
        height: 40,
        boxShadow: isSecondary ? "none" : theme.cardShadow,
        transition:
          "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease",
        ...UI_TEXT.buttonText,
      }}
      title={title}
    >
      <span
        style={{
          display: "inline-block",
          fontFamily: UI_TYPO.family,
        }}
      >
        {label}
      </span>
    </button>
  );
}