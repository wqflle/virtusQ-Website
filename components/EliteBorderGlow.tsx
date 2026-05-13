import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Easing } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function EliteBorderGlow({
  children,
  radius = 22,
}: {
  children: React.ReactNode;
  radius?: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { width, height } = size;

  const perimeter =
    width && height
      ? 2 * (width + height - radius * 2) + 2 * Math.PI * radius
      : 1;

  /* ===============================
     🔁 NEVER-ENDING LINEAR MOTION
  ================================ */
  useEffect(() => {
    if (!width || !height) return;

    progress.setValue(0);

    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 4200, // smooth + premium
        easing: Easing.linear, // 🚨 KEY: no pauses
        useNativeDriver: false,
      })
    ).start();
  }, [width, height]);

  const dashOffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -perimeter],
  });

  return (
    <View
      onLayout={(e) => setSize(e.nativeEvent.layout)}
      style={{ position: "relative" }}
    >
      {/* GLOW LAYER */}
      {width > 0 && height > 0 && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            right: -6,
            bottom: -6,
          }}
        >
          <Svg width={width + 12} height={height + 12}>
            <Defs>
              {/* 🔥 HOT GOLD GRADIENT */}
              <LinearGradient
                id="eliteComet"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#FFF9E6" />
                <Stop offset="35%" stopColor="#FFD976" />
                <Stop offset="65%" stopColor="#F5C977" />
                <Stop offset="100%" stopColor="#FFFFFF" />
              </LinearGradient>
            </Defs>

            {/* Ambient outer aura */}
            <Rect
              x={6}
              y={6}
              width={width}
              height={height}
              rx={radius}
              ry={radius}
              stroke="#F5C977"
              strokeWidth={10}
              opacity={0.12}
              fill="none"
            />

            {/* Inner static definition */}
            <Rect
              x={6}
              y={6}
              width={width}
              height={height}
              rx={radius}
              ry={radius}
              stroke="#F5C977"
              strokeWidth={2}
              opacity={0.45}
              fill="none"
            />

            {/* ✨ COMET BLOOM (soft, behind) */}
            <AnimatedRect
              x={6}
              y={6}
              width={width}
              height={height}
              rx={radius}
              ry={radius}
              stroke="#FFF3C4"
              strokeWidth={8}
              strokeDasharray={`${perimeter * 0.25} ${perimeter}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              opacity={0.18}
              fill="none"
            />

            {/* 🚀 MAIN COMET (bright + crisp) */}
            <AnimatedRect
              x={6}
              y={6}
              width={width}
              height={height}
              rx={radius}
              ry={radius}
              stroke="url(#eliteComet)"
              strokeWidth={4}
              strokeDasharray={`${perimeter * 0.22} ${perimeter}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
      )}

      {/* CONTENT */}
      {children}
    </View>
  );
}
