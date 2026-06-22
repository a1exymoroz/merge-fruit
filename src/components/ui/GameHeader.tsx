import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import './GameHeader.css';
import '../containers/VerifyEmailPage.css';

interface GameHeaderProps {
  score: number;
  highScore: number;
}

function GameHeader({ score, highScore }: GameHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="game-header">
      <div className="game-header-toolbar">
        <div className="game-header-user">
          <span className="user-avatar" aria-hidden="true">
            {userInitial}
          </span>
          <span className="user-greeting">{t('auth.hi', { name: user?.displayName })}</span>
        </div>
        <div className="game-header-actions">
          <LanguageSwitcher variant="pills" />
          <button type="button" className="logout-btn" onClick={handleLogout}>
            {t('auth.logOut')}
          </button>
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
        <div className="score">{t('game.score', { score })}</div>
        <div className="high-score">{t('game.highScore', { score: highScore })}</div>
      </div>
    </div>
  );
}

export default GameHeader;
