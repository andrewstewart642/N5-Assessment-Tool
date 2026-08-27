import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  COURSE_COLOUR_PRESETS,
} from "@/app/UI/Application/Colours/CourseAccent";


type Props = {
  courseName:
    string;

  accent:
    string;

  theme:
    AppTheme;

  onColourChange:
    (
      colour:
        string
    ) => void;

  onResetColour:
    () => void;
};


export default function CourseFamilySettingsControl({
  courseName,
  accent,
  theme,
  onColourChange,
  onResetColour,
}: Props) {
  const [
    open,
    setOpen,
  ] =
    useState(
      false
    );


  const [
    hovered,
    setHovered,
  ] =
    useState(
      false
    );


  const rootRef =
    useRef<HTMLDivElement>(
      null
    );


  useEffect(() => {
    if (
      !open
    ) {
      return;
    }


    function handlePointerDown(
      event:
        MouseEvent
    ) {
      if (
        rootRef.current &&
        !rootRef.current.contains(
          event.target as
            Node
        )
      ) {
        setOpen(
          false
        );
      }
    }


    function handleKeyDown(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(
          false
        );
      }
    }


    document.addEventListener(
      "mousedown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
  ]);


  return (
    <div
      ref={
        rootRef
      }
      style={{
        position:
          "relative",

        flexShrink:
          0,
      }}
    >
      <button
        type="button"
        aria-label={`Settings for ${courseName}`}
        aria-expanded={
          open
        }
        title={`${courseName} settings`}
        onClick={() =>
          setOpen(
            (
              current
            ) =>
              !current
          )
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
            28,

          height:
            28,

          padding:
            0,

          display:
            "grid",

          placeItems:
            "center",

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            open
              ? accent
              : hovered
                ? theme.controlSelectedBorder
                : theme.borderStandard,

          borderRadius:
            5,

          background:
            open
              ? `color-mix(
                  in srgb,
                  ${accent} 14%,
                  ${theme.controlBg}
                )`
              : hovered
                ? theme.controlBgHover
                : theme.controlBg,

          color:
            open
              ? accent
              : theme.textSecondary,

          cursor:
            "pointer",

          transition:
            [
              "background 120ms ease",
              "border-color 120ms ease",
              "color 120ms ease",
            ].join(
              ", "
            ),
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path
            d="M6.9 1.8h2.2l.4 1.5c.4.1.8.3 1.1.5l1.4-.7 1.5 1.5-.7 1.4c.2.4.4.7.5 1.1l1.5.4v2.2l-1.5.4c-.1.4-.3.8-.5 1.1l.7 1.4-1.5 1.5-1.4-.7c-.4.2-.7.4-1.1.5l-.4 1.5H6.9l-.4-1.5c-.4-.1-.8-.3-1.1-.5l-1.4.7-1.5-1.5.7-1.4c-.2-.4-.4-.7-.5-1.1l-1.5-.4V7.5l1.5-.4c.1-.4.3-.8.5-1.1l-.7-1.4L4 3.1l1.4.7c.4-.2.7-.4 1.1-.5l.4-1.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          <circle
            cx="8"
            cy="8.6"
            r="2.1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>


      {open ? (
        <div
          role="dialog"
          aria-label={`${courseName} settings`}
          style={{
            position:
              "absolute",

            top:
              34,

            right:
              0,

            zIndex:
              80,

            width:
              292,

            overflow:
              "hidden",

            borderWidth:
              1,

            borderStyle:
              "solid",

            borderColor:
              theme.borderStandard,

            borderRadius:
              6,

            background:
              theme.bgElevated,

            boxShadow:
              theme.shadowStrong,
          }}
        >
          <div
            style={{
              minHeight:
                42,

              padding:
                "0 10px",

              boxSizing:
                "border-box",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                10,

              borderBottomWidth:
                1,

              borderBottomStyle:
                "solid",

              borderBottomColor:
                theme.borderStandard,
            }}
          >
            <div
              style={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                color:
                  theme.textPrimary,

                fontSize:
                  12,

                fontWeight:
                  650,

                whiteSpace:
                  "nowrap",

                textOverflow:
                  "ellipsis",
              }}
            >
              {courseName} settings
            </div>


            <button
              type="button"
              aria-label="Close settings"
              onClick={() =>
                setOpen(
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

                display:
                  "grid",

                placeItems:
                  "center",

                borderWidth:
                  0,

                borderStyle:
                  "solid",

                borderColor:
                  "transparent",

                borderRadius:
                  4,

                background:
                  "transparent",

                color:
                  theme.textMuted,

                cursor:
                  "pointer",

                fontSize:
                  17,

                lineHeight:
                  1,
              }}
            >
              ×
            </button>
          </div>


          <div
            style={{
              padding:
                10,

              display:
                "grid",

              gap:
                12,
            }}
          >
            <div
              style={{
                display:
                  "grid",

                gap:
                  7,
              }}
            >
              <div
                style={{
                  color:
                    theme.textSecondary,

                  fontSize:
                    11,

                  fontWeight:
                    600,
                }}
              >
                Family colour
              </div>


              <div
                style={{
                  display:
                    "grid",

                  gridTemplateColumns:
                    "repeat(6, 1fr)",

                  gap:
                    6,
                }}
              >
                {COURSE_COLOUR_PRESETS.map(
                  (
                    preset
                  ) => {
                    const selected =
                      preset.hex
                        .toLowerCase() ===
                      accent
                        .toLowerCase();


                    return (
                      <button
                        key={
                          preset.label
                        }
                        type="button"
                        title={
                          preset.label
                        }
                        aria-label={`Use ${preset.label}`}
                        aria-pressed={
                          selected
                        }
                        onClick={() =>
                          onColourChange(
                            preset.hex
                          )
                        }
                        style={{
                          width:
                            "100%",

                          aspectRatio:
                            "1",

                          padding:
                            3,

                          display:
                            "grid",

                          placeItems:
                            "center",

                          borderWidth:
                            selected
                              ? 2
                              : 1,

                          borderStyle:
                            "solid",

                          borderColor:
                            selected
                              ? theme.textPrimary
                              : theme.borderStandard,

                          borderRadius:
                            5,

                          background:
                            theme.controlBg,

                          cursor:
                            "pointer",

                          boxSizing:
                            "border-box",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width:
                              "100%",

                            height:
                              "100%",

                            display:
                              "block",

                            borderRadius:
                              3,

                            background:
                              preset.hex,
                          }}
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </div>


            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap:
                  10,
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
                <span
                  style={{
                    color:
                      theme.textSecondary,

                    fontSize:
                      11,

                    fontWeight:
                      600,
                  }}
                >
                  Custom
                </span>

                <span
                  style={{
                    color:
                      theme.textMuted,

                    fontSize:
                      9.5,

                    fontVariantNumeric:
                      "tabular-nums",
                  }}
                >
                  {accent.toUpperCase()}
                </span>
              </div>


              <input
                type="color"
                value={
                  accent
                }
                aria-label="Custom family colour"
                onChange={(
                  event
                ) =>
                  onColourChange(
                    event.target
                      .value
                  )
                }
                style={{
                  width:
                    42,

                  height:
                    30,

                  padding:
                    2,

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

                  cursor:
                    "pointer",
                }}
              />
            </div>


            <div
              style={{
                paddingTop:
                  9,

                borderTopWidth:
                  1,

                borderTopStyle:
                  "solid",

                borderTopColor:
                  theme.borderStandard,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap:
                  10,
              }}
            >
              <span
                style={{
                  maxWidth:
                    170,

                  color:
                    theme.textMuted,

                  fontSize:
                    9.5,

                  lineHeight:
                    1.35,
                }}
              >
                More course-family options can be added here later.
              </span>


              <button
                type="button"
                onClick={
                  onResetColour
                }
                style={{
                  height:
                    28,

                  padding:
                    "0 8px",

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
                    theme.textSecondary,

                  cursor:
                    "pointer",

                  fontFamily:
                    "inherit",

                  fontSize:
                    10,

                  fontWeight:
                    600,

                  whiteSpace:
                    "nowrap",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}