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
        letterSpacing:
          0.35,
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
          7,
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
            12,
          ...UI_TEXT.metadata,
          color:
            theme.textSecondary,
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
          ...UI_TEXT.metadata,
          color:
            theme.textMuted,
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        <span>
          valid {snapshot.minRightPct.toFixed(0)}–{snapshot.maxRightPct.toFixed(0)}%
        </span>

        <span>
          target {snapshot.targetRightPct.toFixed(0)}%
        </span>
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
        gap:
          6,
      }}
    >
      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          gap:
            10,
          ...UI_TEXT.metadata,
          color:
            theme.textSecondary,
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
          ...UI_TEXT.metadata,
          color:
            theme.textMuted,
          fontVariantNumeric:
            "tabular-nums",
        }}
      >
        <span>
          valid {snapshot.minMarksAchievable}–{snapshot.maxMarksAchievable} marks
        </span>

        <span>
          target {snapshot.targetMarksAchievable}
        </span>
      </div>
    </div>
  );
}

export default function MetricsPanel({
  metrics,
  isOpen,
  onToggle,
  theme,
}: {
  metrics:
    AssessmentMetricsSnapshot;
  isOpen:
    boolean;
  onToggle:
    () => void;
  theme:
    AppTheme;
}) {
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
        borderTop:
          `1px solid ${theme.borderStandard}`,
        background:
          theme.bgSurface,
        minHeight:
          0,
        fontFamily:
          UI_TYPO.family,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width:
            "100%",
          height:
            30,
          border:
            "none",
          background:
            "transparent",
          color:
            theme.textPrimary,
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          padding:
            "0 10px",
          cursor:
            "pointer",
          fontFamily:
            UI_TYPO.family,
          boxSizing:
            "border-box",
        }}
      >
        <span
          style={{
            ...UI_TEXT.controlTextStrong,
            fontSize:
              UI_TYPO.sizeMeta,
          }}
        >
          {isOpen ? "⌄" : "›"} METRICS
        </span>

        <span
          style={{
            ...UI_TEXT.metadata,
            color:
              theme.textMuted,
            fontVariantNumeric:
              "tabular-nums",
          }}
        >
          {formatMarks(
            metrics.assignedMarks
          )} / {formatMarks(
            metrics.finalTargetMarks
          )}
        </span>
      </button>

      {isOpen ? (
        <div
          className="hover-scroll"
          style={{
            maxHeight:
              "min(480px, 58vh)",
            overflowY:
              "auto",
            padding:
              "10px 12px 14px",
            display:
              "grid",
            gap:
              16,
            boxSizing:
              "border-box",
          }}
        >
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
                10,
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
                7,
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
                ...UI_TEXT.metadata,
                color:
                  theme.textSecondary,
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
                ...UI_TEXT.metadata,
                color:
                  metrics.coverage
                    .thresholdMet
                    ? theme.success
                    : theme.textMuted,
              }}
            >
              <span>
                {metrics.coverage.requiredUnits} skills required
              </span>

              <span>
                {metrics.coverage.thresholdMet
                  ? "✓ threshold met"
                  : `${metrics.coverage.policy.thresholdPct}% threshold`}
              </span>
            </div>
          </div>

          {invalidQuestionCount > 0 ? (
            <div
              style={{
                ...UI_TEXT.metadata,
                color:
                  theme.danger,
                borderTop:
                  `1px solid ${theme.borderStandard}`,
                paddingTop:
                  8,
              }}
            >
              Metrics classification metadata is incomplete for {invalidQuestionCount} assigned question{invalidQuestionCount === 1 ? "" : "s"}.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
