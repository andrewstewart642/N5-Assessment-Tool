"use client";

import { Fira_Sans } from "next/font/google";
import SQAPageFrame from "@/page-sections/SQAPageFrame";
import type { Paper } from "@/shared-types/AssessmentTypes";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export type SQAN5CoverPageProps = {
  pageNumber: number;
  paper: Paper;
  totalMarks: number;
  showDateTime: boolean;
  dateText: string;
  timeText: string;
  showScottishCandidateNumberBox: boolean;
  viewerScale?: number;
  outerPaddingPx?: number;
};

const pxPerMm = 96 / 25.4;

function mm(n: number) {
  return Math.round(n * pxPerMm);
}

const LINE = "rgba(0,0,0,0.68)";

function CandidateBoxes(props: {
  count: number;
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const { count, x, y, w, h } = props;
  const boxW = w / count;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: `1.4px solid ${LINE}`,
        boxSizing: "border-box",
      }}
    >
      {Array.from({ length: count - 1 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -1,
            left: Math.round(boxW * (i + 1)),
            width: 1.4,
            height: h,
            background: LINE,
          }}
        />
      ))}
    </div>
  );
}

function LineBox(props: { x: number; y: number; w: number; h: number }) {
  const { x, y, w, h } = props;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: `1.4px solid ${LINE}`,
        boxSizing: "border-box",
      }}
    />
  );
}

function Divider(props: { y: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: mm(1),
        right: mm(1),
        top: props.y,
        height: 1.4,
        background: LINE,
      }}
    />
  );
}

function NoCalculatorIcon() {
  return (
    <svg width="82" height="82" viewBox="0 0 82 82" aria-hidden="true">
      <circle cx="41" cy="41" r="33.5" fill="none" stroke="#231f20" strokeWidth="4.5" />
      <rect x="28.5" y="17.5" width="25" height="40" rx="2.5" fill="none" stroke="#231f20" strokeWidth="2.2" />
      <rect x="31.8" y="21.2" width="18.4" height="8.2" fill="none" stroke="#231f20" strokeWidth="1.2" />
      {[
        [33.5, 34.5],
        [39.5, 34.5],
        [45.5, 34.5],
        [33.5, 40.5],
        [39.5, 40.5],
        [45.5, 40.5],
        [33.5, 46.5],
        [39.5, 46.5],
        [45.5, 46.5],
        [33.5, 52.5],
        [39.5, 52.5],
        [45.5, 52.5],
      ].map(([x, y], idx) => (
        <circle key={idx} cx={x} cy={y} r="1.6" fill="#231f20" />
      ))}
      <line x1="19" y1="19" x2="63" y2="63" stroke="#231f20" strokeWidth="5.4" strokeLinecap="round" />
    </svg>
  );
}

