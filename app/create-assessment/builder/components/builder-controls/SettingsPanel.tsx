"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "@/ui/AppTheme";
import type { ThemeModePreference } from "@/ui/ThemeMode";
import { ACCENT_MAP, type AccentOption } from "@/ui/AccentPalette";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";
import AppSideTray from "@/app/ui/settings-bar/AppSideTray";
import AppTrayHeader from "@/app/ui/settings-bar/AppTrayHeader";
import AppTraySection from "@/app/ui/settings-bar/AppTraySection";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: Theme;

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

const THEME_OPTIONS: Array<{
  value: ThemeModePreference;
  label: string;
  helper: string;
}> = [
  { value: "system", label: "System", helper: "Match your device setting." },
  { value: "light", label: "Light", helper: "Use the light interface." },
  { value: "soft-grey", label: "Soft Grey", helper: "Lower contrast UI." },
  { value: "dark", label: "Dark", helper: "Use dark interface." },
  {
    value: "custom",
    label: "Custom",
    helper: "Generate a full theme from a base colour.",
  },
];

const WORD_COLOUR_ROWS: AccentOption[][] = [
  [
    "word-r1-c1",
    "word-r1-c2",
    "word-r1-c3",
    "word-r1-c4",
    "word-r1-c5",
    "word-r1-c6",
    "word-r1-c7",
  ],
  [
    "word-r2-c1",
    "word-r2-c2",
    "word-r2-c3",
    "word-r2-c4",
    "word-r2-c5",
    "word-r2-c6",
    "word-r2-c7",
    "word-r2-c8",
  ],
  [
    "word-r3-c1",
    "word-r3-c2",
    "word-r3-c3",
    "word-r3-c4",
    "word-r3-c5",
    "word-r3-c6",
    "word-r3-c7",
    "word-r3-c8",
    "word-r3-c9",
  ],
  [
    "word-r4-c1",
    "word-r4-c2",
    "word-r4-c3",
    "word-r4-c4",
    "word-r4-c5",
    "word-r4-c6",
    "word-r4-c7",
    "word-r4-c8",
    "word-r4-c9",
    "word-r4-c10",
  ],
  [
    "word-r5-c1",
    "word-r5-c2",
    "word-r5-c3",
    "word-r5-c4",
    "word-r5-c5",
    "word-r5-c6",
    "word-r5-c7",
    "word-r5-c8",
    "word-r5-c9",
    "word-r5-c10",
    "word-r5-c11",
  ],
  [
    "word-r6-c1",
    "word-r6-c2",
    "word-r6-c3",
    "word-r6-c4",
    "word-r6-c5",
    "word-r6-c6",
    "word-r6-c7",
    "word-r6-c8",
    "word-r6-c9",
    "word-r6-c10",
    "word-r6-c11",
    "word-r6-c12",
  ],
  [
    "word-r7-c1",
    "word-r7-c2",
    "word-r7-c3",
    "word-r7-c4",
    "word-r7-c5",
    "word-r7-c6",
    "word-r7-c7",
    "word-r7-c8",
    "word-r7-c9",
    "word-r7-c10",
    "word-r7-c11",
    "word-r7-c12",
    "word-r7-c13",
  ],
  [
    "word-r8-c1",
    "word-r8-c2",
    "word-r8-c3",
    "word-r8-c4",
    "word-r8-c5",
    "word-r8-c6",
    "word-r8-c7",
    "word-r8-c8",
    "word-r8-c9",
    "word-r8-c10",
    "word-r8-c11",
    "word-r8-c12",
    "word-r8-c13",
  ],
  [
    "word-r9-c1",
    "word-r9-c2",
    "word-r9-c3",
    "word-r9-c4",
    "word-r9-c5",
    "word-r9-c6",
    "word-r9-c7",
    "word-r9-c8",
    "word-r9-c9",
    "word-r9-c10",
    "word-r9-c11",
  ],
  [
    "word-r10-c1",
    "word-r10-c2",
    "word-r10-c3",
    "word-r10-c4",
    "word-r10-c5",
    "word-r10-c6",
    "word-r10-c7",
    "word-r10-c8",
    "word-r10-c9",
    "word-r10-c10",
  ],
  [
    "word-r11-c1",
    "word-r11-c2",
    "word-r11-c3",
    "word-r11-c4",
    "word-r11-c5",
    "word-r11-c6",
    "word-r11-c7",
    "word-r11-c8",
    "word-r11-c9",
  ],
  [
    "word-r12-c1",
    "word-r12-c2",
    "word-r12-c3",
    "word-r12-c4",
    "word-r12-c5",
    "word-r12-c6",
    "word-r12-c7",
    "word-r12-c8",
  ],
  [
    "word-r13-c1",
    "word-r13-c2",
    "word-r13-c3",
    "word-r13-c4",
    "word-r13-c5",
    "word-r13-c6",
    "word-r13-c7",
  ],
];

