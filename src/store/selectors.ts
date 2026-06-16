import { getHighScoreFromEntries } from '../services/leaderboardApi'
import type { RootState } from './store'

export const selectLeaderboardEntries = (state: RootState) => state.scores.entries
export const selectScoresLoading = (state: RootState) => state.scores.loading
export const selectScoresError = (state: RootState) => state.scores.error

export const selectHighScore = (state: RootState): number => {
  const entries = selectLeaderboardEntries(state)
  return getHighScoreFromEntries(entries);
}
