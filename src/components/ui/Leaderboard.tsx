import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { fetchScores, useAppDispatch, useAppSelector } from '../../store'
import {
  selectLeaderboardEntries,
  selectScoresError,
  selectScoresLoading,
} from '../../store/selectors'
import './Leaderboard.css'

export interface LeaderboardRef {
  refresh: () => void
}

const Leaderboard = forwardRef<LeaderboardRef>(function Leaderboard(_, ref) {
  const dispatch = useAppDispatch()
  const entries = useAppSelector(selectLeaderboardEntries)
  const loading = useAppSelector(selectScoresLoading)
  const error = useAppSelector(selectScoresError)

  const loadLeaderboard = () => {
    dispatch(fetchScores())
  }

  useImperativeHandle(ref, () => ({
    refresh: loadLeaderboard,
  }))

  useEffect(() => {
    loadLeaderboard()
  }, [])

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
