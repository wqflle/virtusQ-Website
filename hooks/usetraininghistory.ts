import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "training_history_v1";

export type TrainingResult = {
  id: string;
  date: string;
  skill: string;
  quality: string;
  skill_confidence: number;
  quality_confidence: number;
  primary_fix: string;
};

export async function saveResult(result: TrainingResult) {
  const existing = await getHistory();
  const updated = [result, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function getHistory(): Promise<TrainingResult[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearHistory() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
