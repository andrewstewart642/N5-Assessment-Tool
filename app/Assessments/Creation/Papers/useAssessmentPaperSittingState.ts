import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  CourseAssessmentConfig,
} from "@/app/Courses/CourseAssessmentConfig";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import {
  getAssessmentPapers,
} from "./AssessmentPaperRules";

import {
  buildAssessmentPaperValueMap,
  buildEmptyAssessmentPaperValueMap,
  getAssessmentPaperBooleanValue,
  getAssessmentPaperStringValue,
  type AssessmentPaperBooleanMap,
  type AssessmentPaperStringMap,
  type AssessmentPaperStringSetterMap,
} from "./AssessmentPaperValueMaps";


type StringSetter =
  Dispatch<
    SetStateAction<string>
  >;

type BooleanSetter =
  Dispatch<
    SetStateAction<boolean>
  >;


type UseAssessmentPaperSittingStateArgs = {
  courseConfig:
    CourseAssessmentConfig;

  assessmentDate:
    string;

  setAssessmentDate:
    StringSetter;
};


function resolveNextStringValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue:
    string;

  nextValueOrUpdater:
    SetStateAction<string>;
}): string {
  return typeof nextValueOrUpdater ===
    "function"
    ? nextValueOrUpdater(
        currentValue
      )
    : nextValueOrUpdater;
}


function resolveNextBooleanValue({
  currentValue,
  nextValueOrUpdater,
}: {
  currentValue:
    boolean;

  nextValueOrUpdater:
    SetStateAction<boolean>;
}): boolean {
  return typeof nextValueOrUpdater ===
    "function"
    ? nextValueOrUpdater(
        currentValue
      )
    : nextValueOrUpdater;
}


