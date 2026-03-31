"use client";

import { useState } from "react";
import type { Paper } from "@/shared-types/AssessmentTypes";
import { UI_TYPO } from "@/app/ui/UiTypography";
import type { Theme } from "@/ui/AppTheme";
import { INTERACTION } from "@/app/ui/InteractionTokens";

type BuilderMetaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  width?: number;
  theme?: Theme;
};

const TOP_BAR_CONTROL_HEIGHT = 32;
const TOP_BAR_LABEL_GAP = 4;
const TOP_BAR_RADIUS = 10;

function getLabelStyle(theme?: Theme): React.CSSProperties {
  return {
    fontSize: 12,
    fontWeight: UI_TYPO.weightMedium,
    letterSpacing: 0,
    color: theme ? theme.textMuted : "rgba(214,227,243,0.74)",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
  };
}

function getInputShellStyle(
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active = hovered || focused;

  return {
    width: "100%",
    borderRadius: TOP_BAR_RADIUS,
    transform: active ? INTERACTION.lift.subtle.transform : "scale(1)",
    boxShadow: active ? INTERACTION.lift.subtle.shadow : "0 0 0 rgba(0,0,0,0)",
    transition: INTERACTION.transition.smooth,
  };
}

function getInputStyle(
  theme: Theme | undefined,
  hovered: boolean,
  focused: boolean
): React.CSSProperties {
  const active = hovered || focused;

  return {
    height: TOP_BAR_CONTROL_HEIGHT,
    borderRadius: TOP_BAR_RADIUS,
    border: theme
      ? `1px solid ${
          active ? theme.controlSelectedBorder : theme.borderStandard
        }`
      : "1px solid rgba(255,255,255,0.08)",
    background: theme
      ? active
        ? theme.controlBgHover
        : theme.bgElevated
      : "rgba(255,255,255,0.02)",
    color: theme ? theme.textPrimary : "#f7fbff",
    padding: "0 10px",
    fontSize: 13,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    minWidth: 0,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: active
      ? "inset 0 1px 0 rgba(255,255,255,0.06)"
      : "inset 0 1px 0 rgba(255,255,255,0.04)",
    transition: INTERACTION.transition.smooth,
  };
}

export function BuilderMetaField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
  theme,
}: BuilderMetaFieldProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <label
      style={{
        display: "grid",
        gap: TOP_BAR_LABEL_GAP,
        minWidth: 0,
        width: width ?? "auto",
        fontFamily: UI_TYPO.family,
      }}
    >
      <span style={getLabelStyle(theme)}>{label}</span>

      <div
        style={getInputShellStyle(hovered, focused)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          style={getInputStyle(theme, hovered, focused)}
        />
      </div>
    </label>
  );
}

type ViewingToggleProps = {
  value: Paper;
  onChange: (paper: Paper) => void;
  theme?: Theme;
};

type ToggleButtonProps = {
  paper: Paper;
  active: boolean;
  onClick: () => void;
  theme?: Theme;
};

function ViewingToggleButton({
  paper,
  active,
  onClick,
  theme,
}: ToggleButtonProps) {
  const [hovered, setHovered] = useState(false);
  const showLift = hovered && !active;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: "100%",
        padding: "0 12px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "inherit",
        color: active
          ? theme?.textPrimary ?? "#ffffff"
          : theme?.textMuted ?? "rgba(214,227,243,0.72)",
        background: active
          ? theme?.controlSelectedBg ?? "rgba(96,165,250,0.18)"
          : hovered
            ? theme?.controlBgHover ?? "rgba(255,255,255,0.06)"
            : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
        whiteSpace: "nowrap",
        transition: INTERACTION.transition.smooth,
        transform: showLift ? INTERACTION.lift.subtle.transform : "scale(1)",
        boxShadow: showLift
          ? INTERACTION.lift.subtle.shadow
          : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      {paper === "P1" ? "Paper 1" : "Paper 2"}
    </button>
  );
}

export function ViewingToggle({
  value,
  onChange,
  theme,
}: ViewingToggleProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        height: TOP_BAR_CONTROL_HEIGHT,
        borderRadius: TOP_BAR_RADIUS,
        background: theme ? theme.controlBg : "rgba(255,255,255,0.04)",
        border: theme
          ? `1px solid ${theme.borderStandard}`
          : "1px solid rgba(255,255,255,0.08)",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {(["P1", "P2"] as const).map((paper) => {
        const active = value === paper;

        return (
          <ViewingToggleButton
            key={paper}
            paper={paper}
            active={active}
            onClick={() => onChange(paper)}
            theme={theme}
          />
        );
      })}
    </div>
  );
}