// page-sections/AddQuestionButton.tsx

import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/shared-types/AssessmentTypes";

type Props = {
  onClick: () => void;
  theme: Theme;
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
        background: isSecondary ? "#eef2f7" : "white",
        color: isSecondary ? "#51627d" : theme.ctaBlueText,
        borderRadius: 10,
        border: `1px solid ${isSecondary ? "#cfd7e3" : theme.border}`,
        cursor: "pointer",
        width: "100%",
        minWidth: 140,
        height: 40,
        boxShadow: isSecondary ? "none" : "0 1px 0 rgba(255,255,255,0.35) inset",
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