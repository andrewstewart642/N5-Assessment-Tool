import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deriveCompletedSkillIdsFromConcepts,
  getAllCoverageSkills,
  getTrackableConceptIds,
  normaliseCompletedConceptIdsForCourse,
} from "../Coverage/ClassCoverageHelpers";

import type {
  CourseOption,
  LevelOption,
  SchoolClass,
} from "../ClassTypes";

import {
  buildNewSchoolClass,
  normaliseClass,
} from "./ClassNormalisation";

import {
  readMyClassesStorageValue,
  writeMyClassesStorageValue,
} from "./ClassStorage";


function makeClassId():
  string {
  return `class-${Date.now()}-${Math.random()
    .toString(
      36
    )
    .slice(
      2,
      8
    )}`;
}


function sortClasses(
  items:
    SchoolClass[]
): SchoolClass[] {
  return [
    ...items,
  ].sort(
    (
      a,
      b
    ) => {
      if (
        a.course !==
        b.course
      ) {
        return a.course.localeCompare(
          b.course
        );
      }


      return a.name.localeCompare(
        b.name,
        undefined,
        {
          numeric:
            true,

          sensitivity:
            "base",
        }
      );
    }
  );
}


type AddClassArgs = {
  name:
    string;

  course:
    CourseOption;

  level:
    LevelOption;

  teacher:
    string;
};


type UpdateCompletedSkillsArgs = {
  classId:
    string;

  completedSkillIds:
    string[];
};


type UpdateCompletedConceptsArgs = {
  classId:
    string;

  completedConceptIds:
    string[];
};


function cleanIds(
  values:
    string[]
): string[] {
  return Array.from(
    new Set(
      values.filter(
        (
          value
        ) =>
          typeof value ===
            "string" &&
          value.trim()
            .length >
            0
      )
    )
  );
}


