import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

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

function CurrentMarker({
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
          -5,
        transform:
          "translateX(-50%)",
        width:
          10,
        height:
          15,
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
            4.5,
          top:
            6,
          width:
            1,
          height:
            9,
          background:
            theme.textPrimary,
          opacity:
            0.9,
        }}
      />

      <div
        style={{
          position:
            "absolute",
          left:
            1,
          top:
            0,
          width:
            8,
          height:
            8,
          borderRadius:
            "50%",
          background:
            theme.bgSurface,
          border:
            `1.5px solid ${theme.textPrimary}`,
          boxSizing:
            "border-box",
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
          6,
        height:
          6,
        transform:
          "translate(-50%, -50%) rotate(45deg)",
        background:
          theme.bgSurface,
        border:
          `1.5px solid ${theme.textPrimary}`,
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
            ? 0
            : 21,
        transform:
          "translateX(-50%)",
        color:
          theme.textMuted,
        fontSize:
          7,
        lineHeight:
          "8px",
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
  children: React.ReactNode;
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
          12,
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

function buildRangeGradient(
  theme: AppTheme
): string {
  return `linear-gradient(to right,
    ${theme.danger} 0%,
    ${theme.danger} 8%,
    ${theme.textMuted} 23%,
    ${theme.success} 30%,
    ${theme.success} 70%,
    ${theme.textMuted} 77%,
    ${theme.danger} 92%,
    ${theme.danger} 100%)`;
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
        threshold - 12
      );

    const neutralPoint =
      clamp(
        threshold - 5
      );

    const hasBottomLabels =
      Boolean(
        props.thresholdBottomLabel
      );

    return (
      <div
        style={{
          position:
            "relative",
          height:
            hasBottomLabels
              ? 30
              : 18,
          width:
            "100%",
        }}
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

  const currentPosition =
    props.currentPct === null
      ? null
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
      style={{
        position:
          "relative",
        height:
          hasBottomLabels
            ? 30
            : 18,
        width:
          "100%",
      }}
    >
      <GaugeLabel
        position={30}
        label={props.minTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={50}
        label={props.targetTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={70}
        label={props.maxTopLabel}
        row="top"
        theme={theme}
      />

      <GaugeLabel
        position={30}
        label={props.minBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeLabel
        position={50}
        label={props.targetBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeLabel
        position={70}
        label={props.maxBottomLabel}
        row="bottom"
        theme={theme}
      />

      <GaugeBar
        background={
          buildRangeGradient(
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
              "30%",
            top:
              -2,
            width:
              1,
            height:
              9,
            background:
              theme.textMuted,
            opacity:
              0.8,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",
            left:
              "70%",
            top:
              -2,
            width:
              1,
            height:
              9,
            background:
              theme.textMuted,
            opacity:
              0.8,
          }}
        />

        <TargetDiamond
          position={50}
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
