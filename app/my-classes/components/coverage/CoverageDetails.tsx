"use client";

import { useMemo, useState } from "react";
import {
  getConceptBodyLines,
  getCoverageSkillById,
  getSkillTitle,
} from "./CoverageHelpers";

type Props = {
  selectedSkillId: string | null;
};

export default function CoverageDetails({ selectedSkillId }: Props) {
  const [expandedConceptCode, setExpandedConceptCode] = useState<string | null>(null);

  const selectedEntry = useMemo(
    () => getCoverageSkillById(selectedSkillId),
    [selectedSkillId]
  );

  if (!selectedEntry) {
    return (
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          background: "rgba(255,255,255,0.03)",
          padding: 24,
          minHeight: 320,
        }}
      />
    );
  }

  const { skill } = selectedEntry;
  const skillTitle = getSkillTitle(skill);
  const concepts = Array.isArray(skill.concepts) ? skill.concepts : [];

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        background: "rgba(255,255,255,0.03)",
        padding: 24,
        display: "grid",
        gap: 18,
        minHeight: 320,
        alignContent: "start",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 8,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#e5eef8",
          }}
        >
          Skill Details
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.35,
            color: "rgba(229,238,248,0.90)",
          }}
        >
          {skillTitle}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "rgba(229,238,248,0.84)",
          }}
        >
          Course Spec Guidance
        </div>

        {concepts.length > 0 ? (
          <div
            className="coverage-scroll"
            style={{
              display: "grid",
              gap: 10,
              maxHeight: 520,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {concepts.map((concept, index) => {
              const code = concept.code?.trim() || `Concept ${index + 1}`;
              const title =
                concept.shortLabel?.trim() ||
                concept.label?.trim() ||
                "Unnamed concept";

              const isExpanded = expandedConceptCode === code;
              const bodyLines = getConceptBodyLines(concept);

              return (
                <div
                  key={`${code}-${index}`}
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.025)",
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedConceptCode((current) =>
                        current === code ? null : code
                      )
                    }
                    style={{
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      padding: "14px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0, 1fr) auto",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 10,
                          flexWrap: "wrap",
                          minWidth: 0,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            color: "#e5eef8",
                          }}
                        >
                          {code}
                        </div>

                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: "rgba(229,238,248,0.88)",
                          }}
                        >
                          {title}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          lineHeight: 1,
                          color: "rgba(229,238,248,0.62)",
                          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 140ms ease",
                        }}
                      >
                        ▸
                      </div>
                    </div>
                  </button>

                  {isExpanded ? (
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        padding: "14px 16px 16px 16px",
                        display: "grid",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          color: "rgba(229,238,248,0.78)",
                        }}
                      >
                        Example / expected forms
                      </div>

                      {bodyLines.map((line, lineIndex) => (
                        <div
                          key={`${code}-line-${lineIndex}`}
                          style={{
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 12,
                            padding: "11px 12px",
                            background: "rgba(255,255,255,0.02)",
                            fontSize: 13,
                            lineHeight: 1.45,
                            color: "rgba(229,238,248,0.72)",
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.45,
              color: "rgba(229,238,248,0.62)",
            }}
          >
            No extra concept detail is available for this skill yet.
          </div>
        )}
      </div>
    </div>
  );
}