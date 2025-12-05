import React from 'react'
import GameOverLine from './GameOverLine'
import { DropZone } from '../containers'
import GameContainer from './GameContainer'
import { type FruitRenderData } from '../../hooks/useGamePhysics'
import { type FruitType } from '../../constants/gameConstants'
import './GameContainerWrapper.css'
import { GAME_OVER_LINE_Y } from '../../constants/gameConstants'

interface GameContainerWrapperProps {
  fruits: FruitRenderData[]
  nextFruit: FruitType | null
  onDrop: (x: number) => void
}

function GameContainerWrapper({ fruits, nextFruit, onDrop }: GameContainerWrapperProps) {
  return (
    <div className="game-container-wrapper">
      <GameOverLine yPosition={GAME_OVER_LINE_Y} />
      <DropZone onDrop={onDrop} nextFruit={nextFruit} height={GAME_OVER_LINE_Y} />
      <GameContainer fruits={fruits} />
    </div>
  )
}

export default GameContainerWrapper

