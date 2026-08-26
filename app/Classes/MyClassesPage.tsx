"use client";

import { useState } from "react";

import Header from "./Components/ClassesHeader";
import ClassGrid from "./Components/ClassGrid";
import AddClassModal from "./Components/AddClassModal";
import { useClasses } from "./State/useClasses";
import type { CourseOption, LevelOption } from "./ClassTypes";
import { useSettings } from "@/app/UI/Application/Settings/ApplicationSettings";
import { getDefaultClassCourseLabel } from "@/app/Courses/CourseCatalog";

export default function MyClassesPage() {
  const { theme } = useSettings();
  const { classesByCourse, hasLoaded, addClass } = useClasses();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [course, setCourse] = useState<CourseOption>(getDefaultClassCourseLabel());
  const [level, setLevel] = useState<LevelOption>("");
  const [teacher, setTeacher] = useState("");

  function openAddModal() {
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
    setClassName("");
    setCourse(getDefaultClassCourseLabel());
    setLevel("");
    setTeacher("");
  }

  function handleCreateClass() {
    if (!className.trim()) return;

    addClass({
      name: className,
      course,
      level,
      teacher,
    });

    closeAddModal();
  }

  return (
    <main
      style={{
        minHeight: "100%",
        background: theme.bgPage,
        color: theme.textPrimary,
        padding: 24,
        boxSizing: "border-box",
        fontFamily: "var(--app-ui-font-family)",
      }}
    >
      <Header onAddClass={openAddModal} theme={theme} />

      {hasLoaded ? (
        <ClassGrid classesByCourse={classesByCourse} theme={theme} />
      ) : (
        <div
          style={{
            maxWidth: 1200,
            margin: "24px auto 0 auto",
            border: `1px solid ${theme.borderStandard}`,
            borderRadius: 22,
            padding: 24,
            background: theme.bgSurface,
            color: theme.textMuted,
            fontSize: 15,
            lineHeight: 1.45,
          }}
        >
          Loading classes...
        </div>
      )}

      <AddClassModal
        open={isAddModalOpen}
        className={className}
        setClassName={setClassName}
        course={course}
        setCourse={setCourse}
        level={level}
        setLevel={setLevel}
        teacher={teacher}
        setTeacher={setTeacher}
        onClose={closeAddModal}
        onCreate={handleCreateClass}
        theme={theme}
      />
    </main>
  );
}