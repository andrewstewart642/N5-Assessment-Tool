import Link from "next/link";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  SchoolClass,
} from "@/app/Classes/ClassTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  formatHomeShortDate,
  getDaysUntilHomeDate,
  getHomeAssessmentCourseId,
  getHomeAssessmentName,
  getHomeAssessmentProgress,
  getHomeClassCoverage,
  getMostRecentlyEditedHomeAssessment,
  getUpcomingHomeAssessments,
  parseHomeAssessmentDate,
} from "../HomeDashboardData/HomeDashboardData";

import HomeSectionHeader from "../SharedComponents/HomeSectionHeader";


type Props = {
  assessments:
    SavedAssessment[];

  classes:
    SchoolClass[];

  hasLoaded:
    boolean;

  today:
    Date;

  getCourseColour:
    (
      courseId:
        CourseId | null
    ) => string;

  theme:
    AppTheme;
};


function InsightCard({
  eyebrow,
  title,
  body,
  accent,
  href,
  onClick,
  theme,
}: {
  eyebrow:
    string;

  title:
    string;

  body:
    string;

  accent:
    string;

  href:
    string;

  onClick?:
    () => void;

  theme:
    AppTheme;
}) {
  return (
    <Link
      href={
        href
      }
      onClick={
        onClick
      }
      style={{
        minWidth:
          0,

        minHeight:
          104,

        padding:
          "11px 12px 11px 15px",

        boxSizing:
          "border-box",

        position:
          "relative",

        overflow:
          "hidden",

        display:
          "grid",

        alignContent:
          "space-between",

        gap:
          10,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${accent} 26%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            120deg,
            color-mix(
              in srgb,
              ${accent} 10%,
              ${theme.bgSection}
            ) 0%,
            ${theme.bgSurface} 78%
          )`,

        color:
          "inherit",

        textDecoration:
          "none",

        boxShadow:
          theme.shadow,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position:
            "absolute",

          left:
            0,

          top:
            0,

          bottom:
            0,

          width:
            3,

          background:
            accent,
        }}
      />


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            4,
        }}
      >
        <span
          style={{
            color:
              accent,

            fontSize:
              9,

            fontWeight:
              750,

            letterSpacing:
              "0.055em",

            textTransform:
              "uppercase",
          }}
        >
          {eyebrow}
        </span>


        <span
          style={{
            minWidth:
              0,

            overflow:
              "hidden",

            color:
              theme.textPrimary,

            fontSize:
              12,

            fontWeight:
              700,

            lineHeight:
              1.3,

            whiteSpace:
              "nowrap",

            textOverflow:
              "ellipsis",
          }}
        >
          {title}
        </span>


        <span
          style={{
            color:
              theme.textMuted,

            fontSize:
              10.5,

            lineHeight:
              1.35,
          }}
        >
          {body}
        </span>
      </div>


      <span
        style={{
          color:
            theme.textSecondary,

          fontSize:
            10,

          fontWeight:
            600,
        }}
      >
        View →
      </span>
    </Link>
  );
}


export default function HomeForYouSection({
  assessments,
  classes,
  hasLoaded,
  today,
  getCourseColour,
  theme,
}: Props) {
  const recentAssessment =
    getMostRecentlyEditedHomeAssessment(
      assessments
    );


  const upcomingAssessment =
    getUpcomingHomeAssessments(
      assessments,
      today
    )[0] ??
    null;


  const recentClass =
    [
      ...classes,
    ].sort(
      (
        first,
        second
      ) =>
        second.updatedAt -
        first.updatedAt
    )[0] ??
    null;


  if (
    !hasLoaded
  ) {
    return (
      <section
        style={{
          minHeight:
            152,

          padding:
            14,

          boxSizing:
            "border-box",

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
            11,
        }}
      >
        Loading your overview...
      </section>
    );
  }


  const recentProgress =
    recentAssessment
      ? getHomeAssessmentProgress(
          recentAssessment
        )
      : null;


  const upcomingDate =
    upcomingAssessment
      ? parseHomeAssessmentDate(
          upcomingAssessment.setup
            .assessmentDate
        )
      : null;


  const daysUntil =
    upcomingDate
      ? getDaysUntilHomeDate(
          upcomingDate,
          today
        )
      : null;


  const classCoverage =
    recentClass
      ? getHomeClassCoverage(
          recentClass
        )
      : null;


  return (
    <section
      style={{
        minWidth:
          0,

        padding:
          12,

        boxSizing:
          "border-box",

        display:
          "grid",

        gap:
          11,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          theme.borderStandard,

        borderRadius:
          6,

        background:
          `linear-gradient(
            135deg,
            color-mix(
              in srgb,
              ${theme.accentPrimary} 4%,
              ${theme.bgSurface}
            ) 0%,
            ${theme.bgSurface} 62%
          )`,
      }}
    >
      <HomeSectionHeader
        title="For you"
        subtitle="The things most likely to need your attention next."
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
            "repeat(3, minmax(0, 1fr))",

          gap:
            8,
        }}
      >
        {recentAssessment &&
        recentProgress ? (
          <InsightCard
            eyebrow="Now"
            title={
              getHomeAssessmentName(
                recentAssessment
              )
            }
            body={`${Math.round(
              recentProgress.progressPct
            )}% built · ${recentProgress.assignedMarks} / ${recentProgress.targetMarks} marks`}
            accent={
              getCourseColour(
                getHomeAssessmentCourseId(
                  recentAssessment
                )
              )
            }
            href="/create-assessment/builder"
            onClick={() =>
              setCurrentSavedAssessmentId(
                recentAssessment.id
              )
            }
            theme={
              theme
            }
          />
        ) : (
          <InsightCard
            eyebrow="Now"
            title="Create your first assessment"
            body="Start building from the Course specification."
            accent={
              theme.accentPrimary
            }
            href="/create-assessment"
            theme={
              theme
            }
          />
        )}


        {upcomingAssessment &&
        upcomingDate ? (
          <InsightCard
            eyebrow="Coming up"
            title={
              getHomeAssessmentName(
                upcomingAssessment
              )
            }
            body={`${formatHomeShortDate(
              upcomingDate
            )} · ${
              daysUntil ===
              0
                ? "Today"
                : daysUntil ===
                    1
                  ? "Tomorrow"
                  : `${daysUntil} days away`
            }`}
            accent={
              getCourseColour(
                getHomeAssessmentCourseId(
                  upcomingAssessment
                )
              )
            }
            href="/create-assessment/builder"
            onClick={() =>
              setCurrentSavedAssessmentId(
                upcomingAssessment.id
              )
            }
            theme={
              theme
            }
          />
        ) : (
          <InsightCard
            eyebrow="Coming up"
            title="No upcoming assessment dates"
            body="Add dates to assessments and they will appear here automatically."
            accent={
              theme.accentPrimary
            }
            href="/my-assessments"
            theme={
              theme
            }
          />
        )}


        {recentClass &&
        classCoverage ? (
          <InsightCard
            eyebrow="Class"
            title={
              recentClass.name
            }
            body={
              classCoverage.totalSkills >
              0
                ? `${classCoverage.completedSkills} / ${classCoverage.totalSkills} skills covered`
                : `${recentClass.completedSkillIds.length} skills covered`
            }
            accent={
              getCourseColour(
                recentClass.courseId
              )
            }
            href={`/my-classes/${recentClass.id}`}
            theme={
              theme
            }
          />
        ) : (
          <InsightCard
            eyebrow="Class"
            title="Set up your classes"
            body="Track Course coverage and connect assessments to what has been taught."
            accent={
              theme.accentPrimary
            }
            href="/my-classes"
            theme={
              theme
            }
          />
        )}
      </div>
    </section>
  );
}