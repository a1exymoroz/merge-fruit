import React from 'react'
import './GameOverOverlay.css'

interface GameOverOverlayProps {
  score: number
  highScore: number
  onPlayAgain: () => void
}

function GameOverOverlay({ score, highScore, onPlayAgain }: GameOverOverlayProps) {
  const isNewHighScore = score === highScore && score > 0

  return (
    <div className="game-over-overlay">
      <div className="game-over">
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        {isNewHighScore && (
          <p className="new-high-score">🎉 New High Score! 🎉</p>
        )}
        <button onClick={onPlayAgain}>Play Again</button>
      </div>
    </div>
  )
}

export default GameOverOverlay

