"use client";

import { useState } from "react";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import { INTERACTION } from "@/app/ui/InteractionTokens";

export type BuilderActionButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type Props = {
  onClick: () => void;
  theme: Theme;
  label: string;
  title?: string;
  variant?: BuilderActionButtonVariant;
  disabled?: boolean;
  width?: string | number;
  minWidth?: number;
  height?: number;
};

export default function BuilderActionButton({
  onClick,
  theme,
  label,
  title,
  variant = "secondary",
  disabled = false,
  width = "100%",
  minWidth = 140,
  height = 40,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  const activeHover = hovered && !disabled;
  const lift =
    isPrimary || isDanger
      ? INTERACTION.lift.medium
      : INTERACTION.lift.subtle;

  let background = theme.controlBg;
  let color = theme.textPrimary;
  let border = theme.borderStandard;
  let restingShadow = "0 0 0 rgba(0,0,0,0)";

  if (isPrimary) {
    background = theme.controlSelectedBg;
    color = theme.textPrimary;
    border = theme.controlSelectedBorder;
    restingShadow = theme.shadow;
  }

  if (isSecondary) {
    background = activeHover ? theme.controlBgHover : theme.controlBg;
    color = theme.textSecondary;
    border = activeHover ? theme.controlSelectedBorder : theme.borderStandard;
  }

  if (isGhost) {
    background = activeHover ? theme.controlBgHover : "transparent";
    color = theme.textSecondary;
    border = activeHover ? theme.borderStandard : "transparent";
  }

  if (isDanger) {
    background = activeHover ? theme.controlBgHover : theme.controlBg;
    color = theme.textPrimary;
    border = theme.controlSelectedBorder;
  }

  if (disabled) {
    background = theme.controlBg;
    color = theme.textMuted;
    border = theme.borderStandard;
    restingShadow = "0 0 0 rgba(0,0,0,0)";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      style={{
        width,
        minWidth,
        height,
        padding: "8px 12px",
        borderRadius: 10,
        border: `1px solid ${border}`,
        background,
        color,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: activeHover ? lift.shadow : restingShadow,
        transform: activeHover ? lift.transform : "scale(1)",
        transition: INTERACTION.transition.smooth,
        opacity: disabled ? 0.7 : 1,
        ...UI_TEXT.buttonText,
      }}
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