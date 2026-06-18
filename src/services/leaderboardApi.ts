import { SCORES_API_URL } from '../config/api';
import { getAuthHeaders } from '../utils/authStorage';

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: string;
}

export interface SubmitScoreResponse {
  success: boolean;
  rank: number;
  leaderboard: LeaderboardEntry[];
}

interface PaginatedScoresResponse {
  content: LeaderboardEntry[];
}

function normalizeLeaderboard(
  data: LeaderboardEntry[] | PaginatedScoresResponse,
): LeaderboardEntry[] {
  return Array.isArray(data) ? data : data.content;
}

/** API returns scores sorted descending — first entry is the highest score. */
export function getHighScoreFromEntries(entries: LeaderboardEntry[]): number {
  return entries[0]?.score ?? 0;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(SCORES_API_URL, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please sign in again.');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  const data = await response.json();
  return normalizeLeaderboard(data);
}

export async function submitScore(name: string, score: number): Promise<SubmitScoreResponse> {
  const response = await fetch(SCORES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name, score }),
  });

  if (response.status === 401) {
    throw new Error('Session expired. Please sign in again.');
  }

  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment.');
  }

  if (!response.ok) {
    throw new Error('Failed to submit score');
  }

  return response.json();
}
