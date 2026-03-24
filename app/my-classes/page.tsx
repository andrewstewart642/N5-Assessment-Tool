"use client";

import { useState } from "react";

import Header from "./components/Header";
import ClassGrid from "./components/ClassGrid";
import AddClassModal from "./components/AddClassModal";
import { UseClasses } from "./state/UseClasses";
import type { CourseOption, LevelOption } from "./types/Classes";

export default function MyClassesPage() {
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
        background: "#0b0f14",
        color: "#e5eef8",
        padding: 24,
        boxSizing: "border-box",
        fontFamily: "var(--app-ui-font-family)",
      }}
    >
      <Header onAddClass={openAddModal} />

      {hasLoaded ? (
        <ClassGrid classesByCourse={classesByCourse} />
      ) : (
        <div
          style={{
            maxWidth: 1200,
            margin: "24px auto 0 auto",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 22,
            padding: 24,
            background: "rgba(255,255,255,0.03)",
            color: "rgba(229,238,248,0.72)",
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
      />
    </main>
  );
}