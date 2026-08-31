import type {
  CSSProperties,
  ReactNode,
} from "react";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

const GAUGE_LABEL_SIZE =
  5.5;

const GAUGE_LABEL_LINE_HEIGHT =
  "7px";

const GAUGE_TOP_LABEL_Y =
  0;

const GAUGE_BAR_Y =
  20;

const GAUGE_BOTTOM_LABEL_Y =
  32;

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

function normaliseRangePosition({
  value,
  min,
  target,
  max,
}: {
  value: number;
  min: number;
  target: number;
  max: number;
}): number {
  const safeValue =
    clamp(value);

  if (safeValue <= min) {
    if (min <= 0) {
      return 30;
    }

    return (
      safeValue /
      min
    ) * 30;
  }

  if (safeValue <= target) {
    const span =
      target - min;

    return span <= 0
      ? 50
      : 30 +
          (
            (
              safeValue - min
            ) /
            span
          ) * 20;
  }

  if (safeValue <= max) {
    const span =
      max - target;

    return span <= 0
      ? 50
      : 50 +
          (
            (
              safeValue - target
            ) /
            span
          ) * 20;
  }

  if (max >= 100) {
    return 70;
  }

  return 70 +
    (
      (
        safeValue - max
      ) /
      (
        100 - max
      )
    ) * 30;
}

type RangeGaugeProps = {
  mode: "range";
  currentPct: number | null;
  minPct: number;
  targetPct: number;
  maxPct: number;
  minTopLabel?: string;
  targetTopLabel?: string;
  maxTopLabel?: string;
  minBottomLabel?: string;
  targetBottomLabel?: string;
  maxBottomLabel?: string;
  positionMode?: "normalised" | "absolute";
  theme: AppTheme;
};

type ThresholdGaugeProps = {
  mode: "threshold";
  currentPct: number;
  thresholdPct: number;
  thresholdTopLabel?: string;
  thresholdBottomLabel?: string;
  theme: AppTheme;
};

type MetricGaugeProps =
  | RangeGaugeProps
  | ThresholdGaugeProps;

function getCurrentMarkerTransform(
  position: number
): string {
  if (position <= 0.5) {
    return "translateX(0)";
  }

  if (position >= 99.5) {
    return "translateX(-100%)";
  }

  return "translateX(-50%)";
}

function CurrentMarker({
  position,
  theme,
}: {
  position: number;
  theme: AppTheme;
}) {
  const safePosition =
    clamp(position);

  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",
        left:
          `${safePosition}%`,
        top:
          -4,
        transform:
          getCurrentMarkerTransform(
            safePosition
          ),
        width:
          8,
        height:
          14,
        pointerEvents:
          "none",
        zIndex:
          3,
      }}
    >
      <div
        style={{
          position:
            "absolute",
          left:
            3.5,
          top:
            6,
          width:
            1,
          height:
            8,
          background:
            theme.textPrimary,
          opacity:
            0.68,
        }}
      />

      <div
        style={{
          position:
            "absolute",
          left:
            0.5,
          top:
            0,
          width:
            7,
          height:
            7,
          borderRadius:
            "50%",
          background:
            "transparent",
          border:
            `1px solid ${theme.textPrimary}`,
          boxSizing:
            "border-box",
          boxShadow:
            `0 0 0 1px ${theme.bgSurface}`,
        }}
      />
    </div>
  );
}

function TargetDiamond({
  position,
  theme,
}: {
  position: number;
  theme: AppTheme;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",
        left:
          `${clamp(position)}%`,
        top:
          "50%",
        width:
          5,
        height:
          5,
        transform:
          "translate(-50%, -50%) rotate(45deg)",
        background:
          theme.bgSurface,
        border:
          `1px solid ${theme.textPrimary}`,
        boxSizing:
          "border-box",
        zIndex:
          2,
      }}
    />
  );
}

function GaugeLabel({
  position,
  label,
  row,
  theme,
}: {
  position: number;
  label?: string;
  row: "top" | "bottom";
  theme: AppTheme;
}) {
  if (!label) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      style={{
        position:
          "absolute",
        left:
          `${clamp(position)}%`,
        top:
          row === "top"
            ? GAUGE_TOP_LABEL_Y
            : GAUGE_BOTTOM_LABEL_Y,
        transform:
          "translateX(-50%)",
        color:
          theme.textMuted,
        fontSize:
          GAUGE_LABEL_SIZE,
        lineHeight:
          GAUGE_LABEL_LINE_HEIGHT,
        fontWeight:
          400,
        fontVariantNumeric:
          "tabular-nums",
        whiteSpace:
          "nowrap",
        pointerEvents:
          "none",
      }}
    >
      {label}
    </span>
  );
}

function GaugeBar({
  children,
  background,
  theme,
}: {
  children: ReactNode;
  background: string;
  theme: AppTheme;
}) {
  return (
    <div
      style={{
        position:
          "absolute",
        left:
          0,
        right:
          0,
        top:
          GAUGE_BAR_Y,
        height:
          5,
        borderRadius:
          999,
        background,
        boxShadow:
          `inset 0 0 0 1px ${theme.borderStandard}`,
      }}
    >
      {children}
    </div>
  );
}

