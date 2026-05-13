export type Drill = {
  name: string;
  description: string;
  reps?: string;
  cue?: string; // short mental cue for the drill
};

export type TrainingDay = {
  title: string;
  focus: string;
  preview: string;
  drills: Drill[];
  isGameDay?: boolean; // set dynamically from availability
};

export const TRAINING_PLAN: Record<string, TrainingDay> = {
  Mon: {
    title: "Technical Foundation",
    focus: "Passing consistency",
    preview: "Platform control, balance, and posture",
    drills: [
      {
        name: "Wall Passing",
        description:
          "Pass against a wall using a neutral platform. Reset feet between reps.",
        reps: "3 x 30 reps",
        cue: "Angle first, then power",
      },
      {
        name: "Freeze & Hold",
        description:
          "Freeze for 2 seconds after contact to check balance and posture.",
        reps: "3 x 15 reps",
        cue: "Still after contact",
      },
    ],
  },

  Tue: {
    title: "Explosive Movement",
    focus: "Footwork & transition",
    preview: "Quick feet, reminders, first step speed",
    drills: [
      {
        name: "Split-Step Reaction",
        description:
          "Start neutral, react to a visual cue, and explode in the correct direction.",
        reps: "4 x 20 seconds",
        cue: "Explode on read",
      },
      {
        name: "Shuffle to Pass",
        description:
          "Shuffle laterally before passing. Emphasize early platform setup.",
        reps: "3 x 12 reps",
        cue: "Feet before arms",
      },
    ],
  },

  Wed: {
    title: "Skill Reinforcement",
    focus: "Setting mechanics",
    preview: "Hands, elbows, clean release",
    drills: [
      {
        name: "High-Elbow Sets",
        description:
          "Set straight up while maintaining elbow height and wrist softness.",
        reps: "4 x 25 reps",
        cue: "Elbows lead",
      },
      {
        name: "Wall Touch Sets",
        description:
          "Set lightly against a wall focusing on fingertip contact.",
        reps: "3 x 20 reps",
        cue: "Soft hands",
      },
    ],
  },

  Thu: {
    title: "Game Simulation",
    focus: "Decision making",
    preview: "Read, adjust, commit",
    drills: [
      {
        name: "Random Ball Feed",
        description:
          "Coach or partner feeds unpredictable balls. React and execute cleanly.",
        reps: "3 x 10 reps",
        cue: "Decide early",
      },
      {
        name: "Chaos Pepper",
        description:
          "Pepper drill with random speed and height changes.",
        reps: "8 minutes",
        cue: "Stay composed",
      },
    ],
  },

  Fri: {
    title: "Attack Mechanics",
    focus: "Approach & arm swing",
    preview: "Rhythm, timing, and control",
    drills: [
      {
        name: "Approach Without Ball",
        description:
          "Full approach focusing on rhythm and last two steps.",
        reps: "3 x 8 reps",
        cue: "Fast-slow-fast",
      },
      {
        name: "Shadow Swings",
        description:
          "Arm swing mechanics without jumping. Emphasize elbow lead.",
        reps: "3 x 10 reps",
        cue: "Elbow to ear",
      },
    ],
  },

  Sat: {
    title: "Light Session",
    focus: "Touch & recovery",
    preview: "Low intensity, high feel",
    drills: [
      {
        name: "Pepper Touch",
        description:
          "Light pepper focusing on control and relaxed movement.",
        reps: "10-15 minutes",
        cue: "Smooth and calm",
      },
      {
        name: "Mobility Flow",
        description:
          "Hip, ankle, and shoulder mobility work.",
        reps: "8-10 minutes",
        cue: "Loose and ready",
      },
    ],
  },

  Sun: {
    title: "Recovery",
    focus: "Reset",
    preview: "Recover and prepare for the next week",
    drills: [
      {
        name: "Active Recovery Walk",
        description:
          "Light walk or bike ride to promote blood flow.",
        reps: "20-30 minutes",
        cue: "Recover to improve",
      },
      {
        name: "Visualization",
        description:
          "Visualize perfect execution of your primary skill.",
        reps: "5 minutes",
        cue: "See success",
      },
    ],
  },
};
