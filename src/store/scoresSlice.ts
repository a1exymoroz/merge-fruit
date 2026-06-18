import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getLeaderboard, type LeaderboardEntry } from '../services/leaderboardApi';

export const fetchScores = createAsyncThunk('scores/fetchScores', getLeaderboard);

interface ScoresState {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoresState = {
  entries: [],
  loading: false,
  error: null,
};

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    updateEntries: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.entries = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load scores';
      });
  },
});

export const { updateEntries } = scoresSlice.actions;
export default scoresSlice.reducer;
