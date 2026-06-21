import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './GameHeader.css';
import '../containers/VerifyEmailPage.css';

interface GameHeaderProps {
  score: number;
  highScore: number;
}

function GameHeader({ score, highScore }: GameHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="game-header">
      {!user?.emailVerified && user?.verificationToken && (
        <div className="verify-banner">
          <span>Please verify your email to secure your account.</span>
          <Link to={`/verify?token=${user.verificationToken}`}>Verify</Link>
        </div>
      )}
      <div className="auth-user-bar">
        <span>Hi, {user?.displayName}</span>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <h1>🍎 Fruit Merge 🍎</h1>
      <div className="scores">
        <div className="score">Score: {score}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
    </div>
  );
}

export default GameHeader;
