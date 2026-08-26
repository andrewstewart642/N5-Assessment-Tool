"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const FLASH_DURATION_MS =
  3200;

const MAX_QUALITY_NOTES =
  10;

export function useAssessmentCreationFeedback() {
  const [
    qualityNotes,
    setQualityNotes,
  ] =
    useState<string[]>(
      []
    );

  const [
    flashWarning,
    setFlashWarning,
  ] =
    useState<
      string | null
    >(
      null
    );

  const flashTimerRef =
    useRef<
      number | null
    >(
      null
    );

  const pushFlash =
    useCallback(
      (
        message:
          string
      ) => {
        setFlashWarning(
          message
        );

        if (
          flashTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            flashTimerRef.current
          );

          flashTimerRef.current =
            null;
        }

        flashTimerRef.current =
          window.setTimeout(
            () => {
              setFlashWarning(
                null
              );

              flashTimerRef.current =
                null;
            },
            FLASH_DURATION_MS
          );
      },
      []
    );

  const addQualityNote =
    useCallback(
      (
        message:
          string
      ) => {
        setQualityNotes(
          (
            previous
          ) =>
            [
              message,
              ...previous,
            ].slice(
              0,
              MAX_QUALITY_NOTES
            )
        );
      },
      []
    );

  useEffect(
    () => {
      return () => {
        if (
          flashTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            flashTimerRef.current
          );

          flashTimerRef.current =
            null;
        }
      };
    },
    []
  );

  return {
    qualityNotes,
    flashWarning,

    pushFlash,
    addQualityNote,
  };
}