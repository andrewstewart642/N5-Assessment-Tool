import {
  useEffect,
  useRef,
  useState,
} from "react";

import PaperContent from "@/app/UI/Documents/Components/PaperContent";

import type {
  Concept,
  Skill,
  StandardFilter,
  ThinkingTypeFilter,
} from "@/app/Assessments/AssessmentTypes";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import type {
  QuestionSelectionFilters,
} from "@/app/Assessments/Questions/Selection/QuestionSelectionTypes";

import type { AppTheme } from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import type {
  ConstraintPillId,
} from "../01-SkillsFilters/SkillsFilters";

import {
  conceptSelectionText,
  getConceptRestriction,
} from "./ConceptSelectionRules";

const SOURCE_ORDERED_CONCEPT_SKILL_IDS =
  new Set([
    "num-n2-indices",
    "alg-a07-linear-equations",
  ]);

function conceptLabelParts(
  concept: Concept
): PaperPart[] {
  const short =
    concept.shortLabel?.trim();

  const rawLabel =
    concept.label.trim();

  const fallbackLabel =
    rawLabel.startsWith(
      concept.code
    )
      ? rawLabel
          .slice(
            concept.code.length
          )
          .trim()
      : rawLabel;

  const labelText =
    short ||
    fallbackLabel ||
    rawLabel;

  const parts: PaperPart[] = [
    {
      kind: "text",
      value: labelText,
    },
  ];

  if (concept.badge?.trim()) {
    parts.push({
      kind: "text",
      value: " · ",
    });

    parts.push({
      kind: "math",
      latex:
        concept.badge.trim(),
    });
  }

  return parts;
}

function ConceptIdentity({
  concept,
}: {
  concept: Concept;
}) {
  return (
    <span
      style={{
        width: "100%",

        minWidth: 0,

        display: "grid",

        gridTemplateColumns:
          "6.5ch minmax(0, 1fr)",

        columnGap: 10,

        alignItems:
          "baseline",
      }}
    >
      <span
        style={{
          whiteSpace:
            "nowrap",
        }}
      >
        {concept.code}
      </span>

      <span
        style={{
          minWidth: 0,

          overflow:
            "hidden",

          whiteSpace:
            "nowrap",

          textOverflow:
            "ellipsis",
        }}
      >
        <PaperContent
          parts={
            conceptLabelParts(
              concept
            )
          }
        />
      </span>
    </span>
  );
}

function conceptsForDisplay(
  skill: Skill,
  rankedConcepts: Concept[]
): Concept[] {
  if (
    !SOURCE_ORDERED_CONCEPT_SKILL_IDS.has(
      skill.id
    )
  ) {
    return rankedConcepts;
  }

  const sourceOrder =
    new Map(
      skill.concepts.map(
        (concept, index) => [
          concept.id,
          index,
        ]
      )
    );

  return [
    ...rankedConcepts,
  ].sort(
    (first, second) =>
      (sourceOrder.get(
        first.id
      ) ??
        Number.MAX_SAFE_INTEGER) -
      (sourceOrder.get(
        second.id
      ) ??
        Number.MAX_SAFE_INTEGER)
  );
}

type ConceptSelectorProps = {
  skill: Skill;

  rankedConcepts:
    Concept[];

  currentIndex:
    number;

  selected:
    Concept | undefined;

  standardFilter:
    StandardFilter;

  thinkingTypeFilter:
    ThinkingTypeFilter;

  targetMarks:
    number;

  selectionFilters:
    QuestionSelectionFilters;

  setConceptIndex: (
    skillId: string,
    nextIndex: number
  ) => void;

  onConstraintBlocked: (
    constraint:
      ConstraintPillId
  ) => void;

  theme:
    AppTheme;
};

