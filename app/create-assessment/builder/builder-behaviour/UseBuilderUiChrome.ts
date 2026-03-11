import { useEffect } from "react";

type UseBuilderUiChromeArgs = {
  builderCalendarOpen: boolean;
  setBuilderCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  builderDateFieldRef: React.RefObject<HTMLDivElement | null>;

  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useBuilderUiChrome({
  builderCalendarOpen,
  setBuilderCalendarOpen,
  builderDateFieldRef,
  settingsOpen,
  setSettingsOpen,
}: UseBuilderUiChromeArgs) {
  useEffect(() => {
    if (!builderCalendarOpen) return;

    function handleMouseDown(event: MouseEvent) {
      if (!builderDateFieldRef.current) return;
      if (builderDateFieldRef.current.contains(event.target as Node)) return;
      setBuilderCalendarOpen(false);
    }

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [builderCalendarOpen, builderDateFieldRef, setBuilderCalendarOpen]);

  useEffect(() => {
    document.body.style.overflow = settingsOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [settingsOpen]);

  useEffect(() => {
    const onOpen = () => setSettingsOpen(true);

    window.addEventListener("open-builder-settings", onOpen);

    return () => {
      window.removeEventListener("open-builder-settings", onOpen);
    };
  }, [setSettingsOpen]);
}