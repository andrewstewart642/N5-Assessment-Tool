"use client";

import { useEffect, useState } from "react";

import Header from "./components/Header";
import ClassGrid from "./components/ClassGrid";
import AddClassModal from "./components/AddClassModal";
import { UseClasses } from "./state/UseClasses";
import type { CourseOption, LevelOption } from "./types/Classes";

import { getTheme } from "@/ui/AppTheme";
import {
  getSystemPrefersDark,
  isThemeModePreference,
  resolveThemeMode,
  THEME_MODE_STORAGE_KEY,
  type ResolvedThemeMode,
  type ThemeModePreference,
} from "@/ui/ThemeMode";

export default function MyClassesPage() {
  const [resolvedMode, setResolvedMode] = useState<ResolvedThemeMode>("dark");

  useEffect(() => {
    function readResolvedMode(): ResolvedThemeMode {
      if (typeof window === "undefined") return "dark";

      const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
      const preference: ThemeModePreference = isThemeModePreference(stored)
        ? stored
        : "system";

      return resolveThemeMode(preference, getSystemPrefersDark());
    }

    setResolvedMode(readResolvedMode());

    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      setResolvedMode(readResolvedMode());
    }

    window.addEventListener("storage", handleChange);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener("storage", handleChange);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const theme = getTheme(resolvedMode);

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
        background: theme.bgPrimary,
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
            border: `1px solid ${theme.borderSubtle}`,
            borderRadius: 22,
            padding: 24,
            background: theme.cardBg,
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