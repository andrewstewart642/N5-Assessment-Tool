export type CourseOption =
  | "National 5 Maths"
  | "National 5 Applications"
  | "Higher Maths";

export type LevelOption = "S3" | "S4" | "S5" | "S6" | "Mixed" | "";

export type SchoolClass = {
  id: string;
  name: string;
  course: CourseOption;
  level: LevelOption;
  teacher: string;
  createdAt: number;
  updatedAt: number;
  completedSkillIds: string[];
};

export const COURSE_OPTIONS: CourseOption[] = [
  "National 5 Maths",
  "National 5 Applications",
  "Higher Maths",
];

export const LEVEL_OPTIONS: LevelOption[] = [
  "",
  "S3",
  "S4",
  "S5",
  "S6",
  "Mixed",
];