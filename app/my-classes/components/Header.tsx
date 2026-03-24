"use client";

type Props = {
  onAddClass: () => void;
};

export default function Header({ onAddClass }: Props) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        padding: 24,
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#e5eef8",
          }}
        >
          My Classes
        </h1>

        <p
          style={{
            margin: "8px 0 0 0",
            color: "rgba(229,238,248,0.72)",
            fontSize: 15,
            lineHeight: 1.45,
          }}
        >
          Organise classes by course and build assessments more quickly.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClass}
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          color: "#e5eef8",
          borderRadius: 14,
          padding: "11px 16px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1,
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
        }}
      >
        + Add Class
      </button>
    </div>
  );
}