import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../lib/auth";
import { useAppColors } from "../../lib/useAppColors";
import { useGoogleAuth, useAppleAuth } from "../../lib/useSocialAuth";

/* ===============================
   ROUTING HELPER
   Single source of truth for post-auth routing.
   New users → consent screen
   Returning users → main app
================================ */
async function routeAfterAuth(isNewUser: boolean) {
  if (isNewUser) {
    router.replace("/consent");
  } else {
    router.replace("/(tabs)");
  }
}

/* ===============================
   SCREEN
=============================== */
export default function LoginScreen() {
  const colors = useAppColors();

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [inlineError,  setInlineError]  = useState<string | null>(null);

  const google = useGoogleAuth();
  const apple  = useAppleAuth();

  const anyLoading = loading || google.loading || apple.loading;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const errors = useMemo(() => ({
    email:    email    && !email.includes("@") ? "Invalid email"         : "",
    password: password && password.length < 6  ? "At least 6 characters" : "",
  }), [email, password]);

  const canSubmit = email && password && !errors.email && !errors.password;

  /* ─── Email / password login ─── */
  const handleLogin = async () => {
    if (!canSubmit || anyLoading) return;
    setInlineError(null);

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await AsyncStorage.setItem("activeUid", cred.user.uid);

      // ✅ FIX: explicit router call — no longer relies solely on auth listener
      await routeAfterAuth(false);

    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const msgs: Record<string, string> = {
        "auth/user-not-found":      "No account found with this email.",
        "auth/wrong-password":      "Incorrect password.",
        "auth/invalid-email":       "Invalid email address.",
        "auth/network-request-failed": "Check your internet connection.",
        "auth/too-many-requests":   "Too many attempts. Try again later.",
      };

      setInlineError(msgs[e.code] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google login ─── */
  const handleGoogle = async () => {
    if (anyLoading) return;
    setInlineError(null);
    try {
      const result = await google.signIn();
      if (!result) return;
      await routeAfterAuth(result.isNewUser);
    } catch (e: any) {
      setInlineError("Google sign-in failed. Please try again.");
    }
  };

  /* ─── Apple login ─── */
  const handleApple = async () => {
    if (anyLoading) return;
    setInlineError(null);
    try {
      const result = await apple.signIn();
      if (!result) return;
      await routeAfterAuth(result.isNewUser);
    } catch (e: any) {
      setInlineError("Apple sign-in failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Animated.View
          style={{
            flex:          1,
            justifyContent: "center",
            padding:       24,
            opacity:       fade,
            transform:     [{ translateY: slide }],
          }}
        >
          {/* HEADER */}
          <View style={{ marginBottom: 28 }}>
            <Text style={[styles.brand, { color: colors.text }]}>VirtusQ</Text>
            <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
            <Text style={{ color: colors.muted }}>Continue improving your game.</Text>
          </View>

          {/* ─── SOCIAL BUTTONS ─── */}
          {/* Apple — iOS only */}
          {apple.isAvailable && (
            <SocialButton
              onPress={handleApple}
              loading={apple.loading}
              disabled={anyLoading}
              icon="logo-apple"
              label="Continue with Apple"
              style={{
                backgroundColor: colors.text,
                borderColor:     colors.text,
              }}
              textColor={colors.background}
              colors={colors}
            />
          )}

          {/* Google */}
          <SocialButton
            onPress={handleGoogle}
            loading={google.loading}
            disabled={anyLoading}
            icon="logo-google"
            label="Continue with Google"
            style={{
              backgroundColor: colors.card,
              borderColor:     colors.border,
              marginTop:       apple.isAvailable ? 10 : 0,
            }}
            textColor={colors.text}
            colors={colors}
          />

          {/* Divider */}
          <Divider colors={colors} />

          {/* EMAIL */}
          <Input
            value={email}
            onChange={setEmail}
            placeholder="Email"
            colors={colors}
          />
          {!!errors.email && <ErrorText text={errors.email} />}

          {/* PASSWORD */}
          <View>
            <Input
              value={password}
              onChange={setPassword}
              placeholder="Password"
              colors={colors}
              secure={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((p) => !p)}
              style={styles.eye}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color={showPassword ? colors.text : colors.muted}
              />
            </TouchableOpacity>
          </View>
          {!!errors.password && <ErrorText text={errors.password} />}

          {/* Inline error */}
          {!!inlineError && (
            <View style={[styles.errorBox, { borderColor: "#ef4444" }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
              <Text style={{ color: "#ef4444", fontWeight: "800", flex: 1, marginLeft: 8 }}>
                {inlineError}
              </Text>
            </View>
          )}

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={!canSubmit || anyLoading}
            activeOpacity={0.9}
            style={[
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: !canSubmit || anyLoading ? 0.6 : 1,
              },
            ]}
          >
            {loading
              ? <ActivityIndicator size="small" color="#000" />
              : <Text style={styles.buttonText}>Log in</Text>
            }
          </TouchableOpacity>

          {/* SIGNUP LINK */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/signup")}
            style={{ marginTop: 18 }}
          >
            <Text style={{ textAlign: "center", color: colors.muted }}>
              Don't have an account?{" "}
              <Text style={{ color: colors.text, fontWeight: "700" }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ===============================
   SHARED COMPONENTS
=============================== */
function SocialButton({
  onPress,
  loading,
  disabled,
  icon,
  label,
  style,
  textColor,
  colors,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.88}
      style={[
        styles.socialButton,
        style,
        { opacity: disabled && !loading ? 0.6 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          <Ionicons name={icon} size={20} color={textColor} />
          <Text style={[styles.socialText, { color: textColor }]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function Divider({ colors }: any) {
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      <Text style={{ color: colors.muted, fontWeight: "800", fontSize: 12 }}>or</Text>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

function Input({ value, onChange, placeholder, colors, secure }: any) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      secureTextEntry={secure}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="oneTimeCode"
      autoComplete="off"
      style={[
        styles.input,
        { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
      ]}
    />
  );
}

function ErrorText({ text }: any) {
  return <Text style={styles.error}>{text}</Text>;
}

/* ===============================
   STYLES
=============================== */
const styles = StyleSheet.create({
  brand: {
    fontWeight:    "800",
    fontSize:      17,
    letterSpacing: 0.6,
    opacity:       0.9,
    marginBottom:  8,
  },
  title: {
    fontSize:      30,
    fontWeight:    "700",
    letterSpacing: -0.5,
  },
  socialButton: {
    height:         54,
    borderRadius:   14,
    borderWidth:    1,
    flexDirection:  "row",
    alignItems:     "center",
    justifyContent: "center",
    gap:            10,
  },
  socialText: {
    fontSize:   15,
    fontWeight: "700",
  },
  dividerRow: {
    flexDirection:  "row",
    alignItems:     "center",
    gap:            12,
    marginVertical: 18,
  },
  dividerLine: {
    flex:   1,
    height: 1,
  },
  input: {
    height:            54,
    borderRadius:      12,
    paddingHorizontal: 14,
    marginTop:         12,
    borderWidth:       1,
    fontWeight:        "500",
  },
  button: {
    height:         54,
    borderRadius:   14,
    alignItems:     "center",
    justifyContent: "center",
    marginTop:      18,
  },
  buttonText: {
    fontWeight: "700",
    color:      "#000",
  },
  eye: {
    position: "absolute",
    right:    14,
    top:      24,
  },
  error: {
    color:     "#ef4444",
    marginTop: 6,
  },
  errorBox: {
    marginTop:     10,
    borderWidth:   1,
    borderRadius:  12,
    padding:       12,
    flexDirection: "row",
    alignItems:    "center",
  },
});