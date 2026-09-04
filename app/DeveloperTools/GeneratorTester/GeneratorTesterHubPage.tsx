"use client";

import { useState } from "react";

import A7GeneratorTesterPage from "./A7GeneratorTesterPage";
import A7SqaGeneratorTesterPage from "./A7SqaGeneratorTesterPage";
import G1GeneratorTesterPage from "./G1GeneratorTesterPage";
import GeneratorTesterPage from "./GeneratorTesterPage";
import N2GeneratorTesterPage from "./N2GeneratorTesterPage";

type TesterTarget = "N2" | "G1" | "A7" | "A8" | "A7_DEBUG";

const TARGETS: readonly { value: TesterTarget; label: string; description: string }[] = [
  { value: "N2", label: "N2 · Indices", description: "Canonical N2 question + answer generator quality gate" },
  { value: "G1", label: "G1 · Straight-line gradient", description: "G1 question, answer and generated graph stress tester" },
  { value: "A7", label: "A7 · Linear equations", description: "Source-calibrated A7 generator tester" },
  { value: "A8", label: "A8 · Straight-line systems", description: "A8 generator and graph tester" },
  { value: "A7_DEBUG", label: "A7 · Debug view", description: "Lower-level A7 diagnostic surface" },
] as const;

export default function GeneratorTesterHubPage() {
  const [target, setTarget] = useState<TesterTarget>("N2");
  const selected = TARGETS.find((entry) => entry.value === target) ?? TARGETS[0];

  return (
    <div style={{ minHeight: "100vh", background: "#05070b" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "end",
          gap: 12,
          flexWrap: "wrap",
          padding: "10px 16px",
          borderBottom: "1px solid rgba(148,163,184,0.20)",
          background: "rgba(5,7,11,0.96)",
          backdropFilter: "blur(8px)",
          color: "#f8fafc",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ minWidth: 230 }}>
          <div style={{ fontSize: 14, fontWeight: 850 }}>Developer Generator Tester</div>
          <div style={{ marginTop: 2, color: "#64748b", fontSize: 9.5 }}>One runtime surface for generator validation.</div>
        </div>

        <label style={{ display: "grid", gap: 4, color: "#cbd5e1", fontSize: 10, fontWeight: 700 }}>
          Generator
          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as TesterTarget)}
            style={{
              height: 32,
              minWidth: 250,
              padding: "0 9px",
              border: "1px solid rgba(148,163,184,0.28)",
              borderRadius: 7,
              background: "#111827",
              color: "#f8fafc",
              fontSize: 11,
            }}
          >
            {TARGETS.map((entry) => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
          </select>
        </label>

        <div style={{ paddingBottom: 4, color: "#94a3b8", fontSize: 10 }}>{selected.description}</div>
      </header>

      {target === "N2" ? <N2GeneratorTesterPage /> : null}
      {target === "G1" ? <G1GeneratorTesterPage /> : null}
      {target === "A7" ? <A7SqaGeneratorTesterPage /> : null}
      {target === "A8" ? <GeneratorTesterPage /> : null}
      {target === "A7_DEBUG" ? <A7GeneratorTesterPage /> : null}
    </div>
  );
}
