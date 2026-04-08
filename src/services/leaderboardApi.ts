const API_URL = import.meta.env.VITE_API_URL || '/api/leaderboard'

export interface LeaderboardEntry {
  name: string
  score: number
  timestamp: string
}

export interface SubmitScoreResponse {
  success: boolean
  rank: number
  leaderboard: LeaderboardEntry[]
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard')
  }
  return response.json()
}

export async function submitScore(name: string, score: number): Promise<SubmitScoreResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, score }),
  })
  
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment.')
  }
  
  if (!response.ok) {
    throw new Error('Failed to submit score')
  }
  
  return response.json()
}
