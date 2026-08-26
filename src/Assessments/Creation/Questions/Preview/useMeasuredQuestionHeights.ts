import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  Question,
} from "@/shared-types/AssessmentTypes";

import type {
  AssessmentEditQuestionDraftByPaper,
  AssessmentQuestionDraftByPaper,
} from "../AssessmentQuestionDraftTypes";

type UseMeasuredQuestionHeightsArgs = {
  questions:
    Question[];

  draftByPaper:
    AssessmentQuestionDraftByPaper;

  editDraftByPaper:
    AssessmentEditQuestionDraftByPaper;

  setMeasuredHeights:
    Dispatch<
      SetStateAction<
        Record<
          string,
          number
        >
      >
    >;
};

export function useMeasuredQuestionHeights({
  questions,
  draftByPaper,
  editDraftByPaper,
  setMeasuredHeights,
}: UseMeasuredQuestionHeightsArgs) {
  const onMeasure =
    useCallback(
      (
        id: string,
        heightPx: number
      ) => {
        if (
          !Number.isFinite(
            heightPx
          ) ||
          heightPx <= 0
        ) {
          return;
        }

        const rounded =
          Math.round(
            heightPx
          );

        setMeasuredHeights(
          (previous) => {
            const previousHeight =
              previous[id];

            if (
              typeof previousHeight !==
              "number"
            ) {
              return {
                ...previous,

                [id]:
                  rounded,
              };
            }

            if (
              Math.abs(
                previousHeight -
                rounded
              ) <= 1
            ) {
              return previous;
            }

            return {
              ...previous,

              [id]:
                rounded,
            };
          }
        );
      },
      [
        setMeasuredHeights,
      ]
    );

  useEffect(() => {
    const liveIds =
      new Set<string>();

    questions.forEach(
      (question) => {
        liveIds.add(
          question.id
        );
      }
    );

    Object.values(
      draftByPaper
    ).forEach(
      (draft) => {
        if (draft) {
          liveIds.add(
            draft.id
          );
        }
      }
    );

    Object.values(
      editDraftByPaper
    ).forEach(
      (editDraft) => {
        if (!editDraft) {
          return;
        }

        liveIds.add(
          editDraft.original.id
        );

        liveIds.add(
          editDraft.draft.id
        );
      }
    );

    setMeasuredHeights(
      (previous) => {
        let changed =
          false;

        const next:
          Record<
            string,
            number
          > = {};

        for (
          const [
            id,
            height,
          ] of Object.entries(
            previous
          )
        ) {
          if (
            liveIds.has(
              id
            )
          ) {
            next[id] =
              height;
          } else {
            changed =
              true;
          }
        }

        return changed
          ? next
          : previous;
      }
    );
  }, [
    questions,
    draftByPaper,
    editDraftByPaper,
    setMeasuredHeights,
  ]);

  return {
    onMeasure,
  };
}