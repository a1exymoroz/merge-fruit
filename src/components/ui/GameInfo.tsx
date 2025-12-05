import React from 'react'
import NextFruitDisplay from './NextFruitDisplay'
import { type FruitType } from '../../constants/gameConstants'
import './GameInfo.css'

interface GameInfoProps {
  nextFruit: FruitType | null
  onReset: () => void
}

function GameInfo({ nextFruit, onReset }: GameInfoProps) {
  return (
    <div className="game-info">
      <NextFruitDisplay nextFruit={nextFruit} />
      <button className="reset-button" onClick={onReset}>
        Reset Game
      </button>
    </div>
  )
}

export default GameInfo

