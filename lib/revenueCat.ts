import Purchases from "react-native-purchases";
import { Platform } from "react-native";

export let revenueCatReady = false;
let initialized = false;

export async function initRevenueCat() {
  if (initialized) {
    console.log("RC already initialized");
    return;
  }
  if (Platform.OS === "web") {
    console.log("RC skipped (web)");
    return;
  }
  try {
    console.log("RC INIT START");
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    const apiKey = Platform.OS === "ios"
      ? "appl_NQomdfFzrUhMfmvqoceISeHBvSe"
      : "goog_kaanrmSEnqXvjObasZHqKsjWOQU";

    await Purchases.configure({ apiKey });

    console.log("RC INIT SUCCESS");
    revenueCatReady = true;
    initialized = true;
  } catch (e) {
    console.log("RC INIT FAILED:", e);
  }
}