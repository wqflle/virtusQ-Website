import React, {
  useContext,
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
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../../lib/auth";
import { useAppColors } from "../../lib/useAppColors";
import { ThemeContext } from "../../lib/themeContext";
import { useGoogleAuth, useAppleAuth } from "../../lib/useSocialAuth";

/* ===============================
   ROUTING HELPER
   Matches login.tsx exactly.
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
   PASSWORD STRENGTH
=============================== */
const getStrength = (pw: string) => {
  if (pw.length < 6)  return 1;
  if (pw.length < 10) return 2;
  return 3;
};

/* ===============================
   SCREEN
=============================== */
export default function SignupScreen() {
  const colors          = useAppColors();
  const { setTheme }    = useContext(ThemeContext);

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(8)).current;

  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [inlineError,  setInlineError]  = useState<string | null>(null);

  const google = useGoogleAuth();
  const apple  = useAppleAuth();

  const anyLoading = loading || google.loading || apple.loading;

  useEffect(() => {
    setTheme("system" as any);
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const strength      = getStrength(password);
  const strengthColor = strength === 1 ? "#ef4444" : strength === 2 ? "#f59e0b" : "#22c55e";
  const strengthLabel = strength === 1 ? "Weak"    : strength === 2 ? "Okay"    : "Strong";

  const errors = useMemo(() => ({
    email:   email   && !email.includes("@")     ? "Invalid email"          : "",
    confirm: confirm && confirm !== password      ? "Passwords don't match"  : "",
  }), [email, confirm, password]);

  const canSubmit =
    firstName &&
    lastName  &&
    email     &&
    password  &&
    !errors.email &&
    !errors.confirm;

  /* ─── Email / password signup ─── */
  const handleSignup = async () => {
    if (!canSubmit || anyLoading) return;
    setInlineError(null);

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      await AsyncStorage.setItem("activeUid", cred.user.uid);

      // New email signups always go to consent
      await routeAfterAuth(true);

    } catch (e: any) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      const msgs: Record<string, string> = {
        "auth/email-already-in-use": "An account already exists with this email.",
        "auth/invalid-email":        "Invalid email address.",
        "auth/weak-password":        "Password must be at least 6 characters.",
        "auth/network-request-failed": "Check your internet connection.",
      };

      setInlineError(msgs[e.code] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Google signup ─── */
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

  /* ─── Apple signup ─── */
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
            flex:           1,
            justifyContent: "center",
            padding:        24,
            opacity:        fade,
            transform:      [{ translateY: slide }],
          }}
        >
          {/* HEADER */}
          <View style={{ marginBottom: 28 }}>
            <Text style={[styles.brand, { color: colors.text }]}>VirtusQ</Text>
            <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
            <Text style={{ color: colors.muted }}>Start improving with AI coaching.</Text>
          </View>

          {/* ─── SOCIAL BUTTONS ─── */}
          {apple.isAvailable && (
            <SocialButton
              onPress={handleApple}
              loading={apple.loading}
              disabled={anyLoading}
              icon="logo-apple"
              label="Continue with Apple"
              style={{ backgroundColor: colors.text, borderColor: colors.text }}
              textColor={colors.background}
            />
          )}

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
          />

          {/* Divider */}
          <Divider colors={colors} />

          {/* NAME ROW */}
          <View style={styles.row}>
            <Input value={firstName} onChange={setFirstName} placeholder="First name" colors={colors} />
            <Input value={lastName}  onChange={setLastName}  placeholder="Last name"  colors={colors} />
          </View>

          {/* EMAIL */}
          <Input value={email} onChange={setEmail} placeholder="Email" colors={colors} />
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
                color={colors.muted}
              />
            </TouchableOpacity>

            {password.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <View style={styles.barRow}>
                  {[1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.bar,
                        { backgroundColor: i <= strength ? strengthColor : colors.border },
                      ]}
                    />
                  ))}
                </View>
                <Text style={{ color: strengthColor, marginTop: 4 }}>{strengthLabel}</Text>
              </View>
            )}
          </View>

          {/* CONFIRM */}
          <Input
            value={confirm}
            onChange={setConfirm}
            placeholder="Confirm password"
            colors={colors}
            secure={!showPassword}
          />
          {!!errors.confirm && <ErrorText text={errors.confirm} />}

          {/* Inline error */}
          {!!inlineError && (
            <View style={[styles.errorBox, { borderColor: "#ef4444" }]}>
              <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
              <Text style={{ color: "#ef4444", fontWeight: "800", flex: 1, marginLeft: 8 }}>
                {inlineError}
              </Text>
            </View>
          )}

          {/* CREATE ACCOUNT BUTTON */}
          <TouchableOpacity
            onPress={handleSignup}
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
              : <Text style={styles.buttonText}>Create account</Text>
            }
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            style={{ marginTop: 18 }}
          >
            <Text style={{ textAlign: "center", color: colors.muted }}>
              Already have an account?{" "}
              <Text style={{ color: colors.text, fontWeight: "700" }}>Log in</Text>
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
function SocialButton({ onPress, loading, disabled, icon, label, style, textColor }: any) {
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
  row: {
    flexDirection: "row",
    gap:           10,
  },
  input: {
    flex:              1,
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
  barRow: {
    flexDirection: "row",
    gap:           6,
  },
  bar: {
    flex:         1,
    height:       6,
    borderRadius: 4,
  },
});