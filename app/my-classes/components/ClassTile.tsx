"use client";

import Link from "next/link";
import { useState } from "react";
import type { SchoolClass } from "../types/Classes";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  schoolClass: SchoolClass;
  theme: AppTheme;
};

function getCourseAccent(course: SchoolClass["course"], theme: AppTheme) {
  if (course === "National 5 Maths") return theme.skillNumerical;
  if (course === "National 5 Applications") return theme.skillGeometric;
  return theme.skillAlgebraic;
}

export default function ClassTile({ schoolClass, theme }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const accent = getCourseAccent(schoolClass.course, theme);
  const metaParts = [schoolClass.level, schoolClass.teacher].filter(Boolean);

  return (
    <Link
      href={`/my-classes/${schoolClass.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
        transform: isHovered
          ? "translateY(-3px) scale(1.012)"
          : "translateY(0) scale(1)",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease",
      }}
    >
      <div
        style={{
          minWidth: 0,
          border: `1px solid ${
            isHovered ? theme.borderStrong : theme.borderSubtle
          }`,
          borderRadius: 20,
          background: isHovered ? theme.cardBgHover : theme.cardBg,
          padding: 18,
          boxShadow: isHovered ? theme.shadowStrong : theme.shadow,
          display: "grid",
          gap: 14,
          minHeight: 176,
        }}
      >
        <div
          style={{
            width: 72,
            height: 10,
            borderRadius: 999,
            background: accent,
            boxShadow: isHovered ? `0 0 0 1px ${theme.borderSubtle}` : "none",
          }}
        />

        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.15,
              fontWeight: 700,
              color: theme.textPrimary,
            }}
          >
            {schoolClass.name}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.35,
              color: theme.textSecondary,
            }}
          >
            {schoolClass.course}
          </div>
        </div>

        <div
          style={{
            minHeight: 20,
            fontSize: 13,
            lineHeight: 1.35,
            color: theme.textMuted,
          }}
        >
          {metaParts.length ? metaParts.join(" • ") : "No extra details yet"}
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1.2,
            color: accent,
            opacity: isHovered ? 1 : 0.88,
            transition: "opacity 160ms ease",
          }}
        >
          Open class →
        </div>
      </div>
    </Link>
  );
}