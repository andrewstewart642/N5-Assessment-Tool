import {
  useState,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
  UI_TYPO,
} from "@/app/UI/Application/Typography/Typography";

import MetricGauge from "./MetricGauge";

import type {
  AssessmentMetricsSnapshot,
  BalanceMetricSnapshot,
  TopicMetricSnapshot,
} from "./MetricsTypes";

const METRICS_TEXT_SIZE =
  10;

const METRICS_META_SIZE =
  9;

function formatMarks(
  value: number
): string {
  if (
    Number.isInteger(value)
  ) {
    return `${value}`;
  }

  return value.toFixed(1);
}

function formatPct(
  value: number | null
): string {
  if (value === null) {
    return "—";
  }

  return `${value.toFixed(1)}%`;
}

function SectionTitle({
  children,
  theme,
}: {
  children: string;
  theme: AppTheme;
}) {
  return (
    <div
      style={{
        ...UI_TEXT.sectionLabel,
        color:
          theme.textSecondary,
        fontSize:
          METRICS_META_SIZE,
        lineHeight:
          "11px",
        letterSpacing:
          0.25,
        textTransform:
          "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function BalanceMetricRow({
  snapshot,
  theme,
}: {
  snapshot:
    BalanceMetricSnapshot;
  theme:
    AppTheme;
}) {
  return (
    <div
      style={{
        display:
          "grid",
        gap:
          2,
      }}
    >
      <SectionTitle
        theme={theme}
      >
        {snapshot.policy.label}
      </SectionTitle>

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          gap:
            8,
          color:
            theme.textSecondary,
          fontSize:
            METRICS_TEXT_SIZE,
          lineHeight:
            "12px",
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        <span>
          {snapshot.policy.leftLabel}{" "}
          {formatMarks(
            snapshot.leftMarks
          )} · {formatPct(
            snapshot.leftPct
          )}
        </span>

        <span>
          {snapshot.policy.rightLabel}{" "}
          {formatMarks(
            snapshot.rightMarks
          )} · {formatPct(
            snapshot.rightPct
          )}
        </span>
      </div>

      <MetricGauge
        mode="range"
        currentPct={
          snapshot.rightPct
        }
        minPct={
          snapshot.minRightPct
        }
        targetPct={
          snapshot.targetRightPct
        }
        maxPct={
          snapshot.maxRightPct
        }
        minLabel={
          `${snapshot.minRightPct.toFixed(0)}%`
        }
        targetLabel={
          `${snapshot.targetRightPct.toFixed(0)}%`
        }
        maxLabel={
          `${snapshot.maxRightPct.toFixed(0)}%`
        }
        theme={theme}
      />
    </div>
  );
}

function TopicMetricRow({
  snapshot,
  theme,
}: {
  snapshot:
    TopicMetricSnapshot;
  theme:
    AppTheme;
}) {
  return (
    <div
      style={{
        display:
          "grid",
        gap:
          1,
      }}
    >
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          gap:
            8,
          color:
            theme.textSecondary,
          fontSize:
            METRICS_TEXT_SIZE,
          lineHeight:
            "12px",
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        <span>
          {snapshot.policy.label}
        </span>

        <span>
          {formatMarks(
            snapshot.marks
          )} marks · {formatPct(
            snapshot.currentPct
          )}
        </span>
      </div>

      <MetricGauge
        mode="range"
        currentPct={
          snapshot.currentPct
        }
        minPct={
          snapshot.policy.minPct
        }
        targetPct={
          snapshot.policy.targetPct
        }
        maxPct={
          snapshot.policy.maxPct
        }
        minLabel={
          `${snapshot.minMarksAchievable}m`
        }
        targetLabel={
          `${snapshot.targetMarksAchievable}m`
        }
        maxLabel={
          `${snapshot.maxMarksAchievable}m`
        }
        theme={theme}
      />
    </div>
  );
}

function ExplorerChevron({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      aria-hidden="true"
      style={{
        display:
          "block",
        flex:
          "0 0 auto",
      }}
    >
      <path
        d={
          isOpen
            ? "M1 2 L4 5 L7 2"
            : "M2 1 L5 4 L2 7"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MetricsPanel({
  metrics,
  theme,
}: {
  metrics:
    AssessmentMetricsSnapshot;
  theme:
    AppTheme;
}) {
  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);

  const [
    headerHovered,
    setHeaderHovered,
  ] =
    useState(false);

  const invalidQuestionCount =
    new Set(
      metrics.validationIssues
        .map((issue) =>
          issue.questionId
        )
        .filter(
          (
            questionId
          ): questionId is string =>
            Boolean(questionId)
        )
    ).size;

  return (
    <section
      style={{
        border:
          `1px solid ${theme.borderStandard}`,
        borderTop:
          `1px solid ${theme.borderStandard}`,
        borderRadius:
          "0 0 6px 6px",
        background:
          theme.bgSurface,
        minHeight:
          0,
        overflow:
          "hidden",
        fontFamily:
          UI_TYPO.family,
        boxSizing:
          "border-box",
      }}
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) =>
              !current
          )
        }
        onMouseEnter={() =>
          setHeaderHovered(true)
        }
        onMouseLeave={() =>
          setHeaderHovered(false)
        }
        aria-expanded={isOpen}
        style={{
          width:
            "100%",
          height:
            30,
          border:
            "none",
          background:
            headerHovered
              ? theme.controlBgHover
              : "transparent",
          color:
            theme.textPrimary,
          display:
            "flex",
          alignItems:
            "center",
          gap:
            7,
          padding:
            "0 8px 0 7px",
          cursor:
            "pointer",
          fontFamily:
            UI_TYPO.family,
          boxSizing:
            "border-box",
          textAlign:
            "left",
          transition:
            "background 0.12s ease",
        }}
      >
        <span
          style={{
            width:
              12,
            height:
              12,
            display:
              "grid",
            placeItems:
              "center",
            color:
              theme.textSecondary,
          }}
        >
          <ExplorerChevron
            isOpen={isOpen}
          />
        </span>

        <span
          style={{
            ...UI_TEXT.controlTextStrong,
            fontSize:
              UI_TYPO.sizeMeta,
            color:
              theme.textPrimary,
            fontWeight:
              UI_TYPO.weightSemibold,
          }}
        >
          Metrics
        </span>
      </button>

      {isOpen ? (
        <div
          className="hover-scroll"
          style={{
            maxHeight:
              "min(200px, 26vh)",
            overflowY:
              "auto",
            borderTop:
              `1px solid ${theme.borderStandard}`,
            padding:
              "5px 12px 7px",
            display:
              "grid",
            gap:
              6,
            boxSizing:
              "border-box",
          }}
        >
          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              gap:
                8,
              color:
                theme.textMuted,
              fontSize:
                METRICS_META_SIZE,
              lineHeight:
                "11px",
              fontVariantNumeric:
                "tabular-nums",
            }}
          >
            <span>
              Overall assessment
            </span>

            <span>
              {formatMarks(
                metrics.assignedMarks
              )} / {formatMarks(
                metrics.finalTargetMarks
              )} marks
            </span>
          </div>

          <BalanceMetricRow
            snapshot={
              metrics.standard
            }
            theme={theme}
          />

          <BalanceMetricRow
            snapshot={
              metrics.thinking
            }
            theme={theme}
          />

          <div
            style={{
              display:
                "grid",
              gap:
                3,
            }}
          >
            <SectionTitle
              theme={theme}
            >
              Topic
            </SectionTitle>

            {metrics.topics.map(
              (topic) => (
                <TopicMetricRow
                  key={
                    topic.policy.topic
                  }
                  snapshot={topic}
                  theme={theme}
                />
              )
            )}
          </div>

          <div
            style={{
              display:
                "grid",
              gap:
                2,
            }}
          >
            <SectionTitle
              theme={theme}
            >
              {metrics.coverage.policy.label}
            </SectionTitle>

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap:
                  8,
                color:
                  theme.textSecondary,
                fontSize:
                  METRICS_TEXT_SIZE,
                lineHeight:
                  "12px",
                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              <span>
                {metrics.coverage.representedUnits} / {metrics.coverage.totalUnits} skills
              </span>

              <span>
                {metrics.coverage.percentage.toFixed(1)}%
              </span>
            </div>

            <MetricGauge
              mode="threshold"
              currentPct={
                metrics.coverage.percentage
              }
              thresholdPct={
                metrics.coverage.policy
                  .thresholdPct
              }
              thresholdLabel={
                `${metrics.coverage.policy.thresholdPct}%`
              }
              theme={theme}
            />

            <div
              style={{
                display:
                  "flex",
                justifyContent:
                  "space-between",
                gap:
                  8,
                color:
                  metrics.coverage
                    .thresholdMet
                    ? theme.success
                    : theme.textMuted,
                fontSize:
                  METRICS_META_SIZE,
                lineHeight:
                  "11px",
              }}
            >
              <span>
                {metrics.coverage.requiredUnits} skills required
              </span>

              <span>
                {metrics.coverage.thresholdMet
                  ? "✓ threshold met"
                  : metrics.coverage.policy.thresholdLabel ??
                    `${metrics.coverage.policy.thresholdPct}% threshold`}
              </span>
            </div>
          </div>

          {invalidQuestionCount > 0 ? (
            <div
              style={{
                color:
                  theme.danger,
                borderTop:
                  `1px solid ${theme.borderStandard}`,
                paddingTop:
                  4,
                fontSize:
                  METRICS_META_SIZE,
                lineHeight:
                  "11px",
              }}
            >
              Metrics metadata incomplete for {invalidQuestionCount} assigned question{invalidQuestionCount === 1 ? "" : "s"}.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
