"use client";

import {
  Fira_Sans,
} from "next/font/google";

import NationalQualificationsPageFrame from "./NationalQualificationsPageFrame";

import {
  mmToPx,
} from "../../Layout/DocumentUnits";

const firaSans =
  Fira_Sans({
    subsets: [
      "latin",
    ],

    weight: [
      "400",
      "600",
      "700",
    ],
  });

export type NationalQualificationsCoverPageProps = {
  totalMarks:
    number;

  showDateTime:
    boolean;

  dateText:
    string;

  timeText:
    string;

  subjectName:
    string;

  qualificationBadge:
    string;

  qualificationLabelLines:
    string[];

  paperTitle:
    string;

  coverInstructionText:
    string;

  showNoCalculatorIcon:
    boolean;

  showScottishCandidateNumberBox:
    boolean;

  viewerScale?:
    number;

  outerPaddingPx?:
    number;
};

const LINE =
  "rgba(0,0,0,0.68)";

function CandidateBoxes({
  count,
  x,
  y,
  w,
  h,
}: {
  count:
    number;

  x:
    number;

  y:
    number;

  w:
    number;

  h:
    number;
}) {
  const boxWidth =
    w / count;

  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        left:
          x,

        top:
          y,

        width:
          w,

        height:
          h,

        border:
          `1.4px solid ${LINE}`,

        boxSizing:
          "border-box",
      }}
    >
      {Array.from({
        length:
          count - 1,
      }).map(
        (
          _,
          index
        ) => (
          <div
            key={
              index
            }
            style={{
              position:
                "absolute",

              top:
                -1,

              left:
                Math.round(
                  boxWidth *
                    (
                      index +
                      1
                    )
                ),

              width:
                1.4,

              height:
                h,

              background:
                LINE,
            }}
          />
        )
      )}
    </div>
  );
}

function LineBox({
  x,
  y,
  w,
  h,
}: {
  x:
    number;

  y:
    number;

  w:
    number;

  h:
    number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        left:
          x,

        top:
          y,

        width:
          w,

        height:
          h,

        border:
          `1.4px solid ${LINE}`,

        boxSizing:
          "border-box",
      }}
    />
  );
}

function Divider({
  y,
}: {
  y:
    number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position:
          "absolute",

        left:
          mmToPx(1),

        right:
          mmToPx(1),

        top:
          y,

        height:
          1.4,

        background:
          LINE,
      }}
    />
  );
}

