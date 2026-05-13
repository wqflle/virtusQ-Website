import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  LayoutChangeEvent,
} from "react-native";
import Svg, { Polyline, Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import { useAppColors } from "../../lib/useAppColors";;

type Point = {
  confidence: number;
  quality: "good" | "bad" | "situational";
  analysisId?: string; // 👈 optional, for tap navigation
};

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ConfidenceGraph({
  title,
  data,
  color,
}: {
  title: string;
  data: Point[];
  color: string;
}) {
  const colors = useAppColors();
  const router = useRouter();

  const height = 120;
  const padding = 10;

  const [width, setWidth] = useState(0);

  // 🔥 Line animation
  const lineAnim = useRef(new Animated.Value(0)).current;

  // 🔥 Dot animations
  const dotAnims = useRef<Animated.Value[]>([]);

  // ===============================
  // BUILD POINTS
  // ===============================
  const points = useMemo(() => {
    if (!width || !data.length) return [];

    return data.map((d, i) => {
      const x =
        padding +
        (i / Math.max(data.length - 1, 1)) *
          (width - padding * 2);
      const y =
        padding +
        (1 - d.confidence) *
          (height - padding * 2);

      return { ...d, x, y };
    });
  }, [data, width]);

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // ===============================
  // ANIMATIONS ON MOUNT
  // ===============================
  useEffect(() => {
    if (!data.length) return;

    lineAnim.setValue(0);
    dotAnims.current = data.map(() => new Animated.Value(0));

    Animated.parallel([
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      Animated.stagger(
        70,
        dotAnims.current.map((a) =>
          Animated.spring(a, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [data.length]);

  // ===============================
  // LINE DRAW EFFECT
  // ===============================
  const lineLength = Math.max(width * 1.5, 300);

  const strokeDashoffset = lineAnim.interpolate({
  inputRange: [0, 1],
  outputRange: [lineLength, 0],
});


  return (
    <View
      style={{ marginBottom: 28 }}
      onLayout={(e: LayoutChangeEvent) =>
        setWidth(e.nativeEvent.layout.width)
      }
    >
      {/* TITLE */}
      <Text
        style={{
          color: colors.text,
          fontWeight: "800",
          fontSize: 16,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>

      {!data.length || !width ? (
        <Text style={{ color: colors.muted }}>No data yet</Text>
      ) : (
        <Svg width={width} height={height}>
          {/* ANIMATED LINE */}
          <AnimatedPolyline
            points={linePoints}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeDasharray={`${lineLength}, ${lineLength}`}
            strokeDashoffset={strokeDashoffset}
            />
 

          {/* DOTS */}
          {points.map((p, i) => {
            const anim = dotAnims.current[i];
            if (!anim) return null;

            const translateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });

            return (
              <AnimatedCircle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5}
                fill={
                  p.quality === "good"
                    ? "#22c55e"
                    : p.quality === "bad"
                    ? "#ef4444"
                    : "#facc15"
                }
                onPress={() => {
                  if (p.analysisId) {
                    router.push({
                      pathname: "/results",
                      params: { id: p.analysisId },
                    });
                  }
                }}
                style={{
                  transform: [{ translateY }],
                  opacity: anim,
                }}
              />
            );
          })}
        </Svg>
      )}
    </View>
  );
}
