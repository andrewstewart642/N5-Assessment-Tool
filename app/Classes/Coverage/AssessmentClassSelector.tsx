import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SchoolClass,
} from "@/app/Classes/ClassData";

import type {
  Theme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

type Props = {
  levelLabel:
    string | null;

  classes:
    SchoolClass[];

  selectedClassIds:
    string[];

  useCompleteCourseCoverage:
    boolean;

  onToggleClass: (
    classId: string
  ) => void;

  onSelectCompleteCourseCoverage:
    () => void;

  label?:
    string;

  emptyText?:
    string;

  disabledText?:
    string;

  completeCoverageSummaryText?:
    string;

  hideHelperText?:
    boolean;

  compact?:
    boolean;

  width?:
    number | string;

  dropdownWidth?:
    number | string;

  zIndex?:
    number;

  theme?:
    Theme;
};

const CONTROL_HEIGHT =
  32;

function getSummaryText({
  classes,
  selectedClassIds,
  useCompleteCourseCoverage,
  completeCoverageSummaryText,
}: {
  classes:
    SchoolClass[];

  selectedClassIds:
    string[];

  useCompleteCourseCoverage:
    boolean;

  completeCoverageSummaryText:
    string;
}): string {
  if (
    useCompleteCourseCoverage
  ) {
    return completeCoverageSummaryText;
  }

  if (
    selectedClassIds.length ===
    0
  ) {
    return "Select classes";
  }

  const selectedClasses =
    classes.filter(
      (
        item
      ) =>
        selectedClassIds.includes(
          item.id
        )
    );

  if (
    selectedClasses.length ===
    1
  ) {
    return selectedClasses[0]
      .name;
  }

  if (
    selectedClasses.length ===
    2
  ) {
    return `${selectedClasses[0].name}, ${selectedClasses[1].name}`;
  }

  return `${selectedClasses.length} classes selected`;
}

function Chevron({
  open,
}: {
  open:
    boolean;
}) {
  return (
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      aria-hidden="true"
      style={{
        display:
          "block",
      }}
    >
      <path
        d={
          open
            ? "M1 4 L4 1 L7 4"
            : "M1 1 L4 4 L7 1"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClassCoverageSelect({
  levelLabel,
  classes,
  selectedClassIds,
  useCompleteCourseCoverage,

  onToggleClass,
  onSelectCompleteCourseCoverage,

  label =
    "Classes sitting this assessment",

  emptyText =
    "Select classes",

  disabledText =
    "Choose level first",

  completeCoverageSummaryText =
    "Complete course coverage",

  hideHelperText =
    false,

  compact =
    false,

  width =
    "100%",

  dropdownWidth =
    "100%",

  zIndex =
    20,

  theme,
}: Props) {
  const [
    open,
    setOpen,
  ] =
    useState(false);

  const [
    triggerHovered,
    setTriggerHovered,
  ] =
    useState(false);

  const [
    triggerFocused,
    setTriggerFocused,
  ] =
    useState(false);

  const [
    hoveredOption,
    setHoveredOption,
  ] =
    useState<string | null>(
      null
    );

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    function handlePointerDown(
      event:
        MouseEvent
    ) {
      if (
        !wrapperRef.current
      ) {
        return;
      }

      if (
        wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        return;
      }

      setOpen(
        false
      );
    }

    function handleEscape(
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

    window.addEventListener(
      "mousedown",
      handlePointerDown
    );

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        handlePointerDown
      );

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const summaryText =
    useMemo(() => {
      const rawSummary =
        getSummaryText({
          classes,
          selectedClassIds,
          useCompleteCourseCoverage,
          completeCoverageSummaryText,
        });

      if (
        !useCompleteCourseCoverage &&
        selectedClassIds.length ===
          0
      ) {
        return emptyText;
      }

      return rawSummary;
    }, [
      classes,
      selectedClassIds,
      useCompleteCourseCoverage,
      completeCoverageSummaryText,
      emptyText,
    ]);

  const helperText =
    useMemo(() => {
      if (
        useCompleteCourseCoverage
      ) {
        return "Builder will show the full course tree.";
      }

      if (
        selectedClassIds.length >
        0
      ) {
        return "Builder will only show skills covered by all selected classes.";
      }

      return levelLabel
        ? "Choose one or more classes, or use complete course coverage."
        : "Choose a level first.";
    }, [
      levelLabel,
      selectedClassIds.length,
      useCompleteCourseCoverage,
    ]);

  const disabled =
    !levelLabel;

  const triggerActive =
    !disabled &&
    (
      triggerHovered ||
      triggerFocused ||
      open
    );

  const controlRadius =
    compact
      ? 6
      : 10;

  const menuRadius =
    compact
      ? 6
      : 16;

  const rowRadius =
    compact
      ? 5
      : 12;

  const labelStyle:
    React.CSSProperties =
    compact
      ? {
          ...UI_TEXT.sectionLabel,

          color:
            theme?.textMuted ??
            "rgba(214,227,243,0.72)",

          whiteSpace:
            "nowrap",
        }
      : {
          fontSize:
            12,

          fontWeight:
            UI_TYPO.weightMedium,

          color:
            theme?.textMuted ??
            "rgba(214,227,243,0.72)",

          lineHeight:
            1.2,

          whiteSpace:
            "nowrap",
        };

  return (
    <div
      ref={
        wrapperRef
      }
      style={{
        display:
          "grid",

        gap:
          hideHelperText
            ? compact
              ? 6
              : 4
            : 6,

        position:
          "relative",

        width,

        minWidth:
          0,

        fontFamily:
          UI_TYPO.family,
      }}
    >
      <span
        style={
          labelStyle
        }
      >
        {label}
      </span>

      <button
        type="button"
        disabled={
          disabled
        }
        onClick={() => {
          if (
            !levelLabel
          ) {
            return;
          }

          setOpen(
            (
              previous
            ) =>
              !previous
          );
        }}
        onFocus={() =>
          setTriggerFocused(
            true
          )
        }
        onBlur={() =>
          setTriggerFocused(
            false
          )
        }
        onMouseEnter={() =>
          setTriggerHovered(
            true
          )
        }
        onMouseLeave={() =>
          setTriggerHovered(
            false
          )
        }
        style={{
          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            8,

          width:
            "100%",

          minWidth:
            0,

          height:
            CONTROL_HEIGHT,

          padding:
            compact
              ? "0 8px"
              : "0 10px",

          boxSizing:
            "border-box",

          overflow:
            "hidden",

          borderRadius:
            controlRadius,

          border:
            `1px solid ${
              triggerActive
                ? theme?.controlSelectedBorder ??
                  "#60a5fa"
                : theme?.borderStandard ??
                  "rgba(255,255,255,0.10)"
            }`,

          background:
            triggerActive
              ? theme?.controlBgHover ??
                "rgba(255,255,255,0.04)"
              : theme?.controlBg ??
                "rgba(255,255,255,0.02)",

          color:
            disabled
              ? theme?.textMuted ??
                "rgba(214,227,243,0.45)"
              : theme?.textPrimary ??
                "#f7fbff",

          cursor:
            disabled
              ? "not-allowed"
              : "pointer",

          textAlign:
            "left",

          fontFamily:
            UI_TYPO.family,

          fontSize:
            compact
              ? UI_TYPO.sizeBase
              : 13,

          fontWeight:
            compact
              ? UI_TYPO.weightMedium
              : UI_TYPO.weightSemibold,

          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease",
        }}
      >
        <span
          style={{
            display:
              "block",

            flex:
              "1 1 auto",

            minWidth:
              0,

            overflow:
              "hidden",

            textOverflow:
              "ellipsis",

            whiteSpace:
              "nowrap",
          }}
        >
          {levelLabel
            ? summaryText
            : disabledText}
        </span>

        <span
          style={{
            color:
              theme?.textMuted ??
              "rgba(214,227,243,0.72)",

            flexShrink:
              0,
          }}
        >
          <Chevron
            open={
              open
            }
          />
        </span>
      </button>

      {!hideHelperText ? (
        <div
          style={{
            fontSize:
              12,

            lineHeight:
              1.4,

            color:
              theme?.textMuted ??
              "rgba(214,227,243,0.58)",
          }}
        >
          {helperText}
        </div>
      ) : null}

      {open &&
      levelLabel ? (
        <div
          style={{
            position:
              "absolute",

            top:
              hideHelperText
                ? "calc(100% + 6px)"
                : "100%",

            left:
              0,

            width:
              dropdownWidth,

            marginTop:
              hideHelperText
                ? 0
                : 8,

            boxSizing:
              "border-box",

            border:
              `1px solid ${
                theme?.borderStandard ??
                "rgba(255,255,255,0.10)"
              }`,

            borderRadius:
              menuRadius,

            background:
              theme?.bgElevated ??
              "#121a24",

            boxShadow:
              compact
                ? theme?.shadow ??
                  "0 8px 20px rgba(0,0,0,0.22)"
                : theme?.shadowStrong ??
                  "0 18px 36px rgba(0,0,0,0.28)",

            padding:
              compact
                ? 4
                : 10,

            zIndex,

            display:
              "grid",

            gap:
              compact
                ? 2
                : 8,
          }}
        >
          <div
            className="hover-scroll"
            style={{
              maxHeight:
                compact
                  ? 220
                  : 260,

              overflowY:
                "auto",

              display:
                "grid",

              gap:
                compact
                  ? 2
                  : 8,
            }}
          >
            {classes.length >
            0 ? (
              classes.map(
                (
                  schoolClass
                ) => {
                  const checked =
                    selectedClassIds.includes(
                      schoolClass.id
                    );

                  const hovered =
                    hoveredOption ===
                    schoolClass.id;

                  return (
                    <button
                      key={
                        schoolClass.id
                      }
                      type="button"
                      onClick={() =>
                        onToggleClass(
                          schoolClass.id
                        )
                      }
                      onMouseEnter={() =>
                        setHoveredOption(
                          schoolClass.id
                        )
                      }
                      onMouseLeave={() =>
                        setHoveredOption(
                          null
                        )
                      }
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          compact
                            ? "16px minmax(0, 1fr)"
                            : "18px minmax(0, 1fr)",

                        alignItems:
                          "start",

                        gap:
                          compact
                            ? 8
                            : 10,

                        width:
                          "100%",

                        boxSizing:
                          "border-box",

                        border:
                          `1px solid ${
                            checked
                              ? theme?.controlSelectedBorder ??
                                "#60a5fa"
                              : compact
                                ? "transparent"
                                : theme?.borderStandard ??
                                  "rgba(255,255,255,0.08)"
                          }`,

                        borderRadius:
                          rowRadius,

                        background:
                          checked
                            ? theme?.controlSelectedBg ??
                              "rgba(37,99,235,0.16)"
                            : hovered
                              ? theme?.controlBgHover ??
                                "rgba(255,255,255,0.04)"
                              : compact
                                ? "transparent"
                                : theme?.controlBg ??
                                  "rgba(255,255,255,0.03)",

                        padding:
                          compact
                            ? "7px 8px"
                            : "10px 12px",

                        cursor:
                          "pointer",

                        textAlign:
                          "left",

                        transition:
                          "background 0.15s ease, border-color 0.15s ease",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width:
                            compact
                              ? 14
                              : 16,

                          height:
                            compact
                              ? 14
                              : 16,

                          borderRadius:
                            compact
                              ? 3
                              : 4,

                          border:
                            `1.5px solid ${
                              checked
                                ? theme?.controlSelectedBorder ??
                                  "#93c5fd"
                                : theme?.textMuted ??
                                  "rgba(214,227,243,0.50)"
                            }`,

                          background:
                            checked
                              ? theme?.controlSelectedBorder ??
                                "#60a5fa"
                              : "transparent",

                          boxSizing:
                            "border-box",

                          marginTop:
                            1,
                        }}
                      />

                      <span
                        style={{
                          minWidth:
                            0,

                          display:
                            "grid",

                          gap:
                            compact
                              ? 2
                              : 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize:
                              compact
                                ? UI_TYPO.sizeBase
                                : 14,

                            fontWeight:
                              UI_TYPO.weightSemibold,

                            lineHeight:
                              1.2,

                            color:
                              checked
                                ? theme?.textPrimary ??
                                  "#eaf3ff"
                                : theme?.textSecondary ??
                                  "#d6e3f3",
                          }}
                        >
                          {
                            schoolClass.name
                          }
                        </span>

                        <span
                          style={{
                            fontSize:
                              compact
                                ? UI_TYPO.sizeMeta
                                : 12,

                            fontWeight:
                              UI_TYPO.weightRegular,

                            lineHeight:
                              1.3,

                            color:
                              theme?.textMuted ??
                              "rgba(214,227,243,0.60)",
                          }}
                        >
                          {[
                            schoolClass.level,
                            schoolClass.teacher,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " • "
                            ) ||
                            schoolClass.course}
                        </span>
                      </span>
                    </button>
                  );
                }
              )
            ) : (
              <div
                style={{
                  padding:
                    compact
                      ? "8px 9px"
                      : "12px 14px",

                  fontSize:
                    compact
                      ? UI_TYPO.sizeMeta
                      : 13,

                  color:
                    theme?.textMuted ??
                    "rgba(214,227,243,0.58)",
                }}
              >
                No classes found for this level yet.
              </div>
            )}
          </div>

          <div
            style={{
              borderTop:
                `1px solid ${
                  theme?.borderStandard ??
                  "rgba(255,255,255,0.08)"
                }`,

              paddingTop:
                compact
                  ? 4
                  : 8,
            }}
          >
            <button
              type="button"
              onClick={
                onSelectCompleteCourseCoverage
              }
              onMouseEnter={() =>
                setHoveredOption(
                  "__complete__"
                )
              }
              onMouseLeave={() =>
                setHoveredOption(
                  null
                )
              }
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  compact
                    ? "16px minmax(0, 1fr)"
                    : "18px minmax(0, 1fr)",

                alignItems:
                  "start",

                gap:
                  compact
                    ? 8
                    : 10,

                width:
                  "100%",

                boxSizing:
                  "border-box",

                border:
                  `1px solid ${
                    useCompleteCourseCoverage
                      ? theme?.controlSelectedBorder ??
                        "#60a5fa"
                      : compact
                        ? "transparent"
                        : theme?.borderStandard ??
                          "rgba(255,255,255,0.08)"
                  }`,

                borderRadius:
                  rowRadius,

                background:
                  useCompleteCourseCoverage
                    ? theme?.controlSelectedBg ??
                      "rgba(37,99,235,0.16)"
                    : hoveredOption ===
                        "__complete__"
                      ? theme?.controlBgHover ??
                        "rgba(255,255,255,0.04)"
                      : compact
                        ? "transparent"
                        : theme?.controlBg ??
                          "rgba(255,255,255,0.03)",

                padding:
                  compact
                    ? "7px 8px"
                    : "10px 12px",

                cursor:
                  "pointer",

                textAlign:
                  "left",

                transition:
                  "background 0.15s ease, border-color 0.15s ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width:
                    compact
                      ? 14
                      : 16,

                  height:
                    compact
                      ? 14
                      : 16,

                  borderRadius:
                    999,

                  border:
                    `1.5px solid ${
                      useCompleteCourseCoverage
                        ? theme?.controlSelectedBorder ??
                          "#93c5fd"
                        : theme?.textMuted ??
                          "rgba(214,227,243,0.50)"
                    }`,

                  background:
                    useCompleteCourseCoverage
                      ? theme?.controlSelectedBorder ??
                        "#60a5fa"
                      : "transparent",

                  boxSizing:
                    "border-box",

                  marginTop:
                    1,
                }}
              />

              <span
                style={{
                  minWidth:
                    0,

                  display:
                    "grid",

                  gap:
                    compact
                      ? 2
                      : 4,
                }}
              >
                <span
                  style={{
                    fontSize:
                      compact
                        ? UI_TYPO.sizeBase
                        : 14,

                    fontWeight:
                      UI_TYPO.weightSemibold,

                    lineHeight:
                      1.2,

                    color:
                      useCompleteCourseCoverage
                        ? theme?.textPrimary ??
                          "#eaf3ff"
                        : theme?.textSecondary ??
                          "#d6e3f3",
                  }}
                >
                  Show complete course coverage
                </span>

                <span
                  style={{
                    fontSize:
                      compact
                        ? UI_TYPO.sizeMeta
                        : 12,

                    fontWeight:
                      UI_TYPO.weightRegular,

                    lineHeight:
                      1.3,

                    color:
                      theme?.textMuted ??
                      "rgba(214,227,243,0.60)",
                  }}
                >
                  Ignore class coverage filters and show the full course tree.
                </span>
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}