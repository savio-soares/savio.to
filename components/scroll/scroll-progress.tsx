"use client";

import { createContext, useContext, useRef } from "react";

/**
 * Shares the project row's 0–1 horizontal scroll position with the globe.
 * A ref rather than state: this value changes every frame and must not
 * re-render the tree.
 */
const ScrollProgressContext = createContext<React.RefObject<number> | null>(null);

export function ScrollProgressProvider({ children }: { children: React.ReactNode }) {
  const progress = useRef(0);
  return (
    <ScrollProgressContext.Provider value={progress}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollProgressContext);
}
