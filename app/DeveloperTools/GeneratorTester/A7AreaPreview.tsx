"use client";

import type { PaperPart } from "@/app/Assessments/Questions/Content/PaperParts";
import PaperContent from "@/app/UI/Documents/Components/PaperContent";
import type { A7AreaVisualSpec } from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";

type A7AreaPreviewProps = {
  visual: A7AreaVisualSpec;
};

const mathParts = (latex: string): PaperPart[] => [
  { kind: "math", latex, displayMode: false },
];

function MathLabel({
  latex,
  left,
  top,
  centred = true,
}: {
  latex: string;
  left: string;
  top: string;
  centred?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        transform: centred ? "translate(-50%, -50%)" : "translateY(-50%)",
        whiteSpace: "nowrap",
        fontSize: "17px",
        lineHeight: 1,
        color: "currentColor",
        pointerEvents: "none",
      }}
    >
      <PaperContent parts={mathParts(latex)} />
    </div>
  );
}

export default function A7AreaPreview({ visual }: A7AreaPreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 650,
        aspectRatio: "760 / 350",
        margin: "6px auto 12px",
        color: "#111111",
      }}
    >
      <svg
        viewBox="0 0 760 350"
        role="img"
        aria-label="Triangle and rectangle with generated dimensions"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <marker id="a7-dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fill="none" stroke="currentColor" strokeWidth="1.65">
          {/* Symmetric, deliberately narrow source-like triangle. */}
          <path d="M150 286 L252 286 L201 34 Z" />
          <rect x="470" y="145" width="145" height="141" />

          <line
            x1="314"
            y1="38"
            x2="314"
            y2="282"
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
          <line
            x1="654"
            y1="148"
            x2="654"
            y2="282"
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
        </g>
      </svg>

      <MathLabel latex={visual.triangle.baseLatex} left="26.5%" top="90%" />
      <MathLabel latex={visual.triangle.heightLatex} left="43.5%" top="46%" centred={false} />
      <MathLabel latex={visual.rectangle.widthLatex} left="71.4%" top="90%" />
      <MathLabel latex={visual.rectangle.heightLatex} left="88.2%" top="61%" centred={false} />
    </div>
  );
}