const WORD_NEUTRAL_TOP: AccentOption[] = [
  "word-neutral-t1",
  "word-neutral-t2",
  "word-neutral-t3",
  "word-neutral-t4",
  "word-neutral-t5",
  "word-neutral-t6",
  "word-neutral-t7",
];

const WORD_NEUTRAL_BOTTOM: AccentOption[] = [
  "word-neutral-b1",
  "word-neutral-b2",
  "word-neutral-b3",
  "word-neutral-b4",
  "word-neutral-b5",
  "word-neutral-b6",
  "word-neutral-b7",
];

const WORD_NEUTRAL_WHITE: AccentOption = "word-neutral-white";
const WORD_NEUTRAL_BLACK: AccentOption = "word-neutral-black";

type HoneycombCell = {
  id: AccentOption;
  row: number;
  col: number;
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
  element: HTMLDivElement
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

function getAccentLabel(id: AccentOption): string {
  if (id === WORD_NEUTRAL_WHITE) return "White";
  if (id === WORD_NEUTRAL_BLACK) return "Black";
  if (id.startsWith("word-neutral")) return "Grey";
  if (id.startsWith("word-r")) return "Word colour";
  return id;
}

function buildHoneycombCells(rows: AccentOption[][]): HoneycombCell[] {
  return rows.flatMap((row, rowIndex) =>
    row.map((id, colIndex) => ({
      id,
      row: rowIndex,
      col: colIndex,
    }))
  );
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
        borderBottom: `1px solid ${theme.borderStandard}`,
      }}
    >
      <div
        style={{
          color: theme.textPrimary,
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
          border: `1px solid ${
            checked ? theme.controlSelectedBorder : theme.borderStandard
          }`,
          background: checked ? theme.controlSelectedBg : theme.controlBg,
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
            background: checked ? theme.accentPrimary : theme.bgElevated,
            transition: "all 140ms ease",
            boxShadow: theme.shadow,
          }}
        />
      </button>
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
        color: theme.textMuted,
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
          border: `1px solid ${theme.borderStandard}`,
          background: muted ? theme.controlBg : theme.bgElevated,
          color: muted ? theme.textMuted : theme.textPrimary,
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
          border: `1px solid ${theme.borderStandard}`,
          background: theme.controlBg,
          color: theme.textMuted,
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
        border: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        padding: 14,
        boxShadow: theme.shadow,
      }}
    >
      <div
        style={{
          color: theme.textPrimary,
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
            color: theme.textMuted,
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
          border: `1px solid ${theme.borderStandard}`,
          background: theme.bgElevated,
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
                  stroke={isMajor ? theme.textMuted : theme.textSecondary}
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
            stroke={theme.accentPrimary}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={center} cy={center} r="8" fill={theme.accentPrimary} />
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
                background: isActive ? theme.controlSelectedBg : "transparent",
                color: theme.textPrimary,
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
        border: `1px solid ${
          active ? theme.controlSelectedBorder : theme.borderStandard
        }`,
        background: active ? theme.controlSelectedBg : theme.controlBg,
        color: theme.textPrimary,
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
        border: `1px solid ${
          active ? theme.controlSelectedBorder : theme.borderStandard
        }`,
        background: active ? theme.controlSelectedBg : theme.controlBg,
        color: theme.textPrimary,
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
    border: `1px solid ${theme.borderStandard}`,
    background: theme.bgElevated,
    color: theme.textPrimary,
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
    border: `1px solid ${theme.borderStandard}`,
    background: theme.controlBg,
    color: theme.textPrimary,
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
    border: `1px solid ${theme.controlSelectedBorder}`,
    background: theme.controlSelectedBg,
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  };
}

