import type {
  ReactNode,
} from "react";

import A4PageFrame from "../../Components/A4PageFrame";

import {
  A4_PAGE_HEIGHT_PX,
  A4_PAGE_WIDTH_PX,
  DOCUMENT_PX_PER_MM,
  mmToPx,
} from "../../Layout/DocumentUnits";

type NationalQualificationsQuestionPageFrameProps = {
  children?: ReactNode;

  pageNumber:
    number;

  questionHeader?:
    ReactNode;

  showTurnOver?:
    boolean;

  contentLeftMm?:
    number;

  contentRightMm?:
    number;

  contentTopMm?:
    number;

  contentBottomMm?:
    number;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};

export default function NationalQualificationsQuestionPageFrame({
  children,
  pageNumber,
  questionHeader,
  showTurnOver = true,
  contentLeftMm,
  contentRightMm,
  contentTopMm,
  contentBottomMm,
  viewerScale = 1,
  outerPaddingPx = 18,
}: NationalQualificationsQuestionPageFrameProps) {
  const inset =
    mmToPx(9);

  const cornerStroke =
    3;

  const cornerLength =
    mmToPx(8);

  const lineGapFromCorners =
    mmToPx(2);

  const lineTop =
    inset +
    cornerLength +
    lineGapFromCorners;

  const lineBottom =
    A4_PAGE_HEIGHT_PX -
    (
      inset +
      cornerLength +
      lineGapFromCorners
    );

  const lineHeight =
    Math.max(
      0,
      lineBottom -
        lineTop
    );

  const rightOuterLineX =
    A4_PAGE_WIDTH_PX -
    inset;

  const rightStripWidth =
    mmToPx(12);

  const rightInnerLineX =
    rightOuterLineX -
    rightStripWidth;

  const defaultContentLeftMm =
    22;

  const defaultContentRightMm =
    210 -
    (
      rightInnerLineX /
        DOCUMENT_PX_PER_MM -
      10
    );

  const defaultContentTopMm =
    questionHeader
      ? 49
      : 26;

  const defaultContentBottomMm =
    28;

  const contentLeft =
    mmToPx(
      contentLeftMm ??
        defaultContentLeftMm
    );

  const contentRight =
    A4_PAGE_WIDTH_PX -
    mmToPx(
      contentRightMm ??
        defaultContentRightMm
    );

  const contentTop =
    mmToPx(
      contentTopMm ??
        defaultContentTopMm
    );

  const contentBottom =
    A4_PAGE_HEIGHT_PX -
    mmToPx(
      contentBottomMm ??
        defaultContentBottomMm
    );

  const headerY =
    mmToPx(20);

  const labelTop =
    lineTop +
    mmToPx(2);

  const stripBoxX =
    rightInnerLineX +
    1;

  const stripBoxWidth =
    rightStripWidth -
    2;

  const marginFontPx =
    6.3;

  const marginLineGapPx =
    7.2;

  const paddedPageNumber =
    String(
      pageNumber
    ).padStart(
      2,
      "0"
    );

  return (
    <A4PageFrame
      viewerScale={
        viewerScale
      }
      outerPaddingPx={
        outerPaddingPx
      }
    >
      <div
        style={{
          position:
            "absolute",

          inset:
            0,

          fontFamily:
            `"Helvetica Neue", Helvetica, Arial, sans-serif`,

          color:
            "#111",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              inset,

            top:
              inset,

            width:
              cornerLength,

            height:
              cornerLength,

            borderLeft:
              `${cornerStroke}px solid #111`,

            borderTop:
              `${cornerStroke}px solid #111`,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              A4_PAGE_WIDTH_PX -
              inset -
              cornerLength,

            top:
              inset,

            width:
              cornerLength,

            height:
              cornerLength,

            borderRight:
              `${cornerStroke}px solid #111`,

            borderTop:
              `${cornerStroke}px solid #111`,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              inset,

            top:
              A4_PAGE_HEIGHT_PX -
              inset -
              cornerLength,

            width:
              cornerLength,

            height:
              cornerLength,

            borderLeft:
              `${cornerStroke}px solid #111`,

            borderBottom:
              `${cornerStroke}px solid #111`,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              A4_PAGE_WIDTH_PX -
              inset -
              cornerLength,

            top:
              A4_PAGE_HEIGHT_PX -
              inset -
              cornerLength,

            width:
              cornerLength,

            height:
              cornerLength,

            borderRight:
              `${cornerStroke}px solid #111`,

            borderBottom:
              `${cornerStroke}px solid #111`,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position:
              "absolute",

            left:
              rightInnerLineX,

            top:
              lineTop,

            width:
              1,

            height:
              lineHeight,

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
              rightOuterLineX,

            top:
              lineTop,

            width:
              1,

            height:
              lineHeight,

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
              labelTop,

            left:
              rightInnerLineX -
              mmToPx(18),

            width:
              mmToPx(16),

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
            stripBoxWidth
          }
          height={
            mmToPx(22)
          }
          style={{
            position:
              "absolute",

            left:
              stripBoxX,

            top:
              labelTop -
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
            transform={`translate(${stripBoxWidth / 2}, ${marginFontPx * 0.2})`}
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
                    marginLineGapPx *
                    index
                  }
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  fontFamily={`"Helvetica Neue", Helvetica, Arial, sans-serif`}
                  fontSize={
                    marginFontPx
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

        {questionHeader ? (
          <div
            style={{
              position:
                "absolute",

              top:
                headerY,

              left:
                contentLeft,

              width:
                contentRight -
                contentLeft,

              textAlign:
                "center",

              fontSize:
                12.5,

              fontWeight:
                700,
            }}
          >
            {questionHeader}
          </div>
        ) : null}

        <div
          style={{
            position:
              "absolute",

            left:
              contentLeft,

            top:
              contentTop,

            width:
              contentRight -
              contentLeft,

            height:
              contentBottom -
              contentTop,
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
                mmToPx(28),

              bottom:
                mmToPx(18),

              fontSize:
                11,

              fontWeight:
                700,
            }}
          >
            Turn over
          </div>
        ) : null}

        <div
          style={{
            position:
              "absolute",

            left:
              0,

            bottom:
              mmToPx(10),

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
          page{" "}
          {paddedPageNumber}
        </div>
      </div>
    </A4PageFrame>
  );
}