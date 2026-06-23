import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './GlobalTechStackLink.css';

function GlobalTechStackLink() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isOnStackPage = pathname === '/stack';

  if (isOnStackPage) {
    return null;
  }

  return (
    <Link to="/stack" className="global-tech-stack-link">
      {t('stack.link')}
    </Link>
  );
}

export default GlobalTechStackLink;
