export default function MyClassesPage() {
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
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 22,
          padding: 24,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>My Classes</h1>
        <p style={{ color: "rgba(229,238,248,0.72)" }}>
          Placeholder page for class organisation and future class-linked tools.
        </p>
      </div>
    </main>
  );
}