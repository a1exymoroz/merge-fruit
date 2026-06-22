import { Trans, useTranslation } from 'react-i18next';
import './Instructions.css';

function Instructions() {
  const { t } = useTranslation();

  return (
    <div className="instructions">
      <h3>{t('instructions.title')}</h3>
      <ul>
        <li>
          <Trans i18nKey="instructions.desktop" components={{ strong: <strong /> }} />
        </li>
        <li>
          <Trans i18nKey="instructions.mobile" components={{ strong: <strong /> }} />
        </li>
        <li>{t('instructions.merge')}</li>
        <li>{t('instructions.chain')}</li>
        <li>{t('instructions.physics')}</li>
        <li>{t('instructions.gameOverRule')}</li>
        <li>{t('instructions.goal')}</li>
      </ul>
    </div>
  );
}

export default Instructions;
