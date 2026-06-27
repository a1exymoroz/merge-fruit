import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useDocumentTitle() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t('common.pageTitle');
  }, [t, i18n.language]);
}
