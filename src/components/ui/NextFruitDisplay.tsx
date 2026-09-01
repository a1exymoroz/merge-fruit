import { useTranslation } from 'react-i18next';
import Fruit from './Fruit';
import { type FruitType } from '../../constants/gameConstants';
import './NextFruitDisplay.css';

interface NextFruitDisplayProps {
  nextFruit: FruitType | null;
  wearHat?: boolean;
}

function NextFruitDisplay({ nextFruit, wearHat }: NextFruitDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="next-fruit-container">
      <p>{t('game.nextFruit')}</p>
      <div className="next-fruit">
        {nextFruit && <Fruit fruit={nextFruit} size={44} wearHat={wearHat} />}
      </div>
    </div>
  );
}

export default NextFruitDisplay;
