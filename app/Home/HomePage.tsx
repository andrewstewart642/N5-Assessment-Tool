"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  loadSavedAssessments,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import {
  useClasses,
} from "@/app/Classes/State/useClasses";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import {
  useCourseColourPreferences,
} from "@/app/UI/Application/Colours/useCourseColourPreferences";

import {
  useSettings,
} from "@/app/UI/Application/Settings/ApplicationSettings";

import HomeContinueWorkingSection from "./ContinueWorking/HomeContinueWorkingSection";

import HomeForYouSection from "./ForYou/HomeForYouSection";

import {
  getHomeAssessmentCourseId,
  getMostRecentlyEditedHomeAssessment,
} from "./HomeDashboardData/HomeDashboardData";

import HomePageHeader from "./Header/HomePageHeader";

import HomeMyClassesOverviewSection from "./MyClassesOverview/HomeMyClassesOverviewSection";

import HomeProductUpdatesSection from "./ProductUpdates/HomeProductUpdatesSection";

import HomeUpcomingAssessmentsCalendar from "./UpcomingAssessments/HomeUpcomingAssessmentsCalendar";


export default function HomePage() {
  const {
    theme,
  } =
    useSettings();


  const {
    getColour,
  } =
    useCourseColourPreferences();


  const {
    classes,
    hasLoaded:
      classesHaveLoaded,
  } =
    useClasses();


  const [
    assessments,
    setAssessments,
  ] =
    useState<
      SavedAssessment[]
    >(
      []
    );


  const [
    assessmentsHaveLoaded,
    setAssessmentsHaveLoaded,
  ] =
    useState(
      false
    );


  const today =
    useMemo(
      () =>
        new Date(),
      []
    );


  useEffect(() => {
    setAssessments(
      loadSavedAssessments()
    );


    setAssessmentsHaveLoaded(
      true
    );
  }, []);


  const recentAssessment =
    useMemo(
      () =>
        getMostRecentlyEditedHomeAssessment(
          assessments
        ),
      [
        assessments,
      ]
    );


  function getCourseColour(
    courseId:
      CourseId | null
  ): string {
    if (
      !courseId
    ) {
      return theme.accentPrimary;
    }


    return getColour(
      courseId
    );
  }


  const recentAssessmentAccent =
    recentAssessment
      ? getCourseColour(
          getHomeAssessmentCourseId(
            recentAssessment
          )
        )
      : theme.accentPrimary;


  const everythingHasLoaded =
    assessmentsHaveLoaded &&
    classesHaveLoaded;


  return (
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
            12,
        }}
      >
        <HomePageHeader
          theme={
            theme
          }
        />


        <HomeForYouSection
          assessments={
            assessments
          }
          classes={
            classes
          }
          hasLoaded={
            everythingHasLoaded
          }
          today={
            today
          }
          getCourseColour={
            getCourseColour
          }
          theme={
            theme
          }
        />


        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 0.92fr) minmax(520px, 1.08fr)",

            gap:
              12,

            alignItems:
              "stretch",
          }}
        >
          <HomeContinueWorkingSection
            assessment={
              recentAssessment
            }
            courseAccent={
              recentAssessmentAccent
            }
            hasLoaded={
              assessmentsHaveLoaded
            }
            theme={
              theme
            }
          />


          <HomeUpcomingAssessmentsCalendar
            assessments={
              assessments
            }
            today={
              today
            }
            getCourseColour={
              getCourseColour
            }
            theme={
              theme
            }
          />
        </div>


        <div
          style={{
            minWidth:
              0,

            display:
              "grid",

            gridTemplateColumns:
              "minmax(0, 1.35fr) minmax(300px, 0.65fr)",

            gap:
              12,

            alignItems:
              "stretch",
          }}
        >
          <HomeMyClassesOverviewSection
            classes={
              classes
            }
            hasLoaded={
              classesHaveLoaded
            }
            getCourseColour={
              getCourseColour
            }
            theme={
              theme
            }
          />


          <HomeProductUpdatesSection
            theme={
              theme
            }
          />
        </div>
      </div>
    </main>
  );
}