type TrainingProfile = {
  daysAvailable: string[];
  clubDays: string[];
  matchDay?: string;
  minutesPerSession: number;
  focusSkills: ("passing" | "setting")[];
};

type AnalysisSummary = {
  primary_fix: string;
  skill: string;
  quality: string;
};

export type DayPlan = {
  day: string;
  type: "solo" | "club" | "match" | "rest";
  focus?: string;
  duration?: number;
};

export function generateWeeklyPlan(
  profile: TrainingProfile,
  latestAnalysis?: AnalysisSummary
): DayPlan[] {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const plan: DayPlan[] = [];

  for (const day of DAYS) {
    // MATCH DAY
    if (profile.matchDay === day) {
      plan.push({ day, type: "match" });
      continue;
    }

    // CLUB DAY
    if (profile.clubDays.includes(day)) {
      plan.push({
        day,
        type: "club",
        focus: latestAnalysis?.primary_fix,
        duration: 15, // light focus block
      });
      continue;
    }

    // SOLO DAY
    if (profile.daysAvailable.includes(day)) {
      plan.push({
        day,
        type: "solo",
        focus: latestAnalysis?.primary_fix,
        duration: profile.minutesPerSession,
      });
      continue;
    }

    // REST
    plan.push({ day, type: "rest" });
  }

  return plan;
}
