"use client";

type Props = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  currentPage: number;
  totalPages: number;
};

export default function ZoomOverlay({
  zoom,
  onZoomIn,
  onZoomOut,
  currentPage,
  totalPages,
}: Props) {
  const percent = Math.round(zoom * 100);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 40,

        display: "flex",
        alignItems: "center",
        gap: 14,

        padding: "6px 12px",
        borderRadius: 12,

        background: "rgba(15,23,42,0.82)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",

        border: "1px solid rgba(255,255,255,0.12)",
        color: "rgba(255,255,255,0.92)",

        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {/* Page counter */}
      <div
        style={{
          opacity: 0.7,
          minWidth: 42,
          textAlign: "right",
        }}
      >
        {currentPage} / {totalPages}
      </div>

      {/* Zoom out */}
      <button
        onClick={onZoomOut}
        style={{
          border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.85)",
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
        }}
      >
        −
      </button>

      {/* Zoom percentage (MAIN ELEMENT) */}
      <div
        style={{
          minWidth: 42,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 900,
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {percent}%
      </div>

      {/* Zoom in */}
      <button
        onClick={onZoomIn}
        style={{
          border: "none",
          background: "transparent",
          color: "rgba(255,255,255,0.85)",
          fontSize: 14,
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
        }}
      >
        +
      </button>
    </div>
  );
}