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

const METRICS_TEXT_SIZE = 8;
const METRICS_VALUE_SIZE = 6.25;
const METRICS_META_SIZE = 7;
const METRICS_MICRO_SIZE = 6;

const METRICS_LABEL_RAIL = "88px";
const METRICS_CURRENT_RAIL = "64px";
const METRICS_COVERAGE_CURRENT_RAIL = "52px";
const METRICS_TOPIC_TRAILING_RESERVE = "12px";
const METRICS_ROW_GAP = 7;

const METRICS_BALANCE_TEMPLATE =
  `${METRICS_LABEL_RAIL} ${METRICS_CURRENT_RAIL} minmax(0, 1fr) ${METRICS_CURRENT_RAIL} ${METRICS_LABEL_RAIL}`;

const METRICS_TOPIC_TEMPLATE =
  `${METRICS_LABEL_RAIL} ${METRICS_CURRENT_RAIL} minmax(0, 1fr) ${METRICS_TOPIC_TRAILING_RESERVE}`;

const METRICS_COVERAGE_TEMPLATE =
  `${METRICS_LABEL_RAIL} ${METRICS_COVERAGE_CURRENT_RAIL} minmax(0, 1fr) ${METRICS_TOPIC_TRAILING_RESERVE}`;

const GAUGE_ALIGNED_HEIGHT = 42;
const GAUGE_TOP_TEXT_Y = 0;
const GAUGE_BOTTOM_TEXT_Y = 31;
const GAUGE_BAR_TEXT_Y = 15.5;

/*
 * Balance gauges are deliberately calibrated rather than literal 0–100 axes.
 * The exact percentages still drive the calculation, but the acceptable
 * 30–40% A-standard / Reasoning window is given enough visual room to read.
 * Shifting the window a little right of centre reinforces the intended 65:35
 * balance without making the panel look overwhelmingly red.
 */
const BALANCE_MIN_VISUAL = 41;
const BALANCE_TARGET_VISUAL = 61;
const BALANCE_MAX_VISUAL = 81;