function buildNormalisedRangeGradient(
  theme: AppTheme
): string {
  return `linear-gradient(to right,
    ${theme.danger} 0%,
    ${theme.danger} 3%,
    ${theme.textMuted} 22%,
    ${theme.success} 30%,
    ${theme.success} 70%,
    ${theme.textMuted} 78%,
    ${theme.danger} 97%,
    ${theme.danger} 100%)`;
}

function buildAbsoluteRangeGradient({
  theme,
  minPosition,
  maxPosition,
}: {
  theme: AppTheme;
  minPosition: number;
  maxPosition: number;
}): string {
  const dangerLeft =
    clamp(minPosition - 9);
  const neutralLeft =
    clamp(minPosition - 3.5);
  const neutralRight =
    clamp(maxPosition + 3.5);
  const dangerRight =
    clamp(maxPosition + 9);

  return `linear-gradient(to right,
    ${theme.danger} 0%,
    ${theme.danger} ${dangerLeft}%,
    ${theme.textMuted} ${neutralLeft}%,
    ${theme.success} ${minPosition}%,
    ${theme.success} ${maxPosition}%,
    ${theme.textMuted} ${neutralRight}%,
    ${theme.danger} ${dangerRight}%,
    ${theme.danger} 100%)`;
}

function gaugeFrameStyle(
  height: number
): CSSProperties {
  return {
    position:
      "relative",
    height,
    width:
      "100%",
    minWidth:
      0,
  };
}

export default function MetricGauge(
  props: MetricGaugeProps
) {
  const {
    theme,
  } = props;

  if (
    props.mode ===
    "threshold"
  ) {
    const threshold =
      clamp(
        props.thresholdPct
      );

    const dangerEnd =
      clamp(
        threshold - 16
      );

    const neutralPoint =
      clamp(
        threshold - 7
      );

    const hasBottomLabels =
      Boolean(
        props.thresholdBottomLabel
      );

    return (
      <div
        style={
          gaugeFrameStyle(
            hasBottomLabels
              ? 44
              : 31
          )
        }
      >
        <GaugeLabel
          position={threshold}
          label={
            props.thresholdTopLabel ??
            `${threshold.toFixed(0)}%`
          }
          row="top"
          theme={theme}
        />

        <GaugeLabel
          position={threshold}
          label={
            props.thresholdBottomLabel
          }
          row="bottom"
          theme={theme}
        />

        <GaugeBar
          background={
            `linear-gradient(to right, ${theme.danger} 0%, ${theme.danger} ${dangerEnd}%, ${theme.textMuted} ${neutralPoint}%, ${theme.success} ${threshold}%, ${theme.success} 100%)`
          }
          theme={theme}
        >
          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",
              left:
                `${threshold}%`,
              top:
                -2,
              width:
                1,
              height:
                9,
              background:
                theme.textSecondary,
              opacity:
                0.72,
            }}
          />

          <CurrentMarker
            position={
              props.currentPct
            }
            theme={theme}
          />
        </GaugeBar>
      </div>
    );
  }

  const absolute =
    props.positionMode ===
    "absolute";

  const minPosition =
    absolute
      ? clamp(props.minPct)
      : 30;

  const targetPosition =
    absolute
      ? clamp(props.targetPct)
      : 50;

  const maxPosition =
    absolute
      ? clamp(props.maxPct)
      : 70;

  const currentPosition =
    props.currentPct === null
      ? null
      : absolute
        ? clamp(props.currentPct)
        : normaliseRangePosition({
            value:
              props.currentPct,
            min:
              props.minPct,
            target:
              props.targetPct,
            max:
              props.maxPct,
          });

  const hasBottomLabels =
    Boolean(
      props.minBottomLabel ||
      props.targetBottomLabel ||
      props.maxBottomLabel
    );

  return (
    <div
      style={
        gaugeFrameStyle(
          hasBottomLabels
            ? 44
            : 31
        )
      }
    >
      <GaugeLabel
        position={minPosition}
        label={props.minTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={targetPosition}
        label={props.targetTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={maxPosition}
        label={props.maxTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={minPosition}
        label={props.minBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeLabel
        position={targetPosition}
        label={props.targetBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeLabel
        position={maxPosition}
        label={props.maxBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeBar
        background={
          absolute
            ? buildAbsoluteRangeGradient({
                theme,
                minPosition,
                maxPosition,
              })
            : buildNormalisedRangeGradient(
                theme
              )
        }
        theme={theme}
      >
        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",
            left:
              `${minPosition}%`,
            top:
              -2,
            width:
              1,
            height:
              9,
            background:
              theme.textMuted,
            opacity:
              0.62,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",
            left:
              `${maxPosition}%`,
            top:
              -2,
            width:
              1,
            height:
              9,
            background:
              theme.textMuted,
            opacity:
              0.62,
          }}
        />

        <TargetDiamond
          position={targetPosition}
          theme={theme}
        />

        {currentPosition !== null ? (
          <CurrentMarker
            position={
              currentPosition
            }
            theme={theme}
          />
        ) : null}
      </GaugeBar>
    </div>
  );
}
