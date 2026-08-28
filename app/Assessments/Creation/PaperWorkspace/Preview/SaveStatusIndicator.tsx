"use client";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import type {
  AssessmentSaveStatus,
} from "../../Persistence/SaveStatus";

type AssessmentSaveStatusPillProps = {
  theme:
    AppTheme;

  status:
    AssessmentSaveStatus;
};

function SavingCycleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      style={{
        display:
          "block",

        animation:
          "assessment-save-spin 1.5s linear infinite",
      }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 3.25a8.75 8.75 0 0 1 7.55 4.35"
        />

        <path
          d="m17.2 7.65 2.6.15-.55-2.55"
        />

        <path
          d="M19.7 12.9a8.75 8.75 0 0 1-7.55 7.8"
        />

        <path
          d="m13.25 18.1-1.1 2.6 2.75-.25"
        />

        <path
          d="M7.45 19.35A8.75 8.75 0 0 1 3.3 11.8"
        />

        <path
          d="m5.95 13.15-2.65-1.35-.15 2.95"
        />
      </g>
    </svg>
  );
}

export default function AssessmentSaveStatusPill({
  theme,
  status,
}: AssessmentSaveStatusPillProps) {
  const isSaved =
    status ===
    "saved";

  const isSaving =
    status ===
    "saving";

  const label =
    isSaving
      ? "Saving..."
      : isSaved
        ? "Saved"
        : "Save failed";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={
        label
      }
      style={{
        position:
          "absolute",

        left:
          10,

        bottom:
          10,

        zIndex:
          20,

        display:
          "inline-flex",

        alignItems:
          "center",

        gap:
          7,

        minHeight:
          28,

        padding:
          "5px 9px",

        boxSizing:
          "border-box",

        borderRadius:
          6,

        border:
          `1px solid ${
            status ===
            "error"
              ? theme.danger
              : theme.borderStandard
          }`,

        background:
          theme.bgElevated,

        color:
          status ===
          "error"
            ? theme.danger
            : theme.textMuted,

        boxShadow:
          theme.shadow,

        pointerEvents:
          "none",

        fontSize:
          12,

        fontWeight:
          700,

        lineHeight:
          1,

        backdropFilter:
          "blur(8px)",

        WebkitBackdropFilter:
          "blur(8px)",

        transition:
          "border-color 0.2s ease, color 0.2s ease, background 0.2s ease",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width:
            14,

          height:
            14,

          flexShrink:
            0,

          display:
            "grid",

          placeItems:
            "center",

          color:
            status ===
            "error"
              ? theme.danger
              : theme.accentPrimary,
        }}
      >
        {isSaving ? (
          <SavingCycleIcon />
        ) : (
          <span
            style={{
              width:
                7,

              height:
                7,

              borderRadius:
                999,

              background:
                isSaved
                  ? theme.success
                  : theme.danger,

              boxShadow:
                isSaved
                  ? `0 0 0 2px ${theme.successSoft}`
                  : `0 0 0 2px ${theme.dangerSoft}`,

              animation:
                isSaved
                  ? "assessment-save-heartbeat 36s ease-in-out infinite"
                  : "none",
            }}
          />
        )}
      </span>

      <span>
        {label}
      </span>

      <style jsx>{`
        @keyframes assessment-save-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /*
         * Three quiet reassurance pulses near the
         * beginning of each 36-second cycle.
         *
         * The remaining ~33 seconds are completely
         * still.
         */
        @keyframes assessment-save-heartbeat {
          0%,
          2.2%,
          4.4%,
          6.6%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 2px ${theme.successSoft};
          }

          1.1%,
          3.3%,
          5.5% {
            transform: scale(1.45);
            box-shadow: 0 0 0 4px ${theme.successSoft};
          }
        }

        @media (prefers-reduced-motion: reduce) {
          svg {
            animation: none !important;
          }

          span {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}