function formatMarks(
  value: number
): string {
  return Number.isInteger(value)
    ? `${value}`
    : value.toFixed(1);
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

function clamp(
  value: number,
  min = 0,
  max = 100
): number {
  return Math.min(
    max,
    Math.max(
      min,
      value
    )
  );
}

function mapBalancePercentageToVisualPosition({
  value,
  min,
  target,
  max,
}: {
  value: number | null;
  min: number;
  target: number;
  max: number;
}): number | null {
  if (value === null) {
    return null;
  }

  const safeValue = clamp(value);

  if (safeValue <= min) {
    return min <= 0
      ? BALANCE_MIN_VISUAL
      : (
          safeValue /
          min
        ) * BALANCE_MIN_VISUAL;
  }

  if (safeValue <= target) {
    const span = target - min;

    return span <= 0
      ? BALANCE_TARGET_VISUAL
      : BALANCE_MIN_VISUAL +
          (
            (
              safeValue - min
            ) /
            span
          ) *
            (
              BALANCE_TARGET_VISUAL -
              BALANCE_MIN_VISUAL
            );
  }

  if (safeValue <= max) {
    const span = max - target;

    return span <= 0
      ? BALANCE_TARGET_VISUAL
      : BALANCE_TARGET_VISUAL +
          (
            (
              safeValue - target
            ) /
            span
          ) *
            (
              BALANCE_MAX_VISUAL -
              BALANCE_TARGET_VISUAL
            );
  }

  if (max >= 100) {
    return BALANCE_MAX_VISUAL;
  }

  return BALANCE_MAX_VISUAL +
    (
      (
        safeValue - max
      ) /
      (
        100 - max
      )
    ) *
      (
        100 - BALANCE_MAX_VISUAL
      );
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
        color: theme.textSecondary,
        fontSize: METRICS_META_SIZE,
        lineHeight: "8px",
        letterSpacing: 0.15,
        textTransform: "uppercase",
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
  emphasise = false,
}: {
  marks?: number;
  percentage: number | null;
  theme: AppTheme;
  align: "left" | "right";
  emphasise?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        height: GAUGE_ALIGNED_HEIGHT,
        minWidth: 0,
        color: emphasise
          ? theme.textPrimary
          : theme.textSecondary,
        fontSize: METRICS_VALUE_SIZE,
        lineHeight: "7px",
        fontWeight: emphasise
          ? UI_TYPO.weightMedium
          : UI_TYPO.weightRegular,
        fontVariantNumeric: "tabular-nums",
        textAlign: align,
        whiteSpace: "nowrap",
      }}
    >
      {marks !== undefined ? (
        <span
          style={{
            position: "absolute",
            top: GAUGE_TOP_TEXT_Y,
            left: align === "left"
              ? 0
              : "auto",
            right: align === "right"
              ? 0
              : "auto",
          }}
        >
          {formatMarks(marks)} marks
        </span>
      ) : null}

      <span
        style={{
          position: "absolute",
          top: GAUGE_BOTTOM_TEXT_Y,
          left: align === "left"
            ? 0
            : "auto",
          right: align === "right"
            ? 0
            : "auto",
        }}
      >
        {formatPct(percentage)}
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
        color: theme.textSecondary,
        fontSize: METRICS_TEXT_SIZE,
        lineHeight: "10px",
        textAlign: align,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function BalanceMetricRow({
  snapshot,
  assessmentMarks,
  theme,
}: {
  snapshot: BalanceMetricSnapshot;
  assessmentMarks: number;
  theme: AppTheme;
}) {
  const currentVisualPosition =
    mapBalancePercentageToVisualPosition({
      value: snapshot.rightPct,
      min: snapshot.minRightPct,
      target: snapshot.targetRightPct,
      max: snapshot.maxRightPct,
    });

  const minimumRightMarks =
    assessmentMarks *
    snapshot.minRightPct /
    100;

  const maximumRightMarks =
    assessmentMarks *
    snapshot.maxRightPct /
    100;

  return (
    <div
      style={{
        display: "grid",
        gap: 7,
        padding: "3px 0 7px",
      }}
    >
      <SectionTitle theme={theme}>
        {snapshot.policy.label}
      </SectionTitle>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: METRICS_BALANCE_TEMPLATE,
          columnGap: METRICS_ROW_GAP,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <BalanceLabel
          label={snapshot.policy.leftLabel}
          theme={theme}
          align="left"
        />

        <GaugeAlignedCurrent
          marks={snapshot.leftMarks}
          percentage={snapshot.leftPct}
          theme={theme}
          align="right"
        />

        <MetricGauge
          mode="range"
          positionMode="absolute"
          currentPct={currentVisualPosition}
          minPct={BALANCE_MIN_VISUAL}
          targetPct={BALANCE_TARGET_VISUAL}
          maxPct={BALANCE_MAX_VISUAL}
          minTopLabel={`${formatMarks(minimumRightMarks)} marks`}
          maxTopLabel={`${formatMarks(maximumRightMarks)} marks`}
          minBottomLabel={formatTargetPct(snapshot.minRightPct)}
          targetBottomLabel={formatTargetPct(snapshot.targetRightPct)}
          maxBottomLabel={formatTargetPct(snapshot.maxRightPct)}
          theme={theme}
        />

        <GaugeAlignedCurrent
          marks={snapshot.rightMarks}
          percentage={snapshot.rightPct}
          theme={theme}
          align="left"
        />

        <BalanceLabel
          label={snapshot.policy.rightLabel}
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
  snapshot: TopicMetricSnapshot;
  theme: AppTheme;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: METRICS_TOPIC_TEMPLATE,
        columnGap: METRICS_ROW_GAP,
        alignItems: "center",
        minWidth: 0,
        padding: "7px 0 10px",
      }}
    >
      <span
        style={{
          color: theme.textPrimary,
          fontSize: METRICS_TEXT_SIZE,
          lineHeight: "10px",
          fontWeight: UI_TYPO.weightSemibold,
          whiteSpace: "nowrap",
        }}
      >
        {snapshot.policy.label}
      </span>

      <GaugeAlignedCurrent
        marks={snapshot.marks}
        percentage={snapshot.currentPct}
        theme={theme}
        align="right"
        emphasise
      />

      <MetricGauge
        mode="range"
        currentPct={snapshot.currentPct}
        minPct={snapshot.policy.minPct}
        targetPct={snapshot.policy.targetPct}
        maxPct={snapshot.policy.maxPct}
        minTopLabel={`${formatMarks(snapshot.minMarksExact)} marks`}
        targetTopLabel={`${snapshot.targetMarksAchievable} marks`}
        maxTopLabel={`${formatMarks(snapshot.maxMarksExact)} marks`}
        minBottomLabel={formatTargetPct(snapshot.policy.minPct)}
        targetBottomLabel={formatTargetPct(snapshot.policy.targetPct)}
        maxBottomLabel={formatTargetPct(snapshot.policy.maxPct)}
        theme={theme}
      />

      <span />
    </div>
  );
}

