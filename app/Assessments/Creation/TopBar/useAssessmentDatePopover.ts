
import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

type UseAssessmentDatePopoverArgs = {
  open:
    boolean;

  setOpen:
    Dispatch<
      SetStateAction<boolean>
    >;

  fieldRef:
    RefObject<
      HTMLDivElement | null
    >;
};

export function useAssessmentDatePopover({
  open,
  setOpen,
  fieldRef,
}: UseAssessmentDatePopoverArgs) {
  useEffect(
    () => {
      if (!open) {
        return;
      }

      const handleMouseDown =
        (
          event:
            MouseEvent
        ) => {
          const field =
            fieldRef.current;

          if (!field) {
            return;
          }

          if (
            field.contains(
              event.target as Node
            )
          ) {
            return;
          }

          setOpen(
            false
          );
        };

      document.addEventListener(
        "mousedown",
        handleMouseDown
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleMouseDown
        );
      };
    },
    [
      open,
      setOpen,
      fieldRef,
    ]
  );
}