import {
  getCourseAssessmentConfigById,
} from "@/app/Courses/CourseRegistry";

import type {
  CourseId,
} from "@/app/Courses/CourseTypes";

import type {
  Concept,
  Skill,
} from "@/app/Assessments/AssessmentTypes";


export type SkillLike =
  Skill & {
    label?:
      string;

    title?:
      string;

    name?:
      string;

    description?:
      string;
  };


export type CoverageSkillRecord = {
  categoryName:
    string;

  skill:
    SkillLike;
};


export type CoverageConceptRecord = {
  categoryName:
    string;

  skill:
    SkillLike;

  concept:
    Concept;
};


export type CoverageProgress = {
  completed:
    number;

  total:
    number;

  progressPct:
    number;

  isComplete:
    boolean;
};


export type CourseCoverageProgress = {
  completedSkills:
    number;

  totalSkills:
    number;

  progressPct:
    number;
};


function normaliseConceptCode(
  value:
    unknown
): string {
  return typeof value ===
    "string"
    ? value
        .trim()
        .toUpperCase()
    : "";
}


export function getCoverageCategoryEntries(
  courseId:
    CourseId
): Array<
  [
    string,
    SkillLike[],
  ]
> {
  const courseConfig =
    getCourseAssessmentConfigById(
      courseId
    );


  const skillTree =
    courseConfig.skillTree;


  if (
    !skillTree
  ) {
    throw new Error(
      `Course "${courseId}" does not define a skill tree.`
    );
  }


  return Object.entries(
    skillTree
  ) as Array<
    [
      string,
      SkillLike[],
    ]
  >;
}


export function getCategoryAccent(
  categoryName:
    string
): string {
  const name =
    categoryName.toLowerCase();


  if (
    name.includes(
      "numerical"
    )
  ) {
    return "rgba(96,165,250,0.92)";
  }


  if (
    name.includes(
      "algebra"
    )
  ) {
    return "rgba(196,181,253,0.92)";
  }


  if (
    name.includes(
      "geometric"
    )
  ) {
    return "rgba(74,222,128,0.92)";
  }


  if (
    name.includes(
      "trigon"
    )
  ) {
    return "rgba(250,204,21,0.92)";
  }


  if (
    name.includes(
      "stat"
    )
  ) {
    return "rgba(244,114,182,0.92)";
  }


  return "rgba(148,163,184,0.92)";
}


export function getAllCoverageSkills(
  courseId:
    CourseId
): CoverageSkillRecord[] {
  return getCoverageCategoryEntries(
    courseId
  ).flatMap(
    ([
      categoryName,
      skills,
    ]) =>
      skills.map(
        (
          skill
        ) => ({
          categoryName,
          skill,
        })
      )
  );
}


export function getCoverageSkillById(
  courseId:
    CourseId,

  skillId:
    string | null
): CoverageSkillRecord | null {
  if (
    !skillId
  ) {
    return null;
  }


  return (
    getAllCoverageSkills(
      courseId
    ).find(
      (
        entry
      ) =>
        entry.skill.id ===
        skillId
    ) ??
    null
  );
}


export function getCoverageConceptById(
  courseId:
    CourseId,

  conceptId:
    string | null
): CoverageConceptRecord | null {
  if (
    !conceptId
  ) {
    return null;
  }


  for (
    const entry
    of getAllCoverageSkills(
      courseId
    )
  ) {
    const concept =
      entry.skill.concepts.find(
        (
          item
        ) =>
          item.id ===
          conceptId
      );


    if (
      concept
    ) {
      return {
        categoryName:
          entry.categoryName,

        skill:
          entry.skill,

        concept,
      };
    }
  }


  return null;
}


/**
 * Returns the specification concepts that should
 * actually count toward teaching coverage.
 *
 * Some Course definitions contain an umbrella
 * concept as well as more precise descendants:
 *
 * N5.1
 *   N5.1.1
 *   N5.1.2
 *   N5.1.3
 *
 * In that situation N5.1 is a structural parent,
 * not an additional sixth thing that must be
 * separately ticked.
 *
 * Therefore only leaf concepts are trackable.
 */
