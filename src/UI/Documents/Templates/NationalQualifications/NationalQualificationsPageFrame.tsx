import type {
  ReactNode,
} from "react";

import A4PageFrame from "../../Components/A4PageFrame";

import {
  A4_PAGE_HEIGHT_PX,
  A4_PAGE_WIDTH_PX,
  mmToPx,
} from "../../Layout/DocumentUnits";

type NationalQualificationsPageFrameProps = {
  children?: ReactNode;

  contentLeftMm: number;
  contentRightMm: number;
  contentTopMm: number;
  contentBottomMm: number;

  footer?: ReactNode;

  viewerScale?: number;
  outerPaddingPx?: number;
};

export default function NationalQualificationsPageFrame({
  children,
  contentLeftMm,
  contentRightMm,
  contentTopMm,
  contentBottomMm,
  footer,
  viewerScale = 1,
  outerPaddingPx = 18,
}: NationalQualificationsPageFrameProps) {
  const inset =
    mmToPx(9);

  const cornerStroke =
    3;

  const cornerLength =
    mmToPx(8);

  const contentLeft =
    mmToPx(
      contentLeftMm
    );

  const contentRight =
    A4_PAGE_WIDTH_PX -
    mmToPx(
      contentRightMm
    );

  const contentTop =
    mmToPx(
      contentTopMm
    );

  const contentBottom =
    A4_PAGE_HEIGHT_PX -
    mmToPx(
      contentBottomMm
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

          color:
            "#111",

          fontFamily:
            `"Helvetica Neue", Helvetica, Arial, sans-serif`,
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

        {footer ? (
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
            {footer}
          </div>
        ) : null}
      </div>
    </A4PageFrame>
  );
}