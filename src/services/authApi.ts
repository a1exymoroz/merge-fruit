import { AUTH_API_URL } from '../config/api';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  email: string;
  displayName: string;
  role: string;
  emailVerified?: boolean;
  verificationToken?: string;
}

interface ErrorResponse {
  message?: string;
  error?: string;
  verificationToken?: string;
}

export class AuthApiError extends Error {
  status: number;
  verificationToken?: string;

  constructor(message: string, status: number, verificationToken?: string) {
    super(message);
    this.name = 'AuthApiError';
    this.status = status;
    this.verificationToken = verificationToken;
  }
}

async function parseAuthResponse(response: Response): Promise<AuthResponse> {
  if (!response.ok) {
    let message = 'Authentication failed';
    let verificationToken: string | undefined;
    try {
      const error = (await response.json()) as ErrorResponse;
      message = error.message || error.error || message;
      verificationToken = error.verificationToken;
    } catch {
      // Use default message when response body is not JSON.
    }
    throw new AuthApiError(message, response.status, verificationToken);
  }

  return response.json() as Promise<AuthResponse>;
}

export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  });

  return parseAuthResponse(response);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return parseAuthResponse(response);
}

export async function verifyEmail(token: string, code: string): Promise<void> {
  const params = new URLSearchParams({ token, code });
  const response = await fetch(`${AUTH_API_URL}/verify?${params.toString()}`);

  if (!response.ok) {
    let message = 'Email verification failed';
    try {
      const error = (await response.json()) as ErrorResponse;
      message = error.message || error.error || message;
    } catch {
      // Use default message when response body is not JSON.
    }
    throw new Error(message);
  }
}
