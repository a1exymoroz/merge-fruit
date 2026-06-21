import { useRef, useState, type KeyboardEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../../services/authApi';
import { useAuth } from '../../contexts/AuthContext';
import '../ui/AuthForm.css';
import './VerifyEmailPage.css';

const CODE_LENGTH = 4;

function VerifyEmailPage() {
  const navigate = useNavigate();
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
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>🍎 Fruit Merge</h1>
          <p className="auth-subtitle">Invalid verification link</p>
          <p className="auth-error">This link is missing a verification token.</p>
          <p className="auth-footer">
            <Link to="/login">Back to sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>🍎 Fruit Merge</h1>
          <p className="auth-subtitle">Email verified!</p>
          <p className="verify-success">Your email has been verified.</p>
          <button type="button" className="auth-submit" onClick={() => navigate('/', { replace: true })}>
            Continue to Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🍎 Fruit Merge</h1>
        <p className="auth-subtitle">Verify your email</p>
        <p className="verify-hint">Enter the 4-digit code from your email.</p>

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
                aria-label={`Digit ${index + 1}`}
                className="verify-code-digit"
              />
            ))}
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={!canSubmit}>
            {submitting ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
