export type Drill = {
  title: string;
  description: string;
  reps: string;
};

export const DRILL_LIBRARY: Record<string, Drill[]> = {
  "Lower your hips earlier and stay athletic through contact.": [
    {
      title: "Low Base Passing Reps",
      description: "Start in a deep base before contact and hold posture through the pass.",
      reps: "3 × 20 reps",
    },
    {
      title: "Split-Step → Pass",
      description: "Split step as the ball is released, sink hips immediately before passing.",
      reps: "3 × 15 reps",
    },
  ],

  "Keep your elbows in and hands strong.": [
    {
      title: "Wall Setting Control",
      description: "Set against the wall focusing on tight elbows and clean hand shape.",
      reps: "3 × 40 seconds",
    },
    {
      title: "Form Setting (No Jump)",
      description: "Slow controlled sets emphasizing elbow position.",
      reps: "3 × 25 reps",
    },
  ],

  "Load your legs and let them drive the set.": [
    {
      title: "Squat → Set Drill",
      description: "Sit into hips before setting, drive upward through legs.",
      reps: "3 × 15 reps",
    },
    {
      title: "Tempo Sets",
      description: "Set at varying tempos using legs first, arms second.",
      reps: "3 × 20 reps",
    },
  ],
};

// Fallback drills if fix is unknown
export const DEFAULT_DRILLS: Drill[] = [
  {
    title: "Technical Consistency Reps",
    description: "High-rep controlled technique focusing on fundamentals.",
    reps: "3 × 20 reps",
  },
];