export default function SQAN5CoverPage(props: SQAN5CoverPageProps) {
  const {
    paper,
    totalMarks,
    showDateTime,
    dateText,
    timeText,
    showScottishCandidateNumberBox,
    viewerScale = 1,
    outerPaddingPx = 18,
  } = props;

  const isP1 = paper === "P1";
  const showDateLine = showDateTime && dateText.trim().length > 0;
  const showTimeLine = showDateTime && timeText.trim().length > 0;
  const showDateTimeBlock = showDateLine || showTimeLine;

  const paperTitle = isP1 ? "Paper 1 (Non-calculator)" : "Paper 2 (Calculator)";
  const calculatorRule = isP1 ? "You must NOT use a calculator." : "You may use a calculator.";

  const topBandTop = mm(52);
  const lowerBandTop = mm(94.2);
  const bandMidY = Math.round((topBandTop + lowerBandTop) / 2);

  return (
    <SQAPageFrame
      paper={paper}
      viewerScale={viewerScale}
      outerPaddingPx={outerPaddingPx}
      showTurnOver={false}
      showRightMarginStrip={false}
      footerLabelMode="none"
      contentLeftMm={18}
      contentRightMm={18}
      contentTopMm={12}
      contentBottomMm={18}
    >
      <div
        className={firaSans.className}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          color: "#111",
        }}
      >
        <CandidateBoxes count={6} x={mm(56)} y={mm(6.3)} w={mm(118)} h={mm(11)} />

        <div
          style={{
            position: "absolute",
            left: mm(1),
            top: mm(7.4),
            width: mm(47),
            height: mm(38.8),
            background: "#b2b4b6",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              color: "#f5f5f5",
              fontSize: 95,
              fontWeight: 700,
              lineHeight: 0.82,
              letterSpacing: -5.2,
              textAlign: "center",
              transform: "translateY(-1px)",
            }}
          >
            N5
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: mm(57.5),
            top: mm(19.3),
            color: "#8e9195",
            fontSize: 21.4,
            fontWeight: 400,
            lineHeight: 1.01,
          }}
        >
          <div>National</div>
          <div>Qualifications</div>
        </div>

        <div
          style={{
            position: "absolute",
            right: mm(4.8),
            top: mm(24.2),
            display: "flex",
            alignItems: "center",
            gap: mm(2.6),
          }}
        >
          <div style={{ fontSize: 17.2, fontWeight: 400 }}>Mark</div>
          <div
            style={{
              width: mm(17),
              height: mm(21),
              border: `1.4px solid ${LINE}`,
              boxSizing: "border-box",
            }}
          />
        </div>

        <Divider y={topBandTop} />

        <div
          style={{
            position: "absolute",
            right: mm(3.6),
            top: mm(54.4),
            width: mm(82),
            textAlign: "right",
            lineHeight: 0.92,
          }}
        >
          <div
            style={{
              fontSize: 24.8,
              fontWeight: 700,
              letterSpacing: -0.01,
              whiteSpace: "nowrap",
            }}
          >
            Mathematics
          </div>
          <div
            style={{
              fontSize: 24.8,
              fontWeight: 700,
              letterSpacing: -0.01,
              whiteSpace: "nowrap",
            }}
          >
            {paperTitle}
          </div>
        </div>

        {showDateTimeBlock ? (
          <div
            style={{
              position: "absolute",
              left: mm(1),
              top: bandMidY - 18,
              color: "#222",
              lineHeight: 1.08,
            }}
          >
            {showDateLine ? (
              <div
                style={{
                  fontSize: 16.2,
                  fontWeight: 400,
                  textTransform: "uppercase",
                  marginBottom: showTimeLine ? 5 : 0,
                }}
              >
                {dateText}
              </div>
            ) : null}

            {showTimeLine ? (
              <div
                style={{
                  fontSize: 16.2,
                  fontWeight: 400,
                }}
              >
                {timeText}
              </div>
            ) : null}
          </div>
        ) : null}

        {isP1 ? (
          <div
            style={{
              position: "absolute",
              left: mm(70.6),
              top: bandMidY - 41,
              width: 82,
              height: 82,
              display: "grid",
              placeItems: "center",
            }}
          >
            <NoCalculatorIcon />
          </div>
        ) : null}

        <Divider y={lowerBandTop} />

        <div
          style={{
            position: "absolute",
            left: mm(1),
            top: mm(100.7),
            fontSize: 15.8,
            fontWeight: 700,
            letterSpacing: -0.005,
          }}
        >
          Fill in these boxes and read what is printed below.
        </div>

        <div style={{ position: "absolute", left: mm(1), top: mm(113.8), fontSize: 14.1, fontWeight: 400 }}>
          Full name of centre
        </div>
        <div style={{ position: "absolute", left: mm(108), top: mm(113.8), fontSize: 14.1, fontWeight: 400 }}>
          Town
        </div>
        <LineBox x={mm(1)} y={mm(119.2)} w={mm(98)} h={mm(13.2)} />
        <LineBox x={mm(108)} y={mm(119.2)} w={mm(67)} h={mm(13.2)} />

        <div style={{ position: "absolute", left: mm(1), top: mm(138.2), fontSize: 14.1, fontWeight: 400 }}>
          Forename(s)
        </div>
        <div style={{ position: "absolute", left: mm(81), top: mm(138.2), fontSize: 14.1, fontWeight: 400 }}>
          Surname
        </div>
        <div
          style={{
            position: "absolute",
            left: mm(146.5),
            top: mm(138.2),
            fontSize: 13.6,
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          Number of seat
        </div>
        <LineBox x={mm(1)} y={mm(143.5)} w={mm(67)} h={mm(13.2)} />
        <LineBox x={mm(81)} y={mm(143.5)} w={mm(57)} h={mm(13.2)} />
        <LineBox x={mm(146.5)} y={mm(143.5)} w={mm(28.5)} h={mm(13.2)} />

        <div style={{ position: "absolute", left: mm(10), top: mm(164.1), fontSize: 14.1, fontWeight: 400 }}>
          Date of birth
        </div>
        <div style={{ position: "absolute", left: mm(17), top: mm(170), fontSize: 12.2, fontWeight: 400 }}>
          Day
        </div>
        <div style={{ position: "absolute", left: mm(38), top: mm(170), fontSize: 12.2, fontWeight: 400 }}>
          Month
        </div>
        <div style={{ position: "absolute", left: mm(64), top: mm(170), fontSize: 12.2, fontWeight: 400 }}>
          Year
        </div>
        <CandidateBoxes count={2} x={mm(10)} y={mm(174.5)} w={mm(20)} h={mm(11.2)} />
        <CandidateBoxes count={2} x={mm(34)} y={mm(174.5)} w={mm(20)} h={mm(11.2)} />
        <CandidateBoxes count={2} x={mm(58)} y={mm(174.5)} w={mm(20)} h={mm(11.2)} />

        {showScottishCandidateNumberBox ? (
          <>
            <div
              style={{
                position: "absolute",
                left: mm(88),
                top: mm(170),
                fontSize: 14.1,
                fontWeight: 400,
              }}
            >
              Scottish candidate number
            </div>
            <CandidateBoxes count={9} x={mm(88)} y={mm(174.5)} w={mm(76)} h={mm(11.2)} />
          </>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: mm(1),
            top: mm(192.9),
            fontSize: 16.2,
            fontWeight: 700,
            letterSpacing: -0.01,
          }}
        >
          Total marks — {totalMarks}
        </div>

        <div
          style={{
            position: "absolute",
            left: mm(1),
            top: mm(200.8),
            width: mm(162),
            fontSize: 11.1,
            lineHeight: 1.12,
            fontWeight: 400,
            letterSpacing: -0.005,
          }}
        >
          <div style={{ marginBottom: 3 }}>Attempt ALL questions.</div>
          <div style={{ marginBottom: 3, fontWeight: 700 }}>{calculatorRule}</div>
          <div style={{ marginBottom: 3 }}>To earn full marks you must show your working in your answers.</div>
          <div style={{ marginBottom: 3 }}>State the units for your answer where appropriate.</div>
          <div style={{ marginBottom: 3 }}>
            Write your answers clearly in the spaces provided in this booklet. Additional space for answers is
            provided at the end of this booklet. If you use this space you must clearly identify the question
            number you are attempting.
          </div>
          <div style={{ marginBottom: 3 }}>Use blue or black ink.</div>
          <div>
            Before leaving the examination room you must give this booklet to the Invigilator; if you do not,
            you may lose all the marks for this paper.
          </div>
        </div>
      </div>
    </SQAPageFrame>
  );
}