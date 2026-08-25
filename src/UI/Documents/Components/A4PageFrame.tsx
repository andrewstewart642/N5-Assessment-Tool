import type {
  ReactNode,
} from "react";

import {
  A4_PAGE_HEIGHT_PX,
  A4_PAGE_WIDTH_PX,
} from "../Layout/DocumentUnits";

type A4PageFrameProps = {
  children?: ReactNode;

  viewerScale?: number;

  outerPaddingPx?: number;
};

export default function A4PageFrame({
  children,
  viewerScale = 1,
  outerPaddingPx = 18,
}: A4PageFrameProps) {
  const scale =
    Number.isFinite(
      viewerScale
    ) &&
    viewerScale > 0
      ? viewerScale
      : 1;

  const scaledWidth =
    Math.round(
      A4_PAGE_WIDTH_PX *
        scale
    );

  const scaledHeight =
    Math.round(
      A4_PAGE_HEIGHT_PX *
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
              A4_PAGE_WIDTH_PX,

            height:
              A4_PAGE_HEIGHT_PX,

            position:
              "absolute",

            left:
              0,

            top:
              0,

            background:
              "#ffffff",

            transform:
              `scale(${scale})`,

            transformOrigin:
              "top left",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.18)",

            overflow:
              "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}