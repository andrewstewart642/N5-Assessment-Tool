"use client";

import { UI_TEXT, UI_TYPO } from "@/app/ui/UiTypography";
import type { Paper, Theme } from "@/shared-types/AssessmentTypes";
import type {
  BuilderNote,
  BuilderNoteSeverity,
} from "@/app/create-assessment/builder/builder-logic/BuilderNotes";
import {
  DEFAULT_BUILDER_NOTE_LIMITS,
  limitBuilderNotes,
  toBuilderNote,
} from "@/app/create-assessment/builder/builder-logic/BuilderNotes";

type Props = {
  viewPaper?: Paper;
  paper?: Paper;

  p1Marks: number;
  p2Marks: number;

  p1TargetMarks: number;
  p2TargetMarks: number;

  p1TimeMinutes: number;
  p2TimeMinutes: number;

  notes: Array<string | BuilderNote>;
  theme: Theme;
};

function clampInt(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}

function formatMinutes(totalMinutes: number) {
  const m = clampInt(totalMinutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} h` : `${h} h ${r} min`;
}

function WarningTriangleIcon({ color, fill }: { color: string; fill: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.6L21 19.5c.35.62-.08 1.4-.79 1.4H3.79c-.71 0-1.14-.78-.79-1.4L12 3.6z"
        fill={fill}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 8.2v6.6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17.4" r="1.2" fill={color} />
    </svg>
  );
}

function WarningDiamondIcon({ color, fill }: { color: string; fill: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.8L20.8 12 12 21.2 3.2 12 12 2.8z"
        fill={fill}
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 7.8v6.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1.2" fill={color} />
    </svg>
  );
}

function LightbulbIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 14.2c-1.3-1-2.1-2.6-2.1-4.4A6.1 6.1 0 0 1 12 3.8a6.1 6.1 0 0 1 6.1 6.1c0 1.8-.8 3.4-2.1 4.4-.5.4-.9.9-1.2 1.5H9.2c-.3-.6-.7-1.1-1.2-1.6Z"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.4 18.1h5.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 20.3h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function getNotePalette(
  severity: BuilderNoteSeverity,
  isLight: boolean
): {
  icon: React.ReactNode;
  textColor: string;
  background: string;
  borderColor: string;
} {
  if (severity === "essential") {
    const color = isLight ? "#d92d20" : "#ff6b6b";
    const fill = isLight ? "#fde7e7" : "rgba(255,107,107,0.12)";
    return {
      icon: <WarningTriangleIcon color={color} fill={fill} />,
      textColor: color,
      background: isLight ? "rgba(217,45,32,0.04)" : "rgba(255,107,107,0.06)",
      borderColor: isLight ? "rgba(217,45,32,0.16)" : "rgba(255,107,107,0.20)",
    };
  }

  if (severity === "advised") {
    const color = isLight ? "#b7791f" : "#f6c453";
    const fill = isLight ? "#fff0cf" : "rgba(246,196,83,0.12)";
    return {
      icon: <WarningDiamondIcon color={color} fill={fill} />,
      textColor: color,
      background: isLight ? "rgba(183,121,31,0.04)" : "rgba(246,196,83,0.06)",
      borderColor: isLight ? "rgba(183,121,31,0.16)" : "rgba(246,196,83,0.18)",
    };
  }

  const color = isLight ? "rgba(80,97,116,0.92)" : "rgba(169,182,197,0.92)";
  return {
    icon: <LightbulbIcon color={color} />,
    textColor: color,
    background: "transparent",
    borderColor: isLight ? "rgba(22,34,49,0.08)" : "rgba(255,255,255,0.08)",
  };
}

export default function AssessmentProgressHud(props: Props) {
  const {
    p1Marks,
    p2Marks,
    p1TargetMarks,
    p2TargetMarks,
    p1TimeMinutes,
    p2TimeMinutes,
    notes,
    theme,
  } = props;

  const p1m = clampInt(p1Marks);
  const p2m = clampInt(p2Marks);
  const p1t = clampInt(p1TargetMarks);
  const p2t = clampInt(p2TargetMarks);

  const isLight = theme.pageBg === "#eef3f8";

  const muted = isLight ? "rgba(22,34,49,0.92)" : "rgba(230,237,245,0.94)";
  const dim = isLight ? "rgba(80,97,116,0.92)" : "rgba(127,144,164,0.96)";
  const border = isLight ? "rgba(22,34,49,0.10)" : "rgba(255,255,255,0.10)";
  const panelBg = isLight ? "rgba(255,255,255,0.82)" : "rgba(15,22,32,0.88)";
  const notesBg = isLight ? "rgba(246,249,252,0.92)" : "rgba(11,17,24,0.70)";
  const topBorder = isLight ? "rgba(22,34,49,0.06)" : "rgba(255,255,255,0.06)";

  const structuredNotes = limitBuilderNotes(
    notes.map((note, index) => toBuilderNote(note, index)),
    DEFAULT_BUILDER_NOTE_LIMITS
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderTop: `1px solid ${topBorder}`,
        background: panelBg,
        backdropFilter: "blur(10px)",
        display: "grid",
        gridTemplateColumns: "118px 132px minmax(0, 1fr)",
        minHeight: 0,
        overflow: "hidden",
        fontFamily: UI_TYPO.family,
      }}
    >
      <div
        style={{
          minWidth: 0,
          padding: "10px 10px 10px 12px",
          borderRight: `1px solid ${border}`,
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 10,
        }}
      >
        <div style={{ ...UI_TEXT.sectionTitle, color: muted }}>Marks</div>

        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 10, alignItems: "center" }}>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted }}>P1</div>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>
              {p1m}/{p1t}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 10, alignItems: "center" }}>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted }}>P2</div>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>
              {p2m}/{p2t}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          minWidth: 0,
          padding: "10px 10px",
          borderRight: `1px solid ${border}`,
          display: "grid",
          gridTemplateRows: "auto 1fr",
          gap: 10,
        }}
      >
        <div style={{ ...UI_TEXT.sectionTitle, color: muted }}>Time</div>

        <div style={{ display: "grid", gap: 8, alignContent: "start" }}>
          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 10, alignItems: "center" }}>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted }}>P1</div>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>
              ~{formatMinutes(p1TimeMinutes)}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 10, alignItems: "center" }}>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted }}>P2</div>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>
              ~{formatMinutes(p2TimeMinutes)}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          minWidth: 0,
          padding: "10px 12px 10px 10px",
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr)",
          gap: 8,
        }}
      >
        <div style={{ ...UI_TEXT.sectionTitle, color: muted }}>Notes</div>

        <div
          className="hover-scroll"
          style={{
            minHeight: 0,
            height: "100%",
            border: `1px solid ${border}`,
            background: notesBg,
            borderRadius: 10,
            padding: "8px 10px",
            overflowY: "auto",
            color: structuredNotes.length ? muted : dim,
            lineHeight: 1.35,
            fontFamily: UI_TYPO.family,
            fontSize: UI_TYPO.sizeBase,
          }}
        >
          {structuredNotes.length ? (
            <div style={{ display: "grid", gap: 8 }}>
              {structuredNotes.map((note) => {
                const palette = getNotePalette(note.severity, isLight);

                return (
                  <div
                    key={note.id}
                    title={note.message}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20px minmax(0, 1fr)",
                      columnGap: 10,
                      alignItems: "start",
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: palette.background,
                      border: `1px solid ${palette.borderColor}`,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        display: "grid",
                        placeItems: "center",
                        marginTop: 1,
                      }}
                    >
                      {palette.icon}
                    </div>

                    <div
                      style={{
                      ...UI_TEXT.controlText,
                      whiteSpace: "normal",
                      overflowWrap: "anywhere",
                      color: note.severity === "suggestion" ? muted : palette.textColor,
                      fontWeight:
                        note.severity === "essential"
                          ? UI_TYPO.weightSemibold
                          : UI_TYPO.weightMedium,
                      
                      }}
                    >
                      {note.message}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...UI_TEXT.controlTextStrong }}>No notes yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}