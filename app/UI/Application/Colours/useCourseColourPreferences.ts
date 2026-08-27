import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  getCourseAccent,
  isValidCourseColour,
} from "./CourseAccent";


const COURSE_COLOUR_STORAGE_KEY =
  "application-course-family-colours-v1";


const COURSE_IDS:
  CourseId[] = [
    "N5_MATH",
    "N5_APPLICATIONS_MATH",
    "HIGHER_MATH",
    "ADVANCED_HIGHER_MATH",
  ];


export type CourseColourOverrides =
  Partial<
    Record<
      CourseId,
      string
    >
  >;


function isCourseId(
  value:
    string
): value is CourseId {
  return COURSE_IDS.includes(
    value as CourseId
  );
}


function readStoredCourseColours():
  CourseColourOverrides {
  if (
    typeof window ===
    "undefined"
  ) {
    return {};
  }


  try {
    const raw =
      window.localStorage.getItem(
        COURSE_COLOUR_STORAGE_KEY
      );


    if (!raw) {
      return {};
    }


    const parsed:
      unknown =
      JSON.parse(
        raw
      );


    if (
      !parsed ||
      typeof parsed !==
        "object" ||
      Array.isArray(
        parsed
      )
    ) {
      return {};
    }


    const result:
      CourseColourOverrides =
      {};


    Object.entries(
      parsed
    ).forEach(
      ([
        key,
        value,
      ]) => {
        if (
          isCourseId(
            key
          ) &&
          isValidCourseColour(
            value
          )
        ) {
          result[key] =
            value;
        }
      }
    );


    return result;
  } catch {
    return {};
  }
}


function saveStoredCourseColours(
  colours:
    CourseColourOverrides
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }


  window.localStorage.setItem(
    COURSE_COLOUR_STORAGE_KEY,
    JSON.stringify(
      colours
    )
  );
}


export function useCourseColourPreferences() {
  const [
    overrides,
    setOverrides,
  ] =
    useState<CourseColourOverrides>(
      {}
    );


  useEffect(() => {
    setOverrides(
      readStoredCourseColours()
    );
  }, []);


  const getColour =
    useCallback(
      (
        courseId:
          CourseId
      ) =>
        getCourseAccent({
          courseId,

          overrideColour:
            overrides[
              courseId
            ],
        }),
      [
        overrides,
      ]
    );


  const setColour =
    useCallback(
      (
        courseId:
          CourseId,
        colour:
          string
      ) => {
        if (
          !isValidCourseColour(
            colour
          )
        ) {
          return;
        }


        setOverrides(
          (
            current
          ) => {
            const next:
              CourseColourOverrides =
              {
                ...current,

                [courseId]:
                  colour,
              };


            saveStoredCourseColours(
              next
            );


            return next;
          }
        );
      },
      []
    );


  const resetColour =
    useCallback(
      (
        courseId:
          CourseId
      ) => {
        setOverrides(
          (
            current
          ) => {
            const next = {
              ...current,
            };


            delete next[
              courseId
            ];


            saveStoredCourseColours(
              next
            );


            return next;
          }
        );
      },
      []
    );


  return {
    getColour,
    setColour,
    resetColour,
  };
}