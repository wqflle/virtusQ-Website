import type { DayKey } from "../app/(tabs)/training";

export const trainingPreviewPlans: Partial<
  Record<DayKey, { title: string; focus: string; preview: string }>
> = {
  Mon: {
    title: "Serve Receive Control",
    focus: "Passing under pressure",
    preview: "High-volume reps focusing on platform angle and footwork.",
  },
  Tue: {
    title: "Setting Accuracy",
    focus: "Tempo + location",
    preview: "Target-based setting drills to improve consistency.",
  },
  Wed: {
    title: "Attacking Timing",
    focus: "Approach rhythm",
    preview: "Work on spacing, arm swing timing, and vision.",
  },
};
