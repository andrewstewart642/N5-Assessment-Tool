"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";

type Props = {
  /**
   * A stable key for this measured item (question id is perfect)
   */
  id: string;

  /**
   * Called whenever the element's height changes.
   * Height is in pixels.
   */
  onMeasure: (id: string, heightPx: number) => void;

  /**
   * Optional: extra vertical padding you want included in the measurement
   * (usually keep 0)
   */
  extraPx?: number;

  children: React.ReactNode;
};

/**
 * Wrap any question block in this and we can measure its rendered height
 * (including KaTeX / wrapping / fonts) using ResizeObserver.
 *
 * Key stability features:
 * - Dedupes repeated measurements
 * - Ignores tiny jitter (<= 1px)
 * - Batches updates into RAF
 * - Double-check on mount (KaTeX/fonts can settle one frame later)
 */
export default function MeasureBox({ id, onMeasure, extraPx = 0, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const rafRef2 = useRef<number | null>(null);

  const lastHeightRef = useRef<number | null>(null);

  const measureNow = () => {
    const el = ref.current;
    if (!el) return;

    // offsetHeight is usually the most stable for layout measurement
    const next = Math.max(0, Math.round(el.offsetHeight + extraPx));

    const prev = lastHeightRef.current;

    // First measurement always emits
    if (typeof prev !== "number") {
      lastHeightRef.current = next;
      onMeasure(id, next);
      return;
    }

    // Ignore tiny jitter to prevent flicker loops
    if (Math.abs(prev - next) <= 1) return;

    lastHeightRef.current = next;
    onMeasure(id, next);
  };

  const scheduleMeasure = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      measureNow();
    });
  };

  // Measure ASAP after layout on mount / when id changes
  useLayoutEffect(() => {
    // reset last height when the identity changes
    lastHeightRef.current = null;

    // 1) immediate layout measurement
    measureNow();

    // 2) one more frame later (fonts/KaTeX can change height after first layout)
    if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
    rafRef2.current = requestAnimationFrame(() => {
      measureNow();
    });

    return () => {
      if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
      rafRef2.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      scheduleMeasure();
    });

    ro.observe(el);

    return () => {
      ro.disconnect();

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      if (rafRef2.current) cancelAnimationFrame(rafRef2.current);
      rafRef2.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {children}
    </div>
  );
}