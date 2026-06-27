export interface FruitType {
  id: number;
  name: string;
  points: number;
  radius: number;
  /** Optional custom asset path, e.g. '/fruits/cherry.svg' */
  image?: string;
}

export const FRUIT_TYPES: FruitType[] = [
  { id: 1, name: 'Blueberry', points: 10, radius: 12 }, // Smallest
  { id: 2, name: 'Cherry', points: 20, radius: 16 },
  { id: 3, name: 'Plum', points: 50, radius: 20 },
  { id: 4, name: 'Lemon', points: 100, radius: 26 },
  { id: 5, name: 'Kiwi', points: 200, radius: 32 },
  { id: 6, name: 'Orange', points: 500, radius: 40 },
  { id: 7, name: 'Apple', points: 1000, radius: 48 },
  { id: 8, name: 'Peach', points: 2000, radius: 58 },
  { id: 9, name: 'Coconut', points: 5000, radius: 70 },
  { id: 10, name: 'Melon', points: 10000, radius: 84 },
  { id: 11, name: 'Watermelon', points: 20000, radius: 100 }, // Largest
];

export const CONTAINER_WIDTH = 400;
export const CONTAINER_HEIGHT = 600;
export const GAME_OVER_LINE_Y = 100;
export const DROP_X = CONTAINER_WIDTH / 2;
export const DROP_Y = 50;
export const CONTAINER_THICKNESS = 20;
export const GAME_OVER_DELAY = 2000; // 2 seconds
export const UPDATE_INTERVAL = 16; // ~60fps
