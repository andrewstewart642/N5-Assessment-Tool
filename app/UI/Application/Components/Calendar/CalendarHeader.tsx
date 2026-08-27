import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

type CalendarHeaderProps = {
  theme:
    AppTheme;

  monthLabel:
    string;

  onPrevious:
    () => void;

  onNext:
    () => void;
};

function NavigationButton({
  direction,
  onClick,
  theme,
}: {
  direction:
    "previous" |
    "next";

  onClick:
    () => void;

  theme:
    AppTheme;
}) {
  const [
    hovered,
    setHovered,
  ] =
    useState(false);

  const previous =
    direction ===
    "previous";

  return (
    <button
      type="button"
      aria-label={
        previous
          ? "Previous month"
          : "Next month"
      }
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
        width:
          26,

        height:
          26,

        padding:
          0,

        borderRadius:
          5,

        border:
          `1px solid ${theme.borderStandard}`,

        background:
          hovered
            ? theme.controlBgHover
            : theme.controlBg,

        color:
          theme.textSecondary,

        cursor:
          "pointer",

        display:
          "grid",

        placeItems:
          "center",

        transition:
          "background 0.15s ease, color 0.15s ease",
      }}
    >
      <svg
        width="7"
        height="10"
        viewBox="0 0 7 10"
        aria-hidden="true"
      >
        <path
          d={
            previous
              ? "M5.5 1 L1.5 5 L5.5 9"
              : "M1.5 1 L5.5 5 L1.5 9"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function CalendarHeader({
  theme,
  monthLabel,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "26px 1fr 26px",

        alignItems:
          "center",

        gap:
          6,

        marginBottom:
          8,
      }}
    >
      <NavigationButton
        direction="previous"
        onClick={
          onPrevious
        }
        theme={
          theme
        }
      />

      <div
        style={{
          textAlign:
            "center",

          color:
            theme.textPrimary,

          fontFamily:
            UI_TYPO.family,

          fontSize:
            UI_TYPO.sizeBase,

          fontWeight:
            UI_TYPO.weightSemibold,

          lineHeight:
            1.2,
        }}
      >
        {monthLabel}
      </div>

      <NavigationButton
        direction="next"
        onClick={
          onNext
        }
        theme={
          theme
        }
      />
    </div>
  );
}