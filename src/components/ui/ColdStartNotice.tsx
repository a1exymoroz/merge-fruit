import { useTranslation } from 'react-i18next';
import { useColdStart } from '../../hooks';
import './ColdStartNotice.css';

interface ColdStartNoticeProps {
  waiting?: boolean;
  className?: string;
}

function ColdStartNotice({ waiting = false, className = '' }: ColdStartNoticeProps) {
  const { t } = useTranslation();
  const isColdStart = useColdStart();

  if (!isColdStart) {
    return null;
  }

  return (
    <p
      className={`cold-start-notice ${waiting ? 'cold-start-notice--waiting' : ''} ${className}`.trim()}
      role="status"
    >
      {waiting ? t('common.coldStartWaiting') : t('common.coldStartNotice')}
    </p>
  );
}

export default ColdStartNotice;
