import {
  useMemo,
  useState,
} from "react";

import {
  ACCENT_MAP,
} from "@/app/UI/Application/Colours/AccentPalette";

import AccentColourPicker from "@/app/UI/Application/SettingsDrawer/Appearance/AccentColourPicker/AccentColourPicker";

import {
  getAccentLabel,
  WHITE_ACCENT_OPTION,
} from "@/app/UI/Application/SettingsDrawer/Appearance/AccentColourPicker/AccentColourOptions";

import type {
  ThemeModePreference,
} from "@/app/UI/Application/Theme/ThemeMode";

import {
  useTheme,
} from "@/app/UI/Application/Theme/ThemeProvider";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";


type ThemeOption = {
  value:
    ThemeModePreference;

  label:
    string;

  description:
    string;

  wide?:
    boolean;
};


const THEME_OPTIONS:
  ThemeOption[] = [
    {
      value:
        "dark",

      label:
        "Dark",

      description:
        "Dark workbench interface.",
    },

    {
      value:
        "soft-grey",

      label:
        "Soft Grey",

      description:
        "A softer dark interface.",
    },

    {
      value:
        "light",

      label:
        "Light",

      description:
        "Light workbench interface.",
    },

    {
      value:
        "system",

      label:
        "System",

      description:
        "Match your device appearance.",
    },

    {
      value:
        "custom",

      label:
        "Custom",

      description:
        "Build the interface from a base colour.",

      wide:
        true,
    },
  ];


function ThemeOptionButton({
  option,
  active,
  onClick,
}: {
  option:
    ThemeOption;

  active:
    boolean;

  onClick:
    () => void;
}) {
  const {
    theme,
  } =
    useTheme();

  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );


  return (
    <button
      type="button"
      aria-pressed={
        active
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
        gridColumn:
          option.wide
            ? "1 / -1"
            : "auto",

        minWidth:
          0,

        height:
          32,

        padding:
          "0 9px",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          active
            ? theme.controlSelectedBorder
            : theme.borderStandard,

        borderRadius:
          5,

        background:
          active
            ? theme.controlSelectedBg
            : hovered
              ? theme.controlBgHover
              : theme.controlBg,

        color:
          active
            ? theme.textPrimary
            : theme.textSecondary,

        cursor:
          "pointer",

        ...UI_TEXT.controlText,

        fontWeight:
          active
            ? 600
            : 500,

        transition: [
          "background 140ms ease",
          "border-color 140ms ease",
          "color 140ms ease",
        ].join(
          ", "
        ),
      }}
    >
      {option.label}
    </button>
  );
}


