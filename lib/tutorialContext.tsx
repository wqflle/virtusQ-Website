import React, { createContext, useContext, useState } from "react";

type Step = {
  id: string;
  title: string;
  description: string;
  elementRef: React.RefObject<any>;
};

type TutorialContextType = {
  steps: Step[];
  current: number;
  start: (steps: Step[]) => void;
  next: () => void;
  skip: () => void;
  active: boolean;
};

const TutorialContext = createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(false);

  const start = (newSteps: Step[]) => {
    setSteps(newSteps);
    setCurrent(0);
    setActive(true);
  };

  const next = () => {
    if (current >= steps.length - 1) {
      setActive(false);
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const skip = () => {
    setActive(false);
  };

  return (
    <TutorialContext.Provider
      value={{ steps, current, start, next, skip, active }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("TutorialProvider missing");
  return ctx;
}
