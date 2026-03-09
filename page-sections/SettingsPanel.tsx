"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppTheme as Theme, AppearancePreference } from "@/app/ui/appTheme";
import SharedCalendarPicker from "@/page-sections/SharedCalendarPicker";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;

  appearance: AppearancePreference;
  onChangeAppearance: (value: AppearancePreference) => void;

  includeCoverSheet: boolean;
  onToggleIncludeCoverSheet: (next: boolean) => void;

  includeFormulaSheet: boolean;
  onToggleIncludeFormulaSheet: (next: boolean) => void;

  showCoverDateTime: boolean;
  onToggleShowCoverDateTime: (next: boolean) => void;

  showScottishCandidateNumberBox: boolean;
  onToggleShowScottishCandidateNumberBox: (next: boolean) => void;

  showProgressPanel: boolean;
  onToggleShowProgressPanel: (next: boolean) => void;

  onResetLayout: () => void;
  onResetZoom: () => void;

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
};

type ActivePicker =
  | null
  | "p1Date"
  | "p1Start"
  | "p1End"
  | "p2Date"
  | "p2Start"
  | "p2End";

type TimeDraft = {
  hour12: number;
  minute: number;
  meridiem: "AM" | "PM";
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function parseTimeText(text: string): TimeDraft {
  const trimmed = text.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) {
    return {
      hour12: 9,
      minute: 0,
      meridiem: "AM",
    };
  }

  const hour12 = clamp(Number(match[1]) || 9, 1, 12);
  const minute = clamp(Number(match[2]) || 0, 0, 59);
  const meridiem = match[3] === "PM" ? "PM" : "AM";

  return { hour12, minute, meridiem };
}

function formatTimeText(draft: TimeDraft) {
  return `${draft.hour12}:${pad2(draft.minute)} ${draft.meridiem}`;
}

function getDialPointFromPointer(
  event: React.PointerEvent<HTMLDivElement>,
  element: HTMLDivElement,
) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;

  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360;

  return { angle };
}

function getMinuteFromAngle(angle: number) {
  const exactMinute = angle / 6;
  const snappedFive = Math.round(exactMinute / 5) * 5;
  const wrappedSnappedFive = ((snappedFive % 60) + 60) % 60;
  const distanceToFive = Math.abs(exactMinute - snappedFive);

  if (distanceToFive <= 1.15) {
    return wrappedSnappedFive;
  }

  return ((Math.round(exactMinute) % 60) + 60) % 60;
}

function getHourFromAngle(angle: number) {
  const exactHour = angle / 30;
  let hour = Math.round(exactHour);
  hour = ((hour % 12) + 12) % 12;
  return hour === 0 ? 12 : hour;
}

function angleFromMinute(minute: number) {
  return minute * 6;
}

function angleFromHour(hour12: number) {
  return (hour12 % 12) * 30;
}

