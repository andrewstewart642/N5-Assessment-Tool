import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  ACCENT_MAP,
  type AccentOption,
} from "./AccentPalette";

import type {
  AppTheme,
} from "../Theme/AppTheme";


const DEFAULT_COURSE_ACCENT_OPTION:
  Record<
    CourseId,
    AccentOption
  > = {
    N5_MATH:
      "blue-500",

    N5_APPLICATIONS_MATH:
      "yellow-300",

    HIGHER_MATH:
      "mint-500",

    ADVANCED_HIGHER_MATH:
      "violet-500",
  };


export type CourseColourPreset = {
  label:
    string;

  hex:
    string;
};


export const COURSE_COLOUR_PRESETS:
  CourseColourPreset[] = [
    {
      label:
        "Sky",

      hex:
        ACCENT_MAP["sky-500"],
    },

    {
      label:
        "Blue",

      hex:
        ACCENT_MAP["blue-500"],
    },

    {
      label:
        "Indigo",

      hex:
        ACCENT_MAP["indigo-500"],
    },

    {
      label:
        "Violet",

      hex:
        ACCENT_MAP["violet-500"],
    },

    {
      label:
        "Pink",

      hex:
        ACCENT_MAP["pink-500"],
    },

    {
      label:
        "Rose",

      hex:
        ACCENT_MAP["rose-400"],
    },

    {
      label:
        "Orange",

      hex:
        ACCENT_MAP["orange-400"],
    },

    {
      label:
        "Yellow",

      hex:
        ACCENT_MAP["yellow-300"],
    },

    {
      label:
        "Lime",

      hex:
        ACCENT_MAP["lime-400"],
    },

    {
      label:
        "Green",

      hex:
        ACCENT_MAP["green-500"],
    },

    {
      label:
        "Mint",

      hex:
        ACCENT_MAP["mint-500"],
    },

    {
      label:
        "Cyan",

      hex:
        ACCENT_MAP["cyan-400"],
    },
  ];


export function isValidCourseColour(
  value:
    unknown
): value is string {
  return (
    typeof value ===
      "string" &&
    /^#[0-9a-f]{6}$/i.test(
      value
    )
  );
}


export function getDefaultCourseAccent(
  courseId:
    CourseId
): string {
  return ACCENT_MAP[
    DEFAULT_COURSE_ACCENT_OPTION[
      courseId
    ]
  ];
}


export function getCourseAccent({
  courseId,
  overrideColour,
}: {
  courseId:
    CourseId;

  overrideColour?:
    string | null;
}): string {
  if (
    isValidCourseColour(
      overrideColour
    )
  ) {
    return overrideColour;
  }


  return getDefaultCourseAccent(
    courseId
  );
}


export function getCourseAccentTextColour(
  accent:
    string,
  theme:
    AppTheme
): string {
  return `color-mix(
    in srgb,
    ${accent} 82%,
    ${theme.textPrimary}
  )`;
}


export function getCourseSectionBackground(
  accent:
    string,
  theme:
    AppTheme
): string {
  return `linear-gradient(
    135deg,
    color-mix(
      in srgb,
      ${accent} 10%,
      ${theme.bgSection}
    ) 0%,
    color-mix(
      in srgb,
      ${accent} 5%,
      ${theme.bgSurface}
    ) 48%,
    ${theme.bgSurface} 100%
  )`;
}


export function getCourseSectionBorder(
  accent:
    string,
  theme:
    AppTheme
): string {
  return `color-mix(
    in srgb,
    ${accent} 38%,
    ${theme.borderStandard}
  )`;
}


export function getCourseTileBackground({
  accent,
  theme,
  hovered,
}: {
  accent:
    string;

  theme:
    AppTheme;

  hovered:
    boolean;
}): string {
  const strength =
    hovered
      ? 13
      : 7;


  return `linear-gradient(
    180deg,
    color-mix(
      in srgb,
      ${accent} ${strength}%,
      ${theme.bgSection}
    ) 0%,
    ${theme.bgSection} 52%
  )`;
}