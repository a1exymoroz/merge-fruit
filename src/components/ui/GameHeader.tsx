import React from 'react'
import './GameHeader.css'

interface GameHeaderProps {
  score: number
  highScore: number
}

function GameHeader({ score, highScore }: GameHeaderProps) {
  return (
    <div className="game-header">
      <h1>🍎 Fruit Merge 🍎</h1>
      <div className="scores">
        <div className="score">Score: {score}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
    </div>
  )
}

export default GameHeader

