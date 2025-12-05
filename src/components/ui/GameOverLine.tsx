import React from 'react'
import './GameOverLine.css'

interface GameOverLineProps {
  yPosition: number
}

function GameOverLine({ yPosition }: GameOverLineProps) {
  return (
    <div className="game-over-line" style={{ top: `${yPosition}px` }}>
      <div className="line"></div>
      <span>Game Over Line</span>
    </div>
  )
}

export default GameOverLine

