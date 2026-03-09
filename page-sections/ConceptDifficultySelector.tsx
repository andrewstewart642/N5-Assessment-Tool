// page-sections/ConceptDifficultySelector.tsx
// Compact concept + difficulty cyclers with smaller arrow buttons.

import type React from "react";
import { UI_TEXT, UI_TYPO } from "@/app/ui/uiTypography";
import type { Theme } from "@/shared-types/assessmentTypes";

type StepperProps = {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  theme: Theme;
};

function StepperButton({ label, onClick, disabled, children, theme }: StepperProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 8,
        border: `1px solid ${theme.border}`,
        background: disabled ? "#0a0f15" : theme.controlBg,
        color: disabled ? theme.textDim : theme.text,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: UI_TYPO.family,
        fontWeight: UI_TYPO.weightHeavy,
        opacity: disabled ? 0.55 : 1,
        width: 42,
        height: 18,
        padding: 0,
        lineHeight: 1,
        fontSize: UI_TYPO.sizeSm,
      }}
    >
      {children}
    </button>
  );
}

type CyclerProps = {
  title: string;
  value: string;
  counter?: string;
  onUp: () => void;
  onDown: () => void;
  disabled: boolean;
  theme: Theme;
};

function CyclerControl({ title, value, counter, onUp, onDown, disabled, theme }: CyclerProps) {
  return (
    <div>
      <div
        style={{
          ...UI_TEXT.sectionLabel,
          color: theme.textMuted,
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 42px", gap: 8, alignItems: "stretch" }}>
        <div
          style={{
            height: 38,
            padding: "0 10px",
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: theme.controlBg,
            color: theme.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            minWidth: 0,
            fontFamily: UI_TYPO.family,
          }}
          title={value}
        >
          <span
            style={{
              ...UI_TEXT.controlTextStrong,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </span>

          {counter ? (
            <span
              style={{
                ...UI_TEXT.smallValueText,
                color: theme.textDim,
              }}
            >
              {counter}
            </span>
          ) : null}
        </div>

        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 4 }}>
          <StepperButton label="Up" onClick={onUp} disabled={disabled} theme={theme}>
            ▲
          </StepperButton>
          <StepperButton label="Down" onClick={onDown} disabled={disabled} theme={theme}>
            ▼
          </StepperButton>
        </div>
      </div>
    </div>
  );
}

type Props = {
  conceptTitle: string;
  conceptValue: string;
  conceptCounter: string;
  conceptDisabled: boolean;
  onConceptUp: () => void;
  onConceptDown: () => void;

  difficultyValue: string;
  difficultyCounter: string;
  onDifficultyUp: () => void;
  onDifficultyDown: () => void;

  theme: Theme;
};

export default function ConceptDifficultySelector(props: Props) {
  const {
    conceptTitle,
    conceptValue,
    conceptCounter,
    conceptDisabled,
    onConceptUp,
    onConceptDown,
    difficultyValue,
    difficultyCounter,
    onDifficultyUp,
    onDifficultyDown,
    theme,
  } = props;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 220px",
        gap: 14,
        alignItems: "end",
        fontFamily: UI_TYPO.family,
      }}
    >
      <CyclerControl
        title={conceptTitle}
        value={conceptValue}
        counter={conceptCounter}
        onUp={onConceptUp}
        onDown={onConceptDown}
        disabled={conceptDisabled}
        theme={theme}
      />

      <CyclerControl
        title="Difficulty"
        value={difficultyValue}
        counter={difficultyCounter}
        onUp={onDifficultyUp}
        onDown={onDifficultyDown}
        disabled={false}
        theme={theme}
      />
    </div>
  );
}