import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { useEffect, useRef } from "react";

const EMOJIS = ["🎉", "🏐", "🔥", "💪", "⭐️"];
const { width } = Dimensions.get("window");

export default function GameDayCelebration({
  visible,
}: {
  visible: boolean;
}) {
  const particles = Array.from({ length: 12 }).map(() => ({
    x: useRef(new Animated.Value(0)).current,
    y: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(1)).current,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  }));

  useEffect(() => {
    if (!visible) return;

    particles.forEach((p, i) => {
      Animated.parallel([
        Animated.timing(p.x, {
          toValue: (Math.random() - 0.5) * width,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: -200 - Math.random() * 200,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.container}>
      {particles.map((p, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.emoji,
            {
              opacity: p.opacity,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
              ],
            },
          ]}
        >
          {p.emoji}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  emoji: {
    position: "absolute",
    fontSize: 28,
  },
});
