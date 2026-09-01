import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector, selectTheme, toggleTheme } from '../../store';
import './ThemeSwitcher.css';

/**
 * HUD toggle between the Classic and Winter skins. The choice is persisted to
 * localStorage by the theme slice. Mirrors the Android port's ThemeSwitcher.
 */
function ThemeSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const winter = theme === 'winter';

  return (
    <button
      type="button"
      className={['theme-switcher', winter ? 'theme-switcher--winter' : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={() => dispatch(toggleTheme())}
      aria-label={t('theme.label')}
      aria-pressed={winter}
    >
      <span aria-hidden="true">{winter ? '❄️' : '🎄'}</span>
      <span className="theme-switcher-label">
        {winter ? t('theme.winter') : t('theme.classic')}
      </span>
    </button>
  );
}

export default ThemeSwitcher;
