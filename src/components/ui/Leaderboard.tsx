import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchScores, useAppDispatch, useAppSelector } from '../../store';
import { translateError } from '../../i18n/translateError';
import {
  selectLeaderboardEntries,
  selectScoresError,
  selectScoresLoading,
} from '../../store/selectors';
import './Leaderboard.css';

export interface LeaderboardRef {
  refresh: () => void;
}

const Leaderboard = forwardRef<LeaderboardRef>(function Leaderboard(_, ref) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const entries = useAppSelector(selectLeaderboardEntries);
  const loading = useAppSelector(selectScoresLoading);
  const error = useAppSelector(selectScoresError);

  const loadLeaderboard = () => {
    dispatch(fetchScores());
  };

  useImperativeHandle(ref, () => ({
    refresh: loadLeaderboard,
  }));

  useEffect(() => {
    loadLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="leaderboard">
        <h3>{t('leaderboard.title')}</h3>
        <p className="leaderboard-loading">{t('leaderboard.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <h3>{t('leaderboard.title')}</h3>
        <p className="leaderboard-error">{translateError(t, error)}</p>
        <button onClick={loadLeaderboard} className="retry-button">
          {t('leaderboard.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <h3>{t('leaderboard.title')}</h3>
      {entries.length === 0 ? (
        <p className="leaderboard-empty">{t('leaderboard.empty')}</p>
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
  );
});

export default Leaderboard;
