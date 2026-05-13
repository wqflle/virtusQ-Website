import { auth } from "./auth";

/**
 * FALLBACK USER ID
 * ----------------
 * Used when auth has not hydrated yet or user is logged out.
 * This prevents silent AsyncStorage failures.
 */
const GUEST_UID = "guest";

/**
 * Returns a safe user id for storage.
 * Never returns null.
 */
function getSafeUid(): string {
  return auth.currentUser?.uid ?? GUEST_UID;
}

/* =====================================================
   PROFILE
===================================================== */

export function getProfileKey(): string {
  const uid = getSafeUid();
  return `user_profile:${uid}`;
}

/* =====================================================
   ANALYSIS HISTORY
===================================================== */

export function getHistoryKey(): string {
  const uid = getSafeUid();
  return `analysis_history:${uid}`;
}

/* =====================================================
   OPTIONAL: FULL WIPE HELPERS (DEV / SETTINGS)
===================================================== */

export function getAllUserKeys(): string[] {
  const uid = getSafeUid();
  return [
    `user_profile:${uid}`,
    `analysis_history:${uid}`,
  ];
}
