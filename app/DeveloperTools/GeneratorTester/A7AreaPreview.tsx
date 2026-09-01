"use client";

import type { A7AreaVisualSpec } from "../../Courses/National5Maths/03_QuestionGeneration/02-Algebraic/ALG-A7-LinearEquations";

type A7AreaPreviewProps = {
  visual: A7AreaVisualSpec;
};

export default function A7AreaPreview({ visual }: A7AreaPreviewProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 650,
        margin: "10px auto 14px",
      }}
    >
      <svg
        viewBox="0 0 760 310"
        role="img"
        aria-label="Triangle and rectangle with generated dimensions"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      >
        <defs>
          <marker id="a7-dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        <g fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M120 235 L270 235 L215 42 Z" />
          <rect x="485" y="105" width="145" height="130" />

          <line
            x1="330"
            y1="48"
            x2="330"
            y2="232"
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
          <line
            x1="670"
            y1="108"
            x2="670"
            y2="232"
            markerStart="url(#a7-dimension-arrow)"
            markerEnd="url(#a7-dimension-arrow)"
          />
        </g>

        <g fill="currentColor" fontFamily="Arial, Helvetica, sans-serif" fontSize="18">
          <text x="195" y="268" textAnchor="middle">{visual.triangle.baseLabel}</text>
          <text x="348" y="147" textAnchor="start">{visual.triangle.heightLabel}</text>

          <text x="557" y="268" textAnchor="middle">{visual.rectangle.widthLabel}</text>
          <text x="690" y="176" textAnchor="start">{visual.rectangle.heightLabel}</text>
        </g>
      </svg>
    </div>
  );
}
