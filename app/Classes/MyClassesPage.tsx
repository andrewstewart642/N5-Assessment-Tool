"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  getDefaultClassCourseLabel,
} from "@/app/Courses/CourseCatalog";

import {
  useSettings,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import type {
  CourseOption,
  LevelOption,
} from "./ClassData";

import AddClassModal from "./MyClasses/AddClassModal";
import ClassGrid from "./MyClasses/Grid";
import ClassesHeader from "./MyClasses/PageHeader";

import {
  useClasses,
} from "./Records/Collection";


export default function MyClassesPage() {
  const {
    theme,
  } =
    useSettings();


  const {
    classesByCourse,
    hasLoaded,
    addClass,
  } =
    useClasses();


  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] =
    useState(
      false
    );


  const [
    className,
    setClassName,
  ] =
    useState(
      ""
    );


  const [
    course,
    setCourse,
  ] =
    useState<CourseOption>(
      getDefaultClassCourseLabel()
    );


  const [
    level,
    setLevel,
  ] =
    useState<LevelOption>(
      ""
    );


  const [
    teacher,
    setTeacher,
  ] =
    useState(
      ""
    );


  const classCount =
    useMemo(
      () =>
        Array.from(
          classesByCourse.values()
        ).reduce(
          (
            total,
            classes
          ) =>
            total +
            classes.length,
          0
        ),
      [
        classesByCourse,
      ]
    );


  function openAddModal() {
    setIsAddModalOpen(
      true
    );
  }


  function closeAddModal() {
    setIsAddModalOpen(
      false
    );

    setClassName(
      ""
    );

    setCourse(
      getDefaultClassCourseLabel()
    );

    setLevel(
      ""
    );

    setTeacher(
      ""
    );
  }


  function handleCreateClass() {
    if (
      !className.trim()
    ) {
      return;
    }


    addClass({
      name:
        className,

      course,

      level,

      teacher,
    });


    closeAddModal();
  }


  return (
    <>
      <main
        style={{
          minHeight:
            "100%",

          padding:
            "24px 16px",

          boxSizing:
            "border-box",

          background:
            theme.bgPage,

          color:
            theme.textPrimary,

          fontFamily:
            "var(--app-ui-font-family)",
        }}
      >
        <div
          style={{
            width:
              "100%",

            maxWidth:
              1400,

            margin:
              "0 auto",

            display:
              "grid",

            gap:
              18,
          }}
        >
          <ClassesHeader
            classCount={
              classCount
            }
            hasLoaded={
              hasLoaded
            }
            onAddClass={
              openAddModal
            }
            theme={
              theme
            }
          />


          {hasLoaded ? (
            <ClassGrid
              classesByCourse={
                classesByCourse
              }
              theme={
                theme
              }
            />
          ) : (
            <div
              style={{
                minHeight:
                  90,

                display:
                  "grid",

                placeItems:
                  "center",

                borderWidth:
                  1,

                borderStyle:
                  "solid",

                borderColor:
                  theme.borderStandard,

                borderRadius:
                  6,

                background:
                  theme.bgSurface,

                color:
                  theme.textMuted,

                fontSize:
                  12,
              }}
            >
              Loading classes...
            </div>
          )}
        </div>
      </main>


      <AddClassModal
        open={
          isAddModalOpen
        }
        className={
          className
        }
        setClassName={
          setClassName
        }
        course={
          course
        }
        setCourse={
          setCourse
        }
        level={
          level
        }
        setLevel={
          setLevel
        }
        teacher={
          teacher
        }
        setTeacher={
          setTeacher
        }
        onClose={
          closeAddModal
        }
        onCreate={
          handleCreateClass
        }
        theme={
          theme
        }
      />
    </>
  );
}