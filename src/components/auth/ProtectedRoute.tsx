import { useAuth } from '../../auth/AuthProvider';
import { keycloak } from '../../auth/keycloak';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authenticated } = useAuth();

  if (!authenticated) {
    keycloak.login();
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
