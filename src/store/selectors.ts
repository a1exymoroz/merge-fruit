import { getHighScoreFromEntries } from '../services/leaderboardApi';
import type { RootState } from './store';

export const selectLeaderboardEntries = (state: RootState) => state.scores.entries;
export const selectScoresLoading = (state: RootState) => state.scores.loading;
export const selectScoresError = (state: RootState) => state.scores.error;

export const selectHighScore = (state: RootState): number => {
  const entries = selectLeaderboardEntries(state);
  return getHighScoreFromEntries(entries);
};

export const selectNextFruit = (state: RootState) => state.game.nextFruit;
export const selectHeldFruit = (state: RootState) => state.game.heldFruit;
export const selectArmedBooster = (state: RootState) => state.game.armedBooster;
export const selectLargestFruitId = (state: RootState) => state.game.largestFruitId;
export const selectBombs = (state: RootState) => state.game.bombs;
export const selectUpgrades = (state: RootState) => state.game.upgrades;
export const selectSwaps = (state: RootState) => state.game.swaps;
export const selectHolds = (state: RootState) => state.game.holds;

export const selectTheme = (state: RootState) => state.theme.theme;