export default function GlobalSettingsPanel() {
  const {
    theme,

    themePreference,
    setThemePreference,

    customThemeColour,
    setCustomThemeColour,
  } =
    useTheme();


  const [
    colourPickerOpen,
    setColourPickerOpen,
  ] =
    useState(
      false
    );


  const selectedThemeOption =
    THEME_OPTIONS.find(
      (
        option
      ) =>
        option.value ===
        themePreference
    ) ??
    THEME_OPTIONS[
      0
    ];


  const selectedColourLabel =
    useMemo(
      () =>
        getAccentLabel(
          customThemeColour
        ),
      [
        customThemeColour,
      ]
    );


  const selectedColour =
    ACCENT_MAP[
      customThemeColour
    ];


  return (
    <>
      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            16,
        }}
      >
        {/*
         * Appearance
         */}

        <section
          style={{
            minWidth:
              0,

            display:
              "grid",

            gap:
              8,
          }}
        >
          <div
            style={{
              display:
                "grid",

              gap:
                2,
            }}
          >
            <div
              style={{
                ...UI_TEXT.sectionLabel,

                color:
                  theme.textMuted,
              }}
            >
              Appearance
            </div>

            <div
              style={{
                ...UI_TEXT.helper,

                color:
                  theme.textMuted,
              }}
            >
              Choose how the application looks.
            </div>
          </div>


          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",

              gap:
                6,
            }}
          >
            {THEME_OPTIONS.map(
              (
                option
              ) => (
                <ThemeOptionButton
                  key={
                    option.value
                  }
                  option={
                    option
                  }
                  active={
                    themePreference ===
                    option.value
                  }
                  onClick={() =>
                    setThemePreference(
                      option.value
                    )
                  }
                />
              )
            )}
          </div>


          <div
            style={{
              minHeight:
                32,

              padding:
                "7px 8px",

              boxSizing:
                "border-box",

              borderRadius:
                5,

              background:
                theme.bgSection,

              color:
                theme.textMuted,

              ...UI_TEXT.helper,
            }}
          >
            {
              selectedThemeOption.description
            }
          </div>
        </section>


        {/*
         * Custom theme colour.
         *
         * Only relevant while Custom is active,
         * so don't permanently consume panel
         * space with a control that does nothing
         * for the other modes.
         */}

        {themePreference ===
        "custom" ? (
          <section
            style={{
              minWidth:
                0,

              paddingTop:
                12,

              display:
                "grid",

              gap:
                8,

              borderTopWidth:
                1,

              borderTopStyle:
                "solid",

              borderTopColor:
                theme.borderStandard,
            }}
          >
            <div
              style={{
                display:
                  "grid",

                gap:
                  2,
              }}
            >
              <div
                style={{
                  ...UI_TEXT.sectionLabel,

                  color:
                    theme.textMuted,
                }}
              >
                Custom theme
              </div>

              <div
                style={{
                  ...UI_TEXT.helper,

                  color:
                    theme.textMuted,
                }}
              >
                Choose the base colour used to generate the theme.
              </div>
            </div>


            <button
              type="button"
              onClick={() =>
                setColourPickerOpen(
                  true
                )
              }
              style={{
                width:
                  "100%",

                minWidth:
                  0,

                minHeight:
                  42,

                padding:
                  "6px 9px",

                boxSizing:
                  "border-box",

                display:
                  "grid",

                gridTemplateColumns:
                  "auto minmax(0, 1fr) auto",

                alignItems:
                  "center",

                gap:
                  9,

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  5,

                background:
                  theme.controlBg,

                color:
                  theme.textPrimary,

                cursor:
                  "pointer",

                textAlign:
                  "left",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width:
                    16,

                  height:
                    18,

                  flexShrink:
                    0,

                  boxSizing:
                    "border-box",

                  background:
                    selectedColour,

                  clipPath:
                    "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",

                  border:
                    customThemeColour ===
                    WHITE_ACCENT_OPTION
                      ? `1px solid ${theme.borderStandard}`
                      : "none",
                }}
              />

              <span
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gap:
                    1,
                }}
              >
                <span
                  style={{
                    ...UI_TEXT.controlTextStrong,

                    color:
                      theme.textSecondary,

                    overflow:
                      "hidden",

                    whiteSpace:
                      "nowrap",

                    textOverflow:
                      "ellipsis",
                  }}
                >
                  {selectedColourLabel}
                </span>

                <span
                  style={{
                    ...UI_TEXT.helper,

                    color:
                      theme.textMuted,
                  }}
                >
                  Base colour
                </span>
              </span>


              <svg
                width="8"
                height="12"
                viewBox="0 0 8 12"
                aria-hidden="true"
                style={{
                  color:
                    theme.textMuted,
                }}
              >
                <path
                  d="M2 1.5L6 6L2 10.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </section>
        ) : null}
      </div>


      {/*
       * For now we reuse the proven colour palette.
       * Its eventual relocation out of the legacy
       * SettingsDrawer folder belongs to cleanup,
       * not this interaction pass.
       */}

      <AccentColourPicker
        open={
          colourPickerOpen
        }
        selectedColour={
          customThemeColour
        }
        onSelect={(
          colour
        ) => {
          setCustomThemeColour(
            colour
          );

          /*
           * The palette was opened from Custom
           * theme, so ensure that choice remains
           * authoritative.
           */

          setThemePreference(
            "custom"
          );
        }}
        onClose={() =>
          setColourPickerOpen(
            false
          )
        }
        theme={
          theme
        }
      />
    </>
  );
}