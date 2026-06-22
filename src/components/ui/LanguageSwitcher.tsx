import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
  theme?: 'light' | 'dark';
}

const PILL_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  pl: 'PL',
  ru: 'RU',
};

function LanguageSwitcher({ className, theme = 'light' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  return (
    <div
      className={['language-pills', `language-pills--${theme}`, className].filter(Boolean).join(' ')}
      role="group"
      aria-label={t('language.label')}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`language-pill${i18n.language === lang ? ' language-pill--active' : ''}`}
          onClick={() => void i18n.changeLanguage(lang)}
          aria-pressed={i18n.language === lang}
          aria-label={t(`language.${lang}`)}
        >
          {PILL_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
