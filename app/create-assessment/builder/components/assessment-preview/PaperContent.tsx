"use client";

import katex from "katex";
import { Fragment } from "react";

import type { PaperPart } from "@/shared-types/PaperParts";

type Props = {
  parts: PaperPart[];
};

function TextPart({ value }: { value: string }) {
  const lines = value.split("\n");

  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export default function PaperContent({ parts }: Props) {
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === "text") {
          return (
            <span key={i}>
              <TextPart value={p.value} />
            </span>
          );
        }

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