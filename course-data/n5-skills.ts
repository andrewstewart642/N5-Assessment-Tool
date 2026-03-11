// course-data/N5-Skills.ts

import type { Concept, Skill, SkillsData } from "@/shared-types/AssessmentTypes";

function buildConcept(
  id: string,
  code: string,
  label: string,
  marks = 2,
  standard: Concept["standard"] = "C+A"
): Concept {
  return {
    id,
    code,
    label,
    shortLabel: label,
    fullDescription: label,
    standard,
    marks,
    promptStyleId: "B",
    metadata: {
      standardTier: standard,
      thinkingType: standard === "C" ? "operational" : standard === "A" ? "reasoning" : "mixed",
      paperSuitability: "BOTH",
      calculator: "optional",
      interactionType: "core",
      stepCount: "multi",
      topicTags: [],
      canBePrimary: true,
      availableDifficultyLevels: [1, 2, 3, 4, 5],
      defaultDifficultyLevel: 3,
    },
  };
}

function buildSkill(
  id: string,
  code: string,
  text: string,
  concepts: Concept[],
  domain: Skill["domain"] = "ALG",
  paperSuitability: Skill["paperSuitability"] = "BOTH"
): Skill {
  return {
    id,
    code,
    text,
    domain,
    paperSuitability,
    concepts,
  };
}

