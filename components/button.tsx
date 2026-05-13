import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useColorScheme } from "react-native";
import { darkColors, lightColors } from "../theme/colors";

export default function Button({ text, onPress }: any) {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? darkColors : lightColors;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 16, borderRadius: 12 },
  text: { fontSize: 18, fontWeight: "bold", color: "black" },
});
