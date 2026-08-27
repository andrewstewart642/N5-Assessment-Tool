import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";


type DeleteAssessmentModalProps = {
  savedAssessment:
    SavedAssessment | null;

  onCancel:
    () => void;

  onConfirm:
    () => void;

  theme:
    AppTheme;
};


export default function DeleteAssessmentModal({
  savedAssessment,
  onCancel,
  onConfirm,
  theme,
}: DeleteAssessmentModalProps) {
  if (
    !savedAssessment
  ) {
    return null;
  }

  return (
    <div
      style={{
        position:
          "fixed",

        inset:
          0,

        padding:
          20,

        display:
          "grid",

        placeItems:
          "center",

        background:
          theme.modalOverlay,

        zIndex:
          1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-assessment-title"
        style={{
          width:
            "100%",

          maxWidth:
            420,

          padding:
            14,

          boxSizing:
            "border-box",

          display:
            "grid",

          gap:
            14,

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.borderStandard,

          borderRadius:
            6,

          background:
            theme.bgElevated,

          boxShadow:
            theme.shadowStrong,
        }}
      >
        <div
          style={{
            display:
              "grid",

            gap:
              5,
          }}
        >
          <div
            id="delete-assessment-title"
            style={{
              color:
                theme.textPrimary,

              fontSize:
                16,

              fontWeight:
                650,

              lineHeight:
                1.2,
            }}
          >
            Delete assessment?
          </div>

          <div
            style={{
              color:
                theme.textSecondary,

              ...UI_TEXT.controlText,
            }}
          >
            <strong
              style={{
                color:
                  theme.textPrimary,
              }}
            >
              {savedAssessment.setup
                .assessmentName ||
                "[Untitled file]"}
            </strong>
            {" "}will be permanently removed.
          </div>
        </div>

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "flex-end",

            gap:
              6,
          }}
        >
          <button
            type="button"
            onClick={
              onCancel
            }
            style={{
              height:
                32,

              padding:
                "0 10px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                theme.borderStandard,

              borderRadius:
                5,

              background:
                theme.controlBg,

              color:
                theme.textPrimary,

              cursor:
                "pointer",

              ...UI_TEXT.buttonText,
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={
              onConfirm
            }
            style={{
              height:
                32,

              padding:
                "0 10px",

              borderWidth:
                1,

              borderStyle:
                "solid",

              borderColor:
                "#dc5555",

              borderRadius:
                5,

              background:
                "rgba(220, 85, 85, 0.12)",

              color:
                theme.textPrimary,

              cursor:
                "pointer",

              ...UI_TEXT.buttonText,
            }}
          >
            Delete assessment
          </button>
        </div>
      </div>
    </div>
  );
}