function NoCalculatorIcon() {
  return (
    <svg
      width="82"
      height="82"
      viewBox="0 0 82 82"
      aria-hidden="true"
    >
      <circle
        cx="41"
        cy="41"
        r="33.5"
        fill="none"
        stroke="#231f20"
        strokeWidth="4.5"
      />

      <rect
        x="28.5"
        y="17.5"
        width="25"
        height="40"
        rx="2.5"
        fill="none"
        stroke="#231f20"
        strokeWidth="2.2"
      />

      <rect
        x="31.8"
        y="21.2"
        width="18.4"
        height="8.2"
        fill="none"
        stroke="#231f20"
        strokeWidth="1.2"
      />

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
      ].map(
        (
          [
            x,
            y,
          ],
          index
        ) => (
          <circle
            key={
              index
            }
            cx={
              x
            }
            cy={
              y
            }
            r="1.6"
            fill="#231f20"
          />
        )
      )}

      <line
        x1="19"
        y1="19"
        x2="63"
        y2="63"
        stroke="#231f20"
        strokeWidth="5.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function NationalQualificationsCoverPage({
  totalMarks,
  showDateTime,
  dateText,
  timeText,
  subjectName,
  qualificationBadge,
  qualificationLabelLines,
  paperTitle,
  coverInstructionText,
  showNoCalculatorIcon,
  showScottishCandidateNumberBox,
  viewerScale = 1,
  outerPaddingPx = 18,
}: NationalQualificationsCoverPageProps) {
  const showDateLine =
    showDateTime &&
    dateText.trim().length >
      0;

  const showTimeLine =
    showDateTime &&
    timeText.trim().length >
      0;

  const showDateTimeBlock =
    showDateLine ||
    showTimeLine;

  const topBandTop =
    mmToPx(52);

  const lowerBandTop =
    mmToPx(94.2);

  const bandMidY =
    Math.round(
      (
        topBandTop +
        lowerBandTop
      ) /
        2
    );

  return (
    <NationalQualificationsPageFrame
      contentLeftMm={
        18
      }
      contentRightMm={
        18
      }
      contentTopMm={
        12
      }
      contentBottomMm={
        18
      }
      viewerScale={
        viewerScale
      }
      outerPaddingPx={
        outerPaddingPx
      }
    >
      <div
        className={
          firaSans.className
        }
        style={{
          position:
            "relative",

          width:
            "100%",

          height:
            "100%",

          color:
            "#111",
        }}
      >
        <CandidateBoxes
          count={
            6
          }
          x={
            mmToPx(56)
          }
          y={
            mmToPx(6.3)
          }
          w={
            mmToPx(118)
          }
          h={
            mmToPx(11)
          }
        />

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(7.4),

            width:
              mmToPx(47),

            height:
              mmToPx(38.8),

            background:
              "#b2b4b6",

            display:
              "grid",

            placeItems:
              "center",

            overflow:
              "hidden",
          }}
        >
          <div
            style={{
              color:
                "#f5f5f5",

              fontSize:
                qualificationBadge.length >
                3
                  ? 68
                  : 95,

              fontWeight:
                700,

              lineHeight:
                0.82,

              letterSpacing:
                -5.2,

              textAlign:
                "center",

              transform:
                "translateY(-1px)",
            }}
          >
            {
              qualificationBadge
            }
          </div>
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(
                57.5
              ),

            top:
              mmToPx(
                19.3
              ),

            color:
              "#8e9195",

            fontSize:
              21.4,

            fontWeight:
              400,

            lineHeight:
              1.01,
          }}
        >
          {qualificationLabelLines.map(
            (
              line
            ) => (
              <div
                key={
                  line
                }
              >
                {line}
              </div>
            )
          )}
        </div>

        <div
          style={{
            position:
              "absolute",

            right:
              mmToPx(
                4.8
              ),

            top:
              mmToPx(
                24.2
              ),

            display:
              "flex",

            alignItems:
              "center",

            gap:
              mmToPx(
                2.6
              ),
          }}
        >
          <div
            style={{
              fontSize:
                17.2,

              fontWeight:
                400,
            }}
          >
            Mark
          </div>

          <div
            style={{
              width:
                mmToPx(
                  17
                ),

              height:
                mmToPx(
                  21
                ),

              border:
                `1.4px solid ${LINE}`,

              boxSizing:
                "border-box",
            }}
          />
        </div>

        <Divider
          y={
            topBandTop
          }
        />

        <div
          style={{
            position:
              "absolute",

            right:
              mmToPx(
                3.6
              ),

            top:
              mmToPx(
                54.4
              ),

            width:
              mmToPx(
                100
              ),

            textAlign:
              "right",

            lineHeight:
              0.92,
          }}
        >
          <div
            style={{
              fontSize:
                subjectName.length >
                18
                  ? 21.8
                  : 24.8,

              fontWeight:
                700,

              letterSpacing:
                -0.01,

              whiteSpace:
                "nowrap",
            }}
          >
            {subjectName}
          </div>

          <div
            style={{
              fontSize:
                paperTitle.length >
                22
                  ? 21.8
                  : 24.8,

              fontWeight:
                700,

              letterSpacing:
                -0.01,

              whiteSpace:
                "nowrap",
            }}
          >
            {paperTitle}
          </div>
        </div>

        {showDateTimeBlock ? (
          <div
            style={{
              position:
                "absolute",

              left:
                mmToPx(1),

              top:
                bandMidY -
                18,

              color:
                "#222",

              lineHeight:
                1.08,
            }}
          >
            {showDateLine ? (
              <div
                style={{
                  fontSize:
                    16.2,

                  fontWeight:
                    400,

                  textTransform:
                    "uppercase",

                  marginBottom:
                    showTimeLine
                      ? 5
                      : 0,
                }}
              >
                {dateText}
              </div>
            ) : null}

            {showTimeLine ? (
              <div
                style={{
                  fontSize:
                    16.2,

                  fontWeight:
                    400,
                }}
              >
                {timeText}
              </div>
            ) : null}
          </div>
        ) : null}

        {showNoCalculatorIcon ? (
          <div
            style={{
              position:
                "absolute",

              left:
                mmToPx(
                  70.6
                ),

              top:
                bandMidY -
                41,

              width:
                82,

              height:
                82,

              display:
                "grid",

              placeItems:
                "center",
            }}
          >
            <NoCalculatorIcon />
          </div>
        ) : null}

        <Divider
          y={
            lowerBandTop
          }
        />

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(
                100.7
              ),

            fontSize:
              15.8,

            fontWeight:
              700,

            letterSpacing:
              -0.005,
          }}
        >
          Fill in these boxes and
          read what is printed below.
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(
                113.8
              ),

            fontSize:
              14.1,

            fontWeight:
              400,
          }}
        >
          Full name of centre
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(
                108
              ),

            top:
              mmToPx(
                113.8
              ),

            fontSize:
              14.1,

            fontWeight:
              400,
          }}
        >
          Town
        </div>

        <LineBox
          x={
            mmToPx(1)
          }
          y={
            mmToPx(
              119.2
            )
          }
          w={
            mmToPx(98)
          }
          h={
            mmToPx(
              13.2
            )
          }
        />

        <LineBox
          x={
            mmToPx(
              108
            )
          }
          y={
            mmToPx(
              119.2
            )
          }
          w={
            mmToPx(67)
          }
          h={
            mmToPx(
              13.2
            )
          }
        />

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(
                138.2
              ),

            fontSize:
              14.1,

            fontWeight:
              400,
          }}
        >
          Forename(s)
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(81),

            top:
              mmToPx(
                138.2
              ),

            fontSize:
              14.1,

            fontWeight:
              400,
          }}
        >
          Surname
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(
                146.5
              ),

            top:
              mmToPx(
                138.2
              ),

            fontSize:
              13.6,

            fontWeight:
              400,

            whiteSpace:
              "nowrap",
          }}
        >
          Number of seat
        </div>

        <LineBox
          x={
            mmToPx(1)
          }
          y={
            mmToPx(
              143.5
            )
          }
          w={
            mmToPx(67)
          }
          h={
            mmToPx(
              13.2
            )
          }
        />

        <LineBox
          x={
            mmToPx(81)
          }
          y={
            mmToPx(
              143.5
            )
          }
          w={
            mmToPx(57)
          }
          h={
            mmToPx(
              13.2
            )
          }
        />

        <LineBox
          x={
            mmToPx(
              146.5
            )
          }
          y={
            mmToPx(
              143.5
            )
          }
          w={
            mmToPx(
              28.5
            )
          }
          h={
            mmToPx(
              13.2
            )
          }
        />

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(10),

            top:
              mmToPx(
                164.1
              ),

            fontSize:
              14.1,

            fontWeight:
              400,
          }}
        >
          Date of birth
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(17),

            top:
              mmToPx(170),

            fontSize:
              12.2,

            fontWeight:
              400,
          }}
        >
          Day
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(38),

            top:
              mmToPx(170),

            fontSize:
              12.2,

            fontWeight:
              400,
          }}
        >
          Month
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(64),

            top:
              mmToPx(170),

            fontSize:
              12.2,

            fontWeight:
              400,
          }}
        >
          Year
        </div>

        <CandidateBoxes
          count={
            2
          }
          x={
            mmToPx(10)
          }
          y={
            mmToPx(
              174.5
            )
          }
          w={
            mmToPx(20)
          }
          h={
            mmToPx(
              11.2
            )
          }
        />

        <CandidateBoxes
          count={
            2
          }
          x={
            mmToPx(34)
          }
          y={
            mmToPx(
              174.5
            )
          }
          w={
            mmToPx(20)
          }
          h={
            mmToPx(
              11.2
            )
          }
        />

        <CandidateBoxes
          count={
            2
          }
          x={
            mmToPx(58)
          }
          y={
            mmToPx(
              174.5
            )
          }
          w={
            mmToPx(20)
          }
          h={
            mmToPx(
              11.2
            )
          }
        />

        {showScottishCandidateNumberBox ? (
          <>
            <div
              style={{
                position:
                  "absolute",

                left:
                  mmToPx(
                    88
                  ),

                top:
                  mmToPx(
                    170
                  ),

                fontSize:
                  14.1,

                fontWeight:
                  400,
              }}
            >
              Scottish candidate
              number
            </div>

            <CandidateBoxes
              count={
                9
              }
              x={
                mmToPx(
                  88
                )
              }
              y={
                mmToPx(
                  174.5
                )
              }
              w={
                mmToPx(
                  76
                )
              }
              h={
                mmToPx(
                  11.2
                )
              }
            />
          </>
        ) : null}

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(
                192.9
              ),

            fontSize:
              16.2,

            fontWeight:
              700,

            letterSpacing:
              -0.01,
          }}
        >
          Total marks —{" "}
          {totalMarks}
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              mmToPx(1),

            top:
              mmToPx(
                200.8
              ),

            width:
              mmToPx(
                162
              ),

            fontSize:
              11.1,

            lineHeight:
              1.12,

            fontWeight:
              400,

            letterSpacing:
              -0.005,
          }}
        >
          <div
            style={{
              marginBottom:
                3,
            }}
          >
            Attempt ALL questions.
          </div>

          <div
            style={{
              marginBottom:
                3,

              fontWeight:
                700,
            }}
          >
            {coverInstructionText}
          </div>

          <div
            style={{
              marginBottom:
                3,
            }}
          >
            To earn full marks you
            must show your working in
            your answers.
          </div>

          <div
            style={{
              marginBottom:
                3,
            }}
          >
            State the units for your
            answer where appropriate.
          </div>

          <div
            style={{
              marginBottom:
                3,
            }}
          >
            Write your answers clearly
            in the spaces provided in
            this booklet. Additional
            space for answers is
            provided at the end of
            this booklet. If you use
            this space you must clearly
            identify the question
            number you are attempting.
          </div>

          <div
            style={{
              marginBottom:
                3,
            }}
          >
            Use blue or black ink.
          </div>

          <div>
            Before leaving the
            examination room you must
            give this booklet to the
            Invigilator; if you do not,
            you may lose all the marks
            for this paper.
          </div>
        </div>
      </div>
    </NationalQualificationsPageFrame>
  );
}