export function useAssessmentPaperSittingState({
  courseConfig,
  assessmentDate,
  setAssessmentDate,
}: UseAssessmentPaperSittingStateArgs) {
  const coursePapers =
    useMemo(
      () => {
        return getAssessmentPapers(
          courseConfig
        );
      },
      [
        courseConfig,
      ]
    );

  const firstPaper =
    coursePapers[
      0
    ] ??
    "P1";

  const secondPaper =
    coursePapers[
      1
    ] ??
    coursePapers[
      0
    ] ??
    "P2";


  /*
   * Start / End values
   */

  const [
    startTimeByPaper,
    setStartTimeByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            "",
        })
    );

  const [
    endTimeByPaper,
    setEndTimeByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            "",
        })
    );


  /*
   * Dates
   *
   * The first paper continues to use
   * assessmentDate as the historical base value.
   *
   * Other papers only require an override once
   * the linked-date relationship is broken.
   */

  const [
    coverDateOverrideByPaper,
    setCoverDateOverrideByPaper,
  ] =
    useState<AssessmentPaperStringMap>(
      {}
    );

  const [
    coverDateCustomByPaper,
    setCoverDateCustomByPaper,
  ] =
    useState<AssessmentPaperBooleanMap>(
      {}
    );


  /*
   * Permanent link state
   *
   * Linked:
   *   first manual edit drives both papers.
   *
   * A manual edit on another paper permanently
   * breaks the link.
   *
   * There is intentionally no relink operation.
   */

  const [
    datesUnlinked,
    setDatesUnlinked,
  ] =
    useState(
      false
    );

  const [
    dateLinkOwnerPaper,
    setDateLinkOwnerPaper,
  ] =
    useState<
      Paper | null
    >(
      null
    );

  const [
    startTimesUnlinked,
    setStartTimesUnlinked,
  ] =
    useState(
      false
    );

  const [
    startTimeLinkOwnerPaper,
    setStartTimeLinkOwnerPaper,
  ] =
    useState<
      Paper | null
    >(
      null
    );


  /*
   * Manual End override state
   */

  const [
    endTimeManuallyEditedByPaper,
    setEndTimeManuallyEditedByPaper,
  ] =
    useState<AssessmentPaperBooleanMap>(
      () =>
        buildEmptyAssessmentPaperValueMap({
          papers:
            coursePapers,

          value:
            false,
        })
    );


  const coverDateByPaper =
    useMemo<AssessmentPaperStringMap>(
      () => {
        return buildAssessmentPaperValueMap({
          papers:
            coursePapers,

          getValue:
            (
              paper
            ) => {
              if (
                paper ===
                firstPaper
              ) {
                return assessmentDate;
              }

              const isCustom =
                getAssessmentPaperBooleanValue({
                  paper,

                  valuesByPaper:
                    coverDateCustomByPaper,
                });

              if (
                !isCustom
              ) {
                return assessmentDate;
              }

              return getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  coverDateOverrideByPaper,

                fallback:
                  assessmentDate,
              });
            },
        });
      },
      [
        coursePapers,
        firstPaper,
        assessmentDate,
        coverDateCustomByPaper,
        coverDateOverrideByPaper,
      ]
    );


  /*
   * Manual DATE editing
   */

  const setCoverDateForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        const currentValue =
          getAssessmentPaperStringValue({
            paper,

            valuesByPaper:
              coverDateByPaper,

            fallback:
              assessmentDate,
          });

        const nextValue =
          resolveNextStringValue({
            currentValue,

            nextValueOrUpdater,
          });

        /*
         * Already unlinked:
         * modify only the selected paper.
         */
        if (
          datesUnlinked
        ) {
          if (
            paper ===
            firstPaper
          ) {
            setAssessmentDate(
              nextValue
            );

            return;
          }

          setCoverDateOverrideByPaper(
            (
              previous
            ) => ({
              ...previous,

              [paper]:
                nextValue,
            })
          );

          setCoverDateCustomByPaper(
            (
              previous
            ) => ({
              ...previous,

              [paper]:
                true,
            })
          );

          return;
        }

        /*
         * Nobody has manually claimed the linked
         * date yet, OR the same paper is editing
         * it again.
         *
         * Keep every paper linked.
         */
        if (
          dateLinkOwnerPaper ===
            null ||
          dateLinkOwnerPaper ===
            paper
        ) {
          if (
            nextValue.trim()
          ) {
            setDateLinkOwnerPaper(
              paper
            );
          }

          setAssessmentDate(
            nextValue
          );

          setCoverDateOverrideByPaper(
            (
              previous
            ) => {
              const nextMap = {
                ...previous,
              };

              coursePapers.forEach(
                (
                  coursePaper
                ) => {
                  if (
                    coursePaper !==
                    firstPaper
                  ) {
                    nextMap[
                      coursePaper
                    ] =
                      nextValue;
                  }
                }
              );

              return nextMap;
            }
          );

          setCoverDateCustomByPaper(
            (
              previous
            ) => {
              const nextMap = {
                ...previous,
              };

              coursePapers.forEach(
                (
                  coursePaper
                ) => {
                  nextMap[
                    coursePaper
                  ] =
                    false;
                }
              );

              return nextMap;
            }
          );

          return;
        }

        /*
         * Another paper has now been manually
         * edited.
         *
         * This permanently breaks date linking.
         *
         * Preserve the currently shared date on
         * every non-primary paper BEFORE changing
         * the newly edited paper.
         */
        const sharedDate =
          assessmentDate;

        setDatesUnlinked(
          true
        );

        setDateLinkOwnerPaper(
          null
        );

        setCoverDateOverrideByPaper(
          (
            previous
          ) => {
            const nextMap = {
              ...previous,
            };

            coursePapers.forEach(
              (
                coursePaper
              ) => {
                if (
                  coursePaper !==
                  firstPaper
                ) {
                  nextMap[
                    coursePaper
                  ] =
                    sharedDate;
                }
              }
            );

            if (
              paper !==
              firstPaper
            ) {
              nextMap[
                paper
              ] =
                nextValue;
            }

            return nextMap;
          }
        );

        setCoverDateCustomByPaper(
          (
            previous
          ) => {
            const nextMap = {
              ...previous,
            };

            coursePapers.forEach(
              (
                coursePaper
              ) => {
                nextMap[
                  coursePaper
                ] =
                  coursePaper !==
                  firstPaper;
              }
            );

            return nextMap;
          }
        );

        if (
          paper ===
          firstPaper
        ) {
          setAssessmentDate(
            nextValue
          );
        }
      },
      [
        assessmentDate,
        coverDateByPaper,
        coursePapers,
        dateLinkOwnerPaper,
        datesUnlinked,
        firstPaper,
        setAssessmentDate,
      ]
    );


  /*
   * Manual START editing
   */

  const setStartTimeForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        const currentValue =
          getAssessmentPaperStringValue({
            paper,

            valuesByPaper:
              startTimeByPaper,
          });

        const nextValue =
          resolveNextStringValue({
            currentValue,

            nextValueOrUpdater,
          });

        /*
         * Already permanently unlinked.
         */
        if (
          startTimesUnlinked
        ) {
          setStartTimeByPaper(
            (
              previous
            ) => ({
              ...previous,

              [paper]:
                nextValue,
            })
          );

          return;
        }

        /*
         * First manual start-time edit, or another
         * edit by the same paper:
         *
         * all papers continue following it.
         */
        if (
          startTimeLinkOwnerPaper ===
            null ||
          startTimeLinkOwnerPaper ===
            paper
        ) {
          if (
            nextValue.trim()
          ) {
            setStartTimeLinkOwnerPaper(
              paper
            );
          }

          setStartTimeByPaper(
            (
              previous
            ) => {
              const nextMap = {
                ...previous,
              };

              coursePapers.forEach(
                (
                  coursePaper
                ) => {
                  nextMap[
                    coursePaper
                  ] =
                    nextValue;
                }
              );

              return nextMap;
            }
          );

          return;
        }

        /*
         * A different paper has now been manually
         * edited.
         *
         * Start-time linking is permanently broken.
         */
        setStartTimesUnlinked(
          true
        );

        setStartTimeLinkOwnerPaper(
          null
        );

        setStartTimeByPaper(
          (
            previous
          ) => ({
            ...previous,

            [paper]:
              nextValue,
          })
        );
      },
      [
        coursePapers,
        startTimeByPaper,
        startTimeLinkOwnerPaper,
        startTimesUnlinked,
      ]
    );


  /*
   * Raw END setter.
   *
   * Used by automatic timing as well as the
   * historical compatibility layer.
   *
   * It deliberately does NOT declare the value
   * manual by itself.
   */

  const setEndTimeForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        setEndTimeByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperStringValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextStringValue({
                  currentValue,

                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );


  /*
   * Convenience API for the new tray.
   *
   * Pass B can call one function when the teacher
   * manually changes an End value.
   */

  const setManualEndTimeForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<string>
      ) => {
        setEndTimeManuallyEditedByPaper(
          (
            previous
          ) => ({
            ...previous,

            [paper]:
              true,
          })
        );

        setEndTimeForPaper(
          paper,
          nextValueOrUpdater
        );
      },
      [
        setEndTimeForPaper,
      ]
    );


  const setCoverDateCustomForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<boolean>
      ) => {
        setCoverDateCustomByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperBooleanValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextBooleanValue({
                  currentValue,

                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );


  const setEndTimeManuallyEditedForPaper =
    useCallback(
      (
        paper:
          Paper,

        nextValueOrUpdater:
          SetStateAction<boolean>
      ) => {
        setEndTimeManuallyEditedByPaper(
          (
            previous
          ) => {
            const currentValue =
              getAssessmentPaperBooleanValue({
                paper,

                valuesByPaper:
                  previous,
              });

            return {
              ...previous,

              [paper]:
                resolveNextBooleanValue({
                  currentValue,

                  nextValueOrUpdater,
                }),
            };
          }
        );
      },
      []
    );


  /*
   * Primary-paper manual date setter.
   *
   * This lets the existing TopBar date control
   * participate in the exact same linking rules
   * as the future Settings tray.
   */

  const setPrimaryCoverDate:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setCoverDateForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setCoverDateForPaper,
        ]
      );


  /*
   * Transitional first/second-paper aliases.
   *
   * These are RAW setters because persistence
   * hydration must never masquerade as a teacher
   * manually editing the field.
   */

  const p1StartTime =
    getAssessmentPaperStringValue({
      paper:
        firstPaper,

      valuesByPaper:
        startTimeByPaper,
    });

  const p1EndTime =
    getAssessmentPaperStringValue({
      paper:
        firstPaper,

      valuesByPaper:
        endTimeByPaper,
    });

  const p2CoverDate =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        coverDateOverrideByPaper,

      fallback:
        assessmentDate,
    });

  const p2StartTime =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        startTimeByPaper,
    });

  const p2EndTime =
    getAssessmentPaperStringValue({
      paper:
        secondPaper,

      valuesByPaper:
        endTimeByPaper,
    });

  const p2DateCustom =
    getAssessmentPaperBooleanValue({
      paper:
        secondPaper,

      valuesByPaper:
        coverDateCustomByPaper,
    });


  const setP1StartTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setStartTimeByPaper(
            (
              previous
            ) => {
              const currentValue =
                getAssessmentPaperStringValue({
                  paper:
                    firstPaper,

                  valuesByPaper:
                    previous,
                });

              return {
                ...previous,

                [firstPaper]:
                  resolveNextStringValue({
                    currentValue,

                    nextValueOrUpdater,
                  }),
              };
            }
          );
        },
        [
          firstPaper,
        ]
      );


  const setP1EndTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setEndTimeForPaper,
        ]
      );


  const setP2CoverDate:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setCoverDateOverrideByPaper(
            (
              previous
            ) => {
              const currentValue =
                getAssessmentPaperStringValue({
                  paper:
                    secondPaper,

                  valuesByPaper:
                    previous,

                  fallback:
                    assessmentDate,
                });

              return {
                ...previous,

                [secondPaper]:
                  resolveNextStringValue({
                    currentValue,

                    nextValueOrUpdater,
                  }),
              };
            }
          );
        },
        [
          assessmentDate,
          secondPaper,
        ]
      );


  const setP2StartTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setStartTimeByPaper(
            (
              previous
            ) => {
              const currentValue =
                getAssessmentPaperStringValue({
                  paper:
                    secondPaper,

                  valuesByPaper:
                    previous,
                });

              return {
                ...previous,

                [secondPaper]:
                  resolveNextStringValue({
                    currentValue,

                    nextValueOrUpdater,
                  }),
              };
            }
          );
        },
        [
          secondPaper,
        ]
      );


  const setP2EndTime:
    StringSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setEndTimeForPaper,
        ]
      );


  const setP2DateCustom:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setCoverDateCustomByPaper(
            (
              previous
            ) => {
              const currentValue =
                getAssessmentPaperBooleanValue({
                  paper:
                    secondPaper,

                  valuesByPaper:
                    previous,
                });

              const nextValue =
                resolveNextBooleanValue({
                  currentValue,

                  nextValueOrUpdater,
                });

              /*
               * Historical persisted custom P2 date
               * means the papers were already
               * independently controlled.
               */
              if (
                nextValue
              ) {
                setDatesUnlinked(
                  true
                );

                setDateLinkOwnerPaper(
                  null
                );
              }

              return {
                ...previous,

                [secondPaper]:
                  nextValue,
              };
            }
          );
        },
        [
          secondPaper,
        ]
      );


  const setP1EndTimeManuallyEdited:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeManuallyEditedForPaper(
            firstPaper,
            nextValueOrUpdater
          );
        },
        [
          firstPaper,
          setEndTimeManuallyEditedForPaper,
        ]
      );


  const setP2EndTimeManuallyEdited:
    BooleanSetter =
      useCallback(
        (
          nextValueOrUpdater
        ) => {
          setEndTimeManuallyEditedForPaper(
            secondPaper,
            nextValueOrUpdater
          );
        },
        [
          secondPaper,
          setEndTimeManuallyEditedForPaper,
        ]
      );


  const endTimeSetterByPaper =
    useMemo<AssessmentPaperStringSetterMap>(
      () => {
        return buildAssessmentPaperValueMap({
          papers:
            coursePapers,

          getValue:
            (
              paper
            ) => {
              return (
                nextValueOrUpdater:
                  SetStateAction<string>
              ) => {
                setEndTimeForPaper(
                  paper,
                  nextValueOrUpdater
                );
              };
            },
        });
      },
      [
        coursePapers,
        setEndTimeForPaper,
      ]
    );


  return {
    coverDateByPaper,
    startTimeByPaper,
    endTimeByPaper,

    coverDateCustomByPaper,

    endTimeManuallyEditedByPaper,
    endTimeSetterByPaper,


    /*
     * New permanent-link state
     */

    datesUnlinked,
    setDatesUnlinked,

    dateLinkOwnerPaper,
    setDateLinkOwnerPaper,

    startTimesUnlinked,
    setStartTimesUnlinked,

    startTimeLinkOwnerPaper,
    setStartTimeLinkOwnerPaper,


    /*
     * Raw hydration setters
     */

    setCoverDateByPaper:
      setCoverDateOverrideByPaper,

    setStartTimeByPaper,
    setEndTimeByPaper,

    setCoverDateCustomByPaper,

    setEndTimeManuallyEditedByPaper,


    /*
     * Manual teacher-edit APIs
     */

    setPrimaryCoverDate,

    setStartTimeForPaper,
    setEndTimeForPaper,

    setManualEndTimeForPaper,

    setCoverDateForPaper,
    setCoverDateCustomForPaper,

    setEndTimeManuallyEditedForPaper,


    /*
     * Compatibility aliases
     */

    p1StartTime,
    p1EndTime,

    p2CoverDate,
    p2StartTime,
    p2EndTime,

    p2DateCustom,

    setP1StartTime,
    setP1EndTime,

    setP2CoverDate,
    setP2StartTime,
    setP2EndTime,

    setP2DateCustom,

    setP1EndTimeManuallyEdited,
    setP2EndTimeManuallyEdited,
  };
}