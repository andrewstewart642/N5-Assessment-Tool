
import {
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";

const UNTITLED_ASSESSMENT_NAME =
  "[Untitled file]";

type UseAssessmentNameFieldArgs = {
  assessmentName:
    string;

  setAssessmentName:
    Dispatch<
      SetStateAction<string>
    >;
};

export function useAssessmentNameField({
  assessmentName,
  setAssessmentName,
}: UseAssessmentNameFieldArgs) {
  const handleAssessmentNameFocus =
    useCallback(
      () => {
        if (
          assessmentName ===
          UNTITLED_ASSESSMENT_NAME
        ) {
          setAssessmentName(
            ""
          );
        }
      },
      [
        assessmentName,
        setAssessmentName,
      ]
    );

  const handleAssessmentNameBlur =
    useCallback(
      () => {
        if (
          !assessmentName
            .trim()
            .length
        ) {
          setAssessmentName(
            UNTITLED_ASSESSMENT_NAME
          );
        }
      },
      [
        assessmentName,
        setAssessmentName,
      ]
    );

  return {
    handleAssessmentNameFocus,
    handleAssessmentNameBlur,
  };
}