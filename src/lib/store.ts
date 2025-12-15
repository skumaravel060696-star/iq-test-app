import type { UserProfile, TestAttempt } from './types';
import { v4 as uuidv4 } from 'uuid';

const USER_PROFILE_KEY = 'cogniassess_user_profile';
const TEST_HISTORY_KEY = 'cogniassess_test_history';

// NOTE: This is simple obfuscation (base64 encoding), not true encryption.
// Secure client-side encryption without a backend for key management is not feasible.
const encode = (data: any): string => {
  if (typeof window === 'undefined') return '';
  try {
    // btoa can fail on non-latin characters. encodeURIComponent handles this.
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  } catch (e) {
    console.error("Failed to encode data for localStorage", e);
    return '';
  }
};

const decode = <T>(encodedData: string | null): T | null => {
  if (typeof window === 'undefined' || !encodedData) return null;
  try {
    // atob can fail on non-latin characters. decodeURIComponent handles this.
    return JSON.parse(decodeURIComponent(escape(window.atob(encodedData)))) as T;
  } catch (e) {
    console.error("Failed to decode data from localStorage", e);
    
    // Clear corrupted data if possible
    try {
        if (encodedData) {
            const partiallyDecoded = window.atob(encodedData);
            if (partiallyDecoded.includes('email')) { // Heuristic for user profile
                 localStorage.removeItem(USER_PROFILE_KEY);
            }
            if (partiallyDecoded.includes('testId') || partiallyDecoded.includes('iqScore')) { // Heuristic for test history
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
  
  const validRankedAttempts = history.filter(
    (attempt) => attempt.validityReport.status === 'High' && !attempt.isPractice
  );

  if (validRankedAttempts.length > 0) {
      return validRankedAttempts.reduce((best, current) =>
        current.iqScore > best.iqScore ? current : best
      );
  }

  // If no valid ranked attempts, find the best valid practice attempt.
  const validPracticeAttempts = history.filter(
    (attempt) => attempt.validityReport.status === 'High' && attempt.isPractice
  );
  
  if (validPracticeAttempts.length > 0) {
      return validPracticeAttempts.reduce((best, current) =>
        current.iqScore > best.iqScore ? current : best
      );
  }
  
  // If no high-validity attempts at all, return null.
  return null;
};