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

import {
  useMetricsPanelSizing,
} from "./MetricsPanelSizing";

import type {
  AssessmentMetricsSnapshot,
  BalanceMetricSnapshot,
  TopicMetricSnapshot,
} from "./MetricsTypes";

const METRICS_TEXT_SIZE =
  8;

const METRICS_META_SIZE =
  7;

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

function formatTargetPct(
  value: number
): string {
  return Number.isInteger(value)
    ? `${value}%`
    : `${value.toFixed(1)}%`;
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
          "8px",
        letterSpacing:
          0.15,
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
          1,
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
            "9px",
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
        minTopLabel={
          formatTargetPct(
            snapshot.minRightPct
          )
        }
        targetTopLabel={
          formatTargetPct(
            snapshot.targetRightPct
          )
        }
        maxTopLabel={
          formatTargetPct(
            snapshot.maxRightPct
          )
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
          0,
      }}
    >
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "baseline",
          gap:
            8,
          color:
            theme.textSecondary,
          fontSize:
            METRICS_TEXT_SIZE,
          lineHeight:
            "9px",
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        <span>
          {snapshot.policy.label}
        </span>

        <span
          style={{
            color:
              theme.textPrimary,
            fontWeight:
              700,
          }}
        >
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
        minTopLabel={
          `${formatMarks(
            snapshot.minMarksExact
          )} marks`
        }
        targetTopLabel={
          `${snapshot.targetMarksAchievable} marks`
        }
        maxTopLabel={
          `${formatMarks(
            snapshot.maxMarksExact
          )} marks`
        }
        minBottomLabel={
          formatTargetPct(
            snapshot.policy.minPct
          )
        }
        targetBottomLabel={
          formatTargetPct(
            snapshot.policy.targetPct
          )
        }
        maxBottomLabel={
          formatTargetPct(
            snapshot.policy.maxPct
          )
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

function ResizeDots({
  theme,
}: {
  theme: AppTheme;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        display:
          "flex",
        alignItems:
          "center",
        justifyContent:
          "center",
        gap:
          2,
      }}
    >
      {[0, 1, 2].map(
        (dot) => (
          <span
            key={dot}
            style={{
              width:
                2,
              height:
                2,
              borderRadius:
                "50%",
              background:
                theme.textMuted,
              opacity:
                0.9,
            }}
          />
        )
      )}
    </span>
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

  const {
    panelRef,
    panelHeight,
    isDragging,
    beginResize,
    resetHeight,
  } =
    useMetricsPanelSizing();

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
      ref={panelRef}
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
        height:
          isOpen
            ? panelHeight
            : 30,
        overflow:
          "hidden",
        fontFamily:
          UI_TYPO.family,
        boxSizing:
          "border-box",
        display:
          "grid",
        gridTemplateRows:
          isOpen
            ? "28px 9px minmax(0, 1fr)"
            : "28px",
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
            28,
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
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize Metrics panel"
          title="Drag to resize Metrics · double-click to reset"
          onMouseDown={beginResize}
          onDoubleClick={resetHeight}
          style={{
            height:
              9,
            cursor:
              "row-resize",
            display:
              "grid",
            placeItems:
              "center",
            borderTop:
              `1px solid ${theme.borderStandard}`,
            background:
              isDragging
                ? theme.controlBgHover
                : "transparent",
            boxSizing:
              "border-box",
          }}
        >
          <ResizeDots
            theme={theme}
          />
        </div>
      ) : null}

      {isOpen ? (
        <div
          className="hover-scroll"
          style={{
            minHeight:
              0,
            overflowY:
              "auto",
            padding:
              "3px 12px 5px",
            display:
              "grid",
            gap:
              4,
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
                "8px",
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
                2,
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
                1,
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
                  "9px",
                fontVariantNumeric:
                  "tabular-nums",
              }}
            >
              <span>
                {metrics.coverage.representedUnits} / {metrics.coverage.totalUnits} skills
              </span>

              <span
                style={{
                  color:
                    theme.textPrimary,
                  fontWeight:
                    700,
                }}
              >
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
              thresholdTopLabel={
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
                  "8px",
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
                  3,
                fontSize:
                  METRICS_META_SIZE,
                lineHeight:
                  "8px",
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
