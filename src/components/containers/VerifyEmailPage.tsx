import { useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyEmail } from '../../services/authApi';
import { useAuth } from '../../contexts/AuthContext';
import { translateError } from '../../i18n/translateError';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import '../ui/AuthForm.css';
import './VerifyEmailPage.css';

const CODE_LENGTH = 4;

function VerifyEmailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessageKey = (location.state as { messageKey?: string } | null)?.messageKey;
  const { markEmailVerified } = useAuth();
  const { token: routeToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const token = routeToken ?? searchParams.get('token') ?? '';

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const code = digits.join('');
  const canSubmit = token.length > 0 && code.length === CODE_LENGTH && !submitting;

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) {
      return;
    }

    const next = Array(CODE_LENGTH).fill('');
    pasted.split('').forEach((digit, index) => {
      next[index] = digit;
    });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH) - 1]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await verifyEmail(token, code);
      markEmailVerified();
      setVerified(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(translateError(t, message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <LanguageSwitcher theme="dark" className="language-switcher--auth" />
          <h1>{t('common.appTitle')}</h1>
          <p className="auth-subtitle">{t('auth.verifyEmail')}</p>
          <p className="verify-hint">
            {redirectMessageKey ? t(redirectMessageKey) : t('auth.openVerificationLink')}
          </p>
          <p className="auth-footer">
            <Link to="/login">{t('auth.backToSignIn')}</Link>
          </p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <LanguageSwitcher theme="dark" className="language-switcher--auth" />
          <h1>{t('common.appTitle')}</h1>
          <p className="auth-subtitle">{t('auth.emailVerified')}</p>
          <p className="verify-success">{t('auth.emailVerifiedMessage')}</p>
          <button type="button" className="auth-submit" onClick={() => navigate('/', { replace: true })}>
            {t('auth.continueToGame')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
          <LanguageSwitcher theme="dark" className="language-switcher--auth" />
        <h1>{t('common.appTitle')}</h1>
        <p className="auth-subtitle">{t('auth.verifyEmail')}</p>
        {redirectMessageKey && <p className="verify-hint">{t(redirectMessageKey)}</p>}
        {!redirectMessageKey && <p className="verify-hint">{t('auth.enterCode')}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="verify-code-inputs">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleDigitChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                disabled={submitting}
                aria-label={t('auth.digitLabel', { number: index + 1 })}
                className="verify-code-digit"
              />
            ))}
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {submitting ? t('auth.verifying') : t('auth.verifyEmailButton')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
