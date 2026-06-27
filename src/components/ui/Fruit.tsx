import React from 'react';
import { type FruitType } from '../../constants/gameConstants';
import FruitSprite from './FruitSprite';
import './Fruit.css';

interface FruitProps {
  fruit: FruitType;
  x?: number;
  y?: number;
  angle?: number;
  size?: number;
}

function Fruit({ fruit, x, y, angle, size }: FruitProps) {
  if (!fruit) return null;

  const displaySize = size || fruit.radius * 2;
  const style: React.CSSProperties = {
    width: `${displaySize}px`,
    height: `${displaySize}px`,
    position: x !== undefined && y !== undefined ? 'absolute' : 'relative',
    left: x !== undefined ? `${x - fruit.radius}px` : 'auto',
    top: y !== undefined ? `${y - fruit.radius}px` : 'auto',
    transform: angle !== undefined ? `rotate(${angle * (180 / Math.PI)}deg)` : 'none',
    pointerEvents: 'none',
  };

  return (
    <div
      className={`fruit fruit-${fruit.id}`}
      style={style}
      data-fruit-id={fruit.id}
      data-fruit-name={fruit.name}
    >
      <FruitSprite fruit={fruit} size={displaySize} />
    </div>
  );
}

export default Fruit;
