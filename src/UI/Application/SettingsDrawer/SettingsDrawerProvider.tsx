"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SettingsDrawerContextValue = {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
};

const SettingsDrawerContext =
  createContext<SettingsDrawerContextValue | null>(null);

export function SettingsDrawerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function openSettings() {
    setIsSettingsOpen(true);
  }

  function closeSettings() {
    setIsSettingsOpen(false);
  }

  function toggleSettings() {
    setIsSettingsOpen((current) => !current);
  }

  return (
    <SettingsDrawerContext.Provider
      value={{
        isSettingsOpen,
        openSettings,
        closeSettings,
        toggleSettings,
      }}
    >
      {children}
    </SettingsDrawerContext.Provider>
  );
}

export function useSettingsDrawer(): SettingsDrawerContextValue {
  const context = useContext(SettingsDrawerContext);

  if (!context) {
    throw new Error(
      "useSettingsDrawer must be used within a SettingsDrawerProvider."
    );
  }

  return context;
}