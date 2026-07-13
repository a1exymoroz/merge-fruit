import type { TFunction } from 'i18next';

const API_ERROR_KEYS: Record<string, string> = {
  'Failed to fetch leaderboard': 'errors.failedToFetchLeaderboard',
  'Failed to load scores': 'errors.failedToLoadScores',
  'Failed to submit score': 'errors.failedToSubmitScore',
  'Session expired. Please sign in again.': 'errors.sessionExpired',
  'Too many requests. Please wait a moment.': 'errors.tooManyRequests',
};

export function translateError(t: TFunction, message: string): string {
  const key = API_ERROR_KEYS[message];
  return key ? t(key) : message;
}
