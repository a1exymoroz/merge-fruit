import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { BOOSTER_START_COUNT, type FruitType } from '../constants/gameConstants';

/**
 * UI-side game state that isn't tied to the physics engine: the queued next
 * fruit, the four boosters and their charges, and the largest fruit reached
 * this run (drives the evolution progress bar). The Matter.js engine + body
 * map stay in MergeFruitGame / useGamePhysics.
 *
 * Boosters mirror the Android port (GameViewModel): 💣 Bomb and ⬆️ Upgrade are
 * "armed" then applied to a tapped fruit; 🔄 Swap replaces the next fruit; 📦
 * Hold stashes / retrieves it. Each starts with BOOSTER_START_COUNT charges and
 * resets on a new game.
 */
export type TargetBooster = 'bomb' | 'upgrade';

interface GameState {
  nextFruit: FruitType | null;
  heldFruit: FruitType | null;
  bombs: number;
  upgrades: number;
  swaps: number;
  holds: number;
  /** Non-null while the player is choosing a fruit to bomb / upgrade. */
  armedBooster: TargetBooster | null;
  /** Highest fruit id created so far this run. */
  largestFruitId: number;
}

const freshBoosters = () => ({
  bombs: BOOSTER_START_COUNT,
  upgrades: BOOSTER_START_COUNT,
  swaps: BOOSTER_START_COUNT,
  holds: BOOSTER_START_COUNT,
  heldFruit: null,
  armedBooster: null,
  largestFruitId: 1,
});

const initialState: GameState = {
  nextFruit: null,
  ...freshBoosters(),
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    /** Set the queued next fruit (caller supplies the random pick). */
    setNextFruit: (state, action: PayloadAction<FruitType>) => {
      state.nextFruit = action.payload;
    },

    /** Arm a target booster, or disarm it if it was already armed. */
    armBooster: (state, action: PayloadAction<TargetBooster>) => {
      const booster = action.payload;
      const charges = booster === 'bomb' ? state.bombs : state.upgrades;
      if (charges <= 0) return;
      state.armedBooster = state.armedBooster === booster ? null : booster;
    },

    disarmBooster: (state) => {
      state.armedBooster = null;
    },

    /** Consume a charge of the armed booster and disarm it (call only on a hit). */
    consumeArmedBooster: (state) => {
      if (state.armedBooster === 'bomb') state.bombs = Math.max(0, state.bombs - 1);
      else if (state.armedBooster === 'upgrade') state.upgrades = Math.max(0, state.upgrades - 1);
      state.armedBooster = null;
    },

    /** Swap booster: replace the queued next fruit with a fresh one. */
    swapNextFruit: (state, action: PayloadAction<FruitType>) => {
      if (state.swaps <= 0) return;
      state.nextFruit = action.payload;
      state.swaps -= 1;
    },

    /** Hold booster: stash the queued fruit, or bring the stashed one back. */
    holdNextFruit: (state, action: PayloadAction<FruitType>) => {
      if (state.holds <= 0 || !state.nextFruit) return;
      const outgoing = state.nextFruit;
      state.nextFruit = state.heldFruit ?? action.payload;
      state.heldFruit = outgoing;
      state.holds -= 1;
    },

    /** Grow the largest-fruit marker (progress bar). */
    reportLargestFruit: (state, action: PayloadAction<number>) => {
      if (action.payload > state.largestFruitId) state.largestFruitId = action.payload;
    },

    /** New game: fresh boosters + a fresh next fruit. */
    resetGame: (state, action: PayloadAction<FruitType>) => {
      Object.assign(state, freshBoosters());
      state.nextFruit = action.payload;
    },
  },
});

export const {
  setNextFruit,
  armBooster,
  disarmBooster,
  consumeArmedBooster,
  swapNextFruit,
  holdNextFruit,
  reportLargestFruit,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
