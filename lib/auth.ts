// lib/auth.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ===============================
   FIREBASE CONFIG (UNCHANGED)
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyAq0b_5Jm-XPcpJf1Gayw_X91civGfKCY8",
  authDomain: "volleyiq-9102a.firebaseapp.com",
  projectId: "volleyiq-9102a",
  storageBucket: "volleyiq-9102a.appspot.com",
  messagingSenderId: "385973919751",
  appId: "1:385973919751:ios:d48d6161bfbced50aecaa2",
};

/* ===============================
   APP (SINGLETON — VERY IMPORTANT)
================================ */
export const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

/* ===============================
   AUTH (WITH PERSISTENCE)
================================
   ❗ DO NOT use getAuth() in RN
   ❗ This ensures login survives reloads
================================ */
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
