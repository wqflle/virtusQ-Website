import AsyncStorage from "@react-native-async-storage/async-storage";

export async function resetAppState() {
  // keep only truly global keys if you want (optional)
  const keysToKeep = ["app_theme"];

  const allKeys = await AsyncStorage.getAllKeys();
  const keysToRemove = allKeys.filter(
    (key) => !keysToKeep.includes(key)
  );

  await AsyncStorage.multiRemove(keysToRemove);
}
