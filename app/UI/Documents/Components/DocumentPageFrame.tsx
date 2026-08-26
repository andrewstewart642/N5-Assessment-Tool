
import React from "react";

import type {
  Paper,
} from "@/app/Assessments/AssessmentTypes";

export type DocumentFooterLabelMode =
  | "sqa-lower"
  | "page-cap"
  | "none";

export type DocumentPageFrameProps = {
  children?: React.ReactNode;

  titleArea?: React.ReactNode;

  paper?: Paper;

  pageIndex?: number;

  isFirstQuestionPage?: boolean;

  showTurnOver?: boolean;

  footerPageNumber?: number;

  footerLabelMode?: DocumentFooterLabelMode;

  showRightMarginStrip?: boolean;

  contentLeftMm?: number;

  contentRightMm?: number;

  contentTopMm?: number;

  contentBottomMm?: number;

  viewerScale?: number;

  outerPaddingPx?: number;
};

const PX_PER_MM =
  96 / 25.4;

function mm(
  value: number
): number {
  return Math.round(
    value * PX_PER_MM
  );
}

function makeFooterLabel(
  pageNumber: number,
  mode: DocumentFooterLabelMode
): string {
  const padded =
    String(
      pageNumber
    ).padStart(
      2,
      "0"
    );

  if (
    mode ===
    "page-cap"
  ) {
    return `Page ${padded}`;
  }

  if (
    mode ===
    "sqa-lower"
  ) {
    return `page ${padded}`;
  }

  return "";
}

