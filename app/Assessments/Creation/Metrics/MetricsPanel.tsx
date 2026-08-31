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

const METRICS_VALUE_SIZE =
  6.25;

const METRICS_META_SIZE =
  7;

const METRICS_MICRO_SIZE =
  6;

const METRICS_LABEL_RAIL =
  "92px";

const METRICS_CURRENT_RAIL =
  "72px";

const METRICS_TRAILING_RESERVE =
  "172px";

const METRICS_ROW_GAP =
  8;

const METRICS_BALANCE_TEMPLATE =
  `${METRICS_LABEL_RAIL} ${METRICS_CURRENT_RAIL} minmax(0, 1fr) ${METRICS_CURRENT_RAIL} ${METRICS_LABEL_RAIL}`;

const METRICS_TOPIC_TEMPLATE =
  `${METRICS_LABEL_RAIL} ${METRICS_CURRENT_RAIL} minmax(0, 1fr) ${METRICS_TRAILING_RESERVE}`;

const GAUGE_ALIGNED_HEIGHT =
  42;

const GAUGE_TOP_TEXT_Y =
  0;

const GAUGE_BOTTOM_TEXT_Y =
  31;

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

function GaugeAlignedCurrent({
  marks,
  percentage,
  theme,
  align,
}: {
  marks?: number;
  percentage: number | null;
  theme: AppTheme;
  align: "left" | "right";
}) {
  return (
    <div
      style={{
        position:
          "relative",
        height:
          GAUGE_ALIGNED_HEIGHT,
        minWidth:
          0,
        color:
          theme.textSecondary,
        fontSize:
          METRICS_VALUE_SIZE,
        lineHeight:
          "7px",
        fontVariantNumeric:
          "tabular-nums",
        textAlign:
          align,
        whiteSpace:
          "nowrap",
      }}
    >
      {marks !== undefined ? (
        <span
          style={{
            position:
              "absolute",
            top:
              GAUGE_TOP_TEXT_Y,
            left:
              align === "left"
                ? 0
                : "auto",
            right:
              align === "right"
                ? 0
                : "auto",
          }}
        >
          {formatMarks(
            marks
          )} marks
        </span>
      ) : null}

      <span
        style={{
          position:
            "absolute",
          top:
            GAUGE_BOTTOM_TEXT_Y,
          left:
            align === "left"
              ? 0
              : "auto",
          right:
            align === "right"
              ? 0
              : "auto",
        }}
      >
        {formatPct(
          percentage
        )}
      </span>
    </div>
  );
}

