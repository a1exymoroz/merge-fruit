import { configureStore } from '@reduxjs/toolkit';
import scoresReducer from './scoresSlice';
import gameReducer from './gameSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    scores: scoresReducer,
    game: gameReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
