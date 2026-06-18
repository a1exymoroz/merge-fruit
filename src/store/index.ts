export { store } from './store';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';
export { fetchScores, updateEntries } from './scoresSlice';
export {
  selectLeaderboardEntries,
  selectScoresLoading,
  selectScoresError,
  selectHighScore,
} from './selectors';
