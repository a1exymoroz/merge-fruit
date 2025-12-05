import React from 'react'
import Fruit from './Fruit'
import { type FruitRenderData } from '../../hooks/useGamePhysics'
import './GameContainer.css'
import { CONTAINER_WIDTH, CONTAINER_HEIGHT } from '../../constants/gameConstants'

interface GameContainerProps {
  fruits: FruitRenderData[]
}

function GameContainer({ fruits }: GameContainerProps) {
  return (
    <div 
      className="game-container"
      style={{ width: `${CONTAINER_WIDTH}px`, height: `${CONTAINER_HEIGHT}px` }}
    >
      {fruits.map((fruitData) => (
        <Fruit
          key={fruitData.uniqueId}
          fruit={fruitData.fruitType}
          x={fruitData.x}
          y={fruitData.y}
          angle={fruitData.angle}
        />
      ))}
    </div>
  )
}

export default GameContainer

