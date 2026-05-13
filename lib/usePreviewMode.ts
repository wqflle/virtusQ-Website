import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "preview_mode_enabled";

export function usePreviewMode() {
  const [isPreview, setIsPreview] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once on app mount
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      setIsPreview(v === "true");
      setHydrated(true);
    });
  }, []);

  const enablePreview = async () => {
    setIsPreview(true);
    await AsyncStorage.setItem(KEY, "true");
  };

  const disablePreview = async () => {
    setIsPreview(false);
    await AsyncStorage.removeItem(KEY);
  };

  return {
    isPreview,
    enablePreview,
    disablePreview,
    hydrated,
  };
}
