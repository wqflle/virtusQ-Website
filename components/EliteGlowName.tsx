import React from "react";
import { Text, View } from "react-native";

type Props = {
  name: string;
  colors: {
    text: string;
    primary: string;
  };
};

export function EliteGlowName({ name, colors }: Props) {
  return (
    <View style={{ alignSelf: "flex-start" }}>
      {/* Glow layers */}
      <Text
        style={{
          position: "absolute",
          color: colors.primary,
          fontSize: 20,
          fontWeight: "900",
          letterSpacing: 0.5,
          textShadowColor: colors.primary,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 28,
          opacity: 0.55,
        }}
      >
        {name}
      </Text>

      <Text
        style={{
          position: "absolute",
          color: colors.primary,
          fontSize: 20,
          fontWeight: "900",
          letterSpacing: 0.5,
          textShadowColor: colors.primary,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 14,
          opacity: 0.85,
        }}
      >
        {name}
      </Text>

      {/* Actual text */}
      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "900",
          letterSpacing: 0.5,
        }}
      >
        {name}
      </Text>
    </View>
  );
}
