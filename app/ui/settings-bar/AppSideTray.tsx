"use client";

import { useEffect, useRef } from "react";
import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  open: boolean;
  onClose: () => void;
  theme: AppTheme;
  children: React.ReactNode;
};

export default function AppSideTray({
  open,
  onClose,
  theme,
  children,
}: Props) {
  const trayRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!open) return;
      if (!trayRef.current) return;
      if (trayRef.current.contains(event.target as Node)) return;
      onClose();
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: open ? "auto" : "none",
        zIndex: 1000,
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: open ? theme.overlay : "transparent",
          opacity: open ? 1 : 0,
          transition: "opacity 180ms ease",
        }}
      />

      {/* Tray */}
      <aside
        ref={trayRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(460px, calc(100vw - 24px))",
          maxWidth: "calc(100vw - 24px)",
          borderLeft: `1px solid ${theme.border}`,
          background: theme.panelBg,
          boxShadow: theme.shadow,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(104%)",
          transition: "transform 220ms ease",
        }}
      >
        {children}
      </aside>
    </div>
  );
}