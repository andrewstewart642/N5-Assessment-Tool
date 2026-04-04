"use client";

import type { Theme } from "@/ui/AppTheme";
import BuilderActionButton, {
  type BuilderActionButtonVariant,
} from "@/app/create-assessment/builder/components/shared/BuilderActionButton";

type Props = {
  onClick: () => void;
  theme: Theme;
  label?: string;
  title?: string;
  variant?: BuilderActionButtonVariant;
};

export default function AddQuestionButton(props: Props) {
  const {
    onClick,
    theme,
    label = "Add Question",
    title = "Add this (skill + concept + difficulty) to the assessment",
    variant = "primary",
  } = props;

  return (
    <BuilderActionButton
      onClick={onClick}
      theme={theme}
      label={label}
      title={title}
      variant={variant}
    />
  );
}