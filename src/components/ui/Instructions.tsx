import React from 'react'
import './Instructions.css'

function Instructions() {
  return (
    <div className="instructions">
      <h3>How to Play:</h3>
      <ul>
        <li><strong>Desktop:</strong> Move mouse to position fruit, click or press Space to drop</li>
        <li><strong>Mobile:</strong> Touch and drag to position, release to drop</li>
        <li>When 2 identical fruits touch, they instantly merge into the next larger fruit!</li>
        <li>Chain reactions occur when merged fruits touch more identical fruits</li>
        <li>Fruits roll, tip, and stack realistically - use physics to your advantage!</li>
        <li>Don't let fruits stack above the Game Over line for 2 seconds!</li>
        <li>Goal: Reach the Watermelon! 🍉</li>
      </ul>
    </div>
  )
}

export default Instructions

