import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { getLeaderboard, type LeaderboardEntry } from '../../services/leaderboardApi'
import './Leaderboard.css'

export interface LeaderboardRef {
  refresh: () => void
}

const Leaderboard = forwardRef<LeaderboardRef>(function Leaderboard(_, ref) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    refresh: loadLeaderboard
  }))

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getLeaderboard()
      setEntries(data)
    } catch {
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="leaderboard">
        <h3>🏆 Top 10</h3>
        <p className="leaderboard-loading">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h3>🏆 Top 10</h3>
        <p className="leaderboard-error">{error}</p>
        <button onClick={loadLeaderboard} className="retry-button">Retry</button>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <h3>🏆 Top 10</h3>
      {entries.length === 0 ? (
        <p className="leaderboard-empty">No scores yet. Be the first!</p>
      ) : (
        <ol className="leaderboard-list">
          {entries.map((entry, index) => (
            <li key={`${entry.name}-${entry.timestamp}`} className="leaderboard-entry">
              <span className="rank">{index + 1}.</span>
              <span className="name">{entry.name}</span>
              <span className="score">{entry.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
})

export default Leaderboard
