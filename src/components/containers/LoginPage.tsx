import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { AuthApiError } from '../../services/authApi';
import { useAuth } from '../../contexts/AuthContext';
import { translateError } from '../../i18n/translateError';
import { getVerifyEmailPath } from '../../utils/verifyEmailPath';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import '../ui/AuthForm.css';

const EMAIL_NOT_VERIFIED_MESSAGE = 'Email not verified';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const user = await login(email.trim(), password);

      if (!user.emailVerified && user.verificationToken) {
        navigate(getVerifyEmailPath(user.verificationToken), { replace: true });
        return;
      }

      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof AuthApiError && err.status === 403 && err.message === EMAIL_NOT_VERIFIED_MESSAGE) {
        const verifyPath = err.verificationToken
          ? getVerifyEmailPath(err.verificationToken)
          : '/verify';
        navigate(verifyPath, {
          replace: true,
          state: { messageKey: 'auth.checkEmailMessage' },
        });
        return;
      }

      const message = err instanceof Error ? err.message : 'Login failed';
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
        <p className="auth-subtitle">{t('auth.signInToPlay')}</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="current-password"
              minLength={8}
              required
              disabled={submitting}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>

        <p className="auth-footer">
          <Trans i18nKey="auth.noAccount" components={{ signupLink: <Link to="/signup" /> }} />
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
