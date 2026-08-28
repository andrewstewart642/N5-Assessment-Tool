import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  Concept,
  DifficultyLevel,
  Skill,
} from "@/app/Assessments/AssessmentTypes";

import type {
  GeneratedQuestionData,
} from "@/app/Assessments/Questions/Generation/QuestionGenerationTypes";

import {
  QUESTION_COLUMN_GAP_PX,
  QUESTION_MARKS_COLUMN_PX,
  QUESTION_NUMBER_COLUMN_PX,
} from "@/app/Assessments/Questions/Preview/QuestionPreviewLayout";

import {
  getCourseQuestionExampleProvider,
} from "@/app/Courses/QuestionExamples/CourseQuestionExampleRegistry";

import type {
  CourseQuestionExampleProvider,
} from "@/app/Courses/QuestionExamples/CourseQuestionExampleTypes";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import PaperContent from "@/app/UI/Documents/Components/PaperContent";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";


type DisplayMode =
  | "FULL_RANGE"
  | "REPRESENTATIVE";


type Props = {
  courseId:
    CourseId;

  skill:
    Skill;

  concept:
    Concept;

  theme:
    AppTheme;

  courseAccent:
    string;

  displayMode?:
    DisplayMode;

  heading?:
    string;

  questionNumberOffset?:
    number;
};


function getQuestionMarks(
  generated:
    GeneratedQuestionData
): number {
  if (
    typeof generated.marks ===
      "number"
  ) {
    return generated.marks;
  }


  if (
    typeof generated
      .markBreakdown
      ?.totalMarks ===
      "number"
  ) {
    return generated
      .markBreakdown
      .totalMarks;
  }


  if (
    typeof generated
      .selectionMeta
      ?.marks
      .totalMarks ===
      "number"
  ) {
    return generated
      .selectionMeta
      .marks
      .totalMarks;
  }


  return 0;
}


function selectRepresentativeDifficulty(
  difficulties:
    DifficultyLevel[]
): DifficultyLevel | null {
  if (
    difficulties.length ===
    0
  ) {
    return null;
  }


  const index =
    Math.floor(
      difficulties.length /
      2
    );


  return difficulties[
    index
  ];
}


function QuestionPaperPreview({
  generated,
  questionNumber,
  theme,
}: {
  generated:
    GeneratedQuestionData;

  questionNumber:
    number;

  theme:
    AppTheme;
}) {
  const marks =
    getQuestionMarks(
      generated
    );


  return (
    <div
      style={{
        minWidth:
          0,

        padding:
          "15px 17px",

        boxSizing:
          "border-box",

        borderWidth:
          1,

        borderStyle:
          "solid",

        borderColor:
          "rgba(0,0,0,0.16)",

        borderRadius:
          4,

        background:
          theme.paper,

        color:
          "#111111",

        boxShadow:
          "0 2px 8px rgba(0,0,0,0.18)",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gridTemplateColumns:
            `${QUESTION_NUMBER_COLUMN_PX}px minmax(0, 1fr) ${QUESTION_MARKS_COLUMN_PX}px`,

          columnGap:
            QUESTION_COLUMN_GAP_PX,

          alignItems:
            "start",
        }}
      >
        <div
          style={{
            fontSize:
              14,

            fontWeight:
              600,

            lineHeight:
              1.25,
          }}
        >
          {questionNumber}.
        </div>


        <div
          style={{
            minWidth:
              0,

            fontSize:
              14,

            fontWeight:
              500,

            lineHeight:
              1.4,
          }}
        >
          {generated.promptParts &&
          generated.promptParts.length >
            0 ? (
            <PaperContent
              parts={
                generated.promptParts
              }
            />
          ) : (
            <span>
              {generated.prompt ??
                "Question preview unavailable."}
            </span>
          )}
        </div>


        <div
          style={{
            textAlign:
              "right",

            fontSize:
              12,

            fontWeight:
              600,

            lineHeight:
              1.2,
          }}
        >
          {marks >
          0
            ? `(${marks})`
            : null}
        </div>
      </div>
    </div>
  );
}


function RefreshIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path
        d="M13.2 5.8A5.5 5.5 0 1 0 13 10M13.2 2.8v3.4H9.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function QuestionExampleCard({
  provider,
  skill,
  concept,
  difficulty,
  label,
  questionNumber,
  theme,
  courseAccent,
}: {
  provider:
    CourseQuestionExampleProvider;

  skill:
    Skill;

  concept:
    Concept;

  difficulty:
    DifficultyLevel;

  label:
    string;

  questionNumber:
    number;

  theme:
    AppTheme;

  courseAccent:
    string;
}) {
  const [
    generated,
    setGenerated,
  ] =
    useState<
      GeneratedQuestionData | null
    >(
      null
    );


  const [
    failed,
    setFailed,
  ] =
    useState(
      false
    );


  function generateQuestion() {
    try {
      setFailed(
        false
      );


      setGenerated(
        provider.generate({
          skill,
          concept,
          difficulty,
        })
      );
    } catch {
      setGenerated(
        null
      );

      setFailed(
        true
      );
    }
  }


  useEffect(() => {
    generateQuestion();
  }, [
    provider,
    skill,
    concept,
    difficulty,
  ]);


  return (
    <section
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          6,
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

          justifyContent:
            "space-between",

          gap:
            10,
        }}
      >
        <span
          style={{
            color:
              theme.textSecondary,

            fontSize:
              10,

            fontWeight:
              650,
          }}
        >
          {label}
        </span>


        <button
          type="button"
          title={`Generate another ${label.toLowerCase()}`}
          aria-label={`Generate another ${label.toLowerCase()}`}
          onClick={
            generateQuestion
          }
          style={{
            width:
              26,

            height:
              26,

            padding:
              0,

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
              5,

            background:
              theme.controlBg,

            color:
              theme.textMuted,

            cursor:
              "pointer",
          }}
        >
          <RefreshIcon />
        </button>
      </div>


      {generated ? (
        <QuestionPaperPreview
          generated={
            generated
          }
          questionNumber={
            questionNumber
          }
          theme={
            theme
          }
        />
      ) : (
        <div
          style={{
            minHeight:
              72,

            padding:
              12,

            boxSizing:
              "border-box",

            display:
              "grid",

            placeItems:
              "center",

            borderWidth:
              1,

            borderStyle:
              "solid",

            borderColor:
              failed
                ? theme.danger
                : `color-mix(
                    in srgb,
                    ${courseAccent} 24%,
                    ${theme.borderStandard}
                  )`,

            borderRadius:
              5,

            background:
              theme.bgSection,

            color:
              failed
                ? theme.danger
                : theme.textMuted,

            fontSize:
              10,

            textAlign:
              "center",
          }}
        >
          {failed
            ? "Question generation failed."
            : "Generating question preview..."}
        </div>
      )}
    </section>
  );
}


export default function ClassCoverageQuestionExamples({
  courseId,
  skill,
  concept,
  theme,
  courseAccent,
  displayMode =
    "FULL_RANGE",
  heading =
    "Representative questions",
  questionNumberOffset =
    0,
}: Props) {
  const provider =
    getCourseQuestionExampleProvider(
      courseId
    );


  const availableDifficulties =
    useMemo(
      () =>
        provider
          ? provider.getAvailableDifficulties({
              skill,
              concept,
            })
          : [],
      [
        provider,
        skill,
        concept,
      ]
    );


  const difficultiesToShow =
    useMemo(
      () => {
        if (
          displayMode ===
          "FULL_RANGE"
        ) {
          return availableDifficulties;
        }


        const representative =
          selectRepresentativeDifficulty(
            availableDifficulties
          );


        return representative
          ? [
              representative,
            ]
          : [];
      },
      [
        availableDifficulties,
        displayMode,
      ]
    );


  if (
    !provider ||
    difficultiesToShow.length ===
      0
  ) {
    return (
      <div
        style={{
          padding:
            "9px 10px",

          borderWidth:
            1,

          borderStyle:
            "solid",

          borderColor:
            theme.borderStandard,

          borderRadius:
            5,

          background:
            theme.bgSection,

          color:
            theme.textMuted,

          fontSize:
            10,

          lineHeight:
            1.4,
        }}
      >
        Generated question examples are not yet available for this subskill.
      </div>
    );
  }


  return (
    <div
      style={{
        minWidth:
          0,

        display:
          "grid",

        gap:
          8,
      }}
    >
      {heading ? (
        <div
          style={{
            color:
              theme.textSecondary,

            fontSize:
              11,

            fontWeight:
              650,
          }}
        >
          {heading}
        </div>
      ) : null}


      <div
        style={{
          minWidth:
            0,

          display:
            "grid",

          gap:
            10,
        }}
      >
        {difficultiesToShow.map(
          (
            difficulty,
            index
          ) => (
            <QuestionExampleCard
              key={
                difficulty
              }
              provider={
                provider
              }
              skill={
                skill
              }
              concept={
                concept
              }
              difficulty={
                difficulty
              }
              label={
                displayMode ===
                "FULL_RANGE"
                  ? `Example ${index + 1}`
                  : "Example"
              }
              questionNumber={
                questionNumberOffset +
                index +
                1
              }
              theme={
                theme
              }
              courseAccent={
                courseAccent
              }
            />
          )
        )}
      </div>
    </div>
  );
}