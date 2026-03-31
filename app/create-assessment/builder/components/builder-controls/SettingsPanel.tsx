"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "@/ui/AppTheme";
import type { ThemeModePreference } from "@/ui/ThemeMode";
import { ACCENT_MAP, type AccentOption } from "@/ui/AccentPalette";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";
import AppSideTray from "@/app/ui/settings-bar/AppSideTray";
import AppTrayHeader from "@/app/ui/settings-bar/AppTrayHeader";
import SharedCalendarPicker from "@/app/create-assessment/builder/components/builder-controls/SharedCalendarPicker";
import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";

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

type ActivePaperTab = "P1" | "P2";

type TimeDraft = {
  hour12: number;
  minute: number;
  meridiem: "AM" | "PM";
};

type SettingsSectionId =
  | "paper-content"
  | "workspace"
  | "paper-sitting"
  | "appearance"
  | "custom-theme";

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
  ["word-r1-c1", "word-r1-c2", "word-r1-c3", "word-r1-c4", "word-r1-c5", "word-r1-c6", "word-r1-c7"],
  ["word-r2-c1", "word-r2-c2", "word-r2-c3", "word-r2-c4", "word-r2-c5", "word-r2-c6", "word-r2-c7", "word-r2-c8"],
  ["word-r3-c1", "word-r3-c2", "word-r3-c3", "word-r3-c4", "word-r3-c5", "word-r3-c6", "word-r3-c7", "word-r3-c8", "word-r3-c9"],
  ["word-r4-c1", "word-r4-c2", "word-r4-c3", "word-r4-c4", "word-r4-c5", "word-r4-c6", "word-r4-c7", "word-r4-c8", "word-r4-c9", "word-r4-c10"],
  ["word-r5-c1", "word-r5-c2", "word-r5-c3", "word-r5-c4", "word-r5-c5", "word-r5-c6", "word-r5-c7", "word-r5-c8", "word-r5-c9", "word-r5-c10", "word-r5-c11"],
  ["word-r6-c1", "word-r6-c2", "word-r6-c3", "word-r6-c4", "word-r6-c5", "word-r6-c6", "word-r6-c7", "word-r6-c8", "word-r6-c9", "word-r6-c10", "word-r6-c11", "word-r6-c12"],
  ["word-r7-c1", "word-r7-c2", "word-r7-c3", "word-r7-c4", "word-r7-c5", "word-r7-c6", "word-r7-c7", "word-r7-c8", "word-r7-c9", "word-r7-c10", "word-r7-c11", "word-r7-c12", "word-r7-c13"],
  ["word-r8-c1", "word-r8-c2", "word-r8-c3", "word-r8-c4", "word-r8-c5", "word-r8-c6", "word-r8-c7", "word-r8-c8", "word-r8-c9", "word-r8-c10", "word-r8-c11", "word-r8-c12", "word-r8-c13"],
  ["word-r9-c1", "word-r9-c2", "word-r9-c3", "word-r9-c4", "word-r9-c5", "word-r9-c6", "word-r9-c7", "word-r9-c8", "word-r9-c9", "word-r9-c10", "word-r9-c11"],
  ["word-r10-c1", "word-r10-c2", "word-r10-c3", "word-r10-c4", "word-r10-c5", "word-r10-c6", "word-r10-c7", "word-r10-c8", "word-r10-c9", "word-r10-c10"],
  ["word-r11-c1", "word-r11-c2", "word-r11-c3", "word-r11-c4", "word-r11-c5", "word-r11-c6", "word-r11-c7", "word-r11-c8", "word-r11-c9"],
  ["word-r12-c1", "word-r12-c2", "word-r12-c3", "word-r12-c4", "word-r12-c5", "word-r12-c6", "word-r12-c7", "word-r12-c8"],
  ["word-r13-c1", "word-r13-c2", "word-r13-c3", "word-r13-c4", "word-r13-c5", "word-r13-c6", "word-r13-c7"],
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

