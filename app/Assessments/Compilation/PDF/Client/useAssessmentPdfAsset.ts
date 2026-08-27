"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  SavedAssessment,
} from "@/app/Assessments/SavedAssessments/SavedAssessment";

import {
  getAssessmentPdfAsset,
  type AssessmentPdfAsset,
} from "./AssessmentPdfAssetCache";


export type AssessmentPdfAssetState =
  | {
      status:
        "idle";

      asset:
        null;

      error:
        null;
    }
  | {
      status:
        "loading";

      asset:
        null;

      error:
        null;
    }
  | {
      status:
        "ready";

      asset:
        AssessmentPdfAsset;

      error:
        null;
    }
  | {
      status:
        "error";

      asset:
        null;

      error:
        string;
    };


export function useAssessmentPdfAsset({
  savedAssessment,
  enabled =
    true,
}: {
  savedAssessment:
    SavedAssessment;

  enabled?:
    boolean;
}): AssessmentPdfAssetState {
  const [
    state,
    setState,
  ] =
    useState<AssessmentPdfAssetState>({
      status:
        "idle",

      asset:
        null,

      error:
        null,
    });


  useEffect(() => {
    let cancelled =
      false;


    if (
      !enabled
    ) {
      setState({
        status:
          "idle",

        asset:
          null,

        error:
          null,
      });

      return () => {
        cancelled =
          true;
      };
    }


    setState({
      status:
        "loading",

      asset:
        null,

      error:
        null,
    });


    void getAssessmentPdfAsset(
      savedAssessment
    ).then(
      (
        asset
      ) => {
        if (
          cancelled
        ) {
          return;
        }


        setState({
          status:
            "ready",

          asset,

          error:
            null,
        });
      },
      (
        error
      ) => {
        if (
          cancelled
        ) {
          return;
        }


        setState({
          status:
            "error",

          asset:
            null,

          error:
            error instanceof
              Error
              ? error.message
              : "Unable to load assessment preview.",
        });
      }
    );


    return () => {
      cancelled =
        true;
    };
  }, [
    enabled,
    savedAssessment,
    savedAssessment.id,
    savedAssessment.updatedAt,
  ]);


  return state;
}