export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const HEALTH_URL = `${API_BASE_URL}/actuator/health`;
export const AUTH_API_URL = `${API_BASE_URL}/api/auth`;
export const SCORES_API_URL = `${API_BASE_URL}/api/scores`;
