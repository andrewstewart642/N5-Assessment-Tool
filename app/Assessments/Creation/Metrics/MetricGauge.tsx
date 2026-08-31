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
  theme: AppTheme;
};

type ThresholdGaugeProps = {
  mode: "threshold";
  currentPct: number;
  thresholdPct: number;
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
          -4,
        transform:
          "translateX(-50%)",
        width:
          2,
        height:
          16,
        background:
          theme.textPrimary,
        borderRadius:
          2,
        boxShadow:
          `0 0 0 1px ${theme.bgSurface}`,
      }}
    />
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
          8,
        height:
          8,
        transform:
          "translate(-50%, -50%) rotate(45deg)",
        background:
          theme.bgSurface,
        border:
          `2px solid ${theme.textPrimary}`,
        boxSizing:
          "border-box",
      }}
    />
  );
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

    const blendStart =
      clamp(
        threshold - 2.5
      );

    const blendEnd =
      clamp(
        threshold + 2.5
      );

    return (
      <div
        style={{
          position:
            "relative",
          height:
            8,
          borderRadius:
            999,
          background:
            `linear-gradient(to right, ${theme.danger} 0%, ${theme.danger} ${blendStart}%, ${theme.success} ${blendEnd}%, ${theme.success} 100%)`,
          boxShadow:
            `inset 0 0 0 1px ${theme.borderStandard}`,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",
            left:
              `${threshold}%`,
            top:
              -3,
            width:
              1,
            height:
              14,
            background:
              theme.textSecondary,
          }}
        />

        <CurrentMarker
          position={
            props.currentPct
          }
          theme={
            theme
          }
        />
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

  return (
    <div
      style={{
        position:
          "relative",
        height:
          8,
        borderRadius:
          999,
        background:
          `linear-gradient(to right, ${theme.danger} 0%, ${theme.danger} 27%, ${theme.success} 33%, ${theme.success} 67%, ${theme.danger} 73%, ${theme.danger} 100%)`,
        boxShadow:
          `inset 0 0 0 1px ${theme.borderStandard}`,
      }}
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
            12,
          background:
            theme.textMuted,
          opacity:
            0.7,
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
            12,
          background:
            theme.textMuted,
          opacity:
            0.7,
        }}
      />

      <TargetDiamond
        position={50}
        theme={
          theme
        }
      />

      {currentPosition !== null ? (
        <CurrentMarker
          position={
            currentPosition
          }
          theme={
            theme
          }
        />
      ) : null}
    </div>
  );
}
