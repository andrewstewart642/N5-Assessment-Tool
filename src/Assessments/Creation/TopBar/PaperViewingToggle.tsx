import {
  useState,
} from "react";

import type {
  Paper,
} from "@/shared-types/AssessmentTypes";

import {
  INTERACTION,
} from "@/src/UI/Application/Motion/InteractionTokens";

import type {
  AppTheme,
} from "@/src/UI/Application/Theme/AppTheme";

import {
  getAssessmentPaperConfig,
  getAssessmentPapers,
} from "../Papers/AssessmentPaperRules";

type PaperViewingToggleProps = {
  value: Paper;

  onChange: (
    paper: Paper
  ) => void;

  theme: AppTheme;
};

type PaperViewingToggleButtonProps = {
  label: string;

  active: boolean;

  onClick:
    () => void;

  theme: AppTheme;
};

const CONTROL_HEIGHT =
  32;

const CONTROL_RADIUS =
  10;

function PaperViewingToggleButton({
  label,
  active,
  onClick,
  theme,
}: PaperViewingToggleButtonProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

  const showLift =
    hovered &&
    !active;

  return (
    <button
      type="button"
      onClick={
        onClick
      }
      onMouseEnter={() =>
        setHovered(
          true
        )
      }
      onMouseLeave={() =>
        setHovered(
          false
        )
      }
      style={{
        height:
          "100%",

        padding:
          "0 12px",

        borderRadius:
          8,

        border:
          "none",

        cursor:
          "pointer",

        fontSize:
          13,

        fontWeight:
          600,

        fontFamily:
          "inherit",

        color:
          active
            ? theme.textPrimary
            : theme.textMuted,

        background:
          active
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : "transparent",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        lineHeight:
          1,

        whiteSpace:
          "nowrap",

        transition:
          INTERACTION.transition.smooth,

        transform:
          showLift
            ? INTERACTION.lift.subtle.transform
            : "scale(1)",

        boxShadow:
          showLift
            ? INTERACTION.lift.subtle.shadow
            : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      {label}
    </button>
  );
}

export default function PaperViewingToggle({
  value,
  onChange,
  theme,
}: PaperViewingToggleProps) {
  const paperOptions =
    getAssessmentPapers();

  return (
    <div
      style={{
        display:
          "inline-flex",

        height:
          CONTROL_HEIGHT,

        borderRadius:
          CONTROL_RADIUS,

        background:
          theme.controlBg,

        border:
          `1px solid ${theme.borderStandard}`,

        padding: 2,

        boxSizing:
          "border-box",
      }}
    >
      {paperOptions.map(
        (paper) => {
          const active =
            value ===
            paper;

          const paperConfig =
            getAssessmentPaperConfig(
              paper
            );

          return (
            <PaperViewingToggleButton
              key={
                paper
              }
              label={
                paperConfig.label
              }
              active={
                active
              }
              onClick={() =>
                onChange(
                  paper
                )
              }
              theme={
                theme
              }
            />
          );
        }
      )}
    </div>
  );
}