function BalanceLabel({
  label,
  theme,
  align,
}: {
  label: string;
  theme: AppTheme;
  align: "left" | "right";
}) {
  return (
    <span
      style={{
        color:
          theme.textSecondary,
        fontSize:
          METRICS_TEXT_SIZE,
        lineHeight:
          "10px",
        textAlign:
          align,
        whiteSpace:
          "nowrap",
      }}
    >
      {label}
    </span>
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
          7,
        padding:
          "3px 0 7px",
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
            "grid",
          gridTemplateColumns:
            METRICS_BALANCE_TEMPLATE,
          columnGap:
            METRICS_ROW_GAP,
          alignItems:
            "center",
          minWidth:
            0,
        }}
      >
        <BalanceLabel
          label={
            snapshot.policy.leftLabel
          }
          theme={theme}
          align="left"
        />

        <GaugeAlignedCurrent
          marks={
            snapshot.leftMarks
          }
          percentage={
            snapshot.leftPct
          }
          theme={theme}
          align="right"
        />

        <MetricGauge
          mode="range"
          positionMode="weighted"
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
          minBottomLabel={
            formatTargetPct(
              snapshot.minRightPct
            )
          }
          targetBottomLabel={
            formatTargetPct(
              snapshot.targetRightPct
            )
          }
          maxBottomLabel={
            formatTargetPct(
              snapshot.maxRightPct
            )
          }
          theme={theme}
        />

        <GaugeAlignedCurrent
          marks={
            snapshot.rightMarks
          }
          percentage={
            snapshot.rightPct
          }
          theme={theme}
          align="left"
        />

        <BalanceLabel
          label={
            snapshot.policy.rightLabel
          }
          theme={theme}
          align="right"
        />
      </div>
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
        gridTemplateColumns:
          METRICS_TOPIC_TEMPLATE,
        columnGap:
          METRICS_ROW_GAP,
        alignItems:
          "center",
        minWidth:
          0,
        padding:
          "7px 0 9px",
      }}
    >
      <span
        style={{
          color:
            theme.textSecondary,
          fontSize:
            METRICS_TEXT_SIZE,
          lineHeight:
            "10px",
          whiteSpace:
            "nowrap",
        }}
      >
        {snapshot.policy.label}
      </span>

      <GaugeAlignedCurrent
        marks={
          snapshot.marks
        }
        percentage={
          snapshot.currentPct
        }
        theme={theme}
        align="right"
      />

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

      <span />
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
    useMetricsPanelSizing({
      isOpen,
    });

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
            ? "28px minmax(0, 1fr)"
            : "28px",
        position:
          "relative",
      }}
    >
      {isOpen ? (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize Metrics panel"
          title="Drag to resize Metrics · double-click to fit available space"
          onMouseDown={beginResize}
          onDoubleClick={resetHeight}
          style={{
            position:
              "absolute",
            top:
              0,
            left:
              0,
            right:
              0,
            height:
              8,
            cursor:
              "row-resize",
            display:
              "grid",
            placeItems:
              "start center",
            paddingTop:
              1,
            background:
              isDragging
                ? theme.controlBgHover
                : "transparent",
            boxSizing:
              "border-box",
            zIndex:
              4,
          }}
        >
          <ResizeDots
            theme={theme}
          />
        </div>
      ) : null}

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
            isOpen
              ? "3px 8px 0 7px"
              : "0 8px 0 7px",
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
            minHeight:
              0,
            overflowY:
              "auto",
            borderTop:
              `1px solid ${theme.borderStandard}`,
            padding:
              "7px 12px 10px",
            display:
              "grid",
            gap:
              9,
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
                METRICS_MICRO_SIZE,
              lineHeight:
                "7px",
              fontVariantNumeric:
                "tabular-nums",
              paddingBottom:
                2,
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
              paddingTop:
                2,
            }}
          >
            <div
              style={{
                paddingBottom:
                  4,
              }}
            >
              <SectionTitle
                theme={theme}
              >
                Topic
              </SectionTitle>
            </div>

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
                4,
              padding:
                "6px 0 2px",
            }}
          >
            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  METRICS_TOPIC_TEMPLATE,
                columnGap:
                  METRICS_ROW_GAP,
                alignItems:
                  "center",
                minWidth:
                  0,
              }}
            >
              <SectionTitle
                theme={theme}
              >
                {metrics.coverage.policy.label}
              </SectionTitle>

              <span
                style={{
                  color:
                    theme.textSecondary,
                  fontSize:
                    METRICS_VALUE_SIZE,
                  lineHeight:
                    "8px",
                  fontVariantNumeric:
                    "tabular-nums",
                  textAlign:
                    "right",
                }}
              >
                {metrics.coverage.percentage.toFixed(1)}%
              </span>

              <MetricGauge
                mode="threshold"
                currentPct={
                  metrics.coverage.percentage
                }
                thresholdPct={
                  metrics.coverage.policy
                    .thresholdPct
                }
                thresholdTopLabel=""
                thresholdBottomLabel={
                  `${metrics.coverage.policy.thresholdPct}%`
                }
                theme={theme}
              />

              <span />
            </div>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  METRICS_TOPIC_TEMPLATE,
                columnGap:
                  METRICS_ROW_GAP,
                minWidth:
                  0,
              }}
            >
              <span />
              <span />

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  gap:
                    10,
                  color:
                    metrics.coverage
                      .thresholdMet
                      ? theme.success
                      : theme.textMuted,
                  fontSize:
                    METRICS_MICRO_SIZE,
                  lineHeight:
                    "7px",
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

              <span />
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
                  6,
                fontSize:
                  METRICS_MICRO_SIZE,
                lineHeight:
                  "7px",
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
