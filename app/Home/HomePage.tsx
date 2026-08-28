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
          "26px 20px 36px",

        boxSizing:
          "border-box",

        background:
          `linear-gradient(
            180deg,
            color-mix(
              in srgb,
              ${theme.bgSection} 82%,
              ${theme.bgPage}
            ) 0%,
            color-mix(
              in srgb,
              ${theme.bgSection} 58%,
              ${theme.bgPage}
            ) 44%,
            ${theme.bgPage} 100%
          )`,

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
            24,
        }}
      >
        <HomePageHeader
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
              "minmax(380px, 0.8fr) minmax(560px, 1.2fr)",

            gap:
              18,

            alignItems:
              "stretch",
          }}
        >
          <div
            style={{
              minWidth:
                0,

              display:
                "grid",

              alignContent:
                "start",

              gap:
                18,
            }}
          >
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
          </div>


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
              "minmax(0, 1fr) minmax(360px, 420px)",

            gap:
              24,

            alignItems:
              "start",
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