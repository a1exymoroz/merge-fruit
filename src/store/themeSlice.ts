import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getStoredTheme, setStoredTheme, type GameTheme } from '../utils/themeStorage';

interface ThemeState {
  theme: GameTheme;
}

const initialState: ThemeState = {
  theme: getStoredTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<GameTheme>) => {
      state.theme = action.payload;
      setStoredTheme(action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'winter' ? 'classic' : 'winter';
      setStoredTheme(state.theme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
