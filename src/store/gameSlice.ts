import { createSlice } from '@reduxjs/toolkit';

// TODO (learning exercise): move game state from MergeFruitGame into Redux.
//
// Suggested steps:
// 1. Add `score`, `gameOver`, and `nextFruit` to initialState below
// 2. Create reducers: setScore, setGameOver, resetGame, setNextFruit
// 3. Register this reducer in store.ts (uncomment the game reducer line)
// 4. Replace useState calls in MergeFruitGame with useAppSelector / useAppDispatch
//
// Tip: keep physics refs (engineRef, fruitsRef) in the component — only UI state belongs in Redux.

interface GameState {
  // score: number
  // gameOver: boolean
}

const initialState: GameState = {};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // TODO (learning): implement your reducers here
  },
});

// export const { } = gameSlice.actions
export default gameSlice.reducer;
