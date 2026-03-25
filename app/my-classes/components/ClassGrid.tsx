"use client";

import ClassTile from "./ClassTile";
import {
  COURSE_OPTIONS,
  type CourseOption,
  type SchoolClass,
} from "../types/Classes";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  classesByCourse: Map<CourseOption, SchoolClass[]>;
  theme: AppTheme;
};

export default function ClassGrid({ classesByCourse, theme }: Props) {
  const totalClasses = COURSE_OPTIONS.reduce((count, course) => {
    return count + (classesByCourse.get(course)?.length ?? 0);
  }, 0);

  if (totalClasses === 0) {
    return (
      <div
        style={{
          maxWidth: 1200,
          margin: "24px auto 0 auto",
          border: `1px solid ${theme.borderSubtle}`,
          borderRadius: 22,
          padding: 28,
          background: theme.cardBg,
          color: theme.textPrimary,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          No classes yet
        </div>

        <div
          style={{
            fontSize: 15,
            lineHeight: 1.45,
            color: theme.textSecondary,
          }}
        >
          Add your first class to start organising courses and coverage.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "24px auto 0 auto",
        display: "grid",
        gap: 24,
      }}
    >
      {COURSE_OPTIONS.map((course) => {
        const courseClasses = classesByCourse.get(course) ?? [];
        if (courseClasses.length === 0) return null;

        return (
          <section
            key={course}
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: theme.textPrimary,
                }}
              >
                {course}
              </div>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.35,
                  color: theme.textMuted,
                }}
              >
                {courseClasses.length} class{courseClasses.length === 1 ? "" : "es"}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {courseClasses.map((schoolClass) => (
                <ClassTile
                  key={schoolClass.id}
                  schoolClass={schoolClass}
                  theme={theme}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}