import {
  useEffect,
} from "react";

import type {
  CSSProperties,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  COURSE_OPTION_ENTRIES,
  LEVEL_OPTIONS,
  type CourseOption,
  type LevelOption,
} from "../ClassData";


type Props = {
  open:
    boolean;

  className:
    string;

  setClassName:
    (
      value:
        string
    ) => void;

  course:
    CourseOption;

  setCourse:
    (
      value:
        CourseOption
    ) => void;

  level:
    LevelOption;

  setLevel:
    (
      value:
        LevelOption
    ) => void;

  teacher:
    string;

  setTeacher:
    (
      value:
        string
    ) => void;

  onClose:
    () => void;

  onCreate:
    () => void;

  theme:
    AppTheme;
};


export default function AddClassModal({
  open,
  className,
  setClassName,
  course,
  setCourse,
  level,
  setLevel,
  teacher,
  setTeacher,
  onClose,
  onCreate,
  theme,
}: Props) {
  useEffect(() => {
    if (
      !open
    ) {
      return;
    }


    function handleEscape(
      event:
        KeyboardEvent
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    }


    window.addEventListener(
      "keydown",
      handleEscape
    );


    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [
    open,
    onClose,
  ]);


  if (
    !open
  ) {
    return null;
  }


  const canCreate =
    className.trim()
      .length >
    0;


  const labelStyle:
    CSSProperties = {
      display:
        "grid",

      gap:
        5,

      color:
        theme.textSecondary,

      fontSize:
        11,

      fontWeight:
        600,

      lineHeight:
        1.3,
    };


  const inputStyle:
    CSSProperties = {
      width:
        "100%",

      height:
        32,

      padding:
        "0 9px",

      boxSizing:
        "border-box",

      borderWidth:
        1,

      borderStyle:
        "solid",

      borderColor:
        theme.borderStandard,

      borderRadius:
        6,

      outline:
        "none",

      background:
        theme.controlBg,

      color:
        theme.textPrimary,

      fontFamily:
        "inherit",

      fontSize:
        12,
    };


  return (
    <div
      role="presentation"
      onMouseDown={
        onClose
      }
      style={{
        position:
          "fixed",

        inset:
          0,

        zIndex:
          2000,

        padding:
          24,

        boxSizing:
          "border-box",

        display:
          "grid",

        placeItems:
          "center",

        background:
          theme.modalOverlay,
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-class-title"
        onMouseDown={(
          event
        ) =>
          event.stopPropagation()
        }
        style={{
          width:
            "min(440px, calc(100vw - 48px))",

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
        <header
          style={{
            minHeight:
              44,

            padding:
              "0 12px",

            boxSizing:
              "border-box",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              12,

            borderBottomWidth:
              1,

            borderBottomStyle:
              "solid",

            borderBottomColor:
              theme.borderStandard,
          }}
        >
          <div
            id="new-class-title"
            style={{
              color:
                theme.textPrimary,

              fontSize:
                14,

              fontWeight:
                650,
            }}
          >
            New class
          </div>


          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={
              onClose
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

              border:
                "none",

              borderRadius:
                5,

              background:
                "transparent",

              color:
                theme.textMuted,

              cursor:
                "pointer",

              fontFamily:
                "inherit",

              fontSize:
                18,

              lineHeight:
                1,
            }}
          >
            ×
          </button>
        </header>


        <div
          style={{
            padding:
              12,

            display:
              "grid",

            gap:
              12,
          }}
        >
          <label
            style={
              labelStyle
            }
          >
            Class name

            <input
              value={
                className
              }
              onChange={(
                event
              ) =>
                setClassName(
                  event.target
                    .value
                )
              }
              placeholder="e.g. 4A1"
              autoFocus
              style={
                inputStyle
              }
            />
          </label>


          <label
            style={
              labelStyle
            }
          >
            Course

            <select
              value={
                course
              }
              onChange={(
                event
              ) =>
                setCourse(
                  event.target
                    .value as
                    CourseOption
                )
              }
              style={
                inputStyle
              }
            >
              {COURSE_OPTION_ENTRIES.map(
                (
                  option
                ) => (
                  <option
                    key={
                      option.id
                    }
                    value={
                      option.classCourseLabel
                    }
                    disabled={
                      !option.isAvailable
                    }
                    style={{
                      background:
                        theme.bgElevated,

                      color:
                        theme.textPrimary,
                    }}
                  >
                    {option.isAvailable
                      ? option.classCourseLabel
                      : `${option.classCourseLabel} — coming later`}
                  </option>
                )
              )}
            </select>
          </label>


          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "minmax(0, 1fr) minmax(0, 1.45fr)",

              gap:
                10,
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              Level

              <select
                value={
                  level
                }
                onChange={(
                  event
                ) =>
                  setLevel(
                    event.target
                      .value as
                      LevelOption
                  )
                }
                style={
                  inputStyle
                }
              >
                {LEVEL_OPTIONS.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option ||
                        "blank"
                      }
                      value={
                        option
                      }
                      style={{
                        background:
                          theme.bgElevated,

                        color:
                          theme.textPrimary,
                      }}
                    >
                      {option ||
                        "Select"}
                    </option>
                  )
                )}
              </select>
            </label>


            <label
              style={
                labelStyle
              }
            >
              Teacher

              <input
                value={
                  teacher
                }
                onChange={(
                  event
                ) =>
                  setTeacher(
                    event.target
                      .value
                  )
                }
                placeholder="Optional"
                style={
                  inputStyle
                }
              />
            </label>
          </div>
        </div>


        <footer
          style={{
            minHeight:
              48,

            padding:
              "8px 12px",

            boxSizing:
              "border-box",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "flex-end",

            gap:
              6,

            borderTopWidth:
              1,

            borderTopStyle:
              "solid",

            borderTopColor:
              theme.borderStandard,

            background:
              theme.bgSurface,
          }}
        >
          <button
            type="button"
            onClick={
              onClose
            }
            style={{
              height:
                30,

              padding:
                "0 10px",

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
                11,

              fontWeight:
                600,
            }}
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={
              onCreate
            }
            disabled={
              !canCreate
            }
            style={{
              height:
                30,

              padding:
                "0 10px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                canCreate
                  ? theme.controlSelectedBorder
                  : theme.borderStandard,

              borderRadius:
                5,

              background:
                canCreate
                  ? theme.controlSelectedBg
                  : theme.controlBg,

              color:
                canCreate
                  ? theme.textPrimary
                  : theme.textMuted,

              cursor:
                canCreate
                  ? "pointer"
                  : "not-allowed",

              fontFamily:
                "inherit",

              fontSize:
                11,

              fontWeight:
                600,

              opacity:
                canCreate
                  ? 1
                  : 0.7,
            }}
          >
            Create class
          </button>
        </footer>
      </section>
    </div>
  );
}