import { useCallback, useEffect, useRef, useState } from "react";

export function useBuilderFlashFeedback() {
  const [qualityNotes, setQualityNotes] = useState<string[]>([]);
  const [flashWarning, setFlashWarning] = useState<string | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const pushFlash = useCallback((message: string) => {
    setFlashWarning(message);

    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }

    flashTimerRef.current = window.setTimeout(() => {
      setFlashWarning(null);
      flashTimerRef.current = null;
    }, 3200);
  }, []);

  const addQualityNote = useCallback((message: string) => {
    setQualityNotes((prev) => [message, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current);
        flashTimerRef.current = null;
      }
    };
  }, []);

  return {
    qualityNotes,
    flashWarning,
    pushFlash,
    addQualityNote,
  };
}