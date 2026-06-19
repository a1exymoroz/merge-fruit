import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submitScore } from '../../services/leaderboardApi';
import { selectLeaderboardEntries, updateEntries, useAppDispatch, useAppSelector } from '../../store';
import './GameOverOverlay.css';

interface GameOverOverlayProps {
  score: number;
  highScore: number;
  onPlayAgain: () => void;
}

function GameOverOverlay({ score, highScore, onPlayAgain }: GameOverOverlayProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const leaderboard = useAppSelector(selectLeaderboardEntries);
  const isNewHighScore = score > highScore && score > 0;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (submitting || score <= 0) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const result = await submitScore(score);
      setSubmitted(true);
      setRank(result.rank);
      dispatch(updateEntries(result.leaderboard));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over">
        <h2>Game Over!</h2>
        <p className="final-score">
          Final Score: <strong>{score.toLocaleString()}</strong>
        </p>
        {isNewHighScore && <p className="new-high-score">🎉 New High Score! 🎉</p>}

        {!submitted ? (
          <div className="submit-score-form">
            <p>Save your score as {user?.displayName}?</p>
            <button type="button" onClick={handleSubmit} disabled={submitting || score <= 0}>
              {submitting ? 'Saving...' : 'Save Score'}
            </button>
            {error && <p className="submit-error">{error}</p>}
          </div>
        ) : (
          <div className="score-submitted">
            {rank && rank <= 10 ? (
              <p className="rank-message">🏆 You ranked #{rank}!</p>
            ) : (
              <p className="rank-message">Score saved!</p>
            )}
            <div className="mini-leaderboard">
              <h4>🏆 Top 10</h4>
              <ol>
                {leaderboard.map((entry, index) => (
                  <li key={`${entry.name}-${entry.id ?? index}`}>
                    <span className="lb-name">{entry.name}</span>
                    <span className="lb-score">{entry.score.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <button onClick={onPlayAgain} className="play-again-btn">
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameOverOverlay;
