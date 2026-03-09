"use client";

import type { ReactNode } from "react";

type Props = {
  text: string;
};

/**
 * Minimal "exam paper" math text renderer.
 * Supports:
 *  - √80
 *  - /80   (your generator sometimes uses / as a sqrt shorthand)
 *
 * This is NOT a full LaTeX engine (by design). It just fixes the common sqrt look.
 */
export default function PaperMathText({ text }: Props) {
  return <span>{renderTextWithSqrts(text)}</span>;
}

function renderTextWithSqrts(text: string): ReactNode[] {
  // Match either "√ 80" or "/ 80" (numbers only for now)
  const re = /(√|\/)\s*([0-9]+(?:\.[0-9]+)?)/g;

  const out: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    const start = match.index;
    const end = re.lastIndex;

    if (start > lastIndex) {
      out.push(text.slice(lastIndex, start));
    }

    const radicand = match[2];

    out.push(<Sqrt key={`sqrt-${key++}`} radicand={radicand} />);

    lastIndex = end;
  }

  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex));
  }

  return out;
}

function Sqrt({ radicand }: { radicand: string }) {
  // Simple radical: √ plus an overbar above the radicand
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end" }}>
      <span
        aria-hidden="true"
        style={{
          fontSize: "1.1em",
          lineHeight: 1,
          transform: "translateY(0.06em)",
          marginRight: 2,
        }}
      >
        √
      </span>

      <span
        style={{
          display: "inline-block",
          borderTop: "1px solid currentColor",
          paddingLeft: 3,
          paddingRight: 1,
          lineHeight: 1.15,
        }}
      >
        {radicand}
      </span>
    </span>
  );
}