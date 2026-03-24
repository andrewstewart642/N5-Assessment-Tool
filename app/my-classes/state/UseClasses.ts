"use client";

import { useEffect, useMemo, useState } from "react";
import type { CourseOption, LevelOption, SchoolClass } from "../types/Classes";

const STORAGE_KEY = "n5-my-classes";

function makeClassId(): string {
  return `class-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortClasses(items: SchoolClass[]): SchoolClass[] {
  return [...items].sort((a, b) => {
    if (a.course !== b.course) {
      return a.course.localeCompare(b.course);
    }

    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
}

function normaliseClass(candidate: unknown): SchoolClass | null {
  if (!candidate || typeof candidate !== "object") return null;

  const item = candidate as Partial<SchoolClass>;

  if (
    typeof item.id !== "string" ||
    typeof item.name !== "string" ||
    typeof item.course !== "string" ||
    typeof item.level !== "string" ||
    typeof item.teacher !== "string" ||
    typeof item.createdAt !== "number"
  ) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    course: item.course as CourseOption,
    level: item.level as LevelOption,
    teacher: item.teacher,
    createdAt: item.createdAt,
    updatedAt:
      typeof item.updatedAt === "number" ? item.updatedAt : item.createdAt,
    completedSkillIds: Array.isArray(item.completedSkillIds)
      ? item.completedSkillIds.filter(
          (skillId): skillId is string => typeof skillId === "string"
        )
      : [],
  };
}

type AddClassArgs = {
  name: string;
  course: CourseOption;
  level: LevelOption;
  teacher: string;
};

type UpdateCompletedSkillsArgs = {
  classId: string;
  completedSkillIds: string[];
};

export function UseClasses() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!Array.isArray(parsed)) {
        setHasLoaded(true);
        return;
      }

      const safeClasses = parsed
        .map(normaliseClass)
        .filter((item): item is SchoolClass => item !== null);

      setClasses(sortClasses(safeClasses));
    } catch {
      setClasses([]);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes, hasLoaded]);

  const classesByCourse = useMemo(() => {
    const grouped = new Map<CourseOption, SchoolClass[]>();

    for (const schoolClass of classes) {
      const current = grouped.get(schoolClass.course) ?? [];
      current.push(schoolClass);
      grouped.set(schoolClass.course, current);
    }

    return grouped;
  }, [classes]);

  function addClass({ name, course, level, teacher }: AddClassArgs) {
    const trimmedName = name.trim();
    const trimmedTeacher = teacher.trim();

    if (!trimmedName) return;

    const now = Date.now();

    const nextClass: SchoolClass = {
      id: makeClassId(),
      name: trimmedName,
      course,
      level,
      teacher: trimmedTeacher,
      createdAt: now,
      updatedAt: now,
      completedSkillIds: [],
    };

    setClasses((current) => sortClasses([...current, nextClass]));
  }

  function deleteClass(classId: string) {
    setClasses((current) => current.filter((item) => item.id !== classId));
  }

  function updateCompletedSkills({
    classId,
    completedSkillIds,
  }: UpdateCompletedSkillsArgs) {
    const cleanSkillIds = Array.from(
      new Set(completedSkillIds.filter((skillId) => skillId.trim().length > 0))
    );

    setClasses((current) =>
      current.map((item) =>
        item.id === classId
          ? {
              ...item,
              completedSkillIds: cleanSkillIds,
              updatedAt: Date.now(),
            }
          : item
      )
    );
  }

  function getClassById(classId: string): SchoolClass | null {
    return classes.find((item) => item.id === classId) ?? null;
  }

  return {
    classes,
    classesByCourse,
    hasLoaded,
    addClass,
    deleteClass,
    updateCompletedSkills,
    getClassById,
  };
}