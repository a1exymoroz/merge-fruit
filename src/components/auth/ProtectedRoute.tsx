import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getVerifyEmailPath } from '../../utils/verifyEmailPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, isEmailVerified, isLoading } = useAuth();

  if (isLoading) {
    return <div className="auth-loading">{t('common.loading')}</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isEmailVerified) {
    if (user?.verificationToken) {
      return <Navigate to={getVerifyEmailPath(user.verificationToken)} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
