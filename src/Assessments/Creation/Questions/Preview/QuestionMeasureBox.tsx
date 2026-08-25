"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import type {
  ReactNode,
} from "react";

type QuestionMeasureBoxProps = {
  id:
    string;

  onMeasure: (
    id: string,
    heightPx: number
  ) => void;

  extraPx?:
    number;

  children:
    ReactNode;
};

export default function QuestionMeasureBox({
  id,
  onMeasure,
  extraPx = 0,
  children,
}: QuestionMeasureBoxProps) {
  const ref =
    useRef<HTMLDivElement | null>(
      null
    );

  const rafRef =
    useRef<number | null>(
      null
    );

  const secondRafRef =
    useRef<number | null>(
      null
    );

  const lastHeightRef =
    useRef<number | null>(
      null
    );

  const measureNow = () => {
    const element =
      ref.current;

    if (!element) {
      return;
    }

    const nextHeight =
      Math.max(
        0,
        Math.round(
          element.offsetHeight +
            extraPx
        )
      );

    const previousHeight =
      lastHeightRef.current;

    if (
      typeof previousHeight !==
      "number"
    ) {
      lastHeightRef.current =
        nextHeight;

      onMeasure(
        id,
        nextHeight
      );

      return;
    }

    if (
      Math.abs(
        previousHeight -
          nextHeight
      ) <= 1
    ) {
      return;
    }

    lastHeightRef.current =
      nextHeight;

    onMeasure(
      id,
      nextHeight
    );
  };

  const scheduleMeasure = () => {
    if (
      rafRef.current
    ) {
      cancelAnimationFrame(
        rafRef.current
      );
    }

    rafRef.current =
      requestAnimationFrame(
        () => {
          measureNow();
        }
      );
  };

  useLayoutEffect(
    () => {
      lastHeightRef.current =
        null;

      measureNow();

      if (
        secondRafRef.current
      ) {
        cancelAnimationFrame(
          secondRafRef.current
        );
      }

      secondRafRef.current =
        requestAnimationFrame(
          () => {
            measureNow();
          }
        );

      return () => {
        if (
          secondRafRef.current
        ) {
          cancelAnimationFrame(
            secondRafRef.current
          );
        }

        secondRafRef.current =
          null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [id]
  );

  useEffect(
    () => {
      const element =
        ref.current;

      if (!element) {
        return;
      }

      const resizeObserver =
        new ResizeObserver(
          () => {
            scheduleMeasure();
          }
        );

      resizeObserver.observe(
        element
      );

      return () => {
        resizeObserver.disconnect();

        if (
          rafRef.current
        ) {
          cancelAnimationFrame(
            rafRef.current
          );
        }

        rafRef.current =
          null;

        if (
          secondRafRef.current
        ) {
          cancelAnimationFrame(
            secondRafRef.current
          );
        }

        secondRafRef.current =
          null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [id]
  );

  return (
    <div
      ref={
        ref
      }
      style={{
        width:
          "100%",
      }}
    >
      {children}
    </div>
  );
}