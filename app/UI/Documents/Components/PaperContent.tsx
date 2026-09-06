import katex from "katex";

import {
  Fragment,
} from "react";

import type {
  PaperPart,
} from "@/app/Assessments/Questions/Content/PaperParts";

import AreaEqualityDiagram from "./AreaEqualityDiagram";
import StraightLineModelGraph from "./StraightLineModelGraph";
import StraightLineSystemGraph from "./StraightLineSystemGraph";

type PaperContentProps = {
  parts: PaperPart[];
};

function TextPart({
  value,
}: {
  value: string;
}) {
  const lines =
    value.split("\n");

  return (
    <>
      {lines.map(
        (
          line,
          index
        ) => (
          <Fragment
            key={`${line}-${index}`}
          >
            {index > 0 ? (
              <br />
            ) : null}

            {line}
          </Fragment>
        )
      )}
    </>
  );
}

export default function PaperContent({
  parts,
}: PaperContentProps) {
  return (
    <>
      {parts.map(
        (
          part,
          index
        ) => {
          if (
            part.kind ===
            "text"
          ) {
            return (
              <span
                key={
                  index
                }
              >
                <TextPart
                  value={
                    part.value
                  }
                />
              </span>
            );
          }

          if (
            part.kind ===
            "straightLineSystemGraph"
          ) {
            return (
              <StraightLineSystemGraph
                key={index}
                graph={part}
              />
            );
          }

          if (
            part.kind ===
            "straightLineModelGraph"
          ) {
            return (
              <StraightLineModelGraph
                key={index}
                graph={part}
              />
            );
          }

          if (
            part.kind ===
            "areaEqualityDiagram"
          ) {
            return (
              <AreaEqualityDiagram
                key={index}
                diagram={part}
              />
            );
          }

          const html =
            katex.renderToString(
              part.latex,
              {
                throwOnError:
                  false,

                displayMode:
                  Boolean(
                    part.displayMode
                  ),
              }
            );

          return (
            <span
              key={
                index
              }
              style={{
                display:
                  part.displayMode
                    ? "block"
                    : "inline",

                margin:
                  part.displayMode
                    ? "8px 0"
                    : undefined,
              }}
              dangerouslySetInnerHTML={{
                __html:
                  html,
              }}
            />
          );
        }
      )}
    </>
  );
}
