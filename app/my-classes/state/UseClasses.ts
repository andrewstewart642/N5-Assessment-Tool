"use client";

import { useEffect, useMemo, useState } from "react";

import type { CourseOption, LevelOption, SchoolClass } from "../types/Classes";
import {
  buildNewSchoolClass,
  normaliseClass,
} from "./ClassNormalisation";
import {
  readMyClassesStorageValue,
  writeMyClassesStorageValue,
} from "./ClassStorageKeys";

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
      const raw = readMyClassesStorageValue();

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

    writeMyClassesStorageValue(JSON.stringify(classes));
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

    const nextClass = buildNewSchoolClass({
      id: makeClassId(),
      name: trimmedName,
      course,
      level,
      teacher: trimmedTeacher,
      createdAt: now,
    });

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