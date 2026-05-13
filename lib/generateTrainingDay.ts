import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===============================
   TYPES
================================ */
export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type Availability = "solo" | "club" | "game" | "rest";

export type AnalysisItem = {
  skill: string;
  skill_confidence: number;
  primary_fix?: string;
  created_at: string;
};

export type Drill = {
  name: string;
  description: string;
  reps?: string;
};

export type TrainingDay = {
  title: string;
  focus: string;
  preview: string;
  drills: Drill[];
};

/* ===============================
   DRILL LIBRARY (EXPANDABLE)
================================ */
const DRILL_LIBRARY: Record<string, Drill[]> = {
  passing: [
    {
      name: "Wall Passing",
      description: "Pass continuously against a wall, focus on angle control.",
      reps: "3 × 40 reps",
    },
    {
      name: "Platform Freeze",
      description: "Freeze after contact and check platform angle.",
      reps: "3 × 15 reps",
    },
    {
      name: "Target Passing",
      description: "Pass to a marked target zone.",
      reps: "4 × 12 reps",
    },
    {
      name: "Footwork + Pass",
      description: "Shuffle then pass immediately on contact.",
      reps: "3 × 20 reps",
    },
  ],

  setting: [
    {
      name: "Wall Sets",
      description: "High, clean sets against the wall.",
      reps: "4 × 25 reps",
    },
    {
      name: "Set & Hold",
      description: "Hold finish for 2 seconds after each set.",
      reps: "3 × 15 reps",
    },
    {
      name: "Footwork to Set",
      description: "Move into position before every set.",
      reps: "3 × 20 reps",
    },
    {
      name: "Tempo Control",
      description: "Alternate fast and slow tempo sets.",
      reps: "4 × 10 reps",
    },
  ],

  attacking: [
    {
      name: "Approach Mechanics",
      description: "Slow, controlled approach focusing on rhythm.",
      reps: "4 × 8 reps",
    },
    {
      name: "Arm Swing Isolation",
      description: "Arm swing practice without jumping.",
      reps: "3 × 15 reps",
    },
    {
      name: "Target Swings",
      description: "Hit to specific court zones.",
      reps: "4 × 6 reps",
    },
  ],

  serving: [
    {
      name: "Target Serving",
      description: "Serve to deep zones.",
      reps: "4 × 10 serves",
    },
    {
      name: "Routine Practice",
      description: "Full pre-serve routine before each serve.",
      reps: "3 × 12 serves",
    },
  ],

  blocking: [
    {
      name: "Footwork Patterns",
      description: "Side-step and crossover footwork drills.",
      reps: "3 × 20 reps",
    },
    {
      name: "Hand Positioning",
      description: "Focus on penetration over the net.",
      reps: "3 × 10 reps",
    },
  ],
};

/* ===============================
   HELPERS
================================ */
function rotate<T>(arr: T[], seed: number): T[] {
  if (arr.length === 0) return arr;
  const shift = seed % arr.length;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function pickDrills(skill: string, seed: number): Drill[] {
  const drills = DRILL_LIBRARY[skill] ?? [];
  return rotate(drills, seed).slice(0, 3);
}

function daySeed(day: DayKey, confidence: number) {
  const base = day.charCodeAt(0);
  return Math.floor(base * (1 - confidence));
}

/* ===============================
   DATA LOADERS
================================ */
async function getLatestAnalysis(): Promise<AnalysisItem | null> {
  try {
    const raw = await AsyncStorage.getItem("analysis_history");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    return parsed[0];
  } catch {
    return null;
  }
}

async function getAvailability(day: DayKey): Promise<Availability> {
  try {
    const raw = await AsyncStorage.getItem("training_profile_v1");
    if (!raw) return "solo";

    const profile = JSON.parse(raw);

    if (profile.matchDay === day) return "game";
    if (profile.clubDays?.includes(day)) return "club";
    if (!profile.daysAvailable?.includes(day)) return "rest";

    return "solo";
  } catch {
    return "solo";
  }
}

/* ===============================
   MAIN GENERATOR
================================ */
export async function generateTrainingDay(
  day: DayKey
): Promise<TrainingDay> {
  const availability = await getAvailability(day);
  const latest = await getLatestAnalysis();

  /* -------- GAME DAY -------- */
  if (availability === "game") {
    return {
      title: "🏐 Game Day",
      focus: "Competition",
      preview:
        "Game day. Trust your preparation, compete freely, and recover well after.",
      drills: [],
    };
  }

  /* -------- CLUB TRAINING -------- */
  if (availability === "club") {
    return {
      title: "🏐 Club Training",
      focus: "Team systems",
      preview:
        "You have club training today. Let this be your main workload and recover well after.",
      drills: [],
    };
  }

  /* -------- REST DAY -------- */
  if (availability === "rest") {
    return {
      title: "🧘 Recovery Day",
      focus: "Recovery",
      preview:
        "No structured training today. Focus on mobility, hydration, and sleep.",
      drills: [],
    };
  }

  /* -------- SOLO / AI DAY -------- */
  if (!latest) {
    const drills = pickDrills("passing", day.charCodeAt(0));
    return {
      title: "Solo Session",
      focus: "Fundamentals",
      preview:
        "A fundamentals session to build clean, consistent technique.",
      drills,
    };
  }

  const skill = latest.skill.toLowerCase();
  const confidence = latest.skill_confidence ?? 0.5;
  const seed = daySeed(day, confidence);

  const drills = pickDrills(skill, seed);

  return {
    title: "Solo Session",
    focus: `${skill.charAt(0).toUpperCase() + skill.slice(1)} Improvement`,
    preview:
      latest.primary_fix ??
      `Focused session targeting your ${skill}.`,
    drills,
  };
}
