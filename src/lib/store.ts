import type { UserProfile, TestAttempt } from './types';
import { v4 as uuidv4 } from 'uuid';

const USER_PROFILE_KEY = 'cogniassess_user_profile';
const TEST_HISTORY_KEY = 'cogniassess_test_history';

// NOTE: This is simple obfuscation (base64 encoding), not true encryption.
// Secure client-side encryption without a backend for key management is not feasible.
const encode = (data: any): string => {
  if (typeof window === 'undefined') return '';
  return window.btoa(JSON.stringify(data));
};

const decode = <T>(encodedData: string | null): T | null => {
  if (typeof window === 'undefined' || !encodedData) return null;
  try {
    return JSON.parse(window.atob(encodedData)) as T;
  } catch (e) {
    console.error("Failed to decode data from localStorage", e);
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
    (attempt) => attempt.validityReport.status === 'High'
  );

  if (validAttempts.length === 0) {
    return null;
  }

  return validAttempts.reduce((best, current) =>
    current.iqScore > best.iqScore ? current : best
  );
};
