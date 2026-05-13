// app/privacy.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { auth } from "../lib/auth";
import { useAppColors } from "../lib/useAppColors";
import {
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";

export default function PrivacyScreen() {
  const colors = useAppColors();
  const user = auth.currentUser;

  const [storageKeys, setStorageKeys] = useState<string[]>([]);

  /* ===============================
     LOAD STORAGE KEYS (INFO ONLY)
  =============================== */
  useEffect(() => {
    (async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        setStorageKeys(keys);
      } catch {
        setStorageKeys([]);
      }
    })();
  }, []);

  /* ===============================
     GUARD
  =============================== */
  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Not signed in.</Text>
      </View>
    );
  }

  const provider = user.providerData[0]?.providerId ?? "password";

  /* ===============================
     CHANGE PASSWORD (SAFE)
  =============================== */
  const handleChangePassword = () => {
    if (!user.email) {
      Alert.alert(
        "Unavailable",
        "This account does not have an email address."
      );
      return;
    }

    Alert.alert(
      "Change password",
      `We'll send a secure password reset link to:\n\n${user.email}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send email",
          onPress: async () => {
            try {
              await sendPasswordResetEmail(auth, user.email!);
              Alert.alert(
                "Email sent",
                "Check your inbox (and spam folder) for the reset link."
              );
            } catch (e: any) {
              Alert.alert(
                "Error",
                e?.message ?? "Could not send reset email."
              );
            }
          },
        },
      ]
    );
  };

  /* ===============================
     DELETE ACCOUNT (REAUTH AWARE)
  =============================== */
  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This permanently deletes your account and all local data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccount,
        },
      ]
    );
  };

  const deleteAccount = async () => {
    try {
      await AsyncStorage.clear();
      await deleteUser(user);
      router.replace("/login");
    } catch (e: any) {
      if (e?.code === "auth/requires-recent-login") {
        // ✅ redirect to secure re-auth flow
        router.push("/reauth?action=delete");
        return;
      }

      Alert.alert(
        "Error",
        "Could not delete account. Please try again."
      );
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Privacy & Data
      </Text>

      {/* ACCOUNT INFO */}
      <Card title="Account" colors={colors}>
        <Row label="Email" value={user.email ?? "—"} colors={colors} />
        <Row label="User ID" value={user.uid} colors={colors} />
        <Row label="Provider" value={provider} colors={colors} />
      </Card>

      {/* SECURITY */}
      <Card title="Security" colors={colors}>
        {provider === "password" ? (
          <Action
            label="Change password"
            onPress={handleChangePassword}
            colors={colors}
          />
        ) : (
          <Text style={[styles.note, { color: colors.muted }]}>
            Password changes are managed by your sign-in provider.
          </Text>
        )}

        <Text style={[styles.note, { color: colors.muted }]}>
          Password resets are handled securely by Firebase.
        </Text>
      </Card>

      {/* DATA */}
      <Card title="Stored Data" colors={colors}>
        <Text style={{ color: colors.text, fontWeight: "800" }}>
          Stored keys ({storageKeys.length})
        </Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>
          Includes profile, training data, analysis history, and preferences.
        </Text>
      </Card>

      {/* DANGER */}
      <Card title="Danger zone" colors={colors}>
        <Action
          label="Delete account permanently"
          onPress={confirmDeleteAccount}
          colors={colors}
          danger
        />
      </Card>
    </ScrollView>
  );
}

/* ===============================
   SMALL COMPONENTS
=============================== */

function Card({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.muted }]}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.row}>
      <Text style={{ color: colors.muted }}>{label}</Text>
      <Text style={{ color: colors.text, fontWeight: "700" }}>
        {value}
      </Text>
    </View>
  );
}

function Action({
  label,
  onPress,
  colors,
  danger,
}: {
  label: string;
  onPress: () => void;
  colors: any;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.action, { borderColor: colors.border }]}
    >
      <Text
        style={{
          color: danger ? "#ef4444" : colors.text,
          fontWeight: "800",
        }}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.muted}
      />
    </TouchableOpacity>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  action: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
});