function ToggleRow({
  label,
  checked,
  onChange,
  theme,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  theme: Theme;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 16,
        minWidth: 0,
        padding: "14px 0",
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.35,
          minWidth: 0,
          wordBreak: "break-word",
        }}
      >
        {label}
      </div>

      <button
        type="button"
        aria-pressed={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: "relative",
          width: 52,
          height: 30,
          borderRadius: 999,
          border: `1px solid ${checked ? theme.accent : theme.border}`,
          background: checked ? theme.accentSoft : theme.buttonGhostBg,
          transition: "all 140ms ease",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 25 : 3,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: checked ? theme.accent : "#ffffff",
            transition: "all 140ms ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.24)",
          }}
        />
      </button>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
  theme,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <section
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        background: theme.panelBg2,
        boxShadow: "0 10px 30px rgba(0,0,0,0.12) inset",
      }}
    >
      <div style={{ marginBottom: subtitle ? 14 : 10 }}>
        <div
          style={{
            color: theme.text,
            fontSize: 16,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 6,
              color: theme.subtleText,
              fontSize: 14,
              lineHeight: 1.45,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function AppearanceControl({
  appearance,
  onChange,
  theme,
}: {
  appearance: AppearancePreference;
  onChange: (value: AppearancePreference) => void;
  theme: Theme;
}) {
  const options: AppearancePreference[] = ["light", "dark"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0,1fr))",
        gap: 10,
      }}
    >
      {options.map((option) => {
        const active = appearance === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={{
              minHeight: 42,
              borderRadius: 14,
              border: `1px solid ${active ? theme.accent : theme.border}`,
              background: active ? theme.accentSoft : theme.buttonGhostBg,
              color: theme.text,
              fontSize: 14,
              fontWeight: 700,
              textTransform: "capitalize",
              cursor: "pointer",
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function FieldLabel({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme;
}) {
  return (
    <div
      style={{
        marginBottom: 8,
        color: theme.subtleText,
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

function IntegratedField({
  value,
  placeholder,
  icon,
  onClick,
  onChange,
  theme,
  muted = false,
}: {
  value: string;
  placeholder?: string;
  icon: string;
  onClick: () => void;
  onChange: (next: string) => void;
  theme: Theme;
  muted?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        placeholder={placeholder}
        onFocus={onClick}
        onClick={onClick}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 40,
          borderRadius: 14,
          border: `1px solid ${theme.border}`,
          background: muted ? theme.inputBgSoft : theme.inputBg,
          color: muted ? theme.subtleText : theme.text,
          padding: "0 42px 0 14px",
          fontSize: 15,
          fontWeight: 700,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <button
        type="button"
        onClick={onClick}
        style={{
          position: "absolute",
          right: 6,
          top: 6,
          width: 28,
          height: 28,
          borderRadius: 10,
          border: `1px solid ${theme.border}`,
          background: theme.buttonGhostBg,
          color: theme.subtleText,
          fontSize: 14,
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}
        aria-label="Open picker"
      >
        {icon}
      </button>
    </div>
  );
}

function TimePickerInline({
  theme,
  value,
  label,
  onCancel,
  onApply,
}: {
  theme: Theme;
  value: string;
  label: string;
  onCancel: () => void;
  onApply: (next: string) => void;
}) {
  const initial = parseTimeText(value);
  const [draft, setDraft] = useState<TimeDraft>(initial);
  const [mode, setMode] = useState<"hour" | "minute">("hour");
  const dialRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dialSize = 252;
  const radius = 96;
  const center = dialSize / 2;

  const displayHourAngle = angleFromHour(draft.hour12);
  const displayMinuteAngle = angleFromMinute(draft.minute);
  const activeAngle = mode === "hour" ? displayHourAngle : displayMinuteAngle;
  const activeAngleRad = ((activeAngle - 90) * Math.PI) / 180;
  const handLength = 64;

  const handX = center + handLength * Math.cos(activeAngleRad);
  const handY = center + handLength * Math.sin(activeAngleRad);

  const hourPositions = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const valueNumber = index === 0 ? 12 : index;
      const angle = valueNumber * 30;
      const angleRad = ((angle - 90) * Math.PI) / 180;

      return {
        valueNumber,
        x: center + radius * Math.cos(angleRad),
        y: center + radius * Math.sin(angleRad),
      };
    });
  }, [center, radius]);

  function applyPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (!dialRef.current) return;

    const { angle } = getDialPointFromPointer(event, dialRef.current);

    if (mode === "hour") {
      const nextHour = getHourFromAngle(angle);
      setDraft((prev) => ({
        ...prev,
        hour12: nextHour,
      }));
    } else {
      const nextMinute = getMinuteFromAngle(angle);
      setDraft((prev) => ({
        ...prev,
        minute: nextMinute,
      }));
    }
  }

  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 18,
        border: `1px solid ${theme.border}`,
        background: theme.panelBg,
        padding: 14,
        boxShadow: theme.shadow,
      }}
    >
      <div
        style={{
          color: theme.text,
          fontSize: 15,
          fontWeight: 800,
          marginBottom: 12,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "56px 10px 56px 1fr auto auto",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <PickerNumberButton
          value={String(draft.hour12)}
          active={mode === "hour"}
          onClick={() => setMode("hour")}
          theme={theme}
        />
        <div
          style={{
            textAlign: "center",
            color: theme.subtleText,
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          :
        </div>
        <PickerNumberButton
          value={pad2(draft.minute)}
          active={mode === "minute"}
          onClick={() => setMode("minute")}
          theme={theme}
        />

        <div />

        <PickerAmPmButton
          value="AM"
          active={draft.meridiem === "AM"}
          onClick={() => setDraft((prev) => ({ ...prev, meridiem: "AM" }))}
          theme={theme}
        />
        <PickerAmPmButton
          value="PM"
          active={draft.meridiem === "PM"}
          onClick={() => setDraft((prev) => ({ ...prev, meridiem: "PM" }))}
          theme={theme}
        />
      </div>

      <div
        ref={dialRef}
        onPointerDown={(event) => {
          setIsDragging(true);
          applyPointer(event);
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {}
        }}
        onPointerMove={(event) => {
          if (!isDragging) return;
          applyPointer(event);
        }}
        onPointerUp={(event) => {
          setIsDragging(false);
          try {
            event.currentTarget.releasePointerCapture(event.pointerId);
          } catch {}
        }}
        onPointerCancel={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        style={{
          width: dialSize,
          height: dialSize,
          margin: "0 auto 16px auto",
          position: "relative",
          borderRadius: "50%",
          border: `1px solid ${theme.border}`,
          background: theme.panelBg2,
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {Array.from({ length: 60 }, (_, index) => {
          const angle = index * 6;
          const angleRad = ((angle - 90) * Math.PI) / 180;
          const isMajor = index % 5 === 0;
          const outerRadius = 116;
          const innerRadius = isMajor ? 104 : 109;

          const x1 = center + outerRadius * Math.cos(angleRad);
          const y1 = center + outerRadius * Math.sin(angleRad);
          const x2 = center + innerRadius * Math.cos(angleRad);
          const y2 = center + innerRadius * Math.sin(angleRad);

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: Math.min(x1, x2),
                top: Math.min(y1, y2),
                width: Math.abs(x2 - x1) || 1.5,
                height: Math.abs(y2 - y1) || 1.5,
                pointerEvents: "none",
              }}
            >
              <svg
                width={Math.abs(x2 - x1) || 2}
                height={Math.abs(y2 - y1) || 2}
                style={{
                  overflow: "visible",
                  position: "absolute",
                  inset: 0,
                }}
              >
                <line
                  x1={x1 - Math.min(x1, x2)}
                  y1={y1 - Math.min(y1, y2)}
                  x2={x2 - Math.min(x1, x2)}
                  y2={y2 - Math.min(y1, y2)}
                  stroke={isMajor ? theme.subtleText : theme.mutedText}
                  strokeWidth={isMajor ? 1.8 : 1}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}

        <svg
          width={dialSize}
          height={dialSize}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <line
            x1={center}
            y1={center}
            x2={handX}
            y2={handY}
            stroke={theme.accent}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={center} cy={center} r="8" fill={theme.accent} />
        </svg>

        {hourPositions.map((point) => {
          const isActive = mode === "hour" && point.valueNumber === draft.hour12;

          return (
            <button
              key={point.valueNumber}
              type="button"
              onClick={() => {
                setMode("hour");
                setDraft((prev) => ({
                  ...prev,
                  hour12: point.valueNumber,
                }));
              }}
              style={{
                position: "absolute",
                left: point.x - 18,
                top: point.y - 18,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: isActive ? theme.accentSoft : "transparent",
                color: theme.text,
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {point.valueNumber}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div>
          <FieldLabel theme={theme}>Hour</FieldLabel>
          <input
            value={String(draft.hour12)}
            onChange={(e) => {
              const next = clamp(Number(e.target.value) || 1, 1, 12);
              setDraft((prev) => ({ ...prev, hour12: next }));
            }}
            onFocus={() => setMode("hour")}
            style={pickerTextInputStyle(theme)}
          />
        </div>

        <div>
          <FieldLabel theme={theme}>Minute</FieldLabel>
          <input
            value={pad2(draft.minute)}
            onChange={(e) => {
              const raw = Number(e.target.value);
              const next = clamp(Number.isNaN(raw) ? 0 : raw, 0, 59);
              setDraft((prev) => ({ ...prev, minute: next }));
            }}
            onFocus={() => setMode("minute")}
            style={pickerTextInputStyle(theme)}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 14,
        }}
      >
        <button type="button" onClick={onCancel} style={pickerGhostButtonStyle(theme)}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(formatTimeText(draft))}
          style={pickerPrimaryButtonStyle(theme)}
        >
          OK
        </button>
      </div>
    </div>
  );
}

function PickerNumberButton({
  value,
  active,
  onClick,
  theme,
}: {
  value: string;
  active: boolean;
  onClick: () => void;
  theme: Theme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 36,
        borderRadius: 12,
        border: `1px solid ${active ? theme.accent : theme.border}`,
        background: active ? theme.accentSoft : theme.buttonGhostBg,
        color: theme.text,
        fontWeight: 800,
        fontSize: 16,
        cursor: "pointer",
      }}
    >
      {value}
    </button>
  );
}

function PickerAmPmButton({
  value,
  active,
  onClick,
  theme,
}: {
  value: "AM" | "PM";
  active: boolean;
  onClick: () => void;
  theme: Theme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 36,
        minWidth: 48,
        padding: "0 12px",
        borderRadius: 12,
        border: `1px solid ${active ? theme.accent : theme.border}`,
        background: active ? theme.accentSoft : theme.buttonGhostBg,
        color: theme.text,
        fontWeight: 800,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {value}
    </button>
  );
}

function pickerTextInputStyle(theme: Theme): React.CSSProperties {
  return {
    width: "100%",
    height: 38,
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.inputBg,
    color: theme.text,
    padding: "0 12px",
    fontSize: 14,
    fontWeight: 700,
    outline: "none",
    boxSizing: "border-box",
  };
}

function pickerGhostButtonStyle(theme: Theme): React.CSSProperties {
  return {
    height: 36,
    minWidth: 84,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    background: theme.buttonGhostBg,
    color: theme.text,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };
}

function pickerPrimaryButtonStyle(theme: Theme): React.CSSProperties {
  return {
    height: 36,
    minWidth: 72,
    padding: "0 16px",
    borderRadius: 12,
    border: `1px solid ${theme.accent}`,
    background: theme.accentSoft,
    color: theme.text,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  };
}

export default function SettingsPanel({
  open,
  onClose,
  theme,
  appearance,
  onChangeAppearance,
  includeCoverSheet,
  onToggleIncludeCoverSheet,
  includeFormulaSheet,
  onToggleIncludeFormulaSheet,
  showCoverDateTime,
  onToggleShowCoverDateTime,
  showScottishCandidateNumberBox,
  onToggleShowScottishCandidateNumberBox,
  showProgressPanel,
  onToggleShowProgressPanel,
  onResetLayout,
  onResetZoom,
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
}: Props) {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [paper2DateLinked, setPaper2DateLinked] = useState(
    !p2CoverDateText || p2CoverDateText === p1CoverDateText,
  );

  useEffect(() => {
    if (!open) {
      setActivePicker(null);
    }
  }, [open]);

  useEffect(() => {
    if (paper2DateLinked) {
      onChangeP2CoverDateText(p1CoverDateText);
    }
  }, [paper2DateLinked, p1CoverDateText, onChangeP2CoverDateText]);

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!open) return;
      if (!drawerRef.current) return;
      if (drawerRef.current.contains(event.target as Node)) return;
      onClose();
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: open ? "auto" : "none",
        zIndex: 200,
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: open ? theme.overlay : "transparent",
          opacity: open ? 1 : 0,
          transition: "opacity 180ms ease",
        }}
      />

      <aside
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(460px, calc(100vw - 24px))",
          maxWidth: "calc(100vw - 24px)",
          borderLeft: `1px solid ${theme.border}`,
          background: theme.panelBg,
          boxShadow: theme.shadow,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(104%)",
          transition: "transform 220ms ease",
        }}
      >
        <style jsx>{`
          .settings-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }

          .settings-scroll:hover {
            scrollbar-color: rgba(104, 168, 255, 0.45) transparent;
          }

          .settings-scroll::-webkit-scrollbar {
            width: 8px;
          }

          .settings-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .settings-scroll::-webkit-scrollbar-thumb {
            background: transparent;
            border-radius: 999px;
          }

          .settings-scroll:hover::-webkit-scrollbar-thumb {
            background: rgba(104, 168, 255, 0.45);
          }
        `}</style>

        <div
          style={{
            padding: "18px 18px 14px 18px",
            borderBottom: `1px solid ${theme.border}`,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 14,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                color: theme.text,
                fontSize: 18,
                fontWeight: 900,
                lineHeight: 1.15,
              }}
            >
              Settings
            </div>
            <div
              style={{
                marginTop: 4,
                color: theme.subtleText,
                fontSize: 14,
                lineHeight: 1.4,
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
              borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: theme.buttonGhostBg,
              color: theme.subtleText,
              fontSize: 18,
              cursor: "pointer",
            }}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div
          className="settings-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            padding: 18,
            display: "grid",
            gap: 18,
            alignContent: "start",
          }}
        >
          <SectionCard title="Paper content" theme={theme}>
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
          </SectionCard>

          <SectionCard title="Workspace" theme={theme}>
            <ToggleRow
              label="Show progress panel"
              checked={showProgressPanel}
              onChange={onToggleShowProgressPanel}
              theme={theme}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                paddingTop: 14,
              }}
            >
              <button
                type="button"
                onClick={onResetLayout}
                style={pickerGhostButtonStyle(theme)}
              >
                Reset layout
              </button>
              <button
                type="button"
                onClick={onResetZoom}
                style={pickerGhostButtonStyle(theme)}
              >
                Reset zoom
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="Paper 1 sitting details"
            subtitle="Linked to the Assessment Date"
            theme={theme}
          >
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <FieldLabel theme={theme}>Paper 1 date</FieldLabel>
                <IntegratedField
                  value={p1CoverDateText}
                  onChange={onChangeP1CoverDateText}
                  onClick={() => setActivePicker("p1Date")}
                  icon="🗓️"
                  theme={theme}
                />
                {activePicker === "p1Date" ? (
                  <SharedCalendarPicker
                    theme={theme}
                    value={p1CoverDateText}
                    onCancel={() => setActivePicker(null)}
                    onApply={(next) => {
                      onChangeP1CoverDateText(next);
                      setActivePicker(null);
                    }}
                  />
                ) : null}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <FieldLabel theme={theme}>Paper 1 start</FieldLabel>
                  <IntegratedField
                    value={p1StartTimeText}
                    onChange={onChangeP1StartTimeText}
                    onClick={() => setActivePicker("p1Start")}
                    icon="🕘"
                    theme={theme}
                  />
                </div>

                <div>
                  <FieldLabel theme={theme}>Paper 1 end</FieldLabel>
                  <IntegratedField
                    value={p1EndTimeText}
                    onChange={onChangeP1EndTimeText}
                    onClick={() => setActivePicker("p1End")}
                    icon="🕘"
                    theme={theme}
                  />
                </div>
              </div>

              {activePicker === "p1Start" ? (
                <TimePickerInline
                  theme={theme}
                  value={p1StartTimeText}
                  label="Paper 1 start"
                  onCancel={() => setActivePicker(null)}
                  onApply={(next) => {
                    onChangeP1StartTimeText(next);
                    setActivePicker("p1End");
                  }}
                />
              ) : null}

              {activePicker === "p1End" ? (
                <TimePickerInline
                  theme={theme}
                  value={p1EndTimeText}
                  label="Paper 1 end"
                  onCancel={() => setActivePicker(null)}
                  onApply={(next) => {
                    onChangeP1EndTimeText(next);
                    setActivePicker(null);
                  }}
                />
              ) : null}
            </div>
          </SectionCard>

          <SectionCard
            title="Paper 2 sitting details"
            subtitle="Edit only if Paper 2 is sat on a different day to Paper 1."
            theme={theme}
          >
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <FieldLabel theme={theme}>Paper 2 date</FieldLabel>
                <IntegratedField
                  value={paper2DateLinked ? p1CoverDateText : p2CoverDateText}
                  onChange={(next) => {
                    setPaper2DateLinked(false);
                    onChangeP2CoverDateText(next);
                  }}
                  onClick={() => {
                    setPaper2DateLinked(false);
                    setActivePicker("p2Date");
                  }}
                  icon="🗓️"
                  theme={theme}
                  muted={paper2DateLinked}
                />
                {activePicker === "p2Date" ? (
                  <SharedCalendarPicker
                    theme={theme}
                    value={paper2DateLinked ? p1CoverDateText : p2CoverDateText}
                    onCancel={() => setActivePicker(null)}
                    onApply={(next) => {
                      setPaper2DateLinked(false);
                      onChangeP2CoverDateText(next);
                      setActivePicker(null);
                    }}
                  />
                ) : null}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                  gap: 12,
                }}
              >
                <div>
                  <FieldLabel theme={theme}>Paper 2 start</FieldLabel>
                  <IntegratedField
                    value={p2StartTimeText}
                    onChange={onChangeP2StartTimeText}
                    onClick={() => setActivePicker("p2Start")}
                    icon="🕘"
                    theme={theme}
                  />
                </div>

                <div>
                  <FieldLabel theme={theme}>Paper 2 end</FieldLabel>
                  <IntegratedField
                    value={p2EndTimeText}
                    onChange={onChangeP2EndTimeText}
                    onClick={() => setActivePicker("p2End")}
                    icon="🕘"
                    theme={theme}
                  />
                </div>
              </div>

              {activePicker === "p2Start" ? (
                <TimePickerInline
                  theme={theme}
                  value={p2StartTimeText}
                  label="Paper 2 start"
                  onCancel={() => setActivePicker(null)}
                  onApply={(next) => {
                    onChangeP2StartTimeText(next);
                    setActivePicker("p2End");
                  }}
                />
              ) : null}

              {activePicker === "p2End" ? (
                <TimePickerInline
                  theme={theme}
                  value={p2EndTimeText}
                  label="Paper 2 end"
                  onCancel={() => setActivePicker(null)}
                  onApply={(next) => {
                    onChangeP2EndTimeText(next);
                    setActivePicker(null);
                  }}
                />
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Appearance" theme={theme}>
            <AppearanceControl
              appearance={appearance}
              onChange={onChangeAppearance}
              theme={theme}
            />
          </SectionCard>
        </div>
      </aside>
    </div>
  );
}