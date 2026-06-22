import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getVerifyEmailPath } from '../../utils/verifyEmailPath';

interface GuestRouteProps {
  children: React.ReactNode;
}

function GuestRoute({ children }: GuestRouteProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, isEmailVerified, isLoading } = useAuth();

  if (isLoading) {
    return <div className="auth-loading">{t('common.loading')}</div>;
  }

  if (isAuthenticated && isEmailVerified) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !isEmailVerified && user?.verificationToken) {
    return <Navigate to={getVerifyEmailPath(user.verificationToken)} replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;
