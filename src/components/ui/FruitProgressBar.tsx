import Fruit from './Fruit';
import { FRUIT_TYPES } from '../../constants/gameConstants';
import './FruitProgressBar.css';

interface FruitProgressBarProps {
  /** Highest fruit id created this run. */
  largestFruitId: number;
  wearHats: boolean;
}

/**
 * The fruit evolution ladder: every fruit from Blueberry to Watermelon, with the
 * ones reached this run lit up. Mirrors the Android port's FruitProgressBar.
 */
function FruitProgressBar({ largestFruitId, wearHats }: FruitProgressBarProps) {
  return (
    <div className="fruit-progress-bar" aria-hidden="true">
      {FRUIT_TYPES.map((fruit) => {
        const reached = fruit.id <= largestFruitId;
        return (
          <div
            key={fruit.id}
            className={`fruit-progress-item${reached ? ' fruit-progress-item--reached' : ''}`}
          >
            <Fruit fruit={fruit} size={24} wearHat={wearHats} />
          </div>
        );
      })}
    </div>
  );
}

export default FruitProgressBar;
