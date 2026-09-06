import type { G1SurfaceStyleId } from "./G1CrossCorpusAnalysis";

export type G1SurfaceCalibrationRow = {
  surfaceStyleId: G1SurfaceStyleId;
  sourceQuestionIds: readonly string[];
  observedCount: number;
  coordinateSource: "TEXT" | "DIAGRAM" | "GRAPH";
  visualType: "NONE" | "COORDINATE_DIAGRAM" | "GRAPH" | "SCATTERGRAPH";
  visualDependency: "NONE" | "SUPPORTIVE" | "ESSENTIAL";
  questionArchitecture: "SINGLE_3" | "MULTIPART_3_PLUS_1";
  markOwnership: "G1_3" | "G1_4" | "G1_3_PLUS_S2_1";
  stableSurfaceFeatures: readonly string[];
};

export const G1_SURFACE_CALIBRATION: readonly G1SurfaceCalibrationRow[] = [
  { surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION", sourceQuestionIds: ["N5_MATH_2015_P1_Q8", "N5_MATH_2022_P1_Q6"], observedCount: 2, coordinateSource: "TEXT", visualType: "NONE", visualDependency: "NONE", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["two coordinate pairs supplied directly", "minimal prose", "find the equation of the joining line", "simplest-form instruction separated from the main command"] },
  { surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION", sourceQuestionIds: ["N5_MATH_2017_P1_Q6", "N5_MATH_2025_P1_Q6"], observedCount: 2, coordinateSource: "DIAGRAM", visualType: "COORDINATE_DIAGRAM", visualDependency: "ESSENTIAL", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["sparse x/y axes with arrowheads", "origin marked O", "two labelled points on one straight line", "point coordinates carried by the diagram", "no grid required", "three-mark line-equation response"] },
  { surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS", sourceQuestionIds: ["N5_MATH_2018_P1_Q7", "N5_MATH_2021_P1_Q10"], observedCount: 2, coordinateSource: "TEXT", visualType: "GRAPH", visualDependency: "SUPPORTIVE", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_4", stableSurfaceFeatures: ["deterministic contextual straight-line relationship", "compact schematic graph", "two named point values stated explicitly below or alongside the graph", "context variables and units are explicit", "equation must use the contextual variables", "three-mark model construction followed by one direct model calculation"] },
  { surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT", sourceQuestionIds: ["N5_MATH_2014_P1_Q6", "N5_MATH_2016_P1_Q5", "N5_MATH_2024_P1_Q9"], observedCount: 3, coordinateSource: "TEXT", visualType: "SCATTERGRAPH", visualDependency: "SUPPORTIVE", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_3_PLUS_S2_1", stableSurfaceFeatures: ["scattergraph and supplied line of best fit", "two model-defining line points stated explicitly", "context variables and units are explicit", "three-mark G1 fitted-line model", "one-mark S2 contextual estimate"] },
  { surfaceStyleId: "BEST_FIT_GRID_READ_POINTS", sourceQuestionIds: ["N5_MATH_2019_P1_Q6", "N5_MATH_2023_P1_Q7"], observedCount: 2, coordinateSource: "GRAPH", visualType: "SCATTERGRAPH", visualDependency: "ESSENTIAL", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_3_PLUS_S2_1", stableSurfaceFeatures: ["scaled scattergraph and supplied best-fit line", "usable coordinates are not duplicated in prose", "exactly two deliberately obvious plotted points lie on the fitted line in generated material", "both intended points lie on clean grid intersections", "all other scatter points lie off the line", "three-mark G1 line model followed by one S2 estimate"] },
  { surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT", sourceQuestionIds: ["N5_MATH_2019_P2_Q13"], observedCount: 1, coordinateSource: "TEXT", visualType: "NONE", visualDependency: "NONE", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["two coordinate points supplied directly", "one point contains an algebraic parameter", "gradient only rather than full line equation", "factorisation and cancellation required to reach simplest form", "rare surface retained at approximately its observed corpus frequency"] },
] as const;

export const G1_COORDINATE_DIAGRAM_GENERATION_GUARDRAILS = [
  "Render a compact schematic rather than a classroom coordinate grid.",
  "Use only a horizontal x-axis and vertical y-axis, each ending in a small positive-direction arrowhead.",
  "Use mathematical axis lettering and mark the origin with O just clear of the axis intersection.",
  "Do not draw gridlines, numeric tick scales or an emphasised y-intercept on this surface.",
  "Draw exactly two simple point markers joined by one solid straight line and show each point label with its generated coordinate pair.",
  "Choose label offsets so point text never crosses the line, point marker, axes or other point text.",
  "Neither generated point may lie on the x-axis or y-axis; an axis point removes too much of the intended substitution demand.",
  "Treat the picture as a sketch of the generated relationship rather than a one-to-one scale drawing; preserve direction and quadrant information but avoid an almost-horizontal line that could mislead a less confident pupil.",
  "Keep the viewing window tight around the two points while still containing the origin; the axes must not extend substantially farther than the geometry needs.",
  "The diagram must communicate the generated point coordinates but must not make the y-intercept directly readable from a scale.",
  "The diagram is essential mathematical data; renderer validation must preserve the stored point labels and line direction even though the surface is intentionally schematic.",
] as const;

export const G1_CONTEXT_GRAPH_GENERATION_GUARDRAILS = [
  "Use a small schematic straight-line graph with sparse axes, arrowheads and contextual variable labels rather than a full Cartesian grid.",
  "Do not draw gridlines or a numeric scale when the two model-defining point values are supplied in the wording.",
  "Do not visually advertise the y-intercept: the pupil should obtain it by calculation from the two supplied points.",
  "State the measured variables and units in the surrounding wording and require the final equation to be written in those contextual variables.",
  "State point A and point B as separate pieces of information rather than compressing them into an essay-like paragraph.",
  "Maintain a broad bank of genuinely different plausible contexts so repeated practice does not feel like a tariff question with renamed nouns.",
  "Include a substantial minority of physically meaningful decreasing relationships rather than defaulting overwhelmingly to positive correlation.",
  "Sensible terminating decimals may be used, but the coordinate subtraction in the non-calculator gradient route must simplify cleanly; gratuitous decimal precision is invalid difficulty.",
  "Axis variables, units, line direction and contextual wording must all agree with the generated mathematical state.",
  "Keep the diagram visually secondary to the question text and compact enough not to dominate the page.",
] as const;

export const G1_BEST_FIT_GRAPH_GENERATION_GUARDRAILS = [
  "The line of best fit is supplied by the question; the pupil is not asked to draw it in the current G1 family.",
  "Scatter points must plausibly surround the supplied line and must be independently generated rather than copied from historical data.",
  "Labelled-point variants should use a restrained scattergraph without unnecessary grid clutter because the two model-defining point values are supplied in text.",
  "On labelled-point variants, use a schematic display window that spreads the data cloud across the available plotting area instead of preserving large unused space back to a numerical origin that the pupil never has to read.",
  "Grid-read variants must use a genuine scale beginning at zero with a modest number of useful gridlines rather than a dense spreadsheet-style grid.",
  "No grid-read axis should exceed eighteen major intervals; if a context cannot support a readable zero-origin scale it must be regenerated or reserved for the labelled-point surface.",
  "A generated grid-read graph must contain exactly two intended scatter points on the fitted line; both must lie on clean grid intersections and every other scatter point must lie visibly off the line.",
  "The two intended grid-read points must be separated enough to make a stable gradient calculation and must be objectively recoverable from the axis scale.",
  "The scatter cloud must occupy a meaningful proportion of the plotting area and must not bunch tightly around the two intended line points.",
  "Positive and negative fitted-line directions should follow their observed corpus balance as a prior; do not default almost every generated graph to positive correlation.",
  "The one-mark follow-up remains S2-owned and must stay explicitly separated in generation metadata even when the historical wrapper is multipart.",
] as const;

export const G1_SYMBOLIC_SURFACE_GENERATION_GUARDRAILS = [
  "Keep the prompt short and coordinate-geometric: identify the two points, ask for an expression for the gradient of the joining line, then place the simplest-form instruction on a new line.",
  "Avoid adding a diagram unless new evidence establishes a genuine visual version of this symbolic family.",
  "The algebraic point should be compact enough that the gradient quotient exposes a recognisable factorisation route.",
  "Use exact notation throughout; decimal approximations are not an appropriate surface for the symbolic gradient family.",
  "Keep this family rare in generic G1 selection because only one reviewed source currently supports it.",
] as const;
