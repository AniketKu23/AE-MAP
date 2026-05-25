"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

type ExpertModeContextValue = {
  expertMode: boolean;
  setExpertMode: (enabled: boolean) => void;
  toggleExpertMode: () => void;
};

const ExpertModeContext = createContext<ExpertModeContextValue | undefined>(undefined);

export function ExpertModeProvider({ children }: { children: ReactNode }) {
  const [expertMode, setExpertModeState] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("ae-map-expert-mode");
    if (storedValue !== null) {
      setExpertModeState(storedValue === "true");
    }
  }, []);

  const setExpertMode = useCallback((enabled: boolean) => {
    setExpertModeState(enabled);
    window.localStorage.setItem("ae-map-expert-mode", String(enabled));
  }, []);

  const toggleExpertMode = useCallback(() => {
    setExpertMode(!expertMode);
  }, [expertMode, setExpertMode]);

  const value = useMemo(
    () => ({
      expertMode,
      setExpertMode,
      toggleExpertMode
    }),
    [expertMode, setExpertMode, toggleExpertMode]
  );

  return <ExpertModeContext.Provider value={value}>{children}</ExpertModeContext.Provider>;
}

export function useExpertMode() {
  const context = useContext(ExpertModeContext);
  if (!context) {
    throw new Error("useExpertMode must be used within ExpertModeProvider.");
  }
  return context;
}
