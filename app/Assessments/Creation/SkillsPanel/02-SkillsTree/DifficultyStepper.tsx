import type {
  CSSProperties,
} from "react";

import type {
  DifficultyLevel,
} from "@/app/Assessments/AssessmentTypes";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import {
  canStepDifficulty,
} from "./ConceptSelectionRules";

type DifficultyStepperProps = {
  value:
    DifficultyLevel;

  availableLevels:
    DifficultyLevel[];

  onDecrease:
    () => void;

  onIncrease:
    () => void;

  theme:
    AppTheme;
};

const GROUP_WIDTH =
  140;

const BUTTON_GAP =
  8;

const BUTTON_HEIGHT =
  30;

export default function DifficultyStepper({
  value,
  availableLevels,
  onDecrease,
  onIncrease,
  theme,
}: DifficultyStepperProps) {
  const canDecrease =
    canStepDifficulty(
      availableLevels,
      value,
      "prev"
    );

  const canIncrease =
    canStepDifficulty(
      availableLevels,
      value,
      "next"
    );

  const hasAvailableDifficulty =
    availableLevels.length > 0;

  function buttonStyle(
    enabled: boolean
  ): CSSProperties {
    return {
      width:
        "100%",

      height:
        BUTTON_HEIGHT,

      borderRadius:
        5,

      border:
        `1px solid ${theme.borderStandard}`,

      background:
        enabled
          ? theme.controlBg
          : theme.bgSurface,

      color:
        enabled
          ? theme.textPrimary
          : theme.textMuted,

      cursor:
        enabled
          ? "pointer"
          : "default",

      opacity:
        enabled
          ? 1
          : 0.42,

      display:
        "grid",

      placeItems:
        "center",

      fontFamily:
        UI_TYPO.family,

      fontWeight:
        UI_TYPO.weightMedium,

      fontSize:
        UI_TYPO.sizeMeta,

      lineHeight:
        1,

      padding:
        0,

      boxSizing:
        "border-box",

      transition:
        "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease",
    };
  }

  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "1fr 1fr",

        alignItems:
          "center",

        gap:
          BUTTON_GAP,

        width:
          GROUP_WIDTH,
      }}
      title={
        hasAvailableDifficulty
          ? `Difficulty ${value}`
          : "No difficulty range available for this concept"
      }
    >
      <button
        type="button"
        onClick={
          onDecrease
        }
        disabled={
          !canDecrease
        }
        style={
          buttonStyle(
            canDecrease
          )
        }
        title={
          canDecrease
            ? "Decrease difficulty"
            : "Minimum difficulty reached"
        }
        aria-label="Decrease difficulty"
      >
        −
      </button>

      <button
        type="button"
        onClick={
          onIncrease
        }
        disabled={
          !canIncrease
        }
        style={
          buttonStyle(
            canIncrease
          )
        }
        title={
          canIncrease
            ? "Increase difficulty"
            : "Maximum difficulty reached"
        }
        aria-label="Increase difficulty"
      >
        +
      </button>
    </div>
  );
}