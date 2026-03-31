"use client";

import type { Theme } from "@/ui/AppTheme";
import BuilderActionButton from "@/app/create-assessment/builder/components/shared/BuilderActionButton";

type Props = {
  onClick: () => void;
  theme: Theme;
  label?: string;
  title?: string;
  variant?: "primary" | "secondary";
};

export default function AddQuestionButton({
  onClick,
  theme,
  label = "Add Question",
  title = "Add this (skill + concept + difficulty) to the assessment",
  variant = "primary",
}: Props) {
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