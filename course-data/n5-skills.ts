import type { Concept, Skill, SkillsData } from "@/shared-types/AssessmentTypes";

import { NQ_N5_NUM_N01_SurdsAndRationalising } from "@/app/Question-Bank/skills/01-numerical/NQ_N5_NUM_N01_SurdsAndRationalising";
import { NQ_N5_NUM_N02_IndicesAndScientificNotation } from "@/app/Question-Bank/skills/01-numerical/NQ_N5_NUM_N02_IndicesAndScientificNotation";
import { NQ_N5_NUM_N03_SignificantFigures } from "@/app/Question-Bank/skills/01-numerical/NQ_N5_NUM_N03_SignificantFigures";
import { NQ_N5_NUM_N04_PercentageApplications } from "@/app/Question-Bank/skills/01-numerical/NQ_N5_NUM_N04_PercentageApplications";
import { NQ_N5_NUM_N05_Fractions } from "@/app/Question-Bank/skills/01-numerical/NQ_N5_NUM_N05_Fractions";

function placeholderConcept(
  id: string,
  code: string,
  label: string,
  marks = 2
): Concept {
  return {
    id,
    code,
    label,
    shortLabel: label,
    fullDescription: label,
    standard: "C+A",
    marks,
    promptStyleId: "B",
    metadata: {
      standardTier: "C+A",
      thinkingType: "mixed",
      paperSuitability: "BOTH",
      calculator: "optional",
      interactionType: "core",
      stepCount: "multi",
      topicTags: [],
      canBePrimary: true,
    },
  };
}

function placeholderSkill(
  id: string,
  code: string,
  text: string,
  conceptCode: string,
  conceptLabel?: string,
  marks = 2,
  domain: Skill["domain"] = "ALG",
  paperSuitability: Skill["paperSuitability"] = "BOTH"
): Skill {
  return {
    id,
    code,
    text,
    domain,
    paperSuitability,
    concepts: [
      placeholderConcept(
        `${id}-concept`,
        conceptCode,
        conceptLabel ?? `${conceptCode} ${text}`,
        marks
      ),
    ],
  };
}

