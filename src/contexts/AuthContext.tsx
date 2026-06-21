import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { login as loginRequest, signUp as signUpRequest } from '../services/authApi';
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
  type StoredAuth,
} from '../utils/authStorage';

interface AuthContextValue {
  user: StoredAuth | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<StoredAuth>;
  signUp: (email: string, password: string, displayName: string) => Promise<StoredAuth>;
  markEmailVerified: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistAuthResponse(response: {
  accessToken: string;
  expiresInMs: number;
  email: string;
  displayName: string;
  role: string;
  emailVerified?: boolean;
  verificationToken?: string;
}): StoredAuth {
  const auth: StoredAuth = {
    accessToken: response.accessToken,
    expiresAt: Date.now() + response.expiresInMs,
    email: response.email,
    displayName: response.displayName,
    role: response.role,
    emailVerified: response.emailVerified ?? !response.verificationToken,
    verificationToken: response.verificationToken,
  };

  setStoredAuth(auth);
  return auth;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredAuth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredAuth());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    const auth = persistAuthResponse(response);
    setUser(auth);
    return auth;
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const response = await signUpRequest(email, password, displayName);
    const auth = persistAuthResponse(response);
    setUser(auth);
    return auth;
  }, []);

  const markEmailVerified = useCallback(() => {
    setUser((current) => {
      if (!current) {
        return current;
      }

      const updated: StoredAuth = {
        ...current,
        emailVerified: true,
        verificationToken: undefined,
      };
      setStoredAuth(updated);
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isEmailVerified: user?.emailVerified ?? false,
      isLoading,
      login,
      signUp,
      markEmailVerified,
      logout,
    }),
    [user, isLoading, login, signUp, markEmailVerified, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
