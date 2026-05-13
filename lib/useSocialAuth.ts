/**
 * lib/useSocialAuth.ts
 *
 * Shared hook for Google and Apple sign-in.
 * Both methods:
 *   1. Sign in with the provider
 *   2. Create a Firebase credential
 *   3. Sign into Firebase
 *   4. Save activeUid to AsyncStorage
 *   5. Return { uid, isNewUser } so the caller can route correctly
 *
 * SETUP REQUIRED:
 *   npx expo install expo-auth-session expo-crypto expo-apple-authentication
 *
 *   In app.json / app.config.js:
 *   {
 *     "expo": {
 *       "scheme": "virtusq",
 *       "ios": { "usesAppleSignIn": true }
 *     }
 *   }
 *
 *   In Firebase Console:
 *   - Enable Google sign-in provider
 *   - Enable Apple sign-in provider
 *   - Add your iOS bundle ID to both
 *
 *   Replace GOOGLE_WEB_CLIENT_ID below with your OAuth 2.0
 *   Web Client ID from Firebase Console → Project Settings →
 *   General → Your apps → Web API Key / OAuth client.
 */

import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Platform } from "react-native";
import { auth } from "./auth";

// ─── REPLACE THIS with your Web Client ID from Firebase Console ───
// Firebase Console → Project Settings → General →
// Web API Key section → OAuth 2.0 client IDs → Web client
const GOOGLE_WEB_CLIENT_ID =
  "385973919751-t1qg46pjq4e3d3b5q1vkhhil03bhjod5.apps.googleusercontent.com";

export type SocialAuthResult = {
  uid:       string;
  isNewUser: boolean;
};

export type SocialAuthError = {
  message: string;
};

/* ─── GOOGLE ─── */
export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);

  const signIn = async (): Promise<SocialAuthResult | null> => {
    setLoading(true);
    try {
      // Generate a random nonce for security
      const nonce     = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString()
      );

      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "virtusq",
        path:   "auth/google",
      });

      const discovery = {
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint:         "https://oauth2.googleapis.com/token",
      };

      const request = new AuthSession.AuthRequest({
        clientId:    GOOGLE_WEB_CLIENT_ID,
        scopes:      ["openid", "profile", "email"],
        redirectUri,
        responseType: AuthSession.ResponseType.IdToken,
        extraParams: { nonce },
      });

      const result = await request.promptAsync(discovery);

      if (result.type !== "success") return null;

      const { id_token } = result.params;
      if (!id_token) throw new Error("No ID token returned from Google.");

      const credential = GoogleAuthProvider.credential(id_token);
      const cred       = await signInWithCredential(auth, credential);

      await AsyncStorage.setItem("activeUid", cred.user.uid);

      const isNewUser =
        (cred as any).additionalUserInfo?.isNewUser ?? false;

      return { uid: cred.user.uid, isNewUser };

    } catch (e: any) {
      console.error("Google sign-in error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading };
}

/* ─── APPLE ─── */
export function useAppleAuth() {
  const [loading, setLoading] = useState(false);

  // Apple sign-in is iOS only
  const isAvailable = Platform.OS === "ios";

  const signIn = async (): Promise<SocialAuthResult | null> => {
    if (!isAvailable) return null;

    setLoading(true);
    try {
      // Generate nonce
      const rawNonce    = Math.random().toString(36).substring(2);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken } = appleCredential;
      if (!identityToken) throw new Error("No identity token from Apple.");

      const provider   = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: identityToken,
        rawNonce,
      });

      const cred = await signInWithCredential(auth, credential);

      await AsyncStorage.setItem("activeUid", cred.user.uid);

      const isNewUser =
        (cred as any).additionalUserInfo?.isNewUser ?? false;

      return { uid: cred.user.uid, isNewUser };

    } catch (e: any) {
      // ERR_CANCELED means user dismissed the sheet — not a real error
      if (e.code === "ERR_CANCELED") return null;
      console.error("Apple sign-in error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, isAvailable };
}
