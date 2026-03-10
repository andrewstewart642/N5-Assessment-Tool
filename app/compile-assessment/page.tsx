"use client";

import { useEffect, useMemo, useState } from "react";
import type { Paper, Question } from "@/shared-types/AssessmentTypes";
import SQAPageFrame from "@/app/create-assessment/builder/components/assessment-paper-layout/SQAPageFrame";
import PaperQuestionLocked from "@/app/create-assessment/builder/components/assessment-preview/PaperQuestionLocked";

import { PAGE_SIZES, type PageSize } from "@/app/paper-layout/Page-Sizes";
import { paginateQuestions } from "@/app/paper-layout/Reflow-Pages";

const STORAGE_KEY = "n5_assessment_builder_v1";

function MiniToggle(props: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      style={{
        padding: "6px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.14)",
        background: props.active ? "rgba(147,197,253,0.18)" : "rgba(0,0,0,0.18)",
        color: props.active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.72)",
        fontWeight: 900,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {props.label}
    </button>
  );
}

export default function CompileAssessmentPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paper, setPaper] = useState<Paper>("P1");
  const [pageSize, setPageSize] = useState<PageSize>("A4");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { questions?: Question[] };
      if (Array.isArray(parsed.questions)) setQuestions(parsed.questions);
    } catch {
      // ignore
    }
  }, []);

  const paperQuestions = useMemo(
    () => questions.filter((q) => q.paper === paper),
    [questions, paper]
  );

  const sizeCfg = PAGE_SIZES[pageSize];

  const pages = useMemo(() => {
    return paginateQuestions(paperQuestions, sizeCfg);
  }, [paperQuestions, sizeCfg]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f14",
        color: "rgba(255,255,255,0.9)",
        padding: 16,
        display: "grid",
        gap: 14,
      }}
    >
      {/* top controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontWeight: 1000, fontSize: 14 }}>Compile Preview</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Choose page size here — layout reflows automatically.
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 900 }}>Paper</div>
            <MiniToggle label="P1" active={paper === "P1"} onClick={() => setPaper("P1")} />
            <MiniToggle label="P2" active={paper === "P2"} onClick={() => setPaper("P2")} />
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.75, fontWeight: 900 }}>Size</div>
            <MiniToggle label="A4" active={pageSize === "A4"} onClick={() => setPageSize("A4")} />
            <MiniToggle label="A3" active={pageSize === "A3"} onClick={() => setPageSize("A3")} />
            <MiniToggle label="A5" active={pageSize === "A5"} onClick={() => setPageSize("A5")} />
          </div>
        </div>
      </div>

      {/* pages stack */}
      <div style={{ display: "grid", gap: 18 }}>
        {pages.length === 0 ? (
          <div
            style={{
              padding: 14,
              border: "1px dashed rgba(255,255,255,0.18)",
              borderRadius: 14,
              opacity: 0.8,
            }}
          >
            No assigned questions found for {paper}.
          </div>
        ) : (
          pages.map((pageQuestions, pageIndex) => (
            <SQAPageFrame
              key={`${paper}-${pageSize}-${pageIndex}`}
              titleArea={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "0 16px",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  <div>
                    [{paper === "P1" ? "Paper 1" : "Paper 2"}] – Prelim Assessment • Page {pageIndex + 1}
                  </div>
                  <div>Size: {pageSize}</div>
                </div>
              }
            >
              <div style={{ display: "grid", gap: 2 }}>
                {pageQuestions.map((q, i) => {
                  // question number is global within the paper across pages
                  const globalIndex =
                    pages
                      .slice(0, pageIndex)
                      .reduce((acc, p) => acc + p.length, 0) +
                    i +
                    1;

                  return <PaperQuestionLocked key={q.id} index={globalIndex} question={q} />;
                })}
              </div>
            </SQAPageFrame>
          ))
        )}
      </div>
    </main>
  );
}