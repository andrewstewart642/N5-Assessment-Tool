"use client";

import { UI_TEXT, UI_TYPO } from "@/app/ui/uiTypography";
import type { Paper, Theme } from "@/shared-types/assessmentTypes";

type Props = {
  viewPaper?: Paper;
  paper?: Paper;

  p1Marks: number;
  p2Marks: number;

  p1TargetMarks: number;
  p2TargetMarks: number;

  p1TimeMinutes: number;
  p2TimeMinutes: number;

  notes: string[];
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

export default function AssessmentProgressHud(props: Props) {
  const { p1Marks, p2Marks, p1TargetMarks, p2TargetMarks, p1TimeMinutes, p2TimeMinutes, notes, theme } = props;

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
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>~{formatMinutes(p1TimeMinutes)}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr", columnGap: 10, alignItems: "center" }}>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted }}>P2</div>
            <div style={{ ...UI_TEXT.controlTextStrong, color: muted, textAlign: "right" }}>~{formatMinutes(p2TimeMinutes)}</div>
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
            color: notes.length ? muted : dim,
            lineHeight: 1.35,
            fontFamily: UI_TYPO.family,
            fontSize: UI_TYPO.sizeBase,
          }}
        >
          {notes.length ? (
            <div style={{ display: "grid", gap: 6 }}>
              {notes.map((n, i) => (
                <div
                  key={`${i}-${n}`}
                  style={{
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                    ...UI_TEXT.controlText,
                  }}
                  title={n}
                >
                  • {n}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ ...UI_TEXT.controlTextStrong }}>No notes yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}