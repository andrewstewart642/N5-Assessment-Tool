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
        maxWidth: 620,
        margin: "12px auto 16px",
      }}
    >
      <svg
        viewBox="0 0 720 250"
        role="img"
        aria-label="Triangle and rectangle with generated dimensions"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <g fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M70 190 L260 190 L165 55 Z" />
          <rect x="445" y="72" width="195" height="118" />
        </g>

        <g fill="currentColor" fontFamily="Trebuchet MS, Arial, sans-serif" fontSize="18">
          <text x="165" y="221" textAnchor="middle">{visual.triangle.baseLabel}</text>
          <text x="78" y="118" textAnchor="start">{visual.triangle.heightLabel}</text>

          <text x="542" y="221" textAnchor="middle">{visual.rectangle.widthLabel}</text>
          <text x="655" y="136" textAnchor="start">{visual.rectangle.heightLabel}</text>

          <text x="352" y="139" textAnchor="middle" fontSize="30">=</text>
        </g>
      </svg>
    </div>
  );
}
