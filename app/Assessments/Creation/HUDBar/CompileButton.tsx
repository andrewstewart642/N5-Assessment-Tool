import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";


type AssessmentCompileButtonProps = {
  theme:
    AppTheme;

  onClick:
    () => void;
};


const COMPILE_BUTTON_HEIGHT =
  32;

const COMPILE_BUTTON_RADIUS =
  6;


export default function AssessmentCompileButton({
  theme,
  onClick,
}: AssessmentCompileButtonProps) {
  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );

  const [
    pressed,
    setPressed,
  ] =
    useState(
      false
    );


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
      onMouseLeave={() => {
        setHovered(
          false
        );

        setPressed(
          false
        );
      }}
      onMouseDown={() =>
        setPressed(
          true
        )
      }
      onMouseUp={() =>
        setPressed(
          false
        )
      }
      title="Compile assessment into printable pages"
      style={{
        height:
          COMPILE_BUTTON_HEIGHT,

        padding:
          "0 11px",

        boxSizing:
          "border-box",

        display:
          "inline-flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        gap:
          7,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          hovered
            ? theme.accentPrimary
            : theme.controlSelectedBorder,

        borderRadius:
          COMPILE_BUTTON_RADIUS,

        background:
          hovered
            ? theme.accentPrimary
            : theme.controlSelectedBg,

        color:
          hovered
            ? theme.textOnAccent
            : theme.textPrimary,

        cursor:
          "pointer",

        boxShadow:
          theme.shadow,

        transform:
          pressed
            ? "translateY(1px)"
            : "translateY(0)",

        transition: [
          "background 140ms ease",
          "border-color 140ms ease",
          "color 140ms ease",
          "transform 80ms ease",
          "box-shadow 140ms ease",
        ].join(
          ", "
        ),

        ...UI_TEXT.buttonText,
      }}
    >
      <span>
        Compile
      </span>

      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        aria-hidden="true"
        style={{
          flexShrink:
            0,
        }}
      >
        <path
          d="M2.25 6H9.25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <path
          d="M6.75 3.25L9.5 6L6.75 8.75"
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