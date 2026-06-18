import { configureStore } from '@reduxjs/toolkit';
import scoresReducer from './scoresSlice';
// import gameReducer from './gameSlice' // TODO (learning): uncomment after implementing gameSlice

export const store = configureStore({
  reducer: {
    scores: scoresReducer,
    // game: gameReducer, // TODO (learning): uncomment after implementing gameSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
