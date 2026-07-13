import Keycloak from 'keycloak-js';
import { KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL } from '../config/api';

export const keycloak = new Keycloak({
  url: KEYCLOAK_URL,
  realm: KEYCLOAK_REALM,
  clientId: KEYCLOAK_CLIENT_ID,
});

let initPromise: Promise<boolean> | null = null;

/** Keycloak can only be initialized once; cache the promise so StrictMode's double-invoked effect is a no-op. */
export function initKeycloak(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false });
  }

  return initPromise;
}

/** Refreshes the token if it's within 30s of expiry, then returns a bearer header. */
export async function getAuthHeader(): Promise<Record<string, string>> {
  await keycloak.updateToken(30);
  return keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {};
}
