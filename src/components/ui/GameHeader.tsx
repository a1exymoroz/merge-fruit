import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthProvider';
import LanguageSwitcher from './LanguageSwitcher';
import './GameHeader.css';

interface GameHeaderProps {
  score: number;
  highScore: number;
}

function GameHeader({ score, highScore }: GameHeaderProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

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
          <LanguageSwitcher />
          <button type="button" className="logout-btn" onClick={logout}>
            {t('auth.logOut')}
          </button>
        </div>
      </div>

      <h1>{t('common.appTitleGame')}</h1>
      <div className="scores">
        <div className="score">{t('game.score', { score })}</div>
        <div className="high-score">{t('game.highScore', { score: highScore })}</div>
      </div>
    </div>
  );
}

export default GameHeader;
