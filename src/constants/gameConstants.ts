export interface FruitType {
  id: number
  name: string
  emoji: string
  points: number
  radius: number
}

export const FRUIT_TYPES: FruitType[] = [
  { id: 1, name: 'Cherry', emoji: '🍒', points: 10, radius: 12 },        // Smallest
  { id: 2, name: 'Strawberry', emoji: '🍓', points: 20, radius: 16 },
  { id: 3, name: 'Grape', emoji: '🍇', points: 50, radius: 20 },
  { id: 4, name: 'Dekopon', emoji: '🍊', points: 100, radius: 26 },
  { id: 5, name: 'Persimmon', emoji: '🍅', points: 200, radius: 32 },
  { id: 6, name: 'Apple', emoji: '🍎', points: 500, radius: 40 },
  { id: 7, name: 'Pear', emoji: '🍐', points: 1000, radius: 48 },
  { id: 8, name: 'Pineapple', emoji: '🍍', points: 2000, radius: 58 },
  { id: 9, name: 'Melon', emoji: '🍈', points: 5000, radius: 70 },
  { id: 10, name: 'Coconut', emoji: '🥥', points: 10000, radius: 84 },
  { id: 11, name: 'Watermelon', emoji: '🍉', points: 20000, radius: 100 }, // Largest
]

export const CONTAINER_WIDTH = 400
export const CONTAINER_HEIGHT = 600
export const GAME_OVER_LINE_Y = 100
export const DROP_X = CONTAINER_WIDTH / 2
export const DROP_Y = 50
export const CONTAINER_THICKNESS = 20
export const GAME_OVER_DELAY = 2000 // 2 seconds
export const UPDATE_INTERVAL = 16 // ~60fps

