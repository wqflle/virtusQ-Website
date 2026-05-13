import React from "react";
import { View } from "react-native";
import Svg, { Polyline, Circle } from "react-native-svg";
import { useAppColors } from "../lib/useAppColors";;

type Point = {
  c01: number;
  created_at: string;
  quality?: "bad" | "situational" | "good";
};

export default function EliteSkillGraph({ points }: { points: Point[] }) {
  const colors = useAppColors();

  if (!points || points.length < 2) {
    return null;
  }

  const width = 260;
  const height = 84;
  const padding = 8;

  // ---- QUALITY BASELINES ----
  const QUALITY_BASE: Record<string, number> = {
    bad: 0.25,
    situational: 0.55,
    good: 0.85,
  };

  const QUALITY_COLOR: Record<string, string> = {
    bad: "#EF4444",          // red
    situational: "#F59E0B",  // amber
    good: "#22C55E",         // green
  };

  // ---- NORMALIZE POINTS ----
  const normalized = points.slice(-10).map((p) => {
    const base = QUALITY_BASE[p.quality ?? "situational"] ?? 0.55;

    // confidence only nudges (±0.1)
    const adjusted =
      base + (Math.max(0, Math.min(1, p.c01)) - 0.5) * 0.2;

    return {
      y01: Math.max(0.05, Math.min(0.95, adjusted)),
      color: QUALITY_COLOR[p.quality ?? "situational"],
    };
  });

  const n = normalized.length;

  const coords = normalized.map((p, i) => {
    const x =
      padding + (i / Math.max(1, n - 1)) * (width - padding * 2);
    const y =
      padding + (1 - p.y01) * (height - padding * 2);

    return { x, y, color: p.color };
  });

  const linePoints = coords.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View style={{ marginTop: 10 }}>
      <Svg width={width} height={height}>
        {/* baseline */}
        <Polyline
          points={`${padding},${height - padding} ${width - padding},${height - padding}`}
          stroke={colors.border}
          strokeWidth={1}
          fill="none"
        />

        {/* line */}
        <Polyline
          points={linePoints}
          stroke={colors.text}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* dots */}
        {coords.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill={p.color}
          />
        ))}
      </Svg>
    </View>
  );
}
