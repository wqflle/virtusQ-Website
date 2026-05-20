// lib/authProviders.ts
import * as WebBrowser from "expo-web-browser";
import * as Crypto from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";

import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  linkWithCredential,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";

import { auth } from "./auth";

WebBrowser.maybeCompleteAuthSession();

/* ======================================================
   CONFIG
===================================================== */

const GOOGLE_WEB_CLIENT_ID =
  "385973919751-t1qg46pjq4e3d3b5q1vkhhil03bhjod5.apps.googleusercontent.com";

const GOOGLE_IOS_CLIENT_ID =
  "385973919751-8q6qs4etgefeom3atv161in81d1eflma.apps.googleusercontent.com";

/* ======================================================
   HELPERS
===================================================== */

function requireUser(): User {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");
  return user;
}

function hasProvider(providerId: string) {
  return auth.currentUser?.providerData.some(
    (p) => p.providerId === providerId
  );
}

function randomNonce(length = 32) {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

/* ======================================================
   GOOGLE (Expo Go + Firebase safe)
===================================================== */

export function useGoogleAuth() {
  return Google.useAuthRequest({
    expoClientId: GOOGLE_WEB_CLIENT_ID, // Expo Go
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    scopes: ["profile", "email"],
  });
}

export async function signInWithGoogleResponse(
  response: Google.AuthSessionResult
) {
  if (response.type !== "success") {
    throw new Error("Google sign-in cancelled.");
  }

  const { id_token } = response.params;
  if (!id_token) throw new Error("Missing Google ID token.");

  const credential = GoogleAuthProvider.credential(id_token);
  return await signInWithCredential(auth, credential);
}

export async function linkGoogleResponse(
  response: Google.AuthSessionResult
) {
  if (hasProvider("google.com")) {
    throw new Error("Google already linked.");
  }

  if (response.type !== "success") {
    throw new Error("Google linking cancelled.");
  }

  const { id_token } = response.params;
  if (!id_token) throw new Error("Missing Google ID token.");

  const credential = GoogleAuthProvider.credential(id_token);
  return await linkWithCredential(requireUser(), credential);
}

/* ======================================================
   APPLE
===================================================== */

export async function signInWithApple() {
  const rawNonce = randomNonce();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const res = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
    nonce: hashedNonce,
  });

  if (!res.identityToken) {
    throw new Error("Apple Sign-In failed.");
  }

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({
    idToken: res.identityToken,
    rawNonce,
  });

  return await signInWithCredential(auth, credential);
}

export async function linkAppleToCurrentUser() {
  if (hasProvider("apple.com")) {
    throw new Error("Apple already linked.");
  }

  const rawNonce = randomNonce();
  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  const res = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
    nonce: hashedNonce,
  });

  if (!res.identityToken) {
    throw new Error("Apple linking failed.");
  }

  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({
    idToken: res.identityToken,
    rawNonce,
  });

  return await linkWithCredential(requireUser(), credential);
}

/* ======================================================
   EMAIL / SECURITY HELPERS
===================================================== */

export async function sendResetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function reauthenticateWithPassword(
  email: string,
  password: string
) {
  const provider = new GoogleAuthProvider(); // placeholder
  throw new Error(
    "Password re-auth should be handled via EmailAuthProvider (call when needed)"
  );
}
