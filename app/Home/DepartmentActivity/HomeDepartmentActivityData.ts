import type {
  CourseId,
} from "@/app/Courses/CourseTypes";


export type HomeDepartmentActivityItem = {
  id:
    string;

  timeLabel:
    string;

  person:
    string;

  action:
    string;

  subject:
    string;

  detail:
    string;

  courseId:
    CourseId;
};


export const HOME_DEPARTMENT_ACTIVITY:
  HomeDepartmentActivityItem[] = [
    {
      id:
        "sarah-fractions-homework",

      timeLabel:
        "Today",

      person:
        "Sarah",

      action:
        "started a draft",

      subject:
        "Fractions Homework",

      detail:
        "National 5 Maths · Homework",

      courseId:
        "N5_MATH",
    },

    {
      id:
        "billy-higher-prelim",

      timeLabel:
        "Today",

      person:
        "Billy",

      action:
        "began writing",

      subject:
        "Higher Maths Prelim",

      detail:
        "Higher Mathematics · Prelim",

      courseId:
        "HIGHER_MATH",
    },

    {
      id:
        "department-coverage-update",

      timeLabel:
        "Yesterday",

      person:
        "Sarah",

      action:
        "updated",

      subject:
        "4A1 course coverage",

      detail:
        "5 skills marked covered",

      courseId:
        "N5_MATH",
    },
  ];