export const skillsData: SkillsData = {
  "Numerical Skills": [
    buildSkill(
      "num-n1-surds",
      "N1",
      "Work with surds",
      [
        buildConcept("num-n1-1", "N1.1", "Simplify surds", 2, "C"),
        buildConcept("num-n1-2", "N1.2", "Rationalise the denominator of a surd", 3, "C+A"),
      ],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n2-indices",
      "N2",
      "Simplify expressions using the laws of indices",
      [
        buildConcept("num-n2-1", "N2.1", "Multiply and divide indices", 2, "C"),
        buildConcept("num-n2-2", "N2.2", "Power of a product", 2, "C"),
        buildConcept("num-n2-3", "N2.3", "Power to a power", 2, "C"),
        buildConcept("num-n2-4", "N2.4", "Fractional indices", 3, "C+A"),
      ],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n2-scientific-notation",
      "N2",
      "Scientific Notation",
      [buildConcept("num-n2-5", "N2.5", "Scientific notation", 3, "C")],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n3-significant-figures",
      "N3",
      "Round to a given number of significant figures",
      [buildConcept("num-n3-1", "N3.1", "Significant figures", 1, "C")],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n4-reverse-percentage",
      "N4",
      "Work with percentages (reverse percentage)",
      [buildConcept("num-n4-1", "N4.1", "Reverse percentage", 3, "C+A")],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n4-appreciation-depreciation",
      "N4",
      "Work with percentages (appreciation/depreciation)",
      [
        buildConcept("num-n4-2", "N4.2", "Appreciation", 3, "C"),
        buildConcept("num-n4-3", "N4.3", "Depreciation", 3, "C"),
      ],
      "NUM",
      "P1"
    ),

    buildSkill(
      "num-n5-fractions",
      "N5",
      "Work with fractions",
      [buildConcept("num-n5-1", "N5.1", "Fraction operations", 2, "C")],
      "NUM",
      "P1"
    ),
  ],

  "Algebraic Skills": [
    buildSkill(
      "alg-a01-expand-brackets",
      "A1",
      "Work with algebraic expressions involving expansion of brackets",
      [buildConcept("alg-a1-1", "A1.1", "Expansion of brackets", 2, "C")],
      "ALG"
    ),
    buildSkill(
      "alg-a02-factorise-expression",
      "A2",
      "Factorise an algebraic expression",
      [buildConcept("alg-a2-1", "A2.1", "Factorising", 2, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a03-complete-the-square",
      "A3",
      "Complete the square in a quadratic expression with unitary x² coefficient",
      [buildConcept("alg-a3-1", "A3.1", "Complete the square", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a04-reduce-algebraic-fraction",
      "A4",
      "Reduce an algebraic fraction to its simplest form",
      [buildConcept("alg-a4-1", "A4.1", "Simplify algebraic fractions", 2, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a05-operations-algebraic-fractions",
      "A5",
      "Apply the four operations to algebraic fractions",
      [buildConcept("alg-a5-1", "A5.1", "Operations with algebraic fractions", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a06-equation-of-line",
      "A6",
      "Determine the equation of a straight line",
      [buildConcept("alg-a6-1", "A6.1", "Equation of a straight line", 2, "C")],
      "ALG"
    ),
    buildSkill(
      "alg-a06-gradient-from-equation",
      "A6",
      "Determine the gradient etc, of a straight line given its equation",
      [buildConcept("alg-a6-3", "A6.3", "Gradient / intercept from equation", 2, "C")],
      "ALG"
    ),
    buildSkill(
      "alg-a06-functional-notation",
      "A6",
      "Work with functional notation",
      [buildConcept("alg-a6-2", "A6.2", "Functional notation", 2, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a07-linear-equations",
      "A7",
      "Work with linear equations",
      [buildConcept("alg-a7-1", "A7.1", "Linear equations", 2, "C")],
      "ALG"
    ),
    buildSkill(
      "alg-a07-linear-inequalities",
      "A7",
      "Work with linear inequalities",
      [buildConcept("alg-a7-2", "A7.2", "Linear inequalities", 2, "C")],
      "ALG"
    ),
    buildSkill(
      "alg-a08-simultaneous-equations",
      "A8",
      "Work with simultaneous equation",
      [buildConcept("alg-a8-1", "A8.1", "Simultaneous equations", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a09-change-subject",
      "A9",
      "Change the subject of a formula",
      [buildConcept("alg-a9-1", "A9.1", "Change the subject", 2, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a10-quadratic-from-graph",
      "A10",
      "Recognise and determine the equation of a quadratic function from its graph",
      [buildConcept("alg-a10-1", "A10.1", "Quadratic from graph", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a11-sketch-quadratic",
      "A11",
      "Sketch a quadratic function",
      [buildConcept("alg-a11-1", "A11.1", "Sketch quadratic", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a12-features-of-quadratic",
      "A12",
      "Identify features of a quadratic function",
      [buildConcept("alg-a12-1", "A12.1", "Identify quadratic features", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a13-quadratic-equations-factorise",
      "A13",
      "Work with quadratic equations (factorise)",
      [buildConcept("alg-a13-1", "A13.1", "Solve quadratics by factorising", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a13-quadratic-equations-formula",
      "A13",
      "Work with quadratic equations (quadratic formula)",
      [buildConcept("alg-a13-4", "A13.4", "Solve quadratics using formula", 3, "C+A")],
      "ALG"
    ),
    buildSkill(
      "alg-a14-discriminant",
      "A14",
      "Use discriminant",
      [buildConcept("alg-a14-1", "A14.1", "Discriminant", 3, "A")],
      "ALG"
    ),
  ],

  "Geometric Skills": [
    buildSkill(
      "geo-g01-gradient-two-points",
      "G1",
      "Determine the gradient of a straight line, given two points",
      [buildConcept("geo-g1-1", "G1.1", "Gradient formula", 2, "C")],
      "GEO"
    ),
    buildSkill(
      "geo-g02-arc-or-sector",
      "G2",
      "Calculate the length of arc or the area of sector of a circle",
      [buildConcept("geo-g2-1", "G2.1", "Arc length / sector area", 3, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g03-standard-solid-volume",
      "G3",
      "Calculate the volume of a standard solid",
      [buildConcept("geo-g3-1", "G3.1", "Volume of standard solid", 3, "C")],
      "GEO"
    ),
    buildSkill(
      "geo-g04-pythagoras",
      "G4",
      "Apply Pythagoras’ Theorem",
      [buildConcept("geo-g4-1", "G4.1", "Pythagoras", 2, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g04-pythagoras-chord",
      "G4",
      "Apply Pythagoras’ Theorem (Perpendicular bisector of chord)",
      [buildConcept("geo-g4-2", "G4.2", "Pythagoras in circle chord context", 3, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g05-shape-properties-angle",
      "G5",
      "Apply the properties of shapes to determine an angle involving at least two steps",
      [buildConcept("geo-g5-1", "G5.1", "Multi-step angle properties", 3, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g06-similarity",
      "G6",
      "Use similarity",
      [buildConcept("geo-g6-1", "G6.1", "Similarity", 3, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g07-2d-vectors",
      "G7",
      "Work with 2D vectors",
      [buildConcept("geo-g7-1", "G7.1", "2D vectors", 2, "C+A")],
      "GEO"
    ),
    buildSkill(
      "geo-g08-3d-coordinates",
      "G8",
      "Work with 3D coordinates",
      [buildConcept("geo-g8-1", "G8.1", "3D coordinates", 2, "C")],
      "GEO"
    ),
    buildSkill(
      "geo-g09-vector-components",
      "G9",
      "Use vector components",
      [buildConcept("geo-g9-1", "G9.1", "Vector components", 2, "C")],
      "GEO"
    ),
    buildSkill(
      "geo-g10-magnitude",
      "G10",
      "Calculate magnitude",
      [buildConcept("geo-g10-1", "G10.1", "Vector magnitude", 2, "C")],
      "GEO"
    ),
  ],

  "Trigonometric Skills": [
    buildSkill(
      "trig-t01-graphs",
      "T1",
      "Work with the graphs of trigonometric functions",
      [buildConcept("trig-t1-1", "T1.1", "Trig graphs", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t02-related-angles",
      "T2",
      "Work with trigonometric relationships in degrees (related angles etc.)",
      [buildConcept("trig-t2-1", "T2.1", "Related angles", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t02-equations",
      "T2",
      "Work with trigonometric relationships in degrees (equations)",
      [buildConcept("trig-t2-2", "T2.2", "Trig equations", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t02-identities",
      "T2",
      "Work with trigonometric relationships in degrees (identities)",
      [buildConcept("trig-t2-3", "T2.3", "Trig identities", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t03-area",
      "T3",
      "Calculate the area of a triangle using trigonometry",
      [buildConcept("trig-t3-1", "T3.1", "Area of triangle using trig", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t04-sine-rule",
      "T4",
      "Use the sine rule to find a side or angle in a triangle",
      [buildConcept("trig-t4-1", "T4.1", "Sine rule", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t04-cosine-rule",
      "T4",
      "Use the cosine rule to find a side or angle in a triangle",
      [buildConcept("trig-t4-2", "T4.2", "Cosine rule", 3, "A")],
      "TRIG",
      "P2"
    ),
    buildSkill(
      "trig-t05-bearings",
      "T5",
      "Use bearings with trigonometry",
      [buildConcept("trig-t5-1", "T5.1", "Bearings with trigonometry", 3, "A")],
      "TRIG",
      "P2"
    ),
  ],

  "Statistical Skills": [
    buildSkill(
      "stat-s01-mean-sd",
      "S1",
      "Compare data sets using calculated/determined statistics (Mean & SD)",
      [buildConcept("stat-s1-2", "S1.2", "Mean & standard deviation comparison", 3, "C+A")],
      "STAT"
    ),
    buildSkill(
      "stat-s01-median-iqr",
      "S1",
      "Compare data sets using calculated/determined statistics (Median & IQR)",
      [buildConcept("stat-s1-1", "S1.1", "Median & semi-interquartile range comparison", 3, "C+A")],
      "STAT"
    ),
    buildSkill(
      "stat-s02-linear-model",
      "S2",
      "Form a linear model from a given set of data",
      [buildConcept("stat-s2-1", "S2.1", "Best-fit line and estimation", 3, "C")],
      "STAT"
    ),
  ],
};