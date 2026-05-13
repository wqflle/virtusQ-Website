import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../lib/useAppColors";
import { getProfileKey } from "../lib/userStorage";

type Profile = {
  name?: string;
  avatar?: string | null;
};

export default function EditProfileScreen() {
  const colors = useAppColors();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* ===============================
     LOAD PROFILE (ALWAYS FRESH)
  ================================ */
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const load = async () => {
        const key = getProfileKey();
        if (!key) {
          if (mounted) {
            setName("");
            setAvatar(null);
          }
          return;
        }

        const raw = await AsyncStorage.getItem(key);
        if (!mounted) return;

        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setName(parsed.name ?? "");
            setAvatar(parsed.avatar ?? null);
          } catch {
            setName("");
            setAvatar(null);
          }
        } else {
          setName("");
          setAvatar(null);
        }
      };

      load();
      return () => {
        mounted = false;
      };
    }, [])
  );

  /* ===============================
     IMAGE PICKER
  ================================ */
  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission required", "Allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  /* ===============================
     SAVE
  ================================ */
  const saveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }

    const key = getProfileKey();
    if (!key) return;

    setSaving(true);

    const profile: Profile = {
      name: name.trim(),
      avatar,
    };

    await AsyncStorage.setItem(key, JSON.stringify(profile));
    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { borderColor: colors.border }]}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.text }]}>
              Edit Profile
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* AVATAR */}
          <TouchableOpacity
            onPress={pickAvatar}
            activeOpacity={0.85}
            style={styles.avatarWrap}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons name="camera" size={30} color={colors.muted} />
              </View>
            )}
            <Text style={{ color: colors.muted, marginTop: 10 }}>
              Tap to change photo
            </Text>
          </TouchableOpacity>

          {/* NAME */}
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={{ color: colors.muted, marginBottom: 6 }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.muted}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>

          {/* SAVE */}
          <TouchableOpacity
            onPress={saveProfile}
            disabled={saving}
            style={[
              styles.saveBtn,
              { backgroundColor: colors.primary, opacity: saving ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.saveText}>
              {saving ? "Saving…" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
  },

  avatarWrap: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "700",
  },

  saveBtn: {
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "900",
  },
});
