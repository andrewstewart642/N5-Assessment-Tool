import type {
  CSSProperties,
  ReactNode,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import {
  TOP_BAR_FIELD_GAP,
} from "./AssessmentTopBarTokens";

type AssessmentTopBarFieldProps = {
  label:
    string;

  children:
    ReactNode;

  theme:
    AppTheme;

  width?:
    CSSProperties["width"];
};

export default function AssessmentTopBarField({
  label,
  children,
  theme,
  width = "100%",
}: AssessmentTopBarFieldProps) {
  return (
    <div
      style={{
        display:
          "grid",

        gap:
          TOP_BAR_FIELD_GAP,

        width,

        minWidth:
          0,
      }}
    >
      <span
        style={{
          ...UI_TEXT.sectionLabel,

          color:
            theme.textMuted,

          whiteSpace:
            "nowrap",
        }}
      >
        {label}
      </span>

      {children}
    </div>
  );
}