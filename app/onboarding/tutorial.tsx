import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useRef, useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppColors } from "../../lib/useAppColors";
import { auth } from "../../lib/auth";
const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    title: "This is built for you.",
    text: "Your training adapts to your level and how you actually play.",
    icon: "person-outline",
  },
  {
    title: "Upload. Analyze. Improve.",
    text: "Drop in a clip and get instant AI feedback on your technique.",
    icon: "scan-outline",
  },
  {
    title: "See what others miss.",
    text: "We break down movement, timing, and control so you improve faster.",
    icon: "eye-outline",
  },
  {
    title: "Train with purpose.",
    text: "Your weekly plan evolves based on your performance.",
    icon: "calendar-outline",
  },
  {
    title: "Small gains compound.",
    text: "Track your progress and build real consistency over time.",
    icon: "trending-up-outline",
  },
  {
    title: "You’re ready.",
    text: "Let’s analyze your first session and start improving.",
    icon: "checkmark-circle-outline",
  },
];

export default function TutorialScreen() {
  const colors = useAppColors();
  const scrollRef = useRef<any>(null);
  const [index, setIndex] = useState(0);

  const [userLevel, setUserLevel] = useState("");
  const [userPosition, setUserPosition] = useState("");

  const scale = useRef(new Animated.Value(0.96)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    AsyncStorage.getItem("user_level").then((v) => setUserLevel(v || ""));
    AsyncStorage.getItem("user_position").then((v) => setUserPosition(v || ""));
  }, []);

  useEffect(() => {
    scale.setValue(0.96);
    fade.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const glow = useMemo(
    () => colors.primary + (colors.background === "#000" ? "26" : "14"),
    [colors]
  );

  const progress = (index + 1) / SLIDES.length;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 260,
      useNativeDriver: false,
    }).start();
  }, [index]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

const finish = async () => {
  const user = auth.currentUser;

  if (user) {
    await AsyncStorage.setItem(
      `onboarding_done_${user.uid}`,
      "true"
    );
  }

  router.replace("/consent");
};

  const goNext = () => {
    if (index === SLIDES.length - 1) return finish();
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  const goBack = () => {
    if (index === 0) return;
    scrollRef.current?.scrollTo({ x: (index - 1) * width, animated: true });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[glow, colors.background, colors.background]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goBack} disabled={index === 0}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.text}
              style={{ opacity: index === 0 ? 0.3 : 1 }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={finish}>
            <Text style={{ color: colors.muted, fontWeight: "800" }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* SLIDES */}
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / width);
            setIndex(i);
          }}
        >
          {SLIDES.map((slide, i) => (
            <View key={i} style={{ width, alignItems: "center" }}>
              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    opacity: fade,
                    transform: [{ scale }],
                  },
                ]}
              >
                {/* PERSONALIZATION */}
                {(userLevel || userPosition) && (
                  <Text style={styles.personal}>
                    {`${userLevel || ""}${
                      userPosition ? " • " + userPosition : ""
                    }`}
                  </Text>
                )}

                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name={slide.icon as any}
                    size={40}
                    color={colors.primary}
                  />
                </View>

                <Text style={[styles.title, { color: colors.text }]}>
                  {slide.title}
                </Text>

                <Text style={[styles.text, { color: colors.muted }]}>
                  {slide.text}
                </Text>
              </Animated.View>
            </View>
          ))}
        </Animated.ScrollView>

        {/* PROGRESS */}
        <View style={{ marginHorizontal: 32, marginTop: 24 }}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: colors.border },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { width: progressWidth, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.primary }]}
          onPress={goNext}
        >
          <Text style={styles.ctaText}>
            {index === SLIDES.length - 1
              ? "Start Training"
              : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 60,
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },

  card: {
    marginTop: height * 0.2,
    width: width * 0.82,
    paddingVertical: 42,
    paddingHorizontal: 28,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },

  personal: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    opacity: 0.7,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 14,
    lineHeight: 22,
  },

  progressTrack: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  cta: {
    marginHorizontal: 32,
    marginTop: 26,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: "center",
  },

  ctaText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
  },
});