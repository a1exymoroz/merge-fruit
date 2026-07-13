export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const HEALTH_URL = `${API_BASE_URL}/actuator/health`;
export const SCORES_API_URL = `${API_BASE_URL}/api/scores`;

export const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081';
export const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'company';
export const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'merge-fruit';
