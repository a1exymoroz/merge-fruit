import { useTranslation } from 'react-i18next';
import Fruit from './Fruit';
import { type FruitType } from '../../constants/gameConstants';
import './NextFruitDisplay.css';

interface NextFruitDisplayProps {
  nextFruit: FruitType | null;
}

function NextFruitDisplay({ nextFruit }: NextFruitDisplayProps) {
  const { t } = useTranslation();

  if (!nextFruit) return null;

  return (
    <div className="next-fruit-container">
      <p>{t('game.nextFruit')}</p>
      <div className="next-fruit">
        <Fruit fruit={nextFruit} size={60} />
      </div>
    </div>
  );
}

export default NextFruitDisplay;
