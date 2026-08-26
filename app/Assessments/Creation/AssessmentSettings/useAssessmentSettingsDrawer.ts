
import {
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";

type UseAssessmentSettingsDrawerArgs = {
  open:
    boolean;

  setOpen:
    Dispatch<
      SetStateAction<boolean>
    >;
};

export function useAssessmentSettingsDrawer({
  open,
  setOpen,
}: UseAssessmentSettingsDrawerArgs) {
  useEffect(
    () => {
      document.body.style.overflow =
        open
          ? "hidden"
          : "";

      return () => {
        document.body.style.overflow =
          "";
      };
    },
    [
      open,
    ]
  );

  /*
   * Transitional compatibility bridge.
   *
   * The global application shell currently
   * opens Assessment Settings through this
   * historical browser event.
   *
   * The final architecture should replace
   * this with an explicit dependency once
   * the surrounding application shell is
   * migrated.
   */
  useEffect(
    () => {
      const handleOpen =
        () => {
          setOpen(
            true
          );
        };

      window.addEventListener(
        "open-builder-settings",
        handleOpen
      );

      return () => {
        window.removeEventListener(
          "open-builder-settings",
          handleOpen
        );
      };
    },
    [
      setOpen,
    ]
  );
}