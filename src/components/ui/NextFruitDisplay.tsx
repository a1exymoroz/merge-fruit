import React from 'react'
import Fruit from './Fruit'
import { type FruitType } from '../../constants/gameConstants'
import './NextFruitDisplay.css'

interface NextFruitDisplayProps {
  nextFruit: FruitType | null
}

function NextFruitDisplay({ nextFruit }: NextFruitDisplayProps) {
  if (!nextFruit) return null

  return (
    <div className="next-fruit-container">
      <p>Next Fruit:</p>
      <div className="next-fruit">
        <Fruit fruit={nextFruit} size={60} />
      </div>
    </div>
  )
}

export default NextFruitDisplay

