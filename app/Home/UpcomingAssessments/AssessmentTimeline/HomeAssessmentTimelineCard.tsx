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
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  formatHomeShortDate,
  getHomeAssessmentName,
  parseHomeAssessmentDate,
} from "../../HomeDashboardData/HomeDashboardData";

import {
  getCalendarAssessmentPrimaryClassLabel,
  getCalendarAssessmentStatus,
  getCalendarAssessmentStatusLabel,
} from "../HomeAssessmentCalendarHelpers";


type Props = {
  assessment:
    SavedAssessment;

  classes:
    SchoolClass[];

  accent:
    string;

  theme:
    AppTheme;
};


function getStatusColour(
  assessment:
    SavedAssessment,

  theme:
    AppTheme
): string {
  switch (
    getCalendarAssessmentStatus(
      assessment
    )
  ) {
    case "COMPLETE":
    case "READY_FOR_PRINT":
      return theme.success;

    case "IN_PROGRESS":
      return theme.warning;

    case "NOT_STARTED":
    default:
      return theme.textMuted;
  }
}


export default function HomeAssessmentTimelineCard({
  assessment,
  classes,
  accent,
  theme,
}: Props) {
  const date =
    parseHomeAssessmentDate(
      assessment.setup
        .assessmentDate
    );


  const classLabel =
    getCalendarAssessmentPrimaryClassLabel(
      assessment,
      classes
    );


  const statusColour =
    getStatusColour(
      assessment,
      theme
    );


  return (
    <Link
      href="/create-assessment/builder"
      onClick={() =>
        setCurrentSavedAssessmentId(
          assessment.id
        )
      }
      style={{
        minWidth:
          0,

        minHeight:
          60,

        padding:
          "7px 8px 7px 10px",

        boxSizing:
          "border-box",

        position:
          "relative",

        overflow:
          "hidden",

        display:
          "grid",

        alignContent:
          "start",

        gap:
          3,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${accent} 18%,
            ${theme.borderStandard}
          )`,

        borderRadius:
          5,

        background:
          `linear-gradient(
            90deg,
            color-mix(
              in srgb,
              ${accent} 8%,
              ${theme.bgSection}
            ) 0%,
            ${theme.bgSection} 82%
          )`,

        color:
          "inherit",

        textDecoration:
          "none",
      }}
    >
      <span
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


      <span
        title={
          getHomeAssessmentName(
            assessment
          )
        }
        style={{
          minWidth:
            0,

          overflow:
            "hidden",

          display:
            "-webkit-box",

          WebkitBoxOrient:
            "vertical",

          WebkitLineClamp:
            2,

          color:
            theme.textPrimary,

          fontSize:
            9.5,

          fontWeight:
            700,

          lineHeight:
            1.2,
        }}
      >
        {getHomeAssessmentName(
          assessment
        )}
      </span>


      <span
        style={{
          color:
            theme.textMuted,

          fontSize:
            8.5,

          fontVariantNumeric:
            "tabular-nums",

          lineHeight:
            1.2,
        }}
      >
        {date
          ? formatHomeShortDate(
              date
            )
          : "No date"}
      </span>


      <span
        title={
          classLabel
        }
        style={{
          minWidth:
            0,

          overflow:
            "hidden",

          color:
            accent,

          fontSize:
            8.5,

          fontWeight:
            600,

          lineHeight:
            1.2,

          whiteSpace:
            "nowrap",

          textOverflow:
            "ellipsis",
        }}
      >
        {classLabel}
      </span>


      <span
        style={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            4,

          color:
            statusColour,

          fontSize:
            8,

          fontWeight:
            600,

          lineHeight:
            1.2,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width:
              4,

            height:
              4,

            flexShrink:
              0,

            borderRadius:
              999,

            background:
              "currentColor",
          }}
        />


        {getCalendarAssessmentStatusLabel(
          assessment
        )}
      </span>
    </Link>
  );
}