export const skillsData: SkillsData = {
  "Numerical Skills": [
    NQ_N5_NUM_N01_SurdsAndRationalising,
    ...NQ_N5_NUM_N02_IndicesAndScientificNotation,
    NQ_N5_NUM_N03_SignificantFigures,
    ...NQ_N5_NUM_N04_PercentageApplications,
    NQ_N5_NUM_N05_Fractions,
  ],

  "Algebraic Skills": [
    placeholderSkill(
      "alg-a01-expand-brackets",
      "A1",
      "Work with algebraic expressions involving expansion of brackets",
      "A1.1",
      "A1.1 Expansion of brackets",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a02-factorise-expression",
      "A2",
      "Factorise an algebraic expression",
      "A2.1",
      "A2.1 Factorising",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a03-complete-the-square",
      "A3",
      "Complete the square in a quadratic expression with unitary x² coefficient",
      "A3.1",
      "A3.1 Complete the square",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a04-reduce-algebraic-fraction",
      "A4",
      "Reduce an algebraic fraction to its simplest form",
      "A4.1",
      "A4.1 Simplify algebraic fractions",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a05-operations-algebraic-fractions",
      "A5",
      "Apply the four operations to algebraic fractions",
      "A5.1",
      "A5.1 Operations with algebraic fractions",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a06-equation-of-line",
      "A6",
      "Determine the equation of a straight line",
      "A6.1",
      "A6.1 Equation of a straight line",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a06-gradient-from-equation",
      "A6",
      "Determine the gradient etc, of a straight line given its equation",
      "A6.3",
      "A6.3 Gradient / intercept from equation",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a06-functional-notation",
      "A6",
      "Work with functional notation",
      "A6.2",
      "A6.2 Functional notation",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a07-linear-equations",
      "A7",
      "Work with linear equations",
      "A7.1",
      "A7.1 Linear equations",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a07-linear-inequalities",
      "A7",
      "Work with linear inequalities",
      "A7.2",
      "A7.2 Linear inequalities",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a08-simultaneous-equations",
      "A8",
      "Work with simultaneous equation",
      "A8.1",
      "A8.1 Simultaneous equations",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a09-change-subject",
      "A9",
      "Change the subject of a formula",
      "A9.1",
      "A9.1 Change the subject",
      2,
      "ALG"
    ),
    placeholderSkill(
      "alg-a10-quadratic-from-graph",
      "A10",
      "Recognise and determine the equation of a quadratic function from its graph",
      "A10.1",
      "A10.1 Quadratic from graph",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a11-sketch-quadratic",
      "A11",
      "Sketch a quadratic function",
      "A11.1",
      "A11.1 Sketch quadratic",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a12-features-of-quadratic",
      "A12",
      "Identify features of a quadratic function",
      "A12.1",
      "A12.1 Identify quadratic features",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a13-quadratic-equations-factorise",
      "A13",
      "Work with quadratic equations (factorise)",
      "A13.1",
      "A13.1 Solve quadratics by factorising",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a13-quadratic-equations-formula",
      "A13",
      "Work with quadratic equations (quadratic formula)",
      "A13.4",
      "A13.4 Solve quadratics using formula",
      3,
      "ALG"
    ),
    placeholderSkill(
      "alg-a14-discriminant",
      "A14",
      "Use discriminant",
      "A14.1",
      "A14.1 Discriminant",
      3,
      "ALG"
    ),
  ],

  "Geometric Skills": [
    placeholderSkill(
      "geo-g01-gradient-two-points",
      "G1",
      "Determine the gradient of a straight line, given two points",
      "G1.1",
      "G1.1 Gradient formula",
      2,
      "GEO"
    ),
    placeholderSkill(
      "geo-g02-arc-or-sector",
      "G2",
      "Calculate the length of arc or the area of sector of a circle",
      "G2.1",
      "G2.1 Arc length / sector area",
      3,
      "GEO"
    ),
    placeholderSkill(
      "geo-g03-standard-solid-volume",
      "G3",
      "Calculate the volume of a standard solid",
      "G3.1",
      "G3.1 Volume of standard solid",
      3,
      "GEO"
    ),
    placeholderSkill(
      "geo-g04-pythagoras",
      "G4",
      "Apply Pythagoras’ Theorem",
      "G4.1",
      "G4.1 Pythagoras",
      2,
      "GEO"
    ),
    placeholderSkill(
      "geo-g04-pythagoras-chord",
      "G4",
      "Apply Pythagoras’ Theorem (Perpendicular bisector of chord)",
      "G4.2",
      "G4.2 Pythagoras in circle chord context",
      3,
      "GEO"
    ),
    placeholderSkill(
      "geo-g05-shape-properties-angle",
      "G5",
      "Apply the properties of shapes to determine an angle involving at least two steps",
      "G5.1",
      "G5.1 Multi-step angle properties",
      3,
      "GEO"
    ),
    placeholderSkill(
      "geo-g06-similarity",
      "G6",
      "Use similarity",
      "G6.1",
      "G6.1 Similarity",
      3,
      "GEO"
    ),
    placeholderSkill(
      "geo-g07-2d-vectors",
      "G7",
      "Work with 2D vectors",
      "G7.1",
      "G7.1 2D vectors",
      2,
      "GEO"
    ),
    placeholderSkill(
      "geo-g08-3d-coordinates",
      "G8",
      "Work with 3D coordinates",
      "G8.1",
      "G8.1 3D coordinates",
      2,
      "GEO"
    ),
    placeholderSkill(
      "geo-g09-vector-components",
      "G9",
      "Use vector components",
      "G9.1",
      "G9.1 Vector components",
      2,
      "GEO"
    ),
    placeholderSkill(
      "geo-g10-magnitude",
      "G10",
      "Calculate magnitude",
      "G10.1",
      "G10.1 Vector magnitude",
      2,
      "GEO"
    ),
  ],

  "Trigonometric Skills": [
    placeholderSkill(
      "trig-t01-graphs",
      "T1",
      "Work with the graphs of trigonometric functions",
      "T1.1",
      "T1.1 Trig graphs",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t02-related-angles",
      "T2",
      "Work with trigonometric relationships in degrees (related angles etc.)",
      "T2.1",
      "T2.1 Related angles",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t02-equations",
      "T2",
      "Work with trigonometric relationships in degrees (equations)",
      "T2.2",
      "T2.2 Trig equations",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t02-identities",
      "T2",
      "Work with trigonometric relationships in degrees (identities)",
      "T2.3",
      "T2.3 Trig identities",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t03-area",
      "T3",
      "Calculate the area of a triangle using trigonometry",
      "T3.1",
      "T3.1 Area of triangle using trig",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t04-sine-rule",
      "T4",
      "Use the sine rule to find a side or angle in a triangle",
      "T4.1",
      "T4.1 Sine rule",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t04-cosine-rule",
      "T4",
      "Use the cosine rule to find a side or angle in a triangle",
      "T4.2",
      "T4.2 Cosine rule",
      3,
      "TRIG",
      "P2"
    ),
    placeholderSkill(
      "trig-t05-bearings",
      "T5",
      "Use bearings with trigonometry",
      "T5.1",
      "T5.1 Bearings with trigonometry",
      3,
      "TRIG",
      "P2"
    ),
  ],

  "Statistical Skills": [
    placeholderSkill(
      "stat-s01-mean-sd",
      "S1",
      "Compare data sets using calculated/determined statistics (Mean & SD)",
      "S1.2",
      "S1.2 Mean & standard deviation comparison",
      3,
      "STAT"
    ),
    placeholderSkill(
      "stat-s01-median-iqr",
      "S1",
      "Compare data sets using calculated/determined statistics (Median & IQR)",
      "S1.1",
      "S1.1 Median & semi-interquartile range comparison",
      3,
      "STAT"
    ),
    placeholderSkill(
      "stat-s02-linear-model",
      "S2",
      "Form a linear model from a given set of data",
      "S2.1",
      "S2.1 Best-fit line and estimation",
      3,
      "STAT"
    ),
  ],
};