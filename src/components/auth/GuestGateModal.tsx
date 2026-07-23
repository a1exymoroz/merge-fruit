import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import '../ui/AuthForm.css';
import './GuestGateModal.css';

function GuestGateModal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-card" role="dialog" aria-modal="true" aria-labelledby="guest-gate-title">
        <LanguageSwitcher theme="dark" className="language-switcher--auth" />
        <h1 id="guest-gate-title">{t('common.appTitle')}</h1>
        <p className="auth-subtitle">{t('auth.welcomeSubtitle')}</p>

        <button type="button" className="guest-gate-guest-btn" onClick={continueAsGuest}>
          {t('auth.continueAsGuest')}
        </button>

        <div className="guest-gate-divider">
          <span>{t('auth.or')}</span>
        </div>

        <button type="button" className="guest-gate-login-btn" onClick={() => navigate('/login')}>
          {t('auth.signIn')}
        </button>

        <p className="auth-footer">
          <Trans i18nKey="auth.noAccount" components={{ signupLink: <Link to="/signup" /> }} />
        </p>

        <p className="guest-gate-note">{t('auth.guestNote')}</p>
      </div>
    </div>
  );
}

export default GuestGateModal;
