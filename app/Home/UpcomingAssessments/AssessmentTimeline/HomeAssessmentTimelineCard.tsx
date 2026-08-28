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

        padding:
          "6px 7px 6px 9px",

        position:
          "relative",

        overflow:
          "hidden",

        display:
          "grid",

        gap:
          2,

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          `color-mix(
            in srgb,
            ${accent} 16%,
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
        style={{
          minWidth:
            0,

          overflow:
            "hidden",

          color:
            theme.textPrimary,

          fontSize:
            9.5,

          fontWeight:
            650,

          whiteSpace:
            "nowrap",

          textOverflow:
            "ellipsis",
        }}
      >
        {getHomeAssessmentName(
          assessment
        )}
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
            8.5,

          whiteSpace:
            "nowrap",

          textOverflow:
            "ellipsis",
        }}
      >
        {date
          ? formatHomeShortDate(
              date
            )
          : "No date"}
        {" · "}
        {getCalendarAssessmentPrimaryClassLabel(
          assessment,
          classes
        )}
      </span>


      <span
        style={{
          color:
            theme.textSecondary,

          fontSize:
            8,

          fontWeight:
            600,
        }}
      >
        {getCalendarAssessmentStatusLabel(
          assessment
        )}
      </span>
    </Link>
  );
}