export default function DocumentPageFrame({
  children,

  titleArea,

  paper = "P1",

  pageIndex = 0,

  isFirstQuestionPage = false,

  showTurnOver = true,

  footerPageNumber,

  footerLabelMode =
    "sqa-lower",

  showRightMarginStrip = true,

  contentLeftMm,

  contentRightMm,

  contentTopMm,

  contentBottomMm,

  viewerScale = 1,

  outerPaddingPx = 18,
}: DocumentPageFrameProps) {
  const PAGE_WIDTH =
    mm(210);

  const PAGE_HEIGHT =
    mm(297);

  const INSET =
    mm(9);

  const CORNER_STROKE =
    3;

  const CORNER_LENGTH =
    mm(8);

  const LINE_GAP_FROM_CORNERS =
    mm(2);

  const LINE_TOP =
    INSET +
    CORNER_LENGTH +
    LINE_GAP_FROM_CORNERS;

  const LINE_BOTTOM =
    PAGE_HEIGHT -
    (
      INSET +
      CORNER_LENGTH +
      LINE_GAP_FROM_CORNERS
    );

  const LINE_HEIGHT =
    Math.max(
      0,
      LINE_BOTTOM -
        LINE_TOP
    );

  const RIGHT_OUTER_LINE_X =
    PAGE_WIDTH -
    INSET;

  const RIGHT_STRIP_WIDTH =
    mm(12);

  const RIGHT_INNER_LINE_X =
    RIGHT_OUTER_LINE_X -
    RIGHT_STRIP_WIDTH;

  const defaultContentLeftMm =
    22;

  const defaultContentRightMm =
    showRightMarginStrip
      ? 210 -
        (
          RIGHT_INNER_LINE_X /
            PX_PER_MM -
          10
        )
      : 22;

  const defaultContentTopMm =
    isFirstQuestionPage
      ? 49
      : 26;

  const defaultContentBottomMm =
    28;

  const CONTENT_LEFT =
    mm(
      contentLeftMm ??
        defaultContentLeftMm
    );

  const CONTENT_RIGHT =
    PAGE_WIDTH -
    mm(
      contentRightMm ??
        defaultContentRightMm
    );

  const CONTENT_TOP =
    mm(
      contentTopMm ??
        defaultContentTopMm
    );

  const CONTENT_BOTTOM =
    PAGE_HEIGHT -
    mm(
      contentBottomMm ??
        defaultContentBottomMm
    );

  const HEADER_Y =
    mm(20);

  const derivedQuestionPageNumber =
    pageIndex + 3;

  const resolvedFooterPageNumber =
    footerPageNumber ??
    derivedQuestionPageNumber;

  const footerLabel =
    makeFooterLabel(
      resolvedFooterPageNumber,
      footerLabelMode
    );

  const totalMarks =
    paper === "P1"
      ? 40
      : 50;

  const LABEL_TOP =
    LINE_TOP +
    mm(2);

  const STRIP_BOX_X =
    RIGHT_INNER_LINE_X +
    1;

  const STRIP_BOX_WIDTH =
    RIGHT_STRIP_WIDTH -
    2;

  const SQA_MARGIN_FONT_PX =
    6.3;

  const SQA_MARGIN_LINE_GAP_PX =
    7.2;

  const scale =
    Number.isFinite(
      viewerScale
    ) &&
    viewerScale > 0
      ? viewerScale
      : 1;

  const scaledWidth =
    Math.round(
      PAGE_WIDTH *
        scale
    );

  const scaledHeight =
    Math.round(
      PAGE_HEIGHT *
        scale
    );

  return (
    <div
      style={{
        display:
          "flex",

        justifyContent:
          "center",

        padding:
          outerPaddingPx,
      }}
    >
      <div
        style={{
          width:
            scaledWidth,

          height:
            scaledHeight,

          position:
            "relative",
        }}
      >
        <div
          style={{
            width:
              PAGE_WIDTH,

            height:
              PAGE_HEIGHT,

            background:
              "#ffffff",

            position:
              "absolute",

            left:
              0,

            top:
              0,

            transform:
              `scale(${scale})`,

            transformOrigin:
              "top left",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.18)",

            fontFamily:
              `"Helvetica Neue", Helvetica, Arial, sans-serif`,

            color:
              "#111",

            overflow:
              "hidden",
          }}
        >
          {titleArea ? (
            <div
              style={{
                position:
                  "absolute",

                left:
                  0,

                top:
                  0,

                width:
                  "100%",

                zIndex:
                  2,
              }}
            >
              {titleArea}
            </div>
          ) : null}

          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",

              left:
                INSET,

              top:
                INSET,

              width:
                CORNER_LENGTH,

              height:
                CORNER_LENGTH,

              borderLeft:
                `${CORNER_STROKE}px solid #111`,

              borderTop:
                `${CORNER_STROKE}px solid #111`,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",

              left:
                PAGE_WIDTH -
                INSET -
                CORNER_LENGTH,

              top:
                INSET,

              width:
                CORNER_LENGTH,

              height:
                CORNER_LENGTH,

              borderRight:
                `${CORNER_STROKE}px solid #111`,

              borderTop:
                `${CORNER_STROKE}px solid #111`,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",

              left:
                INSET,

              top:
                PAGE_HEIGHT -
                INSET -
                CORNER_LENGTH,

              width:
                CORNER_LENGTH,

              height:
                CORNER_LENGTH,

              borderLeft:
                `${CORNER_STROKE}px solid #111`,

              borderBottom:
                `${CORNER_STROKE}px solid #111`,
            }}
          />

          <div
            aria-hidden="true"
            style={{
              position:
                "absolute",

              left:
                PAGE_WIDTH -
                INSET -
                CORNER_LENGTH,

              top:
                PAGE_HEIGHT -
                INSET -
                CORNER_LENGTH,

              width:
                CORNER_LENGTH,

              height:
                CORNER_LENGTH,

              borderRight:
                `${CORNER_STROKE}px solid #111`,

              borderBottom:
                `${CORNER_STROKE}px solid #111`,
            }}
          />

          {showRightMarginStrip ? (
            <>
              <div
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  left:
                    RIGHT_INNER_LINE_X,

                  top:
                    LINE_TOP,

                  width:
                    1,

                  height:
                    LINE_HEIGHT,

                  background:
                    "rgba(0,0,0,0.35)",
                }}
              />

              <div
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  left:
                    RIGHT_OUTER_LINE_X,

                  top:
                    LINE_TOP,

                  width:
                    1,

                  height:
                    LINE_HEIGHT,

                  background:
                    "rgba(0,0,0,0.35)",
                }}
              />

              <div
                aria-hidden="true"
                style={{
                  position:
                    "absolute",

                  top:
                    LABEL_TOP,

                  left:
                    RIGHT_INNER_LINE_X -
                    mm(18),

                  width:
                    mm(16),

                  textAlign:
                    "right",

                  fontSize:
                    9,

                  fontWeight:
                    700,

                  letterSpacing:
                    0.3,
                }}
              >
                MARKS
              </div>

              <svg
                aria-hidden="true"
                width={
                  STRIP_BOX_WIDTH
                }
                height={
                  mm(22)
                }
                style={{
                  position:
                    "absolute",

                  left:
                    STRIP_BOX_X,

                  top:
                    LABEL_TOP -
                    1,

                  overflow:
                    "hidden",

                  pointerEvents:
                    "none",

                  userSelect:
                    "none",
                }}
                shapeRendering="geometricPrecision"
                textRendering="geometricPrecision"
              >
                <g
                  transform={`translate(${STRIP_BOX_WIDTH / 2}, ${SQA_MARGIN_FONT_PX * 0.2})`}
                >
                  {[
                    "DO NOT",
                    "WRITE IN",
                    "THIS",
                    "MARGIN",
                  ].map(
                    (
                      line,
                      index
                    ) => (
                      <text
                        key={
                          line
                        }
                        x={
                          0
                        }
                        y={
                          SQA_MARGIN_LINE_GAP_PX *
                          index
                        }
                        textAnchor="middle"
                        dominantBaseline="hanging"
                        fontFamily={`"Helvetica Neue", Helvetica, Arial, sans-serif`}
                        fontSize={
                          SQA_MARGIN_FONT_PX
                        }
                        fontWeight={
                          700
                        }
                        letterSpacing={
                          0.2
                        }
                        fill="#111"
                      >
                        {line}
                      </text>
                    )
                  )}
                </g>
              </svg>
            </>
          ) : null}

          {isFirstQuestionPage ? (
            <div
              style={{
                position:
                  "absolute",

                top:
                  HEADER_Y,

                left:
                  CONTENT_LEFT,

                width:
                  CONTENT_RIGHT -
                  CONTENT_LEFT,

                textAlign:
                  "center",

                fontSize:
                  12.5,

                fontWeight:
                  700,
              }}
            >
              <div
                style={{
                  marginBottom:
                    4,
                }}
              >
                Total marks —{" "}
                {totalMarks}
              </div>

              <div
                style={{
                  fontWeight:
                    700,
                }}
              >
                Attempt ALL
                questions
              </div>
            </div>
          ) : null}

          <div
            style={{
              position:
                "absolute",

              left:
                CONTENT_LEFT,

              top:
                CONTENT_TOP,

              width:
                CONTENT_RIGHT -
                CONTENT_LEFT,

              height:
                CONTENT_BOTTOM -
                CONTENT_TOP,
            }}
          >
            {children}
          </div>

          {showTurnOver ? (
            <div
              style={{
                position:
                  "absolute",

                right:
                  mm(28),

                bottom:
                  mm(18),

                fontSize:
                  11,

                fontWeight:
                  700,
              }}
            >
              Turn over
            </div>
          ) : null}

          {footerLabelMode !==
          "none" ? (
            <div
              style={{
                position:
                  "absolute",

                left:
                  0,

                bottom:
                  mm(10),

                width:
                  "100%",

                textAlign:
                  "center",

                fontSize:
                  11,

                fontStyle:
                  "italic",

                color:
                  "rgba(0,0,0,0.75)",

                fontWeight:
                  600,
              }}
            >
              {footerLabel}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}