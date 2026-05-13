// app/reauth.tsx
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { auth } from "../lib/auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppColors } from "../lib/useAppColors";

export default function ReauthScreen() {
  const colors = useAppColors();
  const { action } = useLocalSearchParams<{ action?: string }>();

  const user = auth.currentUser;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || !user.email) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Not signed in.</Text>
      </View>
    );
  }

  const handleReauth = async () => {
    if (!password.trim()) {
      Alert.alert("Password required");
      return;
    }

    setLoading(true);

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );

      await reauthenticateWithCredential(user, credential);

      // 🔥 Re-auth successful
      if (action === "delete") {
        await AsyncStorage.clear();
        await deleteUser(user);
        router.replace("/login");
        return;
      }

      router.back();
    } catch (e: any) {
      Alert.alert(
        "Authentication failed",
        "Incorrect password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Confirm your password
      </Text>

      <Text style={{ color: colors.muted, marginBottom: 18 }}>
        For security reasons, please re-enter your password.
      </Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.muted}
        secureTextEntry
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />

      <TouchableOpacity
        onPress={handleReauth}
        disabled={loading}
        style={[
          styles.button,
          { backgroundColor: colors.primary },
        ]}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Confirm"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: 14 }}
      >
        <Text style={{ color: colors.muted, fontWeight: "700" }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 18,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "900",
  },
});
