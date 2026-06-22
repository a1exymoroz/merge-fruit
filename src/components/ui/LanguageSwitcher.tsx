import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n';
import './LanguageSwitcher.css';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'select' | 'pills';
}

const PILL_LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  pl: 'PL',
  ru: 'RU',
};

function LanguageSwitcher({ className, variant = 'select' }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as SupportedLanguage);
  };

  if (variant === 'pills') {
    return (
      <div
        className={['language-pills', className].filter(Boolean).join(' ')}
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

  return (
    <div className={['language-switcher', className].filter(Boolean).join(' ')}>
      <label htmlFor="language-select" className="language-switcher-label">
        {t('language.label')}
      </label>
      <select
        id="language-select"
        className="language-switcher-select"
        value={i18n.language}
        onChange={handleChange}
        aria-label={t('language.label')}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {t(`language.${lang}`)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;
