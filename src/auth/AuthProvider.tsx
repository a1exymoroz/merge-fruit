import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { initKeycloak, keycloak } from './keycloak';

interface AuthUser {
  displayName: string;
  email?: string;
}

interface AuthContextValue {
  authenticated: boolean;
  user: AuthUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUser(): AuthUser | null {
  const claims = keycloak.tokenParsed;
  if (!claims) {
    return null;
  }

  return {
    displayName: claims.name ?? claims.preferred_username ?? claims.email ?? 'Player',
    email: claims.email,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initKeycloak()
      .then(setAuthenticated)
      .finally(() => setInitialized(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated,
      user: authenticated ? readUser() : null,
      logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    }),
    [authenticated],
  );

  if (!initialized) {
    return <div className="auth-loading">{t('common.loading')}</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
