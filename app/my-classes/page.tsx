"use client";

import { useState } from "react";

import Header from "./components/Header";
import ClassGrid from "./components/ClassGrid";
import AddClassModal from "./components/AddClassModal";
import { UseClasses } from "./state/UseClasses";
import type { CourseOption, LevelOption } from "./types/Classes";
import { useSettings } from "@/app/settings-bar/GlobalSettingsContext";

export default function MyClassesPage() {
  const { theme } = useSettings();
  const { classesByCourse, hasLoaded, addClass } = UseClasses();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [course, setCourse] = useState<CourseOption>("National 5 Maths");
  const [level, setLevel] = useState<LevelOption>("");
  const [teacher, setTeacher] = useState("");

  function openAddModal() {
    setIsAddModalOpen(true);
  }

  function closeAddModal() {
    setIsAddModalOpen(false);
    setClassName("");
    setCourse("National 5 Maths");
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