function CourseCoverageTitleLine({
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
        color: theme.textSecondary,
        fontSize: METRICS_META_SIZE,
        lineHeight: "8px",
        minHeight: 8,
        letterSpacing: 0.15,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function CourseCoverageTitle({
  theme,
}: {
  theme: AppTheme;
}) {
  return (
    <div
      style={{
        display: "grid",
        rowGap: 5,
        alignSelf: "center",
      }}
    >
      <CourseCoverageTitleLine theme={theme}>
        Course
      </CourseCoverageTitleLine>

      <CourseCoverageTitleLine theme={theme}>
        Coverage
      </CourseCoverageTitleLine>
    </div>
  );
}

function CourseCoverageMetric({
  metrics,
  theme,
}: {
  metrics: AssessmentMetricsSnapshot;
  theme: AppTheme;
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 2,
        padding: "7px 0 3px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: METRICS_COVERAGE_TEMPLATE,
          columnGap: METRICS_ROW_GAP,
          alignItems: "center",
          minWidth: 0,
        }}
      >
        <CourseCoverageTitle theme={theme} />

        <div
          style={{
            position: "relative",
            height: GAUGE_ALIGNED_HEIGHT,
            minWidth: 0,
            color: theme.textPrimary,
            fontSize: METRICS_VALUE_SIZE,
            lineHeight: "7px",
            fontWeight: UI_TYPO.weightMedium,
            fontVariantNumeric: "tabular-nums",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: GAUGE_BAR_TEXT_Y,
              right: 0,
            }}
          >
            {metrics.coverage.percentage.toFixed(1)}%
          </span>
        </div>

        <MetricGauge
          mode="threshold"
          currentPct={metrics.coverage.percentage}
          thresholdPct={metrics.coverage.policy.thresholdPct}
          thresholdTopLabel=""
          thresholdBottomLabel={`${metrics.coverage.policy.thresholdPct}%`}
          theme={theme}
        />

        <span />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: METRICS_COVERAGE_TEMPLATE,
          columnGap: METRICS_ROW_GAP,
          minWidth: 0,
        }}
      >
        <span />
        <span />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 18,
            minWidth: 0,
            color: metrics.coverage.thresholdMet
              ? theme.success
              : theme.textMuted,
            fontSize: METRICS_MICRO_SIZE,
            lineHeight: "8px",
            whiteSpace: "nowrap",
          }}
        >
          <span>
            {metrics.coverage.requiredUnits} skills required
          </span>

          <span>
            {metrics.coverage.policy.thresholdLabel ??
              `${metrics.coverage.policy.thresholdPct}% threshold`}
          </span>
        </div>

        <span />
      </div>
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
        display: "block",
        flex: "0 0 auto",
      }}
    >
      <path
        d={isOpen
          ? "M1 2 L4 5 L7 2"
          : "M2 1 L5 4 L2 7"}
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      {[0, 1, 2].map(
        (dot) => (
          <span
            key={dot}
            style={{
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: theme.textMuted,
              opacity: 0.9,
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
  metrics: AssessmentMetricsSnapshot;
  theme: AppTheme;
}) {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    headerHovered,
    setHeaderHovered,
  ] = useState(false);

  const {
    panelRef,
    panelHeight,
    isDragging,
    beginResize,
    resetHeight,
  } = useMetricsPanelSizing({
    isOpen,
  });

  const invalidQuestionCount =
    new Set(
      metrics.validationIssues
        .map((issue) => issue.questionId)
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
        border: `1px solid ${theme.borderStandard}`,
        borderTop: `1px solid ${theme.borderStandard}`,
        borderRadius: "0 0 6px 6px",
        background: theme.bgSurface,
        minHeight: 0,
        height: isOpen
          ? panelHeight
          : 30,
        overflow: "hidden",
        fontFamily: UI_TYPO.family,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateRows: isOpen
          ? "28px minmax(0, 1fr)"
          : "28px",
        position: "relative",
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
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            cursor: "row-resize",
            display: "grid",
            placeItems: "start center",
            paddingTop: 1,
            background: isDragging
              ? theme.controlBgHover
              : "transparent",
            boxSizing: "border-box",
            zIndex: 4,
          }}
        >
          <ResizeDots theme={theme} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
        onMouseEnter={() => setHeaderHovered(true)}
        onMouseLeave={() => setHeaderHovered(false)}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          height: 28,
          border: "none",
          background: headerHovered
            ? theme.controlBgHover
            : "transparent",
          color: theme.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: isOpen
            ? "3px 8px 0 7px"
            : "0 8px 0 7px",
          cursor: "pointer",
          fontFamily: UI_TYPO.family,
          boxSizing: "border-box",
          textAlign: "left",
          transition: "background 0.12s ease",
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            display: "grid",
            placeItems: "center",
            color: theme.textSecondary,
          }}
        >
          <ExplorerChevron isOpen={isOpen} />
        </span>

        <span
          style={{
            ...UI_TEXT.controlTextStrong,
            fontSize: UI_TYPO.sizeMeta,
            color: theme.textPrimary,
            fontWeight: UI_TYPO.weightSemibold,
          }}
        >
          Metrics
        </span>
      </button>

      {isOpen ? (
        <div
          className="hover-scroll"
          style={{
            minHeight: 0,
            overflowY: "auto",
            borderTop: `1px solid ${theme.borderStandard}`,
            padding: "8px 12px 10px",
            display: "grid",
            gap: 9,
            boxSizing: "border-box",
          }}
        >
          <BalanceMetricRow
            snapshot={metrics.standard}
            assessmentMarks={metrics.finalTargetMarks}
            theme={theme}
          />

          <BalanceMetricRow
            snapshot={metrics.thinking}
            assessmentMarks={metrics.finalTargetMarks}
            theme={theme}
          />

          <div
            style={{
              display: "grid",
              gap: 2,
              paddingTop: 2,
            }}
          >
            <div
              style={{
                paddingBottom: 4,
              }}
            >
              <SectionTitle theme={theme}>
                Topic
              </SectionTitle>
            </div>

            {metrics.topics.map(
              (topic) => (
                <TopicMetricRow
                  key={topic.policy.topic}
                  snapshot={topic}
                  theme={theme}
                />
              )
            )}
          </div>

          <CourseCoverageMetric
            metrics={metrics}
            theme={theme}
          />

          {invalidQuestionCount > 0 ? (
            <div
              style={{
                color: theme.danger,
                borderTop: `1px solid ${theme.borderStandard}`,
                paddingTop: 6,
                fontSize: METRICS_MICRO_SIZE,
                lineHeight: "7px",
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