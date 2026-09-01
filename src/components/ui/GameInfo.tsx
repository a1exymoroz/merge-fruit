import { useTranslation } from 'react-i18next';
import './GameInfo.css';

interface GameInfoProps {
  onReset: () => void;
}

function GameInfo({ onReset }: GameInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="game-info">
      <button className="reset-button" onClick={onReset}>
        {t('game.resetGame')}
      </button>
    </div>
  );
}

export default GameInfo;
