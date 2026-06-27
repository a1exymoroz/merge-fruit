import { type FruitType } from '../../constants/gameConstants';
import { renderFruitArt } from '../../constants/fruitArt';

interface FruitSpriteProps {
  fruit: FruitType;
  size: number;
}

function FruitSprite({ fruit, size }: FruitSpriteProps) {
  if (fruit.image) {
    return (
      <img
        src={fruit.image}
        alt={fruit.name}
        className="fruit-image"
        width={size}
        height={size}
        draggable={false}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="fruit-sprite"
      aria-label={fruit.name}
      role="img"
    >
      {renderFruitArt(fruit.id)}
    </svg>
  );
}

export default FruitSprite;
