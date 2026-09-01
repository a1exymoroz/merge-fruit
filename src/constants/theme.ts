import type { GameTheme } from '../utils/themeStorage';

/**
 * Per-skin values the game screen needs at the component level: the glass
 * colours passed to the decorative <GlassBox> SVG and the flags that drive
 * conditional rendering. Page-level colours (background gradient, HUD cards,
 * text) live in CSS — see src/index.css `[data-theme]` blocks. Mirrors
 * Android's GameThemeSpec.
 */
export interface GameThemeSpec {
  /** Interior glass colour of the jar. */
  containerBackground: string;
  /** Near-edge tint of the jar. */
  containerBorder: string;
  /** Fruits wear a Santa hat. */
  wearHats: boolean;
  /** Full-screen drifting snow behind the game. */
  showSnow: boolean;
  /** Candy cane above the jar. */
  showCandyCane: boolean;
}

export const THEME_SPECS: Record<GameTheme, GameThemeSpec> = {
  classic: {
    containerBackground: '#E8F4F8',
    containerBorder: '#CFE4EE',
    wearHats: false,
    showSnow: false,
    showCandyCane: false,
  },
  winter: {
    containerBackground: '#EAF6FD',
    containerBorder: '#B3D9F2',
    wearHats: true,
    showSnow: true,
    showCandyCane: true,
  },
};

export type { GameTheme };
