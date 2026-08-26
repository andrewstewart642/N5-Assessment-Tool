import type {
  SavedAssessment,
} from "@/src/Assessments/SavedAssessments/SavedAssessment";

import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

type DeleteAssessmentModalProps = {
  savedAssessment: SavedAssessment | null;
  onCancel: () => void;
  onConfirm: () => void;
  theme: ReturnType<typeof useSettings>["theme"];
};

export default function DeleteAssessmentModal({
  savedAssessment,
  onCancel,
  onConfirm,
  theme,
}: DeleteAssessmentModalProps) {
  if (!savedAssessment) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: theme.modalOverlay,
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          border: `1px solid ${theme.borderStandard}`,
          borderRadius: 24,
          background: theme.bgElevated,
          boxShadow: theme.shadowStrong,
          padding: 24,
          display: "grid",
          gap: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.05,
              color: theme.textPrimary,
            }}
          >
            Delete assessment?
          </div>

          <div
            style={{
              fontSize: 15,
              lineHeight: 1.5,
              color: theme.textSecondary,
            }}
          >
            <strong
              style={{
                color: theme.textPrimary,
              }}
            >
              {savedAssessment.setup.assessmentName ||
                "[Untitled Assessment]"}
            </strong>{" "}
            will be permanently removed.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 12,
              border: `1px solid ${theme.borderStandard}`,
              background: theme.controlBg,
              color: theme.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid #dc2626",
              background: "rgba(220,38,38,0.12)",
              color: theme.textPrimary,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Delete assessment
          </button>
        </div>
      </div>
    </div>
  );
}