export default function ConceptSelector({
  skill,
  rankedConcepts,
  currentIndex,
  selected,
  standardFilter,
  thinkingTypeFilter,
  targetMarks,
  selectionFilters,
  setConceptIndex,
  onConstraintBlocked,
  theme,
}: ConceptSelectorProps) {
  const [
    dropdownOpen,
    setDropdownOpen,
  ] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const displayConcepts =
    conceptsForDisplay(
      skill,
      rankedConcepts
    );

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    function handleMouseDown(
      event: MouseEvent
    ) {
      if (
        !dropdownRef.current
      ) {
        return;
      }

      if (
        dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        return;
      }

      setDropdownOpen(false);
    }

    document.addEventListener(
      "mousedown",
      handleMouseDown
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      );
  }, [dropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      style={{
        position:
          "relative",

        minWidth: 0,

        overflow:
          "visible",
      }}
    >
      <button
        type="button"
        onClick={() =>
          rankedConcepts.length >
            0 &&
          setDropdownOpen(
            (previous) =>
              !previous
          )
        }
        disabled={
          rankedConcepts.length ===
          0
        }
        style={{
          width: "100%",
          height: 30,

          borderRadius: 5,

          border:
            `1px solid ${theme.borderStandard}`,

          background:
            theme.controlBg,

          color:
            theme.textPrimary,

          boxSizing:
            "border-box",

          padding:
            "0 28px 0 8px",

          display:
            "flex",

          alignItems:
            "center",

          minWidth: 0,

          overflow:
            "hidden",

          cursor:
            rankedConcepts.length ===
            0
              ? "default"
              : "pointer",

          opacity:
            rankedConcepts.length ===
            0
              ? 0.62
              : 1,

          position:
            "relative",

          transition:
            "background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",

          boxShadow:
            dropdownOpen
              ? theme.shadow
              : "none",
        }}
        title={
          selected
            ? conceptSelectionText(
                selected
              )
            : "Select skill concept"
        }
      >
        <span
          style={{
            flex:
              "1 1 auto",

            minWidth: 0,

            overflow:
              "hidden",

            whiteSpace:
              "nowrap",

            textOverflow:
              "ellipsis",

            fontSize:
              UI_TYPO.sizeSm,

            lineHeight: 1,

            fontWeight:
              UI_TYPO.weightRegular,
          }}
        >
          {selected ? (
            <ConceptIdentity
              concept={
                selected
              }
            />
          ) : (
            <span
              style={{
                color:
                  theme.textMuted,
              }}
            >
              Select skill concept
            </span>
          )}
        </span>

        <span
          aria-hidden="true"
          style={{
            position:
              "absolute",

            right: 9,

            top: "50%",

            transform:
              "translateY(-50%)",

            width: 14,
            height: 14,

            display:
              "grid",

            placeItems:
              "center",

            color:
              theme.textMuted,

            pointerEvents:
              "none",
          }}
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 8 8"
            aria-hidden="true"
            style={{
              display:
                "block",
            }}
          >
            <path
              d={
                dropdownOpen
                  ? "M1 5 L4 2 L7 5"
                  : "M1 2 L4 5 L7 2"
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {dropdownOpen ? (
        <div
          className="hover-scroll"
          style={{
            position:
              "relative",

            zIndex: 80,

            width:
              "100%",

            maxWidth:
              "100%",

            maxHeight: 220,

            overflowY:
              "auto",

            marginTop: 4,

            borderRadius: 6,

            border:
              `1px solid ${theme.borderStandard}`,

            background:
              theme.bgElevated,

            boxShadow:
              theme.shadow,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setConceptIndex(
                skill.id,
                -1
              );

              setDropdownOpen(
                false
              );
            }}
            style={{
              width: "100%",

              border:
                "none",

              borderBottom:
                displayConcepts.length
                  ? `1px solid ${theme.borderStandard}`
                  : "none",

              background:
                currentIndex ===
                -1
                  ? theme.controlBgHover
                  : "transparent",

              color:
                theme.textMuted,

              textAlign:
                "left",

              padding:
                "7px 8px",

              cursor:
                "pointer",

              display:
                "flex",

              alignItems:
                "center",

              minWidth: 0,

              fontSize:
                UI_TYPO.sizeSm,

              fontWeight:
                UI_TYPO.weightRegular,

              lineHeight: 1,
            }}
            title="Clear selected concept"
          >
            Select skill concept
          </button>

          {displayConcepts.map(
            (
              concept,
              displayIndex
            ) => {
              const rankedIndex =
                rankedConcepts.findIndex(
                  (candidate) =>
                    candidate.id ===
                    concept.id
                );

              const active =
                rankedIndex ===
                currentIndex;

              const restriction =
                getConceptRestriction(
                  {
                    skill,
                    concept,

                    standardFilter,
                    thinkingTypeFilter,

                    targetMarks,
                    selectionFilters,
                  }
                );

              const eligible =
                restriction ===
                null;

              return (
                <button
                  key={
                    concept.id
                  }
                  type="button"
                  onClick={() => {
                    if (
                      rankedIndex < 0
                    ) {
                      return;
                    }

                    setConceptIndex(
                      skill.id,
                      rankedIndex
                    );

                    setDropdownOpen(
                      false
                    );

                    if (
                      restriction
                    ) {
                      onConstraintBlocked(
                        restriction.constraint
                      );
                    }
                  }}
                  style={{
                    width:
                      "100%",

                    border:
                      "none",

                    borderBottom:
                      displayIndex ===
                      displayConcepts.length -
                        1
                        ? "none"
                        : `1px solid ${theme.borderStandard}`,

                    background:
                      active
                        ? theme.controlBgHover
                        : "transparent",

                    color:
                      eligible
                        ? theme.textPrimary
                        : theme.textMuted,

                    opacity:
                      eligible
                        ? 1
                        : 0.62,

                    textAlign:
                      "left",

                    padding:
                      "7px 8px",

                    cursor:
                      "pointer",

                    display:
                      "grid",

                    gridTemplateColumns:
                      "minmax(0, 1fr) auto",

                    alignItems:
                      "center",

                    columnGap:
                      10,

                    minWidth: 0,
                  }}
                  title={
                    restriction
                      ? `${conceptSelectionText(
                          concept
                        )} — ${restriction.tag}`
                      : conceptSelectionText(
                          concept
                        )
                  }
                >
                  <span
                    style={{
                      minWidth: 0,

                      overflow:
                        "hidden",

                      whiteSpace:
                        "nowrap",

                      textOverflow:
                        "ellipsis",

                      fontSize:
                        UI_TYPO.sizeSm,

                      lineHeight: 1,
                    }}
                  >
                    <ConceptIdentity
                      concept={
                        concept
                      }
                    />
                  </span>

                  {restriction ? (
                    <span
                      style={{
                        fontSize:
                          UI_TYPO.sizeXs,

                        lineHeight:
                          1,

                        color:
                          theme.textSecondary,

                        whiteSpace:
                          "nowrap",

                        border:
                          `1px solid ${theme.borderStandard}`,

                        borderRadius:
                          4,

                        padding:
                          "3px 6px",

                        background:
                          theme.controlBg,
                      }}
                    >
                      {
                        restriction.tag
                      }
                    </span>
                  ) : null}
                </button>
              );
            }
          )}
        </div>
      ) : null}
    </div>
  );
}
