import { useTranslation } from 'react-i18next';
import NextFruitDisplay from './NextFruitDisplay';
import { type FruitType } from '../../constants/gameConstants';
import './GameInfo.css';

interface GameInfoProps {
  nextFruit: FruitType | null;
  onReset: () => void;
}

function GameInfo({ nextFruit, onReset }: GameInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="game-info">
      <NextFruitDisplay nextFruit={nextFruit} />
      <button className="reset-button" onClick={onReset}>
        {t('game.resetGame')}
      </button>
    </div>
  );
}

export default GameInfo;
