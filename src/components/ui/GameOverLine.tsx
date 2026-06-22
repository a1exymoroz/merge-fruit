import { useTranslation } from 'react-i18next';
import './GameOverLine.css';

interface GameOverLineProps {
  yPosition: number;
}

function GameOverLine({ yPosition }: GameOverLineProps) {
  const { t } = useTranslation();

  return (
    <div className="game-over-line" style={{ top: `${yPosition}px` }}>
      <div className="line"></div>
      <span>{t('game.gameOverLine')}</span>
    </div>
  );
}

export default GameOverLine;
