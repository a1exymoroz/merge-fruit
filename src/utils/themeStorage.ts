// Persists the selected game skin, following the same localStorage pattern as
// src/utils/authStorage.ts. Mirrors the Android SettingsStorage DataStore.

export type GameTheme = 'classic' | 'winter';

const STORAGE_KEY = 'mergeFruitTheme';

export const DEFAULT_THEME: GameTheme = 'classic';

export function getStoredTheme(): GameTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'winter' || raw === 'classic' ? raw : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function setStoredTheme(theme: GameTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore (private mode / storage disabled)
  }
}