export function getTrackableConcepts(
  skill:
    SkillLike
): Concept[] {
  const concepts =
    Array.isArray(
      skill.concepts
    )
      ? skill.concepts
      : [];


  if (
    concepts.length <=
    1
  ) {
    return concepts;
  }


  return concepts.filter(
    (
      concept
    ) => {
      const conceptCode =
        normaliseConceptCode(
          concept.code
        );


      if (
        !conceptCode
      ) {
        return true;
      }


      const hasDescendant =
        concepts.some(
          (
            candidate
          ) => {
            if (
              candidate.id ===
              concept.id
            ) {
              return false;
            }


            const candidateCode =
              normaliseConceptCode(
                candidate.code
              );


            return candidateCode.startsWith(
              `${conceptCode}.`
            );
          }
        );


      return !hasDescendant;
    }
  );
}


export function getTrackableConceptIds(
  skill:
    SkillLike
): string[] {
  return getTrackableConcepts(
    skill
  ).map(
    (
      concept
    ) =>
      concept.id
  );
}


export function getAllTrackableConceptIds(
  courseId:
    CourseId
): string[] {
  return getAllCoverageSkills(
    courseId
  ).flatMap(
    (
      entry
    ) =>
      getTrackableConceptIds(
        entry.skill
      )
  );
}


export function normaliseCompletedConceptIdsForCourse(
  courseId:
    CourseId,

  completedConceptIds:
    string[]
): string[] {
  const allowedConceptIds =
    new Set(
      getAllTrackableConceptIds(
        courseId
      )
    );


  return Array.from(
    new Set(
      completedConceptIds.filter(
        (
          conceptId
        ) =>
          typeof conceptId ===
            "string" &&
          conceptId.trim()
            .length >
            0 &&
          allowedConceptIds.has(
            conceptId
          )
      )
    )
  );
}


/**
 * Used when loading a historical Class record
 * which predates concept-level coverage.
 *
 * A previously completed parent skill is expanded
 * to all of its currently trackable leaf concepts.
 */
export function getCompletedConceptIdsForSkillIds(
  courseId:
    CourseId,

  completedSkillIds:
    string[]
): string[] {
  const completedSkillIdSet =
    new Set(
      completedSkillIds
    );


  const conceptIds =
    getAllCoverageSkills(
      courseId
    ).flatMap(
      (
        entry
      ) =>
        completedSkillIdSet.has(
          entry.skill.id
        )
          ? getTrackableConceptIds(
              entry.skill
            )
          : []
    );


  return Array.from(
    new Set(
      conceptIds
    )
  );
}


export function getSkillCoverage(
  skill:
    SkillLike,

  completedConceptIds:
    string[],

  fallbackCompletedSkillIds:
    string[] = []
): CoverageProgress {
  const trackableConcepts =
    getTrackableConcepts(
      skill
    );


  /**
   * Course definitions should normally provide
   * concepts. This fallback preserves compatibility
   * for a skill that does not yet have any.
   */
  if (
    trackableConcepts.length ===
    0
  ) {
    const complete =
      fallbackCompletedSkillIds.includes(
        skill.id
      );


    return {
      completed:
        complete
          ? 1
          : 0,

      total:
        1,

      progressPct:
        complete
          ? 100
          : 0,

      isComplete:
        complete,
    };
  }


  const completedConceptIdSet =
    new Set(
      completedConceptIds
    );


  const completed =
    trackableConcepts.filter(
      (
        concept
      ) =>
        completedConceptIdSet.has(
          concept.id
        )
    ).length;


  const total =
    trackableConcepts.length;


  return {
    completed,

    total,

    progressPct:
      total >
      0
        ? (
            completed /
            total
          ) *
          100
        : 0,

    isComplete:
      completed ===
      total,
  };
}