function HexSwatch({
  colour,
  label,
  active,
  onClick,
  theme,
  width,
  height,
  innerBorder = false,
}: {
  colour: string;
  label: string;
  active: boolean;
  onClick: () => void;
  theme: Theme;
  width: number;
  height: number;
  innerBorder?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="theme-hex-swatch"
        style={{
          width,
          height,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          position: "relative",
          zIndex: active ? 3 : 1,
        }}
      >
        <span
          style={{
            width,
            height,
            display: "block",
            background: colour,
            clipPath:
              "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
            border: active
              ? `2px solid ${theme.textPrimary}`
              : innerBorder
                ? `1px solid ${theme.borderStandard}`
                : `1px solid rgba(255,255,255,0.15)`,
            outline: active ? `2px solid ${theme.paper}` : "none",
            outlineOffset: active ? "-4px" : 0,
            boxShadow: active
              ? theme.shadowStrong
              : "0 1px 2px rgba(0,0,0,0.06)",
            transform: active ? "scale(1.02)" : "scale(1)",
            transition:
              "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, outline 140ms ease, filter 140ms ease",
          }}
        />
      </button>

      <style jsx>{`
        .theme-hex-swatch:hover {
          z-index: 4;
        }

        .theme-hex-swatch:hover span {
          transform: scale(1.05);
          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
          filter: brightness(1.04);
          border-color: ${theme.textPrimary};
        }

        .theme-hex-swatch:focus-visible {
          outline: 2px solid ${theme.accentPrimary};
          outline-offset: 3px;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

function WordHoneycombPalette({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: Theme;
}) {
  const cells = useMemo(() => buildHoneycombCells(WORD_COLOUR_ROWS), []);

  const hexWidth = 24;
  const hexHeight = 28;
  const colStep = 20.9;
  const rowStep = 21.2;
  const maxCols = Math.max(...WORD_COLOUR_ROWS.map((row) => row.length));
  const width = (maxCols - 1) * colStep + hexWidth;
  const height = (WORD_COLOUR_ROWS.length - 1) * rowStep + hexHeight;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        margin: "0 auto",
      }}
    >
      {cells.map((cell) => {
        const rowLength = WORD_COLOUR_ROWS[cell.row].length;
        const baseLeft = ((maxCols - rowLength) * colStep) / 2;
        const left = baseLeft + cell.col * colStep;
        const top = cell.row * rowStep;

        return (
          <div
            key={`${cell.row}-${cell.col}-${cell.id}`}
            style={{
              position: "absolute",
              left,
              top,
            }}
          >
            <HexSwatch
              colour={ACCENT_MAP[cell.id]}
              label={`${getAccentLabel(cell.id)} ${ACCENT_MAP[cell.id]}`}
              active={cell.id === selectedColour}
              onClick={() => onSelect(cell.id)}
              theme={theme}
              width={hexWidth}
              height={hexHeight}
            />
          </div>
        );
      })}
    </div>
  );
}

function WordNeutralPalette({
  selectedColour,
  onSelect,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  theme: Theme;
}) {
  const smallHexWidth = 22;
  const smallHexHeight = 26;
  const largeHexWidth = 30;
  const largeHexHeight = 34;
  const colStep = 18.7;
  const rowStep = 18.5;

  const contentWidth = 290;
  const topLeft = 53;
  const bottomLeft = 43;
  const blackLeft = contentWidth - largeHexWidth;
  const whiteTop = 12;
  const blackTop = 10;

  return (
    <div
      style={{
        width: contentWidth,
        height: 52,
        position: "relative",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: whiteTop,
        }}
      >
        <HexSwatch
          colour={ACCENT_MAP[WORD_NEUTRAL_WHITE]}
          label="White"
          active={selectedColour === WORD_NEUTRAL_WHITE}
          onClick={() => onSelect(WORD_NEUTRAL_WHITE)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
          innerBorder
        />
      </div>

      {WORD_NEUTRAL_TOP.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: topLeft + index * colStep,
            top: 0,
          }}
        >
          <HexSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      {WORD_NEUTRAL_BOTTOM.map((id, index) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: bottomLeft + index * colStep,
            top: rowStep,
          }}
        >
          <HexSwatch
            colour={ACCENT_MAP[id]}
            label={`${getAccentLabel(id)} ${ACCENT_MAP[id]}`}
            active={selectedColour === id}
            onClick={() => onSelect(id)}
            theme={theme}
            width={smallHexWidth}
            height={smallHexHeight}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: blackLeft,
          top: blackTop,
        }}
      >
        <HexSwatch
          colour={ACCENT_MAP[WORD_NEUTRAL_BLACK]}
          label="Black"
          active={selectedColour === WORD_NEUTRAL_BLACK}
          onClick={() => onSelect(WORD_NEUTRAL_BLACK)}
          theme={theme}
          width={largeHexWidth}
          height={largeHexHeight}
        />
      </div>
    </div>
  );
}

function CustomThemePaletteDialog({
  open,
  selectedColour,
  onSelect,
  onClose,
  theme,
}: {
  open: boolean;
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  onClose: () => void;
  theme: Theme;
}) {
  const selectedHex = ACCENT_MAP[selectedColour];
  const selectedLabel = useMemo(
    () => getAccentLabel(selectedColour),
    [selectedColour]
  );

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 404,
          borderRadius: 14,
          border: `1px solid ${theme.borderStandard}`,
          background: theme.bgSurface,
          boxShadow: theme.shadowStrong,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 16px 12px",
            borderBottom: `1px solid ${theme.borderStandard}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: theme.textPrimary,
              }}
            >
              Custom theme colour
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: theme.textMuted,
                lineHeight: 1.45,
                maxWidth: 290,
              }}
            >
              Choose a base colour from the palette below. The app will build a
              full theme from it rather than simply changing a single accent.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              cursor: "pointer",
              fontSize: 19,
              lineHeight: 1,
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
            }}
            aria-label="Close custom theme picker"
            title="Close"
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: "14px 14px 14px",
            display: "grid",
            gap: 14,
          }}
        >
          <WordHoneycombPalette
            selectedColour={selectedColour}
            onSelect={onSelect}
            theme={theme}
          />

          <div
            style={{
              display: "grid",
              gap: 10,
              justifyItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 320,
                borderTop: `1px solid ${theme.borderStandard}`,
              }}
            />

            <WordNeutralPalette
              selectedColour={selectedColour}
              onSelect={onSelect}
              theme={theme}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  color: theme.textMuted,
                }}
              >
                Current selection
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 40,
                  padding: "0 12px",
                  borderRadius: 12,
                  border: `1px solid ${theme.borderStandard}`,
                  background: theme.bgElevated,
                  maxWidth: 250,
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 21,
                    background: selectedHex,
                    clipPath:
                      "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                    border:
                      selectedColour === WORD_NEUTRAL_WHITE
                        ? `1px solid ${theme.borderStandard}`
                        : `2px solid ${theme.paper}`,
                    boxShadow: theme.shadow,
                    flex: "0 0 auto",
                  }}
                />

                <span
                  style={{
                    fontSize: 13,
                    color: theme.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Base colour:{" "}
                  <strong style={{ color: theme.textPrimary }}>
                    {selectedLabel}
                  </strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 10,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.controlBg,
                color: theme.textPrimary,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPanel({
  open,
  onClose,
  theme,
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
  const {
    themePreference,
    setThemePreference,
    customThemeColour,
    setCustomThemeColour,
  } = useSettings();

  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [paper2DateLinked, setPaper2DateLinked] = useState(
    !p2CoverDateText || p2CoverDateText === p1CoverDateText
  );
  const [openPalette, setOpenPalette] = useState(false);

  const selectedLabel = useMemo(
    () => getAccentLabel(customThemeColour),
    [customThemeColour]
  );

  useEffect(() => {
    if (!open) {
      setActivePicker(null);
      setOpenPalette(false);
    }
  }, [open]);

  useEffect(() => {
    if (paper2DateLinked) {
      onChangeP2CoverDateText(p1CoverDateText);
    }
  }, [paper2DateLinked, p1CoverDateText, onChangeP2CoverDateText]);

  return (
    <>
      <AppSideTray open={open} onClose={onClose} theme={theme}>
        <style jsx>{`
          .settings-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;
          }

          .settings-scroll:hover {
            scrollbar-color: ${theme.textMuted} transparent;
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
            background: ${theme.textMuted};
          }
        `}</style>

        <AppTrayHeader
          title="Settings"
          subtitle="Viewer, layout and cover-sheet options"
          onClose={onClose}
          theme={theme}
        />

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
          <AppTraySection title="Paper content" theme={theme}>
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
          </AppTraySection>

          <AppTraySection title="Workspace" theme={theme}>
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
          </AppTraySection>

          <AppTraySection
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
          </AppTraySection>

          <AppTraySection
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
          </AppTraySection>

          <AppTraySection
            title="Appearance"
            subtitle="Choose how the app looks."
            theme={theme}
          >
            <div style={{ display: "grid", gap: 10 }}>
              {THEME_OPTIONS.map((opt) => {
                const active = themePreference === opt.value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setThemePreference(opt.value)}
                    style={{
                      padding: 14,
                      borderRadius: 14,
                      border: `1px solid ${
                        active
                          ? theme.controlSelectedBorder
                          : theme.borderStandard
                      }`,
                      background: active
                        ? theme.controlSelectedBg
                        : theme.bgSurface,
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        color: theme.textPrimary,
                      }}
                    >
                      {opt.label}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: theme.textMuted,
                      }}
                    >
                      {opt.helper}
                    </div>
                  </button>
                );
              })}
            </div>
          </AppTraySection>

          <AppTraySection
            title="Custom theme"
            subtitle="Choose your base colour."
            theme={theme}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 14,
                borderRadius: 14,
                border: `1px solid ${theme.borderStandard}`,
                background: theme.bgSurface,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 18,
                    height: 21,
                    background: ACCENT_MAP[customThemeColour],
                    clipPath:
                      "polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)",
                    border:
                      customThemeColour === WORD_NEUTRAL_WHITE
                        ? `1px solid ${theme.borderStandard}`
                        : "none",
                  }}
                />

                <div>
                  <div style={{ fontWeight: 700, color: theme.textPrimary }}>
                    {selectedLabel}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>
                    Base colour
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenPalette(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${theme.borderStandard}`,
                  background: theme.bgElevated,
                  color: theme.textPrimary,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Choose colour
              </button>
            </div>
          </AppTraySection>
        </div>
      </AppSideTray>

      <CustomThemePaletteDialog
        open={openPalette}
        selectedColour={customThemeColour}
        onSelect={setCustomThemeColour}
        onClose={() => setOpenPalette(false)}
        theme={theme}
      />
    </>
  );
}