import Matter from 'matter-js'
import { FRUIT_TYPES, DROP_X, DROP_Y, type FruitType } from '../constants/gameConstants'

export const generateNextFruit = (): FruitType => {
  // Only spawn first 3-5 fruits initially (Cherry, Strawberry, Grape, sometimes Dekopon)
  const spawnableFruits = FRUIT_TYPES.slice(0, Math.random() < 0.8 ? 3 : 4)
  return spawnableFruits[Math.floor(Math.random() * spawnableFruits.length)]
}

export const createFruitBody = (fruitType: FruitType, x: number, y: number, engine: Matter.Engine) => {
  const body = Matter.Bodies.circle(x, y, fruitType.radius, {
    restitution: 0.3,
    friction: 0.5,
    density: 0.001,
  })

  const uniqueId = Date.now() + Math.random()
  Matter.World.add(engine.world, body)
  
  return { body, uniqueId }
}

export const getDropPosition = (): { x: number; y: number } => {
  // Add slight random horizontal offset
  const offsetX = (Math.random() - 0.5) * 40
  return { x: DROP_X + offsetX, y: DROP_Y }
}