const DEFAULT_OPEN_SECTIONS: Record<SettingsSectionId, boolean> = {
  "paper-content": true,
  workspace: true,
  "paper-sitting": true,
  appearance: false,
  "custom-theme": false,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDisplayDate(value: string): string {
  if (!value) return "";
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!isoMatch) return value;

  const [, year, month, day] = isoMatch;
  const utcDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  );

  if (Number.isNaN(utcDate.getTime())) return value;

  return utcDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function parseTimeText(text: string): TimeDraft {
  const trimmed = text.trim().toUpperCase();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

  if (!match) {
    return { hour12: 9, minute: 0, meridiem: "AM" };
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

  if (distanceToFive <= 1.15) return wrappedSnappedFive;
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
    row.map((id, colIndex) => ({ id, row: rowIndex, col: colIndex }))
  );
}

function SectionBar({
  title,
  theme,
  open,
  onToggle,
}: {
  title: string;
  theme: Theme;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="settings-section-bar"
      style={{
        width: "calc(100% + 36px)",
        marginLeft: -18,
        marginRight: -18,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 14,
        minHeight: 44,
        padding: "0 16px",
        border: "none",
        borderTop: `1px solid ${theme.borderStandard}`,
        borderBottom: `1px solid ${theme.borderStandard}`,
        background: theme.bgElevated,
        cursor: "pointer",
        textAlign: "left",
        transition:
          "background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease, color 0.18s ease",
        fontFamily: UI_TYPO.family,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        transform: "scale(1)",
        transformOrigin: "center center",
      }}
    >
      <span
        style={{
          ...UI_TEXT.controlTextStrong,
          color: theme.textPrimary,
          fontSize: 14,
          fontWeight: UI_TYPO.weightSemibold,
          lineHeight: 1.2,
        }}
      >
        {title}
      </span>

      <span
        style={{
          color: theme.textMuted,
          fontSize: 12,
          lineHeight: 1,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 140ms ease",
        }}
      >
        ▾
      </span>
    </button>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  theme,
  compact = false,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  theme: Theme;
  compact?: boolean;
}) {
  const rowHeight = compact ? 38 : 42;
  const textSize = compact ? 12.5 : 13;
  const toggleWidth = compact ? 38 : 42;
  const toggleHeight = compact ? 22 : 24;
  const knobSize = compact ? 16 : 18;
  const knobTop = 2;

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="settings-row-button"
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        alignItems: "center",
        gap: 14,
        minWidth: 0,
        minHeight: rowHeight,
        padding: "8px 0",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${theme.borderStandard}`,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s ease",
        fontFamily: UI_TYPO.family,
      }}
    >
      <div
        style={{
          ...UI_TEXT.controlText,
          color: theme.textSecondary,
          fontSize: textSize,
          fontWeight: UI_TYPO.weightSemibold,
          lineHeight: 1.3,
          minWidth: 0,
          wordBreak: "break-word",
        }}
      >
        {label}
      </div>

      <span
        style={{
          position: "relative",
          width: toggleWidth,
          height: toggleHeight,
          borderRadius: 999,
          border: `1px solid ${
            checked ? theme.controlSelectedBorder : theme.borderStandard
          }`,
          background: checked ? theme.controlSelectedBg : theme.controlBg,
          transition: "all 140ms ease",
          flexShrink: 0,
          alignSelf: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: knobTop,
            left: checked ? toggleWidth - knobSize - 3 : 2,
            width: knobSize,
            height: knobSize,
            borderRadius: "50%",
            background: checked ? theme.accentPrimary : theme.bgElevated,
            transition: "all 140ms ease",
            boxShadow: theme.shadow,
          }}
        />
      </span>
    </button>
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
        ...UI_TEXT.controlTextStrong,
        marginBottom: 7,
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: UI_TYPO.weightSemibold,
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  );
}

function TabToggle({
  value,
  onChange,
  theme,
}: {
  value: ActivePaperTab;
  onChange: (value: ActivePaperTab) => void;
  theme: Theme;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        height: 34,
        borderRadius: 10,
        background: theme.controlBg,
        border: `1px solid ${theme.borderStandard}`,
        padding: 2,
        boxSizing: "border-box",
        fontFamily: UI_TYPO.family,
      }}
    >
      {(["P1", "P2"] as const).map((paper) => {
        const active = value === paper;

        return (
          <button
            key={paper}
            type="button"
            onClick={() => onChange(paper)}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 8,
              border: "none",
              background: active ? theme.controlSelectedBg : "transparent",
              color: active ? theme.textPrimary : theme.textMuted,
              fontSize: 13,
              fontWeight: UI_TYPO.weightSemibold,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {paper === "P1" ? "Paper 1" : "Paper 2"}
          </button>
        );
      })}
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
  disabled = false,
  readOnly = false,
}: {
  value: string;
  placeholder?: string;
  icon: string;
  onClick: () => void;
  onChange: (next: string) => void;
  theme: Theme;
  muted?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        onFocus={() => {
          if (!disabled) onClick();
        }}
        onClick={() => {
          if (!disabled) onClick();
        }}
        onChange={(e) => {
          if (!disabled && !readOnly) onChange(e.target.value);
        }}
        style={{
          width: "100%",
          height: 40,
          borderRadius: 12,
          border: `1px solid ${theme.borderStandard}`,
          background: muted || disabled ? theme.controlBg : theme.bgElevated,
          color: muted || disabled ? theme.textMuted : theme.textPrimary,
          padding: "0 42px 0 14px",
          fontSize: 14,
          fontFamily: UI_TYPO.family,
          fontWeight: UI_TYPO.weightSemibold,
          outline: "none",
          boxSizing: "border-box",
          opacity: disabled ? 0.72 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) onClick();
        }}
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
          cursor: disabled ? "not-allowed" : "pointer",
          display: "grid",
          placeItems: "center",
          lineHeight: 1,
          padding: 0,
          opacity: disabled ? 0.72 : 1,
        }}
        aria-label="Open picker"
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: "100%",
            height: "100%",
            lineHeight: 1,
            transform: "translateY(-0.5px)",
          }}
        >
          {icon}
        </span>
      </button>
    </div>
  );
}

function PickerOverlay({
  children,
  theme,
  fullWidth = false,
}: {
  children: React.ReactNode;
  theme: Theme;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: fullWidth ? -12 : 0,
        right: fullWidth ? -12 : 0,
        zIndex: 40,
        padding: 0,
        borderRadius: 16,
        background: theme.bgSurface,
      }}
    >
      {children}
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
      setDraft((prev) => ({ ...prev, hour12: nextHour }));
    } else {
      const nextMinute = getMinuteFromAngle(angle);
      setDraft((prev) => ({ ...prev, minute: nextMinute }));
    }
  }

  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        padding: 14,
        boxShadow: theme.shadowStrong,
        fontFamily: UI_TYPO.family,
      }}
    >
      <div
        style={{
          ...UI_TEXT.sectionTitle,
          color: theme.textPrimary,
          fontSize: 15,
          fontWeight: UI_TYPO.weightBold,
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
            fontWeight: UI_TYPO.weightBold,
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
                style={{ overflow: "visible", position: "absolute", inset: 0 }}
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
                setDraft((prev) => ({ ...prev, hour12: point.valueNumber }));
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
                fontFamily: UI_TYPO.family,
                fontWeight: UI_TYPO.weightBold,
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
        fontWeight: UI_TYPO.weightBold,
        fontFamily: UI_TYPO.family,
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
        fontWeight: UI_TYPO.weightBold,
        fontFamily: UI_TYPO.family,
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
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightSemibold,
    outline: "none",
    boxSizing: "border-box",
  };
}

function pickerGhostButtonStyle(theme: Theme): React.CSSProperties {
  return {
    height: 40,
    width: "100%",
    minWidth: 0,
    padding: "0 18px",
    borderRadius: 12,
    border: `1px solid ${theme.controlSelectedBorder}`,
    background: theme.controlSelectedBg,
    color: theme.textPrimary,
    fontSize: 14,
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightBold,
    cursor: "pointer",
    transition:
      "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
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
    fontFamily: UI_TYPO.family,
    fontWeight: UI_TYPO.weightBold,
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
    <div style={{ width, height, position: "relative", margin: "0 auto" }}>
      {cells.map((cell) => {
        const rowLength = WORD_COLOUR_ROWS[cell.row].length;
        const baseLeft = ((maxCols - rowLength) * colStep) / 2;
        const left = baseLeft + cell.col * colStep;
        const top = cell.row * rowStep;

        return (
          <div
            key={`${cell.row}-${cell.col}-${cell.id}`}
            style={{ position: "absolute", left, top }}
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
      <div style={{ position: "absolute", left: 0, top: whiteTop }}>
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
          style={{ position: "absolute", left: topLeft + index * colStep, top: 0 }}
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

      <div style={{ position: "absolute", left: blackLeft, top: blackTop }}>
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

function InlineCustomThemePalette({
  selectedColour,
  onSelect,
  onClose,
  theme,
}: {
  selectedColour: AccentOption;
  onSelect: (colour: AccentOption) => void;
  onClose: () => void;
  theme: Theme;
}) {
  const selectedHex = ACCENT_MAP[selectedColour];
  const selectedLabel = useMemo(() => getAccentLabel(selectedColour), [selectedColour]);

  return (
    <div
      style={{
        display: "grid",
        gap: 14,
        marginTop: 12,
        padding: 14,
        borderRadius: 14,
        border: `1px solid ${theme.borderStandard}`,
        background: theme.bgSurface,
        fontFamily: UI_TYPO.family,
      }}
    >
      <WordHoneycombPalette
        selectedColour={selectedColour}
        onSelect={onSelect}
        theme={theme}
      />

      <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
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
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "grid", gap: 6, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: UI_TYPO.weightBold,
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
                ...UI_TEXT.controlText,
                fontSize: 13,
                color: theme.textSecondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              Base colour:{" "}
              <strong style={{ color: theme.textPrimary }}>{selectedLabel}</strong>
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
            fontFamily: UI_TYPO.family,
            fontWeight: UI_TYPO.weightBold,
            cursor: "pointer",
            flex: "0 0 auto",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function AppearanceOptionRow({
  active,
  label,
  helper,
  onClick,
  theme,
}: {
  active: boolean;
  label: string;
  helper: string;
  onClick: () => void;
  theme: Theme;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="settings-row-button"
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "16px minmax(0, 1fr)",
        alignItems: "start",
        gap: 12,
        minHeight: 42,
        padding: "10px 0",
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${theme.borderStandard}`,
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s ease",
        fontFamily: UI_TYPO.family,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 14,
          height: 14,
          marginTop: 2,
          borderRadius: 999,
          border: `2px solid ${
            active ? theme.controlSelectedBorder : theme.textMuted
          }`,
          background: active ? theme.controlSelectedBorder : "transparent",
          boxSizing: "border-box",
        }}
      />

      <span style={{ minWidth: 0 }}>
        <span
          style={{
            ...UI_TEXT.controlText,
            display: "block",
            color: theme.textSecondary,
            fontSize: 13,
            fontWeight: UI_TYPO.weightSemibold,
            lineHeight: 1.25,
          }}
        >
          {label}
        </span>

        <span
          style={{
            ...UI_TEXT.controlText,
            display: "block",
            marginTop: 3,
            color: theme.textMuted,
            fontSize: 12,
            lineHeight: 1.35,
          }}
        >
          {helper}
        </span>
      </span>
    </button>
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
  const [activePaperTab, setActivePaperTab] = useState<ActivePaperTab>("P1");
  const [openSections, setOpenSections] =
    useState<Record<SettingsSectionId, boolean>>(DEFAULT_OPEN_SECTIONS);

  const selectedLabel = useMemo(() => getAccentLabel(customThemeColour), [customThemeColour]);

  useEffect(() => {
    if (!open) {
      setActivePicker(null);
      setOpenPalette(false);
      setActivePaperTab("P1");
      setOpenSections(DEFAULT_OPEN_SECTIONS);
    }
  }, [open]);

  useEffect(() => {
    if (paper2DateLinked) {
      onChangeP2CoverDateText(p1CoverDateText);
    }
  }, [paper2DateLinked, p1CoverDateText, onChangeP2CoverDateText]);

  function handleSelectCustomColour(colour: AccentOption) {
    setCustomThemeColour(colour);
    setThemePreference("custom");
  }

  function toggleSection(sectionId: SettingsSectionId) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  }

  function togglePicker(target: ActivePicker) {
    setActivePicker((prev) => (prev === target ? null : target));
  }

  const isEditingPaper1 = activePaperTab === "P1";
  const isEditingPaper2 = activePaperTab === "P2";
  const paper2FieldsDisabled = isEditingPaper2 && paper2DateLinked;

  const activeDateValueRaw = isEditingPaper1
    ? p1CoverDateText
    : paper2DateLinked
      ? p1CoverDateText
      : p2CoverDateText;

  const activeDateValue = formatDisplayDate(activeDateValueRaw);
  const activeStartValue = isEditingPaper1 ? p1StartTimeText : p2StartTimeText;
  const activeEndValue = isEditingPaper1 ? p1EndTimeText : p2EndTimeText;

  const activeDatePicker =
    activePaperTab === "P1" ? activePicker === "p1Date" : activePicker === "p2Date";
  const activeStartPicker =
    activePaperTab === "P1" ? activePicker === "p1Start" : activePicker === "p2Start";
  const activeEndPicker =
    activePaperTab === "P1" ? activePicker === "p1End" : activePicker === "p2End";

  return (
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

        .settings-section-bar:hover {
          background: ${theme.controlBgHover} !important;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
          transform: scale(1.004);
        }

        .settings-row-button:hover {
          background: ${theme.controlBg};
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
          gap: 0,
          alignContent: "start",
          fontFamily: UI_TYPO.family,
        }}
      >
        <div style={{ display: "grid", gap: 0 }}>
          <SectionBar
            title="Paper content"
            theme={theme}
            open={openSections["paper-content"]}
            onToggle={() => toggleSection("paper-content")}
          />

          {openSections["paper-content"] ? (
            <div style={{ display: "grid", padding: "0 2px" }}>
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
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 0 }}>
          <SectionBar
            title="Workspace"
            theme={theme}
            open={openSections.workspace}
            onToggle={() => toggleSection("workspace")}
          />

          {openSections.workspace ? (
            <div style={{ display: "grid", padding: "0 2px" }}>
              <ToggleRow
                label="Show progress panel"
                checked={showProgressPanel}
                onChange={onToggleShowProgressPanel}
                theme={theme}
              />
            </div>
          ) : null}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              padding: "10px 0 16px",
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
        </div>

        <div style={{ display: "grid", gap: 0 }}>
          <SectionBar
            title="Paper sitting details"
            theme={theme}
            open={openSections["paper-sitting"]}
            onToggle={() => toggleSection("paper-sitting")}
          />

          {openSections["paper-sitting"] ? (
            <div style={{ display: "grid", gap: 12, padding: "12px 0 14px" }}>
              <TabToggle
                value={activePaperTab}
                onChange={setActivePaperTab}
                theme={theme}
              />

              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <FieldLabel theme={theme}>Date</FieldLabel>

                    {isEditingPaper2 ? (
                      <button
                        type="button"
                        onClick={() => setPaper2DateLinked((prev) => !prev)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          fontFamily: UI_TYPO.family,
                        }}
                      >
                        <span
                          style={{
                            ...UI_TEXT.controlText,
                            fontSize: 11.5,
                            color: theme.textMuted,
                            fontWeight: UI_TYPO.weightMedium,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Different day
                        </span>

                        <span
                          style={{
                            width: 13,
                            height: 13,
                            borderRadius: 3,
                            border: `1px solid ${
                              !paper2DateLinked
                                ? theme.controlSelectedBorder
                                : theme.borderStandard
                            }`,
                            background: !paper2DateLinked
                              ? theme.controlSelectedBg
                              : theme.controlBg,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {!paper2DateLinked ? (
                            <span
                              style={{
                                fontSize: 10,
                                color: theme.accentPrimary,
                                lineHeight: 1,
                              }}
                            >
                              ✓
                            </span>
                          ) : null}
                        </span>
                      </button>
                    ) : null}
                  </div>

                  <IntegratedField
                    value={activeDateValue}
                    onChange={(next) => {
                      if (isEditingPaper1) {
                        onChangeP1CoverDateText(next);
                      } else {
                        setPaper2DateLinked(false);
                        onChangeP2CoverDateText(next);
                      }
                    }}
                    onClick={() => {
                      if (isEditingPaper1) {
                        togglePicker("p1Date");
                      } else if (!paper2FieldsDisabled) {
                        setPaper2DateLinked(false);
                        togglePicker("p2Date");
                      }
                    }}
                    icon="🗓️"
                    theme={theme}
                    muted={paper2FieldsDisabled}
                    disabled={paper2FieldsDisabled}
                    readOnly
                  />

                  {activeDatePicker ? (
                    <PickerOverlay theme={theme}>
                      <SharedCalendarPicker
                        theme={theme}
                        value={activeDateValueRaw}
                        onCancel={() => setActivePicker(null)}
                        onApply={(next) => {
                          if (isEditingPaper1) {
                            onChangeP1CoverDateText(next);
                          } else {
                            setPaper2DateLinked(false);
                            onChangeP2CoverDateText(next);
                          }
                          setActivePicker(null);
                        }}
                      />
                    </PickerOverlay>
                  ) : null}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <FieldLabel theme={theme}>Start</FieldLabel>
                    <IntegratedField
                      value={activeStartValue}
                      onChange={(next) => {
                        if (isEditingPaper1) {
                          onChangeP1StartTimeText(next);
                        } else {
                          onChangeP2StartTimeText(next);
                        }
                      }}
                      onClick={() =>
                        togglePicker(isEditingPaper1 ? "p1Start" : "p2Start")
                      }
                      icon="🕘"
                      theme={theme}
                      readOnly
                    />
                  </div>

                  <div style={{ position: "relative" }}>
                    <FieldLabel theme={theme}>End</FieldLabel>
                    <IntegratedField
                      value={activeEndValue}
                      onChange={(next) => {
                        if (isEditingPaper1) {
                          onChangeP1EndTimeText(next);
                        } else {
                          onChangeP2EndTimeText(next);
                        }
                      }}
                      onClick={() =>
                        togglePicker(isEditingPaper1 ? "p1End" : "p2End")
                      }
                      icon="🕘"
                      theme={theme}
                      readOnly
                    />
                  </div>
                </div>

                {activeStartPicker || activeEndPicker ? (
                  <div style={{ position: "relative" }}>
                    <PickerOverlay theme={theme} fullWidth>
                      <TimePickerInline
                        theme={theme}
                        value={activeStartPicker ? activeStartValue : activeEndValue}
                        label={
                          activeStartPicker
                            ? `${activePaperTab === "P1" ? "Paper 1" : "Paper 2"} start`
                            : `${activePaperTab === "P1" ? "Paper 1" : "Paper 2"} end`
                        }
                        onCancel={() => setActivePicker(null)}
                        onApply={(next) => {
                          if (activeStartPicker) {
                            if (isEditingPaper1) {
                              onChangeP1StartTimeText(next);
                            } else {
                              onChangeP2StartTimeText(next);
                            }
                          } else {
                            if (isEditingPaper1) {
                              onChangeP1EndTimeText(next);
                            } else {
                              onChangeP2EndTimeText(next);
                            }
                          }
                          setActivePicker(null);
                        }}
                      />
                    </PickerOverlay>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 0 }}>
          <SectionBar
            title="Appearance"
            theme={theme}
            open={openSections.appearance}
            onToggle={() => toggleSection("appearance")}
          />

          {openSections.appearance ? (
            <div style={{ display: "grid", padding: "0 2px" }}>
              {THEME_OPTIONS.map((opt) => (
                <AppearanceOptionRow
                  key={opt.value}
                  active={themePreference === opt.value}
                  label={opt.label}
                  helper={opt.helper}
                  onClick={() => setThemePreference(opt.value)}
                  theme={theme}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ display: "grid", gap: 0 }}>
          <SectionBar
            title="Custom theme"
            theme={theme}
            open={openSections["custom-theme"]}
            onToggle={() => toggleSection("custom-theme")}
          />

          {openSections["custom-theme"] ? (
            <div style={{ display: "grid", gap: 10, padding: "12px 0 0" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  padding: "2px 0",
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
                    <div
                      style={{
                        ...UI_TEXT.controlTextStrong,
                        fontSize: 14,
                        color: theme.textPrimary,
                        fontWeight: UI_TYPO.weightBold,
                      }}
                    >
                      {selectedLabel}
                    </div>
                    <div
                      style={{
                        ...UI_TEXT.controlText,
                        fontSize: 12,
                        color: theme.textMuted,
                      }}
                    >
                      Base colour
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpenPalette((prev) => !prev);
                    setThemePreference("custom");
                  }}
                  style={pickerGhostButtonStyle(theme)}
                >
                  {openPalette ? "Hide palette" : "Choose colour"}
                </button>
              </div>

              {openPalette ? (
                <InlineCustomThemePalette
                  selectedColour={customThemeColour}
                  onSelect={handleSelectCustomColour}
                  onClose={() => setOpenPalette(false)}
                  theme={theme}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </AppSideTray>
  );
}