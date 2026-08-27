import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

import type {
  AppTheme,
} from "@/app/UI/Application/Theme/AppTheme";

import {
  UI_TEXT,
} from "@/app/UI/Application/Typography/Typography";

import type {
  AssessmentPaperStringMap,
} from "@/app/Assessments/Creation/Papers/AssessmentPaperValueMaps";

import PaperSittingDateEditor from "./PaperSittingDateEditor";

import PaperSittingTimeEditor from "./PaperSittingTimeEditor";

import PreviewTraySegmentedControl from "./PreviewTraySegmentedControl";


type PaperSittingEditorMode =
  | "date"
  | "time";


export type PaperSittingOption = {
  id:
    Paper;

  label:
    string;
};


type PaperSittingControlsProps = {
  paperOptions:
    PaperSittingOption[];

  coverDateByPaper:
    AssessmentPaperStringMap;

  startTimeByPaper:
    AssessmentPaperStringMap;

  endTimeByPaper:
    AssessmentPaperStringMap;

  onCoverDateChange: (
    paper:
      Paper,

    next:
      string
  ) => void;

  onStartTimeChange: (
    paper:
      Paper,

    next:
      string
  ) => void;

  onEndTimeChange: (
    paper:
      Paper,

    next:
      string
  ) => void;

  theme:
    AppTheme;
};


export default function PaperSittingControls({
  paperOptions,

  coverDateByPaper,
  startTimeByPaper,
  endTimeByPaper,

  onCoverDateChange,
  onStartTimeChange,
  onEndTimeChange,

  theme,
}: PaperSittingControlsProps) {
  const [
    activePaper,
    setActivePaper,
  ] =
    useState<Paper>(
      paperOptions[
        0
      ]?.id ??
        "P1"
    );

  const [
    editorMode,
    setEditorMode,
  ] =
    useState<PaperSittingEditorMode>(
      "date"
    );

  const sectionRef =
    useRef<HTMLDivElement | null>(
      null
    );


  useEffect(() => {
    if (
      paperOptions.some(
        (
          option
        ) =>
          option.id ===
          activePaper
      )
    ) {
      return;
    }

    const first =
      paperOptions[
        0
      ];

    if (
      first
    ) {
      setActivePaper(
        first.id
      );
    }
  }, [
    activePaper,
    paperOptions,
  ]);


  const activeDate =
    coverDateByPaper[
      activePaper
    ] ??
    "";

  const activeStartTime =
    startTimeByPaper[
      activePaper
    ] ??
    "";

  const activeEndTime =
    endTimeByPaper[
      activePaper
    ] ??
    "";


  function moveToTimeEditor() {
    setEditorMode(
      "time"
    );

    requestAnimationFrame(
      () => {
        sectionRef.current
          ?.scrollIntoView({
            behavior:
              "smooth",

            block:
              "start",
          });
      }
    );
  }


  return (
    <div
      ref={
        sectionRef
      }
      style={{
        width:
          "100%",

        minWidth:
          0,

        display:
          "grid",

        gap:
          9,

        scrollMarginTop:
          8,
      }}
    >
      <div
        style={{
          ...UI_TEXT.sectionLabel,

          color:
            theme.textMuted,
        }}
      >
        Paper sitting
      </div>

      <PreviewTraySegmentedControl
        value={
          activePaper
        }
        options={
          paperOptions.map(
            (
              option
            ) => ({
              value:
                option.id,

              label:
                option.label,
            })
          )
        }
        onChange={(
          next
        ) =>
          setActivePaper(
            next as Paper
          )
        }
        ariaLabel="Paper sitting paper"
        theme={
          theme
        }
      />

      <PreviewTraySegmentedControl
        value={
          editorMode
        }
        options={[
          {
            value:
              "date",

            label:
              "Date",
          },

          {
            value:
              "time",

            label:
              "Time",
          },
        ]}
        onChange={(
          next
        ) =>
          setEditorMode(
            next as PaperSittingEditorMode
          )
        }
        ariaLabel="Paper sitting editor"
        theme={
          theme
        }
      />

      <div
        key={`${activePaper}-${editorMode}`}
        style={{
          minWidth:
            0,

          animation:
            "paper-sitting-editor-in 130ms ease-out",
        }}
      >
        {editorMode ===
        "date" ? (
          <PaperSittingDateEditor
            value={
              activeDate
            }
            onChange={(
              next
            ) =>
              onCoverDateChange(
                activePaper,
                next
              )
            }
            onComplete={
              moveToTimeEditor
            }
            theme={
              theme
            }
          />
        ) : (
          <PaperSittingTimeEditor
            startTime={
              activeStartTime
            }
            endTime={
              activeEndTime
            }
            onStartTimeChange={(
              next
            ) =>
              onStartTimeChange(
                activePaper,
                next
              )
            }
            onEndTimeChange={(
              next
            ) =>
              onEndTimeChange(
                activePaper,
                next
              )
            }
            theme={
              theme
            }
          />
        )}
      </div>

      <style jsx>{`
        @keyframes paper-sitting-editor-in {
          from {
            opacity: 0.6;
            transform: translateY(2px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}