import type { UserProfile, TestAttempt } from './types';
import { v4 as uuidv4 } from 'uuid';

const USER_PROFILE_KEY = 'intquo_user_profile';
const TEST_HISTORY_KEY = 'intquo_test_history';

// Using btoa for simple obfuscation. In a real-world scenario, proper encryption or
// server-side storage would be necessary for sensitive data.
const encode = (data: any): string => {
  if (typeof window === 'undefined') return '';
  try {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch (e) {
    console.error("Failed to encode data for localStorage", e);
    return '';
  }
};

const decode = <T>(encodedData: string | null): T | null => {
  if (typeof window === 'undefined' || !encodedData) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(window.atob(encodedData)))) as T;
  } catch (e) {
    console.error("Failed to decode data from localStorage", e);
    
    // If decoding fails, try to clear the corrupted item
    try {
        if (encodedData) {
            // A simple heuristic to guess which key is corrupted
            if (encodedData.includes('email') && encodedData.includes('name')) {
                 localStorage.removeItem(USER_PROFILE_KEY);
            }
             else if (encodedData.includes('testId') || encodedData.includes('iqScore')) {
                 localStorage.removeItem(TEST_HISTORY_KEY);
            }
        }
    } catch (clearError) {
        console.error("Failed to clear corrupted localStorage item", clearError);
    }
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

export const clearUserData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_PROFILE_KEY);
  localStorage.removeItem(TEST_HISTORY_KEY);
}

// --- Test History ---

export const getTestHistory = (): TestAttempt[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(TEST_HISTORY_KEY);
  return decode<TestAttempt[]>(data) || [];
};

export const addTestAttempt = (attempt: TestAttempt): void => {
  if (typeof window === 'undefined') return;
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
        (attempt) => !attempt.isPractice && attempt.validityReport.status === 'High'
    );

    if (validAttempts.length === 0) return null;

    return validAttempts.reduce((best, current) =>
        current.iqScore > best.iqScore ? current : best
    );
};
