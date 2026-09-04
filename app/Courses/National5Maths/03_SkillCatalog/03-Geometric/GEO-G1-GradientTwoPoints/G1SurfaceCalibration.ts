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
  { surfaceStyleId: "DIRECT_COORDINATES_LINE_EQUATION", sourceQuestionIds: ["N5_MATH_2015_P1_Q8", "N5_MATH_2022_P1_Q6"], observedCount: 2, coordinateSource: "TEXT", visualType: "NONE", visualDependency: "NONE", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["two coordinate pairs supplied directly", "minimal prose", "find the equation of the joining line", "simplest-form requirement"] },
  { surfaceStyleId: "COORDINATE_DIAGRAM_LINE_EQUATION", sourceQuestionIds: ["N5_MATH_2017_P1_Q6", "N5_MATH_2025_P1_Q6"], observedCount: 2, coordinateSource: "DIAGRAM", visualType: "COORDINATE_DIAGRAM", visualDependency: "ESSENTIAL", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["coordinate axes and a straight line are supplied", "two labelled points provide the coordinate data visually", "candidate must read the coordinates before calculating the gradient", "three-mark line-equation response"] },
  { surfaceStyleId: "CONTEXT_LINE_GRAPH_LABELLED_POINTS", sourceQuestionIds: ["N5_MATH_2018_P1_Q7", "N5_MATH_2021_P1_Q10"], observedCount: 2, coordinateSource: "TEXT", visualType: "GRAPH", visualDependency: "SUPPORTIVE", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_4", stableSurfaceFeatures: ["deterministic contextual straight-line relationship", "graph supplied for context/structure", "two named point values stated explicitly", "three-mark model construction followed by one direct model calculation"] },
  { surfaceStyleId: "BEST_FIT_LABELLED_POINTS_CONTEXT", sourceQuestionIds: ["N5_MATH_2014_P1_Q6", "N5_MATH_2016_P1_Q5", "N5_MATH_2024_P1_Q9"], observedCount: 3, coordinateSource: "TEXT", visualType: "SCATTERGRAPH", visualDependency: "SUPPORTIVE", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_3_PLUS_S2_1", stableSurfaceFeatures: ["scattergraph and supplied line of best fit", "two model-defining line points also stated in prose", "three-mark G1 line model", "one-mark S2 contextual estimate"] },
  { surfaceStyleId: "BEST_FIT_GRID_READ_POINTS", sourceQuestionIds: ["N5_MATH_2019_P1_Q6", "N5_MATH_2023_P1_Q7"], observedCount: 2, coordinateSource: "GRAPH", visualType: "SCATTERGRAPH", visualDependency: "ESSENTIAL", questionArchitecture: "MULTIPART_3_PLUS_1", markOwnership: "G1_3_PLUS_S2_1", stableSurfaceFeatures: ["scaled scattergraph and supplied best-fit line", "usable line points are not duplicated in prose", "candidate must read/select exact line coordinates from the graph", "three-mark G1 line model followed by one S2 estimate"] },
  { surfaceStyleId: "SYMBOLIC_COORDINATE_GRADIENT", sourceQuestionIds: ["N5_MATH_2019_P2_Q13"], observedCount: 1, coordinateSource: "TEXT", visualType: "NONE", visualDependency: "NONE", questionArchitecture: "SINGLE_3", markOwnership: "G1_3", stableSurfaceFeatures: ["two coordinate points supplied directly", "one point contains an algebraic parameter", "gradient only rather than full line equation", "factorisation and cancellation required to reach simplest form"] },
] as const;

export const G1_COORDINATE_DIAGRAM_GENERATION_GUARDRAILS = [
  "Use a conventional horizontal x-axis and vertical y-axis with legible integer tick spacing.",
  "Place both labelled points exactly on grid intersections and exactly on the generated straight line.",
  "Choose a viewing window that gives the two points useful separation without crowding either axis edge.",
  "Do not rely on visual measurement of an unlabelled point: generated coordinates must be objectively readable from the axes/grid.",
  "Point labels must not cover tick labels, the line, or the coordinate position.",
  "The diagram is mathematical data, not decoration; renderer validation must confirm coordinate-to-pixel consistency.",
] as const;

export const G1_CONTEXT_GRAPH_GENERATION_GUARDRAILS = [
  "Use the graph to communicate the deterministic relationship, but duplicate the two model-defining point values in the text for this surface family.",
  "Axis variables, units and contextual labels must match the generated equation state exactly.",
  "The graph line should pass through the generated points and look proportionally plausible, but source artwork and source page geometry must not be copied.",
  "Keep the context compact enough that the assessed demand remains coordinate geometry rather than prose interpretation.",
] as const;

export const G1_BEST_FIT_GRAPH_GENERATION_GUARDRAILS = [
  "The line of best fit is supplied by the question; the candidate is not asked to draw it in the current G1 family.",
  "Scatter points should plausibly surround the supplied line without encoding a copy of any historical data set.",
  "Labelled-point variants may use a schematic scattergraph because the model-defining coordinates are also explicit in text.",
  "Grid-read variants require a true scaled graph with exact line placement and at least two clean grid-readable line points.",
  "Do not make the historical line points, axis ranges, tick intervals or contexts generator constants.",
  "The one-mark follow-up remains S2-owned and must be visibly separated in generation metadata even when rendered in the same multipart question.",
] as const;

export const G1_SYMBOLIC_SURFACE_GENERATION_GUARDRAILS = [
  "Keep the prompt short and coordinate-geometric: two points, one parameterised, then a request for the gradient in simplest form.",
  "Avoid adding a diagram unless new evidence establishes a genuine visual version of this symbolic family.",
  "The algebraic point should be compact enough that the gradient quotient exposes a recognisable factorisation route.",
  "Use exact notation throughout; decimal approximations are not an appropriate surface for the symbolic gradient family.",
] as const;
