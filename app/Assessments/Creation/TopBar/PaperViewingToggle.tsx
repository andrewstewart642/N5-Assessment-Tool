import {
  useState,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import {
  getAssessmentPaperConfig,
  getAssessmentPapers,
} from "../Papers/AssessmentPaperRules";

import {
  TOP_BAR_CONTROL_HEIGHT,
  TOP_BAR_CONTROL_RADIUS,
  TOP_BAR_SELECTED_RADIUS,
} from "./AssessmentTopBarTokens";

type PaperViewingToggleProps = {
  value:
    Paper;

  onChange: (
    paper: Paper
  ) => void;

  theme:
    AppTheme;
};

type PaperViewingToggleButtonProps = {
  label:
    string;

  active:
    boolean;

  onClick:
    () => void;

  theme:
    AppTheme;
};

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
          "0 8px",

        border:
          "none",

        borderRadius:
          TOP_BAR_SELECTED_RADIUS,

        background:
          active
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : "transparent",

        color:
          active
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        display:
          "grid",

        placeItems:
          "center",

        fontFamily:
          UI_TYPO.family,

        fontSize:
          UI_TYPO.sizeBase,

        fontWeight:
          active
            ? UI_TYPO.weightSemibold
            : UI_TYPO.weightMedium,

        lineHeight:
          1,

        whiteSpace:
          "nowrap",

        transition:
          "background 0.15s ease, color 0.15s ease",
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
      role="radiogroup"
      aria-label="Paper being viewed"
      style={{
        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          2,

        height:
          TOP_BAR_CONTROL_HEIGHT,

        padding:
          3,

        boxSizing:
          "border-box",

        borderRadius:
          TOP_BAR_CONTROL_RADIUS,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          theme.controlBg,
      }}
    >
      {paperOptions.map(
        (
          paper
        ) => {
          const active =
            paper ===
            value;

          const config =
            getAssessmentPaperConfig(
              paper
            );

          return (
            <PaperViewingToggleButton
              key={
                paper
              }
              label={
                config.label
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