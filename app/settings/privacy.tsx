// app/settings/privacy.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { auth } from "../../lib/auth";
import { useAppColors } from "../../lib/useAppColors";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return "—";

  const maskedLocal =
    local.length <= 2
      ? local[0] + "*"
      : local.slice(0, 2) + "*".repeat(Math.min(8, Math.max(3, local.length - 2)));

  const domainParts = domain.split(".");
  const domainName = domainParts[0] ?? "";
  const domainTld = domainParts.slice(1).join(".") || "";

  const maskedDomain =
    domainName.length <= 2
      ? domainName[0] + "*"
      : domainName.slice(0, 2) + "*".repeat(Math.min(8, Math.max(2, domainName.length - 2)));

  return `${maskedLocal}@${maskedDomain}${domainTld ? "." + domainTld : ""}`;
}

export default function PrivacyScreen() {
  const colors = useAppColors();

  const user = auth.currentUser;
  const email = user?.email ?? "";
  const masked = email ? maskEmail(email) : "—";

  // Provider detection
  const providerIds = useMemo(() => {
    return (user?.providerData ?? []).map((p) => p.providerId);
  }, [user]);

  const hasPasswordProvider = providerIds.includes("password");

  // UI state
  const [busy, setBusy] = useState(false);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // Export preview
  const exportMyData = async () => {
    try {
      setBusy(true);
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      const obj: Record<string, string | null> = {};
      pairs.forEach(([k, v]) => (obj[k] = v));

      const preview = JSON.stringify(obj, null, 2).slice(0, 1200);
      Alert.alert(
        "Export (preview)",
        preview.length < 20 ? "No local data found yet." : preview + "\n\n(Preview only for now.)"
      );
    } catch {
      Alert.alert("Export failed", "Could not read local storage.");
    } finally {
      setBusy(false);
    }
  };

  const resetPasswordEmail = async () => {
    if (!email) {
      Alert.alert("No email found", "This account doesn’t have an email address attached.");
      return;
    }

    try {
      setBusy(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email sent", "Check your inbox to reset your password.");
    } catch (e: any) {
      Alert.alert("Couldn’t send email", e?.message ?? "Try again later.");
    } finally {
      setBusy(false);
    }
  };

  const cleanupAndExit = async () => {
    // Clear local storage + sign out + hard route reset
    try {
      await AsyncStorage.clear();
    } catch {}
    try {
      await signOut(auth);
    } catch {}

    // Kick them to login (or whatever your entry route is)
    router.replace("/login");
  };

  const openDelete = () => {
    setDeleteText("");
    setCurrentPassword("");
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const u = auth.currentUser;

    if (!u) {
      Alert.alert("Not signed in", "No user is currently signed in.");
      return;
    }

    if (deleteText.trim().toUpperCase() !== "DELETE") {
      Alert.alert("Type DELETE", 'Please type "DELETE" to confirm.');
      return;
    }

    // If password provider, require current password reauth
    if (hasPasswordProvider) {
      if (!email) {
        Alert.alert("Missing email", "Your account email is missing, can’t re-authenticate.");
        return;
      }
      if (!currentPassword || currentPassword.length < 6) {
        Alert.alert("Enter password", "Please enter your current password to confirm.");
        return;
      }
    }

    try {
      setBusy(true);

      // Re-auth if needed
      if (hasPasswordProvider) {
        const cred = EmailAuthProvider.credential(email, currentPassword);
        await reauthenticateWithCredential(u, cred);
      } else {
        // OAuth providers need fresh tokens to reauth; in RN we usually don’t have them here.
        // Best reliable flow: log out -> log in -> delete within a few minutes.
        Alert.alert(
          "Recent login required",
          "For security, Firebase requires a recent sign-in to delete this account.\n\nPlease sign out, sign back in, then try Delete Account again.",
          [{ text: "OK", onPress: () => setDeleteOpen(false) }]
        );
        return;
      }

      // Delete user
      await deleteUser(u);

      // Close modal then clean up everything
      setDeleteOpen(false);

      Alert.alert("Account deleted", "Your account has been permanently deleted.");
      await cleanupAndExit();
    } catch (e: any) {
      const msg = e?.message ?? "Delete failed.";

      // Common Firebase error: requires-recent-login
      if (String(e?.code).includes("requires-recent-login")) {
        Alert.alert(
          "Recent login required",
          "Please sign out, sign back in, then delete your account again."
        );
      } else if (String(e?.code).includes("wrong-password")) {
        Alert.alert("Wrong password", "That password is incorrect.");
      } else {
        Alert.alert("Delete failed", msg);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Privacy & Security</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Manage your account security, password resets, and data controls.
        </Text>

        {/* ACCOUNT INFO CARD */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.muted }]}>ACCOUNT</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.pillText, { color: colors.muted }]}>{masked}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}>
              {/* Firebase does NOT expose password length; this is the safest display */}
              <Text style={[styles.pillText, { color: colors.muted }]}>••••••••••</Text>
            </View>
          </View>

          <Text style={[styles.helper, { color: colors.muted }]}>
            For security, your password is never readable by the app. Use email reset to change it.
          </Text>

          <TouchableOpacity
            onPress={resetPasswordEmail}
            activeOpacity={0.9}
            style={[styles.button, { borderColor: colors.border }]}
            disabled={busy}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Send password reset email</Text>
          </TouchableOpacity>
        </View>

        {/* SECURITY CARD */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.muted }]}>SECURITY</Text>

          <View style={[styles.notice, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Text style={[styles.noticeTitle, { color: colors.text }]}>Verify identity</Text>
            <Text style={[styles.noticeText, { color: colors.muted }]}>
              Some actions (like deleting your account) require a recent sign-in for security.
            </Text>
          </View>
        </View>

        {/* DANGER ZONE */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.muted }]}>DANGER ZONE</Text>

          <TouchableOpacity
            onPress={exportMyData}
            activeOpacity={0.9}
            style={[styles.dangerButton, { borderColor: "#ef4444" }]}
            disabled={busy}
          >
            <Text style={styles.dangerText}>Export My Data (preview)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openDelete}
            activeOpacity={0.9}
            style={[styles.dangerButton, { borderColor: "#ef4444", marginTop: 12 }]}
            disabled={busy}
          >
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {busy && (
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ color: colors.muted, marginTop: 8 }}>Working…</Text>
          </View>
        )}
      </ScrollView>

      {/* DELETE MODAL */}
      <Modal visible={deleteOpen} transparent animationType="fade" onRequestClose={() => setDeleteOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Delete account</Text>
            <Text style={[styles.modalBody, { color: colors.muted }]}>
              This is permanent. Your account will be deleted and you will be signed out.
            </Text>

            <Text style={[styles.modalLabel, { color: colors.text }]}>Type DELETE to confirm</Text>
            <TextInput
              value={deleteText}
              onChangeText={setDeleteText}
              placeholder="DELETE"
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.border, backgroundColor: colors.background },
              ]}
            />

            {hasPasswordProvider ? (
              <>
                <Text style={[styles.modalLabel, { color: colors.text, marginTop: 12 }]}>
                  Current password (required)
                </Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.border, backgroundColor: colors.background },
                  ]}
                />
              </>
            ) : (
              <View style={[styles.oauthNote, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <Text style={[styles.oauthTitle, { color: colors.text }]}>Signed in with {providerIds[0] ?? "OAuth"}</Text>
                <Text style={[styles.oauthText, { color: colors.muted }]}>
                  Deleting requires a “recent login”. If you use Google/Apple, sign out and sign back in, then delete.
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setDeleteOpen(false)}
                activeOpacity={0.9}
                style={[styles.modalBtn, { borderColor: colors.border }]}
                disabled={busy}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDelete}
                activeOpacity={0.9}
                style={[styles.modalDangerBtn]}
                disabled={busy}
              >
                <Text style={styles.modalDangerText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },

  title: { fontSize: 26, fontWeight: "900" },
  subtitle: { marginTop: 6, lineHeight: 20, fontWeight: "700" },

  card: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },

  cardTitle: { fontSize: 12, fontWeight: "900", letterSpacing: 0.6, marginBottom: 12 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  label: { fontSize: 16, fontWeight: "800" },

  pill: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
  },

  pillText: { fontWeight: "900" },

  divider: { height: 1, marginVertical: 14, opacity: 0.9 },

  helper: { marginTop: 10, lineHeight: 18, fontWeight: "700" },

  button: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonText: { fontWeight: "900", fontSize: 15 },

  notice: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },

  noticeTitle: { fontWeight: "900", fontSize: 15 },
  noticeText: { marginTop: 6, lineHeight: 18, fontWeight: "700" },

  dangerButton: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerText: { color: "#ef4444", fontWeight: "900", fontSize: 15 },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  modalCard: {
    width: "100%",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },

  modalTitle: { fontSize: 18, fontWeight: "900" },
  modalBody: { marginTop: 8, lineHeight: 18, fontWeight: "700" },

  modalLabel: { marginTop: 14, fontWeight: "900" },

  input: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontWeight: "800",
  },

  oauthNote: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  oauthTitle: { fontWeight: "900" },
  oauthText: { marginTop: 6, lineHeight: 18, fontWeight: "700" },

  modalBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalBtnText: { fontWeight: "900" },

  modalDangerBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#ef4444",
  },
  modalDangerText: { fontWeight: "900", color: "#fff" },
});
