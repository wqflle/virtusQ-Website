import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: Platform.OS === "android"
    ? "AIzaSyDXPbzujmwDLH10lstjz54tZWLgawXApgg"
    : "AIzaSyAq0b_5Jm-XPcpJf1Gayw_X91civGfKCY8",
  authDomain: "volleyiq-9102a.firebaseapp.com",
  projectId: "volleyiq-9102a",
  storageBucket: "volleyiq-9102a.appspot.com",
  messagingSenderId: "385973919751",
  appId: Platform.OS === "android"
    ? "1:385973919751:android:9b023f575feef2faaecaa2"
    : "1:385973919751:ios:d48d6161bfbced50aecaa2",
};

export const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(firebaseApp);
}

export { auth };