export function useClasses() {
  const [
    classes,
    setClasses,
  ] =
    useState<
      SchoolClass[]
    >(
      []
    );


  const [
    hasLoaded,
    setHasLoaded,
  ] =
    useState(
      false
    );


  useEffect(() => {
    try {
      const raw =
        readMyClassesStorageValue();


      if (
        !raw
      ) {
        setHasLoaded(
          true
        );

        return;
      }


      const parsed =
        JSON.parse(
          raw
        ) as unknown;


      if (
        !Array.isArray(
          parsed
        )
      ) {
        setHasLoaded(
          true
        );

        return;
      }


      const safeClasses =
        parsed
          .map(
            normaliseClass
          )
          .filter(
            (
              item
            ): item is
              SchoolClass =>
                item !==
                null
          );


      setClasses(
        sortClasses(
          safeClasses
        )
      );
    } catch {
      setClasses(
        []
      );
    } finally {
      setHasLoaded(
        true
      );
    }
  }, []);


  useEffect(() => {
    if (
      !hasLoaded
    ) {
      return;
    }


    writeMyClassesStorageValue(
      JSON.stringify(
        classes
      )
    );
  }, [
    classes,
    hasLoaded,
  ]);


  const classesByCourse =
    useMemo(
      () => {
        const grouped =
          new Map<
            CourseOption,
            SchoolClass[]
          >();


        for (
          const schoolClass
          of classes
        ) {
          const current =
            grouped.get(
              schoolClass.course
            ) ??
            [];


          current.push(
            schoolClass
          );


          grouped.set(
            schoolClass.course,
            current
          );
        }


        return grouped;
      },
      [
        classes,
      ]
    );


  function addClass({
    name,
    course,
    level,
    teacher,
  }: AddClassArgs) {
    const trimmedName =
      name.trim();


    const trimmedTeacher =
      teacher.trim();


    if (
      !trimmedName
    ) {
      return;
    }


    const now =
      Date.now();


    const nextClass =
      buildNewSchoolClass({
        id:
          makeClassId(),

        name:
          trimmedName,

        course,

        level,

        teacher:
          trimmedTeacher,

        createdAt:
          now,
      });


    setClasses(
      (
        current
      ) =>
        sortClasses([
          ...current,
          nextClass,
        ])
    );
  }


  function deleteClass(
    classId:
      string
  ) {
    setClasses(
      (
        current
      ) =>
        current.filter(
          (
            item
          ) =>
            item.id !==
            classId
        )
    );
  }


  /**
   * Compatibility whole-skill update.
   *
   * Existing callers can still mark a parent skill
   * complete/incomplete. When that happens its leaf
   * concepts are added/removed accordingly.
   *
   * Partial coverage belonging to other incomplete
   * skills is preserved.
   */
  function updateCompletedSkills({
    classId,
    completedSkillIds,
  }: UpdateCompletedSkillsArgs) {
    const requestedCompletedSkillIds =
      cleanIds(
        completedSkillIds
      );


    setClasses(
      (
        current
      ) =>
        current.map(
          (
            item
          ) => {
            if (
              item.id !==
              classId
            ) {
              return item;
            }


            const previouslyCompletedSkillIds =
              new Set(
                item.completedSkillIds
              );


            const requestedCompletedSkillIdSet =
              new Set(
                requestedCompletedSkillIds
              );


            const completedConceptIdSet =
              new Set(
                normaliseCompletedConceptIdsForCourse(
                  item.courseId,
                  item.completedConceptIds
                )
              );


            const courseSkills =
              getAllCoverageSkills(
                item.courseId
              );


            for (
              const {
                skill,
              }
              of courseSkills
            ) {
              const trackableConceptIds =
                getTrackableConceptIds(
                  skill
                );


              /**
               * Parent was explicitly marked complete:
               * fill every underlying leaf concept.
               */
              if (
                requestedCompletedSkillIdSet.has(
                  skill.id
                )
              ) {
                for (
                  const conceptId
                  of trackableConceptIds
                ) {
                  completedConceptIdSet.add(
                    conceptId
                  );
                }


                continue;
              }


              /**
               * Parent used to be complete but has
               * now explicitly been unticked:
               * clear all of its leaf concepts.
               */
              if (
                previouslyCompletedSkillIds.has(
                  skill.id
                )
              ) {
                for (
                  const conceptId
                  of trackableConceptIds
                ) {
                  completedConceptIdSet.delete(
                    conceptId
                  );
                }
              }
            }


            const nextCompletedConceptIds =
              normaliseCompletedConceptIdsForCourse(
                item.courseId,
                Array.from(
                  completedConceptIdSet
                )
              );


            const nextCompletedSkillIds =
              deriveCompletedSkillIdsFromConcepts(
                item.courseId,
                nextCompletedConceptIds,
                requestedCompletedSkillIds
              );


            return {
              ...item,

              completedSkillIds:
                nextCompletedSkillIds,

              completedConceptIds:
                nextCompletedConceptIds,

              updatedAt:
                Date.now(),
            };
          }
        )
    );
  }


  /**
   * New primary coverage update.
   *
   * The UI will toggle individual specification
   * concepts through this API.
   *
   * completedSkillIds is then automatically rebuilt
   * from those leaf concepts.
   */
  function updateCompletedConcepts({
    classId,
    completedConceptIds,
  }: UpdateCompletedConceptsArgs) {
    setClasses(
      (
        current
      ) =>
        current.map(
          (
            item
          ) => {
            if (
              item.id !==
              classId
            ) {
              return item;
            }


            const nextCompletedConceptIds =
              normaliseCompletedConceptIdsForCourse(
                item.courseId,
                cleanIds(
                  completedConceptIds
                )
              );


            const nextCompletedSkillIds =
              deriveCompletedSkillIdsFromConcepts(
                item.courseId,
                nextCompletedConceptIds,
                item.completedSkillIds
              );


            return {
              ...item,

              completedConceptIds:
                nextCompletedConceptIds,

              completedSkillIds:
                nextCompletedSkillIds,

              updatedAt:
                Date.now(),
            };
          }
        )
    );
  }


  function getClassById(
    classId:
      string
  ): SchoolClass | null {
    return (
      classes.find(
        (
          item
        ) =>
          item.id ===
          classId
      ) ??
      null
    );
  }


  return {
    classes,

    classesByCourse,

    hasLoaded,

    addClass,

    deleteClass,

    updateCompletedSkills,

    updateCompletedConcepts,

    getClassById,
  };
}