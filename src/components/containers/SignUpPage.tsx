import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { translateError } from '../../i18n/translateError';
import { getVerifyEmailPath } from '../../utils/verifyEmailPath';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import '../ui/AuthForm.css';

function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const user = await signUp(email.trim(), password, displayName.trim());

      if (!user.emailVerified && user.verificationToken) {
        navigate(getVerifyEmailPath(user.verificationToken), { replace: true });
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(translateError(t, message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <LanguageSwitcher theme="dark" className="language-switcher--auth" />
        <h1>{t('common.appTitle')}</h1>
        <p className="auth-subtitle">{t('auth.createAccount')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="displayName">{t('auth.displayName')}</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder={t('auth.displayNamePlaceholder')}
              autoComplete="nickname"
              minLength={2}
              maxLength={50}
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">{t('common.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('common.emailPlaceholder')}
              autoComplete="email"
              required
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">{t('common.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('common.passwordPlaceholder')}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? t('auth.creatingAccount') : t('auth.signUp')}
          </button>
        </form>

        <p className="auth-footer">
          <Trans i18nKey="auth.hasAccount" components={{ loginLink: <Link to="/login" /> }} />
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
