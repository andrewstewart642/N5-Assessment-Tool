"use client";

import katex from "katex";

import type { PaperPart } from "@/shared-types/paperParts";

type Props = {
  parts: PaperPart[];
};

export default function PaperContent({ parts }: Props) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "text") return <span key={i}>{p.value}</span>;

        const html = katex.renderToString(p.latex, {
          throwOnError: false,
          displayMode: Boolean(p.displayMode),
        });

        return (
          <span
            key={i}
            style={{
              display: p.displayMode ? "block" : "inline",
              margin: p.displayMode ? "8px 0" : undefined,
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </>
  );
}