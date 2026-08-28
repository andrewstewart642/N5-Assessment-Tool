import Link from "next/link";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  setCurrentSavedAssessmentId,
} from "@/app/Assessments/SavedAssessments/SavedAssessmentsStorage";

import type {
  SchoolClass,
} from "@/app/Classes/ClassData";

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


function ForYouRow({
  label,
  title,
  body,
  accent,
  href,
  onClick,
  theme,
}: {
  label:
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
          45,

        padding:
          "6px 8px",

        boxSizing:
          "border-box",

        display:
          "grid",

        gridTemplateColumns:
          "100px minmax(0, 1fr) 14px",

        alignItems:
          "center",

        gap:
          8,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${accent} 15%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          5,

        background:
          `linear-gradient(
            90deg,
            color-mix(
              in srgb,
              ${accent} 7%,
              ${theme.bgSection}
            ) 0%,
            ${theme.bgSection} 54%,
            color-mix(
              in srgb,
              ${theme.bgSection} 72%,
              ${theme.bgElevated}
            ) 100%
          )`,

        color:
          "inherit",

        textDecoration:
          "none",
      }}
    >
      <div
        style={{
          minWidth:
            0,

          display:
            "flex",

          alignItems:
            "center",

          gap:
            6,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width:
              6,

            height:
              6,

            flexShrink:
              0,

            borderRadius:
              999,

            background:
              accent,

            boxShadow:
              `0 0 6px ${accent}`,
          }}
        />


        <span
          style={{
            color:
              accent,

            fontSize:
              8.5,

            fontWeight:
              750,

            letterSpacing:
              "0.04em",

            textTransform:
              "uppercase",

            whiteSpace:
              "nowrap",
          }}
        >
          {label}
        </span>
      </div>


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            1,
        }}
      >
        <span
          title={
            title
          }
          style={{
            minWidth:
              0,

            overflow:
              "hidden",

            color:
              theme.textPrimary,

            fontSize:
              11,

            fontWeight:
              650,

            lineHeight:
              1.2,

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
            minWidth:
              0,

            overflow:
              "hidden",

            color:
              theme.textMuted,

            fontSize:
              9.5,

            lineHeight:
              1.2,

            whiteSpace:
              "nowrap",

            textOverflow:
              "ellipsis",
          }}
        >
          {body}
        </span>
      </div>


      <span
        aria-hidden="true"
        style={{
          justifySelf:
            "end",

          color:
            theme.textMuted,

          fontSize:
            11,

          lineHeight:
            1,
        }}
      >
        →
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
            196,

          padding:
            12,

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
            theme.bgElevated,

          boxShadow:
            theme.shadowStrong,

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


  const recentProgressText =
    recentProgress
      ? recentProgress.progressPct <=
        0
        ? `Not started · ${recentProgress.assignedMarks} / ${recentProgress.targetMarks} marks`
        : recentProgress.progressPct >=
            100
          ? `Complete · ${recentProgress.assignedMarks} / ${recentProgress.targetMarks} marks`
          : `${Math.round(
              recentProgress.progressPct
            )}% built · ${recentProgress.assignedMarks} / ${recentProgress.targetMarks} marks`
      : "";


  return (
    <section
      style={{
        minWidth:
          0,

        minHeight:
          196,

        padding:
          11,

        boxSizing:
          "border-box",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          9,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${theme.textMuted} 12%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          6,

        background:
          `linear-gradient(
            180deg,
            ${theme.bgElevated} 0%,
            color-mix(
              in srgb,
              ${theme.bgElevated} 74%,
              ${theme.bgSurface}
            ) 100%
          )`,

        boxShadow:
          `${theme.shadowStrong}, inset 0 1px 0 rgba(255,255,255,0.025)`,
      }}
    >
      <HomeSectionHeader
        title="For you"
        subtitle="What needs your attention next."
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

          gap:
            5,
        }}
      >
        {recentAssessment &&
        recentProgress ? (
          <ForYouRow
            label="Now"
            title={
              getHomeAssessmentName(
                recentAssessment
              )
            }
            body={
              recentProgressText
            }
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
          <ForYouRow
            label="Now"
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
          <ForYouRow
            label="Coming up"
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
          <ForYouRow
            label="Coming up"
            title="No upcoming assessment dates"
            body="Add assessment dates to start planning ahead."
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
          <ForYouRow
            label="Class"
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
          <ForYouRow
            label="Class"
            title="Set up your classes"
            body="Track Course coverage and assessment readiness."
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