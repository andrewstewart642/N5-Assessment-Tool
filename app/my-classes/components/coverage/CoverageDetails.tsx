"use client";

import { useMemo, useState } from "react";
import type { AppTheme } from "@/ui/AppTheme";
import {
  getConceptBodyLines,
  getCoverageSkillById,
  getSkillTitle,
} from "./CoverageHelpers";

type Props = {
  selectedSkillId: string | null;
  theme: AppTheme;
};

export default function CoverageDetails({
  selectedSkillId,
  theme,
}: Props) {
  const [expandedConceptCode, setExpandedConceptCode] = useState<string | null>(null);

  const selectedEntry = useMemo(
    () => getCoverageSkillById(selectedSkillId),
    [selectedSkillId]
  );

  if (!selectedEntry) {
    return (
      <div
        style={{
          border: `1px solid ${theme.borderSubtle}`,
          borderRadius: 22,
          background: theme.cardBg,
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
        border: `1px solid ${theme.borderSubtle}`,
        borderRadius: 22,
        background: theme.cardBg,
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
          borderBottom: `1px solid ${theme.borderSubtle}`,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: 1.15,
            color: theme.textPrimary,
          }}
        >
          Skill Details
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            lineHeight: 1.35,
            color: theme.textSecondary,
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
            color: theme.textSecondary,
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
                    border: `1px solid ${theme.borderSubtle}`,
                    borderRadius: 16,
                    background: theme.bgSurfaceAlt,
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
                            color: theme.textPrimary,
                          }}
                        >
                          {code}
                        </div>

                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: theme.textSecondary,
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
                          color: theme.textMuted,
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
                        borderTop: `1px solid ${theme.borderSubtle}`,
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
                          color: theme.textSecondary,
                        }}
                      >
                        Example / expected forms
                      </div>

                      {bodyLines.map((line, lineIndex) => (
                        <div
                          key={`${code}-line-${lineIndex}`}
                          style={{
                            border: `1px solid ${theme.borderSubtle}`,
                            borderRadius: 12,
                            padding: "11px 12px",
                            background: theme.controlBg,
                            fontSize: 13,
                            lineHeight: 1.45,
                            color: theme.textSecondary,
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
              color: theme.textMuted,
            }}
          >
            No extra concept detail is available for this skill yet.
          </div>
        )}
      </div>
    </div>
  );
}