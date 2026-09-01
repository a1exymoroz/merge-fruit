export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { fetchScores, updateEntries } from './scoresSlice';
export {
  setNextFruit,
  armBooster,
  disarmBooster,
  consumeArmedBooster,
  swapNextFruit,
  holdNextFruit,
  reportLargestFruit,
  resetGame,
  type TargetBooster,
} from './gameSlice';
export { setTheme, toggleTheme } from './themeSlice';
export {
  selectLeaderboardEntries,
  selectScoresLoading,
  selectScoresError,
  selectHighScore,
  selectNextFruit,
  selectHeldFruit,
  selectArmedBooster,
  selectLargestFruitId,
  selectBombs,
  selectUpgrades,
  selectSwaps,
  selectHolds,
  selectTheme,
} from './selectors';