export function getCategoryCoverage(
  categorySkills:
    SkillLike[],

  completedConceptIds:
    string[],

  fallbackCompletedSkillIds:
    string[] = []
): CoverageProgress {
  const progress =
    categorySkills.map(
      (
        skill
      ) =>
        getSkillCoverage(
          skill,
          completedConceptIds,
          fallbackCompletedSkillIds
        )
    );


  const completed =
    progress.reduce(
      (
        total,
        item
      ) =>
        total +
        item.completed,
      0
    );


  const total =
    progress.reduce(
      (
        sum,
        item
      ) =>
        sum +
        item.total,
      0
    );


  return {
    completed,

    total,

    progressPct:
      total >
      0
        ? (
            completed /
            total
          ) *
          100
        : 0,

    isComplete:
      total >
        0 &&
      completed ===
        total,
  };
}


/**
 * Rebuilds the high-level completedSkillIds metric
 * from leaf concept coverage.
 *
 * This keeps the useful "36 / 47 skills covered"
 * headline while allowing partially taught skills
 * beneath it.
 */
export function deriveCompletedSkillIdsFromConcepts(
  courseId:
    CourseId,

  completedConceptIds:
    string[],

  fallbackCompletedSkillIds:
    string[] = []
): string[] {
  return getAllCoverageSkills(
    courseId
  )
    .filter(
      (
        entry
      ) =>
        getSkillCoverage(
          entry.skill,
          completedConceptIds,
          fallbackCompletedSkillIds
        ).isComplete
    )
    .map(
      (
        entry
      ) =>
        entry.skill.id
    );
}


export function getCourseCoverage(
  courseId:
    CourseId,

  completedConceptIds:
    string[],

  fallbackCompletedSkillIds:
    string[] = []
): CourseCoverageProgress {
  const allSkills =
    getAllCoverageSkills(
      courseId
    );


  const completedSkills =
    deriveCompletedSkillIdsFromConcepts(
      courseId,
      completedConceptIds,
      fallbackCompletedSkillIds
    );


  const totalSkills =
    allSkills.length;


  return {
    completedSkills:
      completedSkills.length,

    totalSkills,

    progressPct:
      totalSkills >
      0
        ? (
            completedSkills.length /
            totalSkills
          ) *
          100
        : 0,
  };
}


export function getSkillCode(
  skill:
    SkillLike
): string {
  if (
    typeof skill.code ===
      "string" &&
    skill.code.trim()
  ) {
    return skill.code.trim();
  }


  const idMatch =
    skill.id.match(
      /-([a-z]\d+)-/i
    );


  if (
    idMatch?.[1]
  ) {
    return idMatch[
      1
    ].toUpperCase();
  }


  const fallbackMatch =
    skill.id.match(
      /^([a-z]\d+)/i
    );


  if (
    fallbackMatch?.[1]
  ) {
    return fallbackMatch[
      1
    ].toUpperCase();
  }


  return "";
}


export function getSkillTitle(
  skill:
    SkillLike
): string {
  if (
    typeof skill.title ===
      "string" &&
    skill.title.trim()
  ) {
    return skill.title.trim();
  }


  if (
    typeof skill.label ===
      "string" &&
    skill.label.trim()
  ) {
    return skill.label.trim();
  }


  if (
    typeof skill.name ===
      "string" &&
    skill.name.trim()
  ) {
    return skill.name.trim();
  }


  const concepts =
    Array.isArray(
      skill.concepts
    )
      ? skill.concepts
      : [];


  const firstShortLabel =
    concepts.find(
      (
        concept
      ) =>
        typeof concept.shortLabel ===
          "string" &&
        concept.shortLabel.trim()
    )?.shortLabel;


  if (
    firstShortLabel?.trim()
  ) {
    const cleaned =
      firstShortLabel
        .replace(
          /^Factorising\s*-\s*/i,
          ""
        )
        .replace(
          /^Algebraic Fractions\s*-\s*/i,
          ""
        )
        .trim();


    if (
      cleaned
    ) {
      return cleaned;
    }
  }


  const idParts =
    skill.id.split(
      "-"
    );


  if (
    idParts.length >=
    3
  ) {
    return toTitleCase(
      idParts
        .slice(
          2
        )
        .join(
          " "
        )
    );
  }


  return toTitleCase(
    skill.id.replace(
      /-/g,
      " "
    )
  );
}


