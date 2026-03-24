"use client";

import Link from "next/link";
import { useState } from "react";
import type { SchoolClass } from "../types/Classes";

type Props = {
  schoolClass: SchoolClass;
};

function getCourseAccent(course: SchoolClass["course"]) {
  if (course === "National 5 Maths") return "rgba(96,165,250,0.95)";
  if (course === "National 5 Applications") return "rgba(52,211,153,0.95)";
  return "rgba(196,181,253,0.95)";
}

export default function ClassTile({ schoolClass }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const accent = getCourseAccent(schoolClass.course);
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
        transform: isHovered ? "translateY(-3px) scale(1.012)" : "translateY(0) scale(1)",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background 160ms ease",
      }}
    >
      <div
        style={{
          position: "relative",
          minWidth: 0,
          border: `1px solid ${
            isHovered ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.08)"
          }`,
          borderRadius: 20,
          background: isHovered
            ? "rgba(255,255,255,0.055)"
            : "rgba(255,255,255,0.035)",
          padding: 18,
          boxShadow: isHovered
            ? "0 18px 36px rgba(0,0,0,0.24)"
            : "0 14px 30px rgba(0,0,0,0.16)",
          display: "grid",
          gap: 14,
          minHeight: 176,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            background: accent,
          }}
        />

        <div style={{ display: "grid", gap: 6 }}>
          <div
            style={{
              fontSize: 22,
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#e5eef8",
              paddingTop: 4,
            }}
          >
            {schoolClass.name}
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.35,
              color: "rgba(229,238,248,0.76)",
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
            color: "rgba(229,238,248,0.62)",
          }}
        >
          {metaParts.length ? metaParts.join(" • ") : "No extra details yet"}
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            color: isHovered
              ? "rgba(229,238,248,0.92)"
              : "rgba(229,238,248,0.56)",
          }}
        >
          Open class →
        </div>
      </div>
    </Link>
  );
}