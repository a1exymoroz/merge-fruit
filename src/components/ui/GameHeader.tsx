import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import NextFruitDisplay from './NextFruitDisplay';
import { type FruitType } from '../../constants/gameConstants';
import './GameHeader.css';
import '../containers/VerifyEmailPage.css';

interface GameHeaderProps {
  score: number;
  highScore: number;
  nextFruit: FruitType | null;
  wearHats: boolean;
}

function GameHeader({ score, highScore, nextFruit, wearHats }: GameHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isGuest, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const userInitial = isGuest ? '?' : (user?.displayName?.charAt(0).toUpperCase() ?? '?');

  return (
    <div className="game-header">
      <div className="game-header-toolbar">
        <div className="game-header-user">
          <span className="user-avatar" aria-hidden="true">
            {userInitial}
          </span>
          <span className="user-greeting">
            {isGuest ? t('auth.guestGreeting') : t('auth.hi', { name: user?.displayName })}
          </span>
        </div>
        <div className="game-header-actions">
          <LanguageSwitcher />
          <ThemeSwitcher />
          {isGuest ? (
            <button type="button" className="logout-btn" onClick={() => navigate('/login')}>
              {t('auth.logIn')}
            </button>
          ) : (
            <button type="button" className="logout-btn" onClick={handleLogout}>
              {t('auth.logOut')}
            </button>
          )}
        </div>
      </div>

      {!user?.emailVerified && user?.verificationToken && (
        <div className="verify-banner">
          <span>{t('auth.verifyBanner')}</span>
          <Link to={`/verify?token=${user.verificationToken}`}>{t('auth.verify')}</Link>
        </div>
      )}

      <h1>{t('common.appTitleGame')}</h1>

      <div className="scores">
        <div className="stat-card stat-card--score">
          <span className="stat-card-label">{t('game.scoreShort')}</span>
          <span className="stat-card-value">{score.toLocaleString()}</span>
          {/* Full phrase kept for a11y / tests. */}
          <span className="visually-hidden score">{t('game.score', { score })}</span>
        </div>
        <div className="stat-card stat-card--high">
          <span className="stat-card-label" aria-hidden="true">
            🏆
          </span>
          <span className="stat-card-value">{highScore.toLocaleString()}</span>
          <span className="visually-hidden high-score">
            {t('game.highScore', { score: highScore })}
          </span>
        </div>
        <div className="stat-card stat-card--next">
          <NextFruitDisplay nextFruit={nextFruit} wearHat={wearHats} />
        </div>
      </div>
    </div>
  );
}

export default GameHeader;
