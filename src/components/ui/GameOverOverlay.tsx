import { useState } from 'react'
import { submitScore, type LeaderboardEntry } from '../../services/leaderboardApi'
import './GameOverOverlay.css'

interface GameOverOverlayProps {
  score: number
  highScore: number
  onPlayAgain: () => void
  onScoreSubmitted?: () => void
}

function GameOverOverlay({ score, highScore, onPlayAgain, onScoreSubmitted }: GameOverOverlayProps) {
  const isNewHighScore = score === highScore && score > 0
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      const result = await submitScore(name.trim(), score)
      setSubmitted(true)
      setRank(result.rank)
      setLeaderboard(result.leaderboard)
      onScoreSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit score')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="game-over-overlay">
      <div className="game-over">
        <h2>Game Over!</h2>
        <p className="final-score">Final Score: <strong>{score.toLocaleString()}</strong></p>
        {isNewHighScore && (
          <p className="new-high-score">🎉 New High Score! 🎉</p>
        )}
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className="submit-score-form">
            <p>Submit your score to the leaderboard:</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              disabled={submitting}
            />
            <button type="submit" disabled={!name.trim() || submitting}>
              {submitting ? 'Submitting...' : 'Submit Score'}
            </button>
            {error && <p className="submit-error">{error}</p>}
          </form>
        ) : (
          <div className="score-submitted">
            {rank && rank <= 10 ? (
              <p className="rank-message">🏆 You ranked #{rank}!</p>
            ) : (
              <p className="rank-message">Score submitted!</p>
            )}
            <div className="mini-leaderboard">
              <h4>🏆 Top 10</h4>
              <ol>
                {leaderboard.map((entry, index) => (
                  <li key={`${entry.name}-${index}`}>
                    <span className="lb-name">{entry.name}</span>
                    <span className="lb-score">{entry.score.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        
        <button onClick={onPlayAgain} className="play-again-btn">Play Again</button>
      </div>
    </div>
  )
}

export default GameOverOverlay