export function getSkillConceptSummary(
  skill:
    SkillLike
): string {
  const concepts =
    Array.isArray(
      skill.concepts
    )
      ? skill.concepts
      : [];


  if (
    concepts.length ===
    0
  ) {
    return "Click to view skill details";
  }


  return concepts
    .map(
      (
        concept
      ) => {
        const code =
          concept.code
            ?.trim();


        const label =
          concept.shortLabel
            ?.trim() ||
          concept.label
            ?.trim() ||
          "Unnamed concept";


        return code
          ? `${code} ${label}`
          : label;
      }
    )
    .join(
      "\n"
    );
}


export function getConceptBodyLines(
  concept:
    Concept
): string[] {
  const code =
    concept.code
      ?.trim()
      .toUpperCase() ??
    "";


  const label =
    concept.label
      ?.trim();


  const lines:
    string[] = [];


  if (
    label
  ) {
    lines.push(
      label
    );
  }


  const mappedExamples =
    getMappedConceptExamples(
      code
    );


  for (
    const line
    of mappedExamples
  ) {
    if (
      !lines.includes(
        line
      )
    ) {
      lines.push(
        line
      );
    }
  }


  if (
    lines.length ===
    0
  ) {
    lines.push(
      "More example guidance can be added here later."
    );
  }


  return lines;
}


function getMappedConceptExamples(
  code:
    string
): string[] {
  switch (
    code
  ) {
    case "N1.1":
      return [
        "√12 = 2√3",
        "√50 = 5√2",
      ];


    case "N1.2":
      return [
        "3/√5 = 3√5/5",
        "2/(√3 + 1)",
      ];


    case "N2.1":
      return [
        "a³ × a⁵",
        "x⁷ ÷ x²",
      ];


    case "N2.2":
      return [
        "(ab)³",
        "(2x)⁴",
      ];


    case "N2.3":
      return [
        "(x³)²",
        "(a²)⁵",
      ];


    case "N2.4":
      return [
        "16^(1/2)",
        "27^(2/3)",
      ];


    case "N3.1":
      return [
        "0.004781 to 2 significant figures",
        "4839 to 3 significant figures",
      ];


    case "N5.1.1":
      return [
        "3/4 + 2/3",
        "5/8 + 7/12",
      ];


    case "N5.1.2":
      return [
        "5/6 - 1/4",
        "7/10 - 2/15",
      ];


    case "N5.1.3":
      return [
        "3/5 × 10/21",
        "7/8 × 4/15",
      ];


    case "N5.1.4":
      return [
        "3/4 ÷ 5/8",
        "7/9 ÷ 14/15",
      ];


    case "N5.1.5":
      return [
        "1/2 + 3/4 × 2/5",
        "(5/6 - 1/3) ÷ 3/4",
      ];


    case "A1.1":
      return [
        "a(bx + c) + d(ex + f)",
      ];


    case "A1.2":
      return [
        "ax(bx + c)",
      ];


    case "A1.3":
      return [
        "(ax + b)(cx + d)",
      ];


    case "A2.1":
      return [
        "6x + 9 = 3(2x + 3)",
      ];


    case "A2.2":
      return [
        "x² - 9 = (x - 3)(x + 3)",
      ];


    default:
      return [];
  }
}


function toTitleCase(
  value:
    string
): string {
  return value
    .split(
      " "
    )
    .filter(
      Boolean
    )
    .map(
      (
        part
      ) =>
        part
          .charAt(
            0
          )
          .toUpperCase() +
        part.slice(
          1
        )
    )
    .join(
      " "
    );
}