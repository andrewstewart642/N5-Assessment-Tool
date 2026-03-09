"use client";

import katex from "katex";
import "katex/dist/katex.min.css";

import SQAPageFrame from "@/page-sections/SQAPageFrame";

export type SQAN5FormulaSheetProps = {
  pageNumber: number;
  viewerScale?: number;
  outerPaddingPx?: number;
};

function Formula(props: { tex: string; size?: number }) {
  const { tex, size = 1.03 } = props;

  return (
    <div
      style={{
        fontSize: `${size}rem`,
        lineHeight: 1,
      }}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        }),
      }}
    />
  );
}

function InlineMath(props: { tex: string; size?: number }) {
  const { tex, size = 1 } = props;

  return (
    <span
      style={{
        fontSize: `${size}rem`,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
      }}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(tex, {
          throwOnError: false,
          displayMode: false,
          output: "html",
        }),
      }}
    />
  );
}

function Row(props: {
  label: string;
  children?: React.ReactNode;
  marginTop?: number;
  minHeight?: number;
}) {
  const { label, children, marginTop = 0, minHeight = 58 } = props;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "136px 1fr",
        columnGap: 18,
        alignItems: "center",
        minHeight,
        marginTop,
      }}
    >
      <div
        style={{
          fontSize: 12.4,
          fontWeight: 400,
          color: "#111",
          letterSpacing: 0,
          lineHeight: 1.08,
        }}
      >
        {label}
      </div>

      <div>{children}</div>
    </div>
  );
}

export default function SQAN5FormulaSheet(props: SQAN5FormulaSheetProps) {
  const { pageNumber, viewerScale = 1, outerPaddingPx = 18 } = props;

  return (
    <SQAPageFrame
      paper="P1"
      viewerScale={viewerScale}
      outerPaddingPx={outerPaddingPx}
      showTurnOver={false}
      showRightMarginStrip={false}
      footerPageNumber={pageNumber}
      footerLabelMode="page-cap"
      contentLeftMm={20}
      contentRightMm={22}
      contentTopMm={24}
      contentBottomMm={24}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          color: "#111",
        }}
      >
        <div
          style={{
            fontSize: 13.4,
            fontWeight: 700,
            letterSpacing: 0.04,
            marginBottom: 18,
          }}
        >
          FORMULAE LIST
        </div>

        <Row label="The roots of" minHeight={64}>
          <div style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
            <Formula tex={"ax^2 + bx + c = 0"} size={1.07} />
            <div style={{ fontSize: 12.9, fontWeight: 400, color: "#111" }}>are</div>
            <Formula tex={"x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"} size={1.07} />
          </div>
        </Row>

        <Row label="Sine rule" marginTop={16} minHeight={46}>
          <Formula tex={"\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C}"} size={1.08} />
        </Row>

        <Row label="Cosine rule" marginTop={18} minHeight={58}>
          <div style={{ display: "flex", alignItems: "center", gap: 36, flexWrap: "wrap" }}>
            <Formula tex={"a^2 = b^2 + c^2 - 2bc\\cos A"} size={1.05} />
            <div style={{ fontSize: 12.9, fontWeight: 400, color: "#111" }}>or</div>
            <Formula tex={"\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc}"} size={1.05} />
          </div>
        </Row>

        <Row label="Area of a triangle" marginTop={24} minHeight={46}>
          <Formula tex={"A = \\dfrac{1}{2}ab\\sin C"} size={1.08} />
        </Row>

        <Row label="Volume of a sphere" marginTop={28} minHeight={46}>
          <Formula tex={"V = \\dfrac{4}{3}\\pi r^3"} size={1.08} />
        </Row>

        <Row label="Volume of a cone" marginTop={28} minHeight={46}>
          <Formula tex={"V = \\dfrac{1}{3}\\pi r^2 h"} size={1.08} />
        </Row>

        <Row label="Volume of a pyramid" marginTop={28} minHeight={46}>
          <Formula tex={"V = \\dfrac{1}{3}Ah"} size={1.08} />
        </Row>

        <div style={{ marginTop: 34 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "136px 1fr",
              columnGap: 18,
              alignItems: "start",
            }}
          >
            <div
              style={{
                fontSize: 12.4,
                fontWeight: 400,
                color: "#111",
                lineHeight: 1.08,
                paddingTop: 8,
              }}
            >
              Standard deviation
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ paddingTop: 1 }}>
                <Formula tex={"s = \\sqrt{\\dfrac{\\sum (x-\\bar{x})^2}{n-1}}"} size={1.05} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div style={{ fontSize: 12.9, fontWeight: 400, color: "#111" }}>or</div>

                <Formula tex={"s = \\sqrt{\\dfrac{\\sum x^2 - \\dfrac{(\\sum x)^2}{n}}{n-1}}"} size={1.04} />

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                    flexWrap: "nowrap",
                    color: "#111",
                    fontSize: 12.9,
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>, where</span>
                  <InlineMath tex={"n"} size={0.98} />
                  <span>is the sample size.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SQAPageFrame>
  );
}