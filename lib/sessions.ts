// app/lib/sessions.ts
type AnalysisItem = {
  skill: string;
  skill_confidence: number;
  created_at: string;
};

type Session = {
  id: string;
  startedAt: string;
  endedAt: string;
  analyses: AnalysisItem[];
  avgConfidence: number;
  focusSkill: string;
};

const MAX_GAP_MS = 90 * 60 * 1000; // 90 minutes

export function buildSessions(history: AnalysisItem[]): Session[] {
  if (!history.length) return [];

  // sort by time
  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );

  const sessions: Session[] = [];
  let current: AnalysisItem[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = sorted[i - 1];

    if (
      prev &&
      new Date(curr.created_at).getTime() -
        new Date(prev.created_at).getTime() >
        MAX_GAP_MS
    ) {
      sessions.push(createSession(current));
      current = [];
    }

    current.push(curr);
  }

  if (current.length) {
    sessions.push(createSession(current));
  }

  return sessions.reverse(); // newest first
}

function createSession(items: AnalysisItem[]): Session {
  const confidences = items.map((i) => i.skill_confidence);

  const skillCounts: Record<string, number> = {};
  items.forEach((i) => {
    skillCounts[i.skill] = (skillCounts[i.skill] || 0) + 1;
  });

  const focusSkill = Object.entries(skillCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  return {
    id: `${items[0].created_at}`,
    startedAt: items[0].created_at,
    endedAt: items[items.length - 1].created_at,
    analyses: items,
    avgConfidence: Math.round(
      (confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100
    ),
    focusSkill,
  };
}
