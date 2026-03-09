"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UI_TYPO } from "@/app/ui/uiTypography";
import type { Theme } from "@/shared-types/assessmentTypes";
import type { AppearancePreference } from "@/app/ui/appTheme";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;

  appearance: AppearancePreference;
  onChangeAppearance: (value: AppearancePreference) => void;

  includeCoverSheet: boolean;
  onToggleIncludeCoverSheet: (next: boolean) => void;

  showCoverDateTime: boolean;
  onToggleShowCoverDateTime: (next: boolean) => void;

  p1CoverDateText: string;
  onChangeP1CoverDateText: (value: string) => void;
  p1StartTimeText: string;
  onChangeP1StartTimeText: (value: string) => void;
  p1EndTimeText: string;
  onChangeP1EndTimeText: (value: string) => void;

  p2CoverDateText: string;
  onChangeP2CoverDateText: (value: string) => void;
  p2StartTimeText: string;
  onChangeP2StartTimeText: (value: string) => void;
  p2EndTimeText: string;
  onChangeP2EndTimeText: (value: string) => void;

  showScottishCandidateNumberBox: boolean;
  onToggleShowScottishCandidateNumberBox: (next: boolean) => void;

  includeFormulaSheet: boolean;
  onToggleIncludeFormulaSheet: (next: boolean) => void;

  showProgressPanel: boolean;
  onToggleShowProgressPanel: (next: boolean) => void;

  onResetLayout: () => void;
  onResetZoom: () => void;
};

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  theme: Theme;
};

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  theme,
}: ToggleRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 12,
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${theme.borderSoft}`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightSemibold,
            fontSize: 14,
            color: theme.text,
            marginBottom: description ? 4 : 0,
          }}
        >
          {label}
        </div>

        {description ? (
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 12,
              lineHeight: 1.45,
              color: theme.textMuted,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 48,
          height: 28,
          borderRadius: 999,
          border: `1px solid ${
            checked ? "rgba(96,165,250,0.95)" : theme.border
          }`,
          background: checked
            ? "rgba(37,99,235,0.22)"
            : "rgba(255,255,255,0.04)",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            width: 20,
            height: 20,
            borderRadius: 999,
            background: checked ? "#93c5fd" : "rgba(214,227,243,0.72)",
            transition: "left 160ms ease",
          }}
        />
      </button>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date";
  theme: Theme;
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  theme,
}: FieldProps) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span
        style={{
          fontFamily: UI_TYPO.family,
          fontSize: 12,
          fontWeight: UI_TYPO.weightSemibold,
          color: theme.textMuted,
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 38,
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          background:
            theme.pageBg === "#eef3f8"
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.04)",
          color: theme.text,
          padding: "0 12px",
          fontFamily: UI_TYPO.family,
          fontSize: 14,
          fontWeight: UI_TYPO.weightMedium,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

type ChoiceButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: Theme;
};

function ChoiceButton({
  label,
  active,
  onClick,
  theme,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 36,
        borderRadius: 12,
        border: `1px solid ${
          active ? "rgba(96,165,250,0.95)" : theme.border
        }`,
        background: active
          ? "rgba(37,99,235,0.18)"
          : "rgba(255,255,255,0.03)",
        color: active ? theme.text : theme.textMuted,
        padding: "0 12px",
        fontFamily: UI_TYPO.family,
        fontSize: 13,
        fontWeight: UI_TYPO.weightSemibold,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

type TimeParts = {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
};

function defaultTimeParts(): TimeParts {
  return {
    hour12: 9,
    minute: 0,
    period: "AM",
  };
}

function formatParts(parts: TimeParts): string {
  const minute = String(parts.minute).padStart(2, "0");
  return `${parts.hour12}:${minute} ${parts.period}`;
}

function parseTimeInput(input: string): TimeParts | null {
  const raw = input.trim().toUpperCase();
  if (!raw) return null;

  const compact = raw.replace(/\s+/g, "");

  const ampmMatch = compact.match(/^(\d{1,2})(?::?(\d{2}))?(AM|PM)$/);
  if (ampmMatch) {
    const hour = Number(ampmMatch[1]);
    const minute = Number(ampmMatch[2] ?? "0");
    const period = ampmMatch[3] as "AM" | "PM";

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      return {
        hour12: hour,
        minute,
        period,
      };
    }
  }

  const twentyFourMatch = compact.match(/^(\d{1,2})(?::?(\d{2}))$/);
  if (twentyFourMatch) {
    let hour24 = Number(twentyFourMatch[1]);
    const minute = Number(twentyFourMatch[2] ?? "0");

    if (hour24 >= 0 && hour24 <= 23 && minute >= 0 && minute <= 59) {
      const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
      hour24 = hour24 % 12;
      if (hour24 === 0) hour24 = 12;

      return {
        hour12: hour24,
        minute,
        period,
      };
    }
  }

  return null;
}

type TimePickerFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  openKey: string | null;
  setOpenKey: (key: string | null) => void;
  nextOpenKey?: string | null;
  theme: Theme;
};

function TimePickerField({
  id,
  label,
  value,
  onChange,
  openKey,
  setOpenKey,
  nextOpenKey = null,
  theme,
}: TimePickerFieldProps) {
  const isOpen = openKey === id;
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [stage, setStage] = useState<"hour" | "minute">("hour");
  const [draft, setDraft] = useState<TimeParts>(defaultTimeParts());
  const [manualValue, setManualValue] = useState(value);

  useEffect(() => {
    setManualValue(value);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;

    const parsed = parseTimeInput(value);
    setDraft(parsed ?? defaultTimeParts());
    setStage("hour");
  }, [isOpen, value]);

  useEffect(() => {
    if (!isOpen) return;

    const onDocMouseDown = (event: MouseEvent) => {
      const node = wrapperRef.current;
      if (!node) return;
      if (node.contains(event.target as Node)) return;
      setOpenKey(null);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isOpen, setOpenKey]);

  function angleForHour(hour12: number): number {
    return (hour12 % 12) * 30;
  }

  function angleForMinute(minute: number): number {
    return minute * 6;
  }

  function polarToCartesian(angleDeg: number, radius: number, cx: number, cy: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function circularMinuteDistance(a: number, b: number): number {
    const diff = Math.abs(a - b);
    return Math.min(diff, 60 - diff);
  }

  function updateFromPoint(clientX: number, clientY: number, forceStage?: "hour" | "minute") {
    const node = wrapperRef.current?.querySelector("[data-clock-face='true']") as HTMLElement | null;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    const activeStage = forceStage ?? stage;

    if (activeStage === "hour") {
      let hour = Math.round(angle / 30);
      if (hour === 0) hour = 12;
      if (hour > 12) hour = 12;
      setDraft((prev) => ({ ...prev, hour12: hour }));
      return;
    }

    const rawMinute = Math.round(angle / 6) % 60;
    const nearest5 = Math.round(rawMinute / 5) * 5;
    const snapped5 = ((nearest5 % 60) + 60) % 60;
    const shouldSnap = circularMinuteDistance(rawMinute, snapped5) <= 1;

    setDraft((prev) => ({
      ...prev,
      minute: shouldSnap ? snapped5 : rawMinute,
    }));
  }

  function handleApply() {
    const next = formatParts(draft);
    onChange(next);

    if (nextOpenKey) {
      setOpenKey(nextOpenKey);
      return;
    }

    setOpenKey(null);
  }

  function handleManualBlur() {
    const parsed = parseTimeInput(manualValue);
    if (parsed) {
      const next = formatParts(parsed);
      setManualValue(next);
      onChange(next);
      return;
    }

    setManualValue(value);
  }

  const cx = 120;
  const cy = 120;
  const handLength = stage === "hour" ? 58 : 84;
  const activeAngle = stage === "hour" ? angleForHour(draft.hour12) : angleForMinute(draft.minute);
  const handTip = polarToCartesian(activeAngle, handLength, cx, cy);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span
          style={{
            fontFamily: UI_TYPO.family,
            fontSize: 12,
            fontWeight: UI_TYPO.weightSemibold,
            color: theme.textMuted,
          }}
        >
          {label}
        </span>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 40px",
            gap: 8,
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={manualValue}
            onChange={(e) => setManualValue(e.target.value)}
            onBlur={handleManualBlur}
            placeholder="9:15 AM"
            style={{
              height: 38,
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background:
                theme.pageBg === "#eef3f8"
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.04)",
              color: theme.text,
              padding: "0 12px",
              fontFamily: UI_TYPO.family,
              fontSize: 14,
              fontWeight: UI_TYPO.weightMedium,
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <button
            type="button"
            onClick={() => setOpenKey(isOpen ? null : id)}
            title="Open time picker"
            style={{
              height: 38,
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background:
                theme.pageBg === "#eef3f8"
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.04)",
              color: theme.textMuted,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            🕘
          </button>
        </div>
      </label>

      {isOpen ? (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 320,
            borderRadius: 18,
            border: `1px solid ${theme.border}`,
            background:
              theme.pageBg === "#eef3f8"
                ? "rgba(255,255,255,0.98)"
                : "rgba(15,22,32,0.98)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.24)",
            padding: 14,
            zIndex: 30,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              fontFamily: UI_TYPO.family,
              fontSize: 14,
              fontWeight: UI_TYPO.weightBold,
              color: theme.text,
              marginBottom: 10,
            }}
          >
            {label}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setStage("hour")}
              style={{
                minWidth: 54,
                height: 34,
                borderRadius: 10,
                border: `1px solid ${
                  stage === "hour" ? "rgba(96,165,250,0.95)" : theme.border
                }`,
                background:
                  stage === "hour"
                    ? "rgba(37,99,235,0.18)"
                    : "rgba(255,255,255,0.03)",
                color: theme.text,
                fontFamily: UI_TYPO.family,
                fontSize: 14,
                fontWeight: UI_TYPO.weightBold,
                cursor: "pointer",
              }}
            >
              {draft.hour12}
            </button>

            <div
              style={{
                color: theme.textMuted,
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightBold,
              }}
            >
              :
            </div>

            <button
              type="button"
              onClick={() => setStage("minute")}
              style={{
                minWidth: 54,
                height: 34,
                borderRadius: 10,
                border: `1px solid ${
                  stage === "minute" ? "rgba(96,165,250,0.95)" : theme.border
                }`,
                background:
                  stage === "minute"
                    ? "rgba(37,99,235,0.18)"
                    : "rgba(255,255,255,0.03)",
                color: theme.text,
                fontFamily: UI_TYPO.family,
                fontSize: 14,
                fontWeight: UI_TYPO.weightBold,
                cursor: "pointer",
              }}
            >
              {String(draft.minute).padStart(2, "0")}
            </button>

            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              <ChoiceButton
                label="AM"
                active={draft.period === "AM"}
                onClick={() => setDraft((prev) => ({ ...prev, period: "AM" }))}
                theme={theme}
              />
              <ChoiceButton
                label="PM"
                active={draft.period === "PM"}
                onClick={() => setDraft((prev) => ({ ...prev, period: "PM" }))}
                theme={theme}
              />
            </div>
          </div>

          <div
            data-clock-face="true"
            onMouseDown={(e) => {
              updateFromPoint(e.clientX, e.clientY);

              const activeStage = stage;
              const handleMove = (moveEvent: MouseEvent) => {
                updateFromPoint(moveEvent.clientX, moveEvent.clientY, activeStage);
              };
              const handleUp = () => {
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
              };

              window.addEventListener("mousemove", handleMove);
              window.addEventListener("mouseup", handleUp);
            }}
            style={{
              width: 240,
              height: 240,
              margin: "0 auto 12px",
              position: "relative",
              cursor: "crosshair",
              userSelect: "none",
            }}
          >
            <svg width="240" height="240" viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r="102"
                fill="transparent"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              {stage === "hour"
                ? Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => {
                    const pos = polarToCartesian(angleForHour(hour), 86, 120, 120);
                    return (
                      <text
                        key={hour}
                        x={pos.x}
                        y={pos.y + 5}
                        textAnchor="middle"
                        style={{
                          fontFamily: UI_TYPO.family,
                          fontSize: 14,
                          fontWeight:
                            draft.hour12 === hour
                              ? UI_TYPO.weightBold
                              : UI_TYPO.weightSemibold,
                          fill:
                            draft.hour12 === hour
                              ? "#93c5fd"
                              : "rgba(214,227,243,0.84)",
                        }}
                      >
                        {hour}
                      </text>
                    );
                  })
                : Array.from({ length: 60 }, (_, minute) => {
                    const angle = angleForMinute(minute);
                    const isMajor = minute % 5 === 0;
                    const outer = polarToCartesian(angle, 102, 120, 120);
                    const inner = polarToCartesian(angle, isMajor ? 92 : 96, 120, 120);

                    return (
                      <g key={minute}>
                        <line
                          x1={inner.x}
                          y1={inner.y}
                          x2={outer.x}
                          y2={outer.y}
                          stroke={
                            draft.minute === minute
                              ? "#93c5fd"
                              : isMajor
                                ? "rgba(214,227,243,0.84)"
                                : "rgba(214,227,243,0.32)"
                          }
                          strokeWidth={isMajor ? 2 : 1}
                        />
                        {isMajor ? (
                          <text
                            x={polarToCartesian(angle, 78, 120, 120).x}
                            y={polarToCartesian(angle, 78, 120, 120).y + 4}
                            textAnchor="middle"
                            style={{
                              fontFamily: UI_TYPO.family,
                              fontSize: 11,
                              fontWeight:
                                draft.minute === minute
                                  ? UI_TYPO.weightBold
                                  : UI_TYPO.weightSemibold,
                              fill:
                                draft.minute === minute
                                  ? "#93c5fd"
                                  : "rgba(214,227,243,0.84)",
                            }}
                          >
                            {String(minute).padStart(2, "0")}
                          </text>
                        ) : null}
                      </g>
                    );
                  })}

              <line
                x1="120"
                y1="120"
                x2={handTip.x}
                y2={handTip.y}
                stroke="#60a5fa"
                strokeWidth={stage === "hour" ? 5 : 4}
                strokeLinecap="round"
              />

              <circle cx="120" cy="120" r="7" fill="#60a5fa" />

              <text
                x="120"
                y="124"
                textAnchor="middle"
                style={{
                  fontFamily: UI_TYPO.family,
                  fontSize: 12,
                  fontWeight: UI_TYPO.weightMedium,
                  fill: "rgba(214,227,243,0.70)",
                }}
              >
                {stage === "hour" ? "Hours" : "Minutes"}
              </text>
            </svg>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setOpenKey(null)}
              style={{
                height: 34,
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                background: "rgba(255,255,255,0.03)",
                color: theme.textMuted,
                padding: "0 12px",
                fontFamily: UI_TYPO.family,
                fontSize: 13,
                fontWeight: UI_TYPO.weightSemibold,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              style={{
                height: 34,
                borderRadius: 10,
                border: "1px solid rgba(96,165,250,0.95)",
                background: "rgba(37,99,235,0.18)",
                color: theme.text,
                padding: "0 12px",
                fontFamily: UI_TYPO.family,
                fontSize: 13,
                fontWeight: UI_TYPO.weightSemibold,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SettingsPanel(props: Props) {
  const {
    open,
    onClose,
    theme,
    appearance,
    onChangeAppearance,
    includeCoverSheet,
    onToggleIncludeCoverSheet,
    showCoverDateTime,
    onToggleShowCoverDateTime,
    p1CoverDateText,
    onChangeP1CoverDateText,
    p1StartTimeText,
    onChangeP1StartTimeText,
    p1EndTimeText,
    onChangeP1EndTimeText,
    p2CoverDateText,
    onChangeP2CoverDateText,
    p2StartTimeText,
    onChangeP2StartTimeText,
    p2EndTimeText,
    onChangeP2EndTimeText,
    showScottishCandidateNumberBox,
    onToggleShowScottishCandidateNumberBox,
    includeFormulaSheet,
    onToggleIncludeFormulaSheet,
    showProgressPanel,
    onToggleShowProgressPanel,
    onResetLayout,
    onResetZoom,
  } = props;

  const [openTimePickerKey, setOpenTimePickerKey] = useState<string | null>(null);

  const showSittingDetails = includeCoverSheet && showCoverDateTime;

  useEffect(() => {
    if (!open) setOpenTimePickerKey(null);
  }, [open]);

  const sectionBg = useMemo(
    () =>
      theme.pageBg === "#eef3f8"
        ? "rgba(255,255,255,0.84)"
        : "rgba(255,255,255,0.03)",
    [theme.pageBg]
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 180ms ease",
          zIndex: 120,
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 56,
          right: 0,
          bottom: 0,
          width: 560,
          maxWidth: "96vw",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 220ms ease",
          background:
            theme.pageBg === "#eef3f8"
              ? "rgba(248,250,252,0.98)"
              : "rgba(11,17,24,0.98)",
          borderLeft: `1px solid ${theme.border}`,
          boxShadow: "-20px 0 40px rgba(0,0,0,0.20)",
          zIndex: 121,
          display: "grid",
          gridTemplateRows: "60px 1fr",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: UI_TYPO.family,
                fontSize: 18,
                fontWeight: UI_TYPO.weightBold,
                color: theme.text,
                marginBottom: 3,
              }}
            >
              Settings
            </div>
            <div
              style={{
                fontFamily: UI_TYPO.family,
                fontSize: 12,
                color: theme.textMuted,
              }}
            >
              Viewer, layout and cover-sheet options
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: `1px solid ${theme.border}`,
              background: "rgba(255,255,255,0.03)",
              color: theme.textMuted,
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            padding: "18px 18px 28px",
            display: "grid",
            gap: 18,
          }}
        >
          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 16,
              background: sectionBg,
            }}
          >
            <div
              style={{
                fontFamily: UI_TYPO.family,
                fontSize: 15,
                fontWeight: UI_TYPO.weightBold,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              Paper content
            </div>

            <ToggleRow
              label="Include cover sheet"
              checked={includeCoverSheet}
              onChange={onToggleIncludeCoverSheet}
              theme={theme}
            />

            <ToggleRow
              label="Include formula sheet"
              checked={includeFormulaSheet}
              onChange={onToggleIncludeFormulaSheet}
              theme={theme}
            />

            <ToggleRow
              label="Show date and time on cover sheet"
              checked={showCoverDateTime}
              onChange={onToggleShowCoverDateTime}
              theme={theme}
            />

            <ToggleRow
              label="Show Scottish candidate number box"
              checked={showScottishCandidateNumberBox}
              onChange={onToggleShowScottishCandidateNumberBox}
              theme={theme}
            />
          </section>

          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 16,
              background: sectionBg,
            }}
          >
            <div
              style={{
                fontFamily: UI_TYPO.family,
                fontSize: 15,
                fontWeight: UI_TYPO.weightBold,
                color: theme.text,
                marginBottom: 6,
              }}
            >
              Workspace
            </div>

            <ToggleRow
              label="Show progress panel"
              checked={showProgressPanel}
              onChange={onToggleShowProgressPanel}
              theme={theme}
            />

            <div
              style={{
                display: "flex",
                gap: 10,
                paddingTop: 14,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={onResetLayout}
                style={{
                  height: 38,
                  borderRadius: 12,
                  border: `1px solid ${theme.border}`,
                  background: "rgba(255,255,255,0.03)",
                  color: theme.text,
                  padding: "0 14px",
                  fontFamily: UI_TYPO.family,
                  fontSize: 13,
                  fontWeight: UI_TYPO.weightSemibold,
                  cursor: "pointer",
                }}
              >
                Reset layout
              </button>

              <button
                type="button"
                onClick={onResetZoom}
                style={{
                  height: 38,
                  borderRadius: 12,
                  border: `1px solid ${theme.border}`,
                  background: "rgba(255,255,255,0.03)",
                  color: theme.text,
                  padding: "0 14px",
                  fontFamily: UI_TYPO.family,
                  fontSize: 13,
                  fontWeight: UI_TYPO.weightSemibold,
                  cursor: "pointer",
                }}
              >
                Reset zoom
              </button>
            </div>
          </section>

          {showSittingDetails ? (
            <>
              <section
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 16,
                  background: sectionBg,
                  display: "grid",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: UI_TYPO.family,
                      fontSize: 15,
                      fontWeight: UI_TYPO.weightBold,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    Paper 1 sitting details
                  </div>
                  <div
                    style={{
                      fontFamily: UI_TYPO.family,
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: theme.textMuted,
                    }}
                  >
                    Used on the Paper 1 cover sheet when date/time display is turned on.
                  </div>
                </div>

                <Field
                  label="Paper 1 date"
                  type="date"
                  value={p1CoverDateText}
                  onChange={onChangeP1CoverDateText}
                  theme={theme}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <TimePickerField
                    id="p1-start"
                    label="Paper 1 start"
                    value={p1StartTimeText}
                    onChange={onChangeP1StartTimeText}
                    openKey={openTimePickerKey}
                    setOpenKey={setOpenTimePickerKey}
                    nextOpenKey="p1-end"
                    theme={theme}
                  />

                  <TimePickerField
                    id="p1-end"
                    label="Paper 1 end"
                    value={p1EndTimeText}
                    onChange={onChangeP1EndTimeText}
                    openKey={openTimePickerKey}
                    setOpenKey={setOpenTimePickerKey}
                    theme={theme}
                  />
                </div>
              </section>

              <section
                style={{
                  border: `1px solid ${theme.border}`,
                  borderRadius: 18,
                  padding: 16,
                  background: sectionBg,
                  display: "grid",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: UI_TYPO.family,
                      fontSize: 15,
                      fontWeight: UI_TYPO.weightBold,
                      color: theme.text,
                      marginBottom: 4,
                    }}
                  >
                    Paper 2 sitting details
                  </div>
                  <div
                    style={{
                      fontFamily: UI_TYPO.family,
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: theme.textMuted,
                    }}
                  >
                    Use this if Paper 2 sits at a different date or time from Paper 1.
                  </div>
                </div>

                <Field
                  label="Paper 2 date"
                  type="date"
                  value={p2CoverDateText}
                  onChange={onChangeP2CoverDateText}
                  theme={theme}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <TimePickerField
                    id="p2-start"
                    label="Paper 2 start"
                    value={p2StartTimeText}
                    onChange={onChangeP2StartTimeText}
                    openKey={openTimePickerKey}
                    setOpenKey={setOpenTimePickerKey}
                    nextOpenKey="p2-end"
                    theme={theme}
                  />

                  <TimePickerField
                    id="p2-end"
                    label="Paper 2 end"
                    value={p2EndTimeText}
                    onChange={onChangeP2EndTimeText}
                    openKey={openTimePickerKey}
                    setOpenKey={setOpenTimePickerKey}
                    theme={theme}
                  />
                </div>
              </section>
            </>
          ) : null}

          <section
            style={{
              border: `1px solid ${theme.border}`,
              borderRadius: 18,
              padding: 16,
              background: sectionBg,
            }}
          >
            <div
              style={{
                fontFamily: UI_TYPO.family,
                fontSize: 15,
                fontWeight: UI_TYPO.weightBold,
                color: theme.text,
                marginBottom: 12,
              }}
            >
              Appearance
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <ChoiceButton
                label="System"
                active={appearance === "system"}
                onClick={() => onChangeAppearance("system")}
                theme={theme}
              />
              <ChoiceButton
                label="Light"
                active={appearance === "light"}
                onClick={() => onChangeAppearance("light")}
                theme={theme}
              />
              <ChoiceButton
                label="Dark"
                active={appearance === "dark"}
                onClick={() => onChangeAppearance("dark")}
                theme={theme}
              />
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}