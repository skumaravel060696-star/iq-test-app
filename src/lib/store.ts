import type { UserProfile, TestAttempt } from './types';
import { v4 as uuidv4 } from 'uuid';

const USER_PROFILE_KEY = 'cogniassess_user_profile';
const TEST_HISTORY_KEY = 'cogniassess_test_history';

// NOTE: This is simple obfuscation (base64 encoding), not true encryption.
// Secure client-side encryption without a backend for key management is not feasible.
const encode = (data: any): string => {
  if (typeof window === 'undefined') return '';
  try {
    return window.btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    console.error("Failed to encode data for localStorage", e);
    return '';
  }
};

const decode = <T>(encodedData: string | null): T | null => {
  if (typeof window === 'undefined' || !encodedData) return null;
  try {
    return JSON.parse(decodeURIComponent(window.atob(encodedData))) as T;
  } catch (e) {
    console.error("Failed to decode data from localStorage", e);
    // If decoding fails, try to clear the corrupted item
    // This is brittle, but for this app might be better than crashing
    if (encodedData.includes('user')) localStorage.removeItem(USER_PROFILE_KEY);
    if (encodedData.includes('history')) localStorage.removeItem(TEST_HISTORY_KEY);
    return null;
  }
};

// --- User Profile ---

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_PROFILE_KEY, encode(profile));
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(USER_PROFILE_KEY);
  return decode<UserProfile>(data);
};

// --- Test History ---

export const getTestHistory = (): TestAttempt[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TEST_HISTORY_KEY);
  return decode<TestAttempt[]>(data) || [];
};

export const addTestAttempt = (attempt: TestAttempt): void => {
  const history = getTestHistory();
  // Prevent overwriting best score with practice attempt
  const bestAttempt = getBestValidTestAttempt();
  if (attempt.isPractice && bestAttempt && attempt.iqScore < bestAttempt.iqScore) {
     // We could store it but decide not to show it as the "latest" in some contexts
  }
  const newHistory = [attempt, ...history];
  localStorage.setItem(TEST_HISTORY_KEY, encode(newHistory));
};

export const getTestAttemptById = (id: string): TestAttempt | null => {
  const history = getTestHistory();
  return history.find(attempt => attempt.id === id) || null;
}

export const getLatestTestAttempt = (): TestAttempt | null => {
  const history = getTestHistory();
  return history.length > 0 ? history[0] : null;
};

export const getBestValidTestAttempt = (): TestAttempt | null => {
  const history = getTestHistory();
  const validAttempts = history.filter(
    (attempt) => attempt.validityReport.status === 'High' && !attempt.isPractice
  );

  if (validAttempts.length === 0) {
    const validPracticeAttempts = history.filter(
      (attempt) => attempt.validityReport.status === 'High' && attempt.isPractice
    );
     if (validPracticeAttempts.length === 0) return null;
     return validPracticeAttempts.reduce((best, current) =>
      current.iqScore > best.iqScore ? current : best
    );
  }

  return validAttempts.reduce((best, current) =>
    current.iqScore > best.iqScore ? current : best
  );
};
