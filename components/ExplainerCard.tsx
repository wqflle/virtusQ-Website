import { Modal, View, Text, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions, Easing } from "react-native";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { useAppColors } from "../lib/useAppColors";;

const { height } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  calculation: string;
};

export default function ExplainerCard({
  visible,
  onClose,
  title,
  description,
  calculation,
}: Props) {
  const colors = useAppColors();

  const translateY = useRef(new Animated.Value(height)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const rotateX = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateX, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(height);
      scale.setValue(0.92);
      rotateX.setValue(18);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />

          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                opacity,
                transform: [
                  { translateY },
                  { scale },
                  {
                    rotateX: rotateX.interpolate({
                      inputRange: [0, 18],
                      outputRange: ["0deg", "18deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>

            <Text style={[styles.section, { color: colors.text }]}>
              What this means
            </Text>
            <Text style={[styles.body, { color: colors.muted }]}>
              {description}
            </Text>

            <Text style={[styles.section, { color: colors.text }]}>
              How it’s calculated
            </Text>
            <Text style={[styles.body, { color: colors.muted }]}>
              {calculation}
            </Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 22,
    padding: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